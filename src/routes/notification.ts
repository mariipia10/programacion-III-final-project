// src/routes/notification.ts
import express, { Request, Response, NextFunction } from 'express'
import Notification from '../schemas/notification'
import authentication from '../middlewares/authentication'

const router = express.Router()

router.get('/', authentication, getUserNotifications)
router.post('/', authentication, createNotification)

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
    const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 })
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

export default router
