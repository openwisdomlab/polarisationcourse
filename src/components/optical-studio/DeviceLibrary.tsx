/**
 * Device Library Component - 器件库组件 (改进版)
 *
 * 改进:
 * - 更紧凑的设备卡片设计
 * - 分类筛选条直接显示在行内
 * - 可折叠为单行标题
 * - 支持键盘快捷键 (1-7)
 * - 悬停时显示快速添加按钮
 */

import { useState, useMemo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Search, ChevronRight, ChevronLeft, Plus, Book, X, Maximize2, Minimize2
} from 'lucide-react'
import { DeviceIconMap, DefaultDeviceIcon } from '@/components/icons'
import {
  DEVICES,
  DEVICE_CATEGORIES,
  type Device,
  type DeviceCategory,
} from '@/data'
import { useOpticalBenchStore, type BenchComponentType } from '@/stores/opticalBenchStore'

// ============================================
// Compact Device Card Component
// ============================================

interface CompactDeviceCardProps {
  device: Device
  isSelected: boolean
  onClick: () => void
  onAddToBench?: () => void
  shortcutKey?: string
}

function CompactDeviceCard({ device, isSelected, onClick, onAddToBench, shortcutKey }: CompactDeviceCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const IconComponent = DeviceIconMap[device.id] || DefaultDeviceIcon

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex-shrink-0 w-32 rounded-lg border p-1.5 cursor-pointer transition-all',
        'hover:shadow-md group relative',
        isSelected
          ? theme === 'dark'
            ? 'bg-indigo-500/20 border-indigo-500'
            : 'bg-indigo-50 border-indigo-400'
          : theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
            : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-center gap-1.5">
        <div className={cn(
          'w-6 h-6 rounded flex items-center justify-center flex-shrink-0 overflow-hidden',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        )}>
          <IconComponent size={18} theme={theme} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-medium text-[10px] line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? device.nameZh : device.nameEn}
          </h4>
        </div>
        {shortcutKey && (
          <kbd className={cn(
            'text-[9px] px-1 py-0.5 rounded flex-shrink-0',
            theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
          )}>
            {shortcutKey}
          </kbd>
        )}
      </div>

      {/* Quick Add Button (shows on hover) */}
      {onAddToBench && device.benchComponentType && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToBench()
          }}
          className={cn(
            'absolute -right-1 -top-1 w-5 h-5 rounded-full flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-all shadow-md',
            theme === 'dark'
              ? 'bg-violet-500 text-white hover:bg-violet-400'
              : 'bg-violet-500 text-white hover:bg-violet-600'
          )}
          title={isZh ? '添加到光路' : 'Add to bench'}
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

// ============================================
// Category Filter Pills
// ============================================

interface CategoryPillsProps {
  selectedCategory: DeviceCategory | 'all'
  onSelectCategory: (category: DeviceCategory | 'all') => void
}

function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="flex items-center gap-1">
      {DEVICE_CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={cn(
            'px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors whitespace-nowrap',
            selectedCategory === cat.id
              ? theme === 'dark'
                ? 'bg-indigo-500/30 text-indigo-300'
                : 'bg-indigo-100 text-indigo-700'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          )}
        >
          {isZh ? cat.labelZh : cat.labelEn}
        </button>
      ))}
    </div>
  )
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const addComponent = useOpticalBenchStore(state => state.addComponent)

  // Keyboard shortcut mapping for quick-add components
  const shortcutMapping: Record<string, string> = {
    'linear-polarizer': '1',
    'pbs': '2',
    'quarter-wave-plate': '3',
    'half-wave-plate': '4',
    'calcite-crystal': '5',
    'photodetector': '6',
    'optical-mirror': '7',
  }

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

  // Scroll controls
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <div className={cn(
      'flex-shrink-0 border-b transition-all duration-300',
      collapsed ? 'h-8' : 'h-auto',
      theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white/70 border-gray-200'
    )}>
      {/* Header - always visible */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-1.5',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-100'
      )}>
        {/* Title & Collapse Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Book className={cn('w-3.5 h-3.5', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')} />
          <h2 className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '器件库' : 'Devices'}
          </h2>
        </div>

        {!collapsed && (
          <>
            {/* Category Pills */}
            <div className="flex-shrink-0 hidden sm:flex">
              <CategoryPills
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              )} />
              <input
                type="text"
                placeholder={isZh ? '搜索...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-28 pl-6 pr-2 py-1 rounded-md border text-[10px]',
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={cn(
                    'absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded',
                    theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                  )}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Scroll Controls */}
            <div className="flex items-center gap-0.5 ml-auto">
              <button
                onClick={() => scroll('left')}
                className={cn(
                  'p-1 rounded transition-colors',
                  theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className={cn(
                  'p-1 rounded transition-colors',
                  theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* Expand/Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-1 rounded transition-colors flex-shrink-0',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
            title={collapsed ? (isZh ? '展开' : 'Expand') : (isZh ? '折叠' : 'Collapse')}
          >
            {collapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Device Cards - Horizontal scrollable */}
      {!collapsed && (
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden px-3 pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
        >
          <div className="flex gap-1.5 min-w-max">
            {filteredDevices.map(device => (
              <CompactDeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice?.id === device.id}
                onClick={() => onSelectDevice(selectedDevice?.id === device.id ? null : device)}
                onAddToBench={() => handleAddToBench(device)}
                shortcutKey={shortcutMapping[device.id]}
              />
            ))}
            {filteredDevices.length === 0 && (
              <p className={cn('text-xs py-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
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
