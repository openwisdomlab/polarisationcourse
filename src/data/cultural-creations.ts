/**
 * Cultural Creations Data (文创作品数据)
 * Structured data for polarization art cultural products
 *
 * File naming convention:
 * - Images: 文创-{name}-{system}-正视图.jpg
 *   - system: 平行偏振系统 (parallel) / 正交偏振系统 (crossed) / 正视图 (front view)
 * - Videos: 文创-{name}-{system}-{action}视频.mp4
 *   - action: 旋转样品 (rotate sample) / 旋转偏振片 (rotate polarizer)
 */

// ===== Types =====
export type PolarizationSystem = 'parallel' | 'crossed' | 'front'
export type VideoAction = 'rotate-sample' | 'rotate-polarizer'

export interface CulturalMedia {
  id: string
  // Media info
  type: 'image' | 'video'
  path: string
  thumbnail?: string  // For videos, use a related image as thumbnail

  // Content info
  name: string
  nameZh: string
  description: string
  descriptionZh: string

  // Classification
  category: 'character' | 'logo' | 'animal' | 'abstract'
  series: string  // Group related items (e.g., 'simpsons', 'usagi')

  // Polarization properties
  polarizationSystem: PolarizationSystem
  videoAction?: VideoAction

  // Tags for linking to demos
  tags?: string[]  // e.g., ['chromatic-polarization', 'birefringence']

  // Display
  featured?: boolean
  order?: number
}

export interface CulturalSeries {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  category: 'character' | 'logo' | 'animal' | 'abstract'
  thumbnail: string
  mediaCount: number
}

// ===== Cultural Content Series =====
export const CULTURAL_SERIES: CulturalSeries[] = [
  {
    id: 'usagi',
    name: 'Usagi (Rabbit Character)',
    nameZh: '乌萨奇',
    description: 'A cute rabbit character showcasing vibrant polarization colors through birefringent film.',
    descriptionZh: '可爱的兔子角色，通过双折射薄膜展现鲜艳的偏振色彩。',
    category: 'character',
    thumbnail: '/images/chromatic-polarization/文创-乌萨奇正视图.jpg',
    mediaCount: 7,
  },
  {
    id: 'simpsons-bart',
    name: 'The Simpsons - Bart',
    nameZh: '辛普森一家 - 巴特',
    description: 'Iconic Bart Simpson rendered in polarization art, showing unique color effects.',
    descriptionZh: '标志性的巴特·辛普森以偏振艺术呈现，展示独特的色彩效果。',
    category: 'character',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家巴特正视图.jpg',
    mediaCount: 7,
  },
  {
    id: 'simpsons-lisa',
    name: 'The Simpsons - Lisa',
    nameZh: '辛普森一家 - 丽莎',
    description: 'Lisa Simpson with her saxophone, beautiful chromatic polarization effects.',
    descriptionZh: '手持萨克斯风的丽莎·辛普森，展现美丽的色偏振效果。',
    category: 'character',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家丽莎正视图.jpg',
    mediaCount: 5,
  },
  {
    id: 'college-logo',
    name: 'College Logo',
    nameZh: '学院Logo',
    description: 'University/college emblem demonstrating institutional polarization art applications.',
    descriptionZh: '大学/学院徽章，展示偏振艺术在机构标识中的应用。',
    category: 'logo',
    thumbnail: '/images/chromatic-polarization/文创-学院logo正视图.jpg',
    mediaCount: 5,
  },
  {
    id: 'cat-dog',
    name: 'Cat & Dog',
    nameZh: '小猫小狗',
    description: 'Adorable pets illustrated with polarization birefringence technique.',
    descriptionZh: '使用偏振双折射技术绘制的可爱宠物图案。',
    category: 'animal',
    thumbnail: '/images/chromatic-polarization/文创-小猫小狗正视图.jpg',
    mediaCount: 5,
  },
]

// ===== Cultural Media Items =====
export const CULTURAL_MEDIA: CulturalMedia[] = [
  // ===== 乌萨奇 (Usagi) Series =====
  {
    id: 'usagi-front-1',
    type: 'image',
    path: '/images/chromatic-polarization/文创-乌萨奇正视图.jpg',
    name: 'Usagi - Front View',
    nameZh: '乌萨奇 - 正视图',
    description: 'Front view of Usagi character without polarizers',
    descriptionZh: '乌萨奇角色正视图（无偏振片）',
    category: 'character',
    series: 'usagi',
    polarizationSystem: 'front',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 1,
  },
  {
    id: 'usagi-front-2',
    type: 'image',
    path: '/images/chromatic-polarization/文创-乌萨奇正视图（2）.jpg',
    name: 'Usagi - Front View (Alternate)',
    nameZh: '乌萨奇 - 正视图（2）',
    description: 'Alternate front view of Usagi character',
    descriptionZh: '乌萨奇角色正视图（备选）',
    category: 'character',
    series: 'usagi',
    polarizationSystem: 'front',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 2,
  },
  {
    id: 'usagi-parallel',
    type: 'image',
    path: '/images/chromatic-polarization/文创-乌萨奇-平行偏振系统-正视图.jpg',
    name: 'Usagi - Parallel Polarizers',
    nameZh: '乌萨奇 - 平行偏振系统',
    description: 'Usagi viewed through parallel polarizers, showing bright colors',
    descriptionZh: '通过平行偏振片观察乌萨奇，显示明亮色彩',
    category: 'character',
    series: 'usagi',
    polarizationSystem: 'parallel',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 3,
  },
  {
    id: 'usagi-crossed',
    type: 'image',
    path: '/images/chromatic-polarization/文创-乌萨奇-正交偏振系统-正视图.jpg',
    name: 'Usagi - Crossed Polarizers',
    nameZh: '乌萨奇 - 正交偏振系统',
    description: 'Usagi viewed through crossed polarizers, showing birefringent colors',
    descriptionZh: '通过正交偏振片观察乌萨奇，显示双折射色彩',
    category: 'character',
    series: 'usagi',
    polarizationSystem: 'crossed',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 4,
  },
  {
    id: 'usagi-video-parallel',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-乌萨奇-平行偏振系统-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-乌萨奇-平行偏振系统-正视图.jpg',
    name: 'Usagi - Rotating Sample (Parallel)',
    nameZh: '乌萨奇 - 旋转样品（平行系统）',
    description: 'Video showing Usagi sample rotation through parallel polarizers',
    descriptionZh: '在平行偏振系统中旋转乌萨奇样品的视频',
    category: 'character',
    series: 'usagi',
    polarizationSystem: 'parallel',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 5,
  },
  {
    id: 'usagi-video-crossed-h',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-乌萨奇-正交偏振系统（横向）-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-乌萨奇-正交偏振系统-正视图.jpg',
    name: 'Usagi - Rotating Sample (Crossed, Horizontal)',
    nameZh: '乌萨奇 - 旋转样品（正交系统，横向）',
    description: 'Video showing Usagi sample rotation through crossed polarizers (horizontal)',
    descriptionZh: '在正交偏振系统中旋转乌萨奇样品的视频（横向）',
    category: 'character',
    series: 'usagi',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 6,
  },
  {
    id: 'usagi-video-crossed-v',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-乌萨奇-正交偏振系统（竖直）-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-乌萨奇-正交偏振系统-正视图.jpg',
    name: 'Usagi - Rotating Sample (Crossed, Vertical)',
    nameZh: '乌萨奇 - 旋转样品（正交系统，竖直）',
    description: 'Video showing Usagi sample rotation through crossed polarizers (vertical)',
    descriptionZh: '在正交偏振系统中旋转乌萨奇样品的视频（竖直）',
    category: 'character',
    series: 'usagi',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 7,
  },

  // ===== 辛普森一家巴特 (Simpsons Bart) Series =====
  {
    id: 'bart-front',
    type: 'image',
    path: '/images/chromatic-polarization/文创-辛普森一家巴特正视图.jpg',
    name: 'Bart Simpson - Front View',
    nameZh: '巴特·辛普森 - 正视图',
    description: 'Front view of Bart Simpson polarization art without polarizers',
    descriptionZh: '巴特·辛普森偏振艺术正视图（无偏振片）',
    category: 'character',
    series: 'simpsons-bart',
    polarizationSystem: 'front',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 1,
  },
  {
    id: 'bart-parallel',
    type: 'image',
    path: '/images/chromatic-polarization/文创-辛普森一家巴特-平行偏振系统-正视图.jpg',
    name: 'Bart Simpson - Parallel Polarizers',
    nameZh: '巴特·辛普森 - 平行偏振系统',
    description: 'Bart viewed through parallel polarizers',
    descriptionZh: '通过平行偏振片观察巴特',
    category: 'character',
    series: 'simpsons-bart',
    polarizationSystem: 'parallel',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 2,
  },
  {
    id: 'bart-crossed',
    type: 'image',
    path: '/images/chromatic-polarization/文创-辛普森一家巴特-正交偏振系统-正视图.jpg',
    name: 'Bart Simpson - Crossed Polarizers',
    nameZh: '巴特·辛普森 - 正交偏振系统',
    description: 'Bart viewed through crossed polarizers, showing chromatic polarization',
    descriptionZh: '通过正交偏振片观察巴特，显示色偏振效果',
    category: 'character',
    series: 'simpsons-bart',
    polarizationSystem: 'crossed',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 3,
  },
  {
    id: 'bart-video-parallel-polarizer',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-辛普森一家巴特-平行偏振系统-旋转偏振片视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家巴特-平行偏振系统-正视图.jpg',
    name: 'Bart - Rotating Polarizer (Parallel)',
    nameZh: '巴特 - 旋转偏振片（平行系统）',
    description: 'Video showing polarizer rotation with Bart (parallel system)',
    descriptionZh: '在平行系统中旋转偏振片观察巴特的视频',
    category: 'character',
    series: 'simpsons-bart',
    polarizationSystem: 'parallel',
    videoAction: 'rotate-polarizer',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 4,
  },
  {
    id: 'bart-video-parallel-sample',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-辛普森一家巴特-平行偏振系统-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家巴特-平行偏振系统-正视图.jpg',
    name: 'Bart - Rotating Sample (Parallel)',
    nameZh: '巴特 - 旋转样品（平行系统）',
    description: 'Video showing sample rotation with Bart (parallel system)',
    descriptionZh: '在平行系统中旋转巴特样品的视频',
    category: 'character',
    series: 'simpsons-bart',
    polarizationSystem: 'parallel',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 5,
  },
  {
    id: 'bart-video-crossed-polarizer',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-辛普森一家巴特-正交偏振系统-旋转偏振片视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家巴特-正交偏振系统-正视图.jpg',
    name: 'Bart - Rotating Polarizer (Crossed)',
    nameZh: '巴特 - 旋转偏振片（正交系统）',
    description: 'Video showing polarizer rotation with Bart (crossed system)',
    descriptionZh: '在正交系统中旋转偏振片观察巴特的视频',
    category: 'character',
    series: 'simpsons-bart',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-polarizer',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 6,
  },
  {
    id: 'bart-video-crossed-sample',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-辛普森一家巴特-正交偏振系统-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家巴特-正交偏振系统-正视图.jpg',
    name: 'Bart - Rotating Sample (Crossed)',
    nameZh: '巴特 - 旋转样品（正交系统）',
    description: 'Video showing sample rotation with Bart (crossed system)',
    descriptionZh: '在正交系统中旋转巴特样品的视频',
    category: 'character',
    series: 'simpsons-bart',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 7,
  },

  // ===== 辛普森一家丽莎 (Simpsons Lisa) Series =====
  {
    id: 'lisa-front',
    type: 'image',
    path: '/images/chromatic-polarization/文创-辛普森一家丽莎正视图.jpg',
    name: 'Lisa Simpson - Front View',
    nameZh: '丽莎·辛普森 - 正视图',
    description: 'Front view of Lisa Simpson polarization art',
    descriptionZh: '丽莎·辛普森偏振艺术正视图',
    category: 'character',
    series: 'simpsons-lisa',
    polarizationSystem: 'front',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 1,
  },
  {
    id: 'lisa-parallel',
    type: 'image',
    path: '/images/chromatic-polarization/文创-辛普森一家丽莎-平行偏振系统-正视图.jpg',
    name: 'Lisa Simpson - Parallel Polarizers',
    nameZh: '丽莎·辛普森 - 平行偏振系统',
    description: 'Lisa viewed through parallel polarizers',
    descriptionZh: '通过平行偏振片观察丽莎',
    category: 'character',
    series: 'simpsons-lisa',
    polarizationSystem: 'parallel',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 2,
  },
  {
    id: 'lisa-crossed',
    type: 'image',
    path: '/images/chromatic-polarization/文创-辛普森一家丽莎-正交偏振系统-正视图.jpg',
    name: 'Lisa Simpson - Crossed Polarizers',
    nameZh: '丽莎·辛普森 - 正交偏振系统',
    description: 'Lisa viewed through crossed polarizers, beautiful chromatic effects',
    descriptionZh: '通过正交偏振片观察丽莎，美丽的色彩效果',
    category: 'character',
    series: 'simpsons-lisa',
    polarizationSystem: 'crossed',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 3,
  },
  {
    id: 'lisa-video-crossed-polarizer',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-辛普森一家丽莎-正交偏振系统-旋转偏振片视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家丽莎-正交偏振系统-正视图.jpg',
    name: 'Lisa - Rotating Polarizer (Crossed)',
    nameZh: '丽莎 - 旋转偏振片（正交系统）',
    description: 'Video showing polarizer rotation with Lisa',
    descriptionZh: '旋转偏振片观察丽莎的视频',
    category: 'character',
    series: 'simpsons-lisa',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-polarizer',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 4,
  },
  {
    id: 'lisa-video-crossed-sample',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-辛普森一家丽莎-正交偏振系统-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-辛普森一家丽莎-正交偏振系统-正视图.jpg',
    name: 'Lisa - Rotating Sample (Crossed)',
    nameZh: '丽莎 - 旋转样品（正交系统）',
    description: 'Video showing sample rotation with Lisa',
    descriptionZh: '旋转丽莎样品的视频',
    category: 'character',
    series: 'simpsons-lisa',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 5,
  },

  // ===== 学院Logo (College Logo) Series =====
  {
    id: 'logo-front',
    type: 'image',
    path: '/images/chromatic-polarization/文创-学院logo正视图.jpg',
    name: 'College Logo - Front View',
    nameZh: '学院Logo - 正视图',
    description: 'Front view of college logo polarization art',
    descriptionZh: '学院Logo偏振艺术正视图',
    category: 'logo',
    series: 'college-logo',
    polarizationSystem: 'front',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 1,
  },
  {
    id: 'logo-parallel',
    type: 'image',
    path: '/images/chromatic-polarization/文创-学院logo-平行偏振系统-正视图.jpg',
    name: 'College Logo - Parallel Polarizers',
    nameZh: '学院Logo - 平行偏振系统',
    description: 'College logo viewed through parallel polarizers',
    descriptionZh: '通过平行偏振片观察学院Logo',
    category: 'logo',
    series: 'college-logo',
    polarizationSystem: 'parallel',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 2,
  },
  {
    id: 'logo-crossed',
    type: 'image',
    path: '/images/chromatic-polarization/文创-学院logo-正交偏振系统-正视图.jpg',
    name: 'College Logo - Crossed Polarizers',
    nameZh: '学院Logo - 正交偏振系统',
    description: 'College logo viewed through crossed polarizers',
    descriptionZh: '通过正交偏振片观察学院Logo',
    category: 'logo',
    series: 'college-logo',
    polarizationSystem: 'crossed',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 3,
  },
  {
    id: 'logo-video-crossed-polarizer',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-学院logo-正交偏振系统-旋转偏振片视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-学院logo-正交偏振系统-正视图.jpg',
    name: 'College Logo - Rotating Polarizer (Crossed)',
    nameZh: '学院Logo - 旋转偏振片（正交系统）',
    description: 'Video showing polarizer rotation with college logo',
    descriptionZh: '旋转偏振片观察学院Logo的视频',
    category: 'logo',
    series: 'college-logo',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-polarizer',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 4,
  },
  {
    id: 'logo-video-crossed-sample',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-学院logo-正交偏振系统-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-学院logo-正交偏振系统-正视图.jpg',
    name: 'College Logo - Rotating Sample (Crossed)',
    nameZh: '学院Logo - 旋转样品（正交系统）',
    description: 'Video showing sample rotation with college logo',
    descriptionZh: '旋转学院Logo样品的视频',
    category: 'logo',
    series: 'college-logo',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 5,
  },

  // ===== 小猫小狗 (Cat & Dog) Series =====
  {
    id: 'catdog-front',
    type: 'image',
    path: '/images/chromatic-polarization/文创-小猫小狗正视图.jpg',
    name: 'Cat & Dog - Front View',
    nameZh: '小猫小狗 - 正视图',
    description: 'Front view of cat and dog polarization art',
    descriptionZh: '小猫小狗偏振艺术正视图',
    category: 'animal',
    series: 'cat-dog',
    polarizationSystem: 'front',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 1,
  },
  {
    id: 'catdog-parallel',
    type: 'image',
    path: '/images/chromatic-polarization/文创-小猫小狗-平行偏振系统-正视图.jpg',
    name: 'Cat & Dog - Parallel Polarizers',
    nameZh: '小猫小狗 - 平行偏振系统',
    description: 'Cat & Dog viewed through parallel polarizers',
    descriptionZh: '通过平行偏振片观察小猫小狗',
    category: 'animal',
    series: 'cat-dog',
    polarizationSystem: 'parallel',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 2,
  },
  {
    id: 'catdog-crossed',
    type: 'image',
    path: '/images/chromatic-polarization/文创-小猫小狗-正交偏振系统-正视图.jpg',
    name: 'Cat & Dog - Crossed Polarizers',
    nameZh: '小猫小狗 - 正交偏振系统',
    description: 'Cat & Dog viewed through crossed polarizers',
    descriptionZh: '通过正交偏振片观察小猫小狗',
    category: 'animal',
    series: 'cat-dog',
    polarizationSystem: 'crossed',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 3,
  },
  {
    id: 'catdog-video-crossed-polarizer',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-小猫小狗-正交偏振系统-旋转偏振片视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-小猫小狗-正交偏振系统-正视图.jpg',
    name: 'Cat & Dog - Rotating Polarizer (Crossed)',
    nameZh: '小猫小狗 - 旋转偏振片（正交系统）',
    description: 'Video showing polarizer rotation with cat & dog art',
    descriptionZh: '旋转偏振片观察小猫小狗艺术的视频',
    category: 'animal',
    series: 'cat-dog',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-polarizer',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    featured: true,
    order: 4,
  },
  {
    id: 'catdog-video-crossed-sample',
    type: 'video',
    path: '/videos/chromatic-polarization/文创-小猫小狗-正交偏振系统-旋转样品视频.mp4',
    thumbnail: '/images/chromatic-polarization/文创-小猫小狗-正交偏振系统-正视图.jpg',
    name: 'Cat & Dog - Rotating Sample (Crossed)',
    nameZh: '小猫小狗 - 旋转样品（正交系统）',
    description: 'Video showing sample rotation with cat & dog art',
    descriptionZh: '旋转小猫小狗样品的视频',
    category: 'animal',
    series: 'cat-dog',
    polarizationSystem: 'crossed',
    videoAction: 'rotate-sample',
    tags: ['chromatic-polarization', 'birefringence', 'art'],
    order: 5,
  },
]

// ===== Helper Functions =====

/** Get all media for a specific series */
export function getMediaBySeries(seriesId: string): CulturalMedia[] {
  return CULTURAL_MEDIA.filter(m => m.series === seriesId)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

/** Get featured media items */
export function getFeaturedMedia(): CulturalMedia[] {
  return CULTURAL_MEDIA.filter(m => m.featured)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

/** Get all videos */
export function getAllVideos(): CulturalMedia[] {
  return CULTURAL_MEDIA.filter(m => m.type === 'video')
}

/** Get all images */
export function getAllImages(): CulturalMedia[] {
  return CULTURAL_MEDIA.filter(m => m.type === 'image')
}

/** Get media by polarization system */
export function getMediaByPolarization(system: PolarizationSystem): CulturalMedia[] {
  return CULTURAL_MEDIA.filter(m => m.polarizationSystem === system)
}

/** Get media by tag */
export function getMediaByTag(tag: string): CulturalMedia[] {
  return CULTURAL_MEDIA.filter(m => m.tags?.includes(tag))
}

/** Get all chromatic polarization media */
export function getChromaticPolarizationMedia(): CulturalMedia[] {
  return getMediaByTag('chromatic-polarization')
}

/** Get series information by ID */
export function getSeriesById(seriesId: string): CulturalSeries | undefined {
  return CULTURAL_SERIES.find(s => s.id === seriesId)
}

// ===== Statistics =====
export const CULTURAL_STATS = {
  totalSeries: CULTURAL_SERIES.length,
  totalMedia: CULTURAL_MEDIA.length,
  totalImages: CULTURAL_MEDIA.filter(m => m.type === 'image').length,
  totalVideos: CULTURAL_MEDIA.filter(m => m.type === 'video').length,
  featuredCount: CULTURAL_MEDIA.filter(m => m.featured).length,
}
