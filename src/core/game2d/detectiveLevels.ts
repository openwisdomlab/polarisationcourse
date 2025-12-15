/**
 * Optical Detective Levels - 光学侦探关卡
 *
 * Mystery box levels where players must deduce the hidden
 * optical element inside black boxes by probing with
 * different polarization states.
 *
 * Module 1: "Optical Detective" (Black Box Mode)
 */

import type { OpticalComponent } from './types'

// Extended level interface for detective mode
export interface DetectiveLevel {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  hint?: string
  hintZh?: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  /** Maximum number of guess attempts allowed */
  maxAttempts: number
  /** Components in the level */
  components: OpticalComponent[]
  /** Grid size for positioning */
  gridSize: { width: number; height: number }
  /** Learning objectives for this puzzle */
  learningObjectives: string[]
  learningObjectivesZh: string[]
  /** Reward discovery IDs unlocked on completion */
  rewards?: string[]
}

/**
 * All Optical Detective levels
 */
export const DETECTIVE_LEVELS: DetectiveLevel[] = [
  // ============================================
  // EASY LEVELS - Introduction to probing
  // ============================================
  {
    id: 'detective-1',
    name: 'The First Mystery',
    nameZh: '第一个谜团',
    description: 'A simple black box awaits. What could be inside?',
    descriptionZh: '一个简单的黑盒等待破解。里面是什么？',
    hint: 'Try different input polarizations and observe what comes out. A polarizer will reduce intensity unless aligned.',
    hintZh: '尝试不同的输入偏振并观察输出。偏振片会降低强度，除非对齐。',
    difficulty: 'easy',
    maxAttempts: 5,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Learn to probe unknown elements',
      'Observe intensity changes through polarizers',
    ],
    learningObjectivesZh: ['学习探测未知元件', '观察通过偏振片的强度变化'],
    rewards: ['first_mystery_solved'],
    components: [
      // Emitter - player can adjust polarization
      {
        id: 'e1',
        type: 'emitter',
        x: 15,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false, // Player can rotate to probe!
      },
      // Mystery box hiding a polarizer at 45°
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 50,
        y: 50,
        angle: 0,
        hiddenElementType: 'polarizer',
        hiddenElementAngle: 45,
        locked: true,
      },
      // Sensor to observe output
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 50,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },
  {
    id: 'detective-2',
    name: 'Horizontal or Vertical?',
    nameZh: '水平还是垂直？',
    description: 'The mystery box contains a polarizer. But at what angle?',
    descriptionZh: '神秘黑盒包含一个偏振片。但角度是多少？',
    hint: 'Input 0° and 90° polarized light. Maximum output tells you the filter angle.',
    hintZh: '输入0°和90°偏振光。最大输出告诉你滤波器角度。',
    difficulty: 'easy',
    maxAttempts: 4,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      "Understand Malus's Law: I = I₀cos²θ",
      'Determine polarizer angle by maximizing transmission',
    ],
    learningObjectivesZh: ['理解马吕斯定律：I = I₀cos²θ', '通过最大化透射确定偏振片角度'],
    rewards: ['malus_law'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 15,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false,
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 50,
        y: 50,
        angle: 0,
        hiddenElementType: 'polarizer',
        hiddenElementAngle: 90,
        locked: true,
      },
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 50,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },

  // ============================================
  // MEDIUM LEVELS - Wave plates and rotators
  // ============================================
  {
    id: 'detective-3',
    name: 'The Rotation Mystery',
    nameZh: '旋转之谜',
    description: 'The light rotates but intensity stays constant. What element does this?',
    descriptionZh: '光线旋转但强度不变。什么元件能做到？',
    hint: "A rotator changes the polarization angle without losing intensity. It's different from a polarizer!",
    hintZh: '旋光器改变偏振角但不损失强度。这与偏振片不同！',
    difficulty: 'medium',
    maxAttempts: 4,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Distinguish rotators from polarizers',
      'Rotators preserve intensity, polarizers absorb misaligned light',
    ],
    learningObjectivesZh: ['区分旋光器和偏振片', '旋光器保持强度，偏振片吸收不对齐的光'],
    rewards: ['optical_rotation'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 15,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false,
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 50,
        y: 50,
        angle: 0,
        hiddenElementType: 'rotator',
        hiddenElementAngle: 45,
        locked: true,
      },
      // Adding analyzer polarizer to detect rotation
      {
        id: 'p1',
        type: 'polarizer',
        x: 70,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        locked: false,
      },
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
  {
    id: 'detective-4',
    name: 'Half or Quarter?',
    nameZh: '半波还是四分之一波？',
    description: 'A wave plate hides inside. Is it λ/2 or λ/4?',
    descriptionZh: '一块波片藏在里面。是λ/2还是λ/4？',
    hint: 'A λ/4 plate at 45° creates circular polarization from linear. A λ/2 plate flips the polarization.',
    hintZh: 'λ/4波片在45°时将线偏振转为圆偏振。λ/2波片翻转偏振方向。',
    difficulty: 'medium',
    maxAttempts: 4,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Understand the difference between λ/2 and λ/4 plates',
      'λ/4 creates circular polarization, λ/2 reflects polarization angle',
    ],
    learningObjectivesZh: [
      '理解λ/2和λ/4波片的区别',
      'λ/4创建圆偏振，λ/2反射偏振角',
    ],
    rewards: ['quarter_wave_plate'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 15,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false,
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 45,
        y: 50,
        angle: 0,
        hiddenElementType: 'quarterWavePlate',
        hiddenElementAngle: 45,
        locked: true,
      },
      // Circular filter to test for circular polarization
      {
        id: 'cf1',
        type: 'circularFilter',
        x: 65,
        y: 50,
        angle: 0,
        filterHandedness: 'right',
        locked: false,
      },
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
  {
    id: 'detective-5',
    name: 'The Mirror Image',
    nameZh: '镜像之谜',
    description: 'A λ/2 plate flips polarization like a mirror. Find its axis.',
    descriptionZh: 'λ/2波片像镜子一样翻转偏振。找到它的轴。',
    hint: 'For a HWP: if input is at angle θ and fast axis at α, output is at 2α - θ.',
    hintZh: '对于半波片：如果输入角度为θ，快轴为α，输出为2α - θ。',
    difficulty: 'medium',
    maxAttempts: 3,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Master the HWP formula: θ_out = 2α - θ_in',
      'Determine fast axis by observing reflection behavior',
    ],
    learningObjectivesZh: [
      '掌握半波片公式：θ_out = 2α - θ_in',
      '通过观察反射行为确定快轴',
    ],
    rewards: ['half_wave_plate'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 15,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false,
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 50,
        y: 50,
        angle: 0,
        hiddenElementType: 'halfWavePlate',
        hiddenElementAngle: 22.5,
        locked: true,
      },
      {
        id: 'p1',
        type: 'polarizer',
        x: 75,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        locked: false,
      },
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

  // ============================================
  // HARD LEVELS - Multiple unknowns
  // ============================================
  {
    id: 'detective-6',
    name: 'Double Trouble',
    nameZh: '双重麻烦',
    description: 'Two mystery boxes in series! Deduce both.',
    descriptionZh: '两个神秘黑盒串联！推断两者。',
    hint: 'Solve them one at a time. The first affects what the second sees.',
    hintZh: '一个一个解决。第一个影响第二个看到的内容。',
    difficulty: 'hard',
    maxAttempts: 6,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Analyze cascaded optical elements',
      'Systematic elimination approach',
    ],
    learningObjectivesZh: ['分析级联光学元件', '系统消除方法'],
    rewards: ['jones_calculus'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false,
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 35,
        y: 50,
        angle: 0,
        hiddenElementType: 'polarizer',
        hiddenElementAngle: 45,
        locked: true,
      },
      {
        id: 'mystery2',
        type: 'mysteryBox',
        x: 60,
        y: 50,
        angle: 0,
        hiddenElementType: 'rotator',
        hiddenElementAngle: 45,
        locked: true,
      },
      {
        id: 'p1',
        type: 'polarizer',
        x: 80,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        locked: false,
      },
      {
        id: 's1',
        type: 'sensor',
        x: 95,
        y: 50,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },
  {
    id: 'detective-7',
    name: 'The Circular Challenge',
    nameZh: '圆偏振挑战',
    description: 'Something is creating circular polarization. What is it and how?',
    descriptionZh: '某物正在创建圆偏振。是什么？如何做到？',
    hint: 'Circular polarization appears when a QWP fast axis is at ±45° to input linear polarization.',
    hintZh: '当四分之一波片快轴与输入线偏振成±45°时，出现圆偏振。',
    difficulty: 'hard',
    maxAttempts: 4,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Identify QWP orientation that creates circular polarization',
      'Use circular filters as diagnostic tools',
    ],
    learningObjectivesZh: [
      '识别创建圆偏振的四分之一波片方向',
      '使用圆偏振滤波器作为诊断工具',
    ],
    rewards: ['circular_polarization'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true, // Fixed horizontal input
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 40,
        y: 50,
        angle: 0,
        hiddenElementType: 'quarterWavePlate',
        hiddenElementAngle: 45,
        locked: true,
      },
      // RCP filter path
      {
        id: 'cf1',
        type: 'circularFilter',
        x: 60,
        y: 30,
        angle: 0,
        filterHandedness: 'right',
        locked: true,
      },
      {
        id: 'm1',
        type: 'mirror',
        x: 55,
        y: 50,
        angle: 45,
        locked: false,
      },
      // LCP filter path
      {
        id: 'cf2',
        type: 'circularFilter',
        x: 60,
        y: 70,
        angle: 0,
        filterHandedness: 'left',
        locked: true,
      },
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 30,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 85,
        y: 70,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },

  // ============================================
  // EXPERT LEVELS - Advanced deduction
  // ============================================
  {
    id: 'detective-8',
    name: 'The Sugar Solution',
    nameZh: '糖溶液之谜',
    description: 'A natural substance rotates polarization. What angle?',
    descriptionZh: '一种天然物质旋转偏振。旋转了多少度？',
    hint: 'Sugar solution has optical activity - it rotates polarization but preserves intensity.',
    hintZh: '糖溶液具有旋光性 - 它旋转偏振但保持强度。',
    difficulty: 'expert',
    maxAttempts: 3,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Understand natural optical activity',
      'Distinguish between waveplates and optically active materials',
    ],
    learningObjectivesZh: [
      '理解天然旋光性',
      '区分波片和旋光物质',
    ],
    rewards: ['optical_rotation', 'polarimetry'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false,
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 45,
        y: 50,
        angle: 0,
        hiddenElementType: 'opticalRotator',
        hiddenElementAngle: 30, // 30° rotation
        locked: true,
      },
      {
        id: 'p1',
        type: 'polarizer',
        x: 75,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        locked: false,
      },
      {
        id: 's1',
        type: 'sensor',
        x: 92,
        y: 50,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },
  {
    id: 'detective-9',
    name: 'The Ultimate Test',
    nameZh: '终极测试',
    description: 'Three mystery boxes in series. Can you solve them all?',
    descriptionZh: '三个神秘黑盒串联。你能全部解开吗？',
    hint: 'Use systematic probing: vary input, observe each stage if possible.',
    hintZh: '使用系统探测：改变输入，如果可能观察每个阶段。',
    difficulty: 'expert',
    maxAttempts: 9,
    gridSize: { width: 100, height: 100 },
    learningObjectives: [
      'Master systematic optical analysis',
      'Combine knowledge of all optical elements',
    ],
    learningObjectivesZh: [
      '掌握系统光学分析',
      '综合运用所有光学元件知识',
    ],
    rewards: ['detective_master'],
    components: [
      {
        id: 'e1',
        type: 'emitter',
        x: 5,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: false,
      },
      {
        id: 'mystery1',
        type: 'mysteryBox',
        x: 25,
        y: 50,
        angle: 0,
        hiddenElementType: 'polarizer',
        hiddenElementAngle: 0,
        locked: true,
      },
      {
        id: 'mystery2',
        type: 'mysteryBox',
        x: 45,
        y: 50,
        angle: 0,
        hiddenElementType: 'quarterWavePlate',
        hiddenElementAngle: 45,
        locked: true,
      },
      {
        id: 'mystery3',
        type: 'mysteryBox',
        x: 65,
        y: 50,
        angle: 0,
        hiddenElementType: 'halfWavePlate',
        hiddenElementAngle: 22.5,
        locked: true,
      },
      {
        id: 'cf1',
        type: 'circularFilter',
        x: 80,
        y: 35,
        angle: 0,
        filterHandedness: 'right',
        locked: false,
      },
      {
        id: 'p1',
        type: 'polarizer',
        x: 80,
        y: 65,
        angle: 0,
        polarizationAngle: 0,
        locked: false,
      },
      {
        id: 's1',
        type: 'sensor',
        x: 95,
        y: 35,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 95,
        y: 65,
        angle: 0,
        requiredIntensity: 0,
        locked: true,
      },
    ],
  },
]

/**
 * Get detective levels by difficulty
 */
export function getDetectiveLevelsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
): DetectiveLevel[] {
  return DETECTIVE_LEVELS.filter((level) => level.difficulty === difficulty)
}

/**
 * Get a specific detective level by ID
 */
export function getDetectiveLevel(id: string): DetectiveLevel | undefined {
  return DETECTIVE_LEVELS.find((level) => level.id === id)
}

/**
 * Get all mystery boxes in a level
 */
export function getMysteryBoxes(level: DetectiveLevel): OpticalComponent[] {
  return level.components.filter((c) => c.type === 'mysteryBox')
}
