/**
 * 菲涅尔方程演示 - Unit 2
 * 演示s偏振和p偏振的反射/透射系数随入射角的变化
 */
import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line, Text, Plane } from '@react-three/drei'
import * as THREE from 'three'
import { SliderControl, ControlPanel, ValueDisplay, InfoPanel } from '../DemoControls'
import { Demo2DCanvas } from '../Demo2DCanvas'

// 菲涅尔方程计算
function fresnelEquations(theta1: number, n1: number, n2: number) {
  const rad = (theta1 * Math.PI) / 180
  const sinTheta1 = Math.sin(rad)
  const cosTheta1 = Math.cos(rad)

  // 斯涅尔定律
  const sinTheta2 = (n1 / n2) * sinTheta1

  // 全内反射检查
  if (sinTheta2 > 1) {
    return {
      rs: 1,
      rp: 1,
      ts: 0,
      tp: 0,
      theta2: 90,
      totalReflection: true,
    }
  }

  const cosTheta2 = Math.sqrt(1 - sinTheta2 * sinTheta2)
  const theta2 = (Math.asin(sinTheta2) * 180) / Math.PI

  // s偏振（垂直于入射面）
  const rs = (n1 * cosTheta1 - n2 * cosTheta2) / (n1 * cosTheta1 + n2 * cosTheta2)
  const ts = (2 * n1 * cosTheta1) / (n1 * cosTheta1 + n2 * cosTheta2)

  // p偏振（平行于入射面）
  const rp = (n2 * cosTheta1 - n1 * cosTheta2) / (n2 * cosTheta1 + n1 * cosTheta2)
  const tp = (2 * n1 * cosTheta1) / (n2 * cosTheta1 + n1 * cosTheta2)

  return {
    rs,
    rp,
    ts,
    tp,
    theta2,
    totalReflection: false,
  }
}

// 界面组件
function Interface({ n1, n2 }: { n1: number; n2: number }) {
  return (
    <group>
      {/* 介质1（上方） */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[8, 3, 4]} />
        <meshStandardMaterial color="#1e3a5f" transparent opacity={0.2} />
      </mesh>
      {/* 介质2（下方） */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[8, 3, 4]} />
        <meshStandardMaterial color="#1e5f3a" transparent opacity={0.3} />
      </mesh>
      {/* 界面 */}
      <Plane args={[8, 4]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#64748b" transparent opacity={0.5} side={THREE.DoubleSide} />
      </Plane>
      {/* 法线 */}
      <Line
        points={[
          [0, -2, 0],
          [0, 2, 0],
        ]}
        color="#94a3b8"
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      {/* 标签 */}
      <Text position={[-3.5, 2, 0]} fontSize={0.25} color="#60a5fa">
        n₁ = {n1.toFixed(2)}
      </Text>
      <Text position={[-3.5, -2, 0]} fontSize={0.25} color="#4ade80">
        n₂ = {n2.toFixed(2)}
      </Text>
    </group>
  )
}

// 光线组件
function LightRay({
  start,
  end,
  color,
  intensity,
  label,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
  intensity: number
  label?: string
  polarization?: 's' | 'p'
}) {
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2 + 0.5,
  ]

  if (intensity < 0.01) return null

  return (
    <group>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={Math.max(1, 4 * intensity)}
        transparent
        opacity={Math.max(0.3, intensity)}
      />
      {/* 箭头 */}
      <mesh position={end}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {label && (
        <Text position={midPoint} fontSize={0.2} color={color}>
          {label} ({(intensity * 100).toFixed(0)}%)
        </Text>
      )}
    </group>
  )
}

// 3D场景
function FresnelScene({
  incidentAngle,
  n1,
  n2,
  showS,
  showP,
}: {
  incidentAngle: number
  n1: number
  n2: number
  showS: boolean
  showP: boolean
}) {
  const fresnel = fresnelEquations(incidentAngle, n1, n2)
  const rad = (incidentAngle * Math.PI) / 180
  const refractRad = (fresnel.theta2 * Math.PI) / 180

  // 计算光线端点
  const incidentStart: [number, number, number] = [
    -3 * Math.sin(rad),
    3 * Math.cos(rad),
    0,
  ]
  const incidentEnd: [number, number, number] = [0, 0, 0]

  const reflectEnd: [number, number, number] = [
    3 * Math.sin(rad),
    3 * Math.cos(rad),
    0,
  ]

  const refractEnd: [number, number, number] = fresnel.totalReflection
    ? [0, 0, 0]
    : [3 * Math.sin(refractRad), -3 * Math.cos(refractRad), 0]

  // 强度（反射率）
  const Rs = fresnel.rs * fresnel.rs
  const Rp = fresnel.rp * fresnel.rp
  const Ts = 1 - Rs
  const Tp = 1 - Rp

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <Interface n1={n1} n2={n2} />

      {/* s偏振光线 */}
      {showS && (
        <>
          <LightRay
            start={incidentStart}
            end={incidentEnd}
            color="#22d3ee"
            intensity={1}
            label="入射 s"
            polarization="s"
          />
          <LightRay
            start={incidentEnd}
            end={reflectEnd}
            color="#22d3ee"
            intensity={Rs}
            label={`反射 Rs`}
            polarization="s"
          />
          {!fresnel.totalReflection && (
            <LightRay
              start={incidentEnd}
              end={refractEnd}
              color="#22d3ee"
              intensity={Ts}
              label={`透射 Ts`}
              polarization="s"
            />
          )}
        </>
      )}

      {/* p偏振光线 */}
      {showP && (
        <>
          <LightRay
            start={[incidentStart[0], incidentStart[1], incidentStart[2] + 0.3]}
            end={[incidentEnd[0], incidentEnd[1], incidentEnd[2] + 0.3]}
            color="#f472b6"
            intensity={1}
            label="入射 p"
            polarization="p"
          />
          <LightRay
            start={[incidentEnd[0], incidentEnd[1], incidentEnd[2] + 0.3]}
            end={[reflectEnd[0], reflectEnd[1], reflectEnd[2] + 0.3]}
            color="#f472b6"
            intensity={Rp}
            label={`反射 Rp`}
            polarization="p"
          />
          {!fresnel.totalReflection && (
            <LightRay
              start={[incidentEnd[0], incidentEnd[1], incidentEnd[2] + 0.3]}
              end={[refractEnd[0], refractEnd[1], refractEnd[2] + 0.3]}
              color="#f472b6"
              intensity={Tp}
              label={`透射 Tp`}
              polarization="p"
            />
          )}
        </>
      )}

      {/* 角度标注 */}
      <Text position={[-1.5, 2.2, 0]} fontSize={0.2} color="#fbbf24">
        θ₁ = {incidentAngle}°
      </Text>
      {!fresnel.totalReflection && (
        <Text position={[1.5, -2.2, 0]} fontSize={0.2} color="#fbbf24">
          θ₂ = {fresnel.theta2.toFixed(1)}°
        </Text>
      )}
      {fresnel.totalReflection && (
        <Text position={[0, -2.5, 0]} fontSize={0.25} color="#ef4444">
          全内反射
        </Text>
      )}

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 菲涅尔曲线图
function FresnelChart({
  n1,
  n2,
  currentAngle,
}: {
  n1: number
  n2: number
  currentAngle: number
}) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // 背景
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, width, height)

      const margin = { left: 50, right: 20, top: 30, bottom: 40 }
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

      // 刻度
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.fillText('0', margin.left - 15, height - margin.bottom + 5)
      ctx.fillText('45', margin.left + chartWidth / 2 - 10, height - margin.bottom + 15)
      ctx.fillText('90°', width - margin.right - 15, height - margin.bottom + 15)
      ctx.fillText('1.0', margin.left - 25, margin.top + 5)
      ctx.fillText('0', margin.left - 15, height - margin.bottom - 5)
      ctx.fillText('R', margin.left - 15, margin.top - 10)
      ctx.fillText('θ', width - margin.right + 5, height - margin.bottom + 5)

      // 布儒斯特角
      const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI
      const brewsterX = margin.left + (brewsterAngle / 90) * chartWidth

      // 临界角
      const criticalAngle = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : 90
      const criticalX = margin.left + (criticalAngle / 90) * chartWidth

      // 绘制曲线
      const drawCurve = (getR: (angle: number) => number, color: string) => {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.beginPath()
        let started = false
        for (let angle = 0; angle <= 90; angle += 0.5) {
          const R = getR(angle)
          if (isNaN(R) || R > 1) continue
          const x = margin.left + (angle / 90) * chartWidth
          const y = height - margin.bottom - R * chartHeight
          if (!started) {
            ctx.moveTo(x, y)
            started = true
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // Rs曲线
      drawCurve((angle) => {
        const f = fresnelEquations(angle, n1, n2)
        return f.rs * f.rs
      }, '#22d3ee')

      // Rp曲线
      drawCurve((angle) => {
        const f = fresnelEquations(angle, n1, n2)
        return f.rp * f.rp
      }, '#f472b6')

      // 布儒斯特角标记
      if (n1 < n2) {
        ctx.strokeStyle = '#fbbf24'
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.moveTo(brewsterX, margin.top)
        ctx.lineTo(brewsterX, height - margin.bottom)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#fbbf24'
        ctx.fillText(`θB=${brewsterAngle.toFixed(1)}°`, brewsterX - 20, margin.top - 5)
      }

      // 临界角标记（全内反射）
      if (n1 > n2 && criticalAngle < 90) {
        ctx.strokeStyle = '#ef4444'
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.moveTo(criticalX, margin.top)
        ctx.lineTo(criticalX, height - margin.bottom)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#ef4444'
        ctx.fillText(`θc=${criticalAngle.toFixed(1)}°`, criticalX - 20, margin.top - 5)
      }

      // 当前角度标记
      const currentX = margin.left + (currentAngle / 90) * chartWidth
      const currentRs = fresnelEquations(currentAngle, n1, n2)
      const currentYs = height - margin.bottom - currentRs.rs * currentRs.rs * chartHeight
      const currentYp = height - margin.bottom - currentRs.rp * currentRs.rp * chartHeight

      ctx.fillStyle = '#22d3ee'
      ctx.beginPath()
      ctx.arc(currentX, currentYs, 5, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.arc(currentX, currentYp, 5, 0, 2 * Math.PI)
      ctx.fill()

      // 图例
      ctx.fillStyle = '#22d3ee'
      ctx.fillRect(width - 80, 10, 15, 3)
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Rs', width - 60, 15)

      ctx.fillStyle = '#f472b6'
      ctx.fillRect(width - 80, 25, 15, 3)
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Rp', width - 60, 30)
    },
    [n1, n2, currentAngle]
  )

  return <Demo2DCanvas width={350} height={220} draw={draw} />
}

// 主演示组件
export function FresnelDemo() {
  const [incidentAngle, setIncidentAngle] = useState(45)
  const [n1, setN1] = useState(1.0)
  const [n2, setN2] = useState(1.5)
  const [showS, setShowS] = useState(true)
  const [showP, setShowP] = useState(true)

  const fresnel = fresnelEquations(incidentAngle, n1, n2)
  const Rs = fresnel.rs * fresnel.rs
  const Rp = fresnel.rp * fresnel.rp

  // 布儒斯特角
  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 3, 8], fov: 50 }}
          gl={{ antialias: true }}
        >
          <FresnelScene
            incidentAngle={incidentAngle}
            n1={n1}
            n2={n2}
            showS={showS}
            showP={showP}
          />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-96 space-y-4">
        <ControlPanel title="参数控制">
          <SliderControl
            label="入射角 θ₁"
            value={incidentAngle}
            min={0}
            max={89}
            step={1}
            unit="°"
            onChange={setIncidentAngle}
          />
          <SliderControl
            label="介质1折射率 n₁"
            value={n1}
            min={1.0}
            max={2.5}
            step={0.05}
            onChange={setN1}
            formatValue={(v) => v.toFixed(2)}
          />
          <SliderControl
            label="介质2折射率 n₂"
            value={n2}
            min={1.0}
            max={2.5}
            step={0.05}
            onChange={setN2}
            formatValue={(v) => v.toFixed(2)}
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={showS}
                onChange={(e) => setShowS(e.target.checked)}
                className="rounded"
              />
              s偏振
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={showP}
                onChange={(e) => setShowP(e.target.checked)}
                className="rounded"
              />
              p偏振
            </label>
          </div>
        </ControlPanel>

        <ControlPanel title="计算结果">
          <ValueDisplay label="折射角 θ₂" value={fresnel.totalReflection ? '全反射' : `${fresnel.theta2.toFixed(1)}°`} />
          <ValueDisplay label="s偏振反射率 Rs" value={(Rs * 100).toFixed(1)} unit="%" color="cyan" />
          <ValueDisplay label="p偏振反射率 Rp" value={(Rp * 100).toFixed(1)} unit="%" color="purple" />
          <ValueDisplay label="布儒斯特角" value={brewsterAngle.toFixed(1)} unit="°" color="orange" />
        </ControlPanel>

        <ControlPanel title="反射率曲线">
          <FresnelChart n1={n1} n2={n2} currentAngle={incidentAngle} />
        </ControlPanel>

        <InfoPanel title="菲涅尔方程">
          <div className="space-y-1 text-xs font-mono">
            <p>rs = (n₁cosθ₁ - n₂cosθ₂) / (n₁cosθ₁ + n₂cosθ₂)</p>
            <p>rp = (n₂cosθ₁ - n₁cosθ₂) / (n₂cosθ₁ + n₁cosθ₂)</p>
            <p className="text-cyan-400 mt-2">Rs = rs², Rp = rp²</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
