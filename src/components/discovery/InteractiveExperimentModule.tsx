/**
 * InteractiveExperimentModule - 互动实验模块
 *
 * 设计理念：
 * - 叙事驱动 - 用故事串联实验步骤
 * - 渐进披露 - 一次只展示一个步骤
 * - 预测优先 - 先让用户猜测，再揭示结果
 * - 反思整合 - 实验后引导思考
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Check,
  AlertTriangle,
  Lightbulb,
  Eye,
  RefreshCw,
  ExternalLink,
  Package
} from 'lucide-react'

// 实验步骤类型
interface ExperimentStep {
  id: string
  type: 'setup' | 'action' | 'observe' | 'predict' | 'reveal' | 'reflect'
  title: { en: string; zh: string }
  instruction: { en: string; zh: string }
  image?: string
  prediction?: {
    question: { en: string; zh: string }
    options?: { en: string; zh: string }[]
    correctAnswer?: number
  }
  observation?: { en: string; zh: string }
  reflection?: { en: string; zh: string }
  tip?: { en: string; zh: string }
}

// 实验定义
export interface Experiment {
  id: string
  title: { en: string; zh: string }
  hook: { en: string; zh: string }  // 引人入胜的问题
  difficulty: 'easy' | 'medium' | 'advanced'
  duration: number  // 分钟
  materials: {
    name: { en: string; zh: string }
    note?: { en: string; zh: string }
    alternative?: { en: string; zh: string }
    icon?: string
  }[]
  safetyNote?: { en: string; zh: string }
  steps: ExperimentStep[]
  conclusion: { en: string; zh: string }
  nextSteps?: {
    type: 'demo' | 'game' | 'experiment' | 'calculator'
    id: string
    label: { en: string; zh: string }
  }[]
  relatedConcepts?: string[]
}

// 难度标签配置
const DIFFICULTY_CONFIG = {
  easy: { labelEn: 'Beginner', labelZh: '入门', color: '#22c55e', icon: '🌱' },
  medium: { labelEn: 'Intermediate', labelZh: '进阶', color: '#f59e0b', icon: '🔬' },
  advanced: { labelEn: 'Advanced', labelZh: '高级', color: '#ef4444', icon: '🚀' }
}

// 步骤类型配置
const STEP_TYPE_CONFIG = {
  setup: { labelEn: 'Setup', labelZh: '准备', icon: <Package className="w-4 h-4" /> },
  action: { labelEn: 'Do This', labelZh: '操作', icon: <Play className="w-4 h-4" /> },
  observe: { labelEn: 'Observe', labelZh: '观察', icon: <Eye className="w-4 h-4" /> },
  predict: { labelEn: 'Predict', labelZh: '预测', icon: <Lightbulb className="w-4 h-4" /> },
  reveal: { labelEn: 'Result', labelZh: '结果', icon: <Check className="w-4 h-4" /> },
  reflect: { labelEn: 'Think', labelZh: '思考', icon: <Lightbulb className="w-4 h-4" /> }
}

interface InteractiveExperimentModuleProps {
  experiment: Experiment
  onComplete?: () => void
}

export function InteractiveExperimentModule({
  experiment,
  onComplete
}: InteractiveExperimentModuleProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [currentStep, setCurrentStep] = useState(-1)  // -1 = 介绍页
  const [predictions, setPredictions] = useState<Record<string, number>>({})
  const [showMaterials, setShowMaterials] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const difficultyConfig = DIFFICULTY_CONFIG[experiment.difficulty]
  const totalSteps = experiment.steps.length

  // 处理预测选择
  const handlePrediction = (stepId: string, optionIndex: number) => {
    setPredictions(prev => ({ ...prev, [stepId]: optionIndex }))
  }

  // 前进到下一步
  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsCompleted(true)
      onComplete?.()
    }
  }

  // 返回上一步
  const goPrev = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // 重置实验
  const reset = () => {
    setCurrentStep(-1)
    setPredictions({})
    setIsCompleted(false)
  }

  // 当前步骤数据
  const step = currentStep >= 0 ? experiment.steps[currentStep] : null
  const stepConfig = step ? STEP_TYPE_CONFIG[step.type] : null

  return (
    <div className={cn(
      'rounded-2xl overflow-hidden',
      theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-lg'
    )}>
      {/* 顶部进度条 */}
      <div className={cn(
        'h-1 transition-all',
        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
      )}>
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`
          }}
        />
      </div>

      {/* 主内容区 */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* 介绍页 */}
          {currentStep === -1 && !isCompleted && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* 标题和难度 */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className={cn(
                    'text-xl font-bold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? experiment.title.zh : experiment.title.en}
                  </h2>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh ? experiment.hook.zh : experiment.hook.en}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: difficultyConfig.color }}
                  >
                    {difficultyConfig.icon}
                    {isZh ? difficultyConfig.labelZh : difficultyConfig.labelEn}
                  </span>
                  <span className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    ~{experiment.duration} {isZh ? '分钟' : 'min'}
                  </span>
                </div>
              </div>

              {/* 安全提示 */}
              {experiment.safetyNote && (
                <div className={cn(
                  'p-3 rounded-lg flex items-start gap-2',
                  theme === 'dark'
                    ? 'bg-amber-500/10 border border-amber-500/20'
                    : 'bg-amber-50 border border-amber-100'
                )}>
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                  )}>
                    {isZh ? experiment.safetyNote.zh : experiment.safetyNote.en}
                  </p>
                </div>
              )}

              {/* 材料清单 */}
              <div>
                <button
                  onClick={() => setShowMaterials(!showMaterials)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-700/50 hover:bg-slate-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <span className={cn(
                    'font-medium text-sm flex items-center gap-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    <Package className="w-4 h-4" />
                    {isZh ? '你需要准备' : 'You will need'}
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-xs',
                      theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'
                    )}>
                      {experiment.materials.length}
                    </span>
                  </span>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 transition-transform',
                      showMaterials && 'rotate-90'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showMaterials && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 grid grid-cols-2 gap-2">
                        {experiment.materials.map((material, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'p-2.5 rounded-lg',
                              theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{material.icon || '📦'}</span>
                              <span className={cn(
                                'text-sm font-medium',
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              )}>
                                {isZh ? material.name.zh : material.name.en}
                              </span>
                            </div>
                            {material.note && (
                              <p className={cn(
                                'text-xs',
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              )}>
                                {isZh ? material.note.zh : material.note.en}
                              </p>
                            )}
                            {material.alternative && (
                              <p className="text-xs text-cyan-500 mt-1">
                                {isZh ? '替代：' : 'Alt: '}
                                {isZh ? material.alternative.zh : material.alternative.en}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 开始按钮 */}
              <button
                onClick={goNext}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isZh ? '开始实验' : 'Start Experiment'}
              </button>
            </motion.div>
          )}

          {/* 实验步骤 */}
          {step && !isCompleted && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* 步骤标题 */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{
                    backgroundColor: step.type === 'predict' ? '#f59e0b' :
                                     step.type === 'reveal' ? '#22c55e' :
                                     step.type === 'reflect' ? '#8b5cf6' :
                                     '#06b6d4'
                  }}
                >
                  {stepConfig?.icon}
                </div>
                <div>
                  <span className={cn(
                    'text-xs font-medium uppercase tracking-wider',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {isZh
                      ? `第 ${currentStep + 1} 步 / 共 ${totalSteps} 步`
                      : `Step ${currentStep + 1} of ${totalSteps}`}
                  </span>
                  <h3 className={cn(
                    'font-semibold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? step.title.zh : step.title.en}
                  </h3>
                </div>
              </div>

              {/* 步骤说明 */}
              <p className={cn(
                'text-sm leading-relaxed',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {isZh ? step.instruction.zh : step.instruction.en}
              </p>

              {/* 预测问题 */}
              {step.type === 'predict' && step.prediction && (
                <div className={cn(
                  'p-4 rounded-xl',
                  theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
                )}>
                  <p className={cn(
                    'font-medium mb-3',
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                  )}>
                    {isZh ? step.prediction.question.zh : step.prediction.question.en}
                  </p>
                  {step.prediction.options && (
                    <div className="space-y-2">
                      {step.prediction.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePrediction(step.id, idx)}
                          className={cn(
                            'w-full text-left p-3 rounded-lg border-2 transition-all',
                            predictions[step.id] === idx
                              ? 'border-amber-500 bg-amber-500/20'
                              : theme === 'dark'
                                ? 'border-slate-600 hover:border-slate-500'
                                : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <span className={cn(
                            'text-sm',
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          )}>
                            {isZh ? option.zh : option.en}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 观察结果 */}
              {step.observation && (
                <div className={cn(
                  'p-4 rounded-xl',
                  theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
                )}>
                  <div className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-green-300' : 'text-green-800'
                    )}>
                      {isZh ? step.observation.zh : step.observation.en}
                    </p>
                  </div>
                </div>
              )}

              {/* 反思内容 */}
              {step.reflection && (
                <div className={cn(
                  'p-4 rounded-xl',
                  theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
                )}>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
                    )}>
                      {isZh ? step.reflection.zh : step.reflection.en}
                    </p>
                  </div>
                </div>
              )}

              {/* 小提示 */}
              {step.tip && (
                <p className={cn(
                  'text-xs flex items-center gap-1.5',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  💡 {isZh ? step.tip.zh : step.tip.en}
                </p>
              )}

              {/* 导航按钮 */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={goPrev}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors',
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {isZh ? '上一步' : 'Back'}
                </button>
                <button
                  onClick={goNext}
                  disabled={step.type === 'predict' && !predictions[step.id] && step.prediction?.options}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    'bg-cyan-500 text-white hover:bg-cyan-600',
                    step.type === 'predict' && !predictions[step.id] && step.prediction?.options
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  )}
                >
                  {currentStep === totalSteps - 1
                    ? (isZh ? '完成' : 'Finish')
                    : (isZh ? '下一步' : 'Next')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 完成页 */}
          {isCompleted && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className={cn(
                  'text-xl font-bold mb-2',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '实验完成！' : 'Experiment Complete!'}
                </h3>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {isZh ? experiment.conclusion.zh : experiment.conclusion.en}
                </p>
              </div>

              {/* 下一步建议 */}
              {experiment.nextSteps && experiment.nextSteps.length > 0 && (
                <div className="space-y-2">
                  <p className={cn(
                    'text-xs uppercase tracking-wider',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {isZh ? '继续探索' : 'Continue Exploring'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {experiment.nextSteps.map((next, idx) => (
                      <Link
                        key={idx}
                        to={
                          next.type === 'demo' ? `/demos/${next.id}` :
                          next.type === 'game' ? `/games/${next.id}` :
                          next.type === 'calculator' ? `/calc/${next.id}` :
                          `/discover?topic=${next.id}`
                        }
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          theme === 'dark'
                            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {isZh ? next.label.zh : next.label.en}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 重做按钮 */}
              <button
                onClick={reset}
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm transition-colors',
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <RefreshCw className="w-4 h-4" />
                {isZh ? '再做一次' : 'Do it again'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// 预定义的实验
export const EXPERIMENTS: Experiment[] = [
  {
    id: 'polarizer-sunglasses',
    title: {
      en: 'Polarizer Discovery',
      zh: '偏振片探索'
    },
    hook: {
      en: 'What happens when you stack two polarized sunglasses?',
      zh: '两副偏振太阳镜叠在一起会发生什么？'
    },
    difficulty: 'easy',
    duration: 5,
    materials: [
      {
        name: { en: 'Polarized sunglasses', zh: '偏振太阳镜' },
        note: { en: '2 pairs work best', zh: '最好有2副' },
        alternative: { en: 'LCD screen + 1 pair', zh: '液晶屏+1副眼镜' },
        icon: '🕶️'
      },
      {
        name: { en: 'Light source', zh: '光源' },
        note: { en: 'Window or lamp', zh: '窗户或灯' },
        icon: '💡'
      }
    ],
    steps: [
      {
        id: 'setup',
        type: 'setup',
        title: { en: 'Get Ready', zh: '准备好' },
        instruction: {
          en: 'Hold one pair of polarized sunglasses in front of a light source. Look through them - notice how they darken the view.',
          zh: '拿一副偏振太阳镜对着光源。透过它们看——注意它们如何让视野变暗。'
        }
      },
      {
        id: 'predict',
        type: 'predict',
        title: { en: 'Make a Prediction', zh: '做个预测' },
        instruction: {
          en: 'Now you\'re going to add a second pair of polarized sunglasses. What do you think will happen?',
          zh: '现在你要加上第二副偏振太阳镜。你觉得会发生什么？'
        },
        prediction: {
          question: {
            en: 'When you rotate the second pair, will the view get:',
            zh: '当你旋转第二副眼镜时，视野会：'
          },
          options: [
            { en: 'Always stay the same darkness', zh: '一直保持同样的暗度' },
            { en: 'Change from light to completely dark', zh: '从亮变到完全黑暗' },
            { en: 'Get lighter when rotated', zh: '旋转时变亮' }
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'action1',
        type: 'action',
        title: { en: 'Stack and Rotate', zh: '叠加并旋转' },
        instruction: {
          en: 'Hold both pairs of sunglasses together, looking through both. Slowly rotate one pair while keeping the other still.',
          zh: '把两副太阳镜放在一起，透过它们看。慢慢旋转其中一副，另一副保持不动。'
        },
        tip: {
          en: 'Rotate slowly - the effect happens every 90°!',
          zh: '慢慢旋转——效果每90°发生一次！'
        }
      },
      {
        id: 'observe',
        type: 'observe',
        title: { en: 'What Did You See?', zh: '你看到了什么？' },
        instruction: {
          en: 'Describe what happened as you rotated the sunglasses.',
          zh: '描述一下旋转太阳镜时发生了什么。'
        },
        observation: {
          en: 'At some angles the view is normal (light passes through), at others it becomes completely dark (all light is blocked). This happens every 90°!',
          zh: '在某些角度视野正常（光通过），在其他角度完全变黑（所有光被阻挡）。这每90°发生一次！'
        }
      },
      {
        id: 'reveal',
        type: 'reveal',
        title: { en: 'The Secret', zh: '秘密揭晓' },
        instruction: {
          en: 'You just discovered crossed polarizers! When two polarizers are at 90° to each other, no light can pass through. This is how LCD screens work!',
          zh: '你刚刚发现了交叉偏振片！当两个偏振片互成90°时，没有光能通过。液晶屏就是这样工作的！'
        },
        reflection: {
          en: 'The first polarizer only lets light vibrating in one direction through. If the second polarizer is oriented at 90°, it blocks that direction completely.',
          zh: '第一个偏振片只让一个方向振动的光通过。如果第二个偏振片旋转90°，它就完全阻挡了这个方向。'
        }
      },
      {
        id: 'reflect',
        type: 'reflect',
        title: { en: 'Think About It', zh: '想一想' },
        instruction: {
          en: 'Why do you think polarized sunglasses reduce glare from water or roads?',
          zh: '你认为偏振太阳镜为什么能减少水面或道路的眩光？'
        },
        reflection: {
          en: 'Light reflected from flat surfaces (like water, roads, or glass) becomes partially polarized. Polarized sunglasses block this horizontally polarized light, reducing glare!',
          zh: '从平面（如水面、道路或玻璃）反射的光会部分偏振。偏振太阳镜阻挡这种水平偏振光，从而减少眩光！'
        }
      }
    ],
    conclusion: {
      en: 'You discovered that polarized light only vibrates in one direction, and polarizers can block or pass light depending on their orientation!',
      zh: '你发现了偏振光只在一个方向振动，偏振片可以根据它们的方向阻挡或通过光！'
    },
    nextSteps: [
      { type: 'demo', id: 'malus', label: { en: 'See the math', zh: '看看数学公式' } },
      { type: 'game', id: '2d', label: { en: 'Play a puzzle', zh: '玩个谜题' } }
    ]
  }
]

export default InteractiveExperimentModule
