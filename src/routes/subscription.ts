import express, { Request, Response, NextFunction } from 'express'
import Subscription from '../schemas/subscription'
import Service from '../schemas/service'
import authentication from '../middlewares/authentication'
import { IService } from '@/types'
import Notification from '../schemas/notification'
import mongoose from 'mongoose'

const router = express.Router()

interface CreateSubscriptionRequest {
  serviceId: string
  autoRenew?: boolean
}

// Prox facturacion
function getNextBillingDate(start: Date, billingCycle: 'monthly' | 'yearly'): Date {
  const next = new Date(start)
  if (billingCycle === 'yearly') {
    next.setFullYear(next.getFullYear() + 1)
  } else {
    next.setMonth(next.getMonth() + 1)
  }
  return next
}

router.post('/', authentication, createSubscription)
router.get('/', authentication, getSubscriptions)
router.patch('/:id/cancel', authentication, cancelSubscription)
async function createSubscription(
  req: Request<Record<string, never>, unknown, CreateSubscriptionRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('createSubscription body:', req.body)

  try {
    const { serviceId, autoRenew } = req.body

    if (!serviceId) {
      res.status(400).json({ error: 'serviceId is required' }).end()

      return
    }

    const user = req.user
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    if (!req.isClient?.() && user.role !== 'client') {
      res.status(403).json({ error: 'Only clients can subscribe' })
      return
    }
    const service = await Service.findById(serviceId)
    if (!service) {
      res.status(404).json({ error: 'Service not found' })
      return
    }
    if (service.isActive === false) {
      res.status(400).json({ error: 'Service is inactive' })
      return
    }
    const existing = await Subscription.findOne({
      user: user._id,
      service: serviceId,
      status: 'active',
    })

    if (existing) {
      res.status(400).json({ error: 'You already have an active subscription to this service' })
      return
    }

    const startDate = new Date()
    const billingPeriod = (service as IService).billingPeriod
    const nextBillingDate = getNextBillingDate(startDate, billingPeriod)

    const subscription = await Subscription.create({
      user: user._id,
      service: serviceId,
      status: 'active',
      startDate,
      nextBillingDate,
      autoRenew: autoRenew ?? true,
    })

    await Notification.create({
      user: new mongoose.Types.ObjectId(user._id),
      type: 'subscription_created',
      title: 'Suscripción creada',
      message: `Te suscribiste a ${(service as IService).name}.`,
      subscription: subscription._id,
      isRead: false,
    })

    res.status(201).send(subscription)
  } catch (err) {
    next(err)
  }
}

async function getSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('getSubscriptions by user', req.user?._id)

  try {
    const user = req.user
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const subscriptions = await Subscription.find({ user: user._id }).populate('service')
    res.send(subscriptions)
  } catch (err) {
    next(err)
  }
}

async function cancelSubscription(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const user = req.user
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (user.role !== 'client') {
      res.status(403).json({ error: 'Only clients can cancel subscriptions' })
      return
    }

    const subscription = await Subscription.findById(req.params.id)
    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' })
      return
    }

    if (subscription.user.toString() !== user._id.toString()) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    if (subscription.status === 'canceled') {
      res.status(400).json({ error: 'Subscription already canceled' })
      return
    }

    subscription.status = 'canceled'
    subscription.endDate = new Date()
    subscription.autoRenew = false
    await subscription.save()

    res.send(subscription)
  } catch (err) {
    next(err)
  }
}

export default router
