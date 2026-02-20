/**
 * crystalLab.ts -- Crystal Lab 区域定义
 *
 * 冰蓝色调实验室，专注双折射、半波旋转和圆偏振。
 * 保留 Phase 1 所有现有元素（光源、偏振片、波片、装饰、环境介质），
 * 扩展平台从 7x7 到 13x13，新增预置光学元件。
 */

import type { SceneElement } from '@/stores/odysseyWorldStore'
import type { RegionDefinition } from './regionRegistry'

// ── 平台生成 ────────────────────────────────────────────────────────

/** 生成 Crystal Lab 13x13 平台网格 */
function createPlatforms(): SceneElement[] {
  const elements: SceneElement[] = []

  for (let x = 0; x < 13; x++) {
    for (let y = 0; y < 13; y++) {
      elements.push({
        id: `crystal-lab-platform-${x}-${y}`,
        type: 'platform',
        worldX: x,
        worldY: y,
        worldZ: 0,
        rotation: 0,
        properties: { walkable: true, material: 'stone' },
      })
    }
  }

  // 抬升平台 (Z=1) -- 保留 Phase 1 的多层结构并扩展
  const raisedPositions = [
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 2 },
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 9, y: 8 },
  ]
  for (const pos of raisedPositions) {
    elements.push({
      id: `crystal-lab-raised-${pos.x}-${pos.y}`,
      type: 'platform',
      worldX: pos.x,
      worldY: pos.y,
      worldZ: 1,
      rotation: 0,
      properties: { walkable: true, material: 'glass', elevated: true },
    })
  }

  return elements
}

// ── 光学元件 ────────────────────────────────────────────────────────

/** Crystal Lab 预置光学元件 -- 保留 Phase 1 全部元素 + 新增元件 */
function createOpticalElements(): SceneElement[] {
  return [
    // ── Phase 1 保留元素 (位置不变) ──

    // 光源 -- 发射水平线偏振光 (Stokes: [1, 1, 0, 0])
    {
      id: 'crystal-lab-light-source-1',
      type: 'light-source',
      worldX: 1,
      worldY: 3,
      worldZ: 0,
      rotation: 0,
      properties: {
        intensity: 1,
        wavelength: 550,
        polarization: 'horizontal',
      },
    },

    // 偏振片 -- 传输轴 45 度
    {
      id: 'crystal-lab-polarizer-1',
      type: 'polarizer',
      worldX: 3,
      worldY: 3,
      worldZ: 0,
      rotation: 45,
      properties: {
        transmissionAxis: 45,
        type: 'linear',
      },
    },

    // 四分之一波片 -- 快轴 0 度 (产生圆偏振)
    {
      id: 'crystal-lab-waveplate-1',
      type: 'waveplate',
      worldX: 5,
      worldY: 3,
      worldZ: 0,
      rotation: 0,
      properties: {
        retardation: 90,
        fastAxis: 0,
        type: 'quarter-wave',
      },
    },

    // 环境区域 -- 玻璃介质
    {
      id: 'crystal-lab-environment-medium-1',
      type: 'environment',
      worldX: 4,
      worldY: 4,
      worldZ: 0,
      rotation: 0,
      properties: {
        mediumType: 'glass',
        refractiveIndex: 1.52,
        variant: 'medium-region',
      },
    },

    // ── 新增光学元件 ──

    // 第二偏振片 -- 用于交叉偏振实验
    {
      id: 'crystal-lab-polarizer-2',
      type: 'polarizer',
      worldX: 7,
      worldY: 3,
      worldZ: 0,
      rotation: 90,
      properties: {
        transmissionAxis: 90,
        type: 'linear',
      },
    },

    // 半波片 -- 偏振方向旋转
    {
      id: 'crystal-lab-waveplate-2',
      type: 'waveplate',
      worldX: 9,
      worldY: 7,
      worldZ: 0,
      rotation: 22.5,
      properties: {
        retardation: 180,
        fastAxis: 22.5,
        type: 'half-wave',
      },
    },

    // 第二光源 -- 另一组光束线路
    {
      id: 'crystal-lab-light-source-2',
      type: 'light-source',
      worldX: 1,
      worldY: 9,
      worldZ: 0,
      rotation: 0,
      properties: {
        intensity: 1,
        wavelength: 632,
        polarization: 'horizontal',
      },
    },

    // 棱镜 -- 色散效果
    {
      id: 'crystal-lab-prism-1',
      type: 'prism',
      worldX: 5,
      worldY: 9,
      worldZ: 0,
      rotation: 30,
      properties: {
        prismAngle: 60,
        material: 'glass',
        refractiveIndex: 1.52,
      },
    },

    // 第三偏振片 -- 三偏振片惊喜实验
    {
      id: 'crystal-lab-polarizer-3',
      type: 'polarizer',
      worldX: 10,
      worldY: 9,
      worldZ: 0,
      rotation: 45,
      properties: {
        transmissionAxis: 45,
        type: 'linear',
      },
    },
  ]
}

// ── 装饰元素 ────────────────────────────────────────────────────────

/** Crystal Lab 装饰 -- 保留 Phase 1 装饰 + 新增 */
function createDecorations(): SceneElement[] {
  return [
    // Phase 1 保留装饰
    {
      id: 'crystal-lab-decoration-lens-stand',
      type: 'decoration',
      worldX: 0,
      worldY: 0,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'lens-stand' },
    },
    {
      id: 'crystal-lab-decoration-crystal-cluster',
      type: 'decoration',
      worldX: 6,
      worldY: 6,
      worldZ: 0,
      rotation: 30,
      properties: { variant: 'crystal-cluster' },
    },
    {
      id: 'crystal-lab-decoration-prism-display',
      type: 'decoration',
      worldX: 4,
      worldY: 0,
      worldZ: 0,
      rotation: 15,
      properties: { variant: 'prism-display' },
    },
    {
      id: 'crystal-lab-decoration-notebook',
      type: 'decoration',
      worldX: 6,
      worldY: 1,
      worldZ: 0,
      rotation: -10,
      properties: { variant: 'notebook' },
    },

    // 新增装饰 -- 扩展区域氛围
    {
      id: 'crystal-lab-decoration-ice-crystal',
      type: 'decoration',
      worldX: 11,
      worldY: 2,
      worldZ: 0,
      rotation: 45,
      properties: { variant: 'ice-crystal' },
    },
    {
      id: 'crystal-lab-decoration-calcite-sample',
      type: 'decoration',
      worldX: 12,
      worldY: 12,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'calcite-sample' },
    },
    {
      id: 'crystal-lab-decoration-lab-bench',
      type: 'decoration',
      worldX: 0,
      worldY: 10,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'lab-bench' },
    },
  ]
}

// ── 发现配置 ────────────────────────────────────────────────────────

import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

/** Crystal Lab 发现配置 -- 保留 Phase 2 的 5 个 + 新增 2 个 */
export const crystalLabDiscoveries: DiscoveryConfig[] = [
  // ── Phase 2 保留的 5 个发现 ──

  {
    // 马吕斯定律: 旋转偏振片，观察强度变化
    id: 'crystal-lab-malus-law-basic',
    name: "Malus's Law",
    check: (elements, beamSegments, rotationHistory) => {
      const polarizers = elements.filter((el) => el.type === 'polarizer')
      if (polarizers.length < 2) return false
      let hasWideRotation = false
      for (const p of polarizers) {
        const history = rotationHistory.get(p.id)
        if (history && history.length >= 2) {
          const min = Math.min(...history)
          const max = Math.max(...history)
          if (max - min >= 90) { hasWideRotation = true; break }
        }
      }
      if (!hasWideRotation) return false
      const intensities = beamSegments.map((seg) => seg.stokes.s0)
      const distinctIntensities = new Set<number>()
      for (const intensity of intensities) {
        let isDistinct = true
        for (const existing of distinctIntensities) {
          if (Math.abs(intensity - existing) <= 0.1) { isDistinct = false; break }
        }
        if (isDistinct) distinctIntensities.add(intensity)
      }
      return distinctIntensities.size >= 3
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-malus',
      params: { color: 'hsl(45, 80%, 60%)', radius: 60, opacity: 0.35 },
    },
  },
  {
    // 完全消光: 两正交偏振片消光
    id: 'crystal-lab-crossed-polarizers',
    name: 'Complete Extinction',
    check: (elements, beamSegments) => {
      const polarizers = elements.filter((el) => el.type === 'polarizer')
      if (polarizers.length < 2) return false
      for (let i = 0; i < polarizers.length; i++) {
        for (let j = i + 1; j < polarizers.length; j++) {
          const axis1 = (polarizers[i].properties.transmissionAxis as number) ?? polarizers[i].rotation
          const axis2 = (polarizers[j].properties.transmissionAxis as number) ?? polarizers[j].rotation
          let diff = Math.abs(axis1 - axis2) % 180
          if (diff > 90) diff = 180 - diff
          if (diff >= 85 && diff <= 95) {
            const hasExtinction = beamSegments.some((seg) => seg.stokes.s0 < 0.05)
            if (hasExtinction) return true
          }
        }
      }
      return false
    },
    response: {
      type: 'pattern',
      target: 'discovery-area-extinction',
      params: { patternType: 'phosphorescent', opacity: 0.2, color: 'hsl(180, 60%, 70%)' },
    },
  },
  {
    // 圆偏振: QWP 在 45 度产生圆偏振
    id: 'crystal-lab-circular-polarization',
    name: 'Circular Polarization',
    check: (_elements, beamSegments) => {
      return beamSegments.some(
        (seg) => Math.abs(seg.stokes.s3) > 0.4 && seg.shape === 'helix',
      )
    },
    response: {
      type: 'particle-burst',
      target: 'discovery-area-circular',
      params: { particleCount: 10, color: 'hsl(200, 70%, 65%)', shimmerCount: 4 },
    },
  },
  {
    // 半波旋转: HWP 旋转偏振方向而保持强度
    id: 'crystal-lab-half-wave-rotation',
    name: 'Half-Wave Rotation',
    check: (elements, beamSegments) => {
      const hwps = elements.filter(
        (el) => el.type === 'waveplate' && (el.properties.retardation as number) === 180,
      )
      if (hwps.length === 0) return false
      if (beamSegments.length < 2) return false
      for (let i = 0; i < beamSegments.length - 1; i++) {
        const inputSeg = beamSegments[i]
        const outputSeg = beamSegments[i + 1]
        const intensityDiff = Math.abs(outputSeg.stokes.s0 - inputSeg.stokes.s0)
        const colorChanged = inputSeg.color !== outputSeg.color
        if (colorChanged && intensityDiff < 0.1) return true
      }
      return false
    },
    response: {
      type: 'color-shift',
      target: 'discovery-area-hwp',
      params: { color: 'hsl(270, 50%, 60%)', duration: 1, opacity: 0.25 },
    },
  },
  {
    // 三偏振片惊喜: 3 个偏振片恢复消光光束
    id: 'crystal-lab-three-polarizer-surprise',
    name: 'Three-Polarizer Surprise',
    check: (elements, beamSegments) => {
      const polarizers = elements.filter((el) => el.type === 'polarizer')
      if (polarizers.length !== 3) return false
      const lightSource = elements.find((el) => el.type === 'light-source')
      if (!lightSource) return false
      const sorted = [...polarizers].sort((a, b) => {
        const distA = Math.hypot(a.worldX - lightSource.worldX, a.worldY - lightSource.worldY)
        const distB = Math.hypot(b.worldX - lightSource.worldX, b.worldY - lightSource.worldY)
        return distA - distB
      })
      const firstAxis = (sorted[0].properties.transmissionAxis as number) ?? sorted[0].rotation
      const lastAxis = (sorted[2].properties.transmissionAxis as number) ?? sorted[2].rotation
      let diff = Math.abs(firstAxis - lastAxis) % 180
      if (diff > 90) diff = 180 - diff
      if (diff < 85 || diff > 95) return false
      const midAxis = (sorted[1].properties.transmissionAxis as number) ?? sorted[1].rotation
      let diffFirst = Math.abs(midAxis - firstAxis) % 180
      if (diffFirst > 90) diffFirst = 180 - diffFirst
      let diffLast = Math.abs(midAxis - lastAxis) % 180
      if (diffLast > 90) diffLast = 180 - diffLast
      if (diffFirst < 5 || diffFirst > 85 || diffLast < 5 || diffLast > 85) return false
      const lastSegment = beamSegments[beamSegments.length - 1]
      if (!lastSegment) return false
      return lastSegment.stokes.s0 > 0.05
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-surprise',
      params: { color: 'hsl(50, 90%, 70%)', radius: 100, opacity: 0.4 },
    },
  },

  // ── 新增发现 ──

  {
    // 双折射分束: 棱镜将单光束分为两个正交偏振分量
    id: 'crystal-lab-birefringent-splitting',
    name: 'Birefringent Splitting',
    check: (elements, beamSegments) => {
      // 场景中有棱镜且输出光束有至少 2 段不同偏振方向
      const hasPrism = elements.some((el) => el.type === 'prism')
      if (!hasPrism) return false
      if (beamSegments.length < 2) return false
      const colors = new Set(beamSegments.map((seg) => seg.color))
      return colors.size >= 3
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-birefringent',
      params: { color: 'hsl(190, 80%, 65%)', radius: 50, opacity: 0.3 },
    },
  },
  {
    // 波片级联: 两个波片串联产生复合相位延迟
    id: 'crystal-lab-cascaded-waveplates',
    name: 'Cascaded Waveplates',
    check: (elements, beamSegments) => {
      // 需要至少 2 个波片且输出有椭圆偏振
      const waveplates = elements.filter((el) => el.type === 'waveplate')
      if (waveplates.length < 2) return false
      return beamSegments.some((seg) => seg.shape === 'ellipse-markers')
    },
    response: {
      type: 'particle-burst',
      target: 'discovery-area-cascaded',
      params: { particleCount: 8, color: 'hsl(220, 70%, 60%)', shimmerCount: 3 },
    },
  },
]

// ── 区域定义导出 ────────────────────────────────────────────────────

export const crystalLabDefinition: Omit<RegionDefinition, 'theme'> & { theme: RegionDefinition['theme'] } = {
  id: 'crystal-lab',
  theme: {
    id: 'crystal-lab',
    name: 'Crystal Lab',
    nameKey: 'odyssey.regions.crystalLab',
    colorPalette: {
      background: ['#e8f4fd', '#b8dff5'],  // 冰蓝渐变
      platformFill: '#d4eaf7',
      platformStroke: '#8ec5e3',
      accentColor: '#4ba3d4',
    },
    gridOpacity: 0.025,
  },
  gridWidth: 13,
  gridHeight: 13,
  worldOffsetX: 0,
  worldOffsetY: 0,
  initialElements: [...createPlatforms(), ...createOpticalElements(), ...createDecorations()],
  paletteItems: ['polarizer', 'waveplate', 'prism'],
  boundaries: [
    {
      direction: 'south',
      targetRegionId: 'refraction-bench',
      type: 'soft',
      entryPoint: { x: 6, y: 0 },
      exitPoint: { x: 6, y: 12 },
    },
    {
      direction: 'east',
      targetRegionId: 'wave-platform',
      type: 'archway',
      entryPoint: { x: 0, y: 6 },
      exitPoint: { x: 12, y: 6 },
    },
  ],
  discoveries: crystalLabDiscoveries,
  discoveryConnections: [
    {
      fromDiscoveryId: 'crystal-lab-circular-polarization',
      toDiscoveryId: 'wave-platform-retardation-series',
      toRegionId: 'wave-platform',
      connectionTag: 'Both involve 90-degree phase shifts creating circular states',
    },
    {
      fromDiscoveryId: 'crystal-lab-malus-law-basic',
      toDiscoveryId: 'refraction-bench-brewster-angle',
      toRegionId: 'refraction-bench',
      connectionTag: 'Both involve cos^2 intensity relationships',
    },
    {
      fromDiscoveryId: 'crystal-lab-half-wave-rotation',
      toDiscoveryId: 'wave-platform-poincare-traverse',
      toRegionId: 'wave-platform',
      connectionTag: 'Half-wave rotation traces paths on the Poincare sphere',
    },
    {
      fromDiscoveryId: 'crystal-lab-crossed-polarizers',
      toDiscoveryId: 'measurement-studio-stokes-measurement',
      toRegionId: 'measurement-studio',
      connectionTag: 'Extinction reveals polarization state through Stokes analysis',
    },
  ],
}
