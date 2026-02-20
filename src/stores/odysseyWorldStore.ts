/**
 * odysseyWorldStore.ts -- Odyssey 等距世界状态管理
 *
 * 管理等距场景的摄像机、缩放、导航、场景元素和光束段。
 * 使用可组合的 SceneElement 类型（而非站点数组），
 * 支持物理行为的灵活组合。
 *
 * Phase 3 扩展:
 * - 多区域状态管理 (6 个光学实验室区域)
 * - Zustand persist 中间件实现会话持久化
 * - 原子化区域切换 (单次 set() 调用)
 * - 自定义 Set/Map 序列化
 *
 * 替代旧的 odysseyStore.ts（设计用于已废弃的 3D 传送门模型）。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'
import type { PersistStorage, StorageValue } from 'zustand/middleware'
import { clampZoom } from '@/lib/isometric'
import { getRegionById, getAllRegionIds } from '@/components/odyssey-world/regions/regionRegistry'

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

// ── 多区域状态类型 (Phase 3) ────────────────────────────────────────────

/** 跨区域传播的光束信息 */
export interface BoundaryBeam {
  exitDirection: 'north' | 'south' | 'east' | 'west'
  exitPoint: { x: number; y: number }
  stokes: { s0: number; s1: number; s2: number; s3: number }
  direction: { dx: number; dy: number }
}

/** 已发现编码信息 */
export interface DiscoveredEncodings {
  orientation: boolean
  intensity: boolean
  ellipticity: boolean
  intensityOpacity: boolean
}

/** 单个区域的持久化状态 */
export interface RegionState {
  elements: SceneElement[]
  beamSegments: BeamSegment[]
  discoveries: Set<string>
  discoveredEncodings: DiscoveredEncodings
  rotationHistory: Map<string, number[]>
  incomingBeams: BoundaryBeam[]
}

// ── Store 状态接口 ──────────────────────────────────────────────────────

interface OdysseyWorldState {
  // 摄像机
  cameraX: number
  cameraY: number
  zoom: number

  // 场景元素 (当前活跃区域的工作集)
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
  discoveredEncodings: DiscoveredEncodings
  rotationHistory: Map<string, number[]>

  // ── 多区域状态 (Phase 3) ──
  activeRegionId: string
  regions: Map<string, RegionState>
  visitedRegions: Set<string>
  isTransitioning: boolean
  transitionTarget: string | null
  worldMapOpen: boolean

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

  // ── 多区域动作 (Phase 3) ──
  switchRegion: (regionId: string, entryPoint?: { x: number; y: number }) => void
  saveActiveRegion: () => void
  loadRegion: (regionId: string) => void
  resetRegion: (regionId: string) => void
  setTransitioning: (isTransitioning: boolean, target: string | null) => void
  markRegionVisited: (regionId: string) => void
  toggleWorldMap: () => void
}

// ── 自定义存储序列化 (Set/Map -> JSON) ──────────────────────────────────

/** 旋转历史最大条目数 (防止无限增长) */
const MAX_ROTATION_HISTORY = 20

/**
 * 自定义 PersistStorage 实现
 *
 * 处理 Set -> Array 和 Map -> entries 的双向序列化，
 * 使 Zustand persist 能正确持久化非 JSON 原生类型。
 * 反序列化时将旋转历史截断到 MAX_ROTATION_HISTORY 条目。
 */
const customPersistStorage: PersistStorage<Partial<OdysseyWorldState>> = {
  getItem: (name: string): StorageValue<Partial<OdysseyWorldState>> | null => {
    const str = localStorage.getItem(name)
    if (!str) return null

    const parsed = JSON.parse(str) as { state: Record<string, unknown>; version?: number }
    const stateData = parsed.state

    if (!stateData) return null

    // 恢复顶层 Set 类型
    if (stateData.achievedDiscoveries) {
      stateData.achievedDiscoveries = new Set(stateData.achievedDiscoveries as string[])
    }
    if (stateData.visitedRegions) {
      stateData.visitedRegions = new Set(stateData.visitedRegions as string[])
    }

    // 恢复顶层 rotationHistory Map (截断历史)
    if (stateData.rotationHistory) {
      const map = new Map<string, number[]>()
      for (const [key, value] of stateData.rotationHistory as [string, number[]][]) {
        map.set(key, (value as number[]).slice(-MAX_ROTATION_HISTORY))
      }
      stateData.rotationHistory = map
    }

    // 恢复 regions Map 及其内部的 Set/Map 类型
    if (stateData.regions) {
      const regionsMap = new Map<string, RegionState>()
      for (const [key, value] of stateData.regions as [string, Record<string, unknown>][]) {
        const regionData = value
        const rotationHistory = new Map<string, number[]>()
        if (regionData.rotationHistory) {
          for (const [rKey, rValue] of regionData.rotationHistory as [string, number[]][]) {
            rotationHistory.set(rKey, (rValue as number[]).slice(-MAX_ROTATION_HISTORY))
          }
        }
        regionsMap.set(key, {
          elements: regionData.elements as SceneElement[],
          beamSegments: regionData.beamSegments as BeamSegment[],
          discoveries: new Set(regionData.discoveries as string[]),
          discoveredEncodings: regionData.discoveredEncodings as DiscoveredEncodings,
          rotationHistory,
          incomingBeams: (regionData.incomingBeams ?? []) as BoundaryBeam[],
        })
      }
      stateData.regions = regionsMap
    }

    return {
      state: stateData as Partial<OdysseyWorldState>,
      version: parsed.version,
    }
  },

  setItem: (name: string, value: StorageValue<Partial<OdysseyWorldState>>): void => {
    const stateObj = value.state

    // 转换 Set/Map 为可序列化形式
    const serializable = {
      version: value.version,
      state: {
        ...stateObj,
        achievedDiscoveries: stateObj.achievedDiscoveries
          ? [...stateObj.achievedDiscoveries]
          : [],
        visitedRegions: stateObj.visitedRegions
          ? [...stateObj.visitedRegions]
          : [],
        rotationHistory: stateObj.rotationHistory
          ? [...stateObj.rotationHistory].map(
              ([key, arr]) => [key, arr.slice(-MAX_ROTATION_HISTORY)] as [string, number[]],
            )
          : [],
        regions: stateObj.regions
          ? [...stateObj.regions].map(([key, region]) => [
              key,
              {
                ...region,
                discoveries: [...region.discoveries],
                rotationHistory: [...region.rotationHistory].map(
                  ([rKey, arr]) => [rKey, arr.slice(-MAX_ROTATION_HISTORY)] as [string, number[]],
                ),
              },
            ])
          : [],
      },
    }

    localStorage.setItem(name, JSON.stringify(serializable))
  },

  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  },
}

// ── 区域初始化工具 ──────────────────────────────────────────────────────

/** 从区域注册表创建空的区域状态 */
function createRegionState(regionId: string): RegionState {
  const def = getRegionById(regionId)
  return {
    elements: [...def.initialElements],
    beamSegments: [],
    discoveries: new Set<string>(),
    discoveredEncodings: {
      orientation: false,
      intensity: false,
      ellipticity: false,
      intensityOpacity: false,
    },
    rotationHistory: new Map<string, number[]>(),
    incomingBeams: [],
  }
}

/** 初始化所有 6 个区域状态 */
function initializeAllRegions(): Map<string, RegionState> {
  const regions = new Map<string, RegionState>()
  for (const regionId of getAllRegionIds()) {
    regions.set(regionId, createRegionState(regionId))
  }
  return regions
}

// ── Store ────────────────────────────────────────────────────────────────

export const useOdysseyWorldStore = create<OdysseyWorldState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
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
        interactionMode: 'idle' as InteractionMode,
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

        // 多区域状态 (Phase 3)
        activeRegionId: 'crystal-lab',
        regions: new Map<string, RegionState>(),
        visitedRegions: new Set<string>(),
        isTransitioning: false,
        transitionTarget: null,
        worldMapOpen: false,

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

        /**
         * 初始化场景 -- 从区域注册表加载所有 6 个区域
         *
         * 如果 persist 已水合且有保存状态，则跳过 (由 onRehydrateStorage 处理)。
         * 否则初始化所有区域并将 Crystal Lab 设为活跃区域。
         */
        initScene: () => {
          if (get().sceneLoaded) return // 防止重复初始化

          // 初始化所有 6 个区域
          const regions = initializeAllRegions()
          const crystalLab = regions.get('crystal-lab')!

          set({
            regions,
            activeRegionId: 'crystal-lab',
            sceneElements: crystalLab.elements,
            beamSegments: [],  // useBeamPhysics 会重新计算
            avatarX: 3,
            avatarY: 1,
            visitedRegions: new Set(['crystal-lab']),
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
          // 截断到最大条目数，防止无限增长 (pitfall 3)
          const newHistory = [...history, angle].slice(-MAX_ROTATION_HISTORY)
          const newMap = new Map(current)
          newMap.set(elementId, newHistory)
          set({ rotationHistory: newMap })
        },

        // ── 多区域动作 (Phase 3) ──

        /**
         * 原子化区域切换 -- 单次 set() 调用 (pitfall 4)
         *
         * 1. 将当前活跃区域状态保存到 regions Map
         * 2. 从 regions Map 加载目标区域状态
         * 3. 更新 activeRegionId 和 avatar 位置
         * 4. 清除 beamSegments (useBeamPhysics 会重新计算)
         */
        switchRegion: (regionId, entryPoint) =>
          set((state) => {
            // 保存当前活跃区域的状态
            const currentRegionState: RegionState = {
              elements: state.sceneElements,
              beamSegments: state.beamSegments,
              discoveries: state.achievedDiscoveries,
              discoveredEncodings: { ...state.discoveredEncodings },
              rotationHistory: new Map(state.rotationHistory),
              incomingBeams: state.regions.get(state.activeRegionId)?.incomingBeams ?? [],
            }
            const newRegions = new Map(state.regions)
            newRegions.set(state.activeRegionId, currentRegionState)

            // 加载目标区域状态
            const targetRegion = newRegions.get(regionId)
            if (!targetRegion) return {} // 安全检查

            // 确定入口点
            const avatarX = entryPoint?.x ?? 7
            const avatarY = entryPoint?.y ?? 7

            return {
              regions: newRegions,
              activeRegionId: regionId,
              sceneElements: targetRegion.elements,
              beamSegments: [],  // useBeamPhysics 会重新计算
              achievedDiscoveries: targetRegion.discoveries,
              discoveredEncodings: targetRegion.discoveredEncodings,
              rotationHistory: targetRegion.rotationHistory,
              avatarX,
              avatarY,
              // 清除交互状态
              selectedElementId: null,
              hoveredElementId: null,
              interactionMode: 'idle' as InteractionMode,
              dragPreviewPos: null,
              environmentPopupTarget: null,
            }
          }),

        /** 保存当前活跃区域状态到 regions Map */
        saveActiveRegion: () =>
          set((state) => {
            const currentRegionState: RegionState = {
              elements: state.sceneElements,
              beamSegments: state.beamSegments,
              discoveries: state.achievedDiscoveries,
              discoveredEncodings: { ...state.discoveredEncodings },
              rotationHistory: new Map(state.rotationHistory),
              incomingBeams: state.regions.get(state.activeRegionId)?.incomingBeams ?? [],
            }
            const newRegions = new Map(state.regions)
            newRegions.set(state.activeRegionId, currentRegionState)
            return { regions: newRegions }
          }),

        /** 加载指定区域状态到活跃工作集 */
        loadRegion: (regionId) =>
          set((state) => {
            const targetRegion = state.regions.get(regionId)
            if (!targetRegion) return {}
            return {
              activeRegionId: regionId,
              sceneElements: targetRegion.elements,
              beamSegments: [],  // useBeamPhysics 会重新计算
              achievedDiscoveries: targetRegion.discoveries,
              discoveredEncodings: targetRegion.discoveredEncodings,
              rotationHistory: targetRegion.rotationHistory,
            }
          }),

        /** 重置指定区域到初始状态 (不影响其他区域) */
        resetRegion: (regionId) =>
          set((state) => {
            const freshRegion = createRegionState(regionId)
            const newRegions = new Map(state.regions)
            newRegions.set(regionId, freshRegion)

            // 如果重置的是当前活跃区域，同时更新工作集
            if (regionId === state.activeRegionId) {
              return {
                regions: newRegions,
                sceneElements: freshRegion.elements,
                beamSegments: [],
                achievedDiscoveries: freshRegion.discoveries,
                discoveredEncodings: freshRegion.discoveredEncodings,
                rotationHistory: freshRegion.rotationHistory,
                selectedElementId: null,
                hoveredElementId: null,
                environmentPopupTarget: null,
              }
            }
            return { regions: newRegions }
          }),

        /** 设置过渡状态 (阻止交互) */
        setTransitioning: (isTransitioning, target) =>
          set({ isTransitioning, transitionTarget: target }),

        /** 标记区域为已访问 */
        markRegionVisited: (regionId) =>
          set((state) => ({
            visitedRegions: new Set([...state.visitedRegions, regionId]),
          })),

        /** 切换世界地图 */
        toggleWorldMap: () =>
          set((state) => ({ worldMapOpen: !state.worldMapOpen })),
      }),
      {
        name: 'odyssey-world-v3',
        version: 1,
        storage: customPersistStorage,
        /**
         * 仅持久化重要状态，排除瞬态 UI 状态
         *
         * 排除: isTransitioning, transitionTarget, worldMapOpen,
         *       isMoving, navigationTarget, dragPreviewPos,
         *       hoveredElementId, interactionMode, selectedElementId,
         *       environmentPopupTarget, sceneLoaded
         */
        partialize: (state) => ({
          activeRegionId: state.activeRegionId,
          regions: state.regions,
          visitedRegions: state.visitedRegions,
          achievedDiscoveries: state.achievedDiscoveries,
          discoveredEncodings: state.discoveredEncodings,
          avatarX: state.avatarX,
          avatarY: state.avatarY,
          cameraX: state.cameraX,
          cameraY: state.cameraY,
          zoom: state.zoom,
          sceneElements: state.sceneElements,
          beamSegments: state.beamSegments,
          rotationHistory: state.rotationHistory,
        }),
        /**
         * 水合回调 -- persist 恢复保存状态时触发
         *
         * 如果成功恢复了保存的状态，标记 sceneLoaded=true
         * 防止 initScene() 覆盖恢复的状态 (pitfall 1)
         */
        onRehydrateStorage: () => (state) => {
          if (state && state.regions.size > 0) {
            // 成功恢复了保存状态
            state.sceneLoaded = true
          }
        },
      },
    ),
  ),
)
