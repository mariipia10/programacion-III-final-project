import api from '../config/api'
import { type LoginResponse } from '../types/User'

export interface LoginInput {
  email: string
  password: string
}

export const loginRequest = async (credentials: LoginInput): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>('/auth', credentials)
    return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error en loginRequest:', error)
    throw new Error(error?.response?.data?.message || 'Error al iniciar sesión')
  }
}
