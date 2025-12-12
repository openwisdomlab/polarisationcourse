import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { ModuleIconMap, type ModuleIconKey } from '@/components/icons'

// Module configuration for the 9 creative hubs
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
    // 光的编年史：历史故事 × 动手实验 (Chronicles of Light)
    key: 'chronicles',
    icon: '⏳', // Hourglass - represents history and time
    colorTheme: {
      border: 'amber-warm', // Warm Amber #C9A227 (parchment/historical feel)
      borderHover: 'amber-warm',
      shadow: 'rgba(201,162,39,0.25)',
      text: 'amber-warm',
      gradientFrom: 'amber-warm',
      gradientTo: 'amber-700',
      buttonText: 'black',
    },
    mainRoute: '/chronicles',
    quickLinks: [
      { labelKey: 'link1', route: '/chronicles?event=1808' }, // Malus discovery
      { labelKey: 'link2', route: '/demos?demo=malus-law' }, // Direct to Malus law demo
      { labelKey: 'link3', route: '/chronicles?track=polarization' },
    ],
  },
  {
    // 偏振器件库：器件原理 × 分类图鉴 (Polarization Device Library)
    key: 'deviceLibrary',
    icon: '◈', // Diamond with dot - represents optical crystal/prism
    colorTheme: {
      border: 'sapphire-soft', // Sapphire Blue #4169E1
      borderHover: 'sapphire-soft',
      shadow: 'rgba(65,105,225,0.25)',
      text: 'sapphire-soft',
      gradientFrom: 'sapphire-soft',
      gradientTo: 'blue-700',
      buttonText: 'white',
    },
    mainRoute: '/devices',
    quickLinks: [
      { labelKey: 'link1', route: '/devices?category=polarizers' },
      { labelKey: 'link2', route: '/devices?category=waveplates' },
      { labelKey: 'link3', route: '/devices?category=splitters' },
    ],
  },
  {
    // 光路设计室：搭建光路 × 模拟验证 (Optical Path Designer)
    key: 'opticalBench',
    icon: '⟠', // Circled cross - represents optical alignment/bench
    colorTheme: {
      border: 'violet-soft', // Soft Violet #8B5CF6
      borderHover: 'violet-soft',
      shadow: 'rgba(139,92,246,0.25)',
      text: 'violet-soft',
      gradientFrom: 'violet-soft',
      gradientTo: 'violet-600',
      buttonText: 'white',
    },
    mainRoute: '/bench',
    quickLinks: [
      { labelKey: 'link1', route: '/bench?setup=malus-law' },
      { labelKey: 'link2', route: '/bench?mode=free' },
      { labelKey: 'link3', route: '/devices?category=uc2' },
    ],
  },
  {
    // 偏振演示馆：可视化演示 × 交互模拟 (Polarization Demo Gallery - renamed from 理论基石)
    key: 'formulaLab',
    icon: '◐', // Half-filled circle - represents polarizer
    colorTheme: {
      border: 'cyan-deep', // Deep Cyan #0891B2
      borderHover: 'cyan-deep',
      shadow: 'rgba(8,145,178,0.25)',
      text: 'cyan-deep',
      gradientFrom: 'cyan-deep',
      gradientTo: 'cyan-700',
      buttonText: 'white',
    },
    mainRoute: '/demos',
    quickLinks: [
      { labelKey: 'link1', route: '/demos?demo=malus-law' },
      { labelKey: 'link2', route: '/demos?demo=birefringence' },
      { labelKey: 'link3', route: '/demos?demo=stokes-vector' },
    ],
  },
  {
    // 偏振探秘：光之密室 (PolarQuest: The Light Chamber)
    key: 'polarquest',
    icon: '⬢', // Hexagon - represents game/puzzle block
    colorTheme: {
      border: 'gold-soft', // Soft Gold #DAA520
      borderHover: 'gold-soft',
      shadow: 'rgba(218,165,32,0.25)',
      text: 'gold-soft',
      gradientFrom: 'gold-soft',
      gradientTo: 'amber-600',
      buttonText: 'black',
    },
    mainRoute: '/games',
    quickLinks: [
      { labelKey: 'link1', route: '/game2d?level=0' },
      { labelKey: 'link2', route: '/game?level=0' },
      { labelKey: 'link3', route: '/games?mode=challenge' },
    ],
  },
  {
    // 偏振造物局：文创与作品 (PolarCraft Studio)
    key: 'gallery',
    icon: '✧', // Sparkle - represents art and creativity
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
      { labelKey: 'link1', route: '/merchandise?tab=gallery' },
      { labelKey: 'link2', route: '/merchandise?tab=generator' },
      { labelKey: 'link3', route: '/merchandise?tab=products' },
    ],
  },
  {
    // 虚拟课题组：光研社 (Virtual Lab Group: Light Research Guild)
    key: 'labGroup',
    icon: '⚗', // Alembic - represents research/lab
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
      { labelKey: 'link1', route: '/lab?tab=tasks' },
      { labelKey: 'link2', route: '/lab?tab=analysis' },
      { labelKey: 'link3', route: '/lab?tab=frontier' },
    ],
  },
  {
    // 偏振应用图鉴：现实场景 × 原理解析 (Polarization Applications Gallery)
    key: 'applications',
    icon: '⊛', // Circled asterisk - represents applications/branching
    colorTheme: {
      border: 'coral-soft', // Soft Coral #E57373
      borderHover: 'coral-soft',
      shadow: 'rgba(229,115,115,0.25)',
      text: 'coral-soft',
      gradientFrom: 'coral-soft',
      gradientTo: 'red-500',
      buttonText: 'white',
    },
    mainRoute: '/applications',
    quickLinks: [
      { labelKey: 'link1', route: '/applications?id=lcd-display' },
      { labelKey: 'link2', route: '/applications?category=nature&id=bee-navigation' },
      { labelKey: 'link3', route: '/applications?category=medical' },
    ],
  },
  {
    // 偏振实验手册：DIY × 家庭实验 (DIY Experiments Handbook)
    key: 'experiments',
    icon: '⚡', // Lightning - represents hands-on experiments
    colorTheme: {
      border: 'teal-soft', // Soft Teal #2AA198
      borderHover: 'teal-soft',
      shadow: 'rgba(42,161,152,0.25)',
      text: 'teal-soft',
      gradientFrom: 'teal-soft',
      gradientTo: 'teal-600',
      buttonText: 'white',
    },
    mainRoute: '/experiments',
    quickLinks: [
      { labelKey: 'link1', route: '/experiments?id=phone-screen-test' },
      { labelKey: 'link2', route: '/experiments?id=tape-art' },
      { labelKey: 'link3', route: '/experiments' },
    ],
  },
]

// Color mapping for Tailwind classes - using softer, eye-friendly colors
const getColorClasses = (module: ModuleConfig, theme: 'dark' | 'light') => {
  // Soft color palette for reduced eye strain
  const colorMap: Record<string, { dark: string; light: string; shadow: string }> = {
    // Warm Amber #C9A227 - Chronicles of Light (historical parchment feel)
    'amber-warm': {
      dark: 'border-[#C9A227]/30 hover:border-[#C9A227]/60',
      light: 'border-[#C9A227]/40 hover:border-[#C9A227]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(201,162,39,0.25)]',
    },
    // Sapphire Blue #4169E1 - Device Library (crystal/prism blue)
    'sapphire-soft': {
      dark: 'border-[#4169E1]/30 hover:border-[#4169E1]/60',
      light: 'border-[#4169E1]/40 hover:border-[#4169E1]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(65,105,225,0.25)]',
    },
    // Soft Violet #8B5CF6 - Optical Bench
    'violet-soft': {
      dark: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60',
      light: 'border-[#8B5CF6]/40 hover:border-[#8B5CF6]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(139,92,246,0.25)]',
    },
    // Deep Cyan #0891B2 - Demo Gallery (scientific/technical)
    'cyan-deep': {
      dark: 'border-[#0891B2]/30 hover:border-[#0891B2]/60',
      light: 'border-[#0891B2]/40 hover:border-[#0891B2]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(8,145,178,0.25)]',
    },
    // Soft Gold #DAA520 - PolarQuest (gaming gold)
    'gold-soft': {
      dark: 'border-[#DAA520]/30 hover:border-[#DAA520]/60',
      light: 'border-[#DAA520]/40 hover:border-[#DAA520]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(218,165,32,0.25)]',
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
    // Soft Coral #E57373 - Applications Gallery (warm/inviting)
    'coral-soft': {
      dark: 'border-[#E57373]/30 hover:border-[#E57373]/60',
      light: 'border-[#E57373]/40 hover:border-[#E57373]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(229,115,115,0.25)]',
    },
    // Soft Teal #2AA198 - DIY Experiments
    'teal-soft': {
      dark: 'border-[#2AA198]/30 hover:border-[#2AA198]/60',
      light: 'border-[#2AA198]/40 hover:border-[#2AA198]/70',
      shadow: 'hover:shadow-[0_15px_40px_rgba(42,161,152,0.25)]',
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
    'amber-warm': { dark: 'text-[#C9A227]', light: 'text-[#A68620]' },
    'sapphire-soft': { dark: 'text-[#4169E1]', light: 'text-[#3558C4]' },
    'violet-soft': { dark: 'text-[#8B5CF6]', light: 'text-[#7C3AED]' },
    'cyan-deep': { dark: 'text-[#0891B2]', light: 'text-[#067B96]' },
    'gold-soft': { dark: 'text-[#DAA520]', light: 'text-[#B8891A]' },
    'rose-soft': { dark: 'text-[#D97A8A]', light: 'text-[#C06575]' },
    'emerald-soft': { dark: 'text-[#3AAE8C]', light: 'text-[#2E9375]' },
    'coral-soft': { dark: 'text-[#E57373]', light: 'text-[#C75050]' },
    'teal-soft': { dark: 'text-[#2AA198]', light: 'text-[#238B83]' },
  }
  return theme === 'dark' ? textMap[color].dark : textMap[color].light
}

const getGradientClass = (from: string, to: string) => {
  // Soft gradient classes
  const gradientMap: Record<string, string> = {
    'amber-warm-amber-700': 'from-[#C9A227] to-[#92650F]',
    'sapphire-soft-blue-700': 'from-[#4169E1] to-[#1D4ED8]',
    'violet-soft-violet-600': 'from-[#8B5CF6] to-[#7C3AED]',
    'cyan-deep-cyan-700': 'from-[#0891B2] to-[#0E7490]',
    'gold-soft-amber-600': 'from-[#DAA520] to-[#D97706]',
    'rose-soft-rose-600': 'from-[#D97A8A] to-[#E11D48]',
    'emerald-soft-emerald-600': 'from-[#3AAE8C] to-[#059669]',
    'coral-soft-red-500': 'from-[#E57373] to-[#EF4444]',
    'teal-soft-teal-600': 'from-[#2AA198] to-[#0D9488]',
  }
  return gradientMap[`${from}-${to}`] || 'from-gray-400 to-gray-500'
}

const getHoverGradientClass = (from: string) => {
  // Soft hover gradient classes
  const hoverMap: Record<string, string> = {
    'cyan-soft': 'from-[#22C7D6]/10',
    'indigo-soft': 'from-[#5B6EE1]/10',
    'violet-soft': 'from-[#8B5CF6]/10',
    'slate-soft': 'from-[#6B7A99]/10',
    'amber-soft': 'from-[#D9A441]/10',
    'rose-soft': 'from-[#D97A8A]/10',
    'emerald-soft': 'from-[#3AAE8C]/10',
    'orange-soft': 'from-[#E8884A]/10',
    'teal-soft': 'from-[#2AA198]/10',
  }
  return hoverMap[from] || 'from-gray-400/10'
}

const getGlowClass = (from: string) => {
  // Softer glow effects for reduced eye strain
  const glowMap: Record<string, string> = {
    'cyan-soft': 'drop-shadow-[0_0_20px_rgba(34,199,214,0.4)]',
    'indigo-soft': 'drop-shadow-[0_0_20px_rgba(91,110,225,0.4)]',
    'violet-soft': 'drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    'slate-soft': 'drop-shadow-[0_0_20px_rgba(107,122,153,0.4)]',
    'amber-soft': 'drop-shadow-[0_0_20px_rgba(217,164,65,0.4)]',
    'rose-soft': 'drop-shadow-[0_0_20px_rgba(217,122,138,0.4)]',
    'emerald-soft': 'drop-shadow-[0_0_20px_rgba(58,174,140,0.4)]',
    'orange-soft': 'drop-shadow-[0_0_20px_rgba(232,136,74,0.4)]',
    'teal-soft': 'drop-shadow-[0_0_20px_rgba(42,161,152,0.4)]',
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
      <div className="mb-2 flex justify-center">
        {(() => {
          const IconComponent = ModuleIconMap[module.key as ModuleIconKey]
          if (IconComponent) {
            return (
              <IconComponent
                size={48}
                className={`group-hover:scale-110 transition-transform duration-300 ${glowClass}`}
              />
            )
          }
          return <span className={`text-3xl sm:text-4xl ${glowClass}`}>{module.icon}</span>
        })()}
      </div>

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
