import { createLazyFileRoute } from '@tanstack/react-router'
import { Game2DPage } from '@/pages/Game2DPage'

export const Route = createLazyFileRoute('/games/2d')({
  component: Game2DPage,
})
