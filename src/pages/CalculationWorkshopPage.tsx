/**
 * Calculation Workshop Page - Hub for Polarization Calculators
 * 计算工坊页面 - 偏振计算工具集中心
 *
 * Provides access to Jones matrix, Mueller matrix, Stokes parameter calculators
 * and Poincaré sphere visualization tools.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Home, Calculator, Grid3X3, BarChart3, Globe2, ArrowRight, Sparkles } from 'lucide-react'

// Calculator tool definitions
interface CalculatorTool {
  id: string
  route: string
  icon: React.ReactNode
  colorClass: string
  bgGradient: string
  features: string[]
}

const CALCULATOR_TOOLS: CalculatorTool[] = [
  {
    id: 'jones',
    route: '/calc/jones',
    icon: <Grid3X3 className="w-8 h-8" />,
    colorClass: 'text-cyan-400',
    bgGradient: 'from-cyan-500/20 to-cyan-600/10',
    features: ['jonesFeature1', 'jonesFeature2', 'jonesFeature3'],
  },
  {
    id: 'mueller',
    route: '/calc/mueller',
    icon: <Calculator className="w-8 h-8" />,
    colorClass: 'text-violet-400',
    bgGradient: 'from-violet-500/20 to-violet-600/10',
    features: ['muellerFeature1', 'muellerFeature2', 'muellerFeature3'],
  },
  {
    id: 'stokes',
    route: '/calc/stokes',
    icon: <BarChart3 className="w-8 h-8" />,
    colorClass: 'text-emerald-400',
    bgGradient: 'from-emerald-500/20 to-emerald-600/10',
    features: ['stokesFeature1', 'stokesFeature2', 'stokesFeature3'],
  },
  {
    id: 'poincare',
    route: '/calc/poincare',
    icon: <Globe2 className="w-8 h-8" />,
    colorClass: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-amber-600/10',
    features: ['poincareFeature1', 'poincareFeature2', 'poincareFeature3'],
  },
]

function ToolCard({ tool }: { tool: CalculatorTool }) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Link
      to={tool.route}
      className={cn(
        'group relative rounded-2xl p-6 transition-all duration-300',
        'hover:scale-[1.02] hover:-translate-y-1',
        'border-2',
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-700/50 hover:border-slate-600'
          : 'bg-white/90 border-slate-200 hover:border-slate-300',
        'hover:shadow-lg'
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        `bg-gradient-to-br ${tool.bgGradient}`
      )} />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and title */}
        <div className="flex items-center gap-4 mb-4">
          <div className={cn(
            'p-3 rounded-xl',
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100',
            tool.colorClass
          )}>
            {tool.icon}
          </div>
          <div>
            <h3 className={cn(
              'text-xl font-bold',
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            )}>
              {t(`calc.tools.${tool.id}.title`)}
            </h3>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            )}>
              {t(`calc.tools.${tool.id}.subtitle`)}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={cn(
          'text-sm mb-4 leading-relaxed',
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        )}>
          {t(`calc.tools.${tool.id}.description`)}
        </p>

        {/* Features list */}
        <ul className="space-y-2 mb-4">
          {tool.features.map((featureKey, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Sparkles className={cn('w-4 h-4', tool.colorClass)} />
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                {t(`calc.tools.${tool.id}.${featureKey}`)}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={cn(
          'flex items-center gap-2 text-sm font-medium',
          tool.colorClass,
          'group-hover:translate-x-1 transition-transform'
        )}>
          {t('calc.openTool')}
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

export function CalculationWorkshopPage() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-xl',
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-slate-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              )}
            >
              <Home className="w-5 h-5" />
            </Link>
            <div>
              <h1 className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              )}>
                {t('calc.title')}
              </h1>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              )}>
                {t('calc.subtitle')}
              </p>
            </div>
          </div>
          <LanguageThemeSwitcher />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4',
            theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
          )}>
            <Calculator className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isZh ? '偏振光学计算工具' : 'Polarization Optics Calculation Tools'}
            </span>
          </div>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold mb-4',
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          )}>
            {t('calc.heroTitle')}
          </h2>
          <p className={cn(
            'text-lg max-w-2xl mx-auto',
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          )}>
            {t('calc.heroDescription')}
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CALCULATOR_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Info section */}
        <div className={cn(
          'mt-12 p-6 rounded-2xl border',
          theme === 'dark'
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        )}>
          <h3 className={cn(
            'text-lg font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          )}>
            {t('calc.aboutTitle')}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          )}>
            {t('calc.aboutDescription')}
          </p>
        </div>
      </main>
    </div>
  )
}
