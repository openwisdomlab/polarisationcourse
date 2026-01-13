/**
 * CourseLayout - 课程内容层的布局组件
 * Course Content Layer Layout Component
 *
 * 提供统一的课程页面布局、导航和面包屑
 * Provides consistent course page layout, navigation and breadcrumbs
 */

import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { PersistentHeader } from '@/components/shared'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
} from 'lucide-react'
import { COURSE_LAYER_CONFIG } from '../meta/course.config'

// 面包屑项接口
interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// CourseLayout 属性接口
interface CourseLayoutProps {
  children: ReactNode
  // 页面标题
  title?: string
  // 页面副标题
  subtitle?: string
  // 面包屑导航
  breadcrumbs?: BreadcrumbItem[]
  // 返回按钮配置
  backLink?: {
    href: string
    label: string
  }
  // 是否显示顶部导航
  showNav?: boolean
  // 页面主色调
  accentColor?: string
  // 侧边栏内容
  sidebar?: ReactNode
  // 底部导航
  bottomNav?: {
    prev?: { href: string; label: string }
    next?: { href: string; label: string }
  }
}

export function CourseLayout({
  children,
  title,
  subtitle,
  breadcrumbs,
  backLink,
  showNav = true,
  accentColor = '#06B6D4',
  sidebar,
  bottomNav,
}: CourseLayoutProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const isDark = theme === 'dark'

  // 默认面包屑
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: t('common.home'), href: '/' },
    { label: t('worldCourse.shortTitle'), href: COURSE_LAYER_CONFIG.routePrefix },
  ]

  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* 固定顶部导航 */}
      {showNav && <PersistentHeader />}

      {/* 主内容区域 */}
      <div className={`${showNav ? 'pt-16' : ''}`}>
        {/* 面包屑导航 */}
        <nav
          className={`border-b ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white/50'} backdrop-blur-sm`}
          aria-label="Breadcrumb"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-12 gap-2">
              {/* 返回按钮 */}
              {backLink && (
                <button
                  onClick={() => navigate(backLink.href)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {backLink.label}
                </button>
              )}

              {/* 面包屑 */}
              <ol className="flex items-center gap-1.5 text-sm">
                {finalBreadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center gap-1.5">
                    {index > 0 && (
                      <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    )}
                    {item.current ? (
                      <span
                        className="font-medium"
                        style={{ color: accentColor }}
                      >
                        {item.label}
                      </span>
                    ) : item.href ? (
                      <Link
                        to={item.href}
                        className={`transition-colors ${
                          isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {index === 0 ? (
                          <Home className="w-4 h-4" />
                        ) : (
                          item.label
                        )}
                      </Link>
                    ) : (
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </nav>

        {/* 页面标题区域 */}
        {(title || subtitle) && (
          <div
            className="border-b"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              background: isDark
                ? `linear-gradient(135deg, ${accentColor}10 0%, transparent 50%)`
                : `linear-gradient(135deg, ${accentColor}08 0%, transparent 50%)`,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <BookOpen className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div>
                  {title && (
                    <h1
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 主内容 + 侧边栏 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {sidebar ? (
            <div className="flex gap-8">
              {/* 主内容 */}
              <main className="flex-1 min-w-0">{children}</main>
              {/* 侧边栏 */}
              <aside className="hidden lg:block w-80 flex-shrink-0">
                <div
                  className={`sticky top-24 rounded-xl p-4 ${
                    isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
                  }`}
                >
                  {sidebar}
                </div>
              </aside>
            </div>
          ) : (
            <main>{children}</main>
          )}
        </div>

        {/* 底部导航 */}
        {bottomNav && (bottomNav.prev || bottomNav.next) && (
          <div
            className={`border-t ${
              isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white/50'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                {bottomNav.prev ? (
                  <Link
                    to={bottomNav.prev.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isDark
                        ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs opacity-70">{t('common.previous')}</div>
                      <div className="font-medium">{bottomNav.prev.label}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {bottomNav.next && (
                  <Link
                    to={bottomNav.next.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: `${accentColor}20`,
                      color: accentColor,
                    }}
                  >
                    <div className="text-right">
                      <div className="text-xs opacity-70">{t('common.next')}</div>
                      <div className="font-medium">{bottomNav.next.label}</div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseLayout
