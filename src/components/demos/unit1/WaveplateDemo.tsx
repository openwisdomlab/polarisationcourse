/**
 * 波片原理演示 - Unit 1 (Refactored with Unified Physics Engine)
 * 演示四分之一波片和二分之一波片对偏振态的影响
 *
 * Physics Engine Migration:
 * - Uses CoherencyMatrix for polarization state representation
 * - Uses Matrix2x2 Jones matrices from unified engine
 * - Proper Stokes parameter visualization
 *
 * Enhanced Features:
 * - Poincare Sphere visualization showing polarization state trajectory
 * - Real-time state mapping on the sphere
 * - Non-ideal waveplate parameter simulation
 */
import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useDemoTheme } from '../demoThemeColors'
import { cn } from '@/lib/utils'
import {
  SliderControl,
  ControlPanel,
  InfoCard,
  Toggle,
} from '../DemoControls'
import {
  DemoHeader,
  VisualizationPanel,
  InfoGrid,
  ChartPanel,
  StatCard,
  FormulaHighlight,
} from '../DemoLayout'
import {
  JonesMatrix,
  JonesVector,
  StokesVector,
  NonIdealWaveplateParams,
  IDEAL_WAVEPLATE,
  TYPICAL_WAVEPLATE,
  waveplateRetardation,
  wavelengthToRGB,
} from '@/core/WaveOptics'
// Import from unified physics engine
import { CoherencyMatrix } from '@/core/physics/unified/CoherencyMatrix'
import { Matrix2x2 } from '@/core/math/Matrix2x2'
import { Complex } from '@/core/math/Complex'

// 波片类型
type WaveplateType = 'quarter' | 'half'

// 偏振态类型
type PolarizationState = 'linear' | 'circular-r' | 'circular-l' | 'elliptical'

// 难度级别
type DifficultyLevel = 'basic' | 'research'

// 非理想波片参数接口（扩展UI用）
interface WaveplateParams extends NonIdealWaveplateParams {
  useNonIdeal: boolean
}

// 波片光路演示Canvas
function WaveplateCanvas({
  waveplateType,
  inputAngle,
  fastAxisAngle,
  animate,
}: {
  waveplateType: WaveplateType
  inputAngle: number
  fastAxisAngle: number
  animate: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)
  const dt = useDemoTheme()

  // 计算输出偏振态
  // 圆偏振旋向约定（物理学惯例）：
  // - 右旋(RCP)：从光源方向看，电场矢量顺时针旋转
  // - 左旋(LCP)：从光源方向看，电场矢量逆时针旋转
  // 当线偏振光入射λ/4波片，相对快轴角度为+45°时产生右旋圆偏振，-45°(即135°)时产生左旋圆偏振
  const outputState = useMemo(() => {
    const relativeAngle = ((inputAngle - fastAxisAngle) % 180 + 180) % 180

    if (waveplateType === 'quarter') {
      // 相对角度45°→右旋圆偏振，135°→左旋圆偏振
      if (Math.abs(relativeAngle - 45) < 5) {
        return { type: 'circular-r' as PolarizationState, angle: 0 }  // 右旋
      } else if (Math.abs(relativeAngle - 135) < 5) {
        return { type: 'circular-l' as PolarizationState, angle: 0 }  // 左旋
      } else if (relativeAngle < 5 || Math.abs(relativeAngle - 90) < 5 || Math.abs(relativeAngle - 180) < 5) {
        return { type: 'linear' as PolarizationState, angle: inputAngle }
      } else {
        return { type: 'elliptical' as PolarizationState, angle: inputAngle }
      }
    } else {
      // λ/2波片：输出角度 = 2×快轴角度 - 输入角度
      const outputAngle = ((2 * fastAxisAngle - inputAngle) % 180 + 180) % 180
      return { type: 'linear' as PolarizationState, angle: outputAngle }
    }
  }, [waveplateType, inputAngle, fastAxisAngle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 700
    const height = 300
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const centerY = height / 2
    const sourceX = 50
    const waveplateX = 280
    const waveplateWidth = 80
    const screenX = 650

    const draw = () => {
      // 清除画布
      ctx.fillStyle = dt.canvasBg
      ctx.fillRect(0, 0, width, height)

      const t = timeRef.current * 0.05

      // 绘制光源
      const gradient = ctx.createRadialGradient(sourceX, centerY, 0, sourceX, centerY, 25)
      gradient.addColorStop(0, 'rgba(251, 191, 36, 1)')
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.arc(sourceX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(sourceX, centerY, 12, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = dt.textSecondary
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('线偏振光源', sourceX, centerY + 50)

      // 入射光束（带偏振方向指示）
      drawAnimatedBeam(ctx, sourceX + 20, centerY, waveplateX - 10, centerY, '#ffaa00', 1, t)

      // 入射偏振态指示
      drawPolarizationIndicator(ctx, 150, centerY, inputAngle, 'linear', '#ffaa00', t)
      ctx.fillStyle = '#ffaa00'
      ctx.font = '10px sans-serif'
      ctx.fillText(`输入: ${inputAngle}°`, 150, centerY + 40)

      // 绘制波片
      drawWaveplate(ctx, waveplateX, centerY - 60, waveplateWidth, 120, fastAxisAngle, waveplateType)

      // 输出光束
      const outputColor = outputState.type === 'circular-r' || outputState.type === 'circular-l'
        ? '#22d3ee'
        : outputState.type === 'elliptical'
          ? '#a78bfa'
          : '#44ff44'

      drawAnimatedBeam(ctx, waveplateX + waveplateWidth + 10, centerY, screenX - 20, centerY, outputColor, 1, t)

      // 输出偏振态指示
      drawPolarizationIndicator(ctx, 500, centerY, outputState.angle, outputState.type, outputColor, t)

      const outputLabel = outputState.type === 'linear'
        ? `输出: ${outputState.angle.toFixed(0)}°`
        : outputState.type === 'circular-r'
          ? '右旋圆偏振'
          : outputState.type === 'circular-l'
            ? '左旋圆偏振'
            : '椭圆偏振'

      ctx.fillStyle = outputColor
      ctx.font = '10px sans-serif'
      ctx.fillText(outputLabel, 500, centerY + 40)

      // 绘制屏幕
      ctx.fillStyle = dt.canvasBgAlt
      ctx.fillRect(screenX - 5, centerY - 80, 20, 160)

      // 屏幕上的光斑
      drawScreenSpot(ctx, screenX, centerY, outputState.type, outputColor, t)

      ctx.fillStyle = dt.textSecondary
      ctx.fillText('观察屏', screenX, centerY + 100)

      if (animate) {
        timeRef.current += 1
      }
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [waveplateType, inputAngle, fastAxisAngle, animate, outputState, dt.isDark])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ maxWidth: 700, height: 300 }}
    />
  )
}

// 绘制动画光束
function drawAnimatedBeam(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  intensity: number,
  time: number
) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  const particleSpacing = 25
  const numParticles = Math.floor(length / particleSpacing)

  // 主光束线
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.4 + intensity * 0.3
  ctx.lineWidth = 2
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.globalAlpha = 1

  // 动画粒子
  for (let i = 0; i < numParticles; i++) {
    const progress = ((i * particleSpacing + time * 4) % length) / length
    const px = x1 + (x2 - x1) * progress
    const py = y1 + (y2 - y1) * progress

    ctx.beginPath()
    ctx.fillStyle = color
    ctx.globalAlpha = 0.7
    ctx.arc(px, py, 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

// 绘制波片
function drawWaveplate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fastAxisAngle: number,
  type: WaveplateType
) {
  const centerX = x + width / 2
  const centerY = y + height / 2
  const color = type === 'quarter' ? '#a78bfa' : '#f472b6'
  const label = type === 'quarter' ? 'λ/4 波片' : 'λ/2 波片'

  // 波片外形
  ctx.fillStyle = type === 'quarter' ? 'rgba(167, 139, 250, 0.2)' : 'rgba(244, 114, 182, 0.2)'
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // 快轴指示
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate((fastAxisAngle * Math.PI) / 180)

  ctx.beginPath()
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 3
  ctx.moveTo(0, -height / 2 + 10)
  ctx.lineTo(0, height / 2 - 10)
  ctx.stroke()

  // 快轴箭头
  ctx.beginPath()
  ctx.fillStyle = '#fbbf24'
  ctx.moveTo(0, -height / 2 + 10)
  ctx.lineTo(-6, -height / 2 + 22)
  ctx.lineTo(6, -height / 2 + 22)
  ctx.closePath()
  ctx.fill()

  ctx.restore()

  // 慢轴指示（垂直于快轴）
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(((fastAxisAngle + 90) * Math.PI) / 180)

  ctx.beginPath()
  ctx.strokeStyle = '#60a5fa'
  ctx.lineWidth = 2
  ctx.setLineDash([4, 4])
  ctx.moveTo(0, -height / 2 + 15)
  ctx.lineTo(0, height / 2 - 15)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.restore()

  // 标签
  ctx.fillStyle = color
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, centerX, y + height + 20)

  // 图例
  ctx.fillStyle = '#fbbf24'
  ctx.font = '9px sans-serif'
  ctx.fillText('快轴', centerX - 25, y - 8)
  ctx.fillStyle = '#60a5fa'
  ctx.fillText('慢轴', centerX + 25, y - 8)
}

// 绘制偏振态指示器
function drawPolarizationIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  type: PolarizationState,
  color: string,
  time: number
) {
  const size = 20

  ctx.save()
  ctx.translate(x, y)

  if (type === 'linear') {
    // 线偏振 - 振动的双向箭头
    const oscillation = Math.sin(time * 0.2) * 0.5 + 0.5
    ctx.rotate((angle * Math.PI) / 180)
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    const lineSize = size * (0.5 + oscillation * 0.5)
    ctx.moveTo(-lineSize, 0)
    ctx.lineTo(lineSize, 0)
    ctx.stroke()

    // 箭头
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.moveTo(lineSize, 0)
    ctx.lineTo(lineSize - 6, -4)
    ctx.lineTo(lineSize - 6, 4)
    ctx.closePath()
    ctx.fill()
  } else if (type === 'circular-r' || type === 'circular-l') {
    // 圆偏振 - 旋转的圆
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.arc(0, 0, size, 0, Math.PI * 2)
    ctx.stroke()

    // 旋转指示点
    const direction = type === 'circular-r' ? 1 : -1
    const pointAngle = time * 0.15 * direction
    const px = Math.cos(pointAngle) * size
    const py = Math.sin(pointAngle) * size

    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(px, py, 4, 0, Math.PI * 2)
    ctx.fill()

    // 旋转方向箭头
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    const arrowAngle = pointAngle + Math.PI / 2 * direction
    ctx.moveTo(px, py)
    ctx.lineTo(px + Math.cos(arrowAngle) * 8, py + Math.sin(arrowAngle) * 8)
    ctx.stroke()
  } else {
    // 椭圆偏振
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.ellipse(0, 0, size, size * 0.5, (angle * Math.PI) / 180, 0, Math.PI * 2)
    ctx.stroke()

    // 旋转指示点
    const pointAngle = time * 0.15
    const px = Math.cos(pointAngle) * size
    const py = Math.sin(pointAngle) * size * 0.5

    ctx.save()
    ctx.rotate((angle * Math.PI) / 180)
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(px, py, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}

// 绘制屏幕光斑
function drawScreenSpot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _type: PolarizationState,
  color: string,
  _time: number
) {
  const radius = 25

  // 发光效果
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5)
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, 'transparent')

  ctx.beginPath()
  ctx.fillStyle = gradient
  ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2)
  ctx.fill()

  // 主光斑
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.globalAlpha = 0.8
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}

// 相位延迟图
function PhaseRetardationDiagram({
  waveplateType,
}: {
  waveplateType: WaveplateType
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dt = useDemoTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 280
    const height = 140
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 清除
    ctx.fillStyle = dt.canvasBgAlt
    ctx.fillRect(0, 0, width, height)

    const centerY = height / 2
    const wavelength = 60
    const amplitude = 35
    const phase = waveplateType === 'quarter' ? Math.PI / 2 : Math.PI

    // 快轴分量（黄色）
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const y = centerY + amplitude * Math.sin((2 * Math.PI * x) / wavelength)
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 慢轴分量（蓝色，带相位延迟）
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const y = centerY - amplitude * Math.sin((2 * Math.PI * x) / wavelength + phase)
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 相位差标注
    ctx.fillStyle = '#fbbf24'
    ctx.font = '10px sans-serif'
    ctx.fillText('快轴 ──', 10, 20)
    ctx.fillStyle = '#60a5fa'
    ctx.fillText('慢轴 ──', 10, height - 10)

    const phaseText = waveplateType === 'quarter' ? 'Δφ = π/2 (λ/4)' : 'Δφ = π (λ/2)'
    ctx.fillStyle = dt.textSecondary
    ctx.textAlign = 'right'
    ctx.fillText(phaseText, width - 10, 20)
  }, [waveplateType, dt.isDark])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{ width: 280, height: 140 }}
    />
  )
}

// ========================================
// Poincare Sphere Visualization
// ========================================

interface PoincareSphereProps {
  stokesParams: [number, number, number, number] // [S0, S1, S2, S3]
  inputStokes?: [number, number, number, number]
  size?: number
  showTrajectory?: boolean
  trajectoryPoints?: Array<[number, number, number, number]>
}

function PoincareSphere({
  stokesParams,
  inputStokes,
  size = 140,
  showTrajectory = false,
  trajectoryPoints = [],
}: PoincareSphereProps) {
  const dt = useDemoTheme()
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 15

  // Convert normalized Stokes to sphere coordinates
  // S1 = x (horizontal), S2 = z (into screen), S3 = y (vertical)
  const [_s0, s1, s2, s3] = stokesParams
  const norm = Math.sqrt(s1 * s1 + s2 * s2 + s3 * s3) || 1

  // Normalized coordinates
  const nx = s1 / norm
  const ny = s3 / norm // S3 maps to vertical
  const nz = s2 / norm // S2 maps to depth

  // 2D projection (simple orthographic, slightly rotated for depth)
  const projX = centerX + radius * (nx * 0.9 + nz * 0.3)
  const projY = centerY - radius * (ny * 0.9 - nz * 0.1)

  // Input point (if provided)
  const inputPoint = inputStokes
    ? {
        x: centerX + radius * ((inputStokes[1] / norm) * 0.9 + (inputStokes[2] / norm) * 0.3),
        y: centerY - radius * ((inputStokes[3] / norm) * 0.9 - (inputStokes[2] / norm) * 0.1),
      }
    : null

  // Determine polarization type from position
  const getPolarizationLabel = () => {
    if (Math.abs(ny) > 0.9) return ny > 0 ? 'RCP' : 'LCP'
    if (Math.abs(ny) < 0.1) {
      const angle = Math.atan2(s2, s1) * (180 / Math.PI) / 2
      return `Linear ${((angle + 180) % 180).toFixed(0)}°`
    }
    return 'Elliptical'
  }

  return (
    <div className={cn(
      "rounded-2xl border p-3",
      dt.isDark
        ? "bg-slate-900/50 border-slate-700/50"
        : "bg-white border-gray-200 shadow-sm"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-xs font-medium", dt.isDark ? "text-gray-300" : "text-gray-700")}>Poincare Sphere</span>
        <span className={cn("text-[10px]", dt.isDark ? "text-cyan-400" : "text-cyan-600")}>{getPolarizationLabel()}</span>
      </div>

      <svg width={size} height={size} className="mx-auto">
        {/* Sphere background */}
        <defs>
          <radialGradient id="sphere-gradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <filter id="glow-point">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main sphere */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="url(#sphere-gradient)"
          stroke="#475569"
          strokeWidth="1"
        />

        {/* Equator (linear polarization) */}
        <ellipse
          cx={centerX}
          cy={centerY}
          rx={radius * 0.9}
          ry={radius * 0.15}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1"
          opacity="0.4"
          strokeDasharray="3 2"
        />

        {/* Vertical meridian */}
        <ellipse
          cx={centerX}
          cy={centerY}
          rx={radius * 0.15}
          ry={radius * 0.9}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="3 2"
        />

        {/* Axis labels */}
        <text x={centerX + radius + 5} y={centerY + 4} fill="#94a3b8" fontSize="8">
          S₁
        </text>
        <text x={centerX} y={centerY - radius - 5} textAnchor="middle" fill="#94a3b8" fontSize="8">
          S₃ (RCP)
        </text>
        <text x={centerX} y={centerY + radius + 12} textAnchor="middle" fill="#94a3b8" fontSize="8">
          (LCP)
        </text>

        {/* Pole markers */}
        <circle cx={centerX} cy={centerY - radius * 0.9} r="3" fill="#ff44ff" opacity="0.6" />
        <circle cx={centerX} cy={centerY + radius * 0.9} r="3" fill="#44ffff" opacity="0.6" />

        {/* Equator key points */}
        <circle cx={centerX + radius * 0.9} cy={centerY} r="2" fill="#ff4444" opacity="0.6" />
        <circle cx={centerX - radius * 0.9} cy={centerY} r="2" fill="#44ff44" opacity="0.6" />

        {/* Trajectory (if enabled) */}
        {showTrajectory && trajectoryPoints.length > 1 && (
          <path
            d={trajectoryPoints
              .map((pt, i) => {
                const pNorm = Math.sqrt(pt[1] ** 2 + pt[2] ** 2 + pt[3] ** 2) || 1
                const px = centerX + radius * ((pt[1] / pNorm) * 0.9 + (pt[2] / pNorm) * 0.3)
                const py = centerY - radius * ((pt[3] / pNorm) * 0.9 - (pt[2] / pNorm) * 0.1)
                return i === 0 ? `M ${px},${py}` : `L ${px},${py}`
              })
              .join(' ')}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            opacity="0.6"
            strokeDasharray="2 2"
          />
        )}

        {/* Input state point */}
        {inputPoint && (
          <circle
            cx={inputPoint.x}
            cy={inputPoint.y}
            r="4"
            fill="#fbbf24"
            stroke="white"
            strokeWidth="1"
            opacity="0.7"
          />
        )}

        {/* Current state point */}
        <motion.circle
          cx={projX}
          cy={projY}
          r="6"
          fill="#22d3ee"
          stroke="white"
          strokeWidth="2"
          filter="url(#glow-point)"
          animate={{ cx: projX, cy: projY }}
          transition={{ duration: 0.15 }}
        />
      </svg>

      {/* Stokes parameter display */}
      <div className="grid grid-cols-4 gap-1 mt-2 text-[9px] font-mono">
        <div className="text-center">
          <div className={dt.subtleTextClass}>S₀</div>
          <div className={dt.isDark ? "text-white" : "text-gray-800"}>{stokesParams[0].toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className={dt.subtleTextClass}>S₁</div>
          <div className="text-red-400">{stokesParams[1].toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className={dt.subtleTextClass}>S₂</div>
          <div className="text-green-400">{stokesParams[2].toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className={dt.subtleTextClass}>S₃</div>
          <div className="text-purple-400">{stokesParams[3].toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}

// 预设按钮组件
function PresetButton({
  label,
  isActive,
  onClick,
  color,
}: {
  label: string
  isActive: boolean
  onClick: () => void
  color: string
}) {
  const dt = useDemoTheme()
  return (
    <motion.button
      className={cn(
        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
        isActive
          ? 'bg-opacity-20 border-opacity-50'
          : `${dt.inactiveButtonClass} hover:border-slate-500`
      )}
      style={{
        backgroundColor: isActive ? `${color}20` : undefined,
        borderColor: isActive ? `${color}80` : undefined,
        color: isActive ? color : undefined,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  )
}

// ========================================
// Calculate output using unified physics engine
// ========================================
function calculateWithUnifiedEngine(
  waveplateType: WaveplateType,
  inputAngleDeg: number,
  fastAxisAngleDeg: number,
): {
  stokes: [number, number, number, number]
  inputStokes: [number, number, number, number]
  intensity: number
  dop: number
  orientationAngle: number
  ellipticityAngle: number
} {
  const DEG_TO_RAD = Math.PI / 180

  // Create input state using unified engine
  const inputState = CoherencyMatrix.createLinear(1.0, inputAngleDeg * DEG_TO_RAD)
  const inputStokes = inputState.toStokes() as [number, number, number, number]

  // Create waveplate Jones matrix
  const retardance = waveplateType === 'quarter' ? Math.PI / 2 : Math.PI
  const theta = fastAxisAngleDeg * DEG_TO_RAD
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const c2 = c * c
  const s2 = s * s
  const cs = c * s

  const eid = Complex.exp(retardance)
  const eidm1 = eid.sub(Complex.ONE)

  const a00 = new Complex(c2).add(eid.scale(s2))
  const a01 = new Complex(cs).mul(eidm1)
  const a11 = new Complex(s2).add(eid.scale(c2))

  const waveplateMatrix = new Matrix2x2(a00, a01, a01, a11)
  const outputState = inputState.applyOperator(waveplateMatrix)

  const stokes = outputState.toStokes() as [number, number, number, number]

  return {
    stokes,
    inputStokes,
    intensity: outputState.intensity,
    dop: outputState.degreeOfPolarization,
    orientationAngle: outputState.orientationAngle * (180 / Math.PI),
    ellipticityAngle: outputState.ellipticityAngle * (180 / Math.PI),
  }
}

// 使用Jones矩阵计算非理想波片输出
function calculateNonIdealOutput(
  waveplateType: WaveplateType,
  inputAngle: number,
  fastAxisAngle: number,
  params: WaveplateParams,
  wavelength: number = 550,
): {
  outputJones: JonesVector
  outputStokes: StokesVector
  actualRetardation: number
  outputIntensity: number
  ellipticity: number
} {
  // 创建输入Jones矢量
  const inputJones = JonesVector.linearPolarizationDegrees(inputAngle, 1)

  // 标称相位延迟
  const nominalRetardation = waveplateType === 'quarter' ? Math.PI / 2 : Math.PI

  // 计算实际相位延迟（考虑波长和相位误差）
  let actualRetardation: number
  if (params.useNonIdeal) {
    // 波长效应 + 相位误差
    actualRetardation = waveplateRetardation(
      params.designWavelength,
      wavelength,
      nominalRetardation
    ) + params.phaseError

    // 使用非理想波片矩阵
    const matrix = JonesMatrix.nonIdealWaveplate(
      nominalRetardation,
      fastAxisAngle,
      params,
      wavelength
    )
    const outputJones = matrix.apply(inputJones)
    const outputStokes = StokesVector.fromJonesVector(outputJones)

    // 计算椭圆度
    const ellipticity = Math.abs(outputStokes.ellipticityAngle / 45)

    return {
      outputJones,
      outputStokes,
      actualRetardation,
      outputIntensity: outputJones.intensity,
      ellipticity,
    }
  } else {
    // 理想波片
    actualRetardation = nominalRetardation
    const matrix = JonesMatrix.waveplate(actualRetardation, fastAxisAngle * Math.PI / 180)
    const outputJones = matrix.apply(inputJones)
    const outputStokes = StokesVector.fromJonesVector(outputJones)
    const ellipticity = Math.abs(outputStokes.ellipticityAngle / 45)

    return {
      outputJones,
      outputStokes,
      actualRetardation,
      outputIntensity: outputJones.intensity,
      ellipticity,
    }
  }
}

// 主演示组件
export function WaveplateDemo() {
  const dt = useDemoTheme()
  const [waveplateType, setWaveplateType] = useState<WaveplateType>('quarter')
  const [inputAngle, setInputAngle] = useState(45)
  const [fastAxisAngle, setFastAxisAngle] = useState(0)
  const [animate, setAnimate] = useState(true)

  // 研究模式状态
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('basic')
  const [wavelength, setWavelength] = useState(550)
  const [nonIdealParams, setNonIdealParams] = useState<WaveplateParams>({
    ...TYPICAL_WAVEPLATE,
    useNonIdeal: false,
  })
  const [showPoincare, setShowPoincare] = useState(true)

  const relativeAngle = ((inputAngle - fastAxisAngle) % 180 + 180) % 180

  // Calculate polarization state using unified physics engine
  const unifiedResult = useMemo(() => {
    return calculateWithUnifiedEngine(waveplateType, inputAngle, fastAxisAngle)
  }, [waveplateType, inputAngle, fastAxisAngle])

  // Generate trajectory for Poincare sphere (sweep fast axis angle)
  const trajectoryPoints = useMemo(() => {
    const points: Array<[number, number, number, number]> = []
    for (let fa = 0; fa <= 180; fa += 10) {
      const result = calculateWithUnifiedEngine(waveplateType, inputAngle, fa)
      points.push(result.stokes)
    }
    return points
  }, [waveplateType, inputAngle])

  // 计算非理想输出（仅在研究模式下使用）
  const nonIdealResult = useMemo(() => {
    if (difficultyLevel === 'research' && nonIdealParams.useNonIdeal) {
      return calculateNonIdealOutput(
        waveplateType,
        inputAngle,
        fastAxisAngle,
        nonIdealParams,
        wavelength
      )
    }
    return null
  }, [waveplateType, inputAngle, fastAxisAngle, nonIdealParams, wavelength, difficultyLevel])

  // 波长颜色
  const wavelengthColor = useMemo(() => {
    const rgb = wavelengthToRGB(wavelength)
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }, [wavelength])

  // 计算输出偏振态描述
  const getOutputDescription = () => {
    if (waveplateType === 'quarter') {
      if (Math.abs(relativeAngle - 45) < 5 || Math.abs(relativeAngle - 135) < 5) {
        return { text: '圆偏振光', color: '#22d3ee' }
      } else if (relativeAngle < 5 || Math.abs(relativeAngle - 90) < 5) {
        return { text: '线偏振光（不变）', color: '#44ff44' }
      } else {
        return { text: '椭圆偏振光', color: '#a78bfa' }
      }
    } else {
      const outputAngle = ((2 * fastAxisAngle - inputAngle) % 180 + 180) % 180
      return { text: `线偏振光 (${outputAngle.toFixed(0)}°)`, color: '#44ff44' }
    }
  }

  const outputDesc = getOutputDescription()

  // 常用配置预设
  const presets = waveplateType === 'quarter'
    ? [
        { label: '45°→圆', inputAngle: 45, fastAxisAngle: 0 },
        { label: '0°→不变', inputAngle: 0, fastAxisAngle: 0 },
        { label: '30°→椭圆', inputAngle: 30, fastAxisAngle: 0 },
      ]
    : [
        { label: '45°→90°', inputAngle: 45, fastAxisAngle: 67.5 },
        { label: '0°→90°', inputAngle: 0, fastAxisAngle: 45 },
        { label: '45°→0°', inputAngle: 45, fastAxisAngle: 22.5 },
      ]

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* 标题 */}
      <DemoHeader
        title="波片原理"
        subtitle="λ/4和λ/2波片如何改变光的偏振态"
        gradient="purple"
      />

      {/* 难度级别选择 */}
      <div className="flex justify-center gap-2">
        <motion.button
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-medium border transition-all',
            difficultyLevel === 'basic'
              ? 'bg-green-500/20 text-green-400 border-green-500/50'
              : `${dt.inactiveButtonClass} hover:border-slate-500`
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDifficultyLevel('basic')}
        >
          基础模式
        </motion.button>
        <motion.button
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-medium border transition-all',
            difficultyLevel === 'research'
              ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
              : `${dt.inactiveButtonClass} hover:border-slate-500`
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDifficultyLevel('research')}
        >
          研究模式
        </motion.button>
      </div>

      {/* 波片类型选择 */}
      <div className="flex justify-center gap-4">
        <motion.button
          className={cn(
            'px-6 py-3 rounded-2xl text-sm font-medium border-2 transition-all',
            waveplateType === 'quarter'
              ? 'bg-purple-500/20 text-purple-400 border-purple-400/50'
              : `${dt.inactiveButtonClass} hover:border-slate-500`
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setWaveplateType('quarter')}
        >
          λ/4 四分之一波片
        </motion.button>
        <motion.button
          className={cn(
            'px-6 py-3 rounded-2xl text-sm font-medium border-2 transition-all',
            waveplateType === 'half'
              ? 'bg-pink-500/20 text-pink-400 border-pink-400/50'
              : `${dt.inactiveButtonClass} hover:border-slate-500`
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setWaveplateType('half')}
        >
          λ/2 二分之一波片
        </motion.button>
      </div>

      {/* 可视化面板 */}
      <VisualizationPanel variant="indigo">
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn('text-sm font-semibold', dt.isDark ? 'text-white' : 'text-gray-800')}>光路演示</h3>
          <div className="flex items-center gap-2">
            <span className={cn('text-xs', dt.subtleTextClass)}>快速预设:</span>
            {presets.map((preset) => (
              <PresetButton
                key={preset.label}
                label={preset.label}
                isActive={inputAngle === preset.inputAngle && fastAxisAngle === preset.fastAxisAngle}
                onClick={() => {
                  setInputAngle(preset.inputAngle)
                  setFastAxisAngle(preset.fastAxisAngle)
                }}
                color={waveplateType === 'quarter' ? '#a78bfa' : '#f472b6'}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <WaveplateCanvas
            waveplateType={waveplateType}
            inputAngle={inputAngle}
            fastAxisAngle={fastAxisAngle}
            animate={animate}
          />
        </div>
      </VisualizationPanel>

      {/* 核心公式 */}
      <FormulaHighlight
        formula={waveplateType === 'half'
          ? 'θ_out = 2θ_fast - θ_in'
          : 'Δφ = π/2 (90°)  |  45° linear → circular'}
        description={waveplateType === 'half'
          ? '半波片将线偏振方向旋转 2(θ_fast - θ_in)'
          : '当相对角度为45°时，四分之一波片产生圆偏振'}
      />

      {/* 计算结果统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="相对角度"
          value={`${relativeAngle.toFixed(0)}`}
          unit="°"
          color="orange"
        />
        <StatCard
          label="输出偏振态"
          value={outputDesc.text}
          color={outputDesc.color === '#22d3ee' ? 'cyan' : outputDesc.color === '#a78bfa' ? 'purple' : 'green'}
        />
        <StatCard
          label="方位角 ψ"
          value={`${unifiedResult.orientationAngle.toFixed(1)}`}
          unit="°"
          color="blue"
        />
        <StatCard
          label="椭率角 χ"
          value={`${unifiedResult.ellipticityAngle.toFixed(1)}`}
          unit="°"
          color="purple"
        />
      </div>

      {/* 控制和信息面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 参数控制 */}
        <ControlPanel title="参数控制">
          <SliderControl
            label="入射偏振角度"
            value={inputAngle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={setInputAngle}
            color="orange"
          />
          <SliderControl
            label="快轴方向"
            value={fastAxisAngle}
            min={0}
            max={180}
            step={5}
            unit="°"
            onChange={setFastAxisAngle}
            color="cyan"
          />
          <motion.button
            onClick={() => setAnimate(!animate)}
            className={cn(
              'w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              animate
                ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                : `border ${dt.inactiveButtonClass}`
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {animate ? '⏸ 暂停动画' : '▶ 播放动画'}
          </motion.button>

          {/* Poincare sphere toggle */}
          <div className={cn('flex items-center justify-between pt-2 border-t mt-2', dt.borderClass)}>
            <span className={cn('text-xs', dt.mutedTextClass)}>Poincare 球可视化</span>
            <Toggle
              label=""
              checked={showPoincare}
              onChange={setShowPoincare}
            />
          </div>
        </ControlPanel>

        {/* 相位延迟图 */}
        <ChartPanel title="相位延迟示意" subtitle={waveplateType === 'quarter' ? 'π/2 (90°)' : 'π (180°)'}>
          <PhaseRetardationDiagram waveplateType={waveplateType} />
          <div className={cn('text-xs mt-2', dt.subtleTextClass)}>
            {waveplateType === 'quarter'
              ? '快轴与慢轴相位差为 π/2 (90°)'
              : '快轴与慢轴相位差为 π (180°)'}
          </div>
        </ChartPanel>

        {/* Poincare Sphere Visualization (from unified engine) */}
        {showPoincare && (
          <PoincareSphere
            stokesParams={unifiedResult.stokes}
            inputStokes={unifiedResult.inputStokes}
            showTrajectory={true}
            trajectoryPoints={trajectoryPoints}
          />
        )}

        {/* 研究模式：非理想参数控制 */}
        {difficultyLevel === 'research' && (
          <ControlPanel title="非理想波片参数">
            {/* 启用非理想模式 */}
            <div className={cn('flex items-center justify-between py-2 border-b', dt.borderClass)}>
              <span className={cn('text-xs', dt.mutedTextClass)}>启用非理想模拟</span>
              <Toggle
                label=""
                checked={nonIdealParams.useNonIdeal}
                onChange={(checked) => setNonIdealParams({ ...nonIdealParams, useNonIdeal: checked })}
              />
            </div>

            {nonIdealParams.useNonIdeal && (
              <div className="space-y-3 pt-2">
                {/* 波长 */}
                <div>
                  <SliderControl
                    label="工作波长 λ"
                    value={wavelength}
                    min={400}
                    max={700}
                    step={10}
                    unit=" nm"
                    onChange={setWavelength}
                    color="purple"
                  />
                  <div
                    className="h-2 rounded-full mt-1"
                    style={{ backgroundColor: wavelengthColor }}
                  />
                </div>

                {/* 设计波长 */}
                <SliderControl
                  label="设计波长"
                  value={nonIdealParams.designWavelength}
                  min={500}
                  max={600}
                  step={10}
                  unit=" nm"
                  onChange={(v) => setNonIdealParams({ ...nonIdealParams, designWavelength: v })}
                  color="cyan"
                />

                {/* 相位误差 */}
                <SliderControl
                  label="相位误差"
                  value={nonIdealParams.phaseError * 180 / Math.PI}
                  min={-10}
                  max={10}
                  step={0.5}
                  unit="°"
                  onChange={(v) => setNonIdealParams({ ...nonIdealParams, phaseError: v * Math.PI / 180 })}
                  color="orange"
                  formatValue={(v) => (v >= 0 ? '+' : '') + v.toFixed(1)}
                />

                {/* 快轴对准误差 */}
                <SliderControl
                  label="快轴对准误差"
                  value={nonIdealParams.axisError}
                  min={-5}
                  max={5}
                  step={0.1}
                  unit="°"
                  onChange={(v) => setNonIdealParams({ ...nonIdealParams, axisError: v })}
                  color="red"
                  formatValue={(v) => (v >= 0 ? '+' : '') + v.toFixed(1)}
                />

                {/* 透过率 */}
                <SliderControl
                  label="透过率"
                  value={nonIdealParams.transmittance * 100}
                  min={80}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(v) => setNonIdealParams({ ...nonIdealParams, transmittance: v / 100 })}
                  color="green"
                />

                {/* 预设按钮 */}
                <div className={cn('flex gap-2 pt-2 border-t', dt.borderClass)}>
                  <motion.button
                    className={cn('flex-1 px-2 py-1.5 text-xs rounded-lg', dt.isDark ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600' : 'bg-slate-100 text-gray-600 hover:bg-slate-200')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setNonIdealParams({ ...IDEAL_WAVEPLATE, useNonIdeal: true })}
                  >
                    理想波片
                  </motion.button>
                  <motion.button
                    className={cn('flex-1 px-2 py-1.5 text-xs rounded-lg', dt.isDark ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600' : 'bg-slate-100 text-gray-600 hover:bg-slate-200')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setNonIdealParams({ ...TYPICAL_WAVEPLATE, useNonIdeal: true })}
                  >
                    典型波片
                  </motion.button>
                </div>
              </div>
            )}

            {/* 非理想计算结果 */}
            {nonIdealParams.useNonIdeal && nonIdealResult && (
              <div className={cn('mt-3 pt-3 border-t space-y-2', dt.borderClass)}>
                <div className={cn('text-xs font-medium', dt.subtleTextClass)}>非理想计算结果</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={cn('p-2 rounded-lg', dt.isDark ? 'bg-slate-900/50' : 'bg-slate-100')}>
                    <div className={dt.subtleTextClass}>实际相位延迟</div>
                    <div className={cn('font-mono', dt.isDark ? 'text-purple-400' : 'text-purple-600')}>
                      {(nonIdealResult.actualRetardation * 180 / Math.PI).toFixed(2)}°
                    </div>
                  </div>
                  <div className={cn('p-2 rounded-lg', dt.isDark ? 'bg-slate-900/50' : 'bg-slate-100')}>
                    <div className={dt.subtleTextClass}>输出强度</div>
                    <div className={cn('font-mono', dt.isDark ? 'text-green-400' : 'text-green-600')}>
                      {(nonIdealResult.outputIntensity * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className={cn('p-2 rounded-lg', dt.isDark ? 'bg-slate-900/50' : 'bg-slate-100')}>
                    <div className={dt.subtleTextClass}>椭圆度</div>
                    <div className={cn('font-mono', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>
                      {(nonIdealResult.ellipticity * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className={cn('p-2 rounded-lg', dt.isDark ? 'bg-slate-900/50' : 'bg-slate-100')}>
                    <div className={dt.subtleTextClass}>偏振度(DOP)</div>
                    <div className={cn('font-mono', dt.isDark ? 'text-orange-400' : 'text-orange-600')}>
                      {(nonIdealResult.outputStokes.degreeOfPolarization * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* 偏差提示 */}
                {Math.abs(nonIdealResult.actualRetardation - (waveplateType === 'quarter' ? Math.PI / 2 : Math.PI)) > 0.05 && (
                  <div className={cn(
                    'p-2 rounded-lg text-xs border',
                    dt.isDark
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                      : 'bg-orange-50 border-orange-200 text-orange-700'
                  )}>
                    相位偏差显著：输出偏振态与理想情况有明显差异。
                    {waveplateType === 'quarter' && nonIdealResult.ellipticity < 0.9 && (
                      <span> 原本应产生圆偏振光，现在产生椭圆偏振光。</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </ControlPanel>
        )}
      </div>

      {/* 波片功能说明 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={cn(
          'p-4 rounded-2xl border',
          waveplateType === 'quarter'
            ? dt.isDark ? 'bg-purple-500/10 border-purple-400/30' : 'bg-purple-50 border-purple-200'
            : dt.panelClass
        )}>
          <h4 className={cn('font-semibold mb-2', dt.isDark ? 'text-purple-400' : 'text-purple-600')}>λ/4 四分之一波片</h4>
          <ul className={cn('text-xs space-y-1', dt.bodyClass)}>
            <li>* 相位延迟: π/2 (90°)</li>
            <li>* 45°线偏振 → 圆偏振</li>
            <li>* 0°/90°线偏振 → 保持不变</li>
            <li>* 其他角度 → 椭圆偏振</li>
          </ul>
        </div>
        <div className={cn(
          'p-4 rounded-2xl border',
          waveplateType === 'half'
            ? dt.isDark ? 'bg-pink-500/10 border-pink-400/30' : 'bg-pink-50 border-pink-200'
            : dt.panelClass
        )}>
          <h4 className={cn('font-semibold mb-2', dt.isDark ? 'text-pink-400' : 'text-pink-600')}>λ/2 二分之一波片</h4>
          <ul className={cn('text-xs space-y-1', dt.bodyClass)}>
            <li>* 相位延迟: π (180°)</li>
            <li>* 线偏振方向旋转</li>
            <li>* 旋转角度 = 2 × 快轴角度</li>
            <li>* 可实现任意线偏振角度转换</li>
          </ul>
        </div>
      </div>

      {/* 现实应用场景 */}
      <InfoGrid columns={3}>
        <InfoCard title="相机滤镜" color="cyan">
          <p className={cn('text-xs', dt.bodyClass)}>
            摄影中的圆偏振滤镜(CPL)使用λ/4波片，消除玻璃反射和水面眩光，增强蓝天对比度。
          </p>
        </InfoCard>
        <InfoCard title="光学隔离器" color="purple">
          <p className={cn('text-xs', dt.bodyClass)}>
            激光系统中使用波片组合防止反射光返回，保护激光器稳定工作。
          </p>
        </InfoCard>
        <InfoCard title="3D显示" color="orange">
          <p className={cn('text-xs', dt.bodyClass)}>
            主动式3D眼镜使用快速切换的波片，交替显示左右眼图像实现立体显示。
          </p>
        </InfoCard>
      </InfoGrid>
    </div>
  )
}
