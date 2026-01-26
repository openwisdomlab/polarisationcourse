/**
 * FeedbackWidget - Floating feedback button and form
 * 反馈组件 - 右下角浮动反馈按钮和表单
 */

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  MessageSquarePlus,
  X,
  Bug,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Send,
  CheckCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react'

type FeedbackType = 'bug' | 'feature' | 'content' | 'other'

interface FeedbackTypeOption {
  type: FeedbackType
  icon: typeof Bug
  labelEn: string
  labelZh: string
  descEn: string
  descZh: string
  goesToIssue: boolean
}

const FEEDBACK_TYPES: FeedbackTypeOption[] = [
  {
    type: 'bug',
    icon: Bug,
    labelEn: 'Bug Report',
    labelZh: '问题反馈',
    descEn: 'Report errors or issues',
    descZh: '报告错误或问题',
    goesToIssue: true,
  },
  {
    type: 'feature',
    icon: Lightbulb,
    labelEn: 'Feature Request',
    labelZh: '功能建议',
    descEn: 'Suggest new features',
    descZh: '建议新功能',
    goesToIssue: true,
  },
  {
    type: 'content',
    icon: BookOpen,
    labelEn: 'Content Feedback',
    labelZh: '内容反馈',
    descEn: 'Feedback on course content',
    descZh: '关于课程内容的反馈',
    goesToIssue: false,
  },
  {
    type: 'other',
    icon: HelpCircle,
    labelEn: 'Other',
    labelZh: '其他',
    descEn: 'General feedback',
    descZh: '一般反馈',
    goesToIssue: false,
  },
]

const GITHUB_REPO = 'openwisdomlab/polarisationcourse'
const MIN_CONTENT_LENGTH = 10

export function FeedbackWidget() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (isOpen && !isSuccess) {
          // Don't close if user has started typing
          if (!content && !title) {
            setIsOpen(false)
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, isSuccess, content, title])

  const handleSubmit = async () => {
    if (!selectedType || content.length < MIN_CONTENT_LENGTH) {
      setError(isZh ? '请填写详细内容（至少10个字符）' : 'Please provide more details (at least 10 characters)')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const typeOption = FEEDBACK_TYPES.find((t) => t.type === selectedType)
    const typeLabel = isZh ? typeOption?.labelZh : typeOption?.labelEn

    // Build GitHub URL for creating issue/discussion
    const feedbackTitle = title || `[${typeLabel}] ${content.slice(0, 50)}...`
    const feedbackBody = `## ${isZh ? '反馈类型' : 'Feedback Type'}\n${typeLabel}\n\n## ${isZh ? '详细内容' : 'Details'}\n${content}\n\n---\n*${isZh ? '通过 PolarCraft 反馈组件提交' : 'Submitted via PolarCraft Feedback Widget'}*`

    // For issues (bugs, features)
    if (typeOption?.goesToIssue) {
      const issueUrl = `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(feedbackTitle)}&body=${encodeURIComponent(feedbackBody)}&labels=${selectedType}`

      // Simulate a brief delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSubmittedUrl(issueUrl)
      setIsSuccess(true)
      setIsSubmitting(false)

      // Open GitHub in new tab
      window.open(issueUrl, '_blank')
    } else {
      // For discussions (content, other)
      const discussionUrl = `https://github.com/${GITHUB_REPO}/discussions/new?category=feedback&title=${encodeURIComponent(feedbackTitle)}&body=${encodeURIComponent(feedbackBody)}`

      await new Promise((resolve) => setTimeout(resolve, 500))

      setSubmittedUrl(discussionUrl)
      setIsSuccess(true)
      setIsSubmitting(false)

      window.open(discussionUrl, '_blank')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset after animation
    setTimeout(() => {
      setSelectedType(null)
      setTitle('')
      setContent('')
      setIsSuccess(false)
      setSubmittedUrl(null)
      setError(null)
    }, 300)
  }

  const selectedTypeOption = FEEDBACK_TYPES.find((t) => t.type === selectedType)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-14 h-14 rounded-full shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-300 hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          theme === 'dark'
            ? 'bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-500 focus:ring-offset-slate-900'
            : 'bg-cyan-500 hover:bg-cyan-400 text-white focus:ring-cyan-400 focus:ring-offset-white',
          isOpen && 'opacity-0 pointer-events-none'
        )}
        title={isZh ? '反馈' : 'Feedback'}
      >
        <MessageSquarePlus className="w-6 h-6" />
      </button>

      {/* Feedback Panel */}
      <div
        ref={panelRef}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-[360px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-100px)]',
          'rounded-2xl shadow-2xl overflow-hidden',
          'transition-all duration-300 transform',
          theme === 'dark'
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-white border border-gray-200',
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3 border-b',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}
        >
          <h3
            className={cn(
              'font-semibold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            {isZh ? '反馈与建议' : 'Feedback'}
          </h3>
          <button
            onClick={handleClose}
            className={cn(
              'p-1 rounded-lg transition-colors',
              theme === 'dark'
                ? 'hover:bg-slate-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[400px]">
          {isSuccess ? (
            // Success state
            <div className="flex flex-col items-center py-6 text-center">
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center mb-4',
                  theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
                )}
              >
                <CheckCircle
                  className={cn(
                    'w-8 h-8',
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  )}
                />
              </div>
              <h4
                className={cn(
                  'text-lg font-semibold mb-2',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}
              >
                {isZh ? '感谢您的反馈！' : 'Thank you for your feedback!'}
              </h4>
              <p
                className={cn(
                  'text-sm mb-4',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {isZh
                  ? '您的反馈已准备提交到 GitHub'
                  : 'Your feedback is ready to submit on GitHub'}
              </p>
              {submittedUrl && (
                <a
                  href={submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                    'transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600 text-cyan-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-cyan-600'
                  )}
                >
                  {isZh ? '在 GitHub 上查看' : 'View on GitHub'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : (
            // Form
            <div className="space-y-4">
              {/* Type selection */}
              <div>
                <label
                  className={cn(
                    'block text-sm font-medium mb-2',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  {isZh ? '反馈类型' : 'Feedback Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FEEDBACK_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = selectedType === type.type
                    return (
                      <button
                        key={type.type}
                        onClick={() => setSelectedType(type.type)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
                          theme === 'dark'
                            ? isSelected
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                            : isSelected
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5',
                            isSelected
                              ? theme === 'dark'
                                ? 'text-cyan-400'
                                : 'text-cyan-600'
                              : theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          )}
                        />
                        <span
                          className={cn(
                            'text-xs font-medium',
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                          )}
                        >
                          {isZh ? type.labelZh : type.labelEn}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {selectedTypeOption && (
                  <p
                    className={cn(
                      'mt-2 text-xs',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}
                  >
                    {selectedTypeOption.goesToIssue
                      ? isZh
                        ? '将作为 Issue 提交到 GitHub'
                        : 'Will be submitted as a GitHub Issue'
                      : isZh
                      ? '将作为 Discussion 提交到 GitHub'
                      : 'Will be submitted as a GitHub Discussion'}
                  </p>
                )}
              </div>

              {/* Title (optional) */}
              <div>
                <label
                  className={cn(
                    'block text-sm font-medium mb-2',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  {isZh ? '标题' : 'Title'}
                  <span className="text-gray-500 font-normal ml-1">
                    ({isZh ? '可选' : 'optional'})
                  </span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isZh ? '简短描述...' : 'Brief description...'}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg border text-sm',
                    'focus:outline-none focus:ring-2',
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                  )}
                />
              </div>

              {/* Content */}
              <div>
                <label
                  className={cn(
                    'block text-sm font-medium mb-2',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  {isZh ? '详细内容' : 'Details'}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    isZh
                      ? '请详细描述您的反馈...'
                      : 'Please describe your feedback in detail...'
                  }
                  rows={4}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg border text-sm resize-none',
                    'focus:outline-none focus:ring-2',
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                  )}
                />
                <p
                  className={cn(
                    'mt-1 text-xs',
                    content.length >= MIN_CONTENT_LENGTH
                      ? theme === 'dark'
                        ? 'text-emerald-400'
                        : 'text-emerald-600'
                      : theme === 'dark'
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  )}
                >
                  {content.length} / {MIN_CONTENT_LENGTH}+ {isZh ? '字符' : 'characters'}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedType}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
                  'font-medium transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  isSubmitting || !selectedType
                    ? theme === 'dark'
                      ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-500 focus:ring-offset-slate-800'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-white focus:ring-cyan-500 focus:ring-offset-white'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isZh ? '提交中...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {isZh ? '提交反馈' : 'Submit Feedback'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FeedbackWidget
