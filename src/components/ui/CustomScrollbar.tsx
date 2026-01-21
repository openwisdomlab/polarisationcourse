import React, { useRef, forwardRef, useImperativeHandle, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useCustomScrollbar } from '@/hooks/useCustomScrollbar'

export interface CustomScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hideDelay?: number
  enabled?: boolean
  exclude?: boolean
  onVisibilityChange?: (visible: boolean) => void
}

export interface CustomScrollbarRef {
  showScrollbar: () => void
  hideScrollbar: () => void
  resetTimer: () => void
  element: HTMLDivElement | null
}

export const CustomScrollbar = forwardRef<CustomScrollbarRef, CustomScrollbarProps>(
  (
    {
      children,
      className,
      hideDelay = 1500,
      enabled = true,
      exclude = false,
      onVisibilityChange,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLDivElement>(null)

    const { showScrollbar, hideScrollbar, resetTimer } = useCustomScrollbar(elementRef, {
      hideDelay,
      enabled: enabled && !exclude,
      onVisibilityChange
    })

    useImperativeHandle(ref, () => ({
      showScrollbar,
      hideScrollbar,
      resetTimer,
      element: elementRef.current
    }))

    return (
      <div
        ref={elementRef}
        className={cn(
          'overflow-y-auto',
          exclude && 'data-scrollbar-exclude',
          className
        )}
        data-scrollbar-exclude={exclude ? 'true' : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CustomScrollbar.displayName = 'CustomScrollbar'
