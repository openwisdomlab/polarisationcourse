/**
 * QualitativeLayer.tsx -- 定性内容层 (占位)
 *
 * 渲染 SVG 图解 + 物理解释文本。
 * Task 2 将实现完整的 SVG 图解和微动画。
 */

import { useTranslation } from 'react-i18next'
import type { ConceptDefinition } from '@/components/odyssey-world/concepts/conceptRegistry'

interface QualitativeLayerProps {
  concept: ConceptDefinition
}

export function QualitativeLayer({ concept }: QualitativeLayerProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-white/80">
        {t(concept.qualitative.contentKey)}
      </p>
    </div>
  )
}
