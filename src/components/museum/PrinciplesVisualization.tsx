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
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  ChevronRight,
  Play,
  BookOpen,
} from 'lucide-react'

// Principle data
interface Principle {
  id: string
  icon: string
  titleEn: string
  titleZh: string
  formula?: string
  descriptionEn: string
  descriptionZh: string
  color: string
  linkedDemo: string
}

const PRINCIPLES: Principle[] = [
  {
    id: 'orthogonality',
    icon: '⊥',
    titleEn: 'Orthogonality',
    titleZh: '正交性',
    descriptionEn: 'Light with perpendicular polarizations (90° apart) can coexist without interference.',
    descriptionZh: '偏振方向相差90°的光可以共存而不发生干涉。',
    color: '#22d3ee',
    linkedDemo: 'polarization-types-unified',
  },
  {
    id: 'malus',
    icon: '∠',
    titleEn: "Malus's Law",
    titleZh: '马吕斯定律',
    formula: 'I = I₀cos²θ',
    descriptionEn: 'Intensity through a polarizer follows the cosine squared law.',
    descriptionZh: '通过偏振片的光强遵循余弦平方定律。',
    color: '#3b82f6',
    linkedDemo: 'malus',
  },
  {
    id: 'birefringence',
    icon: '◇',
    titleEn: 'Birefringence',
    titleZh: '双折射',
    descriptionEn: 'Crystals split light into ordinary ray (o-ray) and extraordinary ray (e-ray).',
    descriptionZh: '晶体将光分解为寻常光(o光)和非常光(e光)。',
    color: '#8b5cf6',
    linkedDemo: 'birefringence',
  },
  {
    id: 'interference',
    icon: '∿',
    titleEn: 'Interference',
    titleZh: '干涉',
    formula: 'φ=0: + | φ=π: −',
    descriptionEn: 'Same-phase light adds intensity; opposite-phase cancels.',
    descriptionZh: '同相位光叠加增强；反相位光相互抵消。',
    color: '#f59e0b',
    linkedDemo: 'waveplate',
  },
]

// Animated SVG visualization for each principle
function PrincipleAnimation({ principleId, isActive }: { principleId: string; isActive: boolean }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isActive])

  const animations: Record<string, React.ReactNode> = {
    orthogonality: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="hGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4444" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ff4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff4444" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="vGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#44ff44" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#44ff44" stopOpacity="1" />
            <stop offset="100%" stopColor="#44ff44" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="200" height="120" fill={isDark ? '#0f172a' : '#f8fafc'} rx="8" />

        {/* Horizontal wave (0°) - animated */}
        <g transform={`translate(${isActive ? Math.sin(animationPhase * 0.1) * 3 : 0}, 0)`}>
          <path
            d={`M 20,60 Q 50,${45 + (isActive ? Math.sin(animationPhase * 0.15) * 8 : 0)} 80,60 T 140,60`}
            fill="none"
            stroke="#ff4444"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="20" cy="60" r="4" fill="#ff4444" opacity="0.6" />
        </g>

        {/* Vertical wave (90°) - animated */}
        <g transform={`translate(0, ${isActive ? Math.cos(animationPhase * 0.1) * 3 : 0})`}>
          <path
            d={`M 80,20 Q ${95 + (isActive ? Math.sin(animationPhase * 0.15) * 8 : 0)},50 80,80 T 80,100`}
            fill="none"
            stroke="#44ff44"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="80" cy="20" r="4" fill="#44ff44" opacity="0.6" />
        </g>

        {/* 90° indicator */}
        <rect x="80" y="60" width="10" height="10" fill="none" stroke={isDark ? '#fff' : '#333'} strokeWidth="1.5" rx="1" />

        {/* Labels */}
        <text x="145" y="58" fontSize="11" fill="#ff4444" fontWeight="600">0° H</text>
        <text x="92" y="30" fontSize="11" fill="#44ff44" fontWeight="600">90° V</text>

        {/* Result indicator */}
        <text x="155" y="100" fontSize="10" fill={isDark ? '#94a3b8' : '#64748b'} textAnchor="middle">
          {isDark ? '无干涉' : 'No interference'}
        </text>
      </svg>
    ),
    malus: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="beamGradIn" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
          <linearGradient id="beamGradOut" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity={isActive ? 0.3 + 0.5 * Math.cos(animationPhase * 0.05) ** 2 : 0.5} />
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="200" height="120" fill={isDark ? '#0f172a' : '#f8fafc'} rx="8" />

        {/* Input light beam */}
        <line x1="15" y1="60" x2="60" y2="60" stroke="url(#beamGradIn)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="18" cy="60" r="6" fill="#fbbf24" opacity="0.6">
          {isActive && <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />}
        </circle>

        {/* Polarizer */}
        <rect x="65" y="30" width="10" height="60" fill="#3b82f6" rx="2" opacity="0.8" />
        <line x1="70" y1="35" x2="70" y2="85" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4,3" />

        {/* Rotating angle indicator */}
        <g transform={`rotate(${isActive ? animationPhase * 0.5 : 30}, 45, 60)`}>
          <line x1="45" y1="60" x2="45" y2="45" stroke={isDark ? '#fff' : '#333'} strokeWidth="1.5" />
        </g>
        <path d="M50,55 A8,8 0 0 1 48,60" fill="none" stroke={isDark ? '#fff' : '#333'} strokeWidth="1" />
        <text x="56" y="48" fontSize="10" fill={isDark ? '#fff' : '#333'}>θ</text>

        {/* Output light beam (intensity varies with cos²θ) */}
        <line
          x1="80"
          y1="60"
          x2="140"
          y2="60"
          stroke="url(#beamGradOut)"
          strokeWidth={isActive ? 2 + 2 * Math.cos(animationPhase * 0.05) ** 2 : 3}
          strokeLinecap="round"
          opacity={isActive ? 0.4 + 0.5 * Math.cos(animationPhase * 0.05) ** 2 : 0.7}
        />

        {/* Sensor */}
        <rect x="145" y="48" width="24" height="24" fill="#10b981" rx="4" opacity="0.8" />
        <circle cx="157" cy="60" r="6" fill="#34d399">
          {isActive && (
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Formula */}
        <text x="100" y="105" fontSize="12" fill="#22d3ee" textAnchor="middle" fontFamily="monospace" fontWeight="600">
          I = I₀cos²θ
        </text>
      </svg>
    ),
    birefringence: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="200" height="120" fill={isDark ? '#0f172a' : '#f8fafc'} rx="8" />

        {/* Input light beam */}
        <line x1="15" y1="60" x2="50" y2="60" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round">
          {isActive && (
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
          )}
        </line>
        <circle cx="18" cy="60" r="4" fill="#fbbf24" opacity="0.7" />

        {/* Crystal */}
        <polygon points="55,25 95,25 105,95 45,95" fill="url(#crystalGrad)" opacity="0.7" />
        <polygon points="55,25 95,25 105,95 45,95" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="75" y="65" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">Calcite</text>

        {/* o-ray (ordinary) - animated */}
        <g>
          <line
            x1="105"
            y1="45"
            x2={isActive ? 160 + Math.sin(animationPhase * 0.1) * 5 : 160}
            y2="25"
            stroke="#ff4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="165" cy="22" r="5" fill="#ff4444" opacity="0.4">
            {isActive && <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* e-ray (extraordinary) - animated */}
        <g>
          <line
            x1="105"
            y1="75"
            x2={isActive ? 160 + Math.sin(animationPhase * 0.1 + Math.PI) * 5 : 160}
            y2="95"
            stroke="#44ff44"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="165" cy="98" r="5" fill="#44ff44" opacity="0.4">
            {isActive && <animate attributeName="r" values="4;6;4" dur="1s" begin="0.5s" repeatCount="indefinite" />}
          </circle>
        </g>

        {/* Labels */}
        <text x="175" y="28" fontSize="10" fill="#ff4444" fontWeight="600">o光 0°</text>
        <text x="175" y="100" fontSize="10" fill="#44ff44" fontWeight="600">e光 90°</text>
      </svg>
    ),
    interference: (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Background */}
        <rect width="200" height="120" fill={isDark ? '#0f172a' : '#f8fafc'} rx="8" />

        {/* Constructive interference (top) */}
        <g transform="translate(0, -5)">
          {/* Wave 1 */}
          <path
            d={`M 15,40 Q 35,${25 + (isActive ? Math.sin(animationPhase * 0.15) * 5 : 0)} 55,40 T 95,40 T 135,40`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            opacity="0.9"
          />
          {/* Wave 2 - in phase */}
          <path
            d={`M 15,40 Q 35,${25 + (isActive ? Math.sin(animationPhase * 0.15) * 5 : 0)} 55,40 T 95,40 T 135,40`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            opacity="0.5"
            strokeDasharray="4,2"
          />
          {/* Result - bright */}
          <circle cx="150" cy="40" r={isActive ? 8 + Math.sin(animationPhase * 0.1) * 2 : 8} fill="#22d3ee" opacity="0.5" />
          <circle cx="150" cy="40" r="5" fill="#22d3ee" opacity="0.8" />
          <circle cx="150" cy="40" r="2" fill="white" />
          <text x="170" y="43" fontSize="10" fill="#22d3ee" fontWeight="600">φ=0</text>
        </g>

        {/* Destructive interference (bottom) */}
        <g transform="translate(0, 25)">
          {/* Wave 1 */}
          <path
            d={`M 15,60 Q 35,${45 + (isActive ? Math.sin(animationPhase * 0.15) * 5 : 0)} 55,60 T 95,60`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.9"
          />
          {/* Wave 2 - out of phase (inverted) */}
          <path
            d={`M 15,60 Q 35,${75 - (isActive ? Math.sin(animationPhase * 0.15) * 5 : 0)} 55,60 T 95,60`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            opacity="0.5"
            strokeDasharray="4,2"
          />
          {/* Result - dark (X mark) */}
          <g transform={`rotate(${isActive ? animationPhase * 0.5 : 0}, 150, 60)`}>
            <line x1="145" y1="55" x2="155" y2="65" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="2" />
            <line x1="145" y1="65" x2="155" y2="55" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="2" />
          </g>
          <text x="170" y="63" fontSize="10" fill="#f59e0b" fontWeight="600">φ=π</text>
        </g>

        {/* Legend */}
        <text x="60" y="108" fontSize="9" fill={isDark ? '#6b7280' : '#9ca3af'} textAnchor="middle">同相增强</text>
        <text x="140" y="108" fontSize="9" fill={isDark ? '#6b7280' : '#9ca3af'} textAnchor="middle">反相抵消</text>
      </svg>
    ),
  }

  return animations[principleId] || null
}

// Principle card component
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
        "group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
        isActive ? "ring-2 ring-offset-2" : "",
        theme === 'dark'
          ? "bg-slate-800/80 hover:bg-slate-800 ring-offset-slate-900"
          : "bg-white/90 hover:bg-white ring-offset-white"
      )}
      style={{
        boxShadow: isActive
          ? `0 20px 40px ${principle.color}30, 0 0 0 2px ${principle.color}`
          : theme === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.1)',
        // @ts-expect-error - CSS custom property
        '--tw-ring-color': principle.color,
      }}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        )}
        style={{
          background: `linear-gradient(135deg, ${principle.color}10 0%, transparent 60%)`,
        }}
      />

      {/* Header */}
      <div className="relative p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300",
                isActive ? "scale-110" : ""
              )}
              style={{
                backgroundColor: `${principle.color}20`,
                color: principle.color,
                boxShadow: isActive ? `0 0 20px ${principle.color}40` : 'none',
              }}
            >
              {principle.icon}
            </div>
            <div>
              <h3 className={cn(
                "font-bold text-base",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>
                {isZh ? principle.titleZh : principle.titleEn}
              </h3>
              {principle.formula && (
                <code
                  className={cn(
                    "text-xs px-2 py-0.5 rounded font-mono",
                    theme === 'dark'
                      ? "bg-slate-900/80 text-cyan-400"
                      : "bg-cyan-50 text-cyan-700"
                  )}
                >
                  {principle.formula}
                </code>
              )}
            </div>
          </div>
        </div>

        <p className={cn(
          "text-sm leading-relaxed",
          theme === 'dark' ? "text-slate-400" : "text-slate-600"
        )}>
          {isZh ? principle.descriptionZh : principle.descriptionEn}
        </p>
      </div>

      {/* Animation area */}
      <div className={cn(
        "mx-4 mb-3 rounded-xl overflow-hidden transition-all duration-300",
        isActive ? "h-32" : "h-28"
      )}>
        <PrincipleAnimation principleId={principle.id} isActive={isActive} />
      </div>

      {/* Footer */}
      <div className={cn(
        "px-4 py-3 border-t flex items-center justify-between",
        theme === 'dark' ? "border-slate-700/50 bg-slate-900/30" : "border-slate-100 bg-slate-50/50"
      )}>
        <div className="flex items-center gap-2">
          <BookOpen className={cn("w-4 h-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")} />
          <span className={cn("text-xs", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>
            {isZh ? '交互演示' : 'Interactive Demo'}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate()
          }}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            "hover:scale-105 active:scale-95",
            theme === 'dark'
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          )}
        >
          {isZh ? '深入学习' : 'Learn More'}
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
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
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRotate])

  const handleCardClick = useCallback((id: string) => {
    setActiveId(id)
    setAutoRotate(false)
  }, [])

  const handleNavigate = useCallback((demoId: string) => {
    navigate(`/demos/${demoId}`)
  }, [navigate])

  return (
    <section className={cn(
      "py-16 px-6 relative overflow-hidden",
      theme === 'dark' ? "bg-slate-900/50" : "bg-slate-50"
    )}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: 6 + i * 2,
              height: 6 + i * 2,
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              background: PRINCIPLES[i].color,
              opacity: 0.2,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
            theme === 'dark'
              ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30"
              : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
          )}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? "text-amber-400" : "text-amber-600"
            )}>
              {isZh ? '核心知识' : 'Core Knowledge'}
            </span>
          </div>

          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {isZh ? '偏振四大基本原理' : 'Four Fundamental Principles'}
          </h2>

          <p className={cn(
            "text-lg max-w-2xl mx-auto mb-6",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {isZh
              ? '掌握这四个核心原理，就能理解所有偏振光学现象'
              : 'Master these four core principles to understand all polarization phenomena'}
          </p>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {PRINCIPLES.map((p) => (
              <button
                key={p.id}
                onClick={() => handleCardClick(p.id)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeId === p.id ? "scale-125" : "opacity-50 hover:opacity-75"
                )}
                style={{
                  backgroundColor: p.color,
                  boxShadow: activeId === p.id ? `0 0 12px ${p.color}` : 'none',
                }}
                title={isZh ? p.titleZh : p.titleEn}
              />
            ))}
          </div>
        </div>

        {/* Principles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="text-center mt-12">
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
            {isZh ? '从基础开始学习' : 'Start from Basics'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default PrinciplesVisualization
