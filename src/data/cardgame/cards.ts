/**
 * Card Game: PolarQuest - Polarization Card Game
 * 卡片桌游：偏振探秘 - 偏振光卡牌游戏
 * 至少40张卡牌，5种类型
 */

import type { GameCard, CardType } from '../types'
import type { BadgeColor } from '@/components/shared/SearchFilter'

// Type for label entries with color
interface LabelEntry {
  label: string
  labelZh: string
  color: BadgeColor
}

// ===== 光源卡 Light Source Cards (8张) =====
const LIGHT_SOURCE_CARDS: GameCard[] = [
  {
    id: 'ls-white-led',
    type: 'light-source',
    name: 'White LED',
    nameZh: '白光LED',
    description: 'Emit unpolarized white light. Starting light source for any experiment.',
    descriptionZh: '发射非偏振白光。任何实验的起始光源。',
    flavorText: 'Let there be light!',
    flavorTextZh: '要有光！',
    cost: 1,
    rarity: 'common',
    effects: [
      { type: 'intensity', value: 10, description: 'Emit intensity 10 light', descriptionZh: '发射强度10的光' }
    ],
    opticalConcept: 'Unpolarized light contains all polarization directions',
    opticalConceptZh: '非偏振光包含所有偏振方向',
    artworkType: 'emitter'
  },
  {
    id: 'ls-laser-red',
    type: 'light-source',
    name: 'Red Laser',
    nameZh: '红色激光',
    description: 'Coherent, monochromatic light. Higher intensity, already partially polarized.',
    descriptionZh: '相干单色光。更高强度，已部分偏振。',
    flavorText: 'Precision in a beam.',
    flavorTextZh: '光束中的精准。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'intensity', value: 15, description: 'Emit intensity 15 light', descriptionZh: '发射强度15的光' },
      { type: 'polarization', value: 0, description: 'Already 50% polarized at 0°', descriptionZh: '已50%偏振于0°' }
    ],
    opticalConcept: 'Laser light is coherent and often partially polarized',
    opticalConceptZh: '激光是相干的，通常已部分偏振',
    artworkType: 'emitter'
  },
  {
    id: 'ls-sunlight',
    type: 'light-source',
    name: 'Sunlight',
    nameZh: '阳光',
    description: 'Natural light. Free but intensity varies with weather.',
    descriptionZh: '自然光。免费但强度随天气变化。',
    flavorText: 'The original light source.',
    flavorTextZh: '最原始的光源。',
    cost: 0,
    rarity: 'common',
    effects: [
      { type: 'intensity', value: 'roll', description: 'Roll dice for intensity (1-12)', descriptionZh: '掷骰子决定强度（1-12）' }
    ],
    artworkType: 'emitter'
  },
  {
    id: 'ls-polarized-emitter',
    type: 'light-source',
    name: 'Polarized Emitter',
    nameZh: '偏振光源',
    description: 'Pre-polarized light source. No need for first polarizer.',
    descriptionZh: '预偏振光源。无需第一片偏振片。',
    cost: 3,
    rarity: 'rare',
    effects: [
      { type: 'intensity', value: 12, description: 'Emit intensity 12 light', descriptionZh: '发射强度12的光' },
      { type: 'polarization', value: 0, description: 'Fully polarized at chosen angle', descriptionZh: '在选定角度完全偏振' }
    ],
    artworkType: 'emitter',
    polarizationAngle: 0
  },
  {
    id: 'ls-lcd-backlight',
    type: 'light-source',
    name: 'LCD Backlight',
    nameZh: 'LCD背光',
    description: 'Already polarized from the LCD panel. Perfect starting point.',
    descriptionZh: '已被LCD面板偏振。完美的起点。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'intensity', value: 8, description: 'Emit intensity 8 light', descriptionZh: '发射强度8的光' },
      { type: 'polarization', value: 45, description: 'Polarized at 45°', descriptionZh: '45°偏振' }
    ],
    opticalConcept: 'LCD screens use polarizers',
    opticalConceptZh: 'LCD屏幕使用偏振片',
    artworkType: 'emitter',
    polarizationAngle: 45
  },
  {
    id: 'ls-scattered-sky',
    type: 'light-source',
    name: 'Blue Sky Light',
    nameZh: '蓝天散射光',
    description: 'Rayleigh scattered light from the sky. Partially polarized.',
    descriptionZh: '天空的瑞利散射光。部分偏振。',
    cost: 1,
    rarity: 'uncommon',
    effects: [
      { type: 'intensity', value: 6, description: 'Emit intensity 6 light', descriptionZh: '发射强度6的光' },
      { type: 'polarization', value: 90, description: '40% polarized at 90°', descriptionZh: '40%偏振于90°' }
    ],
    opticalConcept: 'Rayleigh scattering polarizes skylight',
    opticalConceptZh: '瑞利散射使天光偏振',
    artworkType: 'wave'
  },
  {
    id: 'ls-candle',
    type: 'light-source',
    name: 'Candle Flame',
    nameZh: '烛光',
    description: 'Warm, flickering light. Low intensity but atmospheric.',
    descriptionZh: '温暖的闪烁光。强度低但有氛围。',
    cost: 0,
    rarity: 'common',
    effects: [
      { type: 'intensity', value: 4, description: 'Emit intensity 4 light', descriptionZh: '发射强度4的光' }
    ],
    flavorText: 'Ancient meets modern optics.',
    flavorTextZh: '古老与现代光学的相遇。',
    artworkType: 'emitter'
  },
  {
    id: 'ls-quantum',
    type: 'light-source',
    name: 'Quantum Entangled Photons',
    nameZh: '量子纠缠光子',
    description: 'Legendary source. Can duplicate polarization state to another card.',
    descriptionZh: '传说光源。可将偏振态复制到另一张卡。',
    cost: 5,
    rarity: 'legendary',
    effects: [
      { type: 'intensity', value: 8, description: 'Emit intensity 8 light', descriptionZh: '发射强度8的光' },
      { type: 'special', value: 'entangle', description: 'Copy polarization to target card', descriptionZh: '将偏振态复制到目标卡' }
    ],
    artworkType: 'wave'
  }
]

// ===== 光学元件卡 Optical Element Cards (12张) =====
const OPTICAL_ELEMENT_CARDS: GameCard[] = [
  {
    id: 'oe-polarizer-0',
    type: 'optical-element',
    name: 'Polarizer (0°)',
    nameZh: '偏振片 (0°)',
    description: 'Filter light to horizontal polarization. Blocks perpendicular light.',
    descriptionZh: '将光过滤为水平偏振。阻挡垂直光。',
    cost: 1,
    rarity: 'common',
    effects: [
      { type: 'polarization', value: 0, description: 'Set polarization to 0°', descriptionZh: '设置偏振为0°' },
      { type: 'intensity', value: -50, description: 'Reduce intensity by 50% (unpolarized)', descriptionZh: '强度降低50%（非偏振光）' }
    ],
    opticalConcept: 'Polarizers only pass one polarization direction',
    opticalConceptZh: '偏振片只通过一个偏振方向',
    artworkType: 'polarizer',
    polarizationAngle: 0
  },
  {
    id: 'oe-polarizer-45',
    type: 'optical-element',
    name: 'Polarizer (45°)',
    nameZh: '偏振片 (45°)',
    description: 'Filter light to 45° polarization.',
    descriptionZh: '将光过滤为45°偏振。',
    cost: 1,
    rarity: 'common',
    effects: [
      { type: 'polarization', value: 45, description: 'Set polarization to 45°', descriptionZh: '设置偏振为45°' },
      { type: 'intensity', value: 'cos2', description: 'I = I₀cos²(Δθ)', descriptionZh: 'I = I₀cos²(Δθ)' }
    ],
    opticalConcept: 'Malus\'s Law: I = I₀cos²θ',
    opticalConceptZh: '马吕斯定律：I = I₀cos²θ',
    artworkType: 'polarizer',
    polarizationAngle: 45
  },
  {
    id: 'oe-polarizer-90',
    type: 'optical-element',
    name: 'Polarizer (90°)',
    nameZh: '偏振片 (90°)',
    description: 'Filter light to vertical polarization.',
    descriptionZh: '将光过滤为垂直偏振。',
    cost: 1,
    rarity: 'common',
    effects: [
      { type: 'polarization', value: 90, description: 'Set polarization to 90°', descriptionZh: '设置偏振为90°' }
    ],
    artworkType: 'polarizer',
    polarizationAngle: 90
  },
  {
    id: 'oe-rotator-45',
    type: 'optical-element',
    name: 'Rotator (45°)',
    nameZh: '旋转片 (45°)',
    description: 'Rotate polarization direction by 45° without intensity loss.',
    descriptionZh: '将偏振方向旋转45°，不损失强度。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'polarization', value: '+45', description: 'Add 45° to polarization', descriptionZh: '偏振角度增加45°' }
    ],
    opticalConcept: 'Waveplates rotate polarization losslessly',
    opticalConceptZh: '波片可无损旋转偏振',
    artworkType: 'rotator'
  },
  {
    id: 'oe-rotator-90',
    type: 'optical-element',
    name: 'Rotator (90°)',
    nameZh: '旋转片 (90°)',
    description: 'Rotate polarization direction by 90° without intensity loss.',
    descriptionZh: '将偏振方向旋转90°，不损失强度。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'polarization', value: '+90', description: 'Add 90° to polarization', descriptionZh: '偏振角度增加90°' }
    ],
    artworkType: 'rotator'
  },
  {
    id: 'oe-splitter',
    type: 'optical-element',
    name: 'Birefringent Splitter',
    nameZh: '双折射分束器',
    description: 'Split light into two beams with orthogonal polarizations.',
    descriptionZh: '将光分成两束正交偏振的光。',
    cost: 3,
    rarity: 'rare',
    effects: [
      { type: 'split', value: 2, description: 'Create two light paths', descriptionZh: '创建两条光路' },
      { type: 'polarization', value: '0,90', description: 'o-ray at 0°, e-ray at 90°', descriptionZh: 'o光0°，e光90°' }
    ],
    opticalConcept: 'Birefringence creates two rays',
    opticalConceptZh: '双折射产生两条光线',
    artworkType: 'splitter'
  },
  {
    id: 'oe-mirror',
    type: 'optical-element',
    name: 'Mirror',
    nameZh: '反射镜',
    description: 'Reflect light. Can redirect beam path.',
    descriptionZh: '反射光。可改变光束方向。',
    cost: 1,
    rarity: 'common',
    effects: [
      { type: 'direction', value: 'reflect', description: 'Change beam direction', descriptionZh: '改变光束方向' }
    ],
    artworkType: 'mirror'
  },
  {
    id: 'oe-quarter-wave',
    type: 'optical-element',
    name: 'Quarter Wave Plate',
    nameZh: 'λ/4波片',
    description: 'Convert linear to circular polarization.',
    descriptionZh: '将线偏振转换为圆偏振。',
    cost: 3,
    rarity: 'rare',
    effects: [
      { type: 'polarization', value: 'circular', description: 'Convert to circular polarization', descriptionZh: '转换为圆偏振' }
    ],
    opticalConcept: 'λ/4 retardation creates circular polarization',
    opticalConceptZh: 'λ/4相位延迟产生圆偏振',
    artworkType: 'wave'
  },
  {
    id: 'oe-half-wave',
    type: 'optical-element',
    name: 'Half Wave Plate',
    nameZh: 'λ/2波片',
    description: 'Flip polarization to its mirror angle.',
    descriptionZh: '将偏振翻转到镜像角度。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'polarization', value: 'mirror', description: 'Mirror polarization angle', descriptionZh: '偏振角度镜像翻转' }
    ],
    artworkType: 'wave'
  },
  {
    id: 'oe-brewster',
    type: 'optical-element',
    name: 'Brewster Window',
    nameZh: '布儒斯特窗',
    description: 'Glass at Brewster angle. Fully transmits p-polarization.',
    descriptionZh: '布儒斯特角的玻璃。完全透射p偏振。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'polarization', value: 0, description: 'Pass only 0° polarization', descriptionZh: '只通过0°偏振' },
      { type: 'intensity', value: -10, description: 'Slight reflection loss', descriptionZh: '轻微反射损失' }
    ],
    opticalConcept: 'Brewster angle = zero reflection for p-polarization',
    opticalConceptZh: '布儒斯特角 = p偏振零反射',
    artworkType: 'generic'
  },
  {
    id: 'oe-dichroic',
    type: 'optical-element',
    name: 'Dichroic Crystal',
    nameZh: '二向色晶体',
    description: 'Absorbs one polarization, transmits the other.',
    descriptionZh: '吸收一个偏振方向，透射另一个。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'polarization', value: 0, description: 'Transmit only 0° polarization', descriptionZh: '只透射0°偏振' },
      { type: 'block', value: 90, description: 'Block 90° polarization', descriptionZh: '阻挡90°偏振' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'oe-faraday',
    type: 'optical-element',
    name: 'Faraday Rotator',
    nameZh: '法拉第旋转器',
    description: 'Magnetic field rotates polarization. Non-reciprocal.',
    descriptionZh: '磁场旋转偏振。不可逆过程。',
    cost: 4,
    rarity: 'legendary',
    effects: [
      { type: 'polarization', value: '+45', description: 'Rotate 45° (non-reciprocal)', descriptionZh: '旋转45°（不可逆）' },
      { type: 'special', value: 'non-reciprocal', description: 'Works same direction both ways', descriptionZh: '双向都相同方向旋转' }
    ],
    artworkType: 'generic'
  }
]

// ===== 效果卡 Effect Cards (10张) =====
const EFFECT_CARDS: GameCard[] = [
  {
    id: 'ef-intensity-boost',
    type: 'effect',
    name: 'Intensity Boost',
    nameZh: '强度增益',
    description: 'Amplify light intensity by 50%.',
    descriptionZh: '将光强增加50%。',
    cost: 2,
    rarity: 'common',
    effects: [
      { type: 'intensity', value: '+50%', description: 'Multiply intensity by 1.5', descriptionZh: '强度乘以1.5' }
    ],
    artworkType: 'wave'
  },
  {
    id: 'ef-perfect-alignment',
    type: 'effect',
    name: 'Perfect Alignment',
    nameZh: '完美对准',
    description: 'Next polarization match costs no intensity.',
    descriptionZh: '下一次偏振匹配不消耗强度。',
    cost: 1,
    rarity: 'uncommon',
    effects: [
      { type: 'special', value: 'no-loss', description: 'Next Malus law = 100%', descriptionZh: '下次马吕斯定律=100%' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ef-interference-add',
    type: 'effect',
    name: 'Constructive Interference',
    nameZh: '相长干涉',
    description: 'Combine two beams in-phase. Double intensity.',
    descriptionZh: '同相合并两束光。强度翻倍。',
    cost: 3,
    rarity: 'rare',
    effects: [
      { type: 'intensity', value: 'x2', description: 'Double the intensity', descriptionZh: '强度翻倍' }
    ],
    opticalConcept: 'Same phase = additive interference',
    opticalConceptZh: '同相 = 相长干涉',
    artworkType: 'interference'
  },
  {
    id: 'ef-interference-sub',
    type: 'effect',
    name: 'Destructive Interference',
    nameZh: '相消干涉',
    description: 'Cancel opponent\'s light beam.',
    descriptionZh: '抵消对手的光束。',
    cost: 3,
    rarity: 'rare',
    effects: [
      { type: 'block', value: 'target', description: 'Cancel target beam', descriptionZh: '取消目标光束' }
    ],
    opticalConcept: 'Opposite phase = destructive interference',
    opticalConceptZh: '反相 = 相消干涉',
    artworkType: 'interference'
  },
  {
    id: 'ef-draw-2',
    type: 'effect',
    name: 'Optical Discovery',
    nameZh: '光学发现',
    description: 'Draw 2 cards from deck.',
    descriptionZh: '从牌堆抽2张牌。',
    cost: 1,
    rarity: 'common',
    effects: [
      { type: 'draw', value: 2, description: 'Draw 2 cards', descriptionZh: '抽2张牌' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ef-wavelength-shift',
    type: 'effect',
    name: 'Wavelength Shift',
    nameZh: '波长偏移',
    description: 'Change light color. Affects birefringence.',
    descriptionZh: '改变光的颜色。影响双折射。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'special', value: 'wavelength', description: 'Change wavelength dependency', descriptionZh: '改变波长依赖性' }
    ],
    artworkType: 'wave'
  },
  {
    id: 'ef-recycle',
    type: 'effect',
    name: 'Optical Recycling',
    nameZh: '光学回收',
    description: 'Return used optical element to hand.',
    descriptionZh: '将使用过的光学元件返回手牌。',
    cost: 1,
    rarity: 'common',
    effects: [
      { type: 'special', value: 'recycle', description: 'Return 1 optical element', descriptionZh: '返回1张光学元件' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ef-steal',
    type: 'effect',
    name: 'Beam Hijack',
    nameZh: '光束劫持',
    description: 'Redirect opponent\'s beam to your sensor.',
    descriptionZh: '将对手的光束重定向到你的传感器。',
    cost: 4,
    rarity: 'rare',
    effects: [
      { type: 'direction', value: 'steal', description: 'Redirect target beam', descriptionZh: '重定向目标光束' }
    ],
    artworkType: 'mirror'
  },
  {
    id: 'ef-shield',
    type: 'effect',
    name: 'Polarization Shield',
    nameZh: '偏振护盾',
    description: 'Block next attack on your setup.',
    descriptionZh: '阻挡下一次对你装置的攻击。',
    cost: 2,
    rarity: 'uncommon',
    effects: [
      { type: 'block', value: 'self', description: 'Block next effect', descriptionZh: '阻挡下一个效果' }
    ],
    artworkType: 'polarizer'
  },
  {
    id: 'ef-malus-master',
    type: 'effect',
    name: 'Malus Master',
    nameZh: '马吕斯大师',
    description: 'Ignore Malus\'s Law penalty this turn.',
    descriptionZh: '本回合忽略马吕斯定律惩罚。',
    cost: 3,
    rarity: 'rare',
    effects: [
      { type: 'special', value: 'ignore-malus', description: 'No cos² reduction', descriptionZh: '无cos²衰减' }
    ],
    opticalConcept: 'Normally I = I₀cos²θ reduces intensity',
    opticalConceptZh: '通常 I = I₀cos²θ 会降低强度',
    artworkType: 'wave'
  }
]

// ===== 任务卡 Mission Cards (8张) =====
const MISSION_CARDS: GameCard[] = [
  {
    id: 'ms-cross-extinction',
    type: 'mission',
    name: 'Crossed Extinction',
    nameZh: '正交消光',
    description: 'Achieve complete extinction with two polarizers.',
    descriptionZh: '用两片偏振片实现完全消光。',
    cost: 0,
    rarity: 'common',
    effects: [
      { type: 'score', value: 2, description: 'Score 2 points', descriptionZh: '得2分' }
    ],
    opticalConcept: '90° crossed polarizers = extinction',
    opticalConceptZh: '90°正交偏振片 = 消光',
    artworkType: 'polarizer'
  },
  {
    id: 'ms-malus-half',
    type: 'mission',
    name: 'Half Intensity',
    nameZh: '半强度任务',
    description: 'Achieve exactly 50% intensity (θ = 45°).',
    descriptionZh: '实现精确50%强度（θ = 45°）。',
    cost: 0,
    rarity: 'uncommon',
    effects: [
      { type: 'score', value: 3, description: 'Score 3 points', descriptionZh: '得3分' }
    ],
    opticalConcept: 'cos²(45°) = 0.5 = 50%',
    opticalConceptZh: 'cos²(45°) = 0.5 = 50%',
    artworkType: 'generic'
  },
  {
    id: 'ms-circular',
    type: 'mission',
    name: 'Go Circular',
    nameZh: '圆偏振之路',
    description: 'Create circularly polarized light.',
    descriptionZh: '创造圆偏振光。',
    cost: 0,
    rarity: 'rare',
    effects: [
      { type: 'score', value: 4, description: 'Score 4 points', descriptionZh: '得4分' }
    ],
    opticalConcept: 'Linear + λ/4 at 45° = circular',
    opticalConceptZh: '线偏振 + 45°λ/4波片 = 圆偏振',
    artworkType: 'wave'
  },
  {
    id: 'ms-split-reunite',
    type: 'mission',
    name: 'Split and Reunite',
    nameZh: '分而合之',
    description: 'Split light with birefringence, then recombine.',
    descriptionZh: '用双折射分束，然后重新合并。',
    cost: 0,
    rarity: 'legendary',
    effects: [
      { type: 'score', value: 5, description: 'Score 5 points', descriptionZh: '得5分' }
    ],
    artworkType: 'splitter'
  },
  {
    id: 'ms-color-maker',
    type: 'mission',
    name: 'Color Maker',
    nameZh: '色彩创造者',
    description: 'Create interference colors using retardation.',
    descriptionZh: '利用相位延迟创造干涉色彩。',
    cost: 0,
    rarity: 'uncommon',
    effects: [
      { type: 'score', value: 3, description: 'Score 3 points', descriptionZh: '得3分' }
    ],
    artworkType: 'interference'
  },
  {
    id: 'ms-optical-rotation',
    type: 'mission',
    name: 'Sugar Water',
    nameZh: '糖水旋光',
    description: 'Demonstrate optical rotation effect.',
    descriptionZh: '展示旋光效应。',
    cost: 0,
    rarity: 'uncommon',
    effects: [
      { type: 'score', value: 3, description: 'Score 3 points', descriptionZh: '得3分' }
    ],
    opticalConcept: 'Chiral molecules rotate polarization',
    opticalConceptZh: '手性分子旋转偏振',
    artworkType: 'rotator'
  },
  {
    id: 'ms-brewster',
    type: 'mission',
    name: 'Brewster Challenge',
    nameZh: '布儒斯特挑战',
    description: 'Use Brewster angle to filter polarization.',
    descriptionZh: '使用布儒斯特角过滤偏振。',
    cost: 0,
    rarity: 'rare',
    effects: [
      { type: 'score', value: 4, description: 'Score 4 points', descriptionZh: '得4分' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ms-photon-entangle',
    type: 'mission',
    name: 'Quantum Entanglement',
    nameZh: '量子纠缠',
    description: 'Match polarization states of two separate beams.',
    descriptionZh: '匹配两束分离光的偏振态。',
    cost: 0,
    rarity: 'legendary',
    effects: [
      { type: 'score', value: 6, description: 'Score 6 points', descriptionZh: '得6分' }
    ],
    artworkType: 'wave'
  }
]

// ===== 事件卡 Event Cards (6张) =====
const EVENT_CARDS: GameCard[] = [
  {
    id: 'ev-cloudy',
    type: 'event',
    name: 'Cloudy Weather',
    nameZh: '多云天气',
    description: 'All sunlight sources lose 50% intensity this round.',
    descriptionZh: '本回合所有阳光光源强度降低50%。',
    cost: 0,
    rarity: 'common',
    effects: [
      { type: 'intensity', value: '-50%', description: 'Reduce sunlight sources', descriptionZh: '降低阳光光源' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ev-power-surge',
    type: 'event',
    name: 'Power Surge',
    nameZh: '电力激增',
    description: 'All LED sources gain +5 intensity.',
    descriptionZh: '所有LED光源强度+5。',
    cost: 0,
    rarity: 'uncommon',
    effects: [
      { type: 'intensity', value: '+5', description: 'Boost LED sources', descriptionZh: '增强LED光源' }
    ],
    artworkType: 'emitter'
  },
  {
    id: 'ev-vibration',
    type: 'event',
    name: 'Lab Vibration',
    nameZh: '实验室振动',
    description: 'All alignments shift by 5°.',
    descriptionZh: '所有对准偏移5°。',
    cost: 0,
    rarity: 'uncommon',
    effects: [
      { type: 'polarization', value: '+5', description: 'Misalign all setups', descriptionZh: '所有装置失准' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ev-dust',
    type: 'event',
    name: 'Dusty Optics',
    nameZh: '光学元件积灰',
    description: 'All optical elements lose 10% efficiency.',
    descriptionZh: '所有光学元件效率降低10%。',
    cost: 0,
    rarity: 'common',
    effects: [
      { type: 'intensity', value: '-10%', description: 'Reduce all transmissions', descriptionZh: '降低所有透过率' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ev-research-grant',
    type: 'event',
    name: 'Research Grant',
    nameZh: '科研经费',
    description: 'All players draw 1 extra card.',
    descriptionZh: '所有玩家多抽1张牌。',
    cost: 0,
    rarity: 'rare',
    effects: [
      { type: 'draw', value: 1, description: 'Everyone draws 1', descriptionZh: '所有人抽1张' }
    ],
    artworkType: 'generic'
  },
  {
    id: 'ev-breakthrough',
    type: 'event',
    name: 'Scientific Breakthrough',
    nameZh: '科学突破',
    description: 'Double the score of next completed mission.',
    descriptionZh: '下一个完成的任务分数翻倍。',
    cost: 0,
    rarity: 'legendary',
    effects: [
      { type: 'score', value: 'x2', description: 'Double next mission', descriptionZh: '下一任务翻倍' }
    ],
    artworkType: 'generic'
  }
]

// Export all cards
export const ALL_CARDS: GameCard[] = [
  ...LIGHT_SOURCE_CARDS,
  ...OPTICAL_ELEMENT_CARDS,
  ...EFFECT_CARDS,
  ...MISSION_CARDS,
  ...EVENT_CARDS
]

// Helper functions
export function getCardsByType(type: CardType): GameCard[] {
  return ALL_CARDS.filter(c => c.type === type)
}

export function getCardById(id: string): GameCard | undefined {
  return ALL_CARDS.find(c => c.id === id)
}

export function getCardsByRarity(rarity: GameCard['rarity']): GameCard[] {
  return ALL_CARDS.filter(c => c.rarity === rarity)
}

// Card type labels with proper typing
export const CARD_TYPE_LABELS: Record<CardType, LabelEntry> = {
  'light-source': { label: 'Light Source', labelZh: '光源', color: 'yellow' },
  'optical-element': { label: 'Optical Element', labelZh: '光学元件', color: 'cyan' },
  'effect': { label: 'Effect', labelZh: '效果', color: 'purple' },
  'mission': { label: 'Mission', labelZh: '任务', color: 'green' },
  'event': { label: 'Event', labelZh: '事件', color: 'orange' }
}

// Rarity labels with proper typing
export const RARITY_LABELS: Record<GameCard['rarity'], LabelEntry> = {
  common: { label: 'Common', labelZh: '普通', color: 'gray' },
  uncommon: { label: 'Uncommon', labelZh: '稀有', color: 'green' },
  rare: { label: 'Rare', labelZh: '珍贵', color: 'blue' },
  legendary: { label: 'Legendary', labelZh: '传说', color: 'orange' }
}

// Card counts summary
export const CARD_SUMMARY = {
  total: ALL_CARDS.length,
  byType: {
    'light-source': LIGHT_SOURCE_CARDS.length,
    'optical-element': OPTICAL_ELEMENT_CARDS.length,
    'effect': EFFECT_CARDS.length,
    'mission': MISSION_CARDS.length,
    'event': EVENT_CARDS.length
  }
}
