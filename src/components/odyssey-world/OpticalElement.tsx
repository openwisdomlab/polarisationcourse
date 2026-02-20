/**
 * OpticalElement.tsx -- 光学元件渲染组件
 *
 * 渲染预置的光学元件 (偏振片、波片) 为 SVG 图案。
 * Phase 1 不支持交互 (拖拽/旋转在 Phase 2)，
 * 但有轻微摇摆动画暗示可交互性。
 */

import React from 'react'
import { motion } from 'framer-motion'
import { worldToScreen } from '@/lib/isometric'
import type { SceneElement } from '@/stores/odysseyWorldStore'

interface OpticalElementProps {
  element: SceneElement
}

/**
 * 偏振片造型 -- 竖直矩形 + 平行线纹 (传输轴方向)
 */
function PolarizerShape() {
  return (
    <g>
      {/* 主体框架 */}
      <rect
        x={-10}
        y={-18}
        width={20}
        height={28}
        rx={2}
        fill="#E8EDF4"
        stroke="#8898B0"
        strokeWidth={1}
        opacity={0.85}
      />
      {/* 平行线纹 (表示传输轴方向) */}
      {[-12, -8, -4, 0, 4, 8].map((offset) => (
        <line
          key={offset}
          x1={-6}
          y1={offset}
          x2={6}
          y2={offset}
          stroke="#6880A0"
          strokeWidth={0.6}
          opacity={0.4}
        />
      ))}
      {/* 顶部标签 */}
      <circle cx={0} cy={-14} r={2.5} fill="#6880A0" opacity={0.3} />
      {/* 底座 */}
      <rect x={-8} y={10} width={16} height={4} rx={1} fill="#C4C0B8" opacity={0.5} />
      <rect x={-4} y={14} width={8} height={3} rx={1} fill="#B8B4AC" opacity={0.4} />
    </g>
  )
}

/**
 * 波片造型 -- 矩形 + 对角线阴影纹 (双折射)
 */
function WaveplateShape() {
  return (
    <g>
      {/* 主体框架 */}
      <rect
        x={-10}
        y={-16}
        width={20}
        height={24}
        rx={2}
        fill="#F0E8F4"
        stroke="#9878B0"
        strokeWidth={1}
        opacity={0.85}
      />
      {/* 对角线阴影纹 (表示双折射轴) */}
      {[-10, -6, -2, 2, 6].map((offset) => (
        <line
          key={offset}
          x1={-6}
          y1={offset - 4}
          x2={6}
          y2={offset + 4}
          stroke="#8060A0"
          strokeWidth={0.6}
          opacity={0.35}
        />
      ))}
      {/* 快轴标记 (箭头) */}
      <line x1={-5} y1={-12} x2={5} y2={-12} stroke="#8060A0" strokeWidth={0.8} opacity={0.5} />
      <polyline points="3,-14 5,-12 3,-10" fill="none" stroke="#8060A0" strokeWidth={0.8} opacity={0.5} />
      {/* 底座 */}
      <rect x={-8} y={8} width={16} height={4} rx={1} fill="#C4C0B8" opacity={0.5} />
      <rect x={-4} y={12} width={8} height={3} rx={1} fill="#B8B4AC" opacity={0.4} />
    </g>
  )
}

/**
 * 光学元件组件
 *
 * 根据元素类型 (polarizer/waveplate) 渲染对应 SVG 造型。
 * 轻微摇摆动画 (+/- 2 度, 4 秒周期) 暗示未来可交互。
 */
const OpticalElement = React.memo(function OpticalElement({ element }: OpticalElementProps) {
  const screen = worldToScreen(element.worldX, element.worldY)

  let shape: React.ReactNode
  switch (element.type) {
    case 'polarizer':
      shape = <PolarizerShape />
      break
    case 'waveplate':
      shape = <WaveplateShape />
      break
    default:
      shape = <rect x={-8} y={-8} width={16} height={16} fill="#CCC" opacity={0.5} />
  }

  return (
    <motion.g
      transform={`translate(${screen.x}, ${screen.y})`}
      animate={{ rotate: [element.rotation - 2, element.rotation + 2] }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 4,
        ease: 'easeInOut',
      }}
    >
      {shape}
    </motion.g>
  )
})

export { OpticalElement }
