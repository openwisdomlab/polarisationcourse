/**
 * Types and interfaces for 2D puzzle game
 */

// Direction type for 2D game
export type Direction2D = 'up' | 'down' | 'left' | 'right'

// Extended component types for 2D puzzles
export interface OpticalComponent {
  id: string
  type: 'polarizer' | 'mirror' | 'splitter' | 'rotator' | 'emitter' | 'sensor'
  x: number // percentage position
  y: number // percentage position
  angle: number // orientation angle
  polarizationAngle?: number // for polarizers and emitters
  rotationAmount?: number // for rotators (45 or 90)
  locked: boolean
  direction?: Direction2D // for emitters
  requiredIntensity?: number // for sensors
  requiredPolarization?: number // for sensors
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
  polarization: number
  direction: Direction2D
}

// Sensor state tracking
export interface SensorState {
  id: string
  activated: boolean
  receivedIntensity: number
  receivedPolarization: number | null
}

// Direction vectors for movement calculation
export const DIRECTION_VECTORS: Record<Direction2D, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}
