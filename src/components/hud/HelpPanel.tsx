import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/stores/gameStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const POLARIZATION_COLORS = [
  { angle: '0°', color: '#ff4444', labelKey: 'game.helpPanel.horizontal' },
  { angle: '45°', color: '#ffaa00', labelKey: 'game.helpPanel.diagonal' },
  { angle: '90°', color: '#44ff44', labelKey: 'game.helpPanel.vertical' },
  { angle: '135°', color: '#4444ff', labelKey: 'game.helpPanel.diagonal' },
]

export function HelpPanel() {
  const { t } = useTranslation()
  const { showHelp, toggleHelp } = useGameStore()

  return (
    <Dialog open={showHelp} onOpenChange={toggleHelp}>
      <DialogContent className="max-w-2xl bg-slate-900/95 border-cyan-400/30 text-gray-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400">
            ⟡ PolarCraft {t('game.gameGuide')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* Basic Controls */}
          <section>
            <h3 className="text-white font-semibold mb-2">🎮 {t('game.helpPanel.basicControls')}</h3>
            <ul className="space-y-1 text-gray-400">
              <li><strong className="text-gray-200">WASD</strong> - {t('game.helpPanel.wasd')}</li>
              <li><strong className="text-gray-200">Space</strong> - {t('game.helpPanel.space')}</li>
              <li><strong className="text-gray-200">Mouse</strong> - {t('game.helpPanel.mouse')}</li>
              <li><strong className="text-gray-200">Left Click</strong> - {t('game.helpPanel.leftClick')}</li>
              <li><strong className="text-gray-200">Right Click</strong> - {t('game.helpPanel.rightClick')}</li>
              <li><strong className="text-gray-200">R</strong> - {t('game.helpPanel.rKey')}</li>
              <li><strong className="text-gray-200">V</strong> - {t('game.helpPanel.vKey')}</li>
              <li><strong className="text-gray-200">H</strong> - {t('game.helpPanel.hKey')}</li>
              <li><strong className="text-gray-200">Esc</strong> - {t('game.helpPanel.escKey')}</li>
              <li><strong className="text-gray-200">1-7</strong> - {t('game.helpPanel.numberKeys')}</li>
            </ul>
          </section>

          {/* Camera Controls */}
          <section>
            <h3 className="text-white font-semibold mb-2">📷 {t('game.helpPanel.cameraControls')}</h3>
            <ul className="space-y-1 text-gray-400">
              <li><strong className="text-gray-200">C</strong> - {t('game.helpPanel.cKey')}</li>
              <li><strong className="text-gray-200">G</strong> - {t('game.helpPanel.gKey')}</li>
              <li><strong className="text-gray-200">Q/E</strong> - {t('game.helpPanel.qeKeys')}</li>
              <li><strong className="text-gray-200">Scroll</strong> - {t('game.helpPanel.scroll')}</li>
            </ul>
          </section>

          {/* Physics */}
          <section>
            <h3 className="text-white font-semibold mb-2">⚡ {t('game.helpPanel.fourAxioms')}</h3>
            <ul className="space-y-1 text-gray-400">
              <li>{t('game.helpPanel.orthogonal')}</li>
              <li>{t('game.helpPanel.malus')}</li>
              <li>{t('game.helpPanel.birefringence')}</li>
              <li>{t('game.helpPanel.interference')}</li>
            </ul>
          </section>

          {/* Block Types */}
          <section>
            <h3 className="text-white font-semibold mb-2">🔷 {t('game.helpPanel.blockGuide')}</h3>
            <ul className="space-y-1 text-gray-400">
              <li><strong className="text-gray-200">💡 {t('game.blocks.emitter')}</strong> - {t('game.helpPanel.emitterDesc')}</li>
              <li><strong className="text-gray-200">▤ {t('game.blocks.polarizer')}</strong> - {t('game.helpPanel.polarizerDesc')}</li>
              <li><strong className="text-gray-200">↻ {t('game.blocks.rotator')}</strong> - {t('game.helpPanel.rotatorDesc')}</li>
              <li><strong className="text-gray-200">◇ {t('game.blocks.splitter')}</strong> - {t('game.helpPanel.splitterDesc')}</li>
              <li><strong className="text-gray-200">◎ {t('game.blocks.sensor')}</strong> - {t('game.helpPanel.sensorDesc')}</li>
              <li><strong className="text-gray-200">▯ {t('game.blocks.mirror')}</strong> - {t('game.helpPanel.mirrorDesc')}</li>
            </ul>
          </section>

          {/* Polarization Colors */}
          <section>
            <h3 className="text-white font-semibold mb-2">👁 {t('game.helpPanel.polarizationColors')}</h3>
            <div className="flex flex-wrap gap-4">
              {POLARIZATION_COLORS.map(({ angle, color, labelKey }) => (
                <div key={angle} className="flex items-center gap-2">
                  <div
                    className="w-5 h-2.5 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-400">
                    {angle} {t(labelKey)}
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
