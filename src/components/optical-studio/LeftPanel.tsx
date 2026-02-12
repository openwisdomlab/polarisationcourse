/**
 * Left Panel Component - 左侧面板组件
 *
 * Redesigned panel combining:
 * - Mode tabs (Experiments / Design / Challenges / Tutorials)
 * - Component palette (in Design mode)
 * - Content lists for each mode
 * - Better visual hierarchy and spacing
 */

import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/shared'
import {
  Play, Eye, ChevronRight, ChevronLeft,
  FlaskConical, Wrench, Target, GraduationCap,
  CheckCircle2, Lightbulb, Search,
  Sun, Filter, Layers, Radio, BookOpen
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import {
  CLASSIC_EXPERIMENTS,
  CHALLENGES,
  TUTORIALS,
  PALETTE_COMPONENTS,
  DIFFICULTY_CONFIG,
} from '@/data'
import type { ClassicExperiment, Challenge, Tutorial } from '@/stores/opticalBenchStore'
import { PolarizationDevicesPanel } from './PolarizationDevicesPanel'

type PanelTab = 'experiments' | 'design' | 'challenges' | 'tutorials' | 'devices'

// ============================================
// Tab Button Component
// ============================================

interface TabButtonProps {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
  badge?: number
}

function TabButton({ active, icon, label, onClick, badge }: TabButtonProps) {
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all',
        active
          ? theme === 'dark'
            ? 'bg-violet-500/20 text-violet-400'
            : 'bg-violet-100 text-violet-700'
          : theme === 'dark'
            ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-800'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      )}
    >
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center rounded-full bg-violet-500 text-white text-[10px] font-bold">
            {badge}
          </span>
        )}
      </span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

// ============================================
// Experiment Card Component
// ============================================

interface ExperimentCardProps {
  experiment: ClassicExperiment
  onLoad: () => void
  isActive?: boolean
}

function ExperimentCard({ experiment, onLoad, isActive }: ExperimentCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]

  return (
    <div className={cn(
      'rounded-lg border p-2.5 transition-all cursor-pointer group',
      isActive
        ? theme === 'dark'
          ? 'bg-violet-500/10 border-violet-500/50'
          : 'bg-violet-50 border-violet-300'
        : theme === 'dark'
          ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
          : 'bg-white/50 border-gray-200 hover:border-gray-300'
    )}
    onClick={onLoad}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className={cn(
          'font-medium text-xs line-clamp-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? experiment.nameZh : experiment.nameEn}
        </h4>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <p className={cn(
        'text-[10px] mb-2 line-clamp-2',
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLoad()
          }}
          className={cn(
            'flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
            theme === 'dark'
              ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
          )}
        >
          <Play className="w-3 h-3" />
          {isZh ? '加载' : 'Load'}
        </button>
        {experiment.linkedDemo && (
          <Link
            to={`/demos?demo=${experiment.linkedDemo}` as string}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'p-1 rounded transition-colors',
              theme === 'dark' ? 'text-gray-500 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'
            )}
            title={isZh ? '查看演示' : 'View Demo'}
          >
            <Eye className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  )
}

// ============================================
// Challenge Card Component
// ============================================

interface ChallengeCardProps {
  challenge: Challenge
  onLoad: () => void
  isCompleted?: boolean
  isActive?: boolean
}

function ChallengeCard({ challenge, onLoad, isCompleted, isActive }: ChallengeCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[challenge.difficulty]

  return (
    <div className={cn(
      'rounded-lg border p-2.5 transition-all cursor-pointer',
      isCompleted
        ? theme === 'dark'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-emerald-50 border-emerald-200'
        : isActive
          ? theme === 'dark'
            ? 'bg-amber-500/10 border-amber-500/50'
            : 'bg-amber-50 border-amber-300'
          : theme === 'dark'
            ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
            : 'bg-white/50 border-gray-200 hover:border-gray-300'
    )}
    onClick={onLoad}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
          <h4 className={cn(
            'font-medium text-xs line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? challenge.nameZh : challenge.nameEn}
          </h4>
        </div>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <div className={cn(
        'p-1.5 rounded text-[10px] mb-2',
        theme === 'dark' ? 'bg-slate-800/50 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
      )}>
        <Target className="w-3 h-3 inline mr-1" />
        {isZh ? challenge.goal.zh : challenge.goal.en}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onLoad()
        }}
        className={cn(
          'w-full flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
          theme === 'dark'
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
        )}
      >
        <Target className="w-3 h-3" />
        {isZh ? '开始' : 'Start'}
      </button>
    </div>
  )
}

// ============================================
// Tutorial Card Component
// ============================================

interface TutorialCardProps {
  tutorial: Tutorial
  onStart: () => void
}

function TutorialCard({ tutorial, onStart }: TutorialCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'rounded-lg border p-2.5 transition-all cursor-pointer',
      theme === 'dark'
        ? 'bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50'
        : 'bg-white/50 border-gray-200 hover:border-cyan-300'
    )}
    onClick={onStart}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          'w-6 h-6 rounded flex items-center justify-center',
          theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
        )}>
          <GraduationCap className={cn('w-3.5 h-3.5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-medium text-xs line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? tutorial.nameZh : tutorial.nameEn}
          </h4>
          <p className={cn('text-[10px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            {tutorial.steps.length} {isZh ? '步骤' : 'steps'}
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onStart()
        }}
        className={cn(
          'w-full flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
          theme === 'dark'
            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
        )}
      >
        <GraduationCap className="w-3 h-3" />
        {isZh ? '开始教程' : 'Start'}
      </button>
    </div>
  )
}

// ============================================
// Component Category Config
// ============================================

interface ComponentCategory {
  id: string
  labelEn: string
  labelZh: string
  icon: React.ReactNode
  color: string
  components: string[]
}

const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    id: 'sources',
    labelEn: 'Light Sources',
    labelZh: '光源',
    icon: <Sun className="w-3.5 h-3.5" />,
    color: '#f59e0b',
    components: ['emitter'],
  },
  {
    id: 'filters',
    labelEn: 'Polarization Filters',
    labelZh: '偏振滤波',
    icon: <Filter className="w-3.5 h-3.5" />,
    color: '#3b82f6',
    components: ['polarizer', 'waveplate'],
  },
  {
    id: 'modifiers',
    labelEn: 'Beam Modifiers',
    labelZh: '光束调节',
    icon: <Layers className="w-3.5 h-3.5" />,
    color: '#8b5cf6',
    components: ['mirror', 'splitter', 'lens'],
  },
  {
    id: 'detectors',
    labelEn: 'Detectors',
    labelZh: '探测器',
    icon: <Radio className="w-3.5 h-3.5" />,
    color: '#10b981',
    components: ['sensor'],
  },
]

// ============================================
// Component Mini SVG Icons
// ============================================

function ComponentSVGIcon({ type, size = 32 }: { type: string; size?: number }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const icons: Record<string, React.ReactNode> = {
    emitter: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Light source body */}
        <rect x="4" y="12" width="12" height="16" rx="2" fill={isDark ? '#fbbf24' : '#f59e0b'} opacity="0.9" />
        {/* Light rays */}
        <line x1="18" y1="20" x2="36" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="3" strokeLinecap="round" />
        <line x1="18" y1="20" x2="30" y2="12" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="18" y1="20" x2="30" y2="28" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Polarization indicator */}
        <line x1="22" y1="16" x2="22" y2="24" stroke={isDark ? '#ff4444' : '#ef4444'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    polarizer: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Polarizer body */}
        <rect x="16" y="4" width="8" height="32" rx="2" fill={isDark ? '#3b82f6' : '#2563eb'} opacity="0.8" />
        {/* Transmission axis lines */}
        <line x1="20" y1="8" x2="20" y2="32" stroke={isDark ? '#93c5fd' : '#60a5fa'} strokeWidth="1.5" strokeDasharray="2,2" />
        {/* Input light */}
        <line x1="4" y1="20" x2="14" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" />
        {/* Output light (dimmer) */}
        <line x1="26" y1="20" x2="36" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* cos²θ indicator */}
        <text x="20" y="40" textAnchor="middle" fontSize="6" fill={isDark ? '#60a5fa' : '#3b82f6'}>cos²θ</text>
      </svg>
    ),
    waveplate: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Waveplate body */}
        <rect x="14" y="6" width="12" height="28" rx="2" fill={isDark ? '#8b5cf6' : '#7c3aed'} opacity="0.8" />
        {/* Crystal structure lines */}
        <line x1="17" y1="10" x2="23" y2="30" stroke={isDark ? '#c4b5fd' : '#a78bfa'} strokeWidth="1" />
        <line x1="23" y1="10" x2="17" y2="30" stroke={isDark ? '#c4b5fd' : '#a78bfa'} strokeWidth="1" />
        {/* Input wave */}
        <path d="M4,20 Q8,16 12,20" fill="none" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" />
        {/* Output wave (phase shifted) */}
        <path d="M28,20 Q32,24 36,20" fill="none" stroke={isDark ? '#a78bfa' : '#8b5cf6'} strokeWidth="2" />
        {/* λ/4 or λ/2 label */}
        <text x="20" y="22" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">λ/4</text>
      </svg>
    ),
    mirror: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Mirror surface */}
        <rect x="18" y="4" width="4" height="32" rx="1" fill={isDark ? '#94a3b8' : '#64748b'} />
        {/* Reflective coating */}
        <line x1="20" y1="6" x2="20" y2="34" stroke={isDark ? '#e2e8f0' : '#cbd5e1'} strokeWidth="2" />
        {/* Input ray */}
        <line x1="4" y1="8" x2="18" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" />
        {/* Output ray */}
        <line x1="22" y1="20" x2="36" y2="8" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" />
        {/* Angle indicator */}
        <path d="M14,16 A6,6 0 0 1 16,22" fill="none" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1" />
      </svg>
    ),
    splitter: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Crystal body */}
        <polygon points="12,8 28,8 32,32 8,32" fill={isDark ? '#8b5cf6' : '#7c3aed'} opacity="0.7" />
        {/* Input ray */}
        <line x1="2" y1="20" x2="12" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" />
        {/* o-ray (ordinary) */}
        <line x1="28" y1="16" x2="38" y2="12" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
        {/* e-ray (extraordinary) */}
        <line x1="28" y1="24" x2="38" y2="28" stroke="#44ff44" strokeWidth="2" strokeLinecap="round" />
        {/* Labels */}
        <text x="38" y="10" fontSize="6" fill="#ff4444">o</text>
        <text x="38" y="32" fontSize="6" fill="#44ff44">e</text>
      </svg>
    ),
    lens: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Lens shape */}
        <ellipse cx="20" cy="20" rx="6" ry="16" fill={isDark ? '#06b6d4' : '#0891b2'} opacity="0.6" />
        <ellipse cx="20" cy="20" rx="6" ry="16" fill="none" stroke={isDark ? '#22d3ee' : '#06b6d4'} strokeWidth="2" />
        {/* Input rays */}
        <line x1="2" y1="12" x2="14" y2="16" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="20" x2="14" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="28" x2="14" y2="24" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="1.5" strokeLinecap="round" />
        {/* Output rays (focused) */}
        <line x1="26" y1="16" x2="36" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="26" y1="20" x2="36" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="26" y1="24" x2="36" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="1.5" strokeLinecap="round" />
        {/* Focal point */}
        <circle cx="36" cy="20" r="2" fill={isDark ? '#f59e0b' : '#d97706'} />
      </svg>
    ),
    sensor: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Sensor body */}
        <rect x="22" y="8" width="14" height="24" rx="2" fill={isDark ? '#10b981' : '#059669'} opacity="0.8" />
        {/* Detection surface */}
        <rect x="22" y="12" width="3" height="16" fill={isDark ? '#34d399' : '#10b981'} />
        {/* Input light */}
        <line x1="4" y1="20" x2="20" y2="20" stroke={isDark ? '#fcd34d' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" />
        {/* Detection indicator */}
        <circle cx="32" cy="20" r="4" fill={isDark ? '#34d399' : '#10b981'} />
        <circle cx="32" cy="20" r="2" fill="white" opacity="0.8" />
        {/* Reading display */}
        <text x="32" y="36" textAnchor="middle" fontSize="5" fill={isDark ? '#10b981' : '#059669'}>I = ?</text>
      </svg>
    ),
  }

  return icons[type] || null
}

// ============================================
// Component Palette (Design Tab)
// ============================================

function ComponentPalette() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const addComponent = useOpticalBenchStore(state => state.addComponent)
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)

  // Component descriptions for hover
  const componentDescriptions: Record<string, { en: string; zh: string }> = {
    emitter: { en: 'Emits polarized or unpolarized light', zh: '发射偏振光或自然光' },
    polarizer: { en: 'Filters light by polarization (Malus\'s Law)', zh: '按偏振方向过滤光（马吕斯定律）' },
    waveplate: { en: 'Shifts phase (λ/4 or λ/2)', zh: '改变相位（λ/4或λ/2波片）' },
    mirror: { en: 'Reflects light beam', zh: '反射光束' },
    splitter: { en: 'Splits into o-ray and e-ray', zh: '分离为寻常光和非常光' },
    lens: { en: 'Focuses or diverges light', zh: '聚焦或发散光束' },
    sensor: { en: 'Measures light intensity', zh: '测量光强' },
  }

  return (
    <div className="space-y-3">
      {/* Header with tip */}
      <div className={cn(
        'flex items-center gap-2 p-2.5 rounded-xl',
        theme === 'dark'
          ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20'
          : 'bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200'
      )}>
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          theme === 'dark' ? 'bg-violet-500/20' : 'bg-violet-100'
        )}>
          <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-xs font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '光学组件库' : 'Optical Components'}
          </p>
          <p className={cn('text-[10px]', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            {isZh ? '点击或按 1-7 添加' : 'Click or press 1-7 to add'}
          </p>
        </div>
      </div>

      {/* Categorized Components */}
      {COMPONENT_CATEGORIES.map((category) => (
        <div key={category.id} className="space-y-1.5">
          {/* Category Header */}
          <div className="flex items-center gap-2 px-1">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.icon}
            </div>
            <span className={cn('text-[10px] font-semibold uppercase tracking-wide', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {isZh ? category.labelZh : category.labelEn}
            </span>
          </div>

          {/* Components Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {PALETTE_COMPONENTS.filter(c => category.components.includes(c.type)).map((item) => {
              const globalIndex = PALETTE_COMPONENTS.findIndex(p => p.type === item.type)
              const isHovered = hoveredComponent === item.type

              return (
                <button
                  key={item.type}
                  data-component={item.type}
                  onClick={() => addComponent(item.type)}
                  onMouseEnter={() => setHoveredComponent(item.type)}
                  onMouseLeave={() => setHoveredComponent(null)}
                  className={cn(
                    'relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200',
                    isHovered ? 'scale-[1.02] shadow-lg' : '',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50'
                      : 'bg-white border-gray-200 hover:border-violet-400'
                  )}
                  style={{
                    borderColor: isHovered ? category.color : undefined,
                    boxShadow: isHovered ? `0 0 12px ${category.color}30` : undefined,
                  }}
                >
                  {/* SVG Icon */}
                  <ComponentSVGIcon type={item.type} size={36} />

                  {/* Name */}
                  <span className={cn('text-[10px] font-medium text-center leading-tight', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                    {isZh ? item.nameZh : item.nameEn}
                  </span>

                  {/* Keyboard shortcut badge */}
                  <kbd className={cn(
                    'absolute top-1 right-1 text-[8px] px-1 py-0.5 rounded',
                    theme === 'dark' ? 'bg-slate-700/70 text-gray-500' : 'bg-gray-100 text-gray-400'
                  )}>
                    {globalIndex + 1}
                  </kbd>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Hovered Component Description */}
      {hoveredComponent && componentDescriptions[hoveredComponent] && (
        <div className={cn(
          'p-2 rounded-lg text-[10px] animate-in fade-in duration-150',
          theme === 'dark' ? 'bg-slate-800/50 text-gray-300' : 'bg-gray-50 text-gray-600'
        )}>
          <span className="font-medium">
            {isZh
              ? PALETTE_COMPONENTS.find(p => p.type === hoveredComponent)?.nameZh
              : PALETTE_COMPONENTS.find(p => p.type === hoveredComponent)?.nameEn
            }:
          </span>{' '}
          {isZh ? componentDescriptions[hoveredComponent].zh : componentDescriptions[hoveredComponent].en}
        </div>
      )}

      {/* Quick Reference Card */}
      <div className={cn(
        'p-2.5 rounded-xl border',
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50'
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
      )}>
        <div className="flex items-center gap-1.5 mb-2">
          <Search className={cn('w-3 h-3', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')} />
          <span className={cn('text-[10px] font-semibold', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            {isZh ? '快捷操作' : 'Quick Actions'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
          <div className={cn('flex items-center gap-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            <kbd className={cn('px-1 rounded', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>1-7</kbd>
            <span>{isZh ? '添加组件' : 'Add'}</span>
          </div>
          <div className={cn('flex items-center gap-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            <kbd className={cn('px-1 rounded', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>R</kbd>
            <span>{isZh ? '旋转' : 'Rotate'}</span>
          </div>
          <div className={cn('flex items-center gap-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            <kbd className={cn('px-1 rounded', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>Del</kbd>
            <span>{isZh ? '删除' : 'Delete'}</span>
          </div>
          <div className={cn('flex items-center gap-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            <kbd className={cn('px-1 rounded', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>Space</kbd>
            <span>{isZh ? '模拟' : 'Simulate'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Left Panel Component
// ============================================

interface LeftPanelProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function LeftPanel({ collapsed = false, onToggleCollapse }: LeftPanelProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [activeTab, setActiveTab] = useState<PanelTab>('design')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    loadExperiment,
    loadChallenge,
    startTutorial,
    currentExperiment,
    currentChallenge,
    challengeCompleted,
  } = useOpticalBenchStore()

  const tabs: { id: PanelTab; icon: React.ReactNode; labelEn: string; labelZh: string }[] = [
    { id: 'design', icon: <Wrench className="w-4 h-4" />, labelEn: 'Design', labelZh: '设计' },
    { id: 'devices', icon: <BookOpen className="w-4 h-4" />, labelEn: 'Devices', labelZh: '器件' },
    { id: 'experiments', icon: <FlaskConical className="w-4 h-4" />, labelEn: 'Experiments', labelZh: '实验' },
    { id: 'challenges', icon: <Target className="w-4 h-4" />, labelEn: 'Challenges', labelZh: '挑战' },
    { id: 'tutorials', icon: <GraduationCap className="w-4 h-4" />, labelEn: 'Tutorials', labelZh: '教程' },
  ]

  // Filter content based on search
  const filteredExperiments = CLASSIC_EXPERIMENTS.filter(exp =>
    searchQuery === '' ||
    exp.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.nameZh.includes(searchQuery)
  )

  const filteredChallenges = CHALLENGES.filter(ch =>
    searchQuery === '' ||
    ch.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.nameZh.includes(searchQuery)
  )

  return (
    <aside className={cn(
      'flex flex-col flex-shrink-0 border-r transition-all duration-300',
      collapsed ? 'w-14' : 'w-64',
      theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-gray-200'
    )}>
      {/* Collapse Toggle */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        {!collapsed && (
          <span className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '工具箱' : 'Toolbox'}
          </span>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Tab Selector */}
      {!collapsed && (
        <div className={cn(
          'flex items-stretch gap-1 p-2 border-b',
          theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
        )}>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              icon={tab.icon}
              label={isZh ? tab.labelZh : tab.labelEn}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      )}

      {/* Collapsed View - Show icons only */}
      {collapsed && (
        <div className="flex flex-col items-center gap-1 p-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                onToggleCollapse?.()
              }}
              className={cn(
                'p-2 rounded-lg transition-colors',
                activeTab === tab.id
                  ? theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
                  : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              )}
              title={isZh ? tab.labelZh : tab.labelEn}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      )}

      {/* Search (for experiments/challenges/devices) */}
      {!collapsed && (activeTab === 'experiments' || activeTab === 'challenges') && (
        <div className="p-2">
          <div className="relative">
            <Search className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )} />
            <input
              type="text"
              placeholder={isZh ? '搜索...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-7 pr-2 py-1.5 rounded-lg border text-xs',
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              )}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {activeTab === 'design' && <ComponentPalette />}

          {activeTab === 'devices' && (
            <div className="h-full -m-2">
              <PolarizationDevicesPanel compact />
            </div>
          )}

          {activeTab === 'experiments' && (
            <>
              {filteredExperiments.length === 0 ? (
                <p className={cn('text-xs text-center py-4', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                  {isZh ? '未找到实验' : 'No experiments found'}
                </p>
              ) : (
                filteredExperiments.map(exp => (
                  <ExperimentCard
                    key={exp.id}
                    experiment={exp}
                    onLoad={() => loadExperiment(exp)}
                    isActive={currentExperiment?.id === exp.id}
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'challenges' && (
            <>
              {filteredChallenges.length === 0 ? (
                <p className={cn('text-xs text-center py-4', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                  {isZh ? '未找到挑战' : 'No challenges found'}
                </p>
              ) : (
                filteredChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onLoad={() => loadChallenge(challenge)}
                    isCompleted={currentChallenge?.id === challenge.id && challengeCompleted}
                    isActive={currentChallenge?.id === challenge.id}
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'tutorials' && (
            TUTORIALS.map(tutorial => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                onStart={() => startTutorial(tutorial)}
              />
            ))
          )}
        </div>
      )}
    </aside>
  )
}

export default LeftPanel
