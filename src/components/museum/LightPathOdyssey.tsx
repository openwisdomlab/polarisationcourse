/**
 * LightPathOdyssey - 光路奥德赛
 *
 * A creative, artistic visualization of the polarization learning journey.
 * Instead of a network graph, this uses flowing light beams, prisms, and
 * optical elements to create an immersive visual experience.
 *
 * Features:
 * - Flowing light beams with polarization color effects
 * - Interactive "light stations" representing learning topics
 * - Animated light particles traveling along paths
 * - Prism-like visual elements for topic clusters
 * - Three suggested learning paths visualized as different light frequencies
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  Waves,
  Layers,
  FlaskConical,
  Atom,
  Microscope,
  Sparkles,
  ChevronRight,
  Play,
  Compass,
  Route,
  Zap
} from 'lucide-react'

// Polarization colors
const POLAR_COLORS = {
  red: '#ff4444',
  orange: '#ffaa00',
  green: '#44ff44',
  blue: '#4488ff',
  cyan: '#22d3ee',
  violet: '#a78bfa',
  pink: '#f472b6',
  emerald: '#34d399'
}

// Unit configuration with visual styling
const UNITS = [
  { id: 0, name: '光学基础', nameEn: 'Optical Basics', color: '#fbbf24', icon: Lightbulb, position: { x: 8, y: 40 } },
  { id: 1, name: '偏振基础', nameEn: 'Polarization Fundamentals', color: '#22d3ee', icon: Waves, position: { x: 28, y: 30 } },
  { id: 2, name: '界面反射', nameEn: 'Interface Reflection', color: '#a78bfa', icon: Layers, position: { x: 48, y: 50 } },
  { id: 3, name: '透明介质', nameEn: 'Transparent Media', color: '#34d399', icon: FlaskConical, position: { x: 68, y: 35 } },
  { id: 4, name: '散射介质', nameEn: 'Scattering Media', color: '#f472b6', icon: Atom, position: { x: 78, y: 60 } },
  { id: 5, name: '偏振测量', nameEn: 'Polarimetry', color: '#60a5fa', icon: Microscope, position: { x: 92, y: 45 } }
]

// Learning topic nodes
interface TopicNode {
  id: string
  titleKey: string
  unit: number
  difficulty: 'foundation' | 'application' | 'research'
}

const TOPICS: TopicNode[] = [
  // Unit 0: Optical Basics
  { id: 'em-wave', titleKey: 'demos.emWave.title', unit: 0, difficulty: 'foundation' },
  { id: 'polarization-intro', titleKey: 'demos.polarizationIntro.title', unit: 0, difficulty: 'foundation' },
  { id: 'polarization-types-unified', titleKey: 'demos.polarizationTypes.title', unit: 0, difficulty: 'application' },
  { id: 'optical-bench', titleKey: 'demos.opticalBench.title', unit: 0, difficulty: 'application' },
  // Unit 1: Polarization Fundamentals
  { id: 'polarization-state', titleKey: 'demos.polarizationState.title', unit: 1, difficulty: 'foundation' },
  { id: 'malus', titleKey: 'demos.malus.title', unit: 1, difficulty: 'application' },
  { id: 'birefringence', titleKey: 'demos.birefringence.title', unit: 1, difficulty: 'application' },
  { id: 'waveplate', titleKey: 'demos.waveplate.title', unit: 1, difficulty: 'research' },
  // Unit 2: Interface Reflection
  { id: 'fresnel', titleKey: 'demos.fresnel.title', unit: 2, difficulty: 'research' },
  { id: 'brewster', titleKey: 'demos.brewster.title', unit: 2, difficulty: 'application' },
  // Unit 3: Transparent Media
  { id: 'anisotropy', titleKey: 'demos.anisotropy.title', unit: 3, difficulty: 'foundation' },
  { id: 'chromatic', titleKey: 'demos.chromatic.title', unit: 3, difficulty: 'application' },
  { id: 'optical-rotation', titleKey: 'demos.opticalRotation.title', unit: 3, difficulty: 'application' },
  // Unit 4: Scattering
  { id: 'rayleigh', titleKey: 'demos.rayleigh.title', unit: 4, difficulty: 'foundation' },
  { id: 'mie-scattering', titleKey: 'demos.mieScattering.title', unit: 4, difficulty: 'research' },
  { id: 'monte-carlo-scattering', titleKey: 'demos.monteCarloScattering.title', unit: 4, difficulty: 'research' },
  // Unit 5: Polarimetry
  { id: 'stokes', titleKey: 'demos.stokes.title', unit: 5, difficulty: 'research' },
  { id: 'jones', titleKey: 'demos.jones.title', unit: 5, difficulty: 'research' },
  { id: 'mueller', titleKey: 'demos.mueller.title', unit: 5, difficulty: 'research' },
  { id: 'polarimetric-microscopy', titleKey: 'demos.polarimetricMicroscopy.title', unit: 5, difficulty: 'research' }
]

// Learning paths configuration
interface LearningPath {
  id: string
  nameKey: string
  descKey: string
  color: string
  glowColor: string
  topics: string[]
  icon: typeof Compass
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'quick-start',
    nameKey: 'knowledgeMap.paths.quickStart.name',
    descKey: 'knowledgeMap.paths.quickStart.desc',
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    topics: ['em-wave', 'polarization-intro', 'malus', 'birefringence'],
    icon: Play
  },
  {
    id: 'deep-dive',
    nameKey: 'knowledgeMap.paths.deepDive.name',
    descKey: 'knowledgeMap.paths.deepDive.desc',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.5)',
    topics: ['em-wave', 'polarization-intro', 'polarization-types-unified', 'malus', 'birefringence', 'waveplate', 'stokes', 'mueller'],
    icon: Route
  },
  {
    id: 'applications',
    nameKey: 'knowledgeMap.paths.applications.name',
    descKey: 'knowledgeMap.paths.applications.desc',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    topics: ['malus', 'brewster', 'anisotropy', 'chromatic', 'rayleigh'],
    icon: Zap
  }
]

// Central prism component that "splits" learning into different paths
function CentralPrism({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <defs>
        {/* Prism gradient */}
        <linearGradient id="prism-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
          <stop offset="50%" stopColor={theme === 'dark' ? '#334155' : '#e2e8f0'} />
          <stop offset="100%" stopColor={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
        </linearGradient>
        <linearGradient id="prism-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
        </linearGradient>
        {/* Rainbow dispersion */}
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={POLAR_COLORS.red} />
          <stop offset="25%" stopColor={POLAR_COLORS.orange} />
          <stop offset="50%" stopColor={POLAR_COLORS.green} />
          <stop offset="100%" stopColor={POLAR_COLORS.blue} />
        </linearGradient>
        <filter id="prism-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Prism body */}
      <polygon
        points="60,10 110,85 10,85"
        fill="url(#prism-fill)"
        stroke="url(#prism-edge)"
        strokeWidth="2"
        filter="url(#prism-glow)"
      />

      {/* Incoming white light beam */}
      <line x1="0" y1="45" x2="45" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
      </line>

      {/* Dispersed light beams */}
      <g>
        <line x1="75" y1="40" x2="120" y2="20" stroke={POLAR_COLORS.red} strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="78" y1="48" x2="120" y2="48" stroke={POLAR_COLORS.orange} strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.3s" repeatCount="indefinite" />
        </line>
        <line x1="75" y1="55" x2="120" y2="65" stroke={POLAR_COLORS.green} strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
        </line>
        <line x1="70" y1="62" x2="120" y2="85" stroke={POLAR_COLORS.blue} strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.9s" repeatCount="indefinite" />
        </line>
      </g>
    </svg>
  )
}

// Flowing light beam SVG animation
function FlowingLightBeam({
  startX, startY, endX, endY, color, delay = 0
}: {
  startX: number; startY: number; endX: number; endY: number; color: string; delay?: number
}) {
  return (
    <g>
      {/* Base path */}
      <path
        d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${Math.min(startY, endY) - 15} ${endX} ${endY}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Animated flow */}
      <path
        d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${Math.min(startY, endY) - 15} ${endX} ${endY}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="10,20"
        opacity="0.8"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="30"
          to="0"
          dur="1.5s"
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </path>
    </g>
  )
}

// Unit prism card - represents each learning unit
function UnitPrismCard({
  unit,
  isHovered,
  isSelected,
  onHover,
  onClick,
  topicCount,
  theme
}: {
  unit: typeof UNITS[0]
  isHovered: boolean
  isSelected: boolean
  onHover: (id: number | null) => void
  onClick: () => void
  topicCount: number
  theme: 'dark' | 'light'
}) {
  const Icon = unit.icon

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-500",
        isHovered || isSelected ? "scale-110 z-20" : "scale-100",
      )}
      onMouseEnter={() => onHover(unit.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Prism shape container */}
      <div
        className={cn(
          "relative w-24 h-28 flex flex-col items-center justify-center",
          "transition-all duration-300"
        )}
      >
        {/* Hexagonal/prism background */}
        <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id={`unit-grad-${unit.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={unit.color} stopOpacity={isHovered ? 0.4 : 0.2} />
              <stop offset="100%" stopColor={unit.color} stopOpacity={isHovered ? 0.2 : 0.05} />
            </linearGradient>
            <filter id={`unit-glow-${unit.id}`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Hexagon shape */}
          <polygon
            points="50,5 95,30 95,85 50,110 5,85 5,30"
            fill={`url(#unit-grad-${unit.id})`}
            stroke={unit.color}
            strokeWidth={isHovered || isSelected ? 2 : 1}
            opacity={isHovered || isSelected ? 1 : 0.6}
            filter={isHovered ? `url(#unit-glow-${unit.id})` : 'none'}
          />

          {/* Light refraction lines inside */}
          <line x1="50" y1="5" x2="50" y2="110" stroke={unit.color} strokeWidth="0.5" opacity="0.3" />
          <line x1="5" y1="57" x2="95" y2="57" stroke={unit.color} strokeWidth="0.5" opacity="0.3" />
        </svg>

        {/* Icon */}
        <div
          className={cn(
            "relative z-10 w-10 h-10 rounded-lg flex items-center justify-center mb-1",
            "transition-all duration-300",
            isHovered ? "scale-110" : ""
          )}
          style={{
            backgroundColor: `${unit.color}30`,
            boxShadow: isHovered ? `0 0 20px ${unit.color}50` : 'none'
          }}
        >
          <Icon className="w-5 h-5" style={{ color: unit.color }} />
        </div>

        {/* Unit name */}
        <span className={cn(
          "relative z-10 text-xs font-medium text-center px-1 leading-tight",
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        )}>
          {unit.name}
        </span>

        {/* Topic count badge */}
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: unit.color }}
        >
          {topicCount}
        </span>
      </div>
    </div>
  )
}

// Learning path selector button
function PathButton({
  path,
  isSelected,
  onClick,
  theme,
  t
}: {
  path: LearningPath
  isSelected: boolean
  onClick: () => void
  theme: 'dark' | 'light'
  t: (key: string) => string
}) {
  const Icon = path.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
        "transition-all duration-300 border",
        isSelected
          ? "scale-105"
          : "opacity-70 hover:opacity-100"
      )}
      style={{
        backgroundColor: isSelected ? `${path.color}20` : 'transparent',
        borderColor: isSelected ? path.color : theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
        color: isSelected ? path.color : theme === 'dark' ? '#e2e8f0' : '#334155',
        boxShadow: isSelected ? `0 0 20px ${path.glowColor}` : 'none'
      }}
    >
      <Icon className="w-4 h-4" />
      <span>{t(path.nameKey)}</span>
    </button>
  )
}

// Topic pill that appears in selected path
function TopicPill({
  topic,
  unit,
  onClick,
  theme,
  t,
  isInPath
}: {
  topic: TopicNode
  unit: typeof UNITS[0]
  onClick: () => void
  theme: 'dark' | 'light'
  t: (key: string) => string
  isInPath: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
        "transition-all duration-300 hover:scale-105",
        isInPath ? "ring-2 ring-offset-2" : ""
      )}
      style={{
        backgroundColor: `${unit.color}20`,
        color: unit.color,
        // @ts-expect-error - CSS custom property
        '--tw-ring-color': isInPath ? unit.color : 'transparent',
        '--tw-ring-offset-color': theme === 'dark' ? '#0f172a' : '#ffffff'
      }}
    >
      <span className={cn(
        "w-2 h-2 rounded-full",
        topic.difficulty === 'foundation' ? 'bg-green-400' :
        topic.difficulty === 'application' ? 'bg-blue-400' : 'bg-purple-400'
      )} />
      {t(topic.titleKey)}
    </button>
  )
}

// Main component
export function LightPathOdyssey() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language.startsWith('zh')

  const [hoveredUnit, setHoveredUnit] = useState<number | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Get topics for each unit
  const getUnitTopics = useCallback((unitId: number) => {
    return TOPICS.filter(t => t.unit === unitId)
  }, [])

  // Get selected path data
  const selectedPathData = useMemo(() => {
    return LEARNING_PATHS.find(p => p.id === selectedPath)
  }, [selectedPath])

  // Handle navigation to demo
  const handleNavigateToDemo = useCallback((demoId: string) => {
    navigate(`/demos/${demoId}`)
  }, [navigate])

  // Handle navigation to unit
  const handleNavigateToUnit = useCallback((unitId: number) => {
    navigate(`/demos?unit=${unitId}`)
  }, [navigate])

  return (
    <section className={cn(
      "py-16 px-6 relative overflow-hidden",
      theme === 'dark' ? "bg-slate-900/50" : "bg-slate-50"
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Flowing light beams in background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Ambient flowing beams */}
          {[0, 1, 2, 3].map(i => (
            <path
              key={i}
              d={`M ${-10 + i * 5} ${30 + i * 10} Q ${25 + i * 5} ${20 + Math.sin(animationPhase * 0.02 + i) * 10} ${50} ${40 + i * 5} T ${110} ${35 + i * 8}`}
              fill="none"
              stroke={Object.values(POLAR_COLORS)[i]}
              strokeWidth="0.3"
              opacity={0.2 + Math.sin(animationPhase * 0.01 + i) * 0.1}
            />
          ))}
        </svg>

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              background: Object.values(POLAR_COLORS)[i % 4],
              opacity: 0.2 + Math.sin(animationPhase * 0.05 + i) * 0.15,
              filter: 'blur(1px)',
              transform: `translate(${Math.sin(animationPhase * 0.02 + i) * 10}px, ${Math.cos(animationPhase * 0.03 + i) * 8}px)`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
            theme === 'dark'
              ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30"
              : "bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200"
          )}>
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-cyan-400" : "text-cyan-600"
            )}>
              {isZh ? '偏振光学习之旅' : 'Polarization Learning Journey'}
            </span>
          </div>

          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {isZh ? '光路奥德赛' : 'Light Path Odyssey'}
          </h2>

          <p className={cn(
            "text-lg max-w-2xl mx-auto mb-8",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {isZh
              ? '跟随光的脚步，从基础到前沿，探索偏振光学的奇妙世界'
              : 'Follow the path of light, from fundamentals to frontiers, exploring the wonderful world of polarization optics'}
          </p>

          {/* Learning path selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {LEARNING_PATHS.map(path => (
              <PathButton
                key={path.id}
                path={path}
                isSelected={selectedPath === path.id}
                onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                theme={theme}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* Main visualization area */}
        <div className={cn(
          "relative rounded-2xl p-8 mb-8",
          theme === 'dark'
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white/50 border border-slate-200"
        )}>
          {/* Central prism decoration */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-28 opacity-20 pointer-events-none">
            <CentralPrism theme={theme} />
          </div>

          {/* Unit prisms arranged in a flowing layout */}
          <div className="relative flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {UNITS.map((unit, index) => {
              const unitTopics = getUnitTopics(unit.id)
              return (
                <div
                  key={unit.id}
                  className="relative"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transform: `translateY(${Math.sin((animationPhase + index * 60) * 0.02) * 3}px)`
                  }}
                >
                  {/* Connection beams between units */}
                  {index > 0 && index < UNITS.length && (
                    <svg
                      className="absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 w-8 md:w-12 h-4 overflow-visible"
                      viewBox="0 0 50 20"
                    >
                      <FlowingLightBeam
                        startX={0}
                        startY={10}
                        endX={50}
                        endY={10}
                        color={UNITS[index - 1].color}
                        delay={index * 0.2}
                      />
                    </svg>
                  )}

                  <UnitPrismCard
                    unit={unit}
                    isHovered={hoveredUnit === unit.id}
                    isSelected={selectedPathData?.topics.some(tp => TOPICS.find(topic => topic.id === tp)?.unit === unit.id) ?? false}
                    onHover={setHoveredUnit}
                    onClick={() => handleNavigateToUnit(unit.id)}
                    topicCount={unitTopics.length}
                    theme={theme}
                  />
                </div>
              )
            })}
          </div>

          {/* Difficulty legend */}
          <div className={cn(
            "absolute bottom-4 left-4 flex items-center gap-4 text-xs",
            theme === 'dark' ? "text-slate-400" : "text-slate-500"
          )}>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span>{isZh ? '基础' : 'Foundation'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>{isZh ? '应用' : 'Application'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>{isZh ? '研究' : 'Research'}</span>
            </div>
          </div>
        </div>

        {/* Selected path topics */}
        {selectedPathData && (
          <div className={cn(
            "p-6 rounded-xl",
            theme === 'dark'
              ? "bg-slate-800/50 border border-slate-700"
              : "bg-white/50 border border-slate-200"
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${selectedPathData.color}20` }}
              >
                <selectedPathData.icon className="w-4 h-4" style={{ color: selectedPathData.color }} />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>
                  {t(selectedPathData.nameKey)}
                </h3>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                )}>
                  {t(selectedPathData.descKey)}
                </p>
              </div>
            </div>

            {/* Path topics as a flowing list */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedPathData.topics.map((topicId, index) => {
                const topic = TOPICS.find(t => t.id === topicId)
                if (!topic) return null
                const unit = UNITS.find(u => u.id === topic.unit)
                if (!unit) return null

                return (
                  <div key={topicId} className="flex items-center gap-2">
                    <TopicPill
                      topic={topic}
                      unit={unit}
                      onClick={() => handleNavigateToDemo(topicId)}
                      theme={theme}
                      t={t}
                      isInPath={true}
                    />
                    {index < selectedPathData.topics.length - 1 && (
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: selectedPathData.color, opacity: 0.5 }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/demos/em-wave')}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium",
              "transition-all duration-300 hover:scale-105",
              theme === 'dark'
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
            )}
          >
            <Play className="w-5 h-5" />
            {isZh ? '开始学习旅程' : 'Start Learning Journey'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LightPathOdyssey
