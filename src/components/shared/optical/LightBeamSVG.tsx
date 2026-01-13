/**
 * LightBeamSVG - 光束可视化SVG组件
 * 支持强度、偏振颜色显示和动画效果
 *
 * 偏振颜色映射说明：
 * 这是一种可视化约定(visualization convention)，而非物理特性。
 * 在现实中，偏振光的颜色由其波长决定，与偏振角度无关。
 * 使用不同颜色区分偏振方向是为了教学可视化目的。
 *
 * 支持三种色彩模式（通过 getPolarizationColor 从 lib/polarization 获取）：
 *   - discrete: 经典4色（0°=红, 45°=橙, 90°=绿, 135°=蓝）
 *   - continuous: 连续彩虹渐变（角度→色相映射）
 *   - michelLevy: 米歇尔-莱维干涉色（模拟偏光显微镜）
 *
 * 这种颜色编码参考了偏振显微镜中的惯例，并非通用标准。
 */

import { getPolarizationColor as getDefaultColor } from '@/lib/polarization'
import type { GetPolarizationColorFn, LightBeamSegment } from './types'

export interface LightBeamSVGProps {
  beam: LightBeamSegment
  showPolarization?: boolean
  isAnimating?: boolean
  getPolarizationColor?: GetPolarizationColorFn
  glowFilterId?: string // 外发光滤镜ID
  flowGradientId?: string // 流动渐变ID
}

export function LightBeamSVG({
  beam,
  showPolarization = true,
  isAnimating = true,
  getPolarizationColor,
  glowFilterId = 'glow',
  flowGradientId = 'beamFlow',
}: LightBeamSVGProps) {
  // 偏振角度到颜色的映射函数 - 这是可视化约定，非物理特性
  // 颜色周期为180°，因为偏振方向具有180°对称性
  // 使用集中管理的色彩函数，支持三种模式：discrete/continuous/michelLevy
  const getColor = getPolarizationColor || getDefaultColor

  const opacity = Math.max(0.2, beam.intensity / 100)
  const strokeWidth = Math.max(0.5, (beam.intensity / 100) * 2)
  const color = showPolarization ? getColor(beam.polarization) : '#ffffaa'

  return (
    <g>
      {/* 主光束 */}
      <line
        x1={beam.startX}
        y1={beam.startY}
        x2={beam.endX}
        y2={beam.endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        filter={`url(#${glowFilterId})`}
        strokeLinecap="round"
      />
      {/* 外发光效果 */}
      <line
        x1={beam.startX}
        y1={beam.startY}
        x2={beam.endX}
        y2={beam.endY}
        stroke={color}
        strokeWidth={strokeWidth * 3}
        strokeOpacity={opacity * 0.3}
        strokeLinecap="round"
      />
      {/* 流动动画 */}
      {isAnimating && beam.intensity > 10 && (
        <line
          x1={beam.startX}
          y1={beam.startY}
          x2={beam.endX}
          y2={beam.endY}
          stroke={`url(#${flowGradientId})`}
          strokeWidth={strokeWidth * 0.5}
          strokeOpacity={0.5}
          strokeLinecap="round"
        />
      )}
    </g>
  )
}

/**
 * SVG滤镜和渐变定义
 * 在SVG的defs中使用
 */
export function LightBeamDefs() {
  return (
    <>
      {/* 外发光滤镜 */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {/* 流动动画渐变 */}
      <linearGradient id="beamFlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,150,0.3)">
          <animate attributeName="offset" values="-1;1" dur="2s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="rgba(255,255,255,0.8)">
          <animate attributeName="offset" values="-0.5;1.5" dur="2s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="rgba(255,255,150,0.3)">
          <animate attributeName="offset" values="0;2" dur="2s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </>
  )
}

/**
 * 批量渲染多条光束
 */
export interface LightBeamsProps {
  beams: LightBeamSegment[]
  showPolarization?: boolean
  isAnimating?: boolean
  getPolarizationColor?: GetPolarizationColorFn
}

export function LightBeams({
  beams,
  showPolarization = true,
  isAnimating = true,
  getPolarizationColor,
}: LightBeamsProps) {
  return (
    <g>
      {beams.map((beam, i) => (
        <LightBeamSVG
          key={i}
          beam={beam}
          showPolarization={showPolarization}
          isAnimating={isAnimating}
          getPolarizationColor={getPolarizationColor}
        />
      ))}
    </g>
  )
}
