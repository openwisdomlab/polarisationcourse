/**
 * WorldMap.tsx -- 星图风格世界地图叠加层
 *
 * HTML 叠加层 (非 SVG 场景内) 显示:
 * - 6 个区域形状 (圆角矩形) 按空间布局排列
 * - 已访问: 强调色填充; 未访问: 灰色轮廓
 * - 当前区域: 脉冲边框高亮
 * - 边界连接线 (实线/虚线)
 * - 发现连接线 (金色虚线 = 星图)
 * - 大发现指示器 (星形)
 * - 每个区域的发现进度 (N/M)
 * - 点击已访问区域快速旅行
 * - Escape 或点击背景关闭
 *
 * 使用 Framer Motion AnimatePresence 淡入/淡出。
 * 保持轻量: 无实际场景元素 (pitfall 5)。
 */

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import {
  REGION_DEFINITIONS,
  META_DISCOVERIES,
  type RegionDefinition,
} from './regions/regionRegistry'
import type { ActiveConnection } from './hooks/useDiscoveryConnections'

// ── 区域布局配置 (2x3 网格) ──────────────────────────────────────────

interface RegionLayout {
  id: string
  col: number
  row: number
  label: string
}

const REGION_LAYOUT: RegionLayout[] = [
  { id: 'crystal-lab', col: 0, row: 0, label: 'Crystal Lab' },
  { id: 'wave-platform', col: 1, row: 0, label: 'Wave Platform' },
  { id: 'refraction-bench', col: 0, row: 1, label: 'Refraction Bench' },
  { id: 'scattering-chamber', col: 1, row: 1, label: 'Scattering Chamber' },
  { id: 'interface-lab', col: 0, row: 2, label: 'Interface Lab' },
  { id: 'measurement-studio', col: 1, row: 2, label: 'Measurement Studio' },
]

// ── 地图尺寸常量 ──────────────────────────────────────────────────────

const CELL_WIDTH = 180
const CELL_HEIGHT = 100
const CELL_GAP_X = 40
const CELL_GAP_Y = 30
const MAP_PADDING = 40
const REGION_WIDTH = CELL_WIDTH
const REGION_HEIGHT = CELL_HEIGHT - 20

/** 计算区域形状在地图 SVG 中的中心坐标 */
function getRegionCenter(col: number, row: number): { cx: number; cy: number } {
  return {
    cx: MAP_PADDING + col * (CELL_WIDTH + CELL_GAP_X) + CELL_WIDTH / 2,
    cy: MAP_PADDING + row * (CELL_HEIGHT + CELL_GAP_Y) + CELL_HEIGHT / 2,
  }
}

// ── SVG 内部地图宽高 ──────────────────────────────────────────────────
const SVG_WIDTH = MAP_PADDING * 2 + 2 * CELL_WIDTH + CELL_GAP_X
const SVG_HEIGHT = MAP_PADDING * 2 + 3 * CELL_HEIGHT + 2 * CELL_GAP_Y

// ── 单个区域形状 ──────────────────────────────────────────────────────

interface RegionShapeProps {
  layout: RegionLayout
  regionDef: RegionDefinition | undefined
  isVisited: boolean
  isActive: boolean
  discoveryCount: number
  totalDiscoveries: number
  onFastTravel: (regionId: string) => void
}

const RegionShape = React.memo(function RegionShape({
  layout,
  regionDef,
  isVisited,
  isActive,
  discoveryCount,
  totalDiscoveries,
  onFastTravel,
}: RegionShapeProps) {
  const { cx, cy } = getRegionCenter(layout.col, layout.row)
  const accentColor = regionDef?.theme.colorPalette.accentColor ?? '#888'

  const handleClick = () => {
    if (isVisited) {
      onFastTravel(layout.id)
    }
  }

  return (
    <g
      onClick={handleClick}
      style={{ cursor: isVisited ? 'pointer' : 'default' }}
    >
      {/* 区域形状 (圆角矩形) */}
      <rect
        x={cx - REGION_WIDTH / 2}
        y={cy - REGION_HEIGHT / 2}
        width={REGION_WIDTH}
        height={REGION_HEIGHT}
        rx={8}
        fill={isVisited ? accentColor : '#555'}
        fillOpacity={isActive ? 0.8 : isVisited ? 0.5 : 0.15}
        stroke={isActive ? accentColor : isVisited ? accentColor : '#666'}
        strokeWidth={isActive ? 2 : 1}
        strokeOpacity={isActive ? 0.9 : isVisited ? 0.6 : 0.3}
      >
        {/* 当前区域脉冲边框 */}
        {isActive && (
          <animate
            attributeName="stroke-opacity"
            values="0.9;0.4;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </rect>

      {/* 区域名称 */}
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isVisited ? '#fff' : '#999'}
        fontSize={11}
        fontWeight={isActive ? 600 : 400}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {layout.label}
      </text>

      {/* 发现进度 */}
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isVisited ? 'rgba(255,255,255,0.6)' : 'rgba(153,153,153,0.4)'}
        fontSize={9}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {discoveryCount}/{totalDiscoveries} discoveries
      </text>
    </g>
  )
})

// ── 边界连接线 ──────────────────────────────────────────────────────

function BoundaryLines() {
  const lines: React.ReactNode[] = []

  for (const [_regionId, regionDef] of REGION_DEFINITIONS) {
    for (const boundary of regionDef.boundaries) {
      // 避免重复渲染 (只从 ID 较小的区域渲染)
      if (regionDef.id > boundary.targetRegionId) continue

      const fromLayout = REGION_LAYOUT.find((r) => r.id === regionDef.id)
      const toLayout = REGION_LAYOUT.find((r) => r.id === boundary.targetRegionId)
      if (!fromLayout || !toLayout) continue

      const from = getRegionCenter(fromLayout.col, fromLayout.row)
      const to = getRegionCenter(toLayout.col, toLayout.row)

      const isDotted = boundary.type === 'soft'

      lines.push(
        <line
          key={`boundary-${regionDef.id}-${boundary.targetRegionId}`}
          x1={from.cx}
          y1={from.cy}
          x2={to.cx}
          y2={to.cy}
          stroke="#555"
          strokeWidth={1}
          strokeDasharray={isDotted ? '4,6' : undefined}
          opacity={0.3}
        />,
      )
    }
  }

  return <>{lines}</>
}

// ── 发现连接线 (星图) ──────────────────────────────────────────────

interface ConstellationLinesProps {
  connections: ActiveConnection[]
}

function ConstellationLines({ connections }: ConstellationLinesProps) {
  // 去重: 同一对区域间只画一条连线
  const uniquePairs = useMemo(() => {
    const seen = new Set<string>()
    const unique: { fromRegionId: string; toRegionId: string; tag?: string }[] = []

    for (const conn of connections) {
      const key = [conn.fromRegionId, conn.toRegionId].sort().join('|')
      if (!seen.has(key)) {
        seen.add(key)
        unique.push({
          fromRegionId: conn.fromRegionId,
          toRegionId: conn.toRegionId,
          tag: conn.connectionTag,
        })
      }
    }

    return unique
  }, [connections])

  return (
    <>
      {uniquePairs.map((pair) => {
        const fromLayout = REGION_LAYOUT.find((r) => r.id === pair.fromRegionId)
        const toLayout = REGION_LAYOUT.find((r) => r.id === pair.toRegionId)
        if (!fromLayout || !toLayout) return null

        const from = getRegionCenter(fromLayout.col, fromLayout.row)
        const to = getRegionCenter(toLayout.col, toLayout.row)

        // 微小偏移避免与边界线重叠
        const offsetX = 3
        const offsetY = 3

        return (
          <line
            key={`constellation-${pair.fromRegionId}-${pair.toRegionId}`}
            x1={from.cx + offsetX}
            y1={from.cy + offsetY}
            x2={to.cx + offsetX}
            y2={to.cy + offsetY}
            stroke="#D4AF37"
            strokeWidth={1.5}
            strokeDasharray="3,6"
            opacity={0.5}
          >
            <title>{pair.tag ?? 'Discovery connection'}</title>
          </line>
        )
      })}
    </>
  )
}

// ── 大发现指示器 ──────────────────────────────────────────────────

interface MetaDiscoveryIndicatorsProps {
  achievedMeta: string[]
}

function MetaDiscoveryIndicators({ achievedMeta }: MetaDiscoveryIndicatorsProps) {
  return (
    <>
      {META_DISCOVERIES.map((meta) => {
        const isAchieved = achievedMeta.includes(meta.id)
        if (!isAchieved) return null

        // 星形指示器位于涉及的区域中间
        const regionLayouts = meta.requiredDiscoveries
          .map((rd) => REGION_LAYOUT.find((r) => r.id === rd.regionId))
          .filter(Boolean) as RegionLayout[]

        if (regionLayouts.length === 0) return null

        // 计算中心点
        const avgCx = regionLayouts.reduce((sum, r) => sum + getRegionCenter(r.col, r.row).cx, 0) / regionLayouts.length
        const avgCy = regionLayouts.reduce((sum, r) => sum + getRegionCenter(r.col, r.row).cy, 0) / regionLayouts.length

        return (
          <g key={meta.id}>
            {/* 星形光晕 */}
            <circle cx={avgCx} cy={avgCy} r={8} fill="#FFD700" opacity={0.3} />
            {/* 星形中心 */}
            <text
              x={avgCx}
              y={avgCy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFD700"
              fontSize={12}
              style={{ pointerEvents: 'none' }}
            >
              *
            </text>
            <title>{meta.name}</title>
          </g>
        )
      })}
    </>
  )
}

// ── 主组件 ──────────────────────────────────────────────────────────

interface WorldMapProps {
  isOpen: boolean
  onClose: () => void
  onFastTravel: (regionId: string) => void
  allConnections: ActiveConnection[]
  metaDiscoveries: string[]
}

export const WorldMap = React.memo(function WorldMap({
  isOpen,
  onClose,
  onFastTravel,
  allConnections,
  metaDiscoveries,
}: WorldMapProps) {
  const visitedRegions = useOdysseyWorldStore((s) => s.visitedRegions)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)

  // 计算每个区域的发现进度
  const regionProgress = useMemo(() => {
    const progress = new Map<string, { count: number; total: number }>()

    for (const [regionId, regionDef] of REGION_DEFINITIONS) {
      const total = regionDef.discoveries.length
      let count = 0
      for (const disc of regionDef.discoveries) {
        if (achievedDiscoveries.has(disc.id)) {
          count++
        }
      }
      progress.set(regionId, { count, total })
    }

    return progress
  }, [achievedDiscoveries])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* 半透明背景 (点击关闭) */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 地图面板 */}
          <motion.div
            className={cn(
              'relative z-10 rounded-2xl',
              'bg-gray-900/90 backdrop-blur-md',
              'border border-white/10',
              'shadow-2xl',
              'p-6',
            )}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {/* 标题栏 */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-light tracking-wider text-gray-300">
                OPTICAL WORLD
              </h3>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                onClick={onClose}
                aria-label="Close map"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* SVG 地图 */}
            <svg
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            >
              {/* 边界连接线 (底层) */}
              <BoundaryLines />

              {/* 发现连接线 -- 星图 */}
              <ConstellationLines connections={allConnections} />

              {/* 大发现指示器 */}
              <MetaDiscoveryIndicators achievedMeta={metaDiscoveries} />

              {/* 区域形状 */}
              {REGION_LAYOUT.map((layout) => {
                const regionDef = REGION_DEFINITIONS.get(layout.id)
                const progress = regionProgress.get(layout.id) ?? { count: 0, total: 0 }

                return (
                  <RegionShape
                    key={layout.id}
                    layout={layout}
                    regionDef={regionDef}
                    isVisited={visitedRegions.has(layout.id)}
                    isActive={layout.id === activeRegionId}
                    discoveryCount={progress.count}
                    totalDiscoveries={progress.total}
                    onFastTravel={onFastTravel}
                  />
                )
              })}
            </svg>

            {/* 图例 */}
            <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm bg-gray-400/50" />
                Visited
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm border border-gray-600" />
                Unvisited
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-3 border-t border-dashed border-yellow-500/50" />
                Discovery link
              </span>
              <span className="text-gray-600">Press M to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
