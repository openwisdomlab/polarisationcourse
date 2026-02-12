import { createLazyFileRoute } from '@tanstack/react-router'
import { PoincareSphereViewerPage } from '@/pages/PoincareSphereViewerPage'

export const Route = createLazyFileRoute('/calc/poincare')({
  component: PoincareSphereViewerPage,
})
