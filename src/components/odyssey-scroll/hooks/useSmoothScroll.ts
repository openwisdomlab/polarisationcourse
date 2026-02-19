import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useOpticalBenchStore } from '../store'

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Lenis scroll callback receives the Lenis instance itself
    lenis.on('scroll', (instance: Lenis) => {
      useOpticalBenchStore.getState().setScrollProgress(instance.progress)
    })

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return lenisRef
}
