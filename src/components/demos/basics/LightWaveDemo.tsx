/**
 * Light Wave Demo - 电磁波交互演示（SVG + Framer Motion 版本）
 * 展示光作为横波的特性，E场和B场振荡
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { SliderControl, ControlPanel, ValueDisplay, Toggle, InfoCard } from '../DemoControls'

export function LightWaveDemo() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [wavelength, setWavelength] = useState(550) // nm
  const [amplitude, setAmplitude] = useState(50)
  const [speed, setSpeed] = useState(0.5)
  const [showBField, setShowBField] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  // 将波长转换为 RGB 颜色
  const wavelengthToRGB = (wl: number): string => {
    let r = 0, g = 0, b = 0
    if (wl >= 380 && wl < 440) {
      r = -(wl - 440) / (440 - 380)
      b = 1
    } else if (wl >= 440 && wl < 490) {
      g = (wl - 440) / (490 - 440)
      b = 1
    } else if (wl >= 490 && wl < 510) {
      g = 1
      b = -(wl - 510) / (510 - 490)
    } else if (wl >= 510 && wl < 580) {
      r = (wl - 510) / (580 - 510)
      g = 1
    } else if (wl >= 580 && wl < 645) {
      r = 1
      g = -(wl - 645) / (645 - 580)
    } else if (wl >= 645 && wl <= 700) {
      r = 1
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
  }

  const waveColor = wavelengthToRGB(wavelength)

  // 动画持续时间基于速度
  const animationDuration = speed > 0 ? 4 / speed : 1000

  // 波形数据（用于SVG路径）
  // 将 generateWavePath 移入 useMemo 内部，确保闭包值正确
  const wavePaths = useMemo(() => {
    const generatePath = (
      phaseOffset: number,
      amplitudeScale: number,
      isVertical: boolean = false
    ) => {
      const width = 600
      const centerY = 150
      const points: string[] = []
      const pixelsPerWavelength = 80 + (wavelength - 400) / 4

      for (let x = 0; x <= width; x += 2) {
        const waveX = (x + phaseOffset) / pixelsPerWavelength * 2 * Math.PI
        const y = isVertical
          ? centerY + amplitude * amplitudeScale * Math.cos(waveX)
          : centerY - amplitude * amplitudeScale * Math.sin(waveX)
        points.push(`${x + 50},${y}`)
      }

      return `M ${points.join(' L ')}`
    }

    const paths = []
    for (let phase = 0; phase <= 200; phase += 10) {
      paths.push({
        phase,
        ePath: generatePath(phase, 1, false),
        bPath: generatePath(phase, 0.3, true),
      })
    }
    return { paths, generatePath }
  }, [wavelength, amplitude])

  return (
    <div className="space-y-6">
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* 可视化区域 */}
        <div className="flex-1">
          <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border-blue-500/20' : 'bg-gradient-to-br from-white via-gray-50 to-blue-50 border-blue-200'} rounded-xl border p-4 overflow-hidden`}>
            <svg
              viewBox="0 0 700 300"
              className="w-full h-auto"
              style={{ minHeight: '280px' }}
            >
              {/* 背景网格 */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,150,255,0.08)" strokeWidth="1"/>
                </pattern>
                {/* 发光效果 */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect width="700" height="300" fill="url(#grid)" />

              {/* 坐标轴 */}
              <line x1="50" y1="150" x2="670" y2="150" stroke="#4b5563" strokeWidth="1.5" />
              <line x1="50" y1="50" x2="50" y2="250" stroke="#4b5563" strokeWidth="1.5" />

              {/* 箭头 */}
              <polygon points="670,150 660,145 660,155" fill="#4b5563" />
              <polygon points="50,50 45,60 55,60" fill="#4b5563" />

              {/* 轴标签 */}
              <text x="680" y="155" fill="#9ca3af" fontSize="14">x</text>
              <text x="55" y="45" fill="#9ca3af" fontSize="14">E</text>
              {showBField && (
                <text x="55" y="265" fill="#60a5fa" fontSize="12">B</text>
              )}

              {/* E场波形 - 动画 */}
              <motion.path
                d={wavePaths.generatePath(0, 1, false)}
                fill="none"
                stroke={waveColor}
                strokeWidth="3"
                filter="url(#glow)"
                animate={isPlaying && wavePaths.paths.length > 0 ? {
                  d: wavePaths.paths.map(p => p.ePath),
                } : {}}
                transition={{
                  duration: animationDuration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* B场波形 - 虚线动画 */}
              {showBField && (
                <motion.path
                  d={wavePaths.generatePath(0, 0.3, true)}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  opacity="0.8"
                  animate={isPlaying && wavePaths.paths.length > 0 ? {
                    d: wavePaths.paths.map(p => p.bPath),
                  } : {}}
                  transition={{
                    duration: animationDuration,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              {/* 波长标记 */}
              <g transform="translate(150, 220)">
                <line x1="0" y1="0" x2="0" y2="15" stroke="#6b7280" strokeWidth="1" />
                <line x1={80 + (wavelength - 400) / 4} y1="0" x2={80 + (wavelength - 400) / 4} y2="15" stroke="#6b7280" strokeWidth="1" />
                <line x1="0" y1="8" x2={80 + (wavelength - 400) / 4} y2="8" stroke="#6b7280" strokeWidth="1" />
                <text x={(80 + (wavelength - 400) / 4) / 2} y="30" fill="#9ca3af" fontSize="11" textAnchor="middle">
                  λ = {wavelength} nm
                </text>
              </g>

              {/* 光速标注 */}
              <text x="600" y="30" fill="#6b7280" fontSize="11">c = 3×10⁸ m/s</text>

              {/* 颜色指示 */}
              <rect x="600" y="40" width="60" height="20" rx="4" fill={waveColor} opacity="0.8" />
            </svg>
          </div>

          {/* 可见光谱 */}
          <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'} border`}>
            <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('demoUi.common.visibleSpectrum')}</h4>
            <div
              className="h-8 rounded cursor-pointer relative"
              style={{
                background: 'linear-gradient(to right, violet, blue, cyan, green, yellow, orange, red)',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percent = x / rect.width
                const newWavelength = Math.round(380 + percent * 320)
                setWavelength(Math.max(380, Math.min(700, newWavelength)))
              }}
            >
              {/* 当前波长指示器 */}
              <motion.div
                className="absolute top-0 w-1 h-full bg-white/80 rounded"
                style={{ left: `${((wavelength - 380) / 320) * 100}%` }}
                layoutId="wavelength-indicator"
              />
            </div>
            <div className={`flex justify-between text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              <span>380 nm ({t('demoUi.common.violet')})</span>
              <span>550 nm ({t('demoUi.common.green')})</span>
              <span>700 nm ({t('demoUi.common.red')})</span>
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <ControlPanel title={t('demoUi.lightWave.waveParameters')} className="w-full lg:w-72">
          <SliderControl
            label={t('demoUi.common.wavelength')}
            value={wavelength}
            min={380}
            max={700}
            step={5}
            unit=" nm"
            onChange={setWavelength}
            color="cyan"
          />
          <SliderControl
            label={t('demoUi.common.amplitude')}
            value={amplitude}
            min={20}
            max={80}
            step={5}
            onChange={setAmplitude}
            color="green"
          />
          <SliderControl
            label={t('demoUi.common.animationSpeed')}
            value={speed}
            min={0}
            max={2}
            step={0.1}
            onChange={setSpeed}
            color="orange"
          />

          <div className="flex items-center gap-4 pt-2">
            <Toggle
              label={t('demoUi.common.showBField')}
              checked={showBField}
              onChange={setShowBField}
            />
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

          <div className={`pt-2 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <ValueDisplay label={t('demoUi.common.color')} value={waveColor} />
            <ValueDisplay label={t('demoUi.common.frequency')} value={`${(3e8 / (wavelength * 1e-9) / 1e14).toFixed(2)} × 10¹⁴ Hz`} />
          </div>
        </ControlPanel>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title={t('demoUi.lightWave.emWaveFeatures')} color="cyan">
          <ul className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} space-y-1.5`}>
            {(t('demoUi.lightWave.emWaveDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard title={t('demoUi.lightWave.transverseFeatures')} color="purple">
          <ul className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} space-y-1.5`}>
            {(t('demoUi.lightWave.transverseDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
