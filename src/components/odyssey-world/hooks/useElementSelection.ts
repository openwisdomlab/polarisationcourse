/**
 * useElementSelection.ts -- 元素选择与悬停交互 Hook
 *
 * 管理元素的选中和悬停状态:
 * - 点击选择: pointerup 时如果未发生拖拽 (距离 < 阈值)，则选择元素
 * - 悬停反馈: pointerenter/pointerleave 更新悬停状态
 * - 使用 store 选择器读取当前选中/悬停 ID，高效避免无关重渲染
 */

import { useCallback, useRef } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'

/** 拖拽阈值 (与 useElementDrag 保持一致) */
const DRAG_THRESHOLD = 5

export interface UseElementSelectionReturn {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onPointerEnter: () => void
  onPointerLeave: () => void
  isSelected: boolean
  isHovered: boolean
}

/**
 * 元素选择 Hook
 *
 * @param elementId 目标元素 ID
 */
export function useElementSelection(
  elementId: string,
): UseElementSelectionReturn {
  // 通过选择器高效读取状态 (仅在相关 ID 变化时重渲染)
  const isSelected = useOdysseyWorldStore(
    (s) => s.selectedElementId === elementId,
  )
  const isHovered = useOdysseyWorldStore(
    (s) => s.hoveredElementId === elementId,
  )

  // 记录 pointerdown 位置，用于区分点击和拖拽
  const startPosRef = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      startPosRef.current = { x: e.clientX, y: e.clientY }
    },
    [],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!startPosRef.current) return

      const dx = e.clientX - startPosRef.current.x
      const dy = e.clientY - startPosRef.current.y
      const distance = Math.hypot(dx, dy)

      // 只有点击 (未拖拽) 才切换选择
      if (distance < DRAG_THRESHOLD) {
        useOdysseyWorldStore.getState().selectElement(elementId)
      }

      startPosRef.current = null
    },
    [elementId],
  )

  const onPointerEnter = useCallback(() => {
    useOdysseyWorldStore.getState().hoverElement(elementId)
  }, [elementId])

  const onPointerLeave = useCallback(() => {
    // 只有当前悬停的是此元素时才清除
    const current = useOdysseyWorldStore.getState().hoveredElementId
    if (current === elementId) {
      useOdysseyWorldStore.getState().hoverElement(null)
    }
  }, [elementId])

  return {
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
    isSelected,
    isHovered,
  }
}
