/**
 * Research Task Modal - Interactive task execution interface
 * 研究任务模态框 - 交互式任务执行界面
 *
 * Features:
 * - Left Panel: Task guide with steps, formulas, and background theory
 * - Right Panel: Dynamic workspace based on task category
 *   - Experiment: Data entry table + live chart
 *   - Simulation: Embedded demo/calculator
 *   - Literature: Markdown editor
 */

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useLabStore, DataPoint, FitResult } from '@/stores/labStore'
import { DataEntryTable } from './DataEntryTable'
import { DataChart, ResidualsChart } from './DataChart'
import { cosineFit, calculateExtinctionRatio } from './dataAnalysis'
import {
  X, ChevronRight, ChevronDown,
  BookOpen, FlaskConical, Calculator, FileText,
  Play, RotateCcw, CheckCircle2, AlertCircle,
  TrendingUp, Award, Lightbulb, Info
} from 'lucide-react'

// Task definitions with detailed content
interface TaskContent {
  id: string
  category: 'experiment' | 'simulation' | 'analysis' | 'literature'
  titleEn: string
  titleZh: string
  backgroundEn: string
  backgroundZh: string
  stepsEn: string[]
  stepsZh: string[]
  formulasEn?: string[]
  formulasZh?: string[]
  hintsEn?: string[]
  hintsZh?: string[]
  successCriteria?: {
    minDataPoints?: number
    minRSquared?: number
    requiredExtinctionRatio?: { min: number; max: number }
  }
}

// Task content database (expanded from RESEARCH_TASKS)
const TASK_CONTENT: Record<string, TaskContent> = {
  'polarizer-basics': {
    id: 'polarizer-basics',
    category: 'experiment',
    titleEn: 'Polarizer Characterization',
    titleZh: '偏振片特性测定',
    backgroundEn: `Malus's Law describes how the intensity of linearly polarized light changes when passing through a polarizer. Named after Étienne-Louis Malus who discovered polarization by reflection in 1808.

When polarized light passes through a polarizer, the transmitted intensity follows:
I = I₀ × cos²(θ - θ₀)

Where:
• I₀ = Initial intensity (maximum transmission)
• θ = Polarizer angle
• θ₀ = Light polarization angle`,
    backgroundZh: `马吕斯定律描述了线偏振光通过偏振片时强度的变化规律。该定律以1808年通过反射发现偏振现象的艾蒂安-路易·马吕斯命名。

当偏振光通过偏振片时，透射强度遵循：
I = I₀ × cos²(θ - θ₀)

其中：
• I₀ = 初始强度（最大透射）
• θ = 偏振片角度
• θ₀ = 入射光偏振角`,
    stepsEn: [
      'Set up a polarized light source and rotate the analyzer polarizer',
      'Measure transmitted intensity at different analyzer angles (0° to 180°)',
      'Record at least 10 data points with 15-20° intervals',
      'Fit the data to cos²(θ) function',
      'Calculate extinction ratio from fit parameters',
      'Analyze residuals to evaluate fit quality'
    ],
    stepsZh: [
      '设置偏振光源，旋转检偏器',
      '在不同检偏器角度测量透射强度（0°到180°）',
      '以15-20°间隔记录至少10个数据点',
      '将数据拟合到cos²(θ)函数',
      '从拟合参数计算消光比',
      '分析残差评估拟合质量'
    ],
    formulasEn: [
      "Malus's Law: I = I₀ × cos²(θ - θ₀)",
      'Extinction Ratio: ER = I_max / I_min',
      'R² (coefficient of determination) measures fit quality'
    ],
    formulasZh: [
      '马吕斯定律: I = I₀ × cos²(θ - θ₀)',
      '消光比: ER = I_max / I_min',
      'R² (决定系数) 衡量拟合质量'
    ],
    hintsEn: [
      'Maximum intensity occurs when polarizer and light are aligned',
      'Minimum should be near zero for a good polarizer',
      'High extinction ratio (>100) indicates high quality polarizer'
    ],
    hintsZh: [
      '当偏振片与入射光平行时强度最大',
      '好的偏振片最小值应接近零',
      '高消光比（>100）表示高质量偏振片'
    ],
    successCriteria: {
      minDataPoints: 5,
      minRSquared: 0.95,
    }
  },
  'brewster-angle': {
    id: 'brewster-angle',
    category: 'experiment',
    titleEn: "Brewster's Angle Measurement",
    titleZh: '布儒斯特角测量',
    backgroundEn: `Brewster's angle is the angle at which light with p-polarization is perfectly transmitted through a transparent interface with no reflection. At this angle, reflected and refracted rays are perpendicular.

tan(θ_B) = n₂/n₁

For air-glass interface (n₁ ≈ 1):
θ_B = arctan(n_glass)`,
    backgroundZh: `布儒斯特角是p偏振光完全透过透明界面而无反射的角度。在此角度，反射光和折射光相互垂直。

tan(θ_B) = n₂/n₁

对于空气-玻璃界面 (n₁ ≈ 1):
θ_B = arctan(n_玻璃)`,
    stepsEn: [
      'Direct unpolarized light at a glass surface',
      'Observe reflected light through a polarizer',
      'Rotate incident angle to find minimum reflection',
      'Measure Brewster angle and calculate refractive index'
    ],
    stepsZh: [
      '将非偏振光照射到玻璃表面',
      '通过偏振片观察反射光',
      '旋转入射角找到最小反射',
      '测量布儒斯特角并计算折射率'
    ],
    formulasEn: [
      "Brewster's angle: θ_B = arctan(n₂/n₁)",
      'Refractive index: n = tan(θ_B)'
    ],
    formulasZh: [
      '布儒斯特角: θ_B = arctan(n₂/n₁)',
      '折射率: n = tan(θ_B)'
    ],
    successCriteria: {
      minDataPoints: 3,
    }
  },
  'mueller-matrix': {
    id: 'mueller-matrix',
    category: 'experiment',
    titleEn: 'Mueller Matrix Polarimetry',
    titleZh: '穆勒矩阵偏振测量',
    backgroundEn: `The Mueller matrix is a 4×4 real matrix that completely describes the polarization properties of an optical element. Using the dual-rotating retarder method, we can measure all 16 elements of the Mueller matrix.

The measurement uses two rotating quarter-wave plates placed before and after the sample, with fixed polarizers at the input and output. By analyzing intensity as a function of retarder angles, all Mueller matrix elements can be extracted via Fourier analysis.

M = [m₀₀  m₀₁  m₀₂  m₀₃]
    [m₁₀  m₁₁  m₁₂  m₁₃]
    [m₂₀  m₂₁  m₂₂  m₂₃]
    [m₃₀  m₃₁  m₃₂  m₃₃]`,
    backgroundZh: `穆勒矩阵是一个4×4实矩阵，完整描述了光学元件的偏振特性。使用双旋转延迟器方法，可以测量穆勒矩阵的全部16个元素。

测量使用两个旋转四分之一波片分别放置在样品前后，输入和输出端各有一个固定偏振片。通过分析强度随延迟器角度的变化，可以通过傅里叶分析提取所有穆勒矩阵元素。

M = [m₀₀  m₀₁  m₀₂  m₀₃]
    [m₁₀  m₁₁  m₁₂  m₁₃]
    [m₂₀  m₂₁  m₂₂  m₂₃]
    [m₃₀  m₃₁  m₃₂  m₃₃]`,
    stepsEn: [
      'Configure the dual-rotating retarder polarimeter setup',
      'Calibrate the system with known samples (air, polarizer)',
      'Measure intensity at multiple retarder angle combinations',
      'Extract Mueller matrix elements via Fourier analysis',
      'Validate with known optical elements',
      'Analyze polarization properties: diattenuation, retardance, depolarization'
    ],
    stepsZh: [
      '配置双旋转延迟器偏振计装置',
      '使用已知样品（空气、偏振片）校准系统',
      '在多个延迟器角度组合下测量强度',
      '通过傅里叶分析提取穆勒矩阵元素',
      '使用已知光学元件验证',
      '分析偏振特性：二向衰减、延迟、退偏振'
    ],
    formulasEn: [
      'I(θ₁, θ₂) = Σ aₙ cos(2nθ₁) + bₙ sin(2nθ₁)',
      'Mueller matrix: S_out = M · S_in',
      'Diattenuation: D = √(m₀₁² + m₀₂² + m₀₃²) / m₀₀',
      'Depolarization index: 0 ≤ DI ≤ 1'
    ],
    formulasZh: [
      'I(θ₁, θ₂) = Σ aₙ cos(2nθ₁) + bₙ sin(2nθ₁)',
      '穆勒矩阵: S_out = M · S_in',
      '二向衰减: D = √(m₀₁² + m₀₂² + m₀₃²) / m₀₀',
      '退偏振指数: 0 ≤ DI ≤ 1'
    ],
    hintsEn: [
      'Start calibration with an empty path (air) to establish the baseline',
      'A perfect polarizer has D = 1 and a specific Mueller matrix pattern',
      'Normalize all elements by m₀₀ for easier interpretation'
    ],
    hintsZh: [
      '先用空光路（空气）校准以建立基线',
      '理想偏振片的二向衰减 D = 1，且具有特定穆勒矩阵模式',
      '所有元素除以 m₀₀ 可简化分析'
    ],
    successCriteria: {
      minDataPoints: 8,
      minRSquared: 0.90,
    }
  },
  'lcd-simulation': {
    id: 'lcd-simulation',
    category: 'simulation',
    titleEn: 'LCD Display Simulation',
    titleZh: 'LCD显示器仿真',
    backgroundEn: `Liquid Crystal Displays (LCDs) use twisted nematic liquid crystals sandwiched between crossed polarizers. When no voltage is applied, the liquid crystal molecules twist 90° from one surface to the other, rotating the polarization of light so it passes through the second polarizer.

When voltage is applied, the molecules align with the electric field, removing the twist. Light polarization is no longer rotated, so it is blocked by the crossed analyzer — the pixel turns dark.

The Jones matrix for a twisted nematic cell depends on the twist angle φ, birefringence Δn, cell thickness d, and wavelength λ.`,
    backgroundZh: `液晶显示器（LCD）使用夹在正交偏振片之间的扭曲向列液晶。当未施加电压时，液晶分子从一个表面到另一个表面扭曲90°，旋转光的偏振方向使其通过第二个偏振片。

当施加电压时，分子沿电场排列，消除扭曲。光的偏振不再被旋转，因此被交叉检偏器阻挡——像素变暗。

扭曲向列液晶单元的琼斯矩阵取决于扭曲角φ、双折射Δn、单元厚度d和波长λ。`,
    stepsEn: [
      'Set initial LCD parameters (twist angle, cell thickness, birefringence)',
      'Observe the bright state (no voltage) — light passes through',
      'Increase applied voltage and observe intensity decrease',
      'Find the threshold voltage where transmission drops to 50%',
      'Map the complete voltage-transmission curve',
      'Explore wavelength dependence for color LCD understanding'
    ],
    stepsZh: [
      '设置初始LCD参数（扭曲角、单元厚度、双折射率）',
      '观察亮态（无电压）——光通过',
      '增加施加电压，观察强度降低',
      '找到透射率降到50%的阈值电压',
      '绘制完整的电压-透射率曲线',
      '探索波长依赖性以理解彩色LCD'
    ],
    formulasEn: [
      'Phase retardation: Γ = 2π·Δn·d / λ',
      'Twisted nematic transmission: T = sin²(φ·√(1 + u²)) / (1 + u²)',
      'Mauguin parameter: u = Γ / (2φ)',
      'Threshold voltage: V_th = π·√(K₁₁ / (ε₀·Δε))'
    ],
    formulasZh: [
      '相位延迟: Γ = 2π·Δn·d / λ',
      '扭曲向列透射率: T = sin²(φ·√(1 + u²)) / (1 + u²)',
      '莫甘参数: u = Γ / (2φ)',
      '阈值电压: V_th = π·√(K₁₁ / (ε₀·Δε))'
    ],
    hintsEn: [
      'In the Mauguin regime (u >> 1), the LC acts as a perfect waveguide',
      'Real LCDs use multiple subpixels with color filters for full color',
      'The voltage-transmission curve is nonlinear, enabling grayscale control'
    ],
    hintsZh: [
      '在莫甘区域（u >> 1），液晶充当完美波导',
      '真实LCD使用多个子像素配合滤色片实现全彩',
      '电压-透射率曲线是非线性的，可实现灰度控制'
    ],
  },
  'literature-review': {
    id: 'literature-review',
    category: 'literature',
    titleEn: 'Literature Review: Polarimetric Remote Sensing',
    titleZh: '文献综述：偏振遥感',
    backgroundEn: `Polarimetric remote sensing uses the polarization state of light to extract information about the Earth's surface and atmosphere that intensity-only measurements cannot provide.

Key applications include:
• Atmospheric aerosol characterization (size, shape, refractive index)
• Ocean surface roughness and oil spill detection
• Vegetation stress and canopy structure analysis
• Cloud phase discrimination (ice vs. water droplets)

Recent advances combine polarimetric imaging with machine learning for automated feature extraction and classification.`,
    backgroundZh: `偏振遥感利用光的偏振态提取仅靠强度测量无法获得的地球表面和大气信息。

主要应用包括：
• 大气气溶胶表征（大小、形状、折射率）
• 海面粗糙度和溢油检测
• 植被胁迫和冠层结构分析
• 云相态识别（冰晶 vs. 水滴）

最新进展将偏振成像与机器学习相结合，实现自动特征提取和分类。`,
    stepsEn: [
      'Survey major polarimetric remote sensing missions (POLDER, AirMSPI, 3MI)',
      'Identify key measurement principles and instrument designs',
      'Review atmospheric retrieval algorithms using polarization data',
      'Analyze recent machine learning approaches in polarimetric classification',
      'Evaluate current limitations and future research directions',
      'Write a structured review summary with key findings'
    ],
    stepsZh: [
      '调研主要偏振遥感任务（POLDER、AirMSPI、3MI）',
      '确定关键测量原理和仪器设计',
      '综述使用偏振数据的大气反演算法',
      '分析偏振分类中的最新机器学习方法',
      '评估当前局限性和未来研究方向',
      '撰写结构化综述摘要，总结关键发现'
    ],
    formulasEn: [
      'Degree of Linear Polarization: DoLP = √(Q² + U²) / I',
      'Stokes vector: S = [I, Q, U, V]ᵀ',
      'Angle of Polarization: AoP = ½ arctan(U/Q)'
    ],
    formulasZh: [
      '线偏振度: DoLP = √(Q² + U²) / I',
      '斯托克斯矢量: S = [I, Q, U, V]ᵀ',
      '偏振角: AoP = ½ arctan(U/Q)'
    ],
    hintsEn: [
      'Start with review papers to get an overview before diving into specific topics',
      'Focus on 2-3 application areas rather than trying to cover everything',
      'Pay attention to the measurement geometry — viewing angle matters for polarization'
    ],
    hintsZh: [
      '先从综述论文入手了解全貌，再深入具体课题',
      '聚焦2-3个应用领域，而非试图涵盖所有内容',
      '注意测量几何——观测角度对偏振至关重要'
    ],
  },
}

// Default content for tasks not in database
function getDefaultContent(taskId: string): TaskContent {
  return {
    id: taskId,
    category: 'experiment',
    titleEn: 'Research Task',
    titleZh: '研究任务',
    backgroundEn: 'This task is under development. More content coming soon.',
    backgroundZh: '此任务正在开发中，更多内容即将推出。',
    stepsEn: ['Follow the experimental procedure', 'Record your observations', 'Analyze the results'],
    stepsZh: ['按照实验步骤进行', '记录观察结果', '分析实验结果'],
  }
}

export function ResearchTaskModal() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Lab store
  const {
    activeTaskId,
    isModalOpen,
    closeTask,
    taskProgress,
    saveTaskData,
    saveTaskFitResult,
    submitTask,
  } = useLabStore()

  // Local state
  const [currentStep, setCurrentStep] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get task content
  const content = useMemo(() => {
    if (!activeTaskId) return null
    return TASK_CONTENT[activeTaskId] || getDefaultContent(activeTaskId)
  }, [activeTaskId])

  // Get current task progress
  const progress = activeTaskId ? taskProgress[activeTaskId] : undefined

  // Current data
  const data = progress?.data || []
  const fitResult = progress?.fitResult || null

  // Handle data change
  const handleDataChange = useCallback((newData: DataPoint[]) => {
    if (!activeTaskId) return
    saveTaskData(activeTaskId, newData)
  }, [activeTaskId, saveTaskData])

  // Auto-fit when data changes
  useEffect(() => {
    if (data.length >= 3) {
      const result = cosineFit(data)
      if (result && activeTaskId) {
        saveTaskFitResult(activeTaskId, result)
      }
    }
  }, [data, activeTaskId, saveTaskFitResult])

  // Check if task meets success criteria
  const validation = useMemo(() => {
    if (!content?.successCriteria) return { valid: true, messages: [] }

    const messages: { type: 'success' | 'warning' | 'error'; text: string }[] = []
    const criteria = content.successCriteria

    // Check data points
    if (criteria.minDataPoints) {
      if (data.length >= criteria.minDataPoints) {
        messages.push({
          type: 'success',
          text: isZh
            ? `✓ 数据点: ${data.length}/${criteria.minDataPoints}`
            : `✓ Data points: ${data.length}/${criteria.minDataPoints}`
        })
      } else {
        messages.push({
          type: 'error',
          text: isZh
            ? `✗ 需要至少 ${criteria.minDataPoints} 个数据点 (当前: ${data.length})`
            : `✗ Need at least ${criteria.minDataPoints} data points (current: ${data.length})`
        })
      }
    }

    // Check R²
    if (criteria.minRSquared && fitResult) {
      if (fitResult.rSquared >= criteria.minRSquared) {
        messages.push({
          type: 'success',
          text: isZh
            ? `✓ R² = ${fitResult.rSquared.toFixed(3)} (≥ ${criteria.minRSquared})`
            : `✓ R² = ${fitResult.rSquared.toFixed(3)} (≥ ${criteria.minRSquared})`
        })
      } else {
        messages.push({
          type: 'warning',
          text: isZh
            ? `⚠ R² = ${fitResult.rSquared.toFixed(3)} (建议 ≥ ${criteria.minRSquared})`
            : `⚠ R² = ${fitResult.rSquared.toFixed(3)} (recommended ≥ ${criteria.minRSquared})`
        })
      }
    }

    const valid = messages.every(m => m.type !== 'error')
    return { valid, messages }
  }, [content, data, fitResult, isZh])

  // Handle task submission
  const handleSubmit = useCallback(() => {
    if (!activeTaskId || !validation.valid) return

    setIsSubmitting(true)
    // Simulate submission delay
    setTimeout(() => {
      submitTask(activeTaskId)
      setIsSubmitting(false)
    }, 1000)
  }, [activeTaskId, validation.valid, submitTask])

  if (!isModalOpen || !content) return null

  // Category icon
  const CategoryIcon = {
    experiment: FlaskConical,
    simulation: Calculator,
    analysis: TrendingUp,
    literature: FileText,
  }[content.category]

  // Steps
  const steps = isZh ? content.stepsZh : content.stepsEn
  const formulas = isZh ? content.formulasZh : content.formulasEn
  const hints = isZh ? content.hintsZh : content.hintsEn
  const background = isZh ? content.backgroundZh : content.backgroundEn
  const title = isZh ? content.titleZh : content.titleEn

  // Extinction ratio
  const extinctionRatio = fitResult ? calculateExtinctionRatio(fitResult) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeTask}
      />

      {/* Modal */}
      <div className={cn(
        'relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden flex',
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      )}>
        {/* Close button */}
        <button
          onClick={closeTask}
          className={cn(
            'absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors',
            theme === 'dark'
              ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Panel - Guide */}
        <div className={cn(
          'w-[380px] flex-shrink-0 overflow-y-auto border-r',
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
        )}>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className={cn(
                'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-3',
                theme === 'dark' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              )}>
                <CategoryIcon className="w-4 h-4" />
                <span>
                  {content.category === 'experiment' && (isZh ? '实验' : 'Experiment')}
                  {content.category === 'simulation' && (isZh ? '仿真' : 'Simulation')}
                  {content.category === 'analysis' && (isZh ? '分析' : 'Analysis')}
                  {content.category === 'literature' && (isZh ? '文献' : 'Literature')}
                </span>
              </div>
              <h2 className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {title}
              </h2>
            </div>

            {/* Background */}
            <div>
              <h3 className={cn(
                'flex items-center gap-2 font-semibold mb-2',
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              )}>
                <BookOpen className="w-4 h-4" />
                {isZh ? '背景知识' : 'Background'}
              </h3>
              <div className={cn(
                'text-sm whitespace-pre-line',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {background}
              </div>
            </div>

            {/* Formulas */}
            {formulas && formulas.length > 0 && (
              <div>
                <h3 className={cn(
                  'flex items-center gap-2 font-semibold mb-2',
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                )}>
                  <Calculator className="w-4 h-4" />
                  {isZh ? '关键公式' : 'Key Formulas'}
                </h3>
                <div className={cn(
                  'space-y-2 p-3 rounded-lg font-mono text-sm',
                  theme === 'dark' ? 'bg-slate-900/50' : 'bg-white border border-gray-200'
                )}>
                  {formulas.map((formula, i) => (
                    <div key={i} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}>
                      {formula}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            <div>
              <h3 className={cn(
                'flex items-center gap-2 font-semibold mb-3',
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              )}>
                <FlaskConical className="w-4 h-4" />
                {isZh ? '实验步骤' : 'Procedure'}
              </h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      'flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                      currentStep === index
                        ? theme === 'dark'
                          ? 'bg-yellow-500/10 border border-yellow-500/30'
                          : 'bg-yellow-50 border border-yellow-200'
                        : theme === 'dark'
                          ? 'hover:bg-slate-700/50'
                          : 'hover:bg-gray-100'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium',
                      currentStep > index
                        ? 'bg-green-500 text-white'
                        : currentStep === index
                          ? theme === 'dark'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-yellow-400 text-black'
                          : theme === 'dark'
                            ? 'bg-slate-600 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                    )}>
                      {currentStep > index ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            {hints && hints.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={cn(
                    'flex items-center gap-2 font-semibold w-full',
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  )}
                >
                  <Lightbulb className="w-4 h-4" />
                  {isZh ? '提示' : 'Hints'}
                  {showHints ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
                {showHints && (
                  <div className={cn(
                    'mt-2 p-3 rounded-lg text-sm space-y-2',
                    theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
                  )}>
                    {hints.map((hint, i) => (
                      <div key={i} className={cn(
                        'flex items-start gap-2',
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                      )}>
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Workspace */}
        <div className="flex-1 overflow-y-auto p-6">
          {content.category === 'experiment' && (
            <ExperimentWorkspace
              data={data}
              fitResult={fitResult}
              onDataChange={handleDataChange}
              validation={validation}
              extinctionRatio={extinctionRatio}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSubmitted={progress?.status === 'submitted' || progress?.status === 'published'}
            />
          )}

          {content.category === 'simulation' && (
            <SimulationWorkspace taskId={content.id} />
          )}

          {content.category === 'literature' && (
            <LiteratureWorkspace taskId={content.id} />
          )}

          {content.category === 'analysis' && (
            <AnalysisWorkspace taskId={content.id} />
          )}
        </div>
      </div>
    </div>
  )
}

// Experiment Workspace Component
interface ExperimentWorkspaceProps {
  data: DataPoint[]
  fitResult: FitResult | null
  onDataChange: (data: DataPoint[]) => void
  validation: { valid: boolean; messages: { type: 'success' | 'warning' | 'error'; text: string }[] }
  extinctionRatio: number | null
  onSubmit: () => void
  isSubmitting: boolean
  isSubmitted: boolean
}

function ExperimentWorkspace({
  data,
  fitResult,
  onDataChange,
  validation,
  extinctionRatio,
  onSubmit,
  isSubmitting,
  isSubmitted,
}: ExperimentWorkspaceProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-6">
      {/* Chart */}
      <DataChart
        data={data}
        fitResult={fitResult}
        showTheoretical={false}
      />

      {/* Residuals (if fit exists) */}
      {fitResult && data.length >= 3 && (
        <ResidualsChart data={data} fitResult={fitResult} />
      )}

      {/* Fit Results */}
      {fitResult && (
        <div className={cn(
          'grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
        )}>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              I₀ ({isZh ? '最大强度' : 'Max Intensity'})
            </div>
            <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {((fitResult.params.amplitude || 0) + (fitResult.params.offset || 0)).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              θ₀ ({isZh ? '相位' : 'Phase'})
            </div>
            <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {(fitResult.params.phase || 0).toFixed(1)}°
            </div>
          </div>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              R² ({isZh ? '拟合度' : 'Fit Quality'})
            </div>
            <div className={cn(
              'text-lg font-semibold tabular-nums',
              fitResult.rSquared >= 0.95
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : fitResult.rSquared >= 0.9
                  ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  : theme === 'dark' ? 'text-red-400' : 'text-red-600'
            )}>
              {fitResult.rSquared.toFixed(4)}
            </div>
          </div>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {isZh ? '消光比' : 'Extinction Ratio'}
            </div>
            <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {extinctionRatio !== null
                ? extinctionRatio === Infinity ? '∞' : extinctionRatio.toFixed(1)
                : '—'}
            </div>
          </div>
        </div>
      )}

      {/* Data Entry */}
      <div>
        <h3 className={cn(
          'font-semibold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '实验数据录入' : 'Data Entry'}
        </h3>
        <DataEntryTable
          data={data}
          onChange={onDataChange}
        />
      </div>

      {/* Validation & Submit */}
      <div className={cn(
        'p-4 rounded-xl border',
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <h4 className={cn(
          'font-semibold mb-3 flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <CheckCircle2 className="w-4 h-4" />
          {isZh ? '完成检查' : 'Completion Check'}
        </h4>

        <div className="space-y-2 mb-4">
          {validation.messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'text-sm flex items-center gap-2',
                msg.type === 'success' && (theme === 'dark' ? 'text-green-400' : 'text-green-600'),
                msg.type === 'warning' && (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'),
                msg.type === 'error' && (theme === 'dark' ? 'text-red-400' : 'text-red-600')
              )}
            >
              {msg.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {msg.text}
            </div>
          ))}
        </div>

        {isSubmitted ? (
          <div className={cn(
            'flex items-center gap-2 text-green-500',
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          )}>
            <Award className="w-5 h-5" />
            <span className="font-medium">
              {isZh ? '任务已提交！' : 'Task Submitted!'}
            </span>
          </div>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!validation.valid || isSubmitting}
            className={cn(
              'w-full py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
              validation.valid && !isSubmitting
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                {isZh ? '提交中...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isZh ? '提交任务' : 'Submit Task'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Simulation Workspace - Interactive LCD pixel simulation
// 仿真工作台 - 交互式LCD像素仿真
function SimulationWorkspace({ taskId: _taskId }: { taskId: string }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // LCD simulation parameters
  const [voltage, setVoltage] = useState(0)         // Applied voltage (0-5V)
  const [cellThickness, setCellThickness] = useState(5) // Cell thickness in μm
  const [birefringence, setBirefringence] = useState(0.15) // Δn
  const [wavelength, setWavelength] = useState(550)  // Wavelength in nm
  const [twistAngle] = useState(90)                  // Twist angle in degrees

  // Calculate LCD transmission using Gooch-Tarry formula
  // T = sin²(φ√(1 + u²)) / (1 + u²)
  // where u = Γ/(2φ), Γ = 2π·Δn·d/λ
  const simulation = useMemo(() => {
    const phi = twistAngle * Math.PI / 180
    const gamma = 2 * Math.PI * birefringence * cellThickness * 1000 / wavelength

    // Effective twist decreases with voltage (simplified model)
    // At V=0: full twist; at V>>Vth: no twist
    const vThreshold = 1.0 // Simplified threshold voltage
    const effectiveTwist = voltage < vThreshold
      ? phi
      : phi * Math.max(0, 1 - ((voltage - vThreshold) / 4) ** 1.5)

    const u = gamma / (2 * phi)
    const sqrtTerm = Math.sqrt(1 + u * u)

    // Bright state: crossed polarizers + twist = transmission
    // When twist is 90° and Mauguin condition met, T ≈ 1
    const transmissionNoVoltage = Math.sin(phi * sqrtTerm) ** 2 / (1 + u * u)

    // With voltage, effective twist changes
    const uEff = gamma / (2 * Math.max(effectiveTwist, 0.01))
    const sqrtTermEff = Math.sqrt(1 + uEff * uEff)
    const transmissionWithVoltage = effectiveTwist > 0.01
      ? Math.sin(effectiveTwist * sqrtTermEff) ** 2 / (1 + uEff * uEff)
      : 0 // No twist → crossed polarizers block light

    // Generate V-T curve
    const vtCurve: { v: number; t: number }[] = []
    for (let v = 0; v <= 5; v += 0.1) {
      const eTwist = v < vThreshold
        ? phi
        : phi * Math.max(0, 1 - ((v - vThreshold) / 4) ** 1.5)
      const uV = gamma / (2 * Math.max(eTwist, 0.01))
      const sqV = Math.sqrt(1 + uV * uV)
      const tV = eTwist > 0.01
        ? Math.sin(eTwist * sqV) ** 2 / (1 + uV * uV)
        : 0
      vtCurve.push({ v, t: tV * 100 })
    }

    return {
      transmission: transmissionWithVoltage * 100,
      transmissionMax: transmissionNoVoltage * 100,
      gamma,
      u,
      effectiveTwist: effectiveTwist * 180 / Math.PI,
      vtCurve,
    }
  }, [voltage, cellThickness, birefringence, wavelength, twistAngle])

  // SVG chart dimensions
  const chartW = 420
  const chartH = 200
  const margin = { top: 20, right: 15, bottom: 35, left: 45 }
  const innerW = chartW - margin.left - margin.right
  const innerH = chartH - margin.top - margin.bottom

  const colors = {
    bg: theme === 'dark' ? '#1e293b' : '#ffffff',
    grid: theme === 'dark' ? '#334155' : '#e5e7eb',
    axis: theme === 'dark' ? '#64748b' : '#6b7280',
    text: theme === 'dark' ? '#94a3b8' : '#6b7280',
    curve: theme === 'dark' ? '#a78bfa' : '#7c3aed',
    marker: theme === 'dark' ? '#f59e0b' : '#d97706',
  }

  return (
    <div className="space-y-5">
      {/* LCD Pixel Visualization */}
      <div className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <svg viewBox="0 0 420 160" className="w-full" style={{ minHeight: 160 }}>
          <rect width={420} height={160} fill={colors.bg} />

          {/* Light source */}
          <circle cx={40} cy={80} r={18} fill={theme === 'dark' ? '#fbbf24' : '#f59e0b'} opacity={0.9} />
          <text x={40} y={84} textAnchor="middle" fill={theme === 'dark' ? '#1e293b' : '#fff'} fontSize={10} fontWeight="bold">
            {isZh ? '光' : 'L'}
          </text>

          {/* Input polarizer */}
          <rect x={75} y={55} width={8} height={50} rx={2} fill={theme === 'dark' ? '#60a5fa' : '#3b82f6'} />
          <line x1={79} y1={58} x2={79} y2={102} stroke="white" strokeWidth={1.5} opacity={0.7} />
          <text x={79} y={120} textAnchor="middle" fill={colors.text} fontSize={9}>P</text>

          {/* LC cell */}
          <rect x={110} y={50} width={160} height={60} rx={4}
            fill={theme === 'dark' ? '#1e1b4b' : '#ede9fe'}
            stroke={theme === 'dark' ? '#4c1d95' : '#8b5cf6'}
            strokeWidth={1.5}
          />
          {/* Twist visualization inside LC cell - lines rotating based on effectiveTwist */}
          {Array.from({ length: 8 }).map((_, i) => {
            const x = 120 + i * 18
            const fraction = i / 7
            const angle = fraction * simulation.effectiveTwist
            const len = 18
            const rad = angle * Math.PI / 180
            return (
              <line
                key={i}
                x1={x - Math.sin(rad) * len / 2}
                y1={80 - Math.cos(rad) * len / 2}
                x2={x + Math.sin(rad) * len / 2}
                y2={80 + Math.cos(rad) * len / 2}
                stroke={theme === 'dark' ? '#a78bfa' : '#7c3aed'}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.8}
              />
            )
          })}
          <text x={190} y={45} textAnchor="middle" fill={colors.text} fontSize={9}>
            {isZh ? '液晶层' : 'LC Cell'} ({simulation.effectiveTwist.toFixed(0)}°)
          </text>

          {/* Output polarizer (crossed) */}
          <rect x={290} y={55} width={8} height={50} rx={2} fill={theme === 'dark' ? '#60a5fa' : '#3b82f6'} />
          <line x1={286} y1={80} x2={302} y2={80} stroke="white" strokeWidth={1.5} opacity={0.7} />
          <text x={294} y={120} textAnchor="middle" fill={colors.text} fontSize={9}>A</text>

          {/* Light beam through system */}
          <line x1={58} y1={80} x2={75} y2={80}
            stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'} strokeWidth={3} opacity={0.8}
          />
          <line x1={83} y1={80} x2={110} y2={80}
            stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'} strokeWidth={3}
            opacity={0.7}
          />
          <line x1={270} y1={80} x2={290} y2={80}
            stroke={theme === 'dark' ? '#a78bfa' : '#7c3aed'} strokeWidth={3}
            opacity={simulation.transmission / 100 * 0.8 + 0.1}
          />
          <line x1={298} y1={80} x2={340} y2={80}
            stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'} strokeWidth={3}
            opacity={simulation.transmission / 100 * 0.8 + 0.05}
          />

          {/* Output intensity display */}
          <circle cx={370} cy={80} r={22}
            fill={`rgba(251, 191, 36, ${simulation.transmission / 100})`}
            stroke={theme === 'dark' ? '#fbbf24' : '#f59e0b'}
            strokeWidth={1.5}
            opacity={0.9}
          />
          <text x={370} y={84} textAnchor="middle" fill={colors.text} fontSize={10} fontWeight="bold">
            {simulation.transmission.toFixed(0)}%
          </text>

          {/* Voltage indicator */}
          <text x={190} y={135} textAnchor="middle" fill={colors.text} fontSize={10}>
            V = {voltage.toFixed(1)}V | T = {simulation.transmission.toFixed(1)}%
          </text>
        </svg>
      </div>

      {/* V-T Curve */}
      <div className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ minHeight: chartH }}>
          <rect width={chartW} height={chartH} fill={colors.bg} />
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Grid */}
            {[0, 25, 50, 75, 100].map(t => (
              <line key={t}
                x1={0} y1={innerH - (t / 100) * innerH}
                x2={innerW} y2={innerH - (t / 100) * innerH}
                stroke={colors.grid} strokeDasharray="3 3" opacity={0.5}
              />
            ))}
            {/* Axes */}
            <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke={colors.axis} strokeWidth={1.5} />
            <line x1={0} y1={0} x2={0} y2={innerH} stroke={colors.axis} strokeWidth={1.5} />

            {/* V-T curve */}
            <path
              d={simulation.vtCurve.map((p, i) =>
                `${i === 0 ? 'M' : 'L'} ${(p.v / 5) * innerW} ${innerH - (p.t / 100) * innerH}`
              ).join(' ')}
              fill="none" stroke={colors.curve} strokeWidth={2.5} strokeLinecap="round"
            />

            {/* Current voltage marker */}
            <circle
              cx={(voltage / 5) * innerW}
              cy={innerH - (simulation.transmission / 100) * innerH}
              r={5} fill={colors.marker} stroke="white" strokeWidth={1.5}
            />

            {/* Axis labels */}
            {[0, 1, 2, 3, 4, 5].map(v => (
              <text key={v} x={(v / 5) * innerW} y={innerH + 15}
                textAnchor="middle" fill={colors.text} fontSize={10}>{v}V</text>
            ))}
            {[0, 50, 100].map(t => (
              <text key={t} x={-8} y={innerH - (t / 100) * innerH + 4}
                textAnchor="end" fill={colors.text} fontSize={10}>{t}%</text>
            ))}
            <text x={innerW / 2} y={innerH + 30} textAnchor="middle" fill={colors.text} fontSize={11}>
              {isZh ? '施加电压 (V)' : 'Applied Voltage (V)'}
            </text>
            <text transform={`translate(-35, ${innerH / 2}) rotate(-90)`}
              textAnchor="middle" fill={colors.text} fontSize={11}>
              {isZh ? '透射率 (%)' : 'Transmission (%)'}
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className={cn(
        'p-4 rounded-xl border space-y-4',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <h4 className={cn('font-semibold flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          <Calculator className="w-4 h-4" />
          {isZh ? '仿真参数' : 'Simulation Parameters'}
        </h4>

        {/* Voltage slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '施加电压' : 'Applied Voltage'}
            </label>
            <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
              {voltage.toFixed(1)} V
            </span>
          </div>
          <input type="range" min={0} max={5} step={0.1} value={voltage}
            onChange={e => setVoltage(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Cell thickness slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '单元厚度 d' : 'Cell Thickness d'}
            </label>
            <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
              {cellThickness.toFixed(1)} μm
            </span>
          </div>
          <input type="range" min={1} max={15} step={0.5} value={cellThickness}
            onChange={e => setCellThickness(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Birefringence slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '双折射率 Δn' : 'Birefringence Δn'}
            </label>
            <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
              {birefringence.toFixed(3)}
            </span>
          </div>
          <input type="range" min={0.05} max={0.3} step={0.005} value={birefringence}
            onChange={e => setBirefringence(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Wavelength slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '波长 λ' : 'Wavelength λ'}
            </label>
            <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
              {wavelength} nm
            </span>
          </div>
          <input type="range" min={400} max={700} step={10} value={wavelength}
            onChange={e => setWavelength(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      {/* Computed values */}
      <div className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl',
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            Γ ({isZh ? '相位延迟' : 'Retardation'})
          </div>
          <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {simulation.gamma.toFixed(2)} rad
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            u ({isZh ? '莫甘参数' : 'Mauguin'})
          </div>
          <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {simulation.u.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            T ({isZh ? '透射率' : 'Transmission'})
          </div>
          <div className={cn(
            'text-lg font-semibold tabular-nums',
            simulation.transmission > 50
              ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
              : theme === 'dark' ? 'text-red-400' : 'text-red-600'
          )}>
            {simulation.transmission.toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            {isZh ? '有效扭曲' : 'Eff. Twist'}
          </div>
          <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {simulation.effectiveTwist.toFixed(1)}°
          </div>
        </div>
      </div>
    </div>
  )
}

// Literature Workspace - Structured review note editor
// 文献综述工作台 - 结构化综述笔记编辑器
function LiteratureWorkspace({ taskId }: { taskId: string }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const { saveTaskNotes, taskProgress } = useLabStore()
  const existingNotes = taskProgress[taskId]?.notes || ''

  // Parse existing notes into sections or initialize empty
  const defaultSections = {
    abstract: '',
    keyPapers: '',
    methods: '',
    findings: '',
    discussion: '',
    references: '',
  }

  const [sections, setSections] = useState<Record<string, string>>(() => {
    if (existingNotes) {
      try {
        return JSON.parse(existingNotes)
      } catch {
        return { ...defaultSections, abstract: existingNotes }
      }
    }
    return defaultSections
  })

  const [activeSection, setActiveSection] = useState('abstract')
  const [isSaved, setIsSaved] = useState(true)

  const sectionConfig = [
    { id: 'abstract', labelEn: 'Abstract / Overview', labelZh: '摘要 / 概述',
      placeholderEn: 'Write a brief overview of the review topic, scope, and key questions...',
      placeholderZh: '简述综述主题、范围和关键问题...' },
    { id: 'keyPapers', labelEn: 'Key Papers', labelZh: '关键文献',
      placeholderEn: 'List and annotate important papers:\n\n1. Author (Year) - Title\n   Key findings: ...\n   Relevance: ...',
      placeholderZh: '列出并注释重要论文：\n\n1. 作者 (年份) - 标题\n   关键发现：...\n   相关性：...' },
    { id: 'methods', labelEn: 'Methods & Instruments', labelZh: '方法与仪器',
      placeholderEn: 'Summarize the measurement methods, instruments, and techniques discussed...',
      placeholderZh: '总结讨论的测量方法、仪器和技术...' },
    { id: 'findings', labelEn: 'Key Findings', labelZh: '关键发现',
      placeholderEn: 'Synthesize the main findings across papers:\n\n- Finding 1: ...\n- Finding 2: ...',
      placeholderZh: '综合各论文的主要发现：\n\n- 发现1：...\n- 发现2：...' },
    { id: 'discussion', labelEn: 'Discussion & Gaps', labelZh: '讨论与不足',
      placeholderEn: 'Discuss limitations, open questions, and future research directions...',
      placeholderZh: '讨论局限性、开放问题和未来研究方向...' },
    { id: 'references', labelEn: 'References', labelZh: '参考文献',
      placeholderEn: 'Full reference list in citation format...',
      placeholderZh: '完整参考文献列表（引用格式）...' },
  ]

  const handleSectionChange = useCallback((sectionId: string, value: string) => {
    setSections(prev => ({ ...prev, [sectionId]: value }))
    setIsSaved(false)
  }, [])

  const handleSave = useCallback(() => {
    saveTaskNotes(taskId, JSON.stringify(sections))
    setIsSaved(true)
  }, [taskId, sections, saveTaskNotes])

  // Word count across all sections
  const totalWords = Object.values(sections).join(' ').trim().split(/\s+/).filter(Boolean).length
  const currentSectionWords = (sections[activeSection] || '').trim().split(/\s+/).filter(Boolean).length

  const activeSectionConfig = sectionConfig.find(s => s.id === activeSection)!

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className={cn(
        'flex flex-wrap gap-1.5 p-2 rounded-lg',
        theme === 'dark' ? 'bg-slate-800/70' : 'bg-gray-100'
      )}>
        {sectionConfig.map(section => {
          const hasContent = (sections[section.id] || '').trim().length > 0
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5',
                activeSection === section.id
                  ? 'bg-blue-500 text-white'
                  : hasContent
                    ? theme === 'dark'
                      ? 'text-blue-400 hover:bg-slate-700'
                      : 'text-blue-600 hover:bg-gray-200'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-slate-700'
                      : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              {hasContent && <CheckCircle2 className="w-3 h-3" />}
              {isZh ? section.labelZh : section.labelEn}
            </button>
          )
        })}
      </div>

      {/* Active section editor */}
      <div className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className={cn(
          'px-4 py-2 border-b flex items-center justify-between',
          theme === 'dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-gray-50 border-gray-200'
        )}>
          <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-200' : 'text-gray-700')}>
            {isZh ? activeSectionConfig.labelZh : activeSectionConfig.labelEn}
          </span>
          <span className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
            {currentSectionWords} {isZh ? '词' : 'words'}
          </span>
        </div>
        <textarea
          value={sections[activeSection] || ''}
          onChange={e => handleSectionChange(activeSection, e.target.value)}
          placeholder={isZh ? activeSectionConfig.placeholderZh : activeSectionConfig.placeholderEn}
          rows={12}
          className={cn(
            'w-full px-4 py-3 text-sm resize-none focus:outline-none',
            theme === 'dark'
              ? 'bg-slate-900/50 text-gray-200 placeholder-gray-600'
              : 'bg-white text-gray-800 placeholder-gray-400'
          )}
        />
      </div>

      {/* Footer: word count + save */}
      <div className="flex items-center justify-between">
        <div className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {isZh ? `总字数: ${totalWords}` : `Total words: ${totalWords}`}
          {' · '}
          {sectionConfig.filter(s => (sections[s.id] || '').trim().length > 0).length}/{sectionConfig.length}
          {isZh ? ' 已填写' : ' sections filled'}
        </div>
        <button
          onClick={handleSave}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
            isSaved
              ? theme === 'dark'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-green-100 text-green-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          )}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {isZh ? '已保存' : 'Saved'}
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              {isZh ? '保存笔记' : 'Save Notes'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Analysis Workspace - Stress birefringence data analysis
// 分析工作台 - 应力双折射数据分析
function AnalysisWorkspace({ taskId }: { taskId: string }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const { saveTaskNotes, taskProgress } = useLabStore()
  const existingNotes = taskProgress[taskId]?.notes || ''

  // Analysis state
  const [stressForce, setStressForce] = useState(50)       // Applied force (0-100 N)
  const [materialThickness, setMaterialThickness] = useState(5) // mm
  const [stressOpticalCoeff, setStressOpticalCoeff] = useState(2.5) // Brewster (10⁻¹² Pa⁻¹)
  const [observations, setObservations] = useState(existingNotes)
  const [isSaved, setIsSaved] = useState(true)

  // Calculate stress birefringence parameters
  // δ = 2π·C·σ·d / λ  (phase retardation)
  // I = I₀·sin²(δ/2)·sin²(2α)  (for crossed polarizers)
  const analysis = useMemo(() => {
    const lambda = 550 // nm (green light)
    const C = stressOpticalCoeff * 1e-12 // Pa⁻¹
    const area = materialThickness * materialThickness * 1e-6 // m² (simplified)
    const sigma = (stressForce / area) // Pa (stress)
    const d = materialThickness * 1e-3 // m

    // Phase retardation
    const delta = 2 * Math.PI * C * sigma * d / (lambda * 1e-9)
    // Fringe order
    const fringeOrder = delta / (2 * Math.PI)
    // Transmission through crossed polarizers (90° crossed)
    const transmission = Math.sin(delta / 2) ** 2 * Math.sin(2 * Math.PI / 4) ** 2 * 100

    // Generate isochromatic fringe pattern (simplified radial stress)
    const fringePoints: { r: number; intensity: number }[] = []
    for (let r = 0; r <= 100; r += 2) {
      // Stress varies as 1/r from center (simplified)
      const localStress = r < 5 ? sigma : sigma * 5 / Math.max(r, 1)
      const localDelta = 2 * Math.PI * C * localStress * d / (lambda * 1e-9)
      const localI = Math.sin(localDelta / 2) ** 2 * 100
      fringePoints.push({ r, intensity: localI })
    }

    return {
      delta,
      deltaDegs: delta * 180 / Math.PI,
      fringeOrder,
      transmission,
      sigma: sigma / 1e6, // Convert to MPa
      fringePoints,
    }
  }, [stressForce, materialThickness, stressOpticalCoeff])

  // SVG dimensions for fringe pattern
  const patternSize = 200

  const handleSave = useCallback(() => {
    saveTaskNotes(taskId, observations)
    setIsSaved(true)
  }, [taskId, observations, saveTaskNotes])

  return (
    <div className="space-y-5">
      {/* Stress Pattern Visualization */}
      <div className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <svg viewBox={`0 0 ${patternSize * 2} ${patternSize}`} className="w-full" style={{ minHeight: patternSize }}>
          <rect width={patternSize * 2} height={patternSize} fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} />

          {/* Isochromatic fringe pattern (circular) */}
          <g transform={`translate(${patternSize / 2}, ${patternSize / 2})`}>
            {/* Concentric rings showing interference fringes */}
            {Array.from({ length: 20 }).map((_, i) => {
              const r = (i + 1) * (patternSize * 0.4 / 20)
              const localR = ((i + 1) / 20) * 100
              const localStress = localR < 5
                ? analysis.sigma * 1e6
                : analysis.sigma * 1e6 * 5 / Math.max(localR, 1)
              const localDelta = 2 * Math.PI * stressOpticalCoeff * 1e-12 * localStress * materialThickness * 1e-3 / (550e-9)
              const intensity = Math.sin(localDelta / 2) ** 2

              // Map to rainbow colors (photoelastic effect)
              const hue = (intensity * 360 + i * 20) % 360
              return (
                <circle
                  key={i}
                  cx={0} cy={0} r={r}
                  fill="none"
                  stroke={`hsl(${hue}, ${70 + intensity * 30}%, ${30 + intensity * 40}%)`}
                  strokeWidth={patternSize * 0.4 / 20}
                  opacity={0.8}
                />
              )
            })}
            <text y={patternSize * 0.45 + 12} textAnchor="middle" fill="#94a3b8" fontSize={10}>
              {isZh ? '等色线图案' : 'Isochromatic Pattern'}
            </text>
          </g>

          {/* Intensity profile */}
          <g transform={`translate(${patternSize + 20}, 15)`}>
            <text fill="#94a3b8" fontSize={10} fontWeight="600">
              {isZh ? '径向强度分布' : 'Radial Intensity'}
            </text>
            {/* Mini chart */}
            <g transform="translate(0, 20)">
              {/* Axes */}
              <line x1={0} y1={patternSize - 55} x2={patternSize - 50} y2={patternSize - 55}
                stroke={theme === 'dark' ? '#475569' : '#94a3b8'} strokeWidth={1} />
              <line x1={0} y1={0} x2={0} y2={patternSize - 55}
                stroke={theme === 'dark' ? '#475569' : '#94a3b8'} strokeWidth={1} />
              {/* Profile curve */}
              <path
                d={analysis.fringePoints.map((p, i) =>
                  `${i === 0 ? 'M' : 'L'} ${(p.r / 100) * (patternSize - 50)} ${(patternSize - 55) - (p.intensity / 100) * (patternSize - 55)}`
                ).join(' ')}
                fill="none" stroke="#22d3ee" strokeWidth={2} strokeLinecap="round"
              />
              <text x={(patternSize - 50) / 2} y={patternSize - 35} textAnchor="middle" fill="#64748b" fontSize={9}>
                {isZh ? '径向位置' : 'Radial Position'}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className={cn(
        'p-4 rounded-xl border space-y-4',
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <h4 className={cn('font-semibold flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          <TrendingUp className="w-4 h-4" />
          {isZh ? '分析参数' : 'Analysis Parameters'}
        </h4>

        <div>
          <div className="flex justify-between mb-1">
            <label className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '施加力' : 'Applied Force'}
            </label>
            <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
              {stressForce} N
            </span>
          </div>
          <input type="range" min={0} max={200} step={5} value={stressForce}
            onChange={e => setStressForce(parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '材料厚度' : 'Material Thickness'}
            </label>
            <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
              {materialThickness} mm
            </span>
          </div>
          <input type="range" min={1} max={15} step={0.5} value={materialThickness}
            onChange={e => setMaterialThickness(parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? '应力光学系数 C' : 'Stress-Optical Coeff. C'}
            </label>
            <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
              {stressOpticalCoeff.toFixed(1)} B
            </span>
          </div>
          <input type="range" min={0.5} max={5} step={0.1} value={stressOpticalCoeff}
            onChange={e => setStressOpticalCoeff(parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>

      {/* Computed values */}
      <div className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl',
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            σ ({isZh ? '应力' : 'Stress'})
          </div>
          <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {analysis.sigma.toFixed(1)} MPa
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            δ ({isZh ? '相位延迟' : 'Retardation'})
          </div>
          <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {analysis.deltaDegs.toFixed(0)}°
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            N ({isZh ? '条纹级数' : 'Fringe Order'})
          </div>
          <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {analysis.fringeOrder.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            T ({isZh ? '透射率' : 'Transmission'})
          </div>
          <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {analysis.transmission.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Observations notebook */}
      <div className={cn(
        'rounded-xl border overflow-hidden',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className={cn(
          'px-4 py-2 border-b flex items-center justify-between',
          theme === 'dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-gray-50 border-gray-200'
        )}>
          <span className={cn('text-sm font-medium flex items-center gap-2', theme === 'dark' ? 'text-gray-200' : 'text-gray-700')}>
            <BookOpen className="w-4 h-4" />
            {isZh ? '观察记录' : 'Observations'}
          </span>
          <button
            onClick={handleSave}
            className={cn(
              'px-3 py-1 rounded text-xs font-medium transition-colors',
              isSaved
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : 'bg-cyan-500 text-white hover:bg-cyan-600'
            )}
          >
            {isSaved ? (isZh ? '已保存' : 'Saved') : (isZh ? '保存' : 'Save')}
          </button>
        </div>
        <textarea
          value={observations}
          onChange={e => { setObservations(e.target.value); setIsSaved(false) }}
          placeholder={isZh
            ? '记录观察结果：\n\n1. 描述在不同应力下观察到的条纹图案变化...\n2. 记录条纹数量与施加力的关系...\n3. 比较不同材料厚度的效果...'
            : 'Record your observations:\n\n1. Describe fringe pattern changes at different stress levels...\n2. Note the relationship between fringe count and applied force...\n3. Compare effects of different material thicknesses...'}
          rows={6}
          className={cn(
            'w-full px-4 py-3 text-sm resize-none focus:outline-none',
            theme === 'dark'
              ? 'bg-slate-900/50 text-gray-200 placeholder-gray-600'
              : 'bg-white text-gray-800 placeholder-gray-400'
          )}
        />
      </div>
    </div>
  )
}
