/**
 * 穆勒矩阵演示 - Unit 5
 * 演示4×4矩阵如何描述光学元件对偏振态的变换
 * 重新设计：纯 DOM + SVG + Framer Motion，支持 i18n 和亮色/暗色主题
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SliderControl, ControlPanel, InfoCard, ValueDisplay } from '../DemoControls'

// 斯托克斯矢量类型
type StokesVector = [number, number, number, number]

// 穆勒矩阵类型
type MuellerMatrix = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
]

// 矩阵乘法：穆勒矩阵 × 斯托克斯矢量
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
  theme,
  t,
}: {
  element: OpticalElement
  angle: number
  inputStokes: StokesVector
  outputStokes: StokesVector
  theme: string
  t: (key: string) => string
}) {
  const width = 550
  const height = 200
  const elementInfo = ELEMENT_KEYS[element]

  // 光束强度决定透明度
  const outputIntensity = outputStokes[0]

  // 偏振方向计算
  const inputAngle = Math.atan2(inputStokes[2], inputStokes[1]) / 2
  const outputAngle = outputStokes[0] > 0.01
    ? Math.atan2(outputStokes[2], outputStokes[1]) / 2
    : 0

  const bgColor = theme === 'dark' ? '#0f172a' : '#f1f5f9'
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b'
  const boxBgColor = theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[200px]">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={10} />

      {/* 光源 */}
      <g transform="translate(45, 100)">
        <motion.circle
          r={20}
          fill="#fbbf24"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle r={12} fill="#fef3c7" />
        <text y={38} textAnchor="middle" fill={textColor} fontSize={10}>{t('demos.mueller.ui.lightSource')}</text>
      </g>

      {/* 入射光束 */}
      <motion.line
        x1={70}
        y1={100}
        x2={190}
        y2={100}
        stroke="#fbbf24"
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* 入射偏振状态指示器 */}
      <g transform="translate(130, 55)">
        <rect x={-30} y={-20} width={60} height={40} rx={6} fill={boxBgColor} />
        <text y={-6} textAnchor="middle" fill={textColor} fontSize={9}>{t('demos.mueller.ui.inputPolarization')}</text>
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
          <circle cx={0} cy={8} r={12} fill="none" stroke={inputStokes[3] > 0 ? '#22d3ee' : '#f472b6'} strokeWidth={1.5} />
        )}
      </g>

      {/* 光学元件 */}
      <g transform="translate(260, 100)">
        {/* 元件外框 */}
        <motion.rect
          x={-32}
          y={-48}
          width={64}
          height={96}
          rx={8}
          fill={elementInfo.color}
          fillOpacity={0.2}
          stroke={elementInfo.color}
          strokeWidth={1.5}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* 轴向指示 */}
        <motion.line
          x1={-24 * Math.cos(angle * Math.PI / 180)}
          y1={-24 * Math.sin(angle * Math.PI / 180)}
          x2={24 * Math.cos(angle * Math.PI / 180)}
          y2={24 * Math.sin(angle * Math.PI / 180)}
          stroke={elementInfo.color}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* 元件符号 */}
        <circle r={16} fill={elementInfo.color} fillOpacity={0.3} />
        <text textAnchor="middle" dominantBaseline="middle" fill={elementInfo.color} fontSize={13} fontWeight="bold">
          {elementInfo.symbol}
        </text>

        {/* 标签 */}
        <text y={68} textAnchor="middle" fill={elementInfo.color} fontSize={10} fontWeight="medium">
          {t(elementInfo.i18nKey)}
        </text>
        <text y={80} textAnchor="middle" fill={textColor} fontSize={9}>
          θ = {angle}°
        </text>
      </g>

      {/* 出射光束 */}
      <motion.line
        x1={310}
        y1={100}
        x2={430}
        y2={100}
        stroke="#fbbf24"
        strokeWidth={Math.max(2, 5 * outputIntensity)}
        strokeLinecap="round"
        opacity={Math.max(0.3, outputIntensity)}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* 输出偏振状态指示器 */}
      <g transform="translate(370, 55)">
        <rect x={-30} y={-20} width={60} height={40} rx={6} fill={boxBgColor} />
        <text y={-6} textAnchor="middle" fill={textColor} fontSize={9}>{t('demos.mueller.ui.outputPolarization')}</text>
        {outputIntensity > 0.01 && (
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
              <circle cx={0} cy={8} r={12} fill="none" stroke={outputStokes[3] > 0 ? '#22d3ee' : '#f472b6'} strokeWidth={1.5} />
            )}
          </>
        )}
        {outputIntensity < 0.01 && (
          <text y={10} textAnchor="middle" fill="#ef4444" fontSize={9}>{t('demos.mueller.ui.extinction')}</text>
        )}
      </g>

      {/* 屏幕 */}
      <g transform="translate(480, 100)">
        <motion.rect
          x={-12}
          y={-40}
          width={24}
          height={80}
          rx={3}
          fill="#ffffff"
          animate={{ opacity: [0.3 + outputIntensity * 0.7, 0.5 + outputIntensity * 0.5, 0.3 + outputIntensity * 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text y={55} textAnchor="middle" fill={textColor} fontSize={10}>{t('demos.mueller.ui.screen')}</text>
        <text y={68} textAnchor="middle" fill="#22d3ee" fontSize={9}>
          I = {(outputIntensity * 100).toFixed(0)}%
        </text>
      </g>

      {/* 公式标注 */}
      <text x={260} y={190} textAnchor="middle" fill="#f59e0b" fontSize={12} fontWeight="bold" fontFamily="monospace">
        S_out = M × S_in
      </text>
    </svg>
  )
}

// 穆勒矩阵显示
function MatrixDisplay({ matrix, element, angle, theme, t }: {
  matrix: MuellerMatrix
  element: OpticalElement
  angle: number
  theme: string
  t: (key: string) => string
}) {
  const elementInfo = ELEMENT_KEYS[element]

  return (
    <div className={cn(
      'rounded-xl border p-3',
      theme === 'dark'
        ? 'bg-slate-900/50 border-cyan-400/20'
        : 'bg-white border-cyan-200 shadow-sm'
    )}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={cn(
          'text-sm font-medium',
          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
        )}>{t('demos.mueller.ui.muellerMatrix')}</h4>
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ backgroundColor: `${elementInfo.color}20`, color: elementInfo.color }}
        >
          {t(elementInfo.i18nKey)} @ {angle}°
        </span>
      </div>
      <div className="flex items-center justify-center gap-1">
        <span className={cn(
          'text-xl font-light',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>[</span>
        <div className="grid grid-cols-4 gap-0.5">
          {matrix.flat().map((val, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-11 h-6 flex items-center justify-center text-[10px] font-mono rounded',
                Math.abs(val) > 0.01
                  ? val > 0
                    ? theme === 'dark' ? 'text-cyan-400 bg-cyan-400/10' : 'text-cyan-600 bg-cyan-100'
                    : theme === 'dark' ? 'text-pink-400 bg-pink-400/10' : 'text-pink-600 bg-pink-100'
                  : theme === 'dark' ? 'text-gray-600 bg-slate-800/50' : 'text-gray-400 bg-gray-100'
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              {val.toFixed(2)}
            </motion.div>
          ))}
        </div>
        <span className={cn(
          'text-xl font-light',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>]</span>
      </div>
    </div>
  )
}

// 斯托克斯矢量对比显示
function StokesComparisonDisplay({
  inputStokes,
  outputStokes,
  theme,
  t,
}: {
  inputStokes: StokesVector
  outputStokes: StokesVector
  theme: string
  t: (key: string) => string
}) {
  const labels = ['S₀', 'S₁', 'S₂', 'S₃']
  const colors = ['#ffffff', '#ef4444', '#22c55e', '#3b82f6']

  return (
    <div className={cn(
      'rounded-xl border p-3',
      theme === 'dark'
        ? 'bg-slate-900/50 border-cyan-400/20'
        : 'bg-white border-cyan-200 shadow-sm'
    )}>
      <h4 className={cn(
        'text-sm font-medium mb-2',
        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
      )}>{t('demos.mueller.ui.stokesTransform')}</h4>
      <div className="grid grid-cols-2 gap-3">
        {/* 输入 */}
        <div>
          <div className={cn(
            'text-[10px] mb-1.5 text-center',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>{t('demos.mueller.ui.inputStokes')}</div>
          <div className="space-y-1.5">
            {inputStokes.map((val, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-6 text-[10px] font-mono" style={{ color: i === 0 ? (theme === 'dark' ? '#fff' : '#333') : colors[i] }}>{labels[i]}</span>
                <div className={cn(
                  'flex-1 h-1.5 rounded-full overflow-hidden',
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                )}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: i === 0 ? (theme === 'dark' ? '#fff' : '#333') : colors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(val) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="w-10 text-[10px] font-mono text-right" style={{ color: i === 0 ? (theme === 'dark' ? '#fff' : '#333') : colors[i] }}>
                  {val >= 0 ? '+' : ''}{val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 输出 */}
        <div>
          <div className={cn(
            'text-[10px] mb-1.5 text-center',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>{t('demos.mueller.ui.outputStokes')}</div>
          <div className="space-y-1.5">
            {outputStokes.map((val, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-6 text-[10px] font-mono" style={{ color: i === 0 ? (theme === 'dark' ? '#fff' : '#333') : colors[i] }}>{labels[i]}</span>
                <div className={cn(
                  'flex-1 h-1.5 rounded-full overflow-hidden',
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                )}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: i === 0 ? (theme === 'dark' ? '#fff' : '#333') : colors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(val), 1) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
                <span className="w-10 text-[10px] font-mono text-right" style={{ color: i === 0 ? (theme === 'dark' ? '#fff' : '#333') : colors[i] }}>
                  {val >= 0 ? '+' : ''}{val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 主演示组件
export function MuellerMatrixDemo() {
  const { t } = useTranslation()
  const { theme } = useTheme()
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

  return (
    <div className="flex flex-col gap-4">
      {/* 标题 */}
      <div className="text-center">
        <h2 className={cn(
          'text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
          theme === 'dark'
            ? 'from-cyan-400 to-pink-500'
            : 'from-cyan-600 to-pink-600'
        )}>
          {t('demos.mueller.demoTitle')}
        </h2>
        <p className={cn(
          'text-xs mt-0.5',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )}>{t('demos.mueller.demoSubtitle')}</p>
      </div>

      {/* 光路可视化 - 紧凑 */}
      <div className={cn(
        'rounded-xl border p-3',
        theme === 'dark'
          ? 'bg-slate-900/50 border-cyan-400/20'
          : 'bg-white border-cyan-200 shadow-sm'
      )}>
        <OpticalPathDiagram
          element={element}
          angle={angle}
          inputStokes={inputStokes}
          outputStokes={outputStokes}
          theme={theme}
          t={t}
        />
      </div>

      {/* 主要内容区 - 两列 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左侧：矩阵和矢量 */}
        <div className="space-y-3">
          {/* 穆勒矩阵 */}
          <MatrixDisplay matrix={matrix} element={element} angle={angle} theme={theme} t={t} />

          {/* 斯托克斯矢量对比 */}
          <StokesComparisonDisplay inputStokes={inputStokes} outputStokes={outputStokes} theme={theme} t={t} />
        </div>

        {/* 右侧：控制面板 */}
        <div className="space-y-3">
          <ControlPanel title={t('demos.mueller.ui.selectElement')}>
            <div className="grid grid-cols-5 gap-1.5">
              {elements.map((el) => {
                const info = ELEMENT_KEYS[el]
                return (
                  <button
                    key={el}
                    onClick={() => setElement(el)}
                    className={cn(
                      'p-1.5 rounded-lg text-center transition-all',
                      element === el
                        ? 'ring-2 ring-offset-1'
                        : theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                    )}
                    style={{
                      backgroundColor: element === el ? `${info.color}30` : theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 1)',
                      ['--tw-ring-color' as string]: info.color,
                      ['--tw-ring-offset-color' as string]: theme === 'dark' ? '#0f172a' : '#fff',
                    }}
                  >
                    <div
                      className="w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-0.5"
                      style={{ backgroundColor: `${info.color}40`, color: info.color }}
                    >
                      {info.symbol}
                    </div>
                    <div className={cn(
                      'text-[9px] truncate',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>{t(info.i18nKey)}</div>
                  </button>
                )
              })}
            </div>
            <SliderControl
              label={t('demos.mueller.ui.elementAngle')}
              value={angle}
              min={0}
              max={180}
              step={5}
              unit="°"
              onChange={setAngle}
              color="cyan"
            />
          </ControlPanel>

          <ControlPanel title={t('demos.mueller.ui.inputState')}>
            <div className="grid grid-cols-5 gap-1.5">
              {inputTypes.map((type) => {
                const info = INPUT_KEYS[type]
                return (
                  <button
                    key={type}
                    onClick={() => setInputType(type)}
                    className={cn(
                      'px-1 py-1.5 rounded text-[9px] transition-colors',
                      inputType === type
                        ? 'text-white'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                    style={{
                      backgroundColor: inputType === type ? info.color : undefined,
                    }}
                  >
                    {t(info.i18nKey)}
                  </button>
                )
              })}
            </div>
          </ControlPanel>

          <ControlPanel title={t('demos.mueller.ui.transformResult')}>
            <div className="grid grid-cols-2 gap-2">
              <ValueDisplay label={t('demos.mueller.ui.inputIntensity')} value={inputStokes[0].toFixed(2)} color="orange" />
              <ValueDisplay label={t('demos.mueller.ui.outputIntensity')} value={outputStokes[0].toFixed(2)} color="cyan" />
              <ValueDisplay label={t('demos.mueller.ui.inputDOP')} value={(inputDOP * 100).toFixed(0)} unit="%" />
              <ValueDisplay
                label={t('demos.mueller.ui.outputDOP')}
                value={(outputDOP * 100).toFixed(0)}
                unit="%"
                color={outputDOP > 0.99 ? 'green' : outputDOP > 0.5 ? 'orange' : 'red'}
              />
            </div>
            <div className={cn(
              'mt-2 p-2 rounded-lg text-center',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <div className={cn(
                'text-[10px] mb-0.5',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>{t('demos.mueller.ui.transmittance')}</div>
              <div className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                {(outputStokes[0] / inputStokes[0] * 100).toFixed(1)}%
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>

      {/* 底部知识卡片 - 紧凑 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InfoCard title={t('demos.mueller.ui.matrixProperties')} color="cyan">
          <ul className={cn(
            'text-xs space-y-0.5',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            <li>• <strong>{t('demos.mueller.ui.dimension')}:</strong> {t('demos.mueller.ui.dimensionDesc')}</li>
            <li>• <strong>{t('demos.mueller.ui.function')}:</strong> {t('demos.mueller.ui.functionDesc')}</li>
            <li>• <strong>{t('demos.mueller.ui.cascade')}:</strong> {t('demos.mueller.ui.cascadeDesc')}</li>
            <li>• <strong>{t('demos.mueller.ui.applicable')}:</strong> {t('demos.mueller.ui.applicableDesc')}</li>
          </ul>
        </InfoCard>

        <InfoCard title={t('demos.mueller.ui.commonMatrices')} color="purple">
          <ul className={cn(
            'text-xs space-y-0.5',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            <li>• <strong>{t('demos.mueller.elements.polarizer')} P:</strong> {t('demos.mueller.ui.polarizerDesc')}</li>
            <li>• <strong>{t('demos.mueller.elements.halfWave')} H:</strong> {t('demos.mueller.ui.halfWaveDesc')}</li>
            <li>• <strong>{t('demos.mueller.elements.quarterWave')} Q:</strong> {t('demos.mueller.ui.quarterWaveDesc')}</li>
            <li>• <strong>{t('demos.mueller.elements.rotator')} R:</strong> {t('demos.mueller.ui.rotatorDesc')}</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
