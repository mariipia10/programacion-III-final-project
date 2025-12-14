import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import User from '../schemas/user'
import Role from '../schemas/role'
import { CreateUserRequest } from '../types/index'
import Provider from '../schemas/provider'

const router = express.Router()
router.post('/', createUser)

function toDate(input: string): Date {
  const parts = input.split('/')
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Expected DD/MM/YYYY')
  }
  const [day, month, year] = parts
  if (!day || !month || !year) {
    throw new Error('Invalid date format. Expected DD/MM/YYYY')
  }
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

async function createUser(
  req: Request<Record<string, never>, unknown, CreateUserRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('createUser: ', req.body)

  const user = req.body

  try {
    const role = await Role.findOne({ name: user.role })
    if (!role) {
      res.status(404).send('Role not found')
      return
    }

    let providerId: string | undefined

    if (user.role === 'provider') {
      if (user.provider && mongoose.isValidObjectId(user.provider)) {
        providerId = user.provider
      } else {
        const providerName =
          (user as any).providerName?.trim() ||
          (typeof user.provider === 'string' ? user.provider.trim() : '') ||
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

        if (!providerName) {
          res.status(400).send('Provider name is required for provider users')
          return
        }

        const provider = await Provider.create({
          name: providerName,
          isActive: true,
        })

        providerId = provider._id.toString()
      }
    }

    const passEncrypted = await bcrypt.hash(user.password, 10)

    const userCreated = await User.create({
      ...user,
      bornDate: user.bornDate ? toDate(user.bornDate.toString()) : undefined,
      password: passEncrypted,
      role: role._id,
      provider: user.role === 'provider' ? providerId : undefined,
    })

    res.status(201).send(userCreated)
  } catch (err) {
    next(err)
  }
}

export { createUser }
export default router
