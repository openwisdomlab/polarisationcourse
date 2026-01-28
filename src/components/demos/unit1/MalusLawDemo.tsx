/**
 * 马吕斯定律交互演示 - DOM + SVG + Framer Motion 版本
 * I = I₀ × cos²(θ)
 * 参考设计：高级玻璃态UI风格
 *
 * Physics Engine Migration:
 * - Uses unified CoherencyMatrix-based calculations via PolarizationPhysics
 * - Ideal polarizer physics computed through engine
 * - Extinction ratio (research mode) applied as post-processing for non-ideal behavior
 *
 * 支持难度分层:
 * - foundation: 隐藏公式和曲线图，简化说明
 * - application: 完整显示所有内容
 * - research: 添加消光比参数模拟非理想偏振片
 */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { useDemoTheme } from '../demoThemeColors'
import {
  DemoHeader,
  VisualizationPanel,
  DemoMainLayout,
  InfoGrid,
  TipBanner,
  FormulaHighlight,
  StatCard,
  ChartPanel,
} from '../DemoLayout'
import { cn } from '@/lib/utils'
import { PolarizationPhysics } from '@/hooks/usePolarizationSimulation'

// 难度级别类型
type DifficultyLevel = 'foundation' | 'application' | 'research'

// 组件属性接口
interface MalusLawDemoProps {
  difficultyLevel?: DifficultyLevel
}

// 光强条组件
function LightBar({
  label,
  intensity,
  color,
  showValue = true,
  valueText,
}: {
  label: string
  intensity: number
  color: 'blue' | 'orange'
  showValue?: boolean
  valueText?: string
}) {
  const dt = useDemoTheme()
  const colors = {
    blue: {
      gradient: 'linear-gradient(90deg, rgba(56,189,248,0.08), rgba(59,130,246,0.5), rgba(37,99,235,0.85))',
      glow: 'rgba(59,130,246,0.5)',
      accent: dt.isDark ? 'text-blue-300' : 'text-blue-600',
    },
    orange: {
      gradient: 'linear-gradient(90deg, rgba(251,191,36,0.08), rgba(249,115,22,0.6), rgba(234,88,12,0.9))',
      glow: 'rgba(249,115,22,0.5)',
      accent: dt.isDark ? 'text-orange-300' : 'text-orange-600',
    },
  }

  const colorSet = colors[color]

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <span className={cn('w-10 font-mono text-sm font-semibold', colorSet.accent)}>{label}</span>
        <div className={cn(
          'flex-1 h-6 rounded-full border overflow-hidden relative',
          dt.isDark
            ? 'bg-gradient-to-b from-slate-800/80 to-slate-900 border-slate-600/30 shadow-inner shadow-black/30'
            : 'bg-gradient-to-b from-slate-100 to-slate-200 border-slate-300/50 shadow-inner shadow-slate-300/40'
        )}>
          <motion.div
            className="absolute inset-[2px] rounded-full"
            style={{
              background: colorSet.gradient,
              boxShadow: `0 0 16px ${colorSet.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: Math.max(0.03, intensity),
              opacity: Math.max(0.15, intensity),
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          {/* Highlight stripe on top of bar for polish */}
          <motion.div
            className="absolute inset-x-[3px] top-[3px] h-[5px] rounded-full opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            }}
            animate={{ scaleX: Math.max(0.03, intensity) }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
      {showValue && valueText && (
        <div className={cn('text-xs ml-[52px]', dt.mutedTextClass)}>
          {valueText}
        </div>
      )}
    </div>
  )
}

// 偏振片组件 - 支持拖拽旋转
function PolarizerCircle({
  angle,
  label,
  sublabel,
  isBase = false,
  interactive = false,
  onAngleChange,
}: {
  angle: number
  label: string
  sublabel: string
  isBase?: boolean
  interactive?: boolean
  onAngleChange?: (angle: number) => void
}) {
  const dt = useDemoTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const dragStartAngleRef = useRef(0)
  const startAngleRef = useRef(0)

  // 计算鼠标/触摸位置相对于圆心的角度
  const getAngleFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return 0
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = clientX - centerX
    const dy = clientY - centerY
    return Math.atan2(dy, dx) * (180 / Math.PI)
  }, [])

  // 处理拖拽开始
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!interactive || !onAngleChange) return
    setIsDragging(true)
    dragStartAngleRef.current = getAngleFromEvent(clientX, clientY)
    startAngleRef.current = angle
  }, [interactive, onAngleChange, getAngleFromEvent, angle])

  // 处理拖拽移动
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !onAngleChange) return
    const currentAngle = getAngleFromEvent(clientX, clientY)
    let deltaAngle = currentAngle - dragStartAngleRef.current
    let newAngle = startAngleRef.current + deltaAngle

    // 保持角度在 0-180 范围内
    while (newAngle < 0) newAngle += 180
    while (newAngle > 180) newAngle -= 180

    onAngleChange(newAngle)
  }, [isDragging, onAngleChange, getAngleFromEvent])

  // 处理拖拽结束
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 鼠标事件
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY)
    }
    const handleMouseUp = () => {
      handleDragEnd()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // 触摸事件
  useEffect(() => {
    if (!isDragging) return

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const handleTouchEnd = () => {
      handleDragEnd()
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  const ringBaseColor = isBase
    ? dt.isDark ? 'border-blue-500/50' : 'border-blue-400/60'
    : dt.isDark ? 'border-purple-500/50' : 'border-purple-400/60'

  const ringInteractiveColor = interactive
    ? isDragging
      ? dt.isDark ? 'border-purple-400 shadow-[0_0_24px_rgba(147,51,234,0.5)]' : 'border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
      : cn(
          'cursor-grab active:cursor-grabbing',
          dt.isDark
            ? 'hover:border-purple-400/80 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]'
            : 'hover:border-purple-500/70 hover:shadow-[0_0_16px_rgba(147,51,234,0.2)]'
        )
    : ''

  return (
    <div className="flex flex-col items-center">
      <span className={cn('text-xs font-medium mb-1.5', dt.isDark ? 'text-gray-300' : 'text-gray-600')}>{label}</span>
      <span className={cn('text-[10px] mb-2', dt.subtleTextClass)}>{sublabel}</span>
      <div
        ref={containerRef}
        className={cn(
          'relative w-[72px] h-[72px] rounded-full border-2 flex items-center justify-center transition-shadow duration-200',
          dt.isDark
            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-[inset_0_0_16px_rgba(0,0,0,0.6)]'
            : 'bg-gradient-to-br from-white to-slate-100 shadow-[inset_0_0_12px_rgba(0,0,0,0.06)]',
          ringBaseColor,
          ringInteractiveColor,
        )}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
          }
        }}
        onMouseEnter={() => interactive && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 外圈装饰 */}
        <div className={cn(
          'absolute inset-0 rounded-full',
          dt.isDark ? 'ring-1 ring-inset ring-white/5' : 'ring-1 ring-inset ring-black/5'
        )} />
        {/* 透光轴 */}
        <motion.div
          className="absolute w-[2px] h-[48px] rounded-full"
          style={{
            background: isBase
              ? dt.isDark
                ? 'linear-gradient(180deg, rgba(147,197,253,0.9), rgba(59,130,246,0.9))'
                : 'linear-gradient(180deg, rgba(96,165,250,0.8), rgba(37,99,235,0.9))'
              : dt.isDark
                ? 'linear-gradient(180deg, rgba(192,132,252,0.9), rgba(139,92,246,0.9))'
                : 'linear-gradient(180deg, rgba(168,85,247,0.8), rgba(124,58,237,0.9))',
            boxShadow: isBase
              ? '0 0 10px rgba(96,165,250,0.7)'
              : '0 0 10px rgba(167,139,250,0.7)',
          }}
          animate={{ rotate: angle }}
          transition={{ duration: isDragging ? 0 : 0.2, ease: 'easeOut' }}
        />
        {/* 拖拽手柄指示器 */}
        {interactive && (
          <>
            <motion.div
              className={cn(
                'absolute w-3.5 h-3.5 rounded-full border',
                dt.isDark
                  ? 'bg-purple-400/80 border-purple-300/50'
                  : 'bg-purple-500/80 border-purple-400/50'
              )}
              style={{ transformOrigin: 'center' }}
              animate={{
                rotate: angle,
                x: 24 * Math.sin(angle * Math.PI / 180),
                y: -24 * Math.cos(angle * Math.PI / 180),
                scale: isHovering || isDragging ? 1.25 : 1,
              }}
              transition={{ duration: isDragging ? 0 : 0.2 }}
            />
            <motion.div
              className={cn(
                'absolute w-3.5 h-3.5 rounded-full border',
                dt.isDark
                  ? 'bg-purple-400/80 border-purple-300/50'
                  : 'bg-purple-500/80 border-purple-400/50'
              )}
              animate={{
                rotate: angle + 180,
                x: -24 * Math.sin(angle * Math.PI / 180),
                y: 24 * Math.cos(angle * Math.PI / 180),
                scale: isHovering || isDragging ? 1.25 : 1,
              }}
              transition={{ duration: isDragging ? 0 : 0.2 }}
            />
          </>
        )}
        {/* 角度显示 */}
        <motion.div
          className={cn(
            'absolute -bottom-0.5 text-[10px] font-mono font-medium',
            dt.isDark ? 'text-blue-200' : 'text-blue-700'
          )}
          key={Math.round(angle)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {angle.toFixed(1)}°
        </motion.div>
      </div>
      {/* 拖拽提示 */}
      {interactive && isHovering && !isDragging && (
        <motion.span
          className={cn('text-[9px] mt-1.5', dt.isDark ? 'text-purple-400' : 'text-purple-500')}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          拖拽旋转
        </motion.span>
      )}
    </div>
  )
}

// SVG 曲线图组件 - 使用统一物理引擎生成曲线
function MalusCurveChart({ currentAngle, intensity }: { currentAngle: number; intensity: number }) {
  const dt = useDemoTheme()
  // 生成 Malus's Law 曲线路径 (使用 CoherencyMatrix 物理引擎)
  const curvePath = useMemo(() => {
    const points: string[] = []
    for (let theta = 0; theta <= 180; theta += 2) {
      const x = 25 + (theta / 180) * 180
      // Engine computes: I = I₀ × cos²(θ) via CoherencyMatrix polarizer interaction
      const transmission = PolarizationPhysics.malusIntensity(0, theta, 1.0)
      const y = 95 - transmission * 70
      points.push(`${theta === 0 ? 'M' : 'L'} ${x},${y}`)
    }
    return points.join(' ')
  }, [])

  // 当前点位置
  const pointX = 25 + (currentAngle / 180) * 180
  const pointY = 95 - intensity * 70

  return (
    <svg viewBox="0 0 230 120" className="w-full h-auto">
      {/* 坐标轴 */}
      <line x1="25" y1="95" x2="210" y2="95" stroke={dt.textPrimary} strokeWidth="1" />
      <line x1="25" y1="95" x2="25" y2="20" stroke={dt.textPrimary} strokeWidth="1" />

      {/* 网格线 */}
      <line x1="25" y1="60" x2="210" y2="60" stroke={dt.gridStroke} strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="25" y1="25" x2="210" y2="25" stroke={dt.gridStroke} strokeWidth="0.5" strokeDasharray="3 3" />

      {/* X轴刻度 */}
      {[0, 45, 90, 135, 180].map((theta) => {
        const x = 25 + (theta / 180) * 180
        return (
          <g key={theta}>
            <line x1={x} y1="95" x2={x} y2="99" stroke={dt.textSecondary} strokeWidth="0.6" />
            <text x={x} y="110" textAnchor="middle" fill={dt.textPrimary} fontSize="8">
              {theta}°
            </text>
          </g>
        )
      })}

      {/* Y轴刻度 */}
      {[0, 0.5, 1].map((val, i) => {
        const y = 95 - val * 70
        return (
          <g key={i}>
            <line x1="21" y1={y} x2="25" y2={y} stroke={dt.textSecondary} strokeWidth="0.6" />
            <text x="18" y={y + 3} textAnchor="end" fill={dt.textPrimary} fontSize="8">
              {val.toFixed(1)}
            </text>
          </g>
        )
      })}

      {/* 曲线 */}
      <path d={curvePath} fill="none" stroke="#4f9ef7" strokeWidth="2" />

      {/* 当前点 */}
      <motion.circle
        cx={pointX}
        cy={pointY}
        r="4"
        fill="#ff7e67"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        animate={{ cx: pointX, cy: pointY }}
        transition={{ duration: 0.2 }}
      />

      {/* 点标签 */}
      <motion.text
        x={pointX + 6}
        y={pointY - 6}
        fill={dt.svgWhiteText}
        fontSize="7"
        animate={{ x: pointX + 6, y: pointY - 6 }}
        transition={{ duration: 0.2 }}
        style={{
          paintOrder: 'stroke',
          stroke: 'rgba(0,0,0,0.7)',
          strokeWidth: 2,
          strokeLinejoin: 'round',
        }}
      >
        θ={currentAngle.toFixed(0)}°, I/I₀≈{intensity.toFixed(2)}
      </motion.text>

      {/* 轴标题 */}
      <text x="118" y="118" textAnchor="middle" fill={dt.svgWhiteText} fontSize="9">
        θ
      </text>
      <text
        x="8"
        y="58"
        textAnchor="middle"
        fill={dt.svgWhiteText}
        fontSize="9"
        transform="rotate(-90 8 58)"
      >
        I / I₀
      </text>
    </svg>
  )
}

// 主组件
export function MalusLawDemo({ difficultyLevel = 'application' }: MalusLawDemoProps) {
  const dt = useDemoTheme()
  const { t } = useTranslation()
  const [angle, setAngle] = useState(30)
  const [incidentIntensity, setIncidentIntensity] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [speed, setSpeed] = useState(0.5)
  // 研究级别: 消光比参数 (理想偏振片 = 无穷大, 实际约 100-10000)
  const [extinctionRatio, setExtinctionRatio] = useState(1000)

  // 判断是否为各难度级别
  const isFoundation = difficultyLevel === 'foundation'
  const isResearch = difficultyLevel === 'research'

  // 计算透射强度 - 使用统一物理引擎
  // Physics: Input light at 0° (from first polarizer) passes through analyzer at 'angle'
  // Engine computes ideal transmission via CoherencyMatrix: I = I₀ × cos²(θ)
  const cos2Theta = PolarizationPhysics.malusIntensity(0, angle, 1.0)
  const cosTheta = Math.sqrt(cos2Theta) // Derived for display purposes

  // 对于研究级别,考虑消光比的影响 (非理想偏振片的设备特性)
  // 非理想偏振片: I = I₀ × [cos²θ + sin²θ/ER] 其中 ER 是消光比
  // This is a device imperfection correction, applied after engine physics
  const sin2Theta = 1 - cos2Theta
  const imperfectFactor = isResearch ? (cos2Theta + sin2Theta / extinctionRatio) : cos2Theta
  const transmittedIntensity = incidentIntensity * imperfectFactor

  // 解释文本生成
  const getExplanation = (angle: number): string => {
    if (Math.abs(angle) < 5 || Math.abs(angle - 180) < 5) {
      return t('demoUi.malus.explanation0')
    }
    if (Math.abs(angle - 90) < 5) {
      return t('demoUi.malus.explanation90')
    }
    if (Math.abs(angle - 45) < 5) {
      return t('demoUi.malus.explanation45')
    }
    return t('demoUi.malus.explanationOther')
  }

  // 自动旋转
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setAngle((prev) => {
        let next = prev + speed
        if (next > 180) next -= 180
        return next
      })
    }, 16)

    return () => clearInterval(interval)
  }, [autoPlay, speed])

  // ── Visualization (left) ──
  const visualization = (
    <VisualizationPanel variant="blue">
      <h3 className={cn(
        'text-base font-semibold mb-4',
        dt.isDark ? 'text-white' : 'text-gray-800'
      )}>
        {t('demoUi.malus.visualization')}
      </h3>

      {/* 光学装置 */}
      <div className={cn(
        'rounded-xl border p-4 space-y-5',
        dt.isDark
          ? 'bg-slate-800/40 border-slate-700/40'
          : 'bg-white/60 border-slate-200/60'
      )}>
        {/* 入射光 */}
        <LightBar label="I₀" intensity={incidentIntensity} color="blue" />

        {/* 偏振片 */}
        <div className="flex justify-around items-center py-3">
          <PolarizerCircle
            angle={0}
            label={t('demoUi.malus.firstPolarizer')}
            sublabel={t('demoUi.malus.polarizerBase')}
            isBase
          />
          <div className={cn('flex flex-col items-center', dt.mutedTextClass)}>
            <motion.div
              className={cn(
                'w-16 h-[2px] rounded-full',
                dt.isDark
                  ? 'bg-gradient-to-r from-blue-400/80 to-purple-400/80'
                  : 'bg-gradient-to-r from-blue-500/60 to-purple-500/60'
              )}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] mt-1.5">{t('demoUi.malus.polarizedBeam')}</span>
          </div>
          <PolarizerCircle
            angle={angle}
            label={t('demoUi.malus.secondPolarizer')}
            sublabel={isFoundation ? t('demoUi.malus.analyzerRotate') : t('demoUi.malus.analyzerRotate')}
            interactive
            onAngleChange={setAngle}
          />
        </div>

        {/* 透射光 */}
        <LightBar
          label="I"
          intensity={transmittedIntensity}
          color="orange"
          showValue
          valueText={`${t('demoUi.malus.transmittedIntensity')} ${transmittedIntensity.toFixed(3)} ${t('demoUi.malus.relativeValue')}`}
        />
      </div>

      {/* 关键数值统计卡片 */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <StatCard
          label="θ"
          value={`${angle.toFixed(1)}°`}
          color="purple"
        />
        <StatCard
          label="I / I₀"
          value={(transmittedIntensity / incidentIntensity).toFixed(3)}
          color="orange"
        />
        <StatCard
          label={isFoundation ? '通过率' : 'cos²θ'}
          value={isFoundation
            ? `${(transmittedIntensity * 100).toFixed(0)}%`
            : cos2Theta.toFixed(4)
          }
          color="cyan"
        />
      </div>

      {/* 解释框 */}
      <div className={cn(
        'mt-4 p-4 rounded-xl border',
        dt.isDark
          ? 'bg-slate-800/30 border-slate-700/30'
          : 'bg-slate-50/80 border-slate-200/60'
      )}>
        <h4 className={cn(
          'text-sm font-semibold mb-2',
          dt.isDark ? 'text-white' : 'text-gray-800'
        )}>
          {t('demoUi.malus.currentMeaning')}
        </h4>
        <motion.p
          className={cn('text-sm leading-relaxed', dt.bodyClass)}
          key={Math.floor(angle / 10)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {getExplanation(angle)}
        </motion.p>
        <p className={cn('text-xs mt-2', dt.subtleTextClass)}>
          {t('demoUi.malus.assumption')}
        </p>
      </div>
    </VisualizationPanel>
  )

  // ── Controls (right) ──
  const controls = (
    <div className="space-y-4">
      {/* 控件 */}
      <ControlPanel title={t('demoUi.common.interactiveControl')}>
        <SliderControl
          label={t('demoUi.malus.angleLabel')}
          value={angle}
          min={0}
          max={180}
          step={0.5}
          unit="°"
          onChange={setAngle}
          color="purple"
        />

        {!isFoundation && (
          <SliderControl
            label={t('demoUi.malus.incidentIntensityLabel')}
            value={incidentIntensity}
            min={0.1}
            max={1}
            step={0.01}
            onChange={setIncidentIntensity}
            color="blue"
          />
        )}

        {/* 研究级别: 消光比参数 */}
        {isResearch && (
          <div className={cn('pt-2 border-t', dt.borderClass)}>
            <SliderControl
              label="消光比 (ER)"
              value={Math.log10(extinctionRatio)}
              min={1}
              max={5}
              step={0.1}
              onChange={(v) => setExtinctionRatio(Math.pow(10, v))}
              color="cyan"
            />
            <p className={cn('text-[10px] mt-1', dt.subtleTextClass)}>
              ER = 10^{Math.log10(extinctionRatio).toFixed(1)} ≈ {extinctionRatio.toFixed(0)}
              {extinctionRatio >= 10000 ? ' (高品质)' : extinctionRatio >= 100 ? ' (普通)' : ' (低品质)'}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <motion.button
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              autoPlay
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(239,87,74,0.5)]'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_8px_20px_rgba(25,96,230,0.5)]'
            )}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAutoPlay(!autoPlay)}
          >
            {autoPlay ? t('demoUi.malus.stopAutoRotate') : t('demoUi.malus.startAutoRotate')}
          </motion.button>

          <div className="flex-1">
            <SliderControl
              label={t('demoUi.malus.rotationSpeed')}
              value={speed}
              min={0.1}
              max={2}
              step={0.1}
              unit={t('demoUi.malus.perFrame')}
              onChange={setSpeed}
              color="orange"
            />
          </div>
        </div>

        {/* 直接操作提示 */}
        <TipBanner color="purple" className="mt-3 !py-2 !px-3 !text-[11px]">
          {t('demoUi.common.learningTip')}: 可以直接拖拽第二个偏振片来旋转它
        </TipBanner>
      </ControlPanel>

      {/* 公式与实时计算 - 基础难度隐藏 */}
      {!isFoundation && (
        <ControlPanel title={t('demoUi.malus.formulaTitle')}>
          <FormulaHighlight
            formula={isResearch ? 'I = I₀ · [cos²θ + sin²θ/ER]' : 'I = I₀ · cos²θ'}
            description={isResearch ? '含消光比修正的马吕斯定律' : undefined}
          />

          <div className={cn(
            'grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mt-3',
            dt.mutedTextClass
          )}>
            <div>
              I₀ = <span className={cn('font-mono', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>{incidentIntensity.toFixed(3)}</span>
            </div>
            <div>
              θ = <span className={cn('font-mono', dt.isDark ? 'text-purple-400' : 'text-purple-600')}>{angle.toFixed(2)}°</span>
            </div>
            <div>
              cos θ ≈ <span className={cn('font-mono', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>{cosTheta.toFixed(4)}</span>
            </div>
            <div>
              cos²θ ≈ <span className={cn('font-mono', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>{cos2Theta.toFixed(4)}</span>
            </div>
            {isResearch && (
              <>
                <div>
                  sin²θ ≈ <span className={cn('font-mono', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>{sin2Theta.toFixed(4)}</span>
                </div>
                <div>
                  sin²θ/ER ≈ <span className={cn('font-mono', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>{(sin2Theta / extinctionRatio).toFixed(6)}</span>
                </div>
              </>
            )}
            <div className={cn('col-span-2 pt-1.5 border-t mt-1', dt.borderClass)}>
              {isResearch ? (
                <>
                  I = I₀ · [cos²θ + sin²θ/ER] ≈{' '}
                  <span className={cn('font-mono font-semibold', dt.isDark ? 'text-orange-400' : 'text-orange-600')}>
                    {transmittedIntensity.toFixed(4)}
                  </span>
                </>
              ) : (
                <>
                  I = I₀ · cos²θ ≈{' '}
                  <span className={cn('font-mono font-semibold', dt.isDark ? 'text-orange-400' : 'text-orange-600')}>
                    {incidentIntensity.toFixed(3)} × {cos2Theta.toFixed(4)} = {transmittedIntensity.toFixed(4)}
                  </span>
                </>
              )}
            </div>
            <div className="col-span-2">
              I/I₀ ≈{' '}
              <span className={cn('font-mono font-semibold', dt.isDark ? 'text-orange-400' : 'text-orange-600')}>
                {(transmittedIntensity / incidentIntensity).toFixed(4)}
              </span>
              {isResearch && Math.abs(angle - 90) < 5 && (
                <span className={cn('ml-2 text-xs', dt.isDark ? 'text-yellow-400' : 'text-yellow-600')}>
                  (泄漏: {((1 / extinctionRatio) * 100).toFixed(2)}%)
                </span>
              )}
            </div>
          </div>

          {/* 研究级别: 消光比说明 */}
          {isResearch && (
            <TipBanner color="cyan" className="mt-3 !text-[11px]">
              消光比(ER)表示偏振片阻挡垂直偏振光的能力。理想偏振片ER=无穷大，实际偏振片在θ=90°时仍有微小透射。
            </TipBanner>
          )}
        </ControlPanel>
      )}

      {/* 基础难度: 简化说明 */}
      {isFoundation && (
        <ControlPanel title="简单理解">
          <div className="space-y-3">
            <div className={cn('p-3 rounded-lg', dt.panelClass)}>
              <p className={cn('text-sm', dt.bodyClass)}>
                当两个偏振片的角度<strong className={dt.isDark ? 'text-cyan-400' : 'text-cyan-600'}>相同</strong>时，光可以<strong className={dt.isDark ? 'text-green-400' : 'text-green-600'}>完全通过</strong>。
              </p>
            </div>
            <div className={cn('p-3 rounded-lg', dt.panelClass)}>
              <p className={cn('text-sm', dt.bodyClass)}>
                当两个偏振片的角度<strong className={dt.isDark ? 'text-purple-400' : 'text-purple-600'}>相差90°</strong>时，光会被<strong className={dt.isDark ? 'text-red-400' : 'text-red-600'}>完全阻挡</strong>。
              </p>
            </div>
            <div className={cn('p-3 rounded-lg', dt.panelClass)}>
              <p className={cn('text-sm', dt.bodyClass)}>
                其他角度时，通过的光量在0%到100%之间变化。
              </p>
            </div>
            <div className="mt-2 text-center">
              <span className={cn('text-2xl font-bold', dt.isDark ? 'text-orange-400' : 'text-orange-600')}>
                {(transmittedIntensity * 100).toFixed(0)}%
              </span>
              <span className={cn('text-sm ml-2', dt.mutedTextClass)}>的光通过</span>
            </div>
          </div>
        </ControlPanel>
      )}

      {/* 曲线图 - 基础难度隐藏 */}
      {!isFoundation && (
        <ChartPanel
          title={t('demoUi.malus.curveTitle')}
          subtitle={`θ = ${angle.toFixed(0)}°`}
        >
          <MalusCurveChart currentAngle={angle} intensity={isResearch ? transmittedIntensity / incidentIntensity : cos2Theta} />
          <p className={cn('text-xs mt-2', dt.mutedTextClass)}>
            {t('demoUi.malus.curveDesc')}
            {isResearch && ' 注意: 非理想偏振片在90°处仍有微小透射。'}
          </p>
        </ChartPanel>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 头部标题 */}
      <DemoHeader
        title={t('demoUi.malus.title')}
        subtitle={t('demoUi.malus.subtitle')}
        gradient="blue"
      />

      {/* 主体内容 - 两栏布局 */}
      <DemoMainLayout
        visualization={visualization}
        controls={controls}
        controlsWidth="wide"
      />

      {/* 底部提示 */}
      <TipBanner color="cyan">
        <strong>{t('demoUi.common.learningTip')}:</strong>{' '}
        {t('demoUi.malus.tip')}
      </TipBanner>

      {/* 知识卡片 */}
      <InfoGrid columns={3}>
        <InfoCard title={t('demoUi.malus.malusLaw')} color="cyan">
          <p className={cn('text-xs', dt.bodyClass)}>
            {t('demoUi.malus.malusDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.malus.applications')} color="purple">
          <ul className={cn('text-xs space-y-1', dt.bodyClass)}>
            {(t('demoUi.malus.appList', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard title={t('demoUi.malus.specialAngles')} color="orange">
          <ul className={cn('text-xs space-y-1', dt.bodyClass)}>
            {(t('demoUi.malus.angleList', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
