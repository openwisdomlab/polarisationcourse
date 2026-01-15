/**
 * Polarization Types Demo - 偏振类型演示
 * 展示线偏振、圆偏振、椭圆偏振（SVG + Framer Motion）
 */
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

type PolarizationType = 'linear' | 'circular' | 'elliptical'

export function PolarizationTypesDemo() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [polarizationType, setPolarizationType] = useState<PolarizationType>('linear')
  const [linearAngle, setLinearAngle] = useState(45)
  const [ellipseRatio, setEllipseRatio] = useState(0.5)
  const [circularDirection, setCircularDirection] = useState<'right' | 'left'>('right')
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [showTrail, setShowTrail] = useState(true)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // 动画循环
  useEffect(() => {
    if (!isPlaying || animationSpeed === 0) return

    const interval = setInterval(() => {
      setTime(t => t + 0.05 * animationSpeed)
    }, 16)

    return () => clearInterval(interval)
  }, [isPlaying, animationSpeed])

  // 计算当前电场位置
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

      // 轨迹
      for (let t = 0; t < 100; t++) {
        const p = (time - t * 0.01) * 2
        const osc = Math.sin(p)
        trailPoints.push(`${200 + radius * Math.cos(angleRad) * osc},${200 - radius * Math.sin(angleRad) * osc}`)
      }
    } else if (polarizationType === 'circular') {
      const direction = circularDirection === 'right' ? 1 : -1
      ex = radius * Math.cos(phase)
      ey = -radius * Math.sin(phase * direction)

      // 轨迹
      for (let t = 0; t < 100; t++) {
        const p = (time - t * 0.01) * 2
        trailPoints.push(`${200 + radius * Math.cos(p)},${200 - radius * Math.sin(p * direction)}`)
      }
    } else {
      const direction = circularDirection === 'right' ? 1 : -1
      ex = radius * Math.cos(phase)
      ey = -radius * ellipseRatio * Math.sin(phase * direction)

      // 轨迹
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

  // 参考形状路径
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

  const getTypeLabel = (type: PolarizationType) => {
    if (type === 'linear') {
      return t('demoUi.common.linearPolarization')
    } else if (type === 'circular') {
      return circularDirection === 'right' ? t('demoUi.common.rightCircularPol') : t('demoUi.common.leftCircularPol')
    } else {
      return t('demoUi.common.ellipticalPolarization')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* SVG 可视化区域 */}
        <div className="flex-1">
          <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-indigo-500/20' : 'bg-gradient-to-br from-white via-gray-50 to-indigo-50 border-indigo-200'} rounded-xl border p-4`}>
            <svg viewBox="0 0 400 400" className="w-full h-auto max-w-[400px] mx-auto">
              <defs>
                {/* 发光滤镜 */}
                <filter id="glow-cyan">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* 渐变 */}
                <linearGradient id="trail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* 坐标轴 */}
              <line x1="70" y1="200" x2="330" y2="200" stroke="#4b5563" strokeWidth="1.5" />
              <line x1="200" y1="70" x2="200" y2="330" stroke="#4b5563" strokeWidth="1.5" />

              {/* 箭头 */}
              <polygon points="330,200 320,195 320,205" fill="#4b5563" />
              <polygon points="200,70 195,80 205,80" fill="#4b5563" />

              {/* 轴标签 */}
              <text x="340" y="205" fill="#9ca3af" fontSize="14">Ex</text>
              <text x="205" y="60" fill="#9ca3af" fontSize="14">Ey</text>

              {/* 参考形状（虚线） */}
              <path
                d={referencePath}
                fill="none"
                stroke="#4b5563"
                strokeWidth="1"
                strokeDasharray="5 5"
              />

              {/* 轨迹 */}
              {showTrail && (
                <motion.path
                  d={trailPath}
                  fill="none"
                  stroke="url(#trail-gradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              )}

              {/* 电场矢量 */}
              <motion.line
                x1="200"
                y1="200"
                x2={ex}
                y2={ey}
                stroke="#22d3ee"
                strokeWidth="3"
                filter="url(#glow-cyan)"
              />

              {/* 箭头 */}
              <motion.g
                style={{
                  transformOrigin: `${ex}px ${ey}px`,
                }}
              >
                <circle cx={ex} cy={ey} r="6" fill="#22d3ee" filter="url(#glow-cyan)" />
              </motion.g>

              {/* 当前点 */}
              <motion.circle
                cx={ex}
                cy={ey}
                r="4"
                fill="#fbbf24"
                filter="url(#glow-cyan)"
              />

              {/* 中心点 */}
              <circle cx="200" cy="200" r="4" fill="#9ca3af" />

              {/* 类型标签 */}
              <text x="20" y="30" fill="#9ca3af" fontSize="14">{getTypeLabel(polarizationType)}</text>

              {/* 相位显示 */}
              <text x="320" y="30" fill="#6b7280" fontSize="12">
                φ = {((time * 2 * 180 / Math.PI) % 360).toFixed(0)}°
              </text>
            </svg>
          </div>

          {/* 类型选择器 */}
          <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'} border`}>
            <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>{t('demoUi.common.polarizationType')}</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['linear', 'circular', 'elliptical'] as PolarizationType[]).map((type) => {
                const colors = {
                  linear: { active: 'bg-orange-400/20 border-orange-400/50 text-orange-400', inactive: 'hover:border-orange-400/30' },
                  circular: { active: 'bg-green-400/20 border-green-400/50 text-green-400', inactive: 'hover:border-green-400/30' },
                  elliptical: { active: 'bg-purple-400/20 border-purple-400/50 text-purple-400', inactive: 'hover:border-purple-400/30' },
                }
                const labels = {
                  linear: t('demoUi.common.linearPolarization'),
                  circular: t('demoUi.common.circularPolarization'),
                  elliptical: t('demoUi.common.ellipticalPolarization')
                }

                return (
                  <motion.button
                    key={type}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                      polarizationType === type
                        ? colors[type].active
                        : `${theme === 'dark' ? 'bg-slate-700/50 text-gray-400 border-slate-600/50' : 'bg-gray-100 text-gray-500 border-gray-300'} ${colors[type].inactive}`
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

        {/* 控制面板 */}
        <ControlPanel title={t('demoUi.common.parameters')} className="w-full lg:w-72">
          {/* 条件控件 */}
          {polarizationType === 'linear' && (
            <SliderControl
              label={t('demoUi.common.polarizationAngle')}
              value={linearAngle}
              min={0}
              max={180}
              step={15}
              unit="°"
              onChange={setLinearAngle}
              color="orange"
            />
          )}

          {(polarizationType === 'circular' || polarizationType === 'elliptical') && (
            <div className="space-y-2">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('demoUi.common.rotationDirection')}</span>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                    circularDirection === 'right'
                      ? 'bg-green-400/20 text-green-400 border-green-400/50'
                      : `${theme === 'dark' ? 'bg-slate-700/50 text-gray-400 border-slate-600/50' : 'bg-gray-100 text-gray-500 border-gray-300'} hover:border-green-400/30`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCircularDirection('right')}
                >
                  {t('demoUi.common.rightRotation')}
                </motion.button>
                <motion.button
                  className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                    circularDirection === 'left'
                      ? 'bg-purple-400/20 text-purple-400 border-purple-400/50'
                      : `${theme === 'dark' ? 'bg-slate-700/50 text-gray-400 border-slate-600/50' : 'bg-gray-100 text-gray-500 border-gray-300'} hover:border-purple-400/30`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCircularDirection('left')}
                >
                  {t('demoUi.common.leftRotation')}
                </motion.button>
              </div>
            </div>
          )}

          {polarizationType === 'elliptical' && (
            <SliderControl
              label={t('demoUi.common.ellipseRatio')}
              value={ellipseRatio}
              min={0.1}
              max={0.9}
              step={0.1}
              onChange={setEllipseRatio}
              color="purple"
            />
          )}

          <SliderControl
            label={t('demoUi.common.animationSpeed')}
            value={animationSpeed}
            min={0}
            max={2}
            step={0.25}
            onChange={setAnimationSpeed}
            color="cyan"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTrail}
                onChange={(e) => setShowTrail(e.target.checked)}
                className={`rounded ${theme === 'dark' ? 'border-gray-600 bg-slate-700' : 'border-gray-300 bg-white'} text-cyan-400`}
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('demoUi.common.showTrail')}</span>
            </label>
          </div>

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
            {isPlaying ? t('demoUi.common.pause') : t('demoUi.common.play')}
          </motion.button>

          {/* 物理意义 */}
          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} space-y-2`}>
            <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('demoUi.common.physicalMeaning')}</h4>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
              {polarizationType === 'linear' && (
                <p>{t('demoUi.polarizationTypes.linearPhysics')}</p>
              )}
              {polarizationType === 'circular' && (
                <p>{t('demoUi.polarizationTypes.circularPhysics')}</p>
              )}
              {polarizationType === 'elliptical' && (
                <p>{t('demoUi.polarizationTypes.ellipticalPhysics')}</p>
              )}
            </div>
          </div>
        </ControlPanel>
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          title={t('demoUi.common.linearPolarization')}
          color={polarizationType === 'linear' ? 'orange' : 'cyan'}
        >
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('demoUi.polarizationTypes.linearDesc')}
          </p>
        </InfoCard>
        <InfoCard
          title={t('demoUi.common.circularPolarization')}
          color={polarizationType === 'circular' ? 'green' : 'cyan'}
        >
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('demoUi.polarizationTypes.circularDesc')}
          </p>
        </InfoCard>
        <InfoCard
          title={t('demoUi.common.ellipticalPolarization')}
          color={polarizationType === 'elliptical' ? 'purple' : 'cyan'}
        >
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('demoUi.polarizationTypes.ellipticalDesc')}
          </p>
        </InfoCard>
      </div>
    </div>
  )
}
