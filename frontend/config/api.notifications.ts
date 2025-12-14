import api from './api'

export type NotificationType =
  | 'subscription_created'
  | 'subscription_canceled'
  | 'subscription_expired'
  | 'renewal_due_soon'
  | 'system'
  | 'generic'

export interface Notification {
  _id: string
  user: string
  type?: NotificationType
  title: string
  message: string
  isRead?: boolean
  subscription?: string
  createdAt?: string
}

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get('/notifications')
  return data
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const { data } = await api.patch(`/notifications/${id}/read`)
  return data
}
