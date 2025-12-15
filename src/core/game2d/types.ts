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
    | 'circularFilter'  // Circular polarizer (passes RCP or LCP)
    | 'beamCombiner'  // Combines two beams (for interference)
    | 'phaseShifter'  // Introduces phase delay
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

  /**
   * Phase shift in degrees for phaseShifter component (default: 90)
   */
  phaseShift?: number

  /**
   * Filter handedness for circularFilter ('right' or 'left')
   */
  filterHandedness?: 'right' | 'left'

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

// ============================================
// Campaign & Difficulty Types
// ============================================

export type Campaign = 'vector' | 'spin' | 'wave' | 'challenge'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master'

// ============================================
// Advanced Victory Conditions
// ============================================

/**
 * Sensor target specification for advanced puzzles
 * Supports linear angle, circular polarization, or Jones vector matching
 */
export interface SensorTarget {
  /** Target polarization state type */
  type: 'linear' | 'circular' | 'elliptical' | 'any'

  /** For linear: target angle in degrees (0-180) */
  linearAngle?: number

  /** For circular/elliptical: handedness */
  handedness?: 'left' | 'right'

  /** Target Jones vector for precise matching (overrides above if set) */
  jonesVector?: JonesVector

  /** Required fidelity for Jones vector matching (default: 0.99 = 99%) */
  fidelity?: number

  /** Required minimum intensity (0-100) */
  minIntensity?: number

  /** Required maximum intensity (for dark ports) */
  maxIntensity?: number
}

/**
 * Inventory definition - components available to player
 */
export interface LevelInventory {
  polarizer?: number
  mirror?: number
  splitter?: number
  rotator?: number
  halfWavePlate?: number
  quarterWavePlate?: number
  phaseShifter?: number
  beamCombiner?: number
  circularFilter?: number
}

/**
 * Success criteria for level completion
 */
export interface VictoryConditions {
  /** All sensors must be activated */
  allSensorsActivated?: boolean

  /** Specific sensors with target states */
  sensorTargets?: Record<string, SensorTarget>

  /** Minimum total intensity at sensors */
  minTotalIntensity?: number

  /** Maximum allowed intensity at danger zones */
  maxDangerZoneIntensity?: number

  /** Required output configuration for interferometers */
  interferometerConfig?: {
    brightPortId: string
    darkPortId: string
    brightMinIntensity: number
    darkMaxIntensity: number
  }

  /** For XOR/logic gates: output should be ON when condition is met */
  logicGateCondition?: 'XOR' | 'AND' | 'OR'
}

// ============================================
// Level Definition
// ============================================

/**
 * Level definition with advanced campaign system
 */
export interface Level2D {
  /** Unique level ID */
  id: number

  /** Internal string identifier for references */
  levelId: string

  /** Display name (English) */
  name: string

  /** Display name (Chinese) */
  nameZh: string

  /** Brief description (English) */
  description: string

  /** Brief description (Chinese) */
  descriptionZh: string

  /** Optional hint (English) */
  hint?: string

  /** Optional hint (Chinese) */
  hintZh?: string

  /** Pre-placed components (locked and unlocked) */
  components: OpticalComponent[]

  /** Grid size for positioning */
  gridSize: { width: number; height: number }

  /** Multiple solutions possible */
  openEnded?: boolean

  // === Campaign System ===

  /** Difficulty tier */
  difficulty: Difficulty

  /** Campaign this level belongs to */
  campaign: Campaign

  /** Order within campaign (for progression) */
  campaignOrder: number

  // === Inventory System ===

  /** Components available to place (empty = use what's given) */
  inventory?: LevelInventory

  // === Advanced Victory Conditions ===

  /** Victory conditions for level completion */
  victory?: VictoryConditions

  // === Educational Content ===

  /** Physics concepts taught in this level */
  concepts?: string[]

  /** Physics concepts (Chinese) */
  conceptsZh?: string[]

  /** Goal description for HUD display */
  goalDescription?: string

  /** Goal description (Chinese) */
  goalDescriptionZh?: string

  // === Scoring (Optional) ===

  /** Par component count for gold medal */
  parComponentCount?: number

  /** Target fidelity for bonus points */
  perfectFidelity?: number
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
