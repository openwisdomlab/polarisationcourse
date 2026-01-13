/**
 * units.ts - 课程单元结构定义
 * Course Unit Structure Definitions
 *
 * 定义《偏振光下的世界》课程的六个单元（Unit 0-5）
 * 每个单元包含多个课时（Lesson），引用现有的 Demo 组件
 */

import type { DifficultyLevel } from './course.config'

// 课时定义接口
export interface LessonDefinition {
  id: string
  titleKey: string
  titleZhKey: string
  descriptionKey: string
  // 关联的现有 Demo ID（来自 /demos/:demoId）
  demoId?: string
  // 自定义内容组件路径（如果有）
  contentComponent?: string
  // 课时学习目标
  objectives: string[]
  // 预估学习时间（分钟）
  estimatedMinutes: number
  // 适用难度级别
  difficulties: DifficultyLevel[]
  // 引导问题（问题引导式学习）
  guidingQuestions: {
    foundation: string[]
    application: string[]
    research: string[]
  }
  // 相关资源链接
  resources: {
    type: 'demo' | 'game' | 'tool' | 'experiment' | 'external'
    path: string
    labelKey: string
  }[]
}

// 单元定义接口
export interface UnitDefinition {
  id: string
  number: number
  titleKey: string
  titleZhKey: string
  subtitleKey: string
  descriptionKey: string
  color: string
  icon: string
  // 单元学习目标
  objectives: string[]
  // 核心问题（驱动整个单元的关键问题）
  coreQuestion: string
  // 包含的课时列表
  lessons: LessonDefinition[]
  // 关联的游戏关卡
  relatedGames?: string[]
  // 关联的工具
  relatedTools?: string[]
}

// Unit 0: 光学基础 - Optical Basics
export const UNIT_0: UnitDefinition = {
  id: 'unit-0',
  number: 0,
  titleKey: 'worldCourse.units.unit0.title',
  titleZhKey: 'worldCourse.units.unit0.titleZh',
  subtitleKey: 'worldCourse.units.unit0.subtitle',
  descriptionKey: 'worldCourse.units.unit0.description',
  color: '#06B6D4', // cyan-500
  icon: 'Lightbulb',
  objectives: [
    'worldCourse.units.unit0.obj1',
    'worldCourse.units.unit0.obj2',
    'worldCourse.units.unit0.obj3',
  ],
  coreQuestion: 'worldCourse.units.unit0.coreQuestion',
  lessons: [
    {
      id: 'light-wave',
      titleKey: 'worldCourse.lessons.lightWave.title',
      titleZhKey: 'worldCourse.lessons.lightWave.titleZh',
      descriptionKey: 'worldCourse.lessons.lightWave.description',
      demoId: 'em-wave',
      objectives: [
        'Understand electromagnetic waves as transverse waves',
        'Recognize the relationship between electric and magnetic fields',
      ],
      estimatedMinutes: 15,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'What is light? How does it travel?',
          'Why is light called an electromagnetic wave?',
        ],
        application: [
          'How do E and B fields relate in an EM wave?',
          'What determines the wavelength and frequency?',
        ],
        research: [
          'How can we mathematically describe wave propagation?',
          'What is the significance of the wave vector?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/em-wave', labelKey: 'common.viewDemo' },
      ],
    },
    {
      id: 'polarization-intro',
      titleKey: 'worldCourse.lessons.polarizationIntro.title',
      titleZhKey: 'worldCourse.lessons.polarizationIntro.titleZh',
      descriptionKey: 'worldCourse.lessons.polarizationIntro.description',
      demoId: 'polarization-intro',
      objectives: [
        'Understand what polarization means for light',
        'Distinguish between polarized and unpolarized light',
      ],
      estimatedMinutes: 20,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'What does "polarized" mean for light?',
          'Is sunlight polarized or unpolarized?',
        ],
        application: [
          'How can we create polarized light?',
          'What happens when light passes through a polarizer?',
        ],
        research: [
          'How do we mathematically represent polarization states?',
          'What is the Jones vector formalism?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/polarization-intro', labelKey: 'common.viewDemo' },
        { type: 'game', path: '/games/2d?level=0', labelKey: 'common.playGame' },
      ],
    },
    {
      id: 'polarization-types',
      titleKey: 'worldCourse.lessons.polarizationTypes.title',
      titleZhKey: 'worldCourse.lessons.polarizationTypes.titleZh',
      descriptionKey: 'worldCourse.lessons.polarizationTypes.description',
      demoId: 'polarization-types-unified',
      objectives: [
        'Identify linear, circular, and elliptical polarization',
        'Understand the three-polarizer paradox',
      ],
      estimatedMinutes: 25,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'What shapes can the electric field trace out?',
          'Why can three polarizers let more light through than two?',
        ],
        application: [
          'How do we create circular polarization?',
          'What is the mathematical relationship between polarization types?',
        ],
        research: [
          'How are elliptical polarization parameters measured?',
          'What is the Poincaré sphere representation?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/polarization-types-unified', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/calc/poincare', labelKey: 'common.useTool' },
      ],
    },
    {
      id: 'optical-bench',
      titleKey: 'worldCourse.lessons.opticalBench.title',
      titleZhKey: 'worldCourse.lessons.opticalBench.titleZh',
      descriptionKey: 'worldCourse.lessons.opticalBench.description',
      demoId: 'optical-bench',
      objectives: [
        'Learn to use the interactive optical bench',
        'Design simple polarization experiments',
      ],
      estimatedMinutes: 30,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'What components do we need for a basic experiment?',
          'How does light change as it passes through each component?',
        ],
        application: [
          'How can we measure light intensity after polarizers?',
          'What configurations give maximum/minimum transmission?',
        ],
        research: [
          'How do we design experiments to test Malus Law?',
          'What systematic errors might affect our measurements?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/optical-bench', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/optical-studio', labelKey: 'common.useStudio' },
      ],
    },
  ],
  relatedGames: ['/games/2d?level=0', '/games/2d?level=1'],
  relatedTools: ['/optical-studio'],
}

// Unit 1: 偏振态及其调制测量 - Polarization States
export const UNIT_1: UnitDefinition = {
  id: 'unit-1',
  number: 1,
  titleKey: 'worldCourse.units.unit1.title',
  titleZhKey: 'worldCourse.units.unit1.titleZh',
  subtitleKey: 'worldCourse.units.unit1.subtitle',
  descriptionKey: 'worldCourse.units.unit1.description',
  color: '#C9A227', // amber
  icon: 'Lightbulb',
  objectives: [
    'worldCourse.units.unit1.obj1',
    'worldCourse.units.unit1.obj2',
    'worldCourse.units.unit1.obj3',
    'worldCourse.units.unit1.obj4',
  ],
  coreQuestion: 'worldCourse.units.unit1.coreQuestion',
  lessons: [
    {
      id: 'birefringence',
      titleKey: 'worldCourse.lessons.birefringence.title',
      titleZhKey: 'worldCourse.lessons.birefringence.titleZh',
      descriptionKey: 'worldCourse.lessons.birefringence.description',
      demoId: 'birefringence',
      objectives: [
        'Understand double refraction in crystals',
        'Explain ordinary and extraordinary rays',
      ],
      estimatedMinutes: 25,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'Why does Iceland spar show double images?',
          'What are o-ray and e-ray?',
        ],
        application: [
          'How does the refractive index ellipsoid describe birefringence?',
          'How can we use birefringence to split polarizations?',
        ],
        research: [
          'How do we calculate the phase difference in a birefringent crystal?',
          'What determines the optic axis orientation?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/birefringence', labelKey: 'common.viewDemo' },
        { type: 'game', path: '/games/2d?level=16', labelKey: 'common.playGame' },
      ],
    },
    {
      id: 'malus-law',
      titleKey: 'worldCourse.lessons.malusLaw.title',
      titleZhKey: 'worldCourse.lessons.malusLaw.titleZh',
      descriptionKey: 'worldCourse.lessons.malusLaw.description',
      demoId: 'malus',
      objectives: [
        'Derive and verify Malus Law: I = I₀ cos²θ',
        'Apply the law to predict intensity through polarizers',
      ],
      estimatedMinutes: 30,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'What happens when polarized light meets a polarizer?',
          'At what angle is light completely blocked?',
        ],
        application: [
          'Can you predict the intensity at any angle?',
          'What happens with multiple polarizers in series?',
        ],
        research: [
          'How do we account for imperfect polarizers?',
          'What is the extinction ratio and how is it measured?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/malus', labelKey: 'common.viewDemo' },
        { type: 'experiment', path: '/optical-studio?tab=experiments', labelKey: 'common.experiment' },
      ],
    },
    {
      id: 'waveplate',
      titleKey: 'worldCourse.lessons.waveplate.title',
      titleZhKey: 'worldCourse.lessons.waveplate.titleZh',
      descriptionKey: 'worldCourse.lessons.waveplate.description',
      demoId: 'waveplate',
      objectives: [
        'Understand quarter-wave and half-wave plates',
        'Convert between linear and circular polarization',
      ],
      estimatedMinutes: 25,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'How does a waveplate change polarization?',
          'What makes λ/4 and λ/2 plates special?',
        ],
        application: [
          'How do we create circular polarization from linear?',
          'What orientation should the waveplate have?',
        ],
        research: [
          'How do we design achromatic waveplates?',
          'What is the Jones matrix for a general retarder?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/waveplate', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/calc/jones', labelKey: 'common.useTool' },
      ],
    },
  ],
  relatedGames: ['/games/2d?level=0', '/games/2d?level=1', '/games/2d?level=16', '/games/2d?level=17'],
  relatedTools: ['/optical-studio', '/calc/jones'],
}

// Unit 2: 界面反射偏振特征 - Interface Reflection
export const UNIT_2: UnitDefinition = {
  id: 'unit-2',
  number: 2,
  titleKey: 'worldCourse.units.unit2.title',
  titleZhKey: 'worldCourse.units.unit2.titleZh',
  subtitleKey: 'worldCourse.units.unit2.subtitle',
  descriptionKey: 'worldCourse.units.unit2.description',
  color: '#6366F1', // indigo
  icon: 'Zap',
  objectives: [
    'worldCourse.units.unit2.obj1',
    'worldCourse.units.unit2.obj2',
    'worldCourse.units.unit2.obj3',
  ],
  coreQuestion: 'worldCourse.units.unit2.coreQuestion',
  lessons: [
    {
      id: 'fresnel',
      titleKey: 'worldCourse.lessons.fresnel.title',
      titleZhKey: 'worldCourse.lessons.fresnel.titleZh',
      descriptionKey: 'worldCourse.lessons.fresnel.description',
      demoId: 'fresnel',
      objectives: [
        'Understand Fresnel equations for s and p polarizations',
        'Calculate reflection and transmission coefficients',
      ],
      estimatedMinutes: 35,
      difficulties: ['application', 'research'],
      guidingQuestions: {
        foundation: [],
        application: [
          'How do reflection coefficients depend on angle?',
          'Why do s and p polarizations behave differently?',
        ],
        research: [
          'How do we derive Fresnel equations from boundary conditions?',
          'What happens at total internal reflection?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/fresnel', labelKey: 'common.viewDemo' },
      ],
    },
    {
      id: 'brewster',
      titleKey: 'worldCourse.lessons.brewster.title',
      titleZhKey: 'worldCourse.lessons.brewster.titleZh',
      descriptionKey: 'worldCourse.lessons.brewster.description',
      demoId: 'brewster',
      objectives: [
        'Find and explain Brewsters angle',
        'Apply Brewsters angle in practical situations',
      ],
      estimatedMinutes: 25,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'Why is reflected light from water polarized?',
          'How do polarized sunglasses reduce glare?',
        ],
        application: [
          'At what angle is reflected light completely polarized?',
          'How can we use this for laser windows?',
        ],
        research: [
          'How does Brewsters angle relate to complex refractive indices?',
          'What about anisotropic materials?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/brewster', labelKey: 'common.viewDemo' },
        { type: 'experiment', path: '/optical-studio?tab=experiments', labelKey: 'common.experiment' },
      ],
    },
  ],
  relatedGames: [],
  relatedTools: ['/optical-studio'],
}

// Unit 3: 透明介质偏振特征 - Transparent Media
export const UNIT_3: UnitDefinition = {
  id: 'unit-3',
  number: 3,
  titleKey: 'worldCourse.units.unit3.title',
  titleZhKey: 'worldCourse.units.unit3.titleZh',
  subtitleKey: 'worldCourse.units.unit3.subtitle',
  descriptionKey: 'worldCourse.units.unit3.description',
  color: '#0891B2', // cyan-700
  icon: 'Sparkles',
  objectives: [
    'worldCourse.units.unit3.obj1',
    'worldCourse.units.unit3.obj2',
    'worldCourse.units.unit3.obj3',
  ],
  coreQuestion: 'worldCourse.units.unit3.coreQuestion',
  lessons: [
    {
      id: 'chromatic',
      titleKey: 'worldCourse.lessons.chromatic.title',
      titleZhKey: 'worldCourse.lessons.chromatic.titleZh',
      descriptionKey: 'worldCourse.lessons.chromatic.description',
      demoId: 'chromatic',
      objectives: [
        'Understand chromatic polarization colors',
        'Relate colors to sample thickness and birefringence',
      ],
      estimatedMinutes: 30,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'Why do stressed plastics show rainbow colors between polarizers?',
          'What creates the Michel-Levy color chart?',
        ],
        application: [
          'How can we measure stress from interference colors?',
          'What determines which color appears?',
        ],
        research: [
          'How do we model wavelength-dependent retardation?',
          'What about compensators for quantitative measurements?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/chromatic', labelKey: 'common.viewDemo' },
        { type: 'experiment', path: '/experiments/tape-art', labelKey: 'common.experiment' },
      ],
    },
    {
      id: 'optical-rotation',
      titleKey: 'worldCourse.lessons.opticalRotation.title',
      titleZhKey: 'worldCourse.lessons.opticalRotation.titleZh',
      descriptionKey: 'worldCourse.lessons.opticalRotation.description',
      demoId: 'optical-rotation',
      objectives: [
        'Understand optical activity and chirality',
        'Measure sugar concentration with polarimetry',
      ],
      estimatedMinutes: 25,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'Why does sugar solution rotate polarization?',
          'What is chirality?',
        ],
        application: [
          'How can we measure sugar concentration?',
          'What is specific rotation?',
        ],
        research: [
          'How is optical rotation related to molecular structure?',
          'What about circular dichroism?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/optical-rotation', labelKey: 'common.viewDemo' },
        { type: 'experiment', path: '/experiments/sugar', labelKey: 'common.experiment' },
      ],
    },
    {
      id: 'anisotropy',
      titleKey: 'worldCourse.lessons.anisotropy.title',
      titleZhKey: 'worldCourse.lessons.anisotropy.titleZh',
      descriptionKey: 'worldCourse.lessons.anisotropy.description',
      demoId: 'anisotropy',
      objectives: [
        'Understand stress-induced birefringence',
        'Analyze photoelastic stress patterns',
      ],
      estimatedMinutes: 25,
      difficulties: ['application', 'research'],
      guidingQuestions: {
        foundation: [],
        application: [
          'How does stress create birefringence?',
          'What do the fringe patterns tell us?',
        ],
        research: [
          'How do we quantitatively relate stress to birefringence?',
          'What are the stress-optic coefficients?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/anisotropy', labelKey: 'common.viewDemo' },
      ],
    },
  ],
  relatedGames: ['/games/2d?level=3'],
  relatedTools: ['/optical-studio'],
}

// Unit 4: 浑浊介质偏振特征 - Turbid Media
export const UNIT_4: UnitDefinition = {
  id: 'unit-4',
  number: 4,
  titleKey: 'worldCourse.units.unit4.title',
  titleZhKey: 'worldCourse.units.unit4.titleZh',
  subtitleKey: 'worldCourse.units.unit4.subtitle',
  descriptionKey: 'worldCourse.units.unit4.description',
  color: '#F59E0B', // amber-500
  icon: 'Target',
  objectives: [
    'worldCourse.units.unit4.obj1',
    'worldCourse.units.unit4.obj2',
    'worldCourse.units.unit4.obj3',
  ],
  coreQuestion: 'worldCourse.units.unit4.coreQuestion',
  lessons: [
    {
      id: 'rayleigh',
      titleKey: 'worldCourse.lessons.rayleigh.title',
      titleZhKey: 'worldCourse.lessons.rayleigh.titleZh',
      descriptionKey: 'worldCourse.lessons.rayleigh.description',
      demoId: 'rayleigh',
      objectives: [
        'Explain why the sky is blue',
        'Understand Rayleigh scattering wavelength dependence',
      ],
      estimatedMinutes: 25,
      difficulties: ['foundation', 'application', 'research'],
      guidingQuestions: {
        foundation: [
          'Why is the sky blue but sunsets are red?',
          'Why are clouds white?',
        ],
        application: [
          'How does scattering intensity depend on wavelength?',
          'What about the polarization of scattered light?',
        ],
        research: [
          'How do we derive the Rayleigh scattering formula?',
          'What are the limits of the small particle approximation?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/rayleigh', labelKey: 'common.viewDemo' },
      ],
    },
    {
      id: 'mie-scattering',
      titleKey: 'worldCourse.lessons.mieScattering.title',
      titleZhKey: 'worldCourse.lessons.mieScattering.titleZh',
      descriptionKey: 'worldCourse.lessons.mieScattering.description',
      demoId: 'mie-scattering',
      objectives: [
        'Understand Mie scattering for larger particles',
        'Explain why clouds are white',
      ],
      estimatedMinutes: 30,
      difficulties: ['application', 'research'],
      guidingQuestions: {
        foundation: [],
        application: [
          'How does particle size affect scattering patterns?',
          'What creates the forward scattering peak?',
        ],
        research: [
          'How do we solve the Mie equations?',
          'What about non-spherical particles?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/mie-scattering', labelKey: 'common.viewDemo' },
      ],
    },
    {
      id: 'monte-carlo',
      titleKey: 'worldCourse.lessons.monteCarlo.title',
      titleZhKey: 'worldCourse.lessons.monteCarlo.titleZh',
      descriptionKey: 'worldCourse.lessons.monteCarlo.description',
      demoId: 'monte-carlo-scattering',
      objectives: [
        'Simulate light propagation in turbid media',
        'Understand multiple scattering effects',
      ],
      estimatedMinutes: 35,
      difficulties: ['research'],
      guidingQuestions: {
        foundation: [],
        application: [],
        research: [
          'How do we model multiple scattering statistically?',
          'What are the key parameters in MC simulation?',
          'How do we extract optical properties from measurements?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/monte-carlo-scattering', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/lab', labelKey: 'common.useLab' },
      ],
    },
  ],
  relatedGames: [],
  relatedTools: ['/lab'],
}

// Unit 5: 全偏振光学技术 - Full Polarimetry
export const UNIT_5: UnitDefinition = {
  id: 'unit-5',
  number: 5,
  titleKey: 'worldCourse.units.unit5.title',
  titleZhKey: 'worldCourse.units.unit5.titleZh',
  subtitleKey: 'worldCourse.units.unit5.subtitle',
  descriptionKey: 'worldCourse.units.unit5.description',
  color: '#8B5CF6', // violet
  icon: 'Telescope',
  objectives: [
    'worldCourse.units.unit5.obj1',
    'worldCourse.units.unit5.obj2',
    'worldCourse.units.unit5.obj3',
    'worldCourse.units.unit5.obj4',
  ],
  coreQuestion: 'worldCourse.units.unit5.coreQuestion',
  lessons: [
    {
      id: 'stokes',
      titleKey: 'worldCourse.lessons.stokes.title',
      titleZhKey: 'worldCourse.lessons.stokes.titleZh',
      descriptionKey: 'worldCourse.lessons.stokes.description',
      demoId: 'stokes',
      objectives: [
        'Understand Stokes vector representation',
        'Measure polarization state with Stokes parameters',
      ],
      estimatedMinutes: 30,
      difficulties: ['application', 'research'],
      guidingQuestions: {
        foundation: [],
        application: [
          'What do the four Stokes parameters represent?',
          'How do we measure them experimentally?',
        ],
        research: [
          'What is the degree of polarization?',
          'How do we handle partially polarized light?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/stokes', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/calc/stokes', labelKey: 'common.useTool' },
      ],
    },
    {
      id: 'mueller',
      titleKey: 'worldCourse.lessons.mueller.title',
      titleZhKey: 'worldCourse.lessons.mueller.titleZh',
      descriptionKey: 'worldCourse.lessons.mueller.description',
      demoId: 'mueller',
      objectives: [
        'Understand Mueller matrix representation',
        'Characterize optical elements with Mueller matrices',
      ],
      estimatedMinutes: 35,
      difficulties: ['application', 'research'],
      guidingQuestions: {
        foundation: [],
        application: [
          'What is a Mueller matrix?',
          'What are the Mueller matrices of common elements?',
        ],
        research: [
          'How do we decompose a Mueller matrix?',
          'What physical properties can we extract?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/mueller', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/calc/mueller', labelKey: 'common.useTool' },
      ],
    },
    {
      id: 'jones',
      titleKey: 'worldCourse.lessons.jones.title',
      titleZhKey: 'worldCourse.lessons.jones.titleZh',
      descriptionKey: 'worldCourse.lessons.jones.description',
      demoId: 'jones',
      objectives: [
        'Use Jones calculus for polarized light',
        'Calculate polarization transformation through optical systems',
      ],
      estimatedMinutes: 30,
      difficulties: ['application', 'research'],
      guidingQuestions: {
        foundation: [],
        application: [
          'What is a Jones vector?',
          'How do we multiply Jones matrices?',
        ],
        research: [
          'When is Jones calculus sufficient vs Mueller?',
          'What about non-normal incidence?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/jones', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/calc/jones', labelKey: 'common.useTool' },
      ],
    },
    {
      id: 'polarimetric-microscopy',
      titleKey: 'worldCourse.lessons.polarimetricMicroscopy.title',
      titleZhKey: 'worldCourse.lessons.polarimetricMicroscopy.titleZh',
      descriptionKey: 'worldCourse.lessons.polarimetricMicroscopy.description',
      demoId: 'polarimetric-microscopy',
      objectives: [
        'Understand polarimetric imaging techniques',
        'Apply polarimetry to biomedical and materials science',
      ],
      estimatedMinutes: 40,
      difficulties: ['research'],
      guidingQuestions: {
        foundation: [],
        application: [],
        research: [
          'How do we build a polarimetric microscope?',
          'What information can we extract from tissues?',
          'What are the clinical applications?',
        ],
      },
      resources: [
        { type: 'demo', path: '/demos/polarimetric-microscopy', labelKey: 'common.viewDemo' },
        { type: 'tool', path: '/lab', labelKey: 'common.useLab' },
      ],
    },
  ],
  relatedGames: [],
  relatedTools: ['/calc/stokes', '/calc/mueller', '/calc/jones', '/calc/poincare', '/lab'],
}

// 导出所有单元
export const COURSE_UNITS: UnitDefinition[] = [
  UNIT_0,
  UNIT_1,
  UNIT_2,
  UNIT_3,
  UNIT_4,
  UNIT_5,
]

// 辅助函数：根据 ID 获取单元
export function getUnitById(unitId: string): UnitDefinition | undefined {
  return COURSE_UNITS.find(unit => unit.id === unitId)
}

// 辅助函数：根据编号获取单元
export function getUnitByNumber(number: number): UnitDefinition | undefined {
  return COURSE_UNITS.find(unit => unit.number === number)
}

// 辅助函数：根据课时 ID 获取课时
export function getLessonById(lessonId: string): { unit: UnitDefinition; lesson: LessonDefinition } | undefined {
  for (const unit of COURSE_UNITS) {
    const lesson = unit.lessons.find(l => l.id === lessonId)
    if (lesson) {
      return { unit, lesson }
    }
  }
  return undefined
}

// 辅助函数：获取所有课时
export function getAllLessons(): { unit: UnitDefinition; lesson: LessonDefinition }[] {
  return COURSE_UNITS.flatMap(unit =>
    unit.lessons.map(lesson => ({ unit, lesson }))
  )
}

// 辅助函数：获取特定难度级别的课时
export function getLessonsByDifficulty(difficulty: DifficultyLevel): { unit: UnitDefinition; lesson: LessonDefinition }[] {
  return getAllLessons().filter(({ lesson }) =>
    lesson.difficulties.includes(difficulty)
  )
}
