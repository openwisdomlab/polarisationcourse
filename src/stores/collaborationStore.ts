/**
 * Collaboration Store - Async research collaboration via JSON export/import
 * 协作商店 - 通过JSON导出/导入实现异步研究协作
 *
 * Uses Zustand with persist middleware for localStorage persistence.
 * Collaboration is file-based: users export projects as JSON, share them,
 * and import peer work for review.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BenchComponent } from '@/stores/opticalBenchStore'

// ============================================
// Types
// ============================================

export type ProjectStatus = 'draft' | 'submitted' | 'reviewed' | 'published'

export interface ResearchProject {
  id: string
  title: string
  description: string
  components: BenchComponent[]
  findings: string
  status: ProjectStatus
  reviews: ReviewResult[]
  createdAt: number
  updatedAt: number
  authorName: string
}

export interface ReviewResult {
  id: string
  projectId: string
  reviewerName: string
  observations: string
  suggestions: string
  rating: number // 1-5
  reviewedAt: number
}

export interface ReviewRequest {
  id: string
  projectId: string
  projectData: ResearchProject
  requestedAt: number
  status: 'pending' | 'completed'
}

export interface PublishedWork {
  id: string
  projectId: string
  project: ResearchProject
  publishedAt: number
}

export interface ExportedProject {
  version: 1
  type: 'polarcraft-research-project'
  project: ResearchProject
  exportedAt: number
}

export interface ExportedReview {
  version: 1
  type: 'polarcraft-review'
  review: ReviewResult
  exportedAt: number
}

// ============================================
// Store Interface
// ============================================

interface CollaborationState {
  projects: ResearchProject[]
  reviewRequests: ReviewRequest[]
  publishedWorks: PublishedWork[]

  // Project CRUD
  createProject: (title: string, description: string, authorName: string) => string
  updateProject: (id: string, updates: Partial<Pick<ResearchProject, 'title' | 'description' | 'components' | 'findings'>>) => void
  deleteProject: (id: string) => void

  // Review workflow
  submitForReview: (projectId: string) => ReviewRequest | undefined
  exportProject: (projectId: string) => ExportedProject | undefined
  importForReview: (data: ExportedProject) => ReviewRequest | undefined

  // Review actions
  submitReview: (projectId: string, reviewerName: string, observations: string, suggestions: string, rating: number) => void
  exportReview: (projectId: string, reviewId: string) => ExportedReview | undefined
  importReview: (data: ExportedReview) => boolean

  // Publishing
  publishToShowcase: (projectId: string) => PublishedWork | undefined
}

// ============================================
// Helpers
// ============================================

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

// ============================================
// Store Implementation
// ============================================

export const useCollaborationStore = create<CollaborationState>()(
  persist(
    (set, get) => ({
      projects: [],
      reviewRequests: [],
      publishedWorks: [],

      createProject: (title, description, authorName) => {
        const id = generateId()
        const now = Date.now()
        const project: ResearchProject = {
          id,
          title,
          description,
          components: [],
          findings: '',
          status: 'draft',
          reviews: [],
          createdAt: now,
          updatedAt: now,
          authorName,
        }
        set((state) => ({ projects: [...state.projects, project] }))
        return id
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          reviewRequests: state.reviewRequests.filter((r) => r.projectId !== id),
        }))
      },

      submitForReview: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId)
        if (!project || project.status !== 'draft') return undefined

        const request: ReviewRequest = {
          id: generateId(),
          projectId,
          projectData: { ...project },
          requestedAt: Date.now(),
          status: 'pending',
        }

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, status: 'submitted' as const, updatedAt: Date.now() } : p
          ),
          reviewRequests: [...state.reviewRequests, request],
        }))

        return request
      },

      exportProject: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId)
        if (!project) return undefined
        return {
          version: 1 as const,
          type: 'polarcraft-research-project' as const,
          project: { ...project },
          exportedAt: Date.now(),
        }
      },

      importForReview: (data) => {
        if (data.version !== 1 || data.type !== 'polarcraft-research-project') return undefined

        const request: ReviewRequest = {
          id: generateId(),
          projectId: data.project.id,
          projectData: { ...data.project },
          requestedAt: Date.now(),
          status: 'pending',
        }

        set((state) => ({
          reviewRequests: [...state.reviewRequests, request],
        }))

        return request
      },

      submitReview: (projectId, reviewerName, observations, suggestions, rating) => {
        const review: ReviewResult = {
          id: generateId(),
          projectId,
          reviewerName,
          observations,
          suggestions,
          rating: Math.max(1, Math.min(5, Math.round(rating))),
          reviewedAt: Date.now(),
        }

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, status: 'reviewed' as const, reviews: [...p.reviews, review], updatedAt: Date.now() }
              : p
          ),
          reviewRequests: state.reviewRequests.map((r) =>
            r.projectId === projectId ? { ...r, status: 'completed' as const } : r
          ),
        }))
      },

      exportReview: (projectId, reviewId) => {
        const project = get().projects.find((p) => p.id === projectId)
        const review = project?.reviews.find((r) => r.id === reviewId)
        if (!review) return undefined
        return {
          version: 1 as const,
          type: 'polarcraft-review' as const,
          review: { ...review },
          exportedAt: Date.now(),
        }
      },

      importReview: (data) => {
        if (data.version !== 1 || data.type !== 'polarcraft-review') return false

        const review = data.review
        const projectExists = get().projects.some((p) => p.id === review.projectId)
        if (!projectExists) return false

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === review.projectId
              ? { ...p, status: 'reviewed' as const, reviews: [...p.reviews, review], updatedAt: Date.now() }
              : p
          ),
        }))

        return true
      },

      publishToShowcase: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId)
        if (!project || project.status === 'draft') return undefined

        const published: PublishedWork = {
          id: generateId(),
          projectId,
          project: { ...project, status: 'published' },
          publishedAt: Date.now(),
        }

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, status: 'published' as const, updatedAt: Date.now() } : p
          ),
          publishedWorks: [...state.publishedWorks, published],
        }))

        return published
      },
    }),
    {
      name: 'polarcraft-collaboration',
      version: 1,
    }
  )
)
