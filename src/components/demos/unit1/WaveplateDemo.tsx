/**
 * 波片原理演示 - Unit 1
 * 演示四分之一波片和二分之一波片对偏振态的影响
 */
import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text, Ring } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup, InfoPanel, Formula } from '../DemoControls'

// 波片组件
function Waveplate({
  position,
  fastAxisAngle,
  type,
}: {
  position: [number, number, number]
  fastAxisAngle: number
  type: 'quarter' | 'half'
}) {
  const color = type === 'quarter' ? '#a78bfa' : '#f472b6'
  const label = type === 'quarter' ? 'λ/4 波片' : 'λ/2 波片'

  return (
    <group position={position}>
      {/* 波片本体 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
      {/* 快轴指示 */}
      <Line
        points={[
          [0, -1, 0],
          [0, 1, 0],
        ]}
        color="#fbbf24"
        lineWidth={3}
        rotation={[0, 0, (fastAxisAngle * Math.PI) / 180]}
      />
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.15}
        color="#fbbf24"
        rotation={[0, 0, (fastAxisAngle * Math.PI) / 180]}
      >
        快轴
      </Text>
      {/* 慢轴指示 */}
      <Line
        points={[
          [-1, 0, 0],
          [1, 0, 0],
        ]}
        color="#60a5fa"
        lineWidth={2}
        rotation={[0, 0, (fastAxisAngle * Math.PI) / 180]}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="#94a3b8">
        {label}
      </Text>
    </group>
  )
}

// 偏振态可视化
function PolarizationState({
  position,
  polarizationType,
  angle,
  label,
}: {
  position: [number, number, number]
  polarizationType: 'linear' | 'circular-r' | 'circular-l' | 'elliptical'
  angle: number
  label: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta
  })

  const color =
    polarizationType === 'linear'
      ? '#ffaa00'
      : polarizationType === 'circular-r'
        ? '#22d3ee'
        : polarizationType === 'circular-l'
          ? '#f472b6'
          : '#a78bfa'

  return (
    <group position={position} ref={groupRef}>
      {polarizationType === 'linear' ? (
        // 线偏振 - 双向箭头
        <Line
          points={[
            [-0.6, 0, 0],
            [0.6, 0, 0],
          ]}
          color={color}
          lineWidth={4}
          rotation={[0, 0, (angle * Math.PI) / 180]}
        />
      ) : polarizationType === 'circular-r' || polarizationType === 'circular-l' ? (
        // 圆偏振 - 圆环
        <Ring args={[0.4, 0.5, 32]}>
          <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </Ring>
      ) : (
        // 椭圆偏振
        <mesh rotation={[0, 0, (angle * Math.PI) / 180]}>
          <torusGeometry args={[0.4, 0.05, 8, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
      <Text position={[0, -1, 0]} fontSize={0.2} color="#94a3b8">
        {label}
      </Text>
    </group>
  )
}

// 光束与偏振演示
function AnimatedPolarizationBeam({
  start,
  end,
  inputType,
}: {
  start: [number, number, number]
  end: [number, number, number]
  inputType: 'linear' | 'circular-r' | 'circular-l' | 'elliptical'
  outputType: 'linear' | 'circular-r' | 'circular-l' | 'elliptical'
  inputAngle: number
  outputAngle: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta
  })

  const getColor = (type: string) => {
    switch (type) {
      case 'linear':
        return '#ffaa00'
      case 'circular-r':
        return '#22d3ee'
      case 'circular-l':
        return '#f472b6'
      default:
        return '#a78bfa'
    }
  }

  return (
    <group ref={groupRef}>
      <Line
        points={[start, end]}
        color={getColor(inputType)}
        lineWidth={2}
        transparent
        opacity={0.5}
      />
    </group>
  )
}

// 3D场景
function WaveplateScene({
  waveplateType,
  inputAngle,
  fastAxisAngle,
}: {
  waveplateType: 'quarter' | 'half'
  inputAngle: number
  fastAxisAngle: number
}) {
  // 计算输出偏振态
  const calculateOutput = () => {
    const relativeAngle = inputAngle - fastAxisAngle
    const normalizedAngle = ((relativeAngle % 180) + 180) % 180

    if (waveplateType === 'quarter') {
      // λ/4 波片
      if (normalizedAngle === 45 || normalizedAngle === 135) {
        return { type: 'circular-r' as const, angle: 0 }
      } else if (normalizedAngle === 0 || normalizedAngle === 90) {
        return { type: 'linear' as const, angle: inputAngle }
      } else {
        return { type: 'elliptical' as const, angle: inputAngle }
      }
    } else {
      // λ/2 波片：偏振面旋转 2θ
      const outputAngle = 2 * fastAxisAngle - inputAngle
      return { type: 'linear' as const, angle: outputAngle }
    }
  }

  const output = calculateOutput()

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 光源 */}
      <group position={[-4, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, -0.8, 0]} fontSize={0.2} color="#94a3b8">
          线偏振光源
        </Text>
      </group>

      {/* 输入偏振态 */}
      <PolarizationState
        position={[-2.5, 0, 0]}
        polarizationType="linear"
        angle={inputAngle}
        label={`输入: ${inputAngle}°`}
      />

      {/* 输入光束 */}
      <AnimatedPolarizationBeam
        start={[-3.5, 0, 0]}
        end={[-1.2, 0, 0]}
        inputType="linear"
        outputType="linear"
        inputAngle={inputAngle}
        outputAngle={inputAngle}
      />

      {/* 波片 */}
      <Waveplate position={[0, 0, 0]} fastAxisAngle={fastAxisAngle} type={waveplateType} />

      {/* 输出光束 */}
      <AnimatedPolarizationBeam
        start={[1.2, 0, 0]}
        end={[3.5, 0, 0]}
        inputType={output.type}
        outputType={output.type}
        inputAngle={output.angle}
        outputAngle={output.angle}
      />

      {/* 输出偏振态 */}
      <PolarizationState
        position={[2.5, 0, 0]}
        polarizationType={output.type}
        angle={output.angle}
        label={
          output.type === 'linear'
            ? `输出: ${((output.angle % 180) + 180) % 180}°`
            : output.type === 'circular-r'
              ? '右旋圆偏振'
              : '椭圆偏振'
        }
      />

      {/* 屏幕 */}
      <group position={[5, 0, 0]}>
        <mesh>
          <planeGeometry args={[1.5, 2]} />
          <meshStandardMaterial color="#1e293b" side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, -1.3, 0]} fontSize={0.2} color="#94a3b8">
          观察屏
        </Text>
      </group>

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 相位延迟图
function PhaseRetardationDiagram({
  waveplateType,
  relativeAngle,
}: {
  waveplateType: 'quarter' | 'half'
  relativeAngle: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useMemo(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 280
    const height = 160
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 清除
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    const centerY = height / 2
    const wavelength = 60

    // 绘制两个正弦波
    const amplitude = 40
    const phase = waveplateType === 'quarter' ? Math.PI / 2 : Math.PI

    // 快轴分量
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const y = centerY + amplitude * 0.5 * Math.sin((2 * Math.PI * x) / wavelength)
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 慢轴分量（延迟）
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const y = centerY - amplitude * 0.5 * Math.sin((2 * Math.PI * x) / wavelength + phase)
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 相位差标注
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('快轴', 10, 30)
    ctx.fillStyle = '#fbbf24'
    ctx.fillText('—', 35, 30)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('慢轴', 10, height - 20)
    ctx.fillStyle = '#60a5fa'
    ctx.fillText('—', 35, height - 20)

    const phaseText = waveplateType === 'quarter' ? 'Δφ = π/2 (λ/4)' : 'Δφ = π (λ/2)'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText(phaseText, width - 90, 20)
  }, [waveplateType, relativeAngle])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{ width: 280, height: 160 }}
    />
  )
}

// 主演示组件
export function WaveplateDemo() {
  const [waveplateType, setWaveplateType] = useState<'quarter' | 'half'>('quarter')
  const [inputAngle, setInputAngle] = useState(45)
  const [fastAxisAngle, setFastAxisAngle] = useState(0)

  const relativeAngle = ((inputAngle - fastAxisAngle) % 180 + 180) % 180

  // 计算输出偏振态描述
  const getOutputDescription = () => {
    if (waveplateType === 'quarter') {
      if (relativeAngle === 45 || relativeAngle === 135) {
        return '圆偏振光'
      } else if (relativeAngle === 0 || relativeAngle === 90) {
        return '线偏振光（不变）'
      } else {
        return '椭圆偏振光'
      }
    } else {
      const outputAngle = ((2 * fastAxisAngle - inputAngle) % 180 + 180) % 180
      return `线偏振光 (${outputAngle.toFixed(0)}°)`
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 50 }}
          gl={{ antialias: true }}
        >
          <WaveplateScene
            waveplateType={waveplateType}
            inputAngle={inputAngle}
            fastAxisAngle={fastAxisAngle}
          />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="波片类型">
          <ButtonGroup
            label=""
            options={[
              { value: 'quarter', label: 'λ/4 波片' },
              { value: 'half', label: 'λ/2 波片' },
            ]}
            value={waveplateType}
            onChange={(v) => setWaveplateType(v as 'quarter' | 'half')}
          />
        </ControlPanel>

        <ControlPanel title="参数控制">
          <SliderControl
            label="入射偏振角度"
            value={inputAngle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={setInputAngle}
          />
          <SliderControl
            label="快轴方向"
            value={fastAxisAngle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={setFastAxisAngle}
          />
        </ControlPanel>

        <ControlPanel title="计算结果">
          <ValueDisplay label="相对角度" value={relativeAngle.toFixed(0)} unit="°" />
          <ValueDisplay label="输出偏振态" value={getOutputDescription()} />
          {waveplateType === 'half' && (
            <Formula>θ_out = 2θ_fast - θ_in</Formula>
          )}
        </ControlPanel>

        <ControlPanel title="相位延迟">
          <PhaseRetardationDiagram
            waveplateType={waveplateType}
            relativeAngle={relativeAngle}
          />
        </ControlPanel>

        <InfoPanel title="波片功能">
          <div className="space-y-2 text-xs">
            {waveplateType === 'quarter' ? (
              <>
                <p><strong>四分之一波片 (λ/4):</strong></p>
                <p>• 相位延迟: π/2 (90°)</p>
                <p>• 45°线偏振 → 圆偏振</p>
                <p>• 0°/90°线偏振 → 不变</p>
              </>
            ) : (
              <>
                <p><strong>二分之一波片 (λ/2):</strong></p>
                <p>• 相位延迟: π (180°)</p>
                <p>• 旋转线偏振方向</p>
                <p>• 旋转角度 = 2×快轴角度</p>
              </>
            )}
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
