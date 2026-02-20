/**
 * RegionDecorations.tsx -- 区域装饰懒加载分发器
 *
 * 使用 React.lazy() 动态导入每个区域的装饰 SVG 组件，
 * 实现按需加载，不增加初始包大小。
 *
 * 功能:
 * - 根据 regionId 选择对应的装饰组件
 * - Suspense 包裹，加载期间显示简化骨架
 * - preloadAdjacentRegions: 进入新区域时预加载相邻区域装饰
 */

import React, { Suspense } from 'react'
import type { RegionTheme } from './regionRegistry'
import { getRegionDefinition } from './regionRegistry'
import { worldToScreen, TILE_WIDTH_HALF, TILE_HEIGHT_HALF } from '@/lib/isometric'

// ── 懒加载装饰组件 ────────────────────────────────────────────────────

const decorationComponents: Record<string, React.LazyExoticComponent<React.ComponentType<DecorationProps>>> = {
  'crystal-lab': React.lazy(() => import('./CrystalLabDecorations')),
  'refraction-bench': React.lazy(() => import('./RefractionBenchDecorations')),
  'scattering-chamber': React.lazy(() => import('./ScatteringChamberDecorations')),
  'wave-platform': React.lazy(() => import('./WavePlatformDecorations')),
  'interface-lab': React.lazy(() => import('./InterfaceLabDecorations')),
  'measurement-studio': React.lazy(() => import('./MeasurementStudioDecorations')),
}

/** 装饰组件通用 Props */
interface DecorationProps {
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

interface RegionDecorationsLoaderProps {
  regionId: string
  gridWidth: number
  gridHeight: number
  theme: RegionTheme
}

/**
 * 骨架占位 -- 加载期间显示简化平台轮廓
 */
function DecorationSkeleton({ gridWidth, gridHeight }: { gridWidth: number; gridHeight: number }) {
  // 仅在四角显示淡色菱形占位
  const corners = [
    { x: 1, y: 1 },
    { x: gridWidth - 2, y: 1 },
    { x: 1, y: gridHeight - 2 },
    { x: gridWidth - 2, y: gridHeight - 2 },
  ]

  return (
    <g opacity={0.08}>
      {corners.map((pos) => {
        const s = worldToScreen(pos.x, pos.y)
        return (
          <polygon
            key={`skeleton-${pos.x}-${pos.y}`}
            points={`
              ${s.x},${s.y - TILE_HEIGHT_HALF}
              ${s.x + TILE_WIDTH_HALF},${s.y}
              ${s.x},${s.y + TILE_HEIGHT_HALF}
              ${s.x - TILE_WIDTH_HALF},${s.y}
            `}
            fill="#C0C0C0"
          />
        )
      })}
    </g>
  )
}

/**
 * 区域装饰懒加载器
 *
 * 根据 regionId 渲染对应的装饰组件，
 * 包裹在 Suspense 中提供加载骨架。
 */
export function RegionDecorationsLoader({
  regionId,
  gridWidth,
  gridHeight,
  theme,
}: RegionDecorationsLoaderProps) {
  const LazyComponent = decorationComponents[regionId]

  if (!LazyComponent) return null

  return (
    <Suspense fallback={<DecorationSkeleton gridWidth={gridWidth} gridHeight={gridHeight} />}>
      <LazyComponent gridWidth={gridWidth} gridHeight={gridHeight} theme={theme} />
    </Suspense>
  )
}

/**
 * 预加载相邻区域的装饰组件
 *
 * 在进入新区域时调用，触发 Vite 动态导入，
 * 使相邻区域的装饰在过渡时已在缓存中。
 *
 * @param regionId 当前进入的区域 ID
 */
export function preloadAdjacentRegions(regionId: string): void {
  const region = getRegionDefinition(regionId)
  if (!region) return

  for (const boundary of region.boundaries) {
    const targetId = boundary.targetRegionId
    // 触发动态导入 (Vite 会创建单独的 chunk)
    // 导入结果被忽略 -- React.lazy 会使用缓存的 module
    switch (targetId) {
      case 'crystal-lab':
        import('./CrystalLabDecorations')
        break
      case 'refraction-bench':
        import('./RefractionBenchDecorations')
        break
      case 'scattering-chamber':
        import('./ScatteringChamberDecorations')
        break
      case 'wave-platform':
        import('./WavePlatformDecorations')
        break
      case 'interface-lab':
        import('./InterfaceLabDecorations')
        break
      case 'measurement-studio':
        import('./MeasurementStudioDecorations')
        break
    }
  }
}
