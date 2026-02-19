import { useState, useRef, useCallback, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { LightBeamEffect, AmbientParticles, type ModuleEffectType } from '@/components/effects'
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
import { useDiscoveryStore } from '@/stores/discoveryStore'
import { calculateProgress, DEMO_PREREQUISITES } from '@/data/learningPaths'

// Icon component type for animated module icons
type AnimatedIconComponent = React.ComponentType<{
  className?: string
  size?: number
  isHovered?: boolean
  theme?: 'dark' | 'light'
}>

// Quick link configuration
interface QuickLink {
  labelKey: string
  path: string
}

// Module configuration for the 6 core modules
interface ModuleConfig {
  id: string
  // Use the dedicated i18n namespace for each module card content
  i18nNamespace: string  // e.g., 'home.chronicles'
  path: string
  IconComponent: AnimatedIconComponent
  quickLinks: QuickLink[]
  inDevelopment?: boolean  // Mark module as "开发中" (In Development)
  colorTheme: {
    bg: string
    bgHover: string
    border: string
    borderHover: string
    iconBg: string
    iconColor: string
    shadow: string
    glowColor: string
    tagBg: string
    tagText: string
  }
}

const MODULES: ModuleConfig[] = [
  {
    // 1. Trace(痕量) · 追溯 - 历史与实验
    id: 'history',
    i18nNamespace: 'home.modules.history',
    path: '/chronicles',
    IconComponent: HistoryModuleIcon,
    quickLinks: [
      { labelKey: 'home.chronicles.link1', path: '/chronicles' },
      { labelKey: 'home.chronicles.link2', path: '/chronicles' },
      { labelKey: 'home.chronicles.link3', path: '/chronicles' },
    ],
    colorTheme: {
      bg: 'bg-cyan-950/20 backdrop-blur-sm',
      bgHover: 'group-hover:bg-cyan-900/40',
      border: 'border-cyan-800/50',
      borderHover: 'group-hover:border-cyan-400/80 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      shadow: '',
      glowColor: 'cyan',
      tagBg: 'bg-cyan-950/40 border border-cyan-800',
      tagText: 'text-cyan-300',
    },
  },
  {
    // 2. Gather · 收集 - 光学器件
    id: 'arsenal',
    i18nNamespace: 'home.modules.arsenal',
    path: '/studio',
    IconComponent: ArsenalModuleIcon,
    inDevelopment: true,
    quickLinks: [
      { labelKey: 'home.opticalDesignStudio.link1', path: '/studio' },
      { labelKey: 'home.opticalDesignStudio.link2', path: '/studio' },
      { labelKey: 'home.opticalDesignStudio.link3', path: '/studio' },
    ],
    colorTheme: {
      bg: 'bg-blue-950/20 backdrop-blur-sm',
      bgHover: 'group-hover:bg-blue-900/40',
      border: 'border-blue-800/50',
      borderHover: 'group-hover:border-blue-400/80 group-hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      shadow: '',
      glowColor: 'indigo',
      tagBg: 'bg-blue-950/40 border border-blue-800',
      tagText: 'text-blue-300',
    },
  },
  {
    // 3. Decode · 解码 - 理论与模拟
    id: 'theory',
    i18nNamespace: 'home.modules.theory',
    path: '/demos',
    IconComponent: TheoryModuleIcon,
    quickLinks: [
      { labelKey: 'home.formulaLab.link1', path: '/demos/malus-law' },
      { labelKey: 'home.formulaLab.link2', path: '/demos/birefringence' },
      { labelKey: 'home.formulaLab.link3', path: '/demos/stokes-vector' },
    ],
    colorTheme: {
      bg: 'bg-violet-950/20 backdrop-blur-sm',
      bgHover: 'group-hover:bg-violet-900/40',
      border: 'border-violet-800/50',
      borderHover: 'group-hover:border-violet-400/80 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      shadow: '',
      glowColor: 'violet',
      tagBg: 'bg-violet-950/40 border border-violet-800',
      tagText: 'text-violet-300',
    },
  },
  {
    // 4. Conquer(征服) · 征服 - 游戏挑战
    id: 'games',
    i18nNamespace: 'home.modules.games',
    path: '/games',
    IconComponent: GamesModuleIcon,
    inDevelopment: true,
    quickLinks: [
      { labelKey: 'home.polarquest.link1', path: '/games/2d' },
      { labelKey: 'home.polarquest.link2', path: '/games/3d' },
      { labelKey: 'home.polarquest.link3', path: '/games/card' },
    ],
    colorTheme: {
      bg: 'bg-purple-950/20 backdrop-blur-sm',
      bgHover: 'group-hover:bg-purple-900/40',
      border: 'border-purple-800/50',
      borderHover: 'group-hover:border-purple-400/80 group-hover:shadow-[0_0_20px_rgba(192,132,252,0.3)]',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      shadow: '',
      glowColor: 'violet',
      tagBg: 'bg-purple-950/40 border border-purple-800',
      tagText: 'text-purple-300',
    },
  },
  {
    // 5. Shine · 闪耀 - 成果展示
    id: 'gallery',
    i18nNamespace: 'home.modules.gallery',
    path: '/gallery',
    IconComponent: GalleryModuleIcon,
    quickLinks: [
      { labelKey: 'home.creativeLab.link1', path: '/gallery/diy' },
      { labelKey: 'home.creativeLab.link2', path: '/gallery/showcase' },
      { labelKey: 'home.creativeLab.link3', path: '/gallery/generator' },
      { labelKey: 'home.creativeLab.link4', path: '/gallery/gallery' },
    ],
    colorTheme: {
      bg: 'bg-fuchsia-950/20 backdrop-blur-sm',
      bgHover: 'group-hover:bg-fuchsia-900/40',
      border: 'border-fuchsia-800/50',
      borderHover: 'group-hover:border-fuchsia-400/80 group-hover:shadow-[0_0_20px_rgba(232,121,249,0.3)]',
      iconBg: 'bg-fuchsia-500/10',
      iconColor: 'text-fuchsia-400',
      shadow: '',
      glowColor: 'pink',
      tagBg: 'bg-fuchsia-950/40 border border-fuchsia-800',
      tagText: 'text-fuchsia-300',
    },
  },
  {
    // 6. Venture(创业) · 冒险 - 虚拟课题组
    id: 'research',
    i18nNamespace: 'home.modules.research',
    path: '/research',
    IconComponent: ResearchModuleIcon,
    quickLinks: [
      { labelKey: 'home.labGroup.link1', path: '/research' },
      { labelKey: 'home.labGroup.link2', path: '/research/applications' },
      { labelKey: 'home.labGroup.link3', path: '/calc' },
      { labelKey: 'home.labGroup.link4', path: '/research' },
    ],
    colorTheme: {
      bg: 'bg-teal-950/20 backdrop-blur-sm',
      bgHover: 'group-hover:bg-teal-900/40',
      border: 'border-teal-800/50',
      borderHover: 'group-hover:border-teal-400/80 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-400',
      shadow: '',
      glowColor: 'teal',
      tagBg: 'bg-teal-950/40 border border-teal-800',
      tagText: 'text-teal-300',
    },
  },
]

// Glow effect configuration for each color theme
const GLOW_STYLES: Record<string, string> = {
  amber: 'rgba(251, 191, 36, 0.4)',
  cyan: 'rgba(34, 211, 238, 0.4)',
  indigo: 'rgba(129, 140, 248, 0.4)',
  violet: 'rgba(139, 92, 246, 0.4)',
  emerald: 'rgba(52, 211, 153, 0.4)',
  pink: 'rgba(244, 114, 182, 0.4)',
  teal: 'rgba(45, 212, 191, 0.4)',
}

// Progress ring for module cards - shows completion percentage
function ProgressRing({ progress, size = 28, strokeWidth = 2.5 }: {
  progress: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  if (progress === 0) return null

  return (
    <svg width={size} height={size} className="absolute top-2 right-2 z-10">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-slate-700/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="text-emerald-400 transition-all duration-500"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-emerald-400 text-[7px] font-mono"
      >
        {progress}%
      </text>
    </svg>
  )
}

// Explored badge for exploration-type modules (Gallery, Chronicles)
// Shows discovery count instead of percentage progress
function ExploredBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
      <span className="text-emerald-400 text-[9px]">&#10003;</span>
      <span className="text-emerald-400 text-[9px] font-mono">{count}</span>
    </div>
  )
}

// Categorize modules for different progress indicators
const EXPLORATION_MODULES = new Set(['history', 'gallery'])

// Module Card Component with redesigned layout - icon left, title right, subtitle below
function ModuleCard({
  module,
  theme,
  onHoverStart,
  onHoverEnd,
  cardRef,
  iconRef,
}: {
  module: ModuleConfig
  theme: 'dark' | 'light'
  onHoverStart: () => void
  onHoverEnd: () => void
  cardRef: React.RefObject<HTMLDivElement | null>
  iconRef: React.RefObject<HTMLDivElement | null>
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = module.IconComponent

  // Calculate progress for structured modules (Demos)
  // Select the raw array (referentially stable) and derive Set via useMemo
  // to avoid creating a new Set on every render (which triggers infinite re-renders)
  const completedDemos = useDiscoveryStore(state => state.completedDemos)
  const completedDemoIds = useMemo(() => new Set(completedDemos), [completedDemos])
  const discoveryCount = useDiscoveryStore(state => Object.keys(state.discoveries).length)
  const allDemoIds = DEMO_PREREQUISITES.map(p => p.demoId)
  const moduleProgress = module.id === 'theory' ? calculateProgress(allDemoIds, completedDemoIds) : 0
  const isExploration = EXPLORATION_MODULES.has(module.id)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHoverStart()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHoverEnd()
  }

  // Get translated content from i18n namespace
  const titleEn = t(`${module.i18nNamespace}.title`)
  const titleZh = t(`${module.i18nNamespace}.titleZh`)
  const subtitle = t(`${module.i18nNamespace}.subtitle`)
  const description = t(`${module.i18nNamespace}.description`)

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't navigate if user clicked an inner link
    if ((e.target as HTMLElement).closest('a')) return
    navigate({ to: module.path })
  }, [navigate, module.path])

  return (
    <div
      ref={cardRef}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate({ to: module.path }) }}
      className={`
        group relative flex flex-col p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-500
        ${module.colorTheme.bg} ${module.colorTheme.bgHover}
        ${module.colorTheme.border} ${module.colorTheme.borderHover}
        hover:-translate-y-2
        overflow-hidden cursor-pointer
      `}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* "In Development" Badge */}
      {module.inDevelopment && (
        <div
          className={`
            absolute top-2 right-2 sm:top-3 sm:right-3 z-10
            px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full
            ${theme === 'dark'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-amber-100 text-amber-700 border border-amber-300'
            }
          `}
        >
          {t('home.badges.inDevelopment')}
        </div>
      )}

      {/* Progress indicator - differentiated by module type */}
      {!module.inDevelopment && moduleProgress > 0 && (
        <ProgressRing progress={moduleProgress} />
      )}
      {!module.inDevelopment && isExploration && (
        <ExploredBadge count={discoveryCount} />
      )}

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

      {/* Header: Icon + Title side by side */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3">
        {/* Animated Icon with ref for light beam targeting */}
        <div
          ref={iconRef}
          className={`
            relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0
            ${module.colorTheme.iconBg}
            transition-all duration-500
            ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
          `}
        >
          <IconComponent
            size={48}
            isHovered={isHovered}
            theme={theme}
            className="w-10 h-10 sm:w-14 sm:h-14"
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

        {/* Title block - right of icon */}
        <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
          {/* Main Title (e.g., "历史与实验") */}
          <h3
            className={`
              text-lg sm:text-xl font-bold leading-tight mb-1
              transition-all duration-300
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              ${isHovered ? 'translate-x-1' : 'translate-x-0'}
            `}
          >
            {subtitle}
          </h3>
          {/* Subtitle (e.g., "追溯" / "Trace") */}
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium ${module.colorTheme.iconColor} tracking-wider`}>
              {titleZh || titleEn}
            </span>
            {titleZh && (
              <>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>·</span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {titleEn}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className={`
          text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-1
          transition-all duration-300
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          ${isHovered ? (theme === 'dark' ? 'text-gray-200' : 'text-gray-800') : ''}
        `}
      >
        {description}
      </p>

      {/* Quick Links Tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {module.quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={(e) => e.stopPropagation()}
            className={`
              px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium rounded-full
              transition-all duration-200 border
              ${module.colorTheme.tagBg} ${module.colorTheme.tagText}
              hover:scale-105 hover:bg-white/10
            `}
          >
            {t(link.labelKey)}
          </Link>
        ))}
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
    </div>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const logoRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track which module is hovered for beam effect
  const [activeModule, setActiveModule] = useState<ModuleEffectType | null>(null)
  // Track logo hover state for interactive effects
  const [logoHovered, setLogoHovered] = useState(false)
  const cardRefs = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(new Map())
  const iconRefs = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(new Map())

  // Get or create a ref for each module card
  const getCardRef = useCallback((moduleId: string) => {
    if (!cardRefs.current.has(moduleId)) {
      cardRefs.current.set(moduleId, { current: null })
    }
    return cardRefs.current.get(moduleId)!
  }, [])

  // Get or create a ref for each module icon (for light beam targeting)
  const getIconRef = useCallback((moduleId: string) => {
    if (!iconRefs.current.has(moduleId)) {
      iconRefs.current.set(moduleId, { current: null })
    }
    return iconRefs.current.get(moduleId)!
  }, [])

  // Get the ref for the currently hovered module's icon
  const activeIconRef = activeModule ? iconRefs.current.get(activeModule) : undefined

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col ${theme === 'dark'
          ? 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black'
          : 'bg-slate-50'
        }`}
    >
      {/* Ambient floating particles background */}
      <AmbientParticles theme={theme} count={15} enabled />

      {/* Light beam effect from logo to hovered module icons */}
      <LightBeamEffect
        logoRef={logoRef}
        containerRef={containerRef}
        activeModule={activeModule}
        targetRef={activeIconRef}
        leftLogoActive={logoHovered || activeModule !== null}
      />

      {/* Settings */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageThemeSwitcher />
      </div>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center pt-12 pb-8 px-4 text-center">
        {/* Logo Row - Compact inline layout */}
        <div className="flex items-center justify-center gap-6 mb-4">
          {/* Combined Logo - X-Institute + Open Wisdom Lab */}
          <div
            ref={logoRef}
            className={`
              transition-all duration-500 cursor-pointer
              ${logoHovered ? 'scale-105' : activeModule ? 'scale-102' : 'scale-100'}
            `}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <PolarCraftLogo
              size={80}
              theme={theme}
              animated
              beamActive={logoHovered || activeModule !== null}
              className={`
                transition-all duration-500
                ${logoHovered ? 'drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]' : activeModule ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]' : ''}
              `}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-cyan-100 text-cyan-700'
              }`}
          >
            {t('home.hero.badges.badge1')}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${theme === 'dark'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-emerald-100 text-emerald-700'
              }`}
          >
            {t('home.hero.badges.badge2')}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${theme === 'dark'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-amber-100 text-amber-700'
              }`}
          >
            {t('home.hero.badges.badge3')}
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600'
            }`}
        >
          {t('home.hero.title')}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl font-medium mb-6 ${theme === 'dark' ? 'text-cyan-400/80' : 'text-cyan-600'
            }`}
        >
          {t('home.hero.subtitle')}
        </p>

      </header>

      {/* Main Content - consistent width container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Platform Introduction */}
          <div
            className={`mb-8 p-4 sm:p-6 rounded-2xl text-left ${theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700/50'
                : 'bg-white/70 border border-gray-200 shadow-sm'
              }`}
          >
            <p
              className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              {t('home.hero.platformIntro')}
            </p>
          </div>
          {/* Module Grid */}
          <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                theme={theme}
                cardRef={getCardRef(module.id)}
                iconRef={getIconRef(module.id)}
                onHoverStart={() => setActiveModule(module.id as ModuleEffectType)}
                onHoverEnd={() => setActiveModule(null)}
              />
            ))}
          </nav>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
