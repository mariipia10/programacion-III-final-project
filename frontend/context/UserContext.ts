import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, Role } from '../types/user'
import { loginRequest } from '../services/authService'

type UserContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (newUserData: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // normaliza el rol, por si en algún momento viene como string raro u objeto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeRole = (role: any): Role => {
    if (!role) return 'user'
    if (typeof role === 'string') {
      const r = role.toLowerCase()
      if (r === 'admin' || r === 'provider' || r === 'user') return r
      return 'user'
    }
    if (role.name) {
      const r = String(role.name).toLowerCase()
      if (r === 'admin' || r === 'provider' || r === 'user') return r
    }
    return 'user'
  }

  // Cargar usuario y token desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      try {
        const parsedUser: User = JSON.parse(savedUser)
        parsedUser.role = normalizeRole(parsedUser.role)
        setUser(parsedUser)
        setToken(savedToken)
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }

    setLoading(false)
  }, [])

  // Sincronizar localStorage cuando cambian user/token
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
    }
  }, [user, token])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { token, user } = await loginRequest({ email, password })

      const normalizedUser: User = {
        ...user,
        role: normalizeRole(user.role),
      }

      setToken(token)
      setUser(normalizedUser)

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(normalizedUser))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error)
      throw new Error(error.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateUser = (newUserData: User) => {
    const normalizedUser: User = {
      ...newUserData,
      role: normalizeRole(newUserData.role),
    }
    setUser(normalizedUser)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
  }

  return React.createElement(
    UserContext.Provider,
    { value: { user, token, loading, login, logout, updateUser } },
    children,
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser debe usarse dentro de UserProvider')
  return context
}
