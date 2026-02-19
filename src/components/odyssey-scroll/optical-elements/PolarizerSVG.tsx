/**
 * PolarizerSVG.tsx — Sci-fi styled SVG polarizer icon
 *
 * 偏振器可视化：圆盘 + 光栅线 + 金属底座，带辉光效果
 * 整个圆盘组可按 angle 旋转
 */

interface PolarizerSVGProps {
  angle: number
  color: string
  size?: number
  className?: string
}

export function PolarizerSVG({ angle, color, size = 80, className }: PolarizerSVGProps) {
  // 计算缩放比例：viewBox 宽度为 80
  const scale = size / 80

  // 生成 5 条等距平行线（光栅），在圆盘内部
  const gratingLines = Array.from({ length: 5 }, (_, i) => {
    const x = 26 + i * 7 // 均匀分布在 26~54 范围内（圆心40, 半径28）
    // 用勾股定理计算每条线在圆内的起止 y
    const dx = Math.abs(x - 40)
    const halfLen = Math.sqrt(28 * 28 - dx * dx)
    return { x, y1: 60 - halfLen, y2: 60 + halfLen }
  })

  const filterId = `polarizer-glow-${Math.random().toString(36).slice(2, 8)}`

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
      <rect
        x={28}
        y={90}
        width={24}
        height={30}
        rx={2}
        fill="#333"
        stroke="#555"
        strokeWidth={1}
      />
      {/* 底座与圆盘的连接杆 */}
      <rect x={38} y={85} width={4} height={8} fill="#444" />

      {/* 可旋转的圆盘组 */}
      <g transform={`rotate(${angle}, 40, 60)`} filter={`url(#${filterId})`}>
        {/* 圆盘 */}
        <circle
          cx={40}
          cy={60}
          r={28}
          fill={color}
          fillOpacity={0.1}
          stroke={color}
          strokeWidth={1.5}
        />

        {/* 光栅线 */}
        {gratingLines.map((line, i) => (
          <line
            key={i}
            x1={line.x}
            y1={line.y1}
            x2={line.x}
            y2={line.y2}
            stroke={color}
            strokeWidth={1}
            opacity={0.4}
          />
        ))}
      </g>
    </svg>
  )
}
