/**
 * LifeSceneIcon Component
 * SVG icon/diagram extracted from DemosPage
 */

import { memo } from 'react'

const LifeSceneIcon = memo(function LifeSceneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
})

export default LifeSceneIcon
