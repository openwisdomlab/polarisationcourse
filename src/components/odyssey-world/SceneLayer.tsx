/**
 * SceneLayer.tsx -- 场景深度排序层
 *
 * 简单包装器: 接收场景元素数组，按深度排序后渲染子组件。
 * 使用画家算法 (depthSort) 确保正确的遮挡关系。
 */

import React from 'react'
import { depthSort } from '@/lib/isometric'
import type { SceneElement } from '@/stores/odysseyWorldStore'

interface SceneLayerProps {
  elements: SceneElement[]
  renderElement: (element: SceneElement) => React.ReactNode
}

/**
 * 场景层组件
 *
 * 按 depthSort(worldX, worldY, worldZ) 升序排列元素
 * (值小的先绘制 = 在后面，值大的后绘制 = 在前面)。
 */
const SceneLayer = React.memo(function SceneLayer({ elements, renderElement }: SceneLayerProps) {
  // 按深度排序 (升序: 后方先绘制，前方后绘制)
  const sorted = [...elements].sort(
    (a, b) => depthSort(a.worldX, a.worldY, a.worldZ) - depthSort(b.worldX, b.worldY, b.worldZ),
  )

  return (
    <g>
      {sorted.map((el) => (
        <React.Fragment key={el.id}>{renderElement(el)}</React.Fragment>
      ))}
    </g>
  )
})

export { SceneLayer }
