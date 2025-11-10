import express from 'express'
import Service from '../schemas/service'
import authentication from '../middlewares/authentication'

const router = express.Router()
console.log('>> services router loaded')

// Crear nuevo servicio (solo admin)
router.post('/', authentication, async (req, res) => {
  try {
    // Validate and sanitize input
    const { name, description, price } = req.body
    if (
      !name ||
      typeof name !== 'string' ||
      !description ||
      typeof description !== 'string' ||
      price === undefined ||
      typeof price !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid input data' })
    }

    // simple inline admin check - adapt to your req.user shape
    const user = req.user
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin only' })
    }

    const sanitizedService = { name: name.trim(), description: description.trim(), price }
    const newService = await Service.create(sanitizedService)
    return res.status(201).json(newService)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
})

// Listar servicios (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
