import { createFileRoute } from '@tanstack/react-router'

type StudioSearch = {
  experiment?: string
  challenge?: string
  module?: string
}

export const Route = createFileRoute('/studio')({
  validateSearch: (search: Record<string, unknown>): StudioSearch => ({
    experiment: search.experiment as string | undefined,
    challenge: search.challenge as string | undefined,
    module: search.module as string | undefined,
  }),
})
