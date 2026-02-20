/**
 * OdysseyWorld.tsx -- Odyssey 等距世界根组件
 *
 * 组合场景渲染、摄像机系统、导航系统、光束预览和 HUD 叠加层。
 * 从 Zustand store 读取场景元素和光束段数据，
 * 传递给 IsometricScene 进行渲染。
 *
 * Phase 2 新增: useBeamPreview (幽灵光束预览) 和 containerRef (交互坐标转换)。
 * Phase 2 Plan 04 新增: useDiscoveryState (发现系统) 和 PolarizationLegend (渐进图例)。
 * Phase 3 Plan 03 新增: WorldMap (星图世界地图) 和 useWorldMap (快速旅行)。
 */

import { useRef, useCallback } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { useIsometricCamera } from './hooks/useIsometricCamera'
import { useClickToMove } from './hooks/useClickToMove'
import { useBeamPhysics } from './hooks/useBeamPhysics'
import { useBeamPreview } from './hooks/useBeamPreview'
import { useDiscoveryState } from './hooks/useDiscoveryState'
import { useDiscoveryConnections } from './hooks/useDiscoveryConnections'
import { useRegionTransition, type BoundaryProximityResult } from './hooks/useRegionTransition'
import { useWorldMap } from './hooks/useWorldMap'
import { IsometricScene } from './IsometricScene'
import { EnvironmentPopup } from './EnvironmentPopup'
import { PolarizationLegend } from './PolarizationLegend'
import { RegionTransition } from './RegionTransition'
import { WorldMap } from './WorldMap'
import { DepthPanel } from './depth/DepthPanel'
import { ConceptTooltip } from './depth/ConceptTooltip'
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

  // 区域过渡系统 (需要在 useClickToMove 之前初始化以获取 initiateTransition)
  // avatarScreenX/Y 在 useClickToMove 中创建，因此先初始化占位
  // 实际连接在下方通过 onBoundaryDetected 回调完成

  // 边界检测回调 -- 由 useClickToMove 导航完成后触发
  const initiateTransitionRef = useRef<((targetRegionId: string, entryPoint: { x: number; y: number }) => void) | undefined>(undefined)

  const onBoundaryDetected = useCallback((result: BoundaryProximityResult) => {
    initiateTransitionRef.current?.(result.targetRegionId, result.entryPoint)
  }, [])

  // 点击移动系统 (Phase 3: 添加边界检测回调)
  const { handleSceneClick, avatarScreenX, avatarScreenY } = useClickToMove(
    cameraX,
    cameraY,
    zoom,
    onBoundaryDetected,
  )

  // 区域过渡系统 (使用 useClickToMove 的 MotionValue)
  const { initiateTransition } = useRegionTransition(
    cameraX,
    cameraY,
    zoom,
    avatarScreenX,
    avatarScreenY,
  )

  // 将 initiateTransition 存入 ref，供回调使用
  initiateTransitionRef.current = initiateTransition

  // 世界地图系统 (Phase 3 - Plan 03)
  const { isOpen: worldMapOpen, close: closeWorldMap, fastTravel } = useWorldMap(initiateTransitionRef)

  // 跨区域发现连接 (Phase 3 - Plan 03: 世界地图星图数据)
  const { allConnections, metaDiscoveries } = useDiscoveryConnections()

  // 光束物理计算 (场景元素变化时重新计算偏振态 + 视觉编码)
  useBeamPhysics()

  // 幽灵光束预览 (拖拽元素时显示临时光束路径)
  const { previewSegments } = useBeamPreview()

  // 发现系统 (监测物理配置变化，触发环境响应)
  const { achievedDiscoveries, newlyAchieved } = useDiscoveryState()

  // 编码发现状态 (渐进图例显示)
  const discoveredEncodings = useOdysseyWorldStore((s) => s.discoveredEncodings)

  // 场景数据 (从 Zustand store 读取)
  const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#FAFAF5]"
      style={{
        touchAction: 'none',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
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
        achievedDiscoveries={achievedDiscoveries}
        newlyAchieved={newlyAchieved}
      />

      {/* 环境属性弹窗 (HTML 叠加层，定位在场景元素上方) */}
      <EnvironmentPopup />

      {/* 偏振编码渐进图例 (HTML 叠加层，右下角) */}
      <PolarizationLegend discoveredEncodings={discoveredEncodings} />

      {/* 区域过渡覆盖层 (标题卡片 + 交互遮罩) */}
      <RegionTransition />

      {/* 世界地图叠加层 (星图风格, z-40) */}
      <WorldMap
        isOpen={worldMapOpen}
        onClose={closeWorldMap}
        onFastTravel={fastTravel}
        allConnections={allConnections}
        metaDiscoveries={metaDiscoveries}
      />

      {/* 概念悬停提示 (z-20, HTML 叠加层) */}
      <ConceptTooltip />

      {/* 深度面板叠加层 (遮罩 z-30, 面板 z-40) */}
      <DepthPanel />

      {/* HUD 叠加层 */}
      <HUD />
    </div>
  )
}
