import { useEffect, useState } from 'react'
import { Box, Card, CardContent, CircularProgress, Stack, Typography, Button } from '@mui/material'
import {
  getMySubscriptions,
  cancelSubscription,
  type Subscription,
} from '../config/api.subscription'
import { useMemo } from 'react'

export default function MySubscriptionsPage() {
  const [loading, setLoading] = useState(true)
  const [subs, setSubs] = useState<Subscription[]>([])
  const [error, setError] = useState<string>('')
  const orderedSubs = useMemo(() => {
    const active = subs.filter((s) => s.status === 'active')

    const canceled = subs
      .filter((s) => s.status === 'canceled')
      .sort((a, b) => {
        const aTime = a.endDate ? new Date(a.endDate).getTime() : 0
        const bTime = b.endDate ? new Date(b.endDate).getTime() : 0
        return bTime - aTime // más recientes primero
      })

    return [...active, ...canceled]
  }, [subs])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getMySubscriptions()
      setSubs(data)
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onCancel(subscriptionId: string) {
    setError('')
    try {
      await cancelSubscription(subscriptionId)
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
        Mis suscripciones
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Stack spacing={2}>
        {subs.length === 0 ? (
          <Typography sx={{ opacity: 0.7 }}>No tenés suscripciones.</Typography>
        ) : (
          orderedSubs.map((sub) => {
            const service = typeof sub.service === 'string' ? null : sub.service

            return (
              <Card key={sub._id}>
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">{service?.name ?? 'Servicio'}</Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Estado: {sub.status}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Inicio: {new Date(sub.startDate).toLocaleDateString()}
                    </Typography>

                    {sub.nextBillingDate && (
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Vence: {new Date(sub.nextBillingDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>

                  {sub.status === 'active' && (
                    <Button variant="outlined" color="error" onClick={() => onCancel(sub._id)}>
                      Dar de baja
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </Stack>
    </Box>
  )
}
