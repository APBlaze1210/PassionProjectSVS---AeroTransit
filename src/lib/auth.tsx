import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { apiFetch } from './api'

export interface User {
  id: number
  username: string
  phone: string
  points: number
  preferences: string[]
}

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, phone: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('aero-transit:token')
    if (!token) { setLoading(false); return }
    apiFetch<{ user: User }>('/api/auth/me')
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem('aero-transit:token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (username: string, password: string) => {
    const d = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password }),
    })
    localStorage.setItem('aero-transit:token', d.token)
    setUser(d.user)
  }

  const register = async (username: string, password: string, phone: string) => {
    const d = await apiFetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST', body: JSON.stringify({ username, password, phone }),
    })
    localStorage.setItem('aero-transit:token', d.token)
    setUser(d.user)
  }

  const logout = () => {
    localStorage.removeItem('aero-transit:token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
