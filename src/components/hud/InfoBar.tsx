import { useGameStore } from '@/stores/gameStore'

export function InfoBar() {
  const { currentLevel, currentLevelIndex } = useGameStore()

  return (
    <div className="absolute top-5 left-5 bg-black/70 p-4 rounded-lg border border-cyan-400/30">
      <h2 className="text-sm text-cyan-400 mb-2 flex items-center gap-2">
        <span>⟡</span>
        <span>PolarCraft</span>
        {currentLevel && (
          <span className="text-gray-500 ml-2">
            关卡 {currentLevelIndex + 1}: {currentLevel.name}
          </span>
        )}
      </h2>
      <p className="text-xs text-gray-400 leading-relaxed">
        {currentLevel?.description || 'WASD 移动 | 空格 跳跃 | 左键 放置 | 右键 删除'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        R 旋转方块 | V 切换视角模式 | H 帮助
      </p>
    </div>
  )
}
