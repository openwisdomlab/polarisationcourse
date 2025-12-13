/**
 * Device Library Component - 器件库组件
 *
 * Horizontal scrollable bar showing optical devices with:
 * - Search functionality
 * - Category filtering
 * - Quick add to bench
 */

import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/shared'
import {
  Search, ChevronRight, Plus, Book, Layers, Circle, Triangle
} from 'lucide-react'
import { DeviceIconMap, DefaultDeviceIcon } from '@/components/icons'
import {
  DEVICES,
  DEVICE_CATEGORIES,
  DIFFICULTY_CONFIG,
  type Device,
  type DeviceCategory,
} from '@/data'
import { useOpticalBenchStore, type BenchComponentType } from '@/stores/opticalBenchStore'

// ============================================
// Device Card Component
// ============================================

interface DeviceCardProps {
  device: Device
  isSelected: boolean
  onClick: () => void
  onAddToBench?: () => void
}

function DeviceCard({ device, isSelected, onClick, onAddToBench }: DeviceCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]
  const IconComponent = DeviceIconMap[device.id] || DefaultDeviceIcon

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex-shrink-0 w-48 rounded-lg border p-2 cursor-pointer transition-all',
        'hover:shadow-md group',
        isSelected
          ? theme === 'dark'
            ? 'bg-indigo-500/20 border-indigo-500'
            : 'bg-indigo-50 border-indigo-400'
          : theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        )}>
          <IconComponent size={24} theme={theme} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-medium text-xs line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? device.nameZh : device.nameEn}
          </h4>
          <Badge color={difficulty.color} size="sm">
            {isZh ? difficulty.labelZh : difficulty.labelEn}
          </Badge>
        </div>
        {onAddToBench && device.benchComponentType && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToBench()
            }}
            className={cn(
              'p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0',
              theme === 'dark'
                ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
            )}
            title={isZh ? '添加到光路' : 'Add to bench'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// Category Icon Map
// ============================================

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'all': return Layers
    case 'polarizers': return Circle
    case 'splitters': return Triangle
    default: return Layers
  }
}

// ============================================
// Main Device Library Component
// ============================================

interface DeviceLibraryProps {
  selectedDevice: Device | null
  onSelectDevice: (device: Device | null) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function DeviceLibrary({
  selectedDevice,
  onSelectDevice,
  collapsed = false,
  onToggleCollapse,
}: DeviceLibraryProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const addComponent = useOpticalBenchStore(state => state.addComponent)

  // Filter devices
  const filteredDevices = useMemo(() => {
    return DEVICES.filter(device => {
      const matchesCategory = selectedCategory === 'all' || device.category === selectedCategory
      const matchesSearch = searchQuery === '' ||
        device.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.nameZh.includes(searchQuery)
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  // Add device to bench
  const handleAddToBench = useCallback((device: Device) => {
    if (device.benchComponentType) {
      addComponent(device.benchComponentType as BenchComponentType)
    }
  }, [addComponent])

  return (
    <div className={cn(
      'flex-shrink-0 border-b transition-all duration-300',
      collapsed ? 'h-10' : 'h-auto',
      theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white/70 border-gray-200'
    )}>
      {/* Header with collapse toggle */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-100'
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Book className={cn('w-4 h-4', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')} />
            <h2 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? '器件库' : 'Device Library'}
            </h2>
          </div>
          {!collapsed && (
            <>
              {/* Search */}
              <div className="relative">
                <Search className={cn(
                  'absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )} />
                <input
                  type="text"
                  placeholder={isZh ? '搜索...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-40 pl-7 pr-2 py-1 rounded-lg border text-xs',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  )}
                />
              </div>
              {/* Category Filter */}
              <div className="flex items-center gap-1">
                {DEVICE_CATEGORIES.map(cat => {
                  const Icon = getCategoryIcon(cat.id)
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1',
                        selectedCategory === cat.id
                          ? theme === 'dark'
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : 'bg-indigo-100 text-indigo-700'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {isZh ? cat.labelZh : cat.labelEn}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-1 rounded transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <ChevronRight className={cn('w-4 h-4 transition-transform', collapsed ? 'rotate-90' : '-rotate-90')} />
          </button>
        )}
      </div>

      {/* Device List - Horizontal scrollable */}
      {!collapsed && (
        <div className="overflow-x-auto overflow-y-hidden px-4 py-2">
          <div className="flex gap-2 min-w-max">
            {filteredDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice?.id === device.id}
                onClick={() => onSelectDevice(device)}
                onAddToBench={() => handleAddToBench(device)}
              />
            ))}
            {filteredDevices.length === 0 && (
              <p className={cn('text-sm py-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                {isZh ? '未找到器件' : 'No devices found'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DeviceLibrary
