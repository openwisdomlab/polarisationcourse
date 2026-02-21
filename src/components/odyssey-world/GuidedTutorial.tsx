/**
 * GuidedTutorial.tsx -- 3 步引导教程
 *
 * 首次访问时 (WelcomeOverlay 关闭后) 自动启动。
 * 状态机: IDLE → HIGHLIGHT → AWAIT_ROTATION → SHOW_RESULT → NEXT → COMPLETE
 *
 * 3 步微教程 (~45 秒):
 * 1. "旋转这个偏振片" (教旋转操作)
 * 2. "拖拽一个元素到光束上" (教拖拽操作)
 * 3. "观察光的变化" (教观察 → 发现)
 *
 * 渲染为 HTML 叠加层, z-15 (低于 WorldMap/DepthPanel)
 */

import { useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore, type TutorialState } from '@/stores/odysseyWorldStore'

/** 教程步骤配置 */
const TUTORIAL_STEPS = [
  {
    titleKey: 'odyssey.tutorial.step1Title',
    descKey: 'odyssey.tutorial.step1Desc',
    targetElementId: 'crystal-lab-polarizer-1',
    awaitState: 'await-rotation' as TutorialState,
  },
  {
    titleKey: 'odyssey.tutorial.step2Title',
    descKey: 'odyssey.tutorial.step2Desc',
    targetElementId: null, // 从调色盘拖拽
    awaitState: 'await-rotation' as TutorialState,
  },
  {
    titleKey: 'odyssey.tutorial.step3Title',
    descKey: 'odyssey.tutorial.step3Desc',
    targetElementId: null, // 观察光束变化
    awaitState: 'show-result' as TutorialState,
  },
]

/**
 * GuidedTutorial -- 引导教程叠加层
 *
 * 监听 store 中的 tutorialState 变化，渲染对应 UI。
 * 首次选中/旋转偏振片时自动推进到下一步。
 */
export function GuidedTutorial() {
  const { t } = useTranslation()
  const tutorialState = useOdysseyWorldStore((s) => s.tutorialState)
  const tutorialStep = useOdysseyWorldStore((s) => s.tutorialStep)
  const tutorialCompleted = useOdysseyWorldStore((s) => s.tutorialCompleted)
  const selectedElementId = useOdysseyWorldStore((s) => s.selectedElementId)
  const interactionMode = useOdysseyWorldStore((s) => s.interactionMode)

  // 启动教程 (WelcomeOverlay 关闭后触发)
  const startTutorial = useCallback(() => {
    if (tutorialCompleted) return
    const store = useOdysseyWorldStore.getState()
    if (store.tutorialState === 'idle') {
      store.setTutorialState('highlight-element')
    }
  }, [tutorialCompleted])

  // 监听 WelcomeOverlay 消失 -- 延迟 1 秒后启动教程
  useEffect(() => {
    if (tutorialCompleted) return
    const timer = setTimeout(startTutorial, 1500)
    return () => clearTimeout(timer)
  }, [startTutorial, tutorialCompleted])

  // 步骤 1: 用户选中目标偏振片 → 推进
  useEffect(() => {
    if (tutorialState !== 'highlight-element' || tutorialStep !== 0) return
    if (selectedElementId === TUTORIAL_STEPS[0].targetElementId) {
      useOdysseyWorldStore.getState().setTutorialState('await-rotation')
    }
  }, [tutorialState, tutorialStep, selectedElementId])

  // 步骤 1: 用户旋转偏振片 → 庆祝 → 下一步
  useEffect(() => {
    if (tutorialState !== 'await-rotation' || tutorialStep !== 0) return
    if (interactionMode !== 'rotate') return
    // 旋转开始，等 1 秒后推进
    const timer = setTimeout(() => {
      useOdysseyWorldStore.getState().setTutorialState('show-result')
      // 2 秒后推进到下一步
      setTimeout(() => {
        useOdysseyWorldStore.getState().advanceTutorial()
      }, 2000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [tutorialState, tutorialStep, interactionMode])

  // 步骤 2: 用户添加了新元素 → 推进
  useEffect(() => {
    if (tutorialStep !== 1 || tutorialState !== 'highlight-element') return
    const unsub = useOdysseyWorldStore.subscribe(
      (s) => s.sceneElements.length,
      (newLen, prevLen) => {
        if (newLen > prevLen) {
          useOdysseyWorldStore.getState().setTutorialState('show-result')
          setTimeout(() => {
            useOdysseyWorldStore.getState().advanceTutorial()
          }, 2000)
        }
      },
    )
    return unsub
  }, [tutorialStep, tutorialState])

  // 步骤 3: 自动完成 -- 等待 5 秒后标记完成
  useEffect(() => {
    if (tutorialStep !== 2 || tutorialState !== 'highlight-element') return
    const timer = setTimeout(() => {
      useOdysseyWorldStore.getState().completeTutorial()
    }, 5000)
    return () => clearTimeout(timer)
  }, [tutorialStep, tutorialState])

  // 跳过按钮处理
  const handleSkip = useCallback(() => {
    useOdysseyWorldStore.getState().completeTutorial()
  }, [])

  // 教程完成或未激活 -- 不渲染
  if (tutorialCompleted || tutorialState === 'idle' || tutorialState === 'complete') {
    return null
  }

  const currentStep = TUTORIAL_STEPS[tutorialStep]
  if (!currentStep) return null

  const isShowingResult = tutorialState === 'show-result'

  return (
    <div className="pointer-events-none absolute inset-0 z-[15]">
      {/* 教程提示卡片 -- 底部居中 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`step-${tutorialStep}-${tutorialState}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className={cn(
            'pointer-events-auto absolute bottom-16 left-1/2 -translate-x-1/2',
            'rounded-2xl px-5 py-3.5',
            'bg-white/80 dark:bg-black/60',
            'backdrop-blur-md',
            'border border-white/30 dark:border-white/15',
            'shadow-lg shadow-black/10 dark:shadow-black/30',
            'max-w-xs md:max-w-sm',
            'text-center',
          )}
        >
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {TUTORIAL_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  idx === tutorialStep
                    ? 'w-6 bg-blue-400 dark:bg-blue-300'
                    : idx < tutorialStep
                      ? 'w-3 bg-blue-300/60 dark:bg-blue-400/40'
                      : 'w-3 bg-gray-300/40 dark:bg-gray-500/30',
                )}
              />
            ))}
          </div>

          {/* 标题 */}
          <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200 mb-1">
            {isShowingResult ? '✓' : ''} {t(currentStep.titleKey)}
          </p>

          {/* 描述 */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t(currentStep.descKey)}
          </p>

          {/* 跳过按钮 */}
          {!isShowingResult && (
            <button
              className={cn(
                'mt-2.5 text-[10px] text-gray-400 dark:text-gray-500',
                'hover:text-gray-600 dark:hover:text-gray-300',
                'transition-colors cursor-pointer',
              )}
              onClick={handleSkip}
            >
              {t('odyssey.tutorial.skip')}
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 脉冲指示环 -- 仅步骤 1 在 highlight 状态显示 */}
      {tutorialStep === 0 && tutorialState === 'highlight-element' && currentStep.targetElementId && (
        <TutorialPulseIndicator targetElementId={currentStep.targetElementId} />
      )}
    </div>
  )
}

/**
 * TutorialPulseIndicator -- 渲染脉冲指示环在目标元素上方
 *
 * 通过 DOM 查询 [data-element-id] 属性获取 SVG 元素的屏幕坐标，
 * 使用 getBoundingClientRect() 自动适配摄像机平移和缩放。
 * 以 300ms 间隔轮询位置，5 秒超时后停止查询。
 */
function TutorialPulseIndicator({ targetElementId }: { targetElementId: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 17 // ~5 秒 (17 * 300ms)

    const interval = setInterval(() => {
      const svgEl = document.querySelector(`[data-element-id="${targetElementId}"]`)
      if (svgEl) {
        const rect = svgEl.getBoundingClientRect()
        setPos({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 })
      }

      attempts++
      if (attempts >= maxAttempts && !svgEl) {
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [targetElementId])

  if (!pos) {
    // 回退: 元素未找到时仍显示居中脉冲
    return (
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          className="h-16 w-16 rounded-full border-2 border-blue-400/60 dark:border-blue-300/50"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="fixed pointer-events-none"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        className="h-16 w-16 rounded-full border-2 border-blue-400/60 dark:border-blue-300/50"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.2, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
