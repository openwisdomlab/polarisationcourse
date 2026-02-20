/**
 * Avatar.tsx -- 光子探索者头像
 *
 * 渲染一个小型发光粒子/球体 (photon explorer)，
 * 位置由 MotionValue 驱动 (来自 useClickToMove)。
 * 静止时有柔和呼吸光晕动画。
 *
 * Phase 3: 区域过渡时自动淡出/淡入 (isTransitioning)。
 */

import React from 'react'
import { motion, type MotionValue, useMotionValue, animate } from 'framer-motion'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { useEffect } from 'react'

interface AvatarProps {
  screenX: MotionValue<number>
  screenY: MotionValue<number>
}

/**
 * 头像组件 -- 光子探索者
 *
 * 明亮暖色球体 (#FFD700) + 半透明光晕。
 * 位置由 MotionValue 直接驱动 (无 React 重渲染)。
 * 区域过渡时: 淡出 200ms -> 过渡 -> 淡入 300ms。
 */
const Avatar = React.memo(function Avatar({ screenX, screenY }: AvatarProps) {
  const isTransitioning = useOdysseyWorldStore((s) => s.isTransitioning)
  const avatarOpacity = useMotionValue(1)

  // 过渡时淡出，结束后淡入
  useEffect(() => {
    if (isTransitioning) {
      // 淡出: 200ms
      animate(avatarOpacity, 0, { duration: 0.2 })
    } else {
      // 淡入: 300ms
      animate(avatarOpacity, 1, { duration: 0.3 })
    }
  }, [isTransitioning, avatarOpacity])

  return (
    <motion.g style={{ opacity: avatarOpacity }}>
      {/* 光晕 -- 呼吸动画 */}
      <motion.circle
        cx={screenX}
        cy={screenY}
        r={14}
        fill="#FFD700"
        opacity={0.2}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: 'easeInOut',
        }}
      />

      {/* 外圈光晕 */}
      <motion.circle
        cx={screenX}
        cy={screenY}
        r={10}
        fill="#FFD700"
        opacity={0.35}
      />

      {/* 核心球体 */}
      <motion.circle
        cx={screenX}
        cy={screenY}
        r={6}
        fill="#FFD700"
        stroke="#FFC000"
        strokeWidth={1}
      />

      {/* 内部高光 */}
      <motion.circle
        cx={screenX}
        cy={screenY}
        r={2.5}
        fill="white"
        opacity={0.7}
        style={{ translateX: -1.5, translateY: -1.5 }}
      />
    </motion.g>
  )
})

export { Avatar }
