/**
 * Resource Gallery Data (资源图库数据)
 * 偏振实验图片和视频资源的结构化数据
 *
 * 资源分类:
 * - stress: 应力分析（玻璃、塑料制品的应力双折射）
 * - interference: 干涉/厚度效应（保鲜膜、透明胶的色彩变化）
 * - art: 偏振艺术（文创作品）
 * - daily: 日常物品（眼镜、矿泉水瓶等）
 * - birefringence: 双折射实验（冰洲石/方解石）
 * - brewster: 布儒斯特角实验
 * - scattering: 散射实验（米氏散射、瑞利散射）
 * - rotation: 旋光性实验
 *
 * 类型:
 * - image: 单张图片
 * - video: 视频
 * - sequence: 图片序列（如加热冷却过程）
 */

// ===== Types =====
export type ResourceCategory = 'stress' | 'interference' | 'art' | 'daily' | 'birefringence' | 'brewster' | 'scattering' | 'rotation'
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

export interface ViewPairs {
  front?: string
  parallel?: string
  crossed?: string
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
  // 多视图属性 (平行/正交偏振系统成对图片)
  views?: ViewPairs
  // 是否为旋光性物质（如白砂糖）
  isChiral?: boolean
  // 视频注解（用于动态应变查看器）
  videoAnnotations?: VideoAnnotation[]
}

// 视频时间点注解
export interface VideoAnnotation {
  time: number // 秒
  label: string
  labelZh: string
  description: string
  descriptionZh: string
  type: 'info' | 'important' | 'observation'
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
  url: '/images/chromatic-polarization/普通玻璃加热冷却-0秒-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/普通玻璃加热冷却-0秒-正交偏振系统-正视图.webp',
  relatedModules: ['birefringence', 'stress-analysis', 'anisotropy'],
  metadata: {
    timePoints: [0, 5, 10, 15, 20, 25, 30],
    material: 'ordinary glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-打火机烧玻璃-正交偏振系统-长时间观察视频.mp4',
  },
  frames: [
    { time: 0, label: 'Just Heated', labelZh: '刚加热完', url: '/images/chromatic-polarization/普通玻璃加热冷却-0秒-正交偏振系统-正视图.webp' },
    { time: 5, label: '5 seconds', labelZh: '5秒', url: '/images/chromatic-polarization/普通玻璃加热冷却-5秒-正交偏振系统-正视图.webp' },
    { time: 10, label: '10 seconds', labelZh: '10秒', url: '/images/chromatic-polarization/普通玻璃加热冷却-10秒-正交偏振系统-正视图.webp' },
    { time: 15, label: '15 seconds', labelZh: '15秒', url: '/images/chromatic-polarization/普通玻璃加热冷却-15秒-正交偏振系统-正视图.webp' },
    { time: 20, label: '20 seconds', labelZh: '20秒', url: '/images/chromatic-polarization/普通玻璃加热冷却-20秒-正交偏振系统-正视图.webp' },
    { time: 25, label: '25 seconds', labelZh: '25秒', url: '/images/chromatic-polarization/普通玻璃加热冷却-25秒-正交偏振系统-正视图.webp' },
    { time: 30, label: '30 seconds', labelZh: '30秒', url: '/images/chromatic-polarization/普通玻璃加热冷却-30秒-正交偏振系统-正视图.webp' },
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
  url: '/images/chromatic-polarization/玻璃对比-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/玻璃对比正视图.webp',
  relatedModules: ['stress-analysis', 'birefringence'],
  metadata: {
    material: 'glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-偏振片看钢化玻璃-朝西.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/玻璃对比正视图.webp',
    parallel: '/images/chromatic-polarization/玻璃对比-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/玻璃对比-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/钢化玻璃-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/钢化玻璃正视图.webp',
  relatedModules: ['stress-analysis', 'birefringence'],
  metadata: {
    material: 'tempered glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-偏振片看钢化玻璃-朝西.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/钢化玻璃正视图.webp',
    parallel: '/images/chromatic-polarization/钢化玻璃-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/钢化玻璃-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/普通玻璃-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/普通玻璃正视图.webp',
  relatedModules: ['stress-analysis', 'birefringence'],
  metadata: {
    material: 'ordinary glass',
    polarizationSystem: 'crossed',
  },
  views: {
    front: '/images/chromatic-polarization/普通玻璃正视图.webp',
    parallel: '/images/chromatic-polarization/普通玻璃-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/普通玻璃-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/普通玻璃顶角加热-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/普通玻璃打火机烧顶角正视图.webp',
  relatedModules: ['stress-analysis', 'thermal-stress'],
  metadata: {
    material: 'ordinary glass',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-打火机烧玻璃-正交偏振系统-长时间观察视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/普通玻璃打火机烧顶角正视图.webp',
    parallel: '/images/chromatic-polarization/普通玻璃顶角加热-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/普通玻璃顶角加热-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/普通玻璃顶角加热长时间冷却-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/保鲜膜-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/保鲜膜正视图.webp',
  relatedModules: ['birefringence', 'waveplate', 'chromatic-polarization'],
  metadata: {
    layers: 4,
    material: 'plastic wrap',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-保鲜膜3次重叠-正交偏振系统-旋转样品视频.mp4',
  },
  frames: [
    {
      time: 1,
      label: '1 Layer',
      labelZh: '1层',
      url: '/images/chromatic-polarization/保鲜膜-正交偏振系统-正视图.webp',
    },
    {
      time: 2,
      label: '2 Layers',
      labelZh: '2层',
      url: '/images/chromatic-polarization/保鲜膜重叠1次-正交偏振系统-正视图.webp',
    },
    {
      time: 3,
      label: '3 Layers',
      labelZh: '3层',
      url: '/images/chromatic-polarization/保鲜膜重叠2次-正交偏振系统-正视图.webp',
    },
    {
      time: 4,
      label: '4 Layers',
      labelZh: '4层',
      url: '/images/chromatic-polarization/保鲜膜重叠3次-正交偏振系统-正视图.webp',
    },
    {
      time: 5,
      label: '5 Layers',
      labelZh: '5层',
      url: '/images/chromatic-polarization/保鲜膜重叠4次-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/保鲜膜-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/保鲜膜正视图.webp',
  relatedModules: ['birefringence', 'waveplate'],
  metadata: {
    layers: 1,
    material: 'plastic wrap',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-保鲜膜拉伸-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/保鲜膜正视图.webp',
    parallel: '/images/chromatic-polarization/保鲜膜-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/保鲜膜-正交偏振系统-正视图.webp',
  },
  videoAnnotations: [
    {
      time: 0,
      label: 'Initial State',
      labelZh: '初始状态',
      description: 'Observe the uniform color distribution in unstretched plastic wrap',
      descriptionZh: '观察未拉伸保鲜膜的均匀颜色分布',
      type: 'info',
    },
    {
      time: 3,
      label: 'Optical Axis',
      labelZh: '光轴方向',
      description: 'Notice how stretching creates a preferred optical axis direction',
      descriptionZh: '注意拉伸如何产生光轴（Optical Axis）的优先方向',
      type: 'important',
    },
    {
      time: 6,
      label: 'Color Change',
      labelZh: '颜色变化',
      description: 'Thickness changes from stretching alter interference colors',
      descriptionZh: '厚度变化引起的颜色级数改变',
      type: 'observation',
    },
    {
      time: 10,
      label: 'Rotation Effect',
      labelZh: '旋转效果',
      description: 'Rotating the sample shows how colors depend on angle relative to polarizers',
      descriptionZh: '旋转样品显示颜色如何依赖于相对于偏振片的角度',
      type: 'info',
    },
  ],
}

// 保鲜膜拉伸实验视频
export const PLASTIC_WRAP_STRETCHING: PolarizationResource = {
  id: 'plastic-wrap-stretching',
  type: 'video',
  title: 'Plastic Wrap Stretching Experiment',
  titleZh: '保鲜膜拉伸实验',
  description: 'Dynamic demonstration of how stretching affects birefringence in plastic wrap',
  descriptionZh: '动态演示拉伸如何影响保鲜膜的双折射',
  category: 'interference',
  url: '/videos/chromatic-polarization/实验-保鲜膜拉伸-正交偏振系统-旋转样品视频.mp4',
  thumbnail: '/images/chromatic-polarization/保鲜膜-正交偏振系统-正视图.webp',
  relatedModules: ['birefringence', 'waveplate', 'stress-optics'],
  metadata: {
    material: 'plastic wrap',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-保鲜膜拉伸-正交偏振系统-旋转样品视频.mp4',
  },
  videoAnnotations: [
    {
      time: 0,
      label: 'Initial State',
      labelZh: '初始状态',
      description: 'Observe the uniform color distribution in unstretched plastic wrap',
      descriptionZh: '观察未拉伸保鲜膜的均匀颜色分布',
      type: 'info',
    },
    {
      time: 3,
      label: 'Optical Axis Formation',
      labelZh: '光轴形成',
      description: 'Stretching creates molecular alignment and optical axis direction',
      descriptionZh: '拉伸产生分子排列和光轴（Optical Axis）方向',
      type: 'important',
    },
    {
      time: 6,
      label: 'Retardation Change',
      labelZh: '延迟量变化',
      description: 'Thickness reduction and stress increase change the retardation',
      descriptionZh: '厚度减小和应力增加改变延迟量，引起颜色级数改变',
      type: 'observation',
    },
  ],
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
  url: '/images/chromatic-polarization/透明胶-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/透明胶正视图.webp',
  relatedModules: ['birefringence', 'stress-analysis'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-透明胶-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/透明胶正视图.webp',
    parallel: '/images/chromatic-polarization/透明胶-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/透明胶-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/透明胶条（X）-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/透明胶条（X）正视图.webp',
  relatedModules: ['birefringence', 'interference'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-透明胶条（X）-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/透明胶条（X）正视图.webp',
    parallel: '/images/chromatic-polarization/透明胶条（X）-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/透明胶条（X）-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/透明胶条（重叠阵列）-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/透明胶重叠阵列正视图.webp',
  relatedModules: ['birefringence', 'chromatic-polarization'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-透明胶条（重叠阵列）-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/透明胶重叠阵列正视图.webp',
    parallel: '/images/chromatic-polarization/透明胶条（重叠阵列）-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/透明胶条（重叠阵列）-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/透明胶卷-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/透明胶卷正视图.webp',
  relatedModules: ['birefringence'],
  metadata: {
    material: 'clear tape',
    polarizationSystem: 'crossed',
  },
  views: {
    front: '/images/chromatic-polarization/透明胶卷正视图.webp',
    parallel: '/images/chromatic-polarization/透明胶卷-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/透明胶卷-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/保护膜-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/保护膜正视图.webp',
  relatedModules: ['birefringence', 'stress-analysis'],
  metadata: {
    material: 'protective film',
    polarizationSystem: 'crossed',
  },
  views: {
    front: '/images/chromatic-polarization/保护膜正视图.webp',
    parallel: '/images/chromatic-polarization/保护膜-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/保护膜-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/眼镜-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/眼镜正视图.webp',
  relatedModules: ['stress-analysis', 'daily-polarization'],
  metadata: {
    material: 'polycarbonate',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-眼镜-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/眼镜正视图.webp',
    parallel: '/images/chromatic-polarization/眼镜-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/眼镜-正交偏振系统-正视图.webp',
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
  url: '/images/chromatic-polarization/矿泉水瓶-正交偏振系统-正视图.webp',
  thumbnail: '/images/chromatic-polarization/矿泉水瓶正视图.webp',
  relatedModules: ['stress-analysis', 'daily-polarization'],
  metadata: {
    material: 'PET',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-矿泉水瓶-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/矿泉水瓶正视图.webp',
    parallel: '/images/chromatic-polarization/矿泉水瓶-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/矿泉水瓶-正交偏振系统-正视图.webp',
  },
}

// 白砂糖袋子 (旋光性物质)
export const SUGAR_BAG: PolarizationResource = {
  id: 'sugar-bag',
  type: 'image',
  title: 'Sugar Bag (Optical Rotation)',
  titleZh: '白砂糖袋子（旋光性）',
  description: 'Sugar is optically active - it rotates the polarization plane of light. The plastic bag also shows stress patterns.',
  descriptionZh: '白砂糖具有旋光性 - 它会旋转光的偏振面。塑料袋同时显示应力图案。',
  category: 'daily',
  url: '/images/chromatic-polarization/白砂糖袋子-正交偏振系统-正视图（横向）.webp',
  thumbnail: '/images/chromatic-polarization/白砂糖袋子正视图.webp',
  relatedModules: ['stress-analysis', 'daily-polarization', 'optical-rotation', 'food-quality'],
  metadata: {
    material: 'sugar + plastic',
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/chromatic-polarization/实验-白砂糖袋子-正交偏振系统-旋转样品视频.mp4',
  },
  views: {
    front: '/images/chromatic-polarization/白砂糖袋子正视图.webp',
    parallel: '/images/chromatic-polarization/白砂糖袋子-平行偏振系统-正视图.webp',
    crossed: '/images/chromatic-polarization/白砂糖袋子-正交偏振系统-正视图（横向）.webp',
  },
  isChiral: true, // 白砂糖是旋光性物质
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
  url: '/images/chromatic-polarization/平行偏振系统正视图.webp',
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
  url: '/images/chromatic-polarization/正交偏振系统正视图（横向）.webp',
  relatedModules: ['polarization-intro', 'malus'],
  metadata: {
    polarizationSystem: 'crossed',
  },
}

// ===== 布儒斯特角实验资源 (Brewster's Angle Experiments) =====

export const BREWSTER_APPARATUS: PolarizationResource = {
  id: 'brewster-apparatus',
  type: 'image',
  title: 'Brewster Angle Reflection Apparatus',
  titleZh: '布儒斯特角反射装置',
  description: 'Front view of the experimental apparatus for demonstrating Brewster\'s angle polarization',
  descriptionZh: '演示布儒斯特角偏振的实验装置正视图',
  category: 'brewster',
  url: '/images/brewster/反射装置正视图.webp',
  thumbnail: '/images/brewster/反射装置正视图.webp',
  relatedModules: ['brewster', 'fresnel', 'polarization-intro'],
  metadata: {
    polarizationSystem: 'front',
  },
}

export const BREWSTER_HORIZONTAL_DARK_SPOT: PolarizationResource = {
  id: 'brewster-horizontal-dark-spot',
  type: 'image',
  title: 'Brewster Angle - Horizontal Polarization Dark Spot',
  titleZh: '布儒斯特角 - 横向绿色光束暗点现象',
  description: 'Demonstration of the dark spot phenomenon at Brewster\'s angle with horizontally polarized green laser beam',
  descriptionZh: '使用横向偏振绿色激光演示布儒斯特角下的暗点现象',
  category: 'brewster',
  url: '/images/brewster/横向绿色光束暗点现象.webp',
  thumbnail: '/images/brewster/横向绿色光束暗点现象.webp',
  relatedModules: ['brewster', 'fresnel', 'polarization-intro'],
  metadata: {
    polarizationSystem: 'parallel',
  },
}

export const BREWSTER_VERTICAL_DARK_SPOT: PolarizationResource = {
  id: 'brewster-vertical-dark-spot',
  type: 'image',
  title: 'Brewster Angle - Vertical Polarization Dark Spot',
  titleZh: '布儒斯特角 - 纵向绿色光束暗点现象',
  description: 'Demonstration of the dark spot phenomenon at Brewster\'s angle with vertically polarized green laser beam',
  descriptionZh: '使用纵向偏振绿色激光演示布儒斯特角下的暗点现象',
  category: 'brewster',
  url: '/images/brewster/纵向绿色光束暗点现象.webp',
  thumbnail: '/images/brewster/纵向绿色光束暗点现象.webp',
  relatedModules: ['brewster', 'fresnel', 'polarization-intro'],
  metadata: {
    polarizationSystem: 'crossed',
  },
}

// ===== 布儒斯特角详细实验装置系列 (Detailed Brewster Apparatus Series) =====

export const BREWSTER_SETUP_DIAGRAM: PolarizationResource = {
  id: 'brewster-setup-diagram',
  type: 'image',
  title: 'Brewster Experiment Setup Diagram',
  titleZh: '布儒斯特实验装置示意图',
  description: 'Schematic diagram of the complete Brewster angle experimental setup',
  descriptionZh: '布儒斯特角实验装置完整示意图',
  category: 'brewster',
  url: '/images/brewster/实验装置示意图.webp',
  thumbnail: '/images/brewster/实验装置示意图.webp',
  relatedModules: ['brewster', 'fresnel', 'polarization-intro'],
  metadata: {
    polarizationSystem: 'front',
  },
}

// 无偏振片系列
export const BREWSTER_NO_POLARIZER: PolarizationResource = {
  id: 'brewster-no-polarizer',
  type: 'image',
  title: 'Brewster Setup - No Polarizer',
  titleZh: '布儒斯特装置俯视图（无偏振片）',
  description: 'Top view of Brewster apparatus without polarizers',
  descriptionZh: '无偏振片情况下的布儒斯特实验装置俯视图',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（无偏振片）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（无偏振片）.webp',
  relatedModules: ['brewster', 'fresnel'],
  metadata: {
    polarizationSystem: 'none',
  },
}

export const BREWSTER_NO_POLARIZER_VERTICAL_LASER: PolarizationResource = {
  id: 'brewster-no-polarizer-vertical-laser',
  type: 'image',
  title: 'Brewster - No Polarizer with Vertical Green Laser',
  titleZh: '无偏振片-纵向绿色激光',
  description: 'Brewster setup without polarizer, green laser beam in vertical orientation',
  descriptionZh: '无偏振片情况下，纵向绿色激光照射的布儒斯特实验',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（无偏振片）-开启绿色激光（纵向光束）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（无偏振片）-开启绿色激光（纵向光束）.webp',
  relatedModules: ['brewster', 'fresnel'],
  metadata: {
    polarizationSystem: 'none',
    hasVideo: true,
    videoUrl: '/videos/brewster/实验装置俯视图（无偏振片）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  },
}

export const BREWSTER_NO_POLARIZER_VIDEO: PolarizationResource = {
  id: 'brewster-no-polarizer-video',
  type: 'video',
  title: 'Brewster - Rotating Glass Plate (No Polarizer)',
  titleZh: '无偏振片-旋转玻璃片视频',
  description: 'Video showing glass plate rotation in Brewster apparatus without polarizer, demonstrating reflection changes',
  descriptionZh: '无偏振片条件下旋转玻璃片的视频，展示反射光强度变化',
  category: 'brewster',
  url: '/videos/brewster/实验装置俯视图（无偏振片）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  thumbnail: '/images/brewster/实验装置俯视图（无偏振片）-开启绿色激光（纵向光束）.webp',
  relatedModules: ['brewster', 'fresnel', 'polarization-intro'],
  metadata: {
    polarizationSystem: 'none',
    hasVideo: true,
    videoUrl: '/videos/brewster/实验装置俯视图（无偏振片）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  },
}

// 偏振片平行方向系列
export const BREWSTER_PARALLEL_POLARIZER: PolarizationResource = {
  id: 'brewster-parallel-polarizer',
  type: 'image',
  title: 'Brewster Setup - Parallel Polarizers',
  titleZh: '布儒斯特装置俯视图（偏振片平行方向）',
  description: 'Top view of Brewster apparatus with parallel polarizers',
  descriptionZh: '偏振片平行方向布置的布儒斯特实验装置俯视图',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（偏振片平行方向）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片平行方向）.webp',
  relatedModules: ['brewster', 'fresnel', 'malus'],
  metadata: {
    polarizationSystem: 'parallel',
  },
}

export const BREWSTER_PARALLEL_VERTICAL_LASER: PolarizationResource = {
  id: 'brewster-parallel-vertical-laser',
  type: 'image',
  title: 'Brewster - Parallel Polarizers with Vertical Laser',
  titleZh: '偏振片平行-纵向绿色激光',
  description: 'Parallel polarizers with vertical green laser beam showing maximum transmission',
  descriptionZh: '偏振片平行布置，纵向绿色激光，显示最大透射',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（偏振片平行方向）-开启绿色激光（纵向光束）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片平行方向）-开启绿色激光（纵向光束）.webp',
  relatedModules: ['brewster', 'fresnel', 'malus'],
  metadata: {
    polarizationSystem: 'parallel',
  },
}

export const BREWSTER_PARALLEL_HORIZONTAL_LASER: PolarizationResource = {
  id: 'brewster-parallel-horizontal-laser',
  type: 'image',
  title: 'Brewster - Parallel Polarizers with Horizontal Laser',
  titleZh: '偏振片平行-横向绿色激光',
  description: 'Parallel polarizers with horizontal green laser beam',
  descriptionZh: '偏振片平行布置，横向绿色激光照射',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（偏振片平行方向）-开启绿色激光（横向光束）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片平行方向）-开启绿色激光（横向光束）.webp',
  relatedModules: ['brewster', 'fresnel', 'malus'],
  metadata: {
    polarizationSystem: 'parallel',
  },
}

// 偏振片垂直方向系列
export const BREWSTER_PERPENDICULAR_POLARIZER: PolarizationResource = {
  id: 'brewster-perpendicular-polarizer',
  type: 'image',
  title: 'Brewster Setup - Crossed Polarizers',
  titleZh: '布儒斯特装置俯视图（偏振片垂直方向）',
  description: 'Top view of Brewster apparatus with crossed (perpendicular) polarizers',
  descriptionZh: '偏振片垂直交叉布置的布儒斯特实验装置俯视图',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（偏振片垂直方向）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片垂直方向）.webp',
  relatedModules: ['brewster', 'fresnel', 'malus'],
  metadata: {
    polarizationSystem: 'crossed',
  },
}

export const BREWSTER_PERPENDICULAR_VERTICAL_LASER: PolarizationResource = {
  id: 'brewster-perpendicular-vertical-laser',
  type: 'image',
  title: 'Brewster - Crossed Polarizers with Vertical Laser',
  titleZh: '偏振片垂直-纵向绿色激光',
  description: 'Crossed polarizers with vertical green laser beam showing polarization effects at Brewster angle',
  descriptionZh: '偏振片垂直交叉，纵向绿色激光，展示布儒斯特角偏振效应',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（纵向光束）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（纵向光束）.webp',
  relatedModules: ['brewster', 'fresnel', 'malus'],
  metadata: {
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  },
}

export const BREWSTER_PERPENDICULAR_VERTICAL_LASER_VIDEO: PolarizationResource = {
  id: 'brewster-perpendicular-vertical-laser-video',
  type: 'video',
  title: 'Brewster - Rotating Glass with Crossed Polarizers',
  titleZh: '偏振片垂直-旋转玻璃片视频',
  description: 'Video showing glass plate rotation with crossed polarizers, demonstrating Brewster angle extinction',
  descriptionZh: '正交偏振片下旋转玻璃片视频，展示布儒斯特角消光现象',
  category: 'brewster',
  url: '/videos/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（纵向光束）.webp',
  relatedModules: ['brewster', 'fresnel', 'malus'],
  metadata: {
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  },
}

export const BREWSTER_PERPENDICULAR_HORIZONTAL_LASER: PolarizationResource = {
  id: 'brewster-perpendicular-horizontal-laser',
  type: 'image',
  title: 'Brewster - Crossed Polarizers with Horizontal Laser',
  titleZh: '偏振片垂直-横向绿色激光',
  description: 'Crossed polarizers with horizontal green laser beam',
  descriptionZh: '偏振片垂直交叉，横向绿色激光照射',
  category: 'brewster',
  url: '/images/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（横向光束）.webp',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（横向光束）.webp',
  relatedModules: ['brewster', 'fresnel', 'malus'],
  metadata: {
    polarizationSystem: 'crossed',
  },
}

// 偏振片纵向方向视频
export const BREWSTER_VERTICAL_DIRECTION_VIDEO: PolarizationResource = {
  id: 'brewster-vertical-direction-video',
  type: 'video',
  title: 'Brewster - Vertical Polarizer Rotation',
  titleZh: '偏振片纵向-旋转玻璃片视频',
  description: 'Video showing glass plate rotation with polarizer in vertical direction',
  descriptionZh: '偏振片纵向方向下旋转玻璃片的视频',
  category: 'brewster',
  url: '/videos/brewster/实验装置俯视图（偏振片纵向方向）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  thumbnail: '/images/brewster/实验装置俯视图（偏振片垂直方向）-开启绿色激光（纵向光束）.webp',
  relatedModules: ['brewster', 'fresnel', 'polarization-intro'],
  metadata: {
    polarizationSystem: 'crossed',
    hasVideo: true,
    videoUrl: '/videos/brewster/实验装置俯视图（偏振片纵向方向）-开启绿色激光（纵向光束）-旋转玻璃片视频.mp4',
  },
}

// ===== 冰洲石双折射实验资源 (Calcite Birefringence Experiments) =====

export const CALCITE_DOUBLE_REFRACTION: PolarizationResource = {
  id: 'calcite-double-refraction',
  type: 'image',
  title: 'Calcite Double Refraction',
  titleZh: '冰洲石双折射成像',
  description: 'Classic demonstration of double refraction in Iceland spar (calcite) crystal',
  descriptionZh: '冰洲石（方解石）晶体双折射成像的经典演示',
  category: 'birefringence',
  url: '/images/calcite/双折射成像.webp',
  thumbnail: '/images/calcite/双折射成像.webp',
  relatedModules: ['birefringence', 'polarization-intro', 'waveplate'],
  metadata: {
    material: 'calcite',
    polarizationSystem: 'none',
  },
}

export const CALCITE_POLARIZER_SEQUENCE: PolarizationResource = {
  id: 'calcite-polarizer-sequence',
  type: 'sequence',
  title: 'Calcite through Rotating Polarizer',
  titleZh: '偏振片不同角度观察冰洲石',
  description: 'Sequence showing calcite double image as viewed through polarizers at different angles (0°, 70°, 90°, 135°)',
  descriptionZh: '通过不同角度偏振片观察冰洲石双像的变化序列（0°、70°、90°、135°）',
  category: 'birefringence',
  url: '/images/calcite/0度偏振片看冰洲石的像.webp',
  thumbnail: '/images/calcite/0度偏振片看冰洲石的像.webp',
  relatedModules: ['birefringence', 'malus', 'polarization-intro'],
  metadata: {
    material: 'calcite',
    polarizationSystem: 'crossed',
  },
  frames: [
    { time: 0, label: '0° Polarizer', labelZh: '0度偏振片', url: '/images/calcite/0度偏振片看冰洲石的像.webp' },
    { time: 1, label: '70° Polarizer', labelZh: '70度偏振片', url: '/images/calcite/70度偏振片看冰洲石的像.webp' },
    { time: 2, label: '90° Polarizer', labelZh: '90度偏振片', url: '/images/calcite/90度偏振片看冰洲石的像.webp' },
    { time: 3, label: '135° Polarizer', labelZh: '135度偏振片', url: '/images/calcite/135度偏振片看冰洲石的像.webp' },
  ],
}

export const CALCITE_STACKED: PolarizationResource = {
  id: 'calcite-stacked',
  type: 'image',
  title: 'Stacked Calcite Crystals (4 Images)',
  titleZh: '堆叠冰洲石形成四个像',
  description: 'Two calcite crystals stacked in specific orientation create four separate images',
  descriptionZh: '两块冰洲石以特定方向堆叠，产生四个分离的像',
  category: 'birefringence',
  url: '/images/calcite/堆叠两个冰洲石特定情况成四个像.webp',
  thumbnail: '/images/calcite/堆叠两个冰洲石特定情况成四个像.webp',
  relatedModules: ['birefringence', 'waveplate'],
  metadata: {
    material: 'calcite',
    polarizationSystem: 'none',
  },
}

export const CALCITE_LASER_RED_BEAMS: PolarizationResource = {
  id: 'calcite-laser-red-beams',
  type: 'image',
  title: 'Calcite with Green Laser - Red Beam Phenomenon',
  titleZh: '冰洲石绿色激光产生红色光束',
  description: 'Green laser passing through calcite produces red-colored split beams due to frequency effects',
  descriptionZh: '绿色激光穿过冰洲石后产生红色分裂光束现象',
  category: 'birefringence',
  url: '/images/calcite/绿色激光入射所成红色四条光束像.webp',
  thumbnail: '/images/calcite/绿色激光入射所成红色四条光束像.webp',
  relatedModules: ['birefringence', 'waveplate'],
  metadata: {
    material: 'calcite',
    polarizationSystem: 'none',
  },
}

export const CALCITE_LASER_RED_BEAMS_2: PolarizationResource = {
  id: 'calcite-laser-red-beams-2',
  type: 'image',
  title: 'Calcite with Green Laser - Red Beam (Alternate View)',
  titleZh: '冰洲石绿色激光红色光束（另一视角）',
  description: 'Alternative view of green laser through calcite producing red beam patterns',
  descriptionZh: '绿色激光穿过冰洲石产生红色光束的另一视角',
  category: 'birefringence',
  url: '/images/calcite/绿色激光入射所成红色四条光束像（1）.webp',
  thumbnail: '/images/calcite/绿色激光入射所成红色四条光束像（1）.webp',
  relatedModules: ['birefringence', 'waveplate'],
  metadata: {
    material: 'calcite',
    polarizationSystem: 'none',
  },
}

// ===== 旋光性实验资源 (Optical Rotation Experiments) =====

export const OPTICAL_ROTATION_SETUP: PolarizationResource = {
  id: 'optical-rotation-setup',
  type: 'image',
  title: 'Optical Rotation Experimental Setup',
  titleZh: '旋光性实验装置示意图',
  description: 'Experimental apparatus for demonstrating optical rotation with room lights on',
  descriptionZh: '旋光性实验装置示意图（室内照明下）',
  category: 'rotation',
  url: '/images/optical-rotation/室内照明、未开启光源时的装置示意图.webp',
  thumbnail: '/images/optical-rotation/室内照明、未开启光源时的装置示意图.webp',
  relatedModules: ['optical-rotation', 'chromatic', 'polarization-intro'],
  metadata: {
    polarizationSystem: 'front',
  },
}

export const OPTICAL_ROTATION_WHITE_LIGHT: PolarizationResource = {
  id: 'optical-rotation-white-light',
  type: 'image',
  title: 'Optical Rotation with White Light',
  titleZh: '白光光源旋光实验',
  description: 'Optical rotation experiment using white light source through polarizer',
  descriptionZh: '使用白光光源并通过偏振片的旋光实验',
  category: 'rotation',
  url: '/images/optical-rotation/关闭室内照明、开启白光光源并使光经过偏振片后的情形.webp',
  thumbnail: '/images/optical-rotation/关闭室内照明、开启白光光源并使光经过偏振片后的情形.webp',
  relatedModules: ['optical-rotation', 'chromatic'],
  metadata: {
    polarizationSystem: 'crossed',
  },
  isChiral: true,
}

export const OPTICAL_ROTATION_LASER_FRONT: PolarizationResource = {
  id: 'optical-rotation-laser-front',
  type: 'image',
  title: 'Optical Rotation with Lasers - Front View',
  titleZh: '激光旋光实验（正视图）',
  description: 'Front view of optical rotation using green and red lasers through polarizer',
  descriptionZh: '使用绿色和红色激光通过偏振片的旋光实验正视图',
  category: 'rotation',
  url: '/images/optical-rotation/关闭室内照明、开启绿色激光和红色激光并使光经过偏振片后的正视图.webp',
  thumbnail: '/images/optical-rotation/关闭室内照明、开启绿色激光和红色激光并使光经过偏振片后的正视图.webp',
  relatedModules: ['optical-rotation', 'chromatic'],
  metadata: {
    polarizationSystem: 'crossed',
  },
  isChiral: true,
}

export const OPTICAL_ROTATION_LASER_TOP: PolarizationResource = {
  id: 'optical-rotation-laser-top',
  type: 'image',
  title: 'Optical Rotation with Lasers - Top View',
  titleZh: '激光旋光实验（俯视图）',
  description: 'Top view of optical rotation using green and red lasers through polarizer',
  descriptionZh: '使用绿色和红色激光通过偏振片的旋光实验俯视图',
  category: 'rotation',
  url: '/images/optical-rotation/关闭室内照明、开启绿色激光和红色激光并使光经过偏振片后的俯视图.webp',
  thumbnail: '/images/optical-rotation/关闭室内照明、开启绿色激光和红色激光并使光经过偏振片后的俯视图.webp',
  relatedModules: ['optical-rotation', 'chromatic'],
  metadata: {
    polarizationSystem: 'crossed',
  },
  isChiral: true,
}

export const OPTICAL_ROTATION_NO_POLARIZER: PolarizationResource = {
  id: 'optical-rotation-no-polarizer',
  type: 'image',
  title: 'Optical Rotation Setup - Without Polarizer',
  titleZh: '旋光实验（相机前无偏振片）',
  description: 'Top view of optical rotation experiment without polarizer in front of camera',
  descriptionZh: '旋光实验俯视图（相机前无偏振片）',
  category: 'rotation',
  url: '/images/optical-rotation/旋光实验相机前无偏振片顶角俯视图.webp',
  thumbnail: '/images/optical-rotation/旋光实验相机前无偏振片顶角俯视图.webp',
  relatedModules: ['optical-rotation', 'chromatic'],
  metadata: {
    polarizationSystem: 'none',
  },
  isChiral: true,
}

export const OPTICAL_ROTATION_WITH_POLARIZER: PolarizationResource = {
  id: 'optical-rotation-with-polarizer',
  type: 'image',
  title: 'Optical Rotation Setup - With Polarizer',
  titleZh: '旋光实验（相机前有偏振片）',
  description: 'Top view of optical rotation experiment with polarizer in front of camera',
  descriptionZh: '旋光实验俯视图（相机前有偏振片）',
  category: 'rotation',
  url: '/images/optical-rotation/旋光实验相机前有偏振片顶角俯视图.webp',
  thumbnail: '/images/optical-rotation/旋光实验相机前有偏振片顶角俯视图.webp',
  relatedModules: ['optical-rotation', 'chromatic'],
  metadata: {
    polarizationSystem: 'crossed',
  },
  isChiral: true,
}

// ===== 散射实验资源 (Scattering Experiments) =====

export const SCATTERING_MIE_CONCENTRATION: PolarizationResource = {
  id: 'scattering-mie-concentration',
  type: 'image',
  title: 'Mie Scattering - Concentration Comparison',
  titleZh: '米氏散射 - 不同浓度对比',
  description: 'Transmitted light through 80nm microsphere suspensions at different concentrations (decreasing from left to right)',
  descriptionZh: '80nm微球悬浊液在不同浓度下的透射光实物图（由左至右浓度递减）',
  category: 'scattering',
  url: '/images/scattering/不同浓度 80 nm 微球悬浊液透射光实物图（由左至右浓度递减）.webp',
  thumbnail: '/images/scattering/不同浓度 80 nm 微球悬浊液透射光实物图（由左至右浓度递减）.webp',
  relatedModules: ['mie-scattering', 'rayleigh', 'monte-carlo-scattering'],
  metadata: {
    polarizationSystem: 'none',
  },
}

export const SCATTERING_PARTICLE_SIZE: PolarizationResource = {
  id: 'scattering-particle-size',
  type: 'image',
  title: 'Scattering by Different Particle Sizes',
  titleZh: '不同粒径散射效果对比',
  description: 'Comparison of scattering effects by particles of different sizes: 80nm, 300nm, and 3μm microspheres',
  descriptionZh: '不同粒径微球（80nm、300nm、3μm）的散射效果对比',
  category: 'scattering',
  url: '/images/scattering/分别为80nm-300nm-3um溶液小球散射效果.webp',
  thumbnail: '/images/scattering/分别为80nm-300nm-3um溶液小球散射效果.webp',
  relatedModules: ['mie-scattering', 'rayleigh', 'monte-carlo-scattering'],
  metadata: {
    polarizationSystem: 'none',
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
  PLASTIC_WRAP_STRETCHING, // Video resource
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
  // Brewster's Angle Experiments
  BREWSTER_APPARATUS,
  BREWSTER_HORIZONTAL_DARK_SPOT,
  BREWSTER_VERTICAL_DARK_SPOT,
  // Brewster Detailed Series
  BREWSTER_SETUP_DIAGRAM,
  BREWSTER_NO_POLARIZER,
  BREWSTER_NO_POLARIZER_VERTICAL_LASER,
  BREWSTER_NO_POLARIZER_VIDEO,
  BREWSTER_PARALLEL_POLARIZER,
  BREWSTER_PARALLEL_VERTICAL_LASER,
  BREWSTER_PARALLEL_HORIZONTAL_LASER,
  BREWSTER_PERPENDICULAR_POLARIZER,
  BREWSTER_PERPENDICULAR_VERTICAL_LASER,
  BREWSTER_PERPENDICULAR_VERTICAL_LASER_VIDEO,
  BREWSTER_PERPENDICULAR_HORIZONTAL_LASER,
  BREWSTER_VERTICAL_DIRECTION_VIDEO,
  // Calcite Birefringence Experiments
  CALCITE_DOUBLE_REFRACTION,
  CALCITE_POLARIZER_SEQUENCE,
  CALCITE_STACKED,
  CALCITE_LASER_RED_BEAMS,
  CALCITE_LASER_RED_BEAMS_2,
  // Optical Rotation Experiments
  OPTICAL_ROTATION_SETUP,
  OPTICAL_ROTATION_WHITE_LIGHT,
  OPTICAL_ROTATION_LASER_FRONT,
  OPTICAL_ROTATION_LASER_TOP,
  OPTICAL_ROTATION_NO_POLARIZER,
  OPTICAL_ROTATION_WITH_POLARIZER,
  // Scattering Experiments
  SCATTERING_MIE_CONCENTRATION,
  SCATTERING_PARTICLE_SIZE,
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

/** Get resources with view pairs (parallel/crossed) */
export function getResourcesWithViewPairs(): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.views && (r.views.parallel || r.views.crossed))
}

/** Get chiral (optically active) resources */
export function getChiralResources(): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.isChiral)
}

/** Get resources with video annotations */
export function getResourcesWithAnnotations(): PolarizationResource[] {
  return POLARIZATION_RESOURCES.filter(r => r.videoAnnotations && r.videoAnnotations.length > 0)
}

/** Check if resource has view pair */
export function hasViewPair(resource: PolarizationResource): boolean {
  return !!(resource.views && resource.views.parallel && resource.views.crossed)
}

// ===== Statistics =====
export const RESOURCE_STATS = {
  totalResources: POLARIZATION_RESOURCES.length,
  byCategory: {
    stress: getResourcesByCategory('stress').length,
    interference: getResourcesByCategory('interference').length,
    art: getResourcesByCategory('art').length,
    daily: getResourcesByCategory('daily').length,
    birefringence: getResourcesByCategory('birefringence').length,
    brewster: getResourcesByCategory('brewster').length,
    scattering: getResourcesByCategory('scattering').length,
    rotation: getResourcesByCategory('rotation').length,
  },
  byType: {
    image: getResourcesByType('image').length,
    video: getResourcesByType('video').length,
    sequence: getResourcesByType('sequence').length,
  },
  withVideos: getResourcesWithVideos().length,
  withViewPairs: getResourcesWithViewPairs().length,
  chiralResources: getChiralResources().length,
}
