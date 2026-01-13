/**
 * HomePage - Chronicles of Light (光的编年史)
 * 首页 - 以历史时间线为主框架，融合课程大纲
 *
 * 设计理念：
 * 1. 以编年史时间线为核心叙事结构
 * 2. 将5个课程单元嵌入对应的历史时期
 * 3. 每个时代展示关键发现，并连接到相关学习资源
 * 4. 提供沉浸式的光学历史探索体验
 */

import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { PolarizedLightHero } from '@/components/effects'
import { cn } from '@/lib/utils'
import {
  Play,
  Lightbulb,
  BookOpen,
  Eye,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Microscope,
  Sun,
  Layers,
  History,
  Gamepad2,
  Calculator,
  Compass,
  Target,
  Clock,
  GraduationCap,
  Telescope,
  Atom,
  Wrench,
  ExternalLink,
} from 'lucide-react'

// ============================================================================
// 时代定义 - 编年史主框架
// ============================================================================

interface HistoricalEra {
  id: string
  yearStart: number
  yearEnd: number
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  color: string
  gradient: string
  bgGlow: string
  icon: React.ReactNode
  // 该时代的关键发现
  keyDiscoveries: {
    year: number
    titleKey: string
    scientistKey: string
    importance: 1 | 2 | 3
    track: 'optics' | 'polarization'
    link?: string
  }[]
  // 关联的课程单元
  courseUnits: number[]
  // 推荐入口
  featuredLinks: {
    type: 'demo' | 'experiment' | 'game' | 'tool'
    titleKey: string
    link: string
    icon: React.ReactNode
  }[]
}

const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'era1',
    yearStart: 1621,
    yearEnd: 1700,
    titleKey: 'home.eras.era1.title',
    subtitleKey: 'home.eras.era1.subtitle',
    descriptionKey: 'home.eras.era1.description',
    color: '#C9A227',
    gradient: 'from-amber-600 to-yellow-500',
    bgGlow: 'rgba(201, 162, 39, 0.15)',
    icon: <Sparkles className="w-5 h-5" />,
    keyDiscoveries: [
      { year: 1621, titleKey: 'home.discoveries.snell', scientistKey: 'home.scientists.snell', importance: 1, track: 'optics' },
      { year: 1665, titleKey: 'home.discoveries.newton', scientistKey: 'home.scientists.newton', importance: 1, track: 'optics', link: '/demos/light-wave' },
      { year: 1669, titleKey: 'home.discoveries.bartholin', scientistKey: 'home.scientists.bartholin', importance: 1, track: 'polarization', link: '/demos/birefringence' },
      { year: 1690, titleKey: 'home.discoveries.huygens', scientistKey: 'home.scientists.huygens', importance: 1, track: 'optics' },
    ],
    courseUnits: [1],
    featuredLinks: [
      { type: 'demo', titleKey: 'home.links.birefringence', link: '/demos/birefringence', icon: <Layers className="w-4 h-4" /> },
      { type: 'demo', titleKey: 'home.links.lightWave', link: '/demos/light-wave', icon: <Sparkles className="w-4 h-4" /> },
    ],
  },
  {
    id: 'era2',
    yearStart: 1800,
    yearEnd: 1850,
    titleKey: 'home.eras.era2.title',
    subtitleKey: 'home.eras.era2.subtitle',
    descriptionKey: 'home.eras.era2.description',
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
    bgGlow: 'rgba(34, 211, 238, 0.15)',
    icon: <Zap className="w-5 h-5" />,
    keyDiscoveries: [
      { year: 1808, titleKey: 'home.discoveries.malus', scientistKey: 'home.scientists.malus', importance: 1, track: 'polarization', link: '/demos/malus' },
      { year: 1811, titleKey: 'home.discoveries.arago', scientistKey: 'home.scientists.arago', importance: 2, track: 'polarization', link: '/demos/chromatic' },
      { year: 1812, titleKey: 'home.discoveries.brewster', scientistKey: 'home.scientists.brewster', importance: 1, track: 'polarization', link: '/demos/brewster' },
      { year: 1815, titleKey: 'home.discoveries.biot', scientistKey: 'home.scientists.biot', importance: 2, track: 'polarization', link: '/demos/optical-rotation' },
      { year: 1817, titleKey: 'home.discoveries.fresnel', scientistKey: 'home.scientists.fresnel', importance: 1, track: 'optics', link: '/demos/fresnel' },
      { year: 1845, titleKey: 'home.discoveries.faraday', scientistKey: 'home.scientists.faraday', importance: 1, track: 'polarization' },
      { year: 1848, titleKey: 'home.discoveries.pasteur', scientistKey: 'home.scientists.pasteur', importance: 2, track: 'polarization' },
    ],
    courseUnits: [1, 2, 3],
    featuredLinks: [
      { type: 'demo', titleKey: 'home.links.malus', link: '/demos/malus', icon: <Target className="w-4 h-4" /> },
      { type: 'demo', titleKey: 'home.links.brewster', link: '/demos/brewster', icon: <Zap className="w-4 h-4" /> },
      { type: 'experiment', titleKey: 'home.links.opticalStudio', link: '/optical-studio', icon: <Wrench className="w-4 h-4" /> },
      { type: 'game', titleKey: 'home.links.game2d', link: '/games/2d', icon: <Gamepad2 className="w-4 h-4" /> },
    ],
  },
  {
    id: 'era3',
    yearStart: 1850,
    yearEnd: 1950,
    titleKey: 'home.eras.era3.title',
    subtitleKey: 'home.eras.era3.subtitle',
    descriptionKey: 'home.eras.era3.description',
    color: '#A78BFA',
    gradient: 'from-violet-500 to-purple-500',
    bgGlow: 'rgba(167, 139, 250, 0.15)',
    icon: <Atom className="w-5 h-5" />,
    keyDiscoveries: [
      { year: 1852, titleKey: 'home.discoveries.stokes', scientistKey: 'home.scientists.stokes', importance: 1, track: 'polarization', link: '/demos/stokes' },
      { year: 1871, titleKey: 'home.discoveries.rayleigh', scientistKey: 'home.scientists.rayleigh', importance: 1, track: 'polarization', link: '/demos/rayleigh' },
      { year: 1892, titleKey: 'home.discoveries.poincare', scientistKey: 'home.scientists.poincare', importance: 2, track: 'polarization', link: '/calc/poincare' },
      { year: 1929, titleKey: 'home.discoveries.polaroid', scientistKey: 'home.scientists.land', importance: 1, track: 'polarization' },
      { year: 1941, titleKey: 'home.discoveries.jones', scientistKey: 'home.scientists.jones', importance: 2, track: 'polarization', link: '/demos/jones' },
      { year: 1943, titleKey: 'home.discoveries.mueller', scientistKey: 'home.scientists.mueller', importance: 2, track: 'polarization', link: '/demos/mueller' },
    ],
    courseUnits: [4, 5],
    featuredLinks: [
      { type: 'demo', titleKey: 'home.links.rayleigh', link: '/demos/rayleigh', icon: <Sun className="w-4 h-4" /> },
      { type: 'demo', titleKey: 'home.links.stokes', link: '/demos/stokes', icon: <Target className="w-4 h-4" /> },
      { type: 'tool', titleKey: 'home.links.poincare', link: '/calc/poincare', icon: <Compass className="w-4 h-4" /> },
      { type: 'tool', titleKey: 'home.links.calc', link: '/calc', icon: <Calculator className="w-4 h-4" /> },
    ],
  },
  {
    id: 'era4',
    yearStart: 1950,
    yearEnd: 2025,
    titleKey: 'home.eras.era4.title',
    subtitleKey: 'home.eras.era4.subtitle',
    descriptionKey: 'home.eras.era4.description',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    bgGlow: 'rgba(236, 72, 153, 0.15)',
    icon: <Microscope className="w-5 h-5" />,
    keyDiscoveries: [
      { year: 1960, titleKey: 'home.discoveries.laser', scientistKey: 'home.scientists.maiman', importance: 1, track: 'optics' },
      { year: 1971, titleKey: 'home.discoveries.lcd', scientistKey: 'home.scientists.lcd', importance: 1, track: 'polarization' },
      { year: 2018, titleKey: 'home.discoveries.polarimetry', scientistKey: 'home.scientists.modern', importance: 2, track: 'polarization', link: '/demos/polarimetric-microscopy' },
    ],
    courseUnits: [5],
    featuredLinks: [
      { type: 'demo', titleKey: 'home.links.microscopy', link: '/demos/polarimetric-microscopy', icon: <Microscope className="w-4 h-4" /> },
      { type: 'demo', titleKey: 'home.links.mueller', link: '/demos/mueller', icon: <Layers className="w-4 h-4" /> },
    ],
  },
]

// ============================================================================
// 课程单元数据 (简化版，用于时间线嵌入)
// ============================================================================

interface CourseUnitBrief {
  id: number
  titleKey: string
  subtitleKey: string
  icon: React.ReactNode
  color: string
  mainDemo: string
  gameLevel?: string
}

const COURSE_UNITS_BRIEF: CourseUnitBrief[] = [
  { id: 1, titleKey: 'home.units.unit1.title', subtitleKey: 'home.units.unit1.subtitle', icon: <Lightbulb className="w-4 h-4" />, color: '#C9A227', mainDemo: '/demos/birefringence', gameLevel: '/games/2d?level=0' },
  { id: 2, titleKey: 'home.units.unit2.title', subtitleKey: 'home.units.unit2.subtitle', icon: <Zap className="w-4 h-4" />, color: '#6366F1', mainDemo: '/demos/brewster' },
  { id: 3, titleKey: 'home.units.unit3.title', subtitleKey: 'home.units.unit3.subtitle', icon: <Sparkles className="w-4 h-4" />, color: '#0891B2', mainDemo: '/demos/chromatic', gameLevel: '/games/2d?level=3' },
  { id: 4, titleKey: 'home.units.unit4.title', subtitleKey: 'home.units.unit4.subtitle', icon: <Target className="w-4 h-4" />, color: '#F59E0B', mainDemo: '/demos/rayleigh' },
  { id: 5, titleKey: 'home.units.unit5.title', subtitleKey: 'home.units.unit5.subtitle', icon: <Telescope className="w-4 h-4" />, color: '#8B5CF6', mainDemo: '/demos/mueller' },
]

// ============================================================================
// 动态背景组件
// ============================================================================

function TimelineBackground({ theme }: { theme: 'dark' | 'light' }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 旋转光晕 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${time}deg at 30% 30%, rgba(201, 162, 39, 0.1) 0deg, transparent 90deg, rgba(34, 211, 238, 0.1) 180deg, transparent 270deg, rgba(201, 162, 39, 0.1) 360deg)`
            : `conic-gradient(from ${time}deg at 30% 30%, rgba(201, 162, 39, 0.05) 0deg, transparent 90deg, rgba(34, 211, 238, 0.05) 180deg, transparent 270deg, rgba(201, 162, 39, 0.05) 360deg)`,
        }}
      />
      {/* 垂直时间线光带 */}
      <div
        className={cn(
          'absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2',
          theme === 'dark'
            ? 'bg-gradient-to-b from-transparent via-amber-500/20 to-transparent'
            : 'bg-gradient-to-b from-transparent via-amber-400/10 to-transparent'
        )}
      />
    </div>
  )
}

// ============================================================================
// 时代卡片组件
// ============================================================================

function EraCard({
  era,
  theme,
  isExpanded,
  onToggle,
  isZh,
}: {
  era: HistoricalEra
  theme: 'dark' | 'light'
  isExpanded: boolean
  onToggle: () => void
  isZh: boolean
}) {
  const { t } = useTranslation()

  // 获取关联的课程单元
  const relatedUnits = COURSE_UNITS_BRIEF.filter(u => era.courseUnits.includes(u.id))

  return (
    <div
      className={cn(
        'relative rounded-2xl border overflow-hidden transition-all duration-500',
        theme === 'dark'
          ? 'bg-slate-800/70 border-slate-700/50 backdrop-blur-sm'
          : 'bg-white/90 border-gray-200 backdrop-blur-sm'
      )}
      style={{
        borderColor: isExpanded ? era.color : undefined,
        boxShadow: isExpanded
          ? `0 8px 40px ${era.bgGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`
          : undefined,
      }}
    >
      {/* 时代头部 */}
      <button
        className={cn(
          'w-full p-5 flex items-center gap-4 text-left transition-colors',
          theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
        )}
        onClick={onToggle}
      >
        {/* 年代标记 */}
        <div
          className={cn(
            'flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center bg-gradient-to-br shadow-lg',
            era.gradient
          )}
        >
          <span className="text-white text-xl font-bold">{era.yearStart}</span>
          <span className="text-white/70 text-[10px]">—{era.yearEnd}</span>
        </div>

        {/* 时代信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: era.color }}>{era.icon}</span>
            <h3 className={cn(
              'text-lg font-bold truncate',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t(era.titleKey)}
            </h3>
          </div>
          <p className={cn(
            'text-sm',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {t(era.subtitleKey)}
          </p>

          {/* 课程单元标签 */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {relatedUnits.map(unit => (
              <span
                key={unit.id}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${unit.color}20`,
                  color: unit.color,
                }}
              >
                {isZh ? `第${unit.id}单元` : `Unit ${unit.id}`}
              </span>
            ))}
          </div>
        </div>

        {/* 展开指示器 */}
        <ChevronDown
          className={cn(
            'w-6 h-6 flex-shrink-0 transition-transform duration-300',
            isExpanded ? 'rotate-180' : '',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}
        />
      </button>

      {/* 展开内容 */}
      {isExpanded && (
        <div className={cn(
          'px-5 pb-5 border-t',
          theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
        )}>
          {/* 时代描述 */}
          <p className={cn(
            'text-sm mt-4 mb-5 leading-relaxed',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {t(era.descriptionKey)}
          </p>

          {/* 关键发现时间线 */}
          <div className="mb-5">
            <h4 className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              <History className="w-3.5 h-3.5" />
              {isZh ? '关键发现' : 'Key Discoveries'}
            </h4>
            <div className="space-y-2">
              {era.keyDiscoveries.map((discovery, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-lg transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-700/30 hover:bg-slate-700/50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  {/* 年份 */}
                  <span
                    className={cn(
                      'text-xs font-mono font-bold px-2 py-0.5 rounded',
                      discovery.track === 'optics'
                        ? theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                        : theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                    )}
                  >
                    {discovery.year}
                  </span>

                  {/* 发现内容 */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {t(discovery.titleKey)}
                    </p>
                    <p className={cn(
                      'text-xs truncate',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    )}>
                      {t(discovery.scientistKey)}
                    </p>
                  </div>

                  {/* 重要性标记 */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          i <= discovery.importance
                            ? discovery.track === 'optics'
                              ? 'bg-amber-500'
                              : 'bg-cyan-500'
                            : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                        )}
                      />
                    ))}
                  </div>

                  {/* 链接 */}
                  {discovery.link && (
                    <Link
                      to={discovery.link}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        theme === 'dark'
                          ? 'hover:bg-slate-600 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-200 text-gray-400 hover:text-gray-700'
                      )}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 关联课程单元 */}
          {relatedUnits.length > 0 && (
            <div className="mb-5">
              <h4 className={cn(
                'text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                <GraduationCap className="w-3.5 h-3.5" />
                {isZh ? '关联课程' : 'Related Course Units'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedUnits.map(unit => (
                  <Link
                    key={unit.id}
                    to={unit.mainDemo}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]',
                      theme === 'dark'
                        ? 'bg-slate-700/50 hover:bg-slate-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${unit.color}20` }}
                    >
                      <span style={{ color: unit.color }}>{unit.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {t(unit.titleKey)}
                      </p>
                      <p className={cn(
                        'text-[10px] truncate',
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        {t(unit.subtitleKey)}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      'w-4 h-4 flex-shrink-0',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 推荐入口 */}
          <div>
            <h4 className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              <Eye className="w-3.5 h-3.5" />
              {isZh ? '探索体验' : 'Explore & Learn'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {era.featuredLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.link}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105',
                    theme === 'dark'
                      ? 'bg-slate-700/50 hover:bg-slate-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <span style={{ color: era.color }}>{link.icon}</span>
                  <span className={cn(
                    'font-medium',
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  )}>
                    {t(link.titleKey)}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: link.type === 'demo' ? '#22D3EE20' : link.type === 'experiment' ? '#F59E0B20' : link.type === 'game' ? '#EC489920' : '#8B5CF620',
                      color: link.type === 'demo' ? '#22D3EE' : link.type === 'experiment' ? '#F59E0B' : link.type === 'game' ? '#EC4899' : '#8B5CF6',
                    }}
                  >
                    {link.type === 'demo' ? (isZh ? '演示' : 'Demo') :
                     link.type === 'experiment' ? (isZh ? '实验' : 'Exp') :
                     link.type === 'game' ? (isZh ? '游戏' : 'Game') :
                     (isZh ? '工具' : 'Tool')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 快速导航栏
// ============================================================================

function QuickNav({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const navItems = [
    { icon: <Eye className="w-5 h-5" />, label: isZh ? '演示馆' : 'Demos', link: '/demos', color: '#22D3EE' },
    { icon: <Wrench className="w-5 h-5" />, label: isZh ? '设计室' : 'Studio', link: '/optical-studio', color: '#F59E0B' },
    { icon: <Gamepad2 className="w-5 h-5" />, label: isZh ? '游戏' : 'Games', link: '/games', color: '#EC4899' },
    { icon: <Calculator className="w-5 h-5" />, label: isZh ? '计算' : 'Calc', link: '/calc', color: '#8B5CF6' },
    { icon: <History className="w-5 h-5" />, label: isZh ? '编年史' : 'Timeline', link: '/chronicles', color: '#C9A227' },
  ]

  return (
    <div className={cn(
      'flex justify-center gap-2 sm:gap-4 p-3 rounded-2xl mb-6',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
    )}>
      {navItems.map((item, idx) => (
        <Link
          key={idx}
          to={item.link}
          className={cn(
            'flex flex-col items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl transition-all hover:scale-110',
            theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'
          )}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${item.color}20` }}
          >
            <span style={{ color: item.color }}>{item.icon}</span>
          </div>
          <span className={cn(
            'text-[10px] sm:text-xs font-medium',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  )
}

// ============================================================================
// 生活场景入口
// ============================================================================

function LifeScenesBar({ theme, isZh }: { theme: 'dark' | 'light'; isZh: boolean }) {
  const scenes = [
    { emoji: '🌅', label: isZh ? '蓝天红霞' : 'Sky Colors', link: '/demos/rayleigh' },
    { emoji: '📱', label: isZh ? 'LCD屏幕' : 'LCD Screen', link: '/demos/polarization-intro' },
    { emoji: '🕶️', label: isZh ? '偏光眼镜' : 'Sunglasses', link: '/demos/malus' },
    { emoji: '🦋', label: isZh ? '彩色蝴蝶' : 'Butterfly', link: '/demos/chromatic' },
  ]

  return (
    <div className={cn(
      'flex flex-wrap justify-center gap-2 mb-6',
      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    )}>
      <span className="text-xs self-center mr-1">{isZh ? '生活中的偏振：' : 'Polarization in Life:'}</span>
      {scenes.map((scene, idx) => (
        <Link
          key={idx}
          to={scene.link}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105',
            theme === 'dark'
              ? 'bg-slate-800/50 hover:bg-slate-700/50'
              : 'bg-white/80 hover:bg-gray-100'
          )}
        >
          <span>{scene.emoji}</span>
          <span className={cn(
            'text-xs font-medium',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {scene.label}
          </span>
        </Link>
      ))}
    </div>
  )
}

// ============================================================================
// 主页组件
// ============================================================================

export function HomePage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const isZh = i18n.language === 'zh'

  // 展开状态
  const [expandedEraId, setExpandedEraId] = useState<string | null>('era2') // 默认展开黄金时代

  const handleToggleEra = useCallback((eraId: string) => {
    setExpandedEraId(prev => prev === eraId ? null : eraId)
  }, [])

  const handleStartLearning = useCallback(() => {
    navigate('/demos/polarization-intro')
  }, [navigate])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#f0f9ff]'
    )}>
      {/* 动态背景 */}
      <TimelineBackground theme={theme} />

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
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-cyan-600'
            )}>
              {isZh ? '偏振光下的新世界' : 'A New World Under Polarized Light'}
            </span>
          </div>
          <LanguageThemeSwitcher />
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Hero 区域 */}
        <div className="relative mb-8">
          {/* 背景光晕 */}
          <div className="absolute inset-0 -z-10">
            <div className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px]',
              theme === 'dark'
                ? 'bg-gradient-to-r from-amber-500/20 via-transparent to-cyan-500/20'
                : 'bg-gradient-to-r from-amber-400/15 via-transparent to-cyan-400/15'
            )} />
          </div>

          {/* 标题 */}
          <div className="text-center pt-6 pb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
              <span className={cn(
                'text-xs px-3 py-1 rounded-full font-medium',
                theme === 'dark'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-amber-100 text-amber-700'
              )}>
                {isZh ? '光的编年史 · P-SRT课程' : 'Chronicles of Light · P-SRT Course'}
              </span>
            </div>

            <h1 className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4',
              'text-transparent bg-clip-text',
              theme === 'dark'
                ? 'bg-gradient-to-br from-amber-300 via-white to-cyan-300'
                : 'bg-gradient-to-br from-amber-700 via-gray-900 to-cyan-700'
            )}>
              {isZh ? '偏振光下的新世界' : 'A New World Under Polarized Light'}
            </h1>

            <p className={cn(
              'text-base sm:text-lg max-w-2xl mx-auto mb-6',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '从1669年冰洲石的意外发现，到现代全偏振成像技术——跟随历史的脚步，探索三百五十年的光学奥秘'
                : 'From the accidental discovery of Iceland spar in 1669 to modern polarimetric imaging — follow history\'s footsteps through 350 years of optical mysteries'}
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleStartLearning}
                className={cn(
                  'group px-6 py-3 rounded-full font-bold flex items-center gap-2',
                  'bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 text-white',
                  'hover:scale-105 transition-all duration-300',
                  'shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
                )}
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {isZh ? '开始探索' : 'Start Exploring'}
              </button>
              <Link
                to="/chronicles"
                className={cn(
                  'px-6 py-3 rounded-full font-bold flex items-center gap-2',
                  'border-2 transition-all duration-300 hover:scale-105',
                  theme === 'dark'
                    ? 'border-amber-500/50 text-amber-400 hover:border-amber-400 hover:bg-amber-500/10'
                    : 'border-amber-400 text-amber-700 hover:border-amber-500 hover:bg-amber-50'
                )}
              >
                <History className="w-5 h-5" />
                {isZh ? '完整时间线' : 'Full Timeline'}
              </Link>
            </div>
          </div>
        </div>

        {/* 偏振光效果展示 */}
        <div className="mb-8">
          <PolarizedLightHero height={160} className="shadow-xl rounded-2xl" />
        </div>

        {/* 快速导航 */}
        <QuickNav theme={theme} isZh={isZh} />

        {/* 生活场景 */}
        <LifeScenesBar theme={theme} isZh={isZh} />

        {/* 编年史时间线 - 核心内容 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-cyan-500">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className={cn(
                'text-lg font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '光的编年史' : 'Chronicles of Light'}
              </h2>
              <p className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              )}>
                {isZh ? '从17世纪到现代 · 5个课程单元' : 'From 17th Century to Modern Day · 5 Course Units'}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className={cn(
                'flex items-center gap-1 text-[10px] px-2 py-1 rounded-full',
                theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              )}>
                <Sun className="w-3 h-3" />
                {isZh ? '光学' : 'Optics'}
              </span>
              <span className={cn(
                'flex items-center gap-1 text-[10px] px-2 py-1 rounded-full',
                theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
              )}>
                <Sparkles className="w-3 h-3" />
                {isZh ? '偏振' : 'Polarization'}
              </span>
            </div>
          </div>

          {/* 时代卡片列表 */}
          <div className="relative">
            {/* 时间线连接线 */}
            <div className={cn(
              'absolute left-8 top-0 bottom-0 w-0.5',
              theme === 'dark'
                ? 'bg-gradient-to-b from-amber-500/50 via-cyan-500/30 to-purple-500/50'
                : 'bg-gradient-to-b from-amber-300 via-cyan-300 to-purple-300'
            )} />

            <div className="space-y-4 relative">
              {HISTORICAL_ERAS.map((era) => (
                <EraCard
                  key={era.id}
                  era={era}
                  theme={theme}
                  isExpanded={expandedEraId === era.id}
                  onToggle={() => handleToggleEra(era.id)}
                  isZh={isZh}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <footer className={cn(
          'mt-12 text-center text-xs',
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        )}>
          <p className="opacity-60">
            © 2025 {isZh ? '深圳零一学院' : 'Shenzhen Academy 01'} · {isZh ? '偏振光下的新世界' : 'A New World Under Polarized Light'}
          </p>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
