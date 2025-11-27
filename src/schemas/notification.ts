import mongoose, { Schema } from 'mongoose'
import { INotification } from '../types'

const { ObjectId } = Schema.Types

const notificationSchema = new Schema<INotification>(
  {
    user: { type: ObjectId, ref: 'User', required: true },

    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    subscription: { type: ObjectId, ref: 'Subscription' },
    payment: { type: ObjectId, ref: 'Payment' },
  },
  { timestamps: true },
)

const Notification = mongoose.model<INotification>('Notification', notificationSchema)
export default Notification
