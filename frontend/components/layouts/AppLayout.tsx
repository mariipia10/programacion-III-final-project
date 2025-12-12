import React from 'react'
import { Box } from '@mui/material'
import AppNavbar from './Navbar'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', width: '100%' }}>
      <AppNavbar />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1200 }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default AppLayout
