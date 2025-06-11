import React, { useState } from "react"
import { Box, TextField, Button, Typography, Alert, InputAdornment, IconButton, Link } from "@mui/material"
import type { IUser } from '../../@types'
import { useNavigate} from 'react-router'
import { authService } from '../../service/user.service'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { theme } from '../../core/styles/base'


export const Register = () => {
  const [user, setUser] = useState<IUser>({
    name: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    if (!user.name || !user.password) {
      setError(" Preencha todos os campos!")
      return
    }

    if (user.name.trim().split(" ").length < 2) {
      setError(" Informe seu nome !")
      return
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(user.password)) {
      setError("A senha deve conter ao menos 8 caracteres, incluindo letras e números.")
      return
    }

    try {
      const response = await authService.register(user)
      const token = response.token
      localStorage.setItem('token', token)

      setSuccess("Usuário registrado com sucesso!")
      setUser({ name: "", password: "" })
      setError("")

      setTimeout(() => {
        setSuccess("")
        navigate('/homepage')
      }, 2000)
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 409) {
        setError("Usuário já existe!")
      } else {
        setError("Erro ao registrar usuário!")
      }
    }
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleRegister()
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
        background: `linear-gradient(
      135deg,
      #a8e6cf,   /* verde claro */
      #f8bbd0,   /* rosa claro */
      #ffffff,   /* branco */
      #fff9c4,   /* amarelo claro */
      #ffe0b2,   /* laranja claro */
      #bbdefb    /* azul claro */
    )`,
        // backgroundImage: `url(${dietImage})`,
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
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: 4,
          boxShadow: theme.shadows[5],
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
        }}
      >
        <Typography variant="h5" textAlign="center">
          Cadastro !
        </Typography>

        <TextField
          label="Nome de usuário"
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
          sx={{
            marginBottom: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px'
            }
          }}
        />

        <TextField
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={user.password}
          onChange={handleChange}
          variant="outlined"
          fullWidth
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

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
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
          Registrar
        </Button>
      </Box>
    </Box>
  )
}
