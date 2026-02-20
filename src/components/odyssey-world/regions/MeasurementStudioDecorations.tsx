/**
 * MeasurementStudioDecorations.tsx -- Measurement Studio 区域装饰
 *
 * 银灰色测量工作室的非交互视觉元素:
 * - 探测器轮廓
 * - 测量刻度尺
 * - Stokes 参数读数占位框
 * - 校准图表网格
 */

import type { RegionTheme } from './regionRegistry'
import { worldToScreen } from '@/lib/isometric'

interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

export default function MeasurementStudioDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="measurement-studio-decorations" opacity={0.35}>
      {/* 探测器轮廓 -- 左上角 */}
      <g transform={`translate(${worldToScreen(2, 2).x}, ${worldToScreen(2, 2).y})`}>
        {/* 探测器主体 */}
        <rect x={-12} y={-20} width={24} height={30} rx={3} fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />
        {/* 入光窗口 */}
        <rect x={-8} y={-20} width={16} height={5} rx={1} fill={accent} opacity={0.15} />
        {/* 信号输出线 */}
        <line x1={0} y1={10} x2={0} y2={20} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        <circle cx={0} cy={22} r={2} fill={accent} opacity={0.2} />
      </g>

      {/* 测量刻度尺 -- 中央横向 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2 - 2).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2 - 2).y})`}>
        <rect x={-70} y={-3} width={140} height={6} rx={1} fill={accent} opacity={0.1} />
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`scale-${i}`}
            x1={-70 + i * 10}
            y1={-3}
            x2={-70 + i * 10}
            y2={i % 5 === 0 ? -10 : -6}
            stroke={accent}
            strokeWidth={i % 5 === 0 ? 0.7 : 0.4}
            opacity={0.35}
          />
        ))}
      </g>

      {/* Stokes 参数读数占位框 -- 右上角 */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, 2).x}, ${worldToScreen(gridWidth - 3, 2).y})`}>
        <rect x={-30} y={-30} width={60} height={50} rx={3} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.3} />
        {/* S0 行 */}
        <line x1={-25} y1={-18} x2={25} y2={-18} stroke={accent} strokeWidth={0.3} opacity={0.2} />
        <rect x={-25} y={-28} width={20} height={8} rx={1} fill={accent} opacity={0.08} />
        {/* S1 行 */}
        <line x1={-25} y1={-6} x2={25} y2={-6} stroke={accent} strokeWidth={0.3} opacity={0.2} />
        <rect x={-25} y={-16} width={18} height={8} rx={1} fill={accent} opacity={0.06} />
        {/* S2 行 */}
        <line x1={-25} y1={6} x2={25} y2={6} stroke={accent} strokeWidth={0.3} opacity={0.2} />
        <rect x={-25} y={-4} width={15} height={8} rx={1} fill={accent} opacity={0.05} />
        {/* S3 行 */}
        <rect x={-25} y={8} width={12} height={8} rx={1} fill={accent} opacity={0.04} />
      </g>

      {/* 校准图表网格 -- 底部左侧 */}
      <g transform={`translate(${worldToScreen(3, gridHeight - 3).x}, ${worldToScreen(3, gridHeight - 3).y})`}>
        {/* 网格线 */}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={`cal-v-${i}`}
            x1={i * 12}
            y1={-30}
            x2={i * 12}
            y2={0}
            stroke={accent}
            strokeWidth={0.3}
            opacity={0.2}
          />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line
            key={`cal-h-${i}`}
            x1={0}
            y1={i * -10}
            x2={48}
            y2={i * -10}
            stroke={accent}
            strokeWidth={0.3}
            opacity={0.2}
          />
        ))}
        {/* 校准曲线 */}
        <path
          d="M0,0 Q12,-10 24,-15 Q36,-22 48,-28"
          fill="none"
          stroke={accent}
          strokeWidth={0.7}
          opacity={0.3}
        />
        {/* 数据点 */}
        {[0, 12, 24, 36, 48].map((x, i) => (
          <circle
            key={`cal-pt-${i}`}
            cx={x}
            cy={-i * 7}
            r={1.5}
            fill={accent}
            opacity={0.35}
          />
        ))}
      </g>

      {/* 偏振计示意 -- 中部偏右 */}
      <g transform={`translate(${worldToScreen(gridWidth - 4, gridHeight / 2).x}, ${worldToScreen(gridWidth - 4, gridHeight / 2).y})`}>
        {/* 旋转圆盘 */}
        <circle cx={0} cy={0} r={15} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.3} />
        {/* 刻度标记 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180
          return (
            <line
              key={`pol-${deg}`}
              x1={Math.cos(rad) * 12}
              y1={Math.sin(rad) * 12}
              x2={Math.cos(rad) * 15}
              y2={Math.sin(rad) * 15}
              stroke={accent}
              strokeWidth={0.5}
              opacity={0.3}
            />
          )
        })}
        {/* 指针 */}
        <line x1={0} y1={0} x2={10} y2={-7} stroke={accent} strokeWidth={0.6} opacity={0.35} />
        <circle cx={0} cy={0} r={2} fill={accent} opacity={0.2} />
      </g>

      {/* 光电倍增管 -- 左下 */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 2).x}, ${worldToScreen(2, gridHeight - 2).y})`}>
        <rect x={-8} y={-18} width={16} height={25} rx={2} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.3} />
        <circle cx={0} cy={-12} r={4} fill={accent} opacity={0.1} />
        <line x1={-5} y1={5} x2={5} y2={5} stroke={accent} strokeWidth={0.5} opacity={0.2} />
        <line x1={0} y1={7} x2={0} y2={12} stroke={accent} strokeWidth={0.4} opacity={0.15} />
      </g>
    </g>
  )
}
