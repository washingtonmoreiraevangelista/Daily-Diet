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
  sublabel: React.ReactNode
  color: string
  percent: number
}) => (
  <Card
    sx={{
      background: color,
      color: "#fff",
      boxShadow: 6,
      transition: "0.3s",
      borderRadius: "50%",
      width: 190,
      height: 190,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 1,
      "&:hover": {
        boxShadow: 10,
      },
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 0,
        textAlign: "center",
        gap: 0.5,
        overflowWrap: "break-word",
      }}
    >
      <Box mb={0.5} sx={{ lineHeight: 1 }}>
        {icon}
      </Box>
      <Typography
        variant="subtitle2"
        fontSize="0.85rem"
        sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        fontSize="0.75rem"
        sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
      >
        {sublabel}
      </Typography>
      <Box position="relative" display="inline-flex" mt={0.5}>
        <CircularProgress
          variant="determinate"
          value={percent}
          size={40}
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
          <Typography variant="caption" color="inherit" fontWeight="bold" fontSize="0.7rem">
            {Math.round(percent)}%
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)
