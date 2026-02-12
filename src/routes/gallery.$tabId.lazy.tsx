import { createLazyFileRoute } from '@tanstack/react-router'
import { ExperimentsPage } from '@/pages/ExperimentsPage'

export const Route = createLazyFileRoute('/gallery/$tabId')({
  component: ExperimentsPage,
})
