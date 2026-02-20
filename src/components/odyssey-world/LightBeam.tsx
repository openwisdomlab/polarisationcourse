/**
 * LightBeam.tsx -- 偏振编码光束段渲染器
 *
 * 渲染单个光束段的 SVG 可视化:
 * - 光束主体: SVG <line> + glow filter + 圆端点
 * - 辉光光晕: 更宽、更透明的背景线条
 * - 形状编码: 线偏振=直线, 圆偏振=螺旋标记, 椭圆偏振=椭圆标记
 * - 表面照明: 光束下方的低透明度彩色区域
 * - 流动粒子: BeamParticles 子组件
 *
 * 全消光处理: opacity < 0.05 时不渲染 (CONTEXT.md)
 */

import React, { useMemo } from 'react'
import type { BeamSegment } from '@/stores/odysseyWorldStore'
import { worldToScreen } from '@/lib/isometric'
import { BeamParticles } from './BeamParticles'

interface LightBeamProps {
  segment: BeamSegment
  /** 幽灵预览模式: 30% 不透明度, 无粒子, 较细虚线, 无辉光滤镜 */
  ghost?: boolean
}

/** 每个 Z 层的屏幕空间高度偏移 (像素) */
const Z_OFFSET = 32

/**
 * LightBeam -- 主光束段渲染器
 *
 * 接收一个 BeamSegment，转换为屏幕坐标后渲染:
 * 1. 表面照明效果 (最底层)
 * 2. 辉光光晕 (3x 线宽, 20% 透明度)
 * 3. 光束主体 (带 glow filter)
 * 4. 偏振形状标记 (螺旋/椭圆)
 * 5. 流动粒子
 */
export const LightBeam = React.memo(function LightBeam({ segment, ghost = false }: LightBeamProps) {
  // 全消光: 不渲染
  if (segment.opacity < 0.05) return null

  // 世界坐标 -> 屏幕坐标
  const from = worldToScreen(segment.fromX, segment.fromY)
  const to = worldToScreen(segment.toX, segment.toY)

  // Z 轴偏移
  const fromScreenY = from.y - segment.fromZ * Z_OFFSET
  const toScreenY = to.y - segment.toZ * Z_OFFSET

  // 光束路径点 (屏幕空间)
  const pathPoints = useMemo(
    () => [
      { x: from.x, y: fromScreenY },
      { x: to.x, y: toScreenY },
    ],
    [from.x, fromScreenY, to.x, toScreenY],
  )

  // 幽灵模式: 无辉光滤镜, 较细线宽, 虚线 (VISL-03: 保持光束视觉层级)
  if (ghost) {
    const ghostStrokeWidth = segment.strokeWidth * 0.7
    return (
      <g className="light-beam-ghost">
        <line
          x1={from.x}
          y1={fromScreenY}
          x2={to.x}
          y2={toScreenY}
          stroke={segment.color}
          strokeWidth={ghostStrokeWidth}
          strokeLinecap="round"
          strokeDasharray="6 4"
          opacity={segment.opacity}
        />
      </g>
    )
  }

  // 选择 glow filter (高/低强度)
  const filterId = segment.opacity > 0.5 ? 'beam-glow' : 'beam-glow-soft'

  // 辉光线宽 (主体的 3 倍)
  const haloWidth = segment.strokeWidth * 3

  // 偏振形状标记
  const shapeMarkers = useMemo(() => {
    if (segment.shape === 'line') return null
    return generateShapeMarkers(
      from.x, fromScreenY,
      to.x, toScreenY,
      segment.shape,
      segment.color,
    )
  }, [from.x, fromScreenY, to.x, toScreenY, segment.shape, segment.color])

  // 粒子速度与光束强度成正比
  const particleSpeed = 0.15 + segment.opacity * 0.2
  const particleCount = 10

  // 表面照明区域计算
  const illumination = useMemo(() => {
    const midX = (from.x + to.x) / 2
    const midY = (fromScreenY + toScreenY) / 2
    const dx = to.x - from.x
    const dy = toScreenY - fromScreenY
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    return { midX, midY, length, angle }
  }, [from.x, to.x, fromScreenY, toScreenY])

  return (
    <g className="light-beam-segment">
      {/* 表面照明效果 -- 光束下方的微妙彩色光带 */}
      <ellipse
        cx={illumination.midX}
        cy={illumination.midY + 8}
        rx={illumination.length / 2}
        ry={12}
        fill={segment.color}
        opacity={0.06}
        transform={`rotate(${illumination.angle} ${illumination.midX} ${illumination.midY + 8})`}
      />

      {/* 辉光光晕 -- 3x 线宽, 20% 透明度, 更亮的颜色 */}
      <line
        x1={from.x}
        y1={fromScreenY}
        x2={to.x}
        y2={toScreenY}
        stroke={segment.color}
        strokeWidth={haloWidth}
        strokeLinecap="round"
        opacity={segment.opacity * 0.2}
      />

      {/* 光束主体 -- 带 glow filter */}
      <line
        x1={from.x}
        y1={fromScreenY}
        x2={to.x}
        y2={toScreenY}
        stroke={segment.color}
        strokeWidth={segment.strokeWidth}
        strokeLinecap="round"
        opacity={segment.opacity}
        filter={`url(#${filterId})`}
      />

      {/* 偏振形状标记 */}
      {shapeMarkers}

      {/* 流动粒子 */}
      <BeamParticles
        pathPoints={pathPoints}
        speed={particleSpeed}
        count={particleCount}
        color={segment.color}
      />
    </g>
  )
})

// ── 形状标记生成 ──────────────────────────────────────────────────────

/**
 * 生成偏振形状标记
 *
 * - helix: 螺旋/波浪标记 -- 小圆点交替分布在光束两侧
 * - ellipse-markers: 小椭圆沿路径间隔分布
 */
function generateShapeMarkers(
  x1: number, y1: number,
  x2: number, y2: number,
  shape: 'helix' | 'ellipse-markers',
  color: string,
): React.ReactNode {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  if (length < 20) return null

  // 光束方向的法向量
  const nx = -dy / length
  const ny = dx / length

  // 标记间距
  const spacing = 18
  const count = Math.floor(length / spacing)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  const markers: React.ReactNode[] = []

  if (shape === 'helix') {
    // 螺旋标记: 小圆点交替分布在光束两侧，模拟螺旋旋转
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1)
      const px = x1 + dx * t
      const py = y1 + dy * t
      // 交替偏移 (正弦波形)
      const side = Math.sin(t * Math.PI * 3) * 6
      markers.push(
        <circle
          key={`helix-${i}`}
          cx={px + nx * side}
          cy={py + ny * side}
          r={1.8}
          fill={color}
          opacity={0.5}
        />,
      )
    }
  } else {
    // 椭圆标记: 小椭圆沿路径间隔分布，指示椭圆偏振
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1)
      const px = x1 + dx * t
      const py = y1 + dy * t
      markers.push(
        <ellipse
          key={`ellipse-${i}`}
          cx={px}
          cy={py}
          rx={3}
          ry={1.5}
          fill="none"
          stroke={color}
          strokeWidth={0.8}
          opacity={0.5}
          transform={`rotate(${angle} ${px} ${py})`}
        />,
      )
    }
  }

  return <g className={`shape-markers-${shape}`}>{markers}</g>
}
