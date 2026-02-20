/**
 * OdysseyPage.tsx -- Odyssey 等距光学世界入口
 *
 * 初始化场景状态，渲染 OdysseyWorld 等距场景组件。
 * 组件挂载时初始化场景数据，卸载时清理状态。
 */
import { useEffect } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'
import { OdysseyWorld } from '@/components/odyssey-world/OdysseyWorld'

export function OdysseyPage() {
  useEffect(() => {
    // 挂载时初始化场景数据
    useOdysseyWorldStore.getState().initScene()

    return () => {
      // 卸载时重置场景加载状态，允许下次重新初始化
      useOdysseyWorldStore.setState({ sceneLoaded: false })
    }
  }, [])

  return <OdysseyWorld />
}
