/**
 * refractionBench.ts -- Refraction Bench 区域定义
 *
 * 暖橙色调实验台，专注布儒斯特角、全反射和斯涅尔定律的偏振效应。
 * 15x12 网格，包含环境介质（玻璃）用于折射实验。
 */

import type { SceneElement } from '@/stores/odysseyWorldStore'
import type { RegionDefinition } from './regionRegistry'
import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

// ── 平台生成 ────────────────────────────────────────────────────────

function createPlatforms(): SceneElement[] {
  const elements: SceneElement[] = []

  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 12; y++) {
      elements.push({
        id: `refraction-bench-platform-${x}-${y}`,
        type: 'platform',
        worldX: x,
        worldY: y,
        worldZ: 0,
        rotation: 0,
        properties: { walkable: true, material: 'wood' },
      })
    }
  }

  // 抬升实验台区域
  const raisedPositions = [
    { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
    { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
  ]
  for (const pos of raisedPositions) {
    elements.push({
      id: `refraction-bench-raised-${pos.x}-${pos.y}`,
      type: 'platform',
      worldX: pos.x,
      worldY: pos.y,
      worldZ: 1,
      rotation: 0,
      properties: { walkable: true, material: 'marble', elevated: true },
    })
  }

  return elements
}

// ── 光学元件 ────────────────────────────────────────────────────────

function createOpticalElements(): SceneElement[] {
  return [
    // 光源 1 -- 入射光
    {
      id: 'refraction-bench-light-source-1',
      type: 'light-source',
      worldX: 1,
      worldY: 3,
      worldZ: 0,
      rotation: 0,
      properties: {
        intensity: 1,
        wavelength: 589, // 钠光 D 线
        polarization: 'horizontal',
      },
    },
    // 光源 2 -- 全反射实验
    {
      id: 'refraction-bench-light-source-2',
      type: 'light-source',
      worldX: 1,
      worldY: 8,
      worldZ: 0,
      rotation: 0,
      properties: {
        intensity: 1,
        wavelength: 550,
        polarization: 'unpolarized',
      },
    },
    // 环境介质 -- 玻璃 (n=1.52，布儒斯特角实验)
    {
      id: 'refraction-bench-environment-glass',
      type: 'environment',
      worldX: 6,
      worldY: 3,
      worldZ: 0,
      rotation: 0,
      properties: {
        mediumType: 'glass',
        refractiveIndex: 1.52,
        variant: 'medium-region',
      },
    },
    // 偏振片 -- 分析反射光偏振态
    {
      id: 'refraction-bench-polarizer-1',
      type: 'polarizer',
      worldX: 10,
      worldY: 3,
      worldZ: 0,
      rotation: 0,
      properties: {
        transmissionAxis: 0,
        type: 'linear',
      },
    },
  ]
}

// ── 装饰元素 ────────────────────────────────────────────────────────

function createDecorations(): SceneElement[] {
  return [
    {
      id: 'refraction-bench-decoration-goniometer',
      type: 'decoration',
      worldX: 13,
      worldY: 1,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'goniometer' },
    },
    {
      id: 'refraction-bench-decoration-glass-samples',
      type: 'decoration',
      worldX: 0,
      worldY: 0,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'glass-samples' },
    },
    {
      id: 'refraction-bench-decoration-protractor',
      type: 'decoration',
      worldX: 12,
      worldY: 10,
      worldZ: 0,
      rotation: 20,
      properties: { variant: 'protractor' },
    },
    {
      id: 'refraction-bench-decoration-lab-notebook',
      type: 'decoration',
      worldX: 14,
      worldY: 6,
      worldZ: 0,
      rotation: -5,
      properties: { variant: 'notebook' },
    },
  ]
}

// ── 发现配置 ────────────────────────────────────────────────────────

export const refractionBenchDiscoveries: DiscoveryConfig[] = [
  {
    // 布儒斯特角: 反射光在特定角度完全偏振化
    id: 'refraction-bench-brewster-angle',
    name: "Brewster's Angle",
    check: (elements, beamSegments) => {
      // 需要环境介质和偏振片，且存在高度偏振化的反射光束段
      const hasEnvironment = elements.some((el) => el.type === 'environment')
      const hasPolarizer = elements.some((el) => el.type === 'polarizer')
      if (!hasEnvironment || !hasPolarizer) return false
      // 检查是否有强偏振化的光束段 (s1 接近 s0)
      return beamSegments.some(
        (seg) => seg.stokes.s0 > 0.3 && Math.abs(seg.stokes.s1) > seg.stokes.s0 * 0.8,
      )
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-brewster',
      params: { color: 'hsl(30, 80%, 60%)', radius: 70, opacity: 0.35 },
    },
  },
  {
    // 全内反射: 超过临界角时光完全反射
    id: 'refraction-bench-total-reflection',
    name: 'Total Internal Reflection',
    check: (elements, beamSegments) => {
      const hasEnvironment = elements.some(
        (el) => el.type === 'environment' && (el.properties.refractiveIndex as number) > 1.3,
      )
      if (!hasEnvironment) return false
      // 全反射时输出光强度不衰减
      return beamSegments.length >= 2 && beamSegments.every((seg) => seg.stokes.s0 > 0.8)
    },
    response: {
      type: 'pattern',
      target: 'discovery-area-tir',
      params: { patternType: 'shimmer', opacity: 0.3, color: 'hsl(40, 90%, 65%)' },
    },
  },
  {
    // 偏振度随入射角变化: 反射光偏振度与入射角的关系
    id: 'refraction-bench-angle-dependence',
    name: 'Angle-Dependent Polarization',
    check: (_elements, beamSegments, rotationHistory) => {
      // 需要旋转操作且产生不同偏振度的输出
      if (rotationHistory.size === 0) return false
      const opacities = beamSegments.map((seg) => seg.opacity)
      if (opacities.length < 2) return false
      const min = Math.min(...opacities)
      const max = Math.max(...opacities)
      return max - min > 0.3
    },
    response: {
      type: 'color-shift',
      target: 'discovery-area-angle-dep',
      params: { color: 'hsl(25, 70%, 55%)', duration: 1.2, opacity: 0.25 },
    },
  },
  {
    // 斯涅尔定律偏振效应: 折射光的 s 和 p 分量不同
    id: 'refraction-bench-snell-polarization',
    name: "Snell's Law Polarization",
    check: (elements, beamSegments) => {
      const hasEnvironment = elements.some((el) => el.type === 'environment')
      if (!hasEnvironment) return false
      // 折射后光束颜色变化 (偏振方向改变)
      const colors = new Set(beamSegments.map((seg) => seg.color))
      return colors.size >= 2 && beamSegments.length >= 3
    },
    response: {
      type: 'particle-burst',
      target: 'discovery-area-snell',
      params: { particleCount: 6, color: 'hsl(35, 80%, 60%)', shimmerCount: 3 },
    },
  },
]

// ── 区域定义导出 ────────────────────────────────────────────────────

export const refractionBenchDefinition: RegionDefinition = {
  id: 'refraction-bench',
  theme: {
    id: 'refraction-bench',
    name: 'Refraction Bench',
    nameKey: 'odyssey.regions.refractionBench',
    colorPalette: {
      background: ['#fdf0e2', '#f5d4a8'],  // 暖橙渐变
      platformFill: '#f7e4c8',
      platformStroke: '#d4a86a',
      accentColor: '#d4863a',
    },
    gridOpacity: 0.03,
  },
  gridWidth: 15,
  gridHeight: 12,
  worldOffsetX: 0,
  worldOffsetY: 15,
  initialElements: [...createPlatforms(), ...createOpticalElements(), ...createDecorations()],
  paletteItems: ['polarizer', 'environment'],
  boundaries: [
    {
      direction: 'north',
      targetRegionId: 'crystal-lab',
      type: 'soft',
      entryPoint: { x: 6, y: 12 },
      exitPoint: { x: 6, y: 0 },
    },
    {
      direction: 'east',
      targetRegionId: 'scattering-chamber',
      type: 'tunnel',
      entryPoint: { x: 0, y: 6 },
      exitPoint: { x: 14, y: 6 },
    },
    {
      direction: 'south',
      targetRegionId: 'interface-lab',
      type: 'bridge',
      entryPoint: { x: 6, y: 0 },
      exitPoint: { x: 6, y: 11 },
    },
  ],
  discoveries: refractionBenchDiscoveries,
  discoveryConnections: [
    {
      fromDiscoveryId: 'refraction-bench-brewster-angle',
      toDiscoveryId: 'crystal-lab-malus-law-basic',
      toRegionId: 'crystal-lab',
    },
    {
      fromDiscoveryId: 'refraction-bench-total-reflection',
      toDiscoveryId: 'interface-lab-fresnel-reflection',
      toRegionId: 'interface-lab',
    },
  ],
}
