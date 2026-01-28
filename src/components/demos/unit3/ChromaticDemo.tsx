/**
 * 色偏振演示 - Unit 3
 * 演示双折射材料中白光的彩色干涉效应
 * 采用纯DOM + SVG + Framer Motion一体化设计
 *
 * Enhanced with SpectralJonesSolver for physically accurate
 * wavelength-dependent chromatic polarization calculations.
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  analyzeSpectrum,
  MATERIAL_BIREFRINGENCE,
  MATERIAL_THICKNESS,
} from '@/core/physics/SpectralJonesSolver'

// 波长到RGB颜色转换
function wavelengthToRGB(wavelength: number): [number, number, number] {
  let R = 0, G = 0, B = 0

  if (wavelength >= 380 && wavelength < 440) {
    R = -(wavelength - 440) / (440 - 380)
    G = 0
    B = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    R = 0
    G = (wavelength - 440) / (490 - 440)
    B = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    R = 0
    G = 1
    B = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    R = (wavelength - 510) / (580 - 510)
    G = 1
    B = 0
  } else if (wavelength >= 580 && wavelength < 645) {
    R = 1
    G = -(wavelength - 645) / (645 - 580)
    B = 0
  } else if (wavelength >= 645 && wavelength <= 780) {
    R = 1
    G = 0
    B = 0
  }

  // 边缘衰减
  let factor = 1
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380)
  } else if (wavelength >= 700 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700)
  }

  return [R * factor, G * factor, B * factor]
}

// 计算透过强度（考虑相位延迟）
// 基于正交偏振片间双折射样品的透过率公式
function calculateTransmission(
  wavelength: number,
  thickness: number,
  birefringence: number,
  polarizerAngle: number,
  analyzerAngle: number
): number {
  // 相位延迟 δ = 2π × Δn × d / λ
  // thickness is in mm, wavelength is in nm, so multiply by 1e6 to convert mm to nm
  const delta = (2 * Math.PI * birefringence * thickness * 1e6) / wavelength

  // 偏振片角度转换为弧度
  const thetaP = (polarizerAngle * Math.PI) / 180 // 起偏器角度
  const thetaA = (analyzerAngle * Math.PI) / 180 // 检偏器角度

  // 假设样品光轴在0°方向（水平）
  // 使用完整的琼斯矩阵计算或等效的透过率公式
  // T = cos²(θP - θA) - sin(2θP) × sin(2θA) × sin²(δ/2)
  // 但当样品光轴在45°时，公式变为：
  // T = cos²(θP - θA) - sin(2(θP - 45°)) × sin(2(θA - 45°)) × sin²(δ/2)

  // 更准确的公式：对于正交偏振片 (θA = θP + 90°)，样品光轴在45°
  // T = sin²(2×45°) × sin²(δ/2) = sin²(δ/2)
  // 对于平行偏振片 (θA = θP)
  // T = 1 - sin²(2×45°) × sin²(δ/2) = cos²(δ/2)

  // 通用公式（样品光轴固定在45°方向）
  const beta = Math.PI / 4 // 样品光轴角度 (45°)
  const sinSquaredDeltaHalf = Math.pow(Math.sin(delta / 2), 2)

  // Malus定律 + 干涉项
  const cosAngleDiff = Math.cos(thetaA - thetaP)
  const sin2ThetaPBeta = Math.sin(2 * (thetaP - beta))
  const sin2ThetaABeta = Math.sin(2 * (thetaA - beta))

  const transmission =
    Math.pow(cosAngleDiff, 2) -
    sin2ThetaPBeta * sin2ThetaABeta * sinSquaredDeltaHalf

  return Math.max(0, Math.min(1, transmission))
}

// 计算白光参考值（用于正确归一化颜色）
// 预计算所有波长传输率为1时的RGB积分值
function getWhiteReference(): { r: number; g: number; b: number } {
  let totalR = 0, totalG = 0, totalB = 0

  for (let wavelength = 380; wavelength <= 780; wavelength += 2) {
    const [r, g, b] = wavelengthToRGB(wavelength)
    totalR += r
    totalG += g
    totalB += b
  }

  return { r: totalR, g: totalG, b: totalB }
}

// 缓存白光参考值（避免重复计算）
const WHITE_REFERENCE = getWhiteReference()

// 计算混合颜色 - 基于Michel-Lévy色表原理
function calculateMixedColor(
  thickness: number,
  birefringence: number,
  polarizerAngle: number,
  analyzerAngle: number
): { r: number; g: number; b: number; hex: string } {
  let totalR = 0, totalG = 0, totalB = 0

  // 使用人眼光谱响应权重（近似CIE标准观察者）
  // 对可见光谱积分，步长更细以提高精度
  for (let wavelength = 380; wavelength <= 780; wavelength += 2) {
    const transmission = calculateTransmission(
      wavelength,
      thickness,
      birefringence,
      polarizerAngle,
      analyzerAngle
    )
    const [r, g, b] = wavelengthToRGB(wavelength)

    // 假设白光源为等能光谱（可以改为D65标准光源）
    totalR += r * transmission
    totalG += g * transmission
    totalB += b * transmission
  }

  // 计算总透过光能量（用于判断亮度）
  const totalEnergy = totalR + totalG + totalB

  if (totalEnergy < 0.001) {
    return { r: 0, g: 0, b: 0, hex: '#000000' }
  }

  // 使用白光参考值进行正确归一化
  // 将每个通道除以其白光参考值，使得全透过时为白色
  let r = totalR / WHITE_REFERENCE.r
  let g = totalG / WHITE_REFERENCE.g
  let b = totalB / WHITE_REFERENCE.b

  // 计算亮度
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  // 对于低透过率情况，提升亮度同时保持色调比例
  // 这样可以在保持干涉色正确的同时提高可见度
  if (luminance > 0.01 && luminance < 0.5) {
    // 亮度提升因子，保持色调比例
    const boostFactor = Math.min(0.7 / luminance, 2.0)
    r *= boostFactor
    g *= boostFactor
    b *= boostFactor
  }

  // 轻微增强饱和度，使颜色更鲜明
  const maxVal = Math.max(r, g, b)
  if (maxVal > 0.1 && maxVal < 1.5) {
    const avgBrightness = (r + g + b) / 3
    const saturationBoost = 1.2
    r = avgBrightness + (r - avgBrightness) * saturationBoost
    g = avgBrightness + (g - avgBrightness) * saturationBoost
    b = avgBrightness + (b - avgBrightness) * saturationBoost
  }

  // 限制在有效范围内
  r = Math.max(0, Math.min(1, r))
  g = Math.max(0, Math.min(1, g))
  b = Math.max(0, Math.min(1, b))

  const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`

  return { r, g, b, hex }
}

// 光路示意图
function OpticalPathDiagram({
  thickness,
  birefringence,
  polarizerAngle,
  analyzerAngle,
  resultColor,
  theme,
}: {
  thickness: number
  birefringence: number
  polarizerAngle: number
  analyzerAngle: number
  resultColor: string
  theme: 'dark' | 'light'
}) {
  return (
    <svg viewBox="0 0 700 280" className="w-full h-auto max-h-[320px]">
      <defs>
        <linearGradient id="whiteLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="17%" stopColor="#f97316" />
          <stop offset="33%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="67%" stopColor="#06b6d4" />
          <stop offset="83%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glowWhite" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowResult" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect x="0" y="0" width="700" height="280" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} rx="8" />

      {/* 白光光源 */}
      <g transform="translate(50, 140)">
        <motion.circle
          r="25"
          fill="url(#whiteLight)"
          filter="url(#glowWhite)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="0" y="50" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="12">白光源</text>
      </g>

      {/* 入射光束（彩虹色） */}
      <rect x="75" y="133" width="60" height="14" fill="url(#whiteLight)" opacity="0.8" />

      {/* 起偏器 */}
      <g transform="translate(145, 140)">
        <rect x="-8" y="-45" width="16" height="90" fill={theme === 'dark' ? '#1e3a5f' : '#e0f2fe'} stroke="#22d3ee" strokeWidth="2" rx="3" />
        <motion.line
          x1="0"
          y1="-35"
          x2="0"
          y2="35"
          stroke="#22d3ee"
          strokeWidth="3"
          transform={`rotate(${polarizerAngle})`}
        />
        <text x="0" y="65" textAnchor="middle" fill="#22d3ee" fontSize="11">起偏器</text>
        <text x="0" y="78" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">{polarizerAngle}°</text>
      </g>

      {/* 偏振光束（单色） */}
      <rect x="161" y="136" width="80" height="8" fill="#22d3ee" opacity="0.7" />

      {/* 双折射样品 */}
      <g transform="translate(280, 140)">
        <rect
          x="-40"
          y="-50"
          width={80 + thickness * 80}
          height="100"
          fill="rgba(168, 216, 234, 0.3)"
          stroke="#67e8f9"
          strokeWidth="2"
          rx="5"
        />
        {/* 光轴指示 */}
        <line x1="-30" y1="-40" x2={40 + thickness * 80} y2="-40" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={(thickness * 80) / 2} y="-25" textAnchor="middle" fill="#a78bfa" fontSize="9">快轴</text>
        <text x={(thickness * 80) / 2} y="70" textAnchor="middle" fill="#67e8f9" fontSize="11">双折射样品</text>
        <text x={(thickness * 80) / 2} y="85" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">
          d={thickness.toFixed(2)}mm, Δn={birefringence.toFixed(3)}
        </text>
      </g>

      {/* 样品内光分离 */}
      <g transform={`translate(${250}, 140)`}>
        <line x1="0" y1="0" x2={50 + thickness * 40} y2="-12" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
        <line x1="0" y1="0" x2={50 + thickness * 40} y2="12" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
        <text x={60 + thickness * 40} y="-15" fill="#ef4444" fontSize="9">o光</text>
        <text x={60 + thickness * 40} y="18" fill="#22c55e" fontSize="9">e光</text>
      </g>

      {/* 出射光束（颜色变化） */}
      <rect x={330 + thickness * 80} y="136" width="80" height="8" fill={resultColor} opacity="0.7" />

      {/* 检偏器 */}
      <g transform={`translate(${420 + thickness * 80}, 140)`}>
        <rect x="-8" y="-45" width="16" height="90" fill={theme === 'dark' ? '#1e3a5f' : '#ede9fe'} stroke="#a78bfa" strokeWidth="2" rx="3" />
        <motion.line
          x1="0"
          y1="-35"
          x2="0"
          y2="35"
          stroke="#a78bfa"
          strokeWidth="3"
          transform={`rotate(${analyzerAngle})`}
        />
        <text x="0" y="65" textAnchor="middle" fill="#a78bfa" fontSize="11">检偏器</text>
        <text x="0" y="78" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">{analyzerAngle}°</text>
      </g>

      {/* 最终光束 */}
      <rect x={436 + thickness * 80} y="136" width="80" height="8" fill={resultColor} />

      {/* 观察屏 */}
      <g transform={`translate(${570 + thickness * 50}, 140)`}>
        <motion.rect
          x="-30"
          y="-50"
          width="60"
          height="100"
          fill={resultColor}
          stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
          strokeWidth="2"
          rx="6"
          filter="url(#glowResult)"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="0" y="70" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="11">观察屏</text>
      </g>

      {/* 标注线 */}
      <path
        d="M 50 200 L 50 230 L 650 230 L 650 200"
        fill="none"
        stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      <text x="350" y="250" textAnchor="middle" fill={theme === 'dark' ? '#64748b' : '#475569'} fontSize="11">
        光路传播方向 →
      </text>
    </svg>
  )
}

// 光谱透过率图
function SpectrumChart({
  thickness,
  birefringence,
  polarizerAngle,
  analyzerAngle,
  theme,
}: {
  thickness: number
  birefringence: number
  polarizerAngle: number
  analyzerAngle: number
  theme: 'dark' | 'light'
}) {
  const { pathData, spectrumGradient } = useMemo(() => {
    const points: string[] = []

    for (let wavelength = 400; wavelength <= 700; wavelength += 3) {
      const transmission = calculateTransmission(
        wavelength,
        thickness,
        birefringence,
        polarizerAngle,
        analyzerAngle
      )
      const x = 40 + ((wavelength - 400) / 300) * 250
      const y = 130 - transmission * 100

      points.push(`${wavelength === 400 ? 'M' : 'L'} ${x},${y}`)
    }

    // 生成光谱渐变
    const stops: string[] = []
    for (let i = 0; i <= 10; i++) {
      const wavelength = 400 + (i / 10) * 300
      const [r, g, b] = wavelengthToRGB(wavelength)
      stops.push(`rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`)
    }

    return {
      pathData: points.join(' '),
      spectrumGradient: stops,
    }
  }, [thickness, birefringence, polarizerAngle, analyzerAngle])

  return (
    <svg viewBox="0 0 320 170" className="w-full h-auto">
      <defs>
        <linearGradient id="spectrumBg" x1="0%" y1="0%" x2="100%" y2="0%">
          {spectrumGradient.map((color, i) => (
            <stop key={i} offset={`${i * 10}%`} stopColor={color} stopOpacity="0.2" />
          ))}
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect x="40" y="30" width="250" height="100" fill="url(#spectrumBg)" rx="4" />

      {/* 坐标轴 */}
      <line x1="40" y1="130" x2="300" y2="130" stroke={theme === 'dark' ? '#475569' : '#94a3b8'} strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke={theme === 'dark' ? '#475569' : '#94a3b8'} strokeWidth="1" />

      {/* X轴刻度 */}
      {[400, 500, 600, 700].map((wl) => {
        const x = 40 + ((wl - 400) / 300) * 250
        const [r, g, b] = wavelengthToRGB(wl)
        return (
          <g key={wl}>
            <line x1={x} y1="130" x2={x} y2="135" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} strokeWidth="1" />
            <text x={x} y="148" textAnchor="middle" fill={`rgb(${r * 255}, ${g * 255}, ${b * 255})`} fontSize="10">
              {wl}
            </text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.5, 1].map((val, i) => {
        const y = 130 - val * 100
        return (
          <g key={i}>
            <text x="30" y={y + 4} textAnchor="end" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">{val}</text>
          </g>
        )
      })}

      {/* 透过率曲线 */}
      <path d={pathData} fill="none" stroke={theme === 'dark' ? '#ffffff' : '#1e293b'} strokeWidth="2.5" />

      {/* 轴标签 */}
      <text x="170" y="165" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="11">波长 (nm)</text>
      <text x="15" y="85" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10" transform="rotate(-90 15 85)">T</text>
    </svg>
  )
}

// 颜色显示面板
function ColorDisplayPanel({
  color,
  theme,
}: {
  color: { r: number; g: number; b: number; hex: string }
  theme: 'dark' | 'light'
}) {
  return (
    <div className="space-y-3">
      <div
        className={cn("w-full h-24 rounded-xl border-2 shadow-lg transition-colors duration-300", theme === 'dark' ? 'border-slate-600' : 'border-gray-300')}
        style={{
          backgroundColor: color.hex,
          boxShadow: `0 0 30px ${color.hex}40`,
        }}
      />
      <div className="flex justify-between items-center text-xs">
        <div className="space-y-1">
          <div className={cn(theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>RGB</div>
          <div className={cn("font-mono", theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            ({Math.round(color.r * 255)}, {Math.round(color.g * 255)}, {Math.round(color.b * 255)})
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div className={cn(theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>HEX</div>
          <div className={cn("font-mono uppercase", theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>{color.hex}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Virtual Tape Experiment - 虚拟胶带实验
// ============================================

/**
 * Tape material options with realistic properties
 */
const TAPE_MATERIALS = [
  {
    id: 'scotch',
    name: '透明胶带',
    nameEn: 'Scotch Tape',
    birefringence: MATERIAL_BIREFRINGENCE.SCOTCH_TAPE,
    thickness: MATERIAL_THICKNESS.SCOTCH_TAPE,
    description: '常见的透明封装胶带',
  },
  {
    id: 'cellophane',
    name: '玻璃纸',
    nameEn: 'Cellophane',
    birefringence: MATERIAL_BIREFRINGENCE.CELLOPHANE,
    thickness: MATERIAL_THICKNESS.CELLOPHANE,
    description: '包装用玻璃纸薄膜',
  },
  {
    id: 'stretched',
    name: '拉伸薄膜',
    nameEn: 'Stretched Film',
    birefringence: MATERIAL_BIREFRINGENCE.STRETCHED_FILM,
    thickness: MATERIAL_THICKNESS.PLASTIC_WRAP,
    description: '单向拉伸的塑料薄膜',
  },
] as const

/**
 * Virtual Tape Experiment Component
 *
 * Allows users to stack tape layers and observe interference colors
 * using physically accurate SpectralJonesSolver calculations.
 *
 * Scientific validation:
 * - 1 layer: Low order grey/white (OPD ≈ 450nm)
 * - 3-4 layers: Vivid first-order colors (pink, green)
 * - 6+ layers: Higher order, more pastel colors
 */
function VirtualTapeExperiment({ theme }: { theme: 'dark' | 'light' }) {
  const [layers, setLayers] = useState(1)
  const [materialId, setMaterialId] = useState<string>('scotch')
  const [crossedPolarizers, setCrossedPolarizers] = useState(true)
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Get current material properties
  const material = TAPE_MATERIALS.find(m => m.id === materialId) ?? TAPE_MATERIALS[0]

  // Calculate color using SpectralJonesSolver
  const { color, analysis } = useMemo(() => {
    const totalThickness = layers * material.thickness
    const polarizerAngle = 0
    const analyzerAngle = crossedPolarizers ? 90 : 0

    // Use the SpectralJonesSolver for accurate calculation
    const result = analyzeSpectrum({
      thickness: totalThickness,
      birefringence: material.birefringence,
      polarizerAngle,
      analyzerAngle,
      fastAxisAngle: 45,
    })

    return {
      color: result.color,
      analysis: result,
    }
  }, [layers, material, crossedPolarizers])

  // Generate tape stack visualization
  const tapeStackElements = useMemo(() => {
    const elements = []
    const maxVisibleLayers = Math.min(layers, 8)

    for (let i = 0; i < maxVisibleLayers; i++) {
      const yOffset = i * 6
      const opacity = 0.3 + (i / maxVisibleLayers) * 0.4
      elements.push(
        <motion.rect
          key={i}
          x={100 - i * 2}
          y={80 + yOffset}
          width={200 + i * 4}
          height={25}
          rx="3"
          fill="rgba(168, 216, 234, 0.4)"
          stroke="rgba(103, 232, 249, 0.6)"
          strokeWidth="1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity, y: 0 }}
          transition={{ delay: i * 0.05 }}
        />
      )
    }
    return elements
  }, [layers])

  return (
    <div className={cn(
      "rounded-xl border p-5 shadow-lg",
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900/90 via-indigo-950/90 to-slate-900/90 border-indigo-500/30'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-white border-indigo-200'
    )}>
      <div className="flex items-center gap-2 mb-4">
        <svg className={cn("w-5 h-5", theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <h3 className={cn("text-lg font-semibold", theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700')}>虚拟胶带实验</h3>
        <span className={cn("text-xs ml-2", theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>Virtual Tape Experiment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Visualization */}
        <div className="space-y-4">
          {/* Tape stack SVG */}
          <svg viewBox="0 0 400 220" className={cn("w-full h-auto rounded-lg", theme === 'dark' ? 'bg-slate-950/50' : 'bg-gray-100')}>
            <defs>
              <filter id="tapeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Polarizer */}
            <g transform="translate(30, 110)">
              <rect x="-10" y="-40" width="20" height="80" fill={theme === 'dark' ? '#1e3a5f' : '#e0f2fe'} stroke="#22d3ee" strokeWidth="2" rx="3" />
              <line x1="0" y1="-30" x2="0" y2="30" stroke="#22d3ee" strokeWidth="2" />
              <text x="0" y="55" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">起偏器</text>
            </g>

            {/* Light beam to tape */}
            <rect x="50" y="105" width="50" height="10" fill="#22d3ee" opacity="0.7" />

            {/* Tape layers */}
            <g transform="translate(0, 10)">
              {tapeStackElements}
              <text x="200" y={135 + Math.min(layers, 8) * 6} textAnchor="middle" fill={theme === 'dark' ? '#a5b4fc' : '#6366f1'} fontSize="11">
                {layers} 层 ({(layers * material.thickness).toFixed(0)} μm)
              </text>
            </g>

            {/* Light beam from tape */}
            <rect x="310" y="105" width="40" height="10" fill={color.hex} opacity="0.8" />

            {/* Analyzer */}
            <g transform="translate(370, 110)">
              <rect x="-10" y="-40" width="20" height="80" fill={theme === 'dark' ? '#1e3a5f' : '#ede9fe'} stroke="#a78bfa" strokeWidth="2" rx="3" />
              <line
                x1="0" y1="-30" x2="0" y2="30"
                stroke="#a78bfa" strokeWidth="2"
                transform={`rotate(${crossedPolarizers ? 90 : 0})`}
              />
              <text x="0" y="55" textAnchor="middle" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10">
                检偏器 {crossedPolarizers ? '⊥' : '∥'}
              </text>
            </g>
          </svg>

          {/* Result color display */}
          <div className="flex items-center gap-4">
            <motion.div
              className={cn("w-20 h-20 rounded-xl border-2 shadow-lg", theme === 'dark' ? 'border-slate-600' : 'border-gray-300')}
              style={{
                backgroundColor: color.hex,
                boxShadow: `0 0 25px ${color.hex}50`,
              }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex-1 space-y-1">
              <div className={cn("text-sm font-medium", theme === 'dark' ? 'text-white' : 'text-gray-800')}>干涉色</div>
              <div className={cn("font-mono text-xs", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{color.rgb}</div>
              <div className={cn("font-mono text-xs uppercase", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{color.hex}</div>
              <div className={cn("text-xs", theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')}>
                级次: {analysis.retardationOrder.toFixed(2)} λ
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-4">
          {/* Layer control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>胶带层数</span>
              <span className={cn("font-mono", theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')}>{layers}</span>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                className={cn(
                  "w-10 h-10 rounded-lg text-xl font-bold disabled:opacity-30",
                  theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-800'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLayers(Math.max(1, layers - 1))}
                disabled={layers <= 1}
              >
                −
              </motion.button>
              <input
                type="range"
                min="1"
                max="12"
                value={layers}
                onChange={(e) => setLayers(parseInt(e.target.value))}
                className={cn(
                  "flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500",
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
                )}
              />
              <motion.button
                className={cn(
                  "w-10 h-10 rounded-lg text-xl font-bold disabled:opacity-30",
                  theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-800'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLayers(Math.min(12, layers + 1))}
                disabled={layers >= 12}
              >
                +
              </motion.button>
            </div>
          </div>

          {/* Material selection */}
          <div className="space-y-2">
            <span className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>材料类型</span>
            <div className="grid grid-cols-3 gap-2">
              {TAPE_MATERIALS.map((m) => (
                <motion.button
                  key={m.id}
                  className={cn(
                    "p-2 rounded-lg text-xs transition-colors",
                    materialId === m.id
                      ? theme === 'dark'
                        ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                        : 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : theme === 'dark'
                        ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMaterialId(m.id)}
                >
                  <div className="font-medium">{m.name}</div>
                  <div className={cn("text-[10px]", theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>Δn={m.birefringence}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Polarizer configuration */}
          <div className="flex items-center justify-between">
            <span className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>偏振片配置</span>
            <div className="flex gap-2">
              <motion.button
                className={cn(
                  "px-3 py-1.5 rounded text-xs transition-colors",
                  crossedPolarizers
                    ? theme === 'dark'
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-purple-100 text-purple-700 border border-purple-300'
                    : theme === 'dark'
                      ? 'bg-slate-700/50 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCrossedPolarizers(true)}
              >
                正交 ⊥
              </motion.button>
              <motion.button
                className={cn(
                  "px-3 py-1.5 rounded text-xs transition-colors",
                  !crossedPolarizers
                    ? theme === 'dark'
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                    : theme === 'dark'
                      ? 'bg-slate-700/50 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCrossedPolarizers(false)}
              >
                平行 ∥
              </motion.button>
            </div>
          </div>

          {/* Analysis toggle */}
          <motion.button
            className={cn(
              "w-full py-2 rounded-lg text-sm transition-colors",
              theme === 'dark'
                ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            {showAnalysis ? '隐藏' : '显示'}详细分析
          </motion.button>

          {/* Detailed analysis */}
          {showAnalysis && (
            <motion.div
              className={cn(
                "p-3 rounded-lg space-y-2 text-xs",
                theme === 'dark' ? 'bg-slate-900/70' : 'bg-gray-100'
              )}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className={cn("p-2 rounded", theme === 'dark' ? 'bg-slate-800/50' : 'bg-white')}>
                  <div className={cn(theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>光程差 OPD</div>
                  <div className={cn("font-mono", theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>{analysis.opticalPathDifference.toFixed(0)} nm</div>
                </div>
                <div className={cn("p-2 rounded", theme === 'dark' ? 'bg-slate-800/50' : 'bg-white')}>
                  <div className={cn(theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>级次 Order</div>
                  <div className={cn("font-mono", theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>{analysis.retardationOrder.toFixed(3)} λ</div>
                </div>
              </div>
              <div className={cn("p-2 rounded", theme === 'dark' ? 'bg-slate-800/50' : 'bg-white')}>
                <div className={cn("mb-1", theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>RGB透过率</div>
                <div className="flex gap-2">
                  <div className="flex-1 text-center">
                    <div className={cn("font-mono", theme === 'dark' ? 'text-red-400' : 'text-red-600')}>{(analysis.transmission.red * 100).toFixed(1)}%</div>
                    <div className={cn("text-[10px]", theme === 'dark' ? 'text-gray-600' : 'text-gray-400')}>650nm</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className={cn("font-mono", theme === 'dark' ? 'text-green-400' : 'text-green-600')}>{(analysis.transmission.green * 100).toFixed(1)}%</div>
                    <div className={cn("text-[10px]", theme === 'dark' ? 'text-gray-600' : 'text-gray-400')}>550nm</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className={cn("font-mono", theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}>{(analysis.transmission.blue * 100).toFixed(1)}%</div>
                    <div className={cn("text-[10px]", theme === 'dark' ? 'text-gray-600' : 'text-gray-400')}>450nm</div>
                  </div>
                </div>
              </div>
              <div className={cn("text-[10px] italic", theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                使用 SpectralJonesSolver 进行物理精确计算: δ(λ) = 2π·d·Δn/λ
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scientific note */}
      <div className={cn(
        "mt-4 p-3 rounded-lg border",
        theme === 'dark'
          ? 'bg-indigo-950/30 border-indigo-500/20'
          : 'bg-indigo-50 border-indigo-200'
      )}>
        <div className={cn("text-xs font-medium mb-1", theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700')}>物理原理</div>
        <div className={cn("text-xs", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          相位延迟 δ = 2π × d × Δn / λ 随波长变化。厚度 d = {(layers * material.thickness).toFixed(0)} μm，
          双折射率 Δn = {material.birefringence}。不同波长(R:{'\u00A0'}650nm, G:{'\u00A0'}550nm, B:{'\u00A0'}450nm)
          的透过率不同，产生干涉色。
        </div>
      </div>
    </div>
  )
}

// 主演示组件
export function ChromaticDemo() {
  const { theme } = useTheme()
  const [thickness, setThickness] = useState(0.1)
  const [birefringence, setBirefringence] = useState(0.01)
  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [analyzerAngle, setAnalyzerAngle] = useState(90)

  // 预设材料
  const materials = [
    { name: '塑料薄膜', br: 0.005 },
    { name: '云母片', br: 0.04 },
    { name: '方解石', br: 0.172 },
    { name: '石英', br: 0.009 },
  ]

  // 计算结果
  const resultColor = calculateMixedColor(thickness, birefringence, polarizerAngle, analyzerAngle)

  // 计算相位延迟
  // thickness is in mm, convert to nm by multiplying by 1e6
  const opticalPathDiff = birefringence * thickness * 1e6 // nm
  const phaseRetardation = (2 * Math.PI * opticalPathDiff) / 550 // 在550nm处
  const retardationOrders = phaseRetardation / (2 * Math.PI)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h2 className={cn(
          "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          theme === 'dark'
            ? 'from-white via-purple-100 to-white'
            : 'from-gray-800 via-purple-600 to-gray-800'
        )}>
          光学各向异性 - 色偏振
        </h2>
        <p className={cn("mt-1", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          探索双折射材料产生的彩色干涉效应
        </p>
      </div>

      {/* 交互演示区域标题 */}
      <div className="flex items-center gap-3 pt-2">
        <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-transparent", theme === 'dark' ? 'via-purple-500/30' : 'via-purple-300/50')} />
        <h3 className={cn("text-lg font-semibold flex items-center gap-2", theme === 'dark' ? 'text-purple-300' : 'text-purple-600')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          交互演示
        </h3>
        <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-transparent", theme === 'dark' ? 'via-purple-500/30' : 'via-purple-300/50')} />
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="space-y-4">
          {/* 光路图 */}
          <div className={cn(
            "rounded-xl border p-4",
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-purple-950/90 border-purple-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)]'
              : 'bg-gradient-to-br from-slate-50 via-white to-purple-50 border-purple-200 shadow-lg'
          )}>
            <OpticalPathDiagram
              thickness={thickness}
              birefringence={birefringence}
              polarizerAngle={polarizerAngle}
              analyzerAngle={analyzerAngle}
              resultColor={resultColor.hex}
              theme={theme}
            />
          </div>

          {/* 观察到的颜色 */}
          <div className={cn(
            "rounded-xl border p-4",
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-600/30'
              : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
          )}>
            <h4 className={cn("text-sm font-semibold mb-3", theme === 'dark' ? 'text-white' : 'text-gray-800')}>观察到的颜色</h4>
            <ColorDisplayPanel color={resultColor} theme={theme} />
          </div>
        </div>

        {/* 右侧：控制与学习 */}
        <div className="space-y-4">
          {/* 样品参数 */}
          <ControlPanel title="样品参数">
            <SliderControl
              label="样品厚度 d"
              value={thickness}
              min={0.01}
              max={0.5}
              step={0.01}
              unit=" mm"
              onChange={setThickness}
              color="cyan"
            />
            <SliderControl
              label="双折射率 Δn"
              value={birefringence}
              min={0.001}
              max={0.2}
              step={0.001}
              onChange={setBirefringence}
              formatValue={(v) => v.toFixed(3)}
              color="purple"
            />

            {/* 材料预设 */}
            <div className="pt-2">
              <div className={cn("text-xs mb-2", theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>预设材料</div>
              <div className="grid grid-cols-2 gap-2">
                {materials.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setBirefringence(m.br)}
                    className={cn(
                      "px-2 py-1.5 text-xs rounded transition-colors",
                      Math.abs(birefringence - m.br) < 0.0001
                        ? theme === 'dark'
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                          : 'bg-purple-100 text-purple-700 border border-purple-300'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </ControlPanel>

          {/* 偏振设置 */}
          <ControlPanel title="偏振片设置">
            <SliderControl
              label="起偏器角度"
              value={polarizerAngle}
              min={0}
              max={180}
              step={5}
              unit="°"
              onChange={setPolarizerAngle}
              color="cyan"
            />
            <SliderControl
              label="检偏器角度"
              value={analyzerAngle}
              min={0}
              max={180}
              step={5}
              unit="°"
              onChange={setAnalyzerAngle}
              color="purple"
            />

            <div className="flex gap-2 pt-2">
              <motion.button
                className={cn(
                  "flex-1 py-1.5 text-xs rounded transition-colors",
                  theme === 'dark'
                    ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnalyzerAngle(polarizerAngle)}
              >
                平行设置
              </motion.button>
              <motion.button
                className={cn(
                  "flex-1 py-1.5 text-xs rounded transition-colors",
                  theme === 'dark'
                    ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnalyzerAngle((polarizerAngle + 90) % 180)}
              >
                正交设置
              </motion.button>
            </div>
          </ControlPanel>

          {/* 相位延迟信息 */}
          <ControlPanel title="相位延迟">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className={cn("p-2 rounded-lg", theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100')}>
                <div className="text-gray-500 text-xs">光程差 Δn×d</div>
                <div className="text-cyan-400 font-mono">{opticalPathDiff.toFixed(1)} nm</div>
              </div>
              <div className={cn("p-2 rounded-lg", theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100')}>
                <div className="text-gray-500 text-xs">相位延迟 (550nm)</div>
                <div className="text-purple-400 font-mono">{(phaseRetardation * 180 / Math.PI).toFixed(0)}°</div>
              </div>
              <div className={cn("p-2 rounded-lg col-span-2", theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100')}>
                <div className="text-gray-500 text-xs">延迟级次</div>
                <div className="text-orange-400 font-mono">{retardationOrders.toFixed(2)} λ</div>
              </div>
            </div>
          </ControlPanel>

          {/* 光谱透过率 */}
          <ControlPanel title="光谱透过率">
            <SpectrumChart
              thickness={thickness}
              birefringence={birefringence}
              polarizerAngle={polarizerAngle}
              analyzerAngle={analyzerAngle}
              theme={theme}
            />
            <p className={cn("text-xs mt-2", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              不同波长的透过率不同，导致出射光呈现特定颜色。
            </p>
          </ControlPanel>
        </div>
      </div>

      {/* 虚拟胶带实验区域标题 */}
      <div className="flex items-center gap-3 pt-4">
        <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-transparent", theme === 'dark' ? 'via-indigo-500/30' : 'via-indigo-300/50')} />
        <h3 className={cn("text-lg font-semibold flex items-center gap-2", theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          动手实验
        </h3>
        <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-transparent", theme === 'dark' ? 'via-indigo-500/30' : 'via-indigo-300/50')} />
      </div>

      {/* Virtual Tape Experiment */}
      <VirtualTapeExperiment theme={theme} />

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="色偏振原理" color="cyan">
          <p className={cn("text-xs", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            白光通过双折射材料时，不同波长的光经历不同的相位延迟，在检偏器后发生干涉，产生特征颜色。
          </p>
        </InfoCard>
        <InfoCard title="米歇尔-列维色表" color="purple">
          <p className={cn("text-xs", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            光程差与颜色的对应关系构成米歇尔-列维色表，是矿物鉴定的重要工具。低级次：灰→白→黄，高级次：彩色序列。
          </p>
        </InfoCard>
        <InfoCard title="应用场景" color="orange">
          <ul className={cn("text-xs space-y-1", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            <li>• 矿物岩石鉴定</li>
            <li>• 应力分析（光弹性）</li>
            <li>• 液晶显示技术</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
