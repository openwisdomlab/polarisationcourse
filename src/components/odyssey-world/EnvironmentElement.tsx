/**
 * EnvironmentElement.tsx -- 环境区域渲染组件
 *
 * 渲染环境介质区域为半透明菱形区域 + 折射率标签。
 * 点击打开环境属性弹窗。
 * 使用柔和呼吸动画暗示可交互状态。
 */

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { worldToScreen } from '@/lib/isometric'
import type { SceneElement } from '@/stores/odysseyWorldStore'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'

interface EnvironmentElementProps {
  element: SceneElement
}

/**
 * 环境区域组件
 *
 * 等距菱形区域，颜色反映介质类型 (玻璃=蓝, 水=青, 钻石=紫等)。
 * 显示折射率数值标签。点击打开属性弹窗。
 */
const EnvironmentElement = React.memo(function EnvironmentElement({
  element,
}: EnvironmentElementProps) {
  const screen = worldToScreen(element.worldX, element.worldY)
  const openPopup = useOdysseyWorldStore((s) => s.openEnvironmentPopup)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      openPopup(element.id)
    },
    [element.id, openPopup],
  )

  // 根据介质类型选择颜色
  const mediumType = (element.properties.mediumType as string) ?? 'glass'
  const refractiveIndex = (element.properties.refractiveIndex as number) ?? 1.5
  const color = MEDIUM_COLORS[mediumType] ?? '#88AACC'

  return (
    <motion.g
      transform={`translate(${screen.x}, ${screen.y})`}
      animate={{ opacity: [0.6, 0.8] }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 3,
        ease: 'easeInOut',
      }}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* 介质区域菱形 */}
      <polygon
        points="0,-20 32,0 0,20 -32,0"
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.5}
      />

      {/* 内部图案: 折射光线暗示 */}
      <line
        x1={-12} y1={-3} x2={0} y2={3}
        stroke={color} strokeWidth={0.8} strokeOpacity={0.4}
      />
      <line
        x1={0} y1={3} x2={14} y2={-1}
        stroke={color} strokeWidth={0.8} strokeOpacity={0.4}
        strokeDasharray="3 2"
      />

      {/* 折射率标签 */}
      <text
        x={0}
        y={-6}
        textAnchor="middle"
        fontSize={8}
        fill={color}
        fontFamily="monospace"
        opacity={0.7}
      >
        n={refractiveIndex.toFixed(2)}
      </text>

      {/* 介质类型小标签 */}
      <text
        x={0}
        y={12}
        textAnchor="middle"
        fontSize={6}
        fill={color}
        opacity={0.5}
      >
        {mediumType}
      </text>
    </motion.g>
  )
})

/** 介质类型到颜色映射 */
const MEDIUM_COLORS: Record<string, string> = {
  vacuum: '#AAAAAA',
  air: '#CCCCDD',
  water: '#44AACC',
  glass: '#6688BB',
  diamond: '#AA88DD',
  calcite: '#88AA88',
  quartz: '#BB9988',
}

export { EnvironmentElement }
