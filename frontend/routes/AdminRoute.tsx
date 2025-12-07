import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import type { JSX } from 'react'
import React from 'react'

const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useUser()

  if (loading) return null

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
