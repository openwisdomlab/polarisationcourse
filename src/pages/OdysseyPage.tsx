/**
 * OdysseyPage.tsx -- Odyssey 等距光学世界入口
 *
 * 初始化场景状态，渲染 OdysseyWorld 等距场景组件。
 * 使用 Zustand persist 水合感知模式:
 * - 等待 persist 中间件完成 localStorage 水合
 * - 如果有保存状态，跳过初始化 (sceneLoaded=true)
 * - 如果没有保存状态，从区域注册表初始化 6 个区域
 */
import { useEffect } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { OdysseyWorld } from '@/components/odyssey-world/OdysseyWorld'

export function OdysseyPage() {
  useEffect(() => {
    // 水合感知初始化 (pitfall 1: 避免覆盖 persist 恢复的状态)
    const unsub = useOdysseyWorldStore.persist.onFinishHydration(() => {
      if (!useOdysseyWorldStore.getState().sceneLoaded) {
        useOdysseyWorldStore.getState().initScene()
      }
    })

    // 处理水合已完成的情况 (快速 localStorage 读取)
    if (useOdysseyWorldStore.persist.hasHydrated()) {
      if (!useOdysseyWorldStore.getState().sceneLoaded) {
        useOdysseyWorldStore.getState().initScene()
      }
    }

    return unsub
  }, [])

  return <OdysseyWorld />
}
