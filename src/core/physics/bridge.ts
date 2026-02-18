/**
 * Physics Bridge (物理引擎桥接层)
 *
 * Conversion utilities between legacy Jones types (from deprecated JonesCalculus.ts)
 * and the unified physics engine types (CoherencyMatrix / PolarizationInfo).
 *
 * This module enables gradual migration: existing code that uses JonesVector tuples
 * can interoperate with the new PhysicsAPI without a full rewrite.
 *
 * Legacy types:
 *   JonesVector = [Complex, Complex]  where Complex = { re: number, im: number }
 *
 * Unified types:
 *   PolarizationInfo = opaque state from PhysicsAPI
 *   JonesRepresentation = { ex: Complex, ey: Complex }  where Complex class has .real/.imag
 *
 * @see src/core/api.ts — PhysicsAPI
 * @see src/core/physics/unified/PolarizationState.ts — JonesRepresentation
 */

import type { PolarizationInfo, PhysicsAPI, JonesRepresentation } from '@/core/api'
import { Complex as UnifiedComplex } from '@/core/math/Complex'

// ============================================
// Legacy Type Definitions (from JonesCalculus)
// ============================================

/**
 * Legacy complex number representation.
 * @deprecated Use Complex class from '@/core/math/Complex' instead.
 */
export interface LegacyComplex {
  re: number
  im: number
}

/**
 * Legacy Jones vector: [Ex, Ey] tuple.
 * @deprecated Use PolarizationInfo from PhysicsAPI instead.
 */
export type LegacyJonesVector = [LegacyComplex, LegacyComplex]

// ============================================
// Conversion Functions
// ============================================

/**
 * Convert a legacy JonesVector to PolarizationInfo via the unified PhysicsAPI.
 * This is the primary entry point for legacy code migrating to the unified API.
 */
export function legacyJonesToPolarizationInfo(
  jones: LegacyJonesVector,
  physics: PhysicsAPI
): PolarizationInfo {
  // Calculate intensity from Jones vector: |Ex|² + |Ey|²
  const intensity = jones[0].re ** 2 + jones[0].im ** 2 + jones[1].re ** 2 + jones[1].im ** 2

  if (intensity < 1e-10) {
    return physics.createLinearSource(0, 0)
  }

  // Calculate polarization angle from the dominant linear component
  const exMag2 = jones[0].re ** 2 + jones[0].im ** 2
  const eyMag2 = jones[1].re ** 2 + jones[1].im ** 2
  const angleDeg = Math.atan2(Math.sqrt(eyMag2), Math.sqrt(exMag2)) * 180 / Math.PI

  return physics.createLinearSource(angleDeg, intensity)
}

/**
 * Convert PolarizationInfo back to a legacy JonesVector.
 * Used when the result needs to be stored in legacy data structures
 * (e.g., LightSegment.jonesVector).
 */
export function polarizationInfoToLegacyJones(
  info: PolarizationInfo,
  physics: PhysicsAPI
): LegacyJonesVector {
  const jonesRepr = physics.toJones(info)
  if (jonesRepr) {
    return jonesRepresentationToLegacy(jonesRepr)
  }

  // Fallback for unpolarized/partially polarized states:
  // Create an approximate linear representation
  const angleRad = (info.angleDeg * Math.PI) / 180
  const amp = Math.sqrt(info.intensity)
  return [
    { re: amp * Math.cos(angleRad), im: 0 },
    { re: amp * Math.sin(angleRad), im: 0 },
  ]
}

/**
 * Convert JonesRepresentation (unified) to LegacyJonesVector.
 */
export function jonesRepresentationToLegacy(jr: JonesRepresentation): LegacyJonesVector {
  return [
    { re: jr.ex.real, im: jr.ex.imag },
    { re: jr.ey.real, im: jr.ey.imag },
  ]
}

/**
 * Convert LegacyJonesVector to JonesRepresentation (unified).
 */
export function legacyToJonesRepresentation(jv: LegacyJonesVector): JonesRepresentation {
  return {
    ex: new UnifiedComplex(jv[0].re, jv[0].im),
    ey: new UnifiedComplex(jv[1].re, jv[1].im),
  }
}

/**
 * Create a legacy JonesVector from polarization angle and intensity.
 * Replacement for the deprecated polarizationToJonesVector().
 */
export function createLegacyJonesVector(angleDeg: number, normalizedIntensity: number = 1.0): LegacyJonesVector {
  const rad = (angleDeg * Math.PI) / 180
  const amp = Math.sqrt(normalizedIntensity)
  return [
    { re: amp * Math.cos(rad), im: 0 },
    { re: amp * Math.sin(rad), im: 0 },
  ]
}

/**
 * Calculate intensity from a legacy JonesVector.
 * Replacement for the deprecated jonesIntensity().
 */
export function legacyJonesIntensity(jones: LegacyJonesVector): number {
  return jones[0].re ** 2 + jones[0].im ** 2 + jones[1].re ** 2 + jones[1].im ** 2
}

/**
 * Extract polarization angle (degrees) from a legacy JonesVector.
 * Replacement for the deprecated jonesVectorToPolarization().
 */
export function legacyJonesToAngle(jones: LegacyJonesVector): number {
  const exMag = Math.sqrt(jones[0].re ** 2 + jones[0].im ** 2)
  const eyMag = Math.sqrt(jones[1].re ** 2 + jones[1].im ** 2)
  if (exMag < 1e-10 && eyMag < 1e-10) return 0
  let angle = Math.atan2(eyMag, exMag) * 180 / Math.PI
  if (angle < 0) angle += 180
  return angle
}

/**
 * Analyze polarization state from a legacy JonesVector.
 * Replacement for the deprecated analyzePolarization().
 */
export function analyzeLegacyJones(jones: LegacyJonesVector): {
  type: 'linear' | 'circular' | 'elliptical'
  handedness: 'right' | 'left' | 'none'
  ellipticity: number
  angle: number
} {
  const exMag2 = jones[0].re ** 2 + jones[0].im ** 2
  const eyMag2 = jones[1].re ** 2 + jones[1].im ** 2
  const totalIntensity = exMag2 + eyMag2

  if (totalIntensity < 1e-10) {
    return { type: 'linear', handedness: 'none', ellipticity: 0, angle: 0 }
  }

  // Phase difference
  const phaseX = Math.atan2(jones[0].im, jones[0].re)
  const phaseY = Math.atan2(jones[1].im, jones[1].re)
  const phaseDiff = phaseY - phaseX

  const exAmp = Math.sqrt(exMag2)
  const eyAmp = Math.sqrt(eyMag2)

  // Calculate ellipticity parameter
  const sin2alpha = 2 * exAmp * eyAmp * Math.sin(phaseDiff) / totalIntensity
  const ellipticity = Math.asin(Math.max(-1, Math.min(1, sin2alpha))) * 180 / Math.PI / 45

  // Determine polarization type
  const absEllipticity = Math.abs(ellipticity)
  let type: 'linear' | 'circular' | 'elliptical'
  let handedness: 'right' | 'left' | 'none' = 'none'

  if (absEllipticity < 0.05) {
    type = 'linear'
  } else if (absEllipticity > 0.95) {
    type = 'circular'
    handedness = ellipticity > 0 ? 'right' : 'left'
  } else {
    type = 'elliptical'
    handedness = ellipticity > 0 ? 'right' : 'left'
  }

  const angle = Math.atan2(eyAmp, exAmp) * 180 / Math.PI

  return { type, handedness, ellipticity, angle }
}

// ============================================
// Legacy Complex Number Operations
// ============================================

/**
 * Legacy complex number operations.
 * @deprecated Use Complex class from '@/core/math/Complex' instead.
 */
export const legacyComplex = {
  create(re: number, im: number = 0): LegacyComplex {
    return { re, im }
  },

  add(a: LegacyComplex, b: LegacyComplex): LegacyComplex {
    return { re: a.re + b.re, im: a.im + b.im }
  },

  mul(a: LegacyComplex, b: LegacyComplex): LegacyComplex {
    return {
      re: a.re * b.re - a.im * b.im,
      im: a.re * b.im + a.im * b.re,
    }
  },

  scale(a: LegacyComplex, s: number): LegacyComplex {
    return { re: a.re * s, im: a.im * s }
  },

  conjugate(a: LegacyComplex): LegacyComplex {
    return { re: a.re, im: -a.im }
  },

  magnitude(a: LegacyComplex): number {
    return Math.sqrt(a.re ** 2 + a.im ** 2)
  },

  magnitudeSq(a: LegacyComplex): number {
    return a.re ** 2 + a.im ** 2
  },
}
