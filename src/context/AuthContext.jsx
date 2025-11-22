import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../api'

export const AuthContext = createContext(null)

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // try to refresh on load
    (async () => {
      try {
        const r = await api.post('/api/auth/refresh')
        setToken(r.data.access_token)
        // fetch user info if needed
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/api/auth/login', { email, password })
    setToken(r.data.access_token)
    return r.data
  }

  const logout = async () => {
    await api.post('/api/auth/logout')
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
}
