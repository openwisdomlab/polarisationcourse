/**
 * Language Selector Component
 * 语言选择器组件
 *
 * Allows users to switch between different programming language implementations
 * of the same demo.
 */

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { LANGUAGE_INFO, type SourceLanguage } from '@/types/source-code'
import { motion } from 'framer-motion'

interface LanguageSelectorProps {
  availableLanguages: SourceLanguage[]
  selectedLanguage: SourceLanguage
  onLanguageChange: (language: SourceLanguage) => void
}

export function LanguageSelector({
  availableLanguages,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
        <span>{isZh ? '选择语言' : 'Choose Language'}:</span>
        <span className="text-xs">
          {isZh ? '同一演示的不同实现' : 'Different implementations of the same demo'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableLanguages.map(lang => {
          const info = LANGUAGE_INFO[lang]
          const isSelected = selectedLanguage === lang

          return (
            <motion.button
              key={lang}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLanguageChange(lang)}
              className={`
                relative px-4 py-2.5 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? theme === 'dark'
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-cyan-600 bg-cyan-50 text-cyan-700'
                    : theme === 'dark'
                      ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {/* Icon and name */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{info.icon}</span>
                <span className="font-medium text-sm">
                  {isZh ? info.nameZh : info.name}
                </span>
              </div>

              {/* Category badge */}
              <div className="mt-1">
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded
                    ${
                      info.category === 'web'
                        ? 'bg-blue-500/20 text-blue-300'
                        : info.category === 'scientific'
                        ? 'bg-purple-500/20 text-purple-300'
                        : info.category === 'ai-generation'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-green-500/20 text-green-300'
                    }
                  `}
                >
                  {info.category === 'web'
                    ? isZh ? '网页' : 'Web'
                    : info.category === 'scientific'
                    ? isZh ? '科学' : 'Scientific'
                    : info.category === 'ai-generation'
                    ? isZh ? 'AI生成' : 'AI Gen'
                    : isZh ? '统计' : 'Statistical'}
                </span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="language-selector-indicator"
                  className="absolute inset-0 rounded-lg border-2 border-cyan-500 pointer-events-none"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Description of selected language */}
      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
        {isZh
          ? LANGUAGE_INFO[selectedLanguage].descriptionZh
          : LANGUAGE_INFO[selectedLanguage].description}
      </div>
    </div>
  )
}
