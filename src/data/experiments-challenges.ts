/**
 * Classic Experiments, Challenges & Tutorials Data
 * 经典实验、挑战关卡与教程数据
 *
 * Contains predefined optical bench configurations for:
 * - Classic physics experiments
 * - Challenge puzzles with goals
 * - Interactive tutorials
 */

import type { ClassicExperiment, Challenge, Tutorial } from '@/stores/opticalBenchStore'

// ============================================
// Classic Experiments
// ============================================

export const CLASSIC_EXPERIMENTS: ClassicExperiment[] = [
  {
    id: 'malus-law',
    nameEn: "Malus's Law Verification",
    nameZh: '马吕斯定律验证',
    descriptionEn: 'Measure intensity through two polarizers as a function of relative angle.',
    descriptionZh: '测量光通过两块偏振片时强度随相对角度的变化。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 250, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 400, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 550, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'I = I₀ cos²θ',
        'Crossed polarizers (90°) block all light',
        'Maximum transmission when axes aligned (0°)',
        'Intensity varies smoothly with angle',
      ],
      zh: [
        'I = I₀ cos²θ',
        '正交偏振片（90°）阻挡所有光线',
        '轴对齐（0°）时透射率最大',
        '强度随角度平滑变化',
      ],
    },
    linkedDemo: 'malus-law',
  },
  {
    id: 'three-polarizer-paradox',
    nameEn: 'Three Polarizer Paradox',
    nameZh: '三偏振片悖论',
    descriptionEn: 'Demonstrate that adding a third polarizer can increase transmitted light.',
    descriptionZh: '演示添加第三块偏振片反而能增加透射光强。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 160, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 300, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'p3', type: 'polarizer', x: 440, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 560, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        '0° and 90° polarizers alone: I = 0',
        '45° polarizer in between: I = I₀/8',
        'Quantum superposition analogy',
        'Measurement affects the state',
      ],
      zh: [
        '0°和90°偏振片：I = 0',
        '中间加45°偏振片：I = I₀/8',
        '量子叠加态类比',
        '测量影响状态',
      ],
    },
    linkedDemo: 'malus-law',
  },
  {
    id: 'quarter-wave',
    nameEn: 'Circular Polarization Generation',
    nameZh: '圆偏振光产生',
    descriptionEn: 'Use a linear polarizer and quarter-wave plate to create circularly polarized light.',
    descriptionZh: '使用线偏振片和λ/4波片产生圆偏振光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 220, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'w1', type: 'waveplate', x: 360, y: 200, rotation: 0, properties: { retardation: 90 } },
      { id: 's1', type: 'sensor', x: 500, y: 200, rotation: 0, properties: { mode: 'polarization' } },
    ],
    learningPoints: {
      en: [
        '45° linear + λ/4 → circular polarization',
        'Phase difference of 90° between orthogonal components',
        'Handedness depends on wave plate orientation',
        'Used in 3D cinema technology',
      ],
      zh: [
        '45°线偏振 + λ/4 → 圆偏振',
        '正交分量间90°相位差',
        '旋向取决于波片取向',
        '3D电影技术应用',
      ],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'birefringence',
    nameEn: 'Birefringent Crystal Demonstration',
    nameZh: '双折射晶体演示',
    descriptionEn: 'Split a light beam into o-ray and e-ray using calcite crystal.',
    descriptionZh: '使用方解石晶体将光分裂为o光和e光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 280, y: 200, rotation: 0, properties: { splitType: 'calcite' } },
      { id: 's1', type: 'sensor', x: 480, y: 150, rotation: 0, properties: {} },
      { id: 's2', type: 'sensor', x: 480, y: 250, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'O-ray: ordinary refractive index nₒ = 1.658',
        'E-ray: extraordinary refractive index nₑ = 1.486',
        'O-ray and e-ray are orthogonally polarized',
        'Birefringence Δn = nₒ - nₑ = 0.172',
      ],
      zh: [
        'o光：寻常折射率 nₒ = 1.658',
        'e光：非寻常折射率 nₑ = 1.486',
        'o光和e光偏振正交',
        '双折射率 Δn = nₒ - nₑ = 0.172',
      ],
    },
    linkedDemo: 'birefringence',
  },
  {
    id: 'half-wave-rotation',
    nameEn: 'Half-Wave Plate Polarization Rotation',
    nameZh: '半波片偏振旋转',
    descriptionEn: 'Use a λ/2 plate to rotate the polarization direction by 2θ.',
    descriptionZh: '使用λ/2波片将偏振方向旋转2θ。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'w1', type: 'waveplate', x: 320, y: 200, rotation: 22.5, properties: { retardation: 180 } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'λ/2 plate rotates polarization by 2×(fast axis angle)',
        'θ_out = 2θ_axis - θ_in',
        'Output remains linearly polarized',
        'Used for continuous polarization rotation',
      ],
      zh: [
        'λ/2波片使偏振旋转2×（快轴角度）',
        'θ_out = 2θ_axis - θ_in',
        '输出仍为线偏振',
        '用于连续偏振旋转',
      ],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'brewster-angle',
    nameEn: "Brewster's Angle Demonstration",
    nameZh: '布儒斯特角演示',
    descriptionEn: 'Find the angle where reflected light becomes completely polarized.',
    descriptionZh: '寻找反射光完全偏振的入射角。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 100, rotation: 56, properties: { polarization: -1 } },
      { id: 'm1', type: 'mirror', x: 300, y: 250, rotation: -34, properties: { material: 'glass' } },
      { id: 'p1', type: 'polarizer', x: 500, y: 100, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 620, y: 100, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'tan θ_B = n₂/n₁',
        'For glass (n=1.5): θ_B ≈ 56.3°',
        'Reflected light is purely s-polarized',
        'Transmitted light is partially p-polarized',
      ],
      zh: [
        'tan θ_B = n₂/n₁',
        '玻璃（n=1.5）：θ_B ≈ 56.3°',
        '反射光为纯s偏振',
        '透射光部分p偏振',
      ],
    },
    linkedDemo: 'brewster-angle',
  },
  {
    id: 'polarimeter',
    nameEn: 'Polarimeter Setup',
    nameZh: '旋光仪装置',
    descriptionEn: 'Measure optical rotation of chiral substances (like sugar solution).',
    descriptionZh: '测量手性物质（如糖溶液）的旋光度。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 330, y: 200, rotation: 0, properties: { type: 'sugar', rotation: 10 } },
      { id: 'p2', type: 'polarizer', x: 480, y: 200, rotation: 0, properties: { angle: 10 } },
      { id: 's1', type: 'sensor', x: 600, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'α = [α] × c × L (specific rotation)',
        'D-glucose rotates light clockwise (+52.7°)',
        'L-glucose rotates light counterclockwise',
        'Used in food industry and pharmaceuticals',
      ],
      zh: [
        'α = [α] × c × L（比旋光度）',
        'D-葡萄糖使光顺时针旋转（+52.7°）',
        'L-葡萄糖使光逆时针旋转',
        '食品工业和制药应用',
      ],
    },
    linkedDemo: 'optical-rotation',
  },
  {
    id: 'stress-analysis',
    nameEn: 'Photoelastic Stress Analysis',
    nameZh: '光弹应力分析',
    descriptionEn: 'Visualize stress distribution in transparent materials using crossed polarizers.',
    descriptionZh: '使用正交偏振片观察透明材料的应力分布。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 320, y: 200, rotation: 0, properties: { type: 'stressed-sample' } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'Stress induces birefringence in materials',
        'Isochromatic fringes show stress magnitude',
        'Isoclinic lines show principal stress directions',
        'Widely used in engineering design',
      ],
      zh: [
        '应力在材料中诱导双折射',
        '等色线显示应力大小',
        '等倾线显示主应力方向',
        '工程设计广泛应用',
      ],
    },
    linkedDemo: 'stress-birefringence',
  },
  {
    id: 'optical-isolator',
    nameEn: 'Optical Isolator',
    nameZh: '光隔离器',
    descriptionEn: 'Demonstrate non-reciprocal light transmission using Faraday effect.',
    descriptionZh: '利用法拉第效应演示光的非互易传输。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'fr', type: 'waveplate', x: 320, y: 200, rotation: 0, properties: { type: 'faraday', rotation: 45 } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'Faraday rotation is non-reciprocal',
        'Forward: 0° → 45° → transmitted',
        'Backward: 45° → 90° → blocked',
        'Essential for laser protection',
      ],
      zh: [
        '法拉第旋转是非互易的',
        '正向：0° → 45° → 透射',
        '反向：45° → 90° → 阻挡',
        '激光保护必需',
      ],
    },
  },
  {
    id: 'ellipsometry-setup',
    nameEn: 'Ellipsometry Configuration',
    nameZh: '椭偏仪配置',
    descriptionEn: 'Basic null ellipsometer for measuring thin film properties.',
    descriptionZh: '用于测量薄膜特性的基本消光椭偏仪。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 150, rotation: 70, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 150, y: 150, rotation: 0, properties: { angle: 45 } },
      { id: 'sample', type: 'mirror', x: 300, y: 250, rotation: -20, properties: { type: 'thin-film' } },
      { id: 'w1', type: 'waveplate', x: 450, y: 150, rotation: 0, properties: { retardation: 90 } },
      { id: 'p2', type: 'polarizer', x: 550, y: 150, rotation: 0, properties: { angle: 0 } },
      { id: 's1', type: 'sensor', x: 650, y: 150, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: [
        'Measures Ψ (amplitude ratio) and Δ (phase difference)',
        'tan Ψ × e^(iΔ) = rₚ/rₛ',
        'Non-destructive thin film analysis',
        'Sub-nanometer thickness resolution',
      ],
      zh: [
        '测量Ψ（振幅比）和Δ（相位差）',
        'tan Ψ × e^(iΔ) = rₚ/rₛ',
        '无损薄膜分析',
        '亚纳米厚度分辨率',
      ],
    },
  },
]

// ============================================
// Challenges (Puzzle Mode)
// ============================================

export const CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    nameEn: 'Half Intensity',
    nameZh: '一半光强',
    descriptionEn: 'Make the sensor read exactly 50% intensity.',
    descriptionZh: '使传感器读数恰好为50%。',
    goal: {
      en: 'Adjust the polarizer to achieve 50% transmission',
      zh: '调整偏振片使透射率为50%',
    },
    availableComponents: ['polarizer'],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 350, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 's1', type: 'sensor', x: 550, y: 200, rotation: 0, properties: {} },
    ],
    successCondition: {
      type: 'intensity',
      targetSensorId: 's1',
      minIntensity: 48,
      maxIntensity: 52,
    },
    hints: {
      en: ['cos²(45°) = 0.5', 'Rotate the polarizer to 45°'],
      zh: ['cos²(45°) = 0.5', '将偏振片旋转至45°'],
    },
    difficulty: 'easy',
  },
  {
    id: 'challenge-2',
    nameEn: 'Block the Light',
    nameZh: '阻挡光线',
    goal: {
      en: 'Reduce sensor reading to 0% using polarizers',
      zh: '使用偏振片将传感器读数降至0%',
    },
    descriptionEn: 'Add a polarizer to block all light reaching the sensor.',
    descriptionZh: '添加偏振片阻挡所有到达传感器的光。',
    availableComponents: ['polarizer'],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 250, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 's1', type: 'sensor', x: 550, y: 200, rotation: 0, properties: {} },
    ],
    successCondition: {
      type: 'intensity',
      targetSensorId: 's1',
      minIntensity: 0,
      maxIntensity: 2,
    },
    hints: {
      en: ['Cross the polarizers at 90°', 'Add a polarizer at 90° angle'],
      zh: ['使偏振片正交（90°）', '添加一个90°角的偏振片'],
    },
    difficulty: 'easy',
  },
  {
    id: 'challenge-3',
    nameEn: 'Quarter Transmission',
    nameZh: '四分之一透射',
    goal: {
      en: 'Achieve exactly 25% intensity at the sensor',
      zh: '使传感器读数恰好为25%',
    },
    descriptionEn: 'Use the three polarizer paradox principle to get 25% transmission.',
    descriptionZh: '利用三偏振片悖论原理获得25%透射率。',
    availableComponents: ['polarizer'],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 's1', type: 'sensor', x: 600, y: 200, rotation: 0, properties: {} },
    ],
    successCondition: {
      type: 'intensity',
      targetSensorId: 's1',
      minIntensity: 23,
      maxIntensity: 27,
    },
    hints: {
      en: ['Add a polarizer at 45°', 'cos²(45°) × cos²(45°) = 0.25'],
      zh: ['添加一个45°的偏振片', 'cos²(45°) × cos²(45°) = 0.25'],
    },
    difficulty: 'medium',
  },
  {
    id: 'challenge-4',
    nameEn: 'Circular Light',
    nameZh: '圆偏振光',
    goal: {
      en: 'Create circularly polarized light',
      zh: '产生圆偏振光',
    },
    descriptionEn: 'Use polarizer and wave plate to create circular polarization.',
    descriptionZh: '使用偏振片和波片产生圆偏振光。',
    availableComponents: ['polarizer', 'waveplate'],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 's1', type: 'sensor', x: 550, y: 200, rotation: 0, properties: { mode: 'polarization' } },
    ],
    successCondition: {
      type: 'polarization',
      targetSensorId: 's1',
      targetPolarization: 45, // Circular shown as 45° in simplified model
      tolerance: 10,
    },
    hints: {
      en: [
        'Use a 45° polarizer first',
        'Then add a λ/4 wave plate',
        'Wave plate fast axis at 0° or 90°',
      ],
      zh: [
        '先使用45°偏振片',
        '再添加λ/4波片',
        '波片快轴在0°或90°',
      ],
    },
    difficulty: 'medium',
  },
  {
    id: 'challenge-5',
    nameEn: 'Redirect the Beam',
    nameZh: '重定向光束',
    goal: {
      en: 'Use mirrors to hit the sensor at new position',
      zh: '使用反射镜将光打到新位置的传感器',
    },
    descriptionEn: 'Redirect the light beam using mirrors to reach the offset sensor.',
    descriptionZh: '使用反射镜重定向光束到达偏移的传感器。',
    availableComponents: ['mirror'],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 100, y: 100, rotation: 0, properties: { polarization: 0 } },
      { id: 's1', type: 'sensor', x: 100, y: 300, rotation: 0, properties: {} },
    ],
    successCondition: {
      type: 'intensity',
      targetSensorId: 's1',
      minIntensity: 80,
    },
    hints: {
      en: [
        'Place a mirror at 45° to redirect downward',
        'Use two mirrors for 180° turn',
      ],
      zh: [
        '放置45°反射镜向下重定向',
        '使用两个反射镜实现180°转向',
      ],
    },
    difficulty: 'medium',
  },
  {
    id: 'challenge-6',
    nameEn: 'Split and Measure',
    nameZh: '分束测量',
    goal: {
      en: 'Split the beam and measure both components',
      zh: '分离光束并测量两个分量',
    },
    descriptionEn: 'Use a PBS to split light into two orthogonal polarizations and detect both.',
    descriptionZh: '使用PBS将光分成两个正交偏振并检测。',
    availableComponents: ['splitter', 'sensor', 'mirror'],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 45 } },
    ],
    successCondition: {
      type: 'both',
      targetSensorId: 's1',
      minIntensity: 40,
      maxIntensity: 60,
    },
    hints: {
      en: [
        'PBS transmits p-polarization, reflects s-polarization',
        '45° input gives 50/50 split',
        'Place sensors in both beam paths',
      ],
      zh: [
        'PBS透射p偏振，反射s偏振',
        '45°输入产生50/50分束',
        '在两条光路放置传感器',
      ],
    },
    difficulty: 'hard',
  },
  {
    id: 'challenge-7',
    nameEn: 'Polarization Flip',
    nameZh: '偏振翻转',
    goal: {
      en: 'Rotate polarization from 0° to 90° without using polarizers',
      zh: '不使用偏振片将偏振从0°旋转到90°',
    },
    descriptionEn: 'Use only wave plates to rotate the polarization direction by 90°.',
    descriptionZh: '仅使用波片将偏振方向旋转90°。',
    availableComponents: ['waveplate'],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 500, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 620, y: 200, rotation: 0, properties: {} },
    ],
    successCondition: {
      type: 'intensity',
      targetSensorId: 's1',
      minIntensity: 95,
    },
    hints: {
      en: [
        'λ/2 plate rotates polarization by 2θ',
        'Fast axis at 45° rotates 0° → 90°',
        'No intensity loss with wave plates',
      ],
      zh: [
        'λ/2波片使偏振旋转2θ',
        '快轴45°可将0°旋转到90°',
        '波片不损失强度',
      ],
    },
    difficulty: 'hard',
  },
  {
    id: 'challenge-8',
    nameEn: 'Maximum Efficiency',
    nameZh: '最大效率',
    goal: {
      en: 'Get the highest possible intensity at the sensor using all provided components',
      zh: '使用所有提供的组件在传感器获得最高光强',
    },
    descriptionEn: 'Optimize the optical path for maximum transmission through multiple elements.',
    descriptionZh: '优化光路使多个元件的透射率最大。',
    availableComponents: [],
    initialSetup: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 30 } },
      { id: 'p2', type: 'polarizer', x: 320, y: 200, rotation: 0, properties: { angle: 60 } },
      { id: 'p3', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 's1', type: 'sensor', x: 600, y: 200, rotation: 0, properties: {} },
    ],
    successCondition: {
      type: 'intensity',
      targetSensorId: 's1',
      minIntensity: 35,
    },
    hints: {
      en: [
        'Align polarizers to minimize angle differences',
        'Maximum with equal spacing',
        'cos²(30°) × cos²(30°) ≈ 0.56',
      ],
      zh: [
        '对齐偏振片以最小化角度差',
        '等间距分布时最大',
        'cos²(30°) × cos²(30°) ≈ 0.56',
      ],
    },
    difficulty: 'expert',
  },
]

// ============================================
// Interactive Tutorials
// ============================================

export const TUTORIALS: Tutorial[] = [
  {
    id: 'getting-started',
    nameEn: 'Getting Started',
    nameZh: '入门教程',
    steps: [
      {
        id: 'welcome',
        titleEn: 'Welcome to Optical Design Studio',
        titleZh: '欢迎来到光学设计室',
        contentEn: 'This is an interactive optical bench where you can design and simulate light paths with various optical components.',
        contentZh: '这是一个交互式光学工作台，您可以使用各种光学元件设计和模拟光路。',
        position: 'bottom',
      },
      {
        id: 'add-emitter',
        target: '[data-component="emitter"]',
        titleEn: 'Adding a Light Source',
        titleZh: '添加光源',
        contentEn: 'Click on "Light Source" in the design panel to add an emitter. This produces polarized light.',
        contentZh: '点击设计面板中的"光源"添加发射器。它产生偏振光。',
        action: 'click',
        position: 'right',
      },
      {
        id: 'add-sensor',
        target: '[data-component="sensor"]',
        titleEn: 'Adding a Detector',
        titleZh: '添加探测器',
        contentEn: 'Add a sensor to detect the light. Place it in the path of the light beam.',
        contentZh: '添加传感器检测光线。将其放置在光束路径上。',
        action: 'click',
        position: 'right',
      },
      {
        id: 'start-simulation',
        target: '[data-button="simulate"]',
        titleEn: 'Start Simulation',
        titleZh: '开始模拟',
        contentEn: 'Click the Play button to start the light simulation and see the beam path.',
        contentZh: '点击播放按钮开始光路模拟，查看光束路径。',
        action: 'click',
        position: 'bottom',
      },
      {
        id: 'observe-reading',
        target: '[data-component="sensor-reading"]',
        titleEn: 'Reading the Sensor',
        titleZh: '读取传感器',
        contentEn: 'The sensor shows the light intensity as a percentage. 100% means full transmission.',
        contentZh: '传感器显示光强百分比。100%表示完全透射。',
        action: 'observe',
        position: 'left',
      },
      {
        id: 'complete',
        titleEn: 'Congratulations!',
        titleZh: '恭喜！',
        contentEn: 'You\'ve created your first optical setup! Try adding polarizers and wave plates to explore more.',
        contentZh: '您已创建第一个光学装置！尝试添加偏振片和波片探索更多。',
        position: 'bottom',
      },
    ],
  },
  {
    id: 'malus-law-tutorial',
    nameEn: "Understanding Malus's Law",
    nameZh: '理解马吕斯定律',
    steps: [
      {
        id: 'intro',
        titleEn: "Malus's Law",
        titleZh: '马吕斯定律',
        contentEn: 'Learn how light intensity changes when passing through polarizers at different angles.',
        contentZh: '学习光通过不同角度的偏振片时强度如何变化。',
        position: 'bottom',
      },
      {
        id: 'setup',
        titleEn: 'Experiment Setup',
        titleZh: '实验装置',
        contentEn: "We'll use a light source, two polarizers, and a sensor.",
        contentZh: '我们将使用光源、两块偏振片和传感器。',
        position: 'bottom',
      },
      {
        id: 'first-polarizer',
        titleEn: 'First Polarizer',
        titleZh: '第一块偏振片',
        contentEn: 'The first polarizer sets the polarization direction of the light to 0°.',
        contentZh: '第一块偏振片将光的偏振方向设为0°。',
        highlightComponent: 'p1',
        position: 'top',
      },
      {
        id: 'second-polarizer',
        titleEn: 'Second Polarizer (Analyzer)',
        titleZh: '第二块偏振片（检偏器）',
        contentEn: 'Rotate the second polarizer to see how intensity changes with angle.',
        contentZh: '旋转第二块偏振片观察强度随角度的变化。',
        highlightComponent: 'p2',
        action: 'rotate',
        position: 'top',
      },
      {
        id: 'formula',
        titleEn: 'The Formula',
        titleZh: '公式',
        contentEn: 'I = I₀ × cos²(θ), where θ is the angle between polarizers.',
        contentZh: 'I = I₀ × cos²(θ)，其中θ是两偏振片之间的夹角。',
        position: 'bottom',
      },
      {
        id: 'try-90',
        titleEn: 'Try 90° (Crossed Polarizers)',
        titleZh: '尝试90°（正交偏振片）',
        contentEn: 'When polarizers are crossed (90°), no light passes through. cos²(90°) = 0',
        contentZh: '当偏振片正交（90°）时，没有光通过。cos²(90°) = 0',
        action: 'rotate',
        position: 'top',
      },
      {
        id: 'try-45',
        titleEn: 'Try 45°',
        titleZh: '尝试45°',
        contentEn: 'At 45°, half the light passes through. cos²(45°) = 0.5',
        contentZh: '在45°时，一半的光通过。cos²(45°) = 0.5',
        action: 'rotate',
        position: 'top',
      },
      {
        id: 'complete',
        titleEn: 'Tutorial Complete',
        titleZh: '教程完成',
        contentEn: "You now understand Malus's Law! Try the experiments for more practice.",
        contentZh: '您现在理解了马吕斯定律！尝试实验进行更多练习。',
        position: 'bottom',
      },
    ],
  },
  {
    id: 'wave-plates-tutorial',
    nameEn: 'Wave Plates and Phase Retardation',
    nameZh: '波片与相位延迟',
    steps: [
      {
        id: 'intro',
        titleEn: 'Understanding Wave Plates',
        titleZh: '理解波片',
        contentEn: 'Wave plates change the polarization state by introducing phase delays between orthogonal components.',
        contentZh: '波片通过在正交分量之间引入相位延迟来改变偏振态。',
        position: 'bottom',
      },
      {
        id: 'qwp',
        titleEn: 'Quarter-Wave Plate (λ/4)',
        titleZh: '四分之一波片（λ/4）',
        contentEn: 'A λ/4 plate introduces 90° phase delay. It can convert linear to circular polarization.',
        contentZh: 'λ/4波片引入90°相位延迟。它可以将线偏振转换为圆偏振。',
        position: 'right',
      },
      {
        id: 'hwp',
        titleEn: 'Half-Wave Plate (λ/2)',
        titleZh: '二分之一波片（λ/2）',
        contentEn: 'A λ/2 plate introduces 180° phase delay. It rotates linear polarization by 2θ.',
        contentZh: 'λ/2波片引入180°相位延迟。它使线偏振旋转2θ。',
        position: 'right',
      },
      {
        id: 'experiment',
        titleEn: 'Try It Yourself',
        titleZh: '自己尝试',
        contentEn: 'Load the "Circular Polarization" experiment to see wave plates in action.',
        contentZh: '加载"圆偏振光产生"实验查看波片的作用。',
        action: 'click',
        position: 'left',
      },
      {
        id: 'complete',
        titleEn: 'Tutorial Complete',
        titleZh: '教程完成',
        contentEn: 'You now understand wave plates! Experiment with different orientations.',
        contentZh: '您现在理解波片了！尝试不同的取向。',
        position: 'bottom',
      },
    ],
  },
]

// ============================================
// Helper Functions
// ============================================

export function getExperimentById(id: string): ClassicExperiment | undefined {
  return CLASSIC_EXPERIMENTS.find(e => e.id === id)
}

export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find(c => c.id === id)
}

export function getTutorialById(id: string): Tutorial | undefined {
  return TUTORIALS.find(t => t.id === id)
}

export function getChallengesByDifficulty(difficulty: Challenge['difficulty']): Challenge[] {
  return CHALLENGES.filter(c => c.difficulty === difficulty)
}
