/**
 * Programmatically Generated Polarization Art
 * 程序生成的偏振艺术图形（SVG/Canvas）
 */

import { useMemo } from 'react'
import type { PolarizationArtParams } from '@/data/types'

// Seeded random number generator for consistent results
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

interface PolarizationArtProps {
  params: PolarizationArtParams
  seed?: number
  width?: number
  height?: number
  className?: string
}

export function PolarizationArt({
  params,
  seed = 42,
  width = 200,
  height = 200,
  className
}: PolarizationArtProps) {
  const elements = useMemo(() => {
    const random = seededRandom(seed)
    const { type, colors, complexity } = params

    switch (type) {
      case 'interference':
        return generateInterference(random, colors, complexity, width, height)
      case 'birefringence':
        return generateBirefringence(random, colors, complexity, width, height)
      case 'stress':
        return generateStress(random, colors, complexity, width, height)
      case 'rotation':
        return generateRotation(random, colors, complexity, width, height)
      case 'abstract':
      default:
        return generateAbstract(random, colors, complexity, width, height)
    }
  }, [params, seed, width, height])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {elements.defs}
      </defs>
      <rect width={width} height={height} fill="#1a1a2e" />
      {elements.content}
    </svg>
  )
}

// Generate interference pattern (concentric rings)
function generateInterference(
  random: () => number,
  colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const cx = width / 2
  const cy = height / 2
  const maxRadius = Math.max(width, height) * 0.7
  const ringCount = Math.floor(complexity * 3)

  const defs = (
    <>
      {colors.map((color, i) => (
        <radialGradient key={`grad-${i}`} id={`interference-grad-${i}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      ))}
    </>
  )

  const rings = []
  for (let i = 0; i < ringCount; i++) {
    const radius = (maxRadius / ringCount) * (i + 1)
    const colorIdx = i % colors.length
    const strokeWidth = 2 + random() * 3

    rings.push(
      <circle
        key={i}
        cx={cx + (random() - 0.5) * 10}
        cy={cy + (random() - 0.5) * 10}
        r={radius}
        fill="none"
        stroke={colors[colorIdx]}
        strokeWidth={strokeWidth}
        opacity={0.3 + random() * 0.5}
      />
    )
  }

  // Add some radial lines
  const lineCount = Math.floor(complexity * 2)
  for (let i = 0; i < lineCount; i++) {
    const angle = (i / lineCount) * Math.PI * 2
    const x2 = cx + Math.cos(angle) * maxRadius
    const y2 = cy + Math.sin(angle) * maxRadius

    rings.push(
      <line
        key={`line-${i}`}
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke={colors[i % colors.length]}
        strokeWidth={1}
        opacity={0.2}
      />
    )
  }

  return { defs, content: <g>{rings}</g> }
}

// Generate birefringence pattern (split paths)
function generateBirefringence(
  random: () => number,
  colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const elements = []
  const pathCount = Math.floor(complexity * 2)

  // Crystal shape
  const crystalPoints = [
    [width * 0.3, height * 0.2],
    [width * 0.7, height * 0.3],
    [width * 0.8, height * 0.7],
    [width * 0.4, height * 0.8],
    [width * 0.2, height * 0.5]
  ].map(p => p.join(',')).join(' ')

  elements.push(
    <polygon
      key="crystal"
      points={crystalPoints}
      fill="url(#crystal-grad)"
      opacity={0.3}
    />
  )

  // Split light beams
  for (let i = 0; i < pathCount; i++) {
    const startY = height * 0.3 + (height * 0.4 / pathCount) * i
    const splitX = width * 0.5
    const endY1 = startY - 20 - random() * 30
    const endY2 = startY + 20 + random() * 30

    elements.push(
      <g key={`beam-${i}`}>
        <line
          x1={0}
          y1={startY}
          x2={splitX}
          y2={startY}
          stroke={colors[0] || '#fbbf24'}
          strokeWidth={2}
          opacity={0.8}
        />
        <line
          x1={splitX}
          y1={startY}
          x2={width}
          y2={endY1}
          stroke={colors[1] || '#ff4444'}
          strokeWidth={2}
          opacity={0.6}
        />
        <line
          x1={splitX}
          y1={startY}
          x2={width}
          y2={endY2}
          stroke={colors[2] || '#44ff44'}
          strokeWidth={2}
          opacity={0.6}
        />
      </g>
    )
  }

  const defs = (
    <linearGradient id="crystal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={colors[0] || '#22d3ee'} stopOpacity="0.5" />
      <stop offset="100%" stopColor={colors[1] || '#a78bfa'} stopOpacity="0.3" />
    </linearGradient>
  )

  return { defs, content: <g>{elements}</g> }
}

// Generate stress pattern (isochromatic fringes)
function generateStress(
  random: () => number,
  colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const elements = []
  const cx = width / 2
  const cy = height / 2

  // Background gradient
  elements.push(
    <ellipse
      key="bg"
      cx={cx}
      cy={cy}
      rx={width * 0.4}
      ry={height * 0.3}
      fill="url(#stress-bg)"
    />
  )

  // Stress fringes (curved lines)
  const fringeCount = Math.floor(complexity * 4)
  for (let i = 0; i < fringeCount; i++) {
    const offset = (i - fringeCount / 2) * 8
    const colorIdx = i % colors.length

    const d = `M ${cx - width * 0.35} ${cy + offset}
               Q ${cx} ${cy + offset + (random() - 0.5) * 40}
                 ${cx + width * 0.35} ${cy + offset}`

    elements.push(
      <path
        key={`fringe-${i}`}
        d={d}
        fill="none"
        stroke={colors[colorIdx]}
        strokeWidth={2 + random() * 2}
        opacity={0.5 + random() * 0.3}
      />
    )
  }

  const defs = (
    <radialGradient id="stress-bg">
      <stop offset="0%" stopColor="#1a1a2e" />
      <stop offset="100%" stopColor="#2a2a4e" />
    </radialGradient>
  )

  return { defs, content: <g>{elements}</g> }
}

// Generate optical rotation pattern (spiral)
function generateRotation(
  random: () => number,
  colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const cx = width / 2 + (random() - 0.5) * 10
  const cy = height / 2 + (random() - 0.5) * 10
  const spiralPoints = []
  const turns = complexity * 0.5
  const pointCount = Math.floor(complexity * 20)

  for (let i = 0; i < pointCount; i++) {
    const t = (i / pointCount) * turns * Math.PI * 2
    const r = (i / pointCount) * Math.min(width, height) * 0.4
    const x = cx + Math.cos(t) * r
    const y = cy + Math.sin(t) * r
    spiralPoints.push(`${x},${y}`)
  }

  const elements = []

  // Color bands
  for (let i = 0; i < colors.length; i++) {
    const offset = (i / colors.length) * 20
    elements.push(
      <polyline
        key={`spiral-${i}`}
        points={spiralPoints.join(' ')}
        fill="none"
        stroke={colors[i]}
        strokeWidth={8}
        opacity={0.4}
        transform={`translate(${offset * Math.cos(i)}, ${offset * Math.sin(i)})`}
      />
    )
  }

  // Center glow
  elements.push(
    <circle
      key="center"
      cx={cx}
      cy={cy}
      r={15}
      fill="url(#rotation-glow)"
    />
  )

  const defs = (
    <radialGradient id="rotation-glow">
      <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
  )

  return { defs, content: <g>{elements}</g> }
}

// Generate abstract polarization pattern
function generateAbstract(
  random: () => number,
  colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const elements = []
  const shapeCount = Math.floor(complexity * 3)

  for (let i = 0; i < shapeCount; i++) {
    const x = random() * width
    const y = random() * height
    const size = 20 + random() * 60
    const colorIdx = i % colors.length
    const rotation = random() * 360

    // Mix of shapes
    if (i % 3 === 0) {
      elements.push(
        <circle
          key={`shape-${i}`}
          cx={x}
          cy={y}
          r={size / 2}
          fill={colors[colorIdx]}
          opacity={0.3 + random() * 0.4}
        />
      )
    } else if (i % 3 === 1) {
      elements.push(
        <rect
          key={`shape-${i}`}
          x={x - size / 2}
          y={y - size / 2}
          width={size}
          height={size}
          fill={colors[colorIdx]}
          opacity={0.3 + random() * 0.4}
          transform={`rotate(${rotation} ${x} ${y})`}
        />
      )
    } else {
      const points = Array.from({ length: 6 }, (_, j) => {
        const angle = (j / 6) * Math.PI * 2
        return `${x + Math.cos(angle) * size / 2},${y + Math.sin(angle) * size / 2}`
      }).join(' ')

      elements.push(
        <polygon
          key={`shape-${i}`}
          points={points}
          fill={colors[colorIdx]}
          opacity={0.3 + random() * 0.4}
          transform={`rotate(${rotation} ${x} ${y})`}
        />
      )
    }
  }

  // Add some connecting lines
  for (let i = 0; i < complexity; i++) {
    elements.push(
      <line
        key={`line-${i}`}
        x1={random() * width}
        y1={random() * height}
        x2={random() * width}
        y2={random() * height}
        stroke={colors[i % colors.length]}
        strokeWidth={1}
        opacity={0.3}
      />
    )
  }

  return { defs: null, content: <g style={{ filter: 'blur(1px)' }}>{elements}</g> }
}

// Gallery component for displaying multiple art pieces
interface ArtGalleryProps {
  count?: number
  className?: string
}

export function ArtGallery({ count = 6, className }: ArtGalleryProps) {
  const artworks = useMemo(() => {
    const types: PolarizationArtParams['type'][] = ['interference', 'birefringence', 'stress', 'rotation', 'abstract']
    const colorSets = [
      ['#ff00ff', '#00ffff', '#ffff00'],
      ['#ff4444', '#44ff44', '#4444ff'],
      ['#fbbf24', '#22d3ee', '#a78bfa'],
      ['#ff6b6b', '#4ecdc4', '#ffe66d'],
      ['#667eea', '#764ba2', '#f093fb']
    ]

    return Array.from({ length: count }, (_, i) => ({
      params: {
        type: types[i % types.length],
        colors: colorSets[i % colorSets.length],
        complexity: 5 + (i % 5)
      },
      seed: i * 12345
    }))
  }, [count])

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 ${className || ''}`}>
      {artworks.map((art, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <PolarizationArt
            params={art.params}
            seed={art.seed}
            width={200}
            height={200}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  )
}
