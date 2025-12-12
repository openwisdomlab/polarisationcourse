/**
 * Programmatically Generated Polarization Art
 * 程序生成的偏振艺术图形（SVG/Canvas）
 *
 * Scientific Basis:
 * - Interference: Based on thin-film interference and Michel-Levy color chart
 * - Birefringence: Simulates calcite crystal o-ray/e-ray splitting
 * - Stress: Models photoelastic stress patterns (isochromatic fringes)
 * - Rotation: Shows optical rotation in chiral media
 * - Abstract: Artistic interpretation of polarization states
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

/**
 * Calculate interference color based on optical path difference (OPD)
 * This approximates the Michel-Levy color chart used in polarized light microscopy
 * OPD in nm determines the interference color when viewed between crossed polarizers
 */
function getInterferenceColor(opdNm: number): string {
  // First-order colors (0-550nm)
  // Second-order colors (550-1100nm)
  // Third-order colors (1100-1650nm)
  const opd = Math.abs(opdNm) % 1650 // Wrap around for higher orders

  // Approximate Michel-Levy chart colors
  if (opd < 50) return 'rgb(20, 20, 20)' // Black/dark gray
  if (opd < 150) return 'rgb(80, 80, 80)' // Gray
  if (opd < 250) return 'rgb(255, 255, 240)' // White/cream
  if (opd < 350) return 'rgb(255, 255, 180)' // Pale yellow
  if (opd < 450) return 'rgb(255, 200, 100)' // Orange
  if (opd < 550) return 'rgb(255, 100, 100)' // Red (first order)
  if (opd < 650) return 'rgb(180, 100, 255)' // Violet (second order begins)
  if (opd < 750) return 'rgb(100, 150, 255)' // Blue
  if (opd < 850) return 'rgb(100, 255, 200)' // Blue-green
  if (opd < 950) return 'rgb(150, 255, 150)' // Green
  if (opd < 1050) return 'rgb(255, 255, 100)' // Yellow
  if (opd < 1150) return 'rgb(255, 150, 150)' // Pink/red (second order)
  if (opd < 1250) return 'rgb(200, 150, 255)' // Violet (third order)
  if (opd < 1350) return 'rgb(150, 200, 255)' // Blue
  if (opd < 1450) return 'rgb(180, 255, 200)' // Green
  return 'rgb(255, 220, 180)' // Pale orange
}

/**
 * Calculate polarization state color based on angle
 * Uses the standard polarization color convention
 */
function getPolarizationColor(angleDeg: number): string {
  const angle = ((angleDeg % 180) + 180) % 180 // Normalize to 0-180
  if (angle < 22.5 || angle >= 157.5) return '#ff4444' // 0° - Red (horizontal)
  if (angle < 67.5) return '#ffaa00' // 45° - Orange
  if (angle < 112.5) return '#44ff44' // 90° - Green (vertical)
  return '#4444ff' // 135° - Blue
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

/**
 * Generate interference pattern (concentric rings with Michel-Levy colors)
 * Simulates the appearance of a wedge of birefringent material viewed between
 * crossed polarizers, where the optical path difference increases with radius.
 *
 * Physics: OPD = thickness × birefringence × (ne - no)
 * The color depends on interference of o-ray and e-ray after passing through analyzer
 */
function generateInterference(
  random: () => number,
  colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const cx = width / 2 + (random() - 0.5) * 20
  const cy = height / 2 + (random() - 0.5) * 20
  const maxRadius = Math.max(width, height) * 0.7

  // Use Michel-Levy colors based on optical path difference
  // Each ring represents increasing OPD as if viewing a quartz wedge
  const ringCount = Math.floor(complexity * 5)
  const opdPerRing = 120 // nm per ring (typical for quartz wedge)

  const rings = []

  // Generate interference rings with proper colors
  for (let i = 0; i < ringCount; i++) {
    const radius = (maxRadius / ringCount) * (i + 1)
    const opd = i * opdPerRing + random() * 30 // Add slight randomness
    const color = getInterferenceColor(opd)
    const strokeWidth = (maxRadius / ringCount) * 1.2

    rings.push(
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={0.8}
      />
    )
  }

  // Add isogyre cross pattern (dark cross seen in conoscopic figure)
  // This appears when viewing uniaxial crystal along optic axis
  if (complexity > 5) {
    const crossOpacity = 0.4
    rings.push(
      <g key="isogyre" opacity={crossOpacity}>
        <line x1={cx - maxRadius} y1={cy} x2={cx + maxRadius} y2={cy}
          stroke="#000" strokeWidth={maxRadius * 0.03} />
        <line x1={cx} y1={cy - maxRadius} x2={cx} y2={cy + maxRadius}
          stroke="#000" strokeWidth={maxRadius * 0.03} />
      </g>
    )
  }

  // Add subtle polarization direction indicators at corners
  const indicatorSize = 15
  const indicators = [
    { x: 10, y: 10, angle: 0, label: 'P' },     // Polarizer
    { x: width - 25, y: 10, angle: 90, label: 'A' }, // Analyzer (crossed)
  ]

  indicators.forEach((ind, i) => {
    rings.push(
      <g key={`ind-${i}`} transform={`translate(${ind.x}, ${ind.y})`}>
        <line
          x1={indicatorSize / 2} y1={indicatorSize / 2}
          x2={indicatorSize / 2 + Math.cos(ind.angle * Math.PI / 180) * 10}
          y2={indicatorSize / 2 + Math.sin(ind.angle * Math.PI / 180) * 10}
          stroke={colors[0]} strokeWidth={2}
        />
        <text x={indicatorSize + 5} y={indicatorSize / 2 + 4}
          fill={colors[0]} fontSize="10" fontFamily="monospace">{ind.label}</text>
      </g>
    )
  })

  const defs = null

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

/**
 * Generate stress pattern (photoelastic isochromatic fringes)
 * Simulates stress-induced birefringence in transparent materials viewed
 * between crossed polarizers (photoelasticity).
 *
 * Physics:
 * - Stress induces birefringence proportional to principal stress difference
 * - Isochromatic lines connect points of equal stress (constant OPD)
 * - Colors follow Michel-Levy chart based on stress magnitude
 * - Isoclinic lines (dark) show directions of principal stresses
 */
function generateStress(
  random: () => number,
  _colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const elements = []
  const cx = width / 2
  const cy = height / 2

  // Sample outline (stressed object - beam with concentrated load)
  const beamWidth = width * 0.7
  const beamHeight = height * 0.4
  elements.push(
    <rect
      key="sample"
      x={cx - beamWidth / 2}
      y={cy - beamHeight / 2}
      width={beamWidth}
      height={beamHeight}
      fill="none"
      stroke="#444"
      strokeWidth={2}
      opacity={0.5}
    />
  )

  // Load point indicator
  elements.push(
    <g key="load">
      <polygon
        points={`${cx},${cy - beamHeight / 2 - 15} ${cx - 8},${cy - beamHeight / 2 - 30} ${cx + 8},${cy - beamHeight / 2 - 30}`}
        fill="#ff4444"
        opacity={0.7}
      />
      <text x={cx} y={cy - beamHeight / 2 - 35} textAnchor="middle" fill="#ff4444" fontSize="10">F</text>
    </g>
  )

  // Generate isochromatic fringes with Michel-Levy colors
  // The stress concentration creates a pattern radiating from load point
  const fringeCount = Math.floor(complexity * 4)
  const maxStressOPD = 1200 // Maximum OPD in nm at highest stress

  for (let i = 1; i <= fringeCount; i++) {
    const opd = (i / fringeCount) * maxStressOPD
    const color = getInterferenceColor(opd)

    // Create stress contour lines (elliptical/lobe pattern around load point)
    const lobeScale = 0.3 + (i / fringeCount) * 0.6
    const lobeWidth = beamWidth * lobeScale * 0.4
    const lobeHeight = beamHeight * lobeScale * 0.8

    // Two stress lobes below load point
    const d = `M ${cx - lobeWidth} ${cy}
               Q ${cx - lobeWidth * 0.5} ${cy + lobeHeight * 0.3}
                 ${cx} ${cy + lobeHeight * 0.5}
               Q ${cx + lobeWidth * 0.5} ${cy + lobeHeight * 0.3}
                 ${cx + lobeWidth} ${cy}`

    elements.push(
      <path
        key={`fringe-${i}`}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2 + random()}
        opacity={0.7}
      />
    )

    // Mirror for upper lobe (if complexity is high)
    if (complexity > 6 && i < fringeCount * 0.7) {
      const dUpper = `M ${cx - lobeWidth * 0.8} ${cy}
                      Q ${cx - lobeWidth * 0.4} ${cy - lobeHeight * 0.2}
                        ${cx} ${cy - lobeHeight * 0.3}
                      Q ${cx + lobeWidth * 0.4} ${cy - lobeHeight * 0.2}
                        ${cx + lobeWidth * 0.8} ${cy}`
      elements.push(
        <path
          key={`fringe-upper-${i}`}
          d={dUpper}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.5}
        />
      )
    }
  }

  // Add isoclinic line (dark band indicating principal stress direction)
  if (complexity > 4) {
    elements.push(
      <line
        key="isoclinic"
        x1={cx}
        y1={cy - beamHeight / 2}
        x2={cx}
        y2={cy + beamHeight / 2}
        stroke="#000"
        strokeWidth={3}
        opacity={0.3}
      />
    )
  }

  // Legend
  elements.push(
    <g key="legend" transform={`translate(${width - 60}, ${height - 50})`}>
      <text fill="#888" fontSize="8" fontFamily="monospace">Isochromatic</text>
      <text fill="#888" fontSize="8" fontFamily="monospace" y="12">Fringes</text>
    </g>
  )

  return { defs: null, content: <g>{elements}</g> }
}

/**
 * Generate optical rotation pattern
 * Shows the rotation of the polarization plane as light passes through
 * an optically active (chiral) medium like sugar solution or quartz.
 *
 * Physics:
 * - α = [α] × c × L (specific rotation × concentration × path length)
 * - D-glucose rotates clockwise (dextrorotatory)
 * - L-glucose rotates counterclockwise (levorotatory)
 * - The polarization direction rotates continuously through the medium
 */
function generateRotation(
  random: () => number,
  colors: string[],
  complexity: number,
  width: number,
  height: number
) {
  const cx = width / 2
  const cy = height / 2
  const elements = []

  // Draw polarization tube (sample cell)
  const tubeLength = width * 0.7
  const tubeHeight = height * 0.2
  const tubeY = cy - tubeHeight / 2

  elements.push(
    <rect
      key="tube"
      x={cx - tubeLength / 2}
      y={tubeY}
      width={tubeLength}
      height={tubeHeight}
      fill="none"
      stroke="#4488aa"
      strokeWidth={2}
      rx={tubeHeight / 4}
      opacity={0.5}
    />
  )

  // Draw rotating polarization vectors along the tube
  const vectorCount = Math.floor(complexity * 4)
  const totalRotation = complexity * 30 // Total rotation in degrees
  const vectorLength = tubeHeight * 0.35

  for (let i = 0; i <= vectorCount; i++) {
    const progress = i / vectorCount
    const x = cx - tubeLength / 2 + tubeLength * progress
    const angle = progress * totalRotation * (Math.PI / 180)

    // Polarization direction vector
    const dx = Math.cos(angle) * vectorLength
    const dy = Math.sin(angle) * vectorLength

    // Color based on polarization angle
    const polarColor = getPolarizationColor(progress * totalRotation)

    elements.push(
      <g key={`vec-${i}`}>
        {/* Polarization arrow */}
        <line
          x1={x}
          y1={cy - dy}
          x2={x}
          y2={cy + dy}
          stroke={polarColor}
          strokeWidth={2}
          opacity={0.8}
        />
        {/* Arrow head */}
        <circle
          cx={x}
          cy={cy - dy}
          r={3}
          fill={polarColor}
          opacity={0.8}
        />
      </g>
    )
  }

  // Draw the rotating polarization spiral (side view)
  const spiralY = cy + height * 0.25
  const spiralHeight = height * 0.15
  const spiralPoints: string[] = []

  for (let i = 0; i <= vectorCount * 3; i++) {
    const progress = i / (vectorCount * 3)
    const x = cx - tubeLength / 2 + tubeLength * progress
    const angle = progress * totalRotation * (Math.PI / 180)
    const y = spiralY + Math.sin(angle) * spiralHeight

    spiralPoints.push(`${x},${y}`)
  }

  elements.push(
    <polyline
      key="spiral"
      points={spiralPoints.join(' ')}
      fill="none"
      stroke={colors[0] || '#22d3ee'}
      strokeWidth={2}
      opacity={0.6}
    />
  )

  // Labels
  elements.push(
    <g key="labels">
      {/* Input polarization */}
      <text x={cx - tubeLength / 2 - 10} y={cy + 5} textAnchor="end" fill="#888" fontSize="9">
        P (0°)
      </text>
      {/* Output polarization */}
      <text x={cx + tubeLength / 2 + 10} y={cy + 5} textAnchor="start" fill="#888" fontSize="9">
        α = {Math.round(totalRotation)}°
      </text>
      {/* Medium label */}
      <text x={cx} y={tubeY - 8} textAnchor="middle" fill="#4488aa" fontSize="10">
        {random() > 0.5 ? 'D-glucose solution' : 'Quartz crystal'}
      </text>
    </g>
  )

  // Direction indicator
  elements.push(
    <g key="direction" transform={`translate(${cx + tubeLength * 0.3}, ${cy + height * 0.35})`}>
      <path
        d="M -10,0 A 10,10 0 1 1 10,0"
        fill="none"
        stroke={colors[0] || '#22d3ee'}
        strokeWidth={2}
      />
      <polygon
        points="10,0 5,-5 8,0"
        fill={colors[0] || '#22d3ee'}
      />
      <text x="0" y="15" textAnchor="middle" fill="#888" fontSize="8">
        Dextro
      </text>
    </g>
  )

  const defs = null

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
