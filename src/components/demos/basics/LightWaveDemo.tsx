/**
 * Light Wave Demo - Interactive 2D visualization of electromagnetic waves
 * Shows light as a transverse wave with oscillating E and B fields
 */
import { useState, useRef, useEffect } from 'react'
import { SliderControl, ControlPanel, ValueDisplay } from '../DemoControls'

export function LightWaveDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [wavelength, setWavelength] = useState(550) // nm
  const [amplitude, setAmplitude] = useState(50)
  const [speed, setSpeed] = useState(1)
  const [showBField, setShowBField] = useState(true)
  const [phase, setPhase] = useState(0)

  // Convert wavelength to RGB color
  const wavelengthToRGB = (wl: number): string => {
    let r = 0, g = 0, b = 0
    if (wl >= 380 && wl < 440) {
      r = -(wl - 440) / (440 - 380)
      b = 1
    } else if (wl >= 440 && wl < 490) {
      g = (wl - 440) / (490 - 440)
      b = 1
    } else if (wl >= 490 && wl < 510) {
      g = 1
      b = -(wl - 510) / (510 - 490)
    } else if (wl >= 510 && wl < 580) {
      r = (wl - 510) / (580 - 510)
      g = 1
    } else if (wl >= 580 && wl < 645) {
      r = 1
      g = -(wl - 645) / (645 - 580)
    } else if (wl >= 645 && wl <= 700) {
      r = 1
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2

    const animate = () => {
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, width, height)

      // Draw axes
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1

      // Horizontal axis (propagation direction)
      ctx.beginPath()
      ctx.moveTo(50, centerY)
      ctx.lineTo(width - 30, centerY)
      ctx.stroke()

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(width - 30, centerY)
      ctx.lineTo(width - 40, centerY - 5)
      ctx.lineTo(width - 40, centerY + 5)
      ctx.closePath()
      ctx.fillStyle = '#374151'
      ctx.fill()

      // Vertical axis (E field)
      ctx.beginPath()
      ctx.moveTo(50, centerY - amplitude - 30)
      ctx.lineTo(50, centerY + amplitude + 30)
      ctx.stroke()

      // Labels
      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px sans-serif'
      ctx.fillText('x', width - 25, centerY + 15)
      ctx.fillText('E', 55, centerY - amplitude - 15)
      if (showBField) {
        ctx.fillStyle = '#60a5fa'
        ctx.fillText('B', 55, centerY + amplitude + 25)
      }

      // Calculate wavelength scale (pixels per wavelength)
      const pixelsPerWavelength = 100 + (wavelength - 400) / 3

      // Draw E field wave
      const color = wavelengthToRGB(wavelength)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 50; x < width - 30; x++) {
        const waveX = (x - 50 + phase) / pixelsPerWavelength * 2 * Math.PI
        const y = centerY - amplitude * Math.sin(waveX)
        if (x === 50) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Draw B field wave (perpendicular, shown as dotted)
      if (showBField) {
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()

        for (let x = 50; x < width - 30; x++) {
          const waveX = (x - 50 + phase) / pixelsPerWavelength * 2 * Math.PI
          const y = centerY + amplitude * Math.cos(waveX) * 0.3 // Smaller amplitude for B field
          if (x === 50) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw wavelength marker
      const markerStart = 150
      const markerEnd = markerStart + pixelsPerWavelength

      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(markerStart, centerY + amplitude + 40)
      ctx.lineTo(markerStart, centerY + amplitude + 55)
      ctx.moveTo(markerEnd, centerY + amplitude + 40)
      ctx.lineTo(markerEnd, centerY + amplitude + 55)
      ctx.moveTo(markerStart, centerY + amplitude + 47)
      ctx.lineTo(markerEnd, centerY + amplitude + 47)
      ctx.stroke()

      ctx.fillStyle = '#9ca3af'
      ctx.font = '11px sans-serif'
      ctx.fillText(`λ = ${wavelength} nm`, (markerStart + markerEnd) / 2 - 30, centerY + amplitude + 68)

      // Speed display
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px sans-serif'
      ctx.fillText(`c = 3×10⁸ m/s`, width - 100, 30)

      setPhase(prev => prev + speed * 2)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [wavelength, amplitude, speed, showBField, phase])

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Canvas */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={700}
            height={350}
            className="w-full rounded-lg border border-gray-700/50"
          />
        </div>

        {/* Controls */}
        <ControlPanel title="Wave Parameters">
          <SliderControl
            label="Wavelength (λ)"
            value={wavelength}
            min={380}
            max={700}
            step={10}
            unit="nm"
            onChange={setWavelength}
          />
          <SliderControl
            label="Amplitude"
            value={amplitude}
            min={20}
            max={80}
            step={5}
            onChange={setAmplitude}
          />
          <SliderControl
            label="Animation Speed"
            value={speed}
            min={0}
            max={3}
            step={0.5}
            onChange={setSpeed}
          />
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="showBField"
              checked={showBField}
              onChange={(e) => setShowBField(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showBField" className="text-sm text-gray-300">
              Show B field (magnetic)
            </label>
          </div>

          <div className="mt-4 space-y-2">
            <ValueDisplay label="Color" value={wavelengthToRGB(wavelength)} />
            <div
              className="w-full h-6 rounded"
              style={{ backgroundColor: wavelengthToRGB(wavelength) }}
            />
          </div>
        </ControlPanel>
      </div>

      {/* Wavelength spectrum */}
      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Visible Light Spectrum</h4>
        <div
          className="h-8 rounded"
          style={{
            background: 'linear-gradient(to right, violet, blue, cyan, green, yellow, orange, red)',
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>380 nm (Violet)</span>
          <span>550 nm (Green)</span>
          <span>700 nm (Red)</span>
        </div>
      </div>
    </div>
  )
}
