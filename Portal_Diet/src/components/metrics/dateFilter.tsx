import { Card, CardContent, CardHeader, Box, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { Dayjs } from 'dayjs'

interface DateFilterCardProps {
  startDate: Dayjs | null
  endDate: Dayjs | null
  setStartDate: (date: Dayjs | null) => void
  setEndDate: (date: Dayjs | null) => void
}

export const DateFilterCard = ({ startDate, endDate, setStartDate, setEndDate }: DateFilterCardProps) => {
  return (
    <Card sx={{ minWidth: 250, maxWidth: 300, backgroundColor: '#f55bbc', color: '#fff' }}>
      <CardHeader
        title={
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
            Filtrar por data
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" gap={1} alignItems="center" justifyContent="center" mt={1}>
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={setStartDate}
              slotProps={{
                textField: {
                  size: 'small',
                  variant: 'standard',
                  sx: { width: 120, color: '#fff', '& .MuiInputBase-input': { color: '#fff' }, '& .MuiInputLabel-root': { color: '#fff' }, '& .MuiSvgIcon-root': { color: '#fff' } },
                },
              }}
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={setEndDate}
              slotProps={{
                textField: {
                  size: 'small',
                  variant: 'standard',
                  sx: { width: 120, color: '#fff', '& .MuiInputBase-input': { color: '#fff' }, '& .MuiInputLabel-root': { color: '#fff' }, '& .MuiSvgIcon-root': { color: '#fff' } },
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      </CardContent>
    </Card>
  )
}
