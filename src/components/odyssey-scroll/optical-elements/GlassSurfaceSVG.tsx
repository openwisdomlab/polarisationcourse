/**
 * GlassSurfaceSVG.tsx — Sci-fi styled SVG glass surface icon
 *
 * 倾斜玻璃平板，带折射率标注和入射/出射箭头暗示。
 * 旋转矩形 + n1/n2 标注 + 小箭头 + 金属底座 + 辉光滤镜
 */

interface GlassSurfaceSVGProps {
  color: string
  size?: number
  className?: string
}

export function GlassSurfaceSVG({ color, size = 80, className }: GlassSurfaceSVGProps) {
  const scale = size / 80
  const filterId = `glass-glow-${Math.random().toString(36).slice(2, 8)}`

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

      {/* 倾斜玻璃平板 */}
      <g filter={`url(#${filterId})`}>
        <g transform="rotate(-30, 40, 50)">
          <rect
            x={32}
            y={25}
            width={16}
            height={50}
            rx={1}
            fill="white"
            fillOpacity={0.05}
            stroke={color}
            strokeWidth={1.5}
          />
        </g>

        {/* 折射率标注 — 左侧 n1 */}
        <text x={14} y={42} fontSize={8} fill={color} opacity={0.4} fontFamily="monospace">
          n₁
        </text>

        {/* 折射率标注 — 右侧 n2 */}
        <text x={58} y={58} fontSize={8} fill={color} opacity={0.4} fontFamily="monospace">
          n₂
        </text>

        {/* 入射箭头暗示（小 V 形） */}
        <polyline
          points="18,30 24,36 18,36"
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.4}
        />

        {/* 出射箭头暗示（小 V 形） */}
        <polyline
          points="56,64 62,70 56,70"
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.4}
        />
      </g>
    </svg>
  )
}
