// import { useState } from "react"
// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Tabs,
//   Tab,
//   Typography,
//   Avatar,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material"
// import PersonIcon from "@mui/icons-material/Person"
// import PersonAddIcon from "@mui/icons-material/PersonAdd"
// import { LoginForm } from './login'
// import { RegisterForm } from './registre'

// export const LoginRegisterSplit = () => {
//   const theme = useTheme()

//   const isMobile = useMediaQuery(theme.breakpoints.down('md'))
//   const [tab, setTab] = useState(0)

//   return (
//     <Box
//       sx={{
//         width: "100vw",
//         height: "100vh",
//         overflowX: "hidden",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         background: "linear-gradient(-45deg, #3b82f6, #8b5cf6,rgb(152, 123, 231),rgb(22, 203, 249))",
//         backgroundSize: "400% 400%",
//         animation: "gradientMove 15s ease infinite",
//         "@keyframes gradientMove": {
//           "0%": { backgroundPosition: "0% 50%" },
//           "50%": { backgroundPosition: "100% 50%" },
//           "100%": { backgroundPosition: "0% 50%" },
//         },
//       }}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: 60,
//           left: 30,
//           width: 90,
//           height: 90,
//           bgcolor: "#3b82f6",
//           opacity: 0.15,
//           filter: "blur(50px)",
//           borderRadius: "50%",
//         }}
//       />
//       <Box
//         sx={{
//           position: "absolute",
//           top: 130,
//           right: 60,
//           width: 130,
//           height: 130,
//           bgcolor: "#8b5cf6",
//           opacity: 0.15,
//           filter: "blur(70px)",
//           borderRadius: "50%",
//         }}
//       />
//       <Card
//         elevation={12}
//         sx={{
//           backdropFilter: "blur(10px)",
//           bgcolor: "rgba(255, 255, 255, 0.75)",
//           maxWidth: 440,
//           width: "100%",
//           mx: "auto",
//           px: 2,
//           py: 0,
//           zIndex: 10,
//         }}
//       >
//         <CardHeader
//           sx={{ textAlign: "center", pt: 2, pb: 1 }}
//           title={
//             <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
//               <Avatar
//                 sx={{
//                   width: 56,
//                   height: 56,
//                   background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 28,
//                     height: 28,
//                     bgcolor: "white",
//                     borderRadius: "50%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 14,
//                       height: 14,
//                       borderRadius: "50%",
//                       background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
//                     }}
//                   />
//                 </Box>
//               </Avatar>
//               <Typography
//                 variant="h6"
//                 fontWeight="bold"
//                 sx={{
//                   background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
//                   WebkitBackgroundClip: "text",
//                   color: "transparent",
//                 }}
//               >
//                 Bem-vindo
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {tab === 0
//                   ? "Faça login em sua conta"
//                   : "Crie sua conta para começar"}
//               </Typography>
//             </Box>
//           }
//         />
//         <CardContent sx={{ pt: 0, pb: 2 }}>
//           <Tabs
//             value={tab}
//             onChange={(_, newValue) => setTab(newValue)}
//             variant="fullWidth"
//             textColor="primary"
//             indicatorColor="primary"
//             sx={{ mb: 1 }}
//           >
//             <Tab label="Entrar" icon={<PersonIcon />} iconPosition="start" />
//             <Tab label="Cadastrar" icon={<PersonAddIcon />} iconPosition="start" />
//           </Tabs>

//           {tab === 0 && <LoginForm />}
//           {tab === 1 && <RegisterForm />}
//         </CardContent>
//       </Card>
//     </Box>
//   )
// }
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
        width: "100vw",
        height: "100vh",
        overflowX: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background: "linear-gradient(-45deg, #2f855a, #68d391, #a0e8af, #d1fae5)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 15s ease infinite",
        "@keyframes gradientMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* Bolhas animadas */}
      {[...Array(7)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: `${40 + i * 10}px`,
            height: `${40 + i * 10}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            filter: 'blur(30px)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float${i} ${10 + i}s ease-in-out infinite`,
            "@keyframes": {
              [`float${i}`]: {
                "0%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-40px)" },
                "100%": { transform: "translateY(0px)" },
              },
            },
            zIndex: 0,
          }}
        />
      ))}

      <Card
        elevation={12}
        sx={{
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(255, 255, 255, 0.75)",
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
                  background: "linear-gradient(90deg, #2f855a, #68d391)",
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
                      background: "linear-gradient(90deg, #2f855a, #68d391)",
                    }}
                  />
                </Box>
              </Avatar>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(to right, #2f855a, #68d391)",
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
