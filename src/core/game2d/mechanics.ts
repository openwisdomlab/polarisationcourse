/**
 * Advanced Game Mechanics for Master Class Campaign
 *
 * This module implements "Toys" - game objects that interact with the Jones
 * Physics engine in educational and fun ways.
 *
 * Design Philosophy:
 * - "Show, Don't Tell": Players learn concepts by failing puzzles, not reading text walls
 * - Multiple Solutions: Avoid pixel hunting - allow different optical setups
 * - Emergent Complexity: Simple rules create complex behaviors
 *
 * Phase 1 Components:
 * 1. QuantumLock - Sensor requiring >99% fidelity with target Jones vector
 * 2. InterferometerTarget - Dual-port sensor (Port A bright, Port B dark)
 * 3. OpticalMine - Obstacle that fails level if light > 5% touches it
 */

import {
  type JonesVector,
  type Complex,
  complex,
  jonesIntensity,
  normalizeJonesVector,
  analyzePolarization,
  polarizationToJonesVector,
  STANDARD_JONES_VECTORS,
} from '../JonesCalculus'

// ============================================
// Fidelity Calculation (Quantum State Overlap)
// ============================================

/**
 * Calculate quantum fidelity between two polarization states
 *
 * Fidelity Formula: F = |⟨ψ_target | ψ_input⟩|²
 *
 * This is the fundamental measure of how "similar" two quantum states are.
 * - F = 1.0: Perfect match (identical states)
 * - F = 0.5: Maximally distinguishable (orthogonal linear states)
 * - F = 0.0: Completely orthogonal
 *
 * @param target - Target Jones vector (what the sensor expects)
 * @param input - Input Jones vector (what the player sends)
 * @returns Fidelity value between 0 and 1
 */
export function calculateFidelity(target: JonesVector, input: JonesVector): number {
  // Normalize both vectors to unit intensity
  const targetNorm = normalizeJonesVector(target)
  const inputNorm = normalizeJonesVector(input)

  // Inner product: ⟨ψ_target | ψ_input⟩ = target*† × input
  // = (Ex_t*)×(Ex_i) + (Ey_t*)×(Ey_i)
  const innerProduct: Complex = complex.add(
    complex.mul(complex.conj(targetNorm[0]), inputNorm[0]),
    complex.mul(complex.conj(targetNorm[1]), inputNorm[1])
  )

  // Fidelity = |inner product|²
  return complex.abs2(innerProduct)
}

/**
 * Convert fidelity to a human-readable percentage
 * Also provides qualitative assessment
 */
export function fidelityToAssessment(fidelity: number): {
  percentage: string
  quality: 'perfect' | 'excellent' | 'good' | 'fair' | 'poor' | 'orthogonal'
  description: string
  descriptionZh: string
} {
  const percentage = (fidelity * 100).toFixed(2) + '%'

  if (fidelity >= 0.9999) {
    return {
      percentage,
      quality: 'perfect',
      description: 'Perfect quantum state match!',
      descriptionZh: '完美的量子态匹配！',
    }
  } else if (fidelity >= 0.99) {
    return {
      percentage,
      quality: 'excellent',
      description: 'Excellent fidelity - almost there!',
      descriptionZh: '优秀的保真度——接近目标！',
    }
  } else if (fidelity >= 0.90) {
    return {
      percentage,
      quality: 'good',
      description: 'Good match, but can be improved',
      descriptionZh: '不错的匹配，但还可以改进',
    }
  } else if (fidelity >= 0.70) {
    return {
      percentage,
      quality: 'fair',
      description: 'Partial match - significant error',
      descriptionZh: '部分匹配——误差较大',
    }
  } else if (fidelity >= 0.01) {
    return {
      percentage,
      quality: 'poor',
      description: 'Poor match - states are very different',
      descriptionZh: '较差的匹配——态相差很大',
    }
  } else {
    return {
      percentage,
      quality: 'orthogonal',
      description: 'States are orthogonal (completely different)',
      descriptionZh: '态正交（完全不同）',
    }
  }
}

// ============================================
// Standard Target States (常用目标态)
// ============================================

export const TARGET_STATES = {
  // Linear polarization states
  horizontal: STANDARD_JONES_VECTORS.horizontal,
  vertical: STANDARD_JONES_VECTORS.vertical,
  plus45: STANDARD_JONES_VECTORS.plus45,
  minus45: STANDARD_JONES_VECTORS.minus45,

  // Circular polarization states
  rightCircular: STANDARD_JONES_VECTORS.rightCircular,
  leftCircular: STANDARD_JONES_VECTORS.leftCircular,

  // Create custom linear state
  linear: (angleDeg: number): JonesVector => polarizationToJonesVector(angleDeg),

  // Create custom elliptical state (advanced)
  elliptical: (
    orientation: number,
    ellipticity: number,
    handedness: 'right' | 'left' = 'right'
  ): JonesVector => {
    // Convert orientation and ellipticity to Jones vector
    // |ψ⟩ = cos(χ)|θ⟩ + i×sin(χ)|θ+90°⟩ for RCP-biased
    const theta = (orientation * Math.PI) / 180
    const chi = ellipticity // Ellipticity angle in radians

    const cosTheta = Math.cos(theta)
    const sinTheta = Math.sin(theta)
    const cosChi = Math.cos(chi)
    const sinChi = Math.sin(chi)

    // Sign determines handedness
    const sign = handedness === 'right' ? 1 : -1

    return [
      complex.create(cosChi * cosTheta, -sign * sinChi * sinTheta),
      complex.create(cosChi * sinTheta, sign * sinChi * cosTheta),
    ]
  },
}

// ============================================
// QuantumLock - High-Fidelity Sensor
// ============================================

/**
 * Configuration for QuantumLock component
 */
export interface QuantumLockConfig {
  /** Target polarization state that unlocks the sensor */
  targetState: JonesVector

  /** Minimum fidelity required to activate (default: 0.99 = 99%) */
  requiredFidelity: number

  /** Minimum intensity required (default: 30) */
  requiredIntensity: number

  /** Display name for the target state */
  targetName?: string
  targetNameZh?: string

  /** Whether to show the target state visually (hint) */
  showTargetHint: boolean
}

/**
 * Result of QuantumLock evaluation
 */
export interface QuantumLockResult {
  /** Whether the lock is opened (activated) */
  activated: boolean

  /** Calculated fidelity between input and target */
  fidelity: number

  /** Received intensity */
  receivedIntensity: number

  /** Human-readable assessment */
  assessment: ReturnType<typeof fidelityToAssessment>

  /** Why did it fail? */
  failureReason?: 'low_intensity' | 'low_fidelity' | 'no_light'

  /** Debug info: received polarization analysis */
  receivedState?: ReturnType<typeof analyzePolarization>

  /** Debug info: target polarization analysis */
  targetState?: ReturnType<typeof analyzePolarization>
}

/**
 * Evaluate a QuantumLock - checks if received light matches target state
 *
 * @param received - Jones vector of received light (null if no light)
 * @param config - QuantumLock configuration
 */
export function evaluateQuantumLock(
  received: JonesVector | null,
  config: QuantumLockConfig
): QuantumLockResult {
  // No light case
  if (!received) {
    return {
      activated: false,
      fidelity: 0,
      receivedIntensity: 0,
      assessment: fidelityToAssessment(0),
      failureReason: 'no_light',
    }
  }

  const receivedIntensity = jonesIntensity(received)

  // Intensity check
  if (receivedIntensity < config.requiredIntensity) {
    return {
      activated: false,
      fidelity: 0,
      receivedIntensity,
      assessment: fidelityToAssessment(0),
      failureReason: 'low_intensity',
      receivedState: analyzePolarization(received),
      targetState: analyzePolarization(config.targetState),
    }
  }

  // Calculate fidelity
  const fidelity = calculateFidelity(config.targetState, received)
  const assessment = fidelityToAssessment(fidelity)

  // Fidelity check
  const activated = fidelity >= config.requiredFidelity

  return {
    activated,
    fidelity,
    receivedIntensity,
    assessment,
    failureReason: activated ? undefined : 'low_fidelity',
    receivedState: analyzePolarization(received),
    targetState: analyzePolarization(config.targetState),
  }
}

/**
 * Create default QuantumLock configuration for common states
 */
export const QuantumLockPresets = {
  /** Requires left-hand circular polarization */
  leftCircular: (): QuantumLockConfig => ({
    targetState: TARGET_STATES.leftCircular(),
    requiredFidelity: 0.99,
    requiredIntensity: 30,
    targetName: 'Left Circular (LCP)',
    targetNameZh: '左旋圆偏振',
    showTargetHint: true,
  }),

  /** Requires right-hand circular polarization */
  rightCircular: (): QuantumLockConfig => ({
    targetState: TARGET_STATES.rightCircular(),
    requiredFidelity: 0.99,
    requiredIntensity: 30,
    targetName: 'Right Circular (RCP)',
    targetNameZh: '右旋圆偏振',
    showTargetHint: true,
  }),

  /** Requires specific linear angle */
  linearAngle: (angleDeg: number): QuantumLockConfig => ({
    targetState: TARGET_STATES.linear(angleDeg),
    requiredFidelity: 0.99,
    requiredIntensity: 30,
    targetName: `Linear ${angleDeg}°`,
    targetNameZh: `线偏振 ${angleDeg}°`,
    showTargetHint: true,
  }),

  /** Ultra-precise lock (99.9% fidelity) - for expert puzzles */
  ultraPrecise: (targetState: JonesVector, name: string, nameZh: string): QuantumLockConfig => ({
    targetState,
    requiredFidelity: 0.999,
    requiredIntensity: 50,
    targetName: name,
    targetNameZh: nameZh,
    showTargetHint: false, // No hints for ultra-precise!
  }),
}

// ============================================
// InterferometerTarget - Dual-Port Sensor
// ============================================

/**
 * Configuration for InterferometerTarget
 *
 * This component simulates the output of a Mach-Zehnder or Michelson
 * interferometer where light must be routed to correct ports through
 * constructive/destructive interference control.
 */
export interface InterferometerTargetConfig {
  /** Port A should receive constructive interference (bright) */
  portA: {
    requiredIntensityMin: number // Minimum intensity (e.g., 80%)
    requiredIntensityMax: number // Maximum intensity (e.g., 100%)
  }

  /** Port B should receive destructive interference (dark) */
  portB: {
    requiredIntensityMin: number // Should be 0%
    requiredIntensityMax: number // Maximum allowed (e.g., 5%)
  }

  /** Labels for display */
  portAName?: string
  portBName?: string
  portANameZh?: string
  portBNameZh?: string
}

/**
 * Result of InterferometerTarget evaluation
 */
export interface InterferometerTargetResult {
  /** Whether both ports satisfy their requirements */
  activated: boolean

  /** Port A evaluation */
  portA: {
    satisfied: boolean
    receivedIntensity: number
    required: string // e.g., "80-100%"
  }

  /** Port B evaluation */
  portB: {
    satisfied: boolean
    receivedIntensity: number
    required: string // e.g., "0-5%"
  }

  /** Interference quality metric (how perfect is the cancellation?) */
  contrastRatio: number // Ideal: infinity (A=100%, B=0%)

  /** Visibility V = (I_max - I_min) / (I_max + I_min) */
  visibility: number // 0-1, where 1 is perfect
}

/**
 * Evaluate an InterferometerTarget
 *
 * @param portAIntensity - Light intensity arriving at Port A
 * @param portBIntensity - Light intensity arriving at Port B
 * @param config - InterferometerTarget configuration
 */
export function evaluateInterferometerTarget(
  portAIntensity: number,
  portBIntensity: number,
  config: InterferometerTargetConfig
): InterferometerTargetResult {
  // Evaluate Port A (should be bright)
  const portASatisfied =
    portAIntensity >= config.portA.requiredIntensityMin &&
    portAIntensity <= config.portA.requiredIntensityMax

  // Evaluate Port B (should be dark)
  const portBSatisfied =
    portBIntensity >= config.portB.requiredIntensityMin &&
    portBIntensity <= config.portB.requiredIntensityMax

  // Calculate contrast ratio (avoid division by zero)
  const contrastRatio =
    portBIntensity > 0.01 ? portAIntensity / portBIntensity : portAIntensity > 0 ? Infinity : 0

  // Calculate visibility (fringe contrast)
  const iMax = Math.max(portAIntensity, portBIntensity)
  const iMin = Math.min(portAIntensity, portBIntensity)
  const visibility = iMax + iMin > 0 ? (iMax - iMin) / (iMax + iMin) : 0

  return {
    activated: portASatisfied && portBSatisfied,
    portA: {
      satisfied: portASatisfied,
      receivedIntensity: portAIntensity,
      required: `${config.portA.requiredIntensityMin}-${config.portA.requiredIntensityMax}%`,
    },
    portB: {
      satisfied: portBSatisfied,
      receivedIntensity: portBIntensity,
      required: `${config.portB.requiredIntensityMin}-${config.portB.requiredIntensityMax}%`,
    },
    contrastRatio,
    visibility,
  }
}

/**
 * Create default InterferometerTarget configurations
 */
export const InterferometerTargetPresets = {
  /** Standard Mach-Zehnder: 100% to A, 0% to B */
  machZehnder: (): InterferometerTargetConfig => ({
    portA: { requiredIntensityMin: 90, requiredIntensityMax: 100 },
    portB: { requiredIntensityMin: 0, requiredIntensityMax: 5 },
    portAName: 'Bright Port',
    portBName: 'Dark Port',
    portANameZh: '亮端口',
    portBNameZh: '暗端口',
  }),

  /** Balanced: 50% to each port (for calibration) */
  balanced: (): InterferometerTargetConfig => ({
    portA: { requiredIntensityMin: 45, requiredIntensityMax: 55 },
    portB: { requiredIntensityMin: 45, requiredIntensityMax: 55 },
    portAName: 'Port A',
    portBName: 'Port B',
    portANameZh: '端口A',
    portBNameZh: '端口B',
  }),

  /** Inverted: 0% to A, 100% to B (phase shifted) */
  inverted: (): InterferometerTargetConfig => ({
    portA: { requiredIntensityMin: 0, requiredIntensityMax: 5 },
    portB: { requiredIntensityMin: 90, requiredIntensityMax: 100 },
    portAName: 'Dark Port',
    portBName: 'Bright Port',
    portANameZh: '暗端口',
    portBNameZh: '亮端口',
  }),

  /** Expert: Ultra-precise cancellation (<1% at dark port) */
  ultraPrecise: (): InterferometerTargetConfig => ({
    portA: { requiredIntensityMin: 95, requiredIntensityMax: 100 },
    portB: { requiredIntensityMin: 0, requiredIntensityMax: 1 },
    portAName: 'Constructive',
    portBName: 'Destructive',
    portANameZh: '相长',
    portBNameZh: '相消',
  }),
}

// ============================================
// OpticalMine - Danger Zone
// ============================================

/**
 * Configuration for OpticalMine
 *
 * An obstacle that "explodes" (fails the level) if touched by light
 * above a threshold. Players must route light around it or use
 * polarization tricks to reduce intensity below the threshold.
 */
export interface OpticalMineConfig {
  /** Intensity threshold that triggers the mine (default: 5%) */
  triggerThreshold: number

  /** Grace period in ms before mine arms (for visual feedback) */
  armingDelay?: number

  /** What happens when triggered */
  triggerEffect: 'fail_level' | 'absorb' | 'scatter'

  /** Can the mine be deactivated by specific polarization? */
  safeState?: {
    /** Polarization state that won't trigger the mine */
    safeJones: JonesVector
    /** Tolerance for safe state matching */
    tolerance: number
  }
}

/**
 * Result of OpticalMine evaluation
 */
export interface OpticalMineResult {
  /** Whether the mine was triggered (boom!) */
  triggered: boolean

  /** Received intensity */
  receivedIntensity: number

  /** Was it in safe state? */
  inSafeState: boolean

  /** Warning level (0-1, where 1 = triggered) */
  dangerLevel: number

  /** Message to display */
  message?: string
  messageZh?: string
}

/**
 * Evaluate an OpticalMine
 *
 * @param received - Jones vector of received light (null if no light)
 * @param config - OpticalMine configuration
 */
export function evaluateOpticalMine(
  received: JonesVector | null,
  config: OpticalMineConfig
): OpticalMineResult {
  // No light = safe
  if (!received) {
    return {
      triggered: false,
      receivedIntensity: 0,
      inSafeState: true,
      dangerLevel: 0,
    }
  }

  const receivedIntensity = jonesIntensity(received)

  // Check for safe state (e.g., specific circular polarization passes through)
  let inSafeState = false
  if (config.safeState) {
    const fidelity = calculateFidelity(config.safeState.safeJones, received)
    inSafeState = fidelity >= config.safeState.tolerance
  }

  // Calculate danger level (0-1)
  const dangerLevel = Math.min(1, receivedIntensity / config.triggerThreshold)

  // Check if triggered
  const triggered = receivedIntensity >= config.triggerThreshold && !inSafeState

  return {
    triggered,
    receivedIntensity,
    inSafeState,
    dangerLevel,
    message: triggered ? 'MINE TRIGGERED! Level Failed.' : undefined,
    messageZh: triggered ? '触发地雷！关卡失败。' : undefined,
  }
}

/**
 * Create default OpticalMine configurations
 */
export const OpticalMinePresets = {
  /** Standard mine: triggers at 5% intensity */
  standard: (): OpticalMineConfig => ({
    triggerThreshold: 5,
    triggerEffect: 'fail_level',
  }),

  /** Sensitive mine: triggers at 1% intensity (expert levels) */
  sensitive: (): OpticalMineConfig => ({
    triggerThreshold: 1,
    triggerEffect: 'fail_level',
  }),

  /** Polarization-safe mine: LCP light passes through safely */
  lcpSafe: (): OpticalMineConfig => ({
    triggerThreshold: 5,
    triggerEffect: 'fail_level',
    safeState: {
      safeJones: TARGET_STATES.leftCircular(),
      tolerance: 0.9,
    },
  }),

  /** Polarization-safe mine: RCP light passes through safely */
  rcpSafe: (): OpticalMineConfig => ({
    triggerThreshold: 5,
    triggerEffect: 'fail_level',
    safeState: {
      safeJones: TARGET_STATES.rightCircular(),
      tolerance: 0.9,
    },
  }),

  /** Absorber mine: doesn't fail, just absorbs light */
  absorber: (): OpticalMineConfig => ({
    triggerThreshold: 50,
    triggerEffect: 'absorb',
  }),
}

// ============================================
// Polarization Ellipse Visualization Data
// ============================================

/**
 * Generate SVG path data for a polarization ellipse
 *
 * This is used to visualize both target and actual polarization states.
 * The ellipse shows:
 * - Orientation (major axis angle)
 * - Ellipticity (shape from line to circle)
 * - Handedness (rotation direction, shown with arrow)
 */
export interface PolarizationEllipseData {
  /** SVG path for the ellipse */
  path: string

  /** Major axis length (normalized) */
  majorAxis: number

  /** Minor axis length (normalized) */
  minorAxis: number

  /** Orientation angle in degrees */
  orientation: number

  /** Handedness indicator position (for arrow) */
  arrowPosition: { x: number; y: number; angle: number }

  /** Color based on polarization type */
  color: string

  /** Label for the state */
  label: string
}

/**
 * Generate ellipse visualization data from Jones vector
 *
 * @param jones - Jones vector to visualize
 * @param scale - Scale factor for the ellipse (default: 10)
 */
export function generateEllipseData(jones: JonesVector, scale: number = 10): PolarizationEllipseData {
  const analysis = analyzePolarization(jones)
  const intensity = jonesIntensity(jones)

  // Normalize intensity for visualization
  const normalizedIntensity = Math.min(1, intensity / 100)
  const baseScale = scale * Math.sqrt(normalizedIntensity)

  // Calculate semi-axes from ellipticity
  // χ = ellipticity angle, a = cos(χ), b = sin(χ)
  const chi = analysis.ellipticity
  const cosChi = Math.cos(Math.abs(chi))
  const sinChi = Math.sin(Math.abs(chi))

  const majorAxis = baseScale * cosChi
  const minorAxis = baseScale * sinChi

  // Generate SVG ellipse path
  const theta = (analysis.orientation * Math.PI) / 180
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  // Create ellipse path using parametric form
  // (a×cos(t)×cos(θ) - b×sin(t)×sin(θ), a×cos(t)×sin(θ) + b×sin(t)×cos(θ))
  let path = ''
  const steps = 36
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const x = majorAxis * Math.cos(t) * cosTheta - minorAxis * Math.sin(t) * sinTheta
    const y = majorAxis * Math.cos(t) * sinTheta + minorAxis * Math.sin(t) * cosTheta
    path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  path += ' Z'

  // Arrow position (at t = 0, on the major axis)
  const arrowX = majorAxis * cosTheta
  const arrowY = majorAxis * sinTheta
  // Arrow direction depends on handedness
  const arrowAngle = analysis.orientation + (analysis.handedness === 'right' ? 90 : -90)

  // Color based on type
  let color: string
  let label: string
  switch (analysis.type) {
    case 'linear':
      color = '#22c55e' // Green for linear
      label = `Linear ${Math.round(analysis.orientation)}°`
      break
    case 'circular':
      color = analysis.handedness === 'right' ? '#f97316' : '#8b5cf6' // Orange RCP, Purple LCP
      label = analysis.handedness === 'right' ? 'RCP' : 'LCP'
      break
    case 'elliptical':
      color = '#eab308' // Yellow for elliptical
      label = `Elliptical ${Math.round(analysis.orientation)}°`
      break
  }

  return {
    path,
    majorAxis,
    minorAxis,
    orientation: analysis.orientation,
    arrowPosition: { x: arrowX, y: arrowY, angle: arrowAngle },
    color,
    label,
  }
}

// ============================================
// Fidelity Bar Visualization
// ============================================

/**
 * Generate data for fidelity progress bar
 *
 * Used in QuantumLock to show how close the player is to the target.
 */
export interface FidelityBarData {
  /** Percentage fill (0-100) */
  fillPercent: number

  /** Color gradient based on fidelity */
  color: string

  /** Threshold marker position (where required fidelity is) */
  thresholdPercent: number

  /** Text to display */
  displayText: string
}

export function generateFidelityBarData(
  fidelity: number,
  requiredFidelity: number
): FidelityBarData {
  const fillPercent = fidelity * 100
  const thresholdPercent = requiredFidelity * 100

  // Color: red < 50%, orange 50-90%, yellow 90-99%, green 99%+
  let color: string
  if (fidelity >= requiredFidelity) {
    color = '#22c55e' // Green - success!
  } else if (fidelity >= 0.9) {
    color = '#eab308' // Yellow - almost there
  } else if (fidelity >= 0.5) {
    color = '#f97316' // Orange - getting warmer
  } else {
    color = '#ef4444' // Red - cold
  }

  return {
    fillPercent,
    color,
    thresholdPercent,
    displayText: `${fillPercent.toFixed(1)}% / ${thresholdPercent}%`,
  }
}

// ============================================
// Component Type Definitions for Game Integration
// ============================================

/**
 * Extended OpticalComponent properties for advanced mechanics
 */
export interface AdvancedComponentProps {
  // QuantumLock properties
  quantumLockConfig?: QuantumLockConfig
  quantumLockResult?: QuantumLockResult

  // InterferometerTarget properties
  interferometerConfig?: InterferometerTargetConfig
  interferometerResult?: InterferometerTargetResult

  // OpticalMine properties
  opticalMineConfig?: OpticalMineConfig
  opticalMineResult?: OpticalMineResult
}

/**
 * Helper to check if level is failed due to mine trigger
 */
export function checkLevelFailed(mineResults: OpticalMineResult[]): boolean {
  return mineResults.some(
    (result) => result.triggered && result.receivedIntensity > 0
  )
}

/**
 * Helper to check if all quantum locks are opened
 */
export function checkAllQuantumLocksOpen(lockResults: QuantumLockResult[]): boolean {
  return lockResults.every((result) => result.activated)
}

/**
 * Helper to check if interferometer target is satisfied
 */
export function checkInterferometerSatisfied(result: InterferometerTargetResult): boolean {
  return result.activated
}
