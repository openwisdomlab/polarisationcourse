/**
 * Lab Store - Research task state management
 * 实验室状态管理 - 研究任务进度和数据持久化
 */

import { create } from 'zustand'
import { subscribeWithSelector, persist } from 'zustand/middleware'

// Data point for experiments
export interface DataPoint {
  angle: number      // Polarizer angle in degrees
  intensity: number  // Measured intensity (0-100)
  id: string        // Unique ID for React keys
  uncertainty?: number  // Measurement uncertainty (standard deviation)
}

// Fit result from analysis
export interface FitResult {
  type: 'cosine' | 'linear'
  params: {
    amplitude?: number    // I₀ for cos² fit
    phase?: number        // θ₀ phase offset
    offset?: number       // background offset
    slope?: number        // for linear fit
    intercept?: number    // for linear fit
  }
  rSquared: number        // R² goodness of fit
  residuals: number[]     // (data - model) for each point
  modelValues: number[]   // predicted values
}

// Task status enum
export type TaskStatus = 'not-started' | 'in-progress' | 'submitted' | 'published'

// Task progress data
export interface TaskProgress {
  taskId: string
  status: TaskStatus
  startedAt?: number      // timestamp
  completedAt?: number    // timestamp
  data?: DataPoint[]      // experimental data
  fitResult?: FitResult   // analysis results
  notes?: string          // user notes/observations
  submissionId?: string   // DOI-like ID when published
}

// Researcher skills (for radar chart)
export interface ResearcherSkills {
  experiment: number      // 0-100
  theory: number
  simulation: number
  dataAnalysis: number
}

// Publication entry
export interface Publication {
  id: string
  taskId: string
  title: string
  titleZh: string
  submittedAt: number
  doi: string             // Generated DOI-like ID
}

interface LabState {
  // Task progress
  taskProgress: Record<string, TaskProgress>

  // Current active task
  activeTaskId: string | null
  isModalOpen: boolean

  // User profile
  skills: ResearcherSkills
  publications: Publication[]

  // Actions
  openTask: (taskId: string) => void
  closeTask: () => void

  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  saveTaskData: (taskId: string, data: DataPoint[]) => void
  saveTaskFitResult: (taskId: string, fitResult: FitResult) => void
  saveTaskNotes: (taskId: string, notes: string) => void

  submitTask: (taskId: string) => void
  publishTask: (taskId: string, title: string, titleZh: string) => void

  updateSkills: (skills: Partial<ResearcherSkills>) => void

  resetTask: (taskId: string) => void
  getTaskProgress: (taskId: string) => TaskProgress | undefined
}

// Helper: Generate DOI-like ID
function generateDOI(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `POL.${year}.${random}`
}

// Initial skills (all start at 0)
const initialSkills: ResearcherSkills = {
  experiment: 0,
  theory: 0,
  simulation: 0,
  dataAnalysis: 0,
}

export const useLabStore = create<LabState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        taskProgress: {},
        activeTaskId: null,
        isModalOpen: false,
        skills: initialSkills,
        publications: [],

        // Open a task modal
        openTask: (taskId: string) => {
          const currentProgress = get().taskProgress[taskId]

          set(state => ({
            activeTaskId: taskId,
            isModalOpen: true,
            taskProgress: {
              ...state.taskProgress,
              [taskId]: currentProgress || {
                taskId,
                status: 'in-progress',
                startedAt: Date.now(),
                data: [],
              }
            }
          }))
        },

        // Close task modal
        closeTask: () => {
          set({ activeTaskId: null, isModalOpen: false })
        },

        // Update task status
        updateTaskStatus: (taskId: string, status: TaskStatus) => {
          set(state => ({
            taskProgress: {
              ...state.taskProgress,
              [taskId]: {
                ...state.taskProgress[taskId],
                taskId,
                status,
                ...(status === 'submitted' && { completedAt: Date.now() })
              }
            }
          }))
        },

        // Save experimental data
        saveTaskData: (taskId: string, data: DataPoint[]) => {
          set(state => ({
            taskProgress: {
              ...state.taskProgress,
              [taskId]: {
                ...state.taskProgress[taskId],
                taskId,
                data,
                status: state.taskProgress[taskId]?.status || 'in-progress',
              }
            }
          }))
        },

        // Save fit result
        saveTaskFitResult: (taskId: string, fitResult: FitResult) => {
          set(state => ({
            taskProgress: {
              ...state.taskProgress,
              [taskId]: {
                ...state.taskProgress[taskId],
                taskId,
                fitResult,
              }
            }
          }))
        },

        // Save notes
        saveTaskNotes: (taskId: string, notes: string) => {
          set(state => ({
            taskProgress: {
              ...state.taskProgress,
              [taskId]: {
                ...state.taskProgress[taskId],
                taskId,
                notes,
              }
            }
          }))
        },

        // Submit task for review
        submitTask: (taskId: string) => {
          set(state => {
            // Calculate skill increases based on task
            const skillBoost = 5 // Base skill increase

            return {
              taskProgress: {
                ...state.taskProgress,
                [taskId]: {
                  ...state.taskProgress[taskId],
                  taskId,
                  status: 'submitted',
                  completedAt: Date.now(),
                }
              },
              skills: {
                ...state.skills,
                experiment: Math.min(100, state.skills.experiment + skillBoost),
                dataAnalysis: Math.min(100, state.skills.dataAnalysis + skillBoost),
              }
            }
          })
        },

        // Publish task (add to publications)
        publishTask: (taskId: string, title: string, titleZh: string) => {
          const doi = generateDOI()

          set(state => ({
            taskProgress: {
              ...state.taskProgress,
              [taskId]: {
                ...state.taskProgress[taskId],
                status: 'published',
                submissionId: doi,
              }
            },
            publications: [
              ...state.publications,
              {
                id: `pub-${Date.now()}`,
                taskId,
                title,
                titleZh,
                submittedAt: Date.now(),
                doi,
              }
            ]
          }))
        },

        // Update researcher skills
        updateSkills: (skillUpdates: Partial<ResearcherSkills>) => {
          set(state => ({
            skills: {
              ...state.skills,
              ...skillUpdates,
            }
          }))
        },

        // Reset a task
        resetTask: (taskId: string) => {
          set(state => {
            const { [taskId]: _, ...rest } = state.taskProgress
            return { taskProgress: rest }
          })
        },

        // Get task progress
        getTaskProgress: (taskId: string) => {
          return get().taskProgress[taskId]
        },
      }),
      {
        name: 'polarcraft-lab-storage',
        partialize: (state) => ({
          taskProgress: state.taskProgress,
          skills: state.skills,
          publications: state.publications,
        }),
      }
    )
  )
)
