/**
 * PaletteUnlockToast.tsx -- 工具解锁通知
 *
 * 当 PALETTE_ENRICHMENT 触发（新工具因发现解锁）时，
 * 显示简短通知: "New tool unlocked: Quarter-Wave Plate"
 *
 * 通知出现在底部左侧（设备架上方），2.5 秒后淡出。
 * 新解锁的面板项在面板中发光 5 秒。
 *
 * Phase B -- D3: Action Feedback
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { PALETTE_ENRICHMENTS } from './regions/regionRegistry'

/** 通知显示持续时间 (毫秒) */
const UNLOCK_TOAST_DURATION = 3000

/**
 * PaletteUnlockToast -- 工具解锁通知
 *
 * 监听 allTimeDiscoveries 变化，检查是否有新的面板扩充工具被解锁。
 */
export function PaletteUnlockToast() {
  const { t } = useTranslation()
  const [unlockName, setUnlockName] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const prevDiscoveriesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const unsub = useOdysseyWorldStore.subscribe(
      (state) => state.allTimeDiscoveries,
      (current) => {
        const prev = prevDiscoveriesRef.current

        // 检查是否有新发现解锁了工具
        for (const id of current) {
          if (!prev.has(id)) {
            // 查找此发现是否解锁了面板扩充
            const enrichment = PALETTE_ENRICHMENTS.find(
              (e) => e.requiredDiscoveryId === id,
            )
            if (enrichment) {
              const toolName = t(
                `odyssey.palette.${enrichment.elementType}`,
                { defaultValue: enrichment.elementType },
              )
              setUnlockName(toolName)
              setVisible(true)
            }
          }
        }

        prevDiscoveriesRef.current = new Set(current)
      },
    )

    // 初始化 ref
    prevDiscoveriesRef.current = new Set(
      useOdysseyWorldStore.getState().allTimeDiscoveries,
    )

    return () => unsub()
  }, [t])

  // 自动隐藏
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), UNLOCK_TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && unlockName && (
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 18 }}
          className={cn(
            'pointer-events-none absolute bottom-20 left-4 z-15',
            'rounded-lg px-3 py-2',
            'bg-emerald-50/90 dark:bg-emerald-950/80',
            'backdrop-blur-sm',
            'border border-emerald-200/50 dark:border-emerald-700/40',
            'shadow-md shadow-emerald-500/10',
            'flex items-center gap-2',
          )}
        >
          <Wrench className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs text-emerald-800 dark:text-emerald-200">
            {t('odyssey.palette.unlocked', { tool: unlockName })}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
