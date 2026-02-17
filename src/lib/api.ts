/**
 * API Client - Thin wrapper around fetch for backend communication
 *
 * Features:
 * - Auto-attaches Bearer token from authStore
 * - JSON request/response handling
 * - Graceful degradation: returns null if server unreachable (offline mode)
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('polarcraft-auth')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_BASE}/api${path}`, {
      ...options,
      headers,
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new ApiError(res.status, error.message ?? 'Request failed')
    }
    const text = await res.text()
    return text ? JSON.parse(text) : null
  } catch (err) {
    if (err instanceof ApiError) throw err
    // Network error — offline mode
    console.warn(`[API] Offline or unreachable: ${path}`)
    return null
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// --- Auth Types ---

export interface AuthResponse {
  token: string
  user: ApiUser
}

export interface ApiUser {
  id: string
  email: string
  displayName: string
  role: string
}

export interface UserProfile extends ApiUser {
  createdAt: string
  updatedAt: string
}

// --- Progress Types ---

export interface DemoProgressRecord {
  id: string
  userId: string
  demoId: string
  completed: boolean
  difficulty: string | null
  completedAt: string | null
}

export interface DiscoveryRecord {
  id: string
  userId: string
  discoveryId: string
  discoveredIn: string | null
  discoveredAt: string
}

export interface GameSaveRecord {
  id: string
  userId: string
  gameType: string
  level: number
  stateJson: Record<string, unknown> | null
  savedAt: string
}

export interface LabProgressRecord {
  id: string
  userId: string
  taskId: string
  status: string
  dataJson: Record<string, unknown> | null
  fitJson: Record<string, unknown> | null
  notes: string | null
  skills: Record<string, number> | null
  startedAt: string | null
  completedAt: string | null
}

export interface FullProgress {
  demos: DemoProgressRecord[]
  discoveries: DiscoveryRecord[]
  gameSaves: GameSaveRecord[]
  labProgress: LabProgressRecord[]
}

// --- API Methods ---

export const api = {
  auth: {
    register(email: string, password: string, displayName: string) {
      return request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
      })
    },
    login(email: string, password: string) {
      return request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    },
    profile() {
      return request<UserProfile>('/auth/profile')
    },
  },

  progress: {
    getDemos() {
      return request<DemoProgressRecord[]>('/progress/demos')
    },
    completeDemo(demoId: string, difficulty?: string) {
      return request<DemoProgressRecord>(`/progress/demos/${demoId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ difficulty }),
      })
    },
    getDiscoveries() {
      return request<DiscoveryRecord[]>('/progress/discoveries')
    },
    unlockDiscovery(discoveryId: string, discoveredIn?: string) {
      return request<DiscoveryRecord>('/progress/discoveries/unlock', {
        method: 'POST',
        body: JSON.stringify({ discoveryId, discoveredIn }),
      })
    },
    getGameSaves(gameType: string) {
      return request<GameSaveRecord[]>(`/progress/games/${gameType}`)
    },
    saveGame(gameType: string, level: number, stateJson?: Record<string, unknown>) {
      return request<GameSaveRecord>(`/progress/games/${gameType}/${level}`, {
        method: 'POST',
        body: JSON.stringify({ stateJson }),
      })
    },
    getLabProgress() {
      return request<LabProgressRecord[]>('/progress/lab')
    },
    updateLabTask(taskId: string, data: Record<string, unknown>) {
      return request<LabProgressRecord>(`/progress/lab/${taskId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    syncAll(localState: {
      demos?: { demoId: string; completed: boolean; difficulty?: string; completedAt?: string }[]
      discoveries?: { discoveryId: string; discoveredIn?: string; discoveredAt?: string }[]
      gameSaves?: { gameType: string; level: number; stateJson?: Record<string, unknown>; savedAt?: string }[]
      labProgress?: { taskId: string; status?: string; dataJson?: Record<string, unknown> }[]
    }) {
      return request<FullProgress>('/progress/sync', {
        method: 'POST',
        body: JSON.stringify(localState),
      })
    },
    getFullProgress() {
      return request<FullProgress>('/progress/full')
    },
  },
}
