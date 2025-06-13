import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material"
export const StatCard = ({
  icon,
  label,
  value,
  sublabel,
  color,
  percent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sublabel:  React.ReactNode
  color: string
  percent: number
}) => (
  <Card
    sx={{
      background: color,
      color: "#fff",
      boxShadow: 6,
      transition: "0.3s",
      "&:hover": {
        boxShadow: 10,
      },
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            {icon}
            <Typography variant="subtitle2">{label}</Typography>
          </Box>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2">{sublabel}</Typography>
        </Box>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={percent}
            size={60}
            thickness={5}
            sx={{ color: "#fff", opacity: 0.6 }}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" color="inherit" fontWeight="bold">
              {Math.round(percent)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
)
