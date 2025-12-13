/**
 * Sidebar Component - 侧边栏组件
 *
 * Left sidebar with tabs for:
 * - Experiments: Classic experiments to load
 * - Design: Component palette for free design
 * - Challenges: Puzzle challenges with goals
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/shared'
import {
  Play, Eye, ChevronRight, ChevronLeft,
  FlaskConical, Wrench, Target, GraduationCap,
  CheckCircle2
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import {
  CLASSIC_EXPERIMENTS,
  CHALLENGES,
  TUTORIALS,
  PALETTE_COMPONENTS,
  DIFFICULTY_CONFIG,
} from '@/data'
import type { ClassicExperiment, Challenge, Tutorial } from '@/stores/opticalBenchStore'

type SidebarTab = 'experiments' | 'design' | 'challenges' | 'tutorials'

// ============================================
// Experiment Card Component
// ============================================

interface ExperimentCardProps {
  experiment: ClassicExperiment
  onLoad: () => void
}

function ExperimentCard({ experiment, onLoad }: ExperimentCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all hover:shadow-md',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className={cn(
          'font-medium text-sm line-clamp-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? experiment.nameZh : experiment.nameEn}
        </h4>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <p className={cn(
        'text-xs mb-2 line-clamp-2',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onLoad}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
          )}
        >
          <Play className="w-3 h-3" />
          {isZh ? '加载' : 'Load'}
        </button>
        {experiment.linkedDemo && (
          <Link
            to={`/demos?demo=${experiment.linkedDemo}`}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-gray-100'
            )}
            title={isZh ? '查看演示' : 'View Demo'}
          >
            <Eye className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  )
}

// ============================================
// Challenge Card Component
// ============================================

interface ChallengeCardProps {
  challenge: Challenge
  onLoad: () => void
  isCompleted?: boolean
}

function ChallengeCard({ challenge, onLoad, isCompleted }: ChallengeCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[challenge.difficulty]

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all hover:shadow-md',
      isCompleted
        ? theme === 'dark'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-emerald-50 border-emerald-200'
        : theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700'
          : 'bg-white border-gray-200'
    )}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          <h4 className={cn(
            'font-medium text-sm line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? challenge.nameZh : challenge.nameEn}
          </h4>
        </div>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <p className={cn(
        'text-xs mb-2 line-clamp-2',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? challenge.descriptionZh : challenge.descriptionEn}
      </p>
      <div className={cn(
        'p-2 rounded-lg mb-2 text-xs',
        theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
      )}>
        <strong>{isZh ? '目标：' : 'Goal: '}</strong>
        {isZh ? challenge.goal.zh : challenge.goal.en}
      </div>
      <button
        onClick={onLoad}
        className={cn(
          'w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
          theme === 'dark'
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
        )}
      >
        <Target className="w-3 h-3" />
        {isZh ? '开始挑战' : 'Start Challenge'}
      </button>
    </div>
  )
}

// ============================================
// Tutorial Card Component
// ============================================

interface TutorialCardProps {
  tutorial: Tutorial
  onStart: () => void
}

function TutorialCard({ tutorial, onStart }: TutorialCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all hover:shadow-md',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className={cn('w-4 h-4', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
        <h4 className={cn(
          'font-medium text-sm',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? tutorial.nameZh : tutorial.nameEn}
        </h4>
      </div>
      <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {tutorial.steps.length} {isZh ? '步骤' : 'steps'}
      </p>
      <button
        onClick={onStart}
        className={cn(
          'w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
          theme === 'dark'
            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
        )}
      >
        <GraduationCap className="w-3 h-3" />
        {isZh ? '开始教程' : 'Start Tutorial'}
      </button>
    </div>
  )
}

// ============================================
// Component Palette (Design Tab)
// ============================================

function ComponentPalette() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const addComponent = useOpticalBenchStore(state => state.addComponent)

  return (
    <div className="space-y-3">
      <p className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
        {isZh ? '点击或拖动添加组件' : 'Click or drag to add components'}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PALETTE_COMPONENTS.map((item, index) => (
          <button
            key={item.type}
            data-component={item.type}
            onClick={() => addComponent(item.type)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all hover:scale-105',
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 hover:border-violet-500/50'
                : 'bg-white border-gray-200 hover:border-violet-400'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? item.nameZh : item.nameEn}
            </span>
            <kbd className={cn(
              'text-[10px] px-1.5 py-0.5 rounded',
              theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            )}>
              {index + 1}
            </kbd>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Main Sidebar Component
// ============================================

interface SidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [activeTab, setActiveTab] = useState<SidebarTab>('experiments')

  const {
    loadExperiment,
    loadChallenge,
    startTutorial,
    currentChallenge,
    challengeCompleted,
  } = useOpticalBenchStore()

  const tabs: { id: SidebarTab; icon: typeof FlaskConical; labelEn: string; labelZh: string }[] = [
    { id: 'experiments', icon: FlaskConical, labelEn: 'Experiments', labelZh: '实验' },
    { id: 'design', icon: Wrench, labelEn: 'Design', labelZh: '设计' },
    { id: 'challenges', icon: Target, labelEn: 'Challenges', labelZh: '挑战' },
    { id: 'tutorials', icon: GraduationCap, labelEn: 'Tutorials', labelZh: '教程' },
  ]

  return (
    <aside className={cn(
      'flex flex-col flex-shrink-0 border-r transition-all duration-300',
      collapsed ? 'w-12' : 'w-72',
      theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-gray-200'
    )}>
      {/* Tab Selector */}
      <div className={cn(
        'flex items-center gap-1 p-2 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        {!collapsed && tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
              activeTab === tab.id
                ? theme === 'dark'
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-violet-100 text-violet-700'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isZh ? tab.labelZh : tab.labelEn}</span>
          </button>
        ))}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === 'experiments' && (
            <div className="space-y-2">
              <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                {isZh ? '选择经典实验加载到光路' : 'Select an experiment to load'}
              </p>
              {CLASSIC_EXPERIMENTS.map(exp => (
                <ExperimentCard
                  key={exp.id}
                  experiment={exp}
                  onLoad={() => loadExperiment(exp)}
                />
              ))}
            </div>
          )}

          {activeTab === 'design' && <ComponentPalette />}

          {activeTab === 'challenges' && (
            <div className="space-y-2">
              <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                {isZh ? '完成目标解锁更多挑战' : 'Complete goals to unlock more'}
              </p>
              {CHALLENGES.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onLoad={() => loadChallenge(challenge)}
                  isCompleted={currentChallenge?.id === challenge.id && challengeCompleted}
                />
              ))}
            </div>
          )}

          {activeTab === 'tutorials' && (
            <div className="space-y-2">
              <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                {isZh ? '交互式教程帮助入门' : 'Interactive tutorials to get started'}
              </p>
              {TUTORIALS.map(tutorial => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  onStart={() => startTutorial(tutorial)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export default Sidebar
