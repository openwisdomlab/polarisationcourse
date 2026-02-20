/**
 * Avatar.tsx -- 光子探索者头像
 *
 * 渲染一个小型发光粒子/球体 (photon explorer)，
 * 位置由 MotionValue 驱动 (来自 useClickToMove)。
 * 静止时有柔和呼吸光晕动画。
 */

import React from 'react'
import { motion, type MotionValue } from 'framer-motion'

interface AvatarProps {
  screenX: MotionValue<number>
  screenY: MotionValue<number>
}

/**
 * 头像组件 -- 光子探索者
 *
 * 明亮暖色球体 (#FFD700) + 半透明光晕。
 * 位置由 MotionValue 直接驱动 (无 React 重渲染)。
 */
const Avatar = React.memo(function Avatar({ screenX, screenY }: AvatarProps) {
  return (
    <g>
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
    </g>
  )
})

export { Avatar }
