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

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import type { ConceptDefinition } from '@/components/odyssey-world/concepts/conceptRegistry'
import { getRegionDefinition } from '@/components/odyssey-world/regions/regionRegistry'
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
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)

  // 计算当前区域的发现数量 (用于渐进解锁标签页)
  const regionDiscoveryCount = useMemo(() => {
    const regionDef = getRegionDefinition(activeRegionId)
    if (!regionDef?.discoveries) return 0
    return regionDef.discoveries.filter((d) => achievedDiscoveries.has(d.id)).length
  }, [activeRegionId, achievedDiscoveries])

  // 渐进解锁标签页:
  // - qualitative: 始终可用 (首次发现即可看到)
  // - quantitative: 1 个发现后解锁 (该概念被发现即可)
  // - demo: 2 个发现后解锁 (鼓励更多探索)
  const isQuantitativeUnlocked = regionDiscoveryCount >= 1
  const isDemoUnlocked = regionDiscoveryCount >= 2

  // 构建标签页列表
  const tabs: (TabConfig & { locked?: boolean })[] = [
    { id: 'qualitative', labelKey: 'odyssey.concepts.depthPanel.tabs.qualitative' },
    { id: 'quantitative', labelKey: 'odyssey.concepts.depthPanel.tabs.quantitative', locked: !isQuantitativeUnlocked },
  ]
  if (concept.demoComponentId) {
    tabs.push({ id: 'demo', labelKey: 'odyssey.concepts.depthPanel.tabs.demo', locked: !isDemoUnlocked })
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

          {/* 课程链接 -- 导航到对应的课程演示 */}
          {concept.courseLink && (
            <Link
              to={concept.courseLink.path}
              className={cn(
                'inline-flex items-center gap-1.5 mt-3',
                'text-xs font-medium text-blue-400 hover:text-blue-300',
                'transition-colors',
              )}
            >
              <ExternalLink className="h-3 w-3" />
              {t(concept.courseLink.labelKey)}
            </Link>
          )}
        </div>
      </div>

      {/* 标签栏 */}
      <div className="mb-4 flex gap-1 border-b border-white/10 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              'rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors',
              'flex items-center gap-1',
              tab.locked
                ? 'text-white/20 cursor-not-allowed'
                : activeTab === tab.id
                  ? 'bg-white/10 text-white/90'
                  : 'text-white/40 hover:text-white/60 cursor-pointer',
            )}
            onClick={() => !tab.locked && setTab(tab.id)}
            disabled={tab.locked}
            title={tab.locked ? t('odyssey.depth.discoverMore') : undefined}
          >
            {tab.locked && <Lock className="h-3 w-3" />}
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
