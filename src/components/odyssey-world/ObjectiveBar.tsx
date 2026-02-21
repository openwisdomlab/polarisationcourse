/**
 * ObjectiveBar.tsx -- 持续目标显示条
 *
 * 始终显示当前应达成的发现目标:
 * - 当前区域的下一个未发现项的 hint 文本
 * - 进度: "Discovery 2/5 in Crystal Lab"
 * - 全部完成时: "Explore a new region →"
 *
 * 定位: 底部居中, z-10, 玻璃态, opacity 0.7
 * 不遮挡场景中心 (max-w-sm, 底部偏移)
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from '@/components/odyssey-world/regions/regionRegistry'

/**
 * ObjectiveBar -- 持续目标显示
 *
 * 从当前区域的 DiscoveryConfig 列表中找到下一个未完成的发现,
 * 显示其 hint 文本作为当前目标。
 */
export function ObjectiveBar() {
  const { t } = useTranslation()
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)
  const tutorialState = useOdysseyWorldStore((s) => s.tutorialState)
  const tutorialCompleted = useOdysseyWorldStore((s) => s.tutorialCompleted)

  // 获取当前区域发现配置
  const regionDef = useMemo(() => getRegionDefinition(activeRegionId), [activeRegionId])
  const discoveries = regionDef?.discoveries ?? []

  // 计算进度和下一个目标
  const { achieved, total, nextHint, nextName, allComplete } = useMemo(() => {
    const achievedCount = discoveries.filter((d) => achievedDiscoveries.has(d.id)).length
    const totalCount = discoveries.length

    // 按 difficulty 排序, 找到第一个未完成的
    const sorted = [...discoveries].sort((a, b) => a.difficulty - b.difficulty)
    const next = sorted.find((d) => !achievedDiscoveries.has(d.id))

    return {
      achieved: achievedCount,
      total: totalCount,
      nextHint: next?.hint ?? null,
      nextName: next?.name ?? null,
      allComplete: achievedCount >= totalCount,
    }
  }, [discoveries, achievedDiscoveries])

  // 教程期间仍显示 ObjectiveBar，但增加底部偏移避免与教程卡片重叠
  const isTutorialActive = !tutorialCompleted && tutorialState !== 'idle' && tutorialState !== 'complete'

  // 区域名称
  const regionNameKey = activeRegionId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
  const regionName = t(`odyssey.regions.${regionNameKey}`)

  return (
    <div className={cn(
      'pointer-events-none absolute left-1/2 -translate-x-1/2 z-10',
      isTutorialActive ? 'bottom-28' : 'bottom-2',
    )}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeRegionId}-${achieved}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'rounded-xl px-4 py-2',
            'bg-white/60 dark:bg-black/40',
            'backdrop-blur-sm',
            'border border-white/20 dark:border-white/10',
            'max-w-xs md:max-w-sm',
            'text-center',
          )}
        >
          {/* 进度指示 */}
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wide">
              {t('odyssey.ui.discoveryProgress', { count: achieved, total })}
            </span>
            <span className="text-[10px] text-gray-300 dark:text-gray-600">|</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {regionName}
            </span>
          </div>

          {/* 发现目标名称 */}
          {!allComplete && nextName && (
            <p className="text-[10px] text-blue-400/70 dark:text-blue-300/50 mb-0.5">
              {t('odyssey.objectives.goalPrefix')}: {nextName}
            </p>
          )}

          {/* 当前目标提示 */}
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            {allComplete
              ? t('odyssey.objectives.exploreNewRegion')
              : nextHint
                ? t(nextHint)
                : t('odyssey.objectives.keepExploring')}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
