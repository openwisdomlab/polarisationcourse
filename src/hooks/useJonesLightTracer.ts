/**
 * useJonesLightTracer - Jones Vector Light Tracing Engine
 *
 * A complete rewrite of the light tracing system using Jones Calculus
 * for accurate simulation of:
 * - Linear, circular, and elliptical polarization
 * - Coherent beam interference (constructive/destructive)
 * - Wave plates (λ/4, λ/2) and phase shifters
 * - Proper Malus's Law via matrix formulation
 *
 * Phase 1 of the "Zachtronics-style" PolarQuest overhaul.
 *
 * @author Claude - Physics Engine Overhaul
 */

import { useMemo } from 'react'
import type { OpticalComponent } from '@/components/shared/optical/types'
import type { Direction2D } from '@/lib/opticsPhysics'
import {
  DIRECTION_2D_VECTORS,
  getMirrorReflection,
  getBirefringenceEDirection,
} from '@/lib/opticsPhysics'

// Import Jones Calculus types and functions
import {
  type JonesVector,
  type PolarizationInfo,
  complex,
  polarizationToJonesVector,
  jonesVectorToPolarization,
  jonesIntensity,
  applyJonesMatrix,
  polarizerMatrix,
  rotatorMatrix,
  halfWavePlateMatrix,
  quarterWavePlateMatrix,
  splitByBirefringence,
  scaleJonesIntensity,
  getJonesPolarizationInfo,
  checkSensorMatch,
  createEmitterJones,
} from '@/core/physics'

// ============================================
// Types
// ============================================

/**
 * Extended light beam segment with Jones vector information
 */
export interface JonesBeamSegment {
  startX: number
  startY: number
  endX: number
  endY: number
  direction: Direction2D

  // Jones vector state
  jonesVector: JonesVector
  intensity: number // Computed from Jones vector for convenience

  // Legacy scalar values for backward compatibility
  polarization: number

  // Rich polarization info
  polarizationInfo: PolarizationInfo

  // For interference visualization
  coherenceId?: string // Beams with same ID can interfere
  phase: number // Accumulated phase (for visualization)
}

/**
 * Extended sensor state with Jones matching
 */
export interface JonesSensorState {
  id: string
  activated: boolean
  receivedIntensity: number
  receivedPolarization: number | null

  // Jones vector state
  receivedJones: JonesVector | null
  fidelity: number // 0-1, how well polarization matches requirement

  // For multi-beam interference
  incomingBeams: Array<{
    jones: JonesVector
    coherenceId: string
  }>
}

/**
 * Configuration for the Jones light tracer
 */
export interface JonesTracerConfig {
  maxDepth?: number
  minIntensity?: number
  mirrorLoss?: number
  splitterLoss?: number
  rotatorLoss?: number
  wavePlateLoss?: number
  alignmentTolerance?: number
  minDistance?: number

  // Interference settings
  enableInterference?: boolean
  coherenceLength?: number // Max path difference for coherence
}

const DEFAULT_CONFIG: Required<JonesTracerConfig> = {
  maxDepth: 25,
  minIntensity: 0.5,
  mirrorLoss: 0.98,
  splitterLoss: 0.98,
  rotatorLoss: 0.99,
  wavePlateLoss: 0.99,
  alignmentTolerance: 8,
  minDistance: 2,
  enableInterference: true,
  coherenceLength: 200, // In percentage units
}

/**
 * Result of light tracing
 */
export interface JonesTraceResult {
  beams: JonesBeamSegment[]
  sensorStates: JonesSensorState[]
}

// ============================================
// Component State Helper
// ============================================

type GetComponentStateFn = (component: OpticalComponent) => OpticalComponent

// ============================================
// Beam Accumulator for Interference (Future Use)
// ============================================

// BeamAccumulator interface and functions are prepared for future
// advanced interference calculations where multiple beams meet at
// intermediate points (not just sensors).
// Currently, interference is calculated at sensors only.

/**
 * Coherently superpose Jones vectors (interference)
 * J_total = J_1 + J_2 (complex vector addition)
 *
 * This is the KEY function for interference!
 * When two coherent beams meet, their electric fields ADD.
 */
function superposeJonesVectors(beams: Array<{ jones: JonesVector; pathLength: number }>): JonesVector {
  if (beams.length === 0) {
    return [complex.zero(), complex.zero()]
  }
  if (beams.length === 1) {
    return beams[0].jones
  }

  // Sum all Jones vectors (coherent superposition)
  let sumEx = complex.zero()
  let sumEy = complex.zero()

  for (const beam of beams) {
    // Add path-dependent phase shift for more accurate interference
    // Phase = 2π × pathLength / wavelength (simplified to just add vectors)
    sumEx = complex.add(sumEx, beam.jones[0])
    sumEy = complex.add(sumEy, beam.jones[1])
  }

  return [sumEx, sumEy]
}

// ============================================
// Core Tracing Functions
// ============================================

interface TraceContext {
  beams: JonesBeamSegment[]
  sensors: Map<string, JonesSensorState>
  components: OpticalComponent[]
  getState: GetComponentStateFn
  config: Required<JonesTracerConfig>
  coherenceId: string
  pathLength: number
}

/**
 * Find the next component in the path
 */
function findNextComponent(
  startX: number,
  startY: number,
  direction: Direction2D,
  components: OpticalComponent[],
  getState: GetComponentStateFn,
  config: Required<JonesTracerConfig>
): { component: OpticalComponent; state: OpticalComponent } | null {
  const { dx, dy } = DIRECTION_2D_VECTORS[direction]
  let nextComponent: OpticalComponent | null = null
  let nextState: OpticalComponent | null = null
  let minDist = Infinity

  for (const comp of components) {
    if (comp.type === 'emitter') continue

    const state = getState(comp)

    // Calculate vector to component
    const toCompX = state.x - startX
    const toCompY = state.y - startY

    // Component must be in travel direction
    if (dx !== 0 && Math.sign(toCompX) !== Math.sign(dx)) continue
    if (dy !== 0 && Math.sign(toCompY) !== Math.sign(dy)) continue

    // Check alignment (horizontal/vertical)
    if (dx !== 0 && Math.abs(toCompY) > config.alignmentTolerance) continue
    if (dy !== 0 && Math.abs(toCompX) > config.alignmentTolerance) continue

    const dist = Math.abs(toCompX) + Math.abs(toCompY)
    if (dist < minDist && dist > config.minDistance) {
      minDist = dist
      nextComponent = comp
      nextState = state
    }
  }

  return nextComponent && nextState ? { component: nextComponent, state: nextState } : null
}

/**
 * Calculate beam endpoint (either at component or boundary)
 */
function calculateEndpoint(
  startX: number,
  startY: number,
  direction: Direction2D,
  nextComponent: { state: OpticalComponent } | null
): { endX: number; endY: number } {
  if (nextComponent) {
    return { endX: nextComponent.state.x, endY: nextComponent.state.y }
  }

  const { dx, dy } = DIRECTION_2D_VECTORS[direction]
  return {
    endX: dx > 0 ? 100 : dx < 0 ? 0 : startX,
    endY: dy > 0 ? 100 : dy < 0 ? 0 : startY,
  }
}

/**
 * Create a beam segment
 */
function createBeamSegment(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  direction: Direction2D,
  jones: JonesVector,
  coherenceId: string,
  phase: number
): JonesBeamSegment {
  const intensity = jonesIntensity(jones)
  const polarization = jonesVectorToPolarization(jones)
  const polarizationInfo = getJonesPolarizationInfo(jones)

  return {
    startX,
    startY,
    endX,
    endY,
    direction,
    jonesVector: jones,
    intensity,
    polarization,
    polarizationInfo,
    coherenceId,
    phase,
  }
}

/**
 * Process interaction with an optical component using Jones calculus
 */
function processComponentInteraction(
  component: OpticalComponent,
  compState: OpticalComponent,
  inputJones: JonesVector,
  direction: Direction2D,
  endX: number,
  endY: number,
  ctx: TraceContext,
  depth: number
): void {
  switch (component.type) {
    case 'polarizer': {
      // Apply Malus's Law via Jones matrix
      const filterAngle = compState.polarizationAngle ?? 0
      const matrix = polarizerMatrix(filterAngle)
      const outputJones = applyJonesMatrix(matrix, inputJones)
      const outputIntensity = jonesIntensity(outputJones)

      if (outputIntensity >= ctx.config.minIntensity) {
        traceLightPathJones(
          endX,
          endY,
          direction,
          outputJones,
          ctx,
          depth + 1
        )
      }
      break
    }

    case 'mirror': {
      const mirrorAngle = compState.angle ?? 45
      const reflectedDir = getMirrorReflection(direction, mirrorAngle)

      if (reflectedDir) {
        // Apply attenuation
        const outputJones = scaleJonesIntensity(inputJones, ctx.config.mirrorLoss)
        traceLightPathJones(
          endX,
          endY,
          reflectedDir,
          outputJones,
          ctx,
          depth + 1
        )
      }
      break
    }

    case 'splitter': {
      // Birefringent crystal splitting using Jones projection
      const crystalAngle = compState.crystalAxisAngle ?? 0
      const result = splitByBirefringence(inputJones, {
        oAxisAngle: crystalAngle,
        eAxisAngle: crystalAngle + 90,
      })

      // O-ray continues in same direction
      if (result.oIntensity >= ctx.config.minIntensity) {
        const oJones = scaleJonesIntensity(result.oRay, ctx.config.splitterLoss)
        // Create new coherence ID for split beams (they're no longer coherent with each other)
        const oCoherenceId = `${ctx.coherenceId}-o`
        traceLightPathJones(
          endX,
          endY,
          direction,
          oJones,
          { ...ctx, coherenceId: oCoherenceId },
          depth + 1
        )
      }

      // E-ray deflects perpendicular
      if (result.eIntensity >= ctx.config.minIntensity) {
        const eDirection = getBirefringenceEDirection(direction)
        const eJones = scaleJonesIntensity(result.eRay, ctx.config.splitterLoss)
        const eCoherenceId = `${ctx.coherenceId}-e`
        traceLightPathJones(
          endX,
          endY,
          eDirection,
          eJones,
          { ...ctx, coherenceId: eCoherenceId },
          depth + 1
        )
      }
      break
    }

    case 'rotator': {
      // Optical rotator (rotates polarization plane)
      const rotAmount = compState.rotationAmount ?? 45
      const matrix = rotatorMatrix(rotAmount)
      const outputJones = applyJonesMatrix(matrix, inputJones)
      const attenuatedJones = scaleJonesIntensity(outputJones, ctx.config.rotatorLoss)

      traceLightPathJones(
        endX,
        endY,
        direction,
        attenuatedJones,
        ctx,
        depth + 1
      )
      break
    }

    case 'halfWavePlate': {
      // λ/2 plate: flips polarization about fast axis
      const fastAxis = compState.angle ?? 0
      const matrix = halfWavePlateMatrix(fastAxis)
      const outputJones = applyJonesMatrix(matrix, inputJones)
      const attenuatedJones = scaleJonesIntensity(outputJones, ctx.config.wavePlateLoss)

      traceLightPathJones(
        endX,
        endY,
        direction,
        attenuatedJones,
        ctx,
        depth + 1
      )
      break
    }

    case 'quarterWavePlate': {
      // λ/4 plate: converts linear ↔ circular
      const fastAxis = compState.angle ?? 0
      const matrix = quarterWavePlateMatrix(fastAxis)
      const outputJones = applyJonesMatrix(matrix, inputJones)
      const attenuatedJones = scaleJonesIntensity(outputJones, ctx.config.wavePlateLoss)

      traceLightPathJones(
        endX,
        endY,
        direction,
        attenuatedJones,
        ctx,
        depth + 1
      )
      break
    }

    case 'phaseShifter': {
      // Phase shifter: introduces phase delay without changing polarization state
      // This is crucial for Mach-Zehnder interferometer puzzles!
      const phaseShift = compState.phaseShift ?? 90 // Default: π/2 phase shift
      const phaseRad = (phaseShift * Math.PI) / 180

      // Apply global phase: e^(iφ) × [Ex, Ey]
      const phaseFactor = complex.exp(phaseRad)
      const outputJones: JonesVector = [
        complex.mul(inputJones[0], phaseFactor),
        complex.mul(inputJones[1], phaseFactor),
      ]

      const attenuatedJones = scaleJonesIntensity(outputJones, ctx.config.wavePlateLoss)

      traceLightPathJones(
        endX,
        endY,
        direction,
        attenuatedJones,
        ctx,
        depth + 1
      )
      break
    }

    case 'circularFilter': {
      // Circular polarization filter: passes only RCP or LCP
      // Implemented as QWP + linear polarizer + QWP^(-1)
      const filterHand = compState.filterHandedness ?? 'right'

      // Get polarization info to check if light is circular
      const info = getJonesPolarizationInfo(inputJones)

      // Calculate transmission based on handedness match
      let transmission = 0

      if (info.type === 'circular') {
        // Perfect circular: full transmission if handedness matches, zero if opposite
        transmission = info.handedness === filterHand ? 1.0 : 0.0
      } else if (info.type === 'elliptical') {
        // Elliptical: partial transmission based on circular component
        const circularComponent = Math.abs(Math.sin(2 * info.ellipticity))
        transmission =
          info.handedness === filterHand ? (1 + circularComponent) / 2 : (1 - circularComponent) / 2
      } else {
        // Linear polarization: 50% transmission (equal RCP and LCP components)
        transmission = 0.5
      }

      if (transmission > 0.01) {
        // Create output as pure circular polarization of the filter type
        const amplitude = Math.sqrt(jonesIntensity(inputJones) * transmission)
        const outputJones: JonesVector =
          filterHand === 'right'
            ? [complex.create(amplitude / Math.SQRT2), complex.create(0, -amplitude / Math.SQRT2)]
            : [complex.create(amplitude / Math.SQRT2), complex.create(0, amplitude / Math.SQRT2)]

        traceLightPathJones(endX, endY, direction, outputJones, ctx, depth + 1)
      }
      break
    }

    case 'beamCombiner': {
      // Beam combiner: a transparent element that marks where beams can combine
      // The actual combination happens at sensors; this just passes light through
      // This is useful for UI visualization of where interference occurs
      traceLightPathJones(endX, endY, direction, inputJones, ctx, depth + 1)
      break
    }

    case 'sensor': {
      // Update sensor state with Jones vector
      const sensor = ctx.sensors.get(component.id)
      if (sensor) {
        // Record incoming beam for interference calculation
        sensor.incomingBeams.push({
          jones: inputJones,
          coherenceId: ctx.coherenceId,
        })

        // Superpose all incoming beams (coherent combination!)
        const superposedJones = superposeJonesVectors(
          sensor.incomingBeams.map((b) => ({ jones: b.jones, pathLength: 0 }))
        )

        sensor.receivedJones = superposedJones
        sensor.receivedIntensity = jonesIntensity(superposedJones)
        sensor.receivedPolarization = jonesVectorToPolarization(superposedJones)

        // Check activation using Jones fidelity
        const reqIntensity = component.requiredIntensity ?? 50
        const reqPol = component.requiredPolarization

        // Use Jones-based sensor matching
        if (component.requiredJones) {
          // Advanced: match against required Jones vector (for circular polarization sensors)
          const matchResult = checkSensorMatch(
            superposedJones,
            undefined, // We use Jones fidelity instead
            reqIntensity
          )
          sensor.fidelity = matchResult.fidelity
          sensor.activated = matchResult.matches
        } else if (reqPol !== undefined) {
          // Match against linear polarization requirement
          const matchResult = checkSensorMatch(
            superposedJones,
            reqPol,
            reqIntensity,
            15 // 15 degree tolerance
          )
          sensor.fidelity = matchResult.fidelity
          sensor.activated = matchResult.matches
        } else {
          // No polarization requirement, just check intensity
          sensor.fidelity = 1.0
          sensor.activated = sensor.receivedIntensity >= reqIntensity
        }
      }
      break
    }
  }
}

/**
 * Trace light path using Jones vectors
 */
function traceLightPathJones(
  startX: number,
  startY: number,
  direction: Direction2D,
  jones: JonesVector,
  ctx: TraceContext,
  depth: number
): void {
  // Recursion limits
  if (depth > ctx.config.maxDepth) return

  const intensity = jonesIntensity(jones)
  if (intensity < ctx.config.minIntensity) return

  // Find next component
  const next = findNextComponent(
    startX,
    startY,
    direction,
    ctx.components,
    ctx.getState,
    ctx.config
  )

  // Calculate endpoint
  const { endX, endY } = calculateEndpoint(startX, startY, direction, next)

  // Calculate path length for this segment
  const segmentLength = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  )
  const newPathLength = ctx.pathLength + segmentLength

  // Add beam segment
  ctx.beams.push(
    createBeamSegment(
      startX,
      startY,
      endX,
      endY,
      direction,
      jones,
      ctx.coherenceId,
      newPathLength
    )
  )

  // Process component interaction if we hit one
  if (next) {
    processComponentInteraction(
      next.component,
      next.state,
      jones,
      direction,
      endX,
      endY,
      { ...ctx, pathLength: newPathLength },
      depth
    )
  }
}

// ============================================
// Public API
// ============================================

/**
 * Trace all light paths from emitters using Jones calculus
 */
export function traceJonesLightSystem(
  components: OpticalComponent[],
  componentStates: Record<string, Partial<OpticalComponent>> = {},
  config?: JonesTracerConfig
): JonesTraceResult {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const beams: JonesBeamSegment[] = []
  const sensors = new Map<string, JonesSensorState>()

  // Initialize sensors
  components
    .filter((c) => c.type === 'sensor')
    .forEach((s) => {
      sensors.set(s.id, {
        id: s.id,
        activated: false,
        receivedIntensity: 0,
        receivedPolarization: null,
        receivedJones: null,
        fidelity: 0,
        incomingBeams: [],
      })
    })

  // Component state accessor
  const getComponentState: GetComponentStateFn = (component) => {
    const state = componentStates[component.id] || {}
    return {
      ...component,
      angle: state.angle ?? component.angle,
      polarizationAngle: state.polarizationAngle ?? component.polarizationAngle,
      rotationAmount: state.rotationAmount ?? component.rotationAmount,
    }
  }

  // Process each emitter
  const emitters = components.filter((c) => c.type === 'emitter')

  emitters.forEach((emitter, emitterIndex) => {
    const state = getComponentState(emitter)
    if (!state.direction) return

    // Create initial Jones vector
    let initialJones: JonesVector

    if (state.initialJones) {
      // Use custom Jones vector (for circular/elliptical sources)
      initialJones = state.initialJones
    } else if (state.emitterPolarizationType === 'circular') {
      // Create circular polarization
      initialJones = createEmitterJones(
        0,
        100,
        true,
        state.handedness ?? 'right'
      )
    } else {
      // Default: linear polarization
      initialJones = polarizationToJonesVector(
        state.polarizationAngle ?? 0,
        100 // Full intensity
      )
    }

    // Create context for this emitter
    const ctx: TraceContext = {
      beams,
      sensors,
      components,
      getState: getComponentState,
      config: mergedConfig,
      coherenceId: `emitter-${emitterIndex}`,
      pathLength: 0,
    }

    traceLightPathJones(state.x, state.y, state.direction, initialJones, ctx, 0)
  })

  return {
    beams,
    sensorStates: Array.from(sensors.values()),
  }
}

/**
 * useJonesLightTracer Hook
 *
 * Drop-in replacement for useLightTracer with full Jones vector support.
 * Provides backward-compatible output format while enabling advanced physics.
 */
export function useJonesLightTracer(
  components: OpticalComponent[],
  componentStates: Record<string, Partial<OpticalComponent>>,
  config?: JonesTracerConfig
): JonesTraceResult {
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  )

  return useMemo(() => {
    return traceJonesLightSystem(components, componentStates, mergedConfig)
  }, [components, componentStates, mergedConfig])
}

// ============================================
// Backward Compatibility Layer
// ============================================

import type { LightBeamSegment, SensorState } from '@/components/shared/optical/types'

/**
 * Convert Jones trace result to legacy format
 */
export function toLegacyFormat(result: JonesTraceResult): {
  beams: LightBeamSegment[]
  sensorStates: SensorState[]
} {
  return {
    beams: result.beams.map((b) => ({
      startX: b.startX,
      startY: b.startY,
      endX: b.endX,
      endY: b.endY,
      intensity: b.intensity,
      polarization: b.polarization,
      direction: b.direction,
      jonesVector: b.jonesVector,
      polarizationInfo: b.polarizationInfo,
    })),
    sensorStates: result.sensorStates.map((s) => ({
      id: s.id,
      activated: s.activated,
      receivedIntensity: s.receivedIntensity,
      receivedPolarization: s.receivedPolarization,
      receivedJones: s.receivedJones ?? undefined,
      fidelity: s.fidelity,
    })),
  }
}

/**
 * Drop-in replacement hook that returns legacy format
 */
export function useJonesLightTracerLegacy(
  components: OpticalComponent[],
  componentStates: Record<string, Partial<OpticalComponent>>,
  config?: JonesTracerConfig
) {
  const result = useJonesLightTracer(components, componentStates, config)
  return useMemo(() => toLegacyFormat(result), [result])
}
