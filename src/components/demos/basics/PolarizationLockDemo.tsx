/**
 * PolarizationLockDemo - 偏振密码锁交互演示
 *
 * 融合真实场景、物理定律和密码探索的完整体验
 * - 拖拽旋转偏振片来寻找"密码角度"
 * - 解锁后展示马吕斯定律的完整推导
 * - 多关卡设计，逐步深入物理原理
 */
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Lock, Unlock, ChevronRight, RotateCcw, Award, Lightbulb } from 'lucide-react'
import { InfoCard, Formula } from '../DemoControls'

// 关卡定义
interface Level {
  id: number
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  targetIntensity: number // 目标光强百分比
  tolerance: number // 容差
  p1Angle: number // 起偏器角度（固定）
  hint?: { en: string; zh: string }
  formulaReveal: {
    titleEn: string
    titleZh: string
    steps: Array<{ en: string; zh: string; formula?: string }>
  }
}

const LEVELS: Level[] = [
  {
    id: 1,
    nameEn: 'First Lock',
    nameZh: '第一道锁',
    descriptionEn: 'Rotate P₂ to let exactly 50% of light through',
    descriptionZh: '旋转P₂使恰好50%的光通过',
    targetIntensity: 50,
    tolerance: 3,
    p1Angle: 0,
    hint: {
      en: 'When θ = 45°, cos²(45°) = 0.5',
      zh: '当 θ = 45° 时，cos²(45°) = 0.5'
    },
    formulaReveal: {
      titleEn: "Malus's Law Discovery",
      titleZh: '马吕斯定律的发现',
      steps: [
        { en: 'Light is an electromagnetic wave', zh: '光是一种电磁波', formula: 'E = E₀ sin(ωt)' },
        { en: 'Electric field component along polarizer axis', zh: '沿偏振片轴的电场分量', formula: 'E_∥ = E₀ cos(θ)' },
        { en: 'Intensity is proportional to E²', zh: '光强与电场平方成正比', formula: 'I ∝ E²' },
        { en: "Therefore, Malus's Law:", zh: '因此，马吕斯定律：', formula: 'I = I₀ × cos²(θ)' },
      ]
    }
  },
  {
    id: 2,
    nameEn: 'Precision Lock',
    nameZh: '精密锁',
    descriptionEn: 'Find the angle that gives 75% transmission',
    descriptionZh: '找到让75%光通过的角度',
    targetIntensity: 75,
    tolerance: 3,
    p1Angle: 0,
    hint: {
      en: 'cos²(30°) = 0.75, so θ = 30°',
      zh: 'cos²(30°) = 0.75，所以 θ = 30°'
    },
    formulaReveal: {
      titleEn: 'Inverse Calculation',
      titleZh: '逆向计算',
      steps: [
        { en: 'Given target intensity I/I₀ = 0.75', zh: '给定目标光强 I/I₀ = 0.75' },
        { en: 'From Malus\'s Law: cos²(θ) = 0.75', zh: '由马吕斯定律：cos²(θ) = 0.75' },
        { en: 'Therefore: cos(θ) = √0.75 ≈ 0.866', zh: '因此：cos(θ) = √0.75 ≈ 0.866' },
        { en: 'Solution: θ = arccos(0.866) = 30°', zh: '解得：θ = arccos(0.866) = 30°', formula: 'θ = 30°' },
      ]
    }
  },
  {
    id: 3,
    nameEn: 'Extinction Lock',
    nameZh: '消光锁',
    descriptionEn: 'Block all light (< 2% transmission)',
    descriptionZh: '阻挡所有光（透过率 < 2%）',
    targetIntensity: 0,
    tolerance: 2,
    p1Angle: 0,
    hint: {
      en: 'Crossed polarizers: θ = 90°',
      zh: '正交偏振片：θ = 90°'
    },
    formulaReveal: {
      titleEn: 'Cross Polarization',
      titleZh: '正交偏振',
      steps: [
        { en: 'When polarizers are perpendicular', zh: '当偏振片垂直时' },
        { en: 'The angle between them is 90°', zh: '它们之间的夹角为90°', formula: 'θ = 90°' },
        { en: 'cos(90°) = 0', zh: 'cos(90°) = 0' },
        { en: 'Therefore: I = I₀ × 0² = 0', zh: '因此：I = I₀ × 0² = 0', formula: 'I = 0 (完全消光)' },
      ]
    }
  },
]

// 圆形偏振片组件 - 可拖拽旋转
interface CircularPolarizerProps {
  angle: number
  onAngleChange?: (angle: number) => void
  color: string
  label: string
  sublabel: string
  draggable?: boolean
  size?: number
}

function CircularPolarizer({
  angle,
  onAngleChange,
  color,
  label,
  sublabel,
  draggable = false,
  size = 80,
}: CircularPolarizerProps) {
  const { theme } = useTheme()
  const containerRef = useRef<SVGGElement>(null)
  const isDragging = useRef(false)
  const startAngle = useRef(0)
  const startMouseAngle = useRef(0)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!draggable || !containerRef.current) return

    isDragging.current = true
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    startAngle.current = angle
    startMouseAngle.current = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI

    e.currentTarget.setPointerCapture(e.pointerId)
  }, [angle, draggable])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current || !onAngleChange) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const currentMouseAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI
    const deltaAngle = currentMouseAngle - startMouseAngle.current

    let newAngle = (startAngle.current + deltaAngle) % 360
    if (newAngle < 0) newAngle += 360
    if (newAngle > 180) newAngle = newAngle - 360
    newAngle = Math.max(-90, Math.min(270, newAngle))
    if (newAngle < 0) newAngle += 180
    if (newAngle > 180) newAngle -= 180

    onAngleChange(Math.round(newAngle))
  }, [onAngleChange])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const lineCount = 7
  const radius = size / 2

  return (
    <g
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ cursor: draggable ? 'grab' : 'default', touchAction: 'none' }}
    >
      {/* 外圈光晕 */}
      <motion.circle
        cx="0"
        cy="0"
        r={radius + 8}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={draggable ? 0.3 : 0.15}
        animate={draggable ? {
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.02, 1]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 主圆 */}
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill={theme === 'dark' ? `${color}15` : `${color}20`}
        stroke={color}
        strokeWidth="3"
      />

      {/* 旋转的偏振线条 */}
      <motion.g
        animate={{ rotate: angle }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        {/* 网格线 */}
        {Array.from({ length: lineCount }, (_, i) => {
          const offset = ((i - Math.floor(lineCount / 2)) / (lineCount / 2)) * (radius - 8)
          const lineLength = Math.sqrt((radius - 8) ** 2 - offset ** 2)
          return (
            <line
              key={i}
              x1={-lineLength}
              y1={offset}
              x2={lineLength}
              y2={offset}
              stroke={color}
              strokeWidth="2"
              opacity="0.5"
            />
          )
        })}

        {/* 主轴 */}
        <line
          x1="0"
          y1={-(radius + 12)}
          x2="0"
          y2={radius + 12}
          stroke={color}
          strokeWidth="3"
        />
        <polygon
          points={`0,${-(radius + 18)} -5,${-(radius + 8)} 5,${-(radius + 8)}`}
          fill={color}
        />
        <polygon
          points={`0,${radius + 18} -5,${radius + 8} 5,${radius + 8}`}
          fill={color}
        />
      </motion.g>

      {/* 拖拽提示 */}
      {draggable && (
        <motion.circle
          cx="0"
          cy="0"
          r={radius - 15}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* 标签 */}
      <text
        x="0"
        y={radius + 35}
        textAnchor="middle"
        fill={color}
        fontSize="14"
        fontWeight="600"
      >
        {label}
      </text>
      <text
        x="0"
        y={radius + 50}
        textAnchor="middle"
        fill={color}
        fontSize="12"
        opacity="0.8"
      >
        {sublabel}
      </text>
    </g>
  )
}

// 动态光束组件
interface LightBeamProps {
  x1: number
  y1: number
  x2: number
  y2: number
  intensity: number
  color: string
  showParticles?: boolean
}

function LightBeam({ x1, y1, x2, y2, intensity, color, showParticles = true }: LightBeamProps) {
  const beamWidth = 4 + intensity * 8
  const opacity = 0.1 + intensity * 0.8

  return (
    <g>
      {/* 主光束 - 外发光 */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={beamWidth * 3}
        strokeOpacity={opacity * 0.2}
        strokeLinecap="round"
      />

      {/* 主光束 */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={beamWidth}
        strokeOpacity={opacity}
        strokeLinecap="round"
        animate={{ strokeWidth: beamWidth, strokeOpacity: opacity }}
        transition={{ duration: 0.3 }}
      />

      {/* 粒子动画 */}
      {showParticles && intensity > 0.05 && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              r={2 + intensity * 3}
              fill={color}
              animate={{
                cx: [x1, x2],
                cy: [y1, y2],
                opacity: [intensity * 0.9, intensity * 0.2],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'linear',
              }}
            />
          ))}
        </>
      )}
    </g>
  )
}

// 密码锁组件
interface LockDisplayProps {
  isUnlocked: boolean
  currentIntensity: number
  targetIntensity: number
  tolerance: number
}

function LockDisplay({ isUnlocked, currentIntensity, targetIntensity, tolerance }: LockDisplayProps) {
  const { theme } = useTheme()
  const progress = Math.max(0, 100 - Math.abs(currentIntensity - targetIntensity) * 2)

  // 判断是否接近目标
  const isClose = Math.abs(currentIntensity - targetIntensity) < tolerance * 3
  const lockColor = isUnlocked ? '#22c55e' : isClose ? '#fbbf24' : '#a855f7'

  return (
    <g>
      {/* 锁的外框 */}
      <motion.rect
        x="-40"
        y="-50"
        width="80"
        height="100"
        rx="12"
        fill={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
        stroke={lockColor}
        strokeWidth="3"
        animate={{
          stroke: lockColor,
          filter: isUnlocked ? 'drop-shadow(0 0 20px #22c55e)' : 'none'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* 光接收区域 */}
      <motion.rect
        x="-30"
        y="-40"
        width="60"
        height="50"
        rx="6"
        fill={lockColor}
        opacity={0.1 + (currentIntensity / 100) * 0.5}
        animate={{ opacity: 0.1 + (currentIntensity / 100) * 0.5 }}
      />

      {/* 锁图标 */}
      <motion.g
        animate={{
          y: isUnlocked ? -10 : 0,
          rotate: isUnlocked ? -15 : 0
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {isUnlocked ? (
          <Unlock className="w-8 h-8" x="-16" y="-25" stroke={lockColor} />
        ) : (
          <Lock className="w-8 h-8" x="-16" y="-25" stroke={lockColor} />
        )}
      </motion.g>

      {/* 进度条 */}
      <g transform="translate(0, 25)">
        <rect
          x="-25"
          y="-4"
          width="50"
          height="8"
          rx="4"
          fill={theme === 'dark' ? '#334155' : '#e2e8f0'}
        />
        <motion.rect
          x="-25"
          y="-4"
          width="50"
          height="8"
          rx="4"
          fill={lockColor}
          animate={{
            scaleX: progress / 100,
            fill: lockColor
          }}
          style={{ originX: 0 }}
          transition={{ duration: 0.2 }}
        />
      </g>

      {/* 当前光强显示 */}
      <text
        x="0"
        y="48"
        textAnchor="middle"
        fill={lockColor}
        fontSize="14"
        fontWeight="bold"
      >
        {currentIntensity.toFixed(0)}%
      </text>
    </g>
  )
}

// 公式推导展示组件
interface FormulaRevealProps {
  formulaReveal: Level['formulaReveal']
  isZh: boolean
  onClose: () => void
  onNextLevel?: () => void
  hasNextLevel: boolean
}

function FormulaReveal({ formulaReveal, isZh, onClose, onNextLevel, hasNextLevel }: FormulaRevealProps) {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep < formulaReveal.steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [currentStep, formulaReveal.steps.length])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'absolute inset-0 flex items-center justify-center z-20',
        'bg-black/60 backdrop-blur-sm rounded-xl'
      )}
    >
      <div className={cn(
        'max-w-md w-full mx-4 p-6 rounded-2xl',
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/30'
          : 'bg-gradient-to-br from-white to-gray-50 border border-green-500/50'
      )}>
        {/* 成功图标 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center mb-4"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        {/* 标题 */}
        <h3 className={cn(
          'text-xl font-bold text-center mb-6',
          theme === 'dark' ? 'text-green-400' : 'text-green-600'
        )}>
          🎉 {isZh ? formulaReveal.titleZh : formulaReveal.titleEn}
        </h3>

        {/* 推导步骤 */}
        <div className="space-y-3 mb-6">
          {formulaReveal.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={index < currentStep ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-3 rounded-lg',
                theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'
              )}
            >
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {index + 1}. {isZh ? step.zh : step.en}
              </p>
              {step.formula && (
                <p className={cn(
                  'font-mono text-lg font-bold mt-1',
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )}>
                  {step.formula}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={cn(
              'flex-1 py-2.5 rounded-lg font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            )}
          >
            {isZh ? '继续探索' : 'Continue'}
          </button>
          {hasNextLevel && onNextLevel && (
            <button
              onClick={onNextLevel}
              className={cn(
                'flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                'bg-green-500 hover:bg-green-600 text-white'
              )}
            >
              {isZh ? '下一关' : 'Next Level'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// 主组件
export function PolarizationLockDemo() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language.startsWith('zh')

  // 状态
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [p2Angle, setP2Angle] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showFormula, setShowFormula] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set())

  const currentLevel = LEVELS[currentLevelIndex]

  // 计算当前光强（马吕斯定律）
  const transmission = useMemo(() => {
    const theta = Math.abs(p2Angle - currentLevel.p1Angle) % 180
    const effectiveTheta = theta > 90 ? 180 - theta : theta
    return Math.cos((effectiveTheta * Math.PI) / 180) ** 2 * 100
  }, [p2Angle, currentLevel.p1Angle])

  // 检测是否解锁
  useEffect(() => {
    const isMatch = Math.abs(transmission - currentLevel.targetIntensity) <= currentLevel.tolerance

    if (isMatch && !isUnlocked) {
      setIsUnlocked(true)
      setCompletedLevels(prev => new Set([...prev, currentLevel.id]))
      // 延迟显示公式推导
      setTimeout(() => setShowFormula(true), 500)
    }
  }, [transmission, currentLevel, isUnlocked])

  // 重置当前关卡
  const resetLevel = useCallback(() => {
    setP2Angle(0)
    setIsUnlocked(false)
    setShowFormula(false)
    setShowHint(false)
  }, [])

  // 进入下一关
  const nextLevel = useCallback(() => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1)
      resetLevel()
    }
  }, [currentLevelIndex, resetLevel])

  // 选择关卡
  const selectLevel = useCallback((index: number) => {
    setCurrentLevelIndex(index)
    resetLevel()
  }, [resetLevel])

  return (
    <div className="space-y-6">
      {/* 顶部：关卡选择和信息 */}
      <div className={cn(
        'flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
      )}>
        {/* 关卡选择 */}
        <div className="flex items-center gap-2">
          {LEVELS.map((level, index) => (
            <button
              key={level.id}
              onClick={() => selectLevel(index)}
              className={cn(
                'w-10 h-10 rounded-full font-bold transition-all',
                currentLevelIndex === index
                  ? 'bg-cyan-500 text-white scale-110'
                  : completedLevels.has(level.id)
                    ? 'bg-green-500/20 text-green-500 border-2 border-green-500'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              )}
            >
              {completedLevels.has(level.id) ? '✓' : level.id}
            </button>
          ))}
        </div>

        {/* 当前关卡信息 */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-bold text-lg',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? currentLevel.nameZh : currentLevel.nameEn}
          </h3>
          <p className={cn(
            'text-sm',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? currentLevel.descriptionZh : currentLevel.descriptionEn}
          </p>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showHint
                ? 'bg-yellow-500/20 text-yellow-500'
                : theme === 'dark'
                  ? 'bg-slate-700 text-gray-400 hover:text-yellow-400'
                  : 'bg-gray-200 text-gray-600 hover:text-yellow-600'
            )}
            title={isZh ? '显示提示' : 'Show hint'}
          >
            <Lightbulb className="w-5 h-5" />
          </button>
          <button
            onClick={resetLevel}
            className={cn(
              'p-2 rounded-lg transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-400 hover:text-cyan-400'
                : 'bg-gray-200 text-gray-600 hover:text-cyan-600'
            )}
            title={isZh ? '重置' : 'Reset'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 提示显示 */}
      <AnimatePresence>
        {showHint && currentLevel.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'p-4 rounded-xl flex items-center gap-3',
              theme === 'dark'
                ? 'bg-yellow-500/10 border border-yellow-500/30'
                : 'bg-yellow-50 border border-yellow-200'
            )}
          >
            <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
            )}>
              {isZh ? currentLevel.hint.zh : currentLevel.hint.en}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主可视化区域 */}
      <div className="relative">
        <div className={cn(
          'rounded-xl border overflow-hidden',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-indigo-500/20'
            : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 border-gray-200'
        )}>
          <svg viewBox="0 0 800 350" className="w-full h-auto" style={{ minHeight: '320px' }}>
            <defs>
              {/* 背景网格 */}
              <pattern id="lock-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={theme === 'dark' ? 'rgba(100,150,255,0.05)' : 'rgba(0,0,0,0.03)'}
                  strokeWidth="1"
                />
              </pattern>

              {/* 光束发光滤镜 */}
              <filter id="lock-beam-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 光源发光 */}
              <filter id="lock-source-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="800" height="350" fill="url(#lock-grid)" />

            {/* 标题 */}
            <text
              x="400"
              y="30"
              textAnchor="middle"
              fill={theme === 'dark' ? '#e2e8f0' : '#1e293b'}
              fontSize="18"
              fontWeight="bold"
            >
              {isZh ? '🔐 偏振密码锁' : '🔐 Polarization Lock'}
            </text>

            {/* 目标提示 */}
            <text
              x="400"
              y="55"
              textAnchor="middle"
              fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
              fontSize="13"
            >
              {isZh
                ? `目标：使光强达到 ${currentLevel.targetIntensity}% (±${currentLevel.tolerance}%)`
                : `Target: ${currentLevel.targetIntensity}% intensity (±${currentLevel.tolerance}%)`
              }
            </text>

            {/* 光源 */}
            <g transform="translate(100, 180)">
              {/* 外发光 */}
              <motion.circle
                cx="0"
                cy="0"
                r="45"
                fill="#ffd700"
                opacity="0.15"
                filter="url(#lock-source-glow)"
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* 中层 */}
              <motion.circle
                cx="0"
                cy="0"
                r="30"
                fill="#ffd700"
                opacity="0.4"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* 核心 */}
              <circle cx="0" cy="0" r="22" fill="#ffd700" />
              <circle cx="0" cy="0" r="12" fill="#fff" opacity="0.7" />
              {/* 标签 */}
              <text
                x="0"
                y="60"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="14"
                fontWeight="500"
              >
                {isZh ? '光源' : 'Light'}
              </text>
              <text
                x="0"
                y="76"
                textAnchor="middle"
                fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                fontSize="11"
              >
                I₀ = 100%
              </text>
            </g>

            {/* 光束：光源 → P₁ */}
            <g filter="url(#lock-beam-glow)">
              <LightBeam
                x1={130}
                y1={180}
                x2={220}
                y2={180}
                intensity={1}
                color="#ffd700"
              />
            </g>

            {/* 起偏器 P₁ */}
            <g transform="translate(280, 180)">
              <CircularPolarizer
                angle={currentLevel.p1Angle}
                color="#22d3ee"
                label="P₁"
                sublabel={`${currentLevel.p1Angle}°`}
                size={70}
              />
            </g>

            {/* 光束：P₁ → P₂ */}
            <g filter="url(#lock-beam-glow)">
              <LightBeam
                x1={340}
                y1={180}
                x2={430}
                y2={180}
                intensity={0.5}
                color="#22d3ee"
              />
            </g>

            {/* 检偏器 P₂（可拖拽） */}
            <g transform="translate(490, 180)">
              <CircularPolarizer
                angle={p2Angle}
                onAngleChange={setP2Angle}
                color="#a855f7"
                label="P₂"
                sublabel={`${p2Angle}°`}
                draggable={!isUnlocked}
                size={70}
              />
              {/* 拖拽提示文字 */}
              {!isUnlocked && (
                <text
                  x="0"
                  y="95"
                  textAnchor="middle"
                  fill="#a855f7"
                  fontSize="10"
                  opacity="0.7"
                >
                  {isZh ? '↻ 拖拽旋转' : '↻ Drag to rotate'}
                </text>
              )}
            </g>

            {/* 光束：P₂ → 密码锁 */}
            <g filter="url(#lock-beam-glow)">
              <LightBeam
                x1={550}
                y1={180}
                x2={620}
                y2={180}
                intensity={transmission / 100}
                color="#a855f7"
                showParticles={transmission > 5}
              />
            </g>

            {/* 密码锁 */}
            <g transform="translate(700, 180)">
              <LockDisplay
                isUnlocked={isUnlocked}
                currentIntensity={transmission}
                targetIntensity={currentLevel.targetIntensity}
                tolerance={currentLevel.tolerance}
              />
            </g>

            {/* 物理公式显示 */}
            <g transform="translate(400, 300)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                fontSize="13"
              >
                I = I₀ × cos²(θ) = 100% × cos²({Math.abs(p2Angle - currentLevel.p1Angle)}°) =
                <tspan fill={isUnlocked ? '#22c55e' : '#fbbf24'} fontWeight="bold">
                  {' '}{transmission.toFixed(1)}%
                </tspan>
              </text>
            </g>

            {/* 解锁成功效果 */}
            <AnimatePresence>
              {isUnlocked && !showFormula && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* 星星效果 */}
                  {[...Array(8)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={700}
                      cy={180}
                      r="4"
                      fill="#22c55e"
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 8) * 80,
                        y: Math.sin((i * Math.PI * 2) / 8) * 80,
                      }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                    />
                  ))}
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        {/* 公式推导弹窗 */}
        <AnimatePresence>
          {showFormula && (
            <FormulaReveal
              formulaReveal={currentLevel.formulaReveal}
              isZh={isZh}
              onClose={() => setShowFormula(false)}
              onNextLevel={nextLevel}
              hasNextLevel={currentLevelIndex < LEVELS.length - 1}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 角度滑块（备用控制） */}
      <div className={cn(
        'p-4 rounded-xl',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
      )}>
        <div className="flex items-center gap-4">
          <span className={cn(
            'text-sm font-medium w-20',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            P₂ {isZh ? '角度' : 'Angle'}
          </span>
          <input
            type="range"
            min="0"
            max="180"
            value={p2Angle}
            onChange={(e) => !isUnlocked && setP2Angle(Number(e.target.value))}
            disabled={isUnlocked}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className={cn(
            'text-lg font-mono font-bold w-16 text-right',
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          )}>
            {p2Angle}°
          </span>
        </div>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title={isZh ? '马吕斯定律' : "Malus's Law"} color="cyan">
          <Formula highlight>I = I₀ × cos²(θ)</Formula>
          <ul className={cn(
            'mt-3 text-xs space-y-1',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            <li>• θ = 0°: {isZh ? '完全透过' : 'Full transmission'} (100%)</li>
            <li>• θ = 45°: {isZh ? '半透过' : 'Half transmission'} (50%)</li>
            <li>• θ = 90°: {isZh ? '完全阻挡' : 'Complete blocking'} (0%)</li>
          </ul>
        </InfoCard>

        <InfoCard title={isZh ? '真实应用' : 'Real Applications'} color="purple">
          <ul className={cn(
            'text-xs space-y-1.5',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            <li>🕶️ {isZh ? '偏振太阳镜 - 消除眩光' : 'Polarized sunglasses - reduce glare'}</li>
            <li>📺 {isZh ? 'LCD显示器 - 控制亮度' : 'LCD displays - brightness control'}</li>
            <li>📷 {isZh ? '摄影滤镜 - 增强对比度' : 'Camera filters - enhance contrast'}</li>
            <li>🔬 {isZh ? '应力分析 - 检测材料缺陷' : 'Stress analysis - detect defects'}</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}

export default PolarizationLockDemo
