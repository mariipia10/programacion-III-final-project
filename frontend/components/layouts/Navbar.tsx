import React, { useMemo } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Container, Tooltip, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import type { Role } from '../../types/User'

type MenuItemConfig = {
  label: string
  path: string
  roles: Role[]
  disabled?: boolean
}

const MENU_ITEMS: MenuItemConfig[] = [
  { label: 'Dashboard', path: '/', roles: ['admin'] },
  { label: 'Usuarios', path: '/admin/users', roles: ['admin'], disabled: true },
  { label: 'Servicios', path: '/admin/services/new', roles: ['provider', 'admin'] },
  {
    label: 'Subscripciones de mis servicios',
    path: '/provider/subscriptions',
    roles: ['provider'],
    disabled: true,
  },
  { label: 'Mis suscripciones', path: '/subscriptions', roles: ['client'], disabled: true },
  {
    label: 'Historial de pagos',
    path: '/payments',
    roles: ['admin', 'provider', 'client'],
    disabled: true,
  },
  {
    label: 'Notificaciones',
    path: '/notifications',
    roles: ['admin', 'provider', 'client'],
    disabled: true,
  },
]

const AppNavbar: React.FC = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  if (!user) return null

  const role: Role = user.role
  const visibleItems = useMemo(() => MENU_ITEMS.filter((item) => item.roles.includes(role)), [role])

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        '& .MuiButton-root.Mui-disabled': {
          color: 'rgba(255,255,255,0.45)',
        },
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64, display: 'flex', gap: 2 }}>
          {/* Izquierda */}
          <Box
            sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              Gestión de Suscripciones
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {user.email}
              </Typography>
              <Chip size="small" label={role} variant="outlined" />
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Derecha */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {visibleItems.map((item) => (
              <Tooltip
                key={item.path}
                title={item.disabled ? 'En desarrollo' : ''}
                disableHoverListener={!item.disabled}
              >
                <span>
                  <Button
                    color="inherit"
                    size="small"
                    variant="text"
                    disabled={item.disabled}
                    onClick={() => navigate(item.path)}
                    sx={{ textTransform: 'none' }}
                  >
                    {item.label}
                  </Button>
                </span>
              </Tooltip>
            ))}

            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              sx={{
                textTransform: 'none',
                color: 'common.white',

                // 👇 DISABLED REAL
                '&.MuiButton-root.Mui-disabled': {
                  color: 'rgba(255,255,255,0.45)',
                  cursor: 'not-allowed',
                },

                // hover solo si NO está disabled
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                },
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default AppNavbar
