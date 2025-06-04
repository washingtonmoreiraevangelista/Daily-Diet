import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
// import { AppRouter } from './routes/Router'
import { theme } from './styles/base'

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
      {/* <AppRouter /> */}
  </ThemeProvider>
)
export { App }