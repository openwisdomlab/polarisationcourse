/**
 * useBeamPhysics.ts — Computes the optical physics chain for the Odyssey scroll experience.
 *
 * Reads stationParams from the store, propagates a Stokes vector through Mueller matrices
 * for each station in order, and writes the resulting beamStates back to the store.
 */

import { useEffect } from 'react'
import { MuellerMatrix } from '@/core/physics/unified/MuellerMatrix'
import { ALL_STATIONS } from '@/components/odyssey/odysseyData'
import { useOpticalBenchStore } from '../store'
import type { BeamState } from '../store'

// ── Element type mapping ─────────────────────────────────────────────────────

export type ElementType = 'polarizer' | 'crystal' | 'surface' | 'scatter' | 'generic'

export const ELEMENT_TYPE_MAP: Record<string, ElementType> = {
  'light-wave': 'generic',
  'polarization-intro': 'polarizer',
  'polarization-types': 'generic',
  'virtual-polarizer-lens': 'polarizer',
  'polarization-lock': 'polarizer',
  'malus-law': 'polarizer',
  'birefringence': 'crystal',
  'waveplate': 'crystal',
  'polarization-state': 'generic',
  'arago-fresnel': 'generic',
  'fresnel': 'surface',
  'brewster': 'surface',
  'chromatic': 'crystal',
  'optical-rotation': 'crystal',
  'anisotropy': 'crystal',
  'mie-scattering': 'scatter',
  'rayleigh-scattering': 'scatter',
  'monte-carlo-scattering': 'scatter',
  'stokes-vector': 'generic',
  'mueller-matrix': 'generic',
  'jones-matrix': 'generic',
  'polarization-calculator': 'generic',
  'polarimetric-microscopy': 'generic',
}

// ── Mueller matrix builder ───────────────────────────────────────────────────

/**
 * Build the appropriate Mueller matrix for a station based on its element type
 * and the current parameter value (angle in degrees).
 *
 * - polarizer: linear polarizer at the given angle
 * - crystal: quarter-wave plate at the given angle (birefringent element)
 * - surface: partial polarizer via Fresnel reflection (simulated with linear polarizer)
 * - scatter: partial depolarizer (param 0..1 mapped from degrees: param/90 clamped)
 * - generic: identity (no transformation)
 */
function buildMuellerMatrix(elementType: ElementType, paramDeg: number): MuellerMatrix {
  switch (elementType) {
    case 'polarizer':
      return MuellerMatrix.linearPolarizer(paramDeg)
    case 'crystal':
      return MuellerMatrix.quarterWavePlate(paramDeg)
    case 'surface':
      // 表面反射用线性偏振器近似，模拟布儒斯特角等效果
      return MuellerMatrix.linearPolarizer(paramDeg)
    case 'scatter':
      // 散射用部分退偏器，参数从角度映射到0-1范围
      return MuellerMatrix.partialDepolarizer(Math.min(1, Math.max(0, paramDeg / 90)))
    case 'generic':
    default:
      return MuellerMatrix.identity()
  }
}

// ── Propagation ──────────────────────────────────────────────────────────────

/**
 * Propagate an initial Stokes vector through all stations, returning the
 * intermediate beam state after each station (including the initial state).
 */
function propagateChain(
  stationParams: Record<string, number>
): BeamState[] {
  const initialStokes: [number, number, number, number] = [1, 0, 0, 0]
  const beamStates: BeamState[] = [{ stokes: initialStokes, intensity: 1 }]

  let currentStokes = initialStokes

  for (const station of ALL_STATIONS) {
    const elementType = ELEMENT_TYPE_MAP[station.id] ?? 'generic'
    const paramDeg = stationParams[station.id] ?? 0
    const matrix = buildMuellerMatrix(elementType, paramDeg)
    currentStokes = matrix.apply(currentStokes)

    // S0 is the intensity
    const intensity = Math.max(0, currentStokes[0])
    beamStates.push({ stokes: [...currentStokes], intensity })
  }

  return beamStates
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Subscribes to stationParams changes in the store and recomputes the
 * beam propagation chain, writing results back to beamStates.
 */
export function useBeamPhysics() {
  useEffect(() => {
    // 初始计算
    const initialParams = useOpticalBenchStore.getState().stationParams
    useOpticalBenchStore.getState().setBeamStates(propagateChain(initialParams))

    // 订阅 stationParams 变化，使用 subscribeWithSelector 仅在参数变化时重新计算
    const unsubscribe = useOpticalBenchStore.subscribe(
      (state) => state.stationParams,
      (stationParams) => {
        const newBeamStates = propagateChain(stationParams)
        useOpticalBenchStore.getState().setBeamStates(newBeamStates)
      }
    )

    return unsubscribe
  }, [])
}
