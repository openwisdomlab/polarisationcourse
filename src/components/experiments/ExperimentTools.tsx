/**
 * Experiment Tools - Digital companion tools for physical experiments
 * 实验工具 - 物理实验的数字伴侣工具
 *
 * 该组件充当路由器/包装器，根据实验 ID 显示相应的交互工具。
 * 它通过提供数字工具帮助用户进行物理实验，
 * 从而实现“物理+数字”（phygital）体验。
 * This component acts as a router/wrapper that displays the appropriate
 * interactive tool based on the experiment ID. It enables the "phygital"
 * (physical + digital) experience by providing digital tools to assist
 * users in performing physical experiments.
 */

import { useState } from 'react'   // React hook 用于状态管理
import { useTranslation } from 'react-i18next'   // 国际化翻译钩子
import { useTheme } from '@/contexts/ThemeContext'   // 主题上下文钩子
import { cn } from '@/lib/utils'   // 类名合并工具函数
import { Wrench, Smartphone, Palette, FlaskConical } from 'lucide-react'   // 图标组件
import { PolarizerSource } from './PolarizerSource'   // 偏振片光源组件
import { MichelLevyChart } from './MichelLevyChart'   // 米歇尔-列维色图组件

// Props for ExperimentTools component 实验工具组件的属性

interface ExperimentToolsProps {
  experimentId: string
  className?: string
}

// Map of experiment IDs to their available tools
const EXPERIMENT_TOOLS: Record<string, {
  toolId: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  icon: typeof Wrench
}[]> = {
  'phone-polarizer': [
    {
      toolId: 'polarizer-source',
      nameEn: 'Rotatable Light Source',
      nameZh: '可旋转光源',
      descriptionEn: 'A digital polarized light source you can rotate to test your polarizer',
      descriptionZh: '可旋转的数字偏振光源，用于测试你的偏振片',
      icon: Smartphone,
    },
  ],
  'tape-art': [
    {
      toolId: 'polarizer-source',
      nameEn: 'Backlight Source',
      nameZh: '背光光源',
      descriptionEn: 'Use your phone as a polarized backlight for tape art',
      descriptionZh: '将手机用作胶带艺术的偏振背光',
      icon: Smartphone,
    },
  ],
  'plastic-stress': [
    {
      toolId: 'polarizer-source',
      nameEn: 'Polarized Backlight',
      nameZh: '偏振背光',
      descriptionEn: 'A bright polarized light source for viewing stress patterns',
      descriptionZh: '用于观察应力图案的明亮偏振光源',
      icon: Smartphone,
    },
    {
      toolId: 'michel-levy',
      nameEn: 'Michel-Lévy Chart',
      nameZh: '米歇尔-列维色图',
      descriptionEn: 'Interactive reference chart for identifying stress colors',
      descriptionZh: '用于识别应力颜色的交互式参考图表',
      icon: Palette,
    },
  ],
  'sugar-rotation': [
    {
      toolId: 'polarizer-source',
      nameEn: 'Polarized Light Source',
      nameZh: '偏振光源',
      descriptionEn: 'A rotatable polarized light for optical rotation experiments',
      descriptionZh: '用于旋光实验的可旋转偏振光源',
      icon: Smartphone,
    },
  ],
  'sky-polarization': [
    {
      toolId: 'polarizer-source',
      nameEn: 'Reference Polarizer',
      nameZh: '参考偏振片',
      descriptionEn: 'Compare sky polarization with a known reference angle',
      descriptionZh: '将天空偏振与已知参考角度进行比较',
      icon: Smartphone,
    },
  ],
  'reflection-angle': [
    {
      toolId: 'polarizer-source',
      nameEn: 'Angle Reference',
      nameZh: '角度参考',
      descriptionEn: 'Set and track polarization angles for Brewster angle experiments',
      descriptionZh: '为布儒斯特角实验设置和跟踪偏振角度',
      icon: Smartphone,
    },
  ],
}

// Tool component renderer 工具组件渲染器
function ToolComponent({ toolId }: { toolId: string }) {
  switch (toolId) {
    case 'polarizer-source':
      return <PolarizerSource />
    case 'michel-levy':
      return <MichelLevyChart />
    default:
      return null
  }
}

export function ExperimentTools({ experimentId, className }: ExperimentToolsProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const tools = EXPERIMENT_TOOLS[experimentId] || []

  // If no tools available for this experiment
  if (tools.length === 0) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}>
        <FlaskConical className={cn(
          'w-12 h-12 mb-4',
          theme === 'dark' ? 'text-slate-600' : 'text-gray-300'
        )} />
        <p className={cn(
          'text-sm',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        )}>
          {isZh
            ? '此实验暂无数字工具。按照实验步骤使用物理材料进行实验。'
            : 'No digital tools available for this experiment. Follow the steps using physical materials.'}
        </p>
      </div>
    )
  }

  // If single tool, show it directly
  if (tools.length === 1) {
    const tool = tools[0]
    return (
      <div className={cn('space-y-4', className)}>
        {/* Tool header */}
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-lg',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
        )}>
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            theme === 'dark' ? 'bg-teal-500/20' : 'bg-teal-100'
          )}>
            <tool.icon className={cn(
              'w-5 h-5',
              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
            )} />
          </div>
          <div>
            <h4 className={cn(
              'font-medium',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? tool.nameZh : tool.nameEn}
            </h4>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? tool.descriptionZh : tool.descriptionEn}
            </p>
          </div>
        </div>

        {/* Tool component */}
        <ToolComponent toolId={tool.toolId} />
      </div>
    )
  }

  // Multiple tools - show in tabs
  return (
    <MultiToolView tools={tools} className={className} />
  )
}

// Multi-tool view with tabs
function MultiToolView({
  tools,
  className
}: {
  tools: typeof EXPERIMENT_TOOLS[string]
  className?: string
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [activeToolIndex, setActiveToolIndex] = useState(0)
  const activeTool = tools[activeToolIndex]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tool tabs */}
      <div className={cn(
        'flex gap-1 p-1 rounded-lg',
        theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
      )}>
        {tools.map((tool, index) => (
          <button
            key={tool.toolId}
            onClick={() => setActiveToolIndex(index)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeToolIndex === index
                ? theme === 'dark'
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <tool.icon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isZh ? tool.nameZh : tool.nameEn}
            </span>
          </button>
        ))}
      </div>

      {/* Tool description */}
      <p className={cn(
        'text-xs px-1',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? activeTool.descriptionZh : activeTool.descriptionEn}
      </p>

      {/* Active tool component */}
      <ToolComponent toolId={activeTool.toolId} />
    </div>
  )
}

// Export the tool mapping for external use
export { EXPERIMENT_TOOLS }
