/**
 * Light Path Configurations for UC2 Polarization System
 * 三套典型光路配置
 */

import type { LightPathConfiguration } from '../types'

export const LIGHT_PATH_CONFIGURATIONS: LightPathConfiguration[] = [
  // ===== Configuration 1: Basic Crossed Polarizers =====
  {
    id: 'basic-crossed',
    name: 'Basic Crossed Polarizers',
    nameZh: '基础正交偏振配置',
    description: 'Classic setup demonstrating polarization and extinction. The foundation of all polarimetry.',
    descriptionZh: '经典配置，演示偏振和消光现象。所有偏振测量的基础。',
    difficulty: 'basic',
    modules: ['led-white', 'polarizer-linear', 'sample-holder', 'polarizer-analyzer'],
    learningObjectives: [
      'Understand linear polarization',
      'Observe extinction at 90° crossing',
      'Verify Malus\'s Law: I = I₀cos²θ'
    ],
    learningObjectivesZh: [
      '理解线偏振原理',
      '观察90°正交消光现象',
      '验证马吕斯定律：I = I₀cos²θ'
    ],
    steps: [
      {
        order: 1,
        moduleId: 'led-white',
        action: 'Place white LED as light source',
        actionZh: '放置白光LED作为光源',
        notes: 'Ensure diffuser is attached for uniform illumination',
        notesZh: '确保安装漫射片以获得均匀照明'
      },
      {
        order: 2,
        moduleId: 'polarizer-linear',
        action: 'Add first polarizer (Polarizer)',
        actionZh: '添加第一片偏振片（起偏器）',
        notes: 'Set to 0° reference position',
        notesZh: '设置为0°参考位置'
      },
      {
        order: 3,
        moduleId: 'sample-holder',
        action: 'Insert sample holder (empty for baseline)',
        actionZh: '插入样品夹持器（空置作为基准）',
        notes: 'This is where samples will be placed for analysis',
        notesZh: '这是放置样品进行分析的位置'
      },
      {
        order: 4,
        moduleId: 'polarizer-analyzer',
        action: 'Add second polarizer (Analyzer)',
        actionZh: '添加第二片偏振片（检偏器）',
        notes: 'Rotate slowly from 0° to 90° to observe extinction',
        notesZh: '从0°缓慢旋转至90°，观察消光现象'
      }
    ]
  },

  // ===== Configuration 2: Colorful Birefringence =====
  {
    id: 'compensator-color',
    name: 'Compensator Colorful Display',
    nameZh: '补偿片彩色显示配置',
    description: 'Beautiful interference colors from birefringent samples. Art meets science.',
    descriptionZh: '双折射样品产生的美丽干涉色彩。科学与艺术的结合。',
    difficulty: 'intermediate',
    modules: ['led-white', 'polarizer-linear', 'sample-cellophane', 'waveplate-quarter', 'polarizer-analyzer'],
    learningObjectives: [
      'Observe interference colors',
      'Understand optical path difference',
      'Relate color to retardation (Michel-Lévy chart)',
      'Create polarization art'
    ],
    learningObjectivesZh: [
      '观察干涉色彩',
      '理解光程差概念',
      '建立颜色与相位延迟的对应关系（米歇尔-勒维图）',
      '创作偏振艺术'
    ],
    steps: [
      {
        order: 1,
        moduleId: 'led-white',
        action: 'Place white LED light source',
        actionZh: '放置白光LED光源',
        notes: 'Full spectrum white light needed for color display',
        notesZh: '需要全光谱白光来显示颜色'
      },
      {
        order: 2,
        moduleId: 'polarizer-linear',
        action: 'Add polarizer at 45° orientation',
        actionZh: '添加偏振片，设置为45°方向',
        notes: '45° gives best color contrast',
        notesZh: '45°可获得最佳颜色对比'
      },
      {
        order: 3,
        moduleId: 'sample-cellophane',
        action: 'Layer cellophane sheets at various angles',
        actionZh: '将玻璃纸以不同角度叠放',
        notes: 'Experiment with 1, 2, 3+ layers for color mixing',
        notesZh: '尝试1、2、3+层叠放，探索颜色混合'
      },
      {
        order: 4,
        moduleId: 'waveplate-quarter',
        action: 'Optionally add λ/4 plate for enhanced colors',
        actionZh: '可选添加λ/4波片增强颜色',
        notes: 'Converts to circular polarization for different effects',
        notesZh: '转换为圆偏振可产生不同效果'
      },
      {
        order: 5,
        moduleId: 'polarizer-analyzer',
        action: 'Rotate analyzer to explore color changes',
        actionZh: '旋转检偏器探索颜色变化',
        notes: 'Each 15° rotation shifts the color spectrum',
        notesZh: '每旋转15°，颜色光谱会发生变化'
      }
    ]
  },

  // ===== Configuration 3: Quantitative Polarimetry Scan =====
  {
    id: 'quantitative-scan',
    name: 'Quantitative Angle Scanning',
    nameZh: '定量角度扫描配置',
    description: 'Automated polarimetry with motorized rotation and camera capture for precise measurements.',
    descriptionZh: '使用电动旋转和相机采集的自动偏振测量，实现精确定量分析。',
    difficulty: 'advanced',
    modules: [
      'led-white',
      'polarizer-linear',
      'rotation-stage-motorized',
      'sample-holder',
      'polarizer-analyzer',
      'camera-module',
      'controller-esp32'
    ],
    learningObjectives: [
      'Perform quantitative polarimetry',
      'Understand Stokes parameters measurement',
      'Learn automated data acquisition',
      'Analyze polarization state mathematically'
    ],
    learningObjectivesZh: [
      '进行定量偏振测量',
      '理解斯托克斯参数测量',
      '学习自动化数据采集',
      '数学分析偏振态'
    ],
    steps: [
      {
        order: 1,
        moduleId: 'led-white',
        action: 'Set up stabilized light source',
        actionZh: '设置稳定光源',
        notes: 'Allow 5 min warm-up for intensity stability',
        notesZh: '预热5分钟以确保强度稳定'
      },
      {
        order: 2,
        moduleId: 'polarizer-linear',
        action: 'Fix polarizer at reference orientation',
        actionZh: '将起偏器固定在参考方向',
        notes: 'Use laser alignment for precise 0° reference',
        notesZh: '使用激光对准确定精确的0°参考'
      },
      {
        order: 3,
        moduleId: 'rotation-stage-motorized',
        action: 'Mount sample on motorized rotation stage',
        actionZh: '将样品安装在电动旋转台上',
        notes: 'Ensure sample is centered on rotation axis',
        notesZh: '确保样品在旋转轴心上居中'
      },
      {
        order: 4,
        moduleId: 'sample-holder',
        action: 'Secure sample in holder',
        actionZh: '将样品固定在夹持器中',
        notes: 'Sample should be flat and perpendicular to beam',
        notesZh: '样品应平整并垂直于光束'
      },
      {
        order: 5,
        moduleId: 'polarizer-analyzer',
        action: 'Mount analyzer on second rotation stage',
        actionZh: '将检偏器安装在第二个旋转台上',
        notes: 'For rotating analyzer method',
        notesZh: '用于旋转检偏器测量法'
      },
      {
        order: 6,
        moduleId: 'camera-module',
        action: 'Position camera for image capture',
        actionZh: '定位相机进行图像采集',
        notes: 'Set exposure manually for consistent measurements',
        notesZh: '手动设置曝光以确保测量一致性'
      },
      {
        order: 7,
        moduleId: 'controller-esp32',
        action: 'Connect ESP32 and run scanning program',
        actionZh: '连接ESP32并运行扫描程序',
        notes: 'Typical scan: 0-360° in 5° steps = 73 images',
        notesZh: '典型扫描：0-360°，每5°一步，共73张图像'
      }
    ]
  }
]

// Helper function to get configuration by ID
export function getConfigurationById(id: string): LightPathConfiguration | undefined {
  return LIGHT_PATH_CONFIGURATIONS.find(c => c.id === id)
}

// Difficulty labels
export const CONFIGURATION_DIFFICULTY = {
  basic: { label: 'Basic', labelZh: '基础', color: 'green' },
  intermediate: { label: 'Intermediate', labelZh: '进阶', color: 'yellow' },
  advanced: { label: 'Advanced', labelZh: '高级', color: 'red' }
}
