/**
 * Optical Bench Physics Calculations (光学工作台物理计算)
 *
 * Extracted from opticalBenchStore.ts to separate pure physics/ray-tracing
 * functions from state management.
 *
 * Contains:
 * - Ray tracing engine (queue-based with beam splitting)
 * - PBS / Calcite / NPBS beam splitting calculations
 * - Lens transformation (thin lens, ABCD matrix)
 * - Beam geometry propagation
 * - Component transformation via unified PhysicsAPI
 */

import type { LegacyJonesVector } from '@/core/physics/bridge'
import {
  legacyComplex,
  createLegacyJonesVector,
  legacyJonesIntensity,
  legacyJonesToAngle,
  analyzeLegacyJones,
  polarizationInfoToLegacyJones,
} from '@/core/physics/bridge'
import {
  RAY_INTENSITY_THRESHOLD,
  RAY_MAX_DEPTH,
  DEFAULT_BEAM_WIDTH,
  DEFAULT_BEAM_DIVERGENCE,
} from '@/core/physics/constants'
import { createPhysicsAPI, type PhysicsAPI } from '@/core/api'
import type { BenchComponent, DeviceQuality, LightSegment, Position } from './benchTypes'
import { POLARIZER_QUALITY_PARAMS } from './benchTypes'

// ============================================
// Helper Functions
// ============================================

export const normalizeAngle = (angle: number): number => {
  let normalized = angle % 360
  if (normalized < 0) normalized += 360
  return normalized
}

export const calculateMalusLaw = (intensity: number, angleDiff: number): number => {
  const radians = (angleDiff * Math.PI) / 180
  return intensity * Math.pow(Math.cos(radians), 2)
}

export const getPolarizationColor = (angle: number): string => {
  const normalizedAngle = normalizeAngle(angle)
  if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
  if (normalizedAngle < 67.5) return '#ffaa00'
  if (normalizedAngle < 112.5) return '#44ff44'
  return '#4444ff'
}

const reflectDirection = (direction: Position, normal: Position): Position => {
  const dot = direction.x * normal.x + direction.y * normal.y
  return {
    x: direction.x - 2 * dot * normal.x,
    y: direction.y - 2 * dot * normal.y,
  }
}

/** Shared unified physics instance for optical bench calculations */
export const benchPhysics: PhysicsAPI = createPhysicsAPI('science')

export const rotateVector = (v: Position, angleDeg: number): Position => {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: v.x * Math.cos(rad) - v.y * Math.sin(rad),
    y: v.x * Math.sin(rad) + v.y * Math.cos(rad),
  }
}

// ============================================
// Ray State
// ============================================

interface RayState {
  id: string
  position: Position
  direction: Position
  jonesVector: LegacyJonesVector
  intensity: number
  polarization: number
  phase: number
  depth: number
  sourceId: string
  visitedComponents: Set<string>
  beamWidth: number
  beamDivergence: number
}

// ============================================
// Component Finding
// ============================================

function findNextComponent(
  ray: RayState,
  components: BenchComponent[]
): BenchComponent | null {
  let closestComponent: BenchComponent | null = null
  let closestDist = Infinity

  for (const comp of components) {
    if (ray.visitedComponents.has(comp.id)) continue

    const dx = comp.x - ray.position.x
    const dy = comp.y - ray.position.y

    const dot = dx * ray.direction.x + dy * ray.direction.y
    if (dot <= 10) continue

    const perpDist = Math.abs(dx * ray.direction.y - dy * ray.direction.x)
    if (perpDist > 50) continue

    if (dot < closestDist) {
      closestDist = dot
      closestComponent = comp
    }
  }

  return closestComponent
}

// ============================================
// Beam Splitting Calculations
// ============================================

/**
 * Calculate PBS (Polarizing Beam Splitter) output using Jones vector projection
 */
export function calculatePBSSplit(
  inputJones: LegacyJonesVector,
  _inputIntensity: number,
  splitterRotation: number
): {
  transmitted: { jones: LegacyJonesVector; intensity: number; polarization: number }
  reflected: { jones: LegacyJonesVector; intensity: number; polarization: number }
} {
  const theta = (splitterRotation * Math.PI) / 180
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  const pDotE = legacyComplex.add(
    legacyComplex.scale(inputJones[0], cosTheta),
    legacyComplex.scale(inputJones[1], sinTheta)
  )
  const transmittedJones: LegacyJonesVector = [
    legacyComplex.scale(pDotE, cosTheta),
    legacyComplex.scale(pDotE, sinTheta),
  ]

  const sDotE = legacyComplex.add(
    legacyComplex.scale(inputJones[0], -sinTheta),
    legacyComplex.scale(inputJones[1], cosTheta)
  )
  const reflectedJones: LegacyJonesVector = [
    legacyComplex.scale(sDotE, -sinTheta),
    legacyComplex.scale(sDotE, cosTheta),
  ]

  const transmittedIntensity = legacyJonesIntensity(transmittedJones) * 100
  const reflectedIntensity = legacyJonesIntensity(reflectedJones) * 100

  const transmittedPol = transmittedIntensity > 0.01 ? splitterRotation : 0
  const reflectedPol = reflectedIntensity > 0.01 ? (splitterRotation + 90) % 180 : 0

  return {
    transmitted: { jones: transmittedJones, intensity: transmittedIntensity, polarization: transmittedPol },
    reflected: { jones: reflectedJones, intensity: reflectedIntensity, polarization: reflectedPol },
  }
}

/**
 * Calculate Calcite birefringence output using Jones vector projection
 */
export function calculateCalciteSplit(
  inputJones: LegacyJonesVector,
  _inputIntensity: number,
  crystalRotation: number
): {
  oRay: { jones: LegacyJonesVector; intensity: number; polarization: number }
  eRay: { jones: LegacyJonesVector; intensity: number; polarization: number }
} {
  const theta = (crystalRotation * Math.PI) / 180
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  const oDotE = legacyComplex.add(
    legacyComplex.scale(inputJones[0], -sinTheta),
    legacyComplex.scale(inputJones[1], cosTheta)
  )
  const oJones: LegacyJonesVector = [
    legacyComplex.scale(oDotE, -sinTheta),
    legacyComplex.scale(oDotE, cosTheta),
  ]

  const eDotE = legacyComplex.add(
    legacyComplex.scale(inputJones[0], cosTheta),
    legacyComplex.scale(inputJones[1], sinTheta)
  )
  const eJones: LegacyJonesVector = [
    legacyComplex.scale(eDotE, cosTheta),
    legacyComplex.scale(eDotE, sinTheta),
  ]

  const oIntensity = legacyJonesIntensity(oJones) * 100
  const eIntensity = legacyJonesIntensity(eJones) * 100

  const oPol = oIntensity > 0.01 ? (crystalRotation + 90) % 180 : 0
  const ePol = eIntensity > 0.01 ? crystalRotation : 0

  return {
    oRay: { jones: oJones, intensity: oIntensity, polarization: oPol },
    eRay: { jones: eJones, intensity: eIntensity, polarization: ePol },
  }
}

/**
 * Calculate NPBS (Non-Polarizing Beam Splitter) output
 */
export function calculateNPBSSplit(
  inputJones: LegacyJonesVector,
  inputIntensity: number,
  _inputPolarization: number
): {
  transmitted: { jones: LegacyJonesVector; intensity: number; polarization: number }
  reflected: { jones: LegacyJonesVector; intensity: number; polarization: number }
} {
  const scale = 1 / Math.SQRT2

  const transmittedJones: LegacyJonesVector = [
    legacyComplex.scale(inputJones[0], scale),
    legacyComplex.scale(inputJones[1], scale),
  ]
  const reflectedJones: LegacyJonesVector = [
    legacyComplex.scale(inputJones[0], scale),
    legacyComplex.scale(inputJones[1], scale),
  ]

  const halfIntensity = inputIntensity / 2
  const polarization = legacyJonesToAngle(inputJones)

  return {
    transmitted: { jones: transmittedJones, intensity: halfIntensity, polarization },
    reflected: { jones: reflectedJones, intensity: halfIntensity, polarization },
  }
}

// ============================================
// Unified Physics API Component Transformations
// ============================================

/**
 * Apply optical component transformation using the unified PhysicsAPI.
 */
export function applyComponentTransformation(
  inputJones: LegacyJonesVector,
  component: BenchComponent
): { jones: LegacyJonesVector; intensity: number; polarization: number } | null {
  const inputIntensity = legacyJonesIntensity(inputJones)
  const inputAngle = legacyJonesToAngle(inputJones)
  const inputState = benchPhysics.createLinearSource(inputAngle, inputIntensity)

  switch (component.type) {
    case 'polarizer': {
      const angle = component.properties.angle ?? 0
      const result = benchPhysics.applyPolarizer(inputState, angle)
      return {
        jones: polarizationInfoToLegacyJones(result, benchPhysics),
        intensity: result.intensity * 100,
        polarization: result.angleDeg,
      }
    }
    case 'waveplate': {
      const retardation = component.properties.retardation ?? 90
      const fastAxis = component.rotation
      const result = benchPhysics.applyWavePlate(inputState, retardation, fastAxis)
      return {
        jones: polarizationInfoToLegacyJones(result, benchPhysics),
        intensity: result.intensity * 100,
        polarization: result.angleDeg,
      }
    }
    default:
      return null
  }
}

// ============================================
// Geometric Optics: Thin Lens Equation
// ============================================

/**
 * Calculate beam transformation through a thin lens
 */
export function calculateLensTransformation(
  inputWidth: number,
  inputDivergence: number,
  focalLength: number,
  rayHeight: number = 0
): { width: number; divergence: number } {
  const PIXELS_PER_MM = 2
  const inputDivRad = (inputDivergence * Math.PI) / 180
  const fPixels = focalLength * PIXELS_PER_MM
  const rayHeightContribution = rayHeight / fPixels

  let outputDivRad: number
  if (Math.abs(focalLength) < 1) {
    outputDivRad = inputDivRad + Math.sign(-focalLength) * 0.2
  } else {
    const typicalHeight = inputWidth / 2
    const angleChange = -typicalHeight / fPixels
    outputDivRad = inputDivRad + angleChange - rayHeightContribution
  }

  const outputDivergence = (outputDivRad * 180) / Math.PI
  const outputWidth = inputWidth
  const clampedDivergence = Math.max(-30, Math.min(30, outputDivergence))

  return { width: outputWidth, divergence: clampedDivergence }
}

/**
 * Calculate beam width after propagating a distance with given divergence
 */
export function propagateBeamWidth(
  initialWidth: number,
  divergenceDeg: number,
  distance: number
): number {
  const divRad = (divergenceDeg * Math.PI) / 180
  const widthChange = distance * Math.tan(divRad)
  const newWidth = initialWidth + widthChange
  return Math.max(2, Math.min(50, newWidth))
}

// ============================================
// Main Ray Tracing Engine
// ============================================

/**
 * Queue-based ray tracing with beam splitting support
 */
export function traceLightRays(
  emitter: BenchComponent,
  allComponents: BenchComponent[],
  initialPolarization: number,
  initialIntensity: number,
  formulas: string[]
): LightSegment[] {
  const segments: LightSegment[] = []
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400

  const initialJones = createLegacyJonesVector(initialPolarization, initialIntensity / 100)
  const initialDirection = rotateVector({ x: 1, y: 0 }, emitter.rotation)

  const rayQueue: RayState[] = [{
    id: `${emitter.id}-ray0`,
    position: { x: emitter.x, y: emitter.y },
    direction: initialDirection,
    jonesVector: initialJones,
    intensity: initialIntensity,
    polarization: initialPolarization,
    phase: 1,
    depth: 0,
    sourceId: emitter.id,
    visitedComponents: new Set([emitter.id]),
    beamWidth: DEFAULT_BEAM_WIDTH,
    beamDivergence: DEFAULT_BEAM_DIVERGENCE,
  }]

  let segmentCounter = 0
  let rayBranchCounter = 0

  while (rayQueue.length > 0) {
    const ray = rayQueue.shift()!

    if (ray.intensity < RAY_INTENSITY_THRESHOLD || ray.depth >= RAY_MAX_DEPTH) {
      continue
    }

    const nextComponent = findNextComponent(ray, allComponents)

    if (nextComponent) {
      const endX = nextComponent.x
      const endY = nextComponent.y
      const analysis = analyzeLegacyJones(ray.jonesVector)

      const segStartX = ray.position.x + ray.direction.x * 30
      const segStartY = ray.position.y + ray.direction.y * 30
      const segEndX = endX - ray.direction.x * 30
      const segEndY = endY - ray.direction.y * 30
      const segmentLength = Math.sqrt(
        Math.pow(segEndX - segStartX, 2) + Math.pow(segEndY - segStartY, 2)
      )

      const endBeamWidth = propagateBeamWidth(ray.beamWidth, ray.beamDivergence, segmentLength)

      segments.push({
        id: `${ray.id}-seg${segmentCounter++}`,
        x1: segStartX,
        y1: segStartY,
        x2: segEndX,
        y2: segEndY,
        polarization: ray.polarization,
        jonesVector: ray.jonesVector,
        intensity: ray.intensity,
        phase: ray.phase,
        rayId: ray.sourceId,
        polarizationType: analysis.type,
        handedness: analysis.handedness,
        beamWidth: ray.beamWidth,
        beamDivergence: ray.beamDivergence,
        ellipticity: analysis.ellipticity,
      })

      const newVisited = new Set(ray.visitedComponents)
      newVisited.add(nextComponent.id)

      switch (nextComponent.type) {
        case 'polarizer': {
          const polarizerAngle = nextComponent.properties.angle ?? 0
          const deviceQuality = (nextComponent.properties.deviceQuality as DeviceQuality) ?? 'typical'
          const qualityParams = POLARIZER_QUALITY_PARAMS[deviceQuality]

          const result = applyComponentTransformation(ray.jonesVector, nextComponent)
          if (!result) break

          const angleDiff = Math.abs(ray.polarization - polarizerAngle)
          if (deviceQuality === 'ideal') {
            formulas.push(`Polarizer(${polarizerAngle}°): I = ${ray.intensity.toFixed(1)}% × cos²(${angleDiff.toFixed(0)}°) = ${result.intensity.toFixed(1)}%`)
          } else {
            const transmittance = (qualityParams.principalTransmittance * 100).toFixed(0)
            const er = qualityParams.extinctionRatio === Infinity ? '∞' : qualityParams.extinctionRatio.toString()
            formulas.push(`Polarizer(${polarizerAngle}°, T=${transmittance}%, ER=${er}:1): I = ${result.intensity.toFixed(1)}%`)
          }

          if (result.intensity >= RAY_INTENSITY_THRESHOLD) {
            rayQueue.push({
              ...ray,
              id: ray.id,
              position: { x: endX, y: endY },
              jonesVector: result.jones,
              intensity: result.intensity,
              polarization: result.polarization,
              depth: ray.depth + 1,
              visitedComponents: newVisited,
            })
          }
          break
        }

        case 'waveplate': {
          const retardation = nextComponent.properties.retardation ?? 90
          const fastAxis = nextComponent.rotation
          const result = applyComponentTransformation(ray.jonesVector, nextComponent)

          if (result) {
            const wpAnalysis = analyzeLegacyJones(result.jones)
            if (retardation === 90) {
              formulas.push(`λ/4(${fastAxis}°): ${ray.polarization.toFixed(0)}° → ${wpAnalysis.type} (${wpAnalysis.handedness})`)
            } else if (retardation === 180) {
              formulas.push(`λ/2(${fastAxis}°): ${ray.polarization.toFixed(0)}° → ${result.polarization.toFixed(0)}°`)
            }

            rayQueue.push({
              ...ray,
              id: ray.id,
              position: { x: endX, y: endY },
              jonesVector: result.jones,
              intensity: result.intensity,
              polarization: result.polarization,
              depth: ray.depth + 1,
              visitedComponents: newVisited,
            })
          } else {
            rayQueue.push({
              ...ray,
              id: ray.id,
              position: { x: endX, y: endY },
              depth: ray.depth + 1,
              visitedComponents: newVisited,
            })
          }
          break
        }

        case 'mirror': {
          const mirrorAngle = nextComponent.rotation
          const normal = rotateVector({ x: 0, y: -1 }, mirrorAngle)
          const reflectedDir = reflectDirection(ray.direction, normal)
          formulas.push(`Mirror: reflection at ${mirrorAngle}°`)

          rayQueue.push({
            ...ray,
            id: ray.id,
            position: { x: endX, y: endY },
            direction: reflectedDir,
            depth: ray.depth + 1,
            visitedComponents: newVisited,
          })
          break
        }

        case 'splitter': {
          const splitType = nextComponent.properties.splitType ?? 'pbs'
          const splitterRotation = nextComponent.rotation

          if (splitType === 'pbs') {
            const { transmitted, reflected } = calculatePBSSplit(
              ray.jonesVector, ray.intensity, splitterRotation
            )
            formulas.push(`PBS: p(${transmitted.intensity.toFixed(1)}%) → transmitted, s(${reflected.intensity.toFixed(1)}%) → reflected`)

            if (transmitted.intensity >= RAY_INTENSITY_THRESHOLD) {
              rayQueue.push({
                id: `${ray.id}-t${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: ray.direction,
                jonesVector: transmitted.jones,
                intensity: transmitted.intensity,
                polarization: transmitted.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }

            if (reflected.intensity >= RAY_INTENSITY_THRESHOLD) {
              const reflectedDir = rotateVector(ray.direction, 90)
              rayQueue.push({
                id: `${ray.id}-r${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: reflectedDir,
                jonesVector: reflected.jones,
                intensity: reflected.intensity,
                polarization: reflected.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }
            rayBranchCounter++

          } else if (splitType === 'calcite') {
            const { oRay, eRay } = calculateCalciteSplit(
              ray.jonesVector, ray.intensity, splitterRotation
            )
            formulas.push(`Calcite: o-ray(${oRay.intensity.toFixed(1)}%), e-ray(${eRay.intensity.toFixed(1)}%)`)

            if (oRay.intensity >= RAY_INTENSITY_THRESHOLD) {
              rayQueue.push({
                id: `${ray.id}-o${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: ray.direction,
                jonesVector: oRay.jones,
                intensity: oRay.intensity,
                polarization: oRay.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }

            if (eRay.intensity >= RAY_INTENSITY_THRESHOLD) {
              const eRayDir = rotateVector(ray.direction, 5)
              const displacement = 15
              rayQueue.push({
                id: `${ray.id}-e${rayBranchCounter}`,
                position: {
                  x: endX + ray.direction.y * displacement,
                  y: endY - ray.direction.x * displacement,
                },
                direction: eRayDir,
                jonesVector: eRay.jones,
                intensity: eRay.intensity,
                polarization: eRay.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }
            rayBranchCounter++

          } else if (splitType === 'npbs') {
            const { transmitted, reflected } = calculateNPBSSplit(
              ray.jonesVector, ray.intensity, ray.polarization
            )
            formulas.push(`NPBS: 50/50 split (${transmitted.intensity.toFixed(1)}% each)`)

            if (transmitted.intensity >= RAY_INTENSITY_THRESHOLD) {
              rayQueue.push({
                id: `${ray.id}-t${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: ray.direction,
                jonesVector: transmitted.jones,
                intensity: transmitted.intensity,
                polarization: transmitted.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }

            if (reflected.intensity >= RAY_INTENSITY_THRESHOLD) {
              const reflectedDir = rotateVector(ray.direction, 90)
              rayQueue.push({
                id: `${ray.id}-r${rayBranchCounter}`,
                position: { x: endX, y: endY },
                direction: reflectedDir,
                jonesVector: reflected.jones,
                intensity: reflected.intensity,
                polarization: reflected.polarization,
                phase: ray.phase,
                depth: ray.depth + 1,
                sourceId: ray.sourceId,
                visitedComponents: new Set(newVisited),
                beamWidth: endBeamWidth,
                beamDivergence: ray.beamDivergence,
              })
            }
            rayBranchCounter++
          }
          break
        }

        case 'lens': {
          const focalLength = nextComponent.properties.focalLength ?? 50
          const lensResult = calculateLensTransformation(
            endBeamWidth, ray.beamDivergence, focalLength, 0
          )
          const lensType = focalLength > 0 ? 'convex' : 'concave'
          const focusEffect = focalLength > 0 ? 'converging' : 'diverging'
          formulas.push(`Lens(${lensType}, f=${focalLength}mm): θ = ${ray.beamDivergence.toFixed(1)}° → ${lensResult.divergence.toFixed(1)}° (${focusEffect})`)

          rayQueue.push({
            ...ray,
            id: ray.id,
            position: { x: endX, y: endY },
            depth: ray.depth + 1,
            visitedComponents: newVisited,
            beamWidth: lensResult.width,
            beamDivergence: lensResult.divergence,
          })
          break
        }

        case 'sensor': {
          const sensorAnalysis = analyzeLegacyJones(ray.jonesVector)
          formulas.push(`Sensor: I = ${ray.intensity.toFixed(1)}%, θ = ${ray.polarization.toFixed(0)}° (${sensorAnalysis.type})`)
          break
        }
      }

    } else {
      // No component found - extend ray to canvas edge
      const edgeAnalysis = analyzeLegacyJones(ray.jonesVector)

      let t = Infinity
      if (ray.direction.x > 0) {
        t = Math.min(t, (CANVAS_WIDTH - ray.position.x) / ray.direction.x)
      } else if (ray.direction.x < 0) {
        t = Math.min(t, -ray.position.x / ray.direction.x)
      }
      if (ray.direction.y > 0) {
        t = Math.min(t, (CANVAS_HEIGHT - ray.position.y) / ray.direction.y)
      } else if (ray.direction.y < 0) {
        t = Math.min(t, -ray.position.y / ray.direction.y)
      }
      t = Math.min(t, 500)

      const edgeEndX = ray.position.x + ray.direction.x * t
      const edgeEndY = ray.position.y + ray.direction.y * t

      segments.push({
        id: `${ray.id}-seg${segmentCounter++}`,
        x1: ray.position.x + ray.direction.x * 30,
        y1: ray.position.y + ray.direction.y * 30,
        x2: edgeEndX,
        y2: edgeEndY,
        polarization: ray.polarization,
        jonesVector: ray.jonesVector,
        intensity: ray.intensity,
        phase: ray.phase,
        rayId: ray.sourceId,
        polarizationType: edgeAnalysis.type,
        handedness: edgeAnalysis.handedness,
        beamWidth: ray.beamWidth,
        beamDivergence: ray.beamDivergence,
        ellipticity: edgeAnalysis.ellipticity,
      })
    }
  }

  return segments
}
