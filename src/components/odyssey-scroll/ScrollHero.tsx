/**
 * ScrollHero — Full-screen hero section for the Odyssey scroll experience.
 *
 * Features a horizontal light beam that passes through a polarizer icon,
 * demonstrating the core concept: light enters bright, exits dimmer.
 * Content fades out and scales down as the user scrolls.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Beam Animation (SVG) ─────────────────────────────────────────────────────

function BeamAnimation() {
  return (
    <div className="w-full max-w-3xl mx-auto mb-16 relative h-12 flex items-center">
      {/* ── Incoming beam (bright, full width) ── */}
      <div
        className="absolute left-0 right-1/2 h-[3px] mr-6 animate-flow-beam"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #fbbf2400 10%, #fbbf24 40%, #fbbf24cc 90%, #fbbf2466 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      {/* Incoming beam glow */}
      <div
        className="absolute left-0 right-1/2 h-[8px] mr-6 blur-sm opacity-40 animate-flow-beam"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #fbbf2400 10%, #fbbf24 40%, #fbbf24cc 90%, #fbbf2466 100%)',
          backgroundSize: '200% 100%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* ── Polarizer icon (center) ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
        >
          {/* Outer circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          {/* Vertical polarization lines */}
          <line x1="12" y1="6" x2="12" y2="30" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="18" y1="4" x2="18" y2="32" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="24" y1="6" x2="24" y2="30" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
          {/* Cross indicator (polarizer symbol) */}
          <circle cx="18" cy="18" r="2" fill="white" fillOpacity="0.4" />
        </svg>
      </div>

      {/* ── Outgoing beam (dimmer, thinner) ── */}
      <div
        className="absolute left-1/2 right-0 h-[1.5px] ml-6 opacity-50 animate-flow-beam"
        style={{
          background:
            'linear-gradient(90deg, #fbbf2466 0%, #fbbf24cc 20%, #fbbf24 60%, #fbbf2400 90%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      {/* Outgoing beam glow (dimmer) */}
      <div
        className="absolute left-1/2 right-0 h-[4px] ml-6 blur-sm opacity-15 animate-flow-beam"
        style={{
          background:
            'linear-gradient(90deg, #fbbf2466 0%, #fbbf24cc 20%, #fbbf24 60%, #fbbf2400 90%, transparent 100%)',
          backgroundSize: '200% 100%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  )
}

// ── Scroll Prompt ────────────────────────────────────────────────────────────

function ScrollPrompt() {
  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30"
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      <span className="text-xs font-mono tracking-[0.3em] uppercase">scroll</span>
      <svg
        width="16"
        height="24"
        viewBox="0 0 16 24"
        fill="none"
        className="opacity-50"
      >
        <path
          d="M8 4L8 18M8 18L3 13M8 18L13 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80])

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
    >
      {/* Content — fades + scales on scroll */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 text-center px-6 flex flex-col items-center"
      >
        {/* Beam animation preview */}
        <BeamAnimation />

        {/* Main title */}
        <motion.h1
          className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-3"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          The Optical Bench
        </motion.h1>

        {/* Chinese subtitle */}
        <motion.p
          className="text-xl text-white/40 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          光学实验台
        </motion.p>

        {/* Tagline */}
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <p className="text-lg text-white/60 font-light">
            A journey through polarized light.
          </p>
          <p className="text-sm font-mono text-white/40 tracking-wide">
            23 experiments. One beam.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll prompt */}
      <ScrollPrompt />
    </div>
  )
}
