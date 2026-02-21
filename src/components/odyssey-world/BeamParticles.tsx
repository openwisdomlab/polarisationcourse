/**
 * BeamParticles.tsx -- 光束流动粒子组件
 *
 * 渲染沿光束路径流动的小圆点粒子。
 * 粒子位置由 useBeamParticles hook 通过 rAF + 直接 DOM 操作驱动。
 * React 仅负责初始渲染 circle 元素，动画过程无 React 重渲染。
 *
 * React.memo: 此组件很少需要重渲染，因为动画由 rAF 驱动。
 */

import React from 'react'
import { useBeamParticles } from './hooks/useBeamParticles'

interface BeamParticlesProps {
  /** 路径点序列 (屏幕坐标) */
  pathPoints: { x: number; y: number }[]
  /** 粒子流动速度 (0-1) */
  speed: number
  /** 粒子数量 */
  count: number
  /** 粒子颜色 (CSS 颜色值) */
  color: string
}

/**
 * BeamParticles -- 光束粒子渲染器
 *
 * 创建一个 <g> 容器和 {count} 个 <circle> 元素。
 * useBeamParticles hook 通过 rAF 循环直接修改 circle 的 cx/cy 属性。
 */
export const BeamParticles = React.memo(function BeamParticles({
  pathPoints,
  speed,
  count,
  color,
}: BeamParticlesProps) {
  const svgGroupRef = useBeamParticles(pathPoints, speed, count, color)

  if (pathPoints.length < 2) return null

  return (
    <g ref={svgGroupRef} className="beam-particles">
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={0}
          cy={0}
          r={1.8}
          fill={color}
          opacity={0.5}
        />
      ))}
    </g>
  )
})
