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
  DevicesPage,
  BenchPage,
  ApplicationsPage,
  ExperimentsPage,
  PoincareSphereViewerPage,
  JonesCalculatorPage
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

        {/* New modules */}
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/bench" element={<BenchPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />

        {/* Lab tools */}
        <Route path="/lab/poincare" element={<PoincareSphereViewerPage />} />
        <Route path="/lab/jones" element={<JonesCalculatorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
