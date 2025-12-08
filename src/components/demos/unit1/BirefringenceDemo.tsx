/**
 * 双折射效应演示 - Unit 1
 * 使用React Three Fiber 3D可视化，可自由拖动旋转
 */
import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import {
  SliderControl,
  ControlPanel,
  ValueDisplay,
  InfoCard,
} from '../DemoControls'

// 光源组件
function LightSource({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 3) * 0.1)
    }
  })

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight color="#fbbf24" intensity={2} distance={5} />
      <Text position={[0, -0.6, 0]} fontSize={0.2} color="#94a3b8">
        偏振光源
      </Text>
    </group>
  )
}

// 方解石晶体组件
function CalciteCrystal({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: number
}) {
  const crystalRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = (rotation * Math.PI) / 180 + Math.sin(clock.getElapsedTime() * 0.5) * 0.03
    }
  })

  return (
    <group position={position}>
      <group ref={crystalRef}>
        {/* 外层晶体 */}
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1]} />
          <meshStandardMaterial
            color="#67e8f9"
            transparent
            opacity={0.4}
            roughness={0.1}
            metalness={0.5}
          />
        </mesh>
        {/* 内层晶格 */}
        <mesh rotation={[0, Math.PI / 6, 0]}>
          <boxGeometry args={[1.2, 1.2, 0.8]} />
          <meshStandardMaterial
            color="#a5f3fc"
            transparent
            opacity={0.25}
            roughness={0.05}
          />
        </mesh>
        {/* 光轴指示 */}
        <Line
          points={[[-0.8, -0.8, 0], [0.8, 0.8, 0]]}
          color="#fbbf24"
          lineWidth={2}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      </group>
      {/* 边框 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1)]} />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.8} />
      </lineSegments>
      <Text position={[0, -1.1, 0]} fontSize={0.18} color="#67e8f9">
        方解石晶体
      </Text>
      <Text position={[0, -1.35, 0]} fontSize={0.12} color="#94a3b8">
        no=1.6584 ne=1.4864
      </Text>
    </group>
  )
}

// 光束组件
function LightBeam({
  start,
  end,
  color,
  intensity,
  animate = true,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
  intensity: number
  animate?: boolean
}) {
  const beamRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // 计算方向和长度
  const direction = useMemo(() => {
    const dir = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2])
    return dir.normalize()
  }, [start, end])

  const length = useMemo(() => {
    return Math.sqrt(
      (end[0] - start[0]) ** 2 +
      (end[1] - start[1]) ** 2 +
      (end[2] - start[2]) ** 2
    )
  }, [start, end])

  // 粒子动画
  useFrame(({ clock }) => {
    if (particlesRef.current && animate) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const time = clock.getElapsedTime()

      for (let i = 0; i < 10; i++) {
        const progress = ((i / 10 + time * 0.5) % 1)
        positions[i * 3] = start[0] + direction.x * length * progress
        positions[i * 3 + 1] = start[1] + direction.y * length * progress
        positions[i * 3 + 2] = start[2] + direction.z * length * progress
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  if (intensity < 0.05) return null

  const particlePositions = new Float32Array(30)
  for (let i = 0; i < 10; i++) {
    const progress = i / 10
    particlePositions[i * 3] = start[0] + direction.x * length * progress
    particlePositions[i * 3 + 1] = start[1] + direction.y * length * progress
    particlePositions[i * 3 + 2] = start[2] + direction.z * length * progress
  }

  return (
    <group ref={beamRef}>
      {/* 主光束线 */}
      <Line
        points={[start, end]}
        color={color}
        lineWidth={2 + intensity * 3}
        transparent
        opacity={0.4 + intensity * 0.5}
      />
      {/* 动画粒子 */}
      {animate && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color={color}
            size={0.08}
            transparent
            opacity={0.8}
          />
        </points>
      )}
    </group>
  )
}

// 探测屏幕组件
function DetectorScreen({
  position,
  oIntensity,
  eIntensity,
}: {
  position: [number, number, number]
  oIntensity: number
  eIntensity: number
}) {
  return (
    <group position={position}>
      {/* 屏幕 */}
      <mesh>
        <boxGeometry args={[0.1, 2, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* o光光斑 */}
      <mesh position={[0.06, 0.5, 0]}>
        <circleGeometry args={[0.15 + oIntensity * 0.15, 32]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff4444"
          emissiveIntensity={oIntensity}
          transparent
          opacity={0.5 + oIntensity * 0.5}
        />
      </mesh>
      {/* e光光斑 */}
      <mesh position={[0.06, -0.5, 0]}>
        <circleGeometry args={[0.15 + eIntensity * 0.15, 32]} />
        <meshStandardMaterial
          color="#44ff44"
          emissive="#44ff44"
          emissiveIntensity={eIntensity}
          transparent
          opacity={0.5 + eIntensity * 0.5}
        />
      </mesh>
      {/* 标签 */}
      <Text position={[0.15, 0.5, 0]} fontSize={0.15} color="#ff4444">
        o光 (0°)
      </Text>
      <Text position={[0.15, -0.5, 0]} fontSize={0.15} color="#44ff44">
        e光 (90°)
      </Text>
      <Text position={[0, -1.3, 0]} fontSize={0.18} color="#94a3b8">
        探测屏
      </Text>
    </group>
  )
}

// 3D场景
function BirefringenceScene({
  inputPolarization,
  animate,
}: {
  inputPolarization: number
  animate: boolean
}) {
  const radians = (inputPolarization * Math.PI) / 180
  const oIntensity = Math.pow(Math.cos(radians), 2)
  const eIntensity = Math.pow(Math.sin(radians), 2)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4ade80" />

      {/* 光源 */}
      <LightSource position={[-4, 0, 0]} />

      {/* 入射光束 */}
      <LightBeam
        start={[-3.5, 0, 0]}
        end={[-1, 0, 0]}
        color="#ffaa00"
        intensity={1}
        animate={animate}
      />

      {/* 入射光偏振方向指示 */}
      <group position={[-2.5, 0, 0]} rotation={[0, 0, (inputPolarization * Math.PI) / 180]}>
        <Line
          points={[[0, -0.3, 0], [0, 0.3, 0]]}
          color="#ffaa00"
          lineWidth={3}
        />
        <mesh position={[0, 0.35, 0]}>
          <coneGeometry args={[0.08, 0.15, 8]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      </group>
      <Text position={[-2.5, -0.6, 0]} fontSize={0.12} color="#ffaa00">
        偏振: {inputPolarization}°
      </Text>

      {/* 方解石晶体 */}
      <CalciteCrystal position={[0, 0, 0]} rotation={45} />

      {/* o光出射 (向上偏折) */}
      <LightBeam
        start={[0.8, 0.2, 0]}
        end={[3.5, 0.5, 0]}
        color="#ff4444"
        intensity={oIntensity}
        animate={animate}
      />

      {/* e光出射 (向下偏折) */}
      <LightBeam
        start={[0.8, -0.2, 0]}
        end={[3.5, -0.5, 0]}
        color="#44ff44"
        intensity={eIntensity}
        animate={animate}
      />

      {/* 探测屏 */}
      <DetectorScreen position={[4, 0, 0]} oIntensity={oIntensity} eIntensity={eIntensity} />

      {/* 网格和坐标 */}
      <gridHelper args={[10, 10, '#1e3a5f', '#0f172a']} position={[0, -1.5, 0]} />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
      />
    </>
  )
}

// 预设按钮组件
function PresetButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
        isActive
          ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/50'
          : 'bg-slate-700/50 text-gray-400 border-slate-600/50 hover:border-slate-500'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  )
}

// 主演示组件
export function BirefringenceDemo() {
  const [inputPolarization, setInputPolarization] = useState(45)
  const [animate, setAnimate] = useState(true)

  const radians = (inputPolarization * Math.PI) / 180
  const oIntensity = Math.pow(Math.cos(radians), 2)
  const eIntensity = Math.pow(Math.sin(radians), 2)

  // 预设选项
  const presets = [
    { label: '0° (纯o光)', value: 0 },
    { label: '45° (等分)', value: 45 },
    { label: '90° (纯e光)', value: 90 },
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          双折射效应 - 3D交互
        </h2>
        <p className="text-gray-400 mt-1">
          方解石晶体将一束光分裂为偏振方向垂直的o光和e光 · 拖动旋转视角
        </p>
      </div>

      {/* 3D可视化面板 */}
      <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden" style={{ height: 400 }}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          gl={{ antialias: true, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
        >
          <BirefringenceScene inputPolarization={inputPolarization} animate={animate} />
        </Canvas>
      </div>

      {/* 控制和信息面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 参数控制 */}
        <ControlPanel title="参数控制">
          <SliderControl
            label="入射光偏振角度"
            value={inputPolarization}
            min={0}
            max={90}
            step={5}
            unit="°"
            onChange={setInputPolarization}
            color="orange"
          />
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <PresetButton
                key={preset.value}
                label={preset.label}
                isActive={inputPolarization === preset.value}
                onClick={() => setInputPolarization(preset.value)}
              />
            ))}
          </div>
          <motion.button
            onClick={() => setAnimate(!animate)}
            className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              animate
                ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                : 'bg-slate-700/50 text-gray-400 border border-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {animate ? '⏸ 暂停动画' : '▶ 播放动画'}
          </motion.button>
        </ControlPanel>

        {/* 分量强度 */}
        <ControlPanel title="分量强度">
          <ValueDisplay
            label="o光强度 (cos²θ)"
            value={(oIntensity * 100).toFixed(1)}
            unit="%"
            color="red"
          />
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              animate={{ width: `${oIntensity * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <ValueDisplay
            label="e光强度 (sin²θ)"
            value={(eIntensity * 100).toFixed(1)}
            unit="%"
            color="green"
          />
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              animate={{ width: `${eIntensity * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <ValueDisplay label="总强度守恒" value="100" unit="%" color="cyan" />
        </ControlPanel>

        {/* 晶体参数 */}
        <ControlPanel title="方解石参数">
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>o光折射率 (no):</span>
              <span className="text-cyan-400 font-mono">1.6584</span>
            </div>
            <div className="flex justify-between">
              <span>e光折射率 (ne):</span>
              <span className="text-cyan-400 font-mono">1.4864</span>
            </div>
            <div className="flex justify-between">
              <span>双折射率差 (Δn):</span>
              <span className="text-purple-400 font-mono">0.172</span>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-gray-500">
                方解石是典型的负单轴晶体，具有显著的双折射效应。
              </p>
            </div>
          </div>
        </ControlPanel>
      </div>

      {/* 现实应用场景 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="偏光显微镜" color="cyan">
          <p className="text-xs text-gray-300">
            利用双折射原理观察矿物和生物样本的微观结构，不同晶体取向显示不同干涉色。
          </p>
        </InfoCard>
        <InfoCard title="应力分析" color="purple">
          <p className="text-xs text-gray-300">
            透明材料受力时产生应力双折射，用于检测玻璃、塑料中的内应力分布。
          </p>
        </InfoCard>
        <InfoCard title="宝石鉴定" color="orange">
          <p className="text-xs text-gray-300">
            通过方解石观察宝石的双像效应，可以鉴别天然宝石与仿制品。
          </p>
        </InfoCard>
      </div>
    </div>
  )
}
