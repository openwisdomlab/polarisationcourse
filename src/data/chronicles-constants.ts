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

/**
 * 分支对应的光谱区域
 *
 * 科学说明：这是一种概念性/教学性映射，而非严格的物理对应关系。
 * 实际上，光学的各个分支并不严格对应特定的电磁波谱区域：
 * - 几何光学：适用于波长远小于物体尺寸的情况，在整个可见光谱都有效
 * - 波动光学：衍射和干涉效应在波长与物体尺寸可比时显著
 * - 偏振光学：是光的横波特性，适用于所有电磁波
 * - 量子光学：处理单光子行为，能量尺度由E=hν决定
 *
 * 这里的映射是为了在可视化中建立直观的"尺度-分支"关联。
 */
export const BRANCH_SPECTRUM_REGIONS = {
  geometric: { start: 22, end: 38, label: 'mm-μm' },  // 宏观尺度，光线近似
  wave: { start: 36, end: 52, label: 'μm-nm' },       // 波长尺度，衍射干涉
  polarization: { start: 48, end: 68, label: 'nm scale' }, // 光波矢量尺度
  quantum: { start: 66, end: 82, label: 'photon' },   // 单光子/量子尺度
}

/**
 * 分支在光谱上的位置映射（横向排列映射到光谱）
 * 这是UI可视化用的位置参数，center值表示在光谱条上的百分比位置
 */
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

// Mapping from illustration types to demo/module routes
// 将事件的 illustrationType 映射到对应的演示模块
export const ILLUSTRATION_TO_DEMO_MAP: Record<string, { route: string; labelEn: string; labelZh: string }> = {
  // Direct demo mappings
  'polarizer': { route: '/demos/malus', labelEn: 'Malus\'s Law Demo', labelZh: '马吕斯定律演示' },
  'malus': { route: '/demos/malus', labelEn: 'Malus\'s Law Demo', labelZh: '马吕斯定律演示' },
  'birefringence': { route: '/demos/birefringence', labelEn: 'Birefringence Demo', labelZh: '双折射演示' },
  'calcite': { route: '/demos/birefringence', labelEn: 'Birefringence Demo', labelZh: '双折射演示' },
  'wave': { route: '/demos/light-wave', labelEn: 'Light Wave Demo', labelZh: '光波演示' },
  'transverse': { route: '/demos/polarization-state', labelEn: 'Polarization State', labelZh: '偏振态演示' },
  'prism': { route: '/demos/chromatic', labelEn: 'Chromatic Demo', labelZh: '色散演示' },
  'double-slit': { route: '/demos/fresnel', labelEn: 'Fresnel Demo', labelZh: '菲涅尔演示' },
  'reflection': { route: '/demos/brewster', labelEn: 'Brewster Angle Demo', labelZh: '布儒斯特角演示' },
  'rayleigh': { route: '/demos/rayleigh', labelEn: 'Rayleigh Scattering', labelZh: '瑞利散射演示' },
  'stokes': { route: '/demos/stokes', labelEn: 'Stokes Vector Demo', labelZh: '斯托克斯矢量演示' },
  'mueller': { route: '/demos/mueller', labelEn: 'Mueller Matrix Demo', labelZh: '穆勒矩阵演示' },
  'jones': { route: '/demos/jones', labelEn: 'Jones Matrix Demo', labelZh: '琼斯矩阵演示' },
  'poincare': { route: '/demos/polarization-state', labelEn: 'Polarization State', labelZh: '偏振态演示' },
  'nicol': { route: '/demos/birefringence', labelEn: 'Birefringence Demo', labelZh: '双折射演示' },
  'faraday': { route: '/demos/optical-rotation', labelEn: 'Optical Rotation Demo', labelZh: '旋光演示' },
  'opticalactivity': { route: '/demos/optical-rotation', labelEn: 'Optical Rotation Demo', labelZh: '旋光演示' },
  'chirality': { route: '/demos/optical-rotation', labelEn: 'Optical Rotation Demo', labelZh: '旋光演示' },
  'chromaticpol': { route: '/demos/chromatic', labelEn: 'Chromatic Polarization', labelZh: '色偏振演示' },
  'lcd': { route: '/demos/polarization-types', labelEn: 'Polarization Types', labelZh: '偏振类型演示' },
  'photoelectric': { route: '/demos/polarization-intro', labelEn: 'Polarization Intro', labelZh: '偏振入门' },
  'metasurface': { route: '/demos/waveplate', labelEn: 'Waveplate Demo', labelZh: '波片演示' },
  'quantum': { route: '/demos/polarization-calculator', labelEn: 'Polarization Calculator', labelZh: '偏振计算器' },
  'medical': { route: '/demos/anisotropy', labelEn: 'Anisotropy Demo', labelZh: '各向异性演示' },
  'snell': { route: '/demos/fresnel', labelEn: 'Fresnel Demo', labelZh: '菲涅尔演示' },
  'lightspeed': { route: '/demos/light-wave', labelEn: 'Light Wave Demo', labelZh: '光波演示' },
  'mantis': { route: '/demos/polarization-types', labelEn: 'Polarization Types', labelZh: '偏振类型演示' },
}

// Optical bench experiment mappings for "复现实验" button
// 用于"在实验室复现"按钮的光学工作台实验映射
export const ILLUSTRATION_TO_BENCH_MAP: Record<string, { route: string; labelEn: string; labelZh: string }> = {
  'polarizer': { route: '/bench?experiment=malus-law', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
  'malus': { route: '/bench?experiment=malus-law', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
  'birefringence': { route: '/bench?experiment=birefringence', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
  'calcite': { route: '/bench?experiment=birefringence', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
  'nicol': { route: '/bench?experiment=birefringence', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
  'chromaticpol': { route: '/bench?experiment=chromatic-polarization', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
  'faraday': { route: '/bench?experiment=faraday-rotation', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
  'opticalactivity': { route: '/bench?experiment=optical-rotation', labelEn: 'Recreate in Lab', labelZh: '在实验室复现' },
}

// Type exports for external use
export type CategoryColorKey = keyof typeof CATEGORY_COLORS
export type BranchKey = keyof typeof BRANCH_SPECTRUM_POSITIONS
export type CategoryKey = keyof typeof CATEGORY_LABELS
