/**
 * Export Utilities Components
 * 导出工具组件（CSV导出、打印等）
 */

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { Download, Printer, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// CSV Export function
export function downloadCSV(content: string, filename: string) {
  const BOM = '\uFEFF' // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export Button Component
interface ExportButtonProps {
  onClick: () => void
  label?: string
  labelZh?: string
  className?: string
  variant?: 'primary' | 'secondary'
}

export function ExportButton({
  onClick,
  label = 'Export CSV',
  labelZh = '导出CSV',
  className,
  variant = 'secondary'
}: ExportButtonProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-cyan-500 text-white hover:bg-cyan-600'
          : theme === 'dark'
            ? 'bg-slate-700 text-gray-200 hover:bg-slate-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
    >
      <Download className="w-4 h-4" />
      {isZh ? labelZh : label}
    </button>
  )
}

// Print Button Component
interface PrintButtonProps {
  onClick?: () => void
  label?: string
  labelZh?: string
  className?: string
}

export function PrintButton({
  onClick,
  label = 'Print',
  labelZh = '打印',
  className
}: PrintButtonProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const handlePrint = () => {
    if (onClick) {
      onClick()
    } else {
      window.print()
    }
  }

  return (
    <button
      onClick={handlePrint}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        theme === 'dark'
          ? 'bg-slate-700 text-gray-200 hover:bg-slate-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
    >
      <Printer className="w-4 h-4" />
      {isZh ? labelZh : label}
    </button>
  )
}

// Copy Button Component (for code blocks, etc.)
interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-1.5 rounded transition-colors',
        theme === 'dark'
          ? 'hover:bg-slate-700 text-gray-400 hover:text-gray-200'
          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700',
        className
      )}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// Code Block with Copy
interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const { theme } = useTheme()

  return (
    <div className={cn(
      'relative rounded-lg overflow-hidden',
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-900',
      className
    )}>
      {language && (
        <div className="absolute top-2 left-3 text-xs text-gray-500">
          {language}
        </div>
      )}
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
      <pre className="p-4 pt-8 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono">
          {code}
        </code>
      </pre>
    </div>
  )
}

// Print-friendly wrapper
interface PrintableProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function Printable({ children, title, className }: PrintableProps) {
  return (
    <div className={cn('print:block', className)}>
      {title && (
        <h1 className="hidden print:block text-2xl font-bold mb-4 text-black">
          {title}
        </h1>
      )}
      <div className="print:text-black print:bg-white">
        {children}
      </div>
    </div>
  )
}

// Action bar with export/print buttons
interface ActionBarProps {
  children: React.ReactNode
  className?: string
}

export function ActionBar({ children, className }: ActionBarProps) {
  const { theme } = useTheme()

  return (
    <div className={cn(
      'flex flex-wrap items-center gap-3 p-3 rounded-lg print:hidden',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50',
      className
    )}>
      {children}
    </div>
  )
}
