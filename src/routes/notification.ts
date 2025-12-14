// src/routes/notification.ts
import express, { Request, Response, NextFunction } from 'express'
import Notification from '../schemas/notification'
import authentication from '../middlewares/authentication'
import Subscription from '../schemas/subscription'
import { JWTPayload } from '@/types'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/', authentication, getUserNotifications)
router.post('/', authentication, createNotification)
router.patch('/subscriptions/:id/cancel', authentication, cancelSubscription)
router.patch('/:id/read', authentication, markRead)

async function getUserNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('getNotifications user', req.user?._id)

  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const notifs = await Notification.find({
      user: new mongoose.Types.ObjectId(req.user._id),
    }).sort({ createdAt: -1 })
    res.send(notifs)
  } catch (err) {
    next(err)
  }
}

async function createNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('createNotification body:', req.body)

  try {
    const { user, message, type } = req.body

    if (!user || !message) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: admin only' })
      return
    }

    const notif = await Notification.create({
      user,
      message,
      type: type ?? 'system',
      isRead: false,
    })

    res.status(201).json(notif)
  } catch (err) {
    next(err)
  }
}

async function cancelSubscription(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const user = req.user as JWTPayload | undefined
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const subscription = await Subscription.findById(req.params.id).populate<{
      service: { name: string }
    }>('service')
    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' })
      return
    }

    if (subscription.user.toString() !== user._id.toString()) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    // Cambiar a "cancelled"
    subscription.status = 'canceled'
    subscription.endDate = new Date()
    await subscription.save()

    // Crear notificación de "cancelación"
    await Notification.create({
      user: subscription.user,
      type: 'subscription_canceled',
      title: 'Suscripción cancelada',
      message: `Tu suscripción a ${subscription.service.name} ha sido cancelada.`,
      isRead: false,
      subscription: subscription._id,
    })

    res.send(subscription)
  } catch (err) {
    next(err)
  }
}

async function markRead(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('markRead notif id', req.params.id, 'user', req.user?._id)

  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const notif = await Notification.findById(req.params.id)
    if (!notif) {
      res.status(404).json({ error: 'Notification not found' })
      return
    }

    // Solo el dueño puede marcarla como leída
    if (notif.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    // Si tu schema tiene isRead:
    ;(notif as any).isRead = true

    await notif.save()
    res.send(notif)
  } catch (err) {
    next(err)
  }
}

export default router
