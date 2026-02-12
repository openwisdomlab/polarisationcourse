/**
 * Hardware Page - UC2-based Polarization Hardware Modules
 * 硬件页面 - 基于UC2框架的偏振光硬件模块
 */

import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import {
  Home, Box, Layers, FileSpreadsheet, AlertTriangle, Server,
  ChevronRight, ExternalLink, Cpu, Eye, Settings2, Beaker
} from 'lucide-react'

// Data imports
import {
  UC2_MODULES, MODULE_CATEGORIES,
  LIGHT_PATH_CONFIGURATIONS, CONFIGURATION_DIFFICULTY,
  BOM_CONFIGS, calculateBOMTotal, exportBOMToCSV, BOM_CATEGORIES
} from '@/data'
import type { UC2Module, LightPathConfiguration, BOMConfig } from '@/data/types'

// Shared components
import {
  SearchInput, FilterSelect, FilterBar, Tabs, Badge,
  Card, CardHeader, CardContent, CardGrid, ExpandableCard,
  SpecList, WarningBox, InfoBox, EmptyState,
  ExportButton, PrintButton, ActionBar, Printable, downloadCSV
} from '@/components/shared'

// ===== System Architecture SVG Diagram =====
function SystemArchitectureDiagram() {
  const { theme } = useTheme()
  const strokeColor = theme === 'dark' ? '#94a3b8' : '#64748b'
  const fillBg = theme === 'dark' ? '#1e293b' : '#f8fafc'
  const accentColor = '#22d3ee'

  return (
    <svg viewBox="0 0 800 300" className="w-full h-auto max-w-4xl mx-auto">
      {/* Background */}
      <rect x="0" y="0" width="800" height="300" fill={fillBg} rx="8" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill={strokeColor} fontSize="16" fontWeight="bold">
        UC2 Polarization System Architecture
      </text>

      {/* Light Source Module */}
      <g transform="translate(50, 80)">
        <rect width="100" height="80" fill={accentColor} fillOpacity="0.2" stroke={accentColor} strokeWidth="2" rx="8" />
        <circle cx="50" cy="30" r="15" fill="#fbbf24" />
        <text x="50" y="60" textAnchor="middle" fill={strokeColor} fontSize="11">Light Source</text>
        <text x="50" y="72" textAnchor="middle" fill={strokeColor} fontSize="9">LED/Laser</text>
      </g>

      {/* Arrow 1 */}
      <line x1="150" y1="120" x2="180" y2="120" stroke={accentColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Polarizer Module */}
      <g transform="translate(180, 80)">
        <rect width="100" height="80" fill="#a78bfa" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="2" rx="8" />
        <rect x="30" y="20" width="40" height="40" fill="none" stroke="#a78bfa" strokeWidth="2" />
        <line x1="35" y1="25" x2="65" y2="55" stroke="#a78bfa" strokeWidth="2" />
        <text x="50" y="72" textAnchor="middle" fill={strokeColor} fontSize="11">Polarizer</text>
      </g>

      {/* Arrow 2 */}
      <line x1="280" y1="120" x2="310" y2="120" stroke={accentColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Sample Stage */}
      <g transform="translate(310, 80)">
        <rect width="100" height="80" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2" rx="8" />
        <circle cx="50" cy="30" r="20" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4" />
        <rect x="40" y="35" width="20" height="15" fill="#22c55e" fillOpacity="0.5" />
        <text x="50" y="72" textAnchor="middle" fill={strokeColor} fontSize="11">Sample Stage</text>
      </g>

      {/* Arrow 3 */}
      <line x1="410" y1="120" x2="440" y2="120" stroke={accentColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Analyzer */}
      <g transform="translate(440, 80)">
        <rect width="100" height="80" fill="#a78bfa" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="2" rx="8" />
        <rect x="30" y="20" width="40" height="40" fill="none" stroke="#a78bfa" strokeWidth="2" />
        <line x1="35" y1="55" x2="65" y2="25" stroke="#a78bfa" strokeWidth="2" />
        <text x="50" y="72" textAnchor="middle" fill={strokeColor} fontSize="11">Analyzer</text>
      </g>

      {/* Arrow 4 */}
      <line x1="540" y1="120" x2="570" y2="120" stroke={accentColor} strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Camera */}
      <g transform="translate(570, 80)">
        <rect width="100" height="80" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="2" rx="8" />
        <rect x="30" y="20" width="40" height="30" fill="none" stroke="#f97316" strokeWidth="2" rx="4" />
        <circle cx="50" cy="35" r="10" fill="none" stroke="#f97316" strokeWidth="2" />
        <text x="50" y="72" textAnchor="middle" fill={strokeColor} fontSize="11">Camera</text>
      </g>

      {/* Controller at bottom */}
      <g transform="translate(270, 200)">
        <rect width="260" height="60" fill="#64748b" fillOpacity="0.2" stroke="#64748b" strokeWidth="2" rx="8" />
        <rect x="20" y="15" width="60" height="30" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" rx="4" />
        <text x="50" y="35" textAnchor="middle" fill={strokeColor} fontSize="10">ESP32</text>
        <circle cx="120" cy="30" r="8" fill="#fbbf24" />
        <circle cx="145" cy="30" r="8" fill="#22c55e" />
        <circle cx="170" cy="30" r="8" fill="#ef4444" />
        <rect x="195" y="15" width="45" height="30" fill="none" stroke="#64748b" rx="4" />
        <text x="217" y="35" textAnchor="middle" fill={strokeColor} fontSize="9">USB</text>
        <text x="130" y="52" textAnchor="middle" fill={strokeColor} fontSize="11">Controller Board</text>
      </g>

      {/* Control lines */}
      <line x1="310" y1="160" x2="310" y2="200" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
      <line x1="360" y1="160" x2="400" y2="200" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
      <line x1="490" y1="160" x2="450" y2="200" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
      <line x1="620" y1="160" x2="530" y2="200" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={accentColor} />
        </marker>
      </defs>

      {/* Legend */}
      <g transform="translate(680, 80)">
        <text x="0" y="0" fill={strokeColor} fontSize="10" fontWeight="bold">Legend:</text>
        <rect x="0" y="10" width="12" height="12" fill={accentColor} fillOpacity="0.3" />
        <text x="18" y="20" fill={strokeColor} fontSize="9">Optical</text>
        <rect x="0" y="28" width="12" height="12" fill="#22c55e" fillOpacity="0.3" />
        <text x="18" y="38" fill={strokeColor} fontSize="9">Mechanical</text>
        <rect x="0" y="46" width="12" height="12" fill="#f97316" fillOpacity="0.3" />
        <text x="18" y="56" fill={strokeColor} fontSize="9">Imaging</text>
        <rect x="0" y="64" width="12" height="12" fill="#64748b" fillOpacity="0.3" />
        <text x="18" y="74" fill={strokeColor} fontSize="9">Control</text>
      </g>
    </svg>
  )
}

// ===== Module Card Component =====
interface ModuleCardProps {
  module: UC2Module
  onClick: () => void
}

function ModuleCard({ module, onClick }: ModuleCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const categoryInfo = MODULE_CATEGORIES[module.category]
  const difficultyColors = {
    beginner: 'green',
    intermediate: 'yellow',
    advanced: 'red'
  } as const

  // Generate module icon based on category
  const ModuleIcon = () => {
    const iconClass = 'w-6 h-6'
    switch (module.category) {
      case 'optical':
        return <Eye className={cn(iconClass, 'text-cyan-500')} />
      case 'electronic':
        return <Cpu className={cn(iconClass, 'text-orange-500')} />
      case 'mechanical':
        return <Settings2 className={cn(iconClass, 'text-green-500')} />
      case 'sample':
        return <Beaker className={cn(iconClass, 'text-purple-500')} />
      default:
        return <Box className={cn(iconClass, 'text-gray-500')} />
    }
  }

  return (
    <Card hoverable onClick={onClick}>
      <CardHeader
        title={isZh ? module.nameZh : module.name}
        subtitle={isZh ? categoryInfo.labelZh : categoryInfo.label}
        icon={<ModuleIcon />}
        badge={
          <Badge color={difficultyColors[module.difficulty]} size="sm">
            {module.difficulty}
          </Badge>
        }
      />
      <CardContent>
        <p className={cn(
          'text-sm line-clamp-2',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isZh ? module.descriptionZh : module.description}
        </p>

        {module.safetyNotes && (
          <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="w-3 h-3" />
            <span>{isZh ? '有安全提示' : 'Safety note'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ===== Module Detail Modal =====
interface ModuleDetailProps {
  module: UC2Module | null
  onClose: () => void
}

function ModuleDetail({ module, onClose }: ModuleDetailProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  if (!module) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className={cn(
          'w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl p-6',
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        )}
        onClick={e => e.stopPropagation()}
      >
        <h2 className={cn(
          'text-xl font-bold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? module.nameZh : module.name}
        </h2>

        <Badge color="cyan" className="mb-4">
          {isZh ? MODULE_CATEGORIES[module.category].labelZh : MODULE_CATEGORIES[module.category].label}
        </Badge>

        <p className={cn(
          'text-sm mb-4',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {isZh ? module.descriptionZh : module.description}
        </p>

        <h3 className={cn(
          'font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '规格参数' : 'Specifications'}
        </h3>
        <SpecList specs={module.specifications} className="mb-4" />

        {module.compatibleWith.length > 0 && (
          <div className="mb-4">
            <h3 className={cn(
              'font-semibold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '兼容模块' : 'Compatible With'}
            </h3>
            <div className="flex flex-wrap gap-1">
              {module.compatibleWith.map(id => (
                <Badge key={id} color="gray">{id}</Badge>
              ))}
            </div>
          </div>
        )}

        {module.safetyNotes && (
          <WarningBox className="mb-4">
            {isZh ? module.safetyNotesZh : module.safetyNotes}
          </WarningBox>
        )}

        <button
          onClick={onClose}
          className={cn(
            'w-full py-2 rounded-lg font-medium transition-colors',
            theme === 'dark'
              ? 'bg-slate-700 text-white hover:bg-slate-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          )}
        >
          {isZh ? '关闭' : 'Close'}
        </button>
      </div>
    </div>
  )
}

// ===== Configuration Card =====
interface ConfigCardProps {
  config: LightPathConfiguration
}

function ConfigCard({ config }: ConfigCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const diffInfo = CONFIGURATION_DIFFICULTY[config.difficulty]
  const diffColors = {
    basic: 'green',
    intermediate: 'yellow',
    advanced: 'red'
  } as const

  return (
    <ExpandableCard
      title={isZh ? config.nameZh : config.name}
      subtitle={`${config.modules.length} ${isZh ? '个模块' : 'modules'}`}
      badge={<Badge color={diffColors[config.difficulty]}>{isZh ? diffInfo.labelZh : diffInfo.label}</Badge>}
      icon={<Layers className="w-5 h-5 text-cyan-500" />}
    >
      <p className={cn(
        'text-sm mb-4',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        {isZh ? config.descriptionZh : config.description}
      </p>

      <h4 className={cn(
        'font-semibold text-sm mb-2',
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {isZh ? '学习目标' : 'Learning Objectives'}
      </h4>
      <ul className={cn(
        'text-sm space-y-1 mb-4',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {(isZh ? config.learningObjectivesZh : config.learningObjectives).map((obj, i) => (
          <li key={i} className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
            {obj}
          </li>
        ))}
      </ul>

      <h4 className={cn(
        'font-semibold text-sm mb-2',
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {isZh ? '搭建步骤' : 'Setup Steps'}
      </h4>
      <ol className="space-y-2">
        {config.steps.map(step => (
          <li key={step.order} className={cn(
            'text-sm p-2 rounded-lg',
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
          )}>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 flex-shrink-0 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center">
                {step.order}
              </span>
              <div>
                <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                  {isZh ? step.actionZh : step.action}
                </p>
                {step.notes && (
                  <p className={cn(
                    'text-xs mt-1',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {isZh ? step.notesZh : step.notes}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </ExpandableCard>
  )
}

// ===== BOM Table Component =====
interface BOMTableProps {
  config: BOMConfig
  language: 'en' | 'zh'
}

function BOMTable({ config, language }: BOMTableProps) {
  const { theme } = useTheme()
  const isZh = language === 'zh'
  const total = calculateBOMTotal(config)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={cn(
            'border-b',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}>
            <th className="text-left py-2 px-3 font-medium">{isZh ? '名称' : 'Name'}</th>
            <th className="text-left py-2 px-3 font-medium">{isZh ? '类别' : 'Category'}</th>
            <th className="text-center py-2 px-3 font-medium">{isZh ? '数量' : 'Qty'}</th>
            <th className="text-right py-2 px-3 font-medium">{isZh ? '单价' : 'Price'}</th>
            <th className="text-right py-2 px-3 font-medium">{isZh ? '小计' : 'Subtotal'}</th>
          </tr>
        </thead>
        <tbody>
          {config.items.map(item => {
            const catInfo = BOM_CATEGORIES[item.category]
            return (
              <tr
                key={item.id}
                className={cn(
                  'border-b',
                  theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
                )}
              >
                <td className="py-2 px-3">
                  <div>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {isZh ? item.nameZh : item.name}
                    </span>
                    {item.essential && (
                      <Badge color="cyan" size="sm" className="ml-2">
                        {isZh ? '必需' : 'Essential'}
                      </Badge>
                    )}
                  </div>
                  {item.notes && (
                    <p className={cn(
                      'text-xs',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {isZh ? item.notesZh || item.notes : item.notes}
                    </p>
                  )}
                </td>
                <td className="py-2 px-3">
                  <Badge color={catInfo.color} size="sm">
                    {isZh ? catInfo.labelZh : catInfo.label}
                  </Badge>
                </td>
                <td className="py-2 px-3 text-center">{item.quantity}</td>
                <td className="py-2 px-3 text-right">
                  {item.unitPrice ? `€${item.unitPrice.toFixed(2)}` : '-'}
                </td>
                <td className="py-2 px-3 text-right font-medium">
                  {item.unitPrice ? `€${(item.unitPrice * item.quantity).toFixed(2)}` : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className={cn(
            'font-bold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            <td colSpan={4} className="py-3 px-3 text-right">
              {isZh ? '总计' : 'Total'}
            </td>
            <td className="py-3 px-3 text-right text-cyan-500">
              €{total.total.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

// ===== Main Hardware Page =====
export function HardwarePage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // State
  const [activeTab, setActiveTab] = useState('modules')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [selectedModule, setSelectedModule] = useState<UC2Module | null>(null)
  const [selectedBOM, setSelectedBOM] = useState('bom-core')

  // Filtered modules
  const filteredModules = useMemo(() => {
    return UC2_MODULES.filter(module => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = module.name.toLowerCase().includes(query) ||
                         module.nameZh.includes(query)
        const matchDesc = module.description.toLowerCase().includes(query) ||
                         module.descriptionZh.includes(query)
        if (!matchName && !matchDesc) return false
      }

      // Category filter
      if (categoryFilter && module.category !== categoryFilter) return false

      // Difficulty filter
      if (difficultyFilter && module.difficulty !== difficultyFilter) return false

      return true
    })
  }, [searchQuery, categoryFilter, difficultyFilter])

  // Tabs configuration
  const tabs = [
    { id: 'modules', label: 'Modules', labelZh: '模块清单', icon: <Box className="w-4 h-4" /> },
    { id: 'configs', label: 'Light Paths', labelZh: '光路配置', icon: <Layers className="w-4 h-4" /> },
    { id: 'bom', label: 'BOM', labelZh: '物料清单', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', labelZh: '安全提示', icon: <AlertTriangle className="w-4 h-4" /> }
  ]

  // Category options for filter
  const categoryOptions = Object.entries(MODULE_CATEGORIES).map(([key, val]) => ({
    value: key,
    label: val.label,
    labelZh: val.labelZh
  }))

  // Difficulty options
  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', labelZh: '入门' },
    { value: 'intermediate', label: 'Intermediate', labelZh: '进阶' },
    { value: 'advanced', label: 'Advanced', labelZh: '高级' }
  ]

  // BOM options
  const bomOptions = BOM_CONFIGS.map(c => ({
    value: c.id,
    label: c.name,
    labelZh: c.nameZh
  }))

  const currentBOM = BOM_CONFIGS.find(c => c.id === selectedBOM)

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{isZh ? '首页' : 'Home'}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-500" />
              <h1 className={cn(
                'text-lg font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? 'UC2 偏振硬件' : 'UC2 Polarization Hardware'}
              </h1>
            </div>
          </div>
          <LanguageThemeSwitcher compact />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 print:px-0">
        {/* System Architecture */}
        <Card className="print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-cyan-500" />
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '系统架构' : 'System Architecture'}
            </h2>
          </div>
          <SystemArchitectureDiagram />
          <InfoBox className="mt-4">
            {isZh
              ? '基于 OpenUC2 开源框架设计，模块化结构支持灵活配置。'
              : 'Based on OpenUC2 open-source framework, modular design allows flexible configuration.'}
            <a
              href="https://github.com/openUC2/UC2-GIT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 ml-2 text-cyan-500 hover:underline"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </InfoBox>
        </Card>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="print:hidden" />

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <FilterBar>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={isZh ? '搜索模块...' : 'Search modules...'}
                className="w-full sm:w-64"
              />
              <FilterSelect
                label="Category"
                labelZh="类别"
                value={categoryFilter}
                options={categoryOptions}
                onChange={setCategoryFilter}
              />
              <FilterSelect
                label="Difficulty"
                labelZh="难度"
                value={difficultyFilter}
                options={difficultyOptions}
                onChange={setDifficultyFilter}
              />
            </FilterBar>

            {filteredModules.length > 0 ? (
              <CardGrid columns={3}>
                {filteredModules.map(module => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onClick={() => setSelectedModule(module)}
                  />
                ))}
              </CardGrid>
            ) : (
              <EmptyState
                icon={<Box className="w-8 h-8 text-gray-400" />}
                title={isZh ? '未找到模块' : 'No modules found'}
                description={isZh ? '尝试调整搜索条件' : 'Try adjusting your search filters'}
              />
            )}
          </div>
        )}

        {/* Configurations Tab */}
        {activeTab === 'configs' && (
          <div className="space-y-4">
            {LIGHT_PATH_CONFIGURATIONS.map(config => (
              <ConfigCard key={config.id} config={config} />
            ))}
          </div>
        )}

        {/* BOM Tab */}
        {activeTab === 'bom' && currentBOM && (
          <div className="space-y-4">
            <ActionBar>
              <FilterSelect
                label="Configuration"
                labelZh="配置"
                value={selectedBOM}
                options={bomOptions}
                onChange={setSelectedBOM}
              />
              <div className="flex-1" />
              <ExportButton
                onClick={() => {
                  const csv = exportBOMToCSV(currentBOM, isZh ? 'zh' : 'en')
                  downloadCSV(csv, `${currentBOM.id}-bom.csv`)
                }}
              />
              <PrintButton />
            </ActionBar>

            <Printable title={isZh ? currentBOM.nameZh : currentBOM.name}>
              <Card>
                <h2 className={cn(
                  'text-lg font-bold mb-4',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? currentBOM.nameZh : currentBOM.name}
                </h2>
                <BOMTable config={currentBOM} language={isZh ? 'zh' : 'en'} />
              </Card>
            </Printable>
          </div>
        )}

        {/* Safety Tab */}
        {activeTab === 'safety' && (
          <div className="space-y-4">
            <Card>
              <h2 className={cn(
                'text-lg font-bold mb-4 flex items-center gap-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                {isZh ? '教学与安全注意事项' : 'Teaching & Safety Guidelines'}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className={cn(
                    'font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '激光安全' : 'Laser Safety'}
                  </h3>
                  <WarningBox>
                    {isZh
                      ? '使用二类激光器时，切勿直视光束。确保激光路径上没有反射面。'
                      : 'When using Class 2 lasers, never stare into the beam. Ensure no reflective surfaces in beam path.'}
                  </WarningBox>
                </div>

                <div>
                  <h3 className={cn(
                    'font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '光学元件处理' : 'Optical Element Handling'}
                  </h3>
                  <ul className={cn(
                    'space-y-1 text-sm',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                      {isZh ? '握住边缘操作，避免触碰光学表面' : 'Handle by edges, avoid touching optical surfaces'}
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                      {isZh ? '使用镜头纸和专用清洁剂清洁' : 'Clean with lens paper and optical cleaner'}
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                      {isZh ? '方解石晶体易碎，小心搬运' : 'Calcite crystals are fragile, handle with care'}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className={cn(
                    'font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '电子设备' : 'Electronic Equipment'}
                  </h3>
                  <ul className={cn(
                    'space-y-1 text-sm',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                      {isZh ? '使用5V USB供电，避免过压' : 'Use 5V USB power, avoid over-voltage'}
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                      {isZh ? '避免短路，确保正确连接' : 'Avoid short circuits, ensure correct connections'}
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                      {isZh ? 'LED热量：长时间使用需注意散热' : 'LED heat: ensure ventilation during extended use'}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className={cn(
                    'font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '教学建议' : 'Teaching Tips'}
                  </h3>
                  <InfoBox>
                    {isZh
                      ? '建议教师先熟悉所有模块，准备好备用偏振片。让学生分组操作，每组2-3人最佳。'
                      : 'Teachers should familiarize with all modules first. Prepare spare polarizers. Student groups of 2-3 work best.'}
                  </InfoBox>
                </div>
              </div>
            </Card>

            {/* API Interface Reference (placeholder) */}
            <Card>
              <h2 className={cn(
                'text-lg font-bold mb-4 flex items-center gap-2',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                <Cpu className="w-5 h-5 text-cyan-500" />
                {isZh ? '控制接口参考' : 'Control Interface Reference'}
              </h2>

              <p className={cn(
                'text-sm mb-4',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? 'ESP32控制板支持REST API和MQTT协议。以下是接口字段表：'
                  : 'ESP32 controller supports REST API and MQTT protocol. Interface fields below:'}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={cn(
                      'border-b',
                      theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                    )}>
                      <th className="text-left py-2 px-3">{isZh ? '端点' : 'Endpoint'}</th>
                      <th className="text-left py-2 px-3">{isZh ? '方法' : 'Method'}</th>
                      <th className="text-left py-2 px-3">{isZh ? '参数' : 'Parameters'}</th>
                      <th className="text-left py-2 px-3">{isZh ? '描述' : 'Description'}</th>
                    </tr>
                  </thead>
                  <tbody className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    <tr className={cn('border-b', theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100')}>
                      <td className="py-2 px-3 font-mono text-cyan-500">/api/motor/rotate</td>
                      <td className="py-2 px-3">POST</td>
                      <td className="py-2 px-3">{"{ angle: number, speed?: number }"}</td>
                      <td className="py-2 px-3">{isZh ? '旋转步进电机' : 'Rotate stepper motor'}</td>
                    </tr>
                    <tr className={cn('border-b', theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100')}>
                      <td className="py-2 px-3 font-mono text-cyan-500">/api/led/brightness</td>
                      <td className="py-2 px-3">POST</td>
                      <td className="py-2 px-3">{"{ level: 0-100 }"}</td>
                      <td className="py-2 px-3">{isZh ? '设置LED亮度' : 'Set LED brightness'}</td>
                    </tr>
                    <tr className={cn('border-b', theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100')}>
                      <td className="py-2 px-3 font-mono text-cyan-500">/api/camera/capture</td>
                      <td className="py-2 px-3">GET</td>
                      <td className="py-2 px-3">-</td>
                      <td className="py-2 px-3">{isZh ? '拍摄图像' : 'Capture image'}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-cyan-500">/api/scan/polarimetry</td>
                      <td className="py-2 px-3">POST</td>
                      <td className="py-2 px-3">{"{ start: 0, end: 360, step: 5 }"}</td>
                      <td className="py-2 px-3">{isZh ? '执行偏振扫描' : 'Run polarimetry scan'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Module Detail Modal */}
      {selectedModule && (
        <ModuleDetail module={selectedModule} onClose={() => setSelectedModule(null)} />
      )}
    </div>
  )
}

export default HardwarePage
