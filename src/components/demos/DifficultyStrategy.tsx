/**
 * DifficultyStrategy - Progressive Disclosure System for Demos
 *
 * Implements a strict three-tier learning strategy:
 *
 * 1. FOUNDATION (基础层) - "Sandbox Mode"
 *    - Hide ALL charts and formulas
 *    - Focus on large interactive visuals (sliders, animations)
 *    - "Why?" button reveals simplified explanations with layout animation
 *    - Target: Beginners discovering phenomena through intuition
 *
 * 2. APPLICATION (应用层) - "Scenario Mode"
 *    - Focus on solving specific tasks ("Find the extinction angle")
 *    - Introduces the Virtual Polarizer Lens and similar task-based interactions
 *    - Show key formulas (I = I₀ × cos²θ) but emphasize practical application
 *    - Target: Learners building experimental intuition
 *
 * 3. RESEARCH (研究层) - "Lab Mode"
 *    - Show raw data, Jones Vectors/Matrices by default
 *    - Export buttons, advanced parameters
 *    - Full mathematical rigor with derivations
 *    - Target: Advanced learners conducting independent research
 */

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { HelpCircle, ChevronRight, FlaskConical, GraduationCap, Sparkles, Download, ExternalLink } from 'lucide-react'

// Types
export type DifficultyLevel = 'foundation' | 'application' | 'research'

export interface DifficultyConfig {
  // Display
  color: string
  icon: string
  label: string
  labelZh: string
  modeName: string
  modeNameZh: string

  // Content visibility
  showFormula: boolean
  showCharts: boolean
  showAdvancedDetails: boolean
  showRawData: boolean
  showExportButtons: boolean
  showJonesVectors: boolean
  showMuellerMatrices: boolean

  // Content limits
  maxPhysicsDetails: number
  maxFrontierDetails: number

  // Content style
  contentStyle: 'simple' | 'standard' | 'academic'
  showMathSymbols: boolean
  showDerivedFormulas: boolean

  // Interactive features
  showWhyButton: boolean        // Foundation: "Why?" reveal button
  showTaskMode: boolean         // Application: Task-based challenges
  showLabControls: boolean      // Research: Export, raw data controls
}

// Progressive Disclosure Configuration
export const DIFFICULTY_STRATEGY: Record<DifficultyLevel, DifficultyConfig> = {
  foundation: {
    // Display
    color: 'green',
    icon: '🌱',
    label: 'Foundation',
    labelZh: '基础层',
    modeName: 'Sandbox Mode',
    modeNameZh: '沙盒模式',

    // Content visibility - HIDE everything complex
    showFormula: false,
    showCharts: false,
    showAdvancedDetails: false,
    showRawData: false,
    showExportButtons: false,
    showJonesVectors: false,
    showMuellerMatrices: false,

    // Content limits - minimal
    maxPhysicsDetails: 2,
    maxFrontierDetails: 1,

    // Content style
    contentStyle: 'simple',
    showMathSymbols: false,
    showDerivedFormulas: false,

    // Interactive features
    showWhyButton: true,        // "Why?" button to reveal explanations
    showTaskMode: false,
    showLabControls: false,
  },

  application: {
    // Display
    color: 'cyan',
    icon: '🔬',
    label: 'Application',
    labelZh: '应用层',
    modeName: 'Scenario Mode',
    modeNameZh: '场景模式',

    // Content visibility - show practical formulas
    showFormula: true,
    showCharts: true,
    showAdvancedDetails: false,
    showRawData: false,
    showExportButtons: false,
    showJonesVectors: false,
    showMuellerMatrices: false,

    // Content limits - moderate
    maxPhysicsDetails: 3,
    maxFrontierDetails: 2,

    // Content style
    contentStyle: 'standard',
    showMathSymbols: true,
    showDerivedFormulas: false,

    // Interactive features
    showWhyButton: false,
    showTaskMode: true,         // Task-based challenges with Virtual Polarizer
    showLabControls: false,
  },

  research: {
    // Display
    color: 'purple',
    icon: '🚀',
    label: 'Research',
    labelZh: '研究层',
    modeName: 'Lab Mode',
    modeNameZh: '实验室模式',

    // Content visibility - show EVERYTHING
    showFormula: true,
    showCharts: true,
    showAdvancedDetails: true,
    showRawData: true,
    showExportButtons: true,
    showJonesVectors: true,
    showMuellerMatrices: true,

    // Content limits - maximum
    maxPhysicsDetails: 4,
    maxFrontierDetails: 3,

    // Content style
    contentStyle: 'academic',
    showMathSymbols: true,
    showDerivedFormulas: true,

    // Interactive features
    showWhyButton: false,
    showTaskMode: false,
    showLabControls: true,      // Export, raw data controls
  },
}

// Helper Components

interface WhyButtonProps {
  children: ReactNode
  className?: string
}

/**
 * WhyButton - Foundation mode component for revealing explanations
 * Uses Framer Motion layout animation for smooth reveal
 */
export function WhyButton({ children, className }: WhyButtonProps) {
  const { theme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <LayoutGroup>
      <motion.div
        layout
        className={cn('rounded-xl overflow-hidden', className)}
      >
        <motion.button
          layout="position"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 w-full transition-colors',
            theme === 'dark'
              ? 'bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-500/30'
              : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
          )}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">为什么？/ Why?</span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={cn(
                'px-4 py-4',
                theme === 'dark'
                  ? 'bg-slate-800/50 text-gray-300'
                  : 'bg-white text-gray-700'
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}

interface TaskModeWrapperProps {
  taskTitle: string
  taskTitleZh: string
  taskDescription: string
  taskDescriptionZh: string
  children: ReactNode
  isCompleted?: boolean
  className?: string
}

/**
 * TaskModeWrapper - Application mode component for scenario-based learning
 * Wraps interactive content with task instructions
 */
export function TaskModeWrapper({
  taskTitle,
  taskTitleZh,
  taskDescription,
  taskDescriptionZh,
  children,
  isCompleted = false,
  className,
}: TaskModeWrapperProps) {
  const { theme } = useTheme()

  return (
    <div className={cn('space-y-4', className)}>
      {/* Task Header */}
      <motion.div
        layout
        className={cn(
          'rounded-xl p-4 border-2 transition-colors',
          isCompleted
            ? theme === 'dark'
              ? 'bg-green-900/30 border-green-500/50'
              : 'bg-green-50 border-green-300'
            : theme === 'dark'
              ? 'bg-cyan-900/20 border-cyan-500/30'
              : 'bg-cyan-50 border-cyan-200'
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            isCompleted
              ? 'bg-green-500/20'
              : 'bg-cyan-500/20'
          )}>
            {isCompleted ? (
              <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-green-400' : 'text-green-600')} />
            ) : (
              <FlaskConical className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
            )}
          </div>
          <div className="flex-1">
            <h3 className={cn(
              'font-semibold mb-1',
              isCompleted
                ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                : theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            )}>
              🎯 {taskTitleZh} / {taskTitle}
            </h3>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {taskDescriptionZh} / {taskDescription}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Task Content */}
      <div className="relative">
        {children}
      </div>

      {/* Completion Status */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              theme === 'dark'
                ? 'bg-green-900/30 text-green-400'
                : 'bg-green-100 text-green-700'
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">任务完成！ / Task Complete!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface LabControlsProps {
  onExportData?: () => void
  onExportImage?: () => void
  onShowRawData?: () => void
  showJonesVectors?: boolean
  showMuellerMatrices?: boolean
  children?: ReactNode
  className?: string
}

/**
 * LabControls - Research mode component for advanced controls
 * Provides export buttons and raw data display toggles
 */
export function LabControls({
  onExportData,
  onExportImage,
  onShowRawData,
  showJonesVectors,
  showMuellerMatrices,
  children,
  className,
}: LabControlsProps) {
  const { theme } = useTheme()

  return (
    <div className={cn('space-y-4', className)}>
      {/* Lab Mode Header */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg',
        theme === 'dark'
          ? 'bg-purple-900/30 border border-purple-500/30'
          : 'bg-purple-50 border border-purple-200'
      )}>
        <GraduationCap className={cn('w-5 h-5', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />
        <span className={cn('font-medium', theme === 'dark' ? 'text-purple-400' : 'text-purple-700')}>
          实验室模式 / Lab Mode
        </span>
      </div>

      {/* Export Controls */}
      <div className="flex flex-wrap gap-2">
        {onExportData && (
          <button
            onClick={onExportData}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            <Download className="w-4 h-4" />
            导出数据 / Export Data
          </button>
        )}

        {onExportImage && (
          <button
            onClick={onExportImage}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            <Download className="w-4 h-4" />
            导出图像 / Export Image
          </button>
        )}

        {onShowRawData && (
          <button
            onClick={onShowRawData}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            <ExternalLink className="w-4 h-4" />
            原始数据 / Raw Data
          </button>
        )}
      </div>

      {/* Jones/Mueller toggles */}
      {(showJonesVectors || showMuellerMatrices) && (
        <div className={cn(
          'p-3 rounded-lg text-xs font-mono',
          theme === 'dark'
            ? 'bg-slate-800 text-purple-300 border border-purple-500/20'
            : 'bg-slate-50 text-purple-700 border border-purple-200'
        )}>
          {showJonesVectors && (
            <div className="mb-2">
              <span className="opacity-60">Jones Vector: </span>
              |E⟩ = E₀ [cos(θ), sin(θ)e^(iφ)]ᵀ
            </div>
          )}
          {showMuellerMatrices && (
            <div>
              <span className="opacity-60">Mueller Matrix: </span>
              M = ½ [1, cos(2θ); cos(2θ), 1]
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  )
}

/**
 * Hook for accessing difficulty configuration
 */
export function useDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return DIFFICULTY_STRATEGY[level]
}

/**
 * Component that conditionally renders based on difficulty level
 */
interface DifficultyGateProps {
  level: DifficultyLevel
  currentLevel: DifficultyLevel
  showWhen?: 'exact' | 'at-least' | 'at-most'
  children: ReactNode
}

const LEVEL_ORDER: DifficultyLevel[] = ['foundation', 'application', 'research']

export function DifficultyGate({
  level,
  currentLevel,
  showWhen = 'exact',
  children,
}: DifficultyGateProps) {
  const levelIndex = LEVEL_ORDER.indexOf(level)
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel)

  let shouldShow = false

  switch (showWhen) {
    case 'exact':
      shouldShow = currentLevel === level
      break
    case 'at-least':
      shouldShow = currentIndex >= levelIndex
      break
    case 'at-most':
      shouldShow = currentIndex <= levelIndex
      break
  }

  if (!shouldShow) return null

  return <>{children}</>
}

export default DIFFICULTY_STRATEGY
