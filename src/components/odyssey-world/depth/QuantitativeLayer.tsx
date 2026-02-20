/**
 * QuantitativeLayer.tsx -- 定量内容层 (占位)
 *
 * 渲染 KaTeX 公式 + 标签。
 * Task 2 将实现完整的公式卡片和可折叠推导。
 */

import { useTranslation } from 'react-i18next'
import type { ConceptDefinition } from '@/components/odyssey-world/concepts/conceptRegistry'
import MathRenderer from '@/components/MathRenderer'

interface QuantitativeLayerProps {
  concept: ConceptDefinition
}

export function QuantitativeLayer({ concept }: QuantitativeLayerProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-white/60">
        {t(concept.quantitative.contentKey)}
      </p>
      {concept.quantitative.formulas.map((formula, idx) => (
        <div key={idx} className="rounded-lg bg-white/5 px-4 py-3">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/40">
            {t(formula.labelKey)}
          </div>
          <MathRenderer latex={formula.latex} displayMode className="text-white" />
        </div>
      ))}
    </div>
  )
}
