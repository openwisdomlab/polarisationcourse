/**
 * RegionSummary.tsx -- 区域完成庆祝卡片
 *
 * 当所有区域发现完成后，显示总结卡片:
 * - "Crystal Lab Complete!"
 * - 列出所有发现 (名称 + 一句话描述)
 * - "Next region: Wave Platform →"
 *
 * 自动触发: 当区域发现从 N-1 变为 N 时。
 * 可通过点击关闭或 5 秒后自动淡出。
 *
 * Phase C -- D6: Conceptual Connection
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ChevronRight, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from './regions/regionRegistry'

/** 推荐区域顺序 */
const REGION_ORDER = [
  'crystal-lab',
  'wave-platform',
  'refraction-bench',
  'scattering-chamber',
  'interface-lab',
  'measurement-studio',
]

/**
 * RegionSummary -- 区域完成庆祝
 *
 * 监听当前区域的发现完成情况。
 * 当所有发现完成时显示总结卡片。
 */
export function RegionSummary() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [completedRegionId, setCompletedRegionId] = useState<string | null>(null)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)

  // 获取区域定义和发现列表
  const regionDef = useMemo(
    () => getRegionDefinition(activeRegionId),
    [activeRegionId],
  )

  const totalDiscoveries = regionDef?.discoveries?.length ?? 0
  const achievedCount = useMemo(() => {
    if (!regionDef?.discoveries) return 0
    return regionDef.discoveries.filter((d) => achievedDiscoveries.has(d.id)).length
  }, [regionDef, achievedDiscoveries])

  // 检测区域完成
  useEffect(() => {
    if (totalDiscoveries > 0 && achievedCount === totalDiscoveries) {
      // 防止重复触发 (同一区域只显示一次)
      if (completedRegionId !== activeRegionId) {
        setCompletedRegionId(activeRegionId)
        setVisible(true)
      }
    }
  }, [achievedCount, totalDiscoveries, activeRegionId, completedRegionId])

  // 下一个推荐区域
  const nextRegionId = useMemo(() => {
    const currentIndex = REGION_ORDER.indexOf(activeRegionId)
    if (currentIndex === -1 || currentIndex >= REGION_ORDER.length - 1) return null
    return REGION_ORDER[currentIndex + 1]
  }, [activeRegionId])

  const nextRegionNameKey = nextRegionId
    ? nextRegionId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    : null

  const handleClose = useCallback(() => setVisible(false), [])

  // 自动关闭 (8 秒)
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(handleClose, 8000)
    return () => clearTimeout(timer)
  }, [visible, handleClose])

  const regionNameKey = activeRegionId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())

  return (
    <AnimatePresence>
      {visible && regionDef && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className={cn(
            'pointer-events-auto fixed bottom-20 left-1/2 -translate-x-1/2 z-30',
            'rounded-2xl px-6 py-5',
            'bg-gradient-to-br from-amber-50/95 to-yellow-50/95',
            'dark:from-gray-900/95 dark:to-gray-850/95',
            'backdrop-blur-lg',
            'border border-amber-200/60 dark:border-amber-700/30',
            'shadow-xl shadow-amber-500/10',
            'max-w-sm w-[90vw]',
          )}
        >
          {/* 关闭按钮 */}
          <button
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </button>

          {/* 标题 */}
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100">
              {t('odyssey.regions.' + regionNameKey)} {t('odyssey.summary.complete')}
            </h3>
          </div>

          {/* 发现列表 */}
          <div className="space-y-1.5 mb-4">
            {regionDef.discoveries.map((disc) => (
              <div key={disc.id} className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-amber-800 dark:text-amber-200">
                  {t(`odyssey.discoveries.${disc.id}.name`, { defaultValue: disc.name })}
                </span>
              </div>
            ))}
          </div>

          {/* 下一个区域提示 */}
          {nextRegionId && nextRegionNameKey && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <span>{t('odyssey.summary.nextRegion')}</span>
              <span className="font-medium">
                {t(`odyssey.regions.${nextRegionNameKey}`)}
              </span>
              <ChevronRight className="h-3 w-3" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
