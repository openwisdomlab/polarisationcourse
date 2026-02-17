/**
 * Shared Jones Calculus Core for 2D Game and Optical Studio
 *
 * This module provides a unified physics library that both the 2D puzzle game
 * and the Optical Design Studio can use. It re-exports core functionality from
 * JonesCalculus.ts and adds game-specific utility functions.
 *
 * Key Features:
 * - Full Jones vector/matrix algebra for accurate polarization simulation
 * - Support for linear, circular, and elliptical polarization
 * - Game-optimized component matrix generators
 * - Beam splitting with proper O-ray/E-ray calculations
 */

// Re-export all core types and functions from JonesCalculus
export {
  // Types
  type Complex,
  type JonesVector,
  type JonesMatrix,
  type OpticalElementType,

  // Complex number operations
  complex,

  // Jones vector operations
  jonesVector,
  polarizationToJonesVector,
  jonesVectorToPolarization,
  jonesIntensity,
  normalizeJonesVector,
  analyzePolarization,
  STANDARD_JONES_VECTORS,

  // Jones matrix operations
  applyJonesMatrix,
  multiplyJonesMatrices,
  identityMatrix,

  // Standard optical element matrices
  polarizerMatrix,
  halfWavePlateMatrix,
  quarterWavePlateMatrix,
  retarderMatrix,
  rotatorMatrix,
  partialPolarizerMatrix,
  mirrorMatrix,

  // Utility function
  getJonesMatrix,
} from '../JonesCalculus'

import {
  type JonesVector,
  type JonesMatrix,
  complex,
  applyJonesMatrix,
  jonesIntensity,
  polarizationToJonesVector,
  jonesVectorToPolarization,
  analyzePolarization,
  polarizerMatrix,
  rotatorMatrix,
  identityMatrix,
  normalizeJonesVector,
  halfWavePlateMatrix,
  quarterWavePlateMatrix,
} from '../JonesCalculus'

// ============================================
// Game-Specific Component Types
// ============================================

/**
 * Component types supported in the 2D puzzle game
 */
export type GameComponentType =
  | 'emitter'
  | 'polarizer'
  | 'mirror'
  | 'splitter'
  | 'rotator'
  | 'sensor'
  | 'halfWavePlate'
  | 'quarterWavePlate'

/**
 * Result of polarization analysis with game-friendly properties.
 * Renamed to avoid conflict with the unified API's PolarizationInfo in core/api.ts.
 * @see PolarizationInfo in core/api.ts for the unified API equivalent
 */
export interface LegacyPolarizationInfo {
  type: 'linear' | 'circular' | 'elliptical'
  angle: number // Orientation angle in degrees [0, 180)
  intensity: number // Total intensity |Ex|² + |Ey|²
  ellipticity: number // Ellipticity angle χ (-π/4 to π/4)
  handedness: 'right' | 'left' | 'none'
}

/** @deprecated Use LegacyPolarizationInfo */
export type PolarizationInfo = LegacyPolarizationInfo

// ============================================
// Game-Optimized Jones Vector Utilities
// ============================================

/**
 * Create a Jones vector for an emitter with specified polarization
 * @param angleDeg - Polarization angle in degrees (0° = horizontal)
 * @param intensity - Light intensity (default 100 for game compatibility)
 * @param isCircular - If true, creates circular polarization
 * @param handedness - 'right' or 'left' for circular polarization
 */
export function createEmitterJones(
  angleDeg: number,
  intensity: number = 100,
  isCircular: boolean = false,
  handedness: 'right' | 'left' = 'right'
): JonesVector {
  const amplitude = Math.sqrt(intensity)

  if (isCircular) {
    // Circular polarization: [1, ±i] / √2 scaled by amplitude
    const scale = amplitude / Math.SQRT2
    return handedness === 'right'
      ? [complex.create(scale), complex.create(0, -scale)] // RCP
      : [complex.create(scale), complex.create(0, scale)] // LCP
  }

  // Linear polarization at specified angle
  const theta = (angleDeg * Math.PI) / 180
  return [
    complex.create(amplitude * Math.cos(theta)),
    complex.create(amplitude * Math.sin(theta)),
  ]
}

/**
 * Scale a Jones vector by intensity factor (preserving polarization state)
 * @param jones - Input Jones vector
 * @param factor - Intensity factor (0-1 for attenuation)
 */
export function scaleJonesIntensity(jones: JonesVector, factor: number): JonesVector {
  const scale = Math.sqrt(factor)
  return [complex.scale(jones[0], scale), complex.scale(jones[1], scale)]
}

/**
 * Get complete polarization info from a Jones vector (game-friendly format)
 */
export function getJonesPolarizationInfo(jones: JonesVector): LegacyPolarizationInfo {
  const analysis = analyzePolarization(jones)
  const intensity = jonesIntensity(jones)
  const angle = jonesVectorToPolarization(jones)

  return {
    type: analysis.type,
    angle,
    intensity,
    ellipticity: analysis.ellipticity,
    handedness: analysis.handedness,
  }
}

// ============================================
// Game Component Matrix Generators
// ============================================

/**
 * Get Jones matrix for a game component
 * @param type - Component type
 * @param angleDeg - Component angle/orientation
 * @param rotationAmount - For rotators, the rotation amount (45 or 90)
 */
export function getComponentMatrix(
  type: GameComponentType,
  angleDeg: number,
  rotationAmount?: number
): JonesMatrix {
  switch (type) {
    case 'polarizer':
      return polarizerMatrix(angleDeg)

    case 'rotator':
      // Rotators rotate polarization plane without intensity loss
      return rotatorMatrix(rotationAmount ?? 45)

    case 'halfWavePlate':
      // λ/2 plate: flips polarization about fast axis
      return halfWavePlateMatrix(angleDeg)

    case 'quarterWavePlate':
      // λ/4 plate: converts linear ↔ circular
      return quarterWavePlateMatrix(angleDeg)

    case 'mirror':
      // Mirror reflection preserves polarization state for normal incidence
      // The direction change is handled separately in ray tracing
      return identityMatrix()

    case 'emitter':
    case 'sensor':
    case 'splitter':
      // These don't have associated matrices (handled specially)
      return identityMatrix()

    default:
      return identityMatrix()
  }
}

// ============================================
// Birefringent Splitter (Calcite Crystal)
// ============================================

/**
 * Crystal axis definition for birefringent splitting
 */
export interface CrystalAxis {
  /** Ordinary ray axis angle in degrees (default: 0° = horizontal) */
  oAxisAngle: number
  /** Extraordinary ray axis angle (always perpendicular to o-axis) */
  eAxisAngle: number
}

/**
 * Result of birefringent beam splitting
 */
export interface SplitBeamResult {
  /** Ordinary ray Jones vector (polarized along o-axis) */
  oRay: JonesVector
  /** Extraordinary ray Jones vector (polarized along e-axis) */
  eRay: JonesVector
  /** O-ray intensity */
  oIntensity: number
  /** E-ray intensity */
  eIntensity: number
  /** O-ray polarization angle (always = oAxisAngle) */
  oPolarization: number
  /** E-ray polarization angle (always = eAxisAngle) */
  ePolarization: number
}

/**
 * Split a Jones vector using birefringent crystal projection
 *
 * This properly calculates O-ray and E-ray by projecting the input
 * Jones vector onto the crystal's ordinary and extraordinary axes.
 *
 * Physics: I_o = |J · ô|², I_e = |J · ê|²
 * where ô and ê are unit vectors along crystal axes.
 *
 * @param input - Input Jones vector
 * @param crystalAxis - Crystal axis orientation (default: o-axis at 0°)
 */
export function splitByBirefringence(
  input: JonesVector,
  crystalAxis: CrystalAxis = { oAxisAngle: 0, eAxisAngle: 90 }
): SplitBeamResult {
  const { oAxisAngle, eAxisAngle } = crystalAxis

  // Convert axis angles to radians
  const oTheta = (oAxisAngle * Math.PI) / 180
  const eTheta = (eAxisAngle * Math.PI) / 180

  // Create unit vectors for crystal axes
  const oAxisUnit: JonesVector = [
    complex.create(Math.cos(oTheta)),
    complex.create(Math.sin(oTheta)),
  ]
  const eAxisUnit: JonesVector = [
    complex.create(Math.cos(eTheta)),
    complex.create(Math.sin(eTheta)),
  ]

  // Project input onto o-axis: (J · ô*) × ô
  // For real unit vectors, this simplifies to (Ex*cos(θ) + Ey*sin(θ)) × [cos(θ), sin(θ)]
  const oProjection = complex.add(
    complex.mul(input[0], complex.conj(oAxisUnit[0])),
    complex.mul(input[1], complex.conj(oAxisUnit[1]))
  )
  const oRay: JonesVector = [
    complex.mul(oProjection, oAxisUnit[0]),
    complex.mul(oProjection, oAxisUnit[1]),
  ]

  // Project input onto e-axis: (J · ê*) × ê
  const eProjection = complex.add(
    complex.mul(input[0], complex.conj(eAxisUnit[0])),
    complex.mul(input[1], complex.conj(eAxisUnit[1]))
  )
  const eRay: JonesVector = [
    complex.mul(eProjection, eAxisUnit[0]),
    complex.mul(eProjection, eAxisUnit[1]),
  ]

  // Calculate intensities
  const oIntensity = jonesIntensity(oRay)
  const eIntensity = jonesIntensity(eRay)

  return {
    oRay,
    eRay,
    oIntensity,
    eIntensity,
    oPolarization: oAxisAngle,
    ePolarization: eAxisAngle,
  }
}

/**
 * Simplified splitter for game use - projects onto horizontal (0°) and vertical (90°) axes
 * This matches the legacy behavior but uses Jones calculus
 *
 * @param input - Input Jones vector
 */
export function splitBeamSimple(input: JonesVector): SplitBeamResult {
  return splitByBirefringence(input, { oAxisAngle: 0, eAxisAngle: 90 })
}

// ============================================
// Polarization Matching (for Sensors)
// ============================================

/**
 * Calculate how well two polarization states match (fidelity)
 *
 * For pure states, fidelity F = |⟨ψ₁|ψ₂⟩|²
 * Returns 1.0 for perfect match, 0.0 for orthogonal states
 *
 * @param jones1 - First Jones vector (normalized internally)
 * @param jones2 - Second Jones vector (normalized internally)
 */
export function polarizationFidelity(jones1: JonesVector, jones2: JonesVector): number {
  const n1 = normalizeJonesVector(jones1)
  const n2 = normalizeJonesVector(jones2)

  // Inner product: ⟨ψ₁|ψ₂⟩ = Ex1* × Ex2 + Ey1* × Ey2
  const innerProduct = complex.add(
    complex.mul(complex.conj(n1[0]), n2[0]),
    complex.mul(complex.conj(n1[1]), n2[1])
  )

  // Fidelity = |⟨ψ₁|ψ₂⟩|²
  return complex.abs2(innerProduct)
}

/**
 * Check if received light matches sensor requirements
 *
 * @param received - Received Jones vector
 * @param requiredPolarization - Required polarization angle (undefined = any)
 * @param requiredIntensity - Minimum required intensity
 * @param toleranceDeg - Angular tolerance in degrees (default: 15°)
 */
export function checkSensorMatch(
  received: JonesVector,
  requiredPolarization: number | undefined,
  requiredIntensity: number,
  toleranceDeg: number = 15
): { matches: boolean; fidelity: number; intensity: number } {
  const intensity = jonesIntensity(received)

  // Check intensity requirement
  if (intensity < requiredIntensity) {
    return { matches: false, fidelity: 0, intensity }
  }

  // If no polarization requirement, any state matches
  if (requiredPolarization === undefined) {
    return { matches: true, fidelity: 1, intensity }
  }

  // Create target Jones vector for comparison
  const target = polarizationToJonesVector(requiredPolarization)
  const fidelity = polarizationFidelity(received, target)

  // Calculate angular tolerance in terms of fidelity
  // cos²(θ) where θ is the angular difference
  const toleranceRad = (toleranceDeg * Math.PI) / 180
  const minFidelity = Math.pow(Math.cos(toleranceRad), 2)

  return {
    matches: fidelity >= minFidelity,
    fidelity,
    intensity,
  }
}

// ============================================
// Malus's Law (Jones Matrix Form)
// ============================================

/**
 * Apply Malus's law using Jones matrix formulation
 *
 * This is equivalent to the scalar cos²(θ) formula but operates on
 * the full Jones vector, preserving phase information.
 *
 * @param input - Input Jones vector
 * @param filterAngle - Polarizer transmission axis angle in degrees
 * @returns Output Jones vector after passing through polarizer
 */
export function applyMalusLawJones(input: JonesVector, filterAngle: number): JonesVector {
  const matrix = polarizerMatrix(filterAngle)
  return applyJonesMatrix(matrix, input)
}

/**
 * Calculate output intensity using Malus's law (scalar form)
 * Provided for backward compatibility with existing game code
 *
 * @param inputIntensity - Input light intensity
 * @param inputAngle - Input polarization angle in degrees
 * @param filterAngle - Polarizer angle in degrees
 */
export function malusLawIntensity(
  inputIntensity: number,
  inputAngle: number,
  filterAngle: number
): number {
  let angleDiff = Math.abs(inputAngle - filterAngle)
  if (angleDiff > 90) {
    angleDiff = 180 - angleDiff
  }
  const radians = (angleDiff * Math.PI) / 180
  return inputIntensity * Math.pow(Math.cos(radians), 2)
}

// ============================================
// Conversion Utilities
// ============================================

/**
 * Convert legacy scalar polarization to Jones vector
 * @param angle - Polarization angle in degrees
 * @param intensity - Light intensity
 */
export function scalarToJones(angle: number, intensity: number): JonesVector {
  return polarizationToJonesVector(angle, intensity)
}

/**
 * Convert Jones vector to legacy scalar format
 * @param jones - Jones vector
 * @returns Object with polarization angle and intensity
 */
export function jonesToScalar(jones: JonesVector): { angle: number; intensity: number } {
  return {
    angle: jonesVectorToPolarization(jones),
    intensity: jonesIntensity(jones),
  }
}

/**
 * Check if a Jones vector represents (approximately) linear polarization
 */
export function isLinearPolarization(jones: JonesVector, tolerance: number = 0.01): boolean {
  const analysis = analyzePolarization(jones)
  return analysis.type === 'linear' || Math.abs(analysis.ellipticity) < tolerance
}

/**
 * Check if a Jones vector represents (approximately) circular polarization
 */
export function isCircularPolarization(jones: JonesVector, tolerance: number = 0.05): boolean {
  const analysis = analyzePolarization(jones)
  return (
    analysis.type === 'circular' ||
    Math.abs(Math.abs(analysis.ellipticity) - Math.PI / 4) < tolerance
  )
}
