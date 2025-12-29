/**
 * Card Game Page - PolarQuest Polarization Card Game
 * 卡片桌游页面 - 偏振探秘卡牌游戏
 */

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import {
  Home, Layers, BookOpen,
  ChevronRight, Users, Clock, Target,
  Lightbulb, Zap, Star, Sparkles
} from 'lucide-react'

// Data imports
import {
  ALL_CARDS, CARD_TYPE_LABELS, RARITY_LABELS, CARD_SUMMARY,
  CLASSROOM_RULES, COMPETITIVE_RULES, MISSIONS, QUICK_REFERENCE
} from '@/data'
import type { GameCard, GameRules } from '@/data/types'

// Shared components
import {
  SearchInput, FilterSelect, FilterBar, Tabs, Badge,
  Card, ExpandableCard,
  EmptyState, PrintButton, ActionBar
} from '@/components/shared'

// ===== Card Visual Component =====
interface GameCardVisualProps {
  card: GameCard
  size?: 'sm' | 'md' | 'lg'
  showBack?: boolean
  onClick?: () => void
}

function GameCardVisual({ card, size = 'md', showBack = false, onClick }: GameCardVisualProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const typeInfo = CARD_TYPE_LABELS[card.type]
  const rarityInfo = RARITY_LABELS[card.rarity]

  const sizeClasses = {
    sm: 'w-28 h-40 sm:w-32 sm:h-44',
    md: 'w-36 h-48 sm:w-48 sm:h-64',
    lg: 'w-52 h-72 sm:w-64 sm:h-88'
  }

  const typeColors = {
    'light-source': 'from-yellow-500 to-orange-500',
    'optical-element': 'from-cyan-500 to-blue-500',
    'effect': 'from-purple-500 to-pink-500',
    'mission': 'from-green-500 to-emerald-500',
    'event': 'from-orange-500 to-red-500'
  }

  const rarityBorders = {
    common: 'border-gray-400',
    uncommon: 'border-green-400',
    rare: 'border-blue-400',
    legendary: 'border-orange-400 shadow-lg shadow-orange-500/20'
  }

  // Card artwork based on type
  const CardArtwork = () => {
    switch (card.artworkType) {
      case 'emitter':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <circle cx="20" cy="30" r="12" fill="#fbbf24" />
            <line x1="32" y1="30" x2="70" y2="30" stroke="#fbbf24" strokeWidth="4" />
            <polygon points="70,30 60,24 60,36" fill="#fbbf24" />
          </svg>
        )
      case 'polarizer':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <rect x="25" y="10" width="30" height="40" fill="none" stroke="#22d3ee" strokeWidth="3" rx="4" />
            {[0, 10, 20, 30, 40].map(y => (
              <line key={y} x1="30" y1={15 + y * 0.8} x2="50" y2={15 + y * 0.8} stroke="#22d3ee" strokeWidth="2" opacity="0.6" />
            ))}
          </svg>
        )
      case 'rotator':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <circle cx="40" cy="30" r="20" fill="none" stroke="#a78bfa" strokeWidth="3" />
            <path d="M40 10 A20 20 0 0 1 60 30" fill="none" stroke="#a78bfa" strokeWidth="5" />
            <polygon points="60,30 55,22 50,30" fill="#a78bfa" />
          </svg>
        )
      case 'splitter':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <path d="M25,15 L55,15 L60,45 L20,45 Z" fill="#22d3ee" fillOpacity="0.3" stroke="#22d3ee" strokeWidth="2" />
            <line x1="10" y1="30" x2="30" y2="30" stroke="#fbbf24" strokeWidth="2" />
            <line x1="50" y1="20" x2="70" y2="15" stroke="#ff4444" strokeWidth="2" />
            <line x1="50" y1="40" x2="70" y2="45" stroke="#44ff44" strokeWidth="2" />
          </svg>
        )
      case 'mirror':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <rect x="35" y="10" width="10" height="40" fill="#64748b" rx="2" />
            <line x1="15" y1="45" x2="40" y2="30" stroke="#fbbf24" strokeWidth="2" />
            <line x1="40" y1="30" x2="65" y2="45" stroke="#22d3ee" strokeWidth="2" />
          </svg>
        )
      case 'sensor':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <rect x="25" y="15" width="30" height="30" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="2" rx="4" />
            <circle cx="40" cy="30" r="8" fill="#22c55e" />
          </svg>
        )
      case 'wave':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <path d="M10,30 Q25,10 40,30 T70,30" fill="none" stroke="#a78bfa" strokeWidth="3" />
            <path d="M10,35 Q25,55 40,35 T70,35" fill="none" stroke="#22d3ee" strokeWidth="3" />
          </svg>
        )
      case 'interference':
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            {[0, 1, 2, 3].map(i => (
              <circle key={i} cx="40" cy="30" r={10 + i * 8} fill="none" stroke={i % 2 ? '#22d3ee' : '#a78bfa'} strokeWidth="2" opacity={0.6 - i * 0.1} />
            ))}
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 80 60" className="w-full h-full">
            <circle cx="40" cy="30" r="15" fill="#64748b" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
            <text x="40" y="35" textAnchor="middle" fill="#64748b" fontSize="16">?</text>
          </svg>
        )
    }
  }

  if (showBack) {
    return (
      <div className={cn(
        sizeClasses[size],
        'rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600',
        'flex items-center justify-center cursor-pointer hover:scale-105 transition-transform'
      )}
      onClick={onClick}
      >
        <div className="text-4xl">⟡</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-xl overflow-hidden border-2 transition-all',
        `bg-gradient-to-br ${typeColors[card.type]}`,
        rarityBorders[card.rarity],
        onClick && 'cursor-pointer hover:scale-105 hover:shadow-xl'
      )}
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="bg-black/30 px-2 py-1 flex items-center justify-between">
        <span className="text-white text-xs font-bold truncate flex-1">
          {isZh ? card.nameZh : card.name}
        </span>
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
          {card.cost}
        </span>
      </div>

      {/* Card Art */}
      <div className="h-16 bg-black/20 flex items-center justify-center p-2">
        <CardArtwork />
      </div>

      {/* Card Type */}
      <div className="bg-black/30 px-2 py-0.5 text-center">
        <span className="text-white/80 text-[10px] uppercase tracking-wide">
          {isZh ? typeInfo.labelZh : typeInfo.label}
        </span>
      </div>

      {/* Card Text */}
      <div className="flex-1 bg-white/90 dark:bg-slate-800/90 p-2">
        <p className="text-[9px] text-gray-700 dark:text-gray-300 line-clamp-3">
          {isZh ? card.descriptionZh : card.description}
        </p>
        {card.opticalConcept && (
          <p className="text-[8px] text-cyan-600 dark:text-cyan-400 mt-1 italic line-clamp-2">
            {isZh ? card.opticalConceptZh : card.opticalConcept}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="bg-black/30 px-2 py-1 flex items-center justify-between">
        <span className="text-[9px] text-white/60 capitalize">{rarityInfo.label}</span>
        {card.polarizationAngle !== undefined && (
          <Badge color="cyan" size="sm" className="text-[8px]">{card.polarizationAngle}°</Badge>
        )}
      </div>
    </div>
  )
}

// ===== Rules Section =====
interface RulesSectionProps {
  rules: GameRules
}

function RulesSection({ rules }: RulesSectionProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-6">
      {/* Game Info */}
      <div className="flex flex-wrap gap-4">
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        )}>
          <Users className="w-5 h-5 text-cyan-500" />
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            {rules.playerCount.min}-{rules.playerCount.max} {isZh ? '人' : 'players'}
          </span>
        </div>
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        )}>
          <Clock className="w-5 h-5 text-purple-500" />
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            {rules.duration.min}-{rules.duration.max} {isZh ? '分钟' : 'min'}
          </span>
        </div>
      </div>

      {/* Setup */}
      <div>
        <h3 className={cn(
          'font-semibold mb-3 flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <Layers className="w-5 h-5 text-cyan-500" />
          {isZh ? '游戏准备' : 'Setup'}
        </h3>
        <ol className={cn(
          'space-y-2 text-sm',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {(isZh ? rules.setupStepsZh : rules.setupSteps).map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 flex-shrink-0 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Turn Phases */}
      <div>
        <h3 className={cn(
          'font-semibold mb-3 flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <Zap className="w-5 h-5 text-yellow-500" />
          {isZh ? '回合流程' : 'Turn Phases'}
        </h3>
        <div className="space-y-3">
          {rules.turnPhases.map((phase, i) => (
            <ExpandableCard
              key={i}
              title={isZh ? phase.nameZh : phase.name}
              subtitle={isZh ? phase.descriptionZh : phase.description}
              icon={<span className="text-cyan-500 font-bold">{i + 1}</span>}
            >
              <ul className={cn(
                'space-y-1 text-sm',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {(isZh ? phase.actionsZh : phase.actions).map((action, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                    {action}
                  </li>
                ))}
              </ul>
            </ExpandableCard>
          ))}
        </div>
      </div>

      {/* Victory Conditions */}
      <div>
        <h3 className={cn(
          'font-semibold mb-3 flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <Target className="w-5 h-5 text-green-500" />
          {isZh ? '胜利条件' : 'Victory Conditions'}
        </h3>
        <ul className={cn(
          'space-y-2 text-sm',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {(isZh ? rules.victoryConditionsZh : rules.victoryConditions).map((condition, i) => (
            <li key={i} className="flex items-start gap-2">
              <Star className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-500" />
              {condition}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ===== Mission Table =====
function MissionTable() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={cn(
            'border-b',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <th className="text-left py-2 px-3">{isZh ? '任务' : 'Mission'}</th>
            <th className="text-center py-2 px-3">{isZh ? '难度' : 'Difficulty'}</th>
            <th className="text-left py-2 px-3">{isZh ? '光学概念' : 'Optical Concept'}</th>
            <th className="text-center py-2 px-3">{isZh ? '奖励' : 'Reward'}</th>
          </tr>
        </thead>
        <tbody>
          {MISSIONS.map(mission => (
            <tr
              key={mission.id}
              className={cn(
                'border-b',
                theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
              )}
            >
              <td className="py-2 px-3">
                <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {isZh ? mission.nameZh : mission.name}
                </div>
                <div className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? mission.descriptionZh : mission.description}
                </div>
              </td>
              <td className="py-2 px-3 text-center">
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < mission.difficulty ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
              </td>
              <td className="py-2 px-3">
                <span className={cn(
                  'text-xs italic',
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                )}>
                  {isZh ? mission.opticalConceptZh : mission.opticalConcept}
                </span>
              </td>
              <td className="py-2 px-3 text-center">
                <Badge color="green" size="sm">{mission.reward} pts</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== Print Layout for Cards =====
interface PrintLayoutProps {
  cards: GameCard[]
}

function PrintLayout({ cards }: PrintLayoutProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="hidden print:block">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isZh ? '偏振探秘卡牌' : 'PolarQuest Cards'} ({cards.length})
      </h1>
      <div className="grid grid-cols-3 gap-2">
        {cards.map(card => (
          <div key={card.id} className="border border-gray-400 rounded p-2 text-xs break-inside-avoid">
            <div className="font-bold flex justify-between">
              <span>{isZh ? card.nameZh : card.name}</span>
              <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
                {card.cost}
              </span>
            </div>
            <div className="text-gray-500 text-[10px] uppercase">
              {isZh ? CARD_TYPE_LABELS[card.type].labelZh : CARD_TYPE_LABELS[card.type].label}
            </div>
            <div className="mt-1 text-[10px]">
              {isZh ? card.descriptionZh : card.description}
            </div>
            {card.opticalConcept && (
              <div className="mt-1 text-[10px] italic text-gray-600">
                {isZh ? card.opticalConceptZh : card.opticalConcept}
              </div>
            )}
            <div className="mt-1 text-[9px] text-gray-400">
              {RARITY_LABELS[card.rarity].label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== Main Card Game Page =====
export function CardGamePage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // State
  const [activeTab, setActiveTab] = useState('rules')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState('')
  const [ruleMode, setRuleMode] = useState<'classroom' | 'competitive'>('classroom')
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null)

  // Filtered cards
  const filteredCards = useMemo(() => {
    return ALL_CARDS.filter(card => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = card.name.toLowerCase().includes(query) ||
                         card.nameZh.includes(query)
        const matchDesc = card.description.toLowerCase().includes(query) ||
                         card.descriptionZh.includes(query)
        if (!matchName && !matchDesc) return false
      }
      if (typeFilter && card.type !== typeFilter) return false
      if (rarityFilter && card.rarity !== rarityFilter) return false
      return true
    })
  }, [searchQuery, typeFilter, rarityFilter])

  // Tabs
  const tabs = [
    { id: 'rules', label: 'Rules', labelZh: '游戏规则', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'cards', label: 'Cards', labelZh: '卡牌浏览', icon: <Layers className="w-4 h-4" /> },
    { id: 'missions', label: 'Missions', labelZh: '任务关卡', icon: <Target className="w-4 h-4" /> },
    { id: 'reference', label: 'Reference', labelZh: '快速参考', icon: <Lightbulb className="w-4 h-4" /> }
  ]

  // Filter options
  const typeOptions = Object.entries(CARD_TYPE_LABELS).map(([key, val]) => ({
    value: key,
    label: val.label,
    labelZh: val.labelZh
  }))

  const rarityOptions = Object.entries(RARITY_LABELS).map(([key, val]) => ({
    value: key,
    label: val.label,
    labelZh: val.labelZh
  }))

  const currentRules = ruleMode === 'classroom' ? CLASSROOM_RULES : COMPETITIVE_RULES

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{isZh ? '首页' : 'Home'}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h1 className={cn(
                'text-lg font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振探秘' : 'PolarQuest'}
              </h1>
            </div>
          </div>
          <LanguageThemeSwitcher compact />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Game Overview */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className={cn(
                'text-xl font-bold mb-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振探秘卡牌游戏' : 'PolarQuest Card Game'}
              </h2>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? '一款基于偏振光原理的教育桌游。通过收集光源、配置光学元件、完成任务来学习马吕斯定律、双折射等光学概念。'
                  : 'An educational tabletop game based on polarization physics. Collect light sources, configure optical elements, and complete missions to learn Malus\'s Law, birefringence, and more.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge color="purple" size="md">{CARD_SUMMARY.total} {isZh ? '张卡牌' : 'cards'}</Badge>
              <Badge color="cyan" size="md">{MISSIONS.length} {isZh ? '个任务' : 'missions'}</Badge>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="print:hidden" />

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <ActionBar>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setRuleMode('classroom')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    ruleMode === 'classroom'
                      ? 'bg-green-500 text-white'
                      : theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  )}
                >
                  {isZh ? '课堂模式' : 'Classroom Mode'}
                </button>
                <button
                  onClick={() => setRuleMode('competitive')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    ruleMode === 'competitive'
                      ? 'bg-orange-500 text-white'
                      : theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  )}
                >
                  {isZh ? '竞技模式' : 'Competitive Mode'}
                </button>
              </div>
            </ActionBar>

            <Card>
              <RulesSection rules={currentRules} />
            </Card>
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="space-y-4">
            <FilterBar>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={isZh ? '搜索卡牌...' : 'Search cards...'}
                className="w-full sm:w-64"
              />
              <FilterSelect
                label="Type"
                labelZh="类型"
                value={typeFilter}
                options={typeOptions}
                onChange={setTypeFilter}
              />
              <FilterSelect
                label="Rarity"
                labelZh="稀有度"
                value={rarityFilter}
                options={rarityOptions}
                onChange={setRarityFilter}
              />
              <div className="flex-1" />
              <PrintButton onClick={() => window.print()} />
            </FilterBar>

            {/* Card Stats */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(CARD_TYPE_LABELS).map(([type, info]) => {
                const count = ALL_CARDS.filter(c => c.type === type).length
                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(typeFilter === type ? '' : type)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      typeFilter === type
                        ? 'bg-cyan-500 text-white'
                        : theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {isZh ? info.labelZh : info.label}: {count}
                  </button>
                )
              })}
            </div>

            {/* Cards Grid */}
            {filteredCards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCards.map(card => (
                  <GameCardVisual
                    key={card.id}
                    card={card}
                    size="md"
                    onClick={() => setSelectedCard(card)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Layers className="w-8 h-8 text-gray-400" />}
                title={isZh ? '未找到卡牌' : 'No cards found'}
                description={isZh ? '尝试调整搜索条件' : 'Try adjusting your filters'}
              />
            )}

            {/* Print Layout */}
            <PrintLayout cards={filteredCards} />
          </div>
        )}

        {/* Missions Tab */}
        {activeTab === 'missions' && (
          <Card>
            <h2 className={cn(
              'text-lg font-bold mb-4 flex items-center gap-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              <Target className="w-5 h-5 text-green-500" />
              {isZh ? '任务与光学概念映射' : 'Mission-Concept Mapping'}
            </h2>
            <MissionTable />
          </Card>
        )}

        {/* Reference Tab */}
        {activeTab === 'reference' && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <h3 className={cn(
                'font-bold mb-4',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '马吕斯定律' : 'Malus\'s Law'}
              </h3>
              <div className={cn(
                'text-2xl font-mono text-center py-4 rounded-lg mb-4',
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
              )}>
                <span className="text-cyan-500">{QUICK_REFERENCE.malusLaw}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className={cn(
                    'border-b',
                    theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                  )}>
                    <th className="text-left py-2">{isZh ? '角度' : 'Angle'} (θ)</th>
                    <th className="text-center py-2">cos²(θ)</th>
                    <th className="text-right py-2">{isZh ? '透过率' : 'Transmission'}</th>
                  </tr>
                </thead>
                <tbody>
                  {QUICK_REFERENCE.commonAngles.map(item => (
                    <tr key={item.angle} className={cn(
                      'border-b',
                      theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
                    )}>
                      <td className="py-2">{item.angle}°</td>
                      <td className="py-2 text-center">{item.cosSq}</td>
                      <td className="py-2 text-right font-medium text-cyan-500">{item.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card>
              <h3 className={cn(
                'font-bold mb-4',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振颜色编码' : 'Polarization Colors'}
              </h3>
              <div className="space-y-3">
                {Object.entries(QUICK_REFERENCE.polarizationColors).map(([angle, color]) => (
                  <div key={angle} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: color }}
                    />
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {angle}°
                    </span>
                    <span className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {angle === '0' && (isZh ? '水平' : 'Horizontal')}
                      {angle === '45' && '45°'}
                      {angle === '90' && (isZh ? '垂直' : 'Vertical')}
                      {angle === '135' && '135°'}
                    </span>
                    <span className="ml-auto font-mono text-sm text-gray-500">{color}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className={cn(
              'max-w-sm w-full rounded-xl p-6',
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            )}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <GameCardVisual card={selectedCard} size="lg" />
            </div>

            <h3 className={cn(
              'text-lg font-bold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? selectedCard.nameZh : selectedCard.name}
            </h3>

            <div className="flex gap-2 mb-3">
              <Badge color={CARD_TYPE_LABELS[selectedCard.type].color}>
                {isZh ? CARD_TYPE_LABELS[selectedCard.type].labelZh : CARD_TYPE_LABELS[selectedCard.type].label}
              </Badge>
              <Badge color={RARITY_LABELS[selectedCard.rarity].color}>
                {isZh ? RARITY_LABELS[selectedCard.rarity].labelZh : RARITY_LABELS[selectedCard.rarity].label}
              </Badge>
            </div>

            <p className={cn(
              'text-sm mb-3',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {isZh ? selectedCard.descriptionZh : selectedCard.description}
            </p>

            {selectedCard.effects.length > 0 && (
              <div className="mb-3">
                <h4 className={cn(
                  'text-sm font-semibold mb-1',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '效果' : 'Effects'}
                </h4>
                <ul className={cn(
                  'text-sm space-y-1',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {selectedCard.effects.map((effect, i) => (
                    <li key={i}>• {isZh ? effect.descriptionZh : effect.description}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedCard.opticalConcept && (
              <div className={cn(
                'text-sm p-3 rounded-lg italic',
                theme === 'dark' ? 'bg-cyan-900/20 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
              )}>
                {isZh ? selectedCard.opticalConceptZh : selectedCard.opticalConcept}
              </div>
            )}

            <button
              onClick={() => setSelectedCard(null)}
              className={cn(
                'w-full mt-4 py-2 rounded-lg font-medium transition-colors',
                theme === 'dark'
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              )}
            >
              {isZh ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardGamePage
