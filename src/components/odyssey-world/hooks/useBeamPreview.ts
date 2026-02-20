/**
 * useBeamPreview.ts -- 幽灵光束预览 Hook
 *
 * 拖拽元素时计算临时光束路径，用于显示"如果放在这里光束会怎样"。
 * 复用 calculateBeamPath (与 useBeamPhysics 共享同一物理计算函数，
 * 不重复物理逻辑)，仅替换被拖拽元素的位置后重新计算。
 *
 * 返回 null 表示未在拖拽，返回 BeamSegment[] 为预览路径。
 */

import { useMemo } from 'react'
import { useOdysseyWorldStore, type BeamSegment } from '@/stores/odysseyWorldStore'
import { calculateBeamPath } from '@/components/odyssey-world/hooks/useBeamPhysics'

export interface UseBeamPreviewReturn {
  previewSegments: BeamSegment[] | null
}

/**
 * 幽灵光束预览 Hook
 *
 * 从 store 读取 dragPreviewPos 和 sceneElements:
 * - dragPreviewPos 为 null 时返回 null (无预览)
 * - dragPreviewPos 存在时，创建元素的临时副本，替换选中元素的位置，
 *   然后调用 calculateBeamPath 计算预览路径
 */
export function useBeamPreview(): UseBeamPreviewReturn {
  const dragPreviewPos = useOdysseyWorldStore((s) => s.dragPreviewPos)
  const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)
  const selectedElementId = useOdysseyWorldStore((s) => s.selectedElementId)

  const previewSegments = useMemo(() => {
    // 未拖拽时无预览
    if (!dragPreviewPos || !selectedElementId) return null

    // 创建临时元素副本，替换被拖拽元素的位置
    const tentativeElements = sceneElements.map((el) =>
      el.id === selectedElementId
        ? { ...el, worldX: dragPreviewPos.worldX, worldY: dragPreviewPos.worldY }
        : el,
    )

    // 使用共享的物理计算函数
    return calculateBeamPath(tentativeElements)
  }, [dragPreviewPos, sceneElements, selectedElementId])

  return { previewSegments }
}
