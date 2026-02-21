/**
 * InterfaceLabDecorations.tsx -- Interface Lab 区域装饰
 *
 * 冷蓝色界面实验室的非交互视觉元素 (Monument Valley 品质):
 * - 层叠玻璃堆叠可视化 (3-4 水平层)
 * - 水面波纹线
 * - 入射角线条 (虚线光线)
 * - 菲涅尔曲线轮廓暗示
 * - 小透镜形状
 * - 水平分层线底纹 (0.03 opacity)
 * - 玻璃边缘高光边界
 * - 水面波纹缩放动画 (CSS scaleX, 5s ease-in-out)
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
const INTERFACE_ANIMATIONS = `
  @keyframes water-ripple {
    0%, 100% { transform: scaleX(0.98); }
    50% { transform: scaleX(1.02); }
  }
`

export default function InterfaceLabDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="interface-lab-decorations" opacity={0.65}>
      {/* CSS 动画定义 */}
      <style>{INTERFACE_ANIMATIONS}</style>

      {/* ── 底层纹理: 水平分层线 (暗示层状介质) ── */}
      <defs>
        <pattern id="interface-strata" x={0} y={0} width={200} height={16} patternUnits="userSpaceOnUse">
          <line x1={0} y1={8} x2={200} y2={8} stroke={accent} strokeWidth={0.2} opacity={0.4} />
        </pattern>
      </defs>
      <rect
        x={worldToScreen(0, 0).x - 80}
        y={worldToScreen(0, 0).y - 60}
        width={800}
        height={500}
        fill="url(#interface-strata)"
        opacity={0.03}
      />

      {/* ── 主要图案 1: 层叠玻璃堆叠 -- 中央 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2).y})`}>
        {/* 主界面线 */}
        <line x1={-120} y1={0} x2={120} y2={0} stroke={accent} strokeWidth={1.3} opacity={0.3} />

        {/* 上方介质层 (n1 -- 较低折射率) */}
        <rect x={-110} y={-18} width={220} height={18} fill={accent} opacity={0.05} />
        {/* 额外层 */}
        <rect x={-100} y={-32} width={200} height={12} fill={accent} opacity={0.03} />

        {/* 下方介质层 (n2 -- 较高折射率) */}
        <rect x={-110} y={0} width={220} height={18} fill={accent} opacity={0.1} />
        {/* 额外深层 */}
        <rect x={-100} y={18} width={200} height={12} fill={accent} opacity={0.06} />

        {/* 法线虚线 */}
        <line x1={0} y1={-40} x2={0} y2={40} stroke={accent} strokeWidth={0.5} opacity={0.2} strokeDasharray="3,3" />

        {/* 折射率标记 */}
        <rect x={-108} y={-14} width={16} height={8} rx={2} fill={accent} opacity={0.08} />
        <rect x={-108} y={6} width={16} height={8} rx={2} fill={accent} opacity={0.1} />
      </g>

      {/* ── 主要图案 2: 水面波纹线 (动画) ── */}
      <g
        transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2 + 3).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2 + 3).y})`}
        style={{ animation: 'water-ripple 5s ease-in-out infinite', transformOrigin: 'center' }}
      >
        <path
          d="M-80,0 Q-60,-4 -40,0 Q-20,4 0,0 Q20,-4 40,0 Q60,4 80,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.3}
        />
        <path
          d="M-70,6 Q-50,2 -30,6 Q-10,10 10,6 Q30,2 50,6 Q70,10 80,6"
          fill="none"
          stroke={accent}
          strokeWidth={0.5}
          opacity={0.18}
        />
      </g>

      {/* ── 菲涅尔曲线 -- 左上角 ── */}
      <g transform={`translate(${worldToScreen(2, 2).x}, ${worldToScreen(2, 2).y})`}>
        {/* Rs 曲线 (s-偏振反射率) -- 实线 */}
        <path
          d="M0,0 Q12,-2 24,-6 Q36,-12 44,-24 Q48,-32 52,-40"
          fill="none"
          stroke={accent}
          strokeWidth={0.9}
          opacity={0.4}
        />
        {/* Rp 曲线 (p-偏振反射率，布儒斯特凹陷) -- 虚线 */}
        <path
          d="M0,0 Q12,-1 24,2 Q30,3 34,0 Q38,-10 44,-24 Q48,-32 52,-40"
          fill="none"
          stroke={accent}
          strokeWidth={0.9}
          opacity={0.28}
          strokeDasharray="4,2"
        />
        {/* 布儒斯特角标记 */}
        <circle cx={32} cy={1} r={2} fill="none" stroke={accent} strokeWidth={0.6} opacity={0.35} />
        {/* 坐标轴 */}
        <line x1={0} y1={6} x2={58} y2={6} stroke={accent} strokeWidth={0.5} opacity={0.2} />
        <line x1={0} y1={6} x2={0} y2={-45} stroke={accent} strokeWidth={0.5} opacity={0.2} />
        {/* 轴标记 */}
        <polygon points="58,6 54,4 54,8" fill={accent} opacity={0.2} />
        <polygon points="0,-45 -2,-41 2,-41" fill={accent} opacity={0.2} />
      </g>

      {/* ── 层叠材料板 -- 右下区域 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, gridHeight - 3).x}, ${worldToScreen(gridWidth - 3, gridHeight - 3).y})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`slab-${i}`}
            x={-30}
            y={-24 + i * 8}
            width={60}
            height={6}
            rx={1}
            fill={accent}
            opacity={0.06 + i * 0.03}
          />
        ))}
        {/* 入射光线 */}
        <line x1={-40} y1={-35} x2={-15} y2={-24} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        {/* 折射光线穿过多层 */}
        <line x1={-15} y1={-24} x2={-5} y2={-16} stroke={accent} strokeWidth={0.6} opacity={0.2} />
        <line x1={-5} y1={-16} x2={5} y2={-8} stroke={accent} strokeWidth={0.5} opacity={0.18} />
        <line x1={5} y1={-8} x2={12} y2={0} stroke={accent} strokeWidth={0.5} opacity={0.15} />
        <line x1={12} y1={0} x2={18} y2={8} stroke={accent} strokeWidth={0.4} opacity={0.12} />
      </g>

      {/* ── 布儒斯特角指示 -- 中部偏右 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 4, gridHeight / 2 - 1).x}, ${worldToScreen(gridWidth - 4, gridHeight / 2 - 1).y})`}>
        {/* 界面线 */}
        <line x1={-25} y1={0} x2={25} y2={0} stroke={accent} strokeWidth={0.9} opacity={0.3} />
        {/* 入射光 */}
        <line x1={-18} y1={-22} x2={0} y2={0} stroke={accent} strokeWidth={0.7} opacity={0.35} />
        {/* 反射光 (布儒斯特角: 反射与折射垂直) */}
        <line x1={0} y1={0} x2={18} y2={-22} stroke={accent} strokeWidth={0.7} opacity={0.3} />
        {/* 折射光 */}
        <line x1={0} y1={0} x2={12} y2={18} stroke={accent} strokeWidth={0.5} opacity={0.2} strokeDasharray="2,2" />
        {/* 角度弧 */}
        <path d="M0,-10 A10,10 0 0 0 -7,-7" fill="none" stroke={accent} strokeWidth={0.5} opacity={0.3} />
        {/* 直角标记 (反射光与折射光垂直) */}
        <rect x={4} y={-4} width={4} height={4} fill="none" stroke={accent} strokeWidth={0.4} opacity={0.2} />
      </g>

      {/* ── 次要细节 1: 小透镜形状 ── */}
      {[
        { x: gridWidth - 2, y: 3 },
        { x: 1, y: gridHeight / 2 },
        { x: gridWidth / 2 + 2, y: gridHeight - 1 },
      ].map((pos, i) => {
        const s = worldToScreen(pos.x, pos.y)
        return (
          <g key={`lens-${i}`} transform={`translate(${s.x}, ${s.y})`}>
            <ellipse cx={0} cy={0} rx={8} ry={3} fill="none" stroke={accent} strokeWidth={0.5} opacity={0.2} />
            <line x1={-12} y1={0} x2={12} y2={0} stroke={accent} strokeWidth={0.3} opacity={0.12} strokeDasharray="2,3" />
          </g>
        )
      })}

      {/* ── 次要细节 2: 全反射棱镜 -- 左下角 ── */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 2).x}, ${worldToScreen(2, gridHeight - 2).y})`}>
        <polygon
          points="0,-18 22,12 -22,12"
          fill={accent}
          fillOpacity={0.04}
          stroke={accent}
          strokeWidth={0.9}
          opacity={0.3}
        />
        {/* 全反射光线 */}
        <line x1={-12} y1={-3} x2={0} y2={6} stroke={accent} strokeWidth={0.5} opacity={0.2} />
        <line x1={0} y1={6} x2={12} y2={-3} stroke={accent} strokeWidth={0.5} opacity={0.2} />
        {/* 临界角标记 */}
        <path d="M0,6 L4,3" fill="none" stroke={accent} strokeWidth={0.4} opacity={0.2} />
      </g>

      {/* ── 次要细节 3: 入射角度虚线 ── */}
      {[
        { from: { x: 4, y: 1 }, to: { x: 6, y: 3 } },
        { from: { x: gridWidth - 5, y: 2 }, to: { x: gridWidth - 3, y: 4 } },
      ].map((ray, i) => {
        const s1 = worldToScreen(ray.from.x, ray.from.y)
        const s2 = worldToScreen(ray.to.x, ray.to.y)
        return (
          <line
            key={`ray-${i}`}
            x1={s1.x} y1={s1.y}
            x2={s2.x} y2={s2.y}
            stroke={accent}
            strokeWidth={0.5}
            opacity={0.18}
            strokeDasharray="5,5"
          />
        )
      })}

      {/* ── 玻璃边缘高光 -- 上边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 0).x}, ${worldToScreen(gridWidth / 2, 0).y - 10})`}>
        <line x1={-80} y1={0} x2={80} y2={0} stroke={accent} strokeWidth={0.6} opacity={0.15} />
        <line x1={-60} y1={-3} x2={60} y2={-3} stroke={accent} strokeWidth={0.3} opacity={0.08} />
      </g>

      {/* ── 玻璃边缘高光 -- 下边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight).x}, ${worldToScreen(gridWidth / 2, gridHeight).y + 8})`}>
        <line x1={-70} y1={0} x2={70} y2={0} stroke={accent} strokeWidth={0.5} opacity={0.12} />
      </g>

      {/* ── 附加装饰点 ── */}
      {[
        { x: 1, y: 3, r: 1.5 },
        { x: gridWidth - 1, y: gridHeight / 2, r: 1.2 },
        { x: gridWidth / 2, y: 1, r: 1.6 },
        { x: 3, y: gridHeight - 1, r: 1.3 },
        { x: gridWidth - 2, y: gridHeight - 1, r: 1.0 },
        { x: gridWidth / 2 - 3, y: gridHeight - 2, r: 1.4 },
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
