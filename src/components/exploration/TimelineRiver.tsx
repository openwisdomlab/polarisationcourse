/**
 * TimelineRiver - 时间线河流组件
 *
 * 以河流形式展示光学/偏振历史事件
 * 作为探索的另一个维度入口
 */

import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Calendar, ChevronRight } from 'lucide-react'
import { EXPLORATION_NODES } from '@/data/explorationNodes'
import { useExplorationStore } from '@/stores/explorationStore'

interface TimelineEvent {
  year: number
  nodeId: string
  title: { en: string; zh: string }
  teaser: { en: string; zh: string }
  track: 'optics' | 'polarization'
  emoji?: string
}

// Extract timeline events from exploration nodes
function extractTimelineEvents(): TimelineEvent[] {
  const events: TimelineEvent[] = []

  for (const node of EXPLORATION_NODES) {
    if (node.historyStory) {
      events.push({
        year: node.historyStory.year,
        nodeId: node.id,
        title: node.entry.title,
        teaser: node.historyStory.teaser,
        track: node.historyStory.track,
        emoji: node.entry.emoji
      })
    }
    // Also include entry year if it's a history type
    if (node.entry.type === 'history' && node.entry.year && !node.historyStory) {
      events.push({
        year: node.entry.year,
        nodeId: node.id,
        title: node.entry.title,
        teaser: node.entry.hook,
        track: 'polarization',
        emoji: node.entry.emoji
      })
    }
  }

  // Sort by year
  return events.sort((a, b) => a.year - b.year)
}

interface TimelineRiverProps {
  maxEvents?: number
  showAllLink?: boolean
  compact?: boolean
  className?: string
}

export const TimelineRiver = memo(function TimelineRiver({
  maxEvents = 6,
  showAllLink = true,
  compact = false,
  className
}: TimelineRiverProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const visitedNodes = useExplorationStore(state => state.visitedNodes)

  const events = useMemo(() => {
    const allEvents = extractTimelineEvents()
    return allEvents.slice(0, maxEvents)
  }, [maxEvents])

  if (events.length === 0) return null

  // Get color based on track
  const getTrackColor = (track: 'optics' | 'polarization') => {
    return track === 'optics'
      ? theme === 'dark' ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-100'
      : theme === 'dark' ? 'text-amber-400 bg-amber-500/20' : 'text-amber-600 bg-amber-100'
  }

  const getTrackBorderColor = (track: 'optics' | 'polarization') => {
    return track === 'optics'
      ? theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200'
      : theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200'
  }

  if (compact) {
    // Compact horizontal scroll view
    return (
      <div className={cn('relative', className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn(
            'flex items-center gap-2 text-sm font-semibold',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            <Calendar className="w-4 h-4" />
            {isZh ? '光的编年史' : 'Chronicles of Light'}
          </h3>
          {showAllLink && (
            <Link
              to="/chronicles"
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                theme === 'dark'
                  ? 'text-cyan-400 hover:text-cyan-300'
                  : 'text-cyan-600 hover:text-cyan-700'
              )}
            >
              {isZh ? '查看全部' : 'View all'}
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Horizontal timeline */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {events.map((event) => {
            const visited = visitedNodes.includes(event.nodeId)
            return (
              <Link
                key={`${event.year}-${event.nodeId}`}
                to={`/explore/${event.nodeId}`}
                className={cn(
                  'flex-shrink-0 w-36 p-3 rounded-lg border transition-all',
                  getTrackBorderColor(event.track),
                  visited && 'opacity-70',
                  theme === 'dark'
                    ? 'bg-slate-800/50 hover:bg-slate-800'
                    : 'bg-white hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{event.emoji || '📜'}</span>
                  <span className={cn(
                    'text-xs font-bold',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {event.year}
                  </span>
                </div>
                <p className={cn(
                  'text-xs line-clamp-2',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {isZh ? event.title.zh : event.title.en}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  // Full vertical timeline view
  return (
    <div className={cn('relative', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn(
          'flex items-center gap-2 text-lg font-semibold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <Calendar className={cn(
            'w-5 h-5',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )} />
          {isZh ? '光的编年史' : 'Chronicles of Light'}
        </h2>
        {showAllLink && (
          <Link
            to="/chronicles"
            className={cn(
              'flex items-center gap-1 text-sm transition-colors',
              theme === 'dark'
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-cyan-600 hover:text-cyan-700'
            )}
          >
            {isZh ? '查看完整时间线' : 'View full timeline'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className={cn(
          'absolute left-6 top-0 bottom-0 w-0.5',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
        )} />

        {/* Events */}
        <div className="space-y-4">
          {events.map((event) => {
            const visited = visitedNodes.includes(event.nodeId)
            return (
              <Link
                key={`${event.year}-${event.nodeId}`}
                to={`/explore/${event.nodeId}`}
                className="group block relative pl-14"
              >
                {/* Year dot */}
                <div className={cn(
                  'absolute left-4 top-4 w-4 h-4 rounded-full border-2 transition-colors z-10',
                  visited
                    ? theme === 'dark'
                      ? 'bg-green-500 border-green-400'
                      : 'bg-green-500 border-green-400'
                    : event.track === 'optics'
                      ? theme === 'dark'
                        ? 'bg-blue-500/50 border-blue-400 group-hover:bg-blue-500'
                        : 'bg-blue-100 border-blue-400 group-hover:bg-blue-200'
                      : theme === 'dark'
                        ? 'bg-amber-500/50 border-amber-400 group-hover:bg-amber-500'
                        : 'bg-amber-100 border-amber-400 group-hover:bg-amber-200'
                )}>
                  {visited && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                  )}
                </div>

                {/* Content card */}
                <div className={cn(
                  'p-4 rounded-xl border transition-all',
                  getTrackBorderColor(event.track),
                  visited && 'opacity-80',
                  theme === 'dark'
                    ? 'bg-slate-800/50 group-hover:bg-slate-800 group-hover:border-opacity-100'
                    : 'bg-white group-hover:shadow-md'
                )}>
                  <div className="flex items-start gap-3">
                    {/* Emoji */}
                    <span className="text-2xl flex-shrink-0">{event.emoji || '📜'}</span>

                    <div className="flex-1 min-w-0">
                      {/* Year and track */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'text-xs font-bold',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          {event.year}
                        </span>
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          getTrackColor(event.track)
                        )}>
                          {event.track === 'optics' ? (isZh ? '光学' : 'Optics') : (isZh ? '偏振' : 'Polarization')}
                        </span>
                        {visited && (
                          <span className={cn(
                            'text-xs px-1.5 py-0.5 rounded',
                            theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                          )}>
                            {isZh ? '已探索' : 'Visited'}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={cn(
                        'font-medium mb-1',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {isZh ? event.title.zh : event.title.en}
                      </h3>

                      {/* Teaser */}
                      <p className={cn(
                        'text-sm line-clamp-2',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {isZh ? event.teaser.zh : event.teaser.en}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className={cn(
                      'w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1',
                      theme === 'dark' ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'
                    )} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default TimelineRiver
