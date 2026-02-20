/**
 * DepthPanel.tsx -- 深度面板叠加层
 *
 * 从右侧滑入的面板，显示概念的三层深度内容。
 * HTML 叠加层 (非 SVG)，类似 WorldMap 的叠加模式。
 *
 * z-index 层级:
 * - 背景遮罩: z-30 (bg-black/40 + backdrop-blur)
 * - 面板主体: z-40 (右侧滑入，宽度 ~65vw)
 *
 * 退出方式: Escape / 关闭按钮 / 点击遮罩
 *
 * Spring 动画: stiffness 120, damping 20 (~0.7s 稳定时间)
 */

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { getConceptById } from '@/components/odyssey-world/concepts/conceptRegistry'
import { DepthPanelContent } from './DepthPanelContent'

// 确保概念注册表已初始化 (副作用导入)
import '@/components/odyssey-world/concepts/crystalLabConcepts'
import '@/components/odyssey-world/concepts/refractionBenchConcepts'
import '@/components/odyssey-world/concepts/wavePlatformConcepts'
import '@/components/odyssey-world/concepts/scatteringChamberConcepts'
import '@/components/odyssey-world/concepts/interfaceLabConcepts'
import '@/components/odyssey-world/concepts/measurementStudioConcepts'

/** Spring 动画参数 (研究验证 ~0.7s 稳定时间) */
const PANEL_SPRING = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 20,
}

/**
 * DepthPanel -- 深度面板叠加层
 *
 * 从 store 读取 depthPanelConceptId:
 * - null: 不渲染
 * - 非 null: 查找概念，渲染遮罩 + 面板
 *
 * 面板从右侧滑入 (x: 100% -> 0)，背景淡入遮罩。
 * 面板内容可滚动 (overflow-y-auto)。
 */
export function DepthPanel() {
  const conceptId = useOdysseyWorldStore((s) => s.depthPanelConceptId)
  const closeDepthPanel = useOdysseyWorldStore((s) => s.closeDepthPanel)

  const concept = conceptId ? getConceptById(conceptId) : null

  // Escape 键关闭面板
  useEffect(() => {
    if (!conceptId) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDepthPanel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [conceptId, closeDepthPanel])

  return (
    <AnimatePresence>
      {concept && (
        <>
          {/* 背景遮罩 -- 点击关闭面板 */}
          <motion.div
            key="depth-backdrop"
            className="fixed inset-0 z-30"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.40)',
              backdropFilter: 'blur(4px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDepthPanel}
          />

          {/* 面板主体 -- 从右侧滑入 */}
          <motion.div
            key="depth-panel"
            className="fixed bottom-0 right-0 top-0 z-40 overflow-y-auto"
            style={{
              width: '65vw',
              maxWidth: '900px',
              background: 'rgba(20, 20, 30, 0.92)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={PANEL_SPRING}
          >
            {/* 关闭按钮 */}
            <button
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
              onClick={closeDepthPanel}
              aria-label="Close depth panel"
            >
              <X className="h-5 w-5" />
            </button>

            {/* 面板内容 */}
            <div className="p-6 pr-14 pt-6">
              <DepthPanelContent concept={concept} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
