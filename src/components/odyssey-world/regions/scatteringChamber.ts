/**
 * scatteringChamber.ts -- Scattering Chamber 区域定义
 *
 * 深紫色调暗室，专注瑞利散射偏振和天空偏振现象。
 * 12x12 紧凑网格，大气介质环境模拟散射效应。
 */

import type { SceneElement } from '@/stores/odysseyWorldStore'
import type { RegionDefinition } from './regionRegistry'
import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

// ── 平台生成 ────────────────────────────────────────────────────────

function createPlatforms(): SceneElement[] {
  const elements: SceneElement[] = []

  for (let x = 0; x < 12; x++) {
    for (let y = 0; y < 12; y++) {
      elements.push({
        id: `scattering-chamber-platform-${x}-${y}`,
        type: 'platform',
        worldX: x,
        worldY: y,
        worldZ: 0,
        rotation: 0,
        properties: { walkable: true, material: 'dark-stone' },
      })
    }
  }

  return elements
}

// ── 光学元件 ────────────────────────────────────────────────────────

function createOpticalElements(): SceneElement[] {
  return [
    // 光源 -- 模拟太阳光入射
    {
      id: 'scattering-chamber-light-source-1',
      type: 'light-source',
      worldX: 1,
      worldY: 6,
      worldZ: 0,
      rotation: 0,
      properties: {
        intensity: 1,
        wavelength: 450, // 短波长，瑞利散射更显著
        polarization: 'unpolarized',
      },
    },
    // 大气介质 -- 散射环境
    {
      id: 'scattering-chamber-environment-atmosphere',
      type: 'environment',
      worldX: 6,
      worldY: 6,
      worldZ: 0,
      rotation: 0,
      properties: {
        mediumType: 'atmosphere',
        refractiveIndex: 1.0003,
        variant: 'medium-region',
        scatteringCoefficient: 0.8,
      },
    },
  ]
}

// ── 装饰元素 ────────────────────────────────────────────────────────

function createDecorations(): SceneElement[] {
  return [
    {
      id: 'scattering-chamber-decoration-sky-dome',
      type: 'decoration',
      worldX: 6,
      worldY: 0,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'sky-dome-model' },
    },
    {
      id: 'scattering-chamber-decoration-dust-particles',
      type: 'decoration',
      worldX: 3,
      worldY: 9,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'dust-particles' },
    },
    {
      id: 'scattering-chamber-decoration-spectrometer',
      type: 'decoration',
      worldX: 10,
      worldY: 2,
      worldZ: 0,
      rotation: 45,
      properties: { variant: 'spectrometer' },
    },
  ]
}

// ── 发现配置 ────────────────────────────────────────────────────────

export const scatteringChamberDiscoveries: DiscoveryConfig[] = [
  {
    // 瑞利散射偏振: 90 度散射方向完全偏振化
    id: 'scattering-chamber-rayleigh-polarization',
    name: 'Rayleigh Scattering Polarization',
    check: (elements, beamSegments) => {
      const hasAtmosphere = elements.some(
        (el) => el.type === 'environment' && el.properties.mediumType === 'atmosphere',
      )
      if (!hasAtmosphere) return false
      // 散射后光束应有显著偏振度
      return beamSegments.some(
        (seg) => Math.abs(seg.stokes.s1) > 0.5 || Math.abs(seg.stokes.s2) > 0.5,
      )
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-rayleigh',
      params: { color: 'hsl(260, 60%, 65%)', radius: 80, opacity: 0.3 },
    },
  },
  {
    // 天空偏振模式: 不同散射角对应不同偏振度
    id: 'scattering-chamber-sky-pattern',
    name: 'Sky Polarization Pattern',
    check: (_elements, beamSegments) => {
      // 需要多个不同偏振度的光束段（代表不同散射角）
      if (beamSegments.length < 3) return false
      const opacities = beamSegments.map((seg) => seg.opacity)
      const uniqueOpacities = new Set(opacities.map((o) => Math.round(o * 10) / 10))
      return uniqueOpacities.size >= 3
    },
    response: {
      type: 'pattern',
      target: 'discovery-area-sky',
      params: { patternType: 'gradient-arc', opacity: 0.25, color: 'hsl(240, 50%, 70%)' },
    },
  },
  {
    // 散射与波长: 短波长散射更强 (蓝天原理)
    id: 'scattering-chamber-wavelength-dependence',
    name: 'Wavelength-Dependent Scattering',
    check: (elements, beamSegments) => {
      const lightSources = elements.filter((el) => el.type === 'light-source')
      if (lightSources.length === 0) return false
      // 需要观察到强度变化与波长相关
      return beamSegments.length >= 2 && beamSegments.some((seg) => seg.stokes.s0 < 0.7)
    },
    response: {
      type: 'color-shift',
      target: 'discovery-area-wavelength',
      params: { color: 'hsl(280, 50%, 55%)', duration: 1.5, opacity: 0.3 },
    },
  },
]

// ── 区域定义导出 ────────────────────────────────────────────────────

export const scatteringChamberDefinition: RegionDefinition = {
  id: 'scattering-chamber',
  theme: {
    id: 'scattering-chamber',
    name: 'Scattering Chamber',
    nameKey: 'odyssey.regions.scatteringChamber',
    colorPalette: {
      background: ['#2d1f4e', '#1a1230'],  // 深紫渐变
      platformFill: '#3d2d5e',
      platformStroke: '#6b4fa0',
      accentColor: '#9b7dd4',
    },
    gridOpacity: 0.015,
  },
  gridWidth: 12,
  gridHeight: 12,
  worldOffsetX: 16,
  worldOffsetY: 15,
  initialElements: [...createPlatforms(), ...createOpticalElements(), ...createDecorations()],
  paletteItems: ['polarizer', 'waveplate'],
  boundaries: [
    {
      direction: 'west',
      targetRegionId: 'refraction-bench',
      type: 'tunnel',
      entryPoint: { x: 14, y: 6 },
      exitPoint: { x: 0, y: 6 },
    },
    {
      direction: 'south',
      targetRegionId: 'measurement-studio',
      type: 'archway',
      entryPoint: { x: 6, y: 0 },
      exitPoint: { x: 6, y: 11 },
    },
  ],
  discoveries: scatteringChamberDiscoveries,
  discoveryConnections: [
    {
      fromDiscoveryId: 'scattering-chamber-rayleigh-polarization',
      toDiscoveryId: 'refraction-bench-brewster-angle',
      toRegionId: 'refraction-bench',
    },
  ],
}
