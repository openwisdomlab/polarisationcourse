/**
 * ConceptTooltip.tsx -- 概念悬停提示组件
 *
 * 悬停在已发现概念的光学元件上时显示的浮动提示。
 * 使用 fixed 定位在元素附近，点击打开深度面板。
 *
 * z-index: z-20 (低于深度面板 z-30/z-40，高于 HUD z-10)
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getConceptById } from '@/components/odyssey-world/concepts/conceptRegistry'

/**
 * ConceptTooltip -- 概念悬停提示
 *
 * 从 store 读取 tooltipConceptId 和 tooltipPosition，
 * 显示概念名称 + "深入了解" 文本。
 * 点击调用 openDepthPanel 打开深度面板。
 */
export function ConceptTooltip() {
  const { t } = useTranslation()
  const tooltipConceptId = useOdysseyWorldStore((s) => s.tooltipConceptId)
  const tooltipPosition = useOdysseyWorldStore((s) => s.tooltipPosition)
  const openDepthPanel = useOdysseyWorldStore((s) => s.openDepthPanel)
  const hideConceptTooltip = useOdysseyWorldStore((s) => s.hideConceptTooltip)

  const concept = tooltipConceptId ? getConceptById(tooltipConceptId) : null

  return (
    <AnimatePresence>
      {concept && tooltipPosition && (
        <motion.div
          key={concept.id}
          className="pointer-events-auto fixed z-20"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 44,
            transform: 'translate(-50%, -100%)',
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.stopPropagation()
            openDepthPanel(concept.id)
            hideConceptTooltip()
          }}
        >
          <div
            className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 shadow-lg"
            style={{
              background: 'rgba(20, 20, 30, 0.88)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div className="text-xs font-medium text-white/90">
              {t(concept.nameKey)}
            </div>
            <div className="mt-0.5 text-[10px] text-blue-300/70">
              {t('odyssey.concepts.depthPanel.learnMore')}
            </div>
          </div>

          {/* 下方小三角指向元素 */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -6,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(20, 20, 30, 0.88)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
