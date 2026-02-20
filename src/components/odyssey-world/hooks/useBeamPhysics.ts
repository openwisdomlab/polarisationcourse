/**
 * useBeamPhysics.ts -- 物理引擎到视觉编码的桥梁
 *
 * 连接统一物理引擎 (PolarizationState, MuellerMatrix) 与
 * 等距场景的光束视觉渲染。
 *
 * 核心职责:
 * 1. 从 store 读取场景元素，计算光束路径
 * 2. 对每个光学元件应用 Mueller 矩阵变换
 * 3. 将偏振态映射为视觉属性 (颜色、宽度、透明度、形状)
 *
 * 视觉编码方案 (连续 HSL，非旧版 4 色离散):
 * - 方位角 -> 色相 (0° = 红, 45° = 黄绿, 90° = 蓝绿, 135° = 紫)
 * - 椭圆度 -> 形状 (线/螺旋/椭圆标记)
 * - 强度 -> 透明度 + 线宽
 * - 偏振度 -> 饱和度 + 辉光强度
 */

import { useMemo } from 'react'
import { PolarizationState } from '@/core/physics/unified/PolarizationState'
import { MuellerMatrix } from '@/core/physics/unified/MuellerMatrix'
import { useOdysseyWorldStore, type SceneElement, type BeamSegment } from '@/stores/odysseyWorldStore'

// ── 视觉编码接口 ──────────────────────────────────────────────────────

/** 从偏振态计算得到的视觉属性 */
export interface BeamVisualProps {
  /** HSL 颜色编码方位角 */
  color: string
  /** 透明度 0-1，映射强度 */
  opacity: number
  /** 线宽 1-6px，映射强度 */
  strokeWidth: number
  /** 偏振类型形状: 直线/螺旋/椭圆标记 */
  shape: 'line' | 'helix' | 'ellipse-markers'
  /** 旋向: 顺时针/逆时针/无 */
  handedness: 'cw' | 'ccw' | 'none'
  /** 辉光强度 0-1 */
  glowIntensity: number
}

// ── 偏振态 -> 视觉属性映射 ──────────────────────────────────────────────

/**
 * 将 PolarizationState 转换为视觉渲染属性
 *
 * 编码规则 (基于 CONTEXT.md 和 RESEARCH Pattern 3):
 * - 方位角 -> 色相: hue = (orientationDeg / 180) * 360
 *   0° = 红 (hue 0), 45° = 黄绿 (hue 90), 90° = 蓝绿 (hue 180), 135° = 紫 (hue 270)
 * - 椭圆度 -> 形状: |χ| < 5° = 线偏振, |χ| > 40° = 圆偏振, 中间 = 椭圆偏振
 * - 旋向: χ > 2° = 顺时针, χ < -2° = 逆时针
 * - 强度 -> 透明度 + 线宽: 全消光时光束几乎不可见
 * - 偏振度 -> 饱和度: 高 DoP = 更鲜艳的颜色
 */
export function polarizationToVisual(state: PolarizationState): BeamVisualProps {
  const stokes = state.stokes
  const ellipse = state.ellipse
  const dop = state.dop

  // 方位角 -> 色相 (连续映射，0-180° -> 0-360°)
  const hue = (ellipse.orientationDeg / 180) * 360

  // 饱和度: 高 DoP = 更饱和 (75-100%)
  const saturation = 75 + dop * 25

  // 亮度: 55%，在亮背景上足够可见 (pitfall 6)
  const lightness = 55

  const color = `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${lightness}%)`

  // 椭圆度 -> 形状
  const absEllipticity = Math.abs(ellipse.ellipticityDeg)
  const shape: BeamVisualProps['shape'] =
    absEllipticity < 5 ? 'line' :
    absEllipticity > 40 ? 'helix' :
    'ellipse-markers'

  // 旋向: 从椭圆度角的符号判定
  const handedness: BeamVisualProps['handedness'] =
    ellipse.ellipticityDeg > 2 ? 'cw' :
    ellipse.ellipticityDeg < -2 ? 'ccw' :
    'none'

  // 强度 -> 透明度 + 线宽
  // 全消光 (s0 ~ 0) 时光束几乎不可见
  const opacity = Math.max(0.05, stokes.s0) * dop
  const strokeWidth = Math.max(1, stokes.s0 * 5)

  // 辉光强度: 更亮的光束 = 更强的辉光
  const glowIntensity = stokes.s0 * dop

  return {
    color,
    opacity,
    strokeWidth,
    shape,
    handedness,
    glowIntensity,
  }
}

// ── 光束路径计算 ──────────────────────────────────────────────────────

/**
 * 从场景元素计算光束路径段
 *
 * 算法:
 * 1. 找到光源元素
 * 2. 按离光源距离排序剩余光学元件
 * 3. 从光源初始偏振态开始
 * 4. 逐个应用 Mueller 矩阵变换
 * 5. 生成 BeamSegment[] 含视觉编码
 */
export function calculateBeamPath(elements: SceneElement[]): BeamSegment[] {
  // 查找光源
  const lightSource = elements.find(el => el.type === 'light-source')
  if (!lightSource) return []

  // 筛选光学元件 (偏振片、波片)
  const opticalElements = elements.filter(
    el => el.type === 'polarizer' || el.type === 'waveplate'
  )

  // 按与光源的距离排序 (沿光束传播方向)
  const sorted = [...opticalElements].sort((a, b) => {
    const distA = Math.hypot(a.worldX - lightSource.worldX, a.worldY - lightSource.worldY)
    const distB = Math.hypot(b.worldX - lightSource.worldX, b.worldY - lightSource.worldY)
    return distA - distB
  })

  // 初始偏振态: 水平线偏振，全强度
  const intensity = (lightSource.properties.intensity as number) ?? 1
  let currentState = PolarizationState.createLinear(intensity, 0)

  const segments: BeamSegment[] = []
  let prevX = lightSource.worldX
  let prevY = lightSource.worldY
  let prevZ = lightSource.worldZ
  let segIndex = 0

  // 逐个光学元件生成光束段
  for (const element of sorted) {
    // 当前段: 从上一位置到此元件
    const visual = polarizationToVisual(currentState)
    const stokes = currentState.stokes

    segments.push({
      id: `beam-seg-${segIndex++}`,
      fromX: prevX,
      fromY: prevY,
      fromZ: prevZ,
      toX: element.worldX,
      toY: element.worldY,
      toZ: element.worldZ,
      stokes: { s0: stokes.s0, s1: stokes.s1, s2: stokes.s2, s3: stokes.s3 },
      color: visual.color,
      opacity: visual.opacity,
      strokeWidth: visual.strokeWidth,
      shape: visual.shape,
    })

    // 应用 Mueller 矩阵变换
    currentState = applyElementTransform(element, currentState)

    prevX = element.worldX
    prevY = element.worldY
    prevZ = element.worldZ
  }

  // 最后一段: 从最后一个元件向前延伸
  // 沿光源到最后元件的方向延伸 1.5 个格子
  const lastX = prevX
  const lastY = prevY
  let extendX: number
  let extendY: number

  if (sorted.length > 0) {
    // 沿传播方向延伸
    const dx = prevX - lightSource.worldX
    const dy = prevY - lightSource.worldY
    const dist = Math.hypot(dx, dy)
    if (dist > 0) {
      extendX = prevX + (dx / dist) * 1.5
      extendY = prevY + (dy / dist) * 1.5
    } else {
      extendX = prevX + 1.5
      extendY = prevY
    }
  } else {
    // 无光学元件，光束向右延伸
    extendX = lastX + 3
    extendY = lastY
  }

  const visual = polarizationToVisual(currentState)
  const stokes = currentState.stokes

  segments.push({
    id: `beam-seg-${segIndex}`,
    fromX: prevX,
    fromY: prevY,
    fromZ: prevZ,
    toX: extendX,
    toY: extendY,
    toZ: prevZ,
    stokes: { s0: stokes.s0, s1: stokes.s1, s2: stokes.s2, s3: stokes.s3 },
    color: visual.color,
    opacity: visual.opacity,
    strokeWidth: visual.strokeWidth,
    shape: visual.shape,
  })

  return segments
}

/**
 * 对偏振态应用光学元件的 Mueller 矩阵变换
 *
 * 使用统一物理引擎的 MuellerMatrix 工厂方法:
 * - 偏振片: MuellerMatrix.linearPolarizer(angle)
 * - 波片: MuellerMatrix.waveplate(retardation, fastAxis)
 */
function applyElementTransform(
  element: SceneElement,
  state: PolarizationState,
): PolarizationState {
  const stokes = state.stokes
  const stokesVec: [number, number, number, number] = [stokes.s0, stokes.s1, stokes.s2, stokes.s3]

  let mueller: MuellerMatrix

  switch (element.type) {
    case 'polarizer': {
      // 偏振片: 使用传输轴角度
      const angle = (element.properties.transmissionAxis as number) ?? element.rotation ?? 0
      mueller = MuellerMatrix.linearPolarizer(angle)
      break
    }
    case 'waveplate': {
      // 波片: 使用相位延迟和快轴角度
      const retardation = (element.properties.retardation as number) ?? 90
      const fastAxis = (element.properties.fastAxis as number) ?? element.rotation ?? 0
      mueller = MuellerMatrix.waveplate(retardation, fastAxis)
      break
    }
    default:
      return state
  }

  // 应用 Mueller 矩阵到 Stokes 向量
  const result = mueller.apply(stokesVec)
  return PolarizationState.fromStokes(result[0], result[1], result[2], result[3])
}

// ── Hook ──────────────────────────────────────────────────────────────

/**
 * useBeamPhysics -- 光束物理计算 Hook
 *
 * 当场景元素变化时，同步重新计算光束路径和偏振态。
 * 计算在 useMemo 中完成，对 3-5 个元件远低于 16ms。
 * 结果写入 store 的 beamSegments 以供渲染使用。
 */
export function useBeamPhysics() {
  const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)
  const setBeamSegments = useOdysseyWorldStore((s) => s.setBeamSegments)

  const beamSegments = useMemo(() => {
    if (sceneElements.length === 0) return []

    const segments = calculateBeamPath(sceneElements)

    // 写入 store 供其他组件使用
    // 使用 queueMicrotask 避免在渲染期间更新 store
    queueMicrotask(() => {
      setBeamSegments(segments)
    })

    return segments
  }, [sceneElements, setBeamSegments])

  return { beamSegments }
}
