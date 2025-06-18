import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Avatar,
  IconButton,
  Typography,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import { Visibility, VisibilityOff, PhotoCamera } from '@mui/icons-material'
import { useNavigate, Link as RouterLink } from 'react-router'
import { authService } from '../../service/user.service'
import { ArrowLeft } from 'lucide-react'

export const ProfilePage = () => {
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const navigate = useNavigate()

  // Carrega os dados do perfil ao montar o componente
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        const response = await authService.getProfile()
        setUserData({
          userName: response.user.userName,
          email: response.user.email,
          password: ''
        })

        // Se existir foto de perfil, carrega a URL
        if (response.user.profilePicture) {
          const url = await authService.getProfilePictureUrl(response.user.profilePicture)
          setCurrentAvatarUrl(url)
        }
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error'
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Limpa o objeto URL quando o componente desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validações
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Tipo de arquivo não suportado. Use JPEG, PNG ou WEBP.',
          severity: 'error'
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Arquivo muito grande. Tamanho máximo: 5MB.',
          severity: 'error'
        })
        return
      }

      setProfilePic(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      // Atualiza dados básicos do perfil
      await authService.updateProfile({
        userName: userData.userName,
        email: userData.email,
        ...(userData.password && { password: userData.password })
      })

      // Se houver nova foto, faz upload
      if (profilePic) {
        const formData = new FormData()
        formData.append('file', profilePic)

        const uploadResponse = await authService.uploadProfilePicture(formData)

        // Atualiza a URL da foto
        if (uploadResponse.filename) {
          const newUrl = await authService.getProfilePictureUrl(uploadResponse.filename)
          setCurrentAvatarUrl(newUrl)
          setPreviewUrl(null) // Limpa o preview
        }
      }

      setSnackbar({
        open: true,
        message: 'Perfil atualizado com sucesso!',
        severity: 'success'
      })

      setTimeout(() => navigate('/homePage'), 1500)
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Meu Perfil
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Avatar
          src={previewUrl || currentAvatarUrl || undefined}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <input
          accept="image/jpeg, image/png, image/webp"
          id="profile-photo-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
          disabled={loading}
        />
        <label htmlFor="profile-photo-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<PhotoCamera />}
            disabled={loading}
          >
            Alterar Foto
          </Button>
        </label>
        <Typography variant="caption" color="text.secondary" mt={1}>
          Formatos: JPEG, PNG, WEBP (max. 5MB)
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Nome de Usuário"
        margin="normal"
        value={userData.userName}
        onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        type="email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Nova Senha (deixe em branco para manter a atual)"
        margin="normal"
        type={showPassword ? 'text' : 'password'}
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
      </Button>
      
      <Button
        component={RouterLink}
        to="/homePage"
        variant="text"
        startIcon={<ArrowLeft size={20} />}
        fullWidth
      >
        Voltar ao início
      </Button>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}