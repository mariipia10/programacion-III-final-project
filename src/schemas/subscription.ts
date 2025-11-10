import mongoose, { Schema } from 'mongoose'
import { ISubscription } from '../types/index'

const { ObjectId } = Schema.Types

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: ObjectId, ref: 'User', required: true },
    service: { type: ObjectId, ref: 'Service', required: true },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired', 'pending'],
      default: 'active',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    nextBillingDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema)
export default Subscription
