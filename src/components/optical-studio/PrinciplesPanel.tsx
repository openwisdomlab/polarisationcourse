/**
 * PrinciplesPanel - 偏振光学原理面板 (改进版)
 *
 * 双标签页设计:
 * 1. 第一性原理 (First Principles) - 四大光学公理
 * 2. 通用光路图 (General Optical Paths) - 常见光路配置指南
 *
 * 改进:
 * - 更紧凑的SVG图示
 * - 标签页切换节省垂直空间
 * - 悬停提示显示详细解释
 * - 响应式布局
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Lightbulb, Route, Info } from 'lucide-react'

// ============================================
// Types
// ============================================

type PanelTab = 'principles' | 'paths'

interface PrincipleCardProps {
  icon: string
  titleEn: string
  titleZh: string
  formula?: string
  descriptionEn: string
  descriptionZh: string
  tipEn: string
  tipZh: string
  color: string
}

// ============================================
// Compact Principle Card Component
// ============================================

function PrincipleCard({
  icon,
  titleEn,
  titleZh,
  formula,
  descriptionEn,
  descriptionZh,
  tipEn,
  tipZh,
  color,
}: PrincipleCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [showTip, setShowTip] = useState(false)

  return (
    <div
      className={cn(
        'rounded-lg border p-2 transition-all relative group',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      )}
    >
      <div className="flex items-center gap-2">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-lg"
          style={{
            backgroundColor: theme === 'dark' ? `${color}20` : `${color}15`,
            color: color,
          }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h4 className={cn('font-medium text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? titleZh : titleEn}
            </h4>
            <button
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              className={cn('p-0.5 rounded', theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}
            >
              <Info className="w-3 h-3" />
            </button>
          </div>
          {formula && (
            <div
              className={cn(
                'font-mono text-[10px] px-1.5 py-0.5 rounded inline-block mt-0.5',
                theme === 'dark' ? 'bg-slate-900 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
              )}
            >
              {formula}
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTip && (
        <div className={cn(
          'absolute z-20 left-0 right-0 top-full mt-1 p-2 rounded-lg border shadow-lg text-xs',
          theme === 'dark' ? 'bg-slate-800 border-slate-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
        )}>
          <p className="mb-1">{isZh ? descriptionZh : descriptionEn}</p>
          <p className={cn('text-[10px]', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
            💡 {isZh ? tipZh : tipEn}
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Compact Principles Diagram (SVG)
// ============================================

function CompactPrinciplesDiagram() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <svg viewBox="0 0 560 70" className="w-full max-w-2xl mx-auto">
      {/* Background */}
      <rect width="560" height="70" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} rx="6" />

      {/* 1. Orthogonality - 正交性 */}
      <g transform="translate(10, 10)">
        <text x="55" y="8" fontSize="8" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle" fontWeight="500">
          {isZh ? '正交性' : 'Orthogonality'}
        </text>
        {/* Horizontal light (red) */}
        <line x1="15" y1="35" x2="95" y2="35" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        {/* Vertical light (green) */}
        <line x1="55" y1="18" x2="55" y2="52" stroke="#44ff44" strokeWidth="2" opacity="0.8" />
        {/* Label */}
        <text x="55" y="62" fontSize="7" fill={theme === 'dark' ? '#64748b' : '#94a3b8'} textAnchor="middle">
          0° ⊥ 90°
        </text>
      </g>

      {/* Divider */}
      <line x1="130" y1="15" x2="130" y2="55" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} strokeWidth="1" />

      {/* 2. Malus's Law - 马吕斯定律 */}
      <g transform="translate(140, 10)">
        <text x="55" y="8" fontSize="8" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle" fontWeight="500">
          {isZh ? '马吕斯定律' : "Malus's Law"}
        </text>
        {/* Input light */}
        <line x1="10" y1="35" x2="40" y2="35" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        {/* Polarizer */}
        <rect x="40" y="25" width="4" height="20" fill="#64748b" opacity="0.7" rx="1" />
        {/* Output light (dimmer) */}
        <line x1="44" y1="35" x2="100" y2="35" stroke="#ffaa00" strokeWidth="1.5" opacity="0.5" />
        {/* Formula */}
        <text x="55" y="62" fontSize="7" fill={theme === 'dark' ? '#22d3ee' : '#0891b2'} textAnchor="middle" fontFamily="monospace">
          I=I₀cos²θ
        </text>
      </g>

      {/* Divider */}
      <line x1="260" y1="15" x2="260" y2="55" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} strokeWidth="1" />

      {/* 3. Birefringence - 双折射 */}
      <g transform="translate(270, 10)">
        <text x="55" y="8" fontSize="8" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle" fontWeight="500">
          {isZh ? '双折射' : 'Birefringence'}
        </text>
        {/* Input light */}
        <line x1="10" y1="35" x2="40" y2="35" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        {/* Crystal */}
        <polygon points="40,25 65,25 70,45 45,45" fill={theme === 'dark' ? '#475569' : '#cbd5e1'} opacity="0.7" />
        {/* o-ray */}
        <line x1="70" y1="30" x2="100" y2="30" stroke="#ff4444" strokeWidth="1.5" opacity="0.8" />
        {/* e-ray */}
        <line x1="70" y1="40" x2="100" y2="40" stroke="#44ff44" strokeWidth="1.5" opacity="0.8" />
        {/* Labels */}
        <text x="55" y="62" fontSize="7" fill={theme === 'dark' ? '#64748b' : '#94a3b8'} textAnchor="middle">
          o-ray / e-ray
        </text>
      </g>

      {/* Divider */}
      <line x1="390" y1="15" x2="390" y2="55" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} strokeWidth="1" />

      {/* 4. Interference - 干涉 */}
      <g transform="translate(400, 10)">
        <text x="75" y="8" fontSize="8" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle" fontWeight="500">
          {isZh ? '干涉' : 'Interference'}
        </text>
        {/* Constructive */}
        <path d="M 10,30 Q 25,20 40,30 T 70,30" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />
        <text x="40" y="24" fontSize="6" fill={theme === 'dark' ? '#22d3ee' : '#0891b2'}>+</text>
        <circle cx="85" cy="30" r="6" fill="#22d3ee" opacity="0.5" />
        {/* Destructive */}
        <path d="M 10,48 Q 25,38 40,48 T 70,48" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.8" />
        <path d="M 10,48 Q 25,58 40,48 T 70,48" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" strokeDasharray="2,2" />
        <text x="40" y="60" fontSize="6" fill={theme === 'dark' ? '#ef4444' : '#dc2626'}>−</text>
        <line x1="81" y1="44" x2="89" y2="52" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} strokeWidth="1.5" />
        <line x1="81" y1="52" x2="89" y2="44" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} strokeWidth="1.5" />
      </g>
    </svg>
  )
}

// ============================================
// General Optical Paths Diagram
// ============================================

function GeneralPathsDiagram() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-3">
      {/* Basic Path: Emitter → Polarizer → Sensor */}
      <div className={cn(
        'rounded-lg border p-3',
        theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')}>
            {isZh ? '基础' : 'Basic'}
          </span>
          <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? '偏振光生成与检测' : 'Polarized Light Generation & Detection'}
          </span>
        </div>
        <svg viewBox="0 0 400 50" className="w-full max-w-md">
          {/* Emitter */}
          <rect x="10" y="15" width="30" height="20" fill={theme === 'dark' ? '#fbbf24' : '#f59e0b'} rx="3" />
          <text x="25" y="45" fontSize="8" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
            {isZh ? '光源' : 'Emitter'}
          </text>
          {/* Arrow */}
          <line x1="45" y1="25" x2="120" y2="25" stroke="#ff4444" strokeWidth="2" />
          <polygon points="115,22 125,25 115,28" fill="#ff4444" />
          {/* Polarizer */}
          <rect x="130" y="10" width="8" height="30" fill={theme === 'dark' ? '#64748b' : '#475569'} rx="1" />
          <line x1="134" y1="12" x2="134" y2="38" stroke="#22d3ee" strokeWidth="2" />
          <text x="134" y="50" fontSize="8" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
            {isZh ? '偏振片' : 'Polarizer'}
          </text>
          {/* Arrow (polarized) */}
          <line x1="143" y1="25" x2="220" y2="25" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="215,22 225,25 215,28" fill="#22d3ee" />
          {/* Sensor */}
          <rect x="230" y="15" width="30" height="20" fill={theme === 'dark' ? '#10b981' : '#059669'} rx="3" />
          <text x="245" y="45" fontSize="8" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
            {isZh ? '探测器' : 'Sensor'}
          </text>
        </svg>
      </div>

      {/* Malus's Law Path: Emitter → Polarizer → Analyzer → Sensor */}
      <div className={cn(
        'rounded-lg border p-3',
        theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')}>
            {isZh ? '马吕斯' : 'Malus'}
          </span>
          <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? '双偏振片衰减' : 'Double Polarizer Attenuation'}
          </span>
        </div>
        <svg viewBox="0 0 500 50" className="w-full max-w-lg">
          {/* Emitter */}
          <rect x="10" y="15" width="25" height="20" fill={theme === 'dark' ? '#fbbf24' : '#f59e0b'} rx="3" />
          <text x="22" y="45" fontSize="7" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
            {isZh ? '光源' : 'Emitter'}
          </text>
          {/* Arrow */}
          <line x1="40" y1="25" x2="85" y2="25" stroke="#ff4444" strokeWidth="2" />
          {/* Polarizer 1 */}
          <rect x="90" y="10" width="6" height="30" fill={theme === 'dark' ? '#64748b' : '#475569'} rx="1" />
          <line x1="93" y1="12" x2="93" y2="38" stroke="#22d3ee" strokeWidth="2" />
          <text x="93" y="50" fontSize="7" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">P1 (0°)</text>
          {/* Arrow (polarized) */}
          <line x1="100" y1="25" x2="175" y2="25" stroke="#ff4444" strokeWidth="2" />
          {/* Polarizer 2 (analyzer) - rotated */}
          <g transform="translate(180, 25) rotate(45)">
            <rect x="-3" y="-15" width="6" height="30" fill={theme === 'dark' ? '#64748b' : '#475569'} rx="1" />
            <line x1="0" y1="-13" x2="0" y2="13" stroke="#3b82f6" strokeWidth="2" />
          </g>
          <text x="180" y="50" fontSize="7" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">P2 (θ)</text>
          {/* Arrow (attenuated) */}
          <line x1="195" y1="25" x2="270" y2="25" stroke="#ffaa00" strokeWidth="1.5" opacity="0.6" />
          {/* Sensor */}
          <rect x="275" y="15" width="25" height="20" fill={theme === 'dark' ? '#10b981' : '#059669'} rx="3" />
          <text x="287" y="45" fontSize="7" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
            {isZh ? '探测器' : 'Sensor'}
          </text>
          {/* Formula */}
          <text x="380" y="28" fontSize="9" fill={theme === 'dark' ? '#22d3ee' : '#0891b2'} fontFamily="monospace">
            I = I₀cos²θ
          </text>
        </svg>
      </div>

      {/* Birefringence Path: Emitter → Crystal → Two Sensors */}
      <div className={cn(
        'rounded-lg border p-3',
        theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700')}>
            {isZh ? '双折射' : 'Birefringent'}
          </span>
          <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? '晶体分束 (方解石/PBS)' : 'Crystal Beam Splitting (Calcite/PBS)'}
          </span>
        </div>
        <svg viewBox="0 0 450 70" className="w-full max-w-md">
          {/* Emitter */}
          <rect x="10" y="25" width="25" height="20" fill={theme === 'dark' ? '#fbbf24' : '#f59e0b'} rx="3" />
          <text x="22" y="55" fontSize="7" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
            {isZh ? '光源' : 'Emitter'}
          </text>
          {/* Arrow */}
          <line x1="40" y1="35" x2="95" y2="35" stroke="#ff4444" strokeWidth="2" />
          {/* Crystal */}
          <polygon points="100,15 130,15 140,55 110,55" fill={theme === 'dark' ? '#8b5cf6' : '#a78bfa'} opacity="0.6" />
          <text x="120" y="65" fontSize="7" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} textAnchor="middle">
            {isZh ? '晶体' : 'Crystal'}
          </text>
          {/* o-ray */}
          <line x1="140" y1="25" x2="220" y2="15" stroke="#ff4444" strokeWidth="2" />
          <text x="180" y="12" fontSize="6" fill="#ff4444">o-ray (0°)</text>
          {/* e-ray */}
          <line x1="140" y1="45" x2="220" y2="55" stroke="#44ff44" strokeWidth="2" />
          <text x="180" y="65" fontSize="6" fill="#44ff44">e-ray (90°)</text>
          {/* Sensor 1 */}
          <rect x="225" y="5" width="20" height="15" fill={theme === 'dark' ? '#10b981' : '#059669'} rx="2" />
          {/* Sensor 2 */}
          <rect x="225" y="50" width="20" height="15" fill={theme === 'dark' ? '#10b981' : '#059669'} rx="2" />
        </svg>
      </div>

      {/* Tips */}
      <div className={cn(
        'text-[10px] text-center',
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      )}>
        💡 {isZh
          ? '提示：根据实验需求选择合适的光路配置，从简单开始逐步添加元件'
          : 'Tip: Choose the right optical path for your experiment, start simple and add components gradually'}
      </div>
    </div>
  )
}

// ============================================
// Optical Path Card
// ============================================

interface PathCardProps {
  nameEn: string
  nameZh: string
  componentsEn: string
  componentsZh: string
  useEn: string
  useZh: string
  color: string
}

function PathCard({ nameEn, nameZh, componentsEn, componentsZh, useEn, useZh, color }: PathCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'rounded-lg border p-2',
      theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {isZh ? nameZh : nameEn}
        </span>
      </div>
      <p className={cn('text-[10px] mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
        {isZh ? componentsZh : componentsEn}
      </p>
      <p className={cn('text-[10px]', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
        → {isZh ? useZh : useEn}
      </p>
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

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<PanelTab>('principles')

  const principles = [
    {
      icon: '⊥',
      titleEn: 'Orthogonality',
      titleZh: '正交性',
      descriptionEn: 'Light with perpendicular polarizations (90° apart) can coexist without interference.',
      descriptionZh: '偏振方向相差90°的光可以共存而不发生干涉。',
      tipEn: 'Use orthogonal polarizations to separate light paths in interferometers.',
      tipZh: '利用正交偏振可以在干涉仪中分离光路。',
      color: '#22d3ee',
    },
    {
      icon: '∠',
      titleEn: "Malus's Law",
      titleZh: '马吕斯定律',
      formula: 'I = I₀cos²θ',
      descriptionEn: 'Intensity through a polarizer depends on the angle θ between light polarization and filter axis.',
      descriptionZh: '通过偏振片的光强取决于入射光偏振方向与透光轴夹角θ。',
      tipEn: '90° angle blocks all light; 45° passes 50% intensity.',
      tipZh: '90°夹角完全阻挡光；45°夹角透过50%光强。',
      color: '#3b82f6',
    },
    {
      icon: '◇',
      titleEn: 'Birefringence',
      titleZh: '双折射',
      descriptionEn: 'Crystals (e.g., calcite) split light into o-ray (0°) and e-ray (90°).',
      descriptionZh: '晶体（如方解石）将光分解为寻常光(o光)和非常光(e光)。',
      tipEn: 'Birefringent crystals are used in PBS and waveplates.',
      tipZh: '双折射晶体用于偏振分束器和波片。',
      color: '#8b5cf6',
    },
    {
      icon: '∿',
      titleEn: 'Interference',
      titleZh: '干涉',
      formula: 'φ=0: + | φ=π: −',
      descriptionEn: 'Same-phase light adds intensity; opposite-phase cancels.',
      descriptionZh: '同相位光叠加增强；反相位光相互抵消。',
      tipEn: 'Interference is key to understanding waveplate behavior.',
      tipZh: '理解干涉是掌握波片原理的关键。',
      color: '#f59e0b',
    },
  ]

  const commonPaths = [
    {
      nameEn: 'Polarization Analysis',
      nameZh: '偏振分析',
      componentsEn: 'Emitter → Polarizer → Analyzer → Sensor',
      componentsZh: '光源 → 偏振片 → 检偏器 → 探测器',
      useEn: 'Measure polarization state',
      useZh: '测量偏振态',
      color: '#22d3ee',
    },
    {
      nameEn: 'Beam Splitting',
      nameZh: '分束光路',
      componentsEn: 'Emitter → PBS/Calcite → Dual Sensors',
      componentsZh: '光源 → PBS/方解石 → 双探测器',
      useEn: 'Separate orthogonal polarizations',
      useZh: '分离正交偏振',
      color: '#8b5cf6',
    },
    {
      nameEn: 'Phase Retardation',
      nameZh: '相位延迟',
      componentsEn: 'Emitter → Polarizer → Waveplate → Analyzer → Sensor',
      componentsZh: '光源 → 偏振片 → 波片 → 检偏器 → 探测器',
      useEn: 'Create circular/elliptical polarization',
      useZh: '产生圆偏振/椭圆偏振',
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
          'w-full flex items-center justify-between px-4 py-2 transition-colors',
          theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
            <h3 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? '光学原理' : 'Optical Principles'}
            </h3>
          </div>
          {/* Inline tabs when expanded */}
          {isExpanded && (
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('principles')
                }}
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                  activeTab === 'principles'
                    ? theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-amber-100 text-amber-700'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <span className="flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  {isZh ? '第一性原理' : 'First Principles'}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('paths')
                }}
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                  activeTab === 'paths'
                    ? theme === 'dark'
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'bg-violet-100 text-violet-700'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <span className="flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  {isZh ? '通用光路图' : 'Optical Paths'}
                </span>
              </button>
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
        ) : (
          <ChevronDown className={cn('w-4 h-4', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-3">
          {activeTab === 'principles' ? (
            <div className="space-y-2">
              {/* Compact Visual Diagram */}
              <div className={cn(
                'rounded-lg overflow-hidden border',
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              )}>
                <CompactPrinciplesDiagram />
              </div>

              {/* Principle Cards - Horizontal on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {principles.map((principle, index) => (
                  <PrincipleCard key={index} {...principle} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* General Paths Diagram */}
              <GeneralPathsDiagram />

              {/* Quick Reference Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                {commonPaths.map((path, index) => (
                  <PathCard key={index} {...path} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PrinciplesPanel
