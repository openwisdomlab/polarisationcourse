/**
 * FresnelExplorer.tsx -- 菲涅耳反射系数交互式探索器
 *
 * 轻量级 SVG 可视化 (深度面板嵌入):
 * - Rs 和 Rp 反射系数曲线 (0-90 度入射角)
 * - 当前角度垂直标记线
 * - 布儒斯特角标注 (Rp=0 处)
 * - 入射/反射/折射光线图
 * - 通过 useDemoSync 同步入射角参数
 */

import { useState, useMemo } from 'react'
import { useDemoSync } from '@/components/odyssey-world/depth/hooks/useDemoSync'

interface FresnelExplorerProps {
  conceptId: string
  regionId: string
}

const N1 = 1.0 // 空气
const N2 = 1.52 // 玻璃

/** 菲涅耳 Rs (强度) */
function fresnelRs(thetaDeg: number): number {
  const ti = (thetaDeg * Math.PI) / 180
  const sinTt = (N1 / N2) * Math.sin(ti)
  if (sinTt >= 1) return 1
  const tt = Math.asin(sinTt)
  const rs = (N1 * Math.cos(ti) - N2 * Math.cos(tt)) / (N1 * Math.cos(ti) + N2 * Math.cos(tt))
  return rs * rs
}

/** 菲涅耳 Rp (强度) */
function fresnelRp(thetaDeg: number): number {
  const ti = (thetaDeg * Math.PI) / 180
  const sinTt = (N1 / N2) * Math.sin(ti)
  if (sinTt >= 1) return 1
  const tt = Math.asin(sinTt)
  const rp = (N2 * Math.cos(ti) - N1 * Math.cos(tt)) / (N2 * Math.cos(ti) + N1 * Math.cos(tt))
  return rp * rp
}

/** 折射角 (度) */
function refractedAngle(thetaDeg: number): number {
  const ti = (thetaDeg * Math.PI) / 180
  const sinTt = (N1 / N2) * Math.sin(ti)
  if (sinTt >= 1) return 90
  return (Math.asin(sinTt) * 180) / Math.PI
}

/** 布儒斯特角 */
const BREWSTER_DEG = (Math.atan(N2 / N1) * 180) / Math.PI

export default function FresnelExplorer({ conceptId: _conceptId, regionId: _regionId }: FresnelExplorerProps) {
  const { syncToWorld, syncImmediate } = useDemoSync(undefined, 'environment')

  const [incAngle, setIncAngle] = useState(Math.round(BREWSTER_DEG))

  const Rs = fresnelRs(incAngle)
  const Rp = fresnelRp(incAngle)
  const thetaT = refractedAngle(incAngle)

  // 曲线图区域: x=[30,280], y=[20,120], 反射率 0-1
  const plotX0 = 30, plotX1 = 280, plotY0 = 20, plotY1 = 120
  const plotW = plotX1 - plotX0, plotH = plotY1 - plotY0

  // Rs 曲线
  const rsPath = useMemo(() => {
    const pts: string[] = []
    for (let d = 0; d <= 89; d += 1) {
      const x = plotX0 + (d / 89) * plotW
      const y = plotY1 - fresnelRs(d) * plotH
      pts.push(`${x},${y}`)
    }
    return `M${pts.join(' L')}`
  }, [])

  // Rp 曲线
  const rpPath = useMemo(() => {
    const pts: string[] = []
    for (let d = 0; d <= 89; d += 1) {
      const x = plotX0 + (d / 89) * plotW
      const y = plotY1 - fresnelRp(d) * plotH
      pts.push(`${x},${y}`)
    }
    return `M${pts.join(' L')}`
  }, [])

  // 当前角度在图表上的 x 位置
  const curX = plotX0 + (Math.min(incAngle, 89) / 89) * plotW
  const curRsY = plotY1 - Rs * plotH
  const curRpY = plotY1 - Rp * plotH

  // 布儒斯特角标线
  const brewX = plotX0 + (BREWSTER_DEG / 89) * plotW

  // 光线图区域
  const intfY = 175
  const hitX = 150
  const rayLen = 45
  const incRad = (incAngle * Math.PI) / 180
  const refRad = (thetaT * Math.PI) / 180

  const incX1 = hitX - rayLen * Math.sin(incRad)
  const incY1 = intfY - rayLen * Math.cos(incRad)
  const refX2 = hitX + rayLen * Math.sin(incRad)
  const refY2 = intfY - rayLen * Math.cos(incRad)
  const traX2 = hitX + rayLen * Math.sin(refRad)
  const traY2 = intfY + rayLen * Math.cos(refRad)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setIncAngle(val)
    syncToWorld('incidenceAngle', val)
  }

  const handleSliderUp = () => {
    syncImmediate('incidenceAngle', incAngle)
  }

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 230" className="w-full" style={{ maxWidth: 420 }}>
        {/* ── 曲线图区 ── */}
        {/* 坐标轴 */}
        <line x1={plotX0} y1={plotY1} x2={plotX1} y2={plotY1} stroke="#334155" strokeWidth={1} />
        <line x1={plotX0} y1={plotY0} x2={plotX0} y2={plotY1} stroke="#334155" strokeWidth={1} />
        {/* 轴标签 */}
        <text x={(plotX0 + plotX1) / 2} y={plotY1 + 14} textAnchor="middle" fill="#64748b" fontSize={8}>Incidence angle (deg)</text>
        <text x={plotX0 - 3} y={plotY0 - 4} textAnchor="end" fill="#64748b" fontSize={7}>R</text>
        {/* 刻度 */}
        {[0, 30, 60, 89].map((d) => (
          <text key={d} x={plotX0 + (d / 89) * plotW} y={plotY1 + 10} textAnchor="middle" fill="#475569" fontSize={7}>{d === 89 ? 90 : d}</text>
        ))}
        {[0, 0.5, 1].map((v) => (
          <text key={v} x={plotX0 - 4} y={plotY1 - v * plotH + 3} textAnchor="end" fill="#475569" fontSize={7}>{v}</text>
        ))}

        {/* Rs 曲线 (橙色) */}
        <path d={rsPath} fill="none" stroke="#f97316" strokeWidth={1.5} opacity={0.8} />
        <text x={plotX1 + 2} y={plotY1 - fresnelRs(89) * plotH} fill="#f97316" fontSize={7}>Rs</text>

        {/* Rp 曲线 (蓝色) */}
        <path d={rpPath} fill="none" stroke="#60a5fa" strokeWidth={1.5} opacity={0.8} />
        <text x={plotX1 + 2} y={plotY1 - fresnelRp(89) * plotH + 10} fill="#60a5fa" fontSize={7}>Rp</text>

        {/* 布儒斯特角标记 */}
        <line x1={brewX} y1={plotY0} x2={brewX} y2={plotY1} stroke="#f59e0b" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.6} />
        <text x={brewX} y={plotY0 - 2} textAnchor="middle" fill="#f59e0b" fontSize={7}>B={BREWSTER_DEG.toFixed(1)}°</text>

        {/* 当前角度标记线 */}
        <line x1={curX} y1={plotY0} x2={curX} y2={plotY1} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="2,2" opacity={0.5} />
        <circle cx={curX} cy={curRsY} r={3} fill="#f97316" />
        <circle cx={curX} cy={curRpY} r={3} fill="#60a5fa" />

        {/* 数值标注 */}
        <text x={curX + 6} y={curRsY - 4} fill="#f97316" fontSize={7}>{(Rs * 100).toFixed(1)}%</text>
        <text x={curX + 6} y={curRpY + 10} fill="#60a5fa" fontSize={7}>{Rp < 0.001 ? '~0%' : `${(Rp * 100).toFixed(1)}%`}</text>

        {/* ── 光线图区 ── */}
        {/* 界面 */}
        <line x1={70} y1={intfY} x2={230} y2={intfY} stroke="#64748b" strokeWidth={1.5} />
        {/* 法线 */}
        <line x1={hitX} y1={intfY - 50} x2={hitX} y2={intfY + 50} stroke="#475569" strokeWidth={0.3} strokeDasharray="2,2" />
        {/* 下方介质 */}
        <rect x={70} y={intfY} width={160} height={50} fill="#7a9a2a" fillOpacity={0.05} />
        <text x={225} y={intfY - 5} fill="#94a3b8" fontSize={7}>n=1.0</text>
        <text x={225} y={intfY + 12} fill="#94a3b8" fontSize={7}>n=1.52</text>

        {/* 入射光 */}
        <line x1={incX1} y1={incY1} x2={hitX} y2={intfY} stroke="#e2e8f0" strokeWidth={2} />
        {/* 反射光 (s: 橙, 粗细随 Rs) */}
        <line x1={hitX} y1={intfY} x2={refX2} y2={refY2} stroke="#f97316" strokeWidth={0.5 + Rs * 2.5} opacity={0.3 + Rs * 0.7} />
        {/* 折射光 */}
        <line x1={hitX} y1={intfY} x2={traX2} y2={traY2} stroke="#60a5fa" strokeWidth={1.5 + (1 - (Rs + Rp) / 2) * 1.5} opacity={0.5 + (1 - (Rs + Rp) / 2) * 0.5} />
      </svg>

      {/* 入射角滑块 */}
      <div className="flex items-center gap-3 px-1">
        <label className="text-xs text-white/50 whitespace-nowrap">Incidence</label>
        <input
          type="range"
          min={0}
          max={89}
          value={incAngle}
          onChange={handleSliderChange}
          onPointerUp={handleSliderUp}
          onMouseUp={handleSliderUp}
          className="flex-1 accent-green-400"
        />
        <span className="w-10 text-right text-xs tabular-nums text-white/70">{incAngle}°</span>
      </div>
    </div>
  )
}
