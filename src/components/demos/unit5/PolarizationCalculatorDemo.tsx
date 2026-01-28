/**
 * 偏振计算器演示 - Unit 5
 * 综合性偏振计算工具：支持级联光学系统、多种矩阵表示、代码导出
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { DemoHeader, StatCard, InfoGrid, FormulaHighlight, ChartPanel } from '../DemoLayout'
import { Copy, Check, Code, Plus, Trash2, ChevronDown, ChevronUp, Download, RotateCcw, Calculator } from 'lucide-react'

// ==================== 类型定义 ====================

// 复数类型
interface Complex {
  re: number
  im: number
}

// Stokes 矢量
type StokesVector = [number, number, number, number]

// Mueller 矩阵
type MuellerMatrix = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
]

// Jones 矢量
type JonesVector = [Complex, Complex]

// Jones 矩阵
type JonesMatrix = [[Complex, Complex], [Complex, Complex]]

// 光学元件类型
type ElementType = 'polarizer' | 'half-wave' | 'quarter-wave' | 'rotator' | 'retarder'

// 光学元件配置
interface OpticalElement {
  id: string
  type: ElementType
  angle: number
  retardance?: number // 用于通用相位延迟器
}

// ==================== 复数运算 ====================

const complex = {
  create: (re: number, im: number = 0): Complex => ({ re, im }),
  add: (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im }),
  sub: (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im }),
  mul: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),
  scale: (a: Complex, s: number): Complex => ({ re: a.re * s, im: a.im * s }),
  abs: (a: Complex): number => Math.sqrt(a.re * a.re + a.im * a.im),
  phase: (a: Complex): number => Math.atan2(a.im, a.re),
  exp: (theta: number): Complex => ({ re: Math.cos(theta), im: Math.sin(theta) }),
  format: (c: Complex, decimals: number = 3): string => {
    const re = c.re.toFixed(decimals)
    const im = Math.abs(c.im).toFixed(decimals)
    if (Math.abs(c.im) < 0.0001) return re
    if (Math.abs(c.re) < 0.0001) return c.im >= 0 ? `${im}i` : `-${im}i`
    return c.im >= 0 ? `${re}+${im}i` : `${re}-${im}i`
  },
}

// ==================== Mueller 矩阵计算 ====================

function getMuellerPolarizer(angle: number): MuellerMatrix {
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

function getMuellerHalfWave(angle: number): MuellerMatrix {
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

function getMuellerQuarterWave(angle: number): MuellerMatrix {
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

function getMuellerRotator(angle: number): MuellerMatrix {
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

function getMuellerRetarder(angle: number, retardance: number): MuellerMatrix {
  const theta = (angle * Math.PI) / 180
  const delta = (retardance * Math.PI) / 180
  const cos2 = Math.cos(2 * theta)
  const sin2 = Math.sin(2 * theta)
  const cosD = Math.cos(delta)
  const sinD = Math.sin(delta)
  return [
    [1, 0, 0, 0],
    [0, cos2 * cos2 + sin2 * sin2 * cosD, cos2 * sin2 * (1 - cosD), -sin2 * sinD],
    [0, cos2 * sin2 * (1 - cosD), sin2 * sin2 + cos2 * cos2 * cosD, cos2 * sinD],
    [0, sin2 * sinD, -cos2 * sinD, cosD],
  ]
}

function getMuellerMatrix(element: OpticalElement): MuellerMatrix {
  switch (element.type) {
    case 'polarizer':
      return getMuellerPolarizer(element.angle)
    case 'half-wave':
      return getMuellerHalfWave(element.angle)
    case 'quarter-wave':
      return getMuellerQuarterWave(element.angle)
    case 'rotator':
      return getMuellerRotator(element.angle)
    case 'retarder':
      return getMuellerRetarder(element.angle, element.retardance || 90)
    default:
      return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
  }
}

function multiplyMueller(a: MuellerMatrix, b: MuellerMatrix): MuellerMatrix {
  const result: MuellerMatrix = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i][j] += a[i][k] * b[k][j]
      }
    }
  }
  return result
}

function applyMueller(matrix: MuellerMatrix, stokes: StokesVector): StokesVector {
  return [
    matrix[0][0] * stokes[0] + matrix[0][1] * stokes[1] + matrix[0][2] * stokes[2] + matrix[0][3] * stokes[3],
    matrix[1][0] * stokes[0] + matrix[1][1] * stokes[1] + matrix[1][2] * stokes[2] + matrix[1][3] * stokes[3],
    matrix[2][0] * stokes[0] + matrix[2][1] * stokes[1] + matrix[2][2] * stokes[2] + matrix[2][3] * stokes[3],
    matrix[3][0] * stokes[0] + matrix[3][1] * stokes[1] + matrix[3][2] * stokes[2] + matrix[3][3] * stokes[3],
  ]
}

// ==================== Jones 矩阵计算 ====================

function getJonesPolarizer(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [complex.create(c * c), complex.create(c * s)],
    [complex.create(c * s), complex.create(s * s)],
  ]
}

function getJonesHalfWave(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c2 = Math.cos(2 * theta)
  const s2 = Math.sin(2 * theta)
  return [
    [complex.create(c2), complex.create(s2)],
    [complex.create(s2), complex.create(-c2)],
  ]
}

function getJonesQuarterWave(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [complex.add(complex.create(c * c), complex.mul(complex.create(0, 1), complex.create(s * s))),
     complex.scale(complex.create(c * s), 1 - 0)], // simplified
    [complex.scale(complex.create(c * s), 1 - 0),
     complex.add(complex.create(s * s), complex.mul(complex.create(0, 1), complex.create(c * c)))],
  ]
}

function getJonesRotator(angle: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [complex.create(c), complex.create(-s)],
    [complex.create(s), complex.create(c)],
  ]
}

function getJonesRetarder(angle: number, retardance: number): JonesMatrix {
  const theta = (angle * Math.PI) / 180
  const delta = (retardance * Math.PI) / 180
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const expPos = complex.exp(delta / 2)
  const expNeg = complex.exp(-delta / 2)
  return [
    [complex.add(complex.scale(expPos, c * c), complex.scale(expNeg, s * s)),
     complex.scale(complex.sub(expPos, expNeg), c * s)],
    [complex.scale(complex.sub(expPos, expNeg), c * s),
     complex.add(complex.scale(expPos, s * s), complex.scale(expNeg, c * c))],
  ]
}

function getJonesMatrix(element: OpticalElement): JonesMatrix {
  switch (element.type) {
    case 'polarizer':
      return getJonesPolarizer(element.angle)
    case 'half-wave':
      return getJonesHalfWave(element.angle)
    case 'quarter-wave':
      return getJonesQuarterWave(element.angle)
    case 'rotator':
      return getJonesRotator(element.angle)
    case 'retarder':
      return getJonesRetarder(element.angle, element.retardance || 90)
    default:
      return [[complex.create(1), complex.create(0)], [complex.create(0), complex.create(1)]]
  }
}

function multiplyJones(a: JonesMatrix, b: JonesMatrix): JonesMatrix {
  return [
    [
      complex.add(complex.mul(a[0][0], b[0][0]), complex.mul(a[0][1], b[1][0])),
      complex.add(complex.mul(a[0][0], b[0][1]), complex.mul(a[0][1], b[1][1])),
    ],
    [
      complex.add(complex.mul(a[1][0], b[0][0]), complex.mul(a[1][1], b[1][0])),
      complex.add(complex.mul(a[1][0], b[0][1]), complex.mul(a[1][1], b[1][1])),
    ],
  ]
}

// ==================== 元件信息 ====================

const ELEMENT_INFO: Record<ElementType, { nameEn: string; nameZh: string; color: string; symbol: string }> = {
  polarizer: { nameEn: 'Polarizer', nameZh: '偏振片', color: '#22d3ee', symbol: 'P' },
  'half-wave': { nameEn: 'HWP', nameZh: '半波片', color: '#f472b6', symbol: 'H' },
  'quarter-wave': { nameEn: 'QWP', nameZh: '四分之一波片', color: '#a78bfa', symbol: 'Q' },
  rotator: { nameEn: 'Rotator', nameZh: '旋光器', color: '#4ade80', symbol: 'R' },
  retarder: { nameEn: 'Retarder', nameZh: '延迟器', color: '#f59e0b', symbol: '\u03B4' },
}

// 输入偏振态
type InputStateType = 'horizontal' | 'vertical' | '45deg' | '-45deg' | 'rcp' | 'lcp' | 'unpolarized'

const INPUT_STATES: Record<InputStateType, {
  nameEn: string
  nameZh: string
  stokes: StokesVector
  jones: JonesVector
  color: string
}> = {
  horizontal: {
    nameEn: 'H-Pol',
    nameZh: '水平',
    stokes: [1, 1, 0, 0],
    jones: [complex.create(1), complex.create(0)],
    color: '#ef4444',
  },
  vertical: {
    nameEn: 'V-Pol',
    nameZh: '垂直',
    stokes: [1, -1, 0, 0],
    jones: [complex.create(0), complex.create(1)],
    color: '#22c55e',
  },
  '45deg': {
    nameEn: '+45\u00B0',
    nameZh: '+45\u00B0',
    stokes: [1, 0, 1, 0],
    jones: [complex.create(1 / Math.sqrt(2)), complex.create(1 / Math.sqrt(2))],
    color: '#f59e0b',
  },
  '-45deg': {
    nameEn: '-45\u00B0',
    nameZh: '-45\u00B0',
    stokes: [1, 0, -1, 0],
    jones: [complex.create(1 / Math.sqrt(2)), complex.create(-1 / Math.sqrt(2))],
    color: '#8b5cf6',
  },
  rcp: {
    nameEn: 'RCP',
    nameZh: '右旋',
    stokes: [1, 0, 0, 1],
    jones: [complex.create(1 / Math.sqrt(2)), complex.create(0, -1 / Math.sqrt(2))],
    color: '#3b82f6',
  },
  lcp: {
    nameEn: 'LCP',
    nameZh: '左旋',
    stokes: [1, 0, 0, -1],
    jones: [complex.create(1 / Math.sqrt(2)), complex.create(0, 1 / Math.sqrt(2))],
    color: '#ec4899',
  },
  unpolarized: {
    nameEn: 'Unpol',
    nameZh: '非偏振',
    stokes: [1, 0, 0, 0],
    jones: [complex.create(1), complex.create(0)], // 仅用于 Mueller 计算
    color: '#6b7280',
  },
}

// ==================== 代码生成 ====================

function generatePythonCode(elements: OpticalElement[], inputState: InputStateType): string {
  const lines: string[] = [
    '"""',
    '偏振光学系统计算 - Python 代码',
    '使用 NumPy 进行矩阵运算',
    '"""',
    'import numpy as np',
    '',
    '# Mueller 矩阵函数',
    'def mueller_polarizer(theta):',
    '    """线偏振片 Mueller 矩阵"""',
    '    c2, s2 = np.cos(2*theta), np.sin(2*theta)',
    '    return 0.5 * np.array([',
    '        [1, c2, s2, 0],',
    '        [c2, c2**2, c2*s2, 0],',
    '        [s2, c2*s2, s2**2, 0],',
    '        [0, 0, 0, 0]',
    '    ])',
    '',
    'def mueller_hwp(theta):',
    '    """半波片 Mueller 矩阵"""',
    '    c4, s4 = np.cos(4*theta), np.sin(4*theta)',
    '    return np.array([',
    '        [1, 0, 0, 0],',
    '        [0, c4, s4, 0],',
    '        [0, s4, -c4, 0],',
    '        [0, 0, 0, -1]',
    '    ])',
    '',
    'def mueller_qwp(theta):',
    '    """四分之一波片 Mueller 矩阵"""',
    '    c2, s2 = np.cos(2*theta), np.sin(2*theta)',
    '    return np.array([',
    '        [1, 0, 0, 0],',
    '        [0, c2**2, c2*s2, -s2],',
    '        [0, c2*s2, s2**2, c2],',
    '        [0, s2, -c2, 0]',
    '    ])',
    '',
    'def mueller_rotator(theta):',
    '    """旋光器 Mueller 矩阵"""',
    '    c2, s2 = np.cos(2*theta), np.sin(2*theta)',
    '    return np.array([',
    '        [1, 0, 0, 0],',
    '        [0, c2, s2, 0],',
    '        [0, -s2, c2, 0],',
    '        [0, 0, 0, 1]',
    '    ])',
    '',
    'def mueller_retarder(theta, delta):',
    '    """通用相位延迟器 Mueller 矩阵"""',
    '    c2, s2 = np.cos(2*theta), np.sin(2*theta)',
    '    cD, sD = np.cos(delta), np.sin(delta)',
    '    return np.array([',
    '        [1, 0, 0, 0],',
    '        [0, c2**2 + s2**2*cD, c2*s2*(1-cD), -s2*sD],',
    '        [0, c2*s2*(1-cD), s2**2 + c2**2*cD, c2*sD],',
    '        [0, s2*sD, -c2*sD, cD]',
    '    ])',
    '',
    '# ==================== 系统计算 ====================',
    '',
    `# 输入 Stokes 矢量: ${INPUT_STATES[inputState].nameEn}`,
    `S_in = np.array(${JSON.stringify(INPUT_STATES[inputState].stokes)})`,
    '',
    '# 光学元件序列',
  ]

  elements.forEach((el, i) => {
    const funcName = el.type === 'half-wave' ? 'hwp' : el.type === 'quarter-wave' ? 'qwp' : el.type
    const angleRad = `np.radians(${el.angle})`
    if (el.type === 'retarder') {
      lines.push(`M${i + 1} = mueller_retarder(${angleRad}, np.radians(${el.retardance || 90}))  # ${ELEMENT_INFO[el.type].nameEn} @ ${el.angle}\u00B0, \u03B4=${el.retardance || 90}\u00B0`)
    } else {
      lines.push(`M${i + 1} = mueller_${funcName}(${angleRad})  # ${ELEMENT_INFO[el.type].nameEn} @ ${el.angle}\u00B0`)
    }
  })

  lines.push('')
  lines.push('# 计算级联矩阵 (从右到左)')
  if (elements.length > 0) {
    const matrixChain = elements.map((_, i) => `M${i + 1}`).reverse().join(' @ ')
    lines.push(`M_system = ${matrixChain}`)
  } else {
    lines.push('M_system = np.eye(4)')
  }
  lines.push('')
  lines.push('# 计算输出 Stokes 矢量')
  lines.push('S_out = M_system @ S_in')
  lines.push('')
  lines.push('# 计算偏振度')
  lines.push('DOP = np.sqrt(S_out[1]**2 + S_out[2]**2 + S_out[3]**2) / S_out[0] if S_out[0] > 0 else 0')
  lines.push('')
  lines.push('# 输出结果')
  lines.push('print("系统 Mueller 矩阵:")')
  lines.push('print(np.round(M_system, 4))')
  lines.push('print(f"\\n输入 Stokes: {S_in}")')
  lines.push('print(f"输出 Stokes: {np.round(S_out, 4)}")')
  lines.push('print(f"透过率: {S_out[0]:.2%}")')
  lines.push('print(f"偏振度: {DOP:.2%}")')

  return lines.join('\n')
}

function generateMatlabCode(elements: OpticalElement[], inputState: InputStateType): string {
  const lines: string[] = [
    '%% 偏振光学系统计算 - MATLAB 代码',
    '',
    '% Mueller 矩阵函数',
    'function M = mueller_polarizer(theta)',
    '    c2 = cos(2*theta); s2 = sin(2*theta);',
    '    M = 0.5 * [1, c2, s2, 0; c2, c2^2, c2*s2, 0; s2, c2*s2, s2^2, 0; 0, 0, 0, 0];',
    'end',
    '',
    'function M = mueller_hwp(theta)',
    '    c4 = cos(4*theta); s4 = sin(4*theta);',
    '    M = [1, 0, 0, 0; 0, c4, s4, 0; 0, s4, -c4, 0; 0, 0, 0, -1];',
    'end',
    '',
    'function M = mueller_qwp(theta)',
    '    c2 = cos(2*theta); s2 = sin(2*theta);',
    '    M = [1, 0, 0, 0; 0, c2^2, c2*s2, -s2; 0, c2*s2, s2^2, c2; 0, s2, -c2, 0];',
    'end',
    '',
    'function M = mueller_rotator(theta)',
    '    c2 = cos(2*theta); s2 = sin(2*theta);',
    '    M = [1, 0, 0, 0; 0, c2, s2, 0; 0, -s2, c2, 0; 0, 0, 0, 1];',
    'end',
    '',
    '%% 系统计算',
    `% 输入 Stokes 矢量: ${INPUT_STATES[inputState].nameEn}`,
    `S_in = [${INPUT_STATES[inputState].stokes.join('; ')}];`,
    '',
    '% 光学元件序列',
  ]

  elements.forEach((el, i) => {
    const funcName = el.type === 'half-wave' ? 'hwp' : el.type === 'quarter-wave' ? 'qwp' : el.type
    const angleRad = `deg2rad(${el.angle})`
    lines.push(`M${i + 1} = mueller_${funcName}(${angleRad});  % ${ELEMENT_INFO[el.type].nameEn} @ ${el.angle}\u00B0`)
  })

  lines.push('')
  lines.push('% 计算级联矩阵')
  if (elements.length > 0) {
    const matrixChain = elements.map((_, i) => `M${i + 1}`).reverse().join(' * ')
    lines.push(`M_system = ${matrixChain};`)
  } else {
    lines.push('M_system = eye(4);')
  }
  lines.push('')
  lines.push('% 计算输出')
  lines.push('S_out = M_system * S_in;')
  lines.push('DOP = sqrt(S_out(2)^2 + S_out(3)^2 + S_out(4)^2) / S_out(1);')
  lines.push('')
  lines.push('% 显示结果')
  lines.push('disp("系统 Mueller 矩阵:"); disp(round(M_system, 4));')
  lines.push('disp("输出 Stokes:"); disp(round(S_out, 4));')
  lines.push('fprintf("透过率: %.2f%%\\n", S_out(1)*100);')
  lines.push('fprintf("偏振度: %.2f%%\\n", DOP*100);')

  return lines.join('\n')
}

// ==================== 组件 ====================

// 元件卡片
function ElementCard({
  element,
  index,
  onUpdate,
  onRemove,
  theme,
  isZh,
}: {
  element: OpticalElement
  index: number
  onUpdate: (element: OpticalElement) => void
  onRemove: () => void
  theme: string
  isZh: boolean
}) {
  const info = ELEMENT_INFO[element.type]
  const [expanded, setExpanded] = useState(true)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'rounded-2xl border overflow-hidden',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-600/50'
          : 'bg-white border-gray-200 shadow-sm'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2.5 cursor-pointer',
          theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: `${info.color}30`, color: info.color }}
          >
            {info.symbol}
          </span>
          <span className={cn(
            'text-sm font-medium',
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          )}>
            {index + 1}. {isZh ? info.nameZh : info.nameEn}
          </span>
          <span className={cn(
            'text-xs font-mono',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            @ {element.angle}{'\u00B0'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className={cn(
              'p-1 rounded-lg',
              theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-500'
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 pb-3"
          >
            <SliderControl
              label={isZh ? '快轴角度' : 'Fast Axis Angle'}
              value={element.angle}
              min={0}
              max={180}
              step={5}
              unit={'\u00B0'}
              onChange={(angle) => onUpdate({ ...element, angle })}
              color="cyan"
            />
            {element.type === 'retarder' && (
              <div className="mt-2">
                <SliderControl
                  label={isZh ? '相位延迟' : 'Retardance'}
                  value={element.retardance || 90}
                  min={0}
                  max={360}
                  step={5}
                  unit={'\u00B0'}
                  onChange={(retardance) => onUpdate({ ...element, retardance })}
                  color="orange"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 矩阵显示
function MatrixDisplay({
  matrix,
  type,
  theme,
  t,
}: {
  matrix: MuellerMatrix | JonesMatrix
  type: 'mueller' | 'jones'
  theme: string
  t: (key: string) => string
}) {
  const isMueller = type === 'mueller'

  // Flatten the matrix based on type
  const flatValues = isMueller
    ? (matrix as MuellerMatrix).flat()
    : (matrix as JonesMatrix).flat()

  return (
    <ChartPanel title={type === 'mueller' ? t('demos.calculator.muellerSystem') : t('demos.calculator.jonesSystem')}>
      <div className="flex items-center justify-center">
        <span className={cn('text-lg', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>[</span>
        <div className={cn('grid gap-0.5', isMueller ? 'grid-cols-4' : 'grid-cols-2')}>
          {flatValues.map((val, i) => {
            const displayVal = isMueller
              ? (val as number).toFixed(3)
              : complex.format(val as Complex, 2)
            const absVal = isMueller
              ? Math.abs(val as number)
              : complex.abs(val as Complex)
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-center text-[9px] font-mono rounded-lg',
                  isMueller ? 'w-14 h-6' : 'w-24 h-7',
                  absVal > 0.001
                    ? theme === 'dark' ? 'text-cyan-400 bg-cyan-400/10' : 'text-cyan-700 bg-cyan-50'
                    : theme === 'dark' ? 'text-gray-600 bg-slate-800/50' : 'text-gray-400 bg-gray-50'
                )}
              >
                {displayVal}
              </div>
            )
          })}
        </div>
        <span className={cn('text-lg', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>]</span>
      </div>
    </ChartPanel>
  )
}

// Stokes 矢量显示
function StokesDisplay({
  stokes,
  label,
  theme,
}: {
  stokes: StokesVector
  label: string
  theme: string
}) {
  const labels = ['S\u2080', 'S\u2081', 'S\u2082', 'S\u2083']
  const colors = ['#94a3b8', '#ef4444', '#22c55e', '#3b82f6']

  return (
    <ChartPanel title={label}>
      <div className="space-y-1.5">
        {stokes.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-6 text-[11px] font-mono font-medium" style={{ color: colors[i] }}>{labels[i]}</span>
            <div className={cn(
              'flex-1 h-2 rounded-full overflow-hidden',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.abs(val) * 100}%`,
                  backgroundColor: colors[i],
                  opacity: val >= 0 ? 1 : 0.5,
                }}
              />
            </div>
            <span className="w-14 text-[11px] font-mono text-right" style={{ color: colors[i] }}>
              {val >= 0 ? '+' : ''}{val.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </ChartPanel>
  )
}

// 难度层级类型
type DifficultyLevel = 'foundation' | 'application' | 'research'

// 主组件 Props
interface PolarizationCalculatorDemoProps {
  difficultyLevel?: DifficultyLevel
}

// 主组件
export function PolarizationCalculatorDemo({ difficultyLevel }: PolarizationCalculatorDemoProps) {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // Foundation level hides advanced features (matrices and code export)
  const isFoundation = difficultyLevel === 'foundation'

  // 状态
  const [elements, setElements] = useState<OpticalElement[]>([
    { id: '1', type: 'polarizer', angle: 0 },
  ])
  const [inputState, setInputState] = useState<InputStateType>('horizontal')
  const [showCode, setShowCode] = useState(false)
  const [codeType, setCodeType] = useState<'python' | 'matlab'>('python')
  const [copied, setCopied] = useState(false)

  // 计算级联 Mueller 矩阵
  const systemMueller = useMemo(() => {
    if (elements.length === 0) {
      return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] as MuellerMatrix
    }
    return elements.reduce<MuellerMatrix>((acc, el, i) => {
      const m = getMuellerMatrix(el)
      return i === 0 ? m : multiplyMueller(m, acc)
    }, [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])
  }, [elements])

  // 计算级联 Jones 矩阵
  const systemJones = useMemo(() => {
    const identity: JonesMatrix = [[complex.create(1), complex.create(0)], [complex.create(0), complex.create(1)]]
    if (elements.length === 0) return identity
    return elements.reduce<JonesMatrix>((acc, el, i) => {
      const m = getJonesMatrix(el)
      return i === 0 ? m : multiplyJones(m, acc)
    }, identity)
  }, [elements])

  // 计算输出 Stokes
  const inputStokes = INPUT_STATES[inputState].stokes
  const outputStokes = applyMueller(systemMueller, inputStokes)

  // 计算偏振度和透过率
  const transmittance = inputStokes[0] > 0 ? outputStokes[0] / inputStokes[0] : 0
  const dop = outputStokes[0] > 0.001
    ? Math.sqrt(outputStokes[1] ** 2 + outputStokes[2] ** 2 + outputStokes[3] ** 2) / outputStokes[0]
    : 0

  // 添加元件
  const addElement = (type: ElementType) => {
    setElements([...elements, {
      id: Date.now().toString(),
      type,
      angle: 0,
      retardance: type === 'retarder' ? 90 : undefined,
    }])
  }

  // 更新元件
  const updateElement = (index: number, element: OpticalElement) => {
    const newElements = [...elements]
    newElements[index] = element
    setElements(newElements)
  }

  // 移除元件
  const removeElement = (index: number) => {
    setElements(elements.filter((_, i) => i !== index))
  }

  // 重置
  const reset = () => {
    setElements([{ id: '1', type: 'polarizer', angle: 0 }])
    setInputState('horizontal')
  }

  // 复制代码
  const handleCopy = async () => {
    const code = codeType === 'python'
      ? generatePythonCode(elements, inputState)
      : generateMatlabCode(elements, inputState)
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 下载代码
  const handleDownload = () => {
    const code = codeType === 'python'
      ? generatePythonCode(elements, inputState)
      : generateMatlabCode(elements, inputState)
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `polarization_calc.${codeType === 'python' ? 'py' : 'm'}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 标题 */}
      <DemoHeader
        title={t('demos.calculator.title')}
        subtitle={t('demos.calculator.subtitle')}
        badge="Calculator"
        gradient="cyan"
      />

      {/* 核心公式 */}
      <FormulaHighlight
        formula="S_out = M_sys \u00D7 S_in = (M_n \u00D7 \u2026 \u00D7 M_1) \u00D7 S_in"
        description={isZh ? '级联光学系统的 Mueller 矩阵乘法规则' : 'Cascaded Mueller matrix multiplication rule'}
      />

      {/* 计算结果统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label={t('demos.calculator.transmittance')}
          value={`${(transmittance * 100).toFixed(1)}%`}
          color="cyan"
          icon={<Calculator className="w-3.5 h-3.5" />}
        />
        <StatCard
          label={t('demos.calculator.dop')}
          value={`${(dop * 100).toFixed(1)}%`}
          color={dop > 0.99 ? 'green' : dop > 0.5 ? 'orange' : 'red'}
        />
        <StatCard
          label={t('demos.calculator.elements')}
          value={elements.length}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 左侧：元件配置 */}
        <div className="lg:col-span-1 space-y-5">
          <ControlPanel title={t('demos.calculator.opticalSystem')}>
            {/* 添加元件按钮 */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(Object.keys(ELEMENT_INFO) as ElementType[]).map((type) => {
                const info = ELEMENT_INFO[type]
                return (
                  <button
                    key={type}
                    onClick={() => addElement(type)}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors',
                      theme === 'dark'
                        ? 'bg-slate-700/50 hover:bg-slate-600 text-gray-300 border border-slate-600/30'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    )}
                  >
                    <Plus className="w-3 h-3" />
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: `${info.color}30`, color: info.color }}
                    >
                      {info.symbol}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 元件列表 */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <AnimatePresence>
                {elements.map((el, i) => (
                  <ElementCard
                    key={el.id}
                    element={el}
                    index={i}
                    onUpdate={(updated) => updateElement(i, updated)}
                    onRemove={() => removeElement(i)}
                    theme={theme}
                    isZh={isZh}
                  />
                ))}
              </AnimatePresence>
            </div>

            {elements.length === 0 && (
              <div className={cn(
                'text-center py-6 text-sm rounded-2xl border border-dashed',
                theme === 'dark' ? 'text-gray-500 border-slate-700' : 'text-gray-400 border-gray-300'
              )}>
                {t('demos.calculator.noElements')}
              </div>
            )}

            <button
              onClick={reset}
              className={cn(
                'w-full mt-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'bg-slate-700/50 hover:bg-slate-600 text-gray-300 border border-slate-600/30'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
              )}
            >
              <RotateCcw className="w-4 h-4" />
              {t('demos.calculator.reset')}
            </button>
          </ControlPanel>

          {/* 输入偏振态 */}
          <ControlPanel title={t('demos.calculator.inputState')}>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(INPUT_STATES) as InputStateType[]).map((type) => {
                const info = INPUT_STATES[type]
                return (
                  <button
                    key={type}
                    onClick={() => setInputState(type)}
                    className={cn(
                      'px-2 py-1.5 rounded-xl text-[10px] font-medium transition-colors',
                      inputState === type
                        ? 'text-white shadow-md'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                    style={{
                      backgroundColor: inputState === type ? info.color : undefined,
                    }}
                  >
                    {isZh ? info.nameZh : info.nameEn}
                  </button>
                )
              })}
            </div>
          </ControlPanel>
        </div>

        {/* 右侧：结果显示 */}
        <div className="lg:col-span-2 space-y-5">
          {/* 系统矩阵 - 基础模式下隐藏 */}
          {!isFoundation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MatrixDisplay matrix={systemMueller} type="mueller" theme={theme} t={t} />
              <MatrixDisplay matrix={systemJones as unknown as MuellerMatrix} type="jones" theme={theme} t={t} />
            </div>
          )}

          {/* Stokes 矢量变换 */}
          <div className="grid grid-cols-2 gap-5">
            <StokesDisplay stokes={inputStokes} label={t('demos.calculator.inputStokes')} theme={theme} />
            <StokesDisplay stokes={outputStokes} label={t('demos.calculator.outputStokes')} theme={theme} />
          </div>

          {/* 代码导出 - 基础模式下隐藏 */}
          {!isFoundation && (
            <div className={cn(
              'rounded-2xl border overflow-hidden',
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700/40' : 'bg-white border-gray-200'
            )}>
              <div className={cn(
                'flex items-center justify-between px-4 py-3 border-b',
                theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
              )}>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold',
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  )}
                >
                  <Code className="w-4 h-4" />
                  {t('demos.calculator.codeExport')}
                  {showCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showCode && (
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg overflow-hidden border border-slate-600/30">
                      {(['python', 'matlab'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setCodeType(type)}
                          className={cn(
                            'px-3 py-1 text-xs font-medium transition-colors',
                            codeType === type
                              ? theme === 'dark' ? 'bg-purple-500/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                              : theme === 'dark' ? 'bg-slate-700/50 text-gray-400' : 'bg-gray-50 text-gray-600'
                          )}
                        >
                          {type === 'python' ? 'Python' : 'MATLAB'}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                      )}
                      title="Copy"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleDownload}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                      )}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {showCode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <pre className={cn(
                      'p-4 text-[11px] leading-relaxed overflow-x-auto max-h-64',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      <code>
                        {codeType === 'python'
                          ? generatePythonCode(elements, inputState)
                          : generateMatlabCode(elements, inputState)}
                      </code>
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* 知识卡片 */}
      <InfoGrid columns={3}>
        <InfoCard title={t('demos.calculator.cascadeRule')} color="cyan">
          <p className={cn('text-xs', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            {t('demos.calculator.cascadeDesc')}
          </p>
          <code className={cn(
            'block mt-2 text-[11px] p-2.5 rounded-lg font-mono',
            theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-gray-100 text-cyan-700'
          )}>
            M_sys = M_n {'\u00D7'} ... {'\u00D7'} M_2 {'\u00D7'} M_1
          </code>
        </InfoCard>

        <InfoCard title={t('demos.calculator.muellerJones')} color="purple">
          <ul className={cn('text-xs space-y-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            <li>* Mueller: 4{'\u00D7'}4 {isZh ? '实数矩阵' : 'real matrix'}</li>
            <li>* Jones: 2{'\u00D7'}2 {isZh ? '复数矩阵' : 'complex matrix'}</li>
            <li>* Mueller {isZh ? '可处理非偏振光' : 'handles unpolarized'}</li>
          </ul>
        </InfoCard>

        <InfoCard title={t('demos.calculator.tips')} color="orange">
          <ul className={cn('text-xs space-y-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            <li>* {isZh ? '拖拽调整元件顺序' : 'Drag to reorder'}</li>
            <li>* {isZh ? '点击展开编辑参数' : 'Click to expand'}</li>
            <li>* {isZh ? '导出代码进行进一步分析' : 'Export code for analysis'}</li>
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
