/**
 * 穆勒矩阵演示 - Unit 5
 * 演示4×4矩阵如何描述光学元件对偏振态的变换
 */
import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line, Text, Sphere, Box } from '@react-three/drei'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup, InfoPanel } from '../DemoControls'

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

// 元件名称映射
const ELEMENT_NAMES: Record<OpticalElement, string> = {
  polarizer: '偏振片',
  'half-wave': 'λ/2 波片',
  'quarter-wave': 'λ/4 波片',
  rotator: '旋光器',
  identity: '无 (单位)',
}

// 光学元件3D组件
function OpticalElementMesh({
  position,
  element,
  angle,
  label,
}: {
  position: [number, number, number]
  element: OpticalElement
  angle: number
  label: string
}) {
  const colors: Record<OpticalElement, string> = {
    polarizer: '#22d3ee',
    'half-wave': '#f472b6',
    'quarter-wave': '#a78bfa',
    rotator: '#4ade80',
    identity: '#6b7280',
  }

  return (
    <group position={position}>
      {/* 元件本体 */}
      <mesh rotation={[0, 0, (angle * Math.PI) / 180]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial
          color={colors[element]}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* 轴向指示 */}
      <Line
        points={[
          [0, -1, 0],
          [0, 1, 0],
        ]}
        color={colors[element]}
        lineWidth={3}
        rotation={[0, 0, (angle * Math.PI) / 180]}
      />
      {/* 标签 */}
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="#94a3b8">
        {label}
      </Text>
      <Text position={[0, -1.8, 0]} fontSize={0.15} color="#64748b">
        {angle}°
      </Text>
    </group>
  )
}

// 斯托克斯矢量可视化
function StokesVisualization({
  position,
  stokes,
  label,
}: {
  position: [number, number, number]
  stokes: StokesVector
  label: string
}) {
  const [S0, S1, S2, S3] = stokes
  const dop = Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / (S0 + 0.001)

  return (
    <group position={position}>
      {/* 小庞加莱球 */}
      <Sphere args={[0.5, 16, 16]}>
        <meshStandardMaterial color="#1e3a5f" transparent opacity={0.2} />
      </Sphere>
      {/* 偏振状态点 */}
      {dop > 0.01 && (
        <Sphere
          args={[0.1, 8, 8]}
          position={[
            (S1 / S0) * 0.5,
            (S2 / S0) * 0.5,
            (S3 / S0) * 0.5,
          ]}
        >
          <meshBasicMaterial color="#fbbf24" />
        </Sphere>
      )}
      <Text position={[0, -1, 0]} fontSize={0.2} color="#94a3b8">
        {label}
      </Text>
    </group>
  )
}

// 光束可视化
function LightBeam({
  start,
  end,
  intensity,
}: {
  start: [number, number, number]
  end: [number, number, number]
  intensity: number
}) {
  return (
    <Line
      points={[start, end]}
      color="#fbbf24"
      lineWidth={Math.max(1, 4 * intensity)}
      transparent
      opacity={Math.max(0.3, intensity)}
    />
  )
}

// 3D场景
function MuellerScene({
  inputStokes,
  element,
  angle,
  outputStokes,
}: {
  inputStokes: StokesVector
  element: OpticalElement
  angle: number
  outputStokes: StokesVector
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 光源 */}
      <group position={[-5, 0, 0]}>
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </Sphere>
        <Text position={[0, -0.8, 0]} fontSize={0.2} color="#94a3b8">
          光源
        </Text>
      </group>

      {/* 入射光束 */}
      <LightBeam start={[-4.5, 0, 0]} end={[-1.5, 0, 0]} intensity={inputStokes[0]} />

      {/* 输入偏振状态 */}
      <StokesVisualization position={[-3, 1.5, 0]} stokes={inputStokes} label="输入" />

      {/* 光学元件 */}
      <OpticalElementMesh
        position={[0, 0, 0]}
        element={element}
        angle={angle}
        label={ELEMENT_NAMES[element]}
      />

      {/* 出射光束 */}
      <LightBeam start={[1.5, 0, 0]} end={[4.5, 0, 0]} intensity={outputStokes[0]} />

      {/* 输出偏振状态 */}
      <StokesVisualization position={[3, 1.5, 0]} stokes={outputStokes} label="输出" />

      {/* 屏幕 */}
      <group position={[5.5, 0, 0]}>
        <Box args={[0.1, 2, 2]}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={outputStokes[0] * 0.3}
          />
        </Box>
        <Text position={[0.3, -1.5, 0]} fontSize={0.2} color="#94a3b8">
          屏幕
        </Text>
      </group>

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 矩阵显示组件
function MatrixDisplay({ matrix, title }: { matrix: MuellerMatrix; title: string }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-2">{title}</div>
      <div className="font-mono text-xs grid grid-cols-4 gap-1">
        {matrix.flat().map((val, i) => (
          <div
            key={i}
            className={`text-center py-1 rounded ${
              Math.abs(val) > 0.01
                ? val > 0
                  ? 'text-cyan-400 bg-cyan-400/10'
                  : 'text-pink-400 bg-pink-400/10'
                : 'text-gray-600'
            }`}
          >
            {val.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  )
}

// 斯托克斯矢量显示
function VectorDisplay({ stokes, title }: { stokes: StokesVector; title: string }) {
  const labels = ['S₀', 'S₁', 'S₂', 'S₃']
  const colors = ['text-white', 'text-red-400', 'text-green-400', 'text-blue-400']

  return (
    <div className="bg-slate-900/50 rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-2">{title}</div>
      <div className="font-mono text-sm space-y-1">
        {stokes.map((val, i) => (
          <div key={i} className="flex justify-between">
            <span className={colors[i]}>{labels[i]}</span>
            <span className="text-cyan-400">{val.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 主演示组件
export function MuellerMatrixDemo() {
  const [element, setElement] = useState<OpticalElement>('polarizer')
  const [angle, setAngle] = useState(0)
  const [inputType, setInputType] = useState<'horizontal' | 'vertical' | '45deg' | 'rcp' | 'unpolarized'>('horizontal')

  // 输入斯托克斯矢量
  const inputStokes: StokesVector = useMemo(() => {
    switch (inputType) {
      case 'horizontal':
        return [1, 1, 0, 0]
      case 'vertical':
        return [1, -1, 0, 0]
      case '45deg':
        return [1, 0, 1, 0]
      case 'rcp':
        return [1, 0, 0, 1]
      case 'unpolarized':
        return [1, 0, 0, 0]
      default:
        return [1, 1, 0, 0]
    }
  }, [inputType])

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
  const elements: { value: OpticalElement; label: string }[] = [
    { value: 'polarizer', label: '偏振片' },
    { value: 'half-wave', label: 'λ/2 波片' },
    { value: 'quarter-wave', label: 'λ/4 波片' },
    { value: 'rotator', label: '旋光器' },
    { value: 'identity', label: '无' },
  ]

  // 输入偏振选项
  const inputOptions = [
    { value: 'horizontal', label: '水平' },
    { value: 'vertical', label: '垂直' },
    { value: '45deg', label: '+45°' },
    { value: 'rcp', label: 'RCP' },
    { value: 'unpolarized', label: '自然光' },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 50 }}
          gl={{ antialias: true }}
        >
          <MuellerScene
            inputStokes={inputStokes}
            element={element}
            angle={angle}
            outputStokes={outputStokes}
          />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-96 space-y-4">
        <ControlPanel title="光学元件">
          <ButtonGroup
            label="元件类型"
            options={elements}
            value={element}
            onChange={(v) => setElement(v as OpticalElement)}
          />
          <SliderControl
            label="元件角度"
            value={angle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={setAngle}
          />
        </ControlPanel>

        <ControlPanel title="输入偏振">
          <ButtonGroup
            label=""
            options={inputOptions}
            value={inputType}
            onChange={(v) => setInputType(v as typeof inputType)}
          />
        </ControlPanel>

        <ControlPanel title="穆勒矩阵">
          <MatrixDisplay matrix={matrix} title={`M (${ELEMENT_NAMES[element]}, ${angle}°)`} />
        </ControlPanel>

        <div className="grid grid-cols-2 gap-3">
          <VectorDisplay stokes={inputStokes} title="输入 Sin" />
          <VectorDisplay stokes={outputStokes} title="输出 Sout" />
        </div>

        <ControlPanel title="变换结果">
          <ValueDisplay label="输入强度" value={inputStokes[0].toFixed(2)} />
          <ValueDisplay label="输出强度" value={outputStokes[0].toFixed(2)} />
          <ValueDisplay label="输入偏振度" value={(inputDOP * 100).toFixed(0)} unit="%" />
          <ValueDisplay label="输出偏振度" value={(outputDOP * 100).toFixed(0)} unit="%" />
          <div className="mt-2 p-2 bg-slate-900/50 rounded text-xs font-mono text-cyan-400 text-center">
            Sout = M × Sin
          </div>
        </ControlPanel>

        <InfoPanel title="穆勒矩阵特性">
          <div className="space-y-1 text-xs">
            <p>• 4×4实数矩阵</p>
            <p>• 完备描述线性光学元件</p>
            <p>• 可级联：M_total = M_n × ... × M_1</p>
            <p>• 适用于部分偏振光</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
