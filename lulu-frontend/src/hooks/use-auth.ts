import { useState, useEffect } from 'react'
import { AuthService, type AuthResponse } from '@/features/auth/services/auth.service'

interface User {
  id: string
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = AuthService.getToken()
    if (token) {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await AuthService.login({ email, password })
      AuthService.setToken(response.token)
      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
      }
      localStorage.setItem('user_data', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await AuthService.register({ name, email, password })
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const logout = () => {
    AuthService.removeToken()
    localStorage.removeItem('user_data')
    setUser(null)
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }
}

