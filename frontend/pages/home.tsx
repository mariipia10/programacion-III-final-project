import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Chip,
} from '@mui/material'
import { useUser } from '../context/UserContext'

const Home: React.FC = () => {
  const { user } = useUser()

  if (!user) return null

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 720,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Bienvenido
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
              Panel principal de la plataforma
            </Typography>
          </Box>

          <Divider />

          {/* Info del usuario */}
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Email
              </Typography>
              <Typography variant="body2">{user.email}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Rol
              </Typography>
              <Chip
                size="small"
                label={user.role}
                variant="outlined"
                color="primary"
              />
            </Box>
          </Stack>

          <Divider />

          {/* Mensaje contextual por rol */}
          <Box>
            {user.role === 'admin' && (
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Desde acá podés administrar usuarios, servicios y monitorear la actividad del sistema.
              </Typography>
            )}

            {user.role === 'provider' && (
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Desde este panel podés crear servicios y gestionar las suscripciones de tus clientes.
              </Typography>
            )}

            {user.role === 'client' && (
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Desde este panel podés ver y administrar tus suscripciones activas.
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Home
