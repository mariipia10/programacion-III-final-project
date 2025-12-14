// src/routes/service.ts
import express, { Request, Response, NextFunction } from 'express'
import Service from '../schemas/service'
import authentication from '../middlewares/authentication'
import { JWTPayload } from '@/types'
import Subscription from '../schemas/subscription'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/', getAllServices)
router.post('/', authentication, createService)
router.get('/mine', authentication, getMyServices)
router.get('/:id/subscribers', authentication, getServiceSubscribers)

async function getAllServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('getAllServices by user', req.user?._id)
  try {
    const services = await Service.find()
    res.send(services)
  } catch (err) {
    next(err)
  }
}

async function createService(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('createService body:', req.body)
  console.log('role:', (req.user as any)?.role, 'provider:', (req.user as any)?.provider)

  try {
    const { name, description, price, currency, billingPeriod, isActive } = req.body

    const user = req.user as JWTPayload | undefined
    console.log('createService user:', user)

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (user.role !== 'admin' && user.role !== 'provider') {
      res.status(403).json({ error: 'Forbidden: admin/provider only' })
      return
    }

    const providerId = user.role === 'provider' ? user.provider : req.body.provider

    if (
      !providerId ||
      !name ||
      !description ||
      price === undefined ||
      !currency ||
      !billingPeriod
    ) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const newService = await Service.create({
      provider: providerId,
      name: name.trim(),
      description: description.trim(),
      price,
      currency: currency.trim(),
      billingPeriod,
      isActive: isActive ?? true,
    })

    res.status(201).json(newService)
  } catch (err) {
    next(err)
  }
}
async function getMyServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user as JWTPayload | undefined

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (user.role !== 'provider') {
      res.status(403).json({ error: 'Forbidden: provider only' })
      return
    }

    if (!user.provider) {
      res.status(400).json({ error: 'Provider not linked to user' })
      return
    }

    const services = await Service.find({ provider: user.provider })

    const servicesWithSubscribers = await Promise.all(
      services.map(async (service) => {
        const subscribersCount = await Subscription.countDocuments({
          service: service._id,
          status: 'active',
        })

        return {
          ...service.toObject(),
          subscribersCount,
        }
      }),
    )

    res.json(servicesWithSubscribers)
  } catch (err) {
    next(err)
  }
}
async function getServiceSubscribers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user as JWTPayload | undefined
    const { id } = req.params

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid service id' })
      return
    }

    const service = await Service.findById(id)
    if (!service) {
      res.status(404).json({ error: 'Service not found' })
      return
    }

    if (user.role === 'provider') {
      if (!user.provider) {
        res.status(400).json({ error: 'Provider not linked to user' })
        return
      }

      if (service.provider.toString() !== user.provider.toString()) {
        res.status(403).json({ error: 'Forbidden: not owner of this service' })
        return
      }
    } else if (user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    const subscriptions = await Subscription.find({
      service: service._id,
      status: 'active',
    })
      .populate('user', 'email name')
      .sort({ createdAt: -1 })

    res.json({
      service: {
        _id: service._id,
        name: service.name,
      },
      totalActive: subscriptions.length,
      subscriptions,
    })
  } catch (err) {
    next(err)
  }
}

export default router
