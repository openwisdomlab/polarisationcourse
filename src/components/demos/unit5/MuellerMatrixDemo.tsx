/**
 * 穆勒矩阵演示 - Unit 5
 * 演示4x4矩阵如何描述光学元件对偏振态的变换
 * 重新设计：使用 DemoLayout 统一布局组件，支持 i18n 和亮色/暗色主题
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { DemoHeader, VisualizationPanel, DemoMainLayout, InfoGrid, ChartPanel, StatCard, FormulaHighlight } from '../DemoLayout'
import { useDemoTheme } from '../demoThemeColors'

// 斯托克斯矢量类型
type StokesVector = [number, number, number, number]

// 穆勒矩阵类型
type MuellerMatrix = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
]

// 矩阵乘法：穆勒矩阵 x 斯托克斯矢量
function applyMueller(matrix: MuellerMatrix, stokes: StokesVector): StokesVector {
  return [
    matrix[0][0] * stokes[0] + matrix[0][1] * stokes[1] + matrix[0][2] * stokes[2] + matrix[0][3] * stokes[3],
    matrix[1][0] * stokes[0] + matrix[1][1] * stokes[1] + matrix[1][2] * stokes[2] + matrix[1][3] * stokes[3],
    matrix[2][0] * stokes[0] + matrix[2][1] * stokes[1] + matrix[2][2] * stokes[2] + matrix[2][3] * stokes[3],
    matrix[3][0] * stokes[0] + matrix[3][1] * stokes[1] + matrix[3][2] * stokes[2] + matrix[3][3] * stokes[3],
  ]
}

// 常见光学元件的穆勒矩阵
function getPolarizerMatrix(angle: number): MuellerMatrix {
  const theta = (angle * Math.PI) / 180
  const cos2 = Math.cos(2 * theta)
  const sin2 = Math.sin(2 * theta)

  return [
    [0.5, 0.5 * cos2, 0.5 * sin2, 0],
    [0.5 * cos2, 0.5 * cos2 * cos2, 0.5 * cos2 * sin2, 0],
    [0.5 * sin2, 0.5 * cos2 * sin2, 0.5 * sin2 * sin2, 0],
    [0, 0, 0, 0],
  ]
}

function getHalfWavePlateMatrix(angle: number): MuellerMatrix {
  const theta = (angle * Math.PI) / 180
  const cos4 = Math.cos(4 * theta)
  const sin4 = Math.sin(4 * theta)

  return [
    [1, 0, 0, 0],
    [0, cos4, sin4, 0],
    [0, sin4, -cos4, 0],
    [0, 0, 0, -1],
  ]
}

function getQuarterWavePlateMatrix(angle: number): MuellerMatrix {
  const theta = (angle * Math.PI) / 180
  const cos2 = Math.cos(2 * theta)
  const sin2 = Math.sin(2 * theta)

  return [
    [1, 0, 0, 0],
    [0, cos2 * cos2, cos2 * sin2, -sin2],
    [0, cos2 * sin2, sin2 * sin2, cos2],
    [0, sin2, -cos2, 0],
  ]
}

function getRotatorMatrix(angle: number): MuellerMatrix {
  const theta = (angle * Math.PI) / 180
  const cos2 = Math.cos(2 * theta)
  const sin2 = Math.sin(2 * theta)

  return [
    [1, 0, 0, 0],
    [0, cos2, sin2, 0],
    [0, -sin2, cos2, 0],
    [0, 0, 0, 1],
  ]
}

function getIdentityMatrix(): MuellerMatrix {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]
}

// 光学元件类型
type OpticalElement = 'polarizer' | 'half-wave' | 'quarter-wave' | 'rotator' | 'identity'

// 获取元件的穆勒矩阵
function getElementMatrix(element: OpticalElement, angle: number): MuellerMatrix {
  switch (element) {
    case 'polarizer':
      return getPolarizerMatrix(angle)
    case 'half-wave':
      return getHalfWavePlateMatrix(angle)
    case 'quarter-wave':
      return getQuarterWavePlateMatrix(angle)
    case 'rotator':
      return getRotatorMatrix(angle)
    case 'identity':
    default:
      return getIdentityMatrix()
  }
}

// 元件信息 - 使用 i18n key
const ELEMENT_KEYS: Record<OpticalElement, { i18nKey: string; color: string; symbol: string }> = {
  polarizer: { i18nKey: 'demos.mueller.elements.polarizer', color: '#22d3ee', symbol: 'P' },
  'half-wave': { i18nKey: 'demos.mueller.elements.halfWave', color: '#f472b6', symbol: 'H' },
  'quarter-wave': { i18nKey: 'demos.mueller.elements.quarterWave', color: '#a78bfa', symbol: 'Q' },
  rotator: { i18nKey: 'demos.mueller.elements.rotator', color: '#4ade80', symbol: 'R' },
  identity: { i18nKey: 'demos.mueller.elements.identity', color: '#6b7280', symbol: 'I' },
}

// 输入偏振类型
type InputType = 'horizontal' | 'vertical' | '45deg' | 'rcp' | 'unpolarized'

const INPUT_KEYS: Record<InputType, { i18nKey: string; stokes: StokesVector; color: string }> = {
  horizontal: { i18nKey: 'demos.mueller.inputs.horizontal', stokes: [1, 1, 0, 0], color: '#ef4444' },
  vertical: { i18nKey: 'demos.mueller.inputs.vertical', stokes: [1, -1, 0, 0], color: '#ef4444' },
  '45deg': { i18nKey: 'demos.mueller.inputs.deg45', stokes: [1, 0, 1, 0], color: '#22c55e' },
  rcp: { i18nKey: 'demos.mueller.inputs.rcp', stokes: [1, 0, 0, 1], color: '#3b82f6' },
  unpolarized: { i18nKey: 'demos.mueller.inputs.unpolarized', stokes: [1, 0, 0, 0], color: '#94a3b8' },
}

// 光路可视化
function OpticalPathDiagram({
  element,
  angle,
  inputStokes,
  outputStokes,
  t,
}: {
  element: OpticalElement
  angle: number
  inputStokes: StokesVector
  outputStokes: StokesVector
  t: (key: string) => string
}) {
  const dt = useDemoTheme()
  const width = 600
  const height = 220
  const elementInfo = ELEMENT_KEYS[element]

  // 光束强度决定透明度
  const outputIntensity = outputStokes[0]

  // 偏振方向计算
  const inputAngle = Math.atan2(inputStokes[2], inputStokes[1]) / 2
  const outputAngle = outputStokes[0] > 0.01
    ? Math.atan2(outputStokes[2], outputStokes[1]) / 2
    : 0

  const bgColor = dt.canvasBg
  const textColor = dt.textSecondary
  const boxBgColor = dt.isDark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.85)'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[220px]">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={12} />

      {/* 光源 */}
      <g transform="translate(55, 105)">
        <motion.circle
          r={22}
          fill="#fbbf24"
          fillOpacity={0.25}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          r={16}
          fill="#fbbf24"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle r={10} fill="#fef3c7" />
        <text y={40} textAnchor="middle" fill={textColor} fontSize={10} fontWeight="500">
          {t('demos.mueller.ui.lightSource')}
        </text>
      </g>

      {/* 入射光束 */}
      <motion.line
        x1={80}
        y1={105}
        x2={200}
        y2={105}
        stroke="url(#beamGradientIn)"
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* 入射偏振状态指示器 */}
      <g transform="translate(140, 52)">
        <rect x={-34} y={-22} width={68} height={44} rx={8} fill={boxBgColor}
          stroke={dt.isDark ? 'rgba(100,150,255,0.1)' : 'rgba(100,150,255,0.15)'} strokeWidth={1} />
        <text y={-8} textAnchor="middle" fill={textColor} fontSize={9} fontWeight="500">
          {t('demos.mueller.ui.inputPolarization')}
        </text>
        {/* 偏振方向线 */}
        <motion.line
          x1={-15 * Math.cos(inputAngle)}
          y1={-15 * Math.sin(inputAngle)}
          x2={15 * Math.cos(inputAngle)}
          y2={15 * Math.sin(inputAngle)}
          stroke="#fbbf24"
          strokeWidth={2.5}
          strokeLinecap="round"
          transform="translate(0, 8)"
        />
        {inputStokes[3] !== 0 && (
          <circle cx={0} cy={8} r={12} fill="none"
            stroke={inputStokes[3] > 0 ? '#22d3ee' : '#f472b6'}
            strokeWidth={1.5} strokeDasharray="3,2" />
        )}
      </g>

      {/* 光学元件 */}
      <g transform="translate(280, 105)">
        {/* 元件外框 */}
        <motion.rect
          x={-36}
          y={-52}
          width={72}
          height={104}
          rx={10}
          fill={elementInfo.color}
          fillOpacity={0.12}
          stroke={elementInfo.color}
          strokeWidth={1.5}
          strokeOpacity={0.6}
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        {/* 轴向指示 */}
        <motion.line
          x1={-26 * Math.cos(angle * Math.PI / 180)}
          y1={-26 * Math.sin(angle * Math.PI / 180)}
          x2={26 * Math.cos(angle * Math.PI / 180)}
          y2={26 * Math.sin(angle * Math.PI / 180)}
          stroke={elementInfo.color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeOpacity={0.8}
        />

        {/* 元件符号 */}
        <circle r={18} fill={elementInfo.color} fillOpacity={0.2}
          stroke={elementInfo.color} strokeWidth={1} strokeOpacity={0.3} />
        <text textAnchor="middle" dominantBaseline="middle"
          fill={elementInfo.color} fontSize={14} fontWeight="bold">
          {elementInfo.symbol}
        </text>

        {/* 标签 */}
        <text y={72} textAnchor="middle" fill={elementInfo.color} fontSize={10} fontWeight="600">
          {t(elementInfo.i18nKey)}
        </text>
        <text y={86} textAnchor="middle" fill={textColor} fontSize={9} fontFamily="monospace">
          {'\u03B8'} = {angle}{'\u00B0'}
        </text>
      </g>

      {/* 出射光束 */}
      <motion.line
        x1={330}
        y1={105}
        x2={460}
        y2={105}
        stroke="url(#beamGradientOut)"
        strokeWidth={Math.max(2, 5 * outputIntensity)}
        strokeLinecap="round"
        opacity={Math.max(0.3, outputIntensity)}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* 输出偏振状态指示器 */}
      <g transform="translate(400, 52)">
        <rect x={-34} y={-22} width={68} height={44} rx={8} fill={boxBgColor}
          stroke={dt.isDark ? 'rgba(100,150,255,0.1)' : 'rgba(100,150,255,0.15)'} strokeWidth={1} />
        <text y={-8} textAnchor="middle" fill={textColor} fontSize={9} fontWeight="500">
          {t('demos.mueller.ui.outputPolarization')}
        </text>
        {outputIntensity > 0.01 ? (
          <>
            <motion.line
              x1={-15 * Math.cos(outputAngle)}
              y1={-15 * Math.sin(outputAngle)}
              x2={15 * Math.cos(outputAngle)}
              y2={15 * Math.sin(outputAngle)}
              stroke="#22d3ee"
              strokeWidth={2.5}
              strokeLinecap="round"
              transform="translate(0, 8)"
            />
            {outputStokes[3] !== 0 && Math.abs(outputStokes[3]) > 0.01 && (
              <circle cx={0} cy={8} r={12} fill="none"
                stroke={outputStokes[3] > 0 ? '#22d3ee' : '#f472b6'}
                strokeWidth={1.5} strokeDasharray="3,2" />
            )}
          </>
        ) : (
          <text y={10} textAnchor="middle" fill="#ef4444" fontSize={9} fontWeight="500">
            {t('demos.mueller.ui.extinction')}
          </text>
        )}
      </g>

      {/* 屏幕/检测器 */}
      <g transform="translate(520, 105)">
        <motion.rect
          x={-14}
          y={-44}
          width={28}
          height={88}
          rx={5}
          fill={dt.isDark ? '#1e293b' : '#e2e8f0'}
          stroke={dt.isDark ? '#334155' : '#cbd5e1'}
          strokeWidth={1}
        />
        <motion.rect
          x={-10}
          y={-40}
          width={20}
          height={80}
          rx={3}
          fill="#ffffff"
          animate={{
            opacity: [0.3 + outputIntensity * 0.7, 0.5 + outputIntensity * 0.5, 0.3 + outputIntensity * 0.7],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text y={60} textAnchor="middle" fill={textColor} fontSize={10} fontWeight="500">
          {t('demos.mueller.ui.screen')}
        </text>
        <text y={74} textAnchor="middle" fill="#22d3ee" fontSize={10} fontWeight="600" fontFamily="monospace">
          I = {(outputIntensity * 100).toFixed(0)}%
        </text>
      </g>

      {/* 渐变定义 */}
      <defs>
        <linearGradient id="beamGradientIn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="beamGradientOut" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// 穆勒矩阵显示
function MatrixDisplay({ matrix, element, angle, t }: {
  matrix: MuellerMatrix
  element: OpticalElement
  angle: number
  t: (key: string) => string
}) {
  const dt = useDemoTheme()
  const elementInfo = ELEMENT_KEYS[element]

  return (
    <ChartPanel
      title={t('demos.mueller.ui.muellerMatrix')}
      subtitle={`${t(elementInfo.i18nKey)} @ ${angle}\u00B0`}
    >
      <div className="flex items-center justify-center gap-2 py-1">
        {/* 左括号 */}
        <svg width="8" height="80" viewBox="0 0 8 80">
          <path d="M7,2 Q2,2 2,10 L2,70 Q2,78 7,78"
            fill="none" stroke={dt.isDark ? '#475569' : '#94a3b8'} strokeWidth={1.5} />
        </svg>

        <div className="grid grid-cols-4 gap-1">
          {matrix.flat().map((val, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-14 h-7 flex items-center justify-center text-xs font-mono rounded-lg',
                'transition-colors duration-200',
                Math.abs(val) > 0.01
                  ? val > 0
                    ? dt.isDark ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/15' : 'text-cyan-700 bg-cyan-50 border border-cyan-200/50'
                    : dt.isDark ? 'text-pink-400 bg-pink-400/10 border border-pink-400/15' : 'text-pink-700 bg-pink-50 border border-pink-200/50'
                  : dt.isDark ? 'text-gray-600 bg-slate-800/40 border border-slate-700/30' : 'text-gray-500 bg-gray-50 border border-gray-200/50'
              )}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.025, duration: 0.3 }}
            >
              {val.toFixed(2)}
            </motion.div>
          ))}
        </div>

        {/* 右括号 */}
        <svg width="8" height="80" viewBox="0 0 8 80">
          <path d="M1,2 Q6,2 6,10 L6,70 Q6,78 1,78"
            fill="none" stroke={dt.isDark ? '#475569' : '#94a3b8'} strokeWidth={1.5} />
        </svg>
      </div>

      {/* 矩阵标记 */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: `${elementInfo.color}25`, color: elementInfo.color }}
        >
          {elementInfo.symbol}
        </div>
        <span className={cn('text-xs font-mono', dt.mutedTextClass)}>
          M({'\u03B8'} = {angle}{'\u00B0'})
        </span>
      </div>
    </ChartPanel>
  )
}

// 斯托克斯矢量对比显示
function StokesComparisonDisplay({
  inputStokes,
  outputStokes,
  t,
}: {
  inputStokes: StokesVector
  outputStokes: StokesVector
  t: (key: string) => string
}) {
  const dt = useDemoTheme()
  const labels = ['S\u2080', 'S\u2081', 'S\u2082', 'S\u2083']
  const descriptions = [
    'Total Intensity',
    'H/V Linear',
    '\u00B145\u00B0 Linear',
    'R/L Circular',
  ]
  const colors = [
    dt.isDark ? '#e2e8f0' : '#334155',
    '#ef4444',
    '#22c55e',
    '#3b82f6',
  ]

  return (
    <ChartPanel title={t('demos.mueller.ui.stokesTransform')}>
      <div className="grid grid-cols-2 gap-4">
        {/* 输入 */}
        <div>
          <div className={cn(
            'text-[10px] font-semibold mb-2 text-center uppercase tracking-wider',
            dt.isDark ? 'text-amber-400/80' : 'text-amber-600/80'
          )}>
            {t('demos.mueller.ui.inputStokes')}
          </div>
          <div className="space-y-2">
            {inputStokes.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-start w-7">
                  <span className="text-[11px] font-mono font-bold" style={{ color: colors[i] }}>
                    {labels[i]}
                  </span>
                </div>
                <div className={cn(
                  'flex-1 h-2 rounded-full overflow-hidden',
                  dt.isDark ? 'bg-slate-700/60' : 'bg-gray-200/80'
                )}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(val) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="w-12 text-[11px] font-mono text-right font-semibold" style={{ color: colors[i] }}>
                  {val >= 0 ? '+' : ''}{val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 分隔线 + 箭头 (隐藏在小屏幕) */}

        {/* 输出 */}
        <div>
          <div className={cn(
            'text-[10px] font-semibold mb-2 text-center uppercase tracking-wider',
            dt.isDark ? 'text-cyan-400/80' : 'text-cyan-600/80'
          )}>
            {t('demos.mueller.ui.outputStokes')}
          </div>
          <div className="space-y-2">
            {outputStokes.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-start w-7">
                  <span className="text-[11px] font-mono font-bold" style={{ color: colors[i] }}>
                    {labels[i]}
                  </span>
                </div>
                <div className={cn(
                  'flex-1 h-2 rounded-full overflow-hidden',
                  dt.isDark ? 'bg-slate-700/60' : 'bg-gray-200/80'
                )}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(val), 1) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
                <span className="w-12 text-[11px] font-mono text-right font-semibold" style={{ color: colors[i] }}>
                  {val >= 0 ? '+' : ''}{val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stokes parameter labels */}
      <div className={cn(
        'mt-3 pt-2 border-t flex flex-wrap gap-x-4 gap-y-1 justify-center',
        dt.isDark ? 'border-slate-700/40' : 'border-slate-200/60'
      )}>
        {labels.map((label, i) => (
          <span key={i} className="text-[9px] font-mono" style={{ color: colors[i] }}>
            {label}: {descriptions[i]}
          </span>
        ))}
      </div>
    </ChartPanel>
  )
}

// 主演示组件
export function MuellerMatrixDemo() {
  const { t } = useTranslation()
  const dt = useDemoTheme()
  const [element, setElement] = useState<OpticalElement>('polarizer')
  const [angle, setAngle] = useState(0)
  const [inputType, setInputType] = useState<InputType>('horizontal')

  // 输入斯托克斯矢量
  const inputStokes = INPUT_KEYS[inputType].stokes

  // 获取穆勒矩阵
  const matrix = getElementMatrix(element, angle)

  // 计算输出斯托克斯矢量
  const outputStokes = applyMueller(matrix, inputStokes)

  // 计算偏振度
  const inputDOP = Math.sqrt(inputStokes[1] ** 2 + inputStokes[2] ** 2 + inputStokes[3] ** 2) / inputStokes[0]
  const outputDOP =
    outputStokes[0] > 0.001
      ? Math.sqrt(outputStokes[1] ** 2 + outputStokes[2] ** 2 + outputStokes[3] ** 2) / outputStokes[0]
      : 0

  // 元件选项
  const elements: OpticalElement[] = ['polarizer', 'half-wave', 'quarter-wave', 'rotator', 'identity']
  const inputTypes: InputType[] = ['horizontal', 'vertical', '45deg', 'rcp', 'unpolarized']

  const transmittance = (outputStokes[0] / inputStokes[0]) * 100

  return (
    <div className="flex flex-col gap-5">
      {/* 标题区 */}
      <DemoHeader
        title={t('demos.mueller.demoTitle')}
        subtitle={t('demos.mueller.demoSubtitle')}
        badge="4x4"
        gradient="cyan"
      />

      {/* 核心公式 */}
      <FormulaHighlight
        formula="S'  =  M  \u00D7  S"
        description={t('demos.mueller.ui.stokesTransform')}
      />

      {/* 光路可视化 */}
      <VisualizationPanel variant="default">
        <OpticalPathDiagram
          element={element}
          angle={angle}
          inputStokes={inputStokes}
          outputStokes={outputStokes}
          t={t}
        />
      </VisualizationPanel>

      {/* 主要内容区 - 两栏布局 */}
      <DemoMainLayout
        controlsWidth="wide"
        visualization={
          <div className="space-y-4">
            {/* 穆勒矩阵 */}
            <MatrixDisplay matrix={matrix} element={element} angle={angle} t={t} />

            {/* 斯托克斯矢量对比 */}
            <StokesComparisonDisplay inputStokes={inputStokes} outputStokes={outputStokes} t={t} />
          </div>
        }
        controls={
          <div className="space-y-4">
            {/* 元件选择 */}
            <ControlPanel title={t('demos.mueller.ui.selectElement')}>
              <div className="grid grid-cols-5 gap-1.5">
                {elements.map((el) => {
                  const info = ELEMENT_KEYS[el]
                  const isActive = element === el
                  return (
                    <button
                      key={el}
                      onClick={() => setElement(el)}
                      className={cn(
                        'p-2 rounded-xl text-center transition-all duration-200',
                        isActive
                          ? 'ring-2 ring-offset-1 shadow-md'
                          : dt.isDark ? 'hover:bg-slate-700/60' : 'hover:bg-gray-100'
                      )}
                      style={{
                        backgroundColor: isActive ? `${info.color}20` : dt.isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 1)',
                        ['--tw-ring-color' as string]: info.color,
                        ['--tw-ring-offset-color' as string]: dt.isDark ? '#0f172a' : '#fff',
                      }}
                    >
                      <div
                        className="w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-transform"
                        style={{
                          backgroundColor: `${info.color}30`,
                          color: info.color,
                          transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {info.symbol}
                      </div>
                      <div className={cn(
                        'text-[9px] truncate font-medium',
                        dt.isDark ? 'text-gray-300' : 'text-gray-600'
                      )}>
                        {t(info.i18nKey)}
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="mt-2">
                <SliderControl
                  label={t('demos.mueller.ui.elementAngle')}
                  value={angle}
                  min={0}
                  max={180}
                  step={5}
                  unit={'\u00B0'}
                  onChange={setAngle}
                  color="cyan"
                />
              </div>
            </ControlPanel>

            {/* 输入偏振态选择 */}
            <ControlPanel title={t('demos.mueller.ui.inputState')}>
              <div className="grid grid-cols-5 gap-1.5">
                {inputTypes.map((type) => {
                  const info = INPUT_KEYS[type]
                  const isActive = inputType === type
                  return (
                    <button
                      key={type}
                      onClick={() => setInputType(type)}
                      className={cn(
                        'px-1.5 py-2 rounded-lg text-[10px] font-medium transition-all duration-200',
                        isActive
                          ? 'text-white shadow-md'
                          : dt.isDark
                            ? 'bg-slate-700/40 text-gray-300 hover:bg-slate-600/60'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                      style={{
                        backgroundColor: isActive ? info.color : undefined,
                      }}
                    >
                      {t(info.i18nKey)}
                    </button>
                  )
                })}
              </div>
            </ControlPanel>

            {/* 变换结果 */}
            <ChartPanel title={t('demos.mueller.ui.transformResult')}>
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  label={t('demos.mueller.ui.inputIntensity')}
                  value={inputStokes[0].toFixed(2)}
                  color="orange"
                />
                <StatCard
                  label={t('demos.mueller.ui.outputIntensity')}
                  value={outputStokes[0].toFixed(2)}
                  color="cyan"
                />
                <StatCard
                  label={t('demos.mueller.ui.inputDOP')}
                  value={(inputDOP * 100).toFixed(0)}
                  unit="%"
                  color="purple"
                />
                <StatCard
                  label={t('demos.mueller.ui.outputDOP')}
                  value={(outputDOP * 100).toFixed(0)}
                  unit="%"
                  color={outputDOP > 0.99 ? 'green' : outputDOP > 0.5 ? 'orange' : 'red'}
                />
              </div>

              {/* 透过率 */}
              <div className={cn(
                'mt-3 p-3 rounded-2xl text-center',
                dt.isDark
                  ? 'bg-gradient-to-r from-cyan-900/15 via-slate-800/40 to-cyan-900/15 border border-cyan-500/10'
                  : 'bg-gradient-to-r from-cyan-50/80 via-white to-cyan-50/80 border border-cyan-200/40'
              )}>
                <div className={cn(
                  'text-[10px] font-medium mb-0.5 uppercase tracking-wider',
                  dt.mutedTextClass
                )}>
                  {t('demos.mueller.ui.transmittance')}
                </div>
                <div className={cn(
                  'text-2xl font-bold font-mono',
                  dt.isDark ? 'text-cyan-400' : 'text-cyan-600'
                )}>
                  {transmittance.toFixed(1)}
                  <span className="text-sm font-normal ml-0.5 opacity-70">%</span>
                </div>
                {/* 透过率条 */}
                <div className={cn(
                  'mt-2 h-1.5 rounded-full overflow-hidden',
                  dt.isDark ? 'bg-slate-700/60' : 'bg-gray-200/80'
                )}>
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(transmittance, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </ChartPanel>
          </div>
        }
      />

      {/* 底部知识卡片 */}
      <InfoGrid columns={2}>
        <InfoCard title={t('demos.mueller.ui.matrixProperties')} color="cyan">
          <ul className={cn(
            'text-xs space-y-1',
            dt.bodyClass
          )}>
            <li className="flex gap-1.5">
              <span className={dt.isDark ? 'text-cyan-400' : 'text-cyan-600'}>--</span>
              <span><strong>{t('demos.mueller.ui.dimension')}:</strong> {t('demos.mueller.ui.dimensionDesc')}</span>
            </li>
            <li className="flex gap-1.5">
              <span className={dt.isDark ? 'text-cyan-400' : 'text-cyan-600'}>--</span>
              <span><strong>{t('demos.mueller.ui.function')}:</strong> {t('demos.mueller.ui.functionDesc')}</span>
            </li>
            <li className="flex gap-1.5">
              <span className={dt.isDark ? 'text-cyan-400' : 'text-cyan-600'}>--</span>
              <span><strong>{t('demos.mueller.ui.cascade')}:</strong> {t('demos.mueller.ui.cascadeDesc')}</span>
            </li>
            <li className="flex gap-1.5">
              <span className={dt.isDark ? 'text-cyan-400' : 'text-cyan-600'}>--</span>
              <span><strong>{t('demos.mueller.ui.applicable')}:</strong> {t('demos.mueller.ui.applicableDesc')}</span>
            </li>
          </ul>
        </InfoCard>

        <InfoCard title={t('demos.mueller.ui.commonMatrices')} color="purple">
          <ul className={cn(
            'text-xs space-y-1',
            dt.bodyClass
          )}>
            <li className="flex gap-1.5">
              <span className="text-cyan-400 font-bold font-mono">P</span>
              <span><strong>{t('demos.mueller.elements.polarizer')}:</strong> {t('demos.mueller.ui.polarizerDesc')}</span>
            </li>
            <li className="flex gap-1.5">
              <span className="text-pink-400 font-bold font-mono">H</span>
              <span><strong>{t('demos.mueller.elements.halfWave')}:</strong> {t('demos.mueller.ui.halfWaveDesc')}</span>
            </li>
            <li className="flex gap-1.5">
              <span className="text-purple-400 font-bold font-mono">Q</span>
              <span><strong>{t('demos.mueller.elements.quarterWave')}:</strong> {t('demos.mueller.ui.quarterWaveDesc')}</span>
            </li>
            <li className="flex gap-1.5">
              <span className="text-green-400 font-bold font-mono">R</span>
              <span><strong>{t('demos.mueller.elements.rotator')}:</strong> {t('demos.mueller.ui.rotatorDesc')}</span>
            </li>
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
