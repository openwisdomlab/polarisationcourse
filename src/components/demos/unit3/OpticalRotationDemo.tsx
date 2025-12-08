/**
 * 旋光性演示 - Unit 3
 * 演示糖溶液等手性物质对偏振面的旋转
 */
import { useState, useRef, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup, InfoPanel, Formula } from '../DemoControls'
import { Demo2DCanvas } from '../Demo2DCanvas'

// 旋光率数据 (deg/(dm·g/mL))
const SPECIFIC_ROTATIONS: Record<string, number> = {
  sucrose: 66.5, // 蔗糖
  glucose: 52.7, // 葡萄糖
  fructose: -92, // 果糖（左旋）
  quartz: 21.7, // 石英 (deg/mm)
}

// 计算旋光角度
function calculateRotation(specificRotation: number, concentration: number, pathLength: number): number {
  // α = [α] × c × l
  return specificRotation * concentration * pathLength
}

// 旋光样品管组件
function SampleTube({
  position,
  length,
  concentration,
}: {
  position: [number, number, number]
  length: number
  concentration: number
  substance: string
}) {
  // 颜色基于浓度
  const tubeColor = new THREE.Color().setHSL(0.55, 0.6, 0.3 + concentration * 0.2)

  return (
    <group position={position}>
      {/* 管壁 */}
      <Cylinder args={[0.8, 0.8, length * 2, 32, 1, true]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#67e8f9" transparent opacity={0.2} side={THREE.DoubleSide} />
      </Cylinder>
      {/* 溶液 */}
      <Cylinder args={[0.75, 0.75, length * 2 - 0.1, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={tubeColor} transparent opacity={0.4} />
      </Cylinder>
      {/* 端盖 */}
      <mesh position={[-length, 0, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color="#475569" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[length, 0, 0]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color="#475569" side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="#94a3b8">
        样品管 (L={length.toFixed(1)} dm)
      </Text>
    </group>
  )
}

// 偏振面旋转可视化
function PolarizationRotation({
  start,
  end,
  inputAngle,
  outputAngle,
}: {
  start: [number, number, number]
  end: [number, number, number]
  inputAngle: number
  outputAngle: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // 沿路径显示偏振面旋转
  const segments = 20
  const positions: [number, number, number][] = []
  const angles: number[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    positions.push([
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t,
    ])
    // 线性插值角度
    angles.push(inputAngle + (outputAngle - inputAngle) * t)
  }

  useFrame((_, delta) => {
    timeRef.current += delta
  })

  // 根据旋转方向选择颜色
  const isRightRotation = outputAngle > inputAngle
  const baseColor = isRightRotation ? '#22d3ee' : '#f472b6'

  return (
    <group ref={groupRef}>
      {/* 光束中心线 */}
      <Line points={[start, end]} color="#fbbf24" lineWidth={2} transparent opacity={0.5} />
      {/* 沿路径的偏振指示器 */}
      {positions.map((pos, i) => {
        if (i % 3 !== 0) return null // 每3个显示一个
        const angle = angles[i]
        const t = i / segments
        const color = new THREE.Color(baseColor).lerp(new THREE.Color('#fbbf24'), 1 - t)
        return (
          <group key={i} position={pos}>
            <Line
              points={[
                [0, -0.4, 0],
                [0, 0.4, 0],
              ]}
              color={color}
              lineWidth={2}
              rotation={[0, 0, (angle * Math.PI) / 180]}
            />
          </group>
        )
      })}
    </group>
  )
}

// 偏振片组件
function Polarizer({
  position,
  angle,
  label,
  color = '#22d3ee',
}: {
  position: [number, number, number]
  angle: number
  label: string
  color?: string
}) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* 透光轴 */}
      <Line
        points={[
          [0, -0.8, 0],
          [0, 0.8, 0],
        ]}
        color={color}
        lineWidth={3}
        rotation={[0, 0, (angle * Math.PI) / 180]}
      />
      <Text position={[0, -1.2, 0]} fontSize={0.18} color="#94a3b8">
        {label}
      </Text>
    </group>
  )
}

// 观察屏
function Screen({
  position,
  intensity,
}: {
  position: [number, number, number]
  intensity: number
}) {
  const brightness = Math.max(0.05, intensity)
  const color = new THREE.Color().setHSL(0.15, 0.8, brightness * 0.5)

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Text position={[0, -1.2, 0]} fontSize={0.18} color="#94a3b8">
        屏幕 ({(intensity * 100).toFixed(0)}%)
      </Text>
    </group>
  )
}

// 3D场景
function OpticalRotationScene({
  substance,
  concentration,
  pathLength,
  analyzerAngle,
}: {
  substance: string
  concentration: number
  pathLength: number
  analyzerAngle: number
}) {
  const specificRotation = SPECIFIC_ROTATIONS[substance] || 66.5
  const rotationAngle = calculateRotation(specificRotation, concentration, pathLength)
  const polarizerAngle = 0

  // 输出偏振角
  const outputPolarization = polarizerAngle + rotationAngle

  // 通过检偏器的强度（马吕斯定律）
  const angleDiff = Math.abs(outputPolarization - analyzerAngle)
  const intensity = Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 光源 */}
      <group position={[-5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        <pointLight color="#fbbf24" intensity={0.8} distance={3} />
        <Text position={[0, -0.8, 0]} fontSize={0.18} color="#94a3b8">
          单色光源
        </Text>
      </group>

      {/* 起偏器 */}
      <Polarizer position={[-3.5, 0, 0]} angle={polarizerAngle} label={`起偏器 (${polarizerAngle}°)`} />

      {/* 入射偏振光 */}
      <Line
        points={[
          [-4.5, 0, 0],
          [-3.8, 0, 0],
        ]}
        color="#fbbf24"
        lineWidth={3}
      />
      <Line
        points={[
          [-3.2, 0, 0],
          [-pathLength - 0.5, 0, 0],
        ]}
        color="#fbbf24"
        lineWidth={3}
      />

      {/* 样品管 */}
      <SampleTube
        position={[0, 0, 0]}
        length={pathLength}
        concentration={concentration}
        substance={substance}
      />

      {/* 偏振面旋转可视化 */}
      <PolarizationRotation
        start={[-pathLength + 0.1, 0, 0]}
        end={[pathLength - 0.1, 0, 0]}
        inputAngle={polarizerAngle}
        outputAngle={outputPolarization}
      />

      {/* 出射光 */}
      <Line
        points={[
          [pathLength + 0.5, 0, 0],
          [3.2, 0, 0],
        ]}
        color={rotationAngle >= 0 ? '#22d3ee' : '#f472b6'}
        lineWidth={3}
      />

      {/* 检偏器 */}
      <Polarizer
        position={[3.5, 0, 0]}
        angle={analyzerAngle}
        label={`检偏器 (${analyzerAngle}°)`}
        color="#a78bfa"
      />

      {/* 出射到屏幕 */}
      <Line
        points={[
          [3.8, 0, 0],
          [5, 0, 0],
        ]}
        color="#a78bfa"
        lineWidth={Math.max(1, 3 * intensity)}
        transparent
        opacity={Math.max(0.3, intensity)}
      />

      {/* 屏幕 */}
      <Screen position={[5.5, 0, 0]} intensity={intensity} />

      {/* 旋转角度标注 */}
      <Text position={[0, 2, 0]} fontSize={0.25} color={rotationAngle >= 0 ? '#22d3ee' : '#f472b6'}>
        旋转角: {rotationAngle.toFixed(1)}° ({rotationAngle >= 0 ? '右旋' : '左旋'})
      </Text>

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 浓度-旋光角图表
function RotationChart({
  substance,
  pathLength,
  currentConcentration,
}: {
  substance: string
  pathLength: number
  currentConcentration: number
}) {
  const specificRotation = SPECIFIC_ROTATIONS[substance] || 66.5

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, width, height)

      const margin = { left: 50, right: 20, top: 20, bottom: 40 }
      const chartWidth = width - margin.left - margin.right
      const chartHeight = height - margin.top - margin.bottom

      // 坐标轴
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(margin.left, margin.top)
      ctx.lineTo(margin.left, height - margin.bottom)
      ctx.lineTo(width - margin.right, height - margin.bottom)
      ctx.stroke()

      // 标签
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.fillText('0', margin.left - 10, height - margin.bottom + 15)
      ctx.fillText('0.5', margin.left + chartWidth / 2 - 10, height - margin.bottom + 15)
      ctx.fillText('1.0 g/mL', width - margin.right - 30, height - margin.bottom + 15)

      const maxRotation = Math.abs(specificRotation * 1.0 * pathLength)
      ctx.fillText('0°', margin.left - 20, height - margin.bottom - 5)
      ctx.fillText(`${maxRotation.toFixed(0)}°`, margin.left - 30, margin.top + 5)
      ctx.fillText('α', margin.left - 15, margin.top - 5)
      ctx.fillText('c', width - margin.right + 5, height - margin.bottom + 5)

      // 绘制线性关系
      ctx.strokeStyle = specificRotation >= 0 ? '#22d3ee' : '#f472b6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(margin.left, height - margin.bottom)
      ctx.lineTo(
        width - margin.right,
        margin.top + chartHeight * (1 - Math.abs(specificRotation * 1.0 * pathLength) / maxRotation)
      )
      ctx.stroke()

      // 当前点
      const currentRotation = Math.abs(calculateRotation(specificRotation, currentConcentration, pathLength))
      const currentX = margin.left + currentConcentration * chartWidth
      const currentY = height - margin.bottom - (currentRotation / maxRotation) * chartHeight

      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI)
      ctx.fill()
    },
    [substance, pathLength, currentConcentration]
  )

  return <Demo2DCanvas width={300} height={160} draw={draw} />
}

// 主演示组件
export function OpticalRotationDemo() {
  const [substance, setSubstance] = useState('sucrose')
  const [concentration, setConcentration] = useState(0.3)
  const [pathLength, setPathLength] = useState(1.0)
  const [analyzerAngle, setAnalyzerAngle] = useState(0)

  const specificRotation = SPECIFIC_ROTATIONS[substance] || 66.5
  const rotationAngle = calculateRotation(specificRotation, concentration, pathLength)
  const outputPolarization = rotationAngle

  // 透过强度
  const angleDiff = Math.abs(outputPolarization - analyzerAngle)
  const intensity = Math.pow(Math.cos((angleDiff * Math.PI) / 180), 2)

  // 物质选项
  const substances = [
    { value: 'sucrose', label: '蔗糖 (右旋)' },
    { value: 'glucose', label: '葡萄糖 (右旋)' },
    { value: 'fructose', label: '果糖 (左旋)' },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 5, 12], fov: 45 }}
          gl={{ antialias: true }}
        >
          <OpticalRotationScene
            substance={substance}
            concentration={concentration}
            pathLength={pathLength}
            analyzerAngle={analyzerAngle}
          />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="物质选择">
          <ButtonGroup
            label=""
            options={substances}
            value={substance}
            onChange={(v) => setSubstance(v as string)}
          />
          <ValueDisplay
            label="比旋光度 [α]"
            value={specificRotation.toFixed(1)}
            unit="°/(dm·g/mL)"
            color={specificRotation >= 0 ? 'cyan' : 'purple'}
          />
        </ControlPanel>

        <ControlPanel title="实验参数">
          <SliderControl
            label="溶液浓度 c"
            value={concentration}
            min={0.05}
            max={1.0}
            step={0.05}
            unit=" g/mL"
            onChange={setConcentration}
          />
          <SliderControl
            label="光程长度 L"
            value={pathLength}
            min={0.5}
            max={2.0}
            step={0.1}
            unit=" dm"
            onChange={setPathLength}
          />
          <SliderControl
            label="检偏器角度"
            value={analyzerAngle}
            min={-90}
            max={90}
            step={1}
            unit="°"
            onChange={setAnalyzerAngle}
          />
          <button
            onClick={() => setAnalyzerAngle(Math.round(rotationAngle))}
            className="w-full py-2 bg-cyan-400/20 text-cyan-400 rounded-lg hover:bg-cyan-400/30"
          >
            对准消光位置
          </button>
        </ControlPanel>

        <ControlPanel title="测量结果">
          <ValueDisplay
            label="旋光角度 α"
            value={rotationAngle.toFixed(1)}
            unit="°"
            color={rotationAngle >= 0 ? 'cyan' : 'purple'}
          />
          <ValueDisplay
            label="旋光方向"
            value={rotationAngle >= 0 ? '右旋 (d)' : '左旋 (l)'}
            color={rotationAngle >= 0 ? 'cyan' : 'purple'}
          />
          <ValueDisplay label="透过强度" value={(intensity * 100).toFixed(0)} unit="%" />
          <Formula>α = [α] × c × L</Formula>
        </ControlPanel>

        <ControlPanel title="浓度-旋光角关系">
          <RotationChart
            substance={substance}
            pathLength={pathLength}
            currentConcentration={concentration}
          />
        </ControlPanel>

        <InfoPanel title="旋光现象">
          <div className="space-y-1 text-xs">
            <p>旋光性源于分子手性结构</p>
            <p className="text-cyan-400">• 右旋 (d/+): 顺时针旋转</p>
            <p className="text-purple-400">• 左旋 (l/-): 逆时针旋转</p>
            <p className="mt-2 text-gray-500">应用：糖度计、手性药物检测</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
