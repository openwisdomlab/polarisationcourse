/**
 * CrystalLabDecorations.tsx -- Crystal Lab 区域装饰
 *
 * 冰蓝色水晶实验室的非交互视觉元素:
 * - 六角形水晶结构图案
 * - 冰霜边缘装饰
 * - 玻璃标本柜轮廓
 * - 晶格排列线条
 */

import type { RegionTheme } from './regionRegistry'
import { worldToScreen } from '@/lib/isometric'

interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

export default function CrystalLabDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="crystal-lab-decorations" opacity={0.35}>
      {/* 六角形水晶结构 -- 左上角区域 */}
      <g transform={`translate(${worldToScreen(1, 1).x}, ${worldToScreen(1, 1).y})`}>
        {/* 大六角形晶体 */}
        <polygon
          points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
          fill="none"
          stroke={accent}
          strokeWidth={1.2}
          opacity={0.6}
        />
        {/* 内部晶格线 */}
        <line x1={0} y1={-20} x2={0} y2={20} stroke={accent} strokeWidth={0.5} opacity={0.3} />
        <line x1={-17} y1={-10} x2={17} y2={10} stroke={accent} strokeWidth={0.5} opacity={0.3} />
        <line x1={-17} y1={10} x2={17} y2={-10} stroke={accent} strokeWidth={0.5} opacity={0.3} />
      </g>

      {/* 小六角形阵列 -- 右下角 */}
      {[
        { x: gridWidth - 3, y: gridHeight - 2 },
        { x: gridWidth - 2, y: gridHeight - 3 },
        { x: gridWidth - 2, y: gridHeight - 2 },
      ].map((pos, i) => {
        const s = worldToScreen(pos.x, pos.y)
        return (
          <polygon
            key={`hex-${i}`}
            transform={`translate(${s.x}, ${s.y})`}
            points="0,-10 8.7,-5 8.7,5 0,10 -8.7,5 -8.7,-5"
            fill={accent}
            opacity={0.12}
          />
        )
      })}

      {/* 冰霜边缘装饰 -- 上边界 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 0).x}, ${worldToScreen(gridWidth / 2, 0).y - 15})`}>
        <path
          d="M-60,0 L-40,-8 L-20,0 L0,-6 L20,0 L40,-8 L60,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.4}
        />
      </g>

      {/* 玻璃标本柜 -- 中部偏左 */}
      <g transform={`translate(${worldToScreen(2, 6).x}, ${worldToScreen(2, 6).y})`}>
        {/* 柜体外框 */}
        <rect x={-20} y={-30} width={40} height={35} rx={3} fill="none" stroke={accent} strokeWidth={1} opacity={0.5} />
        {/* 柜内隔板 */}
        <line x1={-16} y1={-15} x2={16} y2={-15} stroke={accent} strokeWidth={0.5} opacity={0.3} />
        <line x1={-16} y1={0} x2={16} y2={0} stroke={accent} strokeWidth={0.5} opacity={0.3} />
        {/* 标本小圆点 (晶体样品) */}
        <circle cx={-8} cy={-22} r={3} fill={accent} opacity={0.25} />
        <circle cx={8} cy={-22} r={2.5} fill={accent} opacity={0.2} />
        <circle cx={0} cy={-8} r={3.5} fill={accent} opacity={0.2} />
      </g>

      {/* 晶格线网 -- 右上角区域 */}
      <g transform={`translate(${worldToScreen(gridWidth - 2, 2).x}, ${worldToScreen(gridWidth - 2, 2).y})`}>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`grid-v-${i}`}
            x1={i * 12 - 18}
            y1={-20}
            x2={i * 12 - 18}
            y2={20}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.2}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`grid-h-${i}`}
            x1={-18}
            y1={i * 10 - 15}
            x2={18}
            y2={i * 10 - 15}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.2}
          />
        ))}
      </g>

      {/* 大型冰晶装饰 -- 底部中央 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight - 2).x}, ${worldToScreen(gridWidth / 2, gridHeight - 2).y})`}>
        {/* 尖晶体 */}
        <polygon points="0,-25 8,-8 -8,-8" fill={accent} opacity={0.15} />
        <polygon points="15,-18 20,-5 10,-5" fill={accent} opacity={0.1} />
        <polygon points="-12,-15 -7,-5 -17,-5" fill={accent} opacity={0.12} />
      </g>
    </g>
  )
}
