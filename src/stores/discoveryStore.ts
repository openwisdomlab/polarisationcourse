/**
 * DiscoveryStore - 发现/成就追踪系统
 *
 * Tracks player discoveries and unlocks as part of the "Lab Notebook"
 * meta-progression system. When players observe new phenomena, they
 * unlock new tools, visualizations, and components.
 *
 * Part of Module 4: The "Lab Notebook" (Meta-Progression)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================
// Discovery Types
// ============================================

/**
 * Categories of discoveries
 */
export type DiscoveryCategory =
  | 'polarization'      // Polarization states
  | 'interference'      // Interference phenomena
  | 'components'        // Optical components understood
  | 'phenomena'         // Physical phenomena observed
  | 'techniques'        // Experimental techniques mastered
  | 'detective'         // Optical detective achievements

/**
 * A single discovery entry
 */
export interface Discovery {
  id: string
  category: DiscoveryCategory
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  /** What this discovery unlocks (component, tool, level, etc.) */
  unlocks?: string[]
  /** Icon or emoji for the discovery */
  icon: string
  /** Timestamp when discovered */
  discoveredAt?: number
  /** Level or mode where discovery was made */
  discoveredIn?: string
  /** Is this a hidden/secret discovery? */
  secret?: boolean
}

/**
 * All possible discoveries in the game
 */
export const ALL_DISCOVERIES: Discovery[] = [
  // === Polarization Discoveries ===
  {
    id: 'linear_polarization',
    category: 'polarization',
    name: 'Linear Polarization',
    nameZh: '线偏振光',
    description: 'Observed light polarized in a single plane',
    descriptionZh: '观察到在单一平面振动的偏振光',
    icon: '→',
    unlocks: ['polarizer_component'],
  },
  {
    id: 'circular_polarization',
    category: 'polarization',
    name: 'Circular Polarization',
    nameZh: '圆偏振光',
    description: 'Created or observed circularly polarized light',
    descriptionZh: '创建或观察到圆偏振光',
    icon: '◯',
    unlocks: ['poincare_sphere_viz', 'circular_filter_component'],
  },
  {
    id: 'elliptical_polarization',
    category: 'polarization',
    name: 'Elliptical Polarization',
    nameZh: '椭圆偏振光',
    description: 'Observed elliptically polarized light',
    descriptionZh: '观察到椭圆偏振光',
    icon: '⬭',
    unlocks: ['jones_vector_display'],
  },
  {
    id: 'right_circular',
    category: 'polarization',
    name: 'Right-Hand Circular (RCP)',
    nameZh: '右旋圆偏振',
    description: 'Created right-handed circular polarization',
    descriptionZh: '创建右旋圆偏振光',
    icon: '↻',
  },
  {
    id: 'left_circular',
    category: 'polarization',
    name: 'Left-Hand Circular (LCP)',
    nameZh: '左旋圆偏振',
    description: 'Created left-handed circular polarization',
    descriptionZh: '创建左旋圆偏振光',
    icon: '↺',
  },

  // === Interference Discoveries ===
  {
    id: 'constructive_interference',
    category: 'interference',
    name: 'Constructive Interference',
    nameZh: '相长干涉',
    description: 'Two beams combined to create brighter light',
    descriptionZh: '两束光相遇产生更亮的光',
    icon: '⊕',
    unlocks: ['phase_shifter_component'],
  },
  {
    id: 'destructive_interference',
    category: 'interference',
    name: 'Destructive Interference',
    nameZh: '相消干涉',
    description: 'Two beams cancelled each other out',
    descriptionZh: '两束光相互抵消',
    icon: '⊖',
    unlocks: ['interferometer_levels'],
  },
  {
    id: 'mach_zehnder_pattern',
    category: 'interference',
    name: 'Mach-Zehnder Pattern',
    nameZh: '马赫-曾德图样',
    description: 'Observed interference pattern in Mach-Zehnder setup',
    descriptionZh: '在马赫-曾德配置中观察到干涉图样',
    icon: '◇',
    unlocks: ['advanced_interferometer_levels'],
    secret: true,
  },

  // === Component Discoveries ===
  {
    id: 'malus_law',
    category: 'components',
    name: "Malus's Law",
    nameZh: '马吕斯定律',
    description: 'Understood intensity = I₀ × cos²(θ)',
    descriptionZh: '理解了强度 = I₀ × cos²(θ)',
    icon: 'cos²',
    unlocks: ['intensity_calculator'],
  },
  {
    id: 'birefringence',
    category: 'components',
    name: 'Birefringence',
    nameZh: '双折射',
    description: 'Observed light splitting into o-ray and e-ray',
    descriptionZh: '观察到光分裂成寻常光和非常光',
    icon: '⑀',
    unlocks: ['splitter_component'],
  },
  {
    id: 'half_wave_plate',
    category: 'components',
    name: 'Half-Wave Plate (λ/2)',
    nameZh: '半波片',
    description: 'Understood how HWP flips polarization',
    descriptionZh: '理解半波片如何翻转偏振',
    icon: '⟲',
    unlocks: ['hwp_component'],
  },
  {
    id: 'quarter_wave_plate',
    category: 'components',
    name: 'Quarter-Wave Plate (λ/4)',
    nameZh: '四分之一波片',
    description: 'Understood linear ↔ circular conversion',
    descriptionZh: '理解线偏振↔圆偏振转换',
    icon: '◔',
    unlocks: ['qwp_component'],
  },
  {
    id: 'optical_rotation',
    category: 'components',
    name: 'Optical Activity',
    nameZh: '旋光性',
    description: 'Observed polarization rotation in optically active medium',
    descriptionZh: '在旋光介质中观察到偏振旋转',
    icon: '🍬',
    unlocks: ['sugar_solution_component'],
  },

  // === Phenomena Discoveries ===
  {
    id: 'crossed_polarizers',
    category: 'phenomena',
    name: 'Crossed Polarizers',
    nameZh: '正交偏振片',
    description: 'Observed complete light blocking with 90° polarizers',
    descriptionZh: '观察到90°偏振片完全阻挡光',
    icon: '✕',
  },
  {
    id: 'brewster_angle',
    category: 'phenomena',
    name: "Brewster's Angle",
    nameZh: '布儒斯特角',
    description: 'Found the angle of zero reflection for p-polarization',
    descriptionZh: '找到p偏振零反射角',
    icon: '∠',
    secret: true,
  },
  {
    id: 'faraday_effect',
    category: 'phenomena',
    name: 'Faraday Effect',
    nameZh: '法拉第效应',
    description: 'Observed non-reciprocal polarization rotation',
    descriptionZh: '观察到非互易偏振旋转',
    icon: '🧲',
    unlocks: ['optical_isolator_component'],
    secret: true,
  },

  // === Technique Discoveries ===
  {
    id: 'polarimetry',
    category: 'techniques',
    name: 'Polarimetry',
    nameZh: '偏振测量',
    description: 'Used polarization to measure unknown samples',
    descriptionZh: '使用偏振测量未知样品',
    icon: '📐',
    unlocks: ['polarimeter_tool'],
  },
  {
    id: 'jones_calculus',
    category: 'techniques',
    name: 'Jones Calculus',
    nameZh: '琼斯矩阵',
    description: 'Understood matrix representation of polarization',
    descriptionZh: '理解偏振的矩阵表示',
    icon: '🔢',
    unlocks: ['matrix_display'],
    secret: true,
  },

  // === Detective Achievements ===
  {
    id: 'first_mystery_solved',
    category: 'detective',
    name: 'First Mystery',
    nameZh: '初次侦破',
    description: 'Solved your first mystery box',
    descriptionZh: '破解了第一个神秘黑盒',
    icon: '🔍',
  },
  {
    id: 'perfect_deduction',
    category: 'detective',
    name: 'Perfect Deduction',
    nameZh: '完美推理',
    description: 'Solved a mystery on the first try',
    descriptionZh: '首次尝试就破解神秘黑盒',
    icon: '🎯',
  },
  {
    id: 'detective_master',
    category: 'detective',
    name: 'Master Detective',
    nameZh: '侦探大师',
    description: 'Solved 10 mystery boxes',
    descriptionZh: '破解10个神秘黑盒',
    icon: '🏆',
    secret: true,
  },
  {
    id: 'no_hints_needed',
    category: 'detective',
    name: 'No Hints Needed',
    nameZh: '无需提示',
    description: 'Solved a hard mystery without using hints',
    descriptionZh: '不使用提示破解困难神秘黑盒',
    icon: '💡',
    secret: true,
  },
]

// ============================================
// Demo → Discovery Mapping
// Completing a demo auto-unlocks related discoveries
// ============================================

const DEMO_DISCOVERY_MAP: Record<string, string[]> = {
  'polarization-intro': ['linear_polarization'],
  'polarization-types-unified': ['linear_polarization'],
  'malus': ['malus_law', 'crossed_polarizers'],
  'birefringence': ['birefringence'],
  'waveplate': ['half_wave_plate', 'quarter_wave_plate'],
  'arago-fresnel': ['constructive_interference', 'destructive_interference'],
  'fresnel': [],
  'brewster': ['brewster_angle'],
  'optical-rotation': ['optical_rotation'],
  'stokes': ['polarimetry'],
  'jones': ['jones_calculus'],
  'mueller': ['polarimetry'],
  'polarization-state': ['linear_polarization', 'circular_polarization', 'elliptical_polarization'],
}

// ============================================
// Store State
// ============================================

interface DiscoveryState {
  /** Map of discovery ID to discovery info (if discovered) */
  discoveries: Record<string, Discovery>

  /** Set of completed demo IDs (persisted as array) */
  completedDemos: string[]

  /** Total mysteries solved count */
  mysteriesSolved: number

  /** Perfect deductions (first try) count */
  perfectDeductions: number

  /** Current streak of correct guesses */
  currentStreak: number

  /** Best streak ever */
  bestStreak: number

  /** Queue of discoveries pending notification display */
  pendingNotifications: Discovery[]

  /** Actions */
  unlockDiscovery: (discoveryId: string, discoveredIn?: string) => void
  hasDiscovery: (discoveryId: string) => boolean
  getDiscoveriesByCategory: (category: DiscoveryCategory) => Discovery[]
  getUnlockedFeatures: () => string[]
  incrementMysteriesSolved: (wasPerfect: boolean) => void
  resetProgress: () => void
  /** Clear a notification from the pending queue */
  dismissNotification: (discoveryId: string) => void
  /** Clear all pending notifications */
  clearAllNotifications: () => void

  /** Mark a demo as completed */
  markDemoCompleted: (demoId: string) => void
  /** Check if a demo has been completed */
  isDemoCompleted: (demoId: string) => boolean
  /** Get all completed demo IDs as a Set */
  getCompletedDemoIds: () => Set<string>

  // Derived values - use selectors at call site:
  // const total = useDiscoveryStore(s => Object.keys(s.discoveries).length)
}

// ============================================
// Store Implementation
// ============================================

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      discoveries: {},
      completedDemos: [],
      mysteriesSolved: 0,
      perfectDeductions: 0,
      currentStreak: 0,
      bestStreak: 0,
      pendingNotifications: [],

      unlockDiscovery: (discoveryId: string, discoveredIn?: string) => {
        const discovery = ALL_DISCOVERIES.find((d) => d.id === discoveryId)
        if (!discovery) return

        set((state) => {
          // Already discovered
          if (state.discoveries[discoveryId]) return state

          const newDiscovery = {
            ...discovery,
            discoveredAt: Date.now(),
            discoveredIn,
          }

          return {
            discoveries: {
              ...state.discoveries,
              [discoveryId]: newDiscovery,
            },
            // Add to pending notifications queue
            pendingNotifications: [...state.pendingNotifications, newDiscovery],
          }
        })
      },

      hasDiscovery: (discoveryId: string) => {
        return !!get().discoveries[discoveryId]
      },

      getDiscoveriesByCategory: (category: DiscoveryCategory) => {
        const { discoveries } = get()
        return Object.values(discoveries).filter((d) => d.category === category)
      },

      getUnlockedFeatures: () => {
        const { discoveries } = get()
        const features: string[] = []

        Object.values(discoveries).forEach((discovery) => {
          if (discovery.unlocks) {
            features.push(...discovery.unlocks)
          }
        })

        return [...new Set(features)]
      },

      incrementMysteriesSolved: (wasPerfect: boolean) => {
        set((state) => {
          const newMysteriesSolved = state.mysteriesSolved + 1
          const newPerfect = wasPerfect
            ? state.perfectDeductions + 1
            : state.perfectDeductions
          const newStreak = wasPerfect ? state.currentStreak + 1 : 0
          const newBestStreak = Math.max(state.bestStreak, newStreak)

          return {
            mysteriesSolved: newMysteriesSolved,
            perfectDeductions: newPerfect,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
          }
        })
      },

      markDemoCompleted: (demoId: string) => {
        const state = get()
        if (state.completedDemos.includes(demoId)) return
        set({ completedDemos: [...state.completedDemos, demoId] })

        // Auto-unlock related discoveries
        const relatedDiscoveries = DEMO_DISCOVERY_MAP[demoId]
        if (relatedDiscoveries) {
          for (const discoveryId of relatedDiscoveries) {
            if (!state.discoveries[discoveryId]) {
              get().unlockDiscovery(discoveryId, `demo:${demoId}`)
            }
          }
        }
      },

      isDemoCompleted: (demoId: string) => {
        return get().completedDemos.includes(demoId)
      },

      getCompletedDemoIds: () => {
        return new Set(get().completedDemos)
      },

      resetProgress: () => {
        set({
          discoveries: {},
          completedDemos: [],
          mysteriesSolved: 0,
          perfectDeductions: 0,
          currentStreak: 0,
          bestStreak: 0,
          pendingNotifications: [],
        })
      },

      dismissNotification: (discoveryId: string) => {
        set((state) => ({
          pendingNotifications: state.pendingNotifications.filter(
            (d) => d.id !== discoveryId
          ),
        }))
      },

      clearAllNotifications: () => {
        set({ pendingNotifications: [] })
      },

      // Use selectors at call site for derived values:
      // const totalDiscoveries = useDiscoveryStore(s => Object.keys(s.discoveries).length)
      // const secretDiscoveries = useDiscoveryStore(s => Object.values(s.discoveries).filter(d => d.secret).length)
    }),
    {
      name: 'polarquest-discoveries',
      version: 1,
      // Don't persist pendingNotifications - they're session-only UI state
      partialize: (state) => ({
        discoveries: state.discoveries,
        completedDemos: state.completedDemos,
        mysteriesSolved: state.mysteriesSolved,
        perfectDeductions: state.perfectDeductions,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Clear session-only state after hydration
          state.pendingNotifications = []
        }
      },
    }
  )
)

// ============================================
// Discovery Detection Helpers
// ============================================

import type { PolarizationInfo } from '@/core/physics'

/**
 * Check if a polarization state triggers any discoveries
 */
export function checkPolarizationDiscovery(
  info: PolarizationInfo,
  store: ReturnType<typeof useDiscoveryStore.getState>
): string[] {
  const newDiscoveries: string[] = []

  // Linear polarization
  if (info.type === 'linear' && !store.hasDiscovery('linear_polarization')) {
    newDiscoveries.push('linear_polarization')
  }

  // Circular polarization
  if (info.type === 'circular') {
    if (!store.hasDiscovery('circular_polarization')) {
      newDiscoveries.push('circular_polarization')
    }
    if (info.handedness === 'right' && !store.hasDiscovery('right_circular')) {
      newDiscoveries.push('right_circular')
    }
    if (info.handedness === 'left' && !store.hasDiscovery('left_circular')) {
      newDiscoveries.push('left_circular')
    }
  }

  // Elliptical polarization
  if (info.type === 'elliptical' && !store.hasDiscovery('elliptical_polarization')) {
    newDiscoveries.push('elliptical_polarization')
  }

  return newDiscoveries
}

/**
 * Check if an interference event triggers discoveries
 */
export function checkInterferenceDiscovery(
  inputIntensity1: number,
  inputIntensity2: number,
  outputIntensity: number,
  store: ReturnType<typeof useDiscoveryStore.getState>
): string[] {
  const newDiscoveries: string[] = []
  const sumIntensity = inputIntensity1 + inputIntensity2

  // Constructive interference: output > sum of inputs (within tolerance)
  if (
    outputIntensity > sumIntensity * 0.9 &&
    !store.hasDiscovery('constructive_interference')
  ) {
    newDiscoveries.push('constructive_interference')
  }

  // Destructive interference: output << sum of inputs
  if (
    outputIntensity < sumIntensity * 0.1 &&
    !store.hasDiscovery('destructive_interference')
  ) {
    newDiscoveries.push('destructive_interference')
  }

  return newDiscoveries
}

/**
 * Check mystery solving achievements
 */
export function checkDetectiveDiscovery(
  wasCorrect: boolean,
  attemptNumber: number,
  usedHints: boolean,
  difficulty: 'easy' | 'medium' | 'hard',
  store: ReturnType<typeof useDiscoveryStore.getState>
): string[] {
  const newDiscoveries: string[] = []

  if (wasCorrect) {
    // First mystery
    if (store.mysteriesSolved === 0 && !store.hasDiscovery('first_mystery_solved')) {
      newDiscoveries.push('first_mystery_solved')
    }

    // Perfect deduction (first try)
    if (attemptNumber === 1 && !store.hasDiscovery('perfect_deduction')) {
      newDiscoveries.push('perfect_deduction')
    }

    // No hints on hard
    if (
      difficulty === 'hard' &&
      !usedHints &&
      !store.hasDiscovery('no_hints_needed')
    ) {
      newDiscoveries.push('no_hints_needed')
    }

    // Master detective (10+ mysteries)
    if (store.mysteriesSolved >= 9 && !store.hasDiscovery('detective_master')) {
      newDiscoveries.push('detective_master')
    }
  }

  return newDiscoveries
}
