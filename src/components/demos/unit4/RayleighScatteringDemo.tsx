/**
 * 瑞利散射演示 - Unit 4
 * 演示粒径远小于波长时的散射特性（蓝天效应）
 */
import { useState, useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup, InfoPanel, Formula } from '../DemoControls'
import { Demo2DCanvas } from '../Demo2DCanvas'

// 瑞利散射强度 (与λ^-4成正比)
function rayleighIntensity(wavelength: number): number {
  // 归一化到550nm
  const normalized = Math.pow(550 / wavelength, 4)
  return Math.min(normalized, 10)
}

// 瑞利散射相函数
function rayleighPhaseFunction(theta: number): number {
  // I ∝ (1 + cos²θ)
  return (3 / 16 / Math.PI) * (1 + Math.pow(Math.cos(theta), 2))
}

// 偏振度
function rayleighPolarization(theta: number): number {
  // 偏振度 = sin²θ / (1 + cos²θ)
  const sinSq = Math.pow(Math.sin(theta), 2)
  const cosSq = Math.pow(Math.cos(theta), 2)
  return sinSq / (1 + cosSq)
}

// 波长到RGB
function wavelengthToRGB(wavelength: number): [number, number, number] {
  let R = 0, G = 0, B = 0

  if (wavelength >= 380 && wavelength < 440) {
    R = -(wavelength - 440) / (440 - 380)
    B = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    G = (wavelength - 440) / (490 - 440)
    B = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    G = 1
    B = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    R = (wavelength - 510) / (580 - 510)
    G = 1
  } else if (wavelength >= 580 && wavelength < 645) {
    R = 1
    G = -(wavelength - 645) / (645 - 580)
  } else if (wavelength >= 645 && wavelength <= 780) {
    R = 1
  }

  return [R, G, B]
}

// 大气分子散射可视化 - 使用简单的球体表示
function AtmosphereScattering() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // 生成散射粒子位置
  const particles = useMemo(() => {
    const count = 50
    const result: { position: [number, number, number]; color: string }[] = []

    // 颜色基于散射（蓝色较强）
    const scatterBlue = rayleighIntensity(450)
    const scatterGreen = rayleighIntensity(550)
    const scatterRed = rayleighIntensity(650)
    const total = scatterBlue + scatterGreen + scatterRed

    const r = scatterRed / total
    const g = scatterGreen / total
    const b = scatterBlue / total
    const color = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`

    for (let i = 0; i < count; i++) {
      // 随机分布在半球形区域
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.random() * Math.PI / 2
      const radius = 3 + Math.random() * 4

      result.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        ],
        color,
      })
    }

    return result
  }, [])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y = timeRef.current * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <Sphere key={i} args={[0.05, 8, 8]} position={p.position}>
          <meshBasicMaterial color={p.color} transparent opacity={0.6} />
        </Sphere>
      ))}
    </group>
  )
}

// 散射光线可视化
function ScatteredRays({
  sunAngle,
  observerAngle,
}: {
  sunAngle: number
  observerAngle: number
}) {
  const sunRad = (sunAngle * Math.PI) / 180
  const obsRad = (observerAngle * Math.PI) / 180

  // 太阳光方向
  const sunDir: [number, number, number] = [
    -Math.cos(sunRad),
    Math.sin(sunRad),
    0,
  ]

  // 观察方向
  const obsDir: [number, number, number] = [
    Math.cos(obsRad),
    Math.sin(obsRad),
    0,
  ]

  // 散射角
  const scatterAngle = Math.acos(
    sunDir[0] * obsDir[0] + sunDir[1] * obsDir[1] + sunDir[2] * obsDir[2]
  )
  const polarization = rayleighPolarization(scatterAngle)

  // 散射强度
  const intensity = rayleighPhaseFunction(scatterAngle)

  return (
    <group>
      {/* 入射太阳光 */}
      <Line
        points={[
          [sunDir[0] * 6, sunDir[1] * 6, 0],
          [0, 0, 0],
        ]}
        color="#fbbf24"
        lineWidth={4}
      />

      {/* 散射光到观察者 */}
      <Line
        points={[
          [0, 0, 0],
          [obsDir[0] * 4, obsDir[1] * 4, 0],
        ]}
        color={polarization > 0.5 ? '#22d3ee' : '#60a5fa'}
        lineWidth={Math.max(1, 4 * intensity * 3)}
        transparent
        opacity={0.8}
      />

      {/* 偏振指示 */}
      <group position={[obsDir[0] * 2, obsDir[1] * 2, 0]}>
        {/* 散射光偏振方向（垂直于散射面） */}
        <Line
          points={[
            [0, 0, -0.5 * polarization],
            [0, 0, 0.5 * polarization],
          ]}
          color="#22d3ee"
          lineWidth={3}
        />
      </group>

      {/* 太阳 */}
      <Sphere args={[0.5, 16, 16]} position={[sunDir[0] * 6, sunDir[1] * 6, 0]}>
        <meshBasicMaterial color="#fbbf24" />
      </Sphere>

      {/* 观察者 */}
      <mesh position={[obsDir[0] * 4, obsDir[1] * 4, 0]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>

      {/* 标注 */}
      <Text position={[sunDir[0] * 6.5, sunDir[1] * 6.5, 0]} fontSize={0.3} color="#fbbf24">
        太阳
      </Text>
      <Text position={[0, -0.8, 0]} fontSize={0.25} color="#94a3b8">
        散射点
      </Text>
      <Text position={[obsDir[0] * 4.5, obsDir[1] * 4.5, 0]} fontSize={0.25} color="#22d3ee">
        观察
      </Text>
    </group>
  )
}


// 3D场景
function RayleighScene({
  sunAngle,
  observerAngle,
}: {
  sunAngle: number
  observerAngle: number
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 大气散射粒子 */}
      <AtmosphereScattering />

      {/* 散射光线 */}
      <ScatteredRays sunAngle={sunAngle} observerAngle={observerAngle} />

      {/* 散射角标注 */}
      <Text position={[2, 3, 0]} fontSize={0.3} color="#94a3b8">
        散射角: {(180 - Math.abs(sunAngle - observerAngle)).toFixed(0)}°
      </Text>

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 波长依赖性图表
function WavelengthDependenceChart() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
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
    ctx.fillText('400', margin.left - 5, height - margin.bottom + 15)
    ctx.fillText('550', margin.left + chartWidth / 2 - 10, height - margin.bottom + 15)
    ctx.fillText('700nm', width - margin.right - 25, height - margin.bottom + 15)
    ctx.fillText('I', margin.left - 15, margin.top + 5)
    ctx.fillText('λ', width - margin.right + 5, height - margin.bottom)

    // 绘制λ^-4曲线
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()

    const maxIntensity = rayleighIntensity(400)

    for (let wavelength = 400; wavelength <= 700; wavelength += 2) {
      const intensity = rayleighIntensity(wavelength)
      const x = margin.left + ((wavelength - 400) / 300) * chartWidth
      const y = height - margin.bottom - (intensity / maxIntensity) * chartHeight * 0.9

      const [r, g, b] = wavelengthToRGB(wavelength)
      ctx.strokeStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`

      if (wavelength === 400) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 标注关键点
    const keyWavelengths = [450, 550, 650]
    keyWavelengths.forEach((wl) => {
      const intensity = rayleighIntensity(wl)
      const x = margin.left + ((wl - 400) / 300) * chartWidth
      const y = height - margin.bottom - (intensity / maxIntensity) * chartHeight * 0.9
      const [r, g, b] = wavelengthToRGB(wl)

      ctx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
    })
  }, [])

  return <Demo2DCanvas width={300} height={160} draw={draw} />
}

// 偏振度vs散射角图表
function PolarizationAngleChart({ currentAngle }: { currentAngle: number }) {
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
      ctx.fillText('0°', margin.left - 5, height - margin.bottom + 15)
      ctx.fillText('90°', margin.left + chartWidth / 2 - 10, height - margin.bottom + 15)
      ctx.fillText('180°', width - margin.right - 20, height - margin.bottom + 15)
      ctx.fillText('100%', margin.left - 35, margin.top + 5)
      ctx.fillText('偏振度', 5, margin.top - 5)
      ctx.fillText('θ', width - margin.right + 5, height - margin.bottom)

      // 绘制偏振度曲线
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let angle = 0; angle <= 180; angle++) {
        const rad = (angle * Math.PI) / 180
        const polarization = rayleighPolarization(rad)
        const x = margin.left + (angle / 180) * chartWidth
        const y = height - margin.bottom - polarization * chartHeight
        if (angle === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // 90度标记（完全偏振）
      const x90 = margin.left + 0.5 * chartWidth
      ctx.strokeStyle = '#4ade80'
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(x90, margin.top)
      ctx.lineTo(x90, height - margin.bottom)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#4ade80'
      ctx.fillText('完全偏振', x90 - 25, margin.top - 5)

      // 当前角度
      const currentRad = (currentAngle * Math.PI) / 180
      const currentPol = rayleighPolarization(currentRad)
      const currentX = margin.left + (currentAngle / 180) * chartWidth
      const currentY = height - margin.bottom - currentPol * chartHeight

      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI)
      ctx.fill()
    },
    [currentAngle]
  )

  return <Demo2DCanvas width={300} height={160} draw={draw} />
}

// 主演示组件
export function RayleighScatteringDemo() {
  const [sunAngle, setSunAngle] = useState(60)
  const [observerAngle, setObserverAngle] = useState(45)

  // 散射角
  const scatterAngle = 180 - Math.abs(sunAngle - observerAngle)
  const scatterRad = (scatterAngle * Math.PI) / 180

  // 偏振度
  const polarization = rayleighPolarization(scatterRad)

  // 各波长散射强度
  const blueIntensity = rayleighIntensity(450)
  const greenIntensity = rayleighIntensity(550)
  const redIntensity = rayleighIntensity(650)

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 50 }}
          gl={{ antialias: true }}
        >
          <RayleighScene sunAngle={sunAngle} observerAngle={observerAngle} />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="参数控制">
          <SliderControl
            label="太阳仰角"
            value={sunAngle}
            min={10}
            max={90}
            step={5}
            unit="°"
            onChange={setSunAngle}
          />
          <SliderControl
            label="观察方向"
            value={observerAngle}
            min={0}
            max={90}
            step={5}
            unit="°"
            onChange={setObserverAngle}
          />
          <ButtonGroup
            label="时间预设"
            options={[
              { value: 15, label: '日出' },
              { value: 60, label: '上午' },
              { value: 90, label: '正午' },
            ]}
            value={sunAngle}
            onChange={(v) => setSunAngle(v as number)}
          />
        </ControlPanel>

        <ControlPanel title="散射参数">
          <ValueDisplay label="散射角 θ" value={scatterAngle.toFixed(0)} unit="°" />
          <ValueDisplay
            label="偏振度"
            value={(polarization * 100).toFixed(0)}
            unit="%"
            color={polarization > 0.8 ? 'green' : 'cyan'}
          />
          <Formula>I ∝ λ⁻⁴</Formula>
        </ControlPanel>

        <ControlPanel title="各波长相对散射强度">
          <ValueDisplay label="蓝光 (450nm)" value={blueIntensity.toFixed(1)} color="blue" />
          <ValueDisplay label="绿光 (550nm)" value={greenIntensity.toFixed(1)} color="green" />
          <ValueDisplay label="红光 (650nm)" value={redIntensity.toFixed(1)} color="red" />
          <div className="text-xs text-gray-500 mt-2">
            蓝光散射约为红光的 {(blueIntensity / redIntensity).toFixed(1)} 倍
          </div>
        </ControlPanel>

        <ControlPanel title="波长依赖性 (λ⁻⁴)">
          <WavelengthDependenceChart />
        </ControlPanel>

        <ControlPanel title="偏振度 vs 散射角">
          <PolarizationAngleChart currentAngle={scatterAngle} />
        </ControlPanel>

        <InfoPanel title="瑞利散射现象">
          <div className="space-y-1 text-xs">
            <p>• 粒径 ≪ 波长时发生</p>
            <p>• I ∝ λ⁻⁴（蓝光散射更强）</p>
            <p>• 90°散射完全线偏振</p>
            <p>• 解释天空蓝色、日落红色</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
