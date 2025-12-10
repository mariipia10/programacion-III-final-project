import { Box, Button, Container, TextField, Typography, Paper, Link } from '@mui/material'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Ingrese un correo válido').required('El correo es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria'),
})

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUser()

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          Iniciar sesión
        </Typography>

        {/* ...dentro del JSX de Login... */}
        <p style={{ marginTop: 16 }}>
          ¿No tenés cuenta?{' '}
          <Link component={RouterLink} to="/register">
            Registrate
          </Link>
        </p>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await login(values.email, values.password)
              navigate('/')
            } catch (error: unknown) {
              let message = 'Credenciales inválidas'
              if (error instanceof Error) {
                message = error.message || message
              } else if (typeof error === 'string') {
                message = error
              }
              setErrors({
                password: message,
              })
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ errors, touched, isSubmitting, handleChange }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Correo electrónico"
                  name="email"
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                />

                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  fullWidth
                />

                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  )
}
