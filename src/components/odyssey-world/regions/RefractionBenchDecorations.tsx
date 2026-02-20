/**
 * RefractionBenchDecorations.tsx -- Refraction Bench 区域装饰
 *
 * 暖橙色折射工作台的非交互视觉元素:
 * - 工作台面轮廓
 * - 校准标尺刻度线
 * - 弯曲透镜轮廓
 * - 折射角度图谱蚀刻在地面
 */

import type { RegionTheme } from './regionRegistry'
import { worldToScreen } from '@/lib/isometric'

interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

export default function RefractionBenchDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="refraction-bench-decorations" opacity={0.35}>
      {/* 工作台面 -- 中央横向长条 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2).y})`}>
        <rect x={-80} y={-5} width={160} height={10} rx={2} fill={accent} opacity={0.2} />
        {/* 台面上的校准刻度线 */}
        {Array.from({ length: 17 }, (_, i) => (
          <line
            key={`tick-${i}`}
            x1={-80 + i * 10}
            y1={-5}
            x2={-80 + i * 10}
            y2={i % 5 === 0 ? -12 : -8}
            stroke={accent}
            strokeWidth={0.6}
            opacity={0.4}
          />
        ))}
      </g>

      {/* 弯曲透镜轮廓 -- 左上 */}
      <g transform={`translate(${worldToScreen(3, 2).x}, ${worldToScreen(3, 2).y})`}>
        {/* 凸透镜 */}
        <path
          d="M-3,-20 Q8,-10 -3,0 Q-14,-10 -3,-20Z"
          fill="none"
          stroke={accent}
          strokeWidth={1}
          opacity={0.5}
        />
        {/* 光轴线 */}
        <line x1={-25} y1={-10} x2={20} y2={-10} stroke={accent} strokeWidth={0.4} opacity={0.3} strokeDasharray="3,3" />
      </g>

      {/* 折射角度图谱 -- 地面蚀刻 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2 + 2, gridHeight - 3).x}, ${worldToScreen(gridWidth / 2 + 2, gridHeight - 3).y})`}>
        {/* 半圆角度刻度 */}
        <path
          d="M-30,0 A30,30 0 0 1 30,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.3}
        />
        {/* 角度标记线 */}
        {[30, 45, 60, 90, 120, 135, 150].map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x1 = Math.cos(rad) * 25
          const y1 = -Math.sin(rad) * 25
          const x2 = Math.cos(rad) * 30
          const y2 = -Math.sin(rad) * 30
          return (
            <line
              key={`angle-${deg}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={accent}
              strokeWidth={0.5}
              opacity={0.4}
            />
          )
        })}
        {/* 法线 */}
        <line x1={0} y1={0} x2={0} y2={-30} stroke={accent} strokeWidth={0.6} opacity={0.4} strokeDasharray="2,2" />
      </g>

      {/* 校准标尺 -- 底部边缘 */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 1).x}, ${worldToScreen(2, gridHeight - 1).y})`}>
        <rect x={0} y={-3} width={80} height={6} rx={1} fill={accent} opacity={0.15} />
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`ruler-${i}`}
            x1={i * 10}
            y1={-3}
            x2={i * 10}
            y2={i % 2 === 0 ? -8 : -5}
            stroke={accent}
            strokeWidth={0.5}
            opacity={0.35}
          />
        ))}
      </g>

      {/* 棱镜轮廓 -- 右上区域 */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, 3).x}, ${worldToScreen(gridWidth - 3, 3).y})`}>
        <polygon
          points="0,-18 15,9 -15,9"
          fill="none"
          stroke={accent}
          strokeWidth={1}
          opacity={0.4}
        />
        {/* 色散光谱线 */}
        <line x1={8} y1={0} x2={30} y2={-8} stroke="#E54040" strokeWidth={0.5} opacity={0.3} />
        <line x1={8} y1={2} x2={30} y2={0} stroke="#40E540" strokeWidth={0.5} opacity={0.3} />
        <line x1={8} y1={4} x2={30} y2={8} stroke="#4040E5" strokeWidth={0.5} opacity={0.3} />
      </g>
    </g>
  )
}
