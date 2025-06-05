import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { authService } from '../../service/user.service'
import { useNavigate, Link as RouterLink } from 'react-router'

export const Login = () => {
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
    } catch (error) {
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
        backgroundImage: 'url(src/assets/network-4348668_1280.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 300,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 3,
          boxShadow: 3,
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
        }}
      >
        <PersonOutlinedIcon sx={{ fontSize: 40, alignSelf: 'center', color: '#1976d2' }} />

        <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', color: '#222' }}>
          Sign in
        </Typography>

        {error && (
          <Typography variant="body2" sx={{ color: 'red', textAlign: 'center', marginBottom: 2 }}>
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
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
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
          sx={{ marginTop: 2, backgroundColor: '#1976d2', color: '#fff' }}
        >
          Enter
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 2 }}>
          Não tem uma conta?{' '}
          <RouterLink to="/register" style={{ color: '#1976d2', fontWeight: 'bold' }}>
            Cadastre-se
          </RouterLink>
        </Typography>
      </Box>
    </Box>
  )
}
