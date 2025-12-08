import { useEffect, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { Line } from '@react-three/drei'
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

function Block({ position, state, onBlockClick, onBlockHover }: BlockProps) {
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

  // Get geometry and material based on block type
  const { geometry, material } = useMemo(() => {
    let geo: THREE.BufferGeometry = new THREE.BoxGeometry(1, 1, 1)
    let mat: THREE.Material

    switch (state.type) {
      case 'solid':
        mat = new THREE.MeshStandardMaterial({
          color: position.y === 0 ? 0x222233 : 0x444455,
          roughness: position.y === 0 ? 0.9 : 0.8,
          metalness: position.y === 0 ? 0.0 : 0.1,
        })
        break

      case 'emitter':
        mat = new THREE.MeshStandardMaterial({
          color: 0xffffaa,
          emissive: 0xffff00,
          emissiveIntensity: 0.5,
          roughness: 0.3,
        })
        break

      case 'polarizer':
        geo = new THREE.BoxGeometry(0.9, 0.9, 0.1)
        mat = new THREE.MeshStandardMaterial({
          color: 0x00aaff,
          transparent: true,
          opacity: 0.6,
          roughness: 0.2,
          metalness: 0.3,
        })
        break

      case 'rotator':
        geo = new THREE.BoxGeometry(0.8, 0.8, 0.2)
        mat = new THREE.MeshStandardMaterial({
          color: 0xff00ff,
          transparent: true,
          opacity: 0.5,
          roughness: 0.3,
        })
        break

      case 'splitter':
        geo = new THREE.OctahedronGeometry(0.5)
        mat = new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.7,
          roughness: 0.1,
          metalness: 0.5,
        })
        break

      case 'sensor':
        mat = new THREE.MeshStandardMaterial({
          color: state.activated ? 0x00ff00 : 0x333344,
          emissive: state.activated ? 0x00ff00 : 0x000000,
          emissiveIntensity: state.activated ? 0.8 : 0,
          roughness: state.activated ? 0.3 : 0.5,
          metalness: 0.2,
        })
        break

      case 'mirror':
        geo = new THREE.BoxGeometry(0.1, 0.9, 0.9)
        mat = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.05,
          metalness: 0.95,
        })
        break

      default:
        mat = new THREE.MeshStandardMaterial({ color: 0x888888 })
    }

    return { geometry: geo, material: mat }
  }, [state.type, state.activated, position.y])

  // Skip air blocks
  if (state.type === 'air') return null

  const rotationY = (state.rotation * Math.PI) / 180

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        geometry={geometry}
        material={material}
        rotation={[0, rotationY, 0]}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Edge lines for non-ground blocks */}
      {position.y > 0 && state.type !== 'splitter' && (
        <lineSegments rotation={[0, rotationY, 0]}>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color={0x000000} transparent opacity={0.3} />
        </lineSegments>
      )}

      {/* Polarization indicator for polarizers and emitters */}
      {(state.type === 'polarizer' || state.type === 'emitter') && (
        <PolarizationIndicator
          angle={state.polarizationAngle}
          rotation={rotationY}
        />
      )}
    </group>
  )
}

interface PolarizationIndicatorProps {
  angle: number
  rotation: number
}

function PolarizationIndicator({ angle, rotation }: PolarizationIndicatorProps) {
  const color = POLARIZATION_COLORS[angle as keyof typeof POLARIZATION_COLORS] || 0xffffff
  const radians = (angle * Math.PI) / 180
  const length = 0.4

  const points = useMemo(() => [
    new THREE.Vector3(-Math.cos(radians) * length, -Math.sin(radians) * length, 0.06),
    new THREE.Vector3(Math.cos(radians) * length, Math.sin(radians) * length, 0.06),
  ], [radians, length])

  return (
    <group rotation={[0, rotation, 0]}>
      <Line
        points={points}
        color={color}
        lineWidth={2}
      />
      <mesh position={[Math.cos(radians) * length, Math.sin(radians) * length, 0.08]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}
