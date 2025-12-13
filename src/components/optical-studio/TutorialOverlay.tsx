/**
 * Tutorial Overlay Component - 教程覆盖层组件
 *
 * Overlay for interactive tutorials with:
 * - Step-by-step instructions
 * - Highlighting of target elements
 * - Navigation between steps
 */

import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  ChevronLeft, ChevronRight, X, GraduationCap,
  MousePointer, Move, RotateCcw, Eye
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'

// ============================================
// Action Icon Map
// ============================================

const ACTION_ICONS = {
  click: MousePointer,
  drag: Move,
  rotate: RotateCcw,
  observe: Eye,
}

// ============================================
// Tutorial Overlay Component
// ============================================

export function TutorialOverlay() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const overlayRef = useRef<HTMLDivElement>(null)

  const {
    currentTutorial,
    tutorialStepIndex,
    nextTutorialStep,
    prevTutorialStep,
    endTutorial,
  } = useOpticalBenchStore()

  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)

  // Get current step
  const currentStep = currentTutorial?.steps[tutorialStepIndex]
  const totalSteps = currentTutorial?.steps.length ?? 0
  const isFirstStep = tutorialStepIndex === 0
  const isLastStep = tutorialStepIndex === totalSteps - 1

  // Find and highlight target element
  useEffect(() => {
    if (currentStep?.target) {
      const element = document.querySelector(currentStep.target)
      if (element) {
        const rect = element.getBoundingClientRect()
        setHighlightRect(rect)
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setHighlightRect(null)
      }
    } else {
      setHighlightRect(null)
    }
  }, [currentStep])

  if (!currentTutorial || !currentStep) return null

  const ActionIcon = currentStep.action ? ACTION_ICONS[currentStep.action] : null

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!highlightRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }

    const position = currentStep.position || 'bottom'
    const padding = 20

    switch (position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - highlightRect.top + padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        }
      case 'bottom':
        return {
          top: `${highlightRect.bottom + padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translateX(-50%)',
        }
      case 'left':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          right: `${window.innerWidth - highlightRect.left + padding}px`,
          transform: 'translateY(-50%)',
        }
      case 'right':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.right + padding}px`,
          transform: 'translateY(-50%)',
        }
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {/* Backdrop with highlight cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="tutorial-mask">
            <rect width="100%" height="100%" fill="white" />
            {highlightRect && (
              <rect
                x={highlightRect.left - 8}
                y={highlightRect.top - 8}
                width={highlightRect.width + 16}
                height={highlightRect.height + 16}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={theme === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)'}
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* Highlight ring */}
      {highlightRect && (
        <div
          className="absolute border-2 border-cyan-400 rounded-lg animate-pulse pointer-events-none"
          style={{
            top: highlightRect.top - 8,
            left: highlightRect.left - 8,
            width: highlightRect.width + 16,
            height: highlightRect.height + 16,
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)',
          }}
        />
      )}

      {/* Tutorial tooltip */}
      <div
        className={cn(
          'fixed w-80 rounded-xl border shadow-2xl pointer-events-auto',
          theme === 'dark' ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-cyan-400'
        )}
        style={getTooltipPosition()}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-3 border-b',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <div className="flex items-center gap-2">
            <GraduationCap className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
            <span className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? currentTutorial.nameZh : currentTutorial.nameEn}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {tutorialStepIndex + 1} / {totalSteps}
            </span>
            <button
              onClick={endTutorial}
              className={cn(
                'p-1 rounded transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className={cn('font-bold mb-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? currentStep.titleZh : currentStep.titleEn}
          </h4>
          <p className={cn('text-sm mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            {isZh ? currentStep.contentZh : currentStep.contentEn}
          </p>

          {/* Action indicator */}
          {ActionIcon && (
            <div className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-xs',
              theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
            )}>
              <ActionIcon className="w-4 h-4" />
              <span>
                {currentStep.action === 'click' && (isZh ? '点击目标元素' : 'Click the target')}
                {currentStep.action === 'drag' && (isZh ? '拖动组件' : 'Drag the component')}
                {currentStep.action === 'rotate' && (isZh ? '旋转组件' : 'Rotate the component')}
                {currentStep.action === 'observe' && (isZh ? '观察结果' : 'Observe the result')}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className={cn('px-4', theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50')}>
          <div className={cn('h-1 rounded-full overflow-hidden', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${((tutorialStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className={cn(
          'flex items-center justify-between p-3 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <button
            onClick={prevTutorialStep}
            disabled={isFirstStep}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              isFirstStep
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            {isZh ? '上一步' : 'Previous'}
          </button>

          {isLastStep ? (
            <button
              onClick={endTutorial}
              className={cn(
                'flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors',
                'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
              )}
            >
              {isZh ? '完成' : 'Finish'}
            </button>
          ) : (
            <button
              onClick={nextTutorialStep}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700'
              )}
            >
              {isZh ? '下一步' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay
