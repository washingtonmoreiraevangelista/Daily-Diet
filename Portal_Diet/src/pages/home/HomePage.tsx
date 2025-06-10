import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Container,
} from '@mui/material'
import type { Meals } from '../../@types/diet'
import { FloatingAddButton } from '../../core/layout/floatingAddButton'
import { MealForm } from '../../components/forms/mealForms'
import { MealCard } from '../../components/cardsPage/mealCards'
import { mealsService } from '../../service/meals.service'
export const HomePage = () => {
  const [meals, setMeals] = useState<Meals[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newMeal, setNewMeal] = useState<Meals>({
    name: '',
    description: '',
    date: '',
    time: '',
    is_diet: false,
  })

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealsFromApi = await mealsService.getAllMeals()
        setMeals(mealsFromApi)
      } catch (error) {
        alert('Erro ao buscar as refeições.')
        console.error(error)
      }
    }
    fetchMeals()
  }, [])

  const handleAddMeal = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await mealsService.createDiet(newMeal)
      setMeals((prev) => [...(prev || []), response])

      resetFormAndClose()
    } catch (error) {
      alert('Erro ao adicionar a refeição, tente novamente.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof Meals, value: string | boolean) => {
    setNewMeal(prev => ({ ...prev, [field]: value }))
  }

  const resetFormAndClose = () => {
    setModalOpen(false)
    setNewMeal({
      name: '',
      description: '',
      date: '',
      time: '',
      is_diet: false,
    })
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'linear-gradient(to bottom, #f0fdf4, #ccfbf1)',
          pb: 10,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', pt: 6 }}>
          {/* Header */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #059669, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Dieta Diária !
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={6}>
            Siga sua nutrição diária de forma inteligente
          </Typography>

          <FloatingAddButton onClick={() => setModalOpen(true)} />
        </Container>

        {/* Cards Centralizados */}
        <Box
          mt={3}
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={3}
          width="100%"
          px={2}
        >
          {!Array.isArray(meals) || meals.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Nenhuma refeição adicionada ainda.
            </Typography>
          ) : (
            meals.map((meal, idx) => (
              <Box
                key={meal.id ?? idx} // preferir id único
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 48%',
                    md: '1 1 31%',
                  },
                  maxWidth: '360px',
                }}
              >
                <MealCard meal={meal} />
              </Box>
            ))
          )}
        </Box>


        {/* Modal de Nova Refeição */}
        <Dialog open={modalOpen} onClose={resetFormAndClose} fullWidth maxWidth="sm">
          <DialogContent>
            <MealForm newMeal={newMeal} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={resetFormAndClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleAddMeal}>
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}
