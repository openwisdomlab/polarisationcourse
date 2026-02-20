/**
 * useRegionTransition.ts -- 区域过渡编排 Hook
 *
 * 管理区域间的平滑过渡动画:
 * - 边界检测: 头像接近区域边缘时触发过渡
 * - 摄像机滑动: 弹簧动画平移到新区域 (~1.0s 常规, ~1.5s 首次)
 * - 头像传送: 淡出 -> 区域切换 -> 淡入
 * - 首次进入: 缩放弧形揭示动画 (zoom 0.8 -> 1.0)
 * - 交互阻断: 过渡期间所有点击/拖拽无效
 *
 * 调用 store.switchRegion 执行原子区域切换。
 */

import { useCallback } from 'react'
import { type MotionValue, animate } from 'framer-motion'
import { worldToScreen } from '@/lib/isometric'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import {
  getRegionById,
  type RegionBoundary,
} from '@/components/odyssey-world/regions/regionRegistry'

/** 边界检测结果 */
export interface BoundaryProximityResult {
  boundary: RegionBoundary
  targetRegionId: string
  entryPoint: { x: number; y: number }
}

/** 边界接近检测半径 (世界网格单位) */
const BOUNDARY_PROXIMITY_RADIUS = 0.8

/**
 * 检测头像是否接近当前区域的某个边界出口点
 *
 * 遍历当前区域的所有边界定义，检查头像位置与出口点的距离。
 * 如果距离小于 BOUNDARY_PROXIMITY_RADIUS，返回匹配的边界信息。
 *
 * @param avatarX 头像世界坐标 X
 * @param avatarY 头像世界坐标 Y
 * @param activeRegionId 当前活跃区域 ID
 * @returns 匹配的边界信息，或 null
 */
export function checkBoundaryProximity(
  avatarX: number,
  avatarY: number,
  activeRegionId: string,
): BoundaryProximityResult | null {
  const region = getRegionById(activeRegionId)

  for (const boundary of region.boundaries) {
    const dx = avatarX - boundary.exitPoint.x
    const dy = avatarY - boundary.exitPoint.y
    const dist = Math.hypot(dx, dy)

    if (dist < BOUNDARY_PROXIMITY_RADIUS) {
      return {
        boundary,
        targetRegionId: boundary.targetRegionId,
        entryPoint: boundary.entryPoint,
      }
    }
  }

  return null
}

/**
 * 区域过渡 Hook
 *
 * 接收摄像机和头像 MotionValue，返回过渡触发器和状态。
 * 过渡流程:
 * 1. 检测 isTransitioning 防止重复触发
 * 2. 设置过渡状态 (阻断交互)
 * 3. 等待 200ms 头像淡出 (Avatar 组件监听 isTransitioning)
 * 4. 执行原子区域切换 (store.switchRegion)
 * 5. 设置头像 MotionValue 到入口点
 * 6. 摄像机弹簧滑动到入口点 (首次: 更慢 + 缩放弧)
 * 7. 结束过渡，标记区域已访问
 *
 * @param cameraX 摄像机 X MotionValue
 * @param cameraY 摄像机 Y MotionValue
 * @param zoom 缩放 MotionValue
 * @param avatarScreenX 头像屏幕 X MotionValue
 * @param avatarScreenY 头像屏幕 Y MotionValue
 */
export function useRegionTransition(
  cameraX: MotionValue<number>,
  cameraY: MotionValue<number>,
  zoom: MotionValue<number>,
  avatarScreenX: MotionValue<number>,
  avatarScreenY: MotionValue<number>,
) {
  const isTransitioning = useOdysseyWorldStore((s) => s.isTransitioning)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)

  const initiateTransition = useCallback(
    async (targetRegionId: string, entryPoint: { x: number; y: number }) => {
      const store = useOdysseyWorldStore.getState()

      // 1. 防止重复触发
      if (store.isTransitioning) return

      // 2. 判断是否为首次进入
      const isFirstVisit = !store.visitedRegions.has(targetRegionId)

      // 3. 开始过渡 (阻断所有交互)
      store.setTransitioning(true, targetRegionId)

      // 4. 等待头像淡出 (Avatar 组件监听 isTransitioning 自动处理)
      await new Promise((resolve) => setTimeout(resolve, 200))

      // 5. 原子区域切换 (保存旧区域 + 加载新区域)
      store.switchRegion(targetRegionId, entryPoint)

      // 6. 设置头像位置到入口点
      const entryScreen = worldToScreen(entryPoint.x, entryPoint.y)
      avatarScreenX.set(entryScreen.x)
      avatarScreenY.set(entryScreen.y)

      // 7. 计算摄像机目标 (让入口点居中于视口)
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight
      const currentZoom = zoom.get()
      const camTargetX = entryScreen.x - viewportW / (2 * currentZoom)
      const camTargetY = entryScreen.y - viewportH / (2 * currentZoom)

      // 8. 摄像机弹簧滑动动画
      if (isFirstVisit) {
        // 首次进入: 更慢的过渡 + 缩放弧形揭示 (zoom 0.8 -> 1.0)
        const revealSpring = { type: 'spring' as const, stiffness: 40, damping: 18 }

        // 先将 zoom 设置到 0.8，然后动画回 1.0
        zoom.set(0.8)

        await Promise.all([
          animate(cameraX, camTargetX, revealSpring),
          animate(cameraY, camTargetY, revealSpring),
          animate(zoom, 1.0, revealSpring),
        ])
      } else {
        // 常规过渡: ~1.0s 弹簧滑动
        const normalSpring = { type: 'spring' as const, stiffness: 60, damping: 20 }

        await Promise.all([
          animate(cameraX, camTargetX, normalSpring),
          animate(cameraY, camTargetY, normalSpring),
        ])
      }

      // 9. 结束过渡
      store.setTransitioning(false, null)
      store.markRegionVisited(targetRegionId)

      // 10. 同步摄像机位置到 store
      store.setCamera(cameraX.get(), cameraY.get())
      store.setZoom(zoom.get())
    },
    [cameraX, cameraY, zoom, avatarScreenX, avatarScreenY],
  )

  return { initiateTransition, isTransitioning, activeRegionId }
}
