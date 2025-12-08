import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, GamePage, DemosPage } from '@/pages'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/demos" element={<DemosPage />} />
      </Routes>
    </BrowserRouter>
  )
}
