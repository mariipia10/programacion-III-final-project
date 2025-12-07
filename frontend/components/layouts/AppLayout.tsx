import React from 'react'
import AppNavbar from './Navbar'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AppNavbar />
      {children}
    </>
  )
}

export default AppLayout
