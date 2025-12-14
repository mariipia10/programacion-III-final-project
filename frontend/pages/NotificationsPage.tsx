import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Chip,
  Button,
} from '@mui/material'
import { useUser } from '../context/UserContext'
import {
  getNotifications,
  markNotificationRead,
  type Notification,
} from '../config/api.notifications'

function formatDDMMYYYY(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function getTypeChip(type?: string) {
  switch (type) {
    case 'subscription_created':
      return { label: 'Alta', color: 'success' as const }
    case 'subscription_canceled':
      return { label: 'Cancelada', color: 'error' as const }
    case 'subscription_expired':
      return { label: 'Vencida', color: 'warning' as const }
    case 'renewal_due_soon':
      return { label: 'Próximo venc.', color: 'warning' as const }
    case 'system':
      return { label: 'Sistema', color: 'info' as const }
    default:
      return { label: 'Info', color: 'default' as const }
  }
}

export default function NotificationsPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Notification[]>([])
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getNotifications()
      setItems(data)
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    load()
  }, [user?._id])

  const ordered = useMemo(() => {
    // no leídas primero, y dentro de eso más nuevas primero
    return [...items].sort((a, b) => {
      const ar = a.isRead ? 1 : 0
      const br = b.isRead ? 1 : 0
      if (ar !== br) return ar - br
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bt - at
    })
  }, [items])

  const onMarkRead = async (id: string) => {
    setError('')
    try {
      await markNotificationRead(id)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Error')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Notificaciones
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {ordered.length === 0 ? (
        <Typography sx={{ opacity: 0.8 }}>No tenés notificaciones por el momento.</Typography>
      ) : (
        <Stack spacing={2}>
          {ordered.map((n) => {
            const typeChip = getTypeChip(n.type)
            const isUnread = n.isRead === false

            return (
              <Card key={n._id} sx={{ opacity: isUnread ? 1 : 0.85 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1">{n.title}</Typography>
                      <Chip
                        size="small"
                        label={typeChip.label}
                        color={typeChip.color}
                        variant="outlined"
                      />
                      {isUnread && <Chip size="small" label="Nueva" color="primary" />}
                    </Box>

                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                      {n.message}
                    </Typography>

                    {n.createdAt && (
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatDDMMYYYY(n.createdAt)}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {!n.isRead && (
                      <Button variant="outlined" size="small" onClick={() => onMarkRead(n._id)}>
                        Marcar leída
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
