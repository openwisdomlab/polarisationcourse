/**
 * stokes-vector.ts - Stokes参数与Poincaré球探究点
 *
 * "改变椭偏率，Poincaré球上点如何移动？"
 */

import type { InquiryPoint } from '@/stores/inquiryStore'

export const stokesVectorInquiryPoints: InquiryPoint[] = [
  // Point 1: Stokes参数的物理意义
  {
    id: 'stokes-meaning',
    phase: 'predict',
    trigger: { type: 'step', step: 0 },
    question: {
      zh: '水平线偏振光的Stokes向量是什么？S = (S₀, S₁, S₂, S₃) 中哪些分量不为零？',
      en: 'What is the Stokes vector for horizontal linear polarization? Which components of S = (S₀, S₁, S₂, S₃) are non-zero?',
    },
    predictions: [
      {
        id: 'all-nonzero',
        label: { zh: '全部不为零', en: 'All non-zero' },
        isCorrect: false,
      },
      {
        id: 's0-s1',
        label: { zh: '只有S₀和S₁', en: 'Only S₀ and S₁' },
        isCorrect: true,
      },
      {
        id: 's0-only',
        label: { zh: '只有S₀', en: 'Only S₀' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: '水平线偏振：S = (1, 1, 0, 0)。S₀是总强度，S₁描述水平/垂直偏好，S₂描述±45°偏好，S₃描述圆偏振。只有S₀（强度）和S₁（水平偏好）不为零。',
      en: 'Horizontal linear: S = (1, 1, 0, 0). S₀ is total intensity, S₁ describes H/V preference, S₂ describes ±45° preference, S₃ describes circular polarization. Only S₀ (intensity) and S₁ (horizontal preference) are non-zero.',
    },
    formula: 'S_horizontal = (1, 1, 0, 0)ᵀ',
    unlocksControls: ['polarization-type', 'orientation'],
    highlightControls: ['polarization-type'],
    triggersDiscovery: ['polarimetry'],
    tiers: {
      foundation: {
        question: {
          zh: 'Stokes向量用4个数字描述光的偏振状态。对于水平偏振光，你觉得哪些数字"活跃"？',
          en: 'Stokes vector uses 4 numbers to describe polarization. For horizontal polarization, which numbers do you think are "active"?',
        },
        predictions: [
          {
            id: 'first-two',
            label: { zh: '前两个', en: 'First two' },
            isCorrect: true,
          },
          {
            id: 'all',
            label: { zh: '全部', en: 'All of them' },
            isCorrect: false,
          },
        ],
      },
    },
  },

  // Point 2: Poincaré球上的运动
  {
    id: 'stokes-poincare',
    phase: 'predict',
    trigger: { type: 'step', step: 1 },
    question: {
      zh: '在Poincaré球上，线偏振对应什么位置？圆偏振呢？',
      en: 'On the Poincaré sphere, where does linear polarization map? And circular?',
    },
    predictions: [
      {
        id: 'equator-poles',
        label: { zh: '线偏振在赤道，圆偏振在极点', en: 'Linear on equator, circular at poles' },
        isCorrect: true,
      },
      {
        id: 'poles-equator',
        label: { zh: '线偏振在极点，圆偏振在赤道', en: 'Linear at poles, circular on equator' },
        isCorrect: false,
      },
      {
        id: 'random',
        label: { zh: '没有规律', en: 'No pattern' },
        isCorrect: false,
      },
    ],
    reflection: {
      zh: 'Poincaré球完美地映射了偏振态：赤道=所有线偏振（绕一圈对应0°→180°），北极=右旋圆偏振，南极=左旋圆偏振，其他纬度=椭圆偏振。',
      en: 'The Poincaré sphere perfectly maps polarization: equator = all linear (going around = 0° to 180°), north pole = right circular, south pole = left circular, other latitudes = elliptical.',
    },
    highlightControls: ['ellipticity', 'poincare-sphere'],
    tiers: {
      foundation: {
        question: {
          zh: '想象一个球：所有"直线"偏振在球的哪里？"旋转"偏振呢？',
          en: 'Imagine a sphere: where are all "straight" polarizations? And "spinning" polarizations?',
        },
        predictions: [
          {
            id: 'belt-cap',
            label: { zh: '直线在腰带，旋转在顶部', en: 'Straight on belt, spinning on top' },
            isCorrect: true,
          },
          {
            id: 'mixed',
            label: { zh: '随机分布', en: 'Random distribution' },
            isCorrect: false,
          },
        ],
      },
    },
  },
]
