/**
 * PolarizationLawsSection - 偏振四大基本定律可视化组件
 *
 * Interactive visualization of the Four Laws of Polarization:
 * 1. Orthogonality (正交性) - Light polarized at 90° can coexist
 * 2. Malus's Law (马吕斯定律) - I = I₀ × cos²(θ)
 * 3. Birefringence (双折射) - Crystal splits light into o-ray and e-ray
 * 4. Interference (干涉) - Same-phase adds, opposite-phase cancels
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Layers,
  Activity,
  Split,
  Waves,
  Info,
  ChevronRight
} from 'lucide-react'

// Law configuration
interface PolarizationLaw {
  id: string
  titleKey: string
  descriptionKey: string
  formulaKey?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  glowColor: string
}

const POLARIZATION_LAWS: PolarizationLaw[] = [
  {
    id: 'orthogonality',
    titleKey: 'museum.laws.orthogonality.title',
    descriptionKey: 'museum.laws.orthogonality.description',
    icon: Layers,
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)'
  },
  {
    id: 'malus',
    titleKey: 'museum.laws.malus.title',
    descriptionKey: 'museum.laws.malus.description',
    formulaKey: 'museum.laws.malus.formula',
    icon: Activity,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)'
  },
  {
    id: 'birefringence',
    titleKey: 'museum.laws.birefringence.title',
    descriptionKey: 'museum.laws.birefringence.description',
    icon: Split,
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.4)'
  },
  {
    id: 'interference',
    titleKey: 'museum.laws.interference.title',
    descriptionKey: 'museum.laws.interference.description',
    icon: Waves,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.4)'
  }
]

// Orthogonality Visualization - Two perpendicular waves
function OrthogonalityVisualization({ isActive }: { isActive: boolean }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setTime(t => (t + 2) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [isActive])

  // Generate wave points
  const generateWave = (phase: number, amplitude: number) => {
    const points: string[] = []
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + amplitude * Math.sin((x * 4 + time + phase) * Math.PI / 180)
      points.push(`${x},${y}`)
    }
    return `M${points.join(' L')}`
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="wave-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4444" stopOpacity="0" />
          <stop offset="20%" stopColor="#ff4444" stopOpacity="1" />
          <stop offset="80%" stopColor="#ff4444" stopOpacity="1" />
          <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wave-v" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#44ff44" stopOpacity="0" />
          <stop offset="20%" stopColor="#44ff44" stopOpacity="1" />
          <stop offset="80%" stopColor="#44ff44" stopOpacity="1" />
          <stop offset="100%" stopColor="#44ff44" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal wave (0°) */}
      <path
        d={generateWave(0, 15)}
        fill="none"
        stroke="url(#wave-h)"
        strokeWidth="2"
        opacity={isActive ? 1 : 0.5}
      />

      {/* Vertical wave (90°) */}
      <path
        d={generateWave(90, 15)}
        fill="none"
        stroke="url(#wave-v)"
        strokeWidth="2"
        opacity={isActive ? 1 : 0.5}
      />

      {/* 90° indicator */}
      <g transform="translate(50, 50)">
        <path
          d="M 0,-8 L 8,-8 L 8,0"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <text x="12" y="-4" fontSize="6" fill="white" opacity="0.7">90°</text>
      </g>
    </svg>
  )
}

// Malus's Law Visualization - Intensity through polarizer
function MalusVisualization({ isActive }: { isActive: boolean }) {
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setAngle(a => (a + 0.5) % 180)
    }, 30)
    return () => clearInterval(interval)
  }, [isActive])

  // Calculate intensity using Malus's Law
  const intensity = Math.cos(angle * Math.PI / 180) ** 2
  const beamWidth = 8 + intensity * 12

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="beam-in" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="beam-out" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity={intensity} />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Input beam */}
      <rect x="5" y="42" width="35" height="16" fill="url(#beam-in)" rx="2" />

      {/* Polarizer (rotating) */}
      <g transform={`translate(50, 50) rotate(${angle})`}>
        <rect x="-3" y="-25" width="6" height="50" fill="#64748b" opacity="0.8" rx="1" />
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
      </g>

      {/* Output beam (intensity varies) */}
      <rect
        x="60"
        y={50 - beamWidth / 2}
        width="35"
        height={beamWidth}
        fill="url(#beam-out)"
        rx="2"
        opacity={isActive ? 1 : 0.5}
      />

      {/* Intensity indicator */}
      <text x="50" y="90" textAnchor="middle" fontSize="5" fill="white" opacity="0.8">
        I = I₀ × cos²({Math.round(angle)}°) = {(intensity * 100).toFixed(0)}%
      </text>
    </svg>
  )
}

// Birefringence Visualization - Crystal splitting light
function BirefringenceVisualization({ isActive }: { isActive: boolean }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setTime(t => (t + 2) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [isActive])

  // Animated beam position
  const beamProgress = (time % 180) / 180
  const showSplit = beamProgress > 0.3

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="crystal-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Crystal (calcite) */}
      <polygon
        points="35,25 65,25 70,75 30,75"
        fill="url(#crystal-fill)"
        stroke="#a78bfa"
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Crystal pattern lines */}
      {[30, 40, 50, 60].map((x, i) => (
        <line
          key={i}
          x1={x + 2}
          y1="28"
          x2={x - 3}
          y2="72"
          stroke="#a78bfa"
          strokeWidth="0.3"
          opacity="0.4"
        />
      ))}

      {/* Input beam (unpolarized/mixed) */}
      <rect x="5" y="46" width="28" height="8" fill="#ffffff" opacity="0.8" rx="1">
        <animate
          attributeName="opacity"
          values="0.6;0.9;0.6"
          dur="1s"
          repeatCount="indefinite"
        />
      </rect>

      {/* O-ray (ordinary ray - 0°) */}
      {showSplit && (
        <g>
          <line
            x1="67"
            y1="50"
            x2="95"
            y2="40"
            stroke="#ff4444"
            strokeWidth="4"
            strokeLinecap="round"
            opacity={isActive ? 0.9 : 0.5}
          />
          <text x="88" y="35" fontSize="4" fill="#ff4444">o-ray (0°)</text>
        </g>
      )}

      {/* E-ray (extraordinary ray - 90°) */}
      {showSplit && (
        <g>
          <line
            x1="67"
            y1="50"
            x2="95"
            y2="60"
            stroke="#44ff44"
            strokeWidth="4"
            strokeLinecap="round"
            opacity={isActive ? 0.9 : 0.5}
          />
          <text x="88" y="68" fontSize="4" fill="#44ff44">e-ray (90°)</text>
        </g>
      )}

      {/* Labels */}
      <text x="50" y="18" textAnchor="middle" fontSize="4" fill="#a78bfa" opacity="0.8">
        Calcite
      </text>
    </svg>
  )
}

// Interference Visualization - Constructive and destructive
function InterferenceVisualization({ isActive }: { isActive: boolean }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setTime(t => (t + 3) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [isActive])

  // Generate wave for interference
  const generateInterferenceWave = (yOffset: number, phase: number, color: string) => {
    const points: string[] = []
    for (let x = 0; x <= 45; x += 1) {
      const y = yOffset + 8 * Math.sin((x * 8 + time + phase) * Math.PI / 180)
      points.push(`${x},${y}`)
    }
    return { path: `M${points.join(' L')}`, color }
  }

  // Constructive interference (same phase)
  const wave1 = generateInterferenceWave(25, 0, '#34d399')
  const wave2 = generateInterferenceWave(25, 0, '#34d399')

  // Combined constructive wave
  const constructivePoints: string[] = []
  for (let x = 55; x <= 100; x += 1) {
    const y = 25 + 16 * Math.sin((x * 8 + time) * Math.PI / 180)
    constructivePoints.push(`${x},${y}`)
  }

  // Destructive interference (opposite phase)
  const wave3 = generateInterferenceWave(75, 0, '#f472b6')
  const wave4 = generateInterferenceWave(75, 180, '#60a5fa')

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Constructive Section */}
      <g>
        {/* Label */}
        <text x="25" y="10" textAnchor="middle" fontSize="4" fill="#34d399" opacity="0.9">
          Same Phase (+)
        </text>

        {/* Two in-phase waves */}
        <path d={wave1.path} fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />
        <path d={wave2.path} fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.6" transform="translate(0, 1)" />

        {/* Arrow */}
        <path d="M 47,25 L 53,25 L 51,23 M 53,25 L 51,27" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />

        {/* Combined (amplified) wave */}
        <path
          d={`M${constructivePoints.join(' L')}`}
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          opacity={isActive ? 1 : 0.5}
        />

        {/* Bright indicator */}
        <circle cx="85" cy="25" r="4" fill="#34d399" opacity="0.3">
          <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
        </circle>
        <text x="85" y="38" textAnchor="middle" fontSize="3.5" fill="#34d399">Bright</text>
      </g>

      {/* Destructive Section */}
      <g>
        {/* Label */}
        <text x="25" y="58" textAnchor="middle" fontSize="4" fill="#f472b6" opacity="0.9">
          Opposite Phase (−)
        </text>

        {/* Two out-of-phase waves */}
        <path d={wave3.path} fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.6" />
        <path d={wave4.path} fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />

        {/* Arrow */}
        <path d="M 47,75 L 53,75 L 51,73 M 53,75 L 51,77" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />

        {/* Cancelled wave (flat line) */}
        <line
          x1="55"
          y1="75"
          x2="100"
          y2="75"
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity={isActive ? 0.8 : 0.4}
        />

        {/* Dark indicator */}
        <circle cx="85" cy="75" r="4" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" opacity="0.8" />
        <text x="85" y="88" textAnchor="middle" fontSize="3.5" fill="#64748b">Dark</text>
      </g>
    </svg>
  )
}

// Get visualization component by law ID
function LawVisualization({ lawId, isActive }: { lawId: string; isActive: boolean }) {
  switch (lawId) {
    case 'orthogonality':
      return <OrthogonalityVisualization isActive={isActive} />
    case 'malus':
      return <MalusVisualization isActive={isActive} />
    case 'birefringence':
      return <BirefringenceVisualization isActive={isActive} />
    case 'interference':
      return <InterferenceVisualization isActive={isActive} />
    default:
      return null
  }
}

// Extended descriptions for each law
const LAW_EXTENDED_INFO: Record<string, { principleKey: string; exampleKey: string; applicationKey: string }> = {
  'orthogonality': {
    principleKey: 'museum.laws.orthogonality.principle',
    exampleKey: 'museum.laws.orthogonality.example',
    applicationKey: 'museum.laws.orthogonality.application',
  },
  'malus': {
    principleKey: 'museum.laws.malus.principle',
    exampleKey: 'museum.laws.malus.example',
    applicationKey: 'museum.laws.malus.application',
  },
  'birefringence': {
    principleKey: 'museum.laws.birefringence.principle',
    exampleKey: 'museum.laws.birefringence.example',
    applicationKey: 'museum.laws.birefringence.application',
  },
  'interference': {
    principleKey: 'museum.laws.interference.principle',
    exampleKey: 'museum.laws.interference.example',
    applicationKey: 'museum.laws.interference.application',
  },
}

// Law Card Component
function LawCard({
  law,
  isHovered,
  isExpanded,
  onHover,
  onClick
}: {
  law: PolarizationLaw
  isHovered: boolean
  isExpanded: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const Icon = law.icon
  const extendedInfo = LAW_EXTENDED_INFO[law.id]

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden cursor-pointer",
        "transition-all duration-300",
        isExpanded ? "col-span-2 row-span-2" : "",
        theme === 'dark' ? "bg-slate-800/80" : "bg-white/90"
      )}
      style={{
        boxShadow: isHovered
          ? `0 10px 20px -5px ${law.glowColor}, 0 0 0 1px ${law.color}30`
          : 'none'
      }}
      onMouseEnter={() => onHover(law.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${law.color}15 0%, transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="relative p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          {/* Icon */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              "transition-all duration-300 group-hover:scale-110"
            )}
            style={{
              backgroundColor: `${law.color}15`,
              boxShadow: isHovered ? `0 0 15px ${law.glowColor}` : 'none'
            }}
          >
            <span style={{ color: law.color }}>
              <Icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
            </span>
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-xs font-semibold mb-0.5 truncate",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              {t(law.titleKey)}
            </h3>
            <p className={cn(
              "text-[10px] line-clamp-2 leading-tight",
              theme === 'dark' ? "text-slate-400" : "text-slate-600"
            )}>
              {t(law.descriptionKey)}
            </p>
          </div>
        </div>

        {/* Compact Visualization Area */}
        <div
          className={cn(
            "rounded-lg overflow-hidden h-[70px] mb-2",
            theme === 'dark' ? "bg-slate-900/50" : "bg-slate-100/50"
          )}
        >
          <LawVisualization lawId={law.id} isActive={isHovered} />
        </div>

        {/* Formula (if applicable) */}
        {law.formulaKey && (
          <div className={cn(
            "text-center text-[10px] font-mono mb-1.5 px-2 py-0.5 rounded",
            theme === 'dark' ? "text-amber-400 bg-amber-500/10" : "text-amber-600 bg-amber-100"
          )}>
            {t(law.formulaKey)}
          </div>
        )}

        {/* Extended info section */}
        <div className={cn(
          "text-[9px] space-y-1 pt-1 border-t",
          theme === 'dark' ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-500"
        )}>
          {/* Principle */}
          <div className="flex items-start gap-1">
            <span style={{ color: law.color }} className="font-medium flex-shrink-0">▸</span>
            <span className="line-clamp-1">{t(extendedInfo.principleKey, '原理说明')}</span>
          </div>
          {/* Example */}
          <div className="flex items-start gap-1">
            <span className="text-emerald-500 font-medium flex-shrink-0">◦</span>
            <span className="line-clamp-1">{t(extendedInfo.exampleKey, '生活实例')}</span>
          </div>
          {/* Application - only show on hover */}
          {isHovered && (
            <div className="flex items-start gap-1">
              <span className="text-blue-500 font-medium flex-shrink-0">★</span>
              <span className="line-clamp-1">{t(extendedInfo.applicationKey, '应用场景')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Component
interface PolarizationLawsSectionProps {
  onSelectDemo?: (demoId: string) => void
}

export function PolarizationLawsSection({ onSelectDemo }: PolarizationLawsSectionProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [hoveredLaw, setHoveredLaw] = useState<string | null>(null)
  const [expandedLaw] = useState<string | null>(null)

  // Map law to demo ID
  const lawToDemoMap: Record<string, string> = {
    'orthogonality': 'polarization-intro',
    'malus': 'malus',
    'birefringence': 'birefringence',
    'interference': 'waveplate'
  }

  const handleLawClick = (lawId: string) => {
    if (onSelectDemo && lawToDemoMap[lawId]) {
      onSelectDemo(lawToDemoMap[lawId])
    }
  }

  return (
    <div className={cn(
      "rounded-xl overflow-hidden relative",
      theme === 'dark'
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700"
        : "bg-gradient-to-br from-slate-100 via-white to-slate-50 border border-slate-200"
    )}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-opacity-20 border-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <h3 className={cn(
            "text-xs font-semibold",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.laws.title', '偏振四大定律')}
          </h3>
        </div>

        {/* Subtitle */}
        <span className={cn(
          "text-[10px]",
          theme === 'dark' ? "text-slate-500" : "text-slate-400"
        )}>
          {t('museum.laws.subtitle', '点击探索详细演示')}
        </span>
      </div>

      {/* Laws Grid - more compact */}
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {POLARIZATION_LAWS.map((law) => (
            <LawCard
              key={law.id}
              law={law}
              isHovered={hoveredLaw === law.id}
              isExpanded={expandedLaw === law.id}
              onHover={setHoveredLaw}
              onClick={() => handleLawClick(law.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className={cn(
        "px-3 py-1.5 border-t border-opacity-20 border-slate-500 flex items-center justify-center gap-1 text-[10px]",
        theme === 'dark' ? "text-slate-500" : "text-slate-400"
      )}>
        <span>{t('museum.laws.hint', '这四大定律构成了偏振光学的理论基础')}</span>
        <ChevronRight className="w-2.5 h-2.5" />
      </div>
    </div>
  )
}

export default PolarizationLawsSection
