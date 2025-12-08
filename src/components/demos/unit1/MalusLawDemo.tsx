/**
 * 马吕斯定律演示 - Unit 1
 * I = I₀ × cos²(θ)
 */
import { useState, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line, Text, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, Formula } from '../DemoControls'

// 偏振片3D组件
function Polarizer({
  position,
  angle,
  color = '#22d3ee',
  label,
}: {
  position: [number, number, number]
  angle: number
  color?: string
  label?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <group position={position}>
      {/* 偏振片框架 */}
      <mesh ref={meshRef} rotation={[0, 0, (angle * Math.PI) / 180]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* 中心滤光片 */}
      <mesh rotation={[0, 0, (angle * Math.PI) / 180]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 透光轴指示线 */}
      <Line
        points={[
          [0, -1.2, 0],
          [0, 1.2, 0],
        ]}
        color={color}
        lineWidth={3}
        rotation={[0, 0, (angle * Math.PI) / 180]}
      />
      {/* 标签 */}
      {label && (
        <Text position={[0, -1.8, 0]} fontSize={0.3} color="#94a3b8">
          {label}
        </Text>
      )}
    </group>
  )
}

// 光束组件
function LightBeam({
  start,
  end,
  intensity,
  polarizationAngle,
}: {
  start: [number, number, number]
  end: [number, number, number]
  intensity: number
  polarizationAngle: number
}) {
  // 根据偏振角度选择颜色
  const color = useMemo(() => {
    const colors: Record<number, string> = {
      0: '#ff4444',
      45: '#ffaa00',
      90: '#44ff44',
      135: '#4444ff',
    }
    // 找最近的标准角度
    const normalizedAngle = ((polarizationAngle % 180) + 180) % 180
    const closest = [0, 45, 90, 135].reduce((a, b) =>
      Math.abs(b - normalizedAngle) < Math.abs(a - normalizedAngle) ? b : a
    )
    return colors[closest] || '#ffff00'
  }, [polarizationAngle])

  if (intensity <= 0) return null

  const opacity = Math.max(0.2, intensity)

  return (
    <group>
      {/* 主光束 */}
      <Line
        points={[start, end]}
        color={color}
        lineWidth={3 * intensity}
        transparent
        opacity={opacity}
      />
    </group>
  )
}

// 光源组件
function LightSource({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.3, 0.4, 0.6, 16]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </Cylinder>
      <pointLight color="#fbbf24" intensity={1} distance={3} />
      <Text position={[0, -1.2, 0]} fontSize={0.3} color="#94a3b8">
        光源
      </Text>
    </group>
  )
}

// 屏幕/探测器组件
function Screen({
  position,
  intensity,
}: {
  position: [number, number, number]
  intensity: number
}) {
  const brightness = Math.max(0.1, intensity)

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.1, 2, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={brightness * 0.5}
        />
      </mesh>
      <Text position={[0.3, -1.5, 0]} fontSize={0.25} color="#94a3b8">
        屏幕 (I = {(intensity * 100).toFixed(0)}%)
      </Text>
    </group>
  )
}

// 3D场景
function MalusScene({
  polarizerAngle,
  analyzerAngle,
}: {
  polarizerAngle: number
  analyzerAngle: number
}) {
  // 计算透过强度 (马吕斯定律)
  const angleDiff = Math.abs(polarizerAngle - analyzerAngle)
  const effectiveAngle = angleDiff > 90 ? 180 - angleDiff : angleDiff
  const intensity = Math.pow(Math.cos((effectiveAngle * Math.PI) / 180), 2)

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 光源 */}
      <LightSource position={[-4, 0, 0]} />

      {/* 起偏器 */}
      <Polarizer position={[-2, 0, 0]} angle={polarizerAngle} color="#22d3ee" label="起偏器" />

      {/* 检偏器 */}
      <Polarizer position={[2, 0, 0]} angle={analyzerAngle} color="#a78bfa" label="检偏器" />

      {/* 屏幕 */}
      <Screen position={[5, 0, 0]} intensity={intensity} />

      {/* 光束：光源到起偏器（自然光） */}
      <LightBeam
        start={[-3.5, 0, 0]}
        end={[-2.5, 0, 0]}
        intensity={1}
        polarizationAngle={0}
      />

      {/* 光束：起偏器到检偏器（偏振光） */}
      <LightBeam
        start={[-1.5, 0, 0]}
        end={[1.5, 0, 0]}
        intensity={1}
        polarizationAngle={polarizerAngle}
      />

      {/* 光束：检偏器到屏幕 */}
      <LightBeam
        start={[2.5, 0, 0]}
        end={[4.5, 0, 0]}
        intensity={intensity}
        polarizationAngle={analyzerAngle}
      />

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 强度图表
function IntensityChart({
  polarizerAngle,
  analyzerAngle,
}: {
  polarizerAngle: number
  analyzerAngle: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useMemo(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 280
    const height = 150
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 清除
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    // 绘制cos²曲线
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, height - 30)
    ctx.lineTo(width - 20, height - 30)
    ctx.moveTo(40, height - 30)
    ctx.lineTo(40, 20)
    ctx.stroke()

    // 曲线
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x <= 180; x++) {
      const y = Math.pow(Math.cos((x * Math.PI) / 180), 2)
      const px = 40 + (x / 180) * (width - 60)
      const py = height - 30 - y * (height - 50)
      if (x === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // 当前点
    const currentAngle = Math.abs(polarizerAngle - analyzerAngle) % 180
    const currentIntensity = Math.pow(Math.cos((currentAngle * Math.PI) / 180), 2)
    const px = 40 + (currentAngle / 180) * (width - 60)
    const py = height - 30 - currentIntensity * (height - 50)

    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, 2 * Math.PI)
    ctx.fill()

    // 标签
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.fillText('0°', 35, height - 15)
    ctx.fillText('90°', width / 2 - 10, height - 15)
    ctx.fillText('180°', width - 35, height - 15)
    ctx.fillText('θ', width - 15, height - 20)
    ctx.fillText('I/I₀', 15, 15)
  }, [polarizerAngle, analyzerAngle])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{ width: 280, height: 150 }}
    />
  )
}

// 主演示组件
export function MalusLawDemo() {
  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [analyzerAngle, setAnalyzerAngle] = useState(45)

  // 计算透过强度
  const angleDiff = Math.abs(polarizerAngle - analyzerAngle)
  const effectiveAngle = angleDiff > 90 ? 180 - angleDiff : angleDiff
  const intensity = Math.pow(Math.cos((effectiveAngle * Math.PI) / 180), 2)

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 50 }}
          gl={{ antialias: true }}
        >
          <MalusScene polarizerAngle={polarizerAngle} analyzerAngle={analyzerAngle} />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="参数控制">
          <SliderControl
            label="起偏器角度"
            value={polarizerAngle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={setPolarizerAngle}
          />
          <SliderControl
            label="检偏器角度"
            value={analyzerAngle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={setAnalyzerAngle}
          />
        </ControlPanel>

        <ControlPanel title="计算结果">
          <ValueDisplay label="角度差 θ" value={effectiveAngle.toFixed(0)} unit="°" />
          <ValueDisplay label="cos²(θ)" value={Math.pow(Math.cos((effectiveAngle * Math.PI) / 180), 2).toFixed(3)} />
          <ValueDisplay
            label="透过强度"
            value={(intensity * 100).toFixed(1)}
            unit="%"
            color={intensity > 0.5 ? 'green' : intensity > 0.2 ? 'orange' : 'red'}
          />
          <Formula>I = I₀ × cos²(θ)</Formula>
        </ControlPanel>

        <ControlPanel title="强度曲线">
          <IntensityChart polarizerAngle={polarizerAngle} analyzerAngle={analyzerAngle} />
        </ControlPanel>
      </div>
    </div>
  )
}
