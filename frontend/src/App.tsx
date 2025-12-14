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
import NotificationsPage from '../pages/NotificationsPage'
import ProviderMyServicesPage from '../pages/ProviderMyServicesPage.tsx'
import ProviderServiceSubscribersPage from '../pages/ProviderServiceSubscribersPage.tsx'

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
          <Route
            path="/notifications"
            element={
              <PrivateRoute allowed={['admin', 'provider', 'client']} redirectTo="/">
                <AppLayout>
                  <NotificationsPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/provider/services"
            element={
              <PrivateRoute allowed={['provider', 'admin']} redirectTo="/">
                <AppLayout>
                  <ProviderMyServicesPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/provider/services/:id/subscribers"
            element={
              <PrivateRoute allowed={['provider', 'admin']} redirectTo="/">
                <AppLayout>
                  <ProviderServiceSubscribersPage />
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
