/**
 * StationSection - 完整的光学工作站区块
 * 组合 BeamPathBar + 标题 + 演示组件 + 渐进式理论展示 + 标尺
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { DemoStationConfig } from '../odyssey/odysseyData'
import type { UnitId } from '@/stores/odysseyStore'
import type { BeamState } from './store'
import { BeamPathBar } from './BeamPathBar'
import { OdysseyDemoEmbed } from './OdysseyDemoEmbed'
import { TheoryBlock } from './TheoryBlock'

// 根据 unitId 推导光学元件类型
const UNIT_ELEMENT_TYPE: Record<UnitId, 'polarizer' | 'crystal' | 'surface' | 'scatter' | 'generic'> = {
  0: 'polarizer',
  1: 'crystal',
  2: 'surface',
  3: 'crystal',
  4: 'scatter',
  5: 'generic',
}

// ── KaTeX formula renderer (lazy-loaded) ─────────────────────
function KaTeXBlock({ formula, color }: { formula: string; color: string }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    import('katex').then((k) => {
      try {
        setHtml(
          k.default.renderToString(formula, {
            throwOnError: false,
            displayMode: true,
          })
        )
      } catch {
        setHtml(formula)
      }
    })
  }, [formula])

  return (
    <div
      className="pl-6 py-4 border-l-2"
      style={{ borderColor: color }}
    >
      <div
        style={{ color }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// ── Scale ruler decoration ───────────────────────────────────
function ScaleRuler({ distance }: { distance: number }) {
  return (
    <div className="flex items-center gap-3 border-t border-white/5 pt-3 mt-8 opacity-[0.08]">
      {/* Tick marks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-px h-2 bg-white" />
      ))}
      <span className="font-mono text-[9px] text-white tracking-wider">
        Z = {distance}mm
      </span>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={`r${i}`} className="w-px h-2 bg-white" />
      ))}
    </div>
  )
}

// ── Props ────────────────────────────────────────────────────
interface StationSectionProps {
  station: DemoStationConfig
  unitColor: string
  globalIndex: number
  inputBeam: BeamState
  outputBeam: BeamState
  paramValue: number
  onParamChange: (value: number) => void
}

// ── Main Component ──────────────────────────────────────────
export function StationSection({
  station,
  unitColor,
  globalIndex,
  inputBeam,
  outputBeam,
  paramValue,
  onParamChange,
}: StationSectionProps) {
  const stationNumber = String(globalIndex + 1).padStart(2, '0')
  const zDistance = globalIndex * 50 + 100
  const elementType = UNIT_ELEMENT_TYPE[station.unitId] ?? 'generic'

  return (
    <section className="w-full py-16 md:py-24">
      {/* Beam Path Bar — full width */}
      <BeamPathBar
        inputBeam={inputBeam}
        outputBeam={outputBeam}
        elementType={elementType}
        color={unitColor}
        paramValue={paramValue}
        onParamChange={onParamChange}
        stationId={station.id}
      />

      {/* Content container */}
      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        {/* Station Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-3"
        >
          {/* Station index + unit label */}
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 text-white">
            <span>STATION {stationNumber}</span>
            <span className="mx-3">&middot;</span>
            <span>Unit {station.unitId}</span>
          </div>

          {/* English title */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            {station.titleEn}
          </h2>

          {/* Chinese title */}
          <h3 className="text-lg md:text-xl font-light text-white/40">
            {station.title}
          </h3>
        </motion.div>

        {/* KaTeX Formula */}
        {station.theory.formula && (
          <KaTeXBlock formula={station.theory.formula} color={unitColor} />
        )}

        {/* Demo Component */}
        <OdysseyDemoEmbed
          component={station.component}
          color={unitColor}
          difficultyLevel="foundation"
        />

        {/* Theory Block */}
        <TheoryBlock theory={station.theory} color={unitColor} />

        {/* Scale Ruler */}
        <ScaleRuler distance={zDistance} />
      </div>
    </section>
  )
}
