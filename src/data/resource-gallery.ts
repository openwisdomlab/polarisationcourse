/**
 * Resource Gallery Data (资源图库数据)
 * 偏振实验图片和视频资源的结构化数据
 *
 * 资源分类:
 * - stress: 应力分析（玻璃、塑料制品的应力双折射）
 * - interference: 干涉/厚度效应（保鲜膜、透明胶的色彩变化）
 * - art: 偏振艺术（文创作品）
 * - daily: 日常物品（眼镜、矿泉水瓶等）
 *
 * 类型:
 * - image: 单张图片
 * - video: 视频
 * - sequence: 图片序列（如加热冷却过程）
 */

// ===== Types =====
export type ResourceCategory = 'stress' | 'interference' | 'art' | 'daily'
export type ResourceType = 'image' | 'video' | 'sequence'
export type PolarizationSystem = 'parallel' | 'crossed' | 'front' | 'none'

export interface SequenceFrame {
  time: number // 时间点（秒）
  label: string
  labelZh: string
  url: string
}

export interface ResourceMetadata {
  layers?: number // 重叠层数
  timePoints?: number[] // 时间点（秒）
  material?: string // 材质
  temperature?: number // 温度
  polarizationSystem?: PolarizationSystem
  angle?: number // 角度
  hasVideo?: boolean // 是否有对应视频
  videoUrl?: string // 对应视频URL
}

export interface PolarizationResource {
  id: string
  type: ResourceType
  title: string
  titleZh: string
  description?: string
  descriptionZh?: string
  category: ResourceCategory
  url: string // 主图或视频URL
  thumbnail?: string // 缩略图
  relatedModules: string[] // 相关教学模块
  metadata: ResourceMetadata
  // 序列特有属性
  frames?: SequenceFrame[]
  // 多视图属性
  views?: {
    front?: string
    parallel?: string
    crossed?: string
  }
}

// ===== 应力分析资源 =====

// 普通玻璃加热冷却序列
export const GLASS_HEATING_SEQUENCE: PolarizationResource = {
  id: 'glass-heating-cooling',
  type: 'sequence',
  title: 'Glass Thermal Stress Evolution',
  titleZh: '普通玻璃加热冷却应力演变',
  description: 'Observe how thermal stress develops and dissipates in ordinary glass during heating and cooling',
  descriptionZh: '观察普通玻璃在加热冷却过程中热应力的产生与消散',
  category: 'stress',
  url: '/images/普通玻璃加热冷却-0秒-正交偏振系统-正视图.jpg',
  thumbnail: '/images/普通玻璃加热冷却-0秒-正交偏振系统-正视图.jpg',
  relatedModules: ['birefringence', 'stress-analysis', 'anisotropy'],
  metadata: {
    timePoints: [0, 5, 10, 15, 20, 25, 30],
    material: 'ordinary glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-打火机烧玻璃-正交偏振系统-长时间观察视频.mp4',
  },
  frames: [
    { time: 0, label: 'Just Heated', labelZh: '刚加热完', url: '/images/普通玻璃加热冷却-0秒-正交偏振系统-正视图.jpg' },
    { time: 5, label: '5 seconds', labelZh: '5秒', url: '/images/普通玻璃加热冷却-5秒-正交偏振系统-正视图.jpg' },
    { time: 10, label: '10 seconds', labelZh: '10秒', url: '/images/普通玻璃加热冷却-10秒-正交偏振系统-正视图.jpg' },
    { time: 15, label: '15 seconds', labelZh: '15秒', url: '/images/普通玻璃加热冷却-15秒-正交偏振系统-正视图.jpg' },
    { time: 20, label: '20 seconds', labelZh: '20秒', url: '/images/普通玻璃加热冷却-20秒-正交偏振系统-正视图.jpg' },
    { time: 25, label: '25 seconds', labelZh: '25秒', url: '/images/普通玻璃加热冷却-25秒-正交偏振系统-正视图.jpg' },
    { time: 30, label: '30 seconds', labelZh: '30秒', url: '/images/普通玻璃加热冷却-30秒-正交偏振系统-正视图.jpg' },
  ],
}

// 玻璃对比资源
export const GLASS_COMPARISON: PolarizationResource = {
  id: 'glass-comparison',
  type: 'image',
  title: 'Tempered vs Ordinary Glass',
  titleZh: '钢化玻璃与普通玻璃对比',
  description: 'Compare the stress patterns between tempered and ordinary glass under crossed polarizers',
  descriptionZh: '正交偏振下对比钢化玻璃和普通玻璃的应力图案',
  category: 'stress',
  url: '/images/玻璃对比-正交偏振系统-正视图.jpg',
  thumbnail: '/images/玻璃对比正视图.jpg',
  relatedModules: ['stress-analysis', 'birefringence'],
  metadata: {
    material: 'glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-偏振片看钢化玻璃-朝西.mp4',
  },
  views: {
    front: '/images/玻璃对比正视图.jpg',
    parallel: '/images/玻璃对比-平行偏振系统-正视图.jpg',
    crossed: '/images/玻璃对比-正交偏振系统-正视图.jpg',
  },
}

// 钢化玻璃资源
export const TEMPERED_GLASS: PolarizationResource = {
  id: 'tempered-glass',
  type: 'image',
  title: 'Tempered Glass Stress Pattern',
  titleZh: '钢化玻璃应力图案',
  description: 'The characteristic stress pattern of tempered glass visible under polarized light',
  descriptionZh: '钢化玻璃在偏振光下显示的特征应力图案',
  category: 'stress',
  url: '/images/钢化玻璃-正交偏振系统-正视图.jpg',
  thumbnail: '/images/钢化玻璃正视图.jpg',
  relatedModules: ['stress-analysis', 'birefringence'],
  metadata: {
    material: 'tempered glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-偏振片看钢化玻璃-朝西.mp4',
  },
  views: {
    front: '/images/钢化玻璃正视图.jpg',
    parallel: '/images/钢化玻璃-平行偏振系统-正视图.jpg',
    crossed: '/images/钢化玻璃-正交偏振系统-正视图.jpg',
  },
}

// 普通玻璃资源
export const ORDINARY_GLASS: PolarizationResource = {
  id: 'ordinary-glass',
  type: 'image',
  title: 'Ordinary Glass',
  titleZh: '普通玻璃',
  description: 'Ordinary glass shows minimal stress patterns under crossed polarizers',
  descriptionZh: '普通玻璃在正交偏振下显示极少的应力图案',
  category: 'stress',
  url: '/images/普通玻璃-正交偏振系统-正视图.jpg',
  thumbnail: '/images/普通玻璃正视图.jpg',
  relatedModules: ['stress-analysis', 'birefringence'],
  metadata: {
    material: 'ordinary glass',
    polarizationSystem: 'crossed',
  },
  views: {
    front: '/images/普通玻璃正视图.jpg',
    parallel: '/images/普通玻璃-平行偏振系统-正视图.jpg',
    crossed: '/images/普通玻璃-正交偏振系统-正视图.jpg',
  },
}

// 普通玻璃顶角加热
export const GLASS_CORNER_HEATING: PolarizationResource = {
  id: 'glass-corner-heating',
  type: 'image',
  title: 'Glass Corner Heated by Lighter',
  titleZh: '打火机烧玻璃顶角',
  description: 'Thermal stress created by heating the corner of ordinary glass with a lighter',
  descriptionZh: '用打火机加热普通玻璃顶角产生的热应力',
  category: 'stress',
  url: '/images/普通玻璃顶角加热-正交偏振系统-正视图.jpg',
  thumbnail: '/images/普通玻璃打火机烧顶角正视图.jpg',
  relatedModules: ['stress-analysis', 'thermal-stress'],
  metadata: {
    material: 'ordinary glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-打火机烧玻璃-正交偏振系统-长时间观察视频.mp4',
  },
  views: {
    front: '/images/普通玻璃打火机烧顶角正视图.jpg',
    parallel: '/images/普通玻璃顶角加热-平行偏振系统-正视图.jpg',
    crossed: '/images/普通玻璃顶角加热-正交偏振系统-正视图.jpg',
  },
}

// 玻璃冷却后
export const GLASS_COOLED: PolarizationResource = {
  id: 'glass-cooled',
  type: 'image',
  title: 'Glass After Long Cooling',
  titleZh: '玻璃长时间冷却后',
  description: 'Residual stress in glass after extended cooling time',
  descriptionZh: '长时间冷却后玻璃中的残余应力',
  category: 'stress',
  url: '/images/普通玻璃顶角加热长时间冷却-正交偏振系统-正视图.jpg',
  relatedModules: ['stress-analysis', 'thermal-stress'],
  metadata: {
    material: 'ordinary glass',
    polarizationSystem: 'crossed',
  },
}

// ===== 干涉/厚度效应资源 =====

// 保鲜膜厚度序列
export const PLASTIC_WRAP_THICKNESS: PolarizationResource = {
  id: 'plastic-wrap-thickness',
  type: 'sequence',
  title: 'Plastic Wrap Layer Thickness',
  titleZh: '保鲜膜重叠层数实验',
  description: 'Observe how interference colors change with increasing layers of plastic wrap',
  descriptionZh: '观察保鲜膜层数增加时干涉色的变化',
  category: 'interference',
  url: '/images/保鲜膜-正交偏振系统-正视图.jpg',
  thumbnail: '/images/保鲜膜正视图.jpg',
  relatedModules: ['birefringence', 'waveplate', 'chromatic-polarization'],
  metadata: {
    layers: 4,
    material: 'plastic wrap',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-保鲜膜3次重叠-正交偏振系统-旋转样品视频.mp4',
  },
  frames: [
    {
      time: 1,
      label: '1 Layer',
      labelZh: '1层',
      url: '/images/保鲜膜-正交偏振系统-正视图.jpg',
    },
    {
      time: 2,
      label: '2 Layers',
      labelZh: '2层',
      url: '/images/保鲜膜重叠1次-正交偏振系统-正视图.jpg',
    },
    {
      time: 3,
      label: '3 Layers',
      labelZh: '3层',
      url: '/images/保鲜膜重叠2次-正交偏振系统-正视图.jpg',
    },
    {
      time: 4,
      label: '4 Layers',
      labelZh: '4层',
      url: '/images/保鲜膜重叠3次-正交偏振系统-正视图.jpg',
    },
    {
      time: 5,
      label: '5 Layers',
      labelZh: '5层',
      url: '/images/保鲜膜重叠4次-正交偏振系统-正视图.jpg',
    },
  ],
}

// 保鲜膜单层
export const PLASTIC_WRAP: PolarizationResource = {
  id: 'plastic-wrap',
  type: 'image',
  title: 'Plastic Wrap',
  titleZh: '保鲜膜',
  description: 'Single layer plastic wrap showing birefringent colors',
  descriptionZh: '单层保鲜膜显示的双折射颜色',
  category: 'interference',
  url: '/images/保鲜膜-正交偏振系统-正视图.jpg',
  thumbnail: '/images/保鲜膜正视图.jpg',
  relatedModules: ['birefringence', 'waveplate'],
  metadata: {
    layers: 1,
    material: 'plastic wrap',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-保鲜膜拉伸-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/保鲜膜正视图.jpg',
    parallel: '/images/保鲜膜-平行偏振系统-正视图.jpg',
    crossed: '/images/保鲜膜-正交偏振系统-正视图.jpg',
  },
}

// 透明胶带资源
export const CLEAR_TAPE: PolarizationResource = {
  id: 'clear-tape',
  type: 'image',
  title: 'Clear Tape',
  titleZh: '透明胶',
  description: 'Clear tape shows stress-induced birefringence',
  descriptionZh: '透明胶显示应力诱导的双折射',
  category: 'interference',
  url: '/images/透明胶-正交偏振系统-正视图.jpg',
  thumbnail: '/images/透明胶正视图.jpg',
  relatedModules: ['birefringence', 'stress-analysis'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-透明胶-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/透明胶正视图.jpg',
    parallel: '/images/透明胶-平行偏振系统-正视图.jpg',
    crossed: '/images/透明胶-正交偏振系统-正视图.jpg',
  },
}

// 透明胶条X形
export const CLEAR_TAPE_X: PolarizationResource = {
  id: 'clear-tape-x',
  type: 'image',
  title: 'Clear Tape X Pattern',
  titleZh: '透明胶条X形',
  description: 'X-shaped clear tape pattern showing overlapping birefringence',
  descriptionZh: 'X形透明胶条图案显示重叠的双折射',
  category: 'interference',
  url: '/images/透明胶条（X）-正交偏振系统-正视图.jpg',
  thumbnail: '/images/透明胶条（X）正视图.jpg',
  relatedModules: ['birefringence', 'interference'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-透明胶条（X）-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/透明胶条（X）正视图.jpg',
    parallel: '/images/透明胶条（X）-平行偏振系统-正视图.jpg',
    crossed: '/images/透明胶条（X）-正交偏振系统-正视图.jpg',
  },
}

// 透明胶条重叠阵列
export const CLEAR_TAPE_ARRAY: PolarizationResource = {
  id: 'clear-tape-array',
  type: 'image',
  title: 'Clear Tape Overlap Array',
  titleZh: '透明胶条重叠阵列',
  description: 'Array of overlapping clear tape strips showing color gradients',
  descriptionZh: '透明胶条重叠阵列显示颜色渐变',
  category: 'interference',
  url: '/images/透明胶条（重叠阵列）-正交偏振系统-正视图.jpg',
  thumbnail: '/images/透明胶重叠阵列正视图.jpg',
  relatedModules: ['birefringence', 'chromatic-polarization'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-透明胶条（重叠阵列）-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/透明胶重叠阵列正视图.jpg',
    parallel: '/images/透明胶条（重叠阵列）-平行偏振系统-正视图.jpg',
    crossed: '/images/透明胶条（重叠阵列）-正交偏振系统-正视图.jpg',
  },
}

// 透明胶卷
export const TAPE_ROLL: PolarizationResource = {
  id: 'tape-roll',
  type: 'image',
  title: 'Tape Roll',
  titleZh: '透明胶卷',
  description: 'Full tape roll showing concentric birefringent rings',
  descriptionZh: '整卷透明胶显示同心的双折射环',
  category: 'interference',
  url: '/images/透明胶卷-正交偏振系统-正视图.jpg',
  thumbnail: '/images/透明胶卷正视图.jpg',
  relatedModules: ['birefringence'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
  },
  views: {
    front: '/images/透明胶卷正视图.jpg',
    parallel: '/images/透明胶卷-平行偏振系统-正视图.jpg',
    crossed: '/images/透明胶卷-正交偏振系统-正视图.jpg',
  },
}

// 保护膜
export const PROTECTIVE_FILM: PolarizationResource = {
  id: 'protective-film',
  type: 'image',
  title: 'Protective Film',
  titleZh: '保护膜',
  description: 'Protective plastic film showing manufacturing stress patterns',
  descriptionZh: '保护膜显示制造过程中产生的应力图案',
  category: 'interference',
  url: '/images/保护膜-正交偏振系统-正视图.jpg',
  thumbnail: '/images/保护膜正视图.jpg',
  relatedModules: ['birefringence', 'stress-analysis'],
  metadata: {
    material: 'protective film',
    polarizationSystem: 'crossed',
  },
  views: {
    front: '/images/保护膜正视图.jpg',
    parallel: '/images/保护膜-平行偏振系统-正视图.jpg',
    crossed: '/images/保护膜-正交偏振系统-正视图.jpg',
  },
}

// ===== 日常物品资源 =====

// 眼镜
export const GLASSES: PolarizationResource = {
  id: 'glasses',
  type: 'image',
  title: 'Eyeglasses',
  titleZh: '眼镜',
  description: 'Eyeglass lenses showing stress patterns from molding process',
  descriptionZh: '眼镜镜片显示模制过程产生的应力图案',
  category: 'daily',
  url: '/images/眼镜-正交偏振系统-正视图.jpg',
  thumbnail: '/images/眼镜正视图.jpg',
  relatedModules: ['stress-analysis', 'daily-polarization'],
  metadata: {
    material: 'polycarbonate',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-眼镜-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/眼镜正视图.jpg',
    parallel: '/images/眼镜-平行偏振系统-正视图.jpg',
    crossed: '/images/眼镜-正交偏振系统-正视图.jpg',
  },
}

// 矿泉水瓶
export const WATER_BOTTLE: PolarizationResource = {
  id: 'water-bottle',
  type: 'image',
  title: 'Mineral Water Bottle',
  titleZh: '矿泉水瓶',
  description: 'PET bottle showing stress patterns from blow molding',
  descriptionZh: 'PET瓶显示吹塑过程产生的应力图案',
  category: 'daily',
  url: '/images/矿泉水瓶-正交偏振系统-正视图.jpg',
  thumbnail: '/images/矿泉水瓶正视图.jpg',
  relatedModules: ['stress-analysis', 'daily-polarization'],
  metadata: {
    material: 'PET',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-矿泉水瓶-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/矿泉水瓶正视图.jpg',
    parallel: '/images/矿泉水瓶-平行偏振系统-正视图.jpg',
    crossed: '/images/矿泉水瓶-正交偏振系统-正视图.jpg',
  },
}

// 白砂糖袋子
export const SUGAR_BAG: PolarizationResource = {
  id: 'sugar-bag',
  type: 'image',
  title: 'Sugar Bag (Plastic)',
  titleZh: '白砂糖袋子',
  description: 'Plastic sugar bag showing stress patterns',
  descriptionZh: '塑料砂糖袋显示应力图案',
  category: 'daily',
  url: '/images/白砂糖袋子-正交偏振系统-正视图（横向）.jpg',
  thumbnail: '/images/白砂糖袋子正视图.jpg',
  relatedModules: ['stress-analysis', 'daily-polarization'],
  metadata: {
    material: 'plastic',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/实验-白砂糖袋子-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/白砂糖袋子正视图.jpg',
    parallel: '/images/白砂糖袋子-平行偏振系统-正视图.jpg',
    crossed: '/images/白砂糖袋子-正交偏振系统-正视图（横向）.jpg',
  },
}

// ===== 偏振系统参考图 =====

export const POLARIZATION_SYSTEM_PARALLEL: PolarizationResource = {
  id: 'system-parallel',
  type: 'image',
  title: 'Parallel Polarizer System',
  titleZh: '平行偏振系统',
  description: 'Reference image of parallel polarizer setup',
  descriptionZh: '平行偏振片系统参考图',
  category: 'daily',
  url: '/images/平行偏振系统正视图.jpg',
  relatedModules: ['polarization-intro', 'malus'],
  metadata: {
    polarizationSystem: 'parallel',
  },
}

export const POLARIZATION_SYSTEM_CROSSED: PolarizationResource = {
  id: 'system-crossed',
  type: 'image',
  title: 'Crossed Polarizer System',
  titleZh: '正交偏振系统',
  description: 'Reference image of crossed polarizer setup',
  descriptionZh: '正交偏振片系统参考图',
  category: 'daily',
  url: '/images/正交偏振系统正视图（横向）.jpg',
  relatedModules: ['polarization-intro', 'malus'],
  metadata: {
    polarizationSystem: 'crossed',
  },
}

// ===== All Resources Export =====
export const POLARIZATION_RESOURCES: PolarizationResource[] = [
  // Stress Analysis
  GLASS_HEATING_SEQUENCE,
  GLASS_COMPARISON,
  TEMPERED_GLASS,
  ORDINARY_GLASS,
  GLASS_CORNER_HEATING,
  GLASS_COOLED,
  // Interference/Thickness
  PLASTIC_WRAP_THICKNESS,
  PLASTIC_WRAP,
  CLEAR_TAPE,
  CLEAR_TAPE_X,
  CLEAR_TAPE_ARRAY,
  TAPE_ROLL,
  PROTECTIVE_FILM,
  // Daily Objects
  GLASSES,
  WATER_BOTTLE,
  SUGAR_BAG,
  // System References
  POLARIZATION_SYSTEM_PARALLEL,
  POLARIZATION_SYSTEM_CROSSED,
]

// ===== Helper Functions =====

/** Get resources by category */
export function getResourcesByCategory(category: ResourceCategory): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.category === category)
}

/** Get resources by type */
export function getResourcesByType(type: ResourceType): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.type === type)
}

/** Get resources by related module */
export function getResourcesByModule(moduleId: string): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.relatedModules.includes(moduleId))
}

/** Get resource by ID */
export function getResourceById(id: string): PolarizationResource | undefined {
  return POLARIZATION_RESOURCES.find(r => r.id === id)
}

/** Get all sequence resources */
export function getSequenceResources(): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.type === 'sequence')
}

/** Get resources with videos */
export function getResourcesWithVideos(): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.metadata.hasVideo)
}

// ===== Statistics =====
export const RESOURCE_STATS = {
  totalResources: POLARIZATION_RESOURCES.length,
  byCategory: {
    stress: getResourcesByCategory('stress').length,
    interference: getResourcesByCategory('interference').length,
    art: getResourcesByCategory('art').length,
    daily: getResourcesByCategory('daily').length,
  },
  byType: {
    image: getResourcesByType('image').length,
    video: getResourcesByType('video').length,
    sequence: getResourcesByType('sequence').length,
  },
  withVideos: getResourcesWithVideos().length,
}
