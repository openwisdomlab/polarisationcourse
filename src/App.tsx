import { Suspense, lazy, useState, ComponentType } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { FeedbackWidget } from '@/components/ui/FeedbackWidget'
import { PuzzleGate, checkAccess } from '@/components/shared/PuzzleGate'

// Retry dynamic import with cache busting for failed module loads
// This handles cases where chunks fail to load due to deployment/cache issues
function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn()
      } catch (error) {
        // On last retry, try with cache-busting query parameter
        if (i === retries - 1) {
          // Force reload to get fresh assets after deployment
          const isChunkError = error instanceof Error &&
            (error.message.includes('Failed to fetch') ||
             error.message.includes('Loading chunk') ||
             error.message.includes('dynamically imported module'))

          if (isChunkError) {
            // Reload the page to get fresh HTML with new asset hashes
            window.location.reload()
          }
          throw error
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
    throw new Error('Failed to load module after retries')
  })
}

// Lazy load all pages for code splitting (with retry logic)
const HomePage = lazyWithRetry(() => import('@/pages/HomePage'))
const GamePage = lazyWithRetry(() => import('@/pages/GamePage'))
const Game2DPage = lazyWithRetry(() => import('@/pages/Game2DPage'))
const DemosPage = lazyWithRetry(() => import('@/pages/DemosPage'))
const HardwarePage = lazyWithRetry(() => import('@/pages/HardwarePage'))
const CardGamePage = lazyWithRetry(() => import('@/pages/CardGamePage'))
const MerchandisePage = lazyWithRetry(() => import('@/pages/MerchandisePage'))
const GameHubPage = lazyWithRetry(() => import('@/pages/GameHubPage'))
const EscapeRoomPage = lazyWithRetry(() => import('@/pages/EscapeRoomPage'))
const ChroniclesPage = lazyWithRetry(() => import('@/pages/ChroniclesPage'))
const LabPage = lazyWithRetry(() => import('@/pages/LabPage'))
const OpticalDesignPage = lazyWithRetry(() => import('@/pages/OpticalDesignPage'))
const ApplicationsPage = lazyWithRetry(() => import('@/pages/ApplicationsPage'))
const ExperimentsPage = lazyWithRetry(() => import('@/pages/ExperimentsPage'))
const CalculationWorkshopPage = lazyWithRetry(() => import('@/pages/CalculationWorkshopPage'))
const PoincareSphereViewerPage = lazyWithRetry(() => import('@/pages/PoincareSphereViewerPage'))
const JonesCalculatorPage = lazyWithRetry(() => import('@/pages/JonesCalculatorPage'))
const StokesCalculatorPage = lazyWithRetry(() => import('@/pages/StokesCalculatorPage'))
const MuellerCalculatorPage = lazyWithRetry(() => import('@/pages/MuellerCalculatorPage'))
const DetectiveGamePage = lazyWithRetry(() => import('@/pages/DetectiveGamePage'))
const LearningHubPage = lazyWithRetry(() => import('@/pages/LearningHubPage'))

// Light Explorer - 渐进式探索光学编年史
const LightExplorerPage = lazyWithRetry(() => import('@/pages/LightExplorerPage'))

// Exploration Pages - 问题驱动的探索系统
const ExplorePage = lazyWithRetry(() => import('@/pages/ExplorePage'))
const ExplorationNodePage = lazyWithRetry(() => import('@/pages/ExplorationNodePage'))

// Discovery Page - 渐进式探索入口 (Google Learn About inspired)
const DiscoveryPage = lazyWithRetry(() => import('@/pages/DiscoveryPage'))

// Course Content Layer - 《偏振光下的世界》独立课程
const WorldCourseHome = lazyWithRetry(() => import('@/course/pages/CourseHome'))
const WorldCourseUnit = lazyWithRetry(() => import('@/course/pages/UnitOverview'))
const WorldCourseLesson = lazyWithRetry(() => import('@/course/pages/LessonPage'))

// Loading fallback component
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

export function App() {
  // 全局访问验证状态
  const [hasAccess, setHasAccess] = useState(() => checkAccess())

  // 如果未通过验证，显示密码锁（所有路由都需要先验证）
  if (!hasAccess) {
    return (
      <ErrorBoundary>
        <PuzzleGate onAccessGranted={() => setHasAccess(true)} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

        {/* Games Hub - PolarQuest module */}
        <Route path="/games" element={<GameHubPage />} />
        <Route path="/games/2d" element={<Game2DPage />} />
        <Route path="/games/3d" element={<GamePage />} />
        <Route path="/games/card" element={<CardGamePage />} />
        <Route path="/games/escape" element={<EscapeRoomPage />} />
        <Route path="/games/detective" element={<DetectiveGamePage />} />

        {/* Standalone game routes (for backwards compatibility) */}
        <Route path="/game" element={<Navigate to="/games/3d" replace />} />
        <Route path="/game2d" element={<Navigate to="/games/2d" replace />} />
        <Route path="/cardgame" element={<Navigate to="/games/card" replace />} />
        <Route path="/escape" element={<Navigate to="/games/escape" replace />} />

        {/* Other modules - Demos with optional demo ID for deep linking */}
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/demos/:demoId" element={<DemosPage />} />
        <Route path="/hardware" element={<HardwarePage />} />
        <Route path="/merchandise" element={<MerchandisePage />} />

        {/* Chronicles - 光的编年史 (时间线为主) */}
        <Route path="/chronicles" element={<ChroniclesPage />} />
        {/* 渐进式探索入口 (可选) */}
        <Route path="/chronicles/explore" element={<LightExplorerPage />} />

        {/* Redirect /course to home page (course outline is now on homepage) */}
        <Route path="/course" element={<Navigate to="/" replace />} />
        <Route path="/learn" element={<LearningHubPage />} />
        <Route path="/lab" element={<LabPage />} />

        {/* Exploration - 问题驱动的探索系统 */}
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:nodeId" element={<ExplorationNodePage />} />

        {/* Discovery - 渐进式探索入口 (避免信息过载的新设计) */}
        <Route path="/discover" element={<DiscoveryPage />} />
        <Route path="/discover/:topicId" element={<DiscoveryPage />} />

        {/* Optical Design Studio - 光学设计室 (模块化版本) */}
        <Route path="/optical-studio" element={<OpticalDesignPage />} />

        {/* Legacy optical studio route - redirect to main */}
        <Route path="/optical-studio-v2" element={<Navigate to="/optical-studio" replace />} />

        {/* Legacy routes - redirect to merged optical studio */}
        <Route path="/devices" element={<Navigate to="/optical-studio" replace />} />
        <Route path="/bench" element={<Navigate to="/optical-studio" replace />} />
        <Route path="/optics" element={<Navigate to="/optical-studio" replace />} />

        {/* Other modules */}
        <Route path="/applications" element={<ApplicationsPage />} />

        {/* Experiments - 偏振造物局 (with sub-routes) */}
        <Route path="/experiments" element={<ExperimentsPage />} />
        <Route path="/experiments/:tabId" element={<ExperimentsPage />} />

        {/* Legacy redirects */}
        <Route path="/creative" element={<Navigate to="/experiments" replace />} />
        <Route path="/simulation" element={<Navigate to="/lab" replace />} />

        {/* Calculation Workshop - 计算工坊 */}
        <Route path="/calc" element={<CalculationWorkshopPage />} />
        <Route path="/calc/jones" element={<JonesCalculatorPage />} />
        <Route path="/calc/mueller" element={<MuellerCalculatorPage />} />
        <Route path="/calc/stokes" element={<StokesCalculatorPage />} />
        <Route path="/calc/poincare" element={<PoincareSphereViewerPage />} />

        {/* Lab tools (legacy routes, redirect to /calc) */}
        <Route path="/lab/poincare" element={<Navigate to="/calc/poincare" replace />} />
        <Route path="/lab/jones" element={<Navigate to="/calc/jones" replace />} />
        <Route path="/lab/stokes" element={<Navigate to="/calc/stokes" replace />} />
        <Route path="/lab/mueller" element={<Navigate to="/calc/mueller" replace />} />

        {/* Course Content Layer - 《偏振光下的世界》独立课程 */}
        {/* 新增的课程内容层路由，不修改原有 /course 路由 */}
        <Route path="/course/world-under-polarized-light" element={<WorldCourseHome />} />
        <Route path="/course/world-under-polarized-light/unit/:unitId" element={<WorldCourseUnit />} />
        <Route path="/course/world-under-polarized-light/unit/:unitId/lesson/:lessonId" element={<WorldCourseLesson />} />
        </Routes>
        </Suspense>
        {/* 全局反馈浮动框 */}
        <FeedbackWidget />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
