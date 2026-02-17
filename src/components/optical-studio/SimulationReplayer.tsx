/**
 * SimulationReplayer — Developer-Only Debugging Component
 *
 * Allows developers to:
 * 1. Paste a JSON snapshot/layout and instantly replay it
 * 2. Browse recorded simulation snapshots
 * 3. Compare fingerprints to identify physics regressions
 * 4. Export snapshots for sharing in bug reports
 *
 * This component is gated behind import.meta.env.DEV — it will be
 * tree-shaken out of production builds entirely.
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Play, Clipboard, Trash2, Download, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle, X
} from 'lucide-react'
import {
  useSimulationBlackBoxStore,
  enableAutoRecording,
  disableAutoRecording,
  type SimulationSnapshot,
} from '@/stores/simulationBlackBoxStore'

// ========== Main Component ==========

export default function SimulationReplayer() {
  useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [isOpen, setIsOpen] = useState(false)
  const [pasteJson, setPasteJson] = useState('')
  const [replayStatus, setReplayStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [expandedSnapshot, setExpandedSnapshot] = useState<string | null>(null)

  const {
    snapshots,
    autoRecord,
    setAutoRecord,
    recordSnapshot,
    replayFromJSON,
    exportSnapshot,
    exportLatest,
    clearSnapshots,
    removeSnapshot,
    replaySnapshot,
  } = useSimulationBlackBoxStore()

  // Handle paste-and-replay
  const handleReplay = useCallback(() => {
    if (!pasteJson.trim()) return
    const success = replayFromJSON(pasteJson)
    setReplayStatus(success ? 'success' : 'error')
    if (success) {
      setPasteJson('')
      setTimeout(() => setReplayStatus('idle'), 2000)
    }
  }, [pasteJson, replayFromJSON])

  // Handle auto-record toggle
  const handleAutoRecord = useCallback((enabled: boolean) => {
    setAutoRecord(enabled)
    if (enabled) {
      enableAutoRecording()
    } else {
      disableAutoRecording()
    }
  }, [setAutoRecord])

  // Copy snapshot to clipboard
  const handleCopySnapshot = useCallback((snapshotId: string) => {
    const json = exportSnapshot(snapshotId)
    if (json && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(json).catch(() => {
        // Fallback: select text for manual copy
      })
    }
  }, [exportSnapshot])

  // Copy latest to clipboard
  const handleCopyLatest = useCallback(() => {
    const json = exportLatest()
    if (json && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(json)
    }
  }, [exportLatest])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-lg text-xs font-mono',
          'border shadow-lg backdrop-blur-sm transition-colors',
          isDark
            ? 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-800'
            : 'bg-white/90 border-gray-300 text-gray-500 hover:text-cyan-600 hover:border-cyan-400'
        )}
        title="Simulation Black Box (Dev)"
      >
        [BlackBox] {snapshots.length} snapshots
      </button>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 w-[420px] max-w-[calc(100vw-32px)] max-h-[600px] rounded-xl',
        'border shadow-2xl backdrop-blur-md overflow-hidden flex flex-col',
        isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-300'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2.5 border-b',
        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'
      )}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-semibold">Simulation BlackBox</span>
          <span className={cn(
            'px-1.5 py-0.5 text-[10px] font-mono rounded',
            isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
          )}>DEV</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className={cn('p-1 rounded', isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content — scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Replay from JSON */}
        <Section title="Replay from JSON" isDark={isDark}>
          <textarea
            value={pasteJson}
            onChange={e => setPasteJson(e.target.value)}
            placeholder='Paste snapshot JSON here...'
            className={cn(
              'w-full h-20 text-xs font-mono p-2 rounded-lg border resize-none',
              isDark
                ? 'bg-slate-800 border-slate-600 text-slate-300 placeholder:text-slate-600'
                : 'bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-400'
            )}
          />
          <div className="flex items-center gap-2 mt-1.5">
            <button
              onClick={handleReplay}
              disabled={!pasteJson.trim()}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                pasteJson.trim()
                  ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                  : cn(isDark ? 'bg-slate-800 text-slate-600' : 'bg-gray-200 text-gray-400', 'cursor-not-allowed')
              )}
            >
              <Play className="w-3.5 h-3.5" />
              Replay
            </button>
            {replayStatus === 'success' && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Replayed
              </span>
            )}
            {replayStatus === 'error' && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Invalid JSON
              </span>
            )}
          </div>
        </Section>

        {/* Controls */}
        <Section title="Recording" isDark={isDark}>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={autoRecord}
                onChange={e => handleAutoRecord(e.target.checked)}
                className="rounded"
              />
              Auto-record on simulation change
            </label>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => recordSnapshot('Manual recording')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs',
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              )}
            >
              <Download className="w-3.5 h-3.5" />
              Record Now
            </button>
            <button
              onClick={handleCopyLatest}
              disabled={snapshots.length === 0}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs',
                snapshots.length > 0
                  ? cn(isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
                  : cn(isDark ? 'bg-slate-800 text-slate-600' : 'bg-gray-100 text-gray-400', 'cursor-not-allowed')
              )}
            >
              <Clipboard className="w-3.5 h-3.5" />
              Copy Latest
            </button>
            <button
              onClick={clearSnapshots}
              disabled={snapshots.length === 0}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs',
                snapshots.length > 0
                  ? 'text-red-400 hover:bg-red-500/10'
                  : cn(isDark ? 'text-slate-600' : 'text-gray-400', 'cursor-not-allowed')
              )}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </Section>

        {/* Snapshot List */}
        <Section title={`Snapshots (${snapshots.length})`} isDark={isDark}>
          {snapshots.length === 0 ? (
            <p className={cn('text-xs italic', isDark ? 'text-slate-600' : 'text-gray-400')}>
              No snapshots recorded yet. Click "Record Now" or enable auto-recording.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {[...snapshots].reverse().map(snapshot => (
                <SnapshotRow
                  key={snapshot.id}
                  snapshot={snapshot}
                  isExpanded={expandedSnapshot === snapshot.id}
                  onToggle={() => setExpandedSnapshot(
                    expandedSnapshot === snapshot.id ? null : snapshot.id
                  )}
                  onReplay={() => replaySnapshot(snapshot)}
                  onCopy={() => handleCopySnapshot(snapshot.id)}
                  onRemove={() => removeSnapshot(snapshot.id)}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

// ========== Sub-Components ==========

function Section({ title, isDark, children }: { title: string; isDark: boolean; children: React.ReactNode }) {
  return (
    <div className={cn(
      'rounded-lg border p-2.5',
      isDark ? 'border-slate-700/50 bg-slate-800/30' : 'border-gray-200 bg-gray-50/50'
    )}>
      <h4 className={cn(
        'text-[10px] font-mono uppercase tracking-wider mb-2',
        isDark ? 'text-slate-500' : 'text-gray-400'
      )}>{title}</h4>
      {children}
    </div>
  )
}

interface SnapshotRowProps {
  snapshot: SimulationSnapshot
  isExpanded: boolean
  onToggle: () => void
  onReplay: () => void
  onCopy: () => void
  onRemove: () => void
  isDark: boolean
}

function SnapshotRow({ snapshot, isExpanded, onToggle, onReplay, onCopy, onRemove, isDark }: SnapshotRowProps) {
  const time = new Date(snapshot.timestamp).toLocaleTimeString()
  const hasViolation = snapshot.result.hasConservationViolation

  return (
    <div className={cn(
      'rounded-lg border text-xs',
      isDark ? 'border-slate-700/50' : 'border-gray-200',
      hasViolation && (isDark ? 'border-red-900/50 bg-red-950/20' : 'border-red-200 bg-red-50/50')
    )}>
      {/* Summary row */}
      <div
        className={cn(
          'flex items-center gap-2 px-2.5 py-1.5 cursor-pointer',
          isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-100/50'
        )}
        onClick={onToggle}
      >
        {hasViolation ? (
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        )}

        <span className="font-mono text-[10px] text-slate-500 flex-shrink-0">{time}</span>

        <span className={cn(
          'font-mono text-[10px] px-1 rounded',
          isDark ? 'bg-slate-700 text-cyan-400' : 'bg-gray-200 text-cyan-700'
        )}>
          #{snapshot.fingerprint}
        </span>

        <span className={cn('text-[10px]', isDark ? 'text-slate-500' : 'text-gray-400')}>
          {snapshot.result.segmentCount} segs
        </span>

        <div className="flex-1" />

        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className={cn(
          'px-2.5 pb-2 border-t space-y-1.5',
          isDark ? 'border-slate-700/30' : 'border-gray-200/50'
        )}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1.5 text-[10px] font-mono">
            <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>Components:</span>
            <span>{snapshot.layout.components.length}</span>

            <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>Segments:</span>
            <span>{snapshot.result.segmentCount}</span>

            <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>Energy In:</span>
            <span>{snapshot.result.totalInputEnergy.toFixed(1)}%</span>

            <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>Energy Out:</span>
            <span>{snapshot.result.totalOutputEnergy.toFixed(1)}%</span>

            <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>Sensors:</span>
            <span>{Object.keys(snapshot.result.sensorAnalysis).length}</span>
          </div>

          {snapshot.description && (
            <p className={cn('text-[10px] italic', isDark ? 'text-slate-500' : 'text-gray-500')}>
              {snapshot.description}
            </p>
          )}

          {hasViolation && snapshot.result.violations.length > 0 && (
            <div className={cn(
              'text-[10px] p-1.5 rounded',
              isDark ? 'bg-red-950/30 text-red-400' : 'bg-red-50 text-red-600'
            )}>
              {snapshot.result.violations.map((v, i) => (
                <p key={i}>{v}</p>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={onReplay}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-[10px]',
                'bg-cyan-600/80 text-white hover:bg-cyan-500'
              )}
            >
              <Play className="w-3 h-3" /> Replay
            </button>
            <button
              onClick={onCopy}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-[10px]',
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              )}
            >
              <Clipboard className="w-3 h-3" /> Copy JSON
            </button>
            <button
              onClick={onRemove}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
