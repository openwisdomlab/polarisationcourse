import { createLazyFileRoute } from '@tanstack/react-router'
import { StokesCalculatorPage } from '@/pages/StokesCalculatorPage'

export const Route = createLazyFileRoute('/calc/stokes')({
  component: StokesCalculatorPage,
})
