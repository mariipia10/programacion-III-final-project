import express, { Request, Response, NextFunction } from 'express'
import Subscription from '../schemas/subscription'
import Service from '../schemas/service'
import authentication from '../middlewares/authentication'

const router = express.Router()

interface CreateSubscriptionRequest {
  serviceId: string
  autoRenew?: boolean
}

// helper para calcular próxima fecha según el billingCycle del servicio
function getNextBillingDate(start: Date, billingCycle: 'monthly' | 'yearly'): Date {
  const next = new Date(start)
  if (billingCycle === 'yearly') {
    next.setFullYear(next.getFullYear() + 1)
  } else {
    next.setMonth(next.getMonth() + 1)
  }
  return next
}

// POST /subscriptions  -> el cliente logueado se suscribe a un servicio
router.post(
  '/',
  authentication,
  async (
    req: Request<Record<string, never>, unknown, CreateSubscriptionRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    console.log('createSubscription body: ', req.body)

    try {
      const { serviceId, autoRenew } = req.body

      if (!serviceId) {
        res.status(400).json({ error: 'serviceId is required' })
        return
      }

      const user = req.user
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      // si tenés helpers en el request:
      if (!req.isClient?.() && user.role !== 'client') {
        res.status(403).json({ error: 'Only clients can subscribe' })
        return
      }

      const service = await Service.findById(serviceId)
      if (!service) {
        res.status(404).json({ error: 'Service not found' })
        return
      }

      // opcional: chequear campo isActive si lo tenés en el schema de Service
      if ((service as any).isActive === false) {
        res.status(400).json({ error: 'Service is inactive' })
        return
      }

      // evitar duplicar suscripción activa al mismo servicio
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
      const billingCycle =
        (service as { billingCycle?: 'monthly' | 'yearly' }).billingCycle || 'monthly'
      const nextBillingDate = getNextBillingDate(startDate, billingCycle)

      const subscription = await Subscription.create({
        user: user._id,
        service: serviceId,
        status: 'active',
        startDate,
        nextBillingDate,
        autoRenew: autoRenew ?? true,
      })

      res.status(201).send(subscription)
    } catch (err) {
      next(err)
    }
  },
)

// GET /subscriptions/me -> ver las suscripciones del usuario logueado
router.get(
  '/me',
  authentication,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('getMySubscriptions by user ', req.user?._id)

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
  },
)

export default router
