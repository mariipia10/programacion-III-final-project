import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { useUser } from '../context/UserContext'

const Home: React.FC = () => {
  const { user } = useUser()

  if (!user) return null // por seguridad, aunque PrivateRoute ya lo filtra

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 3, minWidth: 320 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Bienvenido 👋
        </Typography>

        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>

        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Rol logueado:</strong> {user.role}
        </Typography>
      </Paper>
    </Box>
  )
}

export default Home
