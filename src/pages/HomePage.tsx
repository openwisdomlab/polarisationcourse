/**
 * HomePage - PSRT Course Homepage
 * 首页 - 以五单元课程大纲为主框架
 *
 * 架构：以PSRT课程大纲的5个单元为核心展开
 * 将"偏振演示馆"、"光学设计室"、"光的编年史"融合到每个单元中
 * 采用探索和游戏化模式，避免信息过载
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { PolarizedLightHero } from '@/components/effects'
import { useCourseProgress } from '@/hooks'
import { cn } from '@/lib/utils'
import {
  Play,
  Lightbulb,
  BookOpen,
  FlaskConical,
  ArrowRight,
  Eye,
  ChevronDown,
  Sparkles,
  Zap,
  Microscope,
  Sun,
  Layers,
  History,
  Gamepad2,
  Calculator,
  Compass,
  Target,
  Beaker,
} from 'lucide-react'

// ============================================================================
// 课程大纲数据结构 - 5个单元
// ============================================================================

interface UnitResource {
  type: 'demo' | 'experiment' | 'history' | 'game' | 'tool'
  id: string
  titleKey: string
  link: string
  icon?: React.ReactNode
}

interface CourseSection {
  id: string
  titleKey: string
  descKey: string
  resources: UnitResource[]
}

interface CourseUnit {
  id: string
  number: number
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  icon: React.ReactNode
  color: string
  gradient: string
  bgPattern: string
  sections: CourseSection[]
  keyExperiment?: {
    titleKey: string
    link: string
  }
}

// 5个单元课程数据
const COURSE_UNITS: CourseUnit[] = [
  {
    // 第一单元：光的偏振态及其调制和测量
    id: 'unit1',
    number: 1,
    titleKey: 'home.units.unit1.title',
    subtitleKey: 'home.units.unit1.subtitle',
    descriptionKey: 'home.units.unit1.description',
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
    bgPattern: 'radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit1.keyExp',
      link: '/demos/birefringence',
    },
    sections: [
      {
        id: '1.1',
        titleKey: 'home.units.unit1.s1.title',
        descKey: 'home.units.unit1.s1.desc',
        resources: [
          { type: 'demo', id: 'light-wave', titleKey: 'home.res.lightWave', link: '/demos/light-wave', icon: <Sparkles className="w-4 h-4" /> },
          { type: 'demo', id: 'polarization-intro', titleKey: 'home.res.polarIntro', link: '/demos/polarization-intro', icon: <Eye className="w-4 h-4" /> },
        ],
      },
      {
        id: '1.2',
        titleKey: 'home.units.unit1.s2.title',
        descKey: 'home.units.unit1.s2.desc',
        resources: [
          { type: 'demo', id: 'birefringence', titleKey: 'home.res.birefringence', link: '/demos/birefringence', icon: <Layers className="w-4 h-4" /> },
          { type: 'history', id: 'calcite-history', titleKey: 'home.res.calciteHistory', link: '/chronicles?topic=calcite', icon: <History className="w-4 h-4" /> },
        ],
      },
      {
        id: '1.3',
        titleKey: 'home.units.unit1.s3.title',
        descKey: 'home.units.unit1.s3.desc',
        resources: [
          { type: 'demo', id: 'malus', titleKey: 'home.res.malus', link: '/demos/malus', icon: <Target className="w-4 h-4" /> },
          { type: 'experiment', id: 'malus-exp', titleKey: 'home.res.malusExp', link: '/optical-studio?exp=malus', icon: <FlaskConical className="w-4 h-4" /> },
          { type: 'history', id: 'malus-history', titleKey: 'home.res.malusHistory', link: '/chronicles?topic=malus', icon: <History className="w-4 h-4" /> },
          { type: 'game', id: 'game-level0', titleKey: 'home.res.gameLevel0', link: '/games/2d?level=0', icon: <Gamepad2 className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第二单元：界面反射的偏振特征
    id: 'unit2',
    number: 2,
    titleKey: 'home.units.unit2.title',
    subtitleKey: 'home.units.unit2.subtitle',
    descriptionKey: 'home.units.unit2.description',
    icon: <Zap className="w-5 h-5" />,
    color: '#A78BFA',
    gradient: 'from-violet-500 to-purple-500',
    bgPattern: 'radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit2.keyExp',
      link: '/demos/brewster',
    },
    sections: [
      {
        id: '2.1',
        titleKey: 'home.units.unit2.s1.title',
        descKey: 'home.units.unit2.s1.desc',
        resources: [
          { type: 'demo', id: 'fresnel', titleKey: 'home.res.fresnel', link: '/demos/fresnel', icon: <Sparkles className="w-4 h-4" /> },
        ],
      },
      {
        id: '2.2',
        titleKey: 'home.units.unit2.s2.title',
        descKey: 'home.units.unit2.s2.desc',
        resources: [
          { type: 'demo', id: 'brewster', titleKey: 'home.res.brewster', link: '/demos/brewster', icon: <Zap className="w-4 h-4" /> },
          { type: 'experiment', id: 'brewster-exp', titleKey: 'home.res.brewsterExp', link: '/optical-studio?exp=brewster', icon: <FlaskConical className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第三单元：透明介质的偏振特征
    id: 'unit3',
    number: 3,
    titleKey: 'home.units.unit3.title',
    subtitleKey: 'home.units.unit3.subtitle',
    descriptionKey: 'home.units.unit3.description',
    icon: <Layers className="w-5 h-5" />,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    bgPattern: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit3.keyExp',
      link: '/demos/chromatic',
    },
    sections: [
      {
        id: '3.1',
        titleKey: 'home.units.unit3.s1.title',
        descKey: 'home.units.unit3.s1.desc',
        resources: [
          { type: 'demo', id: 'chromatic', titleKey: 'home.res.chromatic', link: '/demos/chromatic', icon: <Sparkles className="w-4 h-4" /> },
          { type: 'demo', id: 'anisotropy', titleKey: 'home.res.anisotropy', link: '/demos/anisotropy', icon: <Layers className="w-4 h-4" /> },
          { type: 'experiment', id: 'stress-exp', titleKey: 'home.res.stressExp', link: '/optical-studio?exp=stress', icon: <FlaskConical className="w-4 h-4" /> },
        ],
      },
      {
        id: '3.2',
        titleKey: 'home.units.unit3.s2.title',
        descKey: 'home.units.unit3.s2.desc',
        resources: [
          { type: 'demo', id: 'optical-rotation', titleKey: 'home.res.opticalRotation', link: '/demos/optical-rotation', icon: <Compass className="w-4 h-4" /> },
          { type: 'experiment', id: 'sugar-exp', titleKey: 'home.res.sugarExp', link: '/experiments?exp=sugar', icon: <Beaker className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第四单元：浑浊介质的偏振特征
    id: 'unit4',
    number: 4,
    titleKey: 'home.units.unit4.title',
    subtitleKey: 'home.units.unit4.subtitle',
    descriptionKey: 'home.units.unit4.description',
    icon: <Sun className="w-5 h-5" />,
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    bgPattern: 'radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit4.keyExp',
      link: '/demos/rayleigh',
    },
    sections: [
      {
        id: '4.1',
        titleKey: 'home.units.unit4.s1.title',
        descKey: 'home.units.unit4.s1.desc',
        resources: [
          { type: 'demo', id: 'rayleigh', titleKey: 'home.res.rayleigh', link: '/demos/rayleigh', icon: <Sun className="w-4 h-4" /> },
          { type: 'demo', id: 'mie', titleKey: 'home.res.mie', link: '/demos/mie-scattering', icon: <Atom className="w-4 h-4" /> },
        ],
      },
      {
        id: '4.2',
        titleKey: 'home.units.unit4.s2.title',
        descKey: 'home.units.unit4.s2.desc',
        resources: [
          { type: 'demo', id: 'monte-carlo', titleKey: 'home.res.monteCarlo', link: '/demos/monte-carlo-scattering', icon: <Sparkles className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第五单元：全偏振光学技术
    id: 'unit5',
    number: 5,
    titleKey: 'home.units.unit5.title',
    subtitleKey: 'home.units.unit5.subtitle',
    descriptionKey: 'home.units.unit5.description',
    icon: <Microscope className="w-5 h-5" />,
    color: '#8B5CF6',
    gradient: 'from-violet-600 to-indigo-600',
    bgPattern: 'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit5.keyExp',
      link: '/demos/mueller',
    },
    sections: [
      {
        id: '5.1',
        titleKey: 'home.units.unit5.s1.title',
        descKey: 'home.units.unit5.s1.desc',
        resources: [
          { type: 'demo', id: 'stokes', titleKey: 'home.res.stokes', link: '/demos/stokes', icon: <Target className="w-4 h-4" /> },
          { type: 'demo', id: 'mueller', titleKey: 'home.res.mueller', link: '/demos/mueller', icon: <Layers className="w-4 h-4" /> },
          { type: 'tool', id: 'stokes-calc', titleKey: 'home.res.stokesCalc', link: '/calc/stokes', icon: <Calculator className="w-4 h-4" /> },
          { type: 'tool', id: 'mueller-calc', titleKey: 'home.res.muellerCalc', link: '/calc/mueller', icon: <Calculator className="w-4 h-4" /> },
        ],
      },
      {
        id: '5.2',
        titleKey: 'home.units.unit5.s2.title',
        descKey: 'home.units.unit5.s2.desc',
        resources: [
          { type: 'demo', id: 'jones', titleKey: 'home.res.jones', link: '/demos/jones', icon: <Sparkles className="w-4 h-4" /> },
          { type: 'tool', id: 'jones-calc', titleKey: 'home.res.jonesCalc', link: '/calc/jones', icon: <Calculator className="w-4 h-4" /> },
          { type: 'tool', id: 'poincare', titleKey: 'home.res.poincare', link: '/calc/poincare', icon: <Compass className="w-4 h-4" /> },
        ],
      },
      {
        id: '5.3',
        titleKey: 'home.units.unit5.s3.title',
        descKey: 'home.units.unit5.s3.desc',
        resources: [
          { type: 'demo', id: 'microscopy', titleKey: 'home.res.microscopy', link: '/demos/polarimetric-microscopy', icon: <Microscope className="w-4 h-4" /> },
        ],
      },
    ],
  },
]

// ============================================================================
// 动态背景组件
// ============================================================================

function PolarizationBackground({ theme }: { theme: 'dark' | 'light' }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.03) 0deg,
                rgba(167, 139, 250, 0.03) 120deg,
                rgba(139, 92, 246, 0.03) 240deg,
                rgba(34, 211, 238, 0.03) 360deg)`
            : `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.02) 0deg,
                rgba(167, 139, 250, 0.02) 120deg,
                rgba(139, 92, 246, 0.02) 240deg,
                rgba(34, 211, 238, 0.02) 360deg)`,
        }}
      />
    </div>
  )
}

// ============================================================================
// 资源类型标签组件
// ============================================================================

function ResourceBadge({ type, theme }: { type: UnitResource['type']; theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  const config = {
    demo: { color: '#22D3EE', labelKey: 'home.resType.demo' },
    experiment: { color: '#F59E0B', labelKey: 'home.resType.experiment' },
    history: { color: '#C9A227', labelKey: 'home.resType.history' },
    game: { color: '#EC4899', labelKey: 'home.resType.game' },
    tool: { color: '#8B5CF6', labelKey: 'home.resType.tool' },
  }

  const cfg = config[type]

  return (
    <span
      className="text-[9px] px-1.5 py-0.5 rounded font-medium"
      style={{
        backgroundColor: `${cfg.color}20`,
        color: cfg.color,
      }}
    >
      {t(cfg.labelKey)}
    </span>
  )
}

// ============================================================================
// 单元卡片组件
// ============================================================================

function UnitCard({
  unit,
  theme,
  isExpanded,
  onToggle,
  completedDemos,
}: {
  unit: CourseUnit
  theme: 'dark' | 'light'
  isExpanded: boolean
  onToggle: () => void
  completedDemos: string[]
}) {
  const { t } = useTranslation()

  // 计算进度
  const allResources = unit.sections.flatMap(s => s.resources.filter(r => r.type === 'demo'))
  const completedCount = allResources.filter(r => completedDemos.includes(r.id)).length
  const progressPercent = allResources.length > 0 ? Math.round((completedCount / allResources.length) * 100) : 0

  return (
    <div
      className={cn(
        'rounded-2xl border overflow-hidden transition-all duration-300',
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700/50'
          : 'bg-white/90 border-gray-200'
      )}
      style={{
        borderColor: isExpanded ? unit.color : undefined,
        boxShadow: isExpanded ? `0 4px 30px ${unit.color}20` : undefined,
        background: isExpanded ? unit.bgPattern : undefined,
      }}
    >
      {/* 单元头部 - 可点击展开 */}
      <button
        className={cn(
          'w-full p-4 flex items-center gap-4 text-left transition-colors',
          theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
        )}
        onClick={onToggle}
      >
        {/* 单元编号 */}
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg',
            unit.gradient
          )}
        >
          <span className="text-white text-xl font-bold">{unit.number}</span>
        </div>

        {/* 单元信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'text-base font-bold truncate',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t(unit.titleKey)}
            </h3>
          </div>
          <p className={cn(
            'text-sm truncate',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {t(unit.subtitleKey)}
          </p>

          {/* 进度条 */}
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'flex-1 h-1 rounded-full',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}>
              <div
                className={cn('h-full rounded-full bg-gradient-to-r transition-all', unit.gradient)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={cn(
              'text-[10px] font-medium',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {completedCount}/{allResources.length}
            </span>
          </div>
        </div>

        {/* 展开指示器 */}
        <ChevronDown
          className={cn(
            'w-5 h-5 flex-shrink-0 transition-transform duration-300',
            isExpanded ? 'rotate-180' : '',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}
        />
      </button>

      {/* 展开内容 */}
      {isExpanded && (
        <div className={cn(
          'px-4 pb-4 border-t',
          theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
        )}>
          {/* 单元描述 */}
          <p className={cn(
            'text-sm mt-3 mb-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {t(unit.descriptionKey)}
          </p>

          {/* 核心实验入口 */}
          {unit.keyExperiment && (
            <Link
              to={unit.keyExperiment.link}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl mb-4 transition-all hover:scale-[1.01]',
                'bg-gradient-to-r text-white shadow-lg',
                unit.gradient
              )}
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs opacity-80">{t('home.keyExperiment')}</p>
                <p className="font-medium">{t(unit.keyExperiment.titleKey)}</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}

          {/* 各小节内容 */}
          <div className="space-y-4">
            {unit.sections.map((section) => (
              <div key={section.id}>
                {/* 小节标题 */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                  >
                    {section.id}
                  </span>
                  <h4 className={cn(
                    'text-sm font-semibold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {t(section.titleKey)}
                  </h4>
                </div>
                <p className={cn(
                  'text-xs mb-2',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {t(section.descKey)}
                </p>

                {/* 资源列表 */}
                <div className="flex flex-wrap gap-2">
                  {section.resources.map((resource) => (
                    <Link
                      key={resource.id}
                      to={resource.link}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105',
                        theme === 'dark'
                          ? 'bg-slate-700/50 hover:bg-slate-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                    >
                      <span style={{ color: unit.color }}>{resource.icon}</span>
                      <span className={cn(
                        'font-medium',
                        theme === 'dark' ? 'text-white' : 'text-gray-700'
                      )}>
                        {t(resource.titleKey)}
                      </span>
                      <ResourceBadge type={resource.type} theme={theme} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 快速入口组件
// ============================================================================

function QuickAccessSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  const quickLinks = [
    { icon: <Eye className="w-5 h-5" />, labelKey: 'home.quick.demos', link: '/demos', color: '#22D3EE' },
    { icon: <Wrench className="w-5 h-5" />, labelKey: 'home.quick.opticalStudio', link: '/optical-studio', color: '#F59E0B' },
    { icon: <History className="w-5 h-5" />, labelKey: 'home.quick.chronicles', link: '/chronicles', color: '#C9A227' },
    { icon: <Calculator className="w-5 h-5" />, labelKey: 'home.quick.calc', link: '/calc', color: '#8B5CF6' },
  ]

  return (
    <div className={cn(
      'rounded-xl p-4 mb-6',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
    )}>
      <h3 className={cn(
        'text-sm font-semibold mb-3',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        {t('home.quickAccess')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105',
              theme === 'dark'
                ? 'bg-slate-700/50 hover:bg-slate-700'
                : 'bg-gray-50 hover:bg-gray-100'
            )}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <span className={cn(
              'text-xs font-medium text-center',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t(item.labelKey)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 生活场景卡片
// ============================================================================

function LifeScenesSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  const scenes = [
    { emoji: '🌅', titleKey: 'home.life.sky', descKey: 'home.life.skyDesc', link: '/demos/rayleigh', color: '#F59E0B' },
    { emoji: '📱', titleKey: 'home.life.screen', descKey: 'home.life.screenDesc', link: '/demos/polarization-intro', color: '#3B82F6' },
    { emoji: '🕶️', titleKey: 'home.life.sunglasses', descKey: 'home.life.sunglassesDesc', link: '/demos/malus', color: '#8B5CF6' },
    { emoji: '🦋', titleKey: 'home.life.butterfly', descKey: 'home.life.butterflyDesc', link: '/demos/chromatic', color: '#EC4899' },
  ]

  return (
    <div className={cn(
      'rounded-xl p-4 mb-6',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
    )}>
      <h3 className={cn(
        'text-sm font-semibold mb-3 flex items-center gap-2',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        <Compass className="w-4 h-4 text-cyan-500" />
        {t('home.lifeTitle')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {scenes.map((scene, idx) => (
          <Link
            key={idx}
            to={scene.link}
            className={cn(
              'group flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-[1.02]',
              theme === 'dark'
                ? 'bg-slate-700/50 hover:bg-slate-700'
                : 'bg-gray-50 hover:bg-gray-100'
            )}
          >
            <span className="text-2xl">{scene.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-xs font-medium truncate',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t(scene.titleKey)}
              </p>
              <p className={cn(
                'text-[10px] truncate',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {t(scene.descKey)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 主页组件
// ============================================================================

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { progress } = useCourseProgress()

  // 展开状态管理
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null)

  // 首个未完成单元自动展开
  useEffect(() => {
    const firstIncomplete = COURSE_UNITS.find(unit => {
      const demos = unit.sections.flatMap(s => s.resources.filter(r => r.type === 'demo'))
      return demos.some(d => !progress.completedDemos.includes(d.id))
    })
    if (firstIncomplete && !expandedUnitId) {
      setExpandedUnitId(firstIncomplete.id)
    }
  }, [progress.completedDemos])

  const handleToggleUnit = useCallback((unitId: string) => {
    setExpandedUnitId(prev => prev === unitId ? null : unitId)
  }, [])

  const handleStartLearning = useCallback(() => {
    // 跳转到第一个未完成的演示
    for (const unit of COURSE_UNITS) {
      for (const section of unit.sections) {
        for (const resource of section.resources) {
          if (resource.type === 'demo' && !progress.completedDemos.includes(resource.id)) {
            navigate(resource.link)
            return
          }
        }
      }
    }
    // 如果全部完成，跳转到第一个演示
    navigate('/demos/polarization-intro')
  }, [navigate, progress.completedDemos])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* 动态背景 */}
      <PolarizationBackground theme={theme} />

      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={cn(
          'flex items-center justify-between px-4 py-3',
          theme === 'dark'
            ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
            : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
        )}>
          <div className="flex items-center gap-3">
            <PolarWorldLogo size={36} theme={theme} />
            <span className={cn(
              'hidden sm:block font-bold text-base',
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
            )}>
              偏振光下的新世界
            </span>
          </div>
          <LanguageThemeSwitcher />
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Hero 区域 */}
        <div className="relative mb-8">
          {/* 背景光晕 */}
          <div className="absolute inset-0 -z-10">
            <div className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px]',
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-violet-500/20'
                : 'bg-gradient-to-r from-cyan-400/15 via-blue-400/10 to-violet-400/15'
            )} />
          </div>

          {/* 标题 */}
          <div className="text-center pt-6 pb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={cn(
                'text-xs px-3 py-1 rounded-full font-medium',
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-cyan-100 text-cyan-700'
              )}>
                {t('home.courseBanner.badge')}
              </span>
            </div>

            <h1 className={cn(
              'text-4xl sm:text-5xl font-black tracking-tight mb-4',
              'text-transparent bg-clip-text',
              theme === 'dark'
                ? 'bg-gradient-to-br from-white via-cyan-200 to-violet-300'
                : 'bg-gradient-to-br from-gray-900 via-cyan-700 to-violet-700'
            )}>
              {t('home.title')}
            </h1>

            <p className={cn(
              'text-base sm:text-lg max-w-2xl mx-auto mb-6',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('home.courseBanner.description')}
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleStartLearning}
                className={cn(
                  'group px-6 py-3 rounded-full font-bold flex items-center gap-2',
                  'bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white',
                  'hover:scale-105 transition-all duration-300',
                  'shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                )}
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('home.startLearning')}
              </button>
              <Link
                to="/demos"
                className={cn(
                  'px-6 py-3 rounded-full font-bold flex items-center gap-2',
                  'border-2 transition-all duration-300 hover:scale-105',
                  theme === 'dark'
                    ? 'border-slate-600 text-gray-300 hover:border-slate-500 hover:bg-slate-800/50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                )}
              >
                <Eye className="w-5 h-5" />
                {t('home.explore')}
              </Link>
            </div>
          </div>
        </div>

        {/* 偏振光效果展示 */}
        <div className="mb-8">
          <PolarizedLightHero height={180} className="shadow-xl rounded-2xl" />
        </div>

        {/* 快速入口 */}
        <QuickAccessSection theme={theme} />

        {/* 生活场景 */}
        <LifeScenesSection theme={theme} />

        {/* 课程大纲 - 5个单元 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t('home.courseOutline.title')}
            </h2>
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full font-medium',
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-cyan-100 text-cyan-700'
            )}>
              5 {t('home.courseOutline.units')}
            </span>
          </div>

          <div className="space-y-3">
            {COURSE_UNITS.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                theme={theme}
                isExpanded={expandedUnitId === unit.id}
                onToggle={() => handleToggleUnit(unit.id)}
                completedDemos={progress.completedDemos}
              />
            ))}
          </div>
        </div>

        {/* 页脚 */}
        <footer className={cn(
          'mt-12 text-center text-xs',
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        )}>
          <p className="opacity-60">© 2025 深圳零一学院 · {t('home.title')}</p>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
