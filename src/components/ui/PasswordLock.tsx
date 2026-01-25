/**
 * PasswordLock - Entry password screen with dual polarizer puzzle
 * 密码锁组件 - 通过调整两个偏振片观察光通过的场景来解开密码
 *
 * Physics simulation:
 * - Light source emits unpolarized light
 * - First polarizer (P1) filters light to linear polarization
 * - Second polarizer (P2/Analyzer) follows Malus's Law: I = I₀ × cos²(θ)
 * - Password becomes visible when intensity is high enough
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Lock, Unlock, RotateCcw, Info } from 'lucide-react'

interface PasswordLockProps {
  onUnlock: () => void
  correctPassword?: string
}

// Polarizer component with rotation handle
function Polarizer({
  id,
  angle,
  onChange,
  label,
  labelZh,
  isZh,
  color,
  disabled = false,
}: {
  id: string
  angle: number
  onChange: (angle: number) => void
  label: string
  labelZh: string
  isZh: boolean
  color: string
  disabled?: boolean
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const rect = document.getElementById(`polarizer-${id}`)?.getBoundingClientRect()
      if (rect) {
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const newAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90
        onChange(((newAngle % 360) + 360) % 360)
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, onChange, handleMouseUp, id])

  return (
    <div className="flex flex-col items-center">
      <div
        id={`polarizer-${id}`}
        className={cn(
          'relative w-24 h-24 md:w-28 md:h-28 rounded-full transition-all duration-200',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing',
          isDragging && 'ring-4 ring-white/30 scale-105'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          background: `conic-gradient(from ${angle}deg,
            transparent 0deg,
            ${color}20 20deg,
            ${color}40 40deg,
            ${color}20 60deg,
            transparent 80deg,
            transparent 90deg,
            transparent 180deg,
            ${color}20 200deg,
            ${color}40 220deg,
            ${color}20 240deg,
            transparent 260deg,
            transparent 270deg,
            transparent 360deg
          )`,
          border: `3px solid ${color}`,
          boxShadow: `0 0 20px ${color}40, inset 0 0 30px ${color}20`,
        }}
      >
        {/* Polarization lines */}
        <div
          className="absolute inset-2 rounded-full overflow-hidden"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-[2px] rounded-full"
              style={{
                height: '100%',
                left: `${10 + i * 10}%`,
                background: `linear-gradient(to bottom, transparent, ${color}60, transparent)`,
              }}
            />
          ))}
        </div>

        {/* Rotation indicator */}
        <div
          className="absolute inset-3 rounded-full flex items-start justify-center"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div
            className="w-1.5 h-8 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${color}, ${color}60)`,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </div>

        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>

      {/* Label and angle */}
      <div className="mt-3 text-center">
        <div className="text-sm font-medium text-gray-300">
          {isZh ? labelZh : label}
        </div>
        <div
          className="text-lg font-mono font-bold"
          style={{ color }}
        >
          {Math.round(angle)}°
        </div>
      </div>
    </div>
  )
}

// Light beam visualization passing through polarizers
function LightBeamVisualization({
  p1Angle,
  p2Angle,
  intensity,
}: {
  p1Angle: number
  p2Angle: number
  intensity: number
}) {
  // Generate wave points for the light beam
  const generateWave = (startX: number, endX: number, amplitude: number, opacity: number) => {
    const points: string[] = []
    const segments = 40
    for (let i = 0; i <= segments; i++) {
      const x = startX + (endX - startX) * (i / segments)
      const y = 50 + Math.sin((i / segments) * Math.PI * 8) * amplitude
      points.push(`${x},${y}`)
    }
    return { points: points.join(' '), opacity }
  }

  // Light before P1: unpolarized (show multiple overlapping waves)
  const unpolarizedWaves = useMemo(() => [
    generateWave(0, 140, 15, 0.5),
    generateWave(0, 140, 12, 0.4),
    generateWave(0, 140, 10, 0.3),
  ], [])

  // Light between P1 and P2: polarized at P1 angle
  const polarizedWave = useMemo(() =>
    generateWave(160, 340, 12, 0.8)
  , [])

  // Light after P2: intensity based on Malus's Law
  const outputWave = useMemo(() =>
    generateWave(360, 500, 12 * intensity, intensity * 0.9)
  , [intensity])

  return (
    <svg viewBox="0 0 500 100" className="w-full h-20 md:h-24">
      <defs>
        {/* Glow filter */}
        <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Light source gradient */}
        <radialGradient id="light-source" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
        </radialGradient>

        {/* Polarizer gradient */}
        <linearGradient id="p1-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="p2-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Light source */}
      <circle cx="10" cy="50" r="12" fill="url(#light-source)" filter="url(#beam-glow)" />

      {/* Unpolarized light - multiple directions */}
      <g opacity="0.7">
        {unpolarizedWaves.map((wave, i) => (
          <polyline
            key={`unpol-${i}`}
            points={wave.points}
            fill="none"
            stroke="#fef08a"
            strokeWidth="2"
            opacity={wave.opacity}
            filter="url(#beam-glow)"
            style={{
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: '70px 50px',
            }}
          />
        ))}
      </g>

      {/* First polarizer (P1) */}
      <g transform={`rotate(${p1Angle}, 150, 50)`}>
        <rect x="145" y="20" width="10" height="60" fill="url(#p1-gradient)" rx="2" />
        {/* Polarization lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`p1-line-${i}`}
            x1="150"
            y1={25 + i * 12}
            x2="150"
            y2={30 + i * 12}
            stroke="#22d3ee"
            strokeWidth="2"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Polarized light between P1 and P2 */}
      <g style={{ transform: `rotate(${p1Angle}deg)`, transformOrigin: '250px 50px' }}>
        <polyline
          points={polarizedWave.points}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
          opacity={polarizedWave.opacity}
          filter="url(#beam-glow)"
        />
      </g>

      {/* Second polarizer (P2 / Analyzer) */}
      <g transform={`rotate(${p2Angle}, 350, 50)`}>
        <rect x="345" y="20" width="10" height="60" fill="url(#p2-gradient)" rx="2" />
        {/* Polarization lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`p2-line-${i}`}
            x1="350"
            y1={25 + i * 12}
            x2="350"
            y2={30 + i * 12}
            stroke="#a855f7"
            strokeWidth="2"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Output light - intensity based on Malus's Law */}
      {intensity > 0.05 && (
        <polyline
          points={outputWave.points}
          fill="none"
          stroke={`rgba(168, 85, 247, ${0.5 + intensity * 0.5})`}
          strokeWidth={1.5 + intensity * 2}
          opacity={outputWave.opacity}
          filter="url(#beam-glow)"
        />
      )}

      {/* Detector/Screen */}
      <rect
        x="488"
        y="30"
        width="8"
        height="40"
        fill={`rgba(168, 85, 247, ${0.2 + intensity * 0.6})`}
        stroke="#a855f7"
        strokeWidth="1"
        rx="2"
        style={{
          boxShadow: intensity > 0.5 ? `0 0 ${intensity * 20}px #a855f7` : 'none',
        }}
      />

      {/* Labels */}
      <text x="10" y="90" fill="#fbbf24" fontSize="8" textAnchor="middle" opacity="0.8">
        Light
      </text>
      <text x="150" y="90" fill="#22d3ee" fontSize="8" textAnchor="middle" opacity="0.8">
        P₁
      </text>
      <text x="350" y="90" fill="#a855f7" fontSize="8" textAnchor="middle" opacity="0.8">
        P₂
      </text>
    </svg>
  )
}

// Intensity meter with Malus's Law formula
function IntensityMeter({
  intensity,
  angleDiff,
  isZh,
}: {
  intensity: number
  angleDiff: number
  isZh: boolean
}) {
  const percentage = Math.round(intensity * 100)
  const barColor = intensity > 0.7 ? '#22c55e' : intensity > 0.3 ? '#eab308' : '#ef4444'

  return (
    <div className="w-full max-w-sm">
      {/* Formula display */}
      <div className="text-center mb-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-xs text-gray-400 mb-1">
          {isZh ? '马吕斯定律' : "Malus's Law"}
        </div>
        <div className="font-mono text-sm text-cyan-400">
          I = I₀ × cos²({Math.round(angleDiff)}°) = <span className="text-white font-bold">{percentage}%</span>
        </div>
      </div>

      {/* Intensity bar */}
      <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
            boxShadow: `0 0 10px ${barColor}60`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-white drop-shadow-lg">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center mt-2 text-xs">
        {intensity > 0.9 ? (
          <span className="text-emerald-400 font-medium">
            {isZh ? '[ 光束最强 - 密码可见 ]' : '[ Maximum brightness - Password visible ]'}
          </span>
        ) : intensity > 0.5 ? (
          <span className="text-yellow-400">
            {isZh ? '继续调整...' : 'Keep adjusting...'}
          </span>
        ) : (
          <span className="text-gray-500">
            {isZh ? '光强太弱' : 'Light too dim'}
          </span>
        )}
      </div>
    </div>
  )
}

// Password display that reveals based on light intensity
function PasswordDisplay({
  password,
  intensity,
}: {
  password: string
  intensity: number
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 rounded-xl border-2 transition-all duration-500',
        'bg-slate-800/30 backdrop-blur-sm',
        intensity > 0.9 ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/20' : 'border-slate-700'
      )}
    >
      <div className="flex gap-3 justify-center">
        {password.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block font-mono font-bold text-3xl md:text-4xl text-purple-400 transition-all duration-300"
            style={{
              opacity: 0.05 + intensity * 0.95,
              filter: `blur(${(1 - intensity) * 10}px)`,
              transform: `scale(${0.7 + intensity * 0.3})`,
              textShadow: intensity > 0.8 ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}

export function PasswordLock({ onUnlock, correctPassword = 'POLAR' }: PasswordLockProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Two polarizer angles - both start misaligned
  const [p1Angle, setP1Angle] = useState(0)    // First polarizer (fixed at 45° is target)
  const [p2Angle, setP2Angle] = useState(90)   // Second polarizer (analyzer)

  const [inputPassword, setInputPassword] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Calculate intensity using Malus's Law: I = I₀ × cos²(θ)
  const angleDiff = Math.abs(p1Angle - p2Angle)
  const normalizedDiff = Math.min(angleDiff, 180 - Math.abs(angleDiff - 180))
  const intensity = Math.pow(Math.cos((normalizedDiff * Math.PI) / 180), 2)

  // Password revealed when intensity is high enough
  useEffect(() => {
    if (intensity > 0.9) {
      setIsRevealed(true)
    }
  }, [intensity])

  const handleSubmit = () => {
    if (inputPassword.toUpperCase() === correctPassword) {
      localStorage.setItem('polarcraft_unlocked', 'true')
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setError(false)
      }, 600)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleReset = () => {
    setP1Angle(0)
    setP2Angle(90)
    setIsRevealed(false)
    setInputPassword('')
    setShowHint(false)
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4',
        'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      )}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(34, 211, 238, 0.1) 40px,
              rgba(34, 211, 238, 0.1) 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(168, 85, 247, 0.1) 40px,
              rgba(168, 85, 247, 0.1) 41px
            )
          `,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl w-full">
        {/* Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {isRevealed ? (
              <Unlock className="w-7 h-7 text-emerald-400" />
            ) : (
              <Lock className="w-7 h-7 text-cyan-400" />
            )}
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {isZh ? '偏振光密码锁' : 'Polarization Lock'}
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            {isZh
              ? '调整两个偏振片的角度，使它们对齐以让最多光通过'
              : 'Rotate both polarizers to align them and let maximum light through'}
          </p>
        </div>

        {/* Light beam visualization */}
        <div className="w-full bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <LightBeamVisualization
            p1Angle={p1Angle}
            p2Angle={p2Angle}
            intensity={intensity}
          />
        </div>

        {/* Two polarizer controls */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <Polarizer
            id="p1"
            angle={p1Angle}
            onChange={setP1Angle}
            label="Polarizer 1"
            labelZh="偏振片 1"
            isZh={isZh}
            color="#22d3ee"
          />
          <Polarizer
            id="p2"
            angle={p2Angle}
            onChange={setP2Angle}
            label="Polarizer 2"
            labelZh="偏振片 2"
            isZh={isZh}
            color="#a855f7"
          />
        </div>

        {/* Intensity meter */}
        <IntensityMeter
          intensity={intensity}
          angleDiff={normalizedDiff}
          isZh={isZh}
        />

        {/* Password display */}
        <PasswordDisplay password={correctPassword} intensity={intensity} />

        {/* Password input - shown when revealed */}
        {isRevealed && (
          <div
            className={cn(
              'flex flex-col items-center gap-4 animate-fade-in',
              shake && 'animate-shake'
            )}
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                placeholder={isZh ? '输入密码...' : 'Enter password...'}
                className={cn(
                  'px-4 py-2.5 rounded-lg border-2 bg-slate-800/80 text-white',
                  'font-mono text-lg uppercase tracking-wider w-40',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                  'placeholder:text-gray-600',
                  error
                    ? 'border-red-500'
                    : 'border-slate-600 focus:border-purple-500'
                )}
                maxLength={correctPassword.length}
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className={cn(
                  'px-6 py-2.5 rounded-lg font-medium transition-all',
                  'bg-gradient-to-r from-purple-600 to-cyan-600',
                  'hover:from-purple-500 hover:to-cyan-500 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/50'
                )}
              >
                {isZh ? '进入' : 'Enter'}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm">
                {isZh ? '密码错误，请重试' : 'Incorrect password, try again'}
              </p>
            )}
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm',
              'text-gray-500 hover:text-gray-300 transition-colors',
              'hover:bg-slate-800/50'
            )}
          >
            <RotateCcw className="w-4 h-4" />
            {isZh ? '重置' : 'Reset'}
          </button>

          <button
            onClick={() => setShowHint(!showHint)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm',
              'text-gray-500 hover:text-gray-300 transition-colors',
              'hover:bg-slate-800/50',
              showHint && 'text-cyan-400'
            )}
          >
            <Info className="w-4 h-4" />
            {isZh ? '提示' : 'Hint'}
          </button>
        </div>

        {/* Hint panel */}
        {showHint && (
          <div className="text-center text-xs text-gray-500 bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700 max-w-sm animate-fade-in">
            <p className="mb-1 font-medium text-gray-400">
              {isZh ? '物理原理' : 'Physics Principle'}
            </p>
            <p>
              {isZh
                ? '当两个偏振片的偏振方向平行（角度差为0°或180°）时，光强最大。角度差为90°时，光被完全阻挡。'
                : 'When two polarizers are parallel (0° or 180° difference), light intensity is maximum. At 90° difference, light is completely blocked.'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default PasswordLock
