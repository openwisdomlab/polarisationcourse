/**
 * WavePlatformDecorations.tsx -- Wave Platform 区域装饰
 *
 * 青色波动平台的非交互视觉元素:
 * - 波动干涉图案 (重叠同心圆)
 * - 相位标记点
 * - 谐波网格线
 * - 驻波节点指示
 */

import type { RegionTheme } from './regionRegistry'
import { worldToScreen } from '@/lib/isometric'

interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

export default function WavePlatformDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="wave-platform-decorations" opacity={0.35}>
      {/* 干涉图案 -- 两个重叠同心圆系统 */}
      {/* 波源 A */}
      <g transform={`translate(${worldToScreen(4, gridHeight / 2).x}, ${worldToScreen(4, gridHeight / 2).y})`}>
        {[20, 40, 60, 80].map((r) => (
          <circle
            key={`wave-a-${r}`}
            cx={0} cy={0} r={r}
            fill="none"
            stroke={accent}
            strokeWidth={0.5}
            opacity={0.15}
          />
        ))}
        {/* 波源标记 */}
        <circle cx={0} cy={0} r={3} fill={accent} opacity={0.3} />
      </g>

      {/* 波源 B */}
      <g transform={`translate(${worldToScreen(gridWidth - 5, gridHeight / 2).x}, ${worldToScreen(gridWidth - 5, gridHeight / 2).y})`}>
        {[20, 40, 60, 80].map((r) => (
          <circle
            key={`wave-b-${r}`}
            cx={0} cy={0} r={r}
            fill="none"
            stroke={accent}
            strokeWidth={0.5}
            opacity={0.15}
          />
        ))}
        <circle cx={0} cy={0} r={3} fill={accent} opacity={0.3} />
      </g>

      {/* 相位标记点 -- 沿中轴线 */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = 3 + i * ((gridWidth - 6) / 6)
        const s = worldToScreen(x, gridHeight / 2)
        return (
          <g key={`phase-${i}`} transform={`translate(${s.x}, ${s.y})`}>
            <circle cx={0} cy={-20} r={2} fill={accent} opacity={i % 2 === 0 ? 0.4 : 0.15} />
            <line x1={0} y1={-18} x2={0} y2={-12} stroke={accent} strokeWidth={0.4} opacity={0.2} />
          </g>
        )
      })}

      {/* 谐波网格线 -- 正弦波形 */}
      <g transform={`translate(${worldToScreen(2, 2).x}, ${worldToScreen(2, 2).y})`}>
        <path
          d="M0,0 Q15,-12 30,0 Q45,12 60,0 Q75,-12 90,0 Q105,12 120,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.25}
        />
      </g>

      <g transform={`translate(${worldToScreen(2, gridHeight - 3).x}, ${worldToScreen(2, gridHeight - 3).y})`}>
        <path
          d="M0,0 Q20,-10 40,0 Q60,10 80,0 Q100,-10 120,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.6}
          opacity={0.2}
        />
      </g>

      {/* 驻波节点标记 -- 底部 */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight - 1).x}, ${worldToScreen(gridWidth / 2, gridHeight - 1).y})`}>
        {[-30, -10, 10, 30].map((offset, i) => (
          <g key={`node-${i}`}>
            {/* 节点 (不动点) */}
            <circle cx={offset} cy={0} r={2.5} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.35} />
            {/* 腹点 (最大振幅) 用小三角指示 */}
            {i < 3 && (
              <polygon
                points={`${offset + 10},-4 ${offset + 10},4 ${offset + 7},0`}
                fill={accent}
                opacity={0.15}
              />
            )}
          </g>
        ))}
      </g>

      {/* Jones 向量方向标记 -- 右上角 */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, 2).x}, ${worldToScreen(gridWidth - 3, 2).y})`}>
        {/* 坐标轴 */}
        <line x1={0} y1={0} x2={20} y2={0} stroke={accent} strokeWidth={0.6} opacity={0.3} />
        <line x1={0} y1={0} x2={0} y2={-20} stroke={accent} strokeWidth={0.6} opacity={0.3} />
        {/* 偏振椭圆示意 */}
        <ellipse cx={10} cy={-10} rx={8} ry={5} fill="none" stroke={accent} strokeWidth={0.5} opacity={0.25} transform="rotate(-30, 10, -10)" />
      </g>
    </g>
  )
}
