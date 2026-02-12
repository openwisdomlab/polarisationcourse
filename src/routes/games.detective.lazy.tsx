import { createLazyFileRoute } from '@tanstack/react-router'
import { DetectiveGamePage } from '@/pages/DetectiveGamePage'

export const Route = createLazyFileRoute('/games/detective')({
  component: DetectiveGamePage,
})
