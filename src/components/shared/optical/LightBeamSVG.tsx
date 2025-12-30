/**
 * LightBeamSVG - 光束可视化SVG组件
 * 支持强度、偏振颜色显示和动画效果
 *
 * 偏振颜色映射说明：
 * 这是一种可视化约定(visualization convention)，而非物理特性。
 * 在现实中，偏振光的颜色由其波长决定，与偏振角度无关。
 * 使用不同颜色区分偏振方向是为了教学可视化目的：
 *   - 0° (水平偏振): 红色 #ff4444
 *   - 45°: 橙色 #ffaa00
 *   - 90° (垂直偏振): 绿色 #44ff44
 *   - 135°: 蓝色 #4444ff
 *
 * 这种颜色编码参考了偏振显微镜中的惯例，并非通用标准。
 */

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
  const getColor = getPolarizationColor || ((angle: number) => {
    const normalizedAngle = ((angle % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'  // 0°附近 - 水平
    if (normalizedAngle < 67.5) return '#ffaa00'  // 45°附近
    if (normalizedAngle < 112.5) return '#44ff44' // 90°附近 - 垂直
    return '#4444ff' // 135°附近
  })

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
