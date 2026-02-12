import { createFileRoute, redirect } from '@tanstack/react-router'

export type DemosSearch = {
  unit?: string
  difficulty?: string
  search?: string
  demo?: string // Legacy query param — redirected to /demos/$demoId in beforeLoad
}

export const Route = createFileRoute('/demos/')({
  validateSearch: (search: Record<string, unknown>): DemosSearch => ({
    unit: search.unit as string | undefined,
    difficulty: search.difficulty as string | undefined,
    search: search.search as string | undefined,
    demo: search.demo as string | undefined,
  }),
  beforeLoad: ({ search }) => {
    // Redirect legacy ?demo=xxx to /demos/$demoId (render-as-you-fetch pattern)
    if (search.demo) {
      throw redirect({
        to: '/demos/$demoId',
        params: { demoId: search.demo },
        replace: true,
      })
    }
  },
})
