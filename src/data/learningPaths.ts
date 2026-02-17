/**
 * Learning Paths - Demo-level prerequisite system
 * 学习路径 - 演示级别的前置条件系统
 *
 * Extends the unit-level prerequisites in LearningPathMap.tsx
 * to individual demo granularity for personalized learning recommendations.
 */

// ============================================
// Types
// ============================================

export interface CrossModuleLink {
  module: 'chronicles' | 'studio' | 'demos' | 'games' | 'gallery' | 'research'
  path: string
  labelKey: string // i18n key
}

export interface DemoPrerequisite {
  demoId: string
  prerequisites: string[] // demo IDs that must be completed first
  estimatedMinutes: number
  crossLinks?: CrossModuleLink[]
}

// ============================================
// Prerequisites Data
// ============================================

export const DEMO_PREREQUISITES: DemoPrerequisite[] = [
  // ---- Unit 0: Optical Basics ----
  {
    demoId: 'em-wave',
    prerequisites: [],
    estimatedMinutes: 8,
  },
  {
    demoId: 'polarization-intro',
    prerequisites: ['em-wave'],
    estimatedMinutes: 10,
    crossLinks: [
      {
        module: 'chronicles',
        path: '/chronicles',
        labelKey: 'learningPaths.crossLinks.chroniclesHistory',
      },
    ],
  },
  {
    demoId: 'polarization-types-unified',
    prerequisites: ['polarization-intro'],
    estimatedMinutes: 15,
  },
  {
    demoId: 'optical-bench',
    prerequisites: ['polarization-types-unified'],
    estimatedMinutes: 12,
    crossLinks: [
      {
        module: 'studio',
        path: '/studio',
        labelKey: 'learningPaths.crossLinks.tryOpticalStudio',
      },
    ],
  },

  // ---- Unit 1: Polarization Fundamentals ----
  {
    demoId: 'polarization-state',
    prerequisites: ['polarization-intro'],
    estimatedMinutes: 10,
  },
  {
    demoId: 'malus',
    prerequisites: ['polarization-types-unified'],
    estimatedMinutes: 12,
    crossLinks: [
      {
        module: 'studio',
        path: '/studio',
        labelKey: 'learningPaths.crossLinks.tryOpticalStudio',
      },
      {
        module: 'games',
        path: '/games/2d',
        labelKey: 'learningPaths.crossLinks.play2DPuzzle',
      },
    ],
  },
  {
    demoId: 'birefringence',
    prerequisites: ['malus'],
    estimatedMinutes: 15,
    crossLinks: [
      {
        module: 'gallery',
        path: '/gallery',
        labelKey: 'learningPaths.crossLinks.viewExperiments',
      },
    ],
  },
  {
    demoId: 'waveplate',
    prerequisites: ['birefringence'],
    estimatedMinutes: 20,
  },

  // ---- Unit 2: Interface Reflection ----
  {
    demoId: 'fresnel',
    prerequisites: ['malus'],
    estimatedMinutes: 20,
  },
  {
    demoId: 'brewster',
    prerequisites: ['fresnel'],
    estimatedMinutes: 15,
    crossLinks: [
      {
        module: 'research',
        path: '/research/applications',
        labelKey: 'learningPaths.crossLinks.realWorldApplications',
      },
    ],
  },

  // ---- Unit 3: Transparent Media ----
  {
    demoId: 'anisotropy',
    prerequisites: ['polarization-intro'],
    estimatedMinutes: 10,
  },
  {
    demoId: 'chromatic',
    prerequisites: ['anisotropy', 'waveplate'],
    estimatedMinutes: 15,
    crossLinks: [
      {
        module: 'gallery',
        path: '/gallery',
        labelKey: 'learningPaths.crossLinks.viewExperiments',
      },
    ],
  },
  {
    demoId: 'optical-rotation',
    prerequisites: ['anisotropy'],
    estimatedMinutes: 12,
  },

  // ---- Unit 4: Scattering ----
  {
    demoId: 'rayleigh',
    prerequisites: ['polarization-types-unified'],
    estimatedMinutes: 10,
  },
  {
    demoId: 'mie-scattering',
    prerequisites: ['rayleigh'],
    estimatedMinutes: 18,
  },
  {
    demoId: 'monte-carlo-scattering',
    prerequisites: ['mie-scattering'],
    estimatedMinutes: 25,
    crossLinks: [
      {
        module: 'research',
        path: '/research',
        labelKey: 'learningPaths.crossLinks.virtualLab',
      },
    ],
  },

  // ---- Unit 5: Full Polarimetry ----
  {
    demoId: 'stokes',
    prerequisites: ['polarization-state', 'malus'],
    estimatedMinutes: 20,
    crossLinks: [
      {
        module: 'demos',
        path: '/calc/stokes',
        labelKey: 'learningPaths.crossLinks.stokesCalculator',
      },
    ],
  },
  {
    demoId: 'mueller',
    prerequisites: ['stokes'],
    estimatedMinutes: 25,
    crossLinks: [
      {
        module: 'demos',
        path: '/calc/mueller',
        labelKey: 'learningPaths.crossLinks.muellerCalculator',
      },
    ],
  },
  {
    demoId: 'jones',
    prerequisites: ['stokes'],
    estimatedMinutes: 20,
    crossLinks: [
      {
        module: 'demos',
        path: '/calc/jones',
        labelKey: 'learningPaths.crossLinks.jonesCalculator',
      },
    ],
  },
  {
    demoId: 'calculator',
    prerequisites: ['stokes'],
    estimatedMinutes: 15,
  },
  {
    demoId: 'polarimetric-microscopy',
    prerequisites: ['mueller'],
    estimatedMinutes: 20,
    crossLinks: [
      {
        module: 'research',
        path: '/research/applications',
        labelKey: 'learningPaths.crossLinks.realWorldApplications',
      },
    ],
  },
]

// ============================================
// Lookup index for O(1) access
// ============================================

const prerequisiteMap = new Map<string, DemoPrerequisite>(
  DEMO_PREREQUISITES.map((dp) => [dp.demoId, dp])
)

// ============================================
// Helper Functions
// ============================================

/** Get prerequisite info for a specific demo */
export function getDemoPrerequisites(demoId: string): DemoPrerequisite | undefined {
  return prerequisiteMap.get(demoId)
}

/** Check if a demo is available (all prerequisites completed) */
export function isDemoAvailable(demoId: string, completedDemoIds: Set<string>): boolean {
  const prereq = prerequisiteMap.get(demoId)
  if (!prereq) return true // Unknown demo — allow access
  return prereq.prerequisites.every((pid) => completedDemoIds.has(pid))
}

/**
 * Get recommended demos — available but not yet completed, ordered by
 * fewest remaining prerequisites (most "ready" first).
 */
export function getRecommendedDemos(
  allDemoIds: string[],
  completedDemoIds: Set<string>
): string[] {
  return allDemoIds
    .filter((id) => !completedDemoIds.has(id) && isDemoAvailable(id, completedDemoIds))
    .sort((a, b) => {
      const pa = prerequisiteMap.get(a)
      const pb = prerequisiteMap.get(b)
      const countA = pa?.prerequisites.length ?? 0
      const countB = pb?.prerequisites.length ?? 0
      return countA - countB
    })
}

/** Calculate overall progress as a percentage (0–100) */
export function calculateProgress(
  allDemoIds: string[],
  completedDemoIds: Set<string>
): number {
  if (allDemoIds.length === 0) return 0
  const completed = allDemoIds.filter((id) => completedDemoIds.has(id)).length
  return Math.round((completed / allDemoIds.length) * 100)
}
