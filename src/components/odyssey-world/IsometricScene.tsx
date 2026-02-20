/**
 * IsometricScene.tsx -- 主 SVG 视口组件
 *
 * 等距场景的核心渲染器:
 * - 摄像机 CSS transform 应用于 motion.div (GPU 合成，无 React 重渲染)
 * - SVG viewBox 2400x1600 (场景大于视口)
 * - 按画家算法分层渲染:
 *   L0: 背景 -> L1: 平台 -> L2: 场景物体 -> L3: 光束
 *   -> L3.5: 幽灵光束预览 -> L4: 头像 -> L5: 设备架
 * - 交互事件路由: 点击空白区域 -> 导航/取消选择; 元素点击 -> 阻止冒泡
 */

import React, { useMemo, useCallback, type RefObject } from 'react'
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

interface IsometricSceneProps {
  svgTransform: MotionValue<string>
  sceneElements: SceneElement[]
  avatarScreenX: MotionValue<number>
  avatarScreenY: MotionValue<number>
  onSceneClick: (e: React.MouseEvent<HTMLDivElement>) => void
  onWheel: (e: React.WheelEvent) => void
  /** 场景容器 DOM 引用 -- 交互 hooks 需要用于坐标转换 */
  containerRef: RefObject<HTMLDivElement | null>
  /** 摄像机 MotionValue -- 交互 hooks 需要用于屏幕/世界坐标转换 */
  cameraX: MotionValue<number>
  cameraY: MotionValue<number>
  zoom: MotionValue<number>
  /** 幽灵光束预览段 (拖拽时显示 "如果放在这里光束会怎样") */
  previewSegments: BeamSegment[] | null
}

// ── SVG viewBox 尺寸 ────────────────────────────────────────────────────
const VIEW_WIDTH = 2400
const VIEW_HEIGHT = 1600

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

/**
 * 远方轮廓剪影 -- 场景边缘装饰
 * 暗示邻近区域的存在 (为 Phase 3 多区域做铺垫)
 */
function DistantSilhouettes() {
  return (
    <g opacity={0.12}>
      {/* 左侧 -- 远方实验室建筑轮廓 */}
      <g transform="translate(-700, 200)">
        <polygon points="0,-80 30,-120 60,-100 60,-40 40,-40 40,-70 20,-70 20,-40 0,-40" fill="#8890A0" />
        <polygon points="70,-60 90,-90 110,-70 110,-30 70,-30" fill="#8088A0" />
        <rect x={-10} y={-40} width={130} height={8} fill="#8890A0" opacity={0.6} />
      </g>

      {/* 右侧 -- 水晶/结晶体轮廓 */}
      <g transform="translate(1000, 300)">
        <polygon points="0,-100 15,-40 -15,-40" fill="#9088B0" />
        <polygon points="30,-70 42,-30 18,-30" fill="#8878A8" />
        <polygon points="-20,-50 -10,-20 -30,-20" fill="#9890B0" />
        <polygon points="50,-55 60,-25 40,-25" fill="#8880A0" />
      </g>

      {/* 上方 -- 远方山丘/穹顶轮廓 */}
      <g transform="translate(200, -200)">
        <ellipse cx={0} cy={0} rx={180} ry={40} fill="#A0A0B0" />
        <ellipse cx={250} cy={10} rx={120} ry={30} fill="#9898A8" />
        <ellipse cx={-200} cy={15} rx={100} ry={25} fill="#A0A0B0" />
      </g>

      {/* 下方 -- 实验台/仪器轮廓 */}
      <g transform="translate(400, 900)">
        <rect x={-80} y={0} width={200} height={12} rx={3} fill="#A09898" />
        <rect x={-60} y={-20} width={30} height={20} rx={2} fill="#989090" />
        <rect x={20} y={-30} width={20} height={30} rx={2} fill="#A09898" />
        <circle cx={80} cy={-15} r={12} fill="none" stroke="#989090" strokeWidth={3} />
      </g>
    </g>
  )
}

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
  containerRef,
  cameraX,
  cameraY,
  zoom,
  previewSegments,
}: IsometricSceneProps) {
  // 光束段数据 (由 useBeamPhysics 写入 store)
  const beamSegments = useOdysseyWorldStore((s) => s.beamSegments)
  const interactionMode = useOdysseyWorldStore((s) => s.interactionMode)

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
        return <LightSource element={el} />
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
            {/* 背景渐变: 暖白色 */}
            <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAFAF5" />
              <stop offset="100%" stopColor="#F0EDE6" />
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

            {/* 等距网格 (极低透明度，更多是感觉而非看见) */}
            <g transform="translate(200, 200)">
              <path
                d={GRID_PATH}
                fill="none"
                stroke="#C0B8A8"
                strokeWidth={0.5}
                opacity={0.02}
              />
            </g>

            {/* 远方区域轮廓 */}
            <DistantSilhouettes />
          </g>

          {/* ── Layer 1: 平台 (深度排序) ── */}
          <g className="layer-platforms">
            <SceneLayer elements={platforms} renderElement={renderPlatform} />
          </g>

          {/* ── Layer 2: 场景物体 (光源、光学元件、装饰 -- 深度排序) ── */}
          <g className="layer-objects">
            <SceneLayer elements={sceneObjects} renderElement={renderSceneObject} />
          </g>

          {/* ── Layer 3: 光束 (偏振编码光束段 + 粒子 + 辉光) ── */}
          <g className="layer-beams">
            {beamSegments.map((segment) => (
              <LightBeam key={segment.id} segment={segment} />
            ))}
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
