import React, { useMemo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import type { Role } from '../../types/User'

type MenuItemConfig = {
  label: string
  path: string
  roles: Role[]
}

const MENU_ITEMS: MenuItemConfig[] = [
  { label: 'Dashboard', path: '/', roles: ['admin'] },
  { label: 'Usuarios', path: '/admin/users', roles: ['admin'] },
  { label: 'Servicios', path: '/admin/services/new', roles: ['admin', 'provider'] },
  {
    label: 'Subscripciones de mis servicios',
    path: '/provider/subscriptions',
    roles: ['provider'],
  },
  { label: 'Mis suscripciones', path: '/subscriptions', roles: ['client'] },
  {
    label: 'Historial de pagos',
    path: '/payments',
    roles: ['admin', 'provider', 'client'],
  },
  {
    label: 'Notificaciones',
    path: '/notifications',
    roles: ['admin', 'provider', 'client'],
  },
]

const AppNavbar: React.FC = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  if (!user) return null

  const role: Role = user.role
  const visibleItems = useMemo(() => MENU_ITEMS.filter((item) => item.roles.includes(role)), [role])

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        px: 3,
        pt: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}
    >
      {/* IZQUIERDA */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Gestión de Suscripciones
        </Typography>
        <Typography variant="body2">
          {user.email} | Rol: {role}
        </Typography>
      </Box>

      {/* DERECHA */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {visibleItems.map((item) => (
          <Button
            key={item.path}
            color="primary"
            size="small"
            onClick={() => navigate(item.path)}
            sx={{ textTransform: 'none' }}
          >
            {item.label}
          </Button>
        ))}

        <Button
          color="inherit"
          size="small"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  )
}

export default AppNavbar
