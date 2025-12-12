import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import type { JSX } from 'react'
import React from 'react'

type Role = 'admin' | 'provider' | 'client'

const PrivateRoute: React.FC<{
  children: JSX.Element
  allowed?: Role[]
  redirectTo?: string
}> = ({ children, allowed, redirectTo = '/' }) => {
  const { user, loading } = useUser()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (allowed && !allowed.includes(user.role as Role)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default PrivateRoute
