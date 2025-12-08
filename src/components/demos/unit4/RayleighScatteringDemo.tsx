/**
 * 瑞利散射演示 - Unit 4
 * 演示粒径远小于波长时的散射特性（蓝天效应）
 * 重新设计：纯 DOM + SVG + Framer Motion
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay, Toggle } from '../DemoControls'

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
function wavelengthToRGB(wavelength: number): string {
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

  return `rgb(${Math.round(R * 255)}, ${Math.round(G * 255)}, ${Math.round(B * 255)})`
}

// 计算天空颜色（基于太阳角度）
function getSkyColor(sunAngle: number): string {
  // 太阳低时，光线穿过更多大气，蓝光散射殆尽，呈现橙红色
  // 太阳高时，天空呈现蓝色
  const factor = sunAngle / 90 // 0-1

  if (factor < 0.2) {
    // 日出/日落 - 橙红色
    return `rgb(${255}, ${Math.round(100 + factor * 200)}, ${Math.round(factor * 255)})`
  } else if (factor < 0.5) {
    // 早晨/傍晚 - 渐变到蓝色
    const t = (factor - 0.2) / 0.3
    return `rgb(${Math.round(255 * (1 - t))}, ${Math.round(150 + 50 * t)}, ${Math.round(200 + 55 * t)})`
  } else {
    // 正午 - 蓝色
    return 'rgb(100, 180, 255)'
  }
}

// 瑞利散射场景图
function RayleighDiagram({
  sunAngle,
  observerAngle,
  showPolarization,
}: {
  sunAngle: number
  observerAngle: number
  showPolarization: boolean
}) {
  const width = 600
  const height = 350
  const centerX = 300
  const groundY = 300

  // 太阳位置
  const sunDistance = 180
  const sunX = centerX + sunDistance * Math.cos((180 - sunAngle) * Math.PI / 180)
  const sunY = groundY - sunDistance * Math.sin(sunAngle * Math.PI / 180)

  // 散射点（大气中）
  const scatterX = centerX
  const scatterY = groundY - 120

  // 观察者位置
  const observerX = centerX + 100
  const observerY = groundY

  // 观察方向终点
  const obsDistance = 100
  const obsEndX = observerX + obsDistance * Math.cos((180 - observerAngle) * Math.PI / 180)
  const obsEndY = observerY - obsDistance * Math.sin(observerAngle * Math.PI / 180)

  // 散射角
  const scatterAngle = 180 - Math.abs(sunAngle - observerAngle)
  const scatterRad = scatterAngle * Math.PI / 180
  const polarization = rayleighPolarization(scatterRad)

  // 天空颜色
  const skyColor = getSkyColor(sunAngle)

  // 生成大气粒子
  const particles = useMemo(() => {
    const result = []
    for (let i = 0; i < 30; i++) {
      const x = 100 + Math.random() * 400
      const y = 80 + Math.random() * 180
      const size = 2 + Math.random() * 3
      result.push({ x, y, size, delay: Math.random() * 2 })
    }
    return result
  }, [])

  // 散射光线（不同波长）
  const scatteredRays = useMemo(() => {
    const rays = []
    const wavelengths = [450, 480, 510, 550, 600, 650]
    const angles = [-60, -40, -20, 0, 20, 40, 60, 80, 100, 120]

    angles.forEach((angle, i) => {
      const wl = wavelengths[i % wavelengths.length]
      const intensity = rayleighIntensity(wl)
      const rad = angle * Math.PI / 180
      const length = 30 + intensity * 5

      rays.push({
        wl,
        endX: scatterX + length * Math.cos(rad),
        endY: scatterY - length * Math.sin(rad),
        color: wavelengthToRGB(wl),
        opacity: 0.3 + intensity / 10,
        width: 1 + intensity / 3,
        delay: i * 0.1,
      })
    })
    return rays
  }, [scatterX, scatterY])

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        {/* 天空渐变 */}
        <linearGradient id="skyGradientRayleigh" x1="0%" y1="0%" x2="0%" y2="100%">
          <motion.stop
            offset="0%"
            animate={{ stopColor: skyColor }}
            transition={{ duration: 0.5 }}
          />
          <motion.stop
            offset="100%"
            animate={{ stopColor: sunAngle < 30 ? '#ff9966' : '#87ceeb' }}
            transition={{ duration: 0.5 }}
          />
        </linearGradient>

        {/* 太阳光晕 */}
        <radialGradient id="sunGlowRayleigh">
          <stop offset="0%" stopColor="#fff7e6" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>

        {/* 散射粒子光晕 */}
        <radialGradient id="particleGlow">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 天空背景 */}
      <rect x="0" y="0" width={width} height={groundY} fill="url(#skyGradientRayleigh)" />

      {/* 地面 */}
      <rect x="0" y={groundY} width={width} height={height - groundY} fill="#2d5016" />

      {/* 大气粒子 */}
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill="#60a5fa"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 太阳 */}
      <motion.g
        animate={{ x: sunX - 300, y: sunY - 100 }}
        transition={{ duration: 0.5 }}
      >
        <circle cx={300} cy={100} r={40} fill="url(#sunGlowRayleigh)" />
        <circle cx={300} cy={100} r={20} fill="#fef3c7" />
      </motion.g>

      {/* 入射太阳光线 */}
      <motion.line
        x1={sunX}
        y1={sunY}
        x2={scatterX}
        y2={scatterY}
        stroke="#fbbf24"
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* 入射光箭头 */}
      <motion.polygon
        points={`${scatterX},${scatterY} ${scatterX - 10},${scatterY - 10} ${scatterX + 5},${scatterY - 5}`}
        fill="#fbbf24"
        animate={{ x: 0, y: 0 }}
      />

      {/* 散射光线 */}
      {scatteredRays.map((ray, i) => (
        <motion.line
          key={i}
          x1={scatterX}
          y1={scatterY}
          x2={ray.endX}
          y2={ray.endY}
          stroke={ray.color}
          strokeWidth={ray.width}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: ray.opacity }}
          transition={{ delay: ray.delay, duration: 0.5 }}
        />
      ))}

      {/* 散射点 */}
      <motion.circle
        cx={scatterX}
        cy={scatterY}
        r={15}
        fill="url(#particleGlow)"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx={scatterX} cy={scatterY} r={5} fill="#60a5fa" />

      {/* 到观察者的散射光 */}
      <motion.line
        x1={scatterX}
        y1={scatterY}
        x2={observerX}
        y2={observerY - 20}
        stroke={polarization > 0.5 ? '#22d3ee' : '#60a5fa'}
        strokeWidth={3}
        strokeDasharray="5,3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5 }}
      />

      {/* 观察者 */}
      <g transform={`translate(${observerX}, ${observerY})`}>
        {/* 身体 */}
        <ellipse cx={0} cy={-15} rx={12} ry={18} fill="#64748b" />
        {/* 头 */}
        <circle cx={0} cy={-40} r={10} fill="#fcd34d" />
        {/* 眼睛看向天空 */}
        <motion.line
          x1={0}
          y1={-45}
          x2={obsEndX - observerX}
          y2={obsEndY - observerY - 45}
          stroke="#22d3ee"
          strokeWidth={2}
          strokeDasharray="3,2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </g>

      {/* 偏振指示器 */}
      {showPolarization && (
        <g transform={`translate(${(scatterX + observerX) / 2}, ${(scatterY + observerY) / 2 - 30})`}>
          <rect x={-25} y={-15} width={50} height={30} rx={5} fill="rgba(0,0,0,0.6)" />
          {/* 偏振方向指示 */}
          <motion.line
            x1={-15}
            y1={0}
            x2={15}
            y2={0}
            stroke="#22d3ee"
            strokeWidth={3}
            strokeLinecap="round"
            animate={{
              rotate: [0, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <text x={0} y={20} textAnchor="middle" fill="#94a3b8" fontSize={10}>
            {(polarization * 100).toFixed(0)}% 偏振
          </text>
        </g>
      )}

      {/* 散射角标注 */}
      <g transform={`translate(${scatterX + 40}, ${scatterY - 30})`}>
        <rect x={-30} y={-12} width={60} height={24} rx={4} fill="rgba(0,0,0,0.6)" />
        <text x={0} y={5} textAnchor="middle" fill="#f59e0b" fontSize={12} fontWeight="bold">
          θ = {scatterAngle.toFixed(0)}°
        </text>
      </g>

      {/* 标签 */}
      <motion.text
        x={sunX}
        y={sunY - 50}
        textAnchor="middle"
        fill="#fbbf24"
        fontSize={14}
        fontWeight="bold"
        animate={{ x: sunX, y: sunY - 50 }}
      >
        太阳
      </motion.text>

      <text x={scatterX} y={scatterY + 35} textAnchor="middle" fill="#60a5fa" fontSize={12}>
        大气分子
      </text>

      <text x={observerX} y={observerY + 25} textAnchor="middle" fill="#94a3b8" fontSize={12}>
        观察者
      </text>
    </svg>
  )
}

// 波长依赖性曲线图
function WavelengthDependenceChart() {
  const width = 280
  const height = 150
  const margin = { left: 45, right: 15, top: 20, bottom: 35 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // 生成曲线路径
  const curvePath = useMemo(() => {
    const maxIntensity = rayleighIntensity(400)
    let d = ''

    for (let wl = 400; wl <= 700; wl += 5) {
      const intensity = rayleighIntensity(wl)
      const x = margin.left + ((wl - 400) / 300) * chartWidth
      const y = margin.top + (1 - intensity / maxIntensity) * chartHeight * 0.9

      if (wl === 400) {
        d += `M ${x} ${y}`
      } else {
        d += ` L ${x} ${y}`
      }
    }
    return d
  }, [chartWidth, chartHeight, margin])

  // 关键波长点
  const keyPoints = [
    { wl: 450, label: '蓝' },
    { wl: 550, label: '绿' },
    { wl: 650, label: '红' },
  ]

  const maxIntensity = rayleighIntensity(400)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="#0f172a" rx={8} />

      {/* 网格线 */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <line
          key={i}
          x1={margin.left}
          y1={margin.top + ratio * chartHeight}
          x2={width - margin.right}
          y2={margin.top + ratio * chartHeight}
          stroke="#334155"
          strokeWidth={0.5}
        />
      ))}

      {/* 坐标轴 */}
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={height - margin.bottom}
        stroke="#475569"
        strokeWidth={1}
      />
      <line
        x1={margin.left}
        y1={height - margin.bottom}
        x2={width - margin.right}
        y2={height - margin.bottom}
        stroke="#475569"
        strokeWidth={1}
      />

      {/* Y轴标签 */}
      <text x={8} y={margin.top + 5} fill="#94a3b8" fontSize={10}>I (强度)</text>

      {/* X轴标签 */}
      <text x={margin.left} y={height - 8} fill="#94a3b8" fontSize={10}>400</text>
      <text x={margin.left + chartWidth / 2 - 10} y={height - 8} fill="#94a3b8" fontSize={10}>550</text>
      <text x={width - margin.right - 25} y={height - 8} fill="#94a3b8" fontSize={10}>700 nm</text>

      {/* 曲线 - 用渐变色 */}
      <defs>
        <linearGradient id="wavelengthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="25%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="75%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      <motion.path
        d={curvePath}
        fill="none"
        stroke="url(#wavelengthGradient)"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* 关键点 */}
      {keyPoints.map((point, i) => {
        const intensity = rayleighIntensity(point.wl)
        const x = margin.left + ((point.wl - 400) / 300) * chartWidth
        const y = margin.top + (1 - intensity / maxIntensity) * chartHeight * 0.9

        return (
          <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.2 }}>
            <circle cx={x} cy={y} r={6} fill={wavelengthToRGB(point.wl)} />
            <text x={x} y={y - 10} textAnchor="middle" fill={wavelengthToRGB(point.wl)} fontSize={10}>
              {point.label}
            </text>
          </motion.g>
        )
      })}

      {/* 公式标注 */}
      <text x={width - margin.right - 40} y={margin.top + 20} fill="#f59e0b" fontSize={12} fontWeight="bold">
        I ∝ λ⁻⁴
      </text>
    </svg>
  )
}

// 偏振度vs散射角图表
function PolarizationAngleChart({ currentAngle }: { currentAngle: number }) {
  const width = 280
  const height = 150
  const margin = { left: 45, right: 15, top: 20, bottom: 35 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // 生成曲线路径
  const curvePath = useMemo(() => {
    let d = ''

    for (let angle = 0; angle <= 180; angle += 2) {
      const rad = angle * Math.PI / 180
      const pol = rayleighPolarization(rad)
      const x = margin.left + (angle / 180) * chartWidth
      const y = margin.top + (1 - pol) * chartHeight

      if (angle === 0) {
        d += `M ${x} ${y}`
      } else {
        d += ` L ${x} ${y}`
      }
    }
    return d
  }, [chartWidth, chartHeight, margin])

  // 当前点
  const currentRad = currentAngle * Math.PI / 180
  const currentPol = rayleighPolarization(currentRad)
  const currentX = margin.left + (currentAngle / 180) * chartWidth
  const currentY = margin.top + (1 - currentPol) * chartHeight

  // 90度线位置
  const x90 = margin.left + 0.5 * chartWidth

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="#0f172a" rx={8} />

      {/* 坐标轴 */}
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={height - margin.bottom}
        stroke="#475569"
        strokeWidth={1}
      />
      <line
        x1={margin.left}
        y1={height - margin.bottom}
        x2={width - margin.right}
        y2={height - margin.bottom}
        stroke="#475569"
        strokeWidth={1}
      />

      {/* Y轴标签 */}
      <text x={5} y={margin.top + 5} fill="#94a3b8" fontSize={9}>偏振度</text>
      <text x={margin.left - 25} y={margin.top + 5} fill="#94a3b8" fontSize={10}>100%</text>
      <text x={margin.left - 15} y={height - margin.bottom} fill="#94a3b8" fontSize={10}>0%</text>

      {/* X轴标签 */}
      <text x={margin.left - 5} y={height - 8} fill="#94a3b8" fontSize={10}>0°</text>
      <text x={x90 - 10} y={height - 8} fill="#94a3b8" fontSize={10}>90°</text>
      <text x={width - margin.right - 20} y={height - 8} fill="#94a3b8" fontSize={10}>180°</text>
      <text x={width - margin.right - 5} y={height - 20} fill="#94a3b8" fontSize={10}>θ</text>

      {/* 90度垂直线 - 完全偏振 */}
      <line
        x1={x90}
        y1={margin.top}
        x2={x90}
        y2={height - margin.bottom}
        stroke="#4ade80"
        strokeWidth={1}
        strokeDasharray="5,3"
      />
      <text x={x90 - 25} y={margin.top - 5} fill="#4ade80" fontSize={10}>
        完全偏振
      </text>

      {/* 曲线 */}
      <motion.path
        d={curvePath}
        fill="none"
        stroke="#22d3ee"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* 当前角度点 */}
      <motion.circle
        cx={currentX}
        cy={currentY}
        r={8}
        fill="#f59e0b"
        animate={{ x: currentX - currentX, y: currentY - currentY }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1={currentX}
        y1={currentY}
        x2={currentX}
        y2={height - margin.bottom}
        stroke="#f59e0b"
        strokeWidth={1}
        strokeDasharray="3,2"
        animate={{ x1: currentX, y1: currentY }}
      />
    </svg>
  )
}

// 散射强度对比柱状图
function ScatteringIntensityBars() {
  const wavelengths = [
    { wl: 450, label: '蓝光', color: '#3b82f6' },
    { wl: 550, label: '绿光', color: '#22c55e' },
    { wl: 650, label: '红光', color: '#ef4444' },
  ]

  const maxIntensity = rayleighIntensity(450)

  return (
    <div className="space-y-3">
      {wavelengths.map((item, i) => {
        const intensity = rayleighIntensity(item.wl)
        const percentage = (intensity / maxIntensity) * 100

        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: item.color }}>{item.label} ({item.wl}nm)</span>
              <span className="text-gray-400">{intensity.toFixed(2)}</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-xs text-gray-500 mt-2 text-center">
        蓝光散射约为红光的 {(rayleighIntensity(450) / rayleighIntensity(650)).toFixed(1)} 倍
      </p>
    </div>
  )
}

// 主演示组件
export function RayleighScatteringDemo() {
  const { t } = useTranslation()
  const [sunAngle, setSunAngle] = useState(60)
  const [observerAngle, setObserverAngle] = useState(45)
  const [showPolarization, setShowPolarization] = useState(true)

  // 散射角
  const scatterAngle = 180 - Math.abs(sunAngle - observerAngle)
  const scatterRad = scatterAngle * Math.PI / 180

  // 偏振度
  const polarization = rayleighPolarization(scatterRad)

  // 快速设置太阳角度
  const presets = [
    { label: '日出', angle: 15 },
    { label: '上午', angle: 45 },
    { label: '正午', angle: 90 },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          瑞利散射演示
        </h2>
        <p className="text-gray-400 text-sm mt-1">Rayleigh Scattering - 蓝天与红日的秘密</p>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          {/* 散射场景 */}
          <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-4">
            <h3 className="text-sm font-medium text-cyan-400 mb-3">大气散射场景</h3>
            <div className="aspect-[16/10]">
              <RayleighDiagram
                sunAngle={sunAngle}
                observerAngle={observerAngle}
                showPolarization={showPolarization}
              />
            </div>
          </div>

          {/* 图表区 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-3">
              <h4 className="text-xs font-medium text-cyan-400 mb-2">波长依赖性 (λ⁻⁴)</h4>
              <WavelengthDependenceChart />
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-3">
              <h4 className="text-xs font-medium text-cyan-400 mb-2">偏振度 vs 散射角</h4>
              <PolarizationAngleChart currentAngle={scatterAngle} />
            </div>
          </div>
        </div>

        {/* 右侧：控制面板 */}
        <div className="space-y-4">
          <ControlPanel title="参数控制">
            <SliderControl
              label="太阳仰角"
              value={sunAngle}
              min={10}
              max={90}
              step={5}
              unit="°"
              onChange={setSunAngle}
              color="yellow"
            />
            <SliderControl
              label="观察方向"
              value={observerAngle}
              min={0}
              max={90}
              step={5}
              unit="°"
              onChange={setObserverAngle}
              color="cyan"
            />

            {/* 预设按钮 */}
            <div className="flex gap-2 mt-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSunAngle(preset.angle)}
                  className={`flex-1 px-3 py-1.5 rounded text-xs transition-colors ${
                    sunAngle === preset.angle
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <Toggle
              label="显示偏振信息"
              checked={showPolarization}
              onChange={setShowPolarization}
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
            <div className="mt-2 p-2 bg-slate-800/50 rounded text-center">
              <span className="text-yellow-400 font-mono text-lg">I ∝ λ⁻⁴</span>
            </div>
          </ControlPanel>

          <ControlPanel title="各波长相对散射强度">
            <ScatteringIntensityBars />
          </ControlPanel>
        </div>
      </div>

      {/* 底部知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="瑞利散射特性" color="cyan">
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• <strong>适用条件：</strong>粒径 ≪ 波长（空气分子 ~0.3nm）</li>
            <li>• <strong>波长依赖：</strong>I ∝ λ⁻⁴（短波散射更强）</li>
            <li>• <strong>偏振特性：</strong>90°散射时完全线偏振</li>
            <li>• <strong>对称性：</strong>前后散射对称（1 + cos²θ）</li>
          </ul>
        </InfoCard>

        <InfoCard title="自然现象解释" color="blue">
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• <strong>蓝天：</strong>蓝光散射是红光的~10倍，充满天空</li>
            <li>• <strong>红日落：</strong>阳光穿过更多大气，蓝光散射殆尽</li>
            <li>• <strong>天空偏振：</strong>与太阳成90°方向偏振最强</li>
            <li>• <strong>应用：</strong>偏振太阳镜可减弱天空眩光</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
