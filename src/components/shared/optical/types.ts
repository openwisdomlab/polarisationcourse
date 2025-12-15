/**
 * Optical Components Types - 光学元件共享类型定义
 *
 * Extended for Jones Calculus support (Phase 1 of PolarQuest overhaul)
 */

import type { Direction2D } from '@/lib/opticsPhysics'
import type { JonesVector, PolarizationInfo } from '@/core/physics'

// 光学元件类型 (extended for advanced physics)
export type OpticalComponentType =
  | 'emitter'
  | 'polarizer'
  | 'mirror'
  | 'splitter'
  | 'rotator'
  | 'sensor'
  // Advanced components for interference puzzles
  | 'halfWavePlate'       // λ/2 plate - flips polarization about fast axis
  | 'quarterWavePlate'    // λ/4 plate - converts linear ↔ circular
  | 'phaseShifter'        // Introduces phase delay without changing polarization
  | 'beamCombiner'        // Combines two beams coherently (for interference)
  | 'circularFilter'      // Passes only RCP or LCP light
  | 'coincidenceCounter'  // Requires TWO beams with specific phase relationship
  | 'opticalIsolator'     // One-way light valve (blocks back-reflection)
  // Optical Detective mode - Mystery Box components
  | 'mysteryBox'          // Hidden optical element - player must deduce its identity
  // Master Class Campaign - Advanced Mechanics
  | 'quantumLock'         // High-fidelity sensor requiring >99% Jones vector match
  | 'interferometerTarget' // Dual-port sensor (bright/dark port requirements)
  | 'opticalMine'         // Danger zone - triggers level fail if light > threshold

// 光学元件基础接口
export interface OpticalComponent {
  id: string
  type: OpticalComponentType
  x: number                      // 位置百分比 (0-100)
  y: number                      // 位置百分比 (0-100)
  angle: number                  // 旋转角度 (fast axis for wave plates)
  polarizationAngle?: number     // 偏振角度 (用于polarizer和emitter)
  rotationAmount?: number        // 旋转量 (用于rotator: 45或90)
  locked: boolean                // 是否锁定
  direction?: Direction2D        // 发射方向 (用于emitter)
  requiredIntensity?: number     // 所需强度 (用于sensor)
  requiredPolarization?: number  // 所需偏振 (用于sensor, linear angle)

  // === Advanced Jones Calculus Properties ===

  /**
   * Initial Jones vector for emitters (overrides polarizationAngle)
   * Allows circular and elliptical polarization emission
   */
  initialJones?: JonesVector

  /**
   * Emitter polarization type: 'linear' | 'circular' | 'elliptical'
   */
  emitterPolarizationType?: 'linear' | 'circular' | 'elliptical'

  /**
   * Handedness for circular/elliptical emitters ('right' = RCP, 'left' = LCP)
   */
  handedness?: 'right' | 'left'

  /**
   * Required Jones vector for sensors (for circular/elliptical matching)
   * When set, sensor uses fidelity matching instead of angle matching
   */
  requiredJones?: JonesVector

  /**
   * Required polarization type for sensors
   */
  requiredPolarizationType?: 'linear' | 'circular' | 'any'

  /**
   * Crystal axis angle for splitters (default: 0° = o-axis horizontal)
   */
  crystalAxisAngle?: number

  /**
   * Phase shift in degrees for phaseShifter component (default: 90)
   */
  phaseShift?: number

  /**
   * Filter handedness for circularFilter ('right' or 'left')
   */
  filterHandedness?: 'right' | 'left'

  /**
   * Linked component ID for beam combiners
   */
  linkedComponentId?: string

  // === Coincidence Counter Properties ===

  /**
   * Required number of beams for coincidenceCounter (default: 2)
   */
  requiredBeamCount?: number

  /**
   * Required phase difference between beams in degrees for coincidenceCounter
   * 0 = constructive, 180 = destructive
   */
  requiredPhaseDifference?: number

  /**
   * Tolerance for phase matching in degrees (default: 30)
   */
  phaseTolerance?: number

  // === Optical Isolator Properties ===

  /**
   * Allowed direction for optical isolator
   * Light from opposite direction is blocked
   */
  allowedDirection?: Direction2D

  /**
   * Faraday rotation angle for optical isolator (default: 45)
   */
  faradayRotation?: number

  // === Mystery Box (Optical Detective) Properties ===

  /**
   * Hidden element type for mystery box - the actual optical element hidden inside
   * Player must deduce this through probing with different light states
   */
  hiddenElementType?: 'polarizer' | 'halfWavePlate' | 'quarterWavePlate' | 'rotator' | 'retarder' | 'opticalRotator'

  /**
   * Hidden element angle (fast axis, transmission axis, or rotation angle)
   */
  hiddenElementAngle?: number

  /**
   * Hidden retardation for general retarder (in degrees: 90=λ/4, 180=λ/2)
   */
  hiddenRetardation?: number

  /**
   * Display name shown when mystery is revealed (localized)
   */
  revealedName?: string

  /**
   * Whether the mystery has been solved by the player
   */
  isSolved?: boolean

  // === Quantum Lock (Master Class) Properties ===

  /**
   * Target Jones vector for quantum lock (high-fidelity matching)
   * Lock only opens when received light has >requiredFidelity match
   */
  targetJones?: JonesVector

  /**
   * Required fidelity threshold for quantum lock (default: 0.99 = 99%)
   * Fidelity F = |⟨ψ_target|ψ_input⟩|²
   */
  requiredFidelity?: number

  /**
   * Display name for the target state (localized)
   */
  targetStateName?: string
  targetStateNameZh?: string

  /**
   * Whether to show target state hint (visual ellipse preview)
   */
  showTargetHint?: boolean

  // === Interferometer Target Properties ===

  /**
   * This sensor is "Port A" of an interferometer target
   * When true, this sensor requires HIGH intensity (bright port)
   */
  isInterferometerPortA?: boolean

  /**
   * This sensor is "Port B" of an interferometer target
   * When true, this sensor requires LOW intensity (dark port)
   */
  isInterferometerPortB?: boolean

  /**
   * Linked port ID for interferometer target pairing
   * Port A and B must both be satisfied for puzzle completion
   */
  linkedPortId?: string

  /**
   * Maximum allowed intensity for dark port (default: 5%)
   */
  maxIntensityForDark?: number

  /**
   * Minimum required intensity for bright port (default: 90%)
   */
  minIntensityForBright?: number

  // === Optical Mine Properties ===

  /**
   * Intensity threshold that triggers the mine (default: 5%)
   * Light above this intensity causes level failure
   */
  mineThreshold?: number

  /**
   * Safe polarization state that doesn't trigger the mine
   * Players can bypass the mine using this specific state
   */
  safeJones?: JonesVector

  /**
   * Tolerance for safe state matching (default: 0.9 = 90% fidelity)
   */
  safeTolerance?: number

  /**
   * What happens when mine is triggered
   */
  mineEffect?: 'fail_level' | 'absorb' | 'scatter'

  /**
   * Display name for safe state (hint, localized)
   */
  safeStateName?: string
  safeStateNameZh?: string
}

// 光束段 (extended for Jones calculus)
export interface LightBeamSegment {
  startX: number
  startY: number
  endX: number
  endY: number
  intensity: number
  /** @deprecated Use jonesVector for accurate polarization */
  polarization: number
  direction: Direction2D

  // === Jones Calculus Extensions ===

  /**
   * Full polarization state as Jones vector
   * Supports linear, circular, and elliptical polarization
   */
  jonesVector?: JonesVector

  /**
   * Analyzed polarization information (computed from jonesVector)
   */
  polarizationInfo?: PolarizationInfo

  /**
   * Coherence identifier - beams with same ID can interfere
   */
  coherenceId?: string

  /**
   * Accumulated optical phase (for interference visualization)
   */
  phase?: number
}

// 传感器状态 (extended for Jones calculus)
export interface SensorState {
  id: string
  activated: boolean
  receivedIntensity: number
  /** @deprecated Use receivedJones for accurate polarization */
  receivedPolarization: number | null

  // === Jones Calculus Extensions ===

  /**
   * Full received polarization state as Jones vector
   */
  receivedJones?: JonesVector

  /**
   * Fidelity of received polarization vs required (0-1)
   * 1.0 = perfect match, 0.0 = orthogonal
   */
  fidelity?: number

  // === Quantum Lock Extensions ===

  /**
   * Target Jones vector (for visualization comparison)
   */
  targetJones?: JonesVector

  /**
   * Detailed fidelity assessment for quantum locks
   */
  fidelityAssessment?: {
    quality: 'perfect' | 'excellent' | 'good' | 'fair' | 'poor' | 'orthogonal'
    description: string
    descriptionZh: string
  }

  // === Interferometer Target Extensions ===

  /**
   * Whether this is a bright port (requires high intensity)
   */
  isBrightPort?: boolean

  /**
   * Whether this is a dark port (requires low intensity)
   */
  isDarkPort?: boolean

  /**
   * Linked port satisfaction status
   */
  linkedPortSatisfied?: boolean

  /**
   * Interference visibility V = (I_max - I_min) / (I_max + I_min)
   */
  visibility?: number

  // === Optical Mine Extensions ===

  /**
   * Whether this is an optical mine (danger zone)
   */
  isMine?: boolean

  /**
   * Whether the mine was triggered (level fail condition)
   */
  triggered?: boolean

  /**
   * Danger level (0-1) approaching trigger threshold
   */
  dangerLevel?: number

  /**
   * Whether light is in safe state (bypassing mine)
   */
  inSafeState?: boolean
}

// SVG组件通用Props
export interface BaseSVGProps {
  x: number
  y: number
  isDark?: boolean
}

// 交互式组件Props
export interface InteractiveSVGProps extends BaseSVGProps {
  locked: boolean
  selected: boolean
  onClick: () => void
}

// 偏振色彩函数类型
export type GetPolarizationColorFn = (angle: number) => string
