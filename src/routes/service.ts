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
    const { name, description, price } = req.body

    if (
      !name ||
      typeof name !== 'string' ||
      !description ||
      typeof description !== 'string' ||
      price === undefined ||
      typeof price !== 'number'
    ) {
      res.status(400).json({ error: 'Invalid input data' })
      return
    }

    const user = req.user
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: admin only' })
      return
    }

    const newService = await Service.create({
      name: name.trim(),
      description: description.trim(),
      price,
      // si más adelante querés volver a createdBy, acá lo agregás
      // createdBy: user._id,
    })

    res.status(201).send(newService)
  } catch (err) {
    next(err)
  }
}

export default router
