import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApiClient, User } from '../api/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      authApiClient.getCurrentUser()
        .then(userData => {
          setUser(userData)
        })
        .catch(() => {
          logout()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [token])

  const login = async (username: string, password: string) => {
    try {
      const response = await authApiClient.login({ username, password })
      const { token: newToken, username: userUsername, email, role, tenantId } = response
      
      setToken(newToken)
      setUser({ id: 0, username: userUsername, email, role, tenantId })
      localStorage.setItem('token', newToken)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await authApiClient.register(userData)
      const { token: newToken, username, email, role, tenantId } = response
      
      setToken(newToken)
      setUser({ id: 0, username, email, role, tenantId })
      localStorage.setItem('token', newToken)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}