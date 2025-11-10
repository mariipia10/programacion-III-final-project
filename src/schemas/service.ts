// src/models/service.model.ts
import mongoose, { Schema } from 'mongoose'
import { IService } from '../types/index'

//const { ObjectId } = Schema.Types

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['streaming', 'software', 'course', 'other'],
      default: 'other',
    },
    price: { type: Number, required: true, min: 0 },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Service = mongoose.model<IService>('Service', serviceSchema)
export default Service
