/**
 * Mueller Matrix Module (Mueller矩阵模块)
 *
 * Implements 4×4 real Mueller matrices for transforming Stokes vectors.
 *
 * The Mueller calculus is the most general framework for linear optical systems:
 * - Handles ALL states: fully polarized, partially polarized, unpolarized
 * - Handles ALL elements: ideal and non-ideal, deterministic and stochastic
 * - Every physical Mueller matrix satisfies: M₀₀ ≥ |Mᵢⱼ| for all i,j
 *
 * Relationship to other formalisms:
 * - Jones matrix J → Mueller matrix M: M = A(J ⊗ J*)A⁻¹ (only for non-depolarizing)
 * - CoherencyMatrix → Stokes: already in CoherencyMatrix.toStokes()
 * - Mueller applied to Stokes: S' = M × S
 *
 * This module provides:
 * 1. MuellerMatrix class with composition and application
 * 2. Factory methods for common optical elements
 * 3. Physical validation (realizability conditions)
 * 4. Jones ↔ Mueller conversion for non-depolarizing elements
 */

import { Matrix2x2 } from '../../math/Matrix2x2';

// ========== Core Type ==========

/**
 * A 4×4 real Mueller matrix stored as a flat array in row-major order.
 *
 * Layout: [m00, m01, m02, m03,
 *          m10, m11, m12, m13,
 *          m20, m21, m22, m23,
 *          m30, m31, m32, m33]
 */
export class MuellerMatrix {
  readonly elements: Float64Array;

  constructor(elements?: number[] | Float64Array) {
    if (elements) {
      if (elements.length !== 16) {
        throw new Error(`MuellerMatrix requires 16 elements, got ${elements.length}`);
      }
      this.elements = new Float64Array(elements);
    } else {
      this.elements = new Float64Array(16);
    }
  }

  /** Access element at row i, column j (0-indexed) */
  get(i: number, j: number): number {
    return this.elements[i * 4 + j];
  }

  /** Set element at row i, column j */
  set(i: number, j: number, value: number): void {
    this.elements[i * 4 + j] = value;
  }

  // ========== Arithmetic ==========

  /**
   * Multiply this matrix by another: result = this × other
   * (this is applied AFTER other in the optical train)
   */
  mul(other: MuellerMatrix): MuellerMatrix {
    const result = new MuellerMatrix();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.get(i, k) * other.get(k, j);
        }
        result.set(i, j, sum);
      }
    }
    return result;
  }

  /**
   * Apply this Mueller matrix to a Stokes vector.
   * @param stokes [S0, S1, S2, S3]
   * @returns Transformed Stokes vector [S0', S1', S2', S3']
   */
  apply(stokes: [number, number, number, number]): [number, number, number, number] {
    const result: [number, number, number, number] = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      let sum = 0;
      for (let j = 0; j < 4; j++) {
        sum += this.get(i, j) * stokes[j];
      }
      result[i] = sum;
    }
    return result;
  }

  /** Scale all elements by a factor */
  scale(factor: number): MuellerMatrix {
    const result = new MuellerMatrix();
    for (let i = 0; i < 16; i++) {
      result.elements[i] = this.elements[i] * factor;
    }
    return result;
  }

  /** Add two Mueller matrices element-wise */
  add(other: MuellerMatrix): MuellerMatrix {
    const result = new MuellerMatrix();
    for (let i = 0; i < 16; i++) {
      result.elements[i] = this.elements[i] + other.elements[i];
    }
    return result;
  }

  /** Transpose */
  transpose(): MuellerMatrix {
    const result = new MuellerMatrix();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result.set(i, j, this.get(j, i));
      }
    }
    return result;
  }

  // ========== Physical Validation ==========

  /**
   * Check if this is a physically realizable Mueller matrix.
   *
   * Necessary conditions:
   * 1. m00 ≥ 0 (total intensity is non-negative)
   * 2. |mij| ≤ m00 for all i,j (no element exceeds total throughput)
   * 3. m00 ≥ max(|m01|, |m10|) (transmittance bounds)
   *
   * Note: full physicality also requires the associated coherency matrix
   * to be positive semi-definite (not checked here for performance).
   */
  isPhysical(tolerance: number = 1e-8): boolean {
    const m00 = this.get(0, 0);

    // Condition 1: non-negative total throughput
    if (m00 < -tolerance) return false;

    // Condition 2: all elements bounded by m00
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (Math.abs(this.get(i, j)) > m00 + tolerance) return false;
      }
    }

    return true;
  }

  /**
   * Compute the depolarization index.
   *
   * DI = √(Σᵢⱼ mᵢⱼ² - m₀₀²) / (√3 × m₀₀)
   *
   * DI = 0: completely depolarizing
   * DI = 1: non-depolarizing (can be represented by Jones matrix)
   */
  depolarizationIndex(): number {
    const m00 = this.get(0, 0);
    if (m00 < 1e-12) return 0;

    let sumSq = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        sumSq += this.get(i, j) * this.get(i, j);
      }
    }

    const numerator = Math.sqrt(Math.max(0, sumSq - m00 * m00));
    return numerator / (Math.sqrt(3) * m00);
  }

  /**
   * Check if this matrix is non-depolarizing (DI ≈ 1).
   * Non-depolarizing matrices can be represented as Jones matrices.
   */
  isNonDepolarizing(tolerance: number = 0.01): boolean {
    return Math.abs(this.depolarizationIndex() - 1) < tolerance;
  }

  // ========== Display ==========

  clone(): MuellerMatrix {
    return new MuellerMatrix(new Float64Array(this.elements));
  }

  toString(): string {
    const rows: string[] = [];
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        row.push(this.get(i, j).toFixed(4));
      }
      rows.push(`  [${row.join(', ')}]`);
    }
    return `Mueller(\n${rows.join('\n')}\n)`;
  }

  // ========== Static Factories ==========

  /** Identity Mueller matrix (free space) */
  static identity(): MuellerMatrix {
    return new MuellerMatrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  /**
   * Linear polarizer at angle θ (measured from horizontal).
   *
   * M_pol(θ) = (1/2) ×
   * [1      cos2θ    sin2θ    0  ]
   * [cos2θ  cos²2θ   sin2θcos2θ 0]
   * [sin2θ  sin2θcos2θ sin²2θ  0 ]
   * [0      0        0        0  ]
   */
  static linearPolarizer(angleDeg: number): MuellerMatrix {
    const theta = angleDeg * Math.PI / 180;
    const c2 = Math.cos(2 * theta);
    const s2 = Math.sin(2 * theta);

    return new MuellerMatrix([
      1,   c2,      s2,      0,
      c2,  c2 * c2, s2 * c2, 0,
      s2,  s2 * c2, s2 * s2, 0,
      0,   0,       0,       0,
    ]).scale(0.5);
  }

  /**
   * Wave plate (retarder) with retardation δ and fast axis at angle θ.
   *
   * @param retardationDeg Phase retardation in degrees (90 for QWP, 180 for HWP)
   * @param fastAxisDeg Fast axis angle in degrees from horizontal
   */
  static waveplate(retardationDeg: number, fastAxisDeg: number): MuellerMatrix {
    const delta = retardationDeg * Math.PI / 180;
    const theta = fastAxisDeg * Math.PI / 180;
    const c2 = Math.cos(2 * theta);
    const s2 = Math.sin(2 * theta);
    const cd = Math.cos(delta);
    const sd = Math.sin(delta);

    return new MuellerMatrix([
      1, 0, 0, 0,
      0, c2 * c2 + s2 * s2 * cd,   c2 * s2 * (1 - cd),     -s2 * sd,
      0, c2 * s2 * (1 - cd),        s2 * s2 + c2 * c2 * cd,  c2 * sd,
      0, s2 * sd,                   -c2 * sd,                  cd,
    ]);
  }

  /** Quarter-wave plate at angle θ */
  static quarterWavePlate(fastAxisDeg: number): MuellerMatrix {
    return MuellerMatrix.waveplate(90, fastAxisDeg);
  }

  /** Half-wave plate at angle θ */
  static halfWavePlate(fastAxisDeg: number): MuellerMatrix {
    return MuellerMatrix.waveplate(180, fastAxisDeg);
  }

  /**
   * Optical rotator (e.g., Faraday rotator, sugar solution).
   *
   * @param rotationDeg Rotation angle in degrees
   */
  static rotator(rotationDeg: number): MuellerMatrix {
    const theta = rotationDeg * Math.PI / 180;
    const c2 = Math.cos(2 * theta);
    const s2 = Math.sin(2 * theta);

    return new MuellerMatrix([
      1, 0,    0,   0,
      0, c2,   s2,  0,
      0, -s2,  c2,  0,
      0, 0,    0,   1,
    ]);
  }

  /**
   * Ideal depolarizer (output is always unpolarized).
   *
   * @param transmission Total intensity transmission (0 to 1)
   */
  static depolarizer(transmission: number = 1): MuellerMatrix {
    return new MuellerMatrix([
      transmission, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]);
  }

  /**
   * Partial depolarizer with uniform depolarization.
   *
   * @param factor Depolarization factor (0 = no depolarization, 1 = full depolarization)
   */
  static partialDepolarizer(factor: number): MuellerMatrix {
    const d = 1 - factor;
    return new MuellerMatrix([
      1, 0, 0, 0,
      0, d, 0, 0,
      0, 0, d, 0,
      0, 0, 0, d,
    ]);
  }

  /**
   * Ideal mirror (metallic reflection at normal incidence).
   * Reverses handedness of circular polarization.
   */
  static mirror(): MuellerMatrix {
    return new MuellerMatrix([
      1, 0, 0,  0,
      0, 1, 0,  0,
      0, 0, -1, 0,
      0, 0, 0, -1,
    ]);
  }

  /**
   * Neutral density filter (attenuator).
   *
   * @param transmission Fraction of light transmitted (0 to 1)
   */
  static attenuator(transmission: number): MuellerMatrix {
    return MuellerMatrix.identity().scale(transmission);
  }

  // ========== Conversion ==========

  /**
   * Convert a 2×2 Jones matrix to a 4×4 Mueller matrix.
   *
   * Uses the relationship: M = A (J ⊗ J*) A⁻¹
   * where A is the transformation matrix between coherency vector and Stokes vector.
   *
   * Only valid for non-depolarizing elements.
   *
   * @param jones 2×2 Jones matrix
   * @returns Equivalent Mueller matrix
   */
  static fromJones(jones: Matrix2x2): MuellerMatrix {
    // Extract Jones elements
    const j00 = jones.a00;
    const j01 = jones.a01;
    const j10 = jones.a10;
    const j11 = jones.a11;

    // Compute Mueller elements from Jones elements
    // M_ij = (1/2) Tr(σ_i J σ_j J†) where σ are Pauli matrices
    // This expands to explicit formulas:

    const j00j00s = j00.magnitudeSquared;
    const j01j01s = j01.magnitudeSquared;
    const j10j10s = j10.magnitudeSquared;
    const j11j11s = j11.magnitudeSquared;

    const j00j11s = j00.mul(j11.conjugate());
    const j01j10s = j01.mul(j10.conjugate());
    const j00j10s = j00.mul(j10.conjugate());
    const j01j11s = j01.mul(j11.conjugate());
    const j00j01s = j00.mul(j01.conjugate());
    const j10j11s = j10.mul(j11.conjugate());

    // Row 0 (intensity row)
    const m00 = 0.5 * (j00j00s + j01j01s + j10j10s + j11j11s);
    const m01 = 0.5 * (j00j00s - j01j01s + j10j10s - j11j11s);
    const m02 = (j00j01s.real + j10j11s.real);
    const m03 = (j00j01s.imag + j10j11s.imag);

    // Row 1
    const m10 = 0.5 * (j00j00s + j01j01s - j10j10s - j11j11s);
    const m11 = 0.5 * (j00j00s - j01j01s - j10j10s + j11j11s);
    const m12 = (j00j01s.real - j10j11s.real);
    const m13 = (j00j01s.imag - j10j11s.imag);

    // Row 2
    const m20 = (j00j10s.real + j01j11s.real);
    const m21 = (j00j10s.real - j01j11s.real);
    const m22 = (j00j11s.real + j01j10s.real);
    const m23 = (j00j11s.imag - j01j10s.imag);

    // Row 3
    const m30 = (j00j10s.imag + j01j11s.imag);
    const m31 = (j00j10s.imag - j01j11s.imag);
    const m32 = -(j00j11s.imag + j01j10s.imag);
    const m33 = (j00j11s.real - j01j10s.real);

    return new MuellerMatrix([
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33,
    ]);
  }
}

// ========== Convenience Functions ==========

/**
 * Chain multiple Mueller matrices (left-to-right in the optical train).
 *
 * For light passing through elements A, then B, then C:
 * M_total = M_C × M_B × M_A
 *
 * @param matrices Array of Mueller matrices in order of light travel
 * @returns Combined Mueller matrix
 */
export function chainMueller(matrices: MuellerMatrix[]): MuellerMatrix {
  if (matrices.length === 0) return MuellerMatrix.identity();
  let result = matrices[0];
  for (let i = 1; i < matrices.length; i++) {
    result = matrices[i].mul(result);
  }
  return result;
}

/**
 * Apply a chain of Mueller matrices to a Stokes vector.
 *
 * @param stokes Input Stokes vector [S0, S1, S2, S3]
 * @param matrices Array of Mueller matrices in order of light travel
 * @returns Output Stokes vector
 */
export function applyMuellerChain(
  stokes: [number, number, number, number],
  matrices: MuellerMatrix[]
): [number, number, number, number] {
  const total = chainMueller(matrices);
  return total.apply(stokes);
}
