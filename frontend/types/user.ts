export type Role = 'admin' | 'provider' | 'user'

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: Role // viene como "admin" en el ejemplo de auth
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
