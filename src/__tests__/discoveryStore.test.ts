/**
 * Tests for discoveryStore (src/stores/discoveryStore.ts)
 * Validates discovery tracking, demo completion, and streak logic.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage before importing the store
const storage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => { storage[key] = value },
  removeItem: (key: string) => { delete storage[key] },
  clear: () => { for (const k of Object.keys(storage)) delete storage[k] },
  get length() { return Object.keys(storage).length },
  key: (i: number) => Object.keys(storage)[i] ?? null,
})

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useDiscoveryStore, ALL_DISCOVERIES } = await import('../stores/discoveryStore')

beforeEach(() => {
  for (const k of Object.keys(storage)) delete storage[k]
  useDiscoveryStore.setState({
    discoveries: {},
    completedDemos: [],
    mysteriesSolved: 0,
    perfectDeductions: 0,
    currentStreak: 0,
    bestStreak: 0,
    pendingNotifications: [],
  })
})

describe('discoveryStore', () => {
  describe('unlockDiscovery', () => {
    it('unlocks a known discovery', () => {
      useDiscoveryStore.getState().unlockDiscovery('linear_polarization', 'test')
      expect(useDiscoveryStore.getState().hasDiscovery('linear_polarization')).toBe(true)
    })

    it('ignores unknown discovery IDs', () => {
      useDiscoveryStore.getState().unlockDiscovery('nonexistent_discovery')
      expect(Object.keys(useDiscoveryStore.getState().discoveries)).toHaveLength(0)
    })

    it('does not duplicate already-discovered items', () => {
      useDiscoveryStore.getState().unlockDiscovery('linear_polarization')
      useDiscoveryStore.getState().unlockDiscovery('linear_polarization')
      expect(Object.keys(useDiscoveryStore.getState().discoveries)).toHaveLength(1)
    })

    it('adds to pending notifications', () => {
      useDiscoveryStore.getState().unlockDiscovery('linear_polarization')
      expect(useDiscoveryStore.getState().pendingNotifications).toHaveLength(1)
    })
  })

  describe('markDemoCompleted', () => {
    it('marks a demo as completed', () => {
      useDiscoveryStore.getState().markDemoCompleted('em-wave')
      expect(useDiscoveryStore.getState().isDemoCompleted('em-wave')).toBe(true)
    })

    it('does not duplicate completed demos', () => {
      useDiscoveryStore.getState().markDemoCompleted('em-wave')
      useDiscoveryStore.getState().markDemoCompleted('em-wave')
      expect(useDiscoveryStore.getState().completedDemos).toHaveLength(1)
    })

    it('getCompletedDemoIds returns a Set', () => {
      useDiscoveryStore.getState().markDemoCompleted('em-wave')
      useDiscoveryStore.getState().markDemoCompleted('malus')
      const ids = useDiscoveryStore.getState().getCompletedDemoIds()
      expect(ids).toBeInstanceOf(Set)
      expect(ids.size).toBe(2)
      expect(ids.has('em-wave')).toBe(true)
    })
  })

  describe('getDiscoveriesByCategory', () => {
    it('filters by category', () => {
      useDiscoveryStore.getState().unlockDiscovery('linear_polarization')
      useDiscoveryStore.getState().unlockDiscovery('malus_law')
      const polarization = useDiscoveryStore.getState().getDiscoveriesByCategory('polarization')
      expect(polarization.length).toBeGreaterThanOrEqual(1)
      expect(polarization.every((d) => d.category === 'polarization')).toBe(true)
    })
  })

  describe('incrementMysteriesSolved', () => {
    it('increments mysteries and streak for perfect', () => {
      useDiscoveryStore.getState().incrementMysteriesSolved(true)
      const state = useDiscoveryStore.getState()
      expect(state.mysteriesSolved).toBe(1)
      expect(state.perfectDeductions).toBe(1)
      expect(state.currentStreak).toBe(1)
      expect(state.bestStreak).toBe(1)
    })

    it('resets streak for non-perfect', () => {
      useDiscoveryStore.getState().incrementMysteriesSolved(true)
      useDiscoveryStore.getState().incrementMysteriesSolved(true)
      useDiscoveryStore.getState().incrementMysteriesSolved(false)
      const state = useDiscoveryStore.getState()
      expect(state.mysteriesSolved).toBe(3)
      expect(state.currentStreak).toBe(0)
      expect(state.bestStreak).toBe(2)
    })
  })

  describe('resetProgress', () => {
    it('clears all progress', () => {
      useDiscoveryStore.getState().unlockDiscovery('linear_polarization')
      useDiscoveryStore.getState().markDemoCompleted('em-wave')
      useDiscoveryStore.getState().incrementMysteriesSolved(true)
      useDiscoveryStore.getState().resetProgress()
      const state = useDiscoveryStore.getState()
      expect(Object.keys(state.discoveries)).toHaveLength(0)
      expect(state.completedDemos).toHaveLength(0)
      expect(state.mysteriesSolved).toBe(0)
    })
  })

  describe('ALL_DISCOVERIES', () => {
    it('has no duplicate IDs', () => {
      const ids = ALL_DISCOVERIES.map((d) => d.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('every discovery has required fields', () => {
      for (const d of ALL_DISCOVERIES) {
        expect(d.id).toBeTruthy()
        expect(d.category).toBeTruthy()
        expect(d.name).toBeTruthy()
        expect(d.nameZh).toBeTruthy()
        expect(d.icon).toBeTruthy()
      }
    })
  })
})
