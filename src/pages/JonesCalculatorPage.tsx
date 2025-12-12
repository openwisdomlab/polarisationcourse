/**
 * Jones Vector Calculator Page
 * 琼斯向量计算器 - 计算偏振光通过光学元件的变换
 *
 * Interactive tool for computing Jones vector transformations
 * through various optical elements like polarizers and waveplates.
 */
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay } from '@/components/demos/DemoControls'
import { ArrowLeft, RotateCcw, Info, ArrowRight, Plus, X, ChevronDown } from 'lucide-react'

// Complex number type for Jones vectors
interface Complex {
  re: number
  im: number
}

// Jones vector type
interface JonesVector {
  Ex: Complex
  Ey: Complex
}

// Jones matrix type (2x2 complex matrix)
interface JonesMatrix {
  a: Complex
  b: Complex
  c: Complex
  d: Complex
  nameEn: string
  nameZh: string
  color: string
}

// Complex number operations
const complex = {
  create: (re: number, im: number = 0): Complex => ({ re, im }),
  fromPolar: (r: number, theta: number): Complex => ({
    re: r * Math.cos(theta),
    im: r * Math.sin(theta),
  }),
  add: (a: Complex, b: Complex): Complex => ({
    re: a.re + b.re,
    im: a.im + b.im,
  }),
  multiply: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),
  scale: (a: Complex, s: number): Complex => ({
    re: a.re * s,
    im: a.im * s,
  }),
  magnitude: (a: Complex): number => Math.sqrt(a.re * a.re + a.im * a.im),
  phase: (a: Complex): number => Math.atan2(a.im, a.re),
  conjugate: (a: Complex): Complex => ({ re: a.re, im: -a.im }),
  toString: (a: Complex, precision: number = 3): string => {
    const re = a.re.toFixed(precision)
    const im = Math.abs(a.im).toFixed(precision)
    if (Math.abs(a.im) < 0.0005) return re
    if (Math.abs(a.re) < 0.0005) return a.im >= 0 ? `${im}i` : `-${im}i`
    return a.im >= 0 ? `${re} + ${im}i` : `${re} - ${im}i`
  },
}

// Apply Jones matrix to Jones vector
function applyMatrix(matrix: JonesMatrix, vector: JonesVector): JonesVector {
  return {
    Ex: complex.add(
      complex.multiply(matrix.a, vector.Ex),
      complex.multiply(matrix.b, vector.Ey)
    ),
    Ey: complex.add(
      complex.multiply(matrix.c, vector.Ex),
      complex.multiply(matrix.d, vector.Ey)
    ),
  }
}

// Multiply two Jones matrices
function multiplyMatrices(m1: JonesMatrix, m2: JonesMatrix): JonesMatrix {
  return {
    a: complex.add(complex.multiply(m1.a, m2.a), complex.multiply(m1.b, m2.c)),
    b: complex.add(complex.multiply(m1.a, m2.b), complex.multiply(m1.b, m2.d)),
    c: complex.add(complex.multiply(m1.c, m2.a), complex.multiply(m1.d, m2.c)),
    d: complex.add(complex.multiply(m1.c, m2.b), complex.multiply(m1.d, m2.d)),
    nameEn: 'Combined',
    nameZh: '组合',
    color: '#a855f7',
  }
}

// Normalize Jones vector
function normalizeVector(v: JonesVector): JonesVector {
  const mag = Math.sqrt(
    complex.magnitude(v.Ex) ** 2 + complex.magnitude(v.Ey) ** 2
  )
  if (mag === 0) return v
  return {
    Ex: complex.scale(v.Ex, 1 / mag),
    Ey: complex.scale(v.Ey, 1 / mag),
  }
}

// Get polarization ellipse parameters from Jones vector
function getEllipseParams(v: JonesVector) {
  const ax = complex.magnitude(v.Ex)
  const ay = complex.magnitude(v.Ey)
  const delta = complex.phase(v.Ey) - complex.phase(v.Ex)

  // Ellipse orientation angle (azimuth)
  const tan2psi = (2 * ax * ay * Math.cos(delta)) / (ax * ax - ay * ay)
  const psi = Math.abs(ax - ay) < 0.001 ? (delta > 0 ? Math.PI / 4 : -Math.PI / 4) : 0.5 * Math.atan(tan2psi)

  // Ellipticity angle
  const sin2chi = (2 * ax * ay * Math.sin(delta)) / (ax * ax + ay * ay)
  const chi = 0.5 * Math.asin(Math.max(-1, Math.min(1, sin2chi)))

  // Intensity
  const intensity = ax * ax + ay * ay

  return {
    azimuth: (psi * 180) / Math.PI,
    ellipticity: (chi * 180) / Math.PI,
    intensity,
    isRightHanded: delta > 0 && delta < Math.PI,
  }
}

// Common input polarization states
const INPUT_STATES: { id: string; nameEn: string; nameZh: string; vector: JonesVector; color: string }[] = [
  {
    id: 'H',
    nameEn: 'Horizontal (H)',
    nameZh: '水平线偏振 (H)',
    vector: { Ex: complex.create(1), Ey: complex.create(0) },
    color: '#ef4444',
  },
  {
    id: 'V',
    nameEn: 'Vertical (V)',
    nameZh: '垂直线偏振 (V)',
    vector: { Ex: complex.create(0), Ey: complex.create(1) },
    color: '#22c55e',
  },
  {
    id: 'D',
    nameEn: 'Diagonal +45° (D)',
    nameZh: '+45°线偏振 (D)',
    vector: { Ex: complex.create(1 / Math.sqrt(2)), Ey: complex.create(1 / Math.sqrt(2)) },
    color: '#f59e0b',
  },
  {
    id: 'A',
    nameEn: 'Anti-diagonal -45° (A)',
    nameZh: '-45°线偏振 (A)',
    vector: { Ex: complex.create(1 / Math.sqrt(2)), Ey: complex.create(-1 / Math.sqrt(2)) },
    color: '#eab308',
  },
  {
    id: 'R',
    nameEn: 'Right Circular (R)',
    nameZh: '右旋圆偏振 (R)',
    vector: { Ex: complex.create(1 / Math.sqrt(2)), Ey: complex.create(0, -1 / Math.sqrt(2)) },
    color: '#3b82f6',
  },
  {
    id: 'L',
    nameEn: 'Left Circular (L)',
    nameZh: '左旋圆偏振 (L)',
    vector: { Ex: complex.create(1 / Math.sqrt(2)), Ey: complex.create(0, 1 / Math.sqrt(2)) },
    color: '#ec4899',
  },
]

// Create Jones matrices for optical elements
function createPolarizerMatrix(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return {
    a: complex.create(c * c),
    b: complex.create(c * s),
    c: complex.create(c * s),
    d: complex.create(s * s),
    nameEn: `Polarizer ${angle}°`,
    nameZh: `偏振片 ${angle}°`,
    color: '#ef4444',
  }
}

function createHalfWavePlateMatrix(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c2 = Math.cos(2 * theta)
  const s2 = Math.sin(2 * theta)
  return {
    a: complex.create(c2),
    b: complex.create(s2),
    c: complex.create(s2),
    d: complex.create(-c2),
    nameEn: `HWP ${angle}°`,
    nameZh: `半波片 ${angle}°`,
    color: '#22c55e',
  }
}

function createQuarterWavePlateMatrix(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const c2 = c * c
  const s2 = s * s
  const cs = c * s
  return {
    a: complex.create(c2, s2),
    b: complex.create(cs, -cs),
    c: complex.create(cs, -cs),
    d: complex.create(s2, c2),
    nameEn: `QWP ${angle}°`,
    nameZh: `四分之一波片 ${angle}°`,
    color: '#3b82f6',
  }
}

function createRotatorMatrix(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return {
    a: complex.create(c),
    b: complex.create(-s),
    c: complex.create(s),
    d: complex.create(c),
    nameEn: `Rotator ${angle}°`,
    nameZh: `旋光器 ${angle}°`,
    color: '#f59e0b',
  }
}

// Optical element type
interface OpticalElement {
  id: string
  type: 'polarizer' | 'hwp' | 'qwp' | 'rotator'
  angle: number
}

// Polarization Ellipse visualization
function PolarizationEllipse({
  azimuth,
  ellipticity,
  intensity,
  theme,
  label,
}: {
  azimuth: number
  ellipticity: number
  intensity: number
  theme: string
  label?: string
}) {
  const isDark = theme === 'dark'
  const bgColor = isDark ? '#0f172a' : '#f1f5f9'
  const axisColor = isDark ? '#374151' : '#cbd5e1'
  const ellipseColor = ellipticity > 0.5 ? '#22d3ee' : ellipticity < -0.5 ? '#f472b6' : '#fbbf24'

  const width = 150
  const height = 150
  const cx = width / 2
  const cy = height / 2
  const maxR = 50

  // Generate ellipse path
  const a = maxR * Math.sqrt(intensity)
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

  return (
    <div className="text-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[150px] mx-auto">
        <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={8} />
        <circle cx={cx} cy={cy} r={maxR} fill="none" stroke={axisColor} strokeWidth={1} strokeDasharray="3,3" />
        <line x1={15} y1={cy} x2={width - 15} y2={cy} stroke={axisColor} strokeWidth={1} />
        <line x1={cx} y1={15} x2={cx} y2={height - 15} stroke={axisColor} strokeWidth={1} />
        {intensity > 0.01 && (
          <path d={path} fill={`${ellipseColor}30`} stroke={ellipseColor} strokeWidth={2} />
        )}
      </svg>
      {label && (
        <div className={cn('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
          {label}
        </div>
      )}
    </div>
  )
}

// Matrix display component
function MatrixDisplay({ matrix, theme }: { matrix: JonesMatrix; theme: string }) {
  const isDark = theme === 'dark'

  return (
    <div className={cn(
      'inline-flex items-center gap-1 p-2 rounded-lg font-mono text-xs',
      isDark ? 'bg-slate-800' : 'bg-gray-100'
    )}>
      <span className={cn('text-2xl', isDark ? 'text-gray-500' : 'text-gray-400')}>[</span>
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-2">
          <span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>{complex.toString(matrix.a, 2)}</span>
          <span className={isDark ? 'text-green-400' : 'text-green-600'}>{complex.toString(matrix.b, 2)}</span>
        </div>
        <div className="flex gap-2">
          <span className={isDark ? 'text-orange-400' : 'text-orange-600'}>{complex.toString(matrix.c, 2)}</span>
          <span className={isDark ? 'text-purple-400' : 'text-purple-600'}>{complex.toString(matrix.d, 2)}</span>
        </div>
      </div>
      <span className={cn('text-2xl', isDark ? 'text-gray-500' : 'text-gray-400')}>]</span>
    </div>
  )
}

// Vector display component
function VectorDisplay({ vector, theme, label }: { vector: JonesVector; theme: string; label?: string }) {
  const isDark = theme === 'dark'

  return (
    <div className="text-center">
      <div className={cn(
        'inline-flex items-center gap-1 p-2 rounded-lg font-mono text-sm',
        isDark ? 'bg-slate-800' : 'bg-gray-100'
      )}>
        <span className={cn('text-xl', isDark ? 'text-gray-500' : 'text-gray-400')}>[</span>
        <div className="flex flex-col gap-0.5">
          <span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>{complex.toString(vector.Ex)}</span>
          <span className={isDark ? 'text-green-400' : 'text-green-600'}>{complex.toString(vector.Ey)}</span>
        </div>
        <span className={cn('text-xl', isDark ? 'text-gray-500' : 'text-gray-400')}>]</span>
      </div>
      {label && (
        <div className={cn('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
          {label}
        </div>
      )}
    </div>
  )
}

// Optical element card
function ElementCard({
  element,
  onAngleChange,
  onRemove,
  theme,
  isZh,
}: {
  element: OpticalElement
  onAngleChange: (angle: number) => void
  onRemove: () => void
  theme: string
  isZh: boolean
}) {
  const isDark = theme === 'dark'
  const matrix = useMemo(() => {
    switch (element.type) {
      case 'polarizer': return createPolarizerMatrix(element.angle)
      case 'hwp': return createHalfWavePlateMatrix(element.angle)
      case 'qwp': return createQuarterWavePlateMatrix(element.angle)
      case 'rotator': return createRotatorMatrix(element.angle)
    }
  }, [element.type, element.angle])

  const typeNames = {
    polarizer: { en: 'Polarizer', zh: '偏振片' },
    hwp: { en: 'Half-Wave Plate', zh: '半波片' },
    qwp: { en: 'Quarter-Wave Plate', zh: '四分之一波片' },
    rotator: { en: 'Rotator', zh: '旋光器' },
  }

  const typeColors = {
    polarizer: '#ef4444',
    hwp: '#22c55e',
    qwp: '#3b82f6',
    rotator: '#f59e0b',
  }

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
      <div className="mt-2">
        <MatrixDisplay matrix={matrix} theme={theme} />
      </div>
    </div>
  )
}

// Main Page Component
export function JonesCalculatorPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // State
  const [selectedInputId, setSelectedInputId] = useState('H')
  const [elements, setElements] = useState<OpticalElement[]>([
    { id: '1', type: 'qwp', angle: 45 },
  ])
  const [showInfo, setShowInfo] = useState(false)
  const [showElementPicker, setShowElementPicker] = useState(false)

  // Get input vector
  const inputState = INPUT_STATES.find(s => s.id === selectedInputId) || INPUT_STATES[0]
  const inputVector = inputState.vector

  // Calculate output vector through all elements
  const { outputVector, combinedMatrix } = useMemo(() => {
    if (elements.length === 0) {
      return {
        outputVector: inputVector,
        combinedMatrix: null,
      }
    }

    let combined: JonesMatrix | null = null
    for (const el of elements) {
      const matrix = (() => {
        switch (el.type) {
          case 'polarizer': return createPolarizerMatrix(el.angle)
          case 'hwp': return createHalfWavePlateMatrix(el.angle)
          case 'qwp': return createQuarterWavePlateMatrix(el.angle)
          case 'rotator': return createRotatorMatrix(el.angle)
        }
      })()

      combined = combined ? multiplyMatrices(matrix, combined) : matrix
    }

    return {
      outputVector: combined ? applyMatrix(combined, inputVector) : inputVector,
      combinedMatrix: combined,
    }
  }, [inputVector, elements])

  // Get ellipse parameters
  const inputEllipse = getEllipseParams(inputVector)
  const outputEllipse = getEllipseParams(outputVector)

  // Add element
  const addElement = (type: OpticalElement['type']) => {
    const newElement: OpticalElement = {
      id: Date.now().toString(),
      type,
      angle: type === 'qwp' ? 45 : 0,
    }
    setElements([...elements, newElement])
    setShowElementPicker(false)
  }

  // Update element angle
  const updateElementAngle = (id: string, angle: number) => {
    setElements(elements.map(el => el.id === id ? { ...el, angle } : el))
  }

  // Remove element
  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
  }

  // Reset
  const handleReset = () => {
    setSelectedInputId('H')
    setElements([{ id: '1', type: 'qwp', angle: 45 }])
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
                to="/lab"
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
              <span className="text-xl">🧮</span>
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                {isZh ? '琼斯向量计算器' : 'Jones Vector Calculator'}
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
            ? 'bg-slate-900/50 border-cyan-400/20'
            : 'bg-white border-cyan-200 shadow-lg'
        )}>
          <h2 className={cn(
            'text-lg font-semibold mb-6 text-center',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '偏振态变换' : 'Polarization Transformation'}
          </h2>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            {/* Input */}
            <div className="text-center">
              <h3 className={cn(
                'text-sm font-medium mb-3',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                {isZh ? '输入偏振态' : 'Input State'}
              </h3>
              <PolarizationEllipse
                azimuth={inputEllipse.azimuth}
                ellipticity={inputEllipse.ellipticity}
                intensity={inputEllipse.intensity}
                theme={theme}
              />
              <VectorDisplay
                vector={inputVector}
                theme={theme}
                label={isZh ? inputState.nameZh : inputState.nameEn}
              />
            </div>

            {/* Arrow + Elements */}
            <div className="flex items-center gap-2">
              <ArrowRight className={cn('w-6 h-6', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')} />
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
              <ArrowRight className={cn('w-6 h-6', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')} />
            </div>

            {/* Output */}
            <div className="text-center">
              <h3 className={cn(
                'text-sm font-medium mb-3',
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              )}>
                {isZh ? '输出偏振态' : 'Output State'}
              </h3>
              <PolarizationEllipse
                azimuth={outputEllipse.azimuth}
                ellipticity={outputEllipse.ellipticity}
                intensity={outputEllipse.intensity}
                theme={theme}
              />
              <VectorDisplay
                vector={normalizeVector(outputVector)}
                theme={theme}
                label={`I = ${(outputEllipse.intensity * 100).toFixed(1)}%`}
              />
            </div>
          </div>

          {/* Output parameters */}
          <div className={cn(
            'mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-center',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <ValueDisplay
              label={isZh ? '方位角' : 'Azimuth'}
              value={`${outputEllipse.azimuth.toFixed(1)}°`}
              color="orange"
            />
            <ValueDisplay
              label={isZh ? '椭圆度角' : 'Ellipticity'}
              value={`${outputEllipse.ellipticity.toFixed(1)}°`}
              color="cyan"
            />
            <ValueDisplay
              label={isZh ? '强度' : 'Intensity'}
              value={`${(outputEllipse.intensity * 100).toFixed(1)}%`}
              color="green"
            />
            <ValueDisplay
              label={isZh ? '类型' : 'Type'}
              value={
                Math.abs(outputEllipse.ellipticity) < 1
                  ? (isZh ? '线偏振' : 'Linear')
                  : Math.abs(outputEllipse.ellipticity) > 44
                    ? (isZh ? '圆偏振' : 'Circular')
                    : (isZh ? '椭圆偏振' : 'Elliptical')
              }
              color="purple"
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
                          ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/50'
                          : 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300'
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
                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                        : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
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
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
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
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        )}>
                          ×
                        </div>
                      )}
                      <ElementCard
                        element={el}
                        onAngleChange={(angle) => updateElementAngle(el.id, angle)}
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
            <InfoCard title={isZh ? '琼斯矢量' : 'Jones Vectors'} color="cyan">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• {isZh
                  ? '琼斯矢量用两个复数描述完全偏振光的电场振幅和相位'
                  : 'Jones vectors describe fully polarized light using two complex numbers for E-field amplitude and phase'}</li>
                <li>• <strong className="text-red-400">Ex</strong>: {isZh ? 'x方向电场分量' : 'Electric field component in x-direction'}</li>
                <li>• <strong className="text-green-400">Ey</strong>: {isZh ? 'y方向电场分量' : 'Electric field component in y-direction'}</li>
                <li>• {isZh
                  ? '相位差决定偏振类型：0°=线偏振，90°=圆偏振'
                  : 'Phase difference determines type: 0°=linear, 90°=circular'}</li>
              </ul>
            </InfoCard>

            <InfoCard title={isZh ? '琼斯矩阵' : 'Jones Matrices'} color="purple">
              <ul className={cn(
                'text-xs space-y-1.5',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                <li>• {isZh
                  ? '2×2复数矩阵描述光学元件对偏振光的作用'
                  : '2×2 complex matrices describe how optical elements affect polarized light'}</li>
                <li>• <strong className="text-red-400">{isZh ? '偏振片' : 'Polarizer'}</strong>: {isZh ? '透过特定偏振方向' : 'Transmits specific polarization'}</li>
                <li>• <strong className="text-green-400">{isZh ? '半波片' : 'HWP'}</strong>: {isZh ? '旋转线偏振方向' : 'Rotates linear polarization'}</li>
                <li>• <strong className="text-blue-400">{isZh ? '四分之一波片' : 'QWP'}</strong>: {isZh ? '线偏振↔圆偏振转换' : 'Converts linear↔circular'}</li>
              </ul>
            </InfoCard>
          </div>
        )}
      </main>
    </div>
  )
}
