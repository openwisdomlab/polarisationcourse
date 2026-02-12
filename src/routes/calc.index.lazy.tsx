import { createLazyFileRoute } from '@tanstack/react-router'
import { CalculationWorkshopPage } from '@/pages/CalculationWorkshopPage'

export const Route = createLazyFileRoute('/calc/')({
  component: CalculationWorkshopPage,
})
