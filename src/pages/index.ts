// ============================================================
// 6 Core Modules - 六大核心模块（一级页面）
// ============================================================

// Module 1: 光的编年史 (Chronicles of Light)
export { ChroniclesPage } from './ChroniclesPage'

// Module 2: 光学设计室 (Optical Design Studio)
export { OpticalDesignPage } from './OpticalDesignPage'

// Module 3: 偏振演示馆 (Demo Gallery)
export { DemosPage } from './DemosPage'

// Module 4: 偏振光探秘 (PolarQuest - Games)
export { GameHubPage } from './GameHubPage'
export { GamePage } from './GamePage'
export { Game2DPage } from './Game2DPage'
export { CardGamePage } from './CardGamePage'
export { EscapeRoomPage } from './EscapeRoomPage'
export { DetectiveGamePage } from './DetectiveGamePage'

// Module 5: 偏振造物局 (Creative Gallery)
export { ExperimentsPage } from './ExperimentsPage'
export { MerchandisePage } from './MerchandisePage'

// Module 6: 虚拟课题组 (Virtual Research Lab)
export { LabPage } from './LabPage'
export { ApplicationsPage } from './ApplicationsPage'

// ============================================================
// Course System - 课程体系
// ============================================================
export { CoursePage } from './CoursePage'
export { default as LearningHubPage } from './LearningHubPage'

// ============================================================
// Utility Pages - 工具页面
// ============================================================
export { CalculationWorkshopPage } from './CalculationWorkshopPage'
export { PoincareSphereViewerPage } from './PoincareSphereViewerPage'
export { JonesCalculatorPage } from './JonesCalculatorPage'
export { StokesCalculatorPage } from './StokesCalculatorPage'
export { MuellerCalculatorPage } from './MuellerCalculatorPage'
export { HardwarePage } from './HardwarePage'

// ============================================================
// Home Page
// ============================================================
export { HomePage } from './HomePage'

// ============================================================
// Legacy Hub Pages - 保留用于向后兼容
// 这些页面现在通过 App.tsx 中的重定向处理
// ============================================================
export { EducationHubPage } from './EducationHubPage'
export { ArsenalHubPage } from './ArsenalHubPage'
export { TheoryHubPage } from './TheoryHubPage'
export { GalleryHubPage } from './GalleryHubPage'
export { ResearchHubPage } from './ResearchHubPage'

// Note: Legacy pages (DevicesPage, BenchPage, OpticalDesignStudioPage, OpticalDesignStudioPageV2)
// have been removed and consolidated into OpticalDesignPage
