import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { LightBeamEffect } from '@/components/effects'
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

// Module configuration for the 6 core modules
interface ModuleConfig {
  id: string
  titleKey: string
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
    // 1. 实验内容与历史故事 (Experiments & Chronicles)
    id: 'history',
    titleKey: 'home.modules.history.title',
    descriptionKey: 'home.modules.history.description',
    path: '/education',
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
    // 2. 光学器件和典型光路 (Optical Arsenal)
    id: 'arsenal',
    titleKey: 'home.modules.arsenal.title',
    descriptionKey: 'home.modules.arsenal.description',
    path: '/arsenal',
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
    // 3. 基本理论和计算模拟 (Theory & Simulation)
    id: 'theory',
    titleKey: 'home.modules.theory.title',
    descriptionKey: 'home.modules.theory.description',
    path: '/theory',
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
    // 4. 课程内容的游戏化改造 (Gamification)
    id: 'games',
    titleKey: 'home.modules.games.title',
    descriptionKey: 'home.modules.games.description',
    path: '/games',
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
    // 5. 成果展示 (Showcase & Gallery)
    id: 'gallery',
    titleKey: 'home.modules.gallery.title',
    descriptionKey: 'home.modules.gallery.description',
    path: '/gallery',
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
    // 6. 虚拟课题组 (Virtual Lab & Research)
    id: 'research',
    titleKey: 'home.modules.research.title',
    descriptionKey: 'home.modules.research.description',
    path: '/research',
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
  onHoverChange,
}: {
  module: ModuleConfig
  theme: 'dark' | 'light'
  onHoverChange?: (isHovered: boolean) => void
}) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = module.IconComponent

  const handleHoverChange = (hovered: boolean) => {
    setIsHovered(hovered)
    onHoverChange?.(hovered)
  }

  return (
    <Link
      to={module.path}
      className={`
        group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-500
        ${module.colorTheme.bg} ${module.colorTheme.bgHover}
        ${module.colorTheme.border} ${module.colorTheme.borderHover}
        hover:-translate-y-3 hover:shadow-2xl ${module.colorTheme.shadow}
        overflow-hidden
      `}
      onMouseEnter={() => handleHoverChange(true)}
      onMouseLeave={() => handleHoverChange(false)}
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

      {/* Title with subtle animation */}
      <h3
        className={`
          text-lg font-bold text-gray-900 dark:text-white mb-2
          transition-all duration-300
          ${isHovered ? 'translate-x-1' : 'translate-x-0'}
        `}
      >
        {t(module.titleKey)}
      </h3>

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

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const logoRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnyCardHovered, setIsAnyCardHovered] = useState(false)
  const hoverCountRef = useRef(0)

  // Track hover state across all cards
  const handleCardHoverChange = (isHovered: boolean) => {
    if (isHovered) {
      hoverCountRef.current++
    } else {
      hoverCountRef.current = Math.max(0, hoverCountRef.current - 1)
    }
    setIsAnyCardHovered(hoverCountRef.current > 0)
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}
    >
      {/* Light beam effect from logo - only active when hovering module cards */}
      <LightBeamEffect logoRef={logoRef} containerRef={containerRef} active={isAnyCardHovered} />

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
          className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {t('home.hero.subtitle')}
        </p>
      </header>

      {/* Module Grid */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                theme={theme}
                onHoverChange={handleCardHoverChange}
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
