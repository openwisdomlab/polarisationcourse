import { createFileRoute } from '@tanstack/react-router'
import { OdysseyLoader } from '@/components/ui/RouteLoader'

export const Route = createFileRoute('/odyssey/')({
  pendingComponent: OdysseyLoader,
})
