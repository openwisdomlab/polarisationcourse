/**
 * useEnvironmentProperties.ts -- 环境属性管理 Hook
 *
 * 管理环境弹窗状态和属性变更分发:
 * - 从 store 读取指定元素的属性
 * - 提供 updateProperty 方法实时更新属性
 * - 计算元素的屏幕位置用于弹窗定位
 *
 * 属性变更通过 store 的 updateElement 触发光束物理重新计算。
 */

import { useCallback, useMemo } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { worldToScreenWithCamera } from '@/lib/isometric'

/** 标准折射率表 -- 与 FresnelSolver.REFRACTIVE_INDICES 对应 */
export const MEDIUM_REFRACTIVE_INDICES: Record<string, number> = {
  vacuum: 1.0,
  air: 1.00029,
  water: 1.333,
  glass: 1.52,
  diamond: 2.417,
  calcite: 1.6584,
  quartz: 1.544,
}

/** 介质类型可读名称 */
export const MEDIUM_LABELS: Record<string, string> = {
  vacuum: 'Vacuum',
  air: 'Air',
  water: 'Water',
  glass: 'Glass',
  diamond: 'Diamond',
  calcite: 'Calcite',
  quartz: 'Quartz',
}

/** 偏振类型选项 */
export const POLARIZATION_OPTIONS = [
  'horizontal',
  'vertical',
  '45-degree',
  'circular-right',
  'circular-left',
  'unpolarized',
] as const

/** 偏振类型可读名称 */
export const POLARIZATION_LABELS: Record<string, string> = {
  horizontal: 'Horizontal',
  vertical: 'Vertical',
  '45-degree': '45 Degree',
  'circular-right': 'Circular Right',
  'circular-left': 'Circular Left',
  unpolarized: 'Unpolarized',
}

interface UseEnvironmentPropertiesResult {
  /** 元素属性 */
  properties: Record<string, number | string | boolean>
  /** 元素类型 */
  elementType: string | null
  /** 更新单个属性 (触发光束物理重新计算) */
  updateProperty: (key: string, value: number | string) => void
  /** 元素屏幕位置 (用于弹窗定位) */
  elementScreenPos: { x: number; y: number }
}

/**
 * useEnvironmentProperties -- 环境属性管理
 *
 * @param elementId 目标元素 ID
 * @returns 属性读取/更新方法和屏幕位置
 */
export function useEnvironmentProperties(elementId: string | null): UseEnvironmentPropertiesResult {
  const element = useOdysseyWorldStore((s) =>
    elementId ? s.sceneElements.find((el) => el.id === elementId) : undefined,
  )
  const updateElement = useOdysseyWorldStore((s) => s.updateElement)
  const cameraX = useOdysseyWorldStore((s) => s.cameraX)
  const cameraY = useOdysseyWorldStore((s) => s.cameraY)
  const zoom = useOdysseyWorldStore((s) => s.zoom)

  // 更新属性: 合并现有属性和新值，触发 store 更新
  const updateProperty = useCallback(
    (key: string, value: number | string) => {
      if (!element || !elementId) return
      updateElement(elementId, {
        properties: { ...element.properties, [key]: value },
      })
    },
    [element, elementId, updateElement],
  )

  // 计算元素屏幕位置 (含摄像机变换)
  const elementScreenPos = useMemo(() => {
    if (!element) return { x: 0, y: 0 }
    return worldToScreenWithCamera(
      element.worldX,
      element.worldY,
      cameraX,
      cameraY,
      zoom,
    )
  }, [element, cameraX, cameraY, zoom])

  return {
    properties: element?.properties ?? {},
    elementType: element?.type ?? null,
    updateProperty,
    elementScreenPos,
  }
}
