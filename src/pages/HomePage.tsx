import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'

// Module configuration for the 6 creative hubs
interface ModuleConfig {
  key: string
  icon: string
  colorTheme: {
    border: string
    borderHover: string
    shadow: string
    text: string
    gradientFrom: string
    gradientTo: string
    buttonText: string
  }
  mainRoute: string
  quickLinks: Array<{
    labelKey: string
    route: string
  }>
}

const MODULES: ModuleConfig[] = [
  {
    key: 'chronicles',
    icon: '📜',
    colorTheme: {
      border: 'amber-400',
      borderHover: 'amber-400',
      shadow: 'rgba(251,191,36,0.3)',
      text: 'amber-400',
      gradientFrom: 'amber-400',
      gradientTo: 'orange-500',
      buttonText: 'black',
    },
    mainRoute: '/chronicles',
    quickLinks: [
      { labelKey: 'link1', route: '/chronicles' },
      { labelKey: 'link2', route: '/chronicles' },
      { labelKey: 'link3', route: '/chronicles' },
    ],
  },
  {
    key: 'workshop',
    icon: '🔧',
    colorTheme: {
      border: 'green-400',
      borderHover: 'green-400',
      shadow: 'rgba(74,222,128,0.3)',
      text: 'green-400',
      gradientFrom: 'green-400',
      gradientTo: 'emerald-500',
      buttonText: 'black',
    },
    mainRoute: '/hardware',
    quickLinks: [
      { labelKey: 'link1', route: '/hardware' },
      { labelKey: 'link2', route: '/hardware' },
      { labelKey: 'link3', route: '/hardware' },
    ],
  },
  {
    key: 'formulaLab',
    icon: '🧮',
    colorTheme: {
      border: 'cyan-400',
      borderHover: 'cyan-400',
      shadow: 'rgba(34,211,238,0.3)',
      text: 'cyan-400',
      gradientFrom: 'cyan-400',
      gradientTo: 'blue-500',
      buttonText: 'black',
    },
    mainRoute: '/demos',
    quickLinks: [
      { labelKey: 'link1', route: '/demos' },
      { labelKey: 'link2', route: '/demos' },
      { labelKey: 'link3', route: '/demos' },
    ],
  },
  {
    key: 'polarquest',
    icon: '🎮',
    colorTheme: {
      border: 'purple-400',
      borderHover: 'purple-400',
      shadow: 'rgba(192,132,252,0.3)',
      text: 'purple-400',
      gradientFrom: 'purple-400',
      gradientTo: 'violet-500',
      buttonText: 'white',
    },
    mainRoute: '/games',
    quickLinks: [
      { labelKey: 'link1', route: '/games/2d' },
      { labelKey: 'link2', route: '/games/3d' },
      { labelKey: 'link3', route: '/games/card' },
      { labelKey: 'link4', route: '/games/escape' },
    ],
  },
  {
    key: 'gallery',
    icon: '🎨',
    colorTheme: {
      border: 'pink-400',
      borderHover: 'pink-400',
      shadow: 'rgba(244,114,182,0.3)',
      text: 'pink-400',
      gradientFrom: 'pink-400',
      gradientTo: 'rose-500',
      buttonText: 'white',
    },
    mainRoute: '/merchandise',
    quickLinks: [
      { labelKey: 'link1', route: '/merchandise' },
      { labelKey: 'link2', route: '/merchandise' },
      { labelKey: 'link3', route: '/merchandise' },
    ],
  },
  {
    key: 'labGroup',
    icon: '🔬',
    colorTheme: {
      border: 'yellow-400',
      borderHover: 'yellow-400',
      shadow: 'rgba(250,204,21,0.3)',
      text: 'yellow-400',
      gradientFrom: 'yellow-400',
      gradientTo: 'amber-500',
      buttonText: 'black',
    },
    mainRoute: '/lab',
    quickLinks: [
      { labelKey: 'link1', route: '/lab' },
      { labelKey: 'link2', route: '/lab' },
      { labelKey: 'link3', route: '/lab' },
    ],
  },
]

// Color mapping for Tailwind classes
const getColorClasses = (module: ModuleConfig, theme: 'dark' | 'light') => {
  const colorMap: Record<string, { dark: string; light: string; shadow: string }> = {
    'amber-400': {
      dark: 'border-amber-400/30 hover:border-amber-400/60',
      light: 'border-amber-400/40 hover:border-amber-400/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(251,191,36,0.3)]',
    },
    'green-400': {
      dark: 'border-green-400/30 hover:border-green-400/60',
      light: 'border-green-500/40 hover:border-green-500/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(74,222,128,0.3)]',
    },
    'cyan-400': {
      dark: 'border-cyan-400/30 hover:border-cyan-400/60',
      light: 'border-cyan-500/40 hover:border-cyan-500/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(34,211,238,0.3)]',
    },
    'purple-400': {
      dark: 'border-purple-400/30 hover:border-purple-400/60',
      light: 'border-purple-400/40 hover:border-purple-400/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(192,132,252,0.3)]',
    },
    'pink-400': {
      dark: 'border-pink-400/30 hover:border-pink-400/60',
      light: 'border-pink-400/40 hover:border-pink-400/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(244,114,182,0.3)]',
    },
    'yellow-400': {
      dark: 'border-yellow-400/30 hover:border-yellow-400/60',
      light: 'border-yellow-500/40 hover:border-yellow-500/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(250,204,21,0.3)]',
    },
  }

  const color = colorMap[module.colorTheme.border]
  return {
    border: theme === 'dark' ? color.dark : color.light,
    shadow: theme === 'dark' ? color.shadow : color.shadow.replace('0.3', '0.2'),
  }
}

const getTextColorClass = (color: string, theme: 'dark' | 'light') => {
  const textMap: Record<string, { dark: string; light: string }> = {
    'amber-400': { dark: 'text-amber-400', light: 'text-amber-600' },
    'green-400': { dark: 'text-green-400', light: 'text-green-600' },
    'cyan-400': { dark: 'text-cyan-400', light: 'text-cyan-600' },
    'purple-400': { dark: 'text-purple-400', light: 'text-purple-600' },
    'pink-400': { dark: 'text-pink-400', light: 'text-pink-600' },
    'yellow-400': { dark: 'text-yellow-400', light: 'text-yellow-600' },
  }
  return theme === 'dark' ? textMap[color].dark : textMap[color].light
}

const getGradientClass = (from: string, to: string) => {
  const gradientMap: Record<string, string> = {
    'amber-400-orange-500': 'from-amber-400 to-orange-500',
    'green-400-emerald-500': 'from-green-400 to-emerald-500',
    'cyan-400-blue-500': 'from-cyan-400 to-blue-500',
    'purple-400-violet-500': 'from-purple-400 to-violet-500',
    'pink-400-rose-500': 'from-pink-400 to-rose-500',
    'yellow-400-amber-500': 'from-yellow-400 to-amber-500',
  }
  return gradientMap[`${from}-${to}`] || 'from-gray-400 to-gray-500'
}

const getHoverGradientClass = (from: string) => {
  const hoverMap: Record<string, string> = {
    'amber-400': 'from-amber-400/10',
    'green-400': 'from-green-400/10',
    'cyan-400': 'from-cyan-400/10',
    'purple-400': 'from-purple-400/10',
    'pink-400': 'from-pink-400/10',
    'yellow-400': 'from-yellow-400/10',
  }
  return hoverMap[from] || 'from-gray-400/10'
}

const getGlowClass = (from: string) => {
  const glowMap: Record<string, string> = {
    'amber-400': 'drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]',
    'green-400': 'drop-shadow-[0_0_30px_rgba(74,222,128,0.6)]',
    'cyan-400': 'drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]',
    'purple-400': 'drop-shadow-[0_0_30px_rgba(192,132,252,0.6)]',
    'pink-400': 'drop-shadow-[0_0_30px_rgba(244,114,182,0.6)]',
    'yellow-400': 'drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]',
  }
  return glowMap[from] || ''
}

function ModuleCard({ module }: { module: ModuleConfig }) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const colorClasses = getColorClasses(module, theme)
  const textColorClass = getTextColorClass(module.colorTheme.text, theme)
  const gradientClass = getGradientClass(module.colorTheme.gradientFrom, module.colorTheme.gradientTo)
  const hoverGradientClass = getHoverGradientClass(module.colorTheme.gradientFrom)
  const glowClass = getGlowClass(module.colorTheme.gradientFrom)

  return (
    <div
      className={`group relative rounded-2xl p-4 sm:p-5 text-center
                 transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] ${
        theme === 'dark'
          ? `bg-slate-900/80 border-2 ${colorClasses.border} ${colorClasses.shadow}`
          : `bg-white/90 border-2 ${colorClasses.border} ${colorClasses.shadow}`
      }`}
    >
      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradientClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />

      {/* Icon */}
      <span className={`text-3xl sm:text-4xl mb-2 block ${glowClass}`}>
        {module.icon}
      </span>

      {/* Title */}
      <h2 className={`text-base sm:text-lg font-bold ${textColorClass} mb-0.5`}>
        {t(`home.${module.key}.title`)}
      </h2>

      {/* Subtitle */}
      <p className={`text-xs font-medium mb-1.5 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>
        {t(`home.${module.key}.subtitle`)}
      </p>

      {/* Description */}
      <p className={`text-xs mb-3 leading-relaxed line-clamp-2 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {t(`home.${module.key}.description`)}
      </p>

      {/* Quick Links */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {module.quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.route}
            className={`text-[10px] px-2 py-0.5 rounded-full transition-all
                       hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {t(`home.${module.key}.${link.labelKey}`)}
          </Link>
        ))}
      </div>

      {/* Main CTA Button */}
      <Link
        to={module.mainRoute}
        className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                   bg-gradient-to-r ${gradientClass} text-${module.colorTheme.buttonText}
                   group-hover:scale-105 transition-transform`}
      >
        {t(`home.${module.key}.cta`)}
      </Link>
    </div>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    }`}>
      {/* Settings */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageThemeSwitcher />
      </div>

      {/* Light beam decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[10, 30, 70, 90].map((left, i) => (
          <div
            key={i}
            className={`absolute w-0.5 h-screen bg-gradient-to-b from-transparent to-transparent animate-beam-move ${
              theme === 'dark' ? 'via-cyan-400/30' : 'via-cyan-500/20'
            }`}
            style={{
              left: `${left}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="text-center mb-6 sm:mb-10 md:mb-12 relative z-10 px-2">
        <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-5 animate-pulse-glow">⟡</div>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${
          theme === 'dark'
            ? 'text-cyan-400 drop-shadow-[0_0_30px_rgba(100,200,255,0.5)]'
            : 'text-cyan-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        }`}>
          {t('home.title')}
        </h1>
        <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('home.subtitle')}
        </h2>
        <p className={`text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mx-auto ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('home.description')}
        </p>
      </header>

      {/* Navigation Cards - 6 Creative Modules */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl relative z-10 w-full px-2">
        {MODULES.map((module) => (
          <ModuleCard key={module.key} module={module} />
        ))}
      </nav>

      {/* Footer */}
      <footer className={`mt-6 sm:mt-10 md:mt-12 text-center text-xs sm:text-sm relative z-10 ${
        theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
      }`}>
        <p>
          PolarCraft
        </p>
      </footer>
    </div>
  )
}
