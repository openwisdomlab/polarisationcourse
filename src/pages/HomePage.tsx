/**
 * HomePage - PSRT Course Homepage
 * 首页 = PSRT课程（融合演示、游戏、工具作为学习资源）
 *
 * 架构：首页直接展示PSRT课程的三阶段学习路径
 * 演示(demos)、游戏(games)、工具(tools)作为每个阶段的学习资源
 */

import { useState, useEffect, useCallback } from 'react'
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
  Telescope,
  FlaskConical,
  Target,
  ArrowRight,
  Eye,
  Wrench,
  TrendingUp,
  Clock,
  Flame,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  GraduationCap,
} from 'lucide-react'

// Learning stage definition - 三阶段认知旅程
interface LearningStage {
  id: string
  phase: number
  titleKey: string
  subtitleKey: string
  questionKey: string
  icon: React.ReactNode
  color: string
  gradient: string
  demos: { id: string; titleKey: string; link: string }[]
  games?: { titleKey: string; link: string }[]
  tools?: { titleKey: string; link: string }[]
  isAdvanced?: boolean
}

// 三阶段学习路径配置 - 隐藏游戏，专注课程内容
const LEARNING_STAGES: LearningStage[] = [
  {
    // 阶段一：看见偏振
    id: 'stage1',
    phase: 1,
    titleKey: 'home.stage1.title',
    subtitleKey: 'home.stage1.subtitle',
    questionKey: 'home.stage1.question',
    icon: <Lightbulb className="w-6 h-6" />,
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
    demos: [
      { id: 'polarization-intro', titleKey: 'home.stage1.demos.intro', link: '/demos/polarization-intro' },
      { id: 'polarization-types-unified', titleKey: 'home.stage1.demos.types', link: '/demos/polarization-types-unified' },
      { id: 'optical-bench', titleKey: 'home.stage1.demos.bench', link: '/demos/optical-bench' },
    ],
    // games temporarily hidden
  },
  {
    // 阶段二：理解规律
    id: 'stage2',
    phase: 2,
    titleKey: 'home.stage2.title',
    subtitleKey: 'home.stage2.subtitle',
    questionKey: 'home.stage2.question',
    icon: <BookOpen className="w-6 h-6" />,
    color: '#A78BFA',
    gradient: 'from-purple-500 to-pink-500',
    demos: [
      { id: 'malus', titleKey: 'home.stage2.demos.malus', link: '/demos/malus' },
      { id: 'birefringence', titleKey: 'home.stage2.demos.birefringence', link: '/demos/birefringence' },
      { id: 'brewster', titleKey: 'home.stage2.demos.brewster', link: '/demos/brewster' },
      { id: 'rayleigh', titleKey: 'home.stage2.demos.rayleigh', link: '/demos/rayleigh' },
      { id: 'chromatic', titleKey: 'home.stage2.demos.chromatic', link: '/demos/chromatic' },
    ],
    // games temporarily hidden
    tools: [
      { titleKey: 'home.stage2.tools.opticalStudio', link: '/optical-studio?tab=experiments' },
    ],
  },
  {
    // 阶段三：测量与应用
    id: 'stage3',
    phase: 3,
    titleKey: 'home.stage3.title',
    subtitleKey: 'home.stage3.subtitle',
    questionKey: 'home.stage3.question',
    icon: <Telescope className="w-6 h-6" />,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
    isAdvanced: true,
    demos: [
      { id: 'stokes', titleKey: 'home.stage3.demos.stokes', link: '/demos/stokes' },
      { id: 'mueller', titleKey: 'home.stage3.demos.mueller', link: '/demos/mueller' },
      { id: 'jones', titleKey: 'home.stage3.demos.jones', link: '/demos/jones' },
      { id: 'polarimetric-microscopy', titleKey: 'home.stage3.demos.microscopy', link: '/demos/polarimetric-microscopy' },
    ],
    // games temporarily hidden
    tools: [
      { titleKey: 'home.stage3.tools.stokes', link: '/calc/stokes' },
      { titleKey: 'home.stage3.tools.poincare', link: '/calc/poincare' },
      { titleKey: 'home.stage3.tools.mueller', link: '/calc/mueller' },
    ],
  },
]

// Animated polarization background
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

// Learning Stage Card Component - 简化版，点击跳转到课程页
function LearningStageCard({
  stage,
  theme,
  completedDemos,
}: {
  stage: LearningStage
  theme: 'dark' | 'light'
  completedDemos: string[]
}) {
  const { t } = useTranslation()

  // Calculate progress for this stage
  const totalDemos = stage.demos.length
  const completedCount = stage.demos.filter(d => completedDemos.includes(d.id)).length
  const progressPercent = totalDemos > 0 ? Math.round((completedCount / totalDemos) * 100) : 0

  return (
    <Link
      to={`/course?stage=${stage.id}`}
      className={`group block rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-500'
          : 'bg-white/80 border-gray-200 hover:border-gray-300'
      }`}
      style={{
        boxShadow: `0 4px 20px ${stage.color}10`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = stage.color
        e.currentTarget.style.boxShadow = `0 8px 30px ${stage.color}25`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.boxShadow = `0 4px 20px ${stage.color}10`
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Phase number badge */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${stage.gradient} shadow-md`}
          >
            <span className="text-white text-lg font-bold">{stage.phase}</span>
          </div>

          {/* Stage info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t(stage.titleKey)}
              </h3>
              {stage.isAdvanced && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  theme === 'dark'
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'bg-violet-100 text-violet-700'
                }`}>
                  {t('home.advanced')}
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t(stage.subtitleKey)}
            </p>
          </div>

          {/* Arrow */}
          <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
            theme === 'dark' ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-700'
          }`} />
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className={`flex-1 h-1 rounded-full ${
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          }`}>
            <div
              className={`h-full rounded-full bg-gradient-to-r ${stage.gradient} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={`text-[10px] font-medium ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {completedCount}/{totalDemos}
          </span>
        </div>
      </div>
    </Link>
  )
}

// Quick Stats Component
function QuickStats({ theme, progress }: { theme: 'dark' | 'light'; progress: ReturnType<typeof useCourseProgress>['progress'] }) {
  const { t } = useTranslation()

  const allDemoIds = LEARNING_STAGES.flatMap(s => s.demos.map(d => d.id))
  const completedCount = progress.completedDemos.filter(id => allDemoIds.includes(id)).length
  const totalCount = allDemoIds.length
  const timeSpentMinutes = Math.round(progress.totalTimeSpent / 60)

  const stats = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: t('home.stats.completed'),
      value: `${completedCount}/${totalCount}`,
      color: '#22c55e',
    },
    {
      icon: <Flame className="w-4 h-4" />,
      label: t('home.stats.streak'),
      value: `${progress.streakDays}`,
      color: '#f59e0b',
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: t('home.stats.time'),
      value: `${timeSpentMinutes}m`,
      color: '#6366f1',
    },
  ]

  return (
    <div className="flex items-center gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            theme === 'dark' ? 'bg-slate-800/80' : 'bg-white/80'
          }`}
        >
          <span style={{ color: stat.color }}>{stat.icon}</span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {stat.label}
          </span>
          <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// Life Scenes & Hands-on Experiments - 生活中的偏振 + 动手实验（融合版）
function LifeAndExperimentsSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  // 生活中的偏振现象
  const lifeScenes = [
    { icon: '🌅', titleKey: 'home.life.sky', descKey: 'home.life.skyDesc', link: '/demos/rayleigh', color: '#F59E0B' },
    { icon: '📱', titleKey: 'home.life.screen', descKey: 'home.life.screenDesc', link: '/demos/polarization-intro', color: '#3B82F6' },
    { icon: '🕶️', titleKey: 'home.life.sunglasses', descKey: 'home.life.sunglassesDesc', link: '/demos/malus', color: '#8B5CF6' },
    { icon: '🦋', titleKey: 'home.life.butterfly', descKey: 'home.life.butterflyDesc', link: '/demos/chromatic', color: '#EC4899' },
  ]

  // 简单动手实验
  const experiments = [
    { icon: '🌈', titleKey: 'home.exp.sugarRainbow', descKey: 'home.exp.sugarRainbowDesc', link: '/demos/optical-rotation', color: '#EC4899' },
    { icon: '🎨', titleKey: 'home.exp.tapeArt', descKey: 'home.exp.tapeArtDesc', link: '/demos/chromatic', color: '#8B5CF6' },
    { icon: '📺', titleKey: 'home.exp.screenPolarizer', descKey: 'home.exp.screenPolarizerDesc', link: '/demos/malus', color: '#3B82F6' },
  ]

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 生活中的偏振 */}
      <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'}`}>
        <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <Eye className="w-4 h-4 text-cyan-500" />
          {t('home.lifeTitle')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {lifeScenes.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`group p-2.5 rounded-lg transition-all hover:scale-[1.02] ${
                theme === 'dark'
                  ? 'bg-slate-700/50 hover:bg-slate-700'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t(item.titleKey)}
                  </p>
                  <p className={`text-[10px] truncate ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {t(item.descKey)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 动手实验 */}
      <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'}`}>
        <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <FlaskConical className="w-4 h-4 text-pink-500" />
          {t('home.expTitle')}
        </h3>
        <div className="space-y-2">
          {experiments.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`group flex items-center gap-3 p-2.5 rounded-lg transition-all hover:scale-[1.01] ${
                theme === 'dark'
                  ? 'bg-slate-700/50 hover:bg-slate-700'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t(item.titleKey)}
                </p>
                <p className={`text-[10px] truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {t(item.descKey)}
                </p>
              </div>
              <ArrowRight className={`w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Course curriculum data - 课程大纲详细内容
interface CourseSection {
  id: string
  titleKey: string
  descKey: string
  demoLink?: string
}

interface CourseUnit {
  id: string
  titleKey: string
  subtitleKey: string
  icon: React.ReactNode
  color: string
  sections: CourseSection[]
}

interface CourseStage {
  id: string
  phase: number
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  questionKey: string
  icon: React.ReactNode
  color: string
  gradient: string
  units: CourseUnit[]
  isAdvanced?: boolean
}

const COURSE_CURRICULUM: CourseStage[] = [
  {
    id: 'stage1',
    phase: 1,
    titleKey: 'home.stage1.title',
    subtitleKey: 'home.stage1.subtitle',
    descriptionKey: 'home.courseOutline.stage1.description',
    questionKey: 'home.stage1.question',
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
    units: [
      {
        id: 'seeing-polarization',
        titleKey: 'home.courseOutline.stage1.units.seeing.title',
        subtitleKey: 'home.courseOutline.stage1.units.seeing.subtitle',
        icon: <Lightbulb className="w-4 h-4" />,
        color: '#22D3EE',
        sections: [
          { id: '1.1', titleKey: 'home.courseOutline.stage1.sections.whatIs', descKey: 'home.courseOutline.stage1.sections.whatIsDesc', demoLink: '/demos/polarization-intro' },
          { id: '1.2', titleKey: 'home.courseOutline.stage1.sections.types', descKey: 'home.courseOutline.stage1.sections.typesDesc', demoLink: '/demos/polarization-types-unified' },
          { id: '1.3', titleKey: 'home.courseOutline.stage1.sections.daily', descKey: 'home.courseOutline.stage1.sections.dailyDesc', demoLink: '/demos/optical-bench' },
        ],
      },
    ],
  },
  {
    id: 'stage2',
    phase: 2,
    titleKey: 'home.stage2.title',
    subtitleKey: 'home.stage2.subtitle',
    descriptionKey: 'home.courseOutline.stage2.description',
    questionKey: 'home.stage2.question',
    icon: <BookOpen className="w-5 h-5" />,
    color: '#A78BFA',
    gradient: 'from-purple-500 to-pink-500',
    units: [
      {
        id: 'malus-law',
        titleKey: 'home.courseOutline.stage2.units.malus.title',
        subtitleKey: 'home.courseOutline.stage2.units.malus.subtitle',
        icon: <Target className="w-4 h-4" />,
        color: '#F59E0B',
        sections: [
          { id: '2.1', titleKey: 'home.courseOutline.stage2.sections.malus', descKey: 'home.courseOutline.stage2.sections.malusDesc', demoLink: '/demos/malus' },
        ],
      },
      {
        id: 'birefringence',
        titleKey: 'home.courseOutline.stage2.units.birefringence.title',
        subtitleKey: 'home.courseOutline.stage2.units.birefringence.subtitle',
        icon: <Sparkles className="w-4 h-4" />,
        color: '#0891B2',
        sections: [
          { id: '2.2', titleKey: 'home.courseOutline.stage2.sections.calcite', descKey: 'home.courseOutline.stage2.sections.calciteDesc', demoLink: '/demos/birefringence' },
          { id: '2.3', titleKey: 'home.courseOutline.stage2.sections.waveplate', descKey: 'home.courseOutline.stage2.sections.waveplateDesc', demoLink: '/demos/waveplate' },
        ],
      },
      {
        id: 'reflection',
        titleKey: 'home.courseOutline.stage2.units.reflection.title',
        subtitleKey: 'home.courseOutline.stage2.units.reflection.subtitle',
        icon: <Zap className="w-4 h-4" />,
        color: '#6366F1',
        sections: [
          { id: '2.4', titleKey: 'home.courseOutline.stage2.sections.brewster', descKey: 'home.courseOutline.stage2.sections.brewsterDesc', demoLink: '/demos/brewster' },
        ],
      },
      {
        id: 'scattering',
        titleKey: 'home.courseOutline.stage2.units.scattering.title',
        subtitleKey: 'home.courseOutline.stage2.units.scattering.subtitle',
        icon: <Target className="w-4 h-4" />,
        color: '#F59E0B',
        sections: [
          { id: '2.5', titleKey: 'home.courseOutline.stage2.sections.rayleigh', descKey: 'home.courseOutline.stage2.sections.rayleighDesc', demoLink: '/demos/rayleigh' },
        ],
      },
      {
        id: 'applications',
        titleKey: 'home.courseOutline.stage2.units.applications.title',
        subtitleKey: 'home.courseOutline.stage2.units.applications.subtitle',
        icon: <Sparkles className="w-4 h-4" />,
        color: '#EC4899',
        sections: [
          { id: '2.6', titleKey: 'home.courseOutline.stage2.sections.stress', descKey: 'home.courseOutline.stage2.sections.stressDesc', demoLink: '/demos/anisotropy' },
          { id: '2.7', titleKey: 'home.courseOutline.stage2.sections.sugar', descKey: 'home.courseOutline.stage2.sections.sugarDesc', demoLink: '/demos/optical-rotation' },
        ],
      },
    ],
  },
  {
    id: 'stage3',
    phase: 3,
    titleKey: 'home.stage3.title',
    subtitleKey: 'home.stage3.subtitle',
    descriptionKey: 'home.courseOutline.stage3.description',
    questionKey: 'home.stage3.question',
    icon: <Telescope className="w-5 h-5" />,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
    isAdvanced: true,
    units: [
      {
        id: 'stokes-vector',
        titleKey: 'home.courseOutline.stage3.units.stokes.title',
        subtitleKey: 'home.courseOutline.stage3.units.stokes.subtitle',
        icon: <Target className="w-4 h-4" />,
        color: '#8B5CF6',
        sections: [
          { id: '3.1', titleKey: 'home.courseOutline.stage3.sections.stokes', descKey: 'home.courseOutline.stage3.sections.stokesDesc', demoLink: '/demos/stokes' },
        ],
      },
      {
        id: 'mueller-matrix',
        titleKey: 'home.courseOutline.stage3.units.mueller.title',
        subtitleKey: 'home.courseOutline.stage3.units.mueller.subtitle',
        icon: <Telescope className="w-4 h-4" />,
        color: '#EC4899',
        sections: [
          { id: '3.2', titleKey: 'home.courseOutline.stage3.sections.mueller', descKey: 'home.courseOutline.stage3.sections.muellerDesc', demoLink: '/demos/mueller' },
          { id: '3.3', titleKey: 'home.courseOutline.stage3.sections.jones', descKey: 'home.courseOutline.stage3.sections.jonesDesc', demoLink: '/demos/jones' },
        ],
      },
      {
        id: 'advanced-imaging',
        titleKey: 'home.courseOutline.stage3.units.imaging.title',
        subtitleKey: 'home.courseOutline.stage3.units.imaging.subtitle',
        icon: <Telescope className="w-4 h-4" />,
        color: '#06B6D4',
        sections: [
          { id: '3.4', titleKey: 'home.courseOutline.stage3.sections.microscopy', descKey: 'home.courseOutline.stage3.sections.microscopyDesc', demoLink: '/demos/polarimetric-microscopy' },
          { id: '3.5', titleKey: 'home.courseOutline.stage3.sections.monteCarlo', descKey: 'home.courseOutline.stage3.sections.monteCarloDesc', demoLink: '/demos/monte-carlo-scattering' },
        ],
      },
    ],
  },
]

// Course Outline Section - 课程大纲（可展开的详细内容）
function CourseOutlineSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null)
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null)

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <h2 className={`text-lg font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {t('home.courseOutline.title')}
        </h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          theme === 'dark'
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {t('home.courseOutline.badge')}
        </span>
      </div>

      {/* Course stages */}
      <div className="space-y-3">
        {COURSE_CURRICULUM.map((stage) => (
          <div
            key={stage.id}
            className={`rounded-xl border overflow-hidden transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-slate-800/60 border-slate-700/50'
                : 'bg-white/90 border-gray-200'
            }`}
            style={{
              borderColor: expandedStageId === stage.id ? stage.color : undefined,
              boxShadow: expandedStageId === stage.id ? `0 4px 20px ${stage.color}20` : undefined,
            }}
          >
            {/* Stage header */}
            <button
              className={`w-full p-4 flex items-center gap-4 transition-colors ${
                theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
              }`}
              onClick={() => setExpandedStageId(expandedStageId === stage.id ? null : stage.id)}
            >
              {/* Phase badge */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${stage.gradient}`}
              >
                <span className="text-white text-lg font-bold">{stage.phase}</span>
              </div>

              {/* Stage info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t(stage.titleKey)}
                  </h3>
                  {stage.isAdvanced && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      theme === 'dark'
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-violet-100 text-violet-700'
                    }`}>
                      {t('home.advanced')}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t(stage.subtitleKey)}
                </p>
              </div>

              {/* Unit count & expand icon */}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  {stage.units.length} {t('home.courseOutline.units')}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    expandedStageId === stage.id ? 'rotate-180' : ''
                  } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                />
              </div>
            </button>

            {/* Expanded content */}
            {expandedStageId === stage.id && (
              <div className={`px-4 pb-4 border-t ${
                theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
              }`}>
                {/* Stage question */}
                <p className={`text-sm mt-3 mb-4 italic ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  "{t(stage.questionKey)}"
                </p>

                {/* Units list */}
                <div className="space-y-2">
                  {stage.units.map((unit) => (
                    <div
                      key={unit.id}
                      className={`rounded-lg border overflow-hidden transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-700/30 border-slate-600/50'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      style={{
                        borderColor: expandedUnitId === unit.id ? unit.color : undefined,
                      }}
                    >
                      {/* Unit header */}
                      <button
                        className={`w-full p-3 flex items-center gap-3 transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-600/30' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setExpandedUnitId(expandedUnitId === unit.id ? null : unit.id)}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${unit.color}20` }}
                        >
                          <span style={{ color: unit.color }}>{unit.icon}</span>
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {t(unit.titleKey)}
                          </h4>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {t(unit.subtitleKey)}
                          </p>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedUnitId === unit.id ? 'rotate-180' : ''
                          } ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                        />
                      </button>

                      {/* Unit sections */}
                      {expandedUnitId === unit.id && (
                        <div className={`px-3 pb-3 border-t ${
                          theme === 'dark' ? 'border-slate-600/30' : 'border-gray-200'
                        }`}>
                          <div className="mt-2 space-y-1.5">
                            {unit.sections.map((section) => (
                              <Link
                                key={section.id}
                                to={section.demoLink || '#'}
                                className={`group block p-2 rounded-md transition-all hover:scale-[1.01] ${
                                  theme === 'dark'
                                    ? 'bg-slate-600/30 hover:bg-slate-600/50'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                                  >
                                    {section.id}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium truncate ${
                                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {t(section.titleKey)}
                                    </p>
                                    <p className={`text-[10px] truncate ${
                                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {t(section.descKey)}
                                    </p>
                                  </div>
                                  <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                  }`} />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View full course link */}
      <div className="mt-4 text-center">
        <Link
          to="/course"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
            theme === 'dark'
              ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
              : 'bg-gray-100 text-cyan-600 hover:bg-gray-200'
          }`}
        >
          {t('home.courseOutline.viewFull')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

// Quick Access Menu - 快捷入口（精简版：隐藏游戏、实验室、造物局）
function QuickAccessMenu({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  // 保留核心模块：演示馆、计算工具、历史编年史、光学设计室
  const quickLinks = [
    { icon: <FlaskConical className="w-4 h-4" />, label: t('home.quick.demos'), link: '/demos', color: '#0891B2' },
    { icon: <Target className="w-4 h-4" />, label: t('home.quick.calc'), link: '/calc', color: '#8B5CF6' },
    { icon: <Wrench className="w-4 h-4" />, label: t('home.quick.opticalStudio'), link: '/optical-studio', color: '#F59E0B' },
    { icon: <BookOpen className="w-4 h-4" />, label: t('home.quick.chronicles'), link: '/chronicles', color: '#C9A227' },
  ]

  return (
    <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'}`}>
      <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {t('home.quickAccess')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {quickLinks.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all hover:scale-105 ${
              theme === 'dark'
                ? 'bg-slate-700/50 hover:bg-slate-700'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <span className={`text-[10px] font-medium text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Guided Start Modal - 引导式起点（隐藏游戏路径）
const LEARNING_TRACKS = [
  {
    id: 'curious',
    icon: Lightbulb,
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
    route: '/demos/polarization-intro',
  },
  {
    id: 'student',
    icon: BookOpen,
    color: '#A78BFA',
    gradient: 'from-purple-500 to-pink-500',
    route: '/demos/malus',
  },
  {
    id: 'researcher',
    icon: Telescope,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
    route: '/demos/stokes',
  },
  // player track temporarily hidden
]

function GuidedStartModal({
  theme,
  onClose,
  onSelect,
}: {
  theme: 'dark' | 'light'
  onClose: () => void
  onSelect: (trackId: string, route: string) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-xl rounded-2xl p-6 shadow-2xl ${
        theme === 'dark'
          ? 'bg-slate-900 border border-slate-700'
          : 'bg-white border border-gray-200'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-slate-700'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('home.guidedStart.title')}
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.guidedStart.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LEARNING_TRACKS.map((track) => {
            const IconComponent = track.icon
            return (
              <button
                key={track.id}
                onClick={() => onSelect(track.id, track.route)}
                className={`group p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                }`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = track.color
                  e.currentTarget.style.boxShadow = `0 0 20px ${track.color}30`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${track.gradient}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t(`home.guidedStart.tracks.${track.id}.title`)}
                    </h3>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t(`home.guidedStart.tracks.${track.id}.description`)}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className={`text-sm transition-colors ${
              theme === 'dark'
                ? 'text-gray-500 hover:text-gray-300'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t('home.guidedStart.skip')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { progress } = useCourseProgress()

  // Guided start modal state
  const [showGuidedStart, setShowGuidedStart] = useState(() => {
    const hasSeenGuide = localStorage.getItem('polarcraft_guided_start_completed')
    return !hasSeenGuide
  })

  const handleGuidedSelect = useCallback((trackId: string, route: string) => {
    localStorage.setItem('polarcraft_guided_start_completed', 'true')
    localStorage.setItem('polarcraft_learning_track', trackId)
    setShowGuidedStart(false)
    navigate(route)
  }, [navigate])

  const handleGuidedClose = useCallback(() => {
    localStorage.setItem('polarcraft_guided_start_completed', 'true')
    setShowGuidedStart(false)
  }, [])

  return (
    <div className={`min-h-screen ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    }`}>
      {/* Background */}
      <PolarizationBackground theme={theme} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={`flex items-center justify-between px-4 py-2 ${
          theme === 'dark'
            ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
            : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
        }`}>
          <div className="flex items-center gap-3">
            <PolarWorldLogo size={40} theme={theme} />
            <span className={`hidden sm:block font-bold text-lg ${
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
            }`}>
              PolarCraft
            </span>
          </div>

          <div className="flex items-center gap-3">
            <QuickStats theme={theme} progress={progress} />
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Hero Section - Redesigned for Impact */}
        <div className="relative mb-12">
          {/* Dramatic background glow */}
          <div className="absolute inset-0 -z-10">
            <div className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]',
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-violet-500/20'
                : 'bg-gradient-to-r from-cyan-400/15 via-blue-400/10 to-violet-400/15'
            )} />
          </div>

          {/* Main Hero Content */}
          <div className="text-center pt-8 pb-6">
            {/* Bold Title with Glow Effect */}
            <h1 className={cn(
              'text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4',
              'text-transparent bg-clip-text',
              theme === 'dark'
                ? 'bg-gradient-to-br from-white via-cyan-200 to-violet-300'
                : 'bg-gradient-to-br from-gray-900 via-cyan-700 to-violet-700'
            )}
              style={{
                textShadow: theme === 'dark'
                  ? '0 0 60px rgba(34, 211, 238, 0.4), 0 0 120px rgba(139, 92, 246, 0.3)'
                  : 'none'
              }}
            >
              PolarCraft
            </h1>

            {/* Animated tagline */}
            <p className={cn(
              'text-lg sm:text-xl md:text-2xl font-medium mb-6',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              {t('home.subtitle')}
            </p>

            {/* Description */}
            <p className={cn(
              'text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {t('home.description')}
            </p>

            {/* CTA Buttons - More prominent */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  const firstDemo = LEARNING_STAGES[0].demos[0]
                  if (firstDemo) navigate(firstDemo.link)
                }}
                className={cn(
                  'group px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3',
                  'bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white',
                  'hover:scale-105 transition-all duration-300',
                  'shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                )}
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {t('home.startLearning')}
              </button>
              <Link
                to="/demos"
                className={cn(
                  'px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3',
                  'border-2 transition-all duration-300 hover:scale-105',
                  theme === 'dark'
                    ? 'border-cyan-500/50 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10'
                    : 'border-cyan-400 text-cyan-700 hover:border-cyan-500 hover:bg-cyan-50'
                )}
              >
                <Eye className="w-6 h-6" />
                {t('home.quick.demos')}
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive Polarized Light Demo */}
        <div className="mb-10">
          <PolarizedLightHero height={200} className="shadow-2xl rounded-2xl" />
        </div>

        {/* Learning Journey - Three Stages (简化预览，点击进入课程大纲) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.learningJourney')}
            </h2>
            <Link
              to="/course"
              className={`text-xs flex items-center gap-1 transition-colors ${
                theme === 'dark'
                  ? 'text-cyan-400 hover:text-cyan-300'
                  : 'text-cyan-600 hover:text-cyan-700'
              }`}
            >
              {t('home.viewAll')}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stage Cards - 水平排列的简化卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LEARNING_STAGES.map((stage) => (
              <LearningStageCard
                key={stage.id}
                stage={stage}
                theme={theme}
                completedDemos={progress.completedDemos}
              />
            ))}
          </div>
        </div>

        {/* Life Scenes & Hands-on Experiments - Integrated Section */}
        <LifeAndExperimentsSection theme={theme} />

        {/* Quick Access Menu */}
        <QuickAccessMenu theme={theme} />

        {/* Course Outline - 详细课程大纲 */}
        <CourseOutlineSection theme={theme} />

        {/* Footer */}
        <footer className={`mt-12 text-center text-xs ${
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        }`}>
          <p className="opacity-60">© 2025 PolarCraft - A New World Under Polarized Light</p>
        </footer>
      </main>

      {/* Guided Start Modal */}
      {showGuidedStart && (
        <GuidedStartModal
          theme={theme}
          onClose={handleGuidedClose}
          onSelect={handleGuidedSelect}
        />
      )}
    </div>
  )
}

export default HomePage
