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

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Lock, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from '@/components/odyssey-world/regions/regionRegistry'
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

  // 获取当前区域发现配置
  const regionDef = useMemo(() => getRegionDefinition(activeRegionId), [activeRegionId])
  const discoveries = regionDef?.discoveries ?? []

  // 计算每个发现的显示状态
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
            <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20 px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('odyssey.menu.title')}
                </h2>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {regionName} — {achievedCount}/{entries.length}
                </p>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={handleClose}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* 发现列表 */}
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
