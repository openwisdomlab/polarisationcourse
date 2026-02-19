/**
 * Jones 矩阵演示 - Unit 5
 * 演示2×2复数矩阵如何描述完全偏振光的变换
 * 与Mueller矩阵互补：Jones用于相干光，Mueller用于非相干光
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SliderControl, ControlPanel, InfoCard } from '../DemoControls'
import { DemoHeader, VisualizationPanel, StatCard, InfoGrid, FormulaHighlight, ChartPanel } from '../DemoLayout'
import { Copy, Check, Code } from 'lucide-react'

// Import Jones Calculus utilities from shared module
import {
  type JonesVector,
  type JonesMatrix,
  complex,
  applyJonesMatrix,
  jonesIntensity,
  polarizerMatrix,
  halfWavePlateMatrix,
  quarterWavePlateMatrix,
  rotatorMatrix,
  identityMatrix,
} from '@/core/JonesCalculus'

// 光学元件类型
type OpticalElement = 'polarizer' | 'half-wave' | 'quarter-wave' | 'rotator' | 'identity'

// 获取元件的 Jones 矩阵
function getElementMatrix(element: OpticalElement, angle: number): JonesMatrix {
  switch (element) {
    case 'polarizer':
      return polarizerMatrix(angle)
    case 'half-wave':
      return halfWavePlateMatrix(angle)
    case 'quarter-wave':
      return quarterWavePlateMatrix(angle)
    case 'rotator':
      return rotatorMatrix(angle)
    case 'identity':
    default:
      return identityMatrix()
  }
}

// 元件信息
const ELEMENT_INFO: Record<OpticalElement, { nameEn: string; nameZh: string; color: string; symbol: string }> = {
  polarizer: { nameEn: 'Polarizer', nameZh: '偏振片', color: '#22d3ee', symbol: 'P' },
  'half-wave': { nameEn: 'Half-wave Plate', nameZh: '半波片', color: '#f472b6', symbol: 'H' },
  'quarter-wave': { nameEn: 'Quarter-wave Plate', nameZh: '四分之一波片', color: '#a78bfa', symbol: 'Q' },
  rotator: { nameEn: 'Rotator', nameZh: '旋光器', color: '#4ade80', symbol: 'R' },
  identity: { nameEn: 'Identity', nameZh: '无元件', color: '#6b7280', symbol: 'I' },
}

// 输入偏振类型
type InputType = 'horizontal' | 'vertical' | '45deg' | 'rcp' | 'lcp'

const INPUT_INFO: Record<InputType, { nameEn: string; nameZh: string; jones: JonesVector; color: string }> = {
  horizontal: {
    nameEn: 'Horizontal',
    nameZh: '水平偏振',
    jones: [complex.create(1), complex.create(0)],
    color: '#ef4444',
  },
  vertical: {
    nameEn: 'Vertical',
    nameZh: '垂直偏振',
    jones: [complex.create(0), complex.create(1)],
    color: '#ef4444',
  },
  '45deg': {
    nameEn: '45° Linear',
    nameZh: '45°线偏振',
    jones: [complex.create(1 / Math.sqrt(2)), complex.create(1 / Math.sqrt(2))],
    color: '#22c55e',
  },
  rcp: {
    nameEn: 'RCP',
    nameZh: '右旋圆偏振',
    jones: [complex.create(1 / Math.sqrt(2)), complex.create(0, -1 / Math.sqrt(2))],
    color: '#3b82f6',
  },
  lcp: {
    nameEn: 'LCP',
    nameZh: '左旋圆偏振',
    jones: [complex.create(1 / Math.sqrt(2)), complex.create(0, 1 / Math.sqrt(2))],
    color: '#f472b6',
  },
}

// 生成 Python 代码
function generatePythonCode(element: OpticalElement, angle: number, inputType: InputType): string {
  return `import numpy as np

# Jones 矩阵计算 - ${ELEMENT_INFO[element].nameEn}
# Angle: ${angle}°

def jones_polarizer(theta):
    """线偏振片 Jones 矩阵"""
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c*c, c*s], [c*s, s*s]])

def jones_hwp(theta):
    """半波片 Jones 矩阵"""
    c2, s2 = np.cos(2*theta), np.sin(2*theta)
    return np.array([[c2, s2], [s2, -c2]])

def jones_qwp(theta):
    """四分之一波片 Jones 矩阵"""
    c, s = np.cos(theta), np.sin(theta)
    return np.exp(1j*np.pi/4) * np.array([
        [c*c + 1j*s*s, (1-1j)*c*s],
        [(1-1j)*c*s, s*s + 1j*c*c]
    ])

def jones_rotator(theta):
    """旋光器 Jones 矩阵"""
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s], [s, c]])

# 输入 Jones 矢量: ${INPUT_INFO[inputType].nameEn}
input_jones = np.array(${JSON.stringify([
    [INPUT_INFO[inputType].jones[0].re, INPUT_INFO[inputType].jones[0].im],
    [INPUT_INFO[inputType].jones[1].re, INPUT_INFO[inputType].jones[1].im]
  ]).replace(/\[/g, '[').replace(/,/g, '+1j*').replace(/\+1j\*\[/g, '[').replace(/\]\+1j\*/g, '], ')})
input_jones = input_jones[:, 0] + 1j * input_jones[:, 1]

# 光学元件 Jones 矩阵
theta = np.radians(${angle})
element_matrix = jones_${element === 'half-wave' ? 'hwp' : element === 'quarter-wave' ? 'qwp' : element}(theta)

# 计算输出
output_jones = element_matrix @ input_jones
output_intensity = np.abs(output_jones[0])**2 + np.abs(output_jones[1])**2

print(f"Jones Matrix:\\n{element_matrix}")
print(f"\\nInput Jones Vector: {input_jones}")
print(f"Output Jones Vector: {output_jones}")
print(f"Output Intensity: {output_intensity:.4f}")
`
}

// 生成 MATLAB 代码
function generateMatlabCode(element: OpticalElement, angle: number, inputType: InputType): string {
  return `%% Jones 矩阵计算 - ${ELEMENT_INFO[element].nameEn}
% Angle: ${angle}°

function M = jones_polarizer(theta)
    % 线偏振片 Jones 矩阵
    c = cos(theta); s = sin(theta);
    M = [c*c, c*s; c*s, s*s];
end

function M = jones_hwp(theta)
    % 半波片 Jones 矩阵
    c2 = cos(2*theta); s2 = sin(2*theta);
    M = [c2, s2; s2, -c2];
end

function M = jones_qwp(theta)
    % 四分之一波片 Jones 矩阵
    c = cos(theta); s = sin(theta);
    M = exp(1i*pi/4) * [c*c + 1i*s*s, (1-1i)*c*s; (1-1i)*c*s, s*s + 1i*c*c];
end

function M = jones_rotator(theta)
    % 旋光器 Jones 矩阵
    c = cos(theta); s = sin(theta);
    M = [c, -s; s, c];
end

%% 计算
% 输入 Jones 矢量: ${INPUT_INFO[inputType].nameEn}
input_jones = [${complex.format(INPUT_INFO[inputType].jones[0]).replace('i', '*1i')}; ${complex.format(INPUT_INFO[inputType].jones[1]).replace('i', '*1i')}];

% 光学元件 Jones 矩阵
theta = deg2rad(${angle});
element_matrix = jones_${element === 'half-wave' ? 'hwp' : element === 'quarter-wave' ? 'qwp' : element}(theta);

% 计算输出
output_jones = element_matrix * input_jones;
output_intensity = abs(output_jones(1))^2 + abs(output_jones(2))^2;

disp('Jones Matrix:');
disp(element_matrix);
disp(['Input Jones Vector: ', mat2str(input_jones)]);
disp(['Output Jones Vector: ', mat2str(output_jones)]);
disp(['Output Intensity: ', num2str(output_intensity)]);
`
}

// Jones 矩阵显示组件
function JonesMatrixDisplay({ matrix, element, angle, theme, t }: {
  matrix: JonesMatrix
  element: OpticalElement
  angle: number
  theme: string
  t: (key: string, options?: Record<string, unknown>) => string
}) {
  const elementInfo = ELEMENT_INFO[element]

  return (
    <ChartPanel title={t('demos.jones.ui.jonesMatrix')} subtitle={`${t(`demos.jones.elements.${element}`)} @ ${angle}°`}>
      <div className="flex items-center justify-center gap-1 py-2">
        <span className={cn(
          'text-2xl font-light',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        )}>[</span>
        <div className="grid grid-cols-2 gap-1.5">
          {matrix.flat().map((val, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-28 h-8 flex items-center justify-center text-[11px] font-mono rounded-lg',
                complex.abs(val) > 0.01
                  ? theme === 'dark' ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20' : 'text-cyan-600 bg-cyan-50 border border-cyan-200'
                  : theme === 'dark' ? 'text-gray-600 bg-slate-800/50 border border-slate-700/30' : 'text-gray-500 bg-gray-50 border border-gray-200'
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {complex.format(val)}
            </motion.div>
          ))}
        </div>
        <span className={cn(
          'text-2xl font-light',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        )}>]</span>
      </div>
      <div className="flex items-center justify-center gap-2 mt-1">
        <span
          className="text-xs px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${elementInfo.color}20`, color: elementInfo.color }}
        >
          {elementInfo.symbol} = {t(`demos.jones.elements.${element}`)}
        </span>
      </div>
    </ChartPanel>
  )
}

// Jones 矢量对比显示
function JonesVectorCompare({
  inputJones,
  outputJones,
  theme,
  t,
}: {
  inputJones: JonesVector
  outputJones: JonesVector
  theme: string
  t: (key: string, options?: Record<string, unknown>) => string
}) {
  const inputIntensity = jonesIntensity(inputJones)
  const outputIntensity = jonesIntensity(outputJones)

  return (
    <ChartPanel title={t('demos.jones.ui.jonesTransform')}>
      <div className="grid grid-cols-2 gap-4">
        {/* 输入 */}
        <div>
          <div className={cn(
            'text-[11px] mb-2 text-center font-medium',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>{t('demos.jones.ui.inputJones')}</div>
          <div className="space-y-1.5">
            <div className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono text-center',
              theme === 'dark' ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' : 'bg-orange-50 text-orange-600 border border-orange-200'
            )}>
              Ex: {complex.format(inputJones[0])}
            </div>
            <div className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono text-center',
              theme === 'dark' ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' : 'bg-orange-50 text-orange-600 border border-orange-200'
            )}>
              Ey: {complex.format(inputJones[1])}
            </div>
            <div className={cn(
              'text-[11px] text-center mt-2 font-mono',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              I = {inputIntensity.toFixed(2)}
            </div>
          </div>
        </div>

        {/* 输出 */}
        <div>
          <div className={cn(
            'text-[11px] mb-2 text-center font-medium',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>{t('demos.jones.ui.outputJones')}</div>
          <div className="space-y-1.5">
            <div className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono text-center',
              theme === 'dark' ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'
            )}>
              Ex: {complex.format(outputJones[0])}
            </div>
            <div className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono text-center',
              theme === 'dark' ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'
            )}>
              Ey: {complex.format(outputJones[1])}
            </div>
            <div className={cn(
              'text-[11px] text-center mt-2 font-mono',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              I = {outputIntensity.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </ChartPanel>
  )
}

// 偏振椭圆可视化
function PolarizationEllipse({
  jones,
  theme,
  label,
}: {
  jones: JonesVector
  theme: string
  label: string
}) {
  const intensity = jonesIntensity(jones)
  if (intensity < 0.001) {
    return (
      <div className={cn(
        'w-full h-32 rounded-2xl flex items-center justify-center',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
      )}>
        <span className={cn(
          'text-xs',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        )}>No light</span>
      </div>
    )
  }

  // 计算偏振椭圆参数
  const Ex = complex.abs(jones[0])
  const Ey = complex.abs(jones[1])
  const delta = complex.phase(jones[1]) - complex.phase(jones[0])

  // 生成椭圆路径点
  const points: string[] = []
  for (let t = 0; t <= 2 * Math.PI; t += 0.05) {
    const x = Ex * Math.cos(t)
    const y = Ey * Math.cos(t + delta)
    points.push(`${50 + x * 40},${50 - y * 40}`)
  }

  // 判断旋向
  const handedness = Math.sin(delta) > 0 ? 'LCP' : Math.sin(delta) < 0 ? 'RCP' : 'Linear'

  return (
    <div className={cn(
      'rounded-2xl p-3',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
    )}>
      <div className={cn(
        'text-[11px] text-center mb-1 font-medium',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      )}>{label}</div>
      <svg viewBox="0 0 100 100" className="w-full h-28">
        {/* 坐标轴 */}
        <line x1="10" y1="50" x2="90" y2="50" stroke={theme === 'dark' ? '#374151' : '#d1d5db'} strokeWidth="0.5" />
        <line x1="50" y1="10" x2="50" y2="90" stroke={theme === 'dark' ? '#374151' : '#d1d5db'} strokeWidth="0.5" />

        {/* 偏振椭圆 */}
        <motion.polygon
          points={points.join(' ')}
          fill="none"
          stroke={theme === 'dark' ? '#22d3ee' : '#0891b2'}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* 旋向箭头 */}
        {Math.abs(Math.sin(delta)) > 0.1 && (
          <motion.circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke={handedness === 'RCP' ? '#3b82f6' : '#f472b6'}
            strokeWidth="1"
            strokeDasharray="3"
            initial={{ rotate: 0 }}
            animate={{ rotate: handedness === 'RCP' ? -360 : 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </svg>
      <div className={cn(
        'text-[10px] text-center font-medium',
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      )}>
        {handedness === 'Linear' ? '线偏振' : handedness === 'RCP' ? '右旋' : '左旋'}
      </div>
    </div>
  )
}

// 代码导出面板
function CodeExportPanel({
  element,
  angle,
  inputType,
  theme,
  t,
}: {
  element: OpticalElement
  angle: number
  inputType: InputType
  theme: string
  t: (key: string, options?: Record<string, unknown>) => string
}) {
  const [codeType, setCodeType] = useState<'python' | 'matlab'>('python')
  const [copied, setCopied] = useState(false)

  const code = useMemo(() => {
    return codeType === 'python'
      ? generatePythonCode(element, angle, inputType)
      : generateMatlabCode(element, angle, inputType)
  }, [codeType, element, angle, inputType])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden',
      theme === 'dark'
        ? 'bg-slate-800/50 border-purple-400/20'
        : 'bg-white border-purple-200 shadow-sm'
    )}>
      <div className={cn(
        'flex items-center justify-between px-4 py-3 border-b',
        theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Code className={cn('w-4 h-4', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />
          <span className={cn(
            'text-sm font-semibold',
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          )}>{t('demos.jones.ui.codeExport')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-slate-600/30">
            {(['python', 'matlab'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setCodeType(type)}
                className={cn(
                  'px-3 py-1 text-xs font-medium transition-colors',
                  codeType === type
                    ? theme === 'dark'
                      ? 'bg-purple-400/30 text-purple-300'
                      : 'bg-purple-100 text-purple-700'
                    : theme === 'dark'
                      ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
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
              theme === 'dark'
                ? 'hover:bg-slate-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <pre className={cn(
        'p-4 text-[11px] leading-relaxed overflow-x-auto max-h-48',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

// 主演示组件
export function JonesMatrixDemo() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const [element, setElement] = useState<OpticalElement>('polarizer')
  const [angle, setAngle] = useState(0)
  const [inputType, setInputType] = useState<InputType>('horizontal')
  const [showCode, setShowCode] = useState(false)

  const isZh = i18n.language === 'zh'

  // 输入 Jones 矢量
  const inputJones = INPUT_INFO[inputType].jones

  // 获取 Jones 矩阵
  const matrix = getElementMatrix(element, angle)

  // 计算输出 Jones 矢量
  const outputJones = applyJonesMatrix(matrix, inputJones)

  // 计算透过率
  const inputIntensity = jonesIntensity(inputJones)
  const outputIntensity = jonesIntensity(outputJones)
  const transmittance = inputIntensity > 0 ? outputIntensity / inputIntensity : 0

  // 元件选项
  const elements: OpticalElement[] = ['polarizer', 'half-wave', 'quarter-wave', 'rotator', 'identity']
  const inputTypes: InputType[] = ['horizontal', 'vertical', '45deg', 'rcp', 'lcp']

  return (
    <div className="flex flex-col gap-5">
      {/* 标题 */}
      <DemoHeader
        title={t('demos.jones.demoTitle')}
        subtitle={t('demos.jones.demoSubtitle')}
        gradient="purple"
      />

      {/* 核心公式 */}
      <FormulaHighlight
        formula="E_out = J * E_in"
        description={isZh ? 'Jones 矩阵将输入偏振态变换为输出偏振态' : 'Jones matrix transforms input polarization to output'}
      />

      {/* 偏振椭圆可视化 */}
      <VisualizationPanel variant="indigo">
        <div className="grid grid-cols-3 gap-4">
          <PolarizationEllipse jones={inputJones} theme={theme} label={t('demos.jones.ui.inputPolarization')} />
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg"
              style={{ backgroundColor: `${ELEMENT_INFO[element].color}30`, color: ELEMENT_INFO[element].color }}
            >
              {ELEMENT_INFO[element].symbol}
            </div>
            <div className={cn(
              'text-[11px] mt-2 font-mono',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? ELEMENT_INFO[element].nameZh : ELEMENT_INFO[element].nameEn}
            </div>
            <div className={cn(
              'text-[11px] font-mono',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              {'\u03B8'} = {angle}{'\u00B0'}
            </div>
            <motion.div
              className="mt-2 text-lg font-mono"
              style={{ color: ELEMENT_INFO[element].color }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {'\u2192'}
            </motion.div>
          </div>
          <PolarizationEllipse jones={outputJones} theme={theme} label={t('demos.jones.ui.outputPolarization')} />
        </div>
      </VisualizationPanel>

      {/* 计算结果统计 */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label={t('demos.jones.ui.inputIntensity')} value={inputIntensity.toFixed(2)} color="orange" />
        <StatCard label={t('demos.jones.ui.outputIntensity')} value={outputIntensity.toFixed(2)} color="cyan" />
        <StatCard label={t('demos.jones.ui.transmittance')} value={`${(transmittance * 100).toFixed(1)}%`} color="purple" />
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 左侧：矩阵和矢量 */}
        <div className="space-y-5">
          <JonesMatrixDisplay matrix={matrix} element={element} angle={angle} theme={theme} t={t} />
          <JonesVectorCompare inputJones={inputJones} outputJones={outputJones} theme={theme} t={t} />
        </div>

        {/* 右侧：控制面板 */}
        <div className="space-y-5">
          <ControlPanel title={t('demos.jones.ui.selectElement')}>
            <div className="grid grid-cols-5 gap-2">
              {elements.map((el) => {
                const info = ELEMENT_INFO[el]
                return (
                  <button
                    key={el}
                    onClick={() => setElement(el)}
                    className={cn(
                      'p-2 rounded-xl text-center transition-all',
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
                      className="w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1"
                      style={{ backgroundColor: `${info.color}40`, color: info.color }}
                    >
                      {info.symbol}
                    </div>
                    <div className={cn(
                      'text-[9px] truncate',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>{isZh ? info.nameZh : info.nameEn}</div>
                  </button>
                )
              })}
            </div>
            <SliderControl
              label={t('demos.jones.ui.elementAngle')}
              value={angle}
              min={0}
              max={180}
              step={5}
              unit="°"
              onChange={setAngle}
              color="purple"
            />
          </ControlPanel>

          <ControlPanel title={t('demos.jones.ui.inputState')}>
            <div className="grid grid-cols-5 gap-2">
              {inputTypes.map((type) => {
                const info = INPUT_INFO[type]
                return (
                  <button
                    key={type}
                    onClick={() => setInputType(type)}
                    className={cn(
                      'px-1.5 py-2 rounded-xl text-[10px] font-medium transition-colors',
                      inputType === type
                        ? 'text-white shadow-md'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                    style={{
                      backgroundColor: inputType === type ? info.color : undefined,
                    }}
                  >
                    {isZh ? info.nameZh : info.nameEn}
                  </button>
                )
              })}
            </div>
          </ControlPanel>

          <ControlPanel title={t('demos.jones.ui.result')}>
            <button
              onClick={() => setShowCode(!showCode)}
              className={cn(
                'w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2',
                theme === 'dark'
                  ? 'bg-purple-400/20 text-purple-300 hover:bg-purple-400/30 border border-purple-400/20'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              )}
            >
              <Code className="w-4 h-4" />
              {showCode ? t('demos.jones.ui.hideCode') : t('demos.jones.ui.showCode')}
            </button>
          </ControlPanel>
        </div>
      </div>

      {/* 代码导出面板 */}
      {showCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <CodeExportPanel
            element={element}
            angle={angle}
            inputType={inputType}
            theme={theme}
            t={t}
          />
        </motion.div>
      )}

      {/* 知识卡片 */}
      <InfoGrid columns={2}>
        <InfoCard title={t('demos.jones.ui.jonesVsMueller')} color="purple">
          <ul className={cn(
            'text-xs space-y-1',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            <li>* <strong>Jones:</strong> {t('demos.jones.info.jonesDesc')}</li>
            <li>* <strong>Mueller:</strong> {t('demos.jones.info.muellerDesc')}</li>
            <li>* <strong>{t('demos.jones.info.relation')}:</strong> {t('demos.jones.info.relationDesc')}</li>
          </ul>
        </InfoCard>

        <InfoCard title={t('demos.jones.ui.complexAmplitude')} color="cyan">
          <ul className={cn(
            'text-xs space-y-1',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            <li>* {t('demos.jones.info.amplitude')}</li>
            <li>* {t('demos.jones.info.phase')}</li>
            <li>* {t('demos.jones.info.coherence')}</li>
          </ul>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
