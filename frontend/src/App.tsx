import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from '../context/UserContext'
import Login from '../pages/Login'
import PrivateRoute from '../routes/PrivateRoute'
import Home from '../pages/Home'
import AppLayout from '../components/layouts/AppLayout'
import RegisterPage from '../pages/RegisterPage'
import AdminCreateServicePage from '../pages/AdminCreateServicePage'
import ClientServicesPage from '../pages/ClientServicePage'
import SubscriptionListPage from '../pages/SubscriptionListPage'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/services/new"
            element={
              <PrivateRoute allowed={['admin', 'provider']} redirectTo="/">
                <AppLayout>
                  <AdminCreateServicePage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/services"
            element={
              <PrivateRoute allowed={['client']} redirectTo="/">
                <AppLayout>
                  <ClientServicesPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/subscriptions"
            element={
              <PrivateRoute allowed={['client']} redirectTo="/">
                <AppLayout>
                  <SubscriptionListPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
