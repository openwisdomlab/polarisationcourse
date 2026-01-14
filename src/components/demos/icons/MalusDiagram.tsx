/**
 * MalusDiagram Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const MalusDiagram = memo(function MalusDiagram() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto">
      <defs>
        <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="40" r="12" fill="#fbbf24" opacity="0.8" />
      <rect x="35" y="38" width="40" height="4" fill="url(#beamGrad)" />
      <rect x="78" y="25" width="4" height="30" fill="#22d3ee" rx="1" />
      <rect x="85" y="38" width="40" height="4" fill="#22d3ee" opacity="0.8" />
      <rect x="128" y="25" width="4" height="30" fill="#a78bfa" rx="1" />
      <rect x="135" y="38" width="30" height="4" fill="#a78bfa" opacity="0.5" />
      <rect x="168" y="28" width="6" height="24" fill="#64748b" rx="1" />
    </svg>
  )
})

export default MalusDiagram
