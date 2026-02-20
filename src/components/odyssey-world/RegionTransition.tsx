/**
 * RegionTransition.tsx -- 区域过渡覆盖层
 *
 * 区域过渡时显示的标题卡片和交互遮罩:
 * - 目标区域名称以大号淡色文字居中显示
 * - 淡入 0.3s -> 停留 1.5s (首次 2.0s) -> 淡出 0.3s
 * - 半透明遮罩 (pointer-events-all) 阻断场景交互
 * - 使用 AnimatePresence 实现进入/退出动画
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from '@/components/odyssey-world/regions/regionRegistry'

/**
 * 区域过渡标题卡片
 *
 * 监听 isTransitioning 和 transitionTarget 从 store，
 * 在过渡开始时显示目标区域名称。
 */
export function RegionTransition() {
  const isTransitioning = useOdysseyWorldStore((s) => s.isTransitioning)
  const transitionTarget = useOdysseyWorldStore((s) => s.transitionTarget)
  const visitedRegions = useOdysseyWorldStore((s) => s.visitedRegions)

  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    if (!isTransitioning || !transitionTarget) return

    setShowTitle(true)

    // 首次进入停留更久 (2.0s vs 1.5s)
    const isFirstVisit = !visitedRegions.has(transitionTarget)
    const displayDuration = isFirstVisit ? 2000 : 1500

    const timer = setTimeout(() => setShowTitle(false), displayDuration)
    return () => clearTimeout(timer)
  }, [isTransitioning, transitionTarget, visitedRegions])

  const region = transitionTarget ? getRegionDefinition(transitionTarget) : null

  return (
    <AnimatePresence>
      {isTransitioning && (
        /* 交互遮罩层 -- 阻断场景点击/拖拽 */
        <motion.div
          key="transition-blocker"
          className="fixed inset-0 z-40 bg-black/10"
          style={{ pointerEvents: 'all' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {showTitle && region && (
        /* 区域名称标题卡片 */
        <motion.div
          key={`title-${region.id}`}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            className="text-3xl font-light tracking-widest text-gray-600/80 select-none"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {region.theme.name}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
