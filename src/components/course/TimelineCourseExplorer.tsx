/**
 * TimelineCourseExplorer - 时间线与课程大纲的整合探索组件
 *
 * 设计理念（重新设计版本）：
 * - 垂直双轨时间线：左侧广义光学，右侧偏振光学
 * - 课程单元作为时间线节点，连接历史发现与学习内容
 * - 简洁直观的卡片设计，减少点击层级
 * - 好奇心触发直接嵌入课程节点
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  Sparkles,
  Sun,
  FlaskConical,
  Lightbulb,
  BookOpen,
  Play,
  Eye,
  ArrowRight,
  Beaker,
  History,
  Zap,
  Target,
  Telescope,
} from 'lucide-react'

import {
  COURSE_TIMELINE_MAPPINGS,
  CURIOSITY_CARDS,
  type CourseTimelineMapping,
  type CuriosityCard,
} from '@/data/course-timeline-integration'

// ============================================================================
// 时间线节点组件 - 课程单元嵌入时间线
// ============================================================================

interface TimelineNodeProps {
  mapping: CourseTimelineMapping
  theme: 'dark' | 'light'
  isZh: boolean
  isExpanded: boolean
  onToggle: () => void
  position: 'left' | 'right' | 'center'
  curiosityCards: CuriosityCard[]
}

function TimelineNode({
  mapping,
  theme,
  isZh,
  isExpanded,
  onToggle,
  position,
  curiosityCards,
}: TimelineNodeProps) {
  const unitColors = ['#22D3EE', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
  const color = unitColors[(mapping.unitNumber - 1) % unitColors.length]

  // 根据 position 决定样式
  const positionStyles = {
    left: 'mr-auto pr-4',
    right: 'ml-auto pl-4',
    center: 'mx-auto',
  }

  return (
    <motion.div
      className={cn('relative w-full md:w-[48%]', positionStyles[position])}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 连接线到中心时间轴 */}
      <div
        className={cn(
          'hidden md:block absolute top-8 w-8 h-0.5',
          position === 'left' ? 'right-0 translate-x-full' : position === 'right' ? 'left-0 -translate-x-full' : 'hidden'
        )}
        style={{ backgroundColor: color }}
      />

      {/* 主卡片 */}
      <div
        className={cn(
          'rounded-2xl border-2 overflow-hidden transition-all duration-300',
          isExpanded
            ? theme === 'dark'
              ? 'bg-slate-800 shadow-xl'
              : 'bg-white shadow-xl'
            : theme === 'dark'
              ? 'bg-slate-800/70 hover:bg-slate-800'
              : 'bg-white/90 hover:bg-white'
        )}
        style={{
          borderColor: isExpanded ? color : theme === 'dark' ? '#334155' : '#e5e7eb',
          boxShadow: isExpanded ? `0 8px 32px ${color}25` : undefined,
        }}
      >
        {/* 卡片头部 */}
        <button
          onClick={onToggle}
          className="w-full p-4 text-left flex items-start gap-4"
        >
          {/* 单元编号 + 年份 */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}
          >
            <span className="text-[10px] font-medium opacity-80">Unit</span>
            <span className="text-xl font-bold">{mapping.unitNumber}</span>
          </div>

          {/* 单元信息 */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-bold text-base mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? mapping.unitTitleZh : mapping.unitTitleEn}
            </h3>

            {/* 历史起源 */}
            <div className="flex items-center gap-2 mb-2">
              <History className="w-3 h-3" style={{ color }} />
              <span className={cn(
                'text-xs font-medium',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {mapping.historicalOriginYear} • {mapping.historicalOriginEvent}
              </span>
            </div>

            {/* 核心问题 */}
            <p className={cn(
              'text-sm italic line-clamp-2',
              theme === 'dark' ? 'text-cyan-400/80' : 'text-cyan-600/80'
            )}>
              🤔 {isZh ? mapping.coreQuestionZh : mapping.coreQuestionEn}
            </p>
          </div>

          <ChevronDown className={cn(
            'w-5 h-5 flex-shrink-0 transition-transform',
            isExpanded ? 'rotate-180' : '',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
        </button>

        {/* 展开内容 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'border-t',
                theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
              )}
            >
              <div className="p-4 space-y-4">
                {/* 生活场景 */}
                {mapping.lifeSceneExamples.length > 0 && (
                  <div>
                    <h4 className={cn(
                      'text-xs font-bold mb-2 flex items-center gap-1',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      <Eye className="w-3.5 h-3.5" />
                      {isZh ? '生活中的偏振' : 'Polarization in Life'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {mapping.lifeSceneExamples.map(scene => (
                        <Link
                          key={scene.id}
                          to={scene.demoLink || '#'}
                          className={cn(
                            'p-3 rounded-xl transition-all hover:scale-[1.02]',
                            theme === 'dark'
                              ? 'bg-slate-700/50 hover:bg-slate-700'
                              : 'bg-gray-50 hover:bg-gray-100'
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{scene.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-xs font-medium mb-0.5',
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              )}>
                                {isZh ? scene.titleZh : scene.titleEn}
                              </p>
                              <p className={cn(
                                'text-[10px] line-clamp-2',
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              )}>
                                {isZh ? scene.descriptionZh : scene.descriptionEn}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 好奇心触发 - 融入单元 */}
                {curiosityCards.length > 0 && (
                  <div>
                    <h4 className={cn(
                      'text-xs font-bold mb-2 flex items-center gap-1',
                      theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
                    )}>
                      <Lightbulb className="w-3.5 h-3.5" />
                      {isZh ? '动手试一试' : 'Try It!'}
                    </h4>
                    <div className="space-y-2">
                      {curiosityCards.slice(0, 2).map(card => (
                        <Link
                          key={card.id}
                          to={card.demoLink}
                          className={cn(
                            'flex items-center gap-3 p-2.5 rounded-lg border transition-all hover:scale-[1.01]',
                            theme === 'dark'
                              ? 'bg-pink-900/10 border-pink-500/20 hover:border-pink-500/40'
                              : 'bg-pink-50/50 border-pink-200 hover:border-pink-300'
                          )}
                        >
                          <span className="text-xl">{card.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-xs font-medium',
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            )}>
                              {isZh ? card.questionZh : card.questionEn}
                            </p>
                            <p className={cn(
                              'text-[10px]',
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            )}>
                              {isZh ? card.hintZh : card.hintEn}
                            </p>
                          </div>
                          <Play className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 动手实验 */}
                {mapping.handsOnExperiments.length > 0 && (
                  <div>
                    <h4 className={cn(
                      'text-xs font-bold mb-2 flex items-center gap-1',
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                    )}>
                      <Beaker className="w-3.5 h-3.5" />
                      {isZh ? '动手实验' : 'Hands-on Experiments'}
                    </h4>
                    <div className="space-y-2">
                      {mapping.handsOnExperiments.map(exp => (
                        <Link
                          key={exp.id}
                          to={exp.demoLink || '#'}
                          className={cn(
                            'flex items-center gap-3 p-2.5 rounded-lg transition-colors',
                            theme === 'dark'
                              ? 'bg-slate-700/30 hover:bg-slate-700/50'
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
                              {exp.materials.slice(0, 2).join(', ')}
                            </p>
                          </div>
                          <span className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
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

                {/* 核心演示入口 */}
                <Link
                  to={mapping.keyExperimentDemo}
                  className="flex items-center gap-3 p-3 rounded-xl text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                  }}
                >
                  <FlaskConical className="w-5 h-5" />
                  <span className="font-medium text-sm">
                    {isZh ? '探索核心演示' : 'Explore Key Demo'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 时间轴年份标记
// ============================================================================

interface YearMarkerProps {
  year: number
  theme: 'dark' | 'light'
  isHighlighted?: boolean
  color?: string
}

function YearMarker({ year, theme, isHighlighted, color = '#6366F1' }: YearMarkerProps) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
      <div
        className={cn(
          'w-3 h-3 rounded-full border-2 transition-all',
          isHighlighted
            ? 'scale-125'
            : theme === 'dark'
              ? 'bg-slate-700 border-slate-600'
              : 'bg-white border-gray-300'
        )}
        style={{
          backgroundColor: isHighlighted ? color : undefined,
          borderColor: isHighlighted ? color : undefined,
        }}
      />
      <span className={cn(
        'text-[10px] font-mono mt-1',
        isHighlighted
          ? 'font-bold'
          : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
      )}
        style={{ color: isHighlighted ? color : undefined }}
      >
        {year}
      </span>
    </div>
  )
}

// ============================================================================
// 时代概览横幅
// ============================================================================

interface EraOverviewProps {
  theme: 'dark' | 'light'
  isZh: boolean
}

function EraOverview({ theme, isZh }: EraOverviewProps) {
  const eras = [
    { icon: '🌅', year: '1600-1700', nameZh: '光学黎明', nameEn: 'Dawn', color: '#F59E0B' },
    { icon: '🌊', year: '1800-1850', nameZh: '波动革命', nameEn: 'Wave Era', color: '#3B82F6' },
    { icon: '⚡', year: '1850-1900', nameZh: '电磁时代', nameEn: 'EM Era', color: '#8B5CF6' },
    { icon: '🔬', year: '1900-今', nameZh: '量子应用', nameEn: 'Modern', color: '#EC4899' },
  ]

  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-xl mb-6',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
    )}>
      {eras.map((era, i) => (
        <div key={era.year} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{era.icon}</span>
            <div>
              <p className={cn(
                'text-xs font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? era.nameZh : era.nameEn}
              </p>
              <p className={cn(
                'text-[10px]',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {era.year}
              </p>
            </div>
          </div>
          {i < eras.length - 1 && (
            <ArrowRight className={cn(
              'w-3 h-3 mx-2',
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 双轨图例
// ============================================================================

interface TrackLegendProps {
  theme: 'dark' | 'light'
  isZh: boolean
}

function TrackLegend({ theme, isZh }: TrackLegendProps) {
  return (
    <div className="flex items-center justify-center gap-6 mb-4">
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-amber-500" />
        <span className={cn(
          'text-xs font-medium',
          theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
        )}>
          {isZh ? '广义光学' : 'General Optics'}
        </span>
      </div>
      <div className={cn(
        'w-px h-4',
        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
      )} />
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-500" />
        <span className={cn(
          'text-xs font-medium',
          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
        )}>
          {isZh ? '偏振专题' : 'Polarization Focus'}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// 学习阶段导航
// ============================================================================

interface LearningPhaseNavProps {
  theme: 'dark' | 'light'
  isZh: boolean
  activePhase: number
  onPhaseChange: (phase: number) => void
}

function LearningPhaseNav({ theme, isZh, activePhase, onPhaseChange }: LearningPhaseNavProps) {
  const phases = [
    { id: 1, icon: <Lightbulb className="w-4 h-4" />, nameZh: '看见偏振', nameEn: 'See It', color: '#22D3EE', units: [1] },
    { id: 2, icon: <Target className="w-4 h-4" />, nameZh: '理解规律', nameEn: 'Understand', color: '#A78BFA', units: [2, 3, 4] },
    { id: 3, icon: <Telescope className="w-4 h-4" />, nameZh: '测量应用', nameEn: 'Apply', color: '#EC4899', units: [5] },
  ]

  return (
    <div className={cn(
      'flex items-center justify-center gap-2 mb-6 p-2 rounded-xl',
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
    )}>
      {phases.map((phase, i) => (
        <div key={phase.id} className="flex items-center">
          <button
            onClick={() => onPhaseChange(phase.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
              activePhase === phase.id
                ? 'text-white shadow-lg'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
            )}
            style={{
              background: activePhase === phase.id ? `linear-gradient(135deg, ${phase.color}, ${phase.color}BB)` : undefined,
            }}
          >
            {phase.icon}
            <span className="text-sm font-medium">
              {isZh ? phase.nameZh : phase.nameEn}
            </span>
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full',
              activePhase === phase.id
                ? 'bg-white/20'
                : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}>
              {phase.units.length}
            </span>
          </button>
          {i < phases.length - 1 && (
            <Zap className={cn(
              'w-3 h-3 mx-1',
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            )} />
          )}
        </div>
      ))}
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
}: TimelineCourseExplorerProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [expandedUnitId, setExpandedUnitId] = useState<number | null>(null)
  const [activePhase, setActivePhase] = useState<number>(0) // 0 表示显示全部

  // 根据活动阶段筛选单元
  const filteredMappings = activePhase === 0
    ? COURSE_TIMELINE_MAPPINGS
    : COURSE_TIMELINE_MAPPINGS.filter(m => {
        if (activePhase === 1) return m.unitNumber === 1
        if (activePhase === 2) return [2, 3, 4].includes(m.unitNumber)
        if (activePhase === 3) return m.unitNumber === 5
        return true
      })

  // 获取单元对应的好奇心卡片
  const getCuriosityCardsForUnit = (unitNumber: number) => {
    return CURIOSITY_CARDS.filter(card => card.relatedUnit === unitNumber)
  }

  // 紧凑版本
  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {/* 时代概览 */}
        <EraOverview theme={theme} isZh={isZh} />

        {/* 快速导航到课程 */}
        <Link
          to="/course"
          className={cn(
            'flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.01]',
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              : 'bg-white border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className={cn(
              'font-bold text-sm',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '完整课程大纲' : 'Full Course Outline'}
            </p>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '5个单元 · 20+演示 · 历史时间线' : '5 Units · 20+ Demos · Historical Timeline'}
            </p>
          </div>
          <ArrowRight className={cn(
            'w-5 h-5',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-gradient-to-br from-violet-400 to-purple-500">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <h2 className={cn(
          'text-lg font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '课程时间线' : 'Course Timeline'}
        </h2>
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
        )}>
          {isZh ? '历史与学习融合' : 'History Meets Learning'}
        </span>
      </div>

      {/* 时代概览 */}
      {showEras && <EraOverview theme={theme} isZh={isZh} />}

      {/* 学习阶段导航 */}
      <LearningPhaseNav
        theme={theme}
        isZh={isZh}
        activePhase={activePhase}
        onPhaseChange={setActivePhase}
      />

      {/* 双轨图例 */}
      <TrackLegend theme={theme} isZh={isZh} />

      {/* 垂直时间线 + 课程节点 */}
      <div className="relative">
        {/* 中央时间轴线 */}
        <div className={cn(
          'hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
        )} />

        {/* 课程单元节点 */}
        <div className="space-y-8">
          {filteredMappings.map((mapping, index) => {
            // 交替左右布局
            const position = index % 2 === 0 ? 'left' : 'right'
            const unitColors = ['#22D3EE', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
            const color = unitColors[(mapping.unitNumber - 1) % unitColors.length]

            return (
              <div key={mapping.unitNumber} className="relative">
                {/* 年份标记 */}
                <YearMarker
                  year={mapping.historicalOriginYear}
                  theme={theme}
                  isHighlighted={expandedUnitId === mapping.unitNumber}
                  color={color}
                />

                {/* 课程单元节点 */}
                <div className="pt-10">
                  <TimelineNode
                    mapping={mapping}
                    theme={theme}
                    isZh={isZh}
                    isExpanded={expandedUnitId === mapping.unitNumber}
                    onToggle={() => setExpandedUnitId(
                      expandedUnitId === mapping.unitNumber ? null : mapping.unitNumber
                    )}
                    position={position}
                    curiosityCards={getCuriosityCardsForUnit(mapping.unitNumber)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 底部入口 */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link
          to="/chronicles"
          className={cn(
            'flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.01]',
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'
              : 'bg-white border-gray-200 hover:border-amber-400'
          )}
        >
          <History className="w-5 h-5 text-amber-500" />
          <div className="flex-1">
            <p className={cn(
              'text-sm font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '光学编年史' : 'Optical Chronicles'}
            </p>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {isZh ? '完整历史时间线' : 'Full historical timeline'}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-500" />
        </Link>

        <Link
          to="/course"
          className={cn(
            'flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.01]',
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
              : 'bg-white border-gray-200 hover:border-violet-400'
          )}
        >
          <BookOpen className="w-5 h-5 text-violet-500" />
          <div className="flex-1">
            <p className={cn(
              'text-sm font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '完整课程' : 'Full Course'}
            </p>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {isZh ? '系统化学习路径' : 'Structured learning path'}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-violet-500" />
        </Link>
      </div>
    </div>
  )
}

export default TimelineCourseExplorer
