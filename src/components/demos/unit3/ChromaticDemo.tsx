/**
 * 色偏振演示 - Unit 3
 * 演示双折射材料中白光的彩色干涉效应
 */
import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup } from '../DemoControls'
import { Demo2DCanvas } from '../Demo2DCanvas'

// 波长到RGB颜色转换
function wavelengthToRGB(wavelength: number): [number, number, number] {
  let R = 0, G = 0, B = 0

  if (wavelength >= 380 && wavelength < 440) {
    R = -(wavelength - 440) / (440 - 380)
    G = 0
    B = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    R = 0
    G = (wavelength - 440) / (490 - 440)
    B = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    R = 0
    G = 1
    B = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    R = (wavelength - 510) / (580 - 510)
    G = 1
    B = 0
  } else if (wavelength >= 580 && wavelength < 645) {
    R = 1
    G = -(wavelength - 645) / (645 - 580)
    B = 0
  } else if (wavelength >= 645 && wavelength <= 780) {
    R = 1
    G = 0
    B = 0
  }

  // 边缘衰减
  let factor = 1
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380)
  } else if (wavelength >= 700 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700)
  }

  return [R * factor, G * factor, B * factor]
}

// 计算透过强度（考虑相位延迟）
function calculateTransmission(
  wavelength: number,
  thickness: number,
  birefringence: number,
  polarizerAngle: number,
  analyzerAngle: number
): number {
  // 相位延迟 δ = 2π × Δn × d / λ
  const phaseRetardation = (2 * Math.PI * birefringence * thickness * 1000) / wavelength

  // 假设样品45度放置，偏振角相对于样品
  const theta1 = ((polarizerAngle - 45) * Math.PI) / 180
  const theta2 = ((analyzerAngle - 45) * Math.PI) / 180

  // 简化的透过率公式
  const transmission =
    Math.pow(Math.cos(theta1 - theta2), 2) -
    Math.sin(2 * theta1) * Math.sin(2 * theta2) * Math.pow(Math.sin(phaseRetardation / 2), 2)

  return Math.max(0, Math.min(1, transmission))
}

// 计算混合颜色
function calculateMixedColor(
  thickness: number,
  birefringence: number,
  polarizerAngle: number,
  analyzerAngle: number
): { r: number; g: number; b: number } {
  let totalR = 0, totalG = 0, totalB = 0
  let totalWeight = 0

  // 对可见光谱积分
  for (let wavelength = 400; wavelength <= 700; wavelength += 5) {
    const transmission = calculateTransmission(
      wavelength,
      thickness,
      birefringence,
      polarizerAngle,
      analyzerAngle
    )
    const [r, g, b] = wavelengthToRGB(wavelength)
    totalR += r * transmission
    totalG += g * transmission
    totalB += b * transmission
    totalWeight += transmission
  }

  if (totalWeight < 0.01) {
    return { r: 0, g: 0, b: 0 }
  }

  // 归一化并增强对比度
  const maxChannel = Math.max(totalR, totalG, totalB, 0.01)
  return {
    r: Math.min(1, (totalR / maxChannel) * 1.2),
    g: Math.min(1, (totalG / maxChannel) * 1.2),
    b: Math.min(1, (totalB / maxChannel) * 1.2),
  }
}

// 双折射样品组件
function BirefringentSample({
  position,
  thickness,
}: {
  position: [number, number, number]
  thickness: number
  birefringence: number
}) {
  return (
    <group position={position}>
      <Cylinder args={[1.2, 1.2, thickness * 5, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#a8d8ea"
          transparent
          opacity={0.4 + thickness * 0.3}
        />
      </Cylinder>
      <Text position={[0, -1.8, 0]} fontSize={0.2} color="#94a3b8">
        双折射样品 (d = {thickness.toFixed(2)} mm)
      </Text>
    </group>
  )
}

// 偏振片组件
function Polarizer({
  position,
  angle,
  label,
  color = '#22d3ee',
}: {
  position: [number, number, number]
  angle: number
  label: string
  color?: string
}) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, (angle * Math.PI) / 180]}>
        <ringGeometry args={[0.6, 0.8, 32]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, (angle * Math.PI) / 180]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, -1.2, 0]} fontSize={0.2} color="#94a3b8">
        {label} ({angle}°)
      </Text>
    </group>
  )
}

// 观察屏组件
function ObservationScreen({
  position,
  color,
}: {
  position: [number, number, number]
  color: { r: number; g: number; b: number }
}) {
  const threeColor = new THREE.Color(color.r, color.g, color.b)

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={0.3}
        />
      </mesh>
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="#94a3b8">
        观察屏
      </Text>
    </group>
  )
}

// 3D场景
function ChromaticScene({
  thickness,
  birefringence,
  polarizerAngle,
  analyzerAngle,
}: {
  thickness: number
  birefringence: number
  polarizerAngle: number
  analyzerAngle: number
}) {
  const color = calculateMixedColor(thickness, birefringence, polarizerAngle, analyzerAngle)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 白光光源 */}
      <group position={[-5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <pointLight color="#ffffff" intensity={1} distance={3} />
        <Text position={[0, -1, 0]} fontSize={0.2} color="#94a3b8">
          白光
        </Text>
      </group>

      {/* 起偏器 */}
      <Polarizer position={[-3, 0, 0]} angle={polarizerAngle} label="起偏器" />

      {/* 双折射样品 */}
      <BirefringentSample position={[0, 0, 0]} thickness={thickness} birefringence={birefringence} />

      {/* 检偏器 */}
      <Polarizer position={[3, 0, 0]} angle={analyzerAngle} label="检偏器" color="#a78bfa" />

      {/* 观察屏 */}
      <ObservationScreen position={[5.5, 0, 0]} color={color} />

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 光谱透过率图
function SpectrumChart({
  thickness,
  birefringence,
  polarizerAngle,
  analyzerAngle,
}: {
  thickness: number
  birefringence: number
  polarizerAngle: number
  analyzerAngle: number
}) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, width, height)

      const margin = { left: 50, right: 20, top: 20, bottom: 40 }
      const chartWidth = width - margin.left - margin.right
      const chartHeight = height - margin.top - margin.bottom

      // 绘制光谱背景
      const gradient = ctx.createLinearGradient(margin.left, 0, width - margin.right, 0)
      for (let i = 0; i <= 10; i++) {
        const wavelength = 400 + (i / 10) * 300
        const [r, g, b] = wavelengthToRGB(wavelength)
        gradient.addColorStop(i / 10, `rgba(${r * 255}, ${g * 255}, ${b * 255}, 0.3)`)
      }
      ctx.fillStyle = gradient
      ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight)

      // 坐标轴
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(margin.left, margin.top)
      ctx.lineTo(margin.left, height - margin.bottom)
      ctx.lineTo(width - margin.right, height - margin.bottom)
      ctx.stroke()

      // 标签
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.fillText('400nm', margin.left - 5, height - margin.bottom + 15)
      ctx.fillText('550nm', margin.left + chartWidth / 2 - 15, height - margin.bottom + 15)
      ctx.fillText('700nm', width - margin.right - 25, height - margin.bottom + 15)
      ctx.fillText('T', margin.left - 15, margin.top + 10)

      // 绘制透过率曲线
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let wavelength = 400; wavelength <= 700; wavelength += 2) {
        const transmission = calculateTransmission(
          wavelength,
          thickness,
          birefringence,
          polarizerAngle,
          analyzerAngle
        )
        const x = margin.left + ((wavelength - 400) / 300) * chartWidth
        const y = height - margin.bottom - transmission * chartHeight
        if (wavelength === 400) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    },
    [thickness, birefringence, polarizerAngle, analyzerAngle]
  )

  return <Demo2DCanvas width={350} height={180} draw={draw} />
}

// 颜色显示面板
function ColorDisplay({
  thickness,
  birefringence,
  polarizerAngle,
  analyzerAngle,
}: {
  thickness: number
  birefringence: number
  polarizerAngle: number
  analyzerAngle: number
}) {
  const color = calculateMixedColor(thickness, birefringence, polarizerAngle, analyzerAngle)
  const rgbString = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`

  return (
    <div className="space-y-3">
      <div
        className="w-full h-20 rounded-lg border border-slate-600"
        style={{ backgroundColor: rgbString }}
      />
      <div className="text-xs text-gray-400 text-center font-mono">{rgbString}</div>
    </div>
  )
}

// 主演示组件
export function ChromaticDemo() {
  const [thickness, setThickness] = useState(0.1)
  const [birefringence, setBirefringence] = useState(0.01)
  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [analyzerAngle, setAnalyzerAngle] = useState(90)

  // 预设材料
  const materials = [
    { name: '塑料薄膜', br: 0.005 },
    { name: '云母片', br: 0.04 },
    { name: '方解石', br: 0.172 },
  ]

  // 计算相位延迟
  const phaseRetardation = (2 * Math.PI * birefringence * thickness * 1000) / 550 // 在550nm处
  const retardationOrders = phaseRetardation / (2 * Math.PI)

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 4, 10], fov: 50 }}
          gl={{ antialias: true }}
        >
          <ChromaticScene
            thickness={thickness}
            birefringence={birefringence}
            polarizerAngle={polarizerAngle}
            analyzerAngle={analyzerAngle}
          />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-96 space-y-4">
        <ControlPanel title="样品参数">
          <SliderControl
            label="样品厚度"
            value={thickness}
            min={0.01}
            max={0.5}
            step={0.01}
            unit=" mm"
            onChange={setThickness}
          />
          <SliderControl
            label="双折射率"
            value={birefringence}
            min={0.001}
            max={0.2}
            step={0.001}
            onChange={setBirefringence}
            formatValue={(v) => v.toFixed(3)}
          />
          <ButtonGroup
            label="预设材料"
            options={materials.map((m) => ({ value: m.br, label: m.name }))}
            value={birefringence}
            onChange={(v) => setBirefringence(v as number)}
          />
        </ControlPanel>

        <ControlPanel title="偏振设置">
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
          <div className="flex gap-2">
            <button
              onClick={() => setAnalyzerAngle(polarizerAngle)}
              className="flex-1 py-1.5 text-xs bg-slate-700 text-gray-300 rounded hover:bg-slate-600"
            >
              平行设置
            </button>
            <button
              onClick={() => setAnalyzerAngle((polarizerAngle + 90) % 180)}
              className="flex-1 py-1.5 text-xs bg-slate-700 text-gray-300 rounded hover:bg-slate-600"
            >
              正交设置
            </button>
          </div>
        </ControlPanel>

        <ControlPanel title="相位延迟">
          <ValueDisplay label="Δn × d" value={(birefringence * thickness * 1000).toFixed(1)} unit=" nm" />
          <ValueDisplay label="相位延迟 (550nm)" value={(phaseRetardation * 180 / Math.PI).toFixed(0)} unit="°" />
          <ValueDisplay label="延迟级次" value={retardationOrders.toFixed(2)} />
        </ControlPanel>

        <ControlPanel title="观察到的颜色">
          <ColorDisplay
            thickness={thickness}
            birefringence={birefringence}
            polarizerAngle={polarizerAngle}
            analyzerAngle={analyzerAngle}
          />
        </ControlPanel>

        <ControlPanel title="光谱透过率">
          <SpectrumChart
            thickness={thickness}
            birefringence={birefringence}
            polarizerAngle={polarizerAngle}
            analyzerAngle={analyzerAngle}
          />
        </ControlPanel>
      </div>
    </div>
  )
}
