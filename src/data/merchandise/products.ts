/**
 * Merchandise Products Data
 * 文创用品数据（12+个产品）
 */

import type { Product } from '../types'

export const PRODUCTS: Product[] = [
  // ===== 偏振艺术照片 Art Prints =====
  {
    id: 'art-interference-galaxy',
    name: 'Interference Galaxy',
    nameZh: '干涉星云',
    category: 'art-print',
    description: 'Stunning interference pattern resembling a galaxy spiral, created through crossed polarizers and birefringent film.',
    descriptionZh: '惊艳的干涉图案，形如银河旋涡，由正交偏振片和双折射薄膜创作。',
    materials: ['Giclée print', 'Museum-grade paper', 'UV-resistant ink'],
    materialsZh: ['艺术微喷', '博物馆级相纸', '抗紫外线墨水'],
    craftProcess: 'Photographed through polarized light setup, digitally enhanced, archival printing',
    craftProcessZh: '通过偏振光装置拍摄，数字增强处理，档案级打印',
    useCases: ['Home decoration', 'Office art', 'Science museum', 'Gift'],
    useCasesZh: ['家居装饰', '办公室艺术', '科学博物馆', '礼品'],
    educationalValue: 'Demonstrates interference and birefringence principles',
    educationalValueZh: '展示干涉和双折射原理',
    relatedConcepts: ['interference', 'birefringence', 'retardation'],
    priceRange: 'medium',
    targetAudience: ['adult', 'professional'],
    requiresPolarizer: false,
    artParams: {
      type: 'interference',
      colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff8800'],
      complexity: 8
    }
  },
  {
    id: 'art-stress-butterfly',
    name: 'Stress Butterfly',
    nameZh: '应力蝴蝶',
    category: 'art-print',
    description: 'Colorful stress patterns in transparent plastic shaped like a butterfly wing.',
    descriptionZh: '透明塑料中的彩色应力图案，形如蝴蝶翅膀。',
    materials: ['Canvas print', 'Stretched frame', 'Protective coating'],
    materialsZh: ['帆布打印', '内框装裱', '保护涂层'],
    craftProcess: 'Stressed plastic photographed between polarizers, color-enhanced',
    craftProcessZh: '应力塑料在偏振片间拍摄，颜色增强',
    useCases: ['Wall art', 'Educational poster', 'Exhibition piece'],
    useCasesZh: ['墙面艺术', '教育海报', '展览作品'],
    educationalValue: 'Shows photoelastic effect and stress visualization',
    educationalValueZh: '展示光弹效应和应力可视化',
    relatedConcepts: ['photoelasticity', 'stress', 'birefringence'],
    priceRange: 'medium',
    targetAudience: ['student', 'adult'],
    requiresPolarizer: false,
    artParams: {
      type: 'stress',
      colors: ['#ff4444', '#44ff44', '#4444ff', '#ffff00'],
      complexity: 6
    }
  },
  {
    id: 'art-optical-rotation',
    name: 'Chiral Spectrum',
    nameZh: '手性光谱',
    category: 'art-print',
    description: 'Rainbow gradient created by optical rotation in sugar solution column.',
    descriptionZh: '糖溶液柱中旋光效应产生的彩虹渐变。',
    materials: ['Photo paper', 'Float mount', 'Acrylic front'],
    materialsZh: ['相纸', '悬浮装裱', '亚克力面板'],
    craftProcess: 'Long exposure through rotating polarization',
    craftProcessZh: '通过旋转偏振的长曝光',
    useCases: ['Chemistry lab decoration', 'Gift for scientists'],
    useCasesZh: ['化学实验室装饰', '科学家礼物'],
    educationalValue: 'Demonstrates optical activity in chiral molecules',
    educationalValueZh: '展示手性分子的旋光性',
    relatedConcepts: ['optical-rotation', 'chirality', 'wavelength'],
    priceRange: 'high',
    targetAudience: ['professional', 'student'],
    requiresPolarizer: false,
    artParams: {
      type: 'rotation',
      colors: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'],
      complexity: 7
    }
  },

  // ===== 明信片 Postcards =====
  {
    id: 'postcard-set-basics',
    name: 'Polarization Basics Postcard Set',
    nameZh: '偏振基础明信片套装',
    category: 'postcard',
    description: 'Set of 6 postcards illustrating fundamental polarization concepts.',
    descriptionZh: '6张明信片套装，图解偏振光基本概念。',
    materials: ['350gsm cardstock', 'Matte finish', 'Rounded corners'],
    materialsZh: ['350克卡纸', '哑光覆膜', '圆角设计'],
    craftProcess: 'Offset printing with spot UV',
    craftProcessZh: '胶印加局部UV',
    useCases: ['Course materials', 'Souvenir', 'Thank you cards'],
    useCasesZh: ['课程材料', '纪念品', '感谢卡'],
    educationalValue: 'Quick reference for polarization principles',
    educationalValueZh: '偏振原理的快速参考',
    relatedConcepts: ['malus-law', 'birefringence', 'circular-polarization'],
    priceRange: 'low',
    targetAudience: ['student', 'child', 'all'],
    requiresPolarizer: false,
    artParams: {
      type: 'abstract',
      colors: ['#22d3ee', '#a78bfa', '#fbbf24'],
      complexity: 4
    }
  },
  {
    id: 'postcard-interactive',
    name: 'Interactive Polarization Postcard',
    nameZh: '互动偏振明信片',
    category: 'postcard',
    description: 'Postcard with hidden image revealed by included polarizer card.',
    descriptionZh: '带有隐藏图像的明信片，需用附带的偏振卡片揭示。',
    materials: ['Specialty cardstock', 'Polarizer film', 'Protective sleeve'],
    materialsZh: ['特种卡纸', '偏振膜', '保护套'],
    craftProcess: 'Layered polarizer printing technique',
    craftProcessZh: '分层偏振片印刷技术',
    useCases: ['Science gift', 'Magic trick demonstration', 'Educational tool'],
    useCasesZh: ['科学礼品', '魔术演示', '教学工具'],
    educationalValue: 'Hands-on polarization discovery',
    educationalValueZh: '动手发现偏振现象',
    relatedConcepts: ['polarizer', 'extinction', 'transmission'],
    priceRange: 'low',
    targetAudience: ['child', 'student', 'all'],
    requiresPolarizer: true,
    safetyWarning: 'Small polarizer card - supervise young children',
    safetyWarningZh: '小偏振卡片 - 请监护幼童使用'
  },

  // ===== 贴纸 Stickers =====
  {
    id: 'sticker-polarization-set',
    name: 'Polarization Emoji Sticker Sheet',
    nameZh: '偏振表情贴纸套装',
    category: 'sticker',
    description: 'Fun sticker sheet with polarization-themed icons and formulas.',
    descriptionZh: '趣味贴纸套装，包含偏振主题图标和公式。',
    materials: ['Vinyl sticker', 'Waterproof', 'Removable adhesive'],
    materialsZh: ['乙烯基贴纸', '防水', '可移除背胶'],
    craftProcess: 'Die-cut printing',
    craftProcessZh: '模切印刷',
    useCases: ['Laptop decoration', 'Notebook', 'Phone case', 'Lab equipment'],
    useCasesZh: ['笔记本电脑装饰', '笔记本', '手机壳', '实验室设备'],
    educationalValue: 'Makes physics fun and visible',
    educationalValueZh: '让物理变得有趣可见',
    relatedConcepts: ['all'],
    priceRange: 'low',
    targetAudience: ['child', 'student', 'all'],
    requiresPolarizer: false,
    artParams: {
      type: 'abstract',
      colors: ['#ff4444', '#44ff44', '#4444ff', '#ffaa00'],
      complexity: 3
    }
  },
  {
    id: 'sticker-holographic',
    name: 'Holographic Polarization Stickers',
    nameZh: '全息偏振贴纸',
    category: 'sticker',
    description: 'Holographic stickers that change appearance with viewing angle.',
    descriptionZh: '全息贴纸，随视角变化外观。',
    materials: ['Holographic film', 'Premium adhesive'],
    materialsZh: ['全息膜', '优质背胶'],
    craftProcess: 'Holographic embossing',
    craftProcessZh: '全息压印',
    useCases: ['Premium decoration', 'Collectible'],
    useCasesZh: ['高级装饰', '收藏品'],
    educationalValue: 'Demonstrates light interference principles',
    educationalValueZh: '演示光干涉原理',
    relatedConcepts: ['interference', 'diffraction'],
    priceRange: 'low',
    targetAudience: ['student', 'adult'],
    requiresPolarizer: false
  },

  // ===== 亚克力摆件/钥匙扣 Acrylic =====
  {
    id: 'acrylic-polarizer-keychain',
    name: 'Polarizer Keychain Set',
    nameZh: '偏振片钥匙扣套装',
    category: 'acrylic',
    description: 'Pair of rotating polarizer keychains for demonstrating Malus\'s Law.',
    descriptionZh: '一对可旋转的偏振片钥匙扣，可演示马吕斯定律。',
    materials: ['Clear acrylic', 'Polarizer film', 'Metal keyring'],
    materialsZh: ['透明亚克力', '偏振膜', '金属钥匙环'],
    craftProcess: 'Laser cut acrylic with embedded polarizer',
    craftProcessZh: '激光切割亚克力内嵌偏振膜',
    useCases: ['Daily carry demo', 'Keychain', 'Gift'],
    useCasesZh: ['随身携带演示', '钥匙扣', '礼品'],
    educationalValue: 'Portable Malus\'s Law demonstration',
    educationalValueZh: '便携马吕斯定律演示',
    relatedConcepts: ['malus-law', 'polarizer', 'extinction'],
    priceRange: 'low',
    targetAudience: ['student', 'adult', 'all'],
    requiresPolarizer: true
  },
  {
    id: 'acrylic-stress-display',
    name: 'Stress Pattern Display Stand',
    nameZh: '应力图案展示架',
    category: 'acrylic',
    description: 'Desktop display with stressed acrylic showing rainbow patterns.',
    descriptionZh: '桌面展示架，含应力亚克力展示彩虹图案。',
    materials: ['Cast acrylic', 'LED base', 'Polarizer sheet'],
    materialsZh: ['浇铸亚克力', 'LED底座', '偏振片'],
    craftProcess: 'Controlled stress molding, LED integration',
    craftProcessZh: '可控应力成型，LED集成',
    useCases: ['Desk decoration', 'Science demo', 'Night light'],
    useCasesZh: ['桌面装饰', '科学演示', '夜灯'],
    educationalValue: 'Demonstrates photoelasticity in real-time',
    educationalValueZh: '实时演示光弹效应',
    relatedConcepts: ['photoelasticity', 'stress', 'birefringence'],
    priceRange: 'medium',
    targetAudience: ['adult', 'professional'],
    requiresPolarizer: true,
    safetyWarning: 'LED base requires USB power',
    safetyWarningZh: 'LED底座需要USB供电'
  },

  // ===== 偏振滤镜小玩具 Filter Toys =====
  {
    id: 'toy-magic-window',
    name: 'Magic Polarization Window',
    nameZh: '偏振魔法窗',
    category: 'filter-toy',
    description: 'Handheld device with rotating polarizers for exploring the polarized world.',
    descriptionZh: '手持设备，带旋转偏振片，探索偏振世界。',
    materials: ['ABS plastic', 'Glass polarizers', 'Rotating mount'],
    materialsZh: ['ABS塑料', '玻璃偏振片', '旋转支架'],
    craftProcess: 'Injection molding, optical assembly',
    craftProcessZh: '注塑成型，光学组装',
    useCases: ['Outdoor exploration', 'LCD screen viewing', 'Sky observation'],
    useCasesZh: ['户外探索', '观察LCD屏幕', '天空观察'],
    educationalValue: 'Discover polarization in everyday life',
    educationalValueZh: '发现日常生活中的偏振现象',
    relatedConcepts: ['polarizer', 'LCD', 'rayleigh-scattering'],
    priceRange: 'low',
    targetAudience: ['child', 'student', 'all'],
    requiresPolarizer: true,
    safetyWarning: 'Do not look at the sun',
    safetyWarningZh: '切勿直视太阳'
  },
  {
    id: 'toy-kaleidoscope',
    name: 'Polarization Kaleidoscope',
    nameZh: '偏振万花筒',
    category: 'filter-toy',
    description: 'Kaleidoscope with birefringent crystals creating ever-changing patterns.',
    descriptionZh: '带双折射晶体的万花筒，创造变幻莫测的图案。',
    materials: ['Cardboard tube', 'Polarizer ends', 'Cellophane chips'],
    materialsZh: ['纸筒', '偏振片端盖', '玻璃纸碎片'],
    craftProcess: 'Hand assembly with optical elements',
    craftProcessZh: '手工组装光学元件',
    useCases: ['Toy', 'Art inspiration', 'Relaxation'],
    useCasesZh: ['玩具', '艺术灵感', '放松'],
    educationalValue: 'Interactive birefringence exploration',
    educationalValueZh: '互动式双折射探索',
    relatedConcepts: ['birefringence', 'interference', 'retardation'],
    priceRange: 'low',
    targetAudience: ['child', 'all'],
    requiresPolarizer: true
  },

  // ===== 展陈套装 Exhibition Sets =====
  {
    id: 'exhibition-classroom-kit',
    name: 'Classroom Polarization Kit',
    nameZh: '课堂偏振教学套装',
    category: 'exhibition-set',
    description: 'Complete kit for classroom demonstrations including polarizers, samples, and guide.',
    descriptionZh: '完整的课堂演示套装，包含偏振片、样品和指南。',
    materials: ['Polarizer sheets', 'Sample materials', 'LED light', 'Carrying case', 'Teacher guide'],
    materialsZh: ['偏振片', '样品材料', 'LED灯', '便携箱', '教师指南'],
    craftProcess: 'Curated educational assembly',
    craftProcessZh: '精心策划的教育组合',
    useCases: ['Classroom teaching', 'Science fair', 'Workshop'],
    useCasesZh: ['课堂教学', '科学展', '工作坊'],
    educationalValue: 'Complete polarization curriculum support',
    educationalValueZh: '完整的偏振课程支持',
    relatedConcepts: ['all'],
    priceRange: 'high',
    targetAudience: ['professional', 'adult'],
    requiresPolarizer: true
  },
  {
    id: 'exhibition-museum-set',
    name: 'Museum Exhibition Set',
    nameZh: '博物馆展陈套装',
    category: 'exhibition-set',
    description: 'Professional exhibition set with interactive stations and explanatory panels.',
    descriptionZh: '专业展览套装，含互动展位和解说板。',
    materials: ['Display stands', 'Interactive modules', 'Information panels', 'Lighting'],
    materialsZh: ['展示架', '互动模块', '信息板', '照明设备'],
    craftProcess: 'Professional exhibition design and fabrication',
    craftProcessZh: '专业展览设计与制作',
    useCases: ['Science museum', 'University lobby', 'Corporate showroom'],
    useCasesZh: ['科学博物馆', '大学大厅', '企业展厅'],
    educationalValue: 'Public science education at scale',
    educationalValueZh: '大规模公共科学教育',
    relatedConcepts: ['all'],
    priceRange: 'premium',
    targetAudience: ['professional'],
    requiresPolarizer: true
  }
]

// Helper functions
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return PRODUCTS.filter(p => p.category === category)
}

export function getProductsByPriceRange(range: Product['priceRange']): Product[] {
  return PRODUCTS.filter(p => p.priceRange === range)
}

export function getProductsRequiringPolarizer(): Product[] {
  return PRODUCTS.filter(p => p.requiresPolarizer)
}

// Category labels
export const PRODUCT_CATEGORIES = {
  'art-print': { label: 'Art Prints', labelZh: '艺术照片', icon: 'image' },
  'postcard': { label: 'Postcards', labelZh: '明信片', icon: 'mail' },
  'sticker': { label: 'Stickers', labelZh: '贴纸', icon: 'sticky-note' },
  'acrylic': { label: 'Acrylic Items', labelZh: '亚克力制品', icon: 'box' },
  'filter-toy': { label: 'Filter Toys', labelZh: '偏振滤镜玩具', icon: 'sparkles' },
  'exhibition-set': { label: 'Exhibition Sets', labelZh: '展陈套装', icon: 'presentation' }
}

// Price range labels
export const PRICE_RANGES = {
  low: { label: 'Budget', labelZh: '实惠', range: '¥0-50', color: 'green' },
  medium: { label: 'Standard', labelZh: '标准', range: '¥50-150', color: 'blue' },
  high: { label: 'Premium', labelZh: '高端', range: '¥150-500', color: 'purple' },
  premium: { label: 'Professional', labelZh: '专业', range: '¥500+', color: 'orange' }
}

// Audience labels
export const AUDIENCE_LABELS = {
  child: { label: 'Children', labelZh: '儿童', icon: 'baby' },
  student: { label: 'Students', labelZh: '学生', icon: 'graduation-cap' },
  adult: { label: 'Adults', labelZh: '成人', icon: 'user' },
  professional: { label: 'Professionals', labelZh: '专业人士', icon: 'briefcase' },
  all: { label: 'All Ages', labelZh: '全年龄', icon: 'users' }
}
