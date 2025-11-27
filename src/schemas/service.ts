import mongoose, { Schema } from 'mongoose'
import { IService } from '../types'

const { ObjectId } = Schema.Types

const serviceSchema = new Schema<IService>(
  {
    provider: { type: ObjectId, ref: 'Provider', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true },
    billingPeriod: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Service = mongoose.model<IService>('Service', serviceSchema)
export default Service
