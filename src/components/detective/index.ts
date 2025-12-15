/**
 * Optical Detective Components - 光学侦探模式组件
 *
 * Module 1 of Advanced Exploration & Inquiry-Based Gameplay
 *
 * Features:
 * - MysteryBox (Black Box) component for probing unknown elements
 * - DeductionPanel for player hypothesis submission
 * - Observation logging and hint generation
 */

export { DeductionPanel, validateGuess } from './DeductionPanel'
export type {
  DeductionPanelProps,
  MysteryGuess,
  MysteryElementType,
  ObservationLog,
} from './DeductionPanel'
