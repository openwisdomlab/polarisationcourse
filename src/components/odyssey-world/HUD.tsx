/**
 * HUD.tsx -- 半透明叠加层 UI
 *
 * 渲染为普通 HTML (非 SVG)，定位在场景上方。
 * 包含: 返回按钮 (左上), 设置按钮 (右上), 小地图 (右下)。
 * 所有元素半透明背景 + 毛玻璃效果，不遮挡场景中央。
 *
 * Phase 5 -- 响应式布局:
 * - Desktop (>1024px): 完整布局 (返回按钮、区域名、小地图、设置、世界地图按钮)
 * - Tablet (768-1024px): 精简布局 (缩小字号、小地图 80% 缩放、紧凑间距)
 * - Mobile (<768px): 最小布局 (返回左上、区域名居中缩小、世界地图右上、
 *   小地图隐藏、设置可折叠)
 */

import { useMemo, useState } from 'react'
import { ArrowLeft, Settings, Map, X } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { worldToScreen, TILE_WIDTH_HALF, TILE_HEIGHT_HALF } from '@/lib/isometric'

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
        <rect x={-500} y={-100} width={1000} height={700} fill="#F5F2EC" opacity={0.5} />

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
              fill="#D4CFC6"
              stroke="#B8B4AC"
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)

  // 通过 i18n 键获取区域名称 -- 将 kebab-case ID 转换为 camelCase nameKey
  const regionNameKey = activeRegionId.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
  const regionName = t(`odyssey.regions.${regionNameKey}`)

  // 移动端设置折叠状态
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-2 md:p-3 lg:p-4">
      {/* 顶部栏 -- 返回按钮 + 区域名称 + (世界地图/设置) */}
      <div className="flex items-start justify-between">
        {/* 返回按钮 */}
        <button
          className={cn(hudButtonClass, 'pointer-events-auto h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10')}
          onClick={() => navigate({ to: '/' })}
          aria-label={t('odyssey.ui.backToHome')}
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* 当前区域名称 -- 顶部中央 */}
        <div
          className={cn(
            'pointer-events-none rounded-lg px-2 py-1 md:px-3 md:py-1.5',
            'bg-white/50 dark:bg-black/30',
            'backdrop-blur-sm',
            'border border-white/20 dark:border-white/10',
          )}
        >
          <span className="text-[10px] md:text-xs font-light tracking-wider text-gray-500 dark:text-gray-400">
            {regionName}
          </span>
        </div>

        {/* 右上角按钮组 */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* 世界地图按钮 -- mobile: 显示在右上角 */}
          <button
            className={cn(hudButtonClass, 'pointer-events-auto h-8 w-8 md:hidden')}
            onClick={() => useOdysseyWorldStore.getState().toggleWorldMap()}
            aria-label={t('odyssey.ui.worldMap')}
          >
            <Map className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          {/* 设置按钮 -- mobile: 汉堡折叠 */}
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

      {/* 设置面板 (折叠, 仅 mobile 可见时展开) */}
      {settingsOpen && (
        <div
          className={cn(
            'pointer-events-auto absolute right-2 top-12 md:right-3 md:top-14 lg:right-4 lg:top-14',
            'rounded-xl p-3',
            'bg-white/80 dark:bg-black/50',
            'backdrop-blur-sm',
            'border border-white/30 dark:border-white/10',
            'shadow-md',
            'min-w-[140px]',
          )}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('odyssey.ui.settingsPlaceholder')}</p>
        </div>
      )}

      {/* 底部栏 -- 世界地图按钮 + 小地图 (tablet+desktop) */}
      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 pointer-events-auto flex flex-col items-end gap-1.5 md:gap-2">
        {/* 世界地图按钮 -- tablet+desktop 在底部显示 */}
        <button
          className={cn(hudButtonClass, 'pointer-events-auto hidden md:flex h-8 w-8 md:h-9 md:w-9')}
          onClick={() => useOdysseyWorldStore.getState().toggleWorldMap()}
          aria-label="World Map"
        >
          <Map className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>

        <Minimap />
      </div>
    </div>
  )
}
