/**
 * 马吕斯定律交互演示 - DOM + SVG + Framer Motion 版本
 * I = I₀ × cos²(θ)
 * 参考设计：高级玻璃态UI风格
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
  const colors = {
    blue: {
      gradient: 'linear-gradient(90deg, rgba(132,194,255,0.1), rgba(104,171,255,0.8), rgba(42,118,255,0.95))',
      glow: 'rgba(76,142,255,0.6)',
    },
    orange: {
      gradient: 'linear-gradient(90deg, rgba(255,195,156,0.08), rgba(255,153,102,0.82), rgba(255,96,96,0.9))',
      glow: 'rgba(255,145,108,0.7)',
    },
  }

  const colorSet = colors[color]

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <span className="w-8 font-mono text-sm text-blue-200">{label}</span>
        <div className="flex-1 h-5 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-blue-500/30 overflow-hidden relative shadow-inner">
          <motion.div
            className="absolute inset-[2px] rounded-full"
            style={{
              background: colorSet.gradient,
              boxShadow: `0 0 14px ${colorSet.glow}`,
            }}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: Math.max(0.05, intensity),
              opacity: Math.max(0.2, intensity),
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
      {showValue && valueText && (
        <div className="text-xs text-gray-400 ml-11">
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

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400 mb-2">{label}</span>
      <span className="text-[10px] text-gray-500 mb-2">{sublabel}</span>
      <div
        ref={containerRef}
        className={`relative w-16 h-16 rounded-full border bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-[0_0_15px_rgba(60,105,240,0.3),inset_0_0_15px_rgba(0,0,0,0.7)] flex items-center justify-center ${
          interactive
            ? 'cursor-grab active:cursor-grabbing border-purple-500/60 hover:border-purple-400/80 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'
            : 'border-blue-500/40'
        } ${isDragging ? 'cursor-grabbing border-purple-400 shadow-[0_0_25px_rgba(147,51,234,0.6)]' : ''}`}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
          }
        }}
        onMouseEnter={() => interactive && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 透光轴 */}
        <motion.div
          className="absolute w-[2px] h-[46px] rounded-full"
          style={{
            background: isBase
              ? 'linear-gradient(180deg, rgba(200,211,255,0.9), rgba(84,144,255,0.9))'
              : 'linear-gradient(180deg, rgba(192,132,252,0.9), rgba(139,92,246,0.9))',
            boxShadow: isBase
              ? '0 0 8px rgba(111,153,255,0.85)'
              : '0 0 8px rgba(167,139,250,0.85)',
          }}
          animate={{ rotate: angle }}
          transition={{ duration: isDragging ? 0 : 0.2, ease: 'easeOut' }}
        />
        {/* 拖拽手柄指示器 */}
        {interactive && (
          <>
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-purple-400/80"
              style={{
                transformOrigin: 'center',
              }}
              animate={{
                rotate: angle,
                x: 23 * Math.sin(angle * Math.PI / 180),
                y: -23 * Math.cos(angle * Math.PI / 180),
                scale: isHovering || isDragging ? 1.2 : 1,
              }}
              transition={{ duration: isDragging ? 0 : 0.2 }}
            />
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-purple-400/80"
              animate={{
                rotate: angle + 180,
                x: -23 * Math.sin(angle * Math.PI / 180),
                y: 23 * Math.cos(angle * Math.PI / 180),
                scale: isHovering || isDragging ? 1.2 : 1,
              }}
              transition={{ duration: isDragging ? 0 : 0.2 }}
            />
          </>
        )}
        {/* 角度显示 */}
        <motion.div
          className="absolute bottom-2 text-[10px] text-blue-100 font-mono"
          key={Math.round(angle)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          θ = {angle.toFixed(1)}°
        </motion.div>
      </div>
      {/* 拖拽提示 */}
      {interactive && isHovering && !isDragging && (
        <motion.span
          className="text-[9px] text-purple-400 mt-1"
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

// SVG 曲线图组件
function MalusCurveChart({ currentAngle, intensity }: { currentAngle: number; intensity: number }) {
  // 生成 cos² 曲线路径
  const curvePath = useMemo(() => {
    const points: string[] = []
    for (let theta = 0; theta <= 180; theta += 2) {
      const x = 25 + (theta / 180) * 180
      const y = 95 - Math.pow(Math.cos((theta * Math.PI) / 180), 2) * 70
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
      <line x1="25" y1="95" x2="210" y2="95" stroke="#d1dcff" strokeWidth="1" />
      <line x1="25" y1="95" x2="25" y2="20" stroke="#d1dcff" strokeWidth="1" />

      {/* 网格线 */}
      <line x1="25" y1="60" x2="210" y2="60" stroke="rgba(127,150,233,0.25)" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="25" y1="25" x2="210" y2="25" stroke="rgba(127,150,233,0.25)" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* X轴刻度 */}
      {[0, 45, 90, 135, 180].map((theta) => {
        const x = 25 + (theta / 180) * 180
        return (
          <g key={theta}>
            <line x1={x} y1="95" x2={x} y2="99" stroke="#bcc6ff" strokeWidth="0.6" />
            <text x={x} y="110" textAnchor="middle" fill="#d9e0ff" fontSize="8">
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
            <line x1="21" y1={y} x2="25" y2={y} stroke="#bcc6ff" strokeWidth="0.6" />
            <text x="18" y={y + 3} textAnchor="end" fill="#d9e0ff" fontSize="8">
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
        fill="#fce9e5"
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
      <text x="118" y="118" textAnchor="middle" fill="#f0f3ff" fontSize="9">
        θ
      </text>
      <text
        x="8"
        y="58"
        textAnchor="middle"
        fill="#f0f3ff"
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

  // 计算透射强度 (考虑非理想偏振片的消光比)
  const cosTheta = Math.cos((angle * Math.PI) / 180)
  const cos2Theta = cosTheta * cosTheta

  // 对于研究级别,考虑消光比的影响
  // 非理想偏振片: I = I₀ × [cos²θ + sin²θ/ER] 其中 ER 是消光比
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

  return (
    <div className="space-y-6">
      {/* 头部标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          {t('demoUi.malus.title')}
        </h2>
        <p className="text-gray-400 mt-1">
          {t('demoUi.malus.subtitle')}
        </p>
      </div>

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：可视化 */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-blue-950/90 border border-blue-500/30 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <h3 className="text-lg font-semibold text-white mb-4">{t('demoUi.malus.visualization')}</h3>

          {/* 光学装置 */}
          <div className="rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-400/30 p-4 space-y-4">
            {/* 入射光 */}
            <LightBar label="I₀" intensity={incidentIntensity} color="blue" />

            {/* 偏振片 */}
            <div className="flex justify-around items-center py-4">
              <PolarizerCircle
                angle={0}
                label={t('demoUi.malus.firstPolarizer')}
                sublabel={t('demoUi.malus.polarizerBase')}
                isBase
              />
              <div className="flex flex-col items-center text-gray-500">
                <motion.div
                  className="w-16 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs mt-1">{t('demoUi.malus.polarizedBeam')}</span>
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

          {/* 解释框 */}
          <div className="mt-4 p-4 rounded-lg bg-slate-800/70 border border-blue-400/20">
            <h4 className="text-sm font-semibold text-white mb-2">{t('demoUi.malus.currentMeaning')}</h4>
            <motion.p
              className="text-sm text-gray-300"
              key={Math.floor(angle / 10)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {getExplanation(angle)}
            </motion.p>
            <p className="text-xs text-gray-500 mt-2">
              {t('demoUi.malus.assumption')}
            </p>
          </div>
        </div>

        {/* 右侧：控制与学习 */}
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
              <div className="pt-2 border-t border-slate-700/50">
                <SliderControl
                  label="消光比 (ER)"
                  value={Math.log10(extinctionRatio)}
                  min={1}
                  max={5}
                  step={0.1}
                  onChange={(v) => setExtinctionRatio(Math.pow(10, v))}
                  color="cyan"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  ER = 10^{Math.log10(extinctionRatio).toFixed(1)} ≈ {extinctionRatio.toFixed(0)}
                  {extinctionRatio >= 10000 ? ' (高品质)' : extinctionRatio >= 100 ? ' (普通)' : ' (低品质)'}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  autoPlay
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_8px_20px_rgba(239,87,74,0.5)]'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_8px_20px_rgba(25,96,230,0.5)]'
                }`}
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
            <div className="mt-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-[10px] text-purple-300">
                💡 提示: 可以直接拖拽第二个偏振片来旋转它
              </p>
            </div>
          </ControlPanel>

          {/* 公式与实时计算 - 基础难度隐藏 */}
          {!isFoundation && (
            <ControlPanel title={t('demoUi.malus.formulaTitle')}>
              <div className="text-center py-2">
                <span className="font-mono text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {isResearch ? 'I = I₀ · [cos²θ + sin²θ/ER]' : 'I = I₀ · cos²θ'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="text-gray-400">
                  I₀ = <span className="text-cyan-400 font-mono">{incidentIntensity.toFixed(3)}</span>
                </div>
                <div className="text-gray-400">
                  θ = <span className="text-purple-400 font-mono">{angle.toFixed(2)}°</span>
                </div>
                <div className="text-gray-400">
                  cos θ ≈ <span className="text-cyan-400 font-mono">{cosTheta.toFixed(4)}</span>
                </div>
                <div className="text-gray-400">
                  cos²θ ≈ <span className="text-cyan-400 font-mono">{cos2Theta.toFixed(4)}</span>
                </div>
                {isResearch && (
                  <>
                    <div className="text-gray-400">
                      sin²θ ≈ <span className="text-cyan-400 font-mono">{sin2Theta.toFixed(4)}</span>
                    </div>
                    <div className="text-gray-400">
                      sin²θ/ER ≈ <span className="text-cyan-400 font-mono">{(sin2Theta / extinctionRatio).toFixed(6)}</span>
                    </div>
                  </>
                )}
                <div className="col-span-2 text-gray-400 pt-1 border-t border-slate-700 mt-1">
                  {isResearch ? (
                    <>
                      I = I₀ · [cos²θ + sin²θ/ER] ≈{' '}
                      <span className="text-orange-400 font-mono font-semibold">
                        {transmittedIntensity.toFixed(4)}
                      </span>
                    </>
                  ) : (
                    <>
                      I = I₀ · cos²θ ≈{' '}
                      <span className="text-orange-400 font-mono font-semibold">
                        {incidentIntensity.toFixed(3)} × {cos2Theta.toFixed(4)} = {transmittedIntensity.toFixed(4)}
                      </span>
                    </>
                  )}
                </div>
                <div className="col-span-2 text-gray-400">
                  I/I₀ ≈{' '}
                  <span className="text-orange-400 font-mono font-semibold">{(transmittedIntensity / incidentIntensity).toFixed(4)}</span>
                  {isResearch && Math.abs(angle - 90) < 5 && (
                    <span className="text-yellow-400 ml-2 text-xs">
                      (泄漏: {((1 / extinctionRatio) * 100).toFixed(2)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* 研究级别: 消光比说明 */}
              {isResearch && (
                <div className="mt-3 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-[10px] text-cyan-300">
                    📊 消光比(ER)表示偏振片阻挡垂直偏振光的能力。理想偏振片ER=∞，实际偏振片在θ=90°时仍有微小透射。
                  </p>
                </div>
              )}
            </ControlPanel>
          )}

          {/* 基础难度: 简化说明 */}
          {isFoundation && (
            <ControlPanel title="简单理解">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm text-gray-300">
                    当两个偏振片的角度<strong className="text-cyan-400">相同</strong>时，光可以<strong className="text-green-400">完全通过</strong>。
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm text-gray-300">
                    当两个偏振片的角度<strong className="text-purple-400">相差90°</strong>时，光会被<strong className="text-red-400">完全阻挡</strong>。
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm text-gray-300">
                    其他角度时，通过的光量在0%到100%之间变化。
                  </p>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-orange-400">
                    {(transmittedIntensity * 100).toFixed(0)}%
                  </span>
                  <span className="text-gray-400 text-sm ml-2">的光通过</span>
                </div>
              </div>
            </ControlPanel>
          )}

          {/* 曲线图 - 基础难度隐藏 */}
          {!isFoundation && (
            <ControlPanel title={t('demoUi.malus.curveTitle')}>
              <MalusCurveChart currentAngle={angle} intensity={isResearch ? transmittedIntensity / incidentIntensity : cos2Theta} />
              <p className="text-xs text-gray-400 mt-2">
                {t('demoUi.malus.curveDesc')}
                {isResearch && ' 注意: 非理想偏振片在90°处仍有微小透射。'}
              </p>
            </ControlPanel>
          )}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <p className="text-sm text-gray-400">
          <strong className="text-cyan-400">{t('demoUi.common.learningTip')}：</strong>
          {t('demoUi.malus.tip')}
        </p>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title={t('demoUi.malus.malusLaw')} color="cyan">
          <p className="text-xs text-gray-300">
            {t('demoUi.malus.malusDesc')}
          </p>
        </InfoCard>
        <InfoCard title={t('demoUi.malus.applications')} color="purple">
          <ul className="text-xs text-gray-300 space-y-1">
            {(t('demoUi.malus.appList', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard title={t('demoUi.malus.specialAngles')} color="orange">
          <ul className="text-xs text-gray-300 space-y-1">
            {(t('demoUi.malus.angleList', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
