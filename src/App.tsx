import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'))
const GamePage = lazy(() => import('@/pages/GamePage'))
const Game2DPage = lazy(() => import('@/pages/Game2DPage'))
const DemosPage = lazy(() => import('@/pages/DemosPage'))
const HardwarePage = lazy(() => import('@/pages/HardwarePage'))
const CardGamePage = lazy(() => import('@/pages/CardGamePage'))
const MerchandisePage = lazy(() => import('@/pages/MerchandisePage'))
const GameHubPage = lazy(() => import('@/pages/GameHubPage'))
const EscapeRoomPage = lazy(() => import('@/pages/EscapeRoomPage'))
const ChroniclesPage = lazy(() => import('@/pages/ChroniclesPage'))
const LabPage = lazy(() => import('@/pages/LabPage'))
const OpticalDesignPage = lazy(() => import('@/pages/OpticalDesignPage'))
const ApplicationsPage = lazy(() => import('@/pages/ApplicationsPage'))
const ExperimentsPage = lazy(() => import('@/pages/ExperimentsPage'))
const CalculationWorkshopPage = lazy(() => import('@/pages/CalculationWorkshopPage'))
const PoincareSphereViewerPage = lazy(() => import('@/pages/PoincareSphereViewerPage'))
const JonesCalculatorPage = lazy(() => import('@/pages/JonesCalculatorPage'))
const StokesCalculatorPage = lazy(() => import('@/pages/StokesCalculatorPage'))
const MuellerCalculatorPage = lazy(() => import('@/pages/MuellerCalculatorPage'))
const DetectiveGamePage = lazy(() => import('@/pages/DetectiveGamePage'))
const CoursePage = lazy(() => import('@/pages/CoursePage'))
const LearningHubPage = lazy(() => import('@/pages/LearningHubPage'))

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

        {/* Lab tools (legacy routes, redirect to /calc) */}
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
