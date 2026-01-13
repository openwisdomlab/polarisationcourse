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
import {
  ChevronRight,
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

// Learning Stage Card Component
function LearningStageCard({
  stage,
  theme,
  isExpanded,
  onToggle,
  completedDemos,
}: {
  stage: LearningStage
  theme: 'dark' | 'light'
  isExpanded: boolean
  onToggle: () => void
  completedDemos: string[]
}) {
  const { t } = useTranslation()

  // Calculate progress for this stage
  const totalDemos = stage.demos.length
  const completedCount = stage.demos.filter(d => completedDemos.includes(d.id)).length
  const progressPercent = totalDemos > 0 ? Math.round((completedCount / totalDemos) * 100) : 0

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
          : 'bg-white/80 border-gray-200 hover:border-gray-300'
      }`}
      style={{
        borderColor: isExpanded ? stage.color : undefined,
        boxShadow: isExpanded ? `0 0 40px ${stage.color}20` : undefined,
      }}
    >
      {/* Stage header */}
      <div
        className={`p-5 cursor-pointer transition-all ${
          theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          {/* Phase number badge */}
          <div
            className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br ${stage.gradient} shadow-lg`}
          >
            <span className="text-white text-xs font-medium opacity-80">{t('home.phase')}</span>
            <span className="text-white text-xl font-bold">{stage.phase}</span>
          </div>

          {/* Stage info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t(stage.titleKey)}
              </h3>
              {stage.isAdvanced && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  theme === 'dark'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'bg-violet-100 text-violet-700 border border-violet-200'
                }`}>
                  {t('home.advanced')}
                </span>
              )}
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t(stage.subtitleKey)}
            </p>
            {/* Core question */}
            <p className={`text-sm mt-2 italic ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`}>
              "{t(stage.questionKey)}"
            </p>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className={`flex-1 h-1.5 rounded-full ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stage.gradient} transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {completedCount}/{totalDemos}
              </span>
            </div>
          </div>

          {/* Expand indicator */}
          <ChevronRight
            className={`w-5 h-5 transition-transform flex-shrink-0 mt-2 ${
              isExpanded ? 'rotate-90' : ''
            } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          />
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className={`px-5 pb-5 border-t ${
          theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
        }`}>
          {/* Demos section */}
          <div className="mt-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FlaskConical className="w-3.5 h-3.5" />
              {t('home.resources.demos')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stage.demos.map((demo) => (
                <Link
                  key={demo.id}
                  to={demo.link}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5 ${
                    completedDemos.includes(demo.id)
                      ? theme === 'dark'
                        ? 'bg-green-900/20 border border-green-500/30'
                        : 'bg-green-50 border border-green-200'
                      : theme === 'dark'
                        ? 'bg-slate-700/50 border border-slate-600/50 hover:border-cyan-500/50'
                        : 'bg-gray-50 border border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      completedDemos.includes(demo.id)
                        ? 'bg-green-500/20'
                        : `bg-gradient-to-br ${stage.gradient} bg-opacity-20`
                    }`}
                    style={{ backgroundColor: completedDemos.includes(demo.id) ? undefined : `${stage.color}20` }}
                  >
                    {completedDemos.includes(demo.id) ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Eye className="w-4 h-4" style={{ color: stage.color }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t(demo.titleKey)}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  }`} />
                </Link>
              ))}
            </div>
          </div>

          {/* Games section - temporarily hidden
          {stage.games && stage.games.length > 0 && (
            <div className="mt-4">
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Gamepad2 className="w-3.5 h-3.5" />
                {t('home.resources.games')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {stage.games.map((game, idx) => (
                  <Link
                    key={idx}
                    to={game.link}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50'
                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    {t(game.titleKey)}
                  </Link>
                ))}
              </div>
            </div>
          )}
          */}

          {/* Tools section */}
          {stage.tools && stage.tools.length > 0 && (
            <div className="mt-4">
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Wrench className="w-3.5 h-3.5" />
                {t('home.resources.tools')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {stage.tools.map((tool, idx) => (
                  <Link
                    key={idx}
                    to={tool.link}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {t(tool.titleKey)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-5">
            <Link
              to={stage.demos[0]?.link || '/demos'}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 bg-gradient-to-r ${stage.gradient} text-white shadow-lg`}
            >
              <Play className="w-4 h-4" />
              {t('home.startStage')}
            </Link>
          </div>
        </div>
      )}
    </div>
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
  const [expandedStageId, setExpandedStageId] = useState<string>('stage1')

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
            <div className="hidden sm:block">
              <span className={`font-bold text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t('home.title')}
              </span>
              <span className={`block text-[10px] ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('home.subtitle')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <QuickStats theme={theme} progress={progress} />
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Polarized Light Demonstration Effect */}
        <div className="mb-8">
          <PolarizedLightHero height={180} className="shadow-xl" />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <PolarWorldLogo size={100} theme={theme} animated={true} />
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 ${
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600'
          }`}>
            {t('home.title')}
          </h1>
          <p className={`text-sm mb-2 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          }`}>
            {t('home.subtitle')}
          </p>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('home.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={() => {
                const firstDemo = LEARNING_STAGES[0].demos[0]
                if (firstDemo) navigate(firstDemo.link)
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
            >
              <Play className="w-5 h-5" />
              {t('home.startLearning')}
            </button>
            <Link
              to="/course"
              className={`px-6 py-3 rounded-full border-2 font-medium flex items-center gap-2 hover:scale-105 transition-transform ${
                theme === 'dark'
                  ? 'border-violet-500/50 text-violet-300 hover:border-violet-400 hover:bg-violet-500/10'
                  : 'border-violet-300 text-violet-600 hover:border-violet-500 hover:bg-violet-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              {t('home.viewCourse')}
            </Link>
          </div>
        </div>

        {/* Learning Journey - Three Stages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.learningJourney')}
            </h2>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              {LEARNING_STAGES.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => setExpandedStageId(stage.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    expandedStageId === stage.id
                      ? `bg-gradient-to-r ${stage.gradient} text-white`
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Cards */}
          <div className="space-y-4">
            {LEARNING_STAGES.map((stage) => (
              <LearningStageCard
                key={stage.id}
                stage={stage}
                theme={theme}
                isExpanded={expandedStageId === stage.id}
                onToggle={() => setExpandedStageId(expandedStageId === stage.id ? '' : stage.id)}
                completedDemos={progress.completedDemos}
              />
            ))}
          </div>
        </div>

        {/* Life Scenes & Hands-on Experiments - Integrated Section */}
        <LifeAndExperimentsSection theme={theme} />

        {/* Quick Access Menu */}
        <QuickAccessMenu theme={theme} />

        {/* Footer */}
        <footer className={`mt-12 text-center text-xs ${
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        }`}>
          <p>偏振光下的新世界 · 深圳零一学院颠覆创新挑战营</p>
          <p className="mt-1 opacity-60">A New World Under Polarized Light · Open Wisdom Lab</p>
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
