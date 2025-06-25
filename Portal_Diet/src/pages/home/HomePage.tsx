import { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { Meals } from '../../@types/diet'
import { FloatingAddButton } from '../../core/layout/floatingAddButton'
import { MealForm } from '../../components/forms/mealForms'
import { MealCard } from '../../components/cardsPage/mealCards'
import { mealsService } from '../../service/meals.service'
import { DashboardStats } from '../../components/metrics/dashBoardCard'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router'

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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [mealToEdit, setMealToEdit] = useState<Meals | null>(null)
  const [page, setPage] = useState(0)
  const navigate = useNavigate()

  // Busca todas as refeições (sem paginação)
  const fetchMeals = async () => {
    try {
      const response = await mealsService.getAllMeals(1, 9999)
      setMeals(response.meals)
    } catch (error) {
      console.error('Erro ao buscar refeições:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])


  const getMonday = (date: Date): Date => {
    const d = new Date(date)
    const day = d.getDay() === 0 ? 7 : d.getDay()
    d.setDate(d.getDate() - day + 1)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const getWeekDatesByPage = (pageNumber: number): Date[] => {
    const today = new Date()
    const monday = getMonday(today)
    const start = new Date(monday)
    start.setDate(monday.getDate() + pageNumber * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      return day
    })
  }


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
      isDiet: 'não',
      created_at: new Date(),
    })
  }

  const openEditModal = (meal: Meals) => {
    setMealToEdit(meal)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setMealToEdit(null)
  }

  const creatMeal = async () => {
    if (!newMeal.name || !newMeal.date || !newMeal.time) {
      alert('Preencha todos os campos obrigatórios!')
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

  const handleUpdateMeal = async (userId: string, userData: Meals) => {
    try {
      const { id, ...updatedMeal } = userData
      await mealsService.updateDiet(userId, updatedMeal)
      await fetchMeals()
      closeEditModal()
    } catch (error) {
      console.error('Erro ao atualizar a refeição:', error)
    }
  }

  const handleDeleteMeal = async (id: string) => {
    try {
      await mealsService.deleteDiet(id)
      await fetchMeals()
    } catch (error) {
      console.error('Erro ao deletar refeição:', error)
    }
  }

  const weekDates = useMemo(() => getWeekDatesByPage(page), [page])

  const weekDateKeys = useMemo(
    () => weekDates.map((d) => d.toISOString().split('T')[0]),
    [weekDates]
  )

  const mealsByDate = useMemo(() => {
    return meals.reduce<Record<string, Meals[]>>((acc, meal) => {
      const dateKey = new Date(meal.date).toISOString().split('T')[0]
      if (!weekDateKeys.includes(dateKey)) return acc
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(meal)
      return acc
    }, {})
  }, [meals, weekDateKeys])

  const goPrevPage = () => {
    setPage((p) => p - 1)
  }

  const goNextPage = () => {
    setPage(page + 1)
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdf4, #ccfbf1)', pb: 10 }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', pt: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: '#88c3b5',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Dieta Diária!
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={6}>
          Siga sua nutrição diária de forma inteligente
        </Typography>

        <FloatingAddButton onClick={() => setModalOpen(true)} />
        <Box mt={6}>
          <DashboardStats />
        </Box>
      </Container>

      {/* Accordion com refeições agrupadas por dia */}
      <Box sx={{ mt: 4, px: 2, maxWidth: '800px', mx: 'auto' }}>
        {weekDates.map((date) => {
          const iso = date.toISOString().split('T')[0]
          const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date)
          const formattedDate = new Intl.DateTimeFormat('pt-BR').format(date)
          const mealsOfDay = mealsByDate[iso] || []

          return (
            <Accordion
              key={iso}
              defaultExpanded
              sx={{
                background: '#ffffffaa',
                borderRadius: 2,
                mb: 2,
                boxShadow: 1,
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderBottom: '1px solid #e0e0e0', backgroundColor: 'transparent', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                  {`${weekday} - ${formattedDate}`}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 2 }}>
                {mealsOfDay.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma refeição neste dia.
                  </Typography>
                ) : (
                  mealsOfDay.map((meal) => (
                    <Box key={meal.id} mb={1}>
                      <MealCard meal={meal} onEdit={() => openEditModal(meal)} onDelete={() => handleDeleteMeal(meal.id!)} />
                    </Box>
                  ))
                )}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Box>

      {/* Navegação das semanas */}
      <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Button onClick={goPrevPage} disabled={page === 1} sx={{ minWidth: 'auto', p: 1 }}>
          <ArrowBackIosNewIcon />
        </Button>
        <Button onClick={goNextPage} sx={{ minWidth: 'auto', p: 1 }}>
          <ArrowForwardIosIcon />
        </Button>
      </Box>

      {/* Modal criação */}
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

      {/* Modal edição */}
      <Dialog open={editModalOpen} onClose={closeEditModal}>
        <DialogContent>
          {mealToEdit && (
            <MealForm
              newMeal={mealToEdit}
              onChange={(field, value) => setMealToEdit((prev) => (prev ? { ...prev, [field]: value } : null))}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal}>Cancelar</Button>
          <Button variant="contained" onClick={() => mealToEdit && handleUpdateMeal(mealToEdit.id!, mealToEdit)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
