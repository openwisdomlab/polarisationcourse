/**
 * Polarizer Source Tool - Interactive white light source for physical polarizer testing
 * 偏振光源工具 - 用于测试物理偏振片的交互式白光光源
 *
 * This component displays a bright white/colored rectangle that users can rotate
 * using touch/drag gestures. It acts as a polarized light source that users can
 * test their physical polarizer sheets against - without needing to rotate their phone.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { RotateCw, Sun, Moon, Info, Lock, Unlock } from 'lucide-react'

interface PolarizerSourceProps {
  className?: string
}

export function PolarizerSource({ className }: PolarizerSourceProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Rotation angle in degrees (0-360)
  const [rotation, setRotation] = useState(0)
  // Whether the display is on/off
  const [isOn, setIsOn] = useState(true)
  // Whether rotation is locked
  const [isLocked, setIsLocked] = useState(false)
  // Brightness level (0-100)
  const [brightness, setBrightness] = useState(100)
  // Show angle indicator
  const [showInfo, setShowInfo] = useState(true)

  // Touch/drag handling refs
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastAngle = useRef(0)

  // Calculate angle from center to touch/mouse point
  const getAngleFromCenter = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return 0
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    // Convert to degrees, with 0 at top
    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI)
    if (angle < 0) angle += 360
    return angle
  }, [])

  // Handle mouse/touch start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (isLocked) return
    isDragging.current = true
    lastAngle.current = getAngleFromCenter(clientX, clientY)
  }, [isLocked, getAngleFromCenter])

  // Handle mouse/touch move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current || isLocked) return
    const currentAngle = getAngleFromCenter(clientX, clientY)
    const delta = currentAngle - lastAngle.current

    // Handle wrap-around
    let adjustedDelta = delta
    if (delta > 180) adjustedDelta = delta - 360
    if (delta < -180) adjustedDelta = delta + 360

    setRotation(prev => {
      let newRotation = prev + adjustedDelta
      if (newRotation < 0) newRotation += 360
      if (newRotation >= 360) newRotation -= 360
      return newRotation
    })
    lastAngle.current = currentAngle
  }, [isLocked, getAngleFromCenter])

  // Handle mouse/touch end
  const handleDragEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  // Global mouse/touch event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY)
    const handleMouseUp = () => handleDragEnd()
    const handleTouchEnd = () => handleDragEnd()
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleDragMove, handleDragEnd])

  // Quick rotate buttons
  const quickRotate = (degrees: number) => {
    if (isLocked) return
    setRotation(prev => {
      let newRotation = prev + degrees
      if (newRotation < 0) newRotation += 360
      if (newRotation >= 360) newRotation -= 360
      return newRotation
    })
  }

  // Reset rotation
  const resetRotation = () => {
    if (isLocked) return
    setRotation(0)
  }

  // Calculate effective intensity based on polarization angle
  // This simulates what a real polarizer at 0° would see
  const effectiveIntensity = Math.cos(rotation * Math.PI / 180) ** 2
  const displayBrightness = isOn ? brightness * effectiveIntensity : 0

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Info banner */}
      <div className={cn(
        'p-3 rounded-lg text-sm',
        theme === 'dark' ? 'bg-cyan-500/10 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
      )}>
        <p className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {isZh
              ? '将偏振片放在屏幕前方，旋转下方的光源（拖拽或使用按钮）。观察光线如何穿过你的偏振片变化。'
              : 'Hold your polarizer in front of the screen. Rotate the light source below (drag or use buttons). Watch how light through your polarizer changes.'}
          </span>
        </p>
      </div>

      {/* Main light source display */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={cn(
          'relative aspect-square max-w-[300px] mx-auto w-full rounded-2xl overflow-hidden',
          'cursor-grab active:cursor-grabbing select-none touch-none',
          isLocked && 'cursor-not-allowed'
        )}
        style={{
          background: isOn
            ? `rgba(255, 255, 255, ${displayBrightness / 100})`
            : '#000',
          boxShadow: isOn
            ? `0 0 ${60 * (displayBrightness / 100)}px ${30 * (displayBrightness / 100)}px rgba(255, 255, 255, ${displayBrightness / 200})`
            : 'none',
          transition: 'background 0.1s ease-out, box-shadow 0.1s ease-out',
        }}
      >
        {/* Polarization direction indicator */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Direction lines */}
          <div
            className={cn(
              'absolute w-[2px] h-full',
              displayBrightness > 50 ? 'bg-black/20' : 'bg-white/20'
            )}
          />
          <div
            className={cn(
              'absolute w-full h-[2px]',
              displayBrightness > 50 ? 'bg-black/10' : 'bg-white/10'
            )}
          />

          {/* Arrow indicator at top */}
          <div
            className={cn(
              'absolute top-4 w-0 h-0',
              'border-l-[8px] border-l-transparent',
              'border-r-[8px] border-r-transparent',
              'border-b-[12px]',
              displayBrightness > 50 ? 'border-b-black/30' : 'border-b-white/30'
            )}
          />
        </div>

        {/* Angle display overlay */}
        {showInfo && (
          <div className={cn(
            'absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-mono',
            displayBrightness > 50
              ? 'bg-black/30 text-white'
              : 'bg-white/30 text-white'
          )}>
            {Math.round(rotation)}°
          </div>
        )}

        {/* Lock indicator */}
        {isLocked && (
          <div className={cn(
            'absolute top-3 right-3 p-1.5 rounded-full',
            displayBrightness > 50 ? 'bg-black/30' : 'bg-white/30'
          )}>
            <Lock className={cn('w-4 h-4', displayBrightness > 50 ? 'text-white' : 'text-white')} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={cn(
        'p-4 rounded-xl border',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        {/* Rotation controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => quickRotate(-45)}
            disabled={isLocked}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-200 hover:bg-slate-600 disabled:opacity-50'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
            )}
          >
            -45°
          </button>
          <button
            onClick={() => quickRotate(-15)}
            disabled={isLocked}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-200 hover:bg-slate-600 disabled:opacity-50'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
            )}
          >
            -15°
          </button>
          <button
            onClick={resetRotation}
            disabled={isLocked}
            className={cn(
              'p-2 rounded-lg transition-colors',
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50'
                : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 disabled:opacity-50'
            )}
            title={isZh ? '重置到0°' : 'Reset to 0°'}
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => quickRotate(15)}
            disabled={isLocked}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-200 hover:bg-slate-600 disabled:opacity-50'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
            )}
          >
            +15°
          </button>
          <button
            onClick={() => quickRotate(45)}
            disabled={isLocked}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-200 hover:bg-slate-600 disabled:opacity-50'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
            )}
          >
            +45°
          </button>
        </div>

        {/* Brightness slider */}
        <div className="mb-4">
          <label className={cn(
            'text-xs font-medium mb-2 block',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? '亮度' : 'Brightness'}: {brightness}%
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: theme === 'dark'
                ? `linear-gradient(to right, #0891b2 0%, #0891b2 ${brightness}%, #334155 ${brightness}%, #334155 100%)`
                : `linear-gradient(to right, #0891b2 0%, #0891b2 ${brightness}%, #d1d5db ${brightness}%, #d1d5db 100%)`
            }}
          />
        </div>

        {/* Toggle buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOn(!isOn)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isOn
                ? theme === 'dark'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-amber-100 text-amber-700'
                : theme === 'dark'
                  ? 'bg-slate-700 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
            )}
          >
            {isOn ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isOn ? (isZh ? '开启' : 'On') : (isZh ? '关闭' : 'Off')}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              showInfo
                ? theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-cyan-100 text-cyan-700'
                : theme === 'dark'
                  ? 'bg-slate-700 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
            )}
          >
            <Info className="w-4 h-4" />
            {isZh ? '显示角度' : 'Show Angle'}
          </button>

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isLocked
                ? theme === 'dark'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-red-100 text-red-700'
                : theme === 'dark'
                  ? 'bg-slate-700 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
            )}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {isLocked ? (isZh ? '已锁定' : 'Locked') : (isZh ? '锁定' : 'Lock')}
          </button>
        </div>
      </div>

      {/* Physics explanation */}
      <div className={cn(
        'p-3 rounded-lg text-xs',
        theme === 'dark' ? 'bg-slate-800/50 text-gray-400' : 'bg-gray-50 text-gray-600'
      )}>
        <p className="mb-1 font-medium">
          {isZh ? '马吕斯定律' : "Malus's Law"}: I = I₀ × cos²(θ)
        </p>
        <p>
          {isZh
            ? `当偏振角度为 ${Math.round(rotation)}° 时，如果你的偏振片在 0° 方向，理论透过率为 ${Math.round(effectiveIntensity * 100)}%`
            : `At ${Math.round(rotation)}° polarization, if your polarizer is at 0°, theoretical transmission is ${Math.round(effectiveIntensity * 100)}%`}
        </p>
      </div>
    </div>
  )
}
