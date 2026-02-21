/**
 * crystalLabConcepts.ts -- Crystal Lab 区域概念定义
 *
 * 将 Crystal Lab 的 7 个发现映射到三层深度内容。
 * 选取其中 4 个核心概念 (覆盖最重要的物理原理) 提供完整三层内容:
 *
 * 1. 马吕斯定律 (Malus's Law) -- 强度与偏振片角度的 cos^2 关系
 * 2. 交叉偏振消光 (Crossed Polarizers) -- 正交偏振片完全消光
 * 3. 圆偏振 (Circular Polarization) -- 四分之一波片产生圆偏振态
 * 4. 三偏振片惊喜 (Three-Polarizer Surprise) -- 中间偏振片恢复消光光束
 *
 * 每个概念通过 i18n 键引用双语内容 (en/zh)。
 */

import type { ConceptDefinition } from './conceptRegistry'
import { registerRegionConcepts } from './conceptRegistry'

// ── Crystal Lab 概念定义 ──────────────────────────────────────────────

export const crystalLabConcepts: ConceptDefinition[] = [
  {
    // 马吕斯定律: 偏振光通过偏振片时强度与角度的余弦平方关系
    id: 'malus-law',
    discoveryId: 'crystal-lab-malus-law-basic',
    regionId: 'crystal-lab',
    nameKey: 'odyssey.concepts.malusLaw.name',

    intuition: {
      titleKey: 'odyssey.concepts.malusLaw.intuition.title',
      contentKey: 'odyssey.concepts.malusLaw.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.malusLaw.qualitative.title',
      contentKey: 'odyssey.concepts.malusLaw.qualitative.content',
      diagramComponent: 'malus-law-diagram',
      animationHints: ['polarizer-rotation', 'intensity-gradient'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.malusLaw.quantitative.title',
      contentKey: 'odyssey.concepts.malusLaw.quantitative.content',
      formulas: [
        {
          latex: 'I = I_0 \\cos^2\\theta',
          labelKey: 'odyssey.concepts.malusLaw.formulas.main',
        },
        {
          latex: '\\theta = \\text{angle between polarizer axes}',
          labelKey: 'odyssey.concepts.malusLaw.formulas.angleDefinition',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.malusLaw.quantitative.derivation',
    },

    courseLink: {
      path: '/demos/malus',
      labelKey: 'odyssey.courseLink.malusLaw',
    },

    demoComponentId: 'malus-law-explorer',
    triggerElementTypes: ['polarizer'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'brewster-angle',
        type: 'causal',
        labelKey: 'odyssey.concepts.malusLaw.connections.brewster',
      },
      {
        targetConceptId: 'three-polarizer-surprise',
        type: 'causal',
        labelKey: 'odyssey.concepts.malusLaw.connections.threePolarizer',
      },
    ],
  },

  {
    // 交叉偏振消光: 两个正交偏振片之间无光通过
    id: 'crossed-polarizers',
    discoveryId: 'crystal-lab-crossed-polarizers',
    regionId: 'crystal-lab',
    nameKey: 'odyssey.concepts.crossedPolarizers.name',

    intuition: {
      titleKey: 'odyssey.concepts.crossedPolarizers.intuition.title',
      contentKey: 'odyssey.concepts.crossedPolarizers.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.crossedPolarizers.qualitative.title',
      contentKey: 'odyssey.concepts.crossedPolarizers.qualitative.content',
      diagramComponent: 'crossed-polarizers-diagram',
      animationHints: ['extinction-fade'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.crossedPolarizers.quantitative.title',
      contentKey: 'odyssey.concepts.crossedPolarizers.quantitative.content',
      formulas: [
        {
          latex: 'I = I_0 \\cos^2(90°) = 0',
          labelKey: 'odyssey.concepts.crossedPolarizers.formulas.extinction',
        },
      ],
    },

    courseLink: {
      path: '/demos/malus',
      labelKey: 'odyssey.courseLink.crossedPolarizers',
    },

    triggerElementTypes: ['polarizer'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'malus-law',
        type: 'causal',
        labelKey: 'odyssey.concepts.crossedPolarizers.connections.malus',
      },
      {
        targetConceptId: 'three-polarizer-surprise',
        type: 'contrasting',
        labelKey: 'odyssey.concepts.crossedPolarizers.connections.threePolarizer',
      },
    ],
  },

  {
    // 圆偏振: 四分之一波片将线偏振转为圆偏振
    id: 'circular-polarization',
    discoveryId: 'crystal-lab-circular-polarization',
    regionId: 'crystal-lab',
    nameKey: 'odyssey.concepts.circularPolarization.name',

    intuition: {
      titleKey: 'odyssey.concepts.circularPolarization.intuition.title',
      contentKey: 'odyssey.concepts.circularPolarization.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.circularPolarization.qualitative.title',
      contentKey: 'odyssey.concepts.circularPolarization.qualitative.content',
      diagramComponent: 'circular-polarization-diagram',
      animationHints: ['helix-trace', 'qwp-phase-shift'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.circularPolarization.quantitative.title',
      contentKey: 'odyssey.concepts.circularPolarization.quantitative.content',
      formulas: [
        {
          latex: '\\vec{E} = E_0(\\hat{x} \\pm i\\hat{y})e^{i(kz - \\omega t)}',
          labelKey: 'odyssey.concepts.circularPolarization.formulas.jonesVector',
        },
        {
          latex: 'S = \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ \\pm 1 \\end{pmatrix}',
          labelKey: 'odyssey.concepts.circularPolarization.formulas.stokesVector',
        },
        {
          latex: '\\Delta\\phi = \\frac{\\pi}{2} \\quad \\text{(quarter-wave)}',
          labelKey: 'odyssey.concepts.circularPolarization.formulas.phaseRetardation',
        },
      ],
    },

    courseLink: {
      path: '/demos/waveplate',
      labelKey: 'odyssey.courseLink.circularPolarization',
    },

    demoComponentId: 'circular-pol-explorer',
    triggerElementTypes: ['waveplate'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'snell-polarization',
        type: 'analogous',
        labelKey: 'odyssey.concepts.circularPolarization.connections.snell',
      },
    ],
  },

  {
    // 三偏振片惊喜: 在两个交叉偏振片之间插入 45 度偏振片，光重新出现
    id: 'three-polarizer-surprise',
    discoveryId: 'crystal-lab-three-polarizer-surprise',
    regionId: 'crystal-lab',
    nameKey: 'odyssey.concepts.threePolarizer.name',

    intuition: {
      titleKey: 'odyssey.concepts.threePolarizer.intuition.title',
      contentKey: 'odyssey.concepts.threePolarizer.intuition.content',
    },

    qualitative: {
      titleKey: 'odyssey.concepts.threePolarizer.qualitative.title',
      contentKey: 'odyssey.concepts.threePolarizer.qualitative.content',
      diagramComponent: 'three-polarizer-diagram',
      animationHints: ['beam-revival', 'middle-polarizer-insert'],
    },

    quantitative: {
      titleKey: 'odyssey.concepts.threePolarizer.quantitative.title',
      contentKey: 'odyssey.concepts.threePolarizer.quantitative.content',
      formulas: [
        {
          latex: 'I_{\\text{out}} = I_0 \\cos^2\\alpha \\cdot \\cos^2(90° - \\alpha)',
          labelKey: 'odyssey.concepts.threePolarizer.formulas.cascadedMalus',
        },
        {
          latex: 'I_{\\text{max}} = \\frac{I_0}{8} \\quad \\text{at } \\alpha = 45°',
          labelKey: 'odyssey.concepts.threePolarizer.formulas.maxIntensity',
        },
      ],
      derivationStepsKey: 'odyssey.concepts.threePolarizer.quantitative.derivation',
    },

    courseLink: {
      path: '/demos/malus',
      labelKey: 'odyssey.courseLink.threePolarizer',
    },

    triggerElementTypes: ['polarizer'],
    triggerCondition: 'discovered',

    connections: [
      {
        targetConceptId: 'malus-law',
        type: 'causal',
        labelKey: 'odyssey.concepts.threePolarizer.connections.malus',
      },
      {
        targetConceptId: 'crossed-polarizers',
        type: 'contrasting',
        labelKey: 'odyssey.concepts.threePolarizer.connections.crossed',
      },
    ],
  },
]

// ── 注册到全局注册表 ──────────────────────────────────────────────────

registerRegionConcepts('crystal-lab', crystalLabConcepts)
