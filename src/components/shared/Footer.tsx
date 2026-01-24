/**
 * Footer Component - Site-wide footer with navigation links
 * 页脚组件 - 全站页脚导航
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Github, ExternalLink } from 'lucide-react'

interface FooterLink {
  labelKey: string
  labelZh: string
  path: string
  external?: boolean
}

interface FooterSection {
  titleKey: string
  titleZh: string
  links: FooterLink[]
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    // 6 Core Modules - 六大核心模块
    titleKey: 'Modules',
    titleZh: '核心模块',
    links: [
      { labelKey: 'Chronicles', labelZh: '光的编年史', path: '/chronicles' },
      { labelKey: 'Optical Studio', labelZh: '光学设计室', path: '/studio' },
      { labelKey: 'Demo Gallery', labelZh: '偏振演示馆', path: '/demos' },
      { labelKey: 'PolarQuest', labelZh: '偏振光探秘', path: '/games' },
      { labelKey: 'Gallery', labelZh: '偏振造物局', path: '/gallery' },
      { labelKey: 'Research Lab', labelZh: '虚拟课题组', path: '/research' },
    ],
  },
  {
    // Course System - 课程体系
    titleKey: 'Course',
    titleZh: '课程',
    links: [
      { labelKey: 'P-SRT Course', labelZh: 'P-SRT课程', path: '/course' },
      { labelKey: 'Learning Hub', labelZh: '学习中心', path: '/learn' },
    ],
  },
  {
    // Tools - 工具
    titleKey: 'Tools',
    titleZh: '工具',
    links: [
      { labelKey: 'Calculators', labelZh: '计算工坊', path: '/calc' },
      { labelKey: 'Hardware Guide', labelZh: '硬件器件', path: '/hardware' },
      { labelKey: 'Merchandise', labelZh: '文创商品', path: '/merchandise' },
    ],
  },
  {
    // Games - 游戏快捷入口
    titleKey: 'Games',
    titleZh: '游戏',
    links: [
      { labelKey: '2D Puzzles', labelZh: '2D 解谜', path: '/games/2d' },
      { labelKey: '3D Voxel', labelZh: '3D 体素', path: '/games/3d' },
      { labelKey: 'Card Game', labelZh: '卡牌对战', path: '/games/card' },
      { labelKey: 'Escape Room', labelZh: '密室逃脱', path: '/games/escape' },
    ],
  },
  {
    // About - 关于
    titleKey: 'About',
    titleZh: '关于',
    links: [
      { labelKey: 'Open Wisdom Lab', labelZh: '开悟工坊', path: 'https://openwisdom.cn', external: true },
      { labelKey: 'GitHub', labelZh: 'GitHub', path: 'https://github.com/openwisdomlab/polarisationcourse', external: true },
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
        'border-t py-12 px-4 sm:px-6 lg:px-8',
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-800'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.titleKey}>
              <h3
                className={cn(
                  'font-semibold mb-3 text-sm',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
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
                          'text-sm flex items-center gap-1 transition-colors',
                          theme === 'dark'
                            ? 'text-gray-500 hover:text-gray-300'
                            : 'text-gray-600 hover:text-gray-900'
                        )}
                      >
                        {isZh ? link.labelZh : link.labelKey}
                        {link.labelKey === 'GitHub' ? (
                          <Github className="w-3 h-3" />
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
                            ? 'text-gray-500 hover:text-gray-300'
                            : 'text-gray-600 hover:text-gray-900'
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
            'pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4',
            theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
          )}
        >
          <p
            className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}
          >
            PolarCraft &copy; {new Date().getFullYear()} Open Wisdom Lab
          </p>
          <p
            className={cn(
              'text-xs',
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
