import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from '../context/UserContext'
import Login from '../pages/Login'
import Home from '../pages/Home'

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
