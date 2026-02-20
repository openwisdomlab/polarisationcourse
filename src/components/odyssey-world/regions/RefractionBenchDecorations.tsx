/**
 * RefractionBenchDecorations.tsx -- Refraction Bench 区域装饰
 *
 * 石板蓝色折射工作台的非交互视觉元素 (Monument Valley 品质):
 * - 光学导轨线 (长细矩形)
 * - 角度量角器弧线
 * - 玻璃面片 (各种角度)
 * - 小型棱镜三角形
 * - 透镜轮廓曲线
 * - 精密刻度底纹 (0.03 opacity)
 * - 角度标尺刻度边缘
 * - 棱镜光谱色散微光 (CSS hue-rotate, 8s)
 *
 * 所有装饰在 <g opacity={0.35}> 包裹下渲染，维持光束视觉主导 (VISL-03)。
 * 使用 CSS 动画 (非 Framer Motion) -- Phase 3 决定。
 */

import type { RegionTheme } from './regionRegistry'
import { worldToScreen } from '@/lib/isometric'

interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

/** CSS 动画样式 */
const REFRACTION_ANIMATIONS = `
  @keyframes spectrum-shimmer {
    0% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(40deg); }
    100% { filter: hue-rotate(0deg); }
  }
`

export default function RefractionBenchDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="refraction-bench-decorations" opacity={0.35}>
      {/* CSS 动画定义 */}
      <style>{REFRACTION_ANIMATIONS}</style>

      {/* ── 底层纹理: 精密刻线 (光学台标记风格) ── */}
      <defs>
        <pattern id="refraction-ruled-lines" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
          <line x1={0} y1={10} x2={20} y2={10} stroke={accent} strokeWidth={0.2} opacity={0.4} />
          <line x1={10} y1={0} x2={10} y2={20} stroke={accent} strokeWidth={0.15} opacity={0.3} />
        </pattern>
      </defs>
      <rect
        x={worldToScreen(1, 1).x - 50}
        y={worldToScreen(1, 1).y - 80}
        width={800}
        height={500}
        fill="url(#refraction-ruled-lines)"
        opacity={0.03}
      />

      {/* ── 主要图案 1: 光学导轨 -- 中央横向 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2).y})`}>
        {/* 主导轨 */}
        <rect x={-100} y={-4} width={200} height={8} rx={2} fill={accent} opacity={0.15} />
        {/* 导轨上的校准刻度线 */}
        {Array.from({ length: 21 }, (_, i) => (
          <line
            key={`rail-tick-${i}`}
            x1={-100 + i * 10}
            y1={-4}
            x2={-100 + i * 10}
            y2={i % 5 === 0 ? -14 : -8}
            stroke={accent}
            strokeWidth={i % 5 === 0 ? 0.7 : 0.4}
            opacity={0.4}
          />
        ))}
        {/* 副导轨 */}
        <rect x={-80} y={12} width={160} height={3} rx={1} fill={accent} opacity={0.08} />
      </g>

      {/* ── 主要图案 2: 角度量角器弧 -- 底部中偏右 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2 + 2, gridHeight - 3).x}, ${worldToScreen(gridWidth / 2 + 2, gridHeight - 3).y})`}>
        {/* 半圆角度弧 */}
        <path
          d="M-40,0 A40,40 0 0 1 40,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.9}
          opacity={0.3}
        />
        {/* 内弧 */}
        <path
          d="M-28,0 A28,28 0 0 1 28,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.4}
          opacity={0.2}
        />
        {/* 角度标记线 */}
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x1 = Math.cos(rad) * 35
          const y1 = -Math.sin(rad) * 35
          const x2 = Math.cos(rad) * 40
          const y2 = -Math.sin(rad) * 40
          const isMajor = deg % 30 === 0
          return (
            <line
              key={`angle-${deg}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={accent}
              strokeWidth={isMajor ? 0.7 : 0.4}
              opacity={isMajor ? 0.45 : 0.25}
            />
          )
        })}
        {/* 法线 */}
        <line x1={0} y1={0} x2={0} y2={-40} stroke={accent} strokeWidth={0.6} opacity={0.35} strokeDasharray="3,3" />
        {/* 中心点 */}
        <circle cx={0} cy={0} r={2} fill={accent} opacity={0.3} />
      </g>

      {/* ── 次要细节 1: 弯曲透镜轮廓 -- 左上 ── */}
      <g transform={`translate(${worldToScreen(3, 2).x}, ${worldToScreen(3, 2).y})`}>
        {/* 凸透镜 */}
        <path
          d="M-3,-24 Q10,-12 -3,0 Q-16,-12 -3,-24Z"
          fill={accent}
          fillOpacity={0.04}
          stroke={accent}
          strokeWidth={1}
          opacity={0.45}
        />
        {/* 焦点标记 */}
        <circle cx={15} cy={-12} r={1.5} fill={accent} opacity={0.25} />
        {/* 光轴线 */}
        <line x1={-30} y1={-12} x2={30} y2={-12} stroke={accent} strokeWidth={0.4} opacity={0.2} strokeDasharray="3,3" />
        {/* 焦距标记 */}
        <line x1={15} y1={-8} x2={15} y2={-16} stroke={accent} strokeWidth={0.4} opacity={0.2} />
      </g>

      {/* ── 次要细节 2: 凹透镜 -- 左下 ── */}
      <g transform={`translate(${worldToScreen(3, gridHeight - 2).x}, ${worldToScreen(3, gridHeight - 2).y})`}>
        <path
          d="M-3,-18 Q-10,-9 -3,0 Q4,-9 -3,-18Z"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.35}
        />
        <line x1={-25} y1={-9} x2={25} y2={-9} stroke={accent} strokeWidth={0.3} opacity={0.15} strokeDasharray="4,4" />
      </g>

      {/* ── 次要细节 3: 玻璃面片 (不同角度) ── */}
      {[
        { x: 6, y: 3, angle: 20 },
        { x: gridWidth - 5, y: gridHeight / 2, angle: -15 },
        { x: gridWidth / 2 - 3, y: 3, angle: 35 },
        { x: 5, y: gridHeight - 4, angle: -25 },
      ].map((slab, i) => {
        const s = worldToScreen(slab.x, slab.y)
        return (
          <g key={`slab-${i}`} transform={`translate(${s.x}, ${s.y}) rotate(${slab.angle})`}>
            <rect x={-20} y={-2} width={40} height={4} rx={1} fill={accent} opacity={0.1} />
            <line x1={-20} y1={0} x2={20} y2={0} stroke={accent} strokeWidth={0.6} opacity={0.25} />
          </g>
        )
      })}

      {/* ── 次要细节 4: 小棱镜三角形 ── */}
      {[
        { x: gridWidth - 4, y: 2, scale: 1 },
        { x: 2, y: gridHeight / 2 + 1, scale: 0.8 },
        { x: gridWidth / 2 + 3, y: gridHeight - 2, scale: 0.7 },
        { x: gridWidth - 2, y: gridHeight - 4, scale: 0.6 },
      ].map((prism, i) => {
        const s = worldToScreen(prism.x, prism.y)
        return (
          <g key={`prism-${i}`} transform={`translate(${s.x}, ${s.y}) scale(${prism.scale})`}>
            <polygon
              points="0,-20 18,12 -18,12"
              fill={accent}
              fillOpacity={0.05}
              stroke={accent}
              strokeWidth={0.8}
              opacity={0.35}
            />
          </g>
        )
      })}

      {/* ── 动画棱镜: 光谱色散微光 -- 右上角 ── */}
      <g
        transform={`translate(${worldToScreen(gridWidth - 3, 3).x}, ${worldToScreen(gridWidth - 3, 3).y})`}
        style={{ animation: 'spectrum-shimmer 8s ease-in-out infinite' }}
      >
        <polygon
          points="0,-22 18,12 -18,12"
          fill={accent}
          fillOpacity={0.06}
          stroke={accent}
          strokeWidth={1.1}
          opacity={0.4}
        />
        {/* 色散光谱线 */}
        <line x1={10} y1={2} x2={35} y2={-10} stroke="#6070C0" strokeWidth={0.6} opacity={0.3} />
        <line x1={10} y1={4} x2={35} y2={0} stroke="#4090D0" strokeWidth={0.6} opacity={0.3} />
        <line x1={10} y1={6} x2={35} y2={10} stroke="#50B0E0" strokeWidth={0.6} opacity={0.3} />
      </g>

      {/* ── 校准标尺 -- 底部边缘 ── */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 1).x}, ${worldToScreen(2, gridHeight - 1).y})`}>
        <rect x={0} y={-3} width={100} height={6} rx={1} fill={accent} opacity={0.12} />
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={`ruler-${i}`}
            x1={i * 10}
            y1={-3}
            x2={i * 10}
            y2={i % 5 === 0 ? -10 : i % 2 === 0 ? -7 : -5}
            stroke={accent}
            strokeWidth={i % 5 === 0 ? 0.7 : 0.4}
            opacity={0.35}
          />
        ))}
      </g>

      {/* ── 边缘刻度 -- 上边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 0).x}, ${worldToScreen(gridWidth / 2, 0).y - 12})`}>
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`edge-tick-${i}`}
            x1={-70 + i * 10}
            y1={0}
            x2={-70 + i * 10}
            y2={i % 3 === 0 ? -6 : -3}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.2}
          />
        ))}
      </g>

      {/* ── 边缘刻度 -- 右边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth, gridHeight / 2).x + 10}, ${worldToScreen(gridWidth, gridHeight / 2).y})`}>
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`right-tick-${i}`}
            x1={0}
            y1={-40 + i * 10}
            x2={i % 3 === 0 ? 6 : 3}
            y2={-40 + i * 10}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.18}
          />
        ))}
      </g>

      {/* ── Snell 定律示意 -- 中部偏右 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 4, gridHeight / 2 + 1).x}, ${worldToScreen(gridWidth - 4, gridHeight / 2 + 1).y})`}>
        {/* 界面线 */}
        <line x1={-25} y1={0} x2={25} y2={0} stroke={accent} strokeWidth={0.8} opacity={0.3} />
        {/* 法线 */}
        <line x1={0} y1={-20} x2={0} y2={20} stroke={accent} strokeWidth={0.4} opacity={0.2} strokeDasharray="2,2" />
        {/* 入射光 */}
        <line x1={-18} y1={-20} x2={0} y2={0} stroke={accent} strokeWidth={0.6} opacity={0.3} />
        {/* 折射光 */}
        <line x1={0} y1={0} x2={12} y2={20} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        {/* 角度弧 */}
        <path d="M0,-10 A10,10 0 0 0 -6,-8" fill="none" stroke={accent} strokeWidth={0.5} opacity={0.25} />
        <path d="M0,10 A10,10 0 0 1 4,9" fill="none" stroke={accent} strokeWidth={0.5} opacity={0.2} />
      </g>

      {/* ── 附加装饰点 ── */}
      {[
        { x: 1, y: 4, r: 1.5 },
        { x: gridWidth - 1, y: gridHeight / 2 - 2, r: 1.2 },
        { x: gridWidth / 2, y: 1, r: 1.8 },
        { x: gridWidth - 2, y: gridHeight - 1, r: 1.3 },
        { x: 4, y: gridHeight - 1, r: 1.0 },
      ].map((dot, i) => {
        const s = worldToScreen(dot.x, dot.y)
        return (
          <circle
            key={`dot-${i}`}
            cx={s.x}
            cy={s.y}
            r={dot.r}
            fill={accent}
            opacity={0.12}
          />
        )
      })}
    </g>
  )
}
