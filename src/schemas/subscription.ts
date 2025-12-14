import mongoose, { Schema } from 'mongoose'
import { ISubscription } from '../types'

const { ObjectId } = Schema.Types

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: ObjectId, ref: 'User', required: true },
    service: { type: ObjectId, ref: 'Service', required: true },

    status: {
      type: String,
      enum: ['active', 'paused', 'canceled', 'expired'],
      default: 'active',
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date },

    autoRenew: { type: Boolean, default: true },
    nextBillingDate: { type: Date },
  },
  { timestamps: true },
)

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema)
export default Subscription
