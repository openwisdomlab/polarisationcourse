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
// Validation — import safety
// ============================================

const MAX_STRING_LENGTH = 5000
const MAX_COMPONENTS = 200
const MAX_REVIEWS = 100

function truncateString(value: unknown, maxLen = MAX_STRING_LENGTH): string {
  if (typeof value !== 'string') return ''
  return value.length > maxLen ? value.slice(0, maxLen) : value
}

function isValidProjectStatus(s: unknown): s is ProjectStatus {
  return s === 'draft' || s === 'submitted' || s === 'reviewed' || s === 'published'
}

function sanitizeReview(r: unknown): ReviewResult | null {
  if (!r || typeof r !== 'object') return null
  const obj = r as Record<string, unknown>
  if (typeof obj.id !== 'string' || typeof obj.projectId !== 'string') return null
  return {
    id: truncateString(obj.id, 50),
    projectId: truncateString(obj.projectId, 50),
    reviewerName: truncateString(obj.reviewerName, 200),
    observations: truncateString(obj.observations),
    suggestions: truncateString(obj.suggestions),
    rating: Math.max(1, Math.min(5, Math.round(Number(obj.rating) || 3))),
    reviewedAt: typeof obj.reviewedAt === 'number' ? obj.reviewedAt : Date.now(),
  }
}

function sanitizeProject(p: unknown): ResearchProject | null {
  if (!p || typeof p !== 'object') return null
  const obj = p as Record<string, unknown>
  if (typeof obj.id !== 'string' || !obj.id) return null
  if (typeof obj.title !== 'string') return null

  const reviews: ReviewResult[] = []
  if (Array.isArray(obj.reviews)) {
    for (const r of obj.reviews.slice(0, MAX_REVIEWS)) {
      const sr = sanitizeReview(r)
      if (sr) reviews.push(sr)
    }
  }

  return {
    id: truncateString(obj.id, 50),
    title: truncateString(obj.title, 500),
    description: truncateString(obj.description),
    components: Array.isArray(obj.components) ? obj.components.slice(0, MAX_COMPONENTS) : [],
    findings: truncateString(obj.findings),
    status: isValidProjectStatus(obj.status) ? obj.status : 'draft',
    reviews,
    createdAt: typeof obj.createdAt === 'number' ? obj.createdAt : Date.now(),
    updatedAt: typeof obj.updatedAt === 'number' ? obj.updatedAt : Date.now(),
    authorName: truncateString(obj.authorName, 200),
  }
}

function validateExportedProject(data: unknown): ExportedProject | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  if (obj.version !== 1 || obj.type !== 'polarcraft-research-project') return null
  const project = sanitizeProject(obj.project)
  if (!project) return null
  return {
    version: 1,
    type: 'polarcraft-research-project',
    project,
    exportedAt: typeof obj.exportedAt === 'number' ? obj.exportedAt : Date.now(),
  }
}

function validateExportedReview(data: unknown): ExportedReview | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  if (obj.version !== 1 || obj.type !== 'polarcraft-review') return null
  const review = sanitizeReview(obj.review)
  if (!review) return null
  return {
    version: 1,
    type: 'polarcraft-review',
    review,
    exportedAt: typeof obj.exportedAt === 'number' ? obj.exportedAt : Date.now(),
  }
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
        const validated = validateExportedProject(data)
        if (!validated) return undefined

        // Check for ID collision with existing projects
        const existingIds = new Set(get().projects.map((p) => p.id))
        if (existingIds.has(validated.project.id)) {
          validated.project.id = generateId() // Reassign to avoid collision
        }

        const request: ReviewRequest = {
          id: generateId(),
          projectId: validated.project.id,
          projectData: { ...validated.project },
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
        const validated = validateExportedReview(data)
        if (!validated) return false

        const review = validated.review
        const project = get().projects.find((p) => p.id === review.projectId)
        if (!project) return false

        // Check for duplicate review ID
        if (project.reviews.some((r) => r.id === review.id)) {
          review.id = generateId()
        }

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
      partialize: (state) => ({
        projects: state.projects,
        reviewRequests: state.reviewRequests,
        publishedWorks: state.publishedWorks,
      }),
    }
  )
)
