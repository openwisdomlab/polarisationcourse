/**
 * Polarization Introduction Demo - 偏振光入门演示
 * 使用 DOM + Framer Motion 对比非偏振光和偏振光
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'

// 电场矢量组件
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

// 偏振光面板
function PolarizedPanel({
  title,
  subtitle,
  isUnpolarized,
  polarizationAngle,
  animationSpeed,
  propagationText,
  theme,
}: {
  title: string
  subtitle: string
  isUnpolarized: boolean
  polarizationAngle: number
  animationSpeed: number
  propagationText: string
  theme: 'dark' | 'light'
}) {
  // 非偏振光的随机角度
  const randomAngles = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350]

  return (
    <div className={`flex-1 rounded-xl bg-gradient-to-br p-4 border ${
      theme === 'dark'
        ? 'from-slate-900 via-slate-900/95 to-slate-800 border-slate-700/50'
        : 'from-white via-gray-50 to-amber-50/50 border-gray-200'
    }`}>
      <div className="text-center mb-4">
        <h3 className={`text-lg font-semibold ${isUnpolarized ? 'text-yellow-500' : 'text-cyan-500'} ${theme === 'dark' ? '' : ''}`}>
          {title}
        </h3>
        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
      </div>

      {/* 电场矢量可视化 */}
      <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
        {/* 背景圆 */}
        <div className={`absolute inset-0 rounded-full border ${
          theme === 'dark'
            ? 'border-slate-600/50 bg-slate-900/50'
            : 'border-gray-300 bg-white'
        }`} />

        {/* 中心光源点 */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-4 h-4 rounded-full -ml-2 -mt-2 ${
            isUnpolarized ? 'bg-yellow-400' : 'bg-cyan-400'
          }`}
          animate={{
            boxShadow: [
              `0 0 10px ${isUnpolarized ? '#fbbf24' : '#22d3ee'}`,
              `0 0 20px ${isUnpolarized ? '#fbbf24' : '#22d3ee'}`,
              `0 0 10px ${isUnpolarized ? '#fbbf24' : '#22d3ee'}`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* 电场矢量 */}
        {isUnpolarized ? (
          // 非偏振光 - 多个随机方向的矢量
          randomAngles.map((angle, i) => (
            <EFieldVector
              key={i}
              angle={angle}
              length={70}
              color={`hsl(${angle}, 70%, 60%)`}
              animate={animationSpeed > 0}
              delay={i * 0.1}
            />
          ))
        ) : (
          // 偏振光 - 单一方向的矢量
          <EFieldVector
            angle={polarizationAngle}
            length={80}
            color="#22d3ee"
            animate={animationSpeed > 0}
          />
        )}

        {/* 偏振方向指示线（偏振光） */}
        {!isUnpolarized && (
          <motion.div
            className="absolute left-1/2 top-1/2 w-[180px] h-[1px] -ml-[90px] border-t border-dashed border-gray-500/50"
            style={{ rotate: polarizationAngle }}
          />
        )}
      </div>

      {/* 传播方向指示 */}
      <div className={`flex items-center justify-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <circle cx="12" cy="12" r="8" />
        </svg>
        <span>{propagationText}</span>
      </div>

      {/* 偏振角显示 */}
      {!isUnpolarized && (
        <motion.div
          className="mt-3 text-center text-cyan-500 font-mono text-sm"
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
  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [showComparison, setShowComparison] = useState(true)

  return (
    <div className="space-y-6">
      {/* 主可视化区域 */}
      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="flex-1 flex gap-4">
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
                  subtitle="Unpolarized Light"
                  isUnpolarized={true}
                  polarizationAngle={0}
                  animationSpeed={animationSpeed}
                  propagationText={t('demoUi.polarizationIntro.propagationDirection')}
                  theme={theme}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <PolarizedPanel
            title={t('demoUi.polarizationIntro.polarizedLight')}
            subtitle="Polarized Light"
            isUnpolarized={false}
            polarizationAngle={polarizationAngle}
            animationSpeed={animationSpeed}
            propagationText={t('demoUi.polarizationIntro.propagationDirection')}
            theme={theme}
          />
        </div>

        {/* 控制面板 */}
        <ControlPanel title={t('demoUi.common.controlPanel')} className="w-full lg:w-64">
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
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('demoUi.common.quickSelect')}</span>
            <div className="grid grid-cols-4 gap-1">
              {[0, 45, 90, 135].map((angle) => (
                <motion.button
                  key={angle}
                  className={`py-1.5 rounded text-xs font-medium transition-all ${
                    polarizationAngle === angle
                      ? 'bg-cyan-400/30 text-cyan-500 border border-cyan-400/50'
                      : theme === 'dark'
                        ? 'bg-slate-700/50 text-gray-400 border border-slate-600/50 hover:border-cyan-400/30'
                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:border-cyan-400/50'
                  }`}
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
              className={`rounded text-cyan-500 ${theme === 'dark' ? 'border-gray-600 bg-slate-700' : 'border-gray-300 bg-white'}`}
            />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('demoUi.common.showComparison')}</span>
          </label>

          {/* 关键概念 */}
          <div className={`mt-4 pt-4 border-t space-y-2 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('demoUi.common.keyConcepts')}</h4>
            <div className={`text-xs space-y-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1 flex-shrink-0" />
                <span><strong className="text-yellow-500">{t('demoUi.polarizationIntro.unpolarizedLight')}:</strong> {t('demoUi.polarizationIntro.unpolarizedDesc')}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
                <span><strong className="text-cyan-500">{t('demoUi.polarizationIntro.polarizedLight')}:</strong> {t('demoUi.polarizationIntro.polarizedDesc')}</span>
              </p>
            </div>
          </div>
        </ControlPanel>
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title={t('demoUi.polarizationIntro.unpolarizedLight')} color="orange">
          <ul className={`text-xs space-y-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {(t('demoUi.polarizationIntro.unpolarizedDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard title={t('demoUi.polarizationIntro.polarizedLight')} color="cyan">
          <ul className={`text-xs space-y-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {(t('demoUi.polarizationIntro.polarizedDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
      </div>

      {/* 偏振方向颜色编码 */}
      <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('demoUi.polarizationIntro.colorCode')}</h4>
        <div className="flex gap-4 justify-center flex-wrap">
          {[
            { angle: 0, color: '#ef4444', labelKey: 'demoUi.polarizationIntro.horizontal' },
            { angle: 45, color: '#f97316', labelKey: 'demoUi.polarizationIntro.diagonal45' },
            { angle: 90, color: '#22c55e', labelKey: 'demoUi.polarizationIntro.vertical' },
            { angle: 135, color: '#3b82f6', labelKey: 'demoUi.polarizationIntro.diagonal135' },
          ].map(({ angle, color, labelKey }) => (
            <motion.button
              key={angle}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                polarizationAngle === angle
                  ? theme === 'dark'
                    ? 'border-white/50 bg-slate-700/50'
                    : 'border-gray-400 bg-gray-100'
                  : theme === 'dark'
                    ? 'border-slate-600/50 hover:border-slate-500/50'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPolarizationAngle(angle)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t(labelKey)}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
