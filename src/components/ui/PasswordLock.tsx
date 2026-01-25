/**
 * PasswordLock - Entry password screen with polarizer puzzle
 * 密码锁组件 - 通过偏振片解谜输入密码进入
 */

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Lock, Unlock, Eye, RotateCcw } from 'lucide-react'

interface PasswordLockProps {
  onUnlock: () => void
  correctPassword?: string
}

// Character reveal based on polarizer angle alignment
function PolarizedChar({
  char,
  polarizerAngle,
  targetAngle,
  theme,
}: {
  char: string
  polarizerAngle: number
  targetAngle: number
  theme: 'dark' | 'light'
}) {
  // Calculate clarity based on Malus's Law: I = I₀ * cos²(θ)
  const angleDiff = Math.abs(polarizerAngle - targetAngle)
  const normalizedDiff = Math.min(angleDiff, 180 - angleDiff)
  const clarity = Math.pow(Math.cos((normalizedDiff * Math.PI) / 180), 2)

  return (
    <span
      className={cn(
        'inline-block font-mono font-bold text-3xl md:text-4xl transition-all duration-300',
        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
      )}
      style={{
        opacity: 0.1 + clarity * 0.9,
        filter: `blur(${(1 - clarity) * 8}px)`,
        transform: `scale(${0.8 + clarity * 0.2})`,
      }}
    >
      {char}
    </span>
  )
}

// Polarizer dial control
function PolarizerDial({
  angle,
  onChange,
  theme,
}: {
  angle: number
  onChange: (angle: number) => void
  theme: 'dark' | 'light'
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => setIsDragging(true), [])
  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const rect = document.getElementById('polarizer-dial')?.getBoundingClientRect()
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
  }, [isDragging, onChange, handleMouseUp])

  return (
    <div
      id="polarizer-dial"
      className={cn(
        'relative w-32 h-32 rounded-full cursor-grab active:cursor-grabbing',
        'border-4 transition-colors',
        theme === 'dark'
          ? 'border-cyan-500/50 bg-slate-800/50'
          : 'border-cyan-400 bg-white/50'
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Dial markings */}
      {[0, 45, 90, 135].map((mark) => (
        <div
          key={mark}
          className={cn(
            'absolute w-0.5 h-3 left-1/2 -translate-x-1/2',
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
          )}
          style={{
            top: '4px',
            transformOrigin: 'center 60px',
            transform: `rotate(${mark}deg)`,
          }}
        />
      ))}

      {/* Pointer */}
      <div
        className="absolute inset-4 rounded-full flex items-center justify-center"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div
          className={cn(
            'w-1 h-12 rounded-full',
            theme === 'dark'
              ? 'bg-gradient-to-t from-cyan-500 to-cyan-300'
              : 'bg-gradient-to-t from-cyan-600 to-cyan-400'
          )}
          style={{ transformOrigin: 'center bottom', transform: 'translateY(-50%)' }}
        />
      </div>

      {/* Center dot */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full',
          theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-500'
        )}
      />

      {/* Angle display */}
      <div
        className={cn(
          'absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-mono',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}
      >
        {Math.round(angle)}°
      </div>
    </div>
  )
}

export function PasswordLock({ onUnlock, correctPassword = 'POLAR' }: PasswordLockProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const theme = 'dark' // Always dark for lock screen

  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [inputPassword, setInputPassword] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  // Target angle for each character (they align at 45°)
  const targetAngle = 45

  // Check if password is fully visible
  const clarity = Math.pow(Math.cos(((polarizerAngle - targetAngle) * Math.PI) / 180), 2)
  useEffect(() => {
    if (clarity > 0.95) {
      setIsRevealed(true)
    }
  }, [clarity])

  const handleSubmit = () => {
    if (inputPassword.toUpperCase() === correctPassword) {
      // Store unlock state
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

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      )}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(34, 211, 238, 0.1) 10px,
            rgba(34, 211, 238, 0.1) 20px
          )`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 p-8">
        {/* Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {isRevealed ? (
              <Unlock className="w-8 h-8 text-emerald-400" />
            ) : (
              <Lock className="w-8 h-8 text-cyan-400" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {isZh ? '偏振光密码锁' : 'Polarization Lock'}
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            {isZh
              ? '调整偏振片角度，解开隐藏的密码'
              : 'Adjust the polarizer to reveal the hidden password'}
          </p>
        </div>

        {/* Polarizer dial */}
        <div className="flex flex-col items-center gap-6">
          <PolarizerDial angle={polarizerAngle} onChange={setPolarizerAngle} theme={theme} />

          {/* Hint */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Eye className="w-4 h-4" />
            <span>{isZh ? '提示：对准 45° 角' : 'Hint: Align to 45°'}</span>
          </div>
        </div>

        {/* Hidden password display */}
        <div
          className={cn(
            'px-8 py-4 rounded-xl border-2 transition-all',
            'bg-slate-800/50 border-slate-700',
            isRevealed && 'border-emerald-500/50 bg-emerald-950/30'
          )}
        >
          <div className="flex gap-2 justify-center">
            {correctPassword.split('').map((char, index) => (
              <PolarizedChar
                key={index}
                char={char}
                polarizerAngle={polarizerAngle}
                targetAngle={targetAngle}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* Password input */}
        {isRevealed && (
          <div
            className={cn(
              'flex flex-col items-center gap-4 animate-fade-in',
              shake && 'animate-shake'
            )}
          >
            <p className="text-emerald-400 text-sm font-medium">
              {isZh ? '[ 密码已解锁 - 请输入 ]' : '[ Password Revealed - Enter Below ]'}
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                placeholder={isZh ? '输入密码...' : 'Enter password...'}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 bg-slate-800 text-white',
                  'font-mono text-lg uppercase tracking-wider',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                  'placeholder:text-gray-600',
                  error
                    ? 'border-red-500'
                    : 'border-slate-600 focus:border-cyan-500'
                )}
                maxLength={correctPassword.length}
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium transition-all',
                  'bg-cyan-600 hover:bg-cyan-500 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500/50'
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

        {/* Reset button */}
        <button
          onClick={() => {
            setPolarizerAngle(0)
            setIsRevealed(false)
            setInputPassword('')
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm',
            'text-gray-500 hover:text-gray-300 transition-colors'
          )}
        >
          <RotateCcw className="w-4 h-4" />
          {isZh ? '重置' : 'Reset'}
        </button>
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
