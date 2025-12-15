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
