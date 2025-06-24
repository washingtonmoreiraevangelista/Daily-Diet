import { ThemeProvider, CssBaseline, Container, Typography, Box } from '@mui/material'
import { theme } from '../../core/styles/base'
import { IMCCalculator } from './imcCalculator'

export const ImcPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          py: 4,
          px: 2,
          alignItems: 'center'
        }}
      >
        <Box maxWidth="md" width="100%">
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h2"
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
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              Calcule seu Índice de Massa Corporal de forma rápida e descubra se seu peso está dentro da faixa ideal para sua altura.
            </Typography>
          </Box>
          <IMCCalculator />
        </Box>
      </Box>
    </ThemeProvider>
  )
};

