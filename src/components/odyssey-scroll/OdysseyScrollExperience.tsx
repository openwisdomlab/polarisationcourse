import { useMemo, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { UNIT_DATA, ALL_STATIONS } from '../odyssey/odysseyData'
import { StationSection } from './StationSection'
import { ScrollHero } from './ScrollHero'
import { useOpticalBenchStore } from './store'
import type { BeamState } from './store'
import Lenis from 'lenis'

const DEFAULT_BEAM: BeamState = { stokes: [1, 0, 0, 0], intensity: 1 }

// ── Smooth Scroll Wrapper ────────────────────────────────────
function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        return () => lenis.destroy()
    }, [])

    return <div className="w-full min-h-screen bg-[#050510] text-white selection:bg-blue-500/30 overflow-x-hidden">{children}</div>
}

// ── Beam Path ────────────────────────────────────────────────
function BeamPath() {
    const { scrollYProgress } = useScroll()
    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

    // Generate gradient from unit colors
    const gradient = useMemo(() => {
        const stops = Object.values(UNIT_DATA).map((unit, i, arr) => {
            const percent = (i / (arr.length - 1)) * 100
            return `${unit.color} ${percent}%`
        }).join(', ')
        return `linear-gradient(to bottom, ${stops})`
    }, [])

    return (
        <div className="fixed left-4 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 z-0 pointer-events-none">
            {/* Background Track */}
            <div className="absolute inset-0 bg-white/5" />

            {/* Active Beam */}
            <motion.div
                className="absolute top-0 left-0 right-0 origin-top"
                style={{ scaleY, height: '100%', background: gradient }}
            />

            {/* Glow */}
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3 blur-lg origin-top"
                style={{ scaleY, height: '100%', background: gradient, opacity: 0.6 }}
            />

            {/* Head of the Beam (The Photon) */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-4 h-12 rounded-full bg-white blur-md"
                style={{ top: useTransform(scrollYProgress, (v) => `${v * 100}%`), opacity: useTransform(scrollYProgress, [0, 0.05], [0, 1]) }}
            />
        </div>
    )
}

// ── Main Experience ──────────────────────────────────────────
export function OdysseyScrollExperience() {
    const { beamStates, stationParams, setStationParam } = useOpticalBenchStore()

    // 全局索引查找表：station.id → global index
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

    return (
        <SmoothScroll>
            <ScrollHero />
            <BeamPath />

            <div className="relative z-10 pb-40">
                {Object.values(UNIT_DATA).map((unit) => (
                    <div key={unit.id} className="relative">
                        {/* Unit Header (Sticky Title) */}
                        <div className="h-screen sticky top-0 md:top-0 z-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ margin: "-20%" }}
                                transition={{ duration: 1 }}
                                className="text-[12vw] md:text-[8vw] font-black tracking-tighter uppercase text-center leading-none blur-sm md:blur-0"
                                style={{
                                    color: unit.color,
                                    textShadow: `0 0 100px ${unit.color}40`
                                }}
                            >
                                {unit.titleEn}
                            </motion.h2>
                        </div>

                        {/* Stations */}
                        <div className="space-y-32 md:space-y-48 relative z-10 -mt-[80vh] md:-mt-[70vh] mb-[20vh]">
                            {unit.stations.map((station) => {
                                const gi = globalIndexMap.get(station.id) ?? 0
                                const inputBeam = beamStates[gi] ?? DEFAULT_BEAM
                                const outputBeam = beamStates[gi + 1] ?? DEFAULT_BEAM
                                return (
                                    <StationSection
                                        key={station.id}
                                        station={station}
                                        unitColor={unit.color}
                                        globalIndex={gi}
                                        inputBeam={inputBeam}
                                        outputBeam={outputBeam}
                                        paramValue={stationParams[station.id] ?? 0}
                                        onParamChange={handleParamChange(station.id)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / End */}
            <footer className="h-[50vh] flex flex-col items-center justify-center text-white/30 gap-6 relative z-10 bg-gradient-to-t from-[#050510] to-transparent">
                <div className="w-px h-24 bg-gradient-to-t from-transparent via-white/20 to-transparent" />
                <p className="tracking-[0.5em] uppercase text-xs font-mono">End of Transmission</p>
            </footer>
        </SmoothScroll>
    )
}
