/**
 * FloatingParticle Component
 * Extracted from HomePage for better organization
 */

import { motion } from 'framer-motion'

interface ParticleProps {
  delay: number
  duration: number
  x: number
  y: number
  size: number
  color: string
}

function FloatingParticle({ delay, duration, x, y, size, color }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.5],
        y: [0, -100, -200],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
}

export default FloatingParticle
