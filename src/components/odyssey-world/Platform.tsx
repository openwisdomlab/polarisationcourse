/**
 * Platform.tsx -- 等距平台渲染组件
 *
 * 渲染单个等距菱形平台 (isometric diamond)。
 * Z > 0 的平台添加侧面 (可见的"墙壁")，营造深度错觉。
 * 使用 React.memo 避免不必要的重渲染。
 *
 * Phase 3: 支持区域主题色覆盖 (platformFill, platformStroke)。
 * Phase 5: 每区域地板纹理图案 (SVG <pattern>, opacity 0.05-0.1)。
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
 * 区域地板纹理 pattern ID 映射
 * 每个区域有独特的微妙 SVG 纹理叠加在平台上
 */
const FLOOR_PATTERN_IDS: Record<string, string> = {
  'crystal-lab': 'floor-crystal-lattice',
  'wave-platform': 'floor-wave-ripple',
  'refraction-bench': 'floor-glass-layers',
  'scattering-chamber': 'floor-particle-dots',
  'interface-lab': 'floor-strata-layers',
  'measurement-studio': 'floor-precision-grid',
}

/**
 * FloorPatternDefs -- 区域地板纹理 SVG pattern 定义
 *
 * 渲染在 Platform 内部，利用 <defs> + <pattern>。
 * 每个纹理非常微妙 (内部 opacity 0.3-0.5)，外部通过 polygon opacity 0.06-0.08 控制。
 */
function FloorPatternDefs({ accent }: { accent: string }) {
  return (
    <defs>
      {/* 水晶晶格纹理 -- Crystal Lab */}
      <pattern id="floor-crystal-lattice" x={0} y={0} width={16} height={14} patternUnits="userSpaceOnUse">
        <polygon points="8,0 16,4 16,10 8,14 0,10 0,4" fill="none" stroke={accent} strokeWidth={0.3} opacity={0.4} />
      </pattern>

      {/* 波纹纹理 -- Wave Platform */}
      <pattern id="floor-wave-ripple" x={0} y={0} width={24} height={12} patternUnits="userSpaceOnUse">
        <path d="M0,6 Q6,2 12,6 Q18,10 24,6" fill="none" stroke={accent} strokeWidth={0.3} opacity={0.35} />
      </pattern>

      {/* 玻璃层纹理 -- Refraction Bench */}
      <pattern id="floor-glass-layers" x={0} y={0} width={20} height={8} patternUnits="userSpaceOnUse">
        <line x1={0} y1={4} x2={20} y2={4} stroke={accent} strokeWidth={0.25} opacity={0.35} />
        <line x1={2} y1={7} x2={18} y2={7} stroke={accent} strokeWidth={0.15} opacity={0.2} />
      </pattern>

      {/* 粒子点纹理 -- Scattering Chamber */}
      <pattern id="floor-particle-dots" x={0} y={0} width={12} height={12} patternUnits="userSpaceOnUse">
        <circle cx={3} cy={3} r={0.5} fill={accent} opacity={0.35} />
        <circle cx={9} cy={9} r={0.4} fill={accent} opacity={0.25} />
        <circle cx={7} cy={2} r={0.3} fill={accent} opacity={0.2} />
      </pattern>

      {/* 分层纹理 -- Interface Lab */}
      <pattern id="floor-strata-layers" x={0} y={0} width={30} height={10} patternUnits="userSpaceOnUse">
        <line x1={0} y1={3} x2={30} y2={3} stroke={accent} strokeWidth={0.2} opacity={0.3} />
        <line x1={0} y1={7} x2={30} y2={7} stroke={accent} strokeWidth={0.3} opacity={0.4} />
      </pattern>

      {/* 精密网格纹理 -- Measurement Studio */}
      <pattern id="floor-precision-grid" x={0} y={0} width={10} height={10} patternUnits="userSpaceOnUse">
        <rect x={0} y={0} width={10} height={10} fill="none" stroke={accent} strokeWidth={0.2} opacity={0.3} />
      </pattern>
    </defs>
  )
}

/**
 * 等距平台
 *
 * 菱形顶面 + 可选侧面 (Z > 0)。
 * 地面层 (Z=0): 暖白色 (#F0EDE6)，细微边框。
 * 抬升层 (Z=1): 更亮 (#F5F2EC)，下方柔和阴影。
 * Phase 5: 区域地板纹理叠加 (微妙 SVG pattern fill)。
 */
const Platform = React.memo(function Platform({ element }: PlatformProps) {
  const { worldX, worldY, worldZ } = element
  const screen = worldToScreen(worldX, worldY)

  // 拖拽模式检测 -- 高亮可放置平台
  const isDragging = useOdysseyWorldStore((s) => s.interactionMode === 'drag')

  // 区域主题色覆盖
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const regionDef = getRegionDefinition(activeRegionId)
  const themeFill = regionDef?.theme.colorPalette.platformFill
  const themeStroke = regionDef?.theme.colorPalette.platformStroke
  const themeAccent = regionDef?.theme.colorPalette.accentColor ?? '#888'

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
  const topStrokeOpacity = isGlass ? 0.6 : 0.7

  // 侧面高度 (Z > 0 时显示)
  const sideHeight = worldZ * 24

  // 地板纹理 pattern ID
  const floorPatternId = FLOOR_PATTERN_IDS[activeRegionId]

  return (
    <g transform={`translate(${tx}, ${ty})`}>
      {/* 地板纹理 pattern 定义 (仅首次渲染生效，SVG defs 全局去重) */}
      <FloorPatternDefs accent={themeAccent} />

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

      {/* 区域地板纹理叠加 (非常微妙, 不与光束竞争) */}
      {floorPatternId && !isGlass && !isElevated && (
        <polygon
          points={topPoints}
          fill={`url(#${floorPatternId})`}
          opacity={0.12}
        />
      )}

      {/* 拖拽时高亮可放置区域 -- 蓝色脉冲边框 */}
      {isDragging && !isElevated && element.properties.walkable && (
        <polygon
          points={topPoints}
          fill={themeAccent}
          fillOpacity={0.06}
          stroke={themeAccent}
          strokeWidth={1.2}
          strokeOpacity={0.25}
        >
          <animate
            attributeName="stroke-opacity"
            values="0.15;0.35;0.15"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </polygon>
      )}

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
          opacity={0.15}
        />
      )}
    </g>
  )
})

export { Platform }
