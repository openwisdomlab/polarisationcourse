/**
 * useDiscoveryState.ts -- 发现系统状态管理 Hook
 *
 * 定义 5 个物理发现配置，每个包含:
 * - 基于 Stokes 参数的条件检查函数
 * - 环境响应描述 (类型、目标、参数)
 *
 * 发现列表:
 * 1. 马吕斯定律 (Malus's Law) -- 旋转偏振片，观察强度梯度
 * 2. 完全消光 (Crossed Polarizers) -- 两个正交偏振片消光
 * 3. 圆偏振 (Circular Polarization) -- QWP 在 45 度产生圆偏振
 * 4. 半波旋转 (Half-Wave Rotation) -- HWP 旋转偏振方向
 * 5. 三偏振片惊喜 (Three-Polarizer Surprise) -- 中间偏振片恢复光
 *
 * 同时追踪偏振编码方面的发现 (方位角、强度、椭圆度、强度-不透明度映射)。
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useOdysseyWorldStore, type SceneElement, type BeamSegment } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from '@/components/odyssey-world/regions/regionRegistry'

// ── 发现配置接口 ────────────────────────────────────────────────────────

export interface DiscoveryResponse {
  type: 'illuminate' | 'color-shift' | 'pattern' | 'particle-burst'
  target: string
  params: Record<string, number | string>
}

export interface DiscoveryConfig {
  id: string
  name: string
  check: (
    elements: SceneElement[],
    beamSegments: BeamSegment[],
    rotationHistory: Map<string, number[]>,
  ) => boolean
  response: DiscoveryResponse
}

// ── 5 个发现配置 ────────────────────────────────────────────────────────

/**
 * 发现 1: 马吕斯定律 -- 旋转偏振片超过 90 度范围，
 * 观察到至少 3 个不同强度级别的光束段。
 */
const malusLawDiscovery: DiscoveryConfig = {
  id: 'malus-law-basic',
  name: "Malus's Law",
  check: (elements, beamSegments, rotationHistory) => {
    // 需要至少 2 个偏振片
    const polarizers = elements.filter((el) => el.type === 'polarizer')
    if (polarizers.length < 2) return false

    // 检查是否有偏振片的旋转历史跨度 >= 90 度
    let hasWideRotation = false
    for (const p of polarizers) {
      const history = rotationHistory.get(p.id)
      if (history && history.length >= 2) {
        const min = Math.min(...history)
        const max = Math.max(...history)
        if (max - min >= 90) {
          hasWideRotation = true
          break
        }
      }
    }
    if (!hasWideRotation) return false

    // 检查光束段中是否有至少 3 个不同强度级别 (s0 差值 > 0.1)
    const intensities = beamSegments.map((seg) => seg.stokes.s0)
    const distinctIntensities = new Set<number>()
    for (const intensity of intensities) {
      // 量化到 0.1 精度检查差异
      let isDistinct = true
      for (const existing of distinctIntensities) {
        if (Math.abs(intensity - existing) <= 0.1) {
          isDistinct = false
          break
        }
      }
      if (isDistinct) distinctIntensities.add(intensity)
    }

    return distinctIntensities.size >= 3
  },
  response: {
    type: 'illuminate',
    target: 'discovery-area-malus',
    params: {
      color: 'hsl(45, 80%, 60%)',
      radius: 60,
      opacity: 0.35,
    },
  },
}

/**
 * 发现 2: 完全消光 -- 两个偏振片传输轴相差 85-95 度，
 * 中间光束段强度接近零 (s0 < 0.05)。
 */
const crossedPolarizerDiscovery: DiscoveryConfig = {
  id: 'crossed-polarizers',
  name: 'Complete Extinction',
  check: (elements, beamSegments) => {
    const polarizers = elements.filter((el) => el.type === 'polarizer')
    if (polarizers.length < 2) return false

    // 查找传输轴差 85-95 度的偏振片对
    for (let i = 0; i < polarizers.length; i++) {
      for (let j = i + 1; j < polarizers.length; j++) {
        const axis1 = (polarizers[i].properties.transmissionAxis as number) ?? polarizers[i].rotation
        const axis2 = (polarizers[j].properties.transmissionAxis as number) ?? polarizers[j].rotation
        let diff = Math.abs(axis1 - axis2) % 180
        if (diff > 90) diff = 180 - diff
        if (diff >= 85 && diff <= 95) {
          // 检查两个偏振片之间的光束段强度是否接近零
          const hasExtinction = beamSegments.some((seg) => seg.stokes.s0 < 0.05)
          if (hasExtinction) return true
        }
      }
    }
    return false
  },
  response: {
    type: 'pattern',
    target: 'discovery-area-extinction',
    params: {
      patternType: 'phosphorescent',
      opacity: 0.2,
      color: 'hsl(180, 60%, 70%)',
    },
  },
}

/**
 * 发现 3: 圆偏振 -- QWP (retardation=90) 的快轴与输入线偏振方向
 * 成 40-50 度角，输出具有显著圆分量 (|s3| > 0.4) 且形状为 helix。
 */
const circularPolarizationDiscovery: DiscoveryConfig = {
  id: 'circular-polarization',
  name: 'Circular Polarization',
  check: (elements, beamSegments) => {
    // 找到 QWP
    const qwps = elements.filter(
      (el) => el.type === 'waveplate' && (el.properties.retardation as number) === 90,
    )
    if (qwps.length === 0) return false

    // 检查输出光束段是否有显著圆分量
    const hasCircular = beamSegments.some(
      (seg) => Math.abs(seg.stokes.s3) > 0.4 && seg.shape === 'helix',
    )

    return hasCircular
  },
  response: {
    type: 'particle-burst',
    target: 'discovery-area-circular',
    params: {
      particleCount: 10,
      color: 'hsl(200, 70%, 65%)',
      shimmerCount: 4,
    },
  },
}

/**
 * 发现 4: 半波旋转 -- HWP (retardation=180) 在场景中，
 * 输出光束颜色与输入不同但强度相近 (|s0_out - s0_in| < 0.1)。
 */
const halfWaveRotationDiscovery: DiscoveryConfig = {
  id: 'half-wave-rotation',
  name: 'Half-Wave Rotation',
  check: (elements, beamSegments) => {
    // 找到 HWP
    const hwps = elements.filter(
      (el) => el.type === 'waveplate' && (el.properties.retardation as number) === 180,
    )
    if (hwps.length === 0) return false

    // 需要至少 2 段光束来比较输入/输出
    if (beamSegments.length < 2) return false

    // 找到 HWP 前后的光束段，检查颜色变化但强度保持
    for (let i = 0; i < beamSegments.length - 1; i++) {
      const inputSeg = beamSegments[i]
      const outputSeg = beamSegments[i + 1]
      const intensityDiff = Math.abs(outputSeg.stokes.s0 - inputSeg.stokes.s0)
      const colorChanged = inputSeg.color !== outputSeg.color

      if (colorChanged && intensityDiff < 0.1) return true
    }

    return false
  },
  response: {
    type: 'color-shift',
    target: 'discovery-area-hwp',
    params: {
      color: 'hsl(270, 50%, 60%)',
      duration: 1,
      opacity: 0.25,
    },
  },
}

/**
 * 发现 5: 三偏振片惊喜 -- 3 个偏振片，首尾正交 (85-95 度差),
 * 中间偏振片角度居中，最终光束段强度 > 0.05。
 */
const threePolarizeSurpriseDiscovery: DiscoveryConfig = {
  id: 'three-polarizer-surprise',
  name: 'Three-Polarizer Surprise',
  check: (elements, beamSegments) => {
    const polarizers = elements.filter((el) => el.type === 'polarizer')
    if (polarizers.length !== 3) return false

    // 按距光源排序
    const lightSource = elements.find((el) => el.type === 'light-source')
    if (!lightSource) return false

    const sorted = [...polarizers].sort((a, b) => {
      const distA = Math.hypot(a.worldX - lightSource.worldX, a.worldY - lightSource.worldY)
      const distB = Math.hypot(b.worldX - lightSource.worldX, b.worldY - lightSource.worldY)
      return distA - distB
    })

    // 首尾偏振片必须正交 (85-95 度差)
    const firstAxis = (sorted[0].properties.transmissionAxis as number) ?? sorted[0].rotation
    const lastAxis = (sorted[2].properties.transmissionAxis as number) ?? sorted[2].rotation
    let diff = Math.abs(firstAxis - lastAxis) % 180
    if (diff > 90) diff = 180 - diff
    if (diff < 85 || diff > 95) return false

    // 中间偏振片角度必须在首尾之间 (不与任一平行)
    const midAxis = (sorted[1].properties.transmissionAxis as number) ?? sorted[1].rotation
    let diffFirst = Math.abs(midAxis - firstAxis) % 180
    if (diffFirst > 90) diffFirst = 180 - diffFirst
    let diffLast = Math.abs(midAxis - lastAxis) % 180
    if (diffLast > 90) diffLast = 180 - diffLast
    // 中间偏振片不应与任一端平行或正交
    if (diffFirst < 5 || diffFirst > 85 || diffLast < 5 || diffLast > 85) return false

    // 最终光束段强度必须 > 0.05 (光被恢复!)
    const lastSegment = beamSegments[beamSegments.length - 1]
    if (!lastSegment) return false

    return lastSegment.stokes.s0 > 0.05
  },
  response: {
    type: 'illuminate',
    target: 'discovery-area-surprise',
    params: {
      color: 'hsl(50, 90%, 70%)',
      radius: 100,
      opacity: 0.4,
    },
  },
}

// ── 发现配置列表 ────────────────────────────────────────────────────────

export const DISCOVERY_CONFIGS: DiscoveryConfig[] = [
  malusLawDiscovery,
  crossedPolarizerDiscovery,
  circularPolarizationDiscovery,
  halfWaveRotationDiscovery,
  threePolarizeSurpriseDiscovery,
]

// ── Hook ────────────────────────────────────────────────────────────────

export interface UseDiscoveryStateReturn {
  achievedDiscoveries: Set<string>
  newlyAchieved: string | null
  discoveryConfigs: DiscoveryConfig[]
}

/**
 * useDiscoveryState -- 发现系统状态 Hook
 *
 * 订阅场景元素和光束段变化，检查发现条件。
 * 节流检查频率为最多每 200ms 一次，避免高频更新。
 * 同时追踪偏振编码方面的发现 (延迟 1 秒后触发)。
 */
export function useDiscoveryState(): UseDiscoveryStateReturn {
  const sceneElements = useOdysseyWorldStore((s) => s.sceneElements)
  const beamSegments = useOdysseyWorldStore((s) => s.beamSegments)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)
  const rotationHistory = useOdysseyWorldStore((s) => s.rotationHistory)
  const discoveredEncodings = useOdysseyWorldStore((s) => s.discoveredEncodings)

  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)

  const [newlyAchieved, setNewlyAchieved] = useState<string | null>(null)

  // 获取当前区域的发现配置 (Phase 3: 每个区域有自己的发现列表)
  const regionDiscoveryConfigs = useMemo(() => {
    const regionDef = getRegionDefinition(activeRegionId)
    // 使用区域定义的发现列表；如果区域无定义则回退到全局配置 (Crystal Lab 包含所有 Phase 2 发现)
    return regionDef?.discoveries ?? DISCOVERY_CONFIGS
  }, [activeRegionId])

  // 节流 ref: 避免每帧都检查发现条件
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const encodingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 发现条件检查 (节流 200ms, 使用当前区域的发现配置)
  const checkDiscoveries = useCallback(() => {
    const store = useOdysseyWorldStore.getState()
    const elements = store.sceneElements
    const segments = store.beamSegments
    const history = store.rotationHistory
    const achieved = store.achievedDiscoveries

    // 使用区域特定的发现配置
    const regionDef = getRegionDefinition(store.activeRegionId)
    const configs = regionDef?.discoveries ?? DISCOVERY_CONFIGS

    for (const config of configs) {
      if (achieved.has(config.id)) continue

      try {
        if (config.check(elements, segments, history)) {
          store.achieveDiscovery(config.id)
          setNewlyAchieved(config.id)
          // 500ms 后清除 newlyAchieved
          setTimeout(() => setNewlyAchieved(null), 500)
          break // 每次最多触发一个发现
        }
      } catch {
        // 发现检查出错不影响主流程
      }
    }
  }, [])

  // 编码发现检查 (延迟 1 秒)
  const checkEncodings = useCallback(() => {
    const store = useOdysseyWorldStore.getState()
    const segments = store.beamSegments
    const encodings = store.discoveredEncodings

    if (segments.length === 0) return

    // 方位角编码: 光束颜色变化 (检查是否有不同色调)
    if (!encodings.orientation) {
      const colors = new Set(segments.map((seg) => seg.color))
      if (colors.size >= 2) {
        store.discoverEncoding('orientation')
      }
    }

    // 强度编码: 光束不透明度低于 0.5
    if (!encodings.intensity) {
      const hasLowOpacity = segments.some((seg) => seg.opacity < 0.5)
      if (hasLowOpacity) {
        store.discoverEncoding('intensity')
      }
    }

    // 椭圆度编码: 光束形状变为 helix
    if (!encodings.ellipticity) {
      const hasHelix = segments.some((seg) => seg.shape === 'helix')
      if (hasHelix) {
        store.discoverEncoding('ellipticity')
      }
    }

    // 强度-不透明度映射: 不同段有不同不透明度
    if (!encodings.intensityOpacity) {
      const opacities = segments.map((seg) => seg.opacity)
      if (opacities.length >= 2) {
        const min = Math.min(...opacities)
        const max = Math.max(...opacities)
        if (max - min > 0.15) {
          store.discoverEncoding('intensityOpacity')
        }
      }
    }
  }, [])

  // 监听场景变化，节流检查发现
  useEffect(() => {
    if (sceneElements.length === 0 || beamSegments.length === 0) return

    // 发现检查: 节流 200ms
    if (throttleRef.current) clearTimeout(throttleRef.current)
    throttleRef.current = setTimeout(() => {
      checkDiscoveries()
    }, 200)

    // 编码发现: 延迟 1 秒
    if (encodingTimerRef.current) clearTimeout(encodingTimerRef.current)
    encodingTimerRef.current = setTimeout(() => {
      checkEncodings()
    }, 1000)

    return () => {
      if (throttleRef.current) clearTimeout(throttleRef.current)
      if (encodingTimerRef.current) clearTimeout(encodingTimerRef.current)
    }
  }, [sceneElements, beamSegments, rotationHistory, discoveredEncodings, checkDiscoveries, checkEncodings])

  return {
    achievedDiscoveries,
    newlyAchieved,
    discoveryConfigs: regionDiscoveryConfigs,
  }
}
