import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Button,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getMyServices, ProviderService } from '../config/api.services'

export default function ProviderMyServicesPage() {
  const [items, setItems] = useState<ProviderService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)

    getMyServices()
      .then(setItems)
      .catch((e) => setError(e?.response?.data?.error || e?.message || 'Error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Mis servicios
      </Typography>

      {items.length === 0 ? (
        <Typography>No tenés servicios creados todavía.</Typography>
      ) : (
        <Stack spacing={2}>
          {items.map((s) => (
            <Card key={s._id}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                  <Box>
                    <Typography variant="h6">{s.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {s.currency} {s.price} / {s.billingPeriod}
                    </Typography>

                    <Stack direction="row" gap={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label={`Activos: ${s.isActive ? 'Sí' : 'No'}`} />
                      <Chip
                        size="small"
                        label={`Suscriptores activos: ${s.subscribersCount}`}
                        color={s.subscribersCount > 0 ? 'primary' : 'default'}
                      />
                    </Stack>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => navigate(`/provider/services/${s._id}/subscribers`)}
                    sx={{ textTransform: 'none' }}
                  >
                    Ver suscriptores
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}
