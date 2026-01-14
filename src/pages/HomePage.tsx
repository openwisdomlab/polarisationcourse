/**
 * HomePage - 光的编年史首页
 * 首页 = 时间线为核心内容
 *
 * 架构：
 * 1. 顶部导航栏（logo + 学习模块）
 * 2. 两栏布局：课程大纲 + 统一时间轴（中央年份标记，左侧广义光学，右侧偏振光）
 *
 * 注：知识棱镜（光学全景图）已移至 DemosPage.tsx 演示馆页面
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { GlobalSearch } from '@/components/shared/GlobalSearch'
import { PolarizationComparison } from '@/components/shared/PolarizationComparison'
// PuzzleGate 已移至 App.tsx 进行全局访问验证
import { getShowcaseItems } from '@/utils/gallery-showcase'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  BookOpen,
  Sun,
  Sparkles,
  Lightbulb,
  Menu,
  X,
  Users,
  Palette,
  ArrowRight,
  Search,
  Layers,
  Play,
  RefreshCw,
} from 'lucide-react'

// Extracted HomePage components
import { FloatingParticle, PolarizationWave, AnimatedPolarizer, LightBeamEffect, ScrollIndicator } from '@/components/home/animations'
import { CourseOutlineColumn, TimelineEventCard } from '@/components/home/timeline'

// Data imports
import { TIMELINE_EVENTS, type TimelineEvent } from '@/data/timeline'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'
import {
  COURSE_TIMELINE_MAPPINGS,
  HISTORICAL_ERAS,
  PSRT_QUESTIONS,
  type CourseTimelineMapping,
} from '@/data/course-timeline-integration'

// ============================================================================
// Randomized Showcase Component - 随机展厅导览
// ============================================================================

interface RandomizedShowcaseProps {
  theme: 'dark' | 'light'
  isZh: boolean
}

function RandomizedShowcase({ theme, isZh }: RandomizedShowcaseProps) {
  // Get showcase items (cached for 1 hour) - 3 items with balanced difficulty
  const showcaseItems = useMemo(() => getShowcaseItems(3), [])

  return (
    <div className="relative z-10 px-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          'text-base font-semibold flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <Sparkles className="w-4 h-4 text-cyan-500" />
          {isZh ? '随机推荐演示' : 'Random Demo Picks'}
        </h3>
        <div className="flex items-center gap-2">
          <RefreshCw className={cn(
            'w-3 h-3',
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          )} />
          <span className={cn(
            'text-xs',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            {isZh ? '每小时更新' : 'Hourly refresh'}
          </span>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {showcaseItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 + index * 0.1 }}
            >
              <Link
                to={item.link}
                className={cn(
                  'group relative block rounded-xl overflow-hidden p-4',
                  'transition-all duration-300 hover:scale-[1.02]',
                  theme === 'dark'
                    ? 'bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600'
                    : 'bg-white/80 hover:bg-white border border-gray-200/80 hover:border-gray-300'
                )}
                style={{
                  boxShadow: `0 0 0 0 ${item.color}00`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 24px -8px ${item.glowColor}, 0 0 0 1px ${item.color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${item.color}00`
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      'transition-all duration-300 group-hover:scale-110'
                    )}
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6"
                      style={{ color: item.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        {isZh ? item.badgeZh : item.badge}
                      </span>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5',
                        theme === 'dark' ? 'bg-slate-700/50 text-gray-500' : 'bg-gray-100 text-gray-400'
                      )}>
                        <RefreshCw className="w-2.5 h-2.5" />
                        {isZh ? '随机' : 'Random'}
                      </span>
                    </div>
                    <h4 className={cn(
                      'text-sm font-semibold truncate',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? item.titleZh : item.titleEn}
                    </h4>
                    <p className={cn(
                      'text-xs line-clamp-1 mt-0.5',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {isZh ? item.descriptionZh : item.descriptionEn}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className={cn(
                      'flex-shrink-0 w-4 h-4 transition-all duration-300',
                      'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}
                    style={{ color: item.color }}
                  />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

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
    id: 'lab',
    titleZh: '虚拟课题组',
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
  id: 'all' | 'discovery' | 'theory'
  labelZh: string
  labelEn: string
  icon: React.ReactNode
  color: string
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', labelZh: '全部', labelEn: 'All', icon: <Layers className="w-4 h-4" />, color: '#64748b' },
  { id: 'discovery', labelZh: '发现', labelEn: 'Discovery', icon: <Search className="w-4 h-4" />, color: '#8B5CF6' },
  { id: 'theory', labelZh: '理论', labelEn: 'Theory', icon: <Lightbulb className="w-4 h-4" />, color: '#3B82F6' },
]

// ============================================================================
// Course Outline Column - 课程大纲列（用于三栏布局）
// ============================================================================

// ============================================================================
// Timeline Event Card - 时间线事件卡片
// ============================================================================

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


// Polarization wave animation - 展示Ex和Ey正交电场分量

// Animated polarizer icon - 真实的线性偏振片表示
// angle: 0° (水平) 或 90° (垂直)

// Light beam effect

// Scroll indicator

// Generate random particles
function generateParticles(count: number, theme: 'dark' | 'light'): ParticleProps[] {
  const colors = theme === 'dark'
    ? ['#22d3ee', '#a855f7', '#3b82f6', '#8b5cf6', '#22c55e']
    : ['#0891b2', '#7c3aed', '#2563eb', '#6d28d9', '#16a34a']

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

  // 全局访问验证已移至 App.tsx

  const [activeUnitId, setActiveUnitId] = useState<string | null>(null)
  const [activeYears, setActiveYears] = useState<number[] | null>(null)
  const [expandedEventKey, setExpandedEventKey] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'discovery' | 'theory'>('all')
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

  // Helper to get century from year
  const getCentury = useCallback((year: number): number => {
    return Math.floor(year / 100) + 1
  }, [])

  // Get century label
  const getCenturyLabel = useCallback((century: number, isZh: boolean): string => {
    const centuryLabels: Record<number, { en: string; zh: string }> = {
      17: { en: '17th Century', zh: '17世纪' },
      18: { en: '18th Century', zh: '18世纪' },
      19: { en: '19th Century', zh: '19世纪' },
      20: { en: '20th Century', zh: '20世纪' },
      21: { en: '21st Century', zh: '21世纪' },
    }
    return centuryLabels[century]?.[isZh ? 'zh' : 'en'] || `${century}th Century`
  }, [])

  // Track which centuries have been displayed
  const getDisplayedCenturies = useMemo(() => {
    const centuryYears = new Map<number, number>() // century -> first year in that century
    years.forEach(year => {
      const century = Math.floor(year / 100) + 1
      if (!centuryYears.has(century)) {
        centuryYears.set(century, year)
      }
    })
    return centuryYears
  }, [years])

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
        ? 'bg-gradient-to-br from-[#0f0d1a] via-[#1a1a3a] to-[#0f0d2a]'
        : 'bg-gradient-to-br from-[#f0f4ff] via-[#e8eeff] to-[#f5f0ff]'
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
              {/* Global Search */}
              <GlobalSearch />
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
          {/* Search and Language/Theme switcher in hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 right-4 flex items-center gap-2"
          >
            <GlobalSearch />
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
          {/* Left polarizer - 0° 水平偏振 */}
          <AnimatedPolarizer theme={theme} angle={0} />

          {/* Center logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <PolarWorldLogo size={80} theme={theme} />
          </motion.div>

          {/* Right polarizer - 90° 垂直偏振 */}
          <AnimatedPolarizer theme={theme} angle={90} />
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
            </div>

            {/* Exhibition Halls Grid - 展厅导览（随机推荐） */}
            <RandomizedShowcase theme={theme} isZh={isZh} />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <ScrollIndicator theme={theme} onClick={scrollToContent} isZh={isZh} />
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT SECTION - 主内容区 */}
      {/* ================================================================== */}
      <main ref={contentRef} className="px-4 lg:px-8 py-12">

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
                'sticky top-14 z-10 px-6 py-3 border-b backdrop-blur-sm',
                theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-gray-50/80 border-gray-200'
              )}>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
                  {/* Left column: General Optics label centered */}
                  <div className="flex items-center justify-center gap-2">
                    <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
                    <span className={cn('font-semibold text-sm', theme === 'dark' ? 'text-violet-400' : 'text-violet-700')}>
                      {isZh ? '广义光学' : 'General Optics'}
                    </span>
                  </div>
                  {/* Center spacer - matches center column width of events */}
                  <div className="w-4" />
                  {/* Right column: Polarization label centered */}
                  <div className="flex items-center justify-center gap-2">
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
                  {years.map((year, yearIndex) => {
                    const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                    const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')

                    if (opticsEvents.length === 0 && polarizationEvents.length === 0) return null

                    // Check if this is the first year of a new century
                    const century = getCentury(year)
                    const isFirstYearOfCentury = getDisplayedCenturies.get(century) === year
                    const prevYear = yearIndex > 0 ? years[yearIndex - 1] : null
                    const prevCentury = prevYear ? getCentury(prevYear) : null
                    const showCenturyMarker = isFirstYearOfCentury && century !== prevCentury

                    return (
                      <div key={year} className="relative">
                        {/* Century marker - only show at the start of each century */}
                        {showCenturyMarker && (
                          <div className="flex items-center justify-center mt-4 mb-8">
                            <div className={cn(
                              'relative z-10 px-4 py-1.5 rounded-full font-semibold text-sm border',
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-violet-900/80 to-purple-900/80 border-violet-500/50 text-violet-300'
                                : 'bg-gradient-to-r from-violet-100 to-purple-100 border-violet-400 text-violet-700'
                            )}
                            style={{
                              boxShadow: theme === 'dark'
                                ? '0 0 16px rgba(139, 92, 246, 0.2)'
                                : '0 0 12px rgba(139, 92, 246, 0.15)'
                            }}
                            >
                              {getCenturyLabel(century, isZh)}
                            </div>
                          </div>
                        )}

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
                                    theme === 'dark' ? 'bg-violet-500/50' : 'bg-violet-400/70'
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
                                    ? 'bg-violet-500 border-violet-300'
                                    : 'bg-violet-400 border-violet-200'
                                )}
                                style={{
                                  marginTop: idx === 0 ? '20px' : '60px',
                                  boxShadow: `0 0 8px ${theme === 'dark' ? '#8b5cf6' : '#a78bfa'}`
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
                <Sun className={cn('w-4 h-4', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
                <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-violet-400' : 'text-violet-700')}>
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
                {years.map((year, yearIndex) => {
                  const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                  const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                  const hasOptics = opticsEvents.length > 0
                  const hasPolarization = polarizationEvents.length > 0

                  if (!hasOptics && !hasPolarization) return null

                  // Check if this is the first year of a new century (for mobile)
                  const century = getCentury(year)
                  const isFirstYearOfCentury = getDisplayedCenturies.get(century) === year
                  const prevYear = yearIndex > 0 ? years[yearIndex - 1] : null
                  const prevCentury = prevYear ? getCentury(prevYear) : null
                  const showCenturyMarker = isFirstYearOfCentury && century !== prevCentury

                  return (
                    <div key={year} className="relative">
                      {/* Century marker - only at start of each century (mobile) */}
                      {showCenturyMarker && (
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={cn(
                              'absolute left-0 px-3 py-1.5 rounded-full flex items-center justify-center font-bold text-xs border-2 z-10',
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-violet-900/80 to-purple-900/80 border-violet-500/60 text-violet-300'
                                : 'bg-gradient-to-r from-violet-100 to-purple-100 border-violet-400 text-violet-700'
                            )}
                            style={{ left: 0, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
                          >
                            {getCenturyLabel(century, isZh)}
                          </div>
                        </div>
                      )}

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
                                  ? 'bg-violet-500 border-violet-300'
                                  : 'bg-violet-400 border-violet-200'
                              )}
                              style={{
                                left: '-24px',
                                top: '20px',
                                boxShadow: `0 0 6px ${theme === 'dark' ? '#8b5cf6' : '#a78bfa'}`
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
            {isZh ? '© 2025 深圳零一学院 Supported by 开放智慧实验室' : '© 2025 X-Institute · Supported by Open Wisdom Lab'}
          </p>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
