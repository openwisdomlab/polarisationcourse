import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/stores/gameStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Target, ChevronRight } from 'lucide-react'

interface SensorStatus {
  position: { x: number; y: number; z: number }
  activated: boolean
}

export function LevelGoal() {
  const { t } = useTranslation()
  const { world, currentLevel, isLevelComplete, nextLevel } = useGameStore()
  const [sensors, setSensors] = useState<SensorStatus[]>([])

  useEffect(() => {
    if (!world || !currentLevel?.goal?.sensorPositions) return

    const sensorPositions = currentLevel.goal.sensorPositions

    const updateSensors = () => {
      const sensorStatuses = sensorPositions.map(pos => {
        const block = world.getBlock(pos.x, pos.y, pos.z)
        return {
          position: pos,
          activated: block?.type === 'sensor' && block.activated,
        }
      })
      setSensors(sensorStatuses)
    }

    updateSensors()
    world.addListener(updateSensors)

    return () => {
      world.removeListener(updateSensors)
    }
  }, [world, currentLevel])

  if (!currentLevel?.goal?.sensorPositions) return null

  const activatedCount = sensors.filter(s => s.activated).length
  const totalCount = sensors.length
  const progress = (activatedCount / totalCount) * 100

  return (
    <div className="bg-void-panel border border-void-border/50 p-4 rounded-lg min-w-[200px] backdrop-blur-md shadow-lg shadow-black/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-laser/10 text-laser">
          <Target className="w-4 h-4" />
        </div>
        <h4 className="text-laser font-semibold text-xs uppercase tracking-wider">
          {t('game.levelGoal')}
        </h4>
      </div>

      <div className="space-y-2">
        {sensors.map((sensor, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              color: sensor.activated ? 'var(--color-polarization-90)' : 'hsl(var(--muted-foreground))',
              backgroundColor: sensor.activated ? 'rgba(68, 255, 68, 0.1)' : 'transparent'
            }}
            className={cn(
              "flex items-center gap-3 p-2 rounded-md transition-colors text-xs font-medium border border-transparent",
              sensor.activated && "border-polarization-90/20"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                sensor.activated
                  ? "bg-polarization-90 border-polarization-90 text-black scale-110"
                  : "border-muted-foreground/30 bg-black/20"
              )}
            >
              {sensor.activated && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>{t('game.sensor')} {index + 1}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">
          <span>{t('game.progress')}</span>
          <span className={cn(activatedCount === totalCount && "text-polarization-90")}>
            {activatedCount}/{totalCount}
          </span>
        </div>
        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-laser to-polarization-90"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {isLevelComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-polarization-90/30">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-polarization-90 text-sm font-bold mb-3 flex items-center gap-2"
              >
                <span>🎉</span> {t('game.levelComplete')}
              </motion.div>
              <Button
                variant="game"
                size="sm"
                onClick={nextLevel}
                className="w-full text-xs font-bold gap-2 animate-pulse-slow"
              >
                {t('game.nextLevel')} <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
