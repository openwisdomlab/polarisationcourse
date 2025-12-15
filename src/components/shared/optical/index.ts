/**
 * Optical Components Library - 光学元件组件库
 * 导出所有可复用的SVG光学元件组件
 */

// 类型定义
export * from './types'

// SVG组件
export { EmitterSVG } from './EmitterSVG'
export type { EmitterSVGProps } from './EmitterSVG'

export { PolarizerSVG } from './PolarizerSVG'
export type { PolarizerSVGProps } from './PolarizerSVG'

export { MirrorSVG } from './MirrorSVG'
export type { MirrorSVGProps } from './MirrorSVG'

export { SplitterSVG } from './SplitterSVG'
export type { SplitterSVGProps } from './SplitterSVG'

export { RotatorSVG } from './RotatorSVG'
export type { RotatorSVGProps } from './RotatorSVG'

export { SensorSVG } from './SensorSVG'
export type { SensorSVGProps } from './SensorSVG'

export { LightBeamSVG, LightBeamDefs, LightBeams } from './LightBeamSVG'
export type { LightBeamSVGProps, LightBeamsProps } from './LightBeamSVG'

// === Advanced Optical Components (Phase 1 - Jones Calculus) ===

export { QuarterWavePlateSVG } from './QuarterWavePlateSVG'
export type { QuarterWavePlateSVGProps } from './QuarterWavePlateSVG'

export { HalfWavePlateSVG } from './HalfWavePlateSVG'
export type { HalfWavePlateSVGProps } from './HalfWavePlateSVG'

export { PhaseShifterSVG } from './PhaseShifterSVG'
export type { PhaseShifterSVGProps } from './PhaseShifterSVG'

export { CircularFilterSVG } from './CircularFilterSVG'
export type { CircularFilterSVGProps } from './CircularFilterSVG'

export { BeamCombinerSVG } from './BeamCombinerSVG'
export type { BeamCombinerSVGProps } from './BeamCombinerSVG'

export { CoincidenceCounterSVG } from './CoincidenceCounterSVG'
export type { CoincidenceCounterSVGProps } from './CoincidenceCounterSVG'

export { OpticalIsolatorSVG } from './OpticalIsolatorSVG'
export type { OpticalIsolatorSVGProps } from './OpticalIsolatorSVG'

// === Visualization Components (Phase 4) ===

export { PhaseVisualizerSVG, EnhancedLightBeamSVG } from './PhaseVisualizerSVG'
export type { PhaseVisualizerSVGProps, EnhancedLightBeamSVGProps } from './PhaseVisualizerSVG'

export { VectorScopeSVG, VectorScopeDefs, PolarizationIndicator } from './VectorScopeSVG'
export type { VectorScopeSVGProps, PolarizationIndicatorProps } from './VectorScopeSVG'

// === Optical Detective Mode (Black Box / Mystery Component) ===

export { MysteryBoxSVG, MysteryBoxDefs } from './MysteryBoxSVG'
export type { MysteryBoxSVGProps } from './MysteryBoxSVG'
