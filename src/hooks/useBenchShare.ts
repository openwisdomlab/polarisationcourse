/**
 * useBenchShare - Shareable URL Generation for Optical Bench
 *
 * Hook that generates shareable URLs for the current optical bench state.
 * Uses benchSerializer to encode the bench state into URL search params.
 *
 * Usage:
 * ```tsx
 * function ShareButton() {
 *   const { shareUrl, copyToClipboard, estimatedLength } = useBenchShare()
 *   return <button onClick={copyToClipboard}>Share ({estimatedLength} chars)</button>
 * }
 * ```
 */

import { useCallback, useMemo } from 'react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import { serializeBenchState, estimateUrlLength } from '@/lib/benchSerializer'

interface BenchShareResult {
  /** Full shareable URL */
  shareUrl: string
  /** Just the encoded setup string */
  setupString: string
  /** Estimated total URL length */
  estimatedLength: number
  /** Whether the URL is within safe limits (< 2000 chars) */
  isWithinLimits: boolean
  /** Copy the share URL to clipboard */
  copyToClipboard: () => Promise<boolean>
}

export function useBenchShare(): BenchShareResult {
  const components = useOpticalBenchStore(state => state.components)

  const setupString = useMemo(
    () => serializeBenchState(components),
    [components]
  )

  const estimatedLength = useMemo(
    () => estimateUrlLength(components),
    [components]
  )

  const shareUrl = useMemo(() => {
    if (!setupString) return ''
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    return `${base}/studio?module=design&setup=${setupString}`
  }, [setupString])

  const isWithinLimits = estimatedLength < 2000

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!shareUrl) return false
    try {
      await navigator.clipboard.writeText(shareUrl)
      return true
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        return true
      } catch {
        return false
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }, [shareUrl])

  return {
    shareUrl,
    setupString,
    estimatedLength,
    isWithinLimits,
    copyToClipboard,
  }
}

export default useBenchShare
