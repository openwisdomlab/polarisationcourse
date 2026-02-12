/**
 * LightBeams.tsx — Physics-Driven Light Beam Visualization
 *
 * Visual layer that is a pure function of the physics state.
 * All rendering uniforms (intensity, polarization, color) are derived strictly
 * from the PhysicsInterpreter's analysis of each LightPacket.
 *
 * Features:
 * 1. Data-driven shader uniforms: uIntensity (float 0-1), uPolarizationState (vec4 Stokes)
 * 2. Debug mode: E-vector oscillation ribbon trail revealing circular/elliptical states
 * 3. Error visualization: flashing red on conservation violation (physics bug detector)
 */

import { useEffect, useState, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { World } from '@/core/World'
import { LightState, LightPacket, BlockPosition, DIRECTION_VECTORS } from '@/core/types'
import { VisionMode } from '@/stores/gameStore'
import {
  PhysicsInterpreter,
  type PolarizationStateDescription,
} from '@/core/physics/unified/PhysicsInterpreter'
import { CoherencyMatrix } from '@/core/physics/unified/CoherencyMatrix'

// ========== Interpreter singleton ==========
const interpreter = new PhysicsInterpreter()

// ========== Constants ==========

/** Maximum game intensity (LightPacket uses 0-15) */
const MAX_GAME_INTENSITY = 15

/** Number of sample points for the E-vector ribbon trail */
const EVECTOR_SAMPLES = 32

/** Radius of the E-vector ribbon from beam center */
const EVECTOR_RADIUS = 0.18

/** Colors for polarization states (same as game POLARIZATION_COLORS but as THREE.Color) */
const POLARIZATION_STATE_COLORS: Record<string, THREE.Color> = {
  'horizontal': new THREE.Color(0xff4444),
  'vertical': new THREE.Color(0x44ff44),
  'diagonal': new THREE.Color(0xffaa00),
  'anti-diagonal': new THREE.Color(0x4444ff),
  'arbitrary': new THREE.Color(0xcc88ff),
}

const COLOR_CIRCULAR_RIGHT = new THREE.Color(0x00ccff)
const COLOR_CIRCULAR_LEFT = new THREE.Color(0xff00cc)
const COLOR_ELLIPTICAL = new THREE.Color(0x88aaff)
const COLOR_UNPOLARIZED = new THREE.Color(0xaaaaaa)
const COLOR_DEFAULT = new THREE.Color(0xffffaa)
const COLOR_ERROR = new THREE.Color(0xff0000)

// ========== Types ==========

interface LightBeamsProps {
  world: World
  visionMode: VisionMode
  /** Enable E-vector debug visualization */
  debugMode?: boolean
}

/**
 * Per-beam physics analysis — computed once per physics tick, consumed by renderer.
 */
interface BeamPhysicsData {
  /** Normalized intensity [0, 1], derived from physics engine */
  uIntensity: number
  /** Stokes parameters [S0, S1, S2, S3] — the complete polarization fingerprint */
  uPolarizationState: [number, number, number, number]
  /** Semantic analysis from PhysicsInterpreter */
  stateDesc: PolarizationStateDescription
  /** Whether this beam violates energy conservation (physics bug) */
  conservationViolation: boolean
}

// ========== Helper: LightPacket → Physics Data ==========

/**
 * Bridge from the game engine's discrete LightPacket to the unified physics
 * engine's continuous CoherencyMatrix, then analyze via PhysicsInterpreter.
 *
 * This is the critical translation step: Game State → Physics Truth → Semantics.
 */
function analyzePacket(packet: LightPacket): BeamPhysicsData {
  const normalizedIntensity = packet.intensity / MAX_GAME_INTENSITY

  // Convert discrete game polarization angle to continuous CoherencyMatrix
  const polarizationRad = (packet.polarization * Math.PI) / 180
  const coherencyState = CoherencyMatrix.createLinear(normalizedIntensity, polarizationRad)

  // Run through the interpreter
  const stateDesc = interpreter.analyzeState(coherencyState)

  // Conservation check: in the game engine, intensity should never exceed MAX
  const conservation = interpreter.validateConservation(MAX_GAME_INTENSITY, packet.intensity)

  return {
    uIntensity: normalizedIntensity,
    uPolarizationState: stateDesc.stokes,
    stateDesc,
    conservationViolation: !conservation.valid,
  }
}

/**
 * Derive beam color from the PhysicsInterpreter's semantic analysis.
 * This replaces the old hardcoded POLARIZATION_COLORS lookup.
 */
function getPhysicsColor(
  data: BeamPhysicsData,
  visionMode: VisionMode,
): THREE.Color {
  // Error state overrides everything
  if (data.conservationViolation) {
    return COLOR_ERROR
  }

  // Normal mode: warm white beam
  if (visionMode !== 'polarized') {
    return COLOR_DEFAULT
  }

  // Polarized vision: color encodes state category
  const { stateDesc } = data

  switch (stateDesc.category) {
    case 'linear':
      return POLARIZATION_STATE_COLORS[stateDesc.linearOrientation] ?? COLOR_DEFAULT
    case 'circular':
      return stateDesc.handedness === 'right' ? COLOR_CIRCULAR_RIGHT : COLOR_CIRCULAR_LEFT
    case 'elliptical':
      return COLOR_ELLIPTICAL
    case 'unpolarized':
    case 'partially-polarized':
      return COLOR_UNPOLARIZED
    case 'zero':
      return COLOR_DEFAULT
    default:
      return COLOR_DEFAULT
  }
}

// ========== Main Component ==========

export function LightBeams({ world, visionMode, debugMode = false }: LightBeamsProps) {
  const [lightStates, setLightStates] = useState<Array<{ position: BlockPosition; state: LightState }>>([])

  useEffect(() => {
    const updateLights = () => {
      setLightStates(world.getAllLightStates())
    }

    updateLights()
    world.addListener(updateLights)

    return () => {
      world.removeListener(updateLights)
    }
  }, [world])

  return (
    <group>
      {lightStates.map(({ position, state }) => (
        <LightAtPosition
          key={`${position.x},${position.y},${position.z}`}
          position={position}
          state={state}
          visionMode={visionMode}
          debugMode={debugMode}
        />
      ))}
    </group>
  )
}

// ========== Per-Position Renderer ==========

interface LightAtPositionProps {
  position: BlockPosition
  state: LightState
  visionMode: VisionMode
  debugMode: boolean
}

function LightAtPosition({ position, state, visionMode, debugMode }: LightAtPositionProps) {
  return (
    <group>
      {state.packets.map((packet, index) => (
        <LightPacketBeam
          key={index}
          position={position}
          packet={packet}
          visionMode={visionMode}
          debugMode={debugMode}
        />
      ))}
    </group>
  )
}

// ========== Single Beam Renderer ==========

interface LightPacketBeamProps {
  position: BlockPosition
  packet: LightPacket
  visionMode: VisionMode
  debugMode: boolean
}

function LightPacketBeam({ position, packet, visionMode, debugMode }: LightPacketBeamProps) {
  // Run physics analysis — this is the single source of truth
  const physicsData = useMemo(() => analyzePacket(packet), [packet])

  // Derive all visual properties from physics data
  const color = useMemo(
    () => getPhysicsColor(physicsData, visionMode),
    [physicsData, visionMode]
  )

  const dir = DIRECTION_VECTORS[packet.direction]

  // Beam geometry: position and orientation
  const { beamPosition, quaternion } = useMemo(() => {
    const startPoint = new THREE.Vector3(
      position.x - dir.x * 0.5,
      position.y - dir.y * 0.5,
      position.z - dir.z * 0.5
    )
    const endPoint = new THREE.Vector3(
      position.x + dir.x * 0.5,
      position.y + dir.y * 0.5,
      position.z + dir.z * 0.5
    )

    const beamPos = startPoint.clone().add(endPoint).multiplyScalar(0.5)

    const direction = new THREE.Vector3(dir.x, dir.y, dir.z)
    const quat = new THREE.Quaternion()
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)

    return { beamPosition: beamPos, quaternion: quat }
  }, [position, dir])

  // uIntensity drives all radius/opacity calculations
  const uIntensity = physicsData.uIntensity
  const beamRadius = 0.02 + uIntensity * 0.03
  const glowRadius = 0.05 + uIntensity * 0.08

  return (
    <group position={[beamPosition.x, beamPosition.y, beamPosition.z]} quaternion={quaternion}>
      {/* Core beam — radius and opacity are pure functions of uIntensity */}
      {physicsData.conservationViolation ? (
        <ErrorBeam beamRadius={beamRadius} />
      ) : (
        <mesh>
          <cylinderGeometry args={[beamRadius, beamRadius, 1, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3 + uIntensity * 0.5}
          />
        </mesh>
      )}

      {/* Glow — wider, more transparent cylinder */}
      <mesh>
        <cylinderGeometry args={[glowRadius, glowRadius, 1, 8]} />
        <meshBasicMaterial
          color={physicsData.conservationViolation ? COLOR_ERROR : color}
          transparent
          opacity={0.1 + uIntensity * 0.2}
        />
      </mesh>

      {/* Polarization E-vector indicator (polarized vision mode) */}
      {visionMode === 'polarized' && !debugMode && (
        <PolarizationArrow
          stateDesc={physicsData.stateDesc}
          direction={packet.direction}
          color={color}
        />
      )}

      {/* Debug mode: E-vector oscillation ribbon trail */}
      {debugMode && (
        <EVectorRibbon
          stateDesc={physicsData.stateDesc}
          stokes={physicsData.uPolarizationState}
          direction={packet.direction}
          intensity={uIntensity}
        />
      )}
    </group>
  )
}

// ========== Error Beam (Flashing Red) ==========

/**
 * When the PhysicsInterpreter flags a conservation violation,
 * this replaces the normal beam with a flashing red cylinder.
 * This is the "Internal Error Correction" feedback loop —
 * physics bugs become immediately visible in the game world.
 */
function ErrorBeam({ beamRadius }: { beamRadius: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Rapid sinusoidal flash: 4 Hz, sharp pulse
      const t = clock.getElapsedTime()
      const flash = Math.pow(Math.sin(t * 4 * Math.PI) * 0.5 + 0.5, 0.3)
      materialRef.current.opacity = 0.3 + flash * 0.7
    }
  })

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[beamRadius * 1.5, beamRadius * 1.5, 1, 8]} />
      <meshBasicMaterial
        ref={materialRef}
        color={COLOR_ERROR}
        transparent
        opacity={1}
      />
    </mesh>
  )
}

// ========== Polarization Arrow (Upgraded) ==========

interface PolarizationArrowProps {
  stateDesc: PolarizationStateDescription
  direction: string
  color: THREE.Color
}

/**
 * Draws the E-vector direction as a line segment perpendicular to the beam.
 * Now driven by PhysicsInterpreter's semantic analysis instead of raw game angles.
 */
function PolarizationArrow({ stateDesc, direction, color }: PolarizationArrowProps) {
  const angle = (stateDesc.orientationDeg * Math.PI) / 180
  const arrowLength = 0.2

  const points = useMemo(() => [
    new THREE.Vector3(-Math.cos(angle) * arrowLength, 0, -Math.sin(angle) * arrowLength),
    new THREE.Vector3(Math.cos(angle) * arrowLength, 0, Math.sin(angle) * arrowLength),
  ], [angle, arrowLength])

  // Rotation to align with beam propagation direction
  const rotation = useMemo(() => {
    const dir = DIRECTION_VECTORS[direction as keyof typeof DIRECTION_VECTORS]
    if (dir.y !== 0) {
      return [Math.PI / 2, 0, 0] as [number, number, number]
    } else if (dir.x !== 0) {
      return [0, 0, Math.PI / 2] as [number, number, number]
    }
    return [0, 0, 0] as [number, number, number]
  }, [direction])

  return (
    <group rotation={rotation}>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.8}
      />
    </group>
  )
}

// ========== E-Vector Ribbon Trail (Debug Mode) ==========

interface EVectorRibbonProps {
  stateDesc: PolarizationStateDescription
  stokes: [number, number, number, number]
  direction: string
  intensity: number
}

/**
 * Debug visualization: renders the E-field oscillation as a helical ribbon
 * along the beam. This allows visual verification of polarization states:
 *
 * - Linear: flat ribbon oscillating in the polarization plane
 * - Circular: helical corkscrew (right-hand or left-hand twist)
 * - Elliptical: squashed helix
 *
 * The ribbon animates in real-time, so you can watch the E-vector rotate
 * and verify the physics engine is computing circular polarization correctly.
 */
function EVectorRibbon({ stateDesc, stokes, direction, intensity }: EVectorRibbonProps) {
  const groupRef = useRef<THREE.Group>(null)
  const phaseRef = useRef(0)

  const s0 = stokes[0]

  // Orientation angle and ellipticity from the interpreter
  const orientationRad = (stateDesc.orientationDeg * Math.PI) / 180
  const ellipticityRad = (stateDesc.ellipticityDeg * Math.PI) / 180

  // Semi-axes of the polarization ellipse
  const cosE = Math.cos(ellipticityRad)
  const sinE = Math.sin(ellipticityRad)

  // Build the axis rotation to align with beam direction
  const dirRotation = useMemo(() => {
    const dir = DIRECTION_VECTORS[direction as keyof typeof DIRECTION_VECTORS]
    if (dir.y !== 0) {
      return [Math.PI / 2, 0, 0] as [number, number, number]
    } else if (dir.x !== 0) {
      return [0, 0, Math.PI / 2] as [number, number, number]
    }
    return [0, 0, 0] as [number, number, number]
  }, [direction])

  // Choose ribbon color based on polarization type
  const ribbonColor = useMemo(() => {
    switch (stateDesc.category) {
      case 'circular':
        return stateDesc.handedness === 'right' ? COLOR_CIRCULAR_RIGHT : COLOR_CIRCULAR_LEFT
      case 'elliptical':
        return COLOR_ELLIPTICAL
      case 'linear':
        return POLARIZATION_STATE_COLORS[stateDesc.linearOrientation] ?? COLOR_DEFAULT
      default:
        return COLOR_UNPOLARIZED
    }
  }, [stateDesc.category, stateDesc.handedness, stateDesc.linearOrientation])

  // Create THREE.Line imperatively — lets us update geometry per-frame efficiently
  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array((EVECTOR_SAMPLES + 1) * 3)
    for (let i = 0; i <= EVECTOR_SAMPLES; i++) {
      positions[i * 3 + 1] = i / EVECTOR_SAMPLES - 0.5
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.7,
    })
    return new THREE.Line(geo, mat)
  }, [])

  // Keep material color in sync with React state
  useEffect(() => {
    const mat = lineObj.material as THREE.LineBasicMaterial
    mat.color.copy(ribbonColor)
  }, [lineObj, ribbonColor])

  // Animate the E-vector oscillation every frame
  useFrame(({ clock }) => {
    phaseRef.current = clock.getElapsedTime() * 3

    const phase = phaseRef.current
    const r = EVECTOR_RADIUS * Math.min(1, intensity * 2)

    if (s0 < 1e-8) return

    const geo = lineObj.geometry as THREE.BufferGeometry
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute

    const cosO = Math.cos(orientationRad)
    const sinO = Math.sin(orientationRad)

    for (let i = 0; i <= EVECTOR_SAMPLES; i++) {
      const t = i / EVECTOR_SAMPLES
      const y = t - 0.5
      const omega = t * Math.PI * 4 + phase

      const eA = cosE * Math.cos(omega)
      const eB = sinE * Math.sin(omega)
      const ex = (eA * cosO - eB * sinO) * r
      const ez = (eA * sinO + eB * cosO) * r

      posAttr.setXYZ(i, ex, y, ez)
    }

    posAttr.needsUpdate = true
    geo.computeBoundingSphere()
  })

  return (
    <group ref={groupRef} rotation={dirRotation}>
      <primitive object={lineObj} />

      {/* Tip arrow: small sphere at the leading E-vector tip */}
      <EVectorTip
        orientationRad={orientationRad}
        ellipticityRad={ellipticityRad}
        intensity={intensity}
        color={ribbonColor}
        s0={s0}
      />
    </group>
  )
}

// ========== E-Vector Tip Indicator ==========

interface EVectorTipProps {
  orientationRad: number
  ellipticityRad: number
  intensity: number
  color: THREE.Color
  s0: number
}

/**
 * Small sphere at the tip of the E-vector that orbits in real-time,
 * making it crystal clear whether polarization is linear (back-and-forth),
 * circular (smooth orbit), or elliptical (squashed orbit).
 */
function EVectorTip({ orientationRad, ellipticityRad, intensity, color, s0 }: EVectorTipProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const cosE = Math.cos(ellipticityRad)
  const sinE = Math.sin(ellipticityRad)
  const cosO = Math.cos(orientationRad)
  const sinO = Math.sin(orientationRad)

  useFrame(({ clock }) => {
    if (!meshRef.current || s0 < 1e-8) return

    const omega = clock.getElapsedTime() * 3
    const r = EVECTOR_RADIUS * Math.min(1, intensity * 2)

    const eA = cosE * Math.cos(omega) * r
    const eB = sinE * Math.sin(omega) * r

    const ex = eA * cosO - eB * sinO
    const ez = eA * sinO + eB * cosO

    meshRef.current.position.set(ex, 0.5, ez)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  )
}
