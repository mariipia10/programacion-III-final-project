export const ROLES = ['admin', 'provider', 'client'] as const
export type Role = (typeof ROLES)[number]

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: Role
  isActive: boolean
  governmentId?: {
    type: 'cuil' | 'cuit' | 'dni' | 'lc' | 'le' | 'pas'
    number: string
  }
  bornDate?: string
}

export interface LoginResponse {
  token: string
  user: User
}
