/**
 * ScatteringDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const ScatteringDiagram = memo(function ScatteringDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="20" y1="40" x2="70" y2="40" stroke="#fbbf24" strokeWidth="2" />
      <polygon points="70,40 64,36 64,44" fill="#fbbf24" />
      <circle cx="100" cy="40" r="15" fill="#64748b" opacity="0.3" stroke="#64748b" />
      <line x1="115" y1="40" x2="160" y2="40" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="110" y1="28" x2="145" y2="10" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      <line x1="110" y1="52" x2="145" y2="70" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="25" x2="100" y2="5" stroke="#4444ff" strokeWidth="1.5" opacity="0.8" />
    </svg>
  )
})

export default ScatteringDiagram
