/**
 * scatteringChamberConcepts.ts -- Scattering Chamber 区域概念定义
 *
 * 将 Scattering Chamber 的发现映射到三层深度内容。
 * 2 个核心概念 (覆盖 Unit 4: 散射介质):
 *
 * 1. 瑞利散射偏振 (Rayleigh Polarization) -- 散射光在 90 度方向完全偏振化
 * 2. 天空偏振模式 (Sky Polarization Pattern) -- 以太阳为中心的天空偏振分布
 *
 * 每个概念通过 i18n 键引用双语内容 (en/zh)。
 */

import type { ConceptDefinition } from './conceptRegistry'
import { registerRegionConcepts } from './conceptRegistry'

// ── Scattering Chamber 概念定义 ──────────────────────────────────────

export const scatteringChamberConcepts: ConceptDefinition[] = [
  {
    // 瑞利散射偏振: 90 度散射方向产生完全线偏振光
    id: 'rayleigh-polarization',
    discoveryId: 'scattering-chamber-rayleigh-polarization',
    regionId: 'scattering-chamber',
    nameKey: 'odyssey.concepts.rayleighPolarization.name',

    intuition: {
      titleKey: 'odyssey.concepts.rayleighPolarization.intuition.title',
      contentKey: 'odyssey.concepts.rayleighPolarization.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.rayleighPolarization.qualitative.title',
      contentKey: 'odyssey.concepts.rayleighPolarization.qualitative.content',
      diagramComponent: 'rayleigh-polarization-diagram',
      animationHints: ['scattering-angle-sweep', 'polarization-degree-bar'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.rayleighPolarization.quantitative.title',
      contentKey: 'odyssey.concepts.rayleighPolarization.quantitative.content',
      formulas: [
        {
          latex: 'I(\\theta) \\propto 1 + \\cos^2\\theta',
          labelKey: 'odyssey.concepts.rayleighPolarization.formulas.scatteringIntensity',
        },
        {
          latex: 'DOP(\\theta) = \\frac{\\sin^2\\theta}{1 + \\cos^2\\theta}',
          labelKey: 'odyssey.concepts.rayleighPolarization.formulas.degreeOfPolarization',
        },
        {
          latex: 'DOP(90°) = 1 \\quad (\\text{fully polarized})',
          labelKey: 'odyssey.concepts.rayleighPolarization.formulas.maxPolarization',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.rayleighPolarization.quantitative.derivation',
    },

    demoComponentId: 'rayleigh-explorer',
    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'fresnel-reflection',
        type: 'analogous',
        labelKey: 'odyssey.concepts.rayleighPolarization.connections.fresnel',
      },
      {
        targetConceptId: 'sky-polarization-pattern',
        type: 'causal',
        labelKey: 'odyssey.concepts.rayleighPolarization.connections.skyPattern',
      },
    ],
  },

  {
    // 天空偏振模式: 以太阳为中心，90 度方向偏振度最大，昆虫用于导航
    id: 'sky-polarization-pattern',
    discoveryId: 'scattering-chamber-sky-pattern',
    regionId: 'scattering-chamber',
    nameKey: 'odyssey.concepts.skyPolarizationPattern.name',

    intuition: {
      titleKey: 'odyssey.concepts.skyPolarizationPattern.intuition.title',
      contentKey: 'odyssey.concepts.skyPolarizationPattern.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.skyPolarizationPattern.qualitative.title',
      contentKey: 'odyssey.concepts.skyPolarizationPattern.qualitative.content',
      diagramComponent: 'sky-polarization-diagram',
      animationHints: ['sun-position-sweep', 'polarization-band'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.skyPolarizationPattern.quantitative.title',
      contentKey: 'odyssey.concepts.skyPolarizationPattern.quantitative.content',
      formulas: [
        {
          latex: 'DOP(\\gamma) = \\frac{\\sin^2\\gamma}{1 + \\cos^2\\gamma}',
          labelKey: 'odyssey.concepts.skyPolarizationPattern.formulas.solarAngleDOP',
        },
        {
          latex: '\\gamma = \\text{angular distance from sun}',
          labelKey: 'odyssey.concepts.skyPolarizationPattern.formulas.gammaDefinition',
        },
      ],
    },

    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'rayleigh-polarization',
        type: 'causal',
        labelKey: 'odyssey.concepts.skyPolarizationPattern.connections.rayleigh',
      },
      {
        targetConceptId: 'degree-of-polarization',
        type: 'analogous',
        labelKey: 'odyssey.concepts.skyPolarizationPattern.connections.dop',
      },
    ],
  },
]

// ── 注册到全局注册表 ──────────────────────────────────────────────────

registerRegionConcepts('scattering-chamber', scatteringChamberConcepts)
