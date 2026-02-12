import { createLazyFileRoute } from '@tanstack/react-router'
import { EscapeRoomPage } from '@/pages/EscapeRoomPage'

export const Route = createLazyFileRoute('/games/escape')({
  component: EscapeRoomPage,
})
