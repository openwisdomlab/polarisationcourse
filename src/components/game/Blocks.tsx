/**
 * Blocks Component - Enhanced 3D block rendering with unique designs
 * Each block type has distinctive visual characteristics
 */
import { useEffect, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { Line, Float, Html } from '@react-three/drei'
import { World } from '@/core/World'
import { BlockState, BlockPosition, POLARIZATION_COLORS } from '@/core/types'
import { VisionMode } from '@/stores/gameStore'

interface BlocksProps {
  world: World
  visionMode: VisionMode
  onBlockClick: (position: BlockPosition, normal: THREE.Vector3, button: number) => void
  onBlockHover: (position: BlockPosition | null, targetPos: BlockPosition | null) => void
}

export function Blocks({ world, visionMode, onBlockClick, onBlockHover }: BlocksProps) {
  const [blocks, setBlocks] = useState<Array<{ position: BlockPosition; state: BlockState }>>([])
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const updateBlocks = () => {
      setBlocks(world.getAllBlocks())
      setVersion(v => v + 1)
    }

    updateBlocks()
    world.addListener(updateBlocks)

    return () => {
      world.removeListener(updateBlocks)
    }
  }, [world])

  return (
    <group>
      {blocks.map(({ position, state }) => (
        <Block
          key={`${position.x},${position.y},${position.z}-${version}`}
          position={position}
          state={state}
          visionMode={visionMode}
          onBlockClick={onBlockClick}
          onBlockHover={onBlockHover}
        />
      ))}
    </group>
  )
}

interface BlockProps {
  position: BlockPosition
  state: BlockState
  visionMode: VisionMode
  onBlockClick: (position: BlockPosition, normal: THREE.Vector3, button: number) => void
  onBlockHover: (position: BlockPosition | null, targetPos: BlockPosition | null) => void
}

function Block({ position, state, visionMode, onBlockClick, onBlockHover }: BlockProps) {
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.face) {
      onBlockClick(position, e.face.normal, e.button)
    }
  }, [position, onBlockClick])

  const handlePointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.face) {
      const targetPos: BlockPosition = {
        x: position.x + Math.round(e.face.normal.x),
        y: position.y + Math.round(e.face.normal.y),
        z: position.z + Math.round(e.face.normal.z),
      }
      onBlockHover(position, targetPos)
    }
  }, [position, onBlockHover])

  const handlePointerLeave = useCallback(() => {
    onBlockHover(null, null)
  }, [onBlockHover])

  // Skip air blocks
  if (state.type === 'air') return null

  const rotationY = (state.rotation * Math.PI) / 180

  // Render specific block type
  switch (state.type) {
    case 'solid':
      return (
        <SolidBlock
          position={position}
          rotationY={rotationY}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )
    case 'emitter':
      return (
        <EmitterBlock
          position={position}
          state={state}
          rotationY={rotationY}
          visionMode={visionMode}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )
    case 'polarizer':
      return (
        <PolarizerBlock
          position={position}
          state={state}
          rotationY={rotationY}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )
    case 'rotator':
      return (
        <RotatorBlock
          position={position}
          state={state}
          rotationY={rotationY}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )
    case 'splitter':
      return (
        <SplitterBlock
          position={position}
          rotationY={rotationY}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )
    case 'sensor':
      return (
        <SensorBlock
          position={position}
          state={state}
          rotationY={rotationY}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )
    case 'mirror':
      return (
        <MirrorBlock
          position={position}
          rotationY={rotationY}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )
    default:
      return null
  }
}

// Shared props for block components
interface BlockComponentProps {
  position: BlockPosition
  rotationY: number
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void
  onPointerEnter: (e: ThreeEvent<PointerEvent>) => void
  onPointerLeave: () => void
}

// Solid Block - Basic building block with grid pattern
function SolidBlock({ position, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: BlockComponentProps) {
  const isGround = position.y === 0

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        rotation={[0, rotationY, 0]}
        castShadow
        receiveShadow
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={isGround ? 0x1a1a2e : 0x2d2d44}
          roughness={isGround ? 0.95 : 0.8}
          metalness={isGround ? 0.0 : 0.1}
        />
      </mesh>

      {/* Grid pattern on ground */}
      {isGround && (
        <lineSegments rotation={[0, rotationY, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color={0x3a3a5e} transparent opacity={0.5} />
        </lineSegments>
      )}

      {/* Edges for non-ground */}
      {!isGround && (
        <lineSegments rotation={[0, rotationY, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color={0x4a4a6e} transparent opacity={0.4} />
        </lineSegments>
      )}
    </group>
  )
}

// Emitter Block - Glowing light source with animated rays
interface EmitterBlockProps extends BlockComponentProps {
  state: BlockState
  visionMode: VisionMode
}

function EmitterBlock({ position, state, rotationY, visionMode, onPointerDown, onPointerEnter, onPointerLeave }: EmitterBlockProps) {
  const color = visionMode === 'polarized'
    ? POLARIZATION_COLORS[state.polarizationAngle as keyof typeof POLARIZATION_COLORS] || 0xffff00
    : 0xffff00

  return (
    <group position={[position.x, position.y, position.z]}>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
        {/* Main body */}
        <mesh
          rotation={[0, rotationY, 0]}
          castShadow
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <boxGeometry args={[0.85, 0.85, 0.85]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Inner glow core */}
        <mesh rotation={[0, rotationY, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color={0xffffff} transparent opacity={0.8} />
        </mesh>

        {/* Corner accents */}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
          <mesh key={i} position={[x * 0.4, 0, z * 0.4]} rotation={[0, rotationY, 0]}>
            <boxGeometry args={[0.1, 0.9, 0.1]} />
            <meshStandardMaterial color={0x333333} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </Float>

      {/* Edges with glow */}
      <lineSegments rotation={[0, rotationY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.85, 0.85, 0.85)]} />
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </lineSegments>

      {/* Polarization indicator */}
      <PolarizationIndicator angle={state.polarizationAngle} rotation={rotationY} offset={0.43} />
    </group>
  )
}

// Polarizer Block - Transparent filter with visible grid lines
interface PolarizerBlockProps extends BlockComponentProps {
  state: BlockState
}

function PolarizerBlock({ position, state, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: PolarizerBlockProps) {
  const color = POLARIZATION_COLORS[state.polarizationAngle as keyof typeof POLARIZATION_COLORS] || 0x00aaff

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Frame */}
      <mesh rotation={[0, rotationY, 0]}>
        <boxGeometry args={[1, 1, 0.15]} />
        <meshStandardMaterial color={0x222244} roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Transparent filter */}
      <mesh
        rotation={[0, rotationY, 0]}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[0.85, 0.85, 0.08]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Polarization grid lines */}
      <PolarizationGridLines angle={state.polarizationAngle} rotation={rotationY} />

      {/* Frame edges */}
      <lineSegments rotation={[0, rotationY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 0.15)]} />
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>
    </group>
  )
}

// Rotator Block - Crystal-like appearance with spiral pattern
interface RotatorBlockProps extends BlockComponentProps {
  state: BlockState
}

function RotatorBlock({ position, state, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: RotatorBlockProps) {
  const is90 = state.rotationAmount === 90

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Hexagonal frame */}
      <mesh
        rotation={[0, rotationY, 0]}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.25, 6]} />
        <meshStandardMaterial
          color={is90 ? 0x9900ff : 0xff00ff}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Inner spiral decoration */}
      <SpiralDecoration rotation={rotationY} is90={is90} />

      {/* Rotation amount indicator */}
      <mesh position={[0, 0.2, 0]} rotation={[0, rotationY, 0]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={0.9} />
      </mesh>

      {/* Label */}
      <Html position={[0, 0.4, 0]} center>
        <div className="text-[10px] font-bold text-purple-400 bg-black/50 px-1 rounded">
          {is90 ? '90°' : '45°'}
        </div>
      </Html>
    </group>
  )
}

// Splitter Block - Calcite crystal appearance
function SplitterBlock({ position, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: BlockComponentProps) {
  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main crystal shape - rhombohedron approximation */}
      <mesh
        rotation={[0, rotationY, Math.PI / 6]}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        castShadow
      >
        <octahedronGeometry args={[0.55]} />
        <meshStandardMaterial
          color={0x00ffff}
          transparent
          opacity={0.75}
          roughness={0.05}
          metalness={0.6}
        />
      </mesh>

      {/* Inner facets */}
      <mesh rotation={[0, rotationY + Math.PI / 4, Math.PI / 6]}>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color={0xffffff}
          transparent
          opacity={0.3}
          roughness={0.0}
        />
      </mesh>

      {/* Edge glow */}
      <lineSegments rotation={[0, rotationY, Math.PI / 6]}>
        <edgesGeometry args={[new THREE.OctahedronGeometry(0.55)]} />
        <lineBasicMaterial color={0x00ffff} transparent opacity={0.8} />
      </lineSegments>

      {/* Output direction indicators */}
      <Line
        points={[[0, 0, 0], [0.6, 0.3, 0]]}
        color={0xff4444}
        lineWidth={2}
      />
      <Line
        points={[[0, 0, 0], [0.6, -0.3, 0]]}
        color={0x44ff44}
        lineWidth={2}
      />
    </group>
  )
}

// Sensor Block - Receiver with activation glow
interface SensorBlockProps extends BlockComponentProps {
  state: BlockState
}

function SensorBlock({ position, state, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: SensorBlockProps) {
  const activated = state.activated
  const color = activated ? 0x00ff00 : 0x333344

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main body */}
      <mesh
        rotation={[0, rotationY, 0]}
        castShadow
        receiveShadow
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color={color}
          emissive={activated ? 0x00ff00 : 0x000000}
          emissiveIntensity={activated ? 0.8 : 0}
          roughness={activated ? 0.3 : 0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Sensor lens */}
      <mesh position={[0, 0, 0.4]} rotation={[0, rotationY, 0]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial
          color={activated ? 0x88ff88 : 0x445566}
          emissive={activated ? 0x00ff00 : 0x000000}
          emissiveIntensity={activated ? 1 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Frame ring */}
      <mesh position={[0, 0, 0.38]} rotation={[0, rotationY, 0]}>
        <ringGeometry args={[0.25, 0.32, 32]} />
        <meshStandardMaterial color={0x666688} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Activation glow */}
      {activated && (
        <Float speed={4} floatIntensity={0.1}>
          <pointLight color={0x00ff00} intensity={0.5} distance={3} />
        </Float>
      )}

      {/* Edges */}
      <lineSegments rotation={[0, rotationY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.9)]} />
        <lineBasicMaterial color={activated ? 0x00ff00 : 0x445566} transparent opacity={0.6} />
      </lineSegments>
    </group>
  )
}

// Mirror Block - Highly reflective surface
function MirrorBlock({ position, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: BlockComponentProps) {
  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Frame */}
      <mesh rotation={[0, rotationY, 0]}>
        <boxGeometry args={[0.15, 1, 1]} />
        <meshStandardMaterial color={0x333333} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Mirror surface */}
      <mesh
        rotation={[0, rotationY, 0]}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[0.08, 0.9, 0.9]} />
        <meshStandardMaterial
          color={0xdddddd}
          roughness={0.02}
          metalness={0.98}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Edge highlight */}
      <lineSegments rotation={[0, rotationY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.15, 1, 1)]} />
        <lineBasicMaterial color={0x888888} transparent opacity={0.5} />
      </lineSegments>
    </group>
  )
}

// Helper components

interface PolarizationIndicatorProps {
  angle: number
  rotation: number
  offset?: number
}

function PolarizationIndicator({ angle, rotation, offset = 0.06 }: PolarizationIndicatorProps) {
  const color = POLARIZATION_COLORS[angle as keyof typeof POLARIZATION_COLORS] || 0xffffff
  const radians = (angle * Math.PI) / 180
  const length = 0.35

  const points: [number, number, number][] = [
    [-Math.cos(radians) * length, -Math.sin(radians) * length, offset],
    [Math.cos(radians) * length, Math.sin(radians) * length, offset],
  ]

  return (
    <group rotation={[0, rotation, 0]}>
      <Line points={points} color={color} lineWidth={3} />
      {/* Arrow head */}
      <mesh position={[Math.cos(radians) * length, Math.sin(radians) * length, offset + 0.02]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

interface PolarizationGridLinesProps {
  angle: number
  rotation: number
}

function PolarizationGridLines({ angle, rotation }: PolarizationGridLinesProps) {
  const radians = (angle * Math.PI) / 180
  const lineCount = 7

  const lines = useMemo(() => {
    const result: Array<[number, number, number][]> = []
    for (let i = 0; i < lineCount; i++) {
      const offset = (i - (lineCount - 1) / 2) * 0.12
      const perpX = -Math.sin(radians) * offset
      const perpY = Math.cos(radians) * offset

      result.push([
        [perpX - Math.cos(radians) * 0.4, perpY - Math.sin(radians) * 0.4, 0],
        [perpX + Math.cos(radians) * 0.4, perpY + Math.sin(radians) * 0.4, 0],
      ])
    }
    return result
  }, [angle, radians])

  const color = POLARIZATION_COLORS[angle as keyof typeof POLARIZATION_COLORS] || 0x00aaff

  return (
    <group rotation={[0, rotation, 0]}>
      {lines.map((points, i) => (
        <Line key={i} points={points} color={color} lineWidth={1} transparent opacity={0.6} />
      ))}
    </group>
  )
}

interface SpiralDecorationProps {
  rotation: number
  is90: boolean
}

function SpiralDecoration({ rotation, is90 }: SpiralDecorationProps) {
  const spiralPoints = useMemo(() => {
    const points: [number, number, number][] = []
    const turns = is90 ? 0.5 : 0.25
    const segments = 20

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const angle = t * turns * Math.PI * 2
      const r = 0.1 + t * 0.25
      points.push([
        Math.cos(angle) * r,
        t * 0.2 - 0.1,
        Math.sin(angle) * r,
      ])
    }
    return points
  }, [is90])

  return (
    <group rotation={[0, rotation, 0]}>
      <Line
        points={spiralPoints}
        color={is90 ? 0xcc00ff : 0xff66ff}
        lineWidth={2}
      />
    </group>
  )
}
