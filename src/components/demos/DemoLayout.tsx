/**
 * DemoLayout - 演示统一布局组件
 * 提供一致的、现代化的演示框架布局
 * 包含: 标题区、可视化区、控制面板、信息卡片等模块化布局
 */
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useDemoTheme } from './demoThemeColors'

// ── 演示标题区 ──
interface DemoHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  gradient?: 'cyan' | 'blue' | 'purple' | 'orange' | 'green' | 'pink'
}

const gradientMap = {
  cyan: 'from-cyan-400 via-blue-400 to-cyan-300',
  blue: 'from-blue-400 via-indigo-400 to-blue-300',
  purple: 'from-purple-400 via-pink-400 to-purple-300',
  orange: 'from-orange-400 via-amber-400 to-yellow-300',
  green: 'from-emerald-400 via-teal-400 to-cyan-300',
  pink: 'from-pink-400 via-rose-400 to-red-300',
}

const gradientMapLight = {
  cyan: 'from-cyan-600 via-blue-600 to-cyan-500',
  blue: 'from-blue-600 via-indigo-600 to-blue-500',
  purple: 'from-purple-600 via-pink-600 to-purple-500',
  orange: 'from-orange-600 via-amber-600 to-yellow-500',
  green: 'from-emerald-600 via-teal-600 to-cyan-500',
  pink: 'from-pink-600 via-rose-600 to-red-500',
}

export function DemoHeader({ title, subtitle, badge, gradient = 'cyan' }: DemoHeaderProps) {
  const dt = useDemoTheme()
  const grad = dt.isDark ? gradientMap[gradient] : gradientMapLight[gradient]

  return (
    <motion.div
      className="text-center mb-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="inline-flex items-center gap-3">
        <h2 className={cn(
          'text-xl sm:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
          grad
        )}>
          {title}
        </h2>
        {badge && (
          <span className={cn(
            'px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider',
            dt.isDark
              ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
              : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
          )}>
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className={cn('mt-1.5 text-sm', dt.mutedTextClass)}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

// ── 可视化面板 ──
interface VisualizationPanelProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'blue' | 'indigo' | 'dark'
  noPadding?: boolean
  aspectRatio?: string
}

export function VisualizationPanel({
  children,
  className,
  variant = 'default',
  noPadding = false,
  aspectRatio,
}: VisualizationPanelProps) {
  const dt = useDemoTheme()

  const variantClasses = {
    default: dt.svgContainerClass,
    blue: dt.svgContainerClassBlue,
    indigo: dt.isDark
      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border-indigo-500/20'
      : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 border-indigo-200/50',
    dark: dt.isDark
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-slate-900 border-slate-700/30'
      : 'bg-gradient-to-br from-gray-50 via-white to-slate-50 border-slate-200',
  }

  return (
    <motion.div
      className={cn(
        'rounded-2xl border overflow-hidden',
        'shadow-lg',
        dt.isDark ? 'shadow-black/20' : 'shadow-slate-200/60',
        variantClasses[variant],
        !noPadding && 'p-4 sm:p-5',
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      aria-live="polite"
    >
      {children}
    </motion.div>
  )
}

// ── 统计卡片 ──
interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  color?: 'cyan' | 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'red' | 'yellow'
  icon?: ReactNode
  className?: string
}

const statColorsDark: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-400/5', border: 'border-cyan-400/20' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20' },
  green: { text: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-emerald-400/20' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-400/5', border: 'border-orange-400/20' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/5', border: 'border-purple-400/20' },
  pink: { text: 'text-pink-400', bg: 'bg-pink-400/5', border: 'border-pink-400/20' },
  red: { text: 'text-red-400', bg: 'bg-red-400/5', border: 'border-red-400/20' },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-400/5', border: 'border-yellow-400/20' },
}

const statColorsLight: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  green: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  orange: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  pink: { text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  red: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
}

export function StatCard({ label, value, unit, color = 'cyan', icon, className }: StatCardProps) {
  const dt = useDemoTheme()
  const colors = dt.isDark ? (statColorsDark[color] || statColorsDark.cyan) : (statColorsLight[color] || statColorsLight.cyan)

  return (
    <div
      className={cn(
        'rounded-xl border p-3',
        colors.bg,
        colors.border,
        className
      )}
      role="status"
    >
      <div className={cn('text-[11px] font-medium mb-1', dt.mutedTextClass)}>
        {icon && <span className="mr-1.5">{icon}</span>}
        {label}
      </div>
      <div className={cn('font-mono text-lg font-bold', colors.text)}>
        {value}
        {unit && <span className="text-xs font-normal ml-0.5 opacity-70">{unit}</span>}
      </div>
    </div>
  )
}

// ── 图表面板 ──
interface ChartPanelProps {
  title: string
  children: ReactNode
  className?: string
  subtitle?: string
}

export function ChartPanel({ title, children, className, subtitle }: ChartPanelProps) {
  const dt = useDemoTheme()

  return (
    <div className={cn(
      'rounded-xl border p-3',
      dt.isDark
        ? 'bg-slate-800/30 border-slate-700/40'
        : 'bg-white/60 border-slate-200/60',
      className
    )}>
      <div className="flex items-baseline justify-between mb-2">
        <h4 className={cn('text-xs font-semibold', dt.isDark ? 'text-cyan-400' : 'text-cyan-600')}>
          {title}
        </h4>
        {subtitle && (
          <span className={cn('text-[10px]', dt.mutedTextClass)}>{subtitle}</span>
        )}
      </div>
      {children}
    </div>
  )
}

// ── 分割线 ──
export function DemoDivider({ className }: { className?: string }) {
  const dt = useDemoTheme()
  return (
    <div className={cn(
      'h-px w-full',
      dt.isDark ? 'bg-gradient-to-r from-transparent via-slate-700 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent',
      className
    )} />
  )
}

// ── 提示横幅 ──
interface TipBannerProps {
  children: ReactNode
  color?: 'cyan' | 'purple' | 'orange' | 'green'
  className?: string
}

const tipColorsDark: Record<string, string> = {
  cyan: 'bg-cyan-400/5 border-cyan-400/15 text-cyan-300',
  purple: 'bg-purple-400/5 border-purple-400/15 text-purple-300',
  orange: 'bg-orange-400/5 border-orange-400/15 text-orange-300',
  green: 'bg-emerald-400/5 border-emerald-400/15 text-emerald-300',
}

const tipColorsLight: Record<string, string> = {
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
}

export function TipBanner({ children, color = 'cyan', className }: TipBannerProps) {
  const dt = useDemoTheme()
  const colorClass = dt.isDark ? tipColorsDark[color] : tipColorsLight[color]

  return (
    <div className={cn(
      'rounded-lg border px-4 py-3 text-sm',
      colorClass,
      className
    )}>
      {children}
    </div>
  )
}

// ── 物理公式高亮框 ──
interface FormulaHighlightProps {
  formula: string
  description?: string
  className?: string
}

export function FormulaHighlight({ formula, description, className }: FormulaHighlightProps) {
  const dt = useDemoTheme()

  return (
    <div className={cn(
      'rounded-xl border p-4 text-center',
      dt.isDark
        ? 'bg-gradient-to-r from-cyan-900/10 via-blue-900/15 to-indigo-900/10 border-cyan-500/15'
        : 'bg-gradient-to-r from-cyan-50/80 via-blue-50/80 to-indigo-50/80 border-cyan-200/60',
      className
    )}>
      <div className={cn(
        'font-mono text-lg sm:text-xl font-bold',
        dt.isDark ? 'text-cyan-300' : 'text-cyan-700'
      )}>
        {formula}
      </div>
      {description && (
        <p className={cn('mt-1.5 text-xs', dt.mutedTextClass)}>
          {description}
        </p>
      )}
    </div>
  )
}

// ── 两栏主布局 ──
interface DemoMainLayoutProps {
  visualization: ReactNode
  controls: ReactNode
  className?: string
  /** Controls panel width: 'narrow' (w-72), 'normal' (w-80), 'wide' (w-96) */
  controlsWidth?: 'narrow' | 'normal' | 'wide'
}

export function DemoMainLayout({
  visualization,
  controls,
  className,
  controlsWidth = 'normal',
}: DemoMainLayoutProps) {
  const widthClasses = {
    narrow: 'lg:w-72',
    normal: 'lg:w-80',
    wide: 'lg:w-96',
  }

  return (
    <div className={cn('flex flex-col lg:flex-row gap-5', className)}>
      <div className="flex-1 min-w-0">{visualization}</div>
      <div className={cn('w-full', widthClasses[controlsWidth])}>
        {controls}
      </div>
    </div>
  )
}

// ── 知识卡片网格 ──
interface InfoGridProps {
  children: ReactNode
  columns?: 2 | 3
  className?: string
}

export function InfoGrid({ children, columns = 2, className }: InfoGridProps) {
  const colsClass = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  return (
    <motion.div
      className={cn('grid grid-cols-1 gap-4', colsClass, className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// ── SVG 通用滤镜定义 ──
export function SVGFilters() {
  return (
    <defs>
      <filter id="demo-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="demo-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="demo-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}
