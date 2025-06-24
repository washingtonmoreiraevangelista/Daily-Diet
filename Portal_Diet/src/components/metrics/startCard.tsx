import { Box, Typography } from "@mui/material"
import type { ReactNode } from "react"

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  sublabel?: string
  color: string
  percent: number
}

export const StatCard = ({ icon, label, value, sublabel, color }: StatCardProps) => {
  return (
    <Box
      sx={{
        bgcolor: `${color}22`,
        borderRadius: 2,
        px: 2,
        py: 2,
        width: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        boxShadow: `0 0 10px ${color}88`,
      }}
    >
      <Box sx={{ color, mb: 0.5 }}>{icon}</Box>

      <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: "bold" }} noWrap>
        {label}
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: "bold" }} noWrap>
        {value}
      </Typography>

      {sublabel && (
        <Typography  sx={{
           color: "text.secondary", 
           textAlign: "center",
           fontSize: '12px',
           }}
            noWrap
            >
          {sublabel}
        </Typography>
      )}
    </Box>
  )
}
