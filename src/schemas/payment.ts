import mongoose, { Schema } from 'mongoose'
import { IPayment } from '../types/index'

const { ObjectId } = Schema.Types

const paymentSchema = new Schema<IPayment>(
  {
    subscription: { type: ObjectId, ref: 'Subscription', required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ['paid', 'failed', 'pending'],
      default: 'pending',
    },
    method: { type: String, trim: true },
  },
  { timestamps: true },
)

const Payment = mongoose.model<IPayment>('Payment', paymentSchema)
export default Payment
