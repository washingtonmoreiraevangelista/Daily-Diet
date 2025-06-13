import { Box, Typography } from '@mui/material'
import { StatCard } from './startCard'
import { useEffect, useState } from 'react'
import type { MetricsData } from '../../@types'
import { FitnessCenter, LocalFireDepartment, Opacity, TrackChanges } from '@mui/icons-material'
import { mealsService } from '../../service/meals.service'
import type { Dayjs } from 'dayjs'
import { DateFilterCard } from './dateFilter'
import { ImcCard } from './imcCard'



export const DashboardStats = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)

  const fetchMetrics = async () => {
    try {
      const queryParams =
        startDate && endDate
          ? `?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`
          : ''

      const response = await mealsService.metricsDiet(queryParams)
      setMetrics(response)
    } catch (error) {
      console.error('Erro ao buscar as métricas da dieta:', error)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [startDate, endDate])

  if (!metrics) return <Typography>Carregando métricas...</Typography>

  return (
    <Box>
      <Typography variant="h4" color="text.secondary" mb={4}>
        Resumo da Dieta
      </Typography>


      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(211px, 1fr))" gap={1}>
        <DateFilterCard
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Box display="flex" gap={2}>
          <ImcCard />
        </Box>

        <StatCard
          icon={<LocalFireDepartment sx={{ fontSize: 60 }} />}
          label="Refeições totais"
          value={`${metrics.totalMeals}`}
          sublabel={`Sequência: ${metrics.bestDietSequence} dias`}
          color="#10B981"
          percent={metrics.percentWithinDiet}
        />
        <StatCard
          icon={<FitnessCenter sx={{ fontSize: 60 }} />}
          label="Dentro da dieta"
          value={`${metrics.withinDiet}`}
          sublabel={`${metrics.percentWithinDiet.toFixed(1)}%`}
          color="#3B82F6"
          percent={metrics.percentWithinDiet}
        />
        <StatCard
          icon={<TrackChanges sx={{ fontSize: 60 }} />}
          label="Fora da dieta"
          value={`${metrics.outDiet}`}
          sublabel={`${metrics.percentOutDiet.toFixed(1)}%`}
          color="#F97316"
          percent={metrics.percentOutDiet}
        />
        <StatCard
          icon={<Opacity sx={{ fontSize: 60 }} />}
          label="Melhor sequência"
          value={`${metrics.bestDietSequence} dias`}
          sublabel={
            metrics.bestSequenceDates
              ? `${metrics.bestSequenceDates.startDate} → ${metrics.bestSequenceDates.endDate}`
              : 'Nenhuma sequência'
          }
          color="#8B5CF6"
          percent={(metrics.bestDietSequence / metrics.totalMeals) * 100}
        />

      </Box>
    </Box>
  )
}
