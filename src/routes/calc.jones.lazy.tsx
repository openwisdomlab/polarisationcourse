import { createLazyFileRoute } from '@tanstack/react-router'
import { JonesCalculatorPage } from '@/pages/JonesCalculatorPage'

export const Route = createLazyFileRoute('/calc/jones')({
  component: JonesCalculatorPage,
})
