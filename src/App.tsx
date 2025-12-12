import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, GamePage, Game2DPage, DemosPage, HardwarePage, CardGamePage, MerchandisePage } from '@/pages'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/game2d" element={<Game2DPage />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/hardware" element={<HardwarePage />} />
        <Route path="/cardgame" element={<CardGamePage />} />
        <Route path="/merchandise" element={<MerchandisePage />} />
      </Routes>
    </BrowserRouter>
  )
}
