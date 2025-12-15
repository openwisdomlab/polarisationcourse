/**
 * Michel-Lévy Interference Color Chart - Interactive stress color reference
 * 米歇尔-列维干涉色图 - 交互式应力颜色参考
 *
 * This component displays an interactive Michel-Lévy chart that helps users
 * identify stress levels (optical retardation in nm) based on the interference
 * colors they observe when viewing transparent materials between crossed polarizers.
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Info, Target, ZoomIn, ZoomOut } from 'lucide-react'

interface PolarizerSourceProps {
  className?: string
}

// Michel-Lévy color sequence with retardation values
// Colors progress through orders as retardation increases
const COLOR_BANDS = [
  // First Order (0-550nm)
  { retardation: 0, color: '#000000', nameEn: 'Black', nameZh: '黑色', order: 1 },
  { retardation: 40, color: '#1a1a2e', nameEn: 'Iron Gray', nameZh: '铁灰色', order: 1 },
  { retardation: 97, color: '#4a4a6a', nameEn: 'Lavender Gray', nameZh: '薰衣草灰', order: 1 },
  { retardation: 158, color: '#8888aa', nameEn: 'Blue Gray', nameZh: '蓝灰色', order: 1 },
  { retardation: 218, color: '#aaaacc', nameEn: 'Clear Gray', nameZh: '浅灰色', order: 1 },
  { retardation: 234, color: '#ccccff', nameEn: 'Greenish White', nameZh: '绿白色', order: 1 },
  { retardation: 259, color: '#ffffcc', nameEn: 'Light Yellow', nameZh: '浅黄色', order: 1 },
  { retardation: 267, color: '#ffff88', nameEn: 'Straw Yellow', nameZh: '草黄色', order: 1 },
  { retardation: 275, color: '#ffee44', nameEn: 'Yellow', nameZh: '黄色', order: 1 },
  { retardation: 281, color: '#ffcc00', nameEn: 'Orange Yellow', nameZh: '橙黄色', order: 1 },
  { retardation: 306, color: '#ff9900', nameEn: 'Orange', nameZh: '橙色', order: 1 },
  { retardation: 332, color: '#ff6633', nameEn: 'Red Orange', nameZh: '红橙色', order: 1 },
  { retardation: 430, color: '#ff3344', nameEn: 'Red', nameZh: '红色', order: 1 },
  { retardation: 505, color: '#cc2255', nameEn: 'Deep Red', nameZh: '深红色', order: 1 },
  { retardation: 536, color: '#992266', nameEn: 'Violet', nameZh: '紫色', order: 1 },

  // Second Order (550-1100nm)
  { retardation: 551, color: '#6633aa', nameEn: 'Indigo', nameZh: '靛蓝', order: 2 },
  { retardation: 565, color: '#4444cc', nameEn: 'Blue', nameZh: '蓝色', order: 2 },
  { retardation: 575, color: '#3366dd', nameEn: 'Sky Blue', nameZh: '天蓝色', order: 2 },
  { retardation: 589, color: '#2288cc', nameEn: 'Blue Green', nameZh: '蓝绿色', order: 2 },
  { retardation: 664, color: '#22aa88', nameEn: 'Green', nameZh: '绿色', order: 2 },
  { retardation: 728, color: '#44bb44', nameEn: 'Yellow Green', nameZh: '黄绿色', order: 2 },
  { retardation: 747, color: '#88cc22', nameEn: 'Greenish Yellow', nameZh: '绿黄色', order: 2 },
  { retardation: 826, color: '#ccdd00', nameEn: 'Yellow', nameZh: '黄色', order: 2 },
  { retardation: 843, color: '#eebb00', nameEn: 'Orange Yellow', nameZh: '橙黄色', order: 2 },
  { retardation: 866, color: '#ff8800', nameEn: 'Orange', nameZh: '橙色', order: 2 },
  { retardation: 910, color: '#ff5544', nameEn: 'Light Red', nameZh: '浅红色', order: 2 },
  { retardation: 948, color: '#ee3355', nameEn: 'Carmine Red', nameZh: '胭脂红', order: 2 },
  { retardation: 998, color: '#cc2266', nameEn: 'Dark Violet Red', nameZh: '暗紫红', order: 2 },
  { retardation: 1050, color: '#9933aa', nameEn: 'Violet', nameZh: '紫色', order: 2 },
  { retardation: 1101, color: '#6644bb', nameEn: 'Indigo', nameZh: '靛蓝', order: 2 },

  // Third Order (1100-1650nm)
  { retardation: 1128, color: '#4455cc', nameEn: 'Blue', nameZh: '蓝色', order: 3 },
  { retardation: 1151, color: '#3377dd', nameEn: 'Blue Green', nameZh: '蓝绿色', order: 3 },
  { retardation: 1258, color: '#33aa77', nameEn: 'Sea Green', nameZh: '海绿色', order: 3 },
  { retardation: 1334, color: '#55bb55', nameEn: 'Green', nameZh: '绿色', order: 3 },
  { retardation: 1376, color: '#99cc44', nameEn: 'Yellow Green', nameZh: '黄绿色', order: 3 },
  { retardation: 1426, color: '#cccc33', nameEn: 'Greenish Yellow', nameZh: '绿黄色', order: 3 },
  { retardation: 1495, color: '#eebb44', nameEn: 'Flesh Color', nameZh: '肤色', order: 3 },
  { retardation: 1534, color: '#ff9966', nameEn: 'Light Carmine', nameZh: '浅胭脂', order: 3 },
  { retardation: 1621, color: '#ee7788', nameEn: 'Carmine Red', nameZh: '胭脂红', order: 3 },

  // Fourth Order (1650-2200nm)
  { retardation: 1652, color: '#cc6699', nameEn: 'Dull Purple', nameZh: '暗紫色', order: 4 },
  { retardation: 1682, color: '#8866aa', nameEn: 'Gray Blue', nameZh: '灰蓝色', order: 4 },
  { retardation: 1711, color: '#5577bb', nameEn: 'Dull Blue Green', nameZh: '暗蓝绿', order: 4 },
  { retardation: 1744, color: '#4499aa', nameEn: 'Dull Sea Green', nameZh: '暗海绿', order: 4 },
  { retardation: 1811, color: '#55aa88', nameEn: 'Greenish Gray', nameZh: '绿灰色', order: 4 },
  { retardation: 1927, color: '#88bb77', nameEn: 'Dull Green', nameZh: '暗绿色', order: 4 },
  { retardation: 2007, color: '#aabb88', nameEn: 'Gray Green', nameZh: '灰绿色', order: 4 },
  { retardation: 2048, color: '#ccbb99', nameEn: 'Greenish White', nameZh: '绿白色', order: 4 },
  { retardation: 2134, color: '#ddaa99', nameEn: 'Pale Pink', nameZh: '淡粉色', order: 4 },
  { retardation: 2200, color: '#cc9999', nameEn: 'Pale Carnation', nameZh: '淡康乃馨', order: 4 },
]

// Order separators
const ORDER_RANGES = [
  { order: 1, start: 0, end: 550, labelEn: '1st Order', labelZh: '一级色序' },
  { order: 2, start: 550, end: 1100, labelEn: '2nd Order', labelZh: '二级色序' },
  { order: 3, start: 1100, end: 1650, labelEn: '3rd Order', labelZh: '三级色序' },
  { order: 4, start: 1650, end: 2200, labelEn: '4th Order', labelZh: '四级色序' },
]

export function MichelLevyChart({ className }: PolarizerSourceProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Selected color/retardation
  const [selectedBand, setSelectedBand] = useState<typeof COLOR_BANDS[0] | null>(null)
  // Zoom level for chart
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3>(1)
  // View range (for zoomed view)
  const [viewRange, setViewRange] = useState<{ start: number; end: number }>({ start: 0, end: 2200 })

  // Get visible bands based on zoom level
  const visibleBands = COLOR_BANDS.filter(
    band => band.retardation >= viewRange.start && band.retardation <= viewRange.end
  )

  // Handle band selection
  const handleBandClick = useCallback((band: typeof COLOR_BANDS[0]) => {
    setSelectedBand(band)
  }, [])

  // Handle zoom
  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => (prev + 1) as 1 | 2 | 3)
      // If a band is selected, center the view on it
      if (selectedBand) {
        const range = zoomLevel === 1 ? 1100 : 550
        const center = selectedBand.retardation
        setViewRange({
          start: Math.max(0, center - range / 2),
          end: Math.min(2200, center + range / 2)
        })
      } else {
        // Default zoom to first half
        const newEnd = zoomLevel === 1 ? 1100 : 550
        setViewRange({ start: 0, end: newEnd })
      }
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel((prev) => (prev - 1) as 1 | 2 | 3)
      if (zoomLevel === 2) {
        setViewRange({ start: 0, end: 2200 })
      } else {
        setViewRange({ start: 0, end: 1100 })
      }
    }
  }

  // Shift view for navigation
  const shiftView = (direction: 'left' | 'right') => {
    const range = viewRange.end - viewRange.start
    const shift = range / 2
    if (direction === 'left') {
      const newStart = Math.max(0, viewRange.start - shift)
      setViewRange({ start: newStart, end: newStart + range })
    } else {
      const newEnd = Math.min(2200, viewRange.end + shift)
      setViewRange({ start: newEnd - range, end: newEnd })
    }
  }

  // Find closest band for a given retardation
  const findClosestBand = (retardation: number) => {
    let closest = COLOR_BANDS[0]
    let minDiff = Math.abs(retardation - closest.retardation)
    for (const band of COLOR_BANDS) {
      const diff = Math.abs(retardation - band.retardation)
      if (diff < minDiff) {
        closest = band
        minDiff = diff
      }
    }
    return closest
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Info banner */}
      <div className={cn(
        'p-3 rounded-lg text-sm',
        theme === 'dark' ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-50 text-purple-700'
      )}>
        <p className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {isZh
              ? '将塑料物品放在正交偏振片之间，对比观察到的颜色与下方色图，估计应力（相位延迟）值。'
              : 'Place plastic objects between crossed polarizers. Compare colors you see with this chart to estimate stress (retardation) values.'}
          </span>
        </p>
      </div>

      {/* Color chart - horizontal gradient style */}
      <div className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      )}>
        {/* Order labels */}
        <div className="flex">
          {ORDER_RANGES.filter(order => {
            const orderStart = Math.max(order.start, viewRange.start)
            const orderEnd = Math.min(order.end, viewRange.end)
            return orderEnd > orderStart
          }).map(order => {
            const orderStart = Math.max(order.start, viewRange.start)
            const orderEnd = Math.min(order.end, viewRange.end)
            const widthPercent = ((orderEnd - orderStart) / (viewRange.end - viewRange.start)) * 100
            return (
              <div
                key={order.order}
                className={cn(
                  'text-center py-1 text-xs font-medium border-r last:border-r-0',
                  theme === 'dark' ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                )}
                style={{ width: `${widthPercent}%` }}
              >
                {isZh ? order.labelZh : order.labelEn}
              </div>
            )
          })}
        </div>

        {/* Color bands - horizontal strip */}
        <div className="h-16 flex relative">
          {visibleBands.map((band, index) => {
            const nextBand = visibleBands[index + 1]
            const bandStart = band.retardation
            const bandEnd = nextBand ? nextBand.retardation : viewRange.end
            const startPercent = ((bandStart - viewRange.start) / (viewRange.end - viewRange.start)) * 100
            const widthPercent = ((bandEnd - bandStart) / (viewRange.end - viewRange.start)) * 100

            return (
              <button
                key={band.retardation}
                onClick={() => handleBandClick(band)}
                className={cn(
                  'h-full transition-all hover:brightness-110 focus:outline-none',
                  selectedBand?.retardation === band.retardation && 'ring-2 ring-white ring-inset'
                )}
                style={{
                  position: 'absolute',
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                  backgroundColor: band.color,
                }}
                title={`${band.retardation}nm - ${isZh ? band.nameZh : band.nameEn}`}
              />
            )
          })}

          {/* Selected indicator */}
          {selectedBand && (
            <div
              className="absolute top-0 h-full pointer-events-none"
              style={{
                left: `${((selectedBand.retardation - viewRange.start) / (viewRange.end - viewRange.start)) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="w-0.5 h-full bg-white shadow-lg" />
              <Target className="w-4 h-4 absolute -bottom-5 -translate-x-1/2 text-white drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Retardation scale */}
        <div className="flex justify-between px-2 py-1 text-[10px] font-mono">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = viewRange.start + (i / 4) * (viewRange.end - viewRange.start)
            return (
              <span key={i} className={cn(theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                {Math.round(value)}nm
              </span>
            )
          })}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel === 1}
            className={cn(
              'p-2 rounded-lg transition-colors disabled:opacity-50',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className={cn(
            'text-xs font-medium px-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {zoomLevel}x
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel === 3}
            className={cn(
              'p-2 rounded-lg transition-colors disabled:opacity-50',
              theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation when zoomed */}
        {zoomLevel > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => shiftView('left')}
              disabled={viewRange.start === 0}
              className={cn(
                'px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50',
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              ←
            </button>
            <button
              onClick={() => shiftView('right')}
              disabled={viewRange.end >= 2200}
              className={cn(
                'px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50',
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Selected color info */}
      {selectedBand && (
        <div className={cn(
          'p-4 rounded-xl border',
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
        )}>
          <div className="flex items-center gap-4">
            {/* Color swatch */}
            <div
              className="w-16 h-16 rounded-lg shadow-inner flex-shrink-0"
              style={{ backgroundColor: selectedBand.color }}
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  'text-lg font-semibold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? selectedBand.nameZh : selectedBand.nameEn}
                </span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                )}>
                  {selectedBand.order === 1 ? (isZh ? '一级' : '1st') :
                   selectedBand.order === 2 ? (isZh ? '二级' : '2nd') :
                   selectedBand.order === 3 ? (isZh ? '三级' : '3rd') :
                   (isZh ? '四级' : '4th')}
                </span>
              </div>
              <div className={cn(
                'text-2xl font-mono font-bold',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              )}>
                {selectedBand.retardation} nm
              </div>
              <p className={cn(
                'text-xs mt-1',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh ? '光程差（相位延迟）' : 'Path difference (retardation)'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick reference colors */}
      <div className={cn(
        'p-4 rounded-xl border',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <h4 className={cn(
          'text-xs font-semibold uppercase tracking-wider mb-3',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )}>
          {isZh ? '常见参考色' : 'Quick Reference Colors'}
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { retardation: 0, labelEn: 'Zero stress', labelZh: '无应力' },
            { retardation: 275, labelEn: 'Yellow 1st', labelZh: '一级黄' },
            { retardation: 536, labelEn: 'Red-Violet 1st', labelZh: '一级红紫' },
            { retardation: 565, labelEn: 'Blue 2nd', labelZh: '二级蓝' },
            { retardation: 664, labelEn: 'Green 2nd', labelZh: '二级绿' },
            { retardation: 843, labelEn: 'Yellow 2nd', labelZh: '二级黄' },
            { retardation: 1128, labelEn: 'Blue 3rd', labelZh: '三级蓝' },
            { retardation: 1334, labelEn: 'Green 3rd', labelZh: '三级绿' },
          ].map(ref => {
            const band = findClosestBand(ref.retardation)
            return (
              <button
                key={ref.retardation}
                onClick={() => handleBandClick(band)}
                className={cn(
                  'p-2 rounded-lg text-center transition-all hover:scale-105',
                  selectedBand?.retardation === band.retardation && 'ring-2 ring-cyan-400'
                )}
              >
                <div
                  className="w-full h-8 rounded mb-1"
                  style={{ backgroundColor: band.color }}
                />
                <div className={cn(
                  'text-[10px]',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {isZh ? ref.labelZh : ref.labelEn}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Physics explanation */}
      <div className={cn(
        'p-3 rounded-lg text-xs',
        theme === 'dark' ? 'bg-slate-800/50 text-gray-400' : 'bg-gray-50 text-gray-600'
      )}>
        <p className="mb-1 font-medium">
          {isZh ? '为什么会看到彩色？' : 'Why do you see colors?'}
        </p>
        <p>
          {isZh
            ? '当偏振光穿过有应力的透明材料时，快轴和慢轴方向的光产生相位差。不同波长（颜色）的相位差不同，在正交偏振片之间产生特定颜色的干涉。相位延迟 = 双折射率 × 厚度。'
            : 'When polarized light passes through stressed transparent material, light along fast and slow axes gets phase-shifted differently. Different wavelengths (colors) shift by different amounts, creating specific interference colors between crossed polarizers. Retardation = Birefringence × Thickness.'}
        </p>
      </div>
    </div>
  )
}
