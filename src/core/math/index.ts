/**
 * Core Math Library for the Unified Physics Engine
 *
 * Provides high-precision mathematical primitives for optical calculations:
 * - Complex numbers with advanced operations (exp, sqrt, pow)
 * - 2×2 complex matrices for Jones calculus
 * - 3D vectors for ray tracing and basis computations
 */

export { Complex, complexMul, complexAdd, complexMagSq } from './Complex';
export {
  Matrix2x2,
  jonesLinearPolarizer,
  jonesWavePlate,
  jonesRotator
} from './Matrix2x2';
export {
  Vector3,
  buildOrthonormalBasis,
  rotateAroundAxis,
  signedAngle
} from './Vector3';
