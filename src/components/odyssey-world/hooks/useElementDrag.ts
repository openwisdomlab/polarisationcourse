/**
 * useElementDrag.ts -- 元素拖拽交互 Hook
 *
 * 处理光学元素的拖拽移动:
 * - 使用 setPointerCapture 保证拖拽跟踪的可靠性
 * - 将屏幕坐标转换为等距世界坐标
 * - 拖拽过程中磁性吸附到最近的光束路径
 * - 释放后更新 store 或移除元素 (拖离光束路径时)
 * - 使用 useRef 存储中间状态，避免每帧 React 重渲染
 */

import { useRef, useCallback, useState, type RefObject } from 'react'
import type { MotionValue } from 'framer-motion'
import { screenToWorldWithCamera, snapToBeamPath, type SnapResult } from '@/lib/isometric'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'

/** 拖拽阈值: 超过此像素距离后才进入拖拽模式 (区分点击和拖拽) */
const DRAG_THRESHOLD = 5

export interface UseElementDragReturn {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  isDragging: boolean
  snapPos: SnapResult | null
}

/**
 * 元素拖拽 Hook
 *
 * @param elementId 被拖拽的元素 ID
 * @param containerRef 场景容器 DOM 引用 (用于计算相对坐标)
 * @param cameraX 摄像机 X 偏移 MotionValue
 * @param cameraY 摄像机 Y 偏移 MotionValue
 * @param zoom 缩放 MotionValue
 */
export function useElementDrag(
  elementId: string,
  containerRef: RefObject<HTMLDivElement | null>,
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
): UseElementDragReturn {
  // 拖拽状态 -- 使用 useState 仅用于 isDragging (组件需要知道是否在拖拽以改变视觉)
  const [isDragging, setIsDragging] = useState(false)
  const [snapPos, setSnapPos] = useState<SnapResult | null>(null)

  // 中间状态用 useRef，避免每帧重渲染
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const isDraggingRef = useRef(false)
  const lastSnapRef = useRef<SnapResult | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // 过渡期间阻断拖拽
      if (useOdysseyWorldStore.getState().isTransitioning) return

      // 记录起始位置
      startPosRef.current = { x: e.clientX, y: e.clientY }
      isDraggingRef.current = false

      // 捕获指针，确保移动到元素外部时仍能接收事件
      ;(e.target as Element).setPointerCapture(e.pointerId)

      // 阻止冒泡到场景 (防止触发 click-to-move)
      e.stopPropagation()
    },
    [],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPosRef.current) return

      const container = containerRef.current
      if (!container) return

      const dx = e.clientX - startPosRef.current.x
      const dy = e.clientY - startPosRef.current.y
      const distance = Math.hypot(dx, dy)

      // 超过阈值后进入拖拽模式
      if (!isDraggingRef.current && distance > DRAG_THRESHOLD) {
        isDraggingRef.current = true
        setIsDragging(true)
        useOdysseyWorldStore.getState().setInteractionMode('drag')
      }

      if (!isDraggingRef.current) return

      // 将指针位置转换为世界坐标
      const rect = container.getBoundingClientRect()
      const world = screenToWorldWithCamera(
        e.clientX - rect.left,
        e.clientY - rect.top,
        cameraX.get(),
        cameraY.get(),
        zoom.get(),
      )

      // 吸附到最近的光束路径
      const beamSegments = useOdysseyWorldStore.getState().beamSegments
      const snap = snapToBeamPath(world.x, world.y, beamSegments)

      // 节流: 仅在吸附点变化时更新 store
      const lastSnap = lastSnapRef.current
      if (
        snap !== null &&
        (lastSnap === null || snap.x !== lastSnap.x || snap.y !== lastSnap.y)
      ) {
        lastSnapRef.current = snap
        setSnapPos(snap)
        useOdysseyWorldStore.getState().setDragPreviewPos({
          worldX: snap.x,
          worldY: snap.y,
        })
      } else if (snap === null && lastSnap !== null) {
        lastSnapRef.current = null
        setSnapPos(null)
        useOdysseyWorldStore.getState().setDragPreviewPos(null)
      }
    },
    [containerRef, cameraX, cameraY, zoom],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      // 释放指针捕获
      ;(e.target as Element).releasePointerCapture(e.pointerId)

      if (isDraggingRef.current) {
        const snap = lastSnapRef.current

        if (snap) {
          // 拖拽到有效光束路径位置 -- 更新元素位置
          useOdysseyWorldStore.getState().updateElement(elementId, {
            worldX: snap.x,
            worldY: snap.y,
          })
        } else {
          // 拖离光束路径 -- 移除元素
          useOdysseyWorldStore.getState().removeElement(elementId)
        }
      }

      // 重置状态
      startPosRef.current = null
      isDraggingRef.current = false
      lastSnapRef.current = null
      setIsDragging(false)
      setSnapPos(null)
      useOdysseyWorldStore.getState().setInteractionMode('idle')
      useOdysseyWorldStore.getState().setDragPreviewPos(null)
    },
    [elementId],
  )

  return { onPointerDown, onPointerMove, onPointerUp, isDragging, snapPos }
}
