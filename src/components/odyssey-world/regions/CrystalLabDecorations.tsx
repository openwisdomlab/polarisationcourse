/**
 * CrystalLabDecorations.tsx -- Crystal Lab 区域装饰
 *
 * 冰蓝色水晶实验室的非交互视觉元素 (Monument Valley 品质):
 * - 大型六角形水晶簇 (3 连锁六角形 + 渐变填充)
 * - 磨砂玻璃标本柜 (多层隔板 + 晶体样品)
 * - 散布小型水晶棱镜、冰晶雪花图案
 * - 六角晶格底纹 (0.03 opacity)
 * - 霜边边缘细节
 * - 1-2 脉冲发光水晶 (CSS @keyframes, 4s ease-in-out)
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

/** CSS 动画样式 -- 注入到 SVG <style> 中 */
const CRYSTAL_ANIMATIONS = `
  @keyframes crystal-pulse-a {
    0%, 100% { opacity: 0.25; }
    50% { opacity: 0.42; }
  }
  @keyframes crystal-pulse-b {
    0%, 100% { opacity: 0.20; }
    50% { opacity: 0.38; }
  }
`

export default function CrystalLabDecorations({ gridWidth, gridHeight, theme }: DecorationProps) {
  const accent = theme.colorPalette.accentColor

  return (
    <g className="crystal-lab-decorations" opacity={0.65}>
      {/* CSS 动画定义 */}
      <style>{CRYSTAL_ANIMATIONS}</style>

      {/* ── 底层纹理: 六角晶格网底纹 ── */}
      <defs>
        <pattern id="crystal-hex-grid" x={0} y={0} width={40} height={34.6} patternUnits="userSpaceOnUse">
          <polygon
            points="20,0 40,10 40,27 20,34.6 0,27 0,10"
            fill="none"
            stroke={accent}
            strokeWidth={0.3}
            opacity={0.5}
          />
        </pattern>
      </defs>
      <rect
        x={worldToScreen(0, 0).x - 100}
        y={worldToScreen(0, 0).y - 100}
        width={800}
        height={600}
        fill="url(#crystal-hex-grid)"
        opacity={0.03}
      />

      {/* ── 主要图案 1: 大型六角水晶簇 -- 左上角区域 ── */}
      <g transform={`translate(${worldToScreen(1.5, 1.5).x}, ${worldToScreen(1.5, 1.5).y})`}>
        {/* 大六角形晶体 (主体) */}
        <polygon
          points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14"
          fill={accent}
          fillOpacity={0.18}
          stroke={accent}
          strokeWidth={1.4}
          opacity={0.6}
        />
        {/* 内部晶格线 */}
        <line x1={0} y1={-28} x2={0} y2={28} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        <line x1={-24} y1={-14} x2={24} y2={14} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        <line x1={-24} y1={14} x2={24} y2={-14} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        {/* 中心宝石高光 */}
        <circle cx={0} cy={0} r={4} fill={accent} opacity={0.2} />

        {/* 右侧连锁六角形 */}
        <polygon
          points="36,-8 52,-16 52,0 36,8 28,0 28,-16"
          fill={accent}
          fillOpacity={0.15}
          stroke={accent}
          strokeWidth={0.9}
          opacity={0.45}
        />

        {/* 左下连锁六角形 */}
        <polygon
          points="-16,28 -8,20 8,24 8,40 -8,44 -16,36"
          fill={accent}
          fillOpacity={0.15}
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.4}
        />
      </g>

      {/* ── 主要图案 2: 磨砂玻璃标本柜 -- 中部偏左 ── */}
      <g transform={`translate(${worldToScreen(2, 6).x}, ${worldToScreen(2, 6).y})`}>
        {/* 柜体外框 */}
        <rect x={-24} y={-38} width={48} height={48} rx={3} fill={accent} fillOpacity={0.04} stroke={accent} strokeWidth={1.1} opacity={0.5} />
        {/* 柜顶装饰边 */}
        <line x1={-24} y1={-38} x2={24} y2={-38} stroke={accent} strokeWidth={1.5} opacity={0.35} />
        {/* 隔板 */}
        <line x1={-20} y1={-22} x2={20} y2={-22} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        <line x1={-20} y1={-6} x2={20} y2={-6} stroke={accent} strokeWidth={0.6} opacity={0.25} />
        {/* 标本样品 -- 小晶体形状 */}
        <polygon points="-10,-32 -6,-27 -14,-27" fill={accent} opacity={0.2} />
        <circle cx={8} cy={-30} r={3} fill={accent} opacity={0.18} />
        <rect x={-4} y={-18} width={8} height={6} rx={1} fill={accent} opacity={0.14} />
        <polygon points="10,-15 14,-10 6,-10" fill={accent} opacity={0.16} />
        <circle cx={-8} cy={-1} r={3.5} fill={accent} opacity={0.15} />
        <rect x={4} y={-4} width={10} height={5} rx={1} fill={accent} opacity={0.12} />
        {/* 柜脚 */}
        <line x1={-20} y1={10} x2={-20} y2={15} stroke={accent} strokeWidth={1.2} opacity={0.2} />
        <line x1={20} y1={10} x2={20} y2={15} stroke={accent} strokeWidth={1.2} opacity={0.2} />
      </g>

      {/* ── 次要细节 1: 散布小型水晶棱镜 ── */}
      {[
        { x: gridWidth - 3, y: gridHeight - 2, scale: 1 },
        { x: gridWidth - 2, y: gridHeight - 3, scale: 0.8 },
        { x: gridWidth - 2, y: gridHeight - 2, scale: 0.7 },
        { x: gridWidth - 4, y: 2, scale: 0.65 },
        { x: 1, y: gridHeight - 3, scale: 0.75 },
      ].map((pos, i) => {
        const s = worldToScreen(pos.x, pos.y)
        return (
          <g key={`prism-${i}`} transform={`translate(${s.x}, ${s.y}) scale(${pos.scale})`}>
            <polygon
              points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7"
              fill={accent}
              opacity={0.1}
            />
            <polygon
              points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7"
              fill="none"
              stroke={accent}
              strokeWidth={0.7}
              opacity={0.3}
            />
          </g>
        )
      })}

      {/* ── 次要细节 2: 冰晶雪花图案 ── */}
      {[
        { x: gridWidth / 2 + 3, y: 1.5 },
        { x: gridWidth - 1, y: gridHeight / 2 },
        { x: 1, y: gridHeight / 2 + 2 },
        { x: gridWidth / 2 - 2, y: gridHeight - 1 },
      ].map((pos, i) => {
        const s = worldToScreen(pos.x, pos.y)
        const size = 8 + i * 2
        return (
          <g key={`snowflake-${i}`} transform={`translate(${s.x}, ${s.y})`}>
            {/* 六臂雪花 */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180
              return (
                <line
                  key={`arm-${deg}`}
                  x1={0} y1={0}
                  x2={Math.cos(rad) * size} y2={Math.sin(rad) * size}
                  stroke={accent}
                  strokeWidth={0.5}
                  opacity={0.25}
                />
              )
            })}
            <circle cx={0} cy={0} r={1.5} fill={accent} opacity={0.2} />
          </g>
        )
      })}

      {/* ── 次要细节 3: 晶格网格段 -- 右上角区域 ── */}
      <g transform={`translate(${worldToScreen(gridWidth - 2, 2).x}, ${worldToScreen(gridWidth - 2, 2).y})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-v-${i}`}
            x1={i * 10 - 20}
            y1={-25}
            x2={i * 10 - 20}
            y2={25}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.18}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-h-${i}`}
            x1={-20}
            y1={i * 10 - 20}
            x2={20}
            y2={i * 10 - 20}
            stroke={accent}
            strokeWidth={0.4}
            opacity={0.18}
          />
        ))}
        {/* 对角线连接 */}
        <line x1={-20} y1={-25} x2={20} y2={25} stroke={accent} strokeWidth={0.3} opacity={0.12} />
        <line x1={20} y1={-25} x2={-20} y2={25} stroke={accent} strokeWidth={0.3} opacity={0.12} />
      </g>

      {/* ── 霜边细节 -- 上边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, 0).x}, ${worldToScreen(gridWidth / 2, 0).y - 18})`}>
        <path
          d="M-80,0 L-65,-10 L-50,-2 L-35,-9 L-20,0 L-5,-7 L10,0 L25,-10 L40,-3 L55,-8 L70,0 L80,-5"
          fill="none"
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.35}
        />
        {/* 霜边碎片 */}
        <polygon points="-55,-6 -50,-14 -45,-6" fill={accent} opacity={0.08} />
        <polygon points="15,-4 20,-12 25,-4" fill={accent} opacity={0.06} />
        <polygon points="60,-3 65,-10 68,-3" fill={accent} opacity={0.07} />
      </g>

      {/* ── 霜边细节 -- 下边界 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight).x}, ${worldToScreen(gridWidth / 2, gridHeight).y + 12})`}>
        <path
          d="M-70,0 L-55,8 L-40,2 L-25,7 L-10,0 L5,6 L20,0 L35,8 L50,3 L65,7"
          fill="none"
          stroke={accent}
          strokeWidth={0.6}
          opacity={0.25}
        />
      </g>

      {/* ── 霜边细节 -- 左边界 ── */}
      <g transform={`translate(${worldToScreen(0, gridHeight / 2).x - 15}, ${worldToScreen(0, gridHeight / 2).y})`}>
        <path
          d="M0,-50 L-6,-35 L0,-20 L-5,-5 L0,10 L-6,25 L0,40"
          fill="none"
          stroke={accent}
          strokeWidth={0.5}
          opacity={0.2}
        />
      </g>

      {/* ── 大型冰晶装饰 -- 底部中央 ── */}
      <g transform={`translate(${worldToScreen(gridWidth / 2, gridHeight - 2).x}, ${worldToScreen(gridWidth / 2, gridHeight - 2).y})`}>
        {/* 主尖晶体 */}
        <polygon points="0,-30 10,-8 -10,-8" fill={accent} opacity={0.13} />
        <polygon points="0,-30 10,-8 -10,-8" fill="none" stroke={accent} strokeWidth={0.8} opacity={0.3} />
        {/* 侧翼晶体 */}
        <polygon points="18,-22 25,-5 12,-5" fill={accent} opacity={0.09} />
        <polygon points="18,-22 25,-5 12,-5" fill="none" stroke={accent} strokeWidth={0.5} opacity={0.25} />
        <polygon points="-15,-20 -8,-5 -22,-5" fill={accent} opacity={0.1} />
        <polygon points="-15,-20 -8,-5 -22,-5" fill="none" stroke={accent} strokeWidth={0.5} opacity={0.25} />
        {/* 碎片 */}
        <polygon points="30,-12 34,-3 26,-3" fill={accent} opacity={0.06} />
        <polygon points="-28,-10 -24,-3 -32,-3" fill={accent} opacity={0.05} />
      </g>

      {/* ── 动画水晶 1: 脉冲发光 (左中) ── */}
      <g
        transform={`translate(${worldToScreen(1, gridHeight / 2 + 1).x}, ${worldToScreen(1, gridHeight / 2 + 1).y})`}
        style={{ animation: 'crystal-pulse-a 4s ease-in-out infinite' }}
      >
        <polygon
          points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8"
          fill={accent}
          fillOpacity={0.20}
          stroke={accent}
          strokeWidth={1}
          opacity={0.5}
        />
        <circle cx={0} cy={0} r={3} fill={accent} opacity={0.3} />
      </g>

      {/* ── 动画水晶 2: 脉冲发光 (右侧) ── */}
      <g
        transform={`translate(${worldToScreen(gridWidth - 1, gridHeight / 2 - 1).x}, ${worldToScreen(gridWidth - 1, gridHeight / 2 - 1).y})`}
        style={{ animation: 'crystal-pulse-b 4s ease-in-out infinite 1.5s' }}
      >
        <polygon
          points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6"
          fill={accent}
          fillOpacity={0.1}
          stroke={accent}
          strokeWidth={0.8}
          opacity={0.45}
        />
        <circle cx={0} cy={0} r={2} fill={accent} opacity={0.25} />
      </g>

      {/* ── 附加细节: 浮动小晶粒 ── */}
      {[
        { x: 4, y: 1, r: 1.5 },
        { x: gridWidth - 1, y: 3, r: 1.2 },
        { x: 3, y: gridHeight - 1, r: 1.8 },
        { x: gridWidth / 2, y: 2, r: 1.3 },
        { x: gridWidth / 2 + 2, y: gridHeight - 1, r: 1.0 },
        { x: gridWidth - 3, y: gridHeight / 2 + 3, r: 1.4 },
      ].map((dot, i) => {
        const s = worldToScreen(dot.x, dot.y)
        return (
          <circle
            key={`grain-${i}`}
            cx={s.x}
            cy={s.y}
            r={dot.r}
            fill={accent}
            opacity={0.15}
          />
        )
      })}
    </g>
  )
}
