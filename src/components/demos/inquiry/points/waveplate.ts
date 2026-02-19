/**
 * waveplate.ts - 波片探究点
 *
 * "线偏振通过QWP后变成？" → 圆偏振预测
 */

import type { InquiryPoint } from '@/stores/inquiryStore'

export const waveplateInquiryPoints: InquiryPoint[] = [
  // Point 1: 四分之一波片效果
  {
    id: 'wp-qwp-effect',
    phase: 'predict',
    trigger: { type: 'step', step: 0 },
    question: {
      zh: '45°线偏振光通过四分之一波片后，会变成什么偏振态？',
      en: 'What polarization state does 45° linearly polarized light become after passing through a quarter-wave plate?',
    },
    predictions: [
      {
        id: 'still-linear',
        label: { zh: '还是线偏振', en: 'Still linear' },
        isCorrect: false,
      },
      {
        id: 'circular',
        label: { zh: '圆偏振', en: 'Circular polarization' },
        isCorrect: true,
      },
      {
        id: 'unpolarized',
        label: { zh: '非偏振', en: 'Unpolarized' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: 'QWP引入90°相位差：将45°线偏振的x和y分量变为相差π/2，形成圆偏振光！旋转方向取决于快轴与偏振方向的关系。',
      en: 'A QWP introduces 90° phase difference: the x and y components of 45° linear polarization become π/2 out of phase, forming circular polarization! Handedness depends on the fast axis orientation.',
    },
    unlocksControls: ['waveplate-type', 'input-angle'],
    highlightControls: ['waveplate-type'],
    triggersDiscovery: ['quarter_wave_plate'],
    tiers: {
      foundation: {
        question: {
          zh: '波片像一个"魔法滤镜"——它能把直线振动的光变成旋转的光。你觉得会变成什么样？',
          en: 'A waveplate is like a "magic filter" — it can turn straight-vibrating light into rotating light. What do you think it becomes?',
        },
        predictions: [
          {
            id: 'spinning',
            label: { zh: '光开始旋转了！', en: 'Light starts spinning!' },
            isCorrect: true,
          },
          {
            id: 'nothing',
            label: { zh: '没有变化', en: 'No change' },
            isCorrect: false,
          },
        ],
      },
    },
  },

  // Point 2: 半波片效果
  {
    id: 'wp-hwp-effect',
    phase: 'predict',
    trigger: { type: 'step', step: 1 },
    question: {
      zh: '半波片（HWP）对线偏振光做什么？如果输入偏振方向与快轴成θ角？',
      en: 'What does a half-wave plate (HWP) do to linearly polarized light? If the input polarization is at angle θ to the fast axis?',
    },
    predictions: [
      {
        id: 'rotate-2theta',
        label: { zh: '旋转2θ', en: 'Rotates by 2θ' },
        isCorrect: true,
      },
      {
        id: 'flip',
        label: { zh: '完全翻转', en: 'Completely flips' },
        isCorrect: false,
      },
      {
        id: 'circular',
        label: { zh: '变成圆偏振', en: 'Becomes circular' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: 'HWP将偏振方向旋转2θ（θ为偏振方向与快轴的夹角）。这使HWP成为精确的偏振旋转器——在光通信和激光系统中广泛使用。',
      en: 'HWP rotates the polarization direction by 2θ (where θ is the angle between polarization and fast axis). This makes HWP a precise polarization rotator — widely used in optical communications and laser systems.',
    },
    formula: 'θ_out = 2θ_fast - θ_in',
    triggersDiscovery: ['half_wave_plate'],
    highlightControls: ['fast-axis-angle'],
    tiers: {
      foundation: {
        question: {
          zh: '半波片比四分之一波片"更强"。它对线偏振光做了什么？观察偏振方向。',
          en: 'A half-wave plate is "stronger" than a quarter-wave. What does it do to linear polarization? Watch the direction.',
        },
        predictions: [
          {
            id: 'rotated',
            label: { zh: '偏振方向转了！', en: 'Direction rotated!' },
            isCorrect: true,
          },
          {
            id: 'same',
            label: { zh: '方向不变', en: 'Same direction' },
            isCorrect: false,
          },
        ],
        formula: undefined,
      },
    },
  },
]
