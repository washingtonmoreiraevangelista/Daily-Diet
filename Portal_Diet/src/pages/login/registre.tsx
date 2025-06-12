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

export const RegisterForm = () => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    if (!name || !password) {
      setError("Preencha todos os campos!")
      return false
    }

    if (name.trim().split(" ").length < 2) {
      setError("Informe seu nome completo!")
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
      const response = await authService.register({ name, password })
      localStorage.setItem("token", response.token)

      await new Promise((r) => setTimeout(r, 1500))

      setSuccess("Usuário registrado com sucesso!")
      setName("")
      setPassword("")
    } catch (e) {
      setError("Erro ao registrar usuário!")
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
        label="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        autoComplete="name"
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 1.5,
          fontWeight: "medium",
          textTransform: "none",
          borderRadius: 3,
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
          },
        }}
      >
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </Box>
  )
}
