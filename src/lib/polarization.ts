/**
 * Polarization utilities - 偏振光色彩和角度处理工具库
 * 可在2D游戏、3D游戏和课程Demo中复用
 *
 * 支持三种色彩模式：
 * - discrete: 离散4色模式（经典教学配色）
 * - continuous: 连续HSL渐变（彩虹色）
 * - michelLevy: 米歇尔-莱维干涉色（模拟真实偏光显微镜）
 */

import type { PolarizationAngle } from '@/core/types'

// ============== 色彩模式定义 ==============

/**
 * 偏振色彩显示模式
 * - discrete: 离散4色（教学经典配色，便于区分）
 * - continuous: 连续彩虹色（HSL色相映射，更丰富）
 * - michelLevy: 米歇尔-莱维干涉色（模拟真实偏光显微镜观察效果）
 */
export type PolarizationColorMode = 'discrete' | 'continuous' | 'michelLevy'

// 当前全局色彩模式
let currentColorMode: PolarizationColorMode = 'continuous'

/**
 * 设置偏振色彩显示模式
 */
export function setColorMode(mode: PolarizationColorMode): void {
  currentColorMode = mode
}

/**
 * 获取当前色彩模式
 */
export function getColorMode(): PolarizationColorMode {
  return currentColorMode
}

// ============== 离散色彩定义（经典模式）==============

// 偏振角度对应的十六进制颜色
export const POLARIZATION_HEX_COLORS: Record<PolarizationAngle, string> = {
  0: '#ff4444',    // 红色 - 水平偏振 (0°)
  45: '#ffaa00',   // 橙黄色 - 45度偏振
  90: '#44ff44',   // 绿色 - 垂直偏振 (90°)
  135: '#4444ff', // 蓝色 - 135度偏振
}

// 偏振角度对应的CSS颜色名称
export const POLARIZATION_COLOR_NAMES: Record<PolarizationAngle, { en: string; zh: string }> = {
  0: { en: 'Red (Horizontal)', zh: '红色 (水平)' },
  45: { en: 'Orange (45°)', zh: '橙黄色 (45°)' },
  90: { en: 'Green (Vertical)', zh: '绿色 (垂直)' },
  135: { en: 'Blue (135°)', zh: '蓝色 (135°)' },
}

// 偏振角度范围边界
const ANGLE_BOUNDARIES = {
  RED_MAX: 22.5,      // 0° ± 22.5°
  ORANGE_MAX: 67.5,   // 45° ± 22.5°
  GREEN_MAX: 112.5,   // 90° ± 22.5°
  BLUE_MAX: 157.5,    // 135° ± 22.5°
}

/**
 * 根据偏振角度获取对应的显示颜色
 * 将连续角度映射到4个离散颜色
 * @param angle 偏振角度 (任意数值，会被归一化到0-180)
 * @returns 十六进制颜色字符串
 */
export function getPolarizationColorDiscrete(angle: number): string {
  const normalizedAngle = normalizeAngle(angle)

  if (normalizedAngle < ANGLE_BOUNDARIES.RED_MAX || normalizedAngle >= ANGLE_BOUNDARIES.BLUE_MAX) {
    return POLARIZATION_HEX_COLORS[0]
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.ORANGE_MAX) {
    return POLARIZATION_HEX_COLORS[45]
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.GREEN_MAX) {
    return POLARIZATION_HEX_COLORS[90]
  }
  return POLARIZATION_HEX_COLORS[135]
}

// ============== 连续彩虹色模式 ==============

/**
 * HSL 转 Hex 颜色
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-100)
 * @param l 亮度 (0-100)
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * 连续彩虹色模式 - 将偏振角度映射到HSL色相
 * 0° → 红色 (hue=0)
 * 45° → 橙黄色 (hue=45)
 * 90° → 青绿色 (hue=150)
 * 135° → 蓝紫色 (hue=270)
 * 180° → 回到红色
 *
 * @param angle 偏振角度
 * @param saturation 饱和度 (0-100)，默认85
 * @param lightness 亮度 (0-100)，默认55
 */
export function getPolarizationColorContinuous(
  angle: number,
  saturation: number = 85,
  lightness: number = 55
): string {
  const normalizedAngle = normalizeAngle(angle)
  // 将0-180度映射到0-360度色相，形成完整彩虹
  const hue = (normalizedAngle * 2) % 360
  return hslToHex(hue, saturation, lightness)
}

// ============== 米歇尔-莱维干涉色模式 ==============

/**
 * 米歇尔-莱维干涉色表
 * 模拟偏光显微镜中观察到的干涉色
 * 这是一个查找表，基于真实的 Michel-Lévy chart
 *
 * 颜色顺序遵循第一级干涉序列：
 * 灰黑 → 灰白 → 黄 → 橙 → 红 → 紫 → 蓝 → 青绿
 */
const MICHEL_LEVY_COLORS = [
  // 第一级干涉色序列 (0-180度映射)
  { angle: 0, color: '#2a2a2a' },    // 深灰/黑（消光位）
  { angle: 10, color: '#4a4a4a' },   // 灰
  { angle: 20, color: '#6a6a6a' },   // 浅灰
  { angle: 30, color: '#8c8c8c' },   // 灰白
  { angle: 40, color: '#b8a878' },   // 浅黄
  { angle: 50, color: '#d4c46c' },   // 黄
  { angle: 60, color: '#e8b040' },   // 金黄/橙黄
  { angle: 70, color: '#e89030' },   // 橙
  { angle: 80, color: '#e85040' },   // 橙红
  { angle: 90, color: '#d82050' },   // 红
  { angle: 100, color: '#c02080' },  // 红紫
  { angle: 110, color: '#9030a0' },  // 紫
  { angle: 120, color: '#6040c0' },  // 蓝紫
  { angle: 130, color: '#3050d8' },  // 蓝
  { angle: 140, color: '#2070e0' },  // 天蓝
  { angle: 150, color: '#20a0d0' },  // 青蓝
  { angle: 160, color: '#20b8a0' },  // 青绿
  { angle: 170, color: '#30c080' },  // 绿
  { angle: 180, color: '#2a2a2a' },  // 回到深灰（消光位）
]

/**
 * 在两个颜色之间进行线性插值
 */
function lerpColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)
  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * 米歇尔-莱维干涉色模式
 * 模拟偏光显微镜中的干涉色效果
 * 这是真实偏光显微镜观察双折射材料时看到的颜色序列
 *
 * @param angle 偏振角度
 */
export function getPolarizationColorMichelLevy(angle: number): string {
  const normalizedAngle = normalizeAngle(angle)

  // 找到角度所在的区间并进行插值
  for (let i = 0; i < MICHEL_LEVY_COLORS.length - 1; i++) {
    const curr = MICHEL_LEVY_COLORS[i]
    const next = MICHEL_LEVY_COLORS[i + 1]
    if (normalizedAngle >= curr.angle && normalizedAngle < next.angle) {
      const t = (normalizedAngle - curr.angle) / (next.angle - curr.angle)
      return lerpColor(curr.color, next.color, t)
    }
  }

  return MICHEL_LEVY_COLORS[0].color
}

// ============== 统一入口函数 ==============

/**
 * 根据当前色彩模式获取偏振颜色
 * 这是推荐使用的统一入口函数
 *
 * @param angle 偏振角度
 * @param mode 可选的色彩模式覆盖（如不提供则使用全局设置）
 */
export function getPolarizationColor(angle: number, mode?: PolarizationColorMode): string {
  const effectiveMode = mode ?? currentColorMode

  switch (effectiveMode) {
    case 'discrete':
      return getPolarizationColorDiscrete(angle)
    case 'continuous':
      return getPolarizationColorContinuous(angle)
    case 'michelLevy':
      return getPolarizationColorMichelLevy(angle)
    default:
      return getPolarizationColorContinuous(angle)
  }
}

/**
 * 获取指定角度在各种模式下的颜色预览
 * 用于UI中展示不同模式的效果
 */
export function getColorModePreview(angle: number): Record<PolarizationColorMode, string> {
  return {
    discrete: getPolarizationColorDiscrete(angle),
    continuous: getPolarizationColorContinuous(angle),
    michelLevy: getPolarizationColorMichelLevy(angle),
  }
}

/**
 * 色彩模式的显示名称
 */
export const COLOR_MODE_NAMES: Record<PolarizationColorMode, { en: string; zh: string }> = {
  discrete: { en: 'Classic 4-Color', zh: '经典四色' },
  continuous: { en: 'Rainbow Gradient', zh: '彩虹渐变' },
  michelLevy: { en: 'Michel-Lévy Chart', zh: '米歇尔-莱维干涉色' },
}

/**
 * 色彩模式的描述
 */
export const COLOR_MODE_DESCRIPTIONS: Record<PolarizationColorMode, { en: string; zh: string }> = {
  discrete: {
    en: 'Traditional 4-color scheme (0°=Red, 45°=Orange, 90°=Green, 135°=Blue)',
    zh: '传统四色方案（0°=红，45°=橙，90°=绿，135°=蓝）',
  },
  continuous: {
    en: 'Smooth rainbow gradient mapping angle to hue for rich color variation',
    zh: '平滑彩虹渐变，角度映射到色相，颜色变化丰富',
  },
  michelLevy: {
    en: 'Simulates interference colors seen in polarization microscopy',
    zh: '模拟偏光显微镜中观察到的干涉色序列',
  },
}

/**
 * 根据偏振角度获取最接近的离散偏振态
 * @param angle 偏振角度
 * @returns 离散偏振角度 (0, 45, 90, 135)
 */
export function getNearestPolarizationAngle(angle: number): PolarizationAngle {
  const normalizedAngle = normalizeAngle(angle)

  if (normalizedAngle < ANGLE_BOUNDARIES.RED_MAX || normalizedAngle >= ANGLE_BOUNDARIES.BLUE_MAX) {
    return 0
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.ORANGE_MAX) {
    return 45
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.GREEN_MAX) {
    return 90
  }
  return 135
}

/**
 * 获取偏振角度的颜色名称
 * @param angle 偏振角度
 * @param lang 语言 ('en' | 'zh')
 * @returns 颜色名称
 */
export function getPolarizationColorName(angle: number, lang: 'en' | 'zh' = 'en'): string {
  const discreteAngle = getNearestPolarizationAngle(angle)
  return POLARIZATION_COLOR_NAMES[discreteAngle][lang]
}

/**
 * 将角度归一化到 [0, 180) 范围
 * @param angle 任意角度
 * @returns 归一化后的角度
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 180) + 180) % 180
}

/**
 * 检查两个偏振角度是否正交（相差90°）
 * @param angle1 第一个角度
 * @param angle2 第二个角度
 * @returns 是否正交
 */
export function isOrthogonal(angle1: number, angle2: number): boolean {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2))
  return Math.abs(diff - 90) < 5 // 允许5度误差
}

/**
 * 检查两个偏振角度是否平行（相差接近0°或180°）
 * @param angle1 第一个角度
 * @param angle2 第二个角度
 * @param tolerance 容差角度，默认5度
 * @returns 是否平行
 */
export function isParallel(angle1: number, angle2: number, tolerance: number = 5): boolean {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2))
  return diff < tolerance || diff > (180 - tolerance)
}

/**
 * 计算两个偏振角度之间的最小差值
 * @param angle1 第一个角度
 * @param angle2 第二个角度
 * @returns 角度差值 (0-90)
 */
export function getAngleDifference(angle1: number, angle2: number): number {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2))
  return Math.min(diff, 180 - diff)
}

/**
 * 获取所有标准偏振角度列表
 * @returns 标准偏振角度数组
 */
export function getStandardAngles(): PolarizationAngle[] {
  return [0, 45, 90, 135]
}

/**
 * 偏振色彩配置，用于UI显示
 */
export const POLARIZATION_DISPLAY_CONFIG = [
  { angle: 0 as PolarizationAngle, label: '0°', color: POLARIZATION_HEX_COLORS[0] },
  { angle: 45 as PolarizationAngle, label: '45°', color: POLARIZATION_HEX_COLORS[45] },
  { angle: 90 as PolarizationAngle, label: '90°', color: POLARIZATION_HEX_COLORS[90] },
  { angle: 135 as PolarizationAngle, label: '135°', color: POLARIZATION_HEX_COLORS[135] },
] as const
