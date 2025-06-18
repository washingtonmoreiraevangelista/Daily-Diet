import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { useNavigate, useLocation, Link as RouterLink } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { forgotPassword } from '../../service/forgotPassword.service'
import { Visibility, VisibilityOff } from "@mui/icons-material"

export const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get("token")

  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return showMessage("As senhas não coincidem.", "error")
    }

    if (!token) {
      return showMessage("Token inválido ou ausente.", "error")
    }

    setLoading(true)
    try {
      const response = await forgotPassword.postResetPassword(token, password)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao redefinir senha.")
      }

      showMessage("Senha redefinida com sucesso!", "success")
      setTimeout(() => navigate("/login"), 2000)

    } catch (err: any) {
      showMessage(err.message || "Erro inesperado.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Redefinir Senha
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Nova Senha"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                label="Confirmar Senha"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        </CardContent>

        <Button
          component={RouterLink}
          to="/"
          variant="text"
          startIcon={<ArrowLeft size={20} />}
          fullWidth
        >
          Voltar ao início
        </Button>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
