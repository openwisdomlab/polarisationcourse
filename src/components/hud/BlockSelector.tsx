import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/stores/gameStore'
import { BlockType } from '@/core/types'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

// 方块分类
const BASIC_BLOCKS: Array<{
  type: BlockType
  key: string
  icon: string
  labelKey: string
  color: string
}> = [
    { type: 'emitter', key: '1', icon: '💡', labelKey: 'game.blocks.emitter', color: 'orange' },
    { type: 'polarizer', key: '2', icon: '▤', labelKey: 'game.blocks.polarizer', color: 'cyan' },
    { type: 'rotator', key: '3', icon: '↻', labelKey: 'game.blocks.rotator', color: 'purple' },
    { type: 'splitter', key: '4', icon: '◇', labelKey: 'game.blocks.splitter', color: 'cyan' },
    { type: 'sensor', key: '5', icon: '◎', labelKey: 'game.blocks.sensor', color: 'green' },
    { type: 'mirror', key: '6', icon: '▯', labelKey: 'game.blocks.mirror', color: 'blue' },
    { type: 'solid', key: '7', icon: '■', labelKey: 'game.blocks.solid', color: 'slate' },
  ]

const ADVANCED_BLOCKS: Array<{
  type: BlockType
  key: string
  icon: string
  labelKey: string
  color: string
}> = [
    { type: 'prism', key: '8', icon: '△', labelKey: 'game.blocks.prism', color: 'rainbow' },
    { type: 'lens', key: '9', icon: '⬭', labelKey: 'game.blocks.lens', color: 'blue' },
    { type: 'beamSplitter', key: '0', icon: '⊠', labelKey: 'game.blocks.beamSplitter', color: 'cyan' },
    { type: 'quarterWave', key: 'Q', icon: '¼', labelKey: 'game.blocks.quarterWave', color: 'purple' },
    { type: 'halfWave', key: 'W', icon: '½', labelKey: 'game.blocks.halfWave', color: 'pink' },
    { type: 'absorber', key: 'E', icon: '▣', labelKey: 'game.blocks.absorber', color: 'gray' },
    { type: 'phaseShifter', key: 'F', icon: '◉', labelKey: 'game.blocks.phaseShifter', color: 'teal' },
    { type: 'portal', key: 'P', icon: '⊛', labelKey: 'game.blocks.portal', color: 'emerald' },
  ]

// 颜色映射 - Updated to use semantic tokens where possible
const COLOR_CLASSES: Record<string, { border: string; shadow: string }> = {
  orange: { border: 'border-polarization-45', shadow: 'shadow-[0_0_15px_rgba(255,170,0,0.5)]' },
  cyan: { border: 'border-laser', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]' },
  purple: { border: 'border-purple-400', shadow: 'shadow-[0_0_15px_rgba(180,100,255,0.5)]' },
  green: { border: 'border-polarization-90', shadow: 'shadow-[0_0_15px_rgba(68,255,68,0.5)]' },
  blue: { border: 'border-polarization-135', shadow: 'shadow-[0_0_15px_rgba(68,68,255,0.5)]' },
  slate: { border: 'border-slate-400', shadow: 'shadow-[0_0_10px_rgba(150,150,180,0.3)]' },
  rainbow: { border: 'border-polarization-0', shadow: 'shadow-[0_0_15px_rgba(255,68,68,0.5)]' },
  pink: { border: 'border-pink-400', shadow: 'shadow-[0_0_15px_rgba(255,100,200,0.5)]' },
  gray: { border: 'border-gray-400', shadow: 'shadow-[0_0_10px_rgba(150,150,150,0.3)]' },
  teal: { border: 'border-teal-400', shadow: 'shadow-[0_0_15px_rgba(100,220,200,0.5)]' },
  emerald: { border: 'border-emerald-400', shadow: 'shadow-[0_0_15px_rgba(100,255,180,0.5)]' },
}

export function BlockSelector() {
  const { t } = useTranslation()
  const { selectedBlockType, setSelectedBlockType } = useGameStore()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { isMobile, isTablet } = useIsMobile()

  const currentBlocks = showAdvanced ? ADVANCED_BLOCKS : BASIC_BLOCKS

  // On mobile, show fewer blocks per row with scrolling
  const isCompact = isMobile || isTablet

  return (
    <div className={cn(
      "absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-300",
      isCompact ? "bottom-2 w-[calc(100%-16px)] max-w-md" : "bottom-5"
    )}>
      {/* 展开/收起按钮 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        aria-label={showAdvanced ? t('game.showBasicBlocks') : t('game.showAdvancedBlocks')}
        aria-expanded={showAdvanced}
        className={cn(
          "h-7 text-xs font-bold transition-all backdrop-blur-md",
          "bg-void-panel/80 border border-void-border text-muted-foreground",
          "hover:bg-void-panel hover:border-laser hover:text-laser",
          "flex items-center gap-1",
          isCompact && "text-xs px-2 min-h-[44px] min-w-[44px]"
        )}
      >
        {showAdvanced ? (
          <>
            <ChevronDown className="w-3 h-3" />
            <span>{t('common.back')}: 1-7</span>
          </>
        ) : (
          <>
            <ChevronUp className="w-3 h-3" />
            <span>More: 8-0,Q,W,E,F,P</span>
          </>
        )}
      </Button>

      {/* 方块选择器 - 移动端可横向滚动 */}
      <motion.div
        layout
        className={cn(
          "bg-void-panel/95 rounded-xl border border-laser-dim/30 backdrop-blur-xl shadow-2xl shadow-black/50",
          isCompact
            ? "flex gap-1 p-1.5 overflow-x-auto max-w-full scrollbar-hide"
            : "flex gap-1.5 p-2.5"
        )}
      >
        <AnimatePresence mode='popLayout'>
          {currentBlocks.map(({ type, key, icon, labelKey, color }) => {
            const colors = COLOR_CLASSES[color] || COLOR_CLASSES.cyan
            const isSelected = selectedBlockType === type

            return (
              <motion.button
                layout
                key={type}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBlockType(type)}
                aria-label={`${t(labelKey)} (${key})`}
                aria-pressed={isSelected}
                className={cn(
                  "relative flex flex-col items-center justify-center flex-shrink-0 rounded-lg",
                  "bg-void-panel/50 border-2 border-void-border/50 transition-colors duration-200",
                  "hover:bg-void-panel hover:border-laser/50",
                  isSelected && [colors.border, colors.shadow, "bg-void-panel z-10 scale-105"],
                  isCompact ? "min-h-[44px] min-w-[44px] w-11 h-11" : "w-12 h-12"
                )}
              >
                {!isCompact && (
                  <span className="absolute top-0.5 left-1 text-[8px] text-muted-foreground font-mono">
                    {key}
                  </span>
                )}
                <span className={cn("mb-0.5", isCompact ? "text-base" : "text-lg")}>{icon}</span>
                {!isCompact && (
                  <span className="text-[7px] text-muted-foreground truncate max-w-[40px]">
                    {t(labelKey)}
                  </span>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* 移动端显示选中方块名称 */}
      {isCompact && selectedBlockType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-laser bg-void-panel px-3 py-1 rounded-full border border-laser/20"
        >
          {t(`game.blocks.${selectedBlockType}`)}
        </motion.div>
      )}
    </div>
  )
}
