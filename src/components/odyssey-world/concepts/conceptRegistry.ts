/**
 * conceptRegistry.ts -- 概念注册表
 *
 * 定义 ConceptDefinition 类型系统，将发现系统中的 discoveryId
 * 映射到三层深度内容 (直觉/定性/定量)。
 *
 * 每个概念包含:
 * - 直觉层 (intuition): 学生已经观察到的现象描述
 * - 定性层 (qualitative): SVG 图解 + 物理解释
 * - 定量层 (quantitative): LaTeX 公式 + 可选推导
 *
 * 各区域概念文件通过 registerRegionConcepts() 注册到全局注册表。
 */

import type { SceneElementType } from '@/stores/odysseyWorldStore'

// ── 概念层接口 ────────────────────────────────────────────────────────

/** 概念内容的单个层 (直觉/定性/定量共用基础) */
export interface ConceptLayer {
  /** i18n 键: 层标题 (如 "What You Observed", "Why This Happens") */
  titleKey: string
  /** i18n 键: 层主要解释文本 */
  contentKey: string
}

// ── 概念定义核心类型 ──────────────────────────────────────────────────

/** 完整概念定义 -- 将一个发现映射到三层深度内容 */
export interface ConceptDefinition {
  /** 概念唯一 ID (如 'malus-law') */
  id: string
  /** 映射到发现系统中的 discoveryId (来自 regionRegistry discovery configs) */
  discoveryId: string
  /** 所属区域 ID */
  regionId: string
  /** i18n 键: 概念名称 (如 'odyssey.concepts.malusLaw.name') */
  nameKey: string

  // ── 三层内容 ──

  /** 直觉层: 学生已经观察到的现象的简短描述 */
  intuition: ConceptLayer

  /** 定性层: SVG 图解 + 物理解释 (为什么会发生) */
  qualitative: ConceptLayer & {
    /** React 组件 ID，用于 SVG 图解渲染 */
    diagramComponent: string
    /** 可选: 微动画提示 (哪些部分有动画效果) */
    animationHints?: string[]
  }

  /** 定量层: LaTeX 公式 + 可选推导步骤 (数学形式化) */
  quantitative: ConceptLayer & {
    /** 公式列表: LaTeX 字符串 + 标签 i18n 键 */
    formulas: { latex: string; labelKey: string }[]
    /** 可选: 推导步骤 i18n 键 */
    derivationStepsKey?: string
  }

  /** 可选: 链接到主课程演示的路径 (如 '/demos/malus') */
  courseLink?: {
    /** 路由路径 (如 '/demos/malus') */
    path: string
    /** i18n 键: 按钮文本 */
    labelKey: string
  }

  /** 可选: 惰性加载的探索器组件 ID (用于 CONT-02 demo 嵌入) */
  demoComponentId?: string

  /** 触发悬停提示的场景元素类型 */
  triggerElementTypes: SceneElementType[]

  /** 触发条件: 'discovered' = 只有发现后才显示提示 (隐形门禁) */
  triggerCondition: 'discovered'

  /** 概念连接: 与其他概念的因果/类比/对比关系 (用于星座图) */
  connections: {
    targetConceptId: string
    type: 'causal' | 'analogous' | 'contrasting'
    labelKey: string
  }[]
}

// ── 区域概念接口 ──────────────────────────────────────────────────────

/** 一个区域的概念集合 */
export interface RegionConcepts {
  regionId: string
  concepts: ConceptDefinition[]
}

// ── 全局概念注册表 ────────────────────────────────────────────────────

/** 按区域 ID 索引的概念注册表 */
const CONCEPT_REGISTRY: Map<string, RegionConcepts> = new Map()

// ── 注册函数 ──────────────────────────────────────────────────────────

/**
 * 注册一个区域的概念集合到全局注册表
 *
 * 由各区域概念文件在模块初始化时调用 (eager evaluation)。
 * 概念数据是轻量级字符串/i18n 键，无需懒加载。
 *
 * @param regionId 区域 ID
 * @param concepts 该区域的概念定义数组
 */
export function registerRegionConcepts(regionId: string, concepts: ConceptDefinition[]): void {
  CONCEPT_REGISTRY.set(regionId, { regionId, concepts })
}

// ── 查询工具函数 ──────────────────────────────────────────────────────

/**
 * 获取指定区域的所有概念
 *
 * @param regionId 区域 ID
 * @returns 概念数组，如果区域未注册返回空数组
 */
export function getConceptsForRegion(regionId: string): ConceptDefinition[] {
  return CONCEPT_REGISTRY.get(regionId)?.concepts ?? []
}

/**
 * 按发现 ID 查找概念
 *
 * 遍历所有已注册区域，找到与指定 discoveryId 匹配的概念。
 *
 * @param discoveryId 发现系统中的 ID
 * @returns 匹配的概念，如果未找到返回 undefined
 */
export function getConceptForDiscovery(discoveryId: string): ConceptDefinition | undefined {
  for (const regionConcepts of CONCEPT_REGISTRY.values()) {
    const found = regionConcepts.concepts.find((c) => c.discoveryId === discoveryId)
    if (found) return found
  }
  return undefined
}

/**
 * 按概念自身 ID 查找概念
 *
 * @param conceptId 概念 ID
 * @returns 匹配的概念，如果未找到返回 undefined
 */
export function getConceptById(conceptId: string): ConceptDefinition | undefined {
  for (const regionConcepts of CONCEPT_REGISTRY.values()) {
    const found = regionConcepts.concepts.find((c) => c.id === conceptId)
    if (found) return found
  }
  return undefined
}

/**
 * 按场景元素类型和区域查找概念
 *
 * 用于确定悬停在某个元素上时应显示哪个概念的提示。
 * 只返回该区域中 triggerElementTypes 包含指定类型的概念。
 *
 * @param _elementId 元素 ID (保留用于未来精确匹配)
 * @param elementType 场景元素类型
 * @param regionId 当前区域 ID
 * @returns 匹配的概念，如果未找到返回 undefined
 */
export function getConceptForElement(
  _elementId: string,
  elementType: SceneElementType,
  regionId: string,
): ConceptDefinition | undefined {
  const regionConcepts = CONCEPT_REGISTRY.get(regionId)
  if (!regionConcepts) return undefined

  return regionConcepts.concepts.find((c) =>
    c.triggerElementTypes.includes(elementType),
  )
}
