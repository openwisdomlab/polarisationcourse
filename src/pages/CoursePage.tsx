/**
 * CoursePage - 偏振光下的新世界
 * A New World Under Polarized Light - Course Module
 *
 * 深圳零一学院颠覆创新挑战营课程
 * Gamified, progressive learning experience for polarization optics
 */

import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { PersistentHeader } from '@/components/shared'
import { WorldMap, InsightCollection } from '@/components/course'
import { useCourseProgress } from '@/hooks'
import {
  ChevronRight,
  BookOpen,
  Gamepad2,
  FlaskConical,
  Lightbulb,
  FileText,
  Play,
  CheckCircle,
  Star,
  Sparkles,
  GraduationCap,
  Target,
  Telescope,
  Zap,
  TrendingUp,
  Clock,
  Flame,
  Users
} from 'lucide-react'

// Course unit definition
interface CourseUnit {
  id: string
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  icon: React.ReactNode
  color: string
  sections?: {
    id: string
    titleKey: string
    descriptionKey: string
    demoLink?: string  // Link to related demo
  }[]
  resources: {
    demos?: string[]
    games?: string[]
    experiments?: string[]
    tools?: string[]
  }
  attachments?: {
    type: 'ppt' | 'pdf' | 'doc'
    titleKey: string
  }[]
  learningObjectives?: string[]
}

// Course structure based on PSRT curriculum - 5 main units
// All units are accessible for open exploration (no lock/unlock system)
const COURSE_UNITS: CourseUnit[] = [
  {
    // 第一单元：光的偏振态及其调制和测量
    id: 'unit1',
    titleKey: 'course.units.unit1.title',
    subtitleKey: 'course.units.unit1.subtitle',
    descriptionKey: 'course.units.unit1.description',
    icon: <Lightbulb className="w-6 h-6" />,
    color: '#C9A227', // amber
    sections: [
      { id: '1.1', titleKey: 'course.units.unit1.s1.title', descriptionKey: 'course.units.unit1.s1.desc', demoLink: '/demos/light-wave' },
      { id: '1.2', titleKey: 'course.units.unit1.s2.title', descriptionKey: 'course.units.unit1.s2.desc', demoLink: '/demos/birefringence' },
      { id: '1.3', titleKey: 'course.units.unit1.s3.title', descriptionKey: 'course.units.unit1.s3.desc', demoLink: '/demos/malus' },
    ],
    resources: {
      demos: ['light-wave', 'polarization-intro', 'polarization-types', 'birefringence', 'malus'],
      tools: ['/optical-studio?tab=devices'],
      games: ['/game2d?level=0', '/game2d?level=1', '/game2d?level=16', '/game2d?level=17'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.unit1PPT' },
      { type: 'pdf', titleKey: 'course.attachments.unit1Guide' },
    ],
    learningObjectives: [
      'course.objectives.unit1.1',
      'course.objectives.unit1.2',
      'course.objectives.unit1.3',
      'course.objectives.unit1.4',
    ],
  },
  {
    // 第二单元：界面反射的偏振特征
    id: 'unit2',
    titleKey: 'course.units.unit2.title',
    subtitleKey: 'course.units.unit2.subtitle',
    descriptionKey: 'course.units.unit2.description',
    icon: <Zap className="w-6 h-6" />,
    color: '#6366F1', // indigo
    sections: [
      { id: '2.1', titleKey: 'course.units.unit2.s1.title', descriptionKey: 'course.units.unit2.s1.desc', demoLink: '/demos/fresnel' },
      { id: '2.2', titleKey: 'course.units.unit2.s2.title', descriptionKey: 'course.units.unit2.s2.desc', demoLink: '/demos/brewster' },
    ],
    resources: {
      demos: ['fresnel', 'brewster'],
      experiments: ['/optical-studio?tab=experiments'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.unit2PPT' },
    ],
    learningObjectives: [
      'course.objectives.unit2.1',
      'course.objectives.unit2.2',
      'course.objectives.unit2.3',
    ],
  },
  {
    // 第三单元：透明介质的偏振特征
    id: 'unit3',
    titleKey: 'course.units.unit3.title',
    subtitleKey: 'course.units.unit3.subtitle',
    descriptionKey: 'course.units.unit3.description',
    icon: <Sparkles className="w-6 h-6" />,
    color: '#0891B2', // cyan
    sections: [
      { id: '3.1', titleKey: 'course.units.unit3.s1.title', descriptionKey: 'course.units.unit3.s1.desc', demoLink: '/demos/chromatic' },
      { id: '3.2', titleKey: 'course.units.unit3.s2.title', descriptionKey: 'course.units.unit3.s2.desc', demoLink: '/demos/optical-rotation' },
    ],
    resources: {
      demos: ['anisotropy', 'chromatic', 'optical-rotation', 'waveplate'],
      experiments: ['/optical-studio?tab=experiments'],
      games: ['/game2d?level=3'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.unit3PPT' },
      { type: 'pdf', titleKey: 'course.attachments.stressAnalysis' },
    ],
    learningObjectives: [
      'course.objectives.unit3.1',
      'course.objectives.unit3.2',
      'course.objectives.unit3.3',
    ],
  },
  {
    // 第四单元：浑浊介质的偏振特征
    id: 'unit4',
    titleKey: 'course.units.unit4.title',
    subtitleKey: 'course.units.unit4.subtitle',
    descriptionKey: 'course.units.unit4.description',
    icon: <Target className="w-6 h-6" />,
    color: '#F59E0B', // orange
    sections: [
      { id: '4.1', titleKey: 'course.units.unit4.s1.title', descriptionKey: 'course.units.unit4.s1.desc', demoLink: '/demos/rayleigh' },
      { id: '4.2', titleKey: 'course.units.unit4.s2.title', descriptionKey: 'course.units.unit4.s2.desc', demoLink: '/demos/mie-scattering' },
    ],
    resources: {
      demos: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.unit4PPT' },
    ],
    learningObjectives: [
      'course.objectives.unit4.1',
      'course.objectives.unit4.2',
      'course.objectives.unit4.3',
    ],
  },
  {
    // 第五单元：偏振光学技术和复杂结构介质物性的定量表征
    id: 'unit5',
    titleKey: 'course.units.unit5.title',
    subtitleKey: 'course.units.unit5.subtitle',
    descriptionKey: 'course.units.unit5.description',
    icon: <Telescope className="w-6 h-6" />,
    color: '#8B5CF6', // violet
    sections: [
      { id: '5.1', titleKey: 'course.units.unit5.s1.title', descriptionKey: 'course.units.unit5.s1.desc', demoLink: '/demos/stokes' },
      { id: '5.2', titleKey: 'course.units.unit5.s2.title', descriptionKey: 'course.units.unit5.s2.desc', demoLink: '/demos/mueller' },
      { id: '5.3', titleKey: 'course.units.unit5.s3.title', descriptionKey: 'course.units.unit5.s3.desc', demoLink: '/demos/jones' },
      { id: '5.4', titleKey: 'course.units.unit5.s4.title', descriptionKey: 'course.units.unit5.s4.desc', demoLink: '/demos/polarimetric-microscopy' },
    ],
    resources: {
      demos: ['stokes', 'mueller', 'jones', 'polarimetric-microscopy'],
      tools: ['/calc/stokes', '/calc/mueller', '/calc/poincare', '/lab?tab=tasks'],
    },
    attachments: [
      { type: 'ppt', titleKey: 'course.attachments.unit5PPT' },
      { type: 'pdf', titleKey: 'course.attachments.muellerGuide' },
    ],
    learningObjectives: [
      'course.objectives.unit5.1',
      'course.objectives.unit5.2',
      'course.objectives.unit5.3',
      'course.objectives.unit5.4',
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
          <div className="p-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            theme === 'dark'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-blue-500/20 text-blue-700'
          }`}>
            P-SRT
          </span>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            {t('course.badge')}
          </span>
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === 'dark'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600'
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
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform">
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

// Course unit card component - all units accessible for open exploration
function UnitCard({ unit, index, theme }: { unit: CourseUnit; index: number; theme: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
          : 'bg-white border-gray-200 hover:border-gray-400'
      }`}
      style={{
        borderColor: isExpanded ? unit.color : undefined,
        boxShadow: isExpanded ? `0 0 30px ${unit.color}30` : undefined,
      }}
      onClick={() => setIsExpanded(!isExpanded)}
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
              <Star className="w-5 h-5" style={{ color: unit.color }} />
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
      {isExpanded && (
        <div className={`px-5 pb-5 pt-0 border-t ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
        }`}>
          <p className={`text-sm mb-4 mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t(unit.descriptionKey)}
          </p>

          {/* Course sections - display only, with optional demo link button */}
          {unit.sections && unit.sections.length > 0 && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('course.sections')}
              </h4>
              <div className="space-y-2">
                {unit.sections.map((section) => (
                  <div
                    key={section.id}
                    onClick={e => e.stopPropagation()}
                    className={`block p-3 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-slate-700/50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                      >
                        {section.id}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {t(section.titleKey)}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t(section.descriptionKey)}
                        </p>
                      </div>
                      {section.demoLink && (
                        <Link
                          to={section.demoLink}
                          onClick={e => e.stopPropagation()}
                          className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-slate-600 text-cyan-400'
                              : 'hover:bg-gray-200 text-cyan-600'
                          }`}
                          title={t('course.viewDemo')}
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                to={`/demos/${demo}` as string}
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

          {/* Attachments - internal documents only */}
          {unit.attachments && unit.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {unit.attachments.map((att, i) => (
                <span
                  key={i}
                  onClick={e => e.stopPropagation()}
                  className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-default ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  {t(att.titleKey)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Custom SVG icons for application areas
function OceanIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  )
}

function BiomedicalIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function MaterialsIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function IndustryIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  )
}

function AutonomousIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8c-.4.5-.6 1.1-.6 1.7V16c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

function AtmosphereIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

// Applications section component - redesigned with proper icons and cases (compact version)
function ApplicationsSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  const applications = [
    {
      icon: OceanIcon,
      nameKey: 'course.apps.ocean',
      descKey: 'course.apps.oceanDesc',
      caseKey: 'course.apps.oceanCase',
      color: '#0ea5e9',
      demoLink: '/demos/rayleigh',
    },
    {
      icon: BiomedicalIcon,
      nameKey: 'course.apps.biomedical',
      descKey: 'course.apps.biomedicalDesc',
      caseKey: 'course.apps.biomedicalCase',
      color: '#ec4899',
      demoLink: '/demos/optical-rotation',
    },
    {
      icon: MaterialsIcon,
      nameKey: 'course.apps.materials',
      descKey: 'course.apps.materialsDesc',
      caseKey: 'course.apps.materialsCase',
      color: '#8b5cf6',
      demoLink: '/demos/chromatic',
    },
    {
      icon: IndustryIcon,
      nameKey: 'course.apps.industry',
      descKey: 'course.apps.industryDesc',
      caseKey: 'course.apps.industryCase',
      color: '#f59e0b',
      demoLink: '/optical-studio?tab=experiments',
    },
    {
      icon: AutonomousIcon,
      nameKey: 'course.apps.autonomous',
      descKey: 'course.apps.autonomousDesc',
      caseKey: 'course.apps.autonomousCase',
      color: '#22c55e',
      demoLink: '/demos/mie-scattering',
    },
    {
      icon: AtmosphereIcon,
      nameKey: 'course.apps.atmosphere',
      descKey: 'course.apps.atmosphereDesc',
      caseKey: 'course.apps.atmosphereCase',
      color: '#06b6d4',
      demoLink: '/demos/rayleigh',
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className={`text-lg font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {t('course.apps.title')}
        </h2>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {t('course.apps.badge')}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {applications.map((app, i) => {
          const IconComponent = app.icon
          return (
            <Link
              key={i}
              to={app.demoLink}
              className={`group rounded-lg p-2.5 border transition-all duration-200 hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${app.color}15` }}
                >
                  <IconComponent className="w-4.5 h-4.5" color={app.color} />
                </div>

                {/* Name */}
                <h3 className={`text-[11px] font-medium line-clamp-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t(app.nameKey)}
                </h3>

                {/* Case - compact */}
                <span className={`text-[9px] mt-0.5 line-clamp-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {t(app.caseKey)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Home experiments section - family-friendly experiments from curriculum (compact version)
function HomeExperimentsSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  const experiments = [
    {
      id: 'sugar-rainbow',
      titleKey: 'course.homeExperiments.sugarRainbow.title',
      descriptionKey: 'course.homeExperiments.sugarRainbow.description',
      materialsKeys: [
        'course.homeExperiments.sugarRainbow.materials.0',
        'course.homeExperiments.sugarRainbow.materials.1',
        'course.homeExperiments.sugarRainbow.materials.2',
      ],
      icon: '🌈',
      color: '#EC4899', // pink
      unit: 3,
      demoLink: '/demos/optical-rotation',
    },
    {
      id: 'screen-polarizer',
      titleKey: 'course.homeExperiments.screenPolarizer.title',
      descriptionKey: 'course.homeExperiments.screenPolarizer.description',
      materialsKeys: [
        'course.homeExperiments.screenPolarizer.materials.0',
        'course.homeExperiments.screenPolarizer.materials.1',
      ],
      icon: '📱',
      color: '#3B82F6', // blue
      unit: 1,
      demoLink: '/demos/malus',
    },
    {
      id: 'tape-art',
      titleKey: 'course.homeExperiments.tapeArt.title',
      descriptionKey: 'course.homeExperiments.tapeArt.description',
      materialsKeys: [
        'course.homeExperiments.tapeArt.materials.0',
        'course.homeExperiments.tapeArt.materials.1',
        'course.homeExperiments.tapeArt.materials.2',
      ],
      icon: '🎨',
      color: '#8B5CF6', // purple
      unit: 3,
      demoLink: '/demos/chromatic',
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className={`text-lg font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {t('course.homeExperiments.title')}
        </h2>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-700'
        }`}>
          {t('course.homeExperiments.badge')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className={`rounded-lg p-3 border transition-all duration-200 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-sm"
                style={{ backgroundColor: `${exp.color}15` }}
              >
                {exp.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t(exp.titleKey)}
                </h3>
              </div>
              <Link
                to={exp.demoLink}
                className={`flex-shrink-0 p-1.5 rounded-md transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50'
                    : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                }`}
              >
                <FlaskConical className="w-3 h-3" />
              </Link>
            </div>

            <p className={`text-[11px] mb-2 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t(exp.descriptionKey)}
            </p>

            <div className="flex flex-wrap gap-1">
              {exp.materialsKeys.slice(0, 2).map((key, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {t(key)}
                </span>
              ))}
              {exp.materialsKeys.length > 2 && (
                <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  +{exp.materialsKeys.length - 2}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Insight Collection Section - 光学道具收集系统包装器（压缩版）
function InsightCollectionSection({ theme, completedDemos }: { theme: 'dark' | 'light'; completedDemos: string[] }) {
  const { progress } = useCourseProgress()

  return (
    <div className="mb-6">
      <InsightCollection
        theme={theme}
        completedDemos={completedDemos}
        quizScores={progress.quizScores || {}}
        streakDays={progress.streakDays || 0}
        variant="full"
      />
    </div>
  )
}

// Inquiry-based exploration section - research questions that drive learning (compressed)
function InquiryExplorationSection({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  const inquiryQuestions = [
    {
      question: t('course.inquiry.q1'),
      unitLink: 'unit1',
      icon: '🔍',
      color: '#3B82F6', // blue
      demoLink: '/demos/polarization-intro',
      gameLink: '/game2d?level=0',
    },
    {
      question: t('course.inquiry.q2'),
      unitLink: 'unit1',
      icon: '💎',
      color: '#8B5CF6', // purple
      demoLink: '/demos/birefringence',
      gameLink: '/game2d?level=16',
    },
    {
      question: t('course.inquiry.q3'),
      unitLink: 'unit2',
      icon: '🪞',
      color: '#06B6D4', // cyan
      demoLink: '/demos/brewster',
      gameLink: null,
    },
    {
      question: t('course.inquiry.q4'),
      unitLink: 'unit4',
      icon: '🌅',
      color: '#F59E0B', // amber
      demoLink: '/demos/rayleigh',
      gameLink: null,
    },
    {
      question: t('course.inquiry.q5'),
      unitLink: 'unit3',
      icon: '🍬',
      color: '#10B981', // emerald
      demoLink: '/demos/optical-rotation',
      gameLink: null,
    },
    {
      question: t('course.inquiry.q6'),
      unitLink: 'unit3',
      icon: '📦',
      color: '#F472B6', // pink
      demoLink: '/demos/chromatic',
      gameLink: null,
    },
  ]

  return (
    <div className={`rounded-2xl p-4 h-full ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className={`text-sm font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {t('course.inquiry.title')}
        </h3>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
        }`}>
          {t('course.inquiry.badge')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {inquiryQuestions.map((item, i) => (
          <div
            key={i}
            className={`group relative rounded-lg p-2.5 border transition-all duration-200 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500'
                : 'bg-gray-50 border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-sm"
                style={{ backgroundColor: `${item.color}15` }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium leading-tight truncate ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {item.question}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Link
                  to={item.demoLink}
                  onClick={e => e.stopPropagation()}
                  className={`p-1.5 rounded-md transition-all hover:scale-110 ${
                    theme === 'dark'
                      ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50'
                      : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                  }`}
                  title={t('course.inquiry.explore')}
                >
                  <FlaskConical className="w-3 h-3" />
                </Link>
                {item.gameLink && (
                  <Link
                    to={item.gameLink}
                    onClick={e => e.stopPropagation()}
                    className={`p-1.5 rounded-md transition-all hover:scale-110 ${
                      theme === 'dark'
                        ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50'
                        : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    }`}
                    title={t('course.inquiry.play')}
                  >
                    <Gamepad2 className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Progress Stats Component
function ProgressStats({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const { progress, getOverallProgress } = useCourseProgress()

  // 所有演示 ID
  const allDemoIds = [
    'light-wave', 'polarization-intro', 'polarization-types', 'optical-bench',
    'polarization-state', 'malus', 'birefringence', 'waveplate',
    'fresnel', 'brewster',
    'anisotropy', 'chromatic', 'optical-rotation',
    'rayleigh', 'mie-scattering', 'monte-carlo-scattering',
    'stokes', 'mueller', 'jones', 'calculator', 'polarimetric-microscopy',
  ]

  const overallProgress = getOverallProgress(allDemoIds)
  const timeSpentMinutes = Math.round(progress.totalTimeSpent / 60)

  const stats = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: t('progress.completed'),
      value: `${progress.completedDemos.length}/${allDemoIds.length}`,
      color: '#22c55e',
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: t('progress.streak'),
      value: `${progress.streakDays} ${t('progress.days')}`,
      color: '#f59e0b',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: t('progress.timeSpent'),
      value: `${timeSpentMinutes} ${t('progress.minutes')}`,
      color: '#6366f1',
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: t('progress.bookmarks'),
      value: progress.bookmarkedDemos.length.toString(),
      color: '#ec4899',
    },
  ]

  return (
    <div className={`rounded-2xl p-6 mb-8 ${
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('progress.title')}
        </h3>
        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
          {overallProgress}%
        </div>
      </div>

      {/* 进度条 */}
      <div className={`h-2 rounded-full mb-6 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.label}
              </span>
            </div>
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
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
  const { progress } = useCourseProgress()

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

        {/* Progress Stats - 学习进度统计 */}
        <ProgressStats theme={theme} />

        {/* Course units - 课程大纲 (positioned above exploration map) */}
        <div className="mb-6">
          <h2 className={`text-lg font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('course.curriculum')}
          </h2>

          <div className="space-y-3">
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

        {/* World Map + Inquiry Exploration - 探索地图和探索问题（压缩高度） */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* World Map - 游戏化学习地图（压缩版本） */}
          <WorldMap
            theme={theme}
            completedDemos={progress.completedDemos}
            variant="compact"
          />

          {/* Inquiry-based Exploration - Problem-driven learning（压缩版本） */}
          <div className="lg:col-span-1">
            <InquiryExplorationSection theme={theme} />
          </div>
        </div>

        {/* Insight Collection - 光学道具收集与成就系统（压缩版本） */}
        <InsightCollectionSection theme={theme} completedDemos={progress.completedDemos} />

        {/* Home Experiments - Family-friendly experiments */}
        <HomeExperimentsSection theme={theme} />

        {/* Applications */}
        <ApplicationsSection theme={theme} />

        {/* Resources section - temporarily hidden until substantive content is added */}
        {/* <ResourcesSection theme={theme} /> */}

        {/* Footer CTA */}
        <div className={`mt-12 p-8 rounded-2xl text-center ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-violet-900/30'
            : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50'
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
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Gamepad2 className="w-5 h-5" />
              {t('course.cta.playGames')}
            </Link>
            <Link
              to="/research"
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

export default CoursePage
