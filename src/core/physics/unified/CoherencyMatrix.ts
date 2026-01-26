/**
 * Coherency Matrix (电场相干矩阵) - The core state representation for polarized light.
 *
 * The Coherency Matrix J is defined as:
 *   J = ⟨E E†⟩ = ⟨|Ex|²⟩      ⟨Ex Ey*⟩
 *               ⟨Ey Ex*⟩      ⟨|Ey|²⟩
 *
 * Advantages over Jones vectors:
 * 1. Represents unpolarized light (J ∝ I)
 * 2. Represents partially polarized light (0 < DoP < 1)
 * 3. Handles depolarization naturally
 * 4. Maps directly to Stokes parameters
 *
 * Physical constraints:
 * - Hermitian: J = J† (diagonal elements real, off-diagonal conjugate pairs)
 * - Positive semi-definite: eigenvalues ≥ 0
 * - trace(J) = total intensity
 */

import { Complex } from '../../math/Complex';
import { Matrix2x2 } from '../../math/Matrix2x2';

// Numerical tolerances for physical quantities
const INTENSITY_EPSILON = 1e-10;  // Minimum detectable intensity
const PHYSICAL_TOLERANCE = 1e-8;  // For physical property checks

export class CoherencyMatrix {
  /** Internal 2×2 Hermitian matrix */
  private readonly matrix: Matrix2x2;

  private constructor(matrix: Matrix2x2) {
    this.matrix = matrix;
  }

  // ========== Static Factories ==========

  /**
   * Create from Jones vector (fully polarized light)
   * J = |E⟩⟨E| = E E†
   *
   * @param ex Complex amplitude in x-direction
   * @param ey Complex amplitude in y-direction
   */
  static fromJones(ex: Complex, ey: Complex): CoherencyMatrix {
    // J = [Ex][Ex* Ey*] = [|Ex|²    Ex Ey*]
    //     [Ey]           [Ey Ex*   |Ey|² ]
    const j00 = new Complex(ex.magnitudeSquared, 0);
    const j01 = ex.mul(ey.conjugate());
    const j11 = new Complex(ey.magnitudeSquared, 0);

    return new CoherencyMatrix(
      new Matrix2x2(j00, j01, j01.conjugate(), j11)
    );
  }

  /**
   * Create from Stokes parameters [S0, S1, S2, S3]
   *
   * Conversion:
   *   J00 = (S0 + S1) / 2
   *   J11 = (S0 - S1) / 2
   *   J01 = (S2 + i S3) / 2
   */
  static fromStokes(s0: number, s1: number, s2: number, s3: number): CoherencyMatrix {
    const j00 = new Complex((s0 + s1) / 2, 0);
    const j11 = new Complex((s0 - s1) / 2, 0);
    const j01 = new Complex(s2 / 2, s3 / 2);

    return new CoherencyMatrix(
      new Matrix2x2(j00, j01, j01.conjugate(), j11)
    );
  }

  /**
   * Create fully unpolarized light
   * J = (I/2) × [1 0]
   *             [0 1]
   */
  static createUnpolarized(intensity: number): CoherencyMatrix {
    const halfI = intensity / 2;
    return new CoherencyMatrix(
      Matrix2x2.diagonal(new Complex(halfI), new Complex(halfI))
    );
  }

  /**
   * Create linearly polarized light at specified angle
   * @param intensity Total intensity
   * @param angle Polarization angle from horizontal (radians)
   */
  static createLinear(intensity: number, angle: number): CoherencyMatrix {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const sqrtI = Math.sqrt(intensity);
    const ex = new Complex(sqrtI * c, 0);
    const ey = new Complex(sqrtI * s, 0);
    return CoherencyMatrix.fromJones(ex, ey);
  }

  /**
   * Create circularly polarized light
   * @param intensity Total intensity
   * @param rightHanded True for right-circular, false for left-circular
   */
  static createCircular(intensity: number, rightHanded: boolean): CoherencyMatrix {
    const amp = Math.sqrt(intensity / 2);
    const ex = new Complex(amp, 0);
    // RCP: Ey = -i Ex, LCP: Ey = +i Ex
    const ey = rightHanded
      ? new Complex(0, -amp)
      : new Complex(0, amp);
    return CoherencyMatrix.fromJones(ex, ey);
  }

  /**
   * Create elliptically polarized light
   * @param intensity Total intensity
   * @param orientation Major axis angle from horizontal (radians)
   * @param ellipticity Ellipticity angle χ: tan(χ) = minor/major (radians, -π/4 to π/4)
   */
  static createElliptical(
    intensity: number,
    orientation: number,
    ellipticity: number
  ): CoherencyMatrix {
    const sqrtI = Math.sqrt(intensity);
    const cosO = Math.cos(orientation);
    const sinO = Math.sin(orientation);
    const cosE = Math.cos(ellipticity);
    const sinE = Math.sin(ellipticity);

    // Jones vector for elliptical polarization
    const ex = new Complex(sqrtI * cosO * cosE, sqrtI * sinO * sinE);
    const ey = new Complex(sqrtI * sinO * cosE, -sqrtI * cosO * sinE);
    return CoherencyMatrix.fromJones(ex, ey);
  }

  /**
   * Create partially polarized light
   * J = p × J_polarized + (1-p) × J_unpolarized
   * @param intensity Total intensity
   * @param dop Degree of polarization (0 to 1)
   * @param angle Polarization angle for the polarized component (radians)
   */
  static createPartiallyPolarized(
    intensity: number,
    dop: number,
    angle: number
  ): CoherencyMatrix {
    const clampedDop = Math.max(0, Math.min(1, dop));
    const polarized = CoherencyMatrix.createLinear(intensity * clampedDop, angle);
    const unpolarized = CoherencyMatrix.createUnpolarized(intensity * (1 - clampedDop));
    return polarized.add(unpolarized);
  }

  /** Zero intensity (vacuum) */
  static readonly ZERO = new CoherencyMatrix(Matrix2x2.ZERO);

  // ========== Physical Properties ==========

  /**
   * Total intensity (power): I = Tr(J) = J00 + J11
   */
  get intensity(): number {
    return this.matrix.trace().real;
  }

  /**
   * Degree of Polarization (DoP)
   *
   * DoP = √(1 - 4×det(J)/Tr(J)²)
   *
   * Values:
   * - DoP = 1: Fully polarized
   * - DoP = 0: Completely unpolarized
   * - 0 < DoP < 1: Partially polarized
   *
   * 数值保护: 当光强接近零时避免除零崩溃
   */
  get degreeOfPolarization(): number {
    const I = this.intensity;

    // 数值保护: 光强极低时返回 0
    if (I < INTENSITY_EPSILON) {
      return 0;
    }

    const detVal = this.matrix.determinant().real;

    // DoP² = 1 - 4×det/I²
    // 对于物理态, det ≥ 0, 所以 DoP² ≤ 1
    const ratio = 4 * detVal / (I * I);

    // 数值保护: 确保不会因浮点误差产生负数
    const dopSquared = Math.max(0, 1 - ratio);

    return Math.sqrt(dopSquared);
  }

  /**
   * Convert to Stokes parameters [S0, S1, S2, S3]
   *
   * S0 = J00 + J11 = Tr(J) (total intensity)
   * S1 = J00 - J11 (horizontal vs vertical)
   * S2 = 2×Re(J01) (+45° vs -45°)
   * S3 = 2×Im(J01) (right vs left circular)
   */
  toStokes(): [number, number, number, number] {
    const j00 = this.matrix.a00.real;
    const j11 = this.matrix.a11.real;
    const j01Re = this.matrix.a01.real;
    const j01Im = this.matrix.a01.imag;

    return [
      j00 + j11,      // S0: total intensity
      j00 - j11,      // S1: linear horizontal/vertical
      2 * j01Re,      // S2: linear +45°/-45°
      2 * j01Im       // S3: circular right/left
    ];
  }

  /**
   * Orientation angle of polarization ellipse (radians, 0 to π)
   * Only meaningful for polarized component (DoP > 0)
   */
  get orientationAngle(): number {
    const [, s1, s2] = this.toStokes();
    return Math.atan2(s2, s1) / 2;
  }

  /**
   * Ellipticity angle (radians, -π/4 to π/4)
   * Positive = right-handed, negative = left-handed
   */
  get ellipticityAngle(): number {
    const stokes = this.toStokes();
    const s0 = stokes[0];
    const s3 = stokes[3];
    if (s0 < INTENSITY_EPSILON) return 0;

    // sin(2χ) = S3 / (DoP × S0)
    const dop = this.degreeOfPolarization;
    if (dop < INTENSITY_EPSILON) return 0;

    const sin2chi = Math.max(-1, Math.min(1, s3 / (dop * s0)));
    return Math.asin(sin2chi) / 2;
  }

  /**
   * Check if light is essentially unpolarized
   */
  isUnpolarized(tolerance: number = 0.01): boolean {
    return this.degreeOfPolarization < tolerance;
  }

  /**
   * Check if light is essentially fully polarized
   */
  isFullyPolarized(tolerance: number = 0.01): boolean {
    return this.degreeOfPolarization > 1 - tolerance;
  }

  /**
   * Check if light is linearly polarized (no circular component)
   */
  isLinear(tolerance: number = PHYSICAL_TOLERANCE): boolean {
    const [s0, , , s3] = this.toStokes();
    if (s0 < INTENSITY_EPSILON) return true;
    return Math.abs(s3 / s0) < tolerance;
  }

  /**
   * Check if light is circularly polarized
   */
  isCircular(tolerance: number = PHYSICAL_TOLERANCE): boolean {
    const [s0, s1, s2] = this.toStokes();
    if (s0 < INTENSITY_EPSILON) return true;
    return Math.abs(s1 / s0) < tolerance && Math.abs(s2 / s0) < tolerance;
  }

  // ========== Matrix Operations ==========

  /** Get the underlying matrix (read-only) */
  get rawMatrix(): Matrix2x2 {
    return this.matrix;
  }

  /**
   * Apply a Jones matrix operator
   * J' = M J M†
   *
   * This is how optical elements transform the coherency matrix
   */
  applyOperator(m: Matrix2x2): CoherencyMatrix {
    // J' = M × J × M†
    const mJoint = this.matrix.mul(m.adjoint());
    const result = m.mul(mJoint);
    return new CoherencyMatrix(result);
  }

  /**
   * Add two coherency matrices (incoherent superposition)
   * Used for combining light from independent sources
   */
  add(other: CoherencyMatrix): CoherencyMatrix {
    return new CoherencyMatrix(this.matrix.add(other.matrix));
  }

  /**
   * Scale intensity
   */
  scale(factor: number): CoherencyMatrix {
    return new CoherencyMatrix(this.matrix.scale(factor));
  }

  /**
   * Mix with unpolarized light (depolarization)
   * @param depolarizationFactor 0 = no change, 1 = fully depolarize
   */
  depolarize(depolarizationFactor: number): CoherencyMatrix {
    const f = Math.max(0, Math.min(1, depolarizationFactor));
    if (f < PHYSICAL_TOLERANCE) return this;
    if (f > 1 - PHYSICAL_TOLERANCE) {
      return CoherencyMatrix.createUnpolarized(this.intensity);
    }

    // J' = (1-f)×J + f×(I/2)×Identity
    const unpolarized = CoherencyMatrix.createUnpolarized(this.intensity);
    return new CoherencyMatrix(
      this.matrix.scale(1 - f).add(unpolarized.matrix.scale(f))
    );
  }

  // ========== Utility ==========

  /**
   * Check if intensity is above threshold (light exists)
   */
  isAboveThreshold(threshold: number = INTENSITY_EPSILON): boolean {
    return this.intensity > threshold;
  }

  /**
   * Create a copy
   */
  clone(): CoherencyMatrix {
    return new CoherencyMatrix(this.matrix.clone());
  }

  /**
   * Check physical validity (Hermitian and positive semi-definite)
   */
  isPhysical(tolerance: number = PHYSICAL_TOLERANCE): boolean {
    return this.matrix.isPositiveSemiDefinite(tolerance);
  }

  /**
   * Debug string representation
   */
  toString(): string {
    const stokes = this.toStokes();
    return `CoherencyMatrix(I=${this.intensity.toFixed(4)}, ` +
           `DoP=${this.degreeOfPolarization.toFixed(3)}, ` +
           `θ=${(this.orientationAngle * 180 / Math.PI).toFixed(1)}°, ` +
           `S=[${stokes.map(s => s.toFixed(3)).join(', ')}])`;
  }

  /**
   * Serialize to JSON-compatible object
   */
  toJSON(): { type: 'coherency'; s0: number; s1: number; s2: number; s3: number } {
    const [s0, s1, s2, s3] = this.toStokes();
    return { type: 'coherency', s0, s1, s2, s3 };
  }

  /**
   * Deserialize from JSON object
   */
  static fromJSON(data: { s0: number; s1: number; s2: number; s3: number }): CoherencyMatrix {
    return CoherencyMatrix.fromStokes(data.s0, data.s1, data.s2, data.s3);
  }
}

// ========== Pre-defined States ==========

/** Horizontal linearly polarized light (unit intensity) */
export const HORIZONTAL = CoherencyMatrix.createLinear(1, 0);

/** Vertical linearly polarized light (unit intensity) */
export const VERTICAL = CoherencyMatrix.createLinear(1, Math.PI / 2);

/** +45° linearly polarized light (unit intensity) */
export const DIAGONAL = CoherencyMatrix.createLinear(1, Math.PI / 4);

/** -45° linearly polarized light (unit intensity) */
export const ANTIDIAGONAL = CoherencyMatrix.createLinear(1, -Math.PI / 4);

/** Right circular polarized light (unit intensity) */
export const RIGHT_CIRCULAR = CoherencyMatrix.createCircular(1, true);

/** Left circular polarized light (unit intensity) */
export const LEFT_CIRCULAR = CoherencyMatrix.createCircular(1, false);

/** Unpolarized light (unit intensity) */
export const UNPOLARIZED = CoherencyMatrix.createUnpolarized(1);
