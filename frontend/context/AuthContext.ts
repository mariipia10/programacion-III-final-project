import { createContext, useContext } from 'react'

export interface UserInfo {
  _id: string
  email: string
  role: string
}

export interface AuthContextType {
  user: UserInfo | null
  token: string | null
  login: (token: string, user: UserInfo) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
