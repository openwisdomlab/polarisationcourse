/**
 * Light Path Configurations for UC2 Polarization System
 * 三套典型光路配置
 */

import type { LightPathConfiguration } from '../types'

// ===== PolarCraft@UC2 Game-based Learning Levels =====
// 偏振光机关实验室 - 四个递进关卡

const POLARCRAFT_LEVEL_CONFIGS: LightPathConfiguration[] = [
  // Level 1: 光之消失术
  {
    id: 'polarcraft-level-1',
    name: 'Level 1: Light Disappearing Act',
    nameZh: 'Level 1: 光之消失术',
    description: 'Find the combination to make the screen go dark. Only when the screen is nearly black will the mechanism unlock. Understand orthogonal polarization and extinction phenomenon.',
    descriptionZh: '找到让屏幕"变黑"的组合。只有当屏幕接近全黑，机关才会解锁。理解正交偏振与消光现象。',
    difficulty: 'basic',
    modules: ['led-white', 'pol-illum', 'pol-analy'],
    learningObjectives: [
      'Understand natural light vs linearly polarized light',
      'Observe orthogonal extinction phenomenon',
      'Grasp the concept of transmission axis',
      'Build intuition for Malus\'s Law'
    ],
    learningObjectivesZh: [
      '理解自然光与线偏振光的区别',
      '观察正交消光现象',
      '掌握透光轴概念',
      '建立马吕斯定律的直觉理解'
    ],
    steps: [
      {
        order: 1,
        moduleId: 'led-white',
        action: 'Place white LED light source with diffuser',
        actionZh: '放置白光LED光源（配漫射片）',
        notes: 'Ensure uniform illumination for clear observation',
        notesZh: '确保均匀照明以便清晰观察'
      },
      {
        order: 2,
        moduleId: 'pol-illum',
        action: 'Add first polarizer - observe brightness change',
        actionZh: '添加第一片偏振片——观察亮度变化',
        notes: 'Single polarizer: brightness change is minimal',
        notesZh: '单偏振片：亮度变化不明显'
      },
      {
        order: 3,
        moduleId: 'pol-analy',
        action: 'Add second polarizer and rotate to find extinction',
        actionZh: '加入第二片偏振片，旋转寻找消光位置',
        notes: 'Rotate slowly, find the darkest position (≈90°)',
        notesZh: '缓慢旋转，找到最暗位置（≈90°）'
      },
      {
        order: 4,
        moduleId: 'pol-analy',
        action: 'System threshold detection and unlock',
        actionZh: '系统阈值判定并解锁',
        notes: 'Camera detects darkness level, mechanism unlocks when threshold is met',
        notesZh: '相机检测暗度，达到阈值时机关解锁'
      }
    ]
  },

  // Level 2: 隐藏的图案
  {
    id: 'polarcraft-level-2',
    name: 'Level 2: Hidden Patterns',
    nameZh: 'Level 2: 隐藏的图案',
    description: 'Transparent materials hold secrets visible only under the right polarization combination. Use birefringence and interference to reveal hidden colorful patterns and decode messages.',
    descriptionZh: '透明材料中的秘密只在正确偏振组合下显形。利用双折射和干涉现象让"无色物体"显现彩色图案，解码隐藏信息。',
    difficulty: 'intermediate',
    modules: ['led-white', 'pol-illum', 'pol-stage', 'pol-slider', 'pol-analy'],
    learningObjectives: [
      'Observe birefringence extinction cross patterns',
      'Understand interference colors and optical path difference',
      'Learn to use compensators to reveal hidden patterns',
      'Experience polarization art and encoding'
    ],
    learningObjectivesZh: [
      '观察双折射消光十字图案',
      '理解干涉色与光程差的关系',
      '学会使用补偿片显现隐藏图案',
      '体验偏振艺术与编码'
    ],
    steps: [
      {
        order: 1,
        moduleId: 'pol-illum',
        action: 'Set up crossed polarizers configuration',
        actionZh: '设置正交偏振配置',
        notes: 'Ensure orthogonal extinction as baseline',
        notesZh: '确保正交消光作为基准'
      },
      {
        order: 2,
        moduleId: 'pol-stage',
        action: 'Sub-task A: Insert crystal sample, rotate stage to observe extinction cross',
        actionZh: '子任务A：插入晶体样品，旋转载物台观察消光十字',
        notes: 'Record the main direction of the crystal structure',
        notesZh: '记录晶体结构的主方向'
      },
      {
        order: 3,
        moduleId: 'pol-slider',
        action: 'Sub-task B: Insert compensator (cellophane/tape layers)',
        actionZh: '子任务B：插入补偿片（玻璃纸/胶带叠层）',
        notes: 'Creates interference colors from birefringence',
        notesZh: '产生双折射干涉色彩'
      },
      {
        order: 4,
        moduleId: 'pol-analy',
        action: 'Adjust compensator angle to reveal hidden pattern (Logo/QR)',
        actionZh: '调整补偿片角度，让隐藏图案（Logo/QR）显现',
        notes: 'Read the decoded information from the revealed pattern',
        notesZh: '从显现的图案中读取解码信息'
      }
    ]
  },

  // Level 3: 方向密码破解
  {
    id: 'polarcraft-level-3',
    name: 'Level 3: Direction Code Breaking',
    nameZh: 'Level 3: 方向密码破解',
    description: 'Reverse engineer the "orientation" of each region from polarization sequences. Use automated scanning and image analysis to create orientation pseudo-color maps and decode direction-encoded passwords.',
    descriptionZh: '从偏振序列中反演每个区域的"取向"，才能读出密码。使用自动扫描与图像分析，生成方向伪彩色图，解读方向编码的密码。',
    difficulty: 'advanced',
    modules: ['led-white', 'pol-illum', 'pol-rotator', 'pol-stage', 'pol-analy', 'camera-module', 'controller-esp32'],
    learningObjectives: [
      'Perform automated angle scanning (0-180°)',
      'Learn image sequence acquisition and analysis',
      'Understand fitting/maximum method for orientation',
      'Create direction pseudo-color maps (Hue=direction, Value=intensity)'
    ],
    learningObjectivesZh: [
      '进行自动角度扫描（0-180°）',
      '学习图像序列采集与分析',
      '理解拟合/最大值法求取向',
      '生成方向伪彩色图（Hue=方向，Value=强度/偏振度）'
    ],
    steps: [
      {
        order: 1,
        moduleId: 'pol-rotator',
        action: 'Configure motorized rotation for angle scanning',
        actionZh: '配置电动旋转进行角度扫描',
        notes: 'Set scan range 0-180°, step size 10° (beginner) to 2° (advanced)',
        notesZh: '设置扫描范围0-180°，步长10°（入门）至2°（进阶）'
      },
      {
        order: 2,
        moduleId: 'camera-module',
        action: 'Acquire image sequence at each angle',
        actionZh: '在每个角度采集图像序列',
        notes: 'Use consistent exposure settings for all images',
        notesZh: '所有图像使用一致的曝光设置'
      },
      {
        order: 3,
        moduleId: 'controller-esp32',
        action: 'Run Python analysis script for orientation fitting',
        actionZh: '运行Python分析脚本进行取向拟合',
        notes: 'Uses maximum intensity method or sinusoidal fitting',
        notesZh: '使用最大强度法或正弦拟合'
      },
      {
        order: 4,
        moduleId: 'camera-module',
        action: 'Generate orientation pseudo-color map',
        actionZh: '生成方向伪彩色图',
        notes: 'Hue encodes direction (0-180°), Value encodes polarization degree',
        notesZh: 'Hue编码方向（0-180°），Value编码偏振度'
      },
      {
        order: 5,
        moduleId: 'pol-stage',
        action: 'Decode password from direction encoding',
        actionZh: '从方向编码中解读密码',
        notes: 'Use horizontal/vertical/45° as binary or delimiter codes',
        notesZh: '用水平/竖直/45°作为二进制或分隔符编码'
      }
    ]
  },

  // Level 4: 偏振情报分析官
  {
    id: 'polarcraft-level-4',
    name: 'Level 4: Polarization Intelligence Analyst',
    nameZh: 'Level 4: 偏振情报分析官',
    description: 'Conduct polarization scanning on unknown samples and produce a "structural interpretation report". Choose from medical/biology, materials/engineering, or information security directions.',
    descriptionZh: '对未知样品进行偏振扫描，输出"结构判读报告"。可选方向：医学/生物、材料/工程、信息安全。',
    difficulty: 'advanced',
    modules: ['led-white', 'pol-illum', 'pol-rotator', 'pol-stage', 'pol-slider', 'pol-analy', 'camera-module', 'controller-esp32'],
    learningObjectives: [
      'Design complete experimental workflow',
      'Select appropriate analysis metrics for different applications',
      'Produce professional structural interpretation report',
      'Connect to frontier research applications'
    ],
    learningObjectivesZh: [
      '设计完整的实验工作流程',
      '为不同应用选择合适的分析指标',
      '产出专业的结构判读报告',
      '连接前沿研究应用'
    ],
    steps: [
      {
        order: 1,
        moduleId: 'pol-stage',
        action: 'Choose research direction and unknown sample',
        actionZh: '选择研究方向和未知样品',
        notes: 'Options: fiber orientation (bio), stress concentration (material), polarization watermark (info security)',
        notesZh: '选项：纤维取向（生物）、应力集中（材料）、偏振水印（信息安全）'
      },
      {
        order: 2,
        moduleId: 'pol-rotator',
        action: 'Design and execute scanning protocol',
        actionZh: '设计并执行扫描方案',
        notes: 'Define scanning parameters based on sample characteristics',
        notesZh: '根据样品特征定义扫描参数'
      },
      {
        order: 3,
        moduleId: 'controller-esp32',
        action: 'Run analysis pipeline and extract features',
        actionZh: '运行分析流水线并提取特征',
        notes: 'Metrics: orientation consistency, stress distribution, visibility threshold',
        notesZh: '指标：取向一致性、应力分布、可见性阈值'
      },
      {
        order: 4,
        moduleId: 'camera-module',
        action: 'Produce structural interpretation report',
        actionZh: '产出结构判读报告',
        notes: 'One-page report: sample info, setup, results, inference, limitations, applications',
        notesZh: '一页报告：样品信息、实验设置、结果图、推断、局限性、应用建议'
      }
    ]
  }
]

// Combine all configurations
export const LIGHT_PATH_CONFIGURATIONS: LightPathConfiguration[] = [
  // Basic configurations
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
  },
  // PolarCraft@UC2 Game Levels
  ...POLARCRAFT_LEVEL_CONFIGS
]

// Helper function to get configuration by ID
export function getConfigurationById(id: string): LightPathConfiguration | undefined {
  return LIGHT_PATH_CONFIGURATIONS.find(c => c.id === id)
}

// Get PolarCraft levels only
export function getPolarCraftLevels(): LightPathConfiguration[] {
  return POLARCRAFT_LEVEL_CONFIGS
}

// Difficulty labels
export const CONFIGURATION_DIFFICULTY = {
  basic: { label: 'Basic', labelZh: '基础', color: 'green' },
  intermediate: { label: 'Intermediate', labelZh: '进阶', color: 'yellow' },
  advanced: { label: 'Advanced', labelZh: '高级', color: 'red' }
}
