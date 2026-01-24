import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { LightBeamEffect, type ModuleEffectType } from '@/components/effects'
import { Footer } from '@/components/shared/Footer'
import {
  PolarCraftLogo,
  HistoryModuleIcon,
  ArsenalModuleIcon,
  TheoryModuleIcon,
  GamesModuleIcon,
  GalleryModuleIcon,
  ResearchModuleIcon,
} from '@/components/icons'
import { BookOpen, GraduationCap, FlaskConical, ChevronRight } from 'lucide-react'

// Icon component type for animated module icons
type AnimatedIconComponent = React.ComponentType<{
  className?: string
  size?: number
  isHovered?: boolean
  theme?: 'dark' | 'light'
}>

// Module configuration for the 6 core modules
interface ModuleConfig {
  id: string
  titleKey: string
  titleZhKey: string
  subtitleKey: string
  descriptionKey: string
  path: string
  IconComponent: AnimatedIconComponent
  colorTheme: {
    bg: string
    bgHover: string
    border: string
    borderHover: string
    iconBg: string
    iconColor: string
    shadow: string
    glowColor: string
  }
}

const MODULES: ModuleConfig[] = [
  {
    // 1. 光的编年史 (Chronicles of Light)
    // 历史故事 × 经典实验
    id: 'history',
    titleKey: 'home.modules.history.title',
    titleZhKey: 'home.modules.history.titleZh',
    subtitleKey: 'home.modules.history.subtitle',
    descriptionKey: 'home.modules.history.description',
    path: '/chronicles',  // Direct to chronicles page
    IconComponent: HistoryModuleIcon,
    colorTheme: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      bgHover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
      border: 'border-amber-200 dark:border-amber-800/50',
      borderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
      iconBg: 'bg-amber-100/50 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      shadow: 'hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30',
      glowColor: 'amber',
    },
  },
  {
    // 2. 光学设计室 (Optical Design Studio)
    // 偏振器件 × 光路设计
    id: 'arsenal',
    titleKey: 'home.modules.arsenal.title',
    titleZhKey: 'home.modules.arsenal.titleZh',
    subtitleKey: 'home.modules.arsenal.subtitle',
    descriptionKey: 'home.modules.arsenal.description',
    path: '/studio',  // Direct to optical studio
    IconComponent: ArsenalModuleIcon,
    colorTheme: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      bgHover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/40',
      border: 'border-cyan-200 dark:border-cyan-800/50',
      borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-600',
      iconBg: 'bg-cyan-100/50 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      shadow: 'hover:shadow-cyan-200/50 dark:hover:shadow-cyan-900/30',
      glowColor: 'cyan',
    },
  },
  {
    // 3. 偏振演示馆 (Demo Gallery)
    // 基础理论 × 计算模拟
    id: 'theory',
    titleKey: 'home.modules.theory.title',
    titleZhKey: 'home.modules.theory.titleZh',
    subtitleKey: 'home.modules.theory.subtitle',
    descriptionKey: 'home.modules.theory.description',
    path: '/demos',  // Direct to demos page
    IconComponent: TheoryModuleIcon,
    colorTheme: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      bgHover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
      border: 'border-indigo-200 dark:border-indigo-800/50',
      borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-600',
      iconBg: 'bg-indigo-100/50 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      shadow: 'hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/30',
      glowColor: 'indigo',
    },
  },
  {
    // 4. 偏振光探秘 (PolarQuest - Games)
    // 解谜游戏 × 偏振策略
    id: 'games',
    titleKey: 'home.modules.games.title',
    titleZhKey: 'home.modules.games.titleZh',
    subtitleKey: 'home.modules.games.subtitle',
    descriptionKey: 'home.modules.games.description',
    path: '/games',  // Games hub
    IconComponent: GamesModuleIcon,
    colorTheme: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      bgHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
      iconBg: 'bg-emerald-100/50 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30',
      glowColor: 'emerald',
    },
  },
  {
    // 5. 偏振造物局 (Creative Gallery)
    // 偏振艺术 × 文创作品
    id: 'gallery',
    titleKey: 'home.modules.gallery.title',
    titleZhKey: 'home.modules.gallery.titleZh',
    subtitleKey: 'home.modules.gallery.subtitle',
    descriptionKey: 'home.modules.gallery.description',
    path: '/gallery',  // Direct to gallery/experiments
    IconComponent: GalleryModuleIcon,
    colorTheme: {
      bg: 'bg-pink-50 dark:bg-pink-950/30',
      bgHover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40',
      border: 'border-pink-200 dark:border-pink-800/50',
      borderHover: 'hover:border-pink-400 dark:hover:border-pink-600',
      iconBg: 'bg-pink-100/50 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      shadow: 'hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30',
      glowColor: 'pink',
    },
  },
  {
    // 6. 虚拟课题组 (Virtual Research Lab)
    // 开放研究 × 课题实践
    id: 'research',
    titleKey: 'home.modules.research.title',
    titleZhKey: 'home.modules.research.titleZh',
    subtitleKey: 'home.modules.research.subtitle',
    descriptionKey: 'home.modules.research.description',
    path: '/research',  // Direct to research lab
    IconComponent: ResearchModuleIcon,
    colorTheme: {
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      bgHover: 'hover:bg-teal-100 dark:hover:bg-teal-900/40',
      border: 'border-teal-200 dark:border-teal-800/50',
      borderHover: 'hover:border-teal-400 dark:hover:border-teal-600',
      iconBg: 'bg-teal-100/50 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      shadow: 'hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30',
      glowColor: 'teal',
    },
  },
]

// Glow effect configuration for each color theme
const GLOW_STYLES: Record<string, string> = {
  amber: 'rgba(251, 191, 36, 0.4)',
  cyan: 'rgba(34, 211, 238, 0.4)',
  indigo: 'rgba(129, 140, 248, 0.4)',
  emerald: 'rgba(52, 211, 153, 0.4)',
  pink: 'rgba(244, 114, 182, 0.4)',
  teal: 'rgba(45, 212, 191, 0.4)',
}

// Module Card Component with hover interactions
function ModuleCard({
  module,
  theme,
  onHoverStart,
  onHoverEnd,
  cardRef,
}: {
  module: ModuleConfig
  theme: 'dark' | 'light'
  onHoverStart: () => void
  onHoverEnd: () => void
  cardRef: React.RefObject<HTMLAnchorElement | null>
}) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = module.IconComponent

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHoverStart()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHoverEnd()
  }

  return (
    <Link
      ref={cardRef}
      to={module.path}
      className={`
        group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500
        ${module.colorTheme.bg} ${module.colorTheme.bgHover}
        ${module.colorTheme.border} ${module.colorTheme.borderHover}
        hover:-translate-y-3 hover:shadow-2xl ${module.colorTheme.shadow}
        overflow-hidden
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${GLOW_STYLES[module.colorTheme.glowColor]} 0%, transparent 60%)`,
        }}
      />

      {/* Light beam decoration on hover */}
      <div
        className={`
          absolute -top-20 -right-20 w-40 h-40 rounded-full
          transition-all duration-700 pointer-events-none
          ${isHovered ? 'opacity-30 scale-100' : 'opacity-0 scale-50'}
        `}
        style={{
          background: `conic-gradient(from 0deg, ${GLOW_STYLES[module.colorTheme.glowColor]}, transparent, ${GLOW_STYLES[module.colorTheme.glowColor]})`,
        }}
      />

      {/* Animated Icon */}
      <div
        className={`
          relative w-16 h-16 rounded-xl flex items-center justify-center mb-4
          ${module.colorTheme.iconBg}
          transition-all duration-500
          ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
        `}
      >
        <IconComponent
          size={56}
          isHovered={isHovered}
          theme={theme}
        />

        {/* Pulse ring effect on hover */}
        <div
          className={`
            absolute inset-0 rounded-xl border-2
            ${module.colorTheme.border}
            transition-all duration-500 pointer-events-none
            ${isHovered ? 'scale-125 opacity-0' : 'scale-100 opacity-0'}
          `}
        />
      </div>

      {/* Title with subtle animation - "Trace · 追溯" format */}
      <h3
        className={`
          text-lg font-bold text-gray-900 dark:text-white mb-1
          transition-all duration-300
          ${isHovered ? 'translate-x-1' : 'translate-x-0'}
        `}
      >
        {t(module.titleKey)} · {t(module.titleZhKey)}
      </h3>

      {/* Subtitle - original module category */}
      <span
        className={`
          text-xs font-medium mb-2 block
          ${module.colorTheme.iconColor}
          opacity-80
        `}
      >
        {t(module.subtitleKey)}
      </span>

      {/* Description */}
      <p
        className={`
          text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1
          transition-all duration-300
          ${isHovered ? 'text-gray-700 dark:text-gray-300' : ''}
        `}
      >
        {t(module.descriptionKey)}
      </p>

      {/* Arrow indicator with enhanced animation */}
      <div
        className={`
          mt-4 flex items-center text-sm font-medium
          ${module.colorTheme.iconColor}
          transition-all duration-300
        `}
      >
        <span
          className={`
            transition-all duration-300
            ${isHovered ? 'mr-2' : 'mr-0'}
          `}
        >
          {t('common.explore')}
        </span>
        <svg
          className={`
            w-4 h-4 transition-all duration-300
            ${isHovered ? 'translate-x-2 scale-110' : 'translate-x-0 scale-100'}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>

        {/* Trail effect on hover */}
        <svg
          className={`
            w-4 h-4 absolute transition-all duration-500
            ${isHovered ? 'translate-x-4 opacity-30' : 'translate-x-0 opacity-0'}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ marginLeft: '1rem' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Corner light beam decoration */}
      <div
        className={`
          absolute bottom-0 left-0 w-full h-1
          transition-all duration-500 pointer-events-none
          ${isHovered ? 'opacity-60' : 'opacity-0'}
        `}
        style={{
          background: `linear-gradient(90deg, transparent, ${GLOW_STYLES[module.colorTheme.glowColor]}, transparent)`,
        }}
      />
    </Link>
  )
}

// Course section configuration
interface CourseItem {
  id: string
  titleKey: string
  titleZhKey: string
  descriptionKey: string
  descriptionZhKey: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  status: 'active' | 'coming-soon'
  badge?: string
  badgeZh?: string
  units?: number
  demos?: number
}

const COURSES: CourseItem[] = [
  {
    id: 'psrt',
    titleKey: 'home.course.psrt.title',
    titleZhKey: 'home.course.psrt.titleZh',
    descriptionKey: 'home.course.psrt.description',
    descriptionZhKey: 'home.course.psrt.descriptionZh',
    path: '/course',
    icon: GraduationCap,
    status: 'active',
    badge: 'P-SRT',
    badgeZh: 'P-SRT',
    units: 5,
    demos: 17,
  },
  {
    id: 'esrt',
    titleKey: 'home.course.esrt.title',
    titleZhKey: 'home.course.esrt.titleZh',
    descriptionKey: 'home.course.esrt.description',
    descriptionZhKey: 'home.course.esrt.descriptionZh',
    path: '/learn',
    icon: FlaskConical,
    status: 'coming-soon',
    badge: 'E-SRT',
    badgeZh: 'E-SRT',
  },
  {
    id: 'oric',
    titleKey: 'home.course.oric.title',
    titleZhKey: 'home.course.oric.titleZh',
    descriptionKey: 'home.course.oric.description',
    descriptionZhKey: 'home.course.oric.descriptionZh',
    path: '/research',
    icon: BookOpen,
    status: 'coming-soon',
    badge: 'ORIC',
    badgeZh: 'ORIC',
  },
]

// Course card component
function CourseCard({
  course,
  featured = false,
}: {
  course: CourseItem
  featured?: boolean
}) {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'
  const Icon = course.icon
  const isComingSoon = course.status === 'coming-soon'

  const cardContent = (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-300
        ${featured ? 'p-6 lg:p-8' : 'p-5'}
        ${
          isComingSoon
            ? `border-dashed cursor-not-allowed opacity-60 ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800/30'
                  : 'border-gray-300 bg-gray-50'
              }`
            : `hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                theme === 'dark'
                  ? 'border-blue-500/30 bg-gradient-to-br from-blue-950/50 to-purple-950/50 hover:border-blue-500/60'
                  : 'border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 hover:border-blue-400 hover:shadow-blue-500/10'
              }`
        }
      `}
    >
      {/* Background decoration */}
      {!isComingSoon && (
        <div className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 rounded-full bg-blue-500/10 blur-2xl" />
      )}

      {/* Badge */}
      {course.badge && (
        <div
          className={`
            absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
            ${
              isComingSoon
                ? theme === 'dark'
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-200 text-gray-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            }
          `}
        >
          {isZh ? course.badgeZh : course.badge}
        </div>
      )}

      {/* Icon */}
      <div
        className={`
          relative w-12 h-12 rounded-xl flex items-center justify-center mb-4
          ${featured && 'w-14 h-14'}
          ${
            isComingSoon
              ? theme === 'dark'
                ? 'bg-slate-700'
                : 'bg-gray-200'
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }
        `}
      >
        <Icon
          className={`
            ${featured ? 'w-7 h-7' : 'w-6 h-6'}
            ${
              isComingSoon
                ? theme === 'dark'
                  ? 'text-gray-500'
                  : 'text-gray-400'
                : 'text-white'
            }
          `}
        />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <h3
            className={`
              font-bold
              ${featured ? 'text-xl' : 'text-lg'}
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
            `}
          >
            {isZh ? t(course.titleZhKey) : t(course.titleKey)}
          </h3>
          {isComingSoon && (
            <span
              className={`
                text-[10px] px-2 py-0.5 rounded-full
                ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {isZh ? '待更新' : 'Coming Soon'}
            </span>
          )}
        </div>

        <p
          className={`
            text-sm leading-relaxed mb-3
            ${featured && 'text-base'}
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          {isZh ? t(course.descriptionZhKey) : t(course.descriptionKey)}
        </p>

        {/* Stats for active courses */}
        {!isComingSoon && course.units && (
          <div className="flex items-center gap-4 mb-3">
            <span
              className={`text-xs ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              {course.units} {isZh ? '单元' : 'course.units.label'}
            </span>
            {course.demos && (
              <span
                className={`text-xs ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}
              >
                {course.demos} {isZh ? '演示' : 'demos'}
              </span>
            )}
          </div>
        )}

        {/* Enter button */}
        {!isComingSoon && (
          <div
            className={`
              flex items-center gap-2 font-medium
              ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
            `}
          >
            <span className="text-sm">{isZh ? '查看全部' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  )

  if (isComingSoon) {
    return cardContent
  }

  return <Link to={course.path}>{cardContent}</Link>
}

// Course section component
function CourseSection() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2
              className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {isZh ? '课程体系' : 'Course System'}
            </h2>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              P-SRT
            </span>
          </div>
          <Link
            to="/course"
            className={`flex items-center gap-1 text-sm font-medium ${
              theme === 'dark'
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            {isZh ? '查看全部' : 'View All'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSES.map((course, index) => (
            <CourseCard key={course.id} course={course} featured={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const logoRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track which module is hovered for beam effect
  const [activeModule, setActiveModule] = useState<ModuleEffectType | null>(null)
  const cardRefs = useRef<Map<string, React.RefObject<HTMLAnchorElement | null>>>(new Map())

  // Get or create a ref for each module card
  const getCardRef = useCallback((moduleId: string) => {
    if (!cardRefs.current.has(moduleId)) {
      cardRefs.current.set(moduleId, { current: null })
    }
    return cardRefs.current.get(moduleId)!
  }, [])

  // Get the ref for the currently hovered card
  const activeCardRef = activeModule ? cardRefs.current.get(activeModule) : undefined

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}
    >
      {/* Light beam effect from logo to hovered module card */}
      <LightBeamEffect
        logoRef={logoRef}
        containerRef={containerRef}
        activeModule={activeModule}
        targetRef={activeCardRef}
      />

      {/* Settings */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageThemeSwitcher />
      </div>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center pt-16 pb-12 px-4 text-center">
        {/* Logo - Light source for beam effect */}
        <div ref={logoRef} className="mb-6">
          <PolarCraftLogo size={80} theme={theme} animated />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-cyan-100 text-cyan-700'
            }`}
          >
            {t('home.hero.badges.course')}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              theme === 'dark'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {t('home.hero.badges.badge1')}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              theme === 'dark'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {t('home.hero.badges.badge2')}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              theme === 'dark'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {t('home.hero.badges.badge3')}
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600'
          }`}
        >
          {t('home.hero.title')}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl font-medium mb-6 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          }`}
        >
          {t('home.hero.subtitle')}
        </p>

        {/* Narrative Intro */}
        <div
          className={`max-w-2xl mx-auto space-y-2 text-base leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <p>{t('home.hero.intro1')}</p>
          <p>{t('home.hero.intro2')}</p>
          <p>{t('home.hero.intro3')}</p>
        </div>

        {/* Tagline */}
        <p
          className={`mt-4 text-lg font-semibold ${
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600'
          }`}
        >
          {t('home.hero.tagline')}
        </p>
      </header>

      {/* Module Grid */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                theme={theme}
                cardRef={getCardRef(module.id)}
                onHoverStart={() => setActiveModule(module.id as ModuleEffectType)}
                onHoverEnd={() => setActiveModule(null)}
              />
            ))}
          </nav>
        </div>
      </main>

      {/* Course Section */}
      <CourseSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
