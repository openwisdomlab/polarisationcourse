/**
 * useCourseProgress - 课程学习进度追踪 Hook
 * Course learning progress tracking hook
 *
 * 功能：
 * - 追踪用户已完成的演示
 * - 追踪当前难度级别偏好
 * - 追踪测验成绩
 * - 本地存储持久化
 */

import { useState, useEffect, useCallback } from 'react'
import { COURSE_DEMOS } from '@/data/course-event-mapping'

// Foundation-level demo IDs for achievement tracking
const FOUNDATION_DEMO_IDS = COURSE_DEMOS
  .filter(demo => demo.difficulty === 'foundation')
  .map(demo => demo.id)

// 进度数据接口
export interface CourseProgress {
  // 已完成的演示 ID 列表
  completedDemos: string[]
  // 用户在每个演示上花费的时间（秒）
  demoTimeSpent: Record<string, number>
  // 用户偏好的难度级别
  preferredDifficulty: 'foundation' | 'application' | 'research'
  // 测验成绩记录
  quizScores: Record<string, {
    score: number
    maxScore: number
    attempts: number
    lastAttempt: string
  }>
  // 收藏的演示
  bookmarkedDemos: string[]
  // 最后访问的演示
  lastViewedDemo: string | null
  // 学习路径进度（单元完成度）
  unitProgress: Record<string, number>
  // 总学习时间（秒）
  totalTimeSpent: number
  // 首次访问时间
  firstVisit: string
  // 最后访问时间
  lastVisit: string
  // 学习连续天数
  streakDays: number
  // 上次学习日期
  lastStudyDate: string | null
}

// 默认进度数据
const DEFAULT_PROGRESS: CourseProgress = {
  completedDemos: [],
  demoTimeSpent: {},
  preferredDifficulty: 'foundation',
  quizScores: {},
  bookmarkedDemos: [],
  lastViewedDemo: null,
  unitProgress: {},
  totalTimeSpent: 0,
  firstVisit: new Date().toISOString(),
  lastVisit: new Date().toISOString(),
  streakDays: 0,
  lastStudyDate: null,
}

const STORAGE_KEY = 'polarcraft-course-progress'

// 从 localStorage 加载进度
const loadProgress = (): CourseProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_PROGRESS, ...parsed }
    }
  } catch (e) {
    console.warn('Failed to load course progress:', e)
  }
  return DEFAULT_PROGRESS
}

// 保存进度到 localStorage
const saveProgress = (progress: CourseProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.warn('Failed to save course progress:', e)
  }
}

// 检查是否是连续学习日
const isConsecutiveDay = (lastDate: string | null): boolean => {
  if (!lastDate) return true // 第一次学习
  const last = new Date(lastDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

// 检查是否是同一天
const isSameDay = (date1: string | null, date2: Date): boolean => {
  if (!date1) return false
  const d1 = new Date(date1)
  return d1.toDateString() === date2.toDateString()
}

export function useCourseProgress() {
  const [progress, setProgress] = useState<CourseProgress>(loadProgress)

  // 更新进度时自动保存
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // 更新最后访问时间和学习连续天数
  useEffect(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    setProgress(prev => {
      if (isSameDay(prev.lastStudyDate, now)) {
        // 今天已经更新过，只更新 lastVisit
        return { ...prev, lastVisit: now.toISOString() }
      }

      // 新的一天
      let newStreak = prev.streakDays
      if (isConsecutiveDay(prev.lastStudyDate)) {
        newStreak = prev.streakDays + 1
      } else if (prev.lastStudyDate && !isSameDay(prev.lastStudyDate, now)) {
        // 断了连续学习
        const last = new Date(prev.lastStudyDate)
        const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays > 1) {
          newStreak = 1 // 重新开始计数
        }
      }

      return {
        ...prev,
        lastVisit: now.toISOString(),
        lastStudyDate: today,
        streakDays: newStreak,
      }
    })
  }, [])

  // 标记演示为已完成
  const completeDemo = useCallback((demoId: string) => {
    setProgress(prev => {
      if (prev.completedDemos.includes(demoId)) {
        return prev
      }
      return {
        ...prev,
        completedDemos: [...prev.completedDemos, demoId],
        lastViewedDemo: demoId,
      }
    })
  }, [])

  // 取消完成标记
  const uncompleteDemo = useCallback((demoId: string) => {
    setProgress(prev => ({
      ...prev,
      completedDemos: prev.completedDemos.filter(id => id !== demoId),
    }))
  }, [])

  // 更新演示学习时间
  const updateDemoTime = useCallback((demoId: string, seconds: number) => {
    setProgress(prev => ({
      ...prev,
      demoTimeSpent: {
        ...prev.demoTimeSpent,
        [demoId]: (prev.demoTimeSpent[demoId] || 0) + seconds,
      },
      totalTimeSpent: prev.totalTimeSpent + seconds,
    }))
  }, [])

  // 设置偏好难度
  const setPreferredDifficulty = useCallback((difficulty: CourseProgress['preferredDifficulty']) => {
    setProgress(prev => ({
      ...prev,
      preferredDifficulty: difficulty,
    }))
  }, [])

  // 记录测验成绩
  const recordQuizScore = useCallback((demoId: string, score: number, maxScore: number) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [demoId]: {
          score: Math.max(score, prev.quizScores[demoId]?.score || 0), // 保留最高分
          maxScore,
          attempts: (prev.quizScores[demoId]?.attempts || 0) + 1,
          lastAttempt: new Date().toISOString(),
        },
      },
    }))
  }, [])

  // 切换收藏状态
  const toggleBookmark = useCallback((demoId: string) => {
    setProgress(prev => {
      if (prev.bookmarkedDemos.includes(demoId)) {
        return {
          ...prev,
          bookmarkedDemos: prev.bookmarkedDemos.filter(id => id !== demoId),
        }
      }
      return {
        ...prev,
        bookmarkedDemos: [...prev.bookmarkedDemos, demoId],
      }
    })
  }, [])

  // 设置最后访问的演示
  const setLastViewedDemo = useCallback((demoId: string) => {
    setProgress(prev => ({
      ...prev,
      lastViewedDemo: demoId,
    }))
  }, [])

  // 计算单元完成度
  const calculateUnitProgress = useCallback((unitDemos: string[]): number => {
    if (unitDemos.length === 0) return 0
    const completed = unitDemos.filter(id => progress.completedDemos.includes(id)).length
    return Math.round((completed / unitDemos.length) * 100)
  }, [progress.completedDemos])

  // 重置所有进度
  const resetProgress = useCallback(() => {
    setProgress({
      ...DEFAULT_PROGRESS,
      firstVisit: progress.firstVisit, // 保留首次访问时间
    })
  }, [progress.firstVisit])

  // 计算总体完成度
  const getOverallProgress = useCallback((allDemoIds: string[]): number => {
    if (allDemoIds.length === 0) return 0
    const completed = allDemoIds.filter(id => progress.completedDemos.includes(id)).length
    return Math.round((completed / allDemoIds.length) * 100)
  }, [progress.completedDemos])

  // 获取成就徽章
  const getAchievements = useCallback(() => {
    const achievements: { id: string; earned: boolean }[] = [
      { id: 'first-demo', earned: progress.completedDemos.length >= 1 },
      { id: 'five-demos', earned: progress.completedDemos.length >= 5 },
      { id: 'ten-demos', earned: progress.completedDemos.length >= 10 },
      { id: 'all-foundation', earned: FOUNDATION_DEMO_IDS.every(id => progress.completedDemos.includes(id)) },
      { id: 'quiz-master', earned: Object.values(progress.quizScores).some(q => q.score === q.maxScore) },
      { id: 'week-streak', earned: progress.streakDays >= 7 },
      { id: 'bookworm', earned: progress.bookmarkedDemos.length >= 3 },
    ]
    return achievements
  }, [progress])

  return {
    progress,
    completeDemo,
    uncompleteDemo,
    updateDemoTime,
    setPreferredDifficulty,
    recordQuizScore,
    toggleBookmark,
    setLastViewedDemo,
    calculateUnitProgress,
    resetProgress,
    getOverallProgress,
    getAchievements,
    isCompleted: (demoId: string) => progress.completedDemos.includes(demoId),
    isBookmarked: (demoId: string) => progress.bookmarkedDemos.includes(demoId),
  }
}

export default useCourseProgress
