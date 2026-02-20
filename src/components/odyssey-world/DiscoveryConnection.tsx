/**
 * DiscoveryConnection.tsx -- 跨区域发现连接视觉线索
 *
 * 在场景中渲染淡淡的发光虚线，连接当前区域中已激活的发现点
 * 到区域边界方向 (暗示与其他区域的知识连接)。
 *
 * 视觉设计:
 * - 非常低的不透明度 (0.15-0.25) 和细线 (1px)
 * - 不与主光束竞争 (VISL-03)
 * - 新连接激活时短暂闪亮 (0.6 opacity, 1.5s)
 * - 使用 CSS animation 保持轻量
 *
 * 放置在 L2.5 层 (发现反馈层) 中。
 */

import React, { useState, useEffect, useRef } from 'react'
import { worldToScreen } from '@/lib/isometric'
import type { ActiveConnection } from './hooks/useDiscoveryConnections'

// ── 内联 CSS 动画 ──────────────────────────────────────────────────

const connectionKeyframes = `
@keyframes connection-flash {
  0% { opacity: 0.6; }
  100% { opacity: 0.2; }
}
@keyframes connection-pulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.25; }
}
`

// ── 方向到边界偏移 ──────────────────────────────────────────────────

/** 连接线延伸到的边界方向 (世界坐标偏移) */
const BOUNDARY_OFFSETS: Record<string, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -6 },
  south: { dx: 0, dy: 6 },
  east: { dx: 6, dy: 0 },
  west: { dx: -6, dy: 0 },
}

// ── 单条连接线组件 ──────────────────────────────────────────────────

interface ConnectionLineProps {
  connection: ActiveConnection
  /** 当前区域 ID */
  activeRegionId: string
  /** 是否刚刚激活 (闪亮动画) */
  isNew: boolean
}

const ConnectionLine = React.memo(function ConnectionLine({
  connection,
  activeRegionId,
  isNew,
}: ConnectionLineProps) {
  // 确定连接线的方向: 从本区域的发现点延伸到目标区域边界
  // 如果当前区域是 from 区域，线从发现点延伸到 toRegion 方向
  // 如果当前区域是 to 区域，线从边界方向延伸到发现点
  const isFromRegion = connection.fromRegionId === activeRegionId

  // 发现点坐标: 使用区域中心附近作为占位
  // 实际发现点位置与光学元件关联，这里用简化坐标
  const discoveryX = isFromRegion ? 6 : 6
  const discoveryY = isFromRegion ? 6 : 6

  // 计算边界方向
  const targetRegionId = isFromRegion ? connection.toRegionId : connection.fromRegionId
  // 简化: 根据目标区域相对位置判断方向
  const direction = getConnectionDirection(activeRegionId, targetRegionId)
  const offset = BOUNDARY_OFFSETS[direction] ?? { dx: 3, dy: 0 }

  const startScreen = worldToScreen(discoveryX, discoveryY)
  const endScreen = worldToScreen(discoveryX + offset.dx, discoveryY + offset.dy)

  const animationStyle = isNew
    ? 'connection-flash 1.5s ease-out forwards'
    : 'connection-pulse 3s ease-in-out infinite'

  return (
    <line
      x1={startScreen.x}
      y1={startScreen.y}
      x2={endScreen.x}
      y2={endScreen.y}
      stroke="#D4AF37"
      strokeWidth={1}
      strokeDasharray="4,8"
      opacity={isNew ? 0.6 : 0.2}
      style={{
        animation: animationStyle,
        pointerEvents: 'none',
      }}
    />
  )
})

// ── 辅助函数: 推断连接方向 ──────────────────────────────────────────

/** 区域空间布局推断连接方向 */
function getConnectionDirection(fromRegionId: string, toRegionId: string): string {
  // 基于区域注册表的布局:
  // Row 0: crystal-lab (左) | wave-platform (右)
  // Row 1: refraction-bench (左) | scattering-chamber (右)
  // Row 2: interface-lab (左) | measurement-studio (右)
  const REGION_GRID: Record<string, { col: number; row: number }> = {
    'crystal-lab': { col: 0, row: 0 },
    'wave-platform': { col: 1, row: 0 },
    'refraction-bench': { col: 0, row: 1 },
    'scattering-chamber': { col: 1, row: 1 },
    'interface-lab': { col: 0, row: 2 },
    'measurement-studio': { col: 1, row: 2 },
  }

  const from = REGION_GRID[fromRegionId]
  const to = REGION_GRID[toRegionId]
  if (!from || !to) return 'east'

  const dCol = to.col - from.col
  const dRow = to.row - from.row

  // 优先处理行差 (南北)
  if (Math.abs(dRow) >= Math.abs(dCol)) {
    return dRow > 0 ? 'south' : 'north'
  }
  return dCol > 0 ? 'east' : 'west'
}

// ── 批量渲染组件 ──────────────────────────────────────────────────

interface DiscoveryConnectionsProps {
  activeConnections: ActiveConnection[]
  activeRegionId: string
}

/**
 * DiscoveryConnections -- 渲染所有发现连接视觉线索
 *
 * 放置在 L2.5 层 (DiscoveryFeedback 附近)。
 */
export const DiscoveryConnections = React.memo(function DiscoveryConnections({
  activeConnections,
  activeRegionId,
}: DiscoveryConnectionsProps) {
  // 追踪新激活的连接 (1.5s 闪亮后变为常规)
  const [newConnectionIds, setNewConnectionIds] = useState<Set<string>>(new Set())
  const prevCountRef = useRef(activeConnections.length)

  useEffect(() => {
    if (activeConnections.length > prevCountRef.current) {
      // 有新连接激活
      const newIds = new Set<string>()
      for (const conn of activeConnections) {
        const connKey = `${conn.fromDiscoveryId}-${conn.toDiscoveryId}`
        newIds.add(connKey)
      }
      setNewConnectionIds(newIds)
      prevCountRef.current = activeConnections.length

      // 1.5s 后清除闪亮状态
      const timer = setTimeout(() => setNewConnectionIds(new Set()), 1500)
      return () => clearTimeout(timer)
    }
    prevCountRef.current = activeConnections.length
    return undefined
  }, [activeConnections])

  if (activeConnections.length === 0) return null

  return (
    <g className="discovery-connections" style={{ pointerEvents: 'none' }}>
      <style>{connectionKeyframes}</style>
      {activeConnections.map((conn) => {
        const connKey = `${conn.fromDiscoveryId}-${conn.toDiscoveryId}`
        return (
          <ConnectionLine
            key={connKey}
            connection={conn}
            activeRegionId={activeRegionId}
            isNew={newConnectionIds.has(connKey)}
          />
        )
      })}
    </g>
  )
})
