/**
 * useWorldModelSnapshot - LLM-Optimized Semantic State Export
 *
 * Wraps the existing useWorldModelContext hook with an additional
 * "semantic compression" layer optimized for LLM consumption.
 *
 * Instead of raw physics data, this hook produces human-readable,
 * tagged descriptions that an LLM can interpret without confusion:
 *
 * BAD (raw data):
 *   { stokes: [0.5, 0, 0, 0.5], coherencyMatrix: [[0.5, 0.5i], [-0.5i, 0.5]] }
 *
 * GOOD (semantic tags):
 *   { device: "Quarter-Wave Plate", effect: "Converted linear(45deg) to circular(RCP)",
 *     status: "Light is now circularly polarized (right-handed)" }
 *
 * This enables the AI Tutor to generate contextual hints like:
 *   "I see you placed the polarizer at 90 degrees, which is why the light is blocked.
 *    Try rotating it by 45 degrees to let some light through."
 */

import { useMemo } from 'react'
import {
  useWorldModelContext,
  type WorldModelContext,
  type SceneElement,
  type LightBeamContext,
} from './useWorldModelContext'

// ========== LLM-Optimized Output Types ==========

/**
 * A single device description for LLM consumption.
 * Uses natural language status and actionable hints.
 */
export interface DeviceSnapshot {
  /** Device type in natural language */
  device: string
  /** Grid position */
  position: string
  /** Current configuration in natural language */
  configuration: string
  /** Current status/effect on light */
  status: string
  /** Whether the player can interact with this device */
  playerPlaced: boolean
}

/**
 * A light beam description for LLM consumption.
 */
export interface BeamSnapshot {
  /** Where the beam is */
  location: string
  /** Direction of travel */
  direction: string
  /** Intensity as a percentage string */
  intensity: string
  /** Polarization state in natural language */
  polarization: string
  /** What's happening to this beam */
  status: string
}

/**
 * The puzzle state summary for LLM consumption.
 */
export interface PuzzleSnapshot {
  /** Current level name */
  level: string
  /** Overall puzzle status */
  status: 'unsolved' | 'partially-solved' | 'solved'
  /** Progress description */
  progress: string
  /** Specific issues the student might be facing */
  issues: string[]
  /** Suggested hints (based on state analysis) */
  suggestedHints: string[]
}

/**
 * Complete world model snapshot for LLM consumption.
 * Designed to be passed directly as context in an LLM prompt.
 */
export interface WorldModelSnapshot {
  /** Timestamp */
  timestamp: number
  /** Puzzle state summary */
  puzzle: PuzzleSnapshot
  /** All devices on the board */
  devices: DeviceSnapshot[]
  /** Active light beams */
  beams: BeamSnapshot[]
  /** What the player is currently holding/doing */
  playerAction: string
  /** One-paragraph natural language summary of the entire scene */
  sceneSummary: string
}

// ========== Semantic Translators ==========

function describeDeviceType(type: string): string {
  const names: Record<string, string> = {
    emitter: 'Light Source',
    polarizer: 'Polarizer Filter',
    rotator: 'Wave Plate (Rotator)',
    splitter: 'Birefringent Crystal (Calcite)',
    sensor: 'Light Sensor (Goal)',
    mirror: 'Mirror',
    solid: 'Solid Block',
    prism: 'Prism',
    lens: 'Lens',
    beamSplitter: 'Beam Splitter',
    quarterWave: 'Quarter-Wave Plate',
    halfWave: 'Half-Wave Plate',
    absorber: 'Absorber',
    phaseShifter: 'Phase Shifter',
    portal: 'Portal',
  }
  return names[type] || type
}

function describeDirection(dir: string): string {
  const names: Record<string, string> = {
    north: 'northward (toward -Z)',
    south: 'southward (toward +Z)',
    east: 'eastward (toward +X)',
    west: 'westward (toward -X)',
    up: 'upward (toward +Y)',
    down: 'downward (toward -Y)',
  }
  return names[dir] || dir
}

function describeDeviceConfig(element: SceneElement): string {
  const parts: string[] = []

  if (element.rotation !== 0) {
    parts.push(`rotated ${element.rotation}deg`)
  }

  if (element.type === 'emitter' || element.type === 'polarizer') {
    parts.push(`polarization axis at ${element.polarizationAngle}deg`)
  }

  if (element.type === 'sensor') {
    const req = element.requiredIntensity ?? 0
    parts.push(`requires intensity >= ${req}`)
    parts.push(element.activated ? 'ACTIVATED' : 'not yet activated')
  }

  if (element.type === 'rotator') {
    const amt = element.properties.rotationAmount as number | undefined
    parts.push(`rotates polarization by ${amt ?? 45}deg`)
  }

  if (element.facing) {
    parts.push(`facing ${element.facing}`)
  }

  return parts.length > 0 ? parts.join(', ') : 'default configuration'
}

function describeDeviceStatus(element: SceneElement, beams: LightBeamContext[]): string {
  // Check if any beam is at this device's position
  const beamsHere = beams.filter(
    b => b.position.x === element.position.x &&
      b.position.y === element.position.y &&
      b.position.z === element.position.z
  )

  if (beamsHere.length === 0) {
    if (element.type === 'emitter') return 'Emitting light'
    if (element.type === 'sensor') return 'No light reaching this sensor'
    return 'No light passing through'
  }

  const totalIntensity = beamsHere.reduce(
    (sum, b) => sum + b.packets.reduce((s, p) => s + p.normalizedIntensity, 0),
    0
  )

  if (element.type === 'sensor') {
    return element.activated
      ? `Activated! Receiving light at ${(totalIntensity * 100).toFixed(0)}% intensity`
      : `Receiving light at ${(totalIntensity * 100).toFixed(0)}% intensity, but not yet activated`
  }

  return `Light passing through at ${(totalIntensity * 100).toFixed(0)}% intensity`
}

function describeBeam(beam: LightBeamContext): BeamSnapshot[] {
  return beam.packets.map(packet => {
    const intensityPct = (packet.normalizedIntensity * 100).toFixed(0)
    const desc = packet.description

    let polarizationText: string
    switch (desc.category) {
      case 'linear':
        polarizationText = `Linear at ${desc.orientationDeg.toFixed(0)}deg (${desc.linearOrientation})`
        break
      case 'circular':
        polarizationText = `Circular (${desc.handedness === 'right' ? 'right-handed/RCP' : 'left-handed/LCP'})`
        break
      case 'elliptical':
        polarizationText = `Elliptical (orientation ${desc.orientationDeg.toFixed(0)}deg, ellipticity ${desc.ellipticityDeg.toFixed(0)}deg, ${desc.handedness})`
        break
      case 'unpolarized':
        polarizationText = 'Unpolarized'
        break
      default:
        polarizationText = desc.label
    }

    let status: string
    if (packet.normalizedIntensity < 0.01) {
      status = 'Effectively blocked (near-zero intensity)'
    } else if (packet.normalizedIntensity > 0.95) {
      status = 'Full intensity beam'
    } else {
      status = `Partially transmitted (${intensityPct}%)`
    }

    return {
      location: `(${beam.position.x}, ${beam.position.y}, ${beam.position.z})`,
      direction: describeDirection(packet.direction),
      intensity: `${intensityPct}%`,
      polarization: polarizationText,
      status,
    }
  })
}

function analyzePuzzleState(ctx: WorldModelContext): PuzzleSnapshot {
  const { level, sceneGraph, lightBeams, physicsSummary } = ctx

  const issues: string[] = []
  const hints: string[] = []

  // Check sensor states
  const sensors = sceneGraph.filter(e => e.type === 'sensor')
  const activatedSensors = sensors.filter(e => e.activated)

  let status: PuzzleSnapshot['status'] = 'unsolved'
  if (level.isComplete) {
    status = 'solved'
  } else if (activatedSensors.length > 0) {
    status = 'partially-solved'
  }

  // Identify issues
  const inactiveSensors = sensors.filter(e => !e.activated)
  for (const sensor of inactiveSensors) {
    const beamsAtSensor = lightBeams.filter(
      b => b.position.x === sensor.position.x &&
        b.position.y === sensor.position.y &&
        b.position.z === sensor.position.z
    )

    if (beamsAtSensor.length === 0) {
      issues.push(
        `Sensor at (${sensor.position.x},${sensor.position.y},${sensor.position.z}) is not receiving any light. The beam may need to be redirected.`
      )
      hints.push('Try placing a mirror or adjusting component positions to direct light toward the sensor.')
    } else {
      // Light is reaching but sensor isn't activated — wrong polarization or insufficient intensity
      const totalIntensity = beamsAtSensor.flatMap(b => b.packets)
        .reduce((sum, p) => sum + p.normalizedIntensity, 0)

      if (totalIntensity < 0.1) {
        issues.push(
          `Sensor at (${sensor.position.x},${sensor.position.y},${sensor.position.z}) is receiving very weak light (${(totalIntensity * 100).toFixed(0)}%).`
        )
        hints.push('The polarizer angle might be too far from the light\'s polarization. Malus\'s Law: I = I0 * cos^2(theta).')
      } else {
        issues.push(
          `Sensor at (${sensor.position.x},${sensor.position.y},${sensor.position.z}) has light but is not activated. Check polarization match or intensity requirements.`
        )
        hints.push('The sensor may require a specific polarization angle. Try rotating the polarizer to match.')
      }
    }
  }

  // Check for conservation violations
  if (physicsSummary.conservationViolations.length > 0) {
    issues.push('Physics engine detected conservation violations — this may be a bug.')
  }

  // Overall progress
  const progress = status === 'solved'
    ? `Level "${level.name}" complete! All ${level.totalSensors} sensors activated.`
    : `${level.activatedSensors}/${level.totalSensors} sensors activated on level "${level.name}".`

  return { level: level.name, status, progress, issues, suggestedHints: hints.slice(0, 3) }
}

function generateSceneSummary(ctx: WorldModelContext, puzzle: PuzzleSnapshot): string {
  const { sceneGraph, physicsSummary } = ctx

  const deviceCount = sceneGraph.length
  const beamCount = physicsSummary.totalBeams
  const categories = Object.entries(physicsSummary.polarizationDistribution)
    .map(([cat, count]) => `${count} ${cat}`)
    .join(', ')

  const parts = [
    `The board has ${deviceCount} optical devices and ${beamCount} active light beams.`,
  ]

  if (categories) {
    parts.push(`Beam types: ${categories}.`)
  }

  parts.push(puzzle.progress)

  if (puzzle.issues.length > 0) {
    parts.push(`Key issue: ${puzzle.issues[0]}`)
  }

  // Mention what tool the player is holding
  const tool = ctx.selectedTool
  parts.push(`Player is holding: ${describeDeviceType(tool.blockType)} (rotation ${tool.rotation}deg, polarization ${tool.polarizationAngle}deg).`)

  return parts.join(' ')
}

// ========== The Hook ==========

/**
 * Produces an LLM-optimized snapshot of the world state.
 *
 * Usage:
 * ```tsx
 * function AITutorPanel() {
 *   const snapshot = useWorldModelSnapshot()
 *   if (!snapshot) return null
 *
 *   // Send to LLM:
 *   // "Given this game state, provide a hint: " + JSON.stringify(snapshot)
 * }
 * ```
 */
export function useWorldModelSnapshot(): WorldModelSnapshot | null {
  const context = useWorldModelContext()

  return useMemo(() => {
    if (!context) return null

    // Analyze puzzle state
    const puzzle = analyzePuzzleState(context)

    // Convert devices to semantic snapshots
    const devices: DeviceSnapshot[] = context.sceneGraph.map(element => ({
      device: describeDeviceType(element.type),
      position: `(${element.position.x}, ${element.position.y}, ${element.position.z})`,
      configuration: describeDeviceConfig(element),
      status: describeDeviceStatus(element, context.lightBeams),
      playerPlaced: !['emitter', 'sensor'].includes(element.type),
    }))

    // Convert beams to semantic snapshots
    const beams: BeamSnapshot[] = context.lightBeams.flatMap(beam => describeBeam(beam))

    // Player action description
    const tool = context.selectedTool
    const playerAction = `Holding ${describeDeviceType(tool.blockType)} (rotation: ${tool.rotation}deg, polarization: ${tool.polarizationAngle}deg). View: ${context.viewSettings.visionMode} mode, ${context.viewSettings.cameraMode} camera.`

    // Generate overall summary
    const sceneSummary = generateSceneSummary(context, puzzle)

    return {
      timestamp: context.timestamp,
      puzzle,
      devices,
      beams,
      playerAction,
      sceneSummary,
    }
  }, [context])
}

export default useWorldModelSnapshot
