import { useState } from "react"
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Link,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material"
import { CheckCircle, Mail, ArrowLeft } from "lucide-react"
import { Link as RouterLink, useNavigate } from "react-router"
import { forgotPassword } from "../../service/forgotPassword.service"

export const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      await forgotPassword.postForgotPassword(email)
      setMessage("E-mail de redefinição enviado com sucesso!")
      setError("")
      setSuccess("success")
      setIsEmailSent(true)
      setTimeout(() => {
        setSuccess("")
        navigate("/")
      }, 5000)
    } catch (erro: any) {
      setError("Erro ao enviar solicitação. Tente novamente.")
      setMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.default"
        p={2}
      >
        <Paper
          sx={{
            maxWidth: 400,
            width: "100%",
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              bgcolor: "success.light",
              borderRadius: "50%",
              width: 64,
              height: 64,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <CheckCircle size={36} color="#2e7d32" />
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Email Enviado!
          </Typography>

          <Typography variant="body1" mb={3}>
            Enviamos um link para redefinição de senha para{" "}
            <strong>{email}</strong>
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              bgcolor: "info.light",
              borderColor: "info.main",
              p: 2,
              mb: 3,
              textAlign: "left",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Próximos passos:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              1. Verifique sua caixa de entrada
              {"\n"}2. Clique no link de redefinição
              {"\n"}3. Crie uma nova senha segura
            </Typography>
          </Paper>

          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setIsEmailSent(false)
                setEmail("")
                setError("")
                setMessage("")
              }}
            >
              Enviar para outro email
            </Button>

            <Button
              component={RouterLink}
              to="/"
              variant="text"
              startIcon={<ArrowLeft size={20} />}
              fullWidth
            >
              Voltar ao início
            </Button>
          </Stack>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
      p={2}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
        noValidate
      >
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Mail size={28} />
          </Box>

          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Esqueci Minha Senha
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            maxWidth={320}
          >
            Digite seu email e enviaremos um link para redefinir sua senha
          </Typography>

          <TextField
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={isLoading}
            required
            autoComplete="email"
          />

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              height: 48,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" />
                Enviando...
              </>
            ) : (
              <>
                <Mail size={20} />
                Enviar
              </>
            )}
          </Button>

          <Button
            component={RouterLink}
            to="/"
            variant="text"
            startIcon={<ArrowLeft size={20} />}
            fullWidth
          >
            Voltar para o login
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
