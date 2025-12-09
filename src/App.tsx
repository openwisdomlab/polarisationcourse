import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, GamePage, Game2DPage, DemosPage } from '@/pages'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/game2d" element={<Game2DPage />} />
        <Route path="/demos" element={<DemosPage />} />
      </Routes>
    </BrowserRouter>
  )
}
