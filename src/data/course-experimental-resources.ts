/**
 * Course Experimental Resources - 课程实验资源
 *
 * 整合编年史(Chronicles)中的实验资源到P-SRT课程结构
 * Integrates experimental resources from Chronicles into P-SRT curriculum
 *
 * 设计原则：
 * 1. 每个课程章节关联相关的实验图片和视频
 * 2. 资源按难度分级（观察→操作→分析）
 * 3. 支持渐进式披露（先简单后复杂）
 */

export interface ExperimentalResource {
  id: string
  titleEn: string
  titleZh: string
  type: 'image' | 'video' | 'animation'
  url: string
  captionEn?: string
  captionZh?: string
  difficulty: 'observe' | 'operate' | 'analyze'
  duration?: string // for videos
  relatedConcepts: string[]
}

export interface SectionResources {
  sectionId: string
  featuredResources: ExperimentalResource[]
  additionalResources: string[] // IDs referencing resource-gallery.ts
  homeExperiments?: {
    titleEn: string
    titleZh: string
    materials: string[]
    steps: string[]
    observation: string
  }[]
}

// Course section to experimental resources mapping
export const SECTION_EXPERIMENTAL_RESOURCES: SectionResources[] = [
  // ========================================
  // Unit 1: 光的偏振态及其调制和测量
  // ========================================
  {
    sectionId: '1.1',
    featuredResources: [
      {
        id: 'wave-demo',
        titleEn: 'Electromagnetic Wave Visualization',
        titleZh: '电磁波可视化',
        type: 'animation',
        url: '/demos/light-wave',
        captionEn: 'See how E and B fields oscillate perpendicular to each other',
        captionZh: '观察E场和B场如何相互垂直振荡',
        difficulty: 'observe',
        relatedConcepts: ['transverse-wave', 'electromagnetic-wave']
      }
    ],
    additionalResources: [],
    homeExperiments: [
      {
        titleEn: 'Polarizer and Screen',
        titleZh: '偏振片与屏幕',
        materials: ['Polarizer film or 3D glasses', 'Computer/phone screen'],
        steps: [
          'Hold polarizer in front of LCD screen',
          'Slowly rotate the polarizer',
          'Observe brightness changes'
        ],
        observation: 'Screen appears to brighten and darken because LCD emits polarized light'
      }
    ]
  },
  {
    sectionId: '1.2',
    featuredResources: [
      {
        id: 'calcite-double-image',
        titleEn: 'Calcite Double Refraction',
        titleZh: '方解石双折射',
        type: 'image',
        url: '/images/calcite/双折射成像.webp',
        captionEn: 'Classic Iceland spar creating two images - ordinary and extraordinary rays',
        captionZh: '经典冰洲石产生双像——寻常光和非常光',
        difficulty: 'observe',
        relatedConcepts: ['birefringence', 'o-ray', 'e-ray']
      },
      {
        id: 'calcite-polarizer-sequence',
        titleEn: 'Calcite with Polarizer',
        titleZh: '方解石配合偏振片',
        type: 'video',
        url: '/videos/calcite/偏振片观察冰洲石.mp4',
        captionEn: 'Rotating polarizer reveals how the two images have perpendicular polarizations',
        captionZh: '旋转偏振片揭示两个像具有垂直偏振',
        difficulty: 'operate',
        duration: '30s',
        relatedConcepts: ['birefringence', 'polarization-analysis']
      },
      {
        id: 'tempered-glass-stress',
        titleEn: 'Stress Birefringence in Glass',
        titleZh: '玻璃中的应力双折射',
        type: 'image',
        url: '/images/chromatic-polarization/钢化玻璃-正交偏振系统-正视图.webp',
        captionEn: 'Internal stress in tempered glass revealed by crossed polarizers',
        captionZh: '正交偏振片揭示钢化玻璃中的内应力',
        difficulty: 'observe',
        relatedConcepts: ['stress-birefringence', 'photoelasticity']
      }
    ],
    additionalResources: [
      'calcite-stacked',
      'calcite-laser-red-beams',
      'plastic-wrap',
      'plastic-wrap-thickness'
    ],
    homeExperiments: [
      {
        titleEn: 'Plastic Wrap Birefringence',
        titleZh: '保鲜膜双折射',
        materials: ['Plastic wrap', 'Two polarizers', 'Light source'],
        steps: [
          'Set up crossed polarizers (dark)',
          'Stretch plastic wrap and place between polarizers',
          'Observe the colorful patterns'
        ],
        observation: 'Stretching creates stress that causes birefringence, producing interference colors'
      }
    ]
  },
  {
    sectionId: '1.3',
    featuredResources: [
      {
        id: 'malus-demo',
        titleEn: 'Malus Law Demonstration',
        titleZh: '马吕斯定律演示',
        type: 'animation',
        url: '/demos/malus',
        captionEn: 'Interactive: rotate analyzer and see I = I₀cos²θ in action',
        captionZh: '交互式：旋转检偏器观察 I = I₀cos²θ',
        difficulty: 'operate',
        relatedConcepts: ['malus-law', 'polarizer', 'analyzer']
      },
      {
        id: 'tape-array-colors',
        titleEn: 'Clear Tape Array Colors',
        titleZh: '透明胶阵列色彩',
        type: 'video',
        url: '/videos/chromatic-polarization/实验-透明胶条-正交偏振系统-旋转偏振片视频.mp4',
        captionEn: 'Rotating polarizer reveals color changes in layered tape',
        captionZh: '旋转偏振片揭示层叠透明胶的颜色变化',
        difficulty: 'operate',
        duration: '45s',
        relatedConcepts: ['malus-law', 'retardation', 'interference']
      }
    ],
    additionalResources: [
      'clear-tape',
      'clear-tape-array',
      'water-bottle'
    ]
  },

  // ========================================
  // Unit 2: 界面反射的偏振特征
  // ========================================
  {
    sectionId: '2.1',
    featuredResources: [
      {
        id: 'fresnel-demo',
        titleEn: 'Fresnel Equations Demo',
        titleZh: '菲涅尔方程演示',
        type: 'animation',
        url: '/demos/fresnel',
        captionEn: 'See how s and p polarizations reflect differently',
        captionZh: '观察s偏振和p偏振如何不同地反射',
        difficulty: 'analyze',
        relatedConcepts: ['fresnel-equations', 's-polarization', 'p-polarization']
      }
    ],
    additionalResources: ['glass-comparison']
  },
  {
    sectionId: '2.2',
    featuredResources: [
      {
        id: 'brewster-demo',
        titleEn: 'Brewster Angle Demo',
        titleZh: '布儒斯特角演示',
        type: 'animation',
        url: '/demos/brewster',
        captionEn: 'At Brewster angle, reflected light is completely polarized',
        captionZh: '在布儒斯特角处，反射光完全偏振',
        difficulty: 'operate',
        relatedConcepts: ['brewster-angle', 'reflection-polarization']
      },
      {
        id: 'eyeglasses-stress',
        titleEn: 'Eyeglasses Under Polarizers',
        titleZh: '偏振光下的眼镜',
        type: 'video',
        url: '/videos/chromatic-polarization/实验-眼镜-正交偏振系统-旋转样品视频.mp4',
        captionEn: 'Lens stress patterns revealed by polarized light',
        captionZh: '偏振光揭示镜片应力图案',
        difficulty: 'observe',
        duration: '30s',
        relatedConcepts: ['stress-analysis', 'photoelasticity']
      }
    ],
    additionalResources: ['glasses']
  },

  // ========================================
  // Unit 3: 透明介质的偏振特征
  // ========================================
  {
    sectionId: '3.1',
    featuredResources: [
      {
        id: 'chromatic-polarization-demo',
        titleEn: 'Chromatic Polarization',
        titleZh: '色偏振',
        type: 'animation',
        url: '/demos/chromatic',
        captionEn: 'Different thicknesses produce different interference colors',
        captionZh: '不同厚度产生不同的干涉色',
        difficulty: 'observe',
        relatedConcepts: ['chromatic-polarization', 'interference', 'retardation']
      },
      {
        id: 'glass-heating',
        titleEn: 'Glass Thermal Stress',
        titleZh: '玻璃热应力',
        type: 'video',
        url: '/videos/chromatic-polarization/实验-打火机烧玻璃-正交偏振系统-长时间观察视频.mp4',
        captionEn: 'Watch thermal stress develop in real-time',
        captionZh: '实时观察热应力的发展',
        difficulty: 'analyze',
        duration: '2min',
        relatedConcepts: ['thermal-stress', 'stress-birefringence']
      },
      {
        id: 'tape-array-pattern',
        titleEn: 'Tape Array Art',
        titleZh: '透明胶艺术',
        type: 'image',
        url: '/images/chromatic-polarization/透明胶条（重叠阵列）-正交偏振系统-正视图.webp',
        captionEn: 'Beautiful interference patterns from layered tape',
        captionZh: '层叠透明胶产生的美丽干涉图案',
        difficulty: 'observe',
        relatedConcepts: ['interference-colors', 'retardation']
      }
    ],
    additionalResources: [
      'glass-heating-cooling',
      'plastic-wrap-thickness',
      'clear-tape-array',
      'tempered-glass'
    ],
    homeExperiments: [
      {
        titleEn: 'Tape Art Creation',
        titleZh: '透明胶艺术创作',
        materials: ['Clear tape', 'Two polarizers', 'Scissors', 'Clear plastic sheet'],
        steps: [
          'Cut tape into different shapes',
          'Layer multiple pieces on plastic sheet',
          'View between crossed polarizers',
          'Rotate to see color changes'
        ],
        observation: 'Each layer adds retardation, changing the interference color'
      }
    ]
  },
  {
    sectionId: '3.2',
    featuredResources: [
      {
        id: 'optical-rotation-demo',
        titleEn: 'Optical Rotation',
        titleZh: '旋光演示',
        type: 'animation',
        url: '/demos/optical-rotation',
        captionEn: 'Chiral molecules rotate the polarization plane',
        captionZh: '手性分子旋转偏振面',
        difficulty: 'observe',
        relatedConcepts: ['optical-activity', 'chirality', 'sugar']
      }
    ],
    additionalResources: [],
    homeExperiments: [
      {
        titleEn: 'Sugar Solution Rotation',
        titleZh: '糖溶液旋光',
        materials: ['Sugar', 'Water', 'Clear tube/bottle', 'Two polarizers', 'White light'],
        steps: [
          'Dissolve sugar in water (saturated solution)',
          'Place between crossed polarizers',
          'Shine white light through',
          'Observe the color gradient along the tube'
        ],
        observation: 'Sugar rotates different wavelengths by different amounts, creating a rainbow'
      }
    ]
  },

  // ========================================
  // Unit 4: 浑浊介质的偏振特征
  // ========================================
  {
    sectionId: '4.1',
    featuredResources: [
      {
        id: 'rayleigh-demo',
        titleEn: 'Rayleigh Scattering',
        titleZh: '瑞利散射',
        type: 'animation',
        url: '/demos/rayleigh',
        captionEn: 'Why the sky is blue and sunsets are red',
        captionZh: '为什么天空是蓝色而日落是红色',
        difficulty: 'observe',
        relatedConcepts: ['rayleigh-scattering', 'wavelength-dependence']
      }
    ],
    additionalResources: [],
    homeExperiments: [
      {
        titleEn: 'Milk Sunset',
        titleZh: '牛奶日落',
        materials: ['Glass of water', 'Few drops of milk', 'Flashlight', 'Polarizer'],
        steps: [
          'Add a few drops of milk to water',
          'Shine flashlight through from the side',
          'View from different angles with polarizer',
          'Compare scattered blue vs transmitted orange'
        ],
        observation: 'Scattered light is blue and polarized; transmitted light is orange'
      }
    ]
  },
  {
    sectionId: '4.2',
    featuredResources: [
      {
        id: 'mie-demo',
        titleEn: 'Mie Scattering',
        titleZh: '米氏散射',
        type: 'animation',
        url: '/demos/mie-scattering',
        captionEn: 'Larger particles scatter light differently',
        captionZh: '较大颗粒以不同方式散射光',
        difficulty: 'analyze',
        relatedConcepts: ['mie-scattering', 'particle-size']
      }
    ],
    additionalResources: []
  },

  // ========================================
  // Unit 5: 完全偏振测量
  // ========================================
  {
    sectionId: '5.1',
    featuredResources: [
      {
        id: 'stokes-demo',
        titleEn: 'Stokes Parameters',
        titleZh: '斯托克斯参数',
        type: 'animation',
        url: '/demos/stokes',
        captionEn: 'Measuring all aspects of polarization state',
        captionZh: '测量偏振态的所有方面',
        difficulty: 'analyze',
        relatedConcepts: ['stokes-parameters', 'polarimetry']
      },
      {
        id: 'poincare-sphere',
        titleEn: 'Poincaré Sphere',
        titleZh: '庞加莱球',
        type: 'animation',
        url: '/calc/poincare',
        captionEn: 'All polarization states on a sphere',
        captionZh: '球面上的所有偏振态',
        difficulty: 'analyze',
        relatedConcepts: ['poincare-sphere', 'stokes-parameters']
      }
    ],
    additionalResources: []
  },
  {
    sectionId: '5.2',
    featuredResources: [
      {
        id: 'mueller-demo',
        titleEn: 'Mueller Matrix',
        titleZh: '穆勒矩阵',
        type: 'animation',
        url: '/demos/mueller',
        captionEn: 'Complete polarization transformation',
        captionZh: '完整的偏振变换',
        difficulty: 'analyze',
        relatedConcepts: ['mueller-matrix', 'polarimetry']
      }
    ],
    additionalResources: []
  },
  {
    sectionId: '5.3',
    featuredResources: [
      {
        id: 'jones-demo',
        titleEn: 'Jones Calculus',
        titleZh: '琼斯计算',
        type: 'animation',
        url: '/demos/jones',
        captionEn: 'Matrix math for polarization',
        captionZh: '偏振的矩阵数学',
        difficulty: 'analyze',
        relatedConcepts: ['jones-matrix', 'jones-vector']
      }
    ],
    additionalResources: []
  },
  {
    sectionId: '5.4',
    featuredResources: [
      {
        id: 'polarimetric-microscopy',
        titleEn: 'Polarimetric Microscopy',
        titleZh: '偏振显微成像',
        type: 'animation',
        url: '/demos/polarimetric-microscopy',
        captionEn: 'Medical and materials imaging with polarization',
        captionZh: '使用偏振进行医学和材料成像',
        difficulty: 'analyze',
        relatedConcepts: ['medical-imaging', 'materials-science']
      }
    ],
    additionalResources: []
  }
]

/**
 * Get resources for a specific course section
 */
export function getResourcesForSection(sectionId: string): SectionResources | undefined {
  return SECTION_EXPERIMENTAL_RESOURCES.find(r => r.sectionId === sectionId)
}

/**
 * Get all home experiments across all sections
 */
export function getAllHomeExperiments() {
  return SECTION_EXPERIMENTAL_RESOURCES
    .filter(r => r.homeExperiments && r.homeExperiments.length > 0)
    .flatMap(r => r.homeExperiments!.map(exp => ({
      ...exp,
      sectionId: r.sectionId
    })))
}

/**
 * Get resources by difficulty level
 */
export function getResourcesByDifficulty(
  difficulty: 'observe' | 'operate' | 'analyze'
): ExperimentalResource[] {
  return SECTION_EXPERIMENTAL_RESOURCES
    .flatMap(s => s.featuredResources)
    .filter(r => r.difficulty === difficulty)
}
