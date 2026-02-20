/**
 * CircularPolExplorer.tsx -- 圆偏振交互式探索器
 *
 * 轻量级 SVG 可视化 (深度面板嵌入):
 * - 线偏振光进入四分之一波片，输出偏振椭圆/圆可视化
 * - QWP 快轴角度滑块 (0-180): 0=线偏振, 45=圆偏振, 其他=椭圆
 * - 通过 useDemoSync 同步 fastAxis 到世界场景波片元素
 */

import { useState } from 'react'
import { useDemoSync } from '@/components/odyssey-world/depth/hooks/useDemoSync'

interface CircularPolExplorerProps {
  conceptId: string
  regionId: string
}

/**
 * 计算偏振椭圆参数
 * 线偏振沿 x 方向 (0,0) 经过快轴角度为 alpha 的 QWP 后:
 * - alpha=0: 线偏振 (a=1, b=0)
 * - alpha=45: 圆偏振 (a=1, b=1)
 * - 其他: 椭圆偏振
 */
function getEllipseParams(alphaDeg: number): { a: number; b: number; rotation: number } {
  const alpha = (alphaDeg * Math.PI) / 180
  // 简化计算: 椭圆短半轴 = |sin(2*alpha)|, 长半轴 = 1
  const b = Math.abs(Math.sin(2 * alpha))
  return { a: 1, b, rotation: alphaDeg }
}

export default function CircularPolExplorer({ conceptId: _conceptId, regionId: _regionId }: CircularPolExplorerProps) {
  const { worldRotation, syncToWorld, syncImmediate, hasElement } = useDemoSync(
    undefined,
    'waveplate',
  )

  const [angle, setAngle] = useState(() => (hasElement ? worldRotation : 45))
  const { a, b } = getEllipseParams(angle)

  // 偏振类型标签
  const polLabel = b < 0.05 ? 'Linear' : b > 0.95 ? 'Circular' : 'Elliptical'

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setAngle(val)
    syncToWorld('fastAxis', val)
  }

  const handleSliderUp = () => {
    syncImmediate('fastAxis', angle)
  }

  // 椭圆绘制参数 (SVG 坐标)
  const ecx = 220, ecy = 60
  const scaleA = 35 * a
  const scaleB = 35 * b
  const minB = 1 // 线偏振时最小可见宽度

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 120" className="w-full" style={{ maxWidth: 420 }}>
        {/* 入射线偏振光 */}
        <line x1={15} y1={60} x2={90} y2={60} stroke="#94a3b8" strokeWidth={2} />
        <polygon points="88,55 98,60 88,65" fill="#94a3b8" />
        {/* 偏振方向标记 (竖线) */}
        <line x1={50} y1={48} x2={50} y2={72} stroke="#94a3b8" strokeWidth={1.5} />

        {/* QWP 元素 */}
        <rect x={108} y={35} width={14} height={50} rx={3} fill="#7c3aed" fillOpacity={0.3} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={115} y={100} textAnchor="middle" fill="#a78bfa" fontSize={8}>QWP</text>
        {/* 快轴指示线 */}
        <line
          x1={115 - 18 * Math.cos((angle * Math.PI) / 180)}
          y1={60 - 18 * Math.sin((angle * Math.PI) / 180)}
          x2={115 + 18 * Math.cos((angle * Math.PI) / 180)}
          y2={60 + 18 * Math.sin((angle * Math.PI) / 180)}
          stroke="#c084fc"
          strokeWidth={1.5}
          strokeDasharray="3,2"
        />

        {/* 输出光箭头 */}
        <line x1={135} y1={60} x2={175} y2={60} stroke="#60a5fa" strokeWidth={2} opacity={0.6} />

        {/* 输出偏振椭圆 */}
        <ellipse
          cx={ecx}
          cy={ecy}
          rx={scaleA}
          ry={Math.max(scaleB, minB)}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={2}
        />
        {/* 旋向箭头 (当椭圆足够大时显示) */}
        {b > 0.1 && (
          <path
            d={`M${ecx + scaleA * 0.7},${ecy - scaleB * 0.3} L${ecx + scaleA * 0.5},${ecy - scaleB * 0.6} L${ecx + scaleA * 0.9},${ecy - scaleB * 0.5}`}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={1.2}
          />
        )}

        {/* 状态标签 */}
        <text x={ecx} y={ecy + 50} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={500}>
          {polLabel}
        </text>
      </svg>

      {/* 快轴角度滑块 */}
      <div className="flex items-center gap-3 px-1">
        <label className="text-xs text-white/50 whitespace-nowrap">Fast axis</label>
        <input
          type="range"
          min={0}
          max={180}
          value={angle}
          onChange={handleSliderChange}
          onPointerUp={handleSliderUp}
          onMouseUp={handleSliderUp}
          className="flex-1 accent-violet-400"
        />
        <span className="w-10 text-right text-xs tabular-nums text-white/70">{angle}deg</span>
      </div>
    </div>
  )
}
