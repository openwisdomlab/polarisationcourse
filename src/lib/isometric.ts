/**
 * isometric.ts -- 等距坐标系工具模块
 *
 * 提供世界坐标 (grid) 与屏幕坐标 (pixel) 之间的转换，
 * 以及深度排序、缩放夹紧、距离计算等实用函数。
 *
 * 使用标准 2:1 等距投影 (tile 宽高比 2:1)，
 * 公式参考: https://clintbellanger.net/articles/isometric_math/
 *
 * 纯函数模块，不依赖 React 或任何状态库。
 */

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
