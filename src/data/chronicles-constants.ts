/**
 * Chronicles Page Constants
 * 光的编年史 - 常量配置
 */

// 类别颜色配置 - 光谱色系
export const CATEGORY_COLORS = {
  foundation: { dark: { bg: '#1e1b4b', stroke: '#818cf8', text: '#a5b4fc' }, light: { bg: '#eef2ff', stroke: '#6366f1', text: '#4f46e5' } },
  geometric: { dark: { bg: '#451a03', stroke: '#f97316', text: '#fb923c' }, light: { bg: '#fff7ed', stroke: '#ea580c', text: '#c2410c' } },
  wave: { dark: { bg: '#052e16', stroke: '#22c55e', text: '#4ade80' }, light: { bg: '#f0fdf4', stroke: '#16a34a', text: '#15803d' } },
  polarization: { dark: { bg: '#083344', stroke: '#22d3ee', text: '#67e8f9' }, light: { bg: '#ecfeff', stroke: '#06b6d4', text: '#0891b2' } },
  quantum: { dark: { bg: '#3b0764', stroke: '#a855f7', text: '#c084fc' }, light: { bg: '#faf5ff', stroke: '#9333ea', text: '#7e22ce' } },
  application: { dark: { bg: '#1f2937', stroke: '#9ca3af', text: '#d1d5db' }, light: { bg: '#f3f4f6', stroke: '#6b7280', text: '#4b5563' } },
}

// 分支对应的光谱区域
export const BRANCH_SPECTRUM_REGIONS = {
  geometric: { start: 22, end: 38, label: 'mm-μm' },
  wave: { start: 36, end: 52, label: 'μm-nm' },
  polarization: { start: 48, end: 68, label: 'nm scale' },
  quantum: { start: 66, end: 82, label: 'photon' },
}

// 分支在光谱上的位置映射（横向排列映射到光谱）
export const BRANCH_SPECTRUM_POSITIONS = {
  geometric: { center: 30, labelEn: 'Geometric', labelZh: '几何光学' },
  wave: { center: 44, labelEn: 'Wave', labelZh: '波动光学' },
  polarization: { center: 58, labelEn: 'Polarization', labelZh: '偏振光学' },
  quantum: { center: 74, labelEn: 'Quantum', labelZh: '量子光学' },
}

// Category labels for timeline events
export const CATEGORY_LABELS = {
  discovery: { en: 'Discovery', zh: '发现', color: 'blue' as const },
  theory: { en: 'Theory', zh: '理论', color: 'purple' as const },
  experiment: { en: 'Experiment', zh: '实验', color: 'green' as const },
  application: { en: 'Application', zh: '应用', color: 'orange' as const },
}

// Type exports for external use
export type CategoryColorKey = keyof typeof CATEGORY_COLORS
export type BranchKey = keyof typeof BRANCH_SPECTRUM_POSITIONS
export type CategoryKey = keyof typeof CATEGORY_LABELS
