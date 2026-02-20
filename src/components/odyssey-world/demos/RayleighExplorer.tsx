/**
 * RayleighExplorer.tsx -- 瑞利散射偏振交互式探索器
 *
 * 轻量级 SVG 可视化 (深度面板嵌入):
 * - 入射非偏振光 + 散射介质 + 指定角度的散射光束
 * - 散射角滑块 (0-180): 偏振度从 0 (前/后) 到 1 (90 度)
 * - 极坐标强度图和偏振度条
 * - 通过 useDemoSync 同步散射角参数
 */

import { useState, useMemo } from 'react'
import { useDemoSync } from '@/components/odyssey-world/depth/hooks/useDemoSync'

interface RayleighExplorerProps {
  conceptId: string
  regionId: string
}

/** 瑞利散射偏振度: DOP = sin^2(theta) / (1 + cos^2(theta)) */
function rayleighDOP(angleDeg: number): number {
  const rad = (angleDeg * Math.PI) / 180
  const sin2 = Math.sin(rad) ** 2
  const cos2 = Math.cos(rad) ** 2
  return sin2 / (1 + cos2)
}

/** 瑞利散射强度: I ~ (1 + cos^2(theta)) */
function rayleighIntensity(angleDeg: number): number {
  const rad = (angleDeg * Math.PI) / 180
  return (1 + Math.cos(rad) ** 2) / 2 // 归一化到 [0.5, 1]
}

export default function RayleighExplorer({ conceptId: _conceptId, regionId: _regionId }: RayleighExplorerProps) {
  const { syncToWorld, syncImmediate } = useDemoSync(undefined, 'environment')

  const [angle, setAngle] = useState(90)
  const dop = rayleighDOP(angle)
  const intensity = rayleighIntensity(angle)

  // 极坐标散射图 (中心点)
  const pcx = 150, pcy = 100
  const pRadius = 60

  // 极坐标图路径 (强度分布)
  const polarPath = useMemo(() => {
    const pts: string[] = []
    for (let deg = 0; deg <= 360; deg += 3) {
      const r = rayleighIntensity(deg) * pRadius
      const rad = (deg * Math.PI) / 180
      const x = pcx + r * Math.cos(rad)
      const y = pcy - r * Math.sin(rad)
      pts.push(`${x},${y}`)
    }
    return `M${pts.join(' L')} Z`
  }, [])

  // 当前散射角度的射线端点
  const scatterRad = (angle * Math.PI) / 180
  const scatterLen = intensity * pRadius
  const scatterX = pcx + scatterLen * Math.cos(scatterRad)
  const scatterY = pcy - scatterLen * Math.sin(scatterRad)

  // DOP 颜色: 低 = 灰色, 高 = 紫色
  const dopColor = dop > 0.9 ? '#c084fc' : dop > 0.5 ? '#a78bfa' : '#64748b'

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setAngle(val)
    syncToWorld('scatteringAngle', val)
  }

  const handleSliderUp = () => {
    syncImmediate('scatteringAngle', angle)
  }

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 200" className="w-full" style={{ maxWidth: 420 }}>
        {/* 入射光 (从左至中心) */}
        <line x1={10} y1={pcy} x2={pcx - 5} y2={pcy} stroke="#94a3b8" strokeWidth={2} />
        <polygon points={`${pcx - 7},${pcy - 4} ${pcx + 1},${pcy} ${pcx - 7},${pcy + 4}`} fill="#94a3b8" />
        <text x={40} y={pcy - 10} fill="#64748b" fontSize={8}>Unpolarized</text>

        {/* 散射介质 (中心点) */}
        <circle cx={pcx} cy={pcy} r={6} fill="#9b7dd4" fillOpacity={0.3} stroke="#9b7dd4" strokeWidth={1} />

        {/* 极坐标强度分布曲线 */}
        <path d={polarPath} fill="#9b7dd4" fillOpacity={0.08} stroke="#9b7dd4" strokeWidth={1} opacity={0.5} />

        {/* 坐标轴 (虚线) */}
        <line x1={pcx - pRadius - 10} y1={pcy} x2={pcx + pRadius + 10} y2={pcy} stroke="#334155" strokeWidth={0.5} strokeDasharray="3,3" />
        <line x1={pcx} y1={pcy - pRadius - 10} x2={pcx} y2={pcy + pRadius + 10} stroke="#334155" strokeWidth={0.5} strokeDasharray="3,3" />

        {/* 角度标签 */}
        <text x={pcx + pRadius + 12} y={pcy + 3} fill="#475569" fontSize={7}>0°</text>
        <text x={pcx} y={pcy - pRadius - 12} textAnchor="middle" fill="#475569" fontSize={7}>90°</text>
        <text x={pcx - pRadius - 14} y={pcy + 3} textAnchor="end" fill="#475569" fontSize={7}>180°</text>

        {/* 当前散射方向射线 */}
        <line
          x1={pcx}
          y1={pcy}
          x2={scatterX}
          y2={scatterY}
          stroke={dopColor}
          strokeWidth={2}
        />
        <circle cx={scatterX} cy={scatterY} r={3.5} fill={dopColor} />

        {/* 散射光偏振标记 (在射线端点附近) -- 线段长度代表偏振度 */}
        {dop > 0.05 && (
          <line
            x1={scatterX - 8 * dop * Math.sin(scatterRad)}
            y1={scatterY - 8 * dop * Math.cos(scatterRad)}
            x2={scatterX + 8 * dop * Math.sin(scatterRad)}
            y2={scatterY + 8 * dop * Math.cos(scatterRad)}
            stroke={dopColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}

        {/* DOP 指示条 */}
        <rect x={250} y={50} width={8} height={100} rx={2} fill="#1e293b" />
        <rect
          x={250}
          y={50 + 100 * (1 - dop)}
          width={8}
          height={100 * dop}
          rx={2}
          fill={dopColor}
          opacity={0.7}
        />
        <text x={254} y={45} textAnchor="middle" fill="#64748b" fontSize={7}>DOP</text>
        <text x={254} y={162} textAnchor="middle" fill={dopColor} fontSize={9} fontWeight={600}>
          {dop.toFixed(2)}
        </text>

        {/* 角度标注 */}
        <text x={pcx} y={190} textAnchor="middle" fill="#94a3b8" fontSize={9}>
          {angle}° scatter | I = {(intensity * 100).toFixed(0)}%
        </text>
      </svg>

      {/* 散射角滑块 */}
      <div className="flex items-center gap-3 px-1">
        <label className="text-xs text-white/50 whitespace-nowrap">Scatter angle</label>
        <input
          type="range"
          min={0}
          max={180}
          value={angle}
          onChange={handleSliderChange}
          onPointerUp={handleSliderUp}
          onMouseUp={handleSliderUp}
          className="flex-1 accent-purple-400"
        />
        <span className="w-10 text-right text-xs tabular-nums text-white/70">{angle}°</span>
      </div>
    </div>
  )
}
