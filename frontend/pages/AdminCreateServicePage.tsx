import { FormEvent, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Stack,
} from '@mui/material'
import { createService } from '../config/api.services'
import { useUser } from '../context/UserContext'

export default function AdminCreateServicePage() {
  const { user } = useUser()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<string>('')
  const [currency, setCurrency] = useState('USD')
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [isActive, setIsActive] = useState(true)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      setLoading(true)

      await createService({
        provider: user.provider,
        name,
        description,
        price: Number(price),
        currency,
        billingPeriod,
        isActive,
      })

      setSuccess('Servicio creado correctamente')
      setName('')
      setDescription('')
      setPrice('')
      setCurrency('USD')
      setBillingPeriod('monthly')
      setIsActive(true)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al crear servicio')
    } finally {
      setLoading(false)
    }
  }

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
          p: { xs: 2.5, sm: 4 },
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Alta de Servicio
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
              Completá los datos para crear un nuevo servicio.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                multiline
                minRows={3}
              />

              <TextField
                label="Precio"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                required
                inputProps={{ min: 0, step: '0.01' }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="currency-label">Moneda</InputLabel>
                  <Select
                    labelId="currency-label"
                    label="Moneda"
                    value={currency}
                    onChange={(e) => setCurrency(String(e.target.value))}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="ARS">ARS</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="billing-label">Periodo</InputLabel>
                  <Select
                    labelId="billing-label"
                    label="Periodo"
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(String(e.target.value))}
                  >
                    <MenuItem value="monthly">Mensual</MenuItem>
                    <MenuItem value="yearly">Anual</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControlLabel
                control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                label="Activo"
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  {loading ? 'Creando...' : 'Crear servicio'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
