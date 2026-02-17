/**
 * Stokes Vector Module (斯托克斯矢量模块)
 *
 * Implements the Stokes parameter formalism for describing polarization states.
 * Stokes vectors can represent ALL polarization states: fully polarized,
 * partially polarized, and unpolarized light.
 *
 * Convention:
 *   S = [S0, S1, S2, S3] stored as Float64Array(4)
 *   S0 = total intensity (always ≥ 0)
 *   S1 = preference for horizontal (>0) vs vertical (<0)
 *   S2 = preference for +45° (>0) vs -45° (<0)
 *   S3 = preference for right-circular (>0) vs left-circular (<0)
 *
 * Physical constraint: S1² + S2² + S3² ≤ S0²
 *
 * All angles are in RADIANS internally. Conversion to/from degrees
 * happens only at the UI boundary.
 */

// ========== Core Type ==========

/**
 * A 4-element Stokes vector stored as Float64Array.
 * Layout: [S0, S1, S2, S3]
 */
export type StokesVector = Float64Array;

// ========== Numerical Constants ==========

const EPSILON = 1e-12;

// ========== Factory Functions ==========

/**
 * Create a Stokes vector from four parameters.
 */
export function createStokes(s0: number, s1: number, s2: number, s3: number): StokesVector {
  return new Float64Array([s0, s1, s2, s3]);
}

/**
 * Create unpolarized (natural) light.
 * S = [I, 0, 0, 0]
 */
export function createUnpolarized(intensity: number): StokesVector {
  return new Float64Array([intensity, 0, 0, 0]);
}

/**
 * Create linearly polarized light at a given angle.
 * @param angle Polarization angle in radians (0 = horizontal)
 * @param intensity Total intensity (default 1)
 */
export function createLinear(angle: number, intensity: number = 1): StokesVector {
  return new Float64Array([
    intensity,
    intensity * Math.cos(2 * angle),
    intensity * Math.sin(2 * angle),
    0,
  ]);
}

/**
 * Create horizontally polarized light. S = [I, I, 0, 0]
 */
export function createHorizontal(intensity: number = 1): StokesVector {
  return new Float64Array([intensity, intensity, 0, 0]);
}

/**
 * Create vertically polarized light. S = [I, -I, 0, 0]
 */
export function createVertical(intensity: number = 1): StokesVector {
  return new Float64Array([intensity, -intensity, 0, 0]);
}

/**
 * Create +45° linearly polarized light. S = [I, 0, I, 0]
 */
export function createDiagonal(intensity: number = 1): StokesVector {
  return new Float64Array([intensity, 0, intensity, 0]);
}

/**
 * Create -45° linearly polarized light. S = [I, 0, -I, 0]
 */
export function createAntiDiagonal(intensity: number = 1): StokesVector {
  return new Float64Array([intensity, 0, -intensity, 0]);
}

/**
 * Create circularly polarized light.
 * @param handedness 'right' (S3 > 0) or 'left' (S3 < 0)
 * @param intensity Total intensity (default 1)
 */
export function createCircular(
  handedness: 'right' | 'left',
  intensity: number = 1,
): StokesVector {
  const sign = handedness === 'right' ? 1 : -1;
  return new Float64Array([intensity, 0, 0, sign * intensity]);
}

/**
 * Create elliptically polarized light from ellipse parameters.
 * @param orientation Orientation angle ψ in radians [0, π)
 * @param ellipticity Ellipticity angle χ in radians [-π/4, π/4]
 * @param intensity Total intensity (default 1)
 */
export function createElliptical(
  orientation: number,
  ellipticity: number,
  intensity: number = 1,
): StokesVector {
  const cos2psi = Math.cos(2 * orientation);
  const sin2psi = Math.sin(2 * orientation);
  const cos2chi = Math.cos(2 * ellipticity);
  const sin2chi = Math.sin(2 * ellipticity);
  return new Float64Array([
    intensity,
    intensity * cos2psi * cos2chi,
    intensity * sin2psi * cos2chi,
    intensity * sin2chi,
  ]);
}

/**
 * Create partially polarized light.
 * @param dop Degree of polarization [0, 1]
 * @param angle Polarization angle of the polarized component in radians
 * @param intensity Total intensity
 */
export function createPartiallyPolarized(
  dop: number,
  angle: number,
  intensity: number = 1,
): StokesVector {
  const d = Math.max(0, Math.min(1, dop));
  return new Float64Array([
    intensity,
    intensity * d * Math.cos(2 * angle),
    intensity * d * Math.sin(2 * angle),
    0,
  ]);
}

// ========== Derived Quantities ==========

/**
 * Total intensity S0.
 */
export function intensity(s: StokesVector): number {
  return s[0];
}

/**
 * Degree of Linear Polarization.
 * DoLP = √(S1² + S2²) / S0
 */
export function toDoLP(s: StokesVector): number {
  if (s[0] < EPSILON) return 0;
  return Math.sqrt(s[1] * s[1] + s[2] * s[2]) / s[0];
}

/**
 * Angle of Linear Polarization (radians).
 * AoLP = (1/2) atan2(S2, S1)  ∈ [0, π)
 */
export function toAoLP(s: StokesVector): number {
  const raw = 0.5 * Math.atan2(s[2], s[1]);
  // Normalize to [0, π)
  return raw < 0 ? raw + Math.PI : raw;
}

/**
 * Degree of Circular Polarization.
 * DoCP = |S3| / S0
 */
export function toDoCP(s: StokesVector): number {
  if (s[0] < EPSILON) return 0;
  return Math.abs(s[3]) / s[0];
}

/**
 * Degree of Polarization (total).
 * DoP = √(S1² + S2² + S3²) / S0
 */
export function toDoP(s: StokesVector): number {
  if (s[0] < EPSILON) return 0;
  return Math.sqrt(s[1] * s[1] + s[2] * s[2] + s[3] * s[3]) / s[0];
}

/**
 * Ellipticity angle χ in radians.
 * χ = (1/2) asin(S3 / (DoP * S0))
 * Positive = right-handed, negative = left-handed.
 * Range: [-π/4, π/4]
 */
export function toEllipticity(s: StokesVector): number {
  const polarizedI = Math.sqrt(s[1] * s[1] + s[2] * s[2] + s[3] * s[3]);
  if (polarizedI < EPSILON) return 0;
  const sin2chi = Math.max(-1, Math.min(1, s[3] / polarizedI));
  return 0.5 * Math.asin(sin2chi);
}

/**
 * Orientation angle ψ of the polarization ellipse (radians).
 * ψ = (1/2) atan2(S2, S1)  ∈ [0, π)
 * (Same as AoLP for fully linearly polarized light)
 */
export function toOrientation(s: StokesVector): number {
  return toAoLP(s);
}

/**
 * Handedness of the polarization ellipse.
 * Based on the sign of S3.
 */
export function handedness(s: StokesVector): 'right' | 'left' | 'none' {
  if (Math.abs(s[3]) < EPSILON) return 'none';
  return s[3] > 0 ? 'right' : 'left';
}

// ========== Validation ==========

/**
 * Check whether a Stokes vector is physically valid.
 * Physical constraint: S1² + S2² + S3² ≤ S0²
 * Also: S0 ≥ 0
 *
 * @param tolerance Absolute tolerance for floating-point comparisons
 */
export function validate(s: StokesVector, tolerance: number = 1e-10): boolean {
  if (s[0] < -tolerance) return false;
  const polarizedSq = s[1] * s[1] + s[2] * s[2] + s[3] * s[3];
  return polarizedSq <= s[0] * s[0] + tolerance;
}

/**
 * Project a Stokes vector onto the closest physically valid state.
 * If S1² + S2² + S3² > S0², scale (S1, S2, S3) down to satisfy the constraint.
 * If S0 < 0, clamp to 0.
 *
 * Returns a NEW StokesVector (does not mutate input).
 */
export function clampToPhysical(s: StokesVector): StokesVector {
  const s0 = Math.max(0, s[0]);

  if (s0 < EPSILON) {
    return new Float64Array([0, 0, 0, 0]);
  }

  const polarizedSq = s[1] * s[1] + s[2] * s[2] + s[3] * s[3];
  const maxSq = s0 * s0;

  if (polarizedSq <= maxSq) {
    // Already valid
    return new Float64Array([s0, s[1], s[2], s[3]]);
  }

  // Scale down polarized components to satisfy constraint
  const scale = s0 / Math.sqrt(polarizedSq);
  return new Float64Array([s0, s[1] * scale, s[2] * scale, s[3] * scale]);
}

// ========== Arithmetic ==========

/**
 * Add two Stokes vectors (incoherent superposition).
 * S_out = S_a + S_b
 */
export function add(a: StokesVector, b: StokesVector): StokesVector {
  return new Float64Array([
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
    a[3] + b[3],
  ]);
}

/**
 * Scale a Stokes vector by a scalar factor.
 */
export function scale(s: StokesVector, factor: number): StokesVector {
  return new Float64Array([
    s[0] * factor,
    s[1] * factor,
    s[2] * factor,
    s[3] * factor,
  ]);
}

/**
 * Check approximate equality of two Stokes vectors.
 */
export function equals(a: StokesVector, b: StokesVector, tolerance: number = 1e-10): boolean {
  return (
    Math.abs(a[0] - b[0]) < tolerance &&
    Math.abs(a[1] - b[1]) < tolerance &&
    Math.abs(a[2] - b[2]) < tolerance &&
    Math.abs(a[3] - b[3]) < tolerance
  );
}

/**
 * Clone a Stokes vector.
 */
export function clone(s: StokesVector): StokesVector {
  return new Float64Array(s);
}

// ========== Serialization ==========

/**
 * Convert to a plain tuple for JSON serialization.
 */
export function toTuple(s: StokesVector): [number, number, number, number] {
  return [s[0], s[1], s[2], s[3]];
}

/**
 * Create from a plain tuple.
 */
export function fromTuple(t: [number, number, number, number]): StokesVector {
  return new Float64Array(t);
}

/**
 * Human-readable string representation.
 */
export function toString(s: StokesVector, precision: number = 6): string {
  return `[${s[0].toFixed(precision)}, ${s[1].toFixed(precision)}, ${s[2].toFixed(precision)}, ${s[3].toFixed(precision)}]`;
}
