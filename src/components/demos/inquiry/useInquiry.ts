/**
 * useInquiry - 探究式学习系统Hook
 *
 * 提供inquiry状态与控件交互的简洁接口
 */

import { useContext } from 'react'
import { InquiryContext } from './InquiryProvider'
import type { InquiryPoint } from '@/stores/inquiryStore'

// 导出上下文值类型供组件使用
export interface InquiryContextValue {
  isGuidedMode: boolean
  currentPhase: 'predict' | 'observe' | 'reflect' | null
  isControlEnabled: (controlId: string) => boolean
  isControlHighlighted: (controlId: string) => boolean
  reportParameter: (param: string, value: number) => void
  activePoints: InquiryPoint[]
  session: {
    demoId: string
    currentPointIndex: number
    currentPhase: 'predict' | 'observe' | 'reflect'
    selectedPrediction: string | null
    predictionCorrect: boolean | null
    completedPoints: string[]
    isGuidedMode: boolean
    unlockedControls: string[]
    highlightedControls: string[]
    correctCount: number
    totalCount: number
    showCelebration: boolean
  } | null
  completedCount: number
  totalCount: number
}

const defaultValue: InquiryContextValue = {
  isGuidedMode: false,
  currentPhase: null,
  isControlEnabled: () => true,
  isControlHighlighted: () => false,
  reportParameter: () => {},
  activePoints: [],
  session: null,
  completedCount: 0,
  totalCount: 0,
}

export function useInquiry(): InquiryContextValue {
  const ctx = useContext(InquiryContext)
  if (!ctx) return defaultValue
  return ctx
}
