/**
 * DemoControls - 演示控制组件 (Redesigned)
 * 提供滑块、按钮、预设等交互控件
 * 支持亮色/暗色主题，改进视觉效果和交互体验
 */
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

// ── 滑块控制器 ──
interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  formatValue?: (value: number) => string
  color?: 'cyan' | 'red' | 'green' | 'blue' | 'orange' | 'purple'
}

// Gradient fills for the slider track (inline style for cross-browser support)
const sliderTrackGradients: Record<string, string> = {
  cyan: 'linear-gradient(90deg, rgba(34,211,238,0.15), rgba(34,211,238,0.5))',
  red: 'linear-gradient(90deg, rgba(248,113,113,0.15), rgba(248,113,113,0.5))',
  green: 'linear-gradient(90deg, rgba(74,222,128,0.15), rgba(74,222,128,0.5))',
  blue: 'linear-gradient(90deg, rgba(96,165,250,0.15), rgba(96,165,250,0.5))',
  orange: 'linear-gradient(90deg, rgba(251,146,60,0.15), rgba(251,146,60,0.5))',
  purple: 'linear-gradient(90deg, rgba(192,132,252,0.15), rgba(192,132,252,0.5))',
}

const sliderTextColor: Record<string, { dark: string; light: string }> = {
  cyan: { dark: 'text-cyan-400', light: 'text-cyan-600' },
  red: { dark: 'text-red-400', light: 'text-red-600' },
  green: { dark: 'text-green-400', light: 'text-green-600' },
  blue: { dark: 'text-blue-400', light: 'text-blue-600' },
  orange: { dark: 'text-orange-400', light: 'text-orange-600' },
  purple: { dark: 'text-purple-400', light: 'text-purple-600' },
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  formatValue,
  color = 'cyan',
}: SliderControlProps) {
  const { theme } = useTheme()
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`
  const textColors = sliderTextColor[color] || sliderTextColor.cyan
  const textColorClass = theme === 'dark' ? textColors.dark : textColors.light

  const range = max - min
  const percentage = range > 0 ? Math.max(0, Math.min(100, ((value - min) / range) * 100)) : 0
  const trackGradient = sliderTrackGradients[color] || sliderTrackGradients.cyan

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{label}</span>
        <span className={cn('font-mono text-xs font-semibold tabular-nums', textColorClass)}>
          {displayValue}
        </span>
      </div>
      <div className="relative h-2">
        {/* Track background */}
        <div className={cn(
          'absolute inset-0 rounded-full',
          theme === 'dark' ? 'bg-slate-700/80' : 'bg-gray-200'
        )} />
        {/* Filled portion */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-75"
          style={{
            width: `${percentage}%`,
            background: trackGradient,
          }}
        />
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            'absolute inset-0 w-full h-2 rounded-full appearance-none cursor-pointer bg-transparent',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-[14px]',
            '[&::-webkit-slider-thumb]:h-[14px]',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-125',
            '[&::-webkit-slider-thumb]:active:scale-110',
            '[&::-moz-range-thumb]:w-[14px]',
            '[&::-moz-range-thumb]:h-[14px]',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer',
            color === 'cyan' && '[&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(34,211,238,0.6)] [&::-moz-range-thumb]:bg-cyan-400',
            color === 'red' && '[&::-webkit-slider-thumb]:bg-red-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(248,113,113,0.6)] [&::-moz-range-thumb]:bg-red-400',
            color === 'green' && '[&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(74,222,128,0.6)] [&::-moz-range-thumb]:bg-green-400',
            color === 'blue' && '[&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(96,165,250,0.6)] [&::-moz-range-thumb]:bg-blue-400',
            color === 'orange' && '[&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(251,146,60,0.6)] [&::-moz-range-thumb]:bg-orange-400',
            color === 'purple' && '[&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(192,132,252,0.6)] [&::-moz-range-thumb]:bg-purple-400'
          )}
        />
      </div>
    </div>
  )
}

// ── 预设按钮组 ──
interface PresetButtonsProps {
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (value: string | number) => void
  columns?: 2 | 3 | 4
}

export function PresetButtons({ options, value, onChange, columns = 2 }: PresetButtonsProps) {
  const { theme } = useTheme()
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={cn('grid gap-1.5', gridCols[columns])}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
            'border active:scale-[0.97]',
            value === option.value
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                : 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-300 shadow-sm'
              : theme === 'dark'
                ? 'bg-slate-800/40 text-gray-400 border-slate-600/40 hover:border-cyan-400/25 hover:text-gray-300'
                : 'bg-white/80 text-gray-500 border-gray-200 hover:border-cyan-300 hover:text-gray-700'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// ── 按钮组 ──
interface ButtonGroupProps {
  label: string
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (value: string | number) => void
}

export function ButtonGroup({ label, options, value, onChange }: ButtonGroupProps) {
  const { theme } = useTheme()
  return (
    <div className="space-y-1.5">
      <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              'border active:scale-[0.97]',
              value === option.value
                ? theme === 'dark'
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-400/40'
                  : 'bg-cyan-50 text-cyan-700 border-cyan-300'
                : theme === 'dark'
                  ? 'bg-slate-700/40 text-gray-400 border-slate-600/50 hover:border-cyan-400/25'
                  : 'bg-white/80 text-gray-600 border-gray-200 hover:border-cyan-300'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── 切换开关 ──
interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  const { theme } = useTheme()
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div
        className={cn(
          'w-9 h-5 rounded-full transition-all duration-200 relative',
          checked
            ? theme === 'dark'
              ? 'bg-cyan-500/30 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
              : 'bg-cyan-200'
            : theme === 'dark'
              ? 'bg-slate-700 group-hover:bg-slate-600'
              : 'bg-gray-200 group-hover:bg-gray-300'
        )}
        onClick={() => onChange(!checked)}
      >
        <div
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200',
            checked
              ? theme === 'dark'
                ? 'translate-x-[18px] bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                : 'translate-x-[18px] bg-cyan-500'
              : theme === 'dark'
                ? 'translate-x-0.5 bg-gray-500'
                : 'translate-x-0.5 bg-gray-400'
          )}
        />
      </div>
      <span className={cn(
        'text-sm transition-colors',
        theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
      )}>
        {label}
      </span>
    </label>
  )
}

// ── 信息面板 ──
interface InfoPanelProps {
  title: string
  children: ReactNode
  className?: string
}

export function InfoPanel({ title, children, className }: InfoPanelProps) {
  const { theme } = useTheme()
  return (
    <div className={cn(
      'rounded-xl p-4 border',
      theme === 'dark'
        ? 'bg-slate-800/40 border-slate-700/40'
        : 'bg-white/80 border-gray-200 shadow-sm',
      className
    )}>
      <h4 className={cn('text-sm font-semibold mb-2', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>{title}</h4>
      <div className={cn('text-sm leading-relaxed', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{children}</div>
    </div>
  )
}

// ── 数值显示 ──
interface ValueDisplayProps {
  label: string
  value: string | number
  unit?: string
  color?: string
}

export function ValueDisplay({ label, value, unit = '', color = 'cyan' }: ValueDisplayProps) {
  const { theme } = useTheme()
  const colorClassesDark: Record<string, string> = {
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
  }
  const colorClassesLight: Record<string, string> = {
    cyan: 'text-cyan-600',
    red: 'text-red-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
  }
  const colorClasses = theme === 'dark' ? colorClassesDark : colorClassesLight

  return (
    <div className="flex justify-between items-center py-1">
      <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{label}</span>
      <span className={cn('font-mono text-sm tabular-nums', colorClasses[color] || colorClasses.cyan)}>
        {value}
        {unit}
      </span>
    </div>
  )
}

// ── 控制面板容器 ──
interface ControlPanelProps {
  title?: string
  children: ReactNode
  className?: string
}

export function ControlPanel({ title, children, className }: ControlPanelProps) {
  const { theme } = useTheme()
  return (
    <div
      className={cn(
        'rounded-2xl p-4 border backdrop-blur-sm',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700/30 shadow-lg shadow-black/10'
          : 'bg-white/80 border-slate-200/70 shadow-sm',
        className
      )}
    >
      {title && (
        <h3 className={cn(
          'text-sm font-semibold mb-3 pb-2 border-b',
          theme === 'dark'
            ? 'text-gray-200 border-slate-700/50'
            : 'text-gray-700 border-gray-100'
        )}>
          {title}
        </h3>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  )
}

// ── 公式显示 ──
interface FormulaProps {
  children: ReactNode
  className?: string
  highlight?: boolean
}

export function Formula({ children, className, highlight = false }: FormulaProps) {
  const { theme } = useTheme()
  return (
    <div
      className={cn(
        'font-mono px-4 py-2.5 rounded-xl text-center transition-all',
        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700',
        highlight
          ? theme === 'dark'
            ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-400/20'
            : 'bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200'
          : theme === 'dark'
            ? 'bg-slate-900/40'
            : 'bg-gray-50',
        className
      )}
    >
      {children}
    </div>
  )
}

// ── 增强型信息卡片 ──
interface InfoCardProps {
  title: string
  icon?: ReactNode
  color?: 'cyan' | 'green' | 'purple' | 'orange' | 'blue'
  children: ReactNode
  className?: string
  expanded?: boolean
}

const infoCardColorsDark = {
  cyan: {
    border: 'border-cyan-400/20',
    bg: 'from-cyan-950/30 to-slate-900/60',
    title: 'text-cyan-400',
    icon: 'bg-cyan-400/15 text-cyan-400',
    headerBorder: 'border-cyan-900/30',
    accent: 'bg-cyan-400',
  },
  green: {
    border: 'border-emerald-400/20',
    bg: 'from-emerald-950/30 to-slate-900/60',
    title: 'text-emerald-400',
    icon: 'bg-emerald-400/15 text-emerald-400',
    headerBorder: 'border-emerald-900/30',
    accent: 'bg-emerald-400',
  },
  purple: {
    border: 'border-purple-400/20',
    bg: 'from-purple-950/30 to-slate-900/60',
    title: 'text-purple-400',
    icon: 'bg-purple-400/15 text-purple-400',
    headerBorder: 'border-purple-900/30',
    accent: 'bg-purple-400',
  },
  orange: {
    border: 'border-orange-400/20',
    bg: 'from-orange-950/30 to-slate-900/60',
    title: 'text-orange-400',
    icon: 'bg-orange-400/15 text-orange-400',
    headerBorder: 'border-orange-900/30',
    accent: 'bg-orange-400',
  },
  blue: {
    border: 'border-blue-400/20',
    bg: 'from-blue-950/30 to-slate-900/60',
    title: 'text-blue-400',
    icon: 'bg-blue-400/15 text-blue-400',
    headerBorder: 'border-blue-900/30',
    accent: 'bg-blue-400',
  },
}

const infoCardColorsLight = {
  cyan: {
    border: 'border-cyan-200/80',
    bg: 'from-cyan-50/80 to-white',
    title: 'text-cyan-700',
    icon: 'bg-cyan-100 text-cyan-600',
    headerBorder: 'border-cyan-100',
    accent: 'bg-cyan-500',
  },
  green: {
    border: 'border-emerald-200/80',
    bg: 'from-emerald-50/80 to-white',
    title: 'text-emerald-700',
    icon: 'bg-emerald-100 text-emerald-600',
    headerBorder: 'border-emerald-100',
    accent: 'bg-emerald-500',
  },
  purple: {
    border: 'border-purple-200/80',
    bg: 'from-purple-50/80 to-white',
    title: 'text-purple-700',
    icon: 'bg-purple-100 text-purple-600',
    headerBorder: 'border-purple-100',
    accent: 'bg-purple-500',
  },
  orange: {
    border: 'border-orange-200/80',
    bg: 'from-orange-50/80 to-white',
    title: 'text-orange-700',
    icon: 'bg-orange-100 text-orange-600',
    headerBorder: 'border-orange-100',
    accent: 'bg-orange-500',
  },
  blue: {
    border: 'border-blue-200/80',
    bg: 'from-blue-50/80 to-white',
    title: 'text-blue-700',
    icon: 'bg-blue-100 text-blue-600',
    headerBorder: 'border-blue-100',
    accent: 'bg-blue-500',
  },
}

export function InfoCard({
  title,
  icon,
  color = 'cyan',
  children,
  className,
}: InfoCardProps) {
  const { theme } = useTheme()
  const colorsDark = infoCardColorsDark[color] || infoCardColorsDark.cyan
  const colorsLight = infoCardColorsLight[color] || infoCardColorsLight.cyan
  const colors = theme === 'dark' ? colorsDark : colorsLight

  return (
    <div
      className={cn(
        'rounded-2xl border overflow-hidden',
        'bg-gradient-to-br',
        colors.border,
        colors.bg,
        className
      )}
    >
      {/* Accent top bar */}
      <div className={cn('h-0.5', colors.accent, 'opacity-60')} />
      <div className={cn('px-4 py-2.5 border-b flex items-center gap-2.5', colors.headerBorder)}>
        {icon && (
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', colors.icon)}>
            {icon}
          </div>
        )}
        <h4 className={cn('font-semibold text-sm', colors.title)}>{title}</h4>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ── 带图标的列表项 ──
interface ListItemProps {
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function ListItem({ icon, children, className }: ListItemProps) {
  const { theme } = useTheme()
  return (
    <div className={cn(
      'flex items-start gap-2.5 text-sm leading-relaxed',
      theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
      className
    )}>
      {icon && <span className={cn('mt-0.5 flex-shrink-0', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>{icon}</span>}
      <span>{children}</span>
    </div>
  )
}

// ── 简单图表 ──
interface SimpleDiagramProps {
  src?: string
  alt?: string
  children?: ReactNode
  className?: string
}

export function SimpleDiagram({ src, alt, children, className }: SimpleDiagramProps) {
  const { theme } = useTheme()
  return (
    <div
      className={cn(
        'rounded-xl p-3 border',
        'flex items-center justify-center min-h-[100px]',
        theme === 'dark'
          ? 'bg-slate-900/40 border-slate-700/40'
          : 'bg-gray-50 border-gray-200',
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="max-w-full max-h-[120px] object-contain" />
      ) : (
        children
      )}
    </div>
  )
}

// ── 实时数值显示（带动画效果）──
interface AnimatedValueProps {
  label: string
  value: number
  unit?: string
  decimals?: number
  color?: 'cyan' | 'red' | 'green' | 'blue' | 'orange' | 'purple'
  showBar?: boolean
  min?: number
  max?: number
}

export function AnimatedValue({
  label,
  value,
  unit = '',
  decimals = 2,
  color = 'cyan',
  showBar = false,
  min = 0,
  max = 1,
}: AnimatedValueProps) {
  const { theme } = useTheme()
  const colorClassesDark: Record<string, { text: string; bar: string }> = {
    cyan: { text: 'text-cyan-400', bar: 'bg-gradient-to-r from-cyan-500/60 to-cyan-400' },
    red: { text: 'text-red-400', bar: 'bg-gradient-to-r from-red-500/60 to-red-400' },
    green: { text: 'text-green-400', bar: 'bg-gradient-to-r from-green-500/60 to-green-400' },
    blue: { text: 'text-blue-400', bar: 'bg-gradient-to-r from-blue-500/60 to-blue-400' },
    orange: { text: 'text-orange-400', bar: 'bg-gradient-to-r from-orange-500/60 to-orange-400' },
    purple: { text: 'text-purple-400', bar: 'bg-gradient-to-r from-purple-500/60 to-purple-400' },
  }
  const colorClassesLight: Record<string, { text: string; bar: string }> = {
    cyan: { text: 'text-cyan-600', bar: 'bg-gradient-to-r from-cyan-400 to-cyan-500' },
    red: { text: 'text-red-600', bar: 'bg-gradient-to-r from-red-400 to-red-500' },
    green: { text: 'text-green-600', bar: 'bg-gradient-to-r from-green-400 to-green-500' },
    blue: { text: 'text-blue-600', bar: 'bg-gradient-to-r from-blue-400 to-blue-500' },
    orange: { text: 'text-orange-600', bar: 'bg-gradient-to-r from-orange-400 to-orange-500' },
    purple: { text: 'text-purple-600', bar: 'bg-gradient-to-r from-purple-400 to-purple-500' },
  }
  const colorClasses = theme === 'dark' ? colorClassesDark : colorClassesLight
  const colors = colorClasses[color] || colorClasses.cyan

  const range = max - min
  const percentage = range > 0 ? ((value - min) / range) * 100 : 0

  const displayValue = typeof value === 'number' && !isNaN(value) && isFinite(value)
    ? value.toFixed(decimals)
    : '0'

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{label}</span>
        <span className={cn('font-mono text-sm font-semibold tabular-nums', colors.text)}>
          {displayValue}
          {unit}
        </span>
      </div>
      {showBar && (
        <div className={cn(
          'h-1.5 rounded-full overflow-hidden',
          theme === 'dark' ? 'bg-slate-700/60' : 'bg-gray-200'
        )}>
          <div
            className={cn('h-full rounded-full transition-all duration-300', colors.bar)}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
      )}
    </div>
  )
}
