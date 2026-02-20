/**
 * Platform.tsx -- 等距平台渲染组件
 *
 * 渲染单个等距菱形平台 (isometric diamond)。
 * Z > 0 的平台添加侧面 (可见的"墙壁")，营造深度错觉。
 * 使用 React.memo 避免不必要的重渲染。
 *
 * Phase 3: 支持区域主题色覆盖 (platformFill, platformStroke)。
 */

import React from 'react'
import { worldToScreen, TILE_WIDTH_HALF, TILE_HEIGHT_HALF } from '@/lib/isometric'
import type { SceneElement } from '@/stores/odysseyWorldStore'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from './regions/regionRegistry'

interface PlatformProps {
  element: SceneElement
}

/**
 * 等距平台
 *
 * 菱形顶面 + 可选侧面 (Z > 0)。
 * 地面层 (Z=0): 暖白色 (#F0EDE6)，细微边框。
 * 抬升层 (Z=1): 更亮 (#F5F2EC)，下方柔和阴影。
 */
const Platform = React.memo(function Platform({ element }: PlatformProps) {
  const { worldX, worldY, worldZ } = element
  const screen = worldToScreen(worldX, worldY)

  // 区域主题色覆盖
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const regionDef = getRegionDefinition(activeRegionId)
  const themeFill = regionDef?.theme.colorPalette.platformFill
  const themeStroke = regionDef?.theme.colorPalette.platformStroke

  // Z 轴高度偏移 (每层抬升 24 像素)
  const zOffset = worldZ * 24
  const tx = screen.x
  const ty = screen.y - zOffset

  // 等距菱形顶面的四个顶点 (相对于中心点)
  const topPoints = [
    `${0},${-TILE_HEIGHT_HALF}`,     // 上
    `${TILE_WIDTH_HALF},${0}`,       // 右
    `${0},${TILE_HEIGHT_HALF}`,      // 下
    `${-TILE_WIDTH_HALF},${0}`,      // 左
  ].join(' ')

  const isElevated = worldZ > 0
  const isGlass = element.properties.material === 'glass'

  // 颜色方案 -- 区域主题色优先，玻璃材质特殊处理
  const defaultFill = isElevated ? '#F5F2EC' : '#F0EDE6'
  const defaultStroke = '#E0DBD3'
  const topFill = isGlass ? '#E8EEF4' : (themeFill ?? defaultFill)
  const topStroke = isGlass ? '#C8D4E0' : (themeStroke ?? defaultStroke)
  const topStrokeOpacity = isGlass ? 0.6 : 0.4

  // 侧面高度 (Z > 0 时显示)
  const sideHeight = worldZ * 24

  return (
    <g transform={`translate(${tx}, ${ty})`}>
      {/* 侧面 -- Z > 0 的平台显示 "墙壁" */}
      {isElevated && (
        <>
          {/* 右侧面 */}
          <polygon
            points={`
              ${TILE_WIDTH_HALF},0
              ${0},${TILE_HEIGHT_HALF}
              ${0},${TILE_HEIGHT_HALF + sideHeight}
              ${TILE_WIDTH_HALF},${sideHeight}
            `}
            fill={isGlass ? '#BCC8D6' : '#E0DBD3'}
            stroke={topStroke}
            strokeWidth={0.5}
            strokeOpacity={0.3}
          />
          {/* 左侧面 */}
          <polygon
            points={`
              ${-TILE_WIDTH_HALF},0
              ${0},${TILE_HEIGHT_HALF}
              ${0},${TILE_HEIGHT_HALF + sideHeight}
              ${-TILE_WIDTH_HALF},${sideHeight}
            `}
            fill={isGlass ? '#A8B8C8' : '#D4CFC6'}
            stroke={topStroke}
            strokeWidth={0.5}
            strokeOpacity={0.3}
          />
        </>
      )}

      {/* 顶面 -- 等距菱形 */}
      <polygon
        points={topPoints}
        fill={topFill}
        stroke={topStroke}
        strokeWidth={0.8}
        strokeOpacity={topStrokeOpacity}
      />

      {/* 玻璃材质的微妙高光 */}
      {isGlass && (
        <polygon
          points={`
            ${0},${-TILE_HEIGHT_HALF + 4}
            ${TILE_WIDTH_HALF - 8},${0}
            ${0},${TILE_HEIGHT_HALF - 12}
            ${-TILE_WIDTH_HALF + 20},${-4}
          `}
          fill="white"
          opacity={0.15}
        />
      )}

      {/* 抬升平台底部的柔和阴影 */}
      {isElevated && (
        <ellipse
          cx={0}
          cy={TILE_HEIGHT_HALF + sideHeight + 4}
          rx={TILE_WIDTH_HALF * 0.6}
          ry={6}
          fill="black"
          opacity={0.06}
        />
      )}
    </g>
  )
})

export { Platform }
