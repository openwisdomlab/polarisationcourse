/**
 * Theory Hub Page - Theory & Simulation Module (Redesigned)
 * 理论中心页面 - 基本理论和计算模拟模块
 *
 * Redesigned to include:
 * 1. Theoretical Foundations - core physics concepts organized by unit
 * 2. Interactive Demos - link to demos page
 * 3. Calculation Workshop - link to calculators
 *
 * 确保科学依据准确，避免信息过载，增加理论基础介绍
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { PersistentHeader } from '@/components/shared/PersistentHeader'
import {
  FlaskConical, Calculator, Atom, BookOpen,
  ChevronDown, ArrowRight, Waves, Zap
} from 'lucide-react'

// 理论基础单元定义 - 按课程单元组织，每个包含核心物理概念和公式
interface TheoryUnit {
  id: string
  unitNum: number // 0=basics, 1-5=course units
  color: string
  demoLinks: Array<{ id: string; labelKey: string }>
  calcLink?: string // 关联的计算工具路径
}

const THEORY_UNITS: TheoryUnit[] = [
  {
    id: 'basics',
    unitNum: 0,
    color: 'amber',
    demoLinks: [
      { id: 'em-wave', labelKey: 'basics.demos.emWave.title' },
      { id: 'polarization-intro', labelKey: 'basics.demos.polarizationIntro.title' },
      { id: 'polarization-types-unified', labelKey: 'basics.demos.polarizationTypesUnified.title' },
    ],
  },
  {
    id: 'unit1',
    unitNum: 1,
    color: 'cyan',
    demoLinks: [
      { id: 'malus', labelKey: 'demos.malus.title' },
      { id: 'birefringence', labelKey: 'demos.birefringence.title' },
      { id: 'waveplate', labelKey: 'demos.waveplate.title' },
    ],
  },
  {
    id: 'unit2',
    unitNum: 2,
    color: 'purple',
    demoLinks: [
      { id: 'fresnel', labelKey: 'demos.fresnel.title' },
      { id: 'brewster', labelKey: 'demos.brewster.title' },
    ],
  },
  {
    id: 'unit3',
    unitNum: 3,
    color: 'green',
    demoLinks: [
      { id: 'chromatic', labelKey: 'demos.chromatic.title' },
      { id: 'optical-rotation', labelKey: 'demos.opticalRotation.title' },
      { id: 'anisotropy', labelKey: 'demos.anisotropy.title' },
    ],
  },
  {
    id: 'unit4',
    unitNum: 4,
    color: 'orange',
    demoLinks: [
      { id: 'rayleigh', labelKey: 'demos.rayleigh.title' },
      { id: 'mie-scattering', labelKey: 'demos.mieScattering.title' },
      { id: 'monte-carlo-scattering', labelKey: 'demos.monteCarloScattering.title' },
    ],
  },
  {
    id: 'unit5',
    unitNum: 5,
    color: 'pink',
    demoLinks: [
      { id: 'stokes', labelKey: 'demos.stokes.title' },
      { id: 'mueller', labelKey: 'demos.mueller.title' },
      { id: 'jones', labelKey: 'demos.jones.title' },
    ],
    calcLink: '/calc',
  },
]

// 获取单元颜色样式
function getUnitColors(color: string, theme: string) {
  const colorMap: Record<string, { bg: string; border: string; text: string; accent: string; dot: string }> = {
    amber: {
      bg: theme === 'dark' ? 'bg-amber-400/5' : 'bg-amber-50',
      border: theme === 'dark' ? 'border-amber-400/20' : 'border-amber-200',
      text: theme === 'dark' ? 'text-amber-400' : 'text-amber-700',
      accent: theme === 'dark' ? 'text-amber-300' : 'text-amber-600',
      dot: 'bg-amber-400',
    },
    cyan: {
      bg: theme === 'dark' ? 'bg-cyan-400/5' : 'bg-cyan-50',
      border: theme === 'dark' ? 'border-cyan-400/20' : 'border-cyan-200',
      text: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700',
      accent: theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600',
      dot: 'bg-cyan-400',
    },
    purple: {
      bg: theme === 'dark' ? 'bg-purple-400/5' : 'bg-purple-50',
      border: theme === 'dark' ? 'border-purple-400/20' : 'border-purple-200',
      text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700',
      accent: theme === 'dark' ? 'text-purple-300' : 'text-purple-600',
      dot: 'bg-purple-400',
    },
    green: {
      bg: theme === 'dark' ? 'bg-green-400/5' : 'bg-green-50',
      border: theme === 'dark' ? 'border-green-400/20' : 'border-green-200',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
      accent: theme === 'dark' ? 'text-green-300' : 'text-green-600',
      dot: 'bg-green-400',
    },
    orange: {
      bg: theme === 'dark' ? 'bg-orange-400/5' : 'bg-orange-50',
      border: theme === 'dark' ? 'border-orange-400/20' : 'border-orange-200',
      text: theme === 'dark' ? 'text-orange-400' : 'text-orange-700',
      accent: theme === 'dark' ? 'text-orange-300' : 'text-orange-600',
      dot: 'bg-orange-400',
    },
    pink: {
      bg: theme === 'dark' ? 'bg-pink-400/5' : 'bg-pink-50',
      border: theme === 'dark' ? 'border-pink-400/20' : 'border-pink-200',
      text: theme === 'dark' ? 'text-pink-400' : 'text-pink-700',
      accent: theme === 'dark' ? 'text-pink-300' : 'text-pink-600',
      dot: 'bg-pink-400',
    },
  }
  return colorMap[color] || colorMap.cyan
}

// 理论单元卡片组件
function TheoryUnitCard({ unit }: { unit: TheoryUnit }) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState(false)
  const colors = getUnitColors(unit.color, theme)

  // 获取翻译键
  const titleKey = unit.id === 'basics'
    ? 'theory.foundations.basics.title'
    : `theory.foundations.${unit.id}.title`
  const summaryKey = unit.id === 'basics'
    ? 'theory.foundations.basics.summary'
    : `theory.foundations.${unit.id}.summary`
  const formulaKey = unit.id === 'basics'
    ? 'theory.foundations.basics.formula'
    : `theory.foundations.${unit.id}.formula`
  const conceptsKeyBase = unit.id === 'basics'
    ? 'theory.foundations.basics.concepts'
    : `theory.foundations.${unit.id}.concepts`

  const title = t(titleKey)
  const summary = t(summaryKey)
  const formula = t(formulaKey)
  const hasFormula = formula && !formula.includes('foundations.')

  // 获取核心概念列表（最多3个）
  const concepts = [0, 1, 2]
    .map(i => t(`${conceptsKeyBase}.${i}`))
    .filter(c => c && !c.includes('foundations.'))

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all duration-300',
      colors.bg, colors.border,
      expanded && (theme === 'dark' ? 'shadow-lg' : 'shadow-md')
    )}>
      {/* 单元头部 - 可展开 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-start gap-3 p-4 text-left transition-colors',
          'hover:bg-black/5 dark:hover:bg-white/5'
        )}
      >
        {/* 单元编号 */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
          colors.dot, 'text-black'
        )}>
          {unit.unitNum === 0 ? '0' : unit.unitNum}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-bold text-base mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed line-clamp-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {summary}
          </p>

          {/* 核心公式预览（折叠时显示） */}
          {hasFormula && !expanded && (
            <div className={cn(
              'mt-2 text-sm font-mono',
              colors.text
            )}>
              {formula}
            </div>
          )}
        </div>

        <ChevronDown className={cn(
          'w-5 h-5 flex-shrink-0 mt-1 transition-transform duration-300',
          expanded && 'rotate-180',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )} />
      </button>

      {/* 展开内容 */}
      <div className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden',
        expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className={cn(
          'px-4 pb-4 space-y-3 border-t',
          theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200/50'
        )}>
          {/* 核心公式 */}
          {hasFormula && (
            <div className={cn(
              'mt-3 p-3 rounded-lg border',
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
            )}>
              <div className={cn(
                'text-xs font-medium uppercase tracking-wide mb-1.5',
                colors.text
              )}>
                {t('theory.keyFormula')}
              </div>
              <div className={cn(
                'text-base font-mono',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {formula}
              </div>
            </div>
          )}

          {/* 核心概念 */}
          {concepts.length > 0 && (
            <div className="space-y-1.5">
              <div className={cn(
                'text-xs font-medium uppercase tracking-wide',
                colors.text
              )}>
                {t('theory.keyConcepts')}
              </div>
              <ul className="space-y-1">
                {concepts.map((concept, i) => (
                  <li key={i} className={cn(
                    'text-sm flex items-start gap-2',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', colors.dot)} />
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 关联演示链接 */}
          <div className="flex flex-wrap gap-2 pt-1">
            {unit.demoLinks.map(link => (
              <Link
                key={link.id}
                to={`/demos/${link.id}`}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                  'hover:-translate-y-0.5 hover:shadow-sm',
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-800/50 text-gray-300 hover:text-white hover:border-slate-500'
                    : 'border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:border-gray-300'
                )}
              >
                <FlaskConical className="w-3 h-3" />
                {t(link.labelKey)}
              </Link>
            ))}
            {unit.calcLink && (
              <Link
                to={unit.calcLink}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                  'hover:-translate-y-0.5 hover:shadow-sm',
                  theme === 'dark'
                    ? 'border-violet-500/30 bg-violet-500/10 text-violet-300 hover:text-violet-200 hover:border-violet-500/50'
                    : 'border-violet-200 bg-violet-50 text-violet-700 hover:text-violet-900 hover:border-violet-300'
                )}
              >
                <Calculator className="w-3 h-3" />
                {t('theory.openCalc')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 四大公理卡片
function FourAxioms() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const axioms = [
    { icon: '90°', colorClass: theme === 'dark' ? 'text-red-400' : 'text-red-600' },
    { icon: 'cos²', colorClass: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600' },
    { icon: 'o/e', colorClass: theme === 'dark' ? 'text-green-400' : 'text-green-600' },
    { icon: '±', colorClass: theme === 'dark' ? 'text-purple-400' : 'text-purple-600' },
  ]

  return (
    <div className={cn(
      'rounded-xl border p-4 sm:p-5',
      theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-200'
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
        <h3 className={cn(
          'font-bold text-base',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {t('theory.fourAxioms.title')}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {axioms.map((axiom, i) => (
          <div key={i} className={cn(
            'flex items-start gap-3 p-3 rounded-lg border',
            theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200'
          )}>
            <span className={cn('text-lg font-mono font-bold flex-shrink-0 w-10 text-center', axiom.colorClass)}>
              {axiom.icon}
            </span>
            <div>
              <div className={cn(
                'text-sm font-semibold mb-0.5',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t(`theory.fourAxioms.axiom${i + 1}.name`)}
              </div>
              <div className={cn(
                'text-xs leading-relaxed',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {t(`theory.fourAxioms.axiom${i + 1}.desc`)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 工具快速入口
function ToolEntries() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const tools = [
    {
      route: '/demos',
      icon: FlaskConical,
      titleKey: 'theory.tools.demos.title',
      descKey: 'theory.tools.demos.desc',
      color: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
      bg: theme === 'dark' ? 'from-cyan-400/10 to-blue-400/5' : 'from-cyan-50 to-blue-50',
    },
    {
      route: '/calc',
      icon: Calculator,
      titleKey: 'theory.tools.calc.title',
      descKey: 'theory.tools.calc.desc',
      color: theme === 'dark' ? 'text-violet-400' : 'text-violet-600',
      bg: theme === 'dark' ? 'from-violet-400/10 to-purple-400/5' : 'from-violet-50 to-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tools.map(tool => {
        const Icon = tool.icon
        return (
          <Link
            key={tool.route}
            to={tool.route}
            className={cn(
              'group relative rounded-xl border p-5 transition-all duration-300',
              'hover:-translate-y-1 hover:shadow-lg',
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
            )}
          >
            <div className={cn('absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity', tool.bg)} />
            <div className="relative">
              <Icon className={cn('w-8 h-8 mb-3', tool.color)} />
              <h3 className={cn(
                'font-bold text-lg mb-1',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t(tool.titleKey)}
              </h3>
              <p className={cn(
                'text-sm leading-relaxed mb-3',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {t(tool.descKey)}
              </p>
              <div className={cn(
                'flex items-center gap-1.5 text-sm font-medium',
                tool.color
              )}>
                <span>{t('theory.enter')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export function TheoryHubPage() {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]'
    )}>
      {/* Header */}
      <PersistentHeader
        moduleKey="formulaLab"
        moduleName={isZh ? '理论与模拟' : 'Theory & Simulation'}
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark'
            ? 'bg-slate-900/80 border-b border-slate-700'
            : 'bg-white/80 border-b border-gray-200'
        )}
      />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Hero section */}
        <div className="text-center">
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm mb-4',
            theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
          )}>
            <Atom className="w-4 h-4" />
            <span>{t('theory.badge')}</span>
          </div>
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {t('theory.title')}
          </h2>
          <p className={cn(
            'text-base max-w-2xl mx-auto leading-relaxed',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {t('theory.subtitle')}
          </p>
        </div>

        {/* 四大公理 - 偏振光学的物理基础 */}
        <FourAxioms />

        {/* 理论基础 - 按单元组织 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className={cn('w-5 h-5', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')} />
            <h2 className={cn(
              'font-bold text-lg',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t('theory.foundationsTitle')}
            </h2>
          </div>
          <div className="space-y-3">
            {THEORY_UNITS.map(unit => (
              <TheoryUnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        </section>

        {/* 工具快速入口 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Waves className={cn('w-5 h-5', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')} />
            <h2 className={cn(
              'font-bold text-lg',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t('theory.toolsTitle')}
            </h2>
          </div>
          <ToolEntries />
        </section>
      </main>
    </div>
  )
}

export default TheoryHubPage
