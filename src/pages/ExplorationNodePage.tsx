/**
 * ExplorationNodePage - 探索节点详情页
 *
 * 展示单个探索节点的完整内容
 * 整合所有探索组件：实验、演示、游戏、深入内容等
 */

import { useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Clock,
  Tag,
  Play,
  Gamepad2,
  BookOpen,
  History,
  Sparkles,
  Bookmark,
  Share2,
  ChevronRight,
  Leaf,
  Eye
} from 'lucide-react'
import { EXPLORATION_NODES, LEARNING_STAGES } from '@/data/explorationNodes'
import { useExplorationStore } from '@/stores/explorationStore'
import { HandsOnExperiment } from '@/components/exploration/HandsOnExperiment'
import { DeepDiveAccordion } from '@/components/exploration/DeepDiveAccordion'
import { RelatedQuestions } from '@/components/exploration/RelatedQuestions'

export default function ExplorationNodePage() {
  const { nodeId } = useParams<{ nodeId: string }>()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Store actions and state
  const visitNode = useExplorationStore(state => state.visitNode)
  const toggleBookmark = useExplorationStore(state => state.toggleBookmark)
  const isNodeBookmarked = useExplorationStore(state => state.isNodeBookmarked)
  const goBack = useExplorationStore(state => state.goBack)
  const navigationHistory = useExplorationStore(state => state.navigationHistory)

  // Find the node
  const node = useMemo(() => {
    return EXPLORATION_NODES.find(n => n.id === nodeId)
  }, [nodeId])

  // Find the stage this node belongs to
  const stage = useMemo(() => {
    if (!node) return null
    return LEARNING_STAGES.find(s => s.unitIds.includes(node.unitId))
  }, [node])

  // Record visit when node loads
  useEffect(() => {
    if (nodeId) {
      visitNode(nodeId)
    }
  }, [nodeId, visitNode])

  // Handle back navigation
  const handleBack = () => {
    const prevNode = goBack()
    if (prevNode) {
      navigate(`/explore/${prevNode}`)
    } else {
      navigate('/explore')
    }
  }

  if (!node) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
      )}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isZh ? '探索节点未找到' : 'Exploration Node Not Found'}
          </h1>
          <Link
            to="/explore"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            {isZh ? '返回探索' : 'Back to Explore'}
          </Link>
        </div>
      </div>
    )
  }

  const bookmarked = isNodeBookmarked(node.id)

  // Get entry type icon and color
  const getEntryTypeInfo = () => {
    switch (node.entry.type) {
      case 'question':
        return { icon: '❓', label: isZh ? '问题' : 'Question', color: 'cyan' }
      case 'history':
        return { icon: '📜', label: isZh ? '历史' : 'History', color: 'amber' }
      case 'phenomenon':
        return { icon: '✨', label: isZh ? '现象' : 'Phenomenon', color: 'purple' }
      case 'challenge':
        return { icon: '🎯', label: isZh ? '挑战' : 'Challenge', color: 'rose' }
      default:
        return { icon: '🔍', label: isZh ? '探索' : 'Explore', color: 'cyan' }
    }
  }

  const entryInfo = getEntryTypeInfo()

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    )}>
      {/* Header with navigation */}
      <header className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-sm',
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-700'
          : 'bg-white/90 border-gray-200'
      )}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={cn(
              'flex items-center gap-2 text-sm transition-colors',
              theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            {navigationHistory.length > 0 ? (isZh ? '返回' : 'Back') : (isZh ? '探索首页' : 'Explore')}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(node.id)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                bookmarked
                  ? 'text-amber-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
              )}
              title={isZh ? (bookmarked ? '取消收藏' : '收藏') : (bookmarked ? 'Remove bookmark' : 'Bookmark')}
            >
              <Bookmark className={cn('w-5 h-5', bookmarked && 'fill-current')} />
            </button>
            <button
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-900'
              )}
              title={isZh ? '分享' : 'Share'}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stage indicator */}
        {stage && (
          <Link
            to={`/explore?stage=${stage.id}`}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 transition-colors',
              theme === 'dark'
                ? 'bg-slate-800 text-gray-400 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            )}
            style={{ borderLeft: `3px solid ${stage.color}` }}
          >
            <span>{stage.icon}</span>
            <span>{isZh ? stage.title.zh : stage.title.en}</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}

        {/* Entry section */}
        <section className="mb-8">
          {/* Entry type badge */}
          <div className={cn(
            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mb-3',
            entryInfo.color === 'cyan' && (theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'),
            entryInfo.color === 'amber' && (theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'),
            entryInfo.color === 'purple' && (theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'),
            entryInfo.color === 'rose' && (theme === 'dark' ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700')
          )}>
            <span>{entryInfo.icon}</span>
            <span>{entryInfo.label}</span>
          </div>

          {/* Title with emoji */}
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{node.entry.emoji || '🔍'}</span>
            <div>
              <h1 className={cn(
                'text-3xl font-bold mb-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? node.entry.title.zh : node.entry.title.en}
              </h1>
              <p className={cn(
                'text-lg',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {isZh ? node.entry.hook.zh : node.entry.hook.en}
              </p>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={cn(
              'flex items-center gap-1',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              <Clock className="w-4 h-4" />
              {node.estimatedTime} {isZh ? '分钟' : 'min'}
            </span>

            {node.entry.year && (
              <span className={cn(
                'flex items-center gap-1',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                <History className="w-4 h-4" />
                {node.entry.year}
              </span>
            )}

            <div className="flex flex-wrap gap-1">
              {node.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                    theme === 'dark'
                      ? 'bg-slate-800 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Hands-on experiment (priority 1) */}
        {node.experiment && (
          <section className="mb-8">
            <HandsOnExperiment
              nodeId={node.id}
              experiment={node.experiment}
            />
          </section>
        )}

        {/* Life connections */}
        {node.lifeConnections.length > 0 && (
          <section className="mb-8">
            <h2 className={cn(
              'flex items-center gap-2 text-lg font-semibold mb-4',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              <Leaf className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              )} />
              {isZh ? '生活中的偏振' : 'Polarization in Life'}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {node.lifeConnections.map((connection, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-xl border',
                    theme === 'dark'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-green-50 border-green-200'
                  )}
                >
                  <h3 className={cn(
                    'font-medium mb-2',
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  )}>
                    {isZh ? connection.title.zh : connection.title.en}
                  </h3>
                  <ul className="space-y-1">
                    {(isZh ? connection.examples.zh : connection.examples.en).map((example, i) => (
                      <li
                        key={i}
                        className={cn(
                          'text-sm flex items-start gap-2',
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        )}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive demos */}
        {node.demos.length > 0 && (
          <section className="mb-8">
            <h2 className={cn(
              'flex items-center gap-2 text-lg font-semibold mb-4',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              <Eye className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )} />
              {isZh ? '互动演示' : 'Interactive Demos'}
            </h2>

            <div className="flex flex-wrap gap-2">
              {node.demos.map(demoId => (
                <Link
                  key={demoId}
                  to={`/demos/${demoId}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-700'
                      : 'bg-white border-gray-200 text-cyan-600 hover:border-cyan-400 hover:bg-cyan-50'
                  )}
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">{demoId}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Game challenges */}
        {node.games.length > 0 && (
          <section className="mb-8">
            <h2 className={cn(
              'flex items-center gap-2 text-lg font-semibold mb-4',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              <Gamepad2 className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )} />
              {isZh ? '游戏挑战' : 'Game Challenges'}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {node.games.map((game, index) => (
                <Link
                  key={index}
                  to={`/games/${game.type}?level=${game.levelId}`}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border transition-all',
                    theme === 'dark'
                      ? 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50'
                      : 'bg-purple-50 border-purple-200 hover:border-purple-400'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                  )}>
                    <Gamepad2 className={cn(
                      'w-5 h-5',
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    )} />
                  </div>
                  <div>
                    <div className={cn(
                      'text-sm font-medium',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {game.type === '2d' ? '2D ' : '3D '}{isZh ? '游戏' : 'Game'} - {isZh ? '关卡' : 'Level'} {game.levelId}
                    </div>
                    <div className={cn(
                      'text-xs',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {isZh ? game.challenge.zh : game.challenge.en}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Deep dive content */}
        <section className="mb-8">
          <h2 className={cn(
            'flex items-center gap-2 text-lg font-semibold mb-4',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <BookOpen className={cn(
              'w-5 h-5',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )} />
            {isZh ? '深入理解' : 'Deep Understanding'}
          </h2>

          <DeepDiveAccordion
            nodeId={node.id}
            deepDive={node.deepDive}
          />
        </section>

        {/* History story */}
        {node.historyStory && (
          <section className="mb-8">
            <div className={cn(
              'p-5 rounded-xl border-2',
              theme === 'dark'
                ? 'bg-amber-500/10 border-amber-500/20'
                : 'bg-amber-50 border-amber-200'
            )}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-3 rounded-full flex-shrink-0',
                  theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
                )}>
                  <History className={cn(
                    'w-6 h-6',
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                  )} />
                </div>
                <div>
                  <div className={cn(
                    'text-sm font-medium mb-1',
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                  )}>
                    {node.historyStory.year} • {node.historyStory.track === 'optics' ? (isZh ? '光学史' : 'Optics History') : (isZh ? '偏振史' : 'Polarization History')}
                  </div>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-amber-200' : 'text-amber-800'
                  )}>
                    {isZh ? node.historyStory.teaser.zh : node.historyStory.teaser.en}
                  </p>
                  <Link
                    to={`/chronicles?year=${node.historyStory.year}`}
                    className={cn(
                      'inline-flex items-center gap-1 mt-3 text-sm font-medium transition-colors',
                      theme === 'dark'
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-amber-600 hover:text-amber-700'
                    )}
                  >
                    {isZh ? '了解完整故事' : 'Read the full story'}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related questions (network navigation) */}
        {node.relatedQuestions.length > 0 && (
          <section className="mb-8">
            <RelatedQuestions
              currentNodeId={node.id}
              relatedQuestions={node.relatedQuestions}
            />
          </section>
        )}

        {/* Bottom navigation */}
        <footer className={cn(
          'pt-8 border-t',
          theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
        )}>
          <div className="flex items-center justify-between">
            <Link
              to="/explore"
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Sparkles className="w-4 h-4" />
              {isZh ? '探索更多问题' : 'Explore more questions'}
            </Link>

            <div className="flex items-center gap-4">
              <span className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              )}>
                {isZh ? '觉得有趣？' : 'Found this interesting?'}
              </span>
              <button
                onClick={() => toggleBookmark(node.id)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  bookmarked
                    ? theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-amber-100 text-amber-700'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-400 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <Bookmark className={cn('w-4 h-4', bookmarked && 'fill-current')} />
                {bookmarked ? (isZh ? '已收藏' : 'Bookmarked') : (isZh ? '收藏' : 'Bookmark')}
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
