/**
 * useBeamParticles.ts -- 光束粒子动画 Hook
 *
 * 使用 requestAnimationFrame 和直接 DOM 操作 (非 Framer Motion)
 * 驱动沿光束路径流动的粒子动画。
 *
 * 性能策略:
 * - rAF 循环直接修改 SVG circle 元素的 cx/cy 属性
 * - 不触发 React 重渲染
 * - useEffect 清理函数确保 cancelAnimationFrame (防止内存泄漏, pitfall 4)
 * - 粒子数量建议 8-12 个/段，50-100 个总粒子可保持 60fps
 */

import { useRef, useEffect } from 'react'

/** 屏幕空间中的点 */
interface Point {
  x: number
  y: number
}

/**
 * 沿多段折线路径插值获取指定偏移量处的点
 *
 * @param points 路径上的点序列 (屏幕坐标)
 * @param offset 0-1 的归一化偏移量
 * @returns 插值后的坐标
 */
function getPointAtOffset(points: Point[], offset: number): Point {
  if (points.length === 0) return { x: 0, y: 0 }
  if (points.length === 1) return points[0]

  // 计算路径总长度
  let totalLength = 0
  const segmentLengths: number[] = []
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    const len = Math.sqrt(dx * dx + dy * dy)
    segmentLengths.push(len)
    totalLength += len
  }

  if (totalLength === 0) return points[0]

  // 目标距离
  const targetDist = offset * totalLength
  let accumulated = 0

  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i]
    if (accumulated + segLen >= targetDist) {
      // 在此段内插值
      const t = segLen > 0 ? (targetDist - accumulated) / segLen : 0
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * t,
        y: points[i].y + (points[i + 1].y - points[i].y) * t,
      }
    }
    accumulated += segLen
  }

  // 偏移量 >= 1，返回路径末端
  return points[points.length - 1]
}

/**
 * useBeamParticles -- 光束粒子 rAF 动画 Hook
 *
 * @param pathPoints 路径点序列 (屏幕坐标)
 * @param speed 粒子流动速度 (0-1)，speed=0.3 表示每秒走路径的 30%
 * @param count 粒子数量
 * @param color 粒子颜色 (CSS 颜色值)
 * @returns svgGroupRef -- 挂载到 <g> 元素上
 */
export function useBeamParticles(
  pathPoints: Point[],
  speed: number,
  count: number,
  _color: string,
) {
  const svgGroupRef = useRef<SVGGElement>(null)
  const particlesRef = useRef<{ offset: number }[]>([])
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // 初始化粒子偏移量 (均匀分布在路径上)
  useEffect(() => {
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      offset: i / count,
    }))
  }, [count])

  // rAF 动画循环
  useEffect(() => {
    if (pathPoints.length < 2) return

    const animate = (time: number) => {
      // 计算 dt (秒)
      const dt = lastTimeRef.current > 0 ? (time - lastTimeRef.current) / 1000 : 0
      lastTimeRef.current = time

      // 更新每个粒子的偏移量
      for (const p of particlesRef.current) {
        p.offset = (p.offset + dt * speed) % 1
      }

      // 直接 DOM 操作更新粒子位置 (不触发 React 渲染)
      if (svgGroupRef.current) {
        const circles = svgGroupRef.current.children
        const len = Math.min(circles.length, particlesRef.current.length)
        for (let i = 0; i < len; i++) {
          const pos = getPointAtOffset(pathPoints, particlesRef.current[i].offset)
          const circle = circles[i] as SVGCircleElement
          circle.setAttribute('cx', String(pos.x))
          circle.setAttribute('cy', String(pos.y))
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    // 关键清理: 防止内存泄漏 (pitfall 4)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = 0
    }
  }, [pathPoints, speed])

  return svgGroupRef
}
