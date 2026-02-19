/**
 * InquiryControlGate - 渐进控件解锁
 *
 * 包裹demo控件，在引导模式下对未解锁控件应用视觉淡化。
 * 未解锁→opacity-25 pointer-events-none blur-[0.5px]
 */

import { cn } from '@/lib/utils'
import { useInquiry } from './useInquiry'

interface InquiryControlGateProps {
  controlId: string
  children: React.ReactNode
  className?: string
}

export function InquiryControlGate({
  controlId,
  children,
  className,
}: InquiryControlGateProps) {
  const { isControlEnabled, isControlHighlighted, isGuidedMode } = useInquiry()

  // 非引导模式：所有控件可用
  if (!isGuidedMode) {
    return <div className={className}>{children}</div>
  }

  const enabled = isControlEnabled(controlId)
  const highlighted = isControlHighlighted(controlId)

  return (
    <div
      className={cn(
        'transition-all duration-300',
        !enabled && 'opacity-25 pointer-events-none blur-[0.5px]',
        highlighted && 'ring-2 ring-cyan-400/50 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  )
}
