/**
 * BeamGlowFilters.tsx -- 共享 SVG 滤镜定义
 *
 * 提供光束辉光效果和元素交互辉光的 SVG filter 和渐变定义。
 * 在 IsometricScene 的 <defs> 中渲染一次，所有组件引用共享 filter ID。
 *
 * 视觉层级 (VISL-03 -- 光束始终最亮):
 * - beam-glow: stdDeviation 1.25 (最强 -- 高强度光束段, Phase 5 柔化)
 * - beam-glow-soft: stdDeviation 0.7 (低强度光束段, Phase 5 柔化)
 * - element-select-glow: stdDeviation 1.2 (元素选中)
 * - element-hover-glow: stdDeviation 0.8 (元素悬停 -- 最弱)
 *
 * 性能优化:
 * - stdDeviation 上限 1.25 (研究 pitfall 1: SVG 滤镜是 CPU 光栅化的)
 * - 使用 feMerge 将模糊层叠在源图形下方
 * - filter region 扩展防止辉光裁剪
 */

import React from 'react'

/**
 * BeamGlowFilters -- SVG 滤镜组件 (光束辉光 + 元素交互辉光)
 *
 * Phase 5 refinement: softer bloom (1.5 -> 1.25 for natural glow),
 * smoother soft filter (0.8 -> 0.7 for gentler low-intensity segments)
 */
export const BeamGlowFilters = React.memo(function BeamGlowFilters() {
  return (
    <>
      {/* ── 光束辉光滤镜 ── */}

      {/* 标准辉光滤镜 -- 高强度光束段 (stdDeviation 1.25, 柔和自然光晕) */}
      <filter id="beam-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.25" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 柔和辉光滤镜 -- 低强度光束段 (stdDeviation 0.7, 更温柔) */}
      <filter id="beam-glow-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="0.7" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ── 元素交互辉光滤镜 (VISL-03: 始终弱于光束辉光) ── */}

      {/* 悬停辉光 -- 柔和蓝色 (stdDeviation 0.8, flood #6CB4FF 40%) */}
      <filter id="element-hover-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur" />
        <feFlood floodColor="#6CB4FF" floodOpacity="0.4" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 选中辉光 -- 较亮蓝色 (stdDeviation 1.2, flood #4DA6FF 60%) */}
      <filter id="element-select-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
        <feFlood floodColor="#4DA6FF" floodOpacity="0.6" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ── 吸附提示滤镜 -- 光束段吸附区域脉冲 ── */}
      <filter id="snap-hint-pulse" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.0" result="blur" />
        <feFlood floodColor="#FFFFFF" floodOpacity="0.3" result="white" />
        <feComposite in="white" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 表面照明渐变 -- 光束照亮下方表面的效果 (Phase 5: 增强表面照明, 更自然扩散) */}
      <linearGradient id="beam-illumination" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
        <stop offset="20%" stopColor="currentColor" stopOpacity="0.06" />
        <stop offset="40%" stopColor="currentColor" stopOpacity="0.11" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.12" />
        <stop offset="60%" stopColor="currentColor" stopOpacity="0.11" />
        <stop offset="80%" stopColor="currentColor" stopOpacity="0.06" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </>
  )
})
