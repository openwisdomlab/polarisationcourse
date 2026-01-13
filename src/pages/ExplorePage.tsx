/**
 * ExplorePage - 问题驱动的探索首页
 *
 * 设计理念：
 * - 以问题和好奇心为入口
 * - 三阶段学习路径作为导航骨架
 * - 时间线作为历史维度入口
 * - 无锁定，鼓励自由探索
 */

import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Eye,
  BookOpen,
  Microscope,
  Rocket,
  Settings2,
  Bookmark,
  Clock,
  Compass,
  Map,
  Zap
} from 'lucide-react'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { QuestionCard, QuestionGrid } from '@/components/exploration/QuestionCard'
import { TimelineRiver } from '@/components/exploration/TimelineRiver'
import {
  QUESTION_ENTRIES,
  LEARNING_STAGES,
  type LearningStage
} from '@/data/explorationNodes'
import { useExplorationStore } from '@/stores/explorationStore'

// Difficulty lens selector
function DifficultyLensSelector() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const difficultyLens = useExplorationStore(state => state.difficultyLens)
  const setDifficultyLens = useExplorationStore(state => state.setDifficultyLens)

  const lensOptions = [
    {
      key: 'foundation' as const,
      icon: <Eye className="w-4 h-4" />,
      label: isZh ? '简单' : 'Simple',
      description: isZh ? '日常语言，无公式' : 'Everyday language, no formulas',
      color: 'green'
    },
    {
      key: 'application' as const,
      icon: <Microscope className="w-4 h-4" />,
      label: isZh ? '公式' : 'Formulas',
      description: isZh ? '定量理解' : 'Quantitative',
      color: 'cyan'
    },
    {
      key: 'research' as const,
      icon: <Rocket className="w-4 h-4" />,
      label: isZh ? '理论' : 'Theory',
      description: isZh ? '严格推导' : 'Rigorous',
      color: 'purple'
    }
  ]

  return (
    <div className={cn(
      'flex items-center gap-1 p-1 rounded-full',
      theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
    )}>
      {lensOptions.map(option => (
        <button
          key={option.key}
          onClick={() => setDifficultyLens(option.key)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
            difficultyLens === option.key
              ? option.color === 'green'
                ? 'bg-green-500 text-white'
                : option.color === 'cyan'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-purple-500 text-white'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          )}
          title={option.description}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  )
}

// Stage card component
function StageCard({ stage, isActive, onClick }: {
  stage: LearningStage
  isActive: boolean
  onClick: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const visitedNodes = useExplorationStore(state => state.visitedNodes)

  // Count visited nodes in this stage
  const stageQuestions = QUESTION_ENTRIES.filter(q => q.stageId === stage.id)
  const visitedCount = stageQuestions.filter(q =>
    visitedNodes.includes(q.nodeId)
  ).length

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-xl border-2 text-left transition-all',
        isActive
          ? 'scale-[1.02] shadow-lg'
          : 'hover:scale-[1.01]',
        theme === 'dark'
          ? 'bg-slate-800/50'
          : 'bg-white/80'
      )}
      style={{
        borderColor: isActive ? stage.color : 'transparent',
        boxShadow: isActive ? `0 4px 20px ${stage.color}30` : undefined
      }}
    >
      {/* Stage number badge */}
      <div
        className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
        style={{ backgroundColor: stage.color }}
      >
        {stage.number}
      </div>

      {/* Stage icon */}
      <div className="text-3xl mb-2">{stage.icon}</div>

      {/* Title */}
      <h3 className={cn(
        'font-bold mb-1',
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {isZh ? stage.title.zh : stage.title.en}
      </h3>

      {/* Subtitle */}
      <p className={cn(
        'text-xs mb-2',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      )}>
        {isZh ? stage.subtitle.zh : stage.subtitle.en}
      </p>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <div className={cn(
          'flex-1 h-1 rounded-full overflow-hidden',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
        )}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${stageQuestions.length > 0 ? (visitedCount / stageQuestions.length) * 100 : 0}%`,
              backgroundColor: stage.color
            }}
          />
        </div>
        <span className={cn(
          'text-xs',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          {visitedCount}/{stageQuestions.length}
        </span>
      </div>
    </button>
  )
}

// Stats bar
function StatsBar() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const getStats = useExplorationStore(state => state.getStats)
  const bookmarks = useExplorationStore(state => state.bookmarks)

  const stats = getStats()

  return (
    <div className={cn(
      'flex items-center gap-4 px-4 py-2 rounded-full text-xs',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100/80'
    )}>
      <span className={cn(
        'flex items-center gap-1',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        <Compass className="w-3.5 h-3.5" />
        {stats.visitedNodes} {isZh ? '已探索' : 'explored'}
      </span>
      <span className={cn(
        'flex items-center gap-1',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        <Bookmark className="w-3.5 h-3.5" />
        {bookmarks.length} {isZh ? '收藏' : 'saved'}
      </span>
      <span className={cn(
        'flex items-center gap-1',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        <Clock className="w-3.5 h-3.5" />
        {stats.timeSpent} {isZh ? '分钟' : 'min'}
      </span>
    </div>
  )
}

export default function ExplorePage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [searchParams, setSearchParams] = useSearchParams()

  // Get active stage from URL or default to null (show all)
  const activeStageId = searchParams.get('stage')

  // Get questions filtered by stage
  const filteredQuestions = useMemo(() => {
    if (!activeStageId) {
      return QUESTION_ENTRIES
    }
    return QUESTION_ENTRIES.filter(q => q.stageId === activeStageId)
  }, [activeStageId])

  // Get popular questions
  const popularQuestions = useMemo(() => {
    return QUESTION_ENTRIES.filter(q => q.popular)
  }, [])

  const handleStageClick = (stageId: string) => {
    if (activeStageId === stageId) {
      // Toggle off
      setSearchParams({})
    } else {
      setSearchParams({ stage: stageId })
    }
  }

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-50 backdrop-blur-sm border-b',
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className={cn(
              'w-6 h-6',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )} />
            <span className={cn(
              'font-bold text-lg',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '偏振光的新世界' : 'World of Polarized Light'}
            </span>
          </Link>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <DifficultyLensSelector />
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="text-center mb-12">
          <h1 className={cn(
            'text-4xl md:text-5xl font-bold mb-4',
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600'
          )}>
            {isZh ? '偏振光的新世界' : 'A New World of Polarized Light'}
          </h1>
          <p className={cn(
            'text-lg max-w-2xl mx-auto mb-6',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '从好奇的问题开始，探索光的隐藏维度'
              : 'Start with curious questions, explore the hidden dimension of light'}
          </p>

          {/* Stats bar */}
          <div className="flex justify-center">
            <StatsBar />
          </div>
        </section>

        {/* Learning stages */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              'flex items-center gap-2 text-xl font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              <Map className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )} />
              {isZh ? '探索阶段' : 'Exploration Stages'}
            </h2>
            {activeStageId && (
              <button
                onClick={() => setSearchParams({})}
                className={cn(
                  'text-sm px-3 py-1 rounded-full transition-colors',
                  theme === 'dark'
                    ? 'bg-slate-800 text-gray-400 hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                {isZh ? '显示全部' : 'Show all'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEARNING_STAGES.map(stage => (
              <StageCard
                key={stage.id}
                stage={stage}
                isActive={activeStageId === stage.id}
                onClick={() => handleStageClick(stage.id)}
              />
            ))}
          </div>
        </section>

        {/* Popular questions */}
        {!activeStageId && popularQuestions.length > 0 && (
          <section className="mb-12">
            <h2 className={cn(
              'flex items-center gap-2 text-xl font-bold mb-6',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              <Zap className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              )} />
              {isZh ? '热门问题' : 'Popular Questions'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularQuestions.map(question => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  size="large"
                />
              ))}
            </div>
          </section>
        )}

        {/* All questions (or filtered by stage) */}
        <section className="mb-12">
          <h2 className={cn(
            'flex items-center gap-2 text-xl font-bold mb-6',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <Sparkles className={cn(
              'w-5 h-5',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )} />
            {activeStageId
              ? (isZh ? '阶段问题' : 'Stage Questions')
              : (isZh ? '所有问题' : 'All Questions')}
            <span className={cn(
              'text-sm font-normal ml-2',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              ({filteredQuestions.length})
            </span>
          </h2>

          <QuestionGrid
            questions={filteredQuestions}
            columns={3}
          />
        </section>

        {/* Timeline section */}
        <section className="mb-12">
          <TimelineRiver
            maxEvents={6}
            showAllLink={true}
          />
        </section>

        {/* Quick links footer */}
        <section className={cn(
          'p-6 rounded-2xl',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100/80'
        )}>
          <h3 className={cn(
            'font-semibold mb-4',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '更多探索' : 'More to Explore'}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/demos"
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">{isZh ? '演示馆' : 'Demo Gallery'}</span>
            </Link>

            <Link
              to="/optical-studio"
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Settings2 className="w-4 h-4" />
              <span className="text-sm">{isZh ? '设计室' : 'Design Studio'}</span>
            </Link>

            <Link
              to="/games/2d"
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">{isZh ? '游戏' : 'Games'}</span>
            </Link>

            <Link
              to="/chronicles"
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{isZh ? '编年史' : 'Chronicles'}</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={cn(
        'border-t py-6 text-center text-sm',
        theme === 'dark'
          ? 'border-slate-800 text-gray-600'
          : 'border-gray-200 text-gray-500'
      )}>
        <p>PolarCraft supported by Open Wisdom Lab</p>
      </footer>
    </div>
  )
}
