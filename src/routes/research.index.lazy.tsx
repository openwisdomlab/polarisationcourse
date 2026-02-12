import { createLazyFileRoute } from '@tanstack/react-router'
import { LabPage } from '@/pages/LabPage'

export const Route = createLazyFileRoute('/research/')({
  component: LabPage,
})
