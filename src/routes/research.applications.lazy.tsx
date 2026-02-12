import { createLazyFileRoute } from '@tanstack/react-router'
import { ApplicationsPage } from '@/pages/ApplicationsPage'

export const Route = createLazyFileRoute('/research/applications')({
  component: ApplicationsPage,
})
