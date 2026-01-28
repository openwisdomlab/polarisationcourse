/**
 * Shared theme color utilities for demo components.
 * Provides consistent theme-aware colors for SVG, Canvas, and Tailwind usage.
 */
import { useTheme } from '@/contexts/ThemeContext'

export function useDemoTheme() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return {
    isDark,
    theme,

    // ── SVG container background Tailwind classes ──
    svgContainerClass: isDark
      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-indigo-500/20'
      : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 border-indigo-200/40',
    svgContainerClassBlue: isDark
      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border-blue-500/20'
      : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-blue-200/40',

    // ── Panel / section Tailwind classes ──
    panelClass: isDark
      ? 'bg-slate-800/50 border-slate-700/50'
      : 'bg-white/80 border-slate-200',
    borderClass: isDark ? 'border-slate-700' : 'border-slate-200',
    tabBgClass: isDark ? 'bg-slate-800/50' : 'bg-slate-100',
    tabInactiveClass: isDark
      ? 'text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
      : 'text-gray-500 hover:text-gray-700 hover:bg-slate-200/50',
    inactiveButtonClass: isDark
      ? 'bg-slate-700/50 text-gray-400 border-slate-600/50'
      : 'bg-slate-100 text-gray-500 border-slate-200',
    buttonBgClass: isDark
      ? 'bg-slate-800/50 border-transparent hover:border-slate-600'
      : 'bg-slate-100/80 border-slate-200 hover:border-slate-400',

    // ── Text Tailwind classes ──
    headingClass: isDark ? 'text-gray-300' : 'text-gray-700',
    bodyClass: isDark ? 'text-gray-300' : 'text-gray-600',
    mutedTextClass: isDark ? 'text-gray-400' : 'text-gray-500',
    subtleTextClass: isDark ? 'text-slate-400' : 'text-slate-500',

    // ── SVG fill / stroke colors ──
    textPrimary: isDark ? '#e2e8f0' : '#1e293b',
    textSecondary: isDark ? '#9ca3af' : '#475569',
    textMuted: isDark ? '#6b7280' : '#94a3b8',
    gridStroke: isDark ? 'rgba(100,150,255,0.05)' : 'rgba(100,150,255,0.08)',
    axisColor: isDark ? '#475569' : '#94a3b8',
    gridLineColor: isDark ? '#334155' : '#e2e8f0',
    infoPanelBg: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(241,245,249,0.95)',
    infoPanelStroke: isDark ? '#475569' : '#cbd5e1',
    svgWhiteText: isDark ? '#fff' : '#1e293b',

    // ── Canvas / WebGL backgrounds ──
    canvasBg: isDark ? '#0f172a' : '#f8fafc',
    canvasBgAlt: isDark ? '#1e293b' : '#f1f5f9',

    // ── Misc SVG fills ──
    detectorFill: isDark ? '#1e293b' : '#f1f5f9',
    polarizerInactiveFill: isDark ? '#1e293b' : '#f1f5f9',
    polarizerInactiveStroke: isDark ? '#475569' : '#94a3b8',

    // ── Intensity bar track ──
    barTrackClass: isDark ? 'bg-slate-700' : 'bg-slate-200',
  }
}
