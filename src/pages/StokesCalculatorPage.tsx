/**
 * Stokes Calculator Page
 * 斯托克斯计算器 - 从强度测量计算斯托克斯参数
 *
 * Interactive tool for computing Stokes parameters from intensity measurements.
 * Supports both manual input and preset polarization states.
 */
import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay } from '@/components/demos/DemoControls'
import { ArrowLeft, RotateCcw, Info, Lightbulb, Calculator } from 'lucide-react'

// Stokes vector type
interface StokesVector {
  S0: number // Total intensity
  S1: number // Horizontal vs Vertical
  S2: number // +45° vs -45°
  S3: number // Right vs Left circular
}

// Intensity measurements for Stokes calculation
interface IntensityMeasurements {
  IH: number   // Intensity through horizontal polarizer (0°)
  IV: number   // Intensity through vertical polarizer (90°)
  ID: number   // Intensity through diagonal polarizer (+45°)
  IA: number   // Intensity through anti-diagonal polarizer (-45°)
  IR: number   // Intensity through right circular analyzer
  IL: number   // Intensity through left circular analyzer
}

// Calculate Stokes parameters from intensity measurements
function calculateStokes(m: IntensityMeasurements): StokesVector {
  return {
    S0: m.IH + m.IV,          // Total intensity
    S1: m.IH - m.IV,          // Horizontal - Vertical
    S2: m.ID - m.IA,          // Diagonal - Anti-diagonal
    S3: m.IR - m.IL,          // Right - Left circular
  }
}

// Get polarization properties from Stokes vector
function getPolarizationProperties(s: StokesVector) {
  const { S0, S1, S2, S3 } = s

  // Degree of polarization (DOP)
  const DOP = S0 > 0 ? Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / S0 : 0

  // Degree of linear polarization (DOLP)
  const DOLP = S0 > 0 ? Math.sqrt(S1 * S1 + S2 * S2) / S0 : 0

  // Degree of circular polarization (DOCP)
  const DOCP = S0 > 0 ? Math.abs(S3) / S0 : 0

  // Orientation angle (azimuth) - angle of linear polarization
  const psi = 0.5 * Math.atan2(S2, S1) * (180 / Math.PI)

  // Ellipticity angle
  const chi = 0.5 * Math.asin(Math.max(-1, Math.min(1, S3 / Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) || 0))) * (180 / Math.PI)

  // Polarization type classification
  let polarizationType: string
  let polarizationTypeZh: string

  if (DOP < 0.1) {
    polarizationType = 'Unpolarized'
    polarizationTypeZh = '非偏振'
  } else if (DOCP > 0.9) {
    polarizationType = S3 > 0 ? 'Right Circular' : 'Left Circular'
    polarizationTypeZh = S3 > 0 ? '右旋圆偏振' : '左旋圆偏振'
  } else if (DOLP > 0.9 && DOCP < 0.1) {
    polarizationType = 'Linear'
    polarizationTypeZh = '线偏振'
  } else if (DOP > 0.9) {
    polarizationType = 'Elliptical'
    polarizationTypeZh = '椭圆偏振'
  } else {
    polarizationType = 'Partially Polarized'
    polarizationTypeZh = '部分偏振'
  }

  return {
    DOP,
    DOLP,
    DOCP,
    azimuth: psi,
    ellipticity: chi,
    polarizationType,
    polarizationTypeZh,
    isRightHanded: S3 > 0,
  }
}

// Preset polarization states with their expected measurements
const PRESET_STATES: {
  id: string
  nameEn: string
  nameZh: string
  measurements: IntensityMeasurements
  color: string
}[] = [
  {
    id: 'unpolarized',
    nameEn: 'Unpolarized',
    nameZh: '非偏振光',
    measurements: { IH: 50, IV: 50, ID: 50, IA: 50, IR: 50, IL: 50 },
    color: '#94a3b8',
  },
  {
    id: 'horizontal',
    nameEn: 'Horizontal (H)',
    nameZh: '水平线偏振 (H)',
    measurements: { IH: 100, IV: 0, ID: 50, IA: 50, IR: 50, IL: 50 },
    color: '#ef4444',
  },
  {
    id: 'vertical',
    nameEn: 'Vertical (V)',
    nameZh: '垂直线偏振 (V)',
    measurements: { IH: 0, IV: 100, ID: 50, IA: 50, IR: 50, IL: 50 },
    color: '#22c55e',
  },
  {
    id: 'diagonal',
    nameEn: 'Diagonal +45° (D)',
    nameZh: '+45°线偏振 (D)',
    measurements: { IH: 50, IV: 50, ID: 100, IA: 0, IR: 50, IL: 50 },
    color: '#f59e0b',
  },
  {
    id: 'antidiagonal',
    nameEn: 'Anti-diagonal -45° (A)',
    nameZh: '-45°线偏振 (A)',
    measurements: { IH: 50, IV: 50, ID: 0, IA: 100, IR: 50, IL: 50 },
    color: '#eab308',
  },
  {
    id: 'right_circular',
    nameEn: 'Right Circular (R)',
    nameZh: '右旋圆偏振 (R)',
    measurements: { IH: 50, IV: 50, ID: 50, IA: 50, IR: 100, IL: 0 },
    color: '#3b82f6',
  },
  {
    id: 'left_circular',
    nameEn: 'Left Circular (L)',
    nameZh: '左旋圆偏振 (L)',
    measurements: { IH: 50, IV: 50, ID: 50, IA: 50, IR: 0, IL: 100 },
    color: '#ec4899',
  },
  {
    id: 'partial_h',
    nameEn: 'Partial Horizontal',
    nameZh: '部分水平偏振',
    measurements: { IH: 75, IV: 25, ID: 50, IA: 50, IR: 50, IL: 50 },
    color: '#f87171',
  },
]

// Stokes vector visualization (bar chart style)
function StokesVectorDisplay({
  stokes,
  theme,
}: {
  stokes: StokesVector
  theme: string
}) {
  const isDark = theme === 'dark'
  const maxVal = Math.max(Math.abs(stokes.S0), Math.abs(stokes.S1), Math.abs(stokes.S2), Math.abs(stokes.S3), 1)

  const parameters = [
    { name: 'S\u2080', value: stokes.S0, color: '#94a3b8', description: 'Total Intensity' },
    { name: 'S\u2081', value: stokes.S1, color: '#ef4444', description: 'H - V' },
    { name: 'S\u2082', value: stokes.S2, color: '#f59e0b', description: 'D - A' },
    { name: 'S\u2083', value: stokes.S3, color: '#3b82f6', description: 'R - L' },
  ]

  return (
    <div className={cn(
      'rounded-xl border p-4',
      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <h3 className={cn(
        'text-sm font-semibold mb-4',
        isDark ? 'text-white' : 'text-gray-900'
      )}>
        Stokes Vector
      </h3>

      <div className="space-y-3">
        {parameters.map((param) => {
          const percentage = (param.value / maxVal) * 100
          const isNegative = param.value < 0

          return (
            <div key={param.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'font-mono text-sm font-bold',
                    isDark ? 'text-white' : 'text-gray-900'
                  )} style={{ color: param.color }}>
                    {param.name}
                  </span>
                  <span className={cn(
                    'text-xs',
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {param.description}
                  </span>
                </div>
                <span className={cn(
                  'font-mono text-sm',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {param.value.toFixed(1)}
                </span>
              </div>

              <div className={cn(
                'h-4 rounded-full overflow-hidden relative',
                isDark ? 'bg-slate-700' : 'bg-gray-200'
              )}>
                {/* Center line for S1, S2, S3 */}
                {param.name !== 'S\u2080' && (
                  <div
                    className={cn(
                      'absolute top-0 bottom-0 w-0.5',
                      isDark ? 'bg-slate-500' : 'bg-gray-400'
                    )}
                    style={{ left: '50%' }}
                  />
                )}

                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: param.color,
                    width: param.name === 'S\u2080'
                      ? `${Math.abs(percentage)}%`
                      : `${Math.abs(percentage) / 2}%`,
                    marginLeft: param.name === 'S\u2080'
                      ? '0'
                      : isNegative
                        ? `${50 - Math.abs(percentage) / 2}%`
                        : '50%',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Normalized vector display */}
      <div className={cn(
        'mt-4 pt-4 border-t',
        isDark ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className={cn(
          'text-xs mb-2',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>
          Normalized: S = [S\u2080, S\u2081, S\u2082, S\u2083]
        </div>
        <div className={cn(
          'font-mono text-sm p-2 rounded-lg',
          isDark ? 'bg-slate-900 text-cyan-400' : 'bg-gray-100 text-cyan-700'
        )}>
          [{stokes.S0.toFixed(2)}, {stokes.S1.toFixed(2)}, {stokes.S2.toFixed(2)}, {stokes.S3.toFixed(2)}]
        </div>
      </div>
    </div>
  )
}

// Polarization ellipse visualization
function PolarizationEllipse({
  azimuth,
  ellipticity,
  dop,
  theme,
}: {
  azimuth: number
  ellipticity: number
  dop: number
  theme: string
}) {
  const isDark = theme === 'dark'
  const bgColor = isDark ? '#0f172a' : '#f1f5f9'
  const axisColor = isDark ? '#374151' : '#cbd5e1'

  const width = 200
  const height = 200
  const cx = width / 2
  const cy = height / 2
  const maxR = 70

  // Generate ellipse path
  const a = maxR * dop
  const b = Math.abs(Math.tan((ellipticity * Math.PI) / 180)) * a || 2
  const angle = (azimuth * Math.PI) / 180

  let path = ''
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * 2 * Math.PI
    const ex = a * Math.cos(t)
    const ey = b * Math.sin(t)
    const x = cx + ex * Math.cos(angle) - ey * Math.sin(angle)
    const y = cy - (ex * Math.sin(angle) + ey * Math.cos(angle))
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  path += ' Z'

  // Determine color based on ellipticity
  const ellipseColor = Math.abs(ellipticity) > 30
    ? (ellipticity > 0 ? '#22d3ee' : '#f472b6')
    : '#fbbf24'

  return (
    <div className="text-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[200px] mx-auto">
        <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={12} />

        {/* Reference circles */}
        <circle cx={cx} cy={cy} r={maxR} fill="none" stroke={axisColor} strokeWidth={1} strokeDasharray="4,4" />
        <circle cx={cx} cy={cy} r={maxR * 0.5} fill="none" stroke={axisColor} strokeWidth={1} strokeDasharray="2,2" />

        {/* Axes */}
        <line x1={15} y1={cy} x2={width - 15} y2={cy} stroke={axisColor} strokeWidth={1} />
        <line x1={cx} y1={15} x2={cx} y2={height - 15} stroke={axisColor} strokeWidth={1} />

        {/* Labels */}
        <text x={width - 20} y={cy - 8} fill={isDark ? '#9ca3af' : '#6b7280'} fontSize="10">H</text>
        <text x={cx + 8} y={25} fill={isDark ? '#9ca3af' : '#6b7280'} fontSize="10">V</text>

        {/* Polarization ellipse */}
        {dop > 0.01 && (
          <>
            <path d={path} fill={`${ellipseColor}30`} stroke={ellipseColor} strokeWidth={2} />

            {/* Direction indicator (azimuth line) */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + a * Math.cos(angle)}
              y2={cy - a * Math.sin(angle)}
              stroke={ellipseColor}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill={isDark ? '#64748b' : '#94a3b8'} />
      </svg>
    </div>
  )
}

// Main Page Component
export function StokesCalculatorPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // State for intensity measurements
  const [measurements, setMeasurements] = useState<IntensityMeasurements>({
    IH: 100, IV: 0, ID: 50, IA: 50, IR: 50, IL: 50
  })
  const [showInfo, setShowInfo] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('horizontal')

  // Calculate Stokes parameters
  const stokes = useMemo(() => calculateStokes(measurements), [measurements])

  // Get polarization properties
  const properties = useMemo(() => getPolarizationProperties(stokes), [stokes])

  // Update measurement
  const updateMeasurement = (key: keyof IntensityMeasurements, value: number) => {
    setMeasurements(prev => ({ ...prev, [key]: value }))
    setSelectedPreset('') // Clear preset selection on manual change
  }

  // Apply preset
  const applyPreset = (presetId: string) => {
    const preset = PRESET_STATES.find(p => p.id === presetId)
    if (preset) {
      setMeasurements(preset.measurements)
      setSelectedPreset(presetId)
    }
  }

  // Reset to default
  const handleReset = () => {
    applyPreset('horizontal')
  }

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fefce8] via-[#fef9c3] to-[#fefce8]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-700'
          : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <Link
                to="/research"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{isZh ? '返回实验室' : 'Back to Lab'}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl"><Calculator className="w-5 h-5 inline" /></span>
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                {isZh ? '斯托克斯计算器' : 'Stokes Calculator'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark'
                    ? 'hover:bg-slate-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                )}
                title={isZh ? '重置' : 'Reset'}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark'
                    ? 'hover:bg-slate-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                )}
                title={isZh ? '帮助信息' : 'Help'}
              >
                <Info className="w-5 h-5" />
              </button>
              <LanguageThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Results Overview */}
        <div className={cn(
          'rounded-2xl border p-6 mb-6',
          theme === 'dark'
            ? 'bg-slate-900/50 border-cyan-400/20'
            : 'bg-white border-cyan-200 shadow-lg'
        )}>
          <h2 className={cn(
            'text-lg font-semibold mb-6 text-center',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '偏振态分析' : 'Polarization Analysis'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stokes Vector Display */}
            <div className="lg:col-span-2">
              <StokesVectorDisplay stokes={stokes} theme={theme} />
            </div>

            {/* Polarization Ellipse */}
            <div className={cn(
              'rounded-xl border p-4',
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
            )}>
              <h3 className={cn(
                'text-sm font-semibold mb-4 text-center',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振椭圆' : 'Polarization Ellipse'}
              </h3>
              <PolarizationEllipse
                azimuth={properties.azimuth}
                ellipticity={properties.ellipticity}
                dop={properties.DOP}
                theme={theme}
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className={cn(
            'mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <ValueDisplay
              label={isZh ? '偏振类型' : 'Type'}
              value={isZh ? properties.polarizationTypeZh : properties.polarizationType}
              color="purple"
            />
            <ValueDisplay
              label="DOP"
              value={`${(properties.DOP * 100).toFixed(1)}%`}
              color="cyan"
            />
            <ValueDisplay
              label="DOLP"
              value={`${(properties.DOLP * 100).toFixed(1)}%`}
              color="orange"
            />
            <ValueDisplay
              label="DOCP"
              value={`${(properties.DOCP * 100).toFixed(1)}%`}
              color="blue"
            />
            <ValueDisplay
              label={isZh ? '方位角 \u03C8' : 'Azimuth \u03C8'}
              value={`${properties.azimuth.toFixed(1)}°`}
              color="green"
            />
            <ValueDisplay
              label={isZh ? '椭圆度角 \u03C7' : 'Ellipticity \u03C7'}
              value={`${properties.ellipticity.toFixed(1)}°`}
              color="pink"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preset States */}
          <div>
            <ControlPanel title={isZh ? '预设偏振态' : 'Preset States'}>
              <div className="space-y-2">
                {PRESET_STATES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={cn(
                      'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left',
                      selectedPreset === preset.id
                        ? theme === 'dark'
                          ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/50'
                          : 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 hover:bg-slate-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="truncate">{isZh ? preset.nameZh : preset.nameEn}</span>
                  </button>
                ))}
              </div>
            </ControlPanel>
          </div>

          {/* Intensity Measurements */}
          <div className="lg:col-span-2">
            <div className={cn(
              'rounded-xl border p-4',
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-gray-200'
            )}>
              <h3 className={cn(
                'font-semibold mb-4',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '强度测量值' : 'Intensity Measurements'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={cn(
                  'p-3 rounded-lg',
                  theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                )}>
                  <div className={cn(
                    'text-xs font-medium mb-3',
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  )}>
                    {isZh ? '线偏振 (H/V)' : 'Linear (H/V)'}
                  </div>
                  <SliderControl
                    label={isZh ? 'I\u2095 (水平 0°)' : 'I\u2095 (Horizontal 0°)'}
                    value={measurements.IH}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => updateMeasurement('IH', v)}
                    color="red"
                  />
                  <SliderControl
                    label={isZh ? 'I\u1d65 (垂直 90°)' : 'I\u1d65 (Vertical 90°)'}
                    value={measurements.IV}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => updateMeasurement('IV', v)}
                    color="green"
                  />
                </div>

                <div className={cn(
                  'p-3 rounded-lg',
                  theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                )}>
                  <div className={cn(
                    'text-xs font-medium mb-3',
                    theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                  )}>
                    {isZh ? '线偏振 (D/A)' : 'Linear (D/A)'}
                  </div>
                  <SliderControl
                    label={isZh ? 'I\u1d30 (对角 +45°)' : 'I\u1d30 (Diagonal +45°)'}
                    value={measurements.ID}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => updateMeasurement('ID', v)}
                    color="orange"
                  />
                  <SliderControl
                    label={isZh ? 'I\u1d2c (反对角 -45°)' : 'I\u1d2c (Anti-diagonal -45°)'}
                    value={measurements.IA}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(v) => updateMeasurement('IA', v)}
                    color="orange"
                  />
                </div>

                <div className={cn(
                  'p-3 rounded-lg sm:col-span-2',
                  theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                )}>
                  <div className={cn(
                    'text-xs font-medium mb-3',
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  )}>
                    {isZh ? '圆偏振 (R/L)' : 'Circular (R/L)'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SliderControl
                      label={isZh ? 'I\u1d3f (右旋)' : 'I\u1d3f (Right Circular)'}
                      value={measurements.IR}
                      min={0}
                      max={100}
                      step={1}
                      onChange={(v) => updateMeasurement('IR', v)}
                      color="blue"
                    />
                    <SliderControl
                      label={isZh ? 'I\u1d38 (左旋)' : 'I\u1d38 (Left Circular)'}
                      value={measurements.IL}
                      min={0}
                      max={100}
                      step={1}
                      onChange={(v) => updateMeasurement('IL', v)}
                      color="purple"
                    />
                  </div>
                </div>
              </div>

              {/* Measurement tip */}
              <div className={cn(
                'mt-4 p-3 rounded-lg flex items-start gap-2',
                theme === 'dark' ? 'bg-cyan-900/20' : 'bg-cyan-50'
              )}>
                <Lightbulb className={cn(
                  'w-4 h-4 mt-0.5 flex-shrink-0',
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )} />
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                )}>
                  {isZh
                    ? '提示：在实际测量中，使用偏振片和四分之一波片测量这6个强度值。对于理想偏振光，I\u2095+I\u1d65=I\u1d30+I\u1d2c=I\u1d3f+I\u1d38。'
                    : 'Tip: In practice, measure these 6 intensities using polarizers and quarter-wave plates. For ideal polarized light, I\u2095+I\u1d65=I\u1d30+I\u1d2c=I\u1d3f+I\u1d38.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title={isZh ? '斯托克斯参数' : 'Stokes Parameters'} color="cyan">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• <strong className="text-gray-400">S\u2080</strong>: {isZh ? '总强度 (I\u2095 + I\u1d65)' : 'Total intensity (I\u2095 + I\u1d65)'}</li>
                <li>• <strong className="text-red-400">S\u2081</strong>: {isZh ? '水平/垂直分量 (I\u2095 - I\u1d65)' : 'H/V component (I\u2095 - I\u1d65)'}</li>
                <li>• <strong className="text-orange-400">S\u2082</strong>: {isZh ? '±45°分量 (I\u1d30 - I\u1d2c)' : '±45° component (I\u1d30 - I\u1d2c)'}</li>
                <li>• <strong className="text-blue-400">S\u2083</strong>: {isZh ? '圆偏振分量 (I\u1d3f - I\u1d38)' : 'Circular component (I\u1d3f - I\u1d38)'}</li>
                <li>• {isZh
                  ? '斯托克斯向量可以描述任意偏振态，包括部分偏振光'
                  : 'Stokes vectors can describe any polarization state, including partial polarization'}</li>
              </ul>
            </InfoCard>

            <InfoCard title={isZh ? '偏振度指标' : 'Polarization Metrics'} color="purple">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• <strong className="text-cyan-400">DOP</strong>: {isZh
                  ? '偏振度 = \u221A(S\u2081\u00B2+S\u2082\u00B2+S\u2083\u00B2)/S\u2080'
                  : 'Degree of Polarization = \u221A(S\u2081\u00B2+S\u2082\u00B2+S\u2083\u00B2)/S\u2080'}</li>
                <li>• <strong className="text-orange-400">DOLP</strong>: {isZh
                  ? '线偏振度 = \u221A(S\u2081\u00B2+S\u2082\u00B2)/S\u2080'
                  : 'Degree of Linear Polarization'}</li>
                <li>• <strong className="text-blue-400">DOCP</strong>: {isZh
                  ? '圆偏振度 = |S\u2083|/S\u2080'
                  : 'Degree of Circular Polarization'}</li>
                <li>• {isZh
                  ? '方位角 \u03C8：线偏振方向与水平方向的夹角'
                  : 'Azimuth \u03C8: angle of linear polarization from horizontal'}</li>
                <li>• {isZh
                  ? '椭圆度角 \u03C7：描述椭圆偏振的椭圆率'
                  : 'Ellipticity \u03C7: describes how elliptical the polarization is'}</li>
              </ul>
            </InfoCard>
          </div>
        )}
      </main>
    </div>
  )
}

export default StokesCalculatorPage
