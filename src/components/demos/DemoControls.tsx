/**
 * DemoControls - 演示控制组件
 * 提供滑块、按钮、预设等交互控件
 */
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// 滑块控制器
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

const sliderColorClasses: Record<string, { track: string; thumb: string; glow: string }> = {
  cyan: {
    track: 'bg-cyan-400/30',
    thumb: 'bg-cyan-400',
    glow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
  },
  red: {
    track: 'bg-red-400/30',
    thumb: 'bg-red-400',
    glow: 'shadow-[0_0_10px_rgba(248,113,113,0.5)]',
  },
  green: {
    track: 'bg-green-400/30',
    thumb: 'bg-green-400',
    glow: 'shadow-[0_0_10px_rgba(74,222,128,0.5)]',
  },
  blue: {
    track: 'bg-blue-400/30',
    thumb: 'bg-blue-400',
    glow: 'shadow-[0_0_10px_rgba(96,165,250,0.5)]',
  },
  orange: {
    track: 'bg-orange-400/30',
    thumb: 'bg-orange-400',
    glow: 'shadow-[0_0_10px_rgba(251,146,60,0.5)]',
  },
  purple: {
    track: 'bg-purple-400/30',
    thumb: 'bg-purple-400',
    glow: 'shadow-[0_0_10px_rgba(192,132,252,0.5)]',
  },
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
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`
  const colors = sliderColorClasses[color] || sliderColorClasses.cyan
  const textColorClass = `text-${color}-400`

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className={cn('font-mono', textColorClass)}>{displayValue}</span>
      </div>
      <div className="relative">
        <div
          className={cn('absolute inset-0 h-2 rounded-lg', colors.track)}
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            'w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer relative',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-4',
            '[&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:border-0',
            color === 'cyan' && '[&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)] [&::-moz-range-thumb]:bg-cyan-400',
            color === 'red' && '[&::-webkit-slider-thumb]:bg-red-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(248,113,113,0.5)] [&::-moz-range-thumb]:bg-red-400',
            color === 'green' && '[&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(74,222,128,0.5)] [&::-moz-range-thumb]:bg-green-400',
            color === 'blue' && '[&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(96,165,250,0.5)] [&::-moz-range-thumb]:bg-blue-400',
            color === 'orange' && '[&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(251,146,60,0.5)] [&::-moz-range-thumb]:bg-orange-400',
            color === 'purple' && '[&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(192,132,252,0.5)] [&::-moz-range-thumb]:bg-purple-400'
          )}
        />
      </div>
    </div>
  )
}

// 预设按钮组 - 新增组件
interface PresetButtonsProps {
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (value: string | number) => void
  columns?: 2 | 3 | 4
}

export function PresetButtons({ options, value, onChange, columns = 2 }: PresetButtonsProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={cn('grid gap-2', gridCols[columns])}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
            'border hover:scale-[1.02] active:scale-[0.98]',
            value === option.value
              ? 'bg-gradient-to-r from-cyan-400/30 to-blue-400/30 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
              : 'bg-slate-800/50 text-gray-400 border-slate-600/50 hover:border-cyan-400/30 hover:text-gray-300'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// 按钮组
interface ButtonGroupProps {
  label: string
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (value: string | number) => void
}

export function ButtonGroup({ label, options, value, onChange }: ButtonGroupProps) {
  return (
    <div className="space-y-2">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm transition-all',
              value === option.value
                ? 'bg-cyan-400/30 text-cyan-400 border border-cyan-400/50'
                : 'bg-slate-700/50 text-gray-400 border border-slate-600 hover:border-cyan-400/30'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// 切换开关
interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={cn(
          'w-10 h-5 rounded-full transition-colors relative',
          checked ? 'bg-cyan-400/30' : 'bg-slate-700'
        )}
        onClick={() => onChange(!checked)}
      >
        <div
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full transition-transform',
            checked ? 'translate-x-5 bg-cyan-400' : 'translate-x-0.5 bg-gray-500'
          )}
        />
      </div>
      <span className="text-sm text-gray-400">{label}</span>
    </label>
  )
}

// 信息面板
interface InfoPanelProps {
  title: string
  children: ReactNode
  className?: string
}

export function InfoPanel({ title, children, className }: InfoPanelProps) {
  return (
    <div className={cn('bg-slate-800/50 rounded-lg p-4 border border-slate-700/50', className)}>
      <h4 className="text-sm font-semibold text-cyan-400 mb-2">{title}</h4>
      <div className="text-sm text-gray-400">{children}</div>
    </div>
  )
}

// 数值显示
interface ValueDisplayProps {
  label: string
  value: string | number
  unit?: string
  color?: string
}

export function ValueDisplay({ label, value, unit = '', color = 'cyan' }: ValueDisplayProps) {
  const colorClasses: Record<string, string> = {
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400',
  }

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={cn('font-mono text-sm', colorClasses[color] || 'text-cyan-400')}>
        {value}
        {unit}
      </span>
    </div>
  )
}

// 控制面板容器
interface ControlPanelProps {
  title?: string
  children: ReactNode
  className?: string
}

export function ControlPanel({ title, children, className }: ControlPanelProps) {
  return (
    <div
      className={cn(
        'bg-slate-800/70 rounded-xl p-5 border border-cyan-400/20 backdrop-blur-sm',
        className
      )}
    >
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// 公式显示
interface FormulaProps {
  children: string
  className?: string
  highlight?: boolean
}

export function Formula({ children, className, highlight = false }: FormulaProps) {
  return (
    <div
      className={cn(
        'font-mono text-cyan-400 px-4 py-3 rounded-lg text-center transition-all',
        highlight
          ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-400/30'
          : 'bg-slate-900/50',
        className
      )}
    >
      {children}
    </div>
  )
}

// 增强型信息卡片 - 用于展示物理原理、实验应用、前沿应用
interface InfoCardProps {
  title: string
  icon?: ReactNode
  color?: 'cyan' | 'green' | 'purple' | 'orange' | 'blue'
  children: ReactNode
  className?: string
  expanded?: boolean
}

const infoCardColors = {
  cyan: {
    border: 'border-cyan-400/30',
    bg: 'from-cyan-900/20 to-slate-900/50',
    title: 'text-cyan-400',
    icon: 'bg-cyan-400/20 text-cyan-400',
  },
  green: {
    border: 'border-green-400/30',
    bg: 'from-green-900/20 to-slate-900/50',
    title: 'text-green-400',
    icon: 'bg-green-400/20 text-green-400',
  },
  purple: {
    border: 'border-purple-400/30',
    bg: 'from-purple-900/20 to-slate-900/50',
    title: 'text-purple-400',
    icon: 'bg-purple-400/20 text-purple-400',
  },
  orange: {
    border: 'border-orange-400/30',
    bg: 'from-orange-900/20 to-slate-900/50',
    title: 'text-orange-400',
    icon: 'bg-orange-400/20 text-orange-400',
  },
  blue: {
    border: 'border-blue-400/30',
    bg: 'from-blue-900/20 to-slate-900/50',
    title: 'text-blue-400',
    icon: 'bg-blue-400/20 text-blue-400',
  },
}

export function InfoCard({
  title,
  icon,
  color = 'cyan',
  children,
  className,
}: InfoCardProps) {
  // 使用默认颜色作为回退，防止无效颜色值导致崩溃
  const colors = infoCardColors[color] || infoCardColors.cyan

  return (
    <div
      className={cn(
        'rounded-xl border backdrop-blur-sm overflow-hidden',
        'bg-gradient-to-br',
        colors.border,
        colors.bg,
        className
      )}
    >
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-3">
        {icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.icon)}>
            {icon}
          </div>
        )}
        <h4 className={cn('font-semibold text-sm', colors.title)}>{title}</h4>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// 带图标的列表项
interface ListItemProps {
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function ListItem({ icon, children, className }: ListItemProps) {
  return (
    <div className={cn('flex items-start gap-3 text-sm text-gray-300', className)}>
      {icon && <span className="text-cyan-400 mt-0.5 flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  )
}

// 简单图表 - 用于展示简单的示意图
interface SimpleDiagramProps {
  src?: string
  alt?: string
  children?: ReactNode
  className?: string
}

export function SimpleDiagram({ src, alt, children, className }: SimpleDiagramProps) {
  return (
    <div
      className={cn(
        'bg-slate-900/50 rounded-lg p-3 border border-slate-700/50',
        'flex items-center justify-center min-h-[100px]',
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

// 实时数值显示（带动画效果）
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
  const colorClasses: Record<string, { text: string; bar: string }> = {
    cyan: { text: 'text-cyan-400', bar: 'bg-cyan-400' },
    red: { text: 'text-red-400', bar: 'bg-red-400' },
    green: { text: 'text-green-400', bar: 'bg-green-400' },
    blue: { text: 'text-blue-400', bar: 'bg-blue-400' },
    orange: { text: 'text-orange-400', bar: 'bg-orange-400' },
    purple: { text: 'text-purple-400', bar: 'bg-purple-400' },
  }
  const colors = colorClasses[color] || colorClasses.cyan
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className={cn('font-mono text-sm font-semibold', colors.text)}>
          {value.toFixed(decimals)}
          {unit}
        </span>
      </div>
      {showBar && (
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-300', colors.bar)}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
      )}
    </div>
  )
}
