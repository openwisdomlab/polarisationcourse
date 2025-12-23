/**
 * useHapticAudio - Audio feedback hook for precise instrument interaction
 *
 * Provides subtle audio cues when rotating virtual polarizers or optical components
 * through special angles (0°, 45°, 90°, etc.), giving a "safe lock" precision feel.
 *
 * Features:
 * - Web Audio API based for low latency
 * - Generates procedural click sounds (no external audio files needed)
 * - Configurable snap angles and sound parameters
 * - Respects user's audio preferences
 */

import { useCallback, useRef, useEffect, useState } from 'react'

// Default special angles that trigger audio feedback
export const DEFAULT_SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360]

// Threshold in degrees for angle proximity detection
export const DEFAULT_ANGLE_THRESHOLD = 2

interface HapticAudioOptions {
  // Angles that trigger a click sound (in degrees)
  snapAngles?: number[]
  // How close the angle must be to trigger (in degrees)
  angleThreshold?: number
  // Volume (0-1)
  volume?: number
  // Enable/disable audio feedback
  enabled?: boolean
  // Pitch variation for different angles
  pitchVariation?: boolean
}

interface HapticAudioState {
  lastTriggeredAngle: number | null
  audioContext: AudioContext | null
  isInitialized: boolean
}

/**
 * Creates a procedural "click" sound using Web Audio API
 * Designed to mimic the satisfying click of precision optical instruments
 */
function createClickSound(
  audioContext: AudioContext,
  options: {
    volume?: number
    pitch?: number
    duration?: number
    type?: 'soft' | 'medium' | 'crisp'
  } = {}
): void {
  const { volume = 0.15, pitch = 1, duration = 0.04, type = 'soft' } = options
  const now = audioContext.currentTime

  // Main click oscillator
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  // Filter for softer sound
  const filter = audioContext.createBiquadFilter()
  filter.type = 'lowpass'

  // Configure based on type
  switch (type) {
    case 'crisp':
      oscillator.frequency.value = 3200 * pitch
      filter.frequency.value = 4000
      break
    case 'medium':
      oscillator.frequency.value = 2400 * pitch
      filter.frequency.value = 3000
      break
    case 'soft':
    default:
      oscillator.frequency.value = 1800 * pitch
      filter.frequency.value = 2000
      break
  }

  oscillator.type = 'sine'

  // Quick attack, fast decay envelope (percussive)
  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.002)
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

  // Connect audio graph
  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Play the click
  oscillator.start(now)
  oscillator.stop(now + duration + 0.01)

  // Add subtle second harmonic for richness
  const harmonic = audioContext.createOscillator()
  const harmonicGain = audioContext.createGain()

  harmonic.frequency.value = oscillator.frequency.value * 2.5
  harmonic.type = 'sine'

  harmonicGain.gain.setValueAtTime(0, now)
  harmonicGain.gain.linearRampToValueAtTime(volume * 0.2, now + 0.001)
  harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6)

  harmonic.connect(harmonicGain)
  harmonicGain.connect(audioContext.destination)

  harmonic.start(now)
  harmonic.stop(now + duration + 0.01)
}

/**
 * Custom hook for haptic audio feedback during angle-based interactions
 *
 * @example
 * ```tsx
 * function PolarizationDemo() {
 *   const { checkAngle, initAudio } = useHapticAudio({
 *     snapAngles: [0, 45, 90, 135, 180],
 *     volume: 0.2
 *   })
 *
 *   return (
 *     <div onClick={initAudio}> // User interaction needed to init audio
 *       <Slider
 *         value={angle}
 *         onChange={(newAngle) => {
 *           setAngle(newAngle)
 *           checkAngle(newAngle) // Will play click at special angles
 *         }}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function useHapticAudio(options: HapticAudioOptions = {}) {
  const {
    snapAngles = DEFAULT_SNAP_ANGLES,
    angleThreshold = DEFAULT_ANGLE_THRESHOLD,
    volume = 0.15,
    enabled = true,
    pitchVariation = true,
  } = options

  const stateRef = useRef<HapticAudioState>({
    lastTriggeredAngle: null,
    audioContext: null,
    isInitialized: false,
  })

  const [isAudioEnabled, setIsAudioEnabled] = useState(enabled)

  // Initialize AudioContext (must be called after user interaction)
  const initAudio = useCallback(() => {
    if (stateRef.current.isInitialized) return

    try {
      // Create or resume AudioContext
      if (!stateRef.current.audioContext) {
        stateRef.current.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      if (stateRef.current.audioContext.state === 'suspended') {
        stateRef.current.audioContext.resume()
      }

      stateRef.current.isInitialized = true
    } catch (error) {
      console.warn('Failed to initialize haptic audio:', error)
    }
  }, [])

  // Normalize angle to 0-360 range
  const normalizeAngle = useCallback((angle: number): number => {
    const normalized = angle % 360
    return normalized < 0 ? normalized + 360 : normalized
  }, [])

  // Check if angle is near any snap angle
  const findNearbySnapAngle = useCallback((angle: number): number | null => {
    const normalized = normalizeAngle(angle)

    for (const snapAngle of snapAngles) {
      const normalizedSnap = normalizeAngle(snapAngle)
      const diff = Math.abs(normalized - normalizedSnap)
      const wrappedDiff = Math.min(diff, 360 - diff)

      if (wrappedDiff <= angleThreshold) {
        return normalizedSnap
      }
    }

    return null
  }, [snapAngles, angleThreshold, normalizeAngle])

  // Get pitch multiplier based on angle (for variation)
  const getPitchForAngle = useCallback((angle: number): number => {
    if (!pitchVariation) return 1

    const normalized = normalizeAngle(angle)

    // Different pitches for key angles
    if (normalized === 0 || normalized === 180 || normalized === 360) {
      return 1.0 // Base pitch for major angles
    } else if (normalized === 90 || normalized === 270) {
      return 1.1 // Slightly higher for perpendicular
    } else if (normalized === 45 || normalized === 135 || normalized === 225 || normalized === 315) {
      return 0.95 // Slightly lower for diagonal
    }

    return 1.0
  }, [pitchVariation, normalizeAngle])

  // Main function to check angle and play sound if at snap angle
  const checkAngle = useCallback((currentAngle: number): boolean => {
    if (!isAudioEnabled || !stateRef.current.isInitialized) {
      return false
    }

    const nearbySnap = findNearbySnapAngle(currentAngle)

    if (nearbySnap !== null && nearbySnap !== stateRef.current.lastTriggeredAngle) {
      // We're at a new snap angle - play the click!
      stateRef.current.lastTriggeredAngle = nearbySnap

      if (stateRef.current.audioContext) {
        const pitch = getPitchForAngle(nearbySnap)
        const type = (nearbySnap === 0 || nearbySnap === 90 || nearbySnap === 180 || nearbySnap === 360)
          ? 'medium'
          : 'soft'

        createClickSound(stateRef.current.audioContext, {
          volume,
          pitch,
          type,
        })
      }

      return true
    } else if (nearbySnap === null) {
      // Clear last triggered when moving away from snap angles
      stateRef.current.lastTriggeredAngle = null
    }

    return false
  }, [isAudioEnabled, findNearbySnapAngle, getPitchForAngle, volume])

  // Force play a click (for manual triggers)
  const playClick = useCallback((type: 'soft' | 'medium' | 'crisp' = 'soft') => {
    if (!stateRef.current.audioContext || !isAudioEnabled) return

    createClickSound(stateRef.current.audioContext, { volume, type })
  }, [isAudioEnabled, volume])

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.audioContext && stateRef.current.audioContext.state !== 'closed') {
        // Don't close - may be shared across components
      }
    }
  }, [])

  return {
    // Check angle and play sound if at snap point
    checkAngle,
    // Initialize audio context (call on first user interaction)
    initAudio,
    // Manually play a click sound
    playClick,
    // Toggle audio on/off
    toggleAudio,
    // Current audio enabled state
    isAudioEnabled,
    // Set audio enabled state
    setAudioEnabled: setIsAudioEnabled,
    // Whether audio system is initialized
    isInitialized: stateRef.current.isInitialized,
  }
}

export default useHapticAudio
