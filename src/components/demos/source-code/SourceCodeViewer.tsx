/**
 * Source Code Viewer Component
 * 源码查看器组件
 *
 * Displays demo source code with syntax highlighting, supports multiple languages,
 * and provides download options.
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Copy, Download, Check, ExternalLink, BookOpen, FileCode } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
// PrismJS language components must be imported in dependency order:
// - TSX requires: markup, javascript, jsx, typescript
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-matlab'
import 'prismjs/components/prism-julia'
import 'prismjs/components/prism-r'

import { getDemoSource, getDemoSourceByLanguage } from '@/data/demo-sources'
import { LANGUAGE_INFO, type SourceLanguage } from '@/types/source-code'
import { LanguageSelector } from './LanguageSelector'
import { generatePackage } from '@/utils/package-generator'

interface SourceCodeViewerProps {
  demoId: string
  initialLanguage?: SourceLanguage
  onClose: () => void
}

export function SourceCodeViewer({
  demoId,
  initialLanguage = 'typescript',
  onClose,
}: SourceCodeViewerProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Get demo source metadata
  const demoSource = getDemoSource(demoId)

  // State
  const [selectedLanguage, setSelectedLanguage] = useState<SourceLanguage>(initialLanguage)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Get current language implementation
  const currentImpl = getDemoSourceByLanguage(demoId, selectedLanguage)

  // Update selected language if initial language not available
  useEffect(() => {
    if (demoSource && !demoSource.implementations.find(impl => impl.language === initialLanguage)) {
      setSelectedLanguage(demoSource.implementations[0].language as SourceLanguage)
    }
  }, [demoSource, initialLanguage])

  if (!demoSource || !currentImpl) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-slate-900 p-8 rounded-xl text-white">
          <p>{isZh ? '未找到源码' : 'Source code not found'}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-cyan-600 rounded">
            {isZh ? '关闭' : 'Close'}
          </button>
        </div>
      </div>
    )
  }

  // Syntax highlighting
  const languageInfo = LANGUAGE_INFO[selectedLanguage]
  const highlightedCode = Prism.highlight(
    currentImpl.sourceCode,
    Prism.languages[languageInfo.highlightLanguage] || Prism.languages.plain,
    languageInfo.highlightLanguage
  )

  // Available languages for this demo
  const availableLanguages = demoSource.implementations.map(
    impl => impl.language as SourceLanguage
  )

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentImpl.sourceCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Download single source file
  const handleDownloadSource = () => {
    const blob = new Blob([currentImpl.sourceCode], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${demoId}${languageInfo.fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download complete package
  const handleDownloadPackage = async () => {
    setIsDownloading(true)
    try {
      const zipBlob = await generatePackage(demoSource, selectedLanguage)
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${demoId}-${selectedLanguage}-standalone.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate package:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  // Complexity badge color
  const complexityColor =
    demoSource.complexity === 'beginner'
      ? 'bg-green-500/20 text-green-300'
      : demoSource.complexity === 'intermediate'
      ? 'bg-yellow-500/20 text-yellow-300'
      : 'bg-red-500/20 text-red-300'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-slate-900 rounded-xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-700"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-700">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <FileCode className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">
                  {isZh ? demoSource.nameZh : demoSource.name}
                </h2>
                <span className={`px-2 py-1 rounded text-xs ${complexityColor}`}>
                  {demoSource.complexity === 'beginner'
                    ? isZh ? '初级' : 'Beginner'
                    : demoSource.complexity === 'intermediate'
                    ? isZh ? '中级' : 'Intermediate'
                    : isZh ? '高级' : 'Advanced'}
                </span>
              </div>
              <p className="text-slate-400 mt-2 text-sm">
                {isZh ? demoSource.descriptionZh : demoSource.description}
              </p>

              {/* Key Concepts */}
              <div className="mt-3 flex flex-wrap gap-2">
                {(isZh ? demoSource.conceptsZh : demoSource.concepts).map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
            <LanguageSelector
              availableLanguages={availableLanguages}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-900/50">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">{isZh ? '已复制' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{isZh ? '复制代码' : 'Copy Code'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSource}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isZh ? '下载源文件' : 'Download Source'}</span>
              </button>

              <button
                onClick={handleDownloadPackage}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
              >
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                <span>
                  {isDownloading
                    ? isZh ? '生成中...' : 'Generating...'
                    : isZh ? '下载完整包' : 'Download Package'}
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-500">
              {languageInfo.icon} {isZh ? languageInfo.nameZh : languageInfo.name}
            </div>
          </div>

          {/* Code Display */}
          <div className="flex-1 overflow-auto bg-slate-950 p-6">
            <pre className="text-sm leading-relaxed">
              <code
                className={`language-${languageInfo.highlightLanguage}`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </pre>
          </div>

          {/* Footer - Dependencies and Resources */}
          <div className="border-t border-slate-700 bg-slate-900/50">
            {/* Setup Instructions */}
            {currentImpl.setup && (
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {isZh ? '安装说明' : 'Setup Instructions'}
                </h3>
                <pre className="text-xs text-slate-300 bg-slate-950 p-3 rounded overflow-x-auto">
                  {isZh ? currentImpl.setupZh || currentImpl.setup : currentImpl.setup}
                </pre>
              </div>
            )}

            {/* Dependencies */}
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-2">
                {isZh ? '依赖项' : 'Dependencies'}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentImpl.dependencies).map(([name, version]) => (
                  <span
                    key={name}
                    className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-300 font-mono"
                  >
                    {name}
                    {typeof version === 'string' && version.match(/^[\d\^~>=<]/)
                      ? `@${version}`
                      : ` ${version}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Resources */}
            {demoSource.resources && demoSource.resources.length > 0 && (
              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {isZh ? '学习资源' : 'Learning Resources'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {demoSource.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors group"
                    >
                      <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:text-cyan-300" />
                      <span className="text-slate-300 group-hover:text-white text-xs">
                        {isZh ? resource.titleZh || resource.title : resource.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {currentImpl.notes && (
              <div className="px-6 py-4 border-t border-slate-700 bg-slate-900">
                <p className="text-xs text-slate-400 italic">
                  💡 {isZh ? currentImpl.notesZh || currentImpl.notes : currentImpl.notes}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
