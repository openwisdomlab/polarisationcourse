/**
 * Status Bar Component - 状态栏组件
 *
 * Bottom status bar showing:
 * - Current simulation state
 * - Active formulas (compact view)
 * - Quick principles reference
 * - Context hints
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Play, Pause, Zap, Eye, ChevronUp, ChevronDown,
  Lightbulb, BookOpen, Calculator
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'

// ============================================
// Principles Quick Reference
// ============================================

interface PrincipleMiniProps {
  icon: string
  name: string
  formula?: string
  onClick?: () => void
}

function PrincipleMini({ icon, name, formula, onClick }: PrincipleMiniProps) {
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded transition-colors',
        theme === 'dark'
          ? 'hover:bg-slate-700/50 text-gray-400'
          : 'hover:bg-gray-100 text-gray-500'
      )}
      title={`${name}${formula ? `: ${formula}` : ''}`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] hidden lg:inline">{name}</span>
    </button>
  )
}

// ============================================
// Formulas Display Section
// ============================================

function FormulasSection() {
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState(false)

  const { currentFormulas, isSimulating, showFormulas } = useOpticalBenchStore()

  if (!isSimulating || !showFormulas || currentFormulas.length === 0) {
    return null
  }

  // Get last 3 formulas for compact view
  const displayFormulas = expanded ? currentFormulas : currentFormulas.slice(-3)

  return (
    <div className={cn(
      'flex items-center gap-2 px-2 py-1 rounded-lg',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
    )}>
      <Calculator className={cn('w-3.5 h-3.5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />

      <div className="flex items-center gap-1.5 overflow-x-auto max-w-md">
        {displayFormulas.map((formula, idx) => (
          <span
            key={idx}
            className={cn(
              'text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap',
              theme === 'dark' ? 'bg-slate-700/50 text-cyan-300' : 'bg-white text-cyan-700'
            )}
          >
            {formula}
          </span>
        ))}
        {!expanded && currentFormulas.length > 3 && (
          <span className={cn('text-[10px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
            +{currentFormulas.length - 3}
          </span>
        )}
      </div>

      {currentFormulas.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'p-0.5 rounded',
            theme === 'dark' ? 'hover:bg-slate-700 text-gray-500' : 'hover:bg-gray-200 text-gray-400'
          )}
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      )}
    </div>
  )
}

// ============================================
// Main Status Bar Component
// ============================================

export function StatusBar() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const {
    isSimulating,
    toggleSimulating,
    components,
    lightSegments,
    selectedComponentId,
    currentExperiment,
    currentChallenge,
  } = useOpticalBenchStore()

  // Principles data
  const principles = [
    { icon: '⊥', name: isZh ? '正交' : 'Orthogonal', formula: '90° = 无干涉' },
    { icon: '∠', name: isZh ? '马吕斯' : 'Malus', formula: 'I = I₀cos²θ' },
    { icon: '◇', name: isZh ? '双折射' : 'Birefr.', formula: 'o-ray / e-ray' },
    { icon: '∿', name: isZh ? '干涉' : 'Interf.', formula: '±1 phase' },
  ]

  // Context hints
  const getContextHint = () => {
    if (currentChallenge) {
      return isZh ? '调整组件完成目标' : 'Adjust components to reach the goal'
    }
    if (currentExperiment) {
      return isZh ? '观察光路变化' : 'Observe the light path changes'
    }
    if (selectedComponentId) {
      return isZh ? '按 R 旋转 | Del 删除' : 'R to rotate | Del to delete'
    }
    if (components.length === 0) {
      return isZh ? '从左侧添加组件开始设计' : 'Add components from the left panel'
    }
    if (!isSimulating) {
      return isZh ? '按空格键开始模拟' : 'Press Space to simulate'
    }
    return isZh ? '拖动组件调整光路' : 'Drag components to adjust'
  }

  return (
    <footer className={cn(
      'h-10 flex items-center justify-between px-4 border-t flex-shrink-0',
      theme === 'dark'
        ? 'bg-slate-900/80 border-slate-800'
        : 'bg-white/80 border-gray-200'
    )}>
      {/* Left Section: Simulation Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSimulating}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors',
            isSimulating
              ? theme === 'dark'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-100 text-emerald-700'
              : theme === 'dark'
                ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          )}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              {isZh ? '模拟中' : 'Simulating'}
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              {isZh ? '暂停' : 'Paused'}
            </>
          )}
        </button>

        {/* Stats */}
        <div className={cn(
          'flex items-center gap-3 text-[10px]',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        )}>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {components.length} {isZh ? '组件' : 'components'}
          </span>
          {isSimulating && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {lightSegments.length} {isZh ? '光段' : 'rays'}
            </span>
          )}
        </div>
      </div>

      {/* Center Section: Formulas */}
      <FormulasSection />

      {/* Right Section: Hints + Principles */}
      <div className="flex items-center gap-2">
        {/* Context Hint */}
        <div className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px]',
          theme === 'dark' ? 'bg-slate-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'
        )}>
          <Lightbulb className={cn('w-3 h-3', theme === 'dark' ? 'text-amber-400' : 'text-amber-500')} />
          <span className="hidden sm:inline">{getContextHint()}</span>
        </div>

        {/* Principles Quick Access */}
        <div className={cn(
          'hidden md:flex items-center border-l pl-2',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <BookOpen className={cn('w-3.5 h-3.5 mr-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')} />
          {principles.map((p, idx) => (
            <PrincipleMini key={idx} {...p} />
          ))}
        </div>
      </div>
    </footer>
  )
}

export default StatusBar
