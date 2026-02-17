/**
 * Analytical Optics Core (解析光学核心)
 *
 * The "Truth" layer of the Digital Twin architecture.
 * All physics computations are deterministic: same input → same output.
 *
 * Core types:
 *   - StokesVector: Float64Array(4) — [S0, S1, S2, S3]
 *   - MuellerMatrix: Float64Array(16) — row-major 4×4
 *
 * Convention:
 *   - All angles in RADIANS internally
 *   - Wavelength in nanometers (nm)
 *   - Physical constraint: S1² + S2² + S3² ≤ S0²
 */

// ========== Stokes Vector ==========
export {
  type StokesVector,
  // Factory
  createStokes,
  createUnpolarized,
  createLinear,
  createHorizontal,
  createVertical,
  createDiagonal,
  createAntiDiagonal,
  createCircular,
  createElliptical,
  createPartiallyPolarized,
  // Derived quantities
  intensity,
  toDoLP,
  toAoLP,
  toDoCP,
  toDoP,
  toEllipticity,
  toOrientation,
  handedness,
  // Validation
  validate,
  clampToPhysical,
  // Arithmetic
  add as stokesAdd,
  scale as stokesScale,
  equals as stokesEquals,
  clone as stokesClone,
  // Serialization
  toTuple,
  fromTuple,
  toString as stokesToString,
} from './stokes';

// ========== Mueller Matrix ==========
export {
  type MuellerMatrix,
  // Element access
  mGet,
  mSet,
  // Factory: optical elements
  identity,
  linearPolarizer,
  generalRetarder,
  quarterWavePlate,
  halfWavePlate,
  rotator,
  depolarizer,
  partialDepolarizer,
  mirror,
  attenuator,
  dichroicPolarizer,
  // Matrix operations
  multiply,
  chainMueller,
  applyToStokes,
  mScale,
  mAdd,
  mTranspose,
  // Rotation
  rotationMatrix,
  // Validation
  isPhysical,
  depolarizationIndex,
  isNonDepolarizing,
  // Jones bridge
  fromJonesElements,
  fromLegacyJones,
  // Utility
  mClone,
  mEquals,
  mToString,
} from './mueller';

// ========== Fresnel Equations ==========
export {
  type FresnelAmplitudes,
  type FresnelAmplitudesComplex,
  fresnelAmplitudes,
  fresnelMuellerReflect,
  fresnelMuellerTransmit,
  brewsterAngle,
  criticalAngle,
  reflectanceS,
  reflectanceP,
  reflectanceAvg,
  REFRACTIVE_INDICES,
} from './fresnel';

// ========== Thin Film ==========
export {
  thinFilmMuellerReflect,
  thinFilmMuellerTransmit,
  phaseThickness,
  quarterWaveThickness,
  idealARCoating,
} from './thinfilm';
