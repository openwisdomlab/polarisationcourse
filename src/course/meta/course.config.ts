/**
 * course.config.ts - 课程内容层配置
 * Course Content Layer Configuration
 *
 * 此配置文件定义课程的元信息，支持未来多课程扩展
 * This configuration defines course metadata with future multi-course support
 */

// 当前课程 ID - 用于路由和资源隔离
export const COURSE_ID = 'world-under-polarized-light' as const

// 课程 ID 类型 - 未来扩展支持多课程
export type CourseId =
  | 'world-under-polarized-light'
  // 未来课程预留
  // | 'polarization-experiments-lab'
  // | 'frontier-research-polarization'

// 难度层级定义
export type DifficultyLevel = 'foundation' | 'application' | 'research'

// 难度层级配置
export interface DifficultyConfig {
  id: DifficultyLevel
  icon: string
  labelKey: string
  descriptionKey: string
  color: string
  targetAudience: string
  learningMode: string
}

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, DifficultyConfig> = {
  foundation: {
    id: 'foundation',
    icon: '🌱',
    labelKey: 'course.difficulty.foundation.label',
    descriptionKey: 'course.difficulty.foundation.description',
    color: '#22C55E', // green-500
    targetAudience: 'Beginners, early undergraduates',
    learningMode: 'PSRT: Problem-driven research introduction',
  },
  application: {
    id: 'application',
    icon: '🔬',
    labelKey: 'course.difficulty.application.label',
    descriptionKey: 'course.difficulty.application.description',
    color: '#3B82F6', // blue-500
    targetAudience: 'Learners with basic knowledge',
    learningMode: 'ESRT: Rotational research training',
  },
  research: {
    id: 'research',
    icon: '🚀',
    labelKey: 'course.difficulty.research.label',
    descriptionKey: 'course.difficulty.research.description',
    color: '#A855F7', // purple-500
    targetAudience: 'Advanced learners, graduate students',
    learningMode: 'ORIC/SURF: Independent original research',
  },
}

// 课程元信息接口
export interface CourseMetadata {
  id: CourseId
  titleKey: string
  titleZhKey: string
  subtitleKey: string
  descriptionKey: string
  badge: string
  version: string
  lastUpdated: string
  totalUnits: number
  estimatedHours: number
  prerequisites: string[]
  tags: string[]
}

// 《偏振光下的世界》课程配置
export const WORLD_UNDER_POLARIZED_LIGHT: CourseMetadata = {
  id: 'world-under-polarized-light',
  titleKey: 'worldCourse.title',
  titleZhKey: 'worldCourse.titleZh',
  subtitleKey: 'worldCourse.subtitle',
  descriptionKey: 'worldCourse.description',
  badge: 'P-SRT',
  version: '1.0.0',
  lastUpdated: '2025-01-13',
  totalUnits: 6, // 0-5
  estimatedHours: 40,
  prerequisites: [],
  tags: ['polarization', 'optics', 'physics', 'interactive'],
}

// 课程内容层配置
export interface CourseLayerConfig {
  // 课程路由前缀
  routePrefix: string
  // 是否启用进度追踪
  enableProgress: boolean
  // 是否启用测验
  enableQuiz: boolean
  // 是否启用成就系统
  enableAchievements: boolean
  // 默认难度级别
  defaultDifficulty: DifficultyLevel
}

export const COURSE_LAYER_CONFIG: CourseLayerConfig = {
  routePrefix: '/course/world-under-polarized-light',
  enableProgress: true,
  enableQuiz: true,
  enableAchievements: true,
  defaultDifficulty: 'foundation',
}

// 获取课程配置的辅助函数
export function getCourseConfig(courseId: CourseId): CourseMetadata {
  switch (courseId) {
    case 'world-under-polarized-light':
      return WORLD_UNDER_POLARIZED_LIGHT
    default:
      return WORLD_UNDER_POLARIZED_LIGHT
  }
}

// 获取课程路由路径
export function getCoursePath(
  courseId: CourseId,
  subPath?: string
): string {
  const basePath = `/course/${courseId}`
  return subPath ? `${basePath}/${subPath}` : basePath
}

// 获取单元路由路径
export function getUnitPath(courseId: CourseId, unitId: string): string {
  return getCoursePath(courseId, `unit/${unitId}`)
}

// 获取课程路由路径
export function getLessonPath(
  courseId: CourseId,
  unitId: string,
  lessonId: string
): string {
  return getCoursePath(courseId, `unit/${unitId}/lesson/${lessonId}`)
}
