/**
 * 米氏散射演示 - Unit 4
 * 演示粒径与波长相当时的散射特性
 */
import { useState, useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Line, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup, InfoPanel } from '../DemoControls'
import { Demo2DCanvas } from '../Demo2DCanvas'

extend({ Line_: THREE.Line })

// 简化的米氏散射相函数计算
function miePhaseFunction(theta: number, sizeParameter: number): number {
  // 使用Henyey-Greenstein近似
  // 当x > 1时，前向散射增强
  const g = Math.min(0.9, sizeParameter / (sizeParameter + 2)) // 不对称因子
  const cosTheta = Math.cos(theta)

  const numerator = 1 - g * g
  const denominator = Math.pow(1 + g * g - 2 * g * cosTheta, 1.5)

  return numerator / (4 * Math.PI * denominator)
}

// 散射颗粒组件
function ScatteringParticle({
  position,
  radius,
}: {
  position: [number, number, number]
  radius: number
}) {
  return (
    <Sphere args={[radius, 32, 32]} position={position}>
      <meshStandardMaterial
        color="#a8d8ea"
        transparent
        opacity={0.6}
        roughness={0.3}
      />
    </Sphere>
  )
}

// 散射强度可视化
function ScatteringPattern({
  sizeParameter,
  wavelength,
}: {
  sizeParameter: number
  wavelength: number
}) {
  const timeRef = useRef(0)

  // 生成散射图案点
  const linePoints = useMemo(() => {
    const count = 100
    const points: [number, number, number][] = []

    for (let i = 0; i <= count; i++) {
      const theta = (i / count) * 2 * Math.PI
      const intensity = miePhaseFunction(theta, sizeParameter)
      const r = 2 + intensity * 3 // 基础半径 + 强度缩放

      points.push([r * Math.cos(theta), 0, r * Math.sin(theta)])
    }

    return points
  }, [sizeParameter])

  useFrame((_, delta) => {
    timeRef.current += delta
  })

  const [r, g, b] = wavelengthToRGB(wavelength)
  const color = new THREE.Color(r, g, b)

  return (
    <group>
      {/* 散射图案线条 */}
      <Line
        points={linePoints}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.8}
      />
    </group>
  )
}

// 波长到RGB转换
function wavelengthToRGB(wavelength: number): [number, number, number] {
  let R = 0, G = 0, B = 0

  if (wavelength >= 380 && wavelength < 440) {
    R = -(wavelength - 440) / (440 - 380)
    B = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    G = (wavelength - 440) / (490 - 440)
    B = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    G = 1
    B = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    R = (wavelength - 510) / (580 - 510)
    G = 1
  } else if (wavelength >= 580 && wavelength < 645) {
    R = 1
    G = -(wavelength - 645) / (645 - 580)
  } else if (wavelength >= 645 && wavelength <= 780) {
    R = 1
  }

  return [R, G, B]
}

// 入射光线
function IncidentLight({ wavelength }: { wavelength: number }) {
  const [r, g, b] = wavelengthToRGB(wavelength)
  const color = new THREE.Color(r, g, b)

  return (
    <group>
      <Line
        points={[
          [-6, 0, 0],
          [0, 0, 0],
        ]}
        color={color}
        lineWidth={4}
      />
      {/* 箭头 */}
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Text position={[-4, 0.5, 0]} fontSize={0.3} color="#94a3b8">
        入射光 (λ={wavelength}nm)
      </Text>
    </group>
  )
}

// 3D场景
function MieScene({
  particleSize,
  wavelength,
}: {
  particleSize: number
  wavelength: number
}) {
  // 尺寸参数 x = 2πr/λ
  const sizeParameter = (2 * Math.PI * particleSize * 1000) / wavelength

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} />

      {/* 入射光 */}
      <IncidentLight wavelength={wavelength} />

      {/* 散射颗粒 */}
      <ScatteringParticle position={[0, 0, 0]} radius={particleSize} />

      {/* 散射图案 */}
      <ScatteringPattern sizeParameter={sizeParameter} wavelength={wavelength} />

      {/* 标注 */}
      <Text position={[0, -2, 0]} fontSize={0.25} color="#94a3b8">
        粒径: {(particleSize * 1000).toFixed(0)}nm, x = {sizeParameter.toFixed(1)}
      </Text>

      {/* 前向散射方向标注 */}
      <Text position={[4, 0.5, 0]} fontSize={0.2} color="#22d3ee">
        前向散射
      </Text>
      <Text position={[-4, -0.5, 0]} fontSize={0.2} color="#f472b6">
        后向散射
      </Text>

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 角度分布图
function AngularDistributionChart({
  sizeParameter,
  wavelength,
}: {
  sizeParameter: number
  wavelength: number
}) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.min(width, height) / 2 - 30

      // 绘制参考圆
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      for (let r = maxRadius / 3; r <= maxRadius; r += maxRadius / 3) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI)
        ctx.stroke()
      }

      // 绘制角度参考线
      for (let angle = 0; angle < 360; angle += 45) {
        const rad = (angle * Math.PI) / 180
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + maxRadius * Math.cos(rad), centerY - maxRadius * Math.sin(rad))
        ctx.stroke()
      }

      // 角度标签
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.fillText('0°', centerX + maxRadius + 5, centerY + 4)
      ctx.fillText('90°', centerX - 10, centerY - maxRadius - 5)
      ctx.fillText('180°', centerX - maxRadius - 25, centerY + 4)
      ctx.fillText('270°', centerX - 10, centerY + maxRadius + 15)

      // 绘制散射图案
      const [r, g, b] = wavelengthToRGB(wavelength)
      ctx.strokeStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`
      ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, 0.3)`
      ctx.lineWidth = 2

      // 找最大值用于归一化
      let maxIntensity = 0
      for (let theta = 0; theta < 2 * Math.PI; theta += 0.1) {
        const intensity = miePhaseFunction(theta, sizeParameter)
        if (intensity > maxIntensity) maxIntensity = intensity
      }

      ctx.beginPath()
      for (let i = 0; i <= 360; i++) {
        const theta = (i * Math.PI) / 180
        const intensity = miePhaseFunction(theta, sizeParameter)
        const radius = (intensity / maxIntensity) * maxRadius * 0.9
        const x = centerX + radius * Math.cos(-theta + Math.PI)
        const y = centerY + radius * Math.sin(-theta + Math.PI)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // 入射方向箭头
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.moveTo(20, centerY - 5)
      ctx.lineTo(40, centerY)
      ctx.lineTo(20, centerY + 5)
      ctx.fill()
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('入射', 5, centerY - 10)
    },
    [sizeParameter, wavelength]
  )

  return <Demo2DCanvas width={280} height={280} draw={draw} />
}

// 粒径vs散射效率图
function SizeEfficiencyChart({ currentSize }: { currentSize: number }) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, width, height)

      const margin = { left: 50, right: 20, top: 20, bottom: 40 }
      const chartWidth = width - margin.left - margin.right
      const chartHeight = height - margin.top - margin.bottom

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
      ctx.fillText('0.01', margin.left - 5, height - margin.bottom + 15)
      ctx.fillText('1', margin.left + chartWidth / 2 - 5, height - margin.bottom + 15)
      ctx.fillText('10 μm', width - margin.right - 25, height - margin.bottom + 15)
      ctx.fillText('Q', margin.left - 15, margin.top + 5)
      ctx.fillText('r', width - margin.right + 5, height - margin.bottom)

      // 绘制散射效率曲线（简化模型）
      const colors = ['#ef4444', '#22c55e', '#3b82f6'] // RGB
      const wavelengths = [650, 550, 450]

      wavelengths.forEach((wavelength, idx) => {
        ctx.strokeStyle = colors[idx]
        ctx.lineWidth = 2
        ctx.beginPath()
        let started = false

        for (let logR = -2; logR <= 1; logR += 0.05) {
          const r = Math.pow(10, logR) // μm
          const x = 2 * Math.PI * r * 1000 / wavelength
          // 简化的散射效率
          let Q
          if (x < 0.5) {
            Q = x * x * x * x * 0.5 // Rayleigh
          } else if (x < 10) {
            Q = 2 - 2 * Math.exp(-x / 2) // 过渡区
          } else {
            Q = 2 // 几何极限
          }

          const px = margin.left + ((logR + 2) / 3) * chartWidth
          const py = height - margin.bottom - (Q / 3) * chartHeight

          if (!started) {
            ctx.moveTo(px, py)
            started = true
          } else {
            ctx.lineTo(px, py)
          }
        }
        ctx.stroke()
      })

      // 当前粒径标记
      const logCurrentSize = Math.log10(currentSize)
      const currentX = margin.left + ((logCurrentSize + 2) / 3) * chartWidth
      ctx.strokeStyle = '#fbbf24'
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(currentX, margin.top)
      ctx.lineTo(currentX, height - margin.bottom)
      ctx.stroke()
      ctx.setLineDash([])

      // 图例
      ctx.font = '9px sans-serif'
      ctx.fillStyle = '#ef4444'
      ctx.fillText('R', width - 55, 15)
      ctx.fillStyle = '#22c55e'
      ctx.fillText('G', width - 40, 15)
      ctx.fillStyle = '#3b82f6'
      ctx.fillText('B', width - 25, 15)
    },
    [currentSize]
  )

  return <Demo2DCanvas width={300} height={160} draw={draw} />
}

// 主演示组件
export function MieScatteringDemo() {
  const [particleSize, setParticleSize] = useState(0.5) // μm
  const [wavelength, setWavelength] = useState(550)

  // 尺寸参数
  const sizeParameter = (2 * Math.PI * particleSize * 1000) / wavelength

  // 散射类型判断
  const getScatteringType = () => {
    if (sizeParameter < 0.1) return '瑞利散射'
    if (sizeParameter < 10) return '米氏散射'
    return '几何光学'
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 8, 8], fov: 50 }}
          gl={{ antialias: true }}
        >
          <MieScene particleSize={particleSize} wavelength={wavelength} />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="参数控制">
          <SliderControl
            label="粒子半径"
            value={particleSize}
            min={0.01}
            max={5}
            step={0.01}
            onChange={setParticleSize}
            formatValue={(v) => `${(v * 1000).toFixed(0)} nm`}
          />
          <SliderControl
            label="入射波长"
            value={wavelength}
            min={400}
            max={700}
            step={10}
            unit=" nm"
            onChange={setWavelength}
          />
          <ButtonGroup
            label="预设粒径"
            options={[
              { value: 0.03, label: '30nm' },
              { value: 0.3, label: '300nm' },
              { value: 3, label: '3μm' },
            ]}
            value={particleSize}
            onChange={(v) => setParticleSize(v as number)}
          />
        </ControlPanel>

        <ControlPanel title="散射参数">
          <ValueDisplay label="尺寸参数 x = 2πr/λ" value={sizeParameter.toFixed(2)} />
          <ValueDisplay label="散射类型" value={getScatteringType()} color="cyan" />
          <ValueDisplay
            label="前向散射强度"
            value={(miePhaseFunction(0, sizeParameter) * 100).toFixed(1)}
          />
          <ValueDisplay
            label="后向散射强度"
            value={(miePhaseFunction(Math.PI, sizeParameter) * 100).toFixed(1)}
          />
        </ControlPanel>

        <ControlPanel title="角度分布">
          <AngularDistributionChart sizeParameter={sizeParameter} wavelength={wavelength} />
        </ControlPanel>

        <ControlPanel title="散射效率 vs 粒径">
          <SizeEfficiencyChart currentSize={particleSize} />
        </ControlPanel>

        <InfoPanel title="米氏散射特点">
          <div className="space-y-1 text-xs">
            <p>• 粒径 ≈ 波长时发生</p>
            <p>• 前向散射占主导</p>
            <p>• 散射不依赖波长（白云）</p>
            <p>• 计算复杂，需完整麦克斯韦方程</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
