/**
 * IndexedDBStore - IndexedDB持久化层
 *
 * 替代localStorage的大容量本地持久化方案。
 * 支持数据版本迁移、导出/导入、跨设备同步协议接口。
 */

import { logger } from '@/lib/logger'

const DB_NAME = 'polarcraft_data'
const DB_VERSION = 1

interface StoreSchema {
  /** 学习进度 (demo完成度、成就等) */
  progress: {
    key: string
    value: unknown
    updatedAt: number
  }
  /** 用户设置 */
  settings: {
    key: string
    value: unknown
  }
  /** 游戏存档 */
  saves: {
    key: string
    data: unknown
    savedAt: number
    version: number
  }
}

type StoreName = keyof StoreSchema

export class IndexedDBStore {
  private db: IDBDatabase | null = null
  private dbReady: Promise<boolean>

  constructor() {
    this.dbReady = this.openDatabase()
  }

  private openDatabase(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        logger.warn('[IndexedDBStore] IndexedDB not available, falling back to localStorage')
        resolve(false)
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建对象存储
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'key' })
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
        if (!db.objectStoreNames.contains('saves')) {
          const store = db.createObjectStore('saves', { keyPath: 'key' })
          store.createIndex('savedAt', 'savedAt', { unique: false })
        }
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        logger.info('[IndexedDBStore] Database opened successfully')
        resolve(true)
      }

      request.onerror = () => {
        logger.error('[IndexedDBStore] Failed to open database')
        resolve(false)
      }
    })
  }

  /** 等待数据库就绪 */
  async isReady(): Promise<boolean> {
    return this.dbReady
  }

  /** 通用写入 */
  async set<T extends StoreName>(storeName: T, data: StoreSchema[T]): Promise<void> {
    const ready = await this.dbReady
    if (!ready || !this.db) {
      // 降级到localStorage
      try {
        localStorage.setItem(`${DB_NAME}_${storeName}_${(data as { key: string }).key}`, JSON.stringify(data))
      } catch {
        logger.error('[IndexedDBStore] localStorage fallback failed')
      }
      return
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      store.put(data)

      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  /** 通用读取 */
  async get<T extends StoreName>(storeName: T, key: string): Promise<StoreSchema[T] | null> {
    const ready = await this.dbReady
    if (!ready || !this.db) {
      try {
        const raw = localStorage.getItem(`${DB_NAME}_${storeName}_${key}`)
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  /** 获取某个store的所有数据 */
  async getAll<T extends StoreName>(storeName: T): Promise<StoreSchema[T][]> {
    const ready = await this.dbReady
    if (!ready || !this.db) return []

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /** 删除 */
  async delete(storeName: StoreName, key: string): Promise<void> {
    const ready = await this.dbReady
    if (!ready || !this.db) {
      localStorage.removeItem(`${DB_NAME}_${storeName}_${key}`)
      return
    }

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      store.delete(key)

      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  // ============================================
  // 导出/导入功能
  // ============================================

  /** 导出所有数据为JSON */
  async exportData(): Promise<string> {
    const progress = await this.getAll('progress')
    const settings = await this.getAll('settings')
    const saves = await this.getAll('saves')

    const exportObj = {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      data: { progress, settings, saves }
    }

    return JSON.stringify(exportObj, null, 2)
  }

  /** 从JSON导入数据 */
  async importData(jsonStr: string): Promise<{ imported: number; errors: number }> {
    let imported = 0
    let errors = 0

    try {
      const data = JSON.parse(jsonStr)

      if (!data.data) {
        throw new Error('Invalid export format')
      }

      const stores: StoreName[] = ['progress', 'settings', 'saves']
      for (const storeName of stores) {
        const items = data.data[storeName]
        if (Array.isArray(items)) {
          for (const item of items) {
            try {
              await this.set(storeName, item)
              imported++
            } catch {
              errors++
            }
          }
        }
      }
    } catch (e) {
      logger.error('[IndexedDBStore] Import failed:', e)
      errors++
    }

    return { imported, errors }
  }

  /** 清空所有数据 */
  async clearAll(): Promise<void> {
    const ready = await this.dbReady
    if (!ready || !this.db) return

    const stores: StoreName[] = ['progress', 'settings', 'saves']
    for (const storeName of stores) {
      await new Promise<void>((resolve) => {
        const tx = this.db!.transaction(storeName, 'readwrite')
        tx.objectStore(storeName).clear()
        tx.oncomplete = () => resolve()
      })
    }
  }
}

/** 全局单例 */
let instance: IndexedDBStore | null = null

export function getIndexedDBStore(): IndexedDBStore {
  if (!instance) {
    instance = new IndexedDBStore()
  }
  return instance
}
