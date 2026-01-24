import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
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
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      bgHover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
      border: 'border-amber-200 dark:border-amber-800/50',
      borderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
      iconBg: 'bg-amber-100/50 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      shadow: 'hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30',
      glowColor: 'amber',
      tagBg: 'bg-amber-100/80 dark:bg-amber-900/50',
      tagText: 'text-amber-700 dark:text-amber-300',
    },
  },
  {
    // 2. Gather · 收集 - 光学器件
    id: 'arsenal',
    i18nNamespace: 'home.modules.arsenal',
    path: '/studio',
    IconComponent: ArsenalModuleIcon,
    quickLinks: [
      { labelKey: 'home.opticalDesignStudio.link1', path: '/studio' },
      { labelKey: 'home.opticalDesignStudio.link2', path: '/studio' },
      { labelKey: 'home.opticalDesignStudio.link3', path: '/studio' },
    ],
    colorTheme: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      bgHover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/40',
      border: 'border-cyan-200 dark:border-cyan-800/50',
      borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-600',
      iconBg: 'bg-cyan-100/50 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      shadow: 'hover:shadow-cyan-200/50 dark:hover:shadow-cyan-900/30',
      glowColor: 'cyan',
      tagBg: 'bg-cyan-100/80 dark:bg-cyan-900/50',
      tagText: 'text-cyan-700 dark:text-cyan-300',
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
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      bgHover: 'hover:bg-violet-100 dark:hover:bg-violet-900/40',
      border: 'border-violet-200 dark:border-violet-800/50',
      borderHover: 'hover:border-violet-400 dark:hover:border-violet-600',
      iconBg: 'bg-violet-100/50 dark:bg-violet-900/30',
      iconColor: 'text-violet-600 dark:text-violet-400',
      shadow: 'hover:shadow-violet-200/50 dark:hover:shadow-violet-900/30',
      glowColor: 'violet',
      tagBg: 'bg-violet-100/80 dark:bg-violet-900/50',
      tagText: 'text-violet-700 dark:text-violet-300',
    },
  },
  {
    // 4. Conquer(征服) · 征服 - 游戏挑战
    id: 'games',
    i18nNamespace: 'home.modules.games',
    path: '/games',
    IconComponent: GamesModuleIcon,
    quickLinks: [
      { labelKey: 'home.polarquest.link1', path: '/games/2d' },
      { labelKey: 'home.polarquest.link2', path: '/games/3d' },
      { labelKey: 'home.polarquest.link3', path: '/games/card' },
    ],
    colorTheme: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      bgHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
      iconBg: 'bg-emerald-100/50 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30',
      glowColor: 'emerald',
      tagBg: 'bg-emerald-100/80 dark:bg-emerald-900/50',
      tagText: 'text-emerald-700 dark:text-emerald-300',
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
      bg: 'bg-pink-50 dark:bg-pink-950/30',
      bgHover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40',
      border: 'border-pink-200 dark:border-pink-800/50',
      borderHover: 'hover:border-pink-400 dark:hover:border-pink-600',
      iconBg: 'bg-pink-100/50 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      shadow: 'hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30',
      glowColor: 'pink',
      tagBg: 'bg-pink-100/80 dark:bg-pink-900/50',
      tagText: 'text-pink-700 dark:text-pink-300',
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
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      bgHover: 'hover:bg-teal-100 dark:hover:bg-teal-900/40',
      border: 'border-teal-200 dark:border-teal-800/50',
      borderHover: 'hover:border-teal-400 dark:hover:border-teal-600',
      iconBg: 'bg-teal-100/50 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      shadow: 'hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30',
      glowColor: 'teal',
      tagBg: 'bg-teal-100/80 dark:bg-teal-900/50',
      tagText: 'text-teal-700 dark:text-teal-300',
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

  // Get translated content from i18n namespace
  const titleEn = t(`${module.i18nNamespace}.title`)
  const titleZh = t(`${module.i18nNamespace}.titleZh`)
  const subtitle = t(`${module.i18nNamespace}.subtitle`)
  const description = t(`${module.i18nNamespace}.description`)

  return (
    <Link
      to={module.path}
      ref={cardRef as unknown as React.RefObject<HTMLAnchorElement>}
      className={`
        group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500
        ${module.colorTheme.bg} ${module.colorTheme.bgHover}
        ${module.colorTheme.border} ${module.colorTheme.borderHover}
        hover:-translate-y-2 hover:shadow-2xl ${module.colorTheme.shadow}
        overflow-hidden cursor-pointer
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

      {/* Header: Icon + Title side by side */}
      <div className="flex items-start gap-4 mb-3">
        {/* Animated Icon with ref for light beam targeting */}
        <div
          ref={iconRef}
          className={`
            relative w-16 h-16 rounded-xl flex items-center justify-center shrink-0
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

        {/* Title block - right of icon */}
        <div className="flex-1 min-w-0 pt-1">
          {/* Main Title (e.g., "历史与实验") */}
          <h3
            className={`
              text-xl font-bold leading-tight mb-1
              transition-all duration-300
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              ${isHovered ? 'translate-x-1' : 'translate-x-0'}
            `}
          >
            {subtitle}
          </h3>
          {/* Subtitle (e.g., "追溯" / "Trace") */}
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium ${module.colorTheme.iconColor}`}>
              {titleZh || titleEn}
            </span>
            {titleZh && (
              <>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>·</span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
          text-sm leading-relaxed mb-4 flex-1
          transition-all duration-300
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          ${isHovered ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-700') : ''}
        `}
      >
        {description}
      </p>

      {/* Quick Links Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {module.quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={(e) => e.stopPropagation()}
            className={`
              px-2.5 py-1 text-xs font-medium rounded-full
              transition-all duration-200
              ${module.colorTheme.tagBg} ${module.colorTheme.tagText}
              hover:scale-105 hover:shadow-sm
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
    </Link>
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
      className={`min-h-screen flex flex-col ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
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
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-cyan-100 text-cyan-700'
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

        {/* Platform Introduction */}
        <div
          className={`max-w-3xl mx-auto mb-6 p-6 rounded-2xl text-left ${
            theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white/70 border border-gray-200 shadow-sm'
          }`}
        >
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {t('home.hero.platformIntro')}
          </p>
        </div>

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
