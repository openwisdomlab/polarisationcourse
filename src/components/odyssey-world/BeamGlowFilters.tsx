/**
 * BeamGlowFilters.tsx -- 共享 SVG 滤镜定义
 *
 * 提供光束辉光效果的 SVG filter 和渐变定义。
 * 在 IsometricScene 的 <defs> 中渲染一次，所有光束引用共享 filter ID。
 *
 * 性能优化:
 * - stdDeviation 上限 1.5 (研究 pitfall 1: SVG 滤镜是 CPU 光栅化的)
 * - 使用 feMerge 将模糊层叠在源图形下方
 * - filter region 扩展防止辉光裁剪
 */

import React from 'react'

/**
 * BeamGlowFilters -- 光束辉光 SVG 滤镜组件
 *
 * 渲染两个共享滤镜:
 * 1. beam-glow: 标准辉光 (stdDeviation=1.5) -- 用于高强度光束段
 * 2. beam-glow-soft: 柔和辉光 (stdDeviation=0.8) -- 用于低强度光束段
 *
 * 以及表面照明效果的渐变定义。
 */
export const BeamGlowFilters = React.memo(function BeamGlowFilters() {
  return (
    <>
      {/* 标准辉光滤镜 -- 高强度光束段 */}
      <filter id="beam-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 柔和辉光滤镜 -- 低强度光束段 */}
      <filter id="beam-glow-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="0.8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 表面照明渐变 -- 光束照亮下方表面的效果 */}
      <linearGradient id="beam-illumination" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
        <stop offset="30%" stopColor="currentColor" stopOpacity="0.06" />
        <stop offset="70%" stopColor="currentColor" stopOpacity="0.06" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </>
  )
})
