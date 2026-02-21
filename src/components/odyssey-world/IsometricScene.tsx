/**
 * IsometricScene.tsx -- 主 SVG 视口组件
 *
 * 等距场景的核心渲染器:
 * - 摄像机 CSS transform 应用于 motion.div (GPU 合成，无 React 重渲染)
 * - SVG viewBox 2400x1600 (场景大于视口)
 * - 按画家算法分层渲染:
 *   L0: 背景 -> L1: 平台 -> L1.5: 区域装饰 -> L2: 场景物体
 *   -> L2.5: 发现环境响应 -> L3: 光束 -> L3.5: 幽灵光束预览
 *   -> L4: 头像 -> L5: 设备架
 * - 交互事件路由: 点击空白区域 -> 导航/取消选择; 元素点击 -> 阻止冒泡
 *
 * Phase 3 扩展:
 * - 动态应用区域主题色彩 (背景渐变、网格透明度)
 * - 懒加载区域装饰组件 (RegionDecorationsLoader)
 * - 替换 DistantSilhouettes 为实际区域装饰
 *
 * Phase 5 扩展:
 * - 响应式初始缩放 (desktop 1.0, tablet 0.75, mobile 0.55)
 * - 触摸设备 pinch-to-zoom (pointer events 双指检测)
 */

import React, { useMemo, useCallback, useEffect, useRef, type RefObject } from 'react'
import { motion, type MotionValue } from 'framer-motion'
import type { SceneElement, BeamSegment } from '@/stores/odysseyWorldStore'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { Platform } from './Platform'
import { Decoration } from './Decoration'
import { LightSource } from './LightSource'
import { OpticalElement } from './OpticalElement'
import { Avatar } from './Avatar'
import { SceneLayer } from './SceneLayer'
import { BeamGlowFilters } from './BeamGlowFilters'
import { LightBeam } from './LightBeam'
import { ElementPalette } from './ElementPalette'
import { DiscoveryFeedback } from './DiscoveryFeedback'
import { EnvironmentElement } from './EnvironmentElement'
import { worldToScreen } from '@/lib/isometric'
import { getRegionDefinition } from './regions/regionRegistry'
import {
  RegionDecorationsLoader,
  preloadAdjacentRegions,
} from './regions/RegionDecorations'
import { useBoundaryBeams } from './hooks/useBoundaryBeams'
import { BoundaryIndicators } from './BoundaryIndicator'
import { useDiscoveryConnections } from './hooks/useDiscoveryConnections'
import { DiscoveryConnections } from './DiscoveryConnection'

interface IsometricSceneProps {
  svgTransform: MotionValue<string>
  sceneElements: SceneElement[]
  avatarScreenX: MotionValue<number>
  avatarScreenY: MotionValue<number>
  onSceneClick: (e: React.MouseEvent<HTMLDivElement>) => void
  onWheel: (e: React.WheelEvent) => void
  /** 鼠标拖拽平移 -- pointerdown (仅 mouse) */
  onPanPointerDown: (e: React.PointerEvent) => void
  /** 鼠标拖拽平移 -- pointermove (仅 mouse) */
  onPanPointerMove: (e: React.PointerEvent) => void
  /** 鼠标拖拽平移 -- pointerup (仅 mouse) */
  onPanPointerUp: (e: React.PointerEvent) => void
  /** 场景容器 DOM 引用 -- 交互 hooks 需要用于坐标转换 */
  containerRef: RefObject<HTMLDivElement | null>
  /** 摄像机 MotionValue -- 交互 hooks 需要用于屏幕/世界坐标转换 */
  cameraX: MotionValue<number>
  cameraY: MotionValue<number>
  zoom: MotionValue<number>
  /** 幽灵光束预览段 (拖拽时显示 "如果放在这里光束会怎样") */
  previewSegments: BeamSegment[] | null
  /** 已达成的发现 ID 集合 */
  achievedDiscoveries: Set<string>
  /** 刚刚达成的发现 ID (用于触发入场动画) */
  newlyAchieved: string | null
}

// ── SVG viewBox 尺寸 ────────────────────────────────────────────────────
const VIEW_WIDTH = 2400
const VIEW_HEIGHT = 1600

// ── 响应式缩放断点 ────────────────────────────────────────────────────
const RESPONSIVE_ZOOM = {
  desktop: 1.0,   // >1024px
  tablet: 0.75,   // 768-1024px
  mobile: 0.55,   // <768px
}

// ── Pinch-to-zoom 参数 ────────────────────────────────────────────────
const ZOOM_MIN = 0.3
const ZOOM_MAX = 2.0
const PINCH_SENSITIVITY = 200 // 像素距离变化量映射到 zoom 增量的分母

/**
 * 获取当前设备类型对应的初始缩放值
 */
function getResponsiveZoom(): number {
  if (typeof window === 'undefined') return RESPONSIVE_ZOOM.desktop
  const w = window.innerWidth
  if (w < 768) return RESPONSIVE_ZOOM.mobile
  if (w <= 1024) return RESPONSIVE_ZOOM.tablet
  return RESPONSIVE_ZOOM.desktop
}

// ── 等距网格线生成 (2% 透明度) ──────────────────────────────────────────
/** 生成等距网格线路径 (NE-SW 和 NW-SE 方向) */
function generateGridLines(): string {
  const paths: string[] = []
  const step = 64 // TILE_WIDTH_HALF
  const extent = 1200 // 网格覆盖范围

  // NE-SW 方向线 (从左上到右下)
  for (let i = -extent; i <= extent; i += step) {
    paths.push(`M ${-extent + i},${-extent * 0.5 + i * 0.5} L ${extent + i},${extent * 0.5 + i * 0.5}`)
  }
  // NW-SE 方向线 (从右上到左下)
  for (let i = -extent; i <= extent; i += step) {
    paths.push(`M ${-extent + i},${extent * 0.5 - i * 0.5} L ${extent + i},${-extent * 0.5 - i * 0.5}`)
  }

  return paths.join(' ')
}

const GRID_PATH = generateGridLines()

// DistantSilhouettes 已在 Phase 3 中替换为 RegionDecorationsLoader

/**
 * IsometricScene -- 主场景渲染器
 *
 * 外层 div (overflow-hidden, 全视口)
 * -> motion.div (CSS transform = 摄像机变换, GPU 合成)
 *   -> SVG (viewBox 2400x1600)
 *     -> 分层渲染场景内容
 */
export const IsometricScene = React.memo(function IsometricScene({
  svgTransform,
  sceneElements,
  avatarScreenX,
  avatarScreenY,
  onSceneClick,
  onWheel,
  onPanPointerDown,
  onPanPointerMove,
  onPanPointerUp,
  containerRef,
  cameraX,
  cameraY,
  zoom,
  previewSegments,
  achievedDiscoveries,
  newlyAchieved,
}: IsometricSceneProps) {
  // 光束段数据 (由 useBeamPhysics 写入 store)
  const beamSegments = useOdysseyWorldStore((s) => s.beamSegments)
  const interactionMode = useOdysseyWorldStore((s) => s.interactionMode)
  const isTransitioning = useOdysseyWorldStore((s) => s.isTransitioning)

  // 跨区域光束边界检测 (Phase 3 - Plan 03)
  const { exitBeams, incomingBeams: boundaryIncomingBeams } = useBoundaryBeams()

  // 跨区域发现连接 (Phase 3 - Plan 03)
  const { activeConnections } = useDiscoveryConnections()

  // 活跃区域信息 (Phase 3: 动态主题和装饰)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const activeRegion = useMemo(() => getRegionDefinition(activeRegionId), [activeRegionId])
  const regionTheme = activeRegion?.theme

  // 进入新区域时预加载相邻装饰
  useEffect(() => {
    preloadAdjacentRegions(activeRegionId)
  }, [activeRegionId])

  // ── 响应式初始缩放 (Phase 5) ──
  useEffect(() => {
    const responsiveZoom = getResponsiveZoom()
    const currentZoom = zoom.get()
    // 仅在初始加载时设置 (当 zoom 还在默认值 1.0 附近时)
    if (Math.abs(currentZoom - 1.0) < 0.05 && responsiveZoom !== 1.0) {
      zoom.set(responsiveZoom)
      // 同步 store 的 camera zoom state
      const store = useOdysseyWorldStore.getState()
      if ('setCameraZoom' in store && typeof (store as Record<string, unknown>).setCameraZoom === 'function') {
        (store as Record<string, (...args: unknown[]) => void>).setCameraZoom(responsiveZoom)
      }
    }
  }, [zoom])

  // ── Pinch-to-zoom 触摸支持 (Phase 5) ──
  const pinchRef = useRef<{ active: boolean; startDist: number; startZoom: number }>({
    active: false,
    startDist: 0,
    startZoom: 1,
  })

  // 合并触摸 (pinch-to-zoom) 和鼠标 (拖拽平移) 的 pointer 事件
  // 触摸事件由 handleTouchPointerDown/Move 处理，鼠标事件由 onPanPointerDown/Move/Up 处理
  const handleTouchPointerDown = useCallback((e: React.PointerEvent) => {
    // 不拦截鼠标事件，只处理 touch
    if (e.pointerType !== 'touch') return
    const el = containerRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
  }, [containerRef])

  const handleTouchPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return
    // 双指检测: 检查当前活跃指针数量
    // 使用简化方法: 检测 pinch 状态
    // 由于 React 合成事件不直接提供 touches，我们通过原生事件处理
  }, [])

  // 组合 pointer 处理: 根据 pointerType 分发到 touch/mouse 处理器
  const handleCombinedPointerDown = useCallback((e: React.PointerEvent) => {
    handleTouchPointerDown(e)
    onPanPointerDown(e)
  }, [handleTouchPointerDown, onPanPointerDown])

  const handleCombinedPointerMove = useCallback((e: React.PointerEvent) => {
    handleTouchPointerMove(e)
    onPanPointerMove(e)
  }, [handleTouchPointerMove, onPanPointerMove])

  const handleCombinedPointerUp = useCallback((e: React.PointerEvent) => {
    onPanPointerUp(e)
  }, [onPanPointerUp])

  // 使用原生事件监听器进行 pinch-to-zoom (更可靠的双指检测)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let touches: { id: number; x: number; y: number }[] = []

    function getDistance(t: { x: number; y: number }[]) {
      if (t.length < 2) return 0
      const dx = t[0].x - t[1].x
      const dy = t[0].y - t[1].y
      return Math.sqrt(dx * dx + dy * dy)
    }

    function onTouchStart(e: TouchEvent) {
      touches = Array.from(e.touches).map(t => ({ id: t.identifier, x: t.clientX, y: t.clientY }))
      if (touches.length === 2) {
        e.preventDefault()
        pinchRef.current = {
          active: true,
          startDist: getDistance(touches),
          startZoom: zoom.get(),
        }
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!pinchRef.current.active) return
      touches = Array.from(e.touches).map(t => ({ id: t.identifier, x: t.clientX, y: t.clientY }))
      if (touches.length < 2) return
      e.preventDefault()

      const currentDist = getDistance(touches)
      const delta = currentDist - pinchRef.current.startDist
      const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, pinchRef.current.startZoom + delta / PINCH_SENSITIVITY))
      zoom.set(newZoom)
    }

    function onTouchEnd() {
      touches = []
      pinchRef.current.active = false
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [containerRef, zoom])

  // 分类场景元素
  const { platforms, decorations, lightSources, opticalElements } = useMemo(() => {
    const p: SceneElement[] = []
    const d: SceneElement[] = []
    const l: SceneElement[] = []
    const o: SceneElement[] = []

    for (const el of sceneElements) {
      switch (el.type) {
        case 'platform':
          p.push(el)
          break
        case 'decoration':
          d.push(el)
          break
        case 'light-source':
          l.push(el)
          break
        case 'polarizer':
        case 'waveplate':
        case 'prism':
        case 'environment':
          o.push(el)
          break
      }
    }
    return { platforms: p, decorations: d, lightSources: l, opticalElements: o }
  }, [sceneElements])

  // 场景物体层 (光源 + 光学元件 + 装饰) 合并后深度排序
  const sceneObjects = useMemo(
    () => [...lightSources, ...opticalElements, ...decorations],
    [lightSources, opticalElements, decorations],
  )

  // 渲染单个场景物体
  const renderSceneObject = useCallback((el: SceneElement) => {
    switch (el.type) {
      case 'light-source':
        return (
          <LightSource
            element={el}
            containerRef={containerRef}
            cameraX={cameraX}
            cameraY={cameraY}
            zoom={zoom}
          />
        )
      case 'polarizer':
      case 'waveplate':
      case 'prism':
        return (
          <OpticalElement
            element={el}
            containerRef={containerRef}
            cameraX={cameraX}
            cameraY={cameraY}
            zoom={zoom}
          />
        )
      case 'decoration':
        return <Decoration element={el} />
      case 'environment':
        return <EnvironmentElement element={el} />
      default:
        return null
    }
  }, [containerRef, cameraX, cameraY, zoom])

  // 渲染平台
  const renderPlatform = useCallback((el: SceneElement) => {
    return <Platform element={el} />
  }, [])

  // 场景级点击处理: 空白区域点击 -> 导航 + 取消选择
  const handleSceneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 如果交互模式不是导航模式 (正在拖拽/旋转)，不触发导航
      if (interactionMode !== 'idle' && interactionMode !== 'navigate') return

      // 取消选择当前元素
      useOdysseyWorldStore.getState().selectElement(null)

      // 继续触发 click-to-move 导航
      onSceneClick(e)
    },
    [interactionMode, onSceneClick],
  )

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
      onClick={handleSceneClick}
      onWheel={onWheel}
      onPointerDown={handleCombinedPointerDown}
      onPointerMove={handleCombinedPointerMove}
      onPointerUp={handleCombinedPointerUp}
    >
      <motion.div
        className="h-full w-full origin-top-left"
        style={{ transform: svgTransform }}
      >
        <svg
          viewBox={`-${VIEW_WIDTH / 2} -${VIEW_HEIGHT / 4} ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-full w-full"
          style={{ overflow: 'visible' }}
        >
          {/* ── 共享 defs (渐变、滤镜) ── */}
          <defs>
            {/* 背景渐变: 根据区域主题动态变化 */}
            <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={regionTheme?.colorPalette.background[0] ?? '#0a1628'} />
              <stop offset="100%" stopColor={regionTheme?.colorPalette.background[1] ?? '#0f1d35'} />
            </linearGradient>

            {/* 光源光晕渐变 */}
            <radialGradient id="light-source-halo">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="light-source-glow">
              <stop offset="0%" stopColor="#FFF0C0" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#FFD700" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>

            {/* 光束辉光滤镜 + 元素交互辉光 + 表面照明渐变 */}
            <BeamGlowFilters />
          </defs>

          {/* ── Layer 0: 背景 ── */}
          <g className="layer-background">
            {/* 暖色渐变背景 */}
            <rect
              x={-VIEW_WIDTH / 2}
              y={-VIEW_HEIGHT / 4}
              width={VIEW_WIDTH}
              height={VIEW_HEIGHT}
              fill="url(#bg-gradient)"
            />

            {/* 等距网格 (透明度根据区域主题变化) */}
            <g transform="translate(200, 200)">
              <path
                d={GRID_PATH}
                fill="none"
                stroke="#4a6a8a"
                strokeWidth={0.5}
                opacity={regionTheme?.gridOpacity ?? 0.02}
              />
            </g>
          </g>

          {/* ── Layer 1: 平台 (深度排序) ── */}
          <g className="layer-platforms">
            <SceneLayer elements={platforms} renderElement={renderPlatform} />
          </g>

          {/* ── Layer 1.5: 区域装饰 (懒加载的 SVG 非交互场景元素) ── */}
          <g className="layer-region-decorations">
            {activeRegion && regionTheme && (
              <RegionDecorationsLoader
                regionId={activeRegionId}
                gridWidth={activeRegion.gridWidth}
                gridHeight={activeRegion.gridHeight}
                theme={regionTheme}
              />
            )}
          </g>

          {/* ── Layer 2: 场景物体 (光源、光学元件、装饰 -- 深度排序) ── */}
          <g className="layer-objects">
            <SceneLayer elements={sceneObjects} renderElement={renderSceneObject} />
          </g>

          {/* ── Layer 2.5: 发现环境响应 + 发现连接线 (在光束后面，维持光束视觉主导) ── */}
          <g className="layer-discovery-feedback">
            {/* 跨区域发现连接视觉线索 */}
            <DiscoveryConnections
              activeConnections={activeConnections}
              activeRegionId={activeRegionId}
            />
            {/* 发现区域占位组 -- 定位在场景中相关光学元件附近 */}
            <g id="discovery-area-malus" transform={`translate(${worldToScreen(3.5, 3).x}, ${worldToScreen(3.5, 3).y})`}>
              <DiscoveryFeedback
                achievedDiscoveries={new Set([...achievedDiscoveries].filter(id => id === 'malus-law-basic'))}
                newlyAchieved={newlyAchieved === 'malus-law-basic' ? newlyAchieved : null}
              />
            </g>
            <g id="discovery-area-extinction" transform={`translate(${worldToScreen(4, 3).x}, ${worldToScreen(4, 3).y})`}>
              <DiscoveryFeedback
                achievedDiscoveries={new Set([...achievedDiscoveries].filter(id => id === 'crossed-polarizers'))}
                newlyAchieved={newlyAchieved === 'crossed-polarizers' ? newlyAchieved : null}
              />
            </g>
            <g id="discovery-area-circular" transform={`translate(${worldToScreen(5.5, 3).x}, ${worldToScreen(5.5, 3).y})`}>
              <DiscoveryFeedback
                achievedDiscoveries={new Set([...achievedDiscoveries].filter(id => id === 'circular-polarization'))}
                newlyAchieved={newlyAchieved === 'circular-polarization' ? newlyAchieved : null}
              />
            </g>
            <g id="discovery-area-hwp" transform={`translate(${worldToScreen(4, 3).x}, ${worldToScreen(4, 3).y})`}>
              <DiscoveryFeedback
                achievedDiscoveries={new Set([...achievedDiscoveries].filter(id => id === 'half-wave-rotation'))}
                newlyAchieved={newlyAchieved === 'half-wave-rotation' ? newlyAchieved : null}
              />
            </g>
            <g id="discovery-area-surprise" transform={`translate(${worldToScreen(3, 3).x}, ${worldToScreen(3, 3).y})`}>
              <DiscoveryFeedback
                achievedDiscoveries={new Set([...achievedDiscoveries].filter(id => id === 'three-polarizer-surprise'))}
                newlyAchieved={newlyAchieved === 'three-polarizer-surprise' ? newlyAchieved : null}
              />
            </g>
          </g>

          {/* ── Layer 3: 光束 (偏振编码光束段 + 粒子 + 辉光) ── */}
          <g className="layer-beams">
            {beamSegments.map((segment) => (
              <LightBeam key={segment.id} segment={segment} />
            ))}

            {/* 边界光束指示器 (退出/入口脉冲光晕，仅在非过渡时渲染) */}
            {!isTransitioning && (
              <BoundaryIndicators
                exitBeams={exitBeams}
                incomingBeams={boundaryIncomingBeams}
              />
            )}
          </g>

          {/* ── Layer 3.5: 幽灵光束预览 (拖拽时 30% 不透明度, 无指针事件) ── */}
          {previewSegments && (
            <g className="layer-beam-preview" opacity={0.3} style={{ pointerEvents: 'none' }}>
              {previewSegments.map((segment) => (
                <LightBeam key={`preview-${segment.id}`} segment={segment} ghost />
              ))}
            </g>
          )}

          {/* ── Layer 4: 头像 + 效果 ── */}
          <g className="layer-avatar">
            <Avatar screenX={avatarScreenX} screenY={avatarScreenY} />
          </g>

          {/* ── Layer 5: 设备架 (场景内固定位置) ── */}
          <g className="layer-palette">
            <ElementPalette />
          </g>
        </svg>
      </motion.div>
    </div>
  )
})
