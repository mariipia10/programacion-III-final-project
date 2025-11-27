import mongoose, { Schema } from 'mongoose'
import { IProvider } from '../types/index'

const providerSchema = new Schema<IProvider>(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Provider = mongoose.model<IProvider>('Provider', providerSchema)
export default Provider
