/**
 * Polarization Introduction Demo - 偏振光入门演示
 * 使用 DOM + Framer Motion 对比非偏振光和偏振光
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
}: {
  title: string
  subtitle: string
  isUnpolarized: boolean
  polarizationAngle: number
  animationSpeed: number
}) {
  // 非偏振光的随机角度
  const randomAngles = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350]

  return (
    <div className="flex-1 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800 border border-slate-700/50 p-4">
      <div className="text-center mb-4">
        <h3 className={`text-lg font-semibold ${isUnpolarized ? 'text-yellow-400' : 'text-cyan-400'}`}>
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>

      {/* 电场矢量可视化 */}
      <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
        {/* 背景圆 */}
        <div className="absolute inset-0 rounded-full border border-slate-600/50 bg-slate-900/50" />

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
      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <circle cx="12" cy="12" r="8" />
        </svg>
        <span>k (传播方向，垂直纸面向外)</span>
      </div>

      {/* 偏振角显示 */}
      {!isUnpolarized && (
        <motion.div
          className="mt-3 text-center text-cyan-400 font-mono text-sm"
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
                  title="非偏振光"
                  subtitle="Unpolarized Light"
                  isUnpolarized={true}
                  polarizationAngle={0}
                  animationSpeed={animationSpeed}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <PolarizedPanel
            title="偏振光"
            subtitle="Polarized Light"
            isUnpolarized={false}
            polarizationAngle={polarizationAngle}
            animationSpeed={animationSpeed}
          />
        </div>

        {/* 控制面板 */}
        <ControlPanel title="参数控制" className="w-full lg:w-64">
          <SliderControl
            label="偏振角 Polarization Angle"
            value={polarizationAngle}
            min={0}
            max={180}
            step={15}
            unit="°"
            onChange={setPolarizationAngle}
            color="cyan"
          />
          <SliderControl
            label="动画速度 Animation Speed"
            value={animationSpeed}
            min={0}
            max={2}
            step={0.25}
            onChange={setAnimationSpeed}
            color="orange"
          />

          {/* 预设角度按钮 */}
          <div className="space-y-2">
            <span className="text-xs text-gray-400">快速选择 Quick Select</span>
            <div className="grid grid-cols-4 gap-1">
              {[0, 45, 90, 135].map((angle) => (
                <motion.button
                  key={angle}
                  className={`py-1.5 rounded text-xs font-medium transition-all ${
                    polarizationAngle === angle
                      ? 'bg-cyan-400/30 text-cyan-400 border border-cyan-400/50'
                      : 'bg-slate-700/50 text-gray-400 border border-slate-600/50 hover:border-cyan-400/30'
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
              className="rounded border-gray-600 bg-slate-700 text-cyan-400"
            />
            <span className="text-sm text-gray-300">显示对比 Show Comparison</span>
          </label>

          {/* 关键概念 */}
          <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">关键概念</h4>
            <div className="text-xs text-gray-400 space-y-1.5">
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1 flex-shrink-0" />
                <span><strong className="text-yellow-400">非偏振光：</strong>电场 E 在各方向随机振动</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
                <span><strong className="text-cyan-400">偏振光：</strong>电场 E 在单一平面内振动</span>
              </p>
            </div>
          </div>
        </ControlPanel>
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="非偏振光 Unpolarized Light" color="orange">
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li>• 电场方向随时间随机变化</li>
            <li>• 太阳光、白炽灯等自然光源发出的光</li>
            <li>• 没有优先的振动方向</li>
            <li>• 可用偏振片转化为偏振光</li>
          </ul>
        </InfoCard>
        <InfoCard title="偏振光 Polarized Light" color="cyan">
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li>• 电场在单一平面内振动</li>
            <li>• 可通过偏振片、反射、散射产生</li>
            <li>• 偏振角度定义了振动平面的方向</li>
            <li>• LCD屏幕、3D眼镜都利用偏振光</li>
          </ul>
        </InfoCard>
      </div>

      {/* 偏振方向颜色编码 */}
      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">偏振角度颜色编码</h4>
        <div className="flex gap-4 justify-center flex-wrap">
          {[
            { angle: 0, color: '#ef4444', label: '0° 水平' },
            { angle: 45, color: '#f97316', label: '45° 斜向' },
            { angle: 90, color: '#22c55e', label: '90° 垂直' },
            { angle: 135, color: '#3b82f6', label: '135° 斜向' },
          ].map(({ angle, color, label }) => (
            <motion.button
              key={angle}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                polarizationAngle === angle
                  ? 'border-white/50 bg-slate-700/50'
                  : 'border-slate-600/50 hover:border-slate-500/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPolarizationAngle(angle)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
              />
              <span className="text-sm text-gray-300">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
