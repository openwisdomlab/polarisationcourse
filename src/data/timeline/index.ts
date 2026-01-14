/**
 * Timeline Events - Barrel Export
 * 光的编年史 - 统一导出
 */

export type { TimelineEvent } from './types'
import type { TimelineEvent } from './types'

// Import era-specific events
import { EARLY_OPTICS_EVENTS } from './early-optics'
import { WAVE_THEORY_EVENTS } from './wave-theory'
import { ELECTROMAGNETIC_EVENTS } from './electromagnetic'
import { EARLY_MODERN_EVENTS } from './early-modern'
import { MODERN_EVENTS } from './modern'
import { CONTEMPORARY_EVENTS } from './contemporary'

// Combined timeline (sorted by year)
export const TIMELINE_EVENTS: TimelineEvent[] = [
  ...EARLY_OPTICS_EVENTS,
  ...WAVE_THEORY_EVENTS,
  ...ELECTROMAGNETIC_EVENTS,
  ...EARLY_MODERN_EVENTS,
  ...MODERN_EVENTS,
  ...CONTEMPORARY_EVENTS,
]

// Export individual eras for selective loading
export {
  EARLY_OPTICS_EVENTS,
  WAVE_THEORY_EVENTS,
  ELECTROMAGNETIC_EVENTS,
  EARLY_MODERN_EVENTS,
  MODERN_EVENTS,
  CONTEMPORARY_EVENTS,
}
