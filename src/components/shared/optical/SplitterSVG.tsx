/**
 * SplitterSVG - 双折射分光器(方解石晶体)SVG组件
 * 将入射光分为o光(0°偏振)和e光(90°偏振)
 *
 * 科学说明：
 * - 方解石(CaCO₃)是典型的负单轴晶体，具有显著的双折射效应
 * - o光(寻常光)：偏振方向垂直于主截面，遵循斯涅尔定律，直行不偏折
 *   折射率 no = 1.6584 (对于589nm钠光)
 * - e光(非常光)：偏振方向在主截面内，不遵循斯涅尔定律，发生偏折
 *   折射率 ne = 1.4864 (对于589nm钠光)
 * - 双折射率 Δn = no - ne = 0.172
 */

import type { BaseSVGProps } from './types'

export interface SplitterSVGProps extends BaseSVGProps {
  showLabels?: boolean
  size?: number
}

export function SplitterSVG({
  x,
  y,
  isDark = true,
  showLabels = true,
  size = 1,
}: SplitterSVGProps) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* 菱形晶体 - 模拟方解石的菱面体形状 */}
      <polygon
        points="0,-4 4,0 0,4 -4,0"
        fill={isDark ? '#0e7490' : '#06b6d4'}
        opacity="0.7"
        stroke="#22d3ee"
        strokeWidth="0.4"
      />
      {/* o光方向指示 (红色, 继续直行) - 寻常光遵循斯涅尔定律 */}
      <line x1="1" y1="0" x2="5" y2="0" stroke="#ff4444" strokeWidth="0.4" opacity="0.8" />
      {/* e光方向指示 (绿色, 向上偏折) - 非常光偏离入射方向 */}
      <line x1="0" y1="-1" x2="0" y2="-5" stroke="#44ff44" strokeWidth="0.4" opacity="0.8" />
      {/* 光轴方向指示线 - 晶体光轴决定o光和e光的分离方向 */}
      <line x1="-2" y1="-2" x2="2" y2="2" stroke="#22d3ee" strokeWidth="0.2" opacity="0.5" />
      <line x1="-2" y1="2" x2="2" y2="-2" stroke="#22d3ee" strokeWidth="0.2" opacity="0.5" />
      {/* o光和e光标签 */}
      {showLabels && (
        <>
          <text x="5.5" y="0.5" textAnchor="start" fill="#ff4444" fontSize="1.5">o</text>
          <text x="0.5" y="-5" textAnchor="start" fill="#44ff44" fontSize="1.5">e</text>
          <text y="7" textAnchor="middle" fill="#22d3ee" fontSize="2">
            PBS
          </text>
        </>
      )}
    </g>
  )
}
