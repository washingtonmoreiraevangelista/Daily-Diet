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
    <Card
      sx={{
        backgroundColor: '#f55bbc',
        color: '#fff',
        boxShadow: 6,
        transition: '0.3s',
        borderRadius: '50%',
        width: 190,
        height: 190,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        "&:hover": {
          boxShadow: 10,
        },
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: '#fff',
              textAlign: 'center',
              lineHeight: 1.2,
              mb: 0,
              userSelect: 'none',
            }}
          >
            Filtro

          </Typography>
        }
        sx={{ p: 0, mb: 1 }}
      />
      <CardContent sx={{ p: 0, width: '100%' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            alignItems="flex-end"
            sx={{ width: '90%' }}
          >
            <DatePicker
              label="Inicial"
              value={startDate}
              onChange={setStartDate}
              slotProps={{
                textField: {
                  size: 'small',
                  variant: 'standard',
                  sx: {
                    width: 120,
                    color: '#fff',
                    '& .MuiInputBase-input': { color: '#fff', fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { color: '#fff', fontSize: '0.75rem' },
                    '& .MuiSvgIcon-root': { color: '#fff' },
                    borderBottom: '1px solid #fff',
                    '& .MuiInput-root:before': { borderBottomColor: '#fff' },
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
                  size: 'small',
                  variant: 'standard',
                  sx: {
                    width: 120,
                    color: '#fff',
                    '& .MuiInputBase-input': { color: '#fff', fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { color: '#fff', fontSize: '0.75rem' },
                    '& .MuiSvgIcon-root': { color: '#fff' },
                    borderBottom: '1px solid #fff',
                    '& .MuiInput-root:before': { borderBottomColor: '#fff' },
                  },
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      </CardContent>
    </Card>
  )
}
