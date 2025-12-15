/**
 * OpticalPathsModule - 偏振光路实验
 *
 * 展示经典偏振光路实验，包括:
 * - 固定的光路配置
 * - 详细的原理解析
 * - 学习要点
 * - 相关演示链接
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  ExternalLink,
  GraduationCap,
  FlaskConical,
  Eye,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { CLASSIC_EXPERIMENTS } from '@/data/experiments-challenges'
import { useOpticalBenchStore, type ClassicExperiment } from '@/stores/opticalBenchStore'

// ============================================
// Difficulty Badge Component
// ============================================

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const config = {
    easy: {
      label: t('opticalDesign.difficulty.easy'),
      color: theme === 'dark' ? 'bg-green-400/20 text-green-400 border-green-400/30' : 'bg-green-100 text-green-700 border-green-200',
    },
    medium: {
      label: t('opticalDesign.difficulty.medium'),
      color: theme === 'dark' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    hard: {
      label: t('opticalDesign.difficulty.hard'),
      color: theme === 'dark' ? 'bg-red-400/20 text-red-400 border-red-400/30' : 'bg-red-100 text-red-700 border-red-200',
    },
  }

  const cfg = config[difficulty as keyof typeof config] || config.medium

  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full border', cfg.color)}>
      {cfg.label}
    </span>
  )
}

// ============================================
// Experiment Card Component
// ============================================

interface ExperimentCardProps {
  experiment: ClassicExperiment
  isSelected: boolean
  onClick: () => void
}

function ExperimentCard({ experiment, isSelected, onClick }: ExperimentCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left',
        'hover:scale-[1.01] hover:shadow-lg',
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-700 hover:border-amber-400/50'
          : 'bg-white border-gray-200 hover:border-amber-300',
        isSelected && (theme === 'dark'
          ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
          : 'border-amber-500 bg-amber-50 shadow-lg')
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <FlaskConical className={cn(
            'w-5 h-5',
            isSelected
              ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-600')
              : (theme === 'dark' ? 'text-gray-500' : 'text-gray-400')
          )} />
          <h3 className={cn(
            'font-semibold text-base',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? experiment.nameZh : experiment.nameEn}
          </h3>
        </div>
        <DifficultyBadge difficulty={experiment.difficulty} />
      </div>

      <p className={cn(
        'text-sm line-clamp-2 mb-3',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>

      <div className="flex items-center gap-2">
        <span className={cn(
          'text-xs',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          {experiment.components.length} {isZh ? '个组件' : 'components'}
        </span>
        {experiment.linkedDemo && (
          <span className={cn(
            'flex items-center gap-1 text-xs',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )}>
            <ExternalLink className="w-3 h-3" />
            {isZh ? '含演示' : 'With Demo'}
          </span>
        )}
      </div>
    </button>
  )
}

// ============================================
// Experiment Detail Panel
// ============================================

interface ExperimentDetailProps {
  experiment: ClassicExperiment
}

function ExperimentDetail({ experiment }: ExperimentDetailProps) {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const navigate = useNavigate()

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['principles', 'learning'])
  )

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // Load experiment into free design module
  const handleTryExperiment = () => {
    const { loadExperiment, setSimulating } = useOpticalBenchStore.getState()
    loadExperiment(experiment)
    setSimulating(true)
    navigate('/optical-studio?module=design')
  }

  // Go to related demo
  const handleGoToDemo = () => {
    if (experiment.linkedDemo) {
      navigate(`/demos?demo=${experiment.linkedDemo}`)
    }
  }

  return (
    <div className={cn(
      'h-full flex flex-col',
      theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
    )}>
      {/* Header */}
      <div className={cn(
        'p-6 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className={cn(
              'text-2xl font-bold mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? experiment.nameZh : experiment.nameEn}
            </h2>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? experiment.nameEn : experiment.nameZh}
            </p>
          </div>
          <DifficultyBadge difficulty={experiment.difficulty} />
        </div>

        <p className={cn(
          'text-base leading-relaxed mb-6',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {isZh ? experiment.descriptionZh : experiment.descriptionEn}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleTryExperiment}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
              'hover:scale-[1.02]',
              theme === 'dark'
                ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 border border-amber-400/50'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
            )}
          >
            <Play className="w-5 h-5" />
            {t('opticalDesign.tryExperiment')}
          </button>

          {experiment.linkedDemo && (
            <button
              onClick={handleGoToDemo}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
                'hover:scale-[1.02]',
                theme === 'dark'
                  ? 'bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30 border border-cyan-400/50'
                  : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border border-cyan-300'
              )}
            >
              <ExternalLink className="w-5 h-5" />
              {t('opticalDesign.viewDemo')}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Learning Points */}
        <section className={cn(
          'rounded-xl border overflow-hidden',
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
        )}>
          <button
            onClick={() => toggleSection('learning')}
            className={cn(
              'w-full flex items-center justify-between p-4 transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                theme === 'dark' ? 'bg-green-400/20' : 'bg-green-100'
              )}>
                <GraduationCap className={cn(
                  'w-5 h-5',
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                )} />
              </div>
              <span className={cn(
                'font-semibold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t('opticalDesign.learningPoints')}
              </span>
            </div>
            {expandedSections.has('learning') ? (
              <ChevronUp className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
            ) : (
              <ChevronDown className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
            )}
          </button>

          {expandedSections.has('learning') && (
            <div className={cn(
              'px-4 pb-4 border-t',
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            )}>
              <ul className="space-y-3 pt-4">
                {(isZh ? experiment.learningPoints.zh : experiment.learningPoints.en).map((point, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      'flex items-start gap-3 text-sm',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    <span className={cn(
                      'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold',
                      theme === 'dark'
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-green-100 text-green-700'
                    )}>
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Components Used */}
        <section className={cn(
          'rounded-xl border overflow-hidden',
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
        )}>
          <button
            onClick={() => toggleSection('components')}
            className={cn(
              'w-full flex items-center justify-between p-4 transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                theme === 'dark' ? 'bg-purple-400/20' : 'bg-purple-100'
              )}>
                <Zap className={cn(
                  'w-5 h-5',
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                )} />
              </div>
              <span className={cn(
                'font-semibold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t('opticalDesign.componentsUsed')}
              </span>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-600'
              )}>
                {experiment.components.length}
              </span>
            </div>
            {expandedSections.has('components') ? (
              <ChevronUp className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
            ) : (
              <ChevronDown className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
            )}
          </button>

          {expandedSections.has('components') && (
            <div className={cn(
              'px-4 pb-4 border-t',
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            )}>
              <div className="grid grid-cols-2 gap-2 pt-4">
                {experiment.components.map((comp) => (
                  <div
                    key={comp.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg',
                      theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                    )}
                  >
                    <span className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-md text-sm',
                      theme === 'dark' ? 'bg-slate-700' : 'bg-white'
                    )}>
                      {comp.type === 'emitter' && '💡'}
                      {comp.type === 'polarizer' && '📊'}
                      {comp.type === 'waveplate' && '🔲'}
                      {comp.type === 'splitter' && '◇'}
                      {comp.type === 'sensor' && '📟'}
                      {comp.type === 'mirror' && '🪞'}
                    </span>
                    <div className="min-w-0">
                      <div className={cn(
                        'text-xs font-medium truncate',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {comp.type}
                      </div>
                      <div className={cn(
                        'text-[10px] truncate',
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        {comp.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Optical Path Diagram Placeholder */}
        <section className={cn(
          'rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4',
          theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-300 bg-gray-50'
        )}>
          <Eye className={cn(
            'w-12 h-12 opacity-50',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
          <div className="text-center">
            <p className={cn(
              'font-medium mb-1',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('opticalDesign.opticalPathPreview')}
            </p>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              {t('opticalDesign.clickTryToSee')}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

// ============================================
// Main Module Component
// ============================================

export function OpticalPathsModule() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [selectedExperiment, setSelectedExperiment] = useState<ClassicExperiment | null>(
    CLASSIC_EXPERIMENTS[0] || null
  )
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)

  // Filter experiments
  const filteredExperiments = useMemo(() => {
    if (!difficultyFilter) return CLASSIC_EXPERIMENTS
    return CLASSIC_EXPERIMENTS.filter((exp) => exp.difficulty === difficultyFilter)
  }, [difficultyFilter])

  // Group by difficulty
  const groupedExperiments = useMemo(() => {
    const groups: Record<string, ClassicExperiment[]> = {
      easy: [],
      medium: [],
      hard: [],
    }
    filteredExperiments.forEach((exp) => {
      if (groups[exp.difficulty]) {
        groups[exp.difficulty].push(exp)
      }
    })
    return groups
  }, [filteredExperiments])

  return (
    <div className="h-full flex">
      {/* Experiment List */}
      <div className={cn(
        'w-[400px] flex-shrink-0 flex flex-col border-r overflow-hidden',
        theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
      )}>
        {/* Header */}
        <div className={cn(
          'p-4 border-b',
          theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
        )}>
          <h1 className={cn(
            'text-xl font-bold mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {t('opticalDesign.modules.paths.title')}
          </h1>
          <p className={cn(
            'text-sm mb-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {CLASSIC_EXPERIMENTS.length} {t('opticalDesign.experimentsCount')}
          </p>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setDifficultyFilter(null)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                !difficultyFilter
                  ? (theme === 'dark'
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                      : 'bg-cyan-100 text-cyan-700 border border-cyan-300')
                  : (theme === 'dark'
                      ? 'bg-slate-800 text-gray-400 border border-slate-700'
                      : 'bg-gray-100 text-gray-600 border border-gray-200')
              )}
            >
              {t('opticalDesign.all')}
            </button>
            {['easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  difficultyFilter === diff
                    ? (theme === 'dark'
                        ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                        : 'bg-cyan-100 text-cyan-700 border border-cyan-300')
                    : (theme === 'dark'
                        ? 'bg-slate-800 text-gray-400 border border-slate-700'
                        : 'bg-gray-100 text-gray-600 border border-gray-200')
                )}
              >
                {t(`opticalDesign.difficulty.${diff}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Experiment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedExperiments).map(([difficulty, experiments]) => {
            if (experiments.length === 0) return null
            return (
              <section key={difficulty}>
                <div className="flex items-center gap-2 mb-3">
                  <DifficultyBadge difficulty={difficulty} />
                  <span className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {experiments.length} {isZh ? '个实验' : 'experiments'}
                  </span>
                </div>
                <div className="space-y-3">
                  {experiments.map((exp) => (
                    <ExperimentCard
                      key={exp.id}
                      experiment={exp}
                      isSelected={selectedExperiment?.id === exp.id}
                      onClick={() => setSelectedExperiment(exp)}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-hidden">
        {selectedExperiment ? (
          <ExperimentDetail experiment={selectedExperiment} />
        ) : (
          <div className={cn(
            'h-full flex flex-col items-center justify-center p-8 text-center',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            <FlaskConical className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">{t('opticalDesign.selectExperiment')}</p>
            <p className="text-sm">{t('opticalDesign.selectExperimentHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OpticalPathsModule
