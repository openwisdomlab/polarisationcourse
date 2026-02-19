/**
 * CrystalSVG.tsx — Sci-fi styled SVG crystal icon
 *
 * 等距风格的晶体/菱形形状，表示双折射晶体。
 * 平行四边形 + 内部虚线（双折射暗示）+ 金属底座 + 辉光滤镜
 */

interface CrystalSVGProps {
  color: string
  size?: number
  className?: string
}

export function CrystalSVG({ color, size = 80, className }: CrystalSVGProps) {
  const scale = size / 80
  const filterId = `crystal-glow-${Math.random().toString(36).slice(2, 8)}`

  // 菱形四个顶点（等距倾斜风格）
  const rhombus = '40,20 58,45 40,70 22,45'

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
      <rect x={38} y={72} width={4} height={20} fill="#444" />

      {/* 晶体主体 */}
      <g filter={`url(#${filterId})`}>
        {/* 菱形外框 */}
        <polygon
          points={rhombus}
          fill={color}
          fillOpacity={0.1}
          stroke={color}
          strokeWidth={1.5}
        />

        {/* 内部虚线 — 表示双折射 */}
        <line
          x1={32}
          y1={30}
          x2={48}
          y2={60}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />

        {/* 第二条虚线 — o 光与 e 光的分裂暗示 */}
        <line
          x1={34}
          y1={30}
          x2={50}
          y2={60}
          stroke={color}
          strokeWidth={0.8}
          strokeDasharray="2 3"
          opacity={0.3}
        />
      </g>
    </svg>
  )
}
