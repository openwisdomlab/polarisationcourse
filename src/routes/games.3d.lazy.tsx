import { createLazyFileRoute } from '@tanstack/react-router'
import { GamePage } from '@/pages/GamePage'

export const Route = createLazyFileRoute('/games/3d')({
  component: GamePage,
})
