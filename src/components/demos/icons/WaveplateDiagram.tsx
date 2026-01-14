/**
 * WaveplateDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const WaveplateDiagram = memo(function WaveplateDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="15" y1="40" x2="55" y2="40" stroke="#fbbf24" strokeWidth="2" />
      <line x1="35" y1="30" x2="35" y2="50" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3" />
      <rect x="60" y="25" width="30" height="30" fill="#a78bfa" opacity="0.3" stroke="#a78bfa" strokeWidth="1" />
      <ellipse cx="130" cy="40" rx="15" ry="15" fill="none" stroke="#22d3ee" strokeWidth="2" />
      <polygon points="145,40 140,35 140,45" fill="#22d3ee" />
      <line x1="90" y1="40" x2="112" y2="40" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3" />
    </svg>
  )
})

export default WaveplateDiagram
