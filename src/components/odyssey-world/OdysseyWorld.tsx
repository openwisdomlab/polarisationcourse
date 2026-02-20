/**
 * OdysseyWorld.tsx -- Odyssey 等距世界根组件
 *
 * 组合场景渲染、摄像机系统、导航系统和 HUD 叠加层。
 * 从 Zustand store 读取场景元素和光束段数据，
 * 传递给 IsometricScene 进行渲染。
 */

import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { useIsometricCamera } from './hooks/useIsometricCamera'
import { useClickToMove } from './hooks/useClickToMove'
import { IsometricScene } from './IsometricScene'
import { HUD } from './HUD'

/**
 * OdysseyWorld -- 等距光学世界
 *
 * 全视口渲染，无滚动条。
 * 摄像机使用 MotionValue (CSS transform, GPU 合成)。
 * 场景元素从 Zustand store 读取。
 */
export function OdysseyWorld() {
  // 摄像机系统 (MotionValue 驱动，不触发 React 重渲染)
  const { cameraX, cameraY, zoom, svgTransform, handleWheel } = useIsometricCamera()

  // 点击移动系统
  const { handleSceneClick, avatarScreenX, avatarScreenY } = useClickToMove(
    cameraX,
    cameraY,
    zoom,
  )

  // 场景数据 (从 Zustand store 读取)
  const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#FAFAF5]">
      {/* 等距场景 */}
      <IsometricScene
        svgTransform={svgTransform}
        sceneElements={sceneElements}
        avatarScreenX={avatarScreenX}
        avatarScreenY={avatarScreenY}
        onSceneClick={handleSceneClick}
        onWheel={handleWheel}
      />

      {/* HUD 叠加层 */}
      <HUD />
    </div>
  )
}
