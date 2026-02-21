/**
 * DiscoveryToast.tsx -- 发现通知弹窗
 *
 * 当发现触发时，在顶部中央显示 2-3 秒的通知弹窗:
 * - 标题: 发现名称 (如 "Malus's Law Discovered!")
 * - 副标题: 一句话物理解释
 * - "Learn More" 按钮 → 打开深度面板
 *
 * 动画: 从上方滑入 (y: -60 → 0), 2.5 秒后自动淡出。
 * 首次发现: 稍大的弹窗，包含深度面板说明。
 *
 * Phase B -- D3: Action Feedback
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, BookOpen, GraduationCap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getConceptForDiscovery } from './concepts/conceptRegistry'

/** 弹窗显示持续时间 (毫秒) */
const TOAST_DURATION = 4000

/** 弹窗春动画参数 */
const TOAST_SPRING = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 18,
}

interface ToastData {
  discoveryId: string
  name: string
  description: string
  conceptId: string | null
  courseLink: { path: string; labelKey: string } | null
}

/**
 * DiscoveryToast -- 发现通知弹窗
 *
 * 监听 store 中的 newlyAchieved 变化，当新发现触发时显示通知。
 * 渲染为 HTML 叠加层 (非 SVG)，定位在顶部中央。
 */
export function DiscoveryToast() {
  const { t } = useTranslation()
  const [toast, setToast] = useState<ToastData | null>(null)
  const [visible, setVisible] = useState(false)

  // 监听发现变化
  useEffect(() => {
    const unsub = useOdysseyWorldStore.subscribe(
      (state) => state.achievedDiscoveries,
      (current, previous) => {
        // 找到新增的发现 ID
        for (const id of current) {
          if (!previous.has(id)) {
            // 获取发现信息
            const toastName = t(`odyssey.discoveries.${id}.name`, { defaultValue: id })
            const toastDesc = t(`odyssey.discoveries.${id}.toast`, {
              defaultValue: t(`odyssey.discoveries.${id}.description`, { defaultValue: '' }),
            })

            // 查找关联的概念及课程链接
            const conceptId = id
            const concept = getConceptForDiscovery(id)

            setToast({
              discoveryId: id,
              name: toastName,
              description: toastDesc,
              conceptId,
              courseLink: concept?.courseLink ?? null,
            })
            setVisible(true)
          }
        }
      },
    )

    return () => unsub()
  }, [t])

  // 自动隐藏定时器
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [visible])

  // "Learn More" 按钮点击 → 打开深度面板
  const handleLearnMore = useCallback(() => {
    if (toast?.conceptId) {
      useOdysseyWorldStore.getState().openDepthPanel(toast.conceptId)
    }
    setVisible(false)
  }, [toast])

  return (
    <AnimatePresence>
      {visible && toast && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={TOAST_SPRING}
          className={cn(
            'pointer-events-auto fixed top-4 left-1/2 -translate-x-1/2 z-50',
            'rounded-xl px-4 py-3 md:px-5 md:py-3.5',
            'bg-gradient-to-r from-amber-50/90 to-yellow-50/90',
            'dark:from-amber-950/80 dark:to-yellow-950/80',
            'backdrop-blur-md',
            'border border-amber-200/50 dark:border-amber-700/40',
            'shadow-lg shadow-amber-500/10',
            'max-w-[90vw] md:max-w-md',
          )}
        >
          {/* 标题行 */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
            <h3 className="text-sm md:text-base font-semibold text-amber-900 dark:text-amber-100">
              {toast.name}
            </h3>
          </div>

          {/* 描述 */}
          {toast.description && (
            <p className="mt-1 text-xs md:text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              {toast.description}
            </p>
          )}

          {/* 按钮行 -- "Learn More" + 可选 "Go to Course" */}
          <div className="mt-2 flex items-center gap-4">
            <button
              className={cn(
                'flex items-center gap-1.5',
                'text-xs font-medium',
                'text-amber-600 dark:text-amber-400',
                'hover:text-amber-800 dark:hover:text-amber-200',
                'transition-colors duration-150',
                'cursor-pointer',
              )}
              onClick={handleLearnMore}
            >
              <BookOpen className="h-3 w-3" />
              <span>{t('odyssey.toast.learnMore')}</span>
            </button>

            {toast.courseLink && (
              <Link
                to={toast.courseLink.path}
                className={cn(
                  'flex items-center gap-1.5',
                  'text-xs font-medium',
                  'text-blue-500 dark:text-blue-400',
                  'hover:text-blue-700 dark:hover:text-blue-200',
                  'transition-colors duration-150',
                )}
              >
                <GraduationCap className="h-3 w-3" />
                <span>{t('odyssey.toast.goToCourse')}</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
