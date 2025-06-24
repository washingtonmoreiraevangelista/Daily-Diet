import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Box, Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router"
import LogoutIcon from "@mui/icons-material/Logout"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/", { replace: true })
  }

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bem Vindo  !
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/imc")}
            sx={{
              mr: 2,
              borderBottom: "2px solid white",
              borderRadius: 0,
              pb: 0.5,
            }}
          >
            IMC
          </Button>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate("/Profile")}>Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ marginRight: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: "64px" }}>
      </Box>
    </Box>
  )
}
