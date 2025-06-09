// src/components/forms/MealForm.tsx
import {
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  FormLabel,
} from '@mui/material'
import type { Meals } from '../../@types/diet'

type Props = {
  newMeal: Meals
  onChange: (field: keyof Meals, value: string | boolean) => void
}

export const MealForm = ({ newMeal, onChange }: Props) => {
  return (
    <Box p={2}>
      <Stack spacing={2}>
        <FormLabel>Tipo de refeição</FormLabel>
        <RadioGroup
          value={newMeal.name}
          onChange={e => onChange('name', e.target.value)}
          row
        >
          <FormControlLabel value="Café da Manhã" control={<Radio />} label="Café da Manhã" />
          <FormControlLabel value="Almoço" control={<Radio />} label="Almoço" />
          <FormControlLabel value="Café da Tarde" control={<Radio />} label="Café da Tarde" />
          <FormControlLabel value="Lanche" control={<Radio />} label="Lanche" />
          <FormControlLabel value="Jantar" control={<Radio />} label="Jantar" />
        </RadioGroup>

        <TextField
          label="Descrição"
          value={newMeal.description}
          onChange={e => onChange('description', e.target.value)}
          fullWidth
          multiline
          rows={2}
        />

        <TextField
          label="Data"
          type="date"
          value={newMeal.date}
          onChange={e => onChange('date', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Hora"
          type="time"
          value={newMeal.time}
          onChange={e => onChange('time', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={newMeal.is_diet}
              onChange={e => onChange('is_diet', e.target.checked)}
            />
          }
          label="Dentro da dieta"
        />
      </Stack>
    </Box>
  )
}
