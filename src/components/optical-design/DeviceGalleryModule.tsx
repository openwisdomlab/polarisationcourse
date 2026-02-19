/**
 * DeviceGalleryModule - 偏振器件图鉴
 *
 * 展示各类偏振光学器件，包括:
 * - 分类筛选
 * - 详细规格参数
 * - 工作原理说明
 * - 相关公式
 * - 应用场景
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import {
  Search,
  BookOpen,
  Zap,
  Box,
  FlaskConical,
  Layers,
  Circle,
  Triangle,
  Activity,
  Scan,
  MoreHorizontal,
  ArrowRight,
  Info,
  X,
} from 'lucide-react'
import {
  DEVICES,
  DEVICE_CATEGORIES,
  DIFFICULTY_CONFIG,
  type Device,
  type DeviceCategory,
} from '@/data/optical-devices'
import MathText from '../MathText'

// ============================================
// Category Icon Mapping
// ============================================

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-4 h-4" />,
  Circle: <Circle className="w-4 h-4" />,
  Triangle: <Triangle className="w-4 h-4" />,
  Disc: <Box className="w-4 h-4" />,
  Scan: <Scan className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  MoreHorizontal: <MoreHorizontal className="w-4 h-4" />,
}

// ============================================
// Device Card Component
// ============================================

interface DeviceCardProps {
  device: Device
  onClick: () => void
  isSelected: boolean
}

function DeviceCard({ device, onClick, isSelected }: DeviceCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const diffConfig = DIFFICULTY_CONFIG[device.difficulty]
  const diffColors = {
    green: theme === 'dark' ? 'bg-green-400/20 text-green-400 border-green-400/30' : 'bg-green-100 text-green-700 border-green-200',
    yellow: theme === 'dark' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
    red: theme === 'dark' ? 'bg-red-400/20 text-red-400 border-red-400/30' : 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left',
        'hover:scale-[1.02] hover:shadow-lg',
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-700 hover:border-cyan-400/50'
          : 'bg-white border-gray-200 hover:border-cyan-300',
        isSelected && (theme === 'dark'
          ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
          : 'border-cyan-500 bg-cyan-50 shadow-lg')
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-3xl">{device.icon}</div>
        <span className={cn(
          'px-2 py-0.5 text-xs font-medium rounded-full border',
          diffColors[diffConfig.color]
        )}>
          {isZh ? diffConfig.labelZh : diffConfig.labelEn}
        </span>
      </div>

      {/* Name */}
      <h3 className={cn(
        'font-semibold text-base mb-1',
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {isZh ? device.nameZh : device.nameEn}
      </h3>

      {/* Description */}
      <p className={cn(
        'text-sm line-clamp-2',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? device.descriptionZh : device.descriptionEn}
      </p>

      {/* Formula */}
      {device.mathFormula && (
        <div className={cn(
          'mt-3 px-2 py-1 rounded-md text-xs font-mono',
          theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-gray-100 text-cyan-700'
        )}>
          {MathText({text:device.mathFormula})}
        </div>
      )}
    </button>
  )
}

// ============================================
// Device Detail Panel
// ============================================

interface DeviceDetailProps {
  device: Device
  onClose: () => void
}

function DeviceDetail({ device, onClose }: DeviceDetailProps) {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'h-full flex flex-col border-l',
      theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'p-4 border-b flex items-center justify-between',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{device.icon}</span>
          <div>
            <h2 className={cn(
              'font-bold text-lg',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? device.nameZh : device.nameEn}
            </h2>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? device.nameEn : device.nameZh}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={cn(
            'p-2 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Description */}
        <section>
          <h3 className={cn(
            'text-sm font-semibold mb-2 flex items-center gap-2',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
          )}>
            <Info className="w-4 h-4" />
            {t('opticalDesign.device.description')}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? device.descriptionZh : device.descriptionEn}
          </p>
        </section>

        {/* Working Principle */}
        <section>
          <h3 className={cn(
            'text-sm font-semibold mb-2 flex items-center gap-2',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
          )}>
            <Zap className="w-4 h-4" />
            {t('opticalDesign.device.principle')}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? device.principleZh : device.principleEn}
          </p>
        </section>

        {/* Formula */}
        {device.mathFormula && (
          <section>
            <h3 className={cn(
              'text-sm font-semibold mb-2 flex items-center gap-2',
              theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
            )}>
              <FlaskConical className="w-4 h-4" />
              {t('opticalDesign.device.formula')}
            </h3>
            <div className={cn(
              'p-3 rounded-lg font-mono text-center text-lg',
              theme === 'dark' ? 'bg-slate-800 text-purple-400' : 'bg-purple-50 text-purple-700'
            )}>
              {MathText({ text: device.mathFormula })}
            </div>
          </section>
        )}

        {/* Specifications */}
        {device.specifications && device.specifications.length > 0 && (
          <section>
            <h3 className={cn(
              'text-sm font-semibold mb-2 flex items-center gap-2',
              theme === 'dark' ? 'text-green-400' : 'text-green-700'
            )}>
              <Box className="w-4 h-4" />
              {t('opticalDesign.device.specifications')}
            </h3>
            <div className={cn(
              'rounded-lg border overflow-hidden',
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            )}>
              {device.specifications.map((spec, idx) => (
                <div
                  key={spec.key}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-sm',
                    idx % 2 === 0
                      ? (theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50')
                      : '',
                    idx !== device.specifications!.length - 1 && (theme === 'dark' ? 'border-b border-slate-700' : 'border-b border-gray-200')
                  )}
                >
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {spec.key}
                  </span>
                  <span className={cn(
                    'font-medium',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {MathText({ text: isZh ? spec.valueZh : spec.valueEn })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Applications */}
        {device.applications && (
          <section>
            <h3 className={cn(
              'text-sm font-semibold mb-2 flex items-center gap-2',
              theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
            )}>
              <BookOpen className="w-4 h-4" />
              {t('opticalDesign.device.applications')}
            </h3>
            <ul className="space-y-2">
              {(isZh ? device.applications.zh : device.applications.en).map((app, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'flex items-start gap-2 text-sm',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  <span className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}>•</span>
                  {app}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Devices */}
        {device.relatedDevices && device.relatedDevices.length > 0 && (
          <section>
            <h3 className={cn(
              'text-sm font-semibold mb-2 flex items-center gap-2',
              theme === 'dark' ? 'text-pink-400' : 'text-pink-700'
            )}>
              <Layers className="w-4 h-4" />
              {t('opticalDesign.device.relatedDevices')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {device.relatedDevices.map((relatedId) => {
                const related = DEVICES.find((d) => d.id === relatedId)
                if (!related) return null
                return (
                  <span
                    key={relatedId}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium border',
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-gray-300'
                        : 'bg-gray-100 border-gray-200 text-gray-700'
                    )}
                  >
                    {related.icon} {isZh ? related.nameZh : related.nameEn}
                  </span>
                )
              })}
            </div>
          </section>
        )}

        {/* Try in Bench */}
        {device.benchComponentType && (
          <Link
            to={`/studio?module=design&component=${device.benchComponentType}` as string}
            className={cn(
              'flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all',
              'hover:scale-[1.02]',
              theme === 'dark'
                ? 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400'
                : 'border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-500'
            )}
          >
            <Zap className="w-4 h-4" />
            <span className="font-medium text-sm">{t('opticalDesign.device.tryInBench')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

// ============================================
// Main Module Component
// ============================================

export function DeviceGalleryModule() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all')
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Filter devices
  const filteredDevices = useMemo(() => {
    return DEVICES.filter((device) => {
      // Category filter
      if (selectedCategory !== 'all' && device.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          device.nameEn.toLowerCase().includes(query) ||
          device.nameZh.includes(query) ||
          device.descriptionEn.toLowerCase().includes(query) ||
          device.descriptionZh.includes(query)
        )
      }

      return true
    })
  }, [searchQuery, selectedCategory])

  // Group devices by category
  const groupedDevices = useMemo(() => {
    if (selectedCategory !== 'all') {
      return { [selectedCategory]: filteredDevices }
    }

    const groups: Record<string, Device[]> = {}
    filteredDevices.forEach((device) => {
      if (!groups[device.category]) {
        groups[device.category] = []
      }
      groups[device.category].push(device)
    })
    return groups
  }, [filteredDevices, selectedCategory])

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className={cn(
        'flex-1 flex flex-col overflow-hidden',
        selectedDevice ? 'w-[60%]' : 'w-full'
      )}>
        {/* Header */}
        <div className={cn(
          'p-4 border-b',
          theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
        )}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t('opticalDesign.modules.devices.title')}
              </h1>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {filteredDevices.length} {t('opticalDesign.devicesCount')}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('opticalDesign.searchPlaceholder')}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors',
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-cyan-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500',
                'focus:outline-none focus:ring-2 focus:ring-cyan-400/20'
              )}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {DEVICE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as DeviceCategory | 'all')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? (theme === 'dark'
                          ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                          : 'bg-cyan-100 text-cyan-700 border border-cyan-300')
                      : (theme === 'dark'
                          ? 'bg-slate-800 text-gray-400 border border-slate-700 hover:border-slate-600'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300')
                  )}
                >
                  {CATEGORY_ICONS[cat.icon]}
                  <span>{isZh ? cat.labelZh : cat.labelEn}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Device Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedDevices).length === 0 ? (
            <div className={cn(
              'flex flex-col items-center justify-center h-64 text-center',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">{t('opticalDesign.noDevicesFound')}</p>
              <p className="text-sm">{t('opticalDesign.tryDifferentSearch')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedDevices).map(([categoryId, devices]) => {
                const category = DEVICE_CATEGORIES.find((c) => c.id === categoryId)
                return (
                  <section key={categoryId}>
                    {selectedCategory === 'all' && category && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className={cn(
                          'p-2 rounded-lg',
                          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                        )}>
                          {CATEGORY_ICONS[category.icon]}
                        </div>
                        <h2 className={cn(
                          'text-lg font-semibold',
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {isZh ? category.labelZh : category.labelEn}
                        </h2>
                        <span className={cn(
                          'ml-2 px-2 py-0.5 rounded-full text-xs',
                          theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        )}>
                          {devices.length}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {devices.map((device) => (
                        <DeviceCard
                          key={device.id}
                          device={device}
                          isSelected={selectedDevice?.id === device.id}
                          onClick={() => setSelectedDevice(device)}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedDevice && (
        <div className="w-[40%] min-w-[360px]">
          <DeviceDetail
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
          />
        </div>
      )}
    </div>
  )
}

export default DeviceGalleryModule
