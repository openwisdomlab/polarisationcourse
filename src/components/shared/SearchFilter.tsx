/**
 * Reusable Search and Filter Components
 * 可复用的搜索和筛选组件
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || (i18n.language === 'zh' ? '搜索...' : 'Search...')}
        className={cn(
          'w-full pl-10 pr-8 py-2 rounded-lg border transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

interface FilterOption {
  value: string
  label: string
  labelZh: string
}

interface FilterSelectProps {
  label: string
  labelZh: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  className?: string
}

export function FilterSelect({ label, labelZh, value, options, onChange, className }: FilterSelectProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label className={cn(
        'text-sm font-medium whitespace-nowrap',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        {isZh ? labelZh : label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'appearance-none pl-3 pr-8 py-1.5 rounded-md border text-sm cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          )}
        >
          <option value="">{isZh ? '全部' : 'All'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {isZh ? opt.labelZh : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

interface ToggleFilterProps {
  label: string
  labelZh: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function ToggleFilter({ label, labelZh, checked, onChange, className }: ToggleFilterProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className={cn(
        'w-9 h-5 rounded-full transition-colors relative',
        checked
          ? 'bg-cyan-500'
          : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
      )}>
        <div className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform',
          checked && 'translate-x-4'
        )} />
      </div>
      <span className={cn(
        'text-sm',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        {isZh ? labelZh : label}
      </span>
    </label>
  )
}

interface FilterBarProps {
  children: React.ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  const { theme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn(
      'rounded-lg border p-3',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200',
      className
    )}>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'md:hidden flex items-center gap-2 text-sm font-medium w-full',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform', isExpanded && 'rotate-180')} />
      </button>

      {/* Filters content */}
      <div className={cn(
        'flex flex-wrap gap-3 items-center',
        'md:flex',
        isExpanded ? 'flex mt-3' : 'hidden'
      )}>
        {children}
      </div>
    </div>
  )
}

// Reusable badge component
interface BadgeProps {
  children: React.ReactNode
  color?: 'gray' | 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'purple' | 'cyan' | 'pink'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, color = 'gray', size = 'sm', className }: BadgeProps) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      colors[color],
      sizes[size],
      className
    )}>
      {children}
    </span>
  )
}

// Tabs component
interface Tab {
  id: string
  label: string
  labelZh: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'flex gap-1 p-1 rounded-lg overflow-x-auto',
      theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100',
      className
    )}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? theme === 'dark'
                ? 'bg-slate-700 text-white'
                : 'bg-white text-gray-900 shadow-sm'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {tab.icon}
          {isZh ? tab.labelZh : tab.label}
        </button>
      ))}
    </div>
  )
}
