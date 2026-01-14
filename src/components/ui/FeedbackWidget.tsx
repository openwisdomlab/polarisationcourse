import { useState, useCallback, useMemo } from 'react'
import { MessageSquarePlus, X, Bug, Lightbulb, HelpCircle, FileText, Github, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from './button'

// GitHub 仓库配置
const GITHUB_OWNER = 'openwisdomlab'
const GITHUB_REPO = 'polarisationcourse'
// GitHub Token 从环境变量读取（在 .env 文件中配置 VITE_GITHUB_TOKEN）
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

// 反馈类型
type FeedbackType = 'bug' | 'feature' | 'content' | 'other'

// 提交状态
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

interface FeedbackTypeOption {
  value: FeedbackType
  labelKey: string
  icon: React.ReactNode
  githubLabel: string
  isDiscussion: boolean // true = Discussion, false = Issue
  discussionCategory?: string // Discussion 分类 ID
}

const FEEDBACK_TYPES: FeedbackTypeOption[] = [
  {
    value: 'bug',
    labelKey: 'feedback.types.bug',
    icon: <Bug className="w-4 h-4" />,
    githubLabel: 'bug',
    isDiscussion: false
  },
  {
    value: 'feature',
    labelKey: 'feedback.types.feature',
    icon: <Lightbulb className="w-4 h-4" />,
    githubLabel: 'enhancement',
    isDiscussion: true,
    discussionCategory: 'ideas' // Ideas 分类
  },
  {
    value: 'content',
    labelKey: 'feedback.types.content',
    icon: <FileText className="w-4 h-4" />,
    githubLabel: 'documentation',
    isDiscussion: false
  },
  {
    value: 'other',
    labelKey: 'feedback.types.other',
    icon: <HelpCircle className="w-4 h-4" />,
    githubLabel: 'question',
    isDiscussion: true,
    discussionCategory: 'q-a' // Q&A 分类
  },
]

// 无价值反馈检测模式（中英文）
const LOW_VALUE_PATTERNS = [
  // 中文
  /^(好|很好|不错|棒|好棒|非常好|太棒了|厉害|牛|666|赞|点赞|支持|加油|辛苦了|谢谢|感谢|哈哈|嘻嘻|呵呵|嗯|哦|ok|OK|好的|可以|行|没问题)[!！。.~～]*$/i,
  // 英文
  /^(good|great|nice|awesome|cool|amazing|excellent|wonderful|perfect|thanks|thank you|thx|lol|haha|yes|no|ok|okay)[!.~]*$/i,
  // 太短
  /^.{0,5}$/,
  // 纯符号或表情
  /^[!！?？.。,，~～\s👍👎❤️🎉🔥💯😀😃😄😁😆🥹😅😂🤣🥲☺️😊😇🙂🙃😉😌]*$/,
]

// 检查反馈是否有价值
function isValueableFeedback(content: string): boolean {
  const trimmed = content.trim()

  // 检查是否匹配无价值模式
  for (const pattern of LOW_VALUE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return false
    }
  }

  // 至少需要 10 个字符才算有价值
  if (trimmed.length < 10) {
    return false
  }

  return true
}

// 生成反馈正文
function generateFeedbackBody(content: string, currentPage: string): string {
  return `## 反馈内容 / Feedback Content

${content}

---
**页面 / Page**: ${currentPage}
**时间 / Time**: ${new Date().toISOString()}
**来源 / Source**: Feedback Widget
**User Agent**: ${navigator.userAgent}`
}

// GitHub API: 创建 Issue
async function createGitHubIssue(
  title: string,
  body: string,
  labels: string[]
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!GITHUB_TOKEN) {
    return { success: false, error: 'GitHub Token not configured' }
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          labels,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`
      }
    }

    const data = await response.json()
    return { success: true, url: data.html_url }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error'
    }
  }
}

// GitHub GraphQL API: 创建 Discussion
async function createGitHubDiscussion(
  title: string,
  body: string,
  categorySlug: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!GITHUB_TOKEN) {
    return { success: false, error: 'GitHub Token not configured' }
  }

  try {
    // 首先获取 repository ID 和 category ID
    const repoQuery = `
      query {
        repository(owner: "${GITHUB_OWNER}", name: "${GITHUB_REPO}") {
          id
          discussionCategories(first: 10) {
            nodes {
              id
              slug
              name
            }
          }
        }
      }
    `

    const repoResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: repoQuery }),
    })

    if (!repoResponse.ok) {
      return { success: false, error: `HTTP ${repoResponse.status}` }
    }

    const repoData = await repoResponse.json()

    if (repoData.errors) {
      return { success: false, error: repoData.errors[0]?.message || 'GraphQL error' }
    }

    const repositoryId = repoData.data?.repository?.id
    const categories = repoData.data?.repository?.discussionCategories?.nodes || []
    const category = categories.find((c: { slug: string }) => c.slug === categorySlug)

    if (!repositoryId || !category) {
      // 如果找不到分类，回退到创建 Issue
      return { success: false, error: 'Discussion category not found' }
    }

    // 创建 Discussion
    const createMutation = `
      mutation {
        createDiscussion(input: {
          repositoryId: "${repositoryId}",
          categoryId: "${category.id}",
          title: "${title.replace(/"/g, '\\"')}",
          body: "${body.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
        }) {
          discussion {
            url
          }
        }
      }
    `

    const createResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: createMutation }),
    })

    if (!createResponse.ok) {
      return { success: false, error: `HTTP ${createResponse.status}` }
    }

    const createData = await createResponse.json()

    if (createData.errors) {
      return { success: false, error: createData.errors[0]?.message || 'Failed to create discussion' }
    }

    const discussionUrl = createData.data?.createDiscussion?.discussion?.url
    return { success: true, url: discussionUrl }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error'
    }
  }
}

export function FeedbackWidget() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const currentPage = typeof window !== 'undefined' ? window.location.href : ''

  const selectedTypeOption = useMemo(
    () => FEEDBACK_TYPES.find(t => t.value === feedbackType),
    [feedbackType]
  )

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
    setError(null)
    // 重置状态如果之前已经成功
    if (submitStatus === 'success') {
      setSubmitStatus('idle')
      setResultUrl(null)
    }
  }, [submitStatus])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError(null)
  }, [])

  const resetForm = useCallback(() => {
    setTitle('')
    setContent('')
    setError(null)
    setSubmitStatus('idle')
    setResultUrl(null)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 验证内容
    if (!content.trim()) {
      setError(t('feedback.errors.empty'))
      return
    }

    if (!isValueableFeedback(content)) {
      setError(t('feedback.errors.lowValue'))
      return
    }

    setSubmitStatus('submitting')

    const feedbackTitle = title.trim() || `[${selectedTypeOption?.githubLabel || 'feedback'}] 用户反馈`
    const feedbackBody = generateFeedbackBody(content, currentPage)

    let result: { success: boolean; url?: string; error?: string }

    if (selectedTypeOption?.isDiscussion && selectedTypeOption.discussionCategory) {
      // 尝试创建 Discussion
      result = await createGitHubDiscussion(
        feedbackTitle,
        feedbackBody,
        selectedTypeOption.discussionCategory
      )

      // 如果 Discussion 创建失败，回退到 Issue
      if (!result.success) {
        console.warn('Discussion creation failed, falling back to Issue:', result.error)
        result = await createGitHubIssue(
          feedbackTitle,
          feedbackBody,
          [selectedTypeOption.githubLabel, 'from-widget']
        )
      }
    } else {
      // 创建 Issue
      result = await createGitHubIssue(
        feedbackTitle,
        feedbackBody,
        [selectedTypeOption?.githubLabel || 'feedback', 'from-widget']
      )
    }

    if (result.success) {
      setSubmitStatus('success')
      setResultUrl(result.url || null)
      // 3秒后自动关闭
      setTimeout(() => {
        setIsOpen(false)
        resetForm()
      }, 3000)
    } else {
      setSubmitStatus('error')
      setError(result.error || t('feedback.errors.submitFailed'))
    }
  }, [content, title, feedbackType, selectedTypeOption, currentPage, t, resetForm])

  // 判断是否配置了 GitHub Token
  const isApiConfigured = !!GITHUB_TOKEN

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={handleToggle}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-14 h-14 rounded-full',
          'bg-gradient-to-br from-cyan-500 to-purple-600',
          'text-white shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-300 ease-out',
          'hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/25',
          'active:scale-95',
          isOpen && 'rotate-45 bg-gradient-to-br from-red-500 to-orange-600'
        )}
        aria-label={t('feedback.button')}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquarePlus className="w-6 h-6" />
        )}
      </button>

      {/* 反馈表单面板 */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50',
          'w-[360px] max-w-[calc(100vw-48px)]',
          'bg-slate-900/95 backdrop-blur-xl',
          'border border-slate-700/50',
          'rounded-2xl shadow-2xl shadow-black/50',
          'transition-all duration-300 ease-out',
          'origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('feedback.title')}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 成功状态 */}
        {submitStatus === 'success' ? (
          <div className="p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">
                {t('feedback.success.title')}
              </h4>
              <p className="text-sm text-slate-400">
                {t('feedback.success.message')}
              </p>
            </div>
            {resultUrl && (
              <a
                href={resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-400 hover:text-cyan-300 underline"
              >
                {t('feedback.success.viewOnGithub')}
              </a>
            )}
          </div>
        ) : (
          /* 表单内容 */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* API 未配置提示 */}
            {!isApiConfigured && (
              <div className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
                {t('feedback.apiNotConfigured')}
              </div>
            )}

            {/* 反馈类型选择 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {t('feedback.typeLabel')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFeedbackType(type.value)}
                    disabled={submitStatus === 'submitting'}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg',
                      'text-sm font-medium transition-all',
                      'border',
                      feedbackType === type.value
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    {type.icon}
                    <span>{t(type.labelKey)}</span>
                  </button>
                ))}
              </div>
              {/* 类型说明 */}
              <p className="text-xs text-slate-500 flex items-center gap-1">
                {selectedTypeOption?.isDiscussion ? (
                  <>
                    <span>→</span>
                    <span>{t('feedback.goesToDiscussion')}</span>
                  </>
                ) : (
                  <>
                    <span>→</span>
                    <span>{t('feedback.goesToIssue')}</span>
                  </>
                )}
              </p>
            </div>

            {/* 标题输入 */}
            <div className="space-y-2">
              <label htmlFor="feedback-title" className="text-sm font-medium text-slate-300">
                {t('feedback.titleLabel')}
                <span className="text-slate-500 ml-1">({t('feedback.optional')})</span>
              </label>
              <input
                id="feedback-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('feedback.titlePlaceholder')}
                disabled={submitStatus === 'submitting'}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg',
                  'bg-slate-800/50 border border-slate-700/50',
                  'text-white placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
                  'transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              />
            </div>

            {/* 内容输入 */}
            <div className="space-y-2">
              <label htmlFor="feedback-content" className="text-sm font-medium text-slate-300">
                {t('feedback.contentLabel')}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                id="feedback-content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setError(null)
                }}
                placeholder={t('feedback.contentPlaceholder')}
                rows={4}
                disabled={submitStatus === 'submitting'}
                className={cn(
                  'w-full px-4 py-3 rounded-lg resize-none',
                  'bg-slate-800/50 border border-slate-700/50',
                  'text-white placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
                  'transition-all',
                  error && 'border-red-500/50 focus:ring-red-500/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              />
              {/* 字符计数 */}
              <div className="flex justify-between items-center">
                <span className={cn(
                  'text-xs',
                  content.length < 10 ? 'text-slate-500' : 'text-green-500'
                )}>
                  {content.length} {t('feedback.characters')}
                </span>
                {content.length >= 10 && (
                  <span className="text-xs text-green-500">✓ {t('feedback.validLength')}</span>
                )}
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 提交按钮 */}
            <Button
              type="submit"
              disabled={submitStatus === 'submitting' || !content.trim() || !isApiConfigured}
              className={cn(
                'w-full py-3 rounded-lg font-medium',
                'bg-gradient-to-r from-cyan-500 to-purple-600',
                'hover:from-cyan-400 hover:to-purple-500',
                'text-white shadow-lg',
                'flex items-center justify-center gap-2',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {submitStatus === 'submitting' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('feedback.submitting')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('feedback.submit')}</span>
                </>
              )}
            </Button>

            {/* 说明文字 */}
            <p className="text-xs text-center text-slate-500">
              {t('feedback.note')}
            </p>
          </form>
        )}
      </div>

      {/* 背景遮罩（移动端） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={handleClose}
        />
      )}
    </>
  )
}

export default FeedbackWidget
