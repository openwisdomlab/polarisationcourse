/**
 * Catch-all route for legacy redirects and 404
 * 兼容旧路由重定向 + 404页面
 */
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'

// Legacy route redirects 旧路由重定向映射
const STATIC_REDIRECTS: Record<string, string> = {
  // Old hub pages → new first-level pages
  '/education': '/chronicles',
  '/arsenal': '/studio',
  '/theory': '/demos',
  '/optical-studio': '/studio',
  '/experiments': '/gallery',
  '/lab': '/research',
  '/applications': '/research/applications',

  // Game legacy routes
  '/game': '/games/3d',
  '/game2d': '/games/2d',
  '/cardgame': '/games/card',
  '/escape': '/games/escape',

  // Optical studio legacy routes
  '/devices': '/studio',
  '/bench': '/studio',
  '/optics': '/studio',
  '/optical-studio-v2': '/studio',

  // Lab tools legacy routes
  '/lab/poincare': '/calc/poincare',
  '/lab/jones': '/calc/jones',
  '/lab/stokes': '/calc/stokes',
  '/lab/mueller': '/calc/mueller',

  // Other legacy routes
  '/creative': '/gallery',
  '/simulation': '/research',
}

// Dynamic redirect patterns (prefix-based) 动态路径重定向
function resolveDynamicRedirect(pathname: string): string | null {
  // /experiments/:tabId → /gallery/:tabId
  const experimentsMatch = pathname.match(/^\/experiments\/(.+)$/)
  if (experimentsMatch) {
    return `/gallery/${experimentsMatch[1]}`
  }
  return null
}

function NotFoundComponent() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="text-center max-w-md px-6">
        <div className="text-8xl font-bold opacity-20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">
          {t('common.pageNotFound', 'Page Not Found')}
        </h1>
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('common.pageNotFoundDescription', 'The page you are looking for does not exist or has been moved.')}
        </p>
        <button
          onClick={() => router.navigate({ to: '/' })}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          {t('common.backToHome', 'Back to Home')}
        </button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/$')({
  beforeLoad: ({ location }) => {
    const pathname = location.pathname

    // Check static redirects
    const staticTarget = STATIC_REDIRECTS[pathname]
    if (staticTarget) {
      throw redirect({ to: staticTarget, replace: true })
    }

    // Check dynamic redirects
    const dynamicTarget = resolveDynamicRedirect(pathname)
    if (dynamicTarget) {
      throw redirect({ to: dynamicTarget, replace: true })
    }
  },
  component: NotFoundComponent,
})
