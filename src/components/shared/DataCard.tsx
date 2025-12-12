/**
 * Reusable Data Card Components
 * 可复用的数据卡片组件
 */

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { ChevronDown, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, className, onClick, hoverable = false }: CardProps) {
  const { theme } = useTheme()

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border p-4 transition-all',
        theme === 'dark'
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-white border-gray-200',
        hoverable && 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
        hoverable && (theme === 'dark' ? 'hover:border-cyan-500/50' : 'hover:border-cyan-400'),
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, badge, icon, className }: CardHeaderProps) {
  const { theme } = useTheme()

  return (
    <div className={cn('flex items-start gap-3', className)}>
      {icon && (
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        )}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            'font-semibold truncate',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className={cn(
            'text-sm mt-0.5',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('mt-3', className)}>
      {children}
    </div>
  )
}

interface ExpandableCardProps {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

export function ExpandableCard({
  title,
  subtitle,
  badge,
  icon,
  children,
  defaultExpanded = false,
  className
}: ExpandableCardProps) {
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Card className={className}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
            )}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                'font-semibold truncate',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className={cn(
                'text-sm mt-0.5',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn(
            'flex-shrink-0 transition-transform',
            expanded && 'rotate-180'
          )}>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </button>

      {expanded && (
        <div className={cn(
          'mt-4 pt-4 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          {children}
        </div>
      )}
    </Card>
  )
}

// Specification list component
interface SpecListProps {
  specs: Record<string, string | undefined>
  className?: string
}

export function SpecList({ specs, className }: SpecListProps) {
  const { theme } = useTheme()
  const entries = Object.entries(specs).filter(([_, v]) => v !== undefined)

  if (entries.length === 0) return null

  return (
    <dl className={cn('grid grid-cols-2 gap-x-4 gap-y-2 text-sm', className)}>
      {entries.map(([key, value]) => (
        <div key={key} className="col-span-1">
          <dt className={cn(
            'font-medium',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {key}
          </dt>
          <dd className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// Warning/Safety box
interface WarningBoxProps {
  children: React.ReactNode
  className?: string
}

export function WarningBox({ children, className }: WarningBoxProps) {
  return (
    <div className={cn(
      'flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700',
      className
    )}>
      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        {children}
      </p>
    </div>
  )
}

// Info box
interface InfoBoxProps {
  children: React.ReactNode
  className?: string
}

export function InfoBox({ children, className }: InfoBoxProps) {
  const { theme } = useTheme()

  return (
    <div className={cn(
      'flex items-start gap-2 p-3 rounded-lg',
      theme === 'dark' ? 'bg-cyan-900/20 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200',
      className
    )}>
      <Info className={cn(
        'w-5 h-5 flex-shrink-0',
        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
      )} />
      <p className={cn(
        'text-sm',
        theme === 'dark' ? 'text-cyan-200' : 'text-cyan-800'
      )}>
        {children}
      </p>
    </div>
  )
}

// Empty state
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const { theme } = useTheme()

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-4',
      className
    )}>
      {icon && (
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-4',
          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
        )}>
          {icon}
        </div>
      )}
      <h3 className={cn(
        'text-lg font-semibold mb-1',
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {title}
      </h3>
      {description && (
        <p className={cn(
          'text-sm max-w-sm',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}

// Grid container
interface CardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      {children}
    </div>
  )
}
