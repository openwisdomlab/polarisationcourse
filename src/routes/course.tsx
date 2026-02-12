import { createFileRoute } from '@tanstack/react-router'

export type CourseSearch = {
  unit?: string
  section?: string
}

export const Route = createFileRoute('/course')({
  validateSearch: (search: Record<string, unknown>): CourseSearch => ({
    unit: search.unit as string | undefined,
    section: search.section as string | undefined,
  }),
})
