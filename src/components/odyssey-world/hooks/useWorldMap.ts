/**
 * useWorldMap.ts -- 世界地图控制 Hook
 *
 * 管理世界地图的打开/关闭和快速旅行:
 * - 读取 worldMapOpen, visitedRegions, activeRegionId, achievedDiscoveries
 * - 读取 useDiscoveryConnections 的全局连接数据
 * - fastTravel(regionId): 关闭地图 -> 触发 initiateTransition
 * - open/close: 切换 store.toggleWorldMap()
 *
 * 快速旅行只对已访问区域有效。
 * 入口点: 优先使用从当前区域到目标区域的边界入口，
 *          不相邻时使用目标区域中心。
 */

import { useCallback, useEffect } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import {
  getRegionDefinition,
  REGION_DEFINITIONS,
} from '@/components/odyssey-world/regions/regionRegistry'

// ── 快速旅行入口点计算 ──────────────────────────────────────────────

/**
 * 计算快速旅行的入口点
 *
 * 优先查找直接相邻边界的入口点;
 * 非直接相邻时使用目标区域中心。
 */
function getEntryPoint(
  fromRegionId: string,
  toRegionId: string,
): { x: number; y: number } {
  const fromDef = getRegionDefinition(fromRegionId)
  if (fromDef) {
    // 查找直接相邻边界
    const boundary = fromDef.boundaries.find((b) => b.targetRegionId === toRegionId)
    if (boundary) {
      return { ...boundary.entryPoint }
    }
  }

  // 非直接相邻: 使用目标区域中心
  const toDef = getRegionDefinition(toRegionId)
  if (toDef) {
    return {
      x: Math.floor(toDef.gridWidth / 2),
      y: Math.floor(toDef.gridHeight / 2),
    }
  }

  return { x: 7, y: 7 }
}

// ── Hook ──────────────────────────────────────────────────────────────

export interface UseWorldMapReturn {
  /** 世界地图是否打开 */
  isOpen: boolean
  /** 打开世界地图 */
  open: () => void
  /** 关闭世界地图 */
  close: () => void
  /** 快速旅行到已访问区域 */
  fastTravel: (regionId: string) => void
  /** 已访问区域集合 */
  visitedRegions: Set<string>
  /** 当前活跃区域 ID */
  activeRegionId: string
  /** 所有区域定义 (渲染用) */
  regionDefs: typeof REGION_DEFINITIONS
}

/**
 * useWorldMap -- 世界地图控制
 *
 * 提供世界地图的打开/关闭和快速旅行功能。
 * initiateTransition 通过 ref 注入 (来自 OdysseyWorld)。
 */
export function useWorldMap(
  initiateTransitionRef: React.RefObject<((targetRegionId: string, entryPoint: { x: number; y: number }) => void) | undefined>,
): UseWorldMapReturn {
  const isOpen = useOdysseyWorldStore((s) => s.worldMapOpen)
  const visitedRegions = useOdysseyWorldStore((s) => s.visitedRegions)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)

  const open = useCallback(() => {
    useOdysseyWorldStore.getState().toggleWorldMap()
  }, [])

  const close = useCallback(() => {
    const store = useOdysseyWorldStore.getState()
    if (store.worldMapOpen) {
      store.toggleWorldMap()
    }
  }, [])

  const fastTravel = useCallback(
    (regionId: string) => {
      const store = useOdysseyWorldStore.getState()

      // 只能快速旅行到已访问区域
      if (!store.visitedRegions.has(regionId)) return

      // 不跳转到当前区域
      if (regionId === store.activeRegionId) {
        close()
        return
      }

      // 关闭地图
      close()

      // 计算入口点并触发过渡
      const entryPoint = getEntryPoint(store.activeRegionId, regionId)

      // 使用 requestAnimationFrame 确保地图关闭渲染后再触发过渡
      requestAnimationFrame(() => {
        initiateTransitionRef.current?.(regionId, entryPoint)
      })
    },
    [close, initiateTransitionRef],
  )

  // 键盘快捷键: M 键切换世界地图
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        // 避免在输入框中触发
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return
        }
        useOdysseyWorldStore.getState().toggleWorldMap()
      }
      // Escape 关闭地图
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  return {
    isOpen,
    open,
    close,
    fastTravel,
    visitedRegions,
    activeRegionId,
    regionDefs: REGION_DEFINITIONS,
  }
}
