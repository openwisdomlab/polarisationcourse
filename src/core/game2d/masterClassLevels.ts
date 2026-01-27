/**
 * Master Class Campaign Levels for PolarQuest 2D
 *
 * These levels use the upgraded Jones Calculus physics engine with:
 * - QuantumLock: High-fidelity sensors requiring >99% state match
 * - InterferometerTarget: Dual-port sensors for interference puzzles
 * - OpticalMine: Danger zones requiring careful routing
 *
 * Design Philosophy:
 * 1. "Show, Don't Tell" - Learn concepts by failing, then succeeding
 * 2. Multiple Solutions - No pixel hunting, allow creativity
 * 3. Emergent Complexity - Simple tools, complex systems
 *
 * Campaigns:
 * - "The Hacker" (Logic & Cryptography)
 * - "The Artist" (Wave Sculpting)
 */

import type { OpticalComponent } from '@/components/shared/optical/types'
import { STANDARD_JONES_VECTORS } from '../JonesCalculus'

export interface MasterClassLevel {
  id: string
  campaign: 'hacker' | 'artist' | 'tutorial'
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  difficulty: 'apprentice' | 'journeyman' | 'master' | 'grandmaster'
  concepts: string[]
  conceptsZh: string[]
  goalDescription: string
  goalDescriptionZh: string
  hint?: string
  hintZh?: string
  components: OpticalComponent[]
  gridSize: { width: number; height: number }
  openEnded: boolean

  // Scoring criteria
  parComponentCount?: number // Target component count for gold medal
  perfectFidelity?: number // Target fidelity for bonus points
}

// ===========================================
// Helper: Create standard Jones vectors
// ===========================================

const jonesH = STANDARD_JONES_VECTORS.horizontal
const jonesV = STANDARD_JONES_VECTORS.vertical
const jonesRCP = STANDARD_JONES_VECTORS.rightCircular
const jonesLCP = STANDARD_JONES_VECTORS.leftCircular

// ===========================================
// TUTORIAL LEVELS - Introduction to New Mechanics
// ===========================================

export const MASTER_CLASS_TUTORIAL_LEVELS: MasterClassLevel[] = [
  // Tutorial 1: Introduction to Quantum Locks
  {
    id: 'mc-tutorial-1',
    campaign: 'tutorial',
    name: 'The First Lock',
    nameZh: '第一把锁',
    description:
      'The Quantum Lock only opens when the polarization STATE matches exactly. ' +
      'Can you create Left-Hand Circular (LCP) light?',
    descriptionZh:
      '量子锁只有在偏振态完全匹配时才会打开。你能创造出左旋圆偏振光吗？',
    difficulty: 'apprentice',
    concepts: [
      'Quarter-wave plates convert linear to circular',
      'Fidelity measures state similarity',
      '99% match required to unlock',
    ],
    conceptsZh: [
      '四分之一波片将线偏振转换为圆偏振',
      '保真度衡量态的相似程度',
      '需要99%的匹配才能解锁',
    ],
    goalDescription: 'Create LCP light to open the Quantum Lock',
    goalDescriptionZh: '创造左旋圆偏振光来打开量子锁',
    hint: 'Place a QWP at 45° after the source',
    hintZh: '在光源后放置一个45°的四分之一波片',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    parComponentCount: 1,
    components: [
      // Emitter: Horizontal linear polarization
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
      // Quarter-wave plate (player places this)
      {
        id: 'qwp1',
        type: 'quarterWavePlate',
        x: 40,
        y: 50,
        angle: 45, // Initial angle - player can adjust
        locked: false,
      },
      // Quantum Lock: Requires LCP
      {
        id: 'ql1',
        type: 'quantumLock',
        x: 85,
        y: 50,
        angle: 0,
        locked: true,
        targetJones: jonesLCP(),
        requiredFidelity: 0.99,
        requiredIntensity: 30,
        targetStateName: 'Left Circular (LCP)',
        targetStateNameZh: '左旋圆偏振',
        showTargetHint: true,
      },
    ],
  },

  // Tutorial 2: The Interferometer Introduction
  {
    id: 'mc-tutorial-2',
    campaign: 'tutorial',
    name: 'Bright and Dark',
    nameZh: '明与暗',
    description:
      'An interferometer splits light into two paths. ' +
      'One output is bright (constructive), one is dark (destructive). ' +
      'Can you route ALL light to Port A?',
    descriptionZh:
      '干涉仪将光分成两条路径。一个输出是亮的（相长），一个是暗的（相消）。' +
      '你能把所有的光都引导到端口A吗？',
    difficulty: 'apprentice',
    concepts: [
      'Beam splitters create two coherent paths',
      'Phase determines interference type',
      'Constructive interference: same phase',
    ],
    conceptsZh: [
      '分束器创建两条相干路径',
      '相位决定干涉类型',
      '相长干涉：同相位',
    ],
    goalDescription: 'Port A ≥90%, Port B ≤5%',
    goalDescriptionZh: '端口A ≥90%，端口B ≤5%',
    hint: 'Adjust the phase shifter to 0° for constructive interference at Port A',
    hintZh: '将相移器调整到0°以在端口A获得相长干涉',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    parComponentCount: 0,
    components: [
      // Emitter
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
      // First beam splitter (50/50)
      {
        id: 'bs1',
        type: 'splitter',
        x: 30,
        y: 30,
        angle: 0,
        crystalAxisAngle: 45,
        locked: true,
      },
      // Mirror for upper path
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 70,
        angle: 45,
        locked: true,
      },
      // Mirror for lower path
      {
        id: 'm2',
        type: 'mirror',
        x: 70,
        y: 30,
        angle: 135,
        locked: true,
      },
      // Phase shifter (player adjusts this)
      {
        id: 'ps1',
        type: 'phaseShifter',
        x: 50,
        y: 70,
        angle: 0,
        phaseShift: 0, // Player can adjust
        locked: false,
      },
      // Second beam splitter (recombination)
      {
        id: 'bs2',
        type: 'splitter',
        x: 70,
        y: 70,
        angle: 0,
        crystalAxisAngle: 45,
        locked: true,
      },
      // Interferometer Port A (bright)
      {
        id: 'itA',
        type: 'interferometerTarget',
        x: 90,
        y: 70,
        angle: 0,
        locked: true,
        isInterferometerPortA: true,
        minIntensityForBright: 90,
        linkedPortId: 'itB',
      },
      // Interferometer Port B (dark)
      {
        id: 'itB',
        type: 'interferometerTarget',
        x: 70,
        y: 90,
        angle: 0,
        locked: true,
        isInterferometerPortB: true,
        maxIntensityForDark: 5,
        linkedPortId: 'itA',
      },
    ],
  },

  // Tutorial 3: Optical Mine Introduction
  {
    id: 'mc-tutorial-3',
    campaign: 'tutorial',
    name: 'Danger Zone',
    nameZh: '危险地带',
    description:
      'Optical Mines explode if too much light touches them! ' +
      'But this one has a weakness: LCP light passes through safely.',
    descriptionZh:
      '光学地雷在接收过多的光时会爆炸！但这个有一个弱点：左旋圆偏振光可以安全通过。',
    difficulty: 'apprentice',
    concepts: [
      'Mines trigger at threshold intensity',
      'Safe states can bypass mines',
      'Use QWP to create circular polarization',
    ],
    conceptsZh: [
      '地雷在阈值强度时触发',
      '安全态可以绕过地雷',
      '使用四分之一波片创造圆偏振',
    ],
    goalDescription: 'Reach the sensor without triggering the mine',
    goalDescriptionZh: '在不触发地雷的情况下到达传感器',
    hint: 'Create LCP light before the mine',
    hintZh: '在地雷之前创造左旋圆偏振光',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    parComponentCount: 1,
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
      // QWP (player places)
      {
        id: 'qwp1',
        type: 'quarterWavePlate',
        x: 30,
        y: 50,
        angle: 45,
        locked: false,
      },
      // Optical Mine (LCP safe)
      {
        id: 'om1',
        type: 'opticalMine',
        x: 55,
        y: 50,
        angle: 0,
        locked: true,
        mineThreshold: 5,
        safeJones: jonesLCP(),
        safeTolerance: 0.9,
        safeStateName: 'LCP',
        safeStateNameZh: '左旋圆偏振',
      },
      // Sensor
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 50,
        angle: 0,
        locked: true,
        requiredIntensity: 30,
      },
    ],
  },
]

// ===========================================
// "THE HACKER" CAMPAIGN - Logic & Cryptography
// ===========================================

export const HACKER_CAMPAIGN_LEVELS: MasterClassLevel[] = [
  // Level H1: The XOR Gate
  {
    id: 'hacker-xor',
    campaign: 'hacker',
    name: 'The XOR Gate',
    nameZh: '异或门',
    description:
      'Design an optical circuit where the sensor lights up if SOURCE A *or* SOURCE B is on, ' +
      'but goes DARK when BOTH are on (interference cancellation).',
    descriptionZh:
      '设计一个光学电路：当光源A或光源B开启时传感器亮起，' +
      '但当两个都开启时（干涉相消）传感器熄灭。',
    difficulty: 'journeyman',
    concepts: [
      'XOR logic via destructive interference',
      'Phase control creates logic gates',
      'Coherent beams can cancel',
    ],
    conceptsZh: [
      '通过相消干涉实现异或逻辑',
      '相位控制可以创造逻辑门',
      '相干光束可以抵消',
    ],
    goalDescription: 'A or B → ON, A and B → OFF',
    goalDescriptionZh: 'A或B → 亮，A和B → 暗',
    hint: 'Use a phase shifter to create 180° difference between paths',
    hintZh: '使用相移器在两条路径之间创造180°的相位差',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    parComponentCount: 3,
    components: [
      // Source A (can be toggled on/off in game)
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
      // Phase shifter for path A
      {
        id: 'psA',
        type: 'phaseShifter',
        x: 40,
        y: 30,
        angle: 0,
        phaseShift: 0,
        locked: false,
      },
      // Phase shifter for path B
      {
        id: 'psB',
        type: 'phaseShifter',
        x: 40,
        y: 70,
        angle: 0,
        phaseShift: 180, // Creates destructive when both on
        locked: false,
      },
      // Combiner (beam combiner)
      {
        id: 'bc1',
        type: 'beamCombiner',
        x: 70,
        y: 50,
        angle: 0,
        locked: true,
      },
      // Mirror to route A down
      {
        id: 'mA',
        type: 'mirror',
        x: 60,
        y: 30,
        angle: 135,
        locked: true,
      },
      // Mirror to route B up
      {
        id: 'mB',
        type: 'mirror',
        x: 60,
        y: 70,
        angle: 45,
        locked: true,
      },
      // XOR output sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        locked: true,
        requiredIntensity: 40,
      },
    ],
  },

  // Level H2: The Invisible Wall
  {
    id: 'hacker-invisible-wall',
    campaign: 'hacker',
    name: 'The Invisible Wall',
    nameZh: '隐形墙',
    description:
      'A polarized barrier blocks all Horizontal light. ' +
      'Get light through WITHOUT rotating the source!',
    descriptionZh:
      '一个偏振屏障阻挡所有水平偏振光。在不旋转光源的情况下让光通过！',
    difficulty: 'journeyman',
    concepts: [
      'QWP can bypass polarization filters',
      'H → Circular → Back to H after second QWP',
      'Circular light has no horizontal/vertical component',
    ],
    conceptsZh: [
      '四分之一波片可以绕过偏振滤波器',
      'H → 圆偏振 → 经过第二个四分之一波片后变回H',
      '圆偏振光没有水平/垂直分量',
    ],
    goalDescription: 'Get 50%+ intensity through the barrier',
    goalDescriptionZh: '让50%以上的光强通过屏障',
    hint: 'QWP → Barrier → QWP (with correct angles)',
    hintZh: 'QWP → 屏障 → QWP（使用正确的角度）',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    parComponentCount: 2,
    components: [
      // Emitter: Horizontal (locked)
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0, // Horizontal
        direction: 'right',
        locked: true,
      },
      // QWP 1 (player places)
      {
        id: 'qwp1',
        type: 'quarterWavePlate',
        x: 25,
        y: 50,
        angle: 45,
        locked: false,
      },
      // THE WALL: Vertical polarizer (blocks H)
      {
        id: 'wall',
        type: 'polarizer',
        x: 50,
        y: 50,
        angle: 0,
        polarizationAngle: 90, // Vertical - blocks H
        locked: true,
      },
      // QWP 2 (player places)
      {
        id: 'qwp2',
        type: 'quarterWavePlate',
        x: 75,
        y: 50,
        angle: -45,
        locked: false,
      },
      // Sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        locked: true,
        requiredIntensity: 40,
      },
    ],
  },

  // Level H3: The BB84 Receiver (Quantum Cryptography)
  {
    id: 'hacker-bb84',
    campaign: 'hacker',
    name: 'The BB84 Protocol',
    nameZh: 'BB84协议',
    description:
      'Alice sends light in either H/V or +45/-45 basis. ' +
      'Build a receiver that can measure BOTH bases correctly!',
    descriptionZh:
      'Alice以H/V或+45/-45基底发送光。建造一个可以正确测量两种基底的接收器！',
    difficulty: 'master',
    concepts: [
      'Quantum key distribution basics',
      'Basis choice affects measurement',
      'Cannot simultaneously measure both bases',
    ],
    conceptsZh: [
      '量子密钥分发基础',
      '基底选择影响测量',
      '不能同时测量两种基底',
    ],
    goalDescription: 'Route to correct sensor based on input basis',
    goalDescriptionZh: '根据输入基底将光路由到正确的传感器',
    hint: 'Use a PBS to separate H/V, and rotators for diagonal basis',
    hintZh: '使用PBS分离H/V，旋转器用于对角基底',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    parComponentCount: 4,
    components: [
      // Alice's source (can be any of 4 states)
      {
        id: 'alice',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0, // Will be varied in game
        direction: 'right',
        locked: true,
      },
      // Beam splitter (basis separator)
      {
        id: 'bs1',
        type: 'splitter',
        x: 35,
        y: 50,
        angle: 0,
        crystalAxisAngle: 0, // H/V split
        locked: false,
      },
      // Rotator for diagonal basis
      {
        id: 'rot1',
        type: 'rotator',
        x: 50,
        y: 50,
        angle: 0,
        rotationAmount: 45,
        locked: false,
      },
      // H/V detector (quantum lock for H)
      {
        id: 'detH',
        type: 'quantumLock',
        x: 85,
        y: 30,
        angle: 0,
        locked: true,
        targetJones: jonesH(),
        requiredFidelity: 0.9,
        requiredIntensity: 20,
        targetStateName: 'H (Horizontal)',
        targetStateNameZh: '水平偏振',
        showTargetHint: true,
      },
      // V detector
      {
        id: 'detV',
        type: 'quantumLock',
        x: 85,
        y: 70,
        angle: 0,
        locked: true,
        targetJones: jonesV(),
        requiredFidelity: 0.9,
        requiredIntensity: 20,
        targetStateName: 'V (Vertical)',
        targetStateNameZh: '垂直偏振',
        showTargetHint: true,
      },
    ],
  },
]

// ===========================================
// "THE ARTIST" CAMPAIGN - Wave Sculpting
// ===========================================

export const ARTIST_CAMPAIGN_LEVELS: MasterClassLevel[] = [
  // Level A1: The Perfect Circle
  {
    id: 'artist-circle',
    campaign: 'artist',
    name: 'The Perfect Circle',
    nameZh: '完美的圆',
    description:
      'Create perfectly circular polarization from linear light. ' +
      'The Quantum Lock demands 99.5% fidelity!',
    descriptionZh:
      '从线偏振光创造完美的圆偏振。量子锁要求99.5%的保真度！',
    difficulty: 'journeyman',
    concepts: [
      'QWP at 45° creates circular',
      'Input angle affects output handedness',
      'Precision matters for high fidelity',
    ],
    conceptsZh: [
      '45°的四分之一波片创造圆偏振',
      '输入角度影响输出旋向',
      '精度对高保真度很重要',
    ],
    goalDescription: 'Create RCP with 99.5%+ fidelity',
    goalDescriptionZh: '创造保真度99.5%以上的右旋圆偏振',
    hint: 'H light + QWP@45° = RCP (or -45° = LCP)',
    hintZh: 'H偏振光 + 45°四分之一波片 = 右旋圆偏振（-45° = 左旋）',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    perfectFidelity: 0.999,
    components: [
      // Emitter (45° linear - requires rotation to H first)
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 45, // 45° linear
        direction: 'right',
        locked: true,
      },
      // HWP to rotate to H first
      {
        id: 'hwp1',
        type: 'halfWavePlate',
        x: 30,
        y: 50,
        angle: 22.5, // Rotates 45° → 0° (H)
        locked: false,
      },
      // QWP to create circular
      {
        id: 'qwp1',
        type: 'quarterWavePlate',
        x: 55,
        y: 50,
        angle: 45,
        locked: false,
      },
      // Quantum Lock: RCP with high fidelity
      {
        id: 'ql1',
        type: 'quantumLock',
        x: 85,
        y: 50,
        angle: 0,
        locked: true,
        targetJones: jonesRCP(),
        requiredFidelity: 0.995,
        requiredIntensity: 40,
        targetStateName: 'Right Circular (RCP)',
        targetStateNameZh: '右旋圆偏振',
        showTargetHint: true,
      },
    ],
  },

  // Level A2: The Spiral Staircase
  {
    id: 'artist-spiral',
    campaign: 'artist',
    name: 'The Spiral Staircase',
    nameZh: '螺旋楼梯',
    description:
      'Create a beam that rotates its polarization by 90° using only HWPs. ' +
      'The artistic goal: make polarization "walk" around the Poincaré sphere!',
    descriptionZh:
      '仅使用半波片创造一束偏振旋转90°的光。艺术目标：让偏振在庞加莱球上"漫步"！',
    difficulty: 'master',
    concepts: [
      'HWP rotates polarization by 2× fast axis angle',
      'Multiple HWPs can create any rotation',
      'Polarization traces path on Poincaré sphere',
    ],
    conceptsZh: [
      '半波片将偏振旋转快轴角度的2倍',
      '多个半波片可以创造任意旋转',
      '偏振在庞加莱球上描绘路径',
    ],
    goalDescription: 'Rotate H → V (90° rotation)',
    goalDescriptionZh: '将H旋转到V（90°旋转）',
    hint: 'One HWP at 45° rotates polarization by 90°',
    hintZh: '一个45°的半波片将偏振旋转90°',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    parComponentCount: 1,
    components: [
      // Emitter: H
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0, // H
        direction: 'right',
        locked: true,
      },
      // HWP 1 (player adjusts)
      {
        id: 'hwp1',
        type: 'halfWavePlate',
        x: 35,
        y: 50,
        angle: 45, // This gives 90° rotation
        locked: false,
      },
      // Extra HWP for creative solutions
      {
        id: 'hwp2',
        type: 'halfWavePlate',
        x: 55,
        y: 50,
        angle: 0,
        locked: false,
      },
      // Quantum Lock: V
      {
        id: 'ql1',
        type: 'quantumLock',
        x: 85,
        y: 50,
        angle: 0,
        locked: true,
        targetJones: jonesV(),
        requiredFidelity: 0.99,
        requiredIntensity: 40,
        targetStateName: 'Vertical (V)',
        targetStateNameZh: '垂直偏振',
        showTargetHint: true,
      },
    ],
  },

  // Level A3: The Perfect Black (Expert)
  {
    id: 'artist-black',
    campaign: 'artist',
    name: 'The Perfect Black',
    nameZh: '完美的黑',
    description:
      'Achieve <0.1% transmission using only imperfect polarizers. ' +
      'True mastery of extinction through geometry!',
    descriptionZh:
      '仅使用不完美的偏振片实现<0.1%的透过率。通过几何实现消光的真正掌握！',
    difficulty: 'grandmaster',
    concepts: [
      'Multiple crossed polarizers increase extinction',
      'Geometry can overcome component limitations',
      'cos²θ × cos²θ × ... approaches zero',
    ],
    conceptsZh: [
      '多个交叉偏振片增加消光比',
      '几何可以克服元件限制',
      'cos²θ × cos²θ × ... 趋近于零',
    ],
    goalDescription: 'Reduce light to <0.1% (near-perfect extinction)',
    goalDescriptionZh: '将光减少到<0.1%（近乎完美的消光）',
    hint: 'Use multiple polarizers at strategic angles',
    hintZh: '在战略角度使用多个偏振片',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    parComponentCount: 4,
    components: [
      // Emitter: Full intensity
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
      // Polarizers (player places at angles)
      {
        id: 'p1',
        type: 'polarizer',
        x: 25,
        y: 50,
        angle: 0,
        polarizationAngle: 30,
        locked: false,
      },
      {
        id: 'p2',
        type: 'polarizer',
        x: 40,
        y: 50,
        angle: 0,
        polarizationAngle: 60,
        locked: false,
      },
      {
        id: 'p3',
        type: 'polarizer',
        x: 55,
        y: 50,
        angle: 0,
        polarizationAngle: 90,
        locked: false,
      },
      {
        id: 'p4',
        type: 'polarizer',
        x: 70,
        y: 50,
        angle: 0,
        polarizationAngle: 90, // Final cross
        locked: false,
      },
      // Dark port detector (interferometer target as dark)
      {
        id: 'dark',
        type: 'interferometerTarget',
        x: 90,
        y: 50,
        angle: 0,
        locked: true,
        isInterferometerPortB: true,
        maxIntensityForDark: 0.1, // <0.1%!
        linkedPortId: '', // No linked port
      },
    ],
  },
]

// ===========================================
// Export all levels
// ===========================================

export const MASTER_CLASS_LEVELS: MasterClassLevel[] = [
  ...MASTER_CLASS_TUTORIAL_LEVELS,
  ...HACKER_CAMPAIGN_LEVELS,
  ...ARTIST_CAMPAIGN_LEVELS,
]

/**
 * Get master class levels by campaign
 */
export function getMasterClassLevelsByCampaign(campaign: 'tutorial' | 'hacker' | 'artist'): MasterClassLevel[] {
  return MASTER_CLASS_LEVELS.filter((level) => level.campaign === campaign)
}

/**
 * Get level by ID
 */
export function getMasterClassLevelById(id: string): MasterClassLevel | undefined {
  return MASTER_CLASS_LEVELS.find((level) => level.id === id)
}

/**
 * Get all master class campaign names
 */
export const MASTER_CLASS_CAMPAIGNS = {
  tutorial: {
    name: 'Tutorial',
    nameZh: '教程',
    description: 'Learn the new mechanics',
    descriptionZh: '学习新机制',
  },
  hacker: {
    name: 'The Hacker',
    nameZh: '黑客',
    description: 'Logic gates and quantum cryptography',
    descriptionZh: '逻辑门与量子密码学',
  },
  artist: {
    name: 'The Artist',
    nameZh: '艺术家',
    description: 'Wave sculpting and polarization art',
    descriptionZh: '波雕刻与偏振艺术',
  },
}
