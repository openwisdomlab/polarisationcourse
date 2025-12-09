/**
 * 2D Physics Engine for the puzzle game
 * Light propagation and optical component interactions
 */
import { Direction2D, OpticalComponent, LightBeamSegment, SensorState, DIRECTION_VECTORS } from './types'

/**
 * Calculate mirror reflection based on mirror angle
 * Mirror at 45° reflects: right<->up, left<->down
 * Mirror at 135° reflects: right<->down, left<->up
 */
export function getMirrorReflection(incomingDir: Direction2D, mirrorAngle: number): Direction2D | null {
  const normalizedAngle = ((mirrorAngle % 180) + 180) % 180

  if (normalizedAngle >= 40 && normalizedAngle <= 50) { // ~45°
    const reflections: Record<Direction2D, Direction2D> = {
      right: 'up', up: 'right', left: 'down', down: 'left'
    }
    return reflections[incomingDir]
  } else if (normalizedAngle >= 130 && normalizedAngle <= 140) { // ~135°
    const reflections: Record<Direction2D, Direction2D> = {
      right: 'down', down: 'right', left: 'up', up: 'left'
    }
    return reflections[incomingDir]
  }
  return null
}

/**
 * Apply Malus's Law for polarizer intensity calculation
 * I = I₀ × cos²(θ)
 */
export function applyMalusLaw(inputIntensity: number, inputAngle: number, filterAngle: number): number {
  let angleDiff = Math.abs(inputAngle - filterAngle)
  if (angleDiff > 90) {
    angleDiff = 180 - angleDiff
  }
  const radians = (angleDiff * Math.PI) / 180
  return inputIntensity * Math.pow(Math.cos(radians), 2)
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
  depth: number = 0
): void {
  // Prevent infinite recursion
  if (depth > 20 || intensity < 1) {
    return
  }

  const { dx, dy } = DIRECTION_VECTORS[direction]
  const step = 1 // step size in percentage units
  const maxSteps = 150 // max distance

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

    // Check for component collision (with tolerance)
    const hitComponent = components.find(c => {
      const distX = Math.abs(c.x - nextX)
      const distY = Math.abs(c.y - nextY)
      return distX < 8 && distY < 8 && c.type !== 'emitter'
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
        depth
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
  depth: number
): void {
  switch (component.type) {
    case 'polarizer': {
      const filterAngle = component.polarizationAngle ?? 0
      const newIntensity = applyMalusLaw(intensity, polarization, filterAngle)

      if (newIntensity >= 1) {
        traceLightPath(
          component.x,
          component.y,
          direction,
          newIntensity,
          filterAngle,
          components,
          sensorStates,
          segments,
          depth + 1
        )
      }
      break
    }

    case 'mirror': {
      const newDirection = getMirrorReflection(direction, component.angle)
      if (newDirection) {
        const newIntensity = intensity * 0.95 // Small loss on reflection
        traceLightPath(
          component.x,
          component.y,
          newDirection,
          newIntensity,
          polarization,
          components,
          sensorStates,
          segments,
          depth + 1
        )
      }
      break
    }

    case 'splitter': {
      const outputs = getSplitterOutputs(intensity, polarization, direction)

      for (const output of outputs) {
        if (output.intensity >= 1) {
          traceLightPath(
            component.x,
            component.y,
            output.direction,
            output.intensity,
            output.polarization,
            components,
            sensorStates,
            segments,
            depth + 1
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
        component.x,
        component.y,
        direction,
        newIntensity,
        newPolarization,
        components,
        sensorStates,
        segments,
        depth + 1
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
      0
    )
  }

  return { segments, sensorStates }
}
