/**
 * PasswordLock - Entry password screen with dual polarizer puzzle
 * 密码锁组件 - 通过调整两个偏振片观察光通过的场景来解开密码
 *
 * Physics simulation based on Malus's Law:
 * - Light source emits unpolarized light
 * - First polarizer (P1) filters light to linear polarization at angle θ₁
 * - Second polarizer (P2/Analyzer) at angle θ₂
 * - Output intensity: I = I₀ × cos²(θ₂ - θ₁)
 *
 * Key physics principles:
 * - θ = 0° (parallel): cos²(0°) = 1 → 100% transmission
 * - θ = 45°: cos²(45°) = 0.5 → 50% transmission
 * - θ = 90° (crossed): cos²(90°) = 0 → 0% transmission
 * - Polarizers have 180° symmetry: 0° ≡ 180°, 45° ≡ 225°, etc.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Lock, Unlock, RotateCcw, Info } from 'lucide-react'

interface PasswordLockProps {
  onUnlock: () => void
  correctPassword?: string
}

/**
 * Calculate the effective angle difference between two polarizers
 * Accounts for 180° symmetry of polarizers
 * Returns angle in range [0, 90] for display purposes
 */
function calculateEffectiveAngle(p1: number, p2: number): number {
  // Normalize angles to [0, 180) due to polarizer symmetry
  const a1 = ((p1 % 180) + 180) % 180
  const a2 = ((p2 % 180) + 180) % 180

  // Calculate difference
  let diff = Math.abs(a1 - a2)

  // Normalize to [0, 90] for intuitive display
  // (90° is max blocking, 0° is max transmission)
  if (diff > 90) diff = 180 - diff

  return diff
}

/**
 * Calculate light intensity using Malus's Law
 * I = I₀ × cos²(θ) where θ is the angle between polarizer axes
 */
function calculateIntensity(effectiveAngle: number): number {
  const theta = effectiveAngle * Math.PI / 180
  return Math.pow(Math.cos(theta), 2)
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
        const rawAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90
        // Normalize to [0, 180) since polarizers have 180° symmetry
        const newAngle = ((rawAngle % 180) + 180) % 180
        onChange(newAngle)
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

  // Display angle normalized to [0, 180)
  const displayAngle = ((angle % 180) + 180) % 180

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
          background: `radial-gradient(circle at center, ${color}10 0%, ${color}05 50%, transparent 70%)`,
          border: `3px solid ${color}`,
          boxShadow: `0 0 20px ${color}40, inset 0 0 30px ${color}10`,
        }}
      >
        {/* Polarization lines - show transmission axis direction */}
        <div
          className="absolute inset-2 rounded-full overflow-hidden"
          style={{ transform: `rotate(${displayAngle}deg)` }}
        >
          {/* Main transmission axis line (thicker, brighter) */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
            style={{
              background: `linear-gradient(to bottom, ${color}80, ${color}, ${color}80)`,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          {/* Secondary lines (thinner, dimmer) */}
          {[-3, -2, -1, 1, 2, 3].map((offset) => (
            <div
              key={offset}
              className="absolute top-0 bottom-0 w-[1px]"
              style={{
                left: `calc(50% + ${offset * 8}px)`,
                background: `linear-gradient(to bottom, transparent, ${color}40, transparent)`,
              }}
            />
          ))}
        </div>

        {/* Rotation indicator arrow */}
        <div
          className="absolute inset-3 rounded-full flex items-start justify-center"
          style={{ transform: `rotate(${displayAngle}deg)` }}
        >
          <div
            className="w-2 h-8 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${color}, ${color}80)`,
              boxShadow: `0 0 10px ${color}`,
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
          {Math.round(displayAngle)}°
        </div>
      </div>
    </div>
  )
}

/**
 * Simplified light beam visualization
 * Shows: Light source → P1 (polarizer) → P2 (analyzer) → Detector
 * Focus on: Rotating polarizers and seeing the intensity change
 */
function LightBeamVisualization({
  p1Angle,
  p2Angle,
  intensity,
  effectiveAngle,
}: {
  p1Angle: number
  p2Angle: number
  intensity: number
  effectiveAngle: number
}) {
  // Normalize angles for display (0-180 due to polarizer symmetry)
  const p1Display = ((p1Angle % 180) + 180) % 180
  const p2Display = ((p2Angle % 180) + 180) % 180

  return (
    <svg viewBox="0 0 400 90" className="w-full h-24">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="light-src" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="60%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Light source */}
      <circle cx="25" cy="45" r="15" fill="url(#light-src)" filter="url(#glow)" />
      <text x="25" y="75" fill="#fbbf24" fontSize="9" textAnchor="middle">光源</text>

      {/* Light beam: Source → P1 */}
      <line x1="42" y1="45" x2="85" y2="45" stroke="#fef08a" strokeWidth="6" opacity="0.7" filter="url(#glow)" />

      {/* P1 Polarizer */}
      <g transform={`rotate(${p1Display}, 100, 45)`}>
        <rect x="93" y="15" width="14" height="60" fill="rgba(34, 211, 238, 0.25)" stroke="#22d3ee" strokeWidth="2" rx="3" />
        {/* Transmission axis lines */}
        <line x1="100" y1="18" x2="100" y2="72" stroke="#22d3ee" strokeWidth="3" />
        {[25, 35, 45, 55, 65].map(y => (
          <line key={y} x1="95" y1={y} x2="105" y2={y} stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
        ))}
      </g>
      <text x="100" y="82" fill="#22d3ee" fontSize="9" textAnchor="middle" fontWeight="600">
        P₁ {Math.round(p1Display)}°
      </text>

      {/* Light beam: P1 → P2 (polarized) */}
      <line x1="115" y1="45" x2="185" y2="45" stroke="#22d3ee" strokeWidth="5" opacity="0.8" filter="url(#glow)" />

      {/* P2 Polarizer (Analyzer) */}
      <g transform={`rotate(${p2Display}, 200, 45)`}>
        <rect x="193" y="15" width="14" height="60" fill="rgba(168, 85, 247, 0.25)" stroke="#a855f7" strokeWidth="2" rx="3" />
        {/* Transmission axis lines */}
        <line x1="200" y1="18" x2="200" y2="72" stroke="#a855f7" strokeWidth="3" />
        {[25, 35, 45, 55, 65].map(y => (
          <line key={y} x1="195" y1={y} x2="205" y2={y} stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
        ))}
      </g>
      <text x="200" y="82" fill="#a855f7" fontSize="9" textAnchor="middle" fontWeight="600">
        P₂ {Math.round(p2Display)}°
      </text>

      {/* Light beam: P2 → Detector (intensity varies) */}
      {intensity > 0.02 && (
        <line
          x1="215"
          y1="45"
          x2="280"
          y2="45"
          stroke="#a855f7"
          strokeWidth={2 + intensity * 4}
          opacity={0.3 + intensity * 0.7}
          filter="url(#glow)"
        />
      )}

      {/* Detector */}
      <rect
        x="285"
        y="20"
        width="15"
        height="50"
        fill={`rgba(168, 85, 247, ${0.15 + intensity * 0.6})`}
        stroke="#a855f7"
        strokeWidth="2"
        rx="3"
      />
      {intensity > 0.5 && (
        <rect
          x="285"
          y="20"
          width="15"
          height="50"
          fill="none"
          stroke="#a855f7"
          strokeWidth={intensity * 8}
          rx="3"
          opacity={intensity * 0.5}
          filter="url(#glow)"
        />
      )}
      <text x="292" y="82" fill="#a855f7" fontSize="9" textAnchor="middle">检测</text>

      {/* Angle and intensity display */}
      <g transform="translate(355, 45)">
        <rect x="-35" y="-30" width="70" height="60" fill="rgba(15, 23, 42, 0.9)" stroke="#475569" rx="4" />
        <text x="0" y="-15" fill="#94a3b8" fontSize="8" textAnchor="middle">夹角 θ</text>
        <text x="0" y="0" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="700" fontFamily="monospace">
          {Math.round(effectiveAngle)}°
        </text>
        <text x="0" y="18" fill={intensity > 0.9 ? '#22c55e' : intensity > 0.5 ? '#eab308' : '#ef4444'} fontSize="12" textAnchor="middle" fontWeight="600">
          I = {Math.round(intensity * 100)}%
        </text>
      </g>
    </svg>
  )
}

// Intensity meter with Malus's Law formula
function IntensityMeter({
  intensity,
  effectiveAngle,
  isZh,
}: {
  intensity: number
  effectiveAngle: number
  isZh: boolean
}) {
  const percentage = Math.round(intensity * 100)
  const barColor = intensity > 0.9 ? '#22c55e' : intensity > 0.5 ? '#eab308' : '#ef4444'

  // Calculate cos² value for display
  const cosSquared = Math.pow(Math.cos(effectiveAngle * Math.PI / 180), 2)

  return (
    <div className="w-full max-w-md">
      {/* Formula display */}
      <div className="text-center mb-3 px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-xs text-gray-400 mb-2">
          {isZh ? '马吕斯定律 (Malus\'s Law)' : "Malus's Law"}
        </div>
        <div className="font-mono text-sm space-y-1">
          <div className="text-cyan-400">
            I = I₀ × cos²(θ)
          </div>
          <div className="text-gray-300">
            I = I₀ × cos²(<span className="text-purple-400">{Math.round(effectiveAngle)}°</span>)
            {' = '}
            I₀ × <span className="text-purple-400">{cosSquared.toFixed(3)}</span>
            {' = '}
            <span className={cn(
              'font-bold',
              intensity > 0.9 ? 'text-emerald-400' : intensity > 0.5 ? 'text-yellow-400' : 'text-red-400'
            )}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Intensity bar */}
      <div className="relative h-5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
            boxShadow: `0 0 15px ${barColor}60`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-white drop-shadow-lg">
            {percentage}% {isZh ? '透过率' : 'Transmission'}
          </span>
        </div>
      </div>

      {/* Status text with physics explanation */}
      <div className="text-center mt-2 text-xs">
        {effectiveAngle < 10 ? (
          <span className="text-emerald-400 font-medium">
            {isZh
              ? '✓ 偏振片几乎平行 (θ ≈ 0°) → 最大透过'
              : '✓ Polarizers nearly parallel (θ ≈ 0°) → Maximum transmission'}
          </span>
        ) : effectiveAngle > 80 ? (
          <span className="text-red-400">
            {isZh
              ? '✗ 偏振片接近正交 (θ ≈ 90°) → 几乎阻断'
              : '✗ Polarizers nearly crossed (θ ≈ 90°) → Nearly blocked'}
          </span>
        ) : effectiveAngle > 40 && effectiveAngle < 50 ? (
          <span className="text-yellow-400">
            {isZh
              ? '◐ θ = 45° → 透过率约 50%'
              : '◐ θ = 45° → ~50% transmission'}
          </span>
        ) : (
          <span className="text-gray-400">
            {isZh
              ? `调整偏振片使 θ → 0° 以获得最大透过`
              : `Adjust polarizers so θ → 0° for maximum transmission`}
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

  // Two polarizer angles - start at standard positions
  // P1 at 45°, P2 at 135° = 90° difference = crossed polarizers = 0% transmission
  // Goal: Align P2 with P1 (both at 45°) for 0° difference = 100% transmission
  const [p1Angle, setP1Angle] = useState(45)   // First polarizer at 45°
  const [p2Angle, setP2Angle] = useState(135)  // Second polarizer at 135° (crossed)

  const [inputPassword, setInputPassword] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Calculate effective angle and intensity using helper functions
  const effectiveAngle = useMemo(
    () => calculateEffectiveAngle(p1Angle, p2Angle),
    [p1Angle, p2Angle]
  )
  const intensity = useMemo(
    () => calculateIntensity(effectiveAngle),
    [effectiveAngle]
  )

  // Password revealed when intensity is high enough (θ < 20° → cos²(20°) ≈ 88%)
  useEffect(() => {
    if (intensity > 0.88) {
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
    setP1Angle(45)    // Reset to 45°
    setP2Angle(135)   // Reset to 135° (90° difference = crossed)
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
              ? '旋转偏振片 P₂ 使其与 P₁ 平行 (θ → 0°)，根据马吕斯定律可获得最大透过率'
              : 'Rotate polarizer P₂ to align with P₁ (θ → 0°). By Malus\'s Law, this gives maximum transmission'}
          </p>
        </div>

        {/* Light beam visualization */}
        <div className="w-full bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <LightBeamVisualization
            p1Angle={p1Angle}
            p2Angle={p2Angle}
            intensity={intensity}
            effectiveAngle={effectiveAngle}
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
          effectiveAngle={effectiveAngle}
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
          <div className="text-xs text-gray-400 bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700 max-w-md animate-fade-in">
            <p className="mb-2 font-medium text-cyan-400">
              {isZh ? '马吕斯定律 (Malus\'s Law)' : "Malus's Law"}
            </p>
            <div className="space-y-1.5 text-left">
              <p>
                <span className="text-purple-400">I = I₀ × cos²(θ)</span>
                {isZh ? '，其中 θ 是两个偏振片的夹角' : ', where θ is the angle between polarizers'}
              </p>
              <p>
                <span className="text-emerald-400">θ = 0°</span>
                {isZh ? ' → cos²(0°) = 1 → 100% 透过' : ' → cos²(0°) = 1 → 100% transmission'}
              </p>
              <p>
                <span className="text-yellow-400">θ = 45°</span>
                {isZh ? ' → cos²(45°) = 0.5 → 50% 透过' : ' → cos²(45°) = 0.5 → 50% transmission'}
              </p>
              <p>
                <span className="text-red-400">θ = 90°</span>
                {isZh ? ' → cos²(90°) = 0 → 0% 透过 (正交偏振)' : ' → cos²(90°) = 0 → 0% transmission (crossed)'}
              </p>
              <p className="mt-2 text-gray-500 italic">
                {isZh
                  ? '提示：旋转 P₂ 使其与 P₁ 平行（夹角 = 0°）'
                  : 'Tip: Rotate P₂ to align with P₁ (angle difference = 0°)'}
              </p>
            </div>
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
