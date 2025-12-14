import mongoose, { Schema } from 'mongoose'
import { INotification } from '../types'

const { ObjectId } = Schema.Types

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    type: {
      type: String,
      enum: [
        'renewal_due_soon',
        'subscription_expired',
        'subscription_canceled',
        'subscription_created',
        'payment_failed',
        'system',
      ],
      default: 'system',
      index: true,
    },

    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    isRead: { type: Boolean, default: false },

    subscription: { type: ObjectId, ref: 'Subscription' },
    payment: { type: ObjectId, ref: 'Payment' },

    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
)

// Evita duplicar el mismo aviso para el mismo vencimiento
notificationSchema.index(
  { user: 1, subscription: 1, type: 1, 'meta.dueDate': 1 },
  { unique: true, sparse: true },
)

notificationSchema.statics.createNotification = function (data: Partial<INotification>) {
  return this.create(data)
}

const Notification = mongoose.model<INotification>('Notification', notificationSchema)
export default Notification
