import { Suspense, lazy } from 'react'   // React 组件懒加载和 Suspense
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'   // React Router 组件
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'   // 错误边界组件

// Lazy load all pages for code splitting懒加载所有页面以进行代码拆分
const HomePage = lazy(() => import('@/pages/HomePage'))   // 主页
const GamePage = lazy(() => import('@/pages/GamePage'))   // 3D 游戏页面
const Game2DPage = lazy(() => import('@/pages/Game2DPage'))   // 2D 游戏页面
const DemosPage = lazy(() => import('@/pages/DemosPage'))   // 演示页面
const HardwarePage = lazy(() => import('@/pages/HardwarePage'))   // 硬件页面
const CardGamePage = lazy(() => import('@/pages/CardGamePage'))   // 卡牌游戏页面
const MerchandisePage = lazy(() => import('@/pages/MerchandisePage'))   // 商品页面
const GameHubPage = lazy(() => import('@/pages/GameHubPage'))   // 游戏中心页面
const EscapeRoomPage = lazy(() => import('@/pages/EscapeRoomPage'))   // 密室逃脱页面
const ChroniclesPage = lazy(() => import('@/pages/ChroniclesPage'))   // 编年史页面
const LabPage = lazy(() => import('@/pages/LabPage'))   // 实验室页面
const OpticalDesignPage = lazy(() => import('@/pages/OpticalDesignPage'))   // 光学设计室页面
const ApplicationsPage = lazy(() => import('@/pages/ApplicationsPage'))   // 应用页面
const ExperimentsPage = lazy(() => import('@/pages/ExperimentsPage'))   // 实验页面
const CalculationWorkshopPage = lazy(() => import('@/pages/CalculationWorkshopPage'))   // 计算工坊页面
const PoincareSphereViewerPage = lazy(() => import('@/pages/PoincareSphereViewerPage'))   // 玻恩球查看器页面
const JonesCalculatorPage = lazy(() => import('@/pages/JonesCalculatorPage'))   // 琼斯计算器页面
const StokesCalculatorPage = lazy(() => import('@/pages/StokesCalculatorPage'))   // 斯托克斯计算器页面
const MuellerCalculatorPage = lazy(() => import('@/pages/MuellerCalculatorPage'))   // 穆勒计算器页面
const DetectiveGamePage = lazy(() => import('@/pages/DetectiveGamePage'))   // 侦探游戏页面
const CoursePage = lazy(() => import('@/pages/CoursePage'))    // 课程页面
const LearningHubPage = lazy(() => import('@/pages/LearningHubPage'))   // 学习中心页面

// Loading fallback component 加载回退组件
function PageLoader() {
  return (
    <>
    {/* Fullscreen centered loader 全屏居中加载器 */}
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      {/* Animated spinner with text 带文字的动画旋转器 */}
      <div className="animate-pulse flex flex-col items-center gap-4">
        {/* Spinner 旋转器 */}
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-cyan-400 text-sm">Loading...</span>
      </div>
    </div>
    </>
  )
}   // 页面加载器组件

// Main application component 主应用组件

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

        {/* Games Hub - PolarQuest module 游戏hub - PolarQuest模块 */}
        <Route path="/games" element={<GameHubPage />} />
        <Route path="/games/2d" element={<Game2DPage />} />
        <Route path="/games/3d" element={<GamePage />} />
        <Route path="/games/card" element={<CardGamePage />} />
        <Route path="/games/escape" element={<EscapeRoomPage />} />
        <Route path="/games/detective" element={<DetectiveGamePage />} />

        {/* Standalone game routes (for backwards compatibility) standalone游戏路由 （用于向后兼容） */}
        <Route path="/game" element={<Navigate to="/games/3d" replace />} />
        <Route path="/game2d" element={<Navigate to="/games/2d" replace />} />
        <Route path="/cardgame" element={<Navigate to="/games/card" replace />} />
        <Route path="/escape" element={<Navigate to="/games/escape" replace />} />

        {/* Other modules - Demos with optional demo ID for deep linking 其他路由 - demos 有可选的 demo ID 用于深度链接 */}
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/demos/:demoId" element={<DemosPage />} />
        <Route path="/hardware" element={<HardwarePage />} />
        <Route path="/merchandise" element={<MerchandisePage />} />
        <Route path="/chronicles" element={<ChroniclesPage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/learn" element={<LearningHubPage />} />
        <Route path="/lab" element={<LabPage />} />

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

        {/* Lab tools (legacy routes, redirect to /calc)  实验室工具（标准路由，重定向到/calc */}
        <Route path="/lab/poincare" element={<Navigate to="/calc/poincare" replace />} />
        <Route path="/lab/jones" element={<Navigate to="/calc/jones" replace />} />
        <Route path="/lab/stokes" element={<Navigate to="/calc/stokes" replace />} />
        <Route path="/lab/mueller" element={<Navigate to="/calc/mueller" replace />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
