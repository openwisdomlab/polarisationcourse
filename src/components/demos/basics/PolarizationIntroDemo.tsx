/**
 * Polarization Introduction Demo - Shows unpolarized vs polarized light
 * Interactive 2D visualization comparing random E-field directions with aligned ones
 */
import { useState, useRef, useEffect } from 'react'
import { SliderControl, ControlPanel } from '../DemoControls'

export function PolarizationIntroDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [polarizationAngle, setPolarizationAngle] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Generate random E-field directions for unpolarized light
    const randomAngles = Array.from({ length: 20 }, () => Math.random() * Math.PI * 2)

    const animate = () => {
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, width, height)

      // Draw two panels side by side
      const panelWidth = width / 2 - 20
      const centerX1 = width / 4
      const centerX2 = (3 * width) / 4
      const centerY = height / 2

      // Panel 1: Unpolarized light
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.strokeRect(10, 10, panelWidth, height - 20)

      ctx.fillStyle = '#9ca3af'
      ctx.font = '14px sans-serif'
      ctx.fillText('Unpolarized Light', centerX1 - 60, 35)

      // Draw random E-field vectors
      const arrowLength = 60
      randomAngles.forEach((angle, i) => {
        const phase = time * 0.05 * animationSpeed + i * 0.5
        const oscillation = Math.sin(phase)
        const currentLength = arrowLength * Math.abs(oscillation)

        const dx = Math.cos(angle) * currentLength
        const dy = Math.sin(angle) * currentLength

        // Use different colors for different vectors
        const hue = (angle / (Math.PI * 2)) * 360
        ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(centerX1, centerY)
        ctx.lineTo(centerX1 + dx, centerY + dy)
        ctx.stroke()

        // Arrow head
        const headSize = 8
        const headAngle = angle + (oscillation >= 0 ? 0 : Math.PI)
        ctx.beginPath()
        ctx.moveTo(centerX1 + dx, centerY + dy)
        ctx.lineTo(
          centerX1 + dx - headSize * Math.cos(headAngle - Math.PI / 6),
          centerY + dy - headSize * Math.sin(headAngle - Math.PI / 6)
        )
        ctx.moveTo(centerX1 + dx, centerY + dy)
        ctx.lineTo(
          centerX1 + dx - headSize * Math.cos(headAngle + Math.PI / 6),
          centerY + dy - headSize * Math.sin(headAngle + Math.PI / 6)
        )
        ctx.stroke()
      })

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX1, centerY, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#fbbf24'
      ctx.fill()

      // Panel 2: Polarized light
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.strokeRect(width / 2 + 10, 10, panelWidth, height - 20)

      ctx.fillStyle = '#9ca3af'
      ctx.font = '14px sans-serif'
      ctx.fillText('Polarized Light', centerX2 - 50, 35)

      // Draw aligned E-field vectors
      const polarAngleRad = (polarizationAngle * Math.PI) / 180
      const phase = time * 0.05 * animationSpeed
      const oscillation = Math.sin(phase)
      const currentLength = arrowLength * oscillation

      const dx = Math.cos(polarAngleRad) * currentLength
      const dy = Math.sin(polarAngleRad) * currentLength

      // Main vector
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX2 - dx, centerY - dy)
      ctx.lineTo(centerX2 + dx, centerY + dy)
      ctx.stroke()

      // Arrow heads on both ends
      const headSize = 10
      if (currentLength > 5) {
        const headAngle = polarAngleRad
        ctx.beginPath()
        ctx.moveTo(centerX2 + dx, centerY + dy)
        ctx.lineTo(
          centerX2 + dx - headSize * Math.cos(headAngle - Math.PI / 6),
          centerY + dy - headSize * Math.sin(headAngle - Math.PI / 6)
        )
        ctx.lineTo(
          centerX2 + dx - headSize * Math.cos(headAngle + Math.PI / 6),
          centerY + dy - headSize * Math.sin(headAngle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fillStyle = '#22d3ee'
        ctx.fill()
      }

      // Draw polarization direction indicator
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX2 - 80 * Math.cos(polarAngleRad), centerY - 80 * Math.sin(polarAngleRad))
      ctx.lineTo(centerX2 + 80 * Math.cos(polarAngleRad), centerY + 80 * Math.sin(polarAngleRad))
      ctx.stroke()
      ctx.setLineDash([])

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX2, centerY, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#22d3ee'
      ctx.fill()

      // Draw angle indicator
      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px sans-serif'
      ctx.fillText(`θ = ${polarizationAngle}°`, centerX2 + 70, centerY - 70)

      // Draw propagation direction arrow
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX1, height - 50)
      ctx.lineTo(centerX1, height - 30)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX1, height - 30)
      ctx.lineTo(centerX1 - 5, height - 40)
      ctx.lineTo(centerX1 + 5, height - 40)
      ctx.closePath()
      ctx.fill()
      ctx.fillText('k (into page)', centerX1 - 35, height - 15)

      ctx.beginPath()
      ctx.moveTo(centerX2, height - 50)
      ctx.lineTo(centerX2, height - 30)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX2, height - 30)
      ctx.lineTo(centerX2 - 5, height - 40)
      ctx.lineTo(centerX2 + 5, height - 40)
      ctx.closePath()
      ctx.fill()
      ctx.fillText('k (into page)', centerX2 - 35, height - 15)

      setTime(prev => prev + 1)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [polarizationAngle, animationSpeed, time])

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Canvas */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={700}
            height={400}
            className="w-full rounded-lg border border-gray-700/50"
          />
        </div>

        {/* Controls */}
        <ControlPanel title="Parameters">
          <SliderControl
            label="Polarization Angle"
            value={polarizationAngle}
            min={0}
            max={180}
            step={15}
            unit="°"
            onChange={setPolarizationAngle}
          />
          <SliderControl
            label="Animation Speed"
            value={animationSpeed}
            min={0}
            max={3}
            step={0.5}
            onChange={setAnimationSpeed}
          />

          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Key Concepts</h4>
            <div className="text-xs text-gray-400 space-y-2">
              <p>
                <span className="text-yellow-400">Unpolarized:</span> E-field oscillates in random directions
              </p>
              <p>
                <span className="text-cyan-400">Polarized:</span> E-field oscillates in a single plane
              </p>
            </div>
          </div>
        </ControlPanel>
      </div>

      {/* Info panel */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
          <h4 className="text-sm font-semibold text-yellow-400 mb-2">Unpolarized Light</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Electric field direction changes randomly over time</li>
            <li>• Natural light sources (sun, bulbs) emit unpolarized light</li>
            <li>• No preferred oscillation direction</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-cyan-400/10 border border-cyan-400/30">
          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Polarized Light</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Electric field oscillates in a single plane</li>
            <li>• Created by polarizers, reflection, or scattering</li>
            <li>• Polarization angle defines the oscillation plane</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
