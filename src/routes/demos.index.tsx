import { createFileRoute } from '@tanstack/react-router'

export type DemosSearch = {
  unit?: string
  difficulty?: string
  search?: string
}

export const Route = createFileRoute('/demos/')({
  validateSearch: (search: Record<string, unknown>): DemosSearch => ({
    unit: search.unit as string | undefined,
    difficulty: search.difficulty as string | undefined,
    search: search.search as string | undefined,
  }),
})
