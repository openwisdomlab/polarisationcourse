import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarCraftLogo } from '@/components/icons'
import {
  History,
  Box,
  Calculator,
  Gamepad2,
  Award,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'

// Module configuration for the 6 core modules
interface ModuleConfig {
  id: string
  titleKey: string
  descriptionKey: string
  path: string
  icon: LucideIcon
  colorTheme: {
    bg: string
    bgHover: string
    border: string
    borderHover: string
    iconBg: string
    iconColor: string
    shadow: string
  }
}

const MODULES: ModuleConfig[] = [
  {
    // 1. 实验内容与历史故事 (Experiments & Chronicles)
    id: 'history',
    titleKey: 'home.modules.history.title',
    descriptionKey: 'home.modules.history.description',
    path: '/education',
    icon: History,
    colorTheme: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      bgHover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
      border: 'border-amber-200 dark:border-amber-800/50',
      borderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
      iconColor: 'text-amber-600 dark:text-amber-400',
      shadow: 'hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30',
    },
  },
  {
    // 2. 光学器件和典型光路 (Optical Arsenal)
    id: 'arsenal',
    titleKey: 'home.modules.arsenal.title',
    descriptionKey: 'home.modules.arsenal.description',
    path: '/arsenal',
    icon: Box,
    colorTheme: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      bgHover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/40',
      border: 'border-cyan-200 dark:border-cyan-800/50',
      borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-600',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      shadow: 'hover:shadow-cyan-200/50 dark:hover:shadow-cyan-900/30',
    },
  },
  {
    // 3. 基本理论和计算模拟 (Theory & Simulation)
    id: 'theory',
    titleKey: 'home.modules.theory.title',
    descriptionKey: 'home.modules.theory.description',
    path: '/theory',
    icon: Calculator,
    colorTheme: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      bgHover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
      border: 'border-indigo-200 dark:border-indigo-800/50',
      borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-600',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      shadow: 'hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/30',
    },
  },
  {
    // 4. 课程内容的游戏化改造 (Gamification)
    id: 'games',
    titleKey: 'home.modules.games.title',
    descriptionKey: 'home.modules.games.description',
    path: '/games',
    icon: Gamepad2,
    colorTheme: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      bgHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30',
    },
  },
  {
    // 5. 成果展示 (Showcase & Gallery)
    id: 'gallery',
    titleKey: 'home.modules.gallery.title',
    descriptionKey: 'home.modules.gallery.description',
    path: '/gallery',
    icon: Award,
    colorTheme: {
      bg: 'bg-pink-50 dark:bg-pink-950/30',
      bgHover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40',
      border: 'border-pink-200 dark:border-pink-800/50',
      borderHover: 'hover:border-pink-400 dark:hover:border-pink-600',
      iconBg: 'bg-pink-100 dark:bg-pink-900/50',
      iconColor: 'text-pink-600 dark:text-pink-400',
      shadow: 'hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30',
    },
  },
  {
    // 6. 虚拟课题组 (Virtual Lab & Research)
    id: 'research',
    titleKey: 'home.modules.research.title',
    descriptionKey: 'home.modules.research.description',
    path: '/research',
    icon: FlaskConical,
    colorTheme: {
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      bgHover: 'hover:bg-teal-100 dark:hover:bg-teal-900/40',
      border: 'border-teal-200 dark:border-teal-800/50',
      borderHover: 'hover:border-teal-400 dark:hover:border-teal-600',
      iconBg: 'bg-teal-100 dark:bg-teal-900/50',
      iconColor: 'text-teal-600 dark:text-teal-400',
      shadow: 'hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30',
    },
  },
]

// Module Card Component
function ModuleCard({ module }: { module: ModuleConfig }) {
  const { t } = useTranslation()
  const Icon = module.icon

  return (
    <Link
      to={module.path}
      className={`
        group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300
        ${module.colorTheme.bg} ${module.colorTheme.bgHover}
        ${module.colorTheme.border} ${module.colorTheme.borderHover}
        hover:-translate-y-2 hover:shadow-xl ${module.colorTheme.shadow}
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-14 h-14 rounded-xl flex items-center justify-center mb-4
          ${module.colorTheme.iconBg}
          transition-transform duration-300 group-hover:scale-110
        `}
      >
        <Icon className={`w-7 h-7 ${module.colorTheme.iconColor}`} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {t(module.titleKey)}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
        {t(module.descriptionKey)}
      </p>

      {/* Arrow indicator */}
      <div
        className={`
          mt-4 flex items-center text-sm font-medium
          ${module.colorTheme.iconColor}
          transition-transform duration-300 group-hover:translate-x-1
        `}
      >
        <span>{t('common.explore')}</span>
        <svg
          className="w-4 h-4 ml-1"
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
      </div>
    </Link>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}
    >
      {/* Settings */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageThemeSwitcher />
      </div>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center pt-16 pb-12 px-4 text-center">
        {/* Logo */}
        <div className="mb-6">
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
              <ModuleCard key={module.id} module={module} />
            ))}
          </nav>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`py-6 text-center text-sm ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}
      >
        <p>PolarCraft · Open Wisdom Lab</p>
      </footer>
    </div>
  )
}

export default HomePage
