import { useEffect, useState } from "react"
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import { LogIn, Eye, EyeOff } from "lucide-react"
import { authService } from "../../service/user.service"
import { useNavigate } from 'react-router'
import { Link as RouterLink } from 'react-router'



export const LoginForm = () => {
  const [userName, setuserName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (userName) {
      localStorage.setItem("loginName", userName)
    } else {
      localStorage.removeItem("loginName")
    }
  }, [userName])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await authService.login({ userName, password })
      if (response?.token) {
        localStorage.setItem("token", response.token)
        // Pode usar rememberMe para persistência adicional se quiser
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 360,
        mx: "auto",
        p: 4,
        bgcolor: "rgba(255,255,255,0.1)",
        borderRadius: 2,
        boxShadow: 3,
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom>
        Bem Nutrido
      </Typography>

      {error && (
        <Typography
          variant="body2"
          color="error"
          textAlign="center"
          sx={{ mb: 1, fontWeight: "bold" }}
        >
          {error}
        </Typography>
      )}

      <TextField
        label="Usuario"
        value={userName}
        onChange={(e) => setuserName(e.target.value)}
        required
        fullWidth
        autoComplete="username"
        sx={{ borderRadius: 2 }}
      />

      <TextField
        label="Senha"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="current-password"
        sx={{ borderRadius: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        }
        label="Lembrar de mim"
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{ cursor: "pointer" }}
        >
          Esqueci a senha
        </Link>
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 1.5,
          borderRadius: 3,
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
          "&:hover": {
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
          },
        }}
      >
        {isLoading ? (
          <Typography variant="body1">Entrando...</Typography>
        ) : (
          <>
            <LogIn size={20} />
            <Typography variant="body1">Entrar</Typography>
          </>
        )}
      </Button>
    </Box>
  )
}
