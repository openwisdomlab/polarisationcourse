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

export interface IsometricCameraReturn {
  cameraX: MotionValue<number>
  cameraY: MotionValue<number>
  zoom: MotionValue<number>
  svgTransform: MotionValue<string>
  handleWheel: (e: React.WheelEvent) => void
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
      cameraX.set(newCamX)
      cameraY.set(newCamY)

      // 缩放完成后同步到 store
      syncToStore()
    },
    [cameraX, cameraY, zoom, syncToStore],
  )

  return { cameraX, cameraY, zoom, svgTransform, handleWheel }
}
