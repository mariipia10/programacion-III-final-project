import api from './api'

export type SubscriptionStatus = 'active' | 'paused' | 'canceled' | 'expired'

export interface Subscription {
  _id: string
  user: string
  service: any
  status: SubscriptionStatus
  startDate: string
  endDate?: string
  autoRenew: boolean
  nextBillingDate?: string
}

export interface CreateSubscriptionPayload {
  serviceId: string
  autoRenew?: boolean
}

export async function getMySubscriptions(): Promise<Subscription[]> {
  const { data } = await api.get('/subscriptions')
  return data
}

export async function createSubscription(
  payload: CreateSubscriptionPayload,
): Promise<Subscription> {
  const { data } = await api.post('/subscriptions', payload)
  return data
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  const { data } = await api.patch(`/subscriptions/${subscriptionId}/cancel`)
  return data
}
