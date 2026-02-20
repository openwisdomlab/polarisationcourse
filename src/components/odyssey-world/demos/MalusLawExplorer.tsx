/**
 * MalusLawExplorer.tsx -- 马吕斯定律交互式探索器
 *
 * 轻量级 SVG 可视化 (深度面板嵌入):
 * - 入射偏振光箭头 + 可旋转偏振片 + 透射光箭头 (强度 = cos^2 theta)
 * - 实时 I/I0 = cos^2(theta) 曲线图，当前角度标记点
 * - 角度滑块 (0-360) 驱动 SVG 和世界同步
 *
 * 通过 useDemoSync 将滑块角度同步到世界场景偏振片旋转。
 */

import { useState, useMemo } from 'react'
import { useDemoSync } from '@/components/odyssey-world/depth/hooks/useDemoSync'

interface MalusLawExplorerProps {
  conceptId: string
  regionId: string
}

/** 马吕斯定律: I = I0 * cos^2(theta) */
function malusIntensity(angleDeg: number): number {
  const rad = (angleDeg * Math.PI) / 180
  return Math.cos(rad) ** 2
}

export default function MalusLawExplorer({ conceptId: _conceptId, regionId: _regionId }: MalusLawExplorerProps) {
  const { worldRotation, syncToWorld, syncImmediate, hasElement } = useDemoSync(
    undefined,
    'polarizer',
  )

  // 本地角度 (初始化为世界偏振片角度，若无则 0)
  const [angle, setAngle] = useState(() => (hasElement ? worldRotation : 0))
  const intensity = malusIntensity(angle)

  // cos^2 曲线采样点 (0-360 度，步长 2)
  const curvePath = useMemo(() => {
    const points: string[] = []
    for (let deg = 0; deg <= 360; deg += 2) {
      const x = (deg / 360) * 280 + 10
      const y = 130 - malusIntensity(deg) * 110
      points.push(`${x},${y}`)
    }
    return `M${points.join(' L')}`
  }, [])

  // 当前角度在曲线上的位置
  const dotX = (angle / 360) * 280 + 10
  const dotY = 130 - intensity * 110

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setAngle(val)
    syncToWorld('transmissionAxis', val)
  }

  const handleSliderUp = () => {
    syncImmediate('transmissionAxis', angle)
  }

  // 偏振片可视化参数
  const polarizerAngleRad = (angle * Math.PI) / 180
  const lineLen = 30
  const cx = 150, cy = 60

  return (
    <div className="space-y-4">
      {/* SVG 偏振片可视化 */}
      <svg viewBox="0 0 300 120" className="w-full" style={{ maxWidth: 420 }}>
        {/* 入射光箭头 */}
        <line x1={20} y1={60} x2={110} y2={60} stroke="#94a3b8" strokeWidth={2.5} />
        <polygon points="108,55 118,60 108,65" fill="#94a3b8" />
        <text x={60} y={50} textAnchor="middle" fill="#64748b" fontSize={9}>
          I&#x2080;
        </text>

        {/* 偏振片 (旋转线段) */}
        <g>
          <circle cx={cx} cy={cy} r={24} fill="none" stroke="#475569" strokeWidth={1} strokeDasharray="3,3" />
          <line
            x1={cx - lineLen * Math.cos(polarizerAngleRad)}
            y1={cy - lineLen * Math.sin(polarizerAngleRad)}
            x2={cx + lineLen * Math.cos(polarizerAngleRad)}
            y2={cy + lineLen * Math.sin(polarizerAngleRad)}
            stroke="#f59e0b"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <text x={cx} y={100} textAnchor="middle" fill="#94a3b8" fontSize={9}>
            {angle}deg
          </text>
        </g>

        {/* 透射光箭头 (强度 = opacity + 线宽) */}
        <line
          x1={185}
          y1={60}
          x2={275}
          y2={60}
          stroke="#f59e0b"
          strokeWidth={1.5 + intensity * 2.5}
          opacity={0.15 + intensity * 0.85}
        />
        <polygon
          points="273,55 283,60 273,65"
          fill="#f59e0b"
          opacity={0.15 + intensity * 0.85}
        />
        <text x={230} y={50} textAnchor="middle" fill="#94a3b8" fontSize={9}>
          I = {(intensity * 100).toFixed(0)}%
        </text>
      </svg>

      {/* cos^2 曲线图 */}
      <svg viewBox="0 0 300 150" className="w-full" style={{ maxWidth: 420 }}>
        {/* 坐标轴 */}
        <line x1={10} y1={130} x2={290} y2={130} stroke="#334155" strokeWidth={1} />
        <line x1={10} y1={20} x2={10} y2={130} stroke="#334155" strokeWidth={1} />

        {/* 轴标签 */}
        <text x={150} y={148} textAnchor="middle" fill="#64748b" fontSize={9}>theta (deg)</text>
        <text x={8} y={16} textAnchor="middle" fill="#64748b" fontSize={8}>I/I&#x2080;</text>

        {/* 刻度 */}
        {[0, 90, 180, 270, 360].map((d) => (
          <text key={d} x={(d / 360) * 280 + 10} y={142} textAnchor="middle" fill="#475569" fontSize={7}>
            {d}
          </text>
        ))}
        {[0, 0.5, 1].map((v) => (
          <text key={v} x={6} y={130 - v * 110 + 3} textAnchor="end" fill="#475569" fontSize={7}>
            {v}
          </text>
        ))}

        {/* cos^2 曲线 */}
        <path d={curvePath} fill="none" stroke="#60a5fa" strokeWidth={1.5} opacity={0.7} />

        {/* 当前角度标记 */}
        <line x1={dotX} y1={130} x2={dotX} y2={dotY} stroke="#f59e0b" strokeWidth={0.5} strokeDasharray="2,2" opacity={0.5} />
        <circle cx={dotX} cy={dotY} r={4} fill="#f59e0b" />
      </svg>

      {/* 角度滑块 */}
      <div className="flex items-center gap-3 px-1">
        <label className="text-xs text-white/50 whitespace-nowrap">Polarizer angle</label>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={handleSliderChange}
          onPointerUp={handleSliderUp}
          onMouseUp={handleSliderUp}
          className="flex-1 accent-amber-400"
        />
        <span className="w-10 text-right text-xs tabular-nums text-white/70">{angle}deg</span>
      </div>
    </div>
  )
}
