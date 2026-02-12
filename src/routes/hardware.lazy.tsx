import { createLazyFileRoute } from '@tanstack/react-router'
import { HardwarePage } from '@/pages/HardwarePage'

export const Route = createLazyFileRoute('/hardware')({
  component: HardwarePage,
})
