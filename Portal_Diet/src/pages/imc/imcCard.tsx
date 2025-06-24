import { ThemeProvider, CssBaseline, Container, Typography, Box, Button, createTheme } from '@mui/material'
import { IMCCalculator } from './imcCalculator'
import { useNavigate } from 'react-router'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    },
    background: {
      default: '#f5f5f5'
    }
  }
})

export const ImcPage = () => {
  const navigate = useNavigate()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          py: 5,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2, #3f51b5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Calculadora de IMC
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }}
            >
              Calcule seu Índice de Massa Corporal de forma rápida e descubra se seu peso está dentro da faixa ideal para sua altura.
            </Typography>
          </Box>

          <IMCCalculator />
          <Box textAlign="center" mt={4}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/homePage')}
            >
              Página inicial
            </Button>
          </Box>
        </Container>


      </Box>
    </ThemeProvider>
  )
}
