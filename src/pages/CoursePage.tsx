/**
 * CoursePage - 光的编年史：双线叙事
 * Chronicles of Light: Dual Narrative - Optics & Polarization
 *
 * 设计理念：
 * - 以"光的编年史"为主线，双轨时间线作为课程主体内容
 * - 左侧课程大纲作为导航，与时间线对应
 * - 减少层级，直接呈现历史与学习的融合
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared'
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sun,
  Sparkles,
  FlaskConical,
  History,
  Lightbulb,
  Target,
  Telescope,
  Zap,
  Eye,
  Menu,
  X,
} from 'lucide-react'

// Data imports
import { TIMELINE_EVENTS, type TimelineEvent } from '@/data/timeline-events'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'
import {
  COURSE_TIMELINE_MAPPINGS,
  HISTORICAL_ERAS,
  type CourseTimelineMapping,
} from '@/data/course-timeline-integration'

// ============================================================================
// Course Outline Sidebar - 课程大纲侧边栏
// ============================================================================

interface CourseOutlineSidebarProps {
  theme: 'dark' | 'light'
  isZh: boolean
  activeUnitId: string | null
  onUnitClick: (unitId: string, year: number) => void
  isOpen: boolean
  onToggle: () => void
}

function CourseOutlineSidebar({
  theme,
  isZh,
  activeUnitId,
  onUnitClick,
  isOpen,
  onToggle,
}: CourseOutlineSidebarProps) {
  const unitColors = ['#22D3EE', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
  const unitIcons = [
    <Lightbulb key="1" className="w-4 h-4" />,
    <Zap key="2" className="w-4 h-4" />,
    <Sparkles key="3" className="w-4 h-4" />,
    <Target key="4" className="w-4 h-4" />,
    <Telescope key="5" className="w-4 h-4" />,
  ]

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          'lg:hidden fixed left-4 top-20 z-40 p-2 rounded-lg shadow-lg transition-all',
          theme === 'dark'
            ? 'bg-slate-800 text-white border border-slate-700'
            : 'bg-white text-gray-900 border border-gray-200'
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-30 transition-transform duration-300',
          'w-72 overflow-y-auto scrollbar-thin',
          theme === 'dark'
            ? 'bg-slate-900/95 border-r border-slate-700'
            : 'bg-white/95 border-r border-gray-200',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className={cn(
          'sticky top-0 p-4 border-b backdrop-blur-sm',
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700'
            : 'bg-white/80 border-gray-200'
        )}>
          <h2 className={cn(
            'text-sm font-bold flex items-center gap-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <BookOpen className="w-4 h-4 text-amber-500" />
            {isZh ? '课程大纲' : 'Course Outline'}
          </h2>
          <p className={cn(
            'text-xs mt-1',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            {isZh ? '点击单元跳转到对应历史节点' : 'Click unit to jump to timeline'}
          </p>
        </div>

        {/* Units list */}
        <div className="p-3 space-y-2">
          {PSRT_CURRICULUM.map((unit, index) => {
            const mapping = COURSE_TIMELINE_MAPPINGS.find(m => m.unitNumber === unit.unitNumber)
            const color = unitColors[index % unitColors.length]
            const isActive = activeUnitId === unit.id

            return (
              <button
                key={unit.id}
                onClick={() => onUnitClick(unit.id, mapping?.historicalOriginYear || 1669)}
                className={cn(
                  'w-full text-left p-3 rounded-xl border transition-all duration-200',
                  isActive
                    ? theme === 'dark'
                      ? 'bg-slate-800 shadow-lg'
                      : 'bg-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-slate-800/50 hover:bg-slate-800'
                      : 'bg-gray-50 hover:bg-white'
                )}
                style={{
                  borderColor: isActive ? color : theme === 'dark' ? '#334155' : '#e5e7eb',
                  boxShadow: isActive ? `0 4px 20px ${color}20` : undefined,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Unit number */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {unit.unitNumber}
                  </div>

                  {/* Unit info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span style={{ color }}>{unitIcons[index]}</span>
                      <span className={cn(
                        'text-xs font-medium',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        {mapping?.historicalOriginYear}
                      </span>
                    </div>
                    <h3 className={cn(
                      'text-sm font-medium leading-tight',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? unit.titleZh : unit.titleEn}
                    </h3>
                    <p className={cn(
                      'text-xs mt-1 line-clamp-2',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {isZh ? unit.subtitleZh : unit.subtitleEn}
                    </p>
                  </div>

                  <ChevronRight className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform',
                    isActive ? 'rotate-90' : '',
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  )} />
                </div>

                {/* Sections preview when active */}
                {isActive && (
                  <div className="mt-3 pt-3 border-t space-y-1.5"
                    style={{ borderColor: theme === 'dark' ? '#334155' : '#e5e7eb' }}
                  >
                    {unit.sections.slice(0, 3).map(section => (
                      <Link
                        key={section.id}
                        to={section.relatedDemos[0] ? `/demos/${section.relatedDemos[0]}` : '#'}
                        onClick={e => e.stopPropagation()}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-lg text-xs transition-colors',
                          theme === 'dark'
                            ? 'hover:bg-slate-700/50 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                        )}
                      >
                        <span
                          className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {section.id}
                        </span>
                        <span className="flex-1 truncate">
                          {isZh ? section.titleZh : section.titleEn}
                        </span>
                        <FlaskConical className="w-3 h-3 opacity-50" />
                      </Link>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Era overview */}
        <div className={cn(
          'p-4 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <h3 className={cn(
            'text-xs font-bold mb-3 flex items-center gap-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            <History className="w-3.5 h-3.5" />
            {isZh ? '历史时代' : 'Historical Eras'}
          </h3>
          <div className="space-y-2">
            {HISTORICAL_ERAS.map(era => (
              <div
                key={era.id}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg',
                  theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
                )}
              >
                <span className="text-lg">{era.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-xs font-medium',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? era.nameZh : era.nameEn}
                  </p>
                  <p className={cn(
                    'text-[10px]',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {era.startYear}-{era.endYear}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={onToggle}
        />
      )}
    </>
  )
}

// ============================================================================
// Timeline Event Card - 时间线事件卡片
// ============================================================================

interface TimelineEventCardProps {
  event: TimelineEvent
  theme: 'dark' | 'light'
  isZh: boolean
  isExpanded: boolean
  onToggle: () => void
  relatedUnit?: CourseTimelineMapping
}

function TimelineEventCard({
  event,
  theme,
  isZh,
  isExpanded,
  onToggle,
  relatedUnit,
}: TimelineEventCardProps) {
  const isOptics = event.track === 'optics'
  const trackColor = isOptics ? '#F59E0B' : '#22D3EE'
  const scientistName = isZh ? event.scientistZh : event.scientistEn

  return (
    <div
      data-year={event.year}
      className={cn(
        'rounded-xl border-2 overflow-hidden transition-all duration-300',
        isExpanded
          ? theme === 'dark'
            ? 'bg-slate-800 shadow-xl'
            : 'bg-white shadow-xl'
          : theme === 'dark'
            ? 'bg-slate-800/70 hover:bg-slate-800'
            : 'bg-white/90 hover:bg-white'
      )}
      style={{
        borderColor: isExpanded ? trackColor : theme === 'dark' ? '#334155' : '#e5e7eb',
        boxShadow: isExpanded ? `0 8px 32px ${trackColor}20` : undefined,
      }}
    >
      {/* Card header */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          {/* Track indicator */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${trackColor}20` }}
          >
            {isOptics
              ? <Sun className="w-5 h-5" style={{ color: trackColor }} />
              : <Sparkles className="w-5 h-5" style={{ color: trackColor }} />
            }
          </div>

          {/* Event info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                'text-xs font-bold px-2 py-0.5 rounded-full',
                isOptics
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-cyan-500/20 text-cyan-500'
              )}>
                {event.year}
              </span>
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded',
                theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              )}>
                {isOptics ? (isZh ? '广义光学' : 'Optics') : (isZh ? '偏振光' : 'Polarization')}
              </span>
            </div>
            <h3 className={cn(
              'font-bold text-sm mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? event.titleZh : event.titleEn}
            </h3>
            <p className={cn(
              'text-xs line-clamp-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? event.descriptionZh : event.descriptionEn}
            </p>
          </div>

          <ChevronDown className={cn(
            'w-4 h-4 flex-shrink-0 transition-transform',
            isExpanded ? 'rotate-180' : '',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className={cn(
          'px-4 pb-4 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
        )}>
          {/* Scientist info */}
          {scientistName && (
            <div className={cn(
              'mt-3 p-3 rounded-lg flex items-center gap-3',
              theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
            )}>
              {event.scientistBio?.portraitEmoji && (
                <span className="text-3xl">{event.scientistBio.portraitEmoji}</span>
              )}
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {scientistName}
                </p>
                {event.scientistBio?.bioEn && (
                  <p className={cn(
                    'text-xs line-clamp-2',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {isZh ? event.scientistBio.bioZh : event.scientistBio.bioEn}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Story */}
          {event.story && (
            <div className={cn(
              'mt-3 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50/80'
            )}>
              <p className={cn(
                'text-xs italic',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {isZh ? event.story.zh : event.story.en}
              </p>
            </div>
          )}

          {/* Thinking question */}
          {event.thinkingQuestion && (
            <div className={cn(
              'mt-3 p-3 rounded-lg border',
              theme === 'dark'
                ? 'bg-cyan-900/10 border-cyan-500/30'
                : 'bg-cyan-50 border-cyan-200'
            )}>
              <p className={cn(
                'text-xs font-medium',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
              )}>
                🤔 {isZh ? event.thinkingQuestion.zh : event.thinkingQuestion.en}
              </p>
            </div>
          )}

          {/* Related course unit */}
          {relatedUnit && (
            <Link
              to={relatedUnit.keyExperimentDemo}
              className={cn(
                'mt-3 p-3 rounded-lg border flex items-center gap-2 transition-colors',
                theme === 'dark'
                  ? 'bg-violet-900/10 border-violet-500/30 hover:bg-violet-900/20'
                  : 'bg-violet-50 border-violet-200 hover:bg-violet-100'
              )}
            >
              <BookOpen className="w-4 h-4 text-violet-500" />
              <div className="flex-1">
                <span className={cn(
                  'text-xs font-bold',
                  theme === 'dark' ? 'text-violet-400' : 'text-violet-600'
                )}>
                  {isZh ? `单元 ${relatedUnit.unitNumber}` : `Unit ${relatedUnit.unitNumber}`}
                </span>
                <span className={cn(
                  'text-xs ml-2',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? relatedUnit.unitTitleZh : relatedUnit.unitTitleEn}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-violet-500" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Year Marker - 年份标记
// ============================================================================

function YearMarker({ year, theme, hasOptics, hasPolarization }: {
  year: number
  theme: 'dark' | 'light'
  hasOptics: boolean
  hasPolarization: boolean
}) {
  return (
    <div className={cn(
      'w-16 h-16 rounded-full flex flex-col items-center justify-center font-mono font-bold border-2',
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
      <span className="text-lg">{year}</span>
    </div>
  )
}

// ============================================================================
// Main Component - 主组件
// ============================================================================

export function CoursePage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const { isMobile, isTablet } = useIsMobile()
  const isZh = i18n.language === 'zh'

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null)
  const [expandedEventKey, setExpandedEventKey] = useState<string | null>(null)
  const [trackFilter, setTrackFilter] = useState<'all' | 'optics' | 'polarization'>('all')

  const mainRef = useRef<HTMLDivElement>(null)

  // Filter events by track
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(e =>
      trackFilter === 'all' || e.track === trackFilter
    ).sort((a, b) => a.year - b.year)
  }, [trackFilter])

  // Get unique years
  const years = useMemo(() => {
    return [...new Set(filteredEvents.map(e => e.year))].sort((a, b) => a - b)
  }, [filteredEvents])

  // Find related course unit for an event
  const findRelatedUnit = useCallback((event: TimelineEvent): CourseTimelineMapping | undefined => {
    return COURSE_TIMELINE_MAPPINGS.find(m =>
      m.relatedTimelineYears.includes(event.year)
    )
  }, [])

  // Handle unit click from sidebar
  const handleUnitClick = useCallback((unitId: string, year: number) => {
    setActiveUnitId(unitId)
    setSidebarOpen(false)

    // Find and scroll to the year
    setTimeout(() => {
      const element = document.querySelector(`[data-year="${year}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Expand the first event of that year
        const eventKey = filteredEvents.find(e => e.year === year)
        if (eventKey) {
          setExpandedEventKey(`${eventKey.year}-${eventKey.titleEn}`)
        }
      }
    }, 100)
  }, [filteredEvents])

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setSidebarOpen(false)
    }
  }, [isMobile, isTablet])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header */}
      <PersistentHeader
        moduleKey="chronicles"
        moduleName={isZh ? '光的编年史' : 'Chronicles of Light'}
        variant="glass"
        className="sticky top-0 z-50"
      />

      <div className="flex">
        {/* Sidebar */}
        <CourseOutlineSidebar
          theme={theme}
          isZh={isZh}
          activeUnitId={activeUnitId}
          onUnitClick={handleUnitClick}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main content */}
        <main ref={mainRef} className="flex-1 min-w-0 px-4 lg:px-8 py-6">
          {/* Hero section */}
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <h1 className={cn(
              'text-2xl sm:text-3xl font-bold mb-3',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '双线叙事：光学与偏振' : 'Dual Narrative: Optics & Polarization'}
            </h1>
            <p className={cn(
              'text-sm sm:text-base max-w-2xl mx-auto mb-4',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '从17世纪的偶然发现到现代应用，探索三个多世纪的光学奥秘。左侧追溯广义光学史上的核心发现，右侧聚焦偏振光的专属旅程。'
                : 'From 17th-century discoveries to modern applications — explore over three centuries of optical mysteries. Left track traces core optics history, right track follows the polarization journey.'}
            </p>

            {/* Track legend */}
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

          {/* Track filters */}
          <div className={cn(
            'flex flex-wrap items-center justify-center gap-2 mb-8 p-3 rounded-xl max-w-xl mx-auto',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
          )}>
            <button
              onClick={() => setTrackFilter('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                trackFilter === 'all'
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-amber-500/30 to-cyan-500/30 text-white'
                    : 'bg-gradient-to-r from-amber-100 to-cyan-100 text-gray-900'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {isZh ? '全部' : 'All'}
            </button>
            <button
              onClick={() => setTrackFilter('optics')}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                trackFilter === 'optics'
                  ? 'bg-amber-500 text-white'
                  : theme === 'dark'
                    ? 'text-amber-400 hover:bg-amber-500/20'
                    : 'text-amber-600 hover:bg-amber-100'
              )}
            >
              <Sun className="w-4 h-4" />
              {isZh ? '广义光学' : 'Optics'}
            </button>
            <button
              onClick={() => setTrackFilter('polarization')}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                trackFilter === 'polarization'
                  ? 'bg-cyan-500 text-white'
                  : theme === 'dark'
                    ? 'text-cyan-400 hover:bg-cyan-500/20'
                    : 'text-cyan-600 hover:bg-cyan-100'
              )}
            >
              <Sparkles className="w-4 h-4" />
              {isZh ? '偏振光' : 'Polarization'}
            </button>
          </div>

          {/* Dual-track timeline */}
          <div className="relative max-w-5xl mx-auto">
            {/* Track labels - Desktop only */}
            <div className="hidden lg:flex items-center justify-between mb-6">
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

            {/* Center vertical line - Desktop only */}
            <div className={cn(
              'hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2',
              theme === 'dark'
                ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50'
                : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
            )} />

            {/* Timeline events */}
            <div className="space-y-8">
              {years.map(year => {
                const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                const hasOptics = opticsEvents.length > 0
                const hasPolarization = polarizationEvents.length > 0

                return (
                  <div
                    key={year}
                    id={`timeline-year-${year}`}
                    className={cn(
                      'relative',
                      'lg:flex lg:items-stretch lg:gap-4'
                    )}
                  >
                    {/* Left side - Optics (Desktop) */}
                    <div className="hidden lg:block flex-1 pr-4">
                      {hasOptics && (
                        <div className="space-y-3 ml-auto max-w-md">
                          {opticsEvents.map(event => (
                            <TimelineEventCard
                              key={`${event.year}-${event.titleEn}`}
                              event={event}
                              theme={theme}
                              isZh={isZh}
                              isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                              onToggle={() => setExpandedEventKey(
                                expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                              )}
                              relatedUnit={findRelatedUnit(event)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Center year marker (Desktop) */}
                    <div className="hidden lg:flex w-20 flex-col items-center justify-start relative z-10 flex-shrink-0">
                      <YearMarker
                        year={year}
                        theme={theme}
                        hasOptics={hasOptics}
                        hasPolarization={hasPolarization}
                      />
                    </div>

                    {/* Right side - Polarization (Desktop) */}
                    <div className="hidden lg:block flex-1 pl-4">
                      {hasPolarization && (
                        <div className="space-y-3 max-w-md">
                          {polarizationEvents.map(event => (
                            <TimelineEventCard
                              key={`${event.year}-${event.titleEn}`}
                              event={event}
                              theme={theme}
                              isZh={isZh}
                              isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                              onToggle={() => setExpandedEventKey(
                                expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                              )}
                              relatedUnit={findRelatedUnit(event)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Mobile/Tablet - Single column */}
                    <div className="lg:hidden space-y-4">
                      {/* Year badge */}
                      <div className="flex items-center gap-3">
                        <YearMarker
                          year={year}
                          theme={theme}
                          hasOptics={hasOptics}
                          hasPolarization={hasPolarization}
                        />
                        <div className={cn(
                          'flex-1 h-0.5',
                          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                        )} />
                      </div>

                      {/* All events for this year */}
                      <div className="space-y-3 pl-4">
                        {[...opticsEvents, ...polarizationEvents].map(event => (
                          <TimelineEventCard
                            key={`${event.year}-${event.titleEn}`}
                            event={event}
                            theme={theme}
                            isZh={isZh}
                            isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                            onToggle={() => setExpandedEventKey(
                              expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                            )}
                            relatedUnit={findRelatedUnit(event)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={cn(
            'mt-12 p-6 rounded-2xl text-center max-w-2xl mx-auto',
            theme === 'dark'
              ? 'bg-gradient-to-r from-amber-900/20 via-slate-800/50 to-cyan-900/20'
              : 'bg-gradient-to-r from-amber-50 via-white to-cyan-50'
          )}>
            <h3 className={cn(
              'text-lg font-bold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '开始探索偏振世界' : 'Start Exploring Polarization'}
            </h3>
            <p className={cn(
              'text-sm mb-4',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '通过交互演示亲身体验偏振光的奥秘'
                : 'Experience the mysteries of polarized light through interactive demos'}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/demos"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform text-sm"
              >
                <FlaskConical className="w-4 h-4" />
                {isZh ? '探索演示' : 'Explore Demos'}
              </Link>
              <Link
                to="/optical-studio"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform text-sm"
              >
                <Eye className="w-4 h-4" />
                {isZh ? '光学工作室' : 'Optical Studio'}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CoursePage
