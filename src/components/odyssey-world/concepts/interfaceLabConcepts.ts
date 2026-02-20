/**
 * interfaceLabConcepts.ts -- Interface Lab 区域概念定义
 *
 * 将 Interface Lab 的发现映射到三层深度内容。
 * 3 个核心概念 (覆盖 Unit 2/3: 界面 + 透明介质):
 *
 * 1. 菲涅耳反射 (Fresnel Reflection) -- s 和 p 偏振反射系数随入射角变化
 * 2. 介质对比 (Medium Comparison) -- 不同介质的偏振行为比较
 * 3. 叠层界面 (Stacked Interfaces) -- 多层界面的累积偏振效应
 *
 * 每个概念通过 i18n 键引用双语内容 (en/zh)。
 */

import type { ConceptDefinition } from './conceptRegistry'
import { registerRegionConcepts } from './conceptRegistry'

// ── Interface Lab 概念定义 ────────────────────────────────────────────

export const interfaceLabConcepts: ConceptDefinition[] = [
  {
    // 菲涅耳反射: 完整的 s/p 偏振反射系数随角度变化，扩展布儒斯特角概念
    id: 'fresnel-reflection',
    discoveryId: 'interface-lab-fresnel-reflection',
    regionId: 'interface-lab',
    nameKey: 'odyssey.concepts.fresnelReflection.name',

    intuition: {
      titleKey: 'odyssey.concepts.fresnelReflection.intuition.title',
      contentKey: 'odyssey.concepts.fresnelReflection.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.fresnelReflection.qualitative.title',
      contentKey: 'odyssey.concepts.fresnelReflection.qualitative.content',
      diagramComponent: 'fresnel-reflection-diagram',
      animationHints: ['rs-rp-curves', 'brewster-crossing'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.fresnelReflection.quantitative.title',
      contentKey: 'odyssey.concepts.fresnelReflection.quantitative.content',
      formulas: [
        {
          latex: 'r_s = \\frac{n_1 \\cos\\theta_i - n_2 \\cos\\theta_t}{n_1 \\cos\\theta_i + n_2 \\cos\\theta_t}',
          labelKey: 'odyssey.concepts.fresnelReflection.formulas.rs',
        },
        {
          latex: 'r_p = \\frac{n_2 \\cos\\theta_i - n_1 \\cos\\theta_t}{n_2 \\cos\\theta_i + n_1 \\cos\\theta_t}',
          labelKey: 'odyssey.concepts.fresnelReflection.formulas.rp',
        },
        {
          latex: 'R_s = |r_s|^2, \\quad R_p = |r_p|^2',
          labelKey: 'odyssey.concepts.fresnelReflection.formulas.reflectance',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.fresnelReflection.quantitative.derivation',
    },

    demoComponentId: 'fresnel-explorer',
    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'brewster-angle',
        type: 'causal',
        labelKey: 'odyssey.concepts.fresnelReflection.connections.brewster',
      },
      {
        targetConceptId: 'medium-comparison',
        type: 'causal',
        labelKey: 'odyssey.concepts.fresnelReflection.connections.medium',
      },
      {
        targetConceptId: 'rayleigh-polarization',
        type: 'analogous',
        labelKey: 'odyssey.concepts.fresnelReflection.connections.rayleigh',
      },
    ],
  },

  {
    // 介质对比: 不同折射率介质 (玻璃、水、晶体) 的偏振行为差异
    id: 'medium-comparison',
    discoveryId: 'interface-lab-medium-comparison',
    regionId: 'interface-lab',
    nameKey: 'odyssey.concepts.mediumComparison.name',

    intuition: {
      titleKey: 'odyssey.concepts.mediumComparison.intuition.title',
      contentKey: 'odyssey.concepts.mediumComparison.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.mediumComparison.qualitative.title',
      contentKey: 'odyssey.concepts.mediumComparison.qualitative.content',
      diagramComponent: 'medium-comparison-diagram',
      animationHints: ['medium-switch', 'brewster-shift'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.mediumComparison.quantitative.title',
      contentKey: 'odyssey.concepts.mediumComparison.quantitative.content',
      formulas: [
        {
          latex: 'n_1 \\sin\\theta_i = n_2 \\sin\\theta_t',
          labelKey: 'odyssey.concepts.mediumComparison.formulas.snellLaw',
        },
        {
          latex: '\\theta_B = \\arctan(n_2 / n_1)',
          labelKey: 'odyssey.concepts.mediumComparison.formulas.brewsterVaries',
        },
      ],
    },

    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'fresnel-reflection',
        type: 'causal',
        labelKey: 'odyssey.concepts.mediumComparison.connections.fresnel',
      },
      {
        targetConceptId: 'stacked-interfaces',
        type: 'causal',
        labelKey: 'odyssey.concepts.mediumComparison.connections.stacked',
      },
    ],
  },

  {
    // 叠层界面: 多层介质界面产生干涉和累积偏振效应
    id: 'stacked-interfaces',
    discoveryId: 'interface-lab-stacked-interfaces',
    regionId: 'interface-lab',
    nameKey: 'odyssey.concepts.stackedInterfaces.name',

    intuition: {
      titleKey: 'odyssey.concepts.stackedInterfaces.intuition.title',
      contentKey: 'odyssey.concepts.stackedInterfaces.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.stackedInterfaces.qualitative.title',
      contentKey: 'odyssey.concepts.stackedInterfaces.qualitative.content',
      diagramComponent: 'stacked-interfaces-diagram',
      animationHints: ['layer-stack', 'cumulative-polarization'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.stackedInterfaces.quantitative.title',
      contentKey: 'odyssey.concepts.stackedInterfaces.quantitative.content',
      formulas: [
        {
          latex: 'M_{\\text{total}} = M_N \\cdot M_{N-1} \\cdots M_2 \\cdot M_1',
          labelKey: 'odyssey.concepts.stackedInterfaces.formulas.transferMatrix',
        },
        {
          latex: 'R_{\\text{stack}} = 1 - \\prod_{k=1}^{N}(1 - R_k)',
          labelKey: 'odyssey.concepts.stackedInterfaces.formulas.cumulativeReflection',
        },
      ],
    },

    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'medium-comparison',
        type: 'causal',
        labelKey: 'odyssey.concepts.stackedInterfaces.connections.medium',
      },
      {
        targetConceptId: 'fresnel-reflection',
        type: 'causal',
        labelKey: 'odyssey.concepts.stackedInterfaces.connections.fresnel',
      },
    ],
  },
]

// ── 注册到全局注册表 ──────────────────────────────────────────────────

registerRegionConcepts('interface-lab', interfaceLabConcepts)
