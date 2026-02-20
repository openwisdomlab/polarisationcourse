/**
 * interfaceLab.ts -- Interface Lab 区域定义
 *
 * 绿金色调实验室，专注菲涅耳反射和界面偏振效应。
 * 13x13 网格，包含玻璃和水两种介质环境。
 */

import type { SceneElement } from '@/stores/odysseyWorldStore'
import type { RegionDefinition } from './regionRegistry'
import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

// ── 平台生成 ────────────────────────────────────────────────────────

function createPlatforms(): SceneElement[] {
  const elements: SceneElement[] = []

  for (let x = 0; x < 13; x++) {
    for (let y = 0; y < 13; y++) {
      elements.push({
        id: `interface-lab-platform-${x}-${y}`,
        type: 'platform',
        worldX: x,
        worldY: y,
        worldZ: 0,
        rotation: 0,
        properties: { walkable: true, material: 'polished-stone' },
      })
    }
  }

  // 界面模拟台 -- 中央抬升区域
  const raisedPositions = [
    { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
    { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 },
    { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
  ]
  for (const pos of raisedPositions) {
    elements.push({
      id: `interface-lab-raised-${pos.x}-${pos.y}`,
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

function createOpticalElements(): SceneElement[] {
  return [
    // 光源 -- 标准白光
    {
      id: 'interface-lab-light-source-1',
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
    // 玻璃介质 -- n=1.52，菲涅耳反射实验
    {
      id: 'interface-lab-environment-glass',
      type: 'environment',
      worldX: 6,
      worldY: 4,
      worldZ: 0,
      rotation: 0,
      properties: {
        mediumType: 'glass',
        refractiveIndex: 1.52,
        variant: 'medium-region',
      },
    },
    // 水介质 -- n=1.33，不同界面对比
    {
      id: 'interface-lab-environment-water',
      type: 'environment',
      worldX: 6,
      worldY: 9,
      worldZ: 0,
      rotation: 0,
      properties: {
        mediumType: 'water',
        refractiveIndex: 1.33,
        variant: 'medium-region',
      },
    },
  ]
}

// ── 装饰元素 ────────────────────────────────────────────────────────

function createDecorations(): SceneElement[] {
  return [
    {
      id: 'interface-lab-decoration-fresnel-diagram',
      type: 'decoration',
      worldX: 12,
      worldY: 0,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'fresnel-diagram' },
    },
    {
      id: 'interface-lab-decoration-water-tank',
      type: 'decoration',
      worldX: 0,
      worldY: 12,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'water-tank' },
    },
    {
      id: 'interface-lab-decoration-glass-stack',
      type: 'decoration',
      worldX: 10,
      worldY: 10,
      worldZ: 0,
      rotation: 10,
      properties: { variant: 'glass-stack' },
    },
    {
      id: 'interface-lab-decoration-angle-ruler',
      type: 'decoration',
      worldX: 0,
      worldY: 3,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'angle-ruler' },
    },
  ]
}

// ── 发现配置 ────────────────────────────────────────────────────────

export const interfaceLabDiscoveries: DiscoveryConfig[] = [
  {
    // 菲涅耳反射: 界面反射率随偏振方向不同
    id: 'interface-lab-fresnel-reflection',
    name: 'Fresnel Reflection',
    check: (elements, beamSegments) => {
      const hasEnvironment = elements.some((el) => el.type === 'environment')
      if (!hasEnvironment) return false
      // s 偏振和 p 偏振的反射率不同，表现为不同的输出强度
      return beamSegments.length >= 2 && beamSegments.some((seg) => seg.stokes.s0 < 0.8)
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-fresnel',
      params: { color: 'hsl(80, 70%, 55%)', radius: 70, opacity: 0.3 },
    },
  },
  {
    // 界面偏振效应: 不同介质的偏振反射差异
    id: 'interface-lab-medium-comparison',
    name: 'Medium Comparison',
    check: (elements, beamSegments) => {
      // 场景中至少有 2 种不同介质
      const environments = elements.filter((el) => el.type === 'environment')
      if (environments.length < 2) return false
      const mediumTypes = new Set(environments.map((el) => el.properties.mediumType as string))
      if (mediumTypes.size < 2) return false
      // 观察到不同强度的光束段
      const intensities = beamSegments.map((seg) => seg.stokes.s0)
      if (intensities.length < 2) return false
      const range = Math.max(...intensities) - Math.min(...intensities)
      return range > 0.15
    },
    response: {
      type: 'color-shift',
      target: 'discovery-area-medium-compare',
      params: { color: 'hsl(100, 60%, 50%)', duration: 1.2, opacity: 0.25 },
    },
  },
  {
    // 堆叠界面: 多层介质的累积偏振效应
    id: 'interface-lab-stacked-interfaces',
    name: 'Stacked Interfaces',
    check: (elements, beamSegments) => {
      const environments = elements.filter((el) => el.type === 'environment')
      if (environments.length < 2) return false
      // 光束经过多层后偏振度增强
      const lastSeg = beamSegments[beamSegments.length - 1]
      if (!lastSeg) return false
      const dop = Math.sqrt(
        lastSeg.stokes.s1 ** 2 + lastSeg.stokes.s2 ** 2 + lastSeg.stokes.s3 ** 2,
      ) / Math.max(lastSeg.stokes.s0, 0.001)
      return dop > 0.7
    },
    response: {
      type: 'particle-burst',
      target: 'discovery-area-stacked',
      params: { particleCount: 8, color: 'hsl(90, 70%, 55%)', shimmerCount: 4 },
    },
  },
]

// ── 区域定义导出 ────────────────────────────────────────────────────

export const interfaceLabDefinition: RegionDefinition = {
  id: 'interface-lab',
  theme: {
    id: 'interface-lab',
    name: 'Interface Lab',
    nameKey: 'odyssey.regions.interfaceLab',
    colorPalette: {
      background: ['#f0f5e0', '#d4e0a0'],  // 绿金渐变
      platformFill: '#e4ecc0',
      platformStroke: '#a8bf5a',
      accentColor: '#7a9a2a',
    },
    gridOpacity: 0.025,
  },
  gridWidth: 13,
  gridHeight: 13,
  worldOffsetX: 0,
  worldOffsetY: 28,
  initialElements: [...createPlatforms(), ...createOpticalElements(), ...createDecorations()],
  paletteItems: ['polarizer', 'environment'],
  boundaries: [
    {
      direction: 'north',
      targetRegionId: 'refraction-bench',
      type: 'bridge',
      entryPoint: { x: 6, y: 11 },
      exitPoint: { x: 6, y: 0 },
    },
    {
      direction: 'east',
      targetRegionId: 'measurement-studio',
      type: 'soft',
      entryPoint: { x: 0, y: 6 },
      exitPoint: { x: 12, y: 6 },
    },
  ],
  discoveries: interfaceLabDiscoveries,
  discoveryConnections: [
    {
      fromDiscoveryId: 'interface-lab-fresnel-reflection',
      toDiscoveryId: 'refraction-bench-brewster-angle',
      toRegionId: 'refraction-bench',
      connectionTag: 'Fresnel equations predict Brewster angle as zero p-reflectance',
    },
    {
      fromDiscoveryId: 'interface-lab-medium-comparison',
      toDiscoveryId: 'scattering-chamber-rayleigh-polarization',
      toRegionId: 'scattering-chamber',
      connectionTag: 'Interface effects and scattering both depend on refractive index contrast',
    },
    {
      fromDiscoveryId: 'interface-lab-fresnel-reflection',
      toDiscoveryId: 'measurement-studio-full-polarimetry',
      toRegionId: 'measurement-studio',
      connectionTag: 'Full polarimetry can characterize Fresnel reflection coefficients',
    },
  ],
}
