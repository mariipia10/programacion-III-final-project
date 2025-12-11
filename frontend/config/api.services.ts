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

export async function createService(data: ServiceInput) {
    
  const { data: result } = await api.post('/services', data)
  return result
}

export async function getServices() {
  const { data } = await api.get('/services')
  return data
}
