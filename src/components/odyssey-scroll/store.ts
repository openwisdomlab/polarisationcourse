import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface BeamState {
  stokes: [number, number, number, number]
  intensity: number
}

export interface OpticalBenchState {
  scrollProgress: number
  currentUnit: number
  currentStation: number
  beamStates: BeamState[]
  stationParams: Record<string, number>
  isDragging: boolean
  activeStation: string | null
  isNavExpanded: boolean

  setScrollProgress: (p: number) => void
  setCurrentPosition: (unit: number, station: number) => void
  setStationParam: (stationId: string, value: number) => void
  setBeamStates: (states: BeamState[]) => void
  setDragging: (d: boolean) => void
  setActiveStation: (id: string | null) => void
  setNavExpanded: (e: boolean) => void
}

const INITIAL_BEAM: BeamState = { stokes: [1, 0, 0, 0], intensity: 1 }

export const useOpticalBenchStore = create<OpticalBenchState>()(
  subscribeWithSelector((set) => ({
    scrollProgress: 0,
    currentUnit: 0,
    currentStation: 0,
    beamStates: [INITIAL_BEAM],
    stationParams: {},
    isDragging: false,
    activeStation: null,
    isNavExpanded: true,
    setScrollProgress: (p) => set({ scrollProgress: p }),
    setCurrentPosition: (unit, station) => set({ currentUnit: unit, currentStation: station }),
    setStationParam: (stationId, value) =>
      set((s) => ({ stationParams: { ...s.stationParams, [stationId]: value } })),
    setBeamStates: (states) => set({ beamStates: states }),
    setDragging: (d) => set({ isDragging: d }),
    setActiveStation: (id) => set({ activeStation: id }),
    setNavExpanded: (e) => set({ isNavExpanded: e }),
  }))
)
