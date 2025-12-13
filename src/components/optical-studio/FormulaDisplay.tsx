/**
 * Formula Display Component - 公式显示组件
 *
 * Panel showing real-time physics formulas during simulation:
 * - Malus's Law calculations
 * - Wave plate transformations
 * - Sensor readings
 */

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Calculator, ChevronUp, ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'

// ============================================
// Formula Item Component
// ============================================

interface FormulaItemProps {
  formula: string
}

function FormulaItem({ formula }: FormulaItemProps) {
  const { theme } = useTheme()

  // Determine formula type and color
  const getFormulaStyle = () => {
    if (formula.includes('cos²')) {
      return { color: theme === 'dark' ? 'text-violet-400' : 'text-violet-600', icon: '◐' }
    }
    if (formula.includes('λ/')) {
      return { color: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600', icon: '◈' }
    }
    if (formula.includes('Mirror')) {
      return { color: theme === 'dark' ? 'text-blue-400' : 'text-blue-600', icon: '🪞' }
    }
    if (formula.includes('Sensor')) {
      return { color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600', icon: '📡' }
    }
    if (formula.includes('PBS') || formula.includes('Calcite')) {
      return { color: theme === 'dark' ? 'text-amber-400' : 'text-amber-600', icon: '◇' }
    }
    return { color: theme === 'dark' ? 'text-gray-300' : 'text-gray-700', icon: '•' }
  }

  const style = getFormulaStyle()

  return (
    <div className={cn(
      'flex items-start gap-2 px-2 py-1.5 rounded-lg',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
    )}>
      <span className="text-sm flex-shrink-0">{style.icon}</span>
      <span className={cn('text-xs font-mono leading-relaxed', style.color)}>
        {formula}
      </span>
    </div>
  )
}

// ============================================
// Main Formula Display Component
// ============================================

export function FormulaDisplay() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [isExpanded, setIsExpanded] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  const {
    isSimulating,
    showFormulas,
    currentFormulas,
  } = useOpticalBenchStore()

  // Don't show if not simulating or no formulas
  if (!isSimulating || !showFormulas || currentFormulas.length === 0) {
    return null
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={cn(
          'absolute bottom-4 right-4 p-2 rounded-xl border shadow-lg z-10',
          theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
        )}
        title={isZh ? '显示公式' : 'Show Formulas'}
      >
        <Calculator className={cn('w-5 h-5', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
      </button>
    )
  }

  return (
    <div className={cn(
      'absolute bottom-4 right-4 w-72 rounded-xl border shadow-xl z-10',
      theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Calculator className={cn('w-4 h-4', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
          <span className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '物理公式' : 'Physics Formulas'}
          </span>
          <span className={cn(
            'px-1.5 py-0.5 rounded-full text-[10px] font-medium',
            theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
          )}>
            {currentFormulas.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'p-1 rounded transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className={cn(
              'p-1 rounded transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formulas List */}
      {isExpanded && (
        <div className="p-2 max-h-48 overflow-y-auto space-y-1">
          {currentFormulas.map((formula, index) => (
            <FormulaItem key={index} formula={formula} />
          ))}
        </div>
      )}

      {/* Legend */}
      {isExpanded && (
        <div className={cn(
          'px-3 py-2 border-t text-[10px]',
          theme === 'dark' ? 'border-slate-700 text-gray-500' : 'border-gray-200 text-gray-400'
        )}>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span>◐ {isZh ? '偏振片' : 'Polarizer'}</span>
            <span>◈ {isZh ? '波片' : 'Waveplate'}</span>
            <span>◇ {isZh ? '分束器' : 'Splitter'}</span>
            <span>📡 {isZh ? '传感器' : 'Sensor'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormulaDisplay
