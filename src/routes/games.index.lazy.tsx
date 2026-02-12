import { createLazyFileRoute } from '@tanstack/react-router'
import { GameHubPage } from '@/pages/GameHubPage'

export const Route = createLazyFileRoute('/games/')({
  component: GameHubPage,
})
