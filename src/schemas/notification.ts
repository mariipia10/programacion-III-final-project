import mongoose, { Schema } from 'mongoose'
import { INotification } from '../types/index'

const { ObjectId } = Schema.Types

const notificationSchema = new Schema<INotification>(
  {
    user: { type: ObjectId, ref: 'User', required: true },
    subscription: { type: ObjectId, ref: 'Subscription', required: true },
    type: {
      type: String,
      enum: ['renewal_reminder', 'payment_failed', 'generic'],
      default: 'generic',
    },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

const Notification = mongoose.model<INotification>('Notification', notificationSchema)
export default Notification
