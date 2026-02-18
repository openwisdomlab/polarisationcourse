/**
 * Physics Constants (物理常量统一定义)
 *
 * Centralized numerical thresholds and physical constants used across
 * the physics engine. All modules should import from here instead of
 * defining local epsilon values.
 *
 * @see src/core/api.ts — Public physics API facade
 * @see src/core/physics/unified/ — Unified physics engine
 */

// ============================================
// Numerical Thresholds (数值阈值)
// ============================================

/**
 * Epsilon for polarization angle comparisons (degrees).
 * Used when comparing polarization angles for equality.
 */
export const EPSILON_ANGLE = 1e-6

/**
 * Epsilon for intensity comparisons.
 * Light below this threshold is considered extinguished.
 */
export const EPSILON_INTENSITY = 1e-10

/**
 * Epsilon for general floating-point comparisons.
 * Used for matrix element, complex number, and coordinate comparisons.
 */
export const EPSILON_GENERAL = 1e-10

/**
 * Epsilon for degree-of-polarization comparisons.
 * States with DOP below this are considered unpolarized.
 */
export const EPSILON_DOP = 0.05

/**
 * Minimum intensity percentage for ray tracing continuation.
 * Rays below this threshold (in %) are terminated.
 */
export const RAY_INTENSITY_THRESHOLD = 1

/**
 * Maximum ray tracing depth (bounces/interactions).
 */
export const RAY_MAX_DEPTH = 10

/**
 * Maximum BFS iterations for voxel light propagation.
 */
export const VOXEL_MAX_ITERATIONS = 10000

/**
 * Energy threshold for voxel light propagation.
 * Propagation stops when normalized intensity drops below this.
 */
export const VOXEL_ENERGY_THRESHOLD = 0.01

// ============================================
// Physical Constants (物理常数)
// ============================================

/** Speed of light in vacuum (m/s) */
export const SPEED_OF_LIGHT = 299792458

/** Visible spectrum wavelength range (nm) */
export const VISIBLE_SPECTRUM = {
  min: 380,
  max: 780,
  red: 700,
  green: 550,
  blue: 450,
} as const

// ============================================
// Non-Ideal Device Parameters (非理想器件参数)
// ============================================

/**
 * Parameters for non-ideal polarizer simulation.
 * Extinction ratio, principal transmittance, and angular acceptance.
 */
export interface NonIdealPolarizerParams {
  /** Extinction ratio (e.g., 10000 means 10000:1) */
  extinctionRatio: number
  /** Principal transmittance (0-1, e.g., 0.92 means 92% transmission) */
  principalTransmittance: number
  /** Angular acceptance half-angle in degrees */
  angularAcceptance: number
}

/** Ideal polarizer: infinite extinction, perfect transmission */
export const IDEAL_POLARIZER: NonIdealPolarizerParams = {
  extinctionRatio: Infinity,
  principalTransmittance: 1.0,
  angularAcceptance: 90,
}

/** Typical high-quality polarizer (e.g., Glan-Thompson) */
export const TYPICAL_POLARIZER: NonIdealPolarizerParams = {
  extinctionRatio: 10000,
  principalTransmittance: 0.92,
  angularAcceptance: 15,
}

/** Low-quality polarizer (e.g., sheet polarizer) */
export const LOW_QUALITY_POLARIZER: NonIdealPolarizerParams = {
  extinctionRatio: 100,
  principalTransmittance: 0.75,
  angularAcceptance: 10,
}

// ============================================
// Default Beam Parameters (默认光束参数)
// ============================================

/** Default beam width in pixels for visualization */
export const DEFAULT_BEAM_WIDTH = 10

/** Default beam divergence in degrees (collimated) */
export const DEFAULT_BEAM_DIVERGENCE = 0
