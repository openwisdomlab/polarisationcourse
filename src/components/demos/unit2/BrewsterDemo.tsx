/**
 * 布儒斯特角演示 - Unit 2 (Redesigned with DemoLayout)
 * tan(θB) = n2/n1，反射光为完全s偏振
 * 采用纯DOM + SVG + Framer Motion一体化设计
 *
 * Physics Engine Migration:
 * - Uses solveFresnel() from unified physics engine
 * - Uses brewsterAngle() for proper angle calculation
 * - No more hardcoded Fresnel equations
 *
 * Enhanced Features:
 * - Draggable light source for incident angle control
 * - Real-time Fresnel coefficient visualization
 * - Dispersion simulation via Sellmeier equations
 */
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SliderControl, ControlPanel, Toggle } from '../DemoControls'
import { useDemoTheme } from '../demoThemeColors'
import {
  DemoHeader,
  VisualizationPanel,
  DemoMainLayout,
  InfoGrid,
  ChartPanel,
  StatCard,
  FormulaHighlight,
  TipBanner,
} from '../DemoLayout'
import { InfoCard } from '../DemoControls'
import {
  sellmeierIndex,
  cauchyIndex,
  wavelengthToRGB,
} from '@/core/WaveOptics'
// Import Fresnel solver from unified physics engine
import {
  solveFresnel,
  brewsterAngle as computeBrewsterAngle,
  type FresnelCoefficients,
} from '@/core/physics/unified'

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

/**
 * Calculate Fresnel coefficients using unified physics engine
 * This replaces the hardcoded implementation with the physics engine's solveFresnel()
 */
function calculateBrewster(thetaDeg: number, n1: number, n2: number): {
  Rs: number
  Rp: number
  Ts: number
  Tp: number
  totalReflection: boolean
  theta2: number
  coefficients: FresnelCoefficients
} {
  // Convert degrees to radians for physics engine
  const thetaRad = (thetaDeg * Math.PI) / 180

  // Use unified physics engine's Fresnel solver
  const coefficients = solveFresnel(n1, n2, thetaRad)

  return {
    Rs: coefficients.Rs,
    Rp: coefficients.Rp,
    Ts: coefficients.Ts,
    Tp: coefficients.Tp,
    totalReflection: coefficients.isTIR,
    theta2: coefficients.isTIR ? 90 : (coefficients.thetaT * 180) / Math.PI,
    coefficients,
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
  const dt = useDemoTheme()

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
        <linearGradient id="brewster-spectrumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B00FF" />
          <stop offset="20%" stopColor="#0000FF" />
          <stop offset="35%" stopColor="#00FFFF" />
          <stop offset="50%" stopColor="#00FF00" />
          <stop offset="65%" stopColor="#FFFF00" />
          <stop offset="80%" stopColor="#FF7F00" />
          <stop offset="100%" stopColor="#FF0000" />
        </linearGradient>
        <linearGradient id="brewster-dispCurveFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect x="30" y="10" width="160" height="60" fill={dt.canvasBgAlt} rx="4" />

      {/* 光谱背景条 */}
      <rect x="30" y="72" width="160" height="6" fill="url(#brewster-spectrumGrad)" rx="3" opacity="0.7" />

      {/* 曲线填充 */}
      <path d={pathD + ` L 190,70 L 30,70 Z`} fill="url(#brewster-dispCurveFill)" />

      {/* 曲线 */}
      <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

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
            stroke={dt.svgWhiteText}
            strokeWidth="1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </>
      )}

      {/* 坐标轴标签 */}
      <text x="15" y="45" fill={dt.textSecondary} fontSize="8" textAnchor="middle" transform="rotate(-90, 15, 45)">n(λ)</text>
      <text x="30" y="80" fill={dt.textSecondary} fontSize="7">380</text>
      <text x="185" y="80" fill={dt.textSecondary} fontSize="7">780nm</text>
      <text x="110" y="8" fill={dt.textSecondary} fontSize="8" textAnchor="middle">n = {currentN.toFixed(4)}</text>
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
  const dt = useDemoTheme()

  const curveData = useMemo(() => {
    const points: { x: number; y: number; wavelength: number; brewster: number }[] = []

    for (let wl = 380; wl <= 780; wl += 5) {
      const n = getMaterialIndex(material, wl)
      const brewster = Math.atan(n) * 180 / Math.PI
      const x = 30 + ((wl - 380) / 400) * 160
      const y = 65 - ((brewster - 50) / 25) * 50 // 假设布儒斯特角在50-75 range
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
      <defs>
        <linearGradient id="brewster-brewCurveFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="30" y="10" width="160" height="60" fill={dt.canvasBgAlt} rx="4" />

      {/* 曲线填充 */}
      <path d={pathD + ` L 190,70 L 30,70 Z`} fill="url(#brewster-brewCurveFill)" />

      {/* 曲线 */}
      <path d={pathD} fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />

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
            stroke={dt.svgWhiteText}
            strokeWidth="1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </>
      )}

      {/* 坐标轴标签 */}
      <text x="15" y="45" fill={dt.textSecondary} fontSize="8" textAnchor="middle" transform="rotate(-90, 15, 45)">θB</text>
      <text x="30" y="80" fill={dt.textSecondary} fontSize="7">380</text>
      <text x="185" y="80" fill={dt.textSecondary} fontSize="7">780nm</text>
      <text x="110" y="8" fill="#f472b6" fontSize="8" textAnchor="middle">θB = {currentBrewster.toFixed(2)}</text>
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

// 布儒斯特角SVG图示 (with draggable light source)
function BrewsterDiagram({
  incidentAngle,
  n1,
  n2,
  labels,
  onAngleChange,
  enableDrag,
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
  onAngleChange?: (angle: number) => void
  enableDrag?: boolean
}) {
  const dt = useDemoTheme()

  const result = calculateBrewster(incidentAngle, n1, n2)
  // Use unified engine's brewsterAngle function
  const brewsterAngle = computeBrewsterAngle(n1, n2) * (180 / Math.PI)
  const isAtBrewster = Math.abs(incidentAngle - brewsterAngle) < 1.5

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDrag || !onAngleChange) return
    e.preventDefault()
    setIsDragging(true)
  }, [enableDrag, onAngleChange])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !svgRef.current || !onAngleChange) return

    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()

    // Calculate position relative to interface center
    const cx = 300 // Interface center X
    const cy = 200 // Interface center Y (in SVG coordinates)

    // Convert mouse position to SVG coordinates
    const scaleX = 600 / rect.width
    const scaleY = 400 / rect.height
    const svgX = (e.clientX - rect.left) * scaleX
    const svgY = (e.clientY - rect.top) * scaleY

    // Calculate angle from vertical (normal)
    const dx = svgX - cx
    const dy = cy - svgY // Invert Y because SVG Y grows downward

    if (dy <= 0) return // Only allow angles above interface

    let angle = Math.atan2(Math.abs(dx), dy) * (180 / Math.PI)
    angle = Math.max(0, Math.min(89, angle)) // Clamp to 0-89

    // Snap to 1-degree increments
    onAngleChange(Math.round(angle))
  }, [isDragging, onAngleChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
    return undefined
  }, [isDragging, handleMouseMove, handleMouseUp])

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
    <svg ref={svgRef} viewBox="0 0 600 400" className="w-full h-auto">
      <defs>
        <linearGradient id="brewster-airGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dt.isDark ? '#0c1526' : '#dbeafe'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={dt.isDark ? '#1e3a5f' : '#93c5fd'} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="brewster-glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dt.isDark ? '#134e4a' : '#99f6e4'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={dt.isDark ? '#0f4c4c' : '#5eead4'} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="brewster-interfaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0" />
          <stop offset="20%" stopColor="#67e8f9" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#67e8f9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="brewster-lightSourceGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="brewster-glowYellow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="brewster-glowCyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="brewster-glowGreen" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 空气层 */}
      <rect x="30" y="20" width="540" height="180" fill="url(#brewster-airGrad)" rx="10" />
      <text x="60" y="50" fill="#60a5fa" fontSize="13" fontWeight="500">{labels.air} n₁ = {n1.toFixed(2)}</text>

      {/* 玻璃/介质层 */}
      <rect x="30" y="200" width="540" height="180" fill="url(#brewster-glassGrad)" rx="10" />
      <text x="60" y="360" fill="#2dd4bf" fontSize="13" fontWeight="500">{labels.medium} n₂ = {n2.toFixed(2)}</text>

      {/* 界面 - polished gradient line */}
      <line x1="30" y1="200" x2="570" y2="200" stroke="url(#brewster-interfaceGrad)" strokeWidth="2.5" />

      {/* 法线 */}
      <line x1={cx} y1="30" x2={cx} y2="370" stroke={dt.textSecondary} strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
      <text x={cx + 8} y="45" fill={dt.textSecondary} fontSize="11">{labels.normal}</text>

      {/* 光源辉光 */}
      <circle
        cx={incidentStart.x}
        cy={incidentStart.y}
        r="30"
        fill="url(#brewster-lightSourceGlow)"
      />

      {/* 光源 (Draggable) */}
      <motion.circle
        cx={incidentStart.x}
        cy={incidentStart.y}
        r="12"
        fill="#fbbf24"
        filter="url(#brewster-glowYellow)"
        animate={{ scale: isDragging ? 1.3 : [1, 1.1, 1] }}
        transition={{ duration: isDragging ? 0.1 : 2, repeat: isDragging ? 0 : Infinity }}
        style={{ cursor: enableDrag ? 'grab' : 'default' }}
        onMouseDown={handleMouseDown}
      />
      {/* Drag hint ring */}
      {enableDrag && (
        <circle
          cx={incidentStart.x}
          cy={incidentStart.y}
          r="18"
          fill="none"
          stroke={isDragging ? '#fbbf24' : 'transparent'}
          strokeWidth="2"
          strokeDasharray="4 2"
          opacity={isDragging ? 1 : 0.5}
        />
      )}

      {/* 入射光 */}
      <motion.line
        x1={incidentStart.x}
        y1={incidentStart.y}
        x2={cx}
        y2={cy}
        stroke="#fbbf24"
        strokeWidth="4"
        filter="url(#brewster-glowYellow)"
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

      {/* 反射光 - 使用Rs而非平均值，因为在布儒斯特角时反射光为纯s偏振 */}
      <motion.line
        x1={cx}
        y1={cy}
        x2={reflectEnd.x}
        y2={reflectEnd.y}
        stroke={isAtBrewster ? '#22d3ee' : dt.textSecondary}
        strokeWidth={Math.max(2, 4 * result.Rs)}
        strokeOpacity={Math.max(0.5, result.Rs)}
        filter={isAtBrewster ? 'url(#brewster-glowCyan)' : undefined}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      {/* 反射偏振状态 */}
      <PolarizationIndicator
        type={getPolarizationType()}
        x={(cx + reflectEnd.x) / 2 + 25}
        y={(cy + reflectEnd.y) / 2}
        color={isAtBrewster ? '#22d3ee' : dt.textSecondary}
      />
      <text
        x={reflectEnd.x + 15}
        y={reflectEnd.y - 10}
        fill={isAtBrewster ? '#22d3ee' : dt.textSecondary}
        fontSize="12"
        fontWeight="500"
      >
        {isAtBrewster ? labels.fullSPol : labels.partialPol}
      </text>

      {/* 布儒斯特角时的Rs/Rp标注 - 显示s偏振仍有反射，p偏振为零 */}
      {isAtBrewster && (
        <g>
          <text
            x={reflectEnd.x + 15}
            y={reflectEnd.y + 8}
            fill="#22d3ee"
            fontSize="11"
            fontWeight="500"
          >
            Rs = {(result.Rs * 100).toFixed(0)}%
          </text>
          <text
            x={reflectEnd.x + 15}
            y={reflectEnd.y + 22}
            fill="#f472b6"
            fontSize="11"
            fontWeight="500"
          >
            Rp = 0
          </text>
        </g>
      )}

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
            filter="url(#brewster-glowGreen)"
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
        θ = {incidentAngle}
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
            θ₂ = {result.theta2.toFixed(1)}
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
          <rect x={cx - 85} y="6" width="170" height="32" rx="8" fill={dt.isDark ? 'rgba(34,211,238,0.12)' : 'rgba(34,211,238,0.15)'} stroke="#22d3ee" strokeWidth="1" />
          <text x={cx} y="27" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="bold">
            {labels.brewsterAngle} θB = {brewsterAngle.toFixed(1)}
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
          <text x={cx + 35} y={cy + 10} fill="#fbbf24" fontSize="11">90</text>
        </g>
      )}

      {/* 图例 */}
      <g transform="translate(450, 28)">
        <rect x="0" y="0" width="112" height="94" fill={dt.infoPanelBg} rx="8" stroke={dt.infoPanelStroke} strokeWidth="1" />
        <text x="10" y="18" fill={dt.textSecondary} fontSize="10" fontWeight="600">{labels.polarizationStates}</text>
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
  const dt = useDemoTheme()
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
      <defs>
        <linearGradient id="brewster-pdFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="40" y="30" width="220" height="100" fill={dt.canvasBgAlt} rx="6" />

      {/* 坐标轴 */}
      <line x1="40" y1="130" x2="270" y2="130" stroke={dt.axisColor} strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="130" stroke={dt.axisColor} strokeWidth="1" />

      {/* X轴刻度 */}
      {[0, 45, 90].map((angle) => {
        const x = 40 + (angle / 90) * 220
        return (
          <g key={angle}>
            <line x1={x} y1="130" x2={x} y2="135" stroke={dt.textSecondary} strokeWidth="1" />
            <text x={x} y="147" textAnchor="middle" fill={dt.textSecondary} fontSize="10">{angle}</text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.5, 1].map((val, i) => {
        const y = 130 - val * 100
        return (
          <g key={i}>
            <text x="30" y={y + 4} textAnchor="end" fill={dt.textSecondary} fontSize="10">{(val * 100).toFixed(0)}%</text>
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
      <path d={rsPath} fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.4" />

      {/* Rp曲线 */}
      <path d={rpPath} fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.4" />

      {/* 偏振度曲线 */}
      <path d={pdPath} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />

      {/* 当前点 */}
      <motion.circle
        cx={currentX}
        cy={currentY}
        r="6"
        fill="#a78bfa"
        stroke={dt.svgWhiteText}
        strokeWidth="1.5"
        animate={{ cx: currentX, cy: currentY }}
        transition={{ duration: 0.2 }}
      />

      {/* 轴标签 */}
      <text x="155" y="158" textAnchor="middle" fill={dt.textSecondary} fontSize="11">θ</text>

      {/* 图例 */}
      <g transform="translate(200, 38)">
        <line x1="0" y1="0" x2="16" y2="0" stroke="#a78bfa" strokeWidth="2.5" />
        <text x="20" y="4" fill="#a78bfa" fontSize="9">PD</text>
        <line x1="0" y1="14" x2="16" y2="14" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
        <text x="20" y="18" fill="#22d3ee" fontSize="9" opacity="0.6">Rs</text>
        <line x1="0" y1="28" x2="16" y2="28" stroke="#f472b6" strokeWidth="1.5" opacity="0.6" />
        <text x="20" y="32" fill="#f472b6" fontSize="9" opacity="0.6">Rp</text>
      </g>
    </svg>
  )
}

// 主演示组件
export function BrewsterDemo() {
  const dt = useDemoTheme()
  const { t } = useTranslation()
  const [incidentAngle, setIncidentAngle] = useState(56)
  const [wavelength, setWavelength] = useState(550) // 绿光默认
  const [showDispersion, setShowDispersion] = useState(true)
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0)
  const [enableDrag, setEnableDrag] = useState(true) // Enable draggable light source
  const n1 = 1.0 // 空气

  // 获取当前材料
  const currentMaterial = DISPERSIVE_MATERIALS[selectedMaterialIndex]

  // 计算当前波长下的折射率
  const n2 = showDispersion
    ? getMaterialIndex(currentMaterial, wavelength)
    : getMaterialIndex(currentMaterial, 550) // 固定在550nm

  // Use unified physics engine for Brewster angle calculation
  const brewsterAngle = computeBrewsterAngle(n1, n2) * (180 / Math.PI)
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

  // ── Visualization panel content ──
  const visualizationContent = (
    <div className="space-y-5">
      {/* Main diagram */}
      <VisualizationPanel>
        <BrewsterDiagram
          incidentAngle={incidentAngle}
          n1={n1}
          n2={n2}
          labels={diagramLabels}
          onAngleChange={setIncidentAngle}
          enableDrag={enableDrag}
        />
        {enableDrag && (
          <p className={`text-xs ${dt.subtleTextClass} text-center mt-2`}>
            {t('demoUi.brewster.dragHint', 'Drag the light source to change incident angle')}
          </p>
        )}
      </VisualizationPanel>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t('demoUi.brewster.currentIncidentAngle')}
          value={`${incidentAngle}`}
          unit="\u00B0"
          color="orange"
        />
        <StatCard
          label={t('demoUi.brewster.brewsterAngle')}
          value={brewsterAngle.toFixed(1)}
          unit="\u00B0"
          color="cyan"
        />
        <StatCard
          label={t('demoUi.brewster.sPolReflectance')}
          value={(result.Rs * 100).toFixed(1)}
          unit="%"
          color="cyan"
        />
        <StatCard
          label={t('demoUi.brewster.pPolReflectance')}
          value={(result.Rp * 100).toFixed(1)}
          unit="%"
          color={result.Rp < 0.01 ? 'green' : 'pink'}
        />
      </div>

      {/* Polarization progress bar */}
      <div className={`rounded-2xl ${dt.panelClass} border p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${dt.mutedTextClass}`}>
              {t('demoUi.brewster.polarizationDegree')}
            </span>
            <span className="font-mono text-lg text-purple-400 font-bold">
              {(polarizationDegree * 100).toFixed(0)}%
            </span>
          </div>
          <div className={`text-sm font-semibold ${isAtBrewster ? 'text-green-400' : dt.subtleTextClass}`}>
            {isAtBrewster ? t('demoUi.brewster.match') : `${t('demoUi.brewster.difference')} ${Math.abs(incidentAngle - brewsterAngle).toFixed(1)}\u00B0`}
          </div>
        </div>
        <div className={`h-2.5 ${dt.barTrackClass} rounded-full overflow-hidden`}>
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

      {/* Polarization degree chart */}
      <ChartPanel
        title={t('demoUi.brewster.reflectedPolDegree')}
        subtitle={`θB = ${brewsterAngle.toFixed(1)}\u00B0`}
      >
        <PolarizationDegreeChart n1={n1} n2={n2} currentAngle={incidentAngle} />
        <p className={`text-xs ${dt.mutedTextClass} mt-2`}>
          {t('demoUi.brewster.chartDesc')}
        </p>
      </ChartPanel>
    </div>
  )

  // ── Controls panel content ──
  const controlsContent = (
    <div className="space-y-5">
      {/* Parameter controls */}
      <ControlPanel title={t('demoUi.common.controlPanel')}>
        <SliderControl
          label={t('demoUi.brewster.incidentAngle')}
          value={incidentAngle}
          min={0}
          max={89}
          step={1}
          unit="\u00B0"
          onChange={setIncidentAngle}
          color="orange"
        />

        {/* Drag mode toggle */}
        <div className={`flex items-center justify-between py-2 border-t ${dt.borderClass}`}>
          <span className={`text-xs ${dt.mutedTextClass}`}>{t('demoUi.brewster.dragMode', 'Drag Light Source')}</span>
          <Toggle
            label=""
            checked={enableDrag}
            onChange={setEnableDrag}
          />
        </div>

        {/* 色散模式开关 */}
        <div className={`flex items-center justify-between py-2 border-t ${dt.borderClass}`}>
          <span className={`text-xs ${dt.mutedTextClass}`}>{t('demoUi.brewster.dispersionMode')}</span>
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
        <div className={`pt-2 border-t ${dt.borderClass}`}>
          <div className={`text-xs ${dt.subtleTextClass} mb-2 font-medium`}>{t('demoUi.brewster.selectMaterial')}</div>
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
                  className={`px-2 py-1.5 text-xs rounded-lg transition-all ${
                    isSelected
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : `${dt.inactiveButtonClass} border hover:opacity-80`
                  }`}
                >
                  {t(m.nameKey).replace('demoUi.brewster.', '')}
                </button>
              )
            })}
          </div>
        </div>

        {/* 显示当前折射率 */}
        <div className={`mt-2 p-2.5 ${dt.isDark ? 'bg-slate-900/50' : 'bg-slate-100/80'} rounded-xl`}>
          <div className="flex justify-between text-xs">
            <span className={dt.subtleTextClass}>n({wavelength}nm)</span>
            <span className="text-cyan-400 font-mono font-semibold">{n2.toFixed(4)}</span>
          </div>
          {showDispersion && (
            <div className="flex justify-between text-xs mt-1">
              <span className={dt.subtleTextClass}>{t('demoUi.brewster.dispersionRange')}</span>
              <span className="text-purple-400 font-mono font-semibold">{dispersionRange.toFixed(2)}\u00B0</span>
            </div>
          )}
        </div>

        {/* 跳转按钮 */}
        <motion.button
          className="w-full py-2.5 mt-3 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 text-cyan-400 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors font-medium text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIncidentAngle(Math.round(brewsterAngle))}
        >
          {t('demoUi.brewster.jumpToBrewster')}
        </motion.button>
      </ControlPanel>

      {/* Calculation results with StatCards */}
      <ControlPanel title={t('demoUi.common.calculationResult')}>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={t('demoUi.brewster.refractionAngle')}
            value={result.theta2.toFixed(1)}
            unit="\u00B0"
            color="green"
          />
          <StatCard
            label="θ₁ + θ₂"
            value={(incidentAngle + result.theta2).toFixed(1)}
            unit="\u00B0"
            color={Math.abs(incidentAngle + result.theta2 - 90) < 1.5 ? 'green' : 'orange'}
          />
        </div>

        {/* Key formula */}
        <FormulaHighlight
          formula={`tan(θB) = n₂/n₁ = ${n2.toFixed(2)}/${n1.toFixed(2)} = ${(n2/n1).toFixed(3)}`}
          description={t('demoUi.brewster.brewsterTitle')}
        />
      </ControlPanel>

      {/* 色散曲线 - 仅在色散模式下显示 */}
      {showDispersion && (
        <div className="grid grid-cols-1 gap-3">
          <ChartPanel
            title={t('demoUi.brewster.dispersionCurve')}
            subtitle={currentMaterial.type === 'sellmeier' ? 'Sellmeier' : 'Cauchy'}
          >
            <DispersionCurve material={currentMaterial} currentWavelength={wavelength} />
          </ChartPanel>
          <ChartPanel
            title={t('demoUi.brewster.brewsterDispersion')}
            subtitle="θB = arctan(n)"
          >
            <BrewsterWavelengthCurve material={currentMaterial} currentWavelength={wavelength} />
          </ChartPanel>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <DemoHeader
        title={t('demoUi.brewster.title')}
        subtitle={t('demoUi.brewster.subtitle')}
        gradient="cyan"
      />

      {/* Tip banner */}
      {isAtBrewster && (
        <TipBanner color="cyan">
          {t('demoUi.brewster.brewsterTitle')}: θ₁ + θ₂ = 90, {t('demoUi.brewster.fullSPol')}. Rp = 0, Rs = {(result.Rs * 100).toFixed(1)}%.
        </TipBanner>
      )}

      {/* Main two-column layout */}
      <DemoMainLayout
        visualization={visualizationContent}
        controls={controlsContent}
        controlsWidth="wide"
      />

      {/* Knowledge cards grid */}
      <InfoGrid columns={2}>
        <InfoCard title={t('demoUi.brewster.brewsterTitle')} color="cyan">
          <p className={`text-xs ${dt.bodyClass}`}>
            {t('demoUi.brewster.brewsterDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.brewster.physicalExplanation')} color="purple">
          <p className={`text-xs ${dt.bodyClass}`}>
            {t('demoUi.brewster.physicalDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.brewster.dispersionTitle')} color="green">
          <p className={`text-xs ${dt.bodyClass}`}>
            {t('demoUi.brewster.dispersionDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.brewster.applicationsTitle')} color="orange">
          <ul className={`text-xs ${dt.bodyClass} space-y-1`}>
            {(t('demoUi.brewster.applicationsList', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>- {item}</li>
            ))}
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
