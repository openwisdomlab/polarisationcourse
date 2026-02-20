/**
 * StokesExplorer.tsx -- Stokes 参数测量交互式探索器
 *
 * 轻量级 SVG 可视化 (深度面板嵌入):
 * - 旋转分析器（圆上的线段）+ 强度读数
 * - 4 个测量位置标记 (0, 45, 90, 135 度)
 * - 随滑块经过测量位置自动记录强度
 * - 底部实时显示重建的 Stokes 矢量 [S0, S1, S2, S3]
 * - 通过 useDemoSync 同步分析器角度
 */

import { useState, useRef, useCallback } from 'react'
import { useDemoSync } from '@/components/odyssey-world/depth/hooks/useDemoSync'

interface StokesExplorerProps {
  conceptId: string
  regionId: string
}

/** 马吕斯定律: 水平偏振光通过分析器角度 theta 后的归一化强度 */
function malusIntensity(analyzerDeg: number): number {
  const rad = (analyzerDeg * Math.PI) / 180
  return Math.cos(rad) ** 2
}

/** 测量位置 (度) */
const MEASUREMENT_ANGLES = [0, 45, 90, 135] as const

/** 角度接近判定阈值 (度) */
const SNAP_THRESHOLD = 4

interface MeasurementRecord {
  0?: number
  45?: number
  90?: number
  135?: number
}

export default function StokesExplorer({ conceptId: _conceptId, regionId: _regionId }: StokesExplorerProps) {
  const { worldRotation, syncToWorld, syncImmediate, hasElement } = useDemoSync(
    undefined,
    'polarizer',
  )

  const [angle, setAngle] = useState(() => (hasElement ? worldRotation : 0))
  const [measurements, setMeasurements] = useState<MeasurementRecord>({})
  const lastSnapped = useRef<number | null>(null)

  const intensity = malusIntensity(angle)

  // 分析器圆心和半径
  const cx = 100, cy = 85, R = 50

  // 检测是否靠近测量位置并自动记录
  const checkMeasurement = useCallback(
    (angleDeg: number) => {
      for (const ma of MEASUREMENT_ANGLES) {
        const diff = Math.abs(((angleDeg - ma + 180) % 360) - 180)
        if (diff < SNAP_THRESHOLD && lastSnapped.current !== ma) {
          lastSnapped.current = ma
          const val = malusIntensity(ma)
          setMeasurements((prev) => ({ ...prev, [ma]: val }))
          return
        }
      }
      // 远离测量点时清除 snap 记录
      const minDiff = Math.min(...MEASUREMENT_ANGLES.map((ma) => Math.abs(((angleDeg - ma + 180) % 360) - 180)))
      if (minDiff > SNAP_THRESHOLD * 2) {
        lastSnapped.current = null
      }
    },
    [],
  )

  // 计算 Stokes 参数 (仅当相应测量完成时)
  const I0 = measurements[0]
  const I45 = measurements[45]
  const I90 = measurements[90]
  const I135 = measurements[135]

  const S0 = I0 !== undefined && I90 !== undefined ? I0 + I90 : undefined
  const S1 = I0 !== undefined && I90 !== undefined ? I0 - I90 : undefined
  const S2 = I45 !== undefined && I135 !== undefined ? I45 - I135 : undefined
  // S3 需要 QWP 测量 -- 标记为 "需要 QWP"
  const S3Label = 'QWP needed'

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setAngle(val)
    checkMeasurement(val)
    syncToWorld('transmissionAxis', val)
  }

  const handleSliderUp = () => {
    syncImmediate('transmissionAxis', angle)
  }

  const handleReset = () => {
    setMeasurements({})
    lastSnapped.current = null
  }

  const analyzerRad = (angle * Math.PI) / 180
  const lineLen = 35

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 175" className="w-full" style={{ maxWidth: 420 }}>
        {/* ── 分析器旋转可视化 ── */}

        {/* 分析器圆 (虚线) */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />

        {/* 测量位置标记 */}
        {MEASUREMENT_ANGLES.map((ma) => {
          const rad = (ma * Math.PI) / 180
          const mx = cx + (R + 10) * Math.cos(rad)
          const my = cy - (R + 10) * Math.sin(rad)
          const dotX = cx + R * Math.cos(rad)
          const dotY = cy - R * Math.sin(rad)
          const measured = measurements[ma] !== undefined
          return (
            <g key={ma}>
              <circle
                cx={dotX}
                cy={dotY}
                r={3}
                fill={measured ? '#f59e0b' : '#475569'}
                stroke={measured ? '#f59e0b' : '#475569'}
                strokeWidth={measured ? 0 : 1}
              />
              <text x={mx} y={my + 3} textAnchor="middle" fill={measured ? '#f59e0b' : '#64748b'} fontSize={8} fontWeight={measured ? 600 : 400}>
                {ma}°
              </text>
              {measured && (
                <text x={mx} y={my + 13} textAnchor="middle" fill="#f59e0b" fontSize={7}>
                  {(measurements[ma]! * 100).toFixed(0)}%
                </text>
              )}
            </g>
          )
        })}

        {/* 分析器线段 (旋转) */}
        <line
          x1={cx - lineLen * Math.cos(analyzerRad)}
          y1={cy + lineLen * Math.sin(analyzerRad)}
          x2={cx + lineLen * Math.cos(analyzerRad)}
          y2={cy - lineLen * Math.sin(analyzerRad)}
          stroke="#7070a0"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* 强度读数 (右上) */}
        <rect x={170} y={20} width={120} height={30} rx={4} fill="#1e293b" />
        <text x={230} y={32} textAnchor="middle" fill="#64748b" fontSize={8}>Intensity</text>
        <text x={230} y={44} textAnchor="middle" fill="#e2e8f0" fontSize={12} fontWeight={600}>
          {(intensity * 100).toFixed(1)}%
        </text>

        {/* 强度条 */}
        <rect x={170} y={58} width={120} height={6} rx={3} fill="#1e293b" />
        <rect x={170} y={58} width={120 * intensity} height={6} rx={3} fill="#7070a0" opacity={0.7} />

        {/* ── Stokes 矢量显示 ── */}
        <rect x={170} y={78} width={120} height={75} rx={4} fill="#1e293b" />
        <text x={230} y={92} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={500}>Stokes Vector</text>

        {/* S0 */}
        <text x={185} y={107} fill="#64748b" fontSize={8}>S₀ =</text>
        <text x={230} y={107} textAnchor="middle" fill={S0 !== undefined ? '#e2e8f0' : '#475569'} fontSize={9} fontWeight={S0 !== undefined ? 600 : 400}>
          {S0 !== undefined ? S0.toFixed(3) : '---'}
        </text>

        {/* S1 */}
        <text x={185} y={120} fill="#64748b" fontSize={8}>S₁ =</text>
        <text x={230} y={120} textAnchor="middle" fill={S1 !== undefined ? '#e2e8f0' : '#475569'} fontSize={9} fontWeight={S1 !== undefined ? 600 : 400}>
          {S1 !== undefined ? S1.toFixed(3) : '---'}
        </text>

        {/* S2 */}
        <text x={185} y={133} fill="#64748b" fontSize={8}>S₂ =</text>
        <text x={230} y={133} textAnchor="middle" fill={S2 !== undefined ? '#e2e8f0' : '#475569'} fontSize={9} fontWeight={S2 !== undefined ? 600 : 400}>
          {S2 !== undefined ? S2.toFixed(3) : '---'}
        </text>

        {/* S3 */}
        <text x={185} y={146} fill="#64748b" fontSize={8}>S₃ =</text>
        <text x={230} y={146} textAnchor="middle" fill="#475569" fontSize={8} fontStyle="italic">
          {S3Label}
        </text>

        {/* 重置按钮 */}
        <g
          onClick={handleReset}
          style={{ cursor: 'pointer' }}
        >
          <rect x={5} y={150} width={50} height={16} rx={3} fill="#1e293b" stroke="#475569" strokeWidth={0.5} />
          <text x={30} y={161} textAnchor="middle" fill="#94a3b8" fontSize={8}>Reset</text>
        </g>
      </svg>

      {/* 分析器角度滑块 */}
      <div className="flex items-center gap-3 px-1">
        <label className="text-xs text-white/50 whitespace-nowrap">Analyzer</label>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={handleSliderChange}
          onPointerUp={handleSliderUp}
          onMouseUp={handleSliderUp}
          className="flex-1 accent-indigo-400"
        />
        <span className="w-10 text-right text-xs tabular-nums text-white/70">{angle}°</span>
      </div>
    </div>
  )
}
