/**
 * Footer Component - Site-wide footer with navigation links
 * 页脚组件 - 全站页脚导航（精简版，避免与主内容重复）
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Github, ExternalLink, Mail } from 'lucide-react'

interface FooterLink {
  labelKey: string
  labelZh: string
  path: string
  external?: boolean
  icon?: React.ReactNode
}

interface FooterSection {
  titleKey: string
  titleZh: string
  links: FooterLink[]
}

// 精简的页脚分类 - 避免与主页六大模块重复
const FOOTER_SECTIONS: FooterSection[] = [
  {
    // 课程与学习 - Course & Learning
    titleKey: 'Course',
    titleZh: '课程',
    links: [
      { labelKey: 'P-SRT Course', labelZh: 'P-SRT课程', path: '/course' },
      { labelKey: 'Learning Hub', labelZh: '学习中心', path: '/learn' },
      { labelKey: 'Interactive Demos', labelZh: '互动演示', path: '/demos' },
    ],
  },
  {
    // 工具 - Tools
    titleKey: 'Tools',
    titleZh: '工具',
    links: [
      { labelKey: 'Jones Calculator', labelZh: 'Jones计算器', path: '/calc/jones' },
      { labelKey: 'Stokes Calculator', labelZh: 'Stokes计算器', path: '/calc/stokes' },
      { labelKey: 'Poincaré Sphere', labelZh: '庞加莱球', path: '/calc/poincare' },
      { labelKey: 'Optical Bench', labelZh: '光学工作台', path: '/studio' },
    ],
  },
  {
    // 资源 - Resources
    titleKey: 'Resources',
    titleZh: '资源',
    links: [
      { labelKey: 'Hardware Guide', labelZh: '硬件指南', path: '/hardware' },
      { labelKey: 'Applications', labelZh: '应用案例', path: '/research/applications' },
      { labelKey: 'Merchandise', labelZh: '文创商品', path: '/merchandise' },
    ],
  },
  {
    // 关于与支持 - About & Support
    titleKey: 'About',
    titleZh: '关于',
    links: [
      { labelKey: 'Open Wisdom Lab', labelZh: '开悟工坊', path: 'https://openwisdom.cn', external: true },
      { labelKey: 'GitHub', labelZh: 'GitHub', path: 'https://github.com/openwisdomlab/polarisationcourse', external: true },
      { labelKey: 'Feedback', labelZh: '反馈建议', path: 'https://github.com/openwisdomlab/polarisationcourse/issues', external: true },
    ],
  },
]

export function Footer() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <footer
      className={cn(
        'border-t py-10 px-4 sm:px-6 lg:px-8',
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-800'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Navigation Grid - 4 columns on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.titleKey}>
              <h3
                className={cn(
                  'font-semibold mb-3 text-xs uppercase tracking-wider',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}
              >
                {isZh ? section.titleZh : section.titleKey}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'text-sm flex items-center gap-1.5 transition-colors',
                          theme === 'dark'
                            ? 'text-gray-500 hover:text-cyan-400'
                            : 'text-gray-600 hover:text-cyan-600'
                        )}
                      >
                        {isZh ? link.labelZh : link.labelKey}
                        {link.labelKey === 'GitHub' ? (
                          <Github className="w-3 h-3" />
                        ) : link.labelKey === 'Feedback' ? (
                          <Mail className="w-3 h-3" />
                        ) : (
                          <ExternalLink className="w-3 h-3" />
                        )}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className={cn(
                          'text-sm transition-colors',
                          theme === 'dark'
                            ? 'text-gray-500 hover:text-cyan-400'
                            : 'text-gray-600 hover:text-cyan-600'
                        )}
                      >
                        {isZh ? link.labelZh : link.labelKey}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className={cn(
            'pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3',
            theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
          )}
        >
          <div className="flex items-center gap-2">
            {/* Mini polarization icon */}
            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center',
                theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-600'
                )}
              />
            </div>
            <p
              className={cn(
                'text-sm font-medium',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              PolarCraft
            </p>
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')}>
              &copy; {new Date().getFullYear()} Open Wisdom Lab
            </span>
          </div>
          <p
            className={cn(
              'text-xs text-center sm:text-right',
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            )}
          >
            {isZh
              ? '基于真实偏振光物理的游戏化教育平台'
              : 'A gamified education platform based on real polarization physics'}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
