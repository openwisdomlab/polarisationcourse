import { createFileRoute } from '@tanstack/react-router'

export type MerchandiseSearch = {
  category?: string
  sort?: string
  tab?: string
}

export const Route = createFileRoute('/merchandise')({
  validateSearch: (search: Record<string, unknown>): MerchandiseSearch => ({
    category: search.category as string | undefined,
    sort: search.sort as string | undefined,
    tab: search.tab as string | undefined,
  }),
})
