/**
 * Escape Room Levels - 偏振光密室逃脱
 *
 * A narrative-driven escape room experience using polarized light physics.
 * Players are trapped in Dr. Photon's mysterious optics laboratory and must
 * use their knowledge of polarization to escape through 5 interconnected rooms.
 *
 * Design Philosophy:
 * - Each room teaches a specific polarization concept
 * - Story elements provide context and motivation
 * - Progressive difficulty with optional hints
 * - Multiple solutions encouraged for open-ended puzzles
 */

import type { OpticalComponent } from '@/components/shared/optical/types'

export interface EscapeRoomLevel {
  id: string
  roomNumber: number
  name: string
  nameZh: string

  // Story elements
  storyIntro: string
  storyIntroZh: string
  storyComplete: string
  storyCompleteZh: string

  // Puzzle description
  description: string
  descriptionZh: string
  objective: string
  objectiveZh: string

  // Hints (progressive)
  hints: string[]
  hintsZh: string[]

  // Learning content
  concept: string
  conceptZh: string
  formula?: string

  // Level configuration
  difficulty: 'tutorial' | 'easy' | 'medium' | 'hard' | 'expert'
  timeLimit?: number // Optional time limit in seconds
  components: OpticalComponent[]
  gridSize: { width: number; height: number }
  openEnded?: boolean

  // Visual theming
  roomTheme: 'entrance' | 'lab' | 'crystal' | 'maze' | 'vault'
  ambientColor?: string
}

/**
 * The Escape Room Campaign
 * 5 Rooms telling the story of escaping Dr. Photon's Lab
 */
export const ESCAPE_ROOM_LEVELS: EscapeRoomLevel[] = [
  // ============================================
  // ROOM 1: The Entrance Hall (入口大厅)
  // ============================================
  {
    id: 'room-1-entrance',
    roomNumber: 1,
    name: 'The Entrance Hall',
    nameZh: '入口大厅',

    storyIntro:
      'You wake up in a dimly lit room. A note on the wall reads: "Welcome to my laboratory. To leave, you must master the secrets of light." A faint beam of polarized light illuminates a locked door ahead.',
    storyIntroZh:
      '你在一间昏暗的房间中醒来。墙上的纸条写着："欢迎来到我的实验室。要离开这里，你必须掌握光的秘密。"一束微弱的偏振光照亮了前方紧锁的门。',

    storyComplete:
      'The door clicks open! You remember now - polarized light can be filtered by rotating a polarizer to match its direction. One room down, four to go...',
    storyCompleteZh:
      '门锁发出咔哒声打开了！你想起来了——偏振光可以通过旋转偏振片来过滤。一个房间搞定，还有四个...',

    description:
      'A beam of horizontally polarized light shines from the emitter. Rotate the polarizer to let the light through to the sensor and unlock the door.',
    descriptionZh:
      '一束水平偏振的光从发射器射出。旋转偏振片让光通过并到达传感器，解锁大门。',

    objective: 'Activate the sensor to open the first door',
    objectiveZh: '激活传感器以打开第一道门',

    hints: [
      'The light is polarized at 0° (horizontal). What angle should the polarizer be?',
      'A polarizer allows maximum light through when aligned with the polarization direction.',
      'Set the polarizer to 0° to match the horizontal polarization.',
    ],
    hintsZh: [
      '光的偏振方向是0°（水平）。偏振片应该设置成什么角度？',
      '当偏振片与光的偏振方向对齐时，通过的光最强。',
      '将偏振片设置为0°以匹配水平偏振。',
    ],

    concept: 'Polarization Basics',
    conceptZh: '偏振基础',
    formula: 'I = I₀ × cos²(θ)',

    difficulty: 'tutorial',
    gridSize: { width: 100, height: 100 },
    roomTheme: 'entrance',
    ambientColor: '#1a1a2e',

    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 20,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      {
        id: 'p1',
        type: 'polarizer',
        x: 50,
        y: 50,
        angle: 0,
        polarizationAngle: 90, // Start perpendicular - blocks light
        locked: false,
      },
      {
        id: 's1',
        type: 'sensor',
        x: 80,
        y: 50,
        angle: 0,
        requiredIntensity: 80,
        requiredPolarization: 0,
        locked: true,
      },
    ],
  },

  // ============================================
  // ROOM 2: The Polarization Lab (偏振实验室)
  // ============================================
  {
    id: 'room-2-lab',
    roomNumber: 2,
    name: 'The Polarization Lab',
    nameZh: '偏振实验室',

    storyIntro:
      'You enter a room filled with optical equipment. Two polarizers block your path, positioned at 90° to each other - a classic "crossed polarizers" setup. No light should get through... unless you find a clever solution.',
    storyIntroZh:
      '你进入了一间满是光学设备的房间。两个互相垂直的偏振片挡住了你的去路——这是经典的"正交偏振"设置。理论上不应有光通过...除非你想到一个巧妙的办法。',

    storyComplete:
      "Brilliant! By inserting a 45° polarizer between the crossed polarizers, you've allowed some light through. This is Malus's Law in action - the foundation of LCD technology!",
    storyCompleteZh:
      '太棒了！通过在正交偏振片之间插入一个45°的偏振片，你让部分光通过了。这就是马吕斯定律的应用——LCD技术的基础！',

    description:
      'Two perpendicular polarizers completely block the light. Insert a third polarizer at the right angle to let some light through.',
    descriptionZh:
      '两个垂直的偏振片完全阻挡了光线。在中间插入第三个偏振片，调整到合适的角度让部分光通过。',

    objective: 'Get at least 25% intensity to reach the sensor',
    objectiveZh: '让至少25%的光强到达传感器',

    hints: [
      'Crossed polarizers at 90° block all light. But what if there was something in between?',
      "A 45° polarizer between crossed polarizers allows cos²(45°) = 50% through each stage.",
      "With a 45° polarizer in between: I = cos²(45°) × cos²(45°) = 0.5 × 0.5 = 25%",
    ],
    hintsZh: [
      '90°正交的偏振片会阻挡所有光。但如果中间有什么呢？',
      '在正交偏振片之间放置45°偏振片，每一级让cos²(45°) = 50%的光通过。',
      '使用45°中间偏振片：I = cos²(45°) × cos²(45°) = 0.5 × 0.5 = 25%',
    ],

    concept: "Malus's Law",
    conceptZh: '马吕斯定律',
    formula: 'I = I₀ × cos²(θ₁) × cos²(θ₂)',

    difficulty: 'easy',
    gridSize: { width: 100, height: 100 },
    roomTheme: 'lab',
    ambientColor: '#16213e',

    components: [
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
      {
        id: 'p1',
        type: 'polarizer',
        x: 30,
        y: 50,
        angle: 0,
        polarizationAngle: 0, // First polarizer - horizontal
        locked: true,
      },
      {
        id: 'p2',
        type: 'polarizer',
        x: 50,
        y: 50,
        angle: 0,
        polarizationAngle: 45, // Middle polarizer - adjustable
        locked: false,
      },
      {
        id: 'p3',
        type: 'polarizer',
        x: 70,
        y: 50,
        angle: 0,
        polarizationAngle: 90, // Last polarizer - vertical (crossed)
        locked: true,
      },
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

  // ============================================
  // ROOM 3: The Birefringent Chamber (双折射室)
  // ============================================
  {
    id: 'room-3-crystal',
    roomNumber: 3,
    name: 'The Birefringent Chamber',
    nameZh: '双折射室',

    storyIntro:
      'This room is dominated by a Polarizing Beam Splitter (PBS) - a device that splits light into two beams with orthogonal polarizations! The door has TWO locks, each requiring a beam with different polarization. One beam won\'t be enough...',
    storyIntroZh:
      '这个房间的中央是一台偏振分束器(PBS)——一种能将光按偏振方向分成两束的器件！门上有两把锁，每把锁需要不同偏振的光束。一束光是不够的...',

    storyComplete:
      "The crystal's birefringence creates ordinary and extraordinary rays with perpendicular polarizations. You've mastered the art of splitting light!",
    storyCompleteZh:
      '晶体的双折射产生了偏振方向垂直的寻常光和非常光。你已经掌握了分光的艺术！',

    description:
      'The PBS divides 45° polarized light into two beams: o-ray (0°) and e-ray (90°). Direct both beams to their matching sensors.',
    descriptionZh:
      '偏振分束器(PBS)将45°偏振光分成两束：寻常光（0°）和非常光（90°）。将两束光分别引导至对应的传感器。',

    objective: 'Activate BOTH sensors - one needs 0° polarization, the other needs 90°',
    objectiveZh: '同时激活两个传感器——一个需要0°偏振，另一个需要90°',

    hints: [
      'The splitter creates two beams from 45° polarized light - one at 0° and one at 90°.',
      'Use mirrors to direct each beam to its matching sensor.',
      'The o-ray continues straight, the e-ray is deflected upward.',
    ],
    hintsZh: [
      '分光器将45°偏振光分成两束——一束0°，一束90°。',
      '使用镜子将每束光引导至对应的传感器。',
      '寻常光直行，非常光向上偏折。',
    ],

    concept: 'Birefringence',
    conceptZh: '双折射',
    formula: 'n_e ≠ n_o → two rays',

    difficulty: 'medium',
    gridSize: { width: 100, height: 100 },
    roomTheme: 'crystal',
    openEnded: true,
    ambientColor: '#0f3460',

    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 45, // 45° produces equal o and e rays
        direction: 'right',
        locked: true,
      },
      {
        id: 'sp1',
        type: 'splitter',
        x: 35,
        y: 50,
        angle: 0,
        locked: true,
      },
      {
        id: 'm1',
        type: 'mirror',
        x: 35,
        y: 25,
        angle: 135,
        locked: false,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 65,
        y: 50,
        angle: 45,
        locked: false,
      },
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 25,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 90, // e-ray sensor
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 65,
        y: 75,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 0, // o-ray sensor
        locked: true,
      },
    ],
  },

  // ============================================
  // ROOM 4: The Mirror Maze (镜像迷宫)
  // ============================================
  {
    id: 'room-4-maze',
    roomNumber: 4,
    name: 'The Mirror Maze',
    nameZh: '镜像迷宫',

    storyIntro:
      'A labyrinth of mirrors stretches before you. Three security sensors guard the exit, each demanding light with specific intensity and polarization. You\'ll need to split, rotate, and guide the light through this complex maze.',
    storyIntroZh:
      '一个由镜子组成的迷宫展现在你面前。三个安全传感器守护着出口，每个都要求特定强度和偏振的光。你需要分光、旋转并引导光线穿过这个复杂的迷宫。',

    storyComplete:
      'Your mastery of light manipulation is impressive! Using rotators to preserve intensity while changing polarization, and mirrors to navigate the maze - you\'re becoming a true light master!',
    storyCompleteZh:
      '你对光线操控的掌握令人印象深刻！使用旋光器在改变偏振的同时保持强度，用镜子在迷宫中导航——你正在成为真正的光之大师！',

    description:
      'Navigate light through the mirror maze. Use rotators to change polarization without losing intensity, and mirrors to guide the beams.',
    descriptionZh:
      '引导光线穿过镜像迷宫。使用旋光器改变偏振而不损失强度，用镜子引导光束。',

    objective: 'Activate all THREE sensors with their required polarizations',
    objectiveZh: '用所需的偏振激活所有三个传感器',

    hints: [
      'Rotators change polarization without reducing intensity - unlike polarizers!',
      'Plan your light path backwards from each sensor to figure out the required rotations.',
      'The 45° rotator changes 0°→45°, and the 90° rotator changes 0°→90°.',
    ],
    hintsZh: [
      '旋光器改变偏振时不减少强度——与偏振片不同！',
      '从每个传感器倒推，规划你的光路。',
      '45°旋光器将0°变为45°，90°旋光器将0°变为90°。',
    ],

    concept: 'Wave Plates & Polarization Rotation',
    conceptZh: '波片与偏振旋转',
    formula: 'θ_out = θ_in + Δθ (no intensity loss)',

    difficulty: 'hard',
    gridSize: { width: 100, height: 100 },
    roomTheme: 'maze',
    openEnded: true,
    ambientColor: '#1a1a2e',

    components: [
      // Light source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 15,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // First splitter
      {
        id: 'sp1',
        type: 'splitter',
        x: 30,
        y: 15,
        angle: 0,
        locked: true,
      },
      // Rotators - adjustable
      {
        id: 'r1',
        type: 'rotator',
        x: 30,
        y: 40,
        angle: 0,
        rotationAmount: 45,
        locked: false,
      },
      {
        id: 'r2',
        type: 'rotator',
        x: 55,
        y: 15,
        angle: 0,
        rotationAmount: 90,
        locked: false,
      },
      // Mirrors - adjustable
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 65,
        angle: 135,
        locked: false,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 55,
        y: 65,
        angle: 45,
        locked: false,
      },
      {
        id: 'm3',
        type: 'mirror',
        x: 80,
        y: 15,
        angle: 45,
        locked: false,
      },
      {
        id: 'm4',
        type: 'mirror',
        x: 80,
        y: 40,
        angle: 135,
        locked: false,
      },
      // Three sensors with different requirements
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 65,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 45, // Needs 45° light
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 55,
        y: 90,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 0, // Needs 0° light
        locked: true,
      },
      {
        id: 's3',
        type: 'sensor',
        x: 90,
        y: 40,
        angle: 0,
        requiredIntensity: 35,
        requiredPolarization: 90, // Needs 90° light
        locked: true,
      },
    ],
  },

  // ============================================
  // ROOM 5: The Final Vault (终极密室)
  // ============================================
  {
    id: 'room-5-vault',
    roomNumber: 5,
    name: 'The Final Vault',
    nameZh: '终极密室',

    storyIntro:
      'The final room. Dr. Photon\'s most secure vault stands before you, protected by FOUR polarization-coded locks. Two light sources, two splitters, multiple paths - you\'ll need everything you\'ve learned to escape. This is your ultimate test!',
    storyIntroZh:
      '最后一个房间。光子博士最安全的保险库就在眼前，由四把偏振编码锁保护。两个光源，两个分光器，多条路径——你需要运用所学的一切才能逃脱。这是你的终极考验！',

    storyComplete:
      'FREEDOM! The vault door swings open, revealing the exit. You\'ve mastered the secrets of polarized light - the interplay of wave direction, intensity through Malus\'s Law, birefringent splitting, and lossless rotation. Dr. Photon would be proud... or perhaps frustrated that you escaped!',
    storyCompleteZh:
      '自由了！保险库的门缓缓打开，露出出口。你已经掌握了偏振光的秘密——波的方向、马吕斯定律的强度变化、双折射分光，以及无损旋转。光子博士会为你骄傲的...或者，也许会因为你逃脱而沮丧！',

    description:
      'The ultimate challenge: combine all optical principles. Use two light sources, splitters, rotators, polarizers, and mirrors to activate all four vault locks simultaneously.',
    descriptionZh:
      '终极挑战：综合运用所有光学原理。使用两个光源、分光器、旋光器、偏振片和镜子，同时激活所有四把保险库锁。',

    objective: 'Activate ALL FOUR sensors to unlock the vault and escape!',
    objectiveZh: '激活所有四个传感器，解锁保险库并逃脱！',

    hints: [
      'Each light source can be split to reach two sensors.',
      'Plan which source feeds which sensors based on their polarization requirements.',
      "Use rotators for 45° changes (no loss) and polarizers when you need to filter (with Malus's Law loss).",
      'The two sources start with different polarizations - use this to your advantage!',
    ],
    hintsZh: [
      '每个光源可以分成两束到达两个传感器。',
      '根据偏振要求规划哪个光源供给哪些传感器。',
      '使用旋光器进行45°变化（无损失），使用偏振片进行过滤（有马吕斯定律损失）。',
      '两个光源的初始偏振不同——利用这一点！',
    ],

    concept: 'Master Integration',
    conceptZh: '综合应用',
    formula: 'All principles combined',

    difficulty: 'expert',
    gridSize: { width: 100, height: 100 },
    roomTheme: 'vault',
    openEnded: true,
    ambientColor: '#0d1b2a',

    components: [
      // Two light sources with different polarizations
      {
        id: 'e1',
        type: 'emitter',
        x: 5,
        y: 25,
        angle: 0,
        polarizationAngle: 0, // Horizontal
        direction: 'right',
        locked: true,
      },
      {
        id: 'e2',
        type: 'emitter',
        x: 5,
        y: 75,
        angle: 0,
        polarizationAngle: 90, // Vertical
        direction: 'right',
        locked: true,
      },
      // Splitters to divide each source
      {
        id: 'sp1',
        type: 'splitter',
        x: 25,
        y: 25,
        angle: 0,
        locked: true,
      },
      {
        id: 'sp2',
        type: 'splitter',
        x: 25,
        y: 75,
        angle: 0,
        locked: true,
      },
      // Rotators - player adjustable
      {
        id: 'r1',
        type: 'rotator',
        x: 25,
        y: 10,
        angle: 0,
        rotationAmount: 45,
        locked: false,
      },
      {
        id: 'r2',
        type: 'rotator',
        x: 50,
        y: 25,
        angle: 0,
        rotationAmount: 90,
        locked: false,
      },
      {
        id: 'r3',
        type: 'rotator',
        x: 50,
        y: 75,
        angle: 0,
        rotationAmount: 45,
        locked: false,
      },
      // Polarizers for intensity control
      {
        id: 'p1',
        type: 'polarizer',
        x: 70,
        y: 10,
        angle: 0,
        polarizationAngle: 45,
        locked: false,
      },
      {
        id: 'p2',
        type: 'polarizer',
        x: 70,
        y: 40,
        angle: 0,
        polarizationAngle: 0,
        locked: false,
      },
      // Mirrors for routing
      {
        id: 'm1',
        type: 'mirror',
        x: 50,
        y: 10,
        angle: 135,
        locked: false,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 75,
        y: 25,
        angle: 45,
        locked: false,
      },
      {
        id: 'm3',
        type: 'mirror',
        x: 25,
        y: 90,
        angle: 135,
        locked: false,
      },
      {
        id: 'm4',
        type: 'mirror',
        x: 50,
        y: 90,
        angle: 45,
        locked: false,
      },
      {
        id: 'm5',
        type: 'mirror',
        x: 75,
        y: 60,
        angle: 135,
        locked: false,
      },
      {
        id: 'm6',
        type: 'mirror',
        x: 75,
        y: 75,
        angle: 45,
        locked: false,
      },
      // Four vault lock sensors - each with specific requirements
      {
        id: 's1',
        type: 'sensor',
        x: 92,
        y: 10,
        angle: 0,
        requiredIntensity: 30,
        requiredPolarization: 45, // Needs 45° light
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 92,
        y: 40,
        angle: 0,
        requiredIntensity: 35,
        requiredPolarization: 0, // Needs 0° (horizontal) light
        locked: true,
      },
      {
        id: 's3',
        type: 'sensor',
        x: 92,
        y: 60,
        angle: 0,
        requiredIntensity: 35,
        requiredPolarization: 90, // Needs 90° (vertical) light
        locked: true,
      },
      {
        id: 's4',
        type: 'sensor',
        x: 92,
        y: 90,
        angle: 0,
        requiredIntensity: 30,
        requiredPolarization: 135, // Needs 135° light
        locked: true,
      },
    ],
  },
]

/**
 * Helper functions
 */
export function getEscapeRoomLevel(id: string): EscapeRoomLevel | undefined {
  return ESCAPE_ROOM_LEVELS.find((level) => level.id === id)
}

export function getEscapeRoomLevelByNumber(
  roomNumber: number
): EscapeRoomLevel | undefined {
  return ESCAPE_ROOM_LEVELS.find((level) => level.roomNumber === roomNumber)
}

export function getTotalRooms(): number {
  return ESCAPE_ROOM_LEVELS.length
}

/**
 * Room theme colors for visual styling
 */
export const ROOM_THEMES = {
  entrance: {
    primary: '#8b5cf6', // Purple
    secondary: '#6366f1', // Indigo
    background: '#1a1a2e',
    accent: '#fbbf24', // Yellow for light
  },
  lab: {
    primary: '#22d3ee', // Cyan
    secondary: '#06b6d4', // Teal
    background: '#16213e',
    accent: '#ef4444', // Red for laser
  },
  crystal: {
    primary: '#a855f7', // Purple
    secondary: '#d946ef', // Fuchsia
    background: '#0f3460',
    accent: '#22d3ee', // Cyan for crystal glow
  },
  maze: {
    primary: '#f59e0b', // Amber
    secondary: '#eab308', // Yellow
    background: '#1a1a2e',
    accent: '#10b981', // Emerald for success
  },
  vault: {
    primary: '#ef4444', // Red
    secondary: '#dc2626', // Darker red
    background: '#0d1b2a',
    accent: '#fbbf24', // Gold for vault
  },
} as const

/**
 * Difficulty badge colors
 */
export const DIFFICULTY_COLORS = {
  tutorial: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
  },
  easy: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  medium: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  hard: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  expert: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
} as const
