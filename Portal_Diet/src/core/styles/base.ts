import { createTheme, responsiveFontSizes, useTheme } from '@mui/material'

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#88c3b5',       
        contrastText: '#FFF',
      },
      secondary: {
        main: '#c3dbcf',
        contrastText: '#000',
      },
      success: {
        main: '#5c65c0',
        contrastText: '#FFF',
      },
      info: {
        main: '#037196',
        light: '#e5f8ff',
        contrastText: '#FFF',
      },
      error: {
        main: '#d83a31',
        contrastText: '#FFF',
      }
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '0px 12px 15px #00000029',
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          container: {
            height: '100%',
          },
        },
      },
    },
    shape: {
      borderRadius: 0,
    },
  })
)

export { theme, useTheme }