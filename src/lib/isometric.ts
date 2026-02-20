/**
 * isometric.ts -- 等距坐标系工具模块
 *
 * 提供世界坐标 (grid) 与屏幕坐标 (pixel) 之间的转换，
 * 以及深度排序、缩放夹紧、距离计算、光束路径吸附等实用函数。
 *
 * 使用标准 2:1 等距投影 (tile 宽高比 2:1)，
 * 公式参考: https://clintbellanger.net/articles/isometric_math/
 *
 * 纯函数模块，不依赖 React 或任何状态库。
 */

import type { BeamSegment } from '@/stores/odysseyWorldStore'

// ── 坐标空间类型 ────────────────────────────────────────────────────────

/** 世界坐标 (逻辑网格空间) */
export interface WorldPoint {
  x: number
  y: number
}

/** 屏幕坐标 (像素空间) */
export interface ScreenPoint {
  x: number
  y: number
}

// ── 等距投影常量 ────────────────────────────────────────────────────────

/** 瓦片宽度 (像素) */
export const TILE_WIDTH = 128

/** 瓦片高度 (像素)，宽度的一半，形成 2:1 等距比 */
export const TILE_HEIGHT = 64

/** 瓦片宽度的一半，用于投影计算 */
export const TILE_WIDTH_HALF = TILE_WIDTH / 2

/** 瓦片高度的一半，用于投影计算 */
export const TILE_HEIGHT_HALF = TILE_HEIGHT / 2

/** 最小缩放倍数 */
export const MIN_ZOOM = 0.5

/** 最大缩放倍数 */
export const MAX_ZOOM = 2.0

/** 默认缩放倍数 */
export const DEFAULT_ZOOM = 1.0

// ── 坐标转换函数 ────────────────────────────────────────────────────────

/**
 * 世界坐标 -> 屏幕坐标
 *
 * 标准 2:1 等距投影公式:
 *   screenX = (worldX - worldY) * TILE_WIDTH_HALF
 *   screenY = (worldX + worldY) * TILE_HEIGHT_HALF
 *
 * @param worldX 世界网格 X 坐标
 * @param worldY 世界网格 Y 坐标
 * @returns 屏幕像素坐标
 */
export function worldToScreen(worldX: number, worldY: number): ScreenPoint {
  return {
    x: (worldX - worldY) * TILE_WIDTH_HALF,
    y: (worldX + worldY) * TILE_HEIGHT_HALF,
  }
}

/**
 * 屏幕坐标 -> 世界坐标
 *
 * 等距投影的逆变换:
 *   worldX = screenX / TILE_WIDTH + screenY / TILE_HEIGHT
 *   worldY = screenY / TILE_HEIGHT - screenX / TILE_WIDTH
 *
 * @param screenX 屏幕像素 X 坐标
 * @param screenY 屏幕像素 Y 坐标
 * @returns 世界网格坐标 (可能为非整数，调用方按需取整)
 */
export function screenToWorld(screenX: number, screenY: number): WorldPoint {
  return {
    x: screenX / TILE_WIDTH + screenY / TILE_HEIGHT,
    y: screenY / TILE_HEIGHT - screenX / TILE_WIDTH,
  }
}

/**
 * 屏幕坐标 -> 世界坐标 (含摄像机偏移和缩放)
 *
 * 先还原缩放 (screen / zoom)，再加上摄像机偏移，
 * 最后执行标准逆投影变换。
 *
 * @param screenX 屏幕像素 X
 * @param screenY 屏幕像素 Y
 * @param cameraX 摄像机屏幕空间偏移 X
 * @param cameraY 摄像机屏幕空间偏移 Y
 * @param zoom 当前缩放倍数
 * @returns 世界网格坐标
 */
export function screenToWorldWithCamera(
  screenX: number,
  screenY: number,
  cameraX: number,
  cameraY: number,
  zoom: number,
): WorldPoint {
  // 还原缩放，加回摄像机偏移
  const unzoomedX = screenX / zoom + cameraX
  const unzoomedY = screenY / zoom + cameraY
  return screenToWorld(unzoomedX, unzoomedY)
}

/**
 * 世界坐标 -> 屏幕坐标 (含摄像机偏移和缩放)
 *
 * 先执行标准投影，再减去摄像机偏移，最后应用缩放。
 *
 * @param worldX 世界网格 X
 * @param worldY 世界网格 Y
 * @param cameraX 摄像机屏幕空间偏移 X
 * @param cameraY 摄像机屏幕空间偏移 Y
 * @param zoom 当前缩放倍数
 * @returns 屏幕像素坐标
 */
export function worldToScreenWithCamera(
  worldX: number,
  worldY: number,
  cameraX: number,
  cameraY: number,
  zoom: number,
): ScreenPoint {
  const screen = worldToScreen(worldX, worldY)
  return {
    x: (screen.x - cameraX) * zoom,
    y: (screen.y - cameraY) * zoom,
  }
}

// ── 深度排序 ────────────────────────────────────────────────────────────

/**
 * 画家算法深度排序键
 *
 * 返回值越大表示越靠前 (后绘制 = 遮挡前面的对象)。
 * worldZ 乘数很小 (0.01)，因为 Z 轴仅用于同一平面内的微调，
 * 主要深度由 worldX + worldY 决定。
 *
 * @param worldX 世界网格 X
 * @param worldY 世界网格 Y
 * @param worldZ 高度层 (0 = 地面)，默认 0
 * @returns 深度排序键 (越大越靠前)
 */
export function depthSort(worldX: number, worldY: number, worldZ: number = 0): number {
  return (worldX + worldY) + worldZ * 0.01
}

// ── 辅助函数 ────────────────────────────────────────────────────────────

/**
 * 缩放值夹紧
 *
 * 将缩放值限制在 [MIN_ZOOM, MAX_ZOOM] 范围内。
 *
 * @param zoom 输入缩放值
 * @returns 夹紧后的缩放值
 */
export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

/**
 * 世界网格空间中的曼哈顿距离
 *
 * @param ax 点 A 的世界 X
 * @param ay 点 A 的世界 Y
 * @param bx 点 B 的世界 X
 * @param by 点 B 的世界 Y
 * @returns 曼哈顿距离
 */
export function tileDistance(ax: number, ay: number, bx: number, by: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by)
}

// ── 光束路径吸附 ────────────────────────────────────────────────────────

/** 吸附结果: 世界坐标中最近的光束路径位置 */
export interface SnapResult {
  x: number
  y: number
}

/** 默认吸附半径 (世界单位) */
const DEFAULT_SNAP_RADIUS = 1.5

/** 网格量化步长 (世界单位) */
const GRID_QUANTIZE_STEP = 0.5

/**
 * 将世界坐标吸附到最近的光束路径位置
 *
 * 对每条光束段执行参数化投影:
 * 1. 将点投影到线段上 (参数 t 夹紧到 [0, 1])
 * 2. 计算点到投影的垂直距离
 * 3. 如果距离 < snapRadius，返回量化到 0.5 网格的投影点
 * 4. 在所有段中选择最近的吸附点
 *
 * @param worldX 拖拽位置的世界 X
 * @param worldY 拖拽位置的世界 Y
 * @param beamSegments 当前光束段数组
 * @param snapRadius 吸附半径 (世界单位)，默认 1.5
 * @returns 最近的吸附点，或 null (不在任何光束路径附近)
 */
export function snapToBeamPath(
  worldX: number,
  worldY: number,
  beamSegments: BeamSegment[],
  snapRadius: number = DEFAULT_SNAP_RADIUS,
): SnapResult | null {
  let bestDist = Infinity
  let bestPoint: SnapResult | null = null

  for (const seg of beamSegments) {
    // 线段方向向量
    const dx = seg.toX - seg.fromX
    const dy = seg.toY - seg.fromY
    const lenSq = dx * dx + dy * dy

    // 退化线段 (长度为 0)，直接计算点到端点距离
    if (lenSq === 0) {
      const dist = Math.hypot(worldX - seg.fromX, worldY - seg.fromY)
      if (dist < snapRadius && dist < bestDist) {
        bestDist = dist
        bestPoint = {
          x: quantize(seg.fromX),
          y: quantize(seg.fromY),
        }
      }
      continue
    }

    // 参数化投影: t = dot(P - A, B - A) / |B - A|^2，夹紧到 [0, 1]
    const t = Math.max(0, Math.min(1,
      ((worldX - seg.fromX) * dx + (worldY - seg.fromY) * dy) / lenSq,
    ))

    // 投影点
    const projX = seg.fromX + t * dx
    const projY = seg.fromY + t * dy

    // 垂直距离
    const dist = Math.hypot(worldX - projX, worldY - projY)

    if (dist < snapRadius && dist < bestDist) {
      bestDist = dist
      bestPoint = {
        x: quantize(projX),
        y: quantize(projY),
      }
    }
  }

  return bestPoint
}

/** 量化到最近的 0.5 网格单位 */
function quantize(value: number): number {
  return Math.round(value / GRID_QUANTIZE_STEP) * GRID_QUANTIZE_STEP
}
