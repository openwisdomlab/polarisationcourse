interface ScrollbarElementData {
  element: HTMLElement
  timeoutId: number | null
  rafId: number | null
  isVisible: boolean
  lastActivity: number
}

class ScrollbarManager {
  private elements: Map<HTMLElement, ScrollbarElementData> = new Map()
  private hideDelay: number
  private mutationObserver: MutationObserver | null = null
  private intersectionObserver: IntersectionObserver | null = null
  private isInitialized: boolean = false

  constructor(hideDelay: number = 1500) {
    this.hideDelay = hideDelay
  }

  init(): void {
    if (this.isInitialized) return

    this.scanAndApplyToExistingElements()
    this.setupMutationObserver()
    this.setupIntersectionObserver()
    this.isInitialized = true
  }

  destroy(): void {
    this.elements.forEach((data, element) => {
      this.cleanupElement(element)
    })
    this.elements.clear()

    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
      this.mutationObserver = null
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
      this.intersectionObserver = null
    }

    this.isInitialized = false
  }

  private scanAndApplyToExistingElements(): void {
    const scrollableElements = document.querySelectorAll('[data-overflow-auto="true"], .overflow-y-auto')

    scrollableElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        this.applyToElement(element)
      }
    })
  }

  applyToElement(element: HTMLElement): void {
    if (this.elements.has(element)) return

    if (element.getAttribute('data-scrollbar-exclude') === 'true') {
      return
    }

    const data: ScrollbarElementData = {
      element,
      timeoutId: null,
      rafId: null,
      isVisible: true,
      lastActivity: Date.now()
    }

    element.classList.add('custom-scrollbar', 'scrollbar-visible')

    element.addEventListener('scroll', this.handleScroll, { passive: true })
    element.addEventListener('mouseenter', this.handleMouseEnter)
    element.addEventListener('mouseleave', this.handleMouseLeave)

    this.elements.set(element, data)
  }

  excludeElement(element: HTMLElement): void {
    const data = this.elements.get(element)
    if (data) {
      this.cleanupElement(element)
      this.elements.delete(element)
    }

    element.setAttribute('data-scrollbar-exclude', 'true')
    element.classList.remove('custom-scrollbar', 'scrollbar-visible', 'scrollbar-hidden')
  }

  private cleanupElement(element: HTMLElement): void {
    const data = this.elements.get(element)
    if (!data) return

    if (data.timeoutId !== null) {
      clearTimeout(data.timeoutId)
    }

    if (data.rafId !== null) {
      cancelAnimationFrame(data.rafId)
    }

    element.removeEventListener('scroll', this.handleScroll)
    element.removeEventListener('mouseenter', this.handleMouseEnter)
    element.removeEventListener('mouseleave', this.handleMouseLeave)

    element.classList.remove('custom-scrollbar', 'scrollbar-visible', 'scrollbar-hidden')
  }

  private handleScroll = (event: Event): void => {
    const element = event.currentTarget as HTMLElement
    const data = this.elements.get(element)

    if (!data) return

    data.lastActivity = Date.now()
    this.showScrollbar(element)
  }

  private handleMouseEnter = (event: Event): void => {
    const element = event.currentTarget as HTMLElement
    const data = this.elements.get(element)

    if (!data) return

    data.lastActivity = Date.now()
    this.showScrollbar(element)
  }

  private handleMouseLeave = (event: Event): void => {
    const element = event.currentTarget as HTMLElement
    const data = this.elements.get(element)

    if (!data) return

    if (data.timeoutId !== null) {
      clearTimeout(data.timeoutId)
    }

    const timeSinceLastActivity = Date.now() - data.lastActivity
    const remainingDelay = Math.max(0, this.hideDelay - timeSinceLastActivity)

    data.timeoutId = window.setTimeout(() => {
      this.hideScrollbar(element)
    }, remainingDelay)
  }

  private showScrollbar(element: HTMLElement): void {
    const data = this.elements.get(element)
    if (!data) return

    if (data.rafId !== null) {
      cancelAnimationFrame(data.rafId)
    }

    data.rafId = requestAnimationFrame(() => {
      element.classList.remove('scrollbar-hidden')
      element.classList.add('scrollbar-visible')
      data.isVisible = true
      data.rafId = null
    })

    if (data.timeoutId !== null) {
      clearTimeout(data.timeoutId)
    }

    data.timeoutId = window.setTimeout(() => {
      this.hideScrollbar(element)
    }, this.hideDelay)
  }

  private hideScrollbar(element: HTMLElement): void {
    const data = this.elements.get(element)
    if (!data) return

    if (data.rafId !== null) {
      cancelAnimationFrame(data.rafId)
    }

    data.rafId = requestAnimationFrame(() => {
      element.classList.remove('scrollbar-visible')
      element.classList.add('scrollbar-hidden')
      data.isVisible = false
      data.rafId = null
    })
  }

  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.hasAttribute('data-overflow-auto') || node.classList.contains('overflow-y-auto')) {
              this.applyToElement(node)
            }

            const scrollableChildren = node.querySelectorAll('[data-overflow-auto="true"], .overflow-y-auto')
            scrollableChildren.forEach((child) => {
              if (child instanceof HTMLElement) {
                this.applyToElement(child)
              }
            })
          }
        })

        if (mutation.type === 'attributes' && mutation.attributeName === 'data-overflow-auto') {
          const target = mutation.target as HTMLElement
          if (target.getAttribute('data-overflow-auto') === 'true') {
            this.applyToElement(target)
          }
        }
      })
    })

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-overflow-auto']
    })
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement
          const data = this.elements.get(element)

          if (!data) return

          if (!entry.isIntersecting) {
            if (data.timeoutId !== null) {
              clearTimeout(data.timeoutId)
            }
          } else if (data.isVisible) {
            this.showScrollbar(element)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    )

    this.elements.forEach((data, element) => {
      this.intersectionObserver?.observe(element)
    })
  }

  setHideDelay(delay: number): void {
    this.hideDelay = delay
  }

  getElementsCount(): number {
    return this.elements.size
  }
}

let instance: ScrollbarManager | null = null

export function getScrollbarManager(hideDelay?: number): ScrollbarManager {
  if (!instance) {
    instance = new ScrollbarManager(hideDelay)
  } else if (hideDelay !== undefined) {
    instance.setHideDelay(hideDelay)
  }

  return instance
}

export function initScrollbarManager(hideDelay?: number): ScrollbarManager {
  const manager = getScrollbarManager(hideDelay)
  manager.init()
  return manager
}

export function destroyScrollbarManager(): void {
  if (instance) {
    instance.destroy()
    instance = null
  }
}
