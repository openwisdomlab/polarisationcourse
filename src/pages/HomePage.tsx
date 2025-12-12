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
    // 光之编年史：故事与实验 (Chronicles of Light)
    key: 'chronicles',
    icon: '📜',
    colorTheme: {
      border: 'cyan-soft', // Soft Cyan #22C7D6
      borderHover: 'cyan-soft',
      shadow: 'rgba(34,199,214,0.25)',
      text: 'cyan-soft',
      gradientFrom: 'cyan-soft',
      gradientTo: 'cyan-600',
      buttonText: 'black',
    },
    mainRoute: '/chronicles',
    quickLinks: [
      { labelKey: 'link1', route: '/chronicles' },
      { labelKey: 'link2', route: '/demos' },
      { labelKey: 'link3', route: '/chronicles' },
    ],
  },
  {
    // 器件工坊：偏振与光路 (Optics Playground)
    key: 'workshop',
    icon: '🔧',
    colorTheme: {
      border: 'indigo-soft', // Soft Indigo #5B6EE1
      borderHover: 'indigo-soft',
      shadow: 'rgba(91,110,225,0.25)',
      text: 'indigo-soft',
      gradientFrom: 'indigo-soft',
      gradientTo: 'indigo-600',
      buttonText: 'white',
    },
    mainRoute: '/hardware',
    quickLinks: [
      { labelKey: 'link1', route: '/hardware' },
      { labelKey: 'link2', route: '/hardware' },
      { labelKey: 'link3', route: '/hardware' },
    ],
  },
  {
    // 基础底座：理论与仿真 (Theory Foundation)
    key: 'formulaLab',
    icon: '📐',
    colorTheme: {
      border: 'slate-soft', // Soft Slate-Blue #6B7A99
      borderHover: 'slate-soft',
      shadow: 'rgba(107,122,153,0.25)',
      text: 'slate-soft',
      gradientFrom: 'slate-soft',
      gradientTo: 'slate-600',
      buttonText: 'white',
    },
    mainRoute: '/demos',
    quickLinks: [
      { labelKey: 'link1', route: '/demos' },
      { labelKey: 'link2', route: '/demos' },
      { labelKey: 'link3', route: '/demos' },
    ],
  },
  {
    // 偏振探秘：光之密室 (PolarQuest: The Light Chamber)
    key: 'polarquest',
    icon: '🎮',
    colorTheme: {
      border: 'amber-soft', // Soft Amber #D9A441
      borderHover: 'amber-soft',
      shadow: 'rgba(217,164,65,0.25)',
      text: 'amber-soft',
      gradientFrom: 'amber-soft',
      gradientTo: 'amber-600',
      buttonText: 'black',
    },
    mainRoute: '/games',
    quickLinks: [
      { labelKey: 'link1', route: '/games/2d' },
      { labelKey: 'link2', route: '/games/3d' },
      { labelKey: 'link3', route: '/games' },
    ],
  },
  {
    // 偏振造物局：文创与作品 (PolarCraft Studio)
    key: 'gallery',
    icon: '🎨',
    colorTheme: {
      border: 'rose-soft', // Soft Rose #D97A8A
      borderHover: 'rose-soft',
      shadow: 'rgba(217,122,138,0.25)',
      text: 'rose-soft',
      gradientFrom: 'rose-soft',
      gradientTo: 'rose-600',
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
    // 虚拟课题组：光研社 (Virtual Lab Group: Light Research Guild)
    key: 'labGroup',
    icon: '🔬',
    colorTheme: {
      border: 'emerald-soft', // Soft Emerald #3AAE8C
      borderHover: 'emerald-soft',
      shadow: 'rgba(58,174,140,0.25)',
      text: 'emerald-soft',
      gradientFrom: 'emerald-soft',
      gradientTo: 'emerald-600',
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

// Color mapping for Tailwind classes - using softer, eye-friendly colors
const getColorClasses = (module: ModuleConfig, theme: 'dark' | 'light') => {
  // Soft color palette for reduced eye strain
  const colorMap: Record<string, { dark: string; light: string; shadow: string }> = {
    // Soft Cyan #22C7D6 - Chronicles of Light
    'cyan-soft': {
      dark: 'border-[#22C7D6]/30 hover:border-[#22C7D6]/60',
      light: 'border-[#22C7D6]/40 hover:border-[#22C7D6]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(34,199,214,0.25)]',
    },
    // Soft Indigo #5B6EE1 - Optics Playground
    'indigo-soft': {
      dark: 'border-[#5B6EE1]/30 hover:border-[#5B6EE1]/60',
      light: 'border-[#5B6EE1]/40 hover:border-[#5B6EE1]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(91,110,225,0.25)]',
    },
    // Soft Slate-Blue #6B7A99 - Theory Foundation
    'slate-soft': {
      dark: 'border-[#6B7A99]/30 hover:border-[#6B7A99]/60',
      light: 'border-[#6B7A99]/40 hover:border-[#6B7A99]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(107,122,153,0.25)]',
    },
    // Soft Amber #D9A441 - PolarQuest
    'amber-soft': {
      dark: 'border-[#D9A441]/30 hover:border-[#D9A441]/60',
      light: 'border-[#D9A441]/40 hover:border-[#D9A441]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(217,164,65,0.25)]',
    },
    // Soft Rose #D97A8A - PolarCraft Studio
    'rose-soft': {
      dark: 'border-[#D97A8A]/30 hover:border-[#D97A8A]/60',
      light: 'border-[#D97A8A]/40 hover:border-[#D97A8A]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(217,122,138,0.25)]',
    },
    // Soft Emerald #3AAE8C - Virtual Lab Group
    'emerald-soft': {
      dark: 'border-[#3AAE8C]/30 hover:border-[#3AAE8C]/60',
      light: 'border-[#3AAE8C]/40 hover:border-[#3AAE8C]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(58,174,140,0.25)]',
    },
  }

  const color = colorMap[module.colorTheme.border]
  return {
    border: theme === 'dark' ? color.dark : color.light,
    shadow: theme === 'dark' ? color.shadow : color.shadow.replace('0.25', '0.2'),
  }
}

const getTextColorClass = (color: string, theme: 'dark' | 'light') => {
  // Soft color text classes
  const textMap: Record<string, { dark: string; light: string }> = {
    'cyan-soft': { dark: 'text-[#22C7D6]', light: 'text-[#1BA3AD]' },
    'indigo-soft': { dark: 'text-[#5B6EE1]', light: 'text-[#4A5CC9]' },
    'slate-soft': { dark: 'text-[#6B7A99]', light: 'text-[#5A6882]' },
    'amber-soft': { dark: 'text-[#D9A441]', light: 'text-[#B88A35]' },
    'rose-soft': { dark: 'text-[#D97A8A]', light: 'text-[#C06575]' },
    'emerald-soft': { dark: 'text-[#3AAE8C]', light: 'text-[#2E9375]' },
  }
  return theme === 'dark' ? textMap[color].dark : textMap[color].light
}

const getGradientClass = (from: string, to: string) => {
  // Soft gradient classes
  const gradientMap: Record<string, string> = {
    'cyan-soft-cyan-600': 'from-[#22C7D6] to-[#0891B2]',
    'indigo-soft-indigo-600': 'from-[#5B6EE1] to-[#4F46E5]',
    'slate-soft-slate-600': 'from-[#6B7A99] to-[#475569]',
    'amber-soft-amber-600': 'from-[#D9A441] to-[#D97706]',
    'rose-soft-rose-600': 'from-[#D97A8A] to-[#E11D48]',
    'emerald-soft-emerald-600': 'from-[#3AAE8C] to-[#059669]',
  }
  return gradientMap[`${from}-${to}`] || 'from-gray-400 to-gray-500'
}

const getHoverGradientClass = (from: string) => {
  // Soft hover gradient classes
  const hoverMap: Record<string, string> = {
    'cyan-soft': 'from-[#22C7D6]/10',
    'indigo-soft': 'from-[#5B6EE1]/10',
    'slate-soft': 'from-[#6B7A99]/10',
    'amber-soft': 'from-[#D9A441]/10',
    'rose-soft': 'from-[#D97A8A]/10',
    'emerald-soft': 'from-[#3AAE8C]/10',
  }
  return hoverMap[from] || 'from-gray-400/10'
}

const getGlowClass = (from: string) => {
  // Softer glow effects for reduced eye strain
  const glowMap: Record<string, string> = {
    'cyan-soft': 'drop-shadow-[0_0_20px_rgba(34,199,214,0.4)]',
    'indigo-soft': 'drop-shadow-[0_0_20px_rgba(91,110,225,0.4)]',
    'slate-soft': 'drop-shadow-[0_0_20px_rgba(107,122,153,0.4)]',
    'amber-soft': 'drop-shadow-[0_0_20px_rgba(217,164,65,0.4)]',
    'rose-soft': 'drop-shadow-[0_0_20px_rgba(217,122,138,0.4)]',
    'emerald-soft': 'drop-shadow-[0_0_20px_rgba(58,174,140,0.4)]',
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
