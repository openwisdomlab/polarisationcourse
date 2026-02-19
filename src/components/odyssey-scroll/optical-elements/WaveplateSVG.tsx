/**
 * WaveplateSVG.tsx — Sci-fi styled SVG waveplate icon
 *
 * 薄矩形平板 + 快轴虚线标记 + 双向箭头 + 金属底座 + 辉光滤镜
 */

interface WaveplateSVGProps {
  color: string
  size?: number
  className?: string
}

export function WaveplateSVG({ color, size = 80, className }: WaveplateSVGProps) {
  const scale = size / 80
  const filterId = `waveplate-glow-${Math.random().toString(36).slice(2, 8)}`

  return (
    <svg
      viewBox="0 0 80 120"
      width={80 * scale}
      height={120 * scale}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* 辉光滤镜 */}
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feFlood floodColor={color} floodOpacity="0.35" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 金属底座 */}
      <rect x={28} y={90} width={24} height={30} rx={2} fill="#333" stroke="#555" strokeWidth={1} />
      {/* 连接杆 */}
      <rect x={38} y={82} width={4} height={10} fill="#444" />

      {/* 波片主体 */}
      <g filter={`url(#${filterId})`}>
        {/* 薄矩形平板 */}
        <rect
          x={30}
          y={28}
          width={20}
          height={52}
          rx={1}
          fill={color}
          fillOpacity={0.15}
          stroke={color}
          strokeWidth={1.5}
        />

        {/* 快轴虚线 */}
        <line
          x1={40}
          y1={24}
          x2={40}
          y2={84}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.5}
        />

        {/* 上方箭头 */}
        <polyline
          points="36,28 40,22 44,28"
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.6}
        />

        {/* 下方箭头 */}
        <polyline
          points="36,80 40,86 44,80"
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.6}
        />

        {/* 快轴标注 "f" */}
        <text x={45} y={26} fontSize={8} fill={color} opacity={0.4} fontFamily="monospace">
          f
        </text>
      </g>
    </svg>
  )
}
