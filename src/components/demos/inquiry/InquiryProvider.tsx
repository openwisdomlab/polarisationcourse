/**
 * InquiryProvider - 探究式学习上下文提供者
 *
 * 包裹演示组件，按难度层级过滤inquiry points，
 * Foundation自动开始引导，Research默认自由探索。
 * 提供useInquiry() hook所需的上下文。
 */

import { createContext, useEffect, useMemo, useCallback, type ReactNode } from 'react'
import type { DifficultyLevel } from '@/components/demos/DifficultyStrategy'
import {
  useInquiryStore,
  filterPointsByDifficulty,
  type InquiryPoint,
} from '@/stores/inquiryStore'
import { useDiscoveryStore } from '@/stores/discoveryStore'
import type { InquiryContextValue } from './useInquiry'

export const InquiryContext = createContext<InquiryContextValue | null>(null)

interface InquiryProviderProps {
  demoId: string
  points: InquiryPoint[]
  difficultyLevel?: DifficultyLevel
  children: ReactNode
}

export function InquiryProvider({
  demoId,
  points,
  difficultyLevel,
  children,
}: InquiryProviderProps) {
  const level = difficultyLevel ?? 'application'
  const session = useInquiryStore((s) => s.session)
  const startSession = useInquiryStore((s) => s.startSession)
  const reportParameterAction = useInquiryStore((s) => s.reportParameter)
  const advancePhase = useInquiryStore((s) => s.advancePhase)
  const unlockDiscovery = useDiscoveryStore((s) => s.unlockDiscovery)

  // 按难度过滤points
  const activePoints = useMemo(
    () => filterPointsByDifficulty(points, level),
    [points, level]
  )

  // 自动开始会话
  useEffect(() => {
    if (activePoints.length === 0) return
    if (session?.demoId === demoId) return // 已有会话

    // Foundation自动开始引导, Application提供选择, Research默认自由
    const autoGuided = level === 'foundation'
    if (autoGuided || level === 'application') {
      startSession(demoId, activePoints, level, autoGuided)
    }
  }, [demoId, activePoints, level, session?.demoId, startSession])

  // 当reflect阶段完成时，触发发现
  useEffect(() => {
    if (!session || session.currentPhase !== 'reflect') return
    const currentPoint = activePoints[session.currentPointIndex]
    if (!currentPoint?.triggersDiscovery) return

    for (const discoveryId of currentPoint.triggersDiscovery) {
      unlockDiscovery(discoveryId, `inquiry:${demoId}`)
    }
  }, [session?.currentPhase, session?.currentPointIndex, activePoints, demoId, unlockDiscovery, session])

  const isControlEnabled = useCallback(
    (controlId: string) => {
      if (!session?.isGuidedMode) return true
      // 引导模式下，检查控件是否已解锁
      if (session.unlockedControls.length === 0) return true
      return session.unlockedControls.includes(controlId)
    },
    [session?.isGuidedMode, session?.unlockedControls]
  )

  const isControlHighlighted = useCallback(
    (controlId: string) => {
      if (!session?.isGuidedMode) return false
      return session.highlightedControls.includes(controlId)
    },
    [session?.isGuidedMode, session?.highlightedControls]
  )

  const reportParameter = useCallback(
    (param: string, value: number) => {
      reportParameterAction(param, value, activePoints)
    },
    [reportParameterAction, activePoints]
  )

  // 自动推进：基于time触发器
  useEffect(() => {
    if (!session?.isGuidedMode) return undefined
    const currentPoint = activePoints[session.currentPointIndex]
    if (!currentPoint) return undefined

    if (
      currentPoint.trigger.type === 'time' &&
      session.currentPhase === 'predict'
    ) {
      const timer = setTimeout(() => {
        advancePhase(activePoints)
      }, currentPoint.trigger.delayMs)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [session?.isGuidedMode, session?.currentPointIndex, session?.currentPhase, activePoints, advancePhase])

  const contextValue = useMemo<InquiryContextValue>(
    () => ({
      isGuidedMode: session?.isGuidedMode ?? false,
      currentPhase: session?.currentPhase ?? null,
      isControlEnabled,
      isControlHighlighted,
      reportParameter,
      activePoints,
      session,
      completedCount: session?.completedPoints.length ?? 0,
      totalCount: activePoints.length,
    }),
    [session, isControlEnabled, isControlHighlighted, reportParameter, activePoints]
  )

  return (
    <InquiryContext.Provider value={contextValue}>
      {children}
    </InquiryContext.Provider>
  )
}
