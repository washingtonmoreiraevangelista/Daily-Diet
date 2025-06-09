import { Box, useTheme, useMediaQuery } from '@mui/material'
import { Register } from './registre'
import { Login } from './login'
import  dietImage from '../../assets/diet.png'

export const LoginRegisterSplit = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Box
        sx={{
          flex: isMobile ? 'none' : '0 0 55%',
          width: isMobile ? '100%' : 'auto',
          borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
          overflowY: 'auto',
        }}
      >
        <Register />
      </Box>

      <Box
        sx={{
          flex: isMobile ? 'none' : '0 0 45%',
          width: isMobile ? '100%' : 'auto',
          overflowY: 'auto',
          backgroundImage: `url(${dietImage})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}

      >
        <Login />
      </Box>
    </Box>
  )
}
