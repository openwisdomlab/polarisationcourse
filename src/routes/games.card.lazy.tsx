import { createLazyFileRoute } from '@tanstack/react-router'
import { CardGamePage } from '@/pages/CardGamePage'

export const Route = createLazyFileRoute('/games/card')({
  component: CardGamePage,
})
