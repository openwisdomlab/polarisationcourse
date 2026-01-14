/**
 * HomePage - 光的编年史首页
 * 首页 = 时间线为核心内容
 *
 * 架构：
 * 1. 顶部导航栏（logo + 学习模块）
 * 2. 知识棱镜（光学全景图）
 * 3. 两栏布局：课程大纲 + 统一时间轴（中央年份标记，左侧广义光学，右侧偏振光）
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { OpticalOverviewDiagram } from '@/components/chronicles/OpticalOverviewDiagram'
import { PolarizationComparison } from '@/components/shared/PolarizationComparison'
import { EXHIBITION_HALLS, type ExhibitionHall } from '@/components/museum'
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
  Palette,
  ArrowRight,
  Search,
  Beaker,
  Layers,
  Rocket,
  Play,
  Waves,
  Atom,
  Microscope,
} from 'lucide-react'

// Data imports
import { TIMELINE_EVENTS, type TimelineEvent } from '@/data/timeline-events'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'
import {
  COURSE_TIMELINE_MAPPINGS,
  HISTORICAL_ERAS,
  PSRT_QUESTIONS,
  type CourseTimelineMapping,
} from '@/data/course-timeline-integration'

// ============================================================================
// Module Entry Points Data - Header版（简洁）
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
    titleZh: '科研实战营',
    titleEn: 'Research Lab',
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
// Course Outline Column - 课程大纲列（用于三栏布局）
// ============================================================================

interface CourseOutlineColumnProps {
  theme: 'dark' | 'light'
  isZh: boolean
  activeUnitId: string | null
  onUnitClick: (unitId: string | null, years?: number[]) => void
}

function CourseOutlineColumn({
  theme,
  isZh,
  activeUnitId,
  onUnitClick,
}: CourseOutlineColumnProps) {
  const unitColors = ['#22D3EE', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
  const unitIcons = [
    <Lightbulb key="1" className="w-4 h-4" />,
    <Zap key="2" className="w-4 h-4" />,
    <Sparkles key="3" className="w-4 h-4" />,
    <Target key="4" className="w-4 h-4" />,
    <Telescope key="5" className="w-4 h-4" />,
  ]

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden',
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700'
        : 'bg-white/80 border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'p-4 border-b',
        theme === 'dark'
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-gray-50/80 border-gray-200'
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
          {isZh ? '点击单元筛选时间线' : 'Click to filter timeline'}
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
                ? 'bg-slate-700 border-cyan-500 shadow-lg'
                : 'bg-white border-cyan-500 shadow-lg'
              : theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                : 'bg-gray-50 border-gray-200 hover:bg-white'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-cyan-500 to-blue-500"
            >
              <Layers className="w-4 h-4" />
            </div>
            <span className={cn(
              'text-sm font-medium',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '显示全部' : 'Show All'}
            </span>
          </div>
        </button>
      </div>

      {/* Units list */}
      <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
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
                    ? 'bg-slate-700 shadow-lg'
                    : 'bg-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-slate-800/50 hover:bg-slate-700'
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
                      {mapping?.keyEvents?.length || 0} {isZh ? '个事件' : 'events'}
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
                          ? 'hover:bg-slate-600/50 text-gray-300'
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
              {/* Category badge instead of redundant track label */}
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
// Animated Hero Components - 动画英雄区组件
// ============================================================================

// Floating light particle
interface ParticleProps {
  delay: number
  duration: number
  x: number
  y: number
  size: number
  color: string
}

function FloatingParticle({ delay, duration, x, y, size, color }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.5],
        y: [0, -100, -200],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
}

// Polarization wave animation
function PolarizationWave({ theme }: { theme: 'dark' | 'light' }) {
  const waveColor = theme === 'dark' ? '#22d3ee' : '#0891b2'

  return (
    <svg
      viewBox="0 0 400 100"
      className="w-full max-w-lg mx-auto"
      style={{ height: '60px' }}
    >
      {/* Horizontal polarization wave */}
      <motion.path
        d="M 0,50 Q 50,20 100,50 T 200,50 T 300,50 T 400,50"
        fill="none"
        stroke={waveColor}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      {/* Vertical polarization wave */}
      <motion.path
        d="M 0,50 Q 50,80 100,50 T 200,50 T 300,50 T 400,50"
        fill="none"
        stroke={theme === 'dark' ? '#a855f7' : '#7c3aed'}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
      />
      {/* Animated dot traveling along wave */}
      <motion.circle
        r="4"
        fill={waveColor}
        style={{ filter: `drop-shadow(0 0 8px ${waveColor})` }}
        initial={{ cx: 0, cy: 50 }}
        animate={{
          cx: [0, 100, 200, 300, 400],
          cy: [50, 20, 50, 20, 50],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </svg>
  )
}

// Animated polarizer icon
function AnimatedPolarizer({ theme }: { theme: 'dark' | 'light' }) {
  const color = theme === 'dark' ? '#22d3ee' : '#0891b2'

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-16 h-16"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      {/* Outer ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.3"
      />
      {/* Polarizer lines */}
      {[0, 30, 60, 90, 120, 150].map((angle) => (
        <motion.line
          key={angle}
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.6"
          transform={`rotate(${angle} 50 50)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: 2,
            delay: angle / 60,
            repeat: Infinity,
          }}
        />
      ))}
      {/* Center glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="8"
        fill={color}
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 10px ${color})` }}
      />
    </motion.svg>
  )
}

// Light beam effect
function LightBeamEffect({ theme }: { theme: 'dark' | 'light' }) {
  const beamColor = theme === 'dark' ? '#22d3ee' : '#0891b2'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Diagonal light beam */}
      <motion.div
        className="absolute"
        style={{
          width: '200%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${beamColor}40, ${beamColor}, ${beamColor}40, transparent)`,
          transformOrigin: 'center',
          top: '30%',
          left: '-50%',
        }}
        initial={{ x: '-100%', rotate: -15 }}
        animate={{ x: '100%' }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />
      {/* Second beam */}
      <motion.div
        className="absolute"
        style={{
          width: '150%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${beamColor}20, ${beamColor}60, ${beamColor}20, transparent)`,
          transformOrigin: 'center',
          top: '60%',
          left: '-25%',
        }}
        initial={{ x: '-100%', rotate: 10 }}
        animate={{ x: '100%' }}
        transition={{
          duration: 5,
          delay: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// Scroll indicator
function ScrollIndicator({ theme, onClick }: { theme: 'dark' | 'light', onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-xs font-medium">Scroll to explore</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </motion.button>
  )
}

// Generate random particles
function generateParticles(count: number, theme: 'dark' | 'light'): ParticleProps[] {
  const colors = theme === 'dark'
    ? ['#22d3ee', '#a855f7', '#3b82f6', '#f59e0b', '#22c55e']
    : ['#0891b2', '#7c3aed', '#2563eb', '#d97706', '#16a34a']

  return Array.from({ length: count }, (_, i) => ({
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    x: 10 + Math.random() * 80,
    y: 50 + Math.random() * 40,
    size: 4 + Math.random() * 8,
    color: colors[i % colors.length],
  }))
}

// ============================================================================
// 主页组件
// ============================================================================

export function HomePage() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [activeUnitId, setActiveUnitId] = useState<string | null>(null)
  const [activeYears, setActiveYears] = useState<number[] | null>(null)
  const [expandedEventKey, setExpandedEventKey] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'discovery' | 'theory' | 'experiment' | 'application'>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showHeroHeader, setShowHeroHeader] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  // Generate particles once on mount
  const particles = useMemo(() => generateParticles(15, theme), [theme])

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      setShowHeroHeader(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to content section
  const scrollToContent = useCallback(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Filter events by category and unit years
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(e => {
      // Category filter
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      // Unit years filter
      if (activeYears && activeYears.length > 0 && !activeYears.includes(e.year)) return false
      return true
    }).sort((a, b) => a.year - b.year)
  }, [categoryFilter, activeYears])

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

  // Handle unit click from course outline - with extended filtering
  const handleUnitClick = useCallback((unitId: string | null, directYears?: number[]) => {
    setActiveUnitId(unitId)

    if (!unitId || !directYears) {
      setActiveYears(null)
      return
    }

    // Find the unit's mapping
    const mapping = COURSE_TIMELINE_MAPPINGS.find(m =>
      PSRT_CURRICULUM.find(u => u.id === unitId)?.unitNumber === m.unitNumber
    )

    if (!mapping) {
      setActiveYears(directYears)
      return
    }

    // Collect extended years (direct + indirect)
    const extendedYears = new Set<number>(directYears)

    // Add years from the unit's era
    const era = HISTORICAL_ERAS.find(e => e.id === mapping.era)
    if (era) {
      TIMELINE_EVENTS
        .filter(e => e.year >= era.startYear && e.year < era.endYear)
        .forEach(e => extendedYears.add(e.year))
    }

    // Add years from related PSRT questions
    PSRT_QUESTIONS
      .filter(q => q.relatedUnits.includes(mapping.unitNumber))
      .forEach(q => q.relatedTimelineYears.forEach(y => extendedYears.add(y)))

    // Add years from key events in the mapping
    mapping.keyEvents?.forEach(ke => extendedYears.add(ke.year))

    setActiveYears([...extendedYears].sort((a, b) => a - b))
  }, [])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header - only visible after scrolling */}
      <AnimatePresence>
        {showHeroHeader && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'fixed top-0 left-0 right-0 z-50',
              'flex items-center justify-between px-4 py-2',
              theme === 'dark'
                ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
                : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
            )}
          >
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <PolarWorldLogo size={32} theme={theme} />
              <span className={cn(
                'hidden sm:block font-bold text-sm',
                theme === 'dark'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
              )}>
                {t('home.chronicles.title')}
              </span>
            </div>

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
            <div className="flex items-center gap-2">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  'md:hidden p-2 rounded-lg',
                  theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                )}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <LanguageThemeSwitcher />
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && showHeroHeader && (
        <div className={cn(
          'fixed top-14 left-0 right-0 z-40 md:hidden p-4 border-b',
          theme === 'dark'
            ? 'bg-slate-900/95 border-slate-700'
            : 'bg-white/95 border-gray-200'
        )}>
          <div className="flex flex-wrap gap-2">
            {MODULE_ENTRIES.map(module => (
              <Link
                key={module.id}
                to={module.link}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium',
                  theme === 'dark'
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                <span style={{ color: module.color }}>{module.icon}</span>
                <span>{isZh ? module.titleZh : module.titleEn}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* FULL SCREEN HERO SECTION - 全屏英雄区 */}
      {/* ================================================================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background effects */}
        <LightBeamEffect theme={theme} />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, i) => (
            <FloatingParticle key={i} {...particle} />
          ))}
        </div>

        {/* Top decorative elements */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-8">
          {/* Language/Theme switcher in hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 right-4"
          >
            <LanguageThemeSwitcher />
          </motion.div>
        </div>

        {/* Animated elements above title */}
        <motion.div
          className="flex items-center justify-center gap-8 mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Left polarizer */}
          <AnimatedPolarizer theme={theme} />

          {/* Center logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <PolarWorldLogo size={80} theme={theme} />
          </motion.div>

          {/* Right polarizer */}
          <AnimatedPolarizer theme={theme} />
        </motion.div>

        {/* Polarization wave animation */}
        <motion.div
          className="w-full max-w-2xl px-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <PolarizationWave theme={theme} />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mb-4"
        >
          <span className={cn(
            'text-xs px-4 py-1.5 rounded-full font-medium',
            theme === 'dark'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
          )}>
            {t('home.courseBanner.badge')}
          </span>
        </motion.div>

        {/* Main Title - Centered */}
        <motion.h1
          className={cn(
            'text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-6 px-4',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <span className={cn(
            'bg-clip-text text-transparent',
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400'
              : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600'
          )}>
            {t('home.courseBanner.title')}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className={cn(
            'text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-8 px-6 text-center leading-relaxed',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {t('home.courseBanner.description')}
        </motion.p>

        {/* Module links - Secondary CTAs */}
        <motion.div
          className="flex items-center justify-center gap-2 px-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          {MODULE_ENTRIES.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 + index * 0.1 }}
            >
              <Link
                to={module.link}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105',
                  theme === 'dark'
                    ? 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
                )}
              >
                <span style={{ color: module.color }}>{module.icon}</span>
                <span>{isZh ? module.titleZh : module.titleEn}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ================================================================== */}
        {/* Demo Gallery Portal Entrance - 偏振演示馆入口 */}
        {/* ================================================================== */}
        <motion.div
          className="w-full max-w-5xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          {/* Portal Container */}
          <div className={cn(
            'relative rounded-3xl overflow-hidden',
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-800/90 border border-slate-700/50'
              : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 border border-gray-200/50'
          )}
          style={{
            boxShadow: theme === 'dark'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(34, 211, 238, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(34, 211, 238, 0.1)'
          }}
          >
            {/* Animated Background Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]"
                style={{
                  background: `radial-gradient(ellipse, ${theme === 'dark' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(34, 211, 238, 0.1)'} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Animated light beams */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 h-0.5 origin-left"
                  style={{
                    width: '150px',
                    background: `linear-gradient(90deg, ${['#ff4444', '#ffaa00', '#44ff44', '#4488ff'][i]}60, transparent)`,
                    transform: `translate(-50%, -50%) rotate(${i * 90 + 45}deg)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    width: ['150px', '200px', '150px'],
                  }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>

            {/* Portal Header with Enter Button */}
            <div className="relative z-10 p-6 pb-4 text-center">
              {/* Badge */}
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-medium',
                theme === 'dark'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/30'
              )}>
                <div className="flex gap-1">
                  {['#ff4444', '#ffaa00', '#44ff44', '#4488ff'].map((color, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span>{isZh ? '偏振演示馆' : 'Polarization Demo Gallery'}</span>
              </div>

              {/* Main Entry Button */}
              <Link
                to="/demos"
                className={cn(
                  'group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg',
                  'transition-all duration-300 hover:scale-105',
                  'bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white',
                  'shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50'
                )}
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </motion.div>
                <span>{isZh ? '进入偏振演示馆' : 'Enter Demo Gallery'}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/20">20+</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                {[
                  { value: '6', label: isZh ? '展厅' : 'Halls' },
                  { value: '17+', label: isZh ? '演示' : 'Demos' },
                  { value: '3', label: isZh ? '难度' : 'Levels' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className={cn(
                      'font-bold',
                      theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                    )}>
                      {stat.value}
                    </span>
                    <span className={cn(
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exhibition Halls Grid - 展厅导览 */}
            <div className="relative z-10 px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn(
                  'text-base font-semibold flex items-center gap-2',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  <Layers className="w-4 h-4 text-cyan-500" />
                  {isZh ? '展厅导览' : 'Exhibition Halls'}
                </h3>
                <span className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '选择展厅开始探索' : 'Select a hall to explore'}
                </span>
              </div>

              {/* Halls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {EXHIBITION_HALLS.map((hall, index) => {
                  const IconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
                    'optical-basics': Lightbulb,
                    'polarization-fundamentals': Waves,
                    'interface-reflection': Layers,
                    'transparent-media': FlaskConical,
                    'scattering': Atom,
                    'polarimetry': Microscope,
                  }
                  const Icon = IconMap[hall.id] || Eye

                  return (
                    <motion.div
                      key={hall.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.4 + index * 0.1 }}
                    >
                      <Link
                        to={`/demos/${hall.demos[0]}`}
                        className={cn(
                          'group relative block rounded-xl overflow-hidden p-4',
                          'transition-all duration-300 hover:scale-[1.02]',
                          theme === 'dark'
                            ? 'bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600'
                            : 'bg-white/80 hover:bg-white border border-gray-200/80 hover:border-gray-300'
                        )}
                        style={{
                          boxShadow: `0 0 0 0 ${hall.color}00`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 8px 24px -8px ${hall.glowColor}, 0 0 0 1px ${hall.color}40`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 0 ${hall.color}00`
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={cn(
                              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                              'transition-all duration-300 group-hover:scale-110'
                            )}
                            style={{ backgroundColor: `${hall.color}15` }}
                          >
                            <Icon
                              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6"
                              style={{ color: hall.color }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${hall.color}20`, color: hall.color }}
                              >
                                Unit {hall.unit}
                              </span>
                              <span className={cn(
                                'text-[10px]',
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              )}>
                                {hall.demos.length} demos
                              </span>
                            </div>
                            <h4 className={cn(
                              'text-sm font-semibold truncate',
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            )}>
                              {t(hall.titleKey)}
                            </h4>
                            <p className={cn(
                              'text-xs line-clamp-1 mt-0.5',
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            )}>
                              {t(hall.subtitleKey)}
                            </p>
                          </div>

                          {/* Arrow */}
                          <ChevronRight
                            className={cn(
                              'flex-shrink-0 w-4 h-4 transition-all duration-300',
                              'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            )}
                            style={{ color: hall.color }}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <ScrollIndicator theme={theme} onClick={scrollToContent} />
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT SECTION - 主内容区 */}
      {/* ================================================================== */}
      <main ref={contentRef} className="px-4 lg:px-8 py-12">

        {/* Knowledge Prism - 知识棱镜 */}
        <div className="max-w-6xl mx-auto mb-8">
          <OpticalOverviewDiagram />
        </div>

        {/* Category filters - 分类筛选 */}
        <div className={cn(
          'flex flex-wrap items-center justify-center gap-2 mb-6 p-3 rounded-xl max-w-xl mx-auto',
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
            'flex items-center justify-center gap-2 mb-6 p-3 rounded-xl max-w-xl mx-auto',
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

        {/* Two-column layout: Course Outline | Unified Timeline */}
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Two columns */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Column 1: Course Outline */}
            <div className="sticky top-20 h-fit">
              <CourseOutlineColumn
                theme={theme}
                isZh={isZh}
                activeUnitId={activeUnitId}
                onUnitClick={handleUnitClick}
              />
            </div>

            {/* Column 2: Unified Timeline with center axis */}
            <div className={cn(
              'rounded-2xl border overflow-hidden',
              theme === 'dark'
                ? 'bg-slate-800/30 border-slate-700'
                : 'bg-white/80 border-gray-200'
            )}>
              {/* Timeline header with track legends */}
              <div className={cn(
                'sticky top-14 z-10 px-4 py-3 border-b backdrop-blur-sm',
                theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-gray-50/80 border-gray-200'
              )}>
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                    <span className={cn('font-semibold text-sm', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                      {isZh ? '广义光学' : 'General Optics'}
                    </span>
                  </div>
                  <div className={cn(
                    'w-px h-6',
                    theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                  )} />
                  <div className="flex items-center gap-2">
                    <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                    <span className={cn('font-semibold text-sm', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                      {isZh ? '偏振光' : 'Polarization'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline content */}
              <div className="p-6 relative">
                {/* Central timeline line */}
                <div
                  className={cn(
                    'absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2',
                    theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                  )}
                />

                {/* Timeline events grouped by year */}
                <div className="relative space-y-8">
                  {years.map(year => {
                    const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                    const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')

                    if (opticsEvents.length === 0 && polarizationEvents.length === 0) return null

                    return (
                      <div key={year} className="relative">
                        {/* Year marker in center */}
                        <div className="flex items-center justify-center mb-4">
                          <div className={cn(
                            'relative z-10 px-4 py-2 rounded-full font-bold text-lg border-2',
                            theme === 'dark'
                              ? 'bg-slate-800 border-amber-500/50 text-amber-400'
                              : 'bg-white border-amber-400 text-amber-600'
                          )}
                          style={{
                            boxShadow: theme === 'dark'
                              ? '0 0 20px rgba(245, 158, 11, 0.2)'
                              : '0 0 20px rgba(245, 158, 11, 0.15)'
                          }}
                          >
                            {year}
                          </div>
                        </div>

                        {/* Events row: Left (Optics) | Center line | Right (Polarization) */}
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
                          {/* Left column: Optics events */}
                          <div className="space-y-3 pr-4">
                            {opticsEvents.map(event => (
                              <div key={`${event.year}-${event.titleEn}`} className="flex justify-end">
                                {/* Connector line */}
                                <div className="relative flex items-start w-full">
                                  <div className="flex-1">
                                    <TimelineEventCard
                                      event={event}
                                      theme={theme}
                                      isZh={isZh}
                                      isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                                      onToggle={() => setExpandedEventKey(
                                        expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                                      )}
                                      relatedUnit={findRelatedUnit(event)}
                                    />
                                  </div>
                                  {/* Horizontal connector */}
                                  <div className={cn(
                                    'absolute right-0 top-6 w-4 h-0.5 translate-x-full',
                                    theme === 'dark' ? 'bg-amber-500/50' : 'bg-amber-400/70'
                                  )} />
                                </div>
                              </div>
                            ))}
                            {opticsEvents.length === 0 && polarizationEvents.length > 0 && (
                              <div className="h-full" /> // Spacer for alignment
                            )}
                          </div>

                          {/* Center column: Connection dots */}
                          <div className="flex flex-col items-center w-4">
                            {/* Optics dots */}
                            {opticsEvents.map((event, idx) => (
                              <div
                                key={`dot-optics-${event.titleEn}`}
                                className={cn(
                                  'w-3 h-3 rounded-full border-2 z-10',
                                  theme === 'dark'
                                    ? 'bg-amber-500 border-amber-300'
                                    : 'bg-amber-400 border-amber-200'
                                )}
                                style={{
                                  marginTop: idx === 0 ? '20px' : '60px',
                                  boxShadow: `0 0 8px ${theme === 'dark' ? '#f59e0b' : '#fbbf24'}`
                                }}
                              />
                            ))}
                            {/* Polarization dots */}
                            {polarizationEvents.map((event, idx) => (
                              <div
                                key={`dot-polar-${event.titleEn}`}
                                className={cn(
                                  'w-3 h-3 rounded-full border-2 z-10',
                                  theme === 'dark'
                                    ? 'bg-cyan-500 border-cyan-300'
                                    : 'bg-cyan-400 border-cyan-200'
                                )}
                                style={{
                                  marginTop: idx === 0 && opticsEvents.length === 0 ? '20px' : '60px',
                                  boxShadow: `0 0 8px ${theme === 'dark' ? '#22d3ee' : '#67e8f9'}`
                                }}
                              />
                            ))}
                          </div>

                          {/* Right column: Polarization events */}
                          <div className="space-y-3 pl-4">
                            {polarizationEvents.map(event => (
                              <div key={`${event.year}-${event.titleEn}`} className="relative">
                                {/* Horizontal connector */}
                                <div className={cn(
                                  'absolute left-0 top-6 w-4 h-0.5 -translate-x-full',
                                  theme === 'dark' ? 'bg-cyan-500/50' : 'bg-cyan-400/70'
                                )} />
                                <TimelineEventCard
                                  event={event}
                                  theme={theme}
                                  isZh={isZh}
                                  isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                                  onToggle={() => setExpandedEventKey(
                                    expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                                  )}
                                  relatedUnit={findRelatedUnit(event)}
                                />
                              </div>
                            ))}
                            {polarizationEvents.length === 0 && opticsEvents.length > 0 && (
                              <div className="h-full" /> // Spacer for alignment
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Empty state */}
                  {filteredEvents.length === 0 && (
                    <div className={cn(
                      'text-center py-12',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{isZh ? '没有匹配的事件' : 'No matching events'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Single column with unified timeline */}
          <div className="lg:hidden space-y-6">
            {/* Course outline (collapsible on mobile) */}
            <CourseOutlineColumn
              theme={theme}
              isZh={isZh}
              activeUnitId={activeUnitId}
              onUnitClick={handleUnitClick}
            />

            {/* Track legend for mobile */}
            <div className={cn(
              'flex items-center justify-center gap-6 p-3 rounded-xl',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
            )}>
              <div className="flex items-center gap-2">
                <Sun className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                  {isZh ? '广义光学' : 'General Optics'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className={cn('w-4 h-4', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                  {isZh ? '偏振光' : 'Polarization'}
                </span>
              </div>
            </div>

            {/* Timeline events with center line */}
            <div className="relative pl-8">
              {/* Center timeline line */}
              <div
                className={cn(
                  'absolute left-4 top-0 bottom-0 w-0.5',
                  theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                )}
              />

              <div className="space-y-6">
                {years.map(year => {
                  const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                  const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                  const hasOptics = opticsEvents.length > 0
                  const hasPolarization = polarizationEvents.length > 0

                  if (!hasOptics && !hasPolarization) return null

                  return (
                    <div key={year} className="relative">
                      {/* Year marker */}
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={cn(
                            'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 z-10',
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
                          )}
                          style={{ left: 0, transform: 'translateX(-50%)' }}
                        >
                          {String(year).slice(-2)}
                        </div>
                        <span className={cn(
                          'text-lg font-bold ml-6',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {year}
                        </span>
                      </div>

                      {/* Events for this year */}
                      <div className="space-y-3">
                        {/* Optics events first */}
                        {opticsEvents.map(event => (
                          <div key={`${event.year}-${event.titleEn}`} className="relative">
                            {/* Connector dot */}
                            <div
                              className={cn(
                                'absolute w-3 h-3 rounded-full border-2 z-10',
                                theme === 'dark'
                                  ? 'bg-amber-500 border-amber-300'
                                  : 'bg-amber-400 border-amber-200'
                              )}
                              style={{
                                left: '-24px',
                                top: '20px',
                                boxShadow: `0 0 6px ${theme === 'dark' ? '#f59e0b' : '#fbbf24'}`
                              }}
                            />
                            <TimelineEventCard
                              event={event}
                              theme={theme}
                              isZh={isZh}
                              isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                              onToggle={() => setExpandedEventKey(
                                expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                              )}
                              relatedUnit={findRelatedUnit(event)}
                            />
                          </div>
                        ))}
                        {/* Then polarization events */}
                        {polarizationEvents.map(event => (
                          <div key={`${event.year}-${event.titleEn}`} className="relative">
                            {/* Connector dot */}
                            <div
                              className={cn(
                                'absolute w-3 h-3 rounded-full border-2 z-10',
                                theme === 'dark'
                                  ? 'bg-cyan-500 border-cyan-300'
                                  : 'bg-cyan-400 border-cyan-200'
                              )}
                              style={{
                                left: '-24px',
                                top: '20px',
                                boxShadow: `0 0 6px ${theme === 'dark' ? '#22d3ee' : '#67e8f9'}`
                              }}
                            />
                            <TimelineEventCard
                              event={event}
                              theme={theme}
                              isZh={isZh}
                              isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                              onToggle={() => setExpandedEventKey(
                                expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                              )}
                              relatedUnit={findRelatedUnit(event)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Empty state */}
              {filteredEvents.length === 0 && (
                <div className={cn(
                  'text-center py-12',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{isZh ? '没有匹配的事件' : 'No matching events'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Polarization Comparison Demo - 偏振演示 */}
        <div className="mt-12 max-w-7xl mx-auto">
          <PolarizationComparison />
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
  )
}

export default HomePage
