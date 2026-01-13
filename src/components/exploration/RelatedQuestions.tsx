/**
 * RelatedQuestions - 相关问题导航组件
 *
 * 展示与当前节点相关的探索问题
 * 支持网状探索，多入口多出口
 */

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ArrowRight, Compass, Sparkles } from 'lucide-react'
import { EXPLORATION_NODES, type ExplorationNode } from '@/data/explorationNodes'
import { useExplorationStore } from '@/stores/explorationStore'

interface RelatedQuestionsProps {
  currentNodeId: string
  relatedQuestions: ExplorationNode['relatedQuestions']
  className?: string
}

export const RelatedQuestions = memo(function RelatedQuestions({
  currentNodeId: _currentNodeId, // Reserved for future tracking/analytics
  relatedQuestions,
  className
}: RelatedQuestionsProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const visitedNodes = useExplorationStore(state => state.visitedNodes)

  // 获取相关节点的完整信息
  const relatedNodes = relatedQuestions.map(q => {
    const node = EXPLORATION_NODES.find(n => n.id === q.nodeId)
    return {
      ...q,
      node,
      visited: visitedNodes.includes(q.nodeId)
    }
  }).filter(q => q.node)

  if (relatedNodes.length === 0) return null

  return (
    <div className={cn(
      'rounded-xl border-2 overflow-hidden',
      theme === 'dark'
        ? 'bg-slate-800/30 border-slate-700'
        : 'bg-gray-50 border-gray-200',
      className
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center gap-2 p-4 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <Compass className={cn(
          'w-5 h-5',
          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
        )} />
        <h3 className={cn(
          'font-semibold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '这让你想到...' : 'This makes you wonder...'}
        </h3>
      </div>

      {/* Related questions list */}
      <div className="p-2 space-y-1">
        {relatedNodes.map(({ nodeId, prompt, node, visited }) => (
          <Link
            key={nodeId}
            to={`/explore/${nodeId}`}
            className={cn(
              'group flex items-center justify-between p-3 rounded-lg transition-all',
              theme === 'dark'
                ? 'hover:bg-slate-700/50'
                : 'hover:bg-white',
              visited && (theme === 'dark' ? 'opacity-70' : 'opacity-80')
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Emoji from target node */}
              <span className="text-xl flex-shrink-0">
                {node?.entry.emoji || '🔍'}
              </span>

              <div className="min-w-0">
                {/* Prompt */}
                <p className={cn(
                  'text-sm font-medium truncate',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? prompt.zh : prompt.en}
                </p>

                {/* Target node title */}
                <p className={cn(
                  'text-xs truncate',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {node && (isZh ? node.entry.title.zh : node.entry.title.en)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Visited indicator */}
              {visited && (
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                )}>
                  {isZh ? '去过' : 'Visited'}
                </span>
              )}

              {/* Arrow */}
              <ArrowRight className={cn(
                'w-4 h-4 transition-transform group-hover:translate-x-1',
                theme === 'dark' ? 'text-gray-500 group-hover:text-cyan-400' : 'text-gray-400 group-hover:text-cyan-600'
              )} />
            </div>
          </Link>
        ))}
      </div>

      {/* Explore more footer */}
      <div className={cn(
        'p-3 border-t',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <Link
          to="/explore"
          className={cn(
            'flex items-center justify-center gap-2 text-sm transition-colors',
            theme === 'dark'
              ? 'text-cyan-400 hover:text-cyan-300'
              : 'text-cyan-600 hover:text-cyan-700'
          )}
        >
          <Sparkles className="w-4 h-4" />
          {isZh ? '探索更多问题' : 'Explore more questions'}
        </Link>
      </div>
    </div>
  )
})

export default RelatedQuestions
