/**
 * QuestionCard - 问题卡片组件
 *
 * 作为探索入口，展示引发好奇心的问题
 * 点击后进入对应的探索节点
 */

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import type { QuestionEntry } from '@/data/explorationNodes'

interface QuestionCardProps {
  question: QuestionEntry
  size?: 'small' | 'medium' | 'large'
  showTeaser?: boolean
  className?: string
}

export const QuestionCard = memo(function QuestionCard({
  question,
  size = 'medium',
  showTeaser = true,
  className
}: QuestionCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-5'
  }

  const emojiSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  }

  const titleSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  return (
    <Link
      to={`/explore/${question.nodeId}`}
      className={cn(
        'group relative block rounded-xl border-2 transition-all duration-300',
        'hover:-translate-y-1 hover:scale-[1.02]',
        sizeClasses[size],
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
          : 'bg-white/80 border-gray-200 hover:border-gray-400',
        className
      )}
      style={{
        borderColor: question.popular ? `${question.color}40` : undefined,
      }}
    >
      {/* Popular badge */}
      {question.popular && (
        <div
          className={cn(
            'absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
            theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
          )}
        >
          <Sparkles className="w-3 h-3" />
          {isZh ? '热门' : 'Popular'}
        </div>
      )}

      {/* Emoji */}
      <div className={cn('mb-2', emojiSizes[size])}>
        {question.emoji}
      </div>

      {/* Question */}
      <h3 className={cn(
        'font-semibold mb-1 leading-tight',
        titleSizes[size],
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {isZh ? question.question.zh : question.question.en}
      </h3>

      {/* Teaser */}
      {showTeaser && (
        <p className={cn(
          'text-xs leading-relaxed line-clamp-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? question.teaser.zh : question.teaser.en}
        </p>
      )}

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 4px 20px ${question.color}30`,
        }}
      />

      {/* Stage indicator dot */}
      <div
        className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
        style={{ backgroundColor: question.color }}
        title={question.stageId}
      />
    </Link>
  )
})

// 问题卡片网格
interface QuestionGridProps {
  questions: QuestionEntry[]
  columns?: 2 | 3 | 4
  className?: string
}

export function QuestionGrid({ questions, columns = 3, className }: QuestionGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  )
}

export default QuestionCard
