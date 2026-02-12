import { createLazyFileRoute } from '@tanstack/react-router'
import { OpticalDesignPage } from '@/pages/OpticalDesignPage'

export const Route = createLazyFileRoute('/studio')({
  component: OpticalDesignPage,
})
