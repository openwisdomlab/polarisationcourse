/**
 * PrinciplesVisualization - 偏振四大基本原理可视化
 *
 * 展示偏振光学的四大核心原理：
 * 1. 正交性 (Orthogonality) - 偏振方向相差90°的光可以共存
 * 2. 马吕斯定律 (Malus's Law) - I = I₀cos²θ
 * 3. 双折射 (Birefringence) - 晶体分解光为o光和e光
 * 4. 干涉 (Interference) - 同相增强，反相抵消
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Play, ArrowRight, Lightbulb } from 'lucide-react'

// Principle data with enhanced styling
interface Principle {
  id: string
  number: number
  icon: string
  titleEn: string
  titleZh: string
  subtitleEn: string
  subtitleZh: string
  formula?: string
  keyPointEn: string
  keyPointZh: string
  color: string
  bgGradient: string
  linkedDemo: string
}

const PRINCIPLES: Principle[] = [
  {
    id: 'orthogonality',
    number: 1,
    icon: '⊥',
    titleEn: 'Orthogonality',
    titleZh: '正交性',
    subtitleEn: 'Perpendicular Coexistence',
    subtitleZh: '垂直共存',
    keyPointEn: '90° polarizations coexist independently',
    keyPointZh: '90°偏振方向可独立共存',
    color: '#22d3ee',
    bgGradient: 'from-cyan-500/10 to-cyan-600/5',
    linkedDemo: 'polarization-types-unified',
  },
  {
    id: 'malus',
    number: 2,
    icon: '∠',
    titleEn: "Malus's Law",
    titleZh: '马吕斯定律',
    subtitleEn: 'Intensity Rule',
    subtitleZh: '强度法则',
    formula: 'I = I₀cos²θ',
    keyPointEn: 'Light intensity follows cosine squared',
    keyPointZh: '透过光强遵循余弦平方',
    color: '#3b82f6',
    bgGradient: 'from-blue-500/10 to-blue-600/5',
    linkedDemo: 'malus',
  },
  {
    id: 'birefringence',
    number: 3,
    icon: '◇',
    titleEn: 'Birefringence',
    titleZh: '双折射',
    subtitleEn: 'Crystal Splitting',
    subtitleZh: '晶体分光',
    keyPointEn: 'Crystal splits light into o-ray & e-ray',
    keyPointZh: '晶体将光分为o光与e光',
    color: '#8b5cf6',
    bgGradient: 'from-violet-500/10 to-violet-600/5',
    linkedDemo: 'birefringence',
  },
  {
    id: 'interference',
    number: 4,
    icon: '∿',
    titleEn: 'Interference',
    titleZh: '干涉',
    subtitleEn: 'Wave Superposition',
    subtitleZh: '波的叠加',
    formula: 'Δφ → I',
    keyPointEn: 'Same phase adds, opposite cancels',
    keyPointZh: '同相增强，反相抵消',
    color: '#f59e0b',
    bgGradient: 'from-amber-500/10 to-amber-600/5',
    linkedDemo: 'waveplate',
  },
]

// Compact animated visualization for each principle
function PrincipleIcon({ principle, isActive, theme }: { principle: Principle; isActive: boolean; theme: 'dark' | 'light' }) {
  const [phase, setPhase] = useState(0)
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 360)
    }, 40)
    return () => clearInterval(interval)
  }, [isActive])

  const size = 80
  const center = size / 2

  const iconAnimations: Record<string, React.ReactNode> = {
    orthogonality: (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Horizontal wave - red */}
        <path
          d={`M ${10},${center} Q ${25},${center - 10 + (isActive ? Math.sin(phase * 0.15) * 5 : 0)} ${center},${center} T ${size - 10},${center}`}
          fill="none"
          stroke="#ff4444"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Vertical wave - green */}
        <path
          d={`M ${center},${10} Q ${center + 10 - (isActive ? Math.sin(phase * 0.15) * 5 : 0)},${25} ${center},${center} T ${center},${size - 10}`}
          fill="none"
          stroke="#44ff44"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* 90° corner indicator */}
        <path
          d={`M ${center + 8},${center} L ${center + 8},${center - 8} L ${center},${center - 8}`}
          fill="none"
          stroke={isDark ? '#94a3b8' : '#64748b'}
          strokeWidth="1.5"
        />
      </svg>
    ),
    malus: (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Light source */}
        <circle cx="12" cy={center} r="6" fill="#fbbf24" opacity={isActive ? 0.6 + Math.sin(phase * 0.1) * 0.3 : 0.7}>
          {isActive && <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />}
        </circle>
        {/* Input beam */}
        <line x1="18" y1={center} x2="28" y2={center} stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
        {/* Polarizer */}
        <rect x="30" y={center - 15} width="6" height="30" fill="#3b82f6" rx="1" />
        <line x1="33" y1={center - 12} x2="33" y2={center + 12} stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3,2" />
        {/* Angle indicator */}
        <g transform={`rotate(${isActive ? phase * 0.8 : 45}, 24, ${center})`}>
          <line x1="24" y1={center} x2="24" y2={center - 10} stroke={isDark ? '#fff' : '#333'} strokeWidth="1.5" />
        </g>
        {/* Output beam - intensity varies */}
        <line
          x1="38"
          y1={center}
          x2="68"
          y2={center}
          stroke="#fcd34d"
          strokeWidth={isActive ? 2 + Math.cos(phase * 0.08) ** 2 * 2 : 3}
          strokeLinecap="round"
          opacity={isActive ? 0.4 + Math.cos(phase * 0.08) ** 2 * 0.5 : 0.7}
        />
      </svg>
    ),
    birefringence: (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Input beam */}
        <line x1="5" y1={center} x2="22" y2={center} stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
        {/* Crystal */}
        <polygon
          points={`25,${center - 18} ${center + 8},${center - 18} ${center + 16},${center + 18} 17,${center + 18}`}
          fill="url(#crystalGrad)"
          opacity="0.7"
        />
        <polygon
          points={`25,${center - 18} ${center + 8},${center - 18} ${center + 16},${center + 18} 17,${center + 18}`}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1"
        />
        {/* o-ray */}
        <line
          x1={center + 16}
          y1={center - 8}
          x2={size - 5}
          y2={center - 18 + (isActive ? Math.sin(phase * 0.1) * 2 : 0)}
          stroke="#ff4444"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* e-ray */}
        <line
          x1={center + 16}
          y1={center + 8}
          x2={size - 5}
          y2={center + 18 + (isActive ? Math.sin(phase * 0.1 + Math.PI) * 2 : 0)}
          stroke="#44ff44"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    ),
    interference: (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Constructive - top */}
        <g transform={`translate(0, ${-10})`}>
          <path
            d={`M 8,${center} Q 20,${center - 8 + (isActive ? Math.sin(phase * 0.12) * 3 : 0)} 32,${center} T 56,${center}`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            opacity="0.9"
          />
          <circle cx="62" cy={center} r={isActive ? 5 + Math.sin(phase * 0.08) : 5} fill="#22d3ee" opacity="0.6" />
          <circle cx="62" cy={center} r="2" fill="white" />
        </g>
        {/* Destructive - bottom */}
        <g transform={`translate(0, ${10})`}>
          <path
            d={`M 8,${center} Q 20,${center - 6 + (isActive ? Math.sin(phase * 0.12) * 3 : 0)} 32,${center} T 56,${center}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.9"
          />
          <path
            d={`M 8,${center} Q 20,${center + 6 - (isActive ? Math.sin(phase * 0.12) * 3 : 0)} 32,${center} T 56,${center}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.5"
            strokeDasharray="3,2"
          />
          {/* X mark for cancellation */}
          <g transform={`rotate(${isActive ? phase * 0.3 : 0}, 62, ${center})`}>
            <line x1="58" y1={center - 4} x2="66" y2={center + 4} stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="2" />
            <line x1="58" y1={center + 4} x2="66" y2={center - 4} stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="2" />
          </g>
        </g>
      </svg>
    ),
  }

  return iconAnimations[principle.id] || null
}

// Individual principle card
function PrincipleCard({
  principle,
  isActive,
  onClick,
  onNavigate,
  theme,
  isZh,
}: {
  principle: Principle
  isActive: boolean
  onClick: () => void
  onNavigate: () => void
  theme: 'dark' | 'light'
  isZh: boolean
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-400",
        "border hover:shadow-xl",
        isActive ? "scale-[1.02]" : "hover:scale-[1.01]",
        theme === 'dark'
          ? "bg-gradient-to-br border-slate-700/50 hover:border-slate-600"
          : "bg-gradient-to-br border-slate-200 hover:border-slate-300",
        `bg-gradient-to-br ${principle.bgGradient}`
      )}
      style={{
        boxShadow: isActive
          ? `0 12px 40px ${principle.color}25, inset 0 1px 0 ${principle.color}20`
          : undefined,
      }}
      onClick={onClick}
    >
      {/* Number badge */}
      <div
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          backgroundColor: `${principle.color}20`,
          color: principle.color,
        }}
      >
        {principle.number}
      </div>

      {/* Main content */}
      <div className="p-5 flex-1">
        {/* Icon container */}
        <div className={cn(
          "w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300",
          isActive ? "scale-105" : "",
          theme === 'dark' ? "bg-slate-800/80" : "bg-white/80"
        )}
        style={{
          boxShadow: isActive ? `0 8px 24px ${principle.color}30` : `0 4px 12px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
        }}>
          <PrincipleIcon principle={principle} isActive={isActive} theme={theme} />
        </div>

        {/* Symbol icon */}
        <div
          className="text-center text-2xl font-bold mb-2"
          style={{ color: principle.color }}
        >
          {principle.icon}
        </div>

        {/* Title */}
        <h3 className={cn(
          "text-center text-lg font-bold mb-1",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>
          {isZh ? principle.titleZh : principle.titleEn}
        </h3>

        {/* Subtitle */}
        <p className={cn(
          "text-center text-xs mb-3",
          theme === 'dark' ? "text-slate-500" : "text-slate-400"
        )}>
          {isZh ? principle.subtitleZh : principle.subtitleEn}
        </p>

        {/* Formula if exists */}
        {principle.formula && (
          <div className="flex justify-center mb-3">
            <code
              className={cn(
                "text-sm px-3 py-1 rounded-full font-mono font-semibold",
                theme === 'dark'
                  ? "bg-slate-800 text-cyan-400"
                  : "bg-slate-100 text-cyan-600"
              )}
            >
              {principle.formula}
            </code>
          </div>
        )}

        {/* Key point */}
        <p className={cn(
          "text-center text-sm leading-relaxed",
          theme === 'dark' ? "text-slate-400" : "text-slate-600"
        )}>
          {isZh ? principle.keyPointZh : principle.keyPointEn}
        </p>
      </div>

      {/* Footer action */}
      <div
        className={cn(
          "px-5 py-3 border-t flex items-center justify-center gap-2 transition-all",
          theme === 'dark' ? "border-slate-700/50 bg-slate-900/30" : "border-slate-100 bg-slate-50/50",
          "group-hover:bg-opacity-80"
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate()
          }}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
            "hover:scale-105 active:scale-95"
          )}
          style={{
            backgroundColor: `${principle.color}15`,
            color: principle.color,
          }}
        >
          <Play className="w-3 h-3" />
          {isZh ? '查看演示' : 'View Demo'}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Active indicator bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 transition-all duration-300",
          isActive ? "opacity-100" : "opacity-0"
        )}
        style={{ backgroundColor: principle.color }}
      />
    </div>
  )
}

// Main component
export function PrinciplesVisualization() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language.startsWith('zh')

  const [activeId, setActiveId] = useState<string | null>('orthogonality')
  const [autoRotate, setAutoRotate] = useState(true)

  // Auto-rotate through principles
  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setActiveId(current => {
        const currentIndex = PRINCIPLES.findIndex(p => p.id === current)
        const nextIndex = (currentIndex + 1) % PRINCIPLES.length
        return PRINCIPLES[nextIndex].id
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [autoRotate])

  const handleCardClick = useCallback((id: string) => {
    setActiveId(id)
    setAutoRotate(false)
    // Resume auto-rotate after 10 seconds of inactivity
    setTimeout(() => setAutoRotate(true), 10000)
  }, [])

  const handleNavigate = useCallback((demoId: string) => {
    navigate({ to: `/demos/${demoId}` as string })
  }, [navigate])

  return (
    <section className={cn(
      "py-16 px-4 sm:px-6 relative overflow-hidden",
      theme === 'dark' ? "bg-slate-900/80" : "bg-gradient-to-b from-slate-50 to-white"
    )}>
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, rgba(139,92,246,0.03) 50%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-10">
          {/* Badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
            theme === 'dark'
              ? "bg-amber-500/10 border border-amber-500/20"
              : "bg-amber-50 border border-amber-200"
          )}>
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-amber-400" : "text-amber-600"
            )}>
              {isZh ? '核心原理' : 'Core Principles'}
            </span>
          </div>

          {/* Title */}
          <h2 className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-bold mb-3",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {isZh ? '偏振光学四大定律' : 'Four Laws of Polarization'}
          </h2>

          {/* Subtitle */}
          <p className={cn(
            "text-base sm:text-lg max-w-xl mx-auto",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {isZh
              ? '掌握这四条核心定律，解锁偏振光学的全部奥秘'
              : 'Master these four core laws to unlock all mysteries of polarization optics'}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-8">
          {PRINCIPLES.map((p) => (
            <button
              key={p.id}
              onClick={() => handleCardClick(p.id)}
              className={cn(
                "relative w-10 h-1.5 rounded-full transition-all duration-300 overflow-hidden",
                theme === 'dark' ? "bg-slate-700" : "bg-slate-200"
              )}
              title={isZh ? p.titleZh : p.titleEn}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-full transition-all duration-300",
                  activeId === p.id ? "w-full" : "w-0"
                )}
                style={{ backgroundColor: p.color }}
              />
              {autoRotate && activeId === p.id && (
                <div
                  className="absolute inset-0 rounded-full origin-left animate-[progress_4s_linear]"
                  style={{ backgroundColor: p.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Principles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PRINCIPLES.map((principle) => (
            <PrincipleCard
              key={principle.id}
              principle={principle}
              isActive={activeId === principle.id}
              onClick={() => handleCardClick(principle.id)}
              onNavigate={() => handleNavigate(principle.linkedDemo)}
              theme={theme}
              isZh={isZh}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate({ to: '/demos' as string })}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm",
              "transition-all duration-300 hover:scale-105 active:scale-95",
              theme === 'dark'
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
            )}
          >
            <Play className="w-4 h-4" />
            {isZh ? '探索全部演示' : 'Explore All Demos'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom keyframes for progress animation */}
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  )
}

export default PrinciplesVisualization
