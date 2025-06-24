import React, { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Collapse,
} from "@mui/material"
import { Visibility, VisibilityOff, Mail, Lock, Person } from "@mui/icons-material"
import { authService } from '../../service/user.service'
import { Link, useNavigate } from 'react-router'
import { Link as RouterLink } from 'react-router'


export const LoginRegisterSplit = () => {
  const [tab, setTab] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estados individuais para login
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  // Estados individuais para registro
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (userName) {
      localStorage.setItem("loginName", userName)
    } else {
      localStorage.removeItem("loginName")
    }
  }, [userName])

  // Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await authService.login({ userName, password })
      if (response?.token) {
        localStorage.setItem("token", response.token)
        navigate("/homePage")
      } else {
        setError("Nome ou senha incorretos")
      }
    } catch {
      setError("Nome ou senha incorretos")
    } finally {
      setIsLoading(false)
    }
  }

  // Validação simples para registro
  const validate = () => {
    if (!name || !email || !registerPassword) {
      setError("Preencha todos os campos!")
      return false
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Informe um e-mail válido!")
      return false
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(registerPassword)) {
      setError(
        "A senha deve conter ao menos 8 caracteres, incluindo letras e números."
      )
      return false
    }

    if (registerPassword !== confirmPassword) {
      setError("As senhas não coincidem.")
      return false
    }

    setError("")
    return true
  }

  // Registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await authService.register({ userName: name, email, password: registerPassword })
      localStorage.setItem("token", response.token)

      await new Promise((r) => setTimeout(r, 3000))

      setSuccess("Usuário registrado com sucesso!")
      setName("")
      setEmail("")
      setRegisterPassword("")
      setConfirmPassword("")
      navigate("/homePage")
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erro ao registrar usuário!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        background: "linear-gradient(to bottom right, #e0f7fa, #fce4ec)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(to right, #5c6bc0, #26c6da)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tab === 0 ? "Acesse sua conta" : "Crie sua conta gratuita"}
          </Typography>
        </Box>

        <Card elevation={6} sx={{ backdropFilter: "blur(8px)", borderRadius: 2 }}>
          <CardHeader
            title={
              <Tabs
                value={tab}
                onChange={(_, newValue) => setTab(newValue)}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Entrar" />
                <Tab label="Registrar" />
              </Tabs>
            }
            sx={{ p: 0, backgroundColor: "rgba(0,0,0,0.03)" }}
          />

          <CardContent>
            {/* Mostrar erros e sucessos */}
            {error && (
              <Typography color="error" mb={2} textAlign="center">
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="primary" mb={2} textAlign="center">
                {success}
              </Typography>
            )}

            <Collapse in={tab === 0} timeout={400} unmountOnExit>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Nome de usuário"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />
                <TextField
                  label="Senha"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />

                <Box mt={1} textAlign="center" color="primary">
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      Esqueceu sua senha?
                    </Typography>
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    background: "linear-gradient(to right, #5c6bc0, #26c6da)",
                    color: "white",
                    fontWeight: 500,
                    py: 1.5,
                  }}
                >
                  {isLoading ? "Carregando..." : "Entrar"}
                </Button>
              </form>
            </Collapse>

            <Collapse in={tab === 1} timeout={400} unmountOnExit>
              <form onSubmit={handleRegister}>
                <TextField
                  label="Nome Completo"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />
                <TextField
                  label="Senha"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  type={showPassword ? "text" : "password"}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />
                <TextField
                  label="Confirmar Senha"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    background: "linear-gradient(to right, #26c6da, #5c6bc0)",
                    color: "white",
                    fontWeight: 500,
                    py: 1.5,
                  }}
                >
                  {isLoading ? "Carregando..." : "Criar Conta"}
                </Button>
              </form>
            </Collapse>
          </CardContent>
        </Card>

        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Ao continuar, você concorda com nossos{" "}
            <Box component="span" color="primary.main" fontWeight="medium">
              Termos de Uso
            </Box>{" "}
            e{" "}
            <Box component="span" color="primary.main" fontWeight="medium">
              Política de Privacidade
            </Box>
            .
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
