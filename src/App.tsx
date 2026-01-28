import { Suspense, lazy, useState } from 'react'   // React 组件懒加载和 Suspense
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'   // React Router 组件
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'   // 错误边界组件
import { PasswordLock } from '@/components/ui/PasswordLock'   // 密码锁组件
import { FeedbackWidget } from '@/components/ui/FeedbackWidget'   // 反馈组件
import { PWAUpdatePrompt } from '@/components/ui/PWAUpdatePrompt'   // PWA更新提示组件

// ============================================================
// Lazy load all pages for code splitting
// 懒加载所有页面组件以实现代码分割
// ============================================================

// Home
const HomePage = lazy(() => import('@/pages/HomePage'))

// ============================================================
// 6 Core Modules - 六大核心模块（一级页面）
// 每个模块都是独立的一级页面，不再是简单的导航枢纽
// ============================================================

// Module 1: 光的编年史 (Chronicles of Light)
// 历史故事 × 经典实验
const ChroniclesPage = lazy(() => import('@/pages/ChroniclesPage'))

// Module 2: 光学设计室 (Optical Design Studio)
// 偏振器件 × 光路设计
const OpticalDesignPage = lazy(() => import('@/pages/OpticalDesignPage'))

// Module 3: 偏振演示馆 (Demo Gallery)
// 基础理论 × 计算模拟
const DemosPage = lazy(() => import('@/pages/DemosPage'))

// Module 4: 偏振光探秘 (PolarQuest - Games)
// 解谜游戏 × 偏振策略
const GameHubPage = lazy(() => import('@/pages/GameHubPage'))
const Game2DPage = lazy(() => import('@/pages/Game2DPage'))
const GamePage = lazy(() => import('@/pages/GamePage'))
const CardGamePage = lazy(() => import('@/pages/CardGamePage'))
const EscapeRoomPage = lazy(() => import('@/pages/EscapeRoomPage'))
const DetectiveGamePage = lazy(() => import('@/pages/DetectiveGamePage'))

// Module 5: 偏振造物局 (Creative Gallery)
// 偏振艺术 × 文创作品
const ExperimentsPage = lazy(() => import('@/pages/ExperimentsPage'))
const MerchandisePage = lazy(() => import('@/pages/MerchandisePage'))

// Module 6: 虚拟课题组 (Virtual Research Lab)
// 开放研究 × 课题实践
const LabPage = lazy(() => import('@/pages/LabPage'))
const ApplicationsPage = lazy(() => import('@/pages/ApplicationsPage'))

// ============================================================
// Course System - 课程体系（独立模块）
// P-SRT 渐进式研究训练课程
// ============================================================
const CoursePage = lazy(() => import('@/pages/CoursePage'))
const LearningHubPage = lazy(() => import('@/pages/LearningHubPage'))

// ============================================================
// Utility Pages - 工具页面（尾页内容）
// 计算工坊、硬件器件等辅助功能
// ============================================================
const CalculationWorkshopPage = lazy(() => import('@/pages/CalculationWorkshopPage'))
const JonesCalculatorPage = lazy(() => import('@/pages/JonesCalculatorPage'))
const StokesCalculatorPage = lazy(() => import('@/pages/StokesCalculatorPage'))
const MuellerCalculatorPage = lazy(() => import('@/pages/MuellerCalculatorPage'))
const PoincareSphereViewerPage = lazy(() => import('@/pages/PoincareSphereViewerPage'))
const HardwarePage = lazy(() => import('@/pages/HardwarePage'))

// ============================================================
// Loading fallback component
// 加载中的占位组件
// ============================================================
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

// ============================================================
// Main App Component
// 主应用组件
// ============================================================
export function App() {
  // Password lock state - check localStorage on mount
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('polarcraft_unlocked') === 'true'
  })

  // Handle unlock
  const handleUnlock = () => {
    setIsUnlocked(true)
  }

  // Show password lock if not unlocked
  if (!isUnlocked) {
    return <PasswordLock onUnlock={handleUnlock} />
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* PWA update prompt - 检测新版本并提示更新 */}
        <PWAUpdatePrompt />
        {/* Feedback widget - always visible */}
        <FeedbackWidget />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ========================================
                Home - 首页
            ======================================== */}
            <Route path="/" element={<HomePage />} />

            {/* ========================================
                6 Core Modules - 六大核心模块（一级页面）
                首页六个模块直接链接到这些页面
            ======================================== */}

            {/* Module 1: 光的编年史 (Chronicles of Light) */}
            <Route path="/chronicles" element={<ChroniclesPage />} />

            {/* Module 2: 光学设计室 (Optical Design Studio) */}
            <Route path="/studio" element={<OpticalDesignPage />} />

            {/* Module 3: 偏振演示馆 (Demo Gallery) */}
            <Route path="/demos" element={<DemosPage />} />
            <Route path="/demos/:demoId" element={<DemosPage />} />

            {/* Module 4: 偏振光探秘 (PolarQuest - Games) */}
            <Route path="/games" element={<GameHubPage />} />
            <Route path="/games/2d" element={<Game2DPage />} />
            <Route path="/games/3d" element={<GamePage />} />
            <Route path="/games/card" element={<CardGamePage />} />
            <Route path="/games/escape" element={<EscapeRoomPage />} />
            <Route path="/games/detective" element={<DetectiveGamePage />} />

            {/* Module 5: 偏振造物局 (Creative Gallery) */}
            <Route path="/gallery" element={<ExperimentsPage />} />
            <Route path="/gallery/:tabId" element={<ExperimentsPage />} />

            {/* Module 6: 虚拟课题组 (Virtual Research Lab) */}
            <Route path="/research" element={<LabPage />} />
            <Route path="/research/applications" element={<ApplicationsPage />} />

            {/* ========================================
                Course System - 课程体系（独立模块）
            ======================================== */}
            <Route path="/course" element={<CoursePage />} />
            <Route path="/learn" element={<LearningHubPage />} />

            {/* ========================================
                Utility Pages - 工具页面（尾页内容）
            ======================================== */}
            {/* Calculation Workshop - 计算工坊 */}
            <Route path="/calc" element={<CalculationWorkshopPage />} />
            <Route path="/calc/jones" element={<JonesCalculatorPage />} />
            <Route path="/calc/stokes" element={<StokesCalculatorPage />} />
            <Route path="/calc/mueller" element={<MuellerCalculatorPage />} />
            <Route path="/calc/poincare" element={<PoincareSphereViewerPage />} />

            {/* Hardware Guide - 硬件器件 */}
            <Route path="/hardware" element={<HardwarePage />} />

            {/* Merchandise - 文创商品 */}
            <Route path="/merchandise" element={<MerchandisePage />} />

            {/* ========================================
                Legacy Routes - 兼容旧路由
                保留旧链接的重定向，防止链接失效
            ======================================== */}
            {/* Old hub pages redirect to new first-level pages */}
            <Route path="/education" element={<Navigate to="/chronicles" replace />} />
            <Route path="/arsenal" element={<Navigate to="/studio" replace />} />
            <Route path="/theory" element={<Navigate to="/demos" replace />} />
            <Route path="/optical-studio" element={<Navigate to="/studio" replace />} />
            <Route path="/experiments" element={<Navigate to="/gallery" replace />} />
            <Route path="/experiments/:tabId" element={<Navigate to="/gallery/:tabId" replace />} />
            <Route path="/lab" element={<Navigate to="/research" replace />} />
            <Route path="/applications" element={<Navigate to="/research/applications" replace />} />

            {/* Game legacy routes */}
            <Route path="/game" element={<Navigate to="/games/3d" replace />} />
            <Route path="/game2d" element={<Navigate to="/games/2d" replace />} />
            <Route path="/cardgame" element={<Navigate to="/games/card" replace />} />
            <Route path="/escape" element={<Navigate to="/games/escape" replace />} />

            {/* Optical studio legacy routes */}
            <Route path="/devices" element={<Navigate to="/studio" replace />} />
            <Route path="/bench" element={<Navigate to="/studio" replace />} />
            <Route path="/optics" element={<Navigate to="/studio" replace />} />
            <Route path="/optical-studio-v2" element={<Navigate to="/studio" replace />} />

            {/* Lab tools legacy routes */}
            <Route path="/lab/poincare" element={<Navigate to="/calc/poincare" replace />} />
            <Route path="/lab/jones" element={<Navigate to="/calc/jones" replace />} />
            <Route path="/lab/stokes" element={<Navigate to="/calc/stokes" replace />} />
            <Route path="/lab/mueller" element={<Navigate to="/calc/mueller" replace />} />

            {/* Other legacy routes */}
            <Route path="/creative" element={<Navigate to="/gallery" replace />} />
            <Route path="/simulation" element={<Navigate to="/research" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
