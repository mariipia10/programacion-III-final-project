import { Request, Response, NextFunction } from 'express'

// Extend Express Request interface
interface AuthenticatedRequest extends Request {
  isAdmin(): boolean
  isClient(): boolean
  isProvider(): boolean
}

function authorization(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest

  authReq.isAdmin = function isAdmin(): boolean {
    return !!(authReq.user && authReq.user.role === 'admin')
  }

  authReq.isClient = function isClient(): boolean {
    return !!(authReq.user && authReq.user.role === 'client')
  }
  authReq.isProvider = function isProvider(): boolean {
    return !!(authReq.user && authReq.user.role === 'provider')
  }

  return next()
}

export default authorization
