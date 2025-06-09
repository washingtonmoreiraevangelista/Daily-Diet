import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
  useTheme,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { authService } from '../../service/user.service'

export const Login = () => {
  const theme = useTheme() // <-- pega o tema
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await authService.login({ name, password })
      if (response?.token) {
        localStorage.setItem('token', response.token)
        navigate('/homePage')
      } else {
        setError('Nome ou senha incorretos')
      }
    } catch {
      setError('Nome ou senha incorretos')
    }
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  return (

    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 300,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 3,
        boxShadow: theme.shadows[5],
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        margin: 'auto',
      }}
    >
      <PersonOutlinedIcon
        sx={{ fontSize: 40, alignSelf: 'center', color: theme.palette.primary.main }}
      />

      <Typography
        variant="h4"
        sx={{ marginBottom: 3, textAlign: 'center', color: '#222' /* ou theme.palette.text.primary */ }}
      >
        Bem Nutrido
      </Typography>

      {error && (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.error.main, textAlign: 'center', marginBottom: 2 }}
        >
          {error}
        </Typography>
      )}

      <TextField
        label="Name"
        variant="outlined"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '14px'
          }
        }}
      />

      <TextField
        label="Password"
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        sx={{
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '14px'
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
          borderRadius: '14px',
        }}
      >
        Enter
      </Button>

    </Box>
  )
}
