/**
 * 穆勒矩阵演示 - Unit 5
 * 演示4×4矩阵如何描述光学元件对偏振态的变换
 * 重新设计：纯 DOM + SVG + Framer Motion
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
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

// 元件信息
const ELEMENT_INFO: Record<OpticalElement, { name: string; color: string; symbol: string }> = {
  polarizer: { name: '偏振片', color: '#22d3ee', symbol: 'P' },
  'half-wave': { name: 'λ/2 波片', color: '#f472b6', symbol: 'H' },
  'quarter-wave': { name: 'λ/4 波片', color: '#a78bfa', symbol: 'Q' },
  rotator: { name: '旋光器', color: '#4ade80', symbol: 'R' },
  identity: { name: '无 (直通)', color: '#6b7280', symbol: 'I' },
}

// 输入偏振类型
type InputType = 'horizontal' | 'vertical' | '45deg' | 'rcp' | 'unpolarized'

const INPUT_INFO: Record<InputType, { name: string; stokes: StokesVector; color: string }> = {
  horizontal: { name: '水平偏振', stokes: [1, 1, 0, 0], color: '#ef4444' },
  vertical: { name: '垂直偏振', stokes: [1, -1, 0, 0], color: '#ef4444' },
  '45deg': { name: '+45°偏振', stokes: [1, 0, 1, 0], color: '#22c55e' },
  rcp: { name: '右旋圆偏振', stokes: [1, 0, 0, 1], color: '#3b82f6' },
  unpolarized: { name: '自然光', stokes: [1, 0, 0, 0], color: '#94a3b8' },
}

// 光路可视化
function OpticalPathDiagram({
  element,
  angle,
  inputStokes,
  outputStokes,
}: {
  element: OpticalElement
  angle: number
  inputStokes: StokesVector
  outputStokes: StokesVector
}) {
  const width = 600
  const height = 250
  const elementInfo = ELEMENT_INFO[element]

  // 光束强度决定透明度
  const inputIntensity = inputStokes[0]
  const outputIntensity = outputStokes[0]

  // 偏振方向计算
  const inputAngle = Math.atan2(inputStokes[2], inputStokes[1]) / 2
  const outputAngle = outputStokes[0] > 0.01
    ? Math.atan2(outputStokes[2], outputStokes[1]) / 2
    : 0

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="#0f172a" rx={12} />

      {/* 光源 */}
      <g transform="translate(50, 125)">
        <motion.circle
          r={25}
          fill="#fbbf24"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle r={15} fill="#fef3c7" />
        <text y={50} textAnchor="middle" fill="#94a3b8" fontSize={12}>光源</text>
      </g>

      {/* 入射光束 */}
      <motion.line
        x1={80}
        y1={125}
        x2={230}
        y2={125}
        stroke="#fbbf24"
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* 入射偏振状态指示器 */}
      <g transform="translate(155, 70)">
        <rect x={-35} y={-25} width={70} height={50} rx={8} fill="rgba(0,0,0,0.5)" />
        <text y={-8} textAnchor="middle" fill="#94a3b8" fontSize={10}>输入偏振</text>
        {/* 偏振方向线 */}
        <motion.line
          x1={-20 * Math.cos(inputAngle)}
          y1={-20 * Math.sin(inputAngle)}
          x2={20 * Math.cos(inputAngle)}
          y2={20 * Math.sin(inputAngle)}
          stroke="#fbbf24"
          strokeWidth={3}
          strokeLinecap="round"
          animate={{ rotate: 0 }}
        />
        {inputStokes[3] !== 0 && (
          <circle r={15} fill="none" stroke={inputStokes[3] > 0 ? '#22d3ee' : '#f472b6'} strokeWidth={2} />
        )}
      </g>

      {/* 光学元件 */}
      <g transform="translate(300, 125)">
        {/* 元件外框 */}
        <motion.rect
          x={-40}
          y={-60}
          width={80}
          height={120}
          rx={10}
          fill={elementInfo.color}
          fillOpacity={0.2}
          stroke={elementInfo.color}
          strokeWidth={2}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* 轴向指示 */}
        <motion.line
          x1={-30 * Math.cos(angle * Math.PI / 180)}
          y1={-30 * Math.sin(angle * Math.PI / 180)}
          x2={30 * Math.cos(angle * Math.PI / 180)}
          y2={30 * Math.sin(angle * Math.PI / 180)}
          stroke={elementInfo.color}
          strokeWidth={4}
          strokeLinecap="round"
          animate={{ rotate: 0 }}
        />

        {/* 元件符号 */}
        <circle r={20} fill={elementInfo.color} fillOpacity={0.3} />
        <text textAnchor="middle" dominantBaseline="middle" fill={elementInfo.color} fontSize={16} fontWeight="bold">
          {elementInfo.symbol}
        </text>

        {/* 标签 */}
        <text y={85} textAnchor="middle" fill={elementInfo.color} fontSize={12} fontWeight="medium">
          {elementInfo.name}
        </text>
        <text y={100} textAnchor="middle" fill="#64748b" fontSize={11}>
          θ = {angle}°
        </text>
      </g>

      {/* 出射光束 */}
      <motion.line
        x1={370}
        y1={125}
        x2={520}
        y2={125}
        stroke="#fbbf24"
        strokeWidth={Math.max(2, 6 * outputIntensity)}
        strokeLinecap="round"
        opacity={Math.max(0.3, outputIntensity)}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* 输出偏振状态指示器 */}
      <g transform="translate(445, 70)">
        <rect x={-35} y={-25} width={70} height={50} rx={8} fill="rgba(0,0,0,0.5)" />
        <text y={-8} textAnchor="middle" fill="#94a3b8" fontSize={10}>输出偏振</text>
        {outputIntensity > 0.01 && (
          <>
            <motion.line
              x1={-20 * Math.cos(outputAngle)}
              y1={-20 * Math.sin(outputAngle)}
              x2={20 * Math.cos(outputAngle)}
              y2={20 * Math.sin(outputAngle)}
              stroke="#22d3ee"
              strokeWidth={3}
              strokeLinecap="round"
              animate={{ rotate: 0 }}
            />
            {outputStokes[3] !== 0 && Math.abs(outputStokes[3]) > 0.01 && (
              <circle r={15} fill="none" stroke={outputStokes[3] > 0 ? '#22d3ee' : '#f472b6'} strokeWidth={2} />
            )}
          </>
        )}
        {outputIntensity < 0.01 && (
          <text y={10} textAnchor="middle" fill="#ef4444" fontSize={10}>消光</text>
        )}
      </g>

      {/* 屏幕 */}
      <g transform="translate(560, 125)">
        <motion.rect
          x={-15}
          y={-50}
          width={30}
          height={100}
          rx={4}
          fill="#ffffff"
          animate={{ opacity: [0.3 + outputIntensity * 0.7, 0.5 + outputIntensity * 0.5, 0.3 + outputIntensity * 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text y={70} textAnchor="middle" fill="#94a3b8" fontSize={12}>屏幕</text>
        <text y={85} textAnchor="middle" fill="#22d3ee" fontSize={11}>
          I = {(outputIntensity * 100).toFixed(0)}%
        </text>
      </g>

      {/* 公式标注 */}
      <text x={300} y={230} textAnchor="middle" fill="#f59e0b" fontSize={14} fontWeight="bold" fontFamily="monospace">
        S_out = M × S_in
      </text>
    </svg>
  )
}

// 穆勒矩阵显示
function MatrixDisplay({ matrix, element, angle }: { matrix: MuellerMatrix; element: OpticalElement; angle: number }) {
  const elementInfo = ELEMENT_INFO[element]

  return (
    <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-cyan-400">穆勒矩阵 M</h4>
        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${elementInfo.color}20`, color: elementInfo.color }}>
          {elementInfo.name} @ {angle}°
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl text-gray-500 font-light">[</span>
        <div className="grid grid-cols-4 gap-1">
          {matrix.flat().map((val, i) => (
            <motion.div
              key={i}
              className={`w-14 h-8 flex items-center justify-center text-xs font-mono rounded ${
                Math.abs(val) > 0.01
                  ? val > 0
                    ? 'text-cyan-400 bg-cyan-400/10'
                    : 'text-pink-400 bg-pink-400/10'
                  : 'text-gray-600 bg-slate-800/50'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              {val.toFixed(2)}
            </motion.div>
          ))}
        </div>
        <span className="text-2xl text-gray-500 font-light">]</span>
      </div>
    </div>
  )
}

// 斯托克斯矢量对比显示
function StokesComparisonDisplay({
  inputStokes,
  outputStokes,
}: {
  inputStokes: StokesVector
  outputStokes: StokesVector
}) {
  const labels = ['S₀', 'S₁', 'S₂', 'S₃']
  const colors = ['#ffffff', '#ef4444', '#22c55e', '#3b82f6']
  const descriptions = ['强度', 'H-V', '±45°', 'R-L']

  return (
    <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-4">
      <h4 className="text-sm font-medium text-cyan-400 mb-3">斯托克斯矢量变换</h4>
      <div className="grid grid-cols-2 gap-4">
        {/* 输入 */}
        <div>
          <div className="text-xs text-gray-400 mb-2 text-center">输入 S_in</div>
          <div className="space-y-2">
            {inputStokes.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 text-xs font-mono" style={{ color: colors[i] }}>{labels[i]}</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(val) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="w-12 text-xs font-mono text-right" style={{ color: colors[i] }}>
                  {val >= 0 ? '+' : ''}{val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 输出 */}
        <div>
          <div className="text-xs text-gray-400 mb-2 text-center">输出 S_out</div>
          <div className="space-y-2">
            {outputStokes.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 text-xs font-mono" style={{ color: colors[i] }}>{labels[i]}</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(val), 1) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
                <span className="w-12 text-xs font-mono text-right" style={{ color: colors[i] }}>
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
  const [element, setElement] = useState<OpticalElement>('polarizer')
  const [angle, setAngle] = useState(0)
  const [inputType, setInputType] = useState<InputType>('horizontal')

  // 输入斯托克斯矢量
  const inputStokes = INPUT_INFO[inputType].stokes

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
    <div className="flex flex-col gap-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          穆勒矩阵演示
        </h2>
        <p className="text-gray-400 text-sm mt-1">Mueller Matrix - 光学元件的偏振变换</p>
      </div>

      {/* 光路可视化 */}
      <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 p-4">
        <OpticalPathDiagram
          element={element}
          angle={angle}
          inputStokes={inputStokes}
          outputStokes={outputStokes}
        />
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：矩阵和矢量 */}
        <div className="space-y-4">
          {/* 穆勒矩阵 */}
          <MatrixDisplay matrix={matrix} element={element} angle={angle} />

          {/* 斯托克斯矢量对比 */}
          <StokesComparisonDisplay inputStokes={inputStokes} outputStokes={outputStokes} />
        </div>

        {/* 右侧：控制面板 */}
        <div className="space-y-4">
          <ControlPanel title="光学元件选择">
            <div className="grid grid-cols-5 gap-2">
              {elements.map((el) => {
                const info = ELEMENT_INFO[el]
                return (
                  <button
                    key={el}
                    onClick={() => setElement(el)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      element === el
                        ? 'ring-2 ring-offset-1 ring-offset-slate-900'
                        : 'hover:bg-slate-700'
                    }`}
                    style={{
                      backgroundColor: element === el ? `${info.color}30` : 'rgba(51, 65, 85, 0.5)',
                      ringColor: info.color,
                    }}
                  >
                    <div
                      className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-1"
                      style={{ backgroundColor: `${info.color}40`, color: info.color }}
                    >
                      {info.symbol}
                    </div>
                    <div className="text-xs text-gray-300">{info.name}</div>
                  </button>
                )
              })}
            </div>
            <SliderControl
              label="元件角度 θ"
              value={angle}
              min={0}
              max={180}
              step={5}
              unit="°"
              onChange={setAngle}
              color="cyan"
            />
          </ControlPanel>

          <ControlPanel title="输入偏振态">
            <div className="grid grid-cols-5 gap-2">
              {inputTypes.map((type) => {
                const info = INPUT_INFO[type]
                return (
                  <button
                    key={type}
                    onClick={() => setInputType(type)}
                    className={`px-2 py-2 rounded text-xs transition-colors ${
                      inputType === type
                        ? 'text-white'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                    }`}
                    style={{
                      backgroundColor: inputType === type ? info.color : undefined,
                    }}
                  >
                    {info.name}
                  </button>
                )
              })}
            </div>
          </ControlPanel>

          <ControlPanel title="变换结果">
            <div className="grid grid-cols-2 gap-4">
              <ValueDisplay label="输入强度" value={inputStokes[0].toFixed(2)} color="yellow" />
              <ValueDisplay label="输出强度" value={outputStokes[0].toFixed(2)} color="cyan" />
              <ValueDisplay label="输入偏振度" value={(inputDOP * 100).toFixed(0)} unit="%" />
              <ValueDisplay
                label="输出偏振度"
                value={(outputDOP * 100).toFixed(0)}
                unit="%"
                color={outputDOP > 0.99 ? 'green' : outputDOP > 0.5 ? 'yellow' : 'red'}
              />
            </div>
            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg text-center">
              <div className="text-xs text-gray-400 mb-1">透射率</div>
              <div className="text-2xl font-bold text-cyan-400">
                {(outputStokes[0] / inputStokes[0] * 100).toFixed(1)}%
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>

      {/* 底部知识卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="穆勒矩阵特性" color="cyan">
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• <strong>维度：</strong>4×4 实数矩阵</li>
            <li>• <strong>作用：</strong>描述光学元件对偏振态的线性变换</li>
            <li>• <strong>级联：</strong>M_total = M_n × ... × M_2 × M_1</li>
            <li>• <strong>适用：</strong>可处理部分偏振光和非偏振光</li>
          </ul>
        </InfoCard>

        <InfoCard title="常见穆勒矩阵" color="pink">
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• <strong>偏振片 P：</strong>产生线偏振光，强度减半</li>
            <li>• <strong>λ/2 波片 H：</strong>反转偏振方向，改变旋向</li>
            <li>• <strong>λ/4 波片 Q：</strong>线偏振 ↔ 圆偏振 转换</li>
            <li>• <strong>旋光器 R：</strong>旋转偏振面，保持偏振度</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  )
}
