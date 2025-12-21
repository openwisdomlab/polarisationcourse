/**
 * Chronicles Page - History of Light and Polarization
 * 光的编年史 - 双线叙事：广义光学 + 偏振光
 *
 * Interactive dual-timeline showcasing key discoveries:
 * - Left track: General optics history (核心光学发现)
 * - Right track: Polarization-specific history (偏振光专属旅程)
 */

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { Tabs, Badge, PersistentHeader } from '@/components/shared'
import {
  Clock, User, MapPin, Calendar,
  FlaskConical, BookOpen,
  Sun, Sparkles, Camera, Film,
  Filter
} from 'lucide-react'

// Data imports
import { TIMELINE_EVENTS, type TimelineEvent } from '@/data/timeline-events'
import { CATEGORY_LABELS } from '@/data/chronicles-constants'
import { PSRT_CURRICULUM, getSectionsForEvent } from '@/data/psrt-curriculum'

// Component imports
import {
  OpticalOverviewDiagram,
  DualTrackCard,
  StoryModal,
  CenturyNavigator,
  CourseNavigator,
  ChroniclesPSRTView
} from '@/components/chronicles'

const TABS = [
  { id: 'timeline', label: 'Timeline', labelZh: '时间线', icon: <Clock className="w-4 h-4" /> },
  { id: 'psrt', label: 'P-SRT Course', labelZh: 'P-SRT课程', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'scientists', label: 'Scientists', labelZh: '科学家', icon: <User className="w-4 h-4" /> },
  { id: 'experiments', label: 'Key Experiments', labelZh: '关键实验', icon: <FlaskConical className="w-4 h-4" /> },
]

export function ChroniclesPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const { isMobile, isTablet } = useIsMobile()
  const isZh = i18n.language === 'zh'
  const [activeTab, setActiveTab] = useState('timeline')
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('')
  const [trackFilter, setTrackFilter] = useState<'all' | 'optics' | 'polarization'>('all')
  const [storyModalEvent, setStoryModalEvent] = useState<number | null>(null)
  const [selectedSections, setSelectedSections] = useState<string[]>([]) // P-SRT章节筛选状态
  const [highlightedSections, setHighlightedSections] = useState<Set<string>>(new Set()) // 事件点击高亮的课程章节

  // Use single-track layout on mobile/tablet
  const useSingleTrack = isMobile || isTablet

  // 计算被P-SRT章节筛选匹配的事件集合
  const matchedEventKeys = useMemo(() => {
    if (selectedSections.length === 0) return null

    // Get all events related to selected sections
    const eventKeys = new Set<string>()
    selectedSections.forEach(sectionId => {
      const section = PSRT_CURRICULUM
        .flatMap(unit => unit.sections)
        .find(s => s.id === sectionId)

      if (section) {
        section.relatedEvents.forEach(ref => {
          eventKeys.add(`${ref.year}-${ref.track}`)
        })
      }
    })

    return eventKeys
  }, [selectedSections])

  // Filter events by category, track, and selected course modules
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(e => {
      const categoryMatch = !filter || e.category === filter
      const trackMatch = trackFilter === 'all' || e.track === trackFilter

      // 课程筛选：如果有选中的课程模块，只显示匹配的事件
      const courseMatch = matchedEventKeys === null ||
        matchedEventKeys.has(`${e.year}-${e.track}`)

      return categoryMatch && trackMatch && courseMatch
    }).sort((a, b) => a.year - b.year)
  }, [filter, trackFilter, matchedEventKeys])

  // 处理P-SRT章节筛选变化
  const handleFilterChange = useCallback((sections: string[]) => {
    setSelectedSections(sections)
  }, [])

  // 处理从CourseNavigator点击事件跳转到时间线
  const handleEventClickFromNav = useCallback((year: number, track: 'optics' | 'polarization') => {
    // Reset filters to show all events
    setTrackFilter('all')
    setFilter('')
    setSelectedSections([])

    // Find the target event in the filtered events
    const allEventsSorted = [...TIMELINE_EVENTS].sort((a, b) => a.year - b.year)
    const targetIndex = allEventsSorted.findIndex(
      e => e.year === year && e.track === track
    )

    if (targetIndex !== -1) {
      // Expand the target event
      setExpandedEvent(targetIndex)

      // Scroll to the target event after a short delay to allow re-render
      setTimeout(() => {
        const targetElement = document.querySelector(`[data-event-index="${targetIndex}"]`)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [])

  // 处理点击时间线事件，高亮相关P-SRT章节
  const handleEventClickForHighlight = useCallback((year: number, track: 'optics' | 'polarization') => {
    // Get related sections for this event using getSectionsForEvent
    const mappings = getSectionsForEvent(year, track)
    const relatedSections = new Set(mappings.map(m => m.sectionId))
    setHighlightedSections(relatedSections)

    // Clear after 5 seconds
    setTimeout(() => {
      setHighlightedSections(new Set())
    }, 5000)
  }, [])

  // Get unique scientists from events
  const scientists = TIMELINE_EVENTS.filter(e => e.scientistBio?.bioEn).reduce((acc, event) => {
    const key = event.scientistEn || ''
    if (key && !acc.find(s => s.scientistEn === key)) {
      acc.push(event)
    }
    return acc
  }, [] as TimelineEvent[])

  // Story modal navigation
  const handleOpenStory = (index: number) => {
    setStoryModalEvent(index)
  }

  const handleCloseStory = () => {
    setStoryModalEvent(null)
  }

  const handleNextStory = () => {
    if (storyModalEvent !== null && storyModalEvent < filteredEvents.length - 1) {
      setStoryModalEvent(storyModalEvent + 1)
    }
  }

  const handlePrevStory = () => {
    if (storyModalEvent !== null && storyModalEvent > 0) {
      setStoryModalEvent(storyModalEvent - 1)
    }
  }

  // Navigate to linked event
  const handleLinkTo = useCallback((year: number, track: 'optics' | 'polarization') => {
    // Reset filter to show all events
    setTrackFilter('all')
    setFilter('')

    // Find the target event in the full TIMELINE_EVENTS (sorted by year)
    const allEventsSorted = [...TIMELINE_EVENTS].sort((a, b) => a.year - b.year)
    const targetIndex = allEventsSorted.findIndex(
      e => e.year === year && e.track === track
    )

    if (targetIndex !== -1) {
      // Expand the target event
      setExpandedEvent(targetIndex)

      // Scroll to the target event after a short delay to allow re-render
      setTimeout(() => {
        const targetElement = document.querySelector(`[data-event-index="${targetIndex}"]`)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header with Persistent Logo */}
      <PersistentHeader
        moduleKey="chronicles"
        moduleName={isZh ? '光的编年史' : 'Chronicles of Light'}
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark'
            ? 'bg-slate-900/80 border-b border-slate-700'
            : 'bg-white/80 border-b border-gray-200'
        )}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '双线叙事：光学与偏振' : 'Dual Narrative: Optics & Polarization'}
          </h2>
          <p className={cn(
            'text-base max-w-3xl mx-auto mb-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '从17世纪的偶然发现到现代应用，探索三个多世纪的光学奥秘。左侧追溯广义光学史上的核心发现，右侧聚焦偏振光的专属旅程。'
              : 'From 17th-century discoveries to modern applications — explore over three centuries of optical mysteries. Left track traces core optics history, right track follows the polarization journey.'}
          </p>
          {/* Dual track legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
              <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>
                {isZh ? '广义光学' : 'General Optics'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
              <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>
                {isZh ? '偏振光' : 'Polarization'}
              </span>
            </div>
          </div>
        </div>

        {/* Optical Overview Diagram - 光学全景图 (Static Panorama) */}
        <OpticalOverviewDiagram />

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'psrt' && (
          <ChroniclesPSRTView
            theme={theme}
            onNavigateToEvent={(year, track) => {
              // Switch to timeline tab and navigate to the event
              setActiveTab('timeline')
              handleEventClickFromNav(year, track)
            }}
          />
        )}

        {activeTab === 'timeline' && (
          <>
            {/* Track filters */}
            <div className={cn(
              'flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '轨道：' : 'Track:'}
              </span>
              <button
                onClick={() => setTrackFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'all'
                    ? 'bg-gray-600 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              <button
                onClick={() => setTrackFilter('optics')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'optics'
                    ? 'bg-amber-500 text-white'
                    : theme === 'dark'
                      ? 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/20'
                      : 'text-amber-600 hover:text-amber-700 hover:bg-amber-100'
                )}
              >
                <Sun className="w-3.5 h-3.5" />
                {isZh ? '广义光学' : 'Optics'}
              </button>
              <button
                onClick={() => setTrackFilter('polarization')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'polarization'
                    ? 'bg-cyan-500 text-white'
                    : theme === 'dark'
                      ? 'text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/20'
                      : 'text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100'
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isZh ? '偏振光' : 'Polarization'}
              </button>
            </div>

            {/* Course filter status banner */}
            {selectedSections.length > 0 && (
              <div className={cn(
                'flex items-center justify-between mb-4 p-3 rounded-lg',
                theme === 'dark' ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
              )}>
                <div className="flex items-center gap-2">
                  <Filter className={cn('w-4 h-4', theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
                  <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-blue-300' : 'text-blue-700')}>
                    {isZh
                      ? `正在显示 ${selectedSections.length} 个P-SRT章节相关的 ${filteredEvents.length} 个历史事件`
                      : `Showing ${filteredEvents.length} events related to ${selectedSections.length} P-SRT section${selectedSections.length > 1 ? 's' : ''}`
                    }
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSections([])}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                    theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  )}
                >
                  {isZh ? '清除筛选' : 'Clear Filter'}
                </button>
              </div>
            )}

            {/* Category filters */}
            <div className={cn(
              'flex flex-wrap items-center gap-2 mb-6 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '类型：' : 'Type:'}
              </span>
              <button
                onClick={() => setFilter('')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  !filter
                    ? 'bg-gray-600 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    filter === key
                      ? 'bg-gray-600 text-white'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  )}
                >
                  {isZh ? val.zh : val.en}
                </button>
              ))}
            </div>

            {/* Course Navigator - P-SRT课程大纲导航 (Desktop only, left side) */}
            {!useSingleTrack && (
              <CourseNavigator
                selectedSections={selectedSections}
                onFilterChange={handleFilterChange}
                highlightedSections={highlightedSections}
                onEventClick={handleEventClickFromNav}
              />
            )}

            {/* Century Navigator - 世纪导航 (Desktop only, right side) */}
            {!useSingleTrack && (
              <CenturyNavigator events={filteredEvents} isZh={isZh} />
            )}

            {/* Mobile Single-Track Timeline - 移动端单轨时间线 */}
            {useSingleTrack ? (
              <div className="relative">
                {/* Mobile Track Tabs */}
                <div className={cn(
                  'sticky top-16 z-20 flex items-center justify-center gap-2 mb-4 py-2',
                  theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95',
                  'backdrop-blur-sm'
                )}>
                  <button
                    onClick={() => setTrackFilter('all')}
                    className={cn(
                      'flex-1 max-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all',
                      trackFilter === 'all'
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-amber-500/30 to-cyan-500/30 text-white'
                          : 'bg-gradient-to-r from-amber-100 to-cyan-100 text-gray-900'
                        : theme === 'dark'
                          ? 'bg-slate-800 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {isZh ? '全部' : 'All'}
                  </button>
                  <button
                    onClick={() => setTrackFilter('optics')}
                    className={cn(
                      'flex-1 max-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5',
                      trackFilter === 'optics'
                        ? 'bg-amber-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-800 text-amber-400'
                          : 'bg-amber-50 text-amber-700'
                    )}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    {isZh ? '光学' : 'Optics'}
                  </button>
                  <button
                    onClick={() => setTrackFilter('polarization')}
                    className={cn(
                      'flex-1 max-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5',
                      trackFilter === 'polarization'
                        ? 'bg-cyan-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-800 text-cyan-400'
                          : 'bg-cyan-50 text-cyan-700'
                    )}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isZh ? '偏振' : 'Polar'}
                  </button>
                </div>

                {/* Single-track vertical timeline */}
                <div className="relative pl-8">
                  {/* Left vertical line */}
                  <div className={cn(
                    'absolute left-3 top-0 bottom-0 w-0.5',
                    theme === 'dark'
                      ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50'
                      : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
                  )} />

                  {/* Events */}
                  {filteredEvents.map((event, idx) => (
                    <div
                      key={`${event.year}-${event.titleEn}`}
                      id={`timeline-year-${event.year}`}
                      className="relative mb-4 last:mb-0 scroll-mt-32"
                    >
                      {/* Year marker */}
                      <div className={cn(
                        'absolute -left-5 w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2',
                        event.track === 'optics'
                          ? theme === 'dark'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-amber-100 border-amber-500 text-amber-700'
                          : theme === 'dark'
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                            : 'bg-cyan-100 border-cyan-500 text-cyan-700'
                      )}>
                        {String(event.year).slice(-2)}
                      </div>

                      {/* Track indicator badge */}
                      <div className="mb-1">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          event.track === 'optics'
                            ? theme === 'dark'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-amber-100 text-amber-700'
                            : theme === 'dark'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-cyan-100 text-cyan-700'
                        )}>
                          {event.track === 'optics' ? (
                            <><Sun className="w-3 h-3" /> {event.year}</>
                          ) : (
                            <><Sparkles className="w-3 h-3" /> {event.year}</>
                          )}
                        </span>
                      </div>

                      {/* Event card */}
                      <DualTrackCard
                        event={event}
                        eventIndex={idx}
                        isExpanded={expandedEvent === idx}
                        onToggle={() => setExpandedEvent(expandedEvent === idx ? null : idx)}
                        onReadStory={() => handleOpenStory(idx)}
                        onLinkTo={handleLinkTo}
                        onHighlightCourses={handleEventClickForHighlight}
                        side={event.track === 'optics' ? 'left' : 'right'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Desktop Dual Track Timeline - 桌面端双轨时间线 */
              <div className="relative">
                {/* Track Labels - 轨道标签 */}
                <div className="flex items-center justify-between mb-6">
                  <div className={cn(
                    'flex-1 text-center py-2 rounded-l-lg border-r',
                    theme === 'dark'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-amber-50 border-amber-200'
                  )}>
                    <div className="flex items-center justify-center gap-2">
                      <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                      <span className={cn('font-semibold', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                        {isZh ? '广义光学' : 'General Optics'}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    'w-20 text-center py-2',
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                  )}>
                    <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {isZh ? '年份' : 'Year'}
                    </span>
                  </div>
                  <div className={cn(
                    'flex-1 text-center py-2 rounded-r-lg border-l',
                    theme === 'dark'
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-cyan-50 border-cyan-200'
                  )}>
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                      <span className={cn('font-semibold', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                        {isZh ? '偏振光' : 'Polarization'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline with center axis */}
                <div className="relative">
                  {/* Center vertical line */}
                  <div className={cn(
                    'absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2',
                    theme === 'dark' ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50' : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
                  )} />

                  {/* Events */}
                  {(() => {
                    // Get all unique years from filtered events
                    const years = [...new Set(filteredEvents.map(e => e.year))].sort((a, b) => a - b)

                    return years.map((year) => {
                      // Get ALL events for this year per track (not just the first one)
                      const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                      const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                      const hasOptics = opticsEvents.length > 0
                      const hasPolarization = polarizationEvents.length > 0

                      return (
                        <div key={year} id={`timeline-year-${year}`} className="relative flex items-stretch mb-6 last:mb-0 scroll-mt-24">
                          {/* Left side - Optics (can have multiple events) */}
                          <div className="flex-1 pr-4 flex justify-end">
                            {hasOptics && (
                              <div className="w-full max-w-md space-y-3">
                                {opticsEvents.map((opticsEvent) => {
                                  const opticsIndex = filteredEvents.findIndex(e => e === opticsEvent)
                                  return (
                                    <DualTrackCard
                                      key={opticsEvent.titleEn}
                                      event={opticsEvent}
                                      eventIndex={opticsIndex}
                                      isExpanded={expandedEvent === opticsIndex}
                                      onToggle={() => setExpandedEvent(expandedEvent === opticsIndex ? null : opticsIndex)}
                                      onReadStory={() => handleOpenStory(opticsIndex)}
                                      onLinkTo={handleLinkTo}
                                      onHighlightCourses={handleEventClickForHighlight}
                                      side="left"
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {/* Center year marker */}
                          <div className="w-20 flex flex-col items-center justify-start relative z-10 flex-shrink-0">
                            <div className={cn(
                              'w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2',
                              hasOptics && hasPolarization
                                ? theme === 'dark'
                                  ? 'bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border-gray-500 text-white'
                                  : 'bg-gradient-to-br from-amber-100 to-cyan-100 border-gray-400 text-gray-800'
                                : hasOptics
                                  ? theme === 'dark'
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                    : 'bg-amber-100 border-amber-500 text-amber-700'
                                  : theme === 'dark'
                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                    : 'bg-cyan-100 border-cyan-500 text-cyan-700'
                            )}>
                              {year}
                            </div>
                            {/* Connector lines */}
                            {hasOptics && (
                              <div className={cn(
                                'absolute top-6 right-full w-4 h-0.5 mr-0',
                                theme === 'dark' ? 'bg-amber-500/50' : 'bg-amber-400'
                              )} />
                            )}
                            {hasPolarization && (
                              <div className={cn(
                                'absolute top-6 left-full w-4 h-0.5 ml-0',
                                theme === 'dark' ? 'bg-cyan-500/50' : 'bg-cyan-400'
                              )} />
                            )}
                          </div>

                          {/* Right side - Polarization (can have multiple events) */}
                          <div className="flex-1 pl-4 flex justify-start">
                            {hasPolarization && (
                              <div className="w-full max-w-md space-y-3">
                                {polarizationEvents.map((polarizationEvent) => {
                                  const polarizationIndex = filteredEvents.findIndex(e => e === polarizationEvent)
                                  return (
                                    <DualTrackCard
                                      key={polarizationEvent.titleEn}
                                      event={polarizationEvent}
                                      eventIndex={polarizationIndex}
                                      isExpanded={expandedEvent === polarizationIndex}
                                      onToggle={() => setExpandedEvent(expandedEvent === polarizationIndex ? null : polarizationIndex)}
                                      onReadStory={() => handleOpenStory(polarizationIndex)}
                                      onLinkTo={handleLinkTo}
                                      onHighlightCourses={handleEventClickForHighlight}
                                      side="right"
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'scientists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scientists.map((event) => (
              <div
                key={event.scientistEn}
                className={cn(
                  'rounded-xl border p-5 transition-all hover:shadow-lg',
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'
                    : 'bg-white border-gray-200 hover:border-amber-400'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Portrait Emoji */}
                  <div className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl',
                    theme === 'dark' ? 'bg-slate-700' : 'bg-amber-100'
                  )}>
                    {event.scientistBio?.portraitEmoji || '👤'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-bold text-lg mb-1',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? event.scientistZh : event.scientistEn}
                    </h3>

                    {/* Lifespan & Nationality */}
                    <div className={cn(
                      'flex flex-wrap items-center gap-2 mb-2 text-xs',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {event.scientistBio?.birthYear && event.scientistBio?.deathYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.scientistBio.birthYear} - {event.scientistBio.deathYear}
                        </span>
                      )}
                      {event.scientistBio?.nationality && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.scientistBio.nationality}
                        </span>
                      )}
                    </div>

                    {/* Key Discovery */}
                    <Badge color={CATEGORY_LABELS[event.category].color} className="mb-2">
                      {event.year}: {isZh ? event.titleZh : event.titleEn}
                    </Badge>

                    {/* Bio */}
                    <p className={cn(
                      'text-sm line-clamp-3',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {isZh ? event.scientistBio?.bioZh : event.scientistBio?.bioEn}
                    </p>

                    {/* Read Story Link */}
                    {event.story && (
                      <button
                        onClick={() => {
                          const idx = TIMELINE_EVENTS.findIndex(e => e.scientistEn === event.scientistEn)
                          if (idx >= 0) handleOpenStory(idx)
                        }}
                        className={cn(
                          'mt-3 flex items-center gap-1 text-sm font-medium transition-colors',
                          theme === 'dark'
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-amber-600 hover:text-amber-700'
                        )}
                      >
                        <BookOpen className="w-4 h-4" />
                        {isZh ? '阅读故事' : 'Read Story'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="space-y-4">
            {/* Intro */}
            <div className={cn(
              'rounded-xl border p-6 mb-6',
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-amber-50 border-amber-200'
            )}>
              <div className="flex items-start gap-4">
                <FlaskConical className={cn(
                  'w-10 h-10 flex-shrink-0',
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                )} />
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '历史性实验' : 'Historic Experiments'}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh
                      ? '这些实验改变了我们对光的理解。点击每个实验了解其原理和历史意义。'
                      : 'These experiments transformed our understanding of light. Click each experiment to learn about its principles and historical significance.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Experiment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIMELINE_EVENTS.filter(e => e.category === 'experiment' || e.category === 'discovery').map((event) => (
                <div
                  key={event.year}
                  className={cn(
                    'rounded-xl border p-5 transition-all cursor-pointer hover:shadow-lg',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
                      : 'bg-white border-gray-200 hover:border-cyan-400'
                  )}
                  onClick={() => {
                    const idx = TIMELINE_EVENTS.findIndex(e => e.year === event.year)
                    if (idx >= 0) handleOpenStory(idx)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
                      theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-100'
                    )}>
                      <span className="text-2xl font-bold font-mono text-cyan-500">
                        {event.year.toString().slice(-2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge color={CATEGORY_LABELS[event.category].color}>
                          {isZh ? CATEGORY_LABELS[event.category].zh : CATEGORY_LABELS[event.category].en}
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
                        <span className={cn(
                          'text-xs font-mono',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {event.year}
                        </span>
                      </div>
                      <h4 className={cn(
                        'font-semibold mb-1',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {isZh ? event.titleZh : event.titleEn}
                      </h4>
                      {event.scientistEn && (
                        <p className={cn(
                          'text-xs mb-2',
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        )}>
                          {event.scientistBio?.portraitEmoji} {isZh ? event.scientistZh : event.scientistEn}
                        </p>
                      )}
                      <p className={cn(
                        'text-sm line-clamp-2',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {isZh ? event.descriptionZh : event.descriptionEn}
                      </p>
                      {event.scene?.location && (
                        <p className={cn(
                          'text-xs mt-2 flex items-center gap-1',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          <MapPin className="w-3 h-3" />
                          {event.scene.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Story Modal */}
      {storyModalEvent !== null && filteredEvents[storyModalEvent] && (
        <StoryModal
          event={filteredEvents[storyModalEvent]}
          onClose={handleCloseStory}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
          hasNext={storyModalEvent < filteredEvents.length - 1}
          hasPrev={storyModalEvent > 0}
        />
      )}
    </div>
  )
}
