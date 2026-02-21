/**
 * useIsometricCamera.ts -- 等距摄像机系统
 *
 * 使用 Framer Motion 的 useMotionValue 管理摄像机位置和缩放，
 * 确保平移/缩放动画期间不触发 React 重渲染 (GPU 合成 CSS 变换)。
 * 仅在动画完成后同步到 Zustand store (给小地图、点击检测等使用)。
 */

import { useCallback, useRef } from 'react'
import { useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { clampZoom } from '@/lib/isometric'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from '@/components/odyssey-world/regions/regionRegistry'

export interface IsometricCameraReturn {
  cameraX: MotionValue<number>
  cameraY: MotionValue<number>
  zoom: MotionValue<number>
  svgTransform: MotionValue<string>
  handleWheel: (e: React.WheelEvent) => void
  handlePanPointerDown: (e: React.PointerEvent) => void
  handlePanPointerMove: (e: React.PointerEvent) => void
  handlePanPointerUp: (e: React.PointerEvent) => void
}

/**
 * 将摄像机位置夹紧到场景边界内
 *
 * 基于区域网格尺寸和当前缩放计算允许的最大平移范围，
 * 添加 50% 内边距以确保场景内容始终可见。
 *
 * @param x 摄像机 X 偏移 (屏幕空间)
 * @param y 摄像机 Y 偏移 (屏幕空间)
 * @param z 当前缩放倍数
 * @param gridWidth 区域网格宽度 (格子数)
 * @param gridHeight 区域网格高度 (格子数)
 * @returns 夹紧后的摄像机坐标
 */
function clampCamera(
  x: number,
  y: number,
  z: number,
  gridWidth: number,
  gridHeight: number,
): { x: number; y: number } {
  // TILE_WIDTH_HALF = 64, TILE_HEIGHT_HALF = 32
  // 场景在屏幕空间的半宽/半高，含 50% 内边距
  const sceneWidthHalf = gridWidth * 64 * 1.5
  const sceneHeightHalf = gridHeight * 32 * 1.5

  // 缩放越大，允许的摄像机偏移范围越小 (除以 z)
  const clampedX = Math.max(-sceneWidthHalf / z, Math.min(sceneWidthHalf / z, x))
  const clampedY = Math.max(-sceneHeightHalf / z, Math.min(sceneHeightHalf / z, y))

  return { x: clampedX, y: clampedY }
}

/**
 * 等距摄像机 Hook
 *
 * 返回 MotionValue 驱动的摄像机位置、缩放和 CSS 变换字符串。
 * handleWheel 处理滚轮缩放，向光标位置缩放 (光标下的点保持不动)。
 */
export function useIsometricCamera(): IsometricCameraReturn {
  const cameraX = useMotionValue(0)
  const cameraY = useMotionValue(0)
  const zoom = useMotionValue(1)

  // 合并 cameraX, cameraY, zoom 为 CSS transform 字符串
  // 使用 useTransform 监听三个 MotionValue 的变化
  const svgTransform = useTransform(
    [cameraX, cameraY, zoom],
    ([x, y, z]: number[]) => `scale(${z}) translate(${-x}px, ${-y}px)`,
  )

  // 同步定时器 ref，用于去抖同步到 Zustand
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 将 MotionValue 当前值同步到 Zustand store (去抖)
  const syncToStore = useCallback(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      const store = useOdysseyWorldStore.getState()
      store.setCamera(cameraX.get(), cameraY.get())
      store.setZoom(zoom.get())
    }, 100)
  }, [cameraX, cameraY, zoom])

  // 滚轮缩放处理: 向光标位置缩放
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()

      const currentZoom = zoom.get()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newZoom = clampZoom(currentZoom + delta)

      if (newZoom === currentZoom) return

      // 获取光标相对于容器的位置
      const rect = e.currentTarget.getBoundingClientRect()
      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top

      // 缩放前光标指向的世界坐标
      // worldPoint = cursorScreen / oldZoom + cameraOffset
      const worldX = cursorX / currentZoom + cameraX.get()
      const worldY = cursorY / currentZoom + cameraY.get()

      // 缩放后需要的摄像机偏移，使同一世界点仍在光标下
      // newCameraOffset = worldPoint - cursorScreen / newZoom
      const newCamX = worldX - cursorX / newZoom
      const newCamY = worldY - cursorY / newZoom

      zoom.set(newZoom)

      // 缩放后将摄像机夹紧到场景边界
      const region = getRegionDefinition(useOdysseyWorldStore.getState().activeRegionId)
      if (region) {
        const clamped = clampCamera(newCamX, newCamY, newZoom, region.gridWidth, region.gridHeight)
        cameraX.set(clamped.x)
        cameraY.set(clamped.y)
      } else {
        cameraX.set(newCamX)
        cameraY.set(newCamY)
      }

      // 缩放完成后同步到 store
      syncToStore()
    },
    [cameraX, cameraY, zoom, syncToStore],
  )

  // ── 鼠标拖拽平移 (仅鼠标，不影响触摸 pinch-to-zoom) ──
  const dragRef = useRef<{
    dragging: boolean
    startX: number
    startY: number
    startCamX: number
    startCamY: number
  }>({ dragging: false, startX: 0, startY: 0, startCamX: 0, startCamY: 0 })

  const handlePanPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // 仅处理鼠标主按键拖拽，不拦截触摸事件
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragRef.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startCamX: cameraX.get(),
        startCamY: cameraY.get(),
      }
    },
    [cameraX, cameraY],
  )

  const handlePanPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!dragRef.current.dragging) return

      const currentZoom = zoom.get()
      // 鼠标移动 delta 需要除以缩放比例 (屏幕像素 -> 世界空间偏移)
      const dx = (e.clientX - dragRef.current.startX) / currentZoom
      const dy = (e.clientY - dragRef.current.startY) / currentZoom

      // 拖拽方向: 鼠标向右拖 -> 摄像机向左偏移 (减去 delta)
      let newCamX = dragRef.current.startCamX - dx
      let newCamY = dragRef.current.startCamY - dy

      // 将摄像机夹紧到场景边界
      const region = getRegionDefinition(useOdysseyWorldStore.getState().activeRegionId)
      if (region) {
        const clamped = clampCamera(newCamX, newCamY, currentZoom, region.gridWidth, region.gridHeight)
        newCamX = clamped.x
        newCamY = clamped.y
      }

      cameraX.set(newCamX)
      cameraY.set(newCamY)
    },
    [cameraX, cameraY, zoom],
  )

  const handlePanPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!dragRef.current.dragging) return
      dragRef.current.dragging = false

      // 拖拽结束后同步到 store
      syncToStore()
    },
    [syncToStore],
  )

  return {
    cameraX,
    cameraY,
    zoom,
    svgTransform,
    handleWheel,
    handlePanPointerDown,
    handlePanPointerMove,
    handlePanPointerUp,
  }
}
