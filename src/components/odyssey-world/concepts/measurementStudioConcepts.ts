/**
 * measurementStudioConcepts.ts -- Measurement Studio 区域概念定义
 *
 * 将 Measurement Studio 的发现映射到三层深度内容。
 * 3 个核心概念 (覆盖 Unit 5: 偏振测量):
 *
 * 1. Stokes 参数测量 (Stokes Measurement) -- 旋转分析器 + QWP 的四步测量
 * 2. 偏振度 (Degree of Polarization) -- 从完全偏振 (1) 到非偏振 (0)
 * 3. 完整偏振测量 (Full Polarimetry) -- Mueller 矩阵描述完整偏振变换
 *
 * 每个概念通过 i18n 键引用双语内容 (en/zh)。
 */

import type { ConceptDefinition } from './conceptRegistry'
import { registerRegionConcepts } from './conceptRegistry'

// ── Measurement Studio 概念定义 ──────────────────────────────────────

export const measurementStudioConcepts: ConceptDefinition[] = [
  {
    // Stokes 测量: 旋转分析器 + 四分之一波片，4 次测量确定完整偏振态
    id: 'stokes-measurement',
    discoveryId: 'measurement-studio-stokes-measurement',
    regionId: 'measurement-studio',
    nameKey: 'odyssey.concepts.stokesMeasurement.name',

    intuition: {
      titleKey: 'odyssey.concepts.stokesMeasurement.intuition.title',
      contentKey: 'odyssey.concepts.stokesMeasurement.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.stokesMeasurement.qualitative.title',
      contentKey: 'odyssey.concepts.stokesMeasurement.qualitative.content',
      diagramComponent: 'stokes-measurement-diagram',
      animationHints: ['analyzer-rotation', 'intensity-readout'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.stokesMeasurement.quantitative.title',
      contentKey: 'odyssey.concepts.stokesMeasurement.quantitative.content',
      formulas: [
        {
          latex: 'S_0 = I(0°) + I(90°)',
          labelKey: 'odyssey.concepts.stokesMeasurement.formulas.s0',
        },
        {
          latex: 'S_1 = I(0°) - I(90°)',
          labelKey: 'odyssey.concepts.stokesMeasurement.formulas.s1',
        },
        {
          latex: 'S_2 = I(45°) - I(135°)',
          labelKey: 'odyssey.concepts.stokesMeasurement.formulas.s2',
        },
        {
          latex: 'S_3 = I_{\\text{RHC}} - I_{\\text{LHC}}',
          labelKey: 'odyssey.concepts.stokesMeasurement.formulas.s3',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.stokesMeasurement.quantitative.derivation',
    },

    demoComponentId: 'stokes-explorer',
    triggerElementTypes: ['polarizer', 'waveplate'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'degree-of-polarization',
        type: 'causal',
        labelKey: 'odyssey.concepts.stokesMeasurement.connections.dop',
      },
      {
        targetConceptId: 'poincare-sphere',
        type: 'analogous',
        labelKey: 'odyssey.concepts.stokesMeasurement.connections.poincare',
      },
    ],
  },

  {
    // 偏振度: 量化光的偏振程度，从完全偏振 (DOP=1) 到非偏振 (DOP=0)
    id: 'degree-of-polarization',
    discoveryId: 'measurement-studio-dop-measurement',
    regionId: 'measurement-studio',
    nameKey: 'odyssey.concepts.degreeOfPolarization.name',

    intuition: {
      titleKey: 'odyssey.concepts.degreeOfPolarization.intuition.title',
      contentKey: 'odyssey.concepts.degreeOfPolarization.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.degreeOfPolarization.qualitative.title',
      contentKey: 'odyssey.concepts.degreeOfPolarization.qualitative.content',
      diagramComponent: 'dop-diagram',
      animationHints: ['dop-scale', 'partial-polarization'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.degreeOfPolarization.quantitative.title',
      contentKey: 'odyssey.concepts.degreeOfPolarization.quantitative.content',
      formulas: [
        {
          latex: 'DOP = \\frac{\\sqrt{S_1^2 + S_2^2 + S_3^2}}{S_0}',
          labelKey: 'odyssey.concepts.degreeOfPolarization.formulas.dopFormula',
        },
        {
          latex: '0 \\leq DOP \\leq 1',
          labelKey: 'odyssey.concepts.degreeOfPolarization.formulas.dopRange',
        },
        {
          latex: 'DOP = 1: \\text{fully polarized}, \\quad DOP = 0: \\text{unpolarized}',
          labelKey: 'odyssey.concepts.degreeOfPolarization.formulas.dopInterpretation',
        },
      ],
    },

    triggerElementTypes: ['polarizer'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'stokes-measurement',
        type: 'causal',
        labelKey: 'odyssey.concepts.degreeOfPolarization.connections.stokes',
      },
      {
        targetConceptId: 'full-polarimetry',
        type: 'causal',
        labelKey: 'odyssey.concepts.degreeOfPolarization.connections.polarimetry',
      },
    ],
  },

  {
    // 完整偏振测量: Mueller 矩阵形式化描述偏振变换，连接 Stokes 和 Malus
    id: 'full-polarimetry',
    discoveryId: 'measurement-studio-full-polarimetry',
    regionId: 'measurement-studio',
    nameKey: 'odyssey.concepts.fullPolarimetry.name',

    intuition: {
      titleKey: 'odyssey.concepts.fullPolarimetry.intuition.title',
      contentKey: 'odyssey.concepts.fullPolarimetry.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.fullPolarimetry.qualitative.title',
      contentKey: 'odyssey.concepts.fullPolarimetry.qualitative.content',
      diagramComponent: 'full-polarimetry-diagram',
      animationHints: ['mueller-matrix-fill', 'sin-sout-arrows'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.fullPolarimetry.quantitative.title',
      contentKey: 'odyssey.concepts.fullPolarimetry.quantitative.content',
      formulas: [
        {
          latex: '\\vec{S}_{\\text{out}} = M \\cdot \\vec{S}_{\\text{in}}',
          labelKey: 'odyssey.concepts.fullPolarimetry.formulas.muellerTransform',
        },
        {
          latex: 'M_{\\text{pol}}(\\theta) = \\frac{1}{2}\\begin{pmatrix} 1 & \\cos 2\\theta & \\sin 2\\theta & 0 \\\\ \\cos 2\\theta & \\cos^2 2\\theta & \\sin 2\\theta \\cos 2\\theta & 0 \\\\ \\sin 2\\theta & \\sin 2\\theta \\cos 2\\theta & \\sin^2 2\\theta & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}',
          labelKey: 'odyssey.concepts.fullPolarimetry.formulas.analyzerMueller',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.fullPolarimetry.quantitative.derivation',
    },

    triggerElementTypes: ['polarizer', 'waveplate'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'malus-law',
        type: 'analogous',
        labelKey: 'odyssey.concepts.fullPolarimetry.connections.malus',
      },
      {
        targetConceptId: 'stokes-measurement',
        type: 'causal',
        labelKey: 'odyssey.concepts.fullPolarimetry.connections.stokes',
      },
    ],
  },
]

// ── 注册到全局注册表 ──────────────────────────────────────────────────

registerRegionConcepts('measurement-studio', measurementStudioConcepts)
