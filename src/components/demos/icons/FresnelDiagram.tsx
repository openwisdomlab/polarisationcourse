/**
 * FresnelDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const FresnelDiagram = memo(function FresnelDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="30" y1="50" x2="170" y2="50" stroke="#64748b" strokeWidth="2" />
      <line x1="50" y1="15" x2="100" y2="50" stroke="#fbbf24" strokeWidth="2" />
      <line x1="100" y1="50" x2="150" y2="15" stroke="#22d3ee" strokeWidth="2" />
      <line x1="100" y1="50" x2="140" y2="78" stroke="#44ff44" strokeWidth="2" opacity="0.7" />
    </svg>
  )
})

export default FresnelDiagram
