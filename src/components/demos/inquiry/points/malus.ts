/**
 * malus.ts - Malus定律探究点
 *
 * Foundation: "垂直时光能通过吗？"→消光
 * Application: "cos²还是线性？"→公式揭示
 * Research: 消光比与理想偏振器差异
 */

import type { InquiryPoint } from '@/stores/inquiryStore'

export const malusInquiryPoints: InquiryPoint[] = [
  // Point 1: 交叉偏振器 — 消光现象
  {
    id: 'malus-extinction',
    phase: 'predict',
    trigger: { type: 'step', step: 0 },
    question: {
      zh: '如果两个偏振片完全垂直（90°），光还能通过吗？',
      en: 'If two polarizers are perpendicular (90°), can light still pass through?',
    },
    predictions: [
      {
        id: 'yes-dim',
        label: { zh: '能，但很暗', en: 'Yes, but dimly' },
        isCorrect: false,
      },
      {
        id: 'no-blocked',
        label: { zh: '完全不能', en: 'Not at all' },
        isCorrect: true,
      },
      {
        id: 'half',
        label: { zh: '通过一半', en: 'Half passes through' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '你发现了"消光"现象！当两偏振片正交时，第一片只让垂直分量通过，第二片只让水平分量通过——结果一点光也透不过。',
      en: 'You discovered extinction! When polarizers are crossed, the first passes only vertical, the second only horizontal — no light gets through.',
    },
    unlocksControls: ['analyzer-angle'],
    highlightControls: ['analyzer-angle'],
    triggersDiscovery: ['crossed_polarizers'],
    tiers: {
      foundation: {
        question: {
          zh: '把第二个偏振片转到和第一个垂直，光会怎样？',
          en: 'Turn the second polarizer perpendicular to the first. What happens to the light?',
        },
        predictions: [
          {
            id: 'bright',
            label: { zh: '还是很亮', en: 'Still bright' },
            isCorrect: false,
          },
          {
            id: 'dark',
            label: { zh: '变暗了！', en: 'Goes dark!' },
            isCorrect: true,
          },
        ],
      },
      research: {
        question: {
          zh: '理想正交偏振器的消光比应为无穷大。实际偏振器能达到多少？考虑表面反射和散射的影响。',
          en: 'Ideal crossed polarizers should have infinite extinction ratio. What can real polarizers achieve? Consider surface reflections and scattering.',
        },
        predictions: undefined, // 开放推导，无预设选项
        reflection: {
          zh: '真实偏振片的消光比通常在10³到10⁵之间。完美消光受限于表面散射、材料不均匀性和波长依赖性。',
          en: 'Real polarizer extinction ratios typically range from 10³ to 10⁵. Perfect extinction is limited by surface scattering, material inhomogeneity, and wavelength dependence.',
        },
      },
    },
  },

  // Point 2: Malus定律 — 角度与强度的关系
  {
    id: 'malus-cosine',
    phase: 'predict',
    trigger: { type: 'step', step: 1 },
    question: {
      zh: '将分析器从0°转到90°，透射光强度随角度如何变化？是线性下降还是其他规律？',
      en: 'As you rotate the analyzer from 0° to 90°, how does transmitted intensity change? Linear decrease or something else?',
    },
    predictions: [
      {
        id: 'linear',
        label: { zh: '线性下降', en: 'Linear decrease' },
        isCorrect: false,
      },
      {
        id: 'cosine-sq',
        label: { zh: 'cos²θ 变化', en: 'cos²θ variation' },
        isCorrect: true,
      },
      {
        id: 'sudden',
        label: { zh: '突然变暗', en: 'Sudden drop' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '这就是Malus定律！透射强度 I = I₀ cos²θ。注意在45°时强度恰好是一半，这是cos²45° = 0.5的体现。',
      en: "This is Malus's Law! Transmitted intensity I = I₀ cos²θ. Notice at 45° the intensity is exactly half — that's cos²45° = 0.5.",
    },
    formula: 'I = I₀ cos²θ',
    unlocksControls: ['analyzer-angle', 'intensity-chart'],
    highlightControls: ['intensity-chart'],
    triggersDiscovery: ['malus_law'],
    tiers: {
      foundation: {
        question: {
          zh: '慢慢转动分析器。在哪个角度光最亮？哪个最暗？',
          en: 'Slowly rotate the analyzer. At what angle is light brightest? Darkest?',
        },
        predictions: [
          {
            id: 'zero-bright',
            label: { zh: '0°最亮，90°最暗', en: '0° brightest, 90° darkest' },
            isCorrect: true,
          },
          {
            id: 'forty-five',
            label: { zh: '45°最暗', en: '45° is darkest' },
            isCorrect: false,
          },
        ],
        formula: undefined, // Foundation不揭示公式
      },
      research: {
        formula: 'I(θ) = I₀ cos²θ = I₀ · (1 + cos 2θ) / 2',
      },
    },
  },

  // Point 3: 特殊角度 — 45°的意义
  {
    id: 'malus-45deg',
    phase: 'predict',
    trigger: { type: 'parameter', param: 'analyzerAngle', condition: (v) => Math.abs(v - 45) < 3 },
    question: {
      zh: '在45°时，透射的光强是原来的多少？',
      en: 'At 45°, what fraction of the original intensity is transmitted?',
    },
    predictions: [
      {
        id: 'quarter',
        label: { zh: '1/4', en: '1/4' },
        isCorrect: false,
      },
      {
        id: 'half',
        label: { zh: '1/2（一半）', en: '1/2 (half)' },
        isCorrect: true,
      },
      {
        id: 'three-quarter',
        label: { zh: '3/4', en: '3/4' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: 'cos²(45°) = (√2/2)² = 1/2。这个特殊角度在光学系统中常用于分光——一半光通过，一半被阻挡。',
      en: 'cos²(45°) = (√2/2)² = 1/2. This special angle is commonly used in optical systems for beam splitting — half the light passes, half is blocked.',
    },
    tiers: {
      foundation: {
        skip: true, // Foundation跳过定量问题
      },
    },
  },
]
