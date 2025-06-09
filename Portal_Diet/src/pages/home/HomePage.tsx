import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
  CardActions,
} from '@mui/material'
import type { Meals } from '../../@types/diet'
import { FloatingAddButton } from '../../core/layout/floatingAddButton'
import { MealForm } from '../../components/forms/mealForms'
import { MealCard } from '../../components/cardsPage/mealCards'

export const HomePage = () => {
  const [meals, setMeals] = useState<Meals[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [newMeal, setNewMeal] = useState<Meals>({
    name: '',
    description: '',
    date: '',
    time: '',
    is_diet: false,
  })

  const handleChange = (field: keyof Meals, value: string | boolean) => {
    setNewMeal(prev => ({ ...prev, [field]: value }))
  }

  const handleAddMeal = () => {
    if (!newMeal.name) {
      alert('Nome da refeição obrigatório')
      return
    }
    setMeals(prev => [...prev, { ...newMeal }])
    resetFormAndClose()
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
          {meals.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Nenhuma refeição adicionada ainda.
            </Typography>
          ) : (
            meals.map((meal, idx) => (
              <Box
                key={idx}
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
