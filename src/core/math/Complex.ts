/**
 * High-precision Complex Number class for optical physics calculations.
 *
 * Designed for:
 * - Phase factor calculations: e^(iφ)
 * - Fresnel coefficient computations (including TIR with imaginary angles)
 * - Jones/Mueller matrix operations
 *
 * Performance considerations:
 * - Methods return new instances (immutability for correctness)
 * - Static methods for common operations to reduce object creation
 * - Inline math operations where possible
 */

// Numerical tolerance for zero comparisons
const EPSILON = 1e-12;
const SQRT_EPSILON = 1e-6;

export class Complex {
  constructor(
    public readonly real: number,
    public readonly imag: number = 0
  ) {}

  // ========== Static Factories ==========

  /** Create from polar form: r * e^(iθ) = r(cos θ + i sin θ) */
  static fromPolar(magnitude: number, phase: number): Complex {
    return new Complex(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }

  /** Create complex exponential: e^(iθ) */
  static exp(theta: number): Complex {
    return new Complex(Math.cos(theta), Math.sin(theta));
  }

  /** Zero complex number */
  static readonly ZERO = new Complex(0, 0);

  /** One (real unit) */
  static readonly ONE = new Complex(1, 0);

  /** Imaginary unit i */
  static readonly I = new Complex(0, 1);

  // ========== Properties ==========

  /** Magnitude |z| = √(x² + y²) */
  get magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  /** Magnitude squared |z|² = x² + y² (faster, no sqrt) */
  get magnitudeSquared(): number {
    return this.real * this.real + this.imag * this.imag;
  }

  /** Phase angle arg(z) = atan2(y, x), in radians */
  get phase(): number {
    return Math.atan2(this.imag, this.real);
  }

  // ========== Arithmetic Operations ==========

  /** Addition: z₁ + z₂ */
  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  /** Subtraction: z₁ - z₂ */
  sub(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  /** Multiplication: z₁ × z₂ = (a+bi)(c+di) = (ac-bd) + (ad+bc)i */
  mul(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  /** Division: z₁ / z₂ */
  div(other: Complex): Complex {
    const denom = other.magnitudeSquared;
    if (denom < EPSILON) {
      // Handle division by near-zero: return a safe large value or zero
      // For physics, this typically means infinite impedance or zero transmission
      return Complex.ZERO;
    }
    return new Complex(
      (this.real * other.real + this.imag * other.imag) / denom,
      (this.imag * other.real - this.real * other.imag) / denom
    );
  }

  /** Scalar multiplication: z × k */
  scale(k: number): Complex {
    return new Complex(this.real * k, this.imag * k);
  }

  /** Complex conjugate: z* = x - iy */
  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  /** Negation: -z */
  negate(): Complex {
    return new Complex(-this.real, -this.imag);
  }

  // ========== Advanced Operations ==========

  /**
   * Complex exponential: e^z = e^x × (cos y + i sin y)
   * Essential for phase factors and wave propagation
   */
  exp(): Complex {
    const expReal = Math.exp(this.real);
    return new Complex(
      expReal * Math.cos(this.imag),
      expReal * Math.sin(this.imag)
    );
  }

  /**
   * Principal square root: √z
   * Uses the formula: √z = √|z| × e^(i×arg(z)/2)
   *
   * Critical for Fresnel equations with TIR (imaginary angles)
   */
  sqrt(): Complex {
    const mag = this.magnitude;
    if (mag < SQRT_EPSILON) {
      return Complex.ZERO;
    }
    const halfPhase = this.phase / 2;
    const sqrtMag = Math.sqrt(mag);
    return new Complex(
      sqrtMag * Math.cos(halfPhase),
      sqrtMag * Math.sin(halfPhase)
    );
  }

  /**
   * Natural logarithm: ln(z) = ln|z| + i×arg(z)
   * Returns principal value with arg(z) ∈ (-π, π]
   */
  log(): Complex {
    const mag = this.magnitude;
    if (mag < EPSILON) {
      // ln(0) is undefined, return a large negative real number
      return new Complex(-1e10, 0);
    }
    return new Complex(Math.log(mag), this.phase);
  }

  /**
   * Power: z^n for real n
   * Uses: z^n = |z|^n × e^(i×n×arg(z))
   */
  pow(n: number): Complex {
    const mag = this.magnitude;
    if (mag < SQRT_EPSILON) {
      return n > 0 ? Complex.ZERO : new Complex(Infinity, 0);
    }
    const newMag = Math.pow(mag, n);
    const newPhase = this.phase * n;
    return new Complex(
      newMag * Math.cos(newPhase),
      newMag * Math.sin(newPhase)
    );
  }

  /**
   * Complex power: z₁^z₂
   * Uses: z₁^z₂ = e^(z₂ × ln(z₁))
   */
  powComplex(exponent: Complex): Complex {
    if (this.isZero()) {
      return Complex.ZERO;
    }
    const logThis = this.log();
    const product = exponent.mul(logThis);
    return product.exp();
  }

  // ========== Comparison Operations ==========

  /**
   * Check if complex number is approximately zero
   * @param tolerance - Absolute tolerance for comparison (default: 1e-12)
   */
  isZero(tolerance: number = EPSILON): boolean {
    return Math.abs(this.real) < tolerance && Math.abs(this.imag) < tolerance;
  }

  /**
   * Check if approximately equal to another complex number
   * @param other - Complex number to compare with
   * @param tolerance - Absolute tolerance (default: 1e-12)
   */
  equals(other: Complex, tolerance: number = EPSILON): boolean {
    return (
      Math.abs(this.real - other.real) < tolerance &&
      Math.abs(this.imag - other.imag) < tolerance
    );
  }

  /**
   * Check if this is approximately a real number (no imaginary part)
   */
  isReal(tolerance: number = EPSILON): boolean {
    return Math.abs(this.imag) < tolerance;
  }

  /**
   * Check if this is approximately purely imaginary (no real part)
   */
  isImaginary(tolerance: number = EPSILON): boolean {
    return Math.abs(this.real) < tolerance;
  }

  // ========== Utility ==========

  /** Create a copy of this complex number */
  clone(): Complex {
    return new Complex(this.real, this.imag);
  }

  /** String representation for debugging */
  toString(precision: number = 4): string {
    const r = this.real.toFixed(precision);
    const i = Math.abs(this.imag).toFixed(precision);
    if (this.isZero()) return '0';
    if (this.isReal()) return r;
    if (this.isImaginary()) {
      return this.imag >= 0 ? `${i}i` : `-${i}i`;
    }
    return this.imag >= 0 ? `${r} + ${i}i` : `${r} - ${i}i`;
  }

  /** Convert to array [real, imag] for serialization */
  toArray(): [number, number] {
    return [this.real, this.imag];
  }

  /** Create from array [real, imag] */
  static fromArray(arr: [number, number]): Complex {
    return new Complex(arr[0], arr[1]);
  }
}

// ========== Utility Functions (for performance-critical paths) ==========

/**
 * Fast complex multiplication without object creation
 * Returns [real, imag] tuple
 */
export function complexMul(
  r1: number, i1: number,
  r2: number, i2: number
): [number, number] {
  return [
    r1 * r2 - i1 * i2,
    r1 * i2 + i1 * r2
  ];
}

/**
 * Fast complex addition without object creation
 */
export function complexAdd(
  r1: number, i1: number,
  r2: number, i2: number
): [number, number] {
  return [r1 + r2, i1 + i2];
}

/**
 * Fast magnitude squared calculation
 */
export function complexMagSq(r: number, i: number): number {
  return r * r + i * i;
}
