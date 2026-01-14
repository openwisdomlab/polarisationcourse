/**
 * Gallery Showcase - 展厅导览随机推荐系统
 *
 * 功能：
 * 1. 主要推荐偏振演示馆内容（高概率 ~85%）
 * 2. 偶尔推荐其他模块（低概率 ~15%）
 * 3. 随机结果每小时更新一次，保持一致性
 * 4. 统一的展示卡片数据结构
 */

import {
  Lightbulb,
  Waves,
  Layers,
  FlaskConical,
  Atom,
  Microscope,
  Gamepad2,
  Calculator,
  Palette,
  Sparkles,
  Eye,
  Compass,
  Zap,
  Sun,
  Target,
  Sigma,
  CircleDot,
  Binary,
  Puzzle,
  Search,
  type LucideIcon,
} from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export type ShowcaseItemType = 'demo' | 'game' | 'calculator' | 'tool'

// Icon name type for serialization
type IconName = 'Lightbulb' | 'Waves' | 'Layers' | 'FlaskConical' | 'Atom' | 'Microscope' |
  'Gamepad2' | 'Calculator' | 'Palette' | 'Sparkles' | 'Eye' | 'Compass' |
  'Zap' | 'Sun' | 'Target' | 'Sigma' | 'CircleDot' | 'Binary' | 'Puzzle' | 'Search'

// Icon lookup map for deserializing from localStorage
const ICON_MAP: Record<IconName, LucideIcon> = {
  Lightbulb,
  Waves,
  Layers,
  FlaskConical,
  Atom,
  Microscope,
  Gamepad2,
  Calculator,
  Palette,
  Sparkles,
  Eye,
  Compass,
  Zap,
  Sun,
  Target,
  Sigma,
  CircleDot,
  Binary,
  Puzzle,
  Search,
}

export interface ShowcaseItem {
  id: string
  type: ShowcaseItemType
  titleZh: string
  titleEn: string
  descriptionZh: string
  descriptionEn: string
  icon: LucideIcon
  iconName: IconName  // For serialization to localStorage
  color: string
  glowColor: string
  link: string
  unit?: number  // For demos only
  badge?: string
  badgeZh?: string
}

// ============================================================================
// Content Pools - 内容池
// ============================================================================

// Demo items from polarization gallery (high probability pool)
const DEMO_SHOWCASE_ITEMS: ShowcaseItem[] = [
  // Unit 0 - Optical Basics
  {
    id: 'em-wave',
    type: 'demo',
    titleZh: '电磁波可视化',
    titleEn: 'EM Wave Visualization',
    descriptionZh: '探索电磁波的基本特性和传播方式',
    descriptionEn: 'Explore the basic properties of electromagnetic waves',
    icon: Waves,
    iconName: 'Waves',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    link: '/demos/em-wave',
    unit: 0,
    badge: 'Unit 0',
    badgeZh: '基础',
  },
  {
    id: 'polarization-intro',
    type: 'demo',
    titleZh: '偏振光入门',
    titleEn: 'Polarization Introduction',
    descriptionZh: '从生活场景认识偏振光的奇妙世界',
    descriptionEn: 'Discover polarized light through everyday scenes',
    icon: Sun,
    iconName: 'Sun',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    link: '/demos/polarization-intro',
    unit: 0,
    badge: 'Unit 0',
    badgeZh: '基础',
  },
  {
    id: 'polarization-types-unified',
    type: 'demo',
    titleZh: '偏振类型与三偏振片悖论',
    titleEn: 'Polarization Types & Three Polarizers',
    descriptionZh: '理解线偏振、圆偏振和椭圆偏振',
    descriptionEn: 'Understand linear, circular and elliptical polarization',
    icon: Sparkles,
    iconName: 'Sparkles',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    link: '/demos/polarization-types-unified',
    unit: 0,
    badge: 'Unit 0',
    badgeZh: '基础',
  },
  {
    id: 'optical-bench',
    type: 'demo',
    titleZh: '交互式光学实验台',
    titleEn: 'Interactive Optical Bench',
    descriptionZh: '动手设计你的第一个偏振实验',
    descriptionEn: 'Design your first polarization experiment',
    icon: Lightbulb,
    iconName: 'Lightbulb',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    link: '/demos/optical-bench',
    unit: 0,
    badge: 'Unit 0',
    badgeZh: '基础',
  },
  // Unit 1 - Polarization Fundamentals
  {
    id: 'polarization-state',
    type: 'demo',
    titleZh: '偏振态3D可视化',
    titleEn: '3D Polarization State',
    descriptionZh: '在三维空间中直观理解偏振态',
    descriptionEn: 'Visualize polarization states in 3D space',
    icon: Eye,
    iconName: 'Eye',
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    link: '/demos/polarization-state',
    unit: 1,
    badge: 'Unit 1',
    badgeZh: '偏振',
  },
  {
    id: 'malus',
    type: 'demo',
    titleZh: '马吕斯定律',
    titleEn: "Malus's Law",
    descriptionZh: '探索偏振光强度与角度的关系',
    descriptionEn: 'Explore the relationship between intensity and angle',
    icon: Target,
    iconName: 'Target',
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    link: '/demos/malus',
    unit: 1,
    badge: 'Unit 1',
    badgeZh: '偏振',
  },
  {
    id: 'birefringence',
    type: 'demo',
    titleZh: '双折射现象',
    titleEn: 'Birefringence',
    descriptionZh: '揭秘冰洲石的神奇双影效应',
    descriptionEn: 'Discover the magic of calcite double refraction',
    icon: Layers,
    iconName: 'Layers',
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    link: '/demos/birefringence',
    unit: 1,
    badge: 'Unit 1',
    badgeZh: '偏振',
  },
  {
    id: 'waveplate',
    type: 'demo',
    titleZh: '波片原理',
    titleEn: 'Waveplate Demo',
    descriptionZh: '学习波片如何调控偏振态',
    descriptionEn: 'Learn how waveplates modulate polarization',
    icon: Zap,
    iconName: 'Zap',
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    link: '/demos/waveplate',
    unit: 1,
    badge: 'Unit 1',
    badgeZh: '偏振',
  },
  // Unit 2 - Interface Reflection
  {
    id: 'fresnel',
    type: 'demo',
    titleZh: '菲涅尔方程',
    titleEn: 'Fresnel Equations',
    descriptionZh: '理解光在界面的反射和透射',
    descriptionEn: 'Understand reflection and transmission at interfaces',
    icon: Layers,
    iconName: 'Layers',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    link: '/demos/fresnel',
    unit: 2,
    badge: 'Unit 2',
    badgeZh: '界面',
  },
  {
    id: 'brewster',
    type: 'demo',
    titleZh: '布儒斯特角',
    titleEn: "Brewster's Angle",
    descriptionZh: '探索无反射偏振的神奇角度',
    descriptionEn: 'Explore the magic angle of polarization',
    icon: Compass,
    iconName: 'Compass',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    link: '/demos/brewster',
    unit: 2,
    badge: 'Unit 2',
    badgeZh: '界面',
  },
  // Unit 3 - Transparent Media
  {
    id: 'anisotropy',
    type: 'demo',
    titleZh: '各向异性材料',
    titleEn: 'Anisotropy',
    descriptionZh: '观察应力诱导的美丽色偏振',
    descriptionEn: 'Observe beautiful stress-induced colors',
    icon: FlaskConical,
    iconName: 'FlaskConical',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    link: '/demos/anisotropy',
    unit: 3,
    badge: 'Unit 3',
    badgeZh: '透明介质',
  },
  {
    id: 'chromatic',
    type: 'demo',
    titleZh: '色偏振',
    titleEn: 'Chromatic Polarization',
    descriptionZh: '探索偏振光的彩色世界',
    descriptionEn: 'Explore the colorful world of polarization',
    icon: Sparkles,
    iconName: 'Sparkles',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    link: '/demos/chromatic',
    unit: 3,
    badge: 'Unit 3',
    badgeZh: '透明介质',
  },
  {
    id: 'optical-rotation',
    type: 'demo',
    titleZh: '旋光效应',
    titleEn: 'Optical Rotation',
    descriptionZh: '用偏振光测量糖浓度',
    descriptionEn: 'Measure sugar concentration with polarized light',
    icon: CircleDot,
    iconName: 'CircleDot',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    link: '/demos/optical-rotation',
    unit: 3,
    badge: 'Unit 3',
    badgeZh: '透明介质',
  },
  // Unit 4 - Scattering
  {
    id: 'rayleigh',
    type: 'demo',
    titleZh: '瑞利散射',
    titleEn: 'Rayleigh Scattering',
    descriptionZh: '揭秘天空为什么是蓝色的',
    descriptionEn: 'Discover why the sky is blue',
    icon: Sun,
    iconName: 'Sun',
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    link: '/demos/rayleigh',
    unit: 4,
    badge: 'Unit 4',
    badgeZh: '散射',
  },
  {
    id: 'mie-scattering',
    type: 'demo',
    titleZh: '米氏散射',
    titleEn: 'Mie Scattering',
    descriptionZh: '理解云雾和大颗粒散射',
    descriptionEn: 'Understand scattering by large particles',
    icon: Atom,
    iconName: 'Atom',
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    link: '/demos/mie-scattering',
    unit: 4,
    badge: 'Unit 4',
    badgeZh: '散射',
  },
  {
    id: 'monte-carlo-scattering',
    type: 'demo',
    titleZh: '蒙特卡洛散射模拟',
    titleEn: 'Monte Carlo Scattering',
    descriptionZh: '用随机方法模拟多次散射',
    descriptionEn: 'Simulate multiple scattering with Monte Carlo',
    icon: Binary,
    iconName: 'Binary',
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    link: '/demos/monte-carlo-scattering',
    unit: 4,
    badge: 'Unit 4',
    badgeZh: '散射',
  },
  // Unit 5 - Polarimetry
  {
    id: 'stokes',
    type: 'demo',
    titleZh: '斯托克斯矢量',
    titleEn: 'Stokes Vector',
    descriptionZh: '用四参数完整描述偏振态',
    descriptionEn: 'Describe polarization with four parameters',
    icon: Sigma,
    iconName: 'Sigma',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    link: '/demos/stokes',
    unit: 5,
    badge: 'Unit 5',
    badgeZh: '偏振测量',
  },
  {
    id: 'mueller',
    type: 'demo',
    titleZh: '缪勒矩阵',
    titleEn: 'Mueller Matrix',
    descriptionZh: '完备表征光学元件的偏振效应',
    descriptionEn: 'Characterize optical elements completely',
    icon: Binary,
    iconName: 'Binary',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    link: '/demos/mueller',
    unit: 5,
    badge: 'Unit 5',
    badgeZh: '偏振测量',
  },
  {
    id: 'jones',
    type: 'demo',
    titleZh: 'Jones矩阵',
    titleEn: 'Jones Matrix',
    descriptionZh: '用复数优雅描述偏振变换',
    descriptionEn: 'Elegant complex representation of polarization',
    icon: Sigma,
    iconName: 'Sigma',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    link: '/demos/jones',
    unit: 5,
    badge: 'Unit 5',
    badgeZh: '偏振测量',
  },
  {
    id: 'polarimetric-microscopy',
    type: 'demo',
    titleZh: '偏光显微术',
    titleEn: 'Polarimetric Microscopy',
    descriptionZh: '用偏振光观察微观世界',
    descriptionEn: 'Observe the microscopic world with polarized light',
    icon: Microscope,
    iconName: 'Microscope',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    link: '/demos/polarimetric-microscopy',
    unit: 5,
    badge: 'Unit 5',
    badgeZh: '偏振测量',
  },
]

// Other modules (low probability pool)
const OTHER_SHOWCASE_ITEMS: ShowcaseItem[] = [
  // Games
  {
    id: 'game-2d',
    type: 'game',
    titleZh: '2D偏振谜题',
    titleEn: '2D Polarization Puzzle',
    descriptionZh: '用偏振原理解开精妙谜题',
    descriptionEn: 'Solve puzzles with polarization principles',
    icon: Puzzle,
    iconName: 'Puzzle',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    link: '/games/2d',
    badge: 'Game',
    badgeZh: '游戏',
  },
  {
    id: 'game-3d',
    type: 'game',
    titleZh: '3D光学世界',
    titleEn: '3D Optical World',
    descriptionZh: '在立体世界中操控光线',
    descriptionEn: 'Manipulate light in a 3D world',
    icon: Gamepad2,
    iconName: 'Gamepad2',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    link: '/games/3d',
    badge: 'Game',
    badgeZh: '游戏',
  },
  {
    id: 'game-escape',
    type: 'game',
    titleZh: '光学密室逃脱',
    titleEn: 'Optical Escape Room',
    descriptionZh: '用光学知识逃出密室',
    descriptionEn: 'Escape using optical knowledge',
    icon: Search,
    iconName: 'Search',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    link: '/games/escape',
    badge: 'Game',
    badgeZh: '游戏',
  },
  // Calculators
  {
    id: 'calc-jones',
    type: 'calculator',
    titleZh: 'Jones计算器',
    titleEn: 'Jones Calculator',
    descriptionZh: '计算Jones矢量和矩阵变换',
    descriptionEn: 'Calculate Jones vectors and transformations',
    icon: Calculator,
    iconName: 'Calculator',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    link: '/calc/jones',
    badge: 'Calc',
    badgeZh: '计算器',
  },
  {
    id: 'calc-stokes',
    type: 'calculator',
    titleZh: 'Stokes计算器',
    titleEn: 'Stokes Calculator',
    descriptionZh: '分析斯托克斯参数',
    descriptionEn: 'Analyze Stokes parameters',
    icon: Calculator,
    iconName: 'Calculator',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    link: '/calc/stokes',
    badge: 'Calc',
    badgeZh: '计算器',
  },
  {
    id: 'calc-poincare',
    type: 'calculator',
    titleZh: '庞加莱球可视化',
    titleEn: 'Poincaré Sphere',
    descriptionZh: '在球面上可视化偏振态',
    descriptionEn: 'Visualize polarization states on a sphere',
    icon: CircleDot,
    iconName: 'CircleDot',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    link: '/calc/poincare',
    badge: 'Calc',
    badgeZh: '计算器',
  },
  // Tools
  {
    id: 'optical-studio',
    type: 'tool',
    titleZh: '光学设计室',
    titleEn: 'Optical Studio',
    descriptionZh: '自由设计光学系统',
    descriptionEn: 'Design optical systems freely',
    icon: Palette,
    iconName: 'Palette',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    link: '/optical-studio',
    badge: 'Tool',
    badgeZh: '工具',
  },
  {
    id: 'experiments',
    type: 'tool',
    titleZh: '偏振造物局',
    titleEn: 'Experiments Lab',
    descriptionZh: '动手创造偏振艺术',
    descriptionEn: 'Create polarization art',
    icon: FlaskConical,
    iconName: 'FlaskConical',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    link: '/experiments',
    badge: 'Tool',
    badgeZh: '工具',
  },
]

// ============================================================================
// Random Selection Logic - 随机选择逻辑
// ============================================================================

const STORAGE_KEY = 'gallery_showcase_cache'
// Cache duration: 1 hour (seed changes each hour, which invalidates cache automatically)

// Cached item type without the icon function (can't be serialized)
type CachedShowcaseItem = Omit<ShowcaseItem, 'icon'>

interface ShowcaseCache {
  timestamp: number
  items: CachedShowcaseItem[]
  seed: number
}

/**
 * Restore icon component from iconName for cached items
 */
function restoreIcons(cachedItems: CachedShowcaseItem[]): ShowcaseItem[] {
  return cachedItems.map(item => ({
    ...item,
    icon: ICON_MAP[item.iconName],
  }))
}

/**
 * Seeded random number generator using mulberry32 algorithm
 * Provides deterministic random numbers for the same seed
 */
function seededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/**
 * Get current hour-based seed
 * Changes every hour on the hour
 */
function getHourlySeed(): number {
  const now = new Date()
  // Round down to the current hour
  const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
  return hourStart.getTime()
}

/**
 * Shuffle array using Fisher-Yates algorithm with seeded random
 */
function shuffleArray<T>(array: T[], random: () => number): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Select showcase items with weighted randomization
 * - 85% chance to pick from demo pool
 * - 15% chance to pick from other pool
 * - Ensures variety by not picking duplicates
 */
function selectShowcaseItems(random: () => number, count: number = 6): ShowcaseItem[] {
  const selected: ShowcaseItem[] = []
  const usedDemoIds = new Set<string>()
  const usedOtherIds = new Set<string>()

  // Shuffle both pools
  const shuffledDemos = shuffleArray(DEMO_SHOWCASE_ITEMS, random)
  const shuffledOther = shuffleArray(OTHER_SHOWCASE_ITEMS, random)

  let demoIndex = 0
  let otherIndex = 0

  while (selected.length < count) {
    // 85% demo, 15% other
    const pickDemo = random() < 0.85

    if (pickDemo && demoIndex < shuffledDemos.length) {
      const item = shuffledDemos[demoIndex++]
      if (!usedDemoIds.has(item.id)) {
        usedDemoIds.add(item.id)
        selected.push(item)
      }
    } else if (otherIndex < shuffledOther.length) {
      const item = shuffledOther[otherIndex++]
      if (!usedOtherIds.has(item.id)) {
        usedOtherIds.add(item.id)
        selected.push(item)
      }
    } else if (demoIndex < shuffledDemos.length) {
      // Fall back to demos if other pool exhausted
      const item = shuffledDemos[demoIndex++]
      if (!usedDemoIds.has(item.id)) {
        usedDemoIds.add(item.id)
        selected.push(item)
      }
    } else {
      // Both pools exhausted
      break
    }
  }

  // Final shuffle to mix demo and other items
  return shuffleArray(selected, random)
}

/**
 * Get cached showcase items or generate new ones
 * Cache is valid for 1 hour
 */
export function getShowcaseItems(count: number = 6): ShowcaseItem[] {
  const currentSeed = getHourlySeed()

  // Try to get from localStorage
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      const data: ShowcaseCache = JSON.parse(cached)
      // Check if cache is still valid (same hour seed)
      if (data.seed === currentSeed && data.items.length === count) {
        // Restore icon components from iconName
        return restoreIcons(data.items)
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  // Generate new selection
  const random = seededRandom(currentSeed)
  const items = selectShowcaseItems(random, count)

  // Cache the result (without icon functions - they can't be serialized)
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemsForCache: CachedShowcaseItem[] = items.map(({ icon, ...rest }) => rest)
    const cacheData: ShowcaseCache = {
      timestamp: Date.now(),
      items: itemsForCache,
      seed: currentSeed,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData))
  } catch {
    // Ignore localStorage errors
  }

  return items
}

/**
 * Force refresh showcase items (for testing or manual refresh)
 */
export function refreshShowcaseItems(count: number = 6): ShowcaseItem[] {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore localStorage errors
  }
  return getShowcaseItems(count)
}

/**
 * Get time until next showcase refresh
 */
export function getTimeUntilRefresh(): { minutes: number; seconds: number } {
  const now = new Date()
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1)
  const msUntilRefresh = nextHour.getTime() - now.getTime()

  const minutes = Math.floor(msUntilRefresh / 60000)
  const seconds = Math.floor((msUntilRefresh % 60000) / 1000)

  return { minutes, seconds }
}

// Export item pools for external use if needed
export { DEMO_SHOWCASE_ITEMS, OTHER_SHOWCASE_ITEMS }
