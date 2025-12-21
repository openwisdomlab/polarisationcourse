/**
 * CourseNavigator - 课程导航组件 (重构版 v2)
 *
 * 新设计原则：
 * 1. 以课程为整体导航结构，层级清晰：课程 → 单元 → 模块 → 历史事件
 * 2. 点击课程模块，优先显示关联的历史事件列表
 * 3. 从事件列表可进入具体的学习模块
 * 4. 鼠标悬停显示详细信息
 * 5. 支持双向交互：点击时间线事件可高亮相关课程模块
 */

import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useCourseProgress } from '@/hooks'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  History,
  X,
  Check,
  FlaskConical,
  Play,
  Lightbulb,
  Zap,
  Sparkles,
  Target,
  Telescope,
  Beaker,
  Clock,
  Star,
  Sun,
  ExternalLink,
  Info
} from 'lucide-react'

// Import course-event mapping data
import {
  UNIT_INFO,
  getEventCountByDemo,
  getDemosByUnit,
  getEventMappingsByDemo,
  type CourseEventMapping
} from '@/data/course-event-mapping'
import { TIMELINE_EVENTS } from '@/data/timeline-events'

// Unit icon mapping
const UNIT_ICONS = [Lightbulb, Zap, Sparkles, Beaker, Target, Telescope]

// Difficulty labels
const DIFFICULTY_LABELS = {
  foundation: { en: 'Foundation', zh: '基础层', color: 'emerald' },
  application: { en: 'Application', zh: '应用层', color: 'blue' },
  research: { en: 'Research', zh: '研究层', color: 'purple' }
}

interface CourseNavigatorProps {
  className?: string
  selectedDemos: string[]
  onFilterChange: (selectedDemos: string[]) => void
  highlightedDemos?: Set<string>  // Demos highlighted from timeline event click
  onEventClick?: (year: number, track: 'optics' | 'polarization') => void  // Callback to scroll to event
}

export function CourseNavigator({
  className,
  selectedDemos,
  onFilterChange,
  highlightedDemos,
  onEventClick
}: CourseNavigatorProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const isZh = i18n.language === 'zh'
  const { progress } = useCourseProgress()

  // State management
  const [isExpanded, setIsExpanded] = useState(false)          // Mobile expand/collapse
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set([0])) // Expanded units
  const [expandedDemo, setExpandedDemo] = useState<string | null>(null)  // Currently expanded demo showing events
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null)    // Currently hovered demo for tooltip

  // Selected demos count
  const hasFilter = selectedDemos.length > 0
  const filterCount = selectedDemos.length

  // Demos grouped by unit
  const demosByUnit = useMemo(() => {
    return UNIT_INFO.map(unit => ({
      ...unit,
      demos: getDemosByUnit(unit.id),
      Icon: UNIT_ICONS[unit.id] || FlaskConical
    }))
  }, [])

  // Get event details for a demo
  const getEventsForDemo = useCallback((demoId: string) => {
    const mappings = getEventMappingsByDemo(demoId)
    return mappings.map(mapping => {
      const event = TIMELINE_EVENTS.find(
        e => e.year === mapping.eventYear && e.track === mapping.eventTrack
      )
      return event ? { ...mapping, event } : null
    }).filter((e): e is CourseEventMapping & { event: typeof TIMELINE_EVENTS[0] } => e !== null)
  }, [])

  // Toggle unit expand/collapse
  const toggleUnit = useCallback((unitId: number) => {
    setExpandedUnits(prev => {
      const next = new Set(prev)
      if (next.has(unitId)) {
        next.delete(unitId)
      } else {
        next.add(unitId)
      }
      return next
    })
  }, [])

  // Toggle demo selection for filtering
  const toggleDemoFilter = useCallback((demoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelected = selectedDemos.includes(demoId)
      ? selectedDemos.filter(id => id !== demoId)
      : [...selectedDemos, demoId]
    onFilterChange(newSelected)
  }, [selectedDemos, onFilterChange])

  // Toggle demo expand to show events
  const toggleDemoExpand = useCallback((demoId: string) => {
    setExpandedDemo(prev => prev === demoId ? null : demoId)
  }, [])

  // Clear all filters
  const clearFilter = useCallback(() => {
    onFilterChange([])
  }, [onFilterChange])

  // Check if demo is completed
  const isDemoCompleted = useCallback((demoId: string) => {
    return progress.completedDemos.includes(demoId)
  }, [progress.completedDemos])

  // Check if demo is highlighted from event click
  const isDemoHighlighted = useCallback((demoId: string) => {
    return highlightedDemos?.has(demoId) ?? false
  }, [highlightedDemos])


  return (
    <div className={cn(
      'fixed left-4 top-1/2 -translate-y-1/2 z-30',
      'flex flex-col items-start gap-1',
      className
    )}>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'md:hidden p-2 rounded-full shadow-lg transition-all mb-2',
          theme === 'dark'
            ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        )}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Main container */}
      <div className={cn(
        'transition-all duration-300',
        'md:opacity-100 md:translate-x-0',
        isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full md:opacity-100 md:translate-x-0',
        'pointer-events-auto'
      )}>
        {/* Header: Title and controls */}
        <div className={cn(
          'flex items-center justify-between gap-2 mb-2 px-2 py-1.5 rounded-lg',
          theme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90',
          'shadow-sm backdrop-blur-sm'
        )}>
          <div className="flex items-center gap-1.5">
            <GraduationCap className={cn(
              'w-4 h-4',
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            )} />
            <span className={cn(
              'text-xs font-semibold',
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            )}>
              {isZh ? '课程导航' : 'Course Navigation'}
            </span>
          </div>

          {/* Clear filter button */}
          {hasFilter && (
            <button
              onClick={clearFilter}
              className={cn(
                'p-1.5 rounded-md transition-all flex items-center gap-1',
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/30'
                  : 'text-red-500 hover:bg-red-50'
              )}
              title={isZh ? '清除筛选' : 'Clear filter'}
            >
              <X className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">{filterCount}</span>
            </button>
          )}
        </div>

        {/* Highlighted from event indicator */}
        <AnimatePresence>
          {highlightedDemos && highlightedDemos.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'mb-2 px-2 py-1.5 rounded-md text-xs',
                theme === 'dark' ? 'bg-cyan-900/30 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
              )}
            >
              <div className="flex items-center gap-1.5">
                <History className="w-3 h-3" />
                <span>
                  {isZh
                    ? `事件关联 ${highlightedDemos.size} 个模块`
                    : `${highlightedDemos.size} module${highlightedDemos.size > 1 ? 's' : ''} related to event`
                  }
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter status indicator */}
        <AnimatePresence>
          {hasFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'mb-2 px-2 py-1.5 rounded-md text-xs',
                theme === 'dark' ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'
              )}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>
                  {isZh
                    ? `筛选 ${filterCount} 个模块的事件`
                    : `Filtering events for ${filterCount} module${filterCount > 1 ? 's' : ''}`
                  }
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Course unit list */}
        <div className={cn(
          'flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1',
          'scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent'
        )}>
          {demosByUnit.map((unit) => {
            const Icon = unit.Icon
            const isUnitExpanded = expandedUnits.has(unit.id)

            return (
              <div key={unit.id} className="relative">
                {/* Unit header row */}
                <div
                  className={cn(
                    'group flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer',
                    'shadow-sm hover:shadow-md',
                    theme === 'dark'
                      ? 'bg-slate-800/90 text-gray-300 hover:bg-slate-700'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-50'
                  )}
                  style={{
                    borderLeftWidth: '3px',
                    borderLeftColor: unit.color
                  }}
                  onClick={() => toggleUnit(unit.id)}
                >
                  {/* Unit icon */}
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${unit.color}20` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: unit.color }} />
                  </div>

                  {/* Unit title */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-[11px]">
                      {isZh ? unit.titleZh : unit.titleEn}
                    </div>
                    <div className={cn(
                      'text-[10px]',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {unit.demos.length} {isZh ? '模块' : 'modules'}
                    </div>
                  </div>

                  {/* Expand/collapse button */}
                  <button
                    className={cn(
                      'flex-shrink-0 p-0.5 rounded transition-colors',
                      theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                    )}
                  >
                    {isUnitExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Demo list */}
                <AnimatePresence>
                  {isUnitExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        'ml-3 mt-1 pl-2 border-l-2 space-y-0.5',
                      )}
                      style={{ borderColor: `${unit.color}40` }}
                      >
                        {unit.demos.map((demo) => {
                          const isSelected = selectedDemos.includes(demo.id)
                          const eventCount = getEventCountByDemo(demo.id)
                          const isCompleted = isDemoCompleted(demo.id)
                          const isHighlighted = isDemoHighlighted(demo.id)
                          const isDemoExpanded = expandedDemo === demo.id
                          const isHovered = hoveredDemo === demo.id
                          const events = isDemoExpanded ? getEventsForDemo(demo.id) : []
                          const difficultyInfo = DIFFICULTY_LABELS[demo.difficulty]

                          return (
                            <div key={demo.id} className="relative">
                              {/* Demo row */}
                              <div
                                className={cn(
                                  'group flex items-center gap-1.5 px-1.5 py-1.5 rounded text-[11px] transition-all cursor-pointer',
                                  isHighlighted
                                    ? theme === 'dark'
                                      ? 'bg-cyan-900/40 text-cyan-300 ring-1 ring-cyan-500/50'
                                      : 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-300'
                                    : isSelected
                                      ? theme === 'dark'
                                        ? 'bg-blue-900/30 text-blue-300'
                                        : 'bg-blue-50 text-blue-700'
                                      : theme === 'dark'
                                        ? 'hover:bg-slate-700/50 text-gray-400'
                                        : 'hover:bg-gray-100 text-gray-600'
                                )}
                                onClick={() => toggleDemoExpand(demo.id)}
                                onMouseEnter={() => setHoveredDemo(demo.id)}
                                onMouseLeave={() => setHoveredDemo(null)}
                              >
                                {/* Completed state */}
                                {isCompleted && (
                                  <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                )}

                                {/* Demo title */}
                                <span className={cn(
                                  'flex-1 truncate',
                                  isCompleted && 'line-through opacity-60'
                                )}>
                                  {isZh ? demo.titleZh : demo.titleEn}
                                </span>

                                {/* Event count badge */}
                                {eventCount > 0 && (
                                  <span className={cn(
                                    'flex-shrink-0 px-1 py-0.5 rounded text-[9px] font-medium flex items-center gap-0.5',
                                    isDemoExpanded
                                      ? theme === 'dark'
                                        ? 'bg-amber-500/30 text-amber-300'
                                        : 'bg-amber-100 text-amber-700'
                                      : theme === 'dark'
                                        ? 'bg-slate-700 text-gray-400'
                                        : 'bg-gray-100 text-gray-500'
                                  )}>
                                    <History className="w-2.5 h-2.5" />
                                    {eventCount}
                                  </span>
                                )}

                                {/* Filter toggle */}
                                <button
                                  onClick={(e) => toggleDemoFilter(demo.id, e)}
                                  className={cn(
                                    'flex-shrink-0 p-0.5 rounded transition-all',
                                    isSelected
                                      ? theme === 'dark'
                                        ? 'text-blue-400 bg-blue-500/20'
                                        : 'text-blue-600 bg-blue-100'
                                      : 'opacity-0 group-hover:opacity-100',
                                    theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                                  )}
                                  title={isZh ? '筛选此模块的事件' : 'Filter events for this module'}
                                >
                                  <Clock className="w-3 h-3" />
                                </button>

                                {/* Expand indicator */}
                                {eventCount > 0 && (
                                  <span className="flex-shrink-0">
                                    {isDemoExpanded ? (
                                      <ChevronUp className="w-3 h-3" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3" />
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Hover tooltip with detailed info */}
                              <AnimatePresence>
                                {isHovered && !isDemoExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className={cn(
                                      'absolute left-full ml-2 top-0 z-50 p-2 rounded-lg shadow-lg min-w-[180px] max-w-[220px]',
                                      theme === 'dark'
                                        ? 'bg-slate-800 border border-slate-700'
                                        : 'bg-white border border-gray-200'
                                    )}
                                  >
                                    <div className="flex items-start gap-2 mb-1.5">
                                      <Info className={cn(
                                        'w-3.5 h-3.5 flex-shrink-0 mt-0.5',
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                      )} />
                                      <div>
                                        <div className={cn(
                                          'font-medium text-xs',
                                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        )}>
                                          {isZh ? demo.titleZh : demo.titleEn}
                                        </div>
                                        <div className={cn(
                                          'text-[10px] mt-0.5',
                                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        )}>
                                          {isZh ? unit.titleZh : unit.titleEn}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Difficulty badge */}
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <span className={cn(
                                        'px-1.5 py-0.5 rounded text-[9px] font-medium',
                                        difficultyInfo.color === 'emerald'
                                          ? theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                                          : difficultyInfo.color === 'blue'
                                            ? theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
                                            : theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-700'
                                      )}>
                                        {isZh ? difficultyInfo.zh : difficultyInfo.en}
                                      </span>
                                      {eventCount > 0 && (
                                        <span className={cn(
                                          'px-1.5 py-0.5 rounded text-[9px] font-medium flex items-center gap-0.5',
                                          theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-700'
                                        )}>
                                          <History className="w-2.5 h-2.5" />
                                          {eventCount} {isZh ? '事件' : 'events'}
                                        </span>
                                      )}
                                    </div>

                                    {/* Quick action */}
                                    <div className={cn(
                                      'text-[10px] pt-1.5 border-t',
                                      theme === 'dark' ? 'border-slate-700 text-gray-500' : 'border-gray-100 text-gray-400'
                                    )}>
                                      {isZh ? '点击查看关联历史事件' : 'Click to view related events'}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Expanded event list */}
                              <AnimatePresence>
                                {isDemoExpanded && events.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className={cn(
                                      'ml-2 mt-1 p-2 rounded-lg space-y-1.5',
                                      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
                                    )}>
                                      {/* Event list header */}
                                      <div className={cn(
                                        'text-[10px] font-medium flex items-center gap-1 mb-1',
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                      )}>
                                        <History className="w-3 h-3" />
                                        {isZh ? '关联历史事件' : 'Related Historical Events'}
                                      </div>

                                      {/* Event items */}
                                      {events.map((eventData) => (
                                        <button
                                          key={`${eventData.eventYear}-${eventData.eventTrack}`}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            onEventClick?.(eventData.eventYear, eventData.eventTrack)
                                          }}
                                          className={cn(
                                            'w-full flex items-start gap-1.5 p-1.5 rounded-md text-left transition-all',
                                            theme === 'dark'
                                              ? 'hover:bg-slate-700/50'
                                              : 'hover:bg-white'
                                          )}
                                        >
                                          {/* Track indicator */}
                                          <div className={cn(
                                            'flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5',
                                            eventData.eventTrack === 'optics'
                                              ? theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
                                              : theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                                          )}>
                                            {eventData.eventTrack === 'optics'
                                              ? <Sun className="w-2.5 h-2.5 text-amber-500" />
                                              : <Sparkles className="w-2.5 h-2.5 text-cyan-500" />
                                            }
                                          </div>

                                          {/* Event info */}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                              <span className={cn(
                                                'font-mono text-[10px]',
                                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                              )}>
                                                {eventData.eventYear}
                                              </span>
                                              {eventData.relevance === 'primary' && (
                                                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                              )}
                                            </div>
                                            <div className={cn(
                                              'text-[10px] truncate',
                                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            )}>
                                              {isZh ? eventData.event.titleZh : eventData.event.titleEn}
                                            </div>
                                          </div>

                                          {/* Arrow */}
                                          <ExternalLink className={cn(
                                            'w-3 h-3 flex-shrink-0',
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                          )} />
                                        </button>
                                      ))}

                                      {/* Go to demo button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          navigate(demo.route)
                                        }}
                                        className={cn(
                                          'w-full flex items-center justify-center gap-1.5 mt-2 py-1.5 rounded-md text-[10px] font-medium transition-colors',
                                          theme === 'dark'
                                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                        )}
                                      >
                                        <Play className="w-3 h-3" />
                                        {isZh ? '进入学习模块' : 'Enter Learning Module'}
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Bottom: Start learning button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3"
        >
          <button
            onClick={() => navigate('/course')}
            className={cn(
              'w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
              'transition-all hover:scale-105',
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400'
            )}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isZh ? '进入课程' : 'Start Course'}</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
