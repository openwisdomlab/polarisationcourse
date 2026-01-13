/**
 * Course Content Layer - 课程内容层
 * Barrel export for the course module
 *
 * 《偏振光下的世界 / The World Under Polarized Light》
 */

// Meta configuration
export * from './meta/course.config'
export * from './meta/units'

// Components
export { CourseLayout } from './components/CourseLayout'
export { LevelBadge, LevelSelector, LevelInfoCard } from './components/LevelBadge'
export { ProgressTracker } from './components/ProgressTracker'

// Pages
export { CourseHome } from './pages/CourseHome'
export { UnitOverview } from './pages/UnitOverview'
export { LessonPage } from './pages/LessonPage'
