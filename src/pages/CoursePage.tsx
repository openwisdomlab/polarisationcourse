/**
 * CoursePage - 光的编年史：课程主页
 * Chronicles of Light: Course Main Page
 *
 * 设计理念：
 * - 顶部：知识棱镜（光学全景图）
 * - Header：学习模块入口
 * - 左侧：课程大纲（筛选时间线）
 * - 右侧：双轨时间线（可按分类筛选）
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { PolarWorldLogo } from '@/components/icons'
import { OpticalOverviewDiagram } from '@/components/chronicles/OpticalOverviewDiagram'
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
  Palette,
  Search,
  Beaker,
  Layers,
  Rocket,
} from 'lucide-react'

// Data imports
import { TIMELINE_EVENTS, type TimelineEvent } from '@/data/timeline-events'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'
import {
  COURSE_TIMELINE_MAPPINGS,
  type CourseTimelineMapping,
} from '@/data/course-timeline-integration'

// ============================================================================
// Module Entry Points Data - 学习模块
// ============================================================================

interface ModuleEntry {
  id: string
  titleZh: string
  titleEn: string
  icon: React.ReactNode
  link: string
  color: string
}

const MODULE_ENTRIES: ModuleEntry[] = [
  {
    id: 'demos',
    titleZh: '演示馆',
    titleEn: 'Demos',
    icon: <Eye className="w-4 h-4" />,
    link: '/demos',
    color: '#22D3EE',
  },
  {
    id: 'optical-studio',
    titleZh: '设计室',
    titleEn: 'Studio',
    icon: <Palette className="w-4 h-4" />,
    link: '/optical-studio',
    color: '#6366F1',
  },
  {
    id: 'calc',
    titleZh: '计算工坊',
    titleEn: 'Calculators',
    icon: <Calculator className="w-4 h-4" />,
    link: '/calc',
    color: '#8B5CF6',
  },
  {
    id: 'lab',
    titleZh: '虚拟课题组',
    titleEn: 'Virtual Lab',
    icon: <Users className="w-4 h-4" />,
    link: '/lab',
    color: '#10B981',
  },
]

// ============================================================================
// Category Filter Data - 分类筛选
// ============================================================================

interface CategoryFilter {
  id: 'all' | 'discovery' | 'theory' | 'experiment' | 'application'
  labelZh: string
  labelEn: string
  icon: React.ReactNode
  color: string
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', labelZh: '全部', labelEn: 'All', icon: <Layers className="w-4 h-4" />, color: '#64748b' },
  { id: 'discovery', labelZh: '发现', labelEn: 'Discovery', icon: <Search className="w-4 h-4" />, color: '#F59E0B' },
  { id: 'theory', labelZh: '理论', labelEn: 'Theory', icon: <Lightbulb className="w-4 h-4" />, color: '#3B82F6' },
  { id: 'experiment', labelZh: '实验', labelEn: 'Experiment', icon: <Beaker className="w-4 h-4" />, color: '#10B981' },
  { id: 'application', labelZh: '应用', labelEn: 'Application', icon: <Rocket className="w-4 h-4" />, color: '#EC4899' },
]

// ============================================================================
// Course Outline Sidebar - 课程大纲侧边栏（简化版）
// ============================================================================

interface CourseOutlineSidebarProps {
  theme: 'dark' | 'light'
  isZh: boolean
  activeUnitId: string | null
  onUnitClick: (unitId: string | null, years?: number[]) => void
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

      {/* Sidebar - 简化版，只显示单元列表 */}
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
            {isZh ? '点击单元查看详情并筛选时间线' : 'Click unit for details & filter timeline'}
          </p>
        </div>

        {/* Show All Button */}
        <div className="p-3 pb-0">
          <button
            onClick={() => onUnitClick(null)}
            className={cn(
              'w-full text-left p-3 rounded-xl border transition-all duration-200',
              !activeUnitId
                ? theme === 'dark'
                  ? 'bg-slate-800 border-cyan-500 shadow-lg'
                  : 'bg-white border-cyan-500 shadow-lg'
                : theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                  : 'bg-gray-50 border-gray-200 hover:bg-white'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-cyan-500 to-blue-500"
              >
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className={cn(
                  'text-sm font-medium block',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '显示全部' : 'Show All'}
                </span>
                <span className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '查看完整时间线' : 'View full timeline'}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Units list - 简化卡片 */}
        <div className="p-3 space-y-2">
          {PSRT_CURRICULUM.map((unit, index) => {
            const mapping = COURSE_TIMELINE_MAPPINGS.find(m => m.unitNumber === unit.unitNumber)
            const color = unitColors[index % unitColors.length]
            const isActive = activeUnitId === unit.id

            return (
              <button
                key={unit.id}
                onClick={() => onUnitClick(unit.id, mapping?.relatedTimelineYears)}
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
                  {/* Unit icon and number */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: color }}
                  >
                    {unitIcons[index]}
                  </div>

                  {/* Unit info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {isZh ? `单元 ${unit.unitNumber}` : `Unit ${unit.unitNumber}`}
                      </span>
                      <div className="flex items-center gap-1 text-xs">
                        <Eye className="w-3 h-3 opacity-50" />
                        <span className={cn(
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {unit.sections.length}
                        </span>
                        <Users className="w-3 h-3 opacity-50 ml-1" />
                        <span className={cn(
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {mapping?.keyEvents?.length || 0}
                        </span>
                      </div>
                    </div>
                    <h3 className={cn(
                      'text-sm font-medium leading-tight',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? unit.titleZh : unit.titleEn}
                    </h3>
                    <p className={cn(
                      'text-xs mt-1 line-clamp-1',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {isZh ? unit.subtitleZh : unit.subtitleEn}
                    </p>
                  </div>

                  <ChevronRight className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform mt-1',
                    isActive ? 'rotate-90 text-cyan-500' : '',
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  )} />
                </div>
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
// Unit Detail Panel - 单元详情面板（在主内容区显示）
// ============================================================================

interface UnitDetailPanelProps {
  unit: typeof PSRT_CURRICULUM[0]
  mapping?: CourseTimelineMapping
  theme: 'dark' | 'light'
  isZh: boolean
  onClose: () => void
}

function UnitDetailPanel({ unit, mapping, theme, isZh, onClose }: UnitDetailPanelProps) {
  const unitColors = ['#22D3EE', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
  const color = unitColors[(unit.unitNumber - 1) % unitColors.length]

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden mb-8',
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700'
        : 'bg-white border-gray-200 shadow-lg'
    )}>
      {/* Header */}
      <div
        className="p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)` }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
              style={{ backgroundColor: color }}
            >
              {unit.unitNumber}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: `${color}30`, color }}
                >
                  {isZh ? `单元 ${unit.unitNumber}` : `Unit ${unit.unitNumber}`}
                </span>
                <span className={cn(
                  'text-xs px-2 py-1 rounded',
                  theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                )}>
                  {unit.sections.length} {isZh ? '章节' : 'sections'}
                </span>
              </div>
              <h2 className={cn(
                'text-xl font-bold mb-1',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? unit.titleZh : unit.titleEn}
              </h2>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh ? unit.subtitleZh : unit.subtitleEn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              theme === 'dark'
                ? 'hover:bg-slate-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className={cn(
          'mt-4 text-sm leading-relaxed',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        )}>
          {isZh ? unit.descriptionZh : unit.descriptionEn}
        </p>
      </div>

      {/* Content Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Learning Objectives */}
        <div className={cn(
          'p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
        )}>
          <h3 className={cn(
            'text-sm font-bold mb-3 flex items-center gap-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <Target className="w-4 h-4" style={{ color }} />
            {isZh ? '学习目标' : 'Learning Objectives'}
          </h3>
          <ul className="space-y-2">
            {(isZh ? unit.learningObjectives.zh : unit.learningObjectives.en).map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {i + 1}
                </span>
                <span className={cn(
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {obj}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Applications */}
        <div className={cn(
          'p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
        )}>
          <h3 className={cn(
            'text-sm font-bold mb-3 flex items-center gap-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <Rocket className="w-4 h-4" style={{ color }} />
            {isZh ? '应用领域' : 'Applications'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(isZh ? unit.applications.zh : unit.applications.en).map((app, i) => (
              <span
                key={i}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full',
                  theme === 'dark'
                    ? 'bg-slate-600 text-gray-200'
                    : 'bg-white text-gray-700 border border-gray-200'
                )}
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 pb-6">
        <h3 className={cn(
          'text-sm font-bold mb-3 flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <BookOpen className="w-4 h-4" style={{ color }} />
          {isZh ? '章节内容' : 'Sections'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unit.sections.map(section => (
            <Link
              key={section.id}
              to={section.relatedDemos[0] ? `/demos/${section.relatedDemos[0]}` : '#'}
              className={cn(
                'p-3 rounded-xl border transition-all hover:scale-[1.02]',
                theme === 'dark'
                  ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                  : 'bg-white border-gray-200 hover:shadow-md'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {section.id}
                </span>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded',
                  section.difficulty === 'foundation'
                    ? 'bg-green-500/20 text-green-500'
                    : section.difficulty === 'application'
                    ? 'bg-cyan-500/20 text-cyan-500'
                    : 'bg-purple-500/20 text-purple-500'
                )}>
                  {section.difficulty === 'foundation'
                    ? (isZh ? '基础' : 'Basic')
                    : section.difficulty === 'application'
                    ? (isZh ? '应用' : 'Applied')
                    : (isZh ? '研究' : 'Research')}
                </span>
              </div>
              <h4 className={cn(
                'text-sm font-medium line-clamp-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? section.titleZh : section.titleEn}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <FlaskConical className="w-3 h-3 opacity-50" />
                <span className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {section.relatedDemos.length} {isZh ? '个演示' : 'demos'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Home Experiments */}
      {unit.homeExperiments && unit.homeExperiments.length > 0 && (
        <div className={cn(
          'px-6 pb-6 pt-2 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <h3 className={cn(
            'text-sm font-bold mb-3 flex items-center gap-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <Beaker className="w-4 h-4" style={{ color }} />
            {isZh ? '家庭实验' : 'Home Experiments'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unit.homeExperiments.map((exp, i) => (
              <div
                key={i}
                className={cn(
                  'p-3 rounded-xl',
                  theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50'
                )}
              >
                <h4 className={cn(
                  'text-sm font-medium mb-1',
                  theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
                )}>
                  {isZh ? exp.titleZh : exp.titleEn}
                </h4>
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {isZh ? exp.observation.zh : exp.observation.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Historical Events */}
      {mapping?.keyEvents && mapping.keyEvents.length > 0 && (
        <div className={cn(
          'px-6 pb-6 pt-2 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <h3 className={cn(
            'text-sm font-bold mb-3 flex items-center gap-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <Sun className="w-4 h-4" style={{ color }} />
            {isZh ? '关键历史事件' : 'Key Historical Events'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {mapping.keyEvents.map(event => (
              <div
                key={event.year}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                  event.isPrimary
                    ? theme === 'dark'
                      ? 'bg-slate-700'
                      : 'bg-gray-100'
                    : theme === 'dark'
                      ? 'bg-slate-700/50'
                      : 'bg-gray-50'
                )}
              >
                <span
                  className={cn(
                    'font-mono font-bold px-2 py-0.5 rounded',
                    theme === 'dark' ? 'bg-slate-600' : 'bg-white'
                  )}
                  style={{ borderLeft: event.isPrimary ? `2px solid ${color}` : undefined }}
                >
                  {event.year}
                </span>
                <span className={cn(
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {isZh ? event.titleZh : event.titleEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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

  // Category badge color
  const categoryColors: Record<string, string> = {
    discovery: '#F59E0B',
    theory: '#3B82F6',
    experiment: '#10B981',
    application: '#EC4899',
  }
  const categoryLabels: Record<string, { zh: string; en: string }> = {
    discovery: { zh: '发现', en: 'Discovery' },
    theory: { zh: '理论', en: 'Theory' },
    experiment: { zh: '实验', en: 'Experiment' },
    application: { zh: '应用', en: 'Application' },
  }

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
            <div className="flex items-center gap-2 mb-1 flex-wrap">
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
              {/* Category badge */}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${categoryColors[event.category]}20`,
                  color: categoryColors[event.category],
                }}
              >
                {isZh ? categoryLabels[event.category].zh : categoryLabels[event.category].en}
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
                {isZh ? event.thinkingQuestion.zh : event.thinkingQuestion.en}
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
  const [activeYears, setActiveYears] = useState<number[] | null>(null)
  const [expandedEventKey, setExpandedEventKey] = useState<string | null>(null)
  const [trackFilter, setTrackFilter] = useState<'all' | 'optics' | 'polarization'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'discovery' | 'theory' | 'experiment' | 'application'>('all')

  const mainRef = useRef<HTMLDivElement>(null)

  // Filter events by track, category, and unit years
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(e => {
      // Track filter
      if (trackFilter !== 'all' && e.track !== trackFilter) return false
      // Category filter
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      // Unit years filter
      if (activeYears && activeYears.length > 0 && !activeYears.includes(e.year)) return false
      return true
    }).sort((a, b) => a.year - b.year)
  }, [trackFilter, categoryFilter, activeYears])

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
  const handleUnitClick = useCallback((unitId: string | null, years?: number[]) => {
    setActiveUnitId(unitId)
    setActiveYears(years || null)
    setSidebarOpen(false)
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
      {/* Header with logo and learning modules */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-between px-4 py-2',
        theme === 'dark'
          ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
          : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
      )}>
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <PolarWorldLogo size={32} theme={theme} animated={false} />
          <span className={cn(
            'hidden sm:block font-bold text-sm',
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
          )}>
            {isZh ? '偏振光下的新世界' : 'A New World Under Polarized Light'}
          </span>
        </Link>

        {/* Center: Learning modules */}
        <div className="hidden md:flex items-center gap-1">
          {MODULE_ENTRIES.map(module => (
            <Link
              key={module.id}
              to={module.link}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              )}
            >
              <span style={{ color: module.color }}>{module.icon}</span>
              <span>{isZh ? module.titleZh : module.titleEn}</span>
            </Link>
          ))}
        </div>

        {/* Right: Settings */}
        <LanguageThemeSwitcher />
      </header>

      <div className="flex pt-14">
        {/* Sidebar - Course Outline */}
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
          {/* Knowledge Prism - 知识棱镜 */}
          <OpticalOverviewDiagram />

          {/* Unit Detail Panel - 当选中单元时显示 */}
          {activeUnitId && (() => {
            const selectedUnit = PSRT_CURRICULUM.find(u => u.id === activeUnitId)
            const selectedMapping = COURSE_TIMELINE_MAPPINGS.find(m => m.unitNumber === selectedUnit?.unitNumber)
            return selectedUnit ? (
              <UnitDetailPanel
                unit={selectedUnit}
                mapping={selectedMapping}
                theme={theme}
                isZh={isZh}
                onClose={() => handleUnitClick(null)}
              />
            ) : null
          })()}

          {/* Track legend */}
          <div className={cn(
            'flex flex-wrap items-center justify-center gap-4 mb-6 p-3 rounded-xl',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
          )}>
            <span className={cn(
              'text-xs font-medium',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '时间线轨道：' : 'Timeline Track:'}
            </span>
            <button
              onClick={() => setTrackFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
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
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                trackFilter === 'optics'
                  ? 'bg-amber-500 text-white'
                  : theme === 'dark'
                    ? 'text-amber-400 hover:bg-amber-500/20'
                    : 'text-amber-600 hover:bg-amber-100'
              )}
            >
              <Sun className="w-3.5 h-3.5" />
              {isZh ? '广义光学' : 'Optics'}
            </button>
            <button
              onClick={() => setTrackFilter('polarization')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                trackFilter === 'polarization'
                  ? 'bg-cyan-500 text-white'
                  : theme === 'dark'
                    ? 'text-cyan-400 hover:bg-cyan-500/20'
                    : 'text-cyan-600 hover:bg-cyan-100'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isZh ? '偏振光' : 'Polarization'}
            </button>
          </div>

          {/* Category filters */}
          <div className={cn(
            'flex flex-wrap items-center justify-center gap-2 mb-8 p-3 rounded-xl',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
          )}>
            <span className={cn(
              'text-xs font-medium mr-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '分类筛选：' : 'Category:'}
            </span>
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  categoryFilter === cat.id
                    ? 'text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                )}
                style={{
                  backgroundColor: categoryFilter === cat.id ? cat.color : undefined,
                }}
              >
                {cat.icon}
                {isZh ? cat.labelZh : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Active filter indicator */}
          {activeUnitId && (
            <div className={cn(
              'flex items-center justify-center gap-2 mb-6 p-3 rounded-xl',
              theme === 'dark' ? 'bg-violet-900/20 border border-violet-500/30' : 'bg-violet-50 border border-violet-200'
            )}>
              <BookOpen className="w-4 h-4 text-violet-500" />
              <span className={cn(
                'text-sm',
                theme === 'dark' ? 'text-violet-300' : 'text-violet-700'
              )}>
                {isZh ? '正在查看单元相关时间线' : 'Viewing unit-related timeline'}
              </span>
              <button
                onClick={() => handleUnitClick(null)}
                className={cn(
                  'ml-2 px-2 py-0.5 rounded text-xs',
                  theme === 'dark' ? 'bg-violet-500/30 text-violet-300' : 'bg-violet-200 text-violet-700'
                )}
              >
                {isZh ? '清除筛选' : 'Clear filter'}
              </button>
            </div>
          )}

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
            {years.length === 0 ? (
              <div className={cn(
                'text-center py-12',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{isZh ? '没有找到匹配的事件' : 'No matching events found'}</p>
                <button
                  onClick={() => {
                    setTrackFilter('all')
                    setCategoryFilter('all')
                    handleUnitClick(null)
                  }}
                  className={cn(
                    'mt-4 px-4 py-2 rounded-lg text-sm',
                    theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                  )}
                >
                  {isZh ? '重置所有筛选' : 'Reset all filters'}
                </button>
              </div>
            ) : (
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
            )}
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

          {/* Footer */}
          <footer className={cn(
            'mt-12 text-center text-xs',
            theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
          )}>
            <p className="opacity-60">
              {isZh ? '© 2025 开放智慧实验室' : '© 2025 Open Wisdom Lab'}
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default CoursePage
