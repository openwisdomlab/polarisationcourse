/**
 * BrewsterExplorer.tsx -- 布儒斯特角交互式探索器
 *
 * 轻量级 SVG 可视化 (深度面板嵌入):
 * - 入射光线以可变角度打到界面，分为反射光和折射光
 * - 在布儒斯特角 arctan(n2/n1) 处 p 偏振反射分量降为零
 * - 光线粗细与反射/折射强度成比例
 * - 通过 useDemoSync 同步入射角参数 (若场景有相关元素)
 */

import { useState, useMemo } from 'react'
import { useDemoSync } from '@/components/odyssey-world/depth/hooks/useDemoSync'

interface BrewsterExplorerProps {
  conceptId: string
  regionId: string
}

/** 计算布儒斯特角 (度) */
function brewsterAngle(n1: number, n2: number): number {
  return (Math.atan(n2 / n1) * 180) / Math.PI
}

/** Fresnel 反射系数 (p 偏振) -- 简化为强度比 */
function fresnelRp(thetaI: number, n1: number, n2: number): number {
  const ti = (thetaI * Math.PI) / 180
  const sinTt = (n1 / n2) * Math.sin(ti)
  if (sinTt >= 1) return 1 // 全内反射
  const tt = Math.asin(sinTt)
  const rp = (n2 * Math.cos(ti) - n1 * Math.cos(tt)) / (n2 * Math.cos(ti) + n1 * Math.cos(tt))
  return rp * rp
}

/** Fresnel 反射系数 (s 偏振) -- 简化为强度比 */
function fresnelRs(thetaI: number, n1: number, n2: number): number {
  const ti = (thetaI * Math.PI) / 180
  const sinTt = (n1 / n2) * Math.sin(ti)
  if (sinTt >= 1) return 1
  const tt = Math.asin(sinTt)
  const rs = (n1 * Math.cos(ti) - n2 * Math.cos(tt)) / (n1 * Math.cos(ti) + n2 * Math.cos(tt))
  return rs * rs
}

/** Snell 折射角 (度) */
function refractedAngle(thetaI: number, n1: number, n2: number): number {
  const ti = (thetaI * Math.PI) / 180
  const sinTt = (n1 / n2) * Math.sin(ti)
  if (sinTt >= 1) return 90
  return (Math.asin(sinTt) * 180) / Math.PI
}

export default function BrewsterExplorer({ conceptId: _conceptId, regionId: _regionId }: BrewsterExplorerProps) {
  const { syncToWorld, syncImmediate } = useDemoSync(undefined, 'environment')

  const n1 = 1.0 // 空气
  const n2 = 1.5 // 玻璃
  const thetaB = useMemo(() => brewsterAngle(n1, n2), [])

  const [incAngle, setIncAngle] = useState(Math.round(thetaB))

  const Rp = fresnelRp(incAngle, n1, n2)
  const Rs = fresnelRs(incAngle, n1, n2)
  const thetaT = refractedAngle(incAngle, n1, n2)

  // SVG 坐标
  const interfaceY = 80
  const hitX = 150
  const rayLen = 70

  const incRad = (incAngle * Math.PI) / 180
  const refRad = (thetaT * Math.PI) / 180

  // 入射光起点
  const incX1 = hitX - rayLen * Math.sin(incRad)
  const incY1 = interfaceY - rayLen * Math.cos(incRad)
  // 反射光终点 (对称)
  const refX2 = hitX + rayLen * Math.sin(incRad)
  const refY2 = interfaceY - rayLen * Math.cos(incRad)
  // 折射光终点
  const traX2 = hitX + rayLen * Math.sin(refRad)
  const traY2 = interfaceY + rayLen * Math.cos(refRad)

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
      <svg viewBox="0 0 300 170" className="w-full" style={{ maxWidth: 420 }}>
        {/* 界面 */}
        <line x1={20} y1={interfaceY} x2={280} y2={interfaceY} stroke="#64748b" strokeWidth={2} />
        {/* 介质标签 */}
        <text x={260} y={interfaceY - 8} fill="#94a3b8" fontSize={8}>n=1.0</text>
        <text x={260} y={interfaceY + 15} fill="#94a3b8" fontSize={8}>n=1.5</text>
        {/* 下方介质半透明填充 */}
        <rect x={20} y={interfaceY} width={260} height={80} fill="#3b82f6" fillOpacity={0.06} />

        {/* 法线 (虚线) */}
        <line x1={hitX} y1={interfaceY - 65} x2={hitX} y2={interfaceY + 65} stroke="#475569" strokeWidth={0.5} strokeDasharray="3,3" />

        {/* 入射光 */}
        <line x1={incX1} y1={incY1} x2={hitX} y2={interfaceY} stroke="#e2e8f0" strokeWidth={2.5} />
        <polygon
          points={`${hitX - 4},${interfaceY - 6} ${hitX + 4},${interfaceY - 6} ${hitX},${interfaceY}`}
          fill="#e2e8f0"
        />

        {/* 反射光 (粗细随 Rs 变化) -- s 偏振 */}
        <line
          x1={hitX}
          y1={interfaceY}
          x2={refX2}
          y2={refY2}
          stroke="#f97316"
          strokeWidth={0.5 + Rs * 3}
          opacity={0.3 + Rs * 0.7}
        />
        <text x={refX2 + 5} y={refY2 - 2} fill="#f97316" fontSize={8} opacity={0.8}>
          Rs={(Rs * 100).toFixed(0)}%
        </text>

        {/* 反射光 p 偏振分量标注 */}
        <text x={refX2 + 5} y={refY2 + 10} fill="#fb923c" fontSize={8} opacity={0.6}>
          Rp={Rp < 0.001 ? '~0' : `${(Rp * 100).toFixed(1)}%`}
        </text>

        {/* 折射光 */}
        <line
          x1={hitX}
          y1={interfaceY}
          x2={traX2}
          y2={traY2}
          stroke="#60a5fa"
          strokeWidth={1.5 + (1 - (Rp + Rs) / 2) * 2}
          opacity={0.5 + (1 - (Rp + Rs) / 2) * 0.5}
        />

        {/* 布儒斯特角标记 */}
        <text x={25} y={165} fill="#f59e0b" fontSize={9}>
          Brewster: {thetaB.toFixed(1)}deg
        </text>
        {/* 当前角度提示 */}
        {Math.abs(incAngle - thetaB) < 1.5 && (
          <text x={hitX} y={interfaceY - 70} textAnchor="middle" fill="#f59e0b" fontSize={10} fontWeight={600}>
            At Brewster angle!
          </text>
        )}
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
          className="flex-1 accent-orange-400"
        />
        <span className="w-10 text-right text-xs tabular-nums text-white/70">{incAngle}deg</span>
      </div>
    </div>
  )
}
