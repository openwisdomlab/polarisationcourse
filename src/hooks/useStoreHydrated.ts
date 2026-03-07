/**
 * useStoreHydrated - Zustand persist水合状态检测
 *
 * Detects when a Zustand persist store has finished rehydrating from storage.
 * Prevents reading stale default state before hydration completes.
 *
 * Usage:
 * ```tsx
 * const hydrated = useStoreHydrated(useDiscoveryStore)
 * if (!hydrated) return <Loader />
 * ```
 */

import { useSyncExternalStore } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PersistStore = {
  persist: {
    hasHydrated: () => boolean
    onFinishHydration: (fn: () => void) => () => void
  }
}

/**
 * Returns true once the given Zustand persist store has finished hydrating.
 * Safe to use in concurrent React (uses useSyncExternalStore).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStoreHydrated(store: any): boolean {
  const persistApi = (store as PersistStore)?.persist
  if (!persistApi) return true // Non-persist stores are always "hydrated"

  return useSyncExternalStore(
    persistApi.onFinishHydration,
    () => persistApi.hasHydrated(),
    () => false // SSR: not hydrated
  )
}
