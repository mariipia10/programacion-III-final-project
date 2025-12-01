// src/routes/service.ts
import express, { Request, Response, NextFunction } from 'express'
import Service from '../schemas/service'
import authentication from '../middlewares/authentication'

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

  try {
    const { provider, name, description, price, currency, billingPeriod, isActive } = req.body

    // Validaciones
    if (!provider || !name || !description || price === undefined || !currency || !billingPeriod) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const user = req.user
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: admin only' })
      return
    }

    const newService = await Service.create({
      provider,
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
