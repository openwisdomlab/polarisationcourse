/**
 * QuantitativeLayer.tsx -- 定量内容层
 *
 * 渲染 KaTeX 公式 + 标签卡片。
 * 每个公式在独立的圆角卡片中，标签在上方。
 * 可选推导步骤以可折叠区域显示 (useState toggle)。
 *
 * 使用 MathRenderer 组件 (displayMode=true) 渲染 LaTeX。
 * KaTeX CSS 已在 main.tsx 全局导入。
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { ConceptDefinition } from '@/components/odyssey-world/concepts/conceptRegistry'
import MathRenderer from '@/components/MathRenderer'

interface QuantitativeLayerProps {
  concept: ConceptDefinition
}

/**
 * QuantitativeLayer -- 定量内容层
 *
 * 结构:
 * 1. 介绍文本 (contentKey)
 * 2. 公式卡片列表 (formulas)
 * 3. 可折叠推导步骤 (derivationStepsKey, 如果存在)
 */
export function QuantitativeLayer({ concept }: QuantitativeLayerProps) {
  const { t } = useTranslation()
  const [derivationOpen, setDerivationOpen] = useState(false)

  const hasDerivation = !!concept.quantitative.derivationStepsKey

  return (
    <div className="space-y-5">
      {/* 介绍文本 -- 提供数学背景上下文 */}
      <p className="text-sm leading-relaxed text-white/60">
        {t(concept.quantitative.contentKey)}
      </p>

      {/* 公式卡片列表 */}
      <div className="space-y-3">
        {concept.quantitative.formulas.map((formula, idx) => (
          <motion.div
            key={idx}
            className="rounded-lg bg-white/5 px-4 py-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {/* 公式标签 */}
            <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
              {t(formula.labelKey)}
            </div>

            {/* LaTeX 公式 -- displayMode 居中显示 */}
            <div className="flex justify-center py-1">
              <MathRenderer
                latex={formula.latex}
                displayMode
                className="text-white"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 可折叠推导步骤 */}
      {hasDerivation && (
        <div className="border-t border-white/5 pt-3">
          <button
            className="flex w-full items-center gap-2 text-xs text-white/40 transition-colors hover:text-white/60"
            onClick={() => setDerivationOpen(!derivationOpen)}
          >
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                derivationOpen && 'rotate-180',
              )}
            />
            {derivationOpen
              ? t('odyssey.concepts.depthPanel.hideDerivation')
              : t('odyssey.concepts.depthPanel.showDerivation')}
          </button>

          <AnimatePresence>
            {derivationOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-lg bg-white/[0.03] px-4 py-3">
                  <p className="text-xs leading-relaxed text-white/50">
                    {t(concept.quantitative.derivationStepsKey!)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
