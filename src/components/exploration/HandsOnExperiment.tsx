/**
 * HandsOnExperiment - 动手实验组件
 *
 * 展示用日常物品进行的简单实验
 * 强调"动手试试"的学习理念
 */

import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  FlaskConical,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Camera,
  Lightbulb,
  Package
} from 'lucide-react'
import { useExplorationStore } from '@/stores/explorationStore'
import type { ExplorationNode } from '@/data/explorationNodes'

interface HandsOnExperimentProps {
  nodeId: string
  experiment: NonNullable<ExplorationNode['experiment']>
  className?: string
}

export const HandsOnExperiment = memo(function HandsOnExperiment({
  nodeId,
  experiment,
  className
}: HandsOnExperimentProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [isExpanded, setIsExpanded] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const recordExperiment = useExplorationStore(state => state.recordExperiment)
  const triedExperiments = useExplorationStore(state => state.triedExperiments)
  const hasTried = triedExperiments.includes(nodeId)

  const steps = isZh ? experiment.steps.zh : experiment.steps.en
  const materials = isZh ? experiment.materials.zh : experiment.materials.en

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index))
    } else {
      setCompletedSteps([...completedSteps, index])
      // 当完成第一步时，记录尝试
      if (!hasTried) {
        recordExperiment(nodeId)
      }
    }
  }

  const allStepsCompleted = completedSteps.length === steps.length

  const difficultyColors = {
    easy: theme === 'dark' ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-100',
    medium: theme === 'dark' ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-100',
    advanced: theme === 'dark' ? 'text-purple-400 bg-purple-500/20' : 'text-purple-600 bg-purple-100',
  }

  const difficultyLabels = {
    easy: isZh ? '简单' : 'Easy',
    medium: isZh ? '中等' : 'Medium',
    advanced: isZh ? '进阶' : 'Advanced',
  }

  return (
    <div className={cn(
      'rounded-xl border-2 overflow-hidden',
      theme === 'dark'
        ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30'
        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left transition-colors',
          theme === 'dark' ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-100/50'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
          )}>
            <FlaskConical className={cn(
              'w-5 h-5',
              theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
            )} />
          </div>
          <div>
            <h3 className={cn(
              'font-semibold text-base',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '动手试试：' : 'Try it: '}{isZh ? experiment.title.zh : experiment.title.en}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                difficultyColors[experiment.difficulty]
              )}>
                {difficultyLabels[experiment.difficulty]}
              </span>
              {hasTried && (
                <span className={cn(
                  'text-xs flex items-center gap-1',
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                )}>
                  <CheckCircle2 className="w-3 h-3" />
                  {isZh ? '已尝试' : 'Tried'}
                </span>
              )}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
        ) : (
          <ChevronDown className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Materials */}
          <div className={cn(
            'p-3 rounded-lg',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/70'
          )}>
            <h4 className={cn(
              'text-sm font-medium flex items-center gap-2 mb-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              <Package className="w-4 h-4" />
              {isZh ? '材料准备' : 'Materials'}
            </h4>
            <ul className="space-y-1">
              {materials.map((material, index) => (
                <li
                  key={index}
                  className={cn(
                    'text-sm flex items-center gap-2',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {material}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <h4 className={cn(
              'text-sm font-medium flex items-center gap-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {isZh ? '实验步骤' : 'Steps'}
              <span className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                ({completedSteps.length}/{steps.length})
              </span>
            </h4>
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => toggleStep(index)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all',
                  completedSteps.includes(index)
                    ? theme === 'dark'
                      ? 'bg-emerald-500/20 border border-emerald-500/40'
                      : 'bg-emerald-100 border border-emerald-300'
                    : theme === 'dark'
                      ? 'bg-slate-800/30 border border-slate-700 hover:border-emerald-500/40'
                      : 'bg-white/50 border border-gray-200 hover:border-emerald-300'
                )}
              >
                <div className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  completedSteps.includes(index)
                    ? 'bg-emerald-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-gray-400'
                      : 'bg-gray-200 text-gray-500'
                )}>
                  {completedSteps.includes(index) ? '✓' : index + 1}
                </div>
                <span className={cn(
                  'text-sm',
                  completedSteps.includes(index)
                    ? theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'
                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {step}
                </span>
              </button>
            ))}
          </div>

          {/* Expected Result */}
          {allStepsCompleted && !showResult && (
            <button
              onClick={() => setShowResult(true)}
              className={cn(
                'w-full py-3 rounded-lg font-medium text-sm transition-all',
                'bg-emerald-500 text-white hover:bg-emerald-600'
              )}
            >
              <Lightbulb className="w-4 h-4 inline-block mr-2" />
              {isZh ? '看看发生了什么？' : 'What did you observe?'}
            </button>
          )}

          {showResult && (
            <div className={cn(
              'p-4 rounded-lg border-2',
              theme === 'dark'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-yellow-50 border-yellow-200'
            )}>
              <h4 className={cn(
                'text-sm font-semibold flex items-center gap-2 mb-2',
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
              )}>
                <Lightbulb className="w-4 h-4" />
                {isZh ? '你应该看到' : 'You should see'}
              </h4>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'
              )}>
                {isZh ? experiment.expectedResult.zh : experiment.expectedResult.en}
              </p>
            </div>
          )}

          {/* Upload your result (placeholder) */}
          {showResult && (
            <button className={cn(
              'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors',
              theme === 'dark'
                ? 'border border-slate-600 text-gray-400 hover:border-emerald-500 hover:text-emerald-400'
                : 'border border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600'
            )}>
              <Camera className="w-4 h-4" />
              {isZh ? '分享你的发现' : 'Share your discovery'}
            </button>
          )}

          {/* Safety note */}
          {experiment.safetyNote && (
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            )}>
              ⚠️ {isZh ? experiment.safetyNote.zh : experiment.safetyNote.en}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

export default HandsOnExperiment
