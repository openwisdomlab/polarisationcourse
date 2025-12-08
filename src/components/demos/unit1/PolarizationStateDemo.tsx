/**
 * 偏振态演示 - Unit 1
 * 展示光波合成与不同偏振态（线偏振、圆偏振、椭圆偏振）
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import {
  SliderControl,
  ControlPanel,
  ValueDisplay,
  Formula,
  PresetButtons,
} from '../DemoControls'

// 3D波动传播场景
function WavePropagationScene({
  phaseDiff,
  ampX,
  ampY,
  animate,
}: {
  phaseDiff: number
  ampX: number
  ampY: number
  animate: boolean
}) {
  const timeRef = useRef(0)
  const groupRef = useRef<THREE.Group>(null)

  // 波形参数
  const wavelength = 2
  const k = (2 * Math.PI) / wavelength
  const speed = 2
  const scale = 0.8
  const length = 8

  // 动画更新
  useFrame((_, delta) => {
    if (animate) {
      timeRef.current += delta * speed
    }
  })

  // 生成波形点
  const generateWavePoints = useCallback(
    (
      component: 'x' | 'y' | 'combined',
      time: number
    ): [number, number, number][] => {
      const points: [number, number, number][] = []
      const numPoints = 100
      const phaseRad = (phaseDiff * Math.PI) / 180

      for (let i = 0; i <= numPoints; i++) {
        const z = (i / numPoints) * length - length / 2
        const phase = k * z - time

        if (component === 'x') {
          // Ex分量 - 在XZ平面
          const ex = ampX * Math.cos(phase) * scale
          points.push([ex, 0, z])
        } else if (component === 'y') {
          // Ey分量 - 在YZ平面
          const ey = ampY * Math.cos(phase + phaseRad) * scale
          points.push([0, ey, z])
        } else {
          // 合成矢量
          const ex = ampX * Math.cos(phase) * scale
          const ey = ampY * Math.cos(phase + phaseRad) * scale
          points.push([ex, ey, z])
        }
      }
      return points
    },
    [ampX, ampY, phaseDiff, k, scale, length]
  )

  // 矢量箭头组件
  function VectorArrows() {
    const arrows: React.ReactElement[] = []
    const numArrows = 8
    const phaseRad = (phaseDiff * Math.PI) / 180

    for (let i = 0; i < numArrows; i++) {
      const z = (i / (numArrows - 1)) * length - length / 2
      const phase = k * z - timeRef.current

      const ex = ampX * Math.cos(phase) * scale
      const ey = ampY * Math.cos(phase + phaseRad) * scale

      arrows.push(
        <group key={i} position={[0, 0, z]}>
          {/* 矢量线 */}
          <Line
            points={[
              [0, 0, 0],
              [ex, ey, 0],
            ]}
            color="#ffff00"
            lineWidth={2}
            opacity={0.6}
            transparent
          />
          {/* 矢量端点 */}
          <mesh position={[ex, ey, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffff00" />
          </mesh>
        </group>
      )
    }
    return <>{arrows}</>
  }

  // 动态渲染的波形组件
  function AnimatedWaves() {
    const exPoints = generateWavePoints('x', timeRef.current)
    const eyPoints = generateWavePoints('y', timeRef.current)
    const combinedPoints = generateWavePoints('combined', timeRef.current)

    // 强制每帧更新
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.children = []
      }
    })

    return (
      <>
        {/* Ex 分量 (红色) */}
        {ampX > 0 && (
          <Line points={exPoints} color="#ff4444" lineWidth={2} opacity={0.7} transparent />
        )}

        {/* Ey 分量 (绿色) */}
        {ampY > 0 && (
          <Line points={eyPoints} color="#44ff44" lineWidth={2} opacity={0.7} transparent />
        )}

        {/* 合成矢量轨迹 (黄色) */}
        <Line points={combinedPoints} color="#ffff00" lineWidth={3} />

        {/* 矢量箭头 */}
        <VectorArrows />
      </>
    )
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />

      {/* 坐标轴 */}
      <group>
        {/* X轴 (红色) */}
        <Line
          points={[
            [-1.5, 0, 0],
            [1.5, 0, 0],
          ]}
          color="#ff4444"
          lineWidth={1}
        />
        <Text position={[1.7, 0, 0]} fontSize={0.2} color="#ff4444">
          Ex
        </Text>

        {/* Y轴 (绿色) */}
        <Line
          points={[
            [0, -1.5, 0],
            [0, 1.5, 0],
          ]}
          color="#44ff44"
          lineWidth={1}
        />
        <Text position={[0, 1.7, 0]} fontSize={0.2} color="#44ff44">
          Ey
        </Text>

        {/* Z轴 (传播方向) */}
        <Line
          points={[
            [0, 0, -length / 2 - 0.5],
            [0, 0, length / 2 + 0.5],
          ]}
          color="#888888"
          lineWidth={1}
        />
        <Text position={[0, 0, length / 2 + 1]} fontSize={0.2} color="#888888">
          传播方向 Z
        </Text>
      </group>

      {/* 动态波形 */}
      <AnimatedWaves />

      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  )
}

// 2D偏振态投影Canvas
function PolarizationStateCanvas({
  phaseDiff,
  ampX,
  ampY,
  animate,
}: {
  phaseDiff: number
  ampX: number
  ampY: number
  animate: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 300
    const height = 300
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const cx = width / 2
    const cy = height / 2
    const radius = 100
    const phaseRad = (phaseDiff * Math.PI) / 180

    const draw = () => {
      // 清除画布
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, width, height)

      // 绘制坐标轴
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx, 20)
      ctx.lineTo(cx, height - 20)
      ctx.moveTo(20, cy)
      ctx.lineTo(width - 20, cy)
      ctx.stroke()

      // 轴标签
      ctx.fillStyle = '#64748b'
      ctx.font = '12px sans-serif'
      ctx.fillText('Ex', width - 30, cy - 10)
      ctx.fillText('Ey', cx + 10, 30)

      // 绘制偏振椭圆轨迹
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)'
      ctx.lineWidth = 2
      for (let a = 0; a <= Math.PI * 2; a += 0.05) {
        const px = ampX * Math.cos(a) * radius
        const py = ampY * Math.cos(a + phaseRad) * radius
        if (a === 0) ctx.moveTo(cx + px, cy - py)
        else ctx.lineTo(cx + px, cy - py)
      }
      ctx.closePath()
      ctx.stroke()

      // 当前矢量位置
      const phase = -timeRef.current * 3
      const vecX = ampX * Math.cos(phase) * radius
      const vecY = ampY * Math.cos(phase + phaseRad) * radius

      // 绘制当前矢量
      ctx.beginPath()
      ctx.strokeStyle = '#ffff00'
      ctx.lineWidth = 3
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + vecX, cy - vecY)
      ctx.stroke()

      // 矢量端点
      ctx.beginPath()
      ctx.fillStyle = '#ffff00'
      ctx.arc(cx + vecX, cy - vecY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Ex分量指示
      ctx.beginPath()
      ctx.strokeStyle = '#ff4444'
      ctx.lineWidth = 2
      ctx.moveTo(cx, cy + 120)
      ctx.lineTo(cx + vecX, cy + 120)
      ctx.stroke()
      ctx.beginPath()
      ctx.fillStyle = '#ff4444'
      ctx.arc(cx + vecX, cy + 120, 4, 0, Math.PI * 2)
      ctx.fill()

      // Ey分量指示
      ctx.beginPath()
      ctx.strokeStyle = '#44ff44'
      ctx.lineWidth = 2
      ctx.moveTo(cx - 120, cy)
      ctx.lineTo(cx - 120, cy - vecY)
      ctx.stroke()
      ctx.beginPath()
      ctx.fillStyle = '#44ff44'
      ctx.arc(cx - 120, cy - vecY, 4, 0, Math.PI * 2)
      ctx.fill()

      // 图例
      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px sans-serif'
      ctx.fillText('Ex分量', cx + 50, cy + 135)
      ctx.fillText('Ey分量', 20, cy - 100)

      if (animate) {
        timeRef.current += 0.016
      }
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [phaseDiff, ampX, ampY, animate])

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg border border-cyan-400/20"
      style={{ width: 300, height: 300 }}
    />
  )
}

// 偏振态类型判断
function getPolarizationState(
  phaseDiff: number,
  ampX: number,
  ampY: number
): { type: string; color: string } {
  const normalizedPhase = ((phaseDiff % 360) + 360) % 360

  if (ampX < 0.05 || ampY < 0.05) {
    return { type: '线偏振 (单轴)', color: '#ff4444' }
  }

  if (
    Math.abs(ampX - ampY) < 0.1 &&
    (Math.abs(normalizedPhase - 90) < 5 || Math.abs(normalizedPhase - 270) < 5)
  ) {
    return { type: '圆偏振', color: '#44ff44' }
  }

  if (
    normalizedPhase < 5 ||
    Math.abs(normalizedPhase - 180) < 5 ||
    Math.abs(normalizedPhase - 360) < 5
  ) {
    return { type: '线偏振', color: '#ffaa00' }
  }

  return { type: '椭圆偏振', color: '#a78bfa' }
}

// 主演示组件
export function PolarizationStateDemo() {
  const [phaseDiff, setPhaseDiff] = useState(0)
  const [ampX, setAmpX] = useState(1)
  const [ampY, setAmpY] = useState(1)
  const [animate, setAnimate] = useState(true)

  const polarizationState = useMemo(
    () => getPolarizationState(phaseDiff, ampX, ampY),
    [phaseDiff, ampX, ampY]
  )

  // 预设选项
  const presets = [
    { label: '水平线偏振', value: 'h-linear', params: { phase: 0, ax: 1, ay: 0 } },
    { label: '45°线偏振', value: '45-linear', params: { phase: 0, ax: 1, ay: 1 } },
    { label: '右旋圆偏振', value: 'r-circular', params: { phase: 90, ax: 1, ay: 1 } },
    { label: '左旋圆偏振', value: 'l-circular', params: { phase: 270, ax: 1, ay: 1 } },
    { label: '椭圆偏振', value: 'elliptical', params: { phase: 45, ax: 1, ay: 0.6 } },
  ]

  const handlePresetChange = (value: string | number) => {
    const preset = presets.find((p) => p.value === value)
    if (preset) {
      setPhaseDiff(preset.params.phase)
      setAmpX(preset.params.ax)
      setAmpY(preset.params.ay)
    }
  }

  // 当前选中的预设
  const currentPreset = useMemo(() => {
    return presets.find(
      (p) =>
        Math.abs(p.params.phase - phaseDiff) < 5 &&
        Math.abs(p.params.ax - ampX) < 0.1 &&
        Math.abs(p.params.ay - ampY) < 0.1
    )?.value || ''
  }, [phaseDiff, ampX, ampY])

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 上方：两个可视化面板 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 3D 波动传播视图 */}
        <div className="flex-1 bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-cyan-400/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">3D 空间传播视图</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-400">Ex</span>
              <span className="w-3 h-3 rounded-full bg-green-500 ml-2" />
              <span className="text-xs text-gray-400">Ey</span>
              <span className="w-3 h-3 rounded-full bg-yellow-400 ml-2" />
              <span className="text-xs text-gray-400">合成E</span>
            </div>
          </div>
          <div className="h-[350px]">
            <Canvas camera={{ position: [3, 2, 6], fov: 50 }} gl={{ antialias: true }}>
              <WavePropagationScene
                phaseDiff={phaseDiff}
                ampX={ampX}
                ampY={ampY}
                animate={animate}
              />
            </Canvas>
          </div>
        </div>

        {/* 2D 偏振态投影 */}
        <div className="lg:w-[340px] bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-cyan-400/10">
            <h3 className="text-sm font-semibold text-white">偏振态投影</h3>
          </div>
          <div className="p-4 flex flex-col items-center gap-3">
            <PolarizationStateCanvas
              phaseDiff={phaseDiff}
              ampX={ampX}
              ampY={ampY}
              animate={animate}
            />
            <div className="text-center">
              <span className="text-gray-400 text-sm">当前状态: </span>
              <span className="font-semibold" style={{ color: polarizationState.color }}>
                {polarizationState.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 下方：控制面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 预设按钮 */}
        <ControlPanel title="快速预设">
          <PresetButtons
            options={presets.map((p) => ({ value: p.value, label: p.label }))}
            value={currentPreset}
            onChange={handlePresetChange}
          />
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setAnimate(!animate)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                animate
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                  : 'bg-slate-700/50 text-gray-400 border border-slate-600'
              }`}
            >
              {animate ? '⏸ 暂停动画' : '▶ 播放动画'}
            </button>
          </div>
        </ControlPanel>

        {/* 参数控制 */}
        <ControlPanel title="参数调节">
          <SliderControl
            label="相位差 (δ)"
            value={phaseDiff}
            min={0}
            max={360}
            step={5}
            unit="°"
            onChange={setPhaseDiff}
          />
          <SliderControl
            label="Ex 振幅"
            value={ampX}
            min={0}
            max={1}
            step={0.1}
            onChange={setAmpX}
            formatValue={(v) => v.toFixed(1)}
          />
          <SliderControl
            label="Ey 振幅"
            value={ampY}
            min={0}
            max={1}
            step={0.1}
            onChange={setAmpY}
            formatValue={(v) => v.toFixed(1)}
          />
        </ControlPanel>

        {/* 计算结果 */}
        <ControlPanel title="偏振参数">
          <ValueDisplay label="相位差 δ" value={`${phaseDiff}°`} />
          <ValueDisplay label="振幅比 Ey/Ex" value={ampX > 0 ? (ampY / ampX).toFixed(2) : '∞'} />
          <ValueDisplay
            label="偏振态"
            value={polarizationState.type}
            color={
              polarizationState.type.includes('圆')
                ? 'green'
                : polarizationState.type.includes('线')
                  ? 'orange'
                  : 'purple'
            }
          />
          <Formula>E = Ex·cos(ωt) x̂ + Ey·cos(ωt+δ) ŷ</Formula>
        </ControlPanel>
      </div>
    </div>
  )
}
