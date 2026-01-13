/**
 * LevelBadge - 难度级别徽章组件
 * Difficulty Level Badge Component
 *
 * 显示课程内容的难度级别（基础/应用/研究）
 * Displays course content difficulty level (Foundation/Application/Research)
 */

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import {
  DifficultyLevel,
  DIFFICULTY_LEVELS,
} from '../meta/course.config'

interface LevelBadgeProps {
  level: DifficultyLevel
  // 尺寸变体
  size?: 'sm' | 'md' | 'lg'
  // 是否显示图标
  showIcon?: boolean
  // 是否显示标签
  showLabel?: boolean
  // 是否可点击
  clickable?: boolean
  // 是否选中状态
  selected?: boolean
  // 点击回调
  onClick?: () => void
}

export function LevelBadge({
  level,
  size = 'md',
  showIcon = true,
  showLabel = true,
  clickable = false,
  selected = false,
  onClick,
}: LevelBadgeProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const config = DIFFICULTY_LEVELS[level]

  // 尺寸样式映射
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  }

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const baseStyles = `
    inline-flex items-center font-medium rounded-full
    transition-all duration-200
    ${sizeStyles[size]}
  `

  const interactiveStyles = clickable
    ? 'cursor-pointer hover:scale-105 active:scale-95'
    : ''

  const selectedStyles = selected
    ? `ring-2 ring-offset-2 ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'}`
    : ''

  const colorStyles = isDark
    ? `bg-opacity-20 text-opacity-90`
    : `bg-opacity-15 text-opacity-100`

  return (
    <span
      className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${colorStyles}`}
      style={{
        backgroundColor: `${config.color}25`,
        color: config.color,
        ...(selected ? { ringColor: config.color } : {}),
      }}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {showIcon && (
        <span className={iconSizes[size]} role="img" aria-label={level}>
          {config.icon}
        </span>
      )}
      {showLabel && (
        <span>{t(config.labelKey)}</span>
      )}
    </span>
  )
}

// 难度选择器组件
interface LevelSelectorProps {
  value: DifficultyLevel
  onChange: (level: DifficultyLevel) => void
  // 可选的级别（默认全部）
  availableLevels?: DifficultyLevel[]
  // 布局方向
  direction?: 'horizontal' | 'vertical'
  // 尺寸
  size?: 'sm' | 'md' | 'lg'
}

export function LevelSelector({
  value,
  onChange,
  availableLevels = ['foundation', 'application', 'research'],
  direction = 'horizontal',
  size = 'md',
}: LevelSelectorProps) {
  return (
    <div
      className={`flex ${
        direction === 'horizontal' ? 'flex-row gap-2' : 'flex-col gap-1.5'
      }`}
    >
      {availableLevels.map((level) => (
        <LevelBadge
          key={level}
          level={level}
          size={size}
          clickable
          selected={value === level}
          onClick={() => onChange(level)}
        />
      ))}
    </div>
  )
}

// 难度信息卡片
interface LevelInfoCardProps {
  level: DifficultyLevel
  compact?: boolean
}

export function LevelInfoCard({ level, compact = false }: LevelInfoCardProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const config = DIFFICULTY_LEVELS[level]

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-lg ${
          isDark ? 'bg-slate-800' : 'bg-gray-100'
        }`}
      >
        <span className="text-xl">{config.icon}</span>
        <div>
          <div className="font-medium" style={{ color: config.color }}>
            {t(config.labelKey)}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {config.targetAudience}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-4 rounded-xl border-2 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}
      style={{ borderColor: `${config.color}40` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{config.icon}</span>
        <div>
          <h3 className="font-bold text-lg" style={{ color: config.color }}>
            {t(config.labelKey)}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {config.targetAudience}
          </p>
        </div>
      </div>
      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {t(config.descriptionKey)}
      </p>
      <div
        className={`mt-3 pt-3 border-t text-xs ${
          isDark ? 'border-slate-700 text-gray-500' : 'border-gray-200 text-gray-500'
        }`}
      >
        {config.learningMode}
      </div>
    </div>
  )
}

export default LevelBadge
