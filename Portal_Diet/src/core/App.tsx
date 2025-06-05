import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './styles/base'
import { AppRouter } from './routes/router'

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
      <AppRouter />
  </ThemeProvider>
)
export { App }