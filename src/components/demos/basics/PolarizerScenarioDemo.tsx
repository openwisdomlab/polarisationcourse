/**
 * PolarizerScenarioDemo - Application Mode Demo Using Virtual Polarizer Lens
 *
 * This demo showcases the Progressive Disclosure "Scenario Mode" for Application difficulty.
 * Users are given a specific task: eliminate glare from an image using a virtual polarizer.
 *
 * Features:
 * - Task-based learning with clear objectives
 * - Virtual Polarizer Lens with gamification
 * - Success detection and "See the math" research link
 * - Scenario selector for different real-world applications
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { VirtualPolarizerLens, POLARIZER_IMAGE_SETS, type PolarizerImageSet } from './VirtualPolarizerLens'
import {
  TaskModeWrapper,
  WhyButton,
  LabControls,
  DifficultyGate,
  useDifficultyConfig,
  type DifficultyLevel,
} from '../DifficultyStrategy'
import { ControlPanel, InfoCard, Formula } from '../DemoControls'
import { Camera, Droplets, Car, GalleryHorizontalEnd, ChevronDown } from 'lucide-react'

interface PolarizerScenarioDemoProps {
  difficultyLevel?: DifficultyLevel
}

// Scenario icons mapping
const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  'water-reflection': <Droplets className="w-5 h-5" />,
  'car-window': <Car className="w-5 h-5" />,
  'glass-showcase': <GalleryHorizontalEnd className="w-5 h-5" />,
}

export function PolarizerScenarioDemo({
  difficultyLevel = 'application',
}: PolarizerScenarioDemoProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const config = useDifficultyConfig(difficultyLevel)
  const isZh = i18n.language.startsWith('zh')

  // State
  const [selectedScenario, setSelectedScenario] = useState<PolarizerImageSet>(POLARIZER_IMAGE_SETS[0])
  const [isTaskCompleted, setIsTaskCompleted] = useState(false)
  const [finalAngle, setFinalAngle] = useState(0)
  const [showScenarioDropdown, setShowScenarioDropdown] = useState(false)
  const [showResearchPanel, setShowResearchPanel] = useState(false)

  // Handlers
  const handleTaskComplete = useCallback((angle: number) => {
    setIsTaskCompleted(true)
    setFinalAngle(angle)
  }, [])

  const handleResearchLinkClick = useCallback(() => {
    setShowResearchPanel(true)
  }, [])

  const handleScenarioChange = useCallback((scenario: PolarizerImageSet) => {
    setSelectedScenario(scenario)
    setIsTaskCompleted(false)
    setShowResearchPanel(false)
    setShowScenarioDropdown(false)
  }, [])

  // Get current scenario text
  const scenarioName = isZh ? selectedScenario.nameZh : selectedScenario.name
  const scenarioDescription = isZh ? selectedScenario.descriptionZh : selectedScenario.description
  const scenarioExplanation = isZh ? selectedScenario.explanationZh : selectedScenario.explanation

  return (
    <div className="space-y-6">
      {/* === FOUNDATION MODE: Sandbox with Why Button === */}
      <DifficultyGate level="foundation" currentLevel={difficultyLevel}>
        <div className="space-y-6">
          {/* Large Interactive Visual */}
          <div className={cn(
            'rounded-xl overflow-hidden',
            theme === 'dark' ? 'border border-slate-700' : 'border border-gray-200'
          )}>
            <VirtualPolarizerLens
              imageBase={selectedScenario.imageGlare}
              imageFiltered={selectedScenario.imageClear}
              height={350}
              lensRadius={100}
              showSlider={true}
              showPolarizationAxis={true}
              enableGamification={false}
            />
          </div>

          {/* "Why?" Button with Simplified Explanation */}
          <WhyButton>
            <div className="space-y-3">
              <p className="text-base leading-relaxed">
                {isZh
                  ? '水面和玻璃反射的光是"扁平的"——它们只在一个方向上振动（水平偏振）。'
                  : 'Light reflected from water and glass is "flat" - it vibrates only in one direction (horizontal polarization).'}
              </p>
              <p className="text-base leading-relaxed">
                {isZh
                  ? '偏振滤镜就像一扇只允许特定方向振动的光通过的门。转到正确的角度，眩光就被挡住了！'
                  : 'A polarizing filter is like a gate that only lets light vibrating in a specific direction pass through. Turn it to the right angle, and the glare is blocked!'}
              </p>
              <div className={cn(
                'flex items-center gap-3 p-3 rounded-lg mt-4',
                theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-50'
              )}>
                <Camera className={cn('w-6 h-6', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                <span className={cn('text-sm', theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700')}>
                  {isZh
                    ? '这就是为什么摄影师使用偏振滤镜！'
                    : "That's why photographers use polarizing filters!"}
                </span>
              </div>
            </div>
          </WhyButton>
        </div>
      </DifficultyGate>

      {/* === APPLICATION MODE: Scenario Task === */}
      <DifficultyGate level="application" currentLevel={difficultyLevel}>
        <TaskModeWrapper
          taskTitle="Find the extinction angle"
          taskTitleZh="找到消光角"
          taskDescription={`Rotate the polarizer to remove glare from ${scenarioName.toLowerCase()}.`}
          taskDescriptionZh={`旋转偏振片消除${scenarioName}的眩光。`}
          isCompleted={isTaskCompleted}
        >
          {/* Scenario Selector */}
          <div className="mb-4 relative">
            <button
              onClick={() => setShowScenarioDropdown(!showScenarioDropdown)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors',
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
              )}
            >
              {SCENARIO_ICONS[selectedScenario.id]}
              <div className="flex-1 text-left">
                <div className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {scenarioName}
                </div>
                <div className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  {scenarioDescription}
                </div>
              </div>
              <ChevronDown className={cn(
                'w-5 h-5 transition-transform',
                showScenarioDropdown && 'rotate-180'
              )} />
            </button>

            <AnimatePresence>
              {showScenarioDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'absolute top-full left-0 right-0 mt-2 z-20 rounded-lg overflow-hidden shadow-xl',
                    theme === 'dark' ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-gray-200'
                  )}
                >
                  {POLARIZER_IMAGE_SETS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => handleScenarioChange(scenario)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 w-full transition-colors',
                        selectedScenario.id === scenario.id
                          ? theme === 'dark'
                            ? 'bg-cyan-900/30'
                            : 'bg-cyan-50'
                          : theme === 'dark'
                            ? 'hover:bg-slate-700'
                            : 'hover:bg-gray-50'
                      )}
                    >
                      {SCENARIO_ICONS[scenario.id]}
                      <div className="flex-1 text-left">
                        <div className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                          {isZh ? scenario.nameZh : scenario.name}
                        </div>
                        <div className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                          {isZh ? scenario.descriptionZh : scenario.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Virtual Polarizer Lens with Gamification */}
          <div className={cn(
            'rounded-xl overflow-hidden',
            theme === 'dark' ? 'border border-slate-700' : 'border border-gray-200'
          )}>
            <VirtualPolarizerLens
              key={selectedScenario.id}
              imageBase={selectedScenario.imageGlare}
              imageFiltered={selectedScenario.imageClear}
              height={400}
              lensRadius={90}
              showSlider={true}
              showPolarizationAxis={true}
              targetAngle={selectedScenario.targetAngle}
              successTolerance={5}
              enableGamification={true}
              onTaskComplete={handleTaskComplete}
              onResearchLinkClick={handleResearchLinkClick}
            />
          </div>

          {/* Formula Display (Application Mode shows formulas) */}
          {config.showFormula && (
            <InfoCard
              title={isZh ? '马吕斯定律' : "Malus's Law"}
              color="cyan"
              icon="📐"
            >
              <Formula highlight>
                I = I₀ × cos²(θ)
              </Formula>
              <p className={cn('text-sm mt-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? '当 θ = 90° 时，cos²(90°) = 0，反射眩光被完全阻挡。'
                  : 'When θ = 90°, cos²(90°) = 0, and reflected glare is completely blocked.'}
              </p>
            </InfoCard>
          )}

          {/* Research Panel (appears after task completion) */}
          <AnimatePresence>
            {showResearchPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'rounded-xl overflow-hidden',
                  theme === 'dark' ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
                )}
              >
                <div className="p-4 space-y-4">
                  <h4 className={cn('font-semibold', theme === 'dark' ? 'text-purple-400' : 'text-purple-700')}>
                    🔬 {isZh ? '深入了解' : 'Deep Dive'}
                  </h4>

                  <div className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                    <p className="mb-3">{scenarioExplanation}</p>
                    <p>
                      {isZh
                        ? `你找到的消光角是 ${finalAngle}°，与理论最佳角度 ${selectedScenario.targetAngle}° 非常接近！`
                        : `You found the extinction angle at ${finalAngle}°, very close to the theoretical optimum of ${selectedScenario.targetAngle}°!`}
                    </p>
                  </div>

                  <div className={cn(
                    'p-3 rounded-lg font-mono text-sm',
                    theme === 'dark' ? 'bg-slate-800 text-cyan-300' : 'bg-white text-cyan-700'
                  )}>
                    <div>I_transmitted = I_reflected × cos²({finalAngle}°)</div>
                    <div>= I_reflected × {Math.pow(Math.cos(finalAngle * Math.PI / 180), 2).toFixed(4)}</div>
                    <div>≈ {(Math.pow(Math.cos(finalAngle * Math.PI / 180), 2) * 100).toFixed(1)}% of reflected light passes</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TaskModeWrapper>
      </DifficultyGate>

      {/* === RESEARCH MODE: Lab Controls with Raw Data === */}
      <DifficultyGate level="research" currentLevel={difficultyLevel}>
        <LabControls
          showJonesVectors={config.showJonesVectors}
          showMuellerMatrices={config.showMuellerMatrices}
          onExportData={() => {
            // Export raw measurement data
            const data = {
              scenario: selectedScenario.id,
              measurements: Array.from({ length: 91 }, (_, i) => ({
                angle: i,
                transmittance: Math.pow(Math.cos(i * Math.PI / 180), 2),
              })),
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `malus-law-data-${selectedScenario.id}.json`
            a.click()
          }}
        >
          {/* Full Interactive + All Controls */}
          <div className={cn(
            'rounded-xl overflow-hidden',
            theme === 'dark' ? 'border border-slate-700' : 'border border-gray-200'
          )}>
            <VirtualPolarizerLens
              imageBase={selectedScenario.imageGlare}
              imageFiltered={selectedScenario.imageClear}
              height={400}
              lensRadius={90}
              showSlider={true}
              showPolarizationAxis={true}
              enableGamification={false}
            />
          </div>

          {/* Advanced Formula with Derivation */}
          <InfoCard
            title={isZh ? '马吕斯定律推导' : "Malus's Law Derivation"}
            color="purple"
            icon="📜"
          >
            <div className={cn('space-y-2 font-mono text-sm', theme === 'dark' ? 'text-purple-300' : 'text-purple-700')}>
              <div>E⃗_transmitted = E⃗_incident · cos(θ)</div>
              <div>I ∝ |E⃗|²</div>
              <div>∴ I_transmitted = I_incident × cos²(θ)</div>
            </div>
            <div className={cn('mt-4 text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh
                ? '由于强度与电场振幅的平方成正比，当偏振光通过与其偏振方向成θ角的偏振片时，透射强度遵循cos²定律。'
                : 'Since intensity is proportional to the square of the electric field amplitude, when polarized light passes through a polarizer at angle θ to its polarization direction, the transmitted intensity follows the cos² law.'}
            </div>
          </InfoCard>

          {/* Raw Data Table */}
          <ControlPanel title={isZh ? '原始数据表' : 'Raw Data Table'}>
            <div className={cn(
              'max-h-48 overflow-y-auto rounded-lg',
              theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
            )}>
              <table className="w-full text-xs font-mono">
                <thead className={cn('sticky top-0', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}>
                  <tr>
                    <th className="px-3 py-2 text-left">θ (°)</th>
                    <th className="px-3 py-2 text-left">cos²(θ)</th>
                    <th className="px-3 py-2 text-left">T (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 15, 30, 45, 60, 75, 90].map((angle) => {
                    const cos2 = Math.pow(Math.cos(angle * Math.PI / 180), 2)
                    return (
                      <tr key={angle} className={cn(
                        theme === 'dark' ? 'border-t border-slate-700' : 'border-t border-gray-200'
                      )}>
                        <td className="px-3 py-2">{angle}</td>
                        <td className="px-3 py-2">{cos2.toFixed(4)}</td>
                        <td className="px-3 py-2">{(cos2 * 100).toFixed(1)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </ControlPanel>
        </LabControls>
      </DifficultyGate>
    </div>
  )
}

export default PolarizerScenarioDemo
