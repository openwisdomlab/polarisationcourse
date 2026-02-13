/**
 * useOpticalFeedback - Harmonic Resonance Feedback System
 *
 * Provides visual and audio feedback when the optical system reaches
 * specific states (e.g., 100% sensor activation = "Harmonic Resonance").
 *
 * Features:
 * - Screen bloom pulse on puzzle completion
 * - UI pulse animation via CSS class injection
 * - Integration with useHapticAudio for audio cues
 * - Subscribes to optical bench sensor readings for automatic triggers
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useHapticAudio } from './useHapticAudio'

// ========== Types ==========

export type FeedbackEvent =
  | 'resonance'       // All sensors activated / puzzle solved
  | 'partial-match'   // Some sensors activated
  | 'intensity-peak'  // A sensor hit 100% intensity
  | 'conservation-violation' // Physics error detected

interface FeedbackState {
  /** Currently active feedback event */
  activeEvent: FeedbackEvent | null
  /** Bloom overlay opacity (0-1, animated) */
  bloomOpacity: number
  /** Whether the UI pulse CSS class should be active */
  isPulsing: boolean
  /** Timestamp of last resonance event (for debouncing) */
  lastResonanceAt: number
}

interface UseOpticalFeedbackOptions {
  /** Enable visual feedback */
  visualEnabled?: boolean
  /** Enable audio feedback */
  audioEnabled?: boolean
  /** Minimum ms between resonance triggers */
  debounceMs?: number
}

// ========== CSS Animation Keyframes (injected once) ==========

let cssInjected = false

function injectFeedbackCSS(): void {
  if (cssInjected || typeof document === 'undefined') return
  cssInjected = true

  const style = document.createElement('style')
  style.textContent = `
    @keyframes optical-resonance-bloom {
      0% { opacity: 0; transform: scale(1); }
      15% { opacity: 0.4; transform: scale(1.02); }
      40% { opacity: 0.2; transform: scale(1.01); }
      100% { opacity: 0; transform: scale(1); }
    }

    @keyframes optical-ui-pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.4); }
      50% { box-shadow: 0 0 20px 4px rgba(0, 240, 255, 0.2); }
      100% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0); }
    }

    .optical-resonance-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      background: radial-gradient(
        circle at center,
        rgba(0, 240, 255, 0.15) 0%,
        rgba(0, 240, 255, 0.05) 40%,
        transparent 70%
      );
      animation: optical-resonance-bloom 1.2s ease-out forwards;
    }

    .optical-ui-pulse {
      animation: optical-ui-pulse 0.8s ease-out;
    }
  `
  document.head.appendChild(style)
}

// ========== The Hook ==========

export function useOpticalFeedback(options: UseOpticalFeedbackOptions = {}) {
  const {
    visualEnabled = true,
    audioEnabled = true,
    debounceMs = 2000,
  } = options

  const { playClick, initAudio } = useHapticAudio({
    enabled: audioEnabled,
    volume: 0.25,
  })

  const [state, setState] = useState<FeedbackState>({
    activeEvent: null,
    bloomOpacity: 0,
    isPulsing: false,
    lastResonanceAt: 0,
  })

  const overlayRef = useRef<HTMLDivElement | null>(null)

  // Inject CSS on first mount
  useEffect(() => {
    injectFeedbackCSS()
  }, [])

  /**
   * Trigger the bloom overlay animation.
   * Creates a temporary DOM element that self-destructs after animation.
   */
  const triggerBloom = useCallback(() => {
    if (!visualEnabled || typeof document === 'undefined') return

    // Remove existing overlay if any
    if (overlayRef.current) {
      overlayRef.current.remove()
    }

    const overlay = document.createElement('div')
    overlay.className = 'optical-resonance-overlay'
    document.body.appendChild(overlay)
    overlayRef.current = overlay

    // Self-destruct after animation completes
    setTimeout(() => {
      overlay.remove()
      if (overlayRef.current === overlay) {
        overlayRef.current = null
      }
    }, 1200)
  }, [visualEnabled])

  /**
   * Fire a feedback event.
   */
  const triggerFeedback = useCallback((event: FeedbackEvent) => {
    const now = Date.now()

    if (event === 'resonance') {
      // Debounce resonance events
      if (now - state.lastResonanceAt < debounceMs) return

      setState(prev => ({
        ...prev,
        activeEvent: event,
        isPulsing: true,
        lastResonanceAt: now,
      }))

      // Visual: screen bloom
      triggerBloom()

      // Audio: crisp success click
      if (audioEnabled) {
        initAudio()
        playClick('crisp')
        // Second harmonic click after short delay
        setTimeout(() => playClick('medium'), 150)
      }

      // Reset pulse state after animation
      setTimeout(() => {
        setState(prev => ({ ...prev, isPulsing: false, activeEvent: null }))
      }, 800)
    } else if (event === 'intensity-peak') {
      if (audioEnabled) {
        initAudio()
        playClick('medium')
      }

      setState(prev => ({ ...prev, activeEvent: event }))
      setTimeout(() => {
        setState(prev => ({ ...prev, activeEvent: null }))
      }, 400)
    }
  }, [state.lastResonanceAt, debounceMs, triggerBloom, audioEnabled, initAudio, playClick])

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      if (overlayRef.current) {
        overlayRef.current.remove()
        overlayRef.current = null
      }
    }
  }, [])

  return {
    /** Fire a feedback event */
    triggerFeedback,
    /** Current feedback state */
    activeEvent: state.activeEvent,
    /** Whether the UI pulse class should be applied */
    isPulsing: state.isPulsing,
    /** CSS class to apply to elements that should pulse on resonance */
    pulseClassName: state.isPulsing ? 'optical-ui-pulse' : '',
  }
}

export default useOpticalFeedback
