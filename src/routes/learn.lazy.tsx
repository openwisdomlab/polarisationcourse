import { createLazyFileRoute } from '@tanstack/react-router'
import LearningHubPage from '@/pages/LearningHubPage'

export const Route = createLazyFileRoute('/learn')({
  component: LearningHubPage,
})
