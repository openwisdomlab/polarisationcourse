/**
 * wavePlatformConcepts.ts -- Wave Platform 区域概念定义
 *
 * 将 Wave Platform 的发现映射到三层深度内容。
 * 3 个核心概念 (覆盖 Unit 1: 调制/相位延迟):
 *
 * 1. 相位延迟系列 (Retardation Series) -- 不同延迟量产生线/椭圆/圆偏振连续变化
 * 2. 波片补偿 (Waveplate Compensation) -- 两块波片组合产生净延迟
 * 3. Poincare 球 (Poincare Sphere) -- 偏振态在球面上的可视化映射
 *
 * 每个概念通过 i18n 键引用双语内容 (en/zh)。
 */

import type { ConceptDefinition } from './conceptRegistry'
import { registerRegionConcepts } from './conceptRegistry'

// ── Wave Platform 概念定义 ────────────────────────────────────────────

export const wavePlatformConcepts: ConceptDefinition[] = [
  {
    // 相位延迟系列: 波片延迟量从 0 到全波，偏振态连续变化
    id: 'retardation-series',
    discoveryId: 'wave-platform-retardation-series',
    regionId: 'wave-platform',
    nameKey: 'odyssey.concepts.retardationSeries.name',

    intuition: {
      titleKey: 'odyssey.concepts.retardationSeries.intuition.title',
      contentKey: 'odyssey.concepts.retardationSeries.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.retardationSeries.qualitative.title',
      contentKey: 'odyssey.concepts.retardationSeries.qualitative.content',
      diagramComponent: 'retardation-series-diagram',
      animationHints: ['ellipse-morphing', 'retardation-sweep'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.retardationSeries.quantitative.title',
      contentKey: 'odyssey.concepts.retardationSeries.quantitative.content',
      formulas: [
        {
          latex: 'M_{\\text{WP}} = \\begin{pmatrix} \\cos^2\\theta + e^{i\\delta}\\sin^2\\theta & (1-e^{i\\delta})\\sin\\theta\\cos\\theta \\\\ (1-e^{i\\delta})\\sin\\theta\\cos\\theta & \\sin^2\\theta + e^{i\\delta}\\cos^2\\theta \\end{pmatrix}',
          labelKey: 'odyssey.concepts.retardationSeries.formulas.jonesMatrix',
        },
        {
          latex: '\\delta = \\frac{2\\pi d \\cdot \\Delta n}{\\lambda}',
          labelKey: 'odyssey.concepts.retardationSeries.formulas.retardationPhase',
        },
        {
          latex: '\\delta = 0 \\to \\text{linear},\\; \\frac{\\pi}{2} \\to \\text{circular},\\; \\pi \\to \\text{linear (rotated)}',
          labelKey: 'odyssey.concepts.retardationSeries.formulas.stateProgression',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.retardationSeries.quantitative.derivation',
    },

    demoComponentId: 'retardation-explorer',
    triggerElementTypes: ['waveplate'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'circular-polarization',
        type: 'causal',
        labelKey: 'odyssey.concepts.retardationSeries.connections.circular',
      },
      {
        targetConceptId: 'waveplate-compensation',
        type: 'causal',
        labelKey: 'odyssey.concepts.retardationSeries.connections.compensation',
      },
    ],
  },

  {
    // 波片补偿: 两块波片级联产生任意净延迟 (Babinet-Soleil 补偿器)
    id: 'waveplate-compensation',
    discoveryId: 'wave-platform-compensation',
    regionId: 'wave-platform',
    nameKey: 'odyssey.concepts.waveplateCompensation.name',

    intuition: {
      titleKey: 'odyssey.concepts.waveplateCompensation.intuition.title',
      contentKey: 'odyssey.concepts.waveplateCompensation.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.waveplateCompensation.qualitative.title',
      contentKey: 'odyssey.concepts.waveplateCompensation.qualitative.content',
      diagramComponent: 'waveplate-compensation-diagram',
      animationHints: ['cascaded-plates', 'net-retardation'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.waveplateCompensation.quantitative.title',
      contentKey: 'odyssey.concepts.waveplateCompensation.quantitative.content',
      formulas: [
        {
          latex: 'M_{\\text{total}} = M_2(\\delta_2, \\theta_2) \\cdot M_1(\\delta_1, \\theta_1)',
          labelKey: 'odyssey.concepts.waveplateCompensation.formulas.cascadedJones',
        },
        {
          latex: '\\delta_{\\text{net}} = \\delta_1 + \\delta_2 \\quad (\\text{aligned axes})',
          labelKey: 'odyssey.concepts.waveplateCompensation.formulas.netRetardation',
        },
      ],
    },

    triggerElementTypes: ['waveplate'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'retardation-series',
        type: 'causal',
        labelKey: 'odyssey.concepts.waveplateCompensation.connections.retardation',
      },
      {
        targetConceptId: 'poincare-sphere',
        type: 'analogous',
        labelKey: 'odyssey.concepts.waveplateCompensation.connections.poincare',
      },
    ],
  },

  {
    // Poincare 球: 所有偏振态映射到球面，波片操作对应球面旋转
    id: 'poincare-sphere',
    discoveryId: 'wave-platform-poincare-traverse',
    regionId: 'wave-platform',
    nameKey: 'odyssey.concepts.poincareSphere.name',

    intuition: {
      titleKey: 'odyssey.concepts.poincareSphere.intuition.title',
      contentKey: 'odyssey.concepts.poincareSphere.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.poincareSphere.qualitative.title',
      contentKey: 'odyssey.concepts.poincareSphere.qualitative.content',
      diagramComponent: 'poincare-sphere-diagram',
      animationHints: ['sphere-rotation', 'state-point-trace'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.poincareSphere.quantitative.title',
      contentKey: 'odyssey.concepts.poincareSphere.quantitative.content',
      formulas: [
        {
          latex: '\\vec{P} = \\begin{pmatrix} S_1 \\\\ S_2 \\\\ S_3 \\end{pmatrix} = S_0 \\begin{pmatrix} \\cos 2\\chi \\cos 2\\psi \\\\ \\cos 2\\chi \\sin 2\\psi \\\\ \\sin 2\\chi \\end{pmatrix}',
          labelKey: 'odyssey.concepts.poincareSphere.formulas.stokesMapping',
        },
        {
          latex: 'S_1^2 + S_2^2 + S_3^2 = S_0^2 \\quad (\\text{fully polarized})',
          labelKey: 'odyssey.concepts.poincareSphere.formulas.sphereConstraint',
        },
        {
          latex: '\\text{Waveplate}(\\delta, \\theta) \\to \\text{Rotation}(\\delta, 2\\theta) \\text{ on sphere}',
          labelKey: 'odyssey.concepts.poincareSphere.formulas.waveplateRotation',
        },
      ],
    },

    triggerElementTypes: ['waveplate'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'stokes-measurement',
        type: 'analogous',
        labelKey: 'odyssey.concepts.poincareSphere.connections.stokes',
      },
      {
        targetConceptId: 'retardation-series',
        type: 'causal',
        labelKey: 'odyssey.concepts.poincareSphere.connections.retardation',
      },
    ],
  },
]

// ── 注册到全局注册表 ──────────────────────────────────────────────────

registerRegionConcepts('wave-platform', wavePlatformConcepts)
