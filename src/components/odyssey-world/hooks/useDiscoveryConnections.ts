/**
 * useDiscoveryConnections.ts -- 跨区域发现连接追踪 Hook
 *
 * 追踪跨区域发现连接的激活状态:
 * 1. 读取全局 achievedDiscoveries
 * 2. 从所有区域定义读取 discoveryConnections
 * 3. 计算已激活的连接 (fromDiscoveryId 已达成)
 * 4. 检查大发现 (meta-discoveries) 是否所有前置发现均已达成
 * 5. 返回当前区域的活跃连接、大发现状态、全局连接
 *
 * 大发现达成时存储为特殊发现 ID (meta-xxx)。
 */

import { useMemo, useEffect, useRef } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import {
  REGION_DEFINITIONS,
  META_DISCOVERIES,
  type MetaDiscovery,
} from '@/components/odyssey-world/regions/regionRegistry'

// ── 纯函数: 连接计算 ──────────────────────────────────────────────────

/** 已激活的跨区域连接 (含源区域 ID) */
export interface ActiveConnection {
  fromRegionId: string
  fromDiscoveryId: string
  toRegionId: string
  toDiscoveryId: string
  connectionTag?: string
}

/**
 * 检查发现连接的激活状态 (纯函数，可在 store action 中调用)
 *
 * @param achievedDiscoveries 已达成的发现 ID 集合
 * @returns 已激活的连接列表
 */
export function computeActiveConnections(
  achievedDiscoveries: Set<string>,
): ActiveConnection[] {
  const active: ActiveConnection[] = []

  for (const [regionId, regionDef] of REGION_DEFINITIONS) {
    for (const conn of regionDef.discoveryConnections) {
      if (achievedDiscoveries.has(conn.fromDiscoveryId)) {
        active.push({
          fromRegionId: regionId,
          fromDiscoveryId: conn.fromDiscoveryId,
          toRegionId: conn.toRegionId,
          toDiscoveryId: conn.toDiscoveryId,
          connectionTag: conn.connectionTag,
        })
      }
    }
  }

  return active
}

/**
 * 检查大发现的达成状态 (纯函数)
 *
 * @param achievedDiscoveries 已达成的发现 ID 集合
 * @returns 已达成的大发现 ID 列表
 */
export function computeMetaDiscoveries(
  achievedDiscoveries: Set<string>,
): string[] {
  const achieved: string[] = []

  for (const meta of META_DISCOVERIES) {
    if (achievedDiscoveries.has(meta.id)) {
      achieved.push(meta.id)
      continue
    }

    // 检查所有前置发现是否达成
    const allMet = meta.requiredDiscoveries.every(
      (req) => achievedDiscoveries.has(req.discoveryId),
    )
    if (allMet) {
      achieved.push(meta.id)
    }
  }

  return achieved
}

// ── Hook ──────────────────────────────────────────────────────────────

export interface UseDiscoveryConnectionsReturn {
  /** 当前区域涉及的活跃连接 */
  activeConnections: ActiveConnection[]
  /** 已达成的大发现 ID */
  metaDiscoveries: string[]
  /** 全局所有活跃连接 (世界地图用) */
  allConnections: ActiveConnection[]
  /** 大发现定义列表 */
  metaDiscoveryDefs: MetaDiscovery[]
}

/**
 * useDiscoveryConnections -- 跨区域发现连接
 *
 * 监听 achievedDiscoveries 变化，自动计算连接激活状态。
 * 大发现达成时自动写入 store。
 */
export function useDiscoveryConnections(): UseDiscoveryConnectionsReturn {
  // 使用全局累积发现集合 (跨所有区域)，而非当前区域的工作集
  const allTimeDiscoveries = useOdysseyWorldStore((s) => s.allTimeDiscoveries)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const achieveDiscovery = useOdysseyWorldStore((s) => s.achieveDiscovery)

  // 追踪已处理的大发现，避免重复触发
  const processedMetaRef = useRef<Set<string>>(new Set())

  // 计算全局活跃连接 (基于全局累积发现)
  const allConnections = useMemo(
    () => computeActiveConnections(allTimeDiscoveries),
    [allTimeDiscoveries],
  )

  // 过滤当前区域涉及的连接
  const activeConnections = useMemo(
    () =>
      allConnections.filter(
        (conn) =>
          conn.fromRegionId === activeRegionId ||
          conn.toRegionId === activeRegionId,
      ),
    [allConnections, activeRegionId],
  )

  // 计算大发现状态 (基于全局累积发现)
  const metaDiscoveries = useMemo(
    () => computeMetaDiscoveries(allTimeDiscoveries),
    [allTimeDiscoveries],
  )

  // 大发现达成时写入 store (响应式)
  useEffect(() => {
    for (const metaId of metaDiscoveries) {
      if (
        !allTimeDiscoveries.has(metaId) &&
        !processedMetaRef.current.has(metaId)
      ) {
        processedMetaRef.current.add(metaId)
        // 延迟写入避免在渲染期间更新 store
        queueMicrotask(() => {
          achieveDiscovery(metaId)
        })
      }
    }
  }, [metaDiscoveries, allTimeDiscoveries, achieveDiscovery])

  return {
    activeConnections,
    metaDiscoveries,
    allConnections,
    metaDiscoveryDefs: META_DISCOVERIES,
  }
}
