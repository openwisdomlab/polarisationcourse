/**
 * Mueller Matrix Calculator Page
 * 穆勒矩阵计算器 - 计算偏振光通过光学元件的变换（支持部分偏振光）
 *
 * Interactive tool for computing Stokes vector transformations
 * through various optical elements using Mueller calculus.
 * Unlike Jones calculus, Mueller matrices can handle partially polarized light.
 */
import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay } from '@/components/demos/DemoControls'
import { ArrowLeft, RotateCcw, Info, ArrowRight, Plus, X, ChevronDown } from 'lucide-react'

// Stokes vector type [S0, S1, S2, S3]
type StokesVector = [number, number, number, number]

// Mueller matrix type (4x4 real matrix stored as 16-element array, row-major)
interface MuellerMatrix {
  m: number[]  // 16 elements
  nameEn: string
  nameZh: string
  color: string
}

// Mueller matrix operations
const mueller = {
  // Identity matrix
  identity: (): number[] => [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ],

  // Apply Mueller matrix to Stokes vector
  apply: (matrix: number[], stokes: StokesVector): StokesVector => {
    const result: StokesVector = [0, 0, 0, 0]
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[i * 4 + j] * stokes[j]
      }
    }
    return result
  },

  // Multiply two Mueller matrices (M1 * M2)
  multiply: (m1: number[], m2: number[]): number[] => {
    const result = new Array(16).fill(0)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          result[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j]
        }
      }
    }
    return result
  },

  // Linear polarizer at angle θ (in radians)
  polarizer: (theta: number): number[] => {
    const c2 = Math.cos(2 * theta)
    const s2 = Math.sin(2 * theta)
    return [
      0.5, 0.5 * c2, 0.5 * s2, 0,
      0.5 * c2, 0.5 * c2 * c2, 0.5 * c2 * s2, 0,
      0.5 * s2, 0.5 * c2 * s2, 0.5 * s2 * s2, 0,
      0, 0, 0, 0,
    ]
  },

  // Quarter-wave plate (retarder with δ=π/2) at angle θ
  quarterWave: (theta: number): number[] => {
    const c2 = Math.cos(2 * theta)
    const s2 = Math.sin(2 * theta)
    return [
      1, 0, 0, 0,
      0, c2 * c2, c2 * s2, -s2,
      0, c2 * s2, s2 * s2, c2,
      0, s2, -c2, 0,
    ]
  },

  // Half-wave plate (retarder with δ=π) at angle θ
  halfWave: (theta: number): number[] => {
    const c4 = Math.cos(4 * theta)
    const s4 = Math.sin(4 * theta)
    return [
      1, 0, 0, 0,
      0, c4, s4, 0,
      0, s4, -c4, 0,
      0, 0, 0, -1,
    ]
  },

  // Rotator (optical activity) by angle θ
  rotator: (theta: number): number[] => {
    const c = Math.cos(2 * theta)
    const s = Math.sin(2 * theta)
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ]
  },

  // Ideal depolarizer (reduces DOP)
  depolarizer: (p: number): number[] => [
    1, 0, 0, 0,
    0, p, 0, 0,
    0, 0, p, 0,
    0, 0, 0, p,
  ],

  // Attenuator (neutral density filter)
  attenuator: (transmission: number): number[] => {
    const t = transmission
    return [
      t, 0, 0, 0,
      0, t, 0, 0,
      0, 0, t, 0,
      0, 0, 0, t,
    ]
  },
}

// Calculate degree of polarization
function calculateDOP(stokes: StokesVector): number {
  if (stokes[0] === 0) return 0
  const polarizedIntensity = Math.sqrt(
    stokes[1] * stokes[1] + stokes[2] * stokes[2] + stokes[3] * stokes[3]
  )
  return Math.min(polarizedIntensity / stokes[0], 1)
}

// Calculate polarization ellipse parameters from Stokes vector
function getEllipseFromStokes(stokes: StokesVector) {
  const S0 = stokes[0]
  const S1 = stokes[1]
  const S2 = stokes[2]
  const S3 = stokes[3]

  if (S0 === 0) {
    return { azimuth: 0, ellipticity: 0, dop: 0, handedness: 'none' as const }
  }

  // Azimuth angle (orientation)
  const azimuth = (0.5 * Math.atan2(S2, S1) * 180) / Math.PI

  // Ellipticity angle
  const dop = calculateDOP(stokes)
  const S3n = S3 / (S0 * dop || 1)
  const ellipticity = (0.5 * Math.asin(Math.max(-1, Math.min(1, S3n))) * 180) / Math.PI

  // Handedness
  const handedness = S3 > 0.01 ? 'right' as const : S3 < -0.01 ? 'left' as const : 'none' as const

  return { azimuth, ellipticity, dop, handedness }
}

// Common input polarization states
const INPUT_STATES: { id: string; nameEn: string; nameZh: string; stokes: StokesVector; color: string }[] = [
  {
    id: 'unpol',
    nameEn: 'Unpolarized',
    nameZh: '非偏振光',
    stokes: [1, 0, 0, 0],
    color: '#94a3b8',
  },
  {
    id: 'H',
    nameEn: 'Horizontal (H)',
    nameZh: '水平线偏振 (H)',
    stokes: [1, 1, 0, 0],
    color: '#ef4444',
  },
  {
    id: 'V',
    nameEn: 'Vertical (V)',
    nameZh: '垂直线偏振 (V)',
    stokes: [1, -1, 0, 0],
    color: '#22c55e',
  },
  {
    id: 'D',
    nameEn: 'Diagonal +45° (D)',
    nameZh: '+45°线偏振 (D)',
    stokes: [1, 0, 1, 0],
    color: '#f59e0b',
  },
  {
    id: 'A',
    nameEn: 'Anti-diagonal -45° (A)',
    nameZh: '-45°线偏振 (A)',
    stokes: [1, 0, -1, 0],
    color: '#eab308',
  },
  {
    id: 'R',
    nameEn: 'Right Circular (R)',
    nameZh: '右旋圆偏振 (R)',
    stokes: [1, 0, 0, 1],
    color: '#3b82f6',
  },
  {
    id: 'L',
    nameEn: 'Left Circular (L)',
    nameZh: '左旋圆偏振 (L)',
    stokes: [1, 0, 0, -1],
    color: '#ec4899',
  },
  {
    id: 'partial',
    nameEn: 'Partial (50% DOP)',
    nameZh: '部分偏振 (50% DOP)',
    stokes: [1, 0.5, 0, 0],
    color: '#a855f7',
  },
]

// Optical element type
interface OpticalElement {
  id: string
  type: 'polarizer' | 'hwp' | 'qwp' | 'rotator' | 'depolarizer' | 'attenuator'
  angle: number  // For polarizer, wave plates, rotator (degrees)
  param: number  // For depolarizer (factor) or attenuator (transmission)
}

// Create Mueller matrix for element
function createMuellerMatrix(element: OpticalElement): MuellerMatrix {
  const theta = (element.angle * Math.PI) / 180
  switch (element.type) {
    case 'polarizer':
      return {
        m: mueller.polarizer(theta),
        nameEn: `Polarizer ${element.angle}°`,
        nameZh: `偏振片 ${element.angle}°`,
        color: '#ef4444',
      }
    case 'hwp':
      return {
        m: mueller.halfWave(theta),
        nameEn: `HWP ${element.angle}°`,
        nameZh: `半波片 ${element.angle}°`,
        color: '#22c55e',
      }
    case 'qwp':
      return {
        m: mueller.quarterWave(theta),
        nameEn: `QWP ${element.angle}°`,
        nameZh: `四分之一波片 ${element.angle}°`,
        color: '#3b82f6',
      }
    case 'rotator':
      return {
        m: mueller.rotator(theta),
        nameEn: `Rotator ${element.angle}°`,
        nameZh: `旋光器 ${element.angle}°`,
        color: '#f59e0b',
      }
    case 'depolarizer':
      return {
        m: mueller.depolarizer(element.param),
        nameEn: `Depolarizer ${(element.param * 100).toFixed(0)}%`,
        nameZh: `退偏器 ${(element.param * 100).toFixed(0)}%`,
        color: '#8b5cf6',
      }
    case 'attenuator':
      return {
        m: mueller.attenuator(element.param),
        nameEn: `Attenuator ${(element.param * 100).toFixed(0)}%`,
        nameZh: `衰减器 ${(element.param * 100).toFixed(0)}%`,
        color: '#6b7280',
      }
  }
}

// Stokes vector display component
function StokesDisplay({ stokes, theme, label }: { stokes: StokesVector; theme: string; label?: string }) {
  const isDark = theme === 'dark'
  const labels = ['S₀', 'S₁', 'S₂', 'S₃']
  const colors = ['text-gray-400', 'text-red-400', 'text-green-400', 'text-blue-400']

  return (
    <div className="text-center">
      <div className={cn(
        'inline-flex items-center gap-1 p-2 rounded-lg font-mono text-sm',
        isDark ? 'bg-slate-800' : 'bg-gray-100'
      )}>
        <span className={cn('text-xl', isDark ? 'text-gray-500' : 'text-gray-500')}>[</span>
        <div className="flex flex-col gap-0.5">
          {stokes.map((val, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>{labels[i]}=</span>
              <span className={isDark ? colors[i] : colors[i].replace('400', '600')}>{val.toFixed(3)}</span>
            </div>
          ))}
        </div>
        <span className={cn('text-xl', isDark ? 'text-gray-500' : 'text-gray-500')}>]</span>
      </div>
      {label && (
        <div className={cn('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
          {label}
        </div>
      )}
    </div>
  )
}

// Matrix display component (4x4)
function MatrixDisplay({ matrix, theme }: { matrix: number[]; theme: string }) {
  const isDark = theme === 'dark'

  return (
    <div className={cn(
      'inline-flex items-center gap-1 p-2 rounded-lg font-mono text-[10px]',
      isDark ? 'bg-slate-800' : 'bg-gray-100'
    )}>
      <span className={cn('text-2xl', isDark ? 'text-gray-500' : 'text-gray-500')}>[</span>
      <div className="flex flex-col gap-0.5">
        {[0, 1, 2, 3].map(row => (
          <div key={row} className="flex gap-1.5">
            {[0, 1, 2, 3].map(col => {
              const val = matrix[row * 4 + col]
              const isNonZero = Math.abs(val) > 0.001
              return (
                <span
                  key={col}
                  className={cn(
                    'w-10 text-right',
                    isNonZero
                      ? isDark ? 'text-cyan-400' : 'text-cyan-600'
                      : isDark ? 'text-gray-600' : 'text-gray-500'
                  )}
                >
                  {val.toFixed(2)}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <span className={cn('text-2xl', isDark ? 'text-gray-500' : 'text-gray-500')}>]</span>
    </div>
  )
}

// Polarization visualization (Poincaré sphere projection + ellipse)
function PolarizationViz({
  stokes,
  theme,
}: {
  stokes: StokesVector
  theme: string
}) {
  const isDark = theme === 'dark'
  const bgColor = isDark ? '#0f172a' : '#f1f5f9'
  const axisColor = isDark ? '#374151' : '#cbd5e1'

  const width = 150
  const height = 150
  const cx = width / 2
  const cy = height / 2
  const maxR = 50

  const dop = calculateDOP(stokes)
  const { azimuth, ellipticity, handedness } = getEllipseFromStokes(stokes)

  // Ellipse parameters
  const angle = (azimuth * Math.PI) / 180
  const a = maxR * Math.sqrt(stokes[0]) * Math.max(0.1, dop)
  const b = Math.abs(Math.tan((ellipticity * Math.PI) / 180)) * a || 2

  // Generate ellipse path
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

  // Color based on polarization type
  const ellipseColor = dop < 0.1
    ? '#94a3b8'  // Unpolarized
    : handedness === 'right'
      ? '#22d3ee'  // Right circular
      : handedness === 'left'
        ? '#f472b6'  // Left circular
        : '#fbbf24'  // Linear

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[150px] mx-auto">
      <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={8} />
      {/* Reference circle for fully polarized */}
      <circle cx={cx} cy={cy} r={maxR} fill="none" stroke={axisColor} strokeWidth={1} strokeDasharray="3,3" />
      {/* Axes */}
      <line x1={15} y1={cy} x2={width - 15} y2={cy} stroke={axisColor} strokeWidth={1} />
      <line x1={cx} y1={15} x2={cx} y2={height - 15} stroke={axisColor} strokeWidth={1} />
      {/* Polarization ellipse */}
      {stokes[0] > 0.01 && (
        <path
          d={path}
          fill={`${ellipseColor}30`}
          stroke={ellipseColor}
          strokeWidth={2}
        />
      )}
      {/* Handedness indicator */}
      {handedness !== 'none' && dop > 0.3 && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={ellipseColor}
          fontSize={16}
        >
          {handedness === 'right' ? '↻' : '↺'}
        </text>
      )}
    </svg>
  )
}

// Optical element card
function ElementCard({
  element,
  onAngleChange,
  onParamChange,
  onRemove,
  theme,
  isZh,
}: {
  element: OpticalElement
  onAngleChange: (angle: number) => void
  onParamChange: (param: number) => void
  onRemove: () => void
  theme: string
  isZh: boolean
}) {
  const isDark = theme === 'dark'
  const muellerMatrix = createMuellerMatrix(element)

  const typeNames: Record<OpticalElement['type'], { en: string; zh: string }> = {
    polarizer: { en: 'Polarizer', zh: '偏振片' },
    hwp: { en: 'Half-Wave Plate', zh: '半波片' },
    qwp: { en: 'Quarter-Wave Plate', zh: '四分之一波片' },
    rotator: { en: 'Rotator', zh: '旋光器' },
    depolarizer: { en: 'Depolarizer', zh: '退偏器' },
    attenuator: { en: 'Attenuator', zh: '衰减器' },
  }

  const typeColors: Record<OpticalElement['type'], string> = {
    polarizer: '#ef4444',
    hwp: '#22c55e',
    qwp: '#3b82f6',
    rotator: '#f59e0b',
    depolarizer: '#8b5cf6',
    attenuator: '#6b7280',
  }

  const needsAngle = ['polarizer', 'hwp', 'qwp', 'rotator'].includes(element.type)
  const needsParam = ['depolarizer', 'attenuator'].includes(element.type)

  return (
    <div className={cn(
      'rounded-xl border p-3',
      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: typeColors[element.type] }}
          />
          <span className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-gray-900')}>
            {isZh ? typeNames[element.type].zh : typeNames[element.type].en}
          </span>
        </div>
        <button
          onClick={onRemove}
          className={cn(
            'p-1 rounded transition-colors',
            isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {needsAngle && (
        <SliderControl
          label={isZh ? '角度' : 'Angle'}
          value={element.angle}
          min={0}
          max={180}
          step={1}
          unit="°"
          onChange={onAngleChange}
          color="cyan"
        />
      )}

      {needsParam && (
        <SliderControl
          label={element.type === 'depolarizer' ? (isZh ? '保持系数' : 'Retention') : (isZh ? '透过率' : 'Transmission')}
          value={element.param * 100}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(val) => onParamChange(val / 100)}
          color={element.type === 'depolarizer' ? 'purple' : 'blue'}
        />
      )}

      <div className="mt-2 overflow-x-auto">
        <MatrixDisplay matrix={muellerMatrix.m} theme={theme} />
      </div>
    </div>
  )
}

// Main Page Component
export function MuellerCalculatorPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // State
  const [selectedInputId, setSelectedInputId] = useState('H')
  const [elements, setElements] = useState<OpticalElement[]>([
    { id: '1', type: 'qwp', angle: 45, param: 1 },
  ])
  const [showInfo, setShowInfo] = useState(false)
  const [showElementPicker, setShowElementPicker] = useState(false)

  // Get input Stokes vector
  const inputState = INPUT_STATES.find(s => s.id === selectedInputId) || INPUT_STATES[1]
  const inputStokes = inputState.stokes

  // Calculate output Stokes vector through all elements
  const { outputStokes, combinedMatrix } = useMemo(() => {
    if (elements.length === 0) {
      return {
        outputStokes: inputStokes,
        combinedMatrix: null,
      }
    }

    let combined = mueller.identity()
    for (const el of elements) {
      const matrix = createMuellerMatrix(el)
      combined = mueller.multiply(matrix.m, combined)
    }

    return {
      outputStokes: mueller.apply(combined, inputStokes),
      combinedMatrix: combined,
    }
  }, [inputStokes, elements])

  // Get polarization parameters
  const outputParams = getEllipseFromStokes(outputStokes)
  const inputDOP = calculateDOP(inputStokes)
  const outputDOP = calculateDOP(outputStokes)

  // Add element
  const addElement = (type: OpticalElement['type']) => {
    const newElement: OpticalElement = {
      id: Date.now().toString(),
      type,
      angle: type === 'qwp' ? 45 : 0,
      param: type === 'depolarizer' ? 0.5 : type === 'attenuator' ? 0.5 : 1,
    }
    setElements([...elements, newElement])
    setShowElementPicker(false)
  }

  // Update element
  const updateElement = (id: string, updates: Partial<OpticalElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el))
  }

  // Remove element
  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
  }

  // Reset
  const handleReset = () => {
    setSelectedInputId('H')
    setElements([{ id: '1', type: 'qwp', angle: 45, param: 1 }])
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
              <span className="text-xl">📊</span>
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}>
                {isZh ? '穆勒矩阵计算器' : 'Mueller Matrix Calculator'}
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
        {/* Transformation visualization */}
        <div className={cn(
          'rounded-2xl border p-6 mb-6',
          theme === 'dark'
            ? 'bg-slate-900/50 border-purple-400/20'
            : 'bg-white border-purple-200 shadow-lg'
        )}>
          <h2 className={cn(
            'text-lg font-semibold mb-6 text-center',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '斯托克斯矢量变换' : 'Stokes Vector Transformation'}
          </h2>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            {/* Input */}
            <div className="text-center">
              <h3 className={cn(
                'text-sm font-medium mb-3',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}>
                {isZh ? '输入偏振态' : 'Input State'}
              </h3>
              <PolarizationViz stokes={inputStokes} theme={theme} />
              <StokesDisplay
                stokes={inputStokes}
                theme={theme}
                label={isZh ? inputState.nameZh : inputState.nameEn}
              />
            </div>

            {/* Arrow + Combined Matrix */}
            <div className="flex items-center gap-2">
              <ArrowRight className={cn('w-6 h-6', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')} />
              {elements.length > 0 && combinedMatrix && (
                <div className="text-center">
                  <div className={cn(
                    'text-xs mb-1',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {isZh ? '组合矩阵' : 'Combined'}
                  </div>
                  <MatrixDisplay matrix={combinedMatrix} theme={theme} />
                </div>
              )}
              <ArrowRight className={cn('w-6 h-6', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')} />
            </div>

            {/* Output */}
            <div className="text-center">
              <h3 className={cn(
                'text-sm font-medium mb-3',
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              )}>
                {isZh ? '输出偏振态' : 'Output State'}
              </h3>
              <PolarizationViz stokes={outputStokes} theme={theme} />
              <StokesDisplay
                stokes={outputStokes}
                theme={theme}
                label={`I = ${(outputStokes[0] * 100).toFixed(1)}%`}
              />
            </div>
          </div>

          {/* Output parameters */}
          <div className={cn(
            'mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-center',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <ValueDisplay
              label={isZh ? '偏振度' : 'DOP'}
              value={`${(outputDOP * 100).toFixed(1)}%`}
              color={outputDOP > 0.9 ? 'green' : outputDOP > 0.5 ? 'orange' : 'red'}
            />
            <ValueDisplay
              label={isZh ? '方位角' : 'Azimuth'}
              value={`${outputParams.azimuth.toFixed(1)}°`}
              color="cyan"
            />
            <ValueDisplay
              label={isZh ? '椭圆度角' : 'Ellipticity'}
              value={`${outputParams.ellipticity.toFixed(1)}°`}
              color="purple"
            />
            <ValueDisplay
              label={isZh ? '强度' : 'Intensity'}
              value={`${(outputStokes[0] * 100).toFixed(1)}%`}
              color="blue"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input selector */}
          <div>
            <ControlPanel title={isZh ? '输入偏振态' : 'Input Polarization'}>
              <div className="grid grid-cols-2 gap-2">
                {INPUT_STATES.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => setSelectedInputId(state.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                      selectedInputId === state.id
                        ? theme === 'dark'
                          ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50'
                          : 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 hover:bg-slate-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: state.color }}
                    />
                    <span className="truncate">{state.id}</span>
                  </button>
                ))}
              </div>

              <div className={cn(
                'mt-4 p-3 rounded-lg text-xs',
                theme === 'dark' ? 'bg-slate-800/50 text-gray-400' : 'bg-gray-50 text-gray-600'
              )}>
                <div className="font-medium mb-1">{isZh ? '当前状态' : 'Current State'}:</div>
                <div>{isZh ? inputState.nameZh : inputState.nameEn}</div>
                <div className="mt-1">DOP: {(inputDOP * 100).toFixed(0)}%</div>
              </div>
            </ControlPanel>
          </div>

          {/* Optical elements */}
          <div className="lg:col-span-2">
            <div className={cn(
              'rounded-xl border p-4',
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn(
                  'font-semibold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '光学元件' : 'Optical Elements'}
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowElementPicker(!showElementPicker)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      theme === 'dark'
                        ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    {isZh ? '添加' : 'Add'}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showElementPicker && (
                    <div className={cn(
                      'absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-10',
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-gray-200'
                    )}>
                      {[
                        { type: 'polarizer' as const, nameEn: 'Polarizer', nameZh: '偏振片', color: '#ef4444' },
                        { type: 'hwp' as const, nameEn: 'Half-Wave Plate', nameZh: '半波片', color: '#22c55e' },
                        { type: 'qwp' as const, nameEn: 'Quarter-Wave Plate', nameZh: '四分之一波片', color: '#3b82f6' },
                        { type: 'rotator' as const, nameEn: 'Rotator', nameZh: '旋光器', color: '#f59e0b' },
                        { type: 'depolarizer' as const, nameEn: 'Depolarizer', nameZh: '退偏器', color: '#8b5cf6' },
                        { type: 'attenuator' as const, nameEn: 'Attenuator', nameZh: '衰减器', color: '#6b7280' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => addElement(item.type)}
                          className={cn(
                            'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors',
                            theme === 'dark'
                              ? 'hover:bg-slate-700 text-gray-300'
                              : 'hover:bg-gray-100 text-gray-700'
                          )}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {isZh ? item.nameZh : item.nameEn}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {elements.length === 0 ? (
                <div className={cn(
                  'text-center py-8',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  <p className="text-sm">
                    {isZh
                      ? '点击"添加"按钮添加光学元件'
                      : 'Click "Add" to add optical elements'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {elements.map((el, index) => (
                    <div key={el.id} className="relative">
                      {index > 0 && (
                        <div className={cn(
                          'absolute -left-4 top-1/2 -translate-y-1/2 text-xs',
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                        )}>
                          ×
                        </div>
                      )}
                      <ElementCard
                        element={el}
                        onAngleChange={(angle) => updateElement(el.id, { angle })}
                        onParamChange={(param) => updateElement(el.id, { param })}
                        onRemove={() => removeElement(el.id)}
                        theme={theme}
                        isZh={isZh}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title={isZh ? '斯托克斯矢量' : 'Stokes Vectors'} color="purple">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• <strong className="text-gray-400">S₀</strong>: {isZh ? '总强度' : 'Total intensity'}</li>
                <li>• <strong className="text-red-400">S₁</strong>: {isZh ? '水平/垂直偏振差' : 'Horizontal minus vertical'} (H-V)</li>
                <li>• <strong className="text-green-400">S₂</strong>: {isZh ? '±45°偏振差' : 'Diagonal minus anti-diagonal'} (D-A)</li>
                <li>• <strong className="text-blue-400">S₃</strong>: {isZh ? '右旋/左旋偏振差' : 'Right minus left circular'} (R-L)</li>
                <li>• {isZh
                  ? '偏振度 DOP = √(S₁²+S₂²+S₃²)/S₀'
                  : 'DOP = √(S₁²+S₂²+S₃²)/S₀'}</li>
              </ul>
            </InfoCard>

            <InfoCard title={isZh ? '穆勒矩阵' : 'Mueller Matrices'} color="cyan">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• {isZh
                  ? '4×4实数矩阵描述光学元件对任意偏振态的作用'
                  : '4×4 real matrices describe how elements affect any polarization state'}</li>
                <li>• {isZh
                  ? '比琼斯矩阵更通用，可处理部分偏振光'
                  : 'More general than Jones: can handle partially polarized light'}</li>
                <li>• <strong className="text-red-400">{isZh ? '偏振片' : 'Polarizer'}</strong>: {isZh ? '产生完全偏振' : 'Creates full polarization'}</li>
                <li>• <strong className="text-purple-400">{isZh ? '退偏器' : 'Depolarizer'}</strong>: {isZh ? '降低偏振度' : 'Reduces DOP'}</li>
              </ul>
            </InfoCard>

            <InfoCard title={isZh ? '穆勒 vs 琼斯' : 'Mueller vs Jones'} color="orange">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• <strong>{isZh ? '琼斯' : 'Jones'}</strong>: {isZh ? '2×2复数，仅完全偏振' : '2×2 complex, fully polarized only'}</li>
                <li>• <strong>{isZh ? '穆勒' : 'Mueller'}</strong>: {isZh ? '4×4实数，任意偏振态' : '4×4 real, any polarization state'}</li>
                <li>• {isZh
                  ? '穆勒矩阵可由测量直接获得'
                  : 'Mueller matrices are directly measurable'}</li>
                <li>• {isZh
                  ? '琼斯计算保留相位信息，穆勒不保留'
                  : 'Jones preserves phase info, Mueller does not'}</li>
              </ul>
            </InfoCard>

            <InfoCard title={isZh ? '应用场景' : 'Applications'} color="green">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• {isZh ? '偏振成像与遥感' : 'Polarimetric imaging and remote sensing'}</li>
                <li>• {isZh ? '光学元件表征' : 'Optical component characterization'}</li>
                <li>• {isZh ? '生物医学成像' : 'Biomedical imaging'}</li>
                <li>• {isZh ? '材料应力分析' : 'Material stress analysis'}</li>
              </ul>
            </InfoCard>
          </div>
        )}
      </main>
    </div>
  )
}

export default MuellerCalculatorPage
