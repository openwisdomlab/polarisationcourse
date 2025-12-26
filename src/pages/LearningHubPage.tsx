/**
 * LearningHubPage - Modular Learning Hub
 *
 * Google Learning-inspired design philosophy:
 * - Progressive information disclosure (avoid overload)
 * - Self-directed exploration
 * - Gamification through discovery
 * - Modular resource organization
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { PersistentHeader } from '@/components/shared'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  BookOpen,
  Gamepad2,
  FlaskConical,
  History,
  Calculator,
  Microscope,
  ChevronRight,
  Sparkles,
  Star,
  Play,
  Eye,
  Award,
  TrendingUp
} from 'lucide-react'

// Learning path types
type LearningPath = 'explorer' | 'builder' | 'researcher'

interface LearningModule {
  id: string
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  icon: React.ReactNode
  color: string
  route: string
  category: 'learn' | 'explore' | 'create' | 'discover'
  difficulty: 1 | 2 | 3
  estimatedTime?: string
  prerequisites?: string[]
  rewards?: string[]
}

// Core learning modules - organized for progressive disclosure
const LEARNING_MODULES: LearningModule[] = [
  // DISCOVER - Entry points for beginners
  {
    id: 'chronicles',
    titleEn: 'Chronicles of Light',
    titleZh: '光的编年史',
    descriptionEn: 'Journey through 400 years of optical discoveries',
    descriptionZh: '穿越400年光学发现之旅',
    icon: <History className="w-6 h-6" />,
    color: '#F59E0B',
    route: '/chronicles',
    category: 'discover',
    difficulty: 1,
    estimatedTime: '15-30 min',
    rewards: ['Historical Context', 'Scientist Stories']
  },
  {
    id: 'demos',
    titleEn: 'Interactive Demos',
    titleZh: '交互式演示',
    descriptionEn: 'See polarization physics in action',
    descriptionZh: '观看偏振物理的实际运作',
    icon: <Play className="w-6 h-6" />,
    color: '#22D3EE',
    route: '/demos',
    category: 'discover',
    difficulty: 1,
    estimatedTime: '5-10 min each',
    rewards: ['Visual Understanding', 'Intuition']
  },

  // LEARN - Structured curriculum
  {
    id: 'course',
    titleEn: 'P-SRT Course',
    titleZh: 'P-SRT课程',
    descriptionEn: 'Complete 5-unit polarization curriculum',
    descriptionZh: '完整的5单元偏振课程',
    icon: <BookOpen className="w-6 h-6" />,
    color: '#8B5CF6',
    route: '/course',
    category: 'learn',
    difficulty: 2,
    estimatedTime: '10+ hours',
    rewards: ['Deep Knowledge', 'Certificates']
  },

  // EXPLORE - Self-directed learning
  {
    id: 'games',
    titleEn: 'Puzzle Games',
    titleZh: '益智游戏',
    descriptionEn: 'Learn by solving light puzzles',
    descriptionZh: '通过解决光学谜题学习',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: '#EC4899',
    route: '/games',
    category: 'explore',
    difficulty: 1,
    estimatedTime: '5-30 min',
    rewards: ['Problem Solving', 'Fun!']
  },
  {
    id: 'optical-studio',
    titleEn: 'Optical Design Studio',
    titleZh: '光学设计工作室',
    descriptionEn: 'Create your own optical systems',
    descriptionZh: '创建你自己的光学系统',
    icon: <Sparkles className="w-6 h-6" />,
    color: '#10B981',
    route: '/optical-studio',
    category: 'create',
    difficulty: 2,
    estimatedTime: 'Unlimited',
    rewards: ['Creativity', 'Design Skills']
  },

  // CREATE - Advanced tools
  {
    id: 'lab',
    titleEn: 'Research Lab',
    titleZh: '研究实验室',
    descriptionEn: 'Conduct virtual experiments',
    descriptionZh: '进行虚拟实验',
    icon: <FlaskConical className="w-6 h-6" />,
    color: '#6366F1',
    route: '/lab',
    category: 'create',
    difficulty: 3,
    estimatedTime: '30+ min',
    prerequisites: ['course'],
    rewards: ['Research Skills', 'Data Analysis']
  },
  {
    id: 'calculators',
    titleEn: 'Calculation Workshop',
    titleZh: '计算工作坊',
    descriptionEn: 'Jones, Stokes, Mueller calculators',
    descriptionZh: 'Jones、Stokes、Mueller计算器',
    icon: <Calculator className="w-6 h-6" />,
    color: '#0891B2',
    route: '/calc',
    category: 'create',
    difficulty: 3,
    prerequisites: ['course'],
    rewards: ['Mathematical Mastery']
  }
]

// Quick start paths for different learner types
const LEARNING_PATHS = [
  {
    id: 'explorer' as LearningPath,
    titleEn: 'Explorer',
    titleZh: '探索者',
    descriptionEn: 'I want to discover and play',
    descriptionZh: '我想探索和玩耍',
    icon: <Compass className="w-8 h-8" />,
    color: '#F59E0B',
    suggestedModules: ['games', 'demos', 'chronicles']
  },
  {
    id: 'builder' as LearningPath,
    titleEn: 'Builder',
    titleZh: '建造者',
    descriptionEn: 'I want to create and design',
    descriptionZh: '我想创造和设计',
    icon: <Sparkles className="w-8 h-8" />,
    color: '#10B981',
    suggestedModules: ['optical-studio', 'games', 'demos']
  },
  {
    id: 'researcher' as LearningPath,
    titleEn: 'Researcher',
    titleZh: '研究者',
    descriptionEn: 'I want deep understanding',
    descriptionZh: '我想深入理解',
    icon: <Microscope className="w-8 h-8" />,
    color: '#8B5CF6',
    suggestedModules: ['course', 'lab', 'calculators']
  }
]

// Discovery milestones for gamification
const DISCOVERY_MILESTONES = [
  { id: 'first-demo', titleEn: 'First Light', titleZh: '初见光芒', icon: '💡' },
  { id: 'polarizer-master', titleEn: 'Polarizer Master', titleZh: '偏振大师', icon: '🔮' },
  { id: 'time-traveler', titleEn: 'Time Traveler', titleZh: '时间旅行者', icon: '⏳' },
  { id: 'puzzle-solver', titleEn: 'Puzzle Solver', titleZh: '解谜高手', icon: '🧩' },
  { id: 'lab-rat', titleEn: 'Lab Enthusiast', titleZh: '实验达人', icon: '🔬' },
  { id: 'math-wizard', titleEn: 'Math Wizard', titleZh: '数学巫师', icon: '🧮' }
]

export default function LearningHubPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isZh = i18n.language === 'zh'

  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [showPathSelector, setShowPathSelector] = useState(true)
  const [discoveredModules, setDiscoveredModules] = useState<Set<string>>(new Set(['demos', 'games']))
  const [expandedCategory, setExpandedCategory] = useState<string | null>('discover')

  // Load progress from localStorage
  useEffect(() => {
    const savedPath = localStorage.getItem('learningPath')
    const savedModules = localStorage.getItem('discoveredModules')
    if (savedPath) {
      setSelectedPath(savedPath as LearningPath)
      setShowPathSelector(false)
    }
    if (savedModules) {
      setDiscoveredModules(new Set(JSON.parse(savedModules)))
    }
  }, [])

  // Save progress
  const selectPath = (path: LearningPath) => {
    setSelectedPath(path)
    setShowPathSelector(false)
    localStorage.setItem('learningPath', path)
  }

  const getModulesByCategory = (category: string) =>
    LEARNING_MODULES.filter(m => m.category === category)

  const getCategoryInfo = (category: string) => {
    const info: Record<string, { titleEn: string; titleZh: string; icon: React.ReactNode }> = {
      discover: { titleEn: 'Discover', titleZh: '发现', icon: <Eye className="w-5 h-5" /> },
      learn: { titleEn: 'Learn', titleZh: '学习', icon: <BookOpen className="w-5 h-5" /> },
      explore: { titleEn: 'Explore', titleZh: '探索', icon: <Compass className="w-5 h-5" /> },
      create: { titleEn: 'Create', titleZh: '创造', icon: <Sparkles className="w-5 h-5" /> }
    }
    return info[category]
  }

  const renderDifficultyStars = (level: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= level ? 'fill-current text-amber-400' : 'text-gray-400'}`}
        />
      ))}
    </div>
  )

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <PersistentHeader />

      <main className="pt-16 pb-20">
        {/* Hero Section with Path Selector */}
        <section className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {isZh ? '偏振光学习中心' : 'Polarization Learning Hub'}
              </h1>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isZh ? '选择你的探索方式，开启光学之旅' : 'Choose your path and begin your optical journey'}
              </p>
            </motion.div>

            {/* Path Selector (Progressive Disclosure) */}
            <AnimatePresence mode="wait">
              {showPathSelector ? (
                <motion.div
                  key="path-selector"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
                >
                  {LEARNING_PATHS.map((path, index) => (
                    <motion.button
                      key={path.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectPath(path.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700 hover:border-opacity-100'
                          : 'bg-white border-slate-200 hover:shadow-lg'
                      }`}
                      style={{ borderColor: selectedPath === path.id ? path.color : undefined }}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: `${path.color}20` }}
                        >
                          <div style={{ color: path.color }}>{path.icon}</div>
                        </div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {isZh ? path.titleZh : path.titleEn}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {isZh ? path.descriptionZh : path.descriptionEn}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="selected-path"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-4"
                >
                  {selectedPath && (
                    <>
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ backgroundColor: `${LEARNING_PATHS.find(p => p.id === selectedPath)?.color}20` }}
                      >
                        <span style={{ color: LEARNING_PATHS.find(p => p.id === selectedPath)?.color }}>
                          {LEARNING_PATHS.find(p => p.id === selectedPath)?.icon}
                        </span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {isZh
                            ? LEARNING_PATHS.find(p => p.id === selectedPath)?.titleZh
                            : LEARNING_PATHS.find(p => p.id === selectedPath)?.titleEn
                          }
                        </span>
                      </div>
                      <button
                        onClick={() => setShowPathSelector(true)}
                        className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {isZh ? '更换路径' : 'Change path'}
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Quick Actions - Suggested for selected path */}
        {selectedPath && !showPathSelector && (
          <section className="max-w-6xl mx-auto px-4 py-8">
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {isZh ? '推荐起点' : 'Suggested Starting Points'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LEARNING_PATHS.find(p => p.id === selectedPath)?.suggestedModules.map(moduleId => {
                const module = LEARNING_MODULES.find(m => m.id === moduleId)
                if (!module) return null
                return (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={module.route}
                      className={`block p-4 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                          : 'bg-white border-slate-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          <div style={{ color: module.color }}>{module.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {isZh ? module.titleZh : module.titleEn}
                          </h3>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {module.estimatedTime}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* All Modules - Organized by Category */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {isZh ? '全部模块' : 'All Modules'}
          </h2>

          <div className="space-y-6">
            {['discover', 'explore', 'learn', 'create'].map(category => {
              const categoryInfo = getCategoryInfo(category)
              const modules = getModulesByCategory(category)
              const isExpanded = expandedCategory === category

              return (
                <div key={category} className={`rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                  {/* Category Header */}
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                    className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} rounded-t-2xl transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {categoryInfo.icon}
                      </div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {isZh ? categoryInfo.titleZh : categoryInfo.titleEn}
                      </h3>
                      <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        ({modules.length})
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${isDark ? 'text-slate-500' : 'text-slate-400'} ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {/* Module Grid */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {modules.map(module => (
                            <motion.div
                              key={module.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ y: -2 }}
                            >
                              <Link
                                to={module.route}
                                className={`block p-4 rounded-xl border transition-all h-full ${
                                  isDark
                                    ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex flex-col h-full">
                                  <div className="flex items-start justify-between mb-3">
                                    <div
                                      className="p-2 rounded-lg"
                                      style={{ backgroundColor: `${module.color}20` }}
                                    >
                                      <div style={{ color: module.color }}>{module.icon}</div>
                                    </div>
                                    {renderDifficultyStars(module.difficulty)}
                                  </div>

                                  <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {isZh ? module.titleZh : module.titleEn}
                                  </h4>
                                  <p className={`text-sm mb-3 flex-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {isZh ? module.descriptionZh : module.descriptionEn}
                                  </p>

                                  <div className="flex items-center justify-between text-xs">
                                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                                      {module.estimatedTime}
                                    </span>
                                    {module.rewards && (
                                      <div className="flex items-center gap-1">
                                        <Award className="w-3 h-3 text-amber-500" />
                                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                                          +{module.rewards.length}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* Discovery Progress */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {isZh ? '发现进度' : 'Discovery Progress'}
              </h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  {discoveredModules.size}/{LEARNING_MODULES.length} {isZh ? '模块' : 'modules'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {DISCOVERY_MILESTONES.map(milestone => (
                <div
                  key={milestone.id}
                  className={`flex flex-col items-center p-3 rounded-xl ${
                    isDark ? 'bg-slate-700/50' : 'bg-white'
                  }`}
                >
                  <span className="text-2xl mb-1">{milestone.icon}</span>
                  <span className={`text-xs text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isZh ? milestone.titleZh : milestone.titleEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
