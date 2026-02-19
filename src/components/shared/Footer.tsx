/**
 * Footer Component - Site-wide footer with minimal navigation
 * 页脚组件 - 精简版页脚
 */

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Github, ExternalLink, Mail } from 'lucide-react'

// About section links
interface FooterLink {
  labelKey: string
  labelZh: string
  path: string
  external?: boolean
  icon?: 'github' | 'mail' | 'external'
}

const ABOUT_LINKS: FooterLink[] = [
  { labelKey: 'GitHub', labelZh: 'GitHub', path: 'https://github.com/openwisdomlab/polarisationcourse', external: true, icon: 'github' },
]

export function Footer() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'github': return <Github className="w-3 h-3" />
      case 'mail': return <Mail className="w-3 h-3" />
      case 'external': return <ExternalLink className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <footer
      className={cn(
        'border-t py-8 px-4 sm:px-6 lg:px-8',
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-800'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Bottom Bar */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-center justify-between gap-4'
          )}
        >
          {/* Left: Logo and Copyright */}
          <div className="flex items-center gap-4">
            <img
              src={theme === 'dark' ? '/images/combined-logo-white.png' : '/images/combined-logo.png'}
              alt="X-Institute & Open Wisdom Lab"
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <p
                className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}
              >
                PolarCraft &copy; 2026
              </p>
              <p
                className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}
              >
                supported by Open Wisdom Lab
              </p>
            </div>
          </div>

          {/* Right: About Links */}
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'text-xs font-medium uppercase tracking-wider',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              )}
            >
              {isZh ? '关于我们' : 'About'}
            </span>
            <div className="flex items-center gap-3">
              {ABOUT_LINKS.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-1 text-xs transition-colors',
                    theme === 'dark'
                      ? 'text-gray-500 hover:text-cyan-400'
                      : 'text-gray-600 hover:text-cyan-600'
                  )}
                >
                  {isZh ? link.labelZh : link.labelKey}
                  {getIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
