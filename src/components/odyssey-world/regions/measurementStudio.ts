/**
 * measurementStudio.ts -- Measurement Studio 区域定义
 *
 * 银灰色调精密工作室，专注 Stokes 测量和偏振测量技术。
 * 14x14 网格，配备完整的偏振分析工具。
 */

import type { SceneElement } from '@/stores/odysseyWorldStore'
import type { RegionDefinition } from './regionRegistry'
import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

// ── 平台生成 ────────────────────────────────────────────────────────

function createPlatforms(): SceneElement[] {
  const elements: SceneElement[] = []

  for (let x = 0; x < 14; x++) {
    for (let y = 0; y < 14; y++) {
      elements.push({
        id: `measurement-studio-platform-${x}-${y}`,
        type: 'platform',
        worldX: x,
        worldY: y,
        worldZ: 0,
        rotation: 0,
        properties: { walkable: true, material: 'brushed-metal' },
      })
    }
  }

  // 精密仪器台
  const raisedPositions = [
    { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 },
    { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 },
  ]
  for (const pos of raisedPositions) {
    elements.push({
      id: `measurement-studio-raised-${pos.x}-${pos.y}`,
      type: 'platform',
      worldX: pos.x,
      worldY: pos.y,
      worldZ: 1,
      rotation: 0,
      properties: { walkable: true, material: 'optical-table', elevated: true },
    })
  }

  return elements
}

// ── 光学元件 ────────────────────────────────────────────────────────

function createOpticalElements(): SceneElement[] {
  return [
    // 光源 -- 可调偏振态
    {
      id: 'measurement-studio-light-source-1',
      type: 'light-source',
      worldX: 1,
      worldY: 7,
      worldZ: 0,
      rotation: 0,
      properties: {
        intensity: 1,
        wavelength: 632.8, // He-Ne 激光
        polarization: 'horizontal',
      },
    },
    // 偏振片 -- 分析器
    {
      id: 'measurement-studio-polarizer-1',
      type: 'polarizer',
      worldX: 5,
      worldY: 7,
      worldZ: 0,
      rotation: 0,
      properties: {
        transmissionAxis: 0,
        type: 'linear',
      },
    },
    // 四分之一波片 -- 圆偏振分析
    {
      id: 'measurement-studio-waveplate-1',
      type: 'waveplate',
      worldX: 9,
      worldY: 7,
      worldZ: 0,
      rotation: 0,
      properties: {
        retardation: 90,
        fastAxis: 0,
        type: 'quarter-wave',
      },
    },
  ]
}

// ── 装饰元素 ────────────────────────────────────────────────────────

function createDecorations(): SceneElement[] {
  return [
    {
      id: 'measurement-studio-decoration-stokes-display',
      type: 'decoration',
      worldX: 12,
      worldY: 1,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'stokes-display' },
    },
    {
      id: 'measurement-studio-decoration-poincare-sphere',
      type: 'decoration',
      worldX: 0,
      worldY: 0,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'poincare-sphere-model' },
    },
    {
      id: 'measurement-studio-decoration-detector',
      type: 'decoration',
      worldX: 13,
      worldY: 13,
      worldZ: 0,
      rotation: 0,
      properties: { variant: 'photodetector' },
    },
    {
      id: 'measurement-studio-decoration-mueller-chart',
      type: 'decoration',
      worldX: 0,
      worldY: 12,
      worldZ: 0,
      rotation: 5,
      properties: { variant: 'mueller-chart' },
    },
  ]
}

// ── 发现配置 ────────────────────────────────────────────────────────

export const measurementStudioDiscoveries: DiscoveryConfig[] = [
  {
    // Stokes 测量: 通过旋转偏振片测量 Stokes 参数
    id: 'measurement-studio-stokes-measurement',
    name: 'Stokes Measurement',
    check: (_elements, beamSegments, rotationHistory) => {
      // 需要大量旋转操作 (至少 4 个不同角度) 来模拟 Stokes 测量
      if (rotationHistory.size === 0) return false
      let maxRotations = 0
      for (const history of rotationHistory.values()) {
        if (history.length > maxRotations) maxRotations = history.length
      }
      if (maxRotations < 4) return false
      // 观察到不同强度的输出 (对应 S0-S3 测量)
      const intensities = beamSegments.map((seg) => seg.stokes.s0)
      const unique = new Set(intensities.map((i) => Math.round(i * 10) / 10))
      return unique.size >= 3
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-stokes',
      params: { color: 'hsl(0, 0%, 75%)', radius: 80, opacity: 0.35 },
    },
  },
  {
    // 偏振度测量: 区分完全偏振、部分偏振和非偏振光
    id: 'measurement-studio-dop-measurement',
    name: 'Degree of Polarization',
    check: (_elements, beamSegments) => {
      // 存在不同偏振度的光束段
      if (beamSegments.length < 2) return false
      const dops = beamSegments.map((seg) => {
        const { s0, s1, s2, s3 } = seg.stokes
        return Math.sqrt(s1 ** 2 + s2 ** 2 + s3 ** 2) / Math.max(s0, 0.001)
      })
      const min = Math.min(...dops)
      const max = Math.max(...dops)
      return max - min > 0.3
    },
    response: {
      type: 'color-shift',
      target: 'discovery-area-dop',
      params: { color: 'hsl(210, 20%, 65%)', duration: 1, opacity: 0.25 },
    },
  },
  {
    // 偏振测量技术: 偏振片 + QWP 组合测量全部 4 个 Stokes 参数
    id: 'measurement-studio-full-polarimetry',
    name: 'Full Polarimetry',
    check: (elements, beamSegments, rotationHistory) => {
      // 需要偏振片和波片
      const hasPolarizer = elements.some((el) => el.type === 'polarizer')
      const hasWaveplate = elements.some((el) => el.type === 'waveplate')
      if (!hasPolarizer || !hasWaveplate) return false
      // 广泛的旋转探索
      let totalRotations = 0
      for (const history of rotationHistory.values()) {
        totalRotations += history.length
      }
      if (totalRotations < 6) return false
      // 观察到线偏振和圆偏振
      const hasLine = beamSegments.some((seg) => seg.shape === 'line')
      const hasCircular = beamSegments.some((seg) => seg.shape === 'helix')
      return hasLine && hasCircular
    },
    response: {
      type: 'particle-burst',
      target: 'discovery-area-polarimetry',
      params: { particleCount: 15, color: 'hsl(0, 0%, 80%)', shimmerCount: 6 },
    },
  },
  {
    // Mueller 矩阵验证: 实验验证 Mueller 矩阵预测
    id: 'measurement-studio-mueller-verification',
    name: 'Mueller Matrix Verification',
    check: (elements, beamSegments) => {
      // 需要偏振片 + 波片串联，且输出与理论预测一致
      const polarizers = elements.filter((el) => el.type === 'polarizer')
      const waveplates = elements.filter((el) => el.type === 'waveplate')
      if (polarizers.length === 0 || waveplates.length === 0) return false
      // 至少 3 段光束且有多种偏振形状
      if (beamSegments.length < 3) return false
      const shapes = new Set(beamSegments.map((seg) => seg.shape))
      const colors = new Set(beamSegments.map((seg) => seg.color))
      return shapes.size >= 2 && colors.size >= 2
    },
    response: {
      type: 'illuminate',
      target: 'discovery-area-mueller',
      params: { color: 'hsl(220, 15%, 70%)', radius: 70, opacity: 0.3 },
    },
  },
]

// ── 区域定义导出 ────────────────────────────────────────────────────

export const measurementStudioDefinition: RegionDefinition = {
  id: 'measurement-studio',
  theme: {
    id: 'measurement-studio',
    name: 'Measurement Studio',
    nameKey: 'odyssey.regions.measurementStudio',
    colorPalette: {
      background: ['#f0f0f2', '#d0d0d8'],  // 银灰渐变
      platformFill: '#e0e0e4',
      platformStroke: '#a0a0b0',
      accentColor: '#7070a0',
    },
    gridOpacity: 0.02,
  },
  gridWidth: 14,
  gridHeight: 14,
  worldOffsetX: 14,
  worldOffsetY: 28,
  initialElements: [...createPlatforms(), ...createOpticalElements(), ...createDecorations()],
  paletteItems: ['polarizer', 'waveplate', 'prism'],
  boundaries: [
    {
      direction: 'north',
      targetRegionId: 'scattering-chamber',
      type: 'archway',
      entryPoint: { x: 6, y: 11 },
      exitPoint: { x: 6, y: 0 },
    },
    {
      direction: 'north',
      targetRegionId: 'wave-platform',
      type: 'soft',
      entryPoint: { x: 7, y: 12 },
      exitPoint: { x: 7, y: 0 },
    },
    {
      direction: 'west',
      targetRegionId: 'interface-lab',
      type: 'soft',
      entryPoint: { x: 12, y: 6 },
      exitPoint: { x: 0, y: 6 },
    },
  ],
  discoveries: measurementStudioDiscoveries,
  discoveryConnections: [
    {
      fromDiscoveryId: 'measurement-studio-stokes-measurement',
      toDiscoveryId: 'wave-platform-poincare-traverse',
      toRegionId: 'wave-platform',
      connectionTag: 'Stokes parameters are coordinates on the Poincare sphere',
    },
    {
      fromDiscoveryId: 'measurement-studio-full-polarimetry',
      toDiscoveryId: 'crystal-lab-malus-law-basic',
      toRegionId: 'crystal-lab',
      connectionTag: 'Full polarimetry generalizes the intensity law of Malus',
    },
    {
      fromDiscoveryId: 'measurement-studio-stokes-measurement',
      toDiscoveryId: 'scattering-chamber-rayleigh-polarization',
      toRegionId: 'scattering-chamber',
      connectionTag: 'Stokes measurement quantifies skylight partial polarization',
    },
  ],
}
