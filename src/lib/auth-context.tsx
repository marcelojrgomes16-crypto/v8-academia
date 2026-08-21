'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  matricula?: string
  image?: string
}

interface SessionContextType {
  user: User | null
  loading: boolean
  refresh: () => void
  logout: () => void
}

const SessionContext = createContext<SessionContextType>({ user: null, loading: true, refresh: () => {}, logout: () => {} })

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const data = await res.json()
        setUser(data?.user || null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <SessionContext.Provider value={{ user, loading, refresh: fetchSession, logout }}>
      {children}
    </SessionContext.Provider>
  )
}
