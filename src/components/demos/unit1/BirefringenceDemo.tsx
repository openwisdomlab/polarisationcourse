/**
 * 双折射效应演示 - Unit 1
 * 演示方解石晶体将一束光分裂为o光和e光
 * 重构版本：使用清晰的2D Canvas + SVG + Framer Motion
 */
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  SliderControl,
  ControlPanel,
  ValueDisplay,
  InfoCard,
} from '../DemoControls'

// 双折射动画Canvas
function BirefringenceCanvas({
  inputPolarization,
  crystalRotation,
  animate,
}: {
  inputPolarization: number
  crystalRotation: number
  animate: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 700
    const height = 350
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 计算o光和e光强度
    const radians = (inputPolarization * Math.PI) / 180
    const oIntensity = Math.pow(Math.cos(radians), 2)
    const eIntensity = Math.pow(Math.sin(radians), 2)

    // 光线位置参数
    const sourceX = 50
    const crystalStart = 200
    const crystalEnd = 350
    const screenX = 650
    const centerY = height / 2
    const separation = 60 // 双像分离距离

    const draw = () => {
      // 清除画布
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, width, height)

      const t = timeRef.current * 0.03

      // 绘制光源
      const gradient = ctx.createRadialGradient(sourceX, centerY, 0, sourceX, centerY, 25)
      gradient.addColorStop(0, 'rgba(251, 191, 36, 1)')
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.arc(sourceX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(sourceX, centerY, 12, 0, Math.PI * 2)
      ctx.fill()

      // 绘制入射光束（动画箭头）
      drawAnimatedBeam(ctx, sourceX + 20, centerY, crystalStart - 10, centerY, '#ffaa00', 1, t)

      // 绘制方解石晶体
      drawCrystal(ctx, crystalStart, centerY - 80, crystalEnd - crystalStart, 160, crystalRotation)

      // 晶体内部的双折射分离
      const splitEndX = crystalEnd - 20

      // o光路径（通过晶体，折射率no）
      ctx.beginPath()
      ctx.strokeStyle = `rgba(255, 68, 68, ${0.3 + oIntensity * 0.7})`
      ctx.lineWidth = 2 + oIntensity * 2
      ctx.setLineDash([])
      ctx.moveTo(crystalStart, centerY)
      ctx.lineTo(splitEndX, centerY - separation / 2)
      ctx.stroke()

      // e光路径（通过晶体，折射率ne）
      ctx.beginPath()
      ctx.strokeStyle = `rgba(68, 255, 68, ${0.3 + eIntensity * 0.7})`
      ctx.lineWidth = 2 + eIntensity * 2
      ctx.moveTo(crystalStart, centerY)
      ctx.lineTo(splitEndX, centerY + separation / 2)
      ctx.stroke()

      // 出射o光束（红色）
      if (oIntensity > 0.05) {
        drawAnimatedBeam(
          ctx,
          crystalEnd + 10,
          centerY - separation / 2,
          screenX - 20,
          centerY - separation / 2,
          '#ff4444',
          oIntensity,
          t
        )
      }

      // 出射e光束（绿色）
      if (eIntensity > 0.05) {
        drawAnimatedBeam(
          ctx,
          crystalEnd + 10,
          centerY + separation / 2,
          screenX - 20,
          centerY + separation / 2,
          '#44ff44',
          eIntensity,
          t
        )
      }

      // 绘制屏幕
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(screenX - 5, centerY - 100, 20, 200)

      // 屏幕上的像点
      // o光像点
      const oRadius = 8 + oIntensity * 10
      const oGradient = ctx.createRadialGradient(
        screenX,
        centerY - separation / 2,
        0,
        screenX,
        centerY - separation / 2,
        oRadius * 1.5
      )
      oGradient.addColorStop(0, `rgba(255, 68, 68, ${0.5 + oIntensity * 0.5})`)
      oGradient.addColorStop(1, 'rgba(255, 68, 68, 0)')
      ctx.beginPath()
      ctx.fillStyle = oGradient
      ctx.arc(screenX, centerY - separation / 2, oRadius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = '#ff4444'
      ctx.arc(screenX, centerY - separation / 2, oRadius, 0, Math.PI * 2)
      ctx.fill()

      // e光像点
      const eRadius = 8 + eIntensity * 10
      const eGradient = ctx.createRadialGradient(
        screenX,
        centerY + separation / 2,
        0,
        screenX,
        centerY + separation / 2,
        eRadius * 1.5
      )
      eGradient.addColorStop(0, `rgba(68, 255, 68, ${0.5 + eIntensity * 0.5})`)
      eGradient.addColorStop(1, 'rgba(68, 255, 68, 0)')
      ctx.beginPath()
      ctx.fillStyle = eGradient
      ctx.arc(screenX, centerY + separation / 2, eRadius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = '#44ff44'
      ctx.arc(screenX, centerY + separation / 2, eRadius, 0, Math.PI * 2)
      ctx.fill()

      // 标签
      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.textAlign = 'center'
      ctx.fillText('偏振光源', sourceX, centerY + 50)
      ctx.fillText('方解石晶体', (crystalStart + crystalEnd) / 2, centerY + 110)
      ctx.fillText('屏幕', screenX, centerY + 120)

      // o光和e光标签
      ctx.fillStyle = '#ff4444'
      ctx.fillText('o光 (0°)', screenX + 40, centerY - separation / 2 + 5)
      ctx.fillStyle = '#44ff44'
      ctx.fillText('e光 (90°)', screenX + 40, centerY + separation / 2 + 5)

      // 入射光偏振方向标注
      ctx.save()
      ctx.translate(120, centerY)
      ctx.rotate((inputPolarization * Math.PI) / 180)
      ctx.strokeStyle = '#ffaa00'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-15, 0)
      ctx.lineTo(15, 0)
      ctx.stroke()
      // 箭头
      ctx.beginPath()
      ctx.moveTo(15, 0)
      ctx.lineTo(10, -5)
      ctx.lineTo(10, 5)
      ctx.closePath()
      ctx.fillStyle = '#ffaa00'
      ctx.fill()
      ctx.restore()

      ctx.fillStyle = '#ffaa00'
      ctx.font = '11px sans-serif'
      ctx.fillText(`偏振: ${inputPolarization}°`, 120, centerY + 35)

      if (animate) {
        timeRef.current += 1
      }
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [inputPolarization, crystalRotation, animate])

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg border border-cyan-400/20 w-full"
      style={{ maxWidth: 700, height: 350 }}
    />
  )
}

// 绘制动画光束
function drawAnimatedBeam(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  intensity: number,
  time: number
) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  const particleSpacing = 30
  const numParticles = Math.floor(length / particleSpacing)

  // 主光束线
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.3 + intensity * 0.4
  ctx.lineWidth = 2 + intensity * 2
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.globalAlpha = 1

  // 动画粒子
  for (let i = 0; i < numParticles; i++) {
    const progress = ((i * particleSpacing + time * 3) % length) / length
    const px = x1 + (x2 - x1) * progress
    const py = y1 + (y2 - y1) * progress

    ctx.beginPath()
    ctx.fillStyle = color
    ctx.globalAlpha = 0.6 + intensity * 0.4
    ctx.arc(px, py, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

// 绘制方解石晶体
function drawCrystal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
) {
  ctx.save()

  // 晶体外形
  ctx.fillStyle = 'rgba(168, 216, 234, 0.15)'
  ctx.strokeStyle = '#67e8f9'
  ctx.lineWidth = 2
  ctx.fillRect(x, y, width, height)
  ctx.strokeRect(x, y, width, height)

  // 光轴指示（斜线）
  ctx.beginPath()
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  const centerX = x + width / 2
  const centerY = y + height / 2
  const axisLength = Math.min(width, height) * 0.7

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.moveTo(-axisLength / 2, -axisLength / 2)
  ctx.lineTo(axisLength / 2, axisLength / 2)
  ctx.stroke()
  ctx.restore()

  ctx.setLineDash([])

  // 光轴标签
  ctx.fillStyle = '#fbbf24'
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('光轴', centerX, y - 5)

  // 折射率标注
  ctx.fillStyle = '#94a3b8'
  ctx.font = '10px sans-serif'
  ctx.fillText('no = 1.6584', x + width / 2, y + height + 15)
  ctx.fillText('ne = 1.4864', x + width / 2, y + height + 28)

  ctx.restore()
}

// 预设按钮组件
function PresetButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
        isActive
          ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/50'
          : 'bg-slate-700/50 text-gray-400 border-slate-600/50 hover:border-slate-500'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  )
}

// 主演示组件
export function BirefringenceDemo() {
  const [inputPolarization, setInputPolarization] = useState(45)
  const [crystalRotation] = useState(45)
  const [animate, setAnimate] = useState(true)

  const radians = (inputPolarization * Math.PI) / 180
  const oIntensity = Math.pow(Math.cos(radians), 2)
  const eIntensity = Math.pow(Math.sin(radians), 2)

  // 预设选项
  const presets = [
    { label: '0° (纯o光)', value: 0 },
    { label: '45° (等分)', value: 45 },
    { label: '90° (纯e光)', value: 90 },
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          双折射效应
        </h2>
        <p className="text-gray-400 mt-1">
          方解石晶体将一束光分裂为偏振方向垂直的o光和e光
        </p>
      </div>

      {/* 可视化面板 */}
      <div className="bg-slate-900/50 rounded-xl border border-cyan-400/20 overflow-hidden">
        <div className="px-4 py-3 border-b border-cyan-400/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">双折射光路演示</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-400">o光 (寻常光)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-400">e光 (非常光)</span>
            </span>
          </div>
        </div>
        <div className="p-4 flex justify-center">
          <BirefringenceCanvas
            inputPolarization={inputPolarization}
            crystalRotation={crystalRotation}
            animate={animate}
          />
        </div>
      </div>

      {/* 控制和信息面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 参数控制 */}
        <ControlPanel title="参数控制">
          <SliderControl
            label="入射光偏振角度"
            value={inputPolarization}
            min={0}
            max={90}
            step={5}
            unit="°"
            onChange={setInputPolarization}
            color="orange"
          />
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <PresetButton
                key={preset.value}
                label={preset.label}
                isActive={inputPolarization === preset.value}
                onClick={() => setInputPolarization(preset.value)}
              />
            ))}
          </div>
          <motion.button
            onClick={() => setAnimate(!animate)}
            className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              animate
                ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                : 'bg-slate-700/50 text-gray-400 border border-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {animate ? '⏸ 暂停动画' : '▶ 播放动画'}
          </motion.button>
        </ControlPanel>

        {/* 分量强度 */}
        <ControlPanel title="分量强度">
          <ValueDisplay
            label="o光强度 (cos²θ)"
            value={(oIntensity * 100).toFixed(1)}
            unit="%"
            color="red"
          />
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              animate={{ width: `${oIntensity * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <ValueDisplay
            label="e光强度 (sin²θ)"
            value={(eIntensity * 100).toFixed(1)}
            unit="%"
            color="green"
          />
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              animate={{ width: `${eIntensity * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <ValueDisplay label="总强度守恒" value="100" unit="%" color="cyan" />
        </ControlPanel>

        {/* 晶体参数 */}
        <ControlPanel title="方解石参数">
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>o光折射率 (no):</span>
              <span className="text-cyan-400 font-mono">1.6584</span>
            </div>
            <div className="flex justify-between">
              <span>e光折射率 (ne):</span>
              <span className="text-cyan-400 font-mono">1.4864</span>
            </div>
            <div className="flex justify-between">
              <span>双折射率差 (Δn):</span>
              <span className="text-purple-400 font-mono">0.172</span>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-gray-500">
                方解石是典型的负单轴晶体，具有显著的双折射效应。
              </p>
            </div>
          </div>
        </ControlPanel>
      </div>

      {/* 现实应用场景 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="🔬 偏光显微镜" color="cyan">
          <p className="text-xs text-gray-300">
            利用双折射原理观察矿物和生物样本的微观结构，不同晶体取向显示不同干涉色。
          </p>
        </InfoCard>
        <InfoCard title="📊 应力分析" color="purple">
          <p className="text-xs text-gray-300">
            透明材料受力时产生应力双折射，用于检测玻璃、塑料中的内应力分布。
          </p>
        </InfoCard>
        <InfoCard title="💎 宝石鉴定" color="orange">
          <p className="text-xs text-gray-300">
            通过方解石观察宝石的双像效应，可以鉴别天然宝石与仿制品。
          </p>
        </InfoCard>
      </div>
    </div>
  )
}
