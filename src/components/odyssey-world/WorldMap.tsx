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

import React, { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import {
  REGION_DEFINITIONS,
  META_DISCOVERIES,
  type RegionDefinition,
} from './regions/regionRegistry'
import {
  getConceptsForRegion,
  type ConceptDefinition,
} from './concepts/conceptRegistry'
import type { ActiveConnection } from './hooks/useDiscoveryConnections'

// 确保概念注册表已初始化 (副作用导入)
import './concepts/crystalLabConcepts'
import './concepts/refractionBenchConcepts'

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

// ── 概念节点位置计算 ──────────────────────────────────────────────

/** 概念节点半径 */
const CONCEPT_NODE_R = 5

/**
 * 计算概念在其区域矩形内的确定性位置
 *
 * 基于概念在区域内的索引，在区域矩形内均匀分布。
 * 位置偏移到区域形状下半部分，避免与区域名称文字重叠。
 */
function getConceptPosition(
  regionLayout: RegionLayout,
  conceptIndex: number,
  totalConcepts: number,
): { x: number; y: number } {
  const { cx, cy } = getRegionCenter(regionLayout.col, regionLayout.row)

  // 在区域矩形下半部分布置节点 (上半部分留给区域名称和进度文字)
  const areaLeft = cx - REGION_WIDTH / 2 + 20
  const areaRight = cx + REGION_WIDTH / 2 - 20
  const areaWidth = areaRight - areaLeft

  // 根据概念数量均匀分布 x 坐标
  const step = totalConcepts > 1 ? areaWidth / (totalConcepts - 1) : 0
  const x = totalConcepts === 1 ? cx : areaLeft + conceptIndex * step

  // y 坐标: 区域底部附近，微小交错避免完全对齐
  const baseY = cy + REGION_HEIGHT / 2 - 12
  const offsetY = conceptIndex % 2 === 0 ? -3 : 3

  return { x, y: baseY + offsetY }
}

// ── 概念连接线 (星座图) ──────────────────────────────────────────

interface ConceptConnectionLinesProps {
  allTimeDiscoveries: Set<string>
}

/**
 * ConceptConnectionLines -- 概念间的分类连接线
 *
 * 遍历所有已发现概念的 connections 数组，
 * 当源和目标概念都已发现时绘制连接线。
 * 线型按关系类型分类:
 * - causal: 实线, 琥珀色
 * - analogous: 虚线, 蓝色
 * - contrasting: 点线, 玫瑰色
 */
function ConceptConnectionLines({ allTimeDiscoveries }: ConceptConnectionLinesProps) {
  // 构建已发现概念及其位置的查找表
  const { connections, positionMap } = useMemo(() => {
    const posMap = new Map<string, { x: number; y: number }>()
    const discoveredConcepts: ConceptDefinition[] = []

    for (const layout of REGION_LAYOUT) {
      const concepts = getConceptsForRegion(layout.id)
      const discovered = concepts.filter((c) => allTimeDiscoveries.has(c.discoveryId))

      discovered.forEach((concept, idx) => {
        const pos = getConceptPosition(layout, idx, discovered.length)
        posMap.set(concept.id, pos)
      })

      discoveredConcepts.push(...discovered)
    }

    // 收集所有需要绘制的连接线 (去重: 只从 ID 较小的概念绘制)
    const conns: {
      key: string
      from: { x: number; y: number }
      to: { x: number; y: number }
      type: 'causal' | 'analogous' | 'contrasting'
    }[] = []

    const seen = new Set<string>()

    for (const concept of discoveredConcepts) {
      const fromPos = posMap.get(concept.id)
      if (!fromPos) continue

      for (const conn of concept.connections) {
        const toPos = posMap.get(conn.targetConceptId)
        if (!toPos) continue // 目标概念未发现或不存在

        const pairKey = [concept.id, conn.targetConceptId].sort().join('|')
        if (seen.has(pairKey)) continue
        seen.add(pairKey)

        conns.push({
          key: `concept-conn-${pairKey}`,
          from: fromPos,
          to: toPos,
          type: conn.type,
        })
      }
    }

    return { connections: conns, positionMap: posMap }
  }, [allTimeDiscoveries])

  // 忽略 positionMap 用于渲染 -- 只用于计算
  void positionMap

  return (
    <>
      {connections.map((conn) => {
        // 按关系类型设置线型
        let stroke: string
        let strokeDasharray: string | undefined
        switch (conn.type) {
          case 'causal':
            stroke = '#f59e0b' // 琥珀色
            strokeDasharray = undefined // 实线
            break
          case 'analogous':
            stroke = '#60a5fa' // 蓝色
            strokeDasharray = '6,4' // 虚线
            break
          case 'contrasting':
            stroke = '#f43f5e' // 玫瑰色
            strokeDasharray = '2,3' // 点线
            break
        }

        return (
          <line
            key={conn.key}
            x1={conn.from.x}
            y1={conn.from.y}
            x2={conn.to.x}
            y2={conn.to.y}
            stroke={stroke}
            strokeWidth={1.2}
            strokeDasharray={strokeDasharray}
            opacity={0.5}
          />
        )
      })}
    </>
  )
}

// ── 概念节点 ──────────────────────────────────────────────────────

interface ConceptNodesProps {
  allTimeDiscoveries: Set<string>
  onConceptClick: (conceptId: string) => void
  hoveredConceptId: string | null
  onConceptHover: (conceptId: string | null) => void
}

/**
 * ConceptNodes -- 已发现概念的小圆点
 *
 * 在每个区域矩形内渲染已发现概念的彩色节点。
 * 悬停显示概念名称，点击打开深度面板。
 */
function ConceptNodes({
  allTimeDiscoveries,
  onConceptClick,
  hoveredConceptId,
  onConceptHover,
}: ConceptNodesProps) {
  const { t } = useTranslation()
  const nodes = useMemo(() => {
    const result: {
      concept: ConceptDefinition
      pos: { x: number; y: number }
      accentColor: string
    }[] = []

    for (const layout of REGION_LAYOUT) {
      const regionDef = REGION_DEFINITIONS.get(layout.id)
      const accentColor = regionDef?.theme.colorPalette.accentColor ?? '#888'
      const concepts = getConceptsForRegion(layout.id)
      const discovered = concepts.filter((c) => allTimeDiscoveries.has(c.discoveryId))

      discovered.forEach((concept, idx) => {
        const pos = getConceptPosition(layout, idx, discovered.length)
        result.push({ concept, pos, accentColor })
      })
    }

    return result
  }, [allTimeDiscoveries])

  return (
    <>
      {nodes.map(({ concept, pos, accentColor }) => {
        const isHovered = hoveredConceptId === concept.id

        return (
          <g
            key={`concept-node-${concept.id}`}
            className="concept-node"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation()
              onConceptClick(concept.id)
            }}
            onMouseEnter={() => onConceptHover(concept.id)}
            onMouseLeave={() => onConceptHover(null)}
          >
            {/* 悬停光晕 */}
            {isHovered && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={CONCEPT_NODE_R + 4}
                fill={accentColor}
                opacity={0.2}
              />
            )}

            {/* 概念节点 */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isHovered ? CONCEPT_NODE_R + 1 : CONCEPT_NODE_R}
              fill={accentColor}
              stroke="#fff"
              strokeWidth={isHovered ? 1.5 : 0.5}
              strokeOpacity={isHovered ? 0.8 : 0.3}
              opacity={isHovered ? 1 : 0.8}
            />

            {/* 悬停时显示概念名称标签 */}
            {isHovered && (
              <>
                <rect
                  x={pos.x - 50}
                  y={pos.y - 22}
                  width={100}
                  height={14}
                  rx={3}
                  fill="rgba(0,0,0,0.8)"
                />
                <text
                  x={pos.x}
                  y={pos.y - 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize={8}
                  fontWeight={500}
                  style={{ pointerEvents: 'none' }}
                >
                  {t(concept.nameKey)}
                </text>
              </>
            )}
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
  // 使用全局累积发现集合 (跨所有区域) 而非当前活跃区域的工作集
  const allTimeDiscoveries = useOdysseyWorldStore((s) => s.allTimeDiscoveries)
  const openDepthPanel = useOdysseyWorldStore((s) => s.openDepthPanel)

  // 概念节点悬停状态 (本地 UI 状态)
  const [hoveredConceptId, setHoveredConceptId] = useState<string | null>(null)

  // 概念节点点击: 关闭世界地图 + 打开深度面板
  const handleConceptClick = useCallback(
    (conceptId: string) => {
      onClose()
      // 使用 requestAnimationFrame 确保地图关闭后再打开面板
      requestAnimationFrame(() => {
        openDepthPanel(conceptId)
      })
    },
    [onClose, openDepthPanel],
  )

  // 计算每个区域的发现进度 (基于全局累积发现)
  const regionProgress = useMemo(() => {
    const progress = new Map<string, { count: number; total: number }>()

    for (const [regionId, regionDef] of REGION_DEFINITIONS) {
      const total = regionDef.discoveries.length
      let count = 0
      for (const disc of regionDef.discoveries) {
        if (allTimeDiscoveries.has(disc.id)) {
          count++
        }
      }
      progress.set(regionId, { count, total })
    }

    return progress
  }, [allTimeDiscoveries])

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

              {/* 概念连接线 (在区域形状之上，概念节点之下) */}
              <ConceptConnectionLines allTimeDiscoveries={allTimeDiscoveries} />

              {/* 概念节点 (最顶层，可交互) */}
              <ConceptNodes
                allTimeDiscoveries={allTimeDiscoveries}
                onConceptClick={handleConceptClick}
                hoveredConceptId={hoveredConceptId}
                onConceptHover={setHoveredConceptId}
              />
            </svg>

            {/* 图例 */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
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
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-gray-400/60" />
                Concept
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-3 border-t border-amber-500/60" />
                Causal
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-3 border-t border-dashed border-blue-400/60" />
                Analogous
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-3 border-t border-dotted border-rose-400/60" />
                Contrasting
              </span>
              <span className="text-gray-600">Press M to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
