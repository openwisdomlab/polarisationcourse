/**
 * BoundaryIndicator.tsx -- 区域边界光束指示器
 *
 * 在区域边界的退出/入口点渲染脉冲渐变光晕:
 * - 退出指示器: "光束继续到相邻区域" -- 光晕向边界方向延伸
 * - 入口指示器: "光束从相邻区域到达" -- 光晕从边界向内延伸
 *
 * 使用 CSS animation (不使用 Framer Motion) 保持轻量，
 * 与主光束层一致的渲染策略 (VISL-03)。
 *
 * 辉光使用较低的 stdDeviation (1.0) 以避免与主光束竞争。
 */

import React from 'react'
import { worldToScreen } from '@/lib/isometric'
import { polarizationToVisual } from './hooks/useBeamPhysics'
import { PolarizationState } from '@/core/physics/unified/PolarizationState'
import type { BoundaryBeam } from '@/stores/odysseyWorldStore'

// ── 方向到偏移的映射 ──────────────────────────────────────────────────

/** 退出方向对应的光晕延伸方向 (屏幕像素偏移) */
const DIRECTION_OFFSETS: Record<string, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -12 },
  south: { dx: 0, dy: 12 },
  east: { dx: 12, dy: 0 },
  west: { dx: -12, dy: 0 },
}

// ── 内联 CSS 动画 (避免全局样式表依赖) ──────────────────────────────────

const pulseKeyframes = `
@keyframes boundary-pulse {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}
`

// ── 组件 ──────────────────────────────────────────────────────────────

interface BoundaryIndicatorProps {
  /** 边界光束信息 */
  beam: BoundaryBeam
  /** 指示器类型: exit = 退出, entry = 入口 */
  type: 'exit' | 'entry'
}

/**
 * BoundaryIndicator -- 单个边界光束指示器
 *
 * 在退出/入口点渲染脉冲渐变椭圆光晕。
 * 颜色从光束的 Stokes 参数计算 (与偏振编码一致)。
 */
export const BoundaryIndicator = React.memo(function BoundaryIndicator({
  beam,
  type,
}: BoundaryIndicatorProps) {
  // 从 Stokes 参数计算视觉颜色
  const polarState = PolarizationState.fromStokes(
    beam.stokes.s0,
    beam.stokes.s1,
    beam.stokes.s2,
    beam.stokes.s3,
  )
  const visual = polarizationToVisual(polarState)

  // 计算屏幕位置
  const screen = worldToScreen(beam.exitPoint.x, beam.exitPoint.y)

  // 光晕延伸方向 (退出向外，入口向内)
  const dirOffset = DIRECTION_OFFSETS[beam.exitDirection] ?? { dx: 0, dy: 0 }
  // 入口光束的方向反转 (从边界向内)
  const multiplier = type === 'entry' ? -1 : 1

  const glowCx = screen.x + dirOffset.dx * multiplier
  const glowCy = screen.y + dirOffset.dy * multiplier

  // 唯一 ID 用于渐变引用
  const gradientId = `boundary-glow-${type}-${beam.exitDirection}-${Math.round(beam.exitPoint.x)}-${Math.round(beam.exitPoint.y)}`

  return (
    <g>
      {/* 内联 keyframes (只需注入一次，但 SVG 中多次无害) */}
      <style>{pulseKeyframes}</style>

      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor={visual.color} stopOpacity="0.6" />
          <stop offset="60%" stopColor={visual.color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={visual.color} stopOpacity="0" />
        </radialGradient>

        {/* 轻量辉光滤镜 (stdDeviation 1.0, 低于主光束的 1.5) */}
        <filter id={`${gradientId}-blur`}>
          <feGaussianBlur stdDeviation="1.0" />
        </filter>
      </defs>

      {/* 脉冲光晕椭圆 */}
      <ellipse
        cx={glowCx}
        cy={glowCy}
        rx={10}
        ry={6}
        fill={`url(#${gradientId})`}
        filter={`url(#${gradientId}-blur)`}
        style={{
          animation: 'boundary-pulse 2s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* 中心亮点 (退出指示器更亮) */}
      <circle
        cx={screen.x}
        cy={screen.y}
        r={type === 'exit' ? 3 : 2}
        fill={visual.color}
        opacity={type === 'exit' ? 0.5 : 0.35}
        style={{
          animation: 'boundary-pulse 2s ease-in-out infinite',
          animationDelay: '0.3s',
          pointerEvents: 'none',
        }}
      />
    </g>
  )
})

// ── 批量渲染组件 ──────────────────────────────────────────────────────

interface BoundaryIndicatorsProps {
  exitBeams: BoundaryBeam[]
  incomingBeams: BoundaryBeam[]
}

/**
 * BoundaryIndicators -- 渲染所有边界指示器
 *
 * 在光束层 (Layer 3) 中渲染，
 * 退出和入口指示器同时显示。
 */
export const BoundaryIndicators = React.memo(function BoundaryIndicators({
  exitBeams,
  incomingBeams,
}: BoundaryIndicatorsProps) {
  if (exitBeams.length === 0 && incomingBeams.length === 0) return null

  return (
    <g className="boundary-indicators" style={{ pointerEvents: 'none' }}>
      {exitBeams.map((beam, i) => (
        <BoundaryIndicator
          key={`exit-${beam.exitDirection}-${i}`}
          beam={beam}
          type="exit"
        />
      ))}
      {incomingBeams.map((beam, i) => (
        <BoundaryIndicator
          key={`entry-${beam.exitDirection}-${i}`}
          beam={beam}
          type="entry"
        />
      ))}
    </g>
  )
})
