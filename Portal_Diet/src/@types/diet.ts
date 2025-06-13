export interface Meals {
  id?: string
  name: string
  user_id?: string
  description: string
  date: string
  time: string
  isDiet: string
  created_at: Date
}


export interface MetricsData {
  totalMeals: number
  withinDiet: number
  outDiet: number
  percentWithinDiet: number
  percentOutDiet: number
  bestDietSequence: number
  bestSequenceDates: {
    startDate: string
    endDate: string
  } | null
}
