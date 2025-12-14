// src/routes/service.ts
import express, { Request, Response, NextFunction } from 'express'
import Service from '../schemas/service'
import authentication from '../middlewares/authentication'
import { JWTPayload } from '@/types'

const router = express.Router()

router.get('/', getAllServices)
router.post('/', authentication, createService)

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

export default router
