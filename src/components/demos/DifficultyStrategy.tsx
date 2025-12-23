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

import { ReactNode, useState, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  HelpCircle,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Download,
  ExternalLink,
  Lightbulb,
  LightbulbOff,
  Sun,
  Camera,
  Target,
  FileSpreadsheet,
  FileCode,
  Eye,
} from 'lucide-react'

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

// ============================================================================
// FOUNDATION MODE COMPONENTS - Exaggerated Visuals & Zero Formulas
// ============================================================================

interface IntensityIndicatorProps {
  intensity: number // 0 to 1
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

/**
 * IntensityIndicator - Foundation mode visual for light intensity
 * Uses lightbulb icons with glow effects instead of numerical values
 */
export function IntensityIndicator({
  intensity,
  size = 'md',
  showLabel = true,
  className,
}: IntensityIndicatorProps) {
  const { theme } = useTheme()
  const clampedIntensity = Math.max(0, Math.min(1, intensity))

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48,
  }

  // Get descriptive label
  const getIntensityLabel = () => {
    if (clampedIntensity > 0.9) return { text: '很亮！', textEn: 'Very Bright!', emoji: '☀️' }
    if (clampedIntensity > 0.6) return { text: '亮', textEn: 'Bright', emoji: '💡' }
    if (clampedIntensity > 0.3) return { text: '较暗', textEn: 'Dim', emoji: '🔅' }
    if (clampedIntensity > 0.05) return { text: '很暗', textEn: 'Very Dim', emoji: '🌑' }
    return { text: '全黑', textEn: 'Dark', emoji: '⬛' }
  }

  const label = getIntensityLabel()

  // Calculate glow color and intensity
  const glowColor = clampedIntensity > 0.5
    ? `rgba(255, 230, 100, ${clampedIntensity * 0.8})`
    : `rgba(200, 180, 120, ${clampedIntensity * 0.5})`

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <motion.div
        className={cn(
          'relative flex items-center justify-center rounded-full',
          sizeClasses[size],
          theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
        )}
        animate={{
          boxShadow: clampedIntensity > 0.1
            ? `0 0 ${20 * clampedIntensity}px ${glowColor}, 0 0 ${40 * clampedIntensity}px ${glowColor}`
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            scale: 0.8 + clampedIntensity * 0.3,
            opacity: 0.3 + clampedIntensity * 0.7,
          }}
          transition={{ duration: 0.3 }}
        >
          {clampedIntensity > 0.1 ? (
            <Lightbulb
              size={iconSizes[size]}
              className="text-yellow-400"
              fill={clampedIntensity > 0.5 ? 'currentColor' : 'none'}
            />
          ) : (
            <LightbulbOff
              size={iconSizes[size]}
              className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}
            />
          )}
        </motion.div>
      </motion.div>

      {showLabel && (
        <motion.div
          className={cn(
            'text-center',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}
          key={label.text}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-2xl mr-1">{label.emoji}</span>
          <span className="text-sm font-medium">{label.text}</span>
        </motion.div>
      )}
    </div>
  )
}

interface SimpleIntensityBarProps {
  intensity: number
  maxIntensity?: number
  showEmoji?: boolean
  className?: string
}

/**
 * SimpleIntensityBar - Foundation mode simplified intensity bar
 * Uses emoji-based feedback instead of percentages
 */
export function SimpleIntensityBar({
  intensity,
  maxIntensity = 1,
  showEmoji = true,
  className,
}: SimpleIntensityBarProps) {
  const { theme } = useTheme()
  const ratio = Math.max(0, Math.min(1, intensity / maxIntensity))

  const getEmojis = () => {
    if (ratio > 0.9) return '☀️☀️☀️'
    if (ratio > 0.6) return '💡💡'
    if (ratio > 0.3) return '💡'
    if (ratio > 0.1) return '🔅'
    return '⬛'
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn(
        'relative h-8 rounded-full overflow-hidden',
        theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
      )}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            boxShadow: ratio > 0.3
              ? `0 0 ${ratio * 20}px rgba(255, 200, 50, 0.5)`
              : 'none',
          }}
        />
      </div>
      {showEmoji && (
        <div className="text-center text-2xl">
          {getEmojis()}
        </div>
      )}
    </div>
  )
}

interface WhatHappensCardProps {
  title: string
  titleZh: string
  description: string
  descriptionZh: string
  emoji?: string
  color?: 'green' | 'cyan' | 'yellow' | 'red'
  className?: string
}

/**
 * WhatHappensCard - Foundation mode explanation card
 * Focuses on "What happens?" without math
 */
export function WhatHappensCard({
  title,
  titleZh,
  description,
  descriptionZh,
  emoji = '✨',
  color = 'green',
  className,
}: WhatHappensCardProps) {
  const { theme } = useTheme()

  const colorClasses = {
    green: theme === 'dark'
      ? 'bg-green-900/30 border-green-500/40 text-green-400'
      : 'bg-green-50 border-green-300 text-green-700',
    cyan: theme === 'dark'
      ? 'bg-cyan-900/30 border-cyan-500/40 text-cyan-400'
      : 'bg-cyan-50 border-cyan-300 text-cyan-700',
    yellow: theme === 'dark'
      ? 'bg-yellow-900/30 border-yellow-500/40 text-yellow-400'
      : 'bg-yellow-50 border-yellow-300 text-yellow-700',
    red: theme === 'dark'
      ? 'bg-red-900/30 border-red-500/40 text-red-400'
      : 'bg-red-50 border-red-300 text-red-700',
  }

  return (
    <motion.div
      className={cn(
        'p-4 rounded-xl border-2',
        colorClasses[color],
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h4 className="font-bold text-lg mb-1">
            {titleZh} / {title}
          </h4>
          <p className={cn(
            'text-sm',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            {descriptionZh}
          </p>
          <p className={cn(
            'text-xs mt-1',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// APPLICATION MODE COMPONENTS - Scenario-Based Tasks
// ============================================================================

interface ScenarioCardProps {
  title: string
  titleZh: string
  scenario: string
  scenarioZh: string
  goal: string
  goalZh: string
  icon?: 'camera' | 'sunglasses' | 'lab' | 'eye'
  isActive?: boolean
  isCompleted?: boolean
  className?: string
  children?: ReactNode
}

/**
 * ScenarioCard - Application mode scenario-based learning wrapper
 * Simulates real-world contexts like photography or lab experiments
 */
export function ScenarioCard({
  title,
  titleZh,
  scenario,
  scenarioZh,
  goal,
  goalZh,
  icon = 'camera',
  isActive = true,
  isCompleted = false,
  className,
  children,
}: ScenarioCardProps) {
  const { theme } = useTheme()

  const IconComponent = {
    camera: Camera,
    sunglasses: Sun,
    lab: FlaskConical,
    eye: Eye,
  }[icon]

  return (
    <div className={cn('space-y-4', className)}>
      <div className={cn(
        'p-4 rounded-xl border-2 transition-all duration-300',
        isCompleted
          ? theme === 'dark'
            ? 'bg-green-900/30 border-green-500/50'
            : 'bg-green-50 border-green-300'
          : isActive
            ? theme === 'dark'
              ? 'bg-cyan-900/30 border-cyan-500/50'
              : 'bg-cyan-50 border-cyan-300'
            : theme === 'dark'
              ? 'bg-slate-800/50 border-slate-600/50'
              : 'bg-slate-100 border-slate-300'
      )}>
        {/* Scenario Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'p-2 rounded-lg',
            isCompleted ? 'bg-green-500/20' : 'bg-cyan-500/20'
          )}>
            <IconComponent className={cn(
              'w-6 h-6',
              isCompleted
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )} />
          </div>
          <div className="flex-1">
            <h3 className={cn(
              'font-semibold text-lg',
              isCompleted
                ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                : theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            )}>
              {titleZh} / {title}
            </h3>
          </div>
          {isCompleted && (
            <Sparkles className="w-6 h-6 text-green-400" />
          )}
        </div>

        {/* Scenario Description */}
        <div className={cn(
          'p-3 rounded-lg mb-3',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'
        )}>
          <p className={cn(
            'text-sm mb-2',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            📖 <strong>场景:</strong> {scenarioZh}
          </p>
          <p className={cn(
            'text-xs',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            Scenario: {scenario}
          </p>
        </div>

        {/* Goal */}
        <div className={cn(
          'flex items-center gap-2 p-3 rounded-lg',
          isCompleted
            ? theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
            : theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-100'
        )}>
          <Target className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">
              🎯 {goalZh}
            </p>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Goal: {goal}
            </p>
          </div>
        </div>
      </div>

      {/* Task Content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// RESEARCH MODE COMPONENTS - Data Export & Advanced Parameters
// ============================================================================

interface DataExportPanelProps {
  data: Record<string, number | string>
  title?: string
  titleZh?: string
  onExportCSV?: () => void
  onExportJSON?: () => void
  onExportMATLAB?: () => void
  className?: string
}

/**
 * DataExportPanel - Research mode data export functionality
 * Provides CSV, JSON, and MATLAB export options
 */
export function DataExportPanel({
  data,
  title = 'Data',
  titleZh = '数据',
  onExportCSV,
  onExportJSON,
  onExportMATLAB,
  className,
}: DataExportPanelProps) {
  const { theme } = useTheme()

  // Default export handlers
  const handleCSVExport = useCallback(() => {
    if (onExportCSV) {
      onExportCSV()
      return
    }

    const headers = Object.keys(data).join(',')
    const values = Object.values(data).join(',')
    const csv = `${headers}\n${values}`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'polarization_data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [data, onExportCSV])

  const handleJSONExport = useCallback(() => {
    if (onExportJSON) {
      onExportJSON()
      return
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'polarization_data.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [data, onExportJSON])

  const handleMATLABExport = useCallback(() => {
    if (onExportMATLAB) {
      onExportMATLAB()
      return
    }

    // Generate MATLAB-compatible script
    const lines = Object.entries(data).map(([key, value]) => {
      const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_')
      return typeof value === 'number'
        ? `${safeKey} = ${value};`
        : `${safeKey} = '${value}';`
    })

    const matlab = `% Polarization Data Export\n% Generated: ${new Date().toISOString()}\n\n${lines.join('\n')}`

    const blob = new Blob([matlab], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'polarization_data.m'
    a.click()
    URL.revokeObjectURL(url)
  }, [data, onExportMATLAB])

  return (
    <div className={cn(
      'p-4 rounded-xl border',
      theme === 'dark'
        ? 'bg-purple-900/20 border-purple-500/30'
        : 'bg-purple-50 border-purple-200',
      className
    )}>
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className={cn(
          'w-5 h-5',
          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
        )} />
        <h4 className={cn(
          'font-semibold',
          theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
        )}>
          {titleZh} / {title}
        </h4>
      </div>

      {/* Raw Data Display */}
      <div className={cn(
        'p-3 rounded-lg mb-4 font-mono text-xs overflow-x-auto',
        theme === 'dark'
          ? 'bg-slate-900 text-purple-300'
          : 'bg-white text-purple-700'
      )}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4">
            <span className="opacity-70">{key}:</span>
            <span className="font-bold">{typeof value === 'number' ? value.toFixed(6) : value}</span>
          </div>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCSVExport}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
          )}
        >
          <FileSpreadsheet className="w-4 h-4" />
          CSV
        </button>
        <button
          onClick={handleJSONExport}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
          )}
        >
          <FileCode className="w-4 h-4" />
          JSON
        </button>
        <button
          onClick={handleMATLABExport}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
          )}
        >
          <Download className="w-4 h-4" />
          MATLAB
        </button>
      </div>
    </div>
  )
}

interface JonesVectorControlProps {
  Ex: number
  Ey: number
  phi: number
  onExChange?: (value: number) => void
  onEyChange?: (value: number) => void
  onPhiChange?: (value: number) => void
  readOnly?: boolean
  className?: string
}

/**
 * JonesVectorControl - Research mode Jones vector input/display
 * Shows complex Jones vector with real and imaginary parts
 */
export function JonesVectorControl({
  Ex,
  Ey,
  phi,
  onExChange,
  onEyChange,
  onPhiChange,
  readOnly = false,
  className,
}: JonesVectorControlProps) {
  const { theme } = useTheme()

  // Calculate Jones vector components
  const ExReal = Ex * Math.cos(0)
  const ExImag = Ex * Math.sin(0)
  const EyReal = Ey * Math.cos(phi * Math.PI / 180)
  const EyImag = Ey * Math.sin(phi * Math.PI / 180)

  return (
    <div className={cn(
      'p-4 rounded-xl border',
      theme === 'dark'
        ? 'bg-purple-900/20 border-purple-500/30'
        : 'bg-purple-50 border-purple-200',
      className
    )}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-bold text-purple-500">|E⟩</span>
        <span className={cn(
          'text-sm',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          Jones Vector / Jones矢量
        </span>
      </div>

      {/* Vector Display */}
      <div className={cn(
        'p-3 rounded-lg mb-4 font-mono text-sm',
        theme === 'dark'
          ? 'bg-slate-900 text-purple-300'
          : 'bg-white text-purple-700'
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xl">[</span>
          <div className="flex flex-col items-center">
            <span>{ExReal.toFixed(3)} + {ExImag.toFixed(3)}i</span>
            <span>{EyReal.toFixed(3)} + {EyImag.toFixed(3)}i</span>
          </div>
          <span className="text-xl">]</span>
        </div>
      </div>

      {/* Controls */}
      {!readOnly && (
        <div className="space-y-3">
          <div>
            <label className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              E<sub>x</sub> amplitude
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={Ex}
              onChange={(e) => onExChange?.(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              E<sub>y</sub> amplitude
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={Ey}
              onChange={(e) => onEyChange?.(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Phase difference φ (degrees)
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={phi}
              onChange={(e) => onPhiChange?.(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DIFFICULTY_STRATEGY
