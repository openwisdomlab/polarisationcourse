import { createLazyFileRoute } from '@tanstack/react-router'
import { MerchandisePage } from '@/pages/MerchandisePage'

export const Route = createLazyFileRoute('/merchandise')({
  component: MerchandisePage,
})
