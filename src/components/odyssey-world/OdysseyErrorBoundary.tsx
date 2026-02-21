/**
 * OdysseyErrorBoundary.tsx -- Odyssey World 错误边界
 *
 * 捕获渲染期间的 JavaScript 错误，提供优雅的恢复界面:
 * - 友好错误提示
 * - "重置并重试" 按钮 (清除区域状态)
 * - "返回课程" 链接
 */

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onReset?: () => void
  onNavigateBack?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class OdysseyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  handleBack = () => {
    this.props.onNavigateBack?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#0a1628]">
          <div className="max-w-sm rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-8 text-center">
            <div className="mb-4 text-4xl">⚡</div>
            <h2 className="mb-2 text-lg font-medium text-gray-200">
              Something went wrong
            </h2>
            <p className="mb-6 text-sm text-gray-400">
              An unexpected error occurred in the Odyssey World. Your progress has been saved.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/30 transition-colors cursor-pointer"
              >
                Reset &amp; Retry
              </button>
              <button
                onClick={this.handleBack}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Back to Demos
              </button>
            </div>
            {this.state.error && (
              <p className="mt-4 text-[10px] text-gray-600 font-mono truncate">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
