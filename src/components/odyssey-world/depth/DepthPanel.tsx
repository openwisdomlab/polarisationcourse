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

          {/* 面板主体 -- 从右侧滑入
              响应式宽度: mobile 100vw / tablet 80vw / desktop 65vw */}
          <motion.div
            key="depth-panel"
            className="fixed bottom-0 right-0 top-0 z-40 w-full overflow-y-auto md:w-[80vw] lg:w-[65vw]"
            style={{
              maxWidth: '900px',
              background: 'rgba(20, 20, 30, 0.92)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={PANEL_SPRING}
          >
            {/* 关闭按钮 -- mobile 更大更醒目 */}
            <button
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white/80 md:right-4 md:top-4 md:h-8 md:w-8 md:text-white/50"
              onClick={closeDepthPanel}
              aria-label="Close depth panel"
            >
              <X className="h-6 w-6 md:h-5 md:w-5" />
            </button>

            {/* 面板内容 -- mobile 紧凑内边距, 更大顶部留白给关闭按钮 */}
            <div className="p-4 pr-14 pt-14 md:p-6 md:pr-14 md:pt-6">
              <DepthPanelContent concept={concept} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
