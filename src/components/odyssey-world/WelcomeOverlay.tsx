/**
 * WelcomeOverlay.tsx -- 首次访问欢迎引导覆盖层
 *
 * 在用户首次进入 Odyssey 世界时显示:
 * - 叙事段落 (说明 Odyssey 的学习目的)
 * - 2x3 区域-课程单元映射网格
 * - 精简操作提示 (图标 + 一词标签)
 *
 * 使用 localStorage 记录访问状态，避免重复显示。
 * 提供模块级回调函数，供 HUD 的 "帮助" 按钮重新触发显示。
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MousePointerClick, ZoomIn, Move, Map } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REGION_COURSE_MAP } from './regionCourseMap'

// 使用 v2 存储键，确保已有用户也能看到新版欢迎界面
const STORAGE_KEY = 'odyssey-welcomed-v2'

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

/**
 * WelcomeOverlay -- 首次访问引导覆盖层
 *
 * 半透明暗色背景 + 居中毛玻璃卡片，
 * 展示叙事段落、区域-课程映射、精简操作提示。
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

  // 精简控制提示 (图标 + 短标签)
  const controlHints = [
    { icon: <MousePointerClick className="h-4 w-4 text-amber-400" />, labelKey: 'odyssey.ui.welcomeClickToMove' },
    { icon: <ZoomIn className="h-4 w-4 text-sky-400" />, labelKey: 'odyssey.ui.welcomeScrollToZoom' },
    { icon: <Move className="h-4 w-4 text-emerald-400" />, labelKey: 'odyssey.ui.welcomeDragElements' },
    { icon: <Map className="h-4 w-4 text-violet-400" />, labelKey: 'odyssey.ui.welcomePressM' },
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
              'relative z-10 mx-4 max-w-md w-full rounded-2xl p-6',
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
            <h2 className="mb-3 text-center text-lg font-light tracking-wider text-gray-100">
              {t('odyssey.ui.welcomeTitle')}
            </h2>

            {/* 叙事段落 -- 说明 Odyssey 的学习目的 */}
            <p className="mb-5 text-center text-xs leading-relaxed text-gray-400">
              {t('odyssey.welcome.narrative')}
            </p>

            {/* 2x3 区域-课程单元映射网格 */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {REGION_COURSE_MAP.map((region, i) => (
                <motion.div
                  key={region.regionId}
                  className={cn(
                    'rounded-lg px-3 py-2 bg-white/5',
                    'border border-white/5',
                  )}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <div className="text-xs font-medium text-gray-200">
                    {t(`odyssey.regions.${region.regionKey}`)}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {t(region.unitLabelKey)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 精简操作提示 -- 紧凑行 */}
            <div className="flex items-center justify-center gap-4 mb-5">
              {controlHints.map((hint) => (
                <div key={hint.labelKey} className="flex items-center gap-1.5">
                  {hint.icon}
                  <span className="text-[10px] text-gray-500">{t(hint.labelKey)}</span>
                </div>
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
