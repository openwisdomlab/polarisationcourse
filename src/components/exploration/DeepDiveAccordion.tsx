/**
 * DeepDiveAccordion - 深入内容折叠组件
 *
 * 按难度层级展示内容，但所有内容始终可访问
 * 根据用户选择的"难度透镜"默认展开不同层级
 */

import { useState, memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  Sprout,
  Microscope,
  Rocket,
  Calculator
} from 'lucide-react'
import { useExplorationStore } from '@/stores/explorationStore'
import type { ExplorationNode } from '@/data/explorationNodes'

interface DeepDiveAccordionProps {
  nodeId: string
  deepDive: ExplorationNode['deepDive']
  className?: string
}

type DifficultyLevel = 'foundation' | 'application' | 'research'

interface LevelConfig {
  key: DifficultyLevel
  icon: React.ReactNode
  title: { en: string; zh: string }
  description: { en: string; zh: string }
  color: string
  bgColor: string
}

const levelConfigs: LevelConfig[] = [
  {
    key: 'foundation',
    icon: <Sprout className="w-4 h-4" />,
    title: { en: 'Simple Explanation', zh: '简单解释' },
    description: { en: 'Everyday language, no formulas', zh: '日常语言，无公式' },
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 border-green-500/30',
  },
  {
    key: 'application',
    icon: <Microscope className="w-4 h-4" />,
    title: { en: 'With Formulas', zh: '包含公式' },
    description: { en: 'Quantitative understanding', zh: '定量理解' },
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    key: 'research',
    icon: <Rocket className="w-4 h-4" />,
    title: { en: 'Full Theory', zh: '完整理论' },
    description: { en: 'Rigorous derivation', zh: '严格推导' },
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
  },
]

export const DeepDiveAccordion = memo(function DeepDiveAccordion({
  nodeId,
  deepDive,
  className
}: DeepDiveAccordionProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const difficultyLens = useExplorationStore(state => state.difficultyLens)
  const expandSection = useExplorationStore(state => state.expandSection)

  // 根据难度透镜决定默认展开的层级
  const getDefaultExpanded = (): DifficultyLevel[] => {
    switch (difficultyLens) {
      case 'foundation':
        return ['foundation']
      case 'application':
        return ['foundation', 'application']
      case 'research':
        return ['foundation', 'application', 'research']
      default:
        return ['foundation']
    }
  }

  const [expandedLevels, setExpandedLevels] = useState<DifficultyLevel[]>(getDefaultExpanded())

  // 当难度透镜变化时，更新默认展开状态
  useEffect(() => {
    setExpandedLevels(getDefaultExpanded())
  }, [difficultyLens])

  const toggleLevel = (level: DifficultyLevel) => {
    if (expandedLevels.includes(level)) {
      setExpandedLevels(expandedLevels.filter(l => l !== level))
    } else {
      setExpandedLevels([...expandedLevels, level])
      expandSection(nodeId, `deepdive-${level}`)
    }
  }

  const getContent = (level: DifficultyLevel): string => {
    const content = deepDive[level]
    return isZh ? content.zh : content.en
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn(
          'text-sm font-semibold',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {isZh ? '深入了解' : 'Learn More'}
        </h3>
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
        )}>
          {isZh ? '所有内容始终可见' : 'All content accessible'}
        </span>
      </div>

      {/* Levels */}
      {levelConfigs.map((config) => {
        const isExpanded = expandedLevels.includes(config.key)
        const content = getContent(config.key)

        return (
          <div
            key={config.key}
            className={cn(
              'rounded-lg border overflow-hidden transition-all',
              isExpanded
                ? config.bgColor
                : theme === 'dark'
                  ? 'bg-slate-800/30 border-slate-700'
                  : 'bg-white/50 border-gray-200'
            )}
          >
            <button
              onClick={() => toggleLevel(config.key)}
              className={cn(
                'w-full flex items-center justify-between p-3 text-left transition-colors',
                theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={config.color}>{config.icon}</span>
                <div>
                  <span className={cn(
                    'text-sm font-medium',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? config.title.zh : config.title.en}
                  </span>
                  <span className={cn(
                    'text-xs ml-2',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {isZh ? config.description.zh : config.description.en}
                  </span>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
              ) : (
                <ChevronRight className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
              )}
            </button>

            {isExpanded && (
              <div className={cn(
                'px-3 pb-3 pt-0',
              )}>
                <div className={cn(
                  'p-3 rounded-lg text-sm leading-relaxed',
                  theme === 'dark' ? 'bg-slate-900/50 text-gray-300' : 'bg-white/70 text-gray-700'
                )}>
                  {content}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Formulas section */}
      {deepDive.formulas && deepDive.formulas.length > 0 && (
        <div className={cn(
          'mt-4 p-3 rounded-lg border',
          theme === 'dark'
            ? 'bg-indigo-500/10 border-indigo-500/30'
            : 'bg-indigo-50 border-indigo-200'
        )}>
          <h4 className={cn(
            'text-sm font-medium flex items-center gap-2 mb-3',
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'
          )}>
            <Calculator className="w-4 h-4" />
            {isZh ? '关键公式' : 'Key Formulas'}
          </h4>
          <div className="space-y-3">
            {deepDive.formulas.map((formula, index) => (
              <div key={index} className="space-y-1">
                <div className={cn(
                  'font-mono text-center py-2 px-3 rounded',
                  theme === 'dark' ? 'bg-slate-900/50 text-white' : 'bg-white text-gray-900'
                )}>
                  {formula.latex}
                </div>
                <p className={cn(
                  'text-xs text-center',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {isZh ? formula.description.zh : formula.description.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

export default DeepDiveAccordion
