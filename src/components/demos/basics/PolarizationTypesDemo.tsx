/**
 * Polarization Types Demo - Shows linear, circular, and elliptical polarization
 * Interactive 2D visualization with Lissajous figures
 */
import { useState, useRef, useEffect } from 'react'
import { SliderControl, ControlPanel } from '../DemoControls'

type PolarizationType = 'linear' | 'circular' | 'elliptical'

export function PolarizationTypesDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [polarizationType, setPolarizationType] = useState<PolarizationType>('linear')
  const [linearAngle, setLinearAngle] = useState(45)
  const [ellipseRatio, setEllipseRatio] = useState(0.5) // ratio of minor to major axis
  const [circularDirection, setCircularDirection] = useState<'right' | 'left'>('right')
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [time, setTime] = useState(0)
  const [showTrail, setShowTrail] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = 120

    const animate = () => {
      // Clear with slight fade for trail effect
      if (showTrail) {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'
      } else {
        ctx.fillStyle = '#0a0a0f'
      }
      ctx.fillRect(0, 0, width, height)

      // Draw axes
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX - radius - 30, centerY)
      ctx.lineTo(centerX + radius + 30, centerY)
      ctx.moveTo(centerX, centerY - radius - 30)
      ctx.lineTo(centerX, centerY + radius + 30)
      ctx.stroke()

      // Axis labels
      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px sans-serif'
      ctx.fillText('Ex', centerX + radius + 35, centerY + 4)
      ctx.fillText('Ey', centerX + 4, centerY - radius - 35)

      // Calculate E-field position based on polarization type
      const phase = time * 0.03 * animationSpeed
      let ex = 0, ey = 0, trailPoints: Array<{x: number, y: number}> = []

      if (polarizationType === 'linear') {
        const angleRad = (linearAngle * Math.PI) / 180
        const oscillation = Math.sin(phase)
        ex = radius * Math.cos(angleRad) * oscillation
        ey = radius * Math.sin(angleRad) * oscillation

        // Trail for linear
        for (let t = 0; t < 100; t++) {
          const p = (time - t) * 0.03 * animationSpeed
          const osc = Math.sin(p)
          trailPoints.push({
            x: centerX + radius * Math.cos(angleRad) * osc,
            y: centerY - radius * Math.sin(angleRad) * osc
          })
        }
      } else if (polarizationType === 'circular') {
        const direction = circularDirection === 'right' ? 1 : -1
        ex = radius * Math.cos(phase)
        ey = radius * Math.sin(phase * direction)

        // Trail for circular
        for (let t = 0; t < 100; t++) {
          const p = (time - t) * 0.03 * animationSpeed
          trailPoints.push({
            x: centerX + radius * Math.cos(p),
            y: centerY - radius * Math.sin(p * direction)
          })
        }
      } else { // elliptical
        const direction = circularDirection === 'right' ? 1 : -1
        ex = radius * Math.cos(phase)
        ey = radius * ellipseRatio * Math.sin(phase * direction)

        // Trail for elliptical
        for (let t = 0; t < 100; t++) {
          const p = (time - t) * 0.03 * animationSpeed
          trailPoints.push({
            x: centerX + radius * Math.cos(p),
            y: centerY - radius * ellipseRatio * Math.sin(p * direction)
          })
        }
      }

      // Draw trail
      if (showTrail && trailPoints.length > 1) {
        ctx.beginPath()
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y)
        trailPoints.forEach((point, i) => {
          if (i > 0) ctx.lineTo(point.x, point.y)
        })
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw reference shape
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])

      if (polarizationType === 'linear') {
        const angleRad = (linearAngle * Math.PI) / 180
        ctx.beginPath()
        ctx.moveTo(centerX - radius * Math.cos(angleRad), centerY + radius * Math.sin(angleRad))
        ctx.lineTo(centerX + radius * Math.cos(angleRad), centerY - radius * Math.sin(angleRad))
        ctx.stroke()
      } else if (polarizationType === 'circular') {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radius, radius * ellipseRatio, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Draw E-field vector
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + ex, centerY - ey)
      ctx.stroke()

      // Arrow head
      const angle = Math.atan2(-ey, ex)
      const headSize = 12
      ctx.beginPath()
      ctx.moveTo(centerX + ex, centerY - ey)
      ctx.lineTo(
        centerX + ex - headSize * Math.cos(angle - Math.PI / 6),
        centerY - ey + headSize * Math.sin(angle - Math.PI / 6)
      )
      ctx.lineTo(
        centerX + ex - headSize * Math.cos(angle + Math.PI / 6),
        centerY - ey + headSize * Math.sin(angle + Math.PI / 6)
      )
      ctx.closePath()
      ctx.fillStyle = '#22d3ee'
      ctx.fill()

      // Draw tip point
      ctx.beginPath()
      ctx.arc(centerX + ex, centerY - ey, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#fbbf24'
      ctx.fill()

      // Draw center point
      ctx.beginPath()
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#9ca3af'
      ctx.fill()

      // Labels
      ctx.fillStyle = '#9ca3af'
      ctx.font = '14px sans-serif'
      let typeLabel = ''
      if (polarizationType === 'linear') typeLabel = 'Linear Polarization'
      else if (polarizationType === 'circular') typeLabel = `${circularDirection === 'right' ? 'Right' : 'Left'}-Circular Polarization`
      else typeLabel = 'Elliptical Polarization'

      ctx.fillText(typeLabel, 20, 30)

      // Phase display
      const phaseDeg = ((phase * 180 / Math.PI) % 360).toFixed(0)
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px sans-serif'
      ctx.fillText(`φ = ${phaseDeg}°`, width - 80, 30)

      setTime(prev => prev + 1)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [polarizationType, linearAngle, ellipseRatio, circularDirection, animationSpeed, showTrail, time])

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Canvas */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full rounded-lg border border-gray-700/50"
          />
        </div>

        {/* Controls */}
        <ControlPanel title="Polarization Controls">
          {/* Type selector */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-2">Polarization Type</label>
            <div className="grid grid-cols-3 gap-1">
              {(['linear', 'circular', 'elliptical'] as PolarizationType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setPolarizationType(type)}
                  className={`px-2 py-1.5 text-xs rounded capitalize transition-all ${
                    polarizationType === type
                      ? 'bg-cyan-400 text-black'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional controls */}
          {polarizationType === 'linear' && (
            <SliderControl
              label="Polarization Angle"
              value={linearAngle}
              min={0}
              max={180}
              step={15}
              unit="°"
              onChange={setLinearAngle}
            />
          )}

          {(polarizationType === 'circular' || polarizationType === 'elliptical') && (
            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-2">Rotation Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCircularDirection('right')}
                  className={`px-3 py-1.5 text-xs rounded transition-all ${
                    circularDirection === 'right'
                      ? 'bg-green-400 text-black'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Right (CW)
                </button>
                <button
                  onClick={() => setCircularDirection('left')}
                  className={`px-3 py-1.5 text-xs rounded transition-all ${
                    circularDirection === 'left'
                      ? 'bg-purple-400 text-black'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Left (CCW)
                </button>
              </div>
            </div>
          )}

          {polarizationType === 'elliptical' && (
            <SliderControl
              label="Ellipse Ratio (b/a)"
              value={ellipseRatio}
              min={0.1}
              max={0.9}
              step={0.1}
              onChange={setEllipseRatio}
            />
          )}

          <SliderControl
            label="Animation Speed"
            value={animationSpeed}
            min={0}
            max={3}
            step={0.5}
            onChange={setAnimationSpeed}
          />

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="showTrail"
              checked={showTrail}
              onChange={(e) => setShowTrail(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showTrail" className="text-sm text-gray-300">
              Show trail
            </label>
          </div>
        </ControlPanel>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border transition-all ${
          polarizationType === 'linear' ? 'bg-orange-400/20 border-orange-400/50' : 'bg-slate-800/50 border-slate-700/50'
        }`}>
          <h4 className="text-sm font-semibold text-orange-400 mb-2">Linear</h4>
          <p className="text-xs text-gray-300">
            E-field oscillates along a straight line. Phase difference δ = 0° or 180°.
          </p>
        </div>
        <div className={`p-4 rounded-lg border transition-all ${
          polarizationType === 'circular' ? 'bg-green-400/20 border-green-400/50' : 'bg-slate-800/50 border-slate-700/50'
        }`}>
          <h4 className="text-sm font-semibold text-green-400 mb-2">Circular</h4>
          <p className="text-xs text-gray-300">
            E-field rotates in a circle. δ = ±90° with equal Ex and Ey amplitudes.
          </p>
        </div>
        <div className={`p-4 rounded-lg border transition-all ${
          polarizationType === 'elliptical' ? 'bg-purple-400/20 border-purple-400/50' : 'bg-slate-800/50 border-slate-700/50'
        }`}>
          <h4 className="text-sm font-semibold text-purple-400 mb-2">Elliptical</h4>
          <p className="text-xs text-gray-300">
            E-field traces an ellipse. General case with arbitrary phase and amplitudes.
          </p>
        </div>
      </div>
    </div>
  )
}
