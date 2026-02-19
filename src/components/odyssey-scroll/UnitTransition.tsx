/**
 * UnitTransition — 单元之间的全屏过渡区块
 * 用大号单元标题 + 背景径向渐变 + 滚动入场动画营造沉浸感
 */
import { motion } from 'framer-motion'

interface UnitTransitionProps {
  unitIndex: number
  title: string
  titleEn: string
  subtitle: string
  color: string
  stationCount: number
}

export function UnitTransition({
  unitIndex,
  title,
  titleEn,
  subtitle,
  color,
  stationCount,
}: UnitTransitionProps) {
  return (
    <section
      className="min-h-[80vh] w-full relative flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, ${color}0A 0%, transparent 70%)`,
      }}
    >
      <motion.div
        className="relative z-10 text-center px-6 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Unit index badge */}
        <div className="font-mono text-xs tracking-[0.3em] uppercase opacity-30 text-white mb-8">
          Unit {unitIndex}
        </div>

        {/* Thin horizontal line */}
        <div
          className="w-[60%] h-px mb-10"
          style={{ backgroundColor: color, opacity: 0.1 }}
        />

        {/* Large title */}
        <h2
          className="text-[10vw] md:text-[7vw] font-black tracking-tighter uppercase leading-none"
          style={{
            color: color,
            opacity: 0.15,
            textShadow: `0 0 80px ${color}40, 0 0 160px ${color}20`,
          }}
        >
          {titleEn}
        </h2>

        {/* Chinese subtitle */}
        <p className="text-lg md:text-xl font-light text-white/40 mt-6">
          {subtitle || title}
        </p>

        {/* Station count badge */}
        <p className="text-xs font-mono tracking-[0.3em] uppercase opacity-30 text-white mt-8">
          {stationCount} stations &middot; {stationCount} experiments
        </p>
      </motion.div>
    </section>
  )
}
