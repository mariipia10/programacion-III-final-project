import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { getServices } from '../config/api.services'
import {
  createSubscription,
  getMySubscriptions,
  cancelSubscription,
  type Subscription,
} from '../config/api.subscription'

type Service = {
  _id: string
  name: string
  description?: string
  price: number
  currency: string
  billingPeriod: 'monthly' | 'yearly'
  isActive: boolean
}

export default function ClientServicesPage() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [subs, setSubs] = useState<Subscription[]>([])
  const [error, setError] = useState<string>('')

  const activeSubByServiceId = useMemo(() => {
    const map = new Map<string, Subscription>()
    for (const sub of subs) {
      const serviceId = typeof sub.service === 'string' ? sub.service : sub.service?._id
      if (sub.status === 'active' && serviceId) map.set(serviceId, sub)
    }
    return map
  }, [subs])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [servicesRes, subsRes] = await Promise.all([getServices(), getMySubscriptions()])
      setServices((servicesRes as Service[]).filter((s) => s.isActive !== false))
      setSubs(subsRes)
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubscribe(serviceId: string) {
    setError('')
    try {
      await createSubscription({ serviceId, autoRenew: true })
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Error')
    }
  }

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
        Servicios disponibles
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Stack spacing={2}>
        {services.map((service) => {
          const activeSub = activeSubByServiceId.get(service._id)

          return (
            <Card key={service._id}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box>
                  <Typography variant="h6">{service.name}</Typography>
                  {!!service.description && (
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      {service.description}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    {service.currency} {service.price} / {service.billingPeriod}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {activeSub ? (
                    <Button variant="outlined" onClick={() => onCancel(activeSub._id)}>
                      Dar de baja
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={() => onSubscribe(service._id)}>
                      Suscribirme
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </Box>
  )
}
