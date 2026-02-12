import { createLazyFileRoute } from '@tanstack/react-router'
import { CoursePage } from '@/pages/CoursePage'

export const Route = createLazyFileRoute('/course')({
  component: CoursePage,
})
