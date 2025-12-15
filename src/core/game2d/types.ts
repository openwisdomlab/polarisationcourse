/**
 * Types and interfaces for 2D puzzle game
 *
 * This module has been updated to support Jones calculus for accurate
 * polarization physics. The `jonesVector` field in LightBeamSegment
 * provides full polarization state (linear, circular, elliptical).
 */

import type { JonesVector, PolarizationInfo } from '../physics'

// Direction type for 2D game
export type Direction2D = 'up' | 'down' | 'left' | 'right'

// Extended component types for 2D puzzles
export interface OpticalComponent {
  id: string
  type:
    | 'polarizer'
    | 'mirror'
    | 'splitter'
    | 'rotator'
    | 'emitter'
    | 'sensor'
    | 'halfWavePlate'
    | 'quarterWavePlate'
    | 'mysteryBox'  // Optical Detective: hidden component for probing
  x: number // percentage position
  y: number // percentage position
  angle: number // orientation angle (fast axis for waveplates)
  polarizationAngle?: number // for polarizers and emitters (linear)
  rotationAmount?: number // for rotators (45 or 90)
  locked: boolean
  direction?: Direction2D // for emitters
  requiredIntensity?: number // for sensors
  requiredPolarization?: number // for sensors (linear angle, or undefined for any)

  // Advanced polarization options (for circular/elliptical light)
  /**
   * Initial Jones vector for emitters (overrides polarizationAngle if set).
   * Allows circular and elliptical polarization emission.
   */
  initialJones?: JonesVector
  /**
   * Polarization type for emitters: 'linear', 'circular', or 'elliptical'
   */
  emitterPolarizationType?: 'linear' | 'circular' | 'elliptical'
  /**
   * Handedness for circular/elliptical polarization ('right' = RCP, 'left' = LCP)
   */
  handedness?: 'right' | 'left'
  /**
   * Required Jones vector for sensors (for circular/elliptical matching)
   */
  requiredJones?: JonesVector
  /**
   * Crystal axis angle for splitters (default: 0° = o-axis horizontal)
   */
  crystalAxisAngle?: number

  // === Mystery Box (Optical Detective) Properties ===
  /**
   * Hidden element type for mystery box
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
   * Whether the mystery has been solved by the player
   */
  isSolved?: boolean
}

// Level definition with multiple components
export interface Level2D {
  id: number
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  hint?: string
  hintZh?: string
  components: OpticalComponent[]
  gridSize: { width: number; height: number } // for positioning
  openEnded?: boolean // multiple solutions possible
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

// Light beam segment for visualization
export interface LightBeamSegment {
  startX: number
  startY: number
  endX: number
  endY: number
  intensity: number
  /** @deprecated Use jonesVector for accurate polarization. Kept for backward compatibility. */
  polarization: number
  direction: Direction2D
  /**
   * Full polarization state using Jones vector representation.
   * Supports linear, circular, and elliptical polarization.
   */
  jonesVector?: JonesVector
  /**
   * Analyzed polarization information (computed from jonesVector)
   * Includes type, angle, ellipticity, and handedness.
   */
  polarizationInfo?: PolarizationInfo
}

// Sensor state tracking
export interface SensorState {
  id: string
  activated: boolean
  receivedIntensity: number
  /** @deprecated Use receivedJones for accurate polarization state */
  receivedPolarization: number | null
  /**
   * Full received polarization state as Jones vector.
   * Allows proper matching for circular/elliptical polarization.
   */
  receivedJones?: JonesVector
  /**
   * Fidelity of received polarization vs required (0-1).
   * 1.0 = perfect match, 0.0 = orthogonal.
   */
  fidelity?: number
}

// Direction vectors for movement calculation
export const DIRECTION_VECTORS: Record<Direction2D, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}
