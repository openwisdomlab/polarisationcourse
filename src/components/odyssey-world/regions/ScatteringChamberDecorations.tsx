/**
 * ScatteringChamberDecorations.tsx -- Scattering Chamber 区域装饰
 *
 * 深紫色散射暗室的非交互视觉元素:
 * - 大气雾霭渐变圆 (模拟散射介质)
 * - 粒子轨迹虚线
 * - 望远镜剪影轮廓
 * - 天穹指示弧
 */

import type { RegionTheme } from './regionRegistry'
import { worldToScreen } from '@/lib/isometric'

interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

export default function ScatteringChamberDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="scattering-chamber-decorations" opacity={0.35}>
      {/* 大气雾霭 -- 中央区域渐变圆 */}
      <defs>
        <radialGradient id="scatter-haze">
          <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
          <stop offset="70%" stopColor={accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx={worldToScreen(gridWidth / 2, gridHeight / 2).x}
        cy={worldToScreen(gridWidth / 2, gridHeight / 2).y}
        r={120}
        fill="url(#scatter-haze)"
      />

      {/* 小型雾霭圈 -- 散布在区域周围 */}
      {[
        { x: 2, y: 3, r: 40 },
        { x: gridWidth - 3, y: 4, r: 35 },
        { x: 4, y: gridHeight - 3, r: 45 },
      ].map((haze, i) => {
        const s = worldToScreen(haze.x, haze.y)
        return (
          <circle
            key={`haze-${i}`}
            cx={s.x}
            cy={s.y}
            r={haze.r}
            fill={accent}
            opacity={0.06}
          />
        )
      })}

      {/* 粒子轨迹 -- 对角虚线 */}
      {[
        { x1: 2, y1: 2, x2: 5, y2: 5 },
        { x1: gridWidth - 4, y1: 3, x2: gridWidth - 2, y2: 6 },
        { x1: 3, y1: gridHeight - 5, x2: 6, y2: gridHeight - 2 },
      ].map((trace, i) => {
        const s1 = worldToScreen(trace.x1, trace.y1)
        const s2 = worldToScreen(trace.x2, trace.y2)
        return (
          <line
            key={`trace-${i}`}
            x1={s1.x} y1={s1.y}
            x2={s2.x} y2={s2.y}
            stroke={accent}
            strokeWidth={0.6}
            strokeDasharray="4,6"
            opacity={0.3}
          />
        )
      })}

      {/* 望远镜剪影 -- 右上角 */}
      <g transform={`translate(${worldToScreen(gridWidth - 2, 1).x}, ${worldToScreen(gridWidth - 2, 1).y})`}>
        {/* 镜筒 */}
        <rect x={-4} y={-25} width={8} height={30} rx={2} fill={accent} opacity={0.2} />
        {/* 物镜 */}
        <ellipse cx={0} cy={-25} rx={8} ry={3} fill={accent} opacity={0.15} />
        {/* 三脚架 */}
        <line x1={0} y1={5} x2={-12} y2={18} stroke={accent} strokeWidth={1} opacity={0.2} />
        <line x1={0} y1={5} x2={12} y2={18} stroke={accent} strokeWidth={1} opacity={0.2} />
        <line x1={0} y1={5} x2={0} y2={20} stroke={accent} strokeWidth={1} opacity={0.2} />
      </g>

      {/* 天穹指示弧 -- 顶部 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 1).x}, ${worldToScreen(gridWidth / 2, 1).y})`}>
        <path
          d="M-50,0 A60,25 0 0 1 50,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.25}
        />
        {/* 天顶标记 */}
        <circle cx={0} cy={-25} r={3} fill={accent} opacity={0.2} />
        <line x1={0} y1={-22} x2={0} y2={0} stroke={accent} strokeWidth={0.4} opacity={0.2} strokeDasharray="2,3" />
      </g>

      {/* 散射角度标记 -- 底部中央 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight - 2).x}, ${worldToScreen(gridWidth / 2, gridHeight - 2).y})`}>
        {/* 散射锥形 */}
        <path
          d="M0,0 L-20,-15 M0,0 L20,-15 M0,0 L-10,-18 M0,0 L10,-18 M0,0 L0,-20"
          fill="none"
          stroke={accent}
          strokeWidth={0.5}
          opacity={0.25}
        />
        {/* 入射方向箭头 */}
        <line x1={0} y1={15} x2={0} y2={3} stroke={accent} strokeWidth={0.8} opacity={0.3} />
      </g>
    </g>
  )
}
