/**
 * ElementPalette.tsx -- 场景内光学元件架 (diegetic equipment shelf)
 *
 * 在场景左下角渲染一个等距风格的设备架。
 * Phase 3 扩展:
 * - 每个区域显示不同的基础工具 (来自 regionDef.paletteItems)
 * - 发现驱动的面板扩充: 某些发现解锁新工具 (DISC-02 隐形门禁)
 * - 无 "锁定" 可见状态 -- 工具随发现自然出现
 *
 * 拖拽元素从架子上取出时，创建新 SceneElement 并进入拖拽模式。
 * 纯 SVG 渲染，无文字标签 (diegetic 设计)。
 */

import React, { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useOdysseyWorldStore, type SceneElement, type SceneElementType } from '@/stores/odysseyWorldStore'
import { getRegionDefinition } from './regions/regionRegistry'
import { PALETTE_ENRICHMENTS } from './regions/regionRegistry'

// ── 元件模板定义 ─────────────────────────────────────────────────────

export interface PaletteItemDef {
  type: SceneElementType
  properties: Record<string, number | string | boolean>
  /** 架子上的相对偏移位置 */
  offsetX: number
  offsetY: number
}

// ── 类型到默认属性的映射 ─────────────────────────────────────────────

/** 为面板类型创建默认属性 */
function getDefaultProperties(type: SceneElementType): Record<string, number | string | boolean> {
  switch (type) {
    case 'polarizer':
      return { transmissionAxis: 0, type: 'linear' }
    case 'waveplate':
      return { retardation: 90, fastAxis: 0, type: 'quarter-wave' }
    case 'prism':
      return { prismAngle: 45, refractiveIndex: 1.52 }
    case 'environment':
      return { medium: 'glass', refractiveIndex: 1.52 }
    default:
      return {}
  }
}

// ── 缩略造型组件 ─────────────────────────────────────────────────────

/** 偏振片缩略图: 小矩形 + 3 条平行线 */
function MiniPolarizer() {
  return (
    <g>
      <rect x={-8} y={-10} width={16} height={16} rx={1.5} fill="#E8EDF4" stroke="#8898B0" strokeWidth={0.8} opacity={0.85} />
      {[-5, -1, 3].map((offset) => (
        <line key={offset} x1={-4} y1={offset} x2={4} y2={offset} stroke="#6880A0" strokeWidth={0.5} opacity={0.4} />
      ))}
    </g>
  )
}

/** 四分之一波片缩略图: 小矩形 + 对角线 */
function MiniQWP() {
  return (
    <g>
      <rect x={-8} y={-10} width={16} height={16} rx={1.5} fill="#F0E8F4" stroke="#9878B0" strokeWidth={0.8} opacity={0.85} />
      {[-5, -1, 3].map((offset) => (
        <line key={offset} x1={-4} y1={offset - 2} x2={4} y2={offset + 2} stroke="#8060A0" strokeWidth={0.5} opacity={0.35} />
      ))}
    </g>
  )
}

/** 半波片缩略图: 小矩形 + 双对角线 (更粗) */
function MiniHWP() {
  return (
    <g>
      <rect x={-8} y={-10} width={16} height={16} rx={1.5} fill="#F0E8F4" stroke="#9878B0" strokeWidth={0.8} opacity={0.85} />
      {[-5, -1, 3].map((offset) => (
        <g key={offset}>
          <line x1={-4} y1={offset - 2} x2={4} y2={offset + 2} stroke="#8060A0" strokeWidth={0.8} opacity={0.35} />
          <line x1={-4} y1={offset} x2={4} y2={offset + 4} stroke="#8060A0" strokeWidth={0.5} opacity={0.2} />
        </g>
      ))}
    </g>
  )
}

/** 检偏器缩略图: 和偏振片类似但颜色偏暖 */
function MiniAnalyzer() {
  return (
    <g>
      <rect x={-8} y={-10} width={16} height={16} rx={1.5} fill="#F4EDE8" stroke="#B09878" strokeWidth={0.8} opacity={0.85} />
      {[-5, -1, 3].map((offset) => (
        <line key={offset} x1={-4} y1={offset} x2={4} y2={offset} stroke="#A08060" strokeWidth={0.5} opacity={0.4} />
      ))}
    </g>
  )
}

/** 棱镜缩略图: 三角形 */
function MiniPrism() {
  return (
    <g>
      <polygon points="0,-10 8,6 -8,6" fill="#E8F0E8" stroke="#78A078" strokeWidth={0.8} opacity={0.85} />
      <line x1={0} y1={-6} x2={0} y2={4} stroke="#60A060" strokeWidth={0.5} opacity={0.3} />
    </g>
  )
}

/** 环境介质缩略图: 圆形 */
function MiniEnvironment() {
  return (
    <g>
      <circle cx={0} cy={-2} r={7} fill="#E8F4F0" stroke="#78A8B0" strokeWidth={0.8} opacity={0.85} />
      <line x1={-4} y1={-2} x2={4} y2={-2} stroke="#60A0A8" strokeWidth={0.5} opacity={0.3} />
      <line x1={0} y1={-6} x2={0} y2={2} stroke="#60A0A8" strokeWidth={0.5} opacity={0.3} />
    </g>
  )
}

/** 根据面板项定义选择缩略造型 */
function MiniShapeForType({ def }: { def: PaletteItemDef }) {
  switch (def.type) {
    case 'polarizer':
      if (def.properties.type === 'analyzer') return <MiniAnalyzer />
      return <MiniPolarizer />
    case 'waveplate':
      if ((def.properties.retardation as number) === 180) return <MiniHWP />
      return <MiniQWP />
    case 'prism':
      return <MiniPrism />
    case 'environment':
      return <MiniEnvironment />
    default:
      return <MiniPolarizer />
  }
}

// ── 单个拖拽项 ───────────────────────────────────────────────────────

interface PaletteItemProps {
  def: PaletteItemDef
  index: number
}

const PaletteItem = React.memo(function PaletteItem({ def, index }: PaletteItemProps) {
  const addElement = useOdysseyWorldStore((s) => s.addElement)
  const selectElement = useOdysseyWorldStore((s) => s.selectElement)
  const setInteractionMode = useOdysseyWorldStore((s) => s.setInteractionMode)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()

      // 创建新元素
      const newElement: SceneElement = {
        id: `${def.type}-${Date.now().toString(36)}`,
        type: def.type,
        worldX: -1, // 临时位置 (拖拽中会更新)
        worldY: -1,
        worldZ: 0,
        rotation: 0,
        properties: { ...def.properties },
      }

      // 添加到场景并选中
      addElement(newElement)
      selectElement(newElement.id)
      setInteractionMode('drag')
    },
    [def, addElement, selectElement, setInteractionMode],
  )

  return (
    <motion.g
      transform={`translate(${def.offsetX}, ${def.offsetY})`}
      style={{ cursor: 'grab' }}
      onPointerDown={handlePointerDown}
      animate={{ scale: [1, 1.03, 1] }}
      transition={{
        repeat: Infinity,
        duration: 3 + index * 0.5, // 每个元素略有不同的周期
        ease: 'easeInOut',
      }}
    >
      <MiniShapeForType def={def} />
    </motion.g>
  )
})

// ── 主组件: 设备架 ───────────────────────────────────────────────────

/**
 * ElementPalette -- 场景内设备架
 *
 * Phase 3: 根据活跃区域显示不同的基础工具 + 发现驱动的扩充工具。
 * 无 "锁定" 可见状态 -- 工具随发现自然出现 (DISC-02 隐形门禁)。
 *
 * 渲染为 SVG 组，定位在场景左下角。
 * 等距风格的木质架子，上面摆放可拖拽光学元件缩略图。
 */
export const ElementPalette = React.memo(function ElementPalette() {
  const activeRegionId = useOdysseyWorldStore((s) => s.activeRegionId)
  const achievedDiscoveries = useOdysseyWorldStore((s) => s.achievedDiscoveries)

  // 计算面板内容: 基础工具 + 发现解锁的扩充工具
  const paletteItems = useMemo(() => {
    const regionDef = getRegionDefinition(activeRegionId)
    if (!regionDef) return []

    // 基础工具 (来自区域定义)
    const baseItems: PaletteItemDef[] = regionDef.paletteItems.map((type, i) => ({
      type,
      properties: getDefaultProperties(type),
      offsetX: i * 32,
      offsetY: 0,
    }))

    // 发现扩充工具 (隐形门禁: 只在发现达成后出现)
    const enrichedItems: PaletteItemDef[] = []
    for (const enrichment of PALETTE_ENRICHMENTS) {
      if (
        enrichment.targetRegionId === activeRegionId &&
        achievedDiscoveries.has(enrichment.requiredDiscoveryId)
      ) {
        // 避免与基础工具重复 (相同 type + 相同关键属性)
        const isDuplicate = baseItems.some(
          (item) =>
            item.type === enrichment.elementType &&
            item.properties.type === enrichment.properties.type,
        )
        if (!isDuplicate) {
          enrichedItems.push({
            type: enrichment.elementType,
            properties: { ...enrichment.properties },
            offsetX: (baseItems.length + enrichedItems.length) * 32,
            offsetY: 0,
          })
        }
      }
    }

    return [...baseItems, ...enrichedItems]
  }, [activeRegionId, achievedDiscoveries])

  // 架子宽度根据面板项数量动态调整
  const shelfWidth = Math.max(132, paletteItems.length * 32 + 20)

  return (
    <g className="element-palette" transform="translate(-600, 680)">
      {/* 架子背景: 等距木质感 */}
      <g opacity={0.6}>
        {/* 架面 (等距梯形) */}
        <polygon
          points={`-12,-16 ${shelfWidth - 12},-16 ${shelfWidth - 4},-8 -4,-8`}
          fill="#C4B89C"
          stroke="#A89878"
          strokeWidth={0.8}
        />
        {/* 架面纹理线 */}
        {Array.from({ length: Math.ceil(shelfWidth / 30) }, (_, i) => i * 30).map((x) => (
          <line
            key={x}
            x1={x - 8}
            y1={-15}
            x2={x - 2}
            y2={-9}
            stroke="#B8A880"
            strokeWidth={0.4}
            opacity={0.3}
          />
        ))}
        {/* 架子前板 */}
        <rect x={-4} y={-8} width={shelfWidth} height={8} rx={1} fill="#B8A480" opacity={0.5} />
        {/* 支腿 */}
        <rect x={0} y={0} width={4} height={12} rx={0.5} fill="#A89878" opacity={0.4} />
        <rect x={shelfWidth - 12} y={0} width={4} height={12} rx={0.5} fill="#A89878" opacity={0.4} />
      </g>

      {/* 元件缩略图 (定位在架面上方) */}
      <g transform="translate(12, -24)">
        {paletteItems.map((item, i) => (
          <PaletteItem key={`palette-${activeRegionId}-${item.type}-${i}`} def={item} index={i} />
        ))}
      </g>
    </g>
  )
})
