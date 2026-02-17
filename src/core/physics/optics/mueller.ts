/**
 * Mueller Matrix Module (穆勒矩阵模块)
 *
 * Implements 4×4 real Mueller matrices for transforming Stokes vectors.
 * The Mueller calculus is the most general linear optics framework:
 *   - Handles fully polarized, partially polarized, and unpolarized light
 *   - Handles ideal and non-ideal, deterministic and stochastic elements
 *   - Every physical Mueller matrix satisfies: M₀₀ ≥ |Mᵢⱼ| for all i,j
 *
 * Convention:
 *   - All angles are in RADIANS internally
 *   - Row-major layout: elements[i * 4 + j] = M(i, j)
 *   - Matrix chain: for light passing through A then B then C,
 *     M_total = M_C × M_B × M_A (right-to-left application)
 *   - Rotation convention: counterclockwise positive when viewed
 *     along the propagation direction (towards the observer)
 *
 * Jones → Mueller bridge:
 *   For non-depolarizing elements, M_ij = (1/2) Tr(σ_i J σ_j J†)
 *   where σ_0 = I, σ_1, σ_2, σ_3 are the Pauli matrices.
 *
 * @see stokes.ts for the StokesVector type
 */

import type { StokesVector } from './stokes';

// ========== Core Type ==========

/**
 * A 4×4 real Mueller matrix stored as Float64Array(16) in row-major order.
 *
 * Layout:
 *   [M00, M01, M02, M03,
 *    M10, M11, M12, M13,
 *    M20, M21, M22, M23,
 *    M30, M31, M32, M33]
 */
export type MuellerMatrix = Float64Array;

// ========== Numerical Constants ==========

const EPSILON = 1e-12;

// ========== Element Access ==========

/** Get element at row i, column j (0-indexed). */
export function mGet(m: MuellerMatrix, i: number, j: number): number {
  return m[i * 4 + j];
}

/** Set element at row i, column j. Mutates in place. */
export function mSet(m: MuellerMatrix, i: number, j: number, value: number): void {
  m[i * 4 + j] = value;
}

// ========== Factory Functions: Optical Elements ==========

/**
 * 4×4 identity Mueller matrix (free space propagation).
 */
export function identity(): MuellerMatrix {
  return new Float64Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

/**
 * Ideal linear polarizer with transmission axis at angle θ.
 *
 * @param angle Transmission axis angle in radians (0 = horizontal)
 */
export function linearPolarizer(angle: number): MuellerMatrix {
  const c2 = Math.cos(2 * angle);
  const s2 = Math.sin(2 * angle);
  return new Float64Array([
    0.5,        0.5 * c2,        0.5 * s2,        0,
    0.5 * c2,   0.5 * c2 * c2,   0.5 * s2 * c2,   0,
    0.5 * s2,   0.5 * s2 * c2,   0.5 * s2 * s2,   0,
    0,          0,               0,               0,
  ]);
}

/**
 * General wave plate (retarder) with arbitrary retardance and fast-axis angle.
 *
 * @param fastAxisAngle Fast axis angle in radians
 * @param retardance Phase retardation in radians (π/2 for QWP, π for HWP)
 */
export function generalRetarder(fastAxisAngle: number, retardance: number): MuellerMatrix {
  const c2 = Math.cos(2 * fastAxisAngle);
  const s2 = Math.sin(2 * fastAxisAngle);
  const cd = Math.cos(retardance);
  const sd = Math.sin(retardance);

  return new Float64Array([
    1, 0, 0, 0,
    0, c2 * c2 + s2 * s2 * cd,   c2 * s2 * (1 - cd),     -s2 * sd,
    0, c2 * s2 * (1 - cd),        s2 * s2 + c2 * c2 * cd,  c2 * sd,
    0, s2 * sd,                   -c2 * sd,                  cd,
  ]);
}

/**
 * Quarter-wave plate (λ/4 retarder, δ = π/2).
 *
 * @param fastAxisAngle Fast axis angle in radians
 */
export function quarterWavePlate(fastAxisAngle: number): MuellerMatrix {
  return generalRetarder(fastAxisAngle, Math.PI / 2);
}

/**
 * Half-wave plate (λ/2 retarder, δ = π).
 *
 * @param fastAxisAngle Fast axis angle in radians
 */
export function halfWavePlate(fastAxisAngle: number): MuellerMatrix {
  return generalRetarder(fastAxisAngle, Math.PI);
}

/**
 * Optical rotator (e.g., Faraday rotator, optically active medium).
 * Rotates the plane of polarization without changing intensity or ellipticity.
 *
 * @param angle Rotation angle in radians (positive = counterclockwise
 *              when viewed along propagation direction)
 */
export function rotator(angle: number): MuellerMatrix {
  const c2 = Math.cos(2 * angle);
  const s2 = Math.sin(2 * angle);
  return new Float64Array([
    1,  0,     0,   0,
    0,  c2,  -s2,   0,
    0,  s2,   c2,   0,
    0,  0,     0,   1,
  ]);
}

/**
 * Ideal depolarizer. Output is unpolarized regardless of input.
 *
 * @param transmission Fraction of total intensity transmitted (0 to 1)
 */
export function depolarizer(transmission: number = 1): MuellerMatrix {
  return new Float64Array([
    transmission, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ]);
}

/**
 * Partial depolarizer with uniform depolarization factor.
 * Scales (S1, S2, S3) by (1 - factor) while preserving S0.
 *
 * @param factor Depolarization factor: 0 = no depolarization, 1 = full
 */
export function partialDepolarizer(factor: number): MuellerMatrix {
  const d = 1 - factor;
  return new Float64Array([
    1, 0, 0, 0,
    0, d, 0, 0,
    0, 0, d, 0,
    0, 0, 0, d,
  ]);
}

/**
 * Ideal mirror (metallic reflection at normal incidence).
 * Reverses handedness of circular polarization: S3 → -S3.
 * Reverses S2 as well due to coordinate handedness flip.
 */
export function mirror(): MuellerMatrix {
  return new Float64Array([
    1,  0,  0,  0,
    0,  1,  0,  0,
    0,  0, -1,  0,
    0,  0,  0, -1,
  ]);
}

/**
 * Neutral density filter (attenuator). Scales all Stokes parameters uniformly.
 *
 * @param transmission Fraction of light transmitted (0 to 1)
 */
export function attenuator(transmission: number): MuellerMatrix {
  return new Float64Array([
    transmission, 0, 0, 0,
    0, transmission, 0, 0,
    0, 0, transmission, 0,
    0, 0, 0, transmission,
  ]);
}

/**
 * Non-ideal (dichroic) linear polarizer.
 * Models real polarizers with finite extinction ratio.
 *
 * @param angle Transmission axis angle in radians
 * @param px Intensity transmittance for the principal axis (0 to 1)
 * @param py Intensity transmittance for the orthogonal axis (0 to 1, py < px)
 */
export function dichroicPolarizer(angle: number, px: number, py: number): MuellerMatrix {
  const c2 = Math.cos(2 * angle);
  const s2 = Math.sin(2 * angle);
  const A = 0.5 * (px + py);
  const B = 0.5 * (px - py);
  const C = Math.sqrt(px * py);

  return new Float64Array([
    A,       B * c2,       B * s2,       0,
    B * c2,  A * c2 * c2 + C * s2 * s2,   (A - C) * s2 * c2,   0,
    B * s2,  (A - C) * s2 * c2,           A * s2 * s2 + C * c2 * c2,   0,
    0,       0,                           0,                           C,
  ]);
}

// ========== Matrix Operations ==========

/**
 * Multiply two Mueller matrices: result = A × B.
 * In an optical train where light passes through B first, then A:
 *   S_out = A × B × S_in
 */
export function multiply(a: MuellerMatrix, b: MuellerMatrix): MuellerMatrix {
  const result = new Float64Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[i * 4 + k] * b[k * 4 + j];
      }
      result[i * 4 + j] = sum;
    }
  }
  return result;
}

/**
 * Chain multiple Mueller matrices in optical-train order (left-to-right).
 * For light passing through elements M1, M2, ..., Mn in that order:
 *   M_total = Mn × ... × M2 × M1
 *
 * @param matrices Array of Mueller matrices in order of light travel
 */
export function chainMueller(...matrices: MuellerMatrix[]): MuellerMatrix {
  if (matrices.length === 0) return identity();
  let result = matrices[0];
  for (let i = 1; i < matrices.length; i++) {
    result = multiply(matrices[i], result);
  }
  return result;
}

/**
 * Apply a Mueller matrix to a Stokes vector.
 * S_out = M × S_in
 */
export function applyToStokes(m: MuellerMatrix, s: StokesVector): StokesVector {
  const result = new Float64Array(4);
  for (let i = 0; i < 4; i++) {
    let sum = 0;
    for (let j = 0; j < 4; j++) {
      sum += m[i * 4 + j] * s[j];
    }
    result[i] = sum;
  }
  return result;
}

/**
 * Scale all elements of a Mueller matrix by a scalar.
 */
export function mScale(m: MuellerMatrix, factor: number): MuellerMatrix {
  const result = new Float64Array(16);
  for (let i = 0; i < 16; i++) {
    result[i] = m[i] * factor;
  }
  return result;
}

/**
 * Add two Mueller matrices element-wise.
 */
export function mAdd(a: MuellerMatrix, b: MuellerMatrix): MuellerMatrix {
  const result = new Float64Array(16);
  for (let i = 0; i < 16; i++) {
    result[i] = a[i] + b[i];
  }
  return result;
}

/**
 * Transpose a Mueller matrix.
 */
export function mTranspose(m: MuellerMatrix): MuellerMatrix {
  const result = new Float64Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i * 4 + j] = m[j * 4 + i];
    }
  }
  return result;
}

// ========== Physical Validation ==========

/**
 * Check if a Mueller matrix is physically realizable.
 *
 * Necessary conditions:
 *   1. M00 ≥ 0
 *   2. |Mij| ≤ M00 for all i, j
 *   3. Tr(M^T M) ≤ 4 M00²  (Cloude condition)
 */
export function isPhysical(m: MuellerMatrix, tolerance: number = 1e-8): boolean {
  const m00 = m[0];
  if (m00 < -tolerance) return false;
  for (let i = 0; i < 16; i++) {
    if (Math.abs(m[i]) > m00 + tolerance) return false;
  }
  return true;
}

/**
 * Depolarization Index.
 *
 * DI = √(Σ Mij² - M00²) / (√3 × M00)
 *
 * DI = 0: completely depolarizing
 * DI = 1: non-depolarizing (representable as a Jones matrix)
 */
export function depolarizationIndex(m: MuellerMatrix): number {
  const m00 = m[0];
  if (m00 < EPSILON) return 0;

  let sumSq = 0;
  for (let i = 0; i < 16; i++) {
    sumSq += m[i] * m[i];
  }

  const numerator = Math.sqrt(Math.max(0, sumSq - m00 * m00));
  return numerator / (Math.sqrt(3) * m00);
}

/**
 * Check if this matrix is non-depolarizing (DI ≈ 1).
 */
export function isNonDepolarizing(m: MuellerMatrix, tolerance: number = 0.01): boolean {
  return Math.abs(depolarizationIndex(m) - 1) < tolerance;
}

// ========== Jones ↔ Mueller Conversion ==========

/**
 * Convert a 2×2 Jones matrix to a 4×4 Mueller matrix.
 *
 * Uses: M_ij = (1/2) Tr(σ_i J σ_j J†)
 * where σ_0 = I, σ_1, σ_2, σ_3 are the Pauli matrices.
 *
 * This is the standard A(J⊗J*)A⁻¹ mapping.
 *
 * @param j00r Real part of J(0,0)
 * @param j00i Imaginary part of J(0,0)
 * @param j01r Real part of J(0,1)
 * @param j01i Imaginary part of J(0,1)
 * @param j10r Real part of J(1,0)
 * @param j10i Imaginary part of J(1,0)
 * @param j11r Real part of J(1,1)
 * @param j11i Imaginary part of J(1,1)
 */
export function fromJonesElements(
  j00r: number, j00i: number,
  j01r: number, j01i: number,
  j10r: number, j10i: number,
  j11r: number, j11i: number,
): MuellerMatrix {
  // |J_ij|²
  const j00s = j00r * j00r + j00i * j00i;
  const j01s = j01r * j01r + j01i * j01i;
  const j10s = j10r * j10r + j10i * j10i;
  const j11s = j11r * j11r + j11i * j11i;

  // Cross products (complex): J_ab × J_cd* = (a_r + i a_i)(c_r - i c_i)
  //   real part = a_r c_r + a_i c_i
  //   imag part = a_i c_r - a_r c_i
  const j00j11s_re = j00r * j11r + j00i * j11i;
  const j00j11s_im = j00i * j11r - j00r * j11i;

  const j01j10s_re = j01r * j10r + j01i * j10i;
  const j01j10s_im = j01i * j10r - j01r * j10i;

  const j00j10s_re = j00r * j10r + j00i * j10i;
  const j00j10s_im = j00i * j10r - j00r * j10i;

  const j01j11s_re = j01r * j11r + j01i * j11i;
  const j01j11s_im = j01i * j11r - j01r * j11i;

  const j00j01s_re = j00r * j01r + j00i * j01i;
  const j00j01s_im = j00i * j01r - j00r * j01i;

  const j10j11s_re = j10r * j11r + j10i * j11i;
  const j10j11s_im = j10i * j11r - j10r * j11i;

  // Build Mueller matrix using Pauli trace formulation
  const m00 = 0.5 * (j00s + j01s + j10s + j11s);
  const m01 = 0.5 * (j00s - j01s + j10s - j11s);
  const m02 = j00j01s_re + j10j11s_re;
  const m03 = j00j01s_im + j10j11s_im;

  const m10 = 0.5 * (j00s + j01s - j10s - j11s);
  const m11 = 0.5 * (j00s - j01s - j10s + j11s);
  const m12 = j00j01s_re - j10j11s_re;
  const m13 = j00j01s_im - j10j11s_im;

  const m20 = j00j10s_re + j01j11s_re;
  const m21 = j00j10s_re - j01j11s_re;
  const m22 = j00j11s_re + j01j10s_re;
  const m23 = j00j11s_im - j01j10s_im;

  const m30 = j00j10s_im + j01j11s_im;
  const m31 = j00j10s_im - j01j11s_im;
  const m32 = -(j00j11s_im + j01j10s_im);
  const m33 = j00j11s_re - j01j10s_re;

  return new Float64Array([
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33,
  ]);
}

/**
 * Convert a Jones matrix (in the legacy JonesCalculus {re, im} format)
 * to a Mueller matrix, preserving backward compatibility.
 *
 * @param j Jones matrix as [[{re,im},{re,im}],[{re,im},{re,im}]]
 */
export function fromLegacyJones(
  j: [[{ re: number; im: number }, { re: number; im: number }],
      [{ re: number; im: number }, { re: number; im: number }]],
): MuellerMatrix {
  return fromJonesElements(
    j[0][0].re, j[0][0].im,
    j[0][1].re, j[0][1].im,
    j[1][0].re, j[1][0].im,
    j[1][1].re, j[1][1].im,
  );
}

// ========== Rotation Helper ==========

/**
 * Mueller rotation matrix R(θ). Used to rotate the reference frame
 * of a Mueller matrix: M'(θ) = R(θ) M R(-θ).
 *
 * @param angle Rotation angle in radians
 */
export function rotationMatrix(angle: number): MuellerMatrix {
  const c2 = Math.cos(2 * angle);
  const s2 = Math.sin(2 * angle);
  return new Float64Array([
    1,  0,     0,   0,
    0,  c2,  -s2,   0,
    0,  s2,   c2,   0,
    0,  0,     0,   1,
  ]);
}

// ========== Utility ==========

/**
 * Clone a Mueller matrix.
 */
export function mClone(m: MuellerMatrix): MuellerMatrix {
  return new Float64Array(m);
}

/**
 * Check approximate equality of two Mueller matrices.
 */
export function mEquals(a: MuellerMatrix, b: MuellerMatrix, tolerance: number = 1e-10): boolean {
  for (let i = 0; i < 16; i++) {
    if (Math.abs(a[i] - b[i]) > tolerance) return false;
  }
  return true;
}

/**
 * Human-readable string representation.
 */
export function mToString(m: MuellerMatrix, precision: number = 6): string {
  const rows: string[] = [];
  for (let i = 0; i < 4; i++) {
    const vals: string[] = [];
    for (let j = 0; j < 4; j++) {
      vals.push(m[i * 4 + j].toFixed(precision));
    }
    rows.push(`  [${vals.join(', ')}]`);
  }
  return `Mueller(\n${rows.join('\n')}\n)`;
}
