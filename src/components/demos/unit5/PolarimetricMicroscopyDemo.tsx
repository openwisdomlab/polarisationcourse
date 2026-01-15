/**
 * 全偏振显微成像演示 - Unit 5
 * 演示Mueller矩阵显微镜的工作原理和图像分析
 * 展示偏振成像在生物医学中的应用
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { Microscope, Grid3X3, Layers } from 'lucide-react'

// Sample types for demonstration
type SampleType = 'fiber' | 'crystal' | 'tissue' | 'stress'

interface SampleConfig {
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  muellerMatrix: number[][]
  color: string
}

const SAMPLES: Record<SampleType, SampleConfig> = {
  fiber: {
    name: 'Collagen Fiber',
    nameZh: '胶原纤维',
    description: 'Oriented birefringent fibers show strong linear retardance',
    descriptionZh: '取向双折射纤维表现出强线性延迟',
    muellerMatrix: [
      [1, 0, 0, 0],
      [0, 0.9, 0.1, 0],
      [0, 0.1, 0.9, 0.3],
      [0, 0, -0.3, 0.8],
    ],
    color: '#f472b6',
  },
  crystal: {
    name: 'Liquid Crystal',
    nameZh: '液晶',
    description: 'Aligned liquid crystals show optical rotation',
    descriptionZh: '取向液晶表现出旋光性',
    muellerMatrix: [
      [1, 0, 0, 0],
      [0, 0.95, 0.31, 0],
      [0, -0.31, 0.95, 0],
      [0, 0, 0, 1],
    ],
    color: '#22d3ee',
  },
  tissue: {
    name: 'Biological Tissue',
    nameZh: '生物组织',
    description: 'Tissue shows depolarization from multiple scattering',
    descriptionZh: '组织因多次散射表现出退偏振',
    muellerMatrix: [
      [1, 0.02, 0, 0],
      [0.02, 0.7, 0.1, 0],
      [0, 0.1, 0.65, 0],
      [0, 0, 0, 0.6],
    ],
    color: '#fb923c',
  },
  stress: {
    name: 'Stressed Material',
    nameZh: '应力材料',
    description: 'Stress-induced birefringence in transparent materials',
    descriptionZh: '透明材料中的应力诱导双折射',
    muellerMatrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0.7, 0.7],
      [0, 0, -0.7, 0.7],
    ],
    color: '#a855f7',
  },
}

// Mueller matrix element names
const MUELLER_NAMES = [
  ['M₀₀', 'M₀₁', 'M₀₂', 'M₀₃'],
  ['M₁₀', 'M₁₁', 'M₁₂', 'M₁₃'],
  ['M₂₀', 'M₂₁', 'M₂₂', 'M₂₃'],
  ['M₃₀', 'M₃₁', 'M₃₂', 'M₃₃'],
]

// Polarization parameter calculation
function calculatePolarizationParams(M: number[][]) {
  // Degree of Polarization
  const dop = Math.sqrt(M[0][1] ** 2 + M[0][2] ** 2 + M[0][3] ** 2) / M[0][0]

  // Linear Retardance (simplified)
  const R = Math.acos((M[1][1] + M[2][2]) / 2 - 1) * (180 / Math.PI)

  // Depolarization index
  const trace = M[1][1] ** 2 + M[1][2] ** 2 + M[1][3] ** 2 +
    M[2][1] ** 2 + M[2][2] ** 2 + M[2][3] ** 2 +
    M[3][1] ** 2 + M[3][2] ** 2 + M[3][3] ** 2
  const depol = 1 - Math.sqrt((trace) / 3)

  // Diattenuation
  const D = Math.sqrt(M[0][1] ** 2 + M[0][2] ** 2 + M[0][3] ** 2) / M[0][0]

  return { dop, R, depol, D }
}

// Simulated microscopy image
function MicroscopyImage({
  sample,
  showOverlay,
  overlayType,
  pixelSize,
}: {
  sample: SampleType
  showOverlay: boolean
  overlayType: 'retardance' | 'depol' | 'diattenuation'
  pixelSize: number
}) {
  const config = SAMPLES[sample]

  // Generate a simulated image grid
  const imageData = useMemo(() => {
    const grid: { value: number; color: string }[][] = []
    const size = Math.floor(200 / pixelSize)

    for (let i = 0; i < size; i++) {
      const row: { value: number; color: string }[] = []
      for (let j = 0; j < size; j++) {
        // Create patterns based on sample type
        let value = 0
        const x = j / size
        const y = i / size

        switch (sample) {
          case 'fiber':
            // Diagonal fiber pattern
            value = Math.sin((x + y) * 8 * Math.PI) * 0.5 + 0.5
            value *= Math.exp(-((x - 0.5) ** 2 + (y - 0.5) ** 2) * 2)
            break
          case 'crystal':
            // Radial liquid crystal pattern
            const dx = x - 0.5
            const dy = y - 0.5
            const angle = Math.atan2(dy, dx)
            value = (Math.sin(angle * 4) + 1) / 2
            break
          case 'tissue':
            // Scattered tissue pattern
            value = Math.random() * 0.4 + 0.3
            value += Math.sin(x * 10) * Math.sin(y * 10) * 0.2
            break
          case 'stress':
            // Stress fringes pattern
            const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2)
            value = Math.sin(r * 20 * Math.PI) * 0.5 + 0.5
            break
        }

        // Calculate color based on overlay type
        let color = config.color
        if (showOverlay) {
          const hue = overlayType === 'retardance'
            ? value * 240 // Blue to red
            : overlayType === 'depol'
              ? 120 - value * 120 // Green to red
              : value * 60 // Yellow scale
          color = `hsl(${hue}, 70%, ${30 + value * 40}%)`
        }

        row.push({ value, color })
      }
      grid.push(row)
    }
    return grid
  }, [sample, showOverlay, overlayType, pixelSize, config.color])

  return (
    <svg viewBox="0 0 220 220" className="w-full h-auto">
      {/* Background */}
      <rect x="0" y="0" width="220" height="220" fill="#0f172a" rx="8" />

      {/* Microscopy field border */}
      <circle
        cx="110"
        cy="110"
        r="95"
        fill="none"
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Image pixels */}
      <g transform="translate(15, 15)">
        <clipPath id="circleClip">
          <circle cx="95" cy="95" r="93" />
        </clipPath>
        <g clipPath="url(#circleClip)">
          {imageData.map((row, i) =>
            row.map((pixel, j) => (
              <motion.rect
                key={`${i}-${j}`}
                x={j * pixelSize}
                y={i * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={pixel.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: (i + j) * 0.002 }}
              />
            ))
          )}
        </g>
      </g>

      {/* Field of view indicator */}
      <text x="110" y="215" textAnchor="middle" fill="#64748b" fontSize="10">
        视场: 100 μm
      </text>
    </svg>
  )
}

// Mueller matrix display
function MuellerMatrixDisplay({
  matrix,
  highlight,
  theme,
}: {
  matrix: number[][]
  highlight?: [number, number]
  theme: string
}) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {matrix.map((row, i) =>
        row.map((val, j) => (
          <motion.div
            key={`${i}-${j}`}
            className={`p-1.5 rounded text-center font-mono text-xs ${highlight && highlight[0] === i && highlight[1] === j
                ? 'bg-cyan-600 text-white'
                : i === 0 || j === 0
                  ? theme === 'dark' ? 'bg-slate-700 text-cyan-400' : 'bg-gray-200 text-cyan-600'
                  : theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            <div className={`text-[8px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{MUELLER_NAMES[i][j]}</div>
            <div>{val.toFixed(2)}</div>
          </motion.div>
        ))
      )}
    </div>
  )
}

// Polarization parameter bar
function ParamBar({
  label,
  value,
  max,
  color,
  unit,
  theme,
}: {
  label: string
  value: number
  max: number
  color: string
  unit?: string
  theme: string
}) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{label}</span>
        <span className={`font-mono text-${color}-400`}>
          {value.toFixed(2)}{unit}
        </span>
      </div>
      <div className={`h-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full bg-${color}-500`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

// Main demo component
export function PolarimetricMicroscopyDemo() {
  const { theme } = useTheme()
  const [sampleType, setSampleType] = useState<SampleType>('fiber')
  const [showOverlay, setShowOverlay] = useState(true)
  const [overlayType, setOverlayType] = useState<'retardance' | 'depol' | 'diattenuation'>('retardance')
  const [pixelSize, setPixelSize] = useState(8)
  const [highlightElement, _setHighlightElement] = useState<[number, number] | undefined>()

  const sample = SAMPLES[sampleType]
  const params = useMemo(() => calculatePolarizationParams(sample.muellerMatrix), [sample])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-white via-violet-100 to-white' : 'from-violet-600 via-violet-500 to-violet-600'} bg-clip-text text-transparent`}>
          全偏振显微成像
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Mueller矩阵显微镜的工作原理与应用
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Microscopy view */}
        <div className="space-y-4">
          <div className={`rounded-xl bg-gradient-to-br ${theme === 'dark' ? 'from-slate-900/90 via-slate-900/95 to-violet-950/90 border-violet-500/30' : 'from-white via-gray-50 to-violet-50 border-violet-200'} border p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-violet-400" />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Mueller显微成像</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className={`px-2 py-1 text-xs rounded flex items-center gap-1 transition-colors ${showOverlay ? 'bg-violet-600 text-white' : theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  <Layers size={12} />
                  叠加显示
                </button>
              </div>
            </div>
            <MicroscopyImage
              sample={sampleType}
              showOverlay={showOverlay}
              overlayType={overlayType}
              pixelSize={pixelSize}
            />
          </div>

          {/* Overlay type selector */}
          {showOverlay && (
            <div className="flex gap-2 justify-center">
              {[
                { type: 'retardance' as const, label: '延迟', color: 'cyan' },
                { type: 'depol' as const, label: '退偏振', color: 'green' },
                { type: 'diattenuation' as const, label: '二向衰减', color: 'orange' },
              ].map(({ type, label, color }) => (
                <button
                  key={type}
                  onClick={() => setOverlayType(type)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${overlayType === type
                      ? `bg-${color}-600 text-white`
                      : theme === 'dark' ? 'bg-slate-700 text-gray-400 hover:bg-slate-600' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Polarization parameters */}
          <div className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} border p-4`}>
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
              <Grid3X3 size={16} className="text-violet-400" />
              偏振参数提取
            </h3>
            <div className="space-y-3">
              <ParamBar label="线性延迟 R" value={params.R} max={180} color="cyan" unit="°" theme={theme} />
              <ParamBar label="退偏振指数" value={params.depol} max={1} color="green" theme={theme} />
              <ParamBar label="二向衰减 D" value={params.D} max={1} color="orange" theme={theme} />
              <ParamBar label="偏振度 DOP" value={params.dop} max={1} color="pink" theme={theme} />
            </div>
          </div>
        </div>

        {/* Right: Controls and Matrix */}
        <div className="space-y-4">
          {/* Sample selector */}
          <ControlPanel title="样品选择">
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SAMPLES) as SampleType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSampleType(type)}
                  className={`p-3 rounded-lg text-left transition-all ${sampleType === type
                      ? 'bg-violet-600/30 border border-violet-500'
                      : theme === 'dark' ? 'bg-slate-800/50 border border-slate-700 hover:border-slate-500' : 'bg-gray-100 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: SAMPLES[type].color }}
                    />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {SAMPLES[type].nameZh}
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    {SAMPLES[type].descriptionZh}
                  </p>
                </button>
              ))}
            </div>
          </ControlPanel>

          {/* Mueller Matrix */}
          <ControlPanel title="Mueller矩阵">
            <MuellerMatrixDisplay
              matrix={sample.muellerMatrix}
              highlight={highlightElement}
              theme={theme}
            />
            <div className={`mt-3 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>• M₀₀: 总强度透过率</p>
              <p>• 对角元素: 偏振保持特性</p>
              <p>• 非对角元素: 偏振转换特性</p>
            </div>
          </ControlPanel>

          {/* Display settings */}
          <ControlPanel title="显示设置">
            <SliderControl
              label="像素尺寸"
              value={pixelSize}
              min={4}
              max={16}
              step={2}
              unit=" px"
              onChange={setPixelSize}
              color="purple"
            />
          </ControlPanel>

          {/* Microscope setup */}
          <ControlPanel title="显微镜原理">
            <div className={`space-y-2 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
                <span className="text-violet-400 font-medium">照明臂:</span>
                <p className="mt-1">偏振态发生器(PSG)产生4种已知偏振态照明样品</p>
              </div>
              <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
                <span className="text-violet-400 font-medium">探测臂:</span>
                <p className="mt-1">偏振态分析器(PSA)分析出射光的偏振态</p>
              </div>
              <div className={`p-2 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'} rounded-lg`}>
                <span className="text-violet-400 font-medium">数据处理:</span>
                <p className="mt-1">16次测量重建完整4×4 Mueller矩阵</p>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>

      {/* Knowledge cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="Mueller矩阵显微镜" color="purple">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            通过测量样品的完整4×4 Mueller矩阵，可以获得样品的所有偏振特性信息，包括双折射、二向衰减、退偏振等，是最完备的偏振成像技术。
          </p>
        </InfoCard>
        <InfoCard title="生物医学应用" color="orange">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            用于肿瘤边界识别、胶原纤维取向分析、眼科角膜检测等。偏振参数可提供组织微结构的定量信息，辅助临床诊断。
          </p>
        </InfoCard>
        <InfoCard title="材料表征" color="cyan">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            分析材料内部应力分布、液晶取向、薄膜厚度等。Mueller矩阵分解可提取双折射、旋光、退偏振等独立参数。
          </p>
        </InfoCard>
      </div>
    </div>
  )
}
