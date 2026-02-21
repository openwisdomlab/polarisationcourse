/**
 * HUD.tsx -- 半透明叠加层 UI
 *
 * 渲染为普通 HTML (非 SVG)，定位在场景上方。
 * 包含: 返回按钮 (左上), 设置按钮 (右上), 小地图 (右下),
 *       控制提示 (左下), 世界地图按钮 (右上按钮组)。
 *
 * 设置面板包含: 语言切换、帮助按钮、世界地图快捷按钮。
 *
 * Phase 5 -- 响应式布局:
 * - Desktop (>1024px): 完整布局
 * - Tablet (768-1024px): 精简布局 (缩小字号、小地图 80% 缩放)
 * - Mobile (<768px): 最小布局 (小地图隐藏、设置折叠、区域名缩小)
 */

import { useMemo, useState, useEffect } from 'react'
import { ArrowLeft, Settings, Map, X, HelpCircle, Languages, BookOpen } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { worldToScreen, TILE_WIDTH_HALF, TILE_HEIGHT_HALF } from '@/lib/isometric'
import { showWelcomeOverlay } from './WelcomeOverlay'
import { getRegionDefinition } from './regions/regionRegistry'
import { getCourseInfoForRegion } from './regionCourseMap'

/**
 * HUD 按钮基础样式
 */
const hudButtonClass = cn(
  'flex items-center justify-center rounded-xl',
  'bg-white/70 dark:bg-black/40',
  'backdrop-blur-sm',
  'border border-white/30 dark:border-white/10',
  'shadow-sm',
  'transition-colors duration-200',
  'hover:bg-white/90 dark:hover:bg-black/60',
  'cursor-pointer',
)

/**
 * 小地图组件 -- 场景概览 + 头像位置点
 */
function Minimap() {
  const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)
  const avatarX = useOdysseyWorldStore((s) => s.avatarX)
  const avatarY = useOdysseyWorldStore((s) => s.avatarY)

  // 只显示平台的简化轮廓
  const platforms = useMemo(
    () => sceneElements.filter((el) => el.type === 'platform' && el.worldZ === 0),
    [sceneElements],
  )

  // 头像在小地图中的位置
  const avatarScreen = worldToScreen(avatarX, avatarY)

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-white/70 dark:bg-black/40',
        'backdrop-blur-sm',
        'border border-white/30 dark:border-white/10',
        'shadow-sm',
        // 响应式: tablet 缩小, mobile 隐藏
        'hidden md:block',
        'md:scale-[0.8] md:origin-bottom-right lg:scale-100',
      )}
    >
      <svg width={120} height={80} viewBox="-500 -100 1000 700">
        {/* 背景 */}
        <rect x={-500} y={-100} width={1000} height={700} fill="#0a1628" opacity={0.5} />

        {/* 平台轮廓 (简化菱形) */}
        {platforms.map((el) => {
          const s = worldToScreen(el.worldX, el.worldY)
          return (
            <polygon
              key={el.id}
              points={`
                ${s.x},${s.y - TILE_HEIGHT_HALF}
                ${s.x + TILE_WIDTH_HALF},${s.y}
                ${s.x},${s.y + TILE_HEIGHT_HALF}
                ${s.x - TILE_WIDTH_HALF},${s.y}
              `}
              fill="#2a3a54"
              stroke="#4a6a8a"
              strokeWidth={2}
              opacity={0.6}
            />
          )
        })}

        {/* 头像位置点 */}
        <circle
          cx={avatarScreen.x}
          cy={avatarScreen.y}
          r={8}
          fill="#FFD700"
          stroke="#FFC000"
          strokeWidth={2}
        />
      </svg>
    </div>
  )
}

/**
 * ProgressRing -- SVG 圆环进度指示器
 *
 * 显示当前区域的发现进度 (如 "3/5")。
 * 圆环按比例填充，新发现时短暂高亮。
 */
function ProgressRing({ achieved, total }: { achieved: number; total: number }) {
  const radius = 10
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? achieved / total : 0
  const dashOffset = circumference * (1 - progress)

  // 是否完成 (全部发现)
  const isComplete = achieved === total && total > 0

  return (
    <div className="flex items-center gap-1.5">
      <svg width={24} height={24} viewBox="0 0 24 24" className="flex-shrink-0">
        {/* 背景圆环 */}
        <circle
          cx={12}
          cy={12}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-gray-300/30 dark:text-gray-600/30"
        />
        {/* 进度圆环 */}
        <circle
          cx={12}
          cy={12}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 12 12)"
          className={cn(
            'transition-all duration-700 ease-out',
            isComplete
              ? 'text-amber-400 dark:text-amber-500'
              : 'text-blue-400 dark:text-blue-500',
          )}
        />
        {isComplete && (
          <circle cx={12} cy={12} r={3} fill="currentColor" className="text-amber-400 dark:text-amber-500" />
        )}
      </svg>
      <span className={cn(
        'text-[10px] font-medium tabular-nums',
        isComplete
          ? 'text-amber-500 dark:text-amber-400'
          : 'text-gray-500 dark:text-gray-400',
      )}>
        {achieved}/{total}
      </span>
    </div>
  )
}

/**
 * HUD 叠加层
 *
 * 绝对定位，z-index 在 SVG 场景之上。
 * 不遮挡场景中心区域。
 *
 * 响应式:
 * - Desktop: 完整布局
 * - Tablet: 精简 (紧凑间距, 小地图 80%)
 * - Mobile: 最小 (小地图隐藏, 设置折叠, 区域名缩小)
 */
export function HUD() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)

  // 通过 i18n 键获取区域名称 -- 将 kebab-case ID 转换为 camelCase nameKey
  const regionNameKey = activeRegionId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
  const regionName = t(`odyssey.regions.${regionNameKey}`)

  // 区域发现进度
  const regionDef = useMemo(() => getRegionDefinition(activeRegionId), [activeRegionId])
  const totalDiscoveries = regionDef?.discoveries?.length ?? 0
  const achievedCount = useMemo(() => {
    if (!regionDef?.discoveries) return 0
    return regionDef.discoveries.filter((d) => achievedDiscoveries.has(d.id)).length
  }, [regionDef, achievedDiscoveries])

  // 设置面板折叠状态
  const [settingsOpen, setSettingsOpen] = useState(false)

  // 控制提示 -- 10 秒后自动隐藏
  const [showHints, setShowHints] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShowHints(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  // 语言切换处理
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh'
    void i18n.changeLanguage(nextLang)
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-2 md:p-3 lg:p-4">
      {/* 顶部栏 -- 返回按钮 + 区域名称 + (世界地图/设置) */}
      <div className="flex items-start justify-between">
        {/* 返回按钮 */}
        <button
          className={cn(hudButtonClass, 'pointer-events-auto h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10')}
          onClick={() => navigate({ to: '/demos' })}
          aria-label={t('odyssey.ui.backToDemos')}
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* 当前区域名称 + 课程单元 + 进度环 -- 顶部中央 */}
        <div
          className={cn(
            'pointer-events-none rounded-lg px-2 py-1 md:px-3 md:py-1.5',
            'bg-white/50 dark:bg-black/30',
            'backdrop-blur-sm',
            'border border-white/20 dark:border-white/10',
            'flex items-center gap-2',
          )}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm font-light tracking-wider text-gray-600 dark:text-gray-300">
              {regionName}
            </span>
            {(() => {
              const courseInfo = getCourseInfoForRegion(activeRegionId)
              return courseInfo ? (
                <span className="text-[9px] text-gray-400 dark:text-gray-500">
                  {t(courseInfo.unitLabelKey)}
                </span>
              ) : null
            })()}
          </div>
          {totalDiscoveries > 0 && (
            <ProgressRing achieved={achievedCount} total={totalDiscoveries} />
          )}
        </div>

        {/* 右上角按钮组 -- 世界地图 + 设置 */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* 发现日志按钮 */}
          <button
            className={cn(hudButtonClass, 'pointer-events-auto h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10')}
            onClick={() => useOdysseyWorldStore.getState().toggleDiscoveryMenu()}
            aria-label={t('odyssey.menu.title')}
          >
            <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* 世界地图按钮 -- 所有断点统一显示 */}
          <button
            className={cn(hudButtonClass, 'pointer-events-auto h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10')}
            onClick={() => useOdysseyWorldStore.getState().toggleWorldMap()}
            aria-label={t('odyssey.ui.worldMap')}
          >
            <Map className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* 设置按钮 */}
          <button
            className={cn(hudButtonClass, 'pointer-events-auto h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10')}
            onClick={() => setSettingsOpen(!settingsOpen)}
            aria-label={t('odyssey.ui.settings')}
          >
            {settingsOpen ? (
              <X className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Settings className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* 设置面板 -- 语言切换、帮助、世界地图 */}
      {settingsOpen && (
        <div
          className={cn(
            'pointer-events-auto absolute right-2 top-12 md:right-3 md:top-14 lg:right-4 lg:top-14',
            'rounded-xl p-3',
            'bg-white/80 dark:bg-black/50',
            'backdrop-blur-sm',
            'border border-white/30 dark:border-white/10',
            'shadow-md',
            'min-w-[160px]',
            'space-y-2',
          )}
        >
          {/* 语言切换 */}
          <button
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5',
              'text-xs text-gray-600 dark:text-gray-300',
              'hover:bg-black/5 dark:hover:bg-white/10',
              'transition-colors duration-150',
              'cursor-pointer',
            )}
            onClick={toggleLanguage}
          >
            <Languages className="h-4 w-4 flex-shrink-0" />
            <span>{t('odyssey.ui.language')}</span>
            <span className="ml-auto text-[10px] font-medium text-gray-400 dark:text-gray-500">
              {i18n.language === 'zh' ? 'EN' : '中'}
            </span>
          </button>

          {/* 帮助按钮 -- 重新触发欢迎引导 */}
          <button
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5',
              'text-xs text-gray-600 dark:text-gray-300',
              'hover:bg-black/5 dark:hover:bg-white/10',
              'transition-colors duration-150',
              'cursor-pointer',
            )}
            onClick={() => {
              showWelcomeOverlay()
              setSettingsOpen(false)
            }}
          >
            <HelpCircle className="h-4 w-4 flex-shrink-0" />
            <span>{t('odyssey.ui.help')}</span>
          </button>

          {/* 世界地图快捷入口 */}
          <button
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5',
              'text-xs text-gray-600 dark:text-gray-300',
              'hover:bg-black/5 dark:hover:bg-white/10',
              'transition-colors duration-150',
              'cursor-pointer',
            )}
            onClick={() => {
              useOdysseyWorldStore.getState().toggleWorldMap()
              setSettingsOpen(false)
            }}
          >
            <Map className="h-4 w-4 flex-shrink-0" />
            <span>{t('odyssey.ui.worldMap')}</span>
            <span className="ml-auto text-[10px] font-medium text-gray-400 dark:text-gray-500">M</span>
          </button>
        </div>
      )}

      {/* 底部左 -- 控制提示 (10 秒后自动隐藏) */}
      {showHints && (
        <div
          className={cn(
            'absolute bottom-2 left-2 md:bottom-3 md:left-3 lg:bottom-4 lg:left-4',
            'pointer-events-none',
          )}
        >
          <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 opacity-40">
            {t('odyssey.ui.controlHints')}
          </p>
        </div>
      )}

      {/* 底部右 -- 小地图 */}
      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 pointer-events-auto flex flex-col items-end gap-1.5 md:gap-2">
        <Minimap />
      </div>
    </div>
  )
}
