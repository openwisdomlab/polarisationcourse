/**
 * Demo2DCanvas - 2D演示画布组件
 * 用于菲涅尔方程、斯托克斯矢量等2D可视化
 */
import { useRef, useEffect, useCallback } from 'react'

interface Demo2DCanvasProps {
  width?: number
  height?: number
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  className?: string
}

export function Demo2DCanvas({
  width = 600,
  height = 400,
  draw,
  className = '',
}: Demo2DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 支持高DPI
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 清除画布
    ctx.clearRect(0, 0, width, height)

    // 调用绘制函数
    draw(ctx, width, height)
  }, [width, height, draw])

  useEffect(() => {
    render()
  }, [render])

  return (
    <canvas
      ref={canvasRef}
      className={`bg-slate-900/50 rounded-lg ${className}`}
      style={{ width, height }}
    />
  )
}

// 绘图工具函数
export const DrawUtils = {
  // 绘制坐标轴
  drawAxes(
    ctx: CanvasRenderingContext2D,
    originX: number,
    originY: number,
    width: number,
    height: number,
    xLabel = 'x',
    yLabel = 'y'
  ) {
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1
    ctx.beginPath()
    // X轴
    ctx.moveTo(40, originY)
    ctx.lineTo(width - 20, originY)
    // Y轴
    ctx.moveTo(originX, height - 20)
    ctx.lineTo(originX, 20)
    ctx.stroke()

    // 箭头和标签
    ctx.fillStyle = '#94a3b8'
    ctx.font = '12px sans-serif'
    ctx.fillText(xLabel, width - 30, originY + 20)
    ctx.fillText(yLabel, originX + 10, 30)
  },

  // 绘制正弦波
  drawSineWave(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    length: number,
    amplitude: number,
    wavelength: number,
    phase: number,
    color: string,
    lineWidth = 2
  ) {
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    for (let x = 0; x <= length; x++) {
      const y = startY + amplitude * Math.sin((2 * Math.PI * x) / wavelength + phase)
      if (x === 0) {
        ctx.moveTo(startX + x, y)
      } else {
        ctx.lineTo(startX + x, y)
      }
    }
    ctx.stroke()
  },

  // 绘制箭头
  drawArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    lineWidth = 2
  ) {
    const headLen = 10
    const angle = Math.atan2(toY - fromY, toX - fromX)

    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = lineWidth

    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(
      toX - headLen * Math.cos(angle - Math.PI / 6),
      toY - headLen * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
      toX - headLen * Math.cos(angle + Math.PI / 6),
      toY - headLen * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fill()
  },

  // 绘制偏振椭圆
  drawPolarizationEllipse(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    a: number,
    b: number,
    angle: number,
    color: string
  ) {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, a, b, angle, 0, 2 * Math.PI)
    ctx.stroke()
  },
}
