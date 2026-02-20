/**
 * DepthPanelContent.tsx -- 深度面板标签页内容
 *
 * 显示概念头部 (名称 + 直觉摘要) 和标签页导航。
 * 标签页: 理解 (qualitative) / 数学 (quantitative) / 探索 (demo, 可选)
 *
 * 标签切换使用 store 的 setDepthPanelTab，
 * 当前标签读取 store 的 depthPanelActiveTab。
 * 直觉层始终在顶部显示 (CONT-03 "体验优先" 理念)。
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import type { ConceptDefinition } from '@/components/odyssey-world/concepts/conceptRegistry'
import { QualitativeLayer } from './QualitativeLayer'
import { QuantitativeLayer } from './QuantitativeLayer'
import { DemoLayer } from './DemoLayer'

interface DepthPanelContentProps {
  concept: ConceptDefinition
}

/** 标签页配置 */
type TabId = 'qualitative' | 'quantitative' | 'demo'

interface TabConfig {
  id: TabId
  labelKey: string
}

/**
 * DepthPanelContent -- 标签页内容区域
 *
 * 头部: 概念名称 + 直觉摘要 (始终可见)
 * 标签栏: 理解 / 数学 / (可选) 探索
 * 内容区: 根据激活标签渲染对应层
 */
export function DepthPanelContent({ concept }: DepthPanelContentProps) {
  const { t } = useTranslation()
  const activeTab = useOdysseyWorldStore((s) => s.depthPanelActiveTab)
  const setTab = useOdysseyWorldStore((s) => s.setDepthPanelTab)

  // 构建标签页列表 (demo 标签仅在概念有 demoComponentId 时显示)
  const tabs: TabConfig[] = [
    { id: 'qualitative', labelKey: 'odyssey.concepts.depthPanel.tabs.qualitative' },
    { id: 'quantitative', labelKey: 'odyssey.concepts.depthPanel.tabs.quantitative' },
  ]
  if (concept.demoComponentId) {
    tabs.push({ id: 'demo', labelKey: 'odyssey.concepts.depthPanel.tabs.demo' })
  }

  return (
    <div className="flex h-full flex-col">
      {/* 概念头部: 名称 + 直觉摘要 */}
      <div className="mb-5 space-y-3">
        <h2 className="text-xl font-light tracking-wide text-white/95">
          {t(concept.nameKey)}
        </h2>

        {/* 直觉层 -- 始终可见的简短描述 (非标签页) */}
        <div className="rounded-lg bg-white/5 px-4 py-3">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/40">
            {t(concept.intuition.titleKey)}
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            {t(concept.intuition.contentKey)}
          </p>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="mb-4 flex gap-1 border-b border-white/10 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              'rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-white/10 text-white/90'
                : 'text-white/40 hover:text-white/60',
            )}
            onClick={() => setTab(tab.id)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* 标签页内容 -- 简单透明度过渡 */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'qualitative' && (
              <QualitativeLayer concept={concept} />
            )}
            {activeTab === 'quantitative' && (
              <QuantitativeLayer concept={concept} />
            )}
            {activeTab === 'demo' && (
              <DemoLayer concept={concept} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
