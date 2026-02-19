/**
 * Polarization Introduction Demo - 偏振光入门演示
 * 使用 DOM + Framer Motion 对比非偏振光和偏振光
 *
 * Scientific Accuracy:
 * - 非偏振光 (Unpolarized light): 电场方向随时间快速随机变化，统计平均后等于振幅相等的所有方向
 * - 偏振光 (Polarized light): 电场在确定的方向/模式中振动
 * - 线偏振光: 电场矢量端点沿直线运动
 * - 圆/椭圆偏振光: 电场矢量端点沿圆/椭圆轨迹旋转
 *
 * 底层计算: 使用 CoherencyMatrix (相干矩阵) 计算
 * - 非偏振光: J = (I/2) × Identity, Stokes = [1, 0, 0, 0], DoP = 0
 * - 线偏振光: Jones vector 或对应的 CoherencyMatrix
 */
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useDemoTheme } from '../demoThemeColors'
import { cn } from '@/lib/utils'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { DemoHeader, DemoMainLayout, InfoGrid, TipBanner } from '../DemoLayout'

// 电场矢量组件 - 用于偏振光
function EFieldVector({
  angle,
  length,
  color,
  animate = true,
  delay = 0,
}: {
  angle: number
  length: number
  color: string
  animate?: boolean
  delay?: number
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-center"
      style={{
        width: length * 2,
        height: 3,
        marginLeft: -length,
        marginTop: -1.5,
        rotate: angle,
      }}
      initial={{ scaleX: 0 }}
      animate={animate ? {
        scaleX: [0, 1, 0, -1, 0],
      } : { scaleX: 1 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {/* 箭头 */}
      <motion.div
        className="absolute right-0 top-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: `8px solid ${color}`,
          marginTop: -5,
          marginRight: -4,
        }}
        animate={animate ? {
          opacity: [0, 1, 0, 0, 0],
        } : { opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

// 随机抖动电场矢量组件 - 用于非偏振光
// 科学说明：非偏振光是单一振动方向随时间快速随机变化，而非同时存在多个方向
// 抖动频率约为 10Hz (每100ms变化一次)，模拟热辐射光源的随机相位
function JitteringEFieldVector({
  length,
  isAnimating,
  colorMode = 'rainbow',
}: {
  length: number
  isAnimating: boolean
  colorMode?: 'rainbow' | 'white'
}) {
  const [currentAngle, setCurrentAngle] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isAnimating) {
      // 每100ms随机改变角度，模拟非偏振光的快速随机变化
      intervalRef.current = setInterval(() => {
        setCurrentAngle(Math.random() * 360)
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAnimating])

  // 根据当前角度计算颜色（HSL色轮）或使用白色
  const color = colorMode === 'rainbow'
    ? `hsl(${currentAngle}, 70%, 60%)`
    : '#ffffff'

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-center"
      animate={{
        rotate: currentAngle,
      }}
      transition={{
        duration: 0.08,
        ease: "linear",
      }}
      style={{
        width: length * 2,
        height: 3,
        marginLeft: -length,
        marginTop: -1.5,
      }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        animate={isAnimating ? {
          scaleX: [0, 1, 0, -1, 0],
        } : { scaleX: 1 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {/* 箭头 */}
      <motion.div
        className="absolute right-0 top-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: `8px solid ${color}`,
          marginTop: -5,
          marginRight: -4,
        }}
        animate={isAnimating ? {
          opacity: [0, 1, 0, 0, 0],
        } : { opacity: 1 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

// 叠加视图：同时显示多个方向的"幽灵"矢量，表示统计平均后的非偏振光
// 这种视图更直观：非偏振光 = 所有方向偏振光的等概率叠加
function SuperpositionEFieldVector({
  length,
  isAnimating,
}: {
  length: number
  isAnimating: boolean
}) {
  // 显示8个方向的矢量，代表所有可能的方向
  const directions = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => i * 45) // 0°, 45°, 90°, ...
  }, [])

  return (
    <div className="absolute left-1/2 top-1/2 origin-center">
      {directions.map((angle, index) => (
        <motion.div
          key={angle}
          className="absolute left-1/2 top-1/2 origin-center"
          style={{
            width: length * 2,
            height: 2,
            marginLeft: -length,
            marginTop: -1,
          }}
          animate={isAnimating ? {
            opacity: [0.15, 0.35, 0.15],
          } : { opacity: 0.25 }}
          transition={{
            duration: 1.5 + index * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, #fbbf24, transparent)`,
              boxShadow: `0 0 6px #fbbf24`,
              transform: `rotate(${angle}deg)`,
            }}
          />
        </motion.div>
      ))}
      {/* 中心点 */}
      <div className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-yellow-400/60" />
    </div>
  )
}

// 偏振光面板
function PolarizedPanel({
  title,
  subtitle,
  isUnpolarized,
  polarizationAngle,
  animationSpeed,
  propagationText,
  visualizationMode = 'jitter', // 'jitter' = 动态抖动, 'superposition' = 叠加视图
}: {
  title: string
  subtitle: string
  isUnpolarized: boolean
  polarizationAngle: number
  animationSpeed: number
  propagationText: string
  visualizationMode?: 'jitter' | 'superposition'
}) {
  const { theme } = useTheme()
  return (
    <div className={cn(
      "flex-1 rounded-2xl border p-4",
      theme === 'dark'
        ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800 border-slate-700/50"
        : "bg-gradient-to-br from-white via-gray-50 to-slate-100 border-gray-200 shadow-sm"
    )}>
      <div className="text-center mb-4">
        <h3 className={cn("text-lg font-semibold", isUnpolarized ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'))}>
          {title}
        </h3>
        <p className={cn("text-xs mt-1", theme === 'dark' ? "text-gray-400" : "text-gray-600")}>{subtitle}</p>
      </div>

      {/* 电场矢量可视化 */}
      <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
        {/* SVG 叠加层：参考轴 + 角度弧 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="-100 -100 200 200"
        >
          {/* 背景圆 */}
          <circle
            cx="0" cy="0" r="96"
            fill="none"
            stroke={theme === 'dark' ? 'rgba(100,116,139,0.4)' : 'rgba(156,163,175,0.6)'}
            strokeWidth="1"
          />

          {!isUnpolarized && (
            <>
              {/* 水平参考轴（0°） */}
              <line
                x1="-88" y1="0" x2="88" y2="0"
                stroke={theme === 'dark' ? 'rgba(100,116,139,0.35)' : 'rgba(156,163,175,0.5)'}
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              {/* 垂直参考轴（90°） */}
              <line
                x1="0" y1="-88" x2="0" y2="88"
                stroke={theme === 'dark' ? 'rgba(100,116,139,0.25)' : 'rgba(156,163,175,0.35)'}
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              {/* 角度弧（从0°到当前角度） */}
              {polarizationAngle > 0 && polarizationAngle <= 180 && (
                <path
                  d={`M 36 0 A 36 36 0 ${polarizationAngle > 90 ? 1 : 0} 0 ${
                    36 * Math.cos((-polarizationAngle * Math.PI) / 180)
                  } ${36 * Math.sin((-polarizationAngle * Math.PI) / 180)}`}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  strokeOpacity="0.7"
                />
              )}
              {/* 角度数字标注 */}
              <text
                x="68" y="-68"
                textAnchor="middle"
                fontSize="14"
                fill={theme === 'dark' ? '#22d3ee' : '#0891b2'}
                fontFamily="monospace"
                fontWeight="600"
              >
                {polarizationAngle}°
              </text>
              {/* 0° 标签 */}
              <text
                x="78" y="4"
                textAnchor="start"
                fontSize="9"
                fill={theme === 'dark' ? 'rgba(148,163,184,0.6)' : 'rgba(107,114,128,0.7)'}
              >
                0°
              </text>
            </>
          )}

          {/* 非偏振光的参考圆（表示所有可能方向） */}
          {isUnpolarized && (
            <>
              {/* 8个方向的虚线参考，表示统计平均的概念 */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1={-80 * Math.cos((angle * Math.PI) / 180)}
                  y1={-80 * Math.sin((angle * Math.PI) / 180)}
                  x2={80 * Math.cos((angle * Math.PI) / 180)}
                  y2={80 * Math.sin((angle * Math.PI) / 180)}
                  stroke={theme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.2)'}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}
              {/* 中心标签 */}
              <text
                x="0" y="5"
                textAnchor="middle"
                fontSize="10"
                fill={theme === 'dark' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(245, 158, 11, 0.6)'}
              >
                随机
              </text>
            </>
          )}
        </svg>

        {/* 中心光源点 */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-4 h-4 rounded-full -ml-2 -mt-2 ${
            isUnpolarized ? 'bg-yellow-400' : 'bg-cyan-400'
          }`}
          style={{ zIndex: 2 }}
          animate={{
            boxShadow: [
              `0 0 10px ${isUnpolarized ? '#fbbf24' : '#22d3ee'}`,
              `0 0 20px ${isUnpolarized ? '#fbbf24' : '#22d3ee'}`,
              `0 0 10px ${isUnpolarized ? '#fbbf24' : '#22d3ee'}`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* 电场矢量 - 根据模式和类型选择 */}
        {isUnpolarized ? (
          visualizationMode === 'superposition' ? (
            // 叠加视图：显示多个方向的幽灵矢量
            <SuperpositionEFieldVector
              length={70}
              isAnimating={animationSpeed > 0}
            />
          ) : (
            // 动态视图：单一矢量随机抖动
            <JitteringEFieldVector
              length={70}
              isAnimating={animationSpeed > 0}
              colorMode="rainbow"
            />
          )
        ) : (
          // 偏振光 - 单一方向的矢量
          <EFieldVector
            angle={polarizationAngle}
            length={80}
            color="#22d3ee"
            animate={animationSpeed > 0}
          />
        )}
      </div>

      {/* 传播方向指示 */}
      <div className={cn("flex items-center justify-center gap-2 text-sm", theme === 'dark' ? "text-gray-500" : "text-gray-600")}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <circle cx="12" cy="12" r="8" />
        </svg>
        <span>{propagationText}</span>
      </div>

      {/* 偏振角显示 */}
      {!isUnpolarized && (
        <motion.div
          className={cn("mt-3 text-center font-mono text-sm", theme === 'dark' ? "text-cyan-400" : "text-cyan-600")}
          key={polarizationAngle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          θ = {polarizationAngle}°
        </motion.div>
      )}
    </div>
  )
}

export function PolarizationIntroDemo() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const dt = useDemoTheme()
  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [showComparison, setShowComparison] = useState(true)
  const [unpolarizedViewMode, setUnpolarizedViewMode] = useState<'jitter' | 'superposition'>('jitter')

  return (
    <div className="space-y-5">
      <DemoHeader
        title={t('demoUi.polarizationIntro.polarizedLight')}
        subtitle={t('demoUi.polarizationIntro.propagationDirection')}
        gradient="cyan"
      />

      {/* 主可视化区域 */}
      <DemoMainLayout
        controlsWidth="narrow"
        visualization={
          <div className="flex gap-4">
            <AnimatePresence>
              {showComparison && (
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <PolarizedPanel
                    title={t('demoUi.polarizationIntro.unpolarizedLight')}
                    subtitle={t('demoUi.polarizationIntro.unpolarizedDesc')}
                    isUnpolarized={true}
                    polarizationAngle={0}
                    animationSpeed={animationSpeed}
                    propagationText={t('demoUi.polarizationIntro.propagationDirection')}
                    visualizationMode={unpolarizedViewMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <PolarizedPanel
              title={t('demoUi.polarizationIntro.polarizedLight')}
              subtitle={t('demoUi.polarizationIntro.polarizedDesc')}
              isUnpolarized={false}
              polarizationAngle={polarizationAngle}
              animationSpeed={animationSpeed}
              propagationText={t('demoUi.polarizationIntro.propagationDirection')}
            />
          </div>
        }
        controls={
          <div className="space-y-5">
            <ControlPanel title={t('demoUi.common.controlPanel')}>
              <SliderControl
                label={t('demoUi.common.polarizationAngle')}
                value={polarizationAngle}
                min={0}
                max={180}
                step={15}
                unit="°"
                onChange={setPolarizationAngle}
                color="cyan"
              />
              <SliderControl
                label={t('demoUi.common.animationSpeed')}
                value={animationSpeed}
                min={0}
                max={2}
                step={0.25}
                onChange={setAnimationSpeed}
                color="orange"
              />

              {/* 预设角度按钮 */}
              <div className="space-y-2">
                <span className={cn("text-xs", theme === 'dark' ? "text-gray-400" : "text-gray-600")}>{t('demoUi.common.quickSelect')}</span>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 45, 90, 135].map((angle) => (
                    <motion.button
                      key={angle}
                      className={cn(
                        "py-1.5 rounded-lg text-xs font-medium transition-all border",
                        polarizationAngle === angle
                          ? theme === 'dark'
                            ? 'bg-cyan-400/30 text-cyan-400 border-cyan-400/50'
                            : 'bg-cyan-100 text-cyan-700 border-cyan-300'
                          : theme === 'dark'
                            ? 'bg-slate-700/50 text-gray-400 border-slate-600/50 hover:border-cyan-400/30'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-300'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPolarizationAngle(angle)}
                    >
                      {angle}°
                    </motion.button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                  className={cn(
                    "rounded",
                    theme === 'dark'
                      ? "border-gray-600 bg-slate-700 text-cyan-400"
                      : "border-gray-300 bg-white text-cyan-500"
                  )}
                />
                <span className={cn("text-sm", theme === 'dark' ? "text-gray-300" : "text-gray-700")}>{t('demoUi.common.showComparison')}</span>
              </label>

              {/* 非偏振光可视化模式选择 */}
              <div className={cn("mt-4 pt-4 border-t space-y-2", theme === 'dark' ? "border-slate-700" : "border-gray-200")}>
                <span className={cn("text-xs font-medium", theme === 'dark' ? "text-yellow-400" : "text-yellow-600")}>
                  非偏振光显示模式
                </span>
                <div className="flex gap-2">
                  <motion.button
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all border",
                      unpolarizedViewMode === 'jitter'
                        ? theme === 'dark'
                          ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 text-gray-400 border-slate-600/50'
                          : 'bg-white text-gray-600 border-gray-200'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUnpolarizedViewMode('jitter')}
                  >
                    动态抖动
                  </motion.button>
                  <motion.button
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all border",
                      unpolarizedViewMode === 'superposition'
                        ? theme === 'dark'
                          ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 text-gray-400 border-slate-600/50'
                          : 'bg-white text-gray-600 border-gray-200'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUnpolarizedViewMode('superposition')}
                  >
                    多向叠加
                  </motion.button>
                </div>
                <p className={cn("text-xs", theme === 'dark' ? "text-gray-500" : "text-gray-500")}>
                  {unpolarizedViewMode === 'jitter'
                    ? '模拟电场方向随时间快速随机变化（更物理准确）'
                    : '同时显示所有可能方向，直观理解"统计平均"的概念'}
                </p>
              </div>

              {/* 科学说明 - 简明版 */}
              <div className={cn("mt-4 pt-4 border-t space-y-2", theme === 'dark' ? "border-slate-700" : "border-gray-200")}>
                <h4 className={cn("text-sm font-semibold", theme === 'dark' ? "text-gray-300" : "text-gray-700")}>
                  💡 科学原理
                </h4>
                <div className={cn("text-xs space-y-2", theme === 'dark' ? "text-gray-400" : "text-gray-600")}>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1 flex-shrink-0" />
                    <span>
                      <strong className={theme === 'dark' ? "text-yellow-400" : "text-yellow-600"}>非偏振光：</strong>
                      电场方向随时间随机变化（~10Hz），统计平均后等于所有方向的等概率叠加
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
                    <span>
                      <strong className={theme === 'dark' ? "text-cyan-400" : "text-cyan-600"}>偏振光：</strong>
                      电场在固定方向/模式中振动。线偏振在单一平面内，圆偏振端点做圆周运动
                    </span>
                  </p>
                  <p className={theme === 'dark' ? "text-gray-500" : "text-gray-500 italic"}>
                    底层计算使用相干矩阵（Coherency Matrix），非偏振光 DoP=0
                  </p>
                </div>
              </div>
            </ControlPanel>
          </div>
        }
      />

      {/* 信息卡片 */}
      <InfoGrid columns={2}>
        <InfoCard title={t('demoUi.polarizationIntro.unpolarizedLight')} color="orange">
          <ul className={cn("text-xs space-y-1.5", dt.bodyClass)}>
            {(t('demoUi.polarizationIntro.unpolarizedDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard title={t('demoUi.polarizationIntro.polarizedLight')} color="cyan">
          <ul className={cn("text-xs space-y-1.5", dt.bodyClass)}>
            {(t('demoUi.polarizationIntro.polarizedDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
      </InfoGrid>

      {/* 偏振方向颜色编码 */}
      <TipBanner color="cyan">
        <h4 className="text-sm font-semibold mb-3">{t('demoUi.polarizationIntro.colorCode')}</h4>
        <div className="flex gap-3 justify-center flex-wrap mb-4">
          {[
            { angle: 0, color: '#ef4444', labelKey: 'demoUi.polarizationIntro.horizontal' },
            { angle: 45, color: '#f97316', labelKey: 'demoUi.polarizationIntro.diagonal45' },
            { angle: 90, color: '#22c55e', labelKey: 'demoUi.polarizationIntro.vertical' },
            { angle: 135, color: '#3b82f6', labelKey: 'demoUi.polarizationIntro.diagonal135' },
          ].map(({ angle, color, labelKey }) => (
            <motion.button
              key={angle}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                polarizationAngle === angle
                  ? theme === 'dark'
                    ? 'border-white/50 bg-slate-700/50'
                    : 'border-gray-400 bg-white shadow-sm'
                  : theme === 'dark'
                    ? 'border-slate-600/50 hover:border-slate-500/50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPolarizationAngle(angle)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
              />
              <span className={cn("text-sm", theme === 'dark' ? "text-gray-300" : "text-gray-700")}>{t(labelKey)}</span>
            </motion.button>
          ))}
        </div>
        {/* 两组正交基说明 */}
        <div className={cn(
          "text-xs rounded-xl px-4 py-3 space-y-1.5 border",
          theme === 'dark'
            ? "bg-slate-900/60 border-cyan-400/20 text-gray-400"
            : "bg-cyan-50/80 border-cyan-200 text-gray-600"
        )}>
          <p className="font-medium text-sm mb-2" style={{ color: theme === 'dark' ? '#22d3ee' : '#0891b2' }}>
            为什么选这四个角度？
          </p>
          <p>
            <span style={{ color: '#ef4444' }}>●</span>
            <span style={{ color: '#22c55e' }}>●</span>
            {' '}
            <strong>水平/垂直基（H/V basis）</strong>：0° 与 90° 互相垂直，是最基本的线偏振态对。
          </p>
          <p>
            <span style={{ color: '#f97316' }}>●</span>
            <span style={{ color: '#3b82f6' }}>●</span>
            {' '}
            <strong>对角基（D/A basis）</strong>：45° 与 135° 同样互相垂直，但相对 H/V 旋转了 45°。
          </p>
          <p className={theme === 'dark' ? "text-gray-500" : "text-gray-500"}>
            这两组正交基共同描述了线偏振的完整状态空间，在量子密钥分发（BB84协议）等应用中都有直接用途。
          </p>
        </div>
      </TipBanner>
    </div>
  )
}
