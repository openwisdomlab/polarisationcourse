/**
 * Light Wave Demo - 电磁波交互演示（SVG + Framer Motion 版本）
 * 展示光作为横波的特性，E场和B场振荡
 *
 * Redesigned with DemoLayout components for consistent framing,
 * enhanced SVG rendering, and refined visual polish.
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SliderControl, ControlPanel, ValueDisplay, Toggle, InfoCard } from '../DemoControls'
import { DemoHeader, VisualizationPanel, DemoMainLayout, InfoGrid } from '../DemoLayout'
import { useDemoTheme } from '../demoThemeColors'

export function LightWaveDemo() {
  const { t } = useTranslation()
  const dt = useDemoTheme()
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
  // 物理准确性：E场和B场在电磁波中是同相的（峰值对齐）
  const wavePaths = useMemo(() => {
    const generatePath = (
      phaseOffset: number,
      amplitudeScale: number
    ) => {
      const width = 600
      const centerY = 150
      const points: string[] = []
      const pixelsPerWavelength = 80 + (wavelength - 400) / 4

      for (let x = 0; x <= width; x += 2) {
        const waveX = (x + phaseOffset) / pixelsPerWavelength * 2 * Math.PI
        // E and B fields are IN PHASE in electromagnetic waves (peaks align with peaks)
        // Both use negative sin so they visually peak together (same direction)
        // B-field has smaller amplitude (0.3x) to distinguish it while showing phase alignment
        const y = centerY - amplitude * amplitudeScale * Math.sin(waveX)
        points.push(`${x + 50},${y}`)
      }

      return `M ${points.join(' L ')}`
    }

    const paths = []
    for (let phase = 0; phase <= 200; phase += 10) {
      paths.push({
        phase,
        ePath: generatePath(phase, 1),      // E-field: full amplitude
        bPath: generatePath(phase, 0.3),    // B-field: 0.3x amplitude (visually distinct but in phase)
      })
    }
    return { paths, generatePath }
  }, [wavelength, amplitude])

  // SVG可视化内容
  const visualization = (
    <div className="space-y-4">
      <VisualizationPanel variant="blue">
        <svg
          viewBox="0 0 700 300"
          className="w-full h-auto"
          style={{ minHeight: '280px' }}
        >
          {/* 增强滤镜与渐变定义 */}
          <defs>
            {/* 柔和网格 */}
            <pattern id="lw-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={dt.isDark ? 'rgba(100,150,255,0.04)' : 'rgba(100,150,255,0.06)'}
                strokeWidth="0.5"
              />
            </pattern>
            {/* 精细子网格 */}
            <pattern id="lw-subgrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke={dt.isDark ? 'rgba(100,150,255,0.015)' : 'rgba(100,150,255,0.03)'}
                strokeWidth="0.5"
              />
            </pattern>
            {/* E场发光效果 */}
            <filter id="lw-glow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="1.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* B场柔和发光 */}
            <filter id="lw-glow-soft" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 波形渐变遮罩 - 左右淡出 */}
            <linearGradient id="lw-fade-mask" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="6%" stopColor="white" stopOpacity="1" />
              <stop offset="94%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="lw-wave-mask">
              <rect x="50" y="0" width="620" height="300" fill="url(#lw-fade-mask)" />
            </mask>
            {/* 背景渐变 */}
            <radialGradient id="lw-bg-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={dt.isDark ? 'rgba(34,211,238,0.03)' : 'rgba(34,211,238,0.02)'} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* 背景层 */}
          <rect width="700" height="300" fill="url(#lw-subgrid)" />
          <rect width="700" height="300" fill="url(#lw-grid)" />
          <rect width="700" height="300" fill="url(#lw-bg-glow)" />

          {/* 坐标轴 */}
          <line x1="50" y1="150" x2="670" y2="150" stroke={dt.axisColor} strokeWidth="1" opacity="0.6" />
          <line x1="50" y1="50" x2="50" y2="250" stroke={dt.axisColor} strokeWidth="1" opacity="0.6" />

          {/* 箭头 - 更精致 */}
          <polygon points="670,150 658,146 658,154" fill={dt.axisColor} opacity="0.7" />
          <polygon points="50,50 46,62 54,62" fill={dt.axisColor} opacity="0.7" />

          {/* 轴标签 */}
          <text x="680" y="155" fill={dt.textSecondary} fontSize="13" fontFamily="serif" fontStyle="italic">x</text>
          <text x="57" y="46" fill={dt.textSecondary} fontSize="13" fontFamily="serif" fontWeight="bold" fontStyle="italic">E</text>
          {showBField && (
            <text x="57" y="268" fill="#60a5fa" fontSize="11" fontFamily="serif" fontWeight="bold" fontStyle="italic" opacity="0.8">B</text>
          )}

          {/* 波形组（带遮罩淡出边缘） */}
          <g mask="url(#lw-wave-mask)">
            {/* E场波形 - 动画 */}
            <motion.path
              d={wavePaths.generatePath(0, 1)}
              fill="none"
              stroke={waveColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lw-glow)"
              animate={isPlaying && wavePaths.paths.length > 0 ? {
                d: wavePaths.paths.map(p => p.ePath),
              } : {}}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* B场波形 - 虚线动画 (与E场同相，峰值对齐) */}
            {showBField && (
              <motion.path
                d={wavePaths.generatePath(0, 0.3)}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                opacity="0.7"
                filter="url(#lw-glow-soft)"
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
          </g>

          {/* 波长标记 - 更精致的样式 */}
          <g transform="translate(150, 220)">
            <line x1="0" y1="0" x2="0" y2="12" stroke={dt.textMuted} strokeWidth="0.8" opacity="0.6" />
            <line x1={80 + (wavelength - 400) / 4} y1="0" x2={80 + (wavelength - 400) / 4} y2="12" stroke={dt.textMuted} strokeWidth="0.8" opacity="0.6" />
            <line x1="0" y1="6" x2={80 + (wavelength - 400) / 4} y2="6" stroke={dt.textMuted} strokeWidth="0.8" opacity="0.6" />
            {/* 箭头端点 */}
            <polygon points="2,6 6,4 6,8" fill={dt.textMuted} opacity="0.5" />
            <polygon points={`${78 + (wavelength - 400) / 4},6 ${74 + (wavelength - 400) / 4},4 ${74 + (wavelength - 400) / 4},8`} fill={dt.textMuted} opacity="0.5" />
            <text x={(80 + (wavelength - 400) / 4) / 2} y="26" fill={dt.textSecondary} fontSize="10.5" textAnchor="middle" fontFamily="system-ui">
              λ = {wavelength} nm
            </text>
          </g>

          {/* 光速标注 - 精致徽章风格 */}
          <g transform="translate(580, 16)">
            <rect x="0" y="0" width="82" height="22" rx="6" fill={dt.isDark ? 'rgba(30,41,59,0.7)' : 'rgba(241,245,249,0.9)'} stroke={dt.isDark ? 'rgba(71,85,105,0.4)' : 'rgba(203,213,225,0.6)'} strokeWidth="0.5" />
            <text x="41" y="15" fill={dt.textSecondary} fontSize="10" textAnchor="middle" fontFamily="system-ui">c = 3×10⁸ m/s</text>
          </g>

          {/* 颜色指示 - 圆角胶囊 + 发光 */}
          <rect x="588" y="44" width="72" height="18" rx="9" fill={waveColor} opacity="0.75" />
          <rect x="588" y="44" width="72" height="18" rx="9" fill="none" stroke={waveColor} strokeWidth="0.5" opacity="0.3" />
        </svg>
      </VisualizationPanel>

      {/* 可见光谱 */}
      <motion.div
        className={`p-4 rounded-2xl border ${dt.panelClass}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h4 className={`text-sm font-semibold ${dt.headingClass} mb-2.5`}>
          {t('demoUi.common.visibleSpectrum')}
        </h4>
        <div className="relative">
          <div
            className="h-10 rounded-xl cursor-pointer overflow-hidden relative"
            style={{
              background: 'linear-gradient(to right, #8b00ff, #4400ff, #0044ff, #00ccff, #00ff44, #aaff00, #ffff00, #ffaa00, #ff4400, #ff0000)',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percent = x / rect.width
              const newWavelength = Math.round(380 + percent * 320)
              setWavelength(Math.max(380, Math.min(700, newWavelength)))
            }}
          >
            {/* 柔和的顶部高光 */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl pointer-events-none" />
            {/* 底部阴影 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl pointer-events-none" />
            {/* 当前波长指示器 */}
            <motion.div
              className="absolute top-0 h-full flex items-center justify-center pointer-events-none"
              style={{ left: `${((wavelength - 380) / 320) * 100}%` }}
              layoutId="wavelength-indicator"
            >
              <div className="w-1 h-full bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            </motion.div>
          </div>
          {/* 标签 */}
          <div className={`flex justify-between text-xs ${dt.mutedTextClass} mt-2 px-0.5`}>
            <span>380 nm ({t('demoUi.common.violet')})</span>
            <span>550 nm ({t('demoUi.common.green')})</span>
            <span>700 nm ({t('demoUi.common.red')})</span>
          </div>
        </div>
      </motion.div>
    </div>
  )

  // 控制面板
  const controls = (
    <ControlPanel title={t('demoUi.lightWave.waveParameters')} className="w-full">
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
        className={`w-full py-2.5 rounded-xl font-medium transition-all ${
          isPlaying
            ? dt.isDark
              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25 hover:bg-orange-500/20'
              : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
            : dt.isDark
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20'
              : 'bg-cyan-50 text-cyan-600 border border-cyan-200 hover:bg-cyan-100'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? t('demoUi.common.pause') : t('demoUi.common.play')}
      </motion.button>

      <div className={`pt-3 mt-1 border-t ${dt.borderClass}`}>
        <ValueDisplay label={t('demoUi.common.color')} value={waveColor} />
        <ValueDisplay label={t('demoUi.common.frequency')} value={`${(3e8 / (wavelength * 1e-9) / 1e14).toFixed(2)} × 10¹⁴ Hz`} />
      </div>
    </ControlPanel>
  )

  return (
    <div className="space-y-5">
      {/* 渐变标题 */}
      <DemoHeader
        title={t('demoUi.lightWave.title', 'Light Wave Visualization')}
        subtitle={t('demoUi.lightWave.subtitle', 'Explore how light propagates as an electromagnetic transverse wave')}
        gradient="cyan"
      />

      {/* 两栏布局：可视化 + 控制面板 */}
      <DemoMainLayout
        visualization={visualization}
        controls={controls}
        controlsWidth="narrow"
      />

      {/* 知识卡片网格 */}
      <InfoGrid columns={2}>
        <InfoCard title={t('demoUi.lightWave.emWaveFeatures')} color="cyan">
          <ul className={`text-xs ${dt.bodyClass} space-y-1.5`}>
            {(t('demoUi.lightWave.emWaveDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard title={t('demoUi.lightWave.transverseFeatures')} color="purple">
          <ul className={`text-xs ${dt.bodyClass} space-y-1.5`}>
            {(t('demoUi.lightWave.transverseDetails', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
