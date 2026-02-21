/**
 * MeasurementStudioDecorations.tsx -- Measurement Studio 区域装饰
 *
 * 钢灰蓝测量工作室的非交互视觉元素 (Monument Valley 品质):
 * - 精密测量网格 (精确交叉线)
 * - 探测器阵列图案 (矩形行)
 * - 庞加莱球线框 (圆 + 经纬弧)
 * - 角度刻度弧线
 * - 测量表盘指示器
 * - 工程网格底纹 (0.03 opacity)
 * - 刻度标记边缘
 * - 缓慢表盘旋转 (CSS rotate, 20s linear)
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
const MEASUREMENT_ANIMATIONS = `
  @keyframes dial-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export default function MeasurementStudioDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="measurement-studio-decorations" opacity={0.65}>
      {/* CSS 动画定义 */}
      <style>{MEASUREMENT_ANIMATIONS}</style>

      {/* ── 底层纹理: 工程精密网格 ── */}
      <defs>
        <pattern id="measurement-eng-grid" x={0} y={0} width={24} height={24} patternUnits="userSpaceOnUse">
          <rect x={0} y={0} width={24} height={24} fill="none" stroke={accent} strokeWidth={0.2} opacity={0.35} />
          <line x1={12} y1={0} x2={12} y2={24} stroke={accent} strokeWidth={0.1} opacity={0.2} />
          <line x1={0} y1={12} x2={24} y2={12} stroke={accent} strokeWidth={0.1} opacity={0.2} />
        </pattern>
      </defs>
      <rect
        x={worldToScreen(0, 0).x - 80}
        y={worldToScreen(0, 0).y - 60}
        width={900}
        height={600}
        fill="url(#measurement-eng-grid)"
        opacity={0.03}
      />

      {/* ── 主要图案 1: 精密测量十字线 + 网格 -- 中部偏左 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2 - 2, gridHeight / 2).x}, ${worldToScreen(gridWidth / 2 - 2, gridHeight / 2).y})`}>
        {/* 外框 */}
        <rect x={-50} y={-35} width={100} height={70} rx={2} fill="none" stroke={accent} strokeWidth={0.6} opacity={0.25} />
        {/* 十字准线 */}
        <line x1={-50} y1={0} x2={50} y2={0} stroke={accent} strokeWidth={0.4} opacity={0.2} />
        <line x1={0} y1={-35} x2={0} y2={35} stroke={accent} strokeWidth={0.4} opacity={0.2} />
        {/* 精细网格 */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`fine-v-${i}`}
            x1={-40 + i * 10}
            y1={-30}
            x2={-40 + i * 10}
            y2={30}
            stroke={accent}
            strokeWidth={0.2}
            opacity={0.12}
          />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={`fine-h-${i}`}
            x1={-45}
            y1={-30 + i * 10}
            x2={45}
            y2={-30 + i * 10}
            stroke={accent}
            strokeWidth={0.2}
            opacity={0.12}
          />
        ))}
        {/* 中心靶标 */}
        <circle cx={0} cy={0} r={6} fill="none" stroke={accent} strokeWidth={0.5} opacity={0.2} />
        <circle cx={0} cy={0} r={2} fill={accent} opacity={0.15} />
      </g>

      {/* ── 主要图案 2: 探测器阵列 -- 上部横排 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 2).x}, ${worldToScreen(gridWidth / 2, 2).y})`}>
        {/* 探测器主体行 */}
        {Array.from({ length: 8 }, (_, i) => (
          <g key={`detector-${i}`}>
            <rect
              x={-56 + i * 16}
              y={-12}
              width={12}
              height={18}
              rx={2}
              fill={accent}
              opacity={0.08 + (i % 3) * 0.02}
            />
            <rect
              x={-54 + i * 16}
              y={-12}
              width={8}
              height={4}
              rx={1}
              fill={accent}
              opacity={0.12}
            />
            {/* 信号线 */}
            <line
              x1={-50 + i * 16}
              y1={6}
              x2={-50 + i * 16}
              y2={12}
              stroke={accent}
              strokeWidth={0.4}
              opacity={0.15}
            />
          </g>
        ))}
        {/* 连接总线 */}
        <line x1={-56} y1={12} x2={72} y2={12} stroke={accent} strokeWidth={0.5} opacity={0.15} />
      </g>

      {/* ── 主要图案 3: 庞加莱球线框 -- 右上角 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, 3).x}, ${worldToScreen(gridWidth - 3, 3).y})`}>
        {/* 赤道 */}
        <circle cx={0} cy={0} r={22} fill="none" stroke={accent} strokeWidth={0.7} opacity={0.3} />
        {/* 经线 (3 条椭圆) */}
        <ellipse cx={0} cy={0} rx={22} ry={8} fill="none" stroke={accent} strokeWidth={0.4} opacity={0.2} />
        <ellipse cx={0} cy={0} rx={8} ry={22} fill="none" stroke={accent} strokeWidth={0.4} opacity={0.2} />
        <ellipse cx={0} cy={0} rx={16} ry={22} fill="none" stroke={accent} strokeWidth={0.3} opacity={0.15} transform="rotate(30)" />
        {/* 纬线 (2 条) */}
        <ellipse cx={0} cy={-10} rx={18} ry={5} fill="none" stroke={accent} strokeWidth={0.3} opacity={0.15} />
        <ellipse cx={0} cy={10} rx={18} ry={5} fill="none" stroke={accent} strokeWidth={0.3} opacity={0.15} />
        {/* 极点 */}
        <circle cx={0} cy={-22} r={2} fill={accent} opacity={0.2} />
        <circle cx={0} cy={22} r={2} fill={accent} opacity={0.2} />
        {/* 赤道标记点 */}
        <circle cx={22} cy={0} r={1.5} fill={accent} opacity={0.18} />
        <circle cx={-22} cy={0} r={1.5} fill={accent} opacity={0.18} />
      </g>

      {/* ── Stokes 参数读数框 -- 右侧 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 2, gridHeight / 2).x}, ${worldToScreen(gridWidth - 2, gridHeight / 2).y})`}>
        <rect x={-32} y={-35} width={64} height={56} rx={3} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.25} />
        {/* 标题栏 */}
        <rect x={-32} y={-35} width={64} height={10} rx={3} fill={accent} opacity={0.06} />
        {/* S0 */}
        <line x1={-28} y1={-18} x2={28} y2={-18} stroke={accent} strokeWidth={0.3} opacity={0.15} />
        <rect x={-28} y={-24} width={22} height={5} rx={1} fill={accent} opacity={0.08} />
        {/* S1 */}
        <line x1={-28} y1={-8} x2={28} y2={-8} stroke={accent} strokeWidth={0.3} opacity={0.15} />
        <rect x={-28} y={-14} width={18} height={5} rx={1} fill={accent} opacity={0.06} />
        {/* S2 */}
        <line x1={-28} y1={2} x2={28} y2={2} stroke={accent} strokeWidth={0.3} opacity={0.15} />
        <rect x={-28} y={-4} width={14} height={5} rx={1} fill={accent} opacity={0.05} />
        {/* S3 */}
        <rect x={-28} y={6} width={12} height={5} rx={1} fill={accent} opacity={0.04} />
      </g>

      {/* ── 测量刻度尺 -- 中央横向 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2 - 3).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2 - 3).y})`}>
        <rect x={-80} y={-3} width={160} height={6} rx={1} fill={accent} opacity={0.08} />
        {Array.from({ length: 17 }, (_, i) => (
          <line
            key={`scale-${i}`}
            x1={-80 + i * 10}
            y1={-3}
            x2={-80 + i * 10}
            y2={i % 5 === 0 ? -12 : -7}
            stroke={accent}
            strokeWidth={i % 5 === 0 ? 0.7 : 0.4}
            opacity={0.3}
          />
        ))}
      </g>

      {/* ── 角度刻度弧 -- 中部偏左 ── */}
      <g transform={`translate(${worldToScreen(3, gridHeight - 4).x}, ${worldToScreen(3, gridHeight - 4).y})`}>
        <path
          d="M-25,0 A25,25 0 0 1 25,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.7}
          opacity={0.25}
        />
        {[0, 30, 60, 90, 120, 150, 180].map((deg) => {
          const rad = (deg * Math.PI) / 180
          return (
            <line
              key={`arc-${deg}`}
              x1={Math.cos(rad) * 22}
              y1={-Math.sin(rad) * 22}
              x2={Math.cos(rad) * 25}
              y2={-Math.sin(rad) * 25}
              stroke={accent}
              strokeWidth={deg % 90 === 0 ? 0.6 : 0.3}
              opacity={0.25}
            />
          )
        })}
      </g>

      {/* ── 动画表盘旋转指示器 -- 偏振计 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 4, gridHeight / 2 + 3).x}, ${worldToScreen(gridWidth - 4, gridHeight / 2 + 3).y})`}>
        {/* 表盘外圈 */}
        <circle cx={0} cy={0} r={18} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.3} />
        {/* 刻度标记 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180
          const isMajor = deg % 90 === 0
          return (
            <line
              key={`dial-${deg}`}
              x1={Math.cos(rad) * (isMajor ? 13 : 15)}
              y1={Math.sin(rad) * (isMajor ? 13 : 15)}
              x2={Math.cos(rad) * 18}
              y2={Math.sin(rad) * 18}
              stroke={accent}
              strokeWidth={isMajor ? 0.6 : 0.4}
              opacity={0.3}
            />
          )
        })}
        {/* 旋转指针 (CSS 动画) */}
        <g style={{ animation: 'dial-rotate 20s linear infinite', transformOrigin: '0px 0px' }}>
          <line x1={0} y1={0} x2={12} y2={-8} stroke={accent} strokeWidth={0.7} opacity={0.4} />
          <circle cx={12} cy={-8} r={1.2} fill={accent} opacity={0.3} />
        </g>
        {/* 中心轴 */}
        <circle cx={0} cy={0} r={2.5} fill={accent} opacity={0.2} />
      </g>

      {/* ── 校准图表 -- 底部左侧 ── */}
      <g transform={`translate(${worldToScreen(3, gridHeight - 2).x}, ${worldToScreen(3, gridHeight - 2).y})`}>
        {/* 网格线 */}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`cal-v-${i}`}
            x1={i * 12}
            y1={-35}
            x2={i * 12}
            y2={0}
            stroke={accent}
            strokeWidth={0.3}
            opacity={0.18}
          />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={`cal-h-${i}`}
            x1={0}
            y1={i * -9}
            x2={60}
            y2={i * -9}
            stroke={accent}
            strokeWidth={0.3}
            opacity={0.18}
          />
        ))}
        {/* 校准曲线 */}
        <path
          d="M0,0 Q12,-10 24,-18 Q36,-25 48,-30 Q56,-33 60,-35"
          fill="none"
          stroke={accent}
          strokeWidth={0.7}
          opacity={0.28}
        />
        {/* 数据点 */}
        {[0, 12, 24, 36, 48, 60].map((x, i) => (
          <circle
            key={`cal-pt-${i}`}
            cx={x}
            cy={-i * 7}
            r={1.5}
            fill={accent}
            opacity={0.3}
          />
        ))}
      </g>

      {/* ── 探测器轮廓 -- 左上角 ── */}
      <g transform={`translate(${worldToScreen(2, 2).x}, ${worldToScreen(2, 2).y})`}>
        {/* 探测器主体 */}
        <rect x={-14} y={-24} width={28} height={36} rx={3} fill="none" stroke={accent} strokeWidth={1} opacity={0.35} />
        {/* 入光窗口 */}
        <rect x={-10} y={-24} width={20} height={6} rx={1} fill={accent} opacity={0.12} />
        {/* 内部电路示意 */}
        <line x1={-8} y1={-12} x2={8} y2={-12} stroke={accent} strokeWidth={0.3} opacity={0.15} />
        <line x1={-8} y1={-4} x2={8} y2={-4} stroke={accent} strokeWidth={0.3} opacity={0.12} />
        <line x1={-8} y1={4} x2={8} y2={4} stroke={accent} strokeWidth={0.3} opacity={0.1} />
        {/* 信号输出 */}
        <line x1={0} y1={12} x2={0} y2={22} stroke={accent} strokeWidth={0.6} opacity={0.2} />
        <circle cx={0} cy={24} r={2.5} fill={accent} opacity={0.15} />
      </g>

      {/* ── 光电倍增管 -- 左下 ── */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 2).x}, ${worldToScreen(2, gridHeight - 2).y})`}>
        <rect x={-10} y={-22} width={20} height={30} rx={3} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.28} />
        <circle cx={0} cy={-14} r={5} fill={accent} opacity={0.08} />
        <circle cx={0} cy={-14} r={2.5} fill={accent} opacity={0.12} />
        {/* 打拿极 */}
        {[0, 1, 2].map((i) => (
          <line
            key={`dynode-${i}`}
            x1={-6}
            y1={-4 + i * 6}
            x2={6}
            y2={-4 + i * 6}
            stroke={accent}
            strokeWidth={0.5}
            opacity={0.15}
          />
        ))}
        <line x1={0} y1={8} x2={0} y2={14} stroke={accent} strokeWidth={0.4} opacity={0.12} />
      </g>

      {/* ── 边缘刻度标记 -- 上边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 0).x}, ${worldToScreen(gridWidth / 2, 0).y - 10})`}>
        {Array.from({ length: 19 }, (_, i) => (
          <line
            key={`top-tick-${i}`}
            x1={-90 + i * 10}
            y1={0}
            x2={-90 + i * 10}
            y2={i % 5 === 0 ? -7 : -3}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.18}
          />
        ))}
      </g>

      {/* ── 边缘刻度标记 -- 右边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth, gridHeight / 2).x + 8}, ${worldToScreen(gridWidth, gridHeight / 2).y})`}>
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={`right-tick-${i}`}
            x1={0}
            y1={-50 + i * 10}
            x2={i % 5 === 0 ? 6 : 3}
            y2={-50 + i * 10}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.15}
          />
        ))}
      </g>
    </g>
  )
}
