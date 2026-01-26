/**
 * 双折射效应演示 - Unit 1
 * 使用React Three Fiber 3D可视化，可自由拖动旋转
 */
import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  SliderControl,
  ControlPanel,
  ValueDisplay,
  InfoCard,
} from '../DemoControls'
import { ThicknessVisualizer, StressComparator } from '@/components/gallery'
import { FlaskConical, Box, Beaker } from 'lucide-react'
import { PolarizationPhysics } from '@/hooks/usePolarizationSimulation'

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
  opticalAxisAngle,
  no,
  ne,
}: {
  position: [number, number, number]
  rotation: number
  opticalAxisAngle: number
  no: number
  ne: number
}) {
  const crystalRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = (rotation * Math.PI) / 180 + Math.sin(clock.getElapsedTime() * 0.5) * 0.03
    }
  })

  // 计算光轴端点（基于光轴角度）
  const axisLength = 0.8
  const axisRadians = (opticalAxisAngle * Math.PI) / 180
  const axisPoints: [[number, number, number], [number, number, number]] = [
    [-axisLength * Math.cos(axisRadians), -axisLength * Math.sin(axisRadians), 0],
    [axisLength * Math.cos(axisRadians), axisLength * Math.sin(axisRadians), 0],
  ]

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
          points={axisPoints}
          color="#fbbf24"
          lineWidth={2}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
        {/* 光轴方向箭头 */}
        <group position={[axisLength * Math.cos(axisRadians), axisLength * Math.sin(axisRadians), 0]} rotation={[0, 0, axisRadians]}>
          <mesh>
            <coneGeometry args={[0.06, 0.12, 8]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
        {/* 光轴标签 */}
        <Text
          position={[axisLength * 0.6 * Math.cos(axisRadians) + 0.2, axisLength * 0.6 * Math.sin(axisRadians) + 0.15, 0]}
          fontSize={0.1}
          color="#fbbf24"
        >
          光轴
        </Text>
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
        no={no.toFixed(4)} ne={ne.toFixed(4)}
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
  oOffsetY = 0.5,
  eOffsetY = -0.5,
}: {
  position: [number, number, number]
  oIntensity: number
  eIntensity: number
  oOffsetY?: number
  eOffsetY?: number
}) {
  return (
    <group position={position}>
      {/* 屏幕 */}
      <mesh>
        <boxGeometry args={[0.1, 2, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* o光光斑 */}
      <mesh position={[0.06, oOffsetY, 0]}>
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
      <mesh position={[0.06, eOffsetY, 0]}>
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
      <Text position={[0.15, oOffsetY, 0]} fontSize={0.15} color="#ff4444">
        o光 (0°)
      </Text>
      <Text position={[0.15, eOffsetY, 0]} fontSize={0.15} color="#44ff44">
        e光 (90°)
      </Text>
      <Text position={[0, -1.3, 0]} fontSize={0.18} color="#94a3b8">
        探测屏
      </Text>
    </group>
  )
}

// 3D场景
/**
 * 双折射强度分配遵循马吕斯定律：
 * - θ为入射偏振方向与晶体光轴的夹角
 * - o光强度：I_o = I_0 × cos²θ （偏振方向垂直于主截面的分量）
 * - e光强度：I_e = I_0 × sin²θ （偏振方向在主截面内的分量）
 * - 能量守恒：I_o + I_e = I_0 × (cos²θ + sin²θ) = I_0
 *
 * 环境折射率影响：
 * - 光从环境介质进入晶体时，遵循斯涅尔定律
 * - 折射角取决于环境折射率与晶体折射率的比值
 *
 * 光轴方向影响：
 * - 光轴方向决定了o光和e光的分离方向
 * - 有效双折射率差与光轴角度相关
 */
function BirefringenceScene({
  inputPolarization,
  animate,
  crystalRotation,
  envRefractiveIndex,
  opticalAxisAngle,
  no,
  ne,
}: {
  inputPolarization: number
  animate: boolean
  crystalRotation: number
  envRefractiveIndex: number
  opticalAxisAngle: number
  no: number
  ne: number
}) {
  // 使用统一物理引擎计算双折射强度分配
  // o光强度 = cos²θ, e光强度 = sin²θ (θ为相对于光轴的有效偏振角)
  const { oIntensity, eIntensity } = PolarizationPhysics.birefringenceSplit(
    inputPolarization,
    opticalAxisAngle,
    1.0
  )

  // 计算折射导致的光束偏移（基于斯涅尔定律）
  // 双折射率差（有效值，取决于光轴角度）
  const birefringence = Math.abs(no - ne)
  // 环境折射率对光束分离的影响因子
  const separationFactor = birefringence / envRefractiveIndex

  // o光和e光的分离角度（基于光轴方向）
  const axisRad = (opticalAxisAngle * Math.PI) / 180
  const baseSeparation = 0.5 * (1 + separationFactor * 2)

  // o光向垂直于光轴方向偏折，e光沿光轴方向偏折
  const oOffsetY = baseSeparation * Math.cos(axisRad)
  const oOffsetZ = baseSeparation * Math.sin(axisRad) * 0.3
  const eOffsetY = -baseSeparation * Math.cos(axisRad)
  const eOffsetZ = -baseSeparation * Math.sin(axisRad) * 0.3

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
      <CalciteCrystal
        position={[0, 0, 0]}
        rotation={crystalRotation}
        opticalAxisAngle={opticalAxisAngle}
        no={no}
        ne={ne}
      />

      {/* o光出射 (偏折方向取决于光轴) */}
      <LightBeam
        start={[0.8, 0.2, 0]}
        end={[3.5, oOffsetY, oOffsetZ]}
        color="#ff4444"
        intensity={oIntensity}
        animate={animate}
      />

      {/* e光出射 (偏折方向取决于光轴) */}
      <LightBeam
        start={[0.8, -0.2, 0]}
        end={[3.5, eOffsetY, eOffsetZ]}
        color="#44ff44"
        intensity={eIntensity}
        animate={animate}
      />

      {/* 探测屏 */}
      <DetectorScreen
        position={[4, 0, 0]}
        oIntensity={oIntensity}
        eIntensity={eIntensity}
        oOffsetY={oOffsetY}
        eOffsetY={eOffsetY}
      />

      {/* 环境介质标识 */}
      <Text position={[-2.5, 1.2, 0]} fontSize={0.12} color="#94a3b8">
        环境: n={envRefractiveIndex.toFixed(2)}
      </Text>

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

// Tab component for switching views
type DemoTab = 'theory' | 'lab'

function TabButton({
  active,
  onClick,
  children,
  icon: Icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon: typeof FlaskConical
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
          : 'bg-slate-700/50 text-gray-400 border border-slate-600/50 hover:border-slate-500'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      {children}
    </motion.button>
  )
}

// 环境介质预设
const ENV_PRESETS = [
  { label: '空气', labelEn: 'Air', value: 1.0 },
  { label: '水', labelEn: 'Water', value: 1.33 },
  { label: '玻璃', labelEn: 'Glass', value: 1.5 },
  { label: '油浸', labelEn: 'Oil', value: 1.52 },
]

// 主演示组件
export function BirefringenceDemo() {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [activeTab, setActiveTab] = useState<DemoTab>('theory')
  const [inputPolarization, setInputPolarization] = useState(45)
  const [animate, setAnimate] = useState(true)

  // 新增控制参数
  const [crystalRotation, setCrystalRotation] = useState(0) // 晶体旋转角度
  const [envRefractiveIndex, setEnvRefractiveIndex] = useState(1.0) // 环境折射率
  const [opticalAxisAngle, setOpticalAxisAngle] = useState(0) // 光轴方向角度 (0°=水平)

  // 方解石折射率（标准值，可作为常量或可调参数）
  const no = 1.6584 // o光折射率
  const ne = 1.4864 // e光折射率

  // 使用统一物理引擎计算双折射强度分配
  const { oIntensity, eIntensity } = PolarizationPhysics.birefringenceSplit(
    inputPolarization,
    opticalAxisAngle,
    1.0
  )

  // 计算双折射率差和光束分离
  const birefringence = Math.abs(no - ne)
  const separationFactor = birefringence / envRefractiveIndex

  // 预设选项 (基于光轴=0°水平方向)
  // o光振动垂直于光轴，e光振动平行于光轴
  const presets = [
    { label: '0° (纯e光)', value: 0 },   // 平行于光轴 → 全部e光
    { label: '45° (等分)', value: 45 },  // 45°分量 → 50/50
    { label: '90° (纯o光)', value: 90 }, // 垂直于光轴 → 全部o光
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          {isZh ? '双折射效应 - 3D交互' : 'Birefringence - 3D Interactive'}
        </h2>
        <p className="text-gray-400 mt-1">
          {isZh
            ? '方解石晶体将一束光分裂为偏振方向垂直的o光和e光 · 拖动旋转视角'
            : 'Calcite crystal splits light into o-ray and e-ray with perpendicular polarizations'}
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex justify-center gap-2">
        <TabButton
          active={activeTab === 'theory'}
          onClick={() => setActiveTab('theory')}
          icon={Box}
        >
          {isZh ? '理论演示' : 'Theory Demo'}
        </TabButton>
        <TabButton
          active={activeTab === 'lab'}
          onClick={() => setActiveTab('lab')}
          icon={FlaskConical}
        >
          {isZh ? '真实实验室' : 'Real World Lab'}
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'theory' ? (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* 3D可视化面板 */}
            <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden" style={{ height: 400 }}>
              <Canvas
                camera={{ position: [0, 2, 8], fov: 50 }}
                gl={{ antialias: true, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
              >
                <BirefringenceScene
                  inputPolarization={inputPolarization}
                  animate={animate}
                  crystalRotation={crystalRotation}
                  envRefractiveIndex={envRefractiveIndex}
                  opticalAxisAngle={opticalAxisAngle}
                  no={no}
                  ne={ne}
                />
              </Canvas>
            </div>

            {/* 控制和信息面板 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 入射光参数 */}
              <ControlPanel title={isZh ? "入射光参数" : "Input Light"}>
                <SliderControl
                  label={isZh ? "偏振角度" : "Polarization"}
                  value={inputPolarization}
                  min={0}
                  max={180}
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
                  {animate ? (isZh ? '⏸ 暂停动画' : '⏸ Pause') : (isZh ? '▶ 播放动画' : '▶ Play')}
                </motion.button>
              </ControlPanel>

              {/* 晶体控制 */}
              <ControlPanel title={isZh ? "晶体控制" : "Crystal Control"}>
                <SliderControl
                  label={isZh ? "晶体旋转" : "Crystal Rotation"}
                  value={crystalRotation}
                  min={-180}
                  max={180}
                  step={5}
                  unit="°"
                  onChange={setCrystalRotation}
                  color="cyan"
                />
                <SliderControl
                  label={isZh ? "光轴方向" : "Optical Axis"}
                  value={opticalAxisAngle}
                  min={0}
                  max={90}
                  step={5}
                  unit="°"
                  onChange={setOpticalAxisAngle}
                  color="orange"
                />
                <div className="text-xs text-gray-400 mt-1">
                  <span>{isZh ? '有效偏振角 (θ): ' : 'Effective θ: '}</span>
                  <span className="text-yellow-400 font-mono">
                    {((inputPolarization - opticalAxisAngle + 180) % 180).toFixed(0)}°
                  </span>
                </div>
              </ControlPanel>

              {/* 环境介质 */}
              <ControlPanel title={isZh ? "环境介质" : "Environment"}>
                <SliderControl
                  label={isZh ? "折射率 n" : "Refractive Index n"}
                  value={envRefractiveIndex}
                  min={1.0}
                  max={2.0}
                  step={0.01}
                  unit=""
                  onChange={setEnvRefractiveIndex}
                  color="purple"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {ENV_PRESETS.map((preset) => (
                    <PresetButton
                      key={preset.value}
                      label={isZh ? preset.label : preset.labelEn}
                      isActive={Math.abs(envRefractiveIndex - preset.value) < 0.01}
                      onClick={() => setEnvRefractiveIndex(preset.value)}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>{isZh ? '光束分离因子:' : 'Separation:'}</span>
                    <span className="text-purple-400 font-mono">{separationFactor.toFixed(3)}</span>
                  </div>
                </div>
              </ControlPanel>

              {/* 分量强度 */}
              <ControlPanel title={isZh ? "分量强度" : "Intensity"}>
                <ValueDisplay
                  label={isZh ? "o光强度 (cos²θ)" : "o-ray (cos²θ)"}
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
                  label={isZh ? "e光强度 (sin²θ)" : "e-ray (sin²θ)"}
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
                <ValueDisplay label={isZh ? "总强度守恒" : "Total (conserved)"} value="100" unit="%" color="cyan" />
              </ControlPanel>
            </div>

            {/* 晶体参数信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlPanel title={isZh ? "方解石参数" : "Calcite Properties"}>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{isZh ? 'o光折射率' : 'o-ray index'} (no):</span>
                      <span className="text-cyan-400 font-mono">{no.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isZh ? 'e光折射率' : 'e-ray index'} (ne):</span>
                      <span className="text-cyan-400 font-mono">{ne.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isZh ? '双折射率差' : 'Birefringence'} (Δn):</span>
                      <span className="text-purple-400 font-mono">{birefringence.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{isZh ? '晶体类型:' : 'Crystal Type:'}</span>
                      <span className="text-yellow-400">{isZh ? '负单轴' : 'Negative Uniaxial'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isZh ? '光轴角度:' : 'Axis Angle:'}</span>
                      <span className="text-yellow-400 font-mono">{opticalAxisAngle}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isZh ? '晶体旋转:' : 'Rotation:'}</span>
                      <span className="text-cyan-400 font-mono">{crystalRotation}°</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-700 text-xs text-gray-500">
                  {isZh
                    ? '方解石是典型的负单轴晶体 (ne < no)，具有显著的双折射效应。调整光轴方向可观察光束分离的变化。'
                    : 'Calcite is a typical negative uniaxial crystal (ne < no) with significant birefringence. Adjust the optical axis to observe beam separation changes.'}
                </div>
              </ControlPanel>

              <ControlPanel title={isZh ? "物理说明" : "Physics Notes"}>
                <div className="text-xs text-gray-400 space-y-2">
                  <p>
                    {isZh
                      ? '• o光（寻常光）：偏振方向垂直于主截面，遵循普通折射定律'
                      : '• o-ray (ordinary): Polarization perpendicular to principal section, follows normal refraction'}
                  </p>
                  <p>
                    {isZh
                      ? '• e光（非寻常光）：偏振方向在主截面内，折射率随方向变化'
                      : '• e-ray (extraordinary): Polarization in principal section, index varies with direction'}
                  </p>
                  <p>
                    {isZh
                      ? '• 环境折射率影响界面折射角，从而影响光束分离程度'
                      : '• Environment index affects interface refraction, thus beam separation'}
                  </p>
                  <p>
                    {isZh
                      ? '• 光轴方向决定了o光和e光的分离方向'
                      : '• Optical axis direction determines o/e ray separation direction'}
                  </p>
                </div>
              </ControlPanel>
            </div>

            {/* 现实应用场景 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title={isZh ? "偏光显微镜" : "Polarization Microscopy"} color="cyan">
                <p className="text-xs text-gray-300">
                  {isZh
                    ? '利用双折射原理观察矿物和生物样本的微观结构，不同晶体取向显示不同干涉色。'
                    : 'Uses birefringence to observe minerals and biological samples, showing interference colors based on crystal orientation.'}
                </p>
              </InfoCard>
              <InfoCard title={isZh ? "应力分析" : "Stress Analysis"} color="purple">
                <p className="text-xs text-gray-300">
                  {isZh
                    ? '透明材料受力时产生应力双折射，用于检测玻璃、塑料中的内应力分布。'
                    : 'Stressed transparent materials become birefringent, used to detect internal stress in glass and plastics.'}
                </p>
              </InfoCard>
              <InfoCard title={isZh ? "宝石鉴定" : "Gem Identification"} color="orange">
                <p className="text-xs text-gray-300">
                  {isZh
                    ? '通过方解石观察宝石的双像效应，可以鉴别天然宝石与仿制品。'
                    : 'Observe double image effect through calcite to distinguish natural gems from imitations.'}
                </p>
              </InfoCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="lab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Real World Lab content */}
            <div className="bg-slate-900/50 rounded-xl border border-emerald-400/20 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">
                  {isZh ? '厚度与干涉色实验' : 'Thickness & Interference Color Experiment'}
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {isZh
                  ? '在正交偏振系统中，双折射材料的厚度直接影响观察到的干涉色。增加保鲜膜层数，观察颜色如何变化！'
                  : 'In crossed polarizers, the thickness of birefringent materials directly affects the observed interference colors. Add layers of plastic wrap and observe the color changes!'}
              </p>
              <ThicknessVisualizer showTheoryBar={true} showVideoButton={true} />
            </div>

            {/* Stress comparison */}
            <div className="bg-slate-900/50 rounded-xl border border-purple-400/20 p-4">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  {isZh ? '玻璃应力对比' : 'Glass Stress Comparison'}
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {isZh
                  ? '钢化玻璃经过热处理产生预应力，在正交偏振下显示特征图案。拖动滑块对比钢化玻璃和普通玻璃的差异！'
                  : 'Tempered glass has pre-stress from heat treatment, showing characteristic patterns under crossed polarizers. Drag the slider to compare tempered and ordinary glass!'}
              </p>
              <StressComparator />
            </div>

            {/* Tips card */}
            <InfoCard title={isZh ? "实验提示" : "Experiment Tips"} color="green">
              <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                <li>{isZh ? '保鲜膜、透明胶带等塑料薄膜都具有双折射性' : 'Plastic wrap, clear tape and other thin films are birefringent'}</li>
                <li>{isZh ? '颜色随厚度周期变化，形成Michel-Lévy色阶' : 'Colors change periodically with thickness, forming the Michel-Lévy scale'}</li>
                <li>{isZh ? '旋转样品或偏振片可以看到颜色变化' : 'Rotate the sample or polarizer to see color changes'}</li>
                <li>{isZh ? '应力大小与颜色数量成正比' : 'Stress magnitude is proportional to the number of colors'}</li>
              </ul>
            </InfoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
