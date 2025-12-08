/**
 * 斯托克斯矢量演示 - Unit 5
 * 用四个参数 [S₀, S₁, S₂, S₃] 完整描述光的偏振状态
 */
import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, InfoPanel } from '../DemoControls'

// 斯托克斯矢量类型
interface StokesVector {
  S0: number // 总强度
  S1: number // 水平/垂直偏振分量差
  S2: number // +45°/-45°偏振分量差
  S3: number // 右旋/左旋圆偏振分量差
}

// 从偏振参数计算斯托克斯矢量
function calculateStokes(
  intensity: number,
  polarizationAngle: number, // 线偏振角度
  ellipticity: number, // 椭圆度 (-1到1, 0为线偏振)
  dop: number // 偏振度 (0-1)
): StokesVector {
  const psi = (polarizationAngle * Math.PI) / 180
  const chi = Math.atan(ellipticity) // 椭圆角

  return {
    S0: intensity,
    S1: intensity * dop * Math.cos(2 * chi) * Math.cos(2 * psi),
    S2: intensity * dop * Math.cos(2 * chi) * Math.sin(2 * psi),
    S3: intensity * dop * Math.sin(2 * chi),
  }
}

// 从斯托克斯矢量计算偏振参数
function stokesToParams(stokes: StokesVector): {
  dop: number
  angle: number
  ellipticity: number
  type: string
} {
  const { S0, S1, S2, S3 } = stokes

  // 偏振度
  const dop = Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / S0

  // 偏振角度
  const angle = (0.5 * Math.atan2(S2, S1) * 180) / Math.PI

  // 椭圆度
  const chi = 0.5 * Math.asin(S3 / (S0 * dop + 0.001))
  const ellipticity = Math.tan(chi)

  // 偏振类型
  let type = '部分偏振'
  if (dop > 0.99) {
    if (Math.abs(ellipticity) < 0.01) type = '线偏振'
    else if (Math.abs(ellipticity) > 0.99) type = S3 > 0 ? '右旋圆偏振' : '左旋圆偏振'
    else type = '椭圆偏振'
  } else if (dop < 0.01) {
    type = '自然光'
  }

  return { dop, angle, ellipticity, type }
}

// 庞加莱球组件
function PoincareSphere({
  stokes,
}: {
  stokes: StokesVector
}) {
  const { S0, S1, S2, S3 } = stokes
  const dop = Math.sqrt(S1 * S1 + S2 * S2 + S3 * S3) / (S0 + 0.001)

  // 球面上的点（归一化）
  const x = S1 / (S0 * dop + 0.001)
  const y = S2 / (S0 * dop + 0.001)
  const z = S3 / (S0 * dop + 0.001)

  return (
    <group>
      {/* 球体（半透明） */}
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial
          color="#1e3a5f"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </Sphere>
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial color="#374151" wireframe />
      </Sphere>

      {/* 坐标轴 */}
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="#ef4444" lineWidth={2} />
      <Line points={[[0, -2.5, 0], [0, 2.5, 0]]} color="#22c55e" lineWidth={2} />
      <Line points={[[0, 0, -2.5], [0, 0, 2.5]]} color="#3b82f6" lineWidth={2} />

      {/* 轴标签 */}
      <Text position={[2.8, 0, 0]} fontSize={0.3} color="#ef4444">S₁</Text>
      <Text position={[0, 2.8, 0]} fontSize={0.3} color="#22c55e">S₂</Text>
      <Text position={[0, 0, 2.8]} fontSize={0.3} color="#3b82f6">S₃</Text>

      {/* 关键点标注 */}
      <Sphere args={[0.08, 8, 8]} position={[2, 0, 0]}>
        <meshBasicMaterial color="#ef4444" />
      </Sphere>
      <Text position={[2, -0.4, 0]} fontSize={0.2} color="#94a3b8">H</Text>

      <Sphere args={[0.08, 8, 8]} position={[-2, 0, 0]}>
        <meshBasicMaterial color="#ef4444" />
      </Sphere>
      <Text position={[-2, -0.4, 0]} fontSize={0.2} color="#94a3b8">V</Text>

      <Sphere args={[0.08, 8, 8]} position={[0, 2, 0]}>
        <meshBasicMaterial color="#22c55e" />
      </Sphere>
      <Text position={[0, 2.4, 0]} fontSize={0.2} color="#94a3b8">+45°</Text>

      <Sphere args={[0.08, 8, 8]} position={[0, -2, 0]}>
        <meshBasicMaterial color="#22c55e" />
      </Sphere>
      <Text position={[0, -2.4, 0]} fontSize={0.2} color="#94a3b8">-45°</Text>

      <Sphere args={[0.08, 8, 8]} position={[0, 0, 2]}>
        <meshBasicMaterial color="#3b82f6" />
      </Sphere>
      <Text position={[0, 0.4, 2]} fontSize={0.2} color="#94a3b8">RCP</Text>

      <Sphere args={[0.08, 8, 8]} position={[0, 0, -2]}>
        <meshBasicMaterial color="#3b82f6" />
      </Sphere>
      <Text position={[0, 0.4, -2]} fontSize={0.2} color="#94a3b8">LCP</Text>

      {/* 当前偏振状态点 */}
      {dop > 0.01 && (
        <>
          <Sphere args={[0.15, 16, 16]} position={[x * 2, y * 2, z * 2]}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.3}
            />
          </Sphere>
          {/* 从原点到点的连线 */}
          <Line
            points={[[0, 0, 0], [x * 2, y * 2, z * 2]]}
            color="#fbbf24"
            lineWidth={2}
          />
        </>
      )}
    </group>
  )
}

// 偏振椭圆可视化
function PolarizationEllipse({
  stokes,
}: {
  stokes: StokesVector
}) {
  const params = stokesToParams(stokes)
  const timeRef = useRef(0)

  // 生成椭圆点
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segments = 64

    // 椭圆半长轴和半短轴
    const a = 1
    const b = Math.abs(params.ellipticity) * a
    const angle = (params.angle * Math.PI) / 180

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * 2 * Math.PI
      // 椭圆参数方程，然后旋转
      const ex = a * Math.cos(t)
      const ey = b * Math.sin(t)
      const x = ex * Math.cos(angle) - ey * Math.sin(angle)
      const y = ex * Math.sin(angle) + ey * Math.cos(angle)
      pts.push(new THREE.Vector3(x, y, 0))
    }
    return pts
  }, [params.angle, params.ellipticity])

  useFrame((_, delta) => {
    timeRef.current += delta
  })

  const isRightHanded = stokes.S3 > 0

  return (
    <group position={[0, 0, 3]}>
      {/* 椭圆 */}
      <Line
        points={points}
        color={isRightHanded ? '#22d3ee' : '#f472b6'}
        lineWidth={3}
      />
      {/* 旋转方向箭头 */}
      {Math.abs(params.ellipticity) > 0.01 && (
        <Text position={[1.3, 0, 0]} fontSize={0.25} color="#94a3b8">
          {isRightHanded ? '→ R' : '← L'}
        </Text>
      )}
      {/* 长轴方向 */}
      <Line
        points={[
          [-1.2 * Math.cos((params.angle * Math.PI) / 180), -1.2 * Math.sin((params.angle * Math.PI) / 180), 0],
          [1.2 * Math.cos((params.angle * Math.PI) / 180), 1.2 * Math.sin((params.angle * Math.PI) / 180), 0],
        ]}
        color="#fbbf24"
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
    </group>
  )
}

// 3D场景
function StokesScene({ stokes }: { stokes: StokesVector }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 庞加莱球 */}
      <PoincareSphere stokes={stokes} />

      {/* 偏振椭圆 */}
      <PolarizationEllipse stokes={stokes} />

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 斯托克斯矢量显示
function StokesDisplay({ stokes }: { stokes: StokesVector }) {
  const { S0, S1, S2, S3 } = stokes

  return (
    <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
      <div className="text-gray-400 mb-2">斯托克斯矢量 S =</div>
      <div className="flex items-center gap-2">
        <div className="text-2xl text-gray-500">[</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white w-8">S₀</span>
            <span className="text-cyan-400">{S0.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 w-8">S₁</span>
            <span className="text-cyan-400">{S1.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 w-8">S₂</span>
            <span className="text-cyan-400">{S2.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 w-8">S₃</span>
            <span className="text-cyan-400">{S3.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-2xl text-gray-500">]</div>
      </div>
    </div>
  )
}

// 预设偏振状态
const PRESETS = [
  { name: '水平线偏振', angle: 0, ellipticity: 0, dop: 1 },
  { name: '垂直线偏振', angle: 90, ellipticity: 0, dop: 1 },
  { name: '+45°线偏振', angle: 45, ellipticity: 0, dop: 1 },
  { name: '右旋圆偏振', angle: 0, ellipticity: 1, dop: 1 },
  { name: '左旋圆偏振', angle: 0, ellipticity: -1, dop: 1 },
  { name: '自然光', angle: 0, ellipticity: 0, dop: 0 },
]

// 主演示组件
export function StokesVectorDemo() {
  const [intensity, setIntensity] = useState(1)
  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [ellipticity, setEllipticity] = useState(0)
  const [dop, setDop] = useState(1)

  // 计算斯托克斯矢量
  const stokes = calculateStokes(intensity, polarizationAngle, ellipticity, dop)
  const params = stokesToParams(stokes)

  // 应用预设
  const applyPreset = (preset: typeof PRESETS[0]) => {
    setPolarizationAngle(preset.angle)
    setEllipticity(preset.ellipticity)
    setDop(preset.dop)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [4, 3, 5], fov: 50 }}
          gl={{ antialias: true }}
        >
          <StokesScene stokes={stokes} />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="偏振参数">
          <SliderControl
            label="光强度"
            value={intensity}
            min={0.1}
            max={2}
            step={0.1}
            onChange={setIntensity}
          />
          <SliderControl
            label="偏振角度"
            value={polarizationAngle}
            min={-90}
            max={90}
            step={5}
            unit="°"
            onChange={setPolarizationAngle}
          />
          <SliderControl
            label="椭圆度"
            value={ellipticity}
            min={-1}
            max={1}
            step={0.1}
            onChange={setEllipticity}
            formatValue={(v) => v.toFixed(1)}
          />
          <SliderControl
            label="偏振度"
            value={dop}
            min={0}
            max={1}
            step={0.05}
            onChange={setDop}
            formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </ControlPanel>

        <ControlPanel title="预设状态">
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="px-2 py-1.5 text-xs bg-slate-700/50 text-gray-300 rounded hover:bg-slate-600 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </ControlPanel>

        <ControlPanel title="斯托克斯矢量">
          <StokesDisplay stokes={stokes} />
        </ControlPanel>

        <ControlPanel title="偏振状态">
          <ValueDisplay label="偏振类型" value={params.type} color="cyan" />
          <ValueDisplay label="偏振度 (DOP)" value={(params.dop * 100).toFixed(0)} unit="%" />
          <ValueDisplay label="方位角" value={params.angle.toFixed(1)} unit="°" />
          <ValueDisplay
            label="旋向"
            value={ellipticity > 0.01 ? '右旋' : ellipticity < -0.01 ? '左旋' : '线偏振'}
            color={ellipticity > 0.01 ? 'cyan' : ellipticity < -0.01 ? 'purple' : 'orange'}
          />
        </ControlPanel>

        <InfoPanel title="斯托克斯参数含义">
          <div className="space-y-1 text-xs">
            <p><span className="text-white">S₀</span>: 总光强度</p>
            <p><span className="text-red-400">S₁</span>: 水平-垂直偏振分量差</p>
            <p><span className="text-green-400">S₂</span>: +45°-(-45°)偏振分量差</p>
            <p><span className="text-blue-400">S₃</span>: 右旋-左旋圆偏振分量差</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
