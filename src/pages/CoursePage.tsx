/**
 * CoursePage - 偏振光下的新世界
 * A New World Under Polarized Light - Course Module
 *
 * 深圳零一学院颠覆创新挑战营课程
 * Gamified, progressive learning experience for polarization optics
 */

import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { PersistentHeader } from '@/components/shared'
import {
  ChevronRight,
  BookOpen,
  Gamepad2,
  FlaskConical,
  Lightbulb,
  FileText,
  ExternalLink,
  Play,
  Lock,
  CheckCircle,
  Star,
  Sparkles,
  GraduationCap,
  Target,
  Users,
  Telescope,
  Atom,
  Zap
} from 'lucide-react'

// Course unit definition
interface CourseUnit {
  id: string
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  icon: React.ReactNode
  color: string
  status: 'locked' | 'available' | 'completed'
  resources: {
    demos?: string[]
    games?: string[]
    experiments?: string[]
    tools?: string[]
  }
  attachments?: {
    type: 'ppt' | 'pdf' | 'doc' | 'link'
    titleKey: string
    url?: string
  }[]
  learningObjectives?: string[]
}

// Course structure - progressive unlocking
const COURSE_UNITS: CourseUnit[] = [
  {
    id: 'intro',
    titleKey: 'course.units.intro.title',
    subtitleKey: 'course.units.intro.subtitle',
    descriptionKey: 'course.units.intro.description',
    icon: <Lightbulb className="w-6 h-6" />,
    color: '#C9A227', // amber
    status: 'available',
    resources: {
      demos: ['light-wave', 'polarization-intro'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.introPPT' },
      { type: 'pdf', titleKey: 'course.attachments.introGuide' },
    ],
    learningObjectives: [
      'course.objectives.intro.1',
      'course.objectives.intro.2',
      'course.objectives.intro.3',
    ],
  },
  {
    id: 'devices',
    titleKey: 'course.units.devices.title',
    subtitleKey: 'course.units.devices.subtitle',
    descriptionKey: 'course.units.devices.description',
    icon: <Atom className="w-6 h-6" />,
    color: '#6366F1', // indigo
    status: 'available',
    resources: {
      tools: ['/optical-studio?tab=devices'],
      demos: ['polarization-types'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.devicesPPT' },
    ],
    learningObjectives: [
      'course.objectives.devices.1',
      'course.objectives.devices.2',
    ],
  },
  {
    id: 'malus',
    titleKey: 'course.units.malus.title',
    subtitleKey: 'course.units.malus.subtitle',
    descriptionKey: 'course.units.malus.description',
    icon: <Target className="w-6 h-6" />,
    color: '#0891B2', // cyan
    status: 'available',
    resources: {
      demos: ['malus-law'],
      games: ['/games/2d?level=0'],
      experiments: ['/optical-studio?tab=experiments'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.malusPPT' },
      { type: 'link', titleKey: 'course.attachments.malusWiki', url: 'https://en.wikipedia.org/wiki/Malus%27s_law' },
    ],
    learningObjectives: [
      'course.objectives.malus.1',
      'course.objectives.malus.2',
      'course.objectives.malus.3',
    ],
  },
  {
    id: 'birefringence',
    titleKey: 'course.units.birefringence.title',
    subtitleKey: 'course.units.birefringence.subtitle',
    descriptionKey: 'course.units.birefringence.description',
    icon: <Zap className="w-6 h-6" />,
    color: '#F59E0B', // orange
    status: 'available',
    resources: {
      demos: ['birefringence', 'waveplate'],
      games: ['/games/2d?level=3'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.birefringencePPT' },
    ],
    learningObjectives: [
      'course.objectives.birefringence.1',
      'course.objectives.birefringence.2',
    ],
  },
  {
    id: 'puzzles',
    titleKey: 'course.units.puzzles.title',
    subtitleKey: 'course.units.puzzles.subtitle',
    descriptionKey: 'course.units.puzzles.description',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: '#EC4899', // pink
    status: 'available',
    resources: {
      games: ['/games/2d', '/games/3d', '/games/escape'],
    },
    learningObjectives: [
      'course.objectives.puzzles.1',
      'course.objectives.puzzles.2',
    ],
  },
  {
    id: 'creative',
    titleKey: 'course.units.creative.title',
    subtitleKey: 'course.units.creative.subtitle',
    descriptionKey: 'course.units.creative.description',
    icon: <Sparkles className="w-6 h-6" />,
    color: '#10B981', // emerald
    status: 'available',
    resources: {
      experiments: ['/experiments/diy', '/experiments/showcase'],
      tools: ['/experiments/generator'],
    },
    attachments: [
      { type: 'pdf', titleKey: 'course.attachments.creativePDF' },
    ],
    learningObjectives: [
      'course.objectives.creative.1',
      'course.objectives.creative.2',
    ],
  },
  {
    id: 'research',
    titleKey: 'course.units.research.title',
    subtitleKey: 'course.units.research.subtitle',
    descriptionKey: 'course.units.research.description',
    icon: <Telescope className="w-6 h-6" />,
    color: '#8B5CF6', // violet
    status: 'available',
    resources: {
      tools: ['/lab?tab=tasks', '/calc'],
      demos: ['stokes-vector', 'mueller-matrix'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.researchPPT' },
      { type: 'link', titleKey: 'course.attachments.researchPapers' },
    ],
    learningObjectives: [
      'course.objectives.research.1',
      'course.objectives.research.2',
      'course.objectives.research.3',
    ],
  },
]

// Hero animation component with polarized light effect
function CourseHero({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(p => (p + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-3xl mb-8">
      {/* Animated background */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${animationPhase}deg at 50% 50%,
                rgba(201, 162, 39, 0.15) 0deg,
                rgba(99, 102, 241, 0.15) 60deg,
                rgba(8, 145, 178, 0.15) 120deg,
                rgba(245, 158, 11, 0.15) 180deg,
                rgba(236, 72, 153, 0.15) 240deg,
                rgba(16, 185, 129, 0.15) 300deg,
                rgba(201, 162, 39, 0.15) 360deg)`
            : `conic-gradient(from ${animationPhase}deg at 50% 50%,
                rgba(201, 162, 39, 0.1) 0deg,
                rgba(99, 102, 241, 0.1) 60deg,
                rgba(8, 145, 178, 0.1) 120deg,
                rgba(245, 158, 11, 0.1) 180deg,
                rgba(236, 72, 153, 0.1) 240deg,
                rgba(16, 185, 129, 0.1) 300deg,
                rgba(201, 162, 39, 0.1) 360deg)`,
        }}
      />

      {/* Light rays */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 45 * Math.cos((animationPhase + i * 60) * Math.PI / 180)}
            y2={50 + 45 * Math.sin((animationPhase + i * 60) * Math.PI / 180)}
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Content */}
      <div className={`relative z-10 p-8 md:p-12 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
            {t('course.badge')}
          </span>
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === 'dark'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600'
        }`}>
          {t('course.title')}
        </h1>

        <p className={`text-base md:text-lg leading-relaxed max-w-4xl mb-6 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {t('course.description')}
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {t('course.stats.units', { count: COURSE_UNITS.length })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Gamepad2 className={`w-5 h-5 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {t('course.stats.games')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {t('course.stats.experiments')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {t('course.stats.community')}
            </span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform">
            <Play className="w-5 h-5" />
            {t('course.startLearning')}
          </button>
          <Link
            to="/chronicles"
            className={`px-6 py-3 rounded-full border-2 font-medium flex items-center gap-2 hover:scale-105 transition-transform ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-400'
                : 'border-gray-300 text-gray-600 hover:border-gray-500'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            {t('course.viewHistory')}
          </Link>
        </div>
      </div>
    </div>
  )
}

// Course unit card component
function UnitCard({ unit, index, theme }: { unit: CourseUnit; index: number; theme: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const statusIcon = unit.status === 'completed'
    ? <CheckCircle className="w-5 h-5 text-emerald-500" />
    : unit.status === 'locked'
      ? <Lock className="w-5 h-5 text-gray-400" />
      : <Star className="w-5 h-5" style={{ color: unit.color }} />

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        unit.status === 'locked'
          ? 'opacity-60'
          : 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'
      } ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
          : 'bg-white border-gray-200 hover:border-gray-400'
      }`}
      style={{
        borderColor: unit.status !== 'locked' && isExpanded ? unit.color : undefined,
        boxShadow: unit.status !== 'locked' && isExpanded ? `0 0 30px ${unit.color}30` : undefined,
      }}
      onClick={() => unit.status !== 'locked' && setIsExpanded(!isExpanded)}
    >
      {/* Unit header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Unit number and icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${unit.color}20` }}
          >
            <span style={{ color: unit.color }}>{unit.icon}</span>
          </div>

          {/* Unit info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                {t('course.unit')} {index + 1}
              </span>
              {statusIcon}
            </div>
            <h3 className={`text-lg font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t(unit.titleKey)}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t(unit.subtitleKey)}
            </p>
          </div>

          {/* Expand indicator */}
          <ChevronRight
            className={`w-5 h-5 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          />
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && unit.status !== 'locked' && (
        <div className={`px-5 pb-5 pt-0 border-t ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
        }`}>
          <p className={`text-sm mb-4 mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t(unit.descriptionKey)}
          </p>

          {/* Learning objectives */}
          {unit.learningObjectives && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('course.learningObjectives')}
              </h4>
              <ul className="space-y-1">
                {unit.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: unit.color }} />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {t(obj)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources links */}
          <div className="flex flex-wrap gap-2 mb-4">
            {unit.resources.demos?.map((demo, i) => (
              <Link
                key={`demo-${i}`}
                to={`/demos/${demo}`}
                onClick={e => e.stopPropagation()}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                  theme === 'dark'
                    ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50'
                    : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                }`}
              >
                <FlaskConical className="w-3 h-3" />
                {t('course.demo')}
              </Link>
            ))}
            {unit.resources.games?.map((game, i) => (
              <Link
                key={`game-${i}`}
                to={game}
                onClick={e => e.stopPropagation()}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                  theme === 'dark'
                    ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                <Gamepad2 className="w-3 h-3" />
                {t('course.game')}
              </Link>
            ))}
            {unit.resources.experiments?.map((exp, i) => (
              <Link
                key={`exp-${i}`}
                to={exp}
                onClick={e => e.stopPropagation()}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                  theme === 'dark'
                    ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {t('course.experiment')}
              </Link>
            ))}
            {unit.resources.tools?.map((tool, i) => (
              <Link
                key={`tool-${i}`}
                to={tool}
                onClick={e => e.stopPropagation()}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                  theme === 'dark'
                    ? 'bg-violet-900/30 text-violet-400 hover:bg-violet-900/50'
                    : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                }`}
              >
                <Target className="w-3 h-3" />
                {t('course.tool')}
              </Link>
            ))}
          </div>

          {/* Attachments */}
          {unit.attachments && unit.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {unit.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.url || '#'}
                  onClick={e => e.stopPropagation()}
                  target={att.type === 'link' ? '_blank' : undefined}
                  rel={att.type === 'link' ? 'noopener noreferrer' : undefined}
                  className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {att.type === 'link'
                    ? <ExternalLink className="w-3 h-3" />
                    : <FileText className="w-3 h-3" />
                  }
                  {t(att.titleKey)}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Resources section component
function ResourcesSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  const resources = [
    {
      titleKey: 'course.resources.references.title',
      descriptionKey: 'course.resources.references.description',
      icon: <BookOpen className="w-6 h-6" />,
      color: '#C9A227',
      links: [
        { labelKey: 'course.resources.references.link1', url: 'https://en.wikipedia.org/wiki/Polarization_(waves)' },
        { labelKey: 'course.resources.references.link2', url: 'https://en.wikipedia.org/wiki/Malus%27s_law' },
        { labelKey: 'course.resources.references.link3', url: 'https://en.wikipedia.org/wiki/Birefringence' },
      ],
    },
    {
      titleKey: 'course.resources.tutorials.title',
      descriptionKey: 'course.resources.tutorials.description',
      icon: <GraduationCap className="w-6 h-6" />,
      color: '#6366F1',
      internalLinks: [
        { labelKey: 'course.resources.tutorials.link1', route: '/demos' },
        { labelKey: 'course.resources.tutorials.link2', route: '/optical-studio' },
        { labelKey: 'course.resources.tutorials.link3', route: '/chronicles' },
      ],
    },
    {
      titleKey: 'course.resources.community.title',
      descriptionKey: 'course.resources.community.description',
      icon: <Users className="w-6 h-6" />,
      color: '#10B981',
      internalLinks: [
        { labelKey: 'course.resources.community.link1', route: '/lab?tab=community' },
        { labelKey: 'course.resources.community.link2', route: '/experiments/gallery' },
      ],
    },
  ]

  return (
    <div className="mt-12">
      <h2 className={`text-2xl font-bold mb-6 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {t('course.resources.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 border transition-all hover:-translate-y-1 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${resource.color}20` }}
            >
              <span style={{ color: resource.color }}>{resource.icon}</span>
            </div>

            <h3 className={`text-lg font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t(resource.titleKey)}
            </h3>

            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t(resource.descriptionKey)}
            </p>

            <div className="space-y-2">
              {resource.links?.map((link, j) => (
                <a
                  key={j}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-cyan-400'
                      : 'text-gray-600 hover:text-cyan-600'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  {t(link.labelKey)}
                </a>
              ))}
              {resource.internalLinks?.map((link, j) => (
                <Link
                  key={j}
                  to={link.route}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-cyan-400'
                      : 'text-gray-600 hover:text-cyan-600'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CoursePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const unitId = searchParams.get('unit')

  return (
    <div className={`min-h-screen ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      <PersistentHeader
        moduleKey="course"
        moduleNameKey="course.title"
        showSettings={true}
        variant="glass"
        showBreadcrumb={true}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero section */}
        <CourseHero theme={theme} />

        {/* Course units */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('course.curriculum')}
          </h2>

          <div className="space-y-4">
            {COURSE_UNITS.map((unit, index) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                index={index}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* Resources section */}
        <ResourcesSection theme={theme} />

        {/* Footer CTA */}
        <div className={`mt-12 p-8 rounded-2xl text-center ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-pink-900/30'
            : 'bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50'
        }`}>
          <h3 className={`text-xl font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('course.cta.title')}
          </h3>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('course.cta.description')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/games"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Gamepad2 className="w-5 h-5" />
              {t('course.cta.playGames')}
            </Link>
            <Link
              to="/lab"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Telescope className="w-5 h-5" />
              {t('course.cta.joinResearch')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
