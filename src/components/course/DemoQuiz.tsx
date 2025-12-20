/**
 * DemoQuiz - 演示后的互动测验组件
 * Interactive quiz component shown after completing a demo
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  Award,
  Lightbulb,
  BookOpen,
} from 'lucide-react'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  hint?: string
}

interface DemoQuizProps {
  demoId: string
  questions: QuizQuestion[]
  theme: 'dark' | 'light'
  onComplete: (score: number, maxScore: number) => void
  onRetry?: () => void
}

interface QuizState {
  currentIndex: number
  answers: (number | null)[]
  showResult: boolean
  showHint: boolean
  submitted: boolean
}

export function DemoQuiz({
  demoId: _demoId,
  questions,
  theme,
  onComplete,
  onRetry,
}: DemoQuizProps) {
  const { t } = useTranslation()
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    showResult: false,
    showHint: false,
    submitted: false,
  })

  const currentQuestion = questions[state.currentIndex]
  const selectedAnswer = state.answers[state.currentIndex]

  // 选择答案
  const selectAnswer = useCallback((optionIndex: number) => {
    if (state.submitted) return

    setState(prev => {
      const newAnswers = [...prev.answers]
      newAnswers[prev.currentIndex] = optionIndex
      return { ...prev, answers: newAnswers }
    })
  }, [state.submitted])

  // 提交当前答案
  const submitAnswer = useCallback(() => {
    setState(prev => ({ ...prev, submitted: true }))
  }, [])

  // 下一题
  const nextQuestion = useCallback(() => {
    if (state.currentIndex < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        submitted: false,
        showHint: false,
      }))
    } else {
      // 计算得分
      const score = state.answers.reduce<number>((acc, ans, idx) => {
        return acc + (ans === questions[idx].correctIndex ? 1 : 0)
      }, 0)
      setState(prev => ({ ...prev, showResult: true }))
      onComplete(score, questions.length)
    }
  }, [state.currentIndex, state.answers, questions, onComplete])

  // 重新开始
  const restart = useCallback(() => {
    setState({
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      showResult: false,
      showHint: false,
      submitted: false,
    })
    onRetry?.()
  }, [questions.length, onRetry])

  // 显示提示
  const toggleHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: !prev.showHint }))
  }, [])

  // 计算得分
  const score = state.answers.reduce<number>((acc, ans, idx) => {
    return acc + (ans === questions[idx].correctIndex ? 1 : 0)
  }, 0)
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  // 结果页面
  if (state.showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl p-6 text-center ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* 成绩展示 */}
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              percentage >= 80
                ? 'bg-green-500/20 text-green-500'
                : percentage >= 60
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
            }`}
          >
            {percentage >= 80 ? (
              <Award className="w-12 h-12" />
            ) : percentage >= 60 ? (
              <CheckCircle className="w-12 h-12" />
            ) : (
              <BookOpen className="w-12 h-12" />
            )}
          </motion.div>

          <h3 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {percentage >= 80
              ? t('quiz.excellent')
              : percentage >= 60
                ? t('quiz.good')
                : t('quiz.keepLearning')
            }
          </h3>

          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('quiz.score', { score, total: questions.length })}
          </p>

          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 mt-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`h-full rounded-full ${
                percentage >= 80
                  ? 'bg-green-500'
                  : percentage >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex justify-center gap-3">
          <button
            onClick={restart}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            {t('quiz.retry')}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      {/* 进度条 */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('quiz.question', { current: state.currentIndex + 1, total: questions.length })}
        </span>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === state.currentIndex
                  ? 'bg-cyan-500'
                  : state.answers[idx] !== null
                    ? state.answers[idx] === questions[idx].correctIndex
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : theme === 'dark'
                      ? 'bg-slate-600'
                      : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 问题 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className={`text-lg font-medium mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {currentQuestion.question}
          </h4>

          {/* 选项 */}
          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx
              const isCorrect = idx === currentQuestion.correctIndex
              const showCorrectness = state.submitted

              let optionStyle = theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 border-slate-600'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'

              if (showCorrectness) {
                if (isCorrect) {
                  optionStyle = 'bg-green-500/20 border-green-500 text-green-400'
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-red-500/20 border-red-500 text-red-400'
                }
              } else if (isSelected) {
                optionStyle = 'bg-cyan-500/20 border-cyan-500'
              }

              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  disabled={state.submitted}
                  className={`w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${optionStyle} ${
                    state.submitted ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    showCorrectness && isCorrect
                      ? 'bg-green-500 text-white'
                      : showCorrectness && isSelected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : isSelected
                          ? 'bg-cyan-500 text-white'
                          : theme === 'dark'
                            ? 'bg-slate-600 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                    {option}
                  </span>
                  {showCorrectness && isCorrect && (
                    <CheckCircle className="w-5 h-5 ml-auto text-green-500" />
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 ml-auto text-red-500" />
                  )}
                </button>
              )
            })}
          </div>

          {/* 提示 */}
          {currentQuestion.hint && !state.submitted && (
            <button
              onClick={toggleHint}
              className={`text-sm flex items-center gap-1 mb-4 ${
                theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {state.showHint ? t('quiz.hideHint') : t('quiz.showHint')}
            </button>
          )}

          {state.showHint && currentQuestion.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-3 rounded-lg mb-4 ${
                theme === 'dark' ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-50 text-yellow-800'
              }`}
            >
              <p className="text-sm">{currentQuestion.hint}</p>
            </motion.div>
          )}

          {/* 解释 */}
          {state.submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-4 ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
              }`}
            >
              <h5 className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {t('quiz.explanation')}
              </h5>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3">
        {!state.submitted ? (
          <button
            onClick={submitAnswer}
            disabled={selectedAnswer === null}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedAnswer !== null
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                : theme === 'dark'
                  ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('quiz.submit')}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium flex items-center gap-2"
          >
            {state.currentIndex < questions.length - 1 ? t('quiz.next') : t('quiz.finish')}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default DemoQuiz
