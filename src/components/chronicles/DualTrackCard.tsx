/**
 * DualTrackCard - 双轨时间线卡片
 * 展示时间线事件的简要信息，支持展开查看详情
 */

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  ChevronDown, ChevronUp, BookOpen,
  ArrowRight, Lightbulb, Star, Camera, Film, HelpCircle
} from 'lucide-react'
import { Badge } from '@/components/shared'
import { CATEGORY_LABELS } from '@/data/chronicles-constants'
import type { TimelineEvent } from '@/data/timeline-events'
import { ExperimentIllustration } from './ExperimentIllustration'
import { ResourceGallery } from './ResourceGallery'

export interface DualTrackCardProps {
  event: TimelineEvent
  eventIndex: number
  isExpanded: boolean
  onToggle: () => void
  onReadStory: () => void
  onLinkTo?: (year: number, track: 'optics' | 'polarization') => void
  side: 'left' | 'right'
}

export function DualTrackCard({ event, eventIndex, isExpanded, onToggle, onReadStory, onLinkTo, side: _side }: DualTrackCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const category = CATEGORY_LABELS[event.category]

  const isOpticsTrack = event.track === 'optics'
  const trackColor = isOpticsTrack
    ? { bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50', border: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200', hoverBorder: theme === 'dark' ? 'hover:border-amber-500/50' : 'hover:border-amber-400' }
    : { bg: theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50', border: theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-200', hoverBorder: theme === 'dark' ? 'hover:border-cyan-500/50' : 'hover:border-cyan-400' }

  return (
    <div
      data-event-index={eventIndex}
      className={cn(
        'rounded-xl border p-3 sm:p-4 transition-all cursor-pointer',
        trackColor.bg,
        trackColor.border,
        trackColor.hoverBorder,
        theme === 'dark' ? 'hover:shadow-lg hover:shadow-black/20' : 'hover:shadow-md'
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge color={category.color} className="text-xs">
              {isZh ? category.zh : category.en}
            </Badge>
            {event.experimentalResources && (
              <span className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium',
                theme === 'dark'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-purple-100 text-purple-600'
              )} title={isZh ? '含实验资源' : 'Has experiment resources'}>
                <Camera className="w-3 h-3" />
                <Film className="w-3 h-3" />
              </span>
            )}
            {event.importance === 1 && (
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            )}
          </div>

          {/* Title */}
          <h3 className={cn(
            'font-semibold text-sm sm:text-base mb-1 line-clamp-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? event.titleZh : event.titleEn}
          </h3>

          {/* Scientist */}
          {event.scientistEn && (
            <p className={cn(
              'text-xs sm:text-sm mb-1 flex items-center gap-1',
              isOpticsTrack
                ? theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                : theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              {event.scientistBio?.portraitEmoji && (
                <span className="text-sm">{event.scientistBio.portraitEmoji}</span>
              )}
              {isZh ? event.scientistZh : event.scientistEn}
            </p>
          )}

          {/* Description (collapsed) */}
          {!isExpanded && (
            <p className={cn(
              'text-xs line-clamp-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? event.descriptionZh : event.descriptionEn}
            </p>
          )}
        </div>

        {/* Expand icon */}
        <div className={cn(
          'flex-shrink-0 p-1 rounded-full transition-colors',
          theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
        )}>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={cn(
          'mt-3 pt-3 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          {/* Full description */}
          <p className={cn(
            'text-sm mb-3',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? event.descriptionZh : event.descriptionEn}
          </p>

          {/* Illustration */}
          {event.illustrationType && (
            <div className={cn(
              'mb-3 p-2 rounded-lg flex items-center justify-center',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'
            )}>
              <ExperimentIllustration type={event.illustrationType} className="w-full max-w-[180px] h-auto" />
            </div>
          )}

          {/* Details */}
          {event.details && (
            <div className="mb-3">
              <h4 className={cn(
                'text-xs font-semibold mb-1.5 flex items-center gap-1',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                <Lightbulb className="w-3.5 h-3.5" />
                {isZh ? '深入了解' : 'Learn More'}
              </h4>
              <ul className={cn(
                'text-xs space-y-1 list-disc list-inside',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {(isZh ? event.details.zh : event.details.en).slice(0, 3).map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Thinking Question */}
          {event.thinkingQuestion && (
            <div className={cn(
              'mb-3 p-2 rounded-lg border-l-3',
              theme === 'dark'
                ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                : 'bg-purple-50 border-purple-500 text-purple-700'
            )}>
              <h4 className="text-xs font-semibold mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {isZh ? '思考问题' : 'Think About It'}
              </h4>
              <p className="text-xs italic">
                {isZh ? event.thinkingQuestion.zh : event.thinkingQuestion.en}
              </p>
            </div>
          )}

          {/* Compact Resource Gallery - 紧凑资源画廊 */}
          {event.experimentalResources && (
            <ResourceGallery
              resources={event.experimentalResources}
              isZh={isZh}
              theme={theme}
              compact
            />
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {event.story && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onReadStory()
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isOpticsTrack
                    ? theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : theme === 'dark'
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {isZh ? '阅读故事' : 'Read Story'}
              </button>
            )}
            {event.linkTo && onLinkTo && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onLinkTo(event.linkTo!.year, event.linkTo!.trackTarget)
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  event.linkTo.trackTarget === 'optics'
                    ? theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : theme === 'dark'
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                )}
                title={isZh ? event.linkTo.descriptionZh : event.linkTo.descriptionEn}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                {isZh ? `跳转 ${event.linkTo.year}` : `Go to ${event.linkTo.year}`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

