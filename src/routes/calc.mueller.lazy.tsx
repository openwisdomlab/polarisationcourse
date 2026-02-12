import { createLazyFileRoute } from '@tanstack/react-router'
import { MuellerCalculatorPage } from '@/pages/MuellerCalculatorPage'

export const Route = createLazyFileRoute('/calc/mueller')({
  component: MuellerCalculatorPage,
})
