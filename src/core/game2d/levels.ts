/**
 * PolarQuest 2D - Redesigned Level System
 *
 * A completely redesigned level system with four progressive campaigns:
 * 1. The Vector - Linear Polarization & Intensity (Malus's Law)
 * 2. The Spin - Waveplates & Circular Polarization
 * 3. The Wave - Interference & Phase
 * 4. The Challenge - Complex Systems & Real Applications
 *
 * Design Philosophy:
 * - "Less is More": Start with empty grids and toolboxes, not pre-filled boards
 * - "Multiple Solutions": No single correct path - encourage creative optical circuits
 * - "Scientific Depth": Force understanding of Jones Calculus concepts
 * - "Show, Don't Tell": Learn by failing, then succeeding
 */

import { Level2D, Campaign, Difficulty } from './types'
import { STANDARD_JONES_VECTORS } from '../JonesCalculus'

// ============================================
// Campaign Metadata
// ============================================

export interface CampaignInfo {
  id: Campaign
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  icon: string
  color: string
}

export const CAMPAIGNS: Record<Campaign, CampaignInfo> = {
  vector: {
    id: 'vector',
    name: 'The Vector',
    nameZh: '矢量之道',
    description: 'Master linear polarization and the power of Malus\'s Law',
    descriptionZh: '掌握线偏振和马吕斯定律的力量',
    icon: '📐',
    color: '#22c55e',
  },
  spin: {
    id: 'spin',
    name: 'The Spin',
    nameZh: '旋转之术',
    description: 'Discover circular polarization through waveplates',
    descriptionZh: '通过波片发现圆偏振的奥秘',
    icon: '🌀',
    color: '#8b5cf6',
  },
  wave: {
    id: 'wave',
    name: 'The Wave',
    nameZh: '波动之理',
    description: 'Harness the power of interference and phase',
    descriptionZh: '驾驭干涉与相位的力量',
    icon: '🌊',
    color: '#3b82f6',
  },
  challenge: {
    id: 'challenge',
    name: 'The Challenge',
    nameZh: '终极挑战',
    description: 'Build real optical systems and quantum circuits',
    descriptionZh: '构建真实的光学系统与量子电路',
    icon: '🏆',
    color: '#f59e0b',
  },
}

// ============================================
// Helper: Jones Vector Shortcuts
// ============================================

const jonesH = STANDARD_JONES_VECTORS.horizontal
const jonesV = STANDARD_JONES_VECTORS.vertical
const jonesRCP = STANDARD_JONES_VECTORS.rightCircular
const jonesLCP = STANDARD_JONES_VECTORS.leftCircular


// ============================================
// CAMPAIGN 1: THE VECTOR
// Linear Polarization & Intensity Control
// ============================================

const VECTOR_CAMPAIGN: Level2D[] = [
  // --------------------------------------------
  // V1: The Paradox (Three-Polarizer Problem)
  // --------------------------------------------
  {
    id: 1,
    levelId: 'vector-paradox',
    name: 'The Paradox',
    nameZh: '悖论',
    description:
      'Source is 0° polarized. Target requires 90°. Direct path is blocked. How can light pass through crossed polarizers?',
    descriptionZh:
      '光源是0°偏振。目标需要90°。直接路径被阻挡。光如何能通过正交偏振片？',
    hint: 'A 45° polarizer between crossed polarizers allows some light through.',
    hintZh: '在正交偏振片之间放置45°偏振片可以让部分光通过。',
    difficulty: 'easy',
    campaign: 'vector',
    campaignOrder: 1,
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    inventory: { polarizer: 1 },
    concepts: [
      'Crossed polarizers block all light',
      'Intermediate polarizer projects to new angle',
      'cos²(45°) × cos²(45°) = 25% transmission',
    ],
    conceptsZh: [
      '正交偏振片阻挡所有光',
      '中间的偏振片将光投影到新角度',
      'cos²(45°) × cos²(45°) = 25%透过率',
    ],
    goalDescription: 'Get light to the sensor through the 90° barrier',
    goalDescriptionZh: '让光通过90°屏障到达传感器',
    victory: {
      sensorTargets: {
        s1: { type: 'any', minIntensity: 20 },
      },
    },
    components: [
      // Emitter: 0° horizontal polarization
      {
        id: 'e1',
        type: 'emitter',
        x: 15,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // First polarizer: 0° (locks in horizontal)
      {
        id: 'p1',
        type: 'polarizer',
        x: 30,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        locked: true,
      },
      // === PLAYER ZONE: Place 45° polarizer here ===
      // Second polarizer: 90° (the barrier - blocks horizontal)
      {
        id: 'p2',
        type: 'polarizer',
        x: 70,
        y: 50,
        angle: 0,
        polarizationAngle: 90,
        locked: true,
      },
      // Sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 20,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // V2: Precision Engineering (Exact Intensity)
  // --------------------------------------------
  {
    id: 2,
    levelId: 'vector-precision',
    name: 'Precision Engineering',
    nameZh: '精密工程',
    description:
      'The sensor requires EXACTLY 12.5% intensity. Use Malus\'s Law to achieve this precise value.',
    descriptionZh:
      '传感器需要精确的12.5%光强。使用马吕斯定律达到这个精确值。',
    hint: 'Three 45° polarizers: 0.5 × 0.5 × 0.5 = 0.125',
    hintZh: '三个45°偏振片：0.5 × 0.5 × 0.5 = 0.125',
    difficulty: 'medium',
    campaign: 'vector',
    campaignOrder: 2,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { polarizer: 4 },
    concepts: [
      'Malus\'s Law: I = I₀ × cos²(θ)',
      'Cascading polarizers multiply transmissions',
      'Precision control through angle selection',
    ],
    conceptsZh: [
      '马吕斯定律：I = I₀ × cos²(θ)',
      '级联偏振片的透过率相乘',
      '通过角度选择实现精确控制',
    ],
    goalDescription: 'Achieve exactly 12.5% (±2%) intensity at the sensor',
    goalDescriptionZh: '在传感器处达到精确的12.5%（±2%）光强',
    victory: {
      sensorTargets: {
        s1: { type: 'any', minIntensity: 10.5, maxIntensity: 14.5 },
      },
    },
    parComponentCount: 3,
    components: [
      // Emitter: Full intensity, 0°
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === PLAYER ZONE: Place polarizers ===
      // Sensor: Requires ~12.5%
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 10,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // V3: The Router (PBS - Split by Polarization)
  // --------------------------------------------
  {
    id: 3,
    levelId: 'vector-router',
    name: 'The Router',
    nameZh: '光路由器',
    description:
      'One beam, two destinations. Sensor A needs 0° light, Sensor B needs 90° light. Route them correctly!',
    descriptionZh:
      '一束光，两个目的地。传感器A需要0°光，传感器B需要90°光。正确路由它们！',
    hint: 'The PBS (splitter) separates 0° and 90° components.',
    hintZh: '偏振分束器（PBS）分离0°和90°分量。',
    difficulty: 'medium',
    campaign: 'vector',
    campaignOrder: 3,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { mirror: 2 },
    concepts: [
      'Polarizing beam splitter (PBS) separates H/V',
      'Birefringent crystals split by polarization',
      'Orthogonal states travel different paths',
    ],
    conceptsZh: [
      '偏振分束器（PBS）分离水平/垂直偏振',
      '双折射晶体按偏振分光',
      '正交态走不同路径',
    ],
    goalDescription: 'Route 0° to Sensor A, 90° to Sensor B',
    goalDescriptionZh: '将0°光路由到传感器A，90°光路由到传感器B',
    victory: {
      sensorTargets: {
        sA: { type: 'linear', linearAngle: 0, minIntensity: 40 },
        sB: { type: 'linear', linearAngle: 90, minIntensity: 40 },
      },
    },
    components: [
      // Emitter: 45° (equal H and V components)
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 45,
        direction: 'right',
        locked: true,
      },
      // PBS: Splits H (straight) and V (up)
      {
        id: 'pbs1',
        type: 'splitter',
        x: 35,
        y: 50,
        angle: 0,
        locked: true,
      },
      // === PLAYER ZONE: Mirrors to route beams ===
      // Sensor A: Requires 0°
      {
        id: 'sA',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 0,
        locked: true,
      },
      // Sensor B: Requires 90°
      {
        id: 'sB',
        type: 'sensor',
        x: 35,
        y: 15,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 90,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // V4: The Gradient (Smooth Intensity Ramp)
  // --------------------------------------------
  {
    id: 4,
    levelId: 'vector-gradient',
    name: 'The Gradient',
    nameZh: '渐变',
    description:
      'Create a cascade where each sensor receives LESS intensity than the previous one. Target: 100% → 75% → 50% → 25%.',
    descriptionZh:
      '创建一个级联，使每个传感器接收的光强递减。目标：100% → 75% → 50% → 25%。',
    hint: 'Use multiple polarizers at carefully chosen angles between sensors.',
    hintZh: '在传感器之间使用精心选择角度的多个偏振片。',
    difficulty: 'hard',
    campaign: 'vector',
    campaignOrder: 4,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { polarizer: 3, splitter: 2 },
    concepts: [
      'Beam splitting creates parallel paths',
      'Each path can be intensity-controlled independently',
      'Malus\'s Law precision control',
    ],
    conceptsZh: [
      '分束创建平行路径',
      '每条路径可独立控制光强',
      '马吕斯定律精确控制',
    ],
    goalDescription: 'Sensors receive: S1≥90%, S2=70-80%, S3=45-55%, S4=20-30%',
    goalDescriptionZh: '传感器接收：S1≥90%，S2=70-80%，S3=45-55%，S4=20-30%',
    victory: {
      sensorTargets: {
        s1: { type: 'any', minIntensity: 90 },
        s2: { type: 'any', minIntensity: 70, maxIntensity: 80 },
        s3: { type: 'any', minIntensity: 45, maxIntensity: 55 },
        s4: { type: 'any', minIntensity: 20, maxIntensity: 30 },
      },
    },
    components: [
      // Emitter
      {
        id: 'e1',
        type: 'emitter',
        x: 5,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Sensors (cascaded)
      {
        id: 's1',
        type: 'sensor',
        x: 95,
        y: 20,
        angle: 0,
        requiredIntensity: 90,
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 95,
        y: 40,
        angle: 0,
        requiredIntensity: 70,
        locked: true,
      },
      {
        id: 's3',
        type: 'sensor',
        x: 95,
        y: 60,
        angle: 0,
        requiredIntensity: 45,
        locked: true,
      },
      {
        id: 's4',
        type: 'sensor',
        x: 95,
        y: 80,
        angle: 0,
        requiredIntensity: 20,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // V5: Perfect Black (Maximum Extinction)
  // --------------------------------------------
  {
    id: 5,
    levelId: 'vector-black',
    name: 'Perfect Black',
    nameZh: '完美之黑',
    description:
      'Achieve near-perfect extinction: reduce light to less than 1% of its original intensity.',
    descriptionZh:
      '实现近乎完美的消光：将光强降低到原来的1%以下。',
    hint: 'Multiple crossed polarizers at small angles compound extinction.',
    hintZh: '小角度的多个交叉偏振片复合消光。',
    difficulty: 'hard',
    campaign: 'vector',
    campaignOrder: 5,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { polarizer: 6 },
    concepts: [
      'Extinction ratio = I_blocked / I_transmitted',
      'Cascading polarizers improve extinction',
      'cos²(θ)^n approaches 0 rapidly',
    ],
    conceptsZh: [
      '消光比 = 被阻挡光强 / 透过光强',
      '级联偏振片提高消光比',
      'cos²(θ)^n 快速趋近于0',
    ],
    goalDescription: 'Reduce intensity to <1% at the dark sensor',
    goalDescriptionZh: '将暗传感器处的光强降低到<1%',
    victory: {
      sensorTargets: {
        s1: { type: 'any', maxIntensity: 1 },
      },
    },
    components: [
      // Bright emitter
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === PLAYER ZONE: Extinction chain ===
      // Dark sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },
]

// ============================================
// CAMPAIGN 2: THE SPIN
// Waveplates & Circular Polarization
// ============================================

const SPIN_CAMPAIGN: Level2D[] = [
  // --------------------------------------------
  // S1: The Key (QWP Creates Circular)
  // --------------------------------------------
  {
    id: 6,
    levelId: 'spin-key',
    name: 'The Key',
    nameZh: '钥匙',
    description:
      'The Quantum Lock requires Left-Hand Circular Polarization (LCP). Linear and RCP are blocked!',
    descriptionZh:
      '量子锁需要左旋圆偏振光（LCP）。线偏振和右旋圆偏振都会被阻挡！',
    hint: 'QWP at 45° converts linear to circular. Input angle determines handedness.',
    hintZh: '45°的四分之一波片将线偏振转换为圆偏振。输入角度决定旋向。',
    difficulty: 'medium',
    campaign: 'spin',
    campaignOrder: 1,
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    inventory: { quarterWavePlate: 1, polarizer: 1 },
    concepts: [
      'QWP introduces λ/4 phase delay',
      'Linear 45° + QWP@0° → RCP',
      'Linear -45° + QWP@0° → LCP',
    ],
    conceptsZh: [
      '四分之一波片引入λ/4相位延迟',
      '线偏振45° + QWP@0° → 右旋',
      '线偏振-45° + QWP@0° → 左旋',
    ],
    goalDescription: 'Create LCP to unlock the sensor',
    goalDescriptionZh: '创造左旋圆偏振光解锁传感器',
    victory: {
      sensorTargets: {
        s1: {
          type: 'circular',
          handedness: 'left',
          jonesVector: jonesLCP(),
          fidelity: 0.95,
          minIntensity: 30,
        },
      },
    },
    components: [
      // Emitter: 0° (horizontal)
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === PLAYER ZONE: Polarizer → QWP ===
      // Circular filter (LCP only)
      {
        id: 'cf1',
        type: 'circularFilter',
        x: 70,
        y: 50,
        angle: 0,
        filterHandedness: 'left',
        locked: true,
      },
      // Sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 30,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // S2: The Rotator (HWP Rotates Polarization)
  // --------------------------------------------
  {
    id: 7,
    levelId: 'spin-rotator',
    name: 'The Rotator',
    nameZh: '旋转器',
    description:
      'Rotate polarization from 0° to 90° using ONLY half-wave plates. NO polarizers allowed!',
    descriptionZh:
      '仅使用半波片将偏振从0°旋转到90°。不允许使用偏振片！',
    hint: 'HWP at angle θ rotates polarization by 2θ.',
    hintZh: '角度θ的半波片将偏振旋转2θ。',
    difficulty: 'medium',
    campaign: 'spin',
    campaignOrder: 2,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { halfWavePlate: 2 },
    concepts: [
      'HWP flips polarization about fast axis',
      'Rotation = 2 × (fast axis angle)',
      'HWP@45° → 90° rotation',
    ],
    conceptsZh: [
      '半波片关于快轴翻转偏振',
      '旋转角度 = 2 × 快轴角度',
      'HWP@45° → 90°旋转',
    ],
    goalDescription: 'Convert H (0°) to V (90°) with >90% intensity',
    goalDescriptionZh: '将H（0°）转换为V（90°），保持>90%的光强',
    victory: {
      sensorTargets: {
        s1: {
          type: 'linear',
          linearAngle: 90,
          jonesVector: jonesV(),
          fidelity: 0.95,
          minIntensity: 90,
        },
      },
    },
    parComponentCount: 1,
    components: [
      // Emitter: 0°
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === PLAYER ZONE: HWPs only ===
      // Sensor: Requires V (90°)
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 90,
        requiredPolarization: 90,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // S3: The Isolator (Optical Diode)
  // --------------------------------------------
  {
    id: 8,
    levelId: 'spin-isolator',
    name: 'The Isolator',
    nameZh: '隔离器',
    description:
      'Design an optical isolator: light goes A→B, but reflections B→A are blocked. One-way light valve!',
    descriptionZh:
      '设计一个光学隔离器：光从A到B，但反射光B到A被阻挡。单向光阀！',
    hint: 'Polarizer + QWP@45°. Reflected light returns with 90° rotation.',
    hintZh: '偏振片 + 45°四分之一波片。反射光返回时偏振旋转90°。',
    difficulty: 'hard',
    campaign: 'spin',
    campaignOrder: 3,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { polarizer: 2, quarterWavePlate: 1 },
    concepts: [
      'Optical isolator = non-reciprocal device',
      'QWP converts linear ↔ circular',
      'Double pass through QWP = HWP effect (90° rotation)',
    ],
    conceptsZh: [
      '光学隔离器 = 非互易器件',
      '四分之一波片转换线偏振↔圆偏振',
      '双程通过四分之一波片 = 半波片效果（90°旋转）',
    ],
    goalDescription: 'Forward sensor activated, back-reflection blocked',
    goalDescriptionZh: '前向传感器激活，反向反射被阻挡',
    victory: {
      sensorTargets: {
        s_forward: { type: 'any', minIntensity: 40 },
        s_back: { type: 'any', maxIntensity: 5 },
      },
    },
    components: [
      // Emitter
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === ISOLATOR ZONE ===
      // Partial mirror (creates reflection)
      {
        id: 'm_partial',
        type: 'mirror',
        x: 75,
        y: 50,
        angle: 45,
        locked: true,
      },
      // Forward sensor
      {
        id: 's_forward',
        type: 'sensor',
        x: 75,
        y: 20,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
      // Back-reflection sensor (should be dark)
      {
        id: 's_back',
        type: 'sensor',
        x: 10,
        y: 30,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // S4: Chirality Swap (Change Handedness)
  // --------------------------------------------
  {
    id: 9,
    levelId: 'spin-chirality',
    name: 'Chirality Swap',
    nameZh: '手性转换',
    description:
      'Input is RCP. Convert it to LCP without losing intensity. Circular → Linear → Circular (opposite).',
    descriptionZh:
      '输入是右旋圆偏振。将其转换为左旋圆偏振而不损失光强。圆偏振→线偏振→圆偏振（反向）。',
    hint: 'QWP converts RCP→Linear. Another QWP (different angle) converts Linear→LCP.',
    hintZh: '四分之一波片将右旋转换为线偏振。另一个四分之一波片（不同角度）将线偏振转换为左旋。',
    difficulty: 'hard',
    campaign: 'spin',
    campaignOrder: 4,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { quarterWavePlate: 2, halfWavePlate: 1 },
    concepts: [
      'QWP reverses handedness when aligned with circular input',
      'HWP preserves circular but flips handedness',
      'Multiple paths to achieve chirality swap',
    ],
    conceptsZh: [
      '四分之一波片在与圆偏振对齐时反转旋向',
      '半波片保持圆偏振但翻转旋向',
      '多种路径可实现手性转换',
    ],
    goalDescription: 'Convert RCP to LCP with >80% intensity',
    goalDescriptionZh: '将右旋圆偏振转换为左旋圆偏振，保持>80%的光强',
    victory: {
      sensorTargets: {
        s1: {
          type: 'circular',
          handedness: 'left',
          jonesVector: jonesLCP(),
          fidelity: 0.90,
          minIntensity: 80,
        },
      },
    },
    components: [
      // Emitter: RCP
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
        emitterPolarizationType: 'circular',
        handedness: 'right',
        initialJones: jonesRCP(),
      },
      // === PLAYER ZONE ===
      // Sensor: Requires LCP
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 80,
        locked: true,
        requiredJones: jonesLCP(),
      },
    ],
  },

  // --------------------------------------------
  // S5: The Poincaré Walk (Geometric Phase)
  // --------------------------------------------
  {
    id: 10,
    levelId: 'spin-poincare',
    name: 'The Poincaré Walk',
    nameZh: '庞加莱漫步',
    description:
      'Trace a closed path on the Poincaré sphere using waveplates. Accumulate a geometric (Berry) phase!',
    descriptionZh:
      '使用波片在庞加莱球上描绘一个闭合路径。积累几何（贝里）相位！',
    hint: 'HWP moves on equator, QWP moves to poles. Closed path = geometric phase.',
    hintZh: '半波片在赤道上移动，四分之一波片移动到极点。闭合路径 = 几何相位。',
    difficulty: 'expert',
    campaign: 'spin',
    campaignOrder: 5,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { quarterWavePlate: 2, halfWavePlate: 2 },
    concepts: [
      'Poincaré sphere represents all polarization states',
      'Geometric phase = ½ × solid angle enclosed',
      'Berry phase has physical observable effects',
    ],
    conceptsZh: [
      '庞加莱球表示所有偏振态',
      '几何相位 = ½ × 所围立体角',
      '贝里相位具有可观测的物理效应',
    ],
    goalDescription: 'Return to original state with 90° phase shift',
    goalDescriptionZh: '返回原始态并带有90°相移',
    victory: {
      sensorTargets: {
        s1: {
          type: 'linear',
          linearAngle: 0,
          minIntensity: 70,
        },
      },
    },
    components: [
      // Emitter: H
      {
        id: 'e1',
        type: 'emitter',
        x: 5,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === WAVEPLATE CHAIN ===
      // Sensor: H with phase shift (verified via interference)
      {
        id: 's1',
        type: 'sensor',
        x: 95,
        y: 50,
        angle: 0,
        requiredIntensity: 70,
        requiredPolarization: 0,
        locked: true,
      },
    ],
  },
]

// ============================================
// CAMPAIGN 3: THE WAVE
// Interference & Phase Control
// ============================================

const WAVE_CAMPAIGN: Level2D[] = [
  // --------------------------------------------
  // W1: Darkness (Destructive Interference)
  // --------------------------------------------
  {
    id: 11,
    levelId: 'wave-darkness',
    name: 'Darkness',
    nameZh: '黑暗',
    description:
      'Two beams shine on the same sensor. Make the sensor read ZERO intensity through destructive interference!',
    descriptionZh:
      '两束光照射同一个传感器。通过相消干涉使传感器读数为零！',
    hint: '180° phase difference between beams causes complete cancellation.',
    hintZh: '光束之间180°的相位差导致完全抵消。',
    difficulty: 'medium',
    campaign: 'wave',
    campaignOrder: 1,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { phaseShifter: 2, mirror: 2 },
    concepts: [
      'Destructive interference: Δφ = 180° (π)',
      'Same polarization required for interference',
      'Amplitude cancellation: A + (-A) = 0',
    ],
    conceptsZh: [
      '相消干涉：Δφ = 180°（π）',
      '干涉需要相同偏振',
      '振幅抵消：A + (-A) = 0',
    ],
    goalDescription: 'Reduce combined intensity to <5%',
    goalDescriptionZh: '将合并光强降低到<5%',
    victory: {
      sensorTargets: {
        s1: { type: 'any', maxIntensity: 5 },
      },
    },
    components: [
      // Source A
      {
        id: 'eA',
        type: 'emitter',
        x: 10,
        y: 30,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Source B
      {
        id: 'eB',
        type: 'emitter',
        x: 10,
        y: 70,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Beam combiner (where beams meet)
      {
        id: 'bc1',
        type: 'beamCombiner',
        x: 70,
        y: 50,
        angle: 0,
        locked: true,
      },
      // Sensor (target: darkness)
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // W2: The Mach-Zehnder Interferometer
  // --------------------------------------------
  {
    id: 12,
    levelId: 'wave-mach-zehnder',
    name: 'The Mach-Zehnder',
    nameZh: '马赫-曾德尔',
    description:
      'Build an interferometer. Split the beam, phase shift one arm, recombine. Route 100% to one port by phase control alone!',
    descriptionZh:
      '构建干涉仪。分束、单臂相移、合束。仅通过相位控制将100%的光路由到一个端口！',
    hint: 'Phase shift of 0° → Port A bright. Phase shift of 180° → Port B bright.',
    hintZh: '相移0° → 端口A亮。相移180° → 端口B亮。',
    difficulty: 'hard',
    campaign: 'wave',
    campaignOrder: 2,
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    inventory: { phaseShifter: 1 },
    concepts: [
      'Mach-Zehnder = classic two-path interferometer',
      'Phase controls output port selection',
      'Energy conservation: bright + dark = input',
    ],
    conceptsZh: [
      '马赫-曾德尔 = 经典双路径干涉仪',
      '相位控制输出端口选择',
      '能量守恒：亮端口 + 暗端口 = 输入',
    ],
    goalDescription: 'Port A ≥90%, Port B ≤5%',
    goalDescriptionZh: '端口A ≥90%，端口B ≤5%',
    victory: {
      interferometerConfig: {
        brightPortId: 'sA',
        darkPortId: 'sB',
        brightMinIntensity: 90,
        darkMaxIntensity: 5,
      },
    },
    components: [
      // Source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 30,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // First splitter
      {
        id: 'bs1',
        type: 'splitter',
        x: 30,
        y: 30,
        angle: 0,
        crystalAxisAngle: 45, // 50/50 split
        locked: true,
      },
      // Upper arm (vertical path)
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 70,
        angle: 45,
        locked: true,
      },
      // Lower arm continues, then mirror
      {
        id: 'm2',
        type: 'mirror',
        x: 70,
        y: 30,
        angle: 135,
        locked: true,
      },
      // === PLAYER: Phase shifter on one arm ===
      // Second splitter (recombination)
      {
        id: 'bs2',
        type: 'splitter',
        x: 70,
        y: 70,
        angle: 0,
        crystalAxisAngle: 45,
        locked: true,
      },
      // Port A (bright target)
      {
        id: 'sA',
        type: 'sensor',
        x: 90,
        y: 70,
        angle: 0,
        requiredIntensity: 90,
        locked: true,
      },
      // Port B (dark target)
      {
        id: 'sB',
        type: 'sensor',
        x: 70,
        y: 90,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // W3: The XOR Gate (Optical Logic)
  // --------------------------------------------
  {
    id: 13,
    levelId: 'wave-xor',
    name: 'The XOR Gate',
    nameZh: '异或门',
    description:
      'Build an optical XOR: sensor ON if A OR B is active, but OFF if BOTH are active (they cancel out)!',
    descriptionZh:
      '构建光学异或门：当A或B激活时传感器ON，但当两者都激活时OFF（它们相消）！',
    hint: 'Set phase difference between paths to 180°.',
    hintZh: '将路径之间的相位差设置为180°。',
    difficulty: 'hard',
    campaign: 'wave',
    campaignOrder: 3,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { phaseShifter: 2, mirror: 2 },
    concepts: [
      'XOR truth table via interference',
      'A⊕B: destructive when both present',
      'Optical computing basics',
    ],
    conceptsZh: [
      '通过干涉实现异或真值表',
      'A⊕B：两者同时存在时相消',
      '光学计算基础',
    ],
    goalDescription: 'A or B → ON (≥40%), A and B → OFF (≤5%)',
    goalDescriptionZh: 'A或B → ON（≥40%），A和B → OFF（≤5%）',
    victory: {
      logicGateCondition: 'XOR',
    },
    components: [
      // Source A (can be toggled)
      {
        id: 'eA',
        type: 'emitter',
        x: 10,
        y: 25,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Source B (can be toggled)
      {
        id: 'eB',
        type: 'emitter',
        x: 10,
        y: 75,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === PLAYER: Phase shifters and routing ===
      // Beam combiner
      {
        id: 'bc1',
        type: 'beamCombiner',
        x: 70,
        y: 50,
        angle: 0,
        locked: true,
      },
      // XOR output sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // W4: The AND Gate (Coincidence Detection)
  // --------------------------------------------
  {
    id: 14,
    levelId: 'wave-and',
    name: 'The AND Gate',
    nameZh: '与门',
    description:
      'Build an optical AND: sensor ON only when BOTH A and B are active AND their phases match!',
    descriptionZh:
      '构建光学与门：只有当A和B都激活且相位匹配时传感器才ON！',
    hint: 'Require constructive interference: both beams must be in-phase.',
    hintZh: '需要相长干涉：两束光必须同相。',
    difficulty: 'expert',
    campaign: 'wave',
    campaignOrder: 4,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { phaseShifter: 2, polarizer: 2, splitter: 1 },
    concepts: [
      'Constructive interference requires matching phase',
      'Threshold detection simulates AND',
      'Two-photon effects in classical optics',
    ],
    conceptsZh: [
      '相长干涉需要匹配的相位',
      '阈值检测模拟与门',
      '经典光学中的双光子效应',
    ],
    goalDescription: 'Output ≥80% only when both sources active and aligned',
    goalDescriptionZh: '只有当两个光源都激活且对齐时输出≥80%',
    victory: {
      logicGateCondition: 'AND',
    },
    components: [
      // Source A
      {
        id: 'eA',
        type: 'emitter',
        x: 10,
        y: 30,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Source B
      {
        id: 'eB',
        type: 'emitter',
        x: 10,
        y: 70,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // === PLAYER: Alignment and combining ===
      // High-threshold sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 80,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // W5: Double Slit (Path Difference)
  // --------------------------------------------
  {
    id: 15,
    levelId: 'wave-double-slit',
    name: 'Double Slit',
    nameZh: '双缝',
    description:
      'Young\'s classic experiment! Adjust path difference to create constructive interference at the detector.',
    descriptionZh:
      '杨氏经典实验！调整光程差以在探测器处产生相长干涉。',
    hint: 'Phase = 0° or 360° for constructive, 180° for destructive.',
    hintZh: '相位 = 0°或360°时相长，180°时相消。',
    difficulty: 'medium',
    campaign: 'wave',
    campaignOrder: 5,
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    inventory: { phaseShifter: 1 },
    concepts: [
      'Young\'s double slit experiment',
      'Δφ = 2π × Δx / λ',
      'Constructive: Δφ = 0, 2π, 4π...',
    ],
    conceptsZh: [
      '杨氏双缝实验',
      'Δφ = 2π × Δx / λ',
      '相长干涉：Δφ = 0, 2π, 4π...',
    ],
    goalDescription: 'Achieve maximum constructive interference (≥90%)',
    goalDescriptionZh: '实现最大相长干涉（≥90%）',
    victory: {
      sensorTargets: {
        s1: { type: 'any', minIntensity: 90 },
      },
    },
    components: [
      // Source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Splitter (the "slits")
      {
        id: 'bs1',
        type: 'splitter',
        x: 30,
        y: 50,
        angle: 0,
        crystalAxisAngle: 45,
        locked: true,
      },
      // Upper path
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 25,
        angle: 135,
        locked: true,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 60,
        y: 25,
        angle: 45,
        locked: true,
      },
      // Lower path
      {
        id: 'm3',
        type: 'mirror',
        x: 60,
        y: 50,
        angle: 45,
        locked: true,
      },
      // === PHASE SHIFTER on one path ===
      // Recombination
      {
        id: 'bc1',
        type: 'beamCombiner',
        x: 60,
        y: 37,
        angle: 0,
        locked: true,
      },
      // Detector
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 37,
        angle: 0,
        requiredIntensity: 90,
        locked: true,
      },
    ],
  },
]

// ============================================
// CAMPAIGN 4: THE CHALLENGE
// Complex Systems & Real Applications
// ============================================

const CHALLENGE_CAMPAIGN: Level2D[] = [
  // --------------------------------------------
  // C1: The Lighthouse (Multi-Target Routing)
  // --------------------------------------------
  {
    id: 16,
    levelId: 'challenge-lighthouse',
    name: 'The Lighthouse',
    nameZh: '灯塔',
    description:
      'Route a single beam to hit 4 sensors simultaneously with different polarization requirements: 0°, 45°, 90°, and circular!',
    descriptionZh:
      '将一束光同时路由到4个传感器，每个传感器有不同的偏振要求：0°、45°、90°和圆偏振！',
    hint: 'Use splitters to create multiple paths, then adjust each path\'s polarization.',
    hintZh: '使用分束器创建多条路径，然后调整每条路径的偏振。',
    difficulty: 'expert',
    campaign: 'challenge',
    campaignOrder: 1,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { splitter: 3, mirror: 4, polarizer: 2, quarterWavePlate: 1, halfWavePlate: 1 },
    concepts: [
      'Beam splitting for parallel paths',
      'Independent polarization control per path',
      'System design and optimization',
    ],
    conceptsZh: [
      '分束创建平行路径',
      '每条路径独立控制偏振',
      '系统设计与优化',
    ],
    goalDescription: 'All 4 sensors activated with correct polarizations',
    goalDescriptionZh: '所有4个传感器以正确偏振激活',
    victory: {
      sensorTargets: {
        s0: { type: 'linear', linearAngle: 0, minIntensity: 20 },
        s45: { type: 'linear', linearAngle: 45, minIntensity: 20 },
        s90: { type: 'linear', linearAngle: 90, minIntensity: 20 },
        sC: { type: 'circular', handedness: 'right', minIntensity: 20 },
      },
    },
    components: [
      // Source: 45°
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 45,
        direction: 'right',
        locked: true,
      },
      // Sensors (4 corners)
      {
        id: 's0',
        type: 'sensor',
        x: 90,
        y: 15,
        angle: 0,
        requiredIntensity: 20,
        requiredPolarization: 0,
        locked: true,
      },
      {
        id: 's45',
        type: 'sensor',
        x: 90,
        y: 38,
        angle: 0,
        requiredIntensity: 20,
        requiredPolarization: 45,
        locked: true,
      },
      {
        id: 's90',
        type: 'sensor',
        x: 90,
        y: 62,
        angle: 0,
        requiredIntensity: 20,
        requiredPolarization: 90,
        locked: true,
      },
      {
        id: 'sC',
        type: 'sensor',
        x: 90,
        y: 85,
        angle: 0,
        requiredIntensity: 20,
        locked: true,
        requiredJones: jonesRCP(),
      },
    ],
  },

  // --------------------------------------------
  // C2: BB84 Key Distribution
  // --------------------------------------------
  {
    id: 17,
    levelId: 'challenge-bb84',
    name: 'BB84 Protocol',
    nameZh: 'BB84协议',
    description:
      'Implement quantum key distribution! Alice sends in H/V or +45/-45 basis. Build Bob\'s receiver to measure both bases correctly.',
    descriptionZh:
      '实现量子密钥分发！Alice以H/V或+45/-45基底发送。构建Bob的接收器以正确测量两种基底。',
    hint: 'Use PBS for H/V separation. Rotate by 45° before second PBS for diagonal basis.',
    hintZh: '使用PBS分离H/V。在第二个PBS前旋转45°以测量对角基底。',
    difficulty: 'master',
    campaign: 'challenge',
    campaignOrder: 2,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { splitter: 2, halfWavePlate: 2, mirror: 4 },
    concepts: [
      'BB84 quantum key distribution',
      'Conjugate bases: H/V and +45/-45',
      'No-cloning theorem prevents eavesdropping',
    ],
    conceptsZh: [
      'BB84量子密钥分发',
      '共轭基底：H/V和+45/-45',
      '不可克隆定理防止窃听',
    ],
    goalDescription: 'Route each basis to correct detector pair',
    goalDescriptionZh: '将每个基底路由到正确的探测器对',
    victory: {
      sensorTargets: {
        sH: { type: 'linear', linearAngle: 0, minIntensity: 30 },
        sV: { type: 'linear', linearAngle: 90, minIntensity: 30 },
        s45: { type: 'linear', linearAngle: 45, minIntensity: 30 },
        s135: { type: 'linear', linearAngle: 135, minIntensity: 30 },
      },
    },
    components: [
      // Alice's source (configurable)
      {
        id: 'alice',
        type: 'emitter',
        x: 5,
        y: 50,
        angle: 0,
        polarizationAngle: 0, // Varies: 0, 45, 90, 135
        direction: 'right',
        locked: true,
      },
      // === BOB'S RECEIVER ===
      // H/V detectors
      {
        id: 'sH',
        type: 'sensor',
        x: 95,
        y: 20,
        angle: 0,
        requiredIntensity: 30,
        requiredPolarization: 0,
        locked: true,
      },
      {
        id: 'sV',
        type: 'sensor',
        x: 95,
        y: 40,
        angle: 0,
        requiredIntensity: 30,
        requiredPolarization: 90,
        locked: true,
      },
      // +45/-45 detectors
      {
        id: 's45',
        type: 'sensor',
        x: 95,
        y: 60,
        angle: 0,
        requiredIntensity: 30,
        requiredPolarization: 45,
        locked: true,
      },
      {
        id: 's135',
        type: 'sensor',
        x: 95,
        y: 80,
        angle: 0,
        requiredIntensity: 30,
        requiredPolarization: 135,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // C3: The Black Box (Unknown Element)
  // --------------------------------------------
  {
    id: 18,
    levelId: 'challenge-blackbox',
    name: 'The Black Box',
    nameZh: '黑盒',
    description:
      'A hidden optical element sits in the center. Probe it with different polarizations to determine what it is, then compensate for its effect!',
    descriptionZh:
      '一个隐藏的光学元件位于中央。用不同偏振探测它以确定它是什么，然后补偿其效应！',
    hint: 'The mystery box is a QWP. Use another QWP to cancel its effect.',
    hintZh: '神秘盒子是一个四分之一波片。使用另一个四分之一波片来抵消其效应。',
    difficulty: 'master',
    campaign: 'challenge',
    campaignOrder: 3,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { polarizer: 2, quarterWavePlate: 2, halfWavePlate: 1 },
    concepts: [
      'Polarimetry: measuring unknown optical elements',
      'Jones matrix characterization',
      'Compensation and null methods',
    ],
    conceptsZh: [
      '偏振测量：测量未知光学元件',
      '琼斯矩阵表征',
      '补偿和零差法',
    ],
    goalDescription: 'Restore original linear polarization after the mystery box',
    goalDescriptionZh: '在神秘盒子之后恢复原始线偏振',
    victory: {
      sensorTargets: {
        s1: {
          type: 'linear',
          linearAngle: 0,
          jonesVector: jonesH(),
          fidelity: 0.95,
          minIntensity: 70,
        },
      },
    },
    components: [
      // Source: H
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // THE BLACK BOX (hidden QWP at 45°)
      {
        id: 'mystery',
        type: 'mysteryBox',
        x: 40,
        y: 50,
        angle: 45,
        locked: true,
        hiddenElementType: 'quarterWavePlate',
        hiddenElementAngle: 45,
      },
      // === PLAYER: Compensation zone ===
      // Sensor: Requires H
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 70,
        requiredPolarization: 0,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // C4: Quantum Eraser
  // --------------------------------------------
  {
    id: 19,
    levelId: 'challenge-eraser',
    name: 'Quantum Eraser',
    nameZh: '量子擦除器',
    description:
      'Interference pattern exists. Add polarizer "marks" to destroy it. Then "erase" the marks to restore interference!',
    descriptionZh:
      '存在干涉图样。添加偏振片"标记"来破坏它。然后"擦除"标记以恢复干涉！',
    hint: 'Mark both paths with orthogonal polarizations to kill interference. A 45° analyzer "erases" the which-path info.',
    hintZh: '用正交偏振标记两条路径以消除干涉。45°检偏器"擦除"路径信息。',
    difficulty: 'master',
    campaign: 'challenge',
    campaignOrder: 4,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { polarizer: 3, phaseShifter: 1 },
    concepts: [
      'Which-path information destroys interference',
      'Orthogonal polarizations cannot interfere',
      '45° analyzer projects both to same state',
    ],
    conceptsZh: [
      '路径信息破坏干涉',
      '正交偏振无法干涉',
      '45°检偏器将两者投影到相同态',
    ],
    goalDescription: 'Restore interference pattern after marking paths',
    goalDescriptionZh: '在标记路径后恢复干涉图样',
    victory: {
      sensorTargets: {
        s1: { type: 'any', minIntensity: 20 },
      },
    },
    components: [
      // Source: 45°
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 45,
        direction: 'right',
        locked: true,
      },
      // Splitter
      {
        id: 'bs1',
        type: 'splitter',
        x: 25,
        y: 50,
        angle: 0,
        locked: true,
      },
      // Upper path
      {
        id: 'm1',
        type: 'mirror',
        x: 25,
        y: 25,
        angle: 135,
        locked: true,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 55,
        y: 25,
        angle: 45,
        locked: true,
      },
      // Lower path
      {
        id: 'm3',
        type: 'mirror',
        x: 55,
        y: 50,
        angle: 45,
        locked: true,
      },
      // === MARK/ERASE ZONE ===
      // Combiner
      {
        id: 'bs2',
        type: 'splitter',
        x: 55,
        y: 37,
        angle: 0,
        locked: true,
      },
      // Final sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 37,
        angle: 0,
        requiredIntensity: 20,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // C5: The Photonic Router
  // --------------------------------------------
  {
    id: 20,
    levelId: 'challenge-router',
    name: 'The Photonic Router',
    nameZh: '光子路由器',
    description:
      'Build a 2×2 optical switch. Route Input A to Output 1 AND Input B to Output 2 with ZERO crosstalk!',
    descriptionZh:
      '构建2×2光开关。将输入A路由到输出1，将输入B路由到输出2，零串扰！',
    hint: 'Use different polarizations as "addresses". PBS routes by polarization.',
    hintZh: '使用不同偏振作为"地址"。PBS按偏振路由。',
    difficulty: 'master',
    campaign: 'challenge',
    campaignOrder: 5,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: { splitter: 2, halfWavePlate: 2, mirror: 4, polarizer: 2 },
    concepts: [
      'Optical switching and routing',
      'Polarization as routing address',
      'Non-blocking switch architecture',
    ],
    conceptsZh: [
      '光开关与路由',
      '偏振作为路由地址',
      '无阻塞开关架构',
    ],
    goalDescription: 'A→1, B→2, with full isolation',
    goalDescriptionZh: 'A→1，B→2，完全隔离',
    victory: {
      sensorTargets: {
        s1: { type: 'any', minIntensity: 40 },
        s2: { type: 'any', minIntensity: 40 },
      },
    },
    components: [
      // Input A: H
      {
        id: 'eA',
        type: 'emitter',
        x: 5,
        y: 25,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Input B: V
      {
        id: 'eB',
        type: 'emitter',
        x: 5,
        y: 75,
        angle: 0,
        polarizationAngle: 90,
        direction: 'right',
        locked: true,
      },
      // === ROUTING FABRIC ===
      // Output 1 (should receive A)
      {
        id: 's1',
        type: 'sensor',
        x: 95,
        y: 25,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
      // Output 2 (should receive B)
      {
        id: 's2',
        type: 'sensor',
        x: 95,
        y: 75,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
    ],
  },

  // --------------------------------------------
  // C6: The Grand Challenge (Final Boss)
  // --------------------------------------------
  {
    id: 21,
    levelId: 'challenge-grand',
    name: 'The Grand Challenge',
    nameZh: '终极挑战',
    description:
      'Combine ALL your knowledge: split, route, convert to circular, create interference, and activate 6 sensors with precise requirements!',
    descriptionZh:
      '综合所有知识：分束、路由、转换为圆偏振、创建干涉，并以精确要求激活6个传感器！',
    hint: 'Break the problem into sub-circuits. Solve each requirement independently, then integrate.',
    hintZh: '将问题分解为子电路。独立解决每个要求，然后整合。',
    difficulty: 'master',
    campaign: 'challenge',
    campaignOrder: 6,
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    inventory: {
      polarizer: 4,
      mirror: 6,
      splitter: 3,
      quarterWavePlate: 2,
      halfWavePlate: 2,
      phaseShifter: 2,
    },
    concepts: [
      'System integration',
      'Multi-objective optimization',
      'All polarization physics combined',
    ],
    conceptsZh: [
      '系统集成',
      '多目标优化',
      '所有偏振物理的综合',
    ],
    goalDescription: 'Activate all 6 sensors with correct polarization and intensity',
    goalDescriptionZh: '以正确的偏振和光强激活所有6个传感器',
    victory: {
      allSensorsActivated: true,
    },
    components: [
      // Single source
      {
        id: 'e1',
        type: 'emitter',
        x: 5,
        y: 50,
        angle: 0,
        polarizationAngle: 45,
        direction: 'right',
        locked: true,
      },
      // 6 sensors with varied requirements
      {
        id: 's1',
        type: 'sensor',
        x: 95,
        y: 10,
        angle: 0,
        requiredIntensity: 10,
        requiredPolarization: 0,
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 95,
        y: 28,
        angle: 0,
        requiredIntensity: 15,
        requiredPolarization: 45,
        locked: true,
      },
      {
        id: 's3',
        type: 'sensor',
        x: 95,
        y: 46,
        angle: 0,
        requiredIntensity: 10,
        requiredPolarization: 90,
        locked: true,
      },
      {
        id: 's4',
        type: 'sensor',
        x: 95,
        y: 64,
        angle: 0,
        requiredIntensity: 10,
        locked: true,
        requiredJones: jonesRCP(),
      },
      {
        id: 's5',
        type: 'sensor',
        x: 95,
        y: 82,
        angle: 0,
        requiredIntensity: 10,
        locked: true,
        requiredJones: jonesLCP(),
      },
      // Interference-based sensor (requires two beams)
      {
        id: 's6',
        type: 'sensor',
        x: 50,
        y: 95,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
    ],
  },
]

// ============================================
// Combined Levels Array
// ============================================

export const LEVELS: Level2D[] = [
  ...VECTOR_CAMPAIGN,
  ...SPIN_CAMPAIGN,
  ...WAVE_CAMPAIGN,
  ...CHALLENGE_CAMPAIGN,
]

// ============================================
// Helper Functions
// ============================================

/**
 * Get all levels for a specific campaign
 */
export function getLevelsByCampaign(campaign: Campaign): Level2D[] {
  return LEVELS.filter((level) => level.campaign === campaign)
    .sort((a, b) => a.campaignOrder - b.campaignOrder)
}

/**
 * Get all levels at or below a specific difficulty
 */
export function getLevelsByMaxDifficulty(maxDifficulty: Difficulty): Level2D[] {
  const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard', 'expert', 'master']
  const maxIndex = difficultyOrder.indexOf(maxDifficulty)
  return LEVELS.filter((level) => difficultyOrder.indexOf(level.difficulty) <= maxIndex)
}

/**
 * Get a level by its string ID
 */
export function getLevelById(levelId: string): Level2D | undefined {
  return LEVELS.find((level) => level.levelId === levelId)
}

/**
 * Get the next level in a campaign
 */
export function getNextLevelInCampaign(currentLevel: Level2D): Level2D | undefined {
  const campaignLevels = getLevelsByCampaign(currentLevel.campaign)
  const currentIndex = campaignLevels.findIndex((l) => l.id === currentLevel.id)
  return campaignLevels[currentIndex + 1]
}

/**
 * Check if all campaigns are unlocked (placeholder for progression system)
 */
export function isCampaignUnlocked(campaign: Campaign, completedLevelIds: string[]): boolean {
  const prerequisites: Record<Campaign, Campaign | null> = {
    vector: null,
    spin: 'vector',
    wave: 'spin',
    challenge: 'wave',
  }

  const prereq = prerequisites[campaign]
  if (!prereq) return true

  // Require completing at least 3 levels from prerequisite campaign
  const prereqLevels = getLevelsByCampaign(prereq)
  const completedPrereqs = prereqLevels.filter((l) => completedLevelIds.includes(l.levelId))
  return completedPrereqs.length >= 3
}

/**
 * Get campaign completion percentage
 */
export function getCampaignProgress(campaign: Campaign, completedLevelIds: string[]): number {
  const campaignLevels = getLevelsByCampaign(campaign)
  const completed = campaignLevels.filter((l) => completedLevelIds.includes(l.levelId))
  return campaignLevels.length > 0 ? (completed.length / campaignLevels.length) * 100 : 0
}
