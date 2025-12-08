/**
 * Blocks Component - Enhanced 3D block rendering with unique designs
 * Each block type has distinctive visual characteristics
 * 重新设计：增强视觉效果和交互反馈
 */
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ThreeEvent, useFrame } from '@react-three/fiber'
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

// Emitter Block - 发光光源，设计感更强，像真实的激光器
interface EmitterBlockProps extends BlockComponentProps {
  state: BlockState
  visionMode: VisionMode
}

function EmitterBlock({ position, state, rotationY, visionMode, onPointerDown, onPointerEnter, onPointerLeave }: EmitterBlockProps) {
  const color = visionMode === 'polarized'
    ? POLARIZATION_COLORS[state.polarizationAngle as keyof typeof POLARIZATION_COLORS] || 0xffff00
    : 0xffff00

  const pulseRef = useRef<THREE.Mesh>(null)

  // 脉冲动画
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.1
      pulseRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.15}>
        {/* 底座 - 金属质感 */}
        <mesh
          position={[0, -0.35, 0]}
          rotation={[0, rotationY, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.45, 0.5, 0.15, 8]} />
          <meshStandardMaterial color={0x2a2a3e} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 主体 - 圆柱形光源壳体 */}
        <mesh
          rotation={[0, rotationY, 0]}
          castShadow
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <cylinderGeometry args={[0.35, 0.4, 0.6, 8]} />
          <meshStandardMaterial
            color={0x1a1a2e}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* 发光核心 - 动态脉冲 */}
        <mesh ref={pulseRef} rotation={[0, rotationY, 0]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* 外发光环 */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.35, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* 顶部透镜 */}
        <mesh position={[0, 0.35, 0]} rotation={[0, rotationY, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.5}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>

        {/* 发光点光源 */}
        <pointLight color={color} intensity={0.8} distance={4} />
      </Float>

      {/* 偏振方向指示器 */}
      <PolarizationIndicator angle={state.polarizationAngle} rotation={rotationY} offset={0.5} />

      {/* 偏振角度标签 */}
      <Html position={[0, 0.7, 0]} center>
        <div className="text-[10px] font-bold text-yellow-400 bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap">
          {state.polarizationAngle}°
        </div>
      </Html>
    </group>
  )
}

// Polarizer Block - 偏振片，设计成圆形镜框样式
interface PolarizerBlockProps extends BlockComponentProps {
  state: BlockState
}

function PolarizerBlock({ position, state, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: PolarizerBlockProps) {
  const color = POLARIZATION_COLORS[state.polarizationAngle as keyof typeof POLARIZATION_COLORS] || 0x00aaff

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* 外框架 - 圆形金属边框 */}
      <mesh rotation={[Math.PI / 2, 0, rotationY]}>
        <torusGeometry args={[0.42, 0.08, 8, 32]} />
        <meshStandardMaterial color={0x3a3a5e} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 支架 */}
      <mesh position={[0, -0.4, 0]} rotation={[0, rotationY, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial color={0x2a2a4e} metalness={0.7} roughness={0.4} />
      </mesh>

      {/* 透明偏振片玻璃 */}
      <mesh
        rotation={[Math.PI / 2, 0, rotationY]}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.4}
          roughness={0.05}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 偏振格栅线 - 更细腻 */}
      <PolarizationGridLines angle={state.polarizationAngle} rotation={rotationY} />

      {/* 偏振方向箭头指示 */}
      <group rotation={[0, rotationY, 0]}>
        <Line
          points={[
            [Math.cos(state.polarizationAngle * Math.PI / 180) * -0.35, Math.sin(state.polarizationAngle * Math.PI / 180) * -0.35, 0.06],
            [Math.cos(state.polarizationAngle * Math.PI / 180) * 0.35, Math.sin(state.polarizationAngle * Math.PI / 180) * 0.35, 0.06]
          ]}
          color={color}
          lineWidth={3}
        />
      </group>

      {/* 角度标签 */}
      <Html position={[0, 0.6, 0]} center>
        <div className="text-[10px] font-bold bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap" style={{ color: `#${color.toString(16).padStart(6, '0')}` }}>
          偏振 {state.polarizationAngle}°
        </div>
      </Html>
    </group>
  )
}

// Rotator Block - 波片/旋转器，设计成晶体光学元件样式
interface RotatorBlockProps extends BlockComponentProps {
  state: BlockState
}

function RotatorBlock({ position, state, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: RotatorBlockProps) {
  const is90 = state.rotationAmount === 90
  const rotatorRef = useRef<THREE.Group>(null)

  // 缓慢旋转动画
  useFrame(({ clock }) => {
    if (rotatorRef.current) {
      rotatorRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  const primaryColor = is90 ? 0x9900ff : 0xff00ff
  const secondaryColor = is90 ? 0x6600cc : 0xcc00cc

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* 底座 */}
      <mesh position={[0, -0.38, 0]} rotation={[0, rotationY, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.12, 6]} />
        <meshStandardMaterial color={0x2a2a4e} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 晶体主体 - 六棱柱 */}
      <group ref={rotatorRef}>
        <mesh
          rotation={[0, rotationY, 0]}
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.55, 6]} />
          <meshStandardMaterial
            color={primaryColor}
            transparent
            opacity={0.65}
            roughness={0.1}
            metalness={0.5}
          />
        </mesh>

        {/* 内层晶体 */}
        <mesh rotation={[0, rotationY + Math.PI / 6, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.5, 6]} />
          <meshStandardMaterial
            color={secondaryColor}
            transparent
            opacity={0.4}
            roughness={0.05}
          />
        </mesh>

        {/* 旋转螺旋线 */}
        <SpiralDecoration rotation={rotationY} is90={is90} />
      </group>

      {/* 顶部装饰环 */}
      <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.36, 6]} />
        <meshStandardMaterial color={0x4a4a6e} metalness={0.7} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* 旋转角度标签 */}
      <Html position={[0, 0.55, 0]} center>
        <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
          is90 ? 'bg-purple-600/80 text-white' : 'bg-pink-500/80 text-white'
        }`}>
          旋转 {is90 ? '90°' : '45°'}
        </div>
      </Html>

      {/* 发光效果 */}
      <pointLight color={primaryColor} intensity={0.3} distance={2} />
    </group>
  )
}

// Splitter Block - 方解石分光晶体，设计成菱形晶体样式
function SplitterBlock({ position, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: BlockComponentProps) {
  const crystalRef = useRef<THREE.Group>(null)

  // 轻微闪烁动画
  useFrame(({ clock }) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = rotationY + Math.sin(clock.getElapsedTime() * 0.3) * 0.05
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* 底座 */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color={0x2a3a4e} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 晶体主体 */}
      <group ref={crystalRef}>
        {/* 外层菱形晶体 */}
        <mesh
          rotation={[0, rotationY, Math.PI / 8]}
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          castShadow
        >
          <octahedronGeometry args={[0.48]} />
          <meshStandardMaterial
            color={0x00ddee}
            transparent
            opacity={0.7}
            roughness={0.02}
            metalness={0.7}
          />
        </mesh>

        {/* 内层晶体核心 */}
        <mesh rotation={[0, rotationY + Math.PI / 4, Math.PI / 8]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial
            color={0xffffff}
            transparent
            opacity={0.35}
            roughness={0.0}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* 分光方向指示 - o光（红色，向上偏折） */}
      <group rotation={[0, rotationY, 0]}>
        <Line
          points={[[0.1, 0.05, 0], [0.55, 0.25, 0]]}
          color={0xff4444}
          lineWidth={3}
        />
        <mesh position={[0.55, 0.25, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={0xff4444} />
        </mesh>
      </group>

      {/* 分光方向指示 - e光（绿色，向下偏折） */}
      <group rotation={[0, rotationY, 0]}>
        <Line
          points={[[0.1, -0.05, 0], [0.55, -0.25, 0]]}
          color={0x44ff44}
          lineWidth={3}
        />
        <mesh position={[0.55, -0.25, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={0x44ff44} />
        </mesh>
      </group>

      {/* 边缘发光 */}
      <lineSegments rotation={[0, rotationY, Math.PI / 8]}>
        <edgesGeometry args={[new THREE.OctahedronGeometry(0.48)]} />
        <lineBasicMaterial color={0x00ffff} transparent opacity={0.9} />
      </lineSegments>

      {/* 标签 */}
      <Html position={[0, 0.65, 0]} center>
        <div className="text-[10px] font-bold text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap">
          分光晶体
        </div>
      </Html>

      {/* 发光效果 */}
      <pointLight color={0x00ffff} intensity={0.4} distance={2.5} />
    </group>
  )
}

// Sensor Block - 光电探测器，设计成专业探测仪器样式
interface SensorBlockProps extends BlockComponentProps {
  state: BlockState
}

function SensorBlock({ position, state, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: SensorBlockProps) {
  const activated = state.activated
  const pulseRef = useRef<THREE.Mesh>(null)

  // 激活时的脉冲动画
  useFrame(({ clock }) => {
    if (pulseRef.current && activated) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 5) * 0.15
      pulseRef.current.scale.setScalar(scale)
    }
  })

  const baseColor = activated ? 0x00dd44 : 0x334455
  const lensColor = activated ? 0x44ff88 : 0x556677

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* 底座壳体 */}
      <mesh
        rotation={[0, rotationY, 0]}
        castShadow
        receiveShadow
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[0.75, 0.75, 0.5]} />
        <meshStandardMaterial
          color={0x2a2a3e}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* 探测器前面板 */}
      <mesh position={[0, 0, 0.26]} rotation={[0, rotationY, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.03]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={activated ? 0x00ff00 : 0x000000}
          emissiveIntensity={activated ? 0.5 : 0}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* 传感器镜头外圈 */}
      <mesh position={[0, 0, 0.28]} rotation={[0, rotationY, 0]}>
        <ringGeometry args={[0.22, 0.3, 32]} />
        <meshStandardMaterial color={0x4a4a6e} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 传感器镜头 */}
      <mesh ref={pulseRef} position={[0, 0, 0.29]} rotation={[0, rotationY, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial
          color={lensColor}
          emissive={activated ? 0x00ff44 : 0x000000}
          emissiveIntensity={activated ? 1.5 : 0}
          transparent
          opacity={0.85}
          roughness={0.1}
        />
      </mesh>

      {/* 状态指示灯 */}
      <mesh position={[0.28, 0.28, 0.26]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={activated ? 0x00ff00 : 0xff4444}
          emissive={activated ? 0x00ff00 : 0xff4444}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 需求强度标签 */}
      <Html position={[0, 0.55, 0]} center>
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
          activated ? 'bg-green-600/80 text-white' : 'bg-slate-700/80 text-gray-300'
        }`}>
          {activated ? '✓ 已激活' : `需要 ≥${state.requiredIntensity}`}
        </div>
      </Html>

      {/* 偏振需求标签 */}
      <Html position={[0, -0.55, 0]} center>
        <div className="text-[9px] bg-black/60 px-1 py-0.5 rounded text-gray-400">
          偏振 {state.polarizationAngle}°
        </div>
      </Html>

      {/* 激活时的发光效果 */}
      {activated && (
        <>
          <pointLight color={0x00ff00} intensity={0.8} distance={4} />
          <mesh position={[0, 0, 0.3]}>
            <ringGeometry args={[0.25, 0.4, 32]} />
            <meshBasicMaterial color={0x00ff44} transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
    </group>
  )
}

// Mirror Block - 反射镜，设计成光学平面镜样式
function MirrorBlock({ position, rotationY, onPointerDown, onPointerEnter, onPointerLeave }: BlockComponentProps) {
  return (
    <group position={[position.x, position.y, position.z]}>
      {/* 支架底座 */}
      <mesh position={[0, -0.4, 0]} rotation={[0, rotationY, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.1, 8]} />
        <meshStandardMaterial color={0x2a2a3e} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 支架立柱 */}
      <mesh position={[-0.3, -0.1, 0]} rotation={[0, rotationY, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color={0x3a3a4e} metalness={0.7} roughness={0.4} />
      </mesh>

      {/* 镜面框架 */}
      <mesh rotation={[0, rotationY, 0]}>
        <boxGeometry args={[0.12, 0.7, 0.7]} />
        <meshStandardMaterial color={0x2a2a3e} roughness={0.7} metalness={0.5} />
      </mesh>

      {/* 镜面 - 高反射率 */}
      <mesh
        position={[0.04, 0, 0]}
        rotation={[0, rotationY, 0]}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <boxGeometry args={[0.02, 0.6, 0.6]} />
        <meshStandardMaterial
          color={0xeeeeee}
          roughness={0.01}
          metalness={0.99}
          envMapIntensity={2}
        />
      </mesh>

      {/* 镜面边框装饰 */}
      <mesh position={[0.05, 0, 0]} rotation={[0, rotationY, 0]}>
        <ringGeometry args={[0.28, 0.32, 4]} />
        <meshStandardMaterial color={0x5a5a7e} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 反射方向指示 */}
      <group rotation={[0, rotationY, 0]}>
        {/* 入射光示意 */}
        <Line
          points={[[-0.4, 0.2, 0.3], [0, 0, 0]]}
          color={0xffaa00}
          lineWidth={2}
          dashed
          dashSize={0.05}
          gapSize={0.03}
        />
        {/* 反射光示意 */}
        <Line
          points={[[0, 0, 0], [0.4, 0.2, 0.3]]}
          color={0x88ccff}
          lineWidth={2}
        />
        <mesh position={[0.4, 0.2, 0.3]}>
          <coneGeometry args={[0.04, 0.1, 8]} />
          <meshBasicMaterial color={0x88ccff} />
        </mesh>
      </group>

      {/* 标签 */}
      <Html position={[0, 0.55, 0]} center>
        <div className="text-[10px] font-bold text-gray-300 bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap">
          反射镜
        </div>
      </Html>

      {/* 边缘高光 */}
      <lineSegments rotation={[0, rotationY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.12, 0.7, 0.7)]} />
        <lineBasicMaterial color={0x6a6a8e} transparent opacity={0.6} />
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
