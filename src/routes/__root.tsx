import { useState } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { PasswordLock } from '@/components/ui/PasswordLock'
import { FeedbackWidget } from '@/components/ui/FeedbackWidget'
import { PWAUpdatePrompt } from '@/components/ui/PWAUpdatePrompt'

// Loading fallback component 加载中的占位组件
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-cyan-400 text-sm">Loading...</span>
      </div>
    </div>
  )
}

// Root layout component 根布局组件
function RootLayout() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('polarcraft_unlocked') === 'true'
  })

  if (!isUnlocked) {
    return <PasswordLock onUnlock={() => setIsUnlocked(true)} />
  }

  return (
    <ErrorBoundary>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
      <PWAUpdatePrompt />
      <FeedbackWidget />
      <div id="main-content">
        <Outlet />
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </ErrorBoundary>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  pendingComponent: PageLoader,
})
