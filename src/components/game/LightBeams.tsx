/**
 * LightBeams.tsx — Physics-Driven Light Beam Visualization (v2)
 *
 * Visual layer that is a pure function of the physics state.
 * All rendering uniforms (intensity, polarization, color) are derived strictly
 * from the PhysicsInterpreter's analysis of each LightPacket.
 *
 * v2 Enhancements:
 * 1. Custom PolarizationBeamMaterial (ShaderMaterial) with GPU-driven uniforms:
 *    - uIntensity (float 0-1): drives radius scaling and alpha
 *    - uPolarizationState (vec4 Stokes): encodes full polarization fingerprint
 *    - uTime (float): animated circular polarization twist on the beam surface
 *    - uCategory (int): 0=linear, 1=circular, 2=elliptical, 3=unpolarized
 * 2. E-vector ribbon trail promoted to polarized vision mode (not just debug)
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

// ========== Polarization Category Enum (for shader) ==========
const CATEGORY_LINEAR = 0
const CATEGORY_CIRCULAR = 1
const CATEGORY_ELLIPTICAL = 2
const CATEGORY_UNPOLARIZED = 3

function categoryToInt(cat: PolarizationStateDescription['category']): number {
  switch (cat) {
    case 'linear': return CATEGORY_LINEAR
    case 'circular': return CATEGORY_CIRCULAR
    case 'elliptical': return CATEGORY_ELLIPTICAL
    case 'unpolarized':
    case 'partially-polarized':
      return CATEGORY_UNPOLARIZED
    default: return CATEGORY_LINEAR
  }
}

// ========== Custom ShaderMaterial: PolarizationBeamMaterial ==========

/**
 * GLSL vertex/fragment pair for the core beam cylinder.
 *
 * The fragment shader modulates surface color based on:
 * - uIntensity: overall brightness and alpha
 * - uCategory: selects rendering style
 * - uTime + uEllipticity: for circular/elliptical, creates an animated
 *   helical twist pattern on the beam surface (the "twist" of CPL)
 * - uHandedness: +1 for RCP, -1 for LCP (reverses twist direction)
 */
const beamVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const beamFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uTime;
  uniform int uCategory;
  uniform float uEllipticity;
  uniform float uHandedness;
  uniform float uOrientation;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float alpha = 0.3 + uIntensity * 0.5;

    // Base color from physics-derived classification
    vec3 color = uColor;

    // For circular/elliptical polarization: add animated helical twist pattern
    if (uCategory == 1 || uCategory == 2) {
      // Twist frequency scales with ellipticity (0 = linear → no twist, 1 = circular → full twist)
      float twistStrength = abs(uEllipticity);

      // The twist pattern: a diagonal stripe that rotates along the beam axis (vUv.y)
      // vUv.x wraps around the cylinder circumference, vUv.y runs along the beam length
      float twistPhase = vUv.y * 6.2832 * 2.0 + uHandedness * uTime * 3.0;
      float twist = sin(twistPhase + vUv.x * 6.2832) * 0.5 + 0.5;

      // Blend twist pattern into color: brighter bands spiral along the beam
      float twistAlpha = twist * twistStrength * 0.3;
      color = mix(color, vec3(1.0), twistAlpha);
      alpha += twistAlpha * uIntensity;
    }

    // For unpolarized light: subtle shimmer to indicate incoherence
    if (uCategory == 3) {
      float shimmer = sin(vUv.y * 20.0 + uTime * 5.0) * 0.5 + 0.5;
      shimmer *= sin(vUv.x * 12.0 + uTime * 3.7) * 0.5 + 0.5;
      alpha *= 0.7 + shimmer * 0.3;
    }

    // Edge glow: brighter at the silhouette (Fresnel-like)
    float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    color += fresnel * 0.15 * uIntensity;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`

/**
 * Creates a reusable ShaderMaterial for polarization-aware beam rendering.
 */
function createPolarizationBeamMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: beamVertexShader,
    fragmentShader: beamFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(0xffffaa) },
      uIntensity: { value: 1.0 },
      uTime: { value: 0.0 },
      uCategory: { value: CATEGORY_LINEAR },
      uEllipticity: { value: 0.0 },
      uHandedness: { value: 1.0 },
      uOrientation: { value: 0.0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
}

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

// ========== Helper: LightPacket -> Physics Data ==========

/**
 * Bridge from the game engine's discrete LightPacket to the unified physics
 * engine's continuous CoherencyMatrix, then analyze via PhysicsInterpreter.
 *
 * This is the critical translation step: Game State -> Physics Truth -> Semantics.
 */
function analyzePacket(packet: LightPacket): BeamPhysicsData {
  const normalizedIntensity = packet.intensity / MAX_GAME_INTENSITY

  // Convert discrete game polarization angle to continuous CoherencyMatrix
  const polarizationRad = (packet.polarization * Math.PI) / 180
  const coherencyState = CoherencyMatrix.createLinear(normalizedIntensity, polarizationRad)

  // Run through the interpreter
  const stateDesc = interpreter.analyzeState(coherencyState)

  // Conservation check: intensity must be within physical bounds.
  const outOfBounds = packet.intensity < 0 || packet.intensity > MAX_GAME_INTENSITY
  const unphysical = !coherencyState.isPhysical()
  const conservationViolation = outOfBounds || unphysical

  return {
    uIntensity: normalizedIntensity,
    uPolarizationState: stateDesc.stokes,
    stateDesc,
    conservationViolation,
  }
}

/**
 * Derive beam color from the PhysicsInterpreter's semantic analysis.
 */
function getPhysicsColor(
  data: BeamPhysicsData,
  visionMode: VisionMode,
): THREE.Color {
  if (data.conservationViolation) {
    return COLOR_ERROR
  }

  if (visionMode !== 'polarized') {
    return COLOR_DEFAULT
  }

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

  // Create the custom shader material (memoized per-beam)
  const shaderMaterial = useMemo(() => createPolarizationBeamMaterial(), [])

  // Update shader uniforms each frame
  useFrame(({ clock }) => {
    shaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
    shaderMaterial.uniforms.uColor.value.copy(color)
    shaderMaterial.uniforms.uIntensity.value = uIntensity
    shaderMaterial.uniforms.uCategory.value = categoryToInt(physicsData.stateDesc.category)
    shaderMaterial.uniforms.uEllipticity.value = (physicsData.stateDesc.ellipticityDeg / 45.0)
    shaderMaterial.uniforms.uHandedness.value = physicsData.stateDesc.handedness === 'left' ? -1.0 : 1.0
    shaderMaterial.uniforms.uOrientation.value = physicsData.stateDesc.orientationDeg * Math.PI / 180
  })

  // Determine whether to show the E-vector ribbon:
  // In polarized mode for circular/elliptical states, OR always in debug mode
  const showRibbon =
    debugMode ||
    (visionMode === 'polarized' &&
      (physicsData.stateDesc.category === 'circular' ||
        physicsData.stateDesc.category === 'elliptical'))

  return (
    <group position={[beamPosition.x, beamPosition.y, beamPosition.z]} quaternion={quaternion}>
      {/* Core beam — custom shader driven by physics uniforms */}
      {physicsData.conservationViolation ? (
        <ErrorBeam beamRadius={beamRadius} />
      ) : (
        <mesh material={shaderMaterial}>
          <cylinderGeometry args={[beamRadius, beamRadius, 1, 16]} />
        </mesh>
      )}

      {/* Glow — wider, more transparent cylinder */}
      <mesh>
        <cylinderGeometry args={[glowRadius, glowRadius, 1, 8]} />
        <meshBasicMaterial
          color={physicsData.conservationViolation ? COLOR_ERROR : color}
          transparent
          opacity={0.1 + uIntensity * 0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Polarization E-vector indicator (polarized vision, linear states) */}
      {visionMode === 'polarized' && !showRibbon && (
        <PolarizationArrow
          stateDesc={physicsData.stateDesc}
          direction={packet.direction}
          color={color}
        />
      )}

      {/* E-vector oscillation ribbon: visible in polarized mode for circular/elliptical,
          and always in debug mode for all states */}
      {showRibbon && (
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
 * This is the "Internal Error Correction" feedback loop --
 * physics bugs become immediately visible in the game world.
 */
function ErrorBeam({ beamRadius }: { beamRadius: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
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

// ========== Polarization Arrow (Linear States) ==========

interface PolarizationArrowProps {
  stateDesc: PolarizationStateDescription
  direction: string
  color: THREE.Color
}

/**
 * Draws the E-vector direction as a line segment perpendicular to the beam.
 * Driven by PhysicsInterpreter's semantic analysis.
 */
function PolarizationArrow({ stateDesc, direction, color }: PolarizationArrowProps) {
  const angle = (stateDesc.orientationDeg * Math.PI) / 180
  const arrowLength = 0.2

  const points = useMemo(() => [
    new THREE.Vector3(-Math.cos(angle) * arrowLength, 0, -Math.sin(angle) * arrowLength),
    new THREE.Vector3(Math.cos(angle) * arrowLength, 0, Math.sin(angle) * arrowLength),
  ], [angle, arrowLength])

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

// ========== E-Vector Ribbon Trail ==========

interface EVectorRibbonProps {
  stateDesc: PolarizationStateDescription
  stokes: [number, number, number, number]
  direction: string
  intensity: number
}

/**
 * Renders the E-field oscillation as a helical ribbon along the beam.
 * Now visible in polarized vision mode for circular/elliptical states,
 * providing intuitive visual distinction:
 *
 * - Linear: flat ribbon oscillating in the polarization plane
 * - Circular: helical corkscrew (right-hand or left-hand twist)
 * - Elliptical: squashed helix
 */
function EVectorRibbon({ stateDesc, stokes, direction, intensity }: EVectorRibbonProps) {
  const groupRef = useRef<THREE.Group>(null)
  const phaseRef = useRef(0)

  const s0 = stokes[0]

  const orientationRad = (stateDesc.orientationDeg * Math.PI) / 180
  const ellipticityRad = (stateDesc.ellipticityDeg * Math.PI) / 180

  const cosE = Math.cos(ellipticityRad)
  const sinE = Math.sin(ellipticityRad)

  const dirRotation = useMemo(() => {
    const dir = DIRECTION_VECTORS[direction as keyof typeof DIRECTION_VECTORS]
    if (dir.y !== 0) {
      return [Math.PI / 2, 0, 0] as [number, number, number]
    } else if (dir.x !== 0) {
      return [0, 0, Math.PI / 2] as [number, number, number]
    }
    return [0, 0, 0] as [number, number, number]
  }, [direction])

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

  useEffect(() => {
    const mat = lineObj.material as THREE.LineBasicMaterial
    mat.color.copy(ribbonColor)
  }, [lineObj, ribbonColor])

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
