import { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getServiceSubscribers, type ServiceSubscribersResponse } from '../config/api.services'

function formatDDMMYYYY(dateStr?: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export default function ProviderServiceSubscribersPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState<ServiceSubscribersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)

    getServiceSubscribers(id)
      .then(setData)
      .catch((e) => setError(e?.response?.data?.error || e?.message || 'Error'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{error}</Typography>
  if (!data) return <Typography>No data</Typography>

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4">{data.service.name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Suscriptores activos: {data.totalActive}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate('/provider/services')}
          sx={{ textTransform: 'none' }}
        >
          Volver
        </Button>
      </Stack>

      {data.subscriptions.length === 0 ? (
        <Typography>No hay suscripciones activas para este servicio.</Typography>
      ) : (
        <Stack spacing={2}>
          {data.subscriptions.map((sub) => (
            <Card key={sub._id}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                  <Box>
                    <Typography variant="h6">{sub.user?.email}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Inicio: {formatDDMMYYYY(sub.startDate)} · Próximo cobro:{' '}
                      {formatDDMMYYYY(sub.nextBillingDate)}
                    </Typography>
                  </Box>

                  <Chip label={sub.status} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}
