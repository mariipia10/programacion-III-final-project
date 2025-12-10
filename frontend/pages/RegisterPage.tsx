// src/pages/RegisterPage.tsx
import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import {
  governmentIdTypes,
  type GovernmentIdType,
  createProvider,
  registerUser,
  toBackendDate,
} from '../config/api.registration'
import { useNavigate } from 'react-router-dom'

interface RegisterFormValues {
  accountType: 'client' | 'provider'
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  bornDate: string // YYYY-MM-DD (input date)
  governmentIdType: GovernmentIdType
  governmentIdNumber: string
  providerName?: string
}

const RegisterSchema: Yup.Schema<RegisterFormValues> = Yup.object().shape({
  accountType: Yup.mixed<'client' | 'provider'>()
    .oneOf(['client', 'provider'])
    .required('Seleccioná el tipo de cuenta'),
  firstName: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es obligatorio'),
  lastName: Yup.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .required('El apellido es obligatorio'),
  email: Yup.string().email('Ingrese un correo válido').required('El correo es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
  phone: Yup.string()
    .matches(/^\d+$/, 'Solo se permiten números')
    .required('El teléfono es obligatorio'),
  bornDate: Yup.string().required('La fecha de nacimiento es obligatoria'),
  governmentIdType: Yup.mixed<GovernmentIdType>()
    .oneOf(governmentIdTypes)
    .required('El tipo de documento es obligatorio'),
  governmentIdNumber: Yup.string()
    .min(6, 'El número de documento debe tener al menos 6 caracteres')
    .required('El número de documento es obligatorio'),
  providerName: Yup.string().when('accountType', {
    is: 'provider',
    then: (schema) =>
      schema
        .min(2, 'El nombre del proveedor debe tener al menos 2 caracteres')
        .required('El nombre del proveedor es obligatorio'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

const initialValues: RegisterFormValues = {
  accountType: 'client',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  bornDate: '',
  governmentIdType: 'dni',
  governmentIdNumber: '',
  providerName: '',
}

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 480,
          width: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" mb={2}>
          Crear cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Registrate como usuario común o como proveedor.
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setErrorMsg(null)
            setSuccessMsg(null)

            try {
              const bornDateBackend = toBackendDate(values.bornDate)

              const baseUserPayload = {
                email: values.email.toLowerCase().trim(),
                password: values.password,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: values.phone.trim(),
                bornDate: bornDateBackend,
                governmentId: {
                  type: values.governmentIdType,
                  number: values.governmentIdNumber.trim(),
                },
                isActive: true,
              }

              if (values.accountType === 'client') {
                await registerUser({
                  ...baseUserPayload,
                  role: 'client',
                })

                setSuccessMsg('Usuario registrado correctamente. Ahora podés iniciar sesión.')
              } else {
                const provider = await createProvider({
                  name: values.providerName || `${values.firstName} ${values.lastName}`,
                  contactEmail: values.email.toLowerCase().trim(),
                  isActive: true,
                })

                await registerUser({
                  ...baseUserPayload,
                  role: 'provider',
                  provider: provider._id,
                })

                setSuccessMsg(
                  'Proveedor y usuario registrados correctamente. Ahora podés iniciar sesión.',
                )
              }

              setTimeout(() => {
                navigate('/login')
              }, 1000)
            } catch (error: any) {
              console.error('Error en registro:', error)
              if (error.response?.status === 409) {
                setErrorMsg('Ya existe un usuario con ese correo o documento.')
              } else if (typeof error.response?.data === 'string') {
                setErrorMsg(error.response.data)
              } else {
                setErrorMsg('Ocurrió un error. Intente más tarde.')
              }
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ values, errors, touched, handleChange, isSubmitting }) => (
            <Form noValidate>
              <Box display="flex" flexDirection="column" gap={2}>
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                {successMsg && <Alert severity="success">{successMsg}</Alert>}

                <FormControl component="fieldset">
                  <Typography variant="subtitle2" mb={0.5}>
                    Tipo de cuenta
                  </Typography>
                  <RadioGroup
                    row
                    name="accountType"
                    value={values.accountType}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="client" control={<Radio />} label="Usuario" />
                    <FormControlLabel value="provider" control={<Radio />} label="Proveedor" />
                  </RadioGroup>
                </FormControl>

                <TextField
                  label="Nombre"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  fullWidth
                />

                <TextField
                  label="Apellido"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  fullWidth
                />

                {values.accountType === 'provider' && (
                  <TextField
                    label="Nombre del proveedor"
                    name="providerName"
                    value={values.providerName}
                    onChange={handleChange}
                    error={touched.providerName && Boolean(errors.providerName)}
                    helperText={touched.providerName && errors.providerName}
                    fullWidth
                  />
                )}

                <TextField
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                />

                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  fullWidth
                />

                <TextField
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  fullWidth
                />

                <TextField
                  label="Teléfono"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  fullWidth
                />

                <TextField
                  label="Fecha de nacimiento"
                  name="bornDate"
                  type="date"
                  value={values.bornDate}
                  onChange={handleChange}
                  error={touched.bornDate && Boolean(errors.bornDate)}
                  helperText={touched.bornDate && errors.bornDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Tipo de documento</InputLabel>
                  <Select
                    name="governmentIdType"
                    value={values.governmentIdType}
                    label="Tipo de documento"
                    onChange={handleChange}
                  >
                    {governmentIdTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Número de documento"
                  name="governmentIdNumber"
                  value={values.governmentIdNumber}
                  onChange={handleChange}
                  error={touched.governmentIdNumber && Boolean(errors.governmentIdNumber)}
                  helperText={touched.governmentIdNumber && errors.governmentIdNumber}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  )
}
