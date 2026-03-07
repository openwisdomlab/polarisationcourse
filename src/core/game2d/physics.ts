/**
 * 2D Physics Engine for the puzzle game
 * Light propagation and optical component interactions
 *
 * NOTE: Core physics calculations are imported from the shared optics library
 * to ensure consistency across all modules (2D game, 3D game, demos, optical bench).
 */
import { Direction2D, OpticalComponent, LightBeamSegment, SensorState, DIRECTION_VECTORS } from './types'
import {
  applyMalusLaw as malusLaw,
  getMirrorReflection as mirrorReflection,
  type Direction2D as SharedDirection2D,
} from '@/lib/opticsPhysics'
import {
  GAME2D_MAX_TRACE_DEPTH,
  GAME2D_MIN_TRACE_INTENSITY,
  GAME2D_MAX_STEPS,
  GAME2D_HIT_RADIUS,
} from '@/core/physics/constants'

/**
 * Calculate mirror reflection based on mirror angle
 * Mirror at 45° reflects: right<->up, left<->down
 * Mirror at 135° reflects: right<->down, left<->up
 *
 * @see {@link getMirrorReflection} from '@/lib/opticsPhysics' for canonical implementation
 */
export function getMirrorReflection(incomingDir: Direction2D, mirrorAngle: number): Direction2D | null {
  // Use shared implementation, cast types as they're compatible
  return mirrorReflection(incomingDir as SharedDirection2D, mirrorAngle) as Direction2D | null
}

/**
 * Apply Malus's Law for polarizer intensity calculation
 * I = I₀ × cos²(θ)
 *
 * @see {@link applyMalusLaw} from '@/lib/opticsPhysics' for canonical implementation
 */
export function applyMalusLaw(inputIntensity: number, inputAngle: number, filterAngle: number): number {
  // Use shared implementation
  return malusLaw(inputIntensity, inputAngle, filterAngle)
}

/**
 * Get splitter output for birefringence simulation
 * Returns o-ray (0°) and e-ray (90°) intensities and directions
 */
export function getSplitterOutputs(
  inputIntensity: number,
  inputPolarization: number,
  inputDirection: Direction2D
): Array<{ intensity: number; polarization: number; direction: Direction2D }> {
  const radians = (inputPolarization * Math.PI) / 180
  const oIntensity = inputIntensity * Math.pow(Math.cos(radians), 2)
  const eIntensity = inputIntensity * Math.pow(Math.sin(radians), 2)

  // o-ray continues in same direction, e-ray goes perpendicular (up)
  const eDirection: Direction2D = inputDirection === 'right' || inputDirection === 'left' ? 'up' : 'right'

  return [
    { intensity: oIntensity, polarization: 0, direction: inputDirection },
    { intensity: eIntensity, polarization: 90, direction: eDirection },
  ]
}

// ============================================
// Spatial Grid Index for O(1) component lookup
// ============================================

const GRID_CELL_SIZE = 10 // 100/10 = 10x10 grid
const GRID_COLS = Math.ceil(100 / GRID_CELL_SIZE)

/**
 * Spatial grid index for fast component collision detection.
 * Divides the 100×100 space into cells, each containing refs to overlapping components.
 */
class SpatialGrid {
  private cells: Map<number, OpticalComponent[]> = new Map()

  constructor(components: OpticalComponent[]) {
    for (const c of components) {
      if (c.type === 'emitter') continue
      // Register component in all cells it might overlap (based on hit radius)
      const minCol = Math.max(0, Math.floor((c.x - GAME2D_HIT_RADIUS) / GRID_CELL_SIZE))
      const maxCol = Math.min(GRID_COLS - 1, Math.floor((c.x + GAME2D_HIT_RADIUS) / GRID_CELL_SIZE))
      const minRow = Math.max(0, Math.floor((c.y - GAME2D_HIT_RADIUS) / GRID_CELL_SIZE))
      const maxRow = Math.min(GRID_COLS - 1, Math.floor((c.y + GAME2D_HIT_RADIUS) / GRID_CELL_SIZE))

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const key = row * GRID_COLS + col
          let cell = this.cells.get(key)
          if (!cell) {
            cell = []
            this.cells.set(key, cell)
          }
          cell.push(c)
        }
      }
    }
  }

  /**
   * Find a component near the given point, or null if none.
   */
  findNear(x: number, y: number): OpticalComponent | undefined {
    const col = Math.floor(x / GRID_CELL_SIZE)
    const row = Math.floor(y / GRID_CELL_SIZE)
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_COLS) return undefined

    const cell = this.cells.get(row * GRID_COLS + col)
    if (!cell) return undefined

    for (const c of cell) {
      if (Math.abs(c.x - x) < GAME2D_HIT_RADIUS && Math.abs(c.y - y) < GAME2D_HIT_RADIUS) {
        return c
      }
    }
    return undefined
  }
}

/**
 * Trace light path through optical components
 * Returns array of light beam segments for visualization
 */
export function traceLightPath(
  startX: number,
  startY: number,
  direction: Direction2D,
  intensity: number,
  polarization: number,
  components: OpticalComponent[],
  sensorStates: Map<string, SensorState>,
  segments: LightBeamSegment[],
  depth: number = 0,
  grid?: SpatialGrid
): void {
  // Prevent infinite recursion
  if (depth > GAME2D_MAX_TRACE_DEPTH || intensity < GAME2D_MIN_TRACE_INTENSITY) {
    return
  }

  const { dx, dy } = DIRECTION_VECTORS[direction]
  const step = 1 // step size in percentage units
  const maxSteps = GAME2D_MAX_STEPS

  let currentX = startX
  let currentY = startY

  for (let i = 0; i < maxSteps; i++) {
    const nextX = currentX + dx * step
    const nextY = currentY + dy * step

    // Check boundaries
    if (nextX < 0 || nextX > 100 || nextY < 0 || nextY > 100) {
      // Add final segment to boundary
      segments.push({
        startX: startX,
        startY: startY,
        endX: currentX,
        endY: currentY,
        intensity,
        polarization,
        direction,
      })
      return
    }

    // Check for component collision using spatial grid (O(1)) or fallback to linear search
    const hitComponent = grid
      ? grid.findNear(nextX, nextY)
      : components.find(c => {
          const distX = Math.abs(c.x - nextX)
          const distY = Math.abs(c.y - nextY)
          return distX < GAME2D_HIT_RADIUS && distY < GAME2D_HIT_RADIUS && c.type !== 'emitter'
        })

    if (hitComponent) {
      // Add segment up to component
      segments.push({
        startX: startX,
        startY: startY,
        endX: hitComponent.x,
        endY: hitComponent.y,
        intensity,
        polarization,
        direction,
      })

      // Process component interaction
      processComponentInteraction(
        hitComponent,
        direction,
        intensity,
        polarization,
        components,
        sensorStates,
        segments,
        depth,
        grid
      )
      return
    }

    currentX = nextX
    currentY = nextY
  }

  // Reached max steps, add segment
  segments.push({
    startX: startX,
    startY: startY,
    endX: currentX,
    endY: currentY,
    intensity,
    polarization,
    direction,
  })
}

/**
 * Process interaction with an optical component
 */
function processComponentInteraction(
  component: OpticalComponent,
  direction: Direction2D,
  intensity: number,
  polarization: number,
  components: OpticalComponent[],
  sensorStates: Map<string, SensorState>,
  segments: LightBeamSegment[],
  depth: number,
  grid?: SpatialGrid
): void {
  switch (component.type) {
    case 'polarizer': {
      const filterAngle = component.polarizationAngle ?? 0
      const newIntensity = applyMalusLaw(intensity, polarization, filterAngle)

      if (newIntensity >= 1) {
        traceLightPath(
          component.x, component.y, direction, newIntensity, filterAngle,
          components, sensorStates, segments, depth + 1, grid
        )
      }
      break
    }

    case 'mirror': {
      const newDirection = getMirrorReflection(direction, component.angle)
      if (newDirection) {
        const newIntensity = intensity * 0.95 // Small loss on reflection
        traceLightPath(
          component.x, component.y, newDirection, newIntensity, polarization,
          components, sensorStates, segments, depth + 1, grid
        )
      }
      break
    }

    case 'splitter': {
      const outputs = getSplitterOutputs(intensity, polarization, direction)

      for (const output of outputs) {
        if (output.intensity >= 1) {
          traceLightPath(
            component.x, component.y, output.direction, output.intensity, output.polarization,
            components, sensorStates, segments, depth + 1, grid
          )
        }
      }
      break
    }

    case 'rotator': {
      const rotationAmount = component.rotationAmount ?? 45
      const newPolarization = (polarization + rotationAmount) % 180
      const newIntensity = intensity * 0.98 // Small loss

      traceLightPath(
        component.x, component.y, direction, newIntensity, newPolarization,
        components, sensorStates, segments, depth + 1, grid
      )
      break
    }

    case 'sensor': {
      const required = component.requiredIntensity ?? 50
      const requiredPol = component.requiredPolarization

      // Update sensor state
      const existing = sensorStates.get(component.id)
      const totalIntensity = (existing?.receivedIntensity ?? 0) + intensity

      const matchesPolarization = requiredPol === undefined ||
        Math.abs(polarization - requiredPol) < 10 ||
        Math.abs(polarization - requiredPol - 180) < 10

      sensorStates.set(component.id, {
        id: component.id,
        activated: totalIntensity >= required && matchesPolarization,
        receivedIntensity: totalIntensity,
        receivedPolarization: polarization,
      })
      break
    }
  }
}

/**
 * Calculate all light paths from emitters
 */
export function calculateLightPaths(
  components: OpticalComponent[]
): { segments: LightBeamSegment[]; sensorStates: Map<string, SensorState> } {
  const segments: LightBeamSegment[] = []
  const sensorStates = new Map<string, SensorState>()

  // Build spatial grid index for O(1) collision detection
  const grid = new SpatialGrid(components)

  // Initialize sensor states
  for (const comp of components) {
    if (comp.type === 'sensor') {
      sensorStates.set(comp.id, {
        id: comp.id,
        activated: false,
        receivedIntensity: 0,
        receivedPolarization: null,
      })
    }
  }

  // Trace from each emitter
  const emitters = components.filter(c => c.type === 'emitter')
  for (const emitter of emitters) {
    const direction = emitter.direction ?? 'right'
    const { dx, dy } = DIRECTION_VECTORS[direction]

    traceLightPath(
      emitter.x + dx * 5,
      emitter.y + dy * 5,
      direction,
      100, // Full intensity
      emitter.polarizationAngle ?? 0,
      components,
      sensorStates,
      segments,
      0,
      grid
    )
  }

  return { segments, sensorStates }
}
