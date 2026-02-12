import { createLazyFileRoute } from '@tanstack/react-router'
import { ChroniclesPage } from '@/pages/ChroniclesPage'

export const Route = createLazyFileRoute('/chronicles')({
  component: ChroniclesPage,
})
