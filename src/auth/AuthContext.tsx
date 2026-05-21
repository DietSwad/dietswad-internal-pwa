import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getStoredToken, isTokenValid, storeToken, clearToken } from './useJwt'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isTokenValid(getStoredToken())
  })

  useEffect(() => {
    setIsAuthenticated(isTokenValid(getStoredToken()))
  }, [])

  function login(token: string) {
    storeToken(token)
    setIsAuthenticated(true)
  }

  function logout() {
    clearToken()
    setIsAuthenticated(false)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
