/**
 * PrinciplesPanel - 偏振光学第一性原理面板
 *
 * 展示四大光学公理：
 * 1. 正交性原理 (Orthogonality)
 * 2. 马吕斯定律 (Malus's Law)
 * 3. 双折射 (Birefringence)
 * 4. 干涉 (Interference)
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'

// ============================================
// Principle Card Component
// ============================================

interface PrincipleCardProps {
  icon: string
  titleEn: string
  titleZh: string
  formula?: string
  descriptionEn: string
  descriptionZh: string
  color: string
}

function PrincipleCard({
  icon,
  titleEn,
  titleZh,
  formula,
  descriptionEn,
  descriptionZh,
  color,
}: PrincipleCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'rounded-xl border p-3 transition-all',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
          style={{
            backgroundColor: theme === 'dark' ? `${color}20` : `${color}15`,
            color: color,
          }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn('font-semibold text-sm mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? titleZh : titleEn}
          </h4>
          {formula && (
            <div
              className={cn(
                'font-mono text-xs px-2 py-1 rounded mb-1.5 inline-block',
                theme === 'dark' ? 'bg-slate-900 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
              )}
            >
              {formula}
            </div>
          )}
          <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? descriptionZh : descriptionEn}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Visual Diagram Component
// ============================================

function PrinciplesDiagram() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <svg viewBox="0 0 800 120" className="w-full">
      <defs>
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff4444" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="120" fill={theme === 'dark' ? '#0a0a1a' : '#f8fafc'} />

      {/* 1. Orthogonality - 正交性 */}
      <g transform="translate(20, 30)">
        <text x="80" y="-10" fontSize="10" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
          {isZh ? '1. 正交性' : '1. Orthogonality'}
        </text>
        {/* Horizontal light */}
        <line x1="20" y1="30" x2="140" y2="30" stroke="#ff4444" strokeWidth="3" opacity="0.8" />
        <line x1="20" y1="30" x2="30" y2="30" stroke="#ff4444" strokeWidth="1" opacity="0.6" markerEnd="url(#arrow-h)" />
        {/* Vertical light */}
        <line x1="80" y1="10" x2="80" y2="70" stroke="#44ff44" strokeWidth="3" opacity="0.8" />
        <line x1="80" y1="70" x2="80" y2="60" stroke="#44ff44" strokeWidth="1" opacity="0.6" markerEnd="url(#arrow-v)" />
        {/* Label */}
        <text x="80" y="85" fontSize="8" fill={theme === 'dark' ? '#64748b' : '#94a3b8'} textAnchor="middle">
          0° ⊥ 90°
        </text>
      </g>

      {/* 2. Malus's Law - 马吕斯定律 */}
      <g transform="translate(200, 30)">
        <text x="80" y="-10" fontSize="10" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
          {isZh ? '2. 马吕斯定律' : "2. Malus's Law"}
        </text>
        {/* Input light */}
        <line x1="10" y1="30" x2="50" y2="30" stroke="#ff4444" strokeWidth="3" opacity="0.8" />
        {/* Polarizer */}
        <rect x="50" y="10" width="6" height="60" fill="#64748b" opacity="0.6" />
        <line x1="56" y1="15" x2="56" y2="65" stroke="#22d3ee" strokeWidth="2" />
        {/* Output light (dimmer) */}
        <line x1="56" y1="30" x2="150" y2="30" stroke="#ffaa00" strokeWidth="2" opacity="0.5" />
        {/* Formula */}
        <text x="80" y="80" fontSize="9" fill={theme === 'dark' ? '#22d3ee' : '#0891b2'} textAnchor="middle" fontFamily="monospace">
          I = I₀cos²θ
        </text>
      </g>

      {/* 3. Birefringence - 双折射 */}
      <g transform="translate(410, 30)">
        <text x="80" y="-10" fontSize="10" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
          {isZh ? '3. 双折射' : '3. Birefringence'}
        </text>
        {/* Input light */}
        <line x1="10" y1="30" x2="60" y2="30" stroke="#ff4444" strokeWidth="3" opacity="0.8" />
        {/* Crystal */}
        <polygon points="60,10 90,10 100,40 70,40" fill={theme === 'dark' ? '#475569' : '#cbd5e1'} opacity="0.6" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} strokeWidth="2" />
        {/* o-ray (0°) */}
        <line x1="100" y1="25" x2="150" y2="25" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        {/* e-ray (90°) */}
        <line x1="100" y1="45" x2="150" y2="45" stroke="#44ff44" strokeWidth="2" opacity="0.8" />
        {/* Labels */}
        <text x="130" y="21" fontSize="7" fill={theme === 'dark' ? '#ff4444' : '#dc2626'}>o-ray</text>
        <text x="130" y="57" fontSize="7" fill={theme === 'dark' ? '#44ff44' : '#16a34a'}>e-ray</text>
      </g>

      {/* 4. Interference - 干涉 */}
      <g transform="translate(620, 30)">
        <text x="80" y="-10" fontSize="10" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
          {isZh ? '4. 干涉' : '4. Interference'}
        </text>
        {/* Same phase - constructive */}
        <g>
          <path d="M 10,20 Q 20,10 30,20 T 50,20" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.8" />
          <path d="M 10,20 Q 20,10 30,20 T 50,20" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" transform="translate(0, 0)" />
          <text x="30" y="10" fontSize="7" fill={theme === 'dark' ? '#22d3ee' : '#0891b2'}>+</text>
        </g>
        {/* Opposite phase - destructive */}
        <g>
          <path d="M 10,50 Q 20,40 30,50 T 50,50" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
          <path d="M 10,50 Q 20,60 30,50 T 50,50" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4" />
          <line x1="60" y1="45" x2="70" y2="55" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} strokeWidth="2" />
          <line x1="60" y1="55" x2="70" y2="45" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} strokeWidth="2" />
          <text x="30" y="73" fontSize="7" fill={theme === 'dark' ? '#ef4444' : '#dc2626'}>−</text>
        </g>
      </g>

      {/* Arrow markers */}
      <defs>
        <marker id="arrow-h" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L6,3 z" fill="#ff4444" />
        </marker>
        <marker id="arrow-v" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,0 L3,6 z" fill="#44ff44" />
        </marker>
      </defs>
    </svg>
  )
}

// ============================================
// Main Principles Panel Component
// ============================================

export function PrinciplesPanel() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [isExpanded, setIsExpanded] = useState(false)

  const principles = [
    {
      icon: '⊥',
      titleEn: 'Orthogonality',
      titleZh: '正交性原理',
      descriptionEn: 'Light with perpendicular polarizations (90° apart) can coexist without interference.',
      descriptionZh: '偏振方向相差90°的光可以共存而不发生干涉。',
      color: '#22d3ee',
    },
    {
      icon: '∠',
      titleEn: "Malus's Law",
      titleZh: '马吕斯定律',
      formula: 'I = I₀ × cos²(θ)',
      descriptionEn: 'Intensity of polarized light through a filter depends on the angle θ between polarizations.',
      descriptionZh: '偏振光通过偏振片后的光强与入射光偏振方向和透光轴夹角θ的关系。',
      color: '#3b82f6',
    },
    {
      icon: '◇',
      titleEn: 'Birefringence',
      titleZh: '双折射',
      descriptionEn: 'Certain crystals (e.g., calcite) split light into ordinary ray (o-ray) and extraordinary ray (e-ray).',
      descriptionZh: '某些晶体（如方解石）将入射光分解为寻常光（o光，0°）和非寻常光（e光，90°）。',
      color: '#8b5cf6',
    },
    {
      icon: '∿',
      titleEn: 'Interference',
      titleZh: '干涉原理',
      formula: 'φ = 0: I↑ | φ = π: I↓',
      descriptionEn: 'Light waves in phase add intensity; waves out of phase cancel.',
      descriptionZh: '同相位（相位差为0）的光波叠加增强光强；反相位（相位差为π）的光波相互抵消。',
      color: '#f59e0b',
    },
  ]

  return (
    <div className={cn(
      'border-b transition-all duration-300',
      theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-gray-200'
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2.5 transition-colors',
          theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
        )}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          <h3 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '偏振光学第一性原理' : 'First Principles of Polarization Optics'}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
        ) : (
          <ChevronDown className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Visual Diagram */}
          <div className={cn(
            'rounded-xl overflow-hidden border',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <PrinciplesDiagram />
          </div>

          {/* Principle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {principles.map((principle, index) => (
              <PrincipleCard key={index} {...principle} />
            ))}
          </div>

          {/* Footer Note */}
          <p className={cn('text-xs text-center', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            {isZh
              ? '所有偏振光路设计都基于这四大原理。理解它们是掌握光学设计的关键。'
              : 'All polarization optical designs are based on these four principles. Understanding them is key to mastering optical design.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default PrinciplesPanel
