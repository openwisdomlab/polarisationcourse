/**
 * SyncManager - Bridges Zustand stores with the backend API
 *
 * Pattern: Write-through + merge-on-login
 * 1. Write-through: When user completes a demo or unlocks a discovery,
 *    fire-and-forget POST to backend (if authenticated)
 * 2. Merge-on-login: When user logs in, fetch full progress from server
 *    and merge with localStorage (server data takes priority for conflicts)
 * 3. Graceful offline: All operations work offline via localStorage;
 *    sync happens when reconnected
 *
 * Phase 1: Only bridges discoveryStore (demos + discoveries)
 */

import { useAuthStore } from '@/stores/authStore'
import { useDiscoveryStore } from '@/stores/discoveryStore'
import { api } from './api'
import type { FullProgress } from './api'

let subscribed = false

/**
 * Initialize sync subscriptions. Call once at app startup.
 */
export function initSyncManager() {
  if (subscribed) return
  subscribed = true

  // Subscribe to discoveryStore changes for write-through
  useDiscoveryStore.subscribe(
    (state, prevState) => {
      if (!useAuthStore.getState().isAuthenticated) return

      // Detect newly completed demos
      if (state.completedDemos.length > prevState.completedDemos.length) {
        const newDemos = state.completedDemos.filter(
          (id) => !prevState.completedDemos.includes(id),
        )
        for (const demoId of newDemos) {
          api.progress.completeDemo(demoId).catch(() => {
            // Fire-and-forget; will sync on next login
          })
        }
      }

      // Detect newly unlocked discoveries
      const prevIds = Object.keys(prevState.discoveries)
      const currIds = Object.keys(state.discoveries)
      if (currIds.length > prevIds.length) {
        const newIds = currIds.filter((id) => !prevIds.includes(id))
        for (const discoveryId of newIds) {
          const disc = state.discoveries[discoveryId]
          api.progress.unlockDiscovery(discoveryId, disc?.discoveredIn).catch(() => {
            // Fire-and-forget
          })
        }
      }
    },
  )

  // On auth state change, trigger merge when logging in
  useAuthStore.subscribe(
    (state, prevState) => {
      if (state.isAuthenticated && !prevState.isAuthenticated) {
        mergeOnLogin()
      }
    },
  )

  // If already authenticated on startup, refresh profile and merge
  if (useAuthStore.getState().token) {
    useAuthStore.getState().refreshProfile().then(() => {
      if (useAuthStore.getState().isAuthenticated) {
        mergeOnLogin()
      }
    })
  }
}

/**
 * Merge server progress with local Zustand stores after login.
 * Server data wins for conflicts (more reliable source of truth).
 */
async function mergeOnLogin() {
  const discoveryState = useDiscoveryStore.getState()

  // Build local state for sync
  const localDemos = discoveryState.completedDemos.map((demoId) => ({
    demoId,
    completed: true,
    completedAt: new Date().toISOString(),
  }))

  const localDiscoveries = Object.entries(discoveryState.discoveries).map(
    ([discoveryId, disc]) => ({
      discoveryId,
      discoveredIn: disc.discoveredIn,
      discoveredAt: disc.discoveredAt
        ? new Date(disc.discoveredAt).toISOString()
        : new Date().toISOString(),
    }),
  )

  // Send local data to server and get merged result
  const merged = await api.progress.syncAll({
    demos: localDemos,
    discoveries: localDiscoveries,
  })

  if (!merged) return // Server unreachable

  applyServerProgress(merged)
}

/**
 * Apply server progress data into local Zustand stores.
 */
function applyServerProgress(progress: FullProgress) {
  const discoveryStore = useDiscoveryStore.getState()

  // Merge completed demos
  const serverDemoIds = progress.demos
    .filter((d) => d.completed)
    .map((d) => d.demoId)
  const localDemoIds = discoveryStore.completedDemos
  const allDemoIds = [...new Set([...localDemoIds, ...serverDemoIds])]

  if (allDemoIds.length > localDemoIds.length) {
    // New demos from server that we don't have locally
    for (const demoId of serverDemoIds) {
      if (!localDemoIds.includes(demoId)) {
        discoveryStore.markDemoCompleted(demoId)
      }
    }
  }

  // Merge discoveries
  for (const disc of progress.discoveries) {
    if (!discoveryStore.discoveries[disc.discoveryId]) {
      discoveryStore.unlockDiscovery(disc.discoveryId, disc.discoveredIn ?? undefined)
    }
  }
}
