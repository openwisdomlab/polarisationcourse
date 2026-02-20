/**
 * odysseyWorldStore.ts -- Odyssey 等距世界状态管理
 *
 * 管理等距场景的摄像机、缩放、导航、场景元素和光束段。
 * 使用可组合的 SceneElement 类型（而非站点数组），
 * 支持物理行为的灵活组合。
 *
 * 替代旧的 odysseyStore.ts（设计用于已废弃的 3D 传送门模型）。
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { clampZoom } from '@/lib/isometric'

// ── 场景元素类型 ────────────────────────────────────────────────────────

/** 场景元素类型 -- 可组合的物理行为，而非站点数组 */
export type SceneElementType =
  | 'light-source'
  | 'polarizer'
  | 'waveplate'
  | 'platform'
  | 'decoration'
  | 'prism'
  | 'environment'

/** 场景元素 -- 世界中的一个对象 */
export interface SceneElement {
  id: string
  type: SceneElementType
  worldX: number
  worldY: number
  worldZ: number // 高度层 (0 = 地面)
  rotation: number // 角度 (度)
  properties: Record<string, number | string | boolean> // 元素特定属性
}

/** 光束段 -- 光束路径的一个线段 */
export interface BeamSegment {
  id: string
  fromX: number
  fromY: number
  fromZ: number
  toX: number
  toY: number
  toZ: number
  /** 偏振态 (Stokes 参数，来自 PolarizationState) */
  stokes: { s0: number; s1: number; s2: number; s3: number }
  /** 视觉编码 (从 stokes 计算) */
  color: string
  opacity: number
  strokeWidth: number
  shape: 'line' | 'helix' | 'ellipse-markers'
}

// ── 交互模式类型 ────────────────────────────────────────────────────────

/** 当前指针交互模式 */
export type InteractionMode = 'navigate' | 'drag' | 'rotate' | 'idle'

// ── Store 状态接口 ──────────────────────────────────────────────────────

interface OdysseyWorldState {
  // 摄像机
  cameraX: number
  cameraY: number
  zoom: number

  // 场景元素
  sceneElements: SceneElement[]
  beamSegments: BeamSegment[]

  // 导航
  navigationTarget: { x: number; y: number } | null
  isMoving: boolean

  // 头像位置 (世界坐标)
  avatarX: number
  avatarY: number

  // 场景加载状态
  sceneLoaded: boolean

  // 交互状态 (Phase 2)
  selectedElementId: string | null
  hoveredElementId: string | null
  interactionMode: InteractionMode
  dragPreviewPos: { worldX: number; worldY: number } | null

  // 环境弹窗状态 (Phase 2 - Plan 03)
  environmentPopupTarget: string | null

  // 发现系统状态 (Phase 2 - Plan 04)
  achievedDiscoveries: Set<string>
  discoveredEncodings: {
    orientation: boolean
    intensity: boolean
    ellipticity: boolean
    intensityOpacity: boolean
  }
  rotationHistory: Map<string, number[]>

  // ── 动作 ──
  setCamera: (x: number, y: number) => void
  setZoom: (zoom: number) => void
  navigateTo: (worldX: number, worldY: number) => void
  onNavigationComplete: () => void
  setSceneElements: (elements: SceneElement[]) => void
  setBeamSegments: (segments: BeamSegment[]) => void
  initScene: () => void

  // 元素 CRUD 动作 (Phase 2)
  updateElement: (id: string, patch: Partial<SceneElement>) => void
  addElement: (element: SceneElement) => void
  removeElement: (id: string) => void

  // 选择/悬停动作 (Phase 2)
  selectElement: (id: string | null) => void
  hoverElement: (id: string | null) => void

  // 交互模式动作 (Phase 2)
  setInteractionMode: (mode: InteractionMode) => void
  setDragPreviewPos: (pos: { worldX: number; worldY: number } | null) => void

  // 环境弹窗动作 (Phase 2 - Plan 03)
  openEnvironmentPopup: (elementId: string) => void
  closeEnvironmentPopup: () => void

  // 发现系统动作 (Phase 2 - Plan 04)
  achieveDiscovery: (discoveryId: string) => void
  discoverEncoding: (aspect: 'orientation' | 'intensity' | 'ellipticity' | 'intensityOpacity') => void
  recordRotation: (elementId: string, angle: number) => void
}

// ── 初始场景定义 ────────────────────────────────────────────────────────

/**
 * 生成初始场景布局:
 * - 7x7 可行走区域 (Z=0 平台)
 * - 2-3 个抬升平台 (Z=1)
 * - 1 个光源
 * - 2 个预置光学元件 (偏振片、波片)
 * - 若干装饰元素
 */
function createInitialSceneElements(): SceneElement[] {
  const elements: SceneElement[] = []

  // 地面平台 -- 7x7 可行走区域
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 7; y++) {
      elements.push({
        id: `platform-${x}-${y}`,
        type: 'platform',
        worldX: x,
        worldY: y,
        worldZ: 0,
        rotation: 0,
        properties: { walkable: true, material: 'stone' },
      })
    }
  }

  // 抬升平台 (Z=1) -- 多层结构
  const raisedPositions = [
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 2 },
  ]
  for (const pos of raisedPositions) {
    elements.push({
      id: `raised-${pos.x}-${pos.y}`,
      type: 'platform',
      worldX: pos.x,
      worldY: pos.y,
      worldZ: 1,
      rotation: 0,
      properties: { walkable: true, material: 'glass', elevated: true },
    })
  }

  // 光源 -- 发射水平线偏振光 (Stokes: [1, 1, 0, 0])
  elements.push({
    id: 'light-source-1',
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
  })

  // 偏振片 -- 传输轴 45 度
  elements.push({
    id: 'polarizer-1',
    type: 'polarizer',
    worldX: 3,
    worldY: 3,
    worldZ: 0,
    rotation: 45,
    properties: {
      transmissionAxis: 45,
      type: 'linear',
    },
  })

  // 四分之一波片 -- 快轴 0 度
  elements.push({
    id: 'waveplate-1',
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
  })

  // 装饰元素 -- 丰富场景氛围
  elements.push({
    id: 'decoration-lens-stand',
    type: 'decoration',
    worldX: 0,
    worldY: 0,
    worldZ: 0,
    rotation: 0,
    properties: { variant: 'lens-stand' },
  })

  elements.push({
    id: 'decoration-crystal-cluster',
    type: 'decoration',
    worldX: 6,
    worldY: 6,
    worldZ: 0,
    rotation: 30,
    properties: { variant: 'crystal-cluster' },
  })

  elements.push({
    id: 'decoration-prism-display',
    type: 'decoration',
    worldX: 4,
    worldY: 0,
    worldZ: 0,
    rotation: 15,
    properties: { variant: 'prism-display' },
  })

  elements.push({
    id: 'decoration-notebook',
    type: 'decoration',
    worldX: 6,
    worldY: 1,
    worldZ: 0,
    rotation: -10,
    properties: { variant: 'notebook' },
  })

  // 环境区域 -- 介质区域，影响光束的折射率
  elements.push({
    id: 'environment-medium-1',
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
  })

  return elements
}

/**
 * 生成初始光束段
 *
 * 光从光源 (1,3) 经过偏振片 (3,3) 到波片 (5,3)，
 * 然后继续传播。每经过一个光学元件，偏振态发生变化。
 */
function createInitialBeamSegments(): BeamSegment[] {
  return [
    {
      // 光源 -> 偏振片: 水平线偏振
      id: 'beam-seg-1',
      fromX: 1,
      fromY: 3,
      fromZ: 0,
      toX: 3,
      toY: 3,
      toZ: 0,
      stokes: { s0: 1, s1: 1, s2: 0, s3: 0 }, // 水平线偏振
      color: 'hsl(0, 90%, 55%)', // 0 度 -> 红色调
      opacity: 0.9,
      strokeWidth: 3,
      shape: 'line',
    },
    {
      // 偏振片 (45度) 之后: 45度线偏振，强度减半
      id: 'beam-seg-2',
      fromX: 3,
      fromY: 3,
      fromZ: 0,
      toX: 5,
      toY: 3,
      toZ: 0,
      stokes: { s0: 0.5, s1: 0, s2: 0.5, s3: 0 }, // 45度线偏振
      color: 'hsl(90, 90%, 55%)', // 45度 -> 黄绿色调
      opacity: 0.7,
      strokeWidth: 2.5,
      shape: 'line',
    },
    {
      // 四分之一波片之后: 圆偏振
      id: 'beam-seg-3',
      fromX: 5,
      fromY: 3,
      fromZ: 0,
      toX: 6.5,
      toY: 3,
      toZ: 0,
      stokes: { s0: 0.5, s1: 0, s2: 0, s3: 0.5 }, // 右旋圆偏振
      color: 'hsl(90, 90%, 55%)', // 圆偏振保持色调
      opacity: 0.7,
      strokeWidth: 2.5,
      shape: 'helix', // 圆偏振显示为螺旋形
    },
  ]
}

// ── Store ────────────────────────────────────────────────────────────────

export const useOdysseyWorldStore = create<OdysseyWorldState>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    cameraX: 0,
    cameraY: 0,
    zoom: 1,
    sceneElements: [],
    beamSegments: [],
    navigationTarget: null,
    isMoving: false,
    avatarX: 0,
    avatarY: 0,
    sceneLoaded: false,

    // 交互状态 (Phase 2)
    selectedElementId: null,
    hoveredElementId: null,
    interactionMode: 'idle',
    dragPreviewPos: null,

    // 环境弹窗状态 (Phase 2 - Plan 03)
    environmentPopupTarget: null,

    // 发现系统状态 (Phase 2 - Plan 04)
    achievedDiscoveries: new Set<string>(),
    discoveredEncodings: {
      orientation: false,
      intensity: false,
      ellipticity: false,
      intensityOpacity: false,
    },
    rotationHistory: new Map<string, number[]>(),

    // ── 动作 ──

    setCamera: (x, y) => set({ cameraX: x, cameraY: y }),

    setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),

    navigateTo: (worldX, worldY) =>
      set({ navigationTarget: { x: worldX, y: worldY }, isMoving: true }),

    onNavigationComplete: () => {
      const target = get().navigationTarget
      if (target) {
        set({
          navigationTarget: null,
          isMoving: false,
          avatarX: target.x,
          avatarY: target.y,
        })
      } else {
        set({ navigationTarget: null, isMoving: false })
      }
    },

    setSceneElements: (elements) => set({ sceneElements: elements }),

    setBeamSegments: (segments) => set({ beamSegments: segments }),

    initScene: () => {
      if (get().sceneLoaded) return // 防止重复初始化
      set({
        sceneElements: createInitialSceneElements(),
        beamSegments: createInitialBeamSegments(),
        avatarX: 3,
        avatarY: 1,
        sceneLoaded: true,
      })
    },

    // ── 元素 CRUD 动作 (Phase 2) ──

    /** 更新单个元素 -- 使用 map 创建新数组引用以触发 useBeamPhysics 重新计算 */
    updateElement: (id, patch) =>
      set((state) => ({
        sceneElements: state.sceneElements.map((el) =>
          el.id === id ? { ...el, ...patch } : el,
        ),
      })),

    /** 添加元素到场景 */
    addElement: (element) =>
      set((state) => ({
        sceneElements: [...state.sceneElements, element],
      })),

    /** 从场景移除元素 */
    removeElement: (id) =>
      set((state) => ({
        sceneElements: state.sceneElements.filter((el) => el.id !== id),
        // 如果移除的是当前选中元素，清除选择状态
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        hoveredElementId: state.hoveredElementId === id ? null : state.hoveredElementId,
      })),

    // ── 选择/悬停动作 (Phase 2) ──

    selectElement: (id) => set({ selectedElementId: id }),

    hoverElement: (id) => set({ hoveredElementId: id }),

    // ── 交互模式动作 (Phase 2) ──

    setInteractionMode: (mode) => set({ interactionMode: mode }),

    setDragPreviewPos: (pos) => set({ dragPreviewPos: pos }),

    // ── 环境弹窗动作 (Phase 2 - Plan 03) ──

    /** 打开环境属性弹窗 */
    openEnvironmentPopup: (elementId) => set({ environmentPopupTarget: elementId }),

    /** 关闭环境属性弹窗 */
    closeEnvironmentPopup: () => set({ environmentPopupTarget: null }),

    // ── 发现系统动作 (Phase 2 - Plan 04) ──

    /** 标记一个发现为已达成 (仅首次有效，Set 保证 O(1) 查询) */
    achieveDiscovery: (discoveryId) => {
      const current = get().achievedDiscoveries
      if (current.has(discoveryId)) return
      set({ achievedDiscoveries: new Set([...current, discoveryId]) })
    },

    /** 标记一个偏振编码方面已被发现 */
    discoverEncoding: (aspect) => {
      const current = get().discoveredEncodings
      if (current[aspect]) return
      set({ discoveredEncodings: { ...current, [aspect]: true } })
    },

    /** 记录元素旋转角度历史 (用于马吕斯定律发现检测) */
    recordRotation: (elementId, angle) => {
      const current = get().rotationHistory
      const history = current.get(elementId) ?? []
      const newHistory = [...history, angle]
      const newMap = new Map(current)
      newMap.set(elementId, newHistory)
      set({ rotationHistory: newMap })
    },
  })),
)
