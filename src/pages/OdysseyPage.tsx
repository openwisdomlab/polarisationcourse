/**
 * OdysseyPage.tsx -- Odyssey 等距光学世界入口
 *
 * 初始化场景状态，渲染占位符 (Plan 02 将替换为 OdysseyWorld 组件)。
 * 组件挂载时初始化场景数据，卸载时清理状态。
 */
import { useEffect } from 'react'
import { useOdysseyWorldStore } from '@/stores/odysseyWorldStore'

export function OdysseyPage() {
  useEffect(() => {
    // 挂载时初始化场景数据
    useOdysseyWorldStore.getState().initScene()

    return () => {
      // 卸载时重置场景加载状态，允许下次重新初始化
      useOdysseyWorldStore.setState({ sceneLoaded: false })
    }
  }, [])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
      <p className="text-lg opacity-60">Odyssey World Loading...</p>
    </div>
  )
}
