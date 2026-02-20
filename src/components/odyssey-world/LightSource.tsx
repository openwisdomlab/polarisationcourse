/**
 * LightSource.tsx -- 光源渲染组件
 *
 * 渲染光源为一个明亮、发光的圆形/星形 SVG 图案，
 * 带有柔和光晕。使用 Framer Motion 的脉冲动画
 * (缩放振荡 0.95-1.05) 暗示活跃状态。
 */

import React from 'react'
import { motion } from 'framer-motion'
import { worldToScreen } from '@/lib/isometric'
import type { SceneElement } from '@/stores/odysseyWorldStore'

interface LightSourceProps {
  element: SceneElement
}

/**
 * 光源组件
 *
 * 外层光晕 (大半透明圆) + 内核 (明亮圆形) + 星形高光。
 * 整体施加柔和脉冲动画。
 */
const LightSource = React.memo(function LightSource({ element }: LightSourceProps) {
  const screen = worldToScreen(element.worldX, element.worldY)

  return (
    <motion.g
      transform={`translate(${screen.x}, ${screen.y})`}
      animate={{ scale: [0.95, 1.05] }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 2,
        ease: 'easeInOut',
      }}
    >
      {/* 最外层光晕 -- 大范围柔和发光 */}
      <circle
        cx={0}
        cy={0}
        r={28}
        fill="url(#light-source-halo)"
        opacity={0.25}
      />

      {/* 中层光晕 */}
      <circle
        cx={0}
        cy={0}
        r={16}
        fill="url(#light-source-glow)"
        opacity={0.5}
      />

      {/* 内核 -- 明亮发光体 */}
      <circle
        cx={0}
        cy={0}
        r={8}
        fill="#FFF8E0"
        stroke="#FFD700"
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />

      {/* 内部高光 */}
      <circle
        cx={-2}
        cy={-2}
        r={3}
        fill="white"
        opacity={0.7}
      />

      {/* 星形射线 (四方向) */}
      {[0, 90, 45, 135].map((angle) => (
        <line
          key={angle}
          x1={0}
          y1={0}
          x2={Math.cos((angle * Math.PI) / 180) * 14}
          y2={Math.sin((angle * Math.PI) / 180) * 14}
          stroke="#FFD700"
          strokeWidth={0.8}
          strokeOpacity={0.3}
          strokeLinecap="round"
        />
      ))}

      {/* 底座 -- 小型装置造型 */}
      <rect x={-6} y={10} width={12} height={5} rx={2} fill="#C4BAB0" opacity={0.6} />
      <rect x={-4} y={7} width={8} height={4} rx={1} fill="#D4CFC6" opacity={0.5} />
    </motion.g>
  )
})

export { LightSource }
