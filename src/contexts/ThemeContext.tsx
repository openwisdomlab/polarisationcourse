import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('polarcraft-theme')
        if (saved === 'light' || saved === 'dark') return saved
      } catch (error) {
        // localStorage may be unavailable in private browsing mode or if storage is full
        console.warn('Unable to access localStorage for theme:', error)
      }
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
      // Dark theme CSS variables
      root.style.setProperty('--bg-primary', '#0a0a0f')
      root.style.setProperty('--bg-secondary', '#0f172a')
      root.style.setProperty('--bg-tertiary', '#1e293b')
      root.style.setProperty('--bg-card', 'rgba(15, 23, 42, 0.9)')
      root.style.setProperty('--bg-overlay', 'rgba(0, 0, 0, 0.7)')
      root.style.setProperty('--text-primary', '#f1f5f9')
      root.style.setProperty('--text-secondary', '#94a3b8')
      root.style.setProperty('--text-muted', '#64748b')
      root.style.setProperty('--border-color', 'rgba(34, 211, 238, 0.2)')
      root.style.setProperty('--accent-cyan', '#22d3ee')
      root.style.setProperty('--accent-purple', '#a78bfa')
      root.style.setProperty('--accent-green', '#4ade80')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      // Light theme CSS variables
      root.style.setProperty('--bg-primary', '#f8fafc')
      root.style.setProperty('--bg-secondary', '#ffffff')
      root.style.setProperty('--bg-tertiary', '#f1f5f9')
      root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.95)')
      root.style.setProperty('--bg-overlay', 'rgba(255, 255, 255, 0.9)')
      root.style.setProperty('--text-primary', '#0f172a')
      root.style.setProperty('--text-secondary', '#475569')
      root.style.setProperty('--text-muted', '#94a3b8')
      root.style.setProperty('--border-color', 'rgba(15, 118, 110, 0.3)')
      root.style.setProperty('--accent-cyan', '#0891b2')
      root.style.setProperty('--accent-purple', '#7c3aed')
      root.style.setProperty('--accent-green', '#16a34a')
    }

    try {
      localStorage.setItem('polarcraft-theme', theme)
    } catch (error) {
      // localStorage may be unavailable in private browsing mode or if storage quota is exceeded
      console.warn('Unable to save theme to localStorage:', error)
    }
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
