/**
 * QualitativeLayer.tsx -- 定性内容层
 *
 * 渲染 SVG 图解 + 物理解释文本。
 * 每个概念对应一个内联 SVG 图解，匹配世界的深色等距美学。
 * 图解带有 Framer Motion 微动画 (透明度淡入、柔和旋转)。
 *
 * 图解宽度: ~300-500px，适配面板内容区域。
 * 文本样式: prose-like 布局，text-white/80，leading-relaxed。
 */

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import type { ConceptDefinition } from '@/components/odyssey-world/concepts/conceptRegistry'

interface QualitativeLayerProps {
  concept: ConceptDefinition
}

// ── SVG 图解组件 ────────────────────────────────────────────────────────

/**
 * 马吕斯定律图解
 *
 * 偏振片 + 传输轴 + 入射波箭头 + 随角度变化的透射强度。
 * 动画: 偏振片旋转暗示、强度渐变。
 */
function MalusLawDiagram() {
  return (
    <svg viewBox="0 0 440 200" className="mx-auto w-full max-w-[440px]">
      {/* 背景 */}
      <rect width="440" height="200" rx="8" fill="rgba(255,255,255,0.03)" />

      {/* 入射光束 (从左侧) */}
      <motion.line
        x1="30" y1="100" x2="150" y2="100"
        stroke="#FFD700" strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {/* 入射光波振动方向 (竖直箭头) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <line x1="70" y1="78" x2="70" y2="122" stroke="#FFD700" strokeWidth="1.2" opacity="0.6" />
        <polygon points="70,76 67,82 73,82" fill="#FFD700" opacity="0.6" />
        <polygon points="70,124 67,118 73,118" fill="#FFD700" opacity="0.6" />
        <line x1="110" y1="78" x2="110" y2="122" stroke="#FFD700" strokeWidth="1.2" opacity="0.6" />
        <polygon points="110,76 107,82 113,82" fill="#FFD700" opacity="0.6" />
        <polygon points="110,124 107,118 113,118" fill="#FFD700" opacity="0.6" />
      </motion.g>

      {/* 偏振片 (第一个 - 水平传输轴) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <rect x="152" y="60" width="10" height="80" rx="2" fill="#8898B0" opacity="0.7" />
        <line x1="148" y1="100" x2="172" y2="100" stroke="#6CB4FF" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="157" y="52" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">P</text>
      </motion.g>

      {/* 偏振片 (第二个 - 角度 theta 的传输轴) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <rect x="262" y="60" width="10" height="80" rx="2" fill="#8898B0" opacity="0.7" />
        {/* 倾斜的传输轴 (表示角度 theta) */}
        <line x1="252" y1="110" x2="282" y2="90" stroke="#6CB4FF" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="267" y="52" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">A</text>
      </motion.g>

      {/* 角度标记 theta */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <path d="M 275,100 A 12,12 0 0,0 272,90" fill="none" stroke="#6CB4FF" strokeWidth="1" opacity="0.7" />
        <text x="290" y="92" fill="#6CB4FF" fontSize="11" fontStyle="italic" opacity="0.9">{'\u03B8'}</text>
      </motion.g>

      {/* 透射光束 (强度较低) */}
      <motion.line
        x1="275" y1="100" x2="410" y2="100"
        stroke="#FFD700" strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />

      {/* 强度渐变示意 -- 下方条形 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <text x="220" y="175" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">
          I = I{'\u2080'} cos{'\u00B2'}{'\u03B8'}
        </text>
        {/* 强度条: 从满到零 */}
        <rect x="120" y="160" width="200" height="4" rx="2" fill="rgba(255,255,255,0.05)" />
        <motion.rect
          x="120" y="160" width="200" height="4" rx="2"
          fill="url(#malusGradient)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 1.0 }}
          style={{ transformOrigin: '120px 162px' }}
        />
      </motion.g>

      <defs>
        <linearGradient id="malusGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFD700" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/**
 * 圆偏振图解
 *
 * 线偏振 -> 四分之一波片 -> 圆偏振路径。
 * 使用 HSL 编码颜色与光束可视化一致。
 */
function CircularPolarizationDiagram() {
  return (
    <svg viewBox="0 0 440 200" className="mx-auto w-full max-w-[440px]">
      <rect width="440" height="200" rx="8" fill="rgba(255,255,255,0.03)" />

      {/* 线偏振入射光 */}
      <motion.line
        x1="30" y1="100" x2="130" y2="100"
        stroke="#FFD700" strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* 线偏振振动方向 (45 度) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <line x1="70" y1="82" x2="90" y2="118" stroke="#FFD700" strokeWidth="1.2" opacity="0.5" />
        <line x1="90" y1="82" x2="70" y2="118" stroke="#FFD700" strokeWidth="1.2" opacity="0.5" />
      </motion.g>

      {/* 四分之一波片 (QWP) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <rect x="135" y="60" width="14" height="80" rx="2" fill="#9878B0" opacity="0.6" />
        {/* 快轴标记 */}
        <line x1="132" y1="70" x2="152" y2="70" stroke="#B88FD0" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
        <text x="142" y="52" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">QWP</text>
        {/* 相位延迟标注 */}
        <text x="142" y="155" textAnchor="middle" fill="rgba(184,143,208,0.7)" fontSize="8">
          {'\u0394\u03C6'} = {'\u03C0'}/2
        </text>
      </motion.g>

      {/* 圆偏振输出 -- 螺旋路径 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* 传播方向箭头 */}
        <line x1="170" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4,4" />

        {/* 圆偏振螺旋 (简化为连续旋转箭头) */}
        {Array.from({ length: 8 }, (_, i) => {
          const cx = 200 + i * 28
          const angle = i * 45
          const rad = (angle * Math.PI) / 180
          const r = 18
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
            >
              <line
                x1={cx}
                y1={100}
                x2={cx + Math.cos(rad) * r}
                y2={100 + Math.sin(rad) * r}
                stroke={`hsl(${angle * 2}, 70%, 65%)`}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx={cx + Math.cos(rad) * r}
                cy={100 + Math.sin(rad) * r}
                r="2"
                fill={`hsl(${angle * 2}, 70%, 65%)`}
              />
            </motion.g>
          )
        })}
      </motion.g>

      {/* 标签 */}
      <motion.text
        x="80" y="38"
        textAnchor="middle" fill="rgba(255,215,0,0.5)" fontSize="9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Linear
      </motion.text>
      <motion.text
        x="320" y="38"
        textAnchor="middle" fill="rgba(108,180,255,0.5)" fontSize="9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Circular
      </motion.text>
    </svg>
  )
}

/**
 * 布儒斯特角图解
 *
 * 反射和折射光束在界面处，标注布儒斯特角。
 * 动画: 反射光束渐显。
 */
function BrewsterAngleDiagram() {
  // 布儒斯特角约 56.7 度 (玻璃 n=1.52)
  const brewsterDeg = 56.7
  const brewsterRad = (brewsterDeg * Math.PI) / 180
  const refractedDeg = 90 - brewsterDeg // 33.3 度
  const refractedRad = (refractedDeg * Math.PI) / 180

  const interfaceY = 110
  const originX = 220

  // 入射光束终点
  const incidentLen = 90
  const incFromX = originX - Math.sin(brewsterRad) * incidentLen
  const incFromY = interfaceY - Math.cos(brewsterRad) * incidentLen

  // 反射光束终点
  const reflLen = 70
  const reflToX = originX + Math.sin(brewsterRad) * reflLen
  const reflToY = interfaceY - Math.cos(brewsterRad) * reflLen

  // 折射光束终点
  const refrLen = 70
  const refrToX = originX + Math.sin(refractedRad) * refrLen
  const refrToY = interfaceY + Math.cos(refractedRad) * refrLen

  return (
    <svg viewBox="0 0 440 220" className="mx-auto w-full max-w-[440px]">
      <rect width="440" height="220" rx="8" fill="rgba(255,255,255,0.03)" />

      {/* 界面 */}
      <line x1="60" y1={interfaceY} x2="380" y2={interfaceY} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* 介质标签 */}
      <text x="370" y={interfaceY - 8} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="end">n{'\u2081'} (air)</text>
      <text x="370" y={interfaceY + 16} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="end">n{'\u2082'} (glass)</text>

      {/* 法线 (虚线) */}
      <line x1={originX} y1="30" x2={originX} y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4,4" />

      {/* 入射光束 */}
      <motion.line
        x1={incFromX} y1={incFromY} x2={originX} y2={interfaceY}
        stroke="#FFD700" strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* 反射光束 (s-偏振, 在布儒斯特角时只有 s 分量) */}
      <motion.line
        x1={originX} y1={interfaceY} x2={reflToX} y2={reflToY}
        stroke="#6CB4FF" strokeWidth="2" opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <motion.text
        x={reflToX + 8} y={reflToY - 4}
        fill="#6CB4FF" fontSize="8" opacity="0.7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.8 }}
      >
        s-pol only
      </motion.text>

      {/* 折射光束 */}
      <motion.line
        x1={originX} y1={interfaceY} x2={refrToX} y2={refrToY}
        stroke="#FFD700" strokeWidth="2" opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />

      {/* 角度标注: 入射角 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <path
          d={`M ${originX},${interfaceY - 30} A 30,30 0 0,0 ${originX - Math.sin(brewsterRad) * 30},${interfaceY - Math.cos(brewsterRad) * 30}`}
          fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5"
        />
        <text x={originX - 42} y={interfaceY - 30} fill="#FFD700" fontSize="10" opacity="0.7" fontStyle="italic">
          {'\u03B8'}{'\u0042'}
        </text>
      </motion.g>

      {/* 90 度标记 (反射和折射之间) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <rect x={originX + 3} y={interfaceY - 10} width="7" height="7" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        <text x={originX + 42} y={interfaceY - 2} fill="rgba(255,255,255,0.4)" fontSize="8">90{'\u00B0'}</text>
      </motion.g>

      {/* 公式标注 */}
      <motion.text
        x="220" y="205"
        textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        {'\u03B8'}{'\u0042'} = arctan(n{'\u2082'}/n{'\u2081'}) {'\u2248'} 56.7{'\u00B0'}
      </motion.text>
    </svg>
  )
}

/**
 * 交叉偏振消光图解
 *
 * 两个正交偏振片，光束完全消失。
 */
function CrossedPolarizersDiagram() {
  return (
    <svg viewBox="0 0 440 180" className="mx-auto w-full max-w-[440px]">
      <rect width="440" height="180" rx="8" fill="rgba(255,255,255,0.03)" />

      {/* 入射光束 */}
      <motion.line
        x1="30" y1="90" x2="140" y2="90"
        stroke="#FFD700" strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* 偏振片 1 (竖直传输轴) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <rect x="145" y="50" width="10" height="80" rx="2" fill="#8898B0" opacity="0.7" />
        <line x1="140" y1="50" x2="140" y2="130" stroke="#6CB4FF" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.5" />
        <text x="150" y="42" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">P{'\u2081'}</text>
      </motion.g>

      {/* 线偏振中间段 (竖直振动) */}
      <motion.line
        x1="160" y1="90" x2="260" y2="90"
        stroke="#FFD700" strokeWidth="2" opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.6 }}
      >
        <line x1="200" y1="70" x2="200" y2="110" stroke="#FFD700" strokeWidth="1" />
        <line x1="230" y1="70" x2="230" y2="110" stroke="#FFD700" strokeWidth="1" />
      </motion.g>

      {/* 偏振片 2 (水平传输轴 -- 正交) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <rect x="265" y="50" width="10" height="80" rx="2" fill="#8898B0" opacity="0.7" />
        <line x1="260" y1="90" x2="280" y2="90" stroke="#FF6B6B" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.5" />
        <text x="270" y="42" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">P{'\u2082'}</text>
      </motion.g>

      {/* 消光 -- 无输出光 (虚线表示) */}
      <motion.line
        x1="280" y1="90" x2="400" y2="90"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="6,8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />

      {/* 消光标记 */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}
      >
        <circle cx="340" cy="90" r="16" fill="none" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.5" />
        <line x1="330" y1="80" x2="350" y2="100" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.5" />
      </motion.g>

      {/* 角度标注 */}
      <motion.text
        x="220" y="160"
        textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        {'\u03B8'} = 90{'\u00B0'} {'\u2192'} I = 0
      </motion.text>
    </svg>
  )
}

/**
 * 三偏振片惊喜图解
 *
 * 交叉偏振片之间插入 45 度偏振片，光重新出现。
 */
function ThreePolarizerDiagram() {
  return (
    <svg viewBox="0 0 440 180" className="mx-auto w-full max-w-[440px]">
      <rect width="440" height="180" rx="8" fill="rgba(255,255,255,0.03)" />

      {/* 入射光束 */}
      <motion.line
        x1="20" y1="90" x2="95" y2="90"
        stroke="#FFD700" strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* 偏振片 1 (0 度) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x="100" y="55" width="8" height="70" rx="2" fill="#8898B0" opacity="0.7" />
        <line x1="96" y1="55" x2="96" y2="125" stroke="#6CB4FF" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
        <text x="104" y="48" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">0{'\u00B0'}</text>
      </motion.g>

      {/* 中间光束 (偏振后) */}
      <motion.line
        x1="112" y1="90" x2="190" y2="90"
        stroke="#FFD700" strokeWidth="2" opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />

      {/* 偏振片 2 (45 度 - 中间插入的) */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
      >
        <rect x="195" y="55" width="8" height="70" rx="2" fill="#50C878" opacity="0.7" />
        <line x1="186" y1="110" x2="212" y2="70" stroke="#50C878" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
        <text x="199" y="48" textAnchor="middle" fill="rgba(80,200,120,0.6)" fontSize="8">45{'\u00B0'}</text>
      </motion.g>

      {/* 中间光束 (旋转偏振后, 强度降低) */}
      <motion.line
        x1="207" y1="90" x2="285" y2="90"
        stroke="#FFD700" strokeWidth="1.5" opacity="0.45"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      />

      {/* 偏振片 3 (90 度) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x="290" y="55" width="8" height="70" rx="2" fill="#8898B0" opacity="0.7" />
        <line x1="286" y1="90" x2="302" y2="90" stroke="#FF6B6B" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
        <text x="294" y="48" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">90{'\u00B0'}</text>
      </motion.g>

      {/* 输出光束 (I/8 强度) */}
      <motion.line
        x1="302" y1="90" x2="420" y2="90"
        stroke="#FFD700" strokeWidth="1" opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      />

      {/* 惊叹号标记 -- 光重新出现 */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
      >
        <text x="370" y="75" textAnchor="middle" fill="#50C878" fontSize="14" opacity="0.6">!</text>
      </motion.g>

      {/* 底部标注 */}
      <motion.text
        x="220" y="155"
        textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        I{'\u2092\u1D64\u2080'} = I{'\u2080'}/8 (at 45{'\u00B0'})
      </motion.text>
    </svg>
  )
}

/**
 * 斯涅尔定律偏振效应图解
 *
 * 入射、反射、折射光束在界面处，s/p 分量标注。
 */
function SnellPolarizationDiagram() {
  return (
    <svg viewBox="0 0 440 200" className="mx-auto w-full max-w-[440px]">
      <rect width="440" height="200" rx="8" fill="rgba(255,255,255,0.03)" />

      {/* 界面 */}
      <line x1="60" y1="110" x2="380" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* 介质区域 */}
      <rect x="60" y="110" width="320" height="85" fill="rgba(100,180,255,0.05)" />
      <text x="370" y="102" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">n{'\u2081'}</text>
      <text x="370" y="125" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">n{'\u2082'} &gt; n{'\u2081'}</text>

      {/* 法线 */}
      <line x1="220" y1="25" x2="220" y2="190" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4,4" />

      {/* 入射光束 (混合偏振) */}
      <motion.line
        x1="130" y1="30" x2="220" y2="110"
        stroke="#FFD700" strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* s 和 p 偏振标注 (入射光) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <circle cx="165" cy="60" r="4" fill="none" stroke="#6CB4FF" strokeWidth="1.5" opacity="0.6" />
        <text x="173" y="55" fill="#6CB4FF" fontSize="8" opacity="0.6">s</text>
        <line x1="155" y1="68" x2="175" y2="52" stroke="#FF9F43" strokeWidth="1.5" opacity="0.6" />
        <text x="180" y="68" fill="#FF9F43" fontSize="8" opacity="0.6">p</text>
      </motion.g>

      {/* 反射光束 */}
      <motion.line
        x1="220" y1="110" x2="310" y2="30"
        stroke="#6CB4FF" strokeWidth="2" opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      <motion.text
        x="310" y="24" fill="#6CB4FF" fontSize="8" opacity="0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
      >
        mostly s-pol
      </motion.text>

      {/* 折射光束 */}
      <motion.line
        x1="220" y1="110" x2="280" y2="185"
        stroke="#FF9F43" strokeWidth="2" opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      <motion.text
        x="290" y="178" fill="#FF9F43" fontSize="8" opacity="0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
      >
        mostly p-pol
      </motion.text>
    </svg>
  )
}

/**
 * 全内反射图解
 *
 * 超过临界角时光完全反射。
 */
function TotalReflectionDiagram() {
  const interfaceY = 100
  const originX = 220

  return (
    <svg viewBox="0 0 440 200" className="mx-auto w-full max-w-[440px]">
      <rect width="440" height="200" rx="8" fill="rgba(255,255,255,0.03)" />

      {/* 致密介质区域 (下方) */}
      <rect x="60" y="0" width="320" height={interfaceY} fill="rgba(100,180,255,0.06)" />
      <text x="370" y="15" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">n{'\u2081'} (glass)</text>
      <text x="370" y={interfaceY + 16} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">n{'\u2082'} (air)</text>

      {/* 界面 */}
      <line x1="60" y1={interfaceY} x2="380" y2={interfaceY} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* 法线 */}
      <line x1={originX} y1="10" x2={originX} y2="190" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4,4" />

      {/* 入射光束 (从致密介质向外) -- 超过临界角 */}
      <motion.line
        x1="130" y1="30" x2={originX} y2={interfaceY}
        stroke="#FFD700" strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* 全反射光束 */}
      <motion.line
        x1={originX} y1={interfaceY} x2="310" y2="30"
        stroke="#FFD700" strokeWidth="2.5" opacity="0.9"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />

      {/* R = 1 标注 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <text x="330" y="35" fill="#FFD700" fontSize="10" opacity="0.7">R = 1</text>
      </motion.g>

      {/* 消逝波 (evanescent wave) 在界面下方衰减 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.0 }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1={originX - 30 + i * 15}
            y1={interfaceY + 5}
            x2={originX - 30 + i * 15}
            y2={interfaceY + 20 + i * 3}
            stroke="#FFD700"
            strokeWidth="1"
            opacity={0.3 - i * 0.05}
            strokeDasharray="2,3"
          />
        ))}
        <text x={originX} y={interfaceY + 45} textAnchor="middle" fill="rgba(255,215,0,0.3)" fontSize="8">
          evanescent wave
        </text>
      </motion.g>

      {/* 临界角标注 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <path
          d={`M ${originX},${interfaceY - 25} A 25,25 0 0,0 ${originX - 22},${interfaceY - 12}`}
          fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5"
        />
        <text x={originX - 45} y={interfaceY - 18} fill="#FFD700" fontSize="9" opacity="0.6" fontStyle="italic">
          {'\u03B8'} &gt; {'\u03B8'}{'\u1D04'}
        </text>
      </motion.g>

      {/* 公式 */}
      <motion.text
        x="220" y="185"
        textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        {'\u03B8'}{'\u1D04'} = arcsin(n{'\u2082'}/n{'\u2081'})
      </motion.text>
    </svg>
  )
}

// ── 图解映射 ────────────────────────────────────────────────────────────

/** 根据 diagramComponent ID 返回对应的 SVG 图解组件 */
function ConceptDiagram({ diagramComponent }: { diagramComponent: string }) {
  switch (diagramComponent) {
    case 'malus-law-diagram':
      return <MalusLawDiagram />
    case 'crossed-polarizers-diagram':
      return <CrossedPolarizersDiagram />
    case 'circular-polarization-diagram':
      return <CircularPolarizationDiagram />
    case 'three-polarizer-diagram':
      return <ThreePolarizerDiagram />
    case 'brewster-angle-diagram':
      return <BrewsterAngleDiagram />
    case 'snell-polarization-diagram':
      return <SnellPolarizationDiagram />
    case 'total-reflection-diagram':
      return <TotalReflectionDiagram />
    default:
      return null
  }
}

// ── 主组件 ──────────────────────────────────────────────────────────────

/**
 * QualitativeLayer -- 定性内容层
 *
 * 渲染 SVG 图解 (带微动画) + 物理解释文本。
 * 如果概念有 demoComponentId，底部显示 "亲自试试" 链接。
 */
export function QualitativeLayer({ concept }: QualitativeLayerProps) {
  const { t } = useTranslation()
  const setTab = useOdysseyWorldStore((s) => s.setDepthPanelTab)

  return (
    <div className="space-y-5">
      {/* SVG 图解 */}
      <div className="overflow-hidden rounded-lg">
        <ConceptDiagram diagramComponent={concept.qualitative.diagramComponent} />
      </div>

      {/* 物理解释文本 -- prose-like 布局 */}
      <div className="space-y-3">
        {t(concept.qualitative.contentKey)
          .split('\n\n')
          .map((paragraph, idx) => (
            <p key={idx} className="text-sm leading-relaxed text-white/75">
              {paragraph}
            </p>
          ))}
      </div>

      {/* "亲自试试" 链接 (仅当概念有 demo 时显示) */}
      {concept.demoComponentId && (
        <button
          className="mt-2 text-xs text-blue-400/60 transition-colors hover:text-blue-400/90"
          onClick={() => setTab('demo')}
        >
          {t('odyssey.concepts.depthPanel.tryItYourself')} {'\u2192'}
        </button>
      )}
    </div>
  )
}
