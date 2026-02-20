/**
 * HUD.tsx -- 半透明叠加层 UI
 *
 * 渲染为普通 HTML (非 SVG)，定位在场景上方。
 * 包含: 返回按钮 (左上), 设置按钮 (右上), 小地图 (右下)。
 * 所有元素半透明背景 + 毛玻璃效果，不遮挡场景中央。
 */

import { useMemo } from 'react'
import { ArrowLeft, Settings } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
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
 */
export function HUD() {
  const navigate = useNavigate()

  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-4">
      {/* 顶部栏 -- 返回按钮 + 设置 */}
      <div className="flex items-start justify-between">
        {/* 返回按钮 */}
        <button
          className={cn(hudButtonClass, 'pointer-events-auto h-10 w-10')}
          onClick={() => navigate({ to: '/' })}
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* 设置按钮 (占位，Phase 1 无功能) */}
        <button
          className={cn(hudButtonClass, 'pointer-events-auto h-10 w-10')}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* 底部栏 -- 小地图 */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <Minimap />
      </div>
    </div>
  )
}
