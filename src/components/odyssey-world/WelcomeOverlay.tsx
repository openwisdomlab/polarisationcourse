/**
 * WelcomeOverlay.tsx -- 首次访问欢迎引导覆盖层
 *
 * 在用户首次进入 Odyssey 世界时显示操作提示。
 * 使用 localStorage 记录访问状态，避免重复显示。
 * 提供模块级回调函数，供 HUD 的 "帮助" 按钮重新触发显示。
 *
 * 交互提示:
 * - 点击移动
 * - 滚轮缩放
 * - 拖拽元素实验
 * - 按 M 打开世界地图
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MousePointerClick, ZoomIn, Move, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'odyssey-welcomed'

// 模块级回调，允许外部组件 (如 HUD) 重新触发显示
let showOverlayCallback: (() => void) | null = null

/** 重新显示欢迎引导 (供 HUD 帮助按钮调用) */
export function showWelcomeOverlay() {
  showOverlayCallback?.()
}

/** 重置首次访问标记 (清除 localStorage) */
export function resetWelcome() {
  localStorage.removeItem(STORAGE_KEY)
}

// 引导提示条目类型
interface HintItem {
  icon: React.ReactNode
  labelKey: string
}

/**
 * WelcomeOverlay -- 首次访问引导覆盖层
 *
 * 半透明暗色背景 + 居中毛玻璃卡片，
 * 展示 4 个操作提示图标，带 Framer Motion 动画入场。
 */
export function WelcomeOverlay() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 首次访问时自动显示
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
    // 注册模块级回调
    showOverlayCallback = () => setVisible(true)
    return () => {
      showOverlayCallback = null
    }
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }, [])

  // 提示条目
  const hints: HintItem[] = [
    {
      icon: <MousePointerClick className="h-6 w-6 text-amber-400" />,
      labelKey: 'odyssey.ui.welcomeClickToMove',
    },
    {
      icon: <ZoomIn className="h-6 w-6 text-sky-400" />,
      labelKey: 'odyssey.ui.welcomeScrollToZoom',
    },
    {
      icon: <Move className="h-6 w-6 text-emerald-400" />,
      labelKey: 'odyssey.ui.welcomeDragElements',
    },
    {
      icon: <Map className="h-6 w-6 text-violet-400" />,
      labelKey: 'odyssey.ui.welcomePressM',
    },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 半透明暗色背景 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* 居中卡片 */}
          <motion.div
            className={cn(
              'relative z-10 mx-4 max-w-sm w-full rounded-2xl p-6',
              'bg-gray-900/80 backdrop-blur-md',
              'border border-white/10',
              'shadow-2xl',
            )}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            {/* 标题 */}
            <h2 className="mb-6 text-center text-lg font-light tracking-wider text-gray-100">
              {t('odyssey.ui.welcomeTitle')}
            </h2>

            {/* 操作提示列表 */}
            <div className="space-y-4 mb-8">
              {hints.map((hint, i) => (
                <motion.div
                  key={hint.labelKey}
                  className="flex items-center gap-4 rounded-lg px-4 py-2.5 bg-white/5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <div className="flex-shrink-0">{hint.icon}</div>
                  <span className="text-sm text-gray-300">{t(hint.labelKey)}</span>
                </motion.div>
              ))}
            </div>

            {/* 开始按钮 */}
            <motion.button
              className={cn(
                'w-full rounded-xl py-3 text-sm font-medium tracking-wide',
                'bg-amber-500/80 text-gray-900',
                'hover:bg-amber-400/90',
                'transition-colors duration-200',
                'cursor-pointer',
              )}
              onClick={dismiss}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {t('odyssey.ui.welcomeStartExploring')}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
