/**
 * Decoration.tsx -- 装饰元素渲染组件
 *
 * 渲染非交互式的场景装饰物 (植物、水晶展示、透镜架、测量仪表等)。
 * 每种装饰类型有独特的 SVG 造型。
 * 使用 Framer Motion 的轻微浮动动画暗示场景活力。
 */

import React from 'react'
import { motion } from 'framer-motion'
import { worldToScreen } from '@/lib/isometric'
import type { SceneElement } from '@/stores/odysseyWorldStore'

interface DecorationProps {
  element: SceneElement
}

/** 基于元素 ID 生成确定性浮动时长 (2.5–4.5s)，避免所有装饰同步浮动 */
function getFloatDuration(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return 2.5 + (Math.abs(hash) % 200) / 100
}

/** 基于元素 ID 生成确定性起始延迟 (0–2s)，错开动画起点 */
function getFloatDelay(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 37 + id.charCodeAt(i)) | 0
  return (Math.abs(hash) % 200) / 100
}

/** 生成每个装饰元素独特的浮动动画配置 */
function getFloatTransition(id: string) {
  return {
    y: {
      repeat: Infinity,
      repeatType: 'reverse' as const,
      duration: getFloatDuration(id),
      ease: 'easeInOut' as const,
      delay: getFloatDelay(id),
    },
  }
}

/**
 * 透镜架装饰 -- 横向杆上有圆形透镜
 */
function LensStandShape() {
  return (
    <g>
      {/* 支架底座 */}
      <rect x={-12} y={2} width={24} height={4} rx={1} fill="#B8AFA6" />
      {/* 支撑杆 */}
      <rect x={-1} y={-16} width={2} height={18} fill="#C4BAB0" />
      {/* 透镜 (圆形) */}
      <circle cx={0} cy={-18} r={7} fill="none" stroke="#88B4D8" strokeWidth={2} opacity={0.7} />
      <circle cx={0} cy={-18} r={4} fill="#D0E4F4" opacity={0.3} />
    </g>
  )
}

/**
 * 水晶簇装饰 -- 几何棱柱形状
 */
function CrystalClusterShape() {
  return (
    <g>
      {/* 大水晶 */}
      <polygon points="0,-22 6,-6 -6,-6" fill="#C8B8E8" opacity={0.7} />
      <polygon points="0,-22 6,-6 3,-4" fill="#B0A0D8" opacity={0.6} />
      {/* 小水晶 */}
      <polygon points="-8,-14 -4,-4 -12,-4" fill="#D4C8F0" opacity={0.6} />
      {/* 底座阴影 */}
      <ellipse cx={0} cy={-2} rx={10} ry={3} fill="#8878B0" opacity={0.12} />
    </g>
  )
}

/**
 * 棱镜展示装饰 -- 三棱镜造型
 */
function PrismDisplayShape() {
  return (
    <g>
      {/* 三棱镜 */}
      <polygon points="0,-18 10,-2 -10,-2" fill="#E0E8F0" stroke="#B0B8C4" strokeWidth={0.8} opacity={0.8} />
      {/* 彩虹色散效果 (装饰性) */}
      <line x1={10} y1={-4} x2={18} y2={-10} stroke="#FF6B6B" strokeWidth={1} opacity={0.3} />
      <line x1={10} y1={-3} x2={19} y2={-7} stroke="#FFD93D" strokeWidth={1} opacity={0.3} />
      <line x1={10} y1={-2} x2={20} y2={-4} stroke="#6BCB77" strokeWidth={1} opacity={0.3} />
      {/* 底座 */}
      <rect x={-8} y={-2} width={16} height={3} rx={1} fill="#C4C0B8" opacity={0.5} />
    </g>
  )
}

/**
 * 笔记本装饰 -- 实验笔记本造型
 */
function NotebookShape() {
  return (
    <g>
      {/* 笔记本 */}
      <rect x={-10} y={-6} width={20} height={14} rx={1} fill="#F5F0E8" stroke="#D4CFC6" strokeWidth={0.8} />
      {/* 页面线条 */}
      <line x1={-7} y1={-2} x2={7} y2={-2} stroke="#D4CFC6" strokeWidth={0.4} />
      <line x1={-7} y1={1} x2={5} y2={1} stroke="#D4CFC6" strokeWidth={0.4} />
      <line x1={-7} y1={4} x2={6} y2={4} stroke="#D4CFC6" strokeWidth={0.4} />
      {/* 装订线 */}
      <line x1={-10} y1={-5} x2={-10} y2={7} stroke="#B8AFA6" strokeWidth={1.5} />
    </g>
  )
}

/**
 * 装饰元素组件
 *
 * 根据 variant 属性渲染不同的 SVG 造型，
 * 整体施加轻微浮动动画。
 */
const Decoration = React.memo(function Decoration({ element }: DecorationProps) {
  const screen = worldToScreen(element.worldX, element.worldY)
  const variant = element.properties.variant as string

  // 选择装饰类型
  let shape: React.ReactNode
  switch (variant) {
    case 'lens-stand':
      shape = <LensStandShape />
      break
    case 'crystal-cluster':
      shape = <CrystalClusterShape />
      break
    case 'prism-display':
      shape = <PrismDisplayShape />
      break
    case 'notebook':
      shape = <NotebookShape />
      break
    default:
      // 默认: 小圆点装饰
      shape = <circle cx={0} cy={0} r={4} fill="#D4CFC6" opacity={0.4} />
  }

  return (
    <motion.g
      transform={`translate(${screen.x}, ${screen.y})`}
      animate={{ y: [0, -3, 0] }}
      transition={getFloatTransition(element.id)}
    >
      <g transform={`rotate(${element.rotation})`}>
        {shape}
      </g>
    </motion.g>
  )
})

export { Decoration }
