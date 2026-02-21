/**
 * OpticalElement.tsx -- 交互式光学元件组件
 *
 * 支持完整的交互生命周期:
 * - 默认: Phase 1 造型 (偏振片平行线, 波片对角线)
 * - 悬停: 柔和辉光 + grab 光标
 * - 选中: 明亮轮廓 + 名称标签 + 旋转手柄 + grab 光标
 * - 拖拽: 半透明跟随指针 + grabbing 光标
 * - 旋转: 角度读数 + 自定义旋转光标
 *
 * 接线三个交互 Hook: useElementDrag, useElementRotation, useElementSelection
 */

import React, { useRef, useState, useCallback, type RefObject } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'
import { worldToScreen, worldToScreenWithCamera } from '@/lib/isometric'
import type { SceneElement } from '@/stores/odysseyWorldStore'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getConceptForElement } from './concepts/conceptRegistry'
import { useElementDrag } from './hooks/useElementDrag'
import { useElementRotation } from './hooks/useElementRotation'
import { useElementSelection } from './hooks/useElementSelection'

// 自定义旋转光标 (SVG data URI)
const ROTATE_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2a10 10 0 0 1 7.07 2.93l1.43-1.43V8h-4.5l1.56-1.56A8 8 0 1 0 20 12h2A10 10 0 1 1 12 2z' fill='%236CB4FF'/%3E%3C/svg%3E") 12 12, pointer`

export interface OpticalElementProps {
  element: SceneElement
  containerRef?: RefObject<HTMLDivElement | null>
  cameraX?: MotionValue<number>
  cameraY?: MotionValue<number>
  zoom?: MotionValue<number>
}

// ── 元件类型名称映射 ─────────────────────────────────────────────────

function getElementLabel(element: SceneElement): string {
  switch (element.type) {
    case 'polarizer': {
      const subtype = element.properties.type as string | undefined
      if (subtype === 'analyzer') return 'Analyzer'
      return 'Polarizer'
    }
    case 'waveplate': {
      const retardation = element.properties.retardation as number | undefined
      if (retardation === 180) return 'Half-Wave Plate'
      return 'Quarter-Wave Plate'
    }
    default:
      return 'Element'
  }
}

// ── 元件造型 ─────────────────────────────────────────────────────────

/** 偏振片造型 -- 竖直矩形 + 平行线纹 (传输轴方向) */
function PolarizerShape() {
  return (
    <g>
      <rect
        x={-10}
        y={-18}
        width={20}
        height={28}
        rx={2}
        fill="#E8EDF4"
        stroke="#8898B0"
        strokeWidth={1}
        opacity={0.85}
      />
      {[-12, -8, -4, 0, 4, 8].map((offset) => (
        <line
          key={offset}
          x1={-6}
          y1={offset}
          x2={6}
          y2={offset}
          stroke="#6880A0"
          strokeWidth={0.6}
          opacity={0.4}
        />
      ))}
      <circle cx={0} cy={-14} r={2.5} fill="#6880A0" opacity={0.3} />
      <rect x={-8} y={10} width={16} height={4} rx={1} fill="#C4C0B8" opacity={0.5} />
      <rect x={-4} y={14} width={8} height={3} rx={1} fill="#B8B4AC" opacity={0.4} />
    </g>
  )
}

/** 波片造型 -- 矩形 + 对角线阴影纹 (双折射) */
function WaveplateShape({ isHalfWave }: { isHalfWave: boolean }) {
  return (
    <g>
      <rect
        x={-10}
        y={-16}
        width={20}
        height={24}
        rx={2}
        fill="#F0E8F4"
        stroke="#9878B0"
        strokeWidth={1}
        opacity={0.85}
      />
      {/* 半波片: 双对角线 (更粗); 四分之一波片: 单对角线 */}
      {[-10, -6, -2, 2, 6].map((offset) => (
        <g key={offset}>
          <line
            x1={-6}
            y1={offset - 4}
            x2={6}
            y2={offset + 4}
            stroke="#8060A0"
            strokeWidth={isHalfWave ? 1 : 0.6}
            opacity={0.35}
          />
          {isHalfWave && (
            <line
              x1={-6}
              y1={offset - 2}
              x2={6}
              y2={offset + 6}
              stroke="#8060A0"
              strokeWidth={0.6}
              opacity={0.25}
            />
          )}
        </g>
      ))}
      <line x1={-5} y1={-12} x2={5} y2={-12} stroke="#8060A0" strokeWidth={0.8} opacity={0.5} />
      <polyline points="3,-14 5,-12 3,-10" fill="none" stroke="#8060A0" strokeWidth={0.8} opacity={0.5} />
      <rect x={-8} y={8} width={16} height={4} rx={1} fill="#C4C0B8" opacity={0.5} />
      <rect x={-4} y={12} width={8} height={3} rx={1} fill="#B8B4AC" opacity={0.4} />
    </g>
  )
}

// ── 旋转手柄 ─────────────────────────────────────────────────────────

/**
 * 旋转手柄: 90 度弧 + 末端圆点 + 刻度线
 *
 * 选中时显示。用户旋转过一次后淡化为 15% 不透明度 (提示模式)。
 * 悬停时恢复完整不透明度。
 */
function RotationHandle({
  isHintMode,
  isHovered,
  angle,
  onPointerDown,
}: {
  isHintMode: boolean
  isHovered: boolean
  angle: number
  onPointerDown: (e: React.PointerEvent) => void
}) {
  const radius = 30
  // 旋转手柄的整体不透明度
  const handleOpacity = isHintMode && !isHovered ? 0.15 : 0.8

  // 弧的起止角 (相对于元件当前角度): 当前角度 - 45 度到 + 45 度
  const startAngleDeg = angle - 45
  const endAngleDeg = angle + 45
  const startRad = (startAngleDeg * Math.PI) / 180
  const endRad = (endAngleDeg * Math.PI) / 180

  const x1 = Math.cos(startRad) * radius
  const y1 = Math.sin(startRad) * radius
  const x2 = Math.cos(endRad) * radius
  const y2 = Math.sin(endRad) * radius

  // SVG 弧路径: M startPoint A radius,radius 0 0,1 endPoint
  const arcPath = `M ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2}`

  // 刻度线: 0, 45, 90 度位置 (绝对角度)
  const tickAngles = [0, 45, 90]
  const tickLength = 4

  return (
    <g opacity={handleOpacity} style={{ transition: 'opacity 0.3s ease' }}>
      {/* 弧线 */}
      <path
        d={arcPath}
        fill="none"
        stroke="#6CB4FF"
        strokeWidth={1.2}
        strokeLinecap="round"
        style={{ pointerEvents: 'none' }}
      />

      {/* 刻度线 */}
      {tickAngles.map((tick) => {
        const tickRad = (tick * Math.PI) / 180
        const innerR = radius - tickLength
        return (
          <line
            key={tick}
            x1={Math.cos(tickRad) * innerR}
            y1={Math.sin(tickRad) * innerR}
            x2={Math.cos(tickRad) * radius}
            y2={Math.sin(tickRad) * radius}
            stroke="#6CB4FF"
            strokeWidth={0.8}
            opacity={0.5}
            style={{ pointerEvents: 'none' }}
          />
        )
      })}

      {/* 拖拽目标: 弧末端的小圆点 */}
      <circle
        cx={x2}
        cy={y2}
        r={5}
        fill="#6CB4FF"
        fillOpacity={0.4}
        stroke="#6CB4FF"
        strokeWidth={1}
        style={{ cursor: ROTATE_CURSOR }}
        onPointerDown={onPointerDown}
      />
    </g>
  )
}

// ── 角度读数 ─────────────────────────────────────────────────────────

function AngleReadout({ angle }: { angle: number }) {
  // 显示角度读数在弧末端附近
  const displayAngle = ((angle % 360) + 360) % 360
  const textRad = ((angle + 45) * Math.PI) / 180
  const textR = 40
  return (
    <text
      x={Math.cos(textRad) * textR}
      y={Math.sin(textRad) * textR}
      fontFamily="monospace"
      fontSize={10}
      fill="rgba(255,255,255,0.7)"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ pointerEvents: 'none' }}
    >
      {displayAngle.toFixed(1)}deg
    </text>
  )
}

// ── 主组件 ───────────────────────────────────────────────────────────

/**
 * 光学元件交互组件
 *
 * 完整交互生命周期:
 * hover -> select -> drag/rotate
 * 全部通过指针事件和 store 状态驱动。
 */
const OpticalElement = React.memo(function OpticalElement({
  element,
  containerRef: externalContainerRef,
  cameraX: externalCameraX,
  cameraY: externalCameraY,
  zoom: externalZoom,
}: OpticalElementProps) {
  const screen = worldToScreen(element.worldX, element.worldY)

  // 后备值: 当未传入交互 props 时使用默认值 (向后兼容)
  const fallbackRef = useRef<HTMLDivElement | null>(null)
  const fallbackCameraX = useMotionValue(0)
  const fallbackCameraY = useMotionValue(0)
  const fallbackZoom = useMotionValue(1)

  const resolvedContainerRef = externalContainerRef ?? fallbackRef
  const resolvedCameraX = externalCameraX ?? fallbackCameraX
  const resolvedCameraY = externalCameraY ?? fallbackCameraY
  const resolvedZoom = externalZoom ?? fallbackZoom

  // 概念悬停提示所需的 store actions
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const allTimeDiscoveries = useOdysseyWorldStore((s) => s.allTimeDiscoveries)
  const interactionMode = useOdysseyWorldStore((s) => s.interactionMode)
  const showConceptTooltip = useOdysseyWorldStore((s) => s.showConceptTooltip)
  const hideConceptTooltip = useOdysseyWorldStore((s) => s.hideConceptTooltip)

  // 引导系统: 是否已交互过此元素 (用于停止呼吸脉冲)
  const interactedElements = useOdysseyWorldStore((s) => s.interactedElements)
  const isInteracted = interactedElements.has(element.id)
  // 仅对可交互元素 (偏振片/波片) 显示脉冲
  const showAffordancePulse = !isInteracted && (element.type === 'polarizer' || element.type === 'waveplate')

  // 交互 hooks
  const selection = useElementSelection(element.id)
  const drag = useElementDrag(element.id, resolvedContainerRef, resolvedCameraX, resolvedCameraY, resolvedZoom)
  const rotation = useElementRotation(element.id, resolvedContainerRef, resolvedCameraX, resolvedCameraY, resolvedZoom)

  // 跟踪是否已旋转过 (用于旋转手柄提示模式)
  const [hasRotated, setHasRotated] = useState(false)
  const [handleHovered, setHandleHovered] = useState(false)

  // 元件造型
  let shape: React.ReactNode
  const isHalfWave = element.type === 'waveplate' && element.properties.retardation === 180
  switch (element.type) {
    case 'polarizer':
      shape = <PolarizerShape />
      break
    case 'waveplate':
      shape = <WaveplateShape isHalfWave={isHalfWave} />
      break
    default:
      shape = <rect x={-8} y={-8} width={16} height={16} fill="#CCC" opacity={0.5} />
  }

  // 交互状态派生
  const { isSelected, isHovered } = selection
  const { isDragging } = drag
  const { isRotating, currentAngle } = rotation

  // 滤镜选择 (视觉状态)
  let filterUrl: string | undefined
  if (isSelected) {
    filterUrl = 'url(#element-select-glow)'
  } else if (isHovered) {
    filterUrl = 'url(#element-hover-glow)'
  }

  // 光标选择
  let cursor = 'default'
  if (isRotating) {
    cursor = ROTATE_CURSOR
  } else if (isDragging) {
    cursor = 'grabbing'
  } else if (isHovered || isSelected) {
    cursor = 'grab'
  }

  // 拖拽时不透明度降低
  const groupOpacity = isDragging ? 0.6 : 1

  // 显示角度: 旋转中使用实时角度，否则使用元素存储角度
  const displayAngle = isRotating ? currentAngle : element.rotation

  // 指针事件处理: 路由到正确的 hook
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    selection.onPointerDown(e)
    drag.onPointerDown(e)
    // 标记元素为已交互 (停止呼吸脉冲)
    if (!isInteracted) {
      useOdysseyWorldStore.getState().markElementInteracted(element.id)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    e.stopPropagation()
    // 根据当前模式路由: 旋转优先于拖拽
    if (rotation.isRotating) {
      rotation.onRotatePointerMove(e)
    } else {
      drag.onPointerMove(e)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation()
    if (rotation.isRotating) {
      rotation.onRotatePointerUp(e)
      setHasRotated(true)
    } else {
      drag.onPointerUp(e)
      selection.onPointerUp(e)
    }
  }

  // 概念悬停提示触发 -- 仅在发现后显示 (隐形门禁)
  const handleConceptTooltipShow = useCallback(() => {
    // 拖拽/旋转中不显示提示
    if (interactionMode === 'drag' || interactionMode === 'rotate') return

    // 查找此元素关联的概念
    const concept = getConceptForElement(element.id, element.type, activeRegionId)
    if (!concept) return

    // 检查概念的发现是否已达成
    if (!allTimeDiscoveries.has(concept.discoveryId)) return

    // 计算元素在视口中的位置
    const screenPos = worldToScreenWithCamera(
      element.worldX,
      element.worldY,
      resolvedCameraX.get(),
      resolvedCameraY.get(),
      resolvedZoom.get(),
    )

    // 补偿容器在视口中的偏移
    const container = resolvedContainerRef.current
    if (container) {
      const rect = container.getBoundingClientRect()
      showConceptTooltip(concept.id, screenPos.x + rect.left, screenPos.y + rect.top)
    } else {
      showConceptTooltip(concept.id, screenPos.x, screenPos.y)
    }
  }, [element, activeRegionId, allTimeDiscoveries, interactionMode, resolvedCameraX, resolvedCameraY, resolvedZoom, resolvedContainerRef, showConceptTooltip])

  const handlePointerEnter = () => {
    selection.onPointerEnter()
    handleConceptTooltipShow()
  }

  const handlePointerLeave = () => {
    selection.onPointerLeave()
    hideConceptTooltip()
  }

  // 滚轮: 选中元素时旋转 (阻止摄像机缩放)
  const handleWheel = (e: React.WheelEvent) => {
    if (isSelected) {
      rotation.onWheel(e)
      setHasRotated(true)
    }
  }

  // 旋转手柄的 pointerDown
  const handleRotateHandlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    rotation.onRotatePointerDown(e)
  }

  return (
    <g
      data-element-id={element.id}
      transform={`translate(${screen.x}, ${screen.y})`}
      opacity={groupOpacity}
      style={{ cursor, transition: 'opacity 0.2s ease' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
    >
      {/* 未交互元素: 呼吸脉冲 -- 引导用户注意力 */}
      {showAffordancePulse && !isSelected && !isHovered && (
        <circle
          cx={0}
          cy={-2}
          r={20}
          fill="none"
          stroke="#6CB4FF"
          strokeWidth={1.5}
          opacity={0.35}
          style={{ pointerEvents: 'none' }}
        >
          <animate
            attributeName="opacity"
            values="0.15;0.45;0.15"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="18;22;18"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* 选中时: 明亮轮廓 */}
      {isSelected && (
        <rect
          x={-13}
          y={-21}
          width={26}
          height={36}
          rx={3}
          fill="none"
          stroke="#6CB4FF"
          strokeWidth={2}
          opacity={0.8}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* 元件造型 (含旋转 + 辉光滤镜) */}
      <g
        transform={`rotate(${displayAngle})`}
        filter={filterUrl}
      >
        {shape}
      </g>

      {/* 选中时: 名称标签 */}
      {isSelected && (
        <text
          x={0}
          y={-26}
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize={9}
          fill="#6CB4FF"
          opacity={0.9}
          style={{ pointerEvents: 'none' }}
        >
          {getElementLabel(element)}
        </text>
      )}

      {/* 选中时: 旋转手柄 */}
      {isSelected && (
        <g
          onPointerEnter={() => setHandleHovered(true)}
          onPointerLeave={() => setHandleHovered(false)}
        >
          <RotationHandle
            isHintMode={hasRotated}
            isHovered={handleHovered}
            angle={displayAngle}
            onPointerDown={handleRotateHandlePointerDown}
          />
        </g>
      )}

      {/* 旋转中或选中时: 角度读数 */}
      {(isRotating || isSelected) && (
        <AngleReadout angle={displayAngle} />
      )}
    </g>
  )
})

export { OpticalElement }
