import { useGameStore } from '@/stores/gameStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const POLARIZATION_COLORS = [
  { angle: '0°', color: '#ff4444', label: '水平' },
  { angle: '45°', color: '#ffaa00', label: '斜向' },
  { angle: '90°', color: '#44ff44', label: '垂直' },
  { angle: '135°', color: '#4444ff', label: '斜向' },
]

export function HelpPanel() {
  const { showHelp, toggleHelp } = useGameStore()

  return (
    <Dialog open={showHelp} onOpenChange={toggleHelp}>
      <DialogContent className="max-w-2xl bg-slate-900/95 border-cyan-400/30 text-gray-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400">
            ⟡ PolarCraft 游戏指南
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* Basic Controls */}
          <section>
            <h3 className="text-white font-semibold mb-2">🎮 基本操作</h3>
            <ul className="space-y-1 text-gray-400">
              <li><strong className="text-gray-200">WASD</strong> - 移动（第一人称）/ 平移视角（其他模式）</li>
              <li><strong className="text-gray-200">空格</strong> - 跳跃（第一人称模式）</li>
              <li><strong className="text-gray-200">鼠标</strong> - 视角控制（第一人称）/ 选择方块（其他模式）</li>
              <li><strong className="text-gray-200">左键</strong> - 放置方块</li>
              <li><strong className="text-gray-200">右键</strong> - 删除方块</li>
              <li><strong className="text-gray-200">R</strong> - 旋转方块（改变朝向/角度）</li>
              <li><strong className="text-gray-200">V</strong> - 切换偏振视角模式</li>
              <li><strong className="text-gray-200">1-7</strong> - 选择方块类型</li>
            </ul>
          </section>

          {/* Camera Controls */}
          <section>
            <h3 className="text-white font-semibold mb-2">📷 视角控制</h3>
            <ul className="space-y-1 text-gray-400">
              <li><strong className="text-gray-200">C</strong> - 切换相机模式（第一人称/等轴测/俯视）</li>
              <li><strong className="text-gray-200">G</strong> - 显示/隐藏网格</li>
              <li><strong className="text-gray-200">Q/E</strong> - 旋转视角（等轴测模式）</li>
              <li><strong className="text-gray-200">滚轮</strong> - 缩放（等轴测/俯视模式）</li>
            </ul>
          </section>

          {/* Physics */}
          <section>
            <h3 className="text-white font-semibold mb-2">⚡ 偏振光四大公理</h3>
            <ul className="space-y-1 text-gray-400">
              <li><strong className="text-gray-200">正交不干涉</strong>：0°和90°的光可以共存互不影响</li>
              <li><strong className="text-gray-200">马吕斯定律</strong>：光通过偏振片时，强度 = 原强度 × cos²(角度差)</li>
              <li><strong className="text-gray-200">双折射</strong>：方解石将光分裂成两束垂直的光</li>
              <li><strong className="text-gray-200">干涉叠加</strong>：同相叠加变亮，反相抵消变暗</li>
            </ul>
          </section>

          {/* Block Types */}
          <section>
            <h3 className="text-white font-semibold mb-2">🔷 方块说明</h3>
            <ul className="space-y-1 text-gray-400">
              <li><strong className="text-gray-200">💡 光源</strong> - 发射偏振光束（强度15，可调角度）</li>
              <li><strong className="text-gray-200">▤ 偏振片</strong> - 只允许特定角度的光通过</li>
              <li><strong className="text-gray-200">↻ 波片</strong> - 旋转通过的光的偏振角度</li>
              <li><strong className="text-gray-200">◇ 方解石</strong> - 将光分裂为两束垂直光</li>
              <li><strong className="text-gray-200">◎ 感应器</strong> - 检测光线，可设置所需角度阈值</li>
              <li><strong className="text-gray-200">▯ 反射镜</strong> - 反射光线方向</li>
            </ul>
          </section>

          {/* Polarization Colors */}
          <section>
            <h3 className="text-white font-semibold mb-2">👁 偏振视角模式下的颜色</h3>
            <div className="flex flex-wrap gap-4">
              {POLARIZATION_COLORS.map(({ angle, color, label }) => (
                <div key={angle} className="flex items-center gap-2">
                  <div
                    className="w-5 h-2.5 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-400">
                    {angle} {label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
