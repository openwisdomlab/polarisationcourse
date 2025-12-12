/**
 * UC2 Hardware Modules Data
 * 基于 UC2 开源框架的偏振光硬件模块
 * https://github.com/openUC2/UC2-GIT
 */

import type { UC2Module } from '../types'

export const UC2_MODULES: UC2Module[] = [
  // ===== 核心模块 Core Modules =====
  {
    id: 'uc2-baseplate',
    name: 'UC2 Baseplate (4x4)',
    nameZh: 'UC2 基板 (4x4)',
    category: 'core',
    description: 'The foundation of UC2 system. 4x4 grid for modular optical setups with magnetic mounting.',
    descriptionZh: 'UC2系统的基础。4x4网格设计，支持磁性安装的模块化光学平台。',
    specifications: {
      dimensions: '100mm x 100mm x 8mm',
      material: '3D打印PLA/注塑ABS',
      gridSize: '4x4 (50mm间距)',
      mounting: '磁性球座'
    },
    compatibleWith: ['all'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'uc2-cube',
    name: 'UC2 Cube Shell',
    nameZh: 'UC2 立方体外壳',
    category: 'core',
    description: 'Universal 50mm cube housing for all optical inserts. Features snap-fit design.',
    descriptionZh: '通用50mm立方体外壳，可容纳所有光学插件。采用卡扣式设计。',
    specifications: {
      dimensions: '50mm x 50mm x 50mm',
      material: '3D打印PLA',
      aperture: '直径25mm',
      mounting: '磁性底座兼容'
    },
    compatibleWith: ['uc2-baseplate'],
    difficulty: 'beginner',
    imageType: 'generated'
  },

  // ===== 光学模块 Optical Modules =====
  {
    id: 'polarizer-linear',
    name: 'Linear Polarizer Insert',
    nameZh: '线偏振片模块',
    category: 'optical',
    description: 'High-quality linear polarizer film in rotating mount. Essential for polarization experiments.',
    descriptionZh: '高质量线偏振片，带旋转安装座。偏振实验的核心元件。',
    specifications: {
      dimensions: '25mm 直径',
      extinction: '>1000:1',
      transmission: '>42%',
      wavelengthRange: '400-700nm',
      rotationRange: '360° 连续可调'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'beginner',
    safetyNotes: 'Handle by edges. Avoid fingerprints on optical surface.',
    safetyNotesZh: '请握住边缘操作，避免在光学表面留下指纹。',
    imageType: 'generated'
  },
  {
    id: 'polarizer-analyzer',
    name: 'Analyzer (Crossed Polarizer)',
    nameZh: '检偏器模块',
    category: 'optical',
    description: 'Second polarizer for analyzing polarization state. Marked graduation for angle reading.',
    descriptionZh: '用于分析偏振态的第二偏振片。带刻度标记便于读取角度。',
    specifications: {
      dimensions: '25mm 直径',
      graduation: '5° 刻度',
      material: '偏振膜+亚克力框架'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'waveplate-quarter',
    name: 'Quarter Wave Plate (λ/4)',
    nameZh: 'λ/4 波片',
    category: 'optical',
    description: 'Retardation plate for converting linear to circular polarization. 550nm design wavelength.',
    descriptionZh: '相位延迟片，可将线偏振转换为圆偏振。设计波长550nm。',
    specifications: {
      retardation: 'λ/4 @ 550nm',
      material: '高分子膜',
      clearAperture: '20mm'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'intermediate',
    imageType: 'generated'
  },
  {
    id: 'waveplate-half',
    name: 'Half Wave Plate (λ/2)',
    nameZh: 'λ/2 波片',
    category: 'optical',
    description: 'Rotates polarization direction. Used for polarization manipulation.',
    descriptionZh: '用于旋转偏振方向的半波片。',
    specifications: {
      retardation: 'λ/2 @ 550nm',
      material: '高分子膜',
      clearAperture: '20mm'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'intermediate',
    imageType: 'generated'
  },
  {
    id: 'calcite-crystal',
    name: 'Calcite Birefringent Crystal',
    nameZh: '方解石双折射晶体',
    category: 'optical',
    description: 'Natural calcite crystal demonstrating birefringence. Splits light into o-ray and e-ray.',
    descriptionZh: '天然方解石晶体，展示双折射现象。将光分成o光和e光。',
    specifications: {
      dimensions: '20mm x 20mm x 10mm',
      birefringence: 'Δn = 0.172',
      material: '天然方解石 CaCO₃'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'intermediate',
    safetyNotes: 'Fragile crystal. Handle with care.',
    safetyNotesZh: '晶体易碎，请小心操作。',
    imageType: 'generated'
  },
  {
    id: 'compensator-babinet',
    name: 'Babinet-Soleil Compensator',
    nameZh: '巴比内-索列尔补偿器',
    category: 'optical',
    description: 'Variable retardation compensator for quantitative polarimetry.',
    descriptionZh: '可变相位延迟补偿器，用于定量偏振测量。',
    specifications: {
      retardationRange: '0-3λ',
      resolution: '0.01λ',
      wavelengthRange: '400-700nm'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'advanced',
    imageType: 'generated'
  },

  // ===== 机械模块 Mechanical Modules =====
  {
    id: 'rotation-stage-manual',
    name: 'Manual Rotation Stage',
    nameZh: '手动旋转台',
    category: 'mechanical',
    description: 'Precision rotation stage with 1° resolution. For sample and optical element rotation.',
    descriptionZh: '精密旋转台，分辨率1°。用于样品和光学元件旋转。',
    specifications: {
      rotationRange: '360° 连续',
      resolution: '1°',
      loadCapacity: '100g'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'rotation-stage-motorized',
    name: 'Motorized Rotation Stage',
    nameZh: '电动旋转台',
    category: 'mechanical',
    description: 'Stepper motor driven rotation for automated scanning. ESP32 controlled.',
    descriptionZh: '步进电机驱动的旋转台，用于自动扫描。ESP32控制。',
    specifications: {
      rotationRange: '360° 连续',
      resolution: '0.1°',
      motor: '28BYJ-48 步进电机',
      controller: 'ESP32'
    },
    compatibleWith: ['uc2-cube', 'controller-esp32'],
    difficulty: 'advanced',
    imageType: 'generated'
  },
  {
    id: 'sample-holder',
    name: 'Sample Holder Insert',
    nameZh: '样品夹持器',
    category: 'mechanical',
    description: 'Universal holder for thin samples, slides, and films.',
    descriptionZh: '通用夹持器，可固定薄片样品、载玻片和薄膜。',
    specifications: {
      aperture: '20mm x 20mm',
      thickness: '最大5mm',
      material: '3D打印PLA'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'beginner',
    imageType: 'generated'
  },

  // ===== 电子模块 Electronic Modules =====
  {
    id: 'led-white',
    name: 'White LED Light Source',
    nameZh: '白光LED光源',
    category: 'electronic',
    description: 'High-brightness white LED with diffuser. USB powered, adjustable brightness.',
    descriptionZh: '高亮度白光LED，带漫射片。USB供电，亮度可调。',
    specifications: {
      power: '3W',
      colorTemp: '5600K',
      dimming: 'PWM 0-100%',
      connector: 'USB-C'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'led-rgb',
    name: 'RGB LED Light Source',
    nameZh: 'RGB LED光源',
    category: 'electronic',
    description: 'Programmable RGB LED for wavelength selection experiments.',
    descriptionZh: '可编程RGB LED，用于波长选择实验。',
    specifications: {
      wavelengths: 'R:625nm G:520nm B:465nm',
      control: 'ESP32 PWM',
      power: '1W per channel'
    },
    compatibleWith: ['uc2-cube', 'controller-esp32'],
    difficulty: 'intermediate',
    imageType: 'generated'
  },
  {
    id: 'laser-pointer',
    name: 'Laser Diode Module',
    nameZh: '激光二极管模块',
    category: 'electronic',
    description: 'Class 2 laser for beam experiments. 650nm red, collimated output.',
    descriptionZh: '二类激光器，用于光束实验。650nm红光，准直输出。',
    specifications: {
      wavelength: '650nm',
      power: '<1mW (Class 2)',
      beamDiameter: '3mm'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'intermediate',
    safetyNotes: 'Class 2 Laser. Do not stare into beam.',
    safetyNotesZh: '二类激光，请勿直视光束。',
    imageType: 'generated'
  },
  {
    id: 'camera-module',
    name: 'Camera Module (USB)',
    nameZh: 'USB相机模块',
    category: 'electronic',
    description: 'USB camera for image capture and live viewing. Compatible with microscopy software.',
    descriptionZh: 'USB相机，用于图像采集和实时预览。兼容显微镜软件。',
    specifications: {
      resolution: '5MP (2592x1944)',
      sensor: '1/2.5" CMOS',
      interface: 'USB 2.0',
      frameRate: '30fps @ 1080p'
    },
    compatibleWith: ['uc2-cube'],
    difficulty: 'intermediate',
    imageType: 'generated'
  },
  {
    id: 'controller-esp32',
    name: 'ESP32 Controller Board',
    nameZh: 'ESP32控制板',
    category: 'electronic',
    description: 'Central controller for motorized components. WiFi/Bluetooth enabled.',
    descriptionZh: '电动元件的中央控制器。支持WiFi/蓝牙。',
    specifications: {
      processor: 'ESP32-WROOM-32',
      gpio: '30+ 引脚',
      wireless: 'WiFi + Bluetooth',
      power: '5V USB'
    },
    compatibleWith: ['rotation-stage-motorized', 'led-rgb'],
    difficulty: 'advanced',
    imageType: 'generated'
  },

  // ===== PolarCraft@UC2 偏振实验模块 =====
  // 专为教学游戏化设计的偏振显微成像模块
  {
    id: 'pol-illum',
    name: 'POL-Illum (Polarizer Cube)',
    nameZh: 'POL-Illum 起偏器立方',
    category: 'optical',
    description: 'Illumination path polarizer cube with rotating mount. Converts natural light to linearly polarized light. Features removable ring frame with 0-180° graduation.',
    descriptionZh: '照明光路起偏器立方，带旋转安装座。将自然光转换为线偏振光。采用可拔插环形框架，配有0-180°刻度环。',
    specifications: {
      extinction: '≥500:1（建议更高）',
      dimensions: '适配UC2 50mm系统',
      rotationRange: '0-180° 连续可调',
      mounting: '可拔插环形框架'
    },
    compatibleWith: ['uc2-cube', 'pol-analy'],
    difficulty: 'beginner',
    safetyNotes: 'Handle polarizer film by edges only.',
    safetyNotesZh: '仅握住偏振片边缘操作。',
    imageType: 'generated'
  },
  {
    id: 'pol-analy',
    name: 'POL-Analy (Analyzer Cube)',
    nameZh: 'POL-Analy 检偏器立方',
    category: 'optical',
    description: 'Imaging path analyzer cube for analyzing polarization state after sample. Features 90° alignment mark and repeatable positioning structure (snap-fit/locating holes).',
    descriptionZh: '成像端检偏器立方，用于分析透过样品后的偏振状态。带90°对位标记和可重复定位结构（卡扣/定位孔）。',
    specifications: {
      extinction: '≥500:1',
      alignment: '90° 对位标记',
      positioning: '卡扣/定位孔',
      mounting: '可独立旋转'
    },
    compatibleWith: ['uc2-cube', 'pol-illum'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'pol-stage',
    name: 'POL-Stage (Rotating Sample Stage)',
    nameZh: 'POL-Stage 旋转载物台',
    category: 'mechanical',
    description: '360° graduated rotation stage supporting quick sample box exchange. Can be upgraded with motor drive for automated scanning. Recommended: build angle/direction intuition with manual scale first.',
    descriptionZh: '0-360°刻度旋转载物台，支持快速换"神秘样品盒"。可后续升级电机驱动用于扫描。建议先用手动刻度建立"角度/方向"的直觉，再引入电机自动扫描。',
    specifications: {
      rotationRange: '0-360° 连续',
      graduation: '1° 刻度',
      sampleMount: '快速换样品盒设计',
      upgradeOption: '可升级电机驱动'
    },
    compatibleWith: ['uc2-cube', 'pol-rotator'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'pol-slider',
    name: 'POL-Slider (Compensator Slider)',
    nameZh: 'POL-Slider 补偿片滑块',
    category: 'optical',
    description: 'Multi-slot slider for inserting compensators like cellophane, tape layers, or mica sheets. Creates interference colors and reveals "hidden patterns". DIY material retardation varies with wavelength/thickness.',
    descriptionZh: '多槽位滑块，可插入玻璃纸、胶带叠层、云母片等补偿材料，产生干涉色与"解密图案"。注意：DIY材料的相位延迟随波长/厚度变化很大，教学上可以"现象优先"，定量上需标定。',
    specifications: {
      slots: '多槽位设计',
      materials: '玻璃纸/胶带叠层/云母片',
      effect: '产生干涉色彩',
      calibration: '定量测量需标定'
    },
    compatibleWith: ['uc2-cube', 'pol-illum', 'pol-analy'],
    difficulty: 'intermediate',
    imageType: 'generated'
  },
  {
    id: 'pol-rotator',
    name: 'POL-Rotator (Motorized Rotation Unit)',
    nameZh: 'POL-Rotator 电动旋转单元',
    category: 'electronic',
    description: 'Stepper motor + gear ring driven polarizer rotation unit. ESP32 controlled with serial/WiFi interface. Supports automated angle scanning for quantitative polarimetry.',
    descriptionZh: '步进电机+齿轮环驱动偏振片旋转，配合ESP32做角度扫描，支持串口/Wi-Fi控制。工程要点：回零（home）/限位、角度标定、机械回差补偿、稳定等待时间（settle time）。',
    specifications: {
      motor: '28BYJ-48 步进电机',
      driver: 'ULN2003驱动板',
      controller: 'ESP32 (串口/Wi-Fi)',
      features: '回零/限位/角度标定/回差补偿'
    },
    compatibleWith: ['uc2-cube', 'pol-stage', 'controller-esp32'],
    difficulty: 'advanced',
    imageType: 'generated'
  },

  // ===== 样品模块 Sample Modules =====
  {
    id: 'sample-stress-ruler',
    name: 'Stress Demonstration Ruler',
    nameZh: '应力演示尺',
    category: 'sample',
    description: 'Transparent ruler showing stress birefringence under polarized light.',
    descriptionZh: '透明尺，在偏振光下显示应力双折射图案。',
    specifications: {
      material: '聚碳酸酯/亚克力',
      dimensions: '150mm x 30mm'
    },
    compatibleWith: ['uc2-cube', 'sample-holder'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'sample-cellophane',
    name: 'Cellophane Sheet Set',
    nameZh: '玻璃纸套装',
    category: 'sample',
    description: 'Various cellophane sheets for retardation and color experiments.',
    descriptionZh: '各种玻璃纸片，用于相位延迟和彩色实验。',
    specifications: {
      quantity: '10片不同颜色',
      material: '纤维素薄膜'
    },
    compatibleWith: ['sample-holder'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'sample-mica',
    name: 'Mica Flakes',
    nameZh: '云母片',
    category: 'sample',
    description: 'Natural mica samples for birefringence observation.',
    descriptionZh: '天然云母样品，用于观察双折射现象。',
    specifications: {
      material: '天然白云母',
      quantity: '5-10片'
    },
    compatibleWith: ['sample-holder'],
    difficulty: 'beginner',
    imageType: 'generated'
  },
  {
    id: 'sample-sugar-solution',
    name: 'Sugar Solution Kit',
    nameZh: '糖溶液套装',
    category: 'sample',
    description: 'Materials for optical rotation experiment with sugar solutions.',
    descriptionZh: '用于糖溶液旋光实验的材料套装。',
    specifications: {
      includes: '测量管、蔗糖粉、量杯',
      tubeLength: '100mm'
    },
    compatibleWith: ['sample-holder'],
    difficulty: 'intermediate',
    imageType: 'generated'
  }
]

// Helper function to get module by ID
export function getModuleById(id: string): UC2Module | undefined {
  return UC2_MODULES.find(m => m.id === id)
}

// Helper function to filter modules by category
export function getModulesByCategory(category: UC2Module['category']): UC2Module[] {
  return UC2_MODULES.filter(m => m.category === category)
}

// Category labels for display
export const MODULE_CATEGORIES = {
  core: { label: 'Core Components', labelZh: '核心组件' },
  optical: { label: 'Optical Elements', labelZh: '光学元件' },
  mechanical: { label: 'Mechanical Parts', labelZh: '机械部件' },
  electronic: { label: 'Electronic Modules', labelZh: '电子模块' },
  sample: { label: 'Sample Materials', labelZh: '样品材料' }
}
