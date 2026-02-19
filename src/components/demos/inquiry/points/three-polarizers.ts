/**
 * three-polarizers.ts - 三偏振片悖论探究点
 *
 * "P1=0°, P3=90°, 完全暗 → 加入P2=45° → 光出现了！"
 */

import type { InquiryPoint } from '@/stores/inquiryStore'

export const threePolarizersInquiryPoints: InquiryPoint[] = [
  // Point 1: 两片正交 → 暗
  {
    id: '3pol-crossed',
    phase: 'predict',
    trigger: { type: 'step', step: 0 },
    question: {
      zh: '第一片偏振器0°，第三片90°，没有光通过。如果在中间插入一片45°的偏振器，会发生什么？',
      en: 'First polarizer at 0°, third at 90°, no light passes. If you insert a 45° polarizer in between, what happens?',
    },
    predictions: [
      {
        id: 'still-dark',
        label: { zh: '还是全暗', en: 'Still dark' },
        isCorrect: false,
      },
      {
        id: 'light-appears',
        label: { zh: '光出现了！', en: 'Light appears!' },
        isCorrect: true,
      },
      {
        id: 'brighter',
        label: { zh: '比原来更亮', en: 'Even brighter' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '这就是三偏振片悖论！多加一片偏振器反而让光通过了。第二片偏振器改变了光的偏振方向，让一部分光能通过第三片。',
      en: "This is the three-polarizer paradox! Adding a polarizer actually lets light through. The middle polarizer rotates the polarization direction, allowing some light to pass the third.",
    },
    unlocksControls: ['middle-polarizer', 'middle-angle'],
    highlightControls: ['middle-polarizer'],
    tiers: {
      foundation: {
        question: {
          zh: '两片垂直偏振片之间全是黑的。我们加第三片在中间，你猜会怎样？',
          en: "It's all dark between two crossed polarizers. Let's add a third one in the middle. What do you think happens?",
        },
        predictions: [
          {
            id: 'dark',
            label: { zh: '更暗了', en: 'Even darker' },
            isCorrect: false,
          },
          {
            id: 'light',
            label: { zh: '居然有光！', en: 'Light appears!' },
            isCorrect: true,
          },
        ],
      },
    },
  },

  // Point 2: 最佳角度
  {
    id: '3pol-optimal',
    phase: 'predict',
    trigger: { type: 'step', step: 1 },
    question: {
      zh: '中间偏振器在什么角度时，透射光最强？',
      en: 'At what angle of the middle polarizer is the transmitted light strongest?',
    },
    predictions: [
      {
        id: '30deg',
        label: { zh: '30°', en: '30°' },
        isCorrect: false,
      },
      {
        id: '45deg',
        label: { zh: '45°', en: '45°' },
        isCorrect: true,
      },
      {
        id: '60deg',
        label: { zh: '60°', en: '60°' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '45°是最佳角度！此时透射强度为 I₀/8。每经过一片偏振器，光强按cos²规律衰减两次：cos²(45°)×cos²(45°) = 1/4。再加上第一片偏振器的1/2，总共 I₀/8。',
      en: "45° is optimal! The transmitted intensity is I₀/8. Light loses intensity by cos² at each polarizer: cos²(45°)×cos²(45°) = 1/4. With the first polarizer's 1/2 factor, total is I₀/8.",
    },
    formula: 'I = I₀ · (1/2) · cos²(45°) · cos²(45°) = I₀/8',
    highlightControls: ['middle-angle'],
    tiers: {
      foundation: {
        skip: true,
      },
      research: {
        formula: 'I = (I₀/2) · cos²(θ₂ - θ₁) · cos²(θ₃ - θ₂)',
        reflection: {
          zh: '对于N片等间距偏振器（0°到90°），透射率为 (cos²(π/2N))^(N-1)。当N→∞时趋近1——这与量子Zeno效应有深刻联系。',
          en: 'For N equally spaced polarizers (0° to 90°), transmittance is (cos²(π/2N))^(N-1). As N→∞ this approaches 1 — deeply connected to the quantum Zeno effect.',
        },
      },
    },
  },
]
