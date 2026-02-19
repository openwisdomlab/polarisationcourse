/**
 * ScatterMediumSVG.tsx — Sci-fi styled SVG scattering medium icon
 *
 * 散射介质容器：虚线矩形 + 内部随机散射粒子 + 波浪形光束路径 + 金属底座 + 辉光滤镜
 */

interface ScatterMediumSVGProps {
  color: string
  size?: number
  className?: string
}

// 散射粒子的预设位置（伪随机，避免运行时变化）
const PARTICLES = [
  { cx: 28, cy: 38, r: 2, opacity: 0.4 },
  { cx: 52, cy: 32, r: 1.5, opacity: 0.3 },
  { cx: 35, cy: 50, r: 1, opacity: 0.5 },
  { cx: 48, cy: 55, r: 2.5, opacity: 0.2 },
  { cx: 30, cy: 65, r: 1.5, opacity: 0.45 },
  { cx: 55, cy: 45, r: 1, opacity: 0.35 },
  { cx: 42, cy: 72, r: 3, opacity: 0.25 },
  { cx: 38, cy: 42, r: 1.5, opacity: 0.4 },
  { cx: 50, cy: 68, r: 2, opacity: 0.3 },
  { cx: 32, cy: 58, r: 1, opacity: 0.5 },
  { cx: 46, cy: 36, r: 2, opacity: 0.35 },
  { cx: 54, cy: 60, r: 1.5, opacity: 0.25 },
]

export function ScatterMediumSVG({ color, size = 80, className }: ScatterMediumSVGProps) {
  const scale = size / 80
  const filterId = `scatter-glow-${Math.random().toString(36).slice(2, 8)}`

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

      {/* 散射介质容器 */}
      <g filter={`url(#${filterId})`}>
        {/* 虚线矩形容器 */}
        <rect
          x={22}
          y={26}
          width={36}
          height={54}
          rx={2}
          fill="transparent"
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="4 2"
        />

        {/* 散射粒子 */}
        {PARTICLES.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} opacity={p.opacity} />
        ))}

        {/* 波浪形光束路径 */}
        <path
          d="M22,53 C28,48 34,58 40,53 C46,48 52,58 58,53"
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.3}
        />
      </g>
    </svg>
  )
}
