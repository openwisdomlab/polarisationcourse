/**
 * ElectromagneticSpectrumDemo - 电磁波谱交互演示
 * 展示完整的电磁波谱，从无线电波到伽马射线
 * 参考图片设计，包含波长、频率尺度和实物比较
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ControlPanel, Toggle, InfoCard } from '../DemoControls'

// 电磁波谱区域定义
interface SpectrumRegion {
  id: string
  name: string
  nameZh: string
  wavelengthRange: [number, number] // 单位：米
  frequencyRange: [number, number] // 单位：Hz
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
    wavelengthRange: [1e3, 1e-1], // 1km to 10cm
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
    wavelengthRange: [1e-1, 1e-3], // 10cm to 1mm
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
    wavelengthRange: [1e-3, 7e-7], // 1mm to 700nm
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
    wavelengthRange: [7e-7, 4e-7], // 700nm to 400nm
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
    wavelengthRange: [4e-7, 1e-8], // 400nm to 10nm
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
    wavelengthRange: [1e-8, 1e-11], // 10nm to 0.01nm
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
    wavelengthRange: [1e-11, 1e-14], // 0.01nm to 10fm
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

// 可见光颜色谱
const VISIBLE_COLORS = [
  { wavelength: 700, name: 'Red', nameZh: '红', color: '#ff0000' },
  { wavelength: 620, name: 'Orange', nameZh: '橙', color: '#ff7700' },
  { wavelength: 580, name: 'Yellow', nameZh: '黄', color: '#ffff00' },
  { wavelength: 530, name: 'Green', nameZh: '绿', color: '#00ff00' },
  { wavelength: 470, name: 'Blue', nameZh: '蓝', color: '#0077ff' },
  { wavelength: 420, name: 'Violet', nameZh: '紫', color: '#8b00ff' },
]

// 格式化数字为科学计数法
function formatScientific(num: number): string {
  if (num === 0) return '0'
  const exp = Math.floor(Math.log10(Math.abs(num)))
  const mantissa = num / Math.pow(10, exp)
  if (exp === 0) return num.toFixed(0)
  if (Math.abs(exp) <= 2) return num.toFixed(exp < 0 ? -exp : 0)
  return `${mantissa.toFixed(1)}×10^${exp}`
}

// 格式化波长（自动选择单位）
function formatWavelength(meters: number): string {
  if (meters >= 1) return `${meters.toFixed(0)} m`
  if (meters >= 1e-2) return `${(meters * 100).toFixed(0)} cm`
  if (meters >= 1e-3) return `${(meters * 1000).toFixed(0)} mm`
  if (meters >= 1e-6) return `${(meters * 1e6).toFixed(0)} μm`
  if (meters >= 1e-9) return `${(meters * 1e9).toFixed(0)} nm`
  if (meters >= 1e-12) return `${(meters * 1e12).toFixed(1)} pm`
  return `${(meters * 1e15).toFixed(1)} fm`
}

export function ElectromagneticSpectrumDemo() {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [selectedRegion, setSelectedRegion] = useState<string | null>('visible')
  const [showAtmosphere, setShowAtmosphere] = useState(true)
  const [showSizeComparison, setShowSizeComparison] = useState(true)
  const [showVisibleExpanded, setShowVisibleExpanded] = useState(false)
  const [highlightedWavelength, setHighlightedWavelength] = useState<number | null>(null)

  // 获取选中的区域信息
  const selectedInfo = useMemo(() => {
    return SPECTRUM_REGIONS.find((r) => r.id === selectedRegion)
  }, [selectedRegion])

  return (
    <div className="space-y-6">
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* 主可视化区域 */}
        <div className="flex-1">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-xl border border-indigo-500/20 p-4 overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-auto" style={{ minHeight: '360px' }}>
              <defs>
                {/* 背景网格 */}
                <pattern id="spectrum-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,150,255,0.05)" strokeWidth="1" />
                </pattern>

                {/* 可见光彩虹渐变 */}
                <linearGradient id="visible-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff0000" />
                  <stop offset="17%" stopColor="#ff7700" />
                  <stop offset="33%" stopColor="#ffff00" />
                  <stop offset="50%" stopColor="#00ff00" />
                  <stop offset="67%" stopColor="#00ffff" />
                  <stop offset="83%" stopColor="#0077ff" />
                  <stop offset="100%" stopColor="#8b00ff" />
                </linearGradient>

                {/* 发光效果 */}
                <filter id="spectrum-glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* 波浪线动画 */}
                {SPECTRUM_REGIONS.map((region) => {
                  const frequency = Math.log10(region.frequencyRange[0])
                  const waveLength = Math.max(5, Math.min(60, 80 - frequency * 4))
                  return (
                    <pattern
                      key={`wave-${region.id}`}
                      id={`wave-pattern-${region.id}`}
                      width={waveLength}
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d={`M 0 10 Q ${waveLength / 4} 0, ${waveLength / 2} 10 T ${waveLength} 10`}
                        fill="none"
                        stroke={region.color}
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    </pattern>
                  )
                })}
              </defs>

              <rect width="800" height="400" fill="url(#spectrum-grid)" />

              {/* 标题 */}
              <text x="400" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="bold">
                {isZh ? '电磁波谱 (Electromagnetic Spectrum)' : 'Electromagnetic Spectrum'}
              </text>

              {/* 大气穿透性指示器 */}
              {showAtmosphere && (
                <g transform="translate(50, 45)">
                  <text x="0" y="0" fill="#9ca3af" fontSize="10">
                    {isZh ? '能否穿透地球大气层' : 'Atmospheric Penetration'}
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

              {/* 电磁波谱条带 */}
              <g transform="translate(50, 85)">
                {/* 波谱名称标签 */}
                <g>
                  {SPECTRUM_REGIONS.map((region, index) => {
                    const x = index * 100
                    const isSelected = selectedRegion === region.id
                    return (
                      <g key={`label-${region.id}`}>
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
                      </g>
                    )
                  })}
                </g>

                {/* 主波谱条 */}
                <g>
                  {SPECTRUM_REGIONS.map((region, index) => {
                    const x = index * 100
                    const width = 98
                    const isSelected = selectedRegion === region.id
                    const isVisible = region.id === 'visible'

                    return (
                      <motion.g
                        key={region.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* 波谱区域背景 */}
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

                        {/* 波浪线装饰 */}
                        <rect
                          x={x + 5}
                          y="20"
                          width={width - 10}
                          height="20"
                          fill={`url(#wave-pattern-${region.id})`}
                          opacity="0.5"
                          style={{ pointerEvents: 'none' }}
                        />
                      </motion.g>
                    )
                  })}
                </g>

                {/* 波长刻度 */}
                <g transform="translate(0, 70)">
                  <text x="0" y="0" fill="#6b7280" fontSize="9">
                    {isZh ? '波长 (m)' : 'Wavelength (m)'}
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

                {/* 频率刻度 */}
                <g transform="translate(0, 100)">
                  <text x="0" y="0" fill="#6b7280" fontSize="9">
                    {isZh ? '频率 (Hz)' : 'Frequency (Hz)'}
                  </text>
                  {SPECTRUM_REGIONS.map((region, index) => {
                    const x = index * 100 + 50
                    return (
                      <text key={`freq-${region.id}`} x={x} y="15" textAnchor="middle" fill="#9ca3af" fontSize="9">
                        {formatScientific(region.frequencyRange[0])}
                      </text>
                    )
                  })}
                </g>
              </g>

              {/* 尺寸比较 */}
              {showSizeComparison && (
                <g transform="translate(50, 210)">
                  <text x="0" y="0" fill="#9ca3af" fontSize="10">
                    {isZh ? '波长尺度比较' : 'Wavelength Size Comparison'}
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

              {/* 可见光展开视图 */}
              {showVisibleExpanded && (
                <g transform="translate(50, 280)">
                  <text x="350" y="0" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                    {isZh ? '可见光谱展开 (380nm - 700nm)' : 'Visible Spectrum Expanded (380nm - 700nm)'}
                  </text>

                  {/* 彩虹渐变条 */}
                  <rect x="0" y="15" width="700" height="40" fill="url(#visible-gradient)" rx="4" />

                  {/* 颜色标签 */}
                  {VISIBLE_COLORS.map((c) => {
                    const x = ((700 - c.wavelength) / 320) * 700
                    return (
                      <g
                        key={c.wavelength}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHighlightedWavelength(c.wavelength)}
                        onMouseLeave={() => setHighlightedWavelength(null)}
                      >
                        <line
                          x1={x}
                          y1="55"
                          x2={x}
                          y2="70"
                          stroke={c.color}
                          strokeWidth={highlightedWavelength === c.wavelength ? 3 : 1}
                        />
                        <text x={x} y="82" textAnchor="middle" fill="#9ca3af" fontSize="9">
                          {c.wavelength}nm
                        </text>
                        <text x={x} y="95" textAnchor="middle" fill={c.color} fontSize="10" fontWeight="bold">
                          {isZh ? c.nameZh : c.name}
                        </text>
                      </g>
                    )
                  })}
                </g>
              )}

              {/* 信息面板 */}
              <AnimatePresence>
                {selectedInfo && (
                  <motion.g
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transform="translate(50, 280)"
                  >
                    {!showVisibleExpanded && (
                      <>
                        <rect
                          x="0"
                          y="0"
                          width="700"
                          height="110"
                          fill="rgba(30,41,59,0.9)"
                          rx="8"
                          stroke={selectedInfo.color}
                          strokeWidth="1"
                          strokeOpacity="0.5"
                        />

                        <text x="20" y="25" fill={selectedInfo.color} fontSize="14" fontWeight="bold">
                          {isZh ? selectedInfo.nameZh : selectedInfo.name}
                        </text>

                        <text x="20" y="45" fill="#9ca3af" fontSize="10">
                          {isZh ? '波长范围：' : 'Wavelength: '}
                          <tspan fill="#e2e8f0">
                            {formatWavelength(selectedInfo.wavelengthRange[0])} ~{' '}
                            {formatWavelength(selectedInfo.wavelengthRange[1])}
                          </tspan>
                        </text>

                        <text x="20" y="62" fill="#9ca3af" fontSize="10">
                          {isZh ? '频率范围：' : 'Frequency: '}
                          <tspan fill="#e2e8f0">
                            {formatScientific(selectedInfo.frequencyRange[0])} ~{' '}
                            {formatScientific(selectedInfo.frequencyRange[1])} Hz
                          </tspan>
                        </text>

                        <text x="20" y="80" fill="#9ca3af" fontSize="10">
                          {isZh ? '应用：' : 'Applications: '}
                          <tspan fill="#e2e8f0">
                            {(isZh ? selectedInfo.applicationsZh : selectedInfo.applications).join(', ')}
                          </tspan>
                        </text>

                        <text x="20" y="98" fill="#9ca3af" fontSize="10">
                          {isZh ? '大气穿透：' : 'Atmosphere: '}
                          <tspan fill={selectedInfo.canPenetrate ? '#22c55e' : '#ef4444'}>
                            {isZh ? selectedInfo.penetrateInfoZh : selectedInfo.penetrateInfo}
                          </tspan>
                        </text>
                      </>
                    )}
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </div>
        </div>

        {/* 控制面板 */}
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
          <Toggle
            label={isZh ? '展开可见光谱' : 'Expand Visible Spectrum'}
            checked={showVisibleExpanded}
            onChange={setShowVisibleExpanded}
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
        </ControlPanel>
      </div>

      {/* 知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title={isZh ? '光的本质' : 'Nature of Light'} color="cyan">
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li>
              • {isZh ? '光是电磁波，不需要介质传播' : 'Light is EM wave, no medium needed'}
            </li>
            <li>
              • {isZh ? '波长与频率成反比：c = λf' : 'Wavelength inversely proportional to frequency: c = λf'}
            </li>
            <li>
              • {isZh ? '所有电磁波在真空中速度相同：c = 3×10⁸ m/s' : 'All EM waves travel at c = 3×10⁸ m/s in vacuum'}
            </li>
          </ul>
        </InfoCard>

        <InfoCard title={isZh ? '能量与波长' : 'Energy & Wavelength'} color="purple">
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li>
              • {isZh ? '光子能量：E = hf = hc/λ' : 'Photon energy: E = hf = hc/λ'}
            </li>
            <li>
              • {isZh ? '波长越短，能量越高' : 'Shorter wavelength = higher energy'}
            </li>
            <li>
              • {isZh ? '伽马射线能量最高，可穿透物质' : 'Gamma rays highest energy, penetrating'}
            </li>
          </ul>
        </InfoCard>

        <InfoCard title={isZh ? '人眼视觉' : 'Human Vision'} color="green">
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li>
              • {isZh ? '人眼仅能看见380-700nm范围' : 'Human eyes see only 380-700nm'}
            </li>
            <li>
              • {isZh ? '对绿光最敏感（~555nm）' : 'Most sensitive to green (~555nm)'}
            </li>
            <li>
              • {isZh ? '可见光只是电磁波谱很小一部分' : 'Visible light is tiny fraction of EM spectrum'}
            </li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
