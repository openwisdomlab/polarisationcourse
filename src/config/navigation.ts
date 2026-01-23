/**
 * Navigation Configuration - 6 Core Modules
 * 导航配置 - 6大核心模块
 *
 * This file defines the modular structure of the PolarCraft platform,
 * organized into 6 main learning and research areas.
 */

import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,        // 编年史/课程
  Hexagon,         // 光学器件
  Calculator,      // 理论计算
  Gamepad2,        // 游戏化
  Image,           // 成果展示
  FlaskConical,    // 虚拟课题组
} from 'lucide-react'

// Module types
export type ModuleId =
  | 'chronicles'      // 实验内容与历史故事
  | 'optical'         // 光学器件和典型光路
  | 'theory'          // 基本理论和计算模拟
  | 'games'           // 课程内容的游戏化改造
  | 'showcase'        // 成果展示
  | 'research'        // 虚拟课题组

// Navigation item interface
export interface NavItem {
  id: string
  path: string
  titleKey: string        // i18n key for title
  titleZh: string         // Fallback Chinese title
  titleEn: string         // Fallback English title
  icon?: string           // Emoji icon
  order?: number          // Sort order
}

// Module configuration interface
export interface ModuleConfig {
  id: ModuleId
  titleKey: string        // i18n key for module title
  titleZh: string         // Fallback Chinese title
  titleEn: string         // Fallback English title
  subtitleKey: string     // i18n key for subtitle
  subtitleZh: string      // Fallback Chinese subtitle
  subtitleEn: string      // Fallback English subtitle
  descriptionKey: string  // i18n key for description
  descriptionZh: string   // Fallback Chinese description
  descriptionEn: string   // Fallback English description
  icon: string            // Emoji icon for the module
  iconComponent?: LucideIcon  // Optional Lucide icon component
  colorTheme: {
    primary: string       // Primary color (Tailwind class name or hex)
    gradient: string      // Gradient colors
    shadow: string        // Shadow color (rgba)
  }
  mainPath: string        // Main entry route
  items: NavItem[]        // Sub-navigation items
  relatedPaths?: string[] // Related paths that belong to this module
}

/**
 * 6 Core Modules Definition
 * 六大核心模块定义
 */
export const MODULES: ModuleConfig[] = [
  // ========================================
  // Module 1: 实验内容与历史故事 (Experiments & Chronicles)
  // ========================================
  {
    id: 'chronicles',
    titleKey: 'nav.modules.chronicles.title',
    titleZh: '实验内容与历史故事',
    titleEn: 'Experiments & Chronicles',
    subtitleKey: 'nav.modules.chronicles.subtitle',
    subtitleZh: '历史发展 × 经典实验',
    subtitleEn: 'History × Classic Experiments',
    descriptionKey: 'nav.modules.chronicles.description',
    descriptionZh: '结合历史发展历程，重现典型实验（如1669年冰洲石实验），展示实验内容和结果数据。双线叙事：追溯光学史上的核心发现，聚焦偏振光的专属旅程。',
    descriptionEn: 'Combine historical development to recreate classic experiments (like the 1669 Iceland spar experiment), presenting experimental content and results. Dual narrative: trace core discoveries in optics history and focus on the unique journey of polarized light.',
    icon: '⏳',
    iconComponent: BookOpen,
    colorTheme: {
      primary: 'amber',
      gradient: 'from-amber-500 to-amber-700',
      shadow: 'rgba(201, 162, 39, 0.25)',
    },
    mainPath: '/chronicles',
    items: [
      {
        id: 'chronicles-timeline',
        path: '/chronicles',
        titleKey: 'nav.modules.chronicles.items.timeline',
        titleZh: '历史年谱',
        titleEn: 'Historical Timeline',
        icon: '📜',
        order: 1,
      },
      {
        id: 'chronicles-course',
        path: '/course',
        titleKey: 'nav.modules.chronicles.items.course',
        titleZh: '课程大纲',
        titleEn: 'Course Curriculum',
        icon: '📚',
        order: 2,
      },
      {
        id: 'chronicles-experiments',
        path: '/chronicles?tab=experiments',
        titleKey: 'nav.modules.chronicles.items.experiments',
        titleZh: '经典实验复现',
        titleEn: 'Classic Experiments',
        icon: '🔬',
        order: 3,
      },
      {
        id: 'chronicles-resources',
        path: '/chronicles?tab=resources',
        titleKey: 'nav.modules.chronicles.items.resources',
        titleZh: '实验资源库',
        titleEn: 'Experiment Gallery',
        icon: '📷',
        order: 4,
      },
    ],
    relatedPaths: ['/chronicles', '/course', '/learn'],
  },

  // ========================================
  // Module 2: 光学器件和典型光路 (Optical Arsenal)
  // ========================================
  {
    id: 'optical',
    titleKey: 'nav.modules.optical.title',
    titleZh: '光学器件和典型光路',
    titleEn: 'Optical Arsenal',
    subtitleKey: 'nav.modules.optical.subtitle',
    subtitleZh: '偏振器件 × 光路设计',
    subtitleEn: 'Devices × Light Path Design',
    descriptionKey: 'nav.modules.optical.description',
    descriptionZh: '介绍商业化偏振元器件（原理、应用、光路图），展示市场资源。浏览完整的光学器件百科，设计自定义光路，模拟经典实验。',
    descriptionEn: 'Introduce commercial polarization components (principles, applications, optical diagrams), showcasing market resources. Browse the complete optical device encyclopedia, design custom optical paths, and simulate classic experiments.',
    icon: '⬡',
    iconComponent: Hexagon,
    colorTheme: {
      primary: 'indigo',
      gradient: 'from-indigo-500 to-indigo-700',
      shadow: 'rgba(99, 102, 241, 0.25)',
    },
    mainPath: '/optical-studio',
    items: [
      {
        id: 'optical-devices',
        path: '/optical-studio?tab=devices',
        titleKey: 'nav.modules.optical.items.devices',
        titleZh: '器件图鉴',
        titleEn: 'Device Library',
        icon: '🔮',
        order: 1,
      },
      {
        id: 'optical-bench',
        path: '/optical-studio?tab=design',
        titleKey: 'nav.modules.optical.items.bench',
        titleZh: '光学工作台',
        titleEn: 'Optical Bench',
        icon: '🛠️',
        order: 2,
      },
      {
        id: 'optical-experiments',
        path: '/optical-studio?tab=experiments',
        titleKey: 'nav.modules.optical.items.experiments',
        titleZh: '经典光路实验',
        titleEn: 'Classic Experiments',
        icon: '⚡',
        order: 3,
      },
      {
        id: 'optical-hardware',
        path: '/hardware',
        titleKey: 'nav.modules.optical.items.hardware',
        titleZh: '硬件清单与BOM',
        titleEn: 'Hardware & BOM',
        icon: '📦',
        order: 4,
      },
    ],
    relatedPaths: ['/optical-studio', '/hardware', '/devices', '/bench', '/optics'],
  },

  // ========================================
  // Module 3: 基本理论和计算模拟 (Theory & Simulation)
  // ========================================
  {
    id: 'theory',
    titleKey: 'nav.modules.theory.title',
    titleZh: '基本理论和计算模拟',
    titleEn: 'Theory & Simulation',
    subtitleKey: 'nav.modules.theory.subtitle',
    subtitleZh: '物理原理 × 交互演示',
    subtitleEn: 'Physics × Interactive Demos',
    descriptionKey: 'nav.modules.theory.description',
    descriptionZh: '提供物理原理公式，以及计算/模拟工具（改变参数验证结果）。把定律变成可见的实验：从马吕斯定律到双折射，让你「看得见、玩得转、记得住」。',
    descriptionEn: 'Provide physics formulas and calculation/simulation tools (change parameters to verify results). Turn laws into visible experiments: from Malus\'s Law to birefringence, making it "visible, playable, and memorable".',
    icon: '◐',
    iconComponent: Calculator,
    colorTheme: {
      primary: 'cyan',
      gradient: 'from-cyan-500 to-cyan-700',
      shadow: 'rgba(8, 145, 178, 0.25)',
    },
    mainPath: '/demos',
    items: [
      {
        id: 'theory-demos',
        path: '/demos',
        titleKey: 'nav.modules.theory.items.demos',
        titleZh: '交互演示',
        titleEn: 'Interactive Demos',
        icon: '🎬',
        order: 1,
      },
      {
        id: 'theory-calc',
        path: '/calc',
        titleKey: 'nav.modules.theory.items.calculators',
        titleZh: '计算工坊',
        titleEn: 'Calculation Workshop',
        icon: '🧮',
        order: 2,
      },
      {
        id: 'theory-jones',
        path: '/calc/jones',
        titleKey: 'nav.modules.theory.items.jones',
        titleZh: 'Jones 矩阵计算器',
        titleEn: 'Jones Calculator',
        icon: '📊',
        order: 3,
      },
      {
        id: 'theory-stokes',
        path: '/calc/stokes',
        titleKey: 'nav.modules.theory.items.stokes',
        titleZh: 'Stokes 向量计算器',
        titleEn: 'Stokes Calculator',
        icon: '📈',
        order: 4,
      },
      {
        id: 'theory-mueller',
        path: '/calc/mueller',
        titleKey: 'nav.modules.theory.items.mueller',
        titleZh: 'Mueller 矩阵计算器',
        titleEn: 'Mueller Calculator',
        icon: '🔢',
        order: 5,
      },
      {
        id: 'theory-poincare',
        path: '/calc/poincare',
        titleKey: 'nav.modules.theory.items.poincare',
        titleZh: 'Poincaré 球可视化',
        titleEn: 'Poincaré Sphere',
        icon: '🌐',
        order: 6,
      },
    ],
    relatedPaths: ['/demos', '/calc', '/learn'],
  },

  // ========================================
  // Module 4: 课程内容的游戏化改造 (Gamification)
  // ========================================
  {
    id: 'games',
    titleKey: 'nav.modules.games.title',
    titleZh: '偏振探秘',
    titleEn: 'PolarQuest Games',
    subtitleKey: 'nav.modules.games.subtitle',
    subtitleZh: '解谜游戏 × 偏振策略',
    subtitleEn: 'Puzzles × Polarization Strategy',
    descriptionKey: 'nav.modules.games.description',
    descriptionZh: '利用游戏化技术重组课程内容，提升趣味性。在 2D 光路与 3D 体素世界里解谜闯关，把偏振原理变成可操作的策略。',
    descriptionEn: 'Use gamification to reorganize course content and enhance engagement. Solve puzzles in 2D light paths and 3D voxel worlds, turning polarization principles into actionable strategies.',
    icon: '🎮',
    iconComponent: Gamepad2,
    colorTheme: {
      primary: 'orange',
      gradient: 'from-orange-500 to-amber-600',
      shadow: 'rgba(245, 158, 11, 0.25)',
    },
    mainPath: '/games',
    items: [
      {
        id: 'games-hub',
        path: '/games',
        titleKey: 'nav.modules.games.items.hub',
        titleZh: '游戏中心',
        titleEn: 'Game Hub',
        icon: '🏠',
        order: 1,
      },
      {
        id: 'games-2d',
        path: '/games/2d',
        titleKey: 'nav.modules.games.items.2d',
        titleZh: 'PolarQuest 2D',
        titleEn: 'PolarQuest 2D',
        icon: '🧩',
        order: 2,
      },
      {
        id: 'games-3d',
        path: '/games/3d',
        titleKey: 'nav.modules.games.items.3d',
        titleZh: 'PolarCraft 3D',
        titleEn: 'PolarCraft 3D',
        icon: '🎲',
        order: 3,
      },
      {
        id: 'games-card',
        path: '/games/card',
        titleKey: 'nav.modules.games.items.card',
        titleZh: '偏振卡牌',
        titleEn: 'Polarization Cards',
        icon: '🃏',
        order: 4,
      },
      {
        id: 'games-escape',
        path: '/games/escape',
        titleKey: 'nav.modules.games.items.escape',
        titleZh: '光之密室',
        titleEn: 'Escape Room',
        icon: '🔐',
        order: 5,
      },
      {
        id: 'games-detective',
        path: '/games/detective',
        titleKey: 'nav.modules.games.items.detective',
        titleZh: '偏振侦探',
        titleEn: 'Detective Game',
        icon: '🕵️',
        order: 6,
      },
    ],
    relatedPaths: ['/games', '/game', '/game2d', '/cardgame', '/escape'],
  },

  // ========================================
  // Module 5: 成果展示 (Showcase & Gallery)
  // ========================================
  {
    id: 'showcase',
    titleKey: 'nav.modules.showcase.title',
    titleZh: '偏振造物局',
    titleEn: 'Showcase & Gallery',
    subtitleKey: 'nav.modules.showcase.subtitle',
    subtitleZh: '偏振艺术 × 创意作品',
    subtitleEn: 'Polarization Art × Creative Works',
    descriptionKey: 'nav.modules.showcase.description',
    descriptionZh: '展示学生的个性化研究成果（色偏振画、装置、文创）。用偏振创造艺术：偏振摄影技法、胶带双折射艺术、手机屏幕实验——在造物中感受光学之美。',
    descriptionEn: 'Showcase students\' personalized research outcomes (color polarization art, installations, creative products). Create art with polarization: photography techniques, tape birefringence art, phone screen experiments—experience the beauty of optics through creation.',
    icon: '✧',
    iconComponent: Image,
    colorTheme: {
      primary: 'pink',
      gradient: 'from-pink-500 to-rose-600',
      shadow: 'rgba(236, 72, 153, 0.25)',
    },
    mainPath: '/experiments',
    items: [
      {
        id: 'showcase-diy',
        path: '/experiments/diy',
        titleKey: 'nav.modules.showcase.items.diy',
        titleZh: 'DIY实验',
        titleEn: 'DIY Experiments',
        icon: '🔧',
        order: 1,
      },
      {
        id: 'showcase-gallery',
        path: '/experiments/gallery',
        titleKey: 'nav.modules.showcase.items.gallery',
        titleZh: '作品展廊',
        titleEn: 'Gallery',
        icon: '🖼️',
        order: 2,
      },
      {
        id: 'showcase-generator',
        path: '/experiments/generator',
        titleKey: 'nav.modules.showcase.items.generator',
        titleZh: '艺术生成器',
        titleEn: 'Art Generator',
        icon: '🎨',
        order: 3,
      },
      {
        id: 'showcase-merchandise',
        path: '/merchandise',
        titleKey: 'nav.modules.showcase.items.merchandise',
        titleZh: '偏振文创',
        titleEn: 'Merchandise',
        icon: '🛍️',
        order: 4,
      },
    ],
    relatedPaths: ['/experiments', '/merchandise', '/creative'],
  },

  // ========================================
  // Module 6: 虚拟课题组 (Virtual Lab & Research)
  // ========================================
  {
    id: 'research',
    titleKey: 'nav.modules.research.title',
    titleZh: '虚拟课题组',
    titleEn: 'Virtual Lab & Research',
    subtitleKey: 'nav.modules.research.subtitle',
    subtitleZh: '开放研究 × 课题实践',
    subtitleEn: 'Open Research × Projects',
    descriptionKey: 'nav.modules.research.description',
    descriptionZh: '提供不同层级（ESRT, ORIC, SURF）的研究课题，组队开展研究。以课题驱动学习：研究任务、偏振应用案例、专业计算工具——和伙伴一起把知识做成项目成果。',
    descriptionEn: 'Provide research topics at different levels (ESRT, ORIC, SURF) for team-based research. Drive learning through projects: research tasks, polarization application cases, professional tools—work with partners to turn knowledge into project outcomes.',
    icon: '⚗',
    iconComponent: FlaskConical,
    colorTheme: {
      primary: 'emerald',
      gradient: 'from-emerald-500 to-emerald-700',
      shadow: 'rgba(16, 185, 129, 0.25)',
    },
    mainPath: '/lab',
    items: [
      {
        id: 'research-tasks',
        path: '/lab?tab=tasks',
        titleKey: 'nav.modules.research.items.tasks',
        titleZh: '研究课题',
        titleEn: 'Research Tasks',
        icon: '📋',
        order: 1,
      },
      {
        id: 'research-applications',
        path: '/applications',
        titleKey: 'nav.modules.research.items.applications',
        titleZh: '应用案例',
        titleEn: 'Applications',
        icon: '💡',
        order: 2,
      },
      {
        id: 'research-data',
        path: '/lab?tab=data',
        titleKey: 'nav.modules.research.items.data',
        titleZh: '数据记录',
        titleEn: 'Data Records',
        icon: '📊',
        order: 3,
      },
      {
        id: 'research-community',
        path: '/lab?tab=community',
        titleKey: 'nav.modules.research.items.community',
        titleZh: '社区广场',
        titleEn: 'Community',
        icon: '👥',
        order: 4,
      },
    ],
    relatedPaths: ['/lab', '/applications', '/simulation'],
  },
]

/**
 * Get module by ID
 */
export function getModuleById(id: ModuleId): ModuleConfig | undefined {
  return MODULES.find(m => m.id === id)
}

/**
 * Get module by path (finds which module a path belongs to)
 */
export function getModuleByPath(path: string): ModuleConfig | undefined {
  // First check mainPath
  const moduleByMain = MODULES.find(m => path.startsWith(m.mainPath))
  if (moduleByMain) return moduleByMain

  // Then check relatedPaths
  return MODULES.find(m =>
    m.relatedPaths?.some(rp => path.startsWith(rp))
  )
}

/**
 * Quick links for header/footer navigation
 */
export const QUICK_LINKS = [
  { path: '/course', titleZh: '课程', titleEn: 'Course' },
  { path: '/demos', titleZh: '演示', titleEn: 'Demos' },
  { path: '/games', titleZh: '游戏', titleEn: 'Games' },
  { path: '/optical-studio', titleZh: '设计室', titleEn: 'Studio' },
]

/**
 * Footer links organized by category
 */
export const FOOTER_LINKS = {
  learn: [
    { path: '/course', titleZh: '课程大纲', titleEn: 'Course' },
    { path: '/demos', titleZh: '交互演示', titleEn: 'Demos' },
    { path: '/chronicles', titleZh: '历史故事', titleEn: 'Chronicles' },
  ],
  tools: [
    { path: '/optical-studio', titleZh: '光学设计室', titleEn: 'Optical Studio' },
    { path: '/calc', titleZh: '计算工坊', titleEn: 'Calculators' },
    { path: '/hardware', titleZh: '硬件清单', titleEn: 'Hardware' },
  ],
  play: [
    { path: '/games', titleZh: '游戏中心', titleEn: 'Game Hub' },
    { path: '/games/2d', titleZh: '2D 解谜', titleEn: '2D Puzzles' },
    { path: '/games/3d', titleZh: '3D 体素', titleEn: '3D Voxel' },
  ],
  community: [
    { path: '/experiments', titleZh: '创作展示', titleEn: 'Creations' },
    { path: '/lab', titleZh: '虚拟课题组', titleEn: 'Virtual Lab' },
    { path: '/applications', titleZh: '应用案例', titleEn: 'Applications' },
  ],
}

/**
 * Legacy route mappings for backwards compatibility
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Game redirects
  '/game': '/games/3d',
  '/game2d': '/games/2d',
  '/cardgame': '/games/card',
  '/escape': '/games/escape',

  // Optical studio redirects
  '/devices': '/optical-studio',
  '/bench': '/optical-studio',
  '/optics': '/optical-studio',
  '/optical-studio-v2': '/optical-studio',

  // Lab tool redirects
  '/lab/poincare': '/calc/poincare',
  '/lab/jones': '/calc/jones',
  '/lab/stokes': '/calc/stokes',
  '/lab/mueller': '/calc/mueller',

  // Other redirects
  '/creative': '/experiments',
  '/simulation': '/lab',
}

export default MODULES
