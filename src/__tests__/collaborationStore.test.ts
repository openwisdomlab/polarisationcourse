/**
 * Tests for collaborationStore (src/stores/collaborationStore.ts)
 * Validates CRUD, import validation, ID collision, and review workflow.
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

const { useCollaborationStore } = await import('../stores/collaborationStore')
type ExportedProject = import('../stores/collaborationStore').ExportedProject
type ExportedReview = import('../stores/collaborationStore').ExportedReview

// Reset store between tests
beforeEach(() => {
  for (const k of Object.keys(storage)) delete storage[k]
  useCollaborationStore.setState({
    projects: [],
    reviewRequests: [],
    publishedWorks: [],
  })
})

describe('collaborationStore', () => {
  describe('createProject', () => {
    it('creates a project and returns an ID', () => {
      const id = useCollaborationStore.getState().createProject('Test', 'Desc', 'Alice')
      expect(id).toBeTruthy()
      const projects = useCollaborationStore.getState().projects
      expect(projects).toHaveLength(1)
      expect(projects[0].title).toBe('Test')
      expect(projects[0].authorName).toBe('Alice')
      expect(projects[0].status).toBe('draft')
    })
  })

  describe('updateProject', () => {
    it('updates title and description', () => {
      const id = useCollaborationStore.getState().createProject('Old', 'Desc', 'Alice')
      useCollaborationStore.getState().updateProject(id, { title: 'New' })
      const p = useCollaborationStore.getState().projects[0]
      expect(p.title).toBe('New')
      expect(p.description).toBe('Desc')
    })
  })

  describe('deleteProject', () => {
    it('removes project and associated review requests', () => {
      const id = useCollaborationStore.getState().createProject('Test', 'D', 'A')
      useCollaborationStore.getState().deleteProject(id)
      expect(useCollaborationStore.getState().projects).toHaveLength(0)
    })
  })

  describe('importForReview — validation', () => {
    it('rejects invalid data', () => {
      const result = useCollaborationStore.getState().importForReview({} as ExportedProject)
      expect(result).toBeUndefined()
    })

    it('rejects data with wrong version', () => {
      const result = useCollaborationStore.getState().importForReview({
        version: 2 as unknown as 1,
        type: 'polarcraft-research-project',
        project: { id: 'x', title: 'T', description: '', components: [], findings: '', status: 'draft', reviews: [], createdAt: 0, updatedAt: 0, authorName: 'A' },
        exportedAt: Date.now(),
      })
      expect(result).toBeUndefined()
    })

    it('truncates overly long strings', () => {
      const longTitle = 'A'.repeat(10000)
      const data: ExportedProject = {
        version: 1,
        type: 'polarcraft-research-project',
        project: {
          id: 'import-test',
          title: longTitle,
          description: '',
          components: [],
          findings: '',
          status: 'draft',
          reviews: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          authorName: 'Bob',
        },
        exportedAt: Date.now(),
      }
      const result = useCollaborationStore.getState().importForReview(data)
      expect(result).toBeDefined()
      const req = useCollaborationStore.getState().reviewRequests[0]
      expect(req.projectData.title.length).toBeLessThanOrEqual(500)
    })

    it('handles ID collision by reassigning ID', () => {
      // Create a project first
      const existingId = useCollaborationStore.getState().createProject('Existing', 'D', 'A')
      // Import with same ID
      const data: ExportedProject = {
        version: 1,
        type: 'polarcraft-research-project',
        project: {
          id: existingId,
          title: 'Imported',
          description: '',
          components: [],
          findings: '',
          status: 'draft',
          reviews: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          authorName: 'Charlie',
        },
        exportedAt: Date.now(),
      }
      const result = useCollaborationStore.getState().importForReview(data)
      expect(result).toBeDefined()
      // The imported project should get a new ID
      expect(result!.projectId).not.toBe(existingId)
    })
  })

  describe('importReview — validation', () => {
    it('rejects review for nonexistent project', () => {
      const result = useCollaborationStore.getState().importReview({
        version: 1,
        type: 'polarcraft-review',
        review: { id: 'r1', projectId: 'nonexistent', reviewerName: 'X', observations: '', suggestions: '', rating: 3, reviewedAt: Date.now() },
        exportedAt: Date.now(),
      })
      expect(result).toBe(false)
    })

    it('accepts valid review and adds to project', () => {
      const pid = useCollaborationStore.getState().createProject('P', 'D', 'A')
      const result = useCollaborationStore.getState().importReview({
        version: 1,
        type: 'polarcraft-review',
        review: { id: 'r1', projectId: pid, reviewerName: 'Reviewer', observations: 'Good', suggestions: 'None', rating: 5, reviewedAt: Date.now() },
        exportedAt: Date.now(),
      })
      expect(result).toBe(true)
      const p = useCollaborationStore.getState().projects[0]
      expect(p.reviews).toHaveLength(1)
      expect(p.status).toBe('reviewed')
    })

    it('handles duplicate review ID', () => {
      const pid = useCollaborationStore.getState().createProject('P', 'D', 'A')
      const reviewData: ExportedReview = {
        version: 1,
        type: 'polarcraft-review',
        review: { id: 'dup-id', projectId: pid, reviewerName: 'R', observations: 'O', suggestions: 'S', rating: 4, reviewedAt: Date.now() },
        exportedAt: Date.now(),
      }
      // Import once
      useCollaborationStore.getState().importReview(reviewData)
      // Import again with same review ID
      useCollaborationStore.getState().importReview(reviewData)
      const p = useCollaborationStore.getState().projects[0]
      expect(p.reviews).toHaveLength(2)
      // Second review should have been given a new ID
      expect(p.reviews[0].id).not.toBe(p.reviews[1].id)
    })

    it('clamps rating to 1-5 range', () => {
      const pid = useCollaborationStore.getState().createProject('P', 'D', 'A')
      useCollaborationStore.getState().importReview({
        version: 1,
        type: 'polarcraft-review',
        review: { id: 'r2', projectId: pid, reviewerName: 'R', observations: 'O', suggestions: 'S', rating: 99, reviewedAt: Date.now() },
        exportedAt: Date.now(),
      })
      expect(useCollaborationStore.getState().projects[0].reviews[0].rating).toBe(5)
    })
  })

  describe('review workflow', () => {
    it('submit → export → import → review → publish', () => {
      const store = useCollaborationStore.getState()
      const pid = store.createProject('Research', 'My research', 'Alice')

      // Submit for review
      const request = useCollaborationStore.getState().submitForReview(pid)
      expect(request).toBeDefined()
      expect(useCollaborationStore.getState().projects[0].status).toBe('submitted')

      // Export
      const exported = useCollaborationStore.getState().exportProject(pid)
      expect(exported).toBeDefined()
      expect(exported!.type).toBe('polarcraft-research-project')

      // Submit review
      useCollaborationStore.getState().submitReview(pid, 'Bob', 'Great work', 'Add more detail', 4)
      expect(useCollaborationStore.getState().projects[0].status).toBe('reviewed')

      // Publish
      const published = useCollaborationStore.getState().publishToShowcase(pid)
      expect(published).toBeDefined()
      expect(useCollaborationStore.getState().projects[0].status).toBe('published')
    })
  })
})
