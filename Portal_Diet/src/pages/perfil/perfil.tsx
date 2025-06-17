import {
  Box, Button, TextField, Avatar, IconButton,
  Typography, InputAdornment, CircularProgress, Snackbar, Alert
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Visibility, VisibilityOff, PhotoCamera } from '@mui/icons-material'
import { authService } from '../../service/user.service'
import { useNavigate } from 'react-router'

export const ProfilePage = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })
  const navigate = useNavigate()

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile()
      const { user } = response
      setUserName(user.userName)
      setEmail(user.email)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePic(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setLoading(true)

    const updateData: { userName?: string; email?: string; password?: string } = {
      userName,
      email,
    }
    if (password) updateData.password = password

    try {
      await authService.updateProfile(updateData)

      setSnackbar({
        open: true,
        message: 'Perfil atualizado com sucesso!',
        severity: 'success'
      })

      setTimeout(() => {
        navigate('/homePage')
      }, 1500)

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar perfil',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" mb={3} textAlign="center">Meu Perfil</Typography>

        <Box textAlign="center" mb={3}>
          <Avatar
            src={previewUrl || undefined}
            sx={{ width: 100, height: 100, margin: '0 auto' }}
          />
          <input
            accept="image/*"
            type="file"
            id="upload-photo"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <label htmlFor="upload-photo">
            <IconButton component="span" color="primary">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        <TextField
          fullWidth
          label="Usuário"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>
  )
}
