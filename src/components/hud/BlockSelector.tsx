import { useGameStore } from '@/stores/gameStore'
import { BlockType } from '@/core/types'
import { cn } from '@/lib/utils'

const BLOCK_TYPES: Array<{
  type: BlockType
  key: string
  icon: string
  label: string
}> = [
  { type: 'emitter', key: '1', icon: '💡', label: '光源' },
  { type: 'polarizer', key: '2', icon: '▤', label: '偏振片' },
  { type: 'rotator', key: '3', icon: '↻', label: '波片' },
  { type: 'splitter', key: '4', icon: '◇', label: '方解石' },
  { type: 'sensor', key: '5', icon: '◎', label: '感应器' },
  { type: 'mirror', key: '6', icon: '▯', label: '反射镜' },
  { type: 'solid', key: '7', icon: '■', label: '实体块' },
]

export function BlockSelector() {
  const { selectedBlockType, setSelectedBlockType } = useGameStore()

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 p-3 rounded-xl border border-cyan-400/30">
      {BLOCK_TYPES.map(({ type, key, icon, label }) => (
        <button
          key={type}
          onClick={() => setSelectedBlockType(type)}
          className={cn(
            "relative w-14 h-14 flex flex-col items-center justify-center",
            "bg-slate-700/60 border-2 border-slate-600/50 rounded-lg",
            "transition-all duration-200 cursor-pointer",
            "hover:border-cyan-400/80 hover:bg-slate-600/80",
            selectedBlockType === type && "border-cyan-400 shadow-[0_0_15px_rgba(100,200,255,0.5)]"
          )}
        >
          <span className="absolute top-0.5 left-1 text-[10px] text-gray-500">
            {key}
          </span>
          <span className="text-2xl mb-0.5">{icon}</span>
          <span className="text-[9px] text-gray-400">{label}</span>
        </button>
      ))}
    </div>
  )
}
