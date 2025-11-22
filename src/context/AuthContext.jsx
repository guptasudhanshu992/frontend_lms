import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../api'
import { 
  getAccessToken, 
  getUser, 
  setAuthData, 
  clearAuthData, 
  isAuthenticated,
  getRefreshToken 
} from '../utils/authUtils'

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
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // Initialize auth state from localStorage
    const initAuth = async () => {
      try {
        const storedUser = getUser()
        const token = getAccessToken()
        
        if (token && storedUser) {
          setUser(storedUser)
          setIsAuth(true)
          
          // Try to refresh token to ensure it's valid
          const refreshToken = getRefreshToken()
          if (refreshToken) {
            try {
              const response = await api.post('/api/auth/refresh')
              if (response.data.access_token) {
                setAuthData(response.data.access_token, refreshToken, storedUser)
              }
            } catch (error) {
              // If refresh fails, clear auth state
              console.log('Token refresh failed on init:', error)
              clearAuthData()
              setUser(null)
              setIsAuth(false)
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        clearAuthData()
        setUser(null)
        setIsAuth(false)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    const { access_token, refresh_token, user: userData } = response.data
    
    setAuthData(access_token, refresh_token, userData)
    setUser(userData)
    setIsAuth(true)
    
    return response.data
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthData()
      setUser(null)
      setIsAuth(false)
    }
  }

  const checkAuth = () => {
    return isAuthenticated() && user !== null
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuth, 
      loading, 
      login, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
