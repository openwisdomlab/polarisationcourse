/**
 * Game Hub Page - PolarQuest Game Mode Selection
 * 游戏中心页面 - 偏振探秘游戏模式选择
 *
 * Entry point for the PolarQuest module, allowing users to select between:
 * - 2D Puzzle Game
 * - 3D Voxel Game
 * - Card Game
 * - Escape Room (coming soon)
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import {
  Home, Grid, Box, Layers, DoorOpen,
  Gamepad2, Sparkles, ChevronRight
} from 'lucide-react'
import type { ModuleTab } from '@/components/shared'

// Game mode configuration
const GAME_MODES: ModuleTab[] = [
  {
    id: '2d',
    route: '/games/2d',
    icon: Grid,
    label: '2D Puzzles',
    labelZh: '2D 解谜',
    description: 'SVG-based light puzzles with intuitive controls',
    descriptionZh: '基于 SVG 的光学谜题，操作简单直观',
    status: 'active',
  },
  {
    id: '3d',
    route: '/games/3d',
    icon: Box,
    label: '3D Voxel',
    labelZh: '3D 体素',
    description: 'Minecraft-style 3D puzzle world',
    descriptionZh: 'Minecraft 风格的 3D 解谜世界',
    status: 'active',
  },
  {
    id: 'card',
    route: '/games/card',
    icon: Layers,
    label: 'Card Game',
    labelZh: '卡牌对战',
    description: 'Tabletop card game about polarization physics',
    descriptionZh: '偏振物理主题的桌游卡牌',
    status: 'active',
  },
  {
    id: 'escape',
    route: '/games/escape',
    icon: DoorOpen,
    label: 'Escape Room',
    labelZh: '密室逃脱',
    description: 'Solve optical puzzles to escape the lab',
    descriptionZh: '解开光学谜题，逃出实验室',
    status: 'coming-soon',
  },
]

// Game mode cards for the hub overview
interface GameModeCardProps {
  mode: ModuleTab
  featured?: boolean
}

function GameModeCard({ mode, featured = false }: GameModeCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const Icon = mode.icon
  const isComingSoon = mode.status === 'coming-soon'

  const cardContent = (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border-2 transition-all',
      featured ? 'p-6 sm:p-8' : 'p-5',
      isComingSoon
        ? cn(
            'border-dashed cursor-not-allowed opacity-60',
            theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-300 bg-gray-50'
          )
        : cn(
            'hover:-translate-y-1 hover:shadow-xl cursor-pointer',
            theme === 'dark'
              ? 'border-purple-500/30 bg-slate-800/80 hover:border-purple-500/60'
              : 'border-purple-300 bg-white hover:border-purple-400 hover:shadow-purple-500/10'
          )
    )}>
      {/* Background decoration */}
      {!isComingSoon && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-purple-500/10 blur-2xl" />
      )}

      {/* Icon */}
      <div className={cn(
        'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        featured && 'w-14 h-14',
        isComingSoon
          ? theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          : 'bg-gradient-to-br from-purple-500 to-violet-600'
      )}>
        <Icon className={cn(
          featured ? 'w-7 h-7' : 'w-6 h-6',
          isComingSoon
            ? theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            : 'text-white'
        )} />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <h3 className={cn(
            'font-bold',
            featured ? 'text-xl' : 'text-lg',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? mode.labelZh : mode.label}
          </h3>
          {isComingSoon && (
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full',
              theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
            )}>
              {isZh ? '即将推出' : 'Coming Soon'}
            </span>
          )}
          {mode.status === 'beta' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
              Beta
            </span>
          )}
        </div>

        <p className={cn(
          'text-sm leading-relaxed',
          featured && 'text-base',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? mode.descriptionZh : mode.description}
        </p>

        {/* Play button */}
        {!isComingSoon && (
          <div className={cn(
            'mt-4 flex items-center gap-2 font-medium',
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          )}>
            <span className="text-sm">{isZh ? '开始游戏' : 'Play Now'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  )

  if (isComingSoon) {
    return cardContent
  }

  return (
    <Link to={mode.route}>
      {cardContent}
    </Link>
  )
}

// Hub overview component
function GameHubOverview() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm mb-4">
          <Gamepad2 className="w-4 h-4" />
          <span>{isZh ? '四种游戏模式' : 'Four Game Modes'}</span>
        </div>
        <h2 className={cn(
          'text-2xl sm:text-3xl font-bold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '选择你的游戏方式' : 'Choose Your Play Style'}
        </h2>
        <p className={cn(
          'text-base max-w-2xl mx-auto',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh
            ? '每种游戏都基于真实的偏振光物理，用不同的方式探索光的奥秘'
            : 'Each game is based on real polarization physics — explore the mysteries of light in your own way'}
        </p>
      </div>

      {/* Game cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {GAME_MODES.map((mode, index) => (
          <GameModeCard
            key={mode.id}
            mode={mode}
            featured={index < 2}
          />
        ))}
      </div>

      {/* Quick tips */}
      <div className={cn(
        'rounded-xl p-4 sm:p-6',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
      )}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={cn(
            'w-5 h-5',
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          )} />
          <h3 className={cn(
            'font-semibold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '推荐路径' : 'Recommended Path'}
          </h3>
        </div>
        <div className={cn(
          'text-sm space-y-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          <p>
            {isZh
              ? '新手建议从 2D 解谜开始，熟悉偏振片、旋转器、分束器等基本元件。'
              : 'Beginners should start with 2D Puzzles to learn the basics: polarizers, rotators, and splitters.'}
          </p>
          <p>
            {isZh
              ? '想要更沉浸的体验？试试 3D 体素游戏，在 Minecraft 风格的世界中探索光的传播。'
              : 'Want a more immersive experience? Try the 3D Voxel game to explore light propagation in a Minecraft-style world.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function GameHubPage() {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-700'
          : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Home link */}
            <Link
              to="/"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.home')}</span>
            </Link>

            {/* Center: Title */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🎮</span>
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}>
                {isZh ? '偏振探秘' : 'PolarQuest'}
              </h1>
            </div>

            {/* Right: Settings */}
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <GameHubOverview />
      </main>
    </div>
  )
}
