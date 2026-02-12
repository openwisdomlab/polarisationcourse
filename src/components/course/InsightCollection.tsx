/**
 * InsightCollection - 灵感收集册/成就系统
 *
 * 设计理念：
 * - 学生完成 thinkingQuestion 或互动实验时获得"光学道具"
 * - 道具可用于后续关卡（概念性的，增加成就感）
 * - 可视化的收集进度和成就展示
 */

import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  Gem,
  Star,
  FlaskConical,
  Gamepad2,
  Trophy,
} from 'lucide-react'

// 光学道具类型
export interface OpticalItem {
  id: string
  name: { en: string; zh: string }
  description: { en: string; zh: string }
  icon: string // emoji
  category: 'polarizer' | 'wave' | 'crystal' | 'lens' | 'detector' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  // 获取条件
  unlockCondition: {
    type: 'demo' | 'quiz' | 'experiment' | 'game' | 'streak'
    targetId?: string
    targetCount?: number
  }
  // 是否已解锁
  unlocked: boolean
  // 解锁时间
  unlockedAt?: string
  // 所属单元
  unitId: string
}

// 成就类型
export interface Achievement {
  id: string
  name: { en: string; zh: string }
  description: { en: string; zh: string }
  icon: string
  category: 'learning' | 'exploration' | 'mastery' | 'social'
  // 进度
  progress: number
  maxProgress: number
  // 是否完成
  completed: boolean
  // 奖励
  reward?: {
    type: 'item' | 'badge' | 'title'
    id: string
    name: { en: string; zh: string }
  }
}

// 预定义的光学道具 - 重新设计更多样化的图标
export const OPTICAL_ITEMS: Omit<OpticalItem, 'unlocked' | 'unlockedAt'>[] = [
  // Unit 0 - 基础
  {
    id: 'polarizer-basic',
    name: { en: 'Polarizing Film', zh: '偏振片' },
    description: {
      en: 'A basic polarizer that filters light by polarization',
      zh: '最基础的偏振器件，可过滤特定偏振方向的光'
    },
    icon: '◫',
    category: 'polarizer',
    rarity: 'common',
    unlockCondition: { type: 'demo', targetId: 'polarization-intro' },
    unitId: 'unit0',
  },
  {
    id: 'wave-visualizer',
    name: { en: 'Wave Visualizer', zh: '波动可视器' },
    description: {
      en: 'Allows you to see the wave nature of light',
      zh: '让你能看到光的波动本质'
    },
    icon: '∿',
    category: 'wave',
    rarity: 'common',
    unlockCondition: { type: 'demo', targetId: 'light-wave' },
    unitId: 'unit0',
  },

  // Unit 1 - 偏振态
  {
    id: 'iceland-spar',
    name: { en: 'Iceland Spar', zh: '冰洲石' },
    description: {
      en: 'A magical crystal that creates double images',
      zh: '能产生双像的神奇晶体'
    },
    icon: '◇',
    category: 'crystal',
    rarity: 'rare',
    unlockCondition: { type: 'demo', targetId: 'birefringence' },
    unitId: 'unit1',
  },
  {
    id: 'malus-lens',
    name: { en: "Malus's Lens", zh: '马吕斯透镜' },
    description: {
      en: 'Measures light intensity with cos² precision',
      zh: '用 cos² 精度测量光强'
    },
    icon: '⊙',
    category: 'lens',
    rarity: 'rare',
    unlockCondition: { type: 'demo', targetId: 'malus' },
    unitId: 'unit1',
  },
  {
    id: 'waveplate-quarter',
    name: { en: 'Quarter-Wave Plate', zh: '1/4波片' },
    description: {
      en: 'Converts linear polarization to circular',
      zh: '将线偏振转换为圆偏振'
    },
    icon: '◎',
    category: 'wave',
    rarity: 'epic',
    unlockCondition: { type: 'demo', targetId: 'waveplate' },
    unitId: 'unit1',
  },

  // Unit 2 - 界面反射
  {
    id: 'fresnel-prism',
    name: { en: 'Fresnel Prism', zh: '菲涅尔棱镜' },
    description: {
      en: 'Reveals the secrets of interface reflection',
      zh: '揭示界面反射的秘密'
    },
    icon: '△',
    category: 'crystal',
    rarity: 'rare',
    unlockCondition: { type: 'demo', targetId: 'fresnel' },
    unitId: 'unit2',
  },
  {
    id: 'brewster-window',
    name: { en: "Brewster's Window", zh: '布儒斯特窗' },
    description: {
      en: 'A window that creates perfectly polarized light',
      zh: '产生完美偏振光的窗口'
    },
    icon: '▢',
    category: 'lens',
    rarity: 'epic',
    unlockCondition: { type: 'demo', targetId: 'brewster' },
    unitId: 'unit2',
  },

  // Unit 3 - 透明介质
  {
    id: 'stress-analyzer',
    name: { en: 'Stress Analyzer', zh: '应力分析仪' },
    description: {
      en: 'Reveals hidden stress in materials as colors',
      zh: '将材料中的隐藏应力显示为彩色'
    },
    icon: '⬡',
    category: 'detector',
    rarity: 'rare',
    unlockCondition: { type: 'demo', targetId: 'chromatic' },
    unitId: 'unit3',
  },
  {
    id: 'sugar-rotator',
    name: { en: 'Optical Rotator', zh: '旋光器' },
    description: {
      en: 'Rotates polarization through optically active media',
      zh: '通过旋光性介质旋转偏振方向'
    },
    icon: '↻',
    category: 'special',
    rarity: 'epic',
    unlockCondition: { type: 'demo', targetId: 'optical-rotation' },
    unitId: 'unit3',
  },

  // Unit 4 - 散射
  {
    id: 'sky-simulator',
    name: { en: 'Sky Simulator', zh: '天空模拟器' },
    description: {
      en: 'Recreates the blue sky and red sunset',
      zh: '重现蓝天和红色日落'
    },
    icon: '☀',
    category: 'special',
    rarity: 'rare',
    unlockCondition: { type: 'demo', targetId: 'rayleigh' },
    unitId: 'unit4',
  },
  {
    id: 'cloud-maker',
    name: { en: 'Cloud Maker', zh: '云朵制造器' },
    description: {
      en: 'Creates beautiful Mie scattering effects',
      zh: '产生美丽的米氏散射效果'
    },
    icon: '※',
    category: 'special',
    rarity: 'epic',
    unlockCondition: { type: 'demo', targetId: 'mie-scattering' },
    unitId: 'unit4',
  },

  // Unit 5 - 全偏振
  {
    id: 'stokes-detector',
    name: { en: 'Stokes Detector', zh: '斯托克斯探测器' },
    description: {
      en: 'Measures complete polarization state',
      zh: '测量完整的偏振态'
    },
    icon: '⊞',
    category: 'detector',
    rarity: 'epic',
    unlockCondition: { type: 'demo', targetId: 'stokes' },
    unitId: 'unit5',
  },
  {
    id: 'mueller-matrix',
    name: { en: 'Mueller Matrix', zh: '穆勒矩阵' },
    description: {
      en: 'The ultimate tool for polarization analysis',
      zh: '偏振分析的终极工具'
    },
    icon: '⬢',
    category: 'special',
    rarity: 'legendary',
    unlockCondition: { type: 'demo', targetId: 'mueller' },
    unitId: 'unit5',
  },
  {
    id: 'poincare-sphere',
    name: { en: 'Poincaré Sphere', zh: '庞加莱球' },
    description: {
      en: 'Visualizes all polarization states in 3D',
      zh: '在3D空间可视化所有偏振态'
    },
    icon: '⊛',
    category: 'special',
    rarity: 'legendary',
    unlockCondition: { type: 'quiz', targetId: 'stokes' },
    unitId: 'unit5',
  },
]

// 稀有度配置
const RARITY_CONFIG = {
  common: { color: '#94a3b8', label: { en: 'Common', zh: '普通' }, bgColor: 'bg-slate-100 dark:bg-slate-700' },
  rare: { color: '#3b82f6', label: { en: 'Rare', zh: '稀有' }, bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  epic: { color: '#a855f7', label: { en: 'Epic', zh: '史诗' }, bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  legendary: { color: '#f59e0b', label: { en: 'Legendary', zh: '传说' }, bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
}

// 类别配置 - 使用更多样化的图标
const CATEGORY_CONFIG = {
  polarizer: { icon: '◫', label: { en: 'Polarizers', zh: '偏振器' }, color: '#3b82f6' },
  wave: { icon: '∿', label: { en: 'Wave Optics', zh: '波动光学' }, color: '#06b6d4' },
  crystal: { icon: '◇', label: { en: 'Crystals', zh: '晶体' }, color: '#8b5cf6' },
  lens: { icon: '⊙', label: { en: 'Lenses', zh: '透镜' }, color: '#22c55e' },
  detector: { icon: '⊞', label: { en: 'Detectors', zh: '探测器' }, color: '#f59e0b' },
  special: { icon: '⬢', label: { en: 'Special', zh: '特殊' }, color: '#ec4899' },
}

interface InsightCollectionProps {
  theme: 'dark' | 'light'
  completedDemos: string[]
  quizScores: Record<string, { score: number; maxScore: number }>
  streakDays: number
  variant?: 'full' | 'compact' | 'mini'
  onItemClick?: (itemId: string) => void
}

// 单个道具卡片 - 紧凑版
function ItemCard({
  item,
  theme,
  lang,
  onClick,
}: {
  item: OpticalItem
  theme: 'dark' | 'light'
  lang: 'en' | 'zh'
  onClick?: () => void
}) {
  const rarityConfig = RARITY_CONFIG[item.rarity]
  const categoryConfig = CATEGORY_CONFIG[item.category]
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative rounded-lg p-2 border transition-all cursor-pointer ${
        item.unlocked
          ? `${rarityConfig.bgColor}`
          : theme === 'dark'
            ? 'bg-slate-800/30 border-slate-700/50'
            : 'bg-gray-100/50 border-gray-200/50'
      }`}
      style={{
        borderColor: item.unlocked ? rarityConfig.color : undefined,
        boxShadow: isHovered && item.unlocked ? `0 0 12px ${rarityConfig.color}30` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      {/* 未解锁状态 */}
      {!item.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/10 z-10 pointer-events-none" />
      )}

      {/* 稀有度光效 - 简化版 */}
      {item.unlocked && item.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${rarityConfig.color}25 0%, transparent 50%)`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* 道具图标 - 紧凑版 */}
      <motion.div
        className="text-xl text-center mb-1"
        style={{
          filter: item.unlocked ? 'none' : 'grayscale(100%)',
          color: item.unlocked ? categoryConfig.color : '#64748b',
        }}
        animate={
          item.unlocked && item.rarity === 'legendary'
            ? { rotate: [0, 5, -5, 0] }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity }}
      >
        {item.icon}
      </motion.div>

      {/* 道具名称 - 紧凑版 */}
      <h4 className={`text-[10px] font-medium text-center leading-tight line-clamp-2 ${
        item.unlocked
          ? theme === 'dark' ? 'text-white' : 'text-gray-900'
          : 'text-gray-400'
      }`}>
        {item.name[lang]}
      </h4>

      {/* 传说级标记 */}
      {item.unlocked && item.rarity === 'legendary' && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
        </motion.div>
      )}
    </motion.div>
  )
}

export function InsightCollection({
  theme,
  completedDemos,
  quizScores,
  streakDays,
  variant = 'full',
  onItemClick,
}: InsightCollectionProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === 'zh' ? 'zh' : 'en') as 'en' | 'zh'
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<OpticalItem | null>(null)

  // 计算解锁的道具
  const itemsWithStatus = useMemo(() => {
    return OPTICAL_ITEMS.map(item => {
      let unlocked = false

      switch (item.unlockCondition.type) {
        case 'demo':
          unlocked = completedDemos.includes(item.unlockCondition.targetId || '')
          break
        case 'quiz':
          const quizScore = quizScores[item.unlockCondition.targetId || '']
          unlocked = quizScore && quizScore.score >= quizScore.maxScore * 0.8
          break
        case 'streak':
          unlocked = streakDays >= (item.unlockCondition.targetCount || 3)
          break
        default:
          unlocked = false
      }

      return { ...item, unlocked } as OpticalItem
    })
  }, [completedDemos, quizScores, streakDays])

  // 按类别分组
  const itemsByCategory = useMemo(() => {
    const groups: Record<string, OpticalItem[]> = {}
    itemsWithStatus.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [itemsWithStatus])

  // 统计
  const stats = useMemo(() => {
    const total = itemsWithStatus.length
    const unlocked = itemsWithStatus.filter(i => i.unlocked).length
    const byRarity = {
      common: itemsWithStatus.filter(i => i.rarity === 'common' && i.unlocked).length,
      rare: itemsWithStatus.filter(i => i.rarity === 'rare' && i.unlocked).length,
      epic: itemsWithStatus.filter(i => i.rarity === 'epic' && i.unlocked).length,
      legendary: itemsWithStatus.filter(i => i.rarity === 'legendary' && i.unlocked).length,
    }
    return { total, unlocked, byRarity }
  }, [itemsWithStatus])

  // 过滤显示的道具
  const displayItems = selectedCategory
    ? itemsByCategory[selectedCategory] || []
    : itemsWithStatus

  if (variant === 'mini') {
    // 迷你版本 - 只显示解锁进度
    return (
      <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-400" />
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('course.collection.title')}
            </span>
          </div>
          <span className="text-sm" style={{ color: '#f59e0b' }}>
            {stats.unlocked}/{stats.total}
          </span>
        </div>
        <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          {Object.entries(stats.byRarity).map(([rarity, count]) => (
            <span key={rarity} style={{ color: RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG].color }}>
              {RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG].label[lang]}: {count}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'}`}>
      {/* 头部 - 压缩版本 */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('course.collection.title')}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>
              {stats.unlocked}/{stats.total}
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* 稀有度统计 - 紧凑版 */}
        <div className="flex justify-between mt-2 text-[10px]">
          {Object.entries(stats.byRarity).map(([rarity, count]) => (
            <span key={rarity} style={{ color: RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG].color }}>
              {RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG].label[lang]}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* 类别过滤器 - 紧凑版 */}
      <div className={`px-4 py-2 flex gap-1.5 overflow-x-auto ${
        theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50'
      }`}>
        <button
          className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-amber-500 text-white'
              : theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          {t('course.collection.all')}
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1 transition-all ${
              selectedCategory === key
                ? 'bg-amber-500 text-white'
                : theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedCategory(key)}
            style={{
              borderLeft: selectedCategory === key ? 'none' : `2px solid ${config.color}30`,
            }}
          >
            <span style={{ color: selectedCategory === key ? 'inherit' : config.color }}>{config.icon}</span>
            {config.label[lang]}
          </button>
        ))}
      </div>

      {/* 道具网格 - 紧凑版 */}
      <div className="p-4">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 max-h-[200px] overflow-y-auto">
          {displayItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              theme={theme}
              lang={lang}
              onClick={() => {
                setSelectedItem(item)
                onItemClick?.(item.id)
              }}
            />
          ))}
        </div>
      </div>

      {/* 道具详情弹窗 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className={`relative max-w-md w-full rounded-2xl p-6 ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              }`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {/* 道具展示 */}
              <div className="text-center mb-4">
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {selectedItem.icon}
                </motion.div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedItem.name[lang]}
                </h3>
                <span
                  className="text-sm px-2 py-1 rounded-full inline-block mt-2"
                  style={{
                    backgroundColor: `${RARITY_CONFIG[selectedItem.rarity].color}20`,
                    color: RARITY_CONFIG[selectedItem.rarity].color,
                  }}
                >
                  {RARITY_CONFIG[selectedItem.rarity].label[lang]}
                </span>
              </div>

              <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedItem.description[lang]}
              </p>

              {/* 获取方式 */}
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('course.collection.howToUnlock')}
                </div>
                <div className="flex items-center gap-2">
                  {selectedItem.unlockCondition.type === 'demo' && <FlaskConical className="w-4 h-4 text-cyan-500" />}
                  {selectedItem.unlockCondition.type === 'quiz' && <Award className="w-4 h-4 text-amber-500" />}
                  {selectedItem.unlockCondition.type === 'game' && <Gamepad2 className="w-4 h-4 text-pink-500" />}
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {selectedItem.unlockCondition.type === 'demo' && (
                      <>
                        {t('course.collection.completeDemo')}:
                        <Link
                          to={`/demos/${selectedItem.unlockCondition.targetId}` as string}
                          className="ml-1 text-cyan-500 hover:underline"
                          onClick={() => setSelectedItem(null)}
                        >
                          {selectedItem.unlockCondition.targetId}
                        </Link>
                      </>
                    )}
                    {selectedItem.unlockCondition.type === 'quiz' && t('course.collection.passQuiz')}
                    {selectedItem.unlockCondition.type === 'streak' && (
                      `${t('course.collection.streak')}: ${selectedItem.unlockCondition.targetCount} ${t('progress.days')}`
                    )}
                  </span>
                </div>
              </div>

              <button
                className={`w-full mt-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}
                onClick={() => setSelectedItem(null)}
              >
                {t('common.close')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InsightCollection
