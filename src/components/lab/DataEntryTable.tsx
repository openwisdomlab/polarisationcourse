/**
 * Data Entry Table - Interactive experimental data input
 * 数据录入表格 - 交互式实验数据输入
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { DataPoint } from '@/stores/labStore'
import { Plus, Trash2, RefreshCw, Dice5, ArrowUpDown } from 'lucide-react'
import { addRealisticNoise, generateTheoreticalMalusData, DEFAULT_NOISE_PARAMS } from './dataAnalysis'

interface DataEntryTableProps {
  data: DataPoint[]
  onChange: (data: DataPoint[]) => void
  maxRows?: number
  angleStep?: number
  showSimulate?: boolean
}

export function DataEntryTable({
  data,
  onChange,
  maxRows = 20,
  angleStep = 10,
  showSimulate = true,
}: DataEntryTableProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [editingCell, setEditingCell] = useState<{ id: string; field: 'angle' | 'intensity' } | null>(null)

  // Add a new empty row
  const addRow = useCallback(() => {
    if (data.length >= maxRows) return

    // Suggest next angle based on existing data
    const existingAngles = data.map(p => p.angle)
    let suggestedAngle = 0

    if (data.length > 0) {
      const maxAngle = Math.max(...existingAngles)
      suggestedAngle = Math.min(180, maxAngle + angleStep)
    }

    const newPoint: DataPoint = {
      id: `dp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      angle: suggestedAngle,
      intensity: 0,
    }

    onChange([...data, newPoint])
  }, [data, onChange, maxRows, angleStep])

  // Remove a row
  const removeRow = useCallback((id: string) => {
    onChange(data.filter(p => p.id !== id))
  }, [data, onChange])

  // Update a cell value
  const updateCell = useCallback((id: string, field: 'angle' | 'intensity', value: number) => {
    onChange(data.map(p =>
      p.id === id
        ? { ...p, [field]: Math.max(0, field === 'angle' ? Math.min(360, value) : Math.min(100, value)) }
        : p
    ))
  }, [data, onChange])

  // Clear all data
  const clearAll = useCallback(() => {
    onChange([])
  }, [onChange])

  // Generate simulated data with realistic noise model
  // 使用真实噪声模型生成模拟数据
  const generateSimulatedData = useCallback(() => {
    const theoretical = generateTheoreticalMalusData(100, 0, 19) // 0-180 in 10° steps
    // Use realistic noise with shot noise + read noise
    const noisy = addRealisticNoise(theoretical, {
      ...DEFAULT_NOISE_PARAMS,
      readNoise: 3.0,        // Typical photodetector noise
      shotNoiseFactor: 0.15, // Shot noise ~15% of √I
    })
    onChange(noisy.map((p, i) => ({
      ...p,
      id: `sim-${Date.now()}-${i}`,
    })))
  }, [onChange])

  // Sort data by angle
  const sortByAngle = useCallback(() => {
    const sorted = [...data].sort((a, b) => a.angle - b.angle)
    onChange(sorted)
  }, [data, onChange])

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={addRow}
          disabled={data.length >= maxRows}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
            data.length >= maxRows
              ? 'opacity-50 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
          )}
        >
          <Plus className="w-4 h-4" />
          {isZh ? '添加数据' : 'Add Row'}
        </button>

        <button
          onClick={sortByAngle}
          disabled={data.length < 2}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
            data.length < 2
              ? 'opacity-50 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          )}
        >
          <ArrowUpDown className="w-4 h-4" />
          {isZh ? '排序' : 'Sort'}
        </button>

        {showSimulate && (
          <button
            onClick={generateSimulatedData}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              theme === 'dark'
                ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            )}
          >
            <Dice5 className="w-4 h-4" />
            {isZh ? '模拟数据' : 'Simulate'}
          </button>
        )}

        <button
          onClick={clearAll}
          disabled={data.length === 0}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
            data.length === 0
              ? 'opacity-50 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
          )}
        >
          <RefreshCw className="w-4 h-4" />
          {isZh ? '清空' : 'Clear'}
        </button>

        <span className={cn(
          'ml-auto text-xs',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          {data.length}/{maxRows} {isZh ? '数据点' : 'points'}
        </span>
      </div>

      {/* Table */}
      <div className={cn(
        'rounded-lg border overflow-hidden',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <table className="w-full">
          <thead>
            <tr className={cn(
              'text-xs uppercase tracking-wider',
              theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-50 text-gray-500'
            )}>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">
                {isZh ? '角度 θ (°)' : 'Angle θ (°)'}
              </th>
              <th className="px-4 py-2 text-left">
                {isZh ? '强度 I (%)' : 'Intensity I (%)'}
              </th>
              <th className="px-4 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className={cn(
                    'px-4 py-8 text-center text-sm',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}
                >
                  {isZh
                    ? '点击"添加数据"开始录入实验数据，或点击"模拟数据"生成示例。'
                    : 'Click "Add Row" to enter experimental data, or "Simulate" for example data.'}
                </td>
              </tr>
            ) : (
              data.map((point, index) => (
                <tr
                  key={point.id}
                  className={cn(
                    'border-t transition-colors',
                    theme === 'dark'
                      ? 'border-slate-700 hover:bg-slate-800/50'
                      : 'border-gray-100 hover:bg-gray-50'
                  )}
                >
                  <td className={cn(
                    'px-4 py-2 text-sm tabular-nums',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {index + 1}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      max={360}
                      step={1}
                      value={point.angle}
                      onChange={(e) => updateCell(point.id, 'angle', parseFloat(e.target.value) || 0)}
                      onFocus={() => setEditingCell({ id: point.id, field: 'angle' })}
                      onBlur={() => setEditingCell(null)}
                      className={cn(
                        'w-20 px-2 py-1 text-sm rounded border text-right tabular-nums',
                        'focus:outline-none focus:ring-2',
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:ring-yellow-500/50'
                          : 'bg-white border-gray-200 text-gray-900 focus:ring-yellow-400/50',
                        editingCell?.id === point.id && editingCell.field === 'angle' &&
                          (theme === 'dark' ? 'ring-2 ring-yellow-500/50' : 'ring-2 ring-yellow-400/50')
                      )}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={point.intensity.toFixed(1)}
                      onChange={(e) => updateCell(point.id, 'intensity', parseFloat(e.target.value) || 0)}
                      onFocus={() => setEditingCell({ id: point.id, field: 'intensity' })}
                      onBlur={() => setEditingCell(null)}
                      className={cn(
                        'w-20 px-2 py-1 text-sm rounded border text-right tabular-nums',
                        'focus:outline-none focus:ring-2',
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:ring-cyan-500/50'
                          : 'bg-white border-gray-200 text-gray-900 focus:ring-cyan-400/50',
                        editingCell?.id === point.id && editingCell.field === 'intensity' &&
                          (theme === 'dark' ? 'ring-2 ring-cyan-500/50' : 'ring-2 ring-cyan-400/50')
                      )}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => removeRow(point.id)}
                      className={cn(
                        'p-1.5 rounded transition-colors',
                        theme === 'dark'
                          ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick entry hint */}
      {data.length > 0 && data.length < 5 && (
        <p className={cn(
          'text-xs',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          {isZh
            ? '提示：建议录入至少 5 个数据点以获得可靠的拟合结果。'
            : 'Tip: Enter at least 5 data points for reliable fitting results.'}
        </p>
      )}
    </div>
  )
}
