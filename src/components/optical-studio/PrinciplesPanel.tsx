/**
 * PrinciplesPanel - 偏振光学原理面板 (改进版 V4)
 *
 * 改进设计:
 * 1. 浮动式设计 - 不占用垂直空间
 * 2. 紧凑模式 - 最小化时显示4个原理图标
 * 3. 点击交互 - 触屏友好
 * 4. 键盘快捷键 - P键切换
 * 5. 上下文提示 - 根据选中器件显示相关原理
 * 6. 增强视觉设计 - 渐变背景、更好的卡片样式
 * 7. 动画效果 - 平滑过渡和悬停效果
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  Route,
  X,
  ChevronRight,
  ChevronLeft,
  Minimize2,
  Maximize2,
  Pin,
  PinOff,
  BookOpen,
  Sparkles,
  ExternalLink,
  GraduationCap,
} from 'lucide-react'

// ============================================
// Types
// ============================================

type PanelTab = 'principles' | 'paths'
type PanelMode = 'minimized' | 'compact' | 'expanded'

interface Principle {
  id: string
  icon: string
  titleEn: string
  titleZh: string
  formula?: string
  descriptionEn: string
  descriptionZh: string
  tipEn: string
  tipZh: string
  color: string
  relatedComponents: string[]
  linkedDemo?: string // Link to demos page
  courseUnit?: number // Related course unit
}

// ============================================
// Principle Data (Enhanced)
// ============================================

const PRINCIPLES: Principle[] = [
  {
    id: 'orthogonality',
    icon: '⊥',
    titleEn: 'Orthogonality',
    titleZh: '正交性',
    descriptionEn: 'Light with perpendicular polarizations (90° apart) can coexist without interference.',
    descriptionZh: '偏振方向相差90°的光可以共存而不发生干涉。',
    tipEn: 'Use orthogonal polarizations to separate light paths in interferometers.',
    tipZh: '利用正交偏振可以在干涉仪中分离光路。',
    color: '#22d3ee',
    relatedComponents: ['polarizer', 'splitter'],
    linkedDemo: 'polarization-types',
    courseUnit: 0,
  },
  {
    id: 'malus',
    icon: '∠',
    titleEn: "Malus's Law",
    titleZh: '马吕斯定律',
    formula: 'I = I₀cos²θ',
    descriptionEn: 'Intensity through a polarizer depends on the angle θ between light polarization and filter axis.',
    descriptionZh: '通过偏振片的光强取决于入射光偏振方向与透光轴夹角θ。',
    tipEn: '90° angle blocks all light; 45° passes 50% intensity.',
    tipZh: '90°夹角完全阻挡光；45°夹角透过50%光强。',
    color: '#3b82f6',
    relatedComponents: ['polarizer', 'emitter'],
    linkedDemo: 'malus-law',
    courseUnit: 1,
  },
  {
    id: 'birefringence',
    icon: '◇',
    titleEn: 'Birefringence',
    titleZh: '双折射',
    descriptionEn: 'Crystals (e.g., calcite) split light into o-ray (0°) and e-ray (90°).',
    descriptionZh: '晶体（如方解石）将光分解为寻常光(o光)和非常光(e光)。',
    tipEn: 'Birefringent crystals are used in PBS and waveplates.',
    tipZh: '双折射晶体用于偏振分束器和波片。',
    color: '#8b5cf6',
    relatedComponents: ['splitter', 'waveplate'],
    linkedDemo: 'birefringence',
    courseUnit: 1,
  },
  {
    id: 'interference',
    icon: '∿',
    titleEn: 'Interference',
    titleZh: '干涉',
    formula: 'φ=0: + | φ=π: −',
    descriptionEn: 'Same-phase light adds intensity; opposite-phase cancels.',
    descriptionZh: '同相位光叠加增强；反相位光相互抵消。',
    tipEn: 'Interference is key to understanding waveplate behavior.',
    tipZh: '理解干涉是掌握波片原理的关键。',
    color: '#f59e0b',
    relatedComponents: ['waveplate'],
    linkedDemo: 'waveplate',
    courseUnit: 1,
  },
]

// ============================================
// Enhanced Principle SVG Icons
// ============================================

function PrincipleSVGIcon({ principleId, size = 24 }: { principleId: string; size?: number }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const principle = PRINCIPLES.find(p => p.id === principleId)
  if (!principle) return null

  const icons: Record<string, React.ReactNode> = {
    orthogonality: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        {/* Horizontal line */}
        <line x1="4" y1="16" x2="28" y2="16" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" />
        {/* Vertical line */}
        <line x1="16" y1="4" x2="16" y2="28" stroke="#44ff44" strokeWidth="2.5" strokeLinecap="round" />
        {/* 90° indicator */}
        <rect x="16" y="16" width="5" height="5" fill="none" stroke={isDark ? '#fff' : '#333'} strokeWidth="1" />
      </svg>
    ),
    malus: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        {/* Input beam */}
        <line x1="2" y1="16" x2="12" y2="16" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
        {/* Polarizer */}
        <rect x="13" y="6" width="6" height="20" rx="1" fill={principle.color} opacity="0.7" />
        {/* Angle arc */}
        <path d="M16,16 L20,10" fill="none" stroke={isDark ? '#fff' : '#333'} strokeWidth="1.5" />
        <path d="M18,14 A3,3 0 0 1 17,16" fill="none" stroke={isDark ? '#fff' : '#333'} strokeWidth="1" />
        <text x="21" y="12" fontSize="5" fill={isDark ? '#fff' : '#333'}>θ</text>
        {/* Output beam (dimmer) */}
        <line x1="20" y1="16" x2="30" y2="16" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    birefringence: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        {/* Input beam */}
        <line x1="2" y1="16" x2="10" y2="16" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        {/* Crystal */}
        <polygon points="10,8 22,8 24,24 8,24" fill={principle.color} opacity="0.6" />
        {/* o-ray */}
        <line x1="22" y1="12" x2="30" y2="8" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
        {/* e-ray */}
        <line x1="22" y1="20" x2="30" y2="24" stroke="#44ff44" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    interference: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        {/* Wave 1 */}
        <path d="M2,12 Q8,6 14,12 T26,12" fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* Wave 2 */}
        <path d="M2,20 Q8,26 14,20 T26,20" fill="none" stroke="#f59e0b" strokeWidth="2" />
        {/* Constructive indicator */}
        <circle cx="28" cy="12" r="3" fill="#22d3ee" opacity="0.8" />
        {/* Destructive indicator */}
        <line x1="26" y1="18" x2="30" y2="22" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="26" y1="22" x2="30" y2="18" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    ),
  }

  return icons[principleId] || null
}

// ============================================
// Compact Principle Icon Button (Enhanced)
// ============================================

interface PrincipleIconProps {
  principle: Principle
  isActive: boolean
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
}

function PrincipleIcon({ principle, isActive, onClick, size = 'md' }: PrincipleIconProps) {
  const { theme } = useTheme()
  const sizeConfig = {
    sm: { wrapper: 'w-8 h-8', icon: 20 },
    md: { wrapper: 'w-10 h-10', icon: 24 },
    lg: { wrapper: 'w-12 h-12', icon: 28 },
  }
  const config = sizeConfig[size]

  return (
    <button
      onClick={onClick}
      className={cn(
        config.wrapper,
        'rounded-xl flex items-center justify-center transition-all duration-200',
        'hover:scale-105 active:scale-95',
        isActive && 'ring-2 ring-offset-2',
        theme === 'dark' ? 'ring-offset-slate-900' : 'ring-offset-white'
      )}
      style={{
        backgroundColor: isActive
          ? `${principle.color}25`
          : theme === 'dark' ? '#1e293b' : '#f1f5f9',
        boxShadow: isActive
          ? `0 0 16px ${principle.color}40, 0 0 0 2px ${principle.color}`
          : `0 2px 4px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      }}
      title={principle.titleEn}
    >
      <PrincipleSVGIcon principleId={principle.id} size={config.icon} />
    </button>
  )
}

// ============================================
// Principle Detail Card (Enhanced)
// ============================================

interface PrincipleDetailCardProps {
  principle: Principle
  onClose: () => void
}

function PrincipleDetailCard({ principle, onClose }: PrincipleDetailCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div
      className={cn(
        'rounded-2xl shadow-2xl w-80 overflow-hidden animate-in fade-in slide-in-from-left-3 duration-300',
        theme === 'dark'
          ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-700/50'
          : 'bg-white/95 backdrop-blur-xl border border-gray-200'
      )}
    >
      {/* Gradient Header */}
      <div
        className="p-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${principle.color}20 0%, ${principle.color}05 100%)`,
        }}
      >
        {/* Background decoration */}
        <div
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: principle.color }}
        />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: `${principle.color}30`,
                boxShadow: `0 4px 12px ${principle.color}30`,
              }}
            >
              <PrincipleSVGIcon principleId={principle.id} size={28} />
            </div>
            <div>
              <h4 className={cn('font-bold text-lg', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? principle.titleZh : principle.titleEn}
              </h4>
              {principle.formula && (
                <code
                  className={cn(
                    'text-sm px-2 py-0.5 rounded-md font-mono inline-block mt-1',
                    theme === 'dark'
                      ? 'bg-slate-800/80 text-cyan-400 border border-cyan-500/30'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  )}
                >
                  {principle.formula}
                </code>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-all hover:scale-105',
              theme === 'dark'
                ? 'hover:bg-slate-700/50 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Description */}
        <p className={cn('text-sm leading-relaxed', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
          {isZh ? principle.descriptionZh : principle.descriptionEn}
        </p>

        {/* Tip Card */}
        <div
          className={cn(
            'p-3 rounded-xl border',
            theme === 'dark'
              ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20'
              : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
          )}
        >
          <div className="flex items-start gap-2">
            <Sparkles className={cn('w-4 h-4 mt-0.5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
            <div>
              <span className={cn('text-[10px] font-semibold uppercase tracking-wide', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                {isZh ? '应用技巧' : 'Pro Tip'}
              </span>
              <p className={cn('text-xs mt-0.5', theme === 'dark' ? 'text-amber-200/80' : 'text-amber-800')}>
                {isZh ? principle.tipZh : principle.tipEn}
              </p>
            </div>
          </div>
        </div>

        {/* Mini Diagram */}
        <div className={cn(
          'rounded-xl p-3',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
        )}>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className={cn('w-3 h-3', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')} />
            <span className={cn('text-[10px] font-semibold uppercase tracking-wide', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
              {isZh ? '原理示意' : 'Diagram'}
            </span>
          </div>
          <PrincipleMiniDiagram principleId={principle.id} />
        </div>

        {/* Link to Course Demo */}
        {principle.linkedDemo && (
          <Link
            to={`/demos?demo=${principle.linkedDemo}` as string}
            className={cn(
              'flex items-center justify-between p-3 rounded-xl border transition-all group',
              theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-indigo-500/30 hover:border-indigo-400/50'
                : 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200 hover:border-indigo-300'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center',
                theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'
              )}>
                <GraduationCap className={cn('w-4 h-4', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')} />
              </div>
              <div>
                <span className={cn('text-xs font-medium block', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {isZh ? '深入学习' : 'Learn More'}
                </span>
                <span className={cn('text-[10px]', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  {isZh ? `课程单元 ${principle.courseUnit}` : `Course Unit ${principle.courseUnit}`}
                </span>
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-1 transition-transform group-hover:translate-x-1',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              <span className="text-[10px]">{isZh ? '查看演示' : 'View Demo'}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

// ============================================
// Principle Mini Diagrams (Enhanced)
// ============================================

function PrincipleMiniDiagram({ principleId }: { principleId: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const bgColor = isDark ? '#0f172a' : '#f8fafc'
  const textSecondary = isDark ? '#94a3b8' : '#64748b'

  const diagrams: Record<string, React.ReactNode> = {
    orthogonality: (
      <svg viewBox="0 0 240 80" className="w-full h-16">
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
        <rect width="240" height="80" fill={bgColor} rx="8" />
        {/* Horizontal polarization with glow */}
        <line x1="30" y1="40" x2="130" y2="40" stroke="url(#hGrad)" strokeWidth="3" strokeLinecap="round" />
        {/* Vertical polarization with glow */}
        <line x1="80" y1="10" x2="80" y2="70" stroke="url(#vGrad)" strokeWidth="3" strokeLinecap="round" />
        {/* 90° indicator box */}
        <rect x="80" y="40" width="12" height="12" fill="none" stroke={isDark ? '#fff' : '#333'} strokeWidth="1.5" rx="1" />
        {/* Labels with background */}
        <rect x="134" y="32" width="30" height="16" rx="4" fill={isDark ? '#1e293b' : '#e2e8f0'} />
        <text x="149" y="44" fontSize="10" fill="#ff4444" textAnchor="middle" fontWeight="600">0° H</text>
        <rect x="90" y="6" width="32" height="16" rx="4" fill={isDark ? '#1e293b' : '#e2e8f0'} />
        <text x="106" y="18" fontSize="10" fill="#44ff44" textAnchor="middle" fontWeight="600">90° V</text>
        {/* Description */}
        <text x="200" y="44" fontSize="9" fill={textSecondary} textAnchor="middle">
          {isDark ? '无干涉' : 'No interference'}
        </text>
      </svg>
    ),
    malus: (
      <svg viewBox="0 0 240 80" className="w-full h-16">
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="240" height="80" fill={bgColor} rx="8" />
        {/* Input light (strong) */}
        <line x1="10" y1="40" x2="70" y2="40" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />
        <circle cx="15" cy="40" r="6" fill="#fbbf24" opacity="0.6" />
        {/* Polarizer */}
        <rect x="75" y="15" width="10" height="50" fill={isDark ? '#3b82f6' : '#2563eb'} rx="2" opacity="0.8" />
        <line x1="80" y1="20" x2="80" y2="60" stroke={isDark ? '#93c5fd' : '#60a5fa'} strokeWidth="2" strokeDasharray="3,2" />
        {/* Angle arc */}
        <path d="M50,40 L60,32" fill="none" stroke={textSecondary} strokeWidth="1.5" />
        <path d="M54,36 A6,6 0 0 1 52,40" fill="none" stroke={textSecondary} strokeWidth="1" />
        <text x="62" y="28" fontSize="9" fill={textSecondary}>θ</text>
        {/* Output light (attenuated) */}
        <line x1="90" y1="40" x2="160" y2="40" stroke="url(#beamGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sensor */}
        <rect x="165" y="28" width="24" height="24" fill="#10b981" rx="4" opacity="0.8" />
        <circle cx="177" cy="40" r="6" fill="#34d399" />
        <circle cx="177" cy="40" r="3" fill="white" opacity="0.8" />
        {/* Formula */}
        <text x="210" y="68" fontSize="10" fill={isDark ? '#22d3ee' : '#0891b2'} textAnchor="middle" fontFamily="monospace" fontWeight="600">
          I = I₀cos²θ
        </text>
      </svg>
    ),
    birefringence: (
      <svg viewBox="0 0 240 80" className="w-full h-16">
        <rect width="240" height="80" fill={bgColor} rx="8" />
        {/* Input light */}
        <line x1="10" y1="40" x2="55" y2="40" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
        {/* Crystal with gradient */}
        <defs>
          <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <polygon points="60,18 100,18 110,62 50,62" fill="url(#crystalGrad)" opacity="0.7" />
        <polygon points="60,18 100,18 110,62 50,62" fill="none" stroke={isDark ? '#a78bfa' : '#8b5cf6'} strokeWidth="1.5" />
        {/* Crystal label */}
        <text x="80" y="44" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">Calcite</text>
        {/* o-ray (ordinary) */}
        <line x1="110" y1="30" x2="175" y2="18" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="180" cy="16" r="5" fill="#ff4444" opacity="0.3" />
        {/* e-ray (extraordinary) */}
        <line x1="110" y1="50" x2="175" y2="62" stroke="#44ff44" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="180" cy="64" r="5" fill="#44ff44" opacity="0.3" />
        {/* Labels */}
        <rect x="185" y="8" width="45" height="16" rx="4" fill={isDark ? '#1e293b' : '#e2e8f0'} />
        <text x="207" y="20" fontSize="9" fill="#ff4444" textAnchor="middle" fontWeight="600">o-ray 0°</text>
        <rect x="185" y="56" width="45" height="16" rx="4" fill={isDark ? '#1e293b' : '#e2e8f0'} />
        <text x="207" y="68" fontSize="9" fill="#44ff44" textAnchor="middle" fontWeight="600">e-ray 90°</text>
      </svg>
    ),
    interference: (
      <svg viewBox="0 0 240 80" className="w-full h-16">
        <rect width="240" height="80" fill={bgColor} rx="8" />
        {/* Constructive interference (top) */}
        <path d="M 15,25 Q 35,12 55,25 T 95,25 T 135,25" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.8" />
        <path d="M 15,25 Q 35,12 55,25 T 95,25 T 135,25" fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* Result - bright */}
        <circle cx="155" cy="25" r="10" fill="#22d3ee" opacity="0.4" />
        <circle cx="155" cy="25" r="6" fill="#22d3ee" opacity="0.7" />
        <circle cx="155" cy="25" r="3" fill="white" />
        <rect x="170" y="17" width="60" height="16" rx="4" fill={isDark ? '#164e63' : '#cffafe'} />
        <text x="200" y="29" fontSize="9" fill={isDark ? '#22d3ee' : '#0891b2'} textAnchor="middle" fontWeight="600">φ=0 ✓ Bright</text>
        {/* Destructive interference (bottom) */}
        <path d="M 15,55 Q 35,42 55,55 T 95,55" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <path d="M 25,55 Q 45,68 65,55 T 105,55" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" opacity="0.5" />
        {/* Result - dark */}
        <line x1="150" y1="50" x2="160" y2="60" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="2" />
        <line x1="150" y1="60" x2="160" y2="50" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="2" />
        <rect x="170" y="47" width="60" height="16" rx="4" fill={isDark ? '#451a03' : '#fef3c7'} />
        <text x="200" y="59" fontSize="9" fill={isDark ? '#f59e0b' : '#d97706'} textAnchor="middle" fontWeight="600">φ=π ✗ Dark</text>
      </svg>
    ),
  }

  return diagrams[principleId] || null
}

// ============================================
// Optical Path Templates
// ============================================

function OpticalPathsContent() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const paths = [
    {
      id: 'basic',
      nameEn: 'Basic',
      nameZh: '基础',
      descEn: 'Polarized Light Generation',
      descZh: '偏振光生成',
      color: '#10b981',
      components: ['emitter', 'polarizer', 'sensor'],
    },
    {
      id: 'malus',
      nameEn: 'Malus',
      nameZh: '马吕斯',
      descEn: 'Intensity Measurement',
      descZh: '强度测量',
      color: '#3b82f6',
      components: ['emitter', 'P1', 'P2(θ)', 'sensor'],
    },
    {
      id: 'birefringent',
      nameEn: 'Split',
      nameZh: '分束',
      descEn: 'Beam Splitting',
      descZh: '光束分离',
      color: '#8b5cf6',
      components: ['emitter', 'crystal', 'sensors×2'],
    },
  ]

  return (
    <div className="space-y-2">
      {paths.map((path) => (
        <div
          key={path.id}
          className={cn(
            'p-2 rounded-lg border transition-colors cursor-pointer',
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              : 'bg-white border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: path.color }}
            />
            <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? path.nameZh : path.nameEn}
            </span>
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
              {isZh ? path.descZh : path.descEn}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {path.components.map((comp, idx) => (
              <div key={idx} className="flex items-center">
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-mono',
                    theme === 'dark' ? 'bg-slate-900 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {comp}
                </span>
                {idx < path.components.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-400 mx-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={cn('text-[10px] text-center pt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
        💡 {isZh ? '点击光路模板快速搭建' : 'Click template to quickly build'}
      </div>
    </div>
  )
}

// ============================================
// Main Principles Panel Component
// ============================================

export function PrinciplesPanel() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [mode, setMode] = useState<PanelMode>('compact')
  const [activeTab, setActiveTab] = useState<PanelTab>('principles')
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null)
  const [isPinned, setIsPinned] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut: P to toggle panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setMode((prev) => {
          if (prev === 'minimized') return 'compact'
          if (prev === 'compact') return 'expanded'
          return 'minimized'
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Click outside to close when not pinned
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isPinned && mode === 'expanded' && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMode('compact')
        setSelectedPrinciple(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isPinned, mode])

  const handlePrincipleClick = useCallback((principle: Principle) => {
    if (selectedPrinciple?.id === principle.id) {
      setSelectedPrinciple(null)
    } else {
      setSelectedPrinciple(principle)
      setMode('expanded')
    }
  }, [selectedPrinciple])

  // Minimized mode: just a floating button with pulse effect
  if (mode === 'minimized') {
    return (
      <div className="fixed left-4 top-28 z-30">
        <button
          onClick={() => setMode('compact')}
          className={cn(
            'relative p-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95',
            'bg-gradient-to-br',
            theme === 'dark'
              ? 'from-amber-500/20 via-orange-500/15 to-amber-600/20 border border-amber-500/40 text-amber-400'
              : 'from-amber-50 via-orange-50 to-amber-100 border border-amber-300 text-amber-600'
          )}
          style={{
            boxShadow: theme === 'dark'
              ? '0 4px 20px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              : '0 4px 16px rgba(245, 158, 11, 0.15)',
          }}
          title={isZh ? '显示光学原理 (P)' : 'Show Optical Principles (P)'}
        >
          <Lightbulb className="w-5 h-5" />
          {/* Pulse indicator */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </button>
      </div>
    )
  }

  // Compact mode: floating bar with principle icons
  if (mode === 'compact') {
    return (
      <div
        ref={panelRef}
        className={cn(
          'fixed left-4 top-28 z-30 rounded-2xl shadow-2xl transition-all duration-300',
          theme === 'dark'
            ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-700/50'
            : 'bg-white/95 backdrop-blur-xl border border-gray-200'
        )}
        style={{
          boxShadow: theme === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)'
            : '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header with gradient */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-2.5 border-b rounded-t-2xl',
          theme === 'dark'
            ? 'border-slate-700/50 bg-gradient-to-r from-amber-500/10 to-transparent'
            : 'border-gray-200 bg-gradient-to-r from-amber-50 to-transparent'
        )}>
          <div className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center',
            theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
          )}>
            <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          </div>
          <div className="flex-1">
            <span className={cn('text-xs font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? '光学原理' : 'Optical Principles'}
            </span>
            <p className={cn('text-[9px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
              {isZh ? '点击展开详情' : 'Click for details'}
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setMode('expanded')}
              className={cn(
                'p-1.5 rounded-lg transition-all hover:scale-105',
                theme === 'dark' ? 'hover:bg-slate-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '展开' : 'Expand'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('minimized')}
              className={cn(
                'p-1.5 rounded-lg transition-all hover:scale-105',
                theme === 'dark' ? 'hover:bg-slate-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '最小化 (P)' : 'Minimize (P)'}
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Principle Icons with better spacing */}
        <div className="flex items-center gap-2 p-3">
          {PRINCIPLES.map((principle) => (
            <PrincipleIcon
              key={principle.id}
              principle={principle}
              isActive={selectedPrinciple?.id === principle.id}
              onClick={() => handlePrincipleClick(principle)}
              size="md"
            />
          ))}
        </div>

        {/* Expanded Principle Detail */}
        {selectedPrinciple && (
          <div className="absolute left-full top-0 ml-3">
            <PrincipleDetailCard
              principle={selectedPrinciple}
              onClose={() => setSelectedPrinciple(null)}
            />
          </div>
        )}

        {/* Keyboard hint with better styling */}
        <div className={cn(
          'flex items-center justify-between px-3 py-2 border-t rounded-b-2xl',
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-200'
        )}>
          <span className={cn('text-[9px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            <kbd className={cn(
              'px-1.5 py-0.5 rounded text-[9px] font-mono',
              theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-white text-gray-500 border border-gray-200'
            )}>P</kbd>
            {' '}{isZh ? '切换' : 'toggle'}
          </span>
          <span className={cn('text-[9px]', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')}>
            {isZh ? '4个核心定律' : '4 Core Laws'}
          </span>
        </div>
      </div>
    )
  }

  // Expanded mode: full panel with tabs
  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed left-4 top-28 z-30 rounded-2xl shadow-2xl transition-all duration-300 w-[340px] overflow-hidden',
        theme === 'dark'
          ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-700/50'
          : 'bg-white/95 backdrop-blur-xl border border-gray-200'
      )}
      style={{
        boxShadow: theme === 'dark'
          ? '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
          : '0 12px 40px rgba(0,0,0,0.12)',
      }}
    >
      {/* Header with gradient */}
      <div className={cn(
        'flex items-center justify-between px-4 py-3 border-b',
        theme === 'dark'
          ? 'border-slate-700/50 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent'
          : 'border-gray-200 bg-gradient-to-r from-amber-50 via-orange-50/50 to-transparent'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center shadow-lg',
            theme === 'dark'
              ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20'
              : 'bg-gradient-to-br from-amber-100 to-orange-100'
          )}>
            <Lightbulb className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          </div>
          <div>
            <span className={cn('text-sm font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? '光学原理' : 'Optical Principles'}
            </span>
            <p className={cn('text-[10px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
              {isZh ? '偏振光学四大定律' : 'Four Laws of Polarization'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={cn(
              'p-2 rounded-lg transition-all hover:scale-105',
              isPinned
                ? theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                : theme === 'dark' ? 'hover:bg-slate-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
            title={isPinned ? (isZh ? '取消固定' : 'Unpin') : (isZh ? '固定面板' : 'Pin panel')}
          >
            {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMode('compact')}
            className={cn(
              'p-2 rounded-lg transition-all hover:scale-105',
              theme === 'dark' ? 'hover:bg-slate-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
            title={isZh ? '收起' : 'Collapse'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs with better styling */}
      <div className={cn(
        'flex border-b',
        theme === 'dark' ? 'border-slate-700/50 bg-slate-800/30' : 'border-gray-200 bg-gray-50'
      )}>
        <button
          onClick={() => setActiveTab('principles')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-all relative',
            activeTab === 'principles'
              ? theme === 'dark'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-amber-600 bg-amber-50'
              : theme === 'dark'
                ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-700/30'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          )}
        >
          <Lightbulb className="w-4 h-4" />
          {isZh ? '第一性原理' : 'First Principles'}
          {activeTab === 'principles' && (
            <span className={cn(
              'absolute bottom-0 left-4 right-4 h-0.5 rounded-full',
              theme === 'dark' ? 'bg-amber-400' : 'bg-amber-500'
            )} />
          )}
        </button>
        <button
          onClick={() => setActiveTab('paths')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-all relative',
            activeTab === 'paths'
              ? theme === 'dark'
                ? 'text-violet-400 bg-violet-500/10'
                : 'text-violet-600 bg-violet-50'
              : theme === 'dark'
                ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-700/30'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          )}
        >
          <Route className="w-4 h-4" />
          {isZh ? '光路模板' : 'Path Templates'}
          {activeTab === 'paths' && (
            <span className={cn(
              'absolute bottom-0 left-4 right-4 h-0.5 rounded-full',
              theme === 'dark' ? 'bg-violet-400' : 'bg-violet-500'
            )} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[420px] overflow-y-auto">
        {activeTab === 'principles' ? (
          <div className="space-y-4">
            {/* Principle Grid - Enhanced Cards */}
            <div className="grid grid-cols-2 gap-3">
              {PRINCIPLES.map((principle) => {
                const isSelected = selectedPrinciple?.id === principle.id
                return (
                  <button
                    key={principle.id}
                    onClick={() => handlePrincipleClick(principle)}
                    className={cn(
                      'relative p-3 rounded-xl border text-left transition-all duration-200 group overflow-hidden',
                      isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]',
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    )}
                    style={{
                      boxShadow: isSelected
                        ? `0 0 0 2px ${principle.color}, 0 8px 24px ${principle.color}20`
                        : theme === 'dark'
                          ? '0 2px 8px rgba(0,0,0,0.2)'
                          : '0 2px 8px rgba(0,0,0,0.05)',
                      borderColor: isSelected ? principle.color : undefined,
                    }}
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background: `linear-gradient(135deg, ${principle.color}08 0%, transparent 60%)`,
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                          style={{
                            backgroundColor: `${principle.color}20`,
                          }}
                        >
                          <PrincipleSVGIcon principleId={principle.id} size={20} />
                        </div>
                        <span className={cn('text-xs font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                          {isZh ? principle.titleZh : principle.titleEn}
                        </span>
                      </div>
                      {principle.formula && (
                        <code className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-md font-mono inline-block',
                          theme === 'dark'
                            ? 'bg-slate-900/80 text-cyan-400 border border-cyan-500/20'
                            : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                        )}>
                          {principle.formula}
                        </code>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: principle.color }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Selected Principle Detail - Enhanced */}
            {selectedPrinciple && (
              <div
                className={cn(
                  'rounded-xl border overflow-hidden',
                  theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-200'
                )}
              >
                {/* Detail Header */}
                <div
                  className="px-4 py-3"
                  style={{
                    background: `linear-gradient(135deg, ${selectedPrinciple.color}15 0%, transparent 100%)`,
                  }}
                >
                  <h5 className={cn('text-sm font-semibold mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    {isZh ? selectedPrinciple.titleZh : selectedPrinciple.titleEn}
                  </h5>
                  <p className={cn('text-xs leading-relaxed', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                    {isZh ? selectedPrinciple.descriptionZh : selectedPrinciple.descriptionEn}
                  </p>
                </div>

                {/* Tip Section */}
                <div className={cn(
                  'mx-3 mb-3 p-3 rounded-lg border',
                  theme === 'dark'
                    ? 'bg-amber-500/10 border-amber-500/20'
                    : 'bg-amber-50 border-amber-200'
                )}>
                  <div className="flex items-start gap-2">
                    <Sparkles className={cn('w-4 h-4 mt-0.5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                    <p className={cn('text-xs', theme === 'dark' ? 'text-amber-200' : 'text-amber-800')}>
                      {isZh ? selectedPrinciple.tipZh : selectedPrinciple.tipEn}
                    </p>
                  </div>
                </div>

                {/* Diagram */}
                <div className="px-3 pb-3">
                  <PrincipleMiniDiagram principleId={selectedPrinciple.id} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <OpticalPathsContent />
        )}
      </div>

      {/* Footer */}
      <div className={cn(
        'px-3 py-2 border-t text-[10px] flex items-center justify-between',
        theme === 'dark' ? 'border-slate-700 text-gray-500' : 'border-gray-200 text-gray-400'
      )}>
        <span>
          <kbd className={cn('px-1 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}>P</kbd>
          {' '}{isZh ? '切换模式' : 'toggle'}
        </span>
        {isPinned && (
          <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>
            📌 {isZh ? '已固定' : 'Pinned'}
          </span>
        )}
      </div>
    </div>
  )
}

export default PrinciplesPanel
