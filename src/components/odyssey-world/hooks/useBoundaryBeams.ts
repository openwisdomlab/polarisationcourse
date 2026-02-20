/**
 * useBoundaryBeams.ts -- 跨区域光束边界检测 Hook
 *
 * 检测光束段是否退出当前区域边界:
 * 1. 读取 beamSegments 和 activeRegionId
 * 2. 对每个光束段调用 clipBeamToRegion 检测退出
 * 3. 退出时生成 BoundaryBeam 记录 (Stokes 参数、方向、退出点)
 * 4. 将边界光束存储到相邻区域的 incomingBeams 数组
 * 5. 返回当前区域的退出光束和入境光束 (渲染 BoundaryIndicator 用)
 *
 * 同时读取当前区域的 incomingBeams 用于渲染入境指示器。
 */

import { useMemo } from 'react'
import {
  useOdysseyWorldStore,
  type BoundaryBeam,
  type BeamSegment,
} from '@/stores/odysseyWorldStore'
import { getRegionBounds, clipBeamToRegion, type RegionBounds } from '@/lib/isometric'
import {
  getRegionDefinition,
  type RegionBoundary,
} from '@/components/odyssey-world/regions/regionRegistry'

// ── 出口方向到对应边界方向的映射 ────────────────────────────────────────

/** 退出方向对应的入口方向 (对面) */
const OPPOSITE_DIRECTION: Record<string, string> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
}

// ── 边界光束检测逻辑 ────────────────────────────────────────────────────

/**
 * 从光束段列表中检测退出当前区域的光束
 *
 * @param beamSegments 当前光束段数组
 * @param bounds 当前区域边界
 * @returns 退出光束数组
 */
function detectExitBeams(
  beamSegments: BeamSegment[],
  bounds: RegionBounds,
): BoundaryBeam[] {
  const exitBeams: BoundaryBeam[] = []

  for (const seg of beamSegments) {
    const clip = clipBeamToRegion(seg.fromX, seg.fromY, seg.toX, seg.toY, bounds)

    if (clip.exits && clip.exitDirection !== '') {
      // 计算传播方向 (单位向量)
      const dx = seg.toX - seg.fromX
      const dy = seg.toY - seg.fromY
      const dist = Math.hypot(dx, dy)
      const ndx = dist > 0 ? dx / dist : 0
      const ndy = dist > 0 ? dy / dist : 0

      exitBeams.push({
        exitDirection: clip.exitDirection as BoundaryBeam['exitDirection'],
        exitPoint: { x: clip.clippedToX, y: clip.clippedToY },
        stokes: { ...seg.stokes },
        direction: { dx: ndx, dy: ndy },
      })
    }
  }

  return exitBeams
}

/**
 * 查找退出方向对应的相邻区域 ID
 *
 * @param exitDir 退出方向
 * @param boundaries 当前区域的边界列表
 * @returns 相邻区域 ID 或 null
 */
function findAdjacentRegion(
  exitDir: string,
  boundaries: RegionBoundary[],
): string | null {
  const boundary = boundaries.find((b) => b.direction === exitDir)
  return boundary?.targetRegionId ?? null
}

// ── Hook ──────────────────────────────────────────────────────────────────

export interface UseBoundaryBeamsReturn {
  /** 从当前区域退出的光束 */
  exitBeams: BoundaryBeam[]
  /** 进入当前区域的光束 (来自相邻区域) */
  incomingBeams: BoundaryBeam[]
}

/**
 * useBoundaryBeams -- 跨区域光束边界检测
 *
 * 计算当前区域的退出光束和入境光束。
 * 退出光束写入相邻区域的 incomingBeams (通过 store)。
 * 入境光束从 store 中读取。
 */
export function useBoundaryBeams(): UseBoundaryBeamsReturn {
  const beamSegments = useOdysseyWorldStore((s) => s.beamSegments)
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const regions = useOdysseyWorldStore((s) => s.regions)
  const isTransitioning = useOdysseyWorldStore((s) => s.isTransitioning)
  const updateBoundaryBeams = useOdysseyWorldStore((s) => s.updateBoundaryBeams)

  // 获取区域定义和边界
  const regionDef = useMemo(
    () => getRegionDefinition(activeRegionId),
    [activeRegionId],
  )

  // 当前区域的入境光束
  const incomingBeams = useMemo(() => {
    if (isTransitioning) return []
    const regionState = regions.get(activeRegionId)
    return regionState?.incomingBeams ?? []
  }, [regions, activeRegionId, isTransitioning])

  // 检测退出光束并更新相邻区域
  const exitBeams = useMemo(() => {
    if (isTransitioning || !regionDef || beamSegments.length === 0) return []

    const bounds = getRegionBounds(regionDef)
    const exits = detectExitBeams(beamSegments, bounds)

    // 更新相邻区域的 incomingBeams
    // 按退出方向分组，找到对应的相邻区域
    const adjacentBeamsMap = new Map<string, BoundaryBeam[]>()

    for (const exitBeam of exits) {
      const adjacentId = findAdjacentRegion(exitBeam.exitDirection, regionDef.boundaries)
      if (!adjacentId) continue

      // 将退出点转换为相邻区域的入口光束
      // 入口方向是退出方向的对面
      const entryDir = OPPOSITE_DIRECTION[exitBeam.exitDirection]

      // 查找相邻区域的边界定义，获取入口点
      const adjacentDef = getRegionDefinition(adjacentId)
      if (!adjacentDef) continue

      const adjacentBoundary = adjacentDef.boundaries.find(
        (b) => b.direction === entryDir && b.targetRegionId === activeRegionId,
      )

      // 入口光束: 从边界入口点开始，携带退出光束的 Stokes 参数
      const entryX = adjacentBoundary?.entryPoint.x ?? 0
      const entryY = adjacentBoundary?.entryPoint.y ?? 0

      const entryBeam: BoundaryBeam = {
        exitDirection: entryDir as BoundaryBeam['exitDirection'],
        exitPoint: { x: entryX, y: entryY },
        stokes: exitBeam.stokes,
        direction: exitBeam.direction,
      }

      if (!adjacentBeamsMap.has(adjacentId)) {
        adjacentBeamsMap.set(adjacentId, [])
      }
      adjacentBeamsMap.get(adjacentId)!.push(entryBeam)
    }

    // 写入 store (使用 queueMicrotask 避免渲染期间更新)
    queueMicrotask(() => {
      for (const [regionId, beams] of adjacentBeamsMap) {
        updateBoundaryBeams(regionId, beams)
      }
    })

    return exits
  }, [beamSegments, regionDef, activeRegionId, isTransitioning, updateBoundaryBeams])

  return { exitBeams, incomingBeams }
}
