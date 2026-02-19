/**
 * ScrollBackground — Three-layer fixed background for the Odyssey scroll experience.
 *
 * Layer 1: Dot grid (optical table M6 screw holes) with subtle parallax
 * Layer 2: Atmosphere glow — large radial gradient keyed to current unit color
 * Layer 3: Ambient particles — 50 CSS-animated dots drifting at low opacity
 */

import { useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useOpticalBenchStore } from './store'

// 6 unit colors: amber / cyan / violet / emerald / pink / blue
const UNIT_COLORS = [
  '#fbbf24',
  '#22d3ee',
  '#a78bfa',
  '#34d399',
  '#f472b6',
  '#60a5fa',
]

// ── Particle type ────────────────────────────────────────────────────────────
interface Particle {
  id: number
  left: string
  top: string
  size: number
  opacity: number
  duration: string
  delay: string
}

// ── Component ────────────────────────────────────────────────────────────────

export function ScrollBackground() {
  const currentUnit = useOpticalBenchStore((s) => s.currentUnit)
  const unitColor = UNIT_COLORS[currentUnit] ?? UNIT_COLORS[0]

  const { scrollYProgress } = useScroll()
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-2%'])

  // 50 stable particles generated once
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2,            // 1-3px
      opacity: 0.02 + Math.random() * 0.06,   // 0.02-0.08
      duration: `${20 + Math.random() * 40}s`, // 20-60s per cycle
      delay: `${-Math.random() * 40}s`,        // stagger start
    }))
  }, [])

  return (
    <>
      {/* ── Layer 1: Dot grid (optical table) ─────────────────────── */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ y: gridY }}
      >
        <div
          className="absolute inset-0 transition-[background-image] duration-2000"
          style={{
            backgroundImage: `radial-gradient(circle, ${unitColor}08 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </motion.div>

      {/* ── Layer 2: Atmosphere glow ──────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[120vmax] h-[120vmax] rounded-full transition-colors duration-[2000ms]"
          style={{
            background: `radial-gradient(closest-side, ${unitColor}0D, transparent)`,
          }}
        />
      </div>

      {/* ── Layer 3: Ambient particles ────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full animate-drift"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              backgroundColor: unitColor,
              animationDuration: p.duration,
              animationDelay: p.delay,
              // transition the color smoothly
              transition: 'background-color 2s',
            }}
          />
        ))}
      </div>
    </>
  )
}
