import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Create the router instance 创建路由实例
const router = createRouter({ routeTree })

// Register the router for type safety 注册路由以获得类型安全
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Main application component 主应用组件
export function App() {
  return <RouterProvider router={router} />
}
