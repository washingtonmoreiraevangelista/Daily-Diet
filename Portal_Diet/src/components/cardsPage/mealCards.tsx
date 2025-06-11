import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material'
import { Coffee, Sun, Moon, Cookie } from 'lucide-react'
import type { Meals } from '../../@types/diet'
import UpdateIcon from '@mui/icons-material/Update'

type MealCardProps = {
  meal: Meals
  onEdit: () => void
}

export const MealCard = ({ meal, onEdit }: MealCardProps) => {
  const mealIcons = {
    'Café da Manhã': Coffee,
    'Almoço': Sun,
    'Café da Tarde': Cookie,
    'Lanche': Cookie,
    'Jantar': Moon,
  }
  const IconComponent = mealIcons[meal.name as keyof typeof mealIcons] || Coffee

  return (
    <Card
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconComponent size={20} color="#059669" />
            <Typography variant="h6" color="text.primary">
              {meal.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={meal.isDiet === 'sim' ? 'Dentro da dieta' : 'Fora da dieta'}
              color={meal.isDiet === 'sim' ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {meal.description}
        </Typography>

        <Typography variant="caption" color="text.disabled">
          {meal.date} às {meal.time}
        </Typography>
      </CardContent>
      <Button variant="outlined" size="small" onClick={onEdit}>
        <UpdateIcon />
      </Button>
    </Card>
  )
}