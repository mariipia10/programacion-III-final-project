import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import type { JSX } from 'react'
import React from 'react'

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useUser()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
