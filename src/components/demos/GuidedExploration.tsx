/**
 * GuidedExploration - 引导式探索组件
 *
 * 为 Foundation 模式提供分步引导探索体验:
 * - 按步骤逐步解锁控件
 * - 未激活的控件变暗且不可交互
 * - 进度条显示当前步骤
 * - "跳过到自由探索" 按钮
 * - 完成后解锁所有控件
 *
 * 使用方式:
 * <GuidedExploration steps={[...]} onComplete={...}>
 *   {(activeControls, currentStep) => (
 *     <YourDemoContent />
 *   )}
 * </GuidedExploration>
 */

import { useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useDemoTheme } from './demoThemeColors'
import {
  ChevronRight,
  ChevronLeft,
  SkipForward,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Play,
} from 'lucide-react'

// 引导步骤定义
export interface GuidedStep {
  /** 步骤指示文本 */
  instruction: string
  /** 英文指示文本 */
  instructionEn?: string
  /** 该步骤启用的控件ID列表 */
  enabledControls: string[]
  /** 可选验证函数 - 返回 true 表示步骤完成 */
  validation?: () => boolean
  /** 可选提示文本 */
  hint?: string
  /** 英文提示文本 */
  hintEn?: string
}

interface GuidedExplorationProps {
  /** 步骤定义数组 */
  steps: GuidedStep[]
  /** 完成引导后的回调 */
  onComplete?: () => void
  /** 渲染函数: 接收当前启用的控件集合和步骤索引 */
  children: (
    enabledControls: Set<string>,
    currentStep: number,
    isComplete: boolean
  ) => ReactNode
  /** 额外 CSS 类名 */
  className?: string
  /** 标题 */
  title?: string
  /** 英文标题 */
  titleEn?: string
}

export function GuidedExploration({
  steps,
  onComplete,
  children,
  className,
  title = '引导探索',
  titleEn = 'Guided Exploration',
}: GuidedExplorationProps) {
  const dt = useDemoTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  // 当前启用的控件集合
  const enabledControls = isComplete
    ? new Set<string>() // 完成后不限制 (由调用方处理全部启用)
    : new Set(steps[currentStep]?.enabledControls ?? [])

  const totalSteps = steps.length
  const step = steps[currentStep]

  const goToNextStep = useCallback(() => {
    setShowHint(false)
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentStep, totalSteps, onComplete])

  const goToPrevStep = useCallback(() => {
    setShowHint(false)
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const skipToFreeExploration = useCallback(() => {
    setIsComplete(true)
    onComplete?.()
  }, [onComplete])

  const startExploration = useCallback(() => {
    setIsStarted(true)
  }, [])

  // 未开始时显示启动画面
  if (!isStarted) {
    return (
      <div className={cn('space-y-4', className)}>
        <motion.div
          className={cn(
            'rounded-2xl border-2 p-6 text-center',
            dt.isDark
              ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-500/40'
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              'p-3 rounded-full',
              dt.isDark ? 'bg-green-500/20' : 'bg-green-100'
            )}>
              <Lightbulb className={cn(
                'w-8 h-8',
                dt.isDark ? 'text-green-400' : 'text-green-600'
              )} />
            </div>
            <h3 className={cn(
              'text-lg font-bold',
              dt.isDark ? 'text-green-400' : 'text-green-700'
            )}>
              {title} / {titleEn}
            </h3>
            <p className={cn('text-sm max-w-md', dt.bodyClass)}>
              {totalSteps} 个步骤带你从零认识这个物理现象。
              每一步解锁新的控件，循序渐进地发现规律。
            </p>
            <div className="flex gap-3 mt-2">
              <motion.button
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors',
                  dt.isDark
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30'
                    : 'bg-green-600 text-white hover:bg-green-700'
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startExploration}
              >
                <Play className="w-4 h-4" />
                开始引导
              </motion.button>
              <motion.button
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors',
                  dt.isDark
                    ? 'bg-slate-800/50 text-gray-400 border border-slate-700 hover:bg-slate-700/50'
                    : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={skipToFreeExploration}
              >
                <SkipForward className="w-4 h-4" />
                自由探索
              </motion.button>
            </div>
          </div>
        </motion.div>
        {children(new Set(), 0, true)}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 引导面板 */}
      <motion.div
        className={cn(
          'rounded-2xl border overflow-hidden',
          isComplete
            ? dt.isDark
              ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-green-500/40'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
            : dt.isDark
              ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30'
              : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300'
        )}
        layout
      >
        {/* 进度条 */}
        {!isComplete && (
          <div className={cn(
            'h-1.5 w-full',
            dt.isDark ? 'bg-slate-800' : 'bg-gray-200'
          )}>
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        )}

        <div className="p-4">
          {isComplete ? (
            /* 完成状态 */
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles className={cn(
                'w-6 h-6',
                dt.isDark ? 'text-green-400' : 'text-green-600'
              )} />
              <div className="flex-1">
                <p className={cn(
                  'font-semibold',
                  dt.isDark ? 'text-green-400' : 'text-green-700'
                )}>
                  引导完成！所有控件已解锁。
                </p>
                <p className={cn('text-xs mt-0.5', dt.mutedTextClass)}>
                  Exploration complete! All controls unlocked.
                </p>
              </div>
            </motion.div>
          ) : (
            /* 当前步骤 */
            <>
              {/* 步骤编号和指令 */}
              <div className="flex items-start gap-3">
                <div className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  dt.isDark
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-cyan-100 text-cyan-700'
                )}>
                  {currentStep + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentStep}
                      className={cn('font-medium', dt.isDark ? 'text-cyan-300' : 'text-cyan-700')}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step?.instruction}
                    </motion.p>
                  </AnimatePresence>
                  {step?.instructionEn && (
                    <p className={cn('text-xs mt-0.5', dt.mutedTextClass)}>
                      {step.instructionEn}
                    </p>
                  )}
                </div>
                <span className={cn('text-xs flex-shrink-0', dt.mutedTextClass)}>
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>

              {/* 提示区 */}
              {step?.hint && (
                <AnimatePresence>
                  {showHint ? (
                    <motion.div
                      className={cn(
                        'mt-3 p-3 rounded-lg text-sm',
                        dt.isDark
                          ? 'bg-yellow-900/20 border border-yellow-500/30 text-yellow-300'
                          : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                      )}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p>{step.hint}</p>
                          {step.hintEn && (
                            <p className={cn('text-xs mt-1', dt.mutedTextClass)}>
                              {step.hintEn}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      className={cn(
                        'mt-2 text-xs flex items-center gap-1',
                        dt.isDark ? 'text-yellow-400/70 hover:text-yellow-400' : 'text-yellow-600/70 hover:text-yellow-600'
                      )}
                      onClick={() => setShowHint(true)}
                    >
                      <Lightbulb className="w-3 h-3" />
                      需要提示？
                    </motion.button>
                  )}
                </AnimatePresence>
              )}

              {/* 导航按钮 */}
              <div className="flex items-center gap-2 mt-3">
                {currentStep > 0 && (
                  <motion.button
                    className={cn(
                      'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors',
                      dt.isDark
                        ? 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToPrevStep}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一步
                  </motion.button>
                )}

                <motion.button
                  className={cn(
                    'flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    dt.isDark
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700'
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goToNextStep}
                >
                  {currentStep === totalSteps - 1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      完成
                    </>
                  ) : (
                    <>
                      下一步
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <div className="flex-1" />

                <motion.button
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors',
                    dt.isDark
                      ? 'text-gray-500 hover:text-gray-400 hover:bg-slate-800/50'
                      : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={skipToFreeExploration}
                >
                  <SkipForward className="w-3 h-3" />
                  跳过
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* 步骤指示器 (dots) */}
      {!isComplete && (
        <div className="flex items-center justify-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'rounded-full transition-all duration-300',
                i === currentStep
                  ? cn('w-6 h-2', dt.isDark ? 'bg-cyan-400' : 'bg-cyan-600')
                  : i < currentStep
                    ? cn('w-2 h-2', dt.isDark ? 'bg-green-400/60' : 'bg-green-500/60')
                    : cn('w-2 h-2', dt.isDark ? 'bg-slate-700' : 'bg-gray-300')
              )}
            />
          ))}
        </div>
      )}

      {/* 演示内容 (由调用方渲染) */}
      {children(enabledControls, currentStep, isComplete)}
    </div>
  )
}

/**
 * GuidedControlWrapper - 包装控件使其支持引导模式
 *
 * 根据当前步骤启用/禁用包裹的控件
 */
interface GuidedControlWrapperProps {
  /** 控件唯一ID */
  controlId: string
  /** 当前启用的控件集合 */
  enabledControls: Set<string>
  /** 引导是否完成 */
  isComplete: boolean
  /** 子组件 */
  children: ReactNode
  /** 额外 CSS 类名 */
  className?: string
}

export function GuidedControlWrapper({
  controlId,
  enabledControls,
  isComplete,
  children,
  className,
}: GuidedControlWrapperProps) {
  const isEnabled = isComplete || enabledControls.has(controlId)

  return (
    <div
      className={cn(
        'transition-all duration-300',
        !isEnabled && 'opacity-30 pointer-events-none select-none',
        className,
      )}
      aria-disabled={!isEnabled}
    >
      {children}
    </div>
  )
}
