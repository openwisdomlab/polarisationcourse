/**
 * LightBeamEffect Component
 * Extracted from HomePage for better organization
 */

import { motion } from 'framer-motion'


function LightBeamEffect({ theme }: { theme: 'dark' | 'light' }) {
  const beamColor = theme === 'dark' ? '#22d3ee' : '#0891b2'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Diagonal light beam */}
      <motion.div
        className="absolute"
        style={{
          width: '200%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${beamColor}40, ${beamColor}, ${beamColor}40, transparent)`,
          transformOrigin: 'center',
          top: '30%',
          left: '-50%',
        }}
        initial={{ x: '-100%', rotate: -15 }}
        animate={{ x: '100%' }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />
      {/* Second beam */}
      <motion.div
        className="absolute"
        style={{
          width: '150%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${beamColor}20, ${beamColor}60, ${beamColor}20, transparent)`,
          transformOrigin: 'center',
          top: '60%',
          left: '-25%',
        }}
        initial={{ x: '-100%', rotate: 10 }}
        animate={{ x: '100%' }}
        transition={{
          duration: 5,
          delay: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default LightBeamEffect
