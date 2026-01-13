/**
 * Discovery Components - 渐进式探索组件
 *
 * 设计理念来自 Google Learn About:
 * - 问题驱动的入口
 * - 渐进式信息披露
 * - 主动学习检查点
 * - 深度控制（简化/深入）
 */

// 微学习卡片
export {
  MicroLearningCard,
  MicroLearningCardStack,
  MICRO_LEARNING_CARDS,
  type MicroLearningContent,
  type CardType
} from './MicroLearningCard'

// 互动实验模块
export {
  InteractiveExperimentModule,
  EXPERIMENTS,
  type Experiment
} from './InteractiveExperimentModule'

// 引导探索路径
export { GuidedExplorationPath } from './GuidedExplorationPath'
