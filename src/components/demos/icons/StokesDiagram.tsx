/**
 * StokesDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const StokesDiagram = memo(function StokesDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <circle cx="100" cy="40" r="30" fill="none" stroke="#64748b" strokeWidth="1" />
      <ellipse cx="100" cy="40" rx="30" ry="10" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
      <line x1="65" y1="40" x2="135" y2="40" stroke="#ff4444" strokeWidth="1.5" />
      <text x="140" y="43" fill="#ff4444" fontSize="8">S₁</text>
      <line x1="100" y1="55" x2="100" y2="5" stroke="#44ff44" strokeWidth="1.5" />
      <text x="105" y="10" fill="#44ff44" fontSize="8">S₃</text>
      <circle cx="120" cy="30" r="4" fill="#ffff00" />
      <line x1="100" y1="40" x2="120" y2="30" stroke="#ffff00" strokeWidth="1.5" />
    </svg>
  )
})

export default StokesDiagram
