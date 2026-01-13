/**
 * HomePage - 光的编年史首页
 * 首页 = 时间线为核心内容，左侧课程大纲导航
 *
 * 架构：
 * 1. 顶部导航栏（统一logo和标题）
 * 2. 左侧边栏（课程大纲 + 模块入口）
 * 3. 主内容区（双轨时间线）
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { PolarWorldLogo } from '@/components/icons'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sun,
  Sparkles,
  FlaskConical,
  Lightbulb,
  Target,
  Telescope,
  Zap,
  Eye,
  Menu,
  X,
  Calculator,
  Users,
  Compass,
  Palette,
  ArrowRight,
} from 'lucide-react'

// Data imports
import { TIMELINE_EVENTS, type TimelineEvent } from '@/data/timeline-events'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'
import {
  COURSE_TIMELINE_MAPPINGS,
  type CourseTimelineMapping,
} from '@/data/course-timeline-integration'

// ============================================================================
// Module Entry Points Data
// ============================================================================

interface ModuleEntry {
  id: string
  titleZh: string
  titleEn: string
  descZh: string
  descEn: string
  icon: React.ReactNode
  link: string
  color: string
  gradient: string
}

const MODULE_ENTRIES: ModuleEntry[] = [
  {
    id: 'demos',
    titleZh: '偏振演示馆',
    titleEn: 'Demo Gallery',
    descZh: '20+ 交互式演示',
    descEn: '20+ Interactive demos',
    icon: <Eye className="w-5 h-5" />,
    link: '/demos',
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'optical-studio',
    titleZh: '光学设计室',
    titleEn: 'Optical Studio',
    descZh: '器件库与光路设计',
    descEn: 'Device library & light paths',
    icon: <Palette className="w-5 h-5" />,
    link: '/optical-studio',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'calc',
    titleZh: '计算工坊',
    titleEn: 'Calculators',
    descZh: 'Jones/Stokes/Mueller',
    descEn: 'Jones/Stokes/Mueller',
    icon: <Calculator className="w-5 h-5" />,
    link: '/calc',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
  },
  // 偏振探秘暂时隐藏，尚未完善
  // {
  //   id: 'games',
  //   titleZh: '偏振探秘',
  //   titleEn: 'PolarQuest',
  //   descZh: '游戏化学习',
  //   descEn: 'Gamified learning',
  //   icon: <Gamepad2 className="w-5 h-5" />,
  //   link: '/games',
  //   color: '#F59E0B',
  //   gradient: 'from-amber-500 to-orange-500',
  // },
  {
    id: 'lab',
    titleZh: '虚拟课题组',
    titleEn: 'Virtual Lab',
    descZh: '研究任务与社区',
    descEn: 'Research & community',
    icon: <Users className="w-5 h-5" />,
    link: '/lab',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-500',
  },
]

// ============================================================================
// Course Outline Sidebar - 课程大纲侧边栏
// ============================================================================

interface CourseOutlineSidebarProps {
  theme: 'dark' | 'light'
  isZh: boolean
  activeUnitId: string | null
  onUnitClick: (unitId: string) => void
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
        {/* Module Entry Points */}
        <div className={cn(
          'p-4 border-b',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <h2 className={cn(
            'text-sm font-bold flex items-center gap-2 mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <Compass className="w-4 h-4 text-cyan-500" />
            {isZh ? '学习模块' : 'Learning Modules'}
          </h2>
          <div className="space-y-2">
            {MODULE_ENTRIES.map((module) => (
              <Link
                key={module.id}
                to={module.link}
                className={cn(
                  'flex items-center gap-3 p-2.5 rounded-xl border transition-all hover:scale-[1.02]',
                  theme === 'dark'
                    ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className={cn('p-2 rounded-lg text-white', `bg-gradient-to-br ${module.gradient}`)}
                >
                  {module.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-medium text-sm truncate',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? module.titleZh : module.titleEn}
                  </p>
                  <p className={cn(
                    'text-xs truncate',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  )}>
                    {isZh ? module.descZh : module.descEn}
                  </p>
                </div>
                <ArrowRight className={cn(
                  'w-4 h-4 flex-shrink-0',
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                )} />
              </Link>
            ))}
          </div>
        </div>

        {/* Course Outline Header */}
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
            {isZh ? '点击展开课程内容' : 'Click to expand course content'}
          </p>
        </div>

        {/* Units list */}
        <div className="p-3 space-y-2">
          {PSRT_CURRICULUM.map((unit, index) => {
            const color = unitColors[index % unitColors.length]
            const isActive = activeUnitId === unit.id

            return (
              <button
                key={unit.id}
                onClick={() => onUnitClick(unit.id)}
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
// 主页组件
// ============================================================================

export function HomePage() {
  const { t } = useTranslation()
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

  // Handle unit click from sidebar - toggle expand/collapse
  const handleUnitClick = useCallback((unitId: string) => {
    // Toggle: if already active, collapse; otherwise expand
    setActiveUnitId(prev => prev === unitId ? null : unitId)
  }, [])

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
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-between px-4 py-3',
        theme === 'dark'
          ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
          : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
      )}>
        <div className="flex items-center gap-3">
          <PolarWorldLogo size={36} theme={theme} />
          <span className={cn(
            'hidden sm:block font-bold text-base',
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
          )}>
            {t('home.chronicles.title')}
          </span>
        </div>
        <LanguageThemeSwitcher />
      </header>

      <div className="flex pt-16">
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
          {/* Hero section - 课程介绍 */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={cn(
                'text-xs px-3 py-1 rounded-full font-medium',
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-cyan-100 text-cyan-700'
              )}>
                {t('home.courseBanner.badge')}
              </span>
            </div>
            <h1 className={cn(
              'text-2xl sm:text-3xl font-bold mb-4',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t('home.courseBanner.title')}
            </h1>
            <p className={cn(
              'text-sm sm:text-base max-w-3xl mx-auto mb-6 leading-relaxed',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('home.courseBanner.description')}
            </p>

            {/* Track legend for timeline */}
            <div className={cn(
              'inline-flex items-center gap-6 text-sm px-6 py-3 rounded-xl',
              theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
            )}>
              <span className={cn(
                'text-xs font-medium',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {isZh ? '时间线：' : 'Timeline:'}
              </span>
              <div className="flex items-center gap-2">
                <Sun className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>
                  {isZh ? '广义光学' : 'General Optics'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className={cn('w-4 h-4', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
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

          {/* Footer */}
          <footer className={cn(
            'mt-12 text-center text-xs',
            theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
          )}>
            <p className="opacity-60">© 2025 开放智慧实验室 Open Wisdom Lab</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default HomePage
