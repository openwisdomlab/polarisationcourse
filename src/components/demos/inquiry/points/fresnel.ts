/**
 * fresnel.ts - Fresnel反射与Brewster角探究点
 *
 * "入射角增大，反射光偏振会？" → 布儒斯特角发现
 */

import type { InquiryPoint } from '@/stores/inquiryStore'

export const fresnelInquiryPoints: InquiryPoint[] = [
  // Point 1: 反射光的偏振
  {
    id: 'fresnel-reflection-pol',
    phase: 'predict',
    trigger: { type: 'step', step: 0 },
    question: {
      zh: '当光以一定角度照射玻璃表面时，反射光是否有偏振倾向？',
      en: 'When light hits a glass surface at an angle, does the reflected light have a polarization preference?',
    },
    predictions: [
      {
        id: 'no-pol',
        label: { zh: '没有偏振', en: 'No polarization' },
        isCorrect: false,
      },
      {
        id: 's-pol',
        label: { zh: '偏向s偏振（平行于表面）', en: 's-polarized (parallel to surface)' },
        isCorrect: true,
      },
      {
        id: 'p-pol',
        label: { zh: '偏向p偏振（在入射面内）', en: 'p-polarized (in plane of incidence)' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '反射光偏向s偏振！这就是为什么偏光太阳镜能减少眩光——水面和路面的反射光主要是水平偏振的。',
      en: "Reflected light favors s-polarization! That's why polarized sunglasses reduce glare — reflections from water and roads are mainly horizontally polarized.",
    },
    unlocksControls: ['incident-angle', 'polarization-view'],
    highlightControls: ['incident-angle'],
  },

  // Point 2: 布儒斯特角
  {
    id: 'fresnel-brewster',
    phase: 'predict',
    trigger: { type: 'step', step: 1 },
    question: {
      zh: '增大入射角，存在某个特殊角度使p偏振反射率降为零。这个角度大约是多少？（玻璃n≈1.5）',
      en: 'As you increase the angle, there\'s a special angle where p-polarized reflection drops to zero. What is it approximately? (glass n≈1.5)',
    },
    predictions: [
      {
        id: '45deg',
        label: { zh: '≈45°', en: '≈45°' },
        isCorrect: false,
      },
      {
        id: '56deg',
        label: { zh: '≈56°', en: '≈56°' },
        isCorrect: true,
      },
      {
        id: '70deg',
        label: { zh: '≈70°', en: '≈70°' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '这就是布儒斯特角！当 tan(θ_B) = n₂/n₁ 时，p偏振完全不反射。对于玻璃 (n=1.5)，θ_B = arctan(1.5) ≈ 56.3°。此时反射光是完全s偏振的。',
      en: "This is Brewster's angle! When tan(θ_B) = n₂/n₁, p-polarized light has zero reflection. For glass (n=1.5), θ_B = arctan(1.5) ≈ 56.3°. The reflected light is perfectly s-polarized.",
    },
    formula: 'θ_B = arctan(n₂/n₁)',
    triggersDiscovery: ['brewster_angle'],
    highlightControls: ['incident-angle'],
    tiers: {
      foundation: {
        question: {
          zh: '慢慢增大入射角。你能找到一个特殊角度，让反射光几乎消失吗？',
          en: 'Slowly increase the angle. Can you find a special angle where reflected light nearly disappears?',
        },
        predictions: [
          {
            id: 'found',
            label: { zh: '找到了！大约在50-60°', en: 'Found it! Around 50-60°' },
            isCorrect: true,
          },
          {
            id: 'not-found',
            label: { zh: '没有这样的角度', en: 'No such angle exists' },
            isCorrect: false,
          },
        ],
        formula: undefined,
      },
      research: {
        formula: 'θ_B = arctan(n₂/n₁),  R_p(θ_B) = 0,  R_s(θ_B) = ((n²-1)/(n²+1))²',
      },
    },
  },

  // Point 3: 全偏振反射的应用
  {
    id: 'fresnel-application',
    phase: 'predict',
    trigger: { type: 'step', step: 2 },
    question: {
      zh: '利用布儒斯特角可以做什么？为什么激光器的窗片要倾斜放置？',
      en: "What can Brewster's angle be used for? Why are laser cavity windows tilted?",
    },
    reflection: {
      zh: '激光器使用布儒斯特窗——将窗片倾斜到布儒斯特角，p偏振无反射损耗。这选择性地放大了p偏振光，使激光输出成为线偏振光。',
      en: "Lasers use Brewster windows — tilting the window to Brewster's angle eliminates reflection loss for p-polarized light. This selectively amplifies p-polarization, making the laser output linearly polarized.",
    },
    tiers: {
      foundation: {
        skip: true,
      },
    },
  },
]
