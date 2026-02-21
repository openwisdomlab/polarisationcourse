/**
 * DiscoveryMenu.tsx -- 发现菜单 / 发现日志
 *
 * 从 HUD 的书本图标按钮打开。
 * 列出当前区域的所有发现:
 * - 已达成: 金色, 可点击打开深度面板
 * - 下一个: 高亮, 显示引导提示
 * - 锁定: 暗灰, 显示 "???" (difficulty 未解锁时)
 *
 * 滑入动画, 右侧面板风格
 */

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Lock, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getRegionDefinition, REGION_DEFINITIONS } from '@/components/odyssey-world/regions/regionRegistry'
import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

/** 发现条目的显示状态 */
type DiscoveryDisplayState = 'achieved' | 'next' | 'locked'

interface DiscoveryEntry {
  config: DiscoveryConfig
  state: DiscoveryDisplayState
}

/**
 * DiscoveryMenu -- 发现日志面板
 */
export function DiscoveryMenu() {
  const { t } = useTranslation()
  const isOpen = useOdysseyWorldStore((s) => s.discoveryMenuOpen)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)
  const allTimeDiscoveries = useOdysseyWorldStore((s) => s.allTimeDiscoveries)

  // 视图切换: 当前区域 / 所有区域
  const [viewMode, setViewMode] = useState<'current' | 'all'>('current')

  // 获取当前区域发现配置
  const regionDef = useMemo(() => getRegionDefinition(activeRegionId), [activeRegionId])
  const discoveries = regionDef?.discoveries ?? []

  // 计算当前区域每个发现的显示状态
  const entries: DiscoveryEntry[] = useMemo(() => {
    // 按 difficulty 排序
    const sorted = [...discoveries].sort((a, b) => a.difficulty - b.difficulty)

    // 判断最高已解锁难度
    const hasAnyDifficulty1 = sorted.some(
      (d) => d.difficulty === 1 && achievedDiscoveries.has(d.id),
    )
    const hasAnyDifficulty2 = sorted.some(
      (d) => d.difficulty === 2 && achievedDiscoveries.has(d.id),
    )

    let foundNext = false
    return sorted.map((config) => {
      if (achievedDiscoveries.has(config.id)) {
        return { config, state: 'achieved' as const }
      }

      // 检查 difficulty 是否已解锁
      const isUnlocked =
        config.difficulty === 1 ||
        (config.difficulty === 2 && hasAnyDifficulty1) ||
        (config.difficulty === 3 && hasAnyDifficulty2)

      if (!isUnlocked) {
        return { config, state: 'locked' as const }
      }

      // 第一个未完成且已解锁的 = next
      if (!foundNext) {
        foundNext = true
        return { config, state: 'next' as const }
      }

      return { config, state: 'locked' as const }
    })
  }, [discoveries, achievedDiscoveries])

  const achievedCount = entries.filter((e) => e.state === 'achieved').length

  // 所有区域的发现概览
  const allRegionEntries = useMemo(() => {
    if (viewMode !== 'all') return []
    const result: { regionId: string; regionLabel: string; accentColor: string; achieved: number; total: number; discoveries: DiscoveryEntry[] }[] = []
    for (const [regionId, def] of REGION_DEFINITIONS) {
      const nameKey = regionId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
      const sorted = [...def.discoveries].sort((a, b) => a.difficulty - b.difficulty)
      const regionAchieved = sorted.filter((d) => allTimeDiscoveries.has(d.id))
      const regionEntries: DiscoveryEntry[] = sorted.map((config) => {
        if (allTimeDiscoveries.has(config.id)) {
          return { config, state: 'achieved' as const }
        }
        return { config, state: 'locked' as const }
      })
      result.push({
        regionId,
        regionLabel: nameKey,
        accentColor: def.theme.colorPalette.accentColor,
        achieved: regionAchieved.length,
        total: sorted.length,
        discoveries: regionEntries,
      })
    }
    return result
  }, [viewMode, allTimeDiscoveries])

  // 区域名称
  const regionNameKey = activeRegionId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
  const regionName = t(`odyssey.regions.${regionNameKey}`)

  const handleClose = () => {
    useOdysseyWorldStore.getState().toggleDiscoveryMenu()
  }

  const handleOpenDepthPanel = (discoveryId: string) => {
    // 从 discovery id 映射到 concept id (去掉区域前缀)
    const conceptId = discoveryId.replace(/^[a-z]+-[a-z]+-/, '')
    useOdysseyWorldStore.getState().openDepthPanel(conceptId)
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/20"
            onClick={handleClose}
          />

          {/* 面板 */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'absolute right-0 top-0 bottom-0 z-40',
              'w-72 md:w-80',
              'bg-white/90 dark:bg-gray-900/90',
              'backdrop-blur-lg',
              'border-l border-white/20 dark:border-white/10',
              'shadow-xl',
              'overflow-y-auto',
            )}
          >
            {/* 头部 */}
            <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t('odyssey.menu.title')}
                  </h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {viewMode === 'current'
                      ? `${regionName} — ${achievedCount}/${entries.length}`
                      : t('odyssey.menu.allRegions')}
                  </p>
                </div>
                <button
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* 视图切换标签 */}
              <div className="flex mt-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/30 p-0.5">
                <button
                  className={cn(
                    'flex-1 text-[10px] py-1 rounded-md transition-colors cursor-pointer',
                    viewMode === 'current'
                      ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400',
                  )}
                  onClick={() => setViewMode('current')}
                >
                  {t('odyssey.menu.currentRegion')}
                </button>
                <button
                  className={cn(
                    'flex-1 text-[10px] py-1 rounded-md transition-colors cursor-pointer',
                    viewMode === 'all'
                      ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400',
                  )}
                  onClick={() => setViewMode('all')}
                >
                  {t('odyssey.menu.allRegions')}
                </button>
              </div>
            </div>

            {/* 当前区域发现列表 */}
            {viewMode === 'current' && (
              <div className="p-3 space-y-1.5">
                {entries.map((entry, idx) => (
                  <DiscoveryItem
                    key={entry.config.id}
                    entry={entry}
                    index={idx}
                    onOpenDepth={handleOpenDepthPanel}
                    t={t}
                  />
                ))}
              </div>
            )}

            {/* 所有区域发现概览 */}
            {viewMode === 'all' && (
              <div className="p-3 space-y-3">
                {allRegionEntries.map((region) => (
                  <div key={region.regionId}>
                    {/* 区域标题 + 进度 */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: region.accentColor }}
                      />
                      <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 flex-1">
                        {t(`odyssey.regions.${region.regionLabel}`)}
                      </span>
                      <span className={cn(
                        'text-[10px] tabular-nums',
                        region.achieved === region.total && region.total > 0
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-gray-400 dark:text-gray-500',
                      )}>
                        {region.achieved}/{region.total}
                      </span>
                    </div>
                    {/* 发现条目 (简化版) */}
                    <div className="space-y-0.5 ml-4">
                      {region.discoveries.map((entry) => (
                        <button
                          key={entry.config.id}
                          disabled={entry.state === 'locked'}
                          onClick={() => {
                            if (entry.state === 'achieved') handleOpenDepthPanel(entry.config.id)
                          }}
                          className={cn(
                            'w-full flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors',
                            entry.state === 'achieved' && 'hover:bg-amber-50/40 dark:hover:bg-amber-900/10 cursor-pointer',
                            entry.state === 'locked' && 'opacity-30 cursor-default',
                          )}
                        >
                          {entry.state === 'achieved' ? (
                            <Star className="h-3 w-3 text-amber-500 flex-shrink-0" fill="currentColor" />
                          ) : (
                            <Lock className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={cn(
                            'text-[10px] truncate',
                            entry.state === 'achieved' ? 'text-amber-700 dark:text-amber-300' : 'text-gray-400 dark:text-gray-600',
                          )}>
                            {entry.state === 'locked' ? '???' : entry.config.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/** 单个发现条目 */
function DiscoveryItem({
  entry,
  index,
  onOpenDepth,
  t,
}: {
  entry: DiscoveryEntry
  index: number
  onOpenDepth: (id: string) => void
  t: (key: string) => string
}) {
  const { config, state } = entry

  return (
    <motion.button
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      disabled={state === 'locked'}
      onClick={() => {
        if (state === 'achieved') {
          onOpenDepth(config.id)
        }
      }}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
        state === 'achieved' && 'bg-amber-50/60 dark:bg-amber-900/15 hover:bg-amber-100/60 dark:hover:bg-amber-900/25 cursor-pointer',
        state === 'next' && 'bg-blue-50/60 dark:bg-blue-900/15 border border-blue-200/30 dark:border-blue-700/20',
        state === 'locked' && 'opacity-40 cursor-default',
      )}
    >
      {/* 图标 */}
      <div
        className={cn(
          'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center',
          state === 'achieved' && 'bg-amber-400/20 dark:bg-amber-500/15',
          state === 'next' && 'bg-blue-400/20 dark:bg-blue-500/15',
          state === 'locked' && 'bg-gray-200/30 dark:bg-gray-700/20',
        )}
      >
        {state === 'achieved' ? (
          <Star className="h-4 w-4 text-amber-500 dark:text-amber-400" fill="currentColor" />
        ) : state === 'next' ? (
          <Star className="h-4 w-4 text-blue-400 dark:text-blue-300" />
        ) : (
          <Lock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
        )}
      </div>

      {/* 文本 */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-xs font-medium truncate',
            state === 'achieved' && 'text-amber-700 dark:text-amber-300',
            state === 'next' && 'text-blue-600 dark:text-blue-300',
            state === 'locked' && 'text-gray-400 dark:text-gray-600',
          )}
        >
          {state === 'locked' ? '???' : config.name}
        </p>
        {state === 'next' && config.hint && (
          <p className="text-[10px] text-blue-400/70 dark:text-blue-400/50 mt-0.5 truncate">
            {t(config.hint)}
          </p>
        )}
      </div>

      {/* 箭头 (已完成项) */}
      {state === 'achieved' && (
        <ChevronRight className="h-3.5 w-3.5 text-amber-400/50 flex-shrink-0" />
      )}
    </motion.button>
  )
}
