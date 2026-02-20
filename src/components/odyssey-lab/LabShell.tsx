/**
 * LabShell — 顶层全屏布局
 *
 * CSS Grid 三栏布局:
 * - 左: TheoryPanel (可折叠, 300px)
 * - 中: BenchCanvas (弹性)
 * - 右: ReadoutPanel (可折叠, 280px)
 * - 顶: StationNav (固定 48px)
 */

import { useEffect, useCallback, useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useOdysseyLabStore, getStationConfig } from './store'
import { StationNav } from './StationNav'
import { TheoryPanel } from './TheoryPanel'
import { BenchCanvas } from './BenchCanvas'
import { ReadoutPanel } from './ReadoutPanel'
import { ComponentToolbar } from './ComponentToolbar'
import { DemoEmbed } from './DemoEmbed'
import { ShortcutOverlay } from './ShortcutOverlay'
import type { UnitId } from '@/stores/odysseyStore'
import { ALL_STATIONS } from '@/components/odyssey/odysseyData'
import { useTranslation } from 'react-i18next'

export function LabShell() {
  const { t } = useTranslation()
  const search = useSearch({ from: '/odyssey/' })
  const [shortcutOverlayOpen, setShortcutOverlayOpen] = useState(false)
  const {
    theoryPanelOpen,
    readoutPanelOpen,
    mode,
    navigateTo,
    toggleTheoryPanel,
    toggleReadoutPanel,
    resetView,
    setMode,
    selectComponent,
    currentStationId,
    currentUnitId,
  } = useOdysseyLabStore()

  // 根据当前站点的 displayMode 决定中央区域渲染方式
  const stationConfig = getStationConfig(currentStationId)
  const displayMode = stationConfig?.displayMode ?? 'bench'
  const hasBench = displayMode !== 'demo'  // demo 模式下没有工作台和传感器数据

  // URL search param 初始化 (手动提取，不依赖路由搜索验证)
  useEffect(() => {
    const searchRecord = search as Record<string, unknown>
    const unitParam = searchRecord.unit ? Number(searchRecord.unit) : undefined
    const stationParam = searchRecord.station as string | undefined

    if (stationParam) {
      // 根据 stationId 查找对应 unit
      const station = ALL_STATIONS.find(s => s.id === stationParam)
      if (station) {
        navigateTo(station.unitId, stationParam)
      }
    } else if (unitParam !== undefined && unitParam >= 0 && unitParam <= 5) {
      const unit = unitParam as UnitId
      // 加载该 unit 的第一个站点
      const firstStation = ALL_STATIONS.find(s => s.unitId === unit)
      if (firstStation) {
        navigateTo(unit, firstStation.id)
      }
    }
  // 仅在初始化时执行
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // URL 同步 (更新浏览器 URL 但不触发导航)
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('unit', String(currentUnitId))
    url.searchParams.set('station', currentStationId)
    window.history.replaceState({}, '', url.toString())
  }, [currentUnitId, currentStationId])

  // 键盘快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 忽略输入框内的按键
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    switch (e.key) {
      case 't':
      case 'T':
        e.preventDefault()
        toggleTheoryPanel()
        break
      case 'f':
      case 'F':
        e.preventDefault()
        setMode(mode === 'guided' ? 'free' : 'guided')
        break
      case 'h':
      case 'H':
        e.preventDefault()
        resetView()
        break
      case '?':
        e.preventDefault()
        setShortcutOverlayOpen(prev => !prev)
        break
      case 'Escape':
        if (shortcutOverlayOpen) {
          setShortcutOverlayOpen(false)
        } else {
          selectComponent(null)
        }
        break
      case 'ArrowLeft': {
        e.preventDefault()
        const currentIdx = ALL_STATIONS.findIndex(s => s.id === currentStationId)
        if (currentIdx > 0) {
          const prev = ALL_STATIONS[currentIdx - 1]
          navigateTo(prev.unitId, prev.id)
        }
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        const currentIdx = ALL_STATIONS.findIndex(s => s.id === currentStationId)
        if (currentIdx < ALL_STATIONS.length - 1) {
          const next = ALL_STATIONS[currentIdx + 1]
          navigateTo(next.unitId, next.id)
        }
        break
      }
      case '1': case '2': case '3': case '4': case '5': case '6': {
        const unitId = (Number(e.key) - 1) as UnitId
        const firstStation = ALL_STATIONS.find(s => s.unitId === unitId)
        if (firstStation) {
          navigateTo(unitId, firstStation.id)
        }
        break
      }
      case 'Delete':
      case 'Backspace': {
        const { selectedComponentId, removeComponent } = useOdysseyLabStore.getState()
        if (selectedComponentId && mode === 'free') {
          removeComponent(selectedComponentId)
        }
        break
      }
    }
  }, [mode, currentStationId, toggleTheoryPanel, setMode, selectComponent, navigateTo, resetView, shortcutOverlayOpen])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // 动态 grid-template-columns
  // demo 模式下不显示右侧 ReadoutPanel (无传感器数据)
  const showReadout = hasBench && readoutPanelOpen
  const gridCols = [
    theoryPanelOpen ? '300px' : '0px',
    '1fr',
    showReadout ? '280px' : '0px',
  ].join(' ')

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* 顶部导航栏 */}
      <StationNav />

      {/* 主体三栏布局 */}
      <div
        className="flex-1 grid overflow-hidden transition-all duration-300"
        style={{ gridTemplateColumns: gridCols }}
      >
        {/* 左侧: 理论面板 */}
        <div className={`overflow-hidden transition-all duration-300 ${theoryPanelOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
          {theoryPanelOpen && <TheoryPanel />}
        </div>

        {/* 中央: 根据 displayMode 切换渲染 */}
        <div className="relative overflow-hidden flex flex-col">
          {displayMode === 'bench' && (
            <>
              <BenchCanvas />
              {mode === 'free' && <ComponentToolbar />}
            </>
          )}

          {displayMode === 'demo' && (
            <DemoEmbed />
          )}

          {displayMode === 'split' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0">
                <BenchCanvas />
              </div>
              <div className="h-px bg-gray-800" />
              <div className="flex-1 min-h-0">
                <DemoEmbed />
              </div>
            </div>
          )}
        </div>

        {/* 右侧: 测量面板 (仅 bench/split 模式) */}
        <div className={`overflow-hidden transition-all duration-300 ${showReadout ? 'opacity-100' : 'opacity-0 w-0'}`}>
          {showReadout && <ReadoutPanel />}
        </div>
      </div>

      {/* 面板折叠按钮 */}
      {!theoryPanelOpen && (
        <button
          onClick={toggleTheoryPanel}
          className="fixed left-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-r-lg px-1.5 py-4 backdrop-blur-sm transition-colors"
          title={t('odysseyLab.showTheory', 'Show Theory (T)')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {hasBench && !readoutPanelOpen && (
        <button
          onClick={toggleReadoutPanel}
          className="fixed right-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-l-lg px-1.5 py-4 backdrop-blur-sm transition-colors"
          title={t('odysseyLab.showReadout', 'Show Readout')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 快捷键帮助按钮 (右下角) */}
      <button
        onClick={() => setShortcutOverlayOpen(prev => !prev)}
        className="fixed right-3 bottom-3 z-30 w-7 h-7 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs font-mono backdrop-blur-sm transition-colors border border-gray-700/50"
        title={t('odysseyLab.keyboardShortcuts', 'Keyboard Shortcuts (?)')}
      >
        ?
      </button>

      {/* 快捷键帮助遮罩 */}
      {shortcutOverlayOpen && (
        <ShortcutOverlay onClose={() => setShortcutOverlayOpen(false)} />
      )}
    </div>
  )
}
