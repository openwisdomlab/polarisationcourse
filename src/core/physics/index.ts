/**
 * Shared Physics Core - Barrel Export
 *
 * This module provides a unified physics library for polarized light simulation.
 * Used by both the 2D puzzle game and the Optical Design Studio.
 *
 * Usage:
 *   import { JonesVector, applyJonesMatrix, polarizerMatrix } from '@/core/physics'
 *   import { splitByBirefringence, checkSensorMatch } from '@/core/physics'
 */

// Export everything from the Jones calculus module
export * from './jones'

// Re-export commonly used types for convenience
export type {
  Complex,
  JonesVector,
  JonesMatrix,
  OpticalElementType,
  GameComponentType,
  PolarizationInfo,
  CrystalAxis,
  SplitBeamResult,
} from './jones'
