/**
 * DemoErrorBoundary - Error boundary for individual demo components
 * Prevents a single demo failure from crashing the entire page
 */

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  demoName?: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class DemoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(`Demo error in ${this.props.demoName || 'unknown demo'}:`, error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-slate-800/50 rounded-lg border border-red-200 dark:border-red-500/30">
          <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
            {this.props.demoName ? `"${this.props.demoName}" failed to load` : 'Demo failed to load'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 text-center max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while rendering this demo.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default DemoErrorBoundary
