import { createFileRoute } from '@tanstack/react-router'

type StudioSearch = {
  experiment?: string
  challenge?: string
  module?: string
  /** Base64url-encoded bench state for shareable designs */
  setup?: string
}

export const Route = createFileRoute('/studio')({
  validateSearch: (search: Record<string, unknown>): StudioSearch => ({
    experiment: search.experiment as string | undefined,
    challenge: search.challenge as string | undefined,
    module: search.module as string | undefined,
    setup: search.setup as string | undefined,
  }),
})
