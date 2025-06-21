import React, { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { authService } from '../../service/user.service'
import { useNavigate } from 'react-router'

export const RegisterForm = () => {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()


  const validate = () => {
    if (!userName || !email || !password) {
      setError("Preencha todos os campos!")
      return false
    }

    // if (userName.trim().split(" ").length < 2) {
    //   setError("Informe seu usuário completo!")
    //   return false
    // }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Informe um e-mail válido!")
      return false
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setError(
        "A senha deve conter ao menos 8 caracteres, incluindo letras e números."
      )
      return false
    }

    setError("")
    return true
  }

  const handleRegister = async () => {
    if (!validate()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await authService.register({ userName, email, password })
      localStorage.setItem("token", response.token)

      await new Promise((r) => setTimeout(r, 3000))

      setSuccess("Usuário registrado com sucesso!")
      setUserName("")
      setEmail("")
      setPassword("")
      navigate('/homepage')
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erro ao registrar usuário!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleRegister()
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 360,
        mx: "auto",
        mt: 6,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight="medium">
        Cadastro
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        label="Usuario"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
        fullWidth
        autoComplete="name"
        disabled={isLoading}
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
        disabled={isLoading}
      />

      <TextField
        label="Senha"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="new-password"
        disabled={isLoading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={isLoading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        startIcon={<PersonAddIcon />}
        sx={{
          py: 1.5,
          fontWeight: "medium",
          textTransform: "none",
          borderRadius: 3,
          bgcolor: " #2f855a",
        }}
      >
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </Box>
  )
}
