import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Zap, Scan, AlertTriangle, CheckCircle2 } from 'lucide-react'

// ==========================================
// Math Helpers
// ==========================================
const toRad = (deg: number) => (deg * Math.PI) / 180
const normalize = (angle: number) => ((angle % 180) + 180) % 180

// ==========================================
// 3D Volumetric Components
// ==========================================

// 1. Light Source Generator
const LightGenerator = () => (
  <div className="relative w-20 h-20 group transform-style-3d">
    {/* Core */}
    <div className="absolute inset-0 bg-yellow-400/50 rounded-full blur-[20px] animate-pulse-slow" />
    <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-amber-600 rounded-full border-4 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.6)] flex items-center justify-center">
      <Zap className="w-8 h-8 text-yellow-950 fill-yellow-950 animate-pulse" />
    </div>
    {/* Housing */}
    <div className="absolute -inset-4 border-2 border-dashed border-yellow-600/30 rounded-full animate-[spin_10s_linear_infinite]" />
  </div>
)

// 2. Volumetric Beam Segment
// Represents the light traveling between components
const BeamSegment = ({
  intensity = 1,
  color = "yellow",
  rotate = 0,
  type = "unpolarized", // unpolarized | polarized | blocked
  label
}: {
  intensity?: number
  color?: "yellow" | "cyan" | "purple"
  rotate?: number
  type?: "unpolarized" | "polarized" | "blocked"
  label?: string
}) => {
  const colorClass = color === "yellow" ? "bg-yellow-400" : color === "cyan" ? "bg-cyan-400" : "bg-purple-500"
  const shadowClass = color === "yellow" ? "shadow-yellow-400" : color === "cyan" ? "shadow-cyan-400" : "shadow-purple-500"

  return (
    <div className="relative w-32 h-16 flex items-center justify-center transform-style-3d group">

      {/* Label */}
      {label && (
        <div className="absolute -top-12 text-[10px] uppercase font-mono text-gray-500 opacity-60 tracking-widest text-center w-full">
          {label}
        </div>
      )}

      {/* Beam Visualization */}
      {type === "unpolarized" && (
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d animate-[spin_3s_linear_infinite]">
          {/* Starburst Shape for Unpolarized */}
          <div className={cn("absolute w-full h-1 opacity-40 blur-sm", colorClass)} />
          <div className={cn("absolute w-full h-1 opacity-40 blur-sm rotate-45", colorClass)} />
          <div className={cn("absolute w-full h-1 opacity-40 blur-sm rotate-90", colorClass)} />
          <div className={cn("absolute w-full h-1 opacity-40 blur-sm -rotate-45", colorClass)} />
        </div>
      )}

      {type === "polarized" && (
        <motion.div
          className="relative w-full flex items-center justify-center transform-style-3d"
          animate={{ rotateX: rotate }} // Physical rotation of the ribbon!
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Main Ribbon - The "Blade" of Light */}
          <div
            className={cn("w-full h-1 rounded-full opacity-80 shadow-[0_0_15px_currentColor]", colorClass, shadowClass)}
            style={{ opacity: 0.3 + intensity * 0.7 }}
          />
          {/* Cross-section Glow */}
          <div
            className={cn("absolute left-0 w-2 h-8 blur-md opacity-50", colorClass)}
            style={{ transform: 'rotateY(90deg)' }}
          />
        </motion.div>
      )}

      {type === "blocked" && (
        <div className="w-full h-1 bg-gray-800 opacity-20 border-t border-b border-gray-700/50" />
      )}
    </div>
  )
}

// 3. Physical Component Disc (Polarizer / Analyzer)
const OpticalDisc = ({
  angle,
  setAngle,
  label,
  color = "cyan",
  fixed = false
}: {
  angle: number
  setAngle?: (val: number) => void
  label: string
  color?: "cyan" | "purple"
  fixed?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleWheel = (e: React.WheelEvent) => {
    if (fixed || !setAngle) return
    e.stopPropagation()
    setAngle(angle + e.deltaY * 0.2)
  }

  return (
    <div
      className="relative w-32 h-40 flex flex-col items-center justify-center group perspective-500"
      ref={containerRef}
      onWheel={handleWheel}
    >
      {/* Label HUD */}
      <div className="absolute -top-10 z-20 flex flex-col items-center">
        <span className={cn("text-[9px] font-bold uppercase tracking-widest mb-1", color === "cyan" ? "text-cyan-400" : "text-purple-400")}>
          {label}
        </span>
        <div className="text-lg font-mono font-bold text-white bg-black/60 px-2 rounded border border-white/10 backdrop-blur-md">
          {Math.round(normalize(angle))}°
        </div>
      </div>

      {/* The Disc */}
      <motion.div
        className={cn(
          "w-28 h-28 relative rounded-full border-[6px] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center transform-style-3d backdrop-blur-[2px]",
          !fixed ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-90",
          color === "cyan"
            ? "border-cyan-500/40 bg-cyan-900/10 shadow-cyan-500/10"
            : "border-purple-500/40 bg-purple-900/10 shadow-purple-500/10"
        )}
        drag={!fixed ? "x" : false} // Allow horizontal drag to rotate
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDrag={(_, info) => { if (setAngle) setAngle(angle + info.delta.x * 0.5) }}
        animate={{ rotateZ: angle }}
        style={{ rotateY: 20 }} // Isometric tilt
      >
        {/* Grating Lines */}
        <div className="absolute inset-2 rounded-full overflow-hidden flex items-center justify-center opacity-70">
          {/* Transmission Slot */}
          <div className={cn("w-full h-[6px] blur-[1px]", color === "cyan" ? "bg-cyan-400/30" : "bg-purple-400/30")} />
          {/* Grid Lines (Perpendicular to slot) */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn("absolute w-[1px] h-full", color === "cyan" ? "bg-cyan-500/20" : "bg-purple-500/20")}
              style={{ left: `${20 + i * 10}%` }}
            />
          ))}
        </div>

        {/* Glossy Reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Stand */}
      <div className="absolute bottom-2 w-16 h-4 bg-gray-800 rounded-full blur-md opacity-50 z-[-1]" />
    </div>
  )
}

// 4. Data Crystal (Birefringent Element)
const DataCrystal = ({ active }: { active: boolean }) => (
  <div className="relative w-24 h-32 flex items-center justify-center transform-style-3d group">
    {/* Crystal Block */}
    <div className={cn(
      "w-16 h-20 border border-white/20 bg-white/5 backdrop-blur-[2px] rounded-lg relative overflow-hidden transition-all duration-500",
      active ? "shadow-[0_0_30px_rgba(168,85,247,0.2)]" : "opacity-50 grayscale"
    )}>
      {/* Internal Data Structure */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Scan className={cn("w-8 h-8 transition-all duration-500", active ? "text-purple-400 rotate-45" : "text-gray-500")} />
      </div>
      {/* Label */}
      <div className="absolute top-1 left-2 text-[6px] font-mono text-white/40">MEMORY CORE</div>
    </div>

    {/* Label */}
    <div className="absolute -bottom-6 text-[9px] uppercase tracking-widest text-gray-500">
      Data Crystal
    </div>
  </div>
)

export function PasswordLock({ onUnlock }: { onUnlock: () => void; correctPassword?: string }) {
  const { i18n } = useTranslation()
  const isZh = i18n.language.startsWith('zh')

  // State
  // P1 Angle (Polarizer) - Fixed Vertical (90 deg)
  const p1Angle = 90
  // P2 Angle (Analyzer) - User controlled
  const [p2Angle, setP2Angle] = useState(10) // Start misaligned

  // Physics Calculation
  // 1. Glare (Background Noise)
  // Intensity = cos^2(p2 - p1)
  // When P2 = P1 (Aligned), Glare is Max (1.0). When P2 = P1 + 90 (Crossed), Glare is Min (0.0).
  const angleDiff = Math.abs(normalize(p2Angle) - p1Angle)
  const radians = toRad(angleDiff)
  const glare = Math.pow(Math.cos(radians), 2)

  // 2. Data Signal (Birefringent Rotation)
  // Simulating a wave plate at 45 deg that rotates polarization.
  // Ideally, when Crossed (P1 perp P2), the rotated component passes through.
  // Simplification: Signal strength peaks when Crossed (90 deg diff).
  const signal = Math.pow(Math.sin(radians), 2)

  // 3. Contrast (S/N Ratio)
  // Contrast = Signal - Glare
  const contrast = signal - glare
  const isSolved = contrast > 0.85 // Strict threshold
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleUnlock = () => {
    if (isSolved) {
      setIsUnlocked(true)
      localStorage.setItem('polarcraft_unlocked', 'true')
      setTimeout(onUnlock, 3000)
    }
  }

  // Visual Angles for Ribbons
  // Ribbon 3: Modified by Crystal. It rotates the polarization by some amount (e.g. 45 deg).
  // So the "Signal" ribbon is at P1 + 45.
  const ribbon3SignalAngle = p1Angle + 45

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center font-sans text-gray-200 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-black z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-0" />

      {/* Header HUD */}
      <div className="relative z-10 w-full max-w-5xl px-8 flex justify-between items-end mb-8 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-3 text-red-500 mb-1">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <h1 className="text-sm font-bold tracking-[0.2em] uppercase">
              {isZh ? '数据恢复模式' : 'DATA RECOVERY MODE'}
            </h1>
          </div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight">
            {isZh ? '光存储晶体读取器' : 'OPTICAL CRYSTAL READER'}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</div>
          <div className={cn("font-mono font-bold", isUnlocked ? "text-emerald-500" : "text-amber-500")}>
            {isUnlocked ? "RECOVERED" : "CORRUPTED"}
          </div>
        </div>
      </div>

      {/* Main Optical Bench (Volumetric Scene) */}
      <div className="relative z-10 w-full max-w-7xl h-[350px] flex items-center justify-center gap-0 lg:gap-4 perspective-[1000px]">

        {/* Rail Grounding */}
        <div className="absolute top-1/2 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent z-0" />

        {/* 1. Source */}
        <div className="flex flex-col items-center">
          <LightGenerator />
        </div>

        {/* Beam 1: Unpolarized */}
        <BeamSegment type="unpolarized" color="yellow" label="Noise" />

        {/* 2. Polarizer (Filter P1) */}
        <OpticalDisc angle={p1Angle} label="P1 Filter" color="cyan" fixed />

        {/* Beam 2: Linear Polarized (Vertical) */}
        <BeamSegment type="polarized" color="cyan" rotate={90} intensity={1} label="Polarized" />

        {/* 3. Data Crystal */}
        <DataCrystal active={isSolved} />

        {/* Beam 3: Mixed (Glare + Signal) */}
        {/* Visual trick: Show how the ribbon twists if we solve it */}
        <BeamSegment
          type="polarized"
          color={contrast > 0.5 ? "purple" : "cyan"}
          rotate={contrast > 0.5 ? ribbon3SignalAngle : p1Angle} // Visual twist
          intensity={0.8}
          label="Modulated"
        />

        {/* 4. Analyzer (User Control) */}
        <OpticalDisc
          angle={p2Angle}
          setAngle={setP2Angle}
          label={isZh ? "检偏控制 (Analyzer)" : "Analyzer Control"}
          color="purple"
          fixed={isUnlocked}
        />

        {/* 5. Result: The Console Screen */}
        <div className="relative ml-6 perspective-1000 group">
          <div className="w-64 h-48 bg-black border-4 border-gray-800 rounded-lg shadow-2xl relative overflow-hidden transform rotate-y-[-10deg] transition-transform group-hover:rotate-y-0">
            {/* Internal Screen Display */}
            <div className="absolute inset-0 p-4 font-mono flex flex-col justify-between">

              {/* Glare Layer (Overlays everything) */}
              <div
                className="absolute inset-0 bg-white transition-opacity duration-100 pointer-events-none mix-blend-screen"
                style={{ opacity: glare * 0.95 }} // Max glare washes out everything
              />

              {/* Signal Layer (The Data) */}
              <div
                className="flex-1 flex items-center justify-center transition-all duration-300"
                style={{
                  opacity: signal,
                  filter: `blur(${(1 - contrast) * 10}px)`,
                  transform: `scale(${0.8 + contrast * 0.2})`
                }}
              >
                <div className="text-center">
                  <div className="text-purple-400 text-sm mb-2 opacity-70">CRYSTAL_DATA_01</div>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                    POLAR
                  </div>
                  <div className="text-[10px] text-emerald-500 mt-2 tracking-[0.5em]">DECRYPTED</div>
                </div>
              </div>

              {/* HUD Overlay */}
              <div className="flex justify-between text-[9px] text-gray-500 relative z-20">
                <div>GLARE: {Math.round(glare * 100)}%</div>
                <div>SNR: {Math.round(contrast * 10)}dB</div>
              </div>
            </div>

            {/* Screen Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-4 w-full animate-[scan_2s_linear_infinite] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Narrative Controls */}
      <div className="relative z-10 w-full max-w-lg mt-12 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {isUnlocked ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 bg-emerald-900/10 border border-emerald-500/30 p-8 rounded-xl backdrop-blur-md"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">{isZh ? '数据恢复完成' : 'RECOVERY COMPLETE'}</h3>
                <p className="text-sm text-gray-400 font-mono">
                  {isZh ? '正在载入主系统...' : 'Loading Main System...'}
                </p>
              </div>
              {/* Educational Summary */}
              <div className="text-[10px] text-emerald-400/60 font-mono mt-2 bg-black/40 px-3 py-1 rounded">
                TECHNIQUE: CROSS-POLARIZATION FILTRATION
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {/* Narrative Hint */}
              <div className="flex gap-4 items-start max-w-md bg-gray-900/50 p-4 rounded-lg border-l-2 border-amber-500">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-300 leading-relaxed font-mono">
                  {isZh
                    ? `警告：强烈背景眩光掩盖了数据信号。请调整 <检偏器> 至 "正交位置" (90°) 以过滤眩光。`
                    : `ALERT: Intense background glare is masking the data signal. Adjust <Analyzer> to "Crossed Position" (90°) to filter glare.`}
                </div>
              </div>

              {/* Unlock Button */}
              <button
                onClick={handleUnlock}
                disabled={!isSolved}
                className={cn(
                  "px-10 py-3 rounded uppercase font-bold tracking-[0.2em] transition-all duration-300",
                  isSolved
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_30px_rgba(147,51,234,0.5)] scale-105"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                )}
              >
                {isZh ? '提取数据' : 'EXTRACT DATA'}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}

export default PasswordLock
