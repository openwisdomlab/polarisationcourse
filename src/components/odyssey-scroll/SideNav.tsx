/**
 * SideNav.tsx — Fixed right-side progress navigation
 *
 * 6 个圆点（对应 6 个单元）通过细竖线连接，显示当前滚动位置。
 * 悬停展开显示单元名称，3 秒无交互自动收缩。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useOpticalBenchStore } from './store'

const UNIT_COLORS = ['#fbbf24', '#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#60a5fa']

const UNIT_NAMES = [
  'Polarization',
  'Birefringence',
  'Interference',
  'Reflection',
  'Scattering',
  'Applications',
]

export function SideNav() {
  const currentUnit = useOpticalBenchStore((s) => s.currentUnit)
  const isNavExpanded = useOpticalBenchStore((s) => s.isNavExpanded)
  const setNavExpanded = useOpticalBenchStore((s) => s.setNavExpanded)

  const [hoveredDot, setHoveredDot] = useState<number | null>(null)
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // 3 秒无交互后自动收缩
  const resetCollapseTimer = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current)
    }
    collapseTimer.current = setTimeout(() => {
      setNavExpanded(false)
    }, 3000)
  }, [setNavExpanded])

  useEffect(() => {
    resetCollapseTimer()
    return () => {
      if (collapseTimer.current) {
        clearTimeout(collapseTimer.current)
      }
    }
  }, [resetCollapseTimer])

  const handleMouseEnter = () => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current)
    }
    setNavExpanded(true)
  }

  const handleMouseLeave = () => {
    setHoveredDot(null)
    resetCollapseTimer()
  }

  const handleClick = (index: number) => {
    const el = document.getElementById(`unit-${index}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: (index / 5) * document.body.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={navRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 md:flex md:flex-col md:items-center md:gap-2"
    >
      {/* 竖线背景 */}
      <div
        className="absolute left-1/2 top-0 h-full -translate-x-1/2 transition-opacity duration-500"
        style={{
          width: '1px',
          backgroundColor: isNavExpanded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0)',
        }}
      />

      {/* 6 个导航圆点 */}
      {UNIT_COLORS.map((color, i) => {
        const isCurrent = currentUnit === i
        const isHovered = hoveredDot === i

        return (
          <div
            key={i}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredDot(i)}
            onMouseLeave={() => setHoveredDot(null)}
          >
            {/* 圆点 */}
            <button
              onClick={() => handleClick(i)}
              className="relative rounded-full transition-all duration-300"
              style={{
                width: isNavExpanded ? (isCurrent ? '10px' : '6px') : '1px',
                height: isNavExpanded ? (isCurrent ? '10px' : '6px') : '1px',
                backgroundColor: color,
                boxShadow: isCurrent ? `0 0 8px ${color}` : 'none',
                cursor: 'pointer',
              }}
              aria-label={`Navigate to unit ${i}: ${UNIT_NAMES[i]}`}
            />

            {/* 悬停时显示单元名称 */}
            {isHovered && isNavExpanded && (
              <span
                className="absolute right-full mr-2 whitespace-nowrap font-mono text-[10px]"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {UNIT_NAMES[i]}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
