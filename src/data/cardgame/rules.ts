/**
 * Game Rules for PolarQuest Card Game
 * 偏振探秘卡牌游戏规则
 */

import type { GameRules, Mission } from '../types'

// ===== 课堂模式规则 Classroom Mode =====
export const CLASSROOM_RULES: GameRules = {
  mode: 'classroom',
  playerCount: { min: 2, max: 4 },
  duration: { min: 30, max: 45 },
  setupSteps: [
    'Each player receives 5 cards from shuffled deck',
    'Place Mission deck in center',
    'Each player draws 1 Mission card (keep visible)',
    'Youngest player goes first'
  ],
  setupStepsZh: [
    '每位玩家从洗好的牌堆抽5张手牌',
    '将任务牌堆放在中央',
    '每位玩家抽1张任务卡（展示给大家）',
    '最年轻的玩家先手'
  ],
  turnPhases: [
    {
      name: 'Draw Phase',
      nameZh: '抽牌阶段',
      description: 'Draw 1 card from deck',
      descriptionZh: '从牌堆抽1张牌',
      actions: ['Draw 1 card', 'Check for Event cards (play immediately if drawn)'],
      actionsZh: ['抽1张牌', '检查是否抽到事件卡（立即生效）']
    },
    {
      name: 'Play Phase',
      nameZh: '出牌阶段',
      description: 'Play up to 3 cards from hand',
      descriptionZh: '从手牌打出最多3张牌',
      actions: [
        'Play Light Source to start a beam',
        'Add Optical Elements to modify beam',
        'Use Effect cards for special actions',
        'Explain the optical principle for bonus points!'
      ],
      actionsZh: [
        '打出光源卡开始一束光',
        '添加光学元件卡修改光束',
        '使用效果卡执行特殊动作',
        '解释光学原理可获得加分！'
      ]
    },
    {
      name: 'Score Phase',
      nameZh: '计分阶段',
      description: 'Check if any missions are completed',
      descriptionZh: '检查是否完成任务',
      actions: [
        'Calculate final beam intensity using Malus\'s Law',
        'Check mission requirements',
        'Score points if mission completed',
        'Draw new mission if previous completed'
      ],
      actionsZh: [
        '使用马吕斯定律计算最终光束强度',
        '检查任务要求',
        '完成任务则得分',
        '完成后抽取新任务'
      ]
    },
    {
      name: 'Cleanup Phase',
      nameZh: '清理阶段',
      description: 'Discard down to 7 cards if needed',
      descriptionZh: '如手牌超过7张需弃牌',
      actions: ['Discard excess cards', 'Pass turn to next player'],
      actionsZh: ['弃掉多余的牌', '回合传给下一位玩家']
    }
  ],
  victoryConditions: [
    'First player to reach 15 points wins',
    'OR: Player with most points after 10 rounds wins',
    'Bonus: Explaining optical concepts correctly awards +1 point'
  ],
  victoryConditionsZh: [
    '首先达到15分的玩家获胜',
    '或：10回合后分数最高的玩家获胜',
    '加分：正确解释光学概念额外+1分'
  ]
}

// ===== 竞技模式规则 Competitive Mode =====
export const COMPETITIVE_RULES: GameRules = {
  mode: 'competitive',
  playerCount: { min: 2, max: 4 },
  duration: { min: 45, max: 60 },
  setupSteps: [
    'Each player receives 7 cards from shuffled deck',
    'Place Mission deck and Event deck separately',
    'Reveal 3 shared Mission cards in center',
    'Each player starts with 3 Energy tokens',
    'Roll dice to determine first player'
  ],
  setupStepsZh: [
    '每位玩家从洗好的牌堆抽7张手牌',
    '任务牌堆和事件牌堆分开放置',
    '中央翻开3张共享任务卡',
    '每位玩家起始获得3个能量代币',
    '掷骰子决定先手玩家'
  ],
  turnPhases: [
    {
      name: 'Energy Phase',
      nameZh: '能量阶段',
      description: 'Gain 2 Energy tokens',
      descriptionZh: '获得2个能量代币',
      actions: ['Add 2 Energy to your pool', 'Maximum 10 Energy'],
      actionsZh: ['获得2点能量', '上限10点能量']
    },
    {
      name: 'Draw Phase',
      nameZh: '抽牌阶段',
      description: 'Draw 2 cards',
      descriptionZh: '抽2张牌',
      actions: ['Draw 2 cards from deck', 'May draw from discard pile for 1 Energy'],
      actionsZh: ['从牌堆抽2张牌', '花费1能量可从弃牌堆抽']
    },
    {
      name: 'Action Phase',
      nameZh: '行动阶段',
      description: 'Play cards by spending Energy',
      descriptionZh: '花费能量打出卡牌',
      actions: [
        'Play cards (pay Energy cost)',
        'Build optical setups',
        'Attack opponent setups with Effect cards',
        'Complete shared or personal missions'
      ],
      actionsZh: [
        '打出卡牌（支付能量消耗）',
        '搭建光学装置',
        '用效果卡攻击对手装置',
        '完成共享或个人任务'
      ]
    },
    {
      name: 'Combat Phase',
      nameZh: '对抗阶段',
      description: 'Resolve conflicts between players',
      descriptionZh: '解决玩家间冲突',
      actions: [
        'Calculate beam intensities',
        'Higher intensity wins tie-breakers',
        'Destroyed setups go to discard pile'
      ],
      actionsZh: [
        '计算光束强度',
        '强度高者在平局时获胜',
        '被破坏的装置进入弃牌堆'
      ]
    },
    {
      name: 'Scoring Phase',
      nameZh: '计分阶段',
      description: 'Score completed missions',
      descriptionZh: '完成任务得分',
      actions: [
        'Check all mission completions',
        'First to complete shared mission gets bonus',
        'Refill shared missions if completed'
      ],
      actionsZh: [
        '检查所有任务完成情况',
        '首先完成共享任务者获得额外奖励',
        '完成的共享任务补充新的'
      ]
    }
  ],
  victoryConditions: [
    'First player to reach 25 points wins',
    'OR: Last player standing (others eliminated by 0 cards)',
    'OR: Most points when deck runs out'
  ],
  victoryConditionsZh: [
    '首先达到25分的玩家获胜',
    '或：最后存活的玩家（其他人手牌用尽被淘汰）',
    '或：牌堆抽完时分数最高者获胜'
  ]
}

// ===== 任务与光学概念映射 Mission-Concept Mapping =====
export const MISSIONS: Mission[] = [
  {
    id: 'mission-extinction',
    name: 'Complete Extinction',
    nameZh: '完全消光',
    description: 'Achieve zero intensity through crossed polarizers',
    descriptionZh: '通过正交偏振片实现零强度',
    difficulty: 1,
    requiredIntensity: 0,
    requiredPolarization: undefined,
    opticalConcept: 'Orthogonal polarizers block all light',
    opticalConceptZh: '正交偏振片阻挡所有光',
    reward: 2
  },
  {
    id: 'mission-half-intensity',
    name: 'Fifty-Fifty',
    nameZh: '五五开',
    description: 'Achieve exactly 50% intensity (use 45° angle)',
    descriptionZh: '实现精确50%强度（使用45°角）',
    difficulty: 2,
    requiredIntensity: 50,
    requiredPolarization: undefined,
    opticalConcept: 'Malus\'s Law: cos²(45°) = 0.5',
    opticalConceptZh: '马吕斯定律：cos²(45°) = 0.5',
    reward: 3
  },
  {
    id: 'mission-quarter-intensity',
    name: 'Quarter Power',
    nameZh: '四分之一功率',
    description: 'Achieve 25% intensity (use 60° angle)',
    descriptionZh: '实现25%强度（使用60°角）',
    difficulty: 3,
    requiredIntensity: 25,
    opticalConcept: 'cos²(60°) = 0.25',
    opticalConceptZh: 'cos²(60°) = 0.25',
    reward: 4
  },
  {
    id: 'mission-circular',
    name: 'Go Circular',
    nameZh: '圆偏振之路',
    description: 'Create circularly polarized light',
    descriptionZh: '创造圆偏振光',
    difficulty: 4,
    requiredIntensity: 50,
    opticalConcept: 'λ/4 plate converts linear to circular',
    opticalConceptZh: 'λ/4波片将线偏振转为圆偏振',
    reward: 5
  },
  {
    id: 'mission-birefringence',
    name: 'Split Personality',
    nameZh: '分裂的光',
    description: 'Create two orthogonally polarized beams',
    descriptionZh: '创造两束正交偏振的光',
    difficulty: 3,
    requiredIntensity: 50,
    opticalConcept: 'Birefringent crystals split light',
    opticalConceptZh: '双折射晶体分裂光束',
    reward: 4
  },
  {
    id: 'mission-interference',
    name: 'Constructive Path',
    nameZh: '建设性干涉',
    description: 'Combine two beams constructively',
    descriptionZh: '相长干涉合并两束光',
    difficulty: 4,
    requiredIntensity: 100,
    opticalConcept: 'Same phase = additive intensity',
    opticalConceptZh: '同相位 = 强度叠加',
    reward: 5
  },
  {
    id: 'mission-three-polarizers',
    name: 'Three Is Not A Crowd',
    nameZh: '三片偏振',
    description: 'Pass light through 3 polarizers at 0°, 45°, 90°',
    descriptionZh: '光通过0°、45°、90°三片偏振片',
    difficulty: 3,
    requiredIntensity: 25,
    requiredPolarization: 90,
    opticalConcept: 'Intermediate polarizer allows light through!',
    opticalConceptZh: '中间的偏振片让光能通过！',
    reward: 4
  },
  {
    id: 'mission-optical-activity',
    name: 'Sugar Spin',
    nameZh: '糖旋转',
    description: 'Demonstrate optical rotation',
    descriptionZh: '展示旋光性',
    difficulty: 2,
    requiredIntensity: 80,
    opticalConcept: 'Chiral molecules rotate polarization',
    opticalConceptZh: '手性分子旋转偏振方向',
    reward: 3
  },
  {
    id: 'mission-brewster',
    name: 'Brewster\'s Magic',
    nameZh: '布儒斯特魔法',
    description: 'Use Brewster angle for polarization',
    descriptionZh: '使用布儒斯特角进行偏振',
    difficulty: 3,
    requiredIntensity: 100,
    requiredPolarization: 0,
    opticalConcept: 'Zero reflection for p-polarization',
    opticalConceptZh: 'p偏振零反射',
    reward: 4
  },
  {
    id: 'mission-maximum',
    name: 'Full Power',
    nameZh: '全功率',
    description: 'Achieve maximum possible intensity',
    descriptionZh: '实现最大可能强度',
    difficulty: 5,
    requiredIntensity: 100,
    opticalConcept: 'Perfect alignment = maximum transmission',
    opticalConceptZh: '完美对准 = 最大透过',
    reward: 6
  }
]

// ===== 教学安全提示 Teaching Safety Notes =====
export const SAFETY_NOTES = {
  general: [
    'Never look directly into laser beams',
    'Handle polarizers by edges only',
    'Keep small game pieces away from young children',
    'Cards and tokens are not edible'
  ],
  generalZh: [
    '切勿直视激光束',
    '仅握住偏振片边缘操作',
    '小游戏配件远离幼童',
    '卡牌和代币不可食用'
  ],
  classroom: [
    'Teacher should supervise all experiments',
    'Verify laser class before use (Class 2 or below)',
    'Ensure proper ventilation when using chemicals',
    'Have first aid kit available'
  ],
  classroomZh: [
    '教师应监督所有实验',
    '使用前确认激光等级（二类或以下）',
    '使用化学品时确保通风良好',
    '准备急救箱'
  ]
}

// ===== 快速参考 Quick Reference =====
export const QUICK_REFERENCE = {
  malusLaw: 'I = I₀ × cos²(θ)',
  commonAngles: [
    { angle: 0, cosSq: 1.0, percentage: '100%' },
    { angle: 30, cosSq: 0.75, percentage: '75%' },
    { angle: 45, cosSq: 0.5, percentage: '50%' },
    { angle: 60, cosSq: 0.25, percentage: '25%' },
    { angle: 90, cosSq: 0, percentage: '0%' }
  ],
  polarizationColors: {
    0: '#ff4444',   // Red - Horizontal
    45: '#ffaa00',  // Orange - 45°
    90: '#44ff44',  // Green - Vertical
    135: '#4444ff' // Blue - 135°
  }
}

export { CLASSROOM_RULES as classroomRules, COMPETITIVE_RULES as competitiveRules }
