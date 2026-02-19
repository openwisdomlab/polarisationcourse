/**
 * optical-rotation.ts - 旋光效应探究点
 *
 * "加入糖溶液后消光点会？" → 旋光角测量
 */

import type { InquiryPoint } from '@/stores/inquiryStore'

export const opticalRotationInquiryPoints: InquiryPoint[] = [
  // Point 1: 旋光现象
  {
    id: 'optrot-discovery',
    phase: 'predict',
    trigger: { type: 'step', step: 0 },
    question: {
      zh: '将糖溶液放在两个正交偏振器之间，原本完全暗的视场会发生什么变化？',
      en: 'Place a sugar solution between two crossed polarizers. What happens to the dark field?',
    },
    predictions: [
      {
        id: 'still-dark',
        label: { zh: '还是全暗', en: 'Still dark' },
        isCorrect: false,
      },
      {
        id: 'light-appears',
        label: { zh: '出现了光！', en: 'Light appears!' },
        isCorrect: true,
      },
      {
        id: 'colored',
        label: { zh: '出现彩色光', en: 'Colored light appears' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '糖溶液旋转了偏振方向！原本被第二片偏振器阻挡的光，因为偏振方向被旋转了一个角度，部分光得以通过。这就是"旋光效应"。',
      en: "The sugar solution rotated the polarization direction! Light originally blocked by the second polarizer can partially pass because its polarization was rotated. This is the 'optical rotation' effect.",
    },
    unlocksControls: ['concentration', 'path-length'],
    highlightControls: ['concentration'],
    triggersDiscovery: ['optical_rotation'],
    tiers: {
      foundation: {
        question: {
          zh: '两个偏振片十字交叉，黑的。现在中间放入糖水——你猜会怎样？',
          en: "Two crossed polarizers make it dark. Now put sugar water in between — what do you think happens?",
        },
      },
    },
  },

  // Point 2: 浓度与旋光角
  {
    id: 'optrot-concentration',
    phase: 'predict',
    trigger: { type: 'step', step: 1 },
    question: {
      zh: '如果增加糖溶液的浓度，旋光角会怎样变化？',
      en: 'If you increase the sugar solution concentration, how does the rotation angle change?',
    },
    predictions: [
      {
        id: 'proportional',
        label: { zh: '成正比增大', en: 'Increases proportionally' },
        isCorrect: true,
      },
      {
        id: 'decrease',
        label: { zh: '减小', en: 'Decreases' },
        isCorrect: false,
      },
      {
        id: 'constant',
        label: { zh: '不变', en: 'Stays constant' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '旋光角与浓度和光程长度都成正比：α = [α]₀ · c · l。这个关系是偏振光测糖仪的基础——通过测量旋光角可以精确测定糖浓度。',
      en: 'Rotation angle is proportional to both concentration and path length: α = [α]₀ · c · l. This is the basis of the polarimetric sugar meter — measuring rotation angle gives precise sugar concentration.',
    },
    formula: 'α = [α]₀ · c · l',
    highlightControls: ['concentration', 'path-length'],
    tiers: {
      foundation: {
        question: {
          zh: '加更多糖进去，光的变化会更大还是更小？',
          en: 'Add more sugar. Does the light change more or less?',
        },
        predictions: [
          {
            id: 'more',
            label: { zh: '变化更大', en: 'Changes more' },
            isCorrect: true,
          },
          {
            id: 'less',
            label: { zh: '变化更小', en: 'Changes less' },
            isCorrect: false,
          },
        ],
        formula: undefined,
      },
    },
  },
]
