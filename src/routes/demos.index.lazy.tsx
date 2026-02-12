import { createLazyFileRoute } from '@tanstack/react-router'
import { DemosPage } from '@/pages/DemosPage'

export const Route = createLazyFileRoute('/demos/')({
  component: DemosPage,
})
