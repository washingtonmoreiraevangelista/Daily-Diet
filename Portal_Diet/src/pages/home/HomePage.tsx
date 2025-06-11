import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Container,
  Pagination,
} from '@mui/material'
import type { Meals } from '../../@types/diet'
import { FloatingAddButton } from '../../core/layout/floatingAddButton'
import { MealForm } from '../../components/forms/mealForms'
import { MealCard } from '../../components/cardsPage/mealCards'
import { mealsService } from '../../service/meals.service'
export const HomePage = () => {
  const [meals, setMeals] = useState<Meals[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [newMeal, setNewMeal] = useState<Meals>({
    name: '',
    description: '',
    date: '',
    time: '',
    isDiet: 'não',
    created_at: new Date(),
  })

  const [page, setPage] = useState(1)
  const [limit] = useState(7)
  const [total, setTotal] = useState(0)


  const creatMeal = async () => {

    if (!newMeal.name || !newMeal.date || !newMeal.time) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    try {
      await mealsService.createDiet(newMeal)
      await fetchMeals()
      resetFormAndClose()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchMeals = async () => {
    try {
      const response = await mealsService.getAllMeals(page, limit)
      setMeals(response.meals)
      setTotal(response.total)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMeals()
  }, [page])

  const handleChange = (field: keyof Meals, value: string | boolean) => {
    const convertedValue =
      field === 'isDiet'
        ? value === true
          ? 'sim'
          : 'não'
        : value

    setNewMeal((prev) => ({ ...prev, [field]: convertedValue }))
  }


  const resetFormAndClose = () => {
    setModalOpen(false)
    setNewMeal({
      name: '',
      description: '',
      date: '',
      time: '',
      isDiet: '',
      created_at: new Date(),
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

        <Box
          mt={3}
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={3}
          width="100%"
          px={2}
        >
          {meals?.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Nenhuma refeição adicionada ainda.
            </Typography>
          ) : (
            meals?.map((meal) => (
              <Box
                key={meal.id}
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

        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>

        {/* <Typography sx={{ alignSelf: 'center' }}>Página {page} de {Math.ceil(total / limit)}</Typography> */}

        {/* Modal de Nova Refeição */}
        <Dialog open={modalOpen} onClose={resetFormAndClose} fullWidth maxWidth="sm">
          <DialogContent>
            <MealForm newMeal={newMeal} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={resetFormAndClose}>Cancelar</Button>
            <Button variant="contained" onClick={creatMeal}>
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}
