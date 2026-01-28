/**
 * 全偏振显微成像演示 - Unit 5
 * 演示Mueller矩阵显微镜的工作原理和图像分析
 * 展示偏振成像在生物医学中的应用
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useDemoTheme } from '../demoThemeColors'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { DemoHeader, VisualizationPanel, DemoMainLayout, StatCard, InfoGrid, ChartPanel } from '../DemoLayout'
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
  ['M\u2080\u2080', 'M\u2080\u2081', 'M\u2080\u2082', 'M\u2080\u2083'],
  ['M\u2081\u2080', 'M\u2081\u2081', 'M\u2081\u2082', 'M\u2081\u2083'],
  ['M\u2082\u2080', 'M\u2082\u2081', 'M\u2082\u2082', 'M\u2082\u2083'],
  ['M\u2083\u2080', 'M\u2083\u2081', 'M\u2083\u2082', 'M\u2083\u2083'],
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
  const dt = useDemoTheme()
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
      <rect x="0" y="0" width="220" height="220" fill={dt.canvasBg} rx="12" />

      {/* Microscopy field border */}
      <circle
        cx="110"
        cy="110"
        r="95"
        fill="none"
        stroke={dt.gridLineColor}
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
      <text x="110" y="215" textAnchor="middle" fill={dt.textMuted} fontSize="10">
        {'\u89C6\u573A'}: 100 {'\u03BC'}m
      </text>
    </svg>
  )
}

// Mueller matrix display
function MuellerMatrixDisplay({
  matrix,
  highlight,
}: {
  matrix: number[][]
  highlight?: [number, number]
}) {
  const dt = useDemoTheme()
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {matrix.map((row, i) =>
        row.map((val, j) => (
          <motion.div
            key={`${i}-${j}`}
            className={`p-1.5 rounded-xl text-center font-mono text-xs ${highlight && highlight[0] === i && highlight[1] === j
                ? 'bg-cyan-600 text-white'
                : i === 0 || j === 0
                  ? `${dt.isDark ? 'bg-slate-700' : 'bg-slate-200'} text-cyan-400`
                  : `${dt.isDark ? 'bg-slate-800' : 'bg-slate-100'} ${dt.bodyClass}`
              }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            <div className={`text-[8px] ${dt.mutedTextClass}`}>{MUELLER_NAMES[i][j]}</div>
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
}: {
  label: string
  value: number
  max: number
  color: string
  unit?: string
}) {
  const dt = useDemoTheme()
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={dt.mutedTextClass}>{label}</span>
        <span className={`font-mono text-${color}-400`}>
          {value.toFixed(2)}{unit}
        </span>
      </div>
      <div className={`h-2 ${dt.barTrackClass} rounded-full overflow-hidden`}>
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
  const dt = useDemoTheme()
  const [sampleType, setSampleType] = useState<SampleType>('fiber')
  const [showOverlay, setShowOverlay] = useState(true)
  const [overlayType, setOverlayType] = useState<'retardance' | 'depol' | 'diattenuation'>('retardance')
  const [pixelSize, setPixelSize] = useState(8)
  const [highlightElement, _setHighlightElement] = useState<[number, number] | undefined>()

  const sample = SAMPLES[sampleType]
  const params = useMemo(() => calculatePolarizationParams(sample.muellerMatrix), [sample])

  return (
    <div className="space-y-5">
      {/* Header */}
      <DemoHeader
        title={'\u5168\u504F\u632F\u663E\u5FAE\u6210\u50CF'}
        subtitle={'Mueller\u77E9\u9635\u663E\u5FAE\u955C\u7684\u5DE5\u4F5C\u539F\u7406\u4E0E\u5E94\u7528'}
        gradient="purple"
      />

      {/* 统计数值卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label={'\u7EBF\u6027\u5EF6\u8FDF R'} value={isNaN(params.R) ? 'N/A' : `${params.R.toFixed(1)}\u00B0`} color="cyan" />
        <StatCard label={'\u9000\u504F\u632F\u6307\u6570'} value={params.depol.toFixed(3)} color="green" />
        <StatCard label={'\u4E8C\u5411\u8870\u51CF D'} value={params.D.toFixed(3)} color="orange" />
        <StatCard label={'\u504F\u632F\u5EA6 DOP'} value={params.dop.toFixed(3)} color="pink" />
      </div>

      {/* Main content */}
      <DemoMainLayout
        controlsWidth="wide"
        visualization={
          <div className="space-y-5">
            <VisualizationPanel variant="indigo">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-violet-400" />
                  <span className={`text-sm font-semibold ${dt.headingClass}`}>Mueller{'\u663E\u5FAE\u6210\u50CF'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className={`px-3 py-1.5 text-xs rounded-xl flex items-center gap-1.5 font-medium transition-colors ${showOverlay ? 'bg-violet-600 text-white shadow-md' : `${dt.isDark ? 'bg-slate-700 text-gray-400' : 'bg-slate-200 text-gray-500'}`
                      }`}
                  >
                    <Layers size={12} />
                    {'\u53E0\u52A0\u663E\u793A'}
                  </button>
                </div>
              </div>
              <MicroscopyImage
                sample={sampleType}
                showOverlay={showOverlay}
                overlayType={overlayType}
                pixelSize={pixelSize}
              />
            </VisualizationPanel>

            {/* Overlay type selector */}
            {showOverlay && (
              <div className="flex gap-2 justify-center">
                {[
                  { type: 'retardance' as const, label: '\u5EF6\u8FDF', color: 'cyan' },
                  { type: 'depol' as const, label: '\u9000\u504F\u632F', color: 'green' },
                  { type: 'diattenuation' as const, label: '\u4E8C\u5411\u8870\u51CF', color: 'orange' },
                ].map(({ type, label, color }) => (
                  <button
                    key={type}
                    onClick={() => setOverlayType(type)}
                    className={`px-4 py-2 text-xs rounded-2xl font-medium transition-colors ${overlayType === type
                        ? `bg-${color}-600 text-white shadow-md`
                        : `${dt.isDark ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-600' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Polarization parameters chart */}
            <ChartPanel title={'\u504F\u632F\u53C2\u6570\u63D0\u53D6'} subtitle={sample.nameZh}>
              <div className="flex items-center gap-2 mb-3">
                <Grid3X3 size={14} className="text-violet-400" />
                <span className={`text-[11px] ${dt.mutedTextClass}`}>{sample.descriptionZh}</span>
              </div>
              <div className="space-y-3">
                <ParamBar label={'\u7EBF\u6027\u5EF6\u8FDF R'} value={params.R} max={180} color="cyan" unit={'\u00B0'} />
                <ParamBar label={'\u9000\u504F\u632F\u6307\u6570'} value={params.depol} max={1} color="green" />
                <ParamBar label={'\u4E8C\u5411\u8870\u51CF D'} value={params.D} max={1} color="orange" />
                <ParamBar label={'\u504F\u632F\u5EA6 DOP'} value={params.dop} max={1} color="pink" />
              </div>
            </ChartPanel>
          </div>
        }
        controls={
          <div className="space-y-5">
            {/* Sample selector */}
            <ControlPanel title={'\u6837\u54C1\u9009\u62E9'}>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SAMPLES) as SampleType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSampleType(type)}
                    className={`p-3 rounded-2xl text-left transition-all ${sampleType === type
                        ? 'bg-violet-600/30 border-2 border-violet-500 shadow-md'
                        : `${dt.panelClass} border-2 border-transparent hover:border-slate-500/30`
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-inner"
                        style={{ backgroundColor: SAMPLES[type].color }}
                      />
                      <span className={`text-sm font-semibold ${dt.isDark ? 'text-white' : 'text-gray-800'}`}>
                        {SAMPLES[type].nameZh}
                      </span>
                    </div>
                    <p className={`text-[11px] ${dt.mutedTextClass} mt-1 leading-relaxed`}>
                      {SAMPLES[type].descriptionZh}
                    </p>
                  </button>
                ))}
              </div>
            </ControlPanel>

            {/* Mueller Matrix */}
            <ChartPanel title={'Mueller\u77E9\u9635'}>
              <MuellerMatrixDisplay
                matrix={sample.muellerMatrix}
                highlight={highlightElement}
              />
              <div className={`mt-3 space-y-1 text-xs ${dt.mutedTextClass}`}>
                <p>* M{'\u2080\u2080'}: {'\u603B\u5F3A\u5EA6\u900F\u8FC7\u7387'}</p>
                <p>* {'\u5BF9\u89D2\u5143\u7D20'}: {'\u504F\u632F\u4FDD\u6301\u7279\u6027'}</p>
                <p>* {'\u975E\u5BF9\u89D2\u5143\u7D20'}: {'\u504F\u632F\u8F6C\u6362\u7279\u6027'}</p>
              </div>
            </ChartPanel>

            {/* Display settings */}
            <ControlPanel title={'\u663E\u793A\u8BBE\u7F6E'}>
              <SliderControl
                label={'\u50CF\u7D20\u5C3A\u5BF8'}
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
            <ControlPanel title={'\u663E\u5FAE\u955C\u539F\u7406'}>
              <div className={`space-y-2.5 text-xs ${dt.bodyClass}`}>
                <div className={`p-3 ${dt.isDark ? 'bg-slate-900/50 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'} rounded-xl`}>
                  <span className="text-violet-400 font-semibold">{'\u7167\u660E\u81C2'}:</span>
                  <p className="mt-1 leading-relaxed">{'\u504F\u632F\u6001\u53D1\u751F\u5668'}(PSG){'\u4EA7\u751F'}4{'\u79CD\u5DF2\u77E5\u504F\u632F\u6001\u7167\u660E\u6837\u54C1'}</p>
                </div>
                <div className={`p-3 ${dt.isDark ? 'bg-slate-900/50 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'} rounded-xl`}>
                  <span className="text-violet-400 font-semibold">{'\u63A2\u6D4B\u81C2'}:</span>
                  <p className="mt-1 leading-relaxed">{'\u504F\u632F\u6001\u5206\u6790\u5668'}(PSA){'\u5206\u6790\u51FA\u5C04\u5149\u7684\u504F\u632F\u6001'}</p>
                </div>
                <div className={`p-3 ${dt.isDark ? 'bg-slate-900/50 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'} rounded-xl`}>
                  <span className="text-violet-400 font-semibold">{'\u6570\u636E\u5904\u7406'}:</span>
                  <p className="mt-1 leading-relaxed">16{'\u6B21\u6D4B\u91CF\u91CD\u5EFA\u5B8C\u6574'}4{'\u00D7'}4 Mueller{'\u77E9\u9635'}</p>
                </div>
              </div>
            </ControlPanel>
          </div>
        }
      />

      {/* Knowledge cards */}
      <InfoGrid columns={3}>
        <InfoCard title={'Mueller\u77E9\u9635\u663E\u5FAE\u955C'} color="purple">
          <p className={`text-xs ${dt.bodyClass}`}>
            {'\u901A\u8FC7\u6D4B\u91CF\u6837\u54C1\u7684\u5B8C\u6574'}4{'\u00D7'}4 Mueller{'\u77E9\u9635\uFF0C\u53EF\u4EE5\u83B7\u5F97\u6837\u54C1\u7684\u6240\u6709\u504F\u632F\u7279\u6027\u4FE1\u606F\uFF0C\u5305\u62EC\u53CC\u6298\u5C04\u3001\u4E8C\u5411\u8870\u51CF\u3001\u9000\u504F\u632F\u7B49\uFF0C\u662F\u6700\u5B8C\u5907\u7684\u504F\u632F\u6210\u50CF\u6280\u672F\u3002'}
          </p>
        </InfoCard>
        <InfoCard title={'\u751F\u7269\u533B\u5B66\u5E94\u7528'} color="orange">
          <p className={`text-xs ${dt.bodyClass}`}>
            {'\u7528\u4E8E\u80BF\u7624\u8FB9\u754C\u8BC6\u522B\u3001\u80F6\u539F\u7EA4\u7EF4\u53D6\u5411\u5206\u6790\u3001\u773C\u79D1\u89D2\u819C\u68C0\u6D4B\u7B49\u3002\u504F\u632F\u53C2\u6570\u53EF\u63D0\u4F9B\u7EC4\u7EC7\u5FAE\u7ED3\u6784\u7684\u5B9A\u91CF\u4FE1\u606F\uFF0C\u8F85\u52A9\u4E34\u5E8A\u8BCA\u65AD\u3002'}
          </p>
        </InfoCard>
        <InfoCard title={'\u6750\u6599\u8868\u5F81'} color="cyan">
          <p className={`text-xs ${dt.bodyClass}`}>
            {'\u5206\u6790\u6750\u6599\u5185\u90E8\u5E94\u529B\u5206\u5E03\u3001\u6DB2\u6676\u53D6\u5411\u3001\u8584\u819C\u539A\u5EA6\u7B49\u3002'}Mueller{'\u77E9\u9635\u5206\u89E3\u53EF\u63D0\u53D6\u53CC\u6298\u5C04\u3001\u65CB\u5149\u3001\u9000\u504F\u632F\u7B49\u72EC\u7ACB\u53C2\u6570\u3002'}
          </p>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
