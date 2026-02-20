/**
 * InterfaceLabDecorations.tsx -- Interface Lab 区域装饰
 *
 * 绿金色界面实验室的非交互视觉元素:
 * - 界面分界线 (材料层叠)
 * - 菲涅尔曲线轮廓
 * - 堆叠材料层板
 * - 布儒斯特角指示
 */

import type { RegionTheme } from './regionRegistry'
import { worldToScreen } from '@/lib/isometric'

interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

export default function InterfaceLabDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="interface-lab-decorations" opacity={0.35}>
      {/* 界面分界线 -- 贯穿中央的水平线组 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2).y})`}>
        {/* 主界面线 */}
        <line x1={-100} y1={0} x2={100} y2={0} stroke={accent} strokeWidth={1.2} opacity={0.3} />
        {/* 上方介质标记 (n1) */}
        <rect x={-90} y={-12} width={180} height={12} fill={accent} opacity={0.06} />
        {/* 下方介质标记 (n2) */}
        <rect x={-90} y={0} width={180} height={12} fill={accent} opacity={0.12} />
        {/* 法线虚线 */}
        <line x1={0} y1={-20} x2={0} y2={20} stroke={accent} strokeWidth={0.5} opacity={0.25} strokeDasharray="3,3" />
      </g>

      {/* 菲涅尔曲线 -- 左上角 */}
      <g transform={`translate(${worldToScreen(2, 2).x}, ${worldToScreen(2, 2).y})`}>
        {/* Rs 曲线 (s-偏振反射率) */}
        <path
          d="M0,0 Q10,-2 20,-5 Q30,-10 40,-20 Q45,-30 50,-35"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.4}
        />
        {/* Rp 曲线 (p-偏振反射率，有布儒斯特角凹陷) */}
        <path
          d="M0,0 Q10,-1 20,2 Q25,3 30,0 Q35,-8 40,-20 Q45,-30 50,-35"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.3}
          strokeDasharray="4,2"
        />
        {/* 坐标轴 */}
        <line x1={0} y1={5} x2={55} y2={5} stroke={accent} strokeWidth={0.4} opacity={0.2} />
        <line x1={0} y1={5} x2={0} y2={-40} stroke={accent} strokeWidth={0.4} opacity={0.2} />
      </g>

      {/* 堆叠材料层板 -- 右下区域 */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, gridHeight - 3).x}, ${worldToScreen(gridWidth - 3, gridHeight - 3).y})`}>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={`slab-${i}`}
            x={-25}
            y={-20 + i * 8}
            width={50}
            height={6}
            rx={1}
            fill={accent}
            opacity={0.08 + i * 0.04}
          />
        ))}
        {/* 入射光线 */}
        <line x1={-35} y1={-30} x2={-10} y2={-20} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        {/* 折射光线 */}
        <line x1={-10} y1={-20} x2={5} y2={-12} stroke={accent} strokeWidth={0.6} opacity={0.2} />
        <line x1={5} y1={-12} x2={15} y2={-4} stroke={accent} strokeWidth={0.6} opacity={0.15} />
      </g>

      {/* 布儒斯特角指示 -- 中部偏右 */}
      <g transform={`translate(${worldToScreen(gridWidth - 4, gridHeight / 2 - 1).x}, ${worldToScreen(gridWidth - 4, gridHeight / 2 - 1).y})`}>
        {/* 界面线 */}
        <line x1={-20} y1={0} x2={20} y2={0} stroke={accent} strokeWidth={0.8} opacity={0.3} />
        {/* 入射光 */}
        <line x1={-15} y1={-18} x2={0} y2={0} stroke={accent} strokeWidth={0.6} opacity={0.35} />
        {/* 反射光 (与界面垂直 = 布儒斯特角) */}
        <line x1={0} y1={0} x2={15} y2={-18} stroke={accent} strokeWidth={0.6} opacity={0.35} />
        {/* 折射光 */}
        <line x1={0} y1={0} x2={10} y2={15} stroke={accent} strokeWidth={0.5} opacity={0.2} strokeDasharray="2,2" />
        {/* 角度弧 */}
        <path d="M0,-8 A8,8 0 0 0 -5,-6" fill="none" stroke={accent} strokeWidth={0.4} opacity={0.3} />
      </g>

      {/* 全反射棱镜 -- 左下角 */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 2).x}, ${worldToScreen(2, gridHeight - 2).y})`}>
        <polygon
          points="0,-15 20,10 -20,10"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.3}
        />
        {/* 全反射光线 */}
        <line x1={-10} y1={-3} x2={0} y2={5} stroke={accent} strokeWidth={0.5} opacity={0.2} />
        <line x1={0} y1={5} x2={10} y2={-3} stroke={accent} strokeWidth={0.5} opacity={0.2} />
      </g>
    </g>
  )
}
