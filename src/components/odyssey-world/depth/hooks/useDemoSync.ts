/**
 * useDemoSync.ts -- Demo-World 双向状态同步 Hook
 *
 * 将深度面板内的 demo 探索器参数与等距世界场景元素双向同步:
 * - 从 store 读取元素当前属性和旋转角度
 * - 提供 syncToWorld() 函数将 demo 参数变化写回 store
 * - 使用 useRef 节流 (200ms) 防止频繁更新导致性能问题
 *
 * 重要: 直接读取 sceneElements 属性 (非 beamSegments)，
 * 避免反馈循环 (research pitfall 2)。
 */

import { useCallback, useRef, useMemo } from 'react'
import { useOdysseyWorldStore, type SceneElementType } from '@/stores/odysseyWorldStore'

/** useDemoSync 返回值 */
export interface UseDemoSyncReturn {
  /** 元素当前属性 (从 store 读取) */
  worldState: Record<string, number | string | boolean>
  /** 元素当前旋转角度 (度) */
  worldRotation: number
  /** 将参数变化同步到世界场景 (节流 200ms) */
  syncToWorld: (property: string, value: number) => void
  /** 立即同步 (用于 pointerUp 等需要立即提交的场景) */
  syncImmediate: (property: string, value: number) => void
  /** 是否找到了可同步的元素 */
  hasElement: boolean
}

/**
 * useDemoSync -- Demo 探索器与世界场景的双向同步
 *
 * @param elementId 要同步的元素 ID (如果已知)
 * @param elementType 元素类型 (用于在当前区域搜索匹配元素)
 * @returns 同步状态和方法
 */
export function useDemoSync(
  elementId?: string,
  elementType?: SceneElementType,
): UseDemoSyncReturn {
  const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)
  const updateElement = useOdysseyWorldStore((s) => s.updateElement)

  // 查找目标元素: 优先用 elementId，否则按类型在当前区域搜索
  const targetElement = useMemo(() => {
    if (elementId) {
      return sceneElements.find((el) => el.id === elementId) ?? null
    }
    if (elementType) {
      return sceneElements.find((el) => el.type === elementType) ?? null
    }
    return null
  }, [sceneElements, elementId, elementType])

  // 节流定时器 ref
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 中间值 ref (快速拖拽时暂存，节流间隔到期时提交)
  const pendingRef = useRef<{ property: string; value: number } | null>(null)

  /** 立即将属性变化写入 store (无节流) */
  const syncImmediate = useCallback(
    (property: string, value: number) => {
      if (!targetElement) return

      // 清除待提交的中间值
      pendingRef.current = null
      if (throttleRef.current) {
        clearTimeout(throttleRef.current)
        throttleRef.current = null
      }

      // 更新属性
      const newProperties = { ...targetElement.properties, [property]: value }
      const patch: { properties: typeof newProperties; rotation?: number } = { properties: newProperties }

      // transmissionAxis/fastAxis 同时更新旋转角度 (与 useElementRotation 模式一致)
      if (property === 'transmissionAxis' || property === 'fastAxis') {
        patch.rotation = value
      }

      updateElement(targetElement.id, patch)
    },
    [targetElement, updateElement],
  )

  /** 节流同步: 暂存中间值，每 200ms 提交一次 */
  const syncToWorld = useCallback(
    (property: string, value: number) => {
      if (!targetElement) return

      pendingRef.current = { property, value }

      // 如果没有待执行的定时器，启动一个
      if (!throttleRef.current) {
        throttleRef.current = setTimeout(() => {
          throttleRef.current = null
          const pending = pendingRef.current
          if (pending) {
            pendingRef.current = null
            syncImmediate(pending.property, pending.value)
          }
        }, 200)
      }
    },
    [targetElement, syncImmediate],
  )

  return {
    worldState: targetElement?.properties ?? {},
    worldRotation: targetElement?.rotation ?? 0,
    syncToWorld,
    syncImmediate,
    hasElement: targetElement !== null,
  }
}
