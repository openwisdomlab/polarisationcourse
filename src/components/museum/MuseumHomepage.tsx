/**
 * Museum Homepage - 偏振演示馆首页
 *
 * An immersive entrance experience for the Polarization Demo Gallery
 * Designed as a virtual science museum with:
 * - Panoramic hero with animated light effects
 * - 6 Exhibition halls representing each unit
 * - Interactive light beam navigation
 * - Physics-based polarization visual effects
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Waves,
  Layers,
  Target,
  Play,
  ChevronRight,
  ChevronLeft,
  Eye,
  Lightbulb,
  FlaskConical,
  Microscope,
  Atom,
  Compass,
  BookOpen,
  Trophy,
  Glasses,
  Monitor,
  Heart,
  Ship,
  Clapperboard,
  Wrench,
  Github,
  MessageCircle,
  FileText,
  Zap,
  ExternalLink
} from 'lucide-react'
import { PrinciplesVisualization } from './PrinciplesVisualization'

// Exhibition hall configuration for each unit
interface ExhibitionHall {
  id: string
  unit: number
  titleKey: string
  subtitleKey: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  glowColor: string
  bgGradient: string
  demos: string[]
  featured: string // Featured demo ID
}

const EXHIBITION_HALLS: ExhibitionHall[] = [
  {
    id: 'optical-basics',
    unit: 0,
    titleKey: 'museum.halls.basics.title',
    subtitleKey: 'museum.halls.basics.subtitle',
    icon: Lightbulb,
    color: '#fbbf24', // Amber
    glowColor: 'rgba(251, 191, 36, 0.4)',
    bgGradient: 'from-amber-500/20 via-amber-400/10 to-transparent',
    demos: ['em-wave', 'polarization-intro', 'polarization-types-unified', 'optical-bench'],
    featured: 'em-wave'
  },
  {
    id: 'polarization-fundamentals',
    unit: 1,
    titleKey: 'museum.halls.fundamentals.title',
    subtitleKey: 'museum.halls.fundamentals.subtitle',
    icon: Waves,
    color: '#22d3ee', // Cyan
    glowColor: 'rgba(34, 211, 238, 0.4)',
    bgGradient: 'from-cyan-500/20 via-cyan-400/10 to-transparent',
    demos: ['polarization-state', 'malus', 'birefringence', 'waveplate'],
    featured: 'malus'
  },
  {
    id: 'interface-reflection',
    unit: 2,
    titleKey: 'museum.halls.reflection.title',
    subtitleKey: 'museum.halls.reflection.subtitle',
    icon: Layers,
    color: '#a78bfa', // Violet
    glowColor: 'rgba(167, 139, 250, 0.4)',
    bgGradient: 'from-violet-500/20 via-violet-400/10 to-transparent',
    demos: ['fresnel', 'brewster'],
    featured: 'brewster'
  },
  {
    id: 'transparent-media',
    unit: 3,
    titleKey: 'museum.halls.media.title',
    subtitleKey: 'museum.halls.media.subtitle',
    icon: FlaskConical,
    color: '#34d399', // Emerald
    glowColor: 'rgba(52, 211, 153, 0.4)',
    bgGradient: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
    demos: ['anisotropy', 'chromatic', 'optical-rotation'],
    featured: 'chromatic'
  },
  {
    id: 'scattering',
    unit: 4,
    titleKey: 'museum.halls.scattering.title',
    subtitleKey: 'museum.halls.scattering.subtitle',
    icon: Atom,
    color: '#f472b6', // Pink
    glowColor: 'rgba(244, 114, 182, 0.4)',
    bgGradient: 'from-pink-500/20 via-pink-400/10 to-transparent',
    demos: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering'],
    featured: 'rayleigh'
  },
  {
    id: 'polarimetry',
    unit: 5,
    titleKey: 'museum.halls.polarimetry.title',
    subtitleKey: 'museum.halls.polarimetry.subtitle',
    icon: Microscope,
    color: '#60a5fa', // Blue
    glowColor: 'rgba(96, 165, 250, 0.4)',
    bgGradient: 'from-blue-500/20 via-blue-400/10 to-transparent',
    demos: ['stokes', 'mueller', 'jones', 'polarimetric-microscopy'],
    featured: 'stokes'
  }
]

// Polarization angle colors
const POLARIZATION_COLORS = ['#ff4444', '#ffaa00', '#44ff44', '#4488ff']

// Animated Light Beam component for the panoramic background
function AnimatedLightBeams() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central light source */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`,
          filter: 'blur(20px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Rotating polarization beams */}
      {[0, 45, 90, 135].map((angle, i) => (
        <div
          key={angle}
          className="absolute top-1/4 left-1/2 w-1 origin-top"
          style={{
            height: '60vh',
            background: `linear-gradient(to bottom, ${POLARIZATION_COLORS[i]}80, transparent)`,
            transform: `translateX(-50%) rotate(${angle + time * 0.5}deg)`,
            opacity: 0.3 + 0.2 * Math.sin((time + angle) * Math.PI / 180),
            filter: 'blur(2px)'
          }}
        />
      ))}

      {/* Interference pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="interference" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#interference)" className="text-cyan-400" />
      </svg>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: POLARIZATION_COLORS[i % 4],
            opacity: 0.3 + 0.3 * Math.sin(time * 0.1 + i),
            filter: 'blur(1px)',
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  )
}

// Panoramic Hero Section
function PanoramicHero({ onExplore }: { onExplore: () => void }) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0",
        theme === 'dark'
          ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-b from-slate-100 via-white to-slate-50"
      )} />

      {/* Animated light effects */}
      <AnimatedLightBeams />

      {/* Museum entrance arch visualization */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 800 400" className="w-full max-w-4xl h-auto opacity-30">
          {/* Arch structure */}
          <defs>
            <linearGradient id="archGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="columnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Left column */}
          <rect x="100" y="100" width="40" height="280" fill="url(#columnGrad)" rx="4" />
          {/* Right column */}
          <rect x="660" y="100" width="40" height="280" fill="url(#columnGrad)" rx="4" />

          {/* Arch */}
          <path
            d="M100,100 Q400,0 700,100"
            fill="none"
            stroke="url(#archGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Decorative polarization symbols */}
          <g className="animate-spin" style={{ transformOrigin: '400px 200px', animationDuration: '20s' }}>
            <circle cx="400" cy="50" r="30" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.5" />
            <line x1="370" y1="50" x2="430" y2="50" stroke="#ff4444" strokeWidth="2" />
            <line x1="400" y1="20" x2="400" y2="80" stroke="#44ff44" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Museum badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6",
          theme === 'dark'
            ? "bg-cyan-500/10 border border-cyan-500/30"
            : "bg-cyan-500/5 border border-cyan-500/20"
        )}>
          <Eye className="w-4 h-4 text-cyan-500" />
          <span className={cn(
            "text-sm font-medium",
            theme === 'dark' ? "text-cyan-400" : "text-cyan-600"
          )}>
            {t('museum.badge', '偏振演示馆 • Polarization Demo Gallery')}
          </span>
        </div>

        {/* Main title with polarization effect */}
        <h1 className={cn(
          "text-5xl md:text-7xl font-bold mb-6 tracking-tight",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>
          <span className="relative">
            <span className="relative z-10">
              {t('museum.title', '探索光的奥秘')}
            </span>
            {/* Glow effect */}
            <span
              className="absolute inset-0 blur-2xl opacity-50"
              style={{
                background: 'linear-gradient(90deg, #ff4444, #ffaa00, #44ff44, #4488ff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {t('museum.title', '探索光的奥秘')}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className={cn(
          "text-xl md:text-2xl mb-8 max-w-2xl mx-auto",
          theme === 'dark' ? "text-slate-300" : "text-slate-600"
        )}>
          {t('museum.subtitle', '从马吕斯定律到偏振成像，穿越 6 个展厅，体验 17 个交互式演示')}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-10">
          {[
            { value: '6', label: t('museum.stats.halls', '展厅') },
            { value: '17+', label: t('museum.stats.demos', '演示') },
            { value: '3', label: t('museum.stats.levels', '难度等级') }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={cn(
                "text-3xl font-bold",
                theme === 'dark' ? "text-cyan-400" : "text-cyan-600"
              )}>
                {stat.value}
              </div>
              <div className={cn(
                "text-sm",
                theme === 'dark' ? "text-slate-400" : "text-slate-500"
              )}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onExplore}
          className={cn(
            "group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg",
            "transition-all duration-300 transform hover:scale-105",
            theme === 'dark'
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
          )}
        >
          <Play className="w-5 h-5" />
          {t('museum.cta', '开始探索')}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className={cn(
          "w-6 h-10 rounded-full border-2 flex items-start justify-center p-2",
          theme === 'dark' ? "border-slate-500" : "border-slate-400"
        )}>
          <div className={cn(
            "w-1.5 h-2 rounded-full animate-pulse",
            theme === 'dark' ? "bg-cyan-400" : "bg-cyan-500"
          )} />
        </div>
      </div>
    </div>
  )
}

// Exhibition Hall Card
function ExhibitionHallCard({
  hall,
  index,
  isHovered,
  onHover,
  onClick
}: {
  hall: ExhibitionHall
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const Icon = hall.icon

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        "transition-all duration-500 transform",
        isHovered ? "scale-105 z-10" : "scale-100",
        theme === 'dark' ? "bg-slate-800/80" : "bg-white/90"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        boxShadow: isHovered
          ? `0 25px 50px -12px ${hall.glowColor}, 0 0 0 1px ${hall.color}40`
          : 'none'
      }}
      onMouseEnter={() => onHover(hall.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          `bg-gradient-to-br ${hall.bgGradient}`
        )}
      />

      {/* Polarization effect overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: `repeating-linear-gradient(
            ${45 + index * 30}deg,
            transparent,
            transparent 10px,
            ${hall.color}10 10px,
            ${hall.color}10 20px
          )`
        }}
      />

      {/* Content */}
      <div className="relative p-6 h-full flex flex-col">
        {/* Unit badge */}
        <div
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mb-4 self-start"
          style={{
            backgroundColor: `${hall.color}20`,
            color: hall.color
          }}
        >
          <span>Unit {hall.unit}</span>
        </div>

        {/* Icon */}
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
            "transition-all duration-300 group-hover:scale-110"
          )}
          style={{
            backgroundColor: `${hall.color}15`,
            boxShadow: isHovered ? `0 0 30px ${hall.glowColor}` : 'none'
          }}
        >
          <Icon
            className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12"
            style={{ color: hall.color }}
          />
        </div>

        {/* Title */}
        <h3 className={cn(
          "text-xl font-bold mb-2",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>
          {t(hall.titleKey)}
        </h3>

        {/* Subtitle */}
        <p className={cn(
          "text-sm mb-4 flex-1",
          theme === 'dark' ? "text-slate-400" : "text-slate-600"
        )}>
          {t(hall.subtitleKey)}
        </p>

        {/* Demo count */}
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-sm",
            theme === 'dark' ? "text-slate-500" : "text-slate-400"
          )}>
            {hall.demos.length} {t('museum.demos', '个演示')}
          </span>

          {/* Arrow */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "transition-all duration-300",
              isHovered ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
            )}
            style={{ backgroundColor: `${hall.color}20` }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: hall.color }} />
          </div>
        </div>
      </div>

      {/* Light beam effect on hover */}
      {isHovered && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${hall.color}, transparent)`,
            filter: 'blur(4px)',
            opacity: 0.5
          }}
        />
      )}
    </div>
  )
}

// Exhibition Halls Grid
function ExhibitionHalls({ onSelectHall }: { onSelectHall: (hallId: string) => void }) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [hoveredHall, setHoveredHall] = useState<string | null>(null)

  return (
    <section className={cn(
      "py-20 px-6",
      theme === 'dark' ? "bg-slate-900" : "bg-slate-50"
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.halls.title', '展厅导览')}
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t('museum.halls.description', '从基础到前沿，循序渐进探索偏振光学的奇妙世界')}
          </p>
        </div>

        {/* Halls grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXHIBITION_HALLS.map((hall, index) => (
            <ExhibitionHallCard
              key={hall.id}
              hall={hall}
              index={index}
              isHovered={hoveredHall === hall.id}
              onHover={setHoveredHall}
              onClick={() => onSelectHall(hall.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Featured Demos Section
function FeaturedDemos({ onSelectDemo }: { onSelectDemo: (demoId: string) => void }) {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const featuredDemos = [
    {
      id: 'malus',
      titleKey: 'demos.malus.title',
      descriptionKey: 'museum.featured.malus.description',
      icon: Target,
      color: '#22d3ee'
    },
    {
      id: 'birefringence',
      titleKey: 'demos.birefringence.title',
      descriptionKey: 'museum.featured.birefringence.description',
      icon: Layers,
      color: '#a78bfa'
    },
    {
      id: 'rayleigh',
      titleKey: 'demos.rayleigh.title',
      descriptionKey: 'museum.featured.rayleigh.description',
      icon: Sparkles,
      color: '#f472b6'
    }
  ]

  return (
    <section className={cn(
      "py-20 px-6",
      theme === 'dark'
        ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-b from-white via-slate-50 to-white"
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
            theme === 'dark'
              ? "bg-amber-500/10 border border-amber-500/30"
              : "bg-amber-500/5 border border-amber-500/20"
          )}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-amber-400" : "text-amber-600"
            )}>
              {t('museum.featured.badge', '精选推荐')}
            </span>
          </div>

          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.featured.title', '不可错过的演示')}
          </h2>
        </div>

        {/* Featured grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDemos.map((demo, index) => {
            const Icon = demo.icon
            return (
              <div
                key={demo.id}
                className={cn(
                  "group relative p-8 rounded-2xl cursor-pointer",
                  "transition-all duration-300 transform hover:scale-[1.02]",
                  theme === 'dark'
                    ? "bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50"
                    : "bg-white hover:bg-white border border-slate-200"
                )}
                style={{
                  boxShadow: `0 0 0 0 ${demo.color}00`,
                }}
                onClick={() => onSelectDemo(demo.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px -10px ${demo.color}30`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${demo.color}00`
                }}
              >
                {/* Number badge */}
                <div
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: demo.color,
                    color: 'white'
                  }}
                >
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${demo.color}15` }}
                >
                  <Icon className="w-8 h-8" style={{ color: demo.color }} />
                </div>

                {/* Title */}
                <h3 className={cn(
                  "text-xl font-bold mb-3",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>
                  {t(demo.titleKey)}
                </h3>

                {/* Description */}
                <p className={cn(
                  "text-sm mb-6",
                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                )}>
                  {t(demo.descriptionKey)}
                </p>

                {/* CTA */}
                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: demo.color }}
                >
                  {t('museum.featured.explore', '立即体验')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Learning Path Section
function LearningPath() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const levels = [
    {
      level: 'foundation',
      icon: '🌱',
      titleKey: 'museum.levels.foundation.title',
      descriptionKey: 'museum.levels.foundation.description',
      color: '#22c55e'
    },
    {
      level: 'application',
      icon: '🔬',
      titleKey: 'museum.levels.application.title',
      descriptionKey: 'museum.levels.application.description',
      color: '#3b82f6'
    },
    {
      level: 'research',
      icon: '🚀',
      titleKey: 'museum.levels.research.title',
      descriptionKey: 'museum.levels.research.description',
      color: '#a855f7'
    }
  ]

  return (
    <section className={cn(
      "py-20 px-6 relative overflow-hidden",
      theme === 'dark' ? "bg-slate-900" : "bg-white"
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.levels.title', '选择你的学习路径')}
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t('museum.levels.description', '每个演示都有三种难度级别，适合不同背景的学习者')}
          </p>
        </div>

        {/* Levels */}
        <div className="relative">
          {/* Connection line */}
          <div className={cn(
            "absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 hidden md:block",
            theme === 'dark' ? "bg-slate-700" : "bg-slate-200"
          )} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level, index) => (
              <div
                key={level.level}
                className={cn(
                  "relative p-6 rounded-2xl text-center",
                  theme === 'dark' ? "bg-slate-800" : "bg-slate-50"
                )}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{
                    backgroundColor: `${level.color}20`,
                    boxShadow: `0 0 30px ${level.color}30`
                  }}
                >
                  {level.icon}
                </div>

                {/* Step number */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: level.color }}
                >
                  {index + 1}
                </div>

                {/* Title */}
                <h3 className={cn(
                  "text-lg font-bold mb-2",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>
                  {t(level.titleKey)}
                </h3>

                {/* Description */}
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                )}>
                  {t(level.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Quick Start Section
function QuickStartSection() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const startModes = [
    {
      id: 'explore',
      icon: Compass,
      titleKey: 'museum.quickStart.explore.title',
      descriptionKey: 'museum.quickStart.explore.description',
      color: '#22d3ee',
      action: () => navigate('/demos')
    },
    {
      id: 'guided',
      icon: BookOpen,
      titleKey: 'museum.quickStart.guided.title',
      descriptionKey: 'museum.quickStart.guided.description',
      color: '#a78bfa',
      action: () => navigate('/demos?unit=0')
    },
    {
      id: 'challenge',
      icon: Trophy,
      titleKey: 'museum.quickStart.challenge.title',
      descriptionKey: 'museum.quickStart.challenge.description',
      color: '#f59e0b',
      action: () => navigate('/games/2d')
    }
  ]

  return (
    <section className={cn(
      "py-16 px-6",
      theme === 'dark' ? "bg-slate-800/50" : "bg-slate-100/50"
    )}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-3",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.quickStart.title')}
          </h2>
          <p className={cn(
            "text-base",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t('museum.quickStart.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {startModes.map((mode, index) => {
            const Icon = mode.icon
            return (
              <button
                key={mode.id}
                onClick={mode.action}
                className={cn(
                  "group relative p-6 rounded-xl text-left transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-lg",
                  theme === 'dark'
                    ? "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                    : "bg-white hover:bg-white border border-slate-200"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${mode.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: mode.color }} />
                </div>

                {/* Title */}
                <h3 className={cn(
                  "text-lg font-semibold mb-2",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>
                  {t(mode.titleKey)}
                </h3>

                {/* Description */}
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                )}>
                  {t(mode.descriptionKey)}
                </p>

                {/* Arrow indicator */}
                <div className={cn(
                  "absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                )}>
                  <ChevronRight className="w-5 h-5" style={{ color: mode.color }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Why Polarization Matters Section
function ApplicationsSection() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const applications = [
    { id: 'sunglasses', icon: Glasses, color: '#22d3ee' },
    { id: 'lcd', icon: Monitor, color: '#a78bfa' },
    { id: 'medical', icon: Heart, color: '#f43f5e' },
    { id: 'ocean', icon: Ship, color: '#3b82f6' },
    { id: '3d', icon: Clapperboard, color: '#f59e0b' },
    { id: 'stress', icon: Wrench, color: '#10b981' }
  ]

  return (
    <section className={cn(
      "py-16 px-6",
      theme === 'dark' ? "bg-slate-900" : "bg-white"
    )}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-3",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.applications.title')}
          </h2>
          <p className={cn(
            "text-base max-w-xl mx-auto",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t('museum.applications.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {applications.map((app) => {
            const Icon = app.icon
            return (
              <div
                key={app.id}
                className={cn(
                  "group p-4 rounded-xl text-center transition-all duration-300 cursor-pointer",
                  "hover:scale-105",
                  theme === 'dark'
                    ? "bg-slate-800/50 hover:bg-slate-800"
                    : "bg-slate-50 hover:bg-slate-100"
                )}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${app.color}15`,
                    boxShadow: `0 0 20px ${app.color}20`
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: app.color }} />
                </div>
                <h4 className={cn(
                  "text-sm font-medium mb-1",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>
                  {t(`museum.applications.items.${app.id}.title`)}
                </h4>
                <p className={cn(
                  "text-xs",
                  theme === 'dark' ? "text-slate-500" : "text-slate-500"
                )}>
                  {t(`museum.applications.items.${app.id}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Fun Facts Carousel
function FactsCarousel() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const facts = [
    { id: 'bees', emoji: '🐝' },
    { id: 'vikings', emoji: '⛵' },
    { id: 'mantis', emoji: '🦐' },
    { id: 'cuttlefish', emoji: '🦑' },
    { id: 'lcd', emoji: '📱' },
    { id: 'rainbows', emoji: '🌈' }
  ]

  const nextFact = useCallback(() => {
    setCurrentFactIndex((prev) => (prev + 1) % facts.length)
  }, [facts.length])

  const prevFact = useCallback(() => {
    setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length)
  }, [facts.length])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextFact, 6000)
    return () => clearInterval(interval)
  }, [nextFact])

  const currentFact = facts[currentFactIndex]

  return (
    <section className={cn(
      "py-16 px-6 relative overflow-hidden",
      theme === 'dark'
        ? "bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20"
        : "bg-gradient-to-r from-cyan-50 via-purple-50 to-pink-50"
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <pattern id="facts-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="2" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#facts-pattern)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4",
            theme === 'dark'
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
          )}>
            <Zap className="w-4 h-4" />
            {t('museum.facts.title')}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center min-h-[140px]">
          {/* Previous button */}
          <button
            onClick={prevFact}
            className={cn(
              "absolute left-0 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              theme === 'dark'
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-white hover:bg-slate-50 text-slate-900 shadow-lg"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Fact card */}
          <div className={cn(
            "max-w-2xl mx-12 p-6 rounded-2xl text-center",
            theme === 'dark' ? "bg-slate-800/80" : "bg-white/80"
          )}>
            <div className="text-4xl mb-4">{currentFact.emoji}</div>
            <p className={cn(
              "text-lg",
              theme === 'dark' ? "text-slate-200" : "text-slate-700"
            )}>
              {t(`museum.facts.items.${currentFact.id}`)}
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={nextFact}
            className={cn(
              "absolute right-0 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              theme === 'dark'
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-white hover:bg-slate-50 text-slate-900 shadow-lg"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {facts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFactIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentFactIndex
                  ? theme === 'dark' ? "bg-cyan-400 w-6" : "bg-cyan-500 w-6"
                  : theme === 'dark' ? "bg-slate-600" : "bg-slate-300"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer Section
function MuseumFooter() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()

  return (
    <footer className={cn(
      "py-12 px-6 border-t",
      theme === 'dark'
        ? "bg-slate-900 border-slate-800"
        : "bg-slate-50 border-slate-200"
    )}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className={cn(
                "font-bold text-lg",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>
                PolarCraft
              </span>
            </div>
            <p className={cn(
              "text-sm mb-4",
              theme === 'dark' ? "text-slate-400" : "text-slate-600"
            )}>
              {t('museum.footer.tagline')}
            </p>
            {/* Polarization visual */}
            <div className="flex gap-1">
              {POLARIZATION_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color, opacity: 0.8 }}
                />
              ))}
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h4 className={cn(
              "font-semibold mb-4",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              {t('museum.footer.explore')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/demos')}
                  className={cn(
                    "text-sm hover:underline",
                    theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t('museum.footer.demoGallery')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/optical-studio')}
                  className={cn(
                    "text-sm hover:underline",
                    theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t('museum.footer.opticalStudio')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/games/2d')}
                  className={cn(
                    "text-sm hover:underline",
                    theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t('museum.footer.puzzleGame')}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={cn(
              "font-semibold mb-4",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              {t('museum.footer.resources')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/course"
                  className={cn(
                    "text-sm hover:underline flex items-center gap-1",
                    theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <FileText className="w-3 h-3" />
                  {t('museum.footer.documentation')}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/openwisdomlab/polarisation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm hover:underline flex items-center gap-1",
                    theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Github className="w-3 h-3" />
                  {t('museum.footer.github')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className={cn(
              "font-semibold mb-4",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              {t('museum.footer.community')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/chronicles')}
                  className={cn(
                    "text-sm hover:underline flex items-center gap-1",
                    theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <MessageCircle className="w-3 h-3" />
                  {t('museum.footer.forum')}
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/openwisdomlab/polarisation/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm hover:underline flex items-center gap-1",
                    theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t('museum.footer.contribute')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={cn(
          "pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4",
          theme === 'dark' ? "border-slate-800" : "border-slate-200"
        )}>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? "text-slate-500" : "text-slate-500"
          )}>
            © 2024 {t('museum.footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
            <span className={cn(
              "text-xs",
              theme === 'dark' ? "text-slate-600" : "text-slate-400"
            )}>
              Made with physics and love
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Museum Homepage Component
export function MuseumHomepage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()

  // Handle scroll to exhibition halls when returning from a demo
  useEffect(() => {
    const state = location.state as { scrollToHalls?: boolean; fromUnit?: number } | null
    if (state?.scrollToHalls) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        document.getElementById('exhibition-halls')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      // Clear the state to prevent re-scrolling on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleExplore = useCallback(() => {
    // Smooth scroll to halls section
    setTimeout(() => {
      document.getElementById('exhibition-halls')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  const handleSelectHall = useCallback((hallId: string) => {
    const hall = EXHIBITION_HALLS.find(h => h.id === hallId)
    if (hall) {
      navigate(`/demos?unit=${hall.unit}`)
    }
  }, [navigate])

  const handleSelectDemo = useCallback((demoId: string) => {
    navigate(`/demos/${demoId}`)
  }, [navigate])

  return (
    <div className={cn(
      "min-h-screen",
      theme === 'dark' ? "bg-slate-900" : "bg-white"
    )}>
      {/* Panoramic Hero */}
      <PanoramicHero onExplore={handleExplore} />

      {/* Quick Start Guide */}
      <QuickStartSection />

      {/* Four Fundamental Principles of Polarization */}
      <PrinciplesVisualization />

      {/* Exhibition Halls */}
      <div id="exhibition-halls">
        <ExhibitionHalls onSelectHall={handleSelectHall} />
      </div>

      {/* Featured Demos */}
      <FeaturedDemos onSelectDemo={handleSelectDemo} />

      {/* Why Polarization Matters */}
      <ApplicationsSection />

      {/* Fun Facts Carousel */}
      <FactsCarousel />

      {/* Learning Path */}
      <LearningPath />

      {/* Footer */}
      <MuseumFooter />
    </div>
  )
}

export default MuseumHomepage
