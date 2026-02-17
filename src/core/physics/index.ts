/**
 * Shared Physics Core - Barrel Export
 *
 * This module provides a unified physics library for polarized light simulation.
 * Used by both the 2D puzzle game and the Optical Design Studio.
 *
 * Usage:
 *   import { JonesVector, applyJonesMatrix, polarizerMatrix } from '@/core/physics'
 *   import { splitByBirefringence, checkSensorMatch } from '@/core/physics'
 *   import { SpectralJonesSolver, solveRGB } from '@/core/physics'
 */

// Export everything from the Jones calculus module
export * from './jones'

// Export spectral Jones solver for chromatic polarization
export * from './SpectralJonesSolver'

// Re-export commonly used types for convenience
export type {
  Complex,
  JonesVector,
  JonesMatrix,
  OpticalElementType,
  GameComponentType,
  LegacyPolarizationInfo,
  PolarizationInfo,
  CrystalAxis,
  SplitBeamResult,
} from './jones'

// Re-export spectral types
export type {
  SpectralJonesParams,
  RGBColor,
  SpectralAnalysis,
} from './SpectralJonesSolver'
