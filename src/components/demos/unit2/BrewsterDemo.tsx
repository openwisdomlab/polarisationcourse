/**
 * 布儒斯特角演示 - Unit 2
 * tan(θB) = n2/n1，反射光为完全s偏振
 */
import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line, Text } from '@react-three/drei'
import { SliderControl, ControlPanel, ValueDisplay, ButtonGroup, InfoPanel, Formula } from '../DemoControls'
import { Demo2DCanvas } from '../Demo2DCanvas'

// 计算布儒斯特角和反射率
function calculateBrewster(theta: number, n1: number, n2: number) {
  const rad = (theta * Math.PI) / 180
  const sinTheta1 = Math.sin(rad)
  const cosTheta1 = Math.cos(rad)
  const sinTheta2 = (n1 / n2) * sinTheta1

  if (sinTheta2 > 1) {
    return { Rs: 1, Rp: 1, totalReflection: true, theta2: 90 }
  }

  const cosTheta2 = Math.sqrt(1 - sinTheta2 * sinTheta2)
  const theta2 = (Math.asin(sinTheta2) * 180) / Math.PI

  const rs = (n1 * cosTheta1 - n2 * cosTheta2) / (n1 * cosTheta1 + n2 * cosTheta2)
  const rp = (n2 * cosTheta1 - n1 * cosTheta2) / (n2 * cosTheta1 + n1 * cosTheta2)

  return {
    Rs: rs * rs,
    Rp: rp * rp,
    totalReflection: false,
    theta2,
  }
}

// 玻璃板组件
function GlassPlate({
  rotation,
  n,
}: {
  rotation: number
  n: number
}) {
  return (
    <group rotation={[0, 0, (rotation * Math.PI) / 180]}>
      {/* 玻璃板 */}
      <mesh>
        <boxGeometry args={[4, 0.3, 3]} />
        <meshStandardMaterial
          color="#a8d8ea"
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* 边框 */}
      <mesh>
        <boxGeometry args={[4, 0.3, 3]} />
        <meshBasicMaterial color="#67e8f9" wireframe />
      </mesh>
      {/* 法线 */}
      <Line
        points={[
          [0, 0, 0],
          [0, 2, 0],
        ]}
        color="#94a3b8"
        lineWidth={1}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      <Text position={[0, 2.3, 0]} fontSize={0.2} color="#94a3b8">
        法线
      </Text>
      <Text position={[2.5, 0, 0]} fontSize={0.2} color="#67e8f9">
        n = {n.toFixed(2)}
      </Text>
    </group>
  )
}

// 入射/反射光线
function LightBeams({
  incidentAngle,
  n1,
  n2,
}: {
  incidentAngle: number
  n1: number
  n2: number
}) {
  const result = calculateBrewster(incidentAngle, n1, n2)
  const rad = (incidentAngle * Math.PI) / 180
  const refractRad = (result.theta2 * Math.PI) / 180
  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI
  const isAtBrewster = Math.abs(incidentAngle - brewsterAngle) < 1

  // 入射光
  const incidentStart: [number, number, number] = [-3 * Math.sin(rad), 3 * Math.cos(rad), 0]
  const incidentEnd: [number, number, number] = [0, 0, 0]

  // 反射光
  const reflectEnd: [number, number, number] = [3 * Math.sin(rad), 3 * Math.cos(rad), 0]

  // 折射光
  const refractEnd: [number, number, number] = [
    3 * Math.sin(refractRad),
    -3 * Math.cos(refractRad),
    0,
  ]

  return (
    <group>
      {/* 入射光（自然光/未偏振） */}
      <Line
        points={[incidentStart, incidentEnd]}
        color="#fbbf24"
        lineWidth={4}
      />
      {/* 入射偏振指示器 - 圆形表示未偏振 */}
      <mesh position={[incidentStart[0] * 0.6, incidentStart[1] * 0.6, 0]}>
        <torusGeometry args={[0.2, 0.05, 8, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* 反射光 */}
      <Line
        points={[incidentEnd, reflectEnd]}
        color={isAtBrewster ? '#22d3ee' : '#fbbf24'}
        lineWidth={Math.max(1, 4 * result.Rs)}
        transparent
        opacity={Math.max(0.3, result.Rs)}
      />
      {/* 反射偏振指示器 - 在布儒斯特角时为s偏振 */}
      {result.Rs > 0.01 && (
        <group position={[reflectEnd[0] * 0.6, reflectEnd[1] * 0.6, 0]}>
          {isAtBrewster ? (
            // s偏振（垂直于入射面）
            <Line
              points={[
                [0, 0, -0.3],
                [0, 0, 0.3],
              ]}
              color="#22d3ee"
              lineWidth={4}
            />
          ) : (
            // 部分偏振
            <mesh>
              <torusGeometry args={[0.15, 0.03, 8, 16]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>
          )}
        </group>
      )}

      {/* 折射光 */}
      {!result.totalReflection && (
        <>
          <Line
            points={[incidentEnd, refractEnd]}
            color="#4ade80"
            lineWidth={Math.max(1, 4 * (1 - result.Rs))}
            transparent
            opacity={Math.max(0.3, 1 - result.Rs)}
          />
          {/* 折射偏振指示器 - 在布儒斯特角时为p偏振 */}
          <group position={[refractEnd[0] * 0.5, refractEnd[1] * 0.5, 0]}>
            {isAtBrewster ? (
              // p偏振（在入射面内）
              <Line
                points={[
                  [-0.2 * Math.cos(refractRad), -0.2 * Math.sin(refractRad), 0],
                  [0.2 * Math.cos(refractRad), 0.2 * Math.sin(refractRad), 0],
                ]}
                color="#f472b6"
                lineWidth={4}
              />
            ) : (
              <mesh>
                <torusGeometry args={[0.15, 0.03, 8, 16]} />
                <meshBasicMaterial color="#4ade80" />
              </mesh>
            )}
          </group>
        </>
      )}

      {/* 角度标注 */}
      <Text position={[-1, 2.5, 0]} fontSize={0.25} color="#fbbf24">
        θ = {incidentAngle}°
      </Text>
      {isAtBrewster && (
        <Text position={[0, 3.2, 0]} fontSize={0.3} color="#22d3ee">
          布儒斯特角!
        </Text>
      )}
    </group>
  )
}

// 3D场景
function BrewsterScene({
  incidentAngle,
  n1,
  n2,
}: {
  incidentAngle: number
  n1: number
  n2: number
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, -5]} intensity={0.4} />

      {/* 光源 */}
      <group position={[-3 * Math.sin((incidentAngle * Math.PI) / 180), 3 * Math.cos((incidentAngle * Math.PI) / 180), 0]}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        <pointLight color="#fbbf24" intensity={0.5} distance={2} />
      </group>

      {/* 玻璃板（固定水平） */}
      <GlassPlate rotation={0} n={n2} />

      {/* 光线 */}
      <LightBeams incidentAngle={incidentAngle} n1={n1} n2={n2} />

      {/* 屏幕 */}
      <group position={[4, 2, 0]}>
        <mesh>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <Text position={[0, -1, 0]} fontSize={0.2} color="#94a3b8">
          反射屏幕
        </Text>
      </group>

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 偏振度图
function PolarizationDegreeChart({
  n1,
  n2,
  currentAngle,
}: {
  n1: number
  n2: number
  currentAngle: number
}) {
  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI

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

      // 刻度
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.fillText('0°', margin.left - 5, height - margin.bottom + 15)
      ctx.fillText('90°', width - margin.right - 15, height - margin.bottom + 15)
      ctx.fillText('100%', margin.left - 35, margin.top + 5)
      ctx.fillText('0%', margin.left - 25, height - margin.bottom - 5)
      ctx.fillText('偏振度', 5, margin.top - 5)

      // 绘制偏振度曲线
      // 偏振度 = (Rs - Rp) / (Rs + Rp)
      ctx.strokeStyle = '#a78bfa'
      ctx.lineWidth = 2
      ctx.beginPath()
      let started = false
      for (let angle = 1; angle <= 89; angle++) {
        const result = calculateBrewster(angle, n1, n2)
        if (result.totalReflection) continue
        const polarizationDegree = Math.abs(result.Rs - result.Rp) / (result.Rs + result.Rp + 0.001)
        const x = margin.left + (angle / 90) * chartWidth
        const y = height - margin.bottom - polarizationDegree * chartHeight
        if (!started) {
          ctx.moveTo(x, y)
          started = true
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // 布儒斯特角标记
      const brewsterX = margin.left + (brewsterAngle / 90) * chartWidth
      ctx.strokeStyle = '#22d3ee'
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(brewsterX, margin.top)
      ctx.lineTo(brewsterX, height - margin.bottom)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = '#22d3ee'
      ctx.fillText(`θB = ${brewsterAngle.toFixed(1)}°`, brewsterX - 25, margin.top - 5)

      // 当前角度
      const currentX = margin.left + (currentAngle / 90) * chartWidth
      const currentResult = calculateBrewster(currentAngle, n1, n2)
      const currentPD = Math.abs(currentResult.Rs - currentResult.Rp) / (currentResult.Rs + currentResult.Rp + 0.001)
      const currentY = height - margin.bottom - currentPD * chartHeight

      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI)
      ctx.fill()
    },
    [n1, n2, currentAngle]
  )

  return <Demo2DCanvas width={320} height={180} draw={draw} />
}

// 主演示组件
export function BrewsterDemo() {
  const [incidentAngle, setIncidentAngle] = useState(56)
  const [n2, setN2] = useState(1.5)
  const n1 = 1.0 // 空气

  const brewsterAngle = (Math.atan(n2 / n1) * 180) / Math.PI
  const result = calculateBrewster(incidentAngle, n1, n2)
  const isAtBrewster = Math.abs(incidentAngle - brewsterAngle) < 1
  const polarizationDegree = Math.abs(result.Rs - result.Rp) / (result.Rs + result.Rp + 0.001)

  // 常见材料预设
  const materials = [
    { name: '玻璃', n: 1.5 },
    { name: '水', n: 1.33 },
    { name: '钻石', n: 2.42 },
    { name: '冰', n: 1.31 },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D 可视化 */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden min-h-[400px]">
        <Canvas
          camera={{ position: [0, 4, 8], fov: 50 }}
          gl={{ antialias: true }}
        >
          <BrewsterScene incidentAngle={incidentAngle} n1={n1} n2={n2} />
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-80 space-y-4">
        <ControlPanel title="参数控制">
          <SliderControl
            label="入射角 θ"
            value={incidentAngle}
            min={0}
            max={89}
            step={1}
            unit="°"
            onChange={setIncidentAngle}
          />
          <SliderControl
            label="介质折射率 n"
            value={n2}
            min={1.1}
            max={2.5}
            step={0.01}
            onChange={setN2}
            formatValue={(v) => v.toFixed(2)}
          />
          <ButtonGroup
            label="常见材料"
            options={materials.map((m) => ({ value: m.n, label: m.name }))}
            value={n2}
            onChange={(v) => setN2(v as number)}
          />
          <button
            onClick={() => setIncidentAngle(Math.round(brewsterAngle))}
            className="w-full py-2 bg-cyan-400/20 text-cyan-400 rounded-lg hover:bg-cyan-400/30 transition-colors"
          >
            跳转到布儒斯特角
          </button>
        </ControlPanel>

        <ControlPanel title="计算结果">
          <ValueDisplay
            label="布儒斯特角 θB"
            value={brewsterAngle.toFixed(1)}
            unit="°"
            color="cyan"
          />
          <ValueDisplay
            label="当前入射角"
            value={incidentAngle}
            unit="°"
            color={isAtBrewster ? 'green' : 'orange'}
          />
          <ValueDisplay
            label="s偏振反射率"
            value={(result.Rs * 100).toFixed(1)}
            unit="%"
          />
          <ValueDisplay
            label="p偏振反射率"
            value={(result.Rp * 100).toFixed(1)}
            unit="%"
            color={result.Rp < 0.01 ? 'green' : 'orange'}
          />
          <ValueDisplay
            label="偏振度"
            value={(polarizationDegree * 100).toFixed(0)}
            unit="%"
            color={polarizationDegree > 0.9 ? 'green' : 'orange'}
          />
          <Formula>tan(θB) = n₂/n₁</Formula>
        </ControlPanel>

        <ControlPanel title="反射光偏振度">
          <PolarizationDegreeChart n1={n1} n2={n2} currentAngle={incidentAngle} />
        </ControlPanel>

        <InfoPanel title="布儒斯特现象">
          <div className="space-y-2 text-xs">
            <p>在布儒斯特角入射时：</p>
            <p className="text-cyan-400">• p偏振反射率为零 (Rp = 0)</p>
            <p className="text-cyan-400">• 反射光为完全s偏振</p>
            <p className="text-cyan-400">• 折射光+反射光方向垂直</p>
            <p className="mt-2 text-gray-500">应用：减反射涂层、偏振镜片</p>
          </div>
        </InfoPanel>
      </div>
    </div>
  )
}
