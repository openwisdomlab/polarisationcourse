/**
 * SugarOpticalRotator - 白砂糖旋光模拟器
 *
 * 功能：
 * - 模拟白砂糖的旋光性效果
 * - 旋钮/滑块控制"检偏器角度"
 * - 根据角度插值混合"平行"和"正交"两张图
 * - 模拟旋光仪中观察糖袋子的效果
 *
 * 原理：
 * 白砂糖(蔗糖)是右旋糖，会将偏振光旋转一定角度。
 * 旋转角度与浓度和光程长度成正比。
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SecureImageViewer } from '@/components/shared'
import { SUGAR_BAG, PolarizationResource } from '@/data/resource-gallery'
import { RotateCcw, Info, FlaskConical } from 'lucide-react'

interface SugarOpticalRotatorProps {
  resource?: PolarizationResource
  className?: string
  showFormula?: boolean
}

// 典型的糖溶液旋光度 (蔗糖: +66.5°/dm·g/mL) - 用于参考
// Typical specific rotation (Sucrose: +66.5°/dm·g/mL) - for reference

export function SugarOpticalRotator({
  resource = SUGAR_BAG,
  className,
  showFormula = true,
}: SugarOpticalRotatorProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // Analyzer angle (0-180°)
  const [analyzerAngle, setAnalyzerAngle] = useState(90)

  // Calculate optical rotation effect
  // At 0° (parallel): bright background
  // At 90° (crossed): dark background, stress visible
  // Sugar rotates polarization, so optimal view shifts
  const opticalRotation = useMemo(() => {
    // Simulate sugar rotating the plane of polarization by ~15-30°
    const sugarRotation = 22 // degrees (simplified model)
    // Effective extinction angle shifts by the sugar rotation
    const effectiveAngle = (analyzerAngle - sugarRotation + 360) % 360
    // Intensity follows Malus's Law: I = I0 * cos²(θ)
    const normalizedAngle = effectiveAngle % 180
    const intensity = Math.pow(Math.cos(normalizedAngle * Math.PI / 180), 2)
    return {
      sugarRotation,
      effectiveAngle,
      intensity,
      isNearExtinction: normalizedAngle > 80 && normalizedAngle < 100,
    }
  }, [analyzerAngle])

  // Blend between parallel and crossed images based on angle
  const blendFactor = useMemo(() => {
    // 0° = fully parallel (blend = 0)
    // 90° = fully crossed (blend = 1)
    // Use cosine for smooth transition
    const normalized = (analyzerAngle % 180) / 180
    return Math.pow(Math.sin(normalized * Math.PI), 2)
  }, [analyzerAngle])

  // Get image URLs
  const parallelUrl = resource.views?.parallel || resource.url
  const crossedUrl = resource.views?.crossed || resource.url

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '旋光性模拟器' : 'Optical Rotation Simulator'}
          </h3>
        </div>
        <div className={cn(
          'px-2 py-1 rounded text-xs font-medium',
          'bg-amber-500/20 text-amber-400'
        )}>
          {isZh ? '旋光性物质' : 'Chiral Substance'}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Image display with blend */}
        <div className="flex-1">
          <div className={cn(
            'relative rounded-xl overflow-hidden aspect-[4/3]',
            theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
          )}>
            {/* Base image (parallel) */}
            <div className="absolute inset-0">
              <SecureImageViewer
                src={parallelUrl}
                alt={isZh ? '平行偏振' : 'Parallel'}
                className="w-full h-full"
                objectFit="contain"
              />
            </div>

            {/* Overlay image (crossed) with opacity based on blend factor */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: blendFactor }}
            >
              <SecureImageViewer
                src={crossedUrl}
                alt={isZh ? '正交偏振' : 'Crossed'}
                className="w-full h-full"
                objectFit="contain"
              />
            </div>

            {/* Analyzer angle indicator */}
            <div className={cn(
              'absolute top-3 left-3 px-3 py-2 rounded-lg backdrop-blur-sm',
              theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-900'
            )}>
              <div className="text-xs opacity-70">{isZh ? '检偏器角度' : 'Analyzer Angle'}</div>
              <div className="text-lg font-mono font-bold">{analyzerAngle}°</div>
            </div>

            {/* Extinction indicator */}
            {opticalRotation.isNearExtinction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'absolute bottom-3 right-3 px-3 py-1.5 rounded-lg backdrop-blur-sm',
                  'bg-purple-500/50 text-white text-xs'
                )}
              >
                {isZh ? '接近消光位' : 'Near Extinction'}
              </motion.div>
            )}

            {/* Rotation indicator dial */}
            <div className={cn(
              'absolute bottom-3 left-3 w-16 h-16 rounded-full backdrop-blur-sm',
              theme === 'dark' ? 'bg-black/30' : 'bg-white/50'
            )}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circle */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                {/* Angle marks */}
                {[0, 45, 90, 135].map((mark) => (
                  <line
                    key={mark}
                    x1={50 + 38 * Math.cos((mark - 90) * Math.PI / 180)}
                    y1={50 + 38 * Math.sin((mark - 90) * Math.PI / 180)}
                    x2={50 + 45 * Math.cos((mark - 90) * Math.PI / 180)}
                    y2={50 + 45 * Math.sin((mark - 90) * Math.PI / 180)}
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                ))}
                {/* Current angle indicator */}
                <line
                  x1="50"
                  y1="50"
                  x2={50 + 35 * Math.cos((analyzerAngle - 90) * Math.PI / 180)}
                  y2={50 + 35 * Math.sin((analyzerAngle - 90) * Math.PI / 180)}
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Center dot */}
                <circle cx="50" cy="50" r="4" fill="#f59e0b" />
              </svg>
            </div>
          </div>

          {/* Angle slider */}
          <div className="mt-4 px-2">
            <div className="flex items-center gap-4">
              <span className={cn('text-xs whitespace-nowrap', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                0° ({isZh ? '平行' : 'Parallel'})
              </span>
              <input
                type="range"
                min="0"
                max="180"
                value={analyzerAngle}
                onChange={(e) => setAnalyzerAngle(parseInt(e.target.value))}
                className={cn(
                  'flex-1 h-2 rounded-lg appearance-none cursor-pointer',
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200',
                  '[&::-webkit-slider-thumb]:appearance-none',
                  '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
                  '[&::-webkit-slider-thumb]:rounded-full',
                  '[&::-webkit-slider-thumb]:bg-amber-500',
                  '[&::-webkit-slider-thumb]:shadow-lg',
                  '[&::-webkit-slider-thumb]:cursor-pointer'
                )}
              />
              <span className={cn('text-xs whitespace-nowrap', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                180° ({isZh ? '平行' : 'Parallel'})
              </span>
            </div>
            {/* Quick presets */}
            <div className="flex justify-center gap-2 mt-2">
              {[0, 45, 90, 112, 135, 180].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setAnalyzerAngle(angle)}
                  className={cn(
                    'px-2 py-1 rounded text-xs transition-colors',
                    analyzerAngle === angle
                      ? 'bg-amber-500/30 text-amber-400'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  )}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className={cn(
          'lg:w-64 rounded-xl p-4',
          theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'
        )}>
          <h4 className={cn(
            'text-sm font-semibold mb-3 flex items-center gap-2',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}>
            <RotateCcw className="w-4 h-4" />
            {isZh ? '旋光原理' : 'Optical Rotation'}
          </h4>

          {/* Intensity display */}
          <div className={cn(
            'p-3 rounded-lg mb-3',
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
          )}>
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {isZh ? '透射强度' : 'Transmitted Intensity'}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-700">
                <motion.div
                  className="h-full bg-amber-400"
                  animate={{ width: `${opticalRotation.intensity * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {(opticalRotation.intensity * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Sugar rotation info */}
          <div className={cn(
            'p-3 rounded-lg mb-3',
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
          )}>
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {isZh ? '糖的旋光度' : 'Sugar Rotation'}
            </div>
            <div className={cn('text-lg font-mono font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              +{opticalRotation.sugarRotation}°
            </div>
            <div className={cn('text-xs mt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
              {isZh ? '蔗糖是右旋糖' : 'Sucrose is dextrorotatory'}
            </div>
          </div>

          {/* Formula */}
          {showFormula && (
            <div className={cn(
              'p-3 rounded-lg border-l-4 border-amber-500',
              theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
            )}>
              <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')}>
                {isZh ? '马吕斯定律' : "Malus's Law"}
              </div>
              <div className={cn('text-sm font-mono', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                I = I₀ × cos²(θ - α)
              </div>
              <div className={cn('text-xs mt-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                {isZh
                  ? 'α = 旋光角（糖浓度相关）'
                  : 'α = rotation angle (depends on sugar concentration)'}
              </div>
            </div>
          )}

          {/* Tip */}
          <div className={cn(
            'mt-3 p-3 rounded-lg flex items-start gap-2',
            theme === 'dark' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-100'
          )}>
            <Info className={cn('w-4 h-4 mt-0.5 flex-shrink-0', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />
            <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh
                ? '尝试找到消光位（约112°），此时背景最暗但糖的区域会亮起来！'
                : 'Try finding the extinction position (~112°), where the background is darkest but the sugar region lights up!'}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {isZh ? resource.descriptionZh : resource.description}
      </p>
    </div>
  )
}
