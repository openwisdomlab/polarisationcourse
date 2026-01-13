/**
 * HomePage - 光的编年史首页
 * 首页 = 光的编年史，整合所有内容的入口
 *
 * 架构：
 * 1. 课程介绍（零一学院）
 * 2. 知识棱镜（光学全景图）
 * 3. 双轨时间线（光学史 + 偏振专题）
 * 4. 课程大纲（5个单元）
 * 5. 快捷导航（所有模块入口）
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Calculator,
  Compass,
  Eye,
  Users,
} from 'lucide-react'

// Chronicles components
import { OpticalOverviewDiagram } from '@/components/chronicles'

// Course components
import { TimelineCourseExplorer } from '@/components/course'

// ============================================================================
// 动态背景组件
// ============================================================================

function PolarizationBackground({ theme }: { theme: 'dark' | 'light' }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.03) 0deg,
                rgba(167, 139, 250, 0.03) 120deg,
                rgba(139, 92, 246, 0.03) 240deg,
                rgba(34, 211, 238, 0.03) 360deg)`
            : `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.02) 0deg,
                rgba(167, 139, 250, 0.02) 120deg,
                rgba(139, 92, 246, 0.02) 240deg,
                rgba(34, 211, 238, 0.02) 360deg)`,
        }}
      />
    </div>
  )
}

// ============================================================================
// 课程介绍 Hero 组件 (零一学院)
// ============================================================================

function CourseBannerHero({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  return (
    <div className="relative mb-8">
      {/* 背景光晕 */}
      <div className="absolute inset-0 -z-10">
        <div className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px]',
          theme === 'dark'
            ? 'bg-gradient-to-r from-cyan-500/15 via-violet-500/10 to-amber-500/15'
            : 'bg-gradient-to-r from-cyan-400/10 via-violet-400/8 to-amber-400/10'
        )} />
      </div>

      <div className="text-center pt-8 pb-6">
        {/* 课程标签 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={cn(
            'text-xs px-3 py-1 rounded-full font-medium',
            theme === 'dark'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'bg-cyan-100 text-cyan-700'
          )}>
            {t('home.courseBanner.badge')}
          </span>
        </div>

        {/* 主标题 - 偏振光下的新世界 */}
        <h1 className={cn(
          'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6',
          'text-transparent bg-clip-text',
          theme === 'dark'
            ? 'bg-gradient-to-br from-white via-cyan-200 to-violet-300'
            : 'bg-gradient-to-br from-gray-900 via-cyan-700 to-violet-700'
        )}>
          {t('home.chronicles.title')}
        </h1>

        {/* 课程描述 */}
        <p className={cn(
          'text-sm sm:text-base max-w-4xl mx-auto leading-relaxed',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {t('home.courseBanner.description')}
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 快捷导航组件
// ============================================================================

interface QuickNavItem {
  id: string
  titleKey: string
  descKey: string
  icon: React.ReactNode
  link: string
  color: string
  gradient: string
}

const QUICK_NAV_ITEMS: QuickNavItem[] = [
  {
    id: 'calc',
    titleKey: 'home.quick.calc',
    descKey: 'home.formulaLab.subtitle',
    icon: <Calculator className="w-5 h-5" />,
    link: '/calc',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'lab',
    titleKey: 'home.quick.lab',
    descKey: 'home.labGroup.subtitle',
    icon: <Users className="w-5 h-5" />,
    link: '/lab',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-blue-500',
  },
  // Note: 偏振造物局 (experiments) is hidden - module not ready
]

// 偏振演示馆 - 核心入口组件
function DemoGalleryHero({ theme }: { theme: 'dark' | 'light' }) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="mb-8">
      <Link
        to="/demos"
        className={cn(
          'group block relative overflow-hidden rounded-2xl border-2 p-6 transition-all hover:scale-[1.01]',
          theme === 'dark'
            ? 'bg-gradient-to-br from-cyan-900/30 via-slate-800/80 to-blue-900/30 border-cyan-500/30 hover:border-cyan-400/50'
            : 'bg-gradient-to-br from-cyan-50 via-white to-blue-50 border-cyan-200 hover:border-cyan-400'
        )}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn(
            'absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full blur-3xl',
            theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-300/20'
          )} />
          <div className={cn(
            'absolute -bottom-1/2 -left-1/4 w-96 h-96 rounded-full blur-3xl',
            theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-300/20'
          )} />
        </div>

        <div className="relative flex items-center gap-6">
          {/* 图标 */}
          <div className={cn(
            'flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center',
            'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25'
          )}>
            <Eye className="w-8 h-8 text-white" />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振演示馆' : 'Polarization Demo Gallery'}
              </h2>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-cyan-100 text-cyan-700'
              )}>
                {isZh ? '核心模块' : 'Core Module'}
              </span>
            </div>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '20+ 交互式演示，探索偏振光的奇妙世界。从基础概念到前沿应用，边玩边学。'
                : '20+ interactive demos to explore the fascinating world of polarized light. Learn by doing, from basics to cutting-edge applications.'}
            </p>
          </div>

          {/* 箭头 */}
          <ArrowRight className={cn(
            'w-6 h-6 flex-shrink-0 transition-transform group-hover:translate-x-2',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
        </div>
      </Link>
    </div>
  )
}

function QuickNavigation({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-gradient-to-br from-violet-400 to-purple-500">
          <Compass className="w-4 h-4 text-white" />
        </div>
        <h2 className={cn(
          'text-lg font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '学习工具' : 'Learning Tools'}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className={cn(
              'group flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.02]',
              theme === 'dark'
                ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                : 'bg-white/80 border-gray-200 hover:border-gray-300'
            )}
          >
            <div
              className={cn('p-2 rounded-lg bg-gradient-to-br text-white', item.gradient)}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'font-semibold text-sm truncate',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t(item.titleKey)}
              </p>
              <p className={cn(
                'text-xs truncate',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              )}>
                {t(item.descKey)}
              </p>
            </div>
            <ArrowRight className={cn(
              'w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )} />
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 主页组件
// ============================================================================

export function HomePage() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* 动态背景 */}
      <PolarizationBackground theme={theme} />

      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={cn(
          'flex items-center justify-between px-4 py-3',
          theme === 'dark'
            ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
            : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
        )}>
          <div className="flex items-center gap-3">
            <PolarWorldLogo size={36} theme={theme} />
            <span className={cn(
              'hidden sm:block font-bold text-base',
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
            )}>
              {t('home.chronicles.title')}
            </span>
          </div>
          <LanguageThemeSwitcher />
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        {/* 课程介绍 Hero (零一学院) */}
        <CourseBannerHero theme={theme} />

        {/* 知识棱镜 - 光学全景图 */}
        <OpticalOverviewDiagram />

        {/* 偏振演示馆 - 核心入口 */}
        <DemoGalleryHero theme={theme} />

        {/* 学习工具 */}
        <QuickNavigation theme={theme} />

        {/* 整合时间线与课程大纲 - 新设计 */}
        <TimelineCourseExplorer
          variant="full"
          showEras={true}
          showCuriosity={true}
          showPSRT={true}
          showUnits={true}
          maxCuriosityCards={6}
        />

        {/* 页脚 */}
        <footer className={cn(
          'mt-12 text-center text-xs',
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        )}>
          <p className="opacity-60">© 2025 开放智慧实验室 Open Wisdom Lab</p>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
