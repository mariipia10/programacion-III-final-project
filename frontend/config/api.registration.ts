// src/api/registration.api.ts
import api from './api'

export type GovernmentIdType = 'cuil' | 'cuit' | 'dni' | 'lc' | 'le' | 'pas'

export const governmentIdTypes: GovernmentIdType[] = ['cuil', 'cuit', 'dni', 'lc', 'le', 'pas']

export interface RegisterUserPayload {
  email: string
  password: string
  role: 'client' | 'provider' // nombre del rol en Role.name
  provider?: string // ObjectId string cuando es provider
  firstName: string
  lastName: string
  phone?: string
  governmentId?: {
    type: GovernmentIdType
    number: string
  }
  bornDate?: string // DD/MM/YYYY
  isActive?: boolean
}

export interface CreateProviderPayload {
  name: string
  description?: string
  website?: string
  contactEmail?: string
  isActive?: boolean
}

export interface ProviderResponse {
  _id: string
  name: string
  isActive: boolean
  description?: string
  website?: string
  contactEmail?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserResponse {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string | { _id: string; name: string }
  provider?: string
  phone?: string
  governmentId?: {
    type: GovernmentIdType
    number: string
  }
  bornDate?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export async function createProvider(payload: CreateProviderPayload): Promise<ProviderResponse> {
  const res = await api.post<ProviderResponse>('/providers', {
    ...payload,
    isActive: payload.isActive ?? true,
  })
  return res.data
}
export function registerUser(payload: RegisterUserPayload): Promise<UserResponse> {
  console.log('registerUser payload', payload)
  return api.post<UserResponse>('/register', payload).then((res) => res.data)
  console.log('registerUser payload', payload)
}

// convierte YYYY-MM-DD (input HTML) a DD/MM/YYYY (backend)
export function toBackendDate(isoDate: string | ''): string | undefined {
  if (!isoDate) return undefined
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return undefined
  return `${day}/${month}/${year}`
}
