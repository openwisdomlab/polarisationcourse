/**
 * Gallery Hero - 演示馆顶部偏振光可视化组件
 *
 * A compact hero section for the polarization demo gallery,
 * designed to work with the left sidebar navigation.
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  Lightbulb,
  Waves,
  Layers,
  FlaskConical,
  Atom,
  Microscope,
  Play
} from 'lucide-react'
import { PolarizationLawsSection } from './PolarizationLawsSection'

// Polarization angle colors
const POLARIZATION_COLORS = ['#ff4444', '#ffaa00', '#44ff44', '#4488ff']

// Exhibition hall configuration for each unit (exported for reuse)
export interface ExhibitionHall {
  id: string
  unit: number
  titleKey: string
  subtitleKey: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  glowColor: string
  bgGradient: string
  demos: string[]
}

export const EXHIBITION_HALLS: ExhibitionHall[] = [
  {
    id: 'optical-basics',
    unit: 0,
    titleKey: 'museum.halls.basics.title',
    subtitleKey: 'museum.halls.basics.subtitle',
    icon: Lightbulb,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    bgGradient: 'from-amber-500/20 via-amber-400/10 to-transparent',
    demos: ['em-wave', 'polarization-intro', 'polarization-types-unified', 'optical-bench']
  },
  {
    id: 'polarization-fundamentals',
    unit: 1,
    titleKey: 'museum.halls.fundamentals.title',
    subtitleKey: 'museum.halls.fundamentals.subtitle',
    icon: Waves,
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    bgGradient: 'from-cyan-500/20 via-cyan-400/10 to-transparent',
    demos: ['polarization-state', 'malus', 'birefringence', 'waveplate']
  },
  {
    id: 'interface-reflection',
    unit: 2,
    titleKey: 'museum.halls.reflection.title',
    subtitleKey: 'museum.halls.reflection.subtitle',
    icon: Layers,
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    bgGradient: 'from-violet-500/20 via-violet-400/10 to-transparent',
    demos: ['fresnel', 'brewster']
  },
  {
    id: 'transparent-media',
    unit: 3,
    titleKey: 'museum.halls.media.title',
    subtitleKey: 'museum.halls.media.subtitle',
    icon: FlaskConical,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    bgGradient: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
    demos: ['anisotropy', 'chromatic', 'optical-rotation']
  },
  {
    id: 'scattering',
    unit: 4,
    titleKey: 'museum.halls.scattering.title',
    subtitleKey: 'museum.halls.scattering.subtitle',
    icon: Atom,
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    bgGradient: 'from-pink-500/20 via-pink-400/10 to-transparent',
    demos: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering']
  },
  {
    id: 'polarimetry',
    unit: 5,
    titleKey: 'museum.halls.polarimetry.title',
    subtitleKey: 'museum.halls.polarimetry.subtitle',
    icon: Microscope,
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    bgGradient: 'from-blue-500/20 via-blue-400/10 to-transparent',
    demos: ['stokes', 'mueller', 'jones', 'polarimetric-microscopy']
  }
]

// Animated Light Beams component - compact version
function AnimatedPolarizationVisual() {
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)`,
          filter: 'blur(15px)'
        }}
      />

      {/* Rotating polarization beams - smaller and centered */}
      {[0, 45, 90, 135].map((angle, i) => (
        <div
          key={angle}
          className="absolute top-1/2 left-1/2 w-0.5 origin-center"
          style={{
            height: '100%',
            background: `linear-gradient(to bottom, transparent 20%, ${POLARIZATION_COLORS[i]}60 50%, transparent 80%)`,
            transform: `translate(-50%, -50%) rotate(${angle + time * 0.3}deg)`,
            opacity: 0.4 + 0.2 * Math.sin((time + angle) * Math.PI / 180),
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 3,
            height: 3 + Math.random() * 3,
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            background: POLARIZATION_COLORS[i % 4],
            opacity: 0.2 + 0.3 * Math.sin(time * 0.1 + i),
            filter: 'blur(1px)',
            animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 3}s`
          }}
        />
      ))}

      {/* Interference pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <defs>
          <pattern id="gallery-interference" width="15" height="15" patternUnits="userSpaceOnUse">
            <circle cx="7.5" cy="7.5" r="6" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gallery-interference)" className="text-cyan-400" />
      </svg>
    </div>
  )
}

// Exhibition Hall Card - compact version (exported for reuse)
export function ExhibitionHallCard({
  hall,
  isHovered,
  onHover,
  onClick
}: {
  hall: ExhibitionHall
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
        "group relative rounded-xl overflow-hidden cursor-pointer",
        "transition-all duration-300 transform",
        isHovered ? "scale-[1.02] z-10" : "scale-100",
        theme === 'dark' ? "bg-slate-800/80" : "bg-white/90"
      )}
      style={{
        boxShadow: isHovered
          ? `0 15px 30px -8px ${hall.glowColor}, 0 0 0 1px ${hall.color}30`
          : 'none'
      }}
      onMouseEnter={() => onHover(hall.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          `bg-gradient-to-br ${hall.bgGradient}`
        )}
      />

      {/* Content */}
      <div className="relative p-4 h-full flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            "transition-all duration-300 group-hover:scale-110"
          )}
          style={{
            backgroundColor: `${hall.color}15`,
            boxShadow: isHovered ? `0 0 20px ${hall.glowColor}` : 'none'
          }}
        >
          <Icon
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6"
            style={{ color: hall.color }}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Unit badge */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${hall.color}20`,
                color: hall.color
              }}
            >
              Unit {hall.unit}
            </span>
            <span className={cn(
              "text-[10px]",
              theme === 'dark' ? "text-slate-500" : "text-slate-400"
            )}>
              {hall.demos.length} demos
            </span>
          </div>

          {/* Title */}
          <h3 className={cn(
            "text-sm font-semibold mb-0.5 truncate",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t(hall.titleKey)}
          </h3>

          {/* Subtitle */}
          <p className={cn(
            "text-xs line-clamp-2",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t(hall.subtitleKey)}
          </p>
        </div>

        {/* Arrow */}
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
            "transition-all duration-300",
            isHovered ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          )}
          style={{ backgroundColor: `${hall.color}20` }}
        >
          <ChevronRight className="w-3 h-3" style={{ color: hall.color }} />
        </div>
      </div>
    </div>
  )
}

// Main Gallery Hero Component
interface GalleryHeroProps {
  onSelectDemo: (demoId: string) => void
  onSelectUnit: (unit: number) => void
  isCompact?: boolean
}

export function GalleryHero({ onSelectDemo, onSelectUnit, isCompact = false }: GalleryHeroProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [hoveredHall, setHoveredHall] = useState<string | null>(null)

  const handleSelectHall = (hallId: string) => {
    const hall = EXHIBITION_HALLS.find(h => h.id === hallId)
    if (hall) {
      onSelectUnit(hall.unit)
      // Navigate to the first demo of this unit
      if (hall.demos.length > 0) {
        onSelectDemo(hall.demos[0])
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Polarization Visualization */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          isCompact ? "h-40" : "h-48",
          theme === 'dark'
            ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
            : "bg-gradient-to-br from-slate-100 via-white to-slate-50"
        )}
      >
        {/* Animated background */}
        <AnimatedPolarizationVisual />

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Badge */}
          <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-medium",
            theme === 'dark'
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              : "bg-cyan-500/10 text-cyan-600 border border-cyan-500/30"
          )}>
            <div className="flex gap-0.5">
              {POLARIZATION_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color, opacity: 0.8 }}
                />
              ))}
            </div>
            <span>{t('museum.badge', '偏振演示馆')}</span>
          </div>

          {/* Title */}
          <h1 className={cn(
            "text-2xl md:text-3xl font-bold mb-2",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.title', '探索光的奥秘')}
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            {[
              { value: '6', label: t('museum.stats.halls', '展厅') },
              { value: '17+', label: t('museum.stats.demos', '演示') },
              { value: '3', label: t('museum.stats.levels', '难度') }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={cn(
                  "font-bold",
                  theme === 'dark' ? "text-cyan-400" : "text-cyan-600"
                )}>
                  {stat.value}
                </span>
                <span className={cn(
                  theme === 'dark' ? "text-slate-400" : "text-slate-500"
                )}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exhibition Halls Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn(
            "text-lg font-semibold",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.halls.title', '展厅导览')}
          </h2>
          <span className={cn(
            "text-xs",
            theme === 'dark' ? "text-slate-500" : "text-slate-400"
          )}>
            {t('museum.halls.selectHint', '选择展厅开始探索')}
          </span>
        </div>

        {/* Halls Grid */}
        <div className={cn(
          "grid gap-3",
          isCompact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {EXHIBITION_HALLS.map((hall) => (
            <ExhibitionHallCard
              key={hall.id}
              hall={hall}
              isHovered={hoveredHall === hall.id}
              onHover={setHoveredHall}
              onClick={() => handleSelectHall(hall.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Start CTA */}
      <div className={cn(
        "rounded-xl p-4 flex items-center justify-between",
        theme === 'dark'
          ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
          : "bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200"
      )}>
        <div>
          <h3 className={cn(
            "font-medium mb-1",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.quickStart.title', '快速开始')}
          </h3>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t('museum.quickStart.description', '从电磁波基础开始你的偏振之旅')}
          </p>
        </div>
        <button
          onClick={() => onSelectDemo('em-wave')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm",
            "transition-all duration-200 hover:scale-105",
            "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
            "shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
          )}
        >
          <Play className="w-4 h-4" />
          {t('museum.cta', '开始探索')}
        </button>
      </div>

      {/* Four Laws of Polarization - 偏振四大定律可视化 */}
      <PolarizationLawsSection onSelectDemo={onSelectDemo} />
    </div>
  )
}

export default GalleryHero
