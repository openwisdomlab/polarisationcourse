/**
 * Canvas3DErrorBoundary - 3D Canvas专用错误边界
 *
 * 处理WebGL上下文丢失、Three.js渲染错误等3D场景特有的崩溃情况。
 * 提供自动重试、降级提示和状态保存恢复功能。
 */

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Monitor } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  /** 场景名称，用于错误报告 */
  sceneName?: string
  /** 自定义降级UI */
  fallback?: ReactNode
  /** 错误回调 */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** 最大自动重试次数 */
  maxAutoRetries?: number
}

interface State {
  hasError: boolean
  error: Error | null
  retryCount: number
  isRetrying: boolean
}

export class Canvas3DErrorBoundary extends Component<Props, State> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const sceneName = this.props.sceneName || '3D Scene'
    logger.error(`[Canvas3DErrorBoundary] ${sceneName} crashed:`, error, errorInfo)
    this.props.onError?.(error, errorInfo)

    // WebGL上下文丢失时自动尝试恢复
    const maxRetries = this.props.maxAutoRetries ?? 2
    if (this.state.retryCount < maxRetries && this.isWebGLError(error)) {
      this.scheduleAutoRetry()
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
    }
  }

  private isWebGLError(error: Error): boolean {
    const msg = error.message.toLowerCase()
    return msg.includes('webgl') ||
           msg.includes('context lost') ||
           msg.includes('gl_') ||
           msg.includes('shader') ||
           msg.includes('rendering context')
  }

  private scheduleAutoRetry = () => {
    this.setState({ isRetrying: true })
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 8000)
    this.retryTimer = setTimeout(() => {
      this.setState(prev => ({
        hasError: false,
        error: null,
        retryCount: prev.retryCount + 1,
        isRetrying: false,
      }))
    }, delay)
  }

  handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isRetrying) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-900/95">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-cyan-400 text-sm">
                Recovering 3D scene... ({this.state.retryCount + 1})
              </span>
            </div>
          </div>
        )
      }

      if (this.props.fallback) {
        return this.props.fallback
      }

      const isWebGL = this.state.error && this.isWebGLError(this.state.error)

      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-900/95 p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
            <div className="w-14 h-14 mx-auto mb-4 bg-amber-500/10 rounded-full flex items-center justify-center">
              {isWebGL ? (
                <Monitor className="w-7 h-7 text-amber-500" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {isWebGL ? '3D Rendering Issue' : '3D Scene Error'}
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              {isWebGL
                ? 'Your browser lost the WebGL rendering context. This can happen due to GPU resource limits or driver issues.'
                : `The ${this.props.sceneName || '3D scene'} encountered an error.`
              }
            </p>

            {this.state.error && import.meta.env.DEV && (
              <details className="mb-4 text-left">
                <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-400">
                  Error Details
                </summary>
                <pre className="mt-2 p-2 bg-slate-900 rounded text-xs text-red-400 overflow-auto max-h-32">
                  {this.state.error.stack || this.state.error.message}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleManualRetry}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Scene
              </button>
              <button
                type="button"
                onClick={() => window.location.replace('/')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Go Home
              </button>
            </div>

            {isWebGL && (
              <p className="text-gray-500 text-xs mt-4">
                Tip: Try closing other GPU-intensive tabs or updating your graphics drivers.
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default Canvas3DErrorBoundary
