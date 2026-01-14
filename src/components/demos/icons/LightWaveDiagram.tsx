/**
 * LightWaveDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const LightWaveDiagram = memo(function LightWaveDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <path d="M10,40 Q30,20 50,40 T90,40 T130,40 T170,40" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <path d="M10,40 Q30,60 50,40 T90,40 T130,40 T170,40" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4" />
      <line x1="180" y1="40" x2="195" y2="40" stroke="#64748b" strokeWidth="2" />
      <polygon points="195,40 188,36 188,44" fill="#64748b" />
      <text x="100" y="75" textAnchor="middle" fill="#94a3b8" fontSize="8">λ</text>
    </svg>
  )
})

export default LightWaveDiagram
