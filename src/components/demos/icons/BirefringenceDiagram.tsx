/**
 * BirefringenceDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const BirefringenceDiagram = memo(function BirefringenceDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <line x1="20" y1="40" x2="70" y2="40" stroke="#fbbf24" strokeWidth="3" />
      <polygon points="70,40 64,36 64,44" fill="#fbbf24" />
      <path d="M80,20 L120,20 L130,60 L90,60 Z" fill="#22d3ee" opacity="0.3" stroke="#22d3ee" strokeWidth="1" />
      <line x1="130" y1="35" x2="180" y2="30" stroke="#ff4444" strokeWidth="2" />
      <text x="175" y="22" fill="#ff4444" fontSize="8">o</text>
      <line x1="130" y1="45" x2="180" y2="55" stroke="#44ff44" strokeWidth="2" />
      <text x="175" y="68" fill="#44ff44" fontSize="8">e</text>
    </svg>
  )
})

export default BirefringenceDiagram
