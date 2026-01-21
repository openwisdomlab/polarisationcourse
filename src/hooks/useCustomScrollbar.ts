import { useEffect, useRef, useCallback } from 'react'

interface UseCustomScrollbarOptions {
  hideDelay?: number
  enabled?: boolean
  onVisibilityChange?: (visible: boolean) => void
}

export function useCustomScrollbar(
  elementRef: React.RefObject<HTMLElement>,
  options: UseCustomScrollbarOptions = {}
) {
  const {
    hideDelay = 1500,
    enabled = true,
    onVisibilityChange
  } = options

  const timeoutRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const isVisibleRef = useRef(true)
  const lastActivityRef = useRef(Date.now())

  const showScrollbar = useCallback(() => {
    if (!enabled) return

    const element = elementRef.current
    if (!element) return

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      element.classList.remove('scrollbar-hidden')
      element.classList.add('scrollbar-visible')
      isVisibleRef.current = true
      onVisibilityChange?.(true)
      rafRef.current = null
    })

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      hideScrollbar()
    }, hideDelay)
  }, [elementRef, hideDelay, enabled, onVisibilityChange])

  const hideScrollbar = useCallback(() => {
    if (!enabled) return

    const element = elementRef.current
    if (!element) return

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      element.classList.remove('scrollbar-visible')
      element.classList.add('scrollbar-hidden')
      isVisibleRef.current = false
      onVisibilityChange?.(false)
      rafRef.current = null
    })
  }, [elementRef, enabled, onVisibilityChange])

  const handleScroll = useCallback(() => {
    if (!enabled) return

    lastActivityRef.current = Date.now()
    showScrollbar()
  }, [enabled, showScrollbar])

  const handleMouseEnter = useCallback(() => {
    if (!enabled) return

    lastActivityRef.current = Date.now()
    showScrollbar()
  }, [enabled, showScrollbar])

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    const timeSinceLastActivity = Date.now() - lastActivityRef.current
    const remainingDelay = Math.max(0, hideDelay - timeSinceLastActivity)

    timeoutRef.current = window.setTimeout(() => {
      hideScrollbar()
    }, remainingDelay)
  }, [enabled, hideDelay, hideScrollbar])

  const resetTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      hideScrollbar()
    }, hideDelay)
  }, [hideDelay, hideScrollbar])

  useEffect(() => {
    const element = elementRef.current
    if (!element || !enabled) return

    element.classList.add('custom-scrollbar', 'scrollbar-visible')

    element.addEventListener('scroll', handleScroll, { passive: true })
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('scroll', handleScroll)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      element.classList.remove('custom-scrollbar', 'scrollbar-visible', 'scrollbar-hidden')
    }
  }, [elementRef, enabled, handleScroll, handleMouseEnter, handleMouseLeave])

  return {
    showScrollbar,
    hideScrollbar,
    resetTimer,
    isVisible: isVisibleRef.current
  }
}
