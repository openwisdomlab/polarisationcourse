/**
 * PolarizationStateDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const PolarizationStateDiagram = memo(function PolarizationStateDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="25" y1="25" x2="25" y2="55" stroke="#ffaa00" strokeWidth="2" />
      <circle cx="25" cy="40" r="15" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
      <circle cx="100" cy="40" r="15" fill="none" stroke="#44ff44" strokeWidth="2" />
      <polygon points="115,40 110,35 110,45" fill="#44ff44" />
      <ellipse cx="175" cy="40" rx="18" ry="10" fill="none" stroke="#a78bfa" strokeWidth="2" transform="rotate(-30 175 40)" />
    </svg>
  )
})

export default PolarizationStateDiagram
