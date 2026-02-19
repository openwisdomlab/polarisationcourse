/**
 * InquiryStore - 探究式学习系统状态管理
 *
 * 实现 "预测-观察-反思" (POR) 循环，引导学生通过科学方法
 * 主动发现偏振光学原理。
 *
 * - 按难度层级过滤inquiry points
 * - Foundation自动开始引导，Research默认自由探索
 * - 与discoveryStore集成，自动触发发现
 * - 仅持久化完成数据（正确预测数/总数）
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DifficultyLevel } from '@/components/demos/DifficultyStrategy'

// ============================================
// Types
// ============================================

export interface InquiryPoint {
  id: string
  phase: 'predict' | 'observe' | 'reflect'
  trigger:
    | { type: 'step'; step: number }
    | { type: 'parameter'; param: string; condition: (v: number) => boolean }
    | { type: 'time'; delayMs: number }
  question: { zh: string; en: string }
  predictions?: {
    id: string
    label: { zh: string; en: string }
    isCorrect: boolean
  }[]
  reflection?: { zh: string; en: string }
  /** reflect阶段揭示的公式 */
  formula?: string
  /** 渐进解锁的控件ID列表 */
  unlocksControls?: string[]
  /** 视觉高亮提示的控件ID */
  highlightControls?: string[]
  /** discoveryStore集成：触发的发现ID */
  triggersDiscovery?: string[]
  /** 按难度层级覆盖 */
  tiers?: Partial<
    Record<
      DifficultyLevel,
      {
        question?: { zh: string; en: string }
        predictions?: InquiryPoint['predictions']
        reflection?: { zh: string; en: string }
        formula?: string
        skip?: boolean
      }
    >
  >
}

export interface InquiryConfig {
  demoId: string
  points: InquiryPoint[]
  /** 是否在Foundation模式自动开始引导 */
  autoStartFoundation?: boolean
}

interface InquirySession {
  demoId: string
  currentPointIndex: number
  currentPhase: 'predict' | 'observe' | 'reflect'
  selectedPrediction: string | null
  predictionCorrect: boolean | null
  completedPoints: string[]
  isGuidedMode: boolean
  /** 当前会话已解锁的控件 */
  unlockedControls: string[]
  /** 当前高亮的控件 */
  highlightedControls: string[]
  /** 会话中的正确预测数 */
  correctCount: number
  /** 会话中的总预测数 */
  totalCount: number
  /** 显示庆祝动画 */
  showCelebration: boolean
}

// 持久化的完成数据
interface InquiryCompletion {
  demoId: string
  correctPredictions: number
  totalPredictions: number
  completedAt: number
}

interface InquiryState {
  session: InquirySession | null
  completions: Record<string, InquiryCompletion>

  // Actions
  startSession: (
    demoId: string,
    points: InquiryPoint[],
    difficultyLevel: DifficultyLevel,
    guided: boolean
  ) => void
  makePrediction: (predictionId: string, points: InquiryPoint[]) => void
  advancePhase: (points: InquiryPoint[]) => void
  skipToFreeExploration: () => void
  reportParameter: (param: string, value: number, points: InquiryPoint[]) => void
  completeSession: () => void
  dismissCelebration: () => void
  resetSession: () => void
}

// ============================================
// 辅助函数：按难度过滤inquiry points
// ============================================

export function filterPointsByDifficulty(
  points: InquiryPoint[],
  level: DifficultyLevel
): InquiryPoint[] {
  return points
    .filter((p) => !p.tiers?.[level]?.skip)
    .map((p) => {
      const tierOverride = p.tiers?.[level]
      if (!tierOverride) return p
      return {
        ...p,
        question: tierOverride.question ?? p.question,
        predictions: tierOverride.predictions ?? p.predictions,
        reflection: tierOverride.reflection ?? p.reflection,
        formula: tierOverride.formula ?? p.formula,
      }
    })
}

// ============================================
// Store Implementation
// ============================================

export const useInquiryStore = create<InquiryState>()(
  persist(
    (set, get) => ({
      session: null,
      completions: {},

      startSession: (demoId, points, difficultyLevel, guided) => {
        const filtered = filterPointsByDifficulty(points, difficultyLevel)
        if (filtered.length === 0) return

        const firstPoint = filtered[0]
        // 收集初始步骤解锁的控件
        const initialUnlocks = firstPoint.unlocksControls ?? []
        const initialHighlights = firstPoint.highlightControls ?? []

        set({
          session: {
            demoId,
            currentPointIndex: 0,
            currentPhase: 'predict',
            selectedPrediction: null,
            predictionCorrect: null,
            completedPoints: [],
            isGuidedMode: guided,
            unlockedControls: initialUnlocks,
            highlightedControls: initialHighlights,
            correctCount: 0,
            totalCount: 0,
            showCelebration: false,
          },
        })
      },

      makePrediction: (predictionId, points) => {
        const { session } = get()
        if (!session || session.currentPhase !== 'predict') return

        const currentPoint = points[session.currentPointIndex]
        if (!currentPoint?.predictions) return

        const prediction = currentPoint.predictions.find((p) => p.id === predictionId)
        if (!prediction) return

        const isCorrect = prediction.isCorrect

        set({
          session: {
            ...session,
            selectedPrediction: predictionId,
            predictionCorrect: isCorrect,
            currentPhase: 'observe',
            totalCount: session.totalCount + 1,
            correctCount: session.correctCount + (isCorrect ? 1 : 0),
            showCelebration: isCorrect,
          },
        })
      },

      advancePhase: (points) => {
        const { session } = get()
        if (!session) return

        const currentPoint = points[session.currentPointIndex]
        if (!currentPoint) return

        if (session.currentPhase === 'observe') {
          // observe → reflect
          set({
            session: {
              ...session,
              currentPhase: 'reflect',
              showCelebration: false,
            },
          })
        } else if (session.currentPhase === 'reflect') {
          // reflect → 下一个point或结束
          const nextIndex = session.currentPointIndex + 1
          const completed = [...session.completedPoints, currentPoint.id]

          if (nextIndex >= points.length) {
            // 所有points完成
            const completion: InquiryCompletion = {
              demoId: session.demoId,
              correctPredictions: session.correctCount,
              totalPredictions: session.totalCount,
              completedAt: Date.now(),
            }
            set((state) => ({
              session: {
                ...session,
                completedPoints: completed,
                isGuidedMode: false,
              },
              completions: {
                ...state.completions,
                [session.demoId]: completion,
              },
            }))
          } else {
            const nextPoint = points[nextIndex]
            // 累积解锁控件
            const newUnlocks = [
              ...new Set([
                ...session.unlockedControls,
                ...(nextPoint.unlocksControls ?? []),
              ]),
            ]

            set({
              session: {
                ...session,
                currentPointIndex: nextIndex,
                currentPhase: 'predict',
                selectedPrediction: null,
                predictionCorrect: null,
                completedPoints: completed,
                unlockedControls: newUnlocks,
                highlightedControls: nextPoint.highlightControls ?? [],
                showCelebration: false,
              },
            })
          }
        }
      },

      skipToFreeExploration: () => {
        const { session } = get()
        if (!session) return
        set({
          session: {
            ...session,
            isGuidedMode: false,
            // 解锁所有控件
            unlockedControls: [],
            highlightedControls: [],
          },
        })
      },

      reportParameter: (param, value, points) => {
        const { session } = get()
        if (!session || session.currentPhase !== 'predict') return

        const currentPoint = points[session.currentPointIndex]
        if (!currentPoint) return

        if (
          currentPoint.trigger.type === 'parameter' &&
          currentPoint.trigger.param === param &&
          currentPoint.trigger.condition(value)
        ) {
          // 参数触发条件满足，自动推进到observe
          set({
            session: {
              ...session,
              currentPhase: 'observe',
            },
          })
        }
      },

      completeSession: () => {
        const { session } = get()
        if (!session) return

        const completion: InquiryCompletion = {
          demoId: session.demoId,
          correctPredictions: session.correctCount,
          totalPredictions: session.totalCount,
          completedAt: Date.now(),
        }

        set((state) => ({
          session: null,
          completions: {
            ...state.completions,
            [session.demoId]: completion,
          },
        }))
      },

      dismissCelebration: () => {
        const { session } = get()
        if (!session) return
        set({ session: { ...session, showCelebration: false } })
      },

      resetSession: () => {
        set({ session: null })
      },
    }),
    {
      name: 'polarquest-inquiry',
      version: 1,
      partialize: (state) => ({
        completions: state.completions,
      }),
    }
  )
)
