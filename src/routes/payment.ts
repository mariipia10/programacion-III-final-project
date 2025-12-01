import express, { Request, Response, NextFunction } from 'express'
import Payment from '../schemas/payment'
import authentication from '../middlewares/authentication'

const router = express.Router()

router.get('/', getAllPayments)
router.post('/', authentication, createPayment)
router.put('/:id', authentication, updatePayment)
router.get('/:id', authentication, getPaymentById)

async function getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('getAllPayments by user', req.user?._id)
  try {
    const payments = await Payment.find()
    res.send(payments)
  } catch (err) {
    next(err)
  }
}

async function getPaymentById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('getPaymentById:', req.params.id)

  try {
    const payment = await Payment.findById(req.params.id)

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' })
      return
    }

    res.send(payment)
  } catch (err) {
    next(err)
  }
}

async function createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('createPayment body:', req.body)

  try {
    const { subscription, amount, dueDate, paidAt, status, method } = req.body

    if (!subscription || amount === undefined || !dueDate) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const user = req.user
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: admin only' })
      return
    }

    const newPayment = await Payment.create({
      subscription,
      amount,
      dueDate,
      paidAt,
      status: status ?? 'pending',
      method: method?.trim(),
    })

    res.status(201).json(newPayment)
  } catch (err) {
    next(err)
  }
}
async function updatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('updatePayment:', req.params.id, req.body)

  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      res.status(404).json({ error: 'Payment not found' })
      return
    }

    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
}

export default router
