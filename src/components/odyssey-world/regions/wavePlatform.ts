/**
 * wavePlatform.ts -- Wave Platform 区域定义
 *
 * 青蓝色调开放平台，专注波干涉、相位延迟和 Jones 向量概念。
 * 15x13 宽阔网格，多个波片组合实验。
 */

import type { SceneElement } from '@/stores/odysseyWorldStore'
import type { RegionDefinition } from './regionRegistry'
import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

// ── 平台生成 ────────────────────────────────────────────────────────

function createPlatforms(): SceneElement[] {
  const elements: SceneElement[] = []

  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 13; y++) {
      elements.push({
        id: `wave-platform-platform-${x}-${y}`,
        type: 'platform',
        worldX: x,
        worldY: y,
        worldZ: 0,
        rotation: 0,
        properties: { walkable: true, material: 'metal-grid' },
      })
    }
  }

  // 波浪形抬升区域
  const raisedPositions = [
    { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
    { x: 6, y: 6 }, { x: 7, y: 6 },
    { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 },
  ]
  for (const pos of raisedPositions) {
    elements.push({
      id: `wave-platform-raised-${pos.x}-${pos.y}`,
      type: 'platform',
      worldX: pos.x,
      worldY: pos.y,
      worldZ: 1,
      rotation: 0,
      properties: { walkable: true, material: 'crystal-glass', elevated: true },
    })
  }

  return elements
}

// ── 光学元件 ────────────────────────────────────────────────────────

function createOpticalElements(): SceneElement[] {
  return [
    // 光源 -- 高强度白光
    {
      id: 'wave-platform-light-source-1',
      type: 'light-source',
      worldX: 1,
      worldY: 6,
      worldZ: 0,
      rotation: 0,
      properties: {
        intensity: 1,
        wavelength: 550,
        polarization: 'horizontal',
      },
    },
    // 四分之一波片 -- 快轴 0 度
    {
      id: 'wave-platform-waveplate-1',
      type: 'waveplate',
      worldX: 5,
      worldY: 6,
      worldZ: 0,
      rotation: 0,
      properties: {
        retardation: 90,
        fastAxis: 0,
        type: 'quarter-wave',
      },
    },
    // 半波片 -- 快轴 22.5 度
    {
      id: 'wave-platform-waveplate-2',
      type: 'waveplate',
      worldX: 9,
      worldY: 6,
      worldZ: 0,
      rotation: 22.5,
      properties: {
        retardation: 180,
        fastAxis: 22.5,
        type: 'half-wave',
      },
    },
  ]
}

// ── 装饰元素 ────────────────────────────────────────────────────────

function createDecorations(): SceneElement[] {
  return [
    {
      id: 'wave-platform-decoration-oscilloscope',
      type: 'decoration',
      worldX: 13,
      worldY: 1,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'oscilloscope' },
    },
    {
      id: 'wave-platform-decoration-wave-diagram',
      type: 'decoration',
      worldX: 0,
      worldY: 0,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'wave-diagram' },
    },
    {
      id: 'wave-platform-decoration-phase-wheel',
      type: 'decoration',
      worldX: 7,
      worldY: 12,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'phase-wheel' },
    },
    {
      id: 'wave-platform-decoration-jones-matrix',
      type: 'decoration',
      worldX: 14,
      worldY: 10,
      worldZ: 0,
      rotation: -15,
      properties: { variant: 'jones-matrix-poster' },
    },
  ]
}

// ── 发现配置 ────────────────────────────────────────────────────────

export const wavePlatformDiscoveries: DiscoveryConfig[] = [
  {
    // 相位延迟系列: 不同延迟量产生线/椭圆/圆偏振
    id: 'wave-platform-retardation-series',
    name: 'Retardation Series',
    difficulty: 2,
    hint: 'odyssey.hints.retardationSeries',
    hintElements: ['wave-platform-waveplate-1', 'wave-platform-waveplate-2'],
    check: (elements, beamSegments) => {
      // 需要至少 2 个波片且输出包含多种偏振形状
      const waveplates = elements.filter((el) => el.type === 'waveplate')
      if (waveplates.length < 2) return false
      const shapes = new Set(beamSegments.map((seg) => seg.shape))
      return shapes.size >= 2
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-retardation',
      params: { color: 'hsl(175, 70%, 60%)', radius: 90, opacity: 0.3 },
    },
  },
  {
    // 波片补偿: QWP + HWP 组合可以产生任意偏振态
    id: 'wave-platform-compensation',
    name: 'Waveplate Compensation',
    difficulty: 2,
    hint: 'odyssey.hints.waveplateCompensation',
    hintElements: ['wave-platform-waveplate-1', 'wave-platform-waveplate-2'],
    check: (elements, beamSegments) => {
      const qwps = elements.filter(
        (el) => el.type === 'waveplate' && (el.properties.retardation as number) === 90,
      )
      const hwps = elements.filter(
        (el) => el.type === 'waveplate' && (el.properties.retardation as number) === 180,
      )
      if (qwps.length === 0 || hwps.length === 0) return false
      // QWP + HWP 组合后输出应有椭圆或线偏振
      return beamSegments.some(
        (seg) => seg.shape === 'ellipse-markers' || (seg.shape === 'line' && seg.stokes.s0 > 0.3),
      )
    },
    response: {
      type: 'particle-burst',
      target: 'discovery-area-compensation',
      params: { particleCount: 12, color: 'hsl(180, 60%, 55%)', shimmerCount: 5 },
    },
  },
  {
    // 偏振态正交性: 两个正交偏振态的和为非偏振光
    id: 'wave-platform-orthogonality',
    name: 'Polarization Orthogonality',
    difficulty: 2,
    hint: 'odyssey.hints.polarizationOrthogonality',
    hintElements: ['wave-platform-waveplate-1', 'wave-platform-waveplate-2', 'wave-platform-light-source-1'],
    check: (_elements, beamSegments) => {
      // 存在几乎非偏振的光束段 (s1, s2, s3 都接近 0)
      return beamSegments.some(
        (seg) =>
          seg.stokes.s0 > 0.3 &&
          Math.abs(seg.stokes.s1) < 0.1 &&
          Math.abs(seg.stokes.s2) < 0.1 &&
          Math.abs(seg.stokes.s3) < 0.1,
      )
    },
    response: {
      type: 'pattern',
      target: 'discovery-area-orthogonal',
      params: { patternType: 'ripple', opacity: 0.2, color: 'hsl(165, 50%, 65%)' },
    },
  },
  {
    // Jones 向量可视化: 通过波片旋转覆盖庞加莱球表面
    id: 'wave-platform-poincare-traverse',
    name: 'Poincare Sphere Traverse',
    difficulty: 3,
    hint: 'odyssey.hints.poincareTraverse',
    hintElements: ['wave-platform-waveplate-1', 'wave-platform-waveplate-2', 'wave-platform-light-source-1'],
    check: (_elements, beamSegments, rotationHistory) => {
      // 需要广泛的旋转历史且产生多种偏振形状
      if (rotationHistory.size === 0) return false
      let totalRotations = 0
      for (const history of rotationHistory.values()) {
        totalRotations += history.length
      }
      if (totalRotations < 5) return false
      const shapes = new Set(beamSegments.map((seg) => seg.shape))
      const hasCircular = beamSegments.some((seg) => Math.abs(seg.stokes.s3) > 0.3)
      return shapes.size >= 2 && hasCircular
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-poincare',
      params: { color: 'hsl(190, 80%, 55%)', radius: 100, opacity: 0.4 },
    },
  },
]

// ── 区域定义导出 ────────────────────────────────────────────────────

export const wavePlatformDefinition: RegionDefinition = {
  id: 'wave-platform',
  theme: {
    id: 'wave-platform',
    name: 'Wave Platform',
    nameKey: 'odyssey.regions.wavePlatform',
    colorPalette: {
      background: ['#081a28', '#0d2535'],  // 深青蓝渐变 (190deg hue)
      platformFill: '#1a2d40',
      platformStroke: '#3a5878',
      accentColor: '#4db8c9',
    },
    gridOpacity: 0.06,
  },
  gridWidth: 15,
  gridHeight: 13,
  worldOffsetX: 14,
  worldOffsetY: 0,
  initialElements: [...createPlatforms(), ...createOpticalElements(), ...createDecorations()],
  paletteItems: ['waveplate', 'polarizer', 'prism'],
  boundaries: [
    {
      direction: 'west',
      targetRegionId: 'crystal-lab',
      type: 'archway',
      entryPoint: { x: 12, y: 6 },
      exitPoint: { x: 0, y: 6 },
    },
    {
      direction: 'south',
      targetRegionId: 'measurement-studio',
      type: 'soft',
      entryPoint: { x: 7, y: 0 },
      exitPoint: { x: 7, y: 12 },
    },
  ],
  discoveries: wavePlatformDiscoveries,
  discoveryConnections: [
    {
      fromDiscoveryId: 'wave-platform-retardation-series',
      toDiscoveryId: 'crystal-lab-circular-polarization',
      toRegionId: 'crystal-lab',
      connectionTag: 'Quarter-wave retardation creates the circular states observed in crystal lab',
    },
    {
      fromDiscoveryId: 'wave-platform-poincare-traverse',
      toDiscoveryId: 'measurement-studio-stokes-measurement',
      toRegionId: 'measurement-studio',
      connectionTag: 'Poincare sphere trajectories map directly to Stokes parameter measurements',
    },
    {
      fromDiscoveryId: 'wave-platform-retardation-series',
      toDiscoveryId: 'interface-lab-medium-comparison',
      toRegionId: 'interface-lab',
      connectionTag: 'Retardation depends on birefringent medium properties',
    },
  ],
}
