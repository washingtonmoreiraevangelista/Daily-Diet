import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { LoginForm } from './login'
import { RegisterForm } from './registre'

export const LoginRegisterSplit = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [tab, setTab] = useState(0)

  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #eff6ff, #faf5ff)",
        position: "relative",
        p: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 60,
          left: 30,
          width: 90,
          height: 90,
          bgcolor: "#3b82f6",
          opacity: 0.15,
          filter: "blur(50px)",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 130,
          right: 60,
          width: 130,
          height: 130,
          bgcolor: "#8b5cf6",
          opacity: 0.15,
          filter: "blur(70px)",
          borderRadius: "50%",
        }}
      />
      <Card
        elevation={12}
        sx={{
          backdropFilter: "blur(10px)",
          bgcolor: "background.paper",
          maxWidth: 440,
          width: "100%",
          mx: "auto",
          px: 2,
          py: 0,
          zIndex: 10,
        }}
      >
        <CardHeader
          sx={{ textAlign: "center", pt: 2, pb: 1 }}
          title={
            <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    }}
                  />
                </Box>
              </Avatar>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Bem-vindo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tab === 0
                  ? "Faça login em sua conta"
                  : "Crie sua conta para começar"}
              </Typography>
            </Box>
          }
        />
        <CardContent sx={{ pt: 0, pb: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 1 }}
          >
            <Tab label="Entrar" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Cadastrar" icon={<PersonAddIcon />} iconPosition="start" />
          </Tabs>

          {tab === 0 && <LoginForm />}
          {tab === 1 && <RegisterForm />}
        </CardContent>
      </Card>
    </Box>
  )
}
