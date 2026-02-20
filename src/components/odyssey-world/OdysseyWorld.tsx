/**
 * OdysseyWorld.tsx -- Odyssey 等距世界根组件
 *
 * 组合场景渲染、摄像机系统、导航系统、光束预览和 HUD 叠加层。
 * 从 Zustand store 读取场景元素和光束段数据，
 * 传递给 IsometricScene 进行渲染。
 *
 * Phase 2 新增: useBeamPreview (幽灵光束预览) 和 containerRef (交互坐标转换)。
 */

import { useRef } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { useIsometricCamera } from './hooks/useIsometricCamera'
import { useClickToMove } from './hooks/useClickToMove'
import { useBeamPhysics } from './hooks/useBeamPhysics'
import { useBeamPreview } from './hooks/useBeamPreview'
import { IsometricScene } from './IsometricScene'
import { EnvironmentPopup } from './EnvironmentPopup'
import { HUD } from './HUD'

/**
 * OdysseyWorld -- 等距光学世界
 *
 * 全视口渲染，无滚动条。
 * 摄像机使用 MotionValue (CSS transform, GPU 合成)。
 * 场景元素从 Zustand store 读取。
 */
export function OdysseyWorld() {
  // 场景容器 ref -- 交互 hooks 需要用于 getBoundingClientRect 坐标转换
  const containerRef = useRef<HTMLDivElement>(null)

  // 摄像机系统 (MotionValue 驱动，不触发 React 重渲染)
  const { cameraX, cameraY, zoom, svgTransform, handleWheel } = useIsometricCamera()

  // 点击移动系统
  const { handleSceneClick, avatarScreenX, avatarScreenY } = useClickToMove(
    cameraX,
    cameraY,
    zoom,
  )

  // 光束物理计算 (场景元素变化时重新计算偏振态 + 视觉编码)
  useBeamPhysics()

  // 幽灵光束预览 (拖拽元素时显示临时光束路径)
  const { previewSegments } = useBeamPreview()

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
        containerRef={containerRef}
        cameraX={cameraX}
        cameraY={cameraY}
        zoom={zoom}
        previewSegments={previewSegments}
      />

      {/* 环境属性弹窗 (HTML 叠加层，定位在场景元素上方) */}
      <EnvironmentPopup />

      {/* HUD 叠加层 */}
      <HUD />
    </div>
  )
}
