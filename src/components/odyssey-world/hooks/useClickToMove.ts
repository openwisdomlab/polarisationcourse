/**
 * useClickToMove.ts -- 点击移动导航系统
 *
 * 处理场景点击事件，将屏幕坐标转换为世界坐标，
 * 驱动头像移动和摄像机跟随动画。
 * 使用 Framer Motion animate() 实现弹簧物理动画。
 *
 * Phase 3 扩展:
 * - 过渡期间阻断所有点击 (isTransitioning guard)
 * - 导航完成后检测边界接近，自动触发区域过渡
 * - onBoundaryDetected 回调允许外部传入过渡触发器
 */

import { useCallback, useRef, useEffect } from 'react'
import {
  type MotionValue,
  useMotionValue,
  animate,
  type AnimationPlaybackControls,
} from 'framer-motion'
import { screenToWorldWithCamera, worldToScreen } from '@/lib/isometric'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import {
  checkBoundaryProximity,
  type BoundaryProximityResult,
} from './useRegionTransition'

export interface ClickToMoveReturn {
  handleSceneClick: (e: React.MouseEvent<HTMLDivElement>) => void
  avatarScreenX: MotionValue<number>
  avatarScreenY: MotionValue<number>
}

/** 边界检测回调: 导航完成后如果接近边界则调用 */
export type OnBoundaryDetected = (result: BoundaryProximityResult) => void

/**
 * 点击移动 Hook
 *
 * 接收摄像机 MotionValue，返回点击处理器和头像屏幕坐标。
 * 点击时：屏幕坐标 -> 世界坐标 -> 更新 store -> 动画头像和摄像机。
 */
export function useClickToMove(
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
  onBoundaryDetected?: OnBoundaryDetected,
): ClickToMoveReturn {
  // 头像在 SVG 坐标系中的位置 (未经摄像机变换的屏幕坐标)
  const store = useOdysseyWorldStore.getState()
  const initialScreen = worldToScreen(store.avatarX, store.avatarY)
  const avatarScreenX = useMotionValue(initialScreen.x)
  const avatarScreenY = useMotionValue(initialScreen.y)

  // 存储当前动画控制，用于中断
  const animControlsRef = useRef<AnimationPlaybackControls[]>([])

  // 监听 store 初始化，同步初始头像位置
  useEffect(() => {
    const unsub = useOdysseyWorldStore.subscribe(
      (state) => state.sceneLoaded,
      (loaded) => {
        if (loaded) {
          const s = useOdysseyWorldStore.getState()
          const screen = worldToScreen(s.avatarX, s.avatarY)
          avatarScreenX.set(screen.x)
          avatarScreenY.set(screen.y)
        }
      },
    )
    return unsub
  }, [avatarScreenX, avatarScreenY])

  const handleSceneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 过渡期间阻断所有点击
      if (useOdysseyWorldStore.getState().isTransitioning) return

      // 获取点击相对于容器的屏幕坐标
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      // 屏幕坐标 -> 世界坐标 (考虑摄像机偏移和缩放)
      const world = screenToWorldWithCamera(
        clickX,
        clickY,
        cameraX.get(),
        cameraY.get(),
        zoom.get(),
      )

      // 通知 store 开始导航
      useOdysseyWorldStore.getState().navigateTo(world.x, world.y)

      // 计算目标的屏幕坐标 (SVG 坐标系)
      const targetScreen = worldToScreen(world.x, world.y)

      // 中断之前的动画
      for (const ctrl of animControlsRef.current) {
        ctrl.stop()
      }
      animControlsRef.current = []

      // 弹簧动画配置
      const springConfig = {
        type: 'spring' as const,
        stiffness: 80,
        damping: 18,
      }

      // 动画头像到目标位置
      const avatarAnimX = animate(avatarScreenX, targetScreen.x, springConfig)
      const avatarAnimY = animate(avatarScreenY, targetScreen.y, springConfig)

      // 动画摄像机跟随 (摄像机目标 = 目标屏幕坐标 - 视口中心偏移)
      // 让头像目标点大致在视口中央
      const viewportW = rect.width
      const viewportH = rect.height
      const currentZoom = zoom.get()
      const camTargetX = targetScreen.x - viewportW / (2 * currentZoom)
      const camTargetY = targetScreen.y - viewportH / (2 * currentZoom)

      const camAnimX = animate(cameraX, camTargetX, springConfig)
      const camAnimY = animate(cameraY, camTargetY, springConfig)

      animControlsRef.current = [avatarAnimX, avatarAnimY, camAnimX, camAnimY]

      // 动画完成后通知 store
      Promise.all([
        avatarAnimX.then(() => {}),
        avatarAnimY.then(() => {}),
      ]).then(() => {
        useOdysseyWorldStore.getState().onNavigationComplete()
        // 同步最终摄像机位置到 store
        const storeRef = useOdysseyWorldStore.getState()
        storeRef.setCamera(cameraX.get(), cameraY.get())

        // 导航完成后检测边界接近 -- 触发区域过渡
        if (onBoundaryDetected) {
          const { avatarX, avatarY, activeRegionId } = storeRef
          const boundary = checkBoundaryProximity(avatarX, avatarY, activeRegionId)
          if (boundary) {
            onBoundaryDetected(boundary)
          }
        }
      })
    },
    [cameraX, cameraY, zoom, avatarScreenX, avatarScreenY, onBoundaryDetected],
  )

  return { handleSceneClick, avatarScreenX, avatarScreenY }
}
