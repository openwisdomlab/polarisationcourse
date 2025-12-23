/**
 * PolarizationTypesUnifiedDemo - 偏振类型统一演示
 * 合并原有的 PolarizationTypesDemo（偏振类型）和 ThreePolarizersDemo（三偏振片悖论）
 *
 * Features:
 * - Tab-based navigation between Polarization Types and Three-Polarizer Paradox
 * - Interactive visualization of linear, circular, elliptical polarization
 * - Three polarizer experiment with Malus's Law calculations
 * - Haptic audio feedback for precision angles
 * - Difficulty-aware content display
 */
import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles, FlaskConical, Volume2, VolumeX } from 'lucide-react'
import { useHapticAudio } from '@/hooks/useHapticAudio'
import {
  ControlPanel,
  SliderControl,
  Toggle,
  InfoCard,
  Formula,
  PresetButtons,
  AnimatedValue,
} from '../DemoControls'
import { DifficultyLevel, useDifficultyConfig, WhyButton, DifficultyGate, TaskModeWrapper } from '../DifficultyStrategy'

type ViewMode = 'types' | 'paradox'
type PolarizationType = 'linear' | 'circular' | 'elliptical'

// Polarizer visualization component
interface PolarizerVisualizerProps {
  x: number
  angle: number
  label: string
  color: string
  isActive: boolean
  showLines?: boolean
}

function PolarizerVisualizer({
  x,
  angle,
  label,
  color,
  isActive,
  showLines = true,
}: PolarizerVisualizerProps) {
  const lineCount = 7
  const radius = 35

  return (
    <g transform={`translate(${x}, 150)`}>
      <motion.ellipse
        cx="0"
        cy="0"
        rx={radius}
        ry={radius * 1.2}
        fill={isActive ? `${color}15` : '#1e293b'}
        stroke={isActive ? color : '#475569'}
        strokeWidth={isActive ? 2 : 1}
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      />
      {showLines && (
        <g transform={`rotate(${angle})`}>
          {Array.from({ length: lineCount }, (_, i) => {
            const yOffset = ((i - Math.floor(lineCount / 2)) / (lineCount / 2)) * radius * 0.9
            const xLength = Math.sqrt(radius * radius - yOffset * yOffset) * 0.85
            return (
              <line
                key={i}
                x1={-xLength}
                y1={yOffset}
                x2={xLength}
                y2={yOffset}
                stroke={isActive ? color : '#64748b'}
                strokeWidth={1.5}
                opacity={isActive ? 0.8 : 0.4}
              />
            )
          })}
          <line x1="0" y1={-radius - 8} x2="0" y2={radius + 8} stroke={color} strokeWidth="2" opacity="0.7" />
          <polygon points="0,-47 -4,-40 4,-40" fill={color} opacity="0.7" />
          <polygon points="0,47 -4,40 4,40" fill={color} opacity="0.7" />
        </g>
      )}
      <text x="0" y={radius + 25} textAnchor="middle" fill="#9ca3af" fontSize="11">
        {label}
      </text>
      <text x="0" y={radius + 40} textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">
        {angle}°
      </text>
    </g>
  )
}

// Light beam component
interface LightBeamProps {
  x1: number
  x2: number
  intensity: number
  polarization: number
  showPolarization: boolean
}

function getPolarizationColor(angle: number): string {
  const normalizedAngle = ((angle % 180) + 180) % 180
  if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
  if (normalizedAngle < 67.5) return '#ffaa00'
  if (normalizedAngle < 112.5) return '#44ff44'
  return '#4444ff'
}

function LightBeam({ x1, x2, intensity, polarization, showPolarization }: LightBeamProps) {
  const y = 150
  const color = showPolarization ? getPolarizationColor(polarization) : '#ffd700'
  const strokeWidth = Math.max(1, intensity * 8)
  const opacity = Math.max(0.1, intensity)

  return (
    <g>
      <motion.line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={color}
        strokeWidth={strokeWidth * 3}
        strokeOpacity={opacity * 0.3}
        strokeLinecap="round"
      />
      {showPolarization && intensity > 0.1 && (
        <g transform={`translate(${(x1 + x2) / 2}, ${y})`}>
          <line
            x1={-15 * Math.cos((polarization * Math.PI) / 180)}
            y1={-15 * Math.sin((polarization * Math.PI) / 180)}
            x2={15 * Math.cos((polarization * Math.PI) / 180)}
            y2={15 * Math.sin((polarization * Math.PI) / 180)}
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        </g>
      )}
    </g>
  )
}

// Presets for three polarizer experiment
const POLARIZER_PRESETS = [
  { name: 'Crossed (0°-90°)', nameZh: '正交（0°-90°）', p1: 0, p2: null, p3: 90 },
  { name: 'With 45° Middle', nameZh: '加入45°中间片', p1: 0, p2: 45, p3: 90 },
  { name: 'With 30° Middle', nameZh: '加入30°中间片', p1: 0, p2: 30, p3: 90 },
  { name: 'Aligned (All 0°)', nameZh: '全对齐（全0°）', p1: 0, p2: 0, p3: 0 },
]

interface Props {
  difficultyLevel?: DifficultyLevel
}

export function PolarizationTypesUnifiedDemo({ difficultyLevel = 'application' }: Props) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const config = useDifficultyConfig(difficultyLevel)

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('types')

  // Haptic audio
  const { checkAngle, initAudio, isAudioEnabled, toggleAudio } = useHapticAudio({
    snapAngles: [0, 30, 45, 60, 90, 120, 135, 150, 180],
    angleThreshold: 2.5,
    volume: 0.12,
    pitchVariation: true,
  })

  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleFirstInteraction)
    }
    document.addEventListener('click', handleFirstInteraction)
    return () => document.removeEventListener('click', handleFirstInteraction)
  }, [initAudio])

  // ===== Types View States =====
  const [polarizationType, setPolarizationType] = useState<PolarizationType>('linear')
  const [linearAngle, setLinearAngle] = useState(45)
  const [ellipseRatio, setEllipseRatio] = useState(0.5)
  const [circularDirection, setCircularDirection] = useState<'right' | 'left'>('right')
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [showTrail, setShowTrail] = useState(true)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // ===== Paradox View States =====
  const [polarizer1Angle, setPolarizer1Angle] = useState(0)
  const [polarizer2Angle, setPolarizer2Angle] = useState<number | null>(45)
  const [polarizer3Angle, setPolarizer3Angle] = useState(90)
  const [showMiddlePolarizer, setShowMiddlePolarizer] = useState(true)
  const [showPolarization, setShowPolarization] = useState(true)
  const [showFormulas, setShowFormulas] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1)

  // Task completion for Application mode
  const [taskCompleted, setTaskCompleted] = useState(false)

  // Animation loop for Types view
  useEffect(() => {
    if (!isPlaying || animationSpeed === 0 || viewMode !== 'types') return
    const interval = setInterval(() => {
      setTime(t => t + 0.05 * animationSpeed)
    }, 16)
    return () => clearInterval(interval)
  }, [isPlaying, animationSpeed, viewMode])

  // Calculate E-field position for Types view
  const { ex, ey, trailPath } = useMemo(() => {
    const radius = 100
    const phase = time * 2
    let ex = 0, ey = 0
    const trailPoints: string[] = []

    if (polarizationType === 'linear') {
      const angleRad = (linearAngle * Math.PI) / 180
      const oscillation = Math.sin(phase)
      ex = radius * Math.cos(angleRad) * oscillation
      ey = -radius * Math.sin(angleRad) * oscillation
      for (let t = 0; t < 100; t++) {
        const p = (time - t * 0.01) * 2
        const osc = Math.sin(p)
        trailPoints.push(`${200 + radius * Math.cos(angleRad) * osc},${200 - radius * Math.sin(angleRad) * osc}`)
      }
    } else if (polarizationType === 'circular') {
      const direction = circularDirection === 'right' ? 1 : -1
      ex = radius * Math.cos(phase)
      ey = -radius * Math.sin(phase * direction)
      for (let t = 0; t < 100; t++) {
        const p = (time - t * 0.01) * 2
        trailPoints.push(`${200 + radius * Math.cos(p)},${200 - radius * Math.sin(p * direction)}`)
      }
    } else {
      const direction = circularDirection === 'right' ? 1 : -1
      ex = radius * Math.cos(phase)
      ey = -radius * ellipseRatio * Math.sin(phase * direction)
      for (let t = 0; t < 100; t++) {
        const p = (time - t * 0.01) * 2
        trailPoints.push(`${200 + radius * Math.cos(p)},${200 - radius * ellipseRatio * Math.sin(p * direction)}`)
      }
    }

    return {
      ex: 200 + ex,
      ey: 200 + ey,
      trailPath: `M ${trailPoints.join(' L ')}`,
    }
  }, [time, polarizationType, linearAngle, ellipseRatio, circularDirection])

  // Reference shape path for Types view
  const referencePath = useMemo(() => {
    const radius = 100
    if (polarizationType === 'linear') {
      const angleRad = (linearAngle * Math.PI) / 180
      const x1 = 200 - radius * Math.cos(angleRad)
      const y1 = 200 + radius * Math.sin(angleRad)
      const x2 = 200 + radius * Math.cos(angleRad)
      const y2 = 200 - radius * Math.sin(angleRad)
      return `M ${x1},${y1} L ${x2},${y2}`
    } else if (polarizationType === 'circular') {
      return `M 300,200 A 100,100 0 1,1 299.99,200`
    } else {
      const ry = radius * ellipseRatio
      return `M 300,200 A 100,${ry} 0 1,1 299.99,200`
    }
  }, [polarizationType, linearAngle, ellipseRatio])

  // Calculate light intensity for Paradox view
  const calculations = useMemo(() => {
    const I0 = 1
    const I1 = I0 * 0.5
    const pol1 = polarizer1Angle

    if (!showMiddlePolarizer || polarizer2Angle === null) {
      const angleDiff = Math.abs(polarizer3Angle - polarizer1Angle) % 180
      const theta = Math.min(angleDiff, 180 - angleDiff) * (Math.PI / 180)
      const I2 = I1 * Math.cos(theta) ** 2
      return {
        I0, I1, I2: null, I3: I2, pol1, pol2: null, pol3: polarizer3Angle,
        theta1: null, theta2: angleDiff, transmission: I2 / I0,
      }
    } else {
      const angleDiff1 = Math.abs(polarizer2Angle - polarizer1Angle) % 180
      const theta1 = Math.min(angleDiff1, 180 - angleDiff1) * (Math.PI / 180)
      const I2 = I1 * Math.cos(theta1) ** 2

      const angleDiff2 = Math.abs(polarizer3Angle - polarizer2Angle) % 180
      const theta2 = Math.min(angleDiff2, 180 - angleDiff2) * (Math.PI / 180)
      const I3 = I2 * Math.cos(theta2) ** 2

      return {
        I0, I1, I2, I3, pol1, pol2: polarizer2Angle, pol3: polarizer3Angle,
        theta1: angleDiff1, theta2: angleDiff2, transmission: I3 / I0,
      }
    }
  }, [polarizer1Angle, polarizer2Angle, polarizer3Angle, showMiddlePolarizer])

  // Check task completion
  useEffect(() => {
    if (viewMode === 'paradox' && calculations.transmission > 0.1 && showMiddlePolarizer) {
      setTaskCompleted(true)
    }
  }, [viewMode, calculations.transmission, showMiddlePolarizer])

  // Handle angle changes with haptic feedback
  const handleAngleChange = useCallback((setter: (v: number) => void, value: number) => {
    setter(value)
    checkAngle(value)
  }, [checkAngle])

  // Handle preset selection
  const handlePresetSelect = useCallback((index: number) => {
    const preset = POLARIZER_PRESETS[index]
    setSelectedPreset(index)
    setPolarizer1Angle(preset.p1)
    setPolarizer3Angle(preset.p3)
    if (preset.p2 !== null) {
      setShowMiddlePolarizer(true)
      setPolarizer2Angle(preset.p2)
    } else {
      setShowMiddlePolarizer(false)
      setPolarizer2Angle(null)
    }
  }, [])

  const getTypeLabel = (type: PolarizationType) => {
    if (type === 'linear') return isZh ? '线偏振' : 'Linear'
    if (type === 'circular') return circularDirection === 'right' ? (isZh ? '右旋圆偏振' : 'Right Circular') : (isZh ? '左旋圆偏振' : 'Left Circular')
    return isZh ? '椭圆偏振' : 'Elliptical'
  }

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg w-fit">
        <button
          onClick={() => setViewMode('types')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'types'
              ? 'bg-orange-500/20 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isZh ? '偏振类型' : 'Polarization Types'}</span>
        </button>
        <button
          onClick={() => setViewMode('paradox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'paradox'
              ? 'bg-purple-500/20 text-purple-400 shadow-sm'
              : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{isZh ? '三偏振片悖论' : 'Three-Polarizer Paradox'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'types' ? (
          <motion.div
            key="types"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Types View */}
            <div className="flex gap-6 flex-col lg:flex-row">
              <div className="flex-1">
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-xl border border-indigo-500/20 p-4">
                  <svg viewBox="0 0 400 400" className="w-full h-auto max-w-[400px] mx-auto">
                    <defs>
                      <filter id="glow-cyan">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <linearGradient id="trail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>

                    {/* Axes */}
                    <line x1="70" y1="200" x2="330" y2="200" stroke="#4b5563" strokeWidth="1.5" />
                    <line x1="200" y1="70" x2="200" y2="330" stroke="#4b5563" strokeWidth="1.5" />
                    <polygon points="330,200 320,195 320,205" fill="#4b5563" />
                    <polygon points="200,70 195,80 205,80" fill="#4b5563" />
                    <text x="340" y="205" fill="#9ca3af" fontSize="14">Ex</text>
                    <text x="205" y="60" fill="#9ca3af" fontSize="14">Ey</text>

                    {/* Reference shape */}
                    <path d={referencePath} fill="none" stroke="#4b5563" strokeWidth="1" strokeDasharray="5 5" />

                    {/* Trail */}
                    {showTrail && (
                      <motion.path d={trailPath} fill="none" stroke="url(#trail-gradient)" strokeWidth="2" />
                    )}

                    {/* E-field vector */}
                    <motion.line x1="200" y1="200" x2={ex} y2={ey} stroke="#22d3ee" strokeWidth="3" filter="url(#glow-cyan)" />
                    <circle cx={ex} cy={ey} r="6" fill="#22d3ee" filter="url(#glow-cyan)" />
                    <motion.circle cx={ex} cy={ey} r="4" fill="#fbbf24" filter="url(#glow-cyan)" />
                    <circle cx="200" cy="200" r="4" fill="#9ca3af" />

                    {/* Label */}
                    <text x="20" y="30" fill="#9ca3af" fontSize="14">{getTypeLabel(polarizationType)}</text>
                    <text x="320" y="30" fill="#6b7280" fontSize="12">
                      φ = {((time * 2 * 180 / Math.PI) % 360).toFixed(0)}°
                    </text>
                  </svg>
                </div>

                {/* Type selector */}
                <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">{isZh ? '偏振类型' : 'Polarization Type'}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {(['linear', 'circular', 'elliptical'] as PolarizationType[]).map((type) => {
                      const colors = {
                        linear: { active: 'bg-orange-400/20 border-orange-400/50 text-orange-400', inactive: 'hover:border-orange-400/30' },
                        circular: { active: 'bg-green-400/20 border-green-400/50 text-green-400', inactive: 'hover:border-green-400/30' },
                        elliptical: { active: 'bg-purple-400/20 border-purple-400/50 text-purple-400', inactive: 'hover:border-purple-400/30' },
                      }
                      const labels = { linear: isZh ? '线偏振' : 'Linear', circular: isZh ? '圆偏振' : 'Circular', elliptical: isZh ? '椭圆偏振' : 'Elliptical' }

                      return (
                        <motion.button
                          key={type}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                            polarizationType === type
                              ? colors[type].active
                              : `bg-slate-700/50 text-gray-400 border-slate-600/50 ${colors[type].inactive}`
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPolarizationType(type)}
                        >
                          {labels[type]}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <ControlPanel title={isZh ? '参数' : 'Parameters'} className="w-full lg:w-72">
                {polarizationType === 'linear' && (
                  <SliderControl
                    label={isZh ? '偏振角度' : 'Polarization Angle'}
                    value={linearAngle}
                    min={0}
                    max={180}
                    step={15}
                    unit="°"
                    onChange={(v) => handleAngleChange(setLinearAngle, v)}
                    color="orange"
                  />
                )}

                {(polarizationType === 'circular' || polarizationType === 'elliptical') && (
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400">{isZh ? '旋转方向' : 'Rotation Direction'}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          circularDirection === 'right'
                            ? 'bg-green-400/20 text-green-400 border-green-400/50'
                            : 'bg-slate-700/50 text-gray-400 border-slate-600/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setCircularDirection('right')}
                      >
                        {isZh ? '右旋' : 'Right'}
                      </motion.button>
                      <motion.button
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          circularDirection === 'left'
                            ? 'bg-purple-400/20 text-purple-400 border-purple-400/50'
                            : 'bg-slate-700/50 text-gray-400 border-slate-600/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setCircularDirection('left')}
                      >
                        {isZh ? '左旋' : 'Left'}
                      </motion.button>
                    </div>
                  </div>
                )}

                {polarizationType === 'elliptical' && (
                  <SliderControl
                    label={isZh ? '椭圆率' : 'Ellipse Ratio'}
                    value={ellipseRatio}
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    onChange={setEllipseRatio}
                    color="purple"
                  />
                )}

                <SliderControl
                  label={isZh ? '动画速度' : 'Animation Speed'}
                  value={animationSpeed}
                  min={0}
                  max={2}
                  step={0.25}
                  onChange={setAnimationSpeed}
                  color="cyan"
                />

                <Toggle label={isZh ? '显示轨迹' : 'Show Trail'} checked={showTrail} onChange={setShowTrail} />

                <motion.button
                  className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                    isPlaying
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (isZh ? '暂停' : 'Pause') : (isZh ? '播放' : 'Play')}
                </motion.button>

                <motion.button
                  className="w-full py-2 rounded-lg text-sm text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all mt-2"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setViewMode('paradox')}
                >
                  {isZh ? '探索三偏振片悖论 →' : 'Explore Three-Polarizer Paradox →'}
                </motion.button>
              </ControlPanel>
            </div>

            {/* Foundation: Why button */}
            <DifficultyGate level="foundation" currentLevel={difficultyLevel}>
              <WhyButton className="mt-4">
                <div className="space-y-2 text-sm">
                  <p>{isZh ? '光是电磁波，电场可以在不同方向振动。偏振就是描述电场振动方向的方式！' : 'Light is an EM wave with electric fields oscillating in different directions. Polarization describes how the E-field oscillates!'}</p>
                  <p>{isZh ? '线偏振像钟摆一样来回摆动，圆偏振像旋转的绳子，椭圆偏振介于两者之间。' : 'Linear is like a pendulum swinging back and forth, circular is like a spinning rope, elliptical is in between.'}</p>
                </div>
              </WhyButton>
            </DifficultyGate>

            {/* Info cards */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title={isZh ? '线偏振' : 'Linear Polarization'} color={polarizationType === 'linear' ? 'orange' : 'cyan'}>
                <p className="text-xs text-gray-300">{isZh ? '电场在固定平面内振荡，如同钟摆运动。' : 'E-field oscillates in a fixed plane, like a pendulum.'}</p>
              </InfoCard>
              <InfoCard title={isZh ? '圆偏振' : 'Circular Polarization'} color={polarizationType === 'circular' ? 'green' : 'cyan'}>
                <p className="text-xs text-gray-300">{isZh ? '电场矢量端点描绘圆形轨迹，等振幅、相位差90°。' : 'E-field tip traces a circle, equal amplitudes with 90° phase difference.'}</p>
              </InfoCard>
              <InfoCard title={isZh ? '椭圆偏振' : 'Elliptical Polarization'} color={polarizationType === 'elliptical' ? 'purple' : 'cyan'}>
                <p className="text-xs text-gray-300">{isZh ? '最一般的偏振态，线偏振和圆偏振是特例。' : 'Most general state; linear and circular are special cases.'}</p>
              </InfoCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="paradox"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Paradox View */}
            <DifficultyGate level="application" currentLevel={difficultyLevel}>
              <TaskModeWrapper
                taskTitle="Make Light Pass Through!"
                taskTitleZh="让光通过！"
                taskDescription="Add a 45° polarizer between two crossed polarizers to let light through."
                taskDescriptionZh="在两个正交偏振片之间加入45°偏振片，让光通过。"
                isCompleted={taskCompleted}
              >
                <div />
              </TaskModeWrapper>
            </DifficultyGate>

            <div className="flex gap-6 flex-col lg:flex-row">
              <div className="flex-1">
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-xl border border-blue-500/20 p-4 overflow-hidden">
                  <svg viewBox="0 0 700 320" className="w-full h-auto" style={{ minHeight: '300px' }}>
                    <defs>
                      <pattern id="three-pol-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,150,255,0.05)" strokeWidth="1" />
                      </pattern>
                    </defs>

                    <rect width="700" height="320" fill="url(#three-pol-grid)" />

                    <text x="350" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">
                      {isZh ? '三偏振片实验' : 'Three Polarizer Experiment'}
                    </text>

                    {/* Light source */}
                    <g transform="translate(50, 150)">
                      <motion.circle cx="0" cy="0" r="20" fill="#ffd700" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                      <circle cx="0" cy="0" r="15" fill="#fff" opacity="0.5" />
                      <text x="0" y="45" textAnchor="middle" fill="#9ca3af" fontSize="11">{isZh ? '非偏振光' : 'Unpolarized'}</text>
                      <text x="0" y="60" textAnchor="middle" fill="#ffd700" fontSize="11">I₀ = 100%</text>
                    </g>

                    {/* Light beams */}
                    <LightBeam x1={70} x2={130} intensity={calculations.I0} polarization={0} showPolarization={false} />
                    <LightBeam x1={200} x2={showMiddlePolarizer ? 280 : 430} intensity={calculations.I1} polarization={calculations.pol1} showPolarization={showPolarization} />
                    {showMiddlePolarizer && calculations.I2 !== null && (
                      <LightBeam x1={350} x2={430} intensity={calculations.I2} polarization={calculations.pol2 || 0} showPolarization={showPolarization} />
                    )}
                    <LightBeam x1={500} x2={650} intensity={calculations.I3} polarization={calculations.pol3} showPolarization={showPolarization} />

                    {/* Polarizers */}
                    <PolarizerVisualizer x={165} angle={polarizer1Angle} label={isZh ? '起偏器 P₁' : 'P₁'} color="#22d3ee" isActive={true} />
                    <AnimatePresence>
                      {showMiddlePolarizer && polarizer2Angle !== null && (
                        <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                          <PolarizerVisualizer x={315} angle={polarizer2Angle} label={isZh ? '中间片 P₂' : 'P₂'} color="#fbbf24" isActive={true} />
                        </motion.g>
                      )}
                    </AnimatePresence>
                    <PolarizerVisualizer x={465} angle={polarizer3Angle} label={isZh ? '检偏器 P₃' : 'P₃'} color="#4ade80" isActive={true} />

                    {/* Detector */}
                    <g transform="translate(610, 150)">
                      <rect x="-20" y="-25" width="40" height="50" rx="4" fill={calculations.I3 > 0.01 ? '#22c55e20' : '#1e293b'} stroke={calculations.I3 > 0.01 ? '#22c55e' : '#475569'} strokeWidth="2" />
                      <text x="0" y="45" textAnchor="middle" fill="#9ca3af" fontSize="11">{isZh ? '探测器' : 'Detector'}</text>
                      <text x="0" y="60" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">{(calculations.transmission * 100).toFixed(1)}%</text>
                    </g>

                    {/* Intensity labels */}
                    <text x="165" y="90" textAnchor="middle" fill="#22d3ee" fontSize="10">I₁ = 50%</text>
                    {showMiddlePolarizer && calculations.I2 !== null && (
                      <text x="315" y="90" textAnchor="middle" fill="#fbbf24" fontSize="10">I₂ = {(calculations.I2 * 100).toFixed(1)}%</text>
                    )}
                    <text x="465" y="90" textAnchor="middle" fill="#4ade80" fontSize="10">I₃ = {(calculations.I3 * 100).toFixed(1)}%</text>
                  </svg>
                </div>

                {/* Intensity bars */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <AnimatedValue label={isZh ? '初始光强' : 'Initial I₀'} value={100} unit="%" decimals={0} color="orange" showBar max={100} />
                  <AnimatedValue label={isZh ? 'P₁后' : 'After P₁'} value={calculations.I1 * 100} unit="%" decimals={1} color="cyan" showBar max={100} />
                  {showMiddlePolarizer && calculations.I2 !== null && (
                    <AnimatedValue label={isZh ? 'P₂后' : 'After P₂'} value={calculations.I2 * 100} unit="%" decimals={1} color="orange" showBar max={100} />
                  )}
                  <AnimatedValue label={isZh ? '透射率' : 'Transmission'} value={calculations.transmission * 100} unit="%" decimals={1} color="green" showBar max={100} />
                </div>
              </div>

              <div className="w-full lg:w-80 space-y-4">
                <ControlPanel title={isZh ? '预设实验' : 'Presets'}>
                  <PresetButtons
                    options={POLARIZER_PRESETS.map((p, i) => ({ value: i, label: isZh ? p.nameZh : p.name }))}
                    value={selectedPreset ?? -1}
                    onChange={(v) => handlePresetSelect(v as number)}
                    columns={2}
                  />
                </ControlPanel>

                <ControlPanel title={isZh ? '偏振片角度' : 'Polarizer Angles'}>
                  <SliderControl label="P₁" value={polarizer1Angle} min={0} max={180} step={5} unit="°"
                    onChange={(v) => { handleAngleChange(setPolarizer1Angle, v); setSelectedPreset(null) }} color="cyan" />

                  <Toggle label={isZh ? '启用中间片 P₂' : 'Enable Middle P₂'} checked={showMiddlePolarizer}
                    onChange={(v) => { setShowMiddlePolarizer(v); if (v && polarizer2Angle === null) setPolarizer2Angle(45); setSelectedPreset(null) }} />

                  {showMiddlePolarizer && polarizer2Angle !== null && (
                    <SliderControl label="P₂" value={polarizer2Angle} min={0} max={180} step={5} unit="°"
                      onChange={(v) => { handleAngleChange((val) => setPolarizer2Angle(val), v); setSelectedPreset(null) }} color="orange" />
                  )}

                  <SliderControl label="P₃" value={polarizer3Angle} min={0} max={180} step={5} unit="°"
                    onChange={(v) => { handleAngleChange(setPolarizer3Angle, v); setSelectedPreset(null) }} color="green" />
                </ControlPanel>

                <ControlPanel title={isZh ? '显示选项' : 'Display Options'}>
                  <Toggle label={isZh ? '偏振颜色' : 'Polarization Colors'} checked={showPolarization} onChange={setShowPolarization} />
                  <Toggle label={isZh ? '公式标注' : 'Show Formulas'} checked={showFormulas} onChange={setShowFormulas} />

                  <div className="pt-2 border-t border-slate-700/50 mt-2">
                    <button onClick={toggleAudio}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full transition-colors ${
                        isAudioEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700/50 text-gray-400'
                      }`}
                    >
                      {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      <span>{isZh ? '角度咔哒声' : 'Angle Clicks'}</span>
                    </button>
                  </div>
                </ControlPanel>

                {showFormulas && config.showFormula && (
                  <InfoCard title={isZh ? '马吕斯定律' : "Malus's Law"} color="cyan">
                    <Formula highlight>I = I₀ × cos²(θ)</Formula>
                    <div className="mt-3 space-y-2 text-xs text-slate-400">
                      {showMiddlePolarizer ? (
                        <>
                          <p className="font-mono text-cyan-400">I₁ = I₀ × 0.5 = 50%</p>
                          <p className="font-mono text-orange-400">I₂ = I₁ × cos²({calculations.theta1}°) = {((calculations.I2 || 0) * 100).toFixed(1)}%</p>
                          <p className="font-mono text-green-400">I₃ = I₂ × cos²({calculations.theta2}°) = {(calculations.I3 * 100).toFixed(1)}%</p>
                        </>
                      ) : (
                        <>
                          <p className="font-mono text-cyan-400">I₁ = I₀ × 0.5 = 50%</p>
                          <p className="font-mono text-green-400">I₃ = I₁ × cos²({calculations.theta2}°) = {(calculations.I3 * 100).toFixed(1)}%</p>
                        </>
                      )}
                    </div>
                  </InfoCard>
                )}
              </div>
            </div>

            {/* Foundation: Why button */}
            <DifficultyGate level="foundation" currentLevel={difficultyLevel}>
              <WhyButton className="mt-4">
                <div className="space-y-2 text-sm">
                  <p>{isZh ? '两个正交（90°）的偏振片会完全阻挡光线。但神奇的是...' : 'Two crossed (90°) polarizers completely block light. But the magic is...'}</p>
                  <p>{isZh ? '在中间加入一个45°偏振片，光反而能通过了！这是因为每个偏振片都会"重新定向"光的偏振方向。' : 'Adding a 45° polarizer in between allows light through! Each polarizer "redirects" the polarization direction.'}</p>
                </div>
              </WhyButton>
            </DifficultyGate>

            {/* Knowledge cards */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title={isZh ? '三偏振片悖论' : 'The Paradox'} color="purple">
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>• {isZh ? '两个正交偏振片完全阻挡光' : 'Crossed polarizers block all light'}</li>
                  <li>• {isZh ? '加入45°偏振片，反而有光通过！' : 'Adding 45° polarizer allows light through!'}</li>
                  <li>• {isZh ? '最大透射率：0°→45°→90° = 12.5%' : 'Max transmission: 0°→45°→90° = 12.5%'}</li>
                </ul>
              </InfoCard>
              <InfoCard title={isZh ? '物理解释' : 'Physical Explanation'} color="cyan">
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>• {isZh ? '偏振片不只"过滤"，还"重新定向"' : 'Polarizers redirect, not just filter'}</li>
                  <li>• {isZh ? '中间片将0°偏振光转为45°' : 'Middle polarizer converts 0° to 45°'}</li>
                  <li>• {isZh ? '45°偏振光可部分通过90°偏振片' : '45° light can partially pass 90° polarizer'}</li>
                </ul>
              </InfoCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PolarizationTypesUnifiedDemo
