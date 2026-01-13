/**
 * Course-Timeline Integration Data
 * 课程大纲与历史时间线的整合数据结构
 *
 * 设计理念：
 * - 双轨时间线（广义光学 + 偏振光）与5个课程单元的映射
 * - 每个时代/发现与具体实验和演示的关联
 * - P-SRT问题牵引的学习路径
 */

import { TIMELINE_EVENTS, type TimelineEvent } from './timeline-events'

// 历史时代定义
export interface HistoricalEra {
  id: string
  startYear: number
  endYear: number
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  themeColor: string
  icon: string // emoji
  keyDiscoveries: string[] // timeline event titles
  courseUnits: number[] // related course unit numbers (1-5)
  milestoneQuestionEn: string // P-SRT style question
  milestoneQuestionZh: string
}

// 历史时代划分 - 按光学发展史分期
export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'classical',
    startYear: 1600,
    endYear: 1700,
    nameEn: 'Dawn of Optics',
    nameZh: '光学黎明',
    descriptionEn: 'From Snell\'s Law to Newton\'s prism — the birth of scientific optics',
    descriptionZh: '从斯涅尔定律到牛顿棱镜——科学光学的诞生',
    themeColor: '#F59E0B',
    icon: '🌅',
    keyDiscoveries: ['Snell\'s Law', 'Newton\'s Prism', 'Bartholin\'s Calcite'],
    courseUnits: [1],
    milestoneQuestionEn: 'Why does a prism split white light into colors?',
    milestoneQuestionZh: '为什么棱镜能把白光分成彩色？',
  },
  {
    id: 'wave-theory',
    startYear: 1800,
    endYear: 1850,
    nameEn: 'Wave Revolution',
    nameZh: '波动革命',
    descriptionEn: 'Young, Fresnel, and Malus prove light is a wave with polarization',
    descriptionZh: '杨、菲涅尔和马吕斯证明光是具有偏振性的波',
    themeColor: '#3B82F6',
    icon: '🌊',
    keyDiscoveries: ['Double-Slit', 'Malus\'s Law', 'Fresnel Equations', 'Brewster\'s Angle'],
    courseUnits: [1, 2],
    milestoneQuestionEn: 'How did scientists discover that light is a wave?',
    milestoneQuestionZh: '科学家是如何发现光是波的？',
  },
  {
    id: 'electromagnetic',
    startYear: 1850,
    endYear: 1900,
    nameEn: 'Electromagnetic Era',
    nameZh: '电磁时代',
    descriptionEn: 'Maxwell unifies light with electricity and magnetism',
    descriptionZh: '麦克斯韦将光与电磁统一',
    themeColor: '#8B5CF6',
    icon: '⚡',
    keyDiscoveries: ['Maxwell\'s Equations', 'Stokes Parameters', 'Rayleigh Scattering'],
    courseUnits: [4, 5],
    milestoneQuestionEn: 'What is light really made of?',
    milestoneQuestionZh: '光到底是什么？',
  },
  {
    id: 'modern',
    startYear: 1900,
    endYear: 2030,
    nameEn: 'Quantum & Applications',
    nameZh: '量子与应用',
    descriptionEn: 'From Einstein\'s photons to polarimetric imaging',
    descriptionZh: '从爱因斯坦的光子到偏振成像',
    themeColor: '#EC4899',
    icon: '🔬',
    keyDiscoveries: ['Photoelectric Effect', 'Jones Calculus', 'Mueller Matrix', 'Polarimetric Imaging'],
    courseUnits: [3, 5],
    milestoneQuestionEn: 'How can polarization help us see the invisible?',
    milestoneQuestionZh: '偏振如何帮助我们看见看不见的东西？',
  },
]

// 课程单元与时间线事件的映射
export interface CourseTimelineMapping {
  unitNumber: number
  unitTitleEn: string
  unitTitleZh: string
  coreQuestionEn: string
  coreQuestionZh: string
  historicalOriginYear: number // 历史起源年份
  historicalOriginEvent: string // 起源事件标题
  relatedTimelineYears: number[] // 相关时间线年份
  keyExperimentDemo: string // 核心实验演示链接
  lifeSceneExamples: LifeSceneExample[]
  handsOnExperiments: HandsOnExperiment[]
  era: string // era id
}

// 生活场景示例
export interface LifeSceneExample {
  id: string
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  icon: string
  imageHint?: string // 图片描述提示
  demoLink?: string
}

// 动手实验
export interface HandsOnExperiment {
  id: string
  titleEn: string
  titleZh: string
  difficulty: 'easy' | 'medium' | 'advanced'
  materials: string[]
  demoLink?: string
  icon: string
}

// 课程单元与时间线的整合数据
export const COURSE_TIMELINE_MAPPINGS: CourseTimelineMapping[] = [
  {
    unitNumber: 1,
    unitTitleEn: 'Polarization States, Modulation & Measurement',
    unitTitleZh: '光的偏振态及其调制和测量',
    coreQuestionEn: 'Why do we see double images through Iceland spar?',
    coreQuestionZh: '透过冰洲石看字，为什么会看到两个像？',
    historicalOriginYear: 1669,
    historicalOriginEvent: 'Bartholin\'s Calcite Discovery',
    relatedTimelineYears: [1669, 1808, 1828, 1852],
    keyExperimentDemo: '/demos/birefringence',
    era: 'classical',
    lifeSceneExamples: [
      {
        id: 'lcd-screen',
        titleEn: 'LCD Screen Mystery',
        titleZh: '液晶屏幕之谜',
        descriptionEn: 'Why does your phone screen turn black when viewed through polarized sunglasses at certain angles?',
        descriptionZh: '为什么戴偏光太阳镜看手机屏幕，转动到某个角度就会变黑？',
        icon: '📱',
        demoLink: '/demos/malus',
      },
      {
        id: 'rainbow-tape',
        titleEn: 'Rainbow Tape Art',
        titleZh: '彩虹胶带艺术',
        descriptionEn: 'Transparent tape creates beautiful rainbow patterns between polarizers!',
        descriptionZh: '透明胶带在偏振片之间会产生美丽的彩虹图案！',
        icon: '🌈',
        demoLink: '/demos/chromatic',
      },
    ],
    handsOnExperiments: [
      {
        id: 'calcite-double',
        titleEn: 'Calcite Double Image',
        titleZh: '冰洲石双像实验',
        difficulty: 'easy',
        materials: ['Iceland spar crystal', 'Text on paper', 'Polarizer sheet'],
        demoLink: '/demos/birefringence',
        icon: '💎',
      },
      {
        id: 'malus-polarizers',
        titleEn: 'Malus Law with Polarizers',
        titleZh: '偏振片验证马吕斯定律',
        difficulty: 'easy',
        materials: ['2 polarizer sheets', 'Flashlight or phone screen'],
        demoLink: '/demos/malus',
        icon: '🔦',
      },
    ],
  },
  {
    unitNumber: 2,
    unitTitleEn: 'Polarization in Interface Reflection',
    unitTitleZh: '界面反射的偏振特征',
    coreQuestionEn: 'Why can polarized sunglasses reduce glare from road surfaces?',
    coreQuestionZh: '为什么偏振太阳镜能减少路面的刺眼反光？',
    historicalOriginYear: 1808,
    historicalOriginEvent: 'Malus\'s Reflection Discovery',
    relatedTimelineYears: [1808, 1815, 1823],
    keyExperimentDemo: '/demos/brewster',
    era: 'wave-theory',
    lifeSceneExamples: [
      {
        id: 'sunglasses',
        titleEn: 'Polarized Sunglasses',
        titleZh: '偏光太阳镜',
        descriptionEn: 'Why do fishermen love polarized sunglasses? They can see fish underwater!',
        descriptionZh: '为什么钓鱼人喜欢偏光太阳镜？因为能看清水下的鱼！',
        icon: '🕶️',
        demoLink: '/demos/brewster',
      },
      {
        id: 'window-glare',
        titleEn: 'Window Glare',
        titleZh: '窗户反光',
        descriptionEn: 'Glass windows reflect more light at certain angles. Photography tip: use a polarizing filter!',
        descriptionZh: '玻璃窗在特定角度反光更强。摄影技巧：用偏振滤镜！',
        icon: '🪟',
        demoLink: '/demos/fresnel',
      },
    ],
    handsOnExperiments: [
      {
        id: 'brewster-glass',
        titleEn: 'Find Brewster\'s Angle',
        titleZh: '寻找布儒斯特角',
        difficulty: 'medium',
        materials: ['Glass plate', 'Laser pointer', 'Polarizer', 'Protractor'],
        demoLink: '/demos/brewster',
        icon: '📐',
      },
    ],
  },
  {
    unitNumber: 3,
    unitTitleEn: 'Polarization in Transparent Media',
    unitTitleZh: '透明介质的偏振特征',
    coreQuestionEn: 'Why do colorful patterns appear at glass curtain wall corners?',
    coreQuestionZh: '玻璃幕墙边角为什么会出现彩色图案？',
    historicalOriginYear: 1811,
    historicalOriginEvent: 'Arago\'s Chromatic Polarization',
    relatedTimelineYears: [1811, 1815, 1848],
    keyExperimentDemo: '/demos/chromatic',
    era: 'modern',
    lifeSceneExamples: [
      {
        id: 'stress-patterns',
        titleEn: 'Stress in Plastic',
        titleZh: '塑料应力图案',
        descriptionEn: 'Press a clear plastic ruler between polarizers — see the hidden stress!',
        descriptionZh: '把透明塑料尺夹在偏振片之间按压——看到隐藏的应力！',
        icon: '📏',
        demoLink: '/demos/anisotropy',
      },
      {
        id: 'sugar-rainbow',
        titleEn: 'Sugar Rainbow',
        titleZh: '糖水彩虹',
        descriptionEn: 'A glass of sugar water creates a vertical rainbow when viewed through polarizers!',
        descriptionZh: '一杯糖水在偏振片下呈现垂直的彩虹！',
        icon: '🍬',
        demoLink: '/demos/optical-rotation',
      },
    ],
    handsOnExperiments: [
      {
        id: 'tape-art',
        titleEn: 'Polarization Tape Art',
        titleZh: '偏振胶带艺术',
        difficulty: 'easy',
        materials: ['Transparent tape', '2 polarizers', 'Glass or plastic sheet'],
        demoLink: '/demos/chromatic',
        icon: '🎨',
      },
      {
        id: 'sugar-rotation',
        titleEn: 'Sugar Solution Rotation',
        titleZh: '糖溶液旋光实验',
        difficulty: 'medium',
        materials: ['Sugar', 'Water', 'Clear container', '2 polarizers', 'Flashlight'],
        demoLink: '/demos/optical-rotation',
        icon: '🧪',
      },
    ],
  },
  {
    unitNumber: 4,
    unitTitleEn: 'Polarization in Turbid Media',
    unitTitleZh: '浑浊介质的偏振特征',
    coreQuestionEn: 'Why is the sky blue? Why are sunsets red? Why are clouds white?',
    coreQuestionZh: '天空为什么是蓝色的？夕阳为什么是红色的？云为什么是白色的？',
    historicalOriginYear: 1871,
    historicalOriginEvent: 'Rayleigh Scattering Theory',
    relatedTimelineYears: [1871, 1908],
    keyExperimentDemo: '/demos/rayleigh',
    era: 'electromagnetic',
    lifeSceneExamples: [
      {
        id: 'blue-sky',
        titleEn: 'Blue Sky Secret',
        titleZh: '蓝天的秘密',
        descriptionEn: 'The blue sky is polarized! Viking navigators used this to find their way.',
        descriptionZh: '蓝天是偏振的！维京航海家利用这一点来导航。',
        icon: '🌤️',
        demoLink: '/demos/rayleigh',
      },
      {
        id: 'milk-sunset',
        titleEn: 'Milk Sunset',
        titleZh: '牛奶日落',
        descriptionEn: 'A few drops of milk in water can simulate sunset colors!',
        descriptionZh: '在水中滴几滴牛奶就能模拟日落的颜色！',
        icon: '🥛',
        demoLink: '/demos/mie-scattering',
      },
    ],
    handsOnExperiments: [
      {
        id: 'milk-sky',
        titleEn: 'Milk Sky Simulation',
        titleZh: '牛奶天空模拟',
        difficulty: 'easy',
        materials: ['Clear water', 'Milk (few drops)', 'Flashlight', 'Dark room'],
        demoLink: '/demos/rayleigh',
        icon: '🔦',
      },
    ],
  },
  {
    unitNumber: 5,
    unitTitleEn: 'Full Polarimetry Techniques',
    unitTitleZh: '全偏振光学技术',
    coreQuestionEn: 'How to fully describe polarization states? How to reveal microstructure with polarization?',
    coreQuestionZh: '如何完整描述光的偏振状态？如何用偏振揭示物质的微观结构？',
    historicalOriginYear: 1852,
    historicalOriginEvent: 'Stokes Parameters',
    relatedTimelineYears: [1852, 1892, 1941, 1943, 2000],
    keyExperimentDemo: '/demos/mueller',
    era: 'electromagnetic',
    lifeSceneExamples: [
      {
        id: 'medical-imaging',
        titleEn: 'Polarization Microscopy',
        titleZh: '偏振显微术',
        descriptionEn: 'Doctors use polarization to see tissue structure without staining!',
        descriptionZh: '医生用偏振光无需染色就能看到组织结构！',
        icon: '🔬',
        demoLink: '/demos/polarimetric-microscopy',
      },
      {
        id: 'autonomous-driving',
        titleEn: 'Self-Driving Cars',
        titleZh: '自动驾驶汽车',
        descriptionEn: 'Polarization cameras help cars see through fog and glare!',
        descriptionZh: '偏振相机帮助汽车穿透雾气和强光！',
        icon: '🚗',
        demoLink: '/demos/monte-carlo-scattering',
      },
    ],
    handsOnExperiments: [
      {
        id: 'stokes-measure',
        titleEn: 'Measure Stokes Parameters',
        titleZh: '测量斯托克斯参数',
        difficulty: 'advanced',
        materials: ['4 polarizers at 0°, 45°, 90°, 135°', 'Quarter wave plate', 'Light meter or camera'],
        demoLink: '/calc/stokes',
        icon: '📊',
      },
    ],
  },
]

// 获取时代对应的时间线事件
export function getTimelineEventsForEra(eraId: string): TimelineEvent[] {
  const era = HISTORICAL_ERAS.find(e => e.id === eraId)
  if (!era) return []
  return TIMELINE_EVENTS.filter(
    event => event.year >= era.startYear && event.year < era.endYear
  ).sort((a, b) => a.year - b.year)
}

// 获取课程单元对应的时间线事件
export function getTimelineEventsForUnit(unitNumber: number): TimelineEvent[] {
  const mapping = COURSE_TIMELINE_MAPPINGS.find(m => m.unitNumber === unitNumber)
  if (!mapping) return []
  return TIMELINE_EVENTS.filter(
    event => mapping.relatedTimelineYears.includes(event.year)
  ).sort((a, b) => a.year - b.year)
}

// 获取课程单元的历史起源事件
export function getOriginEventForUnit(unitNumber: number): TimelineEvent | undefined {
  const mapping = COURSE_TIMELINE_MAPPINGS.find(m => m.unitNumber === unitNumber)
  if (!mapping) return undefined
  return TIMELINE_EVENTS.find(
    event => event.year === mapping.historicalOriginYear
  )
}

// P-SRT 问题牵引的学习路径
export interface PSRTLearningPath {
  questionId: string
  questionEn: string
  questionZh: string
  difficulty: 'foundation' | 'application' | 'research'
  icon: string
  color: string
  relatedUnits: number[]
  relatedTimelineYears: number[]
  explorationSteps: {
    stepEn: string
    stepZh: string
    demoLink?: string
  }[]
}

// P-SRT 核心问题列表
export const PSRT_QUESTIONS: PSRTLearningPath[] = [
  {
    questionId: 'double-image',
    questionEn: 'Why do we see double images through calcite crystal?',
    questionZh: '透过冰洲石为什么会看到两个像？',
    difficulty: 'foundation',
    icon: '💎',
    color: '#22D3EE',
    relatedUnits: [1],
    relatedTimelineYears: [1669, 1828],
    explorationSteps: [
      { stepEn: 'Observe the double image phenomenon', stepZh: '观察双像现象', demoLink: '/demos/birefringence' },
      { stepEn: 'Rotate the crystal and watch what happens', stepZh: '旋转晶体观察变化' },
      { stepEn: 'Add a polarizer and discover the secret', stepZh: '加入偏振片揭示秘密', demoLink: '/demos/malus' },
    ],
  },
  {
    questionId: 'sunglasses',
    questionEn: 'Why do polarized sunglasses reduce glare?',
    questionZh: '偏光太阳镜为什么能减少反光？',
    difficulty: 'foundation',
    icon: '🕶️',
    color: '#A78BFA',
    relatedUnits: [2],
    relatedTimelineYears: [1808, 1815],
    explorationSteps: [
      { stepEn: 'Look at water reflection with and without polarizer', stepZh: '对比有无偏振片观察水面反光', demoLink: '/demos/brewster' },
      { stepEn: 'Rotate the polarizer and find the magic angle', stepZh: '旋转偏振片找到神奇角度' },
      { stepEn: 'Learn about Brewster\'s angle', stepZh: '了解布儒斯特角', demoLink: '/demos/fresnel' },
    ],
  },
  {
    questionId: 'blue-sky',
    questionEn: 'Why is the sky blue during day and red at sunset?',
    questionZh: '为什么白天天空是蓝色，日落时是红色？',
    difficulty: 'foundation',
    icon: '🌅',
    color: '#F59E0B',
    relatedUnits: [4],
    relatedTimelineYears: [1871],
    explorationSteps: [
      { stepEn: 'Simulate with milk in water', stepZh: '用牛奶水模拟', demoLink: '/demos/rayleigh' },
      { stepEn: 'Understand particle size effects', stepZh: '理解粒子大小的影响', demoLink: '/demos/mie-scattering' },
      { stepEn: 'Discover sky polarization', stepZh: '发现天空偏振' },
    ],
  },
  {
    questionId: 'rainbow-tape',
    questionEn: 'Why does transparent tape show rainbow colors between polarizers?',
    questionZh: '为什么透明胶带在偏振片之间会出现彩虹色？',
    difficulty: 'application',
    icon: '🌈',
    color: '#EC4899',
    relatedUnits: [3],
    relatedTimelineYears: [1811, 1815],
    explorationSteps: [
      { stepEn: 'Create tape art between polarizers', stepZh: '在偏振片间创作胶带艺术', demoLink: '/demos/chromatic' },
      { stepEn: 'Stack different layers and observe', stepZh: '叠加不同层数观察变化' },
      { stepEn: 'Understand birefringence in stressed materials', stepZh: '理解受力材料的双折射', demoLink: '/demos/anisotropy' },
    ],
  },
  {
    questionId: 'polarization-measure',
    questionEn: 'How can we completely describe light\'s polarization state?',
    questionZh: '如何完整描述光的偏振状态？',
    difficulty: 'research',
    icon: '🎯',
    color: '#8B5CF6',
    relatedUnits: [5],
    relatedTimelineYears: [1852, 1892, 1941],
    explorationSteps: [
      { stepEn: 'Learn Stokes parameters', stepZh: '学习斯托克斯参数', demoLink: '/demos/stokes' },
      { stepEn: 'Explore Mueller matrices', stepZh: '探索缪勒矩阵', demoLink: '/demos/mueller' },
      { stepEn: 'Visualize on Poincaré sphere', stepZh: '在庞加莱球上可视化', demoLink: '/calc/poincare' },
    ],
  },
]

// 好奇心触发卡片 - 用于首页展示
export interface CuriosityCard {
  id: string
  questionEn: string
  questionZh: string
  hintEn: string
  hintZh: string
  icon: string
  color: string
  demoLink: string
  relatedUnit: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export const CURIOSITY_CARDS: CuriosityCard[] = [
  {
    id: 'lcd-rotate',
    questionEn: 'Try rotating your polarized sunglasses in front of your phone screen!',
    questionZh: '试试转动偏光太阳镜看手机屏幕！',
    hintEn: 'What happens at 90°? This is Malus\'s Law in action!',
    hintZh: '转到90°会发生什么？这就是马吕斯定律！',
    icon: '📱',
    color: '#22D3EE',
    demoLink: '/demos/malus',
    relatedUnit: 1,
    difficulty: 'easy',
  },
  {
    id: 'tape-rainbow',
    questionEn: 'Put transparent tape between two polarizers...',
    questionZh: '把透明胶带放在两个偏振片之间...',
    hintEn: 'You\'ll see a rainbow! Different layers = different colors.',
    hintZh: '你会看到彩虹！不同层数=不同颜色。',
    icon: '🌈',
    color: '#EC4899',
    demoLink: '/demos/chromatic',
    relatedUnit: 3,
    difficulty: 'easy',
  },
  {
    id: 'water-fish',
    questionEn: 'Look at a fish pond through polarized sunglasses...',
    questionZh: '戴偏光太阳镜看鱼塘...',
    hintEn: 'The surface reflection disappears! You can see fish clearly.',
    hintZh: '水面反光消失了！你能清楚看到鱼。',
    icon: '🐟',
    color: '#3B82F6',
    demoLink: '/demos/brewster',
    relatedUnit: 2,
    difficulty: 'easy',
  },
  {
    id: 'sky-polarization',
    questionEn: 'Point your polarized glasses at the blue sky...',
    questionZh: '用偏光眼镜看蓝天...',
    hintEn: 'Rotate them! The sky gets darker at certain angles. Vikings used this!',
    hintZh: '转动它！某些角度天空会变暗。维京人就是这样导航的！',
    icon: '🌤️',
    color: '#F59E0B',
    demoLink: '/demos/rayleigh',
    relatedUnit: 4,
    difficulty: 'medium',
  },
  {
    id: 'sugar-rainbow',
    questionEn: 'Look at a sugar water bottle between polarizers...',
    questionZh: '在偏振片间观察糖水瓶...',
    hintEn: 'You\'ll see a vertical rainbow! Sugar rotates light!',
    hintZh: '你会看到竖直的彩虹！糖会旋转光！',
    icon: '🍬',
    color: '#10B981',
    demoLink: '/demos/optical-rotation',
    relatedUnit: 3,
    difficulty: 'medium',
  },
  {
    id: 'stress-ruler',
    questionEn: 'Bend a clear plastic ruler between polarizers...',
    questionZh: '在偏振片间弯曲透明塑料尺...',
    hintEn: 'See the hidden stress patterns appear as colors!',
    hintZh: '看隐藏的应力图案以彩色出现！',
    icon: '📏',
    color: '#8B5CF6',
    demoLink: '/demos/anisotropy',
    relatedUnit: 3,
    difficulty: 'easy',
  },
]
