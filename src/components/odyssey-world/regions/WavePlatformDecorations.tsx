/**
 * WavePlatformDecorations.tsx -- Wave Platform 区域装饰
 *
 * 青色波动平台的非交互视觉元素 (Monument Valley 品质):
 * - 大型正弦波叠加覆盖场景宽度
 * - 驻波节点标记
 * - 相位圆 (0, pi/2, pi, 3pi/2)
 * - 干涉条纹带
 * - 同心波纹底纹 (0.03 opacity)
 * - 波峰边界图案
 * - 正弦波平移动画 (CSS translateX, 6s linear)
 * - 相位标记缓慢旋转
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
const WAVE_ANIMATIONS = `
  @keyframes wave-drift {
    0% { transform: translateX(0px); }
    100% { transform: translateX(20px); }
  }
  @keyframes phase-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export default function WavePlatformDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="wave-platform-decorations" opacity={0.35}>
      {/* CSS 动画定义 */}
      <style>{WAVE_ANIMATIONS}</style>

      {/* ── 底层纹理: 同心波纹 ── */}
      <defs>
        <radialGradient id="wave-ripple-bg">
          <stop offset="0%" stopColor={accent} stopOpacity="0.04" />
          <stop offset="40%" stopColor={accent} stopOpacity="0.02" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 中央波纹 */}
      <circle
        cx={worldToScreen(gridWidth / 2, gridHeight / 2).x}
        cy={worldToScreen(gridWidth / 2, gridHeight / 2).y}
        r={200}
        fill="url(#wave-ripple-bg)"
      />
      {/* 同心圆纹 */}
      {[60, 100, 140, 180].map((r) => (
        <circle
          key={`ripple-${r}`}
          cx={worldToScreen(gridWidth / 2, gridHeight / 2).x}
          cy={worldToScreen(gridWidth / 2, gridHeight / 2).y}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={0.3}
          opacity={0.03}
        />
      ))}

      {/* ── 主要图案 1: 大型正弦波覆盖 (上半部) ── */}
      <g
        transform={`translate(${worldToScreen(2, 2).x}, ${worldToScreen(2, 2).y})`}
        style={{ animation: 'wave-drift 6s linear infinite' }}
      >
        <path
          d="M0,0 Q18,-16 36,0 Q54,16 72,0 Q90,-16 108,0 Q126,16 144,0 Q162,-16 180,0 Q198,16 216,0"
          fill="none"
          stroke={accent}
          strokeWidth={1}
          opacity={0.3}
        />
        {/* 包络虚线 */}
        <path
          d="M0,-16 L216,-16"
          fill="none"
          stroke={accent}
          strokeWidth={0.4}
          opacity={0.12}
          strokeDasharray="4,6"
        />
        <path
          d="M0,16 L216,16"
          fill="none"
          stroke={accent}
          strokeWidth={0.4}
          opacity={0.12}
          strokeDasharray="4,6"
        />
      </g>

      {/* ── 主要图案 2: 第二正弦波 (下半部, 反相) ── */}
      <g transform={`translate(${worldToScreen(2, gridHeight - 3).x}, ${worldToScreen(2, gridHeight - 3).y})`}>
        <path
          d="M0,0 Q25,14 50,0 Q75,-14 100,0 Q125,14 150,0 Q175,-14 200,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.7}
          opacity={0.22}
        />
      </g>

      {/* ── 主要图案 3: 驻波节点标记 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight - 1).x}, ${worldToScreen(gridWidth / 2, gridHeight - 1).y})`}>
        {[-40, -20, 0, 20, 40].map((offset, i) => (
          <g key={`node-${i}`}>
            {/* 节点圆 (不动点) */}
            <circle cx={offset} cy={0} r={3.5} fill="none" stroke={accent} strokeWidth={0.9} opacity={0.35} />
            {/* 腹点三角 */}
            {i < 4 && (
              <polygon
                points={`${offset + 10},-5 ${offset + 10},5 ${offset + 7},0`}
                fill={accent}
                opacity={0.12}
              />
            )}
            {/* 节点垂直线 */}
            <line x1={offset} y1={-8} x2={offset} y2={8} stroke={accent} strokeWidth={0.3} opacity={0.15} />
          </g>
        ))}
      </g>

      {/* ── 次要细节 1: 干涉图案 -- 波源 A 同心圆 ── */}
      <g transform={`translate(${worldToScreen(4, gridHeight / 2).x}, ${worldToScreen(4, gridHeight / 2).y})`}>
        {[20, 40, 60, 80, 100].map((r) => (
          <circle
            key={`wave-a-${r}`}
            cx={0} cy={0} r={r}
            fill="none"
            stroke={accent}
            strokeWidth={0.5}
            opacity={0.12}
          />
        ))}
        <circle cx={0} cy={0} r={4} fill={accent} opacity={0.25} />
        <circle cx={0} cy={0} r={1.5} fill={accent} opacity={0.4} />
      </g>

      {/* ── 次要细节 2: 干涉图案 -- 波源 B 同心圆 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 5, gridHeight / 2).x}, ${worldToScreen(gridWidth - 5, gridHeight / 2).y})`}>
        {[20, 40, 60, 80, 100].map((r) => (
          <circle
            key={`wave-b-${r}`}
            cx={0} cy={0} r={r}
            fill="none"
            stroke={accent}
            strokeWidth={0.5}
            opacity={0.12}
          />
        ))}
        <circle cx={0} cy={0} r={4} fill={accent} opacity={0.25} />
        <circle cx={0} cy={0} r={1.5} fill={accent} opacity={0.4} />
      </g>

      {/* ── 次要细节 3: 相位圆标记 (0, pi/2, pi, 3pi/2) ── */}
      {[
        { x: 3, y: 1, label: '0' },
        { x: gridWidth / 2, y: 1, label: '\u03C0/2' },
        { x: gridWidth - 4, y: 1, label: '\u03C0' },
        { x: gridWidth / 2, y: gridHeight - 2, label: '3\u03C0/2' },
      ].map((phase, i) => {
        const s = worldToScreen(phase.x, phase.y)
        return (
          <g key={`phase-${i}`} transform={`translate(${s.x}, ${s.y})`}>
            <circle cx={0} cy={0} r={6} fill="none" stroke={accent} strokeWidth={0.6} opacity={0.3} />
            {/* 相位角弧线 */}
            <path
              d={`M0,-6 A6,6 0 0 1 ${6 * Math.cos(-(Math.PI / 2) + (i * Math.PI) / 2)},${6 * Math.sin(-(Math.PI / 2) + (i * Math.PI) / 2)}`}
              fill="none"
              stroke={accent}
              strokeWidth={1}
              opacity={0.4}
            />
            <circle cx={0} cy={0} r={1.2} fill={accent} opacity={0.3} />
          </g>
        )
      })}

      {/* ── 次要细节 4: 干涉条纹带 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight / 2 - 3).x}, ${worldToScreen(gridWidth / 2, gridHeight / 2 - 3).y})`}>
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={`fringe-${i}`}
            x={-60 + i * 15}
            y={-4}
            width={8}
            height={8}
            rx={1}
            fill={accent}
            opacity={i % 2 === 0 ? 0.12 : 0.04}
          />
        ))}
      </g>

      {/* ── 次要细节 5: 波长标记尺 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, gridHeight - 2).x}, ${worldToScreen(gridWidth - 3, gridHeight - 2).y})`}>
        <line x1={-30} y1={0} x2={30} y2={0} stroke={accent} strokeWidth={0.5} opacity={0.25} />
        <line x1={-30} y1={-4} x2={-30} y2={4} stroke={accent} strokeWidth={0.5} opacity={0.25} />
        <line x1={30} y1={-4} x2={30} y2={4} stroke={accent} strokeWidth={0.5} opacity={0.25} />
        {/* lambda 标记 */}
        <path d="M-3,-8 L0,-3 L3,-8" fill="none" stroke={accent} strokeWidth={0.5} opacity={0.3} />
      </g>

      {/* ── 波峰边界图案 -- 上边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 0).x}, ${worldToScreen(gridWidth / 2, 0).y - 15})`}>
        <path
          d="M-90,0 Q-75,-6 -60,0 Q-45,6 -30,0 Q-15,-6 0,0 Q15,6 30,0 Q45,-6 60,0 Q75,6 90,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.7}
          opacity={0.25}
        />
      </g>

      {/* ── 波峰边界图案 -- 下边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight).x}, ${worldToScreen(gridWidth / 2, gridHeight).y + 10})`}>
        <path
          d="M-80,0 Q-65,5 -50,0 Q-35,-5 -20,0 Q-5,5 10,0 Q25,-5 40,0 Q55,5 70,0 Q85,-5 80,0"
          fill="none"
          stroke={accent}
          strokeWidth={0.6}
          opacity={0.2}
        />
      </g>

      {/* ── Jones 向量方向标记 -- 右上角 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 3, 2).x}, ${worldToScreen(gridWidth - 3, 2).y})`}>
        {/* 坐标轴 */}
        <line x1={0} y1={0} x2={25} y2={0} stroke={accent} strokeWidth={0.7} opacity={0.3} />
        <line x1={0} y1={0} x2={0} y2={-25} stroke={accent} strokeWidth={0.7} opacity={0.3} />
        {/* 箭头 */}
        <polygon points="25,0 21,-2 21,2" fill={accent} opacity={0.3} />
        <polygon points="0,-25 -2,-21 2,-21" fill={accent} opacity={0.3} />
        {/* 偏振椭圆 */}
        <ellipse cx={12} cy={-12} rx={10} ry={6} fill="none" stroke={accent} strokeWidth={0.6} opacity={0.25} transform="rotate(-30, 12, -12)" />
        {/* 旋向箭头 */}
        <path d="M18,-8 L20,-10 L18,-12" fill="none" stroke={accent} strokeWidth={0.4} opacity={0.2} />
      </g>

      {/* ── 动画: 相位旋转指示器 (中部偏左) ── */}
      <g transform={`translate(${worldToScreen(2, gridHeight / 2).x}, ${worldToScreen(2, gridHeight / 2).y})`}>
        <g style={{ animation: 'phase-rotate 12s linear infinite', transformOrigin: '0px 0px' }}>
          <line x1={0} y1={0} x2={10} y2={0} stroke={accent} strokeWidth={0.6} opacity={0.35} />
          <circle cx={10} cy={0} r={1.5} fill={accent} opacity={0.3} />
        </g>
        <circle cx={0} cy={0} r={12} fill="none" stroke={accent} strokeWidth={0.4} opacity={0.2} />
      </g>

      {/* ── 附加小波纹点 ── */}
      {[
        { x: 1, y: 3, r: 2 },
        { x: gridWidth - 1, y: gridHeight / 2 + 2, r: 1.5 },
        { x: gridWidth / 2 + 1, y: gridHeight - 1, r: 1.8 },
        { x: 5, y: gridHeight - 1, r: 1.2 },
        { x: gridWidth - 2, y: 4, r: 1.6 },
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
