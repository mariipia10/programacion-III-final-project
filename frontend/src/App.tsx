import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from '../context/UserContext'
import Login from '../pages/Login'
import PrivateRoute from '../routes/PrivateRoute'
import Home from '../pages/Home'
import AppLayout from '../components/layouts/AppLayout'
import RegisterPage from '../pages/RegisterPage'
import AdminCreateServicePage from '../pages/AdminCreateServicePage'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* protegidas */}
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
              <PrivateRoute>
                <AppLayout>
                  <AdminCreateServicePage />
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
