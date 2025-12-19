/**
 * Shared types for new modules: Hardware, Card Game, Merchandise
 */

// =============================================================================
// Hardware Module Types (UC2-based polarization hardware)
// =============================================================================

export interface UC2Module {
  id: string
  name: string
  nameZh: string
  category: 'core' | 'optical' | 'mechanical' | 'electronic' | 'sample'
  description: string
  descriptionZh: string
  specifications: {
    dimensions?: string
    weight?: string
    material?: string
    opticalProperties?: string
    [key: string]: string | undefined
  }
  compatibleWith: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  safetyNotes?: string
  safetyNotesZh?: string
  imageType: 'svg' | 'generated' // We'll use generated SVG graphics
}

export interface LightPathConfiguration {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  modules: string[] // Module IDs
  learningObjectives: string[]
  learningObjectivesZh: string[]
  steps: ConfigurationStep[]
}

export interface ConfigurationStep {
  order: number
  moduleId: string
  action: string
  actionZh: string
  notes?: string
  notesZh?: string
}

export interface BOMItem {
  id: string
  name: string
  nameZh: string
  category: 'core' | 'extension' | 'sample' | 'consumable'
  quantity: number
  unitPrice?: number
  currency?: string
  supplier?: string
  partNumber?: string
  notes?: string
  notesZh?: string
  essential: boolean
}

export interface BOMConfig {
  id: string
  name: string
  nameZh: string
  items: BOMItem[]
}

// =============================================================================
// Card Game Types
// =============================================================================

export type CardType =
  | 'light-source'      // 光源卡
  | 'optical-element'   // 光学元件卡
  | 'effect'            // 效果卡
  | 'mission'           // 任务卡
  | 'event'             // 事件卡

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface GameCard {
  id: string
  type: CardType
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  flavorText?: string
  flavorTextZh?: string
  cost: number // 能量消耗
  rarity: CardRarity

  // 游戏效果
  effects: CardEffect[]

  // 光学概念关联
  opticalConcept?: string
  opticalConceptZh?: string

  // 卡面元素
  artworkType: 'polarizer' | 'rotator' | 'splitter' | 'mirror' | 'emitter' | 'sensor' | 'wave' | 'interference' | 'generic'
  polarizationAngle?: number // 0, 45, 90, 135
}

export interface CardEffect {
  type: 'intensity' | 'polarization' | 'direction' | 'split' | 'block' | 'draw' | 'score' | 'special'
  value: number | string
  description: string
  descriptionZh: string
}

export interface Mission {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  difficulty: 1 | 2 | 3 | 4 | 5
  requiredIntensity: number
  requiredPolarization?: number
  opticalConcept: string
  opticalConceptZh: string
  reward: number
}

export interface GameRules {
  mode: 'classroom' | 'competitive'
  playerCount: { min: number; max: number }
  duration: { min: number; max: number } // minutes
  setupSteps: string[]
  setupStepsZh: string[]
  turnPhases: TurnPhase[]
  victoryConditions: string[]
  victoryConditionsZh: string[]
}

export interface TurnPhase {
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  actions: string[]
  actionsZh: string[]
}

// =============================================================================
// Merchandise Types
// =============================================================================

export type ProductCategory =
  | 'art-print'         // 偏振艺术照片
  | 'postcard'          // 明信片
  | 'sticker'           // 贴纸
  | 'acrylic'           // 亚克力摆件/钥匙扣
  | 'filter-toy'        // 偏振滤镜小玩具
  | 'exhibition-set'    // 展陈套装

export type AudienceType = 'child' | 'student' | 'adult' | 'professional' | 'all'

export interface Product {
  id: string
  name: string
  nameZh: string
  category: ProductCategory
  description: string
  descriptionZh: string

  // 工艺与材料
  materials: string[]
  materialsZh: string[]
  craftProcess: string
  craftProcessZh: string

  // 使用场景
  useCases: string[]
  useCasesZh: string[]

  // 教育关联
  educationalValue: string
  educationalValueZh: string
  relatedConcepts: string[]

  // 产品属性
  priceRange: 'low' | 'medium' | 'high' | 'premium' // ¥0-50, ¥50-150, ¥150-500, ¥500+
  targetAudience: AudienceType[]
  requiresPolarizer: boolean

  // 风险提示
  safetyWarning?: string
  safetyWarningZh?: string

  // 艺术生成参数（用于程序生成图像）
  artParams?: PolarizationArtParams
}

export interface PolarizationArtParams {
  type: 'interference' | 'birefringence' | 'stress' | 'rotation' | 'abstract'
  colors: string[]
  complexity: number // 1-10
  animated?: boolean
  analyzerAngle?: number // 0-90 degrees (0 = parallel, 90 = crossed polarizers)
}

// =============================================================================
// Search and Filter Types
// =============================================================================

export interface SearchState {
  query: string
  filters: Record<string, string | string[] | boolean>
}

export interface FilterOption {
  key: string
  label: string
  labelZh: string
  type: 'select' | 'multi-select' | 'boolean' | 'range'
  options?: { value: string; label: string; labelZh: string }[]
}
