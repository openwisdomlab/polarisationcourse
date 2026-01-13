/**
 * Exploration Store - 探索状态管理
 *
 * 设计理念：
 * - 无锁定机制，所有内容始终可访问
 * - 记录探索轨迹，而非完成度
 * - 支持难度"透镜"切换，调整内容呈现深度
 * - 推荐基于兴趣，而非强制路径
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'

// 难度透镜类型
export type DifficultyLens = 'foundation' | 'application' | 'research'

// 用户发现记录
export interface Discovery {
  id: string
  nodeId: string
  type: 'aha_moment' | 'experiment_result' | 'question' | 'note'
  content: string
  timestamp: number
}

// 探索统计
export interface ExplorationStats {
  totalNodes: number
  visitedNodes: number
  experimentsAttempted: number
  demosViewed: number
  gamesPlayed: number
  timeSpent: number // 分钟
}

// 探索状态接口
interface ExplorationState {
  // 用户偏好 - 难度透镜（不是门槛，而是内容深度调节器）
  difficultyLens: DifficultyLens

  // 探索轨迹（不是"完成度"，而是"去过的地方"）
  visitedNodes: string[]       // 访问过的节点ID
  expandedSections: string[]   // 展开过的内容段（nodeId:sectionType）
  triedExperiments: string[]   // 尝试过的实验（nodeId）
  viewedDemos: string[]        // 查看过的演示（demoId）
  playedGames: string[]        // 玩过的游戏关卡（gameType:levelId）

  // 当前状态
  currentNodeId: string | null
  navigationHistory: string[]  // 浏览历史（支持返回）

  // 发现与收藏
  discoveries: Discovery[]     // 用户的"发现"记录
  bookmarks: string[]          // 收藏的节点ID

  // 首选入口
  preferredStageId: string | null  // 用户选择的学习阶段
  hasSeenIntro: boolean            // 是否看过介绍

  // 时间统计
  lastActiveDate: string
  totalTimeSpent: number       // 累计探索时间（分钟）
  sessionStartTime: number | null

  // Actions
  setDifficultyLens: (lens: DifficultyLens) => void
  visitNode: (nodeId: string) => void
  expandSection: (nodeId: string, sectionType: string) => void
  recordExperiment: (nodeId: string) => void
  recordDemo: (demoId: string) => void
  recordGame: (gameType: string, levelId: number) => void
  addDiscovery: (discovery: Omit<Discovery, 'id' | 'timestamp'>) => void
  removeDiscovery: (discoveryId: string) => void
  toggleBookmark: (nodeId: string) => void
  setPreferredStage: (stageId: string) => void
  setHasSeenIntro: (seen: boolean) => void
  goBack: () => string | null
  startSession: () => void
  endSession: () => void
  resetExploration: () => void

  // Computed / Getters
  getStats: () => ExplorationStats
  isNodeVisited: (nodeId: string) => boolean
  isNodeBookmarked: (nodeId: string) => boolean
  getRecentNodes: (count?: number) => string[]
  getDiscoveriesForNode: (nodeId: string) => Discovery[]
}

// 默认状态
const defaultState = {
  difficultyLens: 'foundation' as DifficultyLens,
  visitedNodes: [],
  expandedSections: [],
  triedExperiments: [],
  viewedDemos: [],
  playedGames: [],
  currentNodeId: null,
  navigationHistory: [],
  discoveries: [],
  bookmarks: [],
  preferredStageId: null,
  hasSeenIntro: false,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalTimeSpent: 0,
  sessionStartTime: null,
}

export const useExplorationStore = create<ExplorationState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...defaultState,

        // 设置难度透镜
        setDifficultyLens: (lens) => {
          set({ difficultyLens: lens })
        },

        // 访问节点
        visitNode: (nodeId) => {
          const { visitedNodes, currentNodeId, navigationHistory } = get()

          // 添加到访问记录（不重复）
          const newVisited = visitedNodes.includes(nodeId)
            ? visitedNodes
            : [...visitedNodes, nodeId]

          // 更新导航历史
          const newHistory = currentNodeId
            ? [...navigationHistory, currentNodeId]
            : navigationHistory

          set({
            visitedNodes: newVisited,
            currentNodeId: nodeId,
            navigationHistory: newHistory.slice(-20), // 保留最近20个
          })
        },

        // 展开内容段
        expandSection: (nodeId, sectionType) => {
          const { expandedSections } = get()
          const key = `${nodeId}:${sectionType}`
          if (!expandedSections.includes(key)) {
            set({ expandedSections: [...expandedSections, key] })
          }
        },

        // 记录尝试的实验
        recordExperiment: (nodeId) => {
          const { triedExperiments } = get()
          if (!triedExperiments.includes(nodeId)) {
            set({ triedExperiments: [...triedExperiments, nodeId] })
          }
        },

        // 记录查看的演示
        recordDemo: (demoId) => {
          const { viewedDemos } = get()
          if (!viewedDemos.includes(demoId)) {
            set({ viewedDemos: [...viewedDemos, demoId] })
          }
        },

        // 记录玩过的游戏
        recordGame: (gameType, levelId) => {
          const { playedGames } = get()
          const key = `${gameType}:${levelId}`
          if (!playedGames.includes(key)) {
            set({ playedGames: [...playedGames, key] })
          }
        },

        // 添加发现
        addDiscovery: (discovery) => {
          const { discoveries } = get()
          const newDiscovery: Discovery = {
            ...discovery,
            id: `discovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          }
          set({ discoveries: [...discoveries, newDiscovery] })
        },

        // 删除发现
        removeDiscovery: (discoveryId) => {
          const { discoveries } = get()
          set({ discoveries: discoveries.filter(d => d.id !== discoveryId) })
        },

        // 切换收藏
        toggleBookmark: (nodeId) => {
          const { bookmarks } = get()
          if (bookmarks.includes(nodeId)) {
            set({ bookmarks: bookmarks.filter(id => id !== nodeId) })
          } else {
            set({ bookmarks: [...bookmarks, nodeId] })
          }
        },

        // 设置首选阶段
        setPreferredStage: (stageId) => {
          set({ preferredStageId: stageId })
        },

        // 设置已看过介绍
        setHasSeenIntro: (seen) => {
          set({ hasSeenIntro: seen })
        },

        // 返回上一个节点
        goBack: () => {
          const { navigationHistory } = get()
          if (navigationHistory.length === 0) return null

          const prevNodeId = navigationHistory[navigationHistory.length - 1]
          set({
            currentNodeId: prevNodeId,
            navigationHistory: navigationHistory.slice(0, -1),
          })
          return prevNodeId
        },

        // 开始会话
        startSession: () => {
          set({ sessionStartTime: Date.now() })
        },

        // 结束会话
        endSession: () => {
          const { sessionStartTime, totalTimeSpent } = get()
          if (sessionStartTime) {
            const sessionDuration = Math.round((Date.now() - sessionStartTime) / 60000)
            set({
              totalTimeSpent: totalTimeSpent + sessionDuration,
              sessionStartTime: null,
              lastActiveDate: new Date().toISOString().split('T')[0],
            })
          }
        },

        // 重置探索记录
        resetExploration: () => {
          set({
            ...defaultState,
            hasSeenIntro: get().hasSeenIntro, // 保留介绍状态
          })
        },

        // 获取统计数据
        getStats: () => {
          const state = get()
          return {
            totalNodes: 20, // 更新为实际节点数
            visitedNodes: state.visitedNodes.length,
            experimentsAttempted: state.triedExperiments.length,
            demosViewed: state.viewedDemos.length,
            gamesPlayed: state.playedGames.length,
            timeSpent: state.totalTimeSpent,
          }
        },

        // 检查节点是否访问过
        isNodeVisited: (nodeId) => {
          return get().visitedNodes.includes(nodeId)
        },

        // 检查节点是否已收藏
        isNodeBookmarked: (nodeId) => {
          return get().bookmarks.includes(nodeId)
        },

        // 获取最近访问的节点
        getRecentNodes: (count = 5) => {
          const { visitedNodes } = get()
          return visitedNodes.slice(-count).reverse()
        },

        // 获取节点的发现记录
        getDiscoveriesForNode: (nodeId) => {
          return get().discoveries.filter(d => d.nodeId === nodeId)
        },
      }),
      {
        name: 'polarcraft-exploration',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // 只持久化必要的状态
          difficultyLens: state.difficultyLens,
          visitedNodes: state.visitedNodes,
          expandedSections: state.expandedSections,
          triedExperiments: state.triedExperiments,
          viewedDemos: state.viewedDemos,
          playedGames: state.playedGames,
          discoveries: state.discoveries,
          bookmarks: state.bookmarks,
          preferredStageId: state.preferredStageId,
          hasSeenIntro: state.hasSeenIntro,
          lastActiveDate: state.lastActiveDate,
          totalTimeSpent: state.totalTimeSpent,
        }),
      }
    )
  )
)

// 便捷 hooks
export const useDifficultyLens = () => useExplorationStore(state => state.difficultyLens)
export const useCurrentNode = () => useExplorationStore(state => state.currentNodeId)
export const useBookmarks = () => useExplorationStore(state => state.bookmarks)
export const useExplorationStats = () => useExplorationStore(state => state.getStats())
