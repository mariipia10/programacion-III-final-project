import { useState } from 'react'
import AuthProvider from '../context/AuthProvider'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
