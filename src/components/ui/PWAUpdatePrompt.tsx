import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * PWA更新提示组件
 * 当检测到新版本时，在页面底部显示更新提示条
 * 用户可以选择立即更新或稍后更新
 */
export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // 每小时检查一次更新
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error)
    },
  })

  useEffect(() => {
    setShowPrompt(needRefresh)
  }, [needRefresh])

  if (!showPrompt) return null

  const handleUpdate = () => {
    updateServiceWorker(true)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setNeedRefresh(false)
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] animate-slide-up">
      <div className="flex items-center gap-3 rounded-xl bg-slate-800/95 backdrop-blur-sm border border-cyan-500/30 px-5 py-3 shadow-lg shadow-cyan-500/10">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-cyan-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm text-slate-200">
            发现新版本 / New version available
          </span>
        </div>
        <button
          onClick={handleUpdate}
          className="px-3 py-1 text-sm font-medium rounded-lg bg-cyan-500 text-slate-900 hover:bg-cyan-400 transition-colors cursor-pointer"
        >
          更新 / Update
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
