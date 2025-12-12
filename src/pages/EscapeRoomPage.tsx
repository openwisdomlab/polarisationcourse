/**
 * Escape Room Page - Polarization Lab Escape Game
 * 密室逃脱页面 - 偏振实验室逃脱游戏
 *
 * Coming soon placeholder with game concept preview
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import {
  DoorOpen, Lock, Key, Lightbulb,
  Eye, Puzzle, Clock, Users, ArrowLeft
} from 'lucide-react'

// Game concept features
const FEATURES = [
  {
    icon: Lock,
    titleEn: 'Locked Lab',
    titleZh: '密闭实验室',
    descEn: 'You wake up in a mysterious optics laboratory. The door is locked with a polarization puzzle.',
    descZh: '你醒来发现自己身处一间神秘的光学实验室。大门被偏振谜题锁住了。',
  },
  {
    icon: Puzzle,
    titleEn: 'Physics Puzzles',
    titleZh: '物理谜题',
    descEn: 'Solve puzzles using real polarization principles: Malus\'s Law, birefringence, and more.',
    descZh: '运用真实的偏振物理原理解谜：马吕斯定律、双折射等。',
  },
  {
    icon: Key,
    titleEn: 'Find Clues',
    titleZh: '寻找线索',
    descEn: 'Examine lab equipment, read notes, and discover hidden clues using polarized light.',
    descZh: '检查实验设备，阅读笔记，用偏振光发现隐藏的线索。',
  },
  {
    icon: Eye,
    titleEn: 'Special Vision',
    titleZh: '特殊视觉',
    descEn: 'Use polarized glasses to reveal hidden messages and secret patterns.',
    descZh: '使用偏振眼镜揭示隐藏的信息和秘密图案。',
  },
  {
    icon: Clock,
    titleEn: 'Time Challenge',
    titleZh: '限时挑战',
    descEn: 'Race against the clock to escape before the lab security system activates.',
    descZh: '在实验室安全系统启动前逃离，与时间赛跑。',
  },
  {
    icon: Users,
    titleEn: 'Multiplayer',
    titleZh: '多人合作',
    descEn: 'Planned: Team up with friends to solve complex multi-room puzzles together.',
    descZh: '计划中：与朋友组队，共同解决复杂的多房间谜题。',
  },
]

// Room preview concept
function RoomPreview() {
  const { theme } = useTheme()

  return (
    <div className={cn(
      'relative rounded-2xl overflow-hidden aspect-video max-w-2xl mx-auto',
      theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
    )}>
      {/* SVG Room illustration */}
      <svg viewBox="0 0 600 400" className="w-full h-full">
        {/* Background */}
        <rect width="600" height="400" fill={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />

        {/* Floor */}
        <rect x="50" y="280" width="500" height="100" fill={theme === 'dark' ? '#334155' : '#e2e8f0'} />
        <path d="M50,280 L100,320 L550,320 L550,380 L50,380 Z" fill={theme === 'dark' ? '#475569' : '#cbd5e1'} />

        {/* Back wall */}
        <rect x="50" y="50" width="500" height="230" fill={theme === 'dark' ? '#475569' : '#e2e8f0'} />

        {/* Door (locked) */}
        <rect x="250" y="100" width="100" height="180" fill={theme === 'dark' ? '#64748b' : '#94a3b8'} rx="2" />
        <circle cx="330" cy="200" r="8" fill="#fbbf24" />
        <rect x="268" y="150" width="64" height="20" fill={theme === 'dark' ? '#475569' : '#64748b'} rx="2" />
        {/* Lock icon */}
        <rect x="292" y="185" width="16" height="14" fill={theme === 'dark' ? '#1e293b' : '#334155'} rx="2" />
        <path d="M295,185 L295,180 A5,5 0 0,1 305,180 L305,185" fill="none" stroke={theme === 'dark' ? '#1e293b' : '#334155'} strokeWidth="3" />

        {/* Lab equipment - optical bench */}
        <rect x="80" y="200" width="120" height="80" fill={theme === 'dark' ? '#64748b' : '#94a3b8'} rx="4" />
        {/* Laser emitter */}
        <rect x="90" y="220" width="30" height="20" fill="#ef4444" />
        <line x1="120" y1="230" x2="180" y2="230" stroke="#ef4444" strokeWidth="3" opacity="0.8">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
        </line>
        {/* Polarizers */}
        <rect x="135" y="215" width="8" height="30" fill="#22d3ee" opacity="0.7" />
        <rect x="160" y="215" width="8" height="30" fill="#22d3ee" opacity="0.7" />

        {/* Bookshelf */}
        <rect x="400" y="100" width="120" height="180" fill={theme === 'dark' ? '#64748b' : '#94a3b8'} />
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <rect x="408" y={110 + i * 45} width="104" height="35" fill={theme === 'dark' ? '#475569' : '#64748b'} />
            {/* Books */}
            <rect x={415 + (i % 3) * 25} y={115 + i * 45} width="20" height="25" fill={['#ef4444', '#22d3ee', '#a855f7', '#eab308'][i]} />
            <rect x={440 + (i % 2) * 30} y={115 + i * 45} width="15" height="25" fill={['#22d3ee', '#a855f7', '#eab308', '#ef4444'][(i + 1) % 4]} />
          </g>
        ))}

        {/* Lightbulb (hint) */}
        <circle cx="300" cy="40" r="15" fill="#fbbf24" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        <line x1="300" y1="55" x2="300" y2="70" stroke="#fbbf24" strokeWidth="2" />

        {/* Mysterious symbols on wall */}
        <text x="380" y="90" fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize="12" opacity="0.5">
          I = I₀cos²θ
        </text>

        {/* Floor arrows/hints */}
        <path d="M150,350 L170,340 L170,360 Z" fill="#a855f7" opacity="0.4" />
        <path d="M200,350 L220,340 L220,360 Z" fill="#a855f7" opacity="0.4" />
      </svg>

      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          'px-6 py-3 rounded-full backdrop-blur-sm',
          theme === 'dark' ? 'bg-black/50' : 'bg-white/70'
        )}>
          <span className={cn(
            'text-lg font-bold',
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          )}>
            Concept Preview
          </span>
        </div>
      </div>
    </div>
  )
}

export function EscapeRoomPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
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
            {/* Left: Back link */}
            <Link
              to="/games"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isZh ? '返回游戏中心' : 'Back to Games'}</span>
            </Link>

            {/* Center: Title */}
            <div className="flex items-center gap-2">
              <DoorOpen className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )} />
              <h1 className={cn(
                'text-lg sm:text-xl font-bold',
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              )}>
                {isZh ? '密室逃脱' : 'Escape Room'}
              </h1>
            </div>

            {/* Right: Settings */}
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Coming soon banner */}
        <div className={cn(
          'text-center mb-8 p-6 rounded-2xl border-2 border-dashed',
          theme === 'dark'
            ? 'border-purple-500/30 bg-purple-500/5'
            : 'border-purple-300 bg-purple-50'
        )}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 mb-4">
            <Lightbulb className="w-5 h-5" />
            <span className="font-semibold">
              {isZh ? '开发中' : 'In Development'}
            </span>
          </div>
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '偏振实验室密室逃脱' : 'Polarization Lab Escape'}
          </h2>
          <p className={cn(
            'text-base max-w-xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '一款结合偏振光物理的沉浸式密室逃脱游戏，敬请期待！'
              : 'An immersive escape room game combining polarization physics — coming soon!'}
          </p>
        </div>

        {/* Room preview */}
        <div className="mb-12">
          <RoomPreview />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={cn(
                  'p-5 rounded-xl border transition-all hover:-translate-y-0.5',
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                  theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                )}>
                  <Icon className={cn(
                    'w-5 h-5',
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  )} />
                </div>
                <h3 className={cn(
                  'font-semibold mb-1',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? feature.titleZh : feature.titleEn}
                </h3>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {isZh ? feature.descZh : feature.descEn}
                </p>
              </div>
            )
          })}
        </div>

        {/* Back to games link */}
        <div className="text-center">
          <Link
            to="/games"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:-translate-y-0.5',
              'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            {isZh ? '返回游戏中心' : 'Back to Game Hub'}
          </Link>
        </div>
      </main>
    </div>
  )
}
