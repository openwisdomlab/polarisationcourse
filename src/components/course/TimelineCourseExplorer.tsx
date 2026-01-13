/**
 * TimelineCourseExplorer - 时间线与课程大纲的整合探索组件
 *
 * 设计理念：
 * - 双轨时间线展示（广义光学 + 偏振光）
 * - 时代卡片导航（点击进入不同历史时期）
 * - P-SRT问题牵引学习
 * - 好奇心触发卡片
 * - 动手实验与生活场景
 */

import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  Sun,
  FlaskConical,
  Lightbulb,
  BookOpen,
  Play,
  Eye,
  ExternalLink,
  ArrowRight,
  Beaker,
  HelpCircle,
  Compass,
  History,
} from 'lucide-react'

import {
  HISTORICAL_ERAS,
  COURSE_TIMELINE_MAPPINGS,
  PSRT_QUESTIONS,
  CURIOSITY_CARDS,
  getTimelineEventsForEra,
  type HistoricalEra,
  type CourseTimelineMapping,
  type PSRTLearningPath,
  type CuriosityCard,
} from '@/data/course-timeline-integration'
import { type TimelineEvent } from '@/data/timeline-events'

// ============================================================================
// 时代导航卡片 - 点击展开历史时期
// ============================================================================

interface EraCardProps {
  era: HistoricalEra
  isSelected: boolean
  onSelect: () => void
  theme: 'dark' | 'light'
  isZh: boolean
}

function EraCard({ era, isSelected, onSelect, theme, isZh }: EraCardProps) {
  const events = getTimelineEventsForEra(era.id)
  const polarizationCount = events.filter(e => e.track === 'polarization').length
  const opticsCount = events.filter(e => e.track === 'optics').length

  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        'relative w-full text-left rounded-2xl p-4 border-2 transition-all duration-300 overflow-hidden',
        isSelected
          ? theme === 'dark'
            ? 'bg-slate-800 border-transparent'
            : 'bg-white border-transparent'
          : theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
            : 'bg-white/80 border-gray-200 hover:border-gray-300'
      )}
      style={{
        borderColor: isSelected ? era.themeColor : undefined,
        boxShadow: isSelected ? `0 8px 32px ${era.themeColor}30` : undefined,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 背景光晕 */}
      {isSelected && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${era.themeColor}, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* 时代图标和名称 */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{era.icon}</span>
          <div>
            <h3 className={cn(
              'font-bold text-base',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? era.nameZh : era.nameEn}
            </h3>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              {era.startYear} - {era.endYear === 2030 ? (isZh ? '至今' : 'Present') : era.endYear}
            </p>
          </div>
        </div>

        {/* 描述 */}
        <p className={cn(
          'text-sm mb-3 line-clamp-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? era.descriptionZh : era.descriptionEn}
        </p>

        {/* 双轨统计 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className={cn(
              'text-xs font-medium',
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            )}>
              {opticsCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span className={cn(
              'text-xs font-medium',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              {polarizationCount}
            </span>
          </div>
          <ChevronRight className={cn(
            'w-4 h-4 ml-auto transition-transform',
            isSelected ? 'rotate-90' : '',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
        </div>
      </div>
    </motion.button>
  )
}

// ============================================================================
// 时间线事件卡片
// ============================================================================

interface TimelineEventCardProps {
  event: TimelineEvent
  theme: 'dark' | 'light'
  isZh: boolean
  compact?: boolean
}

function TimelineEventCard({ event, theme, isZh, compact = false }: TimelineEventCardProps) {
  const [expanded, setExpanded] = useState(false)

  const trackColor = event.track === 'optics' ? '#F59E0B' : '#22D3EE'
  const trackBg = event.track === 'optics'
    ? theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
    : theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50'

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-2 rounded-lg transition-colors',
        theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
      )}>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm font-bold"
          style={{ backgroundColor: `${trackColor}15`, color: trackColor }}
        >
          {event.year}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium truncate',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? event.titleZh : event.titleEn}
          </p>
          <p className={cn(
            'text-xs truncate',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          )}>
            {isZh ? event.scientistZh : event.scientistEn}
          </p>
        </div>
        <div className={cn(
          'flex-shrink-0 w-2 h-2 rounded-full',
          event.track === 'optics' ? 'bg-amber-500' : 'bg-cyan-500'
        )} />
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'rounded-xl border overflow-hidden transition-all',
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700'
          : 'bg-white border-gray-200'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        className={cn(
          'w-full p-4 text-left flex items-start gap-4',
          theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* 年份徽章 */}
        <div
          className={cn('flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center', trackBg)}
          style={{ borderLeft: `3px solid ${trackColor}` }}
        >
          <span className="text-lg font-bold" style={{ color: trackColor }}>
            {event.year}
          </span>
          <span className="text-[10px] font-medium" style={{ color: trackColor }}>
            {event.track === 'optics' ? (isZh ? '光学' : 'Optics') : (isZh ? '偏振' : 'Polar')}
          </span>
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-bold text-base mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? event.titleZh : event.titleEn}
          </h4>
          <p className={cn(
            'text-sm mb-2 line-clamp-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? event.descriptionZh : event.descriptionEn}
          </p>
          {event.scientistEn && (
            <p className={cn(
              'text-xs font-medium',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              {event.scientistBio?.portraitEmoji} {isZh ? event.scientistZh : event.scientistEn}
            </p>
          )}
        </div>

        <ChevronDown className={cn(
          'w-5 h-5 flex-shrink-0 transition-transform',
          expanded ? 'rotate-180' : '',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )} />
      </button>

      {/* 展开内容 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'px-4 pb-4 border-t',
              theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
            )}
          >
            {/* 思考问题 */}
            {event.thinkingQuestion && (
              <div className={cn(
                'mt-4 p-3 rounded-lg border-l-4',
                theme === 'dark'
                  ? 'bg-cyan-900/20 border-cyan-500'
                  : 'bg-cyan-50 border-cyan-500'
              )}>
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 flex-shrink-0 text-cyan-500 mt-0.5" />
                  <p className={cn(
                    'text-sm italic',
                    theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                  )}>
                    {isZh ? event.thinkingQuestion.zh : event.thinkingQuestion.en}
                  </p>
                </div>
              </div>
            )}

            {/* 详细信息 */}
            {event.details && (
              <div className="mt-4">
                <ul className="space-y-1">
                  {(isZh ? event.details.zh : event.details.en).map((detail, i) => (
                    <li key={i} className={cn(
                      'text-sm flex items-start gap-2',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      <span style={{ color: trackColor }}>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 故事节选 */}
            {event.story && (
              <div className="mt-4">
                <p className={cn(
                  'text-sm leading-relaxed line-clamp-4',
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {isZh ? event.story.zh.slice(0, 200) : event.story.en.slice(0, 200)}...
                </p>
                <Link
                  to={`/chronicles?year=${event.year}`}
                  className={cn(
                    'inline-flex items-center gap-1 text-sm font-medium mt-2',
                    theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                  )}
                >
                  {isZh ? '阅读完整故事' : 'Read full story'}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// 好奇心触发卡片 - 激发探索欲
// ============================================================================

interface CuriosityTriggerCardProps {
  card: CuriosityCard
  theme: 'dark' | 'light'
  isZh: boolean
}

function CuriosityTriggerCard({ card, theme, isZh }: CuriosityTriggerCardProps) {
  return (
    <Link
      to={card.demoLink}
      className={cn(
        'group block relative rounded-xl p-4 border-2 transition-all overflow-hidden',
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
          : 'bg-white/90 border-gray-200 hover:border-gray-300'
      )}
    >
      {/* 背景动效 */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${card.color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* 图标和难度 */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{card.icon}</span>
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full font-medium',
            card.difficulty === 'easy'
              ? 'bg-green-500/20 text-green-500'
              : card.difficulty === 'medium'
                ? 'bg-amber-500/20 text-amber-500'
                : 'bg-red-500/20 text-red-500'
          )}>
            {card.difficulty === 'easy' ? '🌱' : card.difficulty === 'medium' ? '🔬' : '🚀'}
          </span>
        </div>

        {/* 问题 */}
        <p className={cn(
          'font-medium text-sm mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? card.questionZh : card.questionEn}
        </p>

        {/* 提示 */}
        <p className={cn(
          'text-xs',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )}>
          {isZh ? card.hintZh : card.hintEn}
        </p>

        {/* 探索按钮 */}
        <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: card.color }}>
          <Play className="w-3 h-3" />
          {isZh ? '试一试' : 'Try it'}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

// ============================================================================
// P-SRT 问题卡片
// ============================================================================

interface PSRTQuestionCardProps {
  question: PSRTLearningPath
  theme: 'dark' | 'light'
  isZh: boolean
  onSelect: () => void
  isSelected: boolean
}

function PSRTQuestionCard({ question, theme, isZh, onSelect, isSelected }: PSRTQuestionCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-xl p-4 border-2 transition-all overflow-hidden',
        isSelected
          ? theme === 'dark'
            ? 'bg-slate-800 border-transparent'
            : 'bg-white border-transparent'
          : theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
            : 'bg-white/80 border-gray-200 hover:border-gray-300'
      )}
      style={{
        borderColor: isSelected ? question.color : undefined,
        boxShadow: isSelected ? `0 4px 20px ${question.color}30` : undefined,
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${question.color}20` }}
        >
          {question.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-sm mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? question.questionZh : question.questionEn}
          </p>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
              question.difficulty === 'foundation'
                ? 'bg-green-500/20 text-green-500'
                : question.difficulty === 'application'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-violet-500/20 text-violet-500'
            )}>
              {question.difficulty === 'foundation' ? '🌱' : question.difficulty === 'application' ? '🔬' : '🚀'}
            </span>
            <span className={cn(
              'text-[10px]',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {isZh ? `单元 ${question.relatedUnits.join(', ')}` : `Unit ${question.relatedUnits.join(', ')}`}
            </span>
          </div>
        </div>
        <ChevronRight className={cn(
          'w-4 h-4 flex-shrink-0 transition-transform',
          isSelected ? 'rotate-90' : '',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )} />
      </div>
    </motion.button>
  )
}

// ============================================================================
// 课程单元与时间线映射卡片
// ============================================================================

interface UnitTimelineCardProps {
  mapping: CourseTimelineMapping
  theme: 'dark' | 'light'
  isZh: boolean
}

function UnitTimelineCard({ mapping, theme, isZh }: UnitTimelineCardProps) {
  const [expanded, setExpanded] = useState(false)
  const era = HISTORICAL_ERAS.find(e => e.id === mapping.era)
  const unitColors = ['#22D3EE', '#A78BFA', '#F59E0B', '#EC4899', '#8B5CF6']
  const color = unitColors[(mapping.unitNumber - 1) % unitColors.length]

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden',
      theme === 'dark'
        ? 'bg-slate-800/60 border-slate-700'
        : 'bg-white border-gray-200'
    )}>
      <button
        className={cn(
          'w-full p-4 text-left flex items-center gap-4',
          theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* 单元编号 */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
        >
          {mapping.unitNumber}
        </div>

        {/* 单元信息 */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-bold text-sm mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? mapping.unitTitleZh : mapping.unitTitleEn}
          </h4>
          <p className={cn(
            'text-xs flex items-center gap-2',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          )}>
            <History className="w-3 h-3" />
            {mapping.historicalOriginYear} • {era ? (isZh ? era.nameZh : era.nameEn) : ''}
          </p>
        </div>

        <ChevronDown className={cn(
          'w-5 h-5 flex-shrink-0 transition-transform',
          expanded ? 'rotate-180' : '',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )} />
      </button>

      {/* 展开内容 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn(
              'px-4 pb-4 border-t',
              theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
            )}
          >
            {/* 核心问题 */}
            <div className={cn(
              'mt-4 p-3 rounded-lg border-l-4',
              theme === 'dark'
                ? 'bg-cyan-900/20 border-cyan-500'
                : 'bg-cyan-50 border-cyan-500'
            )}>
              <p className={cn(
                'text-sm italic font-medium',
                theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
              )}>
                🤔 {isZh ? mapping.coreQuestionZh : mapping.coreQuestionEn}
              </p>
            </div>

            {/* 生活场景 */}
            {mapping.lifeSceneExamples.length > 0 && (
              <div className="mt-4">
                <h5 className={cn(
                  'text-xs font-bold mb-2 flex items-center gap-1',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  <Eye className="w-3 h-3" />
                  {isZh ? '生活中的偏振' : 'Polarization in Life'}
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {mapping.lifeSceneExamples.map(scene => (
                    <Link
                      key={scene.id}
                      to={scene.demoLink || '#'}
                      className={cn(
                        'p-2 rounded-lg transition-colors flex items-center gap-2',
                        theme === 'dark'
                          ? 'bg-slate-700/50 hover:bg-slate-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                    >
                      <span className="text-lg">{scene.icon}</span>
                      <span className={cn(
                        'text-xs font-medium truncate',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {isZh ? scene.titleZh : scene.titleEn}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 动手实验 */}
            {mapping.handsOnExperiments.length > 0 && (
              <div className="mt-4">
                <h5 className={cn(
                  'text-xs font-bold mb-2 flex items-center gap-1',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  <Beaker className="w-3 h-3" />
                  {isZh ? '动手试一试' : 'Try It Yourself'}
                </h5>
                <div className="space-y-2">
                  {mapping.handsOnExperiments.map(exp => (
                    <Link
                      key={exp.id}
                      to={exp.demoLink || '#'}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-lg transition-colors',
                        theme === 'dark'
                          ? 'bg-slate-700/50 hover:bg-slate-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                    >
                      <span className="text-lg">{exp.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-xs font-medium',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {isZh ? exp.titleZh : exp.titleEn}
                        </p>
                        <p className={cn(
                          'text-[10px]',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {exp.materials.slice(0, 2).join(', ')}...
                        </p>
                      </div>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full',
                        exp.difficulty === 'easy'
                          ? 'bg-green-500/20 text-green-500'
                          : exp.difficulty === 'medium'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-violet-500/20 text-violet-500'
                      )}>
                        {exp.difficulty === 'easy' ? '🌱' : exp.difficulty === 'medium' ? '🔬' : '🚀'}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 核心实验演示 */}
            <Link
              to={mapping.keyExperimentDemo}
              className={cn(
                'mt-4 flex items-center gap-3 p-3 rounded-xl transition-all',
                'bg-gradient-to-r text-white'
              )}
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              }}
            >
              <FlaskConical className="w-5 h-5" />
              <span className="font-medium text-sm">
                {isZh ? '探索核心实验' : 'Explore Key Experiment'}
              </span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 主组件 - 时间线课程探索器
// ============================================================================

interface TimelineCourseExplorerProps {
  variant?: 'full' | 'compact'
  showEras?: boolean
  showCuriosity?: boolean
  showPSRT?: boolean
  showUnits?: boolean
  maxCuriosityCards?: number
}

export function TimelineCourseExplorer({
  variant = 'full',
  showEras = true,
  showCuriosity = true,
  showPSRT = true,
  showUnits = true,
  maxCuriosityCards = 6,
}: TimelineCourseExplorerProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [selectedEraId, setSelectedEraId] = useState<string | null>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  const selectedEra = HISTORICAL_ERAS.find(e => e.id === selectedEraId)
  const selectedQuestion = PSRT_QUESTIONS.find(q => q.questionId === selectedQuestionId)

  const eraEvents = useMemo(() => {
    if (!selectedEraId) return []
    return getTimelineEventsForEra(selectedEraId)
  }, [selectedEraId])

  const handleEraSelect = useCallback((eraId: string) => {
    setSelectedEraId(prev => prev === eraId ? null : eraId)
  }, [])

  const handleQuestionSelect = useCallback((questionId: string) => {
    setSelectedQuestionId(prev => prev === questionId ? null : questionId)
  }, [])

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {/* 好奇心卡片 - 紧凑版 */}
        {showCuriosity && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CURIOSITY_CARDS.slice(0, 3).map(card => (
              <CuriosityTriggerCard key={card.id} card={card} theme={theme} isZh={isZh} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 时代导航 */}
      {showEras && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
              <History className="w-4 h-4 text-white" />
            </div>
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '光学探索之旅' : 'Journey of Optical Discovery'}
            </h2>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            )}>
              {isZh ? '双轨时间线' : 'Dual Track'}
            </span>
          </div>

          {/* 时代卡片网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {HISTORICAL_ERAS.map(era => (
              <EraCard
                key={era.id}
                era={era}
                isSelected={selectedEraId === era.id}
                onSelect={() => handleEraSelect(era.id)}
                theme={theme}
                isZh={isZh}
              />
            ))}
          </div>

          {/* 选中时代的事件列表 */}
          <AnimatePresence>
            {selectedEra && eraEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'rounded-2xl p-4 border overflow-hidden',
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                {/* 时代标题 */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{selectedEra.icon}</span>
                  <div>
                    <h3 className={cn(
                      'font-bold',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? selectedEra.nameZh : selectedEra.nameEn}
                    </h3>
                    <p className={cn(
                      'text-sm italic',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      🤔 {isZh ? selectedEra.milestoneQuestionZh : selectedEra.milestoneQuestionEn}
                    </p>
                  </div>
                </div>

                {/* 双轨事件列表 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 光学轨道 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className={cn(
                        'text-sm font-bold',
                        theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                      )}>
                        {isZh ? '广义光学' : 'General Optics'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {eraEvents
                        .filter(e => e.track === 'optics')
                        .slice(0, 5)
                        .map(event => (
                          <TimelineEventCard
                            key={`${event.year}-${event.titleEn}`}
                            event={event}
                            theme={theme}
                            isZh={isZh}
                            compact
                          />
                        ))}
                    </div>
                  </div>

                  {/* 偏振轨道 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      <span className={cn(
                        'text-sm font-bold',
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      )}>
                        {isZh ? '偏振光学' : 'Polarization'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {eraEvents
                        .filter(e => e.track === 'polarization')
                        .slice(0, 5)
                        .map(event => (
                          <TimelineEventCard
                            key={`${event.year}-${event.titleEn}`}
                            event={event}
                            theme={theme}
                            isZh={isZh}
                            compact
                          />
                        ))}
                    </div>
                  </div>
                </div>

                {/* 查看更多 */}
                <Link
                  to="/chronicles"
                  className={cn(
                    'mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-medium transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <BookOpen className="w-4 h-4" />
                  {isZh ? '探索完整历史时间线' : 'Explore Full Timeline'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 好奇心触发卡片 */}
      {showCuriosity && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-pink-400 to-rose-500">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '动手试一试' : 'Try It Yourself'}
            </h2>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'
            )}>
              {isZh ? '激发好奇心' : 'Spark Curiosity'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CURIOSITY_CARDS.slice(0, maxCuriosityCards).map(card => (
              <CuriosityTriggerCard key={card.id} card={card} theme={theme} isZh={isZh} />
            ))}
          </div>
        </div>
      )}

      {/* P-SRT 问题牵引 */}
      {showPSRT && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '问题牵引学习' : 'Question-Driven Learning'}
            </h2>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
            )}>
              P-SRT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PSRT_QUESTIONS.map(question => (
              <PSRTQuestionCard
                key={question.questionId}
                question={question}
                theme={theme}
                isZh={isZh}
                onSelect={() => handleQuestionSelect(question.questionId)}
                isSelected={selectedQuestionId === question.questionId}
              />
            ))}
          </div>

          {/* 选中问题的探索步骤 */}
          <AnimatePresence>
            {selectedQuestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'mt-4 rounded-xl p-4 border',
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                <h4 className={cn(
                  'font-bold text-sm mb-3 flex items-center gap-2',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  <Compass className="w-4 h-4" style={{ color: selectedQuestion.color }} />
                  {isZh ? '探索步骤' : 'Exploration Steps'}
                </h4>
                <div className="space-y-2">
                  {selectedQuestion.explorationSteps.map((step, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        theme === 'dark' ? 'bg-slate-700/50' : 'bg-white'
                      )}
                    >
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: selectedQuestion.color }}
                      >
                        {i + 1}
                      </div>
                      <p className={cn(
                        'flex-1 text-sm',
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        {isZh ? step.stepZh : step.stepEn}
                      </p>
                      {step.demoLink && (
                        <Link
                          to={step.demoLink}
                          className={cn(
                            'p-1.5 rounded-md transition-colors',
                            theme === 'dark'
                              ? 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50'
                              : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                          )}
                        >
                          <Play className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 课程单元与时间线映射 */}
      {showUnits && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-violet-400 to-purple-500">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '课程大纲' : 'Course Outline'}
            </h2>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
            )}>
              5 {isZh ? '单元' : 'Units'}
            </span>
          </div>

          <div className="space-y-3">
            {COURSE_TIMELINE_MAPPINGS.map(mapping => (
              <UnitTimelineCard
                key={mapping.unitNumber}
                mapping={mapping}
                theme={theme}
                isZh={isZh}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimelineCourseExplorer
