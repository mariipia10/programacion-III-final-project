// routes/register.ts
import { Router, Request, Response, NextFunction } from 'express'
import { createUser } from './user'

const router = Router()

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  return createUser(req as any, res, next)
})

export default router
