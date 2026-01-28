/**
 * 瑞利散射演示 - Unit 4
 * 演示粒径远小于波长时的散射特性（蓝天效应）
 * 重新设计：纯 DOM + SVG + Framer Motion + DemoLayout 统一布局
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useDemoTheme } from '../demoThemeColors'
import { SliderControl, ControlPanel, InfoCard, Toggle } from '../DemoControls'
import {
  DemoHeader,
  VisualizationPanel,
  DemoMainLayout,
  InfoGrid,
  ChartPanel,
  StatCard,
  FormulaHighlight,
} from '../DemoLayout'

// ── 物理计算函数 ──

// 瑞利散射强度 (与λ^-4成正比)
function rayleighIntensity(wavelength: number): number {
  // 归一化到550nm
  const normalized = Math.pow(550 / wavelength, 4)
  return Math.min(normalized, 10)
}

// 瑞利散射相函数 (exported for future use)
export function rayleighPhaseFunction(theta: number): number {
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

// ── 瑞利散射场景图 ──
function RayleighDiagram({
  sunAngle,
  observerAngle,
  showPolarization,
}: {
  sunAngle: number
  observerAngle: number
  showPolarization: boolean
}) {
  const width = 700
  const height = 400
  const centerX = 350
  const groundY = 340

  // 太阳位置
  const sunDistance = 200
  const sunX = centerX + sunDistance * Math.cos((180 - sunAngle) * Math.PI / 180)
  const sunY = groundY - sunDistance * Math.sin(sunAngle * Math.PI / 180)

  // 散射点（大气中）
  const scatterX = centerX
  const scatterY = groundY - 140

  // 观察者位置
  const observerX = centerX + 120
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

  // 地平线附近颜色
  const horizonColor = sunAngle < 30 ? '#ff9966' : '#b8d8f0'

  // 生成大气粒子
  const particles = useMemo(() => {
    const result = []
    for (let i = 0; i < 40; i++) {
      const x = 60 + Math.random() * 580
      const y = 40 + Math.random() * 260
      const size = 1.5 + Math.random() * 2.5
      result.push({ x, y, size, delay: Math.random() * 3 })
    }
    return result
  }, [])

  // 散射光线（不同波长）
  const scatteredRays = useMemo(() => {
    const rays: { wl: number; endX: number; endY: number; color: string; opacity: number; width: number; delay: number }[] = []
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
        {/* 多段天空渐变 */}
        <linearGradient id="skyGradientRayleigh" x1="0%" y1="0%" x2="0%" y2="100%">
          <motion.stop
            offset="0%"
            animate={{ stopColor: skyColor }}
            transition={{ duration: 0.5 }}
          />
          <motion.stop
            offset="60%"
            animate={{ stopColor: sunAngle < 30 ? '#e8a87c' : '#a5d0f0' }}
            transition={{ duration: 0.5 }}
          />
          <motion.stop
            offset="100%"
            animate={{ stopColor: horizonColor }}
            transition={{ duration: 0.5 }}
          />
        </linearGradient>

        {/* 太阳光晕 - 多层辉光 */}
        <radialGradient id="sunGlowRayleighOuter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunGlowRayleighMiddle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7e6" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunCoreRayleigh" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fcd34d" />
        </radialGradient>

        {/* 散射粒子光晕 */}
        <radialGradient id="particleGlow">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>

        {/* 地面渐变 */}
        <linearGradient id="groundGradientRayleigh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#365314" />
          <stop offset="100%" stopColor="#1a2e05" />
        </linearGradient>

        {/* 柔光滤镜 */}
        <filter id="rayleighSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="rayleighStrongGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 天空背景 */}
      <rect x="0" y="0" width={width} height={groundY} fill="url(#skyGradientRayleigh)" />

      {/* 地面 */}
      <rect x="0" y={groundY} width={width} height={height - groundY} fill="url(#groundGradientRayleigh)" />
      {/* 地面高光线 */}
      <line x1="0" y1={groundY} x2={width} y2={groundY} stroke="#4a7c23" strokeWidth="1.5" opacity="0.4" />

      {/* 大气粒子 - 带柔和闪烁 */}
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill="#93c5fd"
          initial={{ opacity: 0.15 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            r: [p.size, p.size * 1.3, p.size],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 太阳 - 多层渲染 */}
      <motion.g
        animate={{ x: sunX - centerX, y: sunY - 120 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* 外层辉光 */}
        <circle cx={centerX} cy={120} r={60} fill="url(#sunGlowRayleighOuter)" filter="url(#rayleighStrongGlow)" />
        {/* 中层辉光 */}
        <circle cx={centerX} cy={120} r={35} fill="url(#sunGlowRayleighMiddle)" filter="url(#rayleighSoftGlow)" />
        {/* 核心 */}
        <circle cx={centerX} cy={120} r={18} fill="url(#sunCoreRayleigh)" />
      </motion.g>

      {/* 入射太阳光线 - 带发光效果 */}
      <motion.line
        x1={sunX}
        y1={sunY}
        x2={scatterX}
        y2={scatterY}
        stroke="#fbbf24"
        strokeWidth={2}
        strokeOpacity={0.3}
        strokeLinecap="round"
        filter="url(#rayleighSoftGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.line
        x1={sunX}
        y1={sunY}
        x2={scatterX}
        y2={scatterY}
        stroke="#fde68a"
        strokeWidth={3}
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

      {/* 散射点 - 带脉冲动画 */}
      <motion.circle
        cx={scatterX}
        cy={scatterY}
        r={18}
        fill="url(#particleGlow)"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx={scatterX} cy={scatterY} r={5} fill="#60a5fa" />
      <circle cx={scatterX} cy={scatterY} r={2.5} fill="#93c5fd" />

      {/* 到观察者的散射光 */}
      <motion.line
        x1={scatterX}
        y1={scatterY}
        x2={observerX}
        y2={observerY - 20}
        stroke={polarization > 0.5 ? '#22d3ee' : '#60a5fa'}
        strokeWidth={3}
        strokeDasharray="6,4"
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
          <rect x={-30} y={-18} width={60} height={36} rx={8} fill="rgba(0,0,0,0.65)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
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
          <text x={0} y={22} textAnchor="middle" fill="#94a3b8" fontSize={10}>
            {(polarization * 100).toFixed(0)}%
          </text>
        </g>
      )}

      {/* 散射角标注 */}
      <g transform={`translate(${scatterX + 50}, ${scatterY - 35})`}>
        <rect x={-35} y={-14} width={70} height={28} rx={8} fill="rgba(0,0,0,0.65)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
        <text x={0} y={5} textAnchor="middle" fill="#f59e0b" fontSize={13} fontWeight="bold" fontFamily="monospace">
          {'\u03B8'} = {scatterAngle.toFixed(0)}{'\u00B0'}
        </text>
      </g>

      {/* 标签 */}
      <motion.text
        x={sunX}
        y={sunY - 55}
        textAnchor="middle"
        fill="#fbbf24"
        fontSize={13}
        fontWeight="bold"
        animate={{ x: sunX, y: sunY - 55 }}
      >
        {'\u2600'} Sun
      </motion.text>

      <text x={scatterX} y={scatterY + 40} textAnchor="middle" fill="#93c5fd" fontSize={12} fontWeight="500">
        Molecule
      </text>

      <text x={observerX} y={observerY + 28} textAnchor="middle" fill="#94a3b8" fontSize={12} fontWeight="500">
        Observer
      </text>
    </svg>
  )
}

// ── 波长依赖性曲线图 ──
function WavelengthDependenceChart() {
  const dt = useDemoTheme()
  const width = 320
  const height = 170
  const margin = { left: 45, right: 20, top: 22, bottom: 38 }
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

  // 曲线下方填充
  const areaPath = useMemo(() => {
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
    // Close the area path
    const xEnd = margin.left + chartWidth
    const xStart = margin.left
    const yBase = margin.top + chartHeight
    d += ` L ${xEnd} ${yBase} L ${xStart} ${yBase} Z`
    return d
  }, [chartWidth, chartHeight, margin])

  // 关键波长点
  const keyPoints = [
    { wl: 450, label: 'Blue' },
    { wl: 550, label: 'Green' },
    { wl: 650, label: 'Red' },
  ]

  const maxIntensity = rayleighIntensity(400)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill={dt.canvasBg} rx={10} />

      {/* 网格线 */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <line
          key={i}
          x1={margin.left}
          y1={margin.top + ratio * chartHeight}
          x2={width - margin.right}
          y2={margin.top + ratio * chartHeight}
          stroke={dt.gridLineColor}
          strokeWidth={0.5}
        />
      ))}

      {/* 坐标轴 */}
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={height - margin.bottom}
        stroke={dt.axisColor}
        strokeWidth={1}
      />
      <line
        x1={margin.left}
        y1={height - margin.bottom}
        x2={width - margin.right}
        y2={height - margin.bottom}
        stroke={dt.axisColor}
        strokeWidth={1}
      />

      {/* Y轴标签 */}
      <text x={8} y={margin.top + 5} fill={dt.textSecondary} fontSize={10}>I</text>

      {/* X轴标签 */}
      <text x={margin.left} y={height - 10} fill={dt.textSecondary} fontSize={10}>400</text>
      <text x={margin.left + chartWidth / 2 - 10} y={height - 10} fill={dt.textSecondary} fontSize={10}>550</text>
      <text x={width - margin.right - 30} y={height - 10} fill={dt.textSecondary} fontSize={10}>700 nm</text>

      {/* 曲线渐变色定义 */}
      <defs>
        <linearGradient id="wavelengthGradientRayleigh" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="25%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="75%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="wavelengthAreaGradientRayleigh" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
          <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* 面积填充 */}
      <motion.path
        d={areaPath}
        fill="url(#wavelengthAreaGradientRayleigh)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* 曲线 */}
      <motion.path
        d={curvePath}
        fill="none"
        stroke="url(#wavelengthGradientRayleigh)"
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
            <circle cx={x} cy={y} r={4} fill={wavelengthToRGB(point.wl)} stroke={dt.canvasBg} strokeWidth={2} />
            <circle cx={x} cy={y} r={7} fill="none" stroke={wavelengthToRGB(point.wl)} strokeWidth={1} opacity={0.4} />
            <text x={x} y={y - 12} textAnchor="middle" fill={wavelengthToRGB(point.wl)} fontSize={10} fontWeight="600">
              {point.label}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

// ── 偏振度vs散射角图表 ──
function PolarizationAngleChart({ currentAngle }: { currentAngle: number }) {
  const dt = useDemoTheme()
  const width = 320
  const height = 170
  const margin = { left: 45, right: 20, top: 22, bottom: 38 }
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
      <rect x={0} y={0} width={width} height={height} fill={dt.canvasBg} rx={10} />

      {/* 坐标轴 */}
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={height - margin.bottom}
        stroke={dt.axisColor}
        strokeWidth={1}
      />
      <line
        x1={margin.left}
        y1={height - margin.bottom}
        x2={width - margin.right}
        y2={height - margin.bottom}
        stroke={dt.axisColor}
        strokeWidth={1}
      />

      {/* Y轴标签 */}
      <text x={margin.left - 28} y={margin.top + 5} fill={dt.textSecondary} fontSize={10}>100%</text>
      <text x={margin.left - 18} y={height - margin.bottom} fill={dt.textSecondary} fontSize={10}>0%</text>

      {/* X轴标签 */}
      <text x={margin.left - 5} y={height - 10} fill={dt.textSecondary} fontSize={10}>0{'\u00B0'}</text>
      <text x={x90 - 10} y={height - 10} fill={dt.textSecondary} fontSize={10}>90{'\u00B0'}</text>
      <text x={width - margin.right - 22} y={height - 10} fill={dt.textSecondary} fontSize={10}>180{'\u00B0'}</text>
      <text x={width - margin.right + 2} y={height - 22} fill={dt.textSecondary} fontSize={10}>{'\u03B8'}</text>

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
      <text x={x90 + 5} y={margin.top + 12} fill="#4ade80" fontSize={10} fontWeight="500">
        max
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

      {/* 当前角度指示线 */}
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

      {/* 当前角度点 - 外圈 + 内核 */}
      <motion.circle
        cx={currentX}
        cy={currentY}
        r={10}
        fill="#f59e0b"
        opacity={0.2}
        animate={{ x: currentX - currentX, y: currentY - currentY }}
        transition={{ duration: 0.3 }}
      />
      <motion.circle
        cx={currentX}
        cy={currentY}
        r={6}
        fill="#f59e0b"
        animate={{ x: currentX - currentX, y: currentY - currentY }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  )
}

// ── 散射强度对比柱状图 ──
function ScatteringIntensityBars() {
  const dt = useDemoTheme()
  const wavelengths = [
    { wl: 450, label: 'Blue (450nm)', color: '#3b82f6' },
    { wl: 550, label: 'Green (550nm)', color: '#22c55e' },
    { wl: 650, label: 'Red (650nm)', color: '#ef4444' },
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
              <span style={{ color: item.color }} className="font-medium">{item.label}</span>
              <span className={dt.mutedTextClass}>{intensity.toFixed(2)}</span>
            </div>
            <div className={`h-2.5 ${dt.barTrackClass} rounded-full overflow-hidden`}>
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
      <p className={`text-xs mt-2 text-center ${dt.mutedTextClass}`}>
        Blue scatters ~{(rayleighIntensity(450) / rayleighIntensity(650)).toFixed(1)}x more than red
      </p>
    </div>
  )
}

// ── 主演示组件 ──
export function RayleighScatteringDemo() {
  const dt = useDemoTheme()
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
    { label: 'Sunrise', angle: 15 },
    { label: 'Morning', angle: 45 },
    { label: 'Noon', angle: 90 },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* 标题 */}
      <DemoHeader
        title="Rayleigh Scattering"
        subtitle="Why is the sky blue and sunsets red? Explore the wavelength-dependent scattering of light by atmospheric molecules."
        gradient="cyan"
        badge="Unit 4"
      />

      {/* 统计卡片行 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Scatter Angle"
          value={`${scatterAngle.toFixed(0)}`}
          unit={'\u00B0'}
          color="orange"
        />
        <StatCard
          label="Polarization"
          value={`${(polarization * 100).toFixed(0)}`}
          unit="%"
          color={polarization > 0.8 ? 'green' : 'cyan'}
        />
        <StatCard
          label="Sun Elevation"
          value={`${sunAngle}`}
          unit={'\u00B0'}
          color="yellow"
        />
        <StatCard
          label="Blue/Red Ratio"
          value={(rayleighIntensity(450) / rayleighIntensity(650)).toFixed(1)}
          unit="x"
          color="blue"
        />
      </div>

      {/* 主要内容区 - 双栏布局 */}
      <DemoMainLayout
        controlsWidth="wide"
        visualization={
          <div className="space-y-4">
            {/* 散射场景 */}
            <VisualizationPanel variant="dark">
              <div className="aspect-[16/9]">
                <RayleighDiagram
                  sunAngle={sunAngle}
                  observerAngle={observerAngle}
                  showPolarization={showPolarization}
                />
              </div>
            </VisualizationPanel>

            {/* 图表区 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ChartPanel title="Wavelength Dependence" subtitle="I {'\u221D'} {'\u03BB'}{'\u207B'}{'\u2074'}">
                <WavelengthDependenceChart />
              </ChartPanel>
              <ChartPanel title="Polarization vs Angle" subtitle="P({'\u03B8'})">
                <PolarizationAngleChart currentAngle={scatterAngle} />
              </ChartPanel>
            </div>
          </div>
        }
        controls={
          <div className="space-y-4">
            <ControlPanel title="Parameters">
              <SliderControl
                label="Sun Elevation"
                value={sunAngle}
                min={10}
                max={90}
                step={5}
                unit={'\u00B0'}
                onChange={setSunAngle}
                color="orange"
              />
              <SliderControl
                label="Observer Direction"
                value={observerAngle}
                min={0}
                max={90}
                step={5}
                unit={'\u00B0'}
                onChange={setObserverAngle}
                color="cyan"
              />

              {/* 预设按钮 */}
              <div className="flex gap-2 mt-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setSunAngle(preset.angle)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sunAngle === preset.angle
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                        : `${dt.isDark ? 'bg-slate-700/70 text-gray-300 hover:bg-slate-600/70' : 'bg-slate-100 text-gray-600 hover:bg-slate-200'}`
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <Toggle
                label="Show Polarization"
                checked={showPolarization}
                onChange={setShowPolarization}
              />
            </ControlPanel>

            {/* 公式高亮 */}
            <FormulaHighlight
              formula={`I \u221D \u03BB\u207B\u2074`}
              description="Rayleigh scattering intensity is inversely proportional to the fourth power of wavelength"
            />

            <ControlPanel title="Relative Scattering Intensity">
              <ScatteringIntensityBars />
            </ControlPanel>
          </div>
        }
      />

      {/* 底部知识卡片 */}
      <InfoGrid columns={2}>
        <InfoCard title="Rayleigh Scattering Properties" color="cyan">
          <ul className={`text-sm space-y-1.5 ${dt.bodyClass}`}>
            <li>&#8226; <strong>Condition:</strong> Particle size much smaller than wavelength (~0.3nm for air molecules)</li>
            <li>&#8226; <strong>Wavelength dependence:</strong> I proportional to lambda to the negative fourth (short waves scatter more)</li>
            <li>&#8226; <strong>Polarization:</strong> Fully linearly polarized at 90 degree scattering</li>
            <li>&#8226; <strong>Symmetry:</strong> Forward-backward symmetric phase function (1 + cos squared theta)</li>
          </ul>
        </InfoCard>

        <InfoCard title="Natural Phenomena Explained" color="blue">
          <ul className={`text-sm space-y-1.5 ${dt.bodyClass}`}>
            <li>&#8226; <strong>Blue sky:</strong> Blue light scatters ~10x more than red, filling the sky</li>
            <li>&#8226; <strong>Red sunset:</strong> Sunlight traverses more atmosphere; blue is scattered away</li>
            <li>&#8226; <strong>Sky polarization:</strong> Maximum polarization at 90 degrees from the sun</li>
            <li>&#8226; <strong>Application:</strong> Polarized sunglasses reduce sky glare by blocking scattered light</li>
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
