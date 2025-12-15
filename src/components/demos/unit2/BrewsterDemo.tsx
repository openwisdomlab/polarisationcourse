/**
 * 布儒斯特角演示 - Unit 2
 * tan(θB) = n2/n1，反射光为完全s偏振
 * 采用纯DOM + SVG + Framer Motion一体化设计
 *
 * 升级版本：增加波长依赖性（色散）模拟
 * - 使用Sellmeier方程计算折射率
 * - 展示不同波长下布儒斯特角的变化
 * - 波长滑块和光谱色彩显示
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SliderControl, ControlPanel, InfoCard, Toggle } from '../DemoControls'
import {
  sellmeierIndex,
  cauchyIndex,
  wavelengthToRGB,
} from '@/core/WaveOptics'

// 材料类型定义
interface MaterialData {
  nameKey: string
  type: 'sellmeier' | 'cauchy'
  sellmeierKey?: string
  cauchyA?: number
  cauchyB?: number
  fixedN?: number
}

// 支持Sellmeier方程的材料列表
const DISPERSIVE_MATERIALS: MaterialData[] = [
  { nameKey: 'demoUi.brewster.bk7Glass', type: 'sellmeier', sellmeierKey: 'BK7' },
  { nameKey: 'demoUi.brewster.fusedSilica', type: 'sellmeier', sellmeierKey: 'fusedSilica' },
  { nameKey: 'demoUi.brewster.water', type: 'sellmeier', sellmeierKey: 'water' },
  { nameKey: 'demoUi.brewster.diamond', type: 'sellmeier', sellmeierKey: 'diamond' },
  { nameKey: 'demoUi.brewster.sapphire', type: 'sellmeier', sellmeierKey: 'sapphire' },
  { nameKey: 'demoUi.brewster.glass', type: 'cauchy', cauchyA: 1.458, cauchyB: 0.00354 },
  { nameKey: 'demoUi.brewster.ice', type: 'cauchy', cauchyA: 1.3, cauchyB: 0.0032 },
]

// 获取材料在指定波长的折射率
function getMaterialIndex(material: MaterialData, wavelengthNm: number): number {
  if (material.type === 'sellmeier' && material.sellmeierKey) {
    return sellmeierIndex(wavelengthNm, material.sellmeierKey)
  } else if (material.type === 'cauchy' && material.cauchyA !== undefined && material.cauchyB !== undefined) {
    return cauchyIndex(wavelengthNm, material.cauchyA, material.cauchyB)
  }
  return material.fixedN || 1.5
}

// 计算布儒斯特角和反射率
function calculateBrewster(theta: number, n1: number, n2: number) {
  const rad = (theta * Math.PI) / 180
  const sinTheta1 = Math.sin(rad)
  const cosTheta1 = Math.cos(rad)
  const sinTheta2 = (n1 / n2) * sinTheta1

  if (sinTheta2 > 1) {
    return { Rs: 1, Rp: 1, totalReflection: true, theta2: 90 }
  }

  const cosTheta2 = Math.sqrt(1 - sinTheta2 * sinTheta2)
  const theta2 = (Math.asin(sinTheta2) * 180) / Math.PI

  const rs = (n1 * cosTheta1 - n2 * cosTheta2) / (n1 * cosTheta1 + n2 * cosTheta2)
  const rp = (n2 * cosTheta1 - n1 * cosTheta2) / (n2 * cosTheta1 + n1 * cosTheta2)

  return {
    Rs: rs * rs,
    Rp: rp * rp,
    totalReflection: false,
    theta2,
  }
}

// 色散曲线图组件 - 显示折射率随波长变化
function DispersionCurve({
  material,
  currentWavelength,
}: {
  material: MaterialData
  currentWavelength: number
}) {
  const curveData = useMemo(() => {
    const points: { x: number; y: number; wavelength: number; n: number }[] = []
    let minN = Infinity, maxN = -Infinity

    for (let wl = 380; wl <= 780; wl += 5) {
      const n = getMaterialIndex(material, wl)
      if (n < minN) minN = n
      if (n > maxN) maxN = n
      points.push({ wavelength: wl, n, x: 0, y: 0 })
    }

    // 添加一些padding
    const range = maxN - minN
    minN -= range * 0.1
    maxN += range * 0.1

    // 计算SVG坐标
    const width = 200, height = 80
    return points.map(p => ({
      ...p,
      x: 30 + ((p.wavelength - 380) / 400) * (width - 40),
      y: 10 + (1 - (p.n - minN) / (maxN - minN)) * (height - 20)
    }))
  }, [material])

  const currentN = getMaterialIndex(material, currentWavelength)
  const currentPoint = curveData.find(p => Math.abs(p.wavelength - currentWavelength) < 3)
  const rgb = wavelengthToRGB(currentWavelength)
  const currentColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

  // 构建路径
  const pathD = curveData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <defs>
        <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B00FF" />
          <stop offset="20%" stopColor="#0000FF" />
          <stop offset="35%" stopColor="#00FFFF" />
          <stop offset="50%" stopColor="#00FF00" />
          <stop offset="65%" stopColor="#FFFF00" />
          <stop offset="80%" stopColor="#FF7F00" />
          <stop offset="100%" stopColor="#FF0000" />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect x="30" y="10" width="160" height="60" fill="#1e293b" rx="3" />

      {/* 光谱背景条 */}
      <rect x="30" y="72" width="160" height="6" fill="url(#spectrumGradient)" rx="2" opacity="0.6" />

      {/* 曲线 */}
      <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2" />

      {/* 当前波长标记 */}
      {currentPoint && (
        <>
          <line
            x1={currentPoint.x}
            y1="10"
            x2={currentPoint.x}
            y2="70"
            stroke={currentColor}
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <motion.circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="5"
            fill={currentColor}
            stroke="#fff"
            strokeWidth="1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </>
      )}

      {/* 坐标轴标签 */}
      <text x="15" y="45" fill="#94a3b8" fontSize="8" textAnchor="middle" transform="rotate(-90, 15, 45)">n(λ)</text>
      <text x="30" y="80" fill="#94a3b8" fontSize="7">380</text>
      <text x="185" y="80" fill="#94a3b8" fontSize="7">780nm</text>
      <text x="110" y="8" fill="#94a3b8" fontSize="8" textAnchor="middle">n = {currentN.toFixed(4)}</text>
    </svg>
  )
}

// 布儒斯特角随波长变化曲线
function BrewsterWavelengthCurve({
  material,
  currentWavelength,
}: {
  material: MaterialData
  currentWavelength: number
}) {
  const curveData = useMemo(() => {
    const points: { x: number; y: number; wavelength: number; brewster: number }[] = []

    for (let wl = 380; wl <= 780; wl += 5) {
      const n = getMaterialIndex(material, wl)
      const brewster = Math.atan(n) * 180 / Math.PI
      const x = 30 + ((wl - 380) / 400) * 160
      const y = 65 - ((brewster - 50) / 25) * 50 // 假设布儒斯特角在50°-75°范围
      points.push({ wavelength: wl, brewster, x, y })
    }
    return points
  }, [material])

  const currentN = getMaterialIndex(material, currentWavelength)
  const currentBrewster = Math.atan(currentN) * 180 / Math.PI
  const currentPoint = curveData.find(p => Math.abs(p.wavelength - currentWavelength) < 3)
  const rgb = wavelengthToRGB(currentWavelength)
  const currentColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

  const pathD = curveData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <rect x="30" y="10" width="160" height="60" fill="#1e293b" rx="3" />

      {/* 曲线 */}
      <path d={pathD} fill="none" stroke="#f472b6" strokeWidth="2" />

      {/* 当前波长标记 */}
      {currentPoint && (
        <>
          <line
            x1={currentPoint.x}
            y1="10"
            x2={currentPoint.x}
            y2="70"
            stroke={currentColor}
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <motion.circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="5"
            fill={currentColor}
            stroke="#fff"
            strokeWidth="1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </>
      )}

      {/* 坐标轴标签 */}
      <text x="15" y="45" fill="#94a3b8" fontSize="8" textAnchor="middle" transform="rotate(-90, 15, 45)">θB</text>
      <text x="30" y="80" fill="#94a3b8" fontSize="7">380</text>
      <text x="185" y="80" fill="#94a3b8" fontSize="7">780nm</text>
      <text x="110" y="8" fill="#f472b6" fontSize="8" textAnchor="middle">θB = {currentBrewster.toFixed(2)}°</text>
    </svg>
  )
}

// 偏振指示器组件
function PolarizationIndicator({
  type,
  x,
  y,
  size = 20,
  color,
}: {
  type: 'unpolarized' | 's' | 'p' | 'partial'
  x: number
  y: number
  size?: number
  color: string
}) {
  if (type === 'unpolarized') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={size / 2} fill="none" stroke={color} strokeWidth="2" />
        <line x1={-size / 2 + 3} y1="0" x2={size / 2 - 3} y2="0" stroke={color} strokeWidth="2" />
        <line x1="0" y1={-size / 2 + 3} x2="0" y2={size / 2 - 3} stroke={color} strokeWidth="2" />
      </g>
    )
  }

  if (type === 's') {
    // s偏振 - 垂直于入射面（点/圆）
    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={size / 4} fill={color} />
        <circle r={size / 2} fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </g>
    )
  }

  if (type === 'p') {
    // p偏振 - 平行于入射面（双箭头线）
    return (
      <g transform={`translate(${x}, ${y})`}>
        <line x1={-size / 2} y1="0" x2={size / 2} y2="0" stroke={color} strokeWidth="2.5" />
        <polygon points={`${-size / 2 - 4},0 ${-size / 2 + 2},-3 ${-size / 2 + 2},3`} fill={color} />
        <polygon points={`${size / 2 + 4},0 ${size / 2 - 2},-3 ${size / 2 - 2},3`} fill={color} />
      </g>
    )
  }

  // partial - 部分偏振
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse rx={size / 2} ry={size / 3} fill="none" stroke={color} strokeWidth="2" />
    </g>
  )
}

// 布儒斯特角SVG图示
function BrewsterDiagram({
  incidentAngle,
  n1,
  n2,
  labels,
}: {
  incidentAngle: number
  n1: number
  n2: number
  labels: {
    air: string
    medium: string
    normal: string
    naturalLight: string
    fullSPol: string
    partialPol: string
    richPPol: string
    refractedLight: string
    polarizationStates: string
    sPol: string
    pPol: string
    brewsterAngle: string
  }
}) {
  const result = calculateBrewster(incidentAngle, n1, n2)
  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI
  const isAtBrewster = Math.abs(incidentAngle - brewsterAngle) < 1.5

  const rad = (incidentAngle * Math.PI) / 180
  const refractRad = (result.theta2 * Math.PI) / 180

  // 坐标中心
  const cx = 300
  const cy = 200
  const rayLength = 150

  // 入射光起点
  const incidentStart = {
    x: cx - rayLength * Math.sin(rad),
    y: cy - rayLength * Math.cos(rad),
  }

  // 反射光终点
  const reflectEnd = {
    x: cx + rayLength * Math.sin(rad),
    y: cy - rayLength * Math.cos(rad),
  }

  // 折射光终点
  const refractEnd = {
    x: cx + rayLength * Math.sin(refractRad),
    y: cy + rayLength * Math.cos(refractRad),
  }

  // 判断偏振状态
  const getPolarizationType = () => {
    if (isAtBrewster) return 's'
    if (result.Rs > 0.9) return 's'
    return 'partial'
  }

  return (
    <svg viewBox="0 0 600 400" className="w-full h-auto">
      <defs>
        <linearGradient id="airGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e5f5f" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0f4c4c" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glowYellow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 空气层 */}
      <rect x="30" y="20" width="540" height="180" fill="url(#airGradient)" rx="8" />
      <text x="60" y="50" fill="#60a5fa" fontSize="13">{labels.air} n₁ = {n1.toFixed(2)}</text>

      {/* 玻璃/介质层 */}
      <rect x="30" y="200" width="540" height="180" fill="url(#glassGradient)" rx="8" />
      <text x="60" y="360" fill="#2dd4bf" fontSize="13">{labels.medium} n₂ = {n2.toFixed(2)}</text>

      {/* 界面 */}
      <line x1="30" y1="200" x2="570" y2="200" stroke="#67e8f9" strokeWidth="2" />

      {/* 法线 */}
      <line x1={cx} y1="30" x2={cx} y2="370" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
      <text x={cx + 8} y="45" fill="#94a3b8" fontSize="11">{labels.normal}</text>

      {/* 光源 */}
      <motion.circle
        cx={incidentStart.x}
        cy={incidentStart.y}
        r="12"
        fill="#fbbf24"
        filter="url(#glowYellow)"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 入射光 */}
      <motion.line
        x1={incidentStart.x}
        y1={incidentStart.y}
        x2={cx}
        y2={cy}
        stroke="#fbbf24"
        strokeWidth="4"
        filter="url(#glowYellow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* 入射偏振状态 - 自然光 */}
      <PolarizationIndicator
        type="unpolarized"
        x={(incidentStart.x + cx) / 2 - 25}
        y={(incidentStart.y + cy) / 2}
        color="#fbbf24"
      />
      <text x={incidentStart.x - 60} y={incidentStart.y - 5} fill="#fbbf24" fontSize="12" fontWeight="500">
        {labels.naturalLight}
      </text>

      {/* 反射光 */}
      <motion.line
        x1={cx}
        y1={cy}
        x2={reflectEnd.x}
        y2={reflectEnd.y}
        stroke={isAtBrewster ? '#22d3ee' : '#94a3b8'}
        strokeWidth={Math.max(1, 4 * (result.Rs + result.Rp) / 2)}
        strokeOpacity={Math.max(0.3, (result.Rs + result.Rp) / 2)}
        filter={isAtBrewster ? 'url(#glowCyan)' : undefined}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      {/* 反射偏振状态 */}
      <PolarizationIndicator
        type={getPolarizationType()}
        x={(cx + reflectEnd.x) / 2 + 25}
        y={(cy + reflectEnd.y) / 2}
        color={isAtBrewster ? '#22d3ee' : '#94a3b8'}
      />
      <text
        x={reflectEnd.x + 15}
        y={reflectEnd.y - 10}
        fill={isAtBrewster ? '#22d3ee' : '#94a3b8'}
        fontSize="12"
        fontWeight="500"
      >
        {isAtBrewster ? labels.fullSPol : labels.partialPol}
      </text>

      {/* 折射光 */}
      {!result.totalReflection && (
        <>
          <motion.line
            x1={cx}
            y1={cy}
            x2={refractEnd.x}
            y2={refractEnd.y}
            stroke="#4ade80"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          />
          {/* 折射偏振状态 - 在布儒斯特角时为p偏振 */}
          <PolarizationIndicator
            type={isAtBrewster ? 'p' : 'partial'}
            x={(cx + refractEnd.x) / 2 + 25}
            y={(cy + refractEnd.y) / 2}
            color={isAtBrewster ? '#f472b6' : '#4ade80'}
          />
          <text
            x={refractEnd.x + 15}
            y={refractEnd.y + 20}
            fill={isAtBrewster ? '#f472b6' : '#4ade80'}
            fontSize="12"
            fontWeight="500"
          >
            {isAtBrewster ? labels.richPPol : labels.refractedLight}
          </text>
        </>
      )}

      {/* 入射角弧线 */}
      <path
        d={`M ${cx} ${cy - 50} A 50 50 0 0 0 ${cx - 50 * Math.sin(rad)} ${cy - 50 * Math.cos(rad)}`}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <text x={cx - 70} y={cy - 55} fill="#fbbf24" fontSize="13" fontWeight="500">
        θ = {incidentAngle}°
      </text>

      {/* 折射角弧线 */}
      {!result.totalReflection && (
        <>
          <path
            d={`M ${cx} ${cy + 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(refractRad)} ${cy + 40 * Math.cos(refractRad)}`}
            fill="none"
            stroke="#4ade80"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text x={cx + 50} y={cy + 60} fill="#4ade80" fontSize="12">
            θ₂ = {result.theta2.toFixed(1)}°
          </text>
        </>
      )}

      {/* 布儒斯特角标注 */}
      {isAtBrewster && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <rect x={cx - 80} y="8" width="160" height="30" rx="6" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="1" />
          <text x={cx} y="28" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="bold">
            {labels.brewsterAngle} θB = {brewsterAngle.toFixed(1)}°
          </text>
        </motion.g>
      )}

      {/* 90度标记 - 反射光与折射光垂直 */}
      {isAtBrewster && !result.totalReflection && (
        <g>
          <path
            d={`M ${cx + 20 * Math.sin(rad)} ${cy - 20 * Math.cos(rad)}
                L ${cx + 20 * Math.sin(rad) + 15 * Math.sin(refractRad)} ${cy - 20 * Math.cos(rad) + 15 * Math.cos(refractRad)}
                L ${cx + 15 * Math.sin(refractRad)} ${cy + 15 * Math.cos(refractRad)}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <text x={cx + 35} y={cy + 10} fill="#fbbf24" fontSize="11">90°</text>
        </g>
      )}

      {/* 图例 */}
      <g transform="translate(450, 30)">
        <rect x="0" y="0" width="110" height="90" fill="rgba(30,41,59,0.9)" rx="6" stroke="#475569" strokeWidth="1" />
        <text x="10" y="18" fill="#94a3b8" fontSize="10">{labels.polarizationStates}</text>
        <PolarizationIndicator type="unpolarized" x={25} y={35} size={16} color="#fbbf24" />
        <text x="45" y="39" fill="#fbbf24" fontSize="10">{labels.naturalLight}</text>
        <PolarizationIndicator type="s" x={25} y={55} size={16} color="#22d3ee" />
        <text x="45" y="59" fill="#22d3ee" fontSize="10">{labels.sPol}</text>
        <PolarizationIndicator type="p" x={25} y={75} size={16} color="#f472b6" />
        <text x="45" y="79" fill="#f472b6" fontSize="10">{labels.pPol}</text>
      </g>
    </svg>
  )
}

// 偏振度曲线图
function PolarizationDegreeChart({
  n1,
  n2,
  currentAngle,
}: {
  n1: number
  n2: number
  currentAngle: number
}) {
  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI

  const { pdPath, rsPath, rpPath } = useMemo(() => {
    const pdPoints: string[] = []
    const rsPoints: string[] = []
    const rpPoints: string[] = []

    for (let angle = 1; angle <= 89; angle += 1) {
      const result = calculateBrewster(angle, n1, n2)
      if (result.totalReflection) continue

      const pd = Math.abs(result.Rs - result.Rp) / (result.Rs + result.Rp + 0.001)
      const x = 40 + (angle / 90) * 220
      const yPd = 130 - pd * 100
      const yRs = 130 - result.Rs * 100
      const yRp = 130 - result.Rp * 100

      pdPoints.push(`${angle === 1 ? 'M' : 'L'} ${x},${yPd}`)
      rsPoints.push(`${angle === 1 ? 'M' : 'L'} ${x},${yRs}`)
      rpPoints.push(`${angle === 1 ? 'M' : 'L'} ${x},${yRp}`)
    }

    return {
      pdPath: pdPoints.join(' '),
      rsPath: rsPoints.join(' '),
      rpPath: rpPoints.join(' '),
    }
  }, [n1, n2])

  const currentResult = calculateBrewster(currentAngle, n1, n2)
  const currentPD = Math.abs(currentResult.Rs - currentResult.Rp) / (currentResult.Rs + currentResult.Rp + 0.001)
  const currentX = 40 + (currentAngle / 90) * 220
  const currentY = 130 - currentPD * 100

  return (
    <svg viewBox="0 0 300 160" className="w-full h-auto">
      <rect x="40" y="30" width="220" height="100" fill="#1e293b" rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="130" x2="270" y2="130" stroke="#475569" strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke="#475569" strokeWidth="1" />

      {/* X轴刻度 */}
      {[0, 45, 90].map((angle) => {
        const x = 40 + (angle / 90) * 220
        return (
          <g key={angle}>
            <line x1={x} y1="130" x2={x} y2="135" stroke="#94a3b8" strokeWidth="1" />
            <text x={x} y="147" textAnchor="middle" fill="#94a3b8" fontSize="10">{angle}°</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.5, 1].map((val, i) => {
        const y = 130 - val * 100
        return (
          <g key={i}>
            <text x="30" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">{(val * 100).toFixed(0)}%</text>
          </g>
        )
      })}

      {/* 布儒斯特角标记 */}
      <line
        x1={40 + (brewsterAngle / 90) * 220}
        y1="30"
        x2={40 + (brewsterAngle / 90) * 220}
        y2="130"
        stroke="#22d3ee"
        strokeWidth="1.5"
        strokeDasharray="5 3"
      />
      <text
        x={40 + (brewsterAngle / 90) * 220}
        y="25"
        textAnchor="middle"
        fill="#22d3ee"
        fontSize="9"
        fontWeight="500"
      >
        θB
      </text>

      {/* Rs曲线 */}
      <path d={rsPath} fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" />

      {/* Rp曲线 */}
      <path d={rpPath} fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.5" />

      {/* 偏振度曲线 */}
      <path d={pdPath} fill="none" stroke="#a78bfa" strokeWidth="2.5" />

      {/* 当前点 */}
      <motion.circle
        cx={currentX}
        cy={currentY}
        r="6"
        fill="#a78bfa"
        animate={{ cx: currentX, cy: currentY }}
        transition={{ duration: 0.2 }}
      />

      {/* 轴标签 */}
      <text x="155" y="158" textAnchor="middle" fill="#94a3b8" fontSize="11">θ</text>
    </svg>
  )
}

// 主演示组件
export function BrewsterDemo() {
  const { t } = useTranslation()
  const [incidentAngle, setIncidentAngle] = useState(56)
  const [wavelength, setWavelength] = useState(550) // 绿光默认
  const [showDispersion, setShowDispersion] = useState(true)
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0)
  const n1 = 1.0 // 空气

  // 获取当前材料
  const currentMaterial = DISPERSIVE_MATERIALS[selectedMaterialIndex]

  // 计算当前波长下的折射率
  const n2 = showDispersion
    ? getMaterialIndex(currentMaterial, wavelength)
    : getMaterialIndex(currentMaterial, 550) // 固定在550nm

  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI
  const result = calculateBrewster(incidentAngle, n1, n2)
  const isAtBrewster = Math.abs(incidentAngle - brewsterAngle) < 1.5
  const polarizationDegree = Math.abs(result.Rs - result.Rp) / (result.Rs + result.Rp + 0.001)

  // 计算色散范围（红光到蓝光的布儒斯特角变化）
  const dispersionRange = useMemo(() => {
    const nRed = getMaterialIndex(currentMaterial, 700)
    const nBlue = getMaterialIndex(currentMaterial, 450)
    const brewsterRed = Math.atan(nRed) * 180 / Math.PI
    const brewsterBlue = Math.atan(nBlue) * 180 / Math.PI
    return Math.abs(brewsterBlue - brewsterRed)
  }, [currentMaterial])

  // 图表标签翻译
  const diagramLabels = {
    air: t('demoUi.brewster.air'),
    medium: t('demoUi.brewster.medium'),
    normal: t('demoUi.brewster.normal'),
    naturalLight: t('demoUi.brewster.naturalLight'),
    fullSPol: t('demoUi.brewster.fullSPol'),
    partialPol: t('demoUi.brewster.partialPol'),
    richPPol: t('demoUi.brewster.richPPol'),
    refractedLight: t('demoUi.brewster.refractedLight'),
    polarizationStates: t('demoUi.brewster.polarizationStates'),
    sPol: t('demoUi.brewster.sPol'),
    pPol: t('demoUi.brewster.pPol'),
    brewsterAngle: t('demoUi.brewster.brewsterTitle'),
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          {t('demoUi.brewster.title')}
        </h2>
        <p className="text-gray-400 mt-1">
          {t('demoUi.brewster.subtitle')}
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-cyan-950/90 border border-cyan-500/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <BrewsterDiagram incidentAngle={incidentAngle} n1={n1} n2={n2} labels={diagramLabels} />
          </div>

          {/* 状态指示 */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-600/30 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{t('demoUi.brewster.currentIncidentAngle')}</span>
                  <span className="font-mono text-lg text-orange-400">{incidentAngle}°</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{t('demoUi.brewster.brewsterAngle')}</span>
                  <span className="font-mono text-lg text-cyan-400">{brewsterAngle.toFixed(1)}°</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${isAtBrewster ? 'text-green-400' : 'text-gray-500'}`}>
                  {isAtBrewster ? t('demoUi.brewster.match') : `${t('demoUi.brewster.difference')} ${Math.abs(incidentAngle - brewsterAngle).toFixed(1)}°`}
                </div>
                <div className="text-sm text-gray-500">
                  {t('demoUi.brewster.polarizationDegree')} <span className="text-purple-400 font-mono">{(polarizationDegree * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mt-4">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: isAtBrewster
                      ? 'linear-gradient(90deg, #22d3ee, #4ade80)'
                      : 'linear-gradient(90deg, #94a3b8, #64748b)',
                  }}
                  animate={{ width: `${polarizationDegree * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 参数控制 */}
          <ControlPanel title={t('demoUi.common.controlPanel')}>
            <SliderControl
              label={t('demoUi.brewster.incidentAngle')}
              value={incidentAngle}
              min={0}
              max={89}
              step={1}
              unit="°"
              onChange={setIncidentAngle}
              color="orange"
            />

            {/* 色散模式开关 */}
            <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
              <span className="text-xs text-gray-400">{t('demoUi.brewster.dispersionMode')}</span>
              <Toggle
                label=""
                checked={showDispersion}
                onChange={setShowDispersion}
              />
            </div>

            {/* 波长滑块 - 仅在色散模式下显示 */}
            {showDispersion && (
              <div className="space-y-2">
                <SliderControl
                  label={t('demoUi.brewster.wavelength')}
                  value={wavelength}
                  min={380}
                  max={780}
                  step={5}
                  unit=" nm"
                  onChange={setWavelength}
                  color="purple"
                  formatValue={(v) => `${v} nm`}
                />
                {/* 光谱色带 */}
                <div
                  className="h-3 rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #8B00FF, #0000FF, #00FFFF, #00FF00, #FFFF00, #FF7F00, #FF0000)'
                  }}
                />
              </div>
            )}

            {/* 材料选择器 */}
            <div className="pt-2 border-t border-slate-700/50">
              <div className="text-xs text-gray-500 mb-2">{t('demoUi.brewster.selectMaterial')}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {DISPERSIVE_MATERIALS.map((m, index) => {
                  const matN = getMaterialIndex(m, 550)
                  const matBrewster = Math.atan(matN) * 180 / Math.PI
                  const isSelected = index === selectedMaterialIndex
                  return (
                    <button
                      key={m.nameKey}
                      onClick={() => {
                        setSelectedMaterialIndex(index)
                        setIncidentAngle(Math.round(matBrewster))
                      }}
                      className={`px-2 py-1.5 text-xs rounded transition-all ${
                        isSelected
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                          : 'bg-slate-700/50 text-gray-400 border border-transparent hover:bg-slate-600'
                      }`}
                    >
                      {t(m.nameKey).replace('demoUi.brewster.', '')}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 显示当前折射率 */}
            <div className="mt-2 p-2 bg-slate-900/50 rounded-lg">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">n({wavelength}nm)</span>
                <span className="text-cyan-400 font-mono">{n2.toFixed(4)}</span>
              </div>
              {showDispersion && (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">{t('demoUi.brewster.dispersionRange')}</span>
                  <span className="text-purple-400 font-mono">{dispersionRange.toFixed(2)}°</span>
                </div>
              )}
            </div>

            {/* 跳转按钮 */}
            <motion.button
              className="w-full py-2.5 mt-3 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIncidentAngle(Math.round(brewsterAngle))}
            >
              {t('demoUi.brewster.jumpToBrewster')}
            </motion.button>
          </ControlPanel>

          {/* 计算结果 */}
          <ControlPanel title={t('demoUi.common.calculationResult')}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs">{t('demoUi.brewster.sPolReflectance')}</div>
                <div className="text-cyan-400 font-mono text-lg">{(result.Rs * 100).toFixed(1)}%</div>
              </div>
              <div className="p-2 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs">{t('demoUi.brewster.pPolReflectance')}</div>
                <div className={`font-mono text-lg ${result.Rp < 0.01 ? 'text-green-400' : 'text-pink-400'}`}>
                  {(result.Rp * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs">{t('demoUi.brewster.refractionAngle')}</div>
                <div className="text-green-400 font-mono text-lg">{result.theta2.toFixed(1)}°</div>
              </div>
              <div className="p-2 bg-slate-900/50 rounded-lg">
                <div className="text-gray-500 text-xs">θ₁ + θ₂</div>
                <div className={`font-mono text-lg ${Math.abs(incidentAngle + result.theta2 - 90) < 1.5 ? 'text-green-400' : 'text-gray-400'}`}>
                  {(incidentAngle + result.theta2).toFixed(1)}°
                </div>
              </div>
            </div>

            {/* 公式 */}
            <div className="mt-3 p-3 bg-slate-900/50 rounded-lg text-center">
              <span className="font-mono text-lg bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                tan(θB) = n₂/n₁ = {n2.toFixed(2)}/{n1.toFixed(2)} = {(n2/n1).toFixed(3)}
              </span>
            </div>
          </ControlPanel>

          {/* 偏振度曲线 */}
          <ControlPanel title={t('demoUi.brewster.reflectedPolDegree')}>
            <PolarizationDegreeChart n1={n1} n2={n2} currentAngle={incidentAngle} />
            <p className="text-xs text-gray-400 mt-2">
              {t('demoUi.brewster.chartDesc')}
            </p>
          </ControlPanel>

          {/* 色散曲线 - 仅在色散模式下显示 */}
          {showDispersion && (
            <div className="grid grid-cols-2 gap-3">
              <ControlPanel title={t('demoUi.brewster.dispersionCurve')}>
                <DispersionCurve material={currentMaterial} currentWavelength={wavelength} />
                <p className="text-xs text-gray-500 mt-1">
                  {currentMaterial.type === 'sellmeier' ? 'Sellmeier' : 'Cauchy'}
                </p>
              </ControlPanel>
              <ControlPanel title={t('demoUi.brewster.brewsterDispersion')}>
                <BrewsterWavelengthCurve material={currentMaterial} currentWavelength={wavelength} />
                <p className="text-xs text-gray-500 mt-1">
                  θB = arctan(n)
                </p>
              </ControlPanel>
            </div>
          )}
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard title={t('demoUi.brewster.brewsterTitle')} color="cyan">
          <p className="text-xs text-gray-300">
            {t('demoUi.brewster.brewsterDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.brewster.physicalExplanation')} color="purple">
          <p className="text-xs text-gray-300">
            {t('demoUi.brewster.physicalDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.brewster.dispersionTitle')} color="green">
          <p className="text-xs text-gray-300">
            {t('demoUi.brewster.dispersionDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.brewster.applicationsTitle')} color="orange">
          <ul className="text-xs text-gray-300 space-y-1">
            {(t('demoUi.brewster.applicationsList', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
