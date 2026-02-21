/**
 * refractionBenchConcepts.ts -- Refraction Bench 区域概念定义
 *
 * 将 Refraction Bench 的 4 个发现映射到三层深度内容。
 * 选取其中 3 个核心概念:
 *
 * 1. 布儒斯特角 (Brewster's Angle) -- 反射光在特定入射角完全偏振化
 * 2. 斯涅尔定律偏振效应 (Snell's Law Polarization) -- 折射光的 s/p 分量差异
 * 3. 全内反射 (Total Internal Reflection) -- 超过临界角时光完全反射
 *
 * 每个概念通过 i18n 键引用双语内容 (en/zh)。
 */

import type { ConceptDefinition } from './conceptRegistry'
import { registerRegionConcepts } from './conceptRegistry'

// ── Refraction Bench 概念定义 ─────────────────────────────────────────

export const refractionBenchConcepts: ConceptDefinition[] = [
  {
    // 布儒斯特角: 反射光在特定角度变为完全线偏振
    id: 'brewster-angle',
    discoveryId: 'refraction-bench-brewster-angle',
    regionId: 'refraction-bench',
    nameKey: 'odyssey.concepts.brewsterAngle.name',

    intuition: {
      titleKey: 'odyssey.concepts.brewsterAngle.intuition.title',
      contentKey: 'odyssey.concepts.brewsterAngle.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.brewsterAngle.qualitative.title',
      contentKey: 'odyssey.concepts.brewsterAngle.qualitative.content',
      diagramComponent: 'brewster-angle-diagram',
      animationHints: ['reflection-sweep', 'p-component-vanish'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.brewsterAngle.quantitative.title',
      contentKey: 'odyssey.concepts.brewsterAngle.quantitative.content',
      formulas: [
        {
          latex: '\\theta_B = \\arctan\\left(\\frac{n_2}{n_1}\\right)',
          labelKey: 'odyssey.concepts.brewsterAngle.formulas.main',
        },
        {
          latex: '\\theta_B + \\theta_r = 90°',
          labelKey: 'odyssey.concepts.brewsterAngle.formulas.complementary',
        },
        {
          latex: 'r_p = \\frac{n_2\\cos\\theta_i - n_1\\cos\\theta_t}{n_2\\cos\\theta_i + n_1\\cos\\theta_t} = 0',
          labelKey: 'odyssey.concepts.brewsterAngle.formulas.fresnelRp',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.brewsterAngle.quantitative.derivation',
    },

    courseLink: {
      path: '/demos/brewster',
      labelKey: 'odyssey.courseLink.brewsterAngle',
    },

    demoComponentId: 'brewster-explorer',
    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'malus-law',
        type: 'causal',
        labelKey: 'odyssey.concepts.brewsterAngle.connections.malus',
      },
      {
        targetConceptId: 'total-internal-reflection',
        type: 'analogous',
        labelKey: 'odyssey.concepts.brewsterAngle.connections.tir',
      },
      {
        targetConceptId: 'snell-polarization',
        type: 'causal',
        labelKey: 'odyssey.concepts.brewsterAngle.connections.snell',
      },
    ],
  },

  {
    // 斯涅尔定律偏振效应: 折射光的 s 和 p 偏振分量表现不同
    id: 'snell-polarization',
    discoveryId: 'refraction-bench-snell-polarization',
    regionId: 'refraction-bench',
    nameKey: 'odyssey.concepts.snellPolarization.name',

    intuition: {
      titleKey: 'odyssey.concepts.snellPolarization.intuition.title',
      contentKey: 'odyssey.concepts.snellPolarization.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.snellPolarization.qualitative.title',
      contentKey: 'odyssey.concepts.snellPolarization.qualitative.content',
      diagramComponent: 'snell-polarization-diagram',
      animationHints: ['sp-decomposition', 'refracted-beam-color'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.snellPolarization.quantitative.title',
      contentKey: 'odyssey.concepts.snellPolarization.quantitative.content',
      formulas: [
        {
          latex: 'n_1 \\sin\\theta_i = n_2 \\sin\\theta_t',
          labelKey: 'odyssey.concepts.snellPolarization.formulas.snell',
        },
        {
          latex: 'r_s = \\frac{n_1\\cos\\theta_i - n_2\\cos\\theta_t}{n_1\\cos\\theta_i + n_2\\cos\\theta_t}',
          labelKey: 'odyssey.concepts.snellPolarization.formulas.fresnelRs',
        },
        {
          latex: 'r_p = \\frac{n_2\\cos\\theta_i - n_1\\cos\\theta_t}{n_2\\cos\\theta_i + n_1\\cos\\theta_t}',
          labelKey: 'odyssey.concepts.snellPolarization.formulas.fresnelRp',
        },
      ],
    },

    courseLink: {
      path: '/demos/fresnel',
      labelKey: 'odyssey.courseLink.snellPolarization',
    },

    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'brewster-angle',
        type: 'causal',
        labelKey: 'odyssey.concepts.snellPolarization.connections.brewster',
      },
      {
        targetConceptId: 'circular-polarization',
        type: 'analogous',
        labelKey: 'odyssey.concepts.snellPolarization.connections.circular',
      },
    ],
  },

  {
    // 全内反射: 入射角超过临界角时，光完全在界面反射
    id: 'total-internal-reflection',
    discoveryId: 'refraction-bench-total-reflection',
    regionId: 'refraction-bench',
    nameKey: 'odyssey.concepts.totalInternalReflection.name',

    intuition: {
      titleKey: 'odyssey.concepts.totalInternalReflection.intuition.title',
      contentKey: 'odyssey.concepts.totalInternalReflection.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.totalInternalReflection.qualitative.title',
      contentKey: 'odyssey.concepts.totalInternalReflection.qualitative.content',
      diagramComponent: 'total-reflection-diagram',
      animationHints: ['critical-angle-sweep', 'evanescent-wave'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.totalInternalReflection.quantitative.title',
      contentKey: 'odyssey.concepts.totalInternalReflection.quantitative.content',
      formulas: [
        {
          latex: '\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)',
          labelKey: 'odyssey.concepts.totalInternalReflection.formulas.criticalAngle',
        },
        {
          latex: '\\theta_i > \\theta_c \\Rightarrow R = 1',
          labelKey: 'odyssey.concepts.totalInternalReflection.formulas.totalReflection',
        },
      ],
    },

    courseLink: {
      path: '/demos/fresnel',
      labelKey: 'odyssey.courseLink.totalInternalReflection',
    },

    triggerElementTypes: ['environment'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'brewster-angle',
        type: 'analogous',
        labelKey: 'odyssey.concepts.totalInternalReflection.connections.brewster',
      },
    ],
  },
]

// ── 注册到全局注册表 ──────────────────────────────────────────────────

registerRegionConcepts('refraction-bench', refractionBenchConcepts)
