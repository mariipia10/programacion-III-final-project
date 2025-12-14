import api from './api'

export interface ServiceInput {
  provider: string
  name: string
  description: string
  price: number
  currency: string
  billingPeriod: string
  isActive: boolean
}

export type ProviderService = {
  _id: string
  provider: string
  name: string
  description?: string
  price: number
  currency: string
  billingPeriod: 'monthly' | 'yearly'
  isActive: boolean
  subscribersCount: number
}

export type ServiceSubscribersResponse = {
  service: { _id: string; name: string }
  totalActive: number
  subscriptions: Array<{
    _id: string
    user: { _id: string; email: string; name?: string }
    status: 'active' | 'paused' | 'canceled' | 'expired'
    startDate: string
    nextBillingDate?: string
    createdAt: string
  }>
}

export async function createService(data: ServiceInput) {
  const { data: result } = await api.post('/services', data)
  return result
}

export async function getServices() {
  const { data } = await api.get('/services')
  return data
}

// mis servicios + count
export async function getMyServices(): Promise<ProviderService[]> {
  const { data } = await api.get('/services/mine')
  return data
}

// uscriptores activos de un servicio
export async function getServiceSubscribers(
  serviceId: string,
): Promise<ServiceSubscribersResponse> {
  const { data } = await api.get(`/services/${serviceId}/subscribers`)
  return data
}
