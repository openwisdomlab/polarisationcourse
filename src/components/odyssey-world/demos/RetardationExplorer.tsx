/**
 * RetardationExplorer.tsx -- 相位延迟交互式探索器
 *
 * 轻量级 SVG 可视化 (深度面板嵌入):
 * - 入射线偏振光 + 波片符号 + 输出偏振椭圆
 * - 延迟角度滑块 (0-360): 输出椭圆在线/椭圆/圆之间连续变化
 * - 通过 useDemoSync 同步延迟参数到世界波片元素
 */

import { useState, useMemo } from 'react'
import { useDemoSync } from '@/components/odyssey-world/depth/hooks/useDemoSync'

interface RetardationExplorerProps {
  conceptId: string
  regionId: string
}

/**
 * 根据延迟量计算输出偏振椭圆参数
 * 假设输入为 45 度线偏振光经过延迟量 delta 的波片:
 * - delta=0: 线偏振 (a=1, b=0)
 * - delta=90: 右圆偏振 (a=1, b=1)
 * - delta=180: 线偏振 (旋转 90 度) (a=1, b=0)
 * - delta=270: 左圆偏振 (a=1, b=1)
 */
function getEllipseParams(deltaDeg: number): { a: number; b: number; isRightHanded: boolean } {
  const rad = (deltaDeg * Math.PI) / 180
  const b = Math.abs(Math.sin(rad))
  // 0-180: right-handed; 180-360: left-handed
  const isRightHanded = deltaDeg <= 180
  return { a: 1, b, isRightHanded }
}

/** 偏振态类型标签 */
function getPolLabel(deltaDeg: number): string {
  const mod = deltaDeg % 360
  if (mod < 5 || mod > 355) return 'Linear'
  if (Math.abs(mod - 90) < 5) return 'Right Circular'
  if (Math.abs(mod - 180) < 5) return 'Linear (rotated)'
  if (Math.abs(mod - 270) < 5) return 'Left Circular'
  if (mod > 0 && mod < 90) return 'Right Elliptical'
  if (mod > 90 && mod < 180) return 'Left Elliptical'
  if (mod > 180 && mod < 270) return 'Left Elliptical'
  return 'Right Elliptical'
}

export default function RetardationExplorer({ conceptId: _conceptId, regionId: _regionId }: RetardationExplorerProps) {
  const { worldRotation, syncToWorld, syncImmediate, hasElement } = useDemoSync(
    undefined,
    'waveplate',
  )

  const [delta, setDelta] = useState(() => (hasElement ? worldRotation : 90))
  const { a, b, isRightHanded } = getEllipseParams(delta)
  const polLabel = getPolLabel(delta)

  // SVG 坐标
  const ecx = 230, ecy = 55
  const scaleA = 30 * a
  const scaleB = 30 * b
  const minB = 1

  // 状态指示器颜色
  const stateColor = b > 0.9 ? '#60a5fa' : b < 0.1 ? '#94a3b8' : '#a78bfa'

  // 进度条上的关键延迟量标记
  const progressX = (delta / 360) * 280 + 10
  const keyMarks = useMemo(() => [0, 90, 180, 270, 360].map((d) => ({
    x: (d / 360) * 280 + 10,
    label: `${d}°`,
  })), [])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setDelta(val)
    syncToWorld('retardation', val)
  }

  const handleSliderUp = () => {
    syncImmediate('retardation', delta)
  }

  return (
    <div className="space-y-4">
      {/* SVG 光路可视化 */}
      <svg viewBox="0 0 300 110" className="w-full" style={{ maxWidth: 420 }}>
        {/* 入射线偏振光 */}
        <line x1={15} y1={55} x2={85} y2={55} stroke="#94a3b8" strokeWidth={2} />
        <polygon points="83,50 93,55 83,60" fill="#94a3b8" />
        {/* 偏振方向标记 (竖线 = 线偏振) */}
        <line x1={45} y1={43} x2={45} y2={67} stroke="#94a3b8" strokeWidth={1.5} />
        <text x={45} y={38} textAnchor="middle" fill="#64748b" fontSize={8}>Linear</text>

        {/* 波片符号 (矩形) */}
        <rect x={103} y={32} width={14} height={46} rx={3} fill="#2ea8a8" fillOpacity={0.3} stroke="#2ea8a8" strokeWidth={1.5} />
        <text x={110} y={92} textAnchor="middle" fill="#5eead4" fontSize={8}>WP</text>
        <text x={110} y={102} textAnchor="middle" fill="#5eead4" fontSize={7}>{delta}°</text>

        {/* 输出光箭头 */}
        <line x1={130} y1={55} x2={185} y2={55} stroke={stateColor} strokeWidth={2} opacity={0.6} />

        {/* 输出偏振椭圆 */}
        <ellipse
          cx={ecx}
          cy={ecy}
          rx={scaleA}
          ry={Math.max(scaleB, minB)}
          fill="none"
          stroke={stateColor}
          strokeWidth={2}
        />
        {/* 旋向箭头 */}
        {b > 0.15 && (
          <path
            d={isRightHanded
              ? `M${ecx + scaleA * 0.6},${ecy - scaleB * 0.4} L${ecx + scaleA * 0.4},${ecy - scaleB * 0.7} L${ecx + scaleA * 0.8},${ecy - scaleB * 0.55}`
              : `M${ecx - scaleA * 0.6},${ecy - scaleB * 0.4} L${ecx - scaleA * 0.4},${ecy - scaleB * 0.7} L${ecx - scaleA * 0.8},${ecy - scaleB * 0.55}`
            }
            fill="none"
            stroke={stateColor}
            strokeWidth={1.2}
          />
        )}

        {/* 状态标签 */}
        <text x={ecx} y={ecy + 45} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={500}>
          {polLabel}
        </text>
      </svg>

      {/* 延迟进度条 (标记关键点) */}
      <svg viewBox="0 0 300 30" className="w-full" style={{ maxWidth: 420 }}>
        {/* 背景条 */}
        <rect x={10} y={8} width={280} height={4} rx={2} fill="#1e293b" />
        {/* 进度填充 */}
        <rect x={10} y={8} width={progressX - 10} height={4} rx={2} fill={stateColor} opacity={0.6} />
        {/* 关键延迟量标记 */}
        {keyMarks.map((m) => (
          <g key={m.label}>
            <line x1={m.x} y1={5} x2={m.x} y2={15} stroke="#475569" strokeWidth={0.5} />
            <text x={m.x} y={25} textAnchor="middle" fill="#475569" fontSize={7}>{m.label}</text>
          </g>
        ))}
        {/* 当前位置指示器 */}
        <circle cx={progressX} cy={10} r={4} fill={stateColor} />
      </svg>

      {/* 延迟滑块 */}
      <div className="flex items-center gap-3 px-1">
        <label className="text-xs text-white/50 whitespace-nowrap">Retardation</label>
        <input
          type="range"
          min={0}
          max={360}
          value={delta}
          onChange={handleSliderChange}
          onPointerUp={handleSliderUp}
          onMouseUp={handleSliderUp}
          className="flex-1 accent-teal-400"
        />
        <span className="w-10 text-right text-xs tabular-nums text-white/70">{delta}°</span>
      </div>
    </div>
  )
}
