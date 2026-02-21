/**
 * RotationFeedback.tsx -- 旋转实时反馈条
 *
 * 当用户旋转偏振片/波片时，在元素旁显示实时角度和强度读数。
 * - 小弧形指示器: "θ = 45° → I = cos²(45°) = 0.50"
 * - 松开 3 秒后渐出
 * - 首次旋转后可见 (渐进披露)
 *
 * 渲染为 HTML 叠加层 (absolute positioned)。
 *
 * Phase B -- D3: Action Feedback
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'

/** 松开后保持显示时间 (毫秒) */
const LINGER_DURATION = 3000

interface FeedbackData {
  angle: number
  intensity: number | null
  elementType: string
  screenX: number
  screenY: number
}

/**
 * RotationFeedback -- 实时旋转反馈
 *
 * 监听 store 的 interactionMode 和选中元素的旋转变化。
 * 当 interactionMode === 'rotate' 时:
 * - 显示当前角度
 * - 计算并显示 cos²θ 强度 (偏振片) 或 旋转角度 (波片)
 * - 松开后保持 3 秒
 */
export function RotationFeedback() {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [visible, setVisible] = useState(false)
  const lingerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 监听交互模式变化
    const unsub = useOdysseyWorldStore.subscribe(
      (state) => ({
        mode: state.interactionMode,
        selectedId: state.selectedElementId,
      }),
      ({ mode, selectedId }) => {
        if (mode === 'rotate' && selectedId) {
          // 清除消失定时器
          if (lingerTimerRef.current) {
            clearTimeout(lingerTimerRef.current)
            lingerTimerRef.current = null
          }
          setVisible(true)
        } else if (mode !== 'rotate' && visible) {
          // 松开: 3 秒后隐藏
          lingerTimerRef.current = setTimeout(() => {
            setVisible(false)
            setFeedback(null)
          }, LINGER_DURATION)
        }
      },
    )

    return () => unsub()
  }, [visible])

  // 监听选中元素的旋转变化，更新反馈数据
  useEffect(() => {
    if (!visible) return

    const interval = setInterval(() => {
      const state = useOdysseyWorldStore.getState()
      const selectedId = state.selectedElementId
      if (!selectedId) return

      const element = state.sceneElements.find((el) => el.id === selectedId)
      if (!element) return

      const isOptical = element.type === 'polarizer' || element.type === 'waveplate'
      if (!isOptical) return

      // 计算强度 (简化 Malus 定律: I = cos²θ)
      let intensity: number | null = null
      if (element.type === 'polarizer') {
        // 查找通过此偏振片之后的光束段强度
        const downstreamSegments = state.beamSegments.filter(
          (seg) => seg.stokes.s0 > 0.01,
        )
        if (downstreamSegments.length > 0) {
          // 取最后一段光束的强度
          const lastSeg = downstreamSegments[downstreamSegments.length - 1]
          intensity = lastSeg.stokes.s0
        }
      }

      setFeedback({
        angle: element.rotation,
        intensity,
        elementType: element.type,
        screenX: 0,
        screenY: 0,
      })
    }, 50) // 20fps 更新

    return () => clearInterval(interval)
  }, [visible])

  // 归一化角度到 0-360
  const normalizeAngle = useCallback((deg: number) => {
    const normalized = ((deg % 360) + 360) % 360
    return Math.round(normalized)
  }, [])

  return (
    <AnimatePresence>
      {visible && feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 z-15',
            'rounded-lg px-3 py-1.5',
            'bg-black/50 dark:bg-black/60',
            'backdrop-blur-sm',
            'border border-white/10',
            'text-white',
            'font-mono text-xs',
            'flex items-center gap-3',
          )}
        >
          {/* 角度读数 */}
          <span className="text-blue-300">
            θ = {normalizeAngle(feedback.angle)}°
          </span>

          {/* 强度读数 (偏振片) */}
          {feedback.intensity !== null && (
            <>
              <span className="text-gray-500">→</span>
              <span className="text-amber-300">
                I = {feedback.intensity.toFixed(2)}
              </span>
            </>
          )}

          {/* 波片显示 */}
          {feedback.elementType === 'waveplate' && (
            <>
              <span className="text-gray-500">|</span>
              <span className="text-purple-300">
                {feedback.angle > 0 ? '+' : ''}{normalizeAngle(feedback.angle)}° fast axis
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
