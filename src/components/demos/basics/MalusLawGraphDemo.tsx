/**
 * MalusLawGraphDemo - 马吕斯定律图形化演示
 * 交互式展示 I = I₀ × cos²(θ) 的关系曲线
 * 包含实时角度调节和图形可视化
 *
 * Physics Engine Migration:
 * - Uses unified CoherencyMatrix-based calculations via PolarizationPhysics
 * - All intensity values computed through proper polarizer interactions
 */
import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ControlPanel,
  SliderControl,
  Toggle,
  InfoCard,
  Formula,
  AnimatedValue,
  PresetButtons,
} from '../DemoControls'
import { PolarizationPhysics } from '@/hooks/usePolarizationSimulation'
import { useDemoTheme } from '../demoThemeColors'
import {
  DemoHeader,
  VisualizationPanel,
  DemoMainLayout,
  InfoGrid,
  FormulaHighlight,
  StatCard,
  TipBanner,
} from '../DemoLayout'

/**
 * Generate Malus's Law curve path using the unified physics engine
 * Each point is computed via CoherencyMatrix polarizer interaction
 */
function generateMalusCurvePath(
  width: number,
  height: number,
  startX: number,
  startY: number
): string {
  const points: string[] = []
  const steps = 180

  for (let i = 0; i <= steps; i++) {
    const polarizerAngle = (i / steps) * 180 // Polarizer angle: 0 to 180 degrees
    const x = startX + (i / steps) * width
    // Input light at 0° (horizontal), polarizer at polarizerAngle
    // Engine computes: I = I₀ × cos²(θ) via CoherencyMatrix
    const transmission = PolarizationPhysics.malusIntensity(0, polarizerAngle, 1.0)
    const y = startY + height - transmission * height
    points.push(`${x},${y}`)
  }

  return `M ${points.join(' L ')}`
}

// 关键角度
const KEY_ANGLES = [
  { angle: 0, transmission: 100, label: '0°', description: 'Maximum transmission' },
  { angle: 30, transmission: 75, label: '30°', description: 'cos²(30°) = 0.75' },
  { angle: 45, transmission: 50, label: '45°', description: 'Half intensity' },
  { angle: 60, transmission: 25, label: '60°', description: 'cos²(60°) = 0.25' },
  { angle: 90, transmission: 0, label: '90°', description: 'Complete blocking' },
]

// 预设角度
const ANGLE_PRESETS = [
  { value: 0, label: '0°' },
  { value: 30, label: '30°' },
  { value: 45, label: '45°' },
  { value: 60, label: '60°' },
  { value: 90, label: '90°' },
  { value: 120, label: '120°' },
  { value: 135, label: '135°' },
  { value: 180, label: '180°' },
]

export function MalusLawGraphDemo() {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const dt = useDemoTheme()

  // 状态
  const [angle, setAngle] = useState(45)
  const [showKeyPoints, setShowKeyPoints] = useState(true)
  const [showIntensityBar, setShowIntensityBar] = useState(true)
  const [showPolarizers, setShowPolarizers] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationSpeed = 2

  // 计算透射率 - 使用统一物理引擎
  const transmission = useMemo(() => {
    return PolarizationPhysics.malusIntensity(0, angle, 1.0)
  }, [angle])

  // 图形参数
  const graphConfig = {
    width: 400,
    height: 200,
    startX: 80,
    startY: 50,
    padding: 40,
  }

  // 当前角度在图上的位置
  const currentPoint = useMemo(() => {
    const normalizedAngle = angle % 180
    return {
      x: graphConfig.startX + (normalizedAngle / 180) * graphConfig.width,
      y: graphConfig.startY + graphConfig.height - transmission * graphConfig.height,
    }
  }, [angle, transmission])

  // 动画效果
  const startAnimation = useCallback(() => {
    setIsAnimating(true)
    let currentAngle = 0
    const interval = setInterval(() => {
      currentAngle += animationSpeed
      if (currentAngle > 180) {
        currentAngle = 0
      }
      setAngle(currentAngle)
    }, 50)

    // 存储interval ID以便清理
    return () => clearInterval(interval)
  }, [animationSpeed])

  // Malus's Law curve path - 使用物理引擎采样
  const curvePath = useMemo(
    () => generateMalusCurvePath(graphConfig.width, graphConfig.height, graphConfig.startX, graphConfig.startY),
    []
  )

  return (
    <div className="space-y-5">
      <DemoHeader
        title={isZh ? '马吕斯定律' : "Malus's Law"}
        subtitle={isZh ? '交互式展示 I = I\u2080 \u00D7 cos\u00B2(\u03B8) 的关系曲线' : 'Interactive visualization of I = I\u2080 \u00D7 cos\u00B2(\u03B8)'}
        gradient="blue"
      />

      <FormulaHighlight
        formula="I = I\u2080 \u00D7 cos\u00B2(\u03B8)"
        description={isZh ? '\u03B8 = 偏振片夹角，I\u2080 = 初始光强' : '\u03B8 = polarizer angle, I\u2080 = initial intensity'}
      />

      <DemoMainLayout
        controlsWidth="narrow"
        visualization={
          <div className="space-y-4">
            <VisualizationPanel variant="blue">
              <svg viewBox="0 0 600 420" className="w-full h-auto" style={{ minHeight: '400px' }}>
                <defs>
                  <pattern id="malus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={dt.gridStroke} strokeWidth="1" />
                  </pattern>

                  {/* 曲线渐变 */}
                  <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>

                  {/* 发光效果 */}
                  <filter id="malus-glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* 点发光 */}
                  <filter id="point-glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width="600" height="420" fill="url(#malus-grid)" />

                {/* 标题 */}
                <text x="300" y="30" textAnchor="middle" fill={dt.textPrimary} fontSize="16" fontWeight="bold">
                  {isZh ? '马吕斯定律：I = I\u2080 \u00D7 cos\u00B2(\u03B8)' : "Malus's Law: I = I\u2080 \u00D7 cos\u00B2(\u03B8)"}
                </text>

                {/* 图表区域 */}
                <g>
                  {/* Y轴 */}
                  <line
                    x1={graphConfig.startX}
                    y1={graphConfig.startY}
                    x2={graphConfig.startX}
                    y2={graphConfig.startY + graphConfig.height}
                    stroke={dt.axisColor}
                    strokeWidth="2"
                  />
                  <polygon
                    points={`${graphConfig.startX},${graphConfig.startY - 5} ${graphConfig.startX - 5},${graphConfig.startY + 5} ${graphConfig.startX + 5},${graphConfig.startY + 5}`}
                    fill={dt.axisColor}
                  />
                  <text x={graphConfig.startX - 10} y={graphConfig.startY - 15} textAnchor="middle" fill={dt.textSecondary} fontSize="12">
                    I/I{'\u2080'}
                  </text>

                  {/* Y轴刻度 */}
                  {[0, 0.25, 0.5, 0.75, 1].map((v) => {
                    const y = graphConfig.startY + graphConfig.height - v * graphConfig.height
                    return (
                      <g key={v}>
                        <line x1={graphConfig.startX - 5} y1={y} x2={graphConfig.startX} y2={y} stroke={dt.axisColor} strokeWidth="1" />
                        <text x={graphConfig.startX - 15} y={y + 4} textAnchor="end" fill={dt.textMuted} fontSize="10">
                          {(v * 100).toFixed(0)}%
                        </text>
                        <line
                          x1={graphConfig.startX}
                          y1={y}
                          x2={graphConfig.startX + graphConfig.width}
                          y2={y}
                          stroke={dt.gridLineColor}
                          strokeWidth="0.5"
                          strokeDasharray="4 4"
                        />
                      </g>
                    )
                  })}

                  {/* X轴 */}
                  <line
                    x1={graphConfig.startX}
                    y1={graphConfig.startY + graphConfig.height}
                    x2={graphConfig.startX + graphConfig.width}
                    y2={graphConfig.startY + graphConfig.height}
                    stroke={dt.axisColor}
                    strokeWidth="2"
                  />
                  <polygon
                    points={`${graphConfig.startX + graphConfig.width + 5},${graphConfig.startY + graphConfig.height} ${graphConfig.startX + graphConfig.width - 5},${graphConfig.startY + graphConfig.height - 5} ${graphConfig.startX + graphConfig.width - 5},${graphConfig.startY + graphConfig.height + 5}`}
                    fill={dt.axisColor}
                  />
                  <text
                    x={graphConfig.startX + graphConfig.width + 20}
                    y={graphConfig.startY + graphConfig.height + 5}
                    textAnchor="start"
                    fill={dt.textSecondary}
                    fontSize="12"
                  >
                    {'\u03B8'}
                  </text>

                  {/* X轴刻度 */}
                  {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((a) => {
                    const x = graphConfig.startX + (a / 180) * graphConfig.width
                    const isKey = [0, 45, 90, 135, 180].includes(a)
                    return (
                      <g key={a}>
                        <line
                          x1={x}
                          y1={graphConfig.startY + graphConfig.height}
                          x2={x}
                          y2={graphConfig.startY + graphConfig.height + 5}
                          stroke={dt.axisColor}
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={graphConfig.startY + graphConfig.height + 18}
                          textAnchor="middle"
                          fill={isKey ? dt.textSecondary : dt.textMuted}
                          fontSize="10"
                        >
                          {a}{'\u00B0'}
                        </text>
                        {isKey && (
                          <line
                            x1={x}
                            y1={graphConfig.startY}
                            x2={x}
                            y2={graphConfig.startY + graphConfig.height}
                            stroke={dt.gridLineColor}
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                          />
                        )}
                      </g>
                    )
                  })}

                  {/* cos²曲线 */}
                  <motion.path
                    d={curvePath}
                    fill="none"
                    stroke="url(#curve-gradient)"
                    strokeWidth="3"
                    filter="url(#malus-glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />

                  {/* 填充区域 */}
                  <path
                    d={`${curvePath} L ${graphConfig.startX + graphConfig.width},${graphConfig.startY + graphConfig.height} L ${graphConfig.startX},${graphConfig.startY + graphConfig.height} Z`}
                    fill="url(#curve-gradient)"
                    opacity="0.1"
                  />

                  {/* 关键点标注 */}
                  {showKeyPoints &&
                    KEY_ANGLES.map((point) => {
                      const x = graphConfig.startX + (point.angle / 180) * graphConfig.width
                      const y = graphConfig.startY + graphConfig.height - (point.transmission / 100) * graphConfig.height
                      return (
                        <g key={point.angle}>
                          <circle cx={x} cy={y} r="5" fill="#22d3ee" opacity="0.8" />
                          <circle cx={x} cy={y} r="3" fill="#fff" />
                        </g>
                      )
                    })}

                  {/* 当前角度指示器 */}
                  <motion.g
                    animate={{
                      x: currentPoint.x,
                      y: currentPoint.y,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <line
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={graphConfig.startY + graphConfig.height - currentPoint.y}
                      stroke="#fbbf24"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                      transform={`translate(${-currentPoint.x + currentPoint.x}, 0)`}
                    />
                    <line
                      x1={0}
                      y1={0}
                      x2={graphConfig.startX - currentPoint.x}
                      y2={0}
                      stroke="#fbbf24"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    <circle cx={0} cy={0} r="10" fill="#fbbf24" opacity="0.3" filter="url(#point-glow)" />
                    <circle cx={0} cy={0} r="6" fill="#fbbf24" />
                    <circle cx={0} cy={0} r="3" fill="#fff" />
                  </motion.g>

                  {/* 当前值标注 */}
                  <g transform={`translate(${currentPoint.x}, ${Math.max(currentPoint.y - 30, graphConfig.startY + 10)})`}>
                    <rect x="-35" y="-12" width="70" height="24" rx="4" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1" />
                    <text x="0" y="5" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">
                      {(transmission * 100).toFixed(1)}%
                    </text>
                  </g>
                </g>

                {/* 偏振片示意图 */}
                {showPolarizers && (
                  <g transform="translate(50, 290)">
                    <defs>
                      <linearGradient id="light-beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#ffd700" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="polarized-beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0.2 + transmission * 0.7} />
                      </linearGradient>
                      <linearGradient id="output-beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.2 + transmission * 0.8} />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={transmission * 0.6} />
                      </linearGradient>
                      <filter id="light-source-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="beam-glow-filter" x="-20%" y="-100%" width="140%" height="300%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="detector-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* 光源 */}
                    <g transform="translate(35, 60)">
                      <motion.circle cx="0" cy="0" r="28" fill="#ffd700" opacity="0.15" filter="url(#light-source-glow)" animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.circle cx="0" cy="0" r="20" fill="#ffd700" opacity="0.4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                      <circle cx="0" cy="0" r="14" fill="#ffd700" />
                      <circle cx="0" cy="0" r="8" fill="#fff" opacity="0.7" />
                      <text x="0" y="48" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="500">
                        {isZh ? '光源' : 'Light'}
                      </text>
                    </g>

                    {/* 光源到P1的光束 */}
                    <g filter="url(#beam-glow-filter)">
                      <motion.line x1="55" y1="60" x2="110" y2="60" stroke="url(#light-beam-gradient)" strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      {[0, 1, 2].map((i) => (
                        <motion.circle key={`particle-1-${i}`} r="3" fill="#ffd700" opacity="0.8" animate={{ cx: [55, 110], opacity: [0.8, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25, ease: "linear" }} cy={60} />
                      ))}
                    </g>

                    {/* 起偏器 P1 */}
                    <g transform="translate(140, 60)">
                      <circle cx="0" cy="0" r="32" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.3" />
                      <circle cx="0" cy="0" r="28" fill="#22d3ee10" stroke="#22d3ee" strokeWidth="2.5" />
                      <g clipPath="url(#p1-clip)">
                        <defs><clipPath id="p1-clip"><circle cx="0" cy="0" r="26" /></clipPath></defs>
                        {[-20, -12, -4, 4, 12, 20].map((x) => (
                          <line key={x} x1={x} y1="-26" x2={x} y2="26" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" />
                        ))}
                      </g>
                      <line x1="0" y1="-32" x2="0" y2="32" stroke="#22d3ee" strokeWidth="2" />
                      <polygon points="0,-36 -4,-30 4,-30" fill="#22d3ee" />
                      <polygon points="0,36 -4,30 4,30" fill="#22d3ee" />
                      <text x="0" y="52" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="500">P{'\u2081'}</text>
                      <text x="0" y="65" textAnchor="middle" fill="#22d3ee" fontSize="10" opacity="0.8">0{'\u00B0'}</text>
                    </g>

                    {/* P1到P2的偏振光束 */}
                    <g filter="url(#beam-glow-filter)">
                      <motion.line x1="172" y1="60" x2="258" y2="60" stroke="url(#polarized-beam-gradient)" strokeWidth={4 + transmission * 3} strokeLinecap="round" opacity={0.4 + transmission * 0.5} />
                      <motion.g animate={{ x: [180, 250] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
                        <line x1="0" y1="-8" x2="0" y2="8" stroke="#22d3ee" strokeWidth="2" opacity="0.7" />
                      </motion.g>
                    </g>

                    {/* 检偏器 P2 */}
                    <g transform="translate(290, 60)">
                      <circle cx="0" cy="0" r="32" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.3" />
                      <circle cx="0" cy="0" r="28" fill="#a855f710" stroke="#a855f7" strokeWidth="2.5" />
                      <motion.g animate={{ rotate: angle }} transition={{ type: "spring", stiffness: 100, damping: 15 }}>
                        <g clipPath="url(#p2-clip)">
                          <defs><clipPath id="p2-clip"><circle cx="0" cy="0" r="26" /></clipPath></defs>
                          {[-20, -12, -4, 4, 12, 20].map((x) => (
                            <line key={x} x1={x} y1="-26" x2={x} y2="26" stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />
                          ))}
                        </g>
                        <line x1="0" y1="-32" x2="0" y2="32" stroke="#a855f7" strokeWidth="2" />
                        <polygon points="0,-36 -4,-30 4,-30" fill="#a855f7" />
                        <polygon points="0,36 -4,30 4,30" fill="#a855f7" />
                      </motion.g>
                      <text x="0" y="52" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="500">P{'\u2082'}</text>
                      <text x="0" y="65" textAnchor="middle" fill="#a855f7" fontSize="10" opacity="0.8">{angle}{'\u00B0'}</text>
                    </g>

                    {/* P2到探测器的输出光束 */}
                    <g filter="url(#beam-glow-filter)">
                      <motion.line x1="322" y1="60" x2="395" y2="60" stroke="url(#output-beam-gradient)" strokeWidth={2 + transmission * 5} strokeLinecap="round" opacity={0.1 + transmission * 0.8} animate={{ strokeWidth: 2 + transmission * 5, opacity: 0.1 + transmission * 0.8 }} transition={{ duration: 0.3 }} />
                      {transmission > 0.05 && [0, 1, 2].map((i) => (
                        <motion.circle key={`particle-out-${i}`} r={2 + transmission * 2} fill="#a855f7" cy={60} animate={{ cx: [322, 395], opacity: [transmission * 0.8, transmission * 0.2] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2, ease: "linear" }} />
                      ))}
                    </g>

                    {/* 检测器 */}
                    <g transform="translate(430, 60)">
                      <motion.rect x="-22" y="-32" width="44" height="64" rx="6" fill="#a855f7" opacity={transmission * 0.3} filter="url(#detector-glow)" animate={{ opacity: transmission * 0.3 }} />
                      <rect x="-18" y="-28" width="36" height="56" rx="4" fill={transmission > 0.05 ? '#a855f720' : dt.detectorFill} stroke={transmission > 0.05 ? '#a855f7' : dt.axisColor} strokeWidth="2.5" />
                      <motion.rect x="-12" y="-22" width="24" height="44" rx="2" fill="#a855f7" opacity={transmission * 0.6} animate={{ opacity: transmission * 0.6 }} />
                      <text x="0" y="48" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="500">
                        {isZh ? '检测' : 'Detect'}
                      </text>
                    </g>

                    {/* 信息面板 */}
                    <g transform="translate(500, 30)">
                      <rect x="0" y="0" width="90" height="60" rx="8" fill={dt.detectorFill} stroke={dt.axisColor} strokeWidth="1" />
                      <text x="45" y="18" textAnchor="middle" fill={dt.textSecondary} fontSize="10">
                        {isZh ? '夹角' : 'Angle'} {'\u03B8'}
                      </text>
                      <text x="45" y="34" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">
                        {angle}{'\u00B0'}
                      </text>
                      <text x="45" y="52" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="600">
                        I = {(transmission * 100).toFixed(0)}%
                      </text>
                    </g>
                  </g>
                )}
              </svg>
            </VisualizationPanel>

            {/* 强度条 */}
            {showIntensityBar && (
              <div className={`p-4 rounded-2xl border ${dt.panelClass}`}>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${dt.mutedTextClass} w-20`}>{isZh ? '输出光强' : 'Output I'}</span>
                  <div className={`flex-1 h-6 ${dt.barTrackClass} rounded-full overflow-hidden`}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #22d3ee, #fbbf24)`,
                      }}
                      animate={{ width: `${transmission * 100}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <span className="text-lg font-mono font-bold text-cyan-400 w-20 text-right">
                    {(transmission * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label={'\u03B8'} value={angle} unit={'\u00B0'} color="cyan" />
              <StatCard label="cos(\u03B8)" value={Math.cos((angle * Math.PI) / 180).toFixed(4)} color="orange" />
              <StatCard label="cos\u00B2(\u03B8)" value={transmission.toFixed(4)} color="green" />
              <StatCard label="I/I\u2080" value={`${(transmission * 100).toFixed(1)}`} unit="%" color="purple" />
            </div>
          </div>
        }
        controls={
          <div className="space-y-4">
            <ControlPanel title={isZh ? '角度控制' : 'Angle Control'}>
              <SliderControl
                label={isZh ? '偏振片夹角 \u03B8' : 'Polarizer Angle \u03B8'}
                value={angle}
                min={0}
                max={180}
                step={1}
                unit="\u00B0"
                onChange={setAngle}
                color="cyan"
              />

              <PresetButtons
                options={ANGLE_PRESETS}
                value={angle}
                onChange={(v) => setAngle(v as number)}
                columns={4}
              />

              <div className="pt-2">
                <motion.button
                  className={`w-full py-2.5 rounded-2xl font-medium transition-all ${
                    isAnimating
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isAnimating) {
                      setIsAnimating(false)
                    } else {
                      startAnimation()
                    }
                  }}
                >
                  {isAnimating
                    ? isZh ? '停止动画' : 'Stop Animation'
                    : isZh ? '自动扫描' : 'Auto Scan'}
                </motion.button>
              </div>
            </ControlPanel>

            <ControlPanel title={isZh ? '显示选项' : 'Display Options'}>
              <Toggle
                label={isZh ? '显示关键点' : 'Show Key Points'}
                checked={showKeyPoints}
                onChange={setShowKeyPoints}
              />
              <Toggle
                label={isZh ? '显示强度条' : 'Show Intensity Bar'}
                checked={showIntensityBar}
                onChange={setShowIntensityBar}
              />
              <Toggle
                label={isZh ? '显示偏振片示意' : 'Show Polarizer Diagram'}
                checked={showPolarizers}
                onChange={setShowPolarizers}
              />
            </ControlPanel>

            <ControlPanel title={isZh ? '计算结果' : 'Calculation Results'}>
              <AnimatedValue label={'\u03B8'} value={angle} unit={'\u00B0'} decimals={0} color="cyan" />
              <AnimatedValue label="cos(\u03B8)" value={Math.cos((angle * Math.PI) / 180)} decimals={4} color="orange" />
              <AnimatedValue label="cos\u00B2(\u03B8)" value={transmission} decimals={4} color="green" />
              <AnimatedValue label="I/I\u2080" value={transmission * 100} unit="%" decimals={1} color="purple" showBar max={100} />
            </ControlPanel>

            <TipBanner color="cyan">
              {isZh
                ? '\u03B8 = 0\u00B0 时完全透射，\u03B8 = 90\u00B0 时完全消光，\u03B8 = 45\u00B0 时光强减半。'
                : 'Full transmission at \u03B8 = 0\u00B0, full extinction at \u03B8 = 90\u00B0, half intensity at \u03B8 = 45\u00B0.'}
            </TipBanner>

            <InfoCard title={isZh ? '马吕斯定律' : "Malus's Law"} color="cyan">
              <Formula highlight>I = I{'\u2080'} {'\u00D7'} cos{'\u00B2'}({'\u03B8'})</Formula>
              <div className={`mt-3 text-xs ${dt.mutedTextClass} space-y-1`}>
                <p>
                  {isZh
                    ? '其中 \u03B8 是入射偏振光与偏振片透光轴的夹角'
                    : 'Where \u03B8 is angle between incident polarization and filter axis'}
                </p>
                <p className="text-cyan-400">
                  {'\u2022'} {'\u03B8'} = 0{'\u00B0'}: I = I{'\u2080'} (100%)
                </p>
                <p className="text-yellow-400">
                  {'\u2022'} {'\u03B8'} = 45{'\u00B0'}: I = I{'\u2080'}/2 (50%)
                </p>
                <p className="text-red-400">
                  {'\u2022'} {'\u03B8'} = 90{'\u00B0'}: I = 0 (0%)
                </p>
              </div>
            </InfoCard>
          </div>
        }
      />

      {/* 知识卡片 */}
      <InfoGrid columns={3}>
        <InfoCard title={isZh ? '关键特点' : 'Key Features'} color="cyan">
          <ul className={`text-xs ${dt.bodyClass} space-y-1.5`}>
            <li>{'\u2022'} {isZh ? '曲线关于\u03B8=90\u00B0对称' : 'Curve symmetric about \u03B8=90\u00B0'}</li>
            <li>{'\u2022'} {isZh ? '最大值在\u03B8=0\u00B0和180\u00B0' : 'Maximum at \u03B8=0\u00B0 and 180\u00B0'}</li>
            <li>{'\u2022'} {isZh ? '最小值在\u03B8=90\u00B0（完全消光）' : 'Minimum at \u03B8=90\u00B0 (extinction)'}</li>
            <li>{'\u2022'} {isZh ? '半强度点在\u03B8=45\u00B0和135\u00B0' : 'Half-intensity at \u03B8=45\u00B0 and 135\u00B0'}</li>
          </ul>
        </InfoCard>

        <InfoCard title={isZh ? '物理意义' : 'Physical Meaning'} color="purple">
          <ul className={`text-xs ${dt.bodyClass} space-y-1.5`}>
            <li>{'\u2022'} {isZh ? 'cos(\u03B8)代表电场分量的投影' : 'cos(\u03B8) = E-field component projection'}</li>
            <li>{'\u2022'} {isZh ? '光强与电场幅度的平方成正比' : 'Intensity \u221D E-field amplitude\u00B2'}</li>
            <li>{'\u2022'} {isZh ? '因此光强与cos\u00B2(\u03B8)成正比' : 'Therefore intensity \u221D cos\u00B2(\u03B8)'}</li>
          </ul>
        </InfoCard>

        <InfoCard title={isZh ? '实际应用' : 'Applications'} color="green">
          <ul className={`text-xs ${dt.bodyClass} space-y-1.5`}>
            <li>{'\u2022'} {isZh ? '偏振眼镜减少眩光' : 'Polarized sunglasses reduce glare'}</li>
            <li>{'\u2022'} {isZh ? 'LCD显示器亮度控制' : 'LCD brightness control'}</li>
            <li>{'\u2022'} {isZh ? '光学仪器中的光强调节' : 'Light intensity modulation in optics'}</li>
            <li>{'\u2022'} {isZh ? '偏振光显微镜' : 'Polarized light microscopy'}</li>
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
