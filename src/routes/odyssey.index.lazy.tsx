import { createLazyFileRoute } from '@tanstack/react-router'
import { OdysseyPage } from '@/pages/OdysseyPage'

export const Route = createLazyFileRoute('/odyssey/')({ component: OdysseyPage })
