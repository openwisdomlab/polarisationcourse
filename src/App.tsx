import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  HomePage,
  GamePage,
  Game2DPage,
  DemosPage,
  HardwarePage,
  CardGamePage,
  MerchandisePage,
  GameHubPage,
  EscapeRoomPage,
  ChroniclesPage,
  LabPage,
  OpticalDesignPage,
  OpticalDesignStudioPageV2 as OpticalDesignStudioPage,
  ApplicationsPage,
  ExperimentsPage,
  CalculationWorkshopPage,
  PoincareSphereViewerPage,
  JonesCalculatorPage,
  StokesCalculatorPage,
  MuellerCalculatorPage
} from '@/pages'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Games Hub - PolarQuest module */}
        <Route path="/games" element={<GameHubPage />} />
        <Route path="/games/2d" element={<Game2DPage />} />
        <Route path="/games/3d" element={<GamePage />} />
        <Route path="/games/card" element={<CardGamePage />} />
        <Route path="/games/escape" element={<EscapeRoomPage />} />

        {/* Standalone game routes (for backwards compatibility) */}
        <Route path="/game" element={<Navigate to="/games/3d" replace />} />
        <Route path="/game2d" element={<Navigate to="/games/2d" replace />} />
        <Route path="/cardgame" element={<Navigate to="/games/card" replace />} />
        <Route path="/escape" element={<Navigate to="/games/escape" replace />} />

        {/* Other modules */}
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/hardware" element={<HardwarePage />} />
        <Route path="/merchandise" element={<MerchandisePage />} />
        <Route path="/chronicles" element={<ChroniclesPage />} />
        <Route path="/lab" element={<LabPage />} />

        {/* Optical Design Studio - 光学设计室 (模块化版本) */}
        <Route path="/optical-studio" element={<OpticalDesignPage />} />

        {/* Legacy optical studio route */}
        <Route path="/optical-studio-v2" element={<OpticalDesignStudioPage />} />

        {/* Legacy routes - redirect to merged optical studio */}
        <Route path="/devices" element={<Navigate to="/optical-studio" replace />} />
        <Route path="/bench" element={<Navigate to="/optical-studio" replace />} />
        <Route path="/optics" element={<Navigate to="/optical-studio" replace />} />

        {/* Other modules */}
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />
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
    </BrowserRouter>
  )
}
