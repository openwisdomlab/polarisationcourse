/**
 * OdysseyScrollExperience.tsx — 光学实验台主体验
 *
 * 层级:
 *   z-0  ScrollBackground (固定网格 + 粒子 + 氛围)
 *   z-1  BeamPath (垂直光束总线)
 *   z-10 内容层 (Hero + Units + Stations + Transitions)
 *   z-50 SideNav (固定右侧导航)
 */
import { useMemo, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { UNIT_DATA, ALL_STATIONS } from '../odyssey/odysseyData'
import { StationSection } from './StationSection'
import { ScrollHero } from './ScrollHero'
import { ScrollBackground } from './ScrollBackground'
import { UnitTransition } from './UnitTransition'
import { BeamConnector } from './BeamConnector'
import { SideNav } from './SideNav'
import { useOpticalBenchStore } from './store'
import { useBeamPhysics } from './hooks/useBeamPhysics'
import type { BeamState } from './store'
import Lenis from 'lenis'

const DEFAULT_BEAM: BeamState = { stokes: [1, 0, 0, 0], intensity: 1 }

// ── Smooth Scroll ────────────────────────────────────────────
function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#050510] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {children}
    </div>
  )
}

// ── Vertical Beam Path (全页光束总线) ────────────────────────
function BeamPath() {
  const { scrollYProgress } = useScroll()
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  const gradient = useMemo(() => {
    const stops = Object.values(UNIT_DATA)
      .map((unit, i, arr) => {
        const percent = (i / (arr.length - 1)) * 100
        return `${unit.color} ${percent}%`
      })
      .join(', ')
    return `linear-gradient(to bottom, ${stops})`
  }, [])

  return (
    <div className="fixed left-4 md:left-8 top-0 bottom-0 w-0.5 z-[1] pointer-events-none">
      {/* Track */}
      <div className="absolute inset-0 bg-white/5" />
      {/* Active beam */}
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top"
        style={{ scaleY, height: '100%', background: gradient }}
      />
      {/* Glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2 blur-md origin-top"
        style={{ scaleY, height: '100%', background: gradient, opacity: 0.5 }}
      />
      {/* Photon head */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-3 h-8 rounded-full bg-white blur-sm"
        style={{
          top: useTransform(scrollYProgress, (v) => `${v * 100}%`),
          opacity: useTransform(scrollYProgress, [0, 0.03], [0, 1]),
        }}
      />
    </div>
  )
}

// ── Main Experience ──────────────────────────────────────────
export function OdysseyScrollExperience() {
  const { beamStates, stationParams, setStationParam } = useOpticalBenchStore()

  // 初始化物理链
  useBeamPhysics()

  // 全局索引查找表
  const globalIndexMap = useMemo(() => {
    const map = new Map<string, number>()
    ALL_STATIONS.forEach((s, i) => map.set(s.id, i))
    return map
  }, [])

  const handleParamChange = useCallback(
    (stationId: string) => (value: number) => {
      setStationParam(stationId, value)
    },
    [setStationParam],
  )

  const unitEntries = useMemo(() => Object.values(UNIT_DATA), [])

  return (
    <SmoothScroll>
      {/* 固定背景层 */}
      <ScrollBackground />
      <BeamPath />

      {/* 首屏 */}
      <ScrollHero />

      {/* 内容层 */}
      <div className="relative z-10 pb-40">
        {unitEntries.map((unit, unitIdx) => (
          <div key={unit.id} id={`unit-${unitIdx}`}>
            {/* Unit 过渡标题 */}
            <UnitTransition
              unitIndex={unitIdx}
              title={unit.title}
              titleEn={unit.titleEn}
              subtitle={unit.subtitleEn}
              color={unit.color}
              stationCount={unit.stations.length}
            />

            {/* Stations */}
            <div className="space-y-8 md:space-y-12 relative">
              {unit.stations.map((station, stationIdx) => {
                const gi = globalIndexMap.get(station.id) ?? 0
                const inputBeam = beamStates[gi] ?? DEFAULT_BEAM
                const outputBeam = beamStates[gi + 1] ?? DEFAULT_BEAM

                return (
                  <div key={station.id}>
                    <StationSection
                      station={station}
                      unitColor={unit.color}
                      globalIndex={gi}
                      inputBeam={inputBeam}
                      outputBeam={outputBeam}
                      paramValue={stationParams[station.id] ?? 0}
                      onParamChange={handleParamChange(station.id)}
                    />

                    {/* 站间光束连接器 */}
                    {stationIdx < unit.stations.length - 1 && (
                      <BeamConnector color={unit.color} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 结尾 */}
      <footer className="h-[40vh] flex flex-col items-center justify-center text-white/30 gap-6 relative z-10">
        <div className="w-px h-20 bg-gradient-to-t from-transparent via-white/15 to-transparent" />
        <p className="tracking-[0.4em] uppercase text-[10px] font-mono">
          End of Transmission
        </p>
      </footer>

      {/* 固定导航 */}
      <SideNav />
    </SmoothScroll>
  )
}
