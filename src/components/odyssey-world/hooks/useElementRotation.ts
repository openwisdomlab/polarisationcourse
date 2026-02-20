/**
 * useElementRotation.ts -- 元素旋转交互 Hook
 *
 * 两种旋转输入方式:
 * 1. 拖拽旋转手柄: atan2 计算指针与元素中心的角度，实时更新
 * 2. 滚轮旋转: 选中元素时，滚轮每 tick 旋转 2 度
 *
 * 旋转时实时更新物理属性 (transmissionAxis / fastAxis)，
 * 使光束渲染即时反映旋转变化 (根据用户决策的实时模式)。
 */

import { useRef, useCallback, useState, type RefObject } from 'react'
import type { MotionValue } from 'framer-motion'
import { worldToScreenWithCamera } from '@/lib/isometric'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'

/** 物理更新阈值: 旋转变化超过此角度才更新 store (避免高频微小更新) */
const PHYSICS_THRESHOLD_DEG = 0.5

/** 滚轮每 tick 旋转角度 */
const WHEEL_DEG_PER_TICK = 2

export interface UseElementRotationReturn {
  onRotatePointerDown: (e: React.PointerEvent) => void
  onRotatePointerMove: (e: React.PointerEvent) => void
  onRotatePointerUp: (e: React.PointerEvent) => void
  onWheel: (e: React.WheelEvent) => void
  isRotating: boolean
  currentAngle: number
}

/**
 * 元素旋转 Hook
 *
 * @param elementId 被旋转的元素 ID
 * @param containerRef 场景容器 DOM 引用
 * @param cameraX 摄像机 X 偏移 MotionValue
 * @param cameraY 摄像机 Y 偏移 MotionValue
 * @param zoom 缩放 MotionValue
 */
export function useElementRotation(
  elementId: string,
  containerRef: RefObject<HTMLDivElement | null>,
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
): UseElementRotationReturn {
  const [isRotating, setIsRotating] = useState(false)
  const [currentAngle, setCurrentAngle] = useState(0)

  // 中间状态用 useRef
  const initialPointerAngleRef = useRef(0)
  const initialElementAngleRef = useRef(0)
  const lastCommittedAngleRef = useRef(0)
  const isRotatingRef = useRef(false)

  /** 获取元素在屏幕空间的中心坐标 */
  const getElementScreenCenter = useCallback(() => {
    const el = useOdysseyWorldStore.getState().sceneElements.find(
      (e) => e.id === elementId,
    )
    if (!el) return null

    return worldToScreenWithCamera(
      el.worldX,
      el.worldY,
      cameraX.get(),
      cameraY.get(),
      zoom.get(),
    )
  }, [elementId, cameraX, cameraY, zoom])

  /** 更新元素旋转和物理属性 */
  const commitRotation = useCallback(
    (newAngle: number) => {
      const el = useOdysseyWorldStore.getState().sceneElements.find(
        (e) => e.id === elementId,
      )
      if (!el) return

      // 构建属性更新: 同步旋转到物理属性
      const patch: Record<string, number | string | boolean> = { ...el.properties }

      if (el.type === 'polarizer') {
        patch.transmissionAxis = newAngle
      } else if (el.type === 'waveplate') {
        patch.fastAxis = newAngle
      }

      const store = useOdysseyWorldStore.getState()
      store.updateElement(elementId, {
        rotation: newAngle,
        properties: patch,
      })

      // 记录旋转历史 (用于马吕斯定律发现检测)
      store.recordRotation(elementId, newAngle)
    },
    [elementId],
  )

  // ── 拖拽旋转手柄 ──

  const onRotatePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // 过渡期间阻断旋转
      if (useOdysseyWorldStore.getState().isTransitioning) return

      const center = getElementScreenCenter()
      if (!center) return

      const container = containerRef.current
      if (!container) return

      // 计算指针相对于容器的位置
      const rect = container.getBoundingClientRect()
      const pointerX = e.clientX - rect.left
      const pointerY = e.clientY - rect.top

      // 初始指针角度 (相对于元素中心)
      initialPointerAngleRef.current = Math.atan2(
        pointerY - center.y,
        pointerX - center.x,
      ) * 180 / Math.PI

      // 当前元素角度
      const el = useOdysseyWorldStore.getState().sceneElements.find(
        (e) => e.id === elementId,
      )
      initialElementAngleRef.current = el?.rotation ?? 0
      lastCommittedAngleRef.current = initialElementAngleRef.current

      isRotatingRef.current = true
      setIsRotating(true)
      setCurrentAngle(initialElementAngleRef.current)
      useOdysseyWorldStore.getState().setInteractionMode('rotate')

      ;(e.target as Element).setPointerCapture(e.pointerId)
      e.stopPropagation()
    },
    [elementId, containerRef, getElementScreenCenter],
  )

  const onRotatePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotatingRef.current) return

      const center = getElementScreenCenter()
      if (!center) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const pointerX = e.clientX - rect.left
      const pointerY = e.clientY - rect.top

      // 计算当前指针角度
      const currentPointerAngle = Math.atan2(
        pointerY - center.y,
        pointerX - center.x,
      ) * 180 / Math.PI

      // 角度差
      const delta = currentPointerAngle - initialPointerAngleRef.current
      const newAngle = initialElementAngleRef.current + delta

      setCurrentAngle(newAngle)

      // 节流: 只有角度变化超过阈值才更新 store
      if (Math.abs(newAngle - lastCommittedAngleRef.current) >= PHYSICS_THRESHOLD_DEG) {
        lastCommittedAngleRef.current = newAngle
        commitRotation(newAngle)
      }
    },
    [containerRef, getElementScreenCenter, commitRotation],
  )

  const onRotatePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotatingRef.current) return

      ;(e.target as Element).releasePointerCapture(e.pointerId)

      // 提交最终角度
      commitRotation(currentAngle)

      isRotatingRef.current = false
      setIsRotating(false)
      useOdysseyWorldStore.getState().setInteractionMode('idle')
    },
    [commitRotation, currentAngle],
  )

  // ── 滚轮旋转 ──

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      // 过渡期间阻断滚轮旋转
      if (useOdysseyWorldStore.getState().isTransitioning) return

      // 仅在元素被选中时响应滚轮
      const selectedId = useOdysseyWorldStore.getState().selectedElementId
      if (selectedId !== elementId) return

      // 阻止摄像机缩放
      e.preventDefault()
      e.stopPropagation()

      // 计算旋转增量: 向上滚 = 顺时针, 向下滚 = 逆时针
      const delta = e.deltaY > 0 ? WHEEL_DEG_PER_TICK : -WHEEL_DEG_PER_TICK

      const el = useOdysseyWorldStore.getState().sceneElements.find(
        (el) => el.id === elementId,
      )
      if (!el) return

      const newAngle = el.rotation + delta
      setCurrentAngle(newAngle)
      commitRotation(newAngle)
    },
    [elementId, commitRotation],
  )

  return {
    onRotatePointerDown,
    onRotatePointerMove,
    onRotatePointerUp,
    onWheel,
    isRotating,
    currentAngle,
  }
}
