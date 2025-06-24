import { Box, Typography } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { CalendarMonth } from "@mui/icons-material"
import type { Dayjs } from "dayjs"

interface DateFilterCardProps {
  startDate: Dayjs | null
  endDate: Dayjs | null
  setStartDate: (date: Dayjs | null) => void
  setEndDate: (date: Dayjs | null) => void
}

export const DateFilterCard = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateFilterCardProps) => {
  const color = "#6366F1" // mesma cor dos outros cards

  return (
    <Box
      sx={{
        bgcolor: `${color}22`,
        borderRadius: 2,
        px: 2,
        py: 1.5,
        width: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        boxShadow: `0 0 10px ${color}88`,
      }}
    >
      {/* Ícone centralizado */}
      <Box sx={{ color, mb: 0.5 }}>
        <CalendarMonth sx={{ fontSize: 36 }} />
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", fontWeight: "bold", mb: 0 }}
        noWrap
      >
        Filtro
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
            width: "100%",
          }}
        >
          <DatePicker
            label="Inicial"
            value={startDate}
            onChange={setStartDate}
            slotProps={{
              textField: {
                size: "small",
                variant: "standard",
                sx: {
                  width: 140,
                  "& .MuiInputBase-input": { fontSize: "0.9rem" },
                },
              },
            }}
          />

          <DatePicker
            label="Final"
            value={endDate}
            onChange={setEndDate}
            slotProps={{
              textField: {
                size: "small",
                variant: "standard",
                sx: {
                  width: 140,
                  "& .MuiInputBase-input": { fontSize: "0.9rem" },
                },
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </Box>
  )
}
