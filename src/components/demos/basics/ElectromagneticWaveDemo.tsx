/**
 * ElectromagneticWaveDemo - 电磁波统一演示
 * 合并原有的 LightWaveDemo（电磁波可视化）和 ElectromagneticSpectrumDemo（电磁波谱）
 *
 * Features:
 * - Tab-based navigation between Wave View and Spectrum View
 * - Interactive wave animation with E/B field toggle
 * - Full electromagnetic spectrum with applications
 * - Wavelength-to-color conversion
 * - Difficulty-aware content display
 */
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Waves, BarChart3 } from 'lucide-react'
import { SliderControl, ControlPanel, ValueDisplay, Toggle, InfoCard, Formula } from '../DemoControls'
import { DifficultyLevel, useDifficultyConfig, WhyButton, DifficultyGate } from '../DifficultyStrategy'

type ViewMode = 'wave' | 'spectrum'

// Electromagnetic spectrum region definitions
interface SpectrumRegion {
  id: string
  name: string
  nameZh: string
  wavelengthRange: [number, number]
  frequencyRange: [number, number]
  color: string
  gradientStart: string
  gradientEnd: string
  sizeComparison: string
  sizeComparisonZh: string
  sizeIcon: string
  applications: string[]
  applicationsZh: string[]
  canPenetrate: boolean
  penetrateInfo: string
  penetrateInfoZh: string
}

const SPECTRUM_REGIONS: SpectrumRegion[] = [
  {
    id: 'radio',
    name: 'Radio Waves',
    nameZh: '无线电波',
    wavelengthRange: [1e3, 1e-1],
    frequencyRange: [3e5, 3e9],
    color: '#ff6b6b',
    gradientStart: '#ff6b6b',
    gradientEnd: '#ffa500',
    sizeComparison: 'Building',
    sizeComparisonZh: '建筑物',
    sizeIcon: '🏢',
    applications: ['AM/FM Radio', 'Television', 'Mobile phones'],
    applicationsZh: ['调幅/调频广播', '电视', '手机通信'],
    canPenetrate: true,
    penetrateInfo: 'Can pass through atmosphere',
    penetrateInfoZh: '可穿透大气层',
  },
  {
    id: 'microwave',
    name: 'Microwaves',
    nameZh: '微波',
    wavelengthRange: [1e-1, 1e-3],
    frequencyRange: [3e9, 3e11],
    color: '#ffa500',
    gradientStart: '#ffa500',
    gradientEnd: '#ffdd00',
    sizeComparison: 'Human',
    sizeComparisonZh: '人体',
    sizeIcon: '🧍',
    applications: ['Microwave ovens', 'Radar', 'WiFi/Bluetooth'],
    applicationsZh: ['微波炉', '雷达', 'WiFi/蓝牙'],
    canPenetrate: false,
    penetrateInfo: 'Blocked by atmosphere (partially)',
    penetrateInfoZh: '部分被大气层吸收',
  },
  {
    id: 'infrared',
    name: 'Infrared',
    nameZh: '红外线',
    wavelengthRange: [1e-3, 7e-7],
    frequencyRange: [3e11, 4.3e14],
    color: '#ff4444',
    gradientStart: '#ffdd00',
    gradientEnd: '#ff0000',
    sizeComparison: 'Butterfly',
    sizeComparisonZh: '蝴蝶',
    sizeIcon: '🦋',
    applications: ['Thermal imaging', 'Remote controls', 'Night vision'],
    applicationsZh: ['热成像', '遥控器', '夜视仪'],
    canPenetrate: false,
    penetrateInfo: 'Absorbed by water vapor and CO₂',
    penetrateInfoZh: '被水蒸气和CO₂吸收',
  },
  {
    id: 'visible',
    name: 'Visible Light',
    nameZh: '可见光',
    wavelengthRange: [7e-7, 4e-7],
    frequencyRange: [4.3e14, 7.5e14],
    color: '#00ff00',
    gradientStart: '#ff0000',
    gradientEnd: '#8b00ff',
    sizeComparison: 'Needle tip',
    sizeComparisonZh: '针尖',
    sizeIcon: '📍',
    applications: ['Human vision', 'Photography', 'Optical fiber'],
    applicationsZh: ['人眼视觉', '摄影', '光纤通信'],
    canPenetrate: true,
    penetrateInfo: 'Can pass through atmosphere (window)',
    penetrateInfoZh: '可穿透大气层（大气窗口）',
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet',
    nameZh: '紫外线',
    wavelengthRange: [4e-7, 1e-8],
    frequencyRange: [7.5e14, 3e16],
    color: '#8b00ff',
    gradientStart: '#8b00ff',
    gradientEnd: '#4400ff',
    sizeComparison: 'Molecule',
    sizeComparisonZh: '分子',
    sizeIcon: '⚛️',
    applications: ['Sterilization', 'Fluorescence', 'Vitamin D synthesis'],
    applicationsZh: ['杀菌消毒', '荧光检测', '维生素D合成'],
    canPenetrate: false,
    penetrateInfo: 'Mostly blocked by ozone layer',
    penetrateInfoZh: '大部分被臭氧层阻挡',
  },
  {
    id: 'xray',
    name: 'X-rays',
    nameZh: 'X射线',
    wavelengthRange: [1e-8, 1e-11],
    frequencyRange: [3e16, 3e19],
    color: '#0088ff',
    gradientStart: '#4400ff',
    gradientEnd: '#00aaff',
    sizeComparison: 'Atom',
    sizeComparisonZh: '原子',
    sizeIcon: '⚫',
    applications: ['Medical imaging', 'Security scanning', 'Crystallography'],
    applicationsZh: ['医学成像', '安检', '晶体学'],
    canPenetrate: false,
    penetrateInfo: 'Blocked by atmosphere',
    penetrateInfoZh: '被大气层阻挡',
  },
  {
    id: 'gamma',
    name: 'Gamma Rays',
    nameZh: '伽马射线',
    wavelengthRange: [1e-11, 1e-14],
    frequencyRange: [3e19, 3e22],
    color: '#00ffff',
    gradientStart: '#00aaff',
    gradientEnd: '#00ffff',
    sizeComparison: 'Atomic nucleus',
    sizeComparisonZh: '原子核',
    sizeIcon: '💫',
    applications: ['Cancer treatment', 'Nuclear physics', 'Astronomy'],
    applicationsZh: ['癌症治疗', '核物理', '天文观测'],
    canPenetrate: false,
    penetrateInfo: 'Blocked by atmosphere',
    penetrateInfoZh: '被大气层阻挡',
  },
]

// Format scientific notation
function formatScientific(num: number): string {
  if (num === 0) return '0'
  const exp = Math.floor(Math.log10(Math.abs(num)))
  const mantissa = num / Math.pow(10, exp)
  if (exp === 0) return num.toFixed(0)
  if (Math.abs(exp) <= 2) return num.toFixed(exp < 0 ? -exp : 0)
  return `${mantissa.toFixed(1)}×10^${exp}`
}

// Format wavelength with appropriate units
function formatWavelength(meters: number): string {
  if (meters >= 1) return `${meters.toFixed(0)} m`
  if (meters >= 1e-2) return `${(meters * 100).toFixed(0)} cm`
  if (meters >= 1e-3) return `${(meters * 1000).toFixed(0)} mm`
  if (meters >= 1e-6) return `${(meters * 1e6).toFixed(0)} μm`
  if (meters >= 1e-9) return `${(meters * 1e9).toFixed(0)} nm`
  if (meters >= 1e-12) return `${(meters * 1e12).toFixed(1)} pm`
  return `${(meters * 1e15).toFixed(1)} fm`
}

interface Props {
  difficultyLevel?: DifficultyLevel
}

export function ElectromagneticWaveDemo({ difficultyLevel = 'application' }: Props) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const config = useDifficultyConfig(difficultyLevel)

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('wave')

  // Wave view states
  const [wavelength, setWavelength] = useState(550)
  const [amplitude, setAmplitude] = useState(50)
  const [speed, setSpeed] = useState(0.5)
  const [showBField, setShowBField] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  // Spectrum view states
  const [selectedRegion, setSelectedRegion] = useState<string | null>('visible')
  const [showAtmosphere, setShowAtmosphere] = useState(true)
  const [showSizeComparison, setShowSizeComparison] = useState(true)

  // Convert wavelength to RGB color
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
  const animationDuration = speed > 0 ? 4 / speed : 1000

  // Wave path generation
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

  // Selected spectrum region info
  const selectedInfo = useMemo(() => {
    return SPECTRUM_REGIONS.find((r) => r.id === selectedRegion)
  }, [selectedRegion])

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg w-fit">
        <button
          onClick={() => setViewMode('wave')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'wave'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
              : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>{isZh ? '波动可视化' : 'Wave View'}</span>
        </button>
        <button
          onClick={() => setViewMode('spectrum')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'spectrum'
              ? 'bg-purple-500/20 text-purple-400 shadow-sm'
              : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isZh ? '电磁波谱' : 'Spectrum'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'wave' ? (
          <motion.div
            key="wave"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Wave View Content */}
            <div className="flex gap-6 flex-col lg:flex-row">
              <div className="flex-1">
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-xl border border-blue-500/20 p-4 overflow-hidden">
                  <svg
                    viewBox="0 0 700 300"
                    className="w-full h-auto"
                    style={{ minHeight: '280px' }}
                  >
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,150,255,0.08)" strokeWidth="1"/>
                      </pattern>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <rect width="700" height="300" fill="url(#grid)" />

                    {/* Axes */}
                    <line x1="50" y1="150" x2="670" y2="150" stroke="#4b5563" strokeWidth="1.5" />
                    <line x1="50" y1="50" x2="50" y2="250" stroke="#4b5563" strokeWidth="1.5" />
                    <polygon points="670,150 660,145 660,155" fill="#4b5563" />
                    <polygon points="50,50 45,60 55,60" fill="#4b5563" />
                    <text x="680" y="155" fill="#9ca3af" fontSize="14">x</text>
                    <text x="55" y="45" fill="#9ca3af" fontSize="14">E</text>
                    {showBField && (
                      <text x="55" y="265" fill="#60a5fa" fontSize="12">B</text>
                    )}

                    {/* E-field wave */}
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

                    {/* B-field wave */}
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

                    {/* Wavelength marker */}
                    <g transform="translate(150, 220)">
                      <line x1="0" y1="0" x2="0" y2="15" stroke="#6b7280" strokeWidth="1" />
                      <line x1={80 + (wavelength - 400) / 4} y1="0" x2={80 + (wavelength - 400) / 4} y2="15" stroke="#6b7280" strokeWidth="1" />
                      <line x1="0" y1="8" x2={80 + (wavelength - 400) / 4} y2="8" stroke="#6b7280" strokeWidth="1" />
                      <text x={(80 + (wavelength - 400) / 4) / 2} y="30" fill="#9ca3af" fontSize="11" textAnchor="middle">
                        λ = {wavelength} nm
                      </text>
                    </g>

                    <text x="600" y="30" fill="#6b7280" fontSize="11">c = 3×10⁸ m/s</text>
                    <rect x="600" y="40" width="60" height="20" rx="4" fill={waveColor} opacity="0.8" />
                  </svg>
                </div>

                {/* Visible Spectrum Bar */}
                <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">{t('demoUi.common.visibleSpectrum')}</h4>
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
                    <motion.div
                      className="absolute top-0 w-1 h-full bg-white/80 rounded"
                      style={{ left: `${((wavelength - 380) / 320) * 100}%` }}
                      layoutId="wavelength-indicator"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>380 nm ({t('demoUi.common.violet')})</span>
                    <span>550 nm ({t('demoUi.common.green')})</span>
                    <span>700 nm ({t('demoUi.common.red')})</span>
                  </div>
                </div>
              </div>

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

                <Toggle
                  label={t('demoUi.common.showBField')}
                  checked={showBField}
                  onChange={setShowBField}
                />

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

                <div className="pt-2 border-t border-slate-700">
                  <ValueDisplay label={t('demoUi.common.color')} value={waveColor} />
                  <ValueDisplay label={t('demoUi.common.frequency')} value={`${(3e8 / (wavelength * 1e-9) / 1e14).toFixed(2)} × 10¹⁴ Hz`} />
                </div>

                {/* Quick switch to spectrum */}
                <motion.button
                  className="w-full py-2 rounded-lg text-sm text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all mt-2"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setViewMode('spectrum')}
                >
                  {isZh ? '查看完整电磁波谱 →' : 'View Full EM Spectrum →'}
                </motion.button>
              </ControlPanel>
            </div>

            {/* Foundation: Why button */}
            <DifficultyGate level="foundation" currentLevel={difficultyLevel}>
              <WhyButton className="mt-4">
                <div className="space-y-2 text-sm">
                  <p>{isZh ? '光是一种电磁波，它由电场（E）和磁场（B）相互垂直振荡产生。' : 'Light is an electromagnetic wave consisting of perpendicular oscillating electric (E) and magnetic (B) fields.'}</p>
                  <p>{isZh ? '就像海浪在水面上波动，光波也在空间中传播，只是振动的是电场和磁场而不是水分子。' : 'Like ocean waves on water, light waves propagate through space, but instead of water molecules, electric and magnetic fields oscillate.'}</p>
                </div>
              </WhyButton>
            </DifficultyGate>

            {/* Application/Research: Formula */}
            <DifficultyGate level="application" currentLevel={difficultyLevel} showWhen="at-least">
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard title={isZh ? '电磁波特性' : 'EM Wave Properties'} color="cyan">
                  <ul className="text-xs text-gray-300 space-y-1.5">
                    <li>• {isZh ? 'E场和B场相互垂直' : 'E and B fields are perpendicular'}</li>
                    <li>• {isZh ? '横波：振动方向垂直于传播方向' : 'Transverse: oscillation ⊥ propagation'}</li>
                    <li>• {isZh ? '真空中速度恒定：c = 3×10⁸ m/s' : 'Constant speed in vacuum: c = 3×10⁸ m/s'}</li>
                  </ul>
                  {config.showFormula && (
                    <Formula className="mt-2">c = λf</Formula>
                  )}
                </InfoCard>
                <InfoCard title={isZh ? '与偏振的联系' : 'Connection to Polarization'} color="purple">
                  <ul className="text-xs text-gray-300 space-y-1.5">
                    <li>• {isZh ? '偏振描述电场振动方向' : 'Polarization describes E-field oscillation direction'}</li>
                    <li>• {isZh ? '自然光包含所有偏振方向' : 'Natural light contains all polarization directions'}</li>
                    <li>• {isZh ? '只有横波才能偏振' : 'Only transverse waves can be polarized'}</li>
                  </ul>
                </InfoCard>
              </div>
            </DifficultyGate>
          </motion.div>
        ) : (
          <motion.div
            key="spectrum"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Spectrum View Content */}
            <div className="flex gap-6 flex-col lg:flex-row">
              <div className="flex-1">
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-xl border border-indigo-500/20 p-4 overflow-hidden">
                  <svg viewBox="0 0 800 380" className="w-full h-auto" style={{ minHeight: '360px' }}>
                    <defs>
                      <pattern id="spectrum-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,150,255,0.05)" strokeWidth="1" />
                      </pattern>
                      <linearGradient id="visible-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff0000" />
                        <stop offset="17%" stopColor="#ff7700" />
                        <stop offset="33%" stopColor="#ffff00" />
                        <stop offset="50%" stopColor="#00ff00" />
                        <stop offset="67%" stopColor="#00ffff" />
                        <stop offset="83%" stopColor="#0077ff" />
                        <stop offset="100%" stopColor="#8b00ff" />
                      </linearGradient>
                      <filter id="spectrum-glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <rect width="800" height="380" fill="url(#spectrum-grid)" />

                    <text x="400" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="bold">
                      {isZh ? '电磁波谱' : 'Electromagnetic Spectrum'}
                    </text>

                    {/* Atmosphere penetration */}
                    {showAtmosphere && (
                      <g transform="translate(50, 40)">
                        <text x="0" y="0" fill="#9ca3af" fontSize="10">
                          {isZh ? '大气穿透性' : 'Atm. Penetration'}
                        </text>
                        <g transform="translate(0, 8)">
                          {SPECTRUM_REGIONS.map((region, index) => {
                            const x = index * 100
                            const width = 98
                            return (
                              <g key={`atm-${region.id}`}>
                                <rect
                                  x={x}
                                  y="0"
                                  width={width}
                                  height="15"
                                  fill={region.canPenetrate ? '#22c55e' : '#ef4444'}
                                  opacity="0.3"
                                  rx="2"
                                />
                                <text x={x + width / 2} y="11" textAnchor="middle" fill="#fff" fontSize="8">
                                  {region.canPenetrate ? (isZh ? '是' : 'Y') : (isZh ? '否' : 'N')}
                                </text>
                              </g>
                            )
                          })}
                        </g>
                      </g>
                    )}

                    {/* Spectrum bands */}
                    <g transform="translate(50, 80)">
                      {SPECTRUM_REGIONS.map((region, index) => {
                        const x = index * 100
                        const width = 98
                        const isSelected = selectedRegion === region.id
                        const isVisible = region.id === 'visible'

                        return (
                          <g key={region.id}>
                            <text
                              x={x + 50}
                              y="-8"
                              textAnchor="middle"
                              fill={isSelected ? region.color : '#9ca3af'}
                              fontSize="11"
                              fontWeight={isSelected ? 'bold' : 'normal'}
                            >
                              {isZh ? region.nameZh : region.name}
                            </text>
                            <motion.rect
                              x={x}
                              y="0"
                              width={width}
                              height="60"
                              fill={isVisible ? 'url(#visible-gradient)' : region.gradientStart}
                              rx="4"
                              opacity={isSelected ? 1 : 0.6}
                              stroke={isSelected ? '#fff' : 'transparent'}
                              strokeWidth={isSelected ? 2 : 0}
                              style={{ cursor: 'pointer' }}
                              whileHover={{ opacity: 1, scale: 1.02 }}
                              onClick={() => setSelectedRegion(region.id)}
                              filter={isSelected ? 'url(#spectrum-glow)' : undefined}
                            />
                          </g>
                        )
                      })}

                      {/* Wavelength scale */}
                      <g transform="translate(0, 70)">
                        <text x="0" y="0" fill="#6b7280" fontSize="9">
                          {isZh ? '波长' : 'λ (m)'}
                        </text>
                        {SPECTRUM_REGIONS.map((region, index) => {
                          const x = index * 100 + 50
                          return (
                            <text key={`wl-${region.id}`} x={x} y="15" textAnchor="middle" fill="#9ca3af" fontSize="9">
                              {formatScientific(region.wavelengthRange[0])}
                            </text>
                          )
                        })}
                      </g>
                    </g>

                    {/* Size comparison */}
                    {showSizeComparison && (
                      <g transform="translate(50, 200)">
                        <text x="0" y="0" fill="#9ca3af" fontSize="10">
                          {isZh ? '波长尺度' : 'Wavelength Scale'}
                        </text>
                        {SPECTRUM_REGIONS.map((region, index) => {
                          const x = index * 100 + 50
                          return (
                            <g key={`size-${region.id}`}>
                              <text x={x} y="30" textAnchor="middle" fontSize="24">
                                {region.sizeIcon}
                              </text>
                              <text x={x} y="55" textAnchor="middle" fill="#9ca3af" fontSize="9">
                                {isZh ? region.sizeComparisonZh : region.sizeComparison}
                              </text>
                            </g>
                          )
                        })}
                      </g>
                    )}

                    {/* Selected region info */}
                    <AnimatePresence>
                      {selectedInfo && (
                        <motion.g
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transform="translate(50, 270)"
                        >
                          <rect
                            x="0"
                            y="0"
                            width="700"
                            height="100"
                            fill="rgba(30,41,59,0.9)"
                            rx="8"
                            stroke={selectedInfo.color}
                            strokeWidth="1"
                            strokeOpacity="0.5"
                          />
                          <text x="20" y="22" fill={selectedInfo.color} fontSize="14" fontWeight="bold">
                            {isZh ? selectedInfo.nameZh : selectedInfo.name}
                          </text>
                          <text x="20" y="42" fill="#9ca3af" fontSize="10">
                            {isZh ? '波长：' : 'λ: '}
                            <tspan fill="#e2e8f0">
                              {formatWavelength(selectedInfo.wavelengthRange[0])} ~ {formatWavelength(selectedInfo.wavelengthRange[1])}
                            </tspan>
                          </text>
                          <text x="20" y="58" fill="#9ca3af" fontSize="10">
                            {isZh ? '频率：' : 'f: '}
                            <tspan fill="#e2e8f0">
                              {formatScientific(selectedInfo.frequencyRange[0])} ~ {formatScientific(selectedInfo.frequencyRange[1])} Hz
                            </tspan>
                          </text>
                          <text x="20" y="74" fill="#9ca3af" fontSize="10">
                            {isZh ? '应用：' : 'Uses: '}
                            <tspan fill="#e2e8f0">
                              {(isZh ? selectedInfo.applicationsZh : selectedInfo.applications).join(', ')}
                            </tspan>
                          </text>
                          <text x="20" y="90" fill="#9ca3af" fontSize="10">
                            {isZh ? '大气：' : 'Atm: '}
                            <tspan fill={selectedInfo.canPenetrate ? '#22c55e' : '#ef4444'}>
                              {isZh ? selectedInfo.penetrateInfoZh : selectedInfo.penetrateInfo}
                            </tspan>
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </svg>
                </div>
              </div>

              <ControlPanel title={isZh ? '显示选项' : 'Display Options'} className="w-full lg:w-72">
                <Toggle
                  label={isZh ? '显示大气穿透性' : 'Show Atmospheric Penetration'}
                  checked={showAtmosphere}
                  onChange={setShowAtmosphere}
                />
                <Toggle
                  label={isZh ? '显示尺寸比较' : 'Show Size Comparison'}
                  checked={showSizeComparison}
                  onChange={setShowSizeComparison}
                />

                <div className="border-t border-slate-700 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    {isZh ? '选择波段' : 'Select Region'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {SPECTRUM_REGIONS.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegion(region.id)}
                        className={`px-2 py-1.5 rounded text-xs transition-all ${
                          selectedRegion === region.id
                            ? 'bg-opacity-30 border'
                            : 'bg-slate-800/50 border border-transparent hover:border-slate-600'
                        }`}
                        style={{
                          backgroundColor: selectedRegion === region.id ? `${region.color}30` : undefined,
                          borderColor: selectedRegion === region.id ? region.color : undefined,
                          color: selectedRegion === region.id ? region.color : '#9ca3af',
                        }}
                      >
                        {isZh ? region.nameZh : region.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick switch to wave view */}
                <motion.button
                  className="w-full py-2 rounded-lg text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all mt-4"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setViewMode('wave')}
                >
                  {isZh ? '查看波动动画 →' : 'View Wave Animation →'}
                </motion.button>
              </ControlPanel>
            </div>

            {/* Foundation: Why button */}
            <DifficultyGate level="foundation" currentLevel={difficultyLevel}>
              <WhyButton className="mt-4">
                <div className="space-y-2 text-sm">
                  <p>{isZh ? '电磁波谱就像一把无限长的"光尺子"——我们看到的彩虹只是其中很小的一段！' : 'The EM spectrum is like an infinite ruler of light—the rainbow we see is just a tiny portion!'}</p>
                  <p>{isZh ? '从广播塔发出的无线电波到医院X光机发出的射线，都是电磁波家族的成员。' : 'From radio towers to hospital X-ray machines, they are all part of the electromagnetic wave family.'}</p>
                </div>
              </WhyButton>
            </DifficultyGate>

            {/* Knowledge cards for application/research */}
            <DifficultyGate level="application" currentLevel={difficultyLevel} showWhen="at-least">
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard title={isZh ? '光的本质' : 'Nature of Light'} color="cyan">
                  <ul className="text-xs text-gray-300 space-y-1.5">
                    <li>• {isZh ? '光是电磁波，不需要介质' : 'Light is EM wave, no medium needed'}</li>
                    <li>• {isZh ? '波长与频率成反比' : 'λ inversely proportional to f'}</li>
                    {config.showFormula && <li className="font-mono text-cyan-400">c = λf = 3×10⁸ m/s</li>}
                  </ul>
                </InfoCard>

                <InfoCard title={isZh ? '能量与波长' : 'Energy & Wavelength'} color="purple">
                  <ul className="text-xs text-gray-300 space-y-1.5">
                    <li>• {isZh ? '波长越短，能量越高' : 'Shorter λ = higher energy'}</li>
                    <li>• {isZh ? '伽马射线能量最高' : 'Gamma rays have highest energy'}</li>
                    {config.showFormula && <li className="font-mono text-purple-400">E = hf = hc/λ</li>}
                  </ul>
                </InfoCard>

                <InfoCard title={isZh ? '人眼视觉' : 'Human Vision'} color="green">
                  <ul className="text-xs text-gray-300 space-y-1.5">
                    <li>• {isZh ? '人眼仅见380-700nm' : 'Eyes see only 380-700nm'}</li>
                    <li>• {isZh ? '对绿光最敏感(~555nm)' : 'Most sensitive to green (~555nm)'}</li>
                    <li>• {isZh ? '可见光只占极小部分' : 'Visible is tiny fraction of spectrum'}</li>
                  </ul>
                </InfoCard>
              </div>
            </DifficultyGate>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ElectromagneticWaveDemo
