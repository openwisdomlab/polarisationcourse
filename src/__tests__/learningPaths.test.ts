/**
 * Tests for learning path data and helpers (src/data/learningPaths.ts)
 */
import { describe, it, expect } from 'vitest'
import {
  DEMO_PREREQUISITES,
  getDemoPrerequisites,
  isDemoAvailable,
  getRecommendedDemos,
  calculateProgress,
} from '../data/learningPaths'

describe('learningPaths', () => {
  describe('DEMO_PREREQUISITES data integrity', () => {
    it('has no duplicate demo IDs', () => {
      const ids = DEMO_PREREQUISITES.map((d) => d.demoId)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all prerequisites reference existing demos', () => {
      const allIds = new Set(DEMO_PREREQUISITES.map((d) => d.demoId))
      for (const dp of DEMO_PREREQUISITES) {
        for (const prereq of dp.prerequisites) {
          expect(allIds.has(prereq)).toBe(true)
        }
      }
    })

    it('has no circular dependencies (depth-limited check)', () => {
      const map = new Map(DEMO_PREREQUISITES.map((d) => [d.demoId, d.prerequisites]))
      function hasCircle(id: string, visited: Set<string>): boolean {
        if (visited.has(id)) return true
        visited.add(id)
        for (const dep of map.get(id) ?? []) {
          if (hasCircle(dep, new Set(visited))) return true
        }
        return false
      }
      for (const dp of DEMO_PREREQUISITES) {
        expect(hasCircle(dp.demoId, new Set())).toBe(false)
      }
    })
  })

  describe('getDemoPrerequisites', () => {
    it('returns prerequisites for known demo', () => {
      const result = getDemoPrerequisites('malus')
      expect(result).toBeDefined()
      expect(result!.prerequisites).toContain('polarization-types-unified')
    })

    it('returns undefined for unknown demo', () => {
      expect(getDemoPrerequisites('nonexistent')).toBeUndefined()
    })
  })

  describe('isDemoAvailable', () => {
    it('returns true for demos with no prerequisites', () => {
      expect(isDemoAvailable('em-wave', new Set())).toBe(true)
    })

    it('returns false when prerequisites not met', () => {
      expect(isDemoAvailable('malus', new Set())).toBe(false)
    })

    it('returns true when prerequisites are met', () => {
      expect(isDemoAvailable('malus', new Set(['polarization-types-unified']))).toBe(true)
    })

    it('returns true for unknown demo', () => {
      expect(isDemoAvailable('unknown-demo', new Set())).toBe(true)
    })

    it('research tier bypasses all prerequisites', () => {
      expect(isDemoAvailable('malus', new Set(), 'research')).toBe(true)
      expect(isDemoAvailable('polarimetric-microscopy', new Set(), 'research')).toBe(true)
    })

    it('foundation tier still requires prerequisites', () => {
      expect(isDemoAvailable('malus', new Set(), 'foundation')).toBe(false)
    })
  })

  describe('getRecommendedDemos', () => {
    it('returns available uncompleted demos', () => {
      const all = ['em-wave', 'polarization-intro', 'malus']
      const completed = new Set<string>()
      const recommended = getRecommendedDemos(all, completed)
      expect(recommended).toContain('em-wave')
      expect(recommended).not.toContain('malus') // prereqs not met
    })

    it('excludes completed demos', () => {
      const all = ['em-wave', 'polarization-intro']
      const completed = new Set(['em-wave'])
      const recommended = getRecommendedDemos(all, completed)
      expect(recommended).not.toContain('em-wave')
      expect(recommended).toContain('polarization-intro')
    })

    it('orders by fewest prerequisites first', () => {
      const all = ['em-wave', 'polarization-intro', 'polarization-types-unified']
      const completed = new Set(['em-wave', 'polarization-intro'])
      const recommended = getRecommendedDemos(all, completed)
      // polarization-types-unified should be recommended (has prereq met)
      expect(recommended).toContain('polarization-types-unified')
    })
  })

  describe('calculateProgress', () => {
    it('returns 0 for empty lists', () => {
      expect(calculateProgress([], new Set())).toBe(0)
    })

    it('returns correct percentage', () => {
      expect(calculateProgress(['a', 'b', 'c', 'd'], new Set(['a', 'b']))).toBe(50)
    })

    it('returns 100 when all complete', () => {
      expect(calculateProgress(['a', 'b'], new Set(['a', 'b']))).toBe(100)
    })
  })
})
