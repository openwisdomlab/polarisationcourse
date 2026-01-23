/**
 * Optical Devices Catalog - 光学器件目录
 *
 * Comprehensive catalog of optical devices with specifications,
 * principles, and applications in both English and Chinese.
 */

import type { BenchComponentType } from '@/stores/opticalBenchStore'

export type DeviceCategory = 'polarizers' | 'waveplates' | 'splitters' | 'retarders' | 'analyzers' | 'modulators' | 'other'
export type DeviceDifficulty = 'basic' | 'intermediate' | 'advanced'

export interface DeviceSpecification {
  key: string
  valueEn: string
  valueZh: string
}

export interface Device {
  id: string
  nameEn: string
  nameZh: string
  category: DeviceCategory
  descriptionEn: string
  descriptionZh: string
  principleEn: string
  principleZh: string
  icon: string
  specifications?: DeviceSpecification[]
  applications?: { en: string[]; zh: string[] }
  mathFormula?: string
  relatedDevices?: string[]
  purchaseLinks?: { name: string; url: string }[]
  difficulty: DeviceDifficulty
  benchComponentType?: BenchComponentType
}

export interface DeviceCategoryConfig {
  id: DeviceCategory | 'all'
  labelEn: string
  labelZh: string
  icon: string
  description?: { en: string; zh: string }
}

// ============================================
// Device Categories Configuration
// ============================================

export const DEVICE_CATEGORIES: DeviceCategoryConfig[] = [
  {
    id: 'all',
    labelEn: 'All',
    labelZh: '全部',
    icon: 'Layers',
  },
  {
    id: 'polarizers',
    labelEn: 'Polarizers',
    labelZh: '偏振器',
    icon: 'Circle',
    description: {
      en: 'Devices that filter light by polarization state',
      zh: '按偏振态过滤光的器件',
    },
  },
  {
    id: 'waveplates',
    labelEn: 'Wave Plates',
    labelZh: '波片',
    icon: 'Layers',
    description: {
      en: 'Birefringent elements that introduce phase retardation',
      zh: '引入相位延迟的双折射元件',
    },
  },
  {
    id: 'splitters',
    labelEn: 'Splitters',
    labelZh: '分束器',
    icon: 'Triangle',
    description: {
      en: 'Devices that split light beams',
      zh: '分离光束的器件',
    },
  },
  {
    id: 'retarders',
    labelEn: 'Retarders',
    labelZh: '延迟器',
    icon: 'Disc',
    description: {
      en: 'Variable phase retardation elements',
      zh: '可变相位延迟元件',
    },
  },
  {
    id: 'analyzers',
    labelEn: 'Analyzers',
    labelZh: '检偏器',
    icon: 'Scan',
    description: {
      en: 'Polarization state analyzers and detectors',
      zh: '偏振态分析与检测器件',
    },
  },
  {
    id: 'modulators',
    labelEn: 'Modulators',
    labelZh: '调制器',
    icon: 'Activity',
    description: {
      en: 'Polarization state modulators',
      zh: '偏振态调制器件',
    },
  },
  {
    id: 'other',
    labelEn: 'Other',
    labelZh: '其他',
    icon: 'MoreHorizontal',
    description: {
      en: 'Other optical components',
      zh: '其他光学元件',
    },
  },
]

// ============================================
// Difficulty Configuration
// ============================================

export const DIFFICULTY_CONFIG = {
  basic: { labelEn: 'Basic', labelZh: '基础', color: 'green' as const },
  intermediate: { labelEn: 'Intermediate', labelZh: '进阶', color: 'yellow' as const },
  advanced: { labelEn: 'Advanced', labelZh: '高级', color: 'red' as const },
  easy: { labelEn: 'Easy', labelZh: '简单', color: 'green' as const },
  medium: { labelEn: 'Medium', labelZh: '中等', color: 'yellow' as const },
  hard: { labelEn: 'Hard', labelZh: '困难', color: 'red' as const },
  expert: { labelEn: 'Expert', labelZh: '专家', color: 'purple' as const },
}

// ============================================
// Device Catalog
// ============================================

export const DEVICES: Device[] = [
  // === Polarizers ===
  {
    id: 'linear-polarizer',
    nameEn: 'Linear Polarizer',
    nameZh: '线偏振片',
    category: 'polarizers',
    descriptionEn: 'Transmits light polarized along a single axis while absorbing orthogonal polarization.',
    descriptionZh: '透过沿单一轴偏振的光，同时吸收正交偏振方向的光。',
    principleEn: 'Uses dichroic materials (like stretched PVA with iodine) that selectively absorb light polarized perpendicular to the transmission axis.',
    principleZh: '使用二向色性材料（如碘染色的拉伸PVA），选择性吸收与透光轴垂直的偏振光。',
    icon: '◐',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 10,000:1', valueZh: '> 10,000:1' },
      { key: 'Transmission', valueEn: '38-42% (unpolarized)', valueZh: '38-42%（自然光）' },
      { key: 'Wavelength Range', valueEn: '$400-700 nm$', valueZh: '$400-700 nm$' },
    ],
    applications: {
      en: ['LCD displays', 'Photography filters', 'Glare reduction sunglasses', 'Optical instruments'],
      zh: ['LCD显示器', '摄影滤镜', '防眩光太阳镜', '光学仪器'],
    },
    mathFormula: "$I = I_{0} \\cos^{2}\\theta (Malus's Law)$",
    difficulty: 'basic',
    benchComponentType: 'polarizer',
    relatedDevices: ['circular-polarizer', 'wire-grid-polarizer'],
  },
  {
    id: 'circular-polarizer',
    nameEn: 'Circular Polarizer',
    nameZh: '圆偏振片',
    category: 'polarizers',
    descriptionEn: 'Converts unpolarized light to circularly polarized light using a linear polarizer and quarter-wave plate.',
    descriptionZh: '使用线偏振片和四分之一波片将自然光转换为圆偏振光。',
    principleEn: 'Combines a linear polarizer with a quarter-wave plate oriented at 45° to the transmission axis.',
    principleZh: '将线偏振片与45°取向的四分之一波片结合。',
    icon: '◉',
    specifications: [
      { key: 'Circularity', valueEn: '> 95%', valueZh: '> 95%' },
      { key: 'Transmission', valueEn: '35-40%', valueZh: '35-40%' },
      { key: 'Design Wavelength', valueEn: '550 nm (typical)', valueZh: '550 nm（典型）' },
    ],
    applications: {
      en: ['3D cinema glasses', 'Camera autofocus compatibility', 'Stress analysis', 'Quantum optics'],
      zh: ['3D电影眼镜', '相机自动对焦兼容', '应力分析', '量子光学'],
    },
    mathFormula: '$E = E_0\\frac{\\hat{x} ± i\\hat{y}}{\\sqrt{2}}$',
    difficulty: 'intermediate',
    benchComponentType: 'polarizer',
  },
  {
    id: 'wire-grid-polarizer',
    nameEn: 'Wire Grid Polarizer',
    nameZh: '金属线栅偏振器',
    category: 'polarizers',
    descriptionEn: 'Metallic wire array that reflects one polarization and transmits the orthogonal polarization.',
    descriptionZh: '金属线阵列，反射一种偏振方向的光，透射正交偏振方向的光。',
    principleEn: 'Sub-wavelength parallel metal wires act as a polarization-selective structure. E-field parallel to wires is absorbed/reflected.',
    principleZh: '亚波长平行金属线作为偏振选择性结构。与线平行的电场被吸收/反射。',
    icon: '≡',
    specifications: [
      { key: 'Wire Pitch', valueEn: '$< \\frac{\\lambda}{2}$', valueZh: '$< \\frac{\\lambda}{2}$' },
      { key: 'Extinction Ratio', valueEn: '> 1000:1 (IR)', valueZh: '> 1000:1（红外）' },
      { key: 'Damage Threshold', valueEn: 'High (metallic)', valueZh: '高（金属结构）' },
    ],
    applications: {
      en: ['Infrared polarimetry', 'High-power lasers', 'Thermal imaging', 'THz applications'],
      zh: ['红外偏振测量', '高功率激光器', '热成像', '太赫兹应用'],
    },
    difficulty: 'advanced',
    benchComponentType: 'polarizer',
  },
  {
    id: 'glan-thompson',
    nameEn: 'Glan-Thompson Prism',
    nameZh: '格兰-汤姆逊棱镜',
    category: 'polarizers',
    descriptionEn: 'High-performance polarizing prism with wide acceptance angle.',
    descriptionZh: '高性能偏振棱镜，具有宽接收角。',
    principleEn: 'Two calcite prisms cemented together. O-ray totally internally reflected at interface; e-ray transmitted.',
    principleZh: '两个方解石棱镜胶合。o光在界面全反射；e光透射。',
    icon: '◆',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Acceptance Angle', valueEn: '15-20°', valueZh: '15-20°' },
      { key: 'Material', valueEn: 'Calcite (CaCO₃)', valueZh: '方解石（CaCO₃）' },
    ],
    applications: {
      en: ['Precision polarimetry', 'Spectroscopy', 'Laser cavities', 'Research instruments'],
      zh: ['精密偏振测量', '光谱学', '激光腔', '科研仪器'],
    },
    mathFormula: '$n_o = 1.658, n_e = 1.486 @ 589nm$',
    difficulty: 'advanced',
    benchComponentType: 'polarizer',
  },
  {
    id: 'glan-laser',
    nameEn: 'Glan-Laser Polarizer',
    nameZh: '激光格兰棱镜',
    category: 'polarizers',
    descriptionEn: 'Air-spaced Glan prism designed for high-power laser applications.',
    descriptionZh: '空气间隔的格兰棱镜，专为高功率激光应用设计。',
    principleEn: 'Similar to Glan-Thompson but with air gap instead of cement. Higher damage threshold.',
    principleZh: '与格兰-汤姆逊类似，但使用空气间隙代替胶合。具有更高的损伤阈值。',
    icon: '◇',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Damage Threshold', valueEn: '> 10 J/cm²', valueZh: '> 10 J/cm²' },
      { key: 'Acceptance Angle', valueEn: '8-12°', valueZh: '8-12°' },
    ],
    applications: {
      en: ['High-power lasers', 'Pulsed laser systems', 'Industrial lasers'],
      zh: ['高功率激光器', '脉冲激光系统', '工业激光'],
    },
    difficulty: 'advanced',
    benchComponentType: 'polarizer',
  },
  {
    id: 'nicol-prism',
    nameEn: 'Nicol Prism',
    nameZh: '尼科尔棱镜',
    category: 'polarizers',
    descriptionEn: 'Classic birefringent polarizer made from calcite crystal, historically significant.',
    descriptionZh: '由方解石晶体制成的经典双折射偏振器，具有历史意义。',
    principleEn: 'Uses total internal reflection to eliminate ordinary ray while transmitting extraordinary ray.',
    principleZh: '利用全内反射消除寻常光，透射非常光。',
    icon: '⬢',
    specifications: [
      { key: 'Material', valueEn: 'Calcite + Canada Balsam', valueZh: '方解石+加拿大树脂' },
      { key: 'Extinction Ratio', valueEn: '> 10,000:1', valueZh: '> 10,000:1' },
      { key: 'Acceptance Angle', valueEn: '~25°', valueZh: '~25°' },
    ],
    applications: {
      en: ['Historical experiments', 'Educational demonstrations', 'Museums'],
      zh: ['历史实验', '教学演示', '博物馆收藏'],
    },
    difficulty: 'intermediate',
    benchComponentType: 'polarizer',
    relatedDevices: ['glan-thompson'],
  },
  {
    id: 'glan-foucault',
    nameEn: 'Glan-Foucault Prism',
    nameZh: '格兰-福科棱镜',
    category: 'polarizers',
    descriptionEn: 'Air-spaced birefringent polarizer with very high extinction ratio.',
    descriptionZh: '空气间隔的双折射偏振器，具有极高消光比。',
    principleEn: 'Similar to Glan-Thompson but uses air gap. O-ray exits through side, e-ray transmitted straight.',
    principleZh: '类似格兰-汤姆逊但使用空气间隙。o光从侧面射出，e光直射透过。',
    icon: '◈',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Damage Threshold', valueEn: 'High (no cement)', valueZh: '高（无胶合）' },
      { key: 'Acceptance Angle', valueEn: '~6°', valueZh: '~6°' },
    ],
    applications: {
      en: ['High-power UV applications', 'Precision measurements', 'Spectroscopy'],
      zh: ['高功率紫外应用', '精密测量', '光谱学'],
    },
    difficulty: 'advanced',
    benchComponentType: 'polarizer',
  },
  {
    id: 'polarizing-film',
    nameEn: 'Polarizing Film (H-Sheet)',
    nameZh: '偏振膜（H片）',
    category: 'polarizers',
    descriptionEn: 'Thin polymer film polarizer, widely used in displays and everyday applications.',
    descriptionZh: '薄型聚合物偏振膜，广泛用于显示器和日常应用。',
    principleEn: 'Stretched PVA film with aligned iodine molecules creates dichroic absorption.',
    principleZh: '拉伸PVA薄膜中排列的碘分子产生二向色吸收。',
    icon: '▭',
    specifications: [
      { key: 'Thickness', valueEn: '0.2-0.5 mm', valueZh: '0.2-0.5 mm' },
      { key: 'Extinction Ratio', valueEn: '~1000:1', valueZh: '~1000:1' },
      { key: 'Cost', valueEn: 'Very Low', valueZh: '极低' },
    ],
    applications: {
      en: ['LCD screens', 'Sunglasses', 'Photography', 'Educational kits'],
      zh: ['LCD屏幕', '太阳镜', '摄影', '教学套件'],
    },
    mathFormula: "$I = I_0 \\cos^2\\theta (Malus's Law)$",
    difficulty: 'basic',
    benchComponentType: 'polarizer',
  },
  {
    id: 'brewster-window',
    nameEn: "Brewster's Window",
    nameZh: '布儒斯特窗',
    category: 'polarizers',
    descriptionEn: 'Glass plate at Brewster angle providing polarization by reflection.',
    descriptionZh: '在布儒斯特角放置的玻璃板，通过反射实现偏振。',
    principleEn: 'At Brewster angle (arctan n), p-polarized light has zero reflection, only s-polarization reflects.',
    principleZh: '在布儒斯特角（arctan n）时，p偏振光反射为零，只有s偏振光反射。',
    icon: '∠',
    specifications: [
      { key: 'Brewster Angle', valueEn: '56.3° (for glass)', valueZh: '56.3°（玻璃）' },
      { key: 'Transmission (p)', valueEn: '100%', valueZh: '100%' },
      { key: 'Material', valueEn: 'BK7 / Fused Silica', valueZh: 'BK7/熔融石英' },
    ],
    applications: {
      en: ['Laser cavities', 'Low-loss windows', 'Polarization experiments'],
      zh: ['激光腔', '低损耗窗口', '偏振实验'],
    },
    mathFormula: '$\\theta_B = \\arctan(n_2/n_1)$',
    difficulty: 'intermediate',
    benchComponentType: 'polarizer',
    relatedDevices: ['pile-of-plates'],
  },
  {
    id: 'pile-of-plates',
    nameEn: 'Pile of Plates Polarizer',
    nameZh: '玻璃片堆偏振器',
    category: 'polarizers',
    descriptionEn: 'Multiple glass plates at Brewster angle for high polarization purity.',
    descriptionZh: '多块布儒斯特角玻璃片叠加实现高偏振纯度。',
    principleEn: 'Each plate removes some s-polarization; multiple plates achieve high extinction ratio.',
    principleZh: '每块板去除部分s偏振光；多块叠加实现高消光比。',
    icon: '☰',
    specifications: [
      { key: 'Number of Plates', valueEn: '6-10 typical', valueZh: '通常6-10块' },
      { key: 'Extinction Ratio', valueEn: '> 100:1', valueZh: '> 100:1' },
      { key: 'Wavelength', valueEn: 'Broadband', valueZh: '宽带' },
    ],
    applications: {
      en: ['IR polarization', 'Broadband polarizers', 'Educational demonstrations'],
      zh: ['红外偏振', '宽带偏振器', '教学演示'],
    },
    mathFormula: '$R_s = (\\frac{n-1}{n+1})^2$',
    difficulty: 'intermediate',
  },
  // === Analyzers (New Category) ===
  {
    id: 'polarimeter',
    nameEn: 'Polarimeter',
    nameZh: '偏振计',
    category: 'analyzers',
    descriptionEn: 'Instrument for measuring optical rotation and polarization state.',
    descriptionZh: '测量旋光度和偏振态的仪器。',
    principleEn: 'Measures rotation angle of polarization plane caused by optically active substances.',
    principleZh: '测量光学活性物质导致的偏振面旋转角度。',
    icon: '⊙',
    specifications: [
      { key: 'Resolution', valueEn: '0.001° - 0.01°', valueZh: '0.001° - 0.01°' },
      { key: 'Light Source', valueEn: 'Sodium D-line (589nm)', valueZh: '钠D线（589nm）' },
      { key: 'Applications', valueEn: 'Sugar content, chiral molecules', valueZh: '糖含量、手性分子' },
    ],
    applications: {
      en: ['Food industry', 'Pharmaceutical', 'Chemical analysis', 'Quality control'],
      zh: ['食品工业', '制药', '化学分析', '质量控制'],
    },
    mathFormula: '$[\\alpha] = \\alpha / (l \\times c)$',
    difficulty: 'intermediate',
  },
  {
    id: 'stokes-analyzer',
    nameEn: 'Stokes Polarimeter',
    nameZh: 'Stokes偏振分析仪',
    category: 'analyzers',
    descriptionEn: 'Complete polarization state measurement using Stokes parameters.',
    descriptionZh: '使用Stokes参数完整测量偏振态。',
    principleEn: 'Measures S0, S1, S2, S3 parameters to fully characterize polarization state.',
    principleZh: '测量S0、S1、S2、S3参数以完整表征偏振态。',
    icon: '⊕',
    specifications: [
      { key: 'Parameters', valueEn: 'S0, S1, S2, S3', valueZh: 'S0、S1、S2、S3' },
      { key: 'Accuracy', valueEn: '< 1%', valueZh: '< 1%' },
      { key: 'Speed', valueEn: 'Real-time capable', valueZh: '可实时测量' },
    ],
    applications: {
      en: ['Optical communications', 'Remote sensing', 'Material characterization'],
      zh: ['光通信', '遥感', '材料表征'],
    },
    mathFormula: '$S = [S₀, S₁, S₂, S₃]^T$',
    difficulty: 'advanced',
  },
  {
    id: 'mueller-ellipsometer',
    nameEn: 'Mueller Matrix Ellipsometer',
    nameZh: 'Mueller矩阵椭偏仪',
    category: 'analyzers',
    descriptionEn: 'Advanced instrument measuring complete Mueller matrix of samples.',
    descriptionZh: '测量样品完整Mueller矩阵的先进仪器。',
    principleEn: 'Measures 16 elements of Mueller matrix for complete optical characterization.',
    principleZh: '测量Mueller矩阵的16个元素以完整表征光学特性。',
    icon: '▣',
    specifications: [
      { key: 'Matrix Elements', valueEn: '16 (4×4)', valueZh: '16（4×4）' },
      { key: 'Wavelength Range', valueEn: '190 nm - 2500 nm', valueZh: '190 nm - 2500 nm' },
      { key: 'Thickness Range', valueEn: '0.1 nm - 100 μm', valueZh: '0.1 nm - 100 μm' },
    ],
    applications: {
      en: ['Thin film metrology', 'Semiconductor', 'Nanomaterials', 'Biomedical'],
      zh: ['薄膜计量', '半导体', '纳米材料', '生物医学'],
    },
    mathFormula: '$S_{out} = M \\cdot S_{in}$',
    difficulty: 'advanced',
  },
  {
    id: 'division-of-amplitude-polarimeter',
    nameEn: 'Division-of-Amplitude Polarimeter',
    nameZh: '分振幅偏振计',
    category: 'analyzers',
    descriptionEn: 'Simultaneously measures polarization without rotating elements.',
    descriptionZh: '无需旋转元件同时测量偏振态。',
    principleEn: 'Splits beam into multiple paths with different analyzers for instantaneous measurement.',
    principleZh: '将光束分成多条路径，配合不同检偏器实现瞬时测量。',
    icon: '⋔',
    specifications: [
      { key: 'Speed', valueEn: 'Single shot', valueZh: '单次拍摄' },
      { key: 'Channels', valueEn: '4 (typical)', valueZh: '4（典型）' },
      { key: 'Use Case', valueEn: 'Dynamic polarization', valueZh: '动态偏振' },
    ],
    applications: {
      en: ['High-speed measurements', 'Fiber optics', 'Dynamic systems'],
      zh: ['高速测量', '光纤', '动态系统'],
    },
    difficulty: 'advanced',
  },
  // === Modulators (New Category) ===
  {
    id: 'kerr-cell',
    nameEn: 'Kerr Cell',
    nameZh: '克尔盒',
    category: 'modulators',
    descriptionEn: 'Electro-optic modulator using Kerr effect (quadratic in field).',
    descriptionZh: '利用克尔效应（与场强平方成正比）的电光调制器。',
    principleEn: 'Applied electric field induces birefringence proportional to E². Very fast response.',
    principleZh: '施加电场诱导的双折射与E²成正比。响应极快。',
    icon: '⚡',
    specifications: [
      { key: 'Response Time', valueEn: '< 1 ns', valueZh: '< 1 ns' },
      { key: 'Half-wave Voltage', valueEn: '10-30 kV', valueZh: '10-30 kV' },
      { key: 'Medium', valueEn: 'Nitrobenzene / CS₂', valueZh: '硝基苯/CS₂' },
    ],
    applications: {
      en: ['Ultrafast shutters', 'Light speed measurement', 'Historical experiments'],
      zh: ['超快快门', '光速测量', '历史实验'],
    },
    mathFormula: '$\\Delta n = \\lambda K E^2$',
    difficulty: 'advanced',
  },
  {
    id: 'magneto-optic-modulator',
    nameEn: 'Magneto-Optic Modulator',
    nameZh: '磁光调制器',
    category: 'modulators',
    descriptionEn: 'Modulates polarization using magnetic field (Faraday effect).',
    descriptionZh: '利用磁场（法拉第效应）调制偏振方向。',
    principleEn: 'Magnetic field causes rotation of polarization plane. Non-reciprocal effect.',
    principleZh: '磁场导致偏振面旋转。非互易效应。',
    icon: '⊗',
    specifications: [
      { key: 'Rotation', valueEn: 'θ = V·B·L', valueZh: 'θ = V·B·L' },
      { key: 'Material', valueEn: 'TGG, YIG, TbGaG', valueZh: 'TGG、YIG、TbGaG' },
      { key: 'Non-reciprocal', valueEn: 'Yes', valueZh: '是' },
    ],
    applications: {
      en: ['Optical isolators', 'Current sensors', 'Magnetic field sensors'],
      zh: ['光隔离器', '电流传感器', '磁场传感器'],
    },
    mathFormula: '$\\theta = V \\cdot B \\cdot L$',
    difficulty: 'advanced',
    relatedDevices: ['faraday-rotator'],
  },
  {
    id: 'spatial-light-modulator',
    nameEn: 'Spatial Light Modulator (SLM)',
    nameZh: '空间光调制器（SLM）',
    category: 'modulators',
    descriptionEn: 'Programmable device for spatially varying polarization/phase modulation.',
    descriptionZh: '可编程器件，用于空间变化的偏振/相位调制。',
    principleEn: 'Liquid crystal array allows pixel-by-pixel control of polarization or phase.',
    principleZh: '液晶阵列允许逐像素控制偏振或相位。',
    icon: '▦',
    specifications: [
      { key: 'Resolution', valueEn: '1920×1080 typical', valueZh: '典型1920×1080' },
      { key: 'Pixel Pitch', valueEn: '8-20 μm', valueZh: '8-20 μm' },
      { key: 'Frame Rate', valueEn: '60-120 Hz', valueZh: '60-120 Hz' },
    ],
    applications: {
      en: ['Holography', 'Optical tweezers', 'Beam shaping', 'Adaptive optics'],
      zh: ['全息术', '光镊', '光束整形', '自适应光学'],
    },
    difficulty: 'advanced',
  },
  {
    id: 'acousto-optic-modulator',
    nameEn: 'Acousto-Optic Modulator (AOM)',
    nameZh: '声光调制器（AOM）',
    category: 'modulators',
    descriptionEn: 'Uses acoustic waves to diffract and modulate light.',
    descriptionZh: '利用声波衍射和调制光束。',
    principleEn: 'RF-driven acoustic waves create periodic refractive index grating in crystal.',
    principleZh: '射频驱动的声波在晶体中产生周期性折射率光栅。',
    icon: '≈',
    specifications: [
      { key: 'Modulation Speed', valueEn: '10 MHz - 1 GHz', valueZh: '10 MHz - 1 GHz' },
      { key: 'Diffraction Efficiency', valueEn: '> 80%', valueZh: '> 80%' },
      { key: 'Material', valueEn: 'TeO₂, PbMoO₄', valueZh: 'TeO₂、PbMoO₄' },
    ],
    applications: {
      en: ['Laser printing', 'Q-switching', 'Frequency shifting', 'Pulse picking'],
      zh: ['激光打印', '调Q', '频率偏移', '脉冲选择'],
    },
    mathFormula: '$\\theta_B =  \\frac{\\lambda f}{2v}$',
    difficulty: 'advanced',
  },
  // === Wave Plates ===
  {
    id: 'quarter-wave-plate',
    nameEn: 'Quarter-Wave Plate (λ/4)',
    nameZh: '四分之一波片（λ/4）',
    category: 'waveplates',
    descriptionEn: 'Introduces a 90° (λ/4) phase retardation, converting linear to circular polarization.',
    descriptionZh: '引入90°（λ/4）相位延迟，将线偏振光转换为圆偏振光。',
    principleEn: 'Made from birefringent crystal with different refractive indices along fast and slow axes. Path difference = λ/4.',
    principleZh: '由双折射晶体制成，沿快轴和慢轴具有不同折射率。光程差 = λ/4。',
    icon: '¼',
    specifications: [
      { key: 'Retardation', valueEn: 'λ/4 ± λ/300', valueZh: 'λ/4 ± λ/300' },
      { key: 'Material', valueEn: 'Quartz / Polymer / Mica', valueZh: '石英/聚合物/云母' },
      { key: 'Clear Aperture', valueEn: '> 90%', valueZh: '> 90%' },
    ],
    applications: {
      en: ['Circular polarization generation', 'Optical isolators', 'Ellipsometry', 'CD spectroscopy'],
      zh: ['圆偏振光产生', '光隔离器', '椭偏仪', 'CD光谱'],
    },
    mathFormula: '$\\Delta\\phi = \\frac{\\pi}{2} = 90^\\circ$',
    difficulty: 'intermediate',
    benchComponentType: 'waveplate',
    relatedDevices: ['half-wave-plate'],
  },
  {
    id: 'half-wave-plate',
    nameEn: 'Half-Wave Plate (λ/2)',
    nameZh: '二分之一波片（λ/2）',
    category: 'waveplates',
    descriptionEn: 'Introduces 180° (λ/2) phase retardation, rotating linear polarization by twice the angle to fast axis.',
    descriptionZh: '引入180°（λ/2）相位延迟，使线偏振方向旋转快轴夹角的两倍。',
    principleEn: 'Rotates polarization plane: output angle = 2×(fast axis angle) - input angle. Also converts left-circular to right-circular.',
    principleZh: '旋转偏振平面：输出角度 = 2×（快轴角度）- 输入角度。也可将左旋转换为右旋。',
    icon: '½',
    specifications: [
      { key: 'Retardation', valueEn: 'λ/2 ± λ/300', valueZh: 'λ/2 ± λ/300' },
      { key: 'Rotation Range', valueEn: '0-90° (continuous)', valueZh: '0-90°（连续）' },
      { key: 'Transmission', valueEn: '> 98%', valueZh: '> 98%' },
    ],
    applications: {
      en: ['Polarization rotation', 'Laser power control', 'Polarization switching', 'Fiber optics'],
      zh: ['偏振旋转', '激光功率控制', '偏振切换', '光纤通信'],
    },
    mathFormula: '$\\theta_{out} = 2\\theta_{axis} - \\theta_{in}$',
    difficulty: 'intermediate',
    benchComponentType: 'waveplate',
    relatedDevices: ['quarter-wave-plate'],
  },
  {
    id: 'achromatic-waveplate',
    nameEn: 'Achromatic Wave Plate',
    nameZh: '消色差波片',
    category: 'waveplates',
    descriptionEn: 'Wave plate with constant retardation across a broad wavelength range.',
    descriptionZh: '在宽波长范围内具有恒定延迟的波片。',
    principleEn: 'Combines multiple birefringent materials with different dispersion properties to cancel wavelength dependence.',
    principleZh: '结合多种具有不同色散特性的双折射材料，消除波长依赖性。',
    icon: '◈',
    specifications: [
      { key: 'Bandwidth', valueEn: '400-700 nm', valueZh: '400-700 nm' },
      { key: 'Retardation Variation', valueEn: '< 5%', valueZh: '< 5%' },
    ],
    applications: {
      en: ['Broadband polarimetry', 'White light applications', 'Spectroscopy'],
      zh: ['宽带偏振测量', '白光应用', '光谱学'],
    },
    difficulty: 'advanced',
    benchComponentType: 'waveplate',
  },
  // === Beam Splitters ===
  {
    id: 'pbs',
    nameEn: 'Polarizing Beam Splitter (PBS)',
    nameZh: '偏振分束器（PBS）',
    category: 'splitters',
    descriptionEn: 'Separates incident light into two orthogonally polarized beams.',
    descriptionZh: '将入射光分离为两束正交偏振光。',
    principleEn: 'Uses multilayer dielectric coating at 45°. P-polarization transmitted, s-polarization reflected at 90°.',
    principleZh: '使用45°多层介质膜。p偏振透射，s偏振90°反射。',
    icon: '⊠',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 1000:1', valueZh: '> 1000:1' },
      { key: 'Transmission (p)', valueEn: '> 95%', valueZh: '> 95%' },
      { key: 'Reflection (s)', valueEn: '> 99%', valueZh: '> 99%' },
    ],
    applications: {
      en: ['Laser beam combining', 'Interferometry', 'Quantum optics', 'Holography'],
      zh: ['激光合束', '干涉测量', '量子光学', '全息术'],
    },
    mathFormula: '$T_p \\approx 1, R_s \\approx 1$',
    difficulty: 'intermediate',
    benchComponentType: 'splitter',
    relatedDevices: ['npbs', 'calcite-splitter'],
  },
  {
    id: 'npbs',
    nameEn: 'Non-Polarizing Beam Splitter',
    nameZh: '非偏振分束器（NPBS）',
    category: 'splitters',
    descriptionEn: 'Splits light 50/50 regardless of polarization state.',
    descriptionZh: '无论偏振态如何，以50/50比例分光。',
    principleEn: 'Metal or dielectric coating optimized for equal reflection and transmission for all polarization states.',
    principleZh: '金属或介质膜优化为对所有偏振态反射透射相等。',
    icon: '◫',
    specifications: [
      { key: 'Split Ratio', valueEn: '50:50 ± 5%', valueZh: '50:50 ± 5%' },
      { key: 'Polarization Sensitivity', valueEn: '< 5%', valueZh: '< 5%' },
    ],
    applications: {
      en: ['Interferometers', 'Imaging systems', 'Beam sampling', 'Optical setups'],
      zh: ['干涉仪', '成像系统', '光束取样', '光路搭建'],
    },
    mathFormula: '$R = T = 50%$',
    difficulty: 'basic',
    benchComponentType: 'splitter',
    relatedDevices: ['pbs'],
  },
  {
    id: 'calcite-splitter',
    nameEn: 'Calcite Beam Displacer',
    nameZh: '方解石分束位移器',
    category: 'splitters',
    descriptionEn: 'Natural birefringent crystal that spatially separates o-ray and e-ray.',
    descriptionZh: '天然双折射晶体，在空间上分离o光和e光。',
    principleEn: "Calcite has large birefringence (Δn ≈ 0.17). O-ray follows Snell's law; e-ray walks off at angle.",
    principleZh: '方解石双折射率大（Δn ≈ 0.17）。o光遵循斯涅尔定律；e光走离。',
    icon: '◇',
    specifications: [
      { key: 'Birefringence', valueEn: 'Δn = 0.172 @ 590nm', valueZh: 'Δn = 0.172 @ 590nm' },
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Beam Separation', valueEn: '~0.1 × length', valueZh: '~0.1 × 长度' },
    ],
    applications: {
      en: ['High-precision polarimetry', 'Quantum optics', 'Beam displacement', 'Polarization imaging'],
      zh: ['高精度偏振测量', '量子光学', '光束位移', '偏振成像'],
    },
    mathFormula: '$n_o = 1.658, n_e = 1.486$',
    difficulty: 'advanced',
    benchComponentType: 'splitter',
    relatedDevices: ['wollaston-prism'],
  },
  {
    id: 'wollaston-prism',
    nameEn: 'Wollaston Prism',
    nameZh: '沃拉斯顿棱镜',
    category: 'splitters',
    descriptionEn: 'Birefringent prism that separates beam into two diverging orthogonally polarized beams.',
    descriptionZh: '双折射棱镜，将光束分成两束发散的正交偏振光。',
    principleEn: 'Two calcite wedges with perpendicular optic axes cemented together. Both beams deviate from input direction.',
    principleZh: '两个光轴垂直的方解石楔形棱镜粘合。两束光都偏离输入方向。',
    icon: '⋈',
    specifications: [
      { key: 'Separation Angle', valueEn: '1° - 20°', valueZh: '1° - 20°' },
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Clear Aperture', valueEn: '> 90%', valueZh: '> 90%' },
    ],
    applications: {
      en: ['Differential interference contrast', 'Polarization interferometry', 'Laser tuning'],
      zh: ['微分干涉对比', '偏振干涉测量', '激光调谐'],
    },
    difficulty: 'advanced',
    benchComponentType: 'splitter',
    relatedDevices: ['calcite-splitter', 'rochon-prism'],
  },
  {
    id: 'rochon-prism',
    nameEn: 'Rochon Prism',
    nameZh: '罗雄棱镜',
    category: 'splitters',
    descriptionEn: 'Similar to Wollaston but o-ray passes straight through.',
    descriptionZh: '类似沃拉斯顿棱镜，但o光直接通过。',
    principleEn: 'Two calcite prisms with one axis parallel to propagation. O-ray undeviated; e-ray deviates.',
    principleZh: '两个方解石棱镜，其中一个轴平行于传播方向。o光不偏离；e光偏离。',
    icon: '⊿',
    specifications: [
      { key: 'Deviation Angle', valueEn: '2° - 15°', valueZh: '2° - 15°' },
      { key: 'O-ray Deviation', valueEn: '0°', valueZh: '0°' },
    ],
    applications: {
      en: ['Polarization analysis', 'Spectroscopy', 'Beam routing'],
      zh: ['偏振分析', '光谱学', '光束路由'],
    },
    difficulty: 'advanced',
    benchComponentType: 'splitter',
  },
  // === Other Optical Components ===
  {
    id: 'fresnel-rhomb',
    nameEn: 'Fresnel Rhomb',
    nameZh: '菲涅尔菱体',
    category: 'retarders',
    descriptionEn: 'Uses total internal reflection to introduce phase retardation. Achromatic operation.',
    descriptionZh: '利用全内反射引入相位延迟。消色差工作。',
    principleEn: 'Two total internal reflections at specific angle introduce 45° phase shift each. Net retardation = 90° (λ/4).',
    principleZh: '两次特定角度的全内反射各引入45°相位差。净延迟 = 90°（λ/4）。',
    icon: '⬡',
    specifications: [
      { key: 'Retardation', valueEn: 'λ/4 (achromatic)', valueZh: 'λ/4（消色差）' },
      { key: 'Material', valueEn: 'BK7 / Fused Silica', valueZh: 'BK7/熔融石英' },
      { key: 'Bandwidth', valueEn: '300-2000 nm', valueZh: '300-2000 nm' },
    ],
    applications: {
      en: ['Broadband circular polarization', 'Spectroscopy', 'Achromatic applications'],
      zh: ['宽带圆偏振', '光谱学', '消色差应用'],
    },
    mathFormula: '$\\delta = 2 \\times \\arctan(n^2 \\sin^2\\theta / \\cos\\theta)$',
    difficulty: 'advanced',
    benchComponentType: 'waveplate',
  },
  {
    id: 'depolarizer',
    nameEn: 'Depolarizer',
    nameZh: '退偏器',
    category: 'other',
    descriptionEn: 'Converts polarized light to unpolarized (pseudo-random polarization).',
    descriptionZh: '将偏振光转换为非偏振光（伪随机偏振）。',
    principleEn: 'Uses spatial or temporal variation of retardation to scramble polarization state.',
    principleZh: '利用延迟的空间或时间变化来打乱偏振态。',
    icon: '※',
    specifications: [
      { key: 'Type', valueEn: 'Lyot / Wedge / Cornu', valueZh: 'Lyot/楔形/Cornu型' },
      { key: 'Degree of Polarization', valueEn: '< 5%', valueZh: '< 5%' },
    ],
    applications: {
      en: ['Eliminating polarization artifacts', 'Spectrometers', 'Fiber coupling'],
      zh: ['消除偏振假象', '光谱仪', '光纤耦合'],
    },
    difficulty: 'intermediate',
  },
  {
    id: 'faraday-rotator',
    nameEn: 'Faraday Rotator',
    nameZh: '法拉第旋光器',
    category: 'other',
    descriptionEn: 'Magneto-optic device that rotates polarization non-reciprocally.',
    descriptionZh: '磁光器件，非互易地旋转偏振方向。',
    principleEn: 'Magnetic field applied along propagation direction in magneto-optic material induces rotation. θ = V·B·L.',
    principleZh: '在磁光材料中沿传播方向施加磁场诱导旋转。θ = V·B·L。',
    icon: '⥁',
    specifications: [
      { key: 'Rotation', valueEn: '45° (typical)', valueZh: '45°（典型）' },
      { key: 'Material', valueEn: 'TGG / YIG', valueZh: 'TGG/YIG' },
      { key: 'Isolation', valueEn: '> 30 dB', valueZh: '> 30 dB' },
    ],
    applications: {
      en: ['Optical isolators', 'Circulators', 'Laser protection', 'Fiber amplifiers'],
      zh: ['光隔离器', '环行器', '激光保护', '光纤放大器'],
    },
    mathFormula: '$\\theta = V \\cdot B \\cdot L (Verdet constant)$',
    difficulty: 'advanced',
  },
  {
    id: 'pockels-cell',
    nameEn: 'Pockels Cell',
    nameZh: '普克尔盒',
    category: 'retarders',
    descriptionEn: 'Electro-optic device for fast polarization modulation.',
    descriptionZh: '用于快速偏振调制的电光器件。',
    principleEn: 'Applied electric field changes refractive index via linear electro-optic effect. Retardation ∝ voltage.',
    principleZh: '施加电场通过线性电光效应改变折射率。延迟量与电压成正比。',
    icon: '⚡',
    specifications: [
      { key: 'Half-wave Voltage', valueEn: '3-10 kV', valueZh: '3-10 kV' },
      { key: 'Switching Speed', valueEn: '< 10 ns', valueZh: '< 10 ns' },
      { key: 'Material', valueEn: 'KDP / BBO / LiNbO₃', valueZh: 'KDP/BBO/LiNbO₃' },
    ],
    applications: {
      en: ['Q-switching', 'Pulse picking', 'Polarization modulation', 'Intensity control'],
      zh: ['调Q', '脉冲选择', '偏振调制', '强度控制'],
    },
    mathFormula: '$\\Delta n = n^3 \\cdot r \\cdot E / 2$',
    difficulty: 'advanced',
    benchComponentType: 'waveplate',
  },
  {
    id: 'photoelastic-modulator',
    nameEn: 'Photoelastic Modulator (PEM)',
    nameZh: '光弹调制器（PEM）',
    category: 'retarders',
    descriptionEn: 'High-frequency polarization modulator using mechanical resonance.',
    descriptionZh: '利用机械共振的高频偏振调制器。',
    principleEn: 'Piezoelectric transducer induces standing acoustic wave in optical element, creating oscillating birefringence.',
    principleZh: '压电换能器在光学元件中产生驻声波，形成振荡双折射。',
    icon: '≋',
    specifications: [
      { key: 'Frequency', valueEn: '50 kHz (typical)', valueZh: '50 kHz（典型）' },
      { key: 'Peak Retardation', valueEn: 'λ/2 max', valueZh: '最大λ/2' },
      { key: 'Material', valueEn: 'Fused Silica / CaF₂', valueZh: '熔融石英/CaF₂' },
    ],
    applications: {
      en: ['Ellipsometry', 'CD spectroscopy', 'Lock-in detection', 'Polarimetry'],
      zh: ['椭偏测量', 'CD光谱', '锁相检测', '偏振测量'],
    },
    difficulty: 'advanced',
    benchComponentType: 'waveplate',
  },
  {
    id: 'liquid-crystal-retarder',
    nameEn: 'Liquid Crystal Retarder',
    nameZh: '液晶延迟器',
    category: 'retarders',
    descriptionEn: 'Electrically tunable wave plate using liquid crystal birefringence.',
    descriptionZh: '利用液晶双折射的电控可调波片。',
    principleEn: 'Applied voltage reorients LC molecules, changing effective birefringence and retardation.',
    principleZh: '施加电压使液晶分子重新取向，改变有效双折射和延迟。',
    icon: '▤',
    specifications: [
      { key: 'Tuning Range', valueEn: '0 - λ', valueZh: '0 - λ' },
      { key: 'Response Time', valueEn: '10-100 ms', valueZh: '10-100 ms' },
      { key: 'Drive Voltage', valueEn: '< 10 V', valueZh: '< 10 V' },
    ],
    applications: {
      en: ['Variable retarders', 'Polarization imaging', 'Ellipsometry', 'Displays'],
      zh: ['可变延迟器', '偏振成像', '椭偏测量', '显示器'],
    },
    difficulty: 'intermediate',
    benchComponentType: 'waveplate',
  },
]

// ============================================
// Component Palette for Free Design
// ============================================

export interface PaletteComponent {
  type: BenchComponentType
  icon: string
  nameEn: string
  nameZh: string
  color: string
  principleEn: string
  principleZh: string
  defaultProperties?: Record<string, number | string | boolean>
}

export const PALETTE_COMPONENTS: PaletteComponent[] = [
  {
    type: 'emitter',
    icon: '💡',
    nameEn: 'Light Source',
    nameZh: '光源',
    color: 'yellow',
    principleEn: 'Emits polarized or unpolarized light',
    principleZh: '发射偏振或自然光',
    defaultProperties: { polarization: 0 },
  },
  {
    type: 'polarizer',
    icon: '◐',
    nameEn: 'Polarizer',
    nameZh: '偏振片',
    color: 'indigo',
    principleEn: 'I = I₀ cos²θ (Malus\'s Law)',
    principleZh: 'I = I₀ cos²θ（马吕斯定律）',
    defaultProperties: { angle: 0 },
  },
  {
    type: 'waveplate',
    icon: '◈',
    nameEn: 'Wave Plate',
    nameZh: '波片',
    color: 'violet',
    principleEn: 'λ/4 or λ/2 phase retardation',
    principleZh: 'λ/4或λ/2相位延迟',
    defaultProperties: { retardation: 90 },
  },
  {
    type: 'mirror',
    icon: '🪞',
    nameEn: 'Mirror',
    nameZh: '反射镜',
    color: 'cyan',
    principleEn: 'θᵢ = θᵣ (Law of reflection)',
    principleZh: '入射角=反射角',
    defaultProperties: { reflectAngle: 45 },
  },
  {
    type: 'splitter',
    icon: '◇',
    nameEn: 'Beam Splitter',
    nameZh: '分束器',
    color: 'emerald',
    principleEn: 'PBS, NPBS, or Calcite',
    principleZh: 'PBS、NPBS或方解石',
    defaultProperties: { splitType: 'pbs' },
  },
  {
    type: 'sensor',
    icon: '📡',
    nameEn: 'Detector',
    nameZh: '探测器',
    color: 'rose',
    principleEn: 'Measures light intensity',
    principleZh: '测量光强',
    defaultProperties: {},
  },
  {
    type: 'lens',
    icon: '🔍',
    nameEn: 'Lens',
    nameZh: '透镜',
    color: 'amber',
    principleEn: '1/f = 1/dₒ + 1/dᵢ',
    principleZh: '薄透镜公式',
    defaultProperties: { focalLength: 50 },
  },
]

// ============================================
// Helper Functions
// ============================================

export function getDeviceById(id: string): Device | undefined {
  return DEVICES.find(d => d.id === id)
}

export function getDevicesByCategory(category: DeviceCategory | 'all'): Device[] {
  if (category === 'all') return DEVICES
  return DEVICES.filter(d => d.category === category)
}

export function searchDevices(query: string): Device[] {
  const lowerQuery = query.toLowerCase()
  return DEVICES.filter(d =>
    d.nameEn.toLowerCase().includes(lowerQuery) ||
    d.nameZh.includes(query) ||
    d.descriptionEn.toLowerCase().includes(lowerQuery) ||
    d.descriptionZh.includes(query)
  )
}
