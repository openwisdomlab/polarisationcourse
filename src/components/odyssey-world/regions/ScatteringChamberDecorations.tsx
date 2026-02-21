/**
 * ScatteringChamberDecorations.tsx -- Scattering Chamber 区域装饰
 *
 * 深靛蓝散射暗室的非交互视觉元素 (Monument Valley 品质):
 * - 大气雾霭渐变层 (3 个 radialGradient)
 * - 天穹弧线
 * - 粒子轨迹曲线 (虚线，暗示散射光路)
 * - 望远镜剪影
 * - 细微点阵散射 (100+ 小圆，0.02-0.04 opacity)
 * - 边界渐变淡出
 * - 2-3 粒子慢速漂移 (CSS translateY, 7s ease-in-out)
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
const SCATTER_ANIMATIONS = `
  @keyframes particle-drift-a {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  @keyframes particle-drift-b {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(5px); }
  }
  @keyframes particle-drift-c {
    0%, 100% { transform: translateX(0px) translateY(0px); }
    50% { transform: translateX(3px) translateY(-4px); }
  }
`

// 使用种子函数生成确定性随机散射点 (不依赖 Math.random)
function seededDots(count: number, gw: number, gh: number): { x: number; y: number; r: number; o: number }[] {
  const dots: { x: number; y: number; r: number; o: number }[] = []
  for (let i = 0; i < count; i++) {
    // 确定性伪随机 (基于索引)
    const fx = ((i * 7919 + 1009) % 997) / 997
    const fy = ((i * 6271 + 2003) % 991) / 991
    const fr = ((i * 3571 + 503) % 499) / 499
    dots.push({
      x: fx * gw,
      y: fy * gh,
      r: 0.5 + fr * 1.5,
      o: 0.02 + fr * 0.02,
    })
  }
  return dots
}

export default function ScatteringChamberDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  // 确定性散射点
  const scatterDots = seededDots(120, gridWidth, gridHeight)

  return (
    <g className="scattering-chamber-decorations" opacity={0.65}>
      {/* CSS 动画定义 */}
      <style>{SCATTER_ANIMATIONS}</style>

      {/* ── 大气雾霭层 (3 个 radialGradient) ── */}
      <defs>
        <radialGradient id="scatter-haze-main">
          <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
          <stop offset="50%" stopColor={accent} stopOpacity="0.06" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="scatter-haze-left">
          <stop offset="0%" stopColor={accent} stopOpacity="0.10" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.03" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="scatter-haze-right">
          <stop offset="0%" stopColor={accent} stopOpacity="0.08" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.02" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 中央主雾霭 */}
      <circle
        cx={worldToScreen(gridWidth / 2, gridHeight / 2).x}
        cy={worldToScreen(gridWidth / 2, gridHeight / 2).y}
        r={150}
        fill="url(#scatter-haze-main)"
      />
      {/* 左侧雾霭 */}
      <circle
        cx={worldToScreen(2, gridHeight / 2 + 1).x}
        cy={worldToScreen(2, gridHeight / 2 + 1).y}
        r={80}
        fill="url(#scatter-haze-left)"
      />
      {/* 右上雾霭 */}
      <circle
        cx={worldToScreen(gridWidth - 3, 3).x}
        cy={worldToScreen(gridWidth - 3, 3).y}
        r={70}
        fill="url(#scatter-haze-right)"
      />

      {/* ── 底层纹理: 100+ 微小散射粒子点 ── */}
      {scatterDots.map((dot, i) => {
        const s = worldToScreen(dot.x, dot.y)
        return (
          <circle
            key={`scatter-dot-${i}`}
            cx={s.x}
            cy={s.y}
            r={dot.r}
            fill={accent}
            opacity={dot.o}
          />
        )
      })}

      {/* ── 主要图案 1: 天穹弧 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 1).x}, ${worldToScreen(gridWidth / 2, 1).y})`}>
        {/* 主弧 */}
        <path
          d="M-70,0 A80,35 0 0 1 70,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.9}
          opacity={0.25}
        />
        {/* 内弧 */}
        <path
          d="M-50,0 A55,22 0 0 1 50,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.4}
          opacity={0.15}
        />
        {/* 天顶标记 */}
        <circle cx={0} cy={-32} r={3.5} fill={accent} opacity={0.2} />
        <line x1={0} y1={-28} x2={0} y2={0} stroke={accent} strokeWidth={0.4} opacity={0.15} strokeDasharray="3,4" />
        {/* 天球角度刻度 */}
        {[30, 60, 90, 120, 150].map((deg) => {
          const rad = (deg * Math.PI) / 180
          return (
            <line
              key={`sky-${deg}`}
              x1={Math.cos(rad) * 72}
              y1={-Math.sin(rad) * 30}
              x2={Math.cos(rad) * 80}
              y2={-Math.sin(rad) * 35}
              stroke={accent}
              strokeWidth={0.4}
              opacity={0.2}
            />
          )
        })}
      </g>

      {/* ── 主要图案 2: 粒子轨迹 (曲线虚线) ── */}
      {[
        { x1: 2, y1: 2, ctrl: { x: 4, y: 3 }, x2: 6, y2: 5 },
        { x1: gridWidth - 4, y1: 3, ctrl: { x: gridWidth - 3, y: 5 }, x2: gridWidth - 2, y2: 7 },
        { x1: 3, y1: gridHeight - 5, ctrl: { x: 5, y: gridHeight - 3 }, x2: 7, y2: gridHeight - 2 },
        { x1: gridWidth / 2, y1: 3, ctrl: { x: gridWidth / 2 + 2, y: 5 }, x2: gridWidth / 2 - 1, y2: 7 },
      ].map((trace, i) => {
        const s1 = worldToScreen(trace.x1, trace.y1)
        const sc = worldToScreen(trace.ctrl.x, trace.ctrl.y)
        const s2 = worldToScreen(trace.x2, trace.y2)
        return (
          <path
            key={`trace-${i}`}
            d={`M${s1.x},${s1.y} Q${sc.x},${sc.y} ${s2.x},${s2.y}`}
            fill="none"
            stroke={accent}
            strokeWidth={0.6}
            strokeDasharray="4,6"
            opacity={0.25}
          />
        )
      })}

      {/* ── 主要图案 3: 望远镜剪影 -- 右上角 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 2, 1).x}, ${worldToScreen(gridWidth - 2, 1).y})`}>
        {/* 镜筒 */}
        <rect x={-5} y={-30} width={10} height={38} rx={2} fill={accent} opacity={0.18} />
        {/* 物镜 */}
        <ellipse cx={0} cy={-30} rx={10} ry={3.5} fill={accent} opacity={0.13} />
        {/* 目镜 */}
        <ellipse cx={0} cy={8} rx={5} ry={2} fill={accent} opacity={0.1} />
        {/* 三脚架 */}
        <line x1={0} y1={8} x2={-14} y2={24} stroke={accent} strokeWidth={1.2} opacity={0.18} />
        <line x1={0} y1={8} x2={14} y2={24} stroke={accent} strokeWidth={1.2} opacity={0.18} />
        <line x1={0} y1={8} x2={0} y2={26} stroke={accent} strokeWidth={1.2} opacity={0.18} />
        {/* 寻星镜 */}
        <rect x={6} y={-20} width={4} height={12} rx={1} fill={accent} opacity={0.1} />
      </g>

      {/* ── 次要细节: 散射角度标记 -- 底部中央 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight - 2).x}, ${worldToScreen(gridWidth / 2, gridHeight - 2).y})`}>
        {/* 散射锥形射线 */}
        {[-40, -25, -10, 0, 10, 25, 40].map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180
          return (
            <line
              key={`cone-${i}`}
              x1={0} y1={0}
              x2={Math.cos(rad) * 25} y2={Math.sin(rad) * 25}
              stroke={accent}
              strokeWidth={0.5}
              opacity={0.2}
            />
          )
        })}
        {/* 入射箭头 */}
        <line x1={0} y1={20} x2={0} y2={3} stroke={accent} strokeWidth={0.8} opacity={0.3} />
        <polygon points="0,3 -2,7 2,7" fill={accent} opacity={0.25} />
      </g>

      {/* ── 边界渐变淡出效果 ── */}
      <defs>
        <linearGradient id="scatter-edge-fade-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.06" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="scatter-edge-fade-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={worldToScreen(0, gridHeight / 2).x - 30}
        y={worldToScreen(0, 0).y - 50}
        width={40}
        height={300}
        fill="url(#scatter-edge-fade-left)"
      />
      <rect
        x={worldToScreen(0, 0).x - 50}
        y={worldToScreen(0, 0).y - 30}
        width={500}
        height={30}
        fill="url(#scatter-edge-fade-top)"
      />

      {/* ── 动画粒子 1: 慢速垂直漂移 ── */}
      <g
        transform={`translate(${worldToScreen(3, 4).x}, ${worldToScreen(3, 4).y})`}
        style={{ animation: 'particle-drift-a 7s ease-in-out infinite' }}
      >
        <circle cx={0} cy={0} r={2.5} fill={accent} opacity={0.2} />
      </g>

      {/* ── 动画粒子 2: 反向漂移 ── */}
      <g
        transform={`translate(${worldToScreen(gridWidth - 3, gridHeight - 4).x}, ${worldToScreen(gridWidth - 3, gridHeight - 4).y})`}
        style={{ animation: 'particle-drift-b 7s ease-in-out infinite 2s' }}
      >
        <circle cx={0} cy={0} r={2} fill={accent} opacity={0.18} />
      </g>

      {/* ── 动画粒子 3: 对角漂移 ── */}
      <g
        transform={`translate(${worldToScreen(gridWidth / 2 + 1, gridHeight / 2 - 1).x}, ${worldToScreen(gridWidth / 2 + 1, gridHeight / 2 - 1).y})`}
        style={{ animation: 'particle-drift-c 7s ease-in-out infinite 4s' }}
      >
        <circle cx={0} cy={0} r={1.8} fill={accent} opacity={0.15} />
      </g>

      {/* ── 瑞利散射示意: 极化图 (花生形) ── */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 2).x}, ${worldToScreen(2, gridHeight - 2).y})`}>
        <path
          d="M0,0 Q-15,-8 0,-16 Q15,-8 0,0 Q-15,8 0,16 Q15,8 0,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.6}
          opacity={0.2}
        />
        <circle cx={0} cy={0} r={1.5} fill={accent} opacity={0.2} />
      </g>
    </g>
  )
}
