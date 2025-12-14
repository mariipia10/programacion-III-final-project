import { Document, Model, Types } from 'mongoose'

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  role: Types.ObjectId
  provider: Types.ObjectId
  firstName: string
  lastName: string
  phone?: string
  governmentId?: { type: GovernmentIdType; number: string }
  bornDate?: Date
  isActive: boolean
  checkPassword(potentialPassword: string): Promise<{ isOk: boolean; isLocked: boolean }>
}

export type GovernmentIdType = 'cuil' | 'cuit' | 'dni' | 'lc' | 'le' | 'pas'

// Role Types
export interface IRole extends Document {
  _id: Types.ObjectId
  name: string
  description?: string
  permissions: string[]
  isActive: boolean
}

// JWT Payload
export interface JWTPayload {
  _id: string
  email: string
  role: 'admin' | 'provider' | 'client'
  iat?: number
  exp?: number
  iss?: string
  provider?: string | null
}

// Request Extensions - using module augmentation instead of namespace
declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload
    isAdmin?(): boolean
    isClient?(): boolean
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Auth Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface CreateUserRequest {
  email: string
  password: string
  role: string
  provider?: string
  firstName: string
  lastName: string
  phone?: string
  governmentId?: { type: GovernmentIdType; number: string }
  bornDate?: Date
}

// Environment Variables
export interface EnvironmentVariables {
  NODE_ENV?: string
  PORT?: string
  MONGO_URL?: string
  MONGO_DB?: string
  JWT_SECRET?: string
  JWT_ISSUER?: string
}

// Subscription Types
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'pending'

export interface ISubscription extends Document {
  _id: Types.ObjectId
  user: Types.ObjectId // ref: User
  service: Types.ObjectId // ref: Service
  status: SubscriptionStatus
  startDate: Date
  endDate?: Date
  autoRenew: boolean
  nextBillingDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

// Payment Types
export type PaymentStatus = 'paid' | 'failed' | 'pending'

export interface IPayment extends Document {
  _id: Types.ObjectId
  subscription: Types.ObjectId // ref: Subscription
  amount: number
  dueDate: Date
  paidAt?: Date
  status: PaymentStatus
  method?: string
  createdAt?: Date
  updatedAt?: Date
}

// Notification Types
export type NotificationType =
  | 'renewal_due_soon'
  | 'subscription_expired'
  | 'subscription_canceled'
  | 'subscription_created'
  | 'payment_failed'
  | 'system'

export interface INotification {
  user: Types.ObjectId
  title: string
  message: string
  isRead: boolean
  subscription?: string
  payment?: string
  meta?: Record<string, any>
  type: NotificationType
}


// Provider Types
export interface IProvider extends Document {
  _id: Types.ObjectId
  name: string
  description?: string
  website?: string
  contactEmail?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
export interface CreateProviderRequest {
  name: string
  description?: string
  website?: string
  contactEmail?: string
  isActive?: boolean
}

//Service Types
export type BillingPeriod = 'monthly' | 'yearly'

export interface IService extends Document {
  _id: Types.ObjectId
  provider: Types.ObjectId //id provider
  name: string
  description?: string
  price: number
  currency: string
  billingPeriod: BillingPeriod
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
