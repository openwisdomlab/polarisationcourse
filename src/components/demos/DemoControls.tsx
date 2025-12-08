/**
 * DemoControls - 演示控制组件
 * 提供滑块、按钮等交互控件
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
}: SliderControlProps) {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-cyan-400 font-mono">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-cyan-400
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)]
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:bg-cyan-400
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0"
      />
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
}

export function Formula({ children, className }: FormulaProps) {
  return (
    <div
      className={cn(
        'font-mono text-cyan-400 bg-slate-900/50 px-4 py-2 rounded text-center',
        className
      )}
    >
      {children}
    </div>
  )
}
