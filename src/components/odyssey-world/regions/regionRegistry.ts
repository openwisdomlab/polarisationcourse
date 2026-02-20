/**
 * regionRegistry.ts -- 区域注册表
 *
 * 定义 6 个光学实验室区域的类型系统和注册表。
 * 提供按 ID 查询区域定义、获取全部区域 ID 等工具函数。
 *
 * 区域布局 (世界坐标偏移):
 *
 *   Crystal Lab (0,0)     │  Wave Platform (14,0)
 *   13x13                 │  15x13
 *   ──────────────────────┼────────────────────────
 *   Refraction Bench (0,15) │  Scattering Chamber (16,15)
 *   15x12                   │  12x12
 *   ────────────────────────┼────────────────────────
 *   Interface Lab (0,28)    │  Measurement Studio (14,28)
 *   13x13                   │  14x14
 *
 * 所有区域从一开始就可自由访问，无锁定或门禁逻辑。
 */

import type { SceneElement, SceneElementType } from '@/stores/odysseyWorldStore'
import type { DiscoveryConfig } from '@/components/odyssey-world/hooks/useDiscoveryState'

// ── 类型定义 ────────────────────────────────────────────────────────

/** 区域视觉主题配置 */
export interface RegionTheme {
  /** 主题唯一标识 */
  id: string
  /** 显示名称 (英文) */
  name: string
  /** i18n 翻译键 */
  nameKey: string
  /** 色彩方案 */
  colorPalette: {
    /** 背景渐变色停 [起始色, 终止色] */
    background: [string, string]
    /** 平台填充色 */
    platformFill: string
    /** 平台描边色 */
    platformStroke: string
    /** 强调色 (装饰、光晕) */
    accentColor: string
  }
  /** 网格线透明度 (0.01-0.04)，影响氛围 */
  gridOpacity: number
}

/** 区域边界定义 -- 连接到相邻区域 */
export interface RegionBoundary {
  /** 边界方向 */
  direction: 'north' | 'south' | 'east' | 'west'
  /** 目标区域 ID */
  targetRegionId: string
  /** 过渡类型: 柔和渐变 / 拱门 / 隧道 / 桥梁 */
  type: 'soft' | 'archway' | 'tunnel' | 'bridge'
  /** 目标区域的入口点 (本地坐标) */
  entryPoint: { x: number; y: number }
  /** 本区域的出口点 (本地坐标) */
  exitPoint: { x: number; y: number }
}

/** 跨区域发现连接 */
export interface DiscoveryConnection {
  /** 源发现 ID (本区域) */
  fromDiscoveryId: string
  /** 目标发现 ID (目标区域) */
  toDiscoveryId: string
  /** 目标区域 ID */
  toRegionId: string
  /** 连接描述 (星图 tooltip 用) */
  connectionTag?: string
}

/** 跨区域大发现 (需要多个区域的发现组合) */
export interface MetaDiscovery {
  id: string
  name: string
  requiredDiscoveries: { regionId: string; discoveryId: string }[]
}

/** 设备面板扩充规则 (发现解锁新工具) */
export interface PaletteEnrichment {
  /** 触发发现的 ID */
  requiredDiscoveryId: string
  /** 目标区域 ID (新工具出现在哪个区域) */
  targetRegionId: string
  /** 解锁的工具类型 */
  elementType: SceneElementType
  /** 工具属性模板 */
  properties: Record<string, number | string | boolean>
}

// ── 跨区域大发现 (meta-discoveries) ──────────────────────────────────

/**
 * 3 个跨区域大发现，需要组合多个区域的知识
 */
export const META_DISCOVERIES: MetaDiscovery[] = [
  {
    id: 'meta-wave-particle-duality',
    name: 'Wave-Particle Duality of Polarization',
    requiredDiscoveries: [
      { regionId: 'crystal-lab', discoveryId: 'crystal-lab-circular-polarization' },
      { regionId: 'wave-platform', discoveryId: 'wave-platform-retardation-series' },
      { regionId: 'measurement-studio', discoveryId: 'measurement-studio-stokes-measurement' },
    ],
  },
  {
    id: 'meta-universal-interface-law',
    name: 'Universal Interface Law',
    requiredDiscoveries: [
      { regionId: 'refraction-bench', discoveryId: 'refraction-bench-brewster-angle' },
      { regionId: 'interface-lab', discoveryId: 'interface-lab-fresnel-reflection' },
    ],
  },
  {
    id: 'meta-complete-polarization-control',
    name: 'Complete Polarization Control',
    requiredDiscoveries: [
      { regionId: 'crystal-lab', discoveryId: 'crystal-lab-malus-law-basic' },
      { regionId: 'wave-platform', discoveryId: 'wave-platform-poincare-traverse' },
      { regionId: 'refraction-bench', discoveryId: 'refraction-bench-total-reflection' },
    ],
  },
  {
    id: 'meta-nature-of-sky-light',
    name: 'Nature of Skylight Polarization',
    requiredDiscoveries: [
      { regionId: 'scattering-chamber', discoveryId: 'scattering-chamber-rayleigh-polarization' },
      { regionId: 'measurement-studio', discoveryId: 'measurement-studio-stokes-measurement' },
    ],
  },
]

// ── 设备面板扩充规则 ──────────────────────────────────────────────────

/**
 * 10 条发现驱动的面板扩充规则
 * 发现 X -> 区域 Y 解锁新工具 (隐形门禁，DISC-02)
 */
export const PALETTE_ENRICHMENTS: PaletteEnrichment[] = [
  // 发现圆偏振 -> Refraction Bench 解锁波片
  {
    requiredDiscoveryId: 'crystal-lab-circular-polarization',
    targetRegionId: 'refraction-bench',
    elementType: 'waveplate',
    properties: { retardation: 90, fastAxis: 0, type: 'quarter-wave' },
  },
  // 发现布儒斯特角 -> Wave Platform 解锁环境介质
  {
    requiredDiscoveryId: 'refraction-bench-brewster-angle',
    targetRegionId: 'wave-platform',
    elementType: 'environment',
    properties: { medium: 'glass', refractiveIndex: 1.52 },
  },
  // 发现半波旋转 -> Scattering Chamber 解锁半波片
  {
    requiredDiscoveryId: 'crystal-lab-half-wave-rotation',
    targetRegionId: 'scattering-chamber',
    elementType: 'waveplate',
    properties: { retardation: 180, fastAxis: 0, type: 'half-wave' },
  },
  // 发现全反射 -> Interface Lab 解锁棱镜
  {
    requiredDiscoveryId: 'refraction-bench-total-reflection',
    targetRegionId: 'interface-lab',
    elementType: 'prism',
    properties: { prismAngle: 45, refractiveIndex: 1.52 },
  },
  // 发现瑞利偏振 -> Measurement Studio 解锁偏振片
  {
    requiredDiscoveryId: 'scattering-chamber-rayleigh-polarization',
    targetRegionId: 'measurement-studio',
    elementType: 'polarizer',
    properties: { transmissionAxis: 0, type: 'analyzer' },
  },
  // 发现 Stokes 测量 -> Crystal Lab 解锁检偏器
  {
    requiredDiscoveryId: 'measurement-studio-stokes-measurement',
    targetRegionId: 'crystal-lab',
    elementType: 'polarizer',
    properties: { transmissionAxis: 0, type: 'analyzer' },
  },
  // 发现 Fresnel 反射 -> Scattering Chamber 解锁偏振片
  {
    requiredDiscoveryId: 'interface-lab-fresnel-reflection',
    targetRegionId: 'scattering-chamber',
    elementType: 'polarizer',
    properties: { transmissionAxis: 0, type: 'linear' },
  },
  // 发现相位延迟系列 -> Measurement Studio 解锁波片
  {
    requiredDiscoveryId: 'wave-platform-retardation-series',
    targetRegionId: 'measurement-studio',
    elementType: 'waveplate',
    properties: { retardation: 90, fastAxis: 0, type: 'quarter-wave' },
  },
  // 发现 Poincare 遍历 -> Interface Lab 解锁波片
  {
    requiredDiscoveryId: 'wave-platform-poincare-traverse',
    targetRegionId: 'interface-lab',
    elementType: 'waveplate',
    properties: { retardation: 180, fastAxis: 0, type: 'half-wave' },
  },
  // 发现三偏振片惊喜 -> Refraction Bench 解锁检偏器
  {
    requiredDiscoveryId: 'crystal-lab-three-polarizer-surprise',
    targetRegionId: 'refraction-bench',
    elementType: 'polarizer',
    properties: { transmissionAxis: 0, type: 'analyzer' },
  },
]

/** 完整区域定义 */
export interface RegionDefinition {
  /** 区域唯一标识 */
  id: string
  /** 视觉主题 */
  theme: RegionTheme
  /** 网格宽度 (12-15) */
  gridWidth: number
  /** 网格高度 (12-15) */
  gridHeight: number
  /** 世界坐标 X 偏移 (用于相邻布局) */
  worldOffsetX: number
  /** 世界坐标 Y 偏移 */
  worldOffsetY: number
  /** 初始场景元素 (平台、光源、预置光学元件、装饰) */
  initialElements: SceneElement[]
  /** 本区域可用的设备调色板物品 */
  paletteItems: SceneElementType[]
  /** 与相邻区域的边界连接 */
  boundaries: RegionBoundary[]
  /** 本区域的发现配置列表 */
  discoveries: DiscoveryConfig[]
  /** 跨区域发现连接 (源自本区域) */
  discoveryConnections: DiscoveryConnection[]
}

// ── 导入 6 个区域定义 ────────────────────────────────────────────────

import { crystalLabDefinition } from './crystalLab'
import { refractionBenchDefinition } from './refractionBench'
import { scatteringChamberDefinition } from './scatteringChamber'
import { wavePlatformDefinition } from './wavePlatform'
import { interfaceLabDefinition } from './interfaceLab'
import { measurementStudioDefinition } from './measurementStudio'

// ── 区域注册表 ──────────────────────────────────────────────────────

/** 所有区域定义的映射表 */
export const REGION_DEFINITIONS: Map<string, RegionDefinition> = new Map([
  ['crystal-lab', crystalLabDefinition],
  ['refraction-bench', refractionBenchDefinition],
  ['scattering-chamber', scatteringChamberDefinition],
  ['wave-platform', wavePlatformDefinition],
  ['interface-lab', interfaceLabDefinition],
  ['measurement-studio', measurementStudioDefinition],
])

// ── 查询工具函数 ────────────────────────────────────────────────────

/**
 * 按 ID 获取区域定义
 *
 * @param id 区域 ID
 * @returns 区域定义，如果未找到返回 undefined
 */
export function getRegionDefinition(id: string): RegionDefinition | undefined {
  return REGION_DEFINITIONS.get(id)
}

/**
 * 按 ID 获取区域定义 (带断言)
 *
 * @param id 区域 ID
 * @returns 区域定义
 * @throws 如果区域 ID 未注册
 */
export function getRegionById(id: string): RegionDefinition {
  const def = REGION_DEFINITIONS.get(id)
  if (!def) {
    throw new Error(`Region not found: ${id}`)
  }
  return def
}

/**
 * 获取所有区域 ID
 *
 * @returns 区域 ID 数组
 */
export function getAllRegionIds(): string[] {
  return [...REGION_DEFINITIONS.keys()]
}
